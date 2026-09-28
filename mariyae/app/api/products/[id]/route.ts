import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { uploadImageFromUrl, getCloudinaryFolder } from '@/lib/cloudinary'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const product = await Product.findById(id)
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: product
    })
    
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    
    const formData = await request.formData()
    
    // Extract text fields
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const keyFeatures = (formData.get('keyFeatures') as string).split(',').map(f => f.trim()).filter(f => f)
    const price = parseFloat(formData.get('price') as string)
    const originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : undefined
    const sizeConstraints = formData.get('sizeConstraints') as string
    const quantity = parseInt(formData.get('quantity') as string)
    const category = formData.get('category') as string
    const mainCategory = formData.get('mainCategory') as string | null
    const subCategory = formData.get('subCategory') as string | null
    const imageUrlsRaw = formData.get('imageUrls') as string | null
    const imageUrls = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : []
    
    // Validate required fields
    if (!name || !description || !keyFeatures.length || !price || !quantity || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Handle new image uploads
    const newImageFiles = formData.getAll('newImages') as File[]
    const uploadedImages = []
    
    for (const imageFile of newImageFiles) {
      if (imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        const { uploadToCloudinary } = await import('@/lib/cloudinary')
        const folder = getCloudinaryFolder('products')
        const result = await uploadToCloudinary(buffer, folder, 'image')
        uploadedImages.push(result)
      }
    }

    // Handle image URLs - fetch and upload to Cloudinary
    if (imageUrls && imageUrls.length > 0) {
      const folder = getCloudinaryFolder('products')
      for (const imageUrl of imageUrls) {
        if (imageUrl && imageUrl.trim() !== '') {
          try {
            const result = await uploadImageFromUrl(imageUrl.trim(), folder)
            uploadedImages.push(result)
          } catch (error) {
            console.error(`Failed to upload image from URL ${imageUrl}:`, error)
            // Continue with other URLs even if one fails
          }
        }
      }
    }
    
    // Handle new video uploads
    const newVideoFiles = formData.getAll('newVideos') as File[]
    const uploadedVideos = []
    
    for (const videoFile of newVideoFiles) {
      if (videoFile.size > 0) {
        const bytes = await videoFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        const { uploadToCloudinary, getCloudinaryFolder } = await import('@/lib/cloudinary')
        const folder = getCloudinaryFolder('products')
        const result = await uploadToCloudinary(buffer, folder, 'video')
        uploadedVideos.push(result)
      }
    }
    
    // Handle deletions
    const imagesToDelete = formData.get('imagesToDelete') ? JSON.parse(formData.get('imagesToDelete') as string) : []
    const videosToDelete = formData.get('videosToDelete') ? JSON.parse(formData.get('videosToDelete') as string) : []
    
    // Delete files from Cloudinary
    if (imagesToDelete.length > 0 || videosToDelete.length > 0) {
      const { deleteFromCloudinary } = await import('@/lib/cloudinary')
      
      for (const publicId of imagesToDelete) {
        await deleteFromCloudinary(publicId, 'image')
      }
      
      for (const publicId of videosToDelete) {
        await deleteFromCloudinary(publicId, 'video')
      }
    }
    
    // Get existing product to merge with new data
    const existingProduct = await Product.findById(id)
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Merge existing images/videos with new ones, excluding deleted ones
    const existingImages = existingProduct.images.filter((img: any) => !imagesToDelete.includes(img.publicId))
    const existingVideos = existingProduct.videos.filter((vid: any) => !videosToDelete.includes(vid.publicId))
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        keyFeatures,
        price,
        originalPrice,
        sizeConstraints: sizeConstraints || undefined,
        quantity,
        category,
        mainCategory: mainCategory || undefined,
        subCategory: subCategory || undefined,
        images: [...existingImages, ...uploadedImages],
        videos: [...existingVideos, ...uploadedVideos]
      },
      { new: true, runValidators: true }
    )
    
    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const product = await Product.findById(id)
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Delete all images and videos from Cloudinary
    const { deleteFromCloudinary } = await import('@/lib/cloudinary')
    
    for (const image of product.images) {
      await deleteFromCloudinary(image.publicId, 'image')
    }
    
    for (const video of product.videos) {
      await deleteFromCloudinary(video.publicId, 'video')
    }
    
    // Delete the product from MongoDB
    await Product.findByIdAndDelete(id)
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

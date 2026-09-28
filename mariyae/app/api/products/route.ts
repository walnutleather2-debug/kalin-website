import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { uploadToCloudinary, getCloudinaryFolder, uploadImageFromUrl } from '@/lib/cloudinary'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 0
    const category = searchParams.get('category')
    const subCategory = searchParams.get('subCategory')
    const isNew = searchParams.get('isNew') === 'true'
    const isOnSale = searchParams.get('isOnSale') === 'true'
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : 0
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : 1000000
    const sortBy = searchParams.get('sortBy') || 'newest'

    const filter: any = { isActive: { $ne: false } }

    if (category) filter.category = category
    if (subCategory) filter.subCategory = subCategory
    if (isNew) filter.isNew = true
    if (isOnSale) filter.isOnSale = true
    if (minPrice > 0 || maxPrice < 1000000) {
      filter.price = { $gte: minPrice, $lte: maxPrice }
    }

    let sortOption: any = { createdAt: -1 }
    if (sortBy === 'price-low') sortOption = { price: 1 }
    else if (sortBy === 'price-high') sortOption = { price: -1 }
    else if (sortBy === 'rating') sortOption = { rating: -1 }

    const query = Product.find(filter)
      .select('name price originalPrice offerPercentage isOnSale images category subCategory isNew rating reviews')
      .sort(sortOption)

    if (limit > 0) {
      query.limit(limit)
    }

    const products = await query

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Check content type to distinguish between JSON (client-side upload) and FormData (legacy/server-side)
    const contentType = request.headers.get('content-type') || ''

    let name, description, keyFeatures, price, originalPrice, sizeConstraints, quantity, category, mainCategory, subCategory, imageUrls
    let uploadedImages: Array<{ url: string, publicId: string }> = []
    let uploadedVideos: Array<{ url: string, publicId: string }> = []

    if (contentType.includes('application/json')) {
      // Handle JSON payload (New Client-Side Upload Flow)
      const body = await request.json()

      name = body.name
      description = body.description
      keyFeatures = body.keyFeatures
      price = typeof body.price === 'string' ? parseFloat(body.price) : body.price
      originalPrice = body.originalPrice ? (typeof body.originalPrice === 'string' ? parseFloat(body.originalPrice) : body.originalPrice) : undefined
      sizeConstraints = body.sizeConstraints
      quantity = typeof body.quantity === 'string' ? parseInt(body.quantity) : body.quantity
      category = body.category
      mainCategory = body.mainCategory
      subCategory = body.subCategory
      imageUrls = body.imageUrls // URLs to be fetched/uploaded

      // Pre-uploaded images/videos from client
      uploadedImages = body.images || []
      uploadedVideos = body.videos || []

    } else {
      // Handle FormData (Legacy/Fallback Flow - limits apply)
      const formData = await request.formData()

      name = formData.get('name') as string
      description = formData.get('description') as string
      const keyFeaturesRaw = formData.get('keyFeatures') as string
      keyFeatures = keyFeaturesRaw ? keyFeaturesRaw.split(',').map(f => f.trim()).filter(f => f) : []
      price = parseFloat(formData.get('price') as string)
      originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : undefined
      sizeConstraints = formData.get('sizeConstraints') as string
      quantity = parseInt(formData.get('quantity') as string)
      category = formData.get('category') as string
      mainCategory = formData.get('mainCategory') as string | null
      subCategory = formData.get('subCategory') as string | null
      const imageUrlsRaw = formData.get('imageUrls') as string | null
      imageUrls = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : []

      // Handle file uploads (Server-side)
      const imageFiles = formData.getAll('images') as File[]
      for (const imageFile of imageFiles) {
        if (imageFile.size > 0) {
          const bytes = await imageFile.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const folder = getCloudinaryFolder('products')
          const result = await uploadToCloudinary(buffer, folder, 'image')
          uploadedImages.push(result)
        }
      }

      const videoFiles = formData.getAll('videos') as File[]
      for (const videoFile of videoFiles) {
        if (videoFile.size > 0) {
          const bytes = await videoFile.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const folder = getCloudinaryFolder('products')
          const result = await uploadToCloudinary(buffer, folder, 'video')
          uploadedVideos.push(result)
        }
      }
    }

    // Determine final category preference: sub -> main -> fallback category
    const categoryFinal = (subCategory && subCategory.trim()) || (mainCategory && mainCategory.trim()) || (category && category.trim()) || ''

    // Validate required fields
    if (!name || !description || !keyFeatures?.length || price === undefined || quantity === undefined || !categoryFinal) {
      // ... validation error logic (simplified for brevity, can copy existing)
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Handle image URLs (fetch and upload to Cloudinary if they are raw URLs)
    // Note: If using client-side upload, these are usually pre-processed or sent as string URLs
    if (imageUrls && imageUrls.length > 0) {
      const folder = getCloudinaryFolder('products')
      for (const imageUrl of imageUrls) {
        if (imageUrl && imageUrl.trim() !== '') {
          try {
            const result = await uploadImageFromUrl(imageUrl.trim(), folder)
            uploadedImages.push(result)
          } catch (error) {
            console.error(`Failed to upload image from URL ${imageUrl}:`, error)
          }
        }
      }
    }

    // Create product
    const product = new Product({
      name,
      description,
      keyFeatures,
      price,
      originalPrice,
      sizeConstraints: sizeConstraints || undefined,
      quantity,
      category: categoryFinal,
      mainCategory: mainCategory || undefined,
      subCategory: subCategory || undefined,
      images: uploadedImages,
      videos: uploadedVideos
    })

    await product.save()

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

export const uploadToCloudinary = async (file: Buffer, folder: string, resourceType: 'image' | 'video' = 'image') => {
  try {
    console.log('Starting Cloudinary upload...')
    console.log('Cloud name:', cloudinary.config().cloud_name)
    console.log('API key:', cloudinary.config().api_key ? 'Present' : 'Missing')

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: resourceType,
          allowed_formats: resourceType === 'image'
            ? ['jpg', 'jpeg', 'png', 'webp']
            : ['mp4', 'mov', 'avi', 'mkv'],
          transformation: resourceType === 'image' ? [
            { width: 1920, height: 1080, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ] : undefined,
          secure: true, // Ensure HTTPS URLs
          use_filename: true,
          unique_filename: true
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload stream error:', error)
            reject(error)
          } else {
            console.log('Cloudinary upload successful:', result?.public_id)
            console.log('Generated URL:', result?.secure_url)
            resolve(result)
          }
        }
      )

      uploadStream.end(file)
    })

    return {
      url: (result as any).secure_url,
      publicId: (result as any).public_id
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload file to Cloudinary')
  }
}

export const deleteFromCloudinary = async (publicId: string, resourceType: 'image' | 'video' = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete file from Cloudinary')
  }
}

// Helper function to get organized folder structure
export const getCloudinaryFolder = (type: 'products' | 'banners' | 'thumbnails' | 'categories' | 'handpicked', category?: string) => {
  if (type === 'categories' && category) {
    return `kalin/categories/${category.toLowerCase()}`
  }
  return `kalin/${type}`
}

// Enhanced upload function with better error handling and progress tracking
export const uploadMultipleFiles = async (
  files: File[],
  folder: string,
  resourceType: 'image' | 'video' = 'image'
) => {
  const uploadPromises = files.map(async (file) => {
    if (file.size === 0) return null

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return await uploadToCloudinary(buffer, folder, resourceType)
  })

  const results = await Promise.all(uploadPromises)
  return results.filter(result => result !== null)
}

// Delete multiple files from Cloudinary
export const deleteMultipleFiles = async (
  publicIds: string[],
  resourceType: 'image' | 'video' = 'image'
) => {
  const deletePromises = publicIds.map(publicId =>
    deleteFromCloudinary(publicId, resourceType)
  )

  await Promise.all(deletePromises)
}

// Upload image from URL to Cloudinary
export const uploadImageFromUrl = async (imageUrl: string, folder: string) => {
  try {
    console.log('Uploading image from URL:', imageUrl)

    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: `kalin/${folder}`,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      secure: true,
      use_filename: true,
      unique_filename: true
    })

    return {
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error) {
    console.error('Error uploading image from URL:', error)
    throw new Error(`Failed to upload image from URL: ${imageUrl}`)
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Use hardcoded values as per existing configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { folder, resource_type, ...params } = body

    const timestamp = Math.round((new Date).getTime() / 1000)

    // Filter out undefined values and ensure strict types
    const paramsToSign: Record<string, any> = {
      timestamp: timestamp,
      folder: folder || 'kalin/products',
      ...params
    }

    const signature = cloudinary.utils.api_sign_request(paramsToSign, cloudinary.config().api_secret!)

    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      apiKey: cloudinary.config().api_key,
      cloudName: cloudinary.config().cloud_name,
      folder: folder || 'kalin/products'
    })
  } catch (error) {
    console.error('Error generating signature:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate signature', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

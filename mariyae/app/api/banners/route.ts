import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Banner from '@/lib/models/Banner'
import { uploadToCloudinary, getCloudinaryFolder, uploadImageFromUrl } from '@/lib/cloudinary'

// GET all banners
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const banners = await Banner.find({}).sort({ order: 1 })

    return NextResponse.json({
      success: true,
      banners
    })
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    )
  }
}

// POST create new banner
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const contentType = request.headers.get('content-type') || ''

    let order, eyebrowText, headline, description, button1Text, button1Link, button2Text, button2Link, layoutType
    let backgroundImage = ''
    let decorativeImage = ''

    if (contentType.includes('application/json')) {
      const body = await request.json()
      order = body.order
      eyebrowText = body.eyebrowText
      headline = body.headline
      description = body.description
      button1Text = body.button1Text
      button1Link = body.button1Link
      button2Text = body.button2Text
      button2Link = body.button2Link
      layoutType = body.layoutType
      backgroundImage = body.backgroundImage
      decorativeImage = body.decorativeImage
    } else {
      const formData = await request.formData()

      order = parseInt(formData.get('order') as string) || 0
      eyebrowText = formData.get('eyebrowText') as string || ''
      headline = formData.get('headline') as string || ''
      description = formData.get('description') as string || ''
      button1Text = formData.get('button1Text') as string || ''
      button1Link = formData.get('button1Link') as string || ''
      button2Text = formData.get('button2Text') as string || ''
      button2Link = formData.get('button2Link') as string || ''
      layoutType = formData.get('layoutType') as string || 'normal'

      // Handle background image (Server-side upload)
      const backgroundImageFile = formData.get('backgroundImage') as File | null
      const backgroundImageUrl = formData.get('backgroundImageUrl') as string | null

      if (backgroundImageFile && backgroundImageFile.size > 0) {
        const bytes = await backgroundImageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const folder = getCloudinaryFolder('banners')
        const result = await uploadToCloudinary(buffer, folder, 'image')
        backgroundImage = result.url
      } else if (backgroundImageUrl && backgroundImageUrl.trim() !== '') {
        try {
          const folder = getCloudinaryFolder('banners')
          const result = await uploadImageFromUrl(backgroundImageUrl.trim(), folder)
          backgroundImage = result.url
        } catch (error) {
          console.error('Failed to upload background image from URL:', error)
          backgroundImage = backgroundImageUrl.trim()
        }
      }

      // Handle decorative image (Server-side upload)
      const decorativeImageFile = formData.get('decorativeImage') as File | null
      const decorativeImageUrl = formData.get('decorativeImageUrl') as string | null

      if (decorativeImageFile && decorativeImageFile.size > 0) {
        const bytes = await decorativeImageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const folder = getCloudinaryFolder('banners')
        const result = await uploadToCloudinary(buffer, folder, 'image')
        decorativeImage = result.url
      } else if (decorativeImageUrl && decorativeImageUrl.trim() !== '') {
        try {
          const folder = getCloudinaryFolder('banners')
          const result = await uploadImageFromUrl(decorativeImageUrl.trim(), folder)
          decorativeImage = result.url
        } catch (error) {
          console.error('Failed to upload decorative image from URL:', error)
          decorativeImage = decorativeImageUrl.trim()
        }
      }
    }

    if (!backgroundImage) {
      return NextResponse.json(
        { success: false, error: 'Background image is required' },
        { status: 400 }
      )
    }

    const newBanner = new Banner({
      order,
      eyebrowText: eyebrowText || '',
      headline: headline || '',
      description: description || '',
      button1Text: button1Text || '',
      button1Link: button1Link || '',
      button2Text: button2Text || '',
      button2Link: button2Link || '',
      layoutType,
      backgroundImage,
      decorativeImage: decorativeImage || '',
      isActive: true
    })

    console.log('Attempting to save banner:', JSON.stringify(newBanner, null, 2))
    await newBanner.save()
    console.log('Banner saved successfully')

    return NextResponse.json({
      success: true,
      banner: newBanner
    })
  } catch (error: any) {
    console.error('CRITICAL ERROR in POST /api/banners:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create banner',
        details: error.errors ? Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        })) : null
      },
      { status: 500 }
    )
  }
}

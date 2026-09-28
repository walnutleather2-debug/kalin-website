import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Handpicked from '@/lib/models/Handpicked'
import { uploadToCloudinary, getCloudinaryFolder, uploadImageFromUrl } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

// GET all handpicked items
export async function GET(request: NextRequest) {
    try {
        await connectDB()
        const items = await Handpicked.find({}).sort({ slot: 1 })

        return NextResponse.json({
            success: true,
            items
        })
    } catch (error) {
        console.error('Error fetching handpicked items:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch items' },
            { status: 500 }
        )
    }
}

// POST create or update handpicked item
export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const formData = await request.formData()
        const slot = formData.get('slot') as string
        const subtitle = formData.get('subtitle') as string || ''
        const title = formData.get('title') as string || ''
        const link = formData.get('link') as string || '/products'
        const isActive = formData.get('isActive') !== 'false'

        if (!slot) {
            return NextResponse.json({ success: false, error: 'Slot is required' }, { status: 400 })
        }

        // Handle image upload
        const imageFile = formData.get('image') as File | null
        const imageUrlInput = formData.get('imageUrl') as string | null
        let image = ''

        if (imageFile && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const folder = getCloudinaryFolder('handpicked')
            const result = await uploadToCloudinary(buffer, folder, 'image')
            image = result.url
        } else if (imageUrlInput && imageUrlInput.trim() !== '') {
            try {
                const folder = getCloudinaryFolder('handpicked')
                const result = await uploadImageFromUrl(imageUrlInput.trim(), folder)
                image = result.url
            } catch (error) {
                console.error('Failed to upload image from URL:', error)
                image = imageUrlInput.trim()
            }
        }

        // Upsert logic: find by slot and update, or create new
        const updateData: any = {
            subtitle,
            title,
            link,
            isActive
        }
        if (image) updateData.image = image

        const result = await Handpicked.findOneAndUpdate(
            { slot },
            { $set: updateData },
            { upsert: true, new: true }
        )

        return NextResponse.json({
            success: true,
            item: result
        })
    } catch (error: any) {
        console.error('Error saving handpicked item:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to save item' },
            { status: 500 }
        )
    }
}

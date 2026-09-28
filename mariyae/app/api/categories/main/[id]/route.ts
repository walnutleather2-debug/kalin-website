import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { COLLECTIONS } from '@/lib/collections'
import { ObjectId } from 'mongodb'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, image } = await request.json()

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Trim and normalize name (capitalize first letter of each word)
    const trimmedName = name.trim()
    const normalizedName = trimmedName.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')

    await connectDB()
    const db = (await import('mongoose')).connection.db
    const collection = db.collection(COLLECTIONS.MAIN_CATEGORIES)

    // Check for duplicates (case-insensitive, excluding current category)
    const existing = await collection.findOne({ 
      _id: { $ne: new ObjectId(id) },
      name: { $regex: new RegExp(`^${normalizedName}$`, 'i') }
    })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Category already exists' },
        { status: 400 }
      )
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: normalizedName,
          image: image || '',
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating main category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await connectDB()
    const db = (await import('mongoose')).connection.db
    const collection = db.collection(COLLECTIONS.MAIN_CATEGORIES)

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting main category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}


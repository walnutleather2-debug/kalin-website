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
    const { name, mainCategory, image } = await request.json()

    if (!name || !mainCategory) {
      return NextResponse.json(
        { success: false, error: 'Sub category name and main category are required' },
        { status: 400 }
      )
    }

    await connectDB()
    const db = (await import('mongoose')).connection.db
    const collection = db.collection(COLLECTIONS.SUB_CATEGORIES)

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          mainCategory,
          image: image || '',
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Sub category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating sub category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update sub category' },
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
    const collection = db.collection(COLLECTIONS.SUB_CATEGORIES)

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Sub category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sub category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete sub category' },
      { status: 500 }
    )
  }
}




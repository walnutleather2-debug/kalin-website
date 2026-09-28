import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { COLLECTIONS } from '@/lib/collections'

export async function GET() {
  try {
    await connectDB()
    const db = (await import('mongoose')).connection.db
    const collection = db.collection(COLLECTIONS.MAIN_CATEGORIES)
    
    const categories = await collection.find({}).sort({ name: 1 }).toArray()
    
    return NextResponse.json({
      success: true,
      categories: categories.map(cat => ({
        _id: cat._id.toString(),
        name: cat.name,
        image: cat.image || '',
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt
      }))
    })
  } catch (error) {
    console.error('Error fetching main categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Check for duplicates (case-insensitive)
    const existing = await collection.findOne({ 
      name: { $regex: new RegExp(`^${normalizedName}$`, 'i') }
    })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Category already exists' },
        { status: 400 }
      )
    }

    const newCategory = {
      name: normalizedName,
      image: image || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(newCategory)

    return NextResponse.json({
      success: true,
      category: {
        _id: result.insertedId.toString(),
        ...newCategory
      }
    })
  } catch (error) {
    console.error('Error creating main category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}


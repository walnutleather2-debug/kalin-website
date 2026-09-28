import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { COLLECTIONS } from '@/lib/collections'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const db = (await import('mongoose')).connection.db
    const collection = db.collection(COLLECTIONS.SUB_CATEGORIES)
    
    const url = new URL(request.url)
    const mainCategory = url.searchParams.get('mainCategory')
    
    let query: any = {}
    if (mainCategory) {
      // Case-insensitive match on mainCategory to be resilient to name casing
      query.mainCategory = { $regex: new RegExp(`^${mainCategory}$`, 'i') }
    }
    
    const subCategories = await collection.find(query).sort({ name: 1 }).toArray()
    
    return NextResponse.json({
      success: true,
      subCategories: subCategories.map(cat => ({
        _id: cat._id.toString(),
        name: cat.name,
        mainCategory: cat.mainCategory,
        image: cat.image || '',
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt
      }))
    })
  } catch (error) {
    console.error('Error fetching sub categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sub categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, mainCategory, image } = await request.json()

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Sub category name is required' },
        { status: 400 }
      )
    }

    await connectDB()
    const db = (await import('mongoose')).connection.db
    const subCategoriesCollection = db.collection(COLLECTIONS.SUB_CATEGORIES)

    // If mainCategory is provided, validate it exists
    if (mainCategory) {
      const mainCategoriesCollection = db.collection(COLLECTIONS.MAIN_CATEGORIES)
      const mainCategoryExists = await mainCategoriesCollection.findOne({ name: mainCategory })
      if (!mainCategoryExists) {
        return NextResponse.json(
          { success: false, error: 'Main category does not exist' },
          { status: 400 }
        )
      }

      // Check for duplicates (same name under same main category)
      const existing = await subCategoriesCollection.findOne({
        name,
        mainCategory
      })
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Sub category already exists for this main category' },
          { status: 400 }
        )
      }
    } else {
      // Check for duplicates (same name without main category)
      const existing = await subCategoriesCollection.findOne({
        name,
        mainCategory: { $exists: false } as any
      })
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Sub category already exists' },
          { status: 400 }
        )
      }
    }

    const newSubCategory = {
      name,
      mainCategory: mainCategory || '',
      image: image || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await subCategoriesCollection.insertOne(newSubCategory)

    return NextResponse.json({
      success: true,
      subCategory: {
        _id: result.insertedId.toString(),
        ...newSubCategory
      }
    })
  } catch (error) {
    console.error('Error creating sub category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create sub category' },
      { status: 500 }
    )
  }
}


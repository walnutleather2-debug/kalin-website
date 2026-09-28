import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '@/lib/mongodb-native'
import { ObjectId } from 'mongodb'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    // Get updated profile data
    const { firstName, lastName, email, phone, address, city, state, zipCode } = await request.json()

    // Connect to database
    const { db } = await connectToDatabase()

    // Update user profile
    const updateData = {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      updatedAt: new Date()
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Return updated user data
    const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(userId) })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id.toString(),
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        state: updatedUser.state,
        zipCode: updatedUser.zipCode,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    console.log('Login API called')
    const { email, password } = await request.json()
    console.log('Login attempt for:', email)

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Demo credentials check
    const DEMO_EMAIL = 'admin@mariyae.com'
    const DEMO_PASSWORD = 'admin123'

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      console.log('Demo login successful')
      const demoUserData = {
        _id: 'demo-admin-id',
        email: DEMO_EMAIL,
        firstName: 'Admin',
        lastName: 'User',
        fullName: 'Admin User',
        phone: '',
        role: 'admin',
        address: {},
        preferences: {},
        createdAt: new Date()
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Login successful',
          data: demoUserData
        },
        { status: 200 }
      )
    }

    await connectDB()

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      console.log('User not found for:', email)
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      console.log('Invalid password for:', email)
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('Login successful for:', email)

    // Return user data (without password)
    const userData = {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      phone: user.phone || '',
      role: user.role,
      address: user.address || {},
      preferences: user.preferences || {},
      createdAt: user.createdAt
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: userData
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

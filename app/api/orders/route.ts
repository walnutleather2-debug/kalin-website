import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const email = url.searchParams.get('email')
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search')

    // Build query
    let query: any = {}

    if (userId && email) {
      // Find orders by userId OR email (for older orders without userId)
      const trimmedEmail = email.trim()
      query.$or = [
        { userId: userId },
        {
          'customerDetails.email': { $regex: new RegExp(`^${trimmedEmail}$`, 'i') },
          $or: [
            { userId: { $exists: false } },
            { userId: null },
            { userId: "" }
          ]
        }
      ]
    } else if (userId) {
      query.userId = userId
    } else if (email) {
      query['customerDetails.email'] = { $regex: new RegExp(`^${email}$`, 'i') }
    }

    if (status && status !== 'all') {
      query.orderStatus = status
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customerDetails.firstName': { $regex: search, $options: 'i' } },
        { 'customerDetails.lastName': { $regex: search, $options: 'i' } },
        { 'customerDetails.email': { $regex: search, $options: 'i' } }
      ]
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(100) // Limit to prevent performance issues

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const orderData = await request.json()

    // Validate required fields
    const requiredFields = [
      'customerDetails',
      'items',
      'subtotal',
      'tax',
      'total',
      'paymentMethod'
    ]

    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate customer details
    const customerFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'zipCode',
      'country'
    ]

    for (const field of customerFields) {
      if (!orderData.customerDetails[field]) {
        return NextResponse.json(
          { success: false, error: `Missing customer field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate items
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    // Validate each item
    for (const item of orderData.items) {
      const itemFields = ['productId', 'name', 'price', 'quantity', 'image', 'category']
      for (const field of itemFields) {
        if (!item[field]) {
          return NextResponse.json(
            { success: false, error: `Missing item field: ${field}` },
            { status: 400 }
          )
        }
      }
    }

    // Create order
    const order = new Order({
      ...orderData,
      userId: orderData.userId || null, // Optional user ID for guest orders
      paymentStatus: 'pending',
      orderStatus: 'pending',
      shippingStatus: 'pending'
    })

    await order.save()

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
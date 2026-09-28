import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB()

    const order = await Order.findById(id)

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order
    })

  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB()

    const updateData = await request.json()

    // Validate allowed fields for update
    const allowedFields = [
      'orderStatus',
      'paymentStatus',
      'shippingStatus',
      'trackingNumber',
      'notes'
    ]

    const updateFields: any = {}
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateFields[field] = updateData[field]
      }
    }

    // Validate order status
    if (updateFields.orderStatus) {
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
      if (!validStatuses.includes(updateFields.orderStatus)) {
        return NextResponse.json(
          { success: false, error: 'Invalid order status' },
          { status: 400 }
        )
      }
    }

    // Validate payment status
    if (updateFields.paymentStatus) {
      const validStatuses = ['pending', 'completed', 'failed', 'refunded']
      if (!validStatuses.includes(updateFields.paymentStatus)) {
        return NextResponse.json(
          { success: false, error: 'Invalid payment status' },
          { status: 400 }
        )
      }
    }

    // Validate shipping status
    if (updateFields.shippingStatus) {
      const validStatuses = ['pending', 'shipped', 'delivered']
      if (!validStatuses.includes(updateFields.shippingStatus)) {
        return NextResponse.json(
          { success: false, error: 'Invalid shipping status' },
          { status: 400 }
        )
      }
    }

    console.log(`[API] Updating order ${id} with data:`, updateFields)

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    )

    if (!updatedOrder) {
      console.error(`[API] Order ${id} not found for update`)
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    console.log(`[API] Order ${id} updated successfully`)

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    })

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB()

    const order = await Order.findById(id)
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Only allow deletion of pending orders
    if (order.orderStatus !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Only pending orders can be deleted' },
        { status: 400 }
      )
    }

    await Order.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}
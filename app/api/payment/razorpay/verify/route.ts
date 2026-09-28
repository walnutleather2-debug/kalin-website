import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
      existingOrderId,
    } = body

    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: 'Razorpay secret key is not configured' },
        { status: 500 }
      )
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required Razorpay payment verification fields' },
        { status: 400 }
      )
    }

    // Verify cryptographic signature
    const hmac = crypto.createHmac('sha256', keySecret)
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const generatedSignature = hmac.digest('hex')

    const isSignatureValid = generatedSignature === razorpay_signature

    if (!isSignatureValid) {
      console.error('Invalid Razorpay signature mismatch:', {
        expected: generatedSignature,
        received: razorpay_signature,
      })
      return NextResponse.json(
        { success: false, error: 'Payment verification failed: Invalid signature' },
        { status: 400 }
      )
    }

    await connectDB()

    let savedOrder: any

    // If an existing order ID was provided, update it
    if (existingOrderId) {
      savedOrder = await Order.findByIdAndUpdate(
        existingOrderId,
        {
          paymentStatus: 'paid',
          orderStatus: 'confirmed',
          paymentMethod: 'razorpay',
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        { new: true }
      )
    } else if (orderData) {
      // Otherwise create a new order directly
      savedOrder = new Order({
        ...orderData,
        userId: orderData.userId || null,
        paymentMethod: 'razorpay',
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        shippingStatus: 'pending',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      })
      await savedOrder.save()
    } else {
      return NextResponse.json(
        { success: false, error: 'Neither existingOrderId nor orderData provided' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order: savedOrder,
    })
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Payment verification failed due to internal error',
      },
      { status: 500 }
    )
  }
}

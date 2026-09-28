import { NextRequest, NextResponse } from 'next/server'
import { getRazorpayInstance, getRazorpayKeyId } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, receipt, notes } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid amount is required' },
        { status: 400 }
      )
    }

    const razorpay = getRazorpayInstance()
    const keyId = getRazorpayKeyId()

    if (!razorpay || !keyId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file.',
          notConfigured: true,
        },
        { status: 503 }
      )
    }

    // Amount in Razorpay must be an integer in smallest currency unit (paise)
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    })
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      {
        success: false,
        error: error?.error?.description || error?.message || 'Failed to create Razorpay order',
      },
      { status: 500 }
    )
  }
}

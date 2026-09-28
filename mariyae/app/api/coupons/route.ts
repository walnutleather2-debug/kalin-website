import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Return empty coupons array for now
    // You can implement actual coupon logic later
    const coupons = []

    return NextResponse.json({
      success: true,
      data: coupons
    })

  } catch (error) {
    console.error('Coupons API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupons' },
      { status: 500 }
    )
  }
}

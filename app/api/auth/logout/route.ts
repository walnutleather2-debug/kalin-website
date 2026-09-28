import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Simple logout - just return success
    // Frontend should clear localStorage/sessionStorage
    return NextResponse.json(
      { 
        success: true,
        message: 'Logged out successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
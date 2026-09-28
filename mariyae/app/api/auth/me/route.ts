import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    // Since we are using localStorage for storefront auth, 
    // this route is mainly a fallback or for future cookie-based expansion.
    // For now, it returns a 401 to indicate no server-side session.
    return NextResponse.json(
        { success: false, message: 'No server-side session' },
        { status: 401 }
    )
}

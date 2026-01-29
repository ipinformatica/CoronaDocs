import { NextRequest, NextResponse } from 'next/server'

const TOKEN_URL = 'https://login.microsoftonline.com'

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    const clientId = process.env.NEXT_PUBLIC_ONEDRIVE_CLIENT_ID
    const clientSecret = process.env.ONEDRIVE_CLIENT_SECRET
    const tenantId = process.env.NEXT_PUBLIC_ONEDRIVE_TENANT_ID || 'common'

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'OneDrive credentials not configured' },
        { status: 500 }
      )
    }

    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    })

    const response = await fetch(`${TOKEN_URL}/${tenantId}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Token refresh failed:', error)
      return NextResponse.json(
        { error: 'Failed to refresh token' },
        { status: response.status }
      )
    }

    const tokenData = await response.json()
    return NextResponse.json(tokenData)
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

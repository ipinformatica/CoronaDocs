import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    // Redirect to settings with error
    const errorUrl = new URL('/settings', request.url)
    errorUrl.searchParams.set('onedrive_error', errorDescription || error)
    errorUrl.searchParams.set('tab', 'sync')
    return NextResponse.redirect(errorUrl)
  }

  if (!code) {
    const errorUrl = new URL('/settings', request.url)
    errorUrl.searchParams.set('onedrive_error', 'No authorization code received')
    errorUrl.searchParams.set('tab', 'sync')
    return NextResponse.redirect(errorUrl)
  }

  // Redirect to a client page that will handle the token exchange
  const successUrl = new URL('/onedrive/callback', request.url)
  successUrl.searchParams.set('code', code)
  return NextResponse.redirect(successUrl)
}

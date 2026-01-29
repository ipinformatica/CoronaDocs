'use client'

import type { OneDriveItem, OneDriveDrive, OneDriveUser, OneDriveToken } from './types'

const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0'
const AUTH_BASE = 'https://login.microsoftonline.com'

// Storage keys
const TOKEN_KEY = 'onedrive_token'
const USER_KEY = 'onedrive_user'
const SYNC_CONFIG_KEY = 'onedrive_sync_config'

export class OneDriveService {
  private clientId: string
  private tenantId: string
  private redirectUri: string
  private scopes: string[]

  constructor() {
    // These would typically come from environment variables
    this.clientId = process.env.NEXT_PUBLIC_ONEDRIVE_CLIENT_ID || ''
    // Use 'common' to allow any Microsoft account (personal or work/school)
    this.tenantId = 'common'
    this.redirectUri = typeof window !== 'undefined' 
      ? `${window.location.origin}/onedrive/callback`
      : ''
    this.scopes = [
      'User.Read',
      'Files.Read',
      'Files.Read.All',
      'offline_access'
    ]
    
    console.log('[v0] OneDriveService initialized', {
      clientId: this.clientId ? 'SET' : 'NOT SET',
      tenantId: this.tenantId,
      redirectUri: this.redirectUri,
    })
  }

  // Generate OAuth2 authorization URL
  getAuthUrl(state?: string): string {
    if (!this.clientId) {
      console.error('[v0] OneDrive Client ID not configured')
      throw new Error('OneDrive Client ID not configured')
    }
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: this.scopes.join(' '),
      response_mode: 'query',
      state: state || crypto.randomUUID(),
    })

    const authUrl = `${AUTH_BASE}/${this.tenantId}/oauth2/v2.0/authorize?${params.toString()}`
    console.log('[v0] Generated OAuth URL:', authUrl)
    return authUrl
  }

  // Exchange authorization code for tokens
  async exchangeCodeForToken(code: string): Promise<OneDriveToken> {
    const response = await fetch('/api/auth/onedrive/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri: this.redirectUri }),
    })

    if (!response.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const data = await response.json()
    const token: OneDriveToken = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + (data.expires_in * 1000),
      scope: data.scope,
    }

    this.saveToken(token)
    return token
  }

  // Refresh access token
  async refreshToken(): Promise<OneDriveToken | null> {
    const currentToken = this.getToken()
    if (!currentToken?.refreshToken) return null

    try {
      const response = await fetch('/api/auth/onedrive/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: currentToken.refreshToken }),
      })

      if (!response.ok) {
        this.clearToken()
        return null
      }

      const data = await response.json()
      const token: OneDriveToken = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || currentToken.refreshToken,
        expiresAt: Date.now() + (data.expires_in * 1000),
        scope: data.scope,
      }

      this.saveToken(token)
      return token
    } catch {
      this.clearToken()
      return null
    }
  }

  // Get valid access token (refresh if needed)
  async getValidToken(): Promise<string | null> {
    let token = this.getToken()
    if (!token) return null

    // Refresh if expiring in next 5 minutes
    if (token.expiresAt - Date.now() < 5 * 60 * 1000) {
      token = await this.refreshToken()
    }

    return token?.accessToken || null
  }

  // Token storage
  saveToken(token: OneDriveToken): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
    }
  }

  getToken(): OneDriveToken | null {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(TOKEN_KEY)
    return stored ? JSON.parse(stored) : null
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }

  isConnected(): boolean {
    const token = this.getToken()
    return !!token && token.expiresAt > Date.now()
  }

  // User info storage
  saveUser(user: OneDriveUser): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  }

  getUser(): OneDriveUser | null {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  }

  // Graph API calls
  private async graphRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getValidToken()
    if (!token) {
      throw new Error('No valid token available')
    }

    const response = await fetch(`${GRAPH_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken()
        throw new Error('Authentication expired')
      }
      throw new Error(`Graph API error: ${response.status}`)
    }

    return response.json()
  }

  // Get current user info
  async getCurrentUser(): Promise<OneDriveUser> {
    const user = await this.graphRequest<OneDriveUser>('/me')
    this.saveUser(user)
    return user
  }

  // Get user's drives
  async getDrives(): Promise<OneDriveDrive[]> {
    const response = await this.graphRequest<{ value: OneDriveDrive[] }>('/me/drives')
    return response.value
  }

  // Get items in root folder
  async getRootItems(): Promise<OneDriveItem[]> {
    const response = await this.graphRequest<{ value: OneDriveItem[] }>('/me/drive/root/children')
    return response.value
  }

  // Get items in a specific folder
  async getFolderItems(folderId: string): Promise<OneDriveItem[]> {
    const response = await this.graphRequest<{ value: OneDriveItem[] }>(`/me/drive/items/${folderId}/children`)
    return response.value
  }

  // Get items by path
  async getItemsByPath(path: string): Promise<OneDriveItem[]> {
    const encodedPath = encodeURIComponent(path)
    const response = await this.graphRequest<{ value: OneDriveItem[] }>(`/me/drive/root:/${encodedPath}:/children`)
    return response.value
  }

  // Get a specific item
  async getItem(itemId: string): Promise<OneDriveItem> {
    return this.graphRequest<OneDriveItem>(`/me/drive/items/${itemId}`)
  }

  // Get item by path
  async getItemByPath(path: string): Promise<OneDriveItem> {
    const encodedPath = encodeURIComponent(path)
    return this.graphRequest<OneDriveItem>(`/me/drive/root:/${encodedPath}`)
  }

  // Download file content
  async downloadFile(itemId: string): Promise<Blob> {
    const token = await this.getValidToken()
    if (!token) {
      throw new Error('No valid token available')
    }

    const response = await fetch(`${GRAPH_API_BASE}/me/drive/items/${itemId}/content`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status}`)
    }

    return response.blob()
  }

  // Search for files
  async searchFiles(query: string): Promise<OneDriveItem[]> {
    const response = await this.graphRequest<{ value: OneDriveItem[] }>(
      `/me/drive/root/search(q='${encodeURIComponent(query)}')`
    )
    return response.value
  }

  // Get recent files
  async getRecentFiles(): Promise<OneDriveItem[]> {
    const response = await this.graphRequest<{ value: OneDriveItem[] }>('/me/drive/recent')
    return response.value
  }

  // Subscribe to changes (webhooks)
  async createSubscription(notificationUrl: string, folderId: string, expirationDateTime: string): Promise<unknown> {
    return this.graphRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        changeType: 'created,updated',
        notificationUrl,
        resource: `/me/drive/items/${folderId}`,
        expirationDateTime,
        clientState: crypto.randomUUID(),
      }),
    })
  }

  // Get delta (changes) for a folder
  async getDelta(folderId: string, deltaToken?: string): Promise<{ items: OneDriveItem[]; deltaLink: string }> {
    const endpoint = deltaToken 
      ? deltaToken 
      : `/me/drive/items/${folderId}/delta`
    
    const response = await this.graphRequest<{ value: OneDriveItem[]; '@odata.deltaLink'?: string }>(endpoint)
    
    return {
      items: response.value,
      deltaLink: response['@odata.deltaLink'] || '',
    }
  }

  // Sync configuration storage
  saveSyncConfig(config: { folderId?: string; folderPath?: string; autoSync: boolean; syncIntervalMinutes: number }): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(config))
    }
  }

  getSyncConfig(): { folderId?: string; folderPath?: string; autoSync: boolean; syncIntervalMinutes: number } | null {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(SYNC_CONFIG_KEY)
    return stored ? JSON.parse(stored) : null
  }

  // Disconnect (clear all data)
  disconnect(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(SYNC_CONFIG_KEY)
    }
  }
}

// Singleton instance
export const oneDriveService = new OneDriveService()

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Cloud,
  CheckCircle,
  XCircle,
  Loader2,
  LogOut,
  FolderSync,
  RefreshCw,
  Settings,
  ExternalLink,
} from 'lucide-react'
import { oneDriveService } from '@/lib/onedrive'
import { FolderBrowser } from './folder-browser'
import type { OneDriveUser } from '@/lib/types'

interface OneDriveConnectorProps {
  onConnectionChange?: (connected: boolean) => void
}

export function OneDriveConnector({ onConnectionChange }: OneDriveConnectorProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<OneDriveUser | null>(null)
  const [showFolderBrowser, setShowFolderBrowser] = useState(false)
  
  // Sync config
  const [syncFolder, setSyncFolder] = useState<{ id: string; path: string; name: string } | null>(null)
  const [autoSync, setAutoSync] = useState(true)
  const [syncInterval, setSyncInterval] = useState(15)

  const checkConnection = useCallback(async () => {
    setIsLoading(true)
    try {
      const connected = oneDriveService.isConnected()
      setIsConnected(connected)
      
      if (connected) {
        const savedUser = oneDriveService.getUser()
        if (savedUser) {
          setUser(savedUser)
        } else {
          const fetchedUser = await oneDriveService.getCurrentUser()
          setUser(fetchedUser)
        }

        // Load saved sync config
        const savedConfig = oneDriveService.getSyncConfig()
        if (savedConfig) {
          if (savedConfig.folderId && savedConfig.folderPath) {
            setSyncFolder({
              id: savedConfig.folderId,
              path: savedConfig.folderPath,
              name: savedConfig.folderPath.split('/').pop() || 'OneDrive',
            })
          }
          setAutoSync(savedConfig.autoSync)
          setSyncInterval(savedConfig.syncIntervalMinutes)
        }
      }
      
      onConnectionChange?.(connected)
    } catch (error) {
      console.error('Error checking OneDrive connection:', error)
      setIsConnected(false)
      onConnectionChange?.(false)
    } finally {
      setIsLoading(false)
    }
  }, [onConnectionChange])

  useEffect(() => {
    checkConnection()
  }, [checkConnection])

  const handleConnect = () => {
    try {
      const authUrl = oneDriveService.getAuthUrl()
      
      // Open in a new popup window to avoid CSP issues
      const width = 600
      const height = 700
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2
      
      const popup = window.open(
        authUrl,
        'microsoft-oauth',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      )
      
      if (!popup) {
        // Popup was blocked, try direct navigation as fallback
        window.open(authUrl, '_blank')
        return
      }
      
      // Listen for messages from the popup
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'ONEDRIVE_AUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage)
          popup.close()
          checkConnection()
        } else if (event.data?.type === 'ONEDRIVE_AUTH_ERROR') {
          window.removeEventListener('message', handleMessage)
          popup.close()
          alert('Error al autenticar con Microsoft: ' + (event.data.error || 'Error desconocido'))
        }
      }
      
      window.addEventListener('message', handleMessage)
      
      // Also poll for popup closure
      const pollTimer = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollTimer)
          window.removeEventListener('message', handleMessage)
          // Check if we got connected
          setTimeout(() => checkConnection(), 500)
        }
      }, 500)
      
    } catch (error) {
      console.error('Error getting auth URL:', error)
      alert('Error al conectar con Microsoft. Verifica que las credenciales esten configuradas correctamente.')
    }
  }

  const handleDisconnect = () => {
    oneDriveService.disconnect()
    setIsConnected(false)
    setUser(null)
    setSyncFolder(null)
    onConnectionChange?.(false)
  }

  const handleFolderSelect = (folder: { id: string; path: string; name: string }) => {
    setSyncFolder(folder)
    oneDriveService.saveSyncConfig({
      folderId: folder.id,
      folderPath: folder.path,
      autoSync,
      syncIntervalMinutes: syncInterval,
    })
  }

  const handleSaveConfig = () => {
    oneDriveService.saveSyncConfig({
      folderId: syncFolder?.id,
      folderPath: syncFolder?.path,
      autoSync,
      syncIntervalMinutes: syncInterval,
    })
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Microsoft OneDrive
          </CardTitle>
          <CardDescription>
            Sincronizacion con Microsoft OneDrive / SharePoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isConnected) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Microsoft OneDrive
          </CardTitle>
          <CardDescription>
            Sincronizacion con Microsoft OneDrive / SharePoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border p-8">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
                <Cloud className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-card-foreground">
                No Conectado
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Conecta tu cuenta de Microsoft 365 para sincronizar documentos automaticamente desde OneDrive o SharePoint.
              </p>
              <Button className="mt-4 gap-2" onClick={handleConnect}>
                <svg className="h-5 w-5" viewBox="0 0 23 23" fill="none">
                  <path d="M0 11.5L9.5 2V7.5C9.5 7.5 23 7.5 23 21C23 21 20 13 9.5 13V18.5L0 11.5Z" fill="currentColor"/>
                </svg>
                Conectar con Microsoft
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Se requiere cuenta de Microsoft 365 o Outlook
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Microsoft OneDrive
                <Badge className="bg-green-500/20 text-green-400 gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Conectado
                </Badge>
              </CardTitle>
              <CardDescription>
                Sincronizacion con Microsoft OneDrive / SharePoint
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              className="gap-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 bg-transparent"
            >
              <LogOut className="h-4 w-4" />
              Desconectar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-500/20 text-blue-400">
                  {getUserInitials(user.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-card-foreground truncate">
                  {user.displayName}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {user.mail || user.userPrincipalName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="shrink-0"
              >
                <a
                  href="https://onedrive.live.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir OneDrive
                </a>
              </Button>
            </div>
          )}

          {/* Sync Folder Selection */}
          <div className="space-y-3">
            <Label>Carpeta de Sincronizacion</Label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-secondary">
                <FolderSync className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-card-foreground truncate font-mono">
                  {syncFolder?.path || 'No seleccionada'}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFolderBrowser(true)}
                className="gap-1 shrink-0 bg-transparent"
              >
                <Settings className="h-4 w-4" />
                Cambiar
              </Button>
            </div>
            {syncFolder && (
              <p className="text-xs text-muted-foreground">
                Los documentos de esta carpeta se sincronizaran automaticamente
              </p>
            )}
          </div>

          {/* Auto Sync Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sincronizacion Automatica</Label>
              <p className="text-sm text-muted-foreground">
                Monitorear cambios y sincronizar automaticamente
              </p>
            </div>
            <Switch
              checked={autoSync}
              onCheckedChange={(checked) => {
                setAutoSync(checked)
                handleSaveConfig()
              }}
            />
          </div>

          {/* Sync Interval */}
          {autoSync && (
            <div className="space-y-2">
              <Label>Intervalo de Sincronizacion (minutos)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={syncInterval}
                  onChange={(e) => setSyncInterval(Number(e.target.value))}
                  onBlur={handleSaveConfig}
                  min={1}
                  max={60}
                  className="w-24 bg-secondary"
                />
                <span className="text-sm text-muted-foreground">
                  Proxima sincronizacion en {syncInterval} minutos
                </span>
              </div>
            </div>
          )}

          {/* Manual Sync Button */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              disabled={!syncFolder}
            >
              <RefreshCw className="h-4 w-4" />
              Sincronizar Ahora
            </Button>
            {!syncFolder && (
              <span className="text-xs text-muted-foreground">
                Selecciona una carpeta primero
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <FolderBrowser
        open={showFolderBrowser}
        onOpenChange={setShowFolderBrowser}
        onSelect={handleFolderSelect}
      />
    </>
  )
}

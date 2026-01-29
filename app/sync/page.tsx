'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FolderSync,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Loader2,
  Play,
  Pause,
  Cloud,
  HardDrive,
  Download,
  AlertTriangle,
} from 'lucide-react'
import { oneDriveService } from '@/lib/onedrive'
import type { OneDriveItem, OneDriveSyncLog } from '@/lib/types'

interface SyncLog {
  id: string
  timestamp: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  details?: string
}

export default function SyncPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true)
  const [isOneDriveConnected, setIsOneDriveConnected] = useState(false)
  const [oneDriveFiles, setOneDriveFiles] = useState<OneDriveItem[]>([])
  const [loadingOneDrive, setLoadingOneDrive] = useState(false)
  const [syncMode, setSyncMode] = useState<'local' | 'onedrive'>('local')

  const [logs, setLogs] = useState<SyncLog[]>([
    {
      id: '1',
      timestamp: '2024-01-28 10:30:15',
      type: 'success',
      message: 'Sincronizacion completada',
      details: '5 archivos nuevos procesados',
    },
    {
      id: '2',
      timestamp: '2024-01-28 10:15:00',
      type: 'info',
      message: 'Sincronizacion automatica iniciada',
    },
    {
      id: '3',
      timestamp: '2024-01-28 10:00:00',
      type: 'success',
      message: 'Sincronizacion completada',
      details: '2 archivos nuevos procesados',
    },
    {
      id: '4',
      timestamp: '2024-01-28 09:45:00',
      type: 'error',
      message: 'Error al procesar archivo',
      details: 'factura_corrupta.pdf - Formato no valido',
    },
  ])

  const [oneDriveLogs, setOneDriveLogs] = useState<OneDriveSyncLog[]>([])

  // Check OneDrive connection on mount
  useEffect(() => {
    const checkOneDrive = () => {
      const connected = oneDriveService.isConnected()
      setIsOneDriveConnected(connected)
      if (connected) {
        loadOneDriveFiles()
      }
    }
    checkOneDrive()
  }, [])

  const loadOneDriveFiles = useCallback(async () => {
    setLoadingOneDrive(true)
    try {
      const syncConfig = oneDriveService.getSyncConfig()
      if (syncConfig?.folderId) {
        const files = await oneDriveService.getFolderItems(syncConfig.folderId)
        setOneDriveFiles(files.filter(f => !f.folder))
      } else {
        // Load root if no folder configured
        const files = await oneDriveService.getRootItems()
        setOneDriveFiles(files.filter(f => !f.folder))
      }
    } catch (error) {
      console.error('Error loading OneDrive files:', error)
    } finally {
      setLoadingOneDrive(false)
    }
  }, [])

  const handleLocalSync = async () => {
    setIsSyncing(true)
    setSyncProgress(0)

    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 300))
      setSyncProgress(i)
    }

    setLogs([
      {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString('es-ES'),
        type: 'success',
        message: 'Sincronizacion manual completada',
        details: '3 archivos nuevos procesados',
      },
      ...logs,
    ])

    setIsSyncing(false)
    setSyncProgress(0)
  }

  const handleOneDriveSync = async () => {
    if (!isOneDriveConnected) return

    setIsSyncing(true)
    setSyncProgress(0)

    const newLog: OneDriveSyncLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('es-ES'),
      type: 'info',
      message: 'Iniciando sincronizacion con OneDrive...',
    }
    setOneDriveLogs(prev => [newLog, ...prev])

    try {
      // Simulate downloading and processing files
      const syncConfig = oneDriveService.getSyncConfig()
      let filesToProcess: OneDriveItem[] = []

      if (syncConfig?.folderId) {
        filesToProcess = await oneDriveService.getFolderItems(syncConfig.folderId)
        filesToProcess = filesToProcess.filter(f => !f.folder && isPdfOrImage(f.name))
      }

      const total = filesToProcess.length || 5
      let processed = 0

      for (const file of filesToProcess.slice(0, 10)) {
        await new Promise(r => setTimeout(r, 500))
        processed++
        setSyncProgress(Math.round((processed / total) * 100))

        // Simulate processing
        setOneDriveLogs(prev => [{
          id: `${Date.now()}-${file.id}`,
          timestamp: new Date().toLocaleString('es-ES'),
          type: 'info',
          message: `Procesando: ${file.name}`,
          details: `Tamaño: ${formatSize(file.size)}`,
        }, ...prev])
      }

      // Success log
      setOneDriveLogs(prev => [{
        id: `${Date.now()}-success`,
        timestamp: new Date().toLocaleString('es-ES'),
        type: 'success',
        message: 'Sincronizacion OneDrive completada',
        details: `${processed} archivos procesados`,
        filesProcessed: processed,
      }, ...prev])

    } catch (error) {
      setOneDriveLogs(prev => [{
        id: `${Date.now()}-error`,
        timestamp: new Date().toLocaleString('es-ES'),
        type: 'error',
        message: 'Error en sincronizacion OneDrive',
        details: error instanceof Error ? error.message : 'Error desconocido',
      }, ...prev])
    } finally {
      setIsSyncing(false)
      setSyncProgress(0)
    }
  }

  const isPdfOrImage = (filename: string) => {
    const ext = filename.toLowerCase().split('.').pop()
    return ['pdf', 'jpg', 'jpeg', 'png', 'tiff', 'tif'].includes(ext || '')
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getLogIcon = (type: SyncLog['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case 'info':
        return <Clock className="h-4 w-4 text-blue-400" />
    }
  }

  const syncConfig = oneDriveService.getSyncConfig()

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Sincronizacion"
        subtitle="Control y monitoreo de sincronizacion de carpetas"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">Activo</p>
                  <p className="text-xs text-muted-foreground">Estado del servicio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">5 min</p>
                  <p className="text-xs text-muted-foreground">Ultima sincronizacion</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">156</p>
                  <p className="text-xs text-muted-foreground">Archivos procesados hoy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isOneDriveConnected ? 'bg-blue-500/20' : 'bg-secondary'
                }`}>
                  <Cloud className={`h-5 w-5 ${
                    isOneDriveConnected ? 'text-blue-400' : 'text-muted-foreground'
                  }`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {isOneDriveConnected ? 'Conectado' : 'Desconectado'}
                  </p>
                  <p className="text-xs text-muted-foreground">OneDrive</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sync Tabs */}
        <Tabs defaultValue="local" onValueChange={(v) => setSyncMode(v as 'local' | 'onedrive')}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="local" className="gap-2">
              <HardDrive className="h-4 w-4" />
              Carpeta Local
            </TabsTrigger>
            <TabsTrigger value="onedrive" className="gap-2">
              <Cloud className="h-4 w-4" />
              OneDrive
              {isOneDriveConnected && (
                <Badge className="ml-1 bg-green-500/20 text-green-400 h-5 px-1.5 text-xs">
                  OK
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Local Sync Tab */}
          <TabsContent value="local" className="space-y-6 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Control de Sincronizacion Local</CardTitle>
                <CardDescription>
                  Inicia una sincronizacion manual o controla el servicio automatico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    onClick={handleLocalSync}
                    disabled={isSyncing}
                    className="gap-2"
                  >
                    {isSyncing && syncMode === 'local' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sincronizando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-5 w-5" />
                        Sincronizar Ahora
                      </>
                    )}
                  </Button>

                  <Button
                    variant={autoSyncEnabled ? 'outline' : 'default'}
                    size="lg"
                    onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                    className="gap-2 bg-transparent"
                  >
                    {autoSyncEnabled ? (
                      <>
                        <Pause className="h-5 w-5" />
                        Detener Automatico
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5" />
                        Iniciar Automatico
                      </>
                    )}
                  </Button>

                  {autoSyncEnabled && (
                    <Badge className="bg-green-500/20 text-green-400">
                      Sincronizacion automatica activa
                    </Badge>
                  )}
                </div>

                {isSyncing && syncMode === 'local' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="text-card-foreground">{syncProgress}%</span>
                    </div>
                    <Progress value={syncProgress} className="h-2" />
                  </div>
                )}

                <div className="rounded-lg border border-border bg-secondary/50 p-4">
                  <div className="flex items-center gap-3">
                    <FolderSync className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Carpeta de Origen
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        C:\Users\Admin\Documents\Facturas
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Local Activity Log */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Registro de Actividad Local</CardTitle>
                <CardDescription>
                  Historial de sincronizaciones y eventos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 rounded-lg border border-border p-3"
                    >
                      {getLogIcon(log.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-card-foreground">
                            {log.message}
                          </p>
                          <Badge
                            variant="secondary"
                            className={
                              log.type === 'success'
                                ? 'bg-green-500/20 text-green-400'
                                : log.type === 'error'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-blue-500/20 text-blue-400'
                            }
                          >
                            {log.type}
                          </Badge>
                        </div>
                        {log.details && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {log.details}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {log.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OneDrive Sync Tab */}
          <TabsContent value="onedrive" className="space-y-6 mt-6">
            {!isOneDriveConnected ? (
              <Card className="bg-card border-border">
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
                      <Cloud className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-card-foreground">
                      OneDrive No Conectado
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md">
                      Conecta tu cuenta de Microsoft para sincronizar documentos desde OneDrive o SharePoint.
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => window.location.href = '/settings?tab=sync'}
                    >
                      Ir a Configuracion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Control de Sincronizacion OneDrive</CardTitle>
                    <CardDescription>
                      Sincroniza documentos desde tu carpeta de OneDrive configurada
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Button
                        size="lg"
                        onClick={handleOneDriveSync}
                        disabled={isSyncing || !syncConfig?.folderId}
                        className="gap-2"
                      >
                        {isSyncing && syncMode === 'onedrive' ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Sincronizando...
                          </>
                        ) : (
                          <>
                            <Download className="h-5 w-5" />
                            Sincronizar desde OneDrive
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={loadOneDriveFiles}
                        disabled={loadingOneDrive}
                        className="gap-2 bg-transparent"
                      >
                        {loadingOneDrive ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Actualizar Lista
                      </Button>
                    </div>

                    {isSyncing && syncMode === 'onedrive' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progreso de sincronizacion</span>
                          <span className="text-card-foreground">{syncProgress}%</span>
                        </div>
                        <Progress value={syncProgress} className="h-2" />
                      </div>
                    )}

                    <div className="rounded-lg border border-border bg-secondary/50 p-4">
                      <div className="flex items-center gap-3">
                        <Cloud className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium text-card-foreground">
                            Carpeta de OneDrive
                          </p>
                          <p className="text-xs font-mono text-muted-foreground">
                            {syncConfig?.folderPath || 'No configurada - ve a Configuracion'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* OneDrive Files Preview */}
                    {oneDriveFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-card-foreground">
                          Archivos disponibles ({oneDriveFiles.filter(f => isPdfOrImage(f.name)).length} documentos)
                        </p>
                        <div className="max-h-48 overflow-y-auto rounded-lg border border-border">
                          {oneDriveFiles
                            .filter(f => isPdfOrImage(f.name))
                            .slice(0, 10)
                            .map(file => (
                              <div
                                key={file.id}
                                className="flex items-center gap-3 p-2 border-b border-border last:border-0"
                              >
                                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="text-sm text-card-foreground truncate flex-1">
                                  {file.name}
                                </span>
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {formatSize(file.size)}
                                </span>
                              </div>
                            ))}
                          {oneDriveFiles.filter(f => isPdfOrImage(f.name)).length > 10 && (
                            <div className="p-2 text-center text-xs text-muted-foreground">
                              +{oneDriveFiles.filter(f => isPdfOrImage(f.name)).length - 10} archivos mas
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* OneDrive Activity Log */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Registro de Actividad OneDrive</CardTitle>
                    <CardDescription>
                      Historial de sincronizaciones con OneDrive
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {oneDriveLogs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Cloud className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No hay actividad reciente</p>
                        <p className="text-xs">Inicia una sincronizacion para ver el registro</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {oneDriveLogs.slice(0, 20).map((log) => (
                          <div
                            key={log.id}
                            className="flex items-start gap-3 rounded-lg border border-border p-3"
                          >
                            {getLogIcon(log.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-card-foreground">
                                  {log.message}
                                </p>
                                <Badge
                                  variant="secondary"
                                  className={
                                    log.type === 'success'
                                      ? 'bg-green-500/20 text-green-400'
                                      : log.type === 'error'
                                        ? 'bg-red-500/20 text-red-400'
                                        : log.type === 'warning'
                                          ? 'bg-yellow-500/20 text-yellow-400'
                                          : 'bg-blue-500/20 text-blue-400'
                                  }
                                >
                                  {log.type}
                                </Badge>
                              </div>
                              {log.details && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {log.details}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {log.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

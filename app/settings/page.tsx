'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  Database,
  Brain,
  FileSpreadsheet,
  FolderSync,
  Save,
  TestTube,
  CheckCircle,
  XCircle,
  Loader2,
  Cloud,
} from 'lucide-react'
import { DEFAULT_SERIES } from '@/lib/types'
import { OneDriveConnector } from '@/components/onedrive/onedrive-connector'

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [testingFirebird, setTestingFirebird] = useState(false)
  const [testingOllama, setTestingOllama] = useState(false)
  const [firebirdStatus, setFirebirdStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [ollamaStatus, setOllamaStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSaving(false)
  }

  const testFirebirdConnection = async () => {
    setTestingFirebird(true)
    setFirebirdStatus('idle')
    await new Promise((r) => setTimeout(r, 2000))
    setFirebirdStatus(Math.random() > 0.3 ? 'success' : 'error')
    setTestingFirebird(false)
  }

  const testOllamaConnection = async () => {
    setTestingOllama(true)
    setOllamaStatus('idle')
    await new Promise((r) => setTimeout(r, 1500))
    setOllamaStatus('success')
    setTestingOllama(false)
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Configuracion"
        subtitle="Ajustes generales del sistema"
      />

      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="sync" className="gap-2">
              <FolderSync className="h-4 w-4" />
              <span className="hidden sm:inline">Sincronizacion</span>
            </TabsTrigger>
            <TabsTrigger value="erp" className="gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">ERP</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">IA</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline">Exportacion</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Configuracion General</CardTitle>
                <CardDescription>
                  Ajustes basicos del sistema de gestion documental
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Nombre de la Empresa</Label>
                  <Input
                    defaultValue="Mi Empresa S.L."
                    className="bg-secondary max-w-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label>CIF de la Empresa</Label>
                  <Input
                    defaultValue="B12345678"
                    className="bg-secondary max-w-md font-mono"
                  />
                </div>

                <div className="flex items-center justify-between max-w-md">
                  <div className="space-y-0.5">
                    <Label>Modo Oscuro</Label>
                    <p className="text-sm text-muted-foreground">
                      Interfaz con tema oscuro
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between max-w-md">
                  <div className="space-y-0.5">
                    <Label>Notificaciones</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibir alertas de nuevos documentos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select defaultValue="es">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Espanol</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sync Settings */}
          <TabsContent value="sync" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Carpeta Local</CardTitle>
                <CardDescription>
                  Configuracion de sincronizacion con carpeta local
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Ruta de la Carpeta de Origen</Label>
                  <div className="flex gap-2 max-w-lg">
                    <Input
                      defaultValue="C:\Users\Admin\Documents\Facturas"
                      className="bg-secondary"
                    />
                    <Button variant="outline">Examinar</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Carpeta de Documentos Organizados</Label>
                  <div className="flex gap-2 max-w-lg">
                    <Input
                      defaultValue="C:\Users\Admin\Documents\Organizados"
                      className="bg-secondary"
                    />
                    <Button variant="outline">Examinar</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between max-w-md">
                  <div className="space-y-0.5">
                    <Label>Sincronizacion Automatica</Label>
                    <p className="text-sm text-muted-foreground">
                      Monitorear cambios automaticamente
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Intervalo de Sincronizacion (minutos)</Label>
                  <Input
                    type="number"
                    defaultValue="15"
                    min="1"
                    max="60"
                    className="w-24 bg-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Extensiones de Archivo</Label>
                  <Input
                    defaultValue=".pdf, .jpg, .jpeg, .png, .tiff"
                    className="bg-secondary max-w-md"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separar con comas
                  </p>
                </div>

                <div className="flex items-center justify-between max-w-md">
                  <div className="space-y-0.5">
                    <Label>Crear Subcarpetas por Fecha</Label>
                    <p className="text-sm text-muted-foreground">
                      Organizar en YYYY/MM
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Umbral de Confianza</Label>
                  <Input
                    type="number"
                    defaultValue="85"
                    min="0"
                    max="100"
                    className="w-24 bg-secondary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Documentos con confianza menor seran marcados para revision manual
                  </p>
                </div>
              </CardContent>
            </Card>

            <OneDriveConnector />
          </TabsContent>

          {/* ERP Settings */}
          <TabsContent value="erp" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Conexion Firebird (ODBC)</CardTitle>
                <CardDescription>
                  Configuracion de conexion al ERP DistritoK
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Nombre DSN (ODBC)</Label>
                  <Input
                    defaultValue="DistritoK"
                    className="bg-secondary max-w-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Usuario</Label>
                  <Input
                    defaultValue="SYSDBA"
                    className="bg-secondary max-w-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contrasena</Label>
                  <Input
                    type="password"
                    defaultValue="masterkey"
                    className="bg-secondary max-w-md"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={testFirebirdConnection}
                    disabled={testingFirebird}
                    className="gap-2 bg-transparent"
                  >
                    {testingFirebird ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                    Probar Conexion
                  </Button>
                  {firebirdStatus === 'success' && (
                    <Badge className="bg-green-500/20 text-green-400 gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Conexion exitosa
                    </Badge>
                  )}
                  {firebirdStatus === 'error' && (
                    <Badge className="bg-red-500/20 text-red-400 gap-1">
                      <XCircle className="h-3 w-3" />
                      Error de conexion
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between max-w-md">
                  <div className="space-y-0.5">
                    <Label>Validacion Automatica</Label>
                    <p className="text-sm text-muted-foreground">
                      Validar documentos contra ERP automaticamente
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Settings */}
          <TabsContent value="ai" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Configuracion Ollama</CardTitle>
                <CardDescription>
                  Configuracion del modelo de IA para analisis de documentos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>URL de Ollama</Label>
                  <Input
                    defaultValue="http://localhost:11434"
                    className="bg-secondary max-w-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Select defaultValue="llama3.2-vision:11b">
                    <SelectTrigger className="w-[300px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llama3.2-vision:11b">
                        Llama 3.2 Vision 11B (Recomendado)
                      </SelectItem>
                      <SelectItem value="llama3.2-vision:3b">
                        Llama 3.2 Vision 3B (Mas rapido)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Temperatura</Label>
                  <Input
                    type="number"
                    step="0.1"
                    defaultValue="0.1"
                    min="0"
                    max="1"
                    className="w-24 bg-secondary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Valores bajos = mas determinista
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Timeout (ms)</Label>
                  <Input
                    type="number"
                    defaultValue="60000"
                    className="w-32 bg-secondary"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={testOllamaConnection}
                    disabled={testingOllama}
                    className="gap-2 bg-transparent"
                  >
                    {testingOllama ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                    Probar Conexion
                  </Button>
                  {ollamaStatus === 'success' && (
                    <Badge className="bg-green-500/20 text-green-400 gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Ollama disponible
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">OCR (Tesseract)</CardTitle>
                <CardDescription>
                  Configuracion del motor de reconocimiento de texto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Idioma OCR</Label>
                  <Select defaultValue="spa">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spa">Espanol</SelectItem>
                      <SelectItem value="eng">English</SelectItem>
                      <SelectItem value="spa+eng">Espanol + English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Modo de Segmentacion (PSM)</Label>
                  <Select defaultValue="3">
                    <SelectTrigger className="w-[300px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">Automatico (Recomendado)</SelectItem>
                      <SelectItem value="1">Con OSD</SelectItem>
                      <SelectItem value="6">Bloque uniforme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Settings */}
          <TabsContent value="export" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Configuracion DistritoK</CardTitle>
                <CardDescription>
                  Valores por defecto para exportacion a DistritoK
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Almacen por Defecto (ID)</Label>
                    <Input
                      type="number"
                      defaultValue="1"
                      className="bg-secondary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Forma de Pago por Defecto (ID)</Label>
                    <Input
                      type="number"
                      defaultValue="75"
                      className="bg-secondary"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Mapeo de Series</Label>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(DEFAULT_SERIES).map(([type, serie]) => (
                      <div key={type} className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{type}</Label>
                        <Input
                          defaultValue={serie}
                          className="bg-secondary font-mono"
                          maxLength={3}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Carpeta de Exportacion</Label>
                  <div className="flex gap-2 max-w-lg">
                    <Input
                      defaultValue="C:\Users\Admin\Documents\Exportaciones"
                      className="bg-secondary"
                    />
                    <Button variant="outline">Examinar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar Configuracion
          </Button>
        </div>
      </div>
    </div>
  )
}

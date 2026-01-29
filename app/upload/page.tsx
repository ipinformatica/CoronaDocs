'use client'

import { Header } from '@/components/layout/header'
import { FileUploader } from '@/components/upload/file-uploader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { FolderSync, Cloud, HardDrive, RefreshCw } from 'lucide-react'

export default function UploadPage() {
  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Subir Documentos" 
        subtitle="Carga y procesa documentos con OCR e IA"
      />
      
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="upload">Subir Archivos</TabsTrigger>
            <TabsTrigger value="folder">Carpeta Local</TabsTrigger>
            <TabsTrigger value="cloud">OneDrive</TabsTrigger>
          </TabsList>

          {/* Manual Upload */}
          <TabsContent value="upload" className="space-y-6">
            <FileUploader />
          </TabsContent>

          {/* Local Folder Sync */}
          <TabsContent value="folder" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <HardDrive className="h-5 w-5" />
                  Sincronizacion con Carpeta Local
                </CardTitle>
                <CardDescription>
                  Monitorea automaticamente una carpeta local para detectar nuevos documentos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Ruta de la Carpeta</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="C:\Documentos\Facturas"
                      defaultValue="C:\Users\Admin\Documents\Facturas"
                      className="bg-secondary"
                    />
                    <Button variant="outline">Examinar</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sincronizacion Automatica</Label>
                    <p className="text-sm text-muted-foreground">
                      Detectar nuevos archivos automaticamente
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

                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <div>
                      <p className="text-sm font-medium">Estado: Activo</p>
                      <p className="text-xs text-muted-foreground">
                        Ultima sincronizacion: hace 5 minutos
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <RefreshCw className="h-4 w-4" />
                    Sincronizar Ahora
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OneDrive Sync */}
          <TabsContent value="cloud" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Cloud className="h-5 w-5" />
                  Sincronizacion con OneDrive
                </CardTitle>
                <CardDescription>
                  Conecta tu cuenta de Microsoft 365 para sincronizar documentos desde OneDrive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center rounded-lg border border-dashed border-border p-8">
                  <div className="text-center">
                    <Cloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Conectar OneDrive</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Inicia sesion con tu cuenta de Microsoft para conectar OneDrive
                    </p>
                    <Button className="mt-4">
                      Conectar con Microsoft
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 opacity-50 pointer-events-none">
                  <div className="space-y-2">
                    <Label>Carpeta de OneDrive</Label>
                    <Input
                      placeholder="/Documentos/Facturas"
                      className="bg-secondary"
                      disabled
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sincronizacion Automatica</Label>
                      <p className="text-sm text-muted-foreground">
                        Sincronizar cambios automaticamente
                      </p>
                    </div>
                    <Switch disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Processing Info */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Informacion del Procesamiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-medium text-muted-foreground">OCR</h4>
                <p className="mt-1 text-2xl font-bold text-card-foreground">Tesseract</p>
                <p className="text-xs text-muted-foreground">Motor de reconocimiento de texto</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-medium text-muted-foreground">IA</h4>
                <p className="mt-1 text-2xl font-bold text-card-foreground">Llama 3.2 Vision</p>
                <p className="text-xs text-muted-foreground">Clasificacion y extraccion</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-medium text-muted-foreground">Tiempo Medio</h4>
                <p className="mt-1 text-2xl font-bold text-card-foreground">15 seg</p>
                <p className="text-xs text-muted-foreground">Por documento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

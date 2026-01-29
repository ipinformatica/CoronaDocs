'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FileText,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Download,
  Trash2,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import type { Document } from '@/lib/types'
import { DOCUMENT_TYPE_CONFIG, PROCESSING_STATUS_CONFIG } from '@/lib/types'
import { cn } from '@/lib/utils'

interface DocumentDetailProps {
  document: Document
  onSave?: (data: Partial<Document>) => void
}

export function DocumentDetail({ document, onSave }: DocumentDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [formData, setFormData] = useState({
    documentType: document.documentType,
    fechaDocumento: document.fechaDocumento || '',
    proveedorCliente: document.proveedorCliente || '',
    cifNif: document.cifNif || '',
    numeroDocumento: document.numeroDocumento || '',
    baseImponible: document.baseImponible?.toString() || '',
    iva: document.iva?.toString() || '',
    retencion: document.retencion?.toString() || '',
    totalFactura: document.totalFactura?.toString() || '',
    verificationNotes: document.verificationNotes || '',
    isManuallyVerified: document.isManuallyVerified,
  })

  const typeConfig = DOCUMENT_TYPE_CONFIG[document.documentType]
  const statusConfig = PROCESSING_STATUS_CONFIG[document.processingStatus]

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    onSave?.({
      ...formData,
      baseImponible: formData.baseImponible ? Number.parseFloat(formData.baseImponible) : undefined,
      iva: formData.iva ? Number.parseFloat(formData.iva) : undefined,
      retencion: formData.retencion ? Number.parseFloat(formData.retencion) : undefined,
      totalFactura: formData.totalFactura ? Number.parseFloat(formData.totalFactura) : undefined,
    })
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleValidateERP = async () => {
    setIsValidating(true)
    await new Promise((r) => setTimeout(r, 2000))
    setIsValidating(false)
  }

  const handleReset = () => {
    setFormData({
      documentType: document.documentType,
      fechaDocumento: document.fechaDocumento || '',
      proveedorCliente: document.proveedorCliente || '',
      cifNif: document.cifNif || '',
      numeroDocumento: document.numeroDocumento || '',
      baseImponible: document.baseImponible?.toString() || '',
      iva: document.iva?.toString() || '',
      retencion: document.retencion?.toString() || '',
      totalFactura: document.totalFactura?.toString() || '',
      verificationNotes: document.verificationNotes || '',
      isManuallyVerified: document.isManuallyVerified,
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={typeConfig.color}>
              {typeConfig.labelEs}
            </Badge>
            <Badge variant="secondary" className={statusConfig.color}>
              {statusConfig.labelEs}
            </Badge>
            {document.isManuallyVerified && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verificado
              </Badge>
            )}
            {document.erpValidated && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                ERP Validado
              </Badge>
            )}
          </div>
          <h2 className="mt-2 text-xl font-semibold text-card-foreground">
            {document.proveedorCliente || document.fileName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {document.numeroDocumento || 'Sin numero de documento'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Descargar
          </Button>
          <Button variant="outline" size="sm" className="text-destructive bg-transparent">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Confidence Score */}
      {document.confidenceScore !== undefined && document.confidenceScore > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  Confianza del Analisis IA
                </p>
                <p className="text-xs text-muted-foreground">
                  Precision de la extraccion automatica
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-32 rounded-full bg-secondary">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      document.confidenceScore >= 85
                        ? 'bg-green-500'
                        : document.confidenceScore >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    )}
                    style={{ width: `${document.confidenceScore}%` }}
                  />
                </div>
                <span
                  className={cn(
                    'text-lg font-bold',
                    document.confidenceScore >= 85
                      ? 'text-green-400'
                      : document.confidenceScore >= 50
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  )}
                >
                  {document.confidenceScore}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Data Form */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-card-foreground">Datos del Documento</CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Guardar
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Document Type */}
            <div className="space-y-2">
              <Label>Tipo de Documento</Label>
              <Select
                value={formData.documentType}
                onValueChange={(v) => setFormData({ ...formData, documentType: v as Document['documentType'] })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DOCUMENT_TYPE_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.labelEs}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Document Date */}
            <div className="space-y-2">
              <Label>Fecha Documento</Label>
              <Input
                type="date"
                value={formData.fechaDocumento}
                onChange={(e) => setFormData({ ...formData, fechaDocumento: e.target.value })}
                disabled={!isEditing}
                className="bg-secondary"
              />
            </div>

            {/* Provider/Client */}
            <div className="space-y-2">
              <Label>Proveedor / Cliente</Label>
              <Input
                value={formData.proveedorCliente}
                onChange={(e) => setFormData({ ...formData, proveedorCliente: e.target.value })}
                disabled={!isEditing}
                className="bg-secondary"
              />
            </div>

            {/* CIF/NIF */}
            <div className="space-y-2">
              <Label>CIF / NIF</Label>
              <Input
                value={formData.cifNif}
                onChange={(e) => setFormData({ ...formData, cifNif: e.target.value })}
                disabled={!isEditing}
                className="bg-secondary font-mono"
              />
            </div>

            {/* Document Number */}
            <div className="space-y-2">
              <Label>Numero de Documento</Label>
              <Input
                value={formData.numeroDocumento}
                onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
                disabled={!isEditing}
                className="bg-secondary font-mono"
              />
            </div>

            {/* Base Amount */}
            <div className="space-y-2">
              <Label>Base Imponible</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.baseImponible}
                onChange={(e) => setFormData({ ...formData, baseImponible: e.target.value })}
                disabled={!isEditing}
                className="bg-secondary"
              />
            </div>

            {/* VAT */}
            <div className="space-y-2">
              <Label>IVA</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.iva}
                onChange={(e) => setFormData({ ...formData, iva: e.target.value })}
                disabled={!isEditing}
                className="bg-secondary"
              />
            </div>

            {/* Retention */}
            <div className="space-y-2">
              <Label>Retencion</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.retencion}
                onChange={(e) => setFormData({ ...formData, retencion: e.target.value })}
                disabled={!isEditing}
                className="bg-secondary"
              />
            </div>

            {/* Total */}
            <div className="space-y-2 md:col-span-2">
              <Label>Total Factura</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.totalFactura}
                onChange={(e) => setFormData({ ...formData, totalFactura: e.target.value })}
                disabled={!isEditing}
                className="bg-secondary text-lg font-bold"
              />
            </div>
          </div>

          {/* Verification Notes */}
          <div className="space-y-2">
            <Label>Notas de Verificacion</Label>
            <Textarea
              value={formData.verificationNotes}
              onChange={(e) => setFormData({ ...formData, verificationNotes: e.target.value })}
              disabled={!isEditing}
              className="bg-secondary"
              placeholder="Notas adicionales sobre la verificacion del documento..."
            />
          </div>

          {/* Manual Verification */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={formData.isManuallyVerified}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isManuallyVerified: checked as boolean })
              }
              disabled={!isEditing}
            />
            <Label htmlFor="verified" className="cursor-pointer">
              Marcar como verificado manualmente
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* ERP Validation */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Validacion ERP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Verificar datos contra la base de datos del ERP (Firebird)
              </p>
              {document.erpValidated && (
                <div className="mt-2 flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Validado correctamente</span>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleValidateERP}
              disabled={isValidating}
            >
              {isValidating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              Validar ERP
            </Button>
          </div>

          {document.erpAlmacen && (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Almacen</p>
                <p className="font-medium">{document.erpAlmacen}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Serie</p>
                <p className="font-medium">{document.erpSerie || '-'}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Forma de Pago</p>
                <p className="font-medium">{document.erpFormaPago || '-'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Informacion del Archivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Nombre del Archivo</p>
              <p className="text-sm font-medium">{document.fileName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tamano</p>
              <p className="text-sm font-medium">
                {(document.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ruta</p>
              <p className="text-sm font-mono text-muted-foreground truncate">
                {document.filePath}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hash (SHA256)</p>
              <p className="text-sm font-mono text-muted-foreground truncate">
                {document.fileHash}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Creado</p>
              <p className="text-sm font-medium">
                {new Date(document.createdAt).toLocaleString('es-ES')}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Actualizado</p>
              <p className="text-sm font-medium">
                {new Date(document.updatedAt).toLocaleString('es-ES')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

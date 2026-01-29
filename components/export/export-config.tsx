'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Download, FileSpreadsheet, Loader2, CheckCircle } from 'lucide-react'
import type { Document, DocumentType, ExportConfig } from '@/lib/types'
import { DOCUMENT_TYPE_CONFIG, DEFAULT_SERIES, DISTRITO_K_DOC_TYPES } from '@/lib/types'

interface ExportConfigProps {
  documents: Document[]
  selectedIds: string[]
  onExport: (config: ExportConfig) => void
}

export function ExportConfigComponent({ documents, selectedIds, onExport }: ExportConfigProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)
  const [config, setConfig] = useState<ExportConfig>({
    selectedDocuments: selectedIds,
    exportFormat: 'DISTRITO_K',
    defaultAlmacen: 1,
    defaultFormaPago: 75,
    serieMapping: { ...DEFAULT_SERIES },
  })

  const selectedDocs = documents.filter((d) => selectedIds.includes(d.id))

  const handleExport = async () => {
    setIsExporting(true)
    await new Promise((r) => setTimeout(r, 2000))
    onExport(config)
    setIsExporting(false)
    setExportComplete(true)
  }

  const updateSerieMapping = (type: DocumentType, value: string) => {
    setConfig({
      ...config,
      serieMapping: {
        ...config.serieMapping,
        [type]: value,
      },
    })
  }

  // Calculate preview data
  const previewData = selectedDocs.map((doc) => ({
    serie: config.serieMapping[doc.documentType],
    numero: doc.numeroDocumento || '-',
    tipo: DISTRITO_K_DOC_TYPES[doc.documentType],
    tipoText: DOCUMENT_TYPE_CONFIG[doc.documentType].code,
    almacen: doc.erpAlmacen || config.defaultAlmacen.toString(),
    cliente: doc.cifNif || '-',
    formaPago: doc.erpFormaPago || config.defaultFormaPago.toString(),
    ruta: doc.filePath,
  }))

  return (
    <div className="space-y-6">
      {/* Export Format */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Formato de Exportacion</CardTitle>
          <CardDescription>
            Configura el formato de exportacion para tu ERP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Formato</Label>
            <Select value={config.exportFormat} disabled>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DISTRITO_K">DistritoK SQL Pyme</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Genera un archivo Excel con las hojas Cabecera y Lineas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Series Mapping */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Mapeo de Series</CardTitle>
          <CardDescription>
            Configura la serie a usar para cada tipo de documento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(DOCUMENT_TYPE_CONFIG).map(([key, cfg]) => (
              <div key={key} className="space-y-2">
                <Label>{cfg.labelEs}</Label>
                <Input
                  value={config.serieMapping[key as DocumentType]}
                  onChange={(e) => updateSerieMapping(key as DocumentType, e.target.value)}
                  className="bg-secondary font-mono"
                  maxLength={3}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Default Values */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Valores por Defecto</CardTitle>
          <CardDescription>
            Valores a usar cuando no esten disponibles en el documento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Almacen por Defecto (ID)</Label>
              <Input
                type="number"
                value={config.defaultAlmacen}
                onChange={(e) =>
                  setConfig({ ...config, defaultAlmacen: Number.parseInt(e.target.value) || 1 })
                }
                className="bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label>Forma de Pago por Defecto (ID)</Label>
              <Input
                type="number"
                value={config.defaultFormaPago}
                onChange={(e) =>
                  setConfig({ ...config, defaultFormaPago: Number.parseInt(e.target.value) || 75 })
                }
                className="bg-secondary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Vista Previa ({selectedDocs.length} documentos)
          </CardTitle>
          <CardDescription>
            Asi se exportaran los datos en la hoja Cabecera
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Serie</TableHead>
                  <TableHead>Numero</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Almacen</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>F. Pago</TableHead>
                  <TableHead>Ruta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.slice(0, 5).map((row, i) => (
                  <TableRow key={`preview-${selectedDocs[i]?.id || i}`} className="border-border">
                    <TableCell className="font-mono">{row.serie}</TableCell>
                    <TableCell className="font-mono">{row.numero}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {row.tipoText} ({row.tipo})
                      </Badge>
                    </TableCell>
                    <TableCell>{row.almacen}</TableCell>
                    <TableCell className="font-mono text-xs">{row.cliente}</TableCell>
                    <TableCell>{row.formaPago}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                      {row.ruta}
                    </TableCell>
                  </TableRow>
                ))}
                {previewData.length > 5 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      ... y {previewData.length - 5} documentos mas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Export Button */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
        <div>
          <p className="font-medium">
            {selectedDocs.length} documento(s) seleccionado(s) para exportar
          </p>
          <p className="text-sm text-muted-foreground">
            Se generara un archivo Excel compatible con DistritoK
          </p>
        </div>
        <Button
          size="lg"
          onClick={handleExport}
          disabled={selectedDocs.length === 0 || isExporting}
          className="gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Exportando...
            </>
          ) : exportComplete ? (
            <>
              <CheckCircle className="h-5 w-5" />
              Exportado
            </>
          ) : (
            <>
              <FileSpreadsheet className="h-5 w-5" />
              Exportar a Excel
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

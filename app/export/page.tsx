'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { ExportConfigComponent } from '@/components/export/export-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileText, Download } from 'lucide-react'
import { mockDocuments } from '@/lib/mock-data'
import { DOCUMENT_TYPE_CONFIG } from '@/lib/types'
import type { ExportConfig } from '@/lib/types'

function ExportPageContent() {
  const searchParams = useSearchParams()
  const idsParam = searchParams.get('ids')
  const initialIds = idsParam ? idsParam.split(',') : []

  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds)

  // Only show completed documents for export
  const exportableDocuments = useMemo(() => {
    return mockDocuments.filter((d) => d.processingStatus === 'COMPLETED')
  }, [])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(exportableDocuments.map((d) => d.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id))
    }
  }

  const handleExport = (config: ExportConfig) => {
    // In a real app, this would generate and download the Excel file
    console.log('Exporting with config:', config)
    
    // Simulate download
    const blob = new Blob(['Excel file content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Importacion_DistritoK_${new Date().toISOString().slice(0, 10)}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const isAllSelected =
    exportableDocuments.length > 0 && selectedIds.length === exportableDocuments.length

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Exportar Documentos"
        subtitle="Genera archivos Excel compatibles con DistritoK"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Document Selection */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Seleccionar Documentos</CardTitle>
            <CardDescription>
              Selecciona los documentos que deseas exportar (solo documentos completados)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Seleccionar todos"
                      />
                    </TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Proveedor/Cliente</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exportableDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <FileText className="h-8 w-8" />
                          <p>No hay documentos completados para exportar</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    exportableDocuments.map((doc) => {
                      const typeConfig = DOCUMENT_TYPE_CONFIG[doc.documentType]
                      const isSelected = selectedIds.includes(doc.id)

                      return (
                        <TableRow
                          key={doc.id}
                          className={`border-border ${isSelected ? 'bg-secondary/50' : ''}`}
                        >
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleSelectOne(doc.id, checked as boolean)
                              }
                              aria-label={`Seleccionar ${doc.fileName}`}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-secondary">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {doc.numeroDocumento || doc.fileName}
                                </p>
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {doc.fileName}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={typeConfig.color}>
                              {typeConfig.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {doc.fechaDocumento
                              ? new Date(doc.fechaDocumento).toLocaleDateString('es-ES')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{doc.proveedorCliente || '-'}</p>
                              {doc.cifNif && (
                                <p className="text-xs text-muted-foreground font-mono">
                                  {doc.cifNif}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {doc.totalFactura
                              ? new Intl.NumberFormat('es-ES', {
                                  style: 'currency',
                                  currency: 'EUR',
                                }).format(doc.totalFactura)
                              : '-'}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Export Configuration */}
        {selectedIds.length > 0 && (
          <ExportConfigComponent
            documents={mockDocuments}
            selectedIds={selectedIds}
            onExport={handleExport}
          />
        )}
      </div>
    </div>
  )
}

export default function ExportPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">Cargando...</div>}>
      <ExportPageContent />
    </Suspense>
  )
}

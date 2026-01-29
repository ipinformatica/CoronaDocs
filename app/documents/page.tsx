'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { DocumentFiltersComponent } from '@/components/documents/document-filters'
import { DocumentTable } from '@/components/documents/document-table'
import { Button } from '@/components/ui/button'
import { Download, Upload, Trash2 } from 'lucide-react'
import { mockDocuments } from '@/lib/mock-data'
import type { DocumentFilters } from '@/lib/types'

export default function DocumentsPage() {
  const [filters, setFilters] = useState<DocumentFilters>({})
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Filter documents based on current filters
  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter((doc) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          doc.fileName.toLowerCase().includes(searchLower) ||
          doc.proveedorCliente?.toLowerCase().includes(searchLower) ||
          doc.cifNif?.toLowerCase().includes(searchLower) ||
          doc.numeroDocumento?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Document type filter
      if (filters.documentType?.length) {
        if (!filters.documentType.includes(doc.documentType)) return false
      }

      // Processing status filter
      if (filters.processingStatus?.length) {
        if (!filters.processingStatus.includes(doc.processingStatus)) return false
      }

      // Date range filter
      if (filters.dateFrom && doc.fechaDocumento) {
        if (new Date(doc.fechaDocumento) < new Date(filters.dateFrom)) return false
      }
      if (filters.dateTo && doc.fechaDocumento) {
        if (new Date(doc.fechaDocumento) > new Date(filters.dateTo)) return false
      }

      // Amount range filter
      if (filters.minAmount !== undefined && doc.totalFactura !== undefined) {
        if (doc.totalFactura < filters.minAmount) return false
      }
      if (filters.maxAmount !== undefined && doc.totalFactura !== undefined) {
        if (doc.totalFactura > filters.maxAmount) return false
      }

      return true
    })
  }, [filters])

  const handleExportSelected = () => {
    // Navigate to export page with selected IDs
    window.location.href = `/export?ids=${selectedIds.join(',')}`
  }

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Documentos" 
        subtitle={`${filteredDocuments.length} documentos encontrados`}
      />
      
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Filters */}
        <DocumentFiltersComponent 
          filters={filters} 
          onFiltersChange={setFilters} 
        />

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} documento(s) seleccionado(s)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSelected}
                className="gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </div>
        )}

        {/* Document Table */}
        <DocumentTable
          documents={filteredDocuments}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredDocuments.length} de {mockDocuments.length} documentos
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled>
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

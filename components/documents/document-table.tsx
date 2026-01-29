'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  FileText,
  MoreHorizontal,
  Eye,
  Edit,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ArrowUpDown,
} from 'lucide-react'
import type { Document } from '@/lib/types'
import { DOCUMENT_TYPE_CONFIG, PROCESSING_STATUS_CONFIG } from '@/lib/types'
import { cn } from '@/lib/utils'

interface DocumentTableProps {
  documents: Document[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
}

export function DocumentTable({
  documents,
  selectedIds,
  onSelectionChange,
}: DocumentTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(documents.map((d) => d.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id])
    } else {
      onSelectionChange(selectedIds.filter((i) => i !== id))
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const getStatusIcon = (status: Document['processingStatus']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'PROCESSING':
        return <Clock className="h-4 w-4 text-blue-400 animate-pulse" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-400" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-400" />
      case 'MANUAL_REVIEW':
        return <AlertCircle className="h-4 w-4 text-orange-400" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const isAllSelected = documents.length > 0 && selectedIds.length === documents.length
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < documents.length

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Seleccionar todos"
                className={cn(isSomeSelected && 'data-[state=checked]:bg-muted')}
              />
            </TableHead>
            <TableHead className="w-12"></TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 gap-1"
                onClick={() => handleSort('documentType')}
              >
                Tipo
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 gap-1"
                onClick={() => handleSort('fechaDocumento')}
              >
                Fecha
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Proveedor/Cliente</TableHead>
            <TableHead>Numero</TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                className="-mr-3 h-8 gap-1"
                onClick={() => handleSort('totalFactura')}
              >
                Total
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Confianza</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <FileText className="h-8 w-8" />
                  <p>No se encontraron documentos</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            documents.map((doc) => {
              const typeConfig = DOCUMENT_TYPE_CONFIG[doc.documentType]
              const statusConfig = PROCESSING_STATUS_CONFIG[doc.processingStatus]
              const isSelected = selectedIds.includes(doc.id)

              return (
                <TableRow
                  key={doc.id}
                  className={cn(
                    'border-border',
                    isSelected && 'bg-secondary/50'
                  )}
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
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-secondary">
                      <FileText className="h-4 w-4 text-muted-foreground" />
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
                    <div className="max-w-[200px]">
                      <p className="truncate text-sm font-medium">
                        {doc.proveedorCliente || '-'}
                      </p>
                      {doc.cifNif && (
                        <p className="truncate text-xs text-muted-foreground">
                          {doc.cifNif}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {doc.numeroDocumento || '-'}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {doc.totalFactura
                      ? new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(doc.totalFactura)
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.processingStatus)}
                      <span className="text-xs text-muted-foreground">
                        {statusConfig.labelEs}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {doc.confidenceScore !== undefined && doc.confidenceScore > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-secondary">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              doc.confidenceScore >= 85
                                ? 'bg-green-500'
                                : doc.confidenceScore >= 50
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            )}
                            style={{ width: `${doc.confidenceScore}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {doc.confidenceScore}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/documents/${doc.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalle
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/documents/${doc.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Descargar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

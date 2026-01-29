'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FileCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Database,
  FileText,
} from 'lucide-react'
import { mockDocuments } from '@/lib/mock-data'
import { DOCUMENT_TYPE_CONFIG } from '@/lib/types'

export default function ValidationPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [validating, setValidating] = useState(false)
  const [validationResults, setValidationResults] = useState<
    Record<string, 'pending' | 'success' | 'error'>
  >({})

  // Documents that need validation
  const documentsToValidate = mockDocuments.filter(
    (d) =>
      d.processingStatus === 'COMPLETED' &&
      !d.erpValidated &&
      d.documentType !== 'DESCONOCIDO'
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(documentsToValidate.map((d) => d.id))
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

  const handleValidate = async () => {
    setValidating(true)

    for (const id of selectedIds) {
      setValidationResults((prev) => ({ ...prev, [id]: 'pending' }))
      await new Promise((r) => setTimeout(r, 500))
      const isSuccess = Math.random() > 0.2
      setValidationResults((prev) => ({
        ...prev,
        [id]: isSuccess ? 'success' : 'error',
      }))
    }

    setValidating(false)
  }

  const getValidationIcon = (id: string) => {
    const result = validationResults[id]
    if (!result) return null
    switch (result) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />
    }
  }

  const isAllSelected =
    documentsToValidate.length > 0 &&
    selectedIds.length === documentsToValidate.length

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Validacion ERP"
        subtitle="Valida documentos contra la base de datos Firebird"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Status */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {documentsToValidate.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Pendientes de validar</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {mockDocuments.filter((d) => d.erpValidated).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Validados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Database className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">Conectado</p>
                  <p className="text-xs text-muted-foreground">Estado Firebird</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Validation Table */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground">
                Documentos Pendientes de Validacion
              </CardTitle>
              <CardDescription>
                Selecciona los documentos a validar contra el ERP
              </CardDescription>
            </div>
            <Button
              onClick={handleValidate}
              disabled={selectedIds.length === 0 || validating}
              className="gap-2"
            >
              {validating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Validando...
                </>
              ) : (
                <>
                  <FileCheck className="h-4 w-4" />
                  Validar Seleccionados ({selectedIds.length})
                </>
              )}
            </Button>
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
                        disabled={validating}
                      />
                    </TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Proveedor/Cliente</TableHead>
                    <TableHead>CIF/NIF</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentsToValidate.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <CheckCircle className="h-8 w-8 text-green-400" />
                          <p>Todos los documentos estan validados</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    documentsToValidate.map((doc) => {
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
                              disabled={validating}
                            />
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/documents/${doc.id}`}
                              className="flex items-center gap-3 hover:underline"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-secondary">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <span className="font-medium">
                                {doc.numeroDocumento || doc.fileName}
                              </span>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={typeConfig.color}>
                              {typeConfig.code}
                            </Badge>
                          </TableCell>
                          <TableCell>{doc.proveedorCliente || '-'}</TableCell>
                          <TableCell className="font-mono">
                            {doc.cifNif || '-'}
                          </TableCell>
                          <TableCell className="font-medium">
                            {doc.totalFactura
                              ? new Intl.NumberFormat('es-ES', {
                                  style: 'currency',
                                  currency: 'EUR',
                                }).format(doc.totalFactura)
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {getValidationIcon(doc.id) || (
                              <span className="text-xs text-muted-foreground">
                                Pendiente
                              </span>
                            )}
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

        {/* Validation Info */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Informacion de Validacion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-medium text-card-foreground">
                  Validaciones realizadas:
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Verificar existencia de proveedor/cliente por CIF</li>
                  <li>• Comprobar que el numero de documento no este duplicado</li>
                  <li>• Validar codigos de almacen</li>
                  <li>• Verificar formas de pago</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-medium text-card-foreground">
                  Conexion actual:
                </h4>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DSN:</span>
                    <span className="font-mono">DistritoK</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Usuario:</span>
                    <span className="font-mono">SYSDBA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado:</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      Conectado
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

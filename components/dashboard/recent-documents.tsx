'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import type { Document } from '@/lib/types'
import { DOCUMENT_TYPE_CONFIG, PROCESSING_STATUS_CONFIG } from '@/lib/types'

interface RecentDocumentsProps {
  documents: Document[]
}

export function RecentDocuments({ documents }: RecentDocumentsProps) {
  const recentDocs = documents.slice(0, 5)

  const getStatusIcon = (status: Document['processingStatus']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'PROCESSING':
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-400" />
      case 'FAILED':
      case 'MANUAL_REVIEW':
        return <AlertCircle className="h-4 w-4 text-orange-400" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-card-foreground">Documentos Recientes</CardTitle>
          <CardDescription>Ultimos documentos procesados</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/documents">
            Ver todos
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentDocs.map((doc) => {
            const typeConfig = DOCUMENT_TYPE_CONFIG[doc.documentType]
            const statusConfig = PROCESSING_STATUS_CONFIG[doc.processingStatus]

            return (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50"
              >
                {/* Icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {doc.proveedorCliente || doc.fileName}
                    </p>
                    {getStatusIcon(doc.processingStatus)}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={typeConfig.color}>
                      {typeConfig.code}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {doc.numeroDocumento || 'Sin numero'}
                    </span>
                    {doc.fechaDocumento && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(doc.fechaDocumento).toLocaleDateString('es-ES')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  {doc.totalFactura ? (
                    <p className="text-sm font-medium text-card-foreground">
                      {new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(doc.totalFactura)}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">-</p>
                  )}
                  {doc.confidenceScore !== undefined && doc.confidenceScore > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {doc.confidenceScore}% confianza
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

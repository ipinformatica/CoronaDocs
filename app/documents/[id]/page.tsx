'use client'

import { use } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { DocumentDetail } from '@/components/documents/document-detail'
import { PDFViewer } from '@/components/documents/pdf-viewer'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { mockDocuments } from '@/lib/mock-data'
import { notFound } from 'next/navigation'

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  
  const document = mockDocuments.find((d) => d.id === id)

  if (!document) {
    notFound()
  }

  // Find previous and next documents for navigation
  const currentIndex = mockDocuments.findIndex((d) => d.id === id)
  const prevDoc = currentIndex > 0 ? mockDocuments[currentIndex - 1] : null
  const nextDoc = currentIndex < mockDocuments.length - 1 ? mockDocuments[currentIndex + 1] : null

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Detalle del Documento" 
        subtitle={document.fileName}
      />
      
      <div className="flex-1 overflow-hidden">
        {/* Navigation */}
        <div className="flex items-center justify-between border-b border-border px-6 py-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/documents">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Volver a la lista
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            {prevDoc ? (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/documents/${prevDoc.id}`}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Anterior
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" disabled>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Anterior
              </Button>
            )}
            {nextDoc ? (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/documents/${nextDoc.id}`}>
                  Siguiente
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" disabled>
                Siguiente
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(100%-49px)]">
          {/* PDF Viewer */}
          <div className="w-1/2 border-r border-border">
            <PDFViewer
              filePath={document.filePath}
              fileName={document.fileName}
              className="h-full rounded-none border-0"
            />
          </div>

          {/* Document Details */}
          <div className="w-1/2 overflow-auto p-6">
            <DocumentDetail document={document} />
          </div>
        </div>
      </div>
    </div>
  )
}

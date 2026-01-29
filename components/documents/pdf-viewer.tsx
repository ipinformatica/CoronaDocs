'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PDFViewerProps {
  filePath: string
  fileName: string
  className?: string
}

export function PDFViewer({ filePath, fileName, className }: PDFViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 3 // Mock

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))

  return (
    <Card className={cn('bg-card border-border flex flex-col', className)}>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-sm font-medium text-card-foreground truncate">
          {fileName}
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center text-xs text-muted-foreground">{zoom}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="mx-2 h-4 w-px bg-border" />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative">
        {/* PDF Preview Area */}
        <div className="absolute inset-0 overflow-auto bg-muted/50">
          <div
            className="min-h-full flex items-center justify-center p-4"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
            }}
          >
            {/* Mock PDF Content */}
            <div className="w-[595px] min-h-[842px] bg-card border border-border shadow-lg p-8">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border pb-4">
                  <div>
                    <div className="h-12 w-32 bg-secondary rounded flex items-center justify-center">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">EMPRESA DEMO S.L.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-card-foreground">FACTURA</p>
                    <p className="text-sm text-muted-foreground">F2024-001</p>
                    <p className="text-sm text-muted-foreground">15/01/2024</p>
                  </div>
                </div>

                {/* Client Info */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">De:</p>
                    <p className="text-sm font-medium">EMPRESA DEMO S.L.</p>
                    <p className="text-xs text-muted-foreground">CIF: B12345678</p>
                    <p className="text-xs text-muted-foreground">Calle Principal 123</p>
                    <p className="text-xs text-muted-foreground">28001 Madrid, Espana</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Para:</p>
                    <p className="text-sm font-medium">ACME SERVICIOS SA</p>
                    <p className="text-xs text-muted-foreground">CIF: A12345678</p>
                    <p className="text-xs text-muted-foreground">Avenida Central 456</p>
                    <p className="text-xs text-muted-foreground">08001 Barcelona, Espana</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mt-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2 text-left text-xs font-medium text-muted-foreground">
                          DESCRIPCION
                        </th>
                        <th className="py-2 text-right text-xs font-medium text-muted-foreground">
                          CANT
                        </th>
                        <th className="py-2 text-right text-xs font-medium text-muted-foreground">
                          PRECIO
                        </th>
                        <th className="py-2 text-right text-xs font-medium text-muted-foreground">
                          TOTAL
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-2">Servicios de consultoria</td>
                        <td className="py-2 text-right">10</td>
                        <td className="py-2 text-right">100,00</td>
                        <td className="py-2 text-right">1.000,00</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2">Desarrollo de software</td>
                        <td className="py-2 text-right">5</td>
                        <td className="py-2 text-right">50,10</td>
                        <td className="py-2 text-right">250,50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Imponible:</span>
                      <span>1.250,50 EUR</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">IVA (21%):</span>
                      <span>262,61 EUR</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-border pt-2">
                      <span>TOTAL:</span>
                      <span>1.513,11 EUR</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground">
                  <p>Gracias por su confianza</p>
                  <p>Pago a 30 dias - IBAN: ES12 3456 7890 1234 5678 90</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-lg border border-border bg-card p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2 text-sm text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, FileText, ArrowRight, Clock } from 'lucide-react'
import { mockDocuments } from '@/lib/mock-data'
import { DOCUMENT_TYPE_CONFIG } from '@/lib/types'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(mockDocuments.slice(0, 3))
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    setTimeout(() => {
      const filtered = mockDocuments.filter(
        (doc) =>
          doc.fileName.toLowerCase().includes(query.toLowerCase()) ||
          doc.proveedorCliente?.toLowerCase().includes(query.toLowerCase()) ||
          doc.cifNif?.toLowerCase().includes(query.toLowerCase()) ||
          doc.numeroDocumento?.toLowerCase().includes(query.toLowerCase()) ||
          doc.ocrText?.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setIsSearching(false)
    }, 500)
  }

  const recentSearches = [
    'ACME SERVICIOS',
    'A12345678',
    'F2024',
    'factura enero',
  ]

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Busqueda Avanzada"
        subtitle="Busca en el contenido de todos los documentos"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Search Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Busqueda Full-Text</CardTitle>
            <CardDescription>
              Busca en el texto extraido por OCR de todos los documentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar en documentos..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-secondary pl-10 h-12 text-lg"
                  />
                </div>
                <Button type="submit" size="lg" disabled={isSearching}>
                  {isSearching ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>

              {/* Recent Searches */}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Recientes:</span>
                {recentSearches.map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setQuery(term)
                    }}
                    className="h-7"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Resultados ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mb-4" />
                <p>No se encontraron resultados</p>
                <p className="text-sm">Intenta con otros terminos de busqueda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((doc) => {
                  const typeConfig = DOCUMENT_TYPE_CONFIG[doc.documentType]
                  return (
                    <Link
                      key={doc.id}
                      href={`/documents/${doc.id}`}
                      className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-card-foreground">
                            {doc.proveedorCliente || doc.fileName}
                          </p>
                          <Badge variant="secondary" className={typeConfig.color}>
                            {typeConfig.code}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {doc.numeroDocumento || 'Sin numero'} •{' '}
                          {doc.fechaDocumento
                            ? new Date(doc.fechaDocumento).toLocaleDateString('es-ES')
                            : 'Sin fecha'}
                        </p>
                        {doc.ocrText && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            ...{doc.ocrText.slice(0, 150)}...
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

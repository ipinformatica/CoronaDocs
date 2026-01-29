'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { DocumentFilters, DocumentType, ProcessingStatus } from '@/lib/types'
import { DOCUMENT_TYPE_CONFIG, PROCESSING_STATUS_CONFIG } from '@/lib/types'

interface DocumentFiltersProps {
  filters: DocumentFilters
  onFiltersChange: (filters: DocumentFilters) => void
}

export function DocumentFiltersComponent({ filters, onFiltersChange }: DocumentFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleTypeChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, documentType: undefined })
    } else {
      onFiltersChange({ ...filters, documentType: [value as DocumentType] })
    }
  }

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, processingStatus: undefined })
    } else {
      onFiltersChange({ ...filters, processingStatus: [value as ProcessingStatus] })
    }
  }

  const handleDateFromChange = (date: Date | undefined) => {
    onFiltersChange({ ...filters, dateFrom: date?.toISOString().split('T')[0] })
  }

  const handleDateToChange = (date: Date | undefined) => {
    onFiltersChange({ ...filters, dateTo: date?.toISOString().split('T')[0] })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por proveedor, numero de documento, CIF..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 bg-secondary"
          />
        </div>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filtros
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filtros</h4>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-1 h-3 w-3" />
                    Limpiar
                  </Button>
                )}
              </div>

              {/* Document Type */}
              <div className="space-y-2">
                <Label>Tipo de Documento</Label>
                <Select
                  value={filters.documentType?.[0] || 'all'}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {Object.entries(DOCUMENT_TYPE_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.labelEs}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Processing Status */}
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={filters.processingStatus?.[0] || 'all'}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    {Object.entries(PROCESSING_STATUS_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.labelEs}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Desde</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateFrom
                          ? format(new Date(filters.dateFrom), 'dd/MM/yy', { locale: es })
                          : 'Fecha'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
                        onSelect={handleDateFromChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Hasta</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateTo
                          ? format(new Date(filters.dateTo), 'dd/MM/yy', { locale: es })
                          : 'Fecha'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
                        onSelect={handleDateToChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Amount Range */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Importe Min</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minAmount || ''}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        minAmount: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Importe Max</Label>
                  <Input
                    type="number"
                    placeholder="999999"
                    value={filters.maxAmount || ''}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        maxAmount: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.documentType?.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1">
              {DOCUMENT_TYPE_CONFIG[type].labelEs}
              <button
                onClick={() => onFiltersChange({ ...filters, documentType: undefined })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.processingStatus?.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              {PROCESSING_STATUS_CONFIG[status].labelEs}
              <button
                onClick={() => onFiltersChange({ ...filters, processingStatus: undefined })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.dateFrom && (
            <Badge variant="secondary" className="gap-1">
              Desde: {format(new Date(filters.dateFrom), 'dd/MM/yy', { locale: es })}
              <button
                onClick={() => onFiltersChange({ ...filters, dateFrom: undefined })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.dateTo && (
            <Badge variant="secondary" className="gap-1">
              Hasta: {format(new Date(filters.dateTo), 'dd/MM/yy', { locale: es })}
              <button
                onClick={() => onFiltersChange({ ...filters, dateTo: undefined })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

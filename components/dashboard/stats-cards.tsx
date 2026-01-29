'use client'

import { Card, CardContent } from '@/components/ui/card'
import { FileText, Clock, CheckCircle, AlertTriangle, TrendingUp, Euro } from 'lucide-react'
import type { DocumentStats } from '@/lib/types'

interface StatsCardsProps {
  stats: DocumentStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Documentos',
      value: stats.totalDocuments,
      description: 'En el sistema',
      icon: FileText,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Pendientes Revision',
      value: stats.pendingReview,
      description: 'Requieren atencion',
      icon: Clock,
      trend: stats.pendingReview > 0 ? 'Pendiente' : 'Al dia',
      trendUp: stats.pendingReview === 0,
    },
    {
      title: 'Procesados Hoy',
      value: stats.processedToday,
      description: 'Documentos completados',
      icon: CheckCircle,
      trend: '+3 vs ayer',
      trendUp: true,
    },
    {
      title: 'Confianza Media',
      value: `${Math.round(stats.avgConfidence)}%`,
      description: 'Precision IA',
      icon: TrendingUp,
      trend: 'Excelente',
      trendUp: stats.avgConfidence > 80,
    },
    {
      title: 'Importe Total',
      value: new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(stats.totalAmount),
      description: 'Facturas procesadas',
      icon: Euro,
      trend: 'Este mes',
      trendUp: true,
    },
    {
      title: 'Errores',
      value: stats.byStatus.FAILED,
      description: 'Documentos fallidos',
      icon: AlertTriangle,
      trend: stats.byStatus.FAILED > 0 ? 'Revisar' : 'Sin errores',
      trendUp: stats.byStatus.FAILED === 0,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <card.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <span
                className={`text-xs font-medium ${
                  card.trendUp ? 'text-green-400' : 'text-yellow-400'
                }`}
              >
                {card.trend}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-card-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

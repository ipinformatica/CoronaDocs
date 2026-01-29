'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts'
import type { DocumentStats } from '@/lib/types'
import { DOCUMENT_TYPE_CONFIG } from '@/lib/types'

interface ChartsProps {
  stats: DocumentStats
  monthlyData: Array<{ month: string; facturas: number; albaranes: number; total: number }>
  topProviders: Array<{ name: string; amount: number; count: number }>
}

const COLORS = ['#60a5fa', '#4ade80', '#fb923c', '#a78bfa', '#f87171', '#94a3b8']

export function DashboardCharts({ stats, monthlyData, topProviders }: ChartsProps) {
  // Prepare pie chart data
  const pieData = Object.entries(stats.byType)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: DOCUMENT_TYPE_CONFIG[key as keyof typeof DOCUMENT_TYPE_CONFIG].labelEs,
      value,
      code: DOCUMENT_TYPE_CONFIG[key as keyof typeof DOCUMENT_TYPE_CONFIG].code,
    }))

  // Prepare status data
  const statusData = Object.entries(stats.byStatus)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: key,
      value,
    }))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Monthly Trend */}
      <Card className="col-span-2 bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Evolucion Mensual</CardTitle>
          <CardDescription>Documentos procesados por mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorFacturas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAlbaranes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="facturas"
                  stroke="#60a5fa"
                  fillOpacity={1}
                  fill="url(#colorFacturas)"
                  name="Facturas"
                />
                <Area
                  type="monotone"
                  dataKey="albaranes"
                  stroke="#4ade80"
                  fillOpacity={1}
                  fill="url(#colorAlbaranes)"
                  name="Albaranes"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Document Type Distribution */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Por Tipo</CardTitle>
          <CardDescription>Distribucion de documentos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${entry.code}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {pieData.map((entry, index) => (
              <div key={entry.code} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs text-muted-foreground truncate">
                  {entry.code}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Providers */}
      <Card className="col-span-2 bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Top Proveedores</CardTitle>
          <CardDescription>Por volumen de facturacion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProviders} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#888" fontSize={12} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#888"
                  fontSize={11}
                  width={140}
                  tickFormatter={(v) => v.length > 18 ? `${v.slice(0, 18)}...` : v}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) =>
                    new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(value)
                  }
                />
                <Bar dataKey="amount" fill="#60a5fa" radius={[0, 4, 4, 0]} name="Importe" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Estado Procesamiento</CardTitle>
          <CardDescription>Documentos por estado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusData.map((status, index) => {
              const total = stats.totalDocuments
              const percentage = total > 0 ? (status.value / total) * 100 : 0
              return (
                <div key={status.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{status.name}</span>
                    <span className="font-medium text-card-foreground">{status.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

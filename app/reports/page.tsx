"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Download,
  Calendar as CalendarIcon,
  FileText,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

const reportTypes = [
  {
    id: "procesamiento",
    title: "Informe de Procesamiento",
    description: "Estadísticas de documentos procesados por período",
    icon: BarChart3,
  },
  {
    id: "clasificacion",
    title: "Informe de Clasificación",
    description: "Distribución de documentos por tipo y proveedor",
    icon: PieChart,
  },
  {
    id: "errores",
    title: "Informe de Errores",
    description: "Documentos con errores de validación o procesamiento",
    icon: AlertTriangle,
  },
  {
    id: "exportacion",
    title: "Informe de Exportación",
    description: "Historial de exportaciones a DistritoK",
    icon: FileSpreadsheet,
  },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [generating, setGenerating] = useState(false)

  const handleGenerateReport = () => {
    setGenerating(true)
    setTimeout(() => setGenerating(false), 2000)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Informes</h1>
          <p className="text-sm text-muted-foreground">
            Genera informes detallados del sistema de gestión documental
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-muted-foreground">Docs este mes</p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-emerald-500">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">94.2%</p>
                <p className="text-xs text-muted-foreground">Tasa de éxito</p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-emerald-500">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/10 p-2">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">2.3s</p>
                <p className="text-xs text-muted-foreground">Tiempo promedio</p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-red-500">
                <ArrowDownRight className="h-4 w-4" />
                <span className="text-sm font-medium">0.5s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">87.5%</p>
                <p className="text-xs text-muted-foreground">Precisión IA</p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-emerald-500">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">3.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report Types */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-medium">Tipos de Informe</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {reportTypes.map((report) => (
              <Card
                key={report.id}
                className={cn(
                  "cursor-pointer border-border/50 bg-card/50 transition-all hover:border-primary/50",
                  selectedReport === report.id && "border-primary ring-1 ring-primary"
                )}
                onClick={() => setSelectedReport(report.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <report.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {report.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Report Configuration */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Configuración</CardTitle>
            <CardDescription>Ajusta los parámetros del informe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Documento</label>
              <Select defaultValue="todos">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="factura">Facturas</SelectItem>
                  <SelectItem value="albaran">Albaranes</SelectItem>
                  <SelectItem value="dua">DUAs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Desde</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Hasta</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Formato de Salida</label>
              <Select defaultValue="excel">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={handleGenerateReport}
              disabled={!selectedReport || generating}
            >
              {generating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generar Informe
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Informes Recientes</CardTitle>
          <CardDescription>Historial de informes generados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: "Informe de Procesamiento - Enero 2026",
                type: "procesamiento",
                date: "28 Ene 2026",
                size: "2.4 MB",
                status: "completado",
              },
              {
                name: "Informe de Clasificación - Q4 2025",
                type: "clasificacion",
                date: "15 Ene 2026",
                size: "1.8 MB",
                status: "completado",
              },
              {
                name: "Informe de Errores - Diciembre 2025",
                type: "errores",
                date: "02 Ene 2026",
                size: "892 KB",
                status: "completado",
              },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <FileSpreadsheet className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.date} - {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                    {report.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

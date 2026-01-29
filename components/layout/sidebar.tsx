'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Upload,
  Download,
  Settings,
  FolderSync,
  Search,
  FileCheck,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Documentos', href: '/documents', icon: FileText },
  { name: 'Subir', href: '/upload', icon: Upload },
  { name: 'Exportar', href: '/export', icon: Download },
  { name: 'Configuracion', href: '/settings', icon: Settings },
]

const secondaryNavigation = [
  { name: 'Buscar', href: '/search', icon: Search },
  { name: 'Sincronizar', href: '/sync', icon: FolderSync },
  { name: 'Validacion ERP', href: '/validation', icon: FileCheck },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <FileText className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground">DocManager</span>
          <span className="text-xs text-muted-foreground">Gestion Documental</span>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Principal
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}

        <div className="mb-2 mt-6 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Herramientas
        </div>
        {secondaryNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Sync Status */}
      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-sidebar-foreground">
              Sincronizado
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Ultima sincronizacion: hace 5 min
          </p>
        </div>
      </div>
    </aside>
  )
}

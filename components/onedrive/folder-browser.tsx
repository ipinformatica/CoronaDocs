'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Folder,
  FolderOpen,
  File,
  ChevronRight,
  ChevronLeft,
  Home,
  Loader2,
  FileText,
  ImageIcon,
} from 'lucide-react'
import { oneDriveService } from '@/lib/onedrive'
import type { OneDriveItem } from '@/lib/types'

interface FolderBrowserProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (folder: { id: string; path: string; name: string }) => void
}

interface BreadcrumbItem {
  id: string
  name: string
  path: string
}

export function FolderBrowser({ open, onOpenChange, onSelect }: FolderBrowserProps) {
  const [items, setItems] = useState<OneDriveItem[]>([])
  const [loading, setLoading] = useState(false)
  const [currentFolder, setCurrentFolder] = useState<BreadcrumbItem | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [selectedFolder, setSelectedFolder] = useState<OneDriveItem | null>(null)

  const loadItems = useCallback(async (folderId?: string, folderName?: string, folderPath?: string) => {
    setLoading(true)
    try {
      const folderItems = folderId 
        ? await oneDriveService.getFolderItems(folderId)
        : await oneDriveService.getRootItems()
      
      setItems(folderItems)
      
      if (folderId && folderName) {
        const newBreadcrumb: BreadcrumbItem = {
          id: folderId,
          name: folderName,
          path: folderPath || `/${folderName}`,
        }
        setCurrentFolder(newBreadcrumb)
        setBreadcrumbs((prev) => {
          const existingIndex = prev.findIndex((b) => b.id === folderId)
          if (existingIndex >= 0) {
            return prev.slice(0, existingIndex + 1)
          }
          return [...prev, newBreadcrumb]
        })
      } else {
        setCurrentFolder(null)
        setBreadcrumbs([])
      }
    } catch (error) {
      console.error('Error loading OneDrive items:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      loadItems()
      setSelectedFolder(null)
    }
  }, [open, loadItems])

  const handleFolderClick = (item: OneDriveItem) => {
    if (item.folder) {
      const path = item.parentReference?.path 
        ? `${item.parentReference.path.replace('/drive/root:', '')}/${item.name}`
        : `/${item.name}`
      loadItems(item.id, item.name, path)
    }
  }

  const handleFolderSelect = (item: OneDriveItem) => {
    setSelectedFolder(item)
  }

  const handleNavigateBack = () => {
    if (breadcrumbs.length > 1) {
      const parentBreadcrumb = breadcrumbs[breadcrumbs.length - 2]
      loadItems(parentBreadcrumb.id, parentBreadcrumb.name, parentBreadcrumb.path)
    } else {
      loadItems()
    }
  }

  const handleNavigateToRoot = () => {
    loadItems()
    setSelectedFolder(null)
  }

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      handleNavigateToRoot()
    } else {
      const breadcrumb = breadcrumbs[index]
      loadItems(breadcrumb.id, breadcrumb.name, breadcrumb.path)
    }
  }

  const handleConfirm = () => {
    if (selectedFolder) {
      const path = selectedFolder.parentReference?.path 
        ? `${selectedFolder.parentReference.path.replace('/drive/root:', '')}/${selectedFolder.name}`
        : `/${selectedFolder.name}`
      
      onSelect({
        id: selectedFolder.id,
        path,
        name: selectedFolder.name,
      })
      onOpenChange(false)
    } else if (currentFolder) {
      onSelect({
        id: currentFolder.id,
        path: currentFolder.path,
        name: currentFolder.name,
      })
      onOpenChange(false)
    }
  }

  const getFileIcon = (item: OneDriveItem) => {
    if (item.folder) {
      return selectedFolder?.id === item.id ? (
        <FolderOpen className="h-5 w-5 text-blue-400" />
      ) : (
        <Folder className="h-5 w-5 text-muted-foreground" />
      )
    }
    
    const mimeType = item.file?.mimeType || ''
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-muted-foreground" />
    }
    if (mimeType === 'application/pdf' || item.name.endsWith('.pdf')) {
      return <FileText className="h-5 w-5 text-red-400" />
    }
    return <File className="h-5 w-5 text-muted-foreground" />
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  const folders = items.filter((item) => item.folder)
  const files = items.filter((item) => !item.folder)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">
            Seleccionar Carpeta de OneDrive
          </DialogTitle>
          <DialogDescription>
            Navega y selecciona la carpeta que deseas sincronizar
          </DialogDescription>
        </DialogHeader>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 py-2 px-1 bg-secondary/50 rounded-lg overflow-x-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNavigateToRoot}
            className="shrink-0 gap-1 h-7 px-2"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">OneDrive</span>
          </Button>
          
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id} className="flex items-center gap-1 shrink-0">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBreadcrumbClick(index)}
                className="h-7 px-2 truncate max-w-[120px]"
              >
                {crumb.name}
              </Button>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNavigateBack}
            disabled={breadcrumbs.length === 0}
            className="gap-1 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
            Atras
          </Button>
          
          {selectedFolder && (
            <Badge className="bg-blue-500/20 text-blue-400">
              Seleccionado: {selectedFolder.name}
            </Badge>
          )}
        </div>

        {/* Items List */}
        <ScrollArea className="h-[300px] rounded-lg border border-border">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {folders.length === 0 && files.length === 0 && (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  Esta carpeta esta vacia
                </div>
              )}
              
              {/* Folders first */}
              {folders.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedFolder?.id === item.id
                      ? 'bg-blue-500/20 border border-blue-500/50'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => handleFolderSelect(item)}
                  onDoubleClick={() => handleFolderClick(item)}
                >
                  {getFileIcon(item)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.folder?.childCount || 0} elementos
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFolderClick(item)
                    }}
                    className="shrink-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Files (for reference) */}
              {files.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-lg opacity-50"
                >
                  {getFileIcon(item)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-card-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(item.size)}
                    </p>
                  </div>
                </div>
              ))}

              {files.length > 5 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  +{files.length - 5} archivos mas
                </p>
              )}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedFolder && !currentFolder}
          >
            {selectedFolder 
              ? `Seleccionar "${selectedFolder.name}"`
              : currentFolder
                ? `Usar carpeta actual`
                : 'Seleccionar carpeta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

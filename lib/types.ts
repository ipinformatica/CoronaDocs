// Document Types
export type DocumentType =
  | 'ALBARAN_COMPRA'
  | 'ALBARAN_VENTA'
  | 'FACTURA_COMPRA'
  | 'FACTURA_VENTA'
  | 'DESPACHO_ADUANERO'
  | 'DESCONOCIDO'

export type ProcessingStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'MANUAL_REVIEW'

// Document interface
export interface Document {
  id: string
  uuid: string
  fileName: string
  filePath: string
  cloudPath?: string
  fileSize: number
  fileHash: string
  documentType: DocumentType
  
  // Extracted data
  fechaDocumento?: string
  proveedorCliente?: string
  cifNif?: string
  numeroDocumento?: string
  baseImponible?: number
  iva?: number
  retencion?: number
  totalFactura?: number
  
  // Processing metadata
  processingStatus: ProcessingStatus
  confidenceScore?: number
  ocrText?: string
  rawAnalysisJson?: string
  
  // Organization
  originalPath?: string
  organizedAt?: string
  isManuallyVerified: boolean
  verificationNotes?: string
  
  // ERP integration
  erpValidated: boolean
  erpAlmacen?: string
  erpSerie?: string
  erpFormaPago?: string
  erpSyncStatus?: string
  
  // Timestamps
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

// Filters
export interface DocumentFilters {
  documentType?: DocumentType[]
  dateFrom?: string
  dateTo?: string
  proveedorSearch?: string
  minAmount?: number
  maxAmount?: number
  processingStatus?: ProcessingStatus[]
  erpValidated?: boolean
  manuallyVerified?: boolean
  search?: string
}

// Stats
export interface DocumentStats {
  totalDocuments: number
  pendingReview: number
  processedToday: number
  processedThisMonth: number
  byType: Record<DocumentType, number>
  byStatus: Record<ProcessingStatus, number>
  totalAmount: number
  avgConfidence: number
}

// Export config
export interface ExportConfig {
  selectedDocuments: string[]
  exportFormat: 'DISTRITO_K'
  dateRangeFilter?: { from: string; to: string }
  documentTypeFilter?: DocumentType[]
  defaultAlmacen: number
  defaultFormaPago: number
  serieMapping: Record<DocumentType, string>
}

// Sync config
export interface SyncConfig {
  sourcePath: string
  isOneDrive: boolean
  autoSync: boolean
  syncIntervalMinutes: number
  fileExtensions: string[]
}

// Audit log
export interface AuditLog {
  id: string
  documentId?: string
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'CLASSIFY' | 'EXPORT' | 'VERIFY'
  user: string
  ipAddress?: string
  changesJson?: string
  timestamp: string
}

// Provider master
export interface Provider {
  id: string
  cif: string
  nombreFiscal: string
  erpCodigo?: string
  lastValidatedAt?: string
  isActive: boolean
  createdAt: string
}

// API responses
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Document type labels and colors
export const DOCUMENT_TYPE_CONFIG: Record<DocumentType, { label: string; labelEs: string; color: string; code: string }> = {
  FACTURA_COMPRA: { label: 'Purchase Invoice', labelEs: 'Factura Compra', color: 'bg-blue-500/20 text-blue-400', code: 'FC' },
  FACTURA_VENTA: { label: 'Sales Invoice', labelEs: 'Factura Venta', color: 'bg-green-500/20 text-green-400', code: 'FV' },
  ALBARAN_COMPRA: { label: 'Purchase Delivery Note', labelEs: 'Albarán Compra', color: 'bg-orange-500/20 text-orange-400', code: 'AC' },
  ALBARAN_VENTA: { label: 'Sales Delivery Note', labelEs: 'Albarán Venta', color: 'bg-purple-500/20 text-purple-400', code: 'AV' },
  DESPACHO_ADUANERO: { label: 'Customs Declaration', labelEs: 'Despacho Aduanero', color: 'bg-red-500/20 text-red-400', code: 'DA' },
  DESCONOCIDO: { label: 'Unknown', labelEs: 'Desconocido', color: 'bg-gray-500/20 text-gray-400', code: 'UN' },
}

export const PROCESSING_STATUS_CONFIG: Record<ProcessingStatus, { label: string; labelEs: string; color: string }> = {
  PENDING: { label: 'Pending', labelEs: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400' },
  PROCESSING: { label: 'Processing', labelEs: 'Procesando', color: 'bg-blue-500/20 text-blue-400' },
  COMPLETED: { label: 'Completed', labelEs: 'Completado', color: 'bg-green-500/20 text-green-400' },
  FAILED: { label: 'Failed', labelEs: 'Fallido', color: 'bg-red-500/20 text-red-400' },
  MANUAL_REVIEW: { label: 'Manual Review', labelEs: 'Revisión Manual', color: 'bg-orange-500/20 text-orange-400' },
}

// DistritoK document type mapping
export const DISTRITO_K_DOC_TYPES: Record<DocumentType, number> = {
  FACTURA_VENTA: 0,
  FACTURA_COMPRA: 1,
  ALBARAN_VENTA: 2,
  ALBARAN_COMPRA: 3,
  DESPACHO_ADUANERO: 4,
  DESCONOCIDO: 1,
}

// Default series mapping
export const DEFAULT_SERIES: Record<DocumentType, string> = {
  FACTURA_VENTA: 'O',
  FACTURA_COMPRA: 'FC',
  ALBARAN_VENTA: 'AV',
  ALBARAN_COMPRA: 'AC',
  DESPACHO_ADUANERO: 'DA',
  DESCONOCIDO: 'UN',
}

// OneDrive Types
export interface OneDriveConfig {
  clientId: string
  tenantId: string
  redirectUri: string
  scopes: string[]
}

export interface OneDriveToken {
  accessToken: string
  refreshToken: string
  expiresAt: number
  scope: string
}

export interface OneDriveUser {
  id: string
  displayName: string
  mail: string
  userPrincipalName: string
}

export interface OneDriveItem {
  id: string
  name: string
  size: number
  lastModifiedDateTime: string
  createdDateTime: string
  webUrl: string
  parentReference?: {
    driveId: string
    id: string
    path: string
  }
  folder?: {
    childCount: number
  }
  file?: {
    mimeType: string
    hashes?: {
      sha256Hash?: string
    }
  }
  '@microsoft.graph.downloadUrl'?: string
}

export interface OneDriveDrive {
  id: string
  name: string
  driveType: 'personal' | 'business' | 'documentLibrary'
  owner?: {
    user?: OneDriveUser
  }
  quota?: {
    total: number
    used: number
    remaining: number
  }
}

export interface OneDriveSyncConfig {
  enabled: boolean
  folderId?: string
  folderPath?: string
  autoSync: boolean
  syncIntervalMinutes: number
  lastSyncAt?: string
  fileExtensions: string[]
}

export interface OneDriveSyncLog {
  id: string
  timestamp: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  details?: string
  filesProcessed?: number
  filesSkipped?: number
  errors?: string[]
}

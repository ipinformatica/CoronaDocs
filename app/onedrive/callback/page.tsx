'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { oneDriveService } from '@/lib/onedrive'

export default function OneDriveCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Conectando con OneDrive...')

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      
      if (!code) {
        setStatus('error')
        setMessage('No se recibio codigo de autorizacion')
        return
      }

      try {
        // Exchange code for token
        await oneDriveService.exchangeCodeForToken(code)
        
        // Get user info
        await oneDriveService.getCurrentUser()
        
        setStatus('success')
        setMessage('Conexion exitosa con OneDrive')
        
        // Notify parent window if this is a popup
        if (window.opener) {
          window.opener.postMessage({ type: 'ONEDRIVE_AUTH_SUCCESS' }, '*')
          // Close the popup after a short delay
          setTimeout(() => window.close(), 1500)
        } else {
          // Redirect to settings after 2 seconds if not a popup
          setTimeout(() => {
            router.push('/settings?tab=sync&onedrive_success=true')
          }, 2000)
        }
      } catch (error) {
        console.error('OneDrive callback error:', error)
        setStatus('error')
        setMessage('Error al conectar con OneDrive')
        
        // Notify parent window if this is a popup
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'ONEDRIVE_AUTH_ERROR', 
            error: error instanceof Error ? error.message : 'Error desconocido' 
          }, '*')
          setTimeout(() => window.close(), 2000)
        } else {
          setTimeout(() => {
            router.push('/settings?tab=sync&onedrive_error=connection_failed')
          }, 3000)
        }
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            {status === 'loading' && (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
                  <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">
                    Conectando...
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {message}
                  </p>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">
                    Conectado
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Redirigiendo a configuracion...
                  </p>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                  <XCircle className="h-8 w-8 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">
                    Error de Conexion
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Redirigiendo...
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// src/components/feature/Document/DocumentSidebar.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { documentsAPI } from '@/lib/api/client'

interface Document {
  id: string
  filename: string
  size: number
  upload_time: string
  status: string
  type: string
}

export function DocumentSidebar() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Load documents on mount
  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      console.log('📋 Loading documents...')
      setIsLoading(true)
      const docs = await documentsAPI.list()
      console.log('📄 Documents loaded:', docs)
      setDocuments(docs)
      setError('')
    } catch (err) {
      console.error('❌ Failed to load documents:', err)
      setError('Failed to load documents')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('📤 Starting upload:', file.name)
    setIsUploading(true)
    setError('')

    try {
      const result = await documentsAPI.upload(file)
      console.log('✅ Upload successful:', result)
      
      // Reload documents list
      await loadDocuments()
      
      // Clear the input
      event.target.value = ''
      
    } catch (err) {
      console.error('❌ Upload failed:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (docId: string, filename: string) => {
    if (!confirm(`Delete "${filename}"?`)) return

    try {
      console.log('🗑️ Deleting document:', filename)
      await documentsAPI.delete(docId)
      console.log('✅ Document deleted')
      
      // Reload documents list
      await loadDocuments()
      
    } catch (err) {
      console.error('❌ Delete failed:', err)
      setError('Failed to delete document')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = (now.getTime() - date.getTime()) / 1000
    const diffInMinutes = diffInSeconds / 60
    const diffInHours = diffInMinutes / 60
    const diffInDays = diffInHours / 24

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    if (diffInDays < 7) return `${Math.floor(diffInDays)}d ago`
    return date.toLocaleDateString()
  }

  const getFileIcon = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄'
      case 'txt': return '📝'
      case 'docx': case 'doc': return '📘'
      case 'md': return '📋'
      default: return '📄'
    }
  }

  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0)
  const maxSize = 20 * 1024 * 1024 // 20MB
  const usagePercent = (totalSize / maxSize) * 100

  return (
    <div className="w-80 border-r bg-muted/30 p-4">
      <h2 className="font-semibold mb-4 text-foreground">📁 Documents</h2>
      
      {/* Upload Button */}
      <div className="mb-4">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.txt,.docx,.md"
          onChange={handleUpload}
          disabled={isUploading}
        />
        <label htmlFor="file-upload">
          <Button 
            className="w-full" 
            disabled={isUploading}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('file-upload')?.click()
            }}
          >
            {isUploading ? '⏳ Uploading...' : '📁 Upload Document'}
          </Button>
        </label>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          ❌ {error}
          <button 
            onClick={() => setError('')}
            className="float-right text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-2 mb-6">
        {isLoading ? (
          <div className="text-center text-muted-foreground">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent mx-auto mb-2"></div>
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center text-muted-foreground p-4 border-2 border-dashed rounded-lg">
            <div className="text-4xl mb-2">📄</div>
            <div>No documents uploaded</div>
            <div className="text-xs">Upload some files to get started!</div>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="p-3 border rounded bg-card hover:bg-accent transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getFileIcon(doc.type)}</span>
                    <div className="text-sm font-medium truncate">
                      {doc.filename}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatFileSize(doc.size)} • {formatDate(doc.upload_time)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Status: <span className="text-green-600">✅ {doc.status}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id, doc.filename)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity text-sm"
                  title="Delete document"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Storage Info */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <div className="text-xs text-muted-foreground mb-1">Storage Used</div>
        <div className="w-full bg-background rounded-full h-2 mb-1">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{width: `${Math.min(usagePercent, 100)}%`}}
          ></div>
        </div>
        <div className="text-xs text-muted-foreground">
          {formatFileSize(totalSize)} of {formatFileSize(maxSize)} ({documents.length} files)
        </div>
      </div>

      {/* Backend Connection Status */}
      <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-xs">
        ✅ Connected to Backend
        <div className="text-green-600">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}</div>
      </div>
    </div>
  )
}
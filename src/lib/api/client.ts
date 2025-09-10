// src/lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'APIError'
  }
}

class APIClient {
  private baseURL: string
  
  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    console.log(`🔗 API Request: ${options?.method || 'GET'} ${url}`)
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...(!(options?.body instanceof FormData) && { 'Content-Type': 'application/json' }),
          ...options?.headers,
        },
      })

      if (!response.ok) {
        const error = await response.text()
        console.error(`❌ API Error: ${response.status} - ${error}`)
        throw new APIError(response.status, error)
      }

      const data = await response.json()
      console.log(`✅ API Success:`, data)
      return data
    } catch (error) {
      console.error('🚨 API Request failed:', error)
      throw error
    }
  }
}

export const apiClient = new APIClient(API_BASE_URL)

// Export API_BASE_URL để các component khác sử dụng
export { API_BASE_URL }

// Chat API
export const chatAPI = {
  sendMessage: async (message: string, conversationId?: string) => {
    return apiClient.request<any>('/api/v1/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        message, 
        conversation_id: conversationId 
      })
    })
  },
    
  getHistory: async (conversationId: string) => {
    return apiClient.request<any>(`/api/v1/chat/history/${conversationId}`)
  },
}

// Documents API
export const documentsAPI = {
  upload: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiClient.request<any>('/api/v1/documents/upload', {
      method: 'POST',
      body: formData,
    })
  },
  
  list: async () => {
    return apiClient.request<any[]>('/api/v1/documents')
  },
  
  delete: async (id: string) => {
    return apiClient.request(`/api/v1/documents/${id}`, { 
      method: 'DELETE' 
    })
  },
}
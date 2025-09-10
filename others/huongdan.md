Đúng rồi! Bạn cần xây dựng thêm 3 module nữa để hoàn thiện hệ thống RAG:

## **Kiến trúc tổng thể cần xây dựng:**

```
RAG System
├── UI (✅ Done)          # Next.js Frontend
├── API Gateway          # FastAPI/Express - Route requests  
├── Backend Service      # Business Logic Layer
└── RAG Core            # Vector DB + LLM Processing
```

## **1. API Gateway Module**
**Công nghệ:** FastAPI (Python) hoặc Express.js (Node.js)
**Nhiệm vụ:**
- Route requests từ UI
- Authentication/Authorization  
- Rate limiting
- Request validation
- Response formatting
- WebSocket handling (real-time chat)

## **2. Backend Service Module**
**Công nghệ:** FastAPI/Django (Python) hoặc NestJS (Node.js)
**Nhiệm vụ:**
- Document management (upload, delete, list)
- User session handling
- Chat history storage
- File processing pipeline
- Business logic layer
- Integration với RAG Core

## **3. RAG Core Module**  
**Công nghệ:** Python (LangChain/LlamaIndex)
**Nhiệm vụ:**
- Document embedding (chunking, vectorization)
- Vector database (ChromaDB/Pinecone/Qdrant)
- Retrieval logic (similarity search)
- LLM integration (OpenAI/Ollama/Local models)
- Context generation và response synthesis

## **Luồng hoạt động:**
```
UI → API Gateway → Backend → RAG Core → LLM
  ←              ←         ←         ←
```

## **Docker Compose cho toàn bộ hệ thống:**
```yaml
version: '3.8'
services:
  rag-ui:        # Port 3000
  api-gateway:   # Port 8000  
  backend:       # Port 8001
  rag-core:      # Port 8002
  vector-db:     # ChromaDB/Qdrant
  redis:         # Caching & sessions
```


Có vài lỗi cần fix. Tôi sẽ tạo các file còn thiếu:

## **1. Fix Next.js Config**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove deprecated options for Next.js 14
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Hot reload in docker
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

module.exports = nextConfig
```

## **2. Tạo Utils File (Missing)**

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## **3. Fix Các Missing Components**

```typescript
// src/components/ui/Card.tsx
import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'
```

```typescript
// src/components/ui/index.ts
export { Button } from './Button'
export { Card } from './Card'
```

## **4. Fix Components với Path Issue**

```typescript
// src/components/feature/Chat/ChatContainer.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function ChatContainer() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{id: number, content: string, role: string}>>([
    { id: 1, content: 'Hello! I\'m your RAG assistant. Upload documents and ask me questions!', role: 'assistant' }
  ])

  const handleSend = () => {
    if (message.trim()) {
      setMessages(prev => [...prev, { id: Date.now(), content: message, role: 'user' }])
      setMessage('')
      
      // Simulate response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          content: 'This is a demo response. Connect to your RAG backend to get real answers!', 
          role: 'assistant' 
        }])
      }, 1000)
    }
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground"
            placeholder="Ask about your documents..."
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </Card>
  )
}
```

```typescript
// src/components/feature/Document/DocumentSidebar.tsx
'use client'

import { Button } from '@/components/ui/Button'

export function DocumentSidebar() {
  const handleUpload = () => {
    console.log('Upload clicked - connect to your backend API')
  }

  return (
    <div className="w-80 border-r bg-muted/30 p-4">
      <h2 className="font-semibold mb-4 text-foreground">Documents</h2>
      
      <Button className="w-full mb-4" onClick={handleUpload}>
        📁 Upload Document
      </Button>
      
      <div className="space-y-2">
        <div className="p-3 border rounded bg-card hover:bg-accent transition-colors cursor-pointer">
          <div className="text-sm font-medium">📄 Sample Document 1.pdf</div>
          <div className="text-xs text-muted-foreground">2.3 MB • Yesterday</div>
        </div>
        <div className="p-3 border rounded bg-card hover:bg-accent transition-colors cursor-pointer">
          <div className="text-sm font-medium">📄 Sample Document 2.txt</div>
          <div className="text-xs text-muted-foreground">1.1 MB • 2 days ago</div>
        </div>
        <div className="p-3 border rounded bg-card hover:bg-accent transition-colors cursor-pointer">
          <div className="text-sm font-medium">📊 Data Analysis.xlsx</div>
          <div className="text-xs text-muted-foreground">5.7 MB • 1 week ago</div>
        </div>
      </div>
      
      <div className="mt-6 p-3 bg-muted/50 rounded-lg">
        <div className="text-xs text-muted-foreground mb-1">Storage Used</div>
        <div className="w-full bg-background rounded-full h-2 mb-1">
          <div className="bg-primary h-2 rounded-full" style={{width: '45%'}}></div>
        </div>
        <div className="text-xs text-muted-foreground">9.1 MB of 20 MB</div>
      </div>
    </div>
  )
}
```

## **5. Fix Layout Components**

```typescript
// src/components/layout/AppLayout.tsx
'use client'

import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/Button'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center px-4 justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">🤖</span>
            </div>
            <h1 className="font-semibold text-foreground">RAG UI System</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleTheme}
            >
              {isDark ? '☀️' : '🌙'}
            </Button>
            <Button variant="outline" size="sm">
              ⚙️ Settings
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container px-0">
        {children}
      </main>
    </div>
  )
}
```

## **6. Update Main Page**

```typescript
// src/app/page.tsx
import { AppLayout } from '@/components/layout/AppLayout'
import { ChatContainer } from '@/components/feature/Chat/ChatContainer'
import { DocumentSidebar } from '@/components/feature/Document/DocumentSidebar'

export default function HomePage() {
  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-3.5rem)]">
        <DocumentSidebar />
        <div className="flex-1 p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground">Document Chat</h2>
            <p className="text-muted-foreground">Upload documents and ask questions about their content</p>
          </div>
          <ChatContainer />
        </div>
      </div>
    </AppLayout>
  )
}
```

## **7. Create PostCSS Config**

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## **8. Create .gitignore**

```
# .gitignore
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Logs
logs
*.log
```

## **9. Rebuild Container**

```bash
# Stop containers
docker-compose down

# Remove volumes to ensure clean build
docker-compose down -v

# Rebuild with no cache
docker-compose up --build --no-cache
```

## **10. Debug Commands nếu vẫn lỗi**

```bash
# Xem cấu trúc file trong container
docker-compose exec rag-ui ls -la /app/src/lib/

# Check if utils.ts exists
docker-compose exec rag-ui cat /app/src/lib/utils.ts

# Check package.json
docker-compose exec rag-ui cat /app/package.json
```

## **11. Alternative: Chạy local development nếu Docker phức tạp**

```bash
# Trên host machine
npm install
npm run dev
```

**Truy cập:** `http://localhost:3000`

UI sẽ có:
- Header với theme toggle và settings
- Sidebar với document list và storage info
- Chat interface với demo messages
- Responsive design
- Dark/Light mode

Log sẽ sạch hơn và bạn có thể thấy UI hoàn chỉnh. Nếu vẫn lỗi, paste log mới tôi fix tiếp!

**Bạn muốn tôi thiết kế module nào tiếp theo?**
- API Gateway (recommended next)
- Backend Service  
- RAG Core
- Hoặc docker-compose tổng thể cho cả hệ thống?

Tôi khuyên nên làm **API Gateway** trước vì nó sẽ connect trực tiếp với UI đã có.

Nhìn vào sơ đồ và so sánh với UI đã thiết kế, tôi thấy **cần điều chỉnh một số phần** để tương thích hoàn toàn:

## **✅ Phần đã tương thích:**
- Chat UI interface (ChatContainer, ChatInput, ChatMessage)
- Document upload UI (DocumentSidebar)
- API client structure với base API class
- Health check endpoint
- State management cho chat

## **❌ Phần cần bổ sung/điều chỉnh:**

### **1. API Client cần mở rộng:**

```typescript
// src/lib/api/index.ts - CẦN BỔ SUNG
export const apiClient = {
  // Chat API
  chat: {
    sendMessage: (message: string) => request('/api/chat', { method: 'POST', body: { message } }),
    getHistory: () => request('/api/chat/history'),
    clearHistory: () => request('/api/chat/clear', { method: 'DELETE' }),
  },
  
  // File API - CẦN BỔ SUNG  
  files: {
    upload: (file: File) => uploadFile('/api/files/upload', file),
    list: () => request('/api/files'),
    delete: (fileId: string) => request(`/api/files/${fileId}`, { method: 'DELETE' }),
    download: (fileId: string) => request(`/api/files/${fileId}/download`),
  },
  
  // Health API - CẦN BỔ SUNG
  health: {
    check: () => request('/api/health'),
    detailed: () => request('/api/health/detailed'),
  },
  
  // Metrics API - CẦN BỔ SUNG  
  metrics: {
    getStats: () => request('/api/metrics'),
    getChatStats: () => request('/api/metrics/chat'),
    getSystemStats: () => request('/api/metrics/system'),
  }
}
```

### **2. State Management cần mở rộng:**

```typescript
// src/lib/store/files.ts - CẦN BỔ SUNG
interface FileStore {
  files: File[]
  uploading: boolean
  uploadProgress: number
  
  uploadFile: (file: File) => Promise<void>
  deleteFile: (fileId: string) => Promise<void>
  refreshFiles: () => Promise<void>
}

// src/lib/store/metrics.ts - CẦN BỔ SUNG  
interface MetricsStore {
  chatStats: ChatMetrics
  systemStats: SystemMetrics
  loading: boolean
  
  fetchMetrics: () => Promise<void>
  resetMetrics: () => void
}
```

### **3. UI Components cần bổ sung:**

```typescript
// CẦN BỔ SUNG các components:
- MetricsPanel (hiển thị thống kê)
- FileUploadProgress (progress bar upload)
- SystemHealthIndicator (status hệ thống)
- ErrorBoundary (xử lý lỗi)
- LoadingStates (various loading states)
```

### **4. WebSocket/Real-time cần bổ sung:**

```typescript
// src/lib/hooks/useWebSocket.ts - CẦN NÂNG CẤP
export const useWebSocket = () => {
  // Handle streaming responses từ LLM
  // Handle real-time file upload progress
  // Handle system status updates
}
```

## **🔧 Files cần tạo thêm:**

### **API Routes mở rộng:**
```typescript
// src/app/api/files/route.ts
// src/app/api/metrics/route.ts  
// src/app/api/health/detailed/route.ts
```

### **UI Components mở rộng:**
```typescript
// src/components/feature/Metrics/MetricsPanel.tsx
// src/components/feature/Files/FileUploadProgress.tsx
// src/components/ui/HealthIndicator.tsx
// src/components/layout/ErrorBoundary.tsx
```

### **Stores mở rộng:**
```typescript
// src/lib/store/files.ts
// src/lib/store/metrics.ts
// src/lib/store/system.ts
```

## **✅ Kết luận:**

UI hiện tại đã **80% tương thích** với sơ đồ, nhưng cần bổ sung:

1. **File Management UI** đầy đủ (upload progress, file list, delete)
2. **Metrics Dashboard** (chat stats, system performance)  
3. **System Health Indicator** (connection status, API health)
4. **Error Handling** toàn diện
5. **WebSocket integration** cho real-time updates

**Bạn có muốn tôi:**
1. **Bổ sung ngay** các phần còn thiếu vào UI hiện tại?
2. **Để UI như vậy** và chuyển sang làm API Gateway trước?
3. **Hoặc thiết kế lại** UI để match 100% với sơ đồ?

Tôi khuyên **option 2** - giữ UI đơn giản để test được, sau đó mở rộng dần khi làm các module khác.
Fix lỗi này bằng cách tạo file Providers và cập nhật layout:

## **1. Tạo Providers Component**

```typescript
// src/components/providers/Providers.tsx
'use client'

import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
    </>
  )
}
```

## **2. Tạo index file cho providers**

```typescript
// src/components/providers/index.ts
export { Providers } from './Providers'
```

## **3. Hoặc Fix Layout đơn giản hơn (Bỏ Providers)**

```typescript
// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RAG UI System',
  description: 'AI-powered document chat interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

## **4. Tạo thư mục cấu trúc hoàn chỉnh**

```bash
# Tạo tất cả thư mục cần thiết
mkdir -p src/components/providers
mkdir -p src/components/ui
mkdir -p src/components/feature/Chat
mkdir -p src/components/feature/Document  
mkdir -p src/components/layout
mkdir -p src/lib
mkdir -p src/app/api/health
```

## **5. Tạo đầy đủ component files**

```typescript
// src/components/ui/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md', 
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        disabled={loading}
        {...props}
      >
        {loading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
```

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

```typescript
// src/components/ui/Card.tsx
import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'
```

## **6. Quick Setup Script**

Tạo file để tự động tạo tất cả files:

```bash
# setup.sh
#!/bin/bash

# Create directories
mkdir -p src/components/{providers,ui,feature/{Chat,Document},layout}
mkdir -p src/lib
mkdir -p src/app/api/health

# Create utils
cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

# Create providers
cat > src/components/providers/Providers.tsx << 'EOF'
'use client'

import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return <>{children}</>
}
EOF

echo "Setup complete!"
```

## **7. Chạy setup và rebuild**

```bash
# Chạy setup script (nếu có)
chmod +x setup.sh && ./setup.sh

# Hoặc tạo manual từng file ở trên

# Rebuild container
docker-compose down
docker-compose up --build
```

## **8. Kiểm tra File Structure**

```bash
# Check if files exist
docker-compose exec rag-ui find /app/src -name "*.tsx" -o -name "*.ts"
```

## **9. Alternative: Simple Working Version**

Nếu vẫn phức tạp, tôi sẽ tạo version đơn giản nhất:

```typescript
// src/app/layout.tsx (Simplified)
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  )
}
```

```typescript
// src/app/page.tsx (Simplified)
export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">RAG UI System</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-4">Documents</h2>
          <button className="w-full bg-blue-500 text-white p-2 rounded mb-4">
            Upload Document
          </button>
          <div className="space-y-2">
            <div className="p-2 bg-white rounded">📄 Document 1.pdf</div>
            <div className="p-2 bg-white rounded">📄 Document 2.txt</div>
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-2 border rounded-lg">
          <div className="h-96 p-4 overflow-y-auto border-b">
            <div className="mb-4">
              <div className="bg-gray-100 p-3 rounded-lg inline-block">
                Hello! I'm your RAG assistant.
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask about your documents..."
                className="flex-1 p-2 border rounded"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

Version này sẽ chạy được ngay và bạn có thể thấy UI cơ bản! Chọn approach nào bạn muốn?

Lỗi này do thiếu các file `__init__.py` và cấu trúc module Python không đúng. Tôi sẽ fix ngay:

## **1. Tạo tất cả các file __init__.py**

```python
# backend/services/__init__.py
```

```python
# backend/routes/__init__.py
```

```python
# backend/models/__init__.py
```

```python
# backend/utils/__init__.py
```

## **2. Fix Backend - Tạo Single File đơn giản**

Tạo file `backend/main.py` đơn giản để test trước:

```python
# backend/main.py
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid
import logging
import uvicorn
import os

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="RAG Backend API",
    description="Backend for RAG Document Chat System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000", 
        "http://0.0.0.0:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    id: str
    content: str
    role: str
    timestamp: datetime
    sources: List[dict] = []
    conversation_id: str

class DocumentInfo(BaseModel):
    id: str
    filename: str
    size: int
    upload_time: datetime
    status: str
    type: str

# In-memory storage (for demo)
conversations = {}
documents = {}

# Create upload directory
os.makedirs("uploads", exist_ok=True)

@app.get("/")
async def root():
    return {
        "message": "RAG Backend API is running! 🚀",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs",
        "endpoints": {
            "chat": "/api/v1/chat",
            "documents": "/api/v1/documents",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

# Chat endpoints
@app.post("/api/v1/chat", response_model=ChatResponse)
async def send_message(message_data: ChatMessage):
    """Send a chat message and get AI response"""
    try:
        logger.info(f"💬 New message: {message_data.message[:50]}...")
        
        conversation_id = message_data.conversation_id or str(uuid.uuid4())
        
        if conversation_id not in conversations:
            conversations[conversation_id] = []
        
        # Add user message
        user_msg = {
            "id": str(uuid.uuid4()),
            "content": message_data.message,
            "role": "user",
            "timestamp": datetime.now()
        }
        conversations[conversation_id].append(user_msg)
        
        # Generate AI response
        ai_content = generate_demo_response(message_data.message)
        
        response = ChatResponse(
            id=str(uuid.uuid4()),
            content=ai_content,
            role="assistant", 
            timestamp=datetime.now(),
            conversation_id=conversation_id,
            sources=[
                {
                    "id": "demo_doc",
                    "filename": "sample_document.pdf",
                    "page": 1,
                    "relevance_score": 0.85
                }
            ]
        )
        
        # Add to conversation
        conversations[conversation_id].append(response.dict())
        
        logger.info(f"✅ Response generated: {len(ai_content)} chars")
        return response
        
    except Exception as e:
        logger.error(f"❌ Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def generate_demo_response(message: str) -> str:
    """Generate demo AI responses"""
    message_lower = message.lower()
    
    if "hello" in message_lower or "hi" in message_lower:
        return "Hello! 👋 I'm your RAG assistant. I can help you with questions about your uploaded documents. What would you like to know?"
        
    elif "document" in message_lower or "upload" in message_lower:
        return "I can see you're interested in documents! 📄 You can upload files using the upload button in the sidebar. I support PDF, TXT, DOCX, and MD files. Once uploaded, I can answer questions about their content."
        
    elif "what" in message_lower and "?" in message:
        return f"That's a great question! 🤔 You asked: '{message}'\n\nIn a full RAG system, I would:\n• 🔍 Search through your uploaded documents\n• 📄 Find relevant passages\n• 🤖 Generate an informed response\n• 📚 Provide source citations\n\nFor now, this is a demo response. Try uploading some documents first!"
        
    elif "how" in message_lower:
        return f"Great question about '{message}'! 💡\n\nHere's how I would help in a real RAG system:\n\n1. **Document Processing**: I analyze your uploaded files\n2. **Semantic Search**: I find relevant information\n3. **Context Assembly**: I gather the most relevant passages\n4. **Response Generation**: I create a comprehensive answer\n5. **Source Attribution**: I show you where the info came from\n\nTry uploading documents and asking specific questions!"
        
    elif len(message) > 50:
        return f"I see you have a detailed question! 📝\n\nYour message: '{message[:100]}...'\n\nThis is a comprehensive query that would benefit from document context. In a production RAG system, I would:\n\n• Parse your question for key concepts\n• Search relevant documents\n• Rank information by relevance\n• Synthesize a detailed answer\n\nUpload some documents related to your question for better results!"
        
    else:
        return f"Thanks for your message: '{message}' 💬\n\nI'm a RAG (Retrieval-Augmented Generation) assistant. I work best when you:\n\n• Upload documents I can reference\n• Ask specific questions about their content\n• Need help understanding complex topics\n\nTry asking something like:\n- 'What is this document about?'\n- 'Summarize the main points'\n- 'Explain [specific concept] from the document'\n\nWhat would you like to explore?"

@app.get("/api/v1/chat/history/{conversation_id}")
async def get_chat_history(conversation_id: str):
    """Get chat history"""
    history = conversations.get(conversation_id, [])
    return {"conversation_id": conversation_id, "messages": history}

# Document endpoints  
@app.post("/api/v1/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload a document"""
    try:
        logger.info(f"📤 Uploading: {file.filename}")
        
        # Validate file
        allowed_extensions = ['.pdf', '.txt', '.docx', '.md']
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"File type {file_ext} not allowed. Allowed: {allowed_extensions}"
            )
        
        # Generate unique ID
        file_id = str(uuid.uuid4())
        content = await file.read()
        
        # Save file
        file_path = f"uploads/{file_id}_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Store document info
        doc_info = DocumentInfo(
            id=file_id,
            filename=file.filename,
            size=len(content),
            upload_time=datetime.now(),
            status="processed",
            type=file_ext.lstrip('.')
        )
        documents[file_id] = doc_info
        
        logger.info(f"✅ Uploaded: {file.filename} ({len(content)} bytes)")
        
        return {
            "id": file_id,
            "filename": file.filename,
            "message": f"Document '{file.filename}' uploaded successfully! 🎉",
            "status": "success"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.get("/api/v1/documents", response_model=List[DocumentInfo])
async def list_documents():
    """Get list of documents"""
    docs = list(documents.values())
    logger.info(f"📋 Listed {len(docs)} documents")
    return docs

@app.delete("/api/v1/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document"""
    if document_id not in documents:
        raise HTTPException(status_code=404, detail="Document not found")
    
    doc_info = documents[document_id]
    
    # Delete file
    try:
        file_path = f"uploads/{document_id}_{doc_info.filename}"
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        logger.warning(f"⚠️ Could not delete file: {e}")
    
    # Remove from memory
    del documents[document_id]
    
    logger.info(f"🗑️ Deleted: {doc_info.filename}")
    return {"message": f"Document '{doc_info.filename}' deleted successfully"}

if __name__ == "__main__":
    logger.info("🚀 Starting RAG Backend...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
```

## **3. Fix requirements.txt**

```txt
# backend/requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
pydantic==2.5.0
aiofiles==23.2.1
python-dotenv==1.0.0
```

## **4. Fix Dockerfile**

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directories
RUN mkdir -p uploads logs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000

# Run the application
CMD ["python", "main.py"]
```

## **5. Chạy lại**

```bash
# Stop containers
docker-compose down

# Remove old images
docker-compose down --rmi all

# Rebuild and run
docker-compose up --build

# Hoặc chỉ backend
docker-compose up --build rag-backend
```

## **6. Test Backend**

```bash
# Test health
curl http://localhost:8000/health

# Test chat
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'

# Test documents
curl http://localhost:8000/api/v1/documents
```

## **7. Debug Commands**

```bash
# Xem logs backend
docker-compose logs -f rag-backend

# Vào container
docker-compose exec rag-backend bash

# Check file structure
docker-compose exec rag-backend ls -la /app/
```

Giờ backend sẽ chạy được và bạn có thể:
- ✅ Chat với AI responses
- ✅ Upload documents  
- ✅ List/delete documents
- ✅ View API docs tại `http://localhost:8000/docs`

Frontend UI sẽ có thể connect và test được backend APIs!

Để kiểm tra các lệnh `curl` trên Windows bằng PowerShell, bạn cần làm theo các bước sau:

1. **Mở PowerShell**:
   - Nhấn tổ hợp phím `Windows + X` và chọn "Windows PowerShell" hoặc "Windows Terminal".

2. **Chạy lệnh `curl`**:
   - PowerShell có hỗ trợ `curl`, nhưng bạn có thể gặp một số vấn đề nhỏ do alias. Để tránh vấn đề này, bạn có thể sử dụng `Invoke-WebRequest` hoặc thêm `curl.exe` vào lệnh.

Dưới đây là cách sử dụng `curl` trong PowerShell:

### 1. Kiểm tra trạng thái sức khỏe:

```powershell
curl.exe http://localhost:8000/health
```

### 2. Kiểm tra chat:

```powershell
curl.exe -X POST http://localhost:8000/api/v1/chat `
  -H "Content-Type: application/json" `
  -d '{"message": "Hello!"}'
```

### 3. Kiểm tra tài liệu:

```powershell
curl.exe http://localhost:8000/api/v1/documents
```

### Lưu ý:
- Bạn có thể cần đảm bảo rằng dịch vụ đang chạy trên cổng `8000`.
- Nếu sử dụng `Invoke-WebRequest`, cú pháp sẽ hơi khác. Ví dụ cho lệnh POST:

```powershell
Invoke-WebRequest -Uri http://localhost:8000/api/v1/chat -Method POST -ContentType "application/json" -Body '{"message": "Hello!"}'
```

Hãy chạy từng lệnh và kiểm tra kết quả trên PowerShell!
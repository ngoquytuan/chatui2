Tôi sẽ phân tích các công nghệ UI trong dự án Perplexica để giúp bạn hiểu rõ hơn về kiến trúc frontend.Tôi cần xem thêm chi tiết về cấu trúc dự án để phân tích công nghệ UI:Tôi cần xem cấu trúc thư mục UI để hiểu rõ hơn về công nghệ được sử dụng:Dựa trên phân tích tài liệu GitHub và thông tin có được, tôi sẽ phân tích công nghệ UI trong dự án Perplexica:

## Phân tích Công nghệ UI của Perplexica

### **Stack Công nghệ Chính:**

1. **Next.js** - Framework React full-stack
   - Perplexica runs on Next.js and handles all API requests
   - Hỗ trợ cả Server-Side Rendering (SSR) và Static Site Generation (SSG)
   - Built-in API routes cho backend functionality

2. **React** - Library UI chính
   - Components-based architecture
   - Hooks cho state management
   - Virtual DOM cho performance tối ưu

3. **TypeScript** (khả năng cao)
   - Type safety cho development
   - Better IDE support và debugging

4. **Tailwind CSS** - Framework CSS utility-first
   - Rapid UI development
   - Responsive design built-in
   - Custom styling flexibility

### **Kiến trúc UI Dự đoán:**

```
ui/
├── components/          # Reusable UI components
│   ├── SearchBar/      # Component tìm kiếm chính
│   ├── ResultCard/     # Component hiển thị kết quả
│   ├── FocusMode/      # Component các chế độ tìm kiếm
│   ├── Settings/       # Component cài đặt
│   └── Chat/           # Component chat interface
├── pages/              # Next.js pages
│   ├── index.tsx       # Home page
│   ├── api/            # API routes
│   └── settings/       # Settings page
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── styles/             # Global styles
├── types/              # TypeScript type definitions
└── public/             # Static assets
```

### **Features UI Chính:**

1. **Search Interface**
   - Real-time search với debouncing
   - Auto-suggestions
   - Advanced search filters

2. **Focus Modes UI**
   - Mode selector component
   - Different UI layouts per mode (All, Academic, YouTube, etc.)

3. **Results Display**
   - Card-based layout
   - Source citations
   - Infinite scroll hoặc pagination

4. **Chat Interface**
   - Conversational UI
   - Message bubbles
   - Typing indicators

5. **Settings Panel**
   - API key management
   - Model selection
   - Theme toggle (dark/light mode)

### **Recommendations cho RAG System của bạn:**

**1. Module Structure:**
```
your-rag-system/
├── ui/                 # Frontend (Next.js + React)
├── api/                # API Gateway (Express.js hoặc FastAPI)
├── backend/            # Business logic service
└── rag-core/           # RAG processing engine
```

**2. UI Technologies để copy:**
- **Next.js 14+** với App Router
- **Tailwind CSS** cho styling nhanh
- **Lucide React** hoặc **Heroicons** cho icons
- **Framer Motion** cho animations
- **Zustand** hoặc **Redux Toolkit** cho state management

**3. Key Components cần implement:**
- Document upload interface
- Chat interface với streaming responses
- Document preview panel
- Search và filter functionality
- Settings management

**4. Responsive Design:**
- Mobile-first approach
- Collapsible sidebar
- Touch-friendly interactions

Bạn có muốn tôi đi sâu hơn vào bất kỳ phần nào của analysis này không? Ví dụ như cụ thể về component architecture hoặc styling patterns?
## Kiến Trúc UI cho RAG System - Next.js + React

### **1. Cấu Trúc Thư Mục Chính**

```
rag-ui/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (dashboard)/        # Route groups
│   │   │   ├── chat/
│   │   │   ├── documents/
│   │   │   └── settings/
│   │   ├── api/                # API routes (proxy)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/             # UI Components
│   │   ├── ui/                 # Base UI components
│   │   ├── feature/            # Feature-specific components
│   │   ├── layout/             # Layout components
│   │   └── providers/          # Context providers
│   │
│   ├── lib/                    # Utilities & Config
│   │   ├── api/                # API layer
│   │   ├── store/              # State management
│   │   ├── hooks/              # Custom hooks
│   │   ├── utils/              # Helper functions
│   │   └── types/              # TypeScript types
│   │
│   ├── styles/                 # Styling
│   │   ├── globals.css
│   │   └── components.css
│   │
│   └── constants/              # App constants
│       ├── routes.ts
│       └── config.ts
│
├── public/                     # Static assets
├── docs/                       # Documentation
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### **2. Base UI Components (Reusable)**

```typescript
// src/components/ui/
├── Button/
│   ├── Button.tsx
│   ├── Button.types.ts
│   ├── Button.styles.ts
│   └── index.ts
├── Input/
├── Card/
├── Modal/
├── Loading/
├── Toast/
├── Dropdown/
├── FileUpload/
├── SearchInput/
└── ChatBubble/
```

**Example: Button Component**
```typescript
// src/components/ui/Button/Button.tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { ButtonProps } from './Button.types'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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
            'border border-input bg-background hover:bg-accent': variant === 'outline',
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
        {loading && <LoadingSpinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    )
  }
)
```

### **3. Feature Components (Business Logic)**

```typescript
// src/components/feature/
├── Chat/
│   ├── ChatContainer/
│   ├── ChatMessage/
│   ├── ChatInput/
│   ├── ChatHistory/
│   └── index.ts
├── Document/
│   ├── DocumentUpload/
│   ├── DocumentList/
│   ├── DocumentViewer/
│   └── index.ts
├── Search/
│   ├── SearchBar/
│   ├── SearchResults/
│   ├── SearchFilters/
│   └── index.ts
└── Settings/
    ├── APISettings/
    ├── ModelSettings/
    ├── ThemeSettings/
    └── index.ts
```

**Example: ChatContainer Component**
```typescript
// src/components/feature/Chat/ChatContainer/ChatContainer.tsx
'use client'

import { useState } from 'react'
import { useChatStore } from '@/lib/store/chat'
import { ChatMessage } from '../ChatMessage'
import { ChatInput } from '../ChatInput'
import { Card } from '@/components/ui/Card'

export const ChatContainer = () => {
  const { messages, isLoading, sendMessage } = useChatStore()
  
  const handleSendMessage = async (content: string) => {
    await sendMessage(content)
  }

  return (
    <Card className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && <ChatMessage.Loading />}
      </div>
      
      <div className="border-t p-4">
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
      </div>
    </Card>
  )
}
```

### **4. State Management (Zustand)**

```typescript
// src/lib/store/chat.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { chatAPI } from '@/lib/api/chat'

interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  
  // Actions
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  setError: (error: string | null) => void
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      messages: [],
      isLoading: false,
      error: null,

      sendMessage: async (content: string) => {
        const { messages } = get()
        const userMessage: Message = {
          id: Date.now().toString(),
          content,
          role: 'user',
          timestamp: new Date(),
        }

        set({ 
          messages: [...messages, userMessage], 
          isLoading: true,
          error: null 
        })

        try {
          const response = await chatAPI.sendMessage(content)
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: response.content,
            role: 'assistant',
            timestamp: new Date(),
            sources: response.sources,
          }

          set(state => ({
            messages: [...state.messages, assistantMessage],
            isLoading: false
          }))
        } catch (error) {
          set({ 
            error: 'Failed to send message',
            isLoading: false 
          })
        }
      },

      clearMessages: () => set({ messages: [] }),
      setError: (error) => set({ error }),
    }),
    { name: 'chat-store' }
  )
)
```

### **5. API Layer (Independence)**

```typescript
// src/lib/api/base.ts
class APIClient {
  private baseURL: string
  
  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new APIError(response.status, await response.text())
    }

    return response.json()
  }
}

// src/lib/api/chat.ts
export const chatAPI = {
  sendMessage: (content: string) => 
    apiClient.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message: content })
    }),
    
  getHistory: () => 
    apiClient.request<ChatHistory>('/chat/history'),
}

// src/lib/api/documents.ts
export const documentAPI = {
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiClient.request<UploadResponse>('/documents/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    })
  },
  
  list: () => apiClient.request<Document[]>('/documents'),
  delete: (id: string) => apiClient.request(`/documents/${id}`, { method: 'DELETE' }),
}
```

### **6. Layout System**

```typescript
// src/components/layout/AppLayout/AppLayout.tsx
'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className={cn(
        'flex-1 flex flex-col transition-all duration-300',
        sidebarOpen ? 'ml-64' : 'ml-16'
      )}>
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### **7. Theme & Styling System**

```typescript
// src/lib/store/theme.ts
export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
}))

// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... more colors
      },
    },
  },
}
```

### **8. Custom Hooks (Logic Separation)**

```typescript
// src/lib/hooks/useDocumentUpload.ts
export const useDocumentUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadDocument = async (file: File) => {
    setIsUploading(true)
    setProgress(0)

    try {
      const response = await documentAPI.upload(file)
      return response
    } catch (error) {
      throw error
    } finally {
      setIsUploading(false)
      setProgress(0)
    }
  }

  return {
    uploadDocument,
    isUploading,
    progress,
  }
}

// src/lib/hooks/useWebSocket.ts
export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const ws = new WebSocket(url)
    
    ws.onopen = () => setIsConnected(true)
    ws.onclose = () => setIsConnected(false)
    
    setSocket(ws)
    
    return () => ws.close()
  }, [url])

  return { socket, isConnected }
}
```

### **9. Configuration & Environment**

```typescript
// src/lib/config/env.ts
export const config = {
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    timeout: 10000,
  },
  websocket: {
    url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001',
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['pdf', 'txt', 'docx'],
  },
}
```

### **Đặc Điểm Chính của Kiến Trúc:**

1. **Modularity**: Mỗi component/feature độc lập
2. **Scalability**: Dễ thêm features mới
3. **Maintainability**: Code clean, organized
4. **Type Safety**: Full TypeScript support
5. **Performance**: Lazy loading, code splitting
6. **Testing**: Có thể test từng module riêng biệt

Bạn có muốn tôi detail hơn về phần nào không? Ví dụ như setup project, specific components, hoặc integration patterns?

Tôi sẽ tạo đầy đủ files để bạn chạy được UI với Docker. Đây là setup hoàn chỉnh:

## **1. Project Structure & Files**

```
rag-ui/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local
├── .dockerignore
├── .gitignore
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── api/
    ├── components/
    ├── lib/
    └── styles/
```

## **2. Package.json**

```json
{
  "name": "rag-ui",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "zustand": "^4.4.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.292.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.0.1",
    "postcss": "^8.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "14.0.0"
  }
}
```

## **3. Dockerfile**

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the app
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

## **4. Docker Compose với Logging**

```yaml
# docker-compose.yml
version: '3.8'

services:
  rag-ui:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:8000
      - NEXT_PUBLIC_WS_URL=ws://localhost:8001
    volumes:
      - ./src:/app/src
      - ./public:/app/public
      - /app/node_modules
      - ./logs:/app/logs
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Mock API for testing (optional)
  mock-api:
    image: nginx:alpine
    ports:
      - "8000:80"
    volumes:
      - ./mock-api:/usr/share/nginx/html
    restart: unless-stopped
```

## **5. Next.js Config**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

## **6. Tailwind Config**

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
      },
    },
  },
  plugins: [],
}
```

## **7. TypeScript Config**

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## **8. Global CSS**

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --border: 217.2 32.6% 17.5%;
  }
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

body {
  color: hsl(var(--foreground));
  background: hsl(var(--background));
}
```

## **9. Main Layout**

```typescript
// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'

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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

## **10. Main Page**

```typescript
// src/app/page.tsx
import { AppLayout } from '@/components/layout/AppLayout'
import { ChatContainer } from '@/components/feature/Chat/ChatContainer'
import { DocumentSidebar } from '@/components/feature/Document/DocumentSidebar'

export default function HomePage() {
  return (
    <AppLayout>
      <div className="flex h-full">
        <DocumentSidebar />
        <div className="flex-1 p-4">
          <ChatContainer />
        </div>
      </div>
    </AppLayout>
  )
}
```

## **11. Core Components**

```typescript
// src/components/providers/Providers.tsx
'use client'

import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
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
            'border border-input bg-background hover:bg-accent': variant === 'outline',
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
// src/components/layout/AppLayout.tsx
'use client'

import { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <h1 className="font-semibold">RAG UI System</h1>
        </div>
      </header>
      <main className="container px-4 py-6">
        {children}
      </main>
    </div>
  )
}
```

```typescript
// src/components/feature/Chat/ChatContainer.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

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
    <div className="flex flex-col h-[600px] border rounded-lg bg-card">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
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
            className="flex-1 px-3 py-2 border rounded-md bg-background"
            placeholder="Ask about your documents..."
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  )
}
```

```typescript
// src/components/feature/Document/DocumentSidebar.tsx
'use client'

import { Button } from '@/components/ui/Button'

export function DocumentSidebar() {
  return (
    <div className="w-80 border-r bg-muted/30 p-4">
      <h2 className="font-semibold mb-4">Documents</h2>
      
      <Button className="w-full mb-4" onClick={() => console.log('Upload clicked')}>
        Upload Document
      </Button>
      
      <div className="space-y-2">
        <div className="p-2 border rounded bg-card text-sm">
          📄 Sample Document 1.pdf
        </div>
        <div className="p-2 border rounded bg-card text-sm">
          📄 Sample Document 2.txt
        </div>
      </div>
    </div>
  )
}
```

## **12. Environment & Docker Files**

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8001
NODE_ENV=development
```

```
# .dockerignore
node_modules
.next
.git
.gitignore
README.md
Dockerfile
docker-compose.yml
.dockerignore
.env.local
logs
```

## **13. Chạy Project**

```bash
# 1. Tạo thư mục và copy files
mkdir rag-ui && cd rag-ui

# 2. Copy tất cả files ở trên vào thư mục

# 3. Build và chạy
docker-compose up --build

# 4. Xem logs realtime
docker-compose logs -f rag-ui

# 5. Xem logs chi tiết
docker logs rag-ui_rag-ui_1 --follow
```

## **14. Health Check & API Routes**

```typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
}
```

**Truy cập UI tại:** `http://localhost:3000`

**Commands hữu ích:**
```bash
# Xem logs
docker-compose logs -f

# Restart service  
docker-compose restart rag-ui

# Rebuild
docker-compose up --build --no-cache

# Debug container
docker exec -it rag-ui_rag-ui_1 sh
```

Bạn chạy thử và báo lỗi nếu có, tôi sẽ fix ngay!


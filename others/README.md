# RAG UI-Backend System - Tài liệu Source Code

Đây là tài liệu chi tiết về tất cả các files trong hệ thống RAG (Retrieval-Augmented Generation) với UI Next.js và Backend Python FastAPI.

## 📁 Cấu trúc tổng quan

```
UI/
├── src/                    # Frontend source code (Next.js)
├── backend/               # Backend source code (Python FastAPI)
├── public/                # Static assets
└── [config files]        # Configuration files
```

---

## 🎨 FRONTEND - UI (Next.js + React)

### 📂 Root Config Files

#### `next.config.js`
- **Thuộc**: UI Frontend
- **Tác dụng**: Cấu hình Next.js framework
- **Chức năng**: 
  - Thiết lập webpack để hot reload trong Docker
  - Cấu hình logging cho development
  - Tối ưu performance và build settings

#### `package.json`
- **Thuộc**: UI Frontend
- **Tác dụng**: Quản lý dependencies và scripts của Node.js
- **Chức năng**:
  - Liệt kê các thư viện cần thiết (Next.js, React, Tailwind CSS, TypeScript)
  - Định nghĩa scripts để dev, build, start
  - Metadata về project

#### `tailwind.config.js`
- **Thuộc**: UI Frontend  
- **Tác dụng**: Cấu hình Tailwind CSS framework
- **Chức năng**:
  - Định nghĩa color scheme (light/dark mode)
  - Thiết lập responsive breakpoints
  - Custom CSS variables và utility classes

#### `tsconfig.json`
- **Thuộc**: UI Frontend
- **Tác dụng**: Cấu hình TypeScript compiler
- **Chức năng**:
  - Thiết lập path aliases (`@/*` -> `./src/*`)
  - Cấu hình type checking rules
  - Integration với Next.js

#### `postcss.config.js`
- **Thuộc**: UI Frontend
- **Tác dụng**: Cấu hình PostCSS processor
- **Chức năng**:
  - Enable Tailwind CSS processing
  - Auto-prefix CSS cho cross-browser compatibility

#### `.env.local`
- **Thuộc**: UI Frontend
- **Tác dụng**: Environment variables cho development
- **Chức năng**:
  - Lưu URL của Backend API
  - WebSocket URLs
  - Các config secrets

---

### 📂 src/app/ (Next.js App Router)

#### `src/app/layout.tsx`
- **Thuộc**: UI Frontend - Layout
- **Tác dụng**: Root layout component của toàn bộ app
- **Chức năng**:
  - Wrap toàn bộ app với HTML structure
  - Load fonts (Inter from Google Fonts)
  - Setup global providers và metadata

#### `src/app/page.tsx`  
- **Thuộc**: UI Frontend - Main Page
- **Tác dụng**: Homepage component (route `/`)
- **Chức năng**:
  - Render main UI với AppLayout
  - Hiển thị ChatContainer và DocumentSidebar
  - Entry point của user interface

#### `src/app/globals.css`
- **Thuộc**: UI Frontend - Styling
- **Tác dụng**: Global CSS styles và Tailwind imports
- **Chức năng**:
  - Import Tailwind CSS utilities
  - Define CSS custom properties cho colors
  - Dark/Light mode color schemes

#### `src/app/api/health/route.ts`
- **Thuộc**: UI Frontend - API Route
- **Tác dụng**: Health check endpoint cho Next.js
- **Chức năng**:
  - Trả về status của frontend server
  - Monitoring và debugging purposes

---

### 📂 src/components/ (React Components)

#### 📁 `src/components/ui/` - Base UI Components

##### `src/components/ui/Button.tsx`
- **Thuộc**: UI Frontend - Base Component
- **Tác dụng**: Reusable button component
- **Chức năng**:
  - Support multiple variants (default, secondary, outline)
  - Different sizes (sm, md, lg)
  - Loading state với spinner
  - Full TypeScript props support

##### `src/components/ui/Card.tsx`
- **Thuộc**: UI Frontend - Base Component  
- **Tác dụng**: Container component cho content
- **Chức năng**:
  - Consistent styling với border và shadow
  - Responsive design
  - Support cho dark/light themes

##### `src/components/ui/index.ts`
- **Thuộc**: UI Frontend - Exports
- **Tác dụng**: Central export point cho UI components
- **Chức năng**: Export tất cả base UI components để dễ import

---

#### 📁 `src/components/feature/` - Business Logic Components

##### `src/components/feature/Chat/ChatContainer.tsx`
- **Thuộc**: UI Frontend - Chat Feature
- **Tác dụng**: Main chat interface component
- **Chức năng**:
  - Hiển thị conversation messages
  - Input field để gửi messages
  - Connect với backend API qua chat service
  - Real-time message updates

##### `src/components/feature/Document/DocumentSidebar.tsx`  
- **Thuộc**: UI Frontend - Document Feature
- **Tác dụng**: Document management sidebar
- **Chức năng**:
  - List uploaded documents
  - Upload button functionality
  - Storage usage indicator
  - Document metadata display

---

#### 📁 `src/components/layout/` - Layout Components

##### `src/components/layout/AppLayout.tsx`
- **Thuộc**: UI Frontend - Layout
- **Tác dụng**: Main application layout wrapper
- **Chức năng**:
  - Header với navigation và theme toggle
  - Container cho main content
  - Responsive design structure
  - Theme switching functionality

---

#### 📁 `src/components/providers/` - Context Providers

##### `src/components/providers/Providers.tsx`
- **Thuộc**: UI Frontend - Providers
- **Tác dụng**: Global React context providers
- **Chức năng**:
  - Wrap app với necessary contexts
  - State management providers
  - Theme providers

##### `src/components/providers/index.ts`
- **Thuộc**: UI Frontend - Exports
- **Tác dụng**: Export point cho providers
- **Chức năng**: Centralized exports

---

### 📂 src/lib/ (Utilities & Services)

#### `src/lib/utils.ts`
- **Thuộc**: UI Frontend - Utilities
- **Tác dụng**: Helper functions và utilities
- **Chức năng**:
  - `cn()` function để combine CSS classes với clsx và tailwind-merge
  - Reusable utility functions

#### 📁 `src/lib/api/` - API Layer

##### `src/lib/api/client.ts`
- **Thuộc**: UI Frontend - API Client
- **Tác dụng**: HTTP client để communicate với backend
- **Chức năng**:
  - APIClient class với request methods
  - Chat API functions (sendMessage, getHistory)
  - Documents API functions (upload, list, delete)
  - Error handling và logging

---

## 🔧 Docker & Deployment Files

#### `Dockerfile` 
- **Thuộc**: UI Frontend - Production Build
- **Tác dụng**: Multi-stage Docker build cho production
- **Chức năng**:
  - Build optimized Next.js app
  - Minimize image size với standalone output
  - Production-ready deployment

#### `Dockerfile.dev`
- **Thuộc**: UI Frontend - Development Build  
- **Tác dụng**: Docker setup cho development mode
- **Chức năng**:
  - Hot reload support
  - Volume mounting cho live code changes
  - Development dependencies

#### `docker-compose.yml`
- **Thuộc**: Full Stack - Orchestration
- **Tác dụng**: Orchestrate cả UI và Backend services
- **Chức năng**:
  - Define services cho rag-ui và rag-backend
  - Network setup between services  
  - Volume mounting và environment variables
  - Service dependencies

#### `.dockerignore`
- **Thuộc**: UI Frontend - Docker
- **Tác dụng**: Exclude files khỏi Docker build context
- **Chức năng**: Optimize build speed bằng cách ignore node_modules, .git, etc.

---

## ⚙️ BACKEND - API (Python FastAPI)

### 📂 Root Backend Files

#### `backend/main.py`
- **Thuộc**: Backend - Main Application
- **Tác dụng**: FastAPI application entry point
- **Chức năng**:
  - Setup FastAPI app với middleware
  - CORS configuration cho frontend
  - Include API routers
  - Health check endpoints
  - In-memory storage cho demo
  - Chat và Document endpoints
  - AI response generation logic

#### `backend/requirements.txt`
- **Thuộc**: Backend - Dependencies
- **Tác dụng**: Python package dependencies
- **Chức năng**:
  - FastAPI framework và uvicorn server
  - Pydantic cho data validation
  - File upload support với python-multipart
  - Async file operations với aiofiles

#### `backend/config.py`
- **Thuộc**: Backend - Configuration
- **Tác dụng**: Application settings và configuration
- **Chức năng**:
  - Environment-based settings với Pydantic
  - CORS origins configuration
  - File upload limits và allowed extensions
  - RAG system parameters

#### `backend/Dockerfile`
- **Thuộc**: Backend - Container
- **Tác dụng**: Docker container cho Python backend
- **Chức năng**:
  - Python 3.11 base image
  - Install dependencies và setup working directory
  - Health check với curl
  - Create upload/logs directories

---

### 📂 backend/models/ - Data Models

#### `backend/models/schemas.py`
- **Thuộc**: Backend - Data Models
- **Tác dụng**: Pydantic models cho API request/response
- **Chức năng**:
  - ChatMessage, ChatResponse models
  - DocumentInfo, DocumentUploadResponse models  
  - Enums cho MessageRole
  - Type validation và serialization

#### `backend/models/__init__.py`
- **Thuộc**: Backend - Python Module
- **Tác dụng**: Make models directory thành Python package
- **Chức năng**: Enable imports từ models directory

---

### 📂 backend/routes/ - API Routes

#### `backend/routes/chat.py`
- **Thuộc**: Backend - Chat API
- **Tác dụng**: Chat-related API endpoints
- **Chức năng**:
  - POST /api/v1/chat - Send messages
  - GET /api/v1/chat/history - Get conversation history
  - DELETE /api/v1/chat/history - Clear conversations
  - Error handling và logging

#### `backend/routes/documents.py`  
- **Thuộc**: Backend - Documents API
- **Tác dụng**: Document management endpoints
- **Chức năng**:
  - POST /api/v1/documents/upload - Upload files
  - GET /api/v1/documents - List documents
  - DELETE /api/v1/documents/{id} - Delete documents
  - File validation và storage

#### `backend/routes/__init__.py`
- **Thuộc**: Backend - Python Module
- **Tác dụng**: Make routes directory thành Python package

---

### 📂 backend/services/ - Business Logic

#### `backend/services/chat_service.py`
- **Thuộc**: Backend - Chat Service  
- **Tác dụng**: Chat business logic và AI response generation
- **Chức năng**:
  - Process incoming messages
  - Generate contextual AI responses
  - Manage conversation history
  - Integration point cho RAG system

#### `backend/services/document_service.py`
- **Thuộc**: Backend - Document Service
- **Tác dụng**: Document processing và management
- **Chức năng**:
  - File upload validation
  - Document storage và metadata
  - Text extraction preparation
  - Integration point cho vector storage

#### `backend/services/__init__.py`  
- **Thuộc**: Backend - Python Module
- **Tác dụng**: Make services directory thành Python package

---

### 📂 backend/utils/ - Utilities

#### `backend/utils/__init__.py`
- **Thuộc**: Backend - Python Module
- **Tác dụng**: Utilities package initialization

---

### 📂 Storage Directories

#### `backend/uploads/`
- **Thuộc**: Backend - File Storage
- **Tác dụng**: Store uploaded documents
- **Chức năng**: Physical storage cho user-uploaded files

#### `backend/logs/`  
- **Thuộc**: Backend - Logging
- **Tác dụng**: Application logs storage
- **Chức năng**: Debug và monitoring logs

---

## 🔄 Data Flow Architecture

```
User Browser (Frontend)
    ↓ HTTP Requests
Next.js API Client (src/lib/api/client.ts)
    ↓ REST API Calls  
FastAPI Backend (backend/main.py)
    ↓ Route to Services
Business Logic (backend/services/)
    ↓ Data Processing
File Storage (backend/uploads/) & In-Memory Storage
```

## 🚀 Key Integration Points

1. **Frontend-Backend Communication**: 
   - `src/lib/api/client.ts` ↔ `backend/main.py`

2. **Chat Flow**:
   - `ChatContainer.tsx` → `chatAPI.sendMessage()` → `/api/v1/chat` → Chat Service

3. **Document Flow**: 
   - `DocumentSidebar.tsx` → `documentsAPI.upload()` → `/api/v1/documents/upload` → Document Service

4. **State Management**:
   - React state trong components
   - Backend in-memory storage (ready để replace với database)

## 📝 Development Notes

- **Modular Architecture**: Mỗi feature có thể develop độc lập
- **Type Safety**: Full TypeScript cho frontend, Pydantic cho backend  
- **Docker Ready**: Both services containerized và orchestrated
- **API Documentation**: Auto-generated docs tại `/docs` endpoint
- **Extensible**: Ready để integrate với real RAG systems (LangChain, vector databases)

Hệ thống này tạo foundation vững chắc cho RAG application với clean architecture và modern tech stack!

# 🐳 Enhanced ChatUI - Docker Deployment Guide

This guide will help you deploy the Enhanced ChatUI with Docker on Windows.

## 📋 Prerequisites

### 1. Install Docker Desktop for Windows
- Download from: https://www.docker.com/products/docker-desktop/
- Install and restart your computer
- Make sure Docker Desktop is running (check system tray)

### 2. Verify Docker Installation
Open Command Prompt or PowerShell and run:
```bash
docker --version
docker-compose --version
```

## 🚀 Quick Start Deployment

### Option 1: Development Mode (Recommended for Testing)
1. **Navigate to the project directory**:
   ```bash
   cd C:\undertest\ChatUI
   ```

2. **Run the deployment script**:
   ```bash
   deploy-dev.bat
   ```
   
3. **Access the application**:
   - Open your browser to: http://localhost:3000
   - Mock Backend: http://localhost:8000

### Option 2: Production Mode
1. **Navigate to the project directory**:
   ```bash
   cd C:\undertest\ChatUI
   ```

2. **Run the production deployment**:
   ```bash
   deploy-prod.bat
   ```

3. **Access the optimized application**:
   - Open your browser to: http://localhost:3000

## 🛠️ Manual Docker Commands

### Development Deployment
```bash
# Build and start development environment
docker-compose up --build -d

# View logs
docker-compose logs -f enhanced-chatui

# Stop the application
docker-compose down
```

### Production Deployment
```bash
# Build and start production environment  
docker-compose -f docker-compose.prod.yml up --build -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f enhanced-chatui

# Stop the application
docker-compose -f docker-compose.prod.yml down
```

## 📊 Container Management

### Check Running Containers
```bash
docker ps
```

### View Container Logs
```bash
# Development
docker-compose logs -f enhanced-chatui

# Production  
docker-compose -f docker-compose.prod.yml logs -f enhanced-chatui
```

### Stop All Containers
```bash
# Use the provided script
stop-all.bat

# Or manually
docker-compose down
docker-compose -f docker-compose.prod.yml down
```

## 🔧 Configuration

### Environment Variables
You can modify environment variables in the docker-compose files:

**Development (`docker-compose.yml`)**:
- `NODE_ENV=development`
- `NEXT_PUBLIC_API_URL=http://localhost:8000`
- `NEXT_TELEMETRY_DISABLED=1`

**Production (`docker-compose.prod.yml`)**:
- `NODE_ENV=production` 
- `NEXT_PUBLIC_API_URL=http://localhost:8000`
- `NEXT_TELEMETRY_DISABLED=1`

### Port Configuration
- **Frontend**: http://localhost:3000
- **Mock Backend**: http://localhost:8000

To change ports, modify the `ports` section in docker-compose files:
```yaml
ports:
  - "YOUR_PORT:3000"  # Change YOUR_PORT to desired port
```

## 🎯 Testing the Enhanced Features

Once deployed, test these new features:

### 1. Auto-Suggestions
- Send 2+ messages in the chat
- Look for contextual question suggestions below the input
- Click any suggestion to auto-send

### 2. Quick Actions  
- Find the Quick Actions panel above the chat
- Click "Find Policy", "Find Procedure", or "Technical Guide"
- Enter parameters when prompted

### 3. Feedback System
- Send a message and wait for AI response
- Use thumbs up/down buttons below AI messages
- For thumbs down, add optional comments

### 4. Multi-Language Support
- Click the language switcher (flag icon) in the header
- Switch between Vietnamese (🇻🇳) and English (🇺🇸)
- Interface updates immediately

### 5. Export Functionality
- Click the export button (📤) in chat header
- Choose format: PDF, JSON, TXT, or HTML
- Configure export options
- Download generated file

### 6. Chat History
- Click "Show History" button
- View previous conversations
- Search conversations
- Delete unwanted sessions

## 🐛 Troubleshooting

### Common Issues

#### 1. Docker Desktop Not Running
**Error**: `docker: command not found` or connection errors
**Solution**: 
- Start Docker Desktop from Windows Start Menu
- Wait for Docker to fully initialize (whale icon in system tray)

#### 2. Port Already in Use
**Error**: `Port 3000 is already in use`
**Solution**:
```bash
# Stop all containers first
stop-all.bat

# Or find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

#### 3. Build Failures
**Error**: Build fails during `npm install` or `npm run build`
**Solution**:
```bash
# Clean up Docker system
docker system prune -f
docker volume prune -f

# Rebuild without cache
docker-compose build --no-cache
```

#### 4. Application Won't Start
**Error**: Container starts but app doesn't respond
**Solution**:
```bash
# Check container logs
docker-compose logs enhanced-chatui

# Check container status
docker ps

# Restart the container
docker-compose restart enhanced-chatui
```

#### 5. Memory Issues on Windows
**Error**: Out of memory during build
**Solution**:
- Increase Docker Desktop memory allocation
- Go to Docker Desktop → Settings → Resources → Memory
- Increase to at least 4GB RAM

### Health Checks
Both development and production containers include health checks:
```bash
# Check container health
docker ps

# Look for "healthy" status in the output
```

## 🔍 Monitoring & Debugging

### View Real-time Logs
```bash
# Development
docker-compose logs -f enhanced-chatui

# Production
docker-compose -f docker-compose.prod.yml logs -f enhanced-chatui
```

### Execute Commands Inside Container
```bash
# Get shell access to development container
docker-compose exec enhanced-chatui sh

# Get shell access to production container  
docker-compose -f docker-compose.prod.yml exec enhanced-chatui sh
```

### Container Resource Usage
```bash
# View resource usage
docker stats

# View disk usage
docker system df
```

## 📦 Docker Image Information

### Image Sizes (Approximate)
- **Development Image**: ~500MB
- **Production Image**: ~150MB (optimized)

### Base Images Used
- **Node.js**: `node:18-alpine` (lightweight Alpine Linux)
- **Nginx**: `nginx:alpine` (for mock backend)

## 🔄 Updates & Maintenance

### Updating the Application
1. Stop running containers:
   ```bash
   stop-all.bat
   ```

2. Pull latest code changes (if applicable)

3. Rebuild and restart:
   ```bash
   deploy-dev.bat  # or deploy-prod.bat
   ```

### Cleaning Up Resources
```bash
# Remove unused containers, networks, images
docker system prune -f

# Remove unused volumes (careful with this!)
docker volume prune -f

# Remove specific images
docker image rm enhanced-chatui-dev
docker image rm enhanced-chatui-prod
```

## 🎭 Development vs Production Differences

### Development Mode
- ✅ Hot reloading enabled
- ✅ Source maps included  
- ✅ Verbose logging
- ✅ Development dependencies included
- ❌ Larger image size
- ❌ Slower startup

### Production Mode  
- ✅ Optimized bundles
- ✅ Compressed assets
- ✅ Server-side rendering
- ✅ Faster runtime performance
- ✅ Smaller image size
- ❌ No hot reloading
- ❌ Longer build time

## 📞 Support

If you encounter issues:

1. **Check the logs** first using the commands above
2. **Verify Docker** is running properly
3. **Ensure ports** 3000 and 8000 are available
4. **Try rebuilding** without cache if needed
5. **Check Windows firewall** settings if needed

## 🎉 Success Indicators

You'll know the deployment is successful when:

✅ Containers show "healthy" status in `docker ps`  
✅ Application loads at http://localhost:3000  
✅ All enhanced features are working (auto-suggestions, quick actions, etc.)  
✅ Language switching works properly  
✅ Export functionality generates files  
✅ No error messages in browser console  

---

**Happy Deploying! 🚀**

The Enhanced ChatUI with all its interactive features is now running in Docker containers on your Windows machine!
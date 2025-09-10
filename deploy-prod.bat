@echo off
REM Enhanced ChatUI Production Deployment Script for Windows
REM This script builds and runs the enhanced ChatUI in production mode

echo ====================================
echo Enhanced ChatUI - Production Deploy
echo ====================================
echo.

REM Check if Docker is running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running!
    echo Please install Docker Desktop for Windows and make sure it's running.
    pause
    exit /b 1
)

echo ✅ Docker is available
echo.

REM Stop and remove any existing containers
echo 🛑 Stopping existing containers...
docker-compose -f docker-compose.prod.yml down
echo.

REM Remove any dangling images to free up space
echo 🧹 Cleaning up old images...
docker image prune -f
echo.

REM Build and start the production environment
echo 🏗️  Building Enhanced ChatUI (Production)...
echo This will take several minutes as we optimize for production...
echo.

docker-compose -f docker-compose.prod.yml up --build -d

if %errorlevel% neq 0 (
    echo.
    echo ❌ Failed to start the application!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo ✅ Enhanced ChatUI (Production) is starting up...
echo.
echo 📱 Application will be available at:
echo    http://localhost:3000
echo.
echo 🔧 Mock Backend (for testing):
echo    http://localhost:8000
echo.
echo 📊 To view logs: docker-compose -f docker-compose.prod.yml logs -f enhanced-chatui
echo 🛑 To stop: docker-compose -f docker-compose.prod.yml down
echo.

REM Wait for the container to start and optimize
echo ⏳ Waiting for production optimization to complete...
timeout /t 30 /nobreak >nul

REM Check if the application is responding
echo 🔍 Checking application health...
curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Production application is ready!
    echo.
    echo 🚀 Opening Enhanced ChatUI in your default browser...
    start http://localhost:3000
) else (
    echo ⚠️  Application might still be starting up.
    echo Production builds take longer to initialize.
    echo Please wait a few more seconds and visit: http://localhost:3000
)

echo.
echo 🏭 Production Features Enabled:
echo    • Optimized bundle size and performance
echo    • Server-side rendering (SSR)
echo    • Automatic image optimization
echo    • Compressed assets
echo    • Health checks and monitoring
echo.
echo 📋 Enhanced Features:
echo    • Auto-Suggestions - Context-aware recommendations
echo    • Quick Actions - Policy/Procedure/Technical shortcuts
echo    • Feedback System - Thumbs up/down with comments
echo    • Multi-Language - Vietnamese/English switching
echo    • Export Function - Multiple format support
echo    • Chat History - Full conversation management
echo.
echo Press any key to exit...
pause >nul
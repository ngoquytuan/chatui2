@echo off
REM Enhanced ChatUI Development Deployment Script for Windows
REM This script builds and runs the enhanced ChatUI in development mode

echo ====================================
echo Enhanced ChatUI - Development Deploy
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
docker-compose down
echo.

REM Remove any dangling images to free up space
echo 🧹 Cleaning up old images...
docker image prune -f
echo.

REM Build and start the development environment
echo 🏗️  Building and starting Enhanced ChatUI (Development)...
echo This may take several minutes for the first build...
echo.

docker-compose up --build -d

if %errorlevel% neq 0 (
    echo.
    echo ❌ Failed to start the application!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo ✅ Enhanced ChatUI is starting up...
echo.
echo 📱 Application will be available at:
echo    http://localhost:3000
echo.
echo 🔧 Mock Backend (for testing):
echo    http://localhost:8000
echo.
echo 📊 To view logs: docker-compose logs -f enhanced-chatui
echo 🛑 To stop: docker-compose down
echo.

REM Wait a moment for the container to start
echo ⏳ Waiting for the application to be ready...
timeout /t 10 /nobreak >nul

REM Check if the application is responding
echo 🔍 Checking application health...
curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Application is ready!
    echo.
    echo 🚀 Opening Enhanced ChatUI in your default browser...
    start http://localhost:3000
) else (
    echo ⚠️  Application might still be starting up.
    echo Please wait a few more seconds and visit: http://localhost:3000
)

echo.
echo 📋 Available Features:
echo    • Auto-Suggestions - Smart question recommendations
echo    • Quick Actions - Pre-defined shortcuts
echo    • Feedback System - Rate AI responses
echo    • Multi-Language - Vietnamese/English support
echo    • Export Function - PDF, JSON, TXT, HTML formats
echo    • Chat History - Searchable conversation list
echo.
echo Press any key to exit...
pause >nul
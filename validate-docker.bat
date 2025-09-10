@echo off
REM Enhanced ChatUI Docker Configuration Validator

echo =========================================
echo Enhanced ChatUI - Docker Validation
echo =========================================
echo.

REM Check Docker installation
echo 🔍 Checking Docker installation...
docker --version
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed or not accessible!
    echo Please install Docker Desktop for Windows.
    pause
    exit /b 1
)

docker-compose --version
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not available!
    echo Please ensure Docker Desktop is properly installed.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are available
echo.

REM Validate Docker configuration files
echo 🔍 Validating Docker configuration files...

if not exist "Dockerfile" (
    echo ❌ Dockerfile not found!
    pause
    exit /b 1
)
echo ✅ Dockerfile found

if not exist "Dockerfile.dev" (
    echo ❌ Dockerfile.dev not found!
    pause
    exit /b 1
)
echo ✅ Dockerfile.dev found

if not exist "docker-compose.yml" (
    echo ❌ docker-compose.yml not found!
    pause
    exit /b 1
)
echo ✅ docker-compose.yml found

if not exist "docker-compose.prod.yml" (
    echo ❌ docker-compose.prod.yml not found!
    pause
    exit /b 1
)
echo ✅ docker-compose.prod.yml found

if not exist ".dockerignore" (
    echo ❌ .dockerignore not found!
    pause
    exit /b 1
)
echo ✅ .dockerignore found

echo.

REM Validate docker-compose syntax
echo 🔍 Validating Docker Compose syntax...
docker-compose config -q
if %errorlevel% neq 0 (
    echo ❌ docker-compose.yml has syntax errors!
    pause
    exit /b 1
)
echo ✅ docker-compose.yml syntax is valid

docker-compose -f docker-compose.prod.yml config -q
if %errorlevel% neq 0 (
    echo ❌ docker-compose.prod.yml has syntax errors!
    pause
    exit /b 1
)
echo ✅ docker-compose.prod.yml syntax is valid

echo.

REM Check for required files
echo 🔍 Checking required project files...

if not exist "package.json" (
    echo ❌ package.json not found!
    pause
    exit /b 1
)
echo ✅ package.json found

if not exist "next.config.js" (
    echo ❌ next.config.js not found!
    pause
    exit /b 1
)
echo ✅ next.config.js found

if not exist "src" (
    echo ❌ src directory not found!
    pause
    exit /b 1
)
echo ✅ src directory found

if not exist "mock-backend" (
    echo ❌ mock-backend directory not found!
    pause
    exit /b 1
)
echo ✅ mock-backend directory found

echo.

REM Check available ports
echo 🔍 Checking if required ports are available...
netstat -an | find "3000" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 3000 is currently in use!
    echo You may need to stop other applications using this port.
) else (
    echo ✅ Port 3000 is available
)

netstat -an | find "8000" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 8000 is currently in use!
    echo You may need to stop other applications using this port.
) else (
    echo ✅ Port 8000 is available
)

echo.

REM Check Docker daemon status
echo 🔍 Checking Docker daemon status...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker daemon is not running!
    echo Please start Docker Desktop and wait for it to be ready.
    pause
    exit /b 1
)
echo ✅ Docker daemon is running

echo.
echo ========================================
echo ✅ VALIDATION COMPLETE - READY TO DEPLOY!
echo ========================================
echo.
echo 🚀 Your Enhanced ChatUI is ready for Docker deployment!
echo.
echo Next steps:
echo   • For development: run 'deploy-dev.bat'
echo   • For production: run 'deploy-prod.bat'
echo.
echo 📋 Features ready to test:
echo   • Auto-Suggestions
echo   • Quick Actions  
echo   • Feedback System
echo   • Multi-Language Support
echo   • Export Functionality
echo   • Chat History Management
echo.
echo Press any key to exit...
pause >nul
@echo off
REM Stop All Enhanced ChatUI Containers

echo ===============================
echo Enhanced ChatUI - Stop All
echo ===============================
echo.

echo 🛑 Stopping all Enhanced ChatUI containers...
echo.

REM Stop development containers
echo Stopping development environment...
docker-compose down

REM Stop production containers
echo Stopping production environment...
docker-compose -f docker-compose.prod.yml down

echo.
echo ✅ All Enhanced ChatUI containers have been stopped.

REM Show any remaining containers
echo.
echo 📋 Remaining running containers:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo 🧹 To clean up unused images and volumes, you can run:
echo    docker system prune -f
echo    docker volume prune -f
echo.
echo Press any key to exit...
pause >nul
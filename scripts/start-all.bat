@echo off
echo 🚀 Starting all Lendify services...
echo.

REM Copy .env files if they exist
if exist ".env\MemberA.env" (
    copy ".env\MemberA.env" "Member A\backend\.env" >nul
    echo ✓ Copied MemberA.env to Member A/backend/.env
)
if exist ".env\MemberB.env" (
    copy ".env\MemberB.env" "Member B\backend\.env" >nul
    echo ✓ Copied MemberB.env to Member B/backend/.env
)
if exist ".env\MemberC.env" (
    copy ".env\MemberC.env" "Member C\backend\.env" >nul
    echo ✓ Copied MemberC.env to Member C/backend/.env
)

echo.
echo Starting all services...
echo.

REM Start all services in new windows
start "Member A Backend" cmd /k "cd /d Member A\backend && npm start"
timeout /t 2 /nobreak >nul

start "Member B Backend" cmd /k "cd /d Member B\backend && npm start"
timeout /t 2 /nobreak >nul

start "Member C Backend" cmd /k "cd /d Member C\backend && npm start"
timeout /t 2 /nobreak >nul

start "Frontend" cmd /k "cd /d frontend && npm start"

echo.
echo ✅ All services are starting in separate windows...
echo 📝 Close the windows individually or press Ctrl+C to stop
echo.


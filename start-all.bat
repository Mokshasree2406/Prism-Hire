@echo off
echo ================================================
echo   PRISM HIRE - Starting All Services
echo ================================================
echo.

REM Start Backend Server
echo [1/3] Starting Backend Server...
cd server
start "Prism Hire - Server" cmd /k "npm run dev"
cd ..

timeout /t 2 /nobreak > nul

REM Start Web Client (Vite)
echo [2/3] Starting Web Client...
cd client
start "Prism Hire - Web Client" cmd /k "npm run dev"
cd ..

timeout /t 2 /nobreak > nul

REM Start Mobile App (Expo)
echo [3/3] Starting Mobile App...
cd mobile
start "Prism Hire - Mobile" cmd /k "npm start"
cd ..

echo.
echo ================================================
echo   All services are starting!
echo ================================================
echo.
echo   Backend Server: http://localhost:5000
echo   Web Client:     http://localhost:5173 (Vite)
echo   Mobile App:     Check terminal for QR code
echo.
echo   Press Ctrl+C in each terminal to stop services
echo ================================================
pause

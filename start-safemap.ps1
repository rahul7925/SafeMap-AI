# SafeMap AI Real-Time Full-Stack Application Launcher
# Starts both Backend API Server (Port 5000) and Real-Time Vite Frontend (Port 5173) in ONE window

Write-Host "Clearing previous server processes..." -ForegroundColor DarkGray
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Launch via Node.js directly (avoids Windows Terminal 0x800700e8 tab errors & ampersand path splitting)
node "$PSScriptRoot\start.js"

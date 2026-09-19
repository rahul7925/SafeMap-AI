@echo off
echo Clearing previous server processes...
taskkill /F /IM node.exe >nul 2>&1
node "%~dp0start.js"

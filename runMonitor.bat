@echo off
REM Server Monitor Runner Script
REM This script runs the server health check and sends email alerts

cd /d "%~dp0"

echo ========================================
echo Server Monitor - Starting Check
echo Time: %date% %time%
echo ========================================
echo.

REM Run the monitoring script
call npm run check-multiple

echo.
echo ========================================
echo Check Complete
echo Time: %date% %time%
echo ========================================


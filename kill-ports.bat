@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo       BRIGHTLOOP - Port Killer ^& Clean Shutdown
echo ========================================================
echo.

set PORTS=5173 4000 3000 5000

for %%P in (%PORTS%) do (
    echo Checking port %%P...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr /r /c:":%%P[^0-9]"') do (
        set PID=%%a
        if not "!PID!"=="0" (
            echo   - Found process with PID !PID! on port %%P. Terminating...
            taskkill /F /PID !PID! >nul 2>&1
        )
    )
)

echo.
echo All Brightloop ports (5173, 4000, 3000, 5000) are clear!
echo ========================================================
pause


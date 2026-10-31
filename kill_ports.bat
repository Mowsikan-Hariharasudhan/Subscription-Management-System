@echo off
echo ============================================================
echo   Brightloop — Kill Ports Utility (5000 & 5173)
echo ============================================================

for %%p in (5000 5173) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%%p ^| findstr LISTENING') do (
        echo Killing process on port %%p (PID: %%a)...
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo.
echo Freeing any lingering nodemon/node dev processes...
for /f "tokens=2" %%i in ('wmic process where "name='node.exe' and CommandLine like '%%Odoo Kochi%%'" get ProcessId 2^>nul ^| findstr /r "[0-9]"') do (
    taskkill /F /PID %%i >nul 2>&1
)

echo Ports 5000 and 5173 are now completely free!
echo ============================================================
pause

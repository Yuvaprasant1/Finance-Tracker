@echo off
REM Setup Environment Variables for Production (Windows CMD)
REM Usage: scripts\setup-env.bat

echo Setting up environment variables for Finance Tracker...

REM Check if .env file exists
if not exist .env (
    echo Error: .env file not found!
    echo Please copy .env.example to .env and fill in your values:
    echo   copy .env.example .env
    echo   # Then edit .env with your actual credentials
    exit /b 1
)

REM Load environment variables from .env file
for /f "usebackq tokens=1,2 delims==" %%a in (".env") do (
    set "%%a=%%b"
)

REM Verify required variables are set
if "%MONGODB_URI%"=="" (
    echo Error: MONGODB_URI environment variable is not set!
    echo Please set it in your .env file
    exit /b 1
)

echo Environment variables loaded successfully!
echo Active profile: %SPRING_PROFILES_ACTIVE%
echo MongoDB URI: %MONGODB_URI:~0,30%...


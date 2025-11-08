# Setup Environment Variables for Production (Windows PowerShell)
# Usage: .\scripts\setup-env.ps1

Write-Host "Setting up environment variables for Finance Tracker..." -ForegroundColor Green

# Check if .env file exists
if (-Not (Test-Path .env)) {
    Write-Host "Error: .env file not found!" -ForegroundColor Red
    Write-Host "Please copy .env.example to .env and fill in your values:" -ForegroundColor Yellow
    Write-Host "  Copy-Item .env.example .env" -ForegroundColor Yellow
    Write-Host "  # Then edit .env with your actual credentials" -ForegroundColor Yellow
    exit 1
}

# Load environment variables from .env file
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        if ($value -match '^"(.*)"$') {
            $value = $matches[1]
        }
        [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
        Write-Host "Set $name" -ForegroundColor Gray
    }
}

# Verify required variables are set
if (-Not $env:MONGODB_URI) {
    Write-Host "Error: MONGODB_URI environment variable is not set!" -ForegroundColor Red
    Write-Host "Please set it in your .env file" -ForegroundColor Yellow
    exit 1
}

Write-Host "Environment variables loaded successfully!" -ForegroundColor Green
Write-Host "Active profile: $($env:SPRING_PROFILES_ACTIVE)" -ForegroundColor Cyan
Write-Host "MongoDB URI: $($env:MONGODB_URI.Substring(0, [Math]::Min(30, $env:MONGODB_URI.Length)))..." -ForegroundColor Cyan


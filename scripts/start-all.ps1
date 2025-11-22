# PowerShell script to start all Lendify services

Write-Host "🚀 Starting all Lendify services..." -ForegroundColor Cyan
Write-Host ""

# Function to start a service
function Start-Service {
    param (
        [string]$Name,
        [string]$Path,
        [string]$Command,
        [string[]]$Args,
        [string]$Color = "White"
    )
    
    Write-Host "[$Name] Starting..." -ForegroundColor $Color
    
    $process = Start-Process -FilePath $Command -ArgumentList $Args -WorkingDirectory $Path -PassThru -NoNewWindow
    
    Write-Host "[$Name] Started (PID: $($process.Id))" -ForegroundColor $Color
    return $process
}

# Copy .env files if they exist
$envFolder = Join-Path $PSScriptRoot "..\.env"
$backends = @(
    @{ Name = "Member A"; EnvFile = "MemberA.env"; BackendPath = Join-Path $PSScriptRoot "..\Member A\backend" },
    @{ Name = "Member B"; EnvFile = "MemberB.env"; BackendPath = Join-Path $PSScriptRoot "..\Member B\backend" },
    @{ Name = "Member C"; EnvFile = "MemberC.env"; BackendPath = Join-Path $PSScriptRoot "..\Member C\backend" }
)

foreach ($backend in $backends) {
    $envFile = Join-Path $envFolder $backend.EnvFile
    $targetEnv = Join-Path $backend.BackendPath ".env"
    
    if (Test-Path $envFile) {
        if (-not (Test-Path $targetEnv)) {
            Copy-Item $envFile $targetEnv
            Write-Host "✓ Copied $($backend.EnvFile) to $($backend.Name)/backend/.env" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠ Warning: $($backend.EnvFile) not found in .env folder" -ForegroundColor Yellow
    }
}

# Start all services
$processes = @()

# Member A Backend
$procA = Start-Service -Name "Member A Backend" `
    -Path (Join-Path $PSScriptRoot "..\Member A\backend") `
    -Command "npm" `
    -Args @("start") `
    -Color "Cyan"
$processes += $procA

Start-Sleep -Seconds 1

# Member B Backend
$procB = Start-Service -Name "Member B Backend" `
    -Path (Join-Path $PSScriptRoot "..\Member B\backend") `
    -Command "npm" `
    -Args @("start") `
    -Color "Green"
$processes += $procB

Start-Sleep -Seconds 1

# Member C Backend
$procC = Start-Service -Name "Member C Backend" `
    -Path (Join-Path $PSScriptRoot "..\Member C\backend") `
    -Command "npm" `
    -Args @("start") `
    -Color "Yellow"
$processes += $procC

Start-Sleep -Seconds 1

# Frontend
$procFrontend = Start-Service -Name "Frontend" `
    -Path (Join-Path $PSScriptRoot "..\frontend") `
    -Command "npm" `
    -Args @("start") `
    -Color "Magenta"
$processes += $procFrontend

Write-Host ""
Write-Host "✅ All services are starting..." -ForegroundColor Green
Write-Host "📝 Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Wait for Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host ""
    Write-Host "🛑 Shutting down all services..." -ForegroundColor Red
    
    foreach ($proc in $processes) {
        if (-not $proc.HasExited) {
            Stop-Process -Id $proc.Id -Force
        }
    }
    
    Write-Host "✅ All services stopped" -ForegroundColor Green
}


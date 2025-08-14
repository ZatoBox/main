# 🚀 ZatoBox v2.0 - Script de Inicio Automático
# Este script inicia todos los servicios de ZatoBox automáticamente

param(
    [switch]$Silent = $false
)

# Configuración de colores
$Green = "Green"
$Blue = "Blue"
$Yellow = "Yellow"
$Red = "Red"
$White = "White"

# Función para mostrar mensajes
function Write-Status {
    param(
        [string]$Message,
        [string]$Color = $White,
        [string]$Type = "INFO"
    )
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    $prefix = switch ($Type) {
        "SUCCESS" { "[OK]" }
        "ERROR" { "[ERROR]" }
        "WARNING" { "[WARN]" }
        "INFO" { "[INFO]" }
        default { "[INFO]" }
    }
    
    Write-Host "[$timestamp] $prefix $Message" -ForegroundColor $Color
}

# Función para verificar si un puerto está en uso
function Test-Port {
    param([int]$Port)
    
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        return $connection -ne $null
    }
    catch {
        return $false
    }
}

# Función para detener procesos en un puerto
function Stop-ProcessOnPort {
    param([int]$Port)
    
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                    Select-Object -ExpandProperty OwningProcess | 
                    ForEach-Object { Get-Process -Id $_ -ErrorAction SilentlyContinue }
        
        foreach ($process in $processes) {
            Write-Status "Deteniendo proceso $($process.ProcessName) (PID: $($process.Id)) en puerto $Port" $Yellow
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        }
        
        Start-Sleep -Seconds 2
        return $true
    }
    catch {
        Write-Status "Error al detener procesos en puerto $Port" $Red "ERROR"
        return $false
    }
}

# Función para configurar PATH de Tesseract
function Set-TesseractPath {
    $tesseractPath = "C:\Program Files\Tesseract-OCR"
    
    if (Test-Path $tesseractPath) {
        $env:PATH += ";$tesseractPath"
        Write-Status "Tesseract PATH configurado: $tesseractPath" $Green "SUCCESS"
        return $true
    }
    else {
        Write-Status "Tesseract no encontrado en $tesseractPath" $Red "ERROR"
        Write-Status "Por favor instale Tesseract OCR primero" $Yellow "WARNING"
        return $false
    }
}

# Función para crear directorios necesarios dentro de OCR
function Create-OCRDirectories {
    $ocrPath = Join-Path $PSScriptRoot "OCR"
    $directories = @(
        "uploads",
        "uploads\products",
        "uploads\ocr",
        "outputs",
        "logs"
    )

    foreach ($dir in $directories) {
        $fullPath = Join-Path $ocrPath $dir
        if (-not (Test-Path $fullPath)) {
            New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
            Write-Status "Directorio creado: $fullPath" $Green "SUCCESS"
        } else {
            Write-Status "Directorio existente: $fullPath" $Green "SUCCESS"
        }
    }
}

# Función para verificar comandos
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Función para obtener el comando de Python correcto
function Get-PythonCommand {
    if (Test-Command "py") {
        return "py"
    } elseif (Test-Command "python") {
        return "python"
    } else {
        return $null
    }
}

# Función para mostrar información de acceso
function Show-AccessInfo {
    Write-Host ""
    Write-Host "ZatoBox v2.0 iniciado exitosamente!" -ForegroundColor $Green
    Write-Host ""
    Write-Host "URLs de acceso:" -ForegroundColor $Yellow
    Write-Host "   Frontend: http://localhost:5173" -ForegroundColor $White
    Write-Host "   Backend:  http://localhost:4444" -ForegroundColor $White
    Write-Host "   OCR:      http://localhost:5000" -ForegroundColor $White
    Write-Host ""
    Write-Host "Credenciales de prueba:" -ForegroundColor $Yellow
    Write-Host "   Email: admin@frontposw.com" -ForegroundColor $White
    Write-Host "   Password: admin12345678" -ForegroundColor $White
    Write-Host ""
    Write-Host "Para más información, consulta el README.md" -ForegroundColor $Blue
    Write-Host ""
}

# Función para iniciar el frontend
function Start-Frontend {
    $frontendPath = Join-Path $PSScriptRoot "frontend"

    Write-Status "Iniciando Frontend (puerto 5173)..." $Yellow
    try {
        $frontendJob = Start-Job -ScriptBlock {
            Set-Location $using:frontendPath
            npm run dev
        }
        Write-Status "Frontend iniciado correctamente" $Green "SUCCESS"
    } catch {
        Write-Status "Error al iniciar Frontend: $($_.Exception.Message)" $Red "ERROR"
        exit 1
    }
}

# Función para iniciar el OCR
function Start-OCR {
    $ocrPath = Join-Path $PSScriptRoot "OCR"
    $ocrVenvPath = Join-Path $ocrPath ".venv"
    $activateScript = Join-Path $ocrVenvPath "Scripts\activate"
    $ocrScript = Join-Path $ocrPath "app-light-fixed.py"

    if (-not (Test-Path $activateScript)) {
        Write-Status "Script de activación del OCR no encontrado en: $activateScript" $Red "ERROR"
        exit 1
    }

    Write-Status "Iniciando Servidor OCR (puerto 5000)..." $Yellow
    try {
        Set-Location $ocrPath
        & cmd /c "$activateScript && python $ocrScript"
        Write-Status "Servidor OCR iniciado correctamente" $Green "SUCCESS"
    } catch {
        Write-Status "Error al iniciar Servidor OCR: $($_.Exception.Message)" $Red "ERROR"
        exit 1
    }
}

# Función para iniciar todos los servicios en un flujo continuo
function Start-AllServices {
    Write-Status "Iniciando todos los servicios..." $Blue

    # Iniciar Frontend
    $frontendPath = Join-Path $PSScriptRoot "frontend"
    Write-Status "Iniciando Frontend (puerto 5173)..." $Yellow
    try {
        Start-Job -ScriptBlock {
            Set-Location $using:frontendPath
            npm run dev
        } | Out-Null
        Write-Status "Frontend iniciado correctamente" $Green "SUCCESS"
    } catch {
        Write-Status "Error al iniciar Frontend: $($_.Exception.Message)" $Red "ERROR"
        exit 1
    }

    Start-Sleep -Seconds 5

    # Iniciar Backend
    $backendRootPath = Join-Path $PSScriptRoot "backend"
    $backendPath = Join-Path $backendRootPath "zato-csm-backend"
    $backendVenvPath = Join-Path $backendPath ".venv"
    $pythonExecutable = Join-Path $backendVenvPath "Scripts\python.exe"
    $backendMain = Join-Path $backendPath "main.py"

    if (-not (Test-Path $backendRootPath)) {
        Write-Status "Ruta backend inexistente: $backendRootPath" $Red "ERROR"
        exit 1
    }

    if (-not (Test-Path $backendPath)) {
        Write-Status "Ruta zato-csm-backend inexistente: $backendPath" $Red "ERROR"
        exit 1
    }

    if (-not (Test-Path $pythonExecutable)) {
        Write-Status "Python del entorno virtual no encontrado en: $pythonExecutable" $Red "ERROR"
        exit 1
    }

    if (-not (Test-Path $backendMain)) {
        Write-Status "Archivo main.py no encontrado en: $backendMain" $Red "ERROR"
        exit 1
    }

    Write-Status "Iniciando Backend (puerto 4444)..." $Yellow
    try {
        $backendJob = Start-Job -ScriptBlock {
            Set-Location $using:backendPath
            & $using:pythonExecutable -m uvicorn main:app --host 0.0.0.0 --port 4444
        }
        Start-Sleep -Seconds 5 # Espera para asegurarse de que el backend se inicie correctamente
        if ($backendJob.State -ne "Running") {
            Write-Status "Error: El backend no se está ejecutando después de iniciar el job." $Red "ERROR"
            Receive-Job -Job $backendJob -Keep
            Remove-Job -Job $backendJob
            exit 1
        }
        Write-Status "Backend iniciado correctamente en segundo plano" $Green "SUCCESS"
    } catch {
        Write-Status "Error al iniciar Backend: $($_.Exception.Message)" $Red "ERROR"
        exit 1
    }

    Start-Sleep -Seconds 5

    # Iniciar OCR
    $ocrPath = Join-Path $PSScriptRoot "OCR"
    $ocrVenvPath = Join-Path $ocrPath ".venv"
    $activateOCR = Join-Path $ocrVenvPath "Scripts\activate"
    $ocrScript = Join-Path $ocrPath "app-light-fixed.py"

    if (-not (Test-Path $activateOCR)) {
        Write-Status "Script de activación del OCR no encontrado en: $activateOCR" $Red "ERROR"
        exit 1
    }

    Write-Status "Iniciando Servidor OCR (puerto 5000)..." $Yellow
    try {
        Start-Job -ScriptBlock {
            Set-Location $using:ocrPath
            & cmd /c "$using:activateOCR && python $using:ocrScript"
        } | Out-Null
        Write-Status "Servidor OCR iniciado correctamente" $Green "SUCCESS"
    } catch {
        Write-Status "Error al iniciar Servidor OCR: $($_.Exception.Message)" $Red "ERROR"
        exit 1
    }

    Write-Status "Todos los servicios han sido iniciados." $Green "SUCCESS"
}

# ==========================================
# INICIO DEL SCRIPT
# ==========================================
Write-Host "==========================================" -ForegroundColor $Green
Write-Host "  ZatoBox v2.0 - Inicio Automático" -ForegroundColor $Green
Write-Host "==========================================" -ForegroundColor $Green
Write-Host ""

# Crear directorios necesarios dentro de OCR
Create-OCRDirectories

# Detener servicios existentes
Write-Status "Deteniendo servicios existentes..." $Yellow
$ports = @(4444, 5173, 5000)
foreach ($port in $ports) {
    if (Test-Port $port) {
        Stop-ProcessOnPort $port
    }
}

Start-Sleep -Seconds 3

# Iniciar todos los servicios
Start-AllServices

# Verificar servicios
Write-Status "Verificando servicios..." $Blue
$servicesStatus = @{
    "Frontend (5173)" = $false
    "Backend (4444)" = $false
    "OCR (5000)" = $false
}

if (Test-Port 5173) {
    $servicesStatus["Frontend (5173)"] = $true
    Write-Status "Frontend: OK" $Green "SUCCESS"
} else {
    Write-Status "Frontend: ERROR" $Red "ERROR"
}

if (Test-Port 4444) {
    $servicesStatus["Backend (4444)"] = $true
    Write-Status "Backend: OK" $Green "SUCCESS"
} else {
    Write-Status "Backend: ERROR" $Red "ERROR"
}

if (Test-Port 5000) {
    $servicesStatus["OCR (5000)"] = $true
    Write-Status "OCR: OK" $Green "SUCCESS"
} else {
    Write-Status "OCR: ERROR" $Red "ERROR"
}

# Resultado final
$allServicesRunning = $servicesStatus.Values -notcontains $false
if ($allServicesRunning) {
    Show-AccessInfo
} else {
    Write-Host ""; Write-Host "Algunos servicios no se iniciaron correctamente" -ForegroundColor $Red
}

# ==========================================
# MONITOREO CONTINUO (OPCIONAL)
# ==========================================
if (-not $Silent) {
    Write-Host ""
    Write-Host "Monitoreo de servicios activo..." -ForegroundColor $Blue
    Write-Host "Presiona Ctrl+C para detener todos los servicios" -ForegroundColor $Yellow
    Write-Host ""
    
    try {
        while ($true) {
            $timestamp = Get-Date -Format "HH:mm:ss"
            $backendStatus = if (Test-Port 4444) { "[OK]" } else { "[ERROR]" }
            $frontendStatus = if (Test-Port 5173) { "[OK]" } else { "[ERROR]" }
            $ocrStatus = if (Test-Port 5000) { "[OK]" } else { "[ERROR]" }
            
            Write-Host "[$timestamp] Backend: $backendStatus | Frontend: $frontendStatus | OCR: $ocrStatus" -ForegroundColor $White
            
            Start-Sleep -Seconds 30
        }
    }
    catch {
        Write-Host ""
        Write-Status "Deteniendo servicios..." $Yellow
        
        # Detener jobs
        if ($backendJob) { Stop-Job $backendJob; Remove-Job $backendJob }
        if ($frontendJob) { Stop-Job $frontendJob; Remove-Job $frontendJob }
        if ($ocrJob) { Stop-Job $ocrJob; Remove-Job $ocrJob }
        
        Write-Status "Servicios detenidos" $Green "SUCCESS"
    }
}
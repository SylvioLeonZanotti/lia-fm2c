@echo off
cd /d "%~dp0frontend"

if not exist node_modules (
    echo [1/2] Instalando dependencias npm...
    npm install
    if errorlevel 1 (
        echo ERRO: Falha ao instalar dependencias npm.
        pause
        exit /b 1
    )
)

echo [2/2] Iniciando frontend em http://localhost:3000
echo.
npm run dev

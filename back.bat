@echo off
cd /d "%~dp0backend"

if not exist venv (
    echo [1/3] Criando ambiente virtual Python...
    py -m venv venv
    if errorlevel 1 (
        echo ERRO: Python nao encontrado. Instale o Python 3 e tente novamente.
        pause
        exit /b 1
    )
)

echo [2/3] Instalando dependencias...
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependencias.
    pause
    exit /b 1
)

echo [3/3] Iniciando backend em http://localhost:8000
echo.
uvicorn main:app --reload

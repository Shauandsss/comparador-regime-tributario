Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Instalador Comparador Tributário" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "d:\Git R\comparador-regime-tributario"

# Função para verificar se Node está instalado
function Test-NodeInstalled {
    try {
        $nodeVersion = node --version
        Write-Host "✓ Node.js detectado: $nodeVersion" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ Node.js não encontrado!" -ForegroundColor Red
        Write-Host "  Por favor, instale Node.js 18+ em: https://nodejs.org" -ForegroundColor Yellow
        return $false
    }
}

# Verificar Node.js
if (-not (Test-NodeInstalled)) {
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  INSTALANDO BACKEND" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Set-Location "$projectRoot\backend"

Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend instalado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "✗ Erro ao instalar backend" -ForegroundColor Red
    exit 1
}

# Criar .env se não existir
if (-not (Test-Path ".env")) {
    Write-Host "📝 Criando arquivo .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Arquivo .env criado!" -ForegroundColor Green
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  INSTALANDO FRONTEND" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Set-Location "$projectRoot\frontend"

Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend instalado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "✗ Erro ao instalar frontend" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  EXECUTANDO TESTES" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Set-Location "$projectRoot\backend"

Write-Host "🧪 Executando testes do backend..." -ForegroundColor Yellow
npm test

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Todos os testes passaram!" -ForegroundColor Green
} else {
    Write-Host "⚠ Alguns testes falharam, mas você pode continuar" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  ✓ INSTALAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar o projeto:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend (Terminal 1):" -ForegroundColor Yellow
Write-Host "  cd '$projectRoot\backend'" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Frontend (Terminal 2):" -ForegroundColor Yellow
Write-Host "  cd '$projectRoot\frontend'" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Acesse: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

Set-Location $projectRoot

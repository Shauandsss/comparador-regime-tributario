# 🧪 Scripts de Teste Manual - PowerShell

# Script para testar os endpoints da API de cálculos tributários
# Execute no PowerShell após iniciar o backend (npm run dev)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Testando API - Cálculos Tributários" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001"

# Dados de teste
$dados = @{
    rbt12 = 1200000
    atividade = "serviço"
    folha = 200000
    despesas = 350000
} | ConvertTo-Json

Write-Host "📊 Dados de entrada:" -ForegroundColor Yellow
Write-Host $dados
Write-Host ""

# Teste 1: Simples Nacional
Write-Host "1️⃣  Testando Simples Nacional..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/calcular/simples" -Method Post -Body $dados -ContentType "application/json"
    Write-Host "✅ Simples Nacional: R$ $($response.data.impostoTotal)" -ForegroundColor Green
    Write-Host "   Alíquota: $($response.data.aliquota)%" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}
Write-Host ""

# Teste 2: Lucro Presumido
Write-Host "2️⃣  Testando Lucro Presumido..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/calcular/presumido" -Method Post -Body $dados -ContentType "application/json"
    Write-Host "✅ Lucro Presumido: R$ $($response.data.impostoTotal)" -ForegroundColor Green
    Write-Host "   Lucro Presumido: R$ $($response.data.lucroPresumido)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}
Write-Host ""

# Teste 3: Lucro Real
Write-Host "3️⃣  Testando Lucro Real..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/calcular/real" -Method Post -Body $dados -ContentType "application/json"
    Write-Host "✅ Lucro Real: R$ $($response.data.impostoTotal)" -ForegroundColor Green
    Write-Host "   Lucro Líquido: R$ $($response.data.lucroLiquido)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}
Write-Host ""

# Teste 4: Comparar
Write-Host "4️⃣  Testando Comparação..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/calcular/comparar" -Method Post -Body $dados -ContentType "application/json"
    Write-Host "✅ Comparação concluída!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   📊 Resultados:" -ForegroundColor Cyan
    Write-Host "   • Simples Nacional: R$ $($response.data.comparacao.simples)" -ForegroundColor White
    Write-Host "   • Lucro Presumido: R$ $($response.data.comparacao.presumido)" -ForegroundColor White
    Write-Host "   • Lucro Real: R$ $($response.data.comparacao.real)" -ForegroundColor White
    Write-Host ""
    Write-Host "   🏆 Melhor regime: $($response.data.melhor_regime)" -ForegroundColor Yellow
    Write-Host "   💰 Economia: R$ $($response.data.economia.valor) ($($response.data.economia.percentual)%)" -ForegroundColor Green
    Write-Host ""
    Write-Host "   📋 Ranking:" -ForegroundColor Cyan
    foreach ($item in $response.data.ranking) {
        Write-Host "   $($item.posicao)º - $($item.regime): R$ $($item.impostoTotal)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}
Write-Host ""

# Teste 5: Informações
Write-Host "5️⃣  Testando Informações..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/calcular/info" -Method Get
    Write-Host "✅ Informações obtidas com sucesso!" -ForegroundColor Green
    Write-Host "   • Simples Nacional: $($response.data.simplesNacional.descricao)" -ForegroundColor Gray
    Write-Host "   • Lucro Presumido: $($response.data.lucroPresumido.descricao)" -ForegroundColor Gray
    Write-Host "   • Lucro Real: $($response.data.lucroReal.descricao)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Testes concluídos!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

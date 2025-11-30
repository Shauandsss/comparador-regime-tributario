# Script de Teste - Três Cenários Realistas de Comparação Tributária
# Executa testes práticos para validar qual regime é mais vantajoso

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   TESTES DE CENÁRIOS REAIS - COMPARADOR TRIBUTÁRIO           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Verificar se o servidor está rodando
Write-Host "🔍 Verificando se o servidor está ativo..." -ForegroundColor Yellow
try {
    $status = Invoke-RestMethod -Uri "http://localhost:3001/status" -ErrorAction Stop
    Write-Host "✅ Servidor ativo!" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Servidor não está rodando em http://localhost:3001" -ForegroundColor Red
    Write-Host "   Execute primeiro: cd backend; npm run dev" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n" -NoNewline

# ==============================================================================
# 🟦 TESTE 1 — Simples Nacional é o mais vantajoso
# ==============================================================================
Write-Host "`n┌─────────────────────────────────────────────────────────────────┐" -ForegroundColor Blue
Write-Host "│ 🟦 TESTE 1 — SIMPLES NACIONAL MAIS VANTAJOSO                   │" -ForegroundColor Blue
Write-Host "└─────────────────────────────────────────────────────────────────┘" -ForegroundColor Blue
Write-Host "✔ Cenário: Empresa pequena, serviço leve, poucas despesas" -ForegroundColor Gray
Write-Host "  • Receita: R$ 300.000/ano" -ForegroundColor Gray
Write-Host "  • Folha: R$ 40.000" -ForegroundColor Gray
Write-Host "  • Atividade: Serviços" -ForegroundColor Gray
Write-Host "  • Despesas: R$ 20.000`n" -ForegroundColor Gray

$teste1 = @{
    rbt12 = 300000
    folha = 40000
    atividade = "servico"
    despesas = 20000
} | ConvertTo-Json

try {
    $uri = "http://localhost:3001/calcular/comparar"
    $resultado1 = Invoke-RestMethod -Uri $uri -Method POST -Body $teste1 -ContentType "application/json"
    
    if ($resultado1.success) {
        $data = $resultado1.data
        
        Write-Host "📊 RESULTADOS:" -ForegroundColor Cyan
        $simplesTotal = [math]::Round($data.regimes.simples.imposto_total, 2)
        $presumidoTotal = [math]::Round($data.regimes.presumido.imposto_total, 2)
        $realTotal = [math]::Round($data.regimes.real.imposto_total, 2)
        
        Write-Host "   Simples Nacional:  R$ $($simplesTotal.ToString('N2'))" -ForegroundColor White
        Write-Host "   Lucro Presumido:   R$ $($presumidoTotal.ToString('N2'))" -ForegroundColor White
        Write-Host "   Lucro Real:        R$ $($realTotal.ToString('N2'))" -ForegroundColor White
        
        $melhorOpcao = $data.melhor_opcao.ToUpper()
        $economiaValor = [math]::Round($data.economia.valor, 2)
        $economiaPercent = [math]::Round($data.economia.percentual, 2)
        
        Write-Host "`n🏆 MELHOR OPÇÃO: $melhorOpcao" -ForegroundColor Green
        Write-Host "💰 ECONOMIA: R$ $($economiaValor.ToString('N2')) ($economiaPercent%)" -ForegroundColor Green
        
        if ($data.melhor_opcao -eq "simples") {
            Write-Host "✅ TESTE 1 PASSOU: Simples Nacional é o mais vantajoso!" -ForegroundColor Green
        } else {
            Write-Host "❌ TESTE 1 FALHOU: Esperado 'simples', obtido '$($data.melhor_opcao)'" -ForegroundColor Red
        }
    }
}
catch {
    Write-Host "❌ ERRO no Teste 1: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# ==============================================================================
# 🟩 TESTE 2 — Lucro Presumido é o mais vantajoso
# ==============================================================================
Write-Host "`n┌─────────────────────────────────────────────────────────────────┐" -ForegroundColor Green
Write-Host "│ 🟩 TESTE 2 — LUCRO PRESUMIDO MAIS VANTAJOSO                    │" -ForegroundColor Green
Write-Host "└─────────────────────────────────────────────────────────────────┘" -ForegroundColor Green
Write-Host "✔ Cenário: Comércio com margem alta e despesas baixas" -ForegroundColor Gray
Write-Host "  • Receita: R$ 1.800.000/ano" -ForegroundColor Gray
Write-Host "  • Folha: R$ 120.000" -ForegroundColor Gray
Write-Host "  • Atividade: Comércio" -ForegroundColor Gray
Write-Host "  • Despesas: R$ 100.000`n" -ForegroundColor Gray

$teste2 = @{
    rbt12 = 1800000
    folha = 120000
    atividade = "comercio"
    despesas = 100000
} | ConvertTo-Json

try {
    $uri = "http://localhost:3001/calcular/comparar"
    $resultado2 = Invoke-RestMethod -Uri $uri -Method POST -Body $teste2 -ContentType "application/json"
    
    if ($resultado2.success) {
        $data = $resultado2.data
        
        Write-Host "📊 RESULTADOS:" -ForegroundColor Cyan
        $simplesTotal = [math]::Round($data.regimes.simples.imposto_total, 2)
        $presumidoTotal = [math]::Round($data.regimes.presumido.imposto_total, 2)
        $realTotal = [math]::Round($data.regimes.real.imposto_total, 2)
        
        Write-Host "   Simples Nacional:  R$ $($simplesTotal.ToString('N2'))" -ForegroundColor White
        Write-Host "   Lucro Presumido:   R$ $($presumidoTotal.ToString('N2'))" -ForegroundColor White
        Write-Host "   Lucro Real:        R$ $($realTotal.ToString('N2'))" -ForegroundColor White
        
        $melhorOpcao = $data.melhor_opcao.ToUpper()
        $economiaValor = [math]::Round($data.economia.valor, 2)
        $economiaPercent = [math]::Round($data.economia.percentual, 2)
        
        Write-Host "`n🏆 MELHOR OPÇÃO: $melhorOpcao" -ForegroundColor Green
        Write-Host "💰 ECONOMIA: R$ $($economiaValor.ToString('N2')) ($economiaPercent%)" -ForegroundColor Green
        
        if ($data.melhor_opcao -eq "presumido") {
            Write-Host "✅ TESTE 2 PASSOU: Lucro Presumido é o mais vantajoso!" -ForegroundColor Green
        } else {
            Write-Host "❌ TESTE 2 FALHOU: Esperado 'presumido', obtido '$($data.melhor_opcao)'" -ForegroundColor Red
        }
    }
}
catch {
    Write-Host "❌ ERRO no Teste 2: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# ==============================================================================
# 🟥 TESTE 3 — Lucro Real é o mais vantajoso
# ==============================================================================
Write-Host "`n┌─────────────────────────────────────────────────────────────────┐" -ForegroundColor Red
Write-Host "│ 🟥 TESTE 3 — LUCRO REAL MAIS VANTAJOSO                         │" -ForegroundColor Red
Write-Host "└─────────────────────────────────────────────────────────────────┘" -ForegroundColor Red
Write-Host "✔ Cenário: Indústria com despesas enormes" -ForegroundColor Gray
Write-Host "  • Receita: R$ 3.000.000/ano" -ForegroundColor Gray
Write-Host "  • Folha: R$ 400.000" -ForegroundColor Gray
Write-Host "  • Atividade: Indústria" -ForegroundColor Gray
Write-Host "  • Despesas: R$ 2.200.000`n" -ForegroundColor Gray

$teste3 = @{
    rbt12 = 3000000
    folha = 400000
    atividade = "industria"
    despesas = 2200000
} | ConvertTo-Json

try {
    $uri = "http://localhost:3001/calcular/comparar"
    $resultado3 = Invoke-RestMethod -Uri $uri -Method POST -Body $teste3 -ContentType "application/json"
    
    if ($resultado3.success) {
        $data = $resultado3.data
        
        Write-Host "📊 RESULTADOS:" -ForegroundColor Cyan
        $simplesTotal = [math]::Round($data.regimes.simples.imposto_total, 2)
        $presumidoTotal = [math]::Round($data.regimes.presumido.imposto_total, 2)
        $realTotal = [math]::Round($data.regimes.real.imposto_total, 2)
        
        Write-Host "   Simples Nacional:  R$ $($simplesTotal.ToString('N2'))" -ForegroundColor White
        Write-Host "   Lucro Presumido:   R$ $($presumidoTotal.ToString('N2'))" -ForegroundColor White
        Write-Host "   Lucro Real:        R$ $($realTotal.ToString('N2'))" -ForegroundColor White
        
        $melhorOpcao = $data.melhor_opcao.ToUpper()
        $economiaValor = [math]::Round($data.economia.valor, 2)
        $economiaPercent = [math]::Round($data.economia.percentual, 2)
        
        Write-Host "`n🏆 MELHOR OPÇÃO: $melhorOpcao" -ForegroundColor Green
        Write-Host "💰 ECONOMIA: R$ $($economiaValor.ToString('N2')) ($economiaPercent%)" -ForegroundColor Green
        
        if ($data.melhor_opcao -eq "real") {
            Write-Host "✅ TESTE 3 PASSOU: Lucro Real é o mais vantajoso!" -ForegroundColor Green
        } else {
            Write-Host "❌ TESTE 3 FALHOU: Esperado 'real', obtido '$($data.melhor_opcao)'" -ForegroundColor Red
        }
    }
}
catch {
    Write-Host "❌ ERRO no Teste 3: $($_.Exception.Message)" -ForegroundColor Red
}

# ==============================================================================
# RESUMO FINAL
# ==============================================================================
Write-Host "`n`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                      RESUMO DOS TESTES                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n✅ Todos os testes foram executados!" -ForegroundColor Green
Write-Host "📊 Verifique os resultados acima para validar os cálculos`n" -ForegroundColor Yellow

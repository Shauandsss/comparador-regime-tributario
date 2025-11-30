# Script de Teste - Tres Cenarios Realistas de Comparacao Tributaria

Write-Host "`n=============================================================" -ForegroundColor Cyan
Write-Host "   TESTES DE CENARIOS REAIS - COMPARADOR TRIBUTARIO" -ForegroundColor Cyan
Write-Host "=============================================================`n" -ForegroundColor Cyan

# Verificar se o servidor esta rodando
Write-Host "Verificando se o servidor esta ativo..." -ForegroundColor Yellow
try {
    $status = Invoke-RestMethod -Uri "http://localhost:3001/status" -ErrorAction Stop
    Write-Host "Servidor ativo!`n" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Servidor nao esta rodando em http://localhost:3001" -ForegroundColor Red
    Write-Host "Execute primeiro: cd backend; npm run dev" -ForegroundColor Yellow
    exit 1
}

# =============================================================================
# TESTE 1 - Simples Nacional mais vantajoso
# =============================================================================
Write-Host "-------------------------------------------------------------" -ForegroundColor Blue
Write-Host "TESTE 1 - SIMPLES NACIONAL MAIS VANTAJOSO" -ForegroundColor Blue
Write-Host "-------------------------------------------------------------" -ForegroundColor Blue
Write-Host "Cenario: Empresa pequena de servico leve (Anexo III)"
Write-Host "  Receita: R$ 300.000/ano"
Write-Host "  Folha: R$ 40.000"
Write-Host "  Atividade: Servicos (Anexo III)"
Write-Host "  Despesas: R$ 20.000`n"

$body1 = '{"rbt12":300000,"folha":40000,"atividade":"servico","despesas":20000}'
try {
    $resultado1 = Invoke-RestMethod -Uri "http://localhost:3001/calcular/comparar" -Method POST -Body $body1 -ContentType "application/json"
    
    if ($resultado1.success) {
        $data = $resultado1.data
        
        Write-Host "RESULTADOS:" -ForegroundColor Cyan
        Write-Host "   Simples Nacional:  R$ $([math]::Round($data.regimes.simples.imposto_total,2).ToString('N2'))"
        Write-Host "   Lucro Presumido:   R$ $([math]::Round($data.regimes.presumido.imposto_total,2).ToString('N2'))"
        Write-Host "   Lucro Real:        R$ $([math]::Round($data.regimes.real.imposto_total,2).ToString('N2'))"
        
        Write-Host "`nMELHOR OPCAO: $($data.melhor_opcao.ToUpper())" -ForegroundColor Green
        Write-Host "ECONOMIA: R$ $([math]::Round($data.economia.valor,2).ToString('N2')) ($([math]::Round($data.economia.percentual,2))%)`n" -ForegroundColor Green
        
        if ($data.melhor_opcao -eq "simples") {
            Write-Host "TESTE 1 PASSOU: Simples Nacional e o mais vantajoso!" -ForegroundColor Green
        } else {
            Write-Host "TESTE 1 FALHOU: Esperado 'simples', obtido '$($data.melhor_opcao)'" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "ERRO no Teste 1: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# =============================================================================
# TESTE 2 - Lucro Presumido mais vantajoso
# =============================================================================
Write-Host "`n-------------------------------------------------------------" -ForegroundColor Green
Write-Host "TESTE 2 - LUCRO PRESUMIDO MAIS VANTAJOSO" -ForegroundColor Green
Write-Host "-------------------------------------------------------------" -ForegroundColor Green
Write-Host "Cenario: Comercio com margem alta e despesas baixas"
Write-Host "  Receita: R$ 1.800.000/ano"
Write-Host "  Folha: R$ 120.000"
Write-Host "  Atividade: Comercio"
Write-Host "  Despesas: R$ 100.000`n"

$body2 = '{"rbt12":1800000,"folha":120000,"atividade":"comercio","despesas":100000}'
try {
    $resultado2 = Invoke-RestMethod -Uri "http://localhost:3001/calcular/comparar" -Method POST -Body $body2 -ContentType "application/json"
    
    if ($resultado2.success) {
        $data = $resultado2.data
        
        Write-Host "RESULTADOS:" -ForegroundColor Cyan
        Write-Host "   Simples Nacional:  R$ $([math]::Round($data.regimes.simples.imposto_total,2).ToString('N2'))"
        Write-Host "   Lucro Presumido:   R$ $([math]::Round($data.regimes.presumido.imposto_total,2).ToString('N2'))"
        Write-Host "   Lucro Real:        R$ $([math]::Round($data.regimes.real.imposto_total,2).ToString('N2'))"
        
        Write-Host "`nMELHOR OPCAO: $($data.melhor_opcao.ToUpper())" -ForegroundColor Green
        Write-Host "ECONOMIA: R$ $([math]::Round($data.economia.valor,2).ToString('N2')) ($([math]::Round($data.economia.percentual,2))%)`n" -ForegroundColor Green
        
        if ($data.melhor_opcao -eq "presumido") {
            Write-Host "TESTE 2 PASSOU: Lucro Presumido e o mais vantajoso!" -ForegroundColor Green
        } else {
            Write-Host "TESTE 2 FALHOU: Esperado 'presumido', obtido '$($data.melhor_opcao)'" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "ERRO no Teste 2: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# =============================================================================
# TESTE 3 - Lucro Real mais vantajoso
# =============================================================================
Write-Host "-------------------------------------------------------------" -ForegroundColor Red
Write-Host "TESTE 3 - LUCRO REAL MAIS VANTAJOSO" -ForegroundColor Red
Write-Host "-------------------------------------------------------------" -ForegroundColor Red
Write-Host "Cenario: Industria com despesas altissimas (quase prejuizo)"
Write-Host "  Receita: R$ 3.000.000/ano"
Write-Host "  Folha: R$ 400.000 (também dedutível no Lucro Real)"
Write-Host "  Atividade: Industria"
Write-Host "  Despesas: R$ 2.500.000"
Write-Host "  Total dedutível no Real: R$ 2.900.000 (despesas + folha)"
Write-Host "  Lucro Real: R$ 100.000 (muito menor que o presumido de R$ 240.000)`n"

$body3 = '{"rbt12":3000000,"folha":400000,"atividade":"industria","despesas":2500000}'
try {
    $resultado3 = Invoke-RestMethod -Uri "http://localhost:3001/calcular/comparar" -Method POST -Body $body3 -ContentType "application/json"
    
    if ($resultado3.success) {
        $data = $resultado3.data
        
        Write-Host "RESULTADOS:" -ForegroundColor Cyan
        Write-Host "   Simples Nacional:  R$ $([math]::Round($data.regimes.simples.imposto_total,2).ToString('N2'))"
        Write-Host "   Lucro Presumido:   R$ $([math]::Round($data.regimes.presumido.imposto_total,2).ToString('N2'))"
        Write-Host "   Lucro Real:        R$ $([math]::Round($data.regimes.real.imposto_total,2).ToString('N2'))"
        
        Write-Host "`nMELHOR OPCAO: $($data.melhor_opcao.ToUpper())" -ForegroundColor Green
        Write-Host "ECONOMIA: R$ $([math]::Round($data.economia.valor,2).ToString('N2')) ($([math]::Round($data.economia.percentual,2))%)`n" -ForegroundColor Green
        
        if ($data.melhor_opcao -eq "real") {
            Write-Host "TESTE 3 PASSOU: Lucro Real e o mais vantajoso!" -ForegroundColor Green
        } else {
            Write-Host "TESTE 3 FALHOU: Esperado 'real', obtido '$($data.melhor_opcao)'" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "ERRO no Teste 3: $($_.Exception.Message)" -ForegroundColor Red
}

# =============================================================================
# RESUMO FINAL
# =============================================================================
Write-Host "`n=============================================================" -ForegroundColor Cyan
Write-Host "                 RESUMO DOS TESTES" -ForegroundColor Cyan
Write-Host "=============================================================`n" -ForegroundColor Cyan
Write-Host "Todos os testes foram executados!" -ForegroundColor Green
Write-Host "Verifique os resultados acima para validar os calculos`n" -ForegroundColor Yellow

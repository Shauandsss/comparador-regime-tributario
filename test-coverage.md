# 📊 Test Coverage Tracker

**Última atualização:** 3 de dezembro de 2025

## 📈 Estatísticas Gerais

- **Total de Componentes:** 40
- **Com Testes:** 12 (30%)
- **Sem Testes:** 28 (70%)
- **Total de Testes:** 211
- **Testes Passando:** 195
- **Testes Failing:** 3
- **Testes Skipped:** 13

---

## ✅ Componentes COM Cobertura de Testes (12)

| Componente | Arquivo de Teste | Testes | Status | Notas |
|------------|------------------|--------|--------|-------|
| CalculadoraDAS | `CalculadoraDAS.test.jsx` | 12 | ✅ Todos passando | Cálculo de DAS com seleção de CNAE |
| CalculadoraMargem | `CalculadoraMargem.test.jsx` | 17 | ✅ Todos passando | Cálculo de margem/markup e custeio |
| CalculadoraDistribuicaoLucros | `CalculadoraDistribuicaoLucros.test.jsx` | 24 | ✅ Todos passando | Otimização distribuição lucros isenta vs pró-labore |
| CalculadoraPresumido | `CalculadoraPresumido.test.jsx` | 27 | ✅ Todos passando | Cálculo de Lucro Presumido com IRPJ/CSLL |
| CalculadoraReal | `CalculadoraReal.test.jsx` | 25 (18 passing, 7 skipped) | ⚠️ Parcial | Lucro Real com redirecionamento |
| CalculadoraValuation | `CalculadoraValuation.test.jsx` | 25 (22 passing, 3 failing) | ⚠️ Parcial | Valuation pre/post-money, sensibilidade, cálculo reverso |
| CalculadoraProLabore | `CalculadoraProLabore.test.jsx` | 6 | ✅ Todos passando | Cálculo automático via useEffect |
| DiagnosticoTributario | `DiagnosticoTributario.test.jsx` | 11 | ✅ Todos passando | Análise diagnóstica com ranking |
| SimuladorCreditos | `SimuladorCreditos.test.jsx` | 14 (8 passing, 6 skipped) | ⚠️ Parcial | 6 testes aguardando refatoração |
| SimuladorFatorR | `SimuladorFatorR.test.jsx` | 15 | ✅ Todos passando | Cálculo Fator R para anexos |
| SimuladorMigracao | `SimuladorMigracao.test.jsx` | 27 | ✅ Todos passando | Simulação de migração entre regimes |
| TermometroRisco | `TermometroRisco.test.jsx` | 8 | ✅ Todos passando | Questionário de risco tributário |

---

## ❌ Componentes SEM Cobertura de Testes (28)

### 🧮 Calculadoras (13)

| Componente | Prioridade | Status | Arquivo |
|------------|------------|--------|---------|
| CalculadoraCacLtv | 🔴 Alta | ❌ Pendente | `CalculadoraCacLtv.jsx` |
| CalculadoraCustoFuncionario | 🟡 Média | ❌ Pendente | `CalculadoraCustoFuncionario.jsx` |
| CalculadoraDistribuicaoLucros | 🔴 Alta | ✅ Concluído | `CalculadoraDistribuicaoLucros.jsx` |
| CalculadoraIcmsSt | 🟡 Média | ❌ Pendente | `CalculadoraIcmsSt.jsx` |
| CalculadoraMarkupMargem | 🟢 Baixa | ❌ Pendente | `CalculadoraMarkupMargem.jsx` |
| CalculadoraPontoEquilibrio | 🟡 Média | ❌ Pendente | `CalculadoraPontoEquilibrio.jsx` |
| CalculadoraPresumido | 🔴 Alta | ✅ Concluído | `CalculadoraPresumido.jsx` |
| CalculadoraReal | 🔴 Alta | ⚠️ Parcial | `CalculadoraReal.jsx` |
| CalculadoraRescisao | 🟡 Média | ❌ Pendente | `CalculadoraRescisao.jsx` |
| CalculadoraRunway | 🟡 Média | ❌ Pendente | `CalculadoraRunway.jsx` |
| CalculadoraValuation | 🔴 Alta | ⚠️ Parcial | `CalculadoraValuation.jsx` |
| ComparadorCalculadoras | 🟡 Média | ❌ Pendente | `ComparadorCalculadoras.jsx` |
| IntegracaoContabil | 🟡 Média | ❌ Pendente | `IntegracaoContabil.jsx` |
| NotaFiscal | 🟡 Média | ❌ Pendente | `NotaFiscal.jsx` |

### 🎯 Simuladores (7)

| Componente | Prioridade | Status | Arquivo |
|------------|------------|--------|---------|
| SimuladorCenarios | 🔴 Alta | ❌ Pendente | `SimuladorCenarios.jsx` |
| SimuladorCrescimento | 🟡 Média | ❌ Pendente | `SimuladorCrescimento.jsx` |
| SimuladorDesenquadramento | 🟡 Média | ❌ Pendente | `SimuladorDesenquadramento.jsx` |
| SimuladorDifal | 🟡 Média | ❌ Pendente | `SimuladorDifal.jsx` |
| SimuladorMaquininha | 🟢 Baixa | ❌ Pendente | `SimuladorMaquininha.jsx` |
| SimuladorMRR | 🟡 Média | ❌ Pendente | `SimuladorMRR.jsx` |
| SimuladorROI | 🔴 Alta | ❌ Pendente | `SimuladorROI.jsx` |

### 🛠️ Ferramentas (3)

| Componente | Prioridade | Status | Arquivo |
|------------|------------|--------|---------|
| ComparadorCltPj | 🔴 Alta | ❌ Pendente | `ComparadorCltPj.jsx` |
| CapTableSimulator | 🟡 Média | ❌ Pendente | `CapTableSimulator.jsx` |
| PlanejadorTributario | 🔴 Alta | ❌ Pendente | `PlanejadorTributario.jsx` |

### 📚 Guias e Informações (8)

| Componente | Prioridade | Status | Arquivo |
|------------|------------|--------|---------|
| CalendarioTributario | 🟡 Média | ❌ Pendente | `CalendarioTributario.jsx` |
| ExplicadorSimples | 🟡 Média | ❌ Pendente | `ExplicadorSimples.jsx` |
| GuiaCnae | 🟡 Média | ❌ Pendente | `GuiaCnae.jsx` |
| GuiaRegimes | 🟡 Média | ❌ Pendente | `GuiaRegimes.jsx` |
| HistoricoTributario | 🟢 Baixa | ❌ Pendente | `HistoricoTributario.jsx` |
| BlogTributario | 🟢 Baixa | ❌ Pendente | `BlogTributario.jsx` |
| FAQ | 🟢 Baixa | ❌ Pendente | `FAQ.jsx` |
| CasosSucesso | 🟢 Baixa | ❌ Pendente | `CasosSucesso.jsx` |

---

## 🎯 Ordem de Implementação Planejada

### Fase 1: Calculadoras Críticas (Prioridade Alta)
1. ✅ ~~CalculadoraDAS~~ (Concluído)
2. ✅ ~~CalculadoraMargem~~ (Concluído)
3. ✅ ~~CalculadoraPresumido~~ (Concluído - 27 testes)
4. ⏳ CalculadoraReal
5. ⏳ CalculadoraValuation
6. ⏳ CalculadoraDistribuicaoLucros
7. ⏳ CalculadoraCacLtv

### Fase 2: Simuladores e Ferramentas (Prioridade Alta)
8. ✅ ~~SimuladorFatorR~~ (Concluído)
9. ✅ ~~SimuladorMigracao~~ (Concluído)
10. ⏳ SimuladorCenarios
11. ⏳ SimuladorROI
12. ⏳ ComparadorCltPj
13. ⏳ PlanejadorTributario

### Fase 3: Calculadoras e Simuladores (Prioridade Média)
14. ✅ ~~DiagnosticoTributario~~ (Concluído)
15. ✅ ~~TermometroRisco~~ (Concluído)
16. ⏳ CalculadoraCustoFuncionario
17. ⏳ CalculadoraIcmsSt
18. ⏳ CalculadoraPontoEquilibrio
19. ⏳ CalculadoraRescisao
20. ⏳ CalculadoraRunway
21. ⏳ SimuladorCrescimento
22. ⏳ SimuladorDesenquadramento
23. ⏳ SimuladorDifal
24. ⏳ SimuladorMRR
25. ⏳ ComparadorCalculadoras
26. ⏳ IntegracaoContabil
27. ⏳ NotaFiscal
28. ⏳ CapTableSimulator

### Fase 4: Guias e Ferramentas (Prioridade Média)
29. ⏳ CalendarioTributario
30. ⏳ ExplicadorSimples
31. ⏳ GuiaCnae
32. ⏳ GuiaRegimes

### Fase 5: Conteúdo e Baixa Prioridade
33. ⏳ CalculadoraMarkupMargem
34. ⏳ SimuladorMaquininha
35. ⏳ HistoricoTributario
36. ⏳ BlogTributario
37. ⏳ FAQ
38. ⏳ CasosSucesso

### Fase 6: Refatorações e Melhorias
39. ⏳ Refatorar SimuladorCreditos (desbloquear 6 testes skipped)
40. ✅ ~~CalculadoraProLabore~~ (Concluído)

---

## 📝 Notas e Observações

### Padrões de Teste Estabelecidos
- **Given/When/Then** em português
- **getAllByText()** para elementos duplicados
- **getAllByPlaceholderText()[0]** para inputs com placeholders iguais
- **queryAllByText()** em blocos waitFor()
- **vi.mock('axios')** para chamadas API

### Problemas Conhecidos
- **SimuladorCreditos**: 6 testes marcados como `.skip()` - requer refatoração do componente para melhor testabilidade de submissão de formulários
- **CalculadoraProLabore**: Usa auto-cálculo via useEffect - não tem botão "Calcular"

### Backend
- ✅ **margem.unit.test.js**: Todos os testes passando
- ✅ **historico.unit.test.js**: Todos os testes passando

---

## 🎯 Meta

**Objetivo:** 100% de cobertura para todos os componentes interativos (calculadoras, simuladores, ferramentas)

**Progresso Atual:** 9/40 componentes = 22.5% ✅
**Meta:** 40/40 componentes = 100% 🎯

# 🎯 Guia Rápido - Uso da API

## 📋 Cenários Práticos de Uso

### Cenário 1: Empresa de Serviços
**Situação:** Empresa de consultoria com faturamento anual de R$ 1.200.000

```bash
# PowerShell
$dados = @{
    rbt12 = 1200000
    atividade = "servico"
    folha = 200000
    despesas = 350000
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/calcular/comparar" `
  -Method Post -Body $dados -ContentType "application/json"
```

**Resultado:**
- ✅ Simples Nacional: R$ 186.000,00 (15,5%)
- ✅ Lucro Presumido: R$ 136.440,00 (11,37%) ← **MELHOR**
- ✅ Lucro Real: R$ 315.600,00 (26,3%)
- 💰 Economia: R$ 179.160,00 (56,77%)

---

### Cenário 2: Comércio de Médio Porte
**Situação:** Loja com faturamento de R$ 800.000

```bash
# cURL
curl -X POST http://localhost:3001/calcular/comparar \
  -H "Content-Type: application/json" \
  -d '{
    "rbt12": 800000,
    "atividade": "comercio",
    "folha": 50000,
    "despesas": 500000
  }'
```

**Resultado:**
- ✅ Simples Nacional: R$ 64.000,00 (8%)
- ✅ Lucro Presumido: R$ 44.960,00 (5,62%)
- ✅ Lucro Real: R$ 146.400,00 (18,3%)

---

### Cenário 3: Indústria com Prejuízo
**Situação:** Fábrica com despesas maiores que receita

```json
{
  "rbt12": 600000,
  "atividade": "industria",
  "folha": 100000,
  "despesas": 700000
}
```

**Resultado Lucro Real:**
- Lucro Líquido: -R$ 100.000,00
- IRPJ/CSLL: R$ 0,00 (prejuízo fiscal)
- PIS/COFINS: R$ 55.800,00
- Total: R$ 55.800,00

**Observação:** No lucro negativo, não há IRPJ/CSLL!

---

## 🔥 Casos de Uso Reais

### 1. Análise de Viabilidade
**Objetivo:** Empresa está migrando de regime

```javascript
// JavaScript / Node.js
const axios = require('axios');

async function analisarMigracao() {
  const empresa = {
    rbt12: 2500000,
    atividade: 'servico',
    folha: 400000,
    despesas: 800000
  };

  const response = await axios.post(
    'http://localhost:3001/calcular/comparar',
    empresa
  );

  console.log('Melhor regime:', response.data.data.melhor_regime);
  console.log('Economia anual:', response.data.data.economia.valor);
}
```

---

### 2. Simulação com Múltiplos Cenários

```javascript
async function simularCenarios() {
  const cenarios = [
    { nome: 'Pessimista', rbt12: 800000, despesas: 500000 },
    { nome: 'Realista', rbt12: 1200000, despesas: 400000 },
    { nome: 'Otimista', rbt12: 1800000, despesas: 300000 }
  ];

  for (const cenario of cenarios) {
    const dados = {
      ...cenario,
      atividade: 'servico',
      folha: 200000
    };

    const response = await axios.post(
      'http://localhost:3001/calcular/comparar',
      dados
    );

    console.log(`\n${cenario.nome}:`);
    console.log('Melhor:', response.data.data.melhor_regime);
    console.log('Impostos:', response.data.data.comparacao);
  }
}
```

---

### 3. Dashboard de Comparação

```javascript
// React Component
import { useState } from 'react';
import api from './services/api';

function Calculator() {
  const [dados, setDados] = useState({
    rbt12: '',
    atividade: 'servico',
    folha: 0,
    despesas: 0
  });
  const [resultado, setResultado] = useState(null);

  const calcular = async () => {
    try {
      const response = await api.post('/calcular/comparar', dados);
      setResultado(response.data.data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div>
      <h2>Comparador Tributário</h2>
      
      <input
        type="number"
        value={dados.rbt12}
        onChange={(e) => setDados({...dados, rbt12: e.target.value})}
        placeholder="Faturamento anual"
      />

      <select
        value={dados.atividade}
        onChange={(e) => setDados({...dados, atividade: e.target.value})}
      >
        <option value="comercio">Comércio</option>
        <option value="industria">Indústria</option>
        <option value="servico">Serviço</option>
      </select>

      <button onClick={calcular}>Calcular</button>

      {resultado && (
        <div>
          <h3>Melhor Regime: {resultado.melhor_regime}</h3>
          <p>Simples: R$ {resultado.comparacao.simples}</p>
          <p>Presumido: R$ {resultado.comparacao.presumido}</p>
          <p>Real: R$ {resultado.comparacao.real}</p>
          <p>Economia: R$ {resultado.economia.valor}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🧪 Testes Rápidos

### Teste 1: Validação
```bash
# Deve retornar erro 400
curl -X POST http://localhost:3001/calcular/simples \
  -H "Content-Type: application/json" \
  -d '{"rbt12": -1000, "atividade": "servico"}'

# Erro esperado: "RBT12 deve ser positivo"
```

### Teste 2: Atividade Sem Acento
```bash
# Deve aceitar "servico" e converter para "serviço"
curl -X POST http://localhost:3001/calcular/simples \
  -H "Content-Type: application/json" \
  -d '{"rbt12": 1000000, "atividade": "servico"}'
```

### Teste 3: Campos Opcionais
```bash
# Folha e despesas são opcionais (padrão: 0)
curl -X POST http://localhost:3001/calcular/simples \
  -H "Content-Type: application/json" \
  -d '{"rbt12": 1000000, "atividade": "comercio"}'
```

---

## 📊 Tabela de Referência Rápida

### Alíquotas Simples Nacional
| Atividade | Alíquota |
|-----------|----------|
| Comércio | 8% |
| Indústria | 10% |
| Serviço | 15,5% |

### Presunção Lucro Presumido
| Atividade | Presunção | IRPJ+CSLL | PIS+COFINS |
|-----------|-----------|-----------|------------|
| Comércio | 8% | 24% sobre presunção | 3,65% sobre receita |
| Indústria | 8% | 24% sobre presunção | 3,65% sobre receita |
| Serviço | 32% | 24% sobre presunção | 3,65% sobre receita |

### Alíquotas Lucro Real
| Tributo | Alíquota | Base |
|---------|----------|------|
| IRPJ | 15% | Lucro real |
| CSLL | 9% | Lucro real |
| PIS | 1,65% | Receita |
| COFINS | 7,6% | Receita |

---

## 💡 Dicas de Uso

### 1. Sempre use `servico`, `comercio`, `industria`
❌ Evite: `"serviço"` (com acento no PowerShell/cURL)  
✅ Use: `"servico"` (sem acento) - a API converte automaticamente

### 2. Valores em centavos são aceitos
```json
{
  "rbt12": 1234567.89,  // ✅ OK
  "despesas": 500000.50  // ✅ OK
}
```

### 3. Campos opcionais
```json
{
  "rbt12": 1000000,
  "atividade": "comercio"
  // folha e despesas = 0 automaticamente
}
```

### 4. Lucro Real requer despesas
Para cálculo preciso do Lucro Real, sempre informe as despesas:
```json
{
  "rbt12": 1200000,
  "atividade": "servico",
  "despesas": 400000  // ← Importante!
}
```

---

## 🔗 Links Úteis

- **Documentação completa:** `CALCULOS_API.md`
- **Implementação técnica:** `IMPLEMENTACAO_COMPLETA.md`
- **Script de teste:** `test-api.ps1`

---

## ⚡ Início Rápido

```bash
# 1. Iniciar backend
cd backend
npm run dev

# 2. Em outro terminal, testar
curl http://localhost:3001/status

# 3. Fazer primeira comparação
curl -X POST http://localhost:3001/calcular/comparar \
  -H "Content-Type: application/json" \
  -d '{"rbt12": 1000000, "atividade": "comercio", "despesas": 400000}'
```

---

**Pronto para usar! 🚀**

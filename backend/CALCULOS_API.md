# 📊 Documentação da API - Cálculos Tributários

## 🎯 Endpoints Implementados

### Base URL
```
http://localhost:3001
```

---

## 📡 Endpoints de Cálculo

### 1. Calcular Simples Nacional
**POST** `/calcular/simples`

Calcula os impostos no regime Simples Nacional.

**Request Body:**
```json
{
  "rbt12": 1200000,
  "atividade": "serviço",
  "folha": 200000,
  "despesas": 350000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "regime": "Simples Nacional",
    "rbt12": 1200000,
    "atividade": "serviço",
    "aliquota": 15.5,
    "impostoTotal": 186000,
    "aliquotaEfetiva": 15.5,
    "detalhamento": {
      "baseCalculo": 1200000,
      "percentualAplicado": "15.5%",
      "observacao": "Alíquota média para serviço no Simples Nacional"
    }
  }
}
```

---

### 2. Calcular Lucro Presumido
**POST** `/calcular/presumido`

Calcula os impostos no regime Lucro Presumido.

**Request Body:**
```json
{
  "rbt12": 1200000,
  "atividade": "serviço",
  "folha": 200000,
  "despesas": 350000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "regime": "Lucro Presumido",
    "rbt12": 1200000,
    "atividade": "serviço",
    "lucroPresumido": 384000,
    "impostoTotal": 136440,
    "aliquotaEfetiva": 11.37,
    "detalhamento": {
      "presuncaoLucro": "32.00%",
      "irpj": 57600,
      "csll": 34560,
      "irpjCsll": 92160,
      "pis": 7800,
      "cofins": 36000,
      "pisCofins": 43800
    }
  }
}
```

---

### 3. Calcular Lucro Real
**POST** `/calcular/real`

Calcula os impostos no regime Lucro Real.

**Request Body:**
```json
{
  "rbt12": 1200000,
  "atividade": "serviço",
  "folha": 200000,
  "despesas": 350000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "regime": "Lucro Real",
    "rbt12": 1200000,
    "atividade": "serviço",
    "despesas": 350000,
    "lucroLiquido": 850000,
    "impostoTotal": 315600,
    "aliquotaEfetiva": 26.3,
    "detalhamento": {
      "receita": 1200000,
      "despesasDedutíveis": 350000,
      "lucroApurado": 850000,
      "irpj": 127500,
      "csll": 76500,
      "irpjCsll": 204000,
      "pis": 19800,
      "cofins": 91200,
      "pisCofins": 111000,
      "observacao": null
    }
  }
}
```

---

### 4. Comparar Todos os Regimes
**POST** `/calcular/comparar`

Compara os três regimes tributários e identifica o mais vantajoso.

**Request Body:**
```json
{
  "rbt12": 1200000,
  "atividade": "serviço",
  "folha": 200000,
  "despesas": 350000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "entrada": {
      "rbt12": 1200000,
      "atividade": "serviço",
      "folha": 200000,
      "despesas": 350000
    },
    "comparacao": {
      "simples": 186000,
      "presumido": 136440,
      "real": 315600
    },
    "melhor_regime": "Lucro Presumido",
    "economia": {
      "valor": 179160,
      "percentual": 56.77,
      "comparadoCom": "Lucro Real"
    },
    "detalhes": {
      "simplesNacional": { /* objeto completo */ },
      "lucroPresumido": { /* objeto completo */ },
      "lucroReal": { /* objeto completo */ }
    },
    "ranking": [
      {
        "posicao": 1,
        "regime": "Lucro Presumido",
        "impostoTotal": 136440
      },
      {
        "posicao": 2,
        "regime": "Simples Nacional",
        "impostoTotal": 186000
      },
      {
        "posicao": 3,
        "regime": "Lucro Real",
        "impostoTotal": 315600
      }
    ]
  }
}
```

---

### 5. Obter Informações dos Regimes
**GET** `/calcular/info`

Retorna informações sobre cada regime tributário.

**Response:**
```json
{
  "success": true,
  "data": {
    "simplesNacional": {
      "regime": "Simples Nacional",
      "descricao": "Regime tributário simplificado para micro e pequenas empresas",
      "aliquotas": {
        "comércio": 8,
        "indústria": 10,
        "serviço": 15.5
      },
      "limiteAnual": 4800000,
      "tributos": ["IRPJ", "CSLL", "PIS", "COFINS", "IPI", "ICMS", "ISS", "CPP"]
    },
    "lucroPresumido": {
      "regime": "Lucro Presumido",
      "descricao": "Regime baseado em presunção de lucro sobre a receita",
      "presuncoes": {
        "comércio": "8%",
        "indústria": "8%",
        "serviço": "32%"
      },
      "aliquotas": {
        "IRPJ": "15%",
        "CSLL": "9%",
        "PIS": "0.65%",
        "COFINS": "3%"
      },
      "observacao": "IRPJ e CSLL calculados sobre o lucro presumido. PIS e COFINS sobre o faturamento."
    },
    "lucroReal": {
      "regime": "Lucro Real",
      "descricao": "Regime baseado no lucro efetivo apurado pela empresa",
      "aliquotas": {
        "IRPJ": "15%",
        "CSLL": "9%",
        "PIS": "1.65%",
        "COFINS": "7.6%"
      },
      "observacao": "IRPJ e CSLL calculados sobre o lucro real. PIS e COFINS no regime não-cumulativo.",
      "vantagens": [
        "Tributação sobre lucro efetivo",
        "Pode compensar prejuízos fiscais",
        "Créditos de PIS/COFINS sobre insumos"
      ]
    }
  }
}
```

---

## 📝 Parâmetros de Entrada

### Campos Obrigatórios

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `rbt12` | number | Receita bruta dos últimos 12 meses | Deve ser positivo |
| `atividade` | string | Tipo de atividade | `"comércio"`, `"indústria"` ou `"serviço"` |

### Campos Opcionais

| Campo | Tipo | Descrição | Padrão |
|-------|------|-----------|--------|
| `folha` | number | Valor da folha de pagamento | 0 |
| `despesas` | number | Despesas dedutíveis (usado no Lucro Real) | 0 |

**Observações:**
- Aceita atividade com ou sem acentuação: `"comercio"` = `"comércio"`
- Valores devem ser números positivos
- Valores são arredondados para 2 casas decimais

---

## ❌ Tratamento de Erros

### Erro de Validação (400)
```json
{
  "error": true,
  "message": "Erro de validação",
  "details": [
    {
      "field": "rbt12",
      "message": "RBT12 é obrigatório"
    }
  ]
}
```

### Erro Interno (500)
```json
{
  "error": true,
  "message": "Erro ao calcular Simples Nacional"
}
```

---

## 🧪 Exemplos com cURL

### Calcular Simples Nacional
```bash
curl -X POST http://localhost:3001/calcular/simples \
  -H "Content-Type: application/json" \
  -d '{
    "rbt12": 1200000,
    "atividade": "serviço",
    "folha": 200000,
    "despesas": 350000
  }'
```

### Comparar Regimes
```bash
curl -X POST http://localhost:3001/calcular/comparar \
  -H "Content-Type: application/json" \
  -d '{
    "rbt12": 1200000,
    "atividade": "comércio",
    "folha": 100000,
    "despesas": 400000
  }'
```

### Obter Informações
```bash
curl http://localhost:3001/calcular/info
```

---

## 🧮 Fórmulas de Cálculo

### Simples Nacional
```
imposto = rbt12 × (alíquota ÷ 100)
```

Alíquotas:
- Comércio: 8%
- Indústria: 10%
- Serviço: 15,5%

### Lucro Presumido
```
lucro_presumido = rbt12 × presunção
irpj = lucro_presumido × 0.15
csll = lucro_presumido × 0.09
pis = rbt12 × 0.0065
cofins = rbt12 × 0.03
imposto_total = irpj + csll + pis + cofins
```

Presunções:
- Comércio: 8%
- Indústria: 8%
- Serviço: 32%

### Lucro Real
```
lucro_liquido = rbt12 - despesas
irpj = lucro_liquido × 0.15 (se lucro > 0)
csll = lucro_liquido × 0.09 (se lucro > 0)
pis = rbt12 × 0.0165
cofins = rbt12 × 0.076
imposto_total = irpj + csll + pis + cofins
```

---

## 📊 Estrutura de Arquivos

```
backend/src/
├── controllers/
│   └── calculos.controller.js     # Lógica de controle
├── services/
│   ├── simples.service.js          # Cálculo Simples Nacional
│   ├── presumido.service.js        # Cálculo Lucro Presumido
│   └── real.service.js             # Cálculo Lucro Real
├── routes/
│   └── calculos.routes.js          # Definição das rotas
└── validations/
    └── calculos.schema.js          # Validação com Joi
```

---

## ✅ Testes

Execute os testes:
```bash
npm test
```

**Cobertura:**
- ✅ 14 testes passando
- ✅ Validação de entrada
- ✅ Cálculos corretos
- ✅ Tratamento de erros
- ✅ Comparação de regimes

---

**Última atualização:** 29/11/2025

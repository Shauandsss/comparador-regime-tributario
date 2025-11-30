# 📡 Exemplos de Uso da API

Este arquivo contém exemplos de como usar a API do Comparador Tributário.

## 🔍 Endpoints Disponíveis

### 1. Health Check
Verifica se a API está funcionando.

**Request:**
```http
GET http://localhost:3001/status
```

**Response:**
```json
{
  "ok": true
}
```

**Exemplo com cURL:**
```bash
curl http://localhost:3001/status
```

**Exemplo com PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/status" -Method Get
```

---

### 2. Informações da API
Retorna informações básicas da API.

**Request:**
```http
GET http://localhost:3001/
```

**Response:**
```json
{
  "message": "API Comparador Tributário",
  "version": "1.0.0",
  "endpoints": {
    "status": "/status"
  }
}
```

**Exemplo com cURL:**
```bash
curl http://localhost:3001/
```

**Exemplo com PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/" -Method Get
```

---

## 🧪 Testando com JavaScript/Node.js

### Usando Axios (Recomendado)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001'
});

// Verificar status
const checkStatus = async () => {
  try {
    const response = await api.get('/status');
    console.log('Status:', response.data);
  } catch (error) {
    console.error('Erro:', error.message);
  }
};

checkStatus();
```

### Usando Fetch API

```javascript
// Verificar status
fetch('http://localhost:3001/status')
  .then(response => response.json())
  .then(data => console.log('Status:', data))
  .catch(error => console.error('Erro:', error));

// Obter informações da API
fetch('http://localhost:3001/')
  .then(response => response.json())
  .then(data => console.log('Info:', data))
  .catch(error => console.error('Erro:', error));
```

---

## 🎯 Exemplos de Endpoints Futuros

### 3. Calcular Simples Nacional (A IMPLEMENTAR)

**Request:**
```http
POST http://localhost:3001/api/calcular/simples-nacional
Content-Type: application/json

{
  "receitaBruta": 180000,
  "anexo": "I",
  "faixaFaturamento": 1
}
```

**Response:**
```json
{
  "regime": "simples_nacional",
  "receitaBruta": 180000,
  "aliquota": 4.0,
  "impostoDevido": 7200,
  "detalhes": {
    "anexo": "I",
    "faixa": 1
  }
}
```

---

### 4. Calcular Lucro Presumido (A IMPLEMENTAR)

**Request:**
```http
POST http://localhost:3001/api/calcular/lucro-presumido
Content-Type: application/json

{
  "receitaBruta": 250000,
  "atividadePrincipal": "comercio",
  "percentualPresuncao": 8
}
```

**Response:**
```json
{
  "regime": "lucro_presumido",
  "receitaBruta": 250000,
  "baseCalculo": 20000,
  "impostos": {
    "irpj": 3000,
    "csll": 1800,
    "pis": 1625,
    "cofins": 7500,
    "total": 13925
  }
}
```

---

### 5. Calcular Lucro Real (A IMPLEMENTAR)

**Request:**
```http
POST http://localhost:3001/api/calcular/lucro-real
Content-Type: application/json

{
  "receitaBruta": 500000,
  "custos": 300000,
  "despesas": 100000
}
```

**Response:**
```json
{
  "regime": "lucro_real",
  "receitaBruta": 500000,
  "lucroLiquido": 100000,
  "impostos": {
    "irpj": 15000,
    "csll": 9000,
    "pis": 8250,
    "cofins": 38000,
    "total": 70250
  }
}
```

---

### 6. Comparar Regimes (A IMPLEMENTAR)

**Request:**
```http
POST http://localhost:3001/api/comparar
Content-Type: application/json

{
  "receitaBruta": 200000,
  "custos": 80000,
  "despesas": 30000,
  "atividadePrincipal": "comercio"
}
```

**Response:**
```json
{
  "comparacao": [
    {
      "regime": "Simples Nacional",
      "impostoTotal": 8000,
      "aliquotaEfetiva": 4.0,
      "recomendado": true
    },
    {
      "regime": "Lucro Presumido",
      "impostoTotal": 12500,
      "aliquotaEfetiva": 6.25,
      "recomendado": false
    },
    {
      "regime": "Lucro Real",
      "impostoTotal": 13500,
      "aliquotaEfetiva": 6.75,
      "recomendado": false
    }
  ],
  "melhorOpcao": "Simples Nacional",
  "economia": {
    "valor": 4500,
    "percentual": 35
  }
}
```

---

## 🔐 Autenticação (A IMPLEMENTAR)

Quando implementada, a autenticação funcionará assim:

### Login
```http
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "senha": "senha123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "usuario@example.com"
  }
}
```

### Usando o Token

```javascript
const token = 'seu-token-jwt';

const response = await axios.get('/api/calcular/historico', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 📊 Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## 🧪 Testando com Postman

1. Importe a collection (quando criada)
2. Configure a URL base: `http://localhost:3001`
3. Execute as requisições

---

## 📝 Notas

- Todos os endpoints retornam JSON
- Use `Content-Type: application/json` para POST/PUT
- Erros retornam formato: `{ "error": true, "message": "..." }`
- Em desenvolvimento, stacktrace é incluído nos erros

---

**Última atualização:** 29/11/2025

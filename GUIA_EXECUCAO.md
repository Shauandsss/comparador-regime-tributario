# 🚀 Guia de Execução Rápida - Comparador de Regimes Tributários

Este guia mostra como executar o sistema completo (backend + frontend) em sua máquina.

## 📋 Pré-requisitos

- **Node.js** 18 ou superior ([Download](https://nodejs.org/))
- **PowerShell** (já vem com Windows)
- **Git** (opcional, para clonar o repositório)

## ⚡ Início Rápido (5 minutos)

### 1️⃣ Preparar o Backend

```powershell
# Navegar para a pasta do backend
cd d:\Git R\comparador-regime-tributario\backend

# Instalar dependências (se ainda não instalou)
npm install

# Iniciar o servidor backend
npm run dev
```

✅ **Resultado esperado:**
```
🚀 Servidor rodando em: http://localhost:3001
📊 Ambiente: development
```

**Deixe este terminal aberto!** O backend precisa ficar rodando.

---

### 2️⃣ Preparar o Frontend (Novo Terminal)

Abra um **novo terminal PowerShell** e execute:

```powershell
# Navegar para a pasta do frontend
cd d:\Git R\comparador-regime-tributario\frontend

# Instalar dependências (se ainda não instalou)
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

✅ **Resultado esperado:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### 3️⃣ Acessar a Aplicação

Abra seu navegador e acesse:

🌐 **http://localhost:5173**

---

## 🎯 Fluxo de Uso da Aplicação

### Passo 1: Página Inicial
- Visualize as informações sobre os três regimes tributários
- Clique em **"Calcular Agora"**

### Passo 2: Formulário de Entrada
Preencha os dados da empresa:
- **Receita Bruta (12 meses):** Ex: `1200000`
- **Atividade:** Escolha entre Comércio, Indústria ou Serviço
- **Folha de Pagamento (opcional):** Ex: `200000`
- **Despesas (opcional):** Ex: `350000`

Clique em **"Calcular Regimes →"**

### Passo 3: Resultado
Visualize:
- 🏆 **Melhor regime** para sua situação
- 💰 **Economia potencial** ao escolher a melhor opção
- 📊 **Comparação detalhada** dos três regimes
- 📈 **Ranking com medalhas** (1º, 2º, 3º lugar)

---

## 🧪 Testar a API Diretamente

### Verificar se o backend está ativo:
```powershell
curl http://localhost:3001/status
```

### Fazer uma comparação via API:
```powershell
$body = @{
    rbt12 = 1200000
    atividade = "servico"
    folha = 200000
    despesas = 350000
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/calcular/comparar" `
                  -Method POST `
                  -Body $body `
                  -ContentType "application/json"
```

---

## 📊 Estrutura de Dados

### Entrada (Request)
```json
{
  "rbt12": 1200000,          // Receita Bruta dos Últimos 12 Meses (obrigatório)
  "atividade": "servico",    // "comercio" | "industria" | "servico" (obrigatório)
  "folha": 200000,           // Folha de Pagamento (opcional)
  "despesas": 350000         // Despesas Dedutíveis (opcional)
}
```

### Saída (Response)
```json
{
  "regimes": {
    "simples": {
      "imposto_total": 186000,
      "aliquota_efetiva": 15.5
    },
    "presumido": {
      "imposto_total": 134400,
      "aliquota_efetiva": 11.2
    },
    "real": {
      "imposto_total": 104000,
      "aliquota_efetiva": 8.67
    }
  },
  "melhor_opcao": "real",
  "economia": {
    "valor": 82000,
    "percentual": 44.09,
    "regime_comparado": "simples"
  }
}
```

---

## 🛠️ Comandos Úteis

### Backend

```powershell
cd backend

# Desenvolvimento (com hot reload)
npm run dev

# Executar testes
npm test

# Build de produção
npm start
```

### Frontend

```powershell
cd frontend

# Desenvolvimento (com hot reload)
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

---

## 🔍 Verificar se está tudo funcionando

### ✅ Checklist

- [ ] Backend rodando em `http://localhost:3001`
- [ ] Frontend rodando em `http://localhost:5173`
- [ ] Endpoint `/status` retornando `{ status: "ok" }`
- [ ] Página inicial carregando sem erros
- [ ] Formulário submetendo dados
- [ ] Resultado exibindo comparação

---

## 🐛 Problemas Comuns

### ❌ Erro: "EADDRINUSE" (Porta já em uso)

**Backend:**
```powershell
# Encontrar o processo usando a porta 3001
netstat -ano | findstr :3001

# Matar o processo (substitua <PID> pelo número encontrado)
taskkill /PID <PID> /F
```

**Frontend:**
```powershell
# Encontrar o processo usando a porta 5173
netstat -ano | findstr :5173

# Matar o processo
taskkill /PID <PID> /F
```

---

### ❌ Erro: "Cannot GET /" no backend

- Verifique se o arquivo `.env` existe em `backend/`
- Conteúdo do `.env` deve ter: `PORT=3001`

---

### ❌ Erro: "Network Error" no frontend

- Certifique-se de que o **backend está rodando primeiro**
- Verifique o endpoint: `http://localhost:3001/status`
- Limpe o cache do navegador (Ctrl + Shift + R)

---

### ❌ Erro: "Module not found"

```powershell
# Backend
cd backend
rm -rf node_modules
rm package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 📚 Documentação Adicional

- **API completa:** `backend/CALCULOS_API.md`
- **Implementação técnica:** `backend/IMPLEMENTACAO_COMPLETA.md`
- **Frontend detalhado:** `frontend/README_FRONTEND.md`
- **Setup completo:** `SETUP.md`
- **Exemplos de API:** `API_EXAMPLES.md`

---

## 🎉 Tudo pronto!

Agora você pode:
1. ✅ Usar a interface web para comparar regimes
2. ✅ Fazer chamadas diretas à API
3. ✅ Rodar os testes automatizados
4. ✅ Modificar e estender o código

---

## 💡 Dicas

### Performance
- Use `npm run dev` para desenvolvimento (hot reload automático)
- Use `npm run build` para produção (otimizado e minificado)

### Debugging
- Backend: Logs aparecem no terminal onde você rodou `npm run dev`
- Frontend: Use o DevTools do navegador (F12)
- API: Teste endpoints com PowerShell ou Postman

### Produção
- Configure variáveis de ambiente adequadas
- Use um reverse proxy (nginx, Apache)
- Configure HTTPS
- Use PM2 para manter o backend rodando

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique se as portas 3001 e 5173 estão livres
2. Confirme que as dependências foram instaladas
3. Revise os logs nos terminais
4. Consulte a documentação completa em `README.md`

---

**Desenvolvido com ❤️ usando Node.js, Express, React e Vite**

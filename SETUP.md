# 🚀 Guia de Instalação e Execução - Comparador Tributário

## 📋 Passo a Passo para Configuração

### ✅ Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- Git (opcional)

---

## 🔧 1. INSTALAÇÃO DO BACKEND

### Navegue até a pasta do backend
```powershell
cd "d:\Git R\comparador-regime-tributario\backend"
```

### Instale as dependências
```powershell
npm install
```

### Configure as variáveis de ambiente
```powershell
Copy-Item .env.example .env
```

### Execute os testes (opcional mas recomendado)
```powershell
npm test
```

### Inicie o servidor em modo desenvolvimento
```powershell
npm run dev
```

✅ **Backend rodando em:** `http://localhost:3001`

---

## 🎨 2. INSTALAÇÃO DO FRONTEND

### Abra um NOVO terminal e navegue até a pasta do frontend
```powershell
cd "d:\Git R\comparador-regime-tributario\frontend"
```

### Instale as dependências
```powershell
npm install
```

### Inicie o servidor de desenvolvimento
```powershell
npm run dev
```

✅ **Frontend rodando em:** `http://localhost:5173`

---

## 🧪 3. TESTANDO A APLICAÇÃO

### Testar Backend diretamente
Abra o navegador em: `http://localhost:3001/status`

Resposta esperada:
```json
{
  "ok": true
}
```

### Testar Frontend
Abra o navegador em: `http://localhost:5173`

Você verá a página inicial do **Comparador Tributário** com:
- Header azul
- Status da API (deve aparecer como "Online" com indicador verde)
- Cards dos três regimes tributários
- Botão "Iniciar Comparação"

---

## 📝 COMANDOS ÚTEIS

### Backend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor com nodemon (auto-reload) |
| `npm start` | Inicia servidor em modo produção |
| `npm test` | Executa todos os testes |
| `npm run test:watch` | Executa testes em modo watch |

### Frontend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Preview do build de produção |

---

## 🔍 VERIFICAÇÃO DE INSTALAÇÃO

### Checklist Backend ✓
- [ ] `node_modules` foi criado
- [ ] Arquivo `.env` existe
- [ ] Servidor inicia sem erros
- [ ] Rota `/status` retorna `{ "ok": true }`
- [ ] Testes passam com sucesso

### Checklist Frontend ✓
- [ ] `node_modules` foi criado
- [ ] Servidor Vite inicia sem erros
- [ ] Página carrega no navegador
- [ ] Status da API aparece como "Online"
- [ ] Tailwind CSS está funcionando (estilos aplicados)

---

## 🐛 TROUBLESHOOTING

### Problema: Porta 3001 ou 5173 já está em uso

**Solução Backend:**
Edite o arquivo `.env` e altere a porta:
```
PORT=3002
```

**Solução Frontend:**
Edite `vite.config.js` e altere a porta:
```javascript
server: {
  port: 5174
}
```

### Problema: Frontend não conecta com Backend

**Verificar:**
1. Backend está rodando? (`http://localhost:3001/status`)
2. CORS está habilitado? (já está configurado)
3. URL da API está correta no `services/api.js`?

### Problema: Erros do Tailwind CSS

**Solução:**
```powershell
cd frontend
npm install -D tailwindcss postcss autoprefixer
```

---

## 📚 ESTRUTURA DE ARQUIVOS CRIADOS

### Backend (29 arquivos/pastas)
```
backend/
├── src/
│   ├── app.js ...................... Configuração do Express
│   ├── routes/
│   │   └── index.js ................ Rotas da API
│   ├── config/
│   │   └── constants.js ............ Constantes da aplicação
│   └── utils/
│       └── helpers.js .............. Funções auxiliares
├── tests/
│   └── status.test.js .............. Testes da API
├── server.js ....................... Entry point
├── package.json .................... Dependências
├── jest.config.js .................. Configuração Jest
├── .env.example .................... Template de variáveis
└── .gitignore ...................... Arquivos ignorados
```

### Frontend (23 arquivos/pastas)
```
frontend/
├── src/
│   ├── main.jsx .................... Entry point
│   ├── App.jsx ..................... Componente raiz
│   ├── components/
│   │   └── Header.jsx .............. Cabeçalho
│   ├── pages/
│   │   └── Home.jsx ................ Página inicial
│   ├── services/
│   │   └── api.js .................. Cliente HTTP
│   ├── hooks/
│   │   └── useAppStore.js .......... Estado global (Zustand)
│   ├── utils/
│   │   └── formatters.js ........... Formatadores
│   └── styles/
│       └── index.css ............... Estilos globais
├── index.html ...................... HTML base
├── package.json .................... Dependências
├── vite.config.js .................. Configuração Vite
├── tailwind.config.js .............. Configuração Tailwind
├── postcss.config.js ............... Configuração PostCSS
└── .gitignore ...................... Arquivos ignorados
```

---

## 🎯 PRÓXIMOS PASSOS SUGERIDOS

1. **Implementar Controllers e Services** para cálculos tributários
2. **Criar rotas CRUD** para empresas/simulações
3. **Desenvolver formulários** no frontend
4. **Implementar validações** com Joi
5. **Adicionar mais testes** unitários e de integração
6. **Configurar banco de dados** (PostgreSQL/MongoDB)
7. **Implementar autenticação** JWT
8. **Criar relatórios** em PDF

---

## ✅ CONCLUSÃO

Seu projeto está **100% configurado e pronto para desenvolvimento!**

Estrutura criada com:
- ✅ Backend modular e testável
- ✅ Frontend moderno com React + Vite
- ✅ Tailwind CSS configurado
- ✅ Roteamento configurado
- ✅ Testes implementados
- ✅ Comunicação Backend ↔ Frontend funcionando
- ✅ Gerenciamento de estado (Zustand)
- ✅ Código limpo e organizado

**Boa codificação! 🚀**

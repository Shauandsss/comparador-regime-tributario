# Frontend - Comparador de Regimes Tributários

Frontend React com Vite para o sistema de comparação de regimes tributários brasileiros.

## 🚀 Tecnologias

- **React 18.2.0** - Biblioteca para construção da interface
- **React Router DOM 6.20.1** - Roteamento entre páginas
- **Vite 5.0.8** - Build tool e dev server
- **Tailwind CSS 3.3.6** - Framework CSS utilitário
- **Zustand 4.4.7** - Gerenciamento de estado global
- **Axios 1.6.2** - Cliente HTTP para chamadas à API

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Header.jsx       # Cabeçalho da aplicação
│   │   ├── Input.jsx        # Input customizado com validação
│   │   ├── Loading.jsx      # Spinner de loading
│   │   ├── CardResultado.jsx    # Card para exibir resultado de regime
│   │   └── TabelaComparacao.jsx # Tabela comparativa dos regimes
│   │
│   ├── pages/               # Páginas da aplicação
│   │   ├── Home.jsx         # Página inicial
│   │   ├── Formulario.jsx   # Formulário de entrada de dados
│   │   └── Resultado.jsx    # Página de resultados
│   │
│   ├── hooks/               # Custom hooks e store
│   │   ├── useAppStore.js   # Zustand store (estado global)
│   │   └── useComparador.js # Hook para chamadas à API
│   │
│   ├── App.jsx              # Componente raiz com rotas
│   ├── main.jsx             # Entry point da aplicação
│   └── index.css            # Estilos globais (Tailwind)
│
├── index.html
├── vite.config.js           # Configuração do Vite
├── tailwind.config.js       # Configuração do Tailwind
├── postcss.config.js        # Configuração do PostCSS
└── package.json
```

## 🎯 Funcionalidades

### 1. **Página Inicial (Home)**
- Hero section com call-to-action
- Status da API backend
- Cards informativos dos três regimes
- Seção "Como Funciona"

### 2. **Formulário de Entrada (Formulario)**
- Campos para Receita Bruta dos Últimos 12 Meses
- Dropdown para seleção de Atividade (Comércio/Indústria/Serviço)
- Campos opcionais: Folha de Pagamento e Despesas
- Validação de campos em tempo real
- Preview dos valores informados
- Loading state durante cálculo

### 3. **Página de Resultados (Resultado)**
- Cards individuais para cada regime tributário
- Destaque visual para o melhor regime
- Tabela comparativa com ranking
- Seção de economia potencial
- Informações detalhadas dos dados fornecidos
- Botões: Nova Consulta, Imprimir, Voltar

## 🔧 Componentes Principais

### `useComparadorStore` (Zustand Store)
Gerencia o estado global da aplicação:
```javascript
{
  entrada: {
    rbt12: number,
    atividade: string,
    folha: number,
    despesas: number
  },
  resultado: {
    regimes: {...},
    melhor_opcao: string,
    economia: {...}
  },
  loading: boolean,
  error: string
}
```

### `useComparador` (Custom Hook)
Provê funções para interagir com a API:
- `calcularComparacao(data)` - Compara os três regimes
- `calcularRegime(regime, data)` - Calcula um regime específico
- `obterInfo()` - Obtém informações sobre os regimes

### `Input` (Componente)
Input reutilizável com:
- Label customizável
- Validação de erros
- Suporte a diferentes tipos (text, number, etc.)
- Estados disabled e required

### `CardResultado` (Componente)
Exibe resultado individual de cada regime:
- Valor do imposto formatado
- Alíquota efetiva
- Destaque visual para melhor opção
- Botão para ver detalhes

### `TabelaComparacao` (Componente)
Tabela comparativa com:
- Ranking visual (🥇🥈🥉)
- Valores de impostos
- Alíquotas efetivas
- Cores diferenciadas por posição

## 📡 Integração com Backend

A aplicação consome a API REST do backend:

**Base URL:** `http://localhost:3001`

### Endpoints Utilizados

1. **GET** `/status` - Verifica se a API está ativa
2. **POST** `/calcular/comparar` - Compara os três regimes
3. **POST** `/calcular/simples` - Calcula apenas Simples Nacional
4. **POST** `/calcular/presumido` - Calcula apenas Lucro Presumido
5. **POST** `/calcular/real` - Calcula apenas Lucro Real
6. **GET** `/calcular/info` - Retorna informações sobre os regimes

## 🎨 Estilização

### Tailwind CSS
Classes utilitárias para estilização rápida:
- Gradientes: `bg-gradient-to-r from-blue-600 to-blue-700`
- Sombras: `shadow-lg`, `shadow-xl`
- Transições: `transition duration-300`
- Responsividade: `md:grid-cols-3`, `lg:text-4xl`

### Cores por Regime
- **Simples Nacional:** Azul (`blue-500`, `blue-600`)
- **Lucro Presumido:** Roxo (`purple-500`, `purple-600`)
- **Lucro Real:** Laranja (`orange-500`, `orange-600`)
- **Melhor Opção:** Verde (`green-500`, `green-600`)

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18 ou superior
- Backend rodando em `http://localhost:3001`

### Instalação
```powershell
cd frontend
npm install
```

### Desenvolvimento
```powershell
npm run dev
```
Acessar: http://localhost:5173

### Build de Produção
```powershell
npm run build
```

### Preview da Build
```powershell
npm run preview
```

## 🧪 Validações

### Validações no Formulário
- **Receita Bruta:** Obrigatória e maior que zero
- **Atividade:** Obrigatória (comercio/industria/servico)
- **Folha:** Opcional, não pode ser negativa
- **Despesas:** Opcional, não pode ser negativa

### Tratamento de Erros
- Mensagens de erro amigáveis
- Indicação visual de campos inválidos
- Loading states durante requisições
- Redirecionamento se não houver resultado

## 🔄 Fluxo de Uso

1. **Home** → Usuário clica em "Calcular Agora"
2. **Formulário** → Preenche os dados da empresa
3. **Loading** → Aguarda cálculo dos três regimes
4. **Resultado** → Visualiza comparação e melhor opção
5. **Nova Consulta** → Limpa dados e volta ao formulário

## 💾 Persistência

O Zustand store utiliza `persist` middleware para salvar dados no `localStorage`:
- **Key:** `comparador-tributario-storage`
- **Dados salvos:** `entrada`, `resultado`, `loading`, `error`

## 📱 Responsividade

A aplicação é totalmente responsiva:
- **Mobile:** Layout em coluna única
- **Tablet (md):** Grid 2 colunas
- **Desktop (lg):** Grid 3 colunas + textos maiores

## ⚠️ Observações

- Certifique-se de que o backend está rodando antes de iniciar o frontend
- As cores e ícones são escolhidos para facilitar a identificação visual
- O resultado permanece salvo no `localStorage` mesmo após fechar o navegador
- A opção "Imprimir" usa a função nativa `window.print()`

## 🐛 Troubleshooting

### Backend não responde
- Verifique se o backend está rodando em `http://localhost:3001`
- Teste o endpoint `/status` diretamente no navegador

### Erros de CORS
- Certifique-se de que o backend tem o middleware CORS configurado
- Verifique as configurações do proxy no `vite.config.js`

### Estado não persiste
- Verifique se o localStorage está habilitado no navegador
- Limpe o cache: `localStorage.clear()`

## 📄 Licença

Este projeto é parte do sistema Comparador de Regimes Tributários.

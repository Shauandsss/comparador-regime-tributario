# Jornada de Economia Empresarial

## 📋 Descrição

Ferramenta de diagnóstico inteligente que identifica oportunidades legais de economia em impostos e custos para empresas. Através de um wizard interativo com perguntas estratégicas, o sistema avalia 25+ regras tributárias e de gestão para gerar recomendações personalizadas.

## 🎯 Características

### Versões Disponíveis

1. **Diagnóstico Rápido** (~5 minutos)
   - 16 perguntas objetivas
   - 4 etapas principais
   - Foco em oportunidades imediatas
   - 9 regras de avaliação

2. **Diagnóstico Completo** (~15 minutos)
   - 46 perguntas detalhadas
   - 11 etapas abrangentes
   - Análise profunda de todas as áreas
   - 25 regras de avaliação

### Funcionalidades

- ✅ **Wizard Interativo**: Uma pergunta por tela com navegação fluida
- ✅ **Lógica Condicional**: Perguntas aparecem baseadas em respostas anteriores
- ✅ **Validação em Tempo Real**: Campos obrigatórios identificados
- ✅ **Persistência Local**: Respostas salvas automaticamente no localStorage
- ✅ **Motor de Regras Frontend**: Avaliação 100% client-side
- ✅ **Relatório Detalhado**: Oportunidades priorizadas por impacto
- ✅ **Exportação PDF**: Geração de relatório completo
- ✅ **Design Responsivo**: Compatível com mobile, tablet e desktop

## 📂 Estrutura de Arquivos

```
frontend/src/
├── pages/
│   ├── JornadaEconomiaHome.jsx       # Página inicial com escolha de versão
│   ├── JornadaEconomia.jsx           # Versão completa
│   └── JornadaEconomiaBasica.jsx     # Versão rápida
├── components/Wizard/
│   ├── WizardContainer.jsx           # Container principal com navegação
│   ├── StepRenderer.jsx              # Renderizador de etapas
│   ├── CardRenderer.jsx              # Renderizador de cards
│   ├── InputRenderer.jsx             # Renderizador de inputs
│   └── ReportRenderer.jsx            # Visualização do relatório
├── services/
│   ├── RuleEngine.js                 # Motor de avaliação de regras
│   └── PdfGenerator.js               # Gerador de PDF
└── data/
    ├── jornadaEconomiaConfig.js      # Configuração versão completa
    └── jornadaEconomiaBasicaConfig.js # Configuração versão básica
```

## 🧩 Arquitetura

### Componentes

#### WizardContainer
- Gerencia estado global das respostas
- Controla navegação entre steps e cards
- Implementa lógica de dependência condicional
- Persiste dados em localStorage

#### StepRenderer
- Renderiza etapa atual
- Controla navegação entre cards
- Valida campos obrigatórios
- Gerencia progresso visual

#### CardRenderer
- Container visual para cada pergunta
- Layout responsivo

#### InputRenderer
- Renderiza diferentes tipos de input:
  - `text`: Campos de texto livre
  - `number`: Campos numéricos
  - `select`: Dropdown de opções
  - `boolean`: Botões Sim/Não

#### ReportRenderer
- Exibe resumo estatístico
- Lista oportunidades priorizadas
- Mostra próximos passos
- Botões de ação (PDF, Reiniciar)

### Serviços

#### RuleEngine
Motor de regras que avalia condições baseadas nas respostas:

**Operadores Suportados:**
- `equals`: Igualdade exata
- `notEquals`: Diferença
- `greaterThan`: Maior que
- `lessThan`: Menor que
- `greaterThanOrEqual`: Maior ou igual
- `lessThanOrEqual`: Menor ou igual
- `contains`: Contém substring

**Lógica:**
- Todas as condições de uma regra devem ser verdadeiras (AND)
- Resultados são ordenados por prioridade (alta > média > baixa)

#### PdfGenerator
Gera PDF completo client-side usando jsPDF:
- Header com título e descrição
- Resumo estatístico
- Lista detalhada de oportunidades
- Próximos passos recomendados
- Disclaimer legal
- Paginação automática

## 📊 Estrutura de Dados

### Configuração JSON

```javascript
{
  "meta": {
    "id": "identificador-unico",
    "title": "Título da Jornada",
    "description": "Descrição resumida",
    "disclaimer": "Aviso legal"
  },
  "steps": [
    {
      "id": "step-id",
      "title": "Título da Etapa",
      "cards": [
        {
          "id": "campo-id",
          "label": "Pergunta ao usuário",
          "type": "text|number|select|boolean",
          "options": ["Op1", "Op2"], // apenas para select
          "required": true|false,
          "dependsOn": { // opcional
            "field": "outro-campo-id",
            "value": valorEsperado
          }
        }
      ]
    }
  ],
  "rules": [
    {
      "id": "regra-id",
      "conditions": [
        {
          "field": "campo-id",
          "operator": "equals",
          "value": "valor"
        }
      ],
      "result": {
        "type": "economia|oportunidade",
        "priority": "alta|media|baixa",
        "title": "Título da Oportunidade",
        "description": "Descrição detalhada",
        "estimatedEconomy": "Estimativa",
        "action": ["Ação 1", "Ação 2"],
        "source": ["FONTE-1", "FONTE-2"]
      }
    }
  ],
  "sources": {
    "FONTE-1": {
      "title": "Nome da Fonte",
      "url": "https://..."
    }
  }
}
```

## 🎨 Design System

### Cores por Versão
- **Básica**: Blue (`from-blue-600 to-indigo-700`)
- **Completa**: Green (`from-green-600 to-green-700`)

### Prioridades
- **Alta**: Red (`bg-red-100 text-red-800`)
- **Média**: Yellow (`bg-yellow-100 text-yellow-800`)
- **Baixa**: Green (`bg-green-100 text-green-800`)

### Responsividade
- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`
- Grid adaptativo
- Touch-friendly buttons

## 🚀 Rotas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/jornada-economia-home` | Home | Escolha entre versões |
| `/jornada-economia` | Completa | 46 perguntas detalhadas |
| `/jornada-economia-basica` | Básica | 16 perguntas rápidas |

## 📈 Métricas e Oportunidades

### Versão Básica
- **9 regras** de avaliação
- Foco em ganhos rápidos
- Principais áreas: regime, pró-labore, créditos, controles

### Versão Completa
- **25 regras** de avaliação
- Análise abrangente
- Áreas cobertas:
  - Regime tributário
  - Remuneração de sócios
  - Benefícios e vantagens
  - Créditos tributários
  - Gestão financeira
  - Patrimônio e ativos
  - Planejamento estratégico

## 💡 Casos de Uso

1. **Empresário iniciante**: Descobrir oportunidades básicas de economia
2. **Empresa estabelecida**: Revisar estrutura tributária periodicamente
3. **Pré-consultoria**: Preparação antes de falar com contador
4. **Validação**: Verificar se está pagando impostos corretamente
5. **Crescimento**: Planejar estrutura para escala

## 🔒 Considerações de Privacidade

- **Sem backend**: Todas as respostas ficam no navegador
- **localStorage**: Dados salvos localmente
- **Sem cadastro**: Não requer identificação
- **Sem tracking**: Não rastreia usuários
- **Exportação local**: PDF gerado no cliente

## ⚠️ Disclaimer Legal

Este diagnóstico é educativo e não substitui a análise de um contador ou consultor tributário. As recomendações devem ser validadas por profissionais qualificados antes da implementação.

## 🎯 Próximas Melhorias

- [ ] Integração com API de CNAEs
- [ ] Comparação de regimes em tempo real
- [ ] Histórico de diagnósticos anteriores
- [ ] Compartilhamento de resultados
- [ ] Modo empresa vs. empresário individual
- [ ] Calculadora integrada de economia
- [ ] Agendamento de revisões periódicas
- [ ] Exportação para outros formatos (Excel, JSON)

## 📚 Fontes e Referências

- Lei Complementar nº 123/2006 (Simples Nacional)
- Receita Federal do Brasil
- CONFAZ (Créditos de ICMS)
- SEBRAE (Gestão Empresarial)
- Conselho Federal de Contabilidade

---

**Desenvolvido para o Comparador Tributário**  
Versão 1.0.0 - Dezembro 2025

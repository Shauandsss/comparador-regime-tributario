export const jornadaEconomiaBasicaConfig = {
  "meta": {
    "id": "jornada-economia-empresarial-basica",
    "title": "Diagnóstico Rápido de Economia Empresarial",
    "description": "Versão simplificada com as principais perguntas para identificar oportunidades imediatas de economia.",
    "version": "1.0.0",
    "type": "wizard",
    "disclaimer": "Este diagnóstico é educativo e não substitui a análise de um contador ou consultor tributário."
  },

  "steps": [
    {
      "id": "step-basico-empresa",
      "title": "Informações Básicas",
      "cards": [
        {
          "id": "tipo_empresa",
          "label": "Qual o porte da sua empresa?",
          "type": "select",
          "options": ["MEI", "ME (Microempresa)", "EPP (Empresa de Pequeno Porte)", "Empresa de Médio Porte"],
          "required": true
        },
        {
          "id": "regime_tributario",
          "label": "Qual o regime tributário atual?",
          "type": "select",
          "options": ["Simples Nacional", "Lucro Presumido", "Lucro Real", "Não sei"],
          "required": true
        },
        {
          "id": "faturamento_mensal",
          "label": "Qual o faturamento mensal médio (R$)?",
          "type": "number",
          "required": true
        },
        {
          "id": "setor_atuacao",
          "label": "Qual o setor de atuação?",
          "type": "select",
          "options": [
            "Comércio",
            "Serviços",
            "Indústria",
            "Tecnologia/TI",
            "Saúde",
            "Consultoria",
            "Outro"
          ],
          "required": true
        }
      ]
    },

    {
      "id": "step-basico-custos",
      "title": "Custos e Estrutura",
      "cards": [
        {
          "id": "margem_lucro",
          "label": "Qual a margem de lucro aproximada?",
          "type": "select",
          "options": [
            "Menos de 10%",
            "Entre 10% e 20%",
            "Entre 20% e 40%",
            "Acima de 40%",
            "Não sei informar"
          ],
          "required": true
        },
        {
          "id": "possui_funcionarios",
          "label": "Possui funcionários registrados?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "compra_mercadorias",
          "label": "Compra mercadorias para revenda ou produção?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "possui_contador",
          "label": "Possui contador atualmente?",
          "type": "boolean",
          "required": true
        }
      ]
    },

    {
      "id": "step-basico-socios",
      "title": "Remuneração dos Sócios",
      "cards": [
        {
          "id": "retira_pro_labore",
          "label": "Os sócios retiram pró-labore?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "pro_labore",
          "label": "Qual o valor total de pró-labore mensal (R$)?",
          "type": "number",
          "dependsOn": {
            "field": "retira_pro_labore",
            "value": true
          }
        },
        {
          "id": "distribuicao_lucros",
          "label": "É feita distribuição de lucros regularmente?",
          "type": "select",
          "options": ["Sim, regularmente", "Não", "Irregular"],
          "required": true
        },
        {
          "id": "paga_plano_saude",
          "label": "Oferece plano de saúde?",
          "type": "select",
          "options": ["Não oferece", "Sim, pago pela PF dos sócios", "Sim, pago pela PJ"],
          "required": true
        }
      ]
    },

    {
      "id": "step-basico-financeiro",
      "title": "Gestão e Objetivos",
      "cards": [
        {
          "id": "controle_financeiro",
          "label": "Como é feito o controle financeiro?",
          "type": "select",
          "options": [
            "Sistema de gestão estruturado",
            "Planilhas manuais",
            "Apenas extrato bancário",
            "Não há controle estruturado"
          ],
          "required": true
        },
        {
          "id": "creditos_tributarios",
          "label": "Aproveita créditos tributários (ICMS, PIS, COFINS)?",
          "type": "select",
          "options": ["Sim, regularmente", "Não", "Não sei"],
          "required": true
        },
        {
          "id": "expectativa_crescimento",
          "label": "Qual a expectativa de crescimento?",
          "type": "select",
          "options": [
            "Sem crescimento",
            "Crescimento moderado (até 30%)",
            "Crescimento acelerado (acima de 30%)"
          ],
          "required": true
        },
        {
          "id": "principal_objetivo",
          "label": "Qual o principal objetivo?",
          "type": "select",
          "options": [
            "Reduzir impostos",
            "Melhorar organização tributária",
            "Validar regime atual",
            "Planejar crescimento"
          ],
          "required": true
        }
      ]
    }
  ],

  "rules": [
    {
      "id": "basico_regime_simples_alto",
      "conditions": [
        { "field": "regime_tributario", "operator": "equals", "value": "Simples Nacional" },
        { "field": "faturamento_mensal", "operator": "greaterThan", "value": 80000 }
      ],
      "result": {
        "type": "economia",
        "priority": "alta",
        "title": "Avaliar mudança de regime tributário",
        "description": "Com faturamento acima de R$ 80 mil/mês, outros regimes podem ser mais vantajosos.",
        "estimatedEconomy": "5% a 15% ao ano",
        "action": [
          "Simular Lucro Presumido",
          "Comparar alíquotas efetivas",
          "Consultar contador especializado"
        ],
        "source": ["SN-LEI-123", "RFB-LUCRO-PRESUMIDO"]
      }
    },

    {
      "id": "basico_pro_labore_alto",
      "conditions": [
        { "field": "pro_labore", "operator": "greaterThan", "value": 7000 }
      ],
      "result": {
        "type": "economia",
        "priority": "alta",
        "title": "Otimizar remuneração dos sócios",
        "description": "Pró-labore elevado gera alta carga de INSS. Equilibrar com distribuição de lucros pode economizar até 25%.",
        "estimatedEconomy": "15% a 25% sobre a folha de sócios",
        "action": [
          "Reduzir pró-labore",
          "Aumentar distribuição de lucros",
          "Calcular ponto ótimo"
        ],
        "source": ["INSS-PRO-LABORE", "RFB-DISTRIBUICAO-LUCROS"]
      }
    },

    {
      "id": "basico_sem_distribuicao",
      "conditions": [
        { "field": "distribuicao_lucros", "operator": "equals", "value": "Não" },
        { "field": "retira_pro_labore", "operator": "equals", "value": true }
      ],
      "result": {
        "type": "economia",
        "priority": "alta",
        "title": "Implementar distribuição de lucros",
        "description": "Distribuição de lucros é isenta de IR e INSS. Pode reduzir significativamente a carga tributária.",
        "estimatedEconomy": "20% a 35% na remuneração",
        "action": [
          "Estruturar distribuição de lucros",
          "Documentar formalmente",
          "Ajustar pró-labore"
        ],
        "source": ["RFB-DISTRIBUICAO-LUCROS"]
      }
    },

    {
      "id": "basico_plano_saude_pf",
      "conditions": [
        { "field": "paga_plano_saude", "operator": "equals", "value": "Sim, pago pela PF dos sócios" }
      ],
      "result": {
        "type": "economia",
        "priority": "media",
        "title": "Transferir plano de saúde para PJ",
        "description": "Plano de saúde pago pela PJ pode ser dedutível como despesa operacional.",
        "estimatedEconomy": "Valor do plano x alíquota efetiva",
        "action": [
          "Consultar operadora",
          "Transferir para PJ",
          "Validar dedutibilidade"
        ],
        "source": ["RFB-DESPESAS"]
      }
    },

    {
      "id": "basico_sem_contador",
      "conditions": [
        { "field": "possui_contador", "operator": "equals", "value": false }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "alta",
        "title": "Contratar contador urgente",
        "description": "Operar sem contador pode gerar multas de 20% a 150% sobre tributos não pagos corretamente.",
        "estimatedEconomy": "Evitar multas graves",
        "action": [
          "Contratar contador imediatamente",
          "Regularizar obrigações",
          "Implementar compliance"
        ],
        "source": ["RFB-COMPLIANCE"]
      }
    },

    {
      "id": "basico_creditos_nao_aproveitados",
      "conditions": [
        { "field": "compra_mercadorias", "operator": "equals", "value": true },
        { "field": "regime_tributario", "operator": "notEquals", "value": "Simples Nacional" },
        { "field": "creditos_tributarios", "operator": "equals", "value": "Não" }
      ],
      "result": {
        "type": "economia",
        "priority": "alta",
        "title": "Aproveitar créditos tributários",
        "description": "Você pode estar perdendo 9,25% a 12,5% de créditos sobre suas compras.",
        "estimatedEconomy": "9,25% a 12,5% sobre compras",
        "action": [
          "Mapear notas fiscais de entrada",
          "Identificar créditos disponíveis",
          "Contratar recuperação tributária"
        ],
        "source": ["PIS-COFINS", "ICMS-CREDITO"]
      }
    },

    {
      "id": "basico_sem_controle",
      "conditions": [
        { "field": "controle_financeiro", "operator": "equals", "value": "Não há controle estruturado" }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "alta",
        "title": "Implementar controle financeiro",
        "description": "Sem controle, pode haver desperdício de 15% a 25% que você nem percebe.",
        "estimatedEconomy": "15% a 25% em redução de desperdício",
        "action": [
          "Implementar sistema de gestão",
          "Categorizar despesas",
          "Acompanhar fluxo de caixa"
        ],
        "source": ["GESTAO-FINANCEIRA"]
      }
    },

    {
      "id": "basico_crescimento_acelerado",
      "conditions": [
        { "field": "expectativa_crescimento", "operator": "equals", "value": "Crescimento acelerado (acima de 30%)" }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "alta",
        "title": "Planejar estrutura para crescimento",
        "description": "Crescimento acelerado exige planejamento tributário para evitar surpresas.",
        "estimatedEconomy": "Prevenção de custos futuros",
        "action": [
          "Projetar faturamento",
          "Simular impacto tributário",
          "Planejar mudança de regime"
        ],
        "source": ["RFB-PLANEJAMENTO"]
      }
    },

    {
      "id": "basico_margem_baixa_presumido",
      "conditions": [
        { "field": "regime_tributario", "operator": "equals", "value": "Lucro Presumido" },
        { "field": "margem_lucro", "operator": "equals", "value": "Menos de 10%" }
      ],
      "result": {
        "type": "economia",
        "priority": "alta",
        "title": "Considerar Lucro Real",
        "description": "Com margem baixa, Lucro Real tributa apenas o lucro efetivo.",
        "estimatedEconomy": "10% a 25% ao ano",
        "action": [
          "Calcular lucro real efetivo",
          "Comparar com presumido",
          "Avaliar complexidade"
        ],
        "source": ["RFB-LUCRO-REAL"]
      }
    }
  ],

  "report": {
    "sections": [
      {
        "id": "resumo",
        "title": "Resumo do diagnóstico",
        "type": "summary"
      },
      {
        "id": "oportunidades",
        "title": "Oportunidades identificadas",
        "type": "list",
        "orderBy": "priority"
      },
      {
        "id": "proximos_passos",
        "title": "Próximos passos recomendados",
        "type": "actions"
      }
    ]
  },

  "sources": {
    "SN-LEI-123": {
      "title": "Lei Complementar nº 123/2006 - Simples Nacional",
      "url": "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm"
    },
    "INSS-PRO-LABORE": {
      "title": "INSS sobre Pró-labore",
      "url": "https://www.gov.br/inss"
    },
    "RFB-DESPESAS": {
      "title": "Receita Federal – Despesas Dedutíveis",
      "url": "https://www.gov.br/receitafederal"
    },
    "RFB-DISTRIBUICAO-LUCROS": {
      "title": "Distribuição de Lucros",
      "url": "https://www.gov.br/receitafederal"
    },
    "RFB-LUCRO-PRESUMIDO": {
      "title": "Lucro Presumido",
      "url": "https://www.gov.br/receitafederal"
    },
    "RFB-LUCRO-REAL": {
      "title": "Lucro Real",
      "url": "https://www.gov.br/receitafederal"
    },
    "RFB-PLANEJAMENTO": {
      "title": "Planejamento Tributário",
      "url": "https://www.gov.br/receitafederal"
    },
    "RFB-COMPLIANCE": {
      "title": "Compliance Tributário",
      "url": "https://www.gov.br/receitafederal"
    },
    "ICMS-CREDITO": {
      "title": "Créditos de ICMS",
      "url": "https://www.confaz.fazenda.gov.br"
    },
    "PIS-COFINS": {
      "title": "Créditos de PIS e COFINS",
      "url": "https://www.gov.br/receitafederal"
    },
    "GESTAO-FINANCEIRA": {
      "title": "Gestão Financeira Empresarial",
      "url": "https://www.sebrae.com.br"
    }
  },

  "uiHints": {
    "cardLayout": "one-question-per-card",
    "progressIndicator": true,
    "allowBack": true,
    "generatePdf": true
  }
};

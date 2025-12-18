export const jornadaEconomiaConfig = {
  "meta": {
    "id": "jornada-economia-empresarial",
    "title": "Jornada de Economia Empresarial",
    "description": "Diagnóstico guiado que identifica oportunidades legais de economia para empresas com base em informações fornecidas pelo empreendedor.",
    "version": "1.0.0",
    "type": "wizard",
    "disclaimer": "Este diagnóstico é educativo e não substitui a análise de um contador ou consultor tributário."
  },

  "steps": [
    {
      "id": "step-identificacao",
      "title": "Identificação da Empresa",
      "cards": [
        {
          "id": "tipo_empresa",
          "label": "Qual o porte da sua empresa?",
          "type": "select",
          "options": ["MEI", "ME (Microempresa)", "EPP (Empresa de Pequeno Porte)", "Empresa de Médio Porte"],
          "required": true
        },
        {
          "id": "tempo_atividade",
          "label": "Há quanto tempo a empresa está ativa?",
          "type": "select",
          "options": ["Menos de 1 ano", "1 a 3 anos", "3 a 5 anos", "5 a 10 anos", "Mais de 10 anos"],
          "required": true
        },
        {
          "id": "cnae",
          "label": "CNAE principal da atividade",
          "type": "text",
          "placeholder": "Ex: 6201-5/01",
          "required": false
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
            "Educação",
            "Construção Civil",
            "Consultoria",
            "Outro"
          ],
          "required": true
        }
      ]
    },

    {
      "id": "step-regime",
      "title": "Regime Tributário",
      "cards": [
        {
          "id": "regime_tributario",
          "label": "Qual o regime tributário atual?",
          "type": "select",
          "options": ["Simples Nacional", "Lucro Presumido", "Lucro Real", "Não sei"],
          "required": true
        },
        {
          "id": "anexo_simples",
          "label": "Qual anexo do Simples Nacional?",
          "type": "select",
          "options": ["Anexo I", "Anexo II", "Anexo III", "Anexo IV", "Anexo V", "Não sei"],
          "dependsOn": {
            "field": "regime_tributario",
            "value": "Simples Nacional"
          }
        },
        {
          "id": "ultima_analise_regime",
          "label": "Quando foi a última análise do regime tributário?",
          "type": "select",
          "options": [
            "Nunca foi feita",
            "Há menos de 6 meses",
            "Entre 6 meses e 1 ano",
            "Há mais de 1 ano",
            "Na abertura da empresa"
          ],
          "required": true
        },
        {
          "id": "considera_mudar_regime",
          "label": "Já considerou mudar de regime tributário?",
          "type": "boolean",
          "required": true
        }
      ]
    },

    {
      "id": "step-faturamento",
      "title": "Faturamento e Receitas",
      "cards": [
        {
          "id": "faturamento_mensal",
          "label": "Qual o faturamento mensal médio (R$)?",
          "type": "number",
          "required": true
        },
        {
          "id": "faturamento_anual",
          "label": "Qual o faturamento anual projetado (R$)?",
          "type": "number",
          "required": true
        },
        {
          "id": "sazonalidade",
          "label": "O faturamento tem sazonalidade?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "variacao_faturamento",
          "label": "Como varia o faturamento ao longo do ano?",
          "type": "select",
          "options": [
            "Muito estável (variação < 10%)",
            "Pouco variável (variação 10-30%)",
            "Variável (variação 30-50%)",
            "Muito variável (variação > 50%)"
          ],
          "dependsOn": {
            "field": "sazonalidade",
            "value": true
          }
        },
        {
          "id": "expectativa_crescimento",
          "label": "Qual a expectativa de crescimento para o próximo ano?",
          "type": "select",
          "options": [
            "Sem crescimento ou redução",
            "Crescimento de até 20%",
            "Crescimento entre 20% e 50%",
            "Crescimento acima de 50%"
          ],
          "required": true
        }
      ]
    },

    {
      "id": "step-custos",
      "title": "Custos e Despesas",
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
          "id": "custo_mercadorias_servicos",
          "label": "Quanto representa o custo de mercadorias/serviços no faturamento?",
          "type": "select",
          "options": [
            "Menos de 20%",
            "Entre 20% e 40%",
            "Entre 40% e 60%",
            "Acima de 60%"
          ],
          "required": true
        },
        {
          "id": "compra_mercadorias",
          "label": "Compra mercadorias para revenda ou produção?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "fornecedores_nota_fiscal",
          "label": "Seus fornecedores emitem nota fiscal?",
          "type": "select",
          "options": ["Todos emitem", "Maioria emite", "Poucos emitem", "Nenhum emite"],
          "dependsOn": {
            "field": "compra_mercadorias",
            "value": true
          }
        },
        {
          "id": "despesas_operacionais_mes",
          "label": "Qual o valor aproximado de despesas operacionais mensais (R$)?",
          "type": "number",
          "required": true
        }
      ]
    },

    {
      "id": "step-estrutura",
      "title": "Estrutura da Empresa",
      "cards": [
        {
          "id": "possui_funcionarios",
          "label": "Possui funcionários registrados?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "quantidade_funcionarios",
          "label": "Quantos funcionários registrados?",
          "type": "number",
          "dependsOn": {
            "field": "possui_funcionarios",
            "value": true
          }
        },
        {
          "id": "folha_pagamento_mensal",
          "label": "Qual o valor da folha de pagamento mensal (R$)?",
          "type": "number",
          "dependsOn": {
            "field": "possui_funcionarios",
            "value": true
          }
        },
        {
          "id": "prestadores_servico",
          "label": "Contrata prestadores de serviço (PJ)?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "quantidade_prestadores",
          "label": "Quantos prestadores de serviço PJ?",
          "type": "number",
          "dependsOn": {
            "field": "prestadores_servico",
            "value": true
          }
        },
        {
          "id": "possui_contador",
          "label": "Possui contador atualmente?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "valor_contabilidade",
          "label": "Quanto paga mensalmente pela contabilidade (R$)?",
          "type": "number",
          "dependsOn": {
            "field": "possui_contador",
            "value": true
          }
        }
      ]
    },

    {
      "id": "step-socios",
      "title": "Sócios e Remuneração",
      "cards": [
        {
          "id": "quantidade_socios",
          "label": "Quantos sócios a empresa possui?",
          "type": "number",
          "required": true
        },
        {
          "id": "socios_ativos",
          "label": "Quantos sócios trabalham ativamente na empresa?",
          "type": "number",
          "required": true
        },
        {
          "id": "retira_pro_labore",
          "label": "Os sócios retiram pró-labore?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "pro_labore",
          "label": "Qual o valor total de pró-labore mensal (todos os sócios) - R$?",
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
          "options": ["Sim, mensalmente", "Sim, trimestralmente", "Sim, anualmente", "Não", "Irregular"],
          "required": true
        },
        {
          "id": "valor_distribuicao_lucros",
          "label": "Qual o valor aproximado distribuído por mês (R$)?",
          "type": "number",
          "required": false
        }
      ]
    },

    {
      "id": "step-beneficios",
      "title": "Benefícios e Vantagens",
      "cards": [
        {
          "id": "paga_plano_saude",
          "label": "Oferece plano de saúde?",
          "type": "select",
          "options": ["Não oferece", "Sim, pago pela PF dos sócios", "Sim, pago pela PJ", "Sim, para sócios e funcionários"],
          "required": true
        },
        {
          "id": "valor_plano_saude",
          "label": "Qual o custo mensal com plano de saúde (R$)?",
          "type": "number",
          "dependsOn": {
            "field": "paga_plano_saude",
            "value": "Sim, pago pela PJ"
          }
        },
        {
          "id": "vale_alimentacao",
          "label": "Oferece vale-alimentação ou vale-refeição?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "vale_transporte",
          "label": "Oferece vale-transporte?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "outros_beneficios",
          "label": "Oferece outros benefícios (auxílio creche, educação, etc)?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "valor_beneficios_mes",
          "label": "Qual o custo total mensal com benefícios (R$)?",
          "type": "number",
          "required": false
        }
      ]
    },

    {
      "id": "step-patrimonio",
      "title": "Patrimônio e Ativos",
      "cards": [
        {
          "id": "imovel_proprio",
          "label": "A empresa possui imóvel próprio?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "aluguel_cnpj",
          "label": "Paga aluguel no CNPJ?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "valor_aluguel",
          "label": "Qual o valor do aluguel mensal (R$)?",
          "type": "number",
          "dependsOn": {
            "field": "aluguel_cnpj",
            "value": true
          }
        },
        {
          "id": "aluguel_de_socio",
          "label": "O imóvel alugado é de algum sócio?",
          "type": "boolean",
          "dependsOn": {
            "field": "aluguel_cnpj",
            "value": true
          }
        },
        {
          "id": "veiculo_cnpj",
          "label": "Possui veículo(s) no CNPJ?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "quantidade_veiculos",
          "label": "Quantos veículos?",
          "type": "number",
          "dependsOn": {
            "field": "veiculo_cnpj",
            "value": true
          }
        },
        {
          "id": "equipamentos_valor",
          "label": "Qual o valor aproximado em equipamentos/máquinas (R$)?",
          "type": "number",
          "required": false
        }
      ]
    },

    {
      "id": "step-operacional",
      "title": "Operação e Processos",
      "cards": [
        {
          "id": "emite_nf",
          "label": "Com que frequência emite notas fiscais?",
          "type": "select",
          "options": ["Diariamente", "Semanalmente", "Mensalmente", "Raramente", "Nunca"],
          "required": true
        },
        {
          "id": "tipo_cliente",
          "label": "Seus clientes são principalmente:",
          "type": "select",
          "options": [
            "Pessoas Físicas (B2C)",
            "Empresas/CNPJ (B2B)",
            "Governo",
            "Mix equilibrado B2B e B2C"
          ],
          "required": true
        },
        {
          "id": "vendas_fora_estado",
          "label": "Realiza vendas para fora do estado?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "exportacao",
          "label": "Realiza exportações?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "creditos_tributarios",
          "label": "Aproveita créditos tributários (ICMS, PIS, COFINS)?",
          "type": "select",
          "options": ["Sim, regularmente", "Sim, mas não sei se otimizado", "Não", "Não sei"],
          "required": true
        },
        {
          "id": "estoque",
          "label": "Mantém estoque de produtos?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "valor_estoque",
          "label": "Qual o valor aproximado do estoque (R$)?",
          "type": "number",
          "dependsOn": {
            "field": "estoque",
            "value": true
          }
        }
      ]
    },

    {
      "id": "step-financeiro",
      "title": "Gestão Financeira",
      "cards": [
        {
          "id": "controle_financeiro",
          "label": "Como é feito o controle financeiro?",
          "type": "select",
          "options": [
            "Planilhas manuais",
            "Sistema de gestão (ERP)",
            "Software especializado",
            "Apenas extrato bancário",
            "Não há controle estruturado"
          ],
          "required": true
        },
        {
          "id": "fluxo_caixa",
          "label": "Acompanha o fluxo de caixa regularmente?",
          "type": "select",
          "options": ["Sim, diariamente", "Sim, semanalmente", "Sim, mensalmente", "Raramente", "Não acompanho"],
          "required": true
        },
        {
          "id": "reserva_emergencia",
          "label": "A empresa possui reserva de emergência?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "meses_reserva",
          "label": "Para quantos meses de operação?",
          "type": "select",
          "options": ["Menos de 3 meses", "3 a 6 meses", "6 a 12 meses", "Mais de 12 meses"],
          "dependsOn": {
            "field": "reserva_emergencia",
            "value": true
          }
        },
        {
          "id": "emprestimos",
          "label": "Possui empréstimos ou financiamentos ativos?",
          "type": "boolean",
          "required": true
        },
        {
          "id": "valor_divida_total",
          "label": "Qual o valor total das dívidas (R$)?",
          "type": "number",
          "dependsOn": {
            "field": "emprestimos",
            "value": true
          }
        }
      ]
    },

    {
      "id": "step-objetivos",
      "title": "Objetivos e Expectativas",
      "cards": [
        {
          "id": "principal_objetivo",
          "label": "Qual o principal objetivo com este diagnóstico?",
          "type": "select",
          "options": [
            "Reduzir impostos",
            "Melhorar organização tributária",
            "Planejar crescimento",
            "Validar regime atual",
            "Preparar para investimento",
            "Outro"
          ],
          "required": true
        },
        {
          "id": "maior_dificuldade",
          "label": "Qual a maior dificuldade tributária atual?",
          "type": "select",
          "options": [
            "Carga tributária alta",
            "Falta de conhecimento",
            "Complexidade das obrigações",
            "Medo de fazer errado",
            "Custos com contabilidade",
            "Não tenho dificuldades"
          ],
          "required": true
        },
        {
          "id": "prioridade_economia",
          "label": "Se pudesse economizar, qual seria a prioridade?",
          "type": "select",
          "options": [
            "Impostos sobre faturamento",
            "Impostos sobre folha de pagamento",
            "Tributação dos sócios",
            "Custos com contabilidade",
            "Todas as anteriores"
          ],
          "required": true
        },
        {
          "id": "tempo_implementacao",
          "label": "Qual prazo para implementar mudanças?",
          "type": "select",
          "options": [
            "Imediatamente",
            "Até 3 meses",
            "Até 6 meses",
            "Próximo ano fiscal",
            "Apenas quero analisar"
          ],
          "required": true
        }
      ]
    }
  ],

  "rules": [
    {
      "id": "regime_simples_alto_faturamento",
      "conditions": [
        { "field": "regime_tributario", "operator": "equals", "value": "Simples Nacional" },
        { "field": "faturamento_anual", "operator": "greaterThan", "value": 1000000 }
      ],
      "result": {
        "type": "economia",
        "priority": "alta",
        "title": "Avaliar mudança para Lucro Presumido",
        "description": "Com faturamento acima de R$ 1 milhão/ano, o Lucro Presumido pode ser mais vantajoso dependendo da margem de lucro e atividade.",
        "estimatedEconomy": "5% a 15% ao ano",
        "action": [
          "Simular Lucro Presumido com contador",
          "Comparar alíquotas efetivas",
          "Analisar benefícios de créditos tributários",
          "Verificar impacto na folha de pagamento"
        ],
        "source": ["SN-LEI-123", "RFB-LUCRO-PRESUMIDO"]
      }
    },

    {
      "id": "regime_presumido_alta_margem",
      "conditions": [
        { "field": "regime_tributario", "operator": "equals", "value": "Lucro Presumido" },
        { "field": "margem_lucro", "operator": "equals", "value": "Menos de 10%" }
      ],
      "result": {
        "type": "economia",
        "priority": "alta",
        "title": "Considerar mudança para Lucro Real",
        "description": "Com margem de lucro baixa, o Lucro Real pode tributar apenas o lucro efetivo, reduzindo a carga tributária.",
        "estimatedEconomy": "10% a 25% ao ano",
        "action": [
          "Calcular lucro real dos últimos 12 meses",
          "Avaliar complexidade das obrigações",
          "Comparar com presumido atual",
          "Consultar especialista tributário"
        ],
        "source": ["RFB-LUCRO-REAL"]
      }
    },

    {
      "id": "nunca_analisou_regime",
      "conditions": [
        { "field": "ultima_analise_regime", "operator": "equals", "value": "Nunca foi feita" }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "alta",
        "title": "Realizar análise de enquadramento tributário",
        "description": "Nunca foi feita uma análise do melhor regime tributário. Pode haver economia significativa não identificada.",
        "estimatedEconomy": "Potencial de 10% a 30%",
        "action": [
          "Contratar análise tributária completa",
          "Simular todos os regimes disponíveis",
          "Verificar histórico de faturamento",
          "Planejar mudança para início do ano"
        ],
        "source": ["SN-LEI-123", "RFB-PLANEJAMENTO"]
      }
    },

    {
      "id": "pro_labore_excessivo",
      "conditions": [
        { "field": "pro_labore", "operator": "greaterThan", "value": 7000 }
      ],
      "result": {
        "type": "economia",
        "priority": "alta",
        "title": "Otimizar remuneração dos sócios",
        "description": "Pró-labore elevado gera alta carga de INSS (11% empresa + 11% sócio). Equilibrar com distribuição de lucros pode reduzir significativamente os custos.",
        "estimatedEconomy": "15% a 25% sobre a folha de sócios",
        "action": [
          "Reduzir pró-labore ao mínimo necessário",
          "Aumentar distribuição de lucros (isenta de tributação)",
          "Calcular ponto ótimo com contador",
          "Regularizar distribuição de lucros"
        ],
        "source": ["INSS-PRO-LABORE", "RFB-DISTRIBUICAO-LUCROS"]
      }
    },

    {
      "id": "sem_distribuicao_lucros",
      "conditions": [
        { "field": "distribuicao_lucros", "operator": "equals", "value": "Não" },
        { "field": "retira_pro_labore", "operator": "equals", "value": true }
      ],
      "result": {
        "type": "economia",
        "priority": "alta",
        "title": "Implementar distribuição de lucros",
        "description": "Distribuição de lucros é isenta de IR e INSS. Complementar a remuneração dos sócios com lucros pode gerar economia imediata.",
        "estimatedEconomy": "20% a 35% na remuneração dos sócios",
        "action": [
          "Estruturar política de distribuição de lucros",
          "Reduzir pró-labore proporcionalmente",
          "Documentar formalmente as distribuições",
          "Consultar contador para cálculo ótimo"
        ],
        "source": ["RFB-DISTRIBUICAO-LUCROS", "INSS-PRO-LABORE"]
      }
    },

    {
      "id": "plano_saude_pf_socios",
      "conditions": [
        { "field": "paga_plano_saude", "operator": "equals", "value": "Sim, pago pela PF dos sócios" }
      ],
      "result": {
        "type": "economia",
        "priority": "media",
        "title": "Transferir plano de saúde para PJ",
        "description": "Plano de saúde pago pela PJ pode ser dedutível como despesa operacional, reduzindo a base de cálculo dos impostos.",
        "estimatedEconomy": "Valor do plano x alíquota efetiva",
        "action": [
          "Consultar operadora sobre contrato empresarial",
          "Verificar dedutibilidade no regime atual",
          "Calcular economia tributária",
          "Transferir titularidade para PJ"
        ],
        "source": ["RFB-DESPESAS"]
      }
    },

    {
      "id": "plano_saude_pj_sem_funcionarios",
      "conditions": [
        { "field": "paga_plano_saude", "operator": "equals", "value": "Sim, para sócios e funcionários" },
        { "field": "possui_funcionarios", "operator": "equals", "value": false }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "baixa",
        "title": "Revisar contrato de plano de saúde empresarial",
        "description": "Plano empresarial sem funcionários pode ter custo desnecessário. Avaliar se plano PME não seria mais vantajoso.",
        "estimatedEconomy": "10% a 20% no custo do plano",
        "action": [
          "Comparar preços com planos PME",
          "Avaliar custo-benefício",
          "Negociar com operadora"
        ],
        "source": ["RFB-DESPESAS"]
      }
    },

    {
      "id": "aluguel_de_socio",
      "conditions": [
        { "field": "aluguel_cnpj", "operator": "equals", "value": true },
        { "field": "aluguel_de_socio", "operator": "equals", "value": true }
      ],
      "result": {
        "type": "economia",
        "priority": "media",
        "title": "Otimizar aluguel entre partes relacionadas",
        "description": "Aluguel pago pela PJ a sócio pode ser estratégia legal de retirada com tributação menor que pró-labore.",
        "estimatedEconomy": "Diferença de tributação entre pró-labore e aluguel",
        "action": [
          "Formalizar contrato de aluguel com preço de mercado",
          "Emitir recibo mensalmente",
          "Declarar como rendimento de aluguel (IR 27,5% vs INSS 22%)",
          "Validar valores praticados no mercado"
        ],
        "source": ["RFB-ALUGUEL", "INSS-PRO-LABORE"]
      }
    },

    {
      "id": "credito_tributario_nao_aproveitado",
      "conditions": [
        { "field": "compra_mercadorias", "operator": "equals", "value": true },
        { "field": "regime_tributario", "operator": "notEquals", "value": "Simples Nacional" },
        { "field": "creditos_tributarios", "operator": "equals", "value": "Não" }
      ],
      "result": {
        "type": "economia",
        "priority": "alta",
        "title": "Aproveitar créditos tributários não utilizados",
        "description": "Empresas fora do Simples podem aproveitar créditos de PIS, COFINS e ICMS sobre compras. Você pode estar perdendo economia significativa.",
        "estimatedEconomy": "9,25% a 12,5% sobre compras",
        "action": [
          "Mapear todas as notas fiscais de entrada",
          "Identificar créditos de PIS/COFINS (9,25%)",
          "Verificar créditos de ICMS",
          "Contratar especialista em recuperação tributária"
        ],
        "source": ["ICMS-CREDITO", "PIS-COFINS"]
      }
    },

    {
      "id": "credito_tributario_otimizar",
      "conditions": [
        { "field": "compra_mercadorias", "operator": "equals", "value": true },
        { "field": "creditos_tributarios", "operator": "equals", "value": "Sim, mas não sei se otimizado" }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "media",
        "title": "Revisar aproveitamento de créditos tributários",
        "description": "Há oportunidade de maximizar créditos tributários com revisão especializada e recuperação de créditos não aproveitados.",
        "estimatedEconomy": "3% a 8% adicional",
        "action": [
          "Auditoria de créditos tributários",
          "Revisar últimos 5 anos para recuperação",
          "Otimizar fluxo de aproveitamento",
          "Treinar equipe fiscal"
        ],
        "source": ["ICMS-CREDITO", "PIS-COFINS"]
      }
    },

    {
      "id": "fornecedores_sem_nota",
      "conditions": [
        { "field": "fornecedores_nota_fiscal", "operator": "equals", "value": "Poucos emitem" }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "alta",
        "title": "Regularizar fornecedores para aproveitar créditos",
        "description": "Fornecedores sem nota fiscal impedem aproveitamento de créditos tributários e podem gerar problemas fiscais.",
        "estimatedEconomy": "10% a 15% sobre compras regularizadas",
        "action": [
          "Exigir nota fiscal de todos os fornecedores",
          "Substituir fornecedores irregulares",
          "Formalizar política de compras",
          "Capacitar equipe de compras"
        ],
        "source": ["ICMS-CREDITO", "PIS-COFINS", "RFB-COMPLIANCE"]
      }
    },

    {
      "id": "alto_custo_contabilidade",
      "conditions": [
        { "field": "valor_contabilidade", "operator": "greaterThan", "value": 1000 }
      ],
      "result": {
        "type": "economia",
        "priority": "media",
        "title": "Avaliar custo-benefício da contabilidade",
        "description": "Custo alto de contabilidade pode indicar complexidade desnecessária ou oportunidade de negociação.",
        "estimatedEconomy": "20% a 40% no custo mensal",
        "action": [
          "Solicitar detalhamento dos serviços prestados",
          "Cotação com outros escritórios",
          "Avaliar automações possíveis",
          "Negociar escopo e valores"
        ],
        "source": ["RFB-CONTABILIDADE"]
      }
    },

    {
      "id": "sem_contador",
      "conditions": [
        { "field": "possui_contador", "operator": "equals", "value": false }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "alta",
        "title": "Contratar contador especializado urgente",
        "description": "Operar sem contador é extremamente arriscado e pode gerar multas, perda de prazos e falta de planejamento tributário.",
        "estimatedEconomy": "Evitar multas de 20% a 150% sobre tributos",
        "action": [
          "Contratar contador imediatamente",
          "Regularizar obrigações em atraso",
          "Implementar rotina de compliance",
          "Estabelecer planejamento tributário"
        ],
        "source": ["RFB-COMPLIANCE", "CFC-OBRIGACOES"]
      }
    },

    {
      "id": "muitos_veiculos_pj",
      "conditions": [
        { "field": "quantidade_veiculos", "operator": "greaterThan", "value": 2 }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "media",
        "title": "Avaliar necessidade de veículos na PJ",
        "description": "Veículos na PJ geram IPVA, seguro e manutenção como despesa, mas podem não ser totalmente dedutíveis. Avaliar se todos são necessários.",
        "estimatedEconomy": "Variável conforme uso",
        "action": [
          "Avaliar uso efetivo de cada veículo",
          "Considerar reembolso por km rodado",
          "Analisar dedutibilidade fiscal",
          "Comparar custo-benefício"
        ],
        "source": ["RFB-DESPESAS"]
      }
    },

    {
      "id": "estoque_alto",
      "conditions": [
        { "field": "valor_estoque", "operator": "greaterThan", "value": 100000 }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "media",
        "title": "Otimizar gestão de estoque",
        "description": "Estoque elevado representa capital parado. Otimizar pode liberar recursos e reduzir custos operacionais.",
        "estimatedEconomy": "Ganho financeiro com giro",
        "action": [
          "Analisar giro de estoque",
          "Identificar itens parados",
          "Implementar política de compras just-in-time",
          "Liquidar produtos obsoletos"
        ],
        "source": ["GESTAO-FINANCEIRA"]
      }
    },

    {
      "id": "sem_controle_financeiro",
      "conditions": [
        { "field": "controle_financeiro", "operator": "equals", "value": "Não há controle estruturado" }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "alta",
        "title": "Implementar controle financeiro urgente",
        "description": "Sem controle financeiro, é impossível tomar decisões informadas e identificar oportunidades de economia.",
        "estimatedEconomy": "Potencial de identificar 15% a 25% de desperdício",
        "action": [
          "Implementar sistema de gestão financeira",
          "Categorizar todas as despesas",
          "Estabelecer fluxo de caixa",
          "Treinar responsável financeiro"
        ],
        "source": ["GESTAO-FINANCEIRA"]
      }
    },

    {
      "id": "sem_reserva_emergencia",
      "conditions": [
        { "field": "reserva_emergencia", "operator": "equals", "value": false },
        { "field": "faturamento_mensal", "operator": "greaterThan", "value": 20000 }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "alta",
        "title": "Criar reserva de emergência",
        "description": "Empresa sem reserva está vulnerável a imprevistos. Construir reserva de 6 meses de despesas operacionais é fundamental.",
        "estimatedEconomy": "Proteção contra crises",
        "action": [
          "Calcular 6 meses de despesas operacionais",
          "Estabelecer meta de reserva",
          "Separar percentual mensal das receitas",
          "Manter em aplicação de liquidez imediata"
        ],
        "source": ["GESTAO-FINANCEIRA"]
      }
    },

    {
      "id": "dividas_altas",
      "conditions": [
        { "field": "emprestimos", "operator": "equals", "value": true },
        { "field": "valor_divida_total", "operator": "greaterThan", "value": 50000 }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "alta",
        "title": "Renegociar dívidas e reduzir juros",
        "description": "Dívidas elevadas consomem fluxo de caixa. Renegociação e antecipação podem gerar economia significativa com juros.",
        "estimatedEconomy": "30% a 50% dos juros pagos",
        "action": [
          "Mapear todas as dívidas e taxas",
          "Buscar portabilidade com juros menores",
          "Negociar desconto para quitação antecipada",
          "Priorizar dívidas com juros mais altos"
        ],
        "source": ["GESTAO-FINANCEIRA"]
      }
    },

    {
      "id": "faturamento_muito_variavel",
      "conditions": [
        { "field": "variacao_faturamento", "operator": "equals", "value": "Muito variável (variação > 50%)" }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "media",
        "title": "Estabilizar receitas e planejar sazonalidade",
        "description": "Alta variação dificulta planejamento e pode gerar ineficiências. Estratégias para estabilizar receitas podem melhorar resultados.",
        "estimatedEconomy": "Melhoria de gestão",
        "action": [
          "Analisar padrões de sazonalidade",
          "Criar produtos/serviços para meses baixos",
          "Implementar vendas recorrentes",
          "Reservar recursos dos meses bons"
        ],
        "source": ["GESTAO-COMERCIAL"]
      }
    },

    {
      "id": "expectativa_crescimento_alto",
      "conditions": [
        { "field": "expectativa_crescimento", "operator": "equals", "value": "Crescimento acima de 50%" }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "alta",
        "title": "Planejar estrutura tributária para crescimento",
        "description": "Crescimento acelerado pode levar a mudança de faixa tributária. Planejamento antecipado evita surpresas e otimiza impostos.",
        "estimatedEconomy": "Prevenção de custos futuros",
        "action": [
          "Projetar faturamento para 12-24 meses",
          "Simular impacto em diferentes regimes",
          "Planejar mudança de regime se necessário",
          "Estruturar para crescimento sustentável"
        ],
        "source": ["RFB-PLANEJAMENTO"]
      }
    },

    {
      "id": "tempo_implementacao_imediato",
      "conditions": [
        { "field": "tempo_implementacao", "operator": "equals", "value": "Imediatamente" }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "alta",
        "title": "Priorizar ações de impacto rápido",
        "description": "Com urgência de implementação, foque em mudanças que podem ser feitas imediatamente como ajuste de pró-labore e revisão de despesas.",
        "estimatedEconomy": "Ganhos em até 30 dias",
        "action": [
          "Iniciar por ajustes de pró-labore e distribuição de lucros",
          "Revisar contratos de fornecedores",
          "Implementar controles básicos",
          "Agendar consultoria tributária urgente"
        ],
        "source": ["RFB-PLANEJAMENTO"]
      }
    },

    {
      "id": "empresa_nova_crescimento",
      "conditions": [
        { "field": "tempo_atividade", "operator": "equals", "value": "Menos de 1 ano" },
        { "field": "expectativa_crescimento", "operator": "equals", "value": "Crescimento acima de 50%" }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "alta",
        "title": "Estruturar empresa desde o início",
        "description": "Empresa nova com alto potencial de crescimento deve estruturar corretamente desde o início para evitar retrabalho e custos futuros.",
        "estimatedEconomy": "Prevenção de custos de reestruturação",
        "action": [
          "Validar regime tributário escolhido",
          "Implementar controles desde o início",
          "Estabelecer processos escaláveis",
          "Contratar assessoria estratégica"
        ],
        "source": ["RFB-PLANEJAMENTO", "GESTAO-EMPRESARIAL"]
      }
    },

    {
      "id": "empresa_madura_sem_revisao",
      "conditions": [
        { "field": "tempo_atividade", "operator": "equals", "value": "Mais de 10 anos" },
        { "field": "ultima_analise_regime", "operator": "equals", "value": "Há mais de 1 ano" }
      ],
      "result": {
        "type": "oportunidade",
        "priority": "media",
        "title": "Modernizar estrutura tributária",
        "description": "Empresas consolidadas podem estar operando com estruturas defasadas. Revisão pode trazer economia e simplificação.",
        "estimatedEconomy": "5% a 15% com modernização",
        "action": [
          "Realizar diagnóstico tributário completo",
          "Avaliar mudanças na legislação desde última revisão",
          "Implementar automações e tecnologia",
          "Revisar todos os processos fiscais"
        ],
        "source": ["RFB-PLANEJAMENTO"]
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
      "title": "INSS sobre Pró-labore e Contribuição Previdenciária",
      "url": "https://www.gov.br/inss"
    },
    "RFB-DESPESAS": {
      "title": "Receita Federal – Despesas Dedutíveis",
      "url": "https://www.gov.br/receitafederal"
    },
    "RFB-DISTRIBUICAO-LUCROS": {
      "title": "Receita Federal – Distribuição de Lucros",
      "url": "https://www.gov.br/receitafederal"
    },
    "RFB-LUCRO-PRESUMIDO": {
      "title": "Receita Federal – Lucro Presumido",
      "url": "https://www.gov.br/receitafederal"
    },
    "RFB-LUCRO-REAL": {
      "title": "Receita Federal – Lucro Real",
      "url": "https://www.gov.br/receitafederal"
    },
    "RFB-PLANEJAMENTO": {
      "title": "Planejamento Tributário",
      "url": "https://www.gov.br/receitafederal"
    },
    "RFB-COMPLIANCE": {
      "title": "Compliance Tributário e Obrigações Acessórias",
      "url": "https://www.gov.br/receitafederal"
    },
    "RFB-CONTABILIDADE": {
      "title": "Normas Contábeis e Fiscais",
      "url": "https://www.gov.br/receitafederal"
    },
    "RFB-ALUGUEL": {
      "title": "Tributação de Rendimentos de Aluguel",
      "url": "https://www.gov.br/receitafederal"
    },
    "ICMS-CREDITO": {
      "title": "Créditos de ICMS - CONFAZ",
      "url": "https://www.confaz.fazenda.gov.br"
    },
    "PIS-COFINS": {
      "title": "Créditos de PIS e COFINS",
      "url": "https://www.gov.br/receitafederal"
    },
    "CFC-OBRIGACOES": {
      "title": "Conselho Federal de Contabilidade - Obrigações",
      "url": "https://cfc.org.br"
    },
    "GESTAO-FINANCEIRA": {
      "title": "Boas Práticas de Gestão Financeira Empresarial",
      "url": "https://www.sebrae.com.br"
    },
    "GESTAO-COMERCIAL": {
      "title": "Gestão Comercial e Vendas",
      "url": "https://www.sebrae.com.br"
    },
    "GESTAO-EMPRESARIAL": {
      "title": "Gestão Empresarial e Governança",
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

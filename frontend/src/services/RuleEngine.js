class RuleEngine {
  constructor(rules) {
    this.rules = rules;
  }

  evaluateCondition(condition, answers) {
    const fieldValue = answers[condition.field];
    const targetValue = condition.value;

    switch (condition.operator) {
      case 'equals':
        return fieldValue === targetValue;
      
      case 'notEquals':
        return fieldValue !== targetValue;
      
      case 'greaterThan':
        return parseFloat(fieldValue) > parseFloat(targetValue);
      
      case 'lessThan':
        return parseFloat(fieldValue) < parseFloat(targetValue);
      
      case 'greaterThanOrEqual':
        return parseFloat(fieldValue) >= parseFloat(targetValue);
      
      case 'lessThanOrEqual':
        return parseFloat(fieldValue) <= parseFloat(targetValue);
      
      case 'contains':
        return String(fieldValue).includes(String(targetValue));
      
      default:
        console.warn(`Unknown operator: ${condition.operator}`);
        return false;
    }
  }

  evaluateRule(rule, answers) {
    // All conditions must be true (AND logic)
    const allConditionsMet = rule.conditions.every(condition => 
      this.evaluateCondition(condition, answers)
    );

    if (allConditionsMet) {
      return {
        ...rule.result,
        ruleId: rule.id
      };
    }

    return null;
  }

  evaluate(answers) {
    const triggeredResults = [];

    for (const rule of this.rules) {
      const result = this.evaluateRule(rule, answers);
      if (result) {
        triggeredResults.push(result);
      }
    }

    // Sort by priority: alta > media > baixa
    const priorityOrder = { alta: 3, media: 2, baixa: 1 };
    triggeredResults.sort((a, b) => {
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    });

    return triggeredResults;
  }

  getSummary(answers, triggeredResults) {
    return {
      totalQuestionsAnswered: Object.keys(answers).length,
      totalOpportunitiesFound: triggeredResults.length,
      highPriority: triggeredResults.filter(r => r.priority === 'alta').length,
      mediumPriority: triggeredResults.filter(r => r.priority === 'media').length,
      lowPriority: triggeredResults.filter(r => r.priority === 'baixa').length,
      answers
    };
  }

  getRecommendedTools(triggeredResults, answers) {
    const toolsMap = {
      // Regime Tributário
      'regime_simples_alto_faturamento': ['comparador', 'calculadora-presumido', 'diagnostico-tributario'],
      'regime_presumido_alta_margem': ['calculadora-real', 'simulador-creditos', 'comparador'],
      'nunca_analisou_regime': ['comparador', 'diagnostico-tributario', 'guia-regimes'],
      
      // Pró-labore e Distribuição
      'pro_labore_excessivo': ['calculadora-pro-labore', 'calculadora-distribuicao-lucros'],
      'sem_distribuicao_lucros': ['calculadora-distribuicao-lucros', 'calculadora-pro-labore'],
      
      // Benefícios
      'plano_saude_pf_socios': ['calculadora-custo-funcionario'],
      'plano_saude_pj_sem_funcionarios': ['calculadora-custo-funcionario'],
      
      // Patrimônio
      'aluguel_de_socio': ['calculadora-pro-labore'],
      'muitos_veiculos_pj': ['calculadora-custo-funcionario'],
      
      // Créditos Tributários
      'credito_tributario_nao_aproveitado': ['simulador-creditos', 'calculadora-presumido', 'calculadora-real'],
      'credito_tributario_otimizar': ['simulador-creditos'],
      'fornecedores_sem_nota': ['simulador-creditos'],
      
      // Gestão Financeira
      'alto_custo_contabilidade': ['comparador', 'calculadora-margem'],
      'sem_contador': ['comparador', 'diagnostico-tributario'],
      'estoque_alto': ['calculadora-margem', 'calculadora-ponto-equilibrio'],
      'sem_controle_financeiro': ['calculadora-margem', 'historico-tributario', 'calculadora-ponto-equilibrio'],
      'sem_reserva_emergencia': ['calculadora-runway', 'simulador-crescimento'],
      'dividas_altas': ['calculadora-margem', 'calculadora-ponto-equilibrio'],
      
      // Crescimento e Planejamento
      'faturamento_muito_variavel': ['historico-tributario', 'planejador-tributario', 'simulador-cenarios'],
      'expectativa_crescimento_alto': ['planejador-tributario', 'simulador-desenquadramento', 'simulador-migracao'],
      'tempo_implementacao_imediato': ['calculadora-pro-labore', 'calculadora-distribuicao-lucros', 'calculadora-margem'],
      'empresa_nova_crescimento': ['comparador', 'diagnostico-tributario', 'simulador-crescimento'],
      'empresa_madura_sem_revisao': ['comparador', 'diagnostico-tributario', 'termometro-risco']
    };

    // Coletar ferramentas recomendadas (sem duplicatas)
    const recommendedToolIds = new Set();
    
    triggeredResults.forEach(result => {
      const tools = toolsMap[result.ruleId];
      if (tools) {
        tools.forEach(toolId => recommendedToolIds.add(toolId));
      }
    });

    // Adicionar ferramentas baseadas no contexto das respostas
    const regime = answers.regime_tributario;
    const faturamentoAnual = parseFloat(answers.faturamento_anual || 0);
    const temFuncionarios = answers.possui_funcionarios;

    // Calculadoras do regime atual
    if (regime === 'Simples Nacional') {
      recommendedToolIds.add('calculadora-das');
      recommendedToolIds.add('simulador-fator-r');
    } else if (regime === 'Lucro Presumido') {
      recommendedToolIds.add('calculadora-presumido');
    } else if (regime === 'Lucro Real') {
      recommendedToolIds.add('calculadora-real');
      recommendedToolIds.add('simulador-creditos');
    }

    // Ferramentas para empresas com funcionários
    if (temFuncionarios) {
      recommendedToolIds.add('calculadora-custo-funcionario');
      recommendedToolIds.add('calculadora-rescisao');
    }

    // Ferramentas educacionais sempre relevantes
    recommendedToolIds.add('guia-regimes');
    recommendedToolIds.add('glossario-tributario');

    return Array.from(recommendedToolIds);
  }
}

export default RuleEngine;

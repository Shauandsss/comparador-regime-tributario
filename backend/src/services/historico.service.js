/**
 * Serviço de Histórico Tributário
 * Gerencia dados mensais e gera análises
 */

import * as historicoStore from '../data/historico-store.js';

/**
 * Salvar registro mensal
 * @param {Object} dados - Dados do mês
 * @returns {Object} - Registro salvo
 */
function salvarMes(dados) {
  const {
    empresaId = 'default',
    mes,
    ano,
    faturamento,
    regime,
    tributosPagos,
    detalhamento = {}
  } = dados;

  // Validações
  if (!mes || mes < 1 || mes > 12) {
    throw new Error('Mês inválido (1-12)');
  }
  if (!ano || ano < 2000 || ano > 2100) {
    throw new Error('Ano inválido');
  }
  if (!faturamento || faturamento < 0) {
    throw new Error('Faturamento inválido');
  }
  if (!regime || !['simples', 'presumido', 'real', 'mei'].includes(regime)) {
    throw new Error('Regime inválido');
  }
  if (tributosPagos === undefined || tributosPagos < 0) {
    throw new Error('Tributos pagos inválido');
  }

  const registro = {
    mes: parseInt(mes),
    ano: parseInt(ano),
    faturamento: parseFloat(faturamento),
    regime,
    tributosPagos: parseFloat(tributosPagos),
    aliquotaEfetiva: (tributosPagos / faturamento) * 100,
    detalhamento
  };

  return historicoStore.addRegistro(empresaId, registro);
}

/**
 * Obter histórico completo
 * @param {string} empresaId - ID da empresa
 * @param {Object} filtros - Filtros opcionais
 * @returns {Object} - Histórico e estatísticas
 */
function obterHistorico(empresaId = 'default', filtros = {}) {
  let historico = historicoStore.getHistorico(empresaId);
  
  // Aplicar filtros
  if (filtros.anoInicio) {
    historico = historico.filter(r => r.ano >= filtros.anoInicio);
  }
  if (filtros.anoFim) {
    historico = historico.filter(r => r.ano <= filtros.anoFim);
  }
  if (filtros.regime) {
    historico = historico.filter(r => r.regime === filtros.regime);
  }

  const estatisticas = historicoStore.getEstatisticas(empresaId);

  // Calcular variações mês a mês
  const historicoComVariacao = historico.map((registro, index) => {
    if (index === 0) {
      return { ...registro, variacao: null };
    }
    const anterior = historico[index - 1];
    const variacaoFaturamento = ((registro.faturamento - anterior.faturamento) / anterior.faturamento) * 100;
    const variacaoTributos = ((registro.tributosPagos - anterior.tributosPagos) / anterior.tributosPagos) * 100;
    
    return {
      ...registro,
      variacao: {
        faturamento: variacaoFaturamento,
        tributos: variacaoTributos
      }
    };
  });

  // Agrupar por ano para análise
  const porAno = historico.reduce((acc, registro) => {
    if (!acc[registro.ano]) {
      acc[registro.ano] = {
        faturamento: 0,
        tributos: 0,
        meses: 0
      };
    }
    acc[registro.ano].faturamento += registro.faturamento;
    acc[registro.ano].tributos += registro.tributosPagos;
    acc[registro.ano].meses += 1;
    return acc;
  }, {});

  // Calcular tendência (regressão linear simples)
  const tendencia = calcularTendencia(historico);

  return {
    registros: historicoComVariacao,
    estatisticas,
    porAno,
    tendencia,
    totalRegistros: historico.length
  };
}

/**
 * Calcular tendência dos tributos
 * @param {Array} historico - Registros
 * @returns {Object} - Dados de tendência
 */
function calcularTendencia(historico) {
  if (historico.length < 3) {
    return null;
  }

  // Converter para sequência numérica
  const pontos = historico.map((r, i) => ({
    x: i,
    y: r.tributosPagos
  }));

  // Média de X e Y
  const mediaX = pontos.reduce((acc, p) => acc + p.x, 0) / pontos.length;
  const mediaY = pontos.reduce((acc, p) => acc + p.y, 0) / pontos.length;

  // Coeficientes da regressão linear
  let numerador = 0;
  let denominador = 0;
  
  pontos.forEach(p => {
    numerador += (p.x - mediaX) * (p.y - mediaY);
    denominador += Math.pow(p.x - mediaX, 2);
  });

  const inclinacao = denominador !== 0 ? numerador / denominador : 0;
  const intercepto = mediaY - inclinacao * mediaX;

  // Projeção para próximos 3 meses
  const projecao = [];
  for (let i = 1; i <= 3; i++) {
    const x = pontos.length + i - 1;
    projecao.push({
      mes: i,
      valorProjetado: intercepto + inclinacao * x
    });
  }

  // Determinar direção da tendência
  let direcao = 'estavel';
  if (inclinacao > mediaY * 0.02) {
    direcao = 'alta';
  } else if (inclinacao < -mediaY * 0.02) {
    direcao = 'baixa';
  }

  return {
    inclinacao,
    intercepto,
    direcao,
    projecao,
    variacaoMediaMensal: inclinacao
  };
}

/**
 * Remover registro mensal
 * @param {string} empresaId - ID da empresa
 * @param {number} mes - Mês
 * @param {number} ano - Ano
 * @returns {boolean} - Se foi removido
 */
function removerMes(empresaId = 'default', mes, ano) {
  return historicoStore.removeRegistro(empresaId, parseInt(mes), parseInt(ano));
}

/**
 * Comparar períodos
 * @param {string} empresaId - ID da empresa
 * @param {Object} periodo1 - { anoInicio, anoFim }
 * @param {Object} periodo2 - { anoInicio, anoFim }
 * @returns {Object} - Comparação
 */
function compararPeriodos(empresaId = 'default', periodo1, periodo2) {
  const historico = historicoStore.getHistorico(empresaId);

  const filtrarPeriodo = (h, p) => h.filter(r => 
    r.ano >= p.anoInicio && r.ano <= p.anoFim
  );

  const h1 = filtrarPeriodo(historico, periodo1);
  const h2 = filtrarPeriodo(historico, periodo2);

  const calcularTotais = (h) => ({
    faturamento: h.reduce((acc, r) => acc + r.faturamento, 0),
    tributos: h.reduce((acc, r) => acc + r.tributosPagos, 0),
    meses: h.length
  });

  const totais1 = calcularTotais(h1);
  const totais2 = calcularTotais(h2);

  return {
    periodo1: {
      ...periodo1,
      ...totais1,
      aliquotaMedia: totais1.faturamento > 0 
        ? (totais1.tributos / totais1.faturamento) * 100 
        : 0
    },
    periodo2: {
      ...periodo2,
      ...totais2,
      aliquotaMedia: totais2.faturamento > 0 
        ? (totais2.tributos / totais2.faturamento) * 100 
        : 0
    },
    variacao: {
      faturamento: totais1.faturamento > 0 
        ? ((totais2.faturamento - totais1.faturamento) / totais1.faturamento) * 100 
        : 0,
      tributos: totais1.tributos > 0 
        ? ((totais2.tributos - totais1.tributos) / totais1.tributos) * 100 
        : 0
    }
  };
}

/**
 * Gerar dados para gráfico
 * @param {string} empresaId - ID da empresa
 * @returns {Object} - Dados formatados para gráfico
 */
function dadosParaGrafico(empresaId = 'default') {
  const historico = historicoStore.getHistorico(empresaId);
  
  const nomesMeses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  return historico.map(r => ({
    label: `${nomesMeses[r.mes - 1]}/${r.ano}`,
    mes: r.mes,
    ano: r.ano,
    faturamento: r.faturamento,
    tributos: r.tributosPagos,
    aliquota: r.aliquotaEfetiva,
    regime: r.regime
  }));
}

export {
  salvarMes,
  obterHistorico,
  removerMes,
  compararPeriodos,
  dadosParaGrafico
};

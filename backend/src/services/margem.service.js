/**
 * Serviço de cálculo de Margem e Tributos
 * Calcula preço mínimo de venda considerando custos, despesas e tributos
 */

/**
 * Tabelas de alíquotas do Simples Nacional
 */
const tabelasSimples = {
  I: [
    { limite: 180000, aliquota: 4.0, deducao: 0 },
    { limite: 360000, aliquota: 7.3, deducao: 5940 },
    { limite: 720000, aliquota: 9.5, deducao: 13860 },
    { limite: 1800000, aliquota: 10.7, deducao: 22500 },
    { limite: 3600000, aliquota: 14.3, deducao: 87300 },
    { limite: 4800000, aliquota: 19.0, deducao: 378000 }
  ],
  II: [
    { limite: 180000, aliquota: 4.5, deducao: 0 },
    { limite: 360000, aliquota: 7.8, deducao: 5940 },
    { limite: 720000, aliquota: 10.0, deducao: 13860 },
    { limite: 1800000, aliquota: 11.2, deducao: 22500 },
    { limite: 3600000, aliquota: 14.7, deducao: 85500 },
    { limite: 4800000, aliquota: 30.0, deducao: 720000 }
  ],
  III: [
    { limite: 180000, aliquota: 6.0, deducao: 0 },
    { limite: 360000, aliquota: 11.2, deducao: 9360 },
    { limite: 720000, aliquota: 13.5, deducao: 17640 },
    { limite: 1800000, aliquota: 16.0, deducao: 35640 },
    { limite: 3600000, aliquota: 21.0, deducao: 125640 },
    { limite: 4800000, aliquota: 33.0, deducao: 648000 }
  ],
  IV: [
    { limite: 180000, aliquota: 4.5, deducao: 0 },
    { limite: 360000, aliquota: 9.0, deducao: 8100 },
    { limite: 720000, aliquota: 10.2, deducao: 12420 },
    { limite: 1800000, aliquota: 14.0, deducao: 39780 },
    { limite: 3600000, aliquota: 22.0, deducao: 183780 },
    { limite: 4800000, aliquota: 33.0, deducao: 828000 }
  ],
  V: [
    { limite: 180000, aliquota: 15.5, deducao: 0 },
    { limite: 360000, aliquota: 18.0, deducao: 4500 },
    { limite: 720000, aliquota: 19.5, deducao: 9900 },
    { limite: 1800000, aliquota: 20.5, deducao: 17100 },
    { limite: 3600000, aliquota: 23.0, deducao: 62100 },
    { limite: 4800000, aliquota: 30.5, deducao: 540000 }
  ]
};

/**
 * Calcula alíquota efetiva do Simples Nacional
 */
function calcularAliquotaSimples(rbt12, anexo) {
  const tabela = tabelasSimples[anexo];
  if (!tabela || rbt12 <= 0) return 0;

  const faixa = tabela.find(f => rbt12 <= f.limite);
  if (!faixa) return 0;

  const aliquotaEfetiva = ((rbt12 * (faixa.aliquota / 100)) - faixa.deducao) / rbt12 * 100;
  return Math.max(aliquotaEfetiva, 0);
}

/**
 * Calcula tributos do Lucro Presumido
 * @param {number} receita - Receita bruta
 * @param {string} atividade - comercio, industria, servicos, transporte_passageiros
 * @returns {object} Detalhamento dos tributos
 */
function calcularTributosPresumido(receita, atividade) {
  const presuncoes = {
    comercio: 8,
    industria: 8,
    servicos: 32,
    transporte_passageiros: 16,
    transporte_cargas: 8
  };

  const percentualPresuncao = presuncoes[atividade] || 32;
  const basePresumida = receita * (percentualPresuncao / 100);

  // IRPJ: 15% sobre base presumida + adicional 10% sobre excedente de R$ 20.000/mês
  const irpjBase = basePresumida * 0.15;
  const limiteAdicional = 20000 * 3; // Trimestral
  const adicionalIRPJ = basePresumida > limiteAdicional 
    ? (basePresumida - limiteAdicional) * 0.10 
    : 0;
  const irpj = irpjBase + adicionalIRPJ;

  // CSLL: 9% sobre base presumida (12% para serviços, 32% para atividades financeiras)
  const percentualCSLL = atividade === 'servicos' ? 32 : percentualPresuncao;
  const baseCSLL = receita * (percentualCSLL / 100);
  const csll = baseCSLL * 0.09;

  // PIS: 0.65% sobre receita (cumulativo)
  const pis = receita * 0.0065;

  // COFINS: 3% sobre receita (cumulativo)
  const cofins = receita * 0.03;

  const totalTributos = irpj + csll + pis + cofins;
  const aliquotaEfetiva = (totalTributos / receita) * 100;

  return {
    irpj,
    csll,
    pis,
    cofins,
    totalTributos,
    aliquotaEfetiva,
    percentualPresuncao
  };
}

/**
 * Calcula tributos do Lucro Real
 * @param {number} receita - Receita bruta
 * @param {number} custos - Custos totais
 * @param {number} despesas - Despesas operacionais
 * @returns {object} Detalhamento dos tributos
 */
function calcularTributosReal(receita, custos, despesas) {
  const lucroOperacional = receita - custos - despesas;
  const lucroTributavel = Math.max(lucroOperacional, 0);

  // IRPJ: 15% + adicional 10% sobre excedente de R$ 20.000/mês
  const irpjBase = lucroTributavel * 0.15;
  const limiteAdicional = 20000 * 3; // Trimestral
  const adicionalIRPJ = lucroTributavel > limiteAdicional 
    ? (lucroTributavel - limiteAdicional) * 0.10 
    : 0;
  const irpj = irpjBase + adicionalIRPJ;

  // CSLL: 9% sobre lucro
  const csll = lucroTributavel * 0.09;

  // PIS: 1.65% sobre receita (não cumulativo) - considera créditos simplificado
  const pisDebito = receita * 0.0165;
  const pisCredito = (custos + despesas) * 0.0165 * 0.5; // Estimativa 50% gera crédito
  const pis = Math.max(pisDebito - pisCredito, 0);

  // COFINS: 7.6% sobre receita (não cumulativo) - considera créditos simplificado
  const cofinsDebito = receita * 0.076;
  const cofinsCredito = (custos + despesas) * 0.076 * 0.5; // Estimativa 50% gera crédito
  const cofins = Math.max(cofinsDebito - cofinsCredito, 0);

  const totalTributos = irpj + csll + pis + cofins;
  const aliquotaEfetiva = receita > 0 ? (totalTributos / receita) * 100 : 0;

  return {
    lucroOperacional,
    lucroTributavel,
    irpj,
    csll,
    pis,
    cofins,
    totalTributos,
    aliquotaEfetiva
  };
}

/**
 * Calcula preço mínimo de venda e margem líquida
 * @param {object} params Parâmetros de entrada
 * @returns {object} Resultado do cálculo
 */
export function calcularMargemTributos(params) {
  const {
    custoUnitario,
    despesasFixasMensais,
    despesasVariaveisPercentual = 0,
    quantidadeMensal,
    regime,
    anexoSimples = 'III',
    rbt12 = 360000,
    atividadePresumido = 'servicos',
    margemDesejada = 0
  } = params;

  // Validações
  if (custoUnitario < 0 || despesasFixasMensais < 0 || quantidadeMensal <= 0) {
    throw new Error('Valores inválidos nos parâmetros');
  }

  // Custos totais mensais
  const custoTotalProdutos = custoUnitario * quantidadeMensal;
  const despesasFixasUnitaria = despesasFixasMensais / quantidadeMensal;

  // Calcular alíquota efetiva por regime
  let aliquotaTributaria = 0;
  let detalhamentoTributos = {};

  if (regime === 'simples') {
    aliquotaTributaria = calcularAliquotaSimples(rbt12, anexoSimples);
    detalhamentoTributos = {
      tipo: 'Simples Nacional',
      anexo: anexoSimples,
      rbt12,
      aliquotaEfetiva: aliquotaTributaria
    };
  } else if (regime === 'presumido') {
    // Estimar receita mensal baseada no custo (markup inicial de 2x)
    const receitaEstimada = custoTotalProdutos * 2;
    const tributos = calcularTributosPresumido(receitaEstimada, atividadePresumido);
    aliquotaTributaria = tributos.aliquotaEfetiva;
    detalhamentoTributos = {
      tipo: 'Lucro Presumido',
      atividade: atividadePresumido,
      ...tributos
    };
  } else if (regime === 'real') {
    // Estimar receita mensal baseada no custo
    const receitaEstimada = custoTotalProdutos * 2;
    const tributos = calcularTributosReal(receitaEstimada, custoTotalProdutos, despesasFixasMensais);
    aliquotaTributaria = tributos.aliquotaEfetiva;
    detalhamentoTributos = {
      tipo: 'Lucro Real',
      ...tributos
    };
  }

  // Fórmula do Markup:
  // Preço = Custo / (1 - (Tributos% + DespesasVariáveis% + Margem%) / 100)
  const percentualDespesasVariaveis = despesasVariaveisPercentual;
  const percentualTotal = aliquotaTributaria + percentualDespesasVariaveis + margemDesejada;

  if (percentualTotal >= 100) {
    throw new Error('Soma dos percentuais (tributos + despesas + margem) não pode ser >= 100%');
  }

  // Custo unitário total (produto + rateio despesas fixas)
  const custoUnitarioTotal = custoUnitario + despesasFixasUnitaria;

  // Preço mínimo (margem zero)
  const divisorMinimo = 1 - ((aliquotaTributaria + percentualDespesasVariaveis) / 100);
  const precoMinimo = custoUnitarioTotal / divisorMinimo;

  // Preço com margem desejada
  const divisorDesejado = 1 - (percentualTotal / 100);
  const precoSugerido = custoUnitarioTotal / divisorDesejado;

  // Cálculos de margem
  const receitaMensal = precoSugerido * quantidadeMensal;
  const tributosMensais = receitaMensal * (aliquotaTributaria / 100);
  const despesasVariaveisMensais = receitaMensal * (percentualDespesasVariaveis / 100);
  const lucroLiquidoMensal = receitaMensal - custoTotalProdutos - despesasFixasMensais - tributosMensais - despesasVariaveisMensais;
  const margemLiquidaReal = (lucroLiquidoMensal / receitaMensal) * 100;

  // Markup
  const markup = precoSugerido / custoUnitario;

  // Cenários alternativos
  const cenarios = [
    { margem: 10, preco: custoUnitarioTotal / (1 - ((aliquotaTributaria + percentualDespesasVariaveis + 10) / 100)) },
    { margem: 15, preco: custoUnitarioTotal / (1 - ((aliquotaTributaria + percentualDespesasVariaveis + 15) / 100)) },
    { margem: 20, preco: custoUnitarioTotal / (1 - ((aliquotaTributaria + percentualDespesasVariaveis + 20) / 100)) },
    { margem: 25, preco: custoUnitarioTotal / (1 - ((aliquotaTributaria + percentualDespesasVariaveis + 25) / 100)) },
    { margem: 30, preco: custoUnitarioTotal / (1 - ((aliquotaTributaria + percentualDespesasVariaveis + 30) / 100)) }
  ].map(c => ({
    ...c,
    markup: c.preco / custoUnitario,
    lucroUnitario: c.preco - custoUnitarioTotal - (c.preco * aliquotaTributaria / 100) - (c.preco * percentualDespesasVariaveis / 100),
    lucroMensal: (c.preco - custoUnitarioTotal - (c.preco * aliquotaTributaria / 100) - (c.preco * percentualDespesasVariaveis / 100)) * quantidadeMensal
  }));

  return {
    entrada: {
      custoUnitario,
      despesasFixasMensais,
      despesasVariaveisPercentual,
      quantidadeMensal,
      regime,
      margemDesejada
    },
    custos: {
      custoUnitario,
      despesasFixasUnitaria,
      custoUnitarioTotal
    },
    tributos: {
      aliquotaEfetiva: aliquotaTributaria,
      detalhamento: detalhamentoTributos
    },
    precos: {
      precoMinimo,
      precoSugerido,
      markup
    },
    resultado: {
      receitaMensal,
      custoTotalProdutos,
      despesasFixasMensais,
      despesasVariaveisMensais,
      tributosMensais,
      lucroLiquidoMensal,
      margemLiquidaReal
    },
    cenarios
  };
}

/**
 * Compara margens entre diferentes regimes tributários
 */
export function compararRegimes(params) {
  const regimes = ['simples', 'presumido', 'real'];
  const resultados = {};

  regimes.forEach(regime => {
    try {
      resultados[regime] = calcularMargemTributos({
        ...params,
        regime
      });
    } catch (error) {
      resultados[regime] = { erro: error.message };
    }
  });

  // Determinar melhor regime
  const validos = Object.entries(resultados)
    .filter(([, r]) => !r.erro)
    .sort((a, b) => b[1].resultado.lucroLiquidoMensal - a[1].resultado.lucroLiquidoMensal);

  return {
    resultados,
    melhorRegime: validos[0]?.[0] || null,
    economia: validos.length >= 2 
      ? validos[0][1].resultado.lucroLiquidoMensal - validos[validos.length - 1][1].resultado.lucroLiquidoMensal
      : 0
  };
}

export default {
  calcularMargemTributos,
  compararRegimes
};

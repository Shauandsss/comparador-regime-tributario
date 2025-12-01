/**
 * Service para cálculo de IRPJ/CSLL no Lucro Presumido
 * Baseado nas regras da Receita Federal
 */

// Percentuais de presunção por tipo de atividade
const PRESUNCAO_LUCRO = {
  // Comércio e Indústria
  comercio: {
    nome: 'Comércio e Indústria',
    irpj: 8,
    csll: 12,
    descricao: 'Revenda de mercadorias, produtos industrializados'
  },
  // Serviços em geral
  servicos: {
    nome: 'Serviços em Geral',
    irpj: 32,
    csll: 32,
    descricao: 'Prestação de serviços em geral'
  },
  // Serviços específicos (transporte, etc)
  servicos_especificos: {
    nome: 'Serviços Específicos',
    irpj: 16,
    csll: 32,
    descricao: 'Transporte de cargas, serviços hospitalares, construção'
  },
  // Serviços profissionais
  servicos_profissionais: {
    nome: 'Serviços Profissionais',
    irpj: 32,
    csll: 32,
    descricao: 'Medicina, engenharia, advocacia, contabilidade, consultoria'
  },
  // Intermediação de negócios
  intermediacao: {
    nome: 'Intermediação de Negócios',
    irpj: 32,
    csll: 32,
    descricao: 'Corretagem, representação comercial, agenciamento'
  }
};

// Alíquotas dos tributos
const ALIQUOTAS = {
  irpj: {
    base: 15,
    adicional: 10,
    limiteAdicional: 20000 // R$ 20.000 trimestral ou mensal
  },
  csll: {
    aliquota: 9
  },
  pis: {
    cumulativo: 0.65
  },
  cofins: {
    cumulativo: 3.00
  },
  iss: {
    minimo: 2,
    maximo: 5,
    padrao: 3 // Varia por município
  },
  icms: {
    padrao: 0 // Varia por estado e atividade
  }
};

/**
 * Calcula IRPJ (Imposto de Renda Pessoa Jurídica)
 * @param {number} receitaBruta - Receita bruta do período
 * @param {number} percentualPresuncao - % de presunção
 * @returns {Object} - Detalhamento do IRPJ
 */
function calcularIRPJ(receitaBruta, percentualPresuncao) {
  // Base de cálculo = Receita x % Presunção
  const baseCalculo = receitaBruta * (percentualPresuncao / 100);
  
  // IRPJ = 15% sobre base de cálculo
  const irpjBase = baseCalculo * (ALIQUOTAS.irpj.base / 100);
  
  // Adicional de 10% sobre o que exceder R$ 20.000/mês ou R$ 60.000/trimestre
  let adicional = 0;
  const excedente = baseCalculo - ALIQUOTAS.irpj.limiteAdicional;
  if (excedente > 0) {
    adicional = excedente * (ALIQUOTAS.irpj.adicional / 100);
  }
  
  const irpjTotal = irpjBase + adicional;
  
  return {
    baseCalculo,
    baseCalculoFormatado: formatarMoeda(baseCalculo),
    aliquotaBase: ALIQUOTAS.irpj.base + '%',
    irpjBase,
    irpjBaseFormatado: formatarMoeda(irpjBase),
    adicional,
    adicionalFormatado: formatarMoeda(adicional),
    excedente: excedente > 0 ? excedente : 0,
    excedenteFormatado: formatarMoeda(excedente > 0 ? excedente : 0),
    irpjTotal,
    irpjTotalFormatado: formatarMoeda(irpjTotal),
    aliquotaEfetiva: ((irpjTotal / receitaBruta) * 100).toFixed(2) + '%'
  };
}

/**
 * Calcula CSLL (Contribuição Social sobre Lucro Líquido)
 * @param {number} receitaBruta - Receita bruta do período
 * @param {number} percentualPresuncao - % de presunção
 * @returns {Object} - Detalhamento da CSLL
 */
function calcularCSLL(receitaBruta, percentualPresuncao) {
  // Base de cálculo = Receita x % Presunção
  const baseCalculo = receitaBruta * (percentualPresuncao / 100);
  
  // CSLL = 9% sobre base de cálculo
  const csll = baseCalculo * (ALIQUOTAS.csll.aliquota / 100);
  
  return {
    baseCalculo,
    baseCalculoFormatado: formatarMoeda(baseCalculo),
    aliquota: ALIQUOTAS.csll.aliquota + '%',
    csll,
    csllFormatado: formatarMoeda(csll),
    aliquotaEfetiva: ((csll / receitaBruta) * 100).toFixed(2) + '%'
  };
}

/**
 * Calcula PIS (Programa de Integração Social) - Regime Cumulativo
 * @param {number} receitaBruta - Receita bruta do período
 * @returns {Object} - Detalhamento do PIS
 */
function calcularPIS(receitaBruta) {
  const pis = receitaBruta * (ALIQUOTAS.pis.cumulativo / 100);
  
  return {
    aliquota: ALIQUOTAS.pis.cumulativo + '%',
    regime: 'Cumulativo',
    pis,
    pisFormatado: formatarMoeda(pis)
  };
}

/**
 * Calcula COFINS (Contribuição para Financiamento da Seguridade Social) - Regime Cumulativo
 * @param {number} receitaBruta - Receita bruta do período
 * @returns {Object} - Detalhamento do COFINS
 */
function calcularCOFINS(receitaBruta) {
  const cofins = receitaBruta * (ALIQUOTAS.cofins.cumulativo / 100);
  
  return {
    aliquota: ALIQUOTAS.cofins.cumulativo + '%',
    regime: 'Cumulativo',
    cofins,
    cofinsFormatado: formatarMoeda(cofins)
  };
}

/**
 * Calcula ISS (Imposto Sobre Serviços) - opcional
 * @param {number} receitaBruta - Receita bruta do período
 * @param {number} aliquotaISS - Alíquota do município (2% a 5%)
 * @returns {Object} - Detalhamento do ISS
 */
function calcularISS(receitaBruta, aliquotaISS = 0) {
  if (aliquotaISS === 0) {
    return {
      aliquota: '0%',
      iss: 0,
      issFormatado: formatarMoeda(0),
      observacao: 'ISS não aplicável para esta atividade'
    };
  }
  
  const iss = receitaBruta * (aliquotaISS / 100);
  
  return {
    aliquota: aliquotaISS + '%',
    iss,
    issFormatado: formatarMoeda(iss),
    observacao: 'Alíquota varia conforme município'
  };
}

/**
 * Serviço principal: Calcula todos os tributos do Lucro Presumido
 * @param {Object} dados - { receita, atividade, pis, cofins, iss }
 * @returns {Object} - Resultado completo
 */
export function calcularLucroPresumido(dados) {
  const { receita, atividade, periodo = 'trimestral', aliquotaISS = 0 } = dados;
  
  // Validações
  if (!receita || receita <= 0) {
    throw new Error('Receita é obrigatória e deve ser maior que zero');
  }
  
  if (!atividade || !PRESUNCAO_LUCRO[atividade]) {
    throw new Error('Atividade inválida');
  }
  
  // Buscar percentuais de presunção
  const presuncao = PRESUNCAO_LUCRO[atividade];
  
  // Calcular cada tributo
  const irpj = calcularIRPJ(receita, presuncao.irpj);
  const csll = calcularCSLL(receita, presuncao.csll);
  const pis = calcularPIS(receita);
  const cofins = calcularCOFINS(receita);
  const iss = calcularISS(receita, aliquotaISS);
  
  // Totalizadores
  const totalTributos = irpj.irpjTotal + csll.csll + pis.pis + cofins.cofins + iss.iss;
  const cargaTributaria = (totalTributos / receita) * 100;
  const lucroPesumdio = irpj.baseCalculo; // Base de cálculo representa o lucro presumido
  const lucroLiquido = lucroPesumdio - irpj.irpjTotal - csll.csll;
  
  return {
    sucesso: true,
    entrada: {
      receita,
      receitaFormatada: formatarMoeda(receita),
      atividade: presuncao.nome,
      descricaoAtividade: presuncao.descricao,
      periodo: periodo === 'trimestral' ? 'Trimestral' : 'Mensal',
      aliquotaISS: aliquotaISS + '%'
    },
    presuncao: {
      irpj: presuncao.irpj + '%',
      csll: presuncao.csll + '%',
      observacao: 'Percentuais de presunção conforme atividade'
    },
    tributos: {
      irpj,
      csll,
      pis,
      cofins,
      iss
    },
    resumo: {
      lucroPesumdio,
      lucroPresumidoFormatado: formatarMoeda(lucroPesumdio),
      lucroLiquido,
      lucroLiquidoFormatado: formatarMoeda(lucroLiquido),
      totalTributos,
      totalTributosFormatado: formatarMoeda(totalTributos),
      cargaTributaria: cargaTributaria.toFixed(2) + '%',
      cargaTributariaDecimal: cargaTributaria,
      receitaLiquida: receita - totalTributos,
      receitaLiquidaFormatada: formatarMoeda(receita - totalTributos)
    },
    detalhamento: {
      tributosPorTipo: [
        { nome: 'IRPJ', valor: irpj.irpjTotal, percentual: ((irpj.irpjTotal / receita) * 100).toFixed(2) },
        { nome: 'CSLL', valor: csll.csll, percentual: ((csll.csll / receita) * 100).toFixed(2) },
        { nome: 'PIS', valor: pis.pis, percentual: ((pis.pis / receita) * 100).toFixed(2) },
        { nome: 'COFINS', valor: cofins.cofins, percentual: ((cofins.cofins / receita) * 100).toFixed(2) },
        { nome: 'ISS', valor: iss.iss, percentual: ((iss.iss / receita) * 100).toFixed(2) }
      ],
      observacoes: [
        'PIS e COFINS no regime cumulativo (sem direito a créditos)',
        'IRPJ e CSLL calculados sobre base presumida',
        periodo === 'trimestral' 
          ? 'Recolhimento trimestral (mar, jun, set, dez)'
          : 'Recolhimento mensal com base na receita mensal',
        'ISS varia conforme município (2% a 5%)'
      ]
    }
  };
}

/**
 * Retorna lista de atividades disponíveis
 */
export function listarAtividades() {
  return Object.keys(PRESUNCAO_LUCRO).map(key => ({
    id: key,
    nome: PRESUNCAO_LUCRO[key].nome,
    descricao: PRESUNCAO_LUCRO[key].descricao,
    presuncaoIRPJ: PRESUNCAO_LUCRO[key].irpj + '%',
    presuncaoCSLL: PRESUNCAO_LUCRO[key].csll + '%'
  }));
}

/**
 * Formata valor em moeda brasileira
 */
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

export default {
  calcularLucroPresumido,
  listarAtividades
};

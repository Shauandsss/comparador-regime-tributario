/**
 * Service para cálculo do Lucro Real Simplificado
 * Baseado no lucro contábil efetivo da empresa
 */

// Alíquotas dos tributos no Lucro Real
const ALIQUOTAS = {
  irpj: {
    base: 15,
    adicional: 10,
    limiteAdicional: 20000 // R$ 20.000 mensal ou R$ 60.000 trimestral
  },
  csll: {
    aliquota: 9
  },
  pis: {
    naoCumulativo: 1.65
  },
  cofins: {
    naoCumulativo: 7.60
  }
};

/**
 * Calcula IRPJ (Imposto de Renda Pessoa Jurídica)
 * @param {number} lucroContabil - Lucro contábil do período
 * @returns {Object} - Detalhamento do IRPJ
 */
function calcularIRPJ(lucroContabil) {
  if (lucroContabil <= 0) {
    return {
      lucroContabil,
      lucroContabilFormatado: formatarMoeda(lucroContabil),
      baseCalculo: 0,
      baseCalculoFormatada: formatarMoeda(0),
      irpjBase: 0,
      irpjBaseFormatado: formatarMoeda(0),
      adicional: 0,
      adicionalFormatado: formatarMoeda(0),
      irpjTotal: 0,
      irpjTotalFormatado: formatarMoeda(0),
      prejuizo: true,
      prejuizoFormatado: formatarMoeda(Math.abs(lucroContabil))
    };
  }
  
  // Base de cálculo = Lucro Contábil (pode ter ajustes)
  const baseCalculo = lucroContabil;
  
  // IRPJ = 15% sobre base de cálculo
  const irpjBase = baseCalculo * (ALIQUOTAS.irpj.base / 100);
  
  // Adicional de 10% sobre o que exceder R$ 20.000/mês
  let adicional = 0;
  const excedente = baseCalculo - ALIQUOTAS.irpj.limiteAdicional;
  if (excedente > 0) {
    adicional = excedente * (ALIQUOTAS.irpj.adicional / 100);
  }
  
  const irpjTotal = irpjBase + adicional;
  
  return {
    lucroContabil,
    lucroContabilFormatado: formatarMoeda(lucroContabil),
    baseCalculo,
    baseCalculoFormatada: formatarMoeda(baseCalculo),
    aliquotaBase: ALIQUOTAS.irpj.base + '%',
    irpjBase,
    irpjBaseFormatado: formatarMoeda(irpjBase),
    adicional,
    adicionalFormatado: formatarMoeda(adicional),
    excedente: excedente > 0 ? excedente : 0,
    excedenteFormatado: formatarMoeda(excedente > 0 ? excedente : 0),
    irpjTotal,
    irpjTotalFormatado: formatarMoeda(irpjTotal),
    prejuizo: false
  };
}

/**
 * Calcula CSLL (Contribuição Social sobre Lucro Líquido)
 * @param {number} lucroContabil - Lucro contábil do período
 * @returns {Object} - Detalhamento da CSLL
 */
function calcularCSLL(lucroContabil) {
  if (lucroContabil <= 0) {
    return {
      baseCalculo: 0,
      baseCalculoFormatada: formatarMoeda(0),
      aliquota: ALIQUOTAS.csll.aliquota + '%',
      csll: 0,
      csllFormatada: formatarMoeda(0),
      prejuizo: true
    };
  }
  
  // Base de cálculo = Lucro Contábil (pode ter ajustes)
  const baseCalculo = lucroContabil;
  
  // CSLL = 9% sobre base de cálculo
  const csll = baseCalculo * (ALIQUOTAS.csll.aliquota / 100);
  
  return {
    baseCalculo,
    baseCalculoFormatada: formatarMoeda(baseCalculo),
    aliquota: ALIQUOTAS.csll.aliquota + '%',
    csll,
    csllFormatada: formatarMoeda(csll),
    prejuizo: false
  };
}

/**
 * Calcula PIS não-cumulativo com créditos
 * @param {number} receita - Receita bruta do período
 * @param {number} creditos - Créditos de PIS permitidos
 * @returns {Object} - Detalhamento do PIS
 */
function calcularPIS(receita, creditos = 0) {
  const pisDebito = receita * (ALIQUOTAS.pis.naoCumulativo / 100);
  const pisAPagar = Math.max(0, pisDebito - creditos);
  
  return {
    receita,
    receitaFormatada: formatarMoeda(receita),
    aliquota: ALIQUOTAS.pis.naoCumulativo + '%',
    regime: 'Não Cumulativo',
    pisDebito,
    pisDebitoFormatado: formatarMoeda(pisDebito),
    creditos,
    creditosFormatados: formatarMoeda(creditos),
    pisAPagar,
    pisAPagarFormatado: formatarMoeda(pisAPagar),
    aliquotaEfetiva: ((pisAPagar / receita) * 100).toFixed(2) + '%'
  };
}

/**
 * Calcula COFINS não-cumulativo com créditos
 * @param {number} receita - Receita bruta do período
 * @param {number} creditos - Créditos de COFINS permitidos
 * @returns {Object} - Detalhamento do COFINS
 */
function calcularCOFINS(receita, creditos = 0) {
  const cofinsDebito = receita * (ALIQUOTAS.cofins.naoCumulativo / 100);
  const cofinsAPagar = Math.max(0, cofinsDebito - creditos);
  
  return {
    receita,
    receitaFormatada: formatarMoeda(receita),
    aliquota: ALIQUOTAS.cofins.naoCumulativo + '%',
    regime: 'Não Cumulativo',
    cofinsDebito,
    cofinsDebitoFormatado: formatarMoeda(cofinsDebito),
    creditos,
    creditosFormatados: formatarMoeda(creditos),
    cofinsAPagar,
    cofinsAPagarFormatado: formatarMoeda(cofinsAPagar),
    aliquotaEfetiva: ((cofinsAPagar / receita) * 100).toFixed(2) + '%'
  };
}

/**
 * Calcula o Lucro Real e todos os tributos
 * @param {Object} dados - { receita, despesas, folha, creditosPis, creditosCofins }
 * @returns {Object} - Resultado completo
 */
export function calcularLucroReal(dados) {
  const { 
    receita, 
    despesas, 
    folha = 0,
    creditosPis = 0, 
    creditosCofins = 0,
    periodo = 'trimestral'
  } = dados;
  
  // Validações
  if (!receita || receita <= 0) {
    throw new Error('Receita é obrigatória e deve ser maior que zero');
  }
  
  if (despesas < 0 || folha < 0) {
    throw new Error('Despesas e folha não podem ser negativas');
  }
  
  // Calcular lucro contábil
  const lucroContabil = receita - despesas - folha;
  
  // Calcular cada tributo
  const irpj = calcularIRPJ(lucroContabil);
  const csll = calcularCSLL(lucroContabil);
  const pis = calcularPIS(receita, creditosPis);
  const cofins = calcularCOFINS(receita, creditosCofins);
  
  // Totalizadores
  const totalTributos = irpj.irpjTotal + csll.csll + pis.pisAPagar + cofins.cofinsAPagar;
  const cargaTributaria = receita > 0 ? (totalTributos / receita) * 100 : 0;
  const lucroLiquido = lucroContabil - irpj.irpjTotal - csll.csll;
  const receitaLiquida = receita - totalTributos;
  
  // Economia com créditos
  const economiaCreditos = creditosPis + creditosCofins;
  const cargaSemCreditos = receita > 0 ? ((totalTributos + economiaCreditos) / receita) * 100 : 0;
  
  return {
    sucesso: true,
    entrada: {
      receita,
      receitaFormatada: formatarMoeda(receita),
      despesas,
      despesasFormatadas: formatarMoeda(despesas),
      folha,
      folhaFormatada: formatarMoeda(folha),
      periodo: periodo === 'trimestral' ? 'Trimestral' : 'Anual',
      creditosPis,
      creditosPisFormatados: formatarMoeda(creditosPis),
      creditosCofins,
      creditosCofinsFormatados: formatarMoeda(creditosCofins)
    },
    apuracao: {
      lucroContabil,
      lucroContabilFormatado: formatarMoeda(lucroContabil),
      lucroLiquido,
      lucroLiquidoFormatado: formatarMoeda(lucroLiquido),
      temPrejuizo: lucroContabil <= 0,
      percentualLucro: receita > 0 ? ((lucroContabil / receita) * 100).toFixed(2) + '%' : '0%'
    },
    tributos: {
      irpj,
      csll,
      pis,
      cofins
    },
    resumo: {
      totalTributos,
      totalTributosFormatado: formatarMoeda(totalTributos),
      cargaTributaria: cargaTributaria.toFixed(2) + '%',
      cargaTributariaDecimal: cargaTributaria,
      receitaLiquida,
      receitaLiquidaFormatada: formatarMoeda(receitaLiquida),
      economiaCreditos,
      economiaCreditosFormatada: formatarMoeda(economiaCreditos),
      cargaSemCreditos: cargaSemCreditos.toFixed(2) + '%'
    },
    detalhamento: {
      tributosPorTipo: [
        { nome: 'IRPJ', valor: irpj.irpjTotal, percentual: receita > 0 ? ((irpj.irpjTotal / receita) * 100).toFixed(2) : '0' },
        { nome: 'CSLL', valor: csll.csll, percentual: receita > 0 ? ((csll.csll / receita) * 100).toFixed(2) : '0' },
        { nome: 'PIS', valor: pis.pisAPagar, percentual: receita > 0 ? ((pis.pisAPagar / receita) * 100).toFixed(2) : '0' },
        { nome: 'COFINS', valor: cofins.cofinsAPagar, percentual: receita > 0 ? ((cofins.cofinsAPagar / receita) * 100).toFixed(2) : '0' }
      ],
      observacoes: [
        'PIS e COFINS no regime não-cumulativo (com direito a créditos)',
        'IRPJ e CSLL calculados sobre o lucro contábil real',
        'Prejuízos fiscais podem ser compensados em períodos futuros',
        periodo === 'trimestral' 
          ? 'Apuração trimestral (mar, jun, set, dez)'
          : 'Apuração anual com ajustes no LALUR',
        lucroContabil <= 0 ? '⚠️ Empresa em prejuízo - não há IRPJ e CSLL a pagar' : ''
      ].filter(obs => obs)
    },
    vantagens: {
      creditosPisCofins: economiaCreditos > 0,
      compensacaoPrejuizos: lucroContabil <= 0,
      menorCargaSeMargemBaixa: true,
      descricao: lucroContabil <= 0 
        ? 'Regime ideal para empresas com prejuízo ou margem baixa'
        : economiaCreditos > 0
        ? 'Economia significativa com créditos de PIS/COFINS'
        : 'Tributação sobre lucro efetivo'
    }
  };
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
  calcularLucroReal
};

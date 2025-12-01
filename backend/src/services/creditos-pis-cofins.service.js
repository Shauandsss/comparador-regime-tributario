/**
 * Service para cálculo de créditos PIS/COFINS
 * Regime Não-Cumulativo
 */

// Percentuais de crédito por tipo de despesa
const PERCENTUAIS_CREDITO = {
  insumos: {
    pis: 1.65,
    cofins: 7.60,
    descricao: 'Insumos utilizados na produção ou fabricação'
  },
  energia: {
    pis: 1.65,
    cofins: 7.60,
    descricao: 'Energia elétrica consumida no estabelecimento'
  },
  aluguel: {
    pis: 1.65,
    cofins: 7.60,
    descricao: 'Aluguéis de prédios, máquinas e equipamentos'
  },
  frete: {
    pis: 1.65,
    cofins: 7.60,
    descricao: 'Fretes na operação de venda'
  },
  armazenagem: {
    pis: 1.65,
    cofins: 7.60,
    descricao: 'Armazenagem de mercadoria e frete'
  },
  encargosDepreciacao: {
    pis: 1.65,
    cofins: 7.60,
    descricao: 'Depreciação de máquinas, equipamentos e imóveis'
  },
  bensVendidos: {
    pis: 1.65,
    cofins: 7.60,
    descricao: 'Bens adquiridos para revenda'
  },
  devolucoesVendas: {
    pis: 1.65,
    cofins: 7.60,
    descricao: 'Devoluções de vendas'
  }
};

/**
 * Calcula créditos de PIS/COFINS para cada tipo de despesa
 * @param {Object} despesas - Objeto com valores das despesas
 * @returns {Object} - Detalhamento dos créditos
 */
export function calcularCreditos(despesas) {
  const {
    insumos = 0,
    energia = 0,
    aluguel = 0,
    frete = 0,
    armazenagem = 0,
    encargosDepreciacao = 0,
    bensVendidos = 0,
    devolucoesVendas = 0
  } = despesas;
  
  // Validações
  const valores = [insumos, energia, aluguel, frete, armazenagem, encargosDepreciacao, bensVendidos, devolucoesVendas];
  if (valores.some(v => v < 0)) {
    throw new Error('Os valores das despesas não podem ser negativos');
  }
  
  const totalDespesas = valores.reduce((acc, val) => acc + val, 0);
  
  if (totalDespesas === 0) {
    throw new Error('Informe pelo menos uma despesa para calcular os créditos');
  }
  
  // Calcular créditos por categoria
  const creditosPorCategoria = [];
  let totalCreditosPis = 0;
  let totalCreditosCofins = 0;
  
  Object.keys(PERCENTUAIS_CREDITO).forEach(categoria => {
    const valorDespesa = despesas[categoria] || 0;
    
    if (valorDespesa > 0) {
      const creditoPis = valorDespesa * (PERCENTUAIS_CREDITO[categoria].pis / 100);
      const creditoCofins = valorDespesa * (PERCENTUAIS_CREDITO[categoria].cofins / 100);
      const totalCredito = creditoPis + creditoCofins;
      
      totalCreditosPis += creditoPis;
      totalCreditosCofins += creditoCofins;
      
      creditosPorCategoria.push({
        categoria,
        nome: getNomeCategoria(categoria),
        descricao: PERCENTUAIS_CREDITO[categoria].descricao,
        valorDespesa,
        valorDespesaFormatado: formatarMoeda(valorDespesa),
        percentualPis: PERCENTUAIS_CREDITO[categoria].pis + '%',
        percentualCofins: PERCENTUAIS_CREDITO[categoria].cofins + '%',
        creditoPis,
        creditoPisFormatado: formatarMoeda(creditoPis),
        creditoCofins,
        creditoCofinsFormatado: formatarMoeda(creditoCofins),
        totalCredito,
        totalCreditoFormatado: formatarMoeda(totalCredito),
        percentualDoTotal: ((totalCredito / (totalCreditosPis + totalCreditosCofins)) * 100).toFixed(2) + '%'
      });
    }
  });
  
  const totalCreditos = totalCreditosPis + totalCreditosCofins;
  
  // Calcular economia versus regime cumulativo
  // No cumulativo: PIS 0,65% + COFINS 3% = 3,65% sobre receita
  // No não-cumulativo: PIS 1,65% + COFINS 7,6% = 9,25% sobre receita, mas com créditos
  
  return {
    sucesso: true,
    entrada: {
      totalDespesas,
      totalDespesasFormatado: formatarMoeda(totalDespesas),
      quantidadeCategorias: creditosPorCategoria.length
    },
    creditos: {
      pis: {
        total: totalCreditosPis,
        totalFormatado: formatarMoeda(totalCreditosPis),
        aliquota: '1,65%',
        descricao: 'Crédito de PIS (Regime Não-Cumulativo)'
      },
      cofins: {
        total: totalCreditosCofins,
        totalFormatado: formatarMoeda(totalCreditosCofins),
        aliquota: '7,6%',
        descricao: 'Crédito de COFINS (Regime Não-Cumulativo)'
      },
      total: totalCreditos,
      totalFormatado: formatarMoeda(totalCreditos)
    },
    detalhamento: creditosPorCategoria,
    comparacao: {
      despesasTotais: totalDespesas,
      despesasTotaisFormatadas: formatarMoeda(totalDespesas),
      creditosGerados: totalCreditos,
      creditosGeradosFormatados: formatarMoeda(totalCreditos),
      percentualAproveitamento: ((totalCreditos / totalDespesas) * 100).toFixed(2) + '%',
      economia: totalCreditos,
      economiaFormatada: formatarMoeda(totalCreditos)
    },
    simulacao: {
      observacao: 'Estes créditos reduzem o valor a pagar de PIS/COFINS no regime não-cumulativo',
      requisitos: [
        'Regime de Lucro Real obrigatório',
        'Despesas devem estar devidamente documentadas',
        'Créditos somente sobre despesas permitidas pela legislação',
        'Escrituração fiscal digital (EFD-Contribuições) obrigatória'
      ]
    }
  };
}

/**
 * Simula economia comparando com e sem créditos
 * @param {number} receitaBruta - Receita bruta do período
 * @param {Object} despesas - Despesas que geram créditos
 * @returns {Object} - Comparação detalhada
 */
export function simularEconomia(receitaBruta, despesas) {
  if (!receitaBruta || receitaBruta <= 0) {
    throw new Error('Receita bruta é obrigatória e deve ser maior que zero');
  }
  
  const resultadoCreditos = calcularCreditos(despesas);
  
  // Cálculo SEM créditos (débito pleno)
  const pisDebito = receitaBruta * 0.0165; // 1,65%
  const cofinsDebito = receitaBruta * 0.076; // 7,6%
  const totalDebitoSemCredito = pisDebito + cofinsDebito;
  
  // Cálculo COM créditos
  const pisComCredito = Math.max(0, pisDebito - resultadoCreditos.creditos.pis.total);
  const cofinsComCredito = Math.max(0, cofinsDebito - resultadoCreditos.creditos.cofins.total);
  const totalDebitoComCredito = pisComCredito + cofinsComCredito;
  
  const economia = totalDebitoSemCredito - totalDebitoComCredito;
  const percentualEconomia = (economia / totalDebitoSemCredito) * 100;
  
  return {
    sucesso: true,
    receita: {
      valor: receitaBruta,
      valorFormatado: formatarMoeda(receitaBruta)
    },
    semCreditos: {
      pisDebito,
      pisDebitoFormatado: formatarMoeda(pisDebito),
      cofinsDebito,
      cofinsDebitoFormatado: formatarMoeda(cofinsDebito),
      total: totalDebitoSemCredito,
      totalFormatado: formatarMoeda(totalDebitoSemCredito),
      cargaTributaria: ((totalDebitoSemCredito / receitaBruta) * 100).toFixed(2) + '%'
    },
    comCreditos: {
      pisDebito,
      pisDebitoFormatado: formatarMoeda(pisDebito),
      creditosPis: resultadoCreditos.creditos.pis.total,
      creditosPisFormatado: resultadoCreditos.creditos.pis.totalFormatado,
      pisAPagar: pisComCredito,
      pisAPagarFormatado: formatarMoeda(pisComCredito),
      
      cofinsDebito,
      cofinsDebitoFormatado: formatarMoeda(cofinsDebito),
      creditosCofins: resultadoCreditos.creditos.cofins.total,
      creditosCofinsFormatado: resultadoCreditos.creditos.cofins.totalFormatado,
      cofinsAPagar: cofinsComCredito,
      cofinsAPagarFormatado: formatarMoeda(cofinsComCredito),
      
      total: totalDebitoComCredito,
      totalFormatado: formatarMoeda(totalDebitoComCredito),
      cargaTributaria: ((totalDebitoComCredito / receitaBruta) * 100).toFixed(2) + '%'
    },
    economia: {
      valor: economia,
      valorFormatado: formatarMoeda(economia),
      percentual: percentualEconomia.toFixed(2) + '%',
      economiaAnual: economia * 12,
      economiaAnualFormatada: formatarMoeda(economia * 12)
    },
    detalhamentoCreditos: resultadoCreditos
  };
}

/**
 * Retorna nome amigável da categoria
 */
function getNomeCategoria(categoria) {
  const nomes = {
    insumos: 'Insumos',
    energia: 'Energia Elétrica',
    aluguel: 'Aluguéis',
    frete: 'Fretes',
    armazenagem: 'Armazenagem',
    encargosDepreciacao: 'Depreciação',
    bensVendidos: 'Bens para Revenda',
    devolucoesVendas: 'Devoluções'
  };
  return nomes[categoria] || categoria;
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
  calcularCreditos,
  simularEconomia
};

/**
 * Cálculos Tributários - Versão Client-Side
 * Toda a lógica de cálculo roda no navegador, sem necessidade de backend
 */

// ============================================
// SIMPLES NACIONAL
// ============================================

const ANEXO_I_COMERCIO = {
  faixas: [
    { ate: 180000, aliquota: 4.0, deducao: 0 },
    { ate: 360000, aliquota: 7.3, deducao: 5940 },
    { ate: 720000, aliquota: 9.5, deducao: 13860 },
    { ate: 1800000, aliquota: 10.7, deducao: 22500 },
    { ate: 3600000, aliquota: 14.3, deducao: 87300 },
    { ate: 4800000, aliquota: 19.0, deducao: 378000 }
  ]
};

const ANEXO_II_INDUSTRIA = {
  faixas: [
    { ate: 180000, aliquota: 4.5, deducao: 0 },
    { ate: 360000, aliquota: 7.8, deducao: 5940 },
    { ate: 720000, aliquota: 10.0, deducao: 13860 },
    { ate: 1800000, aliquota: 11.2, deducao: 22500 },
    { ate: 3600000, aliquota: 14.7, deducao: 85500 },
    { ate: 4800000, aliquota: 30.0, deducao: 720000 }
  ]
};

const ANEXO_III_SERVICOS = {
  faixas: [
    { ate: 180000, aliquota: 6.0, deducao: 0 },
    { ate: 360000, aliquota: 11.2, deducao: 9360 },
    { ate: 720000, aliquota: 13.5, deducao: 17640 },
    { ate: 1800000, aliquota: 16.0, deducao: 35640 },
    { ate: 3600000, aliquota: 21.0, deducao: 125640 },
    { ate: 4800000, aliquota: 33.0, deducao: 648000 }
  ]
};

const calcularAliquotaEfetiva = (rbt12, faixas) => {
  let faixaEncontrada = faixas[faixas.length - 1];
  
  for (const faixa of faixas) {
    if (rbt12 <= faixa.ate) {
      faixaEncontrada = faixa;
      break;
    }
  }
  
  const aliquotaNominal = faixaEncontrada.aliquota;
  const deducao = faixaEncontrada.deducao;
  const aliquotaEfetiva = ((rbt12 * (aliquotaNominal / 100)) - deducao) / rbt12 * 100;
  
  return {
    aliquotaNominal,
    deducao,
    aliquotaEfetiva: Math.max(0, aliquotaEfetiva)
  };
};

export const calcularSimples = (data) => {
  const rbt12 = parseFloat(data.rbt12) || 0;
  const atividade = data.atividade;
  const folha = parseFloat(data.folha) || 0;

  let resultado;
  let anexo;

  switch (atividade) {
    case 'comercio':
      resultado = calcularAliquotaEfetiva(rbt12, ANEXO_I_COMERCIO.faixas);
      anexo = 'Anexo I (Comércio)';
      break;
    case 'industria':
      resultado = calcularAliquotaEfetiva(rbt12, ANEXO_II_INDUSTRIA.faixas);
      anexo = 'Anexo II (Indústria)';
      break;
    case 'servico':
      resultado = calcularAliquotaEfetiva(rbt12, ANEXO_III_SERVICOS.faixas);
      anexo = 'Anexo III (Serviços)';
      break;
    default:
      throw new Error(`Atividade "${atividade}" não encontrada`);
  }

  const { aliquotaNominal, deducao, aliquotaEfetiva } = resultado;
  const impostoTotal = rbt12 * (aliquotaEfetiva / 100);

  return {
    regime: 'Simples Nacional',
    rbt12: parseFloat(rbt12.toFixed(2)),
    atividade,
    folha: parseFloat(folha.toFixed(2)),
    anexo,
    aliquotaNominal: parseFloat(aliquotaNominal.toFixed(2)),
    deducao: parseFloat(deducao.toFixed(2)),
    aliquota: parseFloat(aliquotaEfetiva.toFixed(2)),
    impostoTotal: parseFloat(impostoTotal.toFixed(2)),
    aliquotaEfetiva: parseFloat(aliquotaEfetiva.toFixed(2)),
    detalhamento: {
      baseCalculo: parseFloat(rbt12.toFixed(2)),
      aliquotaNominal: `${aliquotaNominal}%`,
      parcelaDeducao: parseFloat(deducao.toFixed(2)),
      aliquotaEfetiva: `${aliquotaEfetiva.toFixed(2)}%`,
      formula: `[(${rbt12} × ${aliquotaNominal}%) - ${deducao}] / ${rbt12}`,
      observacao: `${anexo} - Alíquota efetiva: ${aliquotaEfetiva.toFixed(2)}%`
    }
  };
};

// ============================================
// LUCRO PRESUMIDO
// ============================================

const PRESUNCAO_IRPJ = {
  'comercio': 0.08,
  'industria': 0.08,
  'servico': 0.32
};

const PRESUNCAO_CSLL = {
  'comercio': 0.12,
  'industria': 0.12,
  'servico': 0.12
};

const ALIQUOTAS_PRESUMIDO = {
  IRPJ: 0.15,
  IRPJ_ADICIONAL: 0.10,
  CSLL: 0.09,
  PIS: 0.0065,
  COFINS: 0.03
};

const LIMITE_ADICIONAL_IRPJ = 240000;

export const calcularPresumido = (data) => {
  const rbt12 = parseFloat(data.rbt12) || 0;
  const atividade = data.atividade;

  const presuncaoIrpj = PRESUNCAO_IRPJ[atividade];
  const presuncaoCsll = PRESUNCAO_CSLL[atividade];

  if (presuncaoIrpj === undefined) {
    throw new Error(`Atividade "${atividade}" não encontrada`);
  }

  const lucroPresumidoIrpj = rbt12 * presuncaoIrpj;
  const lucroPresumidoCsll = rbt12 * presuncaoCsll;

  const irpj = lucroPresumidoIrpj * ALIQUOTAS_PRESUMIDO.IRPJ;
  
  let irpjAdicional = 0;
  if (lucroPresumidoIrpj > LIMITE_ADICIONAL_IRPJ) {
    irpjAdicional = (lucroPresumidoIrpj - LIMITE_ADICIONAL_IRPJ) * ALIQUOTAS_PRESUMIDO.IRPJ_ADICIONAL;
  }
  
  const csll = lucroPresumidoCsll * ALIQUOTAS_PRESUMIDO.CSLL;
  const irpjCsll = irpj + irpjAdicional + csll;

  const pis = rbt12 * ALIQUOTAS_PRESUMIDO.PIS;
  const cofins = rbt12 * ALIQUOTAS_PRESUMIDO.COFINS;
  const pisCofins = pis + cofins;

  const iss = 0;
  const impostoTotal = irpjCsll + pisCofins + iss;
  const aliquotaEfetiva = (impostoTotal / rbt12) * 100;

  return {
    regime: 'Lucro Presumido',
    rbt12: parseFloat(rbt12.toFixed(2)),
    atividade,
    lucroPresumido: parseFloat(lucroPresumidoIrpj.toFixed(2)),
    impostoTotal: parseFloat(impostoTotal.toFixed(2)),
    aliquotaEfetiva: parseFloat(aliquotaEfetiva.toFixed(2)),
    detalhamento: {
      presuncaoLucroIrpj: `${(presuncaoIrpj * 100).toFixed(2)}%`,
      presuncaoLucroCsll: `${(presuncaoCsll * 100).toFixed(2)}%`,
      lucroPresumidoIrpj: parseFloat(lucroPresumidoIrpj.toFixed(2)),
      lucroPresumidoCsll: parseFloat(lucroPresumidoCsll.toFixed(2)),
      irpj: parseFloat(irpj.toFixed(2)),
      irpjAdicional: parseFloat(irpjAdicional.toFixed(2)),
      csll: parseFloat(csll.toFixed(2)),
      irpjCsll: parseFloat(irpjCsll.toFixed(2)),
      pis: parseFloat(pis.toFixed(2)),
      cofins: parseFloat(cofins.toFixed(2)),
      pisCofins: parseFloat(pisCofins.toFixed(2)),
      iss: parseFloat(iss.toFixed(2))
    }
  };
};

// ============================================
// LUCRO REAL
// ============================================

const ALIQUOTAS_REAL = {
  IRPJ: 0.15,
  IRPJ_ADICIONAL: 0.10,
  CSLL: 0.09,
  PIS: 0.0165,
  COFINS: 0.076
};

export const calcularReal = (data) => {
  const rbt12 = parseFloat(data.rbt12) || 0;
  const despesas = parseFloat(data.despesas) || 0;
  const folha = parseFloat(data.folha) || 0;
  const atividade = data.atividade;

  const despesasTotais = despesas + folha;
  const lucroLiquido = rbt12 - despesasTotais;

  let irpj = 0;
  let irpjAdicional = 0;
  let csll = 0;
  let irpjCsll = 0;

  if (lucroLiquido > 0) {
    irpj = lucroLiquido * ALIQUOTAS_REAL.IRPJ;
    
    if (lucroLiquido > LIMITE_ADICIONAL_IRPJ) {
      irpjAdicional = (lucroLiquido - LIMITE_ADICIONAL_IRPJ) * ALIQUOTAS_REAL.IRPJ_ADICIONAL;
    }
    
    csll = lucroLiquido * ALIQUOTAS_REAL.CSLL;
    irpjCsll = irpj + irpjAdicional + csll;
  }

  const pisDebito = rbt12 * ALIQUOTAS_REAL.PIS;
  const cofinsDebito = rbt12 * ALIQUOTAS_REAL.COFINS;
  
  const percentualCredito = (atividade === 'servico') ? 0.70 : 0.90;
  const despesasComCredito = despesas * percentualCredito;
  const pisCredito = despesasComCredito * ALIQUOTAS_REAL.PIS;
  const cofinsCredito = despesasComCredito * ALIQUOTAS_REAL.COFINS;
  
  const pis = Math.max(0, pisDebito - pisCredito);
  const cofins = Math.max(0, cofinsDebito - cofinsCredito);
  const pisCofins = pis + cofins;

  const iss = 0;
  const impostoTotal = irpjCsll + pisCofins + iss;
  const aliquotaEfetiva = rbt12 > 0 ? (impostoTotal / rbt12) * 100 : 0;

  return {
    regime: 'Lucro Real',
    rbt12: parseFloat(rbt12.toFixed(2)),
    atividade,
    despesas: parseFloat(despesasTotais.toFixed(2)),
    lucroLiquido: parseFloat(lucroLiquido.toFixed(2)),
    impostoTotal: parseFloat(impostoTotal.toFixed(2)),
    aliquotaEfetiva: parseFloat(aliquotaEfetiva.toFixed(2)),
    detalhamento: {
      receita: parseFloat(rbt12.toFixed(2)),
      despesasOperacionais: parseFloat(despesas.toFixed(2)),
      folhaPagamento: parseFloat(folha.toFixed(2)),
      despesasTotais: parseFloat(despesasTotais.toFixed(2)),
      lucroApurado: parseFloat(lucroLiquido.toFixed(2)),
      irpj: parseFloat(irpj.toFixed(2)),
      irpjAdicional: parseFloat(irpjAdicional.toFixed(2)),
      csll: parseFloat(csll.toFixed(2)),
      irpjCsll: parseFloat(irpjCsll.toFixed(2)),
      pisDebito: parseFloat(pisDebito.toFixed(2)),
      pisCredito: parseFloat(pisCredito.toFixed(2)),
      pis: parseFloat(pis.toFixed(2)),
      cofinsDebito: parseFloat(cofinsDebito.toFixed(2)),
      cofinsCredito: parseFloat(cofinsCredito.toFixed(2)),
      cofins: parseFloat(cofins.toFixed(2)),
      pisCofins: parseFloat(pisCofins.toFixed(2)),
      iss: parseFloat(iss.toFixed(2)),
      percentualCreditoPisCofins: `${percentualCredito * 100}%`,
      observacao: lucroLiquido <= 0 
        ? 'Lucro zero ou negativo - IRPJ/CSLL = 0' 
        : `PIS/COFINS não-cumulativo com créditos sobre ${percentualCredito * 100}% das despesas`
    }
  };
};

// ============================================
// COMPARAÇÃO DOS REGIMES
// ============================================

export const compararRegimes = (dados) => {
  // Aceita tanto "receita" quanto "rbt12" como nome do campo
  const receita = dados.receita || dados.rbt12;
  const { folha, atividade, despesas } = dados;

  const dataCalculo = {
    rbt12: parseFloat(receita) || 0,
    folha: parseFloat(folha) || 0,
    atividade: atividade,
    despesas: parseFloat(despesas) || 0
  };

  const simples = calcularSimples(dataCalculo);
  const presumido = calcularPresumido(dataCalculo);
  const real = calcularReal(dataCalculo);

  // Determinar o melhor regime
  const regimes = [
    { nome: 'simples', imposto: simples.impostoTotal },
    { nome: 'presumido', imposto: presumido.impostoTotal },
    { nome: 'real', imposto: real.impostoTotal }
  ];

  regimes.sort((a, b) => a.imposto - b.imposto);
  const melhorRegime = regimes[0];
  const segundoMelhor = regimes[1];

  const economia = {
    valor: segundoMelhor.imposto - melhorRegime.imposto,
    percentual: ((segundoMelhor.imposto - melhorRegime.imposto) / segundoMelhor.imposto) * 100,
    regime_comparado: segundoMelhor.nome
  };

  return {
    success: true,
    data: {
      regimes: {
        simples: {
          imposto_total: simples.impostoTotal,
          aliquota_efetiva: simples.aliquotaEfetiva,
          detalhes: simples
        },
        presumido: {
          imposto_total: presumido.impostoTotal,
          aliquota_efetiva: presumido.aliquotaEfetiva,
          detalhes: presumido
        },
        real: {
          imposto_total: real.impostoTotal,
          aliquota_efetiva: real.aliquotaEfetiva,
          detalhes: real
        }
      },
      melhor_opcao: melhorRegime.nome,
      economia: {
        valor: parseFloat(economia.valor.toFixed(2)),
        percentual: parseFloat(economia.percentual.toFixed(2)),
        regime_comparado: economia.regime_comparado
      }
    }
  };
};

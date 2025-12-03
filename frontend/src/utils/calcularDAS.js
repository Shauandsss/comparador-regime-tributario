/**
 * Utilitário para cálculo do DAS do Simples Nacional
 * Implementação 100% frontend
 */

// Tabelas do Simples Nacional (2018+)
const TABELAS_SIMPLES = {
  ANEXO_I: [
    { faixa: 1, de: 0, ate: 180000, aliquota: 4.00, deducao: 0 },
    { faixa: 2, de: 180000.01, ate: 360000, aliquota: 7.30, deducao: 5940 },
    { faixa: 3, de: 360000.01, ate: 720000, aliquota: 9.50, deducao: 13860 },
    { faixa: 4, de: 720000.01, ate: 1800000, aliquota: 10.70, deducao: 22500 },
    { faixa: 5, de: 1800000.01, ate: 3600000, aliquota: 14.30, deducao: 87300 },
    { faixa: 6, de: 3600000.01, ate: 4800000, aliquota: 19.00, deducao: 378000 }
  ],
  ANEXO_II: [
    { faixa: 1, de: 0, ate: 180000, aliquota: 4.50, deducao: 0 },
    { faixa: 2, de: 180000.01, ate: 360000, aliquota: 7.80, deducao: 5940 },
    { faixa: 3, de: 360000.01, ate: 720000, aliquota: 10.00, deducao: 13860 },
    { faixa: 4, de: 720000.01, ate: 1800000, aliquota: 11.20, deducao: 22500 },
    { faixa: 5, de: 1800000.01, ate: 3600000, aliquota: 14.70, deducao: 85500 },
    { faixa: 6, de: 3600000.01, ate: 4800000, aliquota: 30.00, deducao: 720000 }
  ],
  ANEXO_III: [
    { faixa: 1, de: 0, ate: 180000, aliquota: 6.00, deducao: 0 },
    { faixa: 2, de: 180000.01, ate: 360000, aliquota: 11.20, deducao: 9360 },
    { faixa: 3, de: 360000.01, ate: 720000, aliquota: 13.50, deducao: 17640 },
    { faixa: 4, de: 720000.01, ate: 1800000, aliquota: 16.00, deducao: 35640 },
    { faixa: 5, de: 1800000.01, ate: 3600000, aliquota: 21.00, deducao: 125640 },
    { faixa: 6, de: 3600000.01, ate: 4800000, aliquota: 33.00, deducao: 648000 }
  ],
  ANEXO_IV: [
    { faixa: 1, de: 0, ate: 180000, aliquota: 4.50, deducao: 0 },
    { faixa: 2, de: 180000.01, ate: 360000, aliquota: 9.00, deducao: 8100 },
    { faixa: 3, de: 360000.01, ate: 720000, aliquota: 10.20, deducao: 12420 },
    { faixa: 4, de: 720000.01, ate: 1800000, aliquota: 14.00, deducao: 39780 },
    { faixa: 5, de: 1800000.01, ate: 3600000, aliquota: 22.00, deducao: 183780 },
    { faixa: 6, de: 3600000.01, ate: 4800000, aliquota: 33.00, deducao: 828000 }
  ],
  ANEXO_V: [
    { faixa: 1, de: 0, ate: 180000, aliquota: 15.50, deducao: 0 },
    { faixa: 2, de: 180000.01, ate: 360000, aliquota: 18.00, deducao: 4500 },
    { faixa: 3, de: 360000.01, ate: 720000, aliquota: 19.50, deducao: 9900 },
    { faixa: 4, de: 720000.01, ate: 1800000, aliquota: 20.50, deducao: 17100 },
    { faixa: 5, de: 1800000.01, ate: 3600000, aliquota: 23.00, deducao: 62100 },
    { faixa: 6, de: 3600000.01, ate: 4800000, aliquota: 30.50, deducao: 540000 }
  ]
};

const CNAE_ANEXO_MAP = {
  '4711-3': 'ANEXO_I', '4712-1': 'ANEXO_I', '4713-0': 'ANEXO_I',
  '1011-2': 'ANEXO_II', '1012-1': 'ANEXO_II', '1091-1': 'ANEXO_II',
  '8599-6': 'ANEXO_III', '8630-5': 'ANEXO_III', '9602-5': 'ANEXO_III',
  '6201-5': 'ANEXO_IV', '6202-3': 'ANEXO_IV', '7020-4': 'ANEXO_IV',
  '6911-7': 'ANEXO_V', '6920-6': 'ANEXO_V', '7112-0': 'ANEXO_V'
};

function calcularFatorR(folha12, rbt12) {
  if (!rbt12 || rbt12 === 0) return 0;
  return folha12 / rbt12;
}

function identificarAnexo(cnae, fatorR) {
  const anexoDireto = CNAE_ANEXO_MAP[cnae];
  if (anexoDireto) {
    if (anexoDireto === 'ANEXO_III' && fatorR < 0.28) {
      return 'ANEXO_V';
    }
    return anexoDireto;
  }
  return 'ANEXO_I';
}

function encontrarFaixa(rbt12, tabela) {
  for (const faixa of tabela) {
    if (rbt12 >= faixa.de && rbt12 <= faixa.ate) {
      return faixa;
    }
  }
  return tabela[tabela.length - 1];
}

function calcularAliquotaEfetiva(rbt12, aliquotaNominal, parcelaRedutora) {
  if (!rbt12 || rbt12 === 0) return 0;
  const aliquotaDecimal = aliquotaNominal / 100;
  const valorDevido = (rbt12 * aliquotaDecimal) - parcelaRedutora;
  const aliquotaEfetiva = valorDevido / rbt12;
  return aliquotaEfetiva;
}

export function calcularDAS(dados) {
  const { rbt12, faturamentoMes, cnae, folha12 = 0 } = dados;
  
  if (!rbt12 || rbt12 <= 0) {
    throw new Error('RBT12 (Receita Bruta Total 12 meses) é obrigatório e deve ser maior que zero');
  }
  
  if (!faturamentoMes || faturamentoMes < 0) {
    throw new Error('Faturamento do mês é obrigatório e não pode ser negativo');
  }
  
  if (!cnae) {
    throw new Error('CNAE é obrigatório');
  }
  
  if (rbt12 > 4800000) {
    return {
      sucesso: false,
      erro: 'Empresa ultrapassou o limite de R$ 4.800.000,00 do Simples Nacional',
      rbt12,
      limiteSimples: 4800000
    };
  }
  
  const fatorR = calcularFatorR(folha12, rbt12);
  const anexo = identificarAnexo(cnae, fatorR);
  const tabela = TABELAS_SIMPLES[anexo];
  const faixa = encontrarFaixa(rbt12, tabela);
  const aliquotaEfetiva = calcularAliquotaEfetiva(rbt12, faixa.aliquota, faixa.deducao);
  const valorDAS = faturamentoMes * aliquotaEfetiva;
  
  const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatarPercentual = (valor) => (valor * 100).toFixed(2) + '%';
  
  return {
    sucesso: true,
    entrada: {
      rbt12, rbt12Formatado: formatarMoeda(rbt12),
      faturamentoMes, faturamentoMesFormatado: formatarMoeda(faturamentoMes),
      cnae,
      folha12, folha12Formatado: formatarMoeda(folha12)
    },
    fatorR: {
      valor: fatorR,
      percentual: formatarPercentual(fatorR),
      calculado: folha12 > 0,
      enquadraAnexoIII: fatorR >= 0.28
    },
    anexo: {
      codigo: anexo,
      nome: anexo.replace('_', ' '),
      descricao: getDescricaoAnexo(anexo)
    },
    faixa: {
      numero: faixa.faixa,
      de: formatarMoeda(faixa.de),
      ate: formatarMoeda(faixa.ate),
      aliquotaNominal: faixa.aliquota + '%',
      parcelaRedutora: formatarMoeda(faixa.deducao)
    },
    calculo: {
      aliquotaNominal: faixa.aliquota / 100,
      aliquotaNominalPercentual: faixa.aliquota + '%',
      parcelaRedutora: faixa.deducao,
      aliquotaEfetiva,
      aliquotaEfetivaPercentual: formatarPercentual(aliquotaEfetiva)
    },
    resultado: {
      valorDAS,
      valorDASFormatado: formatarMoeda(valorDAS),
      aliquotaAplicada: formatarPercentual(aliquotaEfetiva)
    }
  };
}

function getDescricaoAnexo(anexo) {
  const descricoes = {
    'ANEXO_I': 'Comércio',
    'ANEXO_II': 'Indústria',
    'ANEXO_III': 'Serviços com folha ≥ 28%',
    'ANEXO_IV': 'Serviços específicos',
    'ANEXO_V': 'Serviços com folha < 28%'
  };
  return descricoes[anexo] || anexo;
}

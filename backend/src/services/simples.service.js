/**
 * Serviço de cálculo - Simples Nacional
 * 
 * Regime simplificado baseado em anexos e faturamento
 * 
 * IMPORTANTE: No Simples Nacional, a maioria dos serviços está no Anexo III.
 * Apenas alguns serviços específicos (intelectuais, consultoria) podem ir para 
 * o Anexo V quando o Fator R < 28%.
 * 
 * Para simplificar, este sistema assume que todos os serviços são do Anexo III.
 */

/**
 * Tabelas do Anexo I (Comércio)
 * LC 123/2006 atualizada
 */
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

/**
 * Tabelas do Anexo II (Indústria)
 */
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

/**
 * Tabelas do Anexo III (Serviços em geral)
 * Maioria dos serviços: locação de bens móveis, academias, laboratórios, 
 * serviços de instalação, reparos, manutenção, transporte, etc.
 */
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

/**
 * Calcula a alíquota efetiva do Simples Nacional
 * Fórmula: [(RBT12 × Aliq) - PD] / RBT12
 * 
 * @param {number} rbt12 - Receita bruta dos últimos 12 meses
 * @param {Array} faixas - Tabela de faixas do anexo
 * @returns {Object} Alíquota nominal, dedução e alíquota efetiva
 */
const calcularAliquotaEfetiva = (rbt12, faixas) => {
  let faixaEncontrada = faixas[faixas.length - 1]; // Default: última faixa
  
  for (const faixa of faixas) {
    if (rbt12 <= faixa.ate) {
      faixaEncontrada = faixa;
      break;
    }
  }
  
  const aliquotaNominal = faixaEncontrada.aliquota;
  const deducao = faixaEncontrada.deducao;
  
  // Alíquota efetiva = [(RBT12 × Aliq) - PD] / RBT12
  const aliquotaEfetiva = ((rbt12 * (aliquotaNominal / 100)) - deducao) / rbt12 * 100;
  
  return {
    aliquotaNominal,
    deducao,
    aliquotaEfetiva: Math.max(0, aliquotaEfetiva) // Não pode ser negativa
  };
};

/**
 * Calcula o imposto no regime Simples Nacional
 * 
 * @param {Object} data - Dados da empresa
 * @param {number} data.rbt12 - Receita bruta dos últimos 12 meses
 * @param {string} data.atividade - Tipo de atividade (comercio, industria, servico)
 * @param {number} data.folha - Folha de pagamento dos últimos 12 meses
 * @returns {Object} Resultado do cálculo
 */
export const calcularSimples = (data) => {
  const { rbt12, atividade, folha = 0 } = data;

  let resultado;
  let anexo;

  // Selecionar o anexo correto baseado na atividade
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
      throw new Error(`Atividade "${atividade}" não encontrada para Simples Nacional`);
  }

  const { aliquotaNominal, deducao, aliquotaEfetiva } = resultado;
  
  // Cálculo do imposto usando alíquota efetiva
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

/**
 * Obtém informações sobre o regime Simples Nacional
 */
export const getInfoSimples = () => {
  return {
    regime: 'Simples Nacional',
    descricao: 'Regime tributário simplificado para micro e pequenas empresas',
    anexos: {
      comercio: 'Anexo I',
      industria: 'Anexo II',
      servico: 'Anexo III'
    },
    limiteAnual: 4800000,
    tributos: [
      'IRPJ',
      'CSLL',
      'PIS',
      'COFINS',
      'IPI',
      'ICMS',
      'ISS',
      'CPP'
    ],
    observacao: 'Alíquota efetiva calculada com dedução progressiva'
  };
};

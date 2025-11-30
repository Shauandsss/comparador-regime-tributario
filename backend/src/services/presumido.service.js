/**
 * Serviço de cálculo - Lucro Presumido
 * 
 * Regime baseado em presunção de lucro sobre a receita
 */

/**
 * Tabela de presunção de lucro por atividade - IRPJ
 */
const PRESUNCAO_IRPJ = {
  'comercio': 0.08,      // 8%
  'industria': 0.08,     // 8%
  'servico': 0.32        // 32%
};

/**
 * Tabela de presunção de lucro por atividade - CSLL
 * A base de cálculo da CSLL é DIFERENTE da base do IRPJ:
 * - Comércio/Indústria: 12%
 * - Serviços em geral: 12% (NÃO 32% como o IRPJ!)
 * Ref: Art. 20 da Lei 9.249/95
 */
const PRESUNCAO_CSLL = {
  'comercio': 0.12,      // 12%
  'industria': 0.12,     // 12%
  'servico': 0.12        // 12% (diferente do IRPJ que é 32%)
};

/**
 * Alíquotas dos tributos
 */
const ALIQUOTAS = {
  IRPJ: 0.15,           // 15% sobre o lucro presumido
  IRPJ_ADICIONAL: 0.10, // 10% adicional sobre lucro > R$ 240.000/ano
  CSLL: 0.09,           // 9% sobre o lucro presumido
  PIS: 0.0065,          // 0.65% sobre o faturamento
  COFINS: 0.03,         // 3% sobre o faturamento
  ISS: 0.05             // 5% sobre o faturamento (para serviços)
};

// Limite para adicional de IRPJ (R$ 20.000/mês = R$ 240.000/ano)
const LIMITE_ADICIONAL_IRPJ = 240000;

/**
 * Calcula o imposto no regime Lucro Presumido
 * 
 * @param {Object} data - Dados da empresa
 * @param {number} data.rbt12 - Receita bruta dos últimos 12 meses
 * @param {string} data.atividade - Tipo de atividade
 * @returns {Object} Resultado do cálculo
 */
export const calcularPresumido = (data) => {
  const { rbt12, atividade } = data;

  // Buscar percentual de presunção para IRPJ
  const presuncaoIrpj = PRESUNCAO_IRPJ[atividade];
  const presuncaoCsll = PRESUNCAO_CSLL[atividade];

  if (presuncaoIrpj === undefined) {
    throw new Error(`Atividade "${atividade}" não encontrada para Lucro Presumido`);
  }

  // Calcular lucro presumido (bases diferentes para IRPJ e CSLL)
  const lucroPresumidoIrpj = rbt12 * presuncaoIrpj;
  const lucroPresumidoCsll = rbt12 * presuncaoCsll;

  // Calcular IRPJ sobre o lucro presumido
  const irpj = lucroPresumidoIrpj * ALIQUOTAS.IRPJ;
  
  // Adicional de IRPJ: 10% sobre lucro presumido que exceder R$ 240.000/ano
  let irpjAdicional = 0;
  if (lucroPresumidoIrpj > LIMITE_ADICIONAL_IRPJ) {
    irpjAdicional = (lucroPresumidoIrpj - LIMITE_ADICIONAL_IRPJ) * ALIQUOTAS.IRPJ_ADICIONAL;
  }
  
  // CSLL sobre o lucro presumido (base diferente para serviços)
  const csll = lucroPresumidoCsll * ALIQUOTAS.CSLL;
  const irpjCsll = irpj + irpjAdicional + csll;

  // Calcular PIS e COFINS sobre o faturamento (regime cumulativo)
  const pis = rbt12 * ALIQUOTAS.PIS;
  const cofins = rbt12 * ALIQUOTAS.COFINS;
  const pisCofins = pis + cofins;

  // ISS para serviços
  // NOTA: O ISS já está INCLUSO no Simples Nacional, então para comparação justa,
  // não adicionamos ISS separadamente no Presumido. O ISS seria pago à parte
  // em qualquer regime e varia por município (2% a 5%).
  const iss = 0; // Removido da comparação para equidade com Simples

  // Total de impostos
  const impostoTotal = irpjCsll + pisCofins + iss;

  // Alíquota efetiva
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

/**
 * Obtém informações sobre o regime Lucro Presumido
 */
export const getInfoPresumido = () => {
  return {
    regime: 'Lucro Presumido',
    descricao: 'Regime baseado em presunção de lucro sobre a receita',
    presuncoes: {
      'comércio': '8%',
      'indústria': '8%',
      'serviço': '32%'
    },
    aliquotas: {
      IRPJ: '15%',
      CSLL: '9%',
      PIS: '0.65%',
      COFINS: '3%'
    },
    observacao: 'IRPJ e CSLL calculados sobre o lucro presumido. PIS e COFINS sobre o faturamento.'
  };
};

/**
 * Serviço de cálculo - Lucro Real
 * 
 * Regime baseado no lucro efetivo da empresa
 * PIS e COFINS no regime NÃO-CUMULATIVO (com créditos sobre despesas)
 */

/**
 * Alíquotas dos tributos
 */
const ALIQUOTAS = {
  IRPJ: 0.15,           // 15% sobre o lucro real
  IRPJ_ADICIONAL: 0.10, // 10% adicional sobre lucro > R$ 240.000/ano
  CSLL: 0.09,           // 9% sobre o lucro real
  PIS: 0.0165,          // 1.65% sobre o faturamento (não-cumulativo)
  COFINS: 0.076,        // 7.6% sobre o faturamento (não-cumulativo)
  ISS: 0.05             // 5% sobre o faturamento (para serviços)
};

// Limite para adicional de IRPJ (R$ 20.000/mês = R$ 240.000/ano)
const LIMITE_ADICIONAL_IRPJ = 240000;

/**
 * Calcula o imposto no regime Lucro Real
 * 
 * No regime não-cumulativo:
 * - PIS/COFINS são calculados sobre receita
 * - Mas há CRÉDITOS sobre despesas (insumos, serviços, etc.)
 * - Valor a pagar = débito - crédito
 * 
 * @param {Object} data - Dados da empresa
 * @param {number} data.rbt12 - Receita bruta dos últimos 12 meses
 * @param {number} data.despesas - Despesas dedutíveis
 * @param {string} data.atividade - Tipo de atividade (para informação)
 * @returns {Object} Resultado do cálculo
 */
export const calcularReal = (data) => {
  const { rbt12, despesas = 0, folha = 0, atividade } = data;

  // No Lucro Real, a FOLHA DE PAGAMENTO também é despesa dedutível
  const despesasTotais = despesas + folha;
  
  // Calcular lucro líquido (receita - todas as despesas incluindo folha)
  const lucroLiquido = rbt12 - despesasTotais;

  // Calcular IRPJ e CSLL sobre o lucro real (se positivo)
  let irpj = 0;
  let irpjAdicional = 0;
  let csll = 0;
  let irpjCsll = 0;

  if (lucroLiquido > 0) {
    // IRPJ base: 15% sobre todo o lucro
    irpj = lucroLiquido * ALIQUOTAS.IRPJ;
    
    // IRPJ Adicional: 10% sobre o que exceder R$ 240.000/ano
    if (lucroLiquido > LIMITE_ADICIONAL_IRPJ) {
      irpjAdicional = (lucroLiquido - LIMITE_ADICIONAL_IRPJ) * ALIQUOTAS.IRPJ_ADICIONAL;
    }
    
    // CSLL: 9% sobre todo o lucro
    csll = lucroLiquido * ALIQUOTAS.CSLL;
    irpjCsll = irpj + irpjAdicional + csll;
  }

  // ===== PIS/COFINS NÃO-CUMULATIVO (COM CRÉDITOS) =====
  // Débitos: sobre a receita bruta
  const pisDebito = rbt12 * ALIQUOTAS.PIS;
  const cofinsDebito = rbt12 * ALIQUOTAS.COFINS;
  
  // Créditos: sobre as despesas (insumos, serviços, etc.) - NÃO inclui folha
  // Para indústria/comércio, considera ~90% das despesas como geradoras de crédito
  // Para serviços, considera ~70% (menos insumos)
  const percentualCredito = (atividade === 'servico') ? 0.70 : 0.90;
  const despesasComCredito = despesas * percentualCredito;
  const pisCredito = despesasComCredito * ALIQUOTAS.PIS;
  const cofinsCredito = despesasComCredito * ALIQUOTAS.COFINS;
  
  // Valor líquido a pagar (não pode ser negativo)
  const pis = Math.max(0, pisDebito - pisCredito);
  const cofins = Math.max(0, cofinsDebito - cofinsCredito);
  const pisCofins = pis + cofins;

  // ISS para serviços
  // NOTA: O ISS já está INCLUSO no Simples Nacional, então para comparação justa,
  // não adicionamos ISS separadamente no Real. O ISS seria pago à parte
  // em qualquer regime e varia por município (2% a 5%).
  const iss = 0; // Removido da comparação para equidade com Simples

  // Total de impostos
  const impostoTotal = irpjCsll + pisCofins + iss;

  // Alíquota efetiva
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
        : `PIS/COFINS não-cumulativo com créditos sobre ${percentualCredito * 100}% das despesas operacionais (exceto folha)`
    }
  };
};

/**
 * Obtém informações sobre o regime Lucro Real
 */
export const getInfoReal = () => {
  return {
    regime: 'Lucro Real',
    descricao: 'Regime baseado no lucro efetivo apurado pela empresa',
    aliquotas: {
      IRPJ: '15%',
      CSLL: '9%',
      PIS: '1.65%',
      COFINS: '7.6%'
    },
    observacao: 'IRPJ e CSLL calculados sobre o lucro real. PIS e COFINS no regime não-cumulativo.',
    vantagens: [
      'Tributação sobre lucro efetivo',
      'Pode compensar prejuízos fiscais',
      'Créditos de PIS/COFINS sobre insumos'
    ]
  };
};

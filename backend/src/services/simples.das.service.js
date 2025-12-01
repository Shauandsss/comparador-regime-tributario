/**
 * Service para cálculo do DAS do Simples Nacional
 * Baseado nas tabelas pós-2018 da Receita Federal
 */

// Tabelas do Simples Nacional (2018+)
const TABELAS_SIMPLES = {
  // Anexo I - Comércio
  ANEXO_I: [
    { faixa: 1, de: 0, ate: 180000, aliquota: 4.00, deducao: 0 },
    { faixa: 2, de: 180000.01, ate: 360000, aliquota: 7.30, deducao: 5940 },
    { faixa: 3, de: 360000.01, ate: 720000, aliquota: 9.50, deducao: 13860 },
    { faixa: 4, de: 720000.01, ate: 1800000, aliquota: 10.70, deducao: 22500 },
    { faixa: 5, de: 1800000.01, ate: 3600000, aliquota: 14.30, deducao: 87300 },
    { faixa: 6, de: 3600000.01, ate: 4800000, aliquota: 19.00, deducao: 378000 }
  ],
  
  // Anexo II - Indústria
  ANEXO_II: [
    { faixa: 1, de: 0, ate: 180000, aliquota: 4.50, deducao: 0 },
    { faixa: 2, de: 180000.01, ate: 360000, aliquota: 7.80, deducao: 5940 },
    { faixa: 3, de: 360000.01, ate: 720000, aliquota: 10.00, deducao: 13860 },
    { faixa: 4, de: 720000.01, ate: 1800000, aliquota: 11.20, deducao: 22500 },
    { faixa: 5, de: 1800000.01, ate: 3600000, aliquota: 14.70, deducao: 85500 },
    { faixa: 6, de: 3600000.01, ate: 4800000, aliquota: 30.00, deducao: 720000 }
  ],
  
  // Anexo III - Serviços (com Fator R >= 28%)
  ANEXO_III: [
    { faixa: 1, de: 0, ate: 180000, aliquota: 6.00, deducao: 0 },
    { faixa: 2, de: 180000.01, ate: 360000, aliquota: 11.20, deducao: 9360 },
    { faixa: 3, de: 360000.01, ate: 720000, aliquota: 13.50, deducao: 17640 },
    { faixa: 4, de: 720000.01, ate: 1800000, aliquota: 16.00, deducao: 35640 },
    { faixa: 5, de: 1800000.01, ate: 3600000, aliquota: 21.00, deducao: 125640 },
    { faixa: 6, de: 3600000.01, ate: 4800000, aliquota: 33.00, deducao: 648000 }
  ],
  
  // Anexo IV - Serviços específicos
  ANEXO_IV: [
    { faixa: 1, de: 0, ate: 180000, aliquota: 4.50, deducao: 0 },
    { faixa: 2, de: 180000.01, ate: 360000, aliquota: 9.00, deducao: 8100 },
    { faixa: 3, de: 360000.01, ate: 720000, aliquota: 10.20, deducao: 12420 },
    { faixa: 4, de: 720000.01, ate: 1800000, aliquota: 14.00, deducao: 39780 },
    { faixa: 5, de: 1800000.01, ate: 3600000, aliquota: 22.00, deducao: 183780 },
    { faixa: 6, de: 3600000.01, ate: 4800000, aliquota: 33.00, deducao: 828000 }
  ],
  
  // Anexo V - Serviços (com Fator R < 28%)
  ANEXO_V: [
    { faixa: 1, de: 0, ate: 180000, aliquota: 15.50, deducao: 0 },
    { faixa: 2, de: 180000.01, ate: 360000, aliquota: 18.00, deducao: 4500 },
    { faixa: 3, de: 360000.01, ate: 720000, aliquota: 19.50, deducao: 9900 },
    { faixa: 4, de: 720000.01, ate: 1800000, aliquota: 20.50, deducao: 17100 },
    { faixa: 5, de: 1800000.01, ate: 3600000, aliquota: 23.00, deducao: 62100 },
    { faixa: 6, de: 3600000.01, ate: 4800000, aliquota: 30.50, deducao: 540000 }
  ]
};

// Mapeamento de CNAEs para Anexos
const CNAE_ANEXO_MAP = {
  // Anexo I - Comércio
  '4711-3': 'ANEXO_I', // Comércio varejista de mercadorias
  '4712-1': 'ANEXO_I', // Comércio varejista de produtos alimentícios
  '4713-0': 'ANEXO_I', // Lojas de departamentos
  
  // Anexo II - Indústria
  '1011-2': 'ANEXO_II', // Frigorífico - abate de bovinos
  '1012-1': 'ANEXO_II', // Frigorífico - abate de suínos
  '1091-1': 'ANEXO_II', // Fabricação de produtos de carne
  
  // Anexo III - Serviços com folha >= 28%
  '8599-6': 'ANEXO_III', // Outras atividades de ensino
  '8630-5': 'ANEXO_III', // Atividade médica ambulatorial
  '9602-5': 'ANEXO_III', // Cabeleireiros
  
  // Anexo IV - Serviços específicos
  '6201-5': 'ANEXO_IV', // Desenvolvimento de programas de computador
  '6202-3': 'ANEXO_IV', // Desenvolvimento e licenciamento de programas
  '7020-4': 'ANEXO_IV', // Atividades de consultoria em gestão
  
  // Anexo V - Serviços com folha < 28%
  '6911-7': 'ANEXO_V', // Serviços advocatícios
  '6920-6': 'ANEXO_V', // Atividades contábeis
  '7112-0': 'ANEXO_V' // Serviços de engenharia
};

/**
 * Calcula o Fator R
 * @param {number} folha12 - Soma da folha de salários dos últimos 12 meses
 * @param {number} rbt12 - Receita Bruta Total dos últimos 12 meses
 * @returns {number} - Fator R em decimal (ex: 0.28 = 28%)
 */
function calcularFatorR(folha12, rbt12) {
  if (!rbt12 || rbt12 === 0) return 0;
  return folha12 / rbt12;
}

/**
 * Identifica o anexo correto baseado em CNAE e Fator R
 * @param {string} cnae - Código CNAE
 * @param {number} fatorR - Fator R calculado
 * @returns {string} - Nome do anexo (ANEXO_I, ANEXO_II, etc)
 */
function identificarAnexo(cnae, fatorR) {
  // Verifica se existe mapeamento direto
  const anexoDireto = CNAE_ANEXO_MAP[cnae];
  
  if (anexoDireto) {
    // Se for serviço que pode cair no Anexo III ou V, aplica fator R
    if (anexoDireto === 'ANEXO_III' && fatorR < 0.28) {
      return 'ANEXO_V';
    }
    return anexoDireto;
  }
  
  // Padrão: assume comércio (Anexo I)
  // Em produção, deveria haver validação mais rigorosa
  return 'ANEXO_I';
}

/**
 * Encontra a faixa correta na tabela do Simples Nacional
 * @param {number} rbt12 - Receita Bruta Total dos últimos 12 meses
 * @param {Array} tabela - Tabela do anexo
 * @returns {Object} - Objeto com dados da faixa
 */
function encontrarFaixa(rbt12, tabela) {
  for (const faixa of tabela) {
    if (rbt12 >= faixa.de && rbt12 <= faixa.ate) {
      return faixa;
    }
  }
  
  // Se ultrapassar o limite, retorna última faixa
  return tabela[tabela.length - 1];
}

/**
 * Calcula a alíquota efetiva do Simples Nacional
 * Fórmula: (RBT12 x Alíquota - Parcela a Deduzir) / RBT12
 * @param {number} rbt12 - Receita Bruta Total dos últimos 12 meses
 * @param {number} aliquotaNominal - Alíquota da faixa (%)
 * @param {number} parcelaRedutora - Parcela a deduzir (R$)
 * @returns {number} - Alíquota efetiva em decimal
 */
function calcularAliquotaEfetiva(rbt12, aliquotaNominal, parcelaRedutora) {
  if (!rbt12 || rbt12 === 0) return 0;
  
  const aliquotaDecimal = aliquotaNominal / 100;
  const valorDevido = (rbt12 * aliquotaDecimal) - parcelaRedutora;
  const aliquotaEfetiva = valorDevido / rbt12;
  
  return aliquotaEfetiva;
}

/**
 * Calcula o valor do DAS
 * @param {number} faturamentoMes - Faturamento do mês atual
 * @param {number} aliquotaEfetiva - Alíquota efetiva (decimal)
 * @returns {number} - Valor do DAS em reais
 */
function calcularValorDAS(faturamentoMes, aliquotaEfetiva) {
  return faturamentoMes * aliquotaEfetiva;
}

/**
 * Serviço principal: Calcula DAS do Simples Nacional
 * @param {Object} dados - { rbt12, faturamentoMes, cnae, folha12 }
 * @returns {Object} - Resultado completo do cálculo
 */
export function calcularDAS(dados) {
  const { rbt12, faturamentoMes, cnae, folha12 = 0 } = dados;
  
  // Validações
  if (!rbt12 || rbt12 <= 0) {
    throw new Error('RBT12 (Receita Bruta Total 12 meses) é obrigatório e deve ser maior que zero');
  }
  
  if (!faturamentoMes || faturamentoMes < 0) {
    throw new Error('Faturamento do mês é obrigatório e não pode ser negativo');
  }
  
  if (!cnae) {
    throw new Error('CNAE é obrigatório');
  }
  
  // Verifica limite do Simples Nacional
  if (rbt12 > 4800000) {
    return {
      sucesso: false,
      erro: 'Empresa ultrapassou o limite de R$ 4.800.000,00 do Simples Nacional',
      rbt12,
      limiteSimples: 4800000
    };
  }
  
  // 1. Calcular Fator R
  const fatorR = calcularFatorR(folha12, rbt12);
  
  // 2. Identificar Anexo
  const anexo = identificarAnexo(cnae, fatorR);
  
  // 3. Buscar tabela do anexo
  const tabela = TABELAS_SIMPLES[anexo];
  
  // 4. Encontrar faixa
  const faixa = encontrarFaixa(rbt12, tabela);
  
  // 5. Calcular alíquota efetiva
  const aliquotaEfetiva = calcularAliquotaEfetiva(
    rbt12,
    faixa.aliquota,
    faixa.deducao
  );
  
  // 6. Calcular valor do DAS
  const valorDAS = calcularValorDAS(faturamentoMes, aliquotaEfetiva);
  
  // Retorno completo
  return {
    sucesso: true,
    dados: {
      rbt12,
      faturamentoMes,
      cnae,
      folha12
    },
    fatorR: {
      valor: fatorR,
      percentual: (fatorR * 100).toFixed(2) + '%',
      aplicavelAnexoIII: fatorR >= 0.28
    },
    anexo: {
      codigo: anexo,
      nome: anexo.replace('_', ' '),
      descricao: getDescricaoAnexo(anexo)
    },
    faixa: {
      numero: faixa.faixa,
      de: faixa.de,
      ate: faixa.ate,
      aliquotaNominal: faixa.aliquota + '%',
      parcelaRedutora: faixa.deducao
    },
    calculo: {
      aliquotaEfetiva: (aliquotaEfetiva * 100).toFixed(4) + '%',
      aliquotaEfetivaDecimal: aliquotaEfetiva,
      valorDAS: valorDAS.toFixed(2),
      valorDASFormatado: formatarMoeda(valorDAS)
    },
    detalhamento: {
      formula: `(RBT12 x Alíquota - Parcela a Deduzir) / RBT12`,
      calculo: `(${formatarMoeda(rbt12)} x ${faixa.aliquota}% - ${formatarMoeda(faixa.deducao)}) / ${formatarMoeda(rbt12)}`,
      valorDASCalculo: `${formatarMoeda(faturamentoMes)} x ${(aliquotaEfetiva * 100).toFixed(4)}%`
    }
  };
}

/**
 * Retorna descrição do anexo
 */
function getDescricaoAnexo(anexo) {
  const descricoes = {
    ANEXO_I: 'Comércio',
    ANEXO_II: 'Indústria',
    ANEXO_III: 'Serviços (Receitas de locação de bens móveis e prestação de serviços não relacionados no § 5º-C do art. 18)',
    ANEXO_IV: 'Serviços específicos (Construção de imóveis, vigilância, limpeza, etc)',
    ANEXO_V: 'Serviços (Serviços relacionados no § 5º-I do art. 18, com folha < 28%)'
  };
  
  return descricoes[anexo] || 'Anexo não identificado';
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
  calcularDAS,
  calcularFatorR,
  identificarAnexo
};

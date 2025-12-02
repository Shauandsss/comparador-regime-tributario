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

/**
 * TABELA DE PERCENTUAIS DE PRESUNÇÃO - LEI 9.249/95 (art. 15 e 20)
 * 
 * Os percentuais de presunção determinam a base de cálculo presumida
 * sobre a qual incidirão as alíquotas de IRPJ (15% + 10% adicional) e CSLL (9%)
 */

// Atividades detalhadas com percentuais de presunção conforme legislação
export const ATIVIDADES_LUCRO_PRESUMIDO = {
  // === ATIVIDADES COM PRESUNÇÃO 1,6% (IRPJ) ===
  'revenda_combustiveis': {
    codigo: 'revenda_combustiveis',
    nome: 'Revenda de Combustíveis e Gás Natural',
    descricao: 'Revenda, para consumo, de combustível derivado de petróleo, álcool etílico carburante e gás natural',
    presuncaoIrpj: 0.016,  // 1,6%
    presuncaoCsll: 0.12,   // 12%
    categoria: 'combustiveis'
  },

  // === ATIVIDADES COM PRESUNÇÃO 8% (IRPJ) ===
  'comercio': {
    codigo: 'comercio',
    nome: 'Comércio em Geral',
    descricao: 'Venda de mercadorias ou produtos (exceto revenda de combustíveis)',
    presuncaoIrpj: 0.08,   // 8%
    presuncaoCsll: 0.12,   // 12%
    categoria: 'comercio'
  },
  'industria': {
    codigo: 'industria',
    nome: 'Indústria e Fabricação',
    descricao: 'Industrialização de produtos em que a matéria-prima, produto intermediário e material de embalagem tenham sido fornecidos por quem encomendou',
    presuncaoIrpj: 0.08,   // 8%
    presuncaoCsll: 0.12,   // 12%
    categoria: 'industria'
  },
  'transporte_cargas': {
    codigo: 'transporte_cargas',
    nome: 'Transporte de Cargas',
    descricao: 'Serviços de transporte de cargas',
    presuncaoIrpj: 0.08,   // 8%
    presuncaoCsll: 0.12,   // 12%
    categoria: 'transporte'
  },
  'servicos_hospitalares': {
    codigo: 'servicos_hospitalares',
    nome: 'Serviços Hospitalares',
    descricao: 'Serviços hospitalares e de auxílio diagnóstico e terapia, patologia clínica, imagenologia, anatomia patológica e citopatologia, medicina nuclear e análises e patologias clínicas (desde que organizados como sociedade empresária e atendam às normas da ANVISA)',
    presuncaoIrpj: 0.08,   // 8%
    presuncaoCsll: 0.12,   // 12%
    categoria: 'saude'
  },
  'atividade_rural': {
    codigo: 'atividade_rural',
    nome: 'Atividade Rural',
    descricao: 'Atividade rural (agricultura, pecuária, extração e exploração vegetal e animal)',
    presuncaoIrpj: 0.08,   // 8%
    presuncaoCsll: 0.12,   // 12%
    categoria: 'rural'
  },
  'atividade_imobiliaria': {
    codigo: 'atividade_imobiliaria',
    nome: 'Atividade Imobiliária',
    descricao: 'Venda de imóveis de empresas que exploram atividades imobiliárias (loteamentos, incorporações, construção de prédios para venda)',
    presuncaoIrpj: 0.08,   // 8%
    presuncaoCsll: 0.12,   // 12%
    categoria: 'imobiliaria'
  },
  'construcao_empreitada_materiais': {
    codigo: 'construcao_empreitada_materiais',
    nome: 'Construção por Empreitada (com materiais)',
    descricao: 'Construção por empreitada, quando houver emprego de materiais próprios, em qualquer quantidade',
    presuncaoIrpj: 0.08,   // 8%
    presuncaoCsll: 0.12,   // 12%
    categoria: 'construcao'
  },

  // === ATIVIDADES COM PRESUNÇÃO 16% (IRPJ) ===
  'transporte_passageiros': {
    codigo: 'transporte_passageiros',
    nome: 'Transporte de Passageiros',
    descricao: 'Serviços de transporte de passageiros (exceto transporte internacional de cargas)',
    presuncaoIrpj: 0.16,   // 16%
    presuncaoCsll: 0.12,   // 12%
    categoria: 'transporte'
  },
  'servicos_gerais_ate_120k': {
    codigo: 'servicos_gerais_ate_120k',
    nome: 'Serviços em Geral (receita até R$ 120 mil/ano)',
    descricao: 'Prestação de serviços em geral, exceto hospitalares e profissões regulamentadas, cuja receita bruta anual não ultrapasse R$ 120.000,00',
    presuncaoIrpj: 0.16,   // 16%
    presuncaoCsll: 0.32,   // 32%
    categoria: 'servicos'
  },

  // === ATIVIDADES COM PRESUNÇÃO 32% (IRPJ) ===
  'servico': {
    codigo: 'servico',
    nome: 'Serviços em Geral',
    descricao: 'Prestação de serviços em geral (quando não se enquadrar nas demais categorias)',
    presuncaoIrpj: 0.32,   // 32%
    presuncaoCsll: 0.32,   // 32%
    categoria: 'servicos'
  },
  'servicos_profissionais': {
    codigo: 'servicos_profissionais',
    nome: 'Profissões Regulamentadas',
    descricao: 'Serviços de profissões legalmente regulamentadas (medicina, advocacia, engenharia, arquitetura, contabilidade, auditoria, consultoria, economia, administração, psicologia, etc.)',
    presuncaoIrpj: 0.32,   // 32%
    presuncaoCsll: 0.32,   // 32%
    categoria: 'servicos'
  },
  'intermediacao_negocios': {
    codigo: 'intermediacao_negocios',
    nome: 'Intermediação de Negócios',
    descricao: 'Intermediação de negócios, representação comercial, corretagem (seguros, imóveis, etc.)',
    presuncaoIrpj: 0.32,   // 32%
    presuncaoCsll: 0.32,   // 32%
    categoria: 'servicos'
  },
  'administracao_locacao_bens': {
    codigo: 'administracao_locacao_bens',
    nome: 'Administração, Locação ou Cessão de Bens',
    descricao: 'Administração, locação ou cessão de bens imóveis, móveis e direitos de qualquer natureza',
    presuncaoIrpj: 0.32,   // 32%
    presuncaoCsll: 0.32,   // 32%
    categoria: 'servicos'
  },
  'construcao_empreitada_sem_materiais': {
    codigo: 'construcao_empreitada_sem_materiais',
    nome: 'Construção por Empreitada (sem materiais)',
    descricao: 'Construção por empreitada, quando houver emprego unicamente de mão de obra (administração, fiscalização e empreitada)',
    presuncaoIrpj: 0.32,   // 32%
    presuncaoCsll: 0.32,   // 32%
    categoria: 'construcao'
  },
  'factoring': {
    codigo: 'factoring',
    nome: 'Factoring',
    descricao: 'Prestação cumulativa e contínua de serviços de assessoria creditícia, mercadológica, gestão de crédito, seleção e riscos, administração de contas a pagar e a receber, compras de direitos creditórios resultantes de vendas mercantis a prazo ou de prestação de serviços (factoring)',
    presuncaoIrpj: 0.32,   // 32%
    presuncaoCsll: 0.32,   // 32%
    categoria: 'financeiro'
  },
  'servicos_tecnicos': {
    codigo: 'servicos_tecnicos',
    nome: 'Serviços Técnicos',
    descricao: 'Prestação de serviços técnicos, científicos, de design, de assessoria e consultoria',
    presuncaoIrpj: 0.32,   // 32%
    presuncaoCsll: 0.32,   // 32%
    categoria: 'servicos'
  },
  'publicidade_propaganda': {
    codigo: 'publicidade_propaganda',
    nome: 'Publicidade e Propaganda',
    descricao: 'Propaganda e publicidade, inclusive serviços de agenciamento',
    presuncaoIrpj: 0.32,   // 32%
    presuncaoCsll: 0.32,   // 32%
    categoria: 'servicos'
  },

  // === ATIVIDADES COM PRESUNÇÃO 38,4% (IRPJ) ===
  'esc': {
    codigo: 'esc',
    nome: 'Empresa Simples de Crédito (ESC)',
    descricao: 'Empresa Simples de Crédito - operações de empréstimo, financiamento e desconto de títulos',
    presuncaoIrpj: 0.384,  // 38,4%
    presuncaoCsll: 0.384,  // 38,4%
    categoria: 'financeiro'
  }
};

// Mapeamento para manter compatibilidade com código antigo (tipos simples)
const PRESUNCAO_IRPJ_LEGACY = {
  'comercio': 0.08,
  'industria': 0.08,
  'servico': 0.32
};

const PRESUNCAO_CSLL_LEGACY = {
  'comercio': 0.12,
  'industria': 0.12,
  'servico': 0.32
};

// Lista de atividades agrupadas por categoria para uso em selects/dropdowns
export const CATEGORIAS_ATIVIDADES_PRESUMIDO = {
  'combustiveis': {
    nome: 'Combustíveis',
    atividades: ['revenda_combustiveis']
  },
  'comercio': {
    nome: 'Comércio',
    atividades: ['comercio']
  },
  'industria': {
    nome: 'Indústria',
    atividades: ['industria']
  },
  'transporte': {
    nome: 'Transporte',
    atividades: ['transporte_cargas', 'transporte_passageiros']
  },
  'saude': {
    nome: 'Saúde',
    atividades: ['servicos_hospitalares']
  },
  'rural': {
    nome: 'Rural',
    atividades: ['atividade_rural']
  },
  'imobiliaria': {
    nome: 'Imobiliária',
    atividades: ['atividade_imobiliaria']
  },
  'construcao': {
    nome: 'Construção Civil',
    atividades: ['construcao_empreitada_materiais', 'construcao_empreitada_sem_materiais']
  },
  'servicos': {
    nome: 'Serviços',
    atividades: ['servico', 'servicos_gerais_ate_120k', 'servicos_profissionais', 'intermediacao_negocios', 'administracao_locacao_bens', 'servicos_tecnicos', 'publicidade_propaganda']
  },
  'financeiro': {
    nome: 'Financeiro',
    atividades: ['factoring', 'esc']
  }
};

// Lista simplificada para exibição em dropdown
export const getListaAtividadesPresumido = () => {
  return Object.values(ATIVIDADES_LUCRO_PRESUMIDO).map(atividade => ({
    value: atividade.codigo,
    label: atividade.nome,
    descricao: atividade.descricao,
    presuncaoIrpj: atividade.presuncaoIrpj,
    presuncaoCsll: atividade.presuncaoCsll,
    categoria: atividade.categoria
  })).sort((a, b) => a.presuncaoIrpj - b.presuncaoIrpj); // Ordena por % de presunção
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
  // Campo opcional para atividade específica do Lucro Presumido
  const atividadeEspecifica = data.atividadePresumido || data.atividadeEspecifica || atividade;

  // Primeiro tenta encontrar na tabela detalhada
  let presuncaoIrpj, presuncaoCsll, nomeAtividade, descricaoAtividade;
  
  if (ATIVIDADES_LUCRO_PRESUMIDO[atividadeEspecifica]) {
    const atividadeInfo = ATIVIDADES_LUCRO_PRESUMIDO[atividadeEspecifica];
    presuncaoIrpj = atividadeInfo.presuncaoIrpj;
    presuncaoCsll = atividadeInfo.presuncaoCsll;
    nomeAtividade = atividadeInfo.nome;
    descricaoAtividade = atividadeInfo.descricao;
  } 
  // Fallback para compatibilidade com tipos simples (comercio/industria/servico)
  else if (PRESUNCAO_IRPJ_LEGACY[atividade] !== undefined) {
    presuncaoIrpj = PRESUNCAO_IRPJ_LEGACY[atividade];
    presuncaoCsll = PRESUNCAO_CSLL_LEGACY[atividade];
    nomeAtividade = atividade.charAt(0).toUpperCase() + atividade.slice(1);
    descricaoAtividade = `Atividade genérica de ${atividade}`;
  }
  else {
    throw new Error(`Atividade "${atividadeEspecifica || atividade}" não encontrada`);
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
  const aliquotaEfetiva = rbt12 > 0 ? (impostoTotal / rbt12) * 100 : 0;

  return {
    regime: 'Lucro Presumido',
    rbt12: parseFloat(rbt12.toFixed(2)),
    atividade,
    atividadeEspecifica: atividadeEspecifica,
    nomeAtividade,
    lucroPresumido: parseFloat(lucroPresumidoIrpj.toFixed(2)),
    impostoTotal: parseFloat(impostoTotal.toFixed(2)),
    aliquotaEfetiva: parseFloat(aliquotaEfetiva.toFixed(2)),
    detalhamento: {
      atividadeNome: nomeAtividade,
      atividadeDescricao: descricaoAtividade,
      presuncaoLucroIrpj: `${(presuncaoIrpj * 100).toFixed(1)}%`,
      presuncaoLucroCsll: `${(presuncaoCsll * 100).toFixed(1)}%`,
      lucroPresumidoIrpj: parseFloat(lucroPresumidoIrpj.toFixed(2)),
      lucroPresumidoCsll: parseFloat(lucroPresumidoCsll.toFixed(2)),
      irpj: parseFloat(irpj.toFixed(2)),
      irpjAdicional: parseFloat(irpjAdicional.toFixed(2)),
      csll: parseFloat(csll.toFixed(2)),
      irpjCsll: parseFloat(irpjCsll.toFixed(2)),
      pis: parseFloat(pis.toFixed(2)),
      cofins: parseFloat(cofins.toFixed(2)),
      pisCofins: parseFloat(pisCofins.toFixed(2)),
      iss: parseFloat(iss.toFixed(2)),
      observacaoLegal: 'Percentuais de presunção conforme Lei 9.249/95, art. 15 (IRPJ) e art. 20 (CSLL)'
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
  
  // Créditos: sobre despesas que geram crédito (insumos, mercadorias, etc.)
  // Nem todas as despesas geram crédito - folha, por exemplo, não gera
  // Percentual estimado de despesas creditáveis por tipo de atividade:
  // - Comércio/Indústria: ~70% (mercadorias, matéria-prima, fretes, energia)
  // - Serviços: ~30% (menos insumos, mais mão de obra que não gera crédito)
  const percentualCredito = (atividade === 'servico') ? 0.30 : 0.70;
  const despesasCreditaveis = despesas * percentualCredito;
  const pisCredito = despesasCreditaveis * ALIQUOTAS_REAL.PIS;
  const cofinsCredito = despesasCreditaveis * ALIQUOTAS_REAL.COFINS;
  
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
      despesasCreditaveis: parseFloat(despesasCreditaveis.toFixed(2)),
      percentualCreditoPisCofins: `${percentualCredito * 100}%`,
      observacao: lucroLiquido <= 0 
        ? 'Lucro zero ou negativo - IRPJ/CSLL = 0' 
        : `PIS/COFINS não-cumulativo com créditos sobre ${percentualCredito * 100}% das despesas (exceto folha)`
    }
  };
};

// ============================================
// COMPARAÇÃO DOS REGIMES
// ============================================

export const compararRegimes = (dados) => {
  // Aceita tanto "receita" quanto "rbt12" como nome do campo
  const receita = dados.receita || dados.rbt12;
  const { folha, atividade, despesas, atividadePresumido } = dados;

  const dataCalculo = {
    rbt12: parseFloat(receita) || 0,
    folha: parseFloat(folha) || 0,
    atividade: atividade,
    despesas: parseFloat(despesas) || 0,
    // Para Lucro Presumido: usa atividade específica se fornecida
    atividadePresumido: atividadePresumido || atividade
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

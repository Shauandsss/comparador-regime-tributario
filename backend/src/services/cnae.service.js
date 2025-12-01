/**
 * Serviço de consulta CNAE
 * Responsável pela lógica de negócio de busca e análise de CNAEs
 */

import { 
  buscarCnaePorCodigo, 
  buscarCnaes, 
  listarCnaesPorAnexo,
  listarCnaesComFatorR,
  listarCnaesImpedidos 
} from '../data/cnae-database.js';

/**
 * Tabela de alíquotas do Simples Nacional por Anexo e faixa de RBT12
 */
const tabelasAnexos = {
  I: [
    { ate: 180000, aliquota: 4.0, deducao: 0 },
    { ate: 360000, aliquota: 7.3, deducao: 5940 },
    { ate: 720000, aliquota: 9.5, deducao: 13860 },
    { ate: 1800000, aliquota: 10.7, deducao: 22500 },
    { ate: 3600000, aliquota: 14.3, deducao: 87300 },
    { ate: 4800000, aliquota: 19.0, deducao: 378000 }
  ],
  II: [
    { ate: 180000, aliquota: 4.5, deducao: 0 },
    { ate: 360000, aliquota: 7.8, deducao: 5940 },
    { ate: 720000, aliquota: 10.0, deducao: 13860 },
    { ate: 1800000, aliquota: 11.2, deducao: 22500 },
    { ate: 3600000, aliquota: 14.7, deducao: 85500 },
    { ate: 4800000, aliquota: 30.0, deducao: 720000 }
  ],
  III: [
    { ate: 180000, aliquota: 6.0, deducao: 0 },
    { ate: 360000, aliquota: 11.2, deducao: 9360 },
    { ate: 720000, aliquota: 13.5, deducao: 17640 },
    { ate: 1800000, aliquota: 16.0, deducao: 35640 },
    { ate: 3600000, aliquota: 21.0, deducao: 125640 },
    { ate: 4800000, aliquota: 33.0, deducao: 648000 }
  ],
  IV: [
    { ate: 180000, aliquota: 4.5, deducao: 0 },
    { ate: 360000, aliquota: 9.0, deducao: 8100 },
    { ate: 720000, aliquota: 10.2, deducao: 12420 },
    { ate: 1800000, aliquota: 14.0, deducao: 39780 },
    { ate: 3600000, aliquota: 22.0, deducao: 183780 },
    { ate: 4800000, aliquota: 33.0, deducao: 828000 }
  ],
  V: [
    { ate: 180000, aliquota: 15.5, deducao: 0 },
    { ate: 360000, aliquota: 18.0, deducao: 4500 },
    { ate: 720000, aliquota: 19.5, deducao: 9900 },
    { ate: 1800000, aliquota: 20.5, deducao: 17100 },
    { ate: 3600000, aliquota: 23.0, deducao: 62100 },
    { ate: 4800000, aliquota: 30.5, deducao: 540000 }
  ]
};

/**
 * Calcula a alíquota efetiva do Simples Nacional
 * @param {string} anexo - Anexo (I, II, III, IV, V)
 * @param {number} rbt12 - Receita Bruta dos últimos 12 meses
 * @returns {object} - Alíquota nominal, dedução e alíquota efetiva
 */
function calcularAliquotaEfetiva(anexo, rbt12) {
  const tabela = tabelasAnexos[anexo];
  if (!tabela) {
    return null;
  }

  const faixa = tabela.find(f => rbt12 <= f.ate);
  if (!faixa) {
    return null; // Ultrapassou limite do Simples
  }

  const aliquotaEfetiva = ((rbt12 * (faixa.aliquota / 100)) - faixa.deducao) / rbt12 * 100;

  return {
    aliquotaNominal: faixa.aliquota,
    parcelaRedutora: faixa.deducao,
    aliquotaEfetiva: Math.max(aliquotaEfetiva, 0).toFixed(2),
    faixa: faixa.ate
  };
}

/**
 * Busca CNAE por código e retorna análise completa
 * @param {string} codigo - Código CNAE
 * @param {number} rbt12 - Receita Bruta 12 meses (opcional)
 * @returns {object} - Dados do CNAE com análise
 */
export function consultarCnae(codigo, rbt12 = null) {
  const cnae = buscarCnaePorCodigo(codigo);
  
  if (!cnae) {
    return {
      encontrado: false,
      mensagem: `CNAE ${codigo} não encontrado na base de dados`
    };
  }

  const resultado = {
    encontrado: true,
    cnae: {
      codigo: cnae.codigo,
      codigoFormatado: formatarCodigo(cnae.codigo),
      descricao: cnae.descricao
    },
    simplesNacional: {
      permitido: !cnae.impedimentos,
      anexo: cnae.anexo,
      anexoAlternativo: cnae.anexoAlternativo,
      fatorR: cnae.fatorR,
      observacaoFatorR: cnae.fatorR 
        ? 'Se Fator R >= 28%, empresa pode tributar pelo Anexo III (mais vantajoso)'
        : null
    },
    lucroPresumido: {
      percentualPresuncao: cnae.percentualPresuncao,
      descricaoPresuncao: getDescricaoPresuncao(cnae.percentualPresuncao)
    },
    iss: {
      aplicavel: cnae.aliquotaISS !== null,
      aliquota: cnae.aliquotaISS,
      observacao: cnae.aliquotaISS 
        ? `Alíquota de ISS varia de 2% a 5% conforme município. Referência: ${cnae.aliquotaISS}%`
        : 'Atividade não sujeita ao ISS'
    },
    riscos: cnae.riscos || [],
    impedimentos: cnae.impedimentos
  };

  // Se foi informado RBT12, calcular alíquotas
  if (rbt12 && cnae.anexo && !cnae.impedimentos) {
    resultado.simplesNacional.simulacao = {
      rbt12: rbt12,
      anexoPrincipal: calcularAliquotaEfetiva(cnae.anexo, rbt12)
    };

    if (cnae.anexoAlternativo) {
      resultado.simplesNacional.simulacao.anexoAlternativo = calcularAliquotaEfetiva(cnae.anexoAlternativo, rbt12);
    }
  }

  return resultado;
}

/**
 * Busca CNAEs por termo (autocomplete)
 * @param {string} termo - Termo de busca
 * @param {number} limite - Limite de resultados
 * @returns {array} - Lista de CNAEs formatados
 */
export function pesquisarCnaes(termo, limite = 20) {
  const resultados = buscarCnaes(termo, limite);
  
  return resultados.map(cnae => ({
    codigo: cnae.codigo,
    codigoFormatado: formatarCodigo(cnae.codigo),
    descricao: cnae.descricao,
    anexo: cnae.anexo,
    fatorR: cnae.fatorR,
    impedido: cnae.impedimentos
  }));
}

/**
 * Retorna estatísticas gerais dos CNAEs
 * @returns {object} - Estatísticas
 */
export function obterEstatisticas() {
  return {
    totalCnaes: buscarCnaes('', 1000).length,
    porAnexo: {
      I: listarCnaesPorAnexo('I').length,
      II: listarCnaesPorAnexo('II').length,
      III: listarCnaesPorAnexo('III').length,
      IV: listarCnaesPorAnexo('IV').length,
      V: listarCnaesPorAnexo('V').length
    },
    comFatorR: listarCnaesComFatorR().length,
    impedidos: listarCnaesImpedidos().length
  };
}

/**
 * Lista CNAEs por anexo com formatação
 * @param {string} anexo - Anexo (I, II, III, IV, V)
 * @returns {array} - Lista de CNAEs
 */
export function listarPorAnexo(anexo) {
  const cnaes = listarCnaesPorAnexo(anexo);
  return cnaes.map(cnae => ({
    codigo: cnae.codigo,
    codigoFormatado: formatarCodigo(cnae.codigo),
    descricao: cnae.descricao,
    fatorR: cnae.fatorR,
    anexoAlternativo: cnae.anexoAlternativo
  }));
}

/**
 * Formata código CNAE (0000-0/00)
 * @param {string} codigo - Código CNAE
 * @returns {string} - Código formatado
 */
function formatarCodigo(codigo) {
  if (!codigo || codigo.length !== 7) return codigo;
  return `${codigo.slice(0, 4)}-${codigo.slice(4, 5)}/${codigo.slice(5, 7)}`;
}

/**
 * Retorna descrição do percentual de presunção
 * @param {number} percentual - Percentual de presunção
 * @returns {string} - Descrição
 */
function getDescricaoPresuncao(percentual) {
  const descricoes = {
    8: 'Comércio, Indústria, Transporte de cargas, Atividades imobiliárias',
    16: 'Transporte de passageiros',
    32: 'Serviços em geral'
  };
  return descricoes[percentual] || 'Consultar legislação específica';
}

export default {
  consultarCnae,
  pesquisarCnaes,
  obterEstatisticas,
  listarPorAnexo
};

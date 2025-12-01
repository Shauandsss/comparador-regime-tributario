/**
 * Controller de CNAE
 * Gerencia as requisições HTTP relacionadas a CNAEs
 */

import cnaeService from '../services/cnae.service.js';

/**
 * GET /cnae/:id
 * Consulta CNAE por código
 */
export async function consultarCnae(req, res) {
  try {
    const { id } = req.params;
    const { rbt12 } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Código CNAE é obrigatório'
      });
    }

    // Validar formato do código (7 dígitos)
    const codigoLimpo = id.replace(/[.-/]/g, '');
    if (codigoLimpo.length !== 7 || !/^\d+$/.test(codigoLimpo)) {
      return res.status(400).json({
        success: false,
        error: 'Código CNAE deve conter 7 dígitos numéricos'
      });
    }

    const rbt12Valor = rbt12 ? parseFloat(rbt12) : null;
    
    if (rbt12 && (isNaN(rbt12Valor) || rbt12Valor < 0)) {
      return res.status(400).json({
        success: false,
        error: 'RBT12 deve ser um valor numérico positivo'
      });
    }

    const resultado = cnaeService.consultarCnae(codigoLimpo, rbt12Valor);

    if (!resultado.encontrado) {
      return res.status(404).json({
        success: false,
        error: resultado.mensagem
      });
    }

    return res.json({
      success: true,
      data: resultado
    });

  } catch (error) {
    console.error('Erro ao consultar CNAE:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao consultar CNAE'
    });
  }
}

/**
 * GET /cnae/buscar
 * Busca CNAEs por termo (autocomplete)
 */
export async function buscarCnaes(req, res) {
  try {
    const { q, limite } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Termo de busca deve ter pelo menos 2 caracteres'
      });
    }

    const limiteValor = limite ? parseInt(limite) : 20;
    
    if (isNaN(limiteValor) || limiteValor < 1 || limiteValor > 100) {
      return res.status(400).json({
        success: false,
        error: 'Limite deve ser um número entre 1 e 100'
      });
    }

    const resultados = cnaeService.pesquisarCnaes(q.trim(), limiteValor);

    return res.json({
      success: true,
      total: resultados.length,
      data: resultados
    });

  } catch (error) {
    console.error('Erro ao buscar CNAEs:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao buscar CNAEs'
    });
  }
}

/**
 * GET /cnae/anexo/:anexo
 * Lista CNAEs de um anexo específico
 */
export async function listarPorAnexo(req, res) {
  try {
    const { anexo } = req.params;
    
    const anexosValidos = ['I', 'II', 'III', 'IV', 'V'];
    const anexoUpper = anexo.toUpperCase();

    if (!anexosValidos.includes(anexoUpper)) {
      return res.status(400).json({
        success: false,
        error: 'Anexo inválido. Valores permitidos: I, II, III, IV, V'
      });
    }

    const resultados = cnaeService.listarPorAnexo(anexoUpper);

    return res.json({
      success: true,
      anexo: anexoUpper,
      total: resultados.length,
      data: resultados
    });

  } catch (error) {
    console.error('Erro ao listar CNAEs por anexo:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao listar CNAEs'
    });
  }
}

/**
 * GET /cnae/estatisticas
 * Retorna estatísticas gerais dos CNAEs
 */
export async function obterEstatisticas(req, res) {
  try {
    const estatisticas = cnaeService.obterEstatisticas();

    return res.json({
      success: true,
      data: estatisticas
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao obter estatísticas'
    });
  }
}

export default {
  consultarCnae,
  buscarCnaes,
  listarPorAnexo,
  obterEstatisticas
};

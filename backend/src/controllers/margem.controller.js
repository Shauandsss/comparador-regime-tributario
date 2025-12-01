/**
 * Controller de Margem e Tributos
 * Gerencia requisições de cálculo de preço e margem
 */

import margemService from '../services/margem.service.js';

/**
 * POST /margem/calcular
 * Calcula preço mínimo e margem líquida
 */
export async function calcularMargem(req, res) {
  try {
    const {
      custoUnitario,
      despesasFixasMensais,
      despesasVariaveisPercentual,
      quantidadeMensal,
      regime,
      anexoSimples,
      rbt12,
      atividadePresumido,
      margemDesejada
    } = req.body;

    // Validações básicas
    if (custoUnitario === undefined || custoUnitario < 0) {
      return res.status(400).json({
        success: false,
        error: 'Custo unitário é obrigatório e deve ser >= 0'
      });
    }

    if (despesasFixasMensais === undefined || despesasFixasMensais < 0) {
      return res.status(400).json({
        success: false,
        error: 'Despesas fixas mensais são obrigatórias e devem ser >= 0'
      });
    }

    if (!quantidadeMensal || quantidadeMensal <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantidade mensal é obrigatória e deve ser > 0'
      });
    }

    if (!regime || !['simples', 'presumido', 'real'].includes(regime)) {
      return res.status(400).json({
        success: false,
        error: 'Regime tributário inválido. Use: simples, presumido ou real'
      });
    }

    if (regime === 'simples' && anexoSimples && !['I', 'II', 'III', 'IV', 'V'].includes(anexoSimples)) {
      return res.status(400).json({
        success: false,
        error: 'Anexo do Simples inválido. Use: I, II, III, IV ou V'
      });
    }

    const resultado = margemService.calcularMargemTributos({
      custoUnitario: parseFloat(custoUnitario),
      despesasFixasMensais: parseFloat(despesasFixasMensais),
      despesasVariaveisPercentual: parseFloat(despesasVariaveisPercentual) || 0,
      quantidadeMensal: parseInt(quantidadeMensal),
      regime,
      anexoSimples: anexoSimples || 'III',
      rbt12: parseFloat(rbt12) || 360000,
      atividadePresumido: atividadePresumido || 'servicos',
      margemDesejada: parseFloat(margemDesejada) || 0
    });

    return res.json({
      success: true,
      data: resultado
    });

  } catch (error) {
    console.error('Erro ao calcular margem:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Erro interno ao calcular margem'
    });
  }
}

/**
 * POST /margem/comparar
 * Compara margens entre diferentes regimes tributários
 */
export async function compararRegimes(req, res) {
  try {
    const {
      custoUnitario,
      despesasFixasMensais,
      despesasVariaveisPercentual,
      quantidadeMensal,
      anexoSimples,
      rbt12,
      atividadePresumido,
      margemDesejada
    } = req.body;

    // Validações básicas
    if (custoUnitario === undefined || custoUnitario < 0) {
      return res.status(400).json({
        success: false,
        error: 'Custo unitário é obrigatório e deve ser >= 0'
      });
    }

    if (!quantidadeMensal || quantidadeMensal <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantidade mensal é obrigatória e deve ser > 0'
      });
    }

    const resultado = margemService.compararRegimes({
      custoUnitario: parseFloat(custoUnitario),
      despesasFixasMensais: parseFloat(despesasFixasMensais) || 0,
      despesasVariaveisPercentual: parseFloat(despesasVariaveisPercentual) || 0,
      quantidadeMensal: parseInt(quantidadeMensal),
      anexoSimples: anexoSimples || 'III',
      rbt12: parseFloat(rbt12) || 360000,
      atividadePresumido: atividadePresumido || 'servicos',
      margemDesejada: parseFloat(margemDesejada) || 0
    });

    return res.json({
      success: true,
      data: resultado
    });

  } catch (error) {
    console.error('Erro ao comparar regimes:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno ao comparar regimes'
    });
  }
}

export default {
  calcularMargem,
  compararRegimes
};

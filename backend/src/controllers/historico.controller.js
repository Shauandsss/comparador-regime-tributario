/**
 * Controller de Histórico Tributário
 * Endpoints para gerenciar histórico mês a mês
 */

import * as historicoService from '../services/historico.service.js';

/**
 * POST /historico
 * Salvar registro mensal
 */
async function salvarMes(req, res) {
  try {
    const dados = req.body;

    // Validação básica
    if (!dados.mes || !dados.ano || !dados.faturamento || !dados.regime || dados.tributosPagos === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: mes, ano, faturamento, regime, tributosPagos'
      });
    }

    const registro = historicoService.salvarMes(dados);

    res.status(201).json({
      success: true,
      data: registro,
      message: 'Registro salvo com sucesso'
    });
  } catch (error) {
    console.error('Erro ao salvar registro:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * GET /historico
 * Obter histórico completo com estatísticas
 */
async function obterHistorico(req, res) {
  try {
    const { empresaId = 'default', anoInicio, anoFim, regime } = req.query;
    
    const filtros = {};
    if (anoInicio) filtros.anoInicio = parseInt(anoInicio);
    if (anoFim) filtros.anoFim = parseInt(anoFim);
    if (regime) filtros.regime = regime;

    const resultado = historicoService.obterHistorico(empresaId, filtros);

    res.json({
      success: true,
      data: resultado
    });
  } catch (error) {
    console.error('Erro ao obter histórico:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * GET /historico/grafico
 * Dados formatados para gráfico
 */
async function dadosGrafico(req, res) {
  try {
    const { empresaId = 'default' } = req.query;
    
    const dados = historicoService.dadosParaGrafico(empresaId);

    res.json({
      success: true,
      data: dados
    });
  } catch (error) {
    console.error('Erro ao gerar dados do gráfico:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * DELETE /historico/:ano/:mes
 * Remover registro específico
 */
async function removerMes(req, res) {
  try {
    const { ano, mes } = req.params;
    const { empresaId = 'default' } = req.query;

    const removido = historicoService.removerMes(empresaId, parseInt(mes), parseInt(ano));

    if (removido) {
      res.json({
        success: true,
        message: 'Registro removido com sucesso'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Registro não encontrado'
      });
    }
  } catch (error) {
    console.error('Erro ao remover registro:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * POST /historico/comparar
 * Comparar dois períodos
 */
async function compararPeriodos(req, res) {
  try {
    const { empresaId = 'default', periodo1, periodo2 } = req.body;

    if (!periodo1 || !periodo2) {
      return res.status(400).json({
        success: false,
        error: 'Informe os dois períodos para comparação'
      });
    }

    const comparacao = historicoService.compararPeriodos(empresaId, periodo1, periodo2);

    res.json({
      success: true,
      data: comparacao
    });
  } catch (error) {
    console.error('Erro ao comparar períodos:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * POST /historico/lote
 * Salvar múltiplos registros de uma vez
 */
async function salvarLote(req, res) {
  try {
    const { registros, empresaId = 'default' } = req.body;

    if (!registros || !Array.isArray(registros)) {
      return res.status(400).json({
        success: false,
        error: 'Informe um array de registros'
      });
    }

    const resultados = [];
    const erros = [];

    for (const registro of registros) {
      try {
        const salvo = historicoService.salvarMes({ ...registro, empresaId });
        resultados.push(salvo);
      } catch (error) {
        erros.push({
          registro,
          erro: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      data: {
        salvos: resultados.length,
        erros: erros.length,
        resultados,
        errosDetalhados: erros
      }
    });
  } catch (error) {
    console.error('Erro ao salvar lote:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export {
  salvarMes,
  obterHistorico,
  dadosGrafico,
  removerMes,
  compararPeriodos,
  salvarLote
};

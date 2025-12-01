/**
 * Controller de Diagnóstico Tributário Inteligente
 */

import * as diagnosticoService from '../services/diagnostico.service.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * POST /diagnostico/analisar
 * Analisa empresa e recomenda melhor regime
 */
async function analisarController(req, res) {
  try {
    const {
      receitaBruta12,
      receitaMes,
      despesasMes,
      folhaMes,
      folha12,
      atividade
    } = req.body;

    // Converte strings para números
    const dados = {
      receitaBruta12: parseFloat(receitaBruta12),
      receitaMes: parseFloat(receitaMes),
      despesasMes: despesasMes ? parseFloat(despesasMes) : 0,
      folhaMes: folhaMes ? parseFloat(folhaMes) : 0,
      folha12: folha12 ? parseFloat(folha12) : null,
      atividade: atividade || 'servicos'
    };

    // Valida dados básicos
    if (!dados.receitaBruta12 || dados.receitaBruta12 <= 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        erro: true,
        mensagem: 'Receita Bruta anual é obrigatória e deve ser maior que zero'
      });
    }

    if (!dados.receitaMes || dados.receitaMes <= 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        erro: true,
        mensagem: 'Receita mensal é obrigatória e deve ser maior que zero'
      });
    }

    // Calcula diagnóstico
    const resultado = diagnosticoService.diagnosticar(dados);

    res.status(HTTP_STATUS.OK).json({
      sucesso: true,
      dados: resultado
    });

  } catch (error) {
    console.error('Erro no diagnóstico:', error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      erro: true,
      mensagem: error.message || 'Erro ao processar diagnóstico'
    });
  }
}

/**
 * POST /diagnostico/simular-cenarios
 * Simula cenários alternativos
 */
async function simularCenariosController(req, res) {
  try {
    const {
      receitaBruta12,
      receitaMes,
      despesasMes,
      folhaMes,
      folha12,
      atividade
    } = req.body;

    // Converte strings para números
    const dados = {
      receitaBruta12: parseFloat(receitaBruta12),
      receitaMes: parseFloat(receitaMes),
      despesasMes: despesasMes ? parseFloat(despesasMes) : 0,
      folhaMes: folhaMes ? parseFloat(folhaMes) : 0,
      folha12: folha12 ? parseFloat(folha12) : null,
      atividade: atividade || 'servicos'
    };

    // Valida dados
    if (!dados.receitaBruta12 || dados.receitaBruta12 <= 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        erro: true,
        mensagem: 'Receita Bruta anual é obrigatória'
      });
    }

    // Simula cenários
    const cenarios = diagnosticoService.simularCenarios(dados);

    res.status(HTTP_STATUS.OK).json({
      sucesso: true,
      dados: cenarios
    });

  } catch (error) {
    console.error('Erro ao simular cenários:', error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      erro: true,
      mensagem: error.message || 'Erro ao simular cenários'
    });
  }
}

export {
  analisarController,
  simularCenariosController
};

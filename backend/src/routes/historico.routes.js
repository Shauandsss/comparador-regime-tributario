/**
 * Rotas de Histórico Tributário
 * @module routes/historico
 */

import express from 'express';
import * as historicoController from '../controllers/historico.controller.js';

const router = express.Router();

/**
 * @route POST /historico
 * @description Salvar registro mensal
 * @body {number} mes - Mês (1-12)
 * @body {number} ano - Ano
 * @body {number} faturamento - Faturamento do mês
 * @body {string} regime - Regime tributário (simples, presumido, real, mei)
 * @body {number} tributosPagos - Total de tributos pagos
 * @body {Object} detalhamento - Detalhes opcionais dos tributos
 */
router.post('/', historicoController.salvarMes);

/**
 * @route GET /historico
 * @description Obter histórico completo com estatísticas
 * @query {string} empresaId - ID da empresa (default: 'default')
 * @query {number} anoInicio - Filtrar a partir do ano
 * @query {number} anoFim - Filtrar até o ano
 * @query {string} regime - Filtrar por regime
 */
router.get('/', historicoController.obterHistorico);

/**
 * @route GET /historico/grafico
 * @description Dados formatados para gráfico
 * @query {string} empresaId - ID da empresa
 */
router.get('/grafico', historicoController.dadosGrafico);

/**
 * @route DELETE /historico/:ano/:mes
 * @description Remover registro específico
 * @param {number} ano - Ano do registro
 * @param {number} mes - Mês do registro
 */
router.delete('/:ano/:mes', historicoController.removerMes);

/**
 * @route POST /historico/comparar
 * @description Comparar dois períodos
 * @body {Object} periodo1 - { anoInicio, anoFim }
 * @body {Object} periodo2 - { anoInicio, anoFim }
 */
router.post('/comparar', historicoController.compararPeriodos);

/**
 * @route POST /historico/lote
 * @description Salvar múltiplos registros de uma vez
 * @body {Array} registros - Array de registros mensais
 */
router.post('/lote', historicoController.salvarLote);

export default router;

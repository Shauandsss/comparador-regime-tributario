/**
 * Rotas de Margem e Tributos
 * Endpoints para cálculo de preço e margem
 */

import express from 'express';
import { calcularMargem, compararRegimes } from '../controllers/margem.controller.js';

const router = express.Router();

/**
 * @route POST /margem/calcular
 * @desc Calcula preço mínimo e margem líquida
 * @body {number} custoUnitario - Custo unitário do produto/serviço
 * @body {number} despesasFixasMensais - Total de despesas fixas mensais
 * @body {number} despesasVariaveisPercentual - Percentual de despesas variáveis sobre venda
 * @body {number} quantidadeMensal - Quantidade vendida por mês
 * @body {string} regime - Regime tributário (simples, presumido, real)
 * @body {string} anexoSimples - Anexo do Simples Nacional (I, II, III, IV, V)
 * @body {number} rbt12 - Receita Bruta 12 meses (para Simples)
 * @body {string} atividadePresumido - Tipo de atividade (comercio, industria, servicos)
 * @body {number} margemDesejada - Margem de lucro desejada em %
 * @returns {object} Cálculo detalhado de preço e margem
 */
router.post('/calcular', calcularMargem);

/**
 * @route POST /margem/comparar
 * @desc Compara margens entre diferentes regimes tributários
 * @body Mesmos parâmetros de /calcular (exceto regime)
 * @returns {object} Comparativo entre regimes com melhor opção
 */
router.post('/comparar', compararRegimes);

export default router;

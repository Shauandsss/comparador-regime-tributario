/**
 * Rotas de Diagnóstico Tributário Inteligente
 */

import express from 'express';
import { analisarController, simularCenariosController } from '../controllers/diagnostico.controller.js';

const router = express.Router();

/**
 * @route POST /diagnostico/analisar
 * @description Analisa empresa e recomenda melhor regime tributário
 * @body {
 *   receitaBruta12: number,
 *   receitaMes: number,
 *   despesasMes?: number,
 *   folhaMes?: number,
 *   folha12?: number,
 *   atividade?: string
 * }
 * @returns {object} Diagnóstico completo com ranking e recomendações
 */
router.post('/analisar', analisarController);

/**
 * @route POST /diagnostico/simular-cenarios
 * @description Simula cenários alternativos (aumentar folha, reduzir despesas)
 * @body {
 *   receitaBruta12: number,
 *   receitaMes: number,
 *   despesasMes?: number,
 *   folhaMes?: number,
 *   folha12?: number,
 *   atividade?: string
 * }
 * @returns {array} Lista de cenários com impactos
 */
router.post('/simular-cenarios', simularCenariosController);

export default router;

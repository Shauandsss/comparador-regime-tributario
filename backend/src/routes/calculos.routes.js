/**
 * Rotas de Cálculos Tributários
 */

import express from 'express';
import * as calculosController from '../controllers/calculos.controller.js';
import { validateCalculo } from '../validations/calculos.schema.js';

const router = express.Router();

/**
 * POST /calcular/simples
 * Calcula impostos no regime Simples Nacional
 */
router.post('/simples', validateCalculo, calculosController.calcularSimplesNacional);

/**
 * POST /calcular/presumido
 * Calcula impostos no regime Lucro Presumido
 */
router.post('/presumido', validateCalculo, calculosController.calcularLucroPresumido);

/**
 * POST /calcular/real
 * Calcula impostos no regime Lucro Real
 */
router.post('/real', validateCalculo, calculosController.calcularLucroReal);

/**
 * POST /calcular/comparar
 * Compara os três regimes tributários
 */
router.post('/comparar', validateCalculo, calculosController.comparar);

/**
 * GET /calcular/info
 * Obtém informações sobre os regimes tributários
 */
router.get('/info', calculosController.getInfo);

export default router;

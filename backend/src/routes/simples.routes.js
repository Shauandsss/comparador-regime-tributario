/**
 * Rotas do Simples Nacional
 */
import express from 'express';
import { calcularDASController } from '../controllers/simples.das.controller.js';
import { calcularFatorRController } from '../controllers/fator-r.controller.js';

const router = express.Router();

/**
 * GET /simples/das
 * Calcula o DAS do Simples Nacional
 * 
 * Query Params:
 * - rbt12: Receita Bruta Total dos últimos 12 meses (number)
 * - faturamentoMes: Faturamento do mês atual (number)
 * - cnae: Código CNAE da atividade (string)
 * - folha12: Folha de salários dos últimos 12 meses (number, opcional)
 * 
 * Exemplo:
 * GET /simples/das?rbt12=500000&faturamentoMes=50000&cnae=4711-3&folha12=150000
 */
router.get('/das', calcularDASController);

/**
 * GET /simples/fator-r
 * Calcula o Fator R e determina o anexo aplicável
 * 
 * Query Params:
 * - folha12: Folha de salários dos últimos 12 meses (number)
 * - rbt12: Receita Bruta Total dos últimos 12 meses (number)
 * 
 * Exemplo:
 * GET /simples/fator-r?folha12=150000&rbt12=500000
 */
router.get('/fator-r', calcularFatorRController);

export default router;

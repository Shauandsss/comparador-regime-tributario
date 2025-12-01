/**
 * Rotas do Lucro Real
 */
import express from 'express';
import { calcularRealController } from '../controllers/lucro-real.controller.js';

const router = express.Router();

/**
 * POST /real/calcular
 * Calcula IRPJ, CSLL, PIS, COFINS no Lucro Real
 * 
 * Body:
 * - receita: Receita bruta do período (number, obrigatório)
 * - despesas: Despesas operacionais (number, opcional)
 * - folha: Folha de pagamento (number, opcional)
 * - creditosPis: Créditos de PIS (number, opcional)
 * - creditosCofins: Créditos de COFINS (number, opcional)
 * - periodo: Período de apuração (string: trimestral ou anual, opcional)
 * 
 * Exemplo:
 * POST /real/calcular
 * { "receita": 500000, "despesas": 350000, "folha": 80000, "creditosPis": 2000, "creditosCofins": 9000, "periodo": "trimestral" }
 */
router.post('/calcular', calcularRealController);

export default router;

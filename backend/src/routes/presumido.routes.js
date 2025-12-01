/**
 * Rotas do Lucro Presumido
 */
import express from 'express';
import { calcularPresumidoController, listarAtividadesController } from '../controllers/lucro-presumido.controller.js';

const router = express.Router();

/**
 * POST /presumido/calcular
 * Calcula IRPJ, CSLL, PIS, COFINS no Lucro Presumido
 * 
 * Body:
 * - receita: Receita bruta do período (number)
 * - atividade: Tipo de atividade (string: comercio, servicos, servicos_especificos, servicos_profissionais, intermediacao)
 * - periodo: Período de apuração (string: trimestral ou mensal, opcional)
 * - aliquotaISS: Alíquota de ISS do município (number 0-5, opcional)
 * 
 * Exemplo:
 * POST /presumido/calcular
 * { "receita": 100000, "atividade": "servicos", "periodo": "trimestral", "aliquotaISS": 3 }
 */
router.post('/calcular', calcularPresumidoController);

/**
 * GET /presumido/atividades
 * Lista todas as atividades com percentuais de presunção
 */
router.get('/atividades', listarAtividadesController);

export default router;

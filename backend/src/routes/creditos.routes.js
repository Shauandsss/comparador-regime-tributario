/**
 * Rotas de Créditos PIS/COFINS
 */
import express from 'express';
import { calcularCreditosController, simularEconomiaController } from '../controllers/creditos-pis-cofins.controller.js';

const router = express.Router();

/**
 * POST /creditos/calcular
 * Calcula créditos de PIS/COFINS baseado nas despesas
 * 
 * Body (todos opcionais, pelo menos um obrigatório):
 * - insumos: Valor de insumos (number)
 * - energia: Valor de energia elétrica (number)
 * - aluguel: Valor de aluguéis (number)
 * - frete: Valor de fretes (number)
 * - armazenagem: Valor de armazenagem (number)
 * - encargosDepreciacao: Valor de depreciação (number)
 * - bensVendidos: Valor de bens para revenda (number)
 * - devolucoesVendas: Valor de devoluções (number)
 * 
 * Exemplo:
 * POST /creditos/calcular
 * { "insumos": 50000, "energia": 8000, "aluguel": 5000, "frete": 3000 }
 */
router.post('/calcular', calcularCreditosController);

/**
 * POST /creditos/simular
 * Simula economia comparando cenário com e sem créditos
 * 
 * Body:
 * - receitaBruta: Receita bruta do período (number, obrigatório)
 * - Demais campos iguais ao /calcular
 * 
 * Exemplo:
 * POST /creditos/simular
 * { "receitaBruta": 200000, "insumos": 50000, "energia": 8000, "aluguel": 5000 }
 */
router.post('/simular', simularEconomiaController);

export default router;

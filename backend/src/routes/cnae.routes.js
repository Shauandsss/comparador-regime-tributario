/**
 * Rotas de CNAE
 * Endpoints para consulta e busca de CNAEs
 */

import express from 'express';
import { 
  consultarCnae, 
  buscarCnaes, 
  listarPorAnexo, 
  obterEstatisticas 
} from '../controllers/cnae.controller.js';

const router = express.Router();

/**
 * @route GET /cnae/buscar
 * @desc Busca CNAEs por termo (autocomplete)
 * @query {string} q - Termo de busca (código ou descrição)
 * @query {number} limite - Limite de resultados (default: 20, max: 100)
 * @returns {array} Lista de CNAEs encontrados
 */
router.get('/buscar', buscarCnaes);

/**
 * @route GET /cnae/estatisticas
 * @desc Retorna estatísticas gerais da base de CNAEs
 * @returns {object} Estatísticas
 */
router.get('/estatisticas', obterEstatisticas);

/**
 * @route GET /cnae/anexo/:anexo
 * @desc Lista todos os CNAEs de um anexo específico
 * @param {string} anexo - Anexo do Simples Nacional (I, II, III, IV, V)
 * @returns {array} Lista de CNAEs do anexo
 */
router.get('/anexo/:anexo', listarPorAnexo);

/**
 * @route GET /cnae/:id
 * @desc Consulta CNAE por código
 * @param {string} id - Código CNAE (7 dígitos)
 * @query {number} rbt12 - Receita Bruta 12 meses (opcional, para simular alíquotas)
 * @returns {object} Dados completos do CNAE
 */
router.get('/:id', consultarCnae);

export default router;

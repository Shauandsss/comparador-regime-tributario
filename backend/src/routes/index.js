import express from 'express';
import calculosRoutes from './calculos.routes.js';
import simplesRoutes from './simples.routes.js';
import presumidoRoutes from './presumido.routes.js';
import realRoutes from './real.routes.js';
import creditosRoutes from './creditos.routes.js';
import diagnosticoRoutes from './diagnostico.routes.js';
import cnaeRoutes from './cnae.routes.js';
import margemRoutes from './margem.routes.js';
import historicoRoutes from './historico.routes.js';

const router = express.Router();

// Rota de status - Health Check
router.get('/status', (req, res) => {
  res.status(200).json({ ok: true });
});

// Rota raiz
router.get('/', (req, res) => {
  res.json({
    message: 'API Comparador Tributário',
    version: '1.0.0',
    endpoints: {
      status: '/status',
      calcularSimples: 'POST /calcular/simples',
      calcularPresumido: 'POST /calcular/presumido',
      calcularReal: 'POST /calcular/real',
      comparar: 'POST /calcular/comparar',
      info: 'GET /calcular/info'
    }
  });
});

// Rotas de cálculos tributários
router.use('/calcular', calculosRoutes);

// Rotas do Simples Nacional
router.use('/simples', simplesRoutes);

// Rotas do Lucro Presumido
router.use('/presumido', presumidoRoutes);

// Rotas do Lucro Real
router.use('/real', realRoutes);

// Rotas de Créditos PIS/COFINS
router.use('/creditos', creditosRoutes);

// Rotas de Diagnóstico Tributário
router.use('/diagnostico', diagnosticoRoutes);

// Rotas de CNAE
router.use('/cnae', cnaeRoutes);

// Rotas de Margem e Tributos
router.use('/margem', margemRoutes);

// Rotas de Histórico Tributário
router.use('/historico', historicoRoutes);

export default router;

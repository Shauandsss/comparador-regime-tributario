import express from 'express';
import calculosRoutes from './calculos.routes.js';

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

export default router;

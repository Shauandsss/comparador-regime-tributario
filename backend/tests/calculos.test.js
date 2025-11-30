/**
 * Testes para os endpoints de cálculos tributários
 */

import request from 'supertest';
import app from '../src/app.js';

describe('Cálculos Tributários', () => {
  
  // Dados válidos para testes
  const dadosValidos = {
    rbt12: 1200000,
    atividade: 'serviço',
    folha: 200000,
    despesas: 350000
  };

  describe('POST /calcular/simples', () => {
    it('deve calcular corretamente o Simples Nacional para serviço', async () => {
      const response = await request(app)
        .post('/calcular/simples')
        .send(dadosValidos);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('regime', 'Simples Nacional');
      expect(response.body.data).toHaveProperty('impostoTotal');
      expect(response.body.data).toHaveProperty('aliquota', 15.5);
      
      // Verificar cálculo: 1.200.000 * 15,5% = 186.000
      expect(response.body.data.impostoTotal).toBe(186000);
    });

    it('deve calcular corretamente o Simples Nacional para comércio', async () => {
      const response = await request(app)
        .post('/calcular/simples')
        .send({
          rbt12: 1000000,
          atividade: 'comércio',
          folha: 0,
          despesas: 0
        });

      expect(response.status).toBe(200);
      expect(response.body.data.aliquota).toBe(8.0);
      // 1.000.000 * 8% = 80.000
      expect(response.body.data.impostoTotal).toBe(80000);
    });

    it('deve calcular corretamente o Simples Nacional para indústria', async () => {
      const response = await request(app)
        .post('/calcular/simples')
        .send({
          rbt12: 500000,
          atividade: 'indústria',
          folha: 0,
          despesas: 0
        });

      expect(response.status).toBe(200);
      expect(response.body.data.aliquota).toBe(10.0);
      // 500.000 * 10% = 50.000
      expect(response.body.data.impostoTotal).toBe(50000);
    });

    it('deve retornar erro se rbt12 for inválido', async () => {
      const response = await request(app)
        .post('/calcular/simples')
        .send({
          rbt12: -1000,
          atividade: 'serviço'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', true);
    });

    it('deve retornar erro se atividade for inválida', async () => {
      const response = await request(app)
        .post('/calcular/simples')
        .send({
          rbt12: 1000000,
          atividade: 'invalida'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', true);
    });

    it('deve retornar erro se rbt12 estiver ausente', async () => {
      const response = await request(app)
        .post('/calcular/simples')
        .send({
          atividade: 'serviço'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', true);
    });
  });

  describe('POST /calcular/presumido', () => {
    it('deve calcular corretamente o Lucro Presumido', async () => {
      const response = await request(app)
        .post('/calcular/presumido')
        .send(dadosValidos);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('regime', 'Lucro Presumido');
      expect(response.body.data).toHaveProperty('impostoTotal');
      expect(response.body.data).toHaveProperty('lucroPresumido');
    });
  });

  describe('POST /calcular/real', () => {
    it('deve calcular corretamente o Lucro Real', async () => {
      const response = await request(app)
        .post('/calcular/real')
        .send(dadosValidos);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('regime', 'Lucro Real');
      expect(response.body.data).toHaveProperty('impostoTotal');
      expect(response.body.data).toHaveProperty('lucroLiquido');
    });

    it('deve tratar lucro negativo corretamente', async () => {
      const response = await request(app)
        .post('/calcular/real')
        .send({
          rbt12: 500000,
          atividade: 'serviço',
          despesas: 700000
        });

      expect(response.status).toBe(200);
      expect(response.body.data.lucroLiquido).toBe(-200000);
      // IRPJ e CSLL devem ser 0 para lucro negativo
      expect(response.body.data.detalhamento.irpjCsll).toBe(0);
    });
  });

  describe('POST /calcular/comparar', () => {
    it('deve comparar todos os regimes corretamente', async () => {
      const response = await request(app)
        .post('/calcular/comparar')
        .send(dadosValidos);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('comparacao');
      expect(response.body.data).toHaveProperty('melhor_regime');
      expect(response.body.data).toHaveProperty('economia');
      expect(response.body.data).toHaveProperty('detalhes');
      expect(response.body.data).toHaveProperty('ranking');

      // Verificar que todos os valores estão presentes
      expect(response.body.data.comparacao).toHaveProperty('simples');
      expect(response.body.data.comparacao).toHaveProperty('presumido');
      expect(response.body.data.comparacao).toHaveProperty('real');

      // Verificar que o ranking tem 3 posições
      expect(response.body.data.ranking).toHaveLength(3);
      expect(response.body.data.ranking[0].posicao).toBe(1);
    });

    it('deve identificar o melhor regime', async () => {
      const response = await request(app)
        .post('/calcular/comparar')
        .send({
          rbt12: 1000000,
          atividade: 'comércio',
          folha: 0,
          despesas: 500000
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('melhor_regime');
      expect(typeof response.body.data.melhor_regime).toBe('string');
    });
  });

  describe('GET /calcular/info', () => {
    it('deve retornar informações sobre os regimes', async () => {
      const response = await request(app)
        .get('/calcular/info');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('simplesNacional');
      expect(response.body.data).toHaveProperty('lucroPresumido');
      expect(response.body.data).toHaveProperty('lucroReal');
    });
  });
});

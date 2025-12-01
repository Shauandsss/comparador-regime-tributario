/**
 * Testes de Integração - API: POST /presumido/calcular
 * @jest-environment node
 */

import request from 'supertest';
import app from '../src/app.js';

describe('POST /presumido/calcular - Testes de Integração', () => {
  describe('Dado um cálculo de comércio com presunção 8%', () => {
    test('Quando fazer POST /presumido/calcular com atividade comercio, Então deve retornar 200 e cálculos corretos', async () => {
      // Dado
      const input = {
        receita: 300000,
        atividade: 'comercio'
      };

      // Quando
      const response = await request(app)
        .post('/presumido/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.entrada.atividade).toBe('Comércio e Indústria');
      
      // Verificar base presumida (300.000 * 8% = 24.000)
      expect(response.body.tributos.irpj.baseCalculo).toBe(24000);
      
      // Verificar IRPJ (24.000 * 15% = 3.600 + adicional 10% sobre 4.000 = 400 => total 4.000)
      const irpjTotal = response.body.tributos.irpj.irpjTotal;
      expect(irpjTotal).toBeGreaterThanOrEqual(3900);
      expect(irpjTotal).toBeLessThanOrEqual(4100);

      // Verificar CSLL (36.000 * 9% = 3.240)
      const csll = response.body.tributos.csll.csll;
      expect(csll).toBeGreaterThanOrEqual(3200);
      expect(csll).toBeLessThanOrEqual(3300);
    });
  });

  describe('Dado serviços gerais com presunção 32%', () => {
    test('Quando fazer POST com atividade servicos, Então deve retornar base presumida de 32%', async () => {
      // Dado
      const input = {
        receita: 100000,
        atividade: 'servicos'
      };

      // Quando
      const response = await request(app)
        .post('/presumido/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      
      // Verificar base presumida (100.000 * 32% = 32.000)
      expect(response.body.tributos.irpj.baseCalculo).toBe(32000);
      
      // Verificar IRPJ (32.000 * 15% = 4.800 + adicional 10% sobre 12.000 = 1.200 => total 6.000)
      const irpjTotal = response.body.tributos.irpj.irpjTotal;
      expect(irpjTotal).toBeGreaterThanOrEqual(5900);
      expect(irpjTotal).toBeLessThanOrEqual(6100);

      // Verificar CSLL (32.000 * 9% = 2.880)
      const csll = response.body.tributos.csll.csll;
      expect(csll).toBeCloseTo(2880, 0);
    });
  });

  describe('Dado uma atividade desconhecida', () => {
    test('Quando fazer POST com atividade inválida, Então deve retornar 400 com erro', async () => {
      // Dado
      const input = {
        receita: 100000,
        atividade: 'atividade_invalida'
      };

      // Quando
      const response = await request(app)
        .post('/presumido/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
      expect(response.body.erro).toContain('Atividade inválida');
    });
  });

  describe('Dado receita inválida', () => {
    test('Quando fazer POST sem receita, Então deve retornar 400', async () => {
      // Dado
      const input = {
        atividade: 'comercio'
        // receita está ausente
      };

      // Quando
      const response = await request(app)
        .post('/presumido/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
    });

    test('Quando fazer POST com receita negativa, Então deve retornar 400', async () => {
      // Dado
      const input = {
        receita: -50000,
        atividade: 'comercio'
      };

      // Quando
      const response = await request(app)
        .post('/presumido/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
    });
  });

  describe('Dado cálculo com ISS', () => {
    test('Quando fazer POST com alíquota de ISS, Então deve incluir ISS no cálculo', async () => {
      // Dado
      const input = {
        receita: 50000,
        atividade: 'servicos',
        aliquotaISS: 3
      };

      // Quando
      const response = await request(app)
        .post('/presumido/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      
      // Verificar ISS (50.000 * 3% = 1.500)
      const iss = response.body.tributos.iss.iss;
      expect(iss).toBe(1500);
    });
  });

  describe('Dado valores altos', () => {
    test('Quando fazer POST com receita alta, Então deve calcular adicional de IRPJ', async () => {
      // Dado
      const input = {
        receita: 800000,
        atividade: 'servicos'
      };

      // Quando
      const response = await request(app)
        .post('/presumido/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      
      // Base presumida: 800.000 * 32% = 256.000
      // Adicional IRPJ: (256.000 - 20.000) * 10% = 23.600
      expect(response.body.tributos.irpj).toBeDefined();
      expect(response.body.tributos.irpj.irpjAdicional).toBeGreaterThan(23000);
    });
  });
});

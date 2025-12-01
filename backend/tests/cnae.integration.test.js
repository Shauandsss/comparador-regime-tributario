/**
 * Testes de integração da API CNAE
 */

import request from 'supertest';
import app from '../src/app.js';

describe('CNAE API - Testes de Integração', () => {

  describe('GET /cnae/:id', () => {
    
    it('deve retornar CNAE válido com status 200', async () => {
      const response = await request(app)
        .get('/cnae/6201501')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.encontrado).toBe(true);
      expect(response.body.data.cnae.codigo).toBe('6201501');
      expect(response.body.data.simplesNacional).toBeDefined();
      expect(response.body.data.lucroPresumido).toBeDefined();
    });

    it('deve aceitar código formatado (0000-0/00)', async () => {
      const response = await request(app)
        .get('/cnae/6201-5/01')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cnae.codigo).toBe('6201501');
    });

    it('deve retornar 404 para CNAE inexistente', async () => {
      const response = await request(app)
        .get('/cnae/9999999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('não encontrado');
    });

    it('deve retornar 400 para código inválido', async () => {
      const response = await request(app)
        .get('/cnae/abc')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('deve calcular alíquotas quando rbt12 é informado', async () => {
      const response = await request(app)
        .get('/cnae/6201501?rbt12=500000')
        .expect(200);

      expect(response.body.data.simplesNacional.simulacao).toBeDefined();
      expect(response.body.data.simplesNacional.simulacao.rbt12).toBe(500000);
    });

    it('deve retornar 400 para rbt12 negativo', async () => {
      const response = await request(app)
        .get('/cnae/6201501?rbt12=-100')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /cnae/buscar', () => {
    
    it('deve retornar lista de CNAEs para busca válida', async () => {
      const response = await request(app)
        .get('/cnae/buscar?q=desenvolvimento')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('deve retornar 400 para termo muito curto', async () => {
      const response = await request(app)
        .get('/cnae/buscar?q=a')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('deve respeitar limite de resultados', async () => {
      const response = await request(app)
        .get('/cnae/buscar?q=comercio&limite=5')
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    it('deve retornar 400 para limite inválido', async () => {
      const response = await request(app)
        .get('/cnae/buscar?q=teste&limite=999')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /cnae/anexo/:anexo', () => {
    
    it('deve listar CNAEs do Anexo I', async () => {
      const response = await request(app)
        .get('/cnae/anexo/I')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.anexo).toBe('I');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('deve aceitar anexo em minúsculas', async () => {
      const response = await request(app)
        .get('/cnae/anexo/iii')
        .expect(200);

      expect(response.body.anexo).toBe('III');
    });

    it('deve retornar 400 para anexo inválido', async () => {
      const response = await request(app)
        .get('/cnae/anexo/X')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /cnae/estatisticas', () => {
    
    it('deve retornar estatísticas da base', async () => {
      const response = await request(app)
        .get('/cnae/estatisticas')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalCnaes).toBeGreaterThan(0);
      expect(response.body.data.porAnexo).toBeDefined();
      expect(response.body.data.comFatorR).toBeDefined();
      expect(response.body.data.impedidos).toBeDefined();
    });
  });
});

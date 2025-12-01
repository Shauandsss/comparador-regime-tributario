/**
 * Testes Unitários - Service: Calculadora de DAS do Simples Nacional
 * @jest-environment node
 */

import { calcularDAS, calcularFatorR, identificarAnexo } from '../src/services/simples.das.service.js';

describe('Calculadora de DAS do Simples Nacional - Testes Unitários', () => {
  describe('Dado um cálculo básico Anexo III com RBT12 baixo', () => {
    test('Quando informar RBT12 de 200.000, faturamento de 20.000, CNAE de serviço e folha de 60.000, Então deve retornar anexo III com alíquota aproximada de 6% e valor DAS entre 1.100 e 1.500', () => {
      // Dado
      const input = {
        rbt12: 200000,
        faturamentoMes: 20000,
        cnae: '8599-6', // CNAE de serviços que pode ir para Anexo III
        folha12: 60000
      };

      // Quando
      const resultado = calcularDAS(input);

      // Então
      expect(resultado.sucesso).toBe(true);
      expect(resultado.anexo.codigo).toBe('ANEXO_III');
      
      const aliquotaEfetivaNumerica = parseFloat(resultado.calculo.aliquotaEfetiva);
      expect(aliquotaEfetivaNumerica).toBeGreaterThanOrEqual(5.5);
      expect(aliquotaEfetivaNumerica).toBeLessThanOrEqual(7);
      
      const valorDAS = parseFloat(resultado.calculo.valorDAS);
      expect(valorDAS).toBeGreaterThanOrEqual(1100);
      expect(valorDAS).toBeLessThanOrEqual(1500);
    });
  });

  describe('Dado um cálculo para Anexo V com Fator R baixo', () => {
    test('Quando informar RBT12 de 800.000, faturamento de 40.000, CNAE de serviço e folha de 50.000, Então deve retornar anexo V com alíquota superior a 13% e valor DAS superior a 5.200', () => {
      // Dado
      const input = {
        rbt12: 800000,
        faturamentoMes: 40000,
        cnae: '8599-6', // CNAE de serviços
        folha12: 50000
      };

      // Quando
      const resultado = calcularDAS(input);

      // Então
      expect(resultado.sucesso).toBe(true);
      expect(resultado.anexo.codigo).toBe('ANEXO_V');
      expect(resultado.fatorR.aplicavelAnexoIII).toBe(false);
      
      const aliquotaEfetivaNumerica = parseFloat(resultado.calculo.aliquotaEfetiva);
      expect(aliquotaEfetivaNumerica).toBeGreaterThan(13);
      
      const valorDAS = parseFloat(resultado.calculo.valorDAS);
      expect(valorDAS).toBeGreaterThan(5200);
    });
  });

  describe('Dado uma entrada inválida com RBT12 negativo', () => {
    test('Quando informar RBT12 negativo, Então deve lançar erro de RBT12 inválido', () => {
      // Dado
      const input = {
        rbt12: -100,
        faturamentoMes: 10000,
        cnae: '4711-3', // comércio
        folha12: 10000
      };

      // Quando / Então
      expect(() => calcularDAS(input)).toThrow('RBT12 (Receita Bruta Total 12 meses) é obrigatório e deve ser maior que zero');
    });
  });

  describe('Dado valores extremos no limite do Simples Nacional', () => {
    test('Quando informar RBT12 acima de 4.8 milhões, Então deve retornar erro de ultrapassagem do limite', () => {
      // Dado
      const input = {
        rbt12: 5000000,
        faturamentoMes: 50000,
        cnae: '4711-3',
        folha12: 100000
      };

      // Quando
      const resultado = calcularDAS(input);

      // Então
      expect(resultado.sucesso).toBe(false);
      expect(resultado.erro).toContain('ultrapassou o limite');
      expect(resultado.limiteSimples).toBe(4800000);
    });
  });

  describe('Testes da função calcularFatorR', () => {
    test('Quando calcular fator R com folha de 300.000 e RBT12 de 1.000.000, Então deve retornar 0.30 (30%)', () => {
      // Dado / Quando
      const fatorR = calcularFatorR(300000, 1000000);

      // Então
      expect(fatorR).toBe(0.30);
    });

    test('Quando calcular fator R com folha de 100.000 e RBT12 de 1.000.000, Então deve retornar 0.10 (10%)', () => {
      // Dado / Quando
      const fatorR = calcularFatorR(100000, 1000000);

      // Então
      expect(fatorR).toBe(0.10);
    });

    test('Quando calcular fator R com RBT12 zero, Então deve retornar 0', () => {
      // Dado / Quando
      const fatorR = calcularFatorR(100000, 0);

      // Então
      expect(fatorR).toBe(0);
    });
  });

  describe('Testes da função identificarAnexo', () => {
    test('Quando identificar anexo com CNAE de comércio, Então deve retornar ANEXO_I', () => {
      // Dado / Quando
      const anexo = identificarAnexo('4711-3', 0.15);

      // Então
      expect(anexo).toBe('ANEXO_I');
    });

    test('Quando identificar anexo com CNAE de indústria, Então deve retornar ANEXO_II', () => {
      // Dado / Quando
      const anexo = identificarAnexo('1011-2', 0.15);

      // Então
      expect(anexo).toBe('ANEXO_II');
    });

    test('Quando identificar anexo de serviço com Fator R >= 28%, Então deve retornar ANEXO_III', () => {
      // Dado / Quando
      const anexo = identificarAnexo('8599-6', 0.30);

      // Então
      expect(anexo).toBe('ANEXO_III');
    });

    test('Quando identificar anexo de serviço com Fator R < 28%, Então deve retornar ANEXO_V', () => {
      // Dado / Quando
      const anexo = identificarAnexo('8599-6', 0.20);

      // Então
      expect(anexo).toBe('ANEXO_V');
    });
  });
});

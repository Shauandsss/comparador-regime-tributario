/**
 * Testes Unitários - Service: Lucro Presumido
 * @jest-environment node
 */

import { calcularLucroPresumido, listarAtividades } from '../src/services/lucro-presumido.service.js';

describe('Lucro Presumido - Testes Unitários', () => {
  describe('Dado um cálculo de comércio com presunção 8%', () => {
    test('Quando calcular com receita de 300.000 e atividade comércio, Então deve retornar base presumida de 24.000, IRPJ entre 2.600 e 3.000 e CSLL entre 2.100 e 2.400', () => {
      // Dado
      const input = {
        receita: 300000,
        atividade: 'comercio'
      };

      // Quando
      const resultado = calcularLucroPresumido(input);

      // Então
      expect(resultado.sucesso).toBe(true);
      expect(resultado.resumo.lucroPesumdio).toBe(24000); // 300.000 * 8%
      
      const irpjTotal = resultado.tributos.irpj.irpjTotal;
      expect(irpjTotal).toBeGreaterThanOrEqual(3900); // Com adicional
      expect(irpjTotal).toBeLessThanOrEqual(4100);
      
      const csll = resultado.tributos.csll.csll;
      expect(csll).toBeGreaterThanOrEqual(3200);
      expect(csll).toBeLessThanOrEqual(3300);
    });
  });

  describe('Dado serviços gerais com presunção 32%', () => {
    test('Quando calcular com receita de 100.000 e atividade servicos, Então deve retornar base presumida de 32.000, IRPJ entre 4.800 e 5.800 e CSLL aproximadamente 2.880', () => {
      // Dado
      const input = {
        receita: 100000,
        atividade: 'servicos'
      };

      // Quando
      const resultado = calcularLucroPresumido(input);

      // Então
      expect(resultado.sucesso).toBe(true);
      expect(resultado.resumo.lucroPesumdio).toBe(32000); // 100.000 * 32%
      
      const irpjTotal = resultado.tributos.irpj.irpjTotal;
      expect(irpjTotal).toBeGreaterThanOrEqual(5900); // Com adicional
      expect(irpjTotal).toBeLessThanOrEqual(6100);
      
      const csll = resultado.tributos.csll.csll;
      expect(csll).toBeCloseTo(2880, 0); // 32.000 * 9%
    });
  });

  describe('Dado uma atividade desconhecida', () => {
    test('Quando calcular com atividade não reconhecida, Então deve lançar erro de atividade inválida', () => {
      // Dado
      const input = {
        receita: 80000,
        atividade: 'alienigena'
      };

      // Quando / Então
      expect(() => calcularLucroPresumido(input)).toThrow('Atividade inválida');
    });
  });

  describe('Dado receita inválida', () => {
    test('Quando calcular com receita zero, Então deve lançar erro', () => {
      // Dado
      const input = {
        receita: 0,
        atividade: 'comercio'
      };

      // Quando / Então
      expect(() => calcularLucroPresumido(input)).toThrow('Receita é obrigatória e deve ser maior que zero');
    });

    test('Quando calcular com receita negativa, Então deve lançar erro', () => {
      // Dado
      const input = {
        receita: -50000,
        atividade: 'comercio'
      };

      // Quando / Então
      expect(() => calcularLucroPresumido(input)).toThrow('Receita é obrigatória e deve ser maior que zero');
    });
  });

  describe('Dado cálculo com adicional de IRPJ', () => {
    test('Quando base presumida ultrapassar R$ 20.000, Então deve calcular adicional de 10%', () => {
      // Dado
      const input = {
        receita: 300000,
        atividade: 'servicos' // 32% = 96.000 de base
      };

      // Quando
      const resultado = calcularLucroPresumido(input);

      // Então
      const baseCalculo = resultado.tributos.irpj.baseCalculo;
      expect(baseCalculo).toBe(96000);
      expect(resultado.tributos.irpj.adicional).toBeGreaterThan(0);
      
      // Adicional deve ser 10% sobre (96.000 - 20.000) = 76.000 * 10% = 7.600
      expect(resultado.tributos.irpj.adicional).toBeCloseTo(7600, 0);
    });
  });

  describe('Dado cálculo de PIS e COFINS cumulativos', () => {
    test('Quando calcular tributos, Então PIS deve ser 0.65% e COFINS 3%', () => {
      // Dado
      const input = {
        receita: 100000,
        atividade: 'comercio'
      };

      // Quando
      const resultado = calcularLucroPresumido(input);

      // Então
      expect(resultado.tributos.pis.aliquota).toBe('0.65%');
      expect(resultado.tributos.pis.pis).toBeCloseTo(650, 1); // 100.000 * 0.65%
      
      expect(resultado.tributos.cofins.aliquota).toBe('3%');
      expect(resultado.tributos.cofins.cofins).toBe(3000); // 100.000 * 3%
    });
  });

  describe('Dado cálculo com ISS', () => {
    test('Quando informar alíquota de ISS, Então deve calcular o imposto', () => {
      // Dado
      const input = {
        receita: 50000,
        atividade: 'servicos',
        aliquotaISS: 3
      };

      // Quando
      const resultado = calcularLucroPresumido(input);

      // Então
      expect(resultado.tributos.iss.aliquota).toBe('3%');
      expect(resultado.tributos.iss.iss).toBe(1500); // 50.000 * 3%
    });

    test('Quando não informar alíquota de ISS, Então ISS deve ser zero', () => {
      // Dado
      const input = {
        receita: 50000,
        atividade: 'comercio'
      };

      // Quando
      const resultado = calcularLucroPresumido(input);

      // Então
      expect(resultado.tributos.iss.iss).toBe(0);
    });
  });

  describe('Dado cálculo de carga tributária', () => {
    test('Quando calcular todos os tributos, Então deve retornar carga tributária total correta', () => {
      // Dado
      const input = {
        receita: 100000,
        atividade: 'comercio'
      };

      // Quando
      const resultado = calcularLucroPresumido(input);

      // Então
      const cargaTributaria = resultado.resumo.cargaTributariaDecimal;
      expect(cargaTributaria).toBeGreaterThan(0);
      expect(cargaTributaria).toBeLessThan(100);
      
      // Total de tributos deve ser a soma
      const somaEsperada = 
        resultado.tributos.irpj.irpjTotal +
        resultado.tributos.csll.csll +
        resultado.tributos.pis.pis +
        resultado.tributos.cofins.cofins +
        resultado.tributos.iss.iss;
      
      expect(resultado.resumo.totalTributos).toBe(somaEsperada);
    });
  });

  describe('Testes da função listarAtividades', () => {
    test('Quando listar atividades, Então deve retornar array com todas as atividades disponíveis', () => {
      // Dado / Quando
      const atividades = listarAtividades();

      // Então
      expect(Array.isArray(atividades)).toBe(true);
      expect(atividades.length).toBeGreaterThan(0);
      
      // Verificar estrutura
      const primeira = atividades[0];
      expect(primeira).toHaveProperty('id');
      expect(primeira).toHaveProperty('nome');
      expect(primeira).toHaveProperty('descricao');
      expect(primeira).toHaveProperty('presuncaoIRPJ');
      expect(primeira).toHaveProperty('presuncaoCSLL');
    });

    test('Quando listar atividades, Então deve incluir comércio e serviços', () => {
      // Dado / Quando
      const atividades = listarAtividades();

      // Então
      const ids = atividades.map(a => a.id);
      expect(ids).toContain('comercio');
      expect(ids).toContain('servicos');
    });
  });
});

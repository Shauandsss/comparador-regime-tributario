/**
 * Testes Unitários - Service: Créditos PIS/COFINS
 * @jest-environment node
 */

import { calcularCreditos, simularEconomia } from '../src/services/creditos-pis-cofins.service.js';

describe('Créditos PIS/COFINS - Testes Unitários', () => {
  describe('Dado um cálculo de créditos básicos', () => {
    test('Quando calcular com energia 10.000, aluguel 5.000 e insumos 30.000, Então creditoPIS deve ser > 500 e creditoCOFINS > 2.500', () => {
      // Dado
      const despesas = {
        energia: 10000,
        aluguel: 5000,
        insumos: 30000
      };

      // Quando
      const resultado = calcularCreditos(despesas);

      // Então
      expect(resultado.sucesso).toBe(true);
      
      const creditoPis = resultado.creditos.pis.total;
      expect(creditoPis).toBeGreaterThan(500);
      
      const creditoCofins = resultado.creditos.cofins.total;
      expect(creditoCofins).toBeGreaterThan(2500);
    });
  });

  describe('Dado valores zerados', () => {
    test('Quando calcular com todos os valores zerados, Então deve lançar erro', () => {
      // Dado
      const despesas = {
        energia: 0,
        aluguel: 0,
        insumos: 0
      };

      // Quando / Então
      expect(() => calcularCreditos(despesas)).toThrow('Informe pelo menos uma despesa para calcular os créditos');
    });
  });

  describe('Dado valores negativos', () => {
    test('Quando informar valores negativos, Então deve lançar erro', () => {
      // Dado
      const despesas = {
        energia: -1000,
        aluguel: 5000,
        insumos: 10000
      };

      // Quando / Então
      expect(() => calcularCreditos(despesas)).toThrow('Os valores das despesas não podem ser negativos');
    });
  });

  describe('Dado cálculo detalhado de créditos', () => {
    test('Quando calcular créditos, Então deve retornar detalhamento por categoria', () => {
      // Dado
      const despesas = {
        insumos: 100000,
        energia: 10000
      };

      // Quando
      const resultado = calcularCreditos(despesas);

      // Então
      expect(resultado.detalhamento).toHaveLength(2);
      expect(resultado.detalhamento[0].categoria).toBe('insumos');
      expect(resultado.detalhamento[1].categoria).toBe('energia');
      
      // Verificar cálculo de insumos: 100.000 * 1,65% = 1.650 (PIS) e 100.000 * 7,6% = 7.600 (COFINS)
      const creditoInsumos = resultado.detalhamento.find(d => d.categoria === 'insumos');
      expect(creditoInsumos.creditoPis).toBe(1650);
      expect(creditoInsumos.creditoCofins).toBe(7600);
    });
  });

  describe('Dado diferentes tipos de despesas', () => {
    test('Quando calcular com todas as categorias, Então deve processar corretamente', () => {
      // Dado
      const despesas = {
        insumos: 50000,
        energia: 5000,
        aluguel: 3000,
        frete: 2000,
        armazenagem: 1000
      };

      // Quando
      const resultado = calcularCreditos(despesas);

      // Então
      expect(resultado.sucesso).toBe(true);
      expect(resultado.entrada.quantidadeCategorias).toBe(5);
      expect(resultado.creditos.total).toBeGreaterThan(0);
      
      const totalDespesas = resultado.entrada.totalDespesas;
      expect(totalDespesas).toBe(61000);
    });
  });

  describe('Dado simulação de economia', () => {
    test('Quando simular economia com receita 100.000 e despesas com créditos, Então deve calcular economia corretamente', () => {
      // Dado
      const receitaBruta = 100000;
      const despesas = {
        insumos: 30000,
        energia: 5000
      };

      // Quando
      const resultado = simularEconomia(receitaBruta, despesas);

      // Então
      expect(resultado.sucesso).toBe(true);
      expect(resultado.receita.valor).toBe(100000);
      
      // Débito sem crédito
      expect(resultado.semCreditos.pisDebito).toBe(1650); // 100.000 * 1,65%
      expect(resultado.semCreditos.cofinsDebito).toBe(7600); // 100.000 * 7,6%
      
      // Com crédito deve ser menor
      expect(resultado.comCreditos.pisAPagar).toBeLessThan(resultado.semCreditos.pisDebito);
      expect(resultado.comCreditos.cofinsAPagar).toBeLessThan(resultado.semCreditos.cofinsDebito);
      
      // Economia deve existir
      expect(resultado.economia.valor).toBeGreaterThan(0);
    });

    test('Quando simular sem receita, Então deve lançar erro', () => {
      // Dado
      const receitaBruta = 0;
      const despesas = { insumos: 10000 };

      // Quando / Então
      expect(() => simularEconomia(receitaBruta, despesas)).toThrow('Receita bruta é obrigatória e deve ser maior que zero');
    });
  });

  describe('Dado cálculo de percentuais corretos', () => {
    test('Quando calcular créditos, Então PIS deve ser 1.65% e COFINS 7.6%', () => {
      // Dado
      const despesas = {
        insumos: 10000
      };

      // Quando
      const resultado = calcularCreditos(despesas);

      // Então
      expect(resultado.creditos.pis.aliquota).toBe('1,65%');
      expect(resultado.creditos.cofins.aliquota).toBe('7,6%');
      
      // Calcular valores esperados
      const pisEsperado = 10000 * 0.0165;
      const cofinsEsperado = 10000 * 0.076;
      
      expect(resultado.creditos.pis.total).toBe(pisEsperado);
      expect(resultado.creditos.cofins.total).toBe(cofinsEsperado);
    });
  });

  describe('Dado cálculo de economia anual', () => {
    test('Quando simular economia, Então deve calcular economia anual (mensal * 12)', () => {
      // Dado
      const receitaBruta = 100000;
      const despesas = { insumos: 20000 };

      // Quando
      const resultado = simularEconomia(receitaBruta, despesas);

      // Então
      const economiaAnual = resultado.economia.economiaAnual;
      const economiaMensal = resultado.economia.valor;
      
      expect(economiaAnual).toBe(economiaMensal * 12);
    });
  });

  describe('Dado créditos maiores que débitos', () => {
    test('Quando créditos forem maiores que débitos, Então valor a pagar deve ser zero', () => {
      // Dado
      const receitaBruta = 10000;
      const despesas = { insumos: 50000 }; // Créditos muito altos

      // Quando
      const resultado = simularEconomia(receitaBruta, despesas);

      // Então
      // PIS: débito = 165, crédito = 825 → a pagar = 0
      // COFINS: débito = 760, crédito = 3800 → a pagar = 0
      expect(resultado.comCreditos.pisAPagar).toBe(0);
      expect(resultado.comCreditos.cofinsAPagar).toBe(0);
    });
  });
});

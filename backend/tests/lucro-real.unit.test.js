/**
 * Testes Unitários - Service: Lucro Real
 * @jest-environment node
 */

import { calcularLucroReal } from '../src/services/lucro-real.service.js';

describe('Lucro Real - Testes Unitários', () => {
  describe('Dado um Lucro Real com lucro alto (Real perde)', () => {
    test('Quando calcular com receita 3.000.000, despesas 2.200.000 e folha 400.000, Então deve retornar lucro real de 400.000', () => {
      // Dado
      const input = {
        receita: 3000000,
        despesas: 2200000,
        folha: 400000,
        creditosPis: 0,
        creditosCofins: 0
      };

      // Quando
      const resultado = calcularLucroReal(input);

      // Então
      expect(resultado.sucesso).toBe(true);
      expect(resultado.apuracao.lucroContabil).toBe(400000);
      expect(resultado.apuracao.temPrejuizo).toBe(false);
      
      // Com lucro alto, Presumido geralmente é mais vantajoso
      expect(resultado.tributos.irpj.irpjTotal).toBeGreaterThan(0);
      expect(resultado.tributos.csll.csll).toBeGreaterThan(0);
    });
  });

  describe('Dado um Lucro Real com lucro muito baixo (Real vence)', () => {
    test('Quando calcular com receita 3.000.000, despesas 2.600.000 e folha 400.000, Então deve retornar lucro próximo a zero', () => {
      // Dado
      const input = {
        receita: 3000000,
        despesas: 2600000,
        folha: 400000,
        creditosPis: 0,
        creditosCofins: 0
      };

      // Quando
      const resultado = calcularLucroReal(input);

      // Então
      expect(resultado.sucesso).toBe(true);
      expect(resultado.apuracao.lucroContabil).toBe(0);
      expect(resultado.apuracao.temPrejuizo).toBe(true);
      
      // Com lucro zero, IRPJ e CSLL devem ser zero
      expect(resultado.tributos.irpj.irpjTotal).toBe(0);
      expect(resultado.tributos.csll.csll).toBe(0);
      expect(resultado.tributos.irpj.prejuizo).toBe(true);
    });
  });

  describe('Dado despesas excessivas resultando em prejuízo', () => {
    test('Quando calcular com prejuízo, Então IRPJ e CSLL devem ser zero', () => {
      // Dado
      const input = {
        receita: 500000,
        despesas: 400000,
        folha: 150000,
        creditosPis: 0,
        creditosCofins: 0
      };

      // Quando
      const resultado = calcularLucroReal(input);

      // Então
      const lucro = resultado.apuracao.lucroContabil;
      expect(lucro).toBeLessThan(0); // Prejuízo
      expect(resultado.apuracao.temPrejuizo).toBe(true);
      expect(resultado.tributos.irpj.prejuizo).toBe(true);
      expect(resultado.tributos.csll.prejuizo).toBe(true);
      expect(resultado.tributos.irpj.irpjTotal).toBe(0);
      expect(resultado.tributos.csll.csll).toBe(0);
    });
  });

  describe('Dado valores inválidos', () => {
    test('Quando calcular com receita zero, Então deve lançar erro', () => {
      // Dado
      const input = {
        receita: 0,
        despesas: 100000,
        folha: 50000
      };

      // Quando / Então
      expect(() => calcularLucroReal(input)).toThrow('Receita é obrigatória e deve ser maior que zero');
    });

    test('Quando calcular com despesas negativas, Então deve lançar erro', () => {
      // Dado
      const input = {
        receita: 500000,
        despesas: -100000,
        folha: 50000
      };

      // Quando / Então
      expect(() => calcularLucroReal(input)).toThrow('Despesas e folha não podem ser negativas');
    });

    test('Quando calcular com folha negativa, Então deve lançar erro', () => {
      // Dado
      const input = {
        receita: 500000,
        despesas: 100000,
        folha: -50000
      };

      // Quando / Então
      expect(() => calcularLucroReal(input)).toThrow('Despesas e folha não podem ser negativas');
    });
  });

  describe('Dado cálculo de PIS/COFINS não-cumulativo', () => {
    test('Quando calcular PIS e COFINS, Então deve usar alíquotas não-cumulativas (1.65% e 7.6%)', () => {
      // Dado
      const input = {
        receita: 100000,
        despesas: 50000,
        folha: 20000
      };

      // Quando
      const resultado = calcularLucroReal(input);

      // Então
      expect(resultado.tributos.pis.aliquota).toBe('1.65%');
      expect(resultado.tributos.pis.pisDebito).toBe(1650); // 100.000 * 1.65%
      
      expect(resultado.tributos.cofins.aliquota).toBe('7.6%');
      expect(resultado.tributos.cofins.cofinsDebito).toBe(7600); // 100.000 * 7.6%
    });
  });

  describe('Dado cálculo com créditos de PIS/COFINS', () => {
    test('Quando informar créditos, Então deve deduzir dos débitos', () => {
      // Dado
      const input = {
        receita: 100000,
        despesas: 30000,
        folha: 20000,
        creditosPis: 500,
        creditosCofins: 2000
      };

      // Quando
      const resultado = calcularLucroReal(input);

      // Então
      expect(resultado.tributos.pis.creditos).toBe(500);
      expect(resultado.tributos.pis.pisAPagar).toBe(1150); // 1650 - 500
      
      expect(resultado.tributos.cofins.creditos).toBe(2000);
      expect(resultado.tributos.cofins.cofinsAPagar).toBe(5600); // 7600 - 2000
      
      const economiaCreditos = resultado.resumo.economiaCreditos;
      expect(economiaCreditos).toBe(2500); // 500 + 2000
    });

    test('Quando créditos forem maiores que débitos, Então valor a pagar deve ser zero', () => {
      // Dado
      const input = {
        receita: 100000,
        despesas: 30000,
        folha: 20000,
        creditosPis: 2000,
        creditosCofins: 8000
      };

      // Quando
      const resultado = calcularLucroReal(input);

      // Então
      expect(resultado.tributos.pis.pisAPagar).toBe(0);
      expect(resultado.tributos.cofins.cofinsAPagar).toBe(0);
    });
  });

  describe('Dado cálculo de adicional de IRPJ', () => {
    test('Quando lucro ultrapassar R$ 20.000, Então deve calcular adicional de 10%', () => {
      // Dado
      const input = {
        receita: 200000,
        despesas: 100000,
        folha: 50000
      };

      // Quando
      const resultado = calcularLucroReal(input);

      // Então
      const lucroContabil = resultado.apuracao.lucroContabil;
      expect(lucroContabil).toBe(50000);
      
      expect(resultado.tributos.irpj.adicional).toBeGreaterThan(0);
      // Adicional = (50.000 - 20.000) * 10% = 3.000
      expect(resultado.tributos.irpj.adicional).toBe(3000);
    });

    test('Quando lucro for menor que R$ 20.000, Então não deve haver adicional', () => {
      // Dado
      const input = {
        receita: 100000,
        despesas: 70000,
        folha: 15000
      };

      // Quando
      const resultado = calcularLucroReal(input);

      // Então
      const lucroContabil = resultado.apuracao.lucroContabil;
      expect(lucroContabil).toBe(15000);
      expect(resultado.tributos.irpj.adicional).toBe(0);
    });
  });

  describe('Dado cálculo de carga tributária', () => {
    test('Quando calcular todos os tributos, Então deve retornar carga tributária total correta', () => {
      // Dado
      const input = {
        receita: 500000,
        despesas: 200000,
        folha: 100000
      };

      // Quando
      const resultado = calcularLucroReal(input);

      // Então
      const totalTributos = resultado.resumo.totalTributos;
      const somaEsperada = 
        resultado.tributos.irpj.irpjTotal +
        resultado.tributos.csll.csll +
        resultado.tributos.pis.pisAPagar +
        resultado.tributos.cofins.cofinsAPagar;
      
      expect(totalTributos).toBe(somaEsperada);
      
      const cargaTributaria = resultado.resumo.cargaTributariaDecimal;
      expect(cargaTributaria).toBeGreaterThan(0);
      expect(cargaTributaria).toBeLessThan(100);
    });
  });

  describe('Dado cálculo de lucro líquido', () => {
    test('Quando calcular lucro líquido, Então deve descontar IRPJ e CSLL do lucro contábil', () => {
      // Dado
      const input = {
        receita: 300000,
        despesas: 150000,
        folha: 50000
      };

      // Quando
      const resultado = calcularLucroReal(input);

      // Então
      const lucroContabil = resultado.apuracao.lucroContabil;
      const lucroLiquido = resultado.apuracao.lucroLiquido;
      const irpj = resultado.tributos.irpj.irpjTotal;
      const csll = resultado.tributos.csll.csll;
      
      expect(lucroLiquido).toBe(lucroContabil - irpj - csll);
    });
  });
});

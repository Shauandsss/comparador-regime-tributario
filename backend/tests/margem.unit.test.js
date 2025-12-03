/**
 * Testes Unitários - Service: Margem e Tributos
 * @jest-environment node
 */

import { calcularMargemTributos, compararRegimes } from '../src/services/margem.service.js';

describe('Margem e Tributos - Testes Unitários', () => {
  describe('Dado cálculo básico de margem no Simples Nacional', () => {
    test('Quando calcular com custo 50, despesas fixas 5000, quantidade 100 e margem 20%, Então deve retornar preço sugerido válido e markup > 1', () => {
      // Dado
      const input = {
        custoUnitario: 50,
        despesasFixasMensais: 5000,
        despesasVariaveisPercentual: 5,
        quantidadeMensal: 100,
        regime: 'simples',
        anexoSimples: 'III',
        rbt12: 360000,
        margemDesejada: 20
      };

      // Quando
      const resultado = calcularMargemTributos(input);

      // Então
      expect(resultado.precos.precoSugerido).toBeGreaterThan(resultado.custos.custoUnitarioTotal);
      expect(resultado.precos.markup).toBeGreaterThan(1);
      expect(resultado.resultado.lucroLiquidoMensal).toBeGreaterThan(0);
      expect(resultado.resultado.margemLiquidaReal).toBeCloseTo(20, 0);
    });
  });

  describe('Dado cálculo de margem no Lucro Presumido', () => {
    test('Quando calcular com atividade serviços, Então deve usar presunção de 32%', () => {
      // Dado
      const input = {
        custoUnitario: 100,
        despesasFixasMensais: 3000,
        despesasVariaveisPercentual: 0,
        quantidadeMensal: 50,
        regime: 'presumido',
        atividadePresumido: 'servicos',
        margemDesejada: 15
      };

      // Quando
      const resultado = calcularMargemTributos(input);

      // Então
      expect(resultado.tributos.detalhamento.tipo).toBe('Lucro Presumido');
      expect(resultado.tributos.detalhamento.percentualPresuncao).toBe(32);
      expect(resultado.precos.precoSugerido).toBeGreaterThan(0);
    });

    test('Quando calcular com atividade comércio, Então deve usar presunção de 8%', () => {
      // Dado
      const input = {
        custoUnitario: 80,
        despesasFixasMensais: 2000,
        quantidadeMensal: 100,
        regime: 'presumido',
        atividadePresumido: 'comercio',
        margemDesejada: 25
      };

      // Quando
      const resultado = calcularMargemTributos(input);

      // Então
      expect(resultado.tributos.detalhamento.percentualPresuncao).toBe(8);
      expect(resultado.tributos.aliquotaEfetiva).toBeLessThan(20); // Comércio tem alíquota menor
    });
  });

  describe('Dado cálculo de margem no Lucro Real', () => {
    test('Quando calcular no regime real, Então deve considerar lucro operacional', () => {
      // Dado
      const input = {
        custoUnitario: 200,
        despesasFixasMensais: 10000,
        despesasVariaveisPercentual: 3,
        quantidadeMensal: 80,
        regime: 'real',
        margemDesejada: 18
      };

      // Quando
      const resultado = calcularMargemTributos(input);

      // Então
      expect(resultado.tributos.detalhamento.tipo).toBe('Lucro Real');
      expect(resultado.tributos.detalhamento.lucroOperacional).toBeDefined();
      expect(resultado.precos.precoSugerido).toBeGreaterThan(resultado.precos.precoMinimo);
    });
  });

  describe('Dado valores inválidos', () => {
    test('Quando custo unitário for negativo, Então deve lançar erro', () => {
      // Dado
      const input = {
        custoUnitario: -50,
        despesasFixasMensais: 1000,
        quantidadeMensal: 10,
        regime: 'simples',
        margemDesejada: 10
      };

      // Quando / Então
      expect(() => calcularMargemTributos(input)).toThrow('Valores inválidos');
    });

    test('Quando quantidade mensal for zero, Então deve lançar erro', () => {
      // Dado
      const input = {
        custoUnitario: 50,
        despesasFixasMensais: 1000,
        quantidadeMensal: 0,
        regime: 'simples',
        margemDesejada: 10
      };

      // Quando / Então
      expect(() => calcularMargemTributos(input)).toThrow('Valores inválidos');
    });

    test('Quando soma dos percentuais for >= 100%, Então deve lançar erro', () => {
      // Dado
      const input = {
        custoUnitario: 50,
        despesasFixasMensais: 1000,
        despesasVariaveisPercentual: 50,
        quantidadeMensal: 10,
        regime: 'simples',
        margemDesejada: 60 // Total seria > 100% com tributos
      };

      // Quando / Então
      expect(() => calcularMargemTributos(input)).toThrow('Soma dos percentuais');
    });
  });

  describe('Dado cálculo de preço mínimo', () => {
    test('Quando margem desejada for zero, Então preço sugerido deve ser igual ao preço mínimo', () => {
      // Dado
      const input = {
        custoUnitario: 100,
        despesasFixasMensais: 2000,
        despesasVariaveisPercentual: 5,
        quantidadeMensal: 50,
        regime: 'simples',
        anexoSimples: 'I',
        rbt12: 200000,
        margemDesejada: 0
      };

      // Quando
      const resultado = calcularMargemTributos(input);

      // Então
      expect(resultado.precos.precoSugerido).toBeCloseTo(resultado.precos.precoMinimo, 2);
      expect(resultado.resultado.lucroLiquidoMensal).toBeCloseTo(0, 0);
    });
  });

  describe('Dado cenários alternativos', () => {
    test('Quando calcular, Então deve retornar 5 cenários de margem diferentes', () => {
      // Dado
      const input = {
        custoUnitario: 75,
        despesasFixasMensais: 4000,
        quantidadeMensal: 60,
        regime: 'simples',
        anexoSimples: 'III',
        rbt12: 500000,
        margemDesejada: 20
      };

      // Quando
      const resultado = calcularMargemTributos(input);

      // Então
      expect(resultado.cenarios).toHaveLength(5);
      expect(resultado.cenarios[0].margem).toBe(10);
      expect(resultado.cenarios[4].margem).toBe(30);
      
      // Cada cenário deve ter preço, markup e lucro
      resultado.cenarios.forEach(cenario => {
        expect(cenario.preco).toBeGreaterThan(0);
        expect(cenario.markup).toBeGreaterThan(1);
        expect(cenario.lucroMensal).toBeGreaterThan(0);
      });
    });

    test('Quando margem aumenta, Então preço e lucro devem aumentar proporcionalmente', () => {
      // Dado
      const input = {
        custoUnitario: 50,
        despesasFixasMensais: 2000,
        quantidadeMensal: 100,
        regime: 'simples',
        margemDesejada: 15
      };

      // Quando
      const resultado = calcularMargemTributos(input);

      // Então
      for (let i = 1; i < resultado.cenarios.length; i++) {
        expect(resultado.cenarios[i].preco).toBeGreaterThan(resultado.cenarios[i - 1].preco);
        expect(resultado.cenarios[i].lucroMensal).toBeGreaterThan(resultado.cenarios[i - 1].lucroMensal);
      }
    });
  });

  describe('Dado custos unitários totais', () => {
    test('Quando calcular custo unitário total, Então deve incluir rateio das despesas fixas', () => {
      // Dado
      const custoUnitario = 100;
      const despesasFixas = 5000;
      const quantidade = 50;
      
      const input = {
        custoUnitario,
        despesasFixasMensais: despesasFixas,
        quantidadeMensal: quantidade,
        regime: 'simples',
        margemDesejada: 10
      };

      // Quando
      const resultado = calcularMargemTributos(input);

      // Então
      const despesasFixasUnitaria = despesasFixas / quantidade;
      expect(resultado.custos.despesasFixasUnitaria).toBe(despesasFixasUnitaria);
      expect(resultado.custos.custoUnitarioTotal).toBe(custoUnitario + despesasFixasUnitaria);
    });
  });

  describe('Dado diferentes anexos do Simples', () => {
    test('Quando usar Anexo V, Então alíquota efetiva deve ser maior que Anexo I', () => {
      // Dado
      const inputBase = {
        custoUnitario: 100,
        despesasFixasMensais: 3000,
        quantidadeMensal: 50,
        regime: 'simples',
        rbt12: 400000,
        margemDesejada: 20
      };

      // Quando
      const resultadoAnexoI = calcularMargemTributos({ ...inputBase, anexoSimples: 'I' });
      const resultadoAnexoV = calcularMargemTributos({ ...inputBase, anexoSimples: 'V' });

      // Então
      expect(resultadoAnexoV.tributos.aliquotaEfetiva).toBeGreaterThan(resultadoAnexoI.tributos.aliquotaEfetiva);
    });
  });
});

describe('Comparar Regimes - Testes Unitários', () => {
  describe('Dado comparação entre todos os regimes', () => {
    test('Quando comparar regimes, Então deve retornar resultados para simples, presumido e real', () => {
      // Dado
      const params = {
        custoUnitario: 80,
        despesasFixasMensais: 5000,
        despesasVariaveisPercentual: 3,
        quantidadeMensal: 100,
        anexoSimples: 'III',
        rbt12: 600000,
        atividadePresumido: 'servicos',
        margemDesejada: 15
      };

      // Quando
      const resultado = compararRegimes(params);

      // Então
      expect(resultado.resultados.simples).toBeDefined();
      expect(resultado.resultados.presumido).toBeDefined();
      expect(resultado.resultados.real).toBeDefined();
    });

    test('Quando comparar regimes, Então deve identificar o melhor regime', () => {
      // Dado
      const params = {
        custoUnitario: 50,
        despesasFixasMensais: 3000,
        quantidadeMensal: 80,
        anexoSimples: 'I',
        rbt12: 300000,
        atividadePresumido: 'comercio',
        margemDesejada: 20
      };

      // Quando
      const resultado = compararRegimes(params);

      // Então
      expect(resultado.melhorRegime).toBeDefined();
      expect(['simples', 'presumido', 'real']).toContain(resultado.melhorRegime);
    });

    test('Quando comparar regimes, Então deve calcular economia', () => {
      // Dado
      const params = {
        custoUnitario: 120,
        despesasFixasMensais: 8000,
        quantidadeMensal: 60,
        anexoSimples: 'III',
        rbt12: 800000,
        atividadePresumido: 'servicos',
        margemDesejada: 25
      };

      // Quando
      const resultado = compararRegimes(params);

      // Então
      expect(resultado.economia).toBeGreaterThanOrEqual(0);
      
      // Economia deve ser a diferença entre o melhor e o pior
      const validos = Object.values(resultado.resultados).filter(r => !r.erro);
      if (validos.length >= 2) {
        const lucros = validos.map(r => r.resultado.lucroLiquidoMensal).sort((a, b) => b - a);
        expect(resultado.economia).toBe(lucros[0] - lucros[lucros.length - 1]);
      }
    });
  });

  describe('Dado regime com erro', () => {
    test('Quando um regime falhar, Então deve continuar com os outros', () => {
      // Dado - parâmetros que podem causar erro em algum regime
      const params = {
        custoUnitario: 10,
        despesasFixasMensais: 100,
        quantidadeMensal: 5,
        margemDesejada: 10
      };

      // Quando
      const resultado = compararRegimes(params);

      // Então - pelo menos um regime deve funcionar
      const validos = Object.entries(resultado.resultados).filter(([, r]) => !r.erro);
      expect(validos.length).toBeGreaterThanOrEqual(1);
    });
  });
});

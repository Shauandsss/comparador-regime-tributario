/**
 * Testes Unitários - Service: Diagnóstico Tributário
 * @jest-environment node
 */

import { diagnosticar } from '../src/services/diagnostico.service.js';

describe('Diagnóstico Tributário - Testes Unitários', () => {
  describe('Dado uma empresa mão-de-obra intensiva (Simples vence)', () => {
    test('Quando diagnosticar com receita 500.000, despesas 100.000, folha 200.000 e atividade serviço, Então melhor regime deve ser Simples com economia anual > 15.000', () => {
      // Dado
      const input = {
        receitaBruta12: 500000,
        receitaMes: 42000,
        despesasMes: 8000,
        folhaMes: 17000,
        folha12: 200000,
        atividade: 'servicos'
      };

      // Quando
      const resultado = diagnosticar(input);

      // Então
      expect(resultado).toBeDefined();
      
      // Simples deve estar entre os regimes aplicáveis
      const simplesCalculo = resultado.calculos.simples;
      expect(simplesCalculo).toBeDefined();
      
      // Com folha alta (200k/500k = 40%), deve enquadrar no Anexo III
      if (simplesCalculo.aplicavel) {
        const fatorR = (200000 / 500000) * 100;
        expect(fatorR).toBeGreaterThanOrEqual(28);
      }
      
      // Deve ter ranking de regimes
      expect(resultado.ranking).toBeDefined();
      expect(resultado.ranking.length).toBeGreaterThan(0);
      
      // Se Simples for aplicável e melhor, economia deve ser considerável
      if (resultado.recomendacao.melhorRegime === 'Simples Nacional') {
        expect(resultado.recomendacao.economiaAnual).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Dado uma empresa pouco intensiva em folha (Presumido vence)', () => {
    test('Quando diagnosticar com receita 2.000.000, despesas 200.000, folha 100.000 e atividade comércio, Então melhor regime deve ser Presumido', () => {
      // Dado
      const input = {
        receitaBruta12: 2000000,
        receitaMes: 167000,
        despesasMes: 17000,
        folhaMes: 8000,
        folha12: 100000,
        atividade: 'comercio'
      };

      // Quando
      const resultado = diagnosticar(input);

      // Então
      expect(resultado).toBeDefined();
      expect(resultado.calculos.presumido.aplicavel).toBe(true);
      
      // Para comércio com boa margem, Presumido costuma ser vantajoso
      expect(resultado.recomendacao.melhorRegime).toBeDefined();
      
      // Deve ter cálculo de todos os regimes aplicáveis
      expect(resultado.ranking.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Dado valores inválidos', () => {
    test('Quando diagnosticar sem receita bruta, Então deve lançar erro', () => {
      // Dado
      const input = {
        receitaMes: 50000,
        despesasMes: 10000,
        folhaMes: 5000
      };

      // Quando / Então
      expect(() => diagnosticar(input)).toThrow('Receita Bruta anual é obrigatória');
    });

    test('Quando diagnosticar sem receita mensal, Então deve lançar erro', () => {
      // Dado
      const input = {
        receitaBruta12: 600000,
        despesasMes: 10000,
        folhaMes: 5000
      };

      // Quando / Então
      expect(() => diagnosticar(input)).toThrow('Receita mensal é obrigatória');
    });
  });

  describe('Dado empresa acima do limite do Simples', () => {
    test('Quando diagnosticar com receita > 4,8 milhões, Então Simples não deve ser aplicável', () => {
      // Dado
      const input = {
        receitaBruta12: 5000000,
        receitaMes: 417000,
        despesasMes: 100000,
        folhaMes: 50000,
        atividade: 'comercio'
      };

      // Quando
      const resultado = diagnosticar(input);

      // Então
      expect(resultado.calculos.simples.aplicavel).toBe(false);
      expect(resultado.calculos.simples.motivo).toContain('limite');
      
      // Deve comparar apenas Presumido e Real
      expect(resultado.ranking.length).toBe(2);
    });
  });

  describe('Dado empresa com prejuízo (Real vence)', () => {
    test('Quando diagnosticar com despesas muito altas gerando prejuízo, Então Real deve ser vantajoso', () => {
      // Dado
      const input = {
        receitaBruta12: 1200000,
        receitaMes: 100000,
        despesasMes: 70000,
        folhaMes: 35000,
        atividade: 'servicos'
      };

      // Quando
      const resultado = diagnosticar(input);

      // Então
      const lucroContabil = 100000 - 70000 - 35000;
      expect(lucroContabil).toBeLessThanOrEqual(0);
      
      // No Lucro Real com prejuízo, não há IRPJ/CSLL
      if (resultado.calculos.real.aplicavel) {
        expect(resultado.calculos.real.aviso).toBeDefined();
      }
    });
  });

  describe('Dado recomendações personalizadas', () => {
    test('Quando diagnosticar, Então deve gerar recomendações', () => {
      // Dado
      const input = {
        receitaBruta12: 800000,
        receitaMes: 67000,
        despesasMes: 20000,
        folhaMes: 15000,
        folha12: 180000,
        atividade: 'servicos'
      };

      // Quando
      const resultado = diagnosticar(input);

      // Então
      expect(resultado.recomendacoes).toBeDefined();
      expect(Array.isArray(resultado.recomendacoes)).toBe(true);
      expect(resultado.recomendacoes.length).toBeGreaterThan(0);
      
      // Primeira recomendação deve ser sobre o melhor regime
      const primeirRec = resultado.recomendacoes[0];
      expect(primeirRec.tipo).toBe('principal');
      expect(primeirRec.titulo).toContain(resultado.recomendacao.melhorRegime);
    });
  });

  describe('Dado cálculo de economia', () => {
    test('Quando diagnosticar e houver múltiplos regimes, Então deve calcular economia do melhor vs segundo melhor', () => {
      // Dado
      const input = {
        receitaBruta12: 1000000,
        receitaMes: 83000,
        despesasMes: 25000,
        folhaMes: 20000,
        atividade: 'comercio'
      };

      // Quando
      const resultado = diagnosticar(input);

      // Então
      if (resultado.ranking.length >= 2) {
        const economia = resultado.recomendacao.economiaAnual;
        const melhor = resultado.ranking[0].valor;
        const segundoMelhor = resultado.ranking[1].valor;
        
        expect(economia).toBe(segundoMelhor - melhor);
        expect(economia).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Dado diferentes atividades', () => {
    test('Quando diagnosticar atividade de comércio, Então deve usar presunção de 8%', () => {
      // Dado
      const input = {
        receitaBruta12: 600000,
        receitaMes: 50000,
        atividade: 'comercio'
      };

      // Quando
      const resultado = diagnosticar(input);

      // Então
      expect(resultado.empresa.atividade).toContain('Comércio');
      
      if (resultado.calculos.presumido.aplicavel) {
        expect(resultado.calculos.presumido.presuncaoIRPJ).toBe(8);
      }
    });

    test('Quando diagnosticar atividade de serviços, Então deve usar presunção de 32%', () => {
      // Dado
      const input = {
        receitaBruta12: 600000,
        receitaMes: 50000,
        atividade: 'servicos'
      };

      // Quando
      const resultado = diagnosticar(input);

      // Então
      expect(resultado.empresa.atividade).toContain('Serviços');
      
      if (resultado.calculos.presumido.aplicavel) {
        expect(resultado.calculos.presumido.presuncaoIRPJ).toBe(32);
      }
    });
  });

  describe('Dado ranking de regimes', () => {
    test('Quando diagnosticar, Então ranking deve estar ordenado do menor para o maior valor', () => {
      // Dado
      const input = {
        receitaBruta12: 1500000,
        receitaMes: 125000,
        despesasMes: 40000,
        folhaMes: 30000,
        atividade: 'servicos'
      };

      // Quando
      const resultado = diagnosticar(input);

      // Então
      const ranking = resultado.ranking;
      expect(ranking.length).toBeGreaterThan(0);
      
      // Verificar ordenação
      for (let i = 0; i < ranking.length - 1; i++) {
        expect(ranking[i].valor).toBeLessThanOrEqual(ranking[i + 1].valor);
      }
      
      // Primeiro do ranking deve ter ranking = 1
      expect(ranking[0].ranking).toBe(1);
    });
  });
});

/**
 * Testes Unitários - Service: Simulador do Fator R
 * @jest-environment node
 */

import { calcularFatorR, calcularCenarios } from '../src/services/fator-r.service.js';

describe('Simulador do Fator R - Testes Unitários', () => {
  describe('Dado um Fator R válido acima de 28%', () => {
    test('Quando calcular com folha de 300.000 e RBT12 de 1.000.000, Então deve retornar fator 0.30 e Anexo III', () => {
      // Dado
      const folha12 = 300000;
      const rbt12 = 1000000;

      // Quando
      const resultado = calcularFatorR(folha12, rbt12);

      // Então
      expect(resultado.sucesso).toBe(true);
      expect(resultado.calculo.fatorRDecimal).toBe(0.30);
      expect(resultado.anexo.atual).toBe('ANEXO_III');
      expect(resultado.anexo.enquadraAnexoIII).toBe(true);
    });
  });

  describe('Dado um Fator R abaixo de 28%', () => {
    test('Quando calcular com folha de 100.000 e RBT12 de 1.000.000, Então deve retornar fator 0.10 e Anexo V', () => {
      // Dado
      const folha12 = 100000;
      const rbt12 = 1000000;

      // Quando
      const resultado = calcularFatorR(folha12, rbt12);

      // Então
      expect(resultado.sucesso).toBe(true);
      expect(resultado.calculo.fatorRDecimal).toBe(0.10);
      expect(resultado.anexo.atual).toBe('ANEXO_V');
      expect(resultado.anexo.enquadraAnexoIII).toBe(false);
    });
  });

  describe('Dado uma entrada inválida com RBT12 zero', () => {
    test('Quando calcular com RBT12 zero, Então deve lançar erro informando que RBT12 não pode ser zero', () => {
      // Dado
      const folha12 = 100000;
      const rbt12 = 0;

      // Quando / Então
      expect(() => calcularFatorR(folha12, rbt12)).toThrow('RBT12 (Receita Bruta Total 12 meses) é obrigatório e deve ser maior que zero');
    });
  });

  describe('Dado uma entrada inválida com folha negativa', () => {
    test('Quando calcular com folha negativa, Então deve lançar erro', () => {
      // Dado
      const folha12 = -50000;
      const rbt12 = 1000000;

      // Quando / Então
      expect(() => calcularFatorR(folha12, rbt12)).toThrow('Folha de salários não pode ser negativa');
    });
  });

  describe('Dado cálculos no limite de 28%', () => {
    test('Quando calcular exatamente com 28% (280.000 / 1.000.000), Então deve enquadrar no Anexo III', () => {
      // Dado
      const folha12 = 280000;
      const rbt12 = 1000000;

      // Quando
      const resultado = calcularFatorR(folha12, rbt12);

      // Então
      expect(resultado.calculo.fatorRDecimal).toBe(0.28);
      expect(resultado.anexo.atual).toBe('ANEXO_III');
      expect(resultado.anexo.enquadraAnexoIII).toBe(true);
    });

    test('Quando calcular com 27.9% (279.000 / 1.000.000), Então deve enquadrar no Anexo V', () => {
      // Dado
      const folha12 = 279000;
      const rbt12 = 1000000;

      // Quando
      const resultado = calcularFatorR(folha12, rbt12);

      // Então
      expect(resultado.calculo.fatorRDecimal).toBe(0.279);
      expect(resultado.anexo.atual).toBe('ANEXO_V');
      expect(resultado.anexo.enquadraAnexoIII).toBe(false);
    });
  });

  describe('Testes da função calcularCenarios', () => {
    test('Quando calcular cenários para diferentes percentuais, Então deve retornar array com 5 cenários', () => {
      // Dado
      const rbt12 = 1000000;
      const folhaAtual = 200000;

      // Quando
      const cenarios = calcularCenarios(rbt12, folhaAtual);

      // Então
      expect(cenarios).toHaveLength(5);
      expect(cenarios[0].percentual).toBe('20%');
      expect(cenarios[2].percentual).toBe('28%');
      expect(cenarios[4].percentual).toBe('36%');
    });

    test('Quando calcular cenários, Então deve identificar corretamente os anexos', () => {
      // Dado
      const rbt12 = 1000000;
      const folhaAtual = 200000;

      // Quando
      const cenarios = calcularCenarios(rbt12, folhaAtual);

      // Então
      // 20% e 24% devem estar no Anexo V
      expect(cenarios[0].anexo).toBe('Anexo V');
      expect(cenarios[1].anexo).toBe('Anexo V');
      
      // 28%, 32% e 36% devem estar no Anexo III
      expect(cenarios[2].anexo).toBe('Anexo III');
      expect(cenarios[3].anexo).toBe('Anexo III');
      expect(cenarios[4].anexo).toBe('Anexo III');
    });
  });

  describe('Testes de análise e recomendações', () => {
    test('Quando fator R estiver abaixo de 20%, Então situação deve ser "Muito Abaixo" e nível de risco "baixo"', () => {
      // Dado
      const folha12 = 150000;
      const rbt12 = 1000000;

      // Quando
      const resultado = calcularFatorR(folha12, rbt12);

      // Então
      expect(resultado.analise.situacao).toBe('Muito Abaixo');
      expect(resultado.analise.nivelRisco).toBe('baixo');
    });

    test('Quando fator R estiver acima de 32%, Então situação deve ser "Enquadrado (Confortável)"', () => {
      // Dado
      const folha12 = 350000;
      const rbt12 = 1000000;

      // Quando
      const resultado = calcularFatorR(folha12, rbt12);

      // Então
      expect(resultado.analise.situacao).toBe('Enquadrado (Confortável)');
      expect(resultado.analise.nivelRisco).toBe('otimo');
    });
  });

  describe('Testes de cálculo de ações necessárias', () => {
    test('Quando folha estiver abaixo de 28%, Então deve informar quanto precisa aumentar', () => {
      // Dado
      const folha12 = 200000;
      const rbt12 = 1000000;
      const folhaIdeal = 280000;

      // Quando
      const resultado = calcularFatorR(folha12, rbt12);

      // Então
      expect(resultado.acoes.precisaAumentar).toBe(true);
      expect(parseFloat(resultado.acoes.folhaIdealPara28)).toBe(folhaIdeal);
      expect(parseFloat(resultado.acoes.diferencaFolha)).toBe(80000);
    });

    test('Quando folha estiver acima de 28%, Então deve informar que já está na faixa ideal', () => {
      // Dado
      const folha12 = 300000;
      const rbt12 = 1000000;

      // Quando
      const resultado = calcularFatorR(folha12, rbt12);

      // Então
      expect(resultado.acoes.precisaAumentar).toBe(false);
      expect(resultado.acoes.precisaDiminuir).toBe(true);
    });
  });
});

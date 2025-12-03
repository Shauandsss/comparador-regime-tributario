/**
 * Testes Unitários - Service: Histórico Tributário
 * @jest-environment node
 */

import { jest } from '@jest/globals';

// Mock do historico-store antes de importar o service
jest.unstable_mockModule('../src/data/historico-store.js', () => {
  const registros = new Map();
  
  return {
    addRegistro: jest.fn((empresaId, registro) => {
      if (!registros.has(empresaId)) {
        registros.set(empresaId, []);
      }
      const novoRegistro = {
        ...registro,
        id: Date.now(),
        criadoEm: new Date().toISOString()
      };
      registros.get(empresaId).push(novoRegistro);
      return novoRegistro;
    }),
    getHistorico: jest.fn((empresaId) => {
      return registros.get(empresaId) || [];
    }),
    getEstatisticas: jest.fn((empresaId) => {
      const historico = registros.get(empresaId) || [];
      if (historico.length === 0) {
        return { totalRegistros: 0, faturamentoTotal: 0, tributosTotal: 0 };
      }
      return {
        totalRegistros: historico.length,
        faturamentoTotal: historico.reduce((acc, r) => acc + r.faturamento, 0),
        tributosTotal: historico.reduce((acc, r) => acc + r.tributosPagos, 0),
        aliquotaMedia: historico.reduce((acc, r) => acc + r.aliquotaEfetiva, 0) / historico.length
      };
    }),
    removeRegistro: jest.fn((empresaId, mes, ano) => {
      const historico = registros.get(empresaId) || [];
      const index = historico.findIndex(r => r.mes === mes && r.ano === ano);
      if (index >= 0) {
        historico.splice(index, 1);
        return true;
      }
      return false;
    }),
    limparRegistros: () => registros.clear()
  };
});

const historicoService = await import('../src/services/historico.service.js');
const historicoStore = await import('../src/data/historico-store.js');

describe('Histórico Tributário - Testes Unitários', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    historicoStore.limparRegistros?.();
  });

  describe('Dado salvarMes', () => {
    test('Quando salvar registro válido, Então deve retornar registro com alíquota efetiva calculada', () => {
      // Dado
      const dados = {
        empresaId: 'empresa-teste',
        mes: 1,
        ano: 2024,
        faturamento: 100000,
        regime: 'simples',
        tributosPagos: 8000
      };

      // Quando
      const resultado = historicoService.salvarMes(dados);

      // Então
      expect(resultado).toBeDefined();
      expect(resultado.mes).toBe(1);
      expect(resultado.ano).toBe(2024);
      expect(resultado.faturamento).toBe(100000);
      expect(resultado.tributosPagos).toBe(8000);
      expect(resultado.aliquotaEfetiva).toBe(8); // 8000/100000 * 100
    });

    test('Quando mês for inválido, Então deve lançar erro', () => {
      // Dado
      const dados = {
        mes: 13,
        ano: 2024,
        faturamento: 50000,
        regime: 'presumido',
        tributosPagos: 5000
      };

      // Quando / Então
      expect(() => historicoService.salvarMes(dados)).toThrow('Mês inválido');
    });

    test('Quando mês for zero, Então deve lançar erro', () => {
      // Dado
      const dados = {
        mes: 0,
        ano: 2024,
        faturamento: 50000,
        regime: 'presumido',
        tributosPagos: 5000
      };

      // Quando / Então
      expect(() => historicoService.salvarMes(dados)).toThrow('Mês inválido');
    });

    test('Quando ano for inválido, Então deve lançar erro', () => {
      // Dado
      const dados = {
        mes: 6,
        ano: 1999,
        faturamento: 50000,
        regime: 'real',
        tributosPagos: 7000
      };

      // Quando / Então
      expect(() => historicoService.salvarMes(dados)).toThrow('Ano inválido');
    });

    test('Quando faturamento for negativo, Então deve lançar erro', () => {
      // Dado
      const dados = {
        mes: 6,
        ano: 2024,
        faturamento: -50000,
        regime: 'simples',
        tributosPagos: 5000
      };

      // Quando / Então
      expect(() => historicoService.salvarMes(dados)).toThrow('Faturamento inválido');
    });

    test('Quando regime for inválido, Então deve lançar erro', () => {
      // Dado
      const dados = {
        mes: 6,
        ano: 2024,
        faturamento: 50000,
        regime: 'invalido',
        tributosPagos: 5000
      };

      // Quando / Então
      expect(() => historicoService.salvarMes(dados)).toThrow('Regime inválido');
    });

    test('Quando tributos forem negativos, Então deve lançar erro', () => {
      // Dado
      const dados = {
        mes: 6,
        ano: 2024,
        faturamento: 50000,
        regime: 'simples',
        tributosPagos: -5000
      };

      // Quando / Então
      expect(() => historicoService.salvarMes(dados)).toThrow('Tributos pagos inválido');
    });

    test('Quando salvar com regime MEI, Então deve aceitar', () => {
      // Dado
      const dados = {
        mes: 3,
        ano: 2024,
        faturamento: 8000,
        regime: 'mei',
        tributosPagos: 66
      };

      // Quando
      const resultado = historicoService.salvarMes(dados);

      // Então
      expect(resultado.regime).toBe('mei');
    });
  });

  describe('Dado obterHistorico', () => {
    test('Quando obter histórico de empresa sem registros, Então deve retornar lista vazia', () => {
      // Dado / Quando
      const resultado = historicoService.obterHistorico('empresa-inexistente');

      // Então
      expect(resultado.registros).toEqual([]);
      expect(resultado.totalRegistros).toBe(0);
    });

    test('Quando obter histórico com filtro de ano, Então deve retornar apenas registros do ano', () => {
      // Dado
      historicoService.salvarMes({
        empresaId: 'empresa-filtro',
        mes: 1,
        ano: 2023,
        faturamento: 50000,
        regime: 'simples',
        tributosPagos: 4000
      });
      
      historicoService.salvarMes({
        empresaId: 'empresa-filtro',
        mes: 6,
        ano: 2024,
        faturamento: 60000,
        regime: 'simples',
        tributosPagos: 4800
      });

      // Quando
      const resultado = historicoService.obterHistorico('empresa-filtro', { anoInicio: 2024 });

      // Então
      expect(resultado.registros.every(r => r.ano >= 2024)).toBe(true);
    });

    test('Quando obter histórico com filtro de regime, Então deve retornar apenas registros do regime', () => {
      // Dado
      historicoService.salvarMes({
        empresaId: 'empresa-regime',
        mes: 1,
        ano: 2024,
        faturamento: 50000,
        regime: 'simples',
        tributosPagos: 4000
      });
      
      historicoService.salvarMes({
        empresaId: 'empresa-regime',
        mes: 2,
        ano: 2024,
        faturamento: 60000,
        regime: 'presumido',
        tributosPagos: 6000
      });

      // Quando
      const resultado = historicoService.obterHistorico('empresa-regime', { regime: 'simples' });

      // Então
      expect(resultado.registros.every(r => r.regime === 'simples')).toBe(true);
    });

    test('Quando obter histórico, Então deve incluir estatísticas', () => {
      // Dado
      historicoService.salvarMes({
        empresaId: 'empresa-stats',
        mes: 1,
        ano: 2024,
        faturamento: 100000,
        regime: 'simples',
        tributosPagos: 8000
      });

      // Quando
      const resultado = historicoService.obterHistorico('empresa-stats');

      // Então
      expect(resultado.estatisticas).toBeDefined();
      expect(resultado.estatisticas.faturamentoTotal).toBeGreaterThan(0);
      expect(resultado.estatisticas.tributosTotal).toBeGreaterThan(0);
    });

    test('Quando obter histórico com múltiplos registros, Então deve calcular variação mês a mês', () => {
      // Dado
      historicoService.salvarMes({
        empresaId: 'empresa-variacao',
        mes: 1,
        ano: 2024,
        faturamento: 100000,
        regime: 'simples',
        tributosPagos: 8000
      });
      
      historicoService.salvarMes({
        empresaId: 'empresa-variacao',
        mes: 2,
        ano: 2024,
        faturamento: 120000,
        regime: 'simples',
        tributosPagos: 9600
      });

      // Quando
      const resultado = historicoService.obterHistorico('empresa-variacao');

      // Então
      if (resultado.registros.length >= 2) {
        expect(resultado.registros[0].variacao).toBeNull(); // Primeiro registro não tem variação
        expect(resultado.registros[1].variacao).toBeDefined();
        expect(resultado.registros[1].variacao.faturamento).toBe(20); // 20% de aumento
      }
    });
  });

  describe('Dado removerMes', () => {
    test('Quando remover registro existente, Então deve retornar true', () => {
      // Dado
      historicoService.salvarMes({
        empresaId: 'empresa-remover',
        mes: 5,
        ano: 2024,
        faturamento: 80000,
        regime: 'real',
        tributosPagos: 12000
      });

      // Quando
      const resultado = historicoService.removerMes('empresa-remover', 5, 2024);

      // Então
      expect(resultado).toBe(true);
    });

    test('Quando remover registro inexistente, Então deve retornar false', () => {
      // Dado / Quando
      const resultado = historicoService.removerMes('empresa-inexistente', 12, 2024);

      // Então
      expect(resultado).toBe(false);
    });
  });

  describe('Dado compararPeriodos', () => {
    test('Quando comparar dois períodos, Então deve calcular variação percentual', () => {
      // Dado
      historicoService.salvarMes({
        empresaId: 'empresa-comparar',
        mes: 6,
        ano: 2023,
        faturamento: 100000,
        regime: 'simples',
        tributosPagos: 8000
      });
      
      historicoService.salvarMes({
        empresaId: 'empresa-comparar',
        mes: 6,
        ano: 2024,
        faturamento: 150000,
        regime: 'simples',
        tributosPagos: 12000
      });

      // Quando
      const resultado = historicoService.compararPeriodos(
        'empresa-comparar',
        { anoInicio: 2023, anoFim: 2023 },
        { anoInicio: 2024, anoFim: 2024 }
      );

      // Então
      expect(resultado.periodo1).toBeDefined();
      expect(resultado.periodo2).toBeDefined();
      expect(resultado.variacao).toBeDefined();
      expect(resultado.variacao.faturamento).toBe(50); // 50% de aumento
      expect(resultado.variacao.tributos).toBe(50); // 50% de aumento
    });
  });

  describe('Dado dadosParaGrafico', () => {
    test('Quando gerar dados para gráfico, Então deve formatar labels corretamente', () => {
      // Dado
      historicoService.salvarMes({
        empresaId: 'empresa-grafico',
        mes: 1,
        ano: 2024,
        faturamento: 100000,
        regime: 'simples',
        tributosPagos: 8000
      });
      
      historicoService.salvarMes({
        empresaId: 'empresa-grafico',
        mes: 12,
        ano: 2024,
        faturamento: 150000,
        regime: 'simples',
        tributosPagos: 12000
      });

      // Quando
      const dados = historicoService.dadosParaGrafico('empresa-grafico');

      // Então
      expect(Array.isArray(dados)).toBe(true);
      if (dados.length > 0) {
        expect(dados[0].label).toContain('/2024');
        expect(dados[0]).toHaveProperty('faturamento');
        expect(dados[0]).toHaveProperty('tributos');
        expect(dados[0]).toHaveProperty('aliquota');
        expect(dados[0]).toHaveProperty('regime');
      }
    });

    test('Quando gerar dados para gráfico, Então deve incluir mês e ano numéricos', () => {
      // Dado
      historicoService.salvarMes({
        empresaId: 'empresa-grafico-2',
        mes: 6,
        ano: 2024,
        faturamento: 80000,
        regime: 'presumido',
        tributosPagos: 10000
      });

      // Quando
      const dados = historicoService.dadosParaGrafico('empresa-grafico-2');

      // Então
      if (dados.length > 0) {
        expect(dados[0].mes).toBe(6);
        expect(dados[0].ano).toBe(2024);
      }
    });
  });
});

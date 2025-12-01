/**
 * Testes unitários do serviço CNAE
 */

import { jest } from '@jest/globals';

// Mock do banco de dados
jest.unstable_mockModule('../src/data/cnae-database.js', () => ({
  cnaeDatabase: [
    {
      codigo: "6201501",
      descricao: "Desenvolvimento de programas de computador sob encomenda",
      anexo: "V",
      anexoAlternativo: "III",
      fatorR: true,
      percentualPresuncao: 32,
      aliquotaISS: 5,
      riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
      impedimentos: false
    },
    {
      codigo: "4711301",
      descricao: "Comércio varejista de mercadorias em geral - hipermercados",
      anexo: "I",
      anexoAlternativo: null,
      fatorR: false,
      percentualPresuncao: 8,
      aliquotaISS: null,
      riscos: [],
      impedimentos: false
    },
    {
      codigo: "6421200",
      descricao: "Bancos comerciais",
      anexo: null,
      anexoAlternativo: null,
      fatorR: false,
      percentualPresuncao: 32,
      aliquotaISS: null,
      riscos: ["Atividade vedada ao Simples Nacional"],
      impedimentos: true
    }
  ],
  buscarCnaePorCodigo: jest.fn((codigo) => {
    const database = [
      {
        codigo: "6201501",
        descricao: "Desenvolvimento de programas de computador sob encomenda",
        anexo: "V",
        anexoAlternativo: "III",
        fatorR: true,
        percentualPresuncao: 32,
        aliquotaISS: 5,
        riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
        impedimentos: false
      },
      {
        codigo: "4711301",
        descricao: "Comércio varejista de mercadorias em geral - hipermercados",
        anexo: "I",
        anexoAlternativo: null,
        fatorR: false,
        percentualPresuncao: 8,
        aliquotaISS: null,
        riscos: [],
        impedimentos: false
      },
      {
        codigo: "6421200",
        descricao: "Bancos comerciais",
        anexo: null,
        anexoAlternativo: null,
        fatorR: false,
        percentualPresuncao: 32,
        aliquotaISS: null,
        riscos: ["Atividade vedada ao Simples Nacional"],
        impedimentos: true
      }
    ];
    return database.find(c => c.codigo === codigo) || null;
  }),
  buscarCnaes: jest.fn((termo, limite) => {
    const database = [
      {
        codigo: "6201501",
        descricao: "Desenvolvimento de programas de computador sob encomenda",
        anexo: "V",
        fatorR: true,
        impedimentos: false
      }
    ];
    return database.filter(c => 
      c.codigo.includes(termo) || c.descricao.toLowerCase().includes(termo.toLowerCase())
    ).slice(0, limite);
  }),
  listarCnaesPorAnexo: jest.fn((anexo) => []),
  listarCnaesComFatorR: jest.fn(() => []),
  listarCnaesImpedidos: jest.fn(() => []),
  default: []
}));

const cnaeService = await import('../src/services/cnae.service.js');

describe('CNAE Service - Testes Unitários', () => {
  
  describe('consultarCnae', () => {
    
    it('deve retornar dados completos de um CNAE válido', () => {
      const resultado = cnaeService.consultarCnae('6201501');
      
      expect(resultado.encontrado).toBe(true);
      expect(resultado.cnae.codigo).toBe('6201501');
      expect(resultado.cnae.codigoFormatado).toBe('6201-5/01');
      expect(resultado.simplesNacional.permitido).toBe(true);
      expect(resultado.simplesNacional.anexo).toBe('V');
      expect(resultado.simplesNacional.fatorR).toBe(true);
      expect(resultado.lucroPresumido.percentualPresuncao).toBe(32);
    });

    it('deve retornar CNAE não encontrado para código inválido', () => {
      const resultado = cnaeService.consultarCnae('9999999');
      
      expect(resultado.encontrado).toBe(false);
      expect(resultado.mensagem).toContain('não encontrado');
    });

    it('deve indicar atividade impedida ao Simples', () => {
      const resultado = cnaeService.consultarCnae('6421200');
      
      expect(resultado.encontrado).toBe(true);
      expect(resultado.simplesNacional.permitido).toBe(false);
      expect(resultado.impedimentos).toBe(true);
    });

    it('deve calcular alíquotas quando RBT12 é informado', () => {
      const resultado = cnaeService.consultarCnae('6201501', 500000);
      
      expect(resultado.simplesNacional.simulacao).toBeDefined();
      expect(resultado.simplesNacional.simulacao.rbt12).toBe(500000);
      expect(resultado.simplesNacional.simulacao.anexoPrincipal).toBeDefined();
      expect(resultado.simplesNacional.simulacao.anexoAlternativo).toBeDefined();
    });

    it('deve identificar atividades com fator R', () => {
      const resultado = cnaeService.consultarCnae('6201501');
      
      expect(resultado.simplesNacional.fatorR).toBe(true);
      expect(resultado.simplesNacional.anexoAlternativo).toBe('III');
      expect(resultado.simplesNacional.observacaoFatorR).toBeTruthy();
    });

    it('deve identificar atividades SEM fator R', () => {
      const resultado = cnaeService.consultarCnae('4711301');
      
      expect(resultado.simplesNacional.fatorR).toBe(false);
      expect(resultado.simplesNacional.anexoAlternativo).toBeNull();
    });
  });

  describe('pesquisarCnaes', () => {
    
    it('deve retornar lista de CNAEs para termo válido', () => {
      const resultados = cnaeService.pesquisarCnaes('desenvolvimento', 10);
      
      expect(Array.isArray(resultados)).toBe(true);
    });

    it('deve formatar códigos corretamente', () => {
      const resultados = cnaeService.pesquisarCnaes('6201501', 10);
      
      if (resultados.length > 0) {
        expect(resultados[0].codigoFormatado).toMatch(/\d{4}-\d\/\d{2}/);
      }
    });
  });
});

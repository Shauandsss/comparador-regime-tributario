/**
 * Testes de UI - Componente: DiagnosticoTributario
 * @vitest-environment jsdom
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DiagnosticoTributario from '../pages/DiagnosticoTributario';

// Mock do axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn()
  }
}));

import axios from 'axios';

// Helper para renderizar com Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('DiagnosticoTributario - Testes de UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dado renderização inicial', () => {
    test('Quando renderizar componente, Então deve exibir título e descrição', () => {
      // Dado / Quando
      renderWithRouter(<DiagnosticoTributario />);

      // Então
      expect(screen.getAllByText(/Diagnóstico Tributário/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Descubra qual o melhor regime/i).length).toBeGreaterThanOrEqual(1);
    });

    test('Quando renderizar, Então deve exibir formulário com campos de dados da empresa', () => {
      // Dado / Quando
      renderWithRouter(<DiagnosticoTributario />);

      // Então
      expect(screen.getAllByText(/Dados da Empresa/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Receita Bruta dos últimos 12 meses/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Receita Mensal Atual/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Despesas Mensais/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Folha de Pagamento/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Tipo de Atividade/i).length).toBeGreaterThanOrEqual(1);
    });

    test('Quando renderizar, Então deve ter botão Analisar', () => {
      // Dado / Quando
      renderWithRouter(<DiagnosticoTributario />);

      // Então
      expect(screen.getByRole('button', { name: /Analisar/i })).toBeDefined();
    });

    test('Quando renderizar, Então deve ter opções de atividade', () => {
      // Dado / Quando
      renderWithRouter(<DiagnosticoTributario />);

      // Então
      const select = screen.getByRole('combobox');
      expect(select).toBeDefined();
      expect(screen.getAllByText(/Comércio/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Serviços/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Dado validação de campos', () => {
    test('Quando analisar sem RBT12, Então deve mostrar erro', async () => {
      // Dado
      renderWithRouter(<DiagnosticoTributario />);

      // Quando
      const btnAnalisar = screen.getByRole('button', { name: /Analisar/i });
      fireEvent.click(btnAnalisar);

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/Informe a Receita Bruta/i).length).toBeGreaterThanOrEqual(1);
      });
    });

    test('Quando analisar sem receita mensal, Então deve mostrar erro', async () => {
      // Dado
      renderWithRouter(<DiagnosticoTributario />);
      
      const inputs = screen.getAllByPlaceholderText('R$ 0,00');
      fireEvent.change(inputs[0], { target: { value: '120000000' } }); // RBT12

      // Quando
      const btnAnalisar = screen.getByRole('button', { name: /Analisar/i });
      fireEvent.click(btnAnalisar);

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/Informe a Receita Mensal/i).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Dado análise tributária', () => {
    test('Quando analisar com sucesso, Então deve exibir melhor regime', async () => {
      // Dado
      axios.post.mockResolvedValueOnce({
        data: {
          dados: {
            recomendacao: {
              melhorRegime: 'Simples Nacional',
              tributosAnuais: 96000,
              aliquotaEfetiva: 8,
              economiaAnual: 24000,
              economiaMensal: 2000,
              percentualEconomia: 20
            },
            ranking: [
              { regime: 'Simples Nacional', valor: 96000, aliquota: 8, ranking: 1 },
              { regime: 'Lucro Presumido', valor: 120000, aliquota: 10, ranking: 2 },
              { regime: 'Lucro Real', valor: 144000, aliquota: 12, ranking: 3 }
            ],
            calculos: {
              simples: { aplicavel: true, anexo: 'III', valorMensal: 8000, valorAnual: 96000 },
              presumido: { aplicavel: true, presuncaoIRPJ: 32, valorMensal: 10000, valorAnual: 120000 },
              real: { aplicavel: true, lucroContabil: 50000, valorMensal: 12000, valorAnual: 144000 }
            },
            recomendacoes: [
              { tipo: 'principal', titulo: 'Simples Nacional', descricao: 'Melhor opção para seu perfil' }
            ]
          }
        }
      });

      renderWithRouter(<DiagnosticoTributario />);
      
      const inputs = screen.getAllByPlaceholderText('R$ 0,00');
      fireEvent.change(inputs[0], { target: { value: '120000000' } }); // RBT12: R$ 1.200.000
      fireEvent.change(inputs[1], { target: { value: '10000000' } }); // Receita mensal: R$ 100.000

      // Quando
      const btnAnalisar = screen.getByRole('button', { name: /Analisar/i });
      fireEvent.click(btnAnalisar);

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/Melhor Regime/i).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Dado ranking de regimes', () => {
    test('Quando análise retornar ranking, Então deve exibir posições', async () => {
      // Dado
      axios.post.mockResolvedValueOnce({
        data: {
          dados: {
            recomendacao: {
              melhorRegime: 'Simples Nacional',
              tributosAnuais: 50000,
              aliquotaEfetiva: 6,
              economiaAnual: 10000,
              economiaMensal: 833,
              percentualEconomia: 10
            },
            ranking: [
              { regime: 'Simples Nacional', valor: 50000, aliquota: 6, ranking: 1 },
              { regime: 'Lucro Presumido', valor: 60000, aliquota: 7.2, ranking: 2 }
            ],
            calculos: {
              simples: { aplicavel: true, anexo: 'III', valorAnual: 50000, valorMensal: 4166 },
              presumido: { aplicavel: true, valorAnual: 60000, valorMensal: 5000 },
              real: { aplicavel: true, valorAnual: 70000, valorMensal: 5833 }
            },
            recomendacoes: []
          }
        }
      });

      renderWithRouter(<DiagnosticoTributario />);
      
      const inputs = screen.getAllByPlaceholderText('R$ 0,00');
      fireEvent.change(inputs[0], { target: { value: '100000000' } });
      fireEvent.change(inputs[1], { target: { value: '8333333' } });

      // Quando
      const btnAnalisar = screen.getByRole('button', { name: /Analisar/i });
      fireEvent.click(btnAnalisar);

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/Ranking dos Regimes/i).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Dado simulação de cenários', () => {
    test('Quando renderizar resultado, Então pode exibir botão Simular', async () => {
      // Dado
      axios.post.mockResolvedValueOnce({
        data: {
          dados: {
            recomendacao: { 
              melhorRegime: 'Simples Nacional', 
              tributosAnuais: 50000,
              aliquotaEfetiva: 6,
              economiaAnual: 10000
            },
            ranking: [{ regime: 'Simples Nacional', ranking: 1, valor: 50000, aliquota: 6 }],
            calculos: { 
              simples: { aplicavel: true, anexo: 'III', valorAnual: 50000, valorMensal: 4166 },
              presumido: { aplicavel: true, valorAnual: 60000, valorMensal: 5000 },
              real: { aplicavel: true, valorAnual: 70000, valorMensal: 5833 }
            },
            recomendacoes: []
          }
        }
      });

      renderWithRouter(<DiagnosticoTributario />);
      
      const inputs = screen.getAllByPlaceholderText('R$ 0,00');
      fireEvent.change(inputs[0], { target: { value: '100000000' } });
      fireEvent.change(inputs[1], { target: { value: '8333333' } });

      const btnAnalisar = screen.getByRole('button', { name: /Analisar/i });
      fireEvent.click(btnAnalisar);

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/Melhor Regime/i).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Dado botão voltar', () => {
    test('Quando renderizar, Então deve ter botão de voltar', () => {
      // Dado / Quando
      renderWithRouter(<DiagnosticoTributario />);

      // Então
      expect(screen.getAllByText(/Voltar para Home/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Dado erro na API', () => {
    test('Quando API retornar erro, Então deve exibir mensagem', async () => {
      // Dado
      axios.post.mockRejectedValueOnce({
        response: {
          data: {
            mensagem: 'Erro ao processar diagnóstico'
          }
        }
      });

      renderWithRouter(<DiagnosticoTributario />);
      
      const inputs = screen.getAllByPlaceholderText('R$ 0,00');
      fireEvent.change(inputs[0], { target: { value: '100000000' } });
      fireEvent.change(inputs[1], { target: { value: '8333333' } });

      // Quando
      const btnAnalisar = screen.getByRole('button', { name: /Analisar/i });
      fireEvent.click(btnAnalisar);

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/Erro ao processar/i).length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});

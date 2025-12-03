/**
 * Testes de UI - Componente: CalculadoraMargem
 * @vitest-environment jsdom
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CalculadoraMargem from '../pages/CalculadoraMargem';

// Mock do fetch
global.fetch = vi.fn();

// Helper para renderizar com Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CalculadoraMargem - Testes de UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dado renderização inicial', () => {
    test('Quando renderizar componente, Então deve exibir título e descrição', () => {
      // Dado / Quando
      renderWithRouter(<CalculadoraMargem />);

      // Então
      expect(screen.getAllByText(/Calculadora de Margem/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Calcule o preço mínimo de venda/i).length).toBeGreaterThanOrEqual(1);
    });

    test('Quando renderizar, Então deve exibir toggle de modo', () => {
      // Dado / Quando
      renderWithRouter(<CalculadoraMargem />);

      // Então
      expect(screen.getAllByText(/Cálculo Simples/i).length).toBeGreaterThanOrEqual(1);
      // Há múltiplos elementos com "Comparar Regimes" (toggle e botão)
      expect(screen.getAllByText(/Comparar Regimes/i).length).toBeGreaterThanOrEqual(1);
    });

    test('Quando renderizar, Então deve exibir campos de Custo e Quantidade', () => {
      // Dado / Quando
      renderWithRouter(<CalculadoraMargem />);

      // Então
      expect(screen.getAllByText(/Custo Unitário/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByPlaceholderText(/Ex: 50/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByPlaceholderText(/Ex: 100/i).length).toBeGreaterThanOrEqual(1);
    });

    test('Quando renderizar, Então deve ter botão de calcular', () => {
      // Dado / Quando
      renderWithRouter(<CalculadoraMargem />);

      // Então
      const botoes = screen.getAllByRole('button');
      const botaoCalcular = botoes.find(b => b.textContent.includes('Calcular'));
      expect(botaoCalcular).toBeDefined();
    });

    test('Quando renderizar, Então deve exibir estado inicial "Calcule seu preço ideal"', () => {
      // Dado / Quando
      renderWithRouter(<CalculadoraMargem />);

      // Então
      expect(screen.getAllByText(/Calcule seu preço ideal/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Dado modo Cálculo Simples', () => {
    test('Quando modo simples ativo, Então deve exibir campos de Anexo do Simples', () => {
      // Dado / Quando
      renderWithRouter(<CalculadoraMargem />);

      // Então
      expect(screen.getAllByText(/Anexo do Simples/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/RBT12/i).length).toBeGreaterThanOrEqual(1);
    });

    test('Quando selecionar Simples Nacional, Então deve exibir campos de Anexo e RBT12', () => {
      // Dado
      renderWithRouter(<CalculadoraMargem />);

      // Quando - Simples já é o padrão
      // Então
      expect(screen.getAllByText(/Anexo do Simples/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/RBT12/i).length).toBeGreaterThanOrEqual(1);
    });

    test('Quando calcular com sucesso, Então deve exibir preço mínimo e sugerido', async () => {
      // Dado
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: true,
          data: {
            precos: {
              precoMinimo: 120.50,
              precoSugerido: 145.80,
              markup: 2.5
            },
            custos: {
              custoUnitario: 50,
              despesasFixasUnitaria: 10,
              custoUnitarioTotal: 60
            },
            tributos: {
              aliquotaEfetiva: 8.5,
              detalhamento: { tipo: 'Simples Nacional' }
            },
            resultado: {
              receitaMensal: 14580,
              custoTotalProdutos: 5000,
              despesasFixasMensais: 1000,
              despesasVariaveisMensais: 729,
              tributosMensais: 1239,
              lucroLiquidoMensal: 6612,
              margemLiquidaReal: 45.35
            },
            cenarios: [
              { margem: 10, preco: 130, markup: 2.6, lucroUnitario: 30, lucroMensal: 3000 },
              { margem: 15, preco: 138, markup: 2.76, lucroUnitario: 40, lucroMensal: 4000 },
              { margem: 20, preco: 146, markup: 2.92, lucroUnitario: 50, lucroMensal: 5000 },
              { margem: 25, preco: 155, markup: 3.1, lucroUnitario: 60, lucroMensal: 6000 },
              { margem: 30, preco: 165, markup: 3.3, lucroUnitario: 70, lucroMensal: 7000 }
            ]
          }
        })
      });

      renderWithRouter(<CalculadoraMargem />);
      
      const inputsCusto = screen.getAllByPlaceholderText(/Ex: 50/i);
      const inputsQuantidade = screen.getAllByPlaceholderText(/Ex: 100/i);
      
      fireEvent.change(inputsCusto[0], { target: { value: '50' } });
      fireEvent.change(inputsQuantidade[0], { target: { value: '100' } });

      // Quando
      const botoes = screen.getAllByRole('button');
      const btnCalcular = botoes.find(b => b.textContent.includes('Calcular'));
      fireEvent.click(btnCalcular);

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/Preço Mínimo/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Preço Sugerido/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Markup/i).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Dado modo Comparar Regimes', () => {
    test('Quando alternar para modo comparação, Então botão deve ter texto Comparar Regimes', async () => {
      // Dado
      renderWithRouter(<CalculadoraMargem />);

      // Quando - clicar no toggle "Comparar Regimes"
      const toggleBtns = screen.getAllByRole('button');
      const btnToggleComparar = toggleBtns.find(b => b.textContent === 'Comparar Regimes');
      fireEvent.click(btnToggleComparar);

      // Então - verificar que o botão de calcular tem texto "Comparar Regimes"
      await waitFor(() => {
        const botoes = screen.getAllByRole('button');
        const btnCalcular = botoes.find(b => b.textContent.includes('Comparar Regimes'));
        expect(btnCalcular).toBeDefined();
      });
    });
  });

  describe('Dado cenários alternativos', () => {
    test('Quando resultado tiver cenários, Então deve exibir tabela com margens', async () => {
      // Dado
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: true,
          data: {
            precos: { precoMinimo: 100, precoSugerido: 120, markup: 2.4 },
            custos: { custoUnitarioTotal: 50 },
            tributos: { aliquotaEfetiva: 10 },
            resultado: {
              receitaMensal: 12000,
              custoTotalProdutos: 5000,
              despesasFixasMensais: 2000,
              tributosMensais: 1200,
              lucroLiquidoMensal: 3800,
              margemLiquidaReal: 31.67
            },
            cenarios: [
              { margem: 10, preco: 110, markup: 2.2, lucroUnitario: 15, lucroMensal: 1500 },
              { margem: 15, preco: 115, markup: 2.3, lucroUnitario: 20, lucroMensal: 2000 },
              { margem: 20, preco: 120, markup: 2.4, lucroUnitario: 25, lucroMensal: 2500 },
              { margem: 25, preco: 125, markup: 2.5, lucroUnitario: 30, lucroMensal: 3000 },
              { margem: 30, preco: 130, markup: 2.6, lucroUnitario: 35, lucroMensal: 3500 }
            ]
          }
        })
      });

      renderWithRouter(<CalculadoraMargem />);
      
      const inputsCusto1 = screen.getAllByPlaceholderText(/Ex: 50/i);
      const inputsQuantidade1 = screen.getAllByPlaceholderText(/Ex: 100/i);
      fireEvent.change(inputsCusto1[0], { target: { value: '50' } });
      fireEvent.change(inputsQuantidade1[0], { target: { value: '100' } });

      // Quando
      const botoes = screen.getAllByRole('button');
      const btnCalcular = botoes.find(b => b.textContent.includes('Calcular'));
      fireEvent.click(btnCalcular);

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/Cenários de Margem/i).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Dado erro na API', () => {
    test('Quando API retornar erro, Então deve exibir mensagem de erro', async () => {
      // Dado
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: false,
          error: 'Soma dos percentuais não pode ser >= 100%'
        })
      });

      renderWithRouter(<CalculadoraMargem />);
      
      fireEvent.change(screen.getByPlaceholderText(/Ex: 50/i), { target: { value: '50' } });
      fireEvent.change(screen.getByPlaceholderText(/Ex: 100/i), { target: { value: '100' } });

      // Quando
      const botoes = screen.getAllByRole('button');
      const btnCalcular = botoes.find(b => b.textContent.includes('Calcular'));
      fireEvent.click(btnCalcular);

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/Soma dos percentuais/i).length).toBeGreaterThanOrEqual(1);
      });
    });

    test('Quando conexão falhar, Então deve exibir erro de conexão', async () => {
      // Dado
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<CalculadoraMargem />);
      
      fireEvent.change(screen.getByPlaceholderText(/Ex: 50/i), { target: { value: '50' } });
      fireEvent.change(screen.getByPlaceholderText(/Ex: 100/i), { target: { value: '100' } });

      // Quando
      const botoes = screen.getAllByRole('button');
      const btnCalcular = botoes.find(b => b.textContent.includes('Calcular'));
      fireEvent.click(btnCalcular);

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/Erro ao conectar/i).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Dado configurações tributárias', () => {
    test('Quando selecionar Lucro Presumido, Então deve exibir campo de atividade', async () => {
      // Dado
      renderWithRouter(<CalculadoraMargem />);

      // Quando
      const selects = screen.getAllByRole('combobox');
      const selectRegime = selects.find(s => s.name === 'regime');
      fireEvent.change(selectRegime, { target: { value: 'presumido' } });

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/Tipo de Atividade/i).length).toBeGreaterThanOrEqual(1);
      });
    });

    test('Quando no modo comparação, Então deve exibir campos de todos os regimes', async () => {
      // Dado
      renderWithRouter(<CalculadoraMargem />);

      // Quando - toggle para comparação
      const toggleBtns = screen.getAllByRole('button');
      const btnToggleComparar = toggleBtns.find(b => b.textContent === 'Comparar Regimes');
      fireEvent.click(btnToggleComparar);

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/Anexo do Simples/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Tipo de Atividade/i).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Dado explicação do cálculo', () => {
    test('Quando renderizar, Então deve exibir seção de explicação', () => {
      // Dado / Quando
      renderWithRouter(<CalculadoraMargem />);

      // Então
      expect(screen.getAllByText(/Como funciona o cálculo/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Fórmula do Markup/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Dado botão desabilitado', () => {
    test('Quando campos obrigatórios estiverem vazios, Então botão deve estar desabilitado', () => {
      // Dado / Quando
      renderWithRouter(<CalculadoraMargem />);

      // Então
      const botoes = screen.getAllByRole('button');
      const btnCalcular = botoes.find(b => b.textContent.includes('Calcular'));
      expect(btnCalcular.disabled).toBe(true);
    });

    test('Quando preencher custo e quantidade, Então botão deve estar habilitado', async () => {
      // Dado
      renderWithRouter(<CalculadoraMargem />);
      
      // Quando
      fireEvent.change(screen.getByPlaceholderText(/Ex: 50/i), { target: { value: '50' } });
      fireEvent.change(screen.getByPlaceholderText(/Ex: 100/i), { target: { value: '100' } });

      // Então
      await waitFor(() => {
        const botoes = screen.getAllByRole('button');
        const btnCalcular = botoes.find(b => b.textContent.includes('Calcular'));
        expect(btnCalcular.disabled).toBe(false);
      });
    });
  });
});

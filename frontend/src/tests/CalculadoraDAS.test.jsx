/**
 * Testes de UI - Componente: CalculadoraDAS
 * @vitest-environment jsdom
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CalculadoraDAS from '../pages/CalculadoraDAS';

// Mock do axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn()
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

describe('CalculadoraDAS - Testes de UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dado renderização inicial', () => {
    test('Quando renderizar componente, Então deve exibir formulário com todos os campos', () => {
      // Dado / Quando
      renderWithRouter(<CalculadoraDAS />);

      // Então - Usar getAllByText pois pode haver múltiplos elementos
      expect(screen.getAllByText(/Calculadora de DAS/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Receita Bruta Total/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Faturamento do Mês/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/CNAE/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Folha de Salários/i).length).toBeGreaterThanOrEqual(1);
    });

    test('Quando renderizar, Então deve ter botões de Calcular e Limpar', () => {
      // Dado / Quando
      renderWithRouter(<CalculadoraDAS />);

      // Então
      expect(screen.getByRole('button', { name: /Calcular DAS/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Limpar/i })).toBeDefined();
    });

    test('Quando renderizar, Então deve exibir estado "Aguardando Cálculo"', () => {
      // Dado / Quando
      renderWithRouter(<CalculadoraDAS />);

      // Então
      expect(screen.getAllByText(/Aguardando Cálculo/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Dado preenchimento de formulário', () => {
    test('Quando preencher RBT12, Então campo deve aceitar valor numérico', async () => {
      // Dado
      renderWithRouter(<CalculadoraDAS />);
      const inputs = screen.getAllByPlaceholderText('0,00');
      const inputRBT12 = inputs[0];

      // Quando
      fireEvent.change(inputRBT12, { target: { value: '500000' } });

      // Então
      expect(inputRBT12.value).toBe('500000');
    });

    test('Quando selecionar CNAE, Então deve atualizar valor do select', async () => {
      // Dado
      renderWithRouter(<CalculadoraDAS />);
      const selectCNAE = screen.getByRole('combobox');

      // Quando
      fireEvent.change(selectCNAE, { target: { value: '4711-3' } });

      // Então
      expect(selectCNAE.value).toBe('4711-3');
    });
  });

  describe('Dado cálculo do DAS', () => {
    test('Quando calcular com sucesso, Então deve exibir resultado', async () => {
      // Dado
      axios.get.mockResolvedValueOnce({
        data: {
          sucesso: true,
          calculo: {
            valorDAS: 5000,
            valorDASFormatado: 'R$ 5.000,00',
            aliquotaEfetiva: '10,00%'
          },
          fatorR: {
            percentual: '25%',
            aplicavelAnexoIII: false
          },
          anexo: {
            codigo: 'ANEXO_V',
            nome: 'Anexo V',
            descricao: 'Serviços'
          },
          faixa: {
            numero: 3,
            aliquotaNominal: '19,5%',
            parcelaRedutora: 9900
          },
          detalhamento: {
            formula: 'RBT12 × Alíquota - Parcela',
            calculo: '(500000 × 19,5% - 9900) / 500000',
            valorDASCalculo: 'R$ 40.000,00 × 12,5% = R$ 5.000,00'
          }
        }
      });

      renderWithRouter(<CalculadoraDAS />);

      const inputs = screen.getAllByPlaceholderText('0,00');
      fireEvent.change(inputs[0], { target: { value: '500000' } });
      fireEvent.change(inputs[1], { target: { value: '40000' } });
      
      const selectCNAE = screen.getByRole('combobox');
      fireEvent.change(selectCNAE, { target: { value: '8599-6' } });

      // Quando
      const btnCalcular = screen.getByRole('button', { name: /Calcular DAS/i });
      fireEvent.click(btnCalcular);

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/Resultado do Cálculo/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/R\$ 5\.000,00/).length).toBeGreaterThanOrEqual(1);
      });
    });

    test('Quando API retornar erro de limite, Então deve exibir mensagem apropriada', async () => {
      // Dado
      axios.get.mockResolvedValueOnce({
        data: {
          sucesso: false,
          erro: 'Empresa ultrapassou o limite do Simples Nacional',
          limiteSimples: 4800000
        }
      });

      renderWithRouter(<CalculadoraDAS />);

      const inputs = screen.getAllByPlaceholderText('0,00');
      fireEvent.change(inputs[0], { target: { value: '5000000' } });
      fireEvent.change(inputs[1], { target: { value: '400000' } });
      
      const selectCNAE = screen.getByRole('combobox');
      fireEvent.change(selectCNAE, { target: { value: '4711-3' } });

      // Quando
      const btnCalcular = screen.getByRole('button', { name: /Calcular DAS/i });
      fireEvent.click(btnCalcular);

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/ultrapassou o limite/i).length).toBeGreaterThanOrEqual(1);
      });
    });

    test('Quando ocorrer erro na API, Então deve exibir mensagem de erro', async () => {
      // Dado
      axios.get.mockRejectedValueOnce({
        response: {
          data: {
            erro: 'Erro interno do servidor'
          }
        }
      });

      renderWithRouter(<CalculadoraDAS />);

      const inputs = screen.getAllByPlaceholderText('0,00');
      fireEvent.change(inputs[0], { target: { value: '500000' } });
      fireEvent.change(inputs[1], { target: { value: '40000' } });
      
      const selectCNAE = screen.getByRole('combobox');
      fireEvent.change(selectCNAE, { target: { value: '4711-3' } });

      // Quando
      const btnCalcular = screen.getByRole('button', { name: /Calcular DAS/i });
      fireEvent.click(btnCalcular);

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/Erro/i).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Dado botão Limpar', () => {
    test('Quando clicar em Limpar, Então deve resetar formulário', async () => {
      // Dado
      renderWithRouter(<CalculadoraDAS />);
      
      const inputs = screen.getAllByPlaceholderText('0,00');
      fireEvent.change(inputs[0], { target: { value: '500000' } });
      fireEvent.change(inputs[1], { target: { value: '40000' } });

      // Quando
      const btnLimpar = screen.getByRole('button', { name: /Limpar/i });
      fireEvent.click(btnLimpar);

      // Então
      await waitFor(() => {
        expect(inputs[0].value).toBe('');
        expect(inputs[1].value).toBe('');
      });
    });
  });

  describe('Dado informações adicionais', () => {
    test('Quando renderizar, Então deve exibir informações sobre Fator R', () => {
      // Dado / Quando
      renderWithRouter(<CalculadoraDAS />);

      // Então
      expect(screen.getAllByText(/Fator R/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/28%/).length).toBeGreaterThanOrEqual(1);
    });

    test('Quando renderizar, Então deve exibir limite do Simples Nacional', () => {
      // Dado / Quando
      renderWithRouter(<CalculadoraDAS />);

      // Então
      expect(screen.getAllByText(/4\.800\.000/).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Dado loading state', () => {
    test('Quando calcular, Então deve mostrar indicador de carregamento', async () => {
      // Dado
      axios.get.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => {
        resolve({ data: { sucesso: true, calculo: { valorDASFormatado: 'R$ 1.000,00' } } });
      }, 100)));

      renderWithRouter(<CalculadoraDAS />);
      
      const inputs = screen.getAllByPlaceholderText('0,00');
      fireEvent.change(inputs[0], { target: { value: '200000' } });
      fireEvent.change(inputs[1], { target: { value: '20000' } });
      
      const selectCNAE = screen.getByRole('combobox');
      fireEvent.change(selectCNAE, { target: { value: '4711-3' } });

      // Quando
      const btnCalcular = screen.getByRole('button', { name: /Calcular DAS/i });
      fireEvent.click(btnCalcular);

      // Então
      expect(screen.getAllByText(/Calculando/i).length).toBeGreaterThanOrEqual(1);
    });
  });
});

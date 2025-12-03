/**
 * Testes de UI - Componente: SimuladorFatorR
 * @vitest-environment jsdom
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SimuladorFatorR from '../pages/SimuladorFatorR';

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

describe('SimuladorFatorR - Testes de UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dado renderização inicial', () => {
    test('Quando renderizar componente, Então deve exibir título e descrição', () => {
      // Dado / Quando
      renderWithRouter(<SimuladorFatorR />);

      // Então
      expect(screen.getByText(/Simulador do Fator R/i)).toBeDefined();
      expect(screen.getByText(/Descubra se sua empresa se enquadra/i)).toBeDefined();
    });

    test('Quando renderizar, Então deve exibir campos de Folha e RBT12', () => {
      // Dado / Quando
      renderWithRouter(<SimuladorFatorR />);

      // Então - Usar getAllByText pois pode haver múltiplos elementos com texto similar
      expect(screen.getAllByText(/Folha de Salários/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Receita Bruta Total/i).length).toBeGreaterThanOrEqual(1);
    });

    test('Quando renderizar, Então deve ter botões Calcular e Limpar', () => {
      // Dado / Quando
      renderWithRouter(<SimuladorFatorR />);

      // Então
      expect(screen.getByRole('button', { name: /Calcular Fator R/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Limpar/i })).toBeDefined();
    });

    test('Quando renderizar, Então deve exibir explicação sobre Fator R', () => {
      // Dado / Quando
      renderWithRouter(<SimuladorFatorR />);

      // Então - Usar getAllByText pois pode haver múltiplos elementos com 28%
      expect(screen.getAllByText(/O que é o Fator R/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/28%/).length).toBeGreaterThanOrEqual(1);
    });

    test('Quando renderizar, Então deve mostrar estado "Aguardando Cálculo"', () => {
      // Dado / Quando
      renderWithRouter(<SimuladorFatorR />);

      // Então - Usar getAllByText pois pode haver múltiplos elementos
      expect(screen.getAllByText(/Aguardando Cálculo/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Dado preenchimento de formulário', () => {
    test('Quando preencher folha, Então campo deve aceitar valor numérico', async () => {
      // Dado
      renderWithRouter(<SimuladorFatorR />);
      const inputs = screen.getAllByPlaceholderText('0,00');
      const inputFolha = inputs[0];

      // Quando
      fireEvent.change(inputFolha, { target: { value: '300000' } });

      // Então
      expect(inputFolha.value).toBe('300000');
    });

    test('Quando preencher RBT12, Então campo deve aceitar valor numérico', async () => {
      // Dado
      renderWithRouter(<SimuladorFatorR />);
      const inputs = screen.getAllByPlaceholderText('0,00');
      const inputRBT12 = inputs[1];

      // Quando
      fireEvent.change(inputRBT12, { target: { value: '1000000' } });

      // Então
      expect(inputRBT12.value).toBe('1000000');
    });
  });

  describe('Dado cálculo com Fator R >= 28%', () => {
    test('Quando fator R for maior ou igual a 28%, Então deve indicar Anexo III', async () => {
      // Dado
      axios.get.mockResolvedValueOnce({
        data: {
          sucesso: true,
          calculo: {
            fatorRDecimal: 0.30,
            fatorRPercentual: '30%'
          },
          anexo: {
            atual: 'ANEXO_III',
            nomeAtual: 'Anexo III',
            descricaoAtual: 'Serviços com folha intensiva',
            enquadraAnexoIII: true,
            aliquotaInicialAnexoIII: '6%'
          },
          analise: {
            situacao: 'Enquadrado (Confortável)',
            nivelRisco: 'otimo',
            recomendacao: 'Sua empresa está bem posicionada no Anexo III',
            corIndicador: '#22c55e'
          },
          acoes: {
            precisaAumentar: false,
            precisaDiminuir: true,
            jaNaFaixaIdeal: true
          },
          economia: {
            estaNoAnexoMaisVantajoso: true,
            economiaAnualEstimadaFormatado: 'R$ 50.000,00'
          },
          cenarios: []
        }
      });

      renderWithRouter(<SimuladorFatorR />);
      
      const inputs = screen.getAllByPlaceholderText('0,00');
      fireEvent.change(inputs[0], { target: { value: '300000' } });
      fireEvent.change(inputs[1], { target: { value: '1000000' } });

      // Quando
      const btnCalcular = screen.getByRole('button', { name: /Calcular Fator R/i });
      fireEvent.click(btnCalcular);

      // Então - Usar getAllByText pois pode haver múltiplos elementos
      await waitFor(() => {
        expect(screen.getAllByText(/Anexo III/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/30%/).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Dado cálculo com Fator R < 28%', () => {
    test('Quando fator R for menor que 28%, Então deve indicar Anexo V', async () => {
      // Dado
      axios.get.mockResolvedValueOnce({
        data: {
          sucesso: true,
          calculo: {
            fatorRDecimal: 0.15,
            fatorRPercentual: '15%'
          },
          anexo: {
            atual: 'ANEXO_V',
            nomeAtual: 'Anexo V',
            descricaoAtual: 'Serviços intelectuais',
            enquadraAnexoIII: false,
            aliquotaInicialAnexoV: '15,5%'
          },
          analise: {
            situacao: 'Muito Abaixo',
            nivelRisco: 'baixo',
            recomendacao: 'Considere aumentar a folha para migrar ao Anexo III',
            corIndicador: '#f97316'
          },
          acoes: {
            precisaAumentar: true,
            precisaDiminuir: false,
            jaNaFaixaIdeal: false,
            folhaIdealPara28: 280000,
            folhaIdealPara28Formatado: 'R$ 280.000,00',
            diferencaFolha: 130000,
            diferencaFolhaFormatado: 'R$ 130.000,00'
          },
          economia: {
            estaNoAnexoMaisVantajoso: false
          },
          cenarios: [
            { percentual: '20%', anexo: 'Anexo V', folhaNecessaria: 'R$ 200.000,00', vantajoso: false },
            { percentual: '28%', anexo: 'Anexo III', folhaNecessaria: 'R$ 280.000,00', vantajoso: true }
          ]
        }
      });

      renderWithRouter(<SimuladorFatorR />);
      
      const inputs = screen.getAllByPlaceholderText('0,00');
      fireEvent.change(inputs[0], { target: { value: '150000' } });
      fireEvent.change(inputs[1], { target: { value: '1000000' } });

      // Quando
      const btnCalcular = screen.getByRole('button', { name: /Calcular Fator R/i });
      fireEvent.click(btnCalcular);

      // Então - Usar getAllByText pois pode haver múltiplos elementos
      await waitFor(() => {
        expect(screen.getAllByText(/Anexo V/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/15%/).length).toBeGreaterThanOrEqual(1);
      });
    });

    test('Quando fator R for < 28%, Então deve mostrar ação necessária', async () => {
      // Dado
      axios.get.mockResolvedValueOnce({
        data: {
          sucesso: true,
          calculo: { fatorRPercentual: '20%' },
          anexo: { enquadraAnexoIII: false, nomeAtual: 'Anexo V' },
          analise: { situacao: 'Abaixo', corIndicador: '#f97316' },
          acoes: {
            precisaAumentar: true,
            jaNaFaixaIdeal: false,
            folhaIdealPara28Formatado: 'R$ 280.000,00',
            diferencaFolhaFormatado: 'R$ 80.000,00'
          },
          economia: {},
          cenarios: []
        }
      });

      renderWithRouter(<SimuladorFatorR />);
      
      const inputs = screen.getAllByPlaceholderText('0,00');
      fireEvent.change(inputs[0], { target: { value: '200000' } });
      fireEvent.change(inputs[1], { target: { value: '1000000' } });

      // Quando
      const btnCalcular = screen.getByRole('button', { name: /Calcular Fator R/i });
      fireEvent.click(btnCalcular);

      // Então
      await waitFor(() => {
        expect(screen.getAllByText(/Para Atingir o Anexo III/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Folha Ideal/i).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Dado erro na API', () => {
    test('Quando ocorrer erro, Então deve exibir mensagem de erro', async () => {
      // Dado
      axios.get.mockRejectedValueOnce({
        response: {
          data: {
            erro: 'RBT12 não pode ser zero'
          }
        }
      });

      renderWithRouter(<SimuladorFatorR />);
      
      const inputs = screen.getAllByPlaceholderText('0,00');
      fireEvent.change(inputs[0], { target: { value: '100000' } });
      fireEvent.change(inputs[1], { target: { value: '0' } });

      // Quando
      const btnCalcular = screen.getByRole('button', { name: /Calcular Fator R/i });
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
      renderWithRouter(<SimuladorFatorR />);
      
      const inputs = screen.getAllByPlaceholderText('0,00');
      fireEvent.change(inputs[0], { target: { value: '200000' } });
      fireEvent.change(inputs[1], { target: { value: '800000' } });

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

  describe('Dado cards explicativos', () => {
    test('Quando renderizar, Então deve exibir cards de Anexo III e V', () => {
      // Dado / Quando
      renderWithRouter(<SimuladorFatorR />);

      // Então
      const anexoIIICards = screen.getAllByText(/Anexo III/i);
      const anexoVCards = screen.getAllByText(/Anexo V/i);
      
      expect(anexoIIICards.length).toBeGreaterThanOrEqual(1);
      expect(anexoVCards.length).toBeGreaterThanOrEqual(1);
    });

    test('Quando renderizar, Então deve mostrar alíquotas iniciais dos anexos', () => {
      // Dado / Quando
      renderWithRouter(<SimuladorFatorR />);

      // Então
      expect(screen.getByText(/6,00%/)).toBeDefined();
      expect(screen.getByText(/15,50%/)).toBeDefined();
    });
  });

  describe('Dado cenários de simulação', () => {
    test('Quando resultado tiver cenários, Então deve exibi-los', async () => {
      // Dado
      axios.get.mockResolvedValueOnce({
        data: {
          sucesso: true,
          calculo: { fatorRPercentual: '25%' },
          anexo: { enquadraAnexoIII: false, nomeAtual: 'Anexo V' },
          analise: { situacao: 'Próximo', corIndicador: '#eab308' },
          acoes: { jaNaFaixaIdeal: false },
          economia: {},
          cenarios: [
            { percentual: '20%', anexo: 'Anexo V', folhaNecessaria: 'R$ 200.000,00', vantajoso: false },
            { percentual: '24%', anexo: 'Anexo V', folhaNecessaria: 'R$ 240.000,00', vantajoso: false },
            { percentual: '28%', anexo: 'Anexo III', folhaNecessaria: 'R$ 280.000,00', vantajoso: true },
            { percentual: '32%', anexo: 'Anexo III', folhaNecessaria: 'R$ 320.000,00', vantajoso: true },
            { percentual: '36%', anexo: 'Anexo III', folhaNecessaria: 'R$ 360.000,00', vantajoso: true }
          ]
        }
      });

      renderWithRouter(<SimuladorFatorR />);
      
      const inputs = screen.getAllByPlaceholderText('0,00');
      fireEvent.change(inputs[0], { target: { value: '250000' } });
      fireEvent.change(inputs[1], { target: { value: '1000000' } });

      // Quando
      const btnCalcular = screen.getByRole('button', { name: /Calcular Fator R/i });
      fireEvent.click(btnCalcular);

      // Então
      await waitFor(() => {
        expect(screen.getByText(/Simulação de Cenários/i)).toBeDefined();
      });
    });
  });
});

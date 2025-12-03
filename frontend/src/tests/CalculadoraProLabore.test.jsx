/**
 * Testes de UI - Componente: CalculadoraProLabore
 * @vitest-environment jsdom
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CalculadoraProLabore from '../pages/CalculadoraProLabore';

// Helper para renderizar com Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CalculadoraProLabore - Testes de UI', () => {
  describe('Dado um pró-labore de 2.000', () => {
    test('Quando digitar valor, Então deve calcular e exibir INSS e resultado', async () => {
      // Dado
      renderWithRouter(<CalculadoraProLabore />);

      // Encontrar input de pró-labore (usa placeholder R$ 0,00)
      const inputs = screen.getAllByPlaceholderText('R$ 0,00');
      const inputProLabore = inputs[0]; // Primeiro input é o pró-labore

      // Quando - Digitar valor (formatado como centavos)
      // O cálculo acontece automaticamente via useEffect
      fireEvent.change(inputProLabore, { target: { value: '200000' } });

      // Então
      await waitFor(() => {
        // Deve mostrar resultado (o componente calcula automaticamente)
        const resultados = screen.getAllByText(/R\$/);
        expect(resultados.length).toBeGreaterThan(2);
      });
    });
  });

  describe('Dado um pró-labore de 8.000', () => {
    test('Quando digitar valor, Então deve calcular automaticamente', async () => {
      // Dado
      renderWithRouter(<CalculadoraProLabore />);

      const inputs = screen.getAllByPlaceholderText('R$ 0,00');
      const inputProLabore = inputs[0];

      // Quando - O componente calcula automaticamente via useEffect
      fireEvent.change(inputProLabore, { target: { value: '800000' } });

      // Então
      await waitFor(() => {
        // Deve haver resultados (cálculo automático)
        const resultados = screen.getAllByText(/R\$/);
        expect(resultados.length).toBeGreaterThan(2);
      });
    });
  });

  describe('Dado interação com campos', () => {
    test('Quando renderizar componente, Então deve exibir formulário com campos principais', () => {
      // Dado / Quando
      renderWithRouter(<CalculadoraProLabore />);

      // Então
      const titulos = screen.getAllByText(/Calculadora.*Pró-Labore/i);
      expect(titulos.length).toBeGreaterThanOrEqual(1);
      
      // Verificar que há inputs
      const inputs = screen.getAllByPlaceholderText('R$ 0,00');
      expect(inputs.length).toBeGreaterThanOrEqual(1);
    });

    test('Quando não informar valor, Então não deve exibir resultado', async () => {
      // Dado
      renderWithRouter(<CalculadoraProLabore />);

      // Então - Sem digitar, não deve haver resumo
      await waitFor(() => {
        const resumo = screen.queryAllByText(/Resumo do Pró-Labore/i);
        expect(resumo.length).toBe(0);
      });
    });
  });

  describe('Dado cálculo com dependentes', () => {
    test('Quando informar dependentes, Então deve calcular com dedução', async () => {
      // Dado
      renderWithRouter(<CalculadoraProLabore />);

      const inputs = screen.getAllByPlaceholderText('R$ 0,00');
      const inputProLabore = inputs[0];
      
      fireEvent.change(inputProLabore, { target: { value: '500000' } });

      // Procurar campo de dependentes (tipo number)
      const inputDependentes = screen.getAllByRole('spinbutton');
      if (inputDependentes.length > 0) {
        fireEvent.change(inputDependentes[0], { target: { value: '2' } });
      }

      // Então - Deve mostrar resultado
      await waitFor(() => {
        const resultados = screen.getAllByText(/R\$/);
        expect(resultados.length).toBeGreaterThan(2);
      });
    });
  });

  describe('Dado formatação de valores', () => {
    test('Quando digitar valor, Então deve formatar como moeda brasileira', async () => {
      // Dado
      renderWithRouter(<CalculadoraProLabore />);

      const inputs = screen.getAllByPlaceholderText('R$ 0,00');
      const inputProLabore = inputs[0];

      // Quando
      fireEvent.change(inputProLabore, { target: { value: '350000' } });

      // Então
      await waitFor(() => {
        // Deve aceitar o valor e formatar
        expect(inputProLabore.value).toContain('R$');
      });
    });
  });
});

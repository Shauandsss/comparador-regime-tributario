/**
 * Testes de UI - Componente: TermometroRisco
 * @vitest-environment jsdom
 */

import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TermometroRisco from '../pages/TermometroRisco';

// Helper para renderizar com Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('TermometroRisco - Testes de UI', () => {
  describe('Dado renderização inicial', () => {
    test('Quando renderizar componente, Então deve exibir título e progresso', () => {
      // Dado / Quando
      renderWithRouter(<TermometroRisco />);

      // Então
      expect(screen.getByText(/Termômetro de Risco Fiscal/i)).toBeDefined();
      expect(screen.getByText(/Progresso da Avaliação/i)).toBeDefined();
      // Usa queryAllByText para evitar erro se houver múltiplos elementos
      const progressos = screen.getAllByText(/0\s*\/\s*15/);
      expect(progressos.length).toBeGreaterThanOrEqual(1);
    });

    test('Quando renderizar componente, Então deve exibir botões Sim e Não', () => {
      // Dado / Quando
      renderWithRouter(<TermometroRisco />);

      // Então - Há múltiplos botões Sim e Não (um par para cada pergunta)
      const botoesNao = screen.getAllByRole('button', { name: /❌ Não/i });
      const botoesSim = screen.getAllByRole('button', { name: /✅ Sim/i });
      
      expect(botoesSim.length).toBeGreaterThanOrEqual(5);
      expect(botoesNao.length).toBeGreaterThanOrEqual(5);
    });

    test('Quando renderizar componente, Então deve exibir categorias de risco', () => {
      // Dado / Quando
      renderWithRouter(<TermometroRisco />);

      // Então - Verifica se existem categorias (usando getAllByText para evitar erro com múltiplos)
      const categorias = screen.getAllByText(/Conformidade|Planejamento|Operacional/i);
      expect(categorias.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Dado interação com perguntas', () => {
    test('Quando clicar em Sim, Então deve atualizar progresso', async () => {
      // Dado
      renderWithRouter(<TermometroRisco />);

      const botoesSim = screen.getAllByRole('button', { name: /✅ Sim/i });
      
      // Quando - Clicar no primeiro "Sim"
      fireEvent.click(botoesSim[0]);

      // Então - Verificar que o texto de progresso mudou (usando getAllByText pois pode haver múltiplos)
      await waitFor(() => {
        const progressos = screen.getAllByText(/1\s*\/\s*15/);
        expect(progressos.length).toBeGreaterThanOrEqual(1);
      });
    });

    test('Quando clicar em Não, Então deve atualizar progresso', async () => {
      // Dado
      renderWithRouter(<TermometroRisco />);

      const botoesNao = screen.getAllByRole('button', { name: /❌ Não/i });
      
      // Quando - Clicar no primeiro "Não"
      fireEvent.click(botoesNao[0]);

      // Então - Verificar que o texto de progresso mudou (usando getAllByText pois pode haver múltiplos)
      await waitFor(() => {
        const progressos = screen.getAllByText(/1\s*\/\s*15/);
        expect(progressos.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Dado navegação', () => {
    test('Quando renderizar componente, Então deve exibir botão voltar', () => {
      // Dado / Quando
      renderWithRouter(<TermometroRisco />);

      // Então
      const btnVoltar = screen.getByRole('button', { name: /← Voltar para Home/i });
      expect(btnVoltar).toBeDefined();
    });
  });

  describe('Dado níveis de risco nas perguntas', () => {
    test('Quando renderizar componente, Então deve exibir indicadores de risco', () => {
      // Dado / Quando
      renderWithRouter(<TermometroRisco />);

      // Então - Verifica se há indicadores de risco Alto, Médio ou Baixo
      const riscosAltos = screen.getAllByText(/Risco/i);
      expect(riscosAltos.length).toBeGreaterThanOrEqual(5);
    });

    test('Quando renderizar componente, Então deve exibir pesos das perguntas', () => {
      // Dado / Quando
      renderWithRouter(<TermometroRisco />);

      // Então
      const pesos = screen.getAllByText(/Peso:/i);
      expect(pesos.length).toBeGreaterThanOrEqual(5);
    });
  });
});

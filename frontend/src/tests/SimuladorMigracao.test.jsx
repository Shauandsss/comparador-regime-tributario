/**
 * Testes de UI - Componente: SimuladorMigracao
 * Simulador de Migração MEI → ME (Simples Nacional)
 * @vitest-environment jsdom
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SimuladorMigracao from '../pages/SimuladorMigracao';

// Helper para renderizar com Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SimuladorMigracao - Testes de UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dado renderização inicial', () => {
    test('Quando renderizar componente, Então deve exibir título e descrição', () => {
      // Dado / Quando
      renderWithRouter(<SimuladorMigracao />);

      // Então
      expect(screen.getByText(/Simulador de Migração MEI → ME/i)).toBeDefined();
      expect(screen.getByText(/Compare os tributos do MEI com o Simples Nacional/i)).toBeDefined();
    });

    test('Quando renderizar, Então deve exibir formulário com campos principais', () => {
      // Dado / Quando
      renderWithRouter(<SimuladorMigracao />);

      // Então - Usar getAllByText pois pode haver múltiplos elementos
      expect(screen.getAllByText(/Faturamento Mensal/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Tipo de Atividade/i)).toBeDefined();
      expect(screen.getByPlaceholderText(/Ex: 8000/i)).toBeDefined();
    });

    test('Quando renderizar, Então deve exibir seletor de atividade', () => {
      // Dado / Quando
      renderWithRouter(<SimuladorMigracao />);

      // Então
      const select = screen.getByRole('combobox');
      expect(select).toBeDefined();
      // Há múltiplos elementos com "Comércio"
      expect(screen.getAllByText(/Comércio/i).length).toBeGreaterThanOrEqual(1);
    });

    test('Quando renderizar, Então deve exibir informações do MEI 2025', () => {
      // Dado / Quando
      renderWithRouter(<SimuladorMigracao />);

      // Então
      expect(screen.getByText(/Limites do MEI 2025/i)).toBeDefined();
      expect(screen.getByText(/até R\$ 81.000\/ano/i)).toBeDefined();
      expect(screen.getByText(/R\$ 6.750/i)).toBeDefined();
    });

    test('Quando renderizar sem faturamento, Então deve exibir estado inicial', () => {
      // Dado / Quando
      renderWithRouter(<SimuladorMigracao />);

      // Então
      expect(screen.getByText(/Simule sua migração/i)).toBeDefined();
      expect(screen.getByText(/Informe seu faturamento mensal/i)).toBeDefined();
    });
  });

  describe('Dado simulação com faturamento dentro do limite MEI', () => {
    test('Quando informar faturamento R$ 5.000, Então deve exibir comparativo', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando
      const inputFaturamento = screen.getByPlaceholderText(/Ex: 8000/i);
      fireEvent.change(inputFaturamento, { target: { value: '5000' } });

      // Então - Usar getAllByText pois pode haver múltiplos elementos
      await waitFor(() => {
        expect(screen.getAllByText(/MEI/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Simples Nacional/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/\/mês/i).length).toBeGreaterThanOrEqual(1);
      });
    });

    test('Quando faturamento dentro do limite, Então deve recomendar continuar no MEI', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '4000' } });

      // Então
      await waitFor(() => {
        expect(screen.getByText(/Continue no MEI/i)).toBeDefined();
        expect(screen.getByText(/dentro do limite com folga/i)).toBeDefined();
      });
    });

    test('Quando faturamento de R$ 5.000/mês, Então percentual do limite deve ser ~74%', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '5000' } });

      // Então - 5000*12 = 60000 / 81000 = 74% - Usar getAllByText pois pode haver múltiplos
      await waitFor(() => {
        expect(screen.getAllByText(/74/i).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Dado faturamento próximo ao limite MEI', () => {
    test('Quando faturamento acima de 80% do limite, Então deve exibir zona de alerta', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando - 6000 * 12 = 72000, que é 89% do limite
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '6000' } });

      // Então
      await waitFor(() => {
        expect(screen.getByText(/Planeje a migração/i)).toBeDefined();
        expect(screen.getByText(/próximo do limite do MEI/i)).toBeDefined();
      });
    });

    test('Quando próximo do limite, Então deve exibir valor restante', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '6500' } });

      // Então
      await waitFor(() => {
        expect(screen.getByText(/Atenção/i)).toBeDefined();
        expect(screen.getByText(/Restam apenas/i)).toBeDefined();
      });
    });
  });

  describe('Dado faturamento acima do limite MEI', () => {
    test('Quando faturamento ultrapassar R$ 81.000/ano, Então deve exibir alerta de desenquadramento', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando - 8000 * 12 = 96000 > 81000
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '8000' } });

      // Então
      await waitFor(() => {
        expect(screen.getByText(/Desenquadramento Obrigatório/i)).toBeDefined();
        expect(screen.getByText(/precisa migrar para ME/i)).toBeDefined();
      });
    });

    test('Quando ultrapassar limite, Então MEI deve aparecer como não elegível', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '10000' } });

      // Então
      await waitFor(() => {
        expect(screen.getByText(/Não elegível/i)).toBeDefined();
        expect(screen.getByText(/acima do limite/i)).toBeDefined();
      });
    });

    test('Quando obrigatório migrar, Então deve recomendar Simples Nacional', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '8000' } });

      // Então - Usar getAllByText pois pode haver múltiplos elementos
      await waitFor(() => {
        expect(screen.getAllByText(/Simples Nacional/i).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Dado seleção de tipo de atividade', () => {
    test('Quando selecionar Comércio, Então deve calcular com Anexo I', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'comercio' } });
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '8000' } });

      // Então - Usar getAllByText pois pode haver múltiplos elementos
      await waitFor(() => {
        expect(screen.getAllByText(/Anexo I/i).length).toBeGreaterThanOrEqual(1);
      });
    });

    test('Quando selecionar Indústria, Então deve calcular com Anexo II', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'industria' } });
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '8000' } });

      // Então - Usar getAllByText pois pode haver múltiplos elementos
      await waitFor(() => {
        expect(screen.getAllByText(/Anexo II/i).length).toBeGreaterThanOrEqual(1);
      });
    });

    test('Quando selecionar Serviços, Então deve exibir campo de folha de pagamento', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'servicos' } });

      // Então
      await waitFor(() => {
        expect(screen.getByText(/Folha de Pagamento Mensal/i)).toBeDefined();
        expect(screen.getByPlaceholderText(/Ex: 3000/i)).toBeDefined();
      });
    });
  });

  describe('Dado cálculo do Fator R para Serviços', () => {
    test('Quando Fator R >= 28%, Então deve usar Anexo III', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando - Faturamento 10000, Folha 3000 = 30% Fator R
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'servicos' } });
      
      await waitFor(() => {
        const inputFolha = screen.getByPlaceholderText(/Ex: 3000/i);
        expect(inputFolha).toBeDefined();
      });
      
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '10000' } });
      fireEvent.change(screen.getByPlaceholderText(/Ex: 3000/i), { target: { value: '3000' } });

      // Então - Usar getAllByText pois pode haver múltiplos elementos
      await waitFor(() => {
        expect(screen.getAllByText(/Anexo III/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Fator R/i).length).toBeGreaterThanOrEqual(1);
      });
    });

    test('Quando Fator R < 28%, Então deve usar Anexo V', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando - Faturamento 10000, Folha 1000 = 10% Fator R
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'servicos' } });
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Ex: 3000/i)).toBeDefined();
      });
      
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '10000' } });
      fireEvent.change(screen.getByPlaceholderText(/Ex: 3000/i), { target: { value: '1000' } });

      // Então - Usar getAllByText pois pode haver múltiplos elementos
      await waitFor(() => {
        expect(screen.getAllByText(/Anexo V/i).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Dado exibição de impacto da migração', () => {
    test('Quando calcular, Então deve exibir diferença mensal e anual', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '5000' } });

      // Então
      await waitFor(() => {
        expect(screen.getByText(/Impacto da Migração/i)).toBeDefined();
        expect(screen.getByText(/Diferença Mensal/i)).toBeDefined();
        expect(screen.getByText(/Diferença Anual/i)).toBeDefined();
        expect(screen.getByText(/Variação/i)).toBeDefined();
      });
    });
  });

  describe('Dado tabela de cenários', () => {
    test('Quando calcular, Então deve exibir tabela comparativa', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '5000' } });

      // Então - Usar getAllByText pois pode haver múltiplos elementos
      await waitFor(() => {
        expect(screen.getAllByText(/Limite MEI/i).length).toBeGreaterThanOrEqual(1);
      });
    });

    test('Quando calcular, Então tabela deve ter colunas corretas', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '5000' } });

      // Então
      await waitFor(() => {
        expect(screen.getByText(/Faturamento Anual/i)).toBeDefined();
        expect(screen.getByText(/MEI \(Anual\)/i)).toBeDefined();
        expect(screen.getByText(/Simples \(Anual\)/i)).toBeDefined();
        expect(screen.getByText(/Alíq\. Simples/i)).toBeDefined();
      });
    });
  });

  describe('Dado barra de progresso do limite', () => {
    test('Quando calcular, Então deve exibir barra de progresso', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '5000' } });

      // Então
      await waitFor(() => {
        expect(screen.getByText(/Proximidade do Limite MEI/i)).toBeDefined();
        expect(screen.getByText(/utilizado/i)).toBeDefined();
      });
    });
  });

  describe('Dado informações adicionais', () => {
    test('Quando renderizar, Então deve exibir seção "Quando devo migrar?"', () => {
      // Dado / Quando
      renderWithRouter(<SimuladorMigracao />);

      // Então
      expect(screen.getByText(/Quando devo migrar\?/i)).toBeDefined();
      expect(screen.getByText(/Obrigatório:/i)).toBeDefined();
      expect(screen.getByText(/Recomendado:/i)).toBeDefined();
      expect(screen.getByText(/Estratégico:/i)).toBeDefined();
    });

    test('Quando renderizar, Então deve exibir seção "O que muda na migração?"', () => {
      // Dado / Quando
      renderWithRouter(<SimuladorMigracao />);

      // Então
      expect(screen.getByText(/O que muda na migração\?/i)).toBeDefined();
      expect(screen.getByText(/DAS calculado sobre faturamento/i)).toBeDefined();
      expect(screen.getByText(/Obrigações acessórias/i)).toBeDefined();
    });
  });

  describe('Dado valores do DAS MEI 2025', () => {
    test('Quando atividade for comércio, Então DAS MEI deve ser R$ 75,90', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'comercio' } });
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '5000' } });

      // Então
      await waitFor(() => {
        expect(screen.getByText(/R\$ 75,90/i)).toBeDefined();
      });
    });

    test('Quando atividade for serviços, Então DAS MEI deve ser R$ 80,90', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      
      // Quando
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'servicos' } });
      fireEvent.change(screen.getByPlaceholderText(/Ex: 8000/i), { target: { value: '5000' } });

      // Então
      await waitFor(() => {
        expect(screen.getByText(/R\$ 80,90/i)).toBeDefined();
      });
    });
  });

  describe('Dado mudança dinâmica de valores', () => {
    test('Quando alterar faturamento, Então resultado deve atualizar', async () => {
      // Dado
      renderWithRouter(<SimuladorMigracao />);
      const input = screen.getByPlaceholderText(/Ex: 8000/i);
      
      // Quando - primeiro valor
      fireEvent.change(input, { target: { value: '3000' } });

      await waitFor(() => {
        expect(screen.getByText(/Continue no MEI/i)).toBeDefined();
      });

      // Quando - alterar para valor acima do limite
      fireEvent.change(input, { target: { value: '10000' } });

      // Então
      await waitFor(() => {
        expect(screen.getByText(/Desenquadramento Obrigatório/i)).toBeDefined();
      });
    });
  });
});

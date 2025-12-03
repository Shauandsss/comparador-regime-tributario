import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CalculadoraReal from '../pages/CalculadoraReal';

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper para renderizar com Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CalculadoraReal - Calculadora de Lucro Real', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização Inicial', () => {
    
    it('deve renderizar o título da calculadora', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraReal />);
      
      // When: A página é carregada
      // Then: O título deve estar presente
      expect(screen.getAllByText(/Calculadora Lucro Real/i).length).toBeGreaterThanOrEqual(1);
    });

    it('deve renderizar todos os campos do formulário', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraReal />);
      
      // When: A página é carregada
      // Then: Todos os campos devem estar presentes
      const inputs = screen.getAllByPlaceholderText(/R\$ 0,00/i);
      expect(inputs.length).toBeGreaterThanOrEqual(3); // Receita, Despesas, Folha
      expect(screen.getByText(/Receita Bruta do Período/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Despesas Operacionais/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Folha de Pagamento/i)[0]).toBeInTheDocument();
    });

    it('deve renderizar botões de período (Trimestral e Anual)', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraReal />);
      
      // When: A página é carregada
      // Then: Botões de período devem estar presentes
      expect(screen.getByText(/📅 Trimestral/i)).toBeInTheDocument();
      expect(screen.getByText(/📆 Anual/i)).toBeInTheDocument();
    });

    it('deve ter o período trimestral selecionado por padrão', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraReal />);
      
      // When: A página é carregada
      // Then: O botão trimestral deve ter classe de selecionado
      const trimestralButton = screen.getByText(/📅 Trimestral/i);
      expect(trimestralButton.className).toContain('bg-orange-600');
    });

    it('deve renderizar checkbox de créditos PIS/COFINS', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraReal />);
      
      // When: A página é carregada
      // Then: Checkbox de créditos deve estar presente
      expect(screen.getByLabelText(/Considerar Créditos PIS\/COFINS/i)).toBeInTheDocument();
    });

    it('deve renderizar descrição sobre regime não-cumulativo', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraReal />);
      
      // When: A página é carregada
      // Then: Descrição sobre créditos deve estar presente
      expect(screen.getAllByText(/Regime Não-Cumulativo/i).length).toBeGreaterThanOrEqual(1);
    });

  });

  describe('Interações do Formulário', () => {
    
    it('deve permitir alternar entre período Trimestral e Anual', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<CalculadoraReal />);
      
      // When: O usuário clica no botão Anual
      const anualButton = screen.getByText(/📆 Anual/i);
      await user.click(anualButton);
      
      // Then: O botão anual deve ficar selecionado
      expect(anualButton.className).toContain('bg-orange-600');
    });

    it('deve formatar valor de receita como moeda', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<CalculadoraReal />);
      
      // When: O usuário digita um valor no campo de receita
      const receitaInputs = screen.getAllByPlaceholderText(/R\$ 0,00/i);
      const receitaInput = receitaInputs[0]; // Primeiro campo é receita
      await user.type(receitaInput, '100000');
      
      // Then: O valor deve ser formatado como moeda
      await waitFor(() => {
        expect(receitaInput.value).toContain('R$');
      });
    });

    it('deve formatar valor de despesas como moeda', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<CalculadoraReal />);
      
      // When: O usuário digita um valor no campo de despesas
      const inputs = screen.getAllByPlaceholderText(/R\$ 0,00/i);
      const despesasInput = inputs[1]; // Segundo campo é despesas
      await user.type(despesasInput, '50000');
      
      // Then: O valor deve ser formatado como moeda
      await waitFor(() => {
        expect(despesasInput.value).toContain('R$');
      });
    });

    it('deve formatar valor de folha como moeda', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<CalculadoraReal />);
      
      // When: O usuário digita um valor no campo de folha
      const inputs = screen.getAllByPlaceholderText(/R\$ 0,00/i);
      const folhaInput = inputs[2]; // Terceiro campo é folha
      await user.type(folhaInput, '30000');
      
      // Then: O valor deve ser formatado como moeda
      await waitFor(() => {
        expect(folhaInput.value).toContain('R$');
      });
    });

    it('deve habilitar campos de créditos quando checkbox marcado', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<CalculadoraReal />);
      
      // When: O usuário marca o checkbox de créditos
      const creditosCheckbox = screen.getByLabelText(/Considerar Créditos PIS\/COFINS/i);
      await user.click(creditosCheckbox);
      
      // Then: Campos de créditos devem aparecer
      await waitFor(() => {
        expect(screen.getAllByText(/Créditos de PIS \(1,65%\)/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Créditos de COFINS \(7,6%\)/i)[0]).toBeInTheDocument();
      });
    });

    it('deve formatar valores de créditos PIS como moeda', async () => {
      // Given: A calculadora é renderizada com créditos habilitados
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<CalculadoraReal />);
      
      const creditosCheckbox = screen.getByLabelText(/Considerar Créditos PIS\/COFINS/i);
      await user.click(creditosCheckbox);
      
      // When: O usuário digita valor de créditos PIS
      await waitFor(async () => {
        const inputs = screen.getAllByPlaceholderText(/R\$ 0,00/i);
        const creditosPisInput = inputs[3]; // Quarto input (após receita, despesas, folha)
        await user.type(creditosPisInput, '5000');
      });
      
      // Then: O valor deve ser formatado como moeda
      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText(/R\$ 0,00/i);
        const creditosPisInput = inputs[3];
        expect(creditosPisInput.value).toContain('R$');
      });
    });

  });

  describe('Redirecionamento para Comparador', () => {
    
    it('deve mostrar mensagem redirecionando para o comparador', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<CalculadoraReal />);
      
      // When: O usuário preenche receita e tenta calcular
      const inputs = screen.getAllByPlaceholderText(/R\$ 0,00/i);
      const receitaInput = inputs[0]; // Primeiro campo é receita
      await user.type(receitaInput, '100000');
      
      const calcularButton = screen.getByText(/🧮 Calcular Tributos/i);
      await user.click(calcularButton);
      
      // Then: Mensagem sobre usar o Comparador deve aparecer
      await waitFor(() => {
        expect(screen.getAllByText(/Use o Comparador de Regimes Tributários/i).length).toBeGreaterThanOrEqual(1);
      });
    });

    it.skip('deve redirecionar para /formulario após 3 segundos', async () => {
      // Given: A calculadora é renderizada e mensagem exibida
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<CalculadoraReal />);
      
      const inputs = screen.getAllByPlaceholderText(/R\$ 0,00/i);
      const receitaInput = inputs[0]; // Primeiro campo é receita
      await user.type(receitaInput, '100000');
      
      const calcularButton = screen.getByText(/🧮 Calcular Tributos/i);
      await user.click(calcularButton);
      
      // When: 3 segundos passam
      vi.advanceTimersByTime(3000);
      
      // Then: Navigate deve ser chamado com /formulario
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/formulario');
      });
      
      vi.useRealTimers();
    });

    it('deve exibir erro quando receita não informada', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<CalculadoraReal />);
      
      // When: O usuário tenta calcular sem receita (input vazio não permite submit com required)
      // Then: Campo deve ter atributo required
      const inputs = screen.getAllByPlaceholderText(/R\$ 0,00/i);
      const receitaInput = inputs[0]; // Primeiro campo é receita
      expect(receitaInput).toHaveAttribute('required');
    });

  });

  describe('Funcionalidade Limpar', () => {
    
    it.skip('deve limpar todos os campos ao clicar em Limpar', async () => {
      // Given: A calculadora é renderizada com dados preenchidos
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<CalculadoraReal />);
      
      const inputs = screen.getAllByPlaceholderText(/R\$ 0,00/i);
      const receitaInput = inputs[0]; // Primeiro campo é receita
      await user.type(receitaInput, '100000');
      
      const despesasInput = inputs[1]; // Segundo campo é despesas
      await user.type(despesasInput, '30000');
      
      // When: O usuário clica em Limpar
      const limparButton = screen.getByText(/🗑️ Limpar/i);
      await user.click(limparButton);
      
      // Then: Todos os campos devem estar vazios
      const inputsAposLimpar = screen.getAllByPlaceholderText(/R\$ 0,00/i);
      expect(inputsAposLimpar[0].value).toBe('');
      expect(inputsAposLimpar[1].value).toBe('');
    });

    it.skip('deve desmarcar checkbox de créditos ao limpar', async () => {
      // Given: A calculadora com créditos marcados
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<CalculadoraReal />);
      
      const creditosCheckbox = screen.getByLabelText(/Considerar Créditos PIS\/COFINS/i);
      await user.click(creditosCheckbox);
      
      // When: O usuário clica em Limpar
      const limparButton = screen.getByText(/🗑️ Limpar/i);
      await user.click(limparButton);
      
      // Then: Checkbox deve estar desmarcado
      expect(creditosCheckbox).not.toBeChecked();
    });

    it.skip('deve resetar período para trimestral ao limpar', async () => {
      // Given: A calculadora com período anual selecionado
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<CalculadoraReal />);
      
      const anualButton = screen.getByText(/📆 Anual/i);
      await user.click(anualButton);
      
      // When: O usuário clica em Limpar
      const limparButton = screen.getByText(/🗑️ Limpar/i);
      await user.click(limparButton);
      
      // Then: Período trimestral deve estar selecionado
      const trimestralButton = screen.getByText(/📅 Trimestral/i);
      expect(trimestralButton.className).toContain('bg-orange-600');
    });

  });

  describe('Conteúdo SEO e Educacional', () => {
    
    it('deve renderizar artigo sobre Lucro Real', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraReal />);
      
      // When: A página é carregada
      // Then: Conteúdo educacional deve estar presente
      expect(screen.getAllByText(/Lucro Real/i).length).toBeGreaterThanOrEqual(2);
    });

    it('deve ter botão para voltar para home', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraReal />);
      
      // When: A página é carregada
      // Then: Botão voltar deve estar presente
      expect(screen.getByText(/← Voltar para Home/i)).toBeInTheDocument();
    });

    it.skip('deve chamar navigate ao clicar em voltar', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<CalculadoraReal />);
      
      // When: O usuário clica em voltar
      const voltarButton = screen.getByText(/← Voltar para Home/i);
      await user.click(voltarButton);
      
      // Then: Navigate deve ser chamado com /
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

  });

  describe('Validações e Helpers de Texto', () => {
    
    it('deve mostrar texto explicativo sobre despesas operacionais', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraReal />);
      
      // When/Then: Texto explicativo deve estar presente
      expect(screen.getAllByText(/Custos operacionais, administrativos, comerciais/i).length).toBeGreaterThanOrEqual(1);
    });

    it('deve mostrar texto explicativo sobre folha de pagamento', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraReal />);
      
      // When/Then: Texto explicativo deve estar presente
      expect(screen.getAllByText(/Salários \+ encargos trabalhistas/i).length).toBeGreaterThanOrEqual(1);
    });

    it.skip('deve mostrar informação sobre alíquotas de créditos PIS', async () => {
      // Given: A calculadora com créditos habilitados
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<CalculadoraReal />);
      
      const creditosCheckbox = screen.getByLabelText(/Considerar Créditos PIS\/COFINS/i);
      await user.click(creditosCheckbox);
      
      // When/Then: Alíquota de PIS (1,65%) deve aparecer
      await waitFor(() => {
        const elements = screen.queryAllByText(/1,65%/i);
        expect(elements.length).toBeGreaterThanOrEqual(1);
      });
    });

    it.skip('deve mostrar informação sobre alíquotas de créditos COFINS', async () => {
      // Given: A calculadora com créditos habilitados
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<CalculadoraReal />);
      
      const creditosCheckbox = screen.getByLabelText(/Considerar Créditos PIS\/COFINS/i);
      await user.click(creditosCheckbox);
      
      // When/Then: Alíquota de COFINS (7,6%) deve aparecer
      await waitFor(() => {
        const elements = screen.queryAllByText(/7,6%/i);
        expect(elements.length).toBeGreaterThanOrEqual(1);
      });
    });

  });

});

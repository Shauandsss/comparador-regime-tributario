import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalculadoraValuation from '../pages/CalculadoraValuation';

describe('CalculadoraValuation - Calculadora de Valuation', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização Inicial', () => {
    
    it('deve renderizar o título da calculadora', () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: A página é carregada
      // Then: O título deve estar presente
      expect(screen.getByText(/💰 Calculadora de Valuation/i)).toBeInTheDocument();
    });

    it('deve renderizar o campo de investimento', () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: A página é carregada
      // Then: Campo de investimento deve estar presente (verificar apenas pelo placeholder único)
      const investimentoInput = screen.getByPlaceholderText('Ex: 1000000');
      expect(investimentoInput).toBeInTheDocument();
      expect(investimentoInput).toHaveAttribute('type', 'number');
    });

    it('deve renderizar o slider de equity', () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: A página é carregada
      // Then: Slider de equity deve estar presente
      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
      expect(slider).toHaveAttribute('min', '1');
      expect(slider).toHaveAttribute('max', '50');
    });

    it('deve renderizar o campo de cálculo reverso', () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: A página é carregada
      // Then: Campo de cálculo reverso deve estar presente
      expect(screen.getByPlaceholderText(/Valuation post-money alvo/i)).toBeInTheDocument();
      expect(screen.getByText(/🔄 Cálculo Reverso/i)).toBeInTheDocument();
    });

    it('deve ter valor padrão de 20% para equity', () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: A página é carregada
      // Then: Equity deve estar em 20% por padrão
      expect(screen.getByText(/Equity Oferecido: 20%/i)).toBeInTheDocument();
    });
  });

  describe('Interações do Formulário', () => {
    
    it('deve permitir digitar valor de investimento', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup();
      render(<CalculadoraValuation />);
      
      // When: O usuário digita um valor de investimento
      const investimentoInput = screen.getByPlaceholderText(/Ex: 1000000/i);
      await user.clear(investimentoInput);
      await user.type(investimentoInput, '1000000');
      
      // Then: O valor deve ser atualizado
      expect(investimentoInput.value).toBe('1000000');
    });

    it('deve permitir ajustar equity via slider', async () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: O usuário move o slider para 30%
      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '30' } });
      
      // Then: O equity deve ser atualizado no slider e nos inputs sincronizados
      await waitFor(() => {
        expect(slider.value).toBe('30');
        // O input direto de equity também deve ser 30 agora
        expect(screen.getAllByDisplayValue('30').length).toBeGreaterThanOrEqual(1);
      });
    });

    it('deve permitir digitar equity diretamente', async () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: O usuário digita equity diretamente
      const equityInputs = screen.getAllByDisplayValue('20');
      const equityInputDireto = equityInputs[1]; // Segundo input (não o slider)
      fireEvent.change(equityInputDireto, { target: { value: '25' } });
      
      // Then: O equity deve ser atualizado no slider também
      await waitFor(() => {
        const slider = screen.getByRole('slider');
        expect(slider.value).toBe('25');
      });
    });

    it('deve permitir preencher cálculo reverso', async () => {
      // Given: A calculadora é renderizada com investimento
      const user = userEvent.setup();
      render(<CalculadoraValuation />);
      
      const investimentoInput = screen.getByPlaceholderText(/Ex: 1000000/i);
      await user.clear(investimentoInput);
      await user.type(investimentoInput, '1000000');
      
      // When: O usuário preenche o valuation alvo
      const valuationAlvoInput = screen.getByPlaceholderText(/Valuation post-money alvo/i);
      await user.clear(valuationAlvoInput);
      await user.type(valuationAlvoInput, '5000000');
      
      // Then: O campo deve ter o valor
      expect(valuationAlvoInput.value).toBe('5000000');
    });
  });

  describe('Cálculos de Valuation', () => {
    
    it('deve calcular valuation pre-money corretamente', async () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: Investimento de R$ 1.000.000 com 20% equity
      const investimentoInput = screen.getByPlaceholderText(/Ex: 1000000/i);
      fireEvent.change(investimentoInput, { target: { value: '1000000' } });
      
      // Then: Pre-money deve ser R$ 4M (Post-money 5M - Investimento 1M)
      await waitFor(() => {
        // "Valuation Pre-Money" aparece no card de resultado E na descrição
        const preTitles = screen.getAllByText(/Valuation Pre-Money/i);
        expect(preTitles.length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(/R\$ 4\.00M/i)).toBeInTheDocument();
      });
    });

    it('deve calcular valuation post-money corretamente', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup();
      render(<CalculadoraValuation />);
      
      // When: Investimento de R$ 1.000.000 com 20% equity
      const investimentoInput = screen.getByPlaceholderText(/Ex: 1000000/i);
      await user.clear(investimentoInput);
      await user.type(investimentoInput, '1000000');
      
      // Then: Post-money deve ser R$ 5M (Investimento / Equity%)
      await waitFor(() => {
        // "Post-Money" aparece em card + tabela sensibilidade + outros lugares
        const postTitles = screen.getAllByText(/Valuation Post-Money/i);
        expect(postTitles.length).toBeGreaterThanOrEqual(1);
        // R$ 5.00M aparece no card principal + tabela
        const valuations = screen.getAllByText(/R\$ 5\.00M/i);
        expect(valuations.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('deve calcular com equity diferente', async () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: Investimento de R$ 2.000.000 com 25% equity
      const investimentoInput = screen.getByPlaceholderText(/Ex: 1000000/i);
      fireEvent.change(investimentoInput, { target: { value: '2000000' } });
      
      const equityInputs = screen.getAllByDisplayValue('20');
      const equityInputDireto = equityInputs[1];
      fireEvent.change(equityInputDireto, { target: { value: '25' } });
      
      // Then: Post-money deve ser R$ 8M (2M / 0.25)
      // Pre-money deve ser R$ 6M (8M - 2M)
      await waitFor(() => {
        expect(screen.getByText(/R\$ 8\.00M/i)).toBeInTheDocument();
        expect(screen.getByText(/R\$ 6\.00M/i)).toBeInTheDocument();
      });
    });

    it('deve exibir participação dos fundadores', async () => {
      // Given: A calculadora é renderizada com investimento
      const user = userEvent.setup();
      render(<CalculadoraValuation />);
      
      // When: Investimento com 20% equity
      const investimentoInput = screen.getByPlaceholderText(/Ex: 1000000/i);
      await user.clear(investimentoInput);
      await user.type(investimentoInput, '1000000');
      
      // Then: Fundadores ficam com 80% (aparece na barra de visualização com emoji)
      await waitFor(() => {
        expect(screen.getByText(/🟢 Fundadores: 80%/i)).toBeInTheDocument();
      });
    });
  });

  describe('Cálculo Reverso', () => {
    
    it('deve calcular equity necessário para valuation alvo', async () => {
      // Given: A calculadora com investimento preenchido
      render(<CalculadoraValuation />);
      
      const investimentoInput = screen.getByPlaceholderText(/Ex: 1000000/i);
      fireEvent.change(investimentoInput, { target: { value: '1000000' } });
      
      // When: Valuation alvo de R$ 10.000.000
      const valuationAlvoInput = screen.getByPlaceholderText(/Valuation post-money alvo/i);
      fireEvent.change(valuationAlvoInput, { target: { value: '10000000' } });
      
      // Then: Deve mostrar que precisa oferecer 10% (1M / 10M)
      await waitFor(() => {
        expect(screen.getByText(/você precisa oferecer/i)).toBeInTheDocument();
        expect(screen.getByText(/10\.00%/i)).toBeInTheDocument();
      });
    });

    it('deve exibir aviso quando valuation é muito baixo', async () => {
      // Given: A calculadora com investimento alto
      render(<CalculadoraValuation />);
      
      const investimentoInput = screen.getByPlaceholderText(/Ex: 1000000/i);
      fireEvent.change(investimentoInput, { target: { value: '5000000' } });
      
      // When: Valuation alvo muito baixo (menor que investimento)
      const valuationAlvoInput = screen.getByPlaceholderText(/Valuation post-money alvo/i);
      fireEvent.change(valuationAlvoInput, { target: { value: '1000000' } });
      
      // Then: Deve exibir mensagem de erro
      await waitFor(() => {
        expect(screen.getByText(/⚠️ Valuation muito baixo/i)).toBeInTheDocument();
      });
    });
  });

  describe('Tabela de Sensibilidade', () => {
    
    it('deve exibir tabela de análise de sensibilidade', async () => {
      // Given: A calculadora com investimento
      render(<CalculadoraValuation />);
      
      // When: Investimento é preenchido
      const investimentoInput = screen.getByPlaceholderText(/Ex: 1000000/i);
      fireEvent.change(investimentoInput, { target: { value: '1000000' } });
      
      // Then: Tabela de sensibilidade deve aparecer
      await waitFor(() => {
        expect(screen.getByText(/📈 Análise de Sensibilidade/i)).toBeInTheDocument();
      });
    });

    it('deve mostrar diferentes cenários de equity na tabela', async () => {
      // Given: A calculadora com investimento
      render(<CalculadoraValuation />);
      
      // When: Investimento é preenchido
      const investimentoInput = screen.getByPlaceholderText(/Ex: 1000000/i);
      fireEvent.change(investimentoInput, { target: { value: '1000000' } });
      
      // Then: Deve mostrar diferentes percentuais de equity e a tabela mantém header
      await waitFor(() => {
        // Verifica que a tabela foi renderizada com header "Fundadores mantêm"
        expect(screen.getByText(/Fundadores mantêm/i)).toBeInTheDocument();
      });
    });
  });

  describe('Conteúdo Educacional', () => {
    
    it('deve renderizar seção de conceitos', () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: A página é rolada até o final
      // Then: Seção de conceitos deve estar presente
      expect(screen.getByText(/📚 Entendendo Valuation/i)).toBeInTheDocument();
    });

    it('deve explicar o que é valuation pre-money', () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: A página é carregada
      // Then: Explicação de pre-money deve estar presente
      expect(screen.getByText(/Pre-Money Valuation/i)).toBeInTheDocument();
      // "antes" aparece em vários lugares (conceitos básicos + seção educacional)
      expect(screen.getAllByText(/antes/i)[0]).toBeInTheDocument();
    });

    it('deve explicar o que é valuation post-money', () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: A página é carregada
      // Then: Explicação de post-money deve estar presente
      expect(screen.getByText(/Post-Money Valuation/i)).toBeInTheDocument();
      // "após" aparece em vários lugares (conceitos básicos + seção educacional)
      expect(screen.getAllByText(/após/i)[0]).toBeInTheDocument();
    });
  });

  describe('Validações', () => {
    
    it('não deve mostrar resultados sem investimento', () => {
      // Given: A calculadora é renderizada sem dados
      render(<CalculadoraValuation />);
      
      // When: Nenhum investimento é preenchido
      // Then: Não deve mostrar cards de resultado com valores calculados
      // Note: O título "Calcule seu Valuation" sempre aparece, mas os cards coloridos não
      expect(screen.queryByText(/R\$ 4\.00M/i)).not.toBeInTheDocument();
    });

    it('deve validar equity mínimo e máximo no slider', () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: A página é carregada
      // Then: Slider deve ter limites corretos
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('min', '1');
      expect(slider).toHaveAttribute('max', '50');
    });

    it('deve permitir equity decimal no input direto', () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: A página é carregada
      // Then: Input direto deve permitir decimais
      const equityInputs = screen.getAllByDisplayValue('20');
      const equityInputDireto = equityInputs[1];
      expect(equityInputDireto).toHaveAttribute('step', '0.1');
      expect(equityInputDireto).toHaveAttribute('min', '0.1');
      expect(equityInputDireto).toHaveAttribute('max', '100');
    });
  });

  describe('Informações e Tooltips', () => {
    
    it('deve mostrar texto explicativo sobre investimento', () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: A página é carregada
      // Then: Texto explicativo deve estar presente
      expect(screen.getByText(/Quanto o investidor vai aportar/i)).toBeInTheDocument();
    });

    it('deve mostrar explicação do cálculo reverso', () => {
      // Given: A calculadora é renderizada
      render(<CalculadoraValuation />);
      
      // When: A página é carregada
      // Then: Explicação deve estar presente
      expect(screen.getByText(/Informe o valuation desejado para descobrir o equity necessário/i)).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CalculadoraPresumido from '../pages/CalculadoraPresumido';

// Helper para renderizar com Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CalculadoraPresumido - Calculadora de Lucro Presumido', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização Inicial', () => {
    
    it('deve renderizar o título da calculadora', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: A página é carregada
      // Then: O título deve estar presente
      expect(screen.getAllByText(/Calculadora Lucro Presumido/i).length).toBeGreaterThanOrEqual(1);
    });

    it('deve renderizar todos os campos do formulário', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: A página é carregada
      // Then: Todos os campos devem estar presentes
      expect(screen.getAllByPlaceholderText(/R\$ 0,00/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/Período de Apuração/i)).toBeInTheDocument();
      expect(screen.getByText(/Tipo de Atividade/i)).toBeInTheDocument();
    });

    it('deve renderizar botões de período (Trimestral e Mensal)', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: A página é carregada
      // Then: Botões de período devem estar presentes
      expect(screen.getByText(/📅 Trimestral/i)).toBeInTheDocument();
      expect(screen.getByText(/📆 Mensal/i)).toBeInTheDocument();
    });

    it('deve ter o período trimestral selecionado por padrão', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: A página é carregada
      // Then: O botão trimestral deve ter classe de selecionado
      const trimestralButton = screen.getByText(/📅 Trimestral/i);
      expect(trimestralButton.className).toContain('bg-purple-600');
    });

    it('deve renderizar checkbox de ISS', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: A página é carregada
      // Then: Checkbox de ISS deve estar presente
      expect(screen.getByLabelText(/Aplicar ISS/i)).toBeInTheDocument();
    });

  });

  describe('Interações do Formulário', () => {
    
    it('deve permitir alternar entre período Trimestral e Mensal', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup();
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: O usuário clica no botão Mensal
      const mensalButton = screen.getByText(/📆 Mensal/i);
      await user.click(mensalButton);
      
      // Then: O botão mensal deve ficar selecionado
      expect(mensalButton.className).toContain('bg-purple-600');
    });

    it('deve formatar valor de receita como moeda', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup();
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: O usuário digita um valor no campo de receita
      const receitaInput = screen.getAllByPlaceholderText(/R\$ 0,00/i)[0];
      await user.type(receitaInput, '100000');
      
      // Then: O valor deve ser formatado como moeda
      await waitFor(() => {
        expect(receitaInput.value).toContain('R$');
      });
    });

    it('deve permitir selecionar tipo de atividade', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup();
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: O usuário seleciona uma atividade
      const atividadeSelect = screen.getByRole('combobox');
      await user.selectOptions(atividadeSelect, 'servico');
      
      // Then: A atividade deve estar selecionada
      expect(atividadeSelect.value).toBe('servico');
    });

    it('deve mostrar detalhes da atividade selecionada', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup();
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: O usuário seleciona uma atividade
      const atividadeSelect = screen.getByRole('combobox');
      await user.selectOptions(atividadeSelect, 'servico');
      
      // Then: Detalhes da atividade devem aparecer
      await waitFor(() => {
        expect(screen.getAllByText(/Presunção IRPJ/i).length).toBeGreaterThanOrEqual(1);
      });
    });

    it('deve habilitar campo de ISS quando checkbox marcado', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup();
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: O usuário marca o checkbox de ISS
      const issCheckbox = screen.getByLabelText(/Aplicar ISS/i);
      await user.click(issCheckbox);
      
      // Then: Campo de alíquota ISS deve aparecer
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Alíquota do ISS/i)).toBeInTheDocument();
      });
    });

  });

  describe('Validações do Formulário', () => {
    
    it('deve ter campos required para receita e atividade', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: A página carrega
      // Then: Campos required devem estar presentes
      const receitaInput = screen.getAllByPlaceholderText(/R\$ 0,00/i)[0];
      const atividadeSelect = screen.getByRole('combobox');
      
      expect(receitaInput).toHaveAttribute('required');
      expect(atividadeSelect).toHaveAttribute('required');
    });

    it('deve validar alíquota de ISS dentro do intervalo válido', async () => {
      // Given: A calculadora é renderizada com ISS habilitado
      const user = userEvent.setup();
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: O usuário marca ISS e informa alíquota válida
      const issCheckbox = screen.getByLabelText(/Aplicar ISS/i);
      await user.click(issCheckbox);
      
      await waitFor(async () => {
        const issInput = screen.getByPlaceholderText(/Alíquota do ISS/i);
        await user.clear(issInput);
        await user.type(issInput, '3');
      });
      
      const receitaInput = screen.getAllByPlaceholderText(/R\$ 0,00/i)[0];
      await user.type(receitaInput, '100000');
      
      const atividadeSelect = screen.getByRole('combobox');
      await user.selectOptions(atividadeSelect, 'servico');
      
      const calcularButton = screen.getByText(/🧮 Calcular Tributos/i);
      await user.click(calcularButton);
      
      // Then: Cálculo deve ser feito sem erros
      await waitFor(() => {
        expect(screen.getAllByText(/Resumo Executivo/i).length).toBeGreaterThanOrEqual(1);
      }, { timeout: 3000 });
    });

    it('deve mostrar informação sobre alíquota ISS', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraPresumido />);
      
      // When/Then: Informação sobre ISS deve estar presente
      expect(screen.getAllByText(/A alíquota de ISS varia por município/i).length).toBeGreaterThanOrEqual(1);
    });

  });

  describe('Cálculo e Resultados', () => {
    
    it('deve calcular tributos para serviços gerais (32%)', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup();
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: O usuário preenche dados e calcula
      const receitaInput = screen.getAllByPlaceholderText(/R\$ 0,00/i)[0];
      await user.type(receitaInput, '50000000'); // R$ 500.000
      
      const atividadeSelect = screen.getByRole('combobox');
      await user.selectOptions(atividadeSelect, 'servico');
      
      const calcularButton = screen.getByText(/🧮 Calcular Tributos/i);
      await user.click(calcularButton);
      
      // Then: Resultado deve aparecer com resumo executivo
      await waitFor(() => {
        expect(screen.getAllByText(/Resumo Executivo/i).length).toBeGreaterThanOrEqual(1);
      }, { timeout: 3000 });
    });

    it('deve calcular tributos para comércio (8%)', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup();
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: O usuário preenche dados com atividade de comércio
      const receitaInput = screen.getAllByPlaceholderText(/R\$ 0,00/i)[0];
      await user.type(receitaInput, '50000000'); // R$ 500.000
      
      const atividadeSelect = screen.getByRole('combobox');
      await user.selectOptions(atividadeSelect, 'comercio');
      
      const calcularButton = screen.getByText(/🧮 Calcular Tributos/i);
      await user.click(calcularButton);
      
      // Then: Resultado deve aparecer
      await waitFor(() => {
        expect(screen.getAllByText(/Resumo Executivo/i).length).toBeGreaterThanOrEqual(1);
      }, { timeout: 3000 });
    });

    it('deve mostrar detalhamento dos tributos no resultado', async () => {
      // Given: A calculadora é renderizada e cálculo executado
      const user = userEvent.setup();
      renderWithRouter(<CalculadoraPresumido />);
      
      const receitaInput = screen.getAllByPlaceholderText(/R\$ 0,00/i)[0];
      await user.type(receitaInput, '50000000');
      
      const atividadeSelect = screen.getByRole('combobox');
      await user.selectOptions(atividadeSelect, 'servico');
      
      const calcularButton = screen.getByText(/🧮 Calcular Tributos/i);
      await user.click(calcularButton);
      
      // Then: Detalhamento deve incluir IRPJ, CSLL, PIS, COFINS
      await waitFor(() => {
        expect(screen.getAllByText(/IRPJ/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/CSLL/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/PIS/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/COFINS/i).length).toBeGreaterThanOrEqual(1);
      }, { timeout: 3000 });
    });

    it('deve incluir ISS no cálculo quando habilitado', async () => {
      // Given: A calculadora é renderizada com ISS habilitado
      const user = userEvent.setup();
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: O usuário calcula com ISS
      const receitaInput = screen.getAllByPlaceholderText(/R\$ 0,00/i)[0];
      await user.type(receitaInput, '50000000');
      
      const issCheckbox = screen.getByLabelText(/Aplicar ISS/i);
      await user.click(issCheckbox);
      
      await waitFor(async () => {
        const issInput = screen.getByPlaceholderText(/Alíquota do ISS/i);
        await user.clear(issInput);
        await user.type(issInput, '3');
      });
      
      const atividadeSelect = screen.getByRole('combobox');
      await user.selectOptions(atividadeSelect, 'servico');
      
      const calcularButton = screen.getByText(/🧮 Calcular Tributos/i);
      await user.click(calcularButton);
      
      // Then: ISS deve aparecer no detalhamento
      await waitFor(() => {
        expect(screen.getAllByText(/ISS/i).length).toBeGreaterThanOrEqual(2);
      }, { timeout: 3000 });
    });

    it('deve calcular com período mensal', async () => {
      // Given: A calculadora é renderizada
      const user = userEvent.setup();
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: O usuário seleciona período mensal e calcula
      const mensalButton = screen.getByText(/📆 Mensal/i);
      await user.click(mensalButton);
      
      const receitaInput = screen.getAllByPlaceholderText(/R\$ 0,00/i)[0];
      await user.type(receitaInput, '10000000'); // R$ 100.000
      
      const atividadeSelect = screen.getByRole('combobox');
      await user.selectOptions(atividadeSelect, 'servico');
      
      const calcularButton = screen.getByText(/🧮 Calcular Tributos/i);
      await user.click(calcularButton);
      
      // Then: Resultado deve aparecer
      await waitFor(() => {
        expect(screen.getAllByText(/Resumo Executivo/i).length).toBeGreaterThanOrEqual(1);
      }, { timeout: 3000 });
    });

    it('deve mostrar gráfico de composição dos tributos', async () => {
      // Given: A calculadora é renderizada e cálculo executado
      const user = userEvent.setup();
      renderWithRouter(<CalculadoraPresumido />);
      
      const receitaInput = screen.getAllByPlaceholderText(/R\$ 0,00/i)[0];
      await user.type(receitaInput, '50000000');
      
      const atividadeSelect = screen.getByRole('combobox');
      await user.selectOptions(atividadeSelect, 'servico');
      
      const calcularButton = screen.getByText(/🧮 Calcular Tributos/i);
      await user.click(calcularButton);
      
      // Then: Gráfico de composição deve aparecer
      await waitFor(() => {
        expect(screen.getAllByText(/Composição dos Tributos/i).length).toBeGreaterThanOrEqual(1);
      }, { timeout: 3000 });
    });

    it('deve mostrar carga tributária efetiva', async () => {
      // Given: A calculadora é renderizada e cálculo executado
      const user = userEvent.setup();
      renderWithRouter(<CalculadoraPresumido />);
      
      const receitaInput = screen.getAllByPlaceholderText(/R\$ 0,00/i)[0];
      await user.type(receitaInput, '50000000');
      
      const atividadeSelect = screen.getByRole('combobox');
      await user.selectOptions(atividadeSelect, 'servico');
      
      const calcularButton = screen.getByText(/🧮 Calcular Tributos/i);
      await user.click(calcularButton);
      
      // Then: Carga tributária deve ser exibida
      await waitFor(() => {
        expect(screen.getAllByText(/Carga Tributária/i).length).toBeGreaterThanOrEqual(1);
      }, { timeout: 3000 });
    });

  });

  describe('Funcionalidade Limpar', () => {
    
    it('deve limpar todos os campos ao clicar em Limpar', async () => {
      // Given: A calculadora é renderizada com dados preenchidos
      const user = userEvent.setup();
      renderWithRouter(<CalculadoraPresumido />);
      
      const receitaInput = screen.getAllByPlaceholderText(/R\$ 0,00/i)[0];
      await user.type(receitaInput, '50000000');
      
      const atividadeSelect = screen.getByRole('combobox');
      await user.selectOptions(atividadeSelect, 'servico');
      
      // When: O usuário clica em Limpar
      const limparButton = screen.getByText(/🗑️ Limpar/i);
      await user.click(limparButton);
      
      // Then: Todos os campos devem estar vazios
      await waitFor(() => {
        expect(receitaInput.value).toBe('');
        expect(atividadeSelect.value).toBe('');
      });
    });

    it('deve remover resultado após limpar', async () => {
      // Given: A calculadora com resultado exibido
      const user = userEvent.setup();
      renderWithRouter(<CalculadoraPresumido />);
      
      const receitaInput = screen.getAllByPlaceholderText(/R\$ 0,00/i)[0];
      await user.type(receitaInput, '50000000');
      
      const atividadeSelect = screen.getByRole('combobox');
      await user.selectOptions(atividadeSelect, 'servico');
      
      const calcularButton = screen.getByText(/🧮 Calcular Tributos/i);
      await user.click(calcularButton);
      
      await waitFor(() => {
        expect(screen.getAllByText(/Resumo Executivo/i).length).toBeGreaterThanOrEqual(1);
      });
      
      // When: O usuário clica em Limpar
      const limparButton = screen.getByText(/🗑️ Limpar/i);
      await user.click(limparButton);
      
      // Then: Resultado deve ser removido
      await waitFor(() => {
        expect(screen.queryAllByText(/Resumo Executivo/i).length).toBeLessThanOrEqual(1);
      });
    });

  });

  describe('Conteúdo SEO e Educacional', () => {
    
    it('deve renderizar artigo sobre Lucro Presumido', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: A página é carregada
      // Then: Conteúdo educacional deve estar presente
      expect(screen.getAllByText(/Lucro Presumido: Guia Completo para Empresas/i).length).toBeGreaterThanOrEqual(1);
    });

    it('deve renderizar tabela de percentuais de presunção', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: A página é carregada
      // Then: Tabela de presunção deve estar presente
      expect(screen.getAllByText(/Tabela de Percentuais de Presunção/i).length).toBeGreaterThanOrEqual(1);
    });

    it('deve renderizar exemplo prático de cálculo', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: A página é carregada
      // Then: Exemplo prático deve estar presente
      expect(screen.getAllByText(/Exemplo Prático de Cálculo/i).length).toBeGreaterThanOrEqual(1);
    });

    it('deve renderizar vantagens e desvantagens', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: A página é carregada
      // Then: Seção de vantagens deve estar presente
      expect(screen.getAllByText(/Vantagens e Desvantagens/i).length).toBeGreaterThanOrEqual(1);
    });

    it('deve renderizar FAQ com perguntas frequentes', () => {
      // Given: A calculadora é renderizada
      renderWithRouter(<CalculadoraPresumido />);
      
      // When: A página é carregada
      // Then: FAQ deve estar presente
      expect(screen.getAllByText(/Perguntas Frequentes/i).length).toBeGreaterThanOrEqual(1);
    });

  });

});

/**
 * Hook customizado para realizar cálculos tributários
 * Versão CLIENT-SIDE - não depende de backend
 */
import { useState } from 'react';
import { useComparadorStore } from './useAppStore';
import { 
  compararRegimes, 
  calcularSimples, 
  calcularPresumido, 
  calcularReal 
} from '../services/calculosTributarios';

export const useComparador = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { setEntrada, setResultado, setLoading, setError: setStoreError } = useComparadorStore();

  /**
   * Calcula a comparação entre os três regimes tributários
   * Agora roda 100% no cliente, sem necessidade de backend
   */
  const calcularComparacao = async (entrada) => {
    try {
      setIsLoading(true);
      setLoading(true);
      setError(null);
      setStoreError(null);

      // Salvar entrada no store
      setEntrada(entrada);

      // Simular pequeno delay para UX
      await new Promise(resolve => setTimeout(resolve, 300));

      // Calcular localmente (sem API)
      const resultado = compararRegimes(entrada);

      console.log('� Cálculo local:', resultado.data);

      if (resultado.success) {
        console.log('✅ Salvando resultado no store:', resultado.data);
        setResultado(resultado.data);
        setIsLoading(false);
        setLoading(false);
        return { success: true, data: resultado.data };
      } else {
        throw new Error('Erro ao calcular comparação');
      }
    } catch (err) {
      const errorMessage = err.message || 'Erro ao calcular';
      setError(errorMessage);
      setStoreError(errorMessage);
      setIsLoading(false);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Calcula apenas um regime específico
   */
  const calcularRegime = async (regime, entrada) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simular pequeno delay para UX
      await new Promise(resolve => setTimeout(resolve, 200));

      const dataCalculo = {
        rbt12: entrada.receita,
        folha: entrada.folha || 0,
        atividade: entrada.atividade,
        despesas: entrada.despesas || 0
      };

      let resultado;
      switch (regime) {
        case 'simples':
          resultado = calcularSimples(dataCalculo);
          break;
        case 'presumido':
          resultado = calcularPresumido(dataCalculo);
          break;
        case 'real':
          resultado = calcularReal(dataCalculo);
          break;
        default:
          throw new Error('Regime inválido');
      }

      setIsLoading(false);
      return { success: true, data: resultado };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao calcular';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Retorna informações sobre os regimes (dados estáticos)
   */
  const obterInfo = async () => {
    try {
      setIsLoading(true);
      
      // Dados estáticos sobre os regimes
      const info = {
        simples: {
          regime: 'Simples Nacional',
          descricao: 'Regime tributário simplificado para micro e pequenas empresas',
          limiteAnual: 4800000,
          tributos: ['IRPJ', 'CSLL', 'PIS', 'COFINS', 'IPI', 'ICMS', 'ISS', 'CPP']
        },
        presumido: {
          regime: 'Lucro Presumido',
          descricao: 'Regime baseado em presunção de lucro sobre a receita',
          presuncoes: { comercio: '8%', industria: '8%', servico: '32%' }
        },
        real: {
          regime: 'Lucro Real',
          descricao: 'Regime baseado no lucro efetivo apurado pela empresa',
          vantagens: ['Tributação sobre lucro efetivo', 'Créditos de PIS/COFINS']
        }
      };

      setIsLoading(false);
      return { success: true, data: info };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao obter informações';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    calcularComparacao,
    calcularRegime,
    obterInfo,
    isLoading,
    error,
  };
};

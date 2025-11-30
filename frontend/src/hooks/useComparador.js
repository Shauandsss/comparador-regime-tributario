/**
 * Hook customizado para realizar cálculos tributários
 */
import { useState } from 'react';
import api from '../services/api';
import { useComparadorStore } from './useAppStore';

export const useComparador = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { setEntrada, setResultado, setLoading, setError: setStoreError } = useComparadorStore();

  /**
   * Calcula a comparação entre os três regimes tributários
   */
  const calcularComparacao = async (entrada) => {
    try {
      setIsLoading(true);
      setLoading(true);
      setError(null);
      setStoreError(null);

      // Salvar entrada no store
      setEntrada(entrada);

      // Chamar API
      const response = await api.post('/calcular/comparar', entrada);

      console.log('📡 Response da API:', response.data);

      if (response.data.success) {
        // Salvar resultado no store
        console.log('✅ Salvando resultado no store:', response.data.data);
        setResultado(response.data.data);
        setIsLoading(false);
        setLoading(false);
        return { success: true, data: response.data.data };
      } else {
        throw new Error('Erro ao calcular comparação');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao calcular';
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

      const endpoints = {
        simples: '/calcular/simples',
        presumido: '/calcular/presumido',
        real: '/calcular/real',
      };

      const endpoint = endpoints[regime];
      if (!endpoint) {
        throw new Error('Regime inválido');
      }

      const response = await api.post(endpoint, entrada);

      setIsLoading(false);
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao calcular';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Busca informações sobre os regimes
   */
  const obterInfo = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/calcular/info');
      setIsLoading(false);
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao obter informações';
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

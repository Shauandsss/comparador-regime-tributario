/**
 * Store global do Comparador Tributário usando Zustand
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useComparadorStore = create(
  persist(
    (set) => ({
      // Estado
      entrada: null,
      resultado: null,
      loading: false,
      error: null,

      // Ações
      setEntrada: (entrada) => set({ entrada, error: null }),
      
      setResultado: (resultado) => set({ 
        resultado, 
        loading: false, 
        error: null 
      }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ 
        error, 
        loading: false 
      }),
      
      // Limpar tudo
      clearAll: () => set({ 
        entrada: null, 
        resultado: null, 
        loading: false, 
        error: null 
      }),
      
      // Limpar apenas erro
      clearError: () => set({ error: null }),
    }),
    {
      name: 'comparador-storage', // Nome no localStorage
      partialize: (state) => ({
        entrada: state.entrada,
        resultado: state.resultado,
      }),
    }
  )
);

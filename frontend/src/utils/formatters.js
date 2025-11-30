/**
 * Formata valor monetário para Real brasileiro
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata porcentagem
 * @param {number} value - Valor a ser formatado
 * @param {number} decimals - Número de casas decimais
 * @returns {string} Valor formatado
 */
export const formatPercentage = (value, decimals = 2) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Calcula porcentagem
 * @param {number} value - Valor base
 * @param {number} percentage - Porcentagem a calcular
 * @returns {number} Resultado do cálculo
 */
export const calculatePercentage = (value, percentage) => {
  return (value * percentage) / 100;
};

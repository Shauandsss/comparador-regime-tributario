/**
 * Controller de Cálculos Tributários
 * 
 * Responsável por receber requisições, validar dados e chamar os serviços
 */

import { calcularSimples, getInfoSimples } from '../services/simples.service.js';
import { calcularPresumido, getInfoPresumido } from '../services/presumido.service.js';
import { calcularReal, getInfoReal } from '../services/real.service.js';

/**
 * Calcula impostos no regime Simples Nacional
 * POST /calcular/simples
 */
export const calcularSimplesNacional = async (req, res) => {
  try {
    const data = req.validatedData;
    const resultado = calcularSimples(data);

    return res.status(200).json({
      success: true,
      data: resultado
    });
  } catch (error) {
    console.error('Erro ao calcular Simples Nacional:', error);
    return res.status(500).json({
      error: true,
      message: error.message || 'Erro ao calcular Simples Nacional'
    });
  }
};

/**
 * Calcula impostos no regime Lucro Presumido
 * POST /calcular/presumido
 */
export const calcularLucroPresumido = async (req, res) => {
  try {
    const data = req.validatedData;
    const resultado = calcularPresumido(data);

    return res.status(200).json({
      success: true,
      data: resultado
    });
  } catch (error) {
    console.error('Erro ao calcular Lucro Presumido:', error);
    return res.status(500).json({
      error: true,
      message: error.message || 'Erro ao calcular Lucro Presumido'
    });
  }
};

/**
 * Calcula impostos no regime Lucro Real
 * POST /calcular/real
 */
export const calcularLucroReal = async (req, res) => {
  try {
    const data = req.validatedData;
    const resultado = calcularReal(data);

    return res.status(200).json({
      success: true,
      data: resultado
    });
  } catch (error) {
    console.error('Erro ao calcular Lucro Real:', error);
    return res.status(500).json({
      error: true,
      message: error.message || 'Erro ao calcular Lucro Real'
    });
  }
};

/**
 * Compara os três regimes tributários
 * POST /calcular/comparar
 */
export const comparar = async (req, res) => {
  try {
    const data = req.validatedData;

    // Calcular cada regime
    const resultadoSimples = calcularSimples(data);
    const resultadoPresumido = calcularPresumido(data);
    const resultadoReal = calcularReal(data);

    // Criar objeto de comparação
    const comparacao = {
      simples: resultadoSimples.impostoTotal,
      presumido: resultadoPresumido.impostoTotal,
      real: resultadoReal.impostoTotal
    };

    // Determinar o melhor regime (menor imposto)
    const regimes = [
      { nome: 'Simples Nacional', valor: comparacao.simples },
      { nome: 'Lucro Presumido', valor: comparacao.presumido },
      { nome: 'Lucro Real', valor: comparacao.real }
    ];

    const melhorRegime = regimes.reduce((prev, current) => 
      current.valor < prev.valor ? current : prev
    );

    // Calcular economia em relação ao pior regime
    const piorRegime = regimes.reduce((prev, current) => 
      current.valor > prev.valor ? current : prev
    );

    const economia = piorRegime.valor - melhorRegime.valor;
    const percentualEconomia = piorRegime.valor > 0 
      ? ((economia / piorRegime.valor) * 100).toFixed(2) 
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        regimes: {
          simples: {
            imposto_total: resultadoSimples.impostoTotal,
            aliquota_efetiva: resultadoSimples.aliquotaEfetiva,
            detalhes: resultadoSimples
          },
          presumido: {
            imposto_total: resultadoPresumido.impostoTotal,
            aliquota_efetiva: resultadoPresumido.aliquotaEfetiva,
            detalhes: resultadoPresumido
          },
          real: {
            imposto_total: resultadoReal.impostoTotal,
            aliquota_efetiva: resultadoReal.aliquotaEfetiva,
            detalhes: resultadoReal
          }
        },
        melhor_opcao: melhorRegime.nome.toLowerCase().includes('simples') ? 'simples' : 
                      melhorRegime.nome.toLowerCase().includes('presumido') ? 'presumido' : 'real',
        economia: {
          valor: parseFloat(economia.toFixed(2)),
          percentual: parseFloat(percentualEconomia),
          regime_comparado: piorRegime.nome.toLowerCase().includes('simples') ? 'simples' : 
                           piorRegime.nome.toLowerCase().includes('presumido') ? 'presumido' : 'real'
        }
      }
    });
  } catch (error) {
    console.error('Erro ao comparar regimes:', error);
    return res.status(500).json({
      error: true,
      message: error.message || 'Erro ao comparar regimes tributários'
    });
  }
};

/**
 * Obtém informações sobre os regimes tributários
 * GET /calcular/info
 */
export const getInfo = async (req, res) => {
  try {
    const info = {
      simplesNacional: getInfoSimples(),
      lucroPresumido: getInfoPresumido(),
      lucroReal: getInfoReal()
    };

    return res.status(200).json({
      success: true,
      data: info
    });
  } catch (error) {
    console.error('Erro ao obter informações:', error);
    return res.status(500).json({
      error: true,
      message: error.message || 'Erro ao obter informações'
    });
  }
};

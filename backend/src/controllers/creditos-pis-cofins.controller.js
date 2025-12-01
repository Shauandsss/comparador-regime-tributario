/**
 * Controller para cálculo de créditos PIS/COFINS
 */
import { calcularCreditos, simularEconomia } from '../services/creditos-pis-cofins.service.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * POST /creditos/calcular
 * Calcula créditos de PIS/COFINS baseado nas despesas
 */
export async function calcularCreditosController(req, res, next) {
  try {
    const despesas = req.body;
    
    // Converter strings para números
    Object.keys(despesas).forEach(key => {
      if (despesas[key]) {
        despesas[key] = parseFloat(despesas[key]);
      }
    });
    
    // Executar cálculo
    const resultado = calcularCreditos(despesas);
    
    return res.status(HTTP_STATUS.OK).json(resultado);
    
  } catch (error) {
    console.error('Erro ao calcular créditos:', error);
    
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      sucesso: false,
      erro: error.message || 'Erro ao calcular créditos'
    });
  }
}

/**
 * POST /creditos/simular
 * Simula economia comparando com e sem créditos
 */
export async function simularEconomiaController(req, res, next) {
  try {
    const { receitaBruta, ...despesas } = req.body;
    
    // Converter para números
    const receitaNumero = parseFloat(receitaBruta);
    
    Object.keys(despesas).forEach(key => {
      if (despesas[key]) {
        despesas[key] = parseFloat(despesas[key]);
      }
    });
    
    // Validação
    if (isNaN(receitaNumero)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        erro: 'Parâmetros inválidos',
        mensagem: 'Receita bruta deve ser um número válido'
      });
    }
    
    // Executar simulação
    const resultado = simularEconomia(receitaNumero, despesas);
    
    return res.status(HTTP_STATUS.OK).json(resultado);
    
  } catch (error) {
    console.error('Erro ao simular economia:', error);
    
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      sucesso: false,
      erro: error.message || 'Erro ao simular economia'
    });
  }
}

export default {
  calcularCreditosController,
  simularEconomiaController
};

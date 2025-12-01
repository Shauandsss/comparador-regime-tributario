/**
 * Controller para cálculo do Lucro Real
 */
import { calcularLucroReal } from '../services/lucro-real.service.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * POST /real/calcular
 * Calcula IRPJ, CSLL, PIS, COFINS no Lucro Real
 */
export async function calcularRealController(req, res, next) {
  try {
    const { receita, despesas, folha, creditosPis, creditosCofins, periodo } = req.body;
    
    // Converter para números
    const dados = {
      receita: parseFloat(receita),
      despesas: parseFloat(despesas) || 0,
      folha: parseFloat(folha) || 0,
      creditosPis: parseFloat(creditosPis) || 0,
      creditosCofins: parseFloat(creditosCofins) || 0,
      periodo: periodo || 'trimestral'
    };
    
    // Validação básica
    if (isNaN(dados.receita)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        erro: 'Parâmetros inválidos',
        mensagem: 'Receita deve ser um número válido'
      });
    }
    
    // Executar cálculo
    const resultado = calcularLucroReal(dados);
    
    return res.status(HTTP_STATUS.OK).json(resultado);
    
  } catch (error) {
    console.error('Erro ao calcular Lucro Real:', error);
    
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      sucesso: false,
      erro: error.message || 'Erro ao calcular Lucro Real'
    });
  }
}

export default {
  calcularRealController
};

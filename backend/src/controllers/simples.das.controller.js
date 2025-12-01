/**
 * Controller para cálculo do DAS do Simples Nacional
 */
import { calcularDAS } from '../services/simples.das.service.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * GET /simples/das
 * Calcula o DAS do Simples Nacional
 */
export async function calcularDASController(req, res, next) {
  try {
    const { rbt12, faturamentoMes, cnae, folha12 } = req.query;
    
    // Converter strings para números
    const dados = {
      rbt12: parseFloat(rbt12),
      faturamentoMes: parseFloat(faturamentoMes),
      cnae: cnae,
      folha12: folha12 ? parseFloat(folha12) : 0
    };
    
    // Validação básica
    if (isNaN(dados.rbt12) || isNaN(dados.faturamentoMes)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        erro: 'Parâmetros inválidos',
        mensagem: 'rbt12 e faturamentoMes devem ser números válidos'
      });
    }
    
    // Executar cálculo
    const resultado = calcularDAS(dados);
    
    // Retornar resposta
    return res.status(HTTP_STATUS.OK).json(resultado);
    
  } catch (error) {
    console.error('Erro ao calcular DAS:', error);
    
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      sucesso: false,
      erro: error.message || 'Erro ao calcular DAS'
    });
  }
}

export default {
  calcularDASController
};

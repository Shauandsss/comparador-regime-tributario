/**
 * Controller para cálculo do Fator R
 */
import { calcularFatorR, calcularCenarios } from '../services/fator-r.service.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * GET /simples/fator-r
 * Calcula o Fator R e determina o anexo
 */
export async function calcularFatorRController(req, res, next) {
  try {
    const { folha12, rbt12 } = req.query;
    
    // Converter strings para números
    const dados = {
      folha12: parseFloat(folha12),
      rbt12: parseFloat(rbt12)
    };
    
    // Validação básica
    if (isNaN(dados.folha12) || isNaN(dados.rbt12)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        erro: 'Parâmetros inválidos',
        mensagem: 'folha12 e rbt12 devem ser números válidos'
      });
    }
    
    // Executar cálculo
    const resultado = calcularFatorR(dados.folha12, dados.rbt12);
    
    // Calcular cenários adicionais
    const cenarios = calcularCenarios(dados.rbt12, dados.folha12);
    resultado.cenarios = cenarios;
    
    // Retornar resposta
    return res.status(HTTP_STATUS.OK).json(resultado);
    
  } catch (error) {
    console.error('Erro ao calcular Fator R:', error);
    
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      sucesso: false,
      erro: error.message || 'Erro ao calcular Fator R'
    });
  }
}

export default {
  calcularFatorRController
};

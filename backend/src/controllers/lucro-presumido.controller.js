/**
 * Controller para cálculo do Lucro Presumido
 */
import { calcularLucroPresumido, listarAtividades } from '../services/lucro-presumido.service.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * POST /presumido/calcular
 * Calcula IRPJ, CSLL, PIS, COFINS no Lucro Presumido
 */
export async function calcularPresumidoController(req, res, next) {
  try {
    const { receita, atividade, periodo, aliquotaISS } = req.body;
    
    // Converter para números
    const dados = {
      receita: parseFloat(receita),
      atividade,
      periodo: periodo || 'trimestral',
      aliquotaISS: aliquotaISS ? parseFloat(aliquotaISS) : 0
    };
    
    // Validação básica
    if (isNaN(dados.receita)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        erro: 'Parâmetros inválidos',
        mensagem: 'Receita deve ser um número válido'
      });
    }
    
    // Executar cálculo
    const resultado = calcularLucroPresumido(dados);
    
    return res.status(HTTP_STATUS.OK).json(resultado);
    
  } catch (error) {
    console.error('Erro ao calcular Lucro Presumido:', error);
    
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      sucesso: false,
      erro: error.message || 'Erro ao calcular Lucro Presumido'
    });
  }
}

/**
 * GET /presumido/atividades
 * Lista atividades e percentuais de presunção
 */
export async function listarAtividadesController(req, res, next) {
  try {
    const atividades = listarAtividades();
    
    return res.status(HTTP_STATUS.OK).json({
      sucesso: true,
      atividades
    });
    
  } catch (error) {
    console.error('Erro ao listar atividades:', error);
    
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      sucesso: false,
      erro: 'Erro ao listar atividades'
    });
  }
}

export default {
  calcularPresumidoController,
  listarAtividadesController
};

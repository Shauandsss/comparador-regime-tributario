import Joi from 'joi';

/**
 * Schema de validação para cálculos tributários
 */
export const calculoSchema = Joi.object({
  rbt12: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'RBT12 deve ser um número',
      'number.positive': 'RBT12 deve ser positivo',
      'any.required': 'RBT12 é obrigatório'
    }),
  
  atividade: Joi.string()
    .valid('comércio', 'comercio', 'indústria', 'industria', 'serviço', 'servico')
    .required()
    .messages({
      'string.base': 'Atividade deve ser uma string',
      'any.only': 'Atividade deve ser: comércio, indústria ou serviço',
      'any.required': 'Atividade é obrigatória'
    }),
  
  folha: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Folha deve ser um número',
      'number.min': 'Folha não pode ser negativa'
    }),
  
  despesas: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Despesas deve ser um número',
      'number.min': 'Despesas não podem ser negativas'
    })
});

/**
 * Middleware de validação
 */
export const validateCalculo = (req, res, next) => {
  const { error, value } = calculoSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: true,
      message: 'Erro de validação',
      details: errors
    });
  }

  // Normalizar atividade (remover acentos e padronizar)
  if (value.atividade) {
    const atividadeMap = {
      'comércio': 'comercio',
      'indústria': 'industria',
      'serviço': 'servico'
    };
    value.atividade = atividadeMap[value.atividade] || value.atividade;
  }

  req.validatedData = value;
  next();
};

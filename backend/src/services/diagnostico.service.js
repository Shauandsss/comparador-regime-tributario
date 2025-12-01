/**
 * Serviço de Diagnóstico Tributário Inteligente
 * Calcula os três regimes e recomenda o melhor
 */

import * as simplesService from './simples.service.js';
import * as presumidoService from './presumido.service.js';
import * as realService from './real.service.js';

// Limites Simples Nacional 2024
const LIMITE_SIMPLES = 4800000; // R$ 4,8 milhões

// Tipos de atividade e suas características
const ATIVIDADES_INFO = {
  comercio: {
    nome: 'Comércio',
    anexoSimples: 'I',
    presuncaoIRPJ: 8,
    presuncaoCSLL: 12
  },
  industria: {
    nome: 'Indústria',
    anexoSimples: 'II',
    presuncaoIRPJ: 8,
    presuncaoCSLL: 12
  },
  servicos: {
    nome: 'Serviços',
    anexoSimples: 'III', // pode ser V dependendo do Fator R
    presuncaoIRPJ: 32,
    presuncaoCSLL: 32
  },
  servicos_profissionais: {
    nome: 'Serviços Profissionais',
    anexoSimples: 'IV',
    presuncaoIRPJ: 32,
    presuncaoCSLL: 32
  }
};

/**
 * Calcula Simples Nacional
 */
function calcularSimples(dados) {
  const { receitaBruta12, receitaMes, atividade, folha12 } = dados;

  // Verifica se está dentro do limite
  if (receitaBruta12 > LIMITE_SIMPLES) {
    return {
      aplicavel: false,
      motivo: 'Receita bruta anual excede o limite de R$ 4,8 milhões',
      valorMensal: 0,
      valorAnual: 0,
      aliquotaEfetiva: 0
    };
  }

  // Determina anexo
  let anexo = 'I';
  if (atividade === 'industria') anexo = 'II';
  if (atividade === 'servicos' || atividade === 'servicos_profissionais') {
    // Calcula Fator R
    const fatorR = folha12 > 0 ? (folha12 / receitaBruta12) * 100 : 0;
    anexo = fatorR >= 28 ? 'III' : 'V';
  }

  // Calcula DAS usando serviço existente
  try {
    const resultadoDAS = simplesService.calcularDAS({
      rbt12: receitaBruta12,
      faturamentoMes: receitaMes,
      anexo
    });

    return {
      aplicavel: true,
      anexo,
      aliquotaEfetiva: resultadoDAS.aliquotaEfetiva,
      valorMensal: resultadoDAS.valorDAS,
      valorAnual: resultadoDAS.valorDAS * 12,
      detalhes: {
        faixaAtual: resultadoDAS.faixa,
        parcelaRedutora: resultadoDAS.parcelaRedutora
      }
    };
  } catch (error) {
    return {
      aplicavel: false,
      motivo: 'Erro ao calcular Simples Nacional',
      valorMensal: 0,
      valorAnual: 0,
      aliquotaEfetiva: 0
    };
  }
}

/**
 * Calcula Lucro Presumido
 */
function calcularPresumido(dados) {
  const { receitaMes, atividade } = dados;

  const atividadeInfo = ATIVIDADES_INFO[atividade] || ATIVIDADES_INFO.servicos;

  try {
    // Calcula trimestre (aproximação: receita mensal * 3)
    const receitaTrimestre = receitaMes * 3;

    const resultado = presumidoService.calcularLucroPresumido({
      receita: receitaTrimestre,
      tipoAtividade: atividade === 'comercio' || atividade === 'industria' ? 'comercio' : 'servicos',
      periodo: 'trimestral',
      aplicaISS: atividade === 'servicos' || atividade === 'servicos_profissionais',
      aliquotaISS: 3
    });

    const totalMensal = resultado.totalTributos / 3;
    const totalAnual = resultado.totalTributos * 4;

    return {
      aplicavel: true,
      presuncaoIRPJ: atividadeInfo.presuncaoIRPJ,
      presuncaoCSLL: atividadeInfo.presuncaoCSLL,
      valorMensal: totalMensal,
      valorAnual: totalAnual,
      aliquotaEfetiva: (totalMensal / receitaMes) * 100,
      detalhes: {
        irpj: resultado.irpj / 3,
        csll: resultado.csll / 3,
        pis: resultado.pis / 3,
        cofins: resultado.cofins / 3,
        iss: resultado.iss / 3
      }
    };
  } catch (error) {
    return {
      aplicavel: false,
      motivo: 'Erro ao calcular Lucro Presumido',
      valorMensal: 0,
      valorAnual: 0,
      aliquotaEfetiva: 0
    };
  }
}

/**
 * Calcula Lucro Real
 */
function calcularReal(dados) {
  const { receitaMes, despesasMes, folhaMes } = dados;

  try {
    const resultado = realService.calcularLucroReal({
      receita: receitaMes,
      despesas: despesasMes || 0,
      folha: folhaMes || 0,
      creditosPIS: 0,
      creditosCOFINS: 0,
      periodo: 'mensal'
    });

    const totalMensal = resultado.totalTributos;
    const totalAnual = resultado.totalTributos * 12;

    return {
      aplicavel: true,
      lucroContabil: resultado.lucroContabil,
      valorMensal: totalMensal,
      valorAnual: totalAnual,
      aliquotaEfetiva: receitaMes > 0 ? (totalMensal / receitaMes) * 100 : 0,
      detalhes: {
        irpj: resultado.irpj,
        csll: resultado.csll,
        pis: resultado.pis,
        cofins: resultado.cofins
      },
      aviso: resultado.lucroContabil <= 0 ? 'Empresa em prejuízo - sem IRPJ/CSLL' : null
    };
  } catch (error) {
    return {
      aplicavel: false,
      motivo: 'Erro ao calcular Lucro Real',
      valorMensal: 0,
      valorAnual: 0,
      aliquotaEfetiva: 0
    };
  }
}

/**
 * Função principal: Diagnóstico Completo
 */
function diagnosticar(dados) {
  const {
    receitaBruta12,
    receitaMes,
    despesasMes = 0,
    folhaMes = 0,
    folha12,
    atividade = 'servicos'
  } = dados;

  // Valida dados
  if (!receitaBruta12 || receitaBruta12 <= 0) {
    throw new Error('Receita Bruta anual é obrigatória');
  }

  if (!receitaMes || receitaMes <= 0) {
    throw new Error('Receita mensal é obrigatória');
  }

  // Calcula os três regimes
  const simples = calcularSimples({
    receitaBruta12,
    receitaMes,
    atividade,
    folha12: folha12 || folhaMes * 12
  });

  const presumido = calcularPresumido({
    receitaMes,
    atividade
  });

  const real = calcularReal({
    receitaMes,
    despesasMes,
    folhaMes
  });

  // Determina o melhor regime
  const regimesAplicaveis = [];

  if (simples.aplicavel) {
    regimesAplicaveis.push({
      regime: 'Simples Nacional',
      valor: simples.valorAnual,
      aliquota: simples.aliquotaEfetiva,
      ranking: 1
    });
  }

  if (presumido.aplicavel) {
    regimesAplicaveis.push({
      regime: 'Lucro Presumido',
      valor: presumido.valorAnual,
      aliquota: presumido.aliquotaEfetiva,
      ranking: 2
    });
  }

  if (real.aplicavel) {
    regimesAplicaveis.push({
      regime: 'Lucro Real',
      valor: real.valorAnual,
      aliquota: real.aliquotaEfetiva,
      ranking: 3
    });
  }

  // Ordena por menor valor
  regimesAplicaveis.sort((a, b) => a.valor - b.valor);

  // Atualiza ranking
  regimesAplicaveis.forEach((r, index) => {
    r.ranking = index + 1;
  });

  const melhorRegime = regimesAplicaveis[0];
  const economiaAnual = regimesAplicaveis.length > 1
    ? regimesAplicaveis[1].valor - melhorRegime.valor
    : 0;

  // Gera recomendações
  const recomendacoes = gerarRecomendacoes({
    simples,
    presumido,
    real,
    melhorRegime: melhorRegime.regime,
    atividade,
    despesasMes,
    folhaMes,
    receitaBruta12
  });

  return {
    empresa: {
      receitaBruta12,
      receitaMes,
      despesasMes,
      folhaMes,
      atividade: ATIVIDADES_INFO[atividade]?.nome || 'Não especificada'
    },
    calculos: {
      simples,
      presumido,
      real
    },
    ranking: regimesAplicaveis,
    recomendacao: {
      melhorRegime: melhorRegime.regime,
      tributosAnuais: melhorRegime.valor,
      aliquotaEfetiva: melhorRegime.aliquota,
      economiaAnual,
      economiaMensal: economiaAnual / 12,
      percentualEconomia: regimesAplicaveis.length > 1
        ? ((economiaAnual / regimesAplicaveis[1].valor) * 100).toFixed(2)
        : 0
    },
    recomendacoes
  };
}

/**
 * Gera recomendações personalizadas
 */
function gerarRecomendacoes(params) {
  const { simples, presumido, real, melhorRegime, atividade, despesasMes, folhaMes, receitaBruta12 } = params;

  const recomendacoes = [];

  // Recomendação 1: Melhor regime
  recomendacoes.push({
    tipo: 'principal',
    titulo: `${melhorRegime} é a melhor opção`,
    descricao: `Com base nos dados informados, o ${melhorRegime} oferece a menor carga tributária para sua empresa.`
  });

  // Recomendação 2: Simples Nacional
  if (!simples.aplicavel && receitaBruta12 <= LIMITE_SIMPLES * 1.1) {
    recomendacoes.push({
      tipo: 'alerta',
      titulo: 'Atenção ao limite do Simples Nacional',
      descricao: 'Sua receita está próxima do limite. Planeje-se para eventual mudança de regime.'
    });
  }

  // Recomendação 3: Fator R
  if (atividade === 'servicos' && folhaMes > 0) {
    const fatorR = (folhaMes * 12 / receitaBruta12) * 100;
    if (fatorR < 28 && fatorR > 20) {
      recomendacoes.push({
        tipo: 'oportunidade',
        titulo: 'Aumente a folha para melhorar o Fator R',
        descricao: `Seu Fator R está em ${fatorR.toFixed(1)}%. Aumentando a folha para 28%, você pode migrar para o Anexo III do Simples (alíquotas menores).`
      });
    }
  }

  // Recomendação 4: Lucro Real com prejuízo
  if (real.aplicavel && real.lucroContabil <= 0) {
    recomendacoes.push({
      tipo: 'oportunidade',
      titulo: 'Lucro Real pode ser vantajoso',
      descricao: 'Sua empresa está com prejuízo. No Lucro Real, você não pagará IRPJ e CSLL, apenas PIS e COFINS.'
    });
  }

  // Recomendação 5: Despesas altas
  if (despesasMes > 0 && presumido.aplicavel && real.aplicavel) {
    const margem = ((real.lucroContabil || 0) / (despesasMes + real.lucroContabil + folhaMes)) * 100;
    if (margem < 20) {
      recomendacoes.push({
        tipo: 'dica',
        titulo: 'Avalie créditos de PIS/COFINS',
        descricao: 'Com despesas altas, o Lucro Real pode gerar créditos tributários que reduzem a carga final.'
      });
    }
  }

  // Recomendação 6: Simples vs Presumido
  if (simples.aplicavel && presumido.aplicavel) {
    const diferencaPercentual = Math.abs(
      ((simples.valorAnual - presumido.valorAnual) / simples.valorAnual) * 100
    );

    if (diferencaPercentual < 5) {
      recomendacoes.push({
        tipo: 'dica',
        titulo: 'Diferença pequena entre Simples e Presumido',
        descricao: 'A diferença tributária é mínima. Considere também a complexidade contábil na decisão.'
      });
    }
  }

  return recomendacoes;
}

/**
 * Simula cenários alternativos
 */
function simularCenarios(dados) {
  const cenarios = [];

  // Cenário base
  const base = diagnosticar(dados);
  cenarios.push({
    nome: 'Cenário Atual',
    tipo: 'base',
    resultado: base
  });

  // Cenário: Aumentar folha 20%
  if (dados.folhaMes > 0) {
    const comMaisFolha = diagnosticar({
      ...dados,
      folhaMes: dados.folhaMes * 1.2,
      folha12: dados.folha12 ? dados.folha12 * 1.2 : dados.folhaMes * 1.2 * 12
    });

    cenarios.push({
      nome: 'Folha +20%',
      tipo: 'simulacao',
      resultado: comMaisFolha,
      impacto: {
        diferenca: comMaisFolha.recomendacao.tributosAnuais - base.recomendacao.tributosAnuais,
        valePena: comMaisFolha.recomendacao.tributosAnuais < base.recomendacao.tributosAnuais
      }
    });
  }

  // Cenário: Reduzir despesas 15%
  if (dados.despesasMes > 0) {
    const comMenosDespesas = diagnosticar({
      ...dados,
      despesasMes: dados.despesasMes * 0.85
    });

    cenarios.push({
      nome: 'Despesas -15%',
      tipo: 'simulacao',
      resultado: comMenosDespesas,
      impacto: {
        diferenca: comMenosDespesas.recomendacao.tributosAnuais - base.recomendacao.tributosAnuais,
        valePena: comMenosDespesas.recomendacao.tributosAnuais < base.recomendacao.tributosAnuais
      }
    });
  }

  return cenarios;
}

export {
  diagnosticar,
  simularCenarios
};

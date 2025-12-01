/**
 * Service para cálculo e análise do Fator R
 * Fator R = Folha de Salários (12 meses) / Receita Bruta Total (12 meses)
 * Determina se empresa se enquadra no Anexo III (≥28%) ou Anexo V (<28%)
 */

/**
 * Calcula o Fator R
 * @param {number} folha12 - Folha de salários dos últimos 12 meses
 * @param {number} rbt12 - Receita Bruta Total dos últimos 12 meses
 * @returns {Object} - Resultado completo da análise do Fator R
 */
export function calcularFatorR(folha12, rbt12) {
  // Validações
  if (!rbt12 || rbt12 <= 0) {
    throw new Error('RBT12 (Receita Bruta Total 12 meses) é obrigatório e deve ser maior que zero');
  }
  
  if (folha12 === undefined || folha12 === null || folha12 < 0) {
    throw new Error('Folha de salários não pode ser negativa');
  }
  
  // Cálculo do Fator R
  const fatorR = folha12 / rbt12;
  const fatorRPercentual = fatorR * 100;
  
  // Determinação do Anexo
  const limiteAnexoIII = 0.28;
  const enquadraAnexoIII = fatorR >= limiteAnexoIII;
  const anexoAplicavel = enquadraAnexoIII ? 'ANEXO_III' : 'ANEXO_V';
  
  // Cálculo de quanto falta ou sobra para mudar de anexo
  const diferencaParaLimite = fatorR - limiteAnexoIII;
  const diferencaPercentual = diferencaParaLimite * 100;
  
  // Calcular quanto precisa aumentar/diminuir a folha para atingir 28%
  const folhaIdealPara28 = rbt12 * limiteAnexoIII;
  const diferencaFolha = folhaIdealPara28 - folha12;
  
  // Análise da situação
  let situacao = '';
  let recomendacao = '';
  let nivelRisco = '';
  let corIndicador = '';
  
  if (fatorRPercentual < 20) {
    situacao = 'Muito Abaixo';
    recomendacao = 'Empresa está longe do Anexo III. Considere aumentar a folha de salários se houver possibilidade de redução tributária.';
    nivelRisco = 'baixo';
    corIndicador = '#EF4444'; // Vermelho
  } else if (fatorRPercentual < 26) {
    situacao = 'Abaixo';
    recomendacao = 'Próximo ao limite! Considere aumentar estrategicamente a folha de salários para atingir o Anexo III e reduzir a carga tributária.';
    nivelRisco = 'medio';
    corIndicador = '#F59E0B'; // Laranja
  } else if (fatorRPercentual < 28) {
    situacao = 'Quase Lá';
    recomendacao = 'Muito próximo! Pequenos ajustes na folha podem enquadrar no Anexo III. Consulte um contador para análise detalhada.';
    nivelRisco = 'atencao';
    corIndicador = '#FBBF24'; // Amarelo
  } else if (fatorRPercentual < 32) {
    situacao = 'Enquadrado (Limite)';
    recomendacao = 'Enquadrado no Anexo III, mas próximo ao limite. Mantenha a folha de salários estável para não perder o benefício.';
    nivelRisco = 'atencao';
    corIndicador = '#84CC16'; // Verde claro
  } else {
    situacao = 'Enquadrado (Confortável)';
    recomendacao = 'Confortavelmente enquadrado no Anexo III. Você tem margem de segurança para variações na folha de salários.';
    nivelRisco = 'otimo';
    corIndicador = '#22C55E'; // Verde
  }
  
  // Economia potencial estimada (diferença média entre Anexo V e III)
  // Anexo V começa em 15.5%, Anexo III começa em 6%
  const economiaPotencialPercentual = enquadraAnexoIII ? 9.5 : 0; // Diferença média
  const economiaAnualEstimada = rbt12 * (economiaPotencialPercentual / 100);
  
  // Retorno completo
  return {
    sucesso: true,
    calculo: {
      folha12,
      folha12Formatado: formatarMoeda(folha12),
      rbt12,
      rbt12Formatado: formatarMoeda(rbt12),
      fatorR: fatorR.toFixed(4),
      fatorRPercentual: fatorRPercentual.toFixed(2) + '%',
      fatorRDecimal: fatorR
    },
    anexo: {
      atual: anexoAplicavel,
      nomeAtual: anexoAplicavel === 'ANEXO_III' ? 'Anexo III' : 'Anexo V',
      descricaoAtual: anexoAplicavel === 'ANEXO_III' 
        ? 'Serviços com folha de salários ≥ 28% da receita'
        : 'Serviços com folha de salários < 28% da receita',
      enquadraAnexoIII,
      limiteAnexoIII: '28%',
      aliquotaInicialAnexoIII: '6%',
      aliquotaInicialAnexoV: '15.5%'
    },
    analise: {
      situacao,
      recomendacao,
      nivelRisco,
      corIndicador,
      diferencaParaLimite: diferencaParaLimite.toFixed(4),
      diferencaPercentual: diferencaPercentual.toFixed(2) + '%',
      diferencaPercentualNumero: diferencaPercentual
    },
    acoes: {
      folhaIdealPara28: folhaIdealPara28.toFixed(2),
      folhaIdealPara28Formatado: formatarMoeda(folhaIdealPara28),
      diferencaFolha: diferencaFolha.toFixed(2),
      diferencaFolhaFormatado: formatarMoeda(Math.abs(diferencaFolha)),
      precisaAumentar: diferencaFolha > 0,
      precisaDiminuir: diferencaFolha < 0,
      jaNaFaixaIdeal: Math.abs(diferencaFolha) < 100
    },
    economia: {
      estaNoAnexoMaisVantajoso: enquadraAnexoIII,
      economiaPotencialPercentual: economiaPotencialPercentual + '%',
      economiaAnualEstimada: economiaAnualEstimada.toFixed(2),
      economiaAnualEstimadaFormatado: formatarMoeda(economiaAnualEstimada),
      economiaAproveitada: enquadraAnexoIII
    },
    detalhamento: {
      formula: 'Fator R = Folha de Salários (12 meses) ÷ Receita Bruta Total (12 meses)',
      calculo: `${formatarMoeda(folha12)} ÷ ${formatarMoeda(rbt12)} = ${fatorRPercentual.toFixed(2)}%`,
      criterio: 'Se Fator R ≥ 28% → Anexo III | Se Fator R < 28% → Anexo V'
    }
  };
}

/**
 * Calcula cenários "E se..." para planejamento
 * @param {number} rbt12 - Receita Bruta Total
 * @param {number} folhaAtual - Folha atual
 * @returns {Array} - Array com diferentes cenários
 */
export function calcularCenarios(rbt12, folhaAtual) {
  const cenarios = [];
  
  // Cenários: 20%, 24%, 28%, 32%, 36%
  const percentuais = [20, 24, 28, 32, 36];
  
  percentuais.forEach(percentual => {
    const folhaSimulada = rbt12 * (percentual / 100);
    const resultado = calcularFatorR(folhaSimulada, rbt12);
    
    cenarios.push({
      percentual: percentual + '%',
      folhaNecessaria: formatarMoeda(folhaSimulada),
      folhaNecessariaNumero: folhaSimulada,
      diferencaParaAtual: formatarMoeda(Math.abs(folhaSimulada - folhaAtual)),
      precisaAumentar: folhaSimulada > folhaAtual,
      anexo: resultado.anexo.nomeAtual,
      vantajoso: resultado.anexo.enquadraAnexoIII
    });
  });
  
  return cenarios;
}

/**
 * Formata valor em moeda brasileira
 */
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

export default {
  calcularFatorR,
  calcularCenarios
};

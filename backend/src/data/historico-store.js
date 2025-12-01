/**
 * Armazenamento em memória para histórico tributário
 * Em produção, substituir por banco de dados
 */

// Armazenamento por empresa/usuário (usando ID simples)
const historicoStore = new Map();

/**
 * Obter histórico de uma empresa
 * @param {string} empresaId - ID da empresa
 * @returns {Array} - Array de registros mensais
 */
function getHistorico(empresaId) {
  return historicoStore.get(empresaId) || [];
}

/**
 * Adicionar registro mensal
 * @param {string} empresaId - ID da empresa
 * @param {Object} registro - Dados do mês
 * @returns {Object} - Registro salvo
 */
function addRegistro(empresaId, registro) {
  const historico = getHistorico(empresaId);
  
  // Verificar se já existe registro para o mesmo mês/ano
  const indexExistente = historico.findIndex(
    r => r.mes === registro.mes && r.ano === registro.ano
  );
  
  const novoRegistro = {
    ...registro,
    id: `${empresaId}-${registro.ano}-${registro.mes}`,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString()
  };
  
  if (indexExistente >= 0) {
    // Atualizar registro existente
    novoRegistro.criadoEm = historico[indexExistente].criadoEm;
    historico[indexExistente] = novoRegistro;
  } else {
    // Adicionar novo registro
    historico.push(novoRegistro);
  }
  
  // Ordenar por data
  historico.sort((a, b) => {
    if (a.ano !== b.ano) return a.ano - b.ano;
    return a.mes - b.mes;
  });
  
  historicoStore.set(empresaId, historico);
  return novoRegistro;
}

/**
 * Remover registro
 * @param {string} empresaId - ID da empresa
 * @param {number} mes - Mês (1-12)
 * @param {number} ano - Ano
 * @returns {boolean} - Se foi removido
 */
function removeRegistro(empresaId, mes, ano) {
  const historico = getHistorico(empresaId);
  const index = historico.findIndex(r => r.mes === mes && r.ano === ano);
  
  if (index >= 0) {
    historico.splice(index, 1);
    historicoStore.set(empresaId, historico);
    return true;
  }
  return false;
}

/**
 * Limpar todo histórico de uma empresa
 * @param {string} empresaId - ID da empresa
 */
function clearHistorico(empresaId) {
  historicoStore.delete(empresaId);
}

/**
 * Obter estatísticas do histórico
 * @param {string} empresaId - ID da empresa
 * @returns {Object} - Estatísticas calculadas
 */
function getEstatisticas(empresaId) {
  const historico = getHistorico(empresaId);
  
  if (historico.length === 0) {
    return null;
  }
  
  const totalFaturamento = historico.reduce((acc, r) => acc + r.faturamento, 0);
  const totalTributos = historico.reduce((acc, r) => acc + r.tributosPagos, 0);
  const mediaFaturamento = totalFaturamento / historico.length;
  const mediaTributos = totalTributos / historico.length;
  const aliquotaMediaEfetiva = (totalTributos / totalFaturamento) * 100;
  
  // Encontrar mês com maior e menor tributo
  const maiorTributo = historico.reduce((max, r) => 
    r.tributosPagos > max.tributosPagos ? r : max, historico[0]);
  const menorTributo = historico.reduce((min, r) => 
    r.tributosPagos < min.tributosPagos ? r : min, historico[0]);
  
  return {
    totalMeses: historico.length,
    totalFaturamento,
    totalTributos,
    mediaFaturamento,
    mediaTributos,
    aliquotaMediaEfetiva,
    maiorTributo: {
      mes: maiorTributo.mes,
      ano: maiorTributo.ano,
      valor: maiorTributo.tributosPagos
    },
    menorTributo: {
      mes: menorTributo.mes,
      ano: menorTributo.ano,
      valor: menorTributo.tributosPagos
    }
  };
}

export {
  getHistorico,
  addRegistro,
  removeRegistro,
  clearHistorico,
  getEstatisticas
};

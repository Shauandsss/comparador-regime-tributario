/**
 * Parser de XML eSocial S-1210 (Pagamentos de Rendimentos do Trabalho)
 * Extrai informações de rendimentos, deduções e IRRF para o Comprovante de Rendimentos
 */

/**
 * Parse de arquivo XML do eSocial (evento S-1210)
 * @param {string} xmlContent - Conteúdo do arquivo XML
 * @returns {Object} - Dados estruturados do comprovante
 */
export function parseXMLeSocial(xmlContent) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

    // Verificar se há erros no parsing
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('XML inválido ou mal formatado');
    }

    // Verificar se é evento S-1210 (suporta evtPgtos e evtPagto)
    let evento = xmlDoc.querySelector('eSocial > evtPgtos, eSocial > evento > evtPgtos');
    let isEvtPagto = false;
    
    if (!evento) {
      evento = xmlDoc.querySelector('eSocial > evtPagto, eSocial > evento > evtPagto');
      isEvtPagto = true;
    }
    
    if (!evento) {
      throw new Error('XML não contém evento S-1210 (Pagamentos de Rendimentos). Estrutura não reconhecida.');
    }

    // Extrair dados do empregador/fonte pagadora
    const ideEmpregador = evento.querySelector('ideEmpregador');
    const fontePagadora = {
      nrInsc: getTextContent(ideEmpregador, 'nrInsc'),
      tpInsc: getTextContent(ideEmpregador, 'tpInsc'),
    };

    // Extrair dados do evento
    const ideEvento = evento.querySelector('ideEvento');
    const perApur = getTextContent(ideEvento, 'perApur'); // AAAA-MM

    // Extrair dados dos beneficiários
    const beneficiarios = [];
    const ideBenefs = isEvtPagto 
      ? [evento.querySelector('ideBenef')].filter(e => e !== null)
      : evento.querySelectorAll('ideBenef');

    ideBenefs.forEach(ideBenef => {
      const cpfBenef = getTextContent(ideBenef, 'cpfBenef');
      const nmBenef = getTextContent(ideBenef, 'nmBenef') || 'Nome não informado';

      let rendimentosTributaveis = 0;
      let contribuicaoPrevidenciaria = 0;
      let irrf = 0;
      let pensaoAlimenticia = 0;
      let rendimentos13Salario = 0;
      let irrf13Salario = 0;
      let outrasDeducoes = 0;
      let rendimentosIsentos = 0;
      let planoSaude = 0;

      // FORMATO 1: evtPgtos (estrutura antiga)
      const infosPgto = evento.querySelectorAll('infoPgto');
      
      infosPgto.forEach(infoPgto => {
        // Pegar rubricas de remuneração
        const detPgtos = infoPgto.querySelectorAll('detPgto');
        
        detPgtos.forEach(detPgto => {
          const valor = parseFloat(getTextContent(detPgto, 'vrPgto')) || 0;
          const codRubrica = getTextContent(detPgto, 'codRubr');
          const tpRubr = getTextContent(detPgto, 'tpRubr'); // 1=Vencimento, 2=Desconto

          if (tpRubr === '1') {
            // Vencimentos
            if (codRubrica && codRubrica.includes('13')) {
              rendimentos13Salario += valor;
            } else {
              rendimentosTributaveis += valor;
            }
          } else if (tpRubr === '2') {
            // Descontos
            if (codRubrica && (codRubrica.includes('INSS') || codRubrica.includes('PREV'))) {
              contribuicaoPrevidenciaria += valor;
            } else if (codRubrica && codRubrica.includes('IR')) {
              irrf += valor;
            } else if (codRubrica && codRubrica.includes('PENSAO')) {
              pensaoAlimenticia += valor;
            } else if (codRubrica && (codRubrica.includes('PLANO') || codRubrica.includes('SAUDE'))) {
              planoSaude += valor;
            } else {
              outrasDeducoes += valor;
            }
          }
        });

        // Buscar informações específicas de IRRF
        const infoIR = infoPgto.querySelector('infoIR');
        if (infoIR) {
          const vrIrrf = parseFloat(getTextContent(infoIR, 'vrIrrf')) || 0;
          if (vrIrrf > 0) {
            irrf = Math.max(irrf, vrIrrf);
          }

          const vr13Trib = parseFloat(getTextContent(infoIR, 'vr13Trib')) || 0;
          if (vr13Trib > 0) {
            rendimentos13Salario = Math.max(rendimentos13Salario, vr13Trib);
          }

          const vrIrrf13 = parseFloat(getTextContent(infoIR, 'vrIrrf13')) || 0;
          if (vrIrrf13 > 0) {
            irrf13Salario = Math.max(irrf13Salario, vrIrrf13);
          }
        }

        // Buscar deduções de dependentes
        const dedDependentes = infoPgto.querySelectorAll('dedDependente');
        dedDependentes.forEach(ded => {
          const vrDeducao = parseFloat(getTextContent(ded, 'vrDeducao')) || 0;
          outrasDeducoes += vrDeducao;
        });
      });

      // FORMATO 2: evtPagto (estrutura nova com dmDev)
      if (isEvtPagto) {
        const dmDev = evento.querySelector('dmDev');
        if (dmDev) {
          // Processar remunPerApurDet
          const remunDetalhes = dmDev.querySelectorAll('remunPerApurDet');
          remunDetalhes.forEach(det => {
            const tpRubr = getTextContent(det, 'tpRubr');
            const codRubr = getTextContent(det, 'codRubr');
            let vrRubr = parseFloat(getTextContent(det, 'vrRubr')) || 0;
            
            // Se valor negativo, tornar positivo para descontos
            const isDesconto = vrRubr < 0;
            vrRubr = Math.abs(vrRubr);

            // Mapear tipos de rubrica conforme novo formato
            // tpRubr: 101=Vencimentos, 102=Previdência, 103=Desconto Judicial, 104=Outros, 201=IRRF
            if (tpRubr === '201' || codRubr.includes('IRRF') || codRubr.includes('IR')) {
              // IRRF
              irrf += vrRubr;
            } else if (tpRubr === '102' || codRubr.includes('PREV') || codRubr.includes('INSS')) {
              // Previdência
              contribuicaoPrevidenciaria += vrRubr;
            } else if (tpRubr === '103' || codRubr.includes('DESCJUD')) {
              // Desconto Judicial (pensão)
              pensaoAlimenticia += vrRubr;
            } else if (tpRubr === '101' && !isDesconto) {
              // Vencimentos
              if (codRubr.includes('13')) {
                rendimentos13Salario += vrRubr;
              } else {
                rendimentosTributaveis += vrRubr;
              }
            } else if (tpRubr === '104') {
              // Outros
              if (isDesconto) {
                outrasDeducoes += vrRubr;
              } else {
                rendimentosTributaveis += vrRubr;
              }
            }
          });
        }

        // Processar detPgtoFl (detalhes de pagamento)
        const infoPgtoElement = evento.querySelector('infoPgto');
        if (infoPgtoElement) {
          const detPgtoFls = infoPgtoElement.querySelectorAll('detPgtoFl');
          detPgtoFls.forEach(det => {
            const tpValor = getTextContent(det, 'tpValor');
            const vrPgto = parseFloat(getTextContent(det, 'vrPgto')) || 0;
            
            // tpValor: 1=Líquido, 4=INSS, 5=IRRF, 8=13º, 9=IRRF 13º
            if (tpValor === '1') {
              // Valor líquido - já processado acima
            } else if (tpValor === '4') {
              contribuicaoPrevidenciaria = Math.max(contribuicaoPrevidenciaria, vrPgto);
            } else if (tpValor === '5') {
              irrf = Math.max(irrf, vrPgto);
            } else if (tpValor === '8') {
              rendimentos13Salario = Math.max(rendimentos13Salario, vrPgto);
            } else if (tpValor === '9') {
              irrf13Salario = Math.max(irrf13Salario, vrPgto);
            }
          });
        }
      }

      beneficiarios.push({
        cpf: cpfBenef,
        nome: nmBenef,
        anoCalendario: perApur ? perApur.substring(0, 4) : new Date().getFullYear().toString(),
        rendimentosTributaveis,
        contribuicaoPrevidenciaria,
        irrf,
        pensaoAlimenticia,
        rendimentos13Salario,
        irrf13Salario,
        outrasDeducoes,
        rendimentosIsentos,
        planoSaude,
      });
    });

    return {
      fontePagadora,
      beneficiarios,
      perApur,
      anoCalendario: perApur ? perApur.substring(0, 4) : new Date().getFullYear().toString(),
    };

  } catch (error) {
    console.error('Erro ao processar XML:', error);
    throw error;
  }
}

/**
 * Consolidar múltiplos XMLs do mesmo beneficiário
 * @param {Array} xmlsData - Array de dados extraídos de XMLs
 * @returns {Array} - Beneficiários consolidados
 */
export function consolidarBeneficiarios(xmlsData) {
  const beneficiariosMap = new Map();

  xmlsData.forEach(xmlData => {
    xmlData.beneficiarios.forEach(benef => {
      const key = `${benef.cpf}_${benef.anoCalendario}`;
      
      if (beneficiariosMap.has(key)) {
        const existente = beneficiariosMap.get(key);
        
        // Consolidar valores
        existente.rendimentosTributaveis += benef.rendimentosTributaveis;
        existente.contribuicaoPrevidenciaria += benef.contribuicaoPrevidenciaria;
        existente.irrf += benef.irrf;
        existente.pensaoAlimenticia += benef.pensaoAlimenticia;
        existente.rendimentos13Salario += benef.rendimentos13Salario;
        existente.irrf13Salario += benef.irrf13Salario;
        existente.outrasDeducoes += benef.outrasDeducoes;
        existente.rendimentosIsentos += benef.rendimentosIsentos;
        existente.planoSaude += benef.planoSaude;
      } else {
        beneficiariosMap.set(key, { ...benef });
      }
    });
  });

  return Array.from(beneficiariosMap.values());
}

/**
 * Validar estrutura do XML eSocial
 * @param {string} xmlContent - Conteúdo do XML
 * @returns {Object} - { valido: boolean, erros: Array }
 */
export function validarXMLeSocial(xmlContent) {
  const erros = [];

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

    // Verificar erros de parsing
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      erros.push('XML inválido ou mal formatado');
      return { valido: false, erros };
    }

    // Verificar estrutura básica eSocial
    const eSocial = xmlDoc.querySelector('eSocial');
    if (!eSocial) {
      erros.push('XML não possui estrutura eSocial válida');
    }

    // Verificar evento S-1210 (aceita evtPgtos ou evtPagto)
    const eventoNovo = xmlDoc.querySelector('evtPgtos');
    const eventoAntigo = xmlDoc.querySelector('evtPagto');
    if (!eventoNovo && !eventoAntigo) {
      erros.push('XML não contém evento S-1210 (evtPgtos ou evtPagto)');
    }

    // Verificar empregador
    const ideEmpregador = xmlDoc.querySelector('ideEmpregador');
    if (!ideEmpregador) {
      erros.push('XML não contém informações do empregador (ideEmpregador)');
    } else {
      const nrInsc = getTextContent(ideEmpregador, 'nrInsc');
      if (!nrInsc) {
        erros.push('CNPJ/CPF do empregador não informado');
      }
    }

    // Verificar beneficiários
    const ideBenefs = xmlDoc.querySelectorAll('ideBenef');
    if (ideBenefs.length === 0) {
      erros.push('XML não contém informações de beneficiários');
    } else {
      ideBenefs.forEach((benef, index) => {
        const cpf = getTextContent(benef, 'cpfBenef');
        if (!cpf) {
          erros.push(`Beneficiário ${index + 1}: CPF não informado`);
        } else if (!validarCPF(cpf)) {
          erros.push(`Beneficiário ${index + 1}: CPF inválido (${cpf})`);
        }
      });
    }

    return {
      valido: erros.length === 0,
      erros
    };

  } catch (error) {
    erros.push(`Erro ao validar XML: ${error.message}`);
    return { valido: false, erros };
  }
}

/**
 * Extrair informações da fonte pagadora do XML
 * @param {Object} xmlData - Dados parseados do XML
 * @returns {Object} - Dados completos da fonte pagadora
 */
export function extrairFontePagadora(xmlData) {
  const { fontePagadora } = xmlData;
  
  return {
    cnpj: formatarCNPJ(fontePagadora.nrInsc),
    nome: 'Empresa Fonte Pagadora Ltda', // Em produção, buscar da Receita Federal
    endereco: 'Endereço não disponível no XML',
    municipio: 'Município não disponível',
    uf: 'UF',
  };
}

// ===== FUNÇÕES AUXILIARES =====

/**
 * Obter texto de um elemento XML
 */
function getTextContent(parent, tagName) {
  if (!parent) return '';
  const element = parent.querySelector(tagName);
  return element ? element.textContent.trim() : '';
}

/**
 * Formatar CNPJ
 */
function formatarCNPJ(cnpj) {
  if (!cnpj) return '';
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return cnpj;
}

/**
 * Validar CPF
 */
function validarCPF(cpf) {
  if (!cpf) return false;
  
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  // Validação dos dígitos verificadores
  let soma = 0;
  let resto;
  
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cleaned.substring(9, 10))) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cleaned.substring(10, 11))) return false;
  
  return true;
}

/**
 * Formatar CPF
 */
export function formatarCPF(cpf) {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  return cpf;
}

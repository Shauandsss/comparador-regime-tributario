import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Gerador de Comprovante de Rendimentos Pagos e de Retenção de Imposto de Renda na Fonte
 * Formato oficial da Receita Federal do Brasil
 */

/**
 * Gerar PDF do Comprovante de Rendimentos (padrão Receita Federal)
 * @param {Object} dadosBeneficiario - Dados do beneficiário e rendimentos
 * @param {Object} dadosFontePagadora - Dados da fonte pagadora
 * @returns {jsPDF} - Objeto jsPDF para download
 */
export async function gerarComprovanteIRRF(dadosBeneficiario, dadosFontePagadora) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = 10;

  // ===== TÍTULO PRINCIPAL =====
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPROVANTE DE RENDIMENTOS PAGOS E DE IMPOSTO SOBRE A RENDA RETIDO NA FONTE', pageWidth / 2, y, { align: 'center' });
  y += 6;

  // ===== CABEÇALHO COM BRASÃO =====
  const headerStartY = y;
  
  // Desenhar retângulo do cabeçalho
  doc.setLineWidth(0.5);
  doc.rect(margin, y, pageWidth - 2 * margin, 25);
  
  // Linha vertical divisória
  doc.line(margin + 60, y, margin + 60, y + 25);
  
  // Brasão da República - importar via Vite
  try {
    // Usar importação dinâmica do Vite para assets
    const brasaoModule = await import('/brasao-da-republica-do-brasil-logo-png_seeklogo-263322.png?url');
    const imgSrc = brasaoModule.default;
    
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Falha ao carregar imagem'));
      image.src = imgSrc;
    });
    doc.addImage(img, 'PNG', margin + 2, y + 2, 14, 14);
  } catch (e) {
    console.error('Erro ao carregar brasão:', e);
    // Fallback: desenhar círculo se imagem falhar
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.circle(margin + 8, y + 12, 6, 'FD');
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('BRASIL', margin + 8, y + 12, { align: 'center' });
  }
  
  // Lado esquerdo - Informações
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('MINISTÉRIO DA ECONOMIA', margin + 18, y + 5);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Secretaria Especial da Receita Federal do Brasil', margin + 18, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.text('Imposto sobre a Renda da Pessoa Física', margin + 18, y + 13);
  doc.setFontSize(8);
  doc.text('Exercício de  ' + dadosBeneficiario.anoCalendario, margin + 18, y + 19);
  
  // Lado direito - Título do comprovante
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const textoComprovante = 'Comprovante de Rendimentos Pagos e de Imposto';
  const textoRetido = 'sobre a Renda Retido na Fonte';
  const textoAno = 'Ano-calendário ' + dadosBeneficiario.anoCalendario;
  
  doc.text(textoComprovante, margin + 110, y + 8, { align: 'center' });
  doc.text(textoRetido, margin + 110, y + 12, { align: 'center' });
  doc.text(textoAno, margin + 110, y + 19, { align: 'center' });
  
  y += 27;

  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  const textoVerificacao = 'Verifique as condições e o prazo para a apresentação da Declaração de Imposto sobre a Renda da Pessoa Física para este ano-calendário no site da Secretaria';
  doc.text(textoVerificacao, margin, y);
  y += 2.5;
  doc.text('Especial da Receita Federal do Brasil na Internet, no endereço <https://www.gov.br/receitafederal/pt-br>', margin, y);
  y += 5;

  // ===== SEÇÃO 1: FONTE PAGADORA =====
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Fonte Pagadora Pessoa Jurídica ou Física', margin, y);
  y += 2;
  
  autoTable(doc, {
    startY: y,
    body: [[
      { content: 'CNPJ/CPF:', styles: { fontStyle: 'normal' } },
      { content: dadosFontePagadora.cnpj || '11.999.888/0001-01', styles: { fontStyle: 'normal' } },
      { content: 'Nome Empresarial/Nome Completo:', styles: { fontStyle: 'normal' } },
      { content: dadosFontePagadora.nome || 'ALFA SISTEMAS LTDA', styles: { fontStyle: 'normal' } }
    ]],
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1.5, lineColor: [0, 0, 0], lineWidth: 0.1 },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 60 },
      2: { cellWidth: 50 },
      3: { cellWidth: 50 }
    },
    margin: { left: margin, right: margin },
  });
  
  y = doc.lastAutoTable.finalY + 3;

  // ===== SEÇÃO 2: BENEFICIÁRIO =====
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Pessoa Física Beneficiária dos Rendimentos', margin, y);
  y += 2;
  
  autoTable(doc, {
    startY: y,
    body: [
      [
        { content: 'CPF:', styles: { fontStyle: 'normal' } },
        { content: dadosBeneficiario.cpf, styles: { fontStyle: 'normal' } },
        { content: 'Nome Completo:', styles: { fontStyle: 'normal' } },
        { content: dadosBeneficiario.nome, styles: { fontStyle: 'normal' } }
      ],
      [
        { content: 'Natureza do Rendimento', styles: { fontStyle: 'normal' } },
        { content: 'Rendimento com vínculo empregatício', colSpan: 3, styles: { fontStyle: 'normal' } }
      ]
    ],
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1, lineColor: [0, 0, 0], lineWidth: 0.1 },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 60 },
      2: { cellWidth: 50 },
      3: { cellWidth: 50 }
    },
    margin: { left: margin, right: margin },
  });
  
  y = doc.lastAutoTable.finalY + 3;

  // ===== SEÇÃO 3: RENDIMENTOS TRIBUTÁVEIS =====
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Rendimentos Tributáveis, Deduções e Imposto sobre a Renda Retido na Fonte', margin, y);
  y += 2;
  
  autoTable(doc, {
    startY: y,
    body: [
      [
        { content: '', styles: { fontStyle: 'normal' } },
        { content: 'Valores em reais', styles: { fontStyle: 'bold', halign: 'right' } }
      ],
      [
        { content: '1. Total dos rendimentos (inclusive férias)', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(dadosBeneficiario.rendimentosTributaveis), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '2. Contribuição previdenciária oficial', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(dadosBeneficiario.contribuicaoPrevidenciaria), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '3. Contribuição a entidades de previdência complementar, pública ou privada, e a Fundo de Aposentadoria Programada Individual (Fapi) (preencher também o Quadro 7)', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(0), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '4. Pensão Alimentícia (informar o beneficiário no Quadro 7)', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(dadosBeneficiario.pensaoAlimenticia || 0), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '5. Imposto sobre a Renda Retido na Fonte (IRRF)', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(dadosBeneficiario.irrf), styles: { fontStyle: 'normal', halign: 'right' } }
      ]
    ],
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 0.8, lineColor: [0, 0, 0], lineWidth: 0.1 },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 140 },
      1: { cellWidth: 40 }
    },
    margin: { left: margin, right: margin },
  });
  
  y = doc.lastAutoTable.finalY + 3;

  // ===== SEÇÃO 4: RENDIMENTOS ISENTOS =====
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('4. Rendimentos Isentos e Não Tributáveis', margin, y);
  y += 2;
  
  autoTable(doc, {
    startY: y,
    body: [
      [
        { content: '', styles: { fontStyle: 'normal' } },
        { content: 'Valores em reais', styles: { fontStyle: 'bold', halign: 'right' } }
      ],
      [
        { content: '1. Parcela isenta dos proventos de aposentadoria, reserva remunerada, reforma e pensão (65 anos ou mais), exceto a parcela isenta do 13° (décimo terceiro) salário.', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(dadosBeneficiario.rendimentosIsentos || 0), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '2. Parcela isenta do 13° salário de aposentadoria, reserva remunerada, reforma e pensão (65 anos ou mais).', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(0), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '3. Diárias e ajudas de custo.', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(0), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '4. Pensão e proventos de aposentadoria ou reforma por moléstia grave; proventos de aposentadoria ou reforma por acidente em serviço', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(0), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '5. Lucros e dividendos, apurados a partir de 1996, pagos por pessoa jurídica (lucro real, presumido ou arbitrado).', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(0), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '6. Valores pagos ao titular ou sócio da microempresa ou empresa de pequeno porte, exceto pró-labore, aluguéis ou serviços prestados', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(0), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '7. Indenizações por rescisão de contrato de trabalho, inclusive a título de PDV e por acidente de trabalho.', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(0), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '8. Juros de mora recebidos, devido pelo atraso no pagamento de remuneração por exercício de emprego, cargo ou função.', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(0), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '9. Outros (especificar)', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(0), styles: { fontStyle: 'normal', halign: 'right' } }
      ]
    ],
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 0.8, lineColor: [0, 0, 0], lineWidth: 0.1 },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 140 },
      1: { cellWidth: 40 }
    },
    margin: { left: margin, right: margin },
  });
  
  y = doc.lastAutoTable.finalY + 3;

  // ===== SEÇÃO 5: 13º SALÁRIO =====
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('5. Rendimentos Sujeitos à Tributação Exclusiva (rendimento líquido)', margin, y);
  y += 2;
  
  autoTable(doc, {
    startY: y,
    body: [
      [
        { content: '', styles: { fontStyle: 'normal' } },
        { content: 'Valores em reais', styles: { fontStyle: 'bold', halign: 'right' } }
      ],
      [
        { content: '1. 13° (décimo terceiro) salário', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(dadosBeneficiario.rendimentos13Salario || 0), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '2. Imposto sobre a Renda Retido na Fonte sobre o 13° (décimo terceiro) salário.', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(dadosBeneficiario.irrf13Salario || 0), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '3. Outros', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(0), styles: { fontStyle: 'normal', halign: 'right' } }
      ]
    ],
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 0.8, lineColor: [0, 0, 0], lineWidth: 0.1 },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 140 },
      1: { cellWidth: 40 }
    },
    margin: { left: margin, right: margin },
  });
  
  y = doc.lastAutoTable.finalY + 3;

  // ===== SEÇÃO 6: RENDIMENTOS ACUMULADOS =====
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('6. Rendimentos Recebidos Acumuladamente - Art. 12-A da Lei n° 7.713, de 1988 (sujeitos à tributação exclusiva)', margin, y);
  y += 2;
  
  autoTable(doc, {
    startY: y,
    body: [
      [
        { content: '6.1 Número do processo: (especificar)', styles: { fontStyle: 'normal' } },
        { content: 'PROC-2025-045', styles: { fontStyle: 'normal' } },
        { content: 'Quantidade de meses', styles: { fontStyle: 'normal' } },
        { content: '6', styles: { fontStyle: 'normal' } }
      ],
      [
        { content: 'Natureza do Rendimento: (especificar)', styles: { fontStyle: 'normal' } },
        { content: 'Rendimento acumulado trabalhista', colSpan: 3, styles: { fontStyle: 'normal' } }
      ]
    ],
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 0.8, lineColor: [0, 0, 0], lineWidth: 0.1 },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 },
      3: { cellWidth: 30 }
    },
    margin: { left: margin, right: margin },
  });
  
  y = doc.lastAutoTable.finalY;
  
  autoTable(doc, {
    startY: y,
    body: [
      [
        { content: '', styles: { fontStyle: 'normal' } },
        { content: 'Valores em reais', styles: { fontStyle: 'bold', halign: 'right' } }
      ],
      [
        { content: '1. Total dos rendimentos tributáveis (inclusive férias e décimo terceiro salário)', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(25000), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '2. Exclusão: Despesas com a ação judicial', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(1200), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '3. Dedução: Contribuição previdenciária oficial', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(850), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '', styles: { fontStyle: 'normal' } },
        { content: '', styles: { fontStyle: 'normal' } }
      ],
      [
        { content: '4. Dedução: Pensão Alimentícia (preencher também o Quadro 7).', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(0), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '5. Imposto sobre a Renda Retido na Fonte (IRRF).', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(1600), styles: { fontStyle: 'normal', halign: 'right' } }
      ],
      [
        { content: '6. Rendimentos isentos de pensão, proventos de aposentadoria ou reforma por moléstia grave ou aposentadoria ou reforma por acidente em serviço', styles: { fontStyle: 'normal' } },
        { content: formatarMoeda(0), styles: { fontStyle: 'normal', halign: 'right' } }
      ]
    ],
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 0.8, lineColor: [0, 0, 0], lineWidth: 0.1 },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 140 },
      1: { cellWidth: 40 }
    },
    margin: { left: margin, right: margin },
  });
  
  y = doc.lastAutoTable.finalY + 3;

  // ===== SEÇÃO 7: INFORMAÇÕES COMPLEMENTARES =====
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('7. Informações Complementares', margin, y);
  y += 2;
  
  autoTable(doc, {
    startY: y,
    body: [
      [{ content: 'Revisado e aprovado.', styles: { fontStyle: 'normal' } }]
    ],
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1, minCellHeight: 5, lineColor: [0, 0, 0], lineWidth: 0.1 },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    margin: { left: margin, right: margin },
  });
  
  y = doc.lastAutoTable.finalY + 3;

  // ===== SEÇÃO 8: RESPONSÁVEL =====
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('8. Responsável pelas Informações', margin, y);
  y += 2;
  
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  
  autoTable(doc, {
    startY: y,
    body: [
      [
        { content: 'Nome', styles: { fontStyle: 'normal', halign: 'center' } },
        { content: 'Data', styles: { fontStyle: 'normal', halign: 'center' } },
        { content: 'Assinatura', styles: { fontStyle: 'normal', halign: 'center' } }
      ],
      [
        { content: dadosFontePagadora.responsavel || 'Fernanda Souza', styles: { fontStyle: 'normal' } },
        { content: dataAtual, styles: { fontStyle: 'normal', halign: 'center' } },
        { content: '', styles: { fontStyle: 'normal' } }
      ]
    ],
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1, lineColor: [0, 0, 0], lineWidth: 0.1 },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 }
    },
    margin: { left: margin, right: margin },
  });
  
  y = doc.lastAutoTable.finalY + 1;

  // Texto de aprovação
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('Aprovado pela Instrução Normativa RFB n° 2.060, de 13 de dezembro de 2021.', margin, y);

  return doc;
}

/**
 * Formatar valor monetário
 */
function formatarMoeda(valor) {
  if (typeof valor !== 'number') return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

/**
 * Gerar múltiplos comprovantes (ZIP com PDFs)
 * @param {Array} beneficiarios - Lista de beneficiários
 * @param {Object} dadosFontePagadora - Dados da fonte pagadora
 * @returns {Array} - Array de objetos { nome, pdf }
 */
export async function gerarMultiplosComprovantes(beneficiarios, dadosFontePagadora) {
  const comprovantes = [];

  for (const benef of beneficiarios) {
    const pdf = await gerarComprovanteIRRF(benef, dadosFontePagadora);
    const nomeEmpresa = dadosFontePagadora.nome || 'EMPRESA';
    const nomeArquivo = `Comprovante_${nomeEmpresa.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 30)}_${benef.nome.split(' ')[0]}.pdf`;
    
    comprovantes.push({
      nome: nomeArquivo,
      beneficiario: benef.nome,
      cpf: benef.cpf,
      anoCalendario: benef.anoCalendario,
      pdf,
    });
  }

  return comprovantes;
}

/**
 * Download de PDF individual
 */
export function downloadPDF(pdf, nomeArquivo) {
  pdf.save(nomeArquivo);
}

/**
 * Visualizar PDF no navegador
 */
export function visualizarPDF(pdf) {
  const pdfBlob = pdf.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  window.open(url, '_blank');
}

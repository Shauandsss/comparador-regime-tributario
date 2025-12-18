import jsPDF from 'jspdf';

class PdfGenerator {
  constructor(config, summary, opportunities, answers, recommendedTools = []) {
    this.config = config;
    this.summary = summary;
    this.opportunities = opportunities;
    this.answers = answers;
    this.recommendedTools = recommendedTools;
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
    this.currentY = this.margin;
    this.lineHeight = 7;
  }

  addText(text, fontSize = 12, isBold = false, color = [0, 0, 0]) {
    this.doc.setFontSize(fontSize);
    this.doc.setFont(undefined, isBold ? 'bold' : 'normal');
    this.doc.setTextColor(...color);
    
    const lines = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin);
    
    lines.forEach(line => {
      if (this.currentY > this.pageHeight - this.margin) {
        this.doc.addPage();
        this.currentY = this.margin;
      }
      
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    });
  }

  addSpace(lines = 1) {
    this.currentY += this.lineHeight * lines;
  }

  addDivider() {
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += this.lineHeight;
  }

  addBox(text, backgroundColor, textColor) {
    const boxHeight = 15;
    this.doc.setFillColor(...backgroundColor);
    this.doc.rect(this.margin, this.currentY - 5, this.pageWidth - 2 * this.margin, boxHeight, 'F');
    
    this.doc.setTextColor(...textColor);
    this.doc.setFontSize(10);
    const lines = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin - 10);
    this.doc.text(lines, this.margin + 5, this.currentY);
    
    this.currentY += boxHeight + 5;
    this.doc.setTextColor(0, 0, 0);
  }

  generateHeader() {
    this.addText(this.config.meta.title, 20, true, [33, 150, 243]);
    this.addSpace();
    this.addText(this.config.meta.description, 11);
    this.addSpace(2);
    this.addDivider();
    this.addSpace();
  }

  generateSummary() {
    this.addText('Resumo do Diagnóstico', 16, true);
    this.addSpace();
    
    this.addText(`Total de oportunidades identificadas: ${this.summary.totalOpportunitiesFound}`, 12, true);
    this.addText(`Alta prioridade: ${this.summary.highPriority}`, 11);
    this.addText(`Média prioridade: ${this.summary.mediumPriority}`, 11);
    this.addText(`Baixa prioridade: ${this.summary.lowPriority}`, 11);
    
    this.addSpace(2);
    this.addDivider();
    this.addSpace();
  }

  generateOpportunities() {
    if (this.opportunities.length === 0) {
      this.addBox(
        'Parabéns! Não identificamos oportunidades imediatas de economia.',
        [220, 252, 231],
        [21, 128, 61]
      );
      return;
    }

    this.addText('Oportunidades Identificadas', 16, true);
    this.addSpace(2);

    this.opportunities.forEach((opp, index) => {
      // Priority badge color
      const priorityColors = {
        alta: { bg: [254, 226, 226], text: [153, 27, 27] },
        media: { bg: [254, 243, 199], text: [146, 64, 14] },
        baixa: { bg: [220, 252, 231], text: [21, 128, 61] }
      };
      
      const colors = priorityColors[opp.priority] || { bg: [243, 244, 246], text: [55, 65, 81] };

      this.addText(`${index + 1}. ${opp.title}`, 14, true);
      this.addSpace(0.5);

      // Priority
      this.doc.setFillColor(...colors.bg);
      this.doc.rect(this.margin, this.currentY - 4, 40, 7, 'F');
      this.doc.setTextColor(...colors.text);
      this.doc.setFontSize(9);
      this.doc.text(opp.priority.toUpperCase(), this.margin + 2, this.currentY);
      this.currentY += this.lineHeight;
      this.doc.setTextColor(0, 0, 0);

      this.addSpace(0.5);
      this.addText(opp.description, 11);
      this.addSpace();

      if (opp.estimatedEconomy) {
        this.addBox(
          `Economia estimada: ${opp.estimatedEconomy}`,
          [220, 252, 231],
          [21, 128, 61]
        );
      }

      if (opp.action && opp.action.length > 0) {
        this.addText('Próximos passos:', 11, true);
        opp.action.forEach(action => {
          this.addText(`• ${action}`, 10);
        });
        this.addSpace();
      }

      if (opp.source && opp.source.length > 0) {
        const sources = opp.source.map(s => {
          const sourceInfo = this.config.sources[s];
          return sourceInfo ? sourceInfo.title : s;
        }).join(', ');
        
        this.doc.setTextColor(100, 100, 100);
        this.addText(`Fontes: ${sources}`, 9);
        this.doc.setTextColor(0, 0, 0);
      }

      this.addSpace(2);
      if (index < this.opportunities.length - 1) {
        this.addDivider();
        this.addSpace();
      }
    });
  }

  generateRecommendedTools() {
    if (this.recommendedTools.length === 0) return;

    this.addSpace();
    this.addText('Ferramentas Recomendadas', 16, true);
    this.addSpace();
    
    this.addText('Use estas ferramentas do nosso site para aprofundar a análise:', 11);
    this.addSpace(2);

    this.recommendedTools.slice(0, 10).forEach((tool, index) => {
      this.addText(`• ${tool.nome}`, 11, true);
      this.addText(`  ${tool.descricao}`, 10);
      this.doc.setTextColor(33, 150, 243);
      this.addText(`  Acesse: https://comparadortributario.com.br${tool.rota}`, 9);
      this.doc.setTextColor(0, 0, 0);
      this.addSpace(0.5);
    });
  }

  generateNextSteps() {
    if (this.opportunities.length === 0) return;

    this.addSpace();
    this.addText('Próximos Passos Recomendados', 16, true);
    this.addSpace(2);

    const steps = [
      'Priorize as ações de alta prioridade para obter resultados mais rápidos.',
      'Use as ferramentas recomendadas acima para aprofundar a análise.',
      'Consulte um profissional contábil para validação das oportunidades.',
      'Implemente as mudanças e monitore os resultados ao longo do tempo.',
      'Refaça o diagnóstico periodicamente (a cada 6 meses).'
    ];

    steps.forEach((step, index) => {
      this.addText(`${index + 1}. ${step}`, 11);
      this.addSpace(0.5);
    });
  }

  generateDisclaimer() {
    this.addSpace(2);
    this.addDivider();
    this.addSpace();
    
    this.addBox(
      `AVISO LEGAL: ${this.config.meta.disclaimer}`,
      [254, 243, 199],
      [146, 64, 14]
    );
  }

  generateFooter() {
    const pageCount = this.doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(9);
      this.doc.setTextColor(150, 150, 150);
      this.doc.text(
        `Página ${i} de ${pageCount} - Gerado em ${new Date().toLocaleDateString('pt-BR')}`,
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: 'center' }
      );
    }
  }

  generate() {
    this.generateHeader();
    this.generateSummary();
    this.generateOpportunities();
    this.generateRecommendedTools();
    this.generateNextSteps();
    this.generateDisclaimer();
    this.generateFooter();

    return this.doc;
  }

  download(filename = 'diagnostico-economia-empresarial.pdf') {
    const doc = this.generate();
    doc.save(filename);
  }

  getBlob() {
    const doc = this.generate();
    return doc.output('blob');
  }
}

export default PdfGenerator;

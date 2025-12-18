import React, { useState } from 'react';
import WizardContainer from '../components/Wizard/WizardContainer';
import ReportRenderer from '../components/Wizard/ReportRenderer';
import RuleEngine from '../services/RuleEngine';
import PdfGenerator from '../services/PdfGenerator';
import { jornadaEconomiaBasicaConfig } from '../data/jornadaEconomiaBasicaConfig';

const JornadaEconomiaBasica = () => {
  const [isWizardComplete, setIsWizardComplete] = useState(false);
  const [answers, setAnswers] = useState({});
  const [evaluationResults, setEvaluationResults] = useState(null);

  const handleWizardComplete = (wizardAnswers) => {
    setAnswers(wizardAnswers);
    
    // Evaluate rules
    const ruleEngine = new RuleEngine(jornadaEconomiaBasicaConfig.rules);
    const opportunities = ruleEngine.evaluate(wizardAnswers);
    const summary = ruleEngine.getSummary(wizardAnswers, opportunities);
    const recommendedTools = ruleEngine.getRecommendedTools(opportunities, wizardAnswers);
    
    setEvaluationResults({
      summary,
      opportunities,
      recommendedTools
    });
    
    setIsWizardComplete(true);
  };

  const handleExportPdf = () => {
    if (!evaluationResults) return;
    
    // Import ferramentas to get full tool objects
    import('../data/ferramentas').then(({ ferramentas }) => {
      const toolObjects = ferramentas.filter(tool => 
        evaluationResults.recommendedTools.includes(tool.id)
      );
      
      const pdfGenerator = new PdfGenerator(
        jornadaEconomiaBasicaConfig,
        evaluationResults.summary,
        evaluationResults.opportunities,
        answers,
        toolObjects
      );
      
      pdfGenerator.download('diagnostico-rapido-economia-empresarial.pdf');
    });
  };

  const handleRestart = () => {
    if (window.confirm('Deseja reiniciar o diagnóstico? Todas as respostas serão perdidas.')) {
      localStorage.removeItem('jornada-economia-answers');
      setIsWizardComplete(false);
      setAnswers({});
      setEvaluationResults(null);
    }
  };

  return (
    <div>
      {!isWizardComplete ? (
        <WizardContainer
          config={jornadaEconomiaBasicaConfig}
          onComplete={handleWizardComplete}
        />
      ) : (
        <ReportRenderer
          summary={evaluationResults.summary}
          opportunities={evaluationResults.opportunities}
          recommendedToolIds={evaluationResults.recommendedTools}
          config={jornadaEconomiaBasicaConfig}
          onExportPdf={handleExportPdf}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default JornadaEconomiaBasica;

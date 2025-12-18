import React from 'react';
import CardRenderer from './CardRenderer';

const StepRenderer = ({ 
  step, 
  currentCardIndex, 
  answers, 
  onChange, 
  onNext, 
  onBack,
  totalCards,
  isLastCard,
  canProceed
}) => {
  const currentCard = step.cards[currentCardIndex];

  // Check if current card should be shown based on dependencies
  const shouldShowCard = (card) => {
    if (!card.dependsOn) return true;
    
    const dependentValue = answers[card.dependsOn.field];
    return dependentValue === card.dependsOn.value;
  };

  // If current card shouldn't be shown, auto-skip
  React.useEffect(() => {
    if (currentCard && !shouldShowCard(currentCard)) {
      if (currentCardIndex < step.cards.length - 1) {
        onNext();
      }
    }
  }, [currentCard, currentCardIndex]);

  if (!currentCard || !shouldShowCard(currentCard)) {
    return null;
  }

  return (
    <div className="space-y-6">
      <CardRenderer
        card={currentCard}
        value={answers[currentCard.id]}
        onChange={onChange}
      />

      <div className="flex justify-between items-center max-w-2xl mx-auto pt-8">
        <button
          onClick={onBack}
          disabled={currentCardIndex === 0}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 font-medium rounded-lg hover:bg-white hover:shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        <div className="text-center flex-1 mx-4">
          <p className="text-xs text-gray-500 font-medium">
            Pergunta {currentCardIndex + 1} de {totalCards}
          </p>
        </div>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex items-center gap-2 px-8 py-3 font-semibold rounded-lg shadow-lg transition-all ${
            isLastCard
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600`}
        >
          {isLastCard ? (
            <>
              Ver Diagnóstico
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          ) : (
            <>
              Próximo
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>

      {!canProceed && currentCard.required && (
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
            Por favor, responda esta pergunta para continuar
          </p>
        </div>
      )}
    </div>
  );
};

export default StepRenderer;

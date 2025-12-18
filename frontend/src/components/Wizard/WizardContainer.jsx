import React, { useState, useEffect } from 'react';
import StepRenderer from './StepRenderer';

const WizardContainer = ({ config, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  const currentStep = config.steps[currentStepIndex];
  const totalSteps = config.steps.length;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('jornada-economia-answers');
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved answers:', e);
      }
    }
  }, []);

  // Save to localStorage whenever answers change
  useEffect(() => {
    localStorage.setItem('jornada-economia-answers', JSON.stringify(answers));
  }, [answers]);

  const handleChange = (cardId, value) => {
    setAnswers(prev => ({ ...prev, [cardId]: value }));
  };

  const shouldShowCard = (card) => {
    if (!card.dependsOn) return true;
    const dependentValue = answers[card.dependsOn.field];
    return dependentValue === card.dependsOn.value;
  };

  const getVisibleCards = (step) => {
    return step.cards.filter(shouldShowCard);
  };

  const canProceed = () => {
    const currentCard = currentStep.cards[currentCardIndex];
    if (!currentCard) return false;
    if (!shouldShowCard(currentCard)) return true;
    if (!currentCard.required) return true;
    
    const value = answers[currentCard.id];
    return value !== undefined && value !== null && value !== '';
  };

  const handleNext = () => {
    const visibleCards = getVisibleCards(currentStep);
    const currentVisibleIndex = visibleCards.findIndex(
      card => card.id === currentStep.cards[currentCardIndex].id
    );

    // Find next visible card
    let nextCardIndex = currentCardIndex + 1;
    while (nextCardIndex < currentStep.cards.length) {
      if (shouldShowCard(currentStep.cards[nextCardIndex])) {
        setCurrentCardIndex(nextCardIndex);
        return;
      }
      nextCardIndex++;
    }

    // No more cards in this step, move to next step
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setCurrentCardIndex(0);
    } else {
      // Wizard complete
      setIsComplete(true);
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentCardIndex > 0) {
      // Find previous visible card
      let prevCardIndex = currentCardIndex - 1;
      while (prevCardIndex >= 0) {
        if (shouldShowCard(currentStep.cards[prevCardIndex])) {
          setCurrentCardIndex(prevCardIndex);
          return;
        }
        prevCardIndex--;
      }
    }

    // No more cards in this step, go to previous step
    if (currentStepIndex > 0) {
      const prevStep = config.steps[currentStepIndex - 1];
      setCurrentStepIndex(currentStepIndex - 1);
      
      // Find last visible card in previous step
      let lastVisibleIndex = prevStep.cards.length - 1;
      while (lastVisibleIndex >= 0) {
        if (shouldShowCard(prevStep.cards[lastVisibleIndex])) {
          setCurrentCardIndex(lastVisibleIndex);
          return;
        }
        lastVisibleIndex--;
      }
      setCurrentCardIndex(prevStep.cards.length - 1);
    }
  };

  const visibleCards = getVisibleCards(currentStep);
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isLastCard = currentCardIndex === currentStep.cards.length - 1 && isLastStep;
  
  // Calculate total visible cards across all steps for progress
  const totalVisibleCards = config.steps.reduce((sum, step) => {
    return sum + getVisibleCards(step).length;
  }, 0);

  const progressPercentage = ((currentStepIndex * 100) / totalSteps);

  if (isComplete) {
    return null; // Parent component will handle showing report
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {config.meta.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {config.meta.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Etapa {currentStepIndex + 1} de {totalSteps}: {currentStep.title}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-md"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mb-8 max-w-3xl mx-auto">
          {config.steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center flex-1 ${
                index < config.steps.length - 1 ? 'relative' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  index < currentStepIndex
                    ? 'bg-green-500 text-white shadow-lg'
                    : index === currentStepIndex
                    ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-200'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {index < currentStepIndex ? '✓' : index + 1}
              </div>
              <span className={`text-xs mt-2 text-center hidden md:block ${
                index === currentStepIndex ? 'font-semibold text-blue-700' : 'text-gray-600'
              }`}>
                {step.title}
              </span>
              {index < config.steps.length - 1 && (
                <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 ${
                  index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        {currentStepIndex === 0 && currentCardIndex === 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 mb-8 rounded-lg shadow-sm">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-yellow-900 mb-1">Aviso Importante</p>
                <p className="text-sm text-yellow-800">{config.meta.disclaimer}</p>
              </div>
            </div>
          </div>
        )}        <StepRenderer
          step={currentStep}
          currentCardIndex={currentCardIndex}
          answers={answers}
          onChange={handleChange}
          onNext={handleNext}
          onBack={handleBack}
          totalCards={currentStep.cards.length}
          isLastCard={isLastCard}
          canProceed={canProceed()}
        />
      </div>
    </div>
  );
};

export default WizardContainer;

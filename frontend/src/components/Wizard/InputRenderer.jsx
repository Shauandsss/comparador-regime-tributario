import React from 'react';

const InputRenderer = ({ card, value, onChange, disabled }) => {
  const handleChange = (e) => {
    const newValue = card.type === 'number' 
      ? parseFloat(e.target.value) || 0
      : card.type === 'boolean'
      ? e.target.value === 'true'
      : e.target.value;
    
    onChange(card.id, newValue);
  };

  const handleBooleanButton = (boolValue) => {
    onChange(card.id, boolValue);
  };

  const renderInput = () => {
    switch (card.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={handleChange}
            placeholder={card.placeholder || ''}
            disabled={disabled}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={handleChange}
            placeholder={card.placeholder || '0'}
            disabled={disabled}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            <option value="">Selecione uma opção</option>
            {card.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleBooleanButton(true)}
              disabled={disabled}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                value === true
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => handleBooleanButton(false)}
              disabled={disabled}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                value === false
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Não
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-lg font-semibold text-gray-800">
        {card.label}
        {card.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
    </div>
  );
};

export default InputRenderer;

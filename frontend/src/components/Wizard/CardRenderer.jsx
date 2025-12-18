import React from 'react';
import InputRenderer from './InputRenderer';

const CardRenderer = ({ card, value, onChange, disabled }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <InputRenderer
        card={card}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default CardRenderer;

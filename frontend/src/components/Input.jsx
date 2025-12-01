/**
 * Componente de Input reutilizável
 */
import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  disabled = false,
  min,
  step,
  name
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm md:text-base font-bold mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        step={step}
        className={`
          w-full px-3 md:px-4 py-2.5 md:py-3 border rounded-lg focus:outline-none focus:ring-2 
          text-sm md:text-base
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-blue-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          transition duration-200
        `}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;

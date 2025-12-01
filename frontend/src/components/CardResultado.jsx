/**
 * Card de Resultado Individual
 */
import React from 'react';

const CardResultado = ({ 
  regime, 
  valor, 
  aliquota,
  destaque = false,
  detalhes,
  cor = 'blue'
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const colorClasses = {
    blue: 'border-blue-500 text-blue-600',
    purple: 'border-purple-500 text-purple-600',
    orange: 'border-orange-500 text-orange-600'
  };

  const borderClass = destaque ? 'border-green-500' : colorClasses[cor]?.split(' ')[0] || 'border-gray-200';
  const textClass = destaque ? 'text-green-600' : colorClasses[cor]?.split(' ')[1] || 'text-gray-800';

  return (
    <div 
      className={`
        relative bg-white rounded-xl shadow-lg p-4 md:p-6 transition-all duration-300 hover:shadow-xl
        ${destaque ? `border-4 ${borderClass} md:transform md:scale-105` : `border-2 ${borderClass}`}
      `}
    >
      {destaque && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-500 text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold shadow-lg whitespace-nowrap">
            🏆 Melhor Opção
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className={`text-lg md:text-xl font-bold mb-2 ${destaque ? 'text-green-600' : textClass}`}>
          {regime}
        </h3>
        
        <div className="my-4">
          <p className="text-xs md:text-sm text-gray-500 mb-1">Imposto Total</p>
          <p className={`text-2xl md:text-3xl font-bold ${destaque ? 'text-green-600' : textClass}`}>
            {formatCurrency(valor)}
          </p>
        </div>

        {aliquota && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs md:text-sm text-gray-600">
              Alíquota Efetiva: <span className="font-semibold">{aliquota.toFixed(2)}%</span>
            </p>
          </div>
        )}

        {detalhes && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button 
              onClick={() => alert(JSON.stringify(detalhes, null, 2))}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver Detalhes →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardResultado;

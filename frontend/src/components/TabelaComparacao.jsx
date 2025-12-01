/**
 * Tabela de Comparação entre Regimes
 */
import React from 'react';

const TabelaComparacao = ({ dados, ranking }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getMedalha = (posicao) => {
    const medalhas = {
      1: '🥇',
      2: '🥈',
      3: '🥉'
    };
    return medalhas[posicao] || posicao;
  };

  const regimeColors = {
    'Simples Nacional': 'bg-blue-50 border-blue-200',
    'Lucro Presumido': 'bg-purple-50 border-purple-200',
    'Lucro Real': 'bg-orange-50 border-orange-200'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">📊 Comparação Detalhada</h2>
        <p className="text-blue-100 mt-1 text-sm md:text-base">Análise dos três regimes tributários</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Ranking
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Regime Tributário
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Imposto Total
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ranking && ranking.map((item) => (
              <tr 
                key={item.regime}
                className={`
                  transition-colors duration-200 hover:bg-gray-50
                  ${regimeColors[item.regime] || ''}
                  ${item.posicao === 1 ? 'border-l-4 border-green-500' : ''}
                `}
              >
                <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-xl md:text-2xl">{getMedalha(item.posicao)}</span>
                    <span className="ml-2 text-xs md:text-sm font-medium text-gray-700">
                      {item.posicao}º
                    </span>
                  </div>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                  <div className="text-xs md:text-sm font-bold text-gray-900">{item.regime}</div>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-right">
                  <div className={`text-base md:text-lg font-bold ${item.posicao === 1 ? 'text-green-600' : 'text-gray-900'}`}>
                    {formatCurrency(item.impostoTotal)}
                  </div>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-center">
                  {item.posicao === 1 && (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Mais Econômico
                    </span>
                  )}
                  {item.posicao === 3 && (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Mais Caro
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dados && dados.economia && (
        <div className="bg-green-50 border-t-2 border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-green-800">💰 Economia Potencial</h3>
              <p className="text-sm text-green-600 mt-1">
                Comparado com: {dados.economia.comparadoCom}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(dados.economia.valor)}
              </p>
              <p className="text-sm text-green-700 font-semibold mt-1">
                {dados.economia.percentual}% de economia
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabelaComparacao;

/**
 * Página de Resultado - Exibição da Comparação
 */
import { useNavigate } from 'react-router-dom';
import { useComparadorStore } from '../hooks/useAppStore';
import CardResultado from '../components/CardResultado';
import TabelaComparacao from '../components/TabelaComparacao';

function Resultado() {
  const navigate = useNavigate();
  const { resultado, entrada, clearAll } = useComparadorStore();

  // Debug
  console.log('🔍 Estado do resultado:', resultado);
  console.log('🔍 Estado da entrada:', entrada);

  // Redirecionar se não houver resultado
  if (!resultado || !resultado.regimes) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <span className="text-yellow-500 text-3xl mr-4">⚠️</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Nenhum resultado encontrado
              </h2>
              <p className="text-gray-700 mb-4">
                Por favor, preencha o formulário primeiro para calcular a comparação.
              </p>
              <button
                onClick={() => navigate('/formulario')}
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
              >
                Ir para o Formulário
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { regimes, melhor_opcao, economia } = resultado;

  const handleNovaConsulta = () => {
    clearAll();
    navigate('/formulario');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              ✅ Comparação de Regimes Tributários
            </h1>
            <p className="text-green-100">
              Resultados baseados na receita bruta de R$ {entrada?.rbt12?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-200 mb-1">Melhor Opção</p>
            <p className="text-2xl font-bold">
              🏆 {melhor_opcao === 'simples' ? 'Simples Nacional' : 
                   melhor_opcao === 'presumido' ? 'Lucro Presumido' : 
                   'Lucro Real'}
            </p>
          </div>
        </div>
      </div>

      {/* Cards dos Regimes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CardResultado
          regime="Simples Nacional"
          valor={regimes.simples.imposto_total}
          aliquota={regimes.simples.aliquota_efetiva}
          detalhes={regimes.simples.detalhes}
          destaque={melhor_opcao === 'simples'}
          cor="blue"
        />
        <CardResultado
          regime="Lucro Presumido"
          valor={regimes.presumido.imposto_total}
          aliquota={regimes.presumido.aliquota_efetiva}
          detalhes={regimes.presumido.detalhes}
          destaque={melhor_opcao === 'presumido'}
          cor="purple"
        />
        <CardResultado
          regime="Lucro Real"
          valor={regimes.real.imposto_total}
          aliquota={regimes.real.aliquota_efetiva}
          detalhes={regimes.real.detalhes}
          destaque={melhor_opcao === 'real'}
          cor="orange"
        />
      </div>

      {/* Tabela de Comparação */}
      <div className="mb-8">
        <TabelaComparacao 
          regimes={regimes}
          melhorOpcao={melhor_opcao}
        />
      </div>

      {/* Economia */}
      {economia && economia.valor > 0 && (
        <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 mb-8">
          <div className="flex items-center">
            <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl mr-6">
              💰
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Economia Potencial
              </h3>
              <p className="text-gray-700">
                Escolhendo <span className="font-bold text-green-700">
                  {melhor_opcao === 'simples' ? 'Simples Nacional' : 
                   melhor_opcao === 'presumido' ? 'Lucro Presumido' : 
                   'Lucro Real'}
                </span> ao invés de{' '}
                <span className="font-bold text-red-600">
                  {economia.regime_comparado === 'simples' ? 'Simples Nacional' : 
                   economia.regime_comparado === 'presumido' ? 'Lucro Presumido' : 
                   'Lucro Real'}
                </span>, você economiza:
              </p>
              <div className="flex items-baseline gap-4 mt-3">
                <p className="text-4xl font-bold text-green-600">
                  R$ {economia.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-2xl font-bold text-green-700">
                  ({economia.percentual?.toFixed(2)}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informações Detalhadas */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <span className="text-blue-600 mr-2">ℹ️</span>
          Informações dos Dados Fornecidos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Receita Bruta (12 meses)</p>
            <p className="font-bold text-gray-800">
              R$ {entrada?.rbt12?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Atividade</p>
            <p className="font-bold text-gray-800 capitalize">
              {entrada?.atividade === 'comercio' ? '🏪 Comércio' :
               entrada?.atividade === 'industria' ? '🏭 Indústria' :
               '💼 Serviço'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Folha de Pagamento</p>
            <p className="font-bold text-gray-800">
              R$ {entrada?.folha?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Despesas Dedutíveis</p>
            <p className="font-bold text-gray-800">
              R$ {entrada?.despesas?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </p>
          </div>
        </div>
      </div>

      {/* Observações */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <span className="text-yellow-600 mr-2">⚠️</span>
          Observações Importantes
        </h3>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Este cálculo é uma <strong>simulação simplificada</strong> e não substitui a análise de um contador profissional.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Os valores reais podem variar de acordo com <strong>legislação vigente</strong>, benefícios fiscais, e características específicas do negócio.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Para uma decisão definitiva, consulte um <strong>contador especializado</strong> em planejamento tributário.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Considere também fatores como <strong>obrigações acessórias</strong>, complexidade contábil, e regime de caixa vs competência.</span>
          </li>
        </ul>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-4">
        <button
          onClick={handleNovaConsulta}
          className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
        >
          🔄 Nova Consulta
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 bg-gray-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-gray-700 transition shadow-lg"
        >
          🖨️ Imprimir Resultado
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          ← Voltar ao Início
        </button>
      </div>
    </div>
  );
}

export default Resultado;

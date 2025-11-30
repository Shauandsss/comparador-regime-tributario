/**
 * Página Home - Landing Page
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Home() {
  const navigate = useNavigate();
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await api.get('/status');
      setApiStatus(response.data.ok ? 'online' : 'offline');
    } catch (error) {
      console.error('Erro ao verificar status da API:', error);
      setApiStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-12 mb-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            📊 Comparador Tributário
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Descubra qual regime tributário é mais vantajoso para sua empresa!
            Compare Simples Nacional, Lucro Presumido e Lucro Real em segundos.
          </p>
          <button 
            onClick={() => navigate('/formulario')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg transform hover:scale-105"
          >
            🚀 Iniciar Comparação
          </button>
        </div>
      </div>

      {/* Status da API */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              Status do Sistema
            </h2>
            <p className="text-sm text-gray-600">
              Verifique se a API está respondendo
            </p>
          </div>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-gray-600">Verificando...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className={`inline-block w-4 h-4 rounded-full ${
                apiStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></span>
              <span className={`font-bold text-lg ${
                apiStatus === 'online' ? 'text-green-600' : 'text-red-600'
              }`}>
                {apiStatus === 'online' ? '✓ Online' : '✗ Offline'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Cards dos Regimes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border-2 border-blue-200 rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1">
          <div className="text-4xl mb-3">🏢</div>
          <h3 className="font-bold text-xl mb-2 text-blue-800">Simples Nacional</h3>
          <p className="text-gray-600 mb-4">
            Regime simplificado com alíquotas progressivas. Ideal para micro e pequenas empresas.
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>✓ Unificação de tributos</li>
            <li>✓ Menos burocracia</li>
            <li>✓ Alíquotas de 4% a 33%</li>
          </ul>
        </div>

        <div className="bg-white border-2 border-purple-200 rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1">
          <div className="text-4xl mb-3">📈</div>
          <h3 className="font-bold text-xl mb-2 text-purple-800">Lucro Presumido</h3>
          <p className="text-gray-600 mb-4">
            Tributação baseada em margem de lucro presumida pela Receita Federal.
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>✓ Cálculo simplificado</li>
            <li>✓ Presunção de 8% a 32%</li>
            <li>✓ Ideal para margens altas</li>
          </ul>
        </div>

        <div className="bg-white border-2 border-orange-200 rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1">
          <div className="text-4xl mb-3">💼</div>
          <h3 className="font-bold text-xl mb-2 text-orange-800">Lucro Real</h3>
          <p className="text-gray-600 mb-4">
            Tributação sobre o lucro líquido efetivamente apurado pela contabilidade.
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>✓ Lucro efetivo</li>
            <li>✓ Compensação de prejuízos</li>
            <li>✓ Créditos fiscais</li>
          </ul>
        </div>
      </div>

      {/* Como Funciona */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🎯 Como Funciona?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-bold mb-2">Preencha os Dados</h3>
            <p className="text-sm text-gray-600">
              Informe receita, despesas e tipo de atividade
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">2</span>
            </div>
            <h3 className="font-bold mb-2">Calcule Automaticamente</h3>
            <p className="text-sm text-gray-600">
              Nosso sistema calcula os três regimes instantaneamente
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">3</span>
            </div>
            <h3 className="font-bold mb-2">Compare e Decida</h3>
            <p className="text-sm text-gray-600">
              Veja qual regime economiza mais impostos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

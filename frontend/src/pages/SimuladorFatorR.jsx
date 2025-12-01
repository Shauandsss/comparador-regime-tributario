/**
 * Simulador do Fator R
 * Determina se empresa cai no Anexo III ou V do Simples Nacional
 */
import { useState } from 'react';
import axios from 'axios';

function SimuladorFatorR() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  
  const [formData, setFormData] = useState({
    folha12: '',
    rbt12: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (erro) setErro(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setResultado(null);
    
    try {
      const response = await axios.get('http://localhost:3001/simples/fator-r', {
        params: {
          folha12: formData.folha12,
          rbt12: formData.rbt12
        }
      });
      
      setResultado(response.data);
    } catch (error) {
      console.error('Erro ao calcular Fator R:', error);
      setErro(error.response?.data?.erro || 'Erro ao calcular Fator R. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const limparFormulario = () => {
    setFormData({
      folha12: '',
      rbt12: ''
    });
    setResultado(null);
    setErro(null);
  };

  // Componente Gauge (Medidor visual)
  const Gauge = ({ percentual, cor }) => {
    const angle = Math.min((percentual / 50) * 180, 180); // 50% = 180 graus
    const needleRotation = angle - 90; // Ajuste para começar da esquerda
    
    return (
      <div className="relative w-64 h-32 mx-auto">
        {/* Arco do gauge */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          {/* Background arc */}
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Colored arc */}
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke={cor}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${(angle / 180) * 251.2} 251.2`}
          />
          {/* Needle */}
          <g transform={`rotate(${needleRotation} 100 80)`}>
            <line
              x1="100"
              y1="80"
              x2="100"
              y2="20"
              stroke="#1F2937"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="80" r="6" fill="#1F2937" />
          </g>
          {/* Marcador 28% */}
          <g transform="rotate(-39.6 100 80)">
            <line x1="100" y1="20" x2="100" y2="30" stroke="#059669" strokeWidth="3" />
          </g>
        </svg>
        
        {/* Labels */}
        <div className="absolute bottom-0 left-0 text-xs text-gray-600 font-semibold">0%</div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-sm text-green-600 font-bold">
          28%
        </div>
        <div className="absolute bottom-0 right-0 text-xs text-gray-600 font-semibold">50%+</div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl shadow-xl p-6 md:p-8 mb-6 md:mb-8 text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          📐 Simulador do Fator R
        </h1>
        <p className="text-purple-100 text-sm md:text-lg">
          Descubra se sua empresa se enquadra no Anexo III ou Anexo V do Simples Nacional
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5 md:mb-6 flex items-center gap-2">
            <span className="text-2xl md:text-3xl">📝</span>
            Dados para Cálculo
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* Folha 12 meses */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Folha de Salários (12 meses) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">R$</span>
                <input
                  type="number"
                  name="folha12"
                  value={formData.folha12}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="0,00"
                  step="0.01"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total de salários + encargos pagos nos últimos 12 meses
              </p>
            </div>

            {/* RBT12 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Receita Bruta Total (12 meses) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">R$</span>
                <input
                  type="number"
                  name="rbt12"
                  value={formData.rbt12}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="0,00"
                  step="0.01"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Soma do faturamento dos últimos 12 meses
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Calculando...
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🚀</span>
                    Calcular Fator R
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={limparFormulario}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Limpar
              </button>
            </div>
          </form>

          {/* Erro */}
          {erro && (
            <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-red-800 mb-1">Erro no Cálculo</h3>
                  <p className="text-sm text-red-600">{erro}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
            <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              O que é o Fator R?
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              O Fator R é um cálculo que determina em qual anexo do Simples Nacional sua empresa de serviços será tributada.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700"><strong>Fator R ≥ 28%</strong> → Anexo III (alíquotas mais baixas)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">✗</span>
                <span className="text-gray-700"><strong>Fator R &lt; 28%</strong> → Anexo V (alíquotas mais altas)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {resultado ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-3xl">📊</span>
                Resultado da Análise
              </h2>

              {/* Gauge Visual */}
              <div className="mb-8">
                <Gauge 
                  percentual={parseFloat(resultado.calculo.fatorRPercentual)} 
                  cor={resultado.analise.corIndicador}
                />
                <div className="text-center mt-4">
                  <div className="text-5xl font-black mb-2" style={{ color: resultado.analise.corIndicador }}>
                    {resultado.calculo.fatorRPercentual}
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    {resultado.analise.situacao}
                  </div>
                </div>
              </div>

              {/* Anexo Resultante */}
              <div className={`rounded-2xl p-6 mb-6 ${
                resultado.anexo.enquadraAnexoIII 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                  : 'bg-gradient-to-br from-orange-500 to-red-600'
              } text-white shadow-xl`}>
                <div className="text-sm font-semibold mb-2 opacity-90">
                  Anexo Aplicável
                </div>
                <div className="text-4xl font-black mb-3">
                  {resultado.anexo.nomeAtual}
                </div>
                <div className="text-sm opacity-90 mb-4">
                  {resultado.anexo.descricaoAtual}
                </div>
                <div className="flex items-center justify-between bg-white bg-opacity-20 rounded-lg p-3">
                  <span className="text-sm">Alíquota Inicial:</span>
                  <span className="font-bold text-xl">
                    {resultado.anexo.enquadraAnexoIII 
                      ? resultado.anexo.aliquotaInicialAnexoIII 
                      : resultado.anexo.aliquotaInicialAnexoV}
                  </span>
                </div>
              </div>

              {/* Recomendação */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">💬</span>
                  Recomendação
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {resultado.analise.recomendacao}
                </p>
              </div>

              {/* Ação Sugerida */}
              {!resultado.acoes.jaNaFaixaIdeal && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5 mb-6">
                  <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    Para Atingir o Anexo III (28%)
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Folha Ideal:</span>
                      <span className="font-bold text-yellow-900">
                        {resultado.acoes.folhaIdealPara28Formatado}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">
                        {resultado.acoes.precisaAumentar ? 'Aumentar em:' : 'Reduzir em:'}
                      </span>
                      <span className="font-bold text-yellow-900">
                        {resultado.acoes.diferencaFolhaFormatado}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Economia */}
              {resultado.economia.estaNoAnexoMaisVantajoso && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 mb-6">
                  <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">💰</span>
                    Economia Estimada
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-black text-green-600 mb-2">
                      {resultado.economia.economiaAnualEstimadaFormatado}
                    </div>
                    <div className="text-sm text-gray-700">
                      Economia anual estimada vs. Anexo V
                    </div>
                  </div>
                </div>
              )}

              {/* Cenários */}
              {resultado.cenarios && resultado.cenarios.length > 0 && (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">🔮</span>
                    Simulação de Cenários
                  </h3>
                  <div className="space-y-3">
                    {resultado.cenarios.map((cenario, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          cenario.vantajoso 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-orange-50 border-orange-300'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-900">
                            Fator R: {cenario.percentual}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            cenario.vantajoso 
                              ? 'bg-green-600 text-white' 
                              : 'bg-orange-600 text-white'
                          }`}>
                            {cenario.anexo}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700">
                          Folha necessária: <strong>{cenario.folhaNecessaria}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📐</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Aguardando Cálculo
              </h3>
              <p className="text-gray-600">
                Preencha o formulário ao lado e clique em "Calcular Fator R"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cards Explicativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Anexo III */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <span className="text-4xl">✅</span>
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-800">Anexo III</h3>
              <p className="text-sm text-green-600">Fator R ≥ 28%</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Empresas de serviços com folha de salários igual ou superior a 28% da receita bruta. 
            Tributação mais favorável com alíquotas iniciais a partir de <strong>6%</strong>.
          </p>
          <div className="bg-green-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">1ª Faixa:</span>
              <span className="font-bold text-green-700">6,00%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Até:</span>
              <span className="font-bold text-green-700">R$ 180.000</span>
            </div>
          </div>
        </div>

        {/* Anexo V */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-orange-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <span className="text-4xl">⚠️</span>
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-800">Anexo V</h3>
              <p className="text-sm text-orange-600">Fator R &lt; 28%</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Empresas de serviços com folha de salários inferior a 28% da receita bruta. 
            Tributação menos favorável com alíquotas iniciais a partir de <strong>15,5%</strong>.
          </p>
          <div className="bg-orange-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">1ª Faixa:</span>
              <span className="font-bold text-orange-700">15,50%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Até:</span>
              <span className="font-bold text-orange-700">R$ 180.000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimuladorFatorR;

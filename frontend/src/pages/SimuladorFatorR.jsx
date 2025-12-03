/**
 * Simulador do Fator R
 * Determina se empresa cai no Anexo III ou V do Simples Nacional
 */
import { useState } from 'react';

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
      // Validações
      const folha12 = parseFloat(formData.folha12);
      const rbt12 = parseFloat(formData.rbt12);

      if (isNaN(folha12) || isNaN(rbt12) || folha12 < 0 || rbt12 <= 0) {
        throw new Error('Por favor, preencha todos os campos com valores válidos');
      }

      // Cálculo do Fator R
      const fatorR = folha12 / rbt12;
      const fatorRPercentual = fatorR * 100;
      
      // Determinação do Anexo
      const limiteAnexoIII = 0.28;
      const enquadraAnexoIII = fatorR >= limiteAnexoIII;
      const anexoAplicavel = enquadraAnexoIII ? 'ANEXO_III' : 'ANEXO_V';
      
      // Cálculo de quanto falta ou sobra para mudar de anexo
      const diferencaParaLimite = fatorR - limiteAnexoIII;
      const diferencaPercentual = diferencaParaLimite * 100;
      
      // Calcular quanto precisa aumentar/diminuir a folha para atingir 28%
      const folhaIdealPara28 = rbt12 * limiteAnexoIII;
      const diferencaFolha = folhaIdealPara28 - folha12;
      
      // Análise da situação
      let situacao = '';
      let recomendacao = '';
      let nivelRisco = '';
      let corIndicador = '';
      
      if (fatorRPercentual < 20) {
        situacao = 'Muito Abaixo';
        recomendacao = 'Empresa está longe do Anexo III. Considere aumentar a folha de salários se houver possibilidade de redução tributária.';
        nivelRisco = 'baixo';
        corIndicador = '#EF4444';
      } else if (fatorRPercentual < 26) {
        situacao = 'Abaixo';
        recomendacao = 'Próximo ao limite! Considere aumentar estrategicamente a folha de salários para atingir o Anexo III e reduzir a carga tributária.';
        nivelRisco = 'medio';
        corIndicador = '#F59E0B';
      } else if (fatorRPercentual < 28) {
        situacao = 'Quase Lá';
        recomendacao = 'Muito próximo! Pequenos ajustes na folha podem enquadrar no Anexo III. Consulte um contador para análise detalhada.';
        nivelRisco = 'atencao';
        corIndicador = '#FBBF24';
      } else if (fatorRPercentual < 32) {
        situacao = 'Enquadrado (Limite)';
        recomendacao = 'Enquadrado no Anexo III, mas próximo ao limite. Mantenha a folha de salários estável para não perder o benefício.';
        nivelRisco = 'atencao';
        corIndicador = '#84CC16';
      } else {
        situacao = 'Enquadrado (Confortável)';
        recomendacao = 'Confortavelmente enquadrado no Anexo III. Você tem margem de segurança para variações na folha de salários.';
        nivelRisco = 'otimo';
        corIndicador = '#22C55E';
      }
      
      // Economia potencial estimada
      const economiaPotencialPercentual = enquadraAnexoIII ? 9.5 : 0;
      const economiaAnualEstimada = rbt12 * (economiaPotencialPercentual / 100);
      
      // Cenários
      const percentuais = [20, 24, 28, 32, 36];
      const cenarios = percentuais.map(percentual => {
        const folhaSimulada = rbt12 * (percentual / 100);
        const fatorSimulado = folhaSimulada / rbt12;
        const anexoSimulado = fatorSimulado >= 0.28 ? 'Anexo III' : 'Anexo V';
        
        return {
          percentual: percentual + '%',
          folhaNecessaria: folhaSimulada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          folhaNecessariaNumero: folhaSimulada,
          diferencaParaAtual: Math.abs(folhaSimulada - folha12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          precisaAumentar: folhaSimulada > folha12,
          anexo: anexoSimulado,
          vantajoso: fatorSimulado >= 0.28
        };
      });
      
      const resultado = {
        sucesso: true,
        calculo: {
          folha12,
          folha12Formatado: folha12.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          rbt12,
          rbt12Formatado: rbt12.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          fatorR: fatorR.toFixed(4),
          fatorRPercentual: fatorRPercentual.toFixed(2) + '%',
          fatorRDecimal: fatorR
        },
        anexo: {
          atual: anexoAplicavel,
          nomeAtual: anexoAplicavel === 'ANEXO_III' ? 'Anexo III' : 'Anexo V',
          descricaoAtual: anexoAplicavel === 'ANEXO_III' 
            ? 'Serviços com folha de salários ≥ 28% da receita'
            : 'Serviços com folha de salários < 28% da receita',
          enquadraAnexoIII,
          limiteAnexoIII: '28%',
          aliquotaInicialAnexoIII: '6%',
          aliquotaInicialAnexoV: '15.5%'
        },
        analise: {
          situacao,
          recomendacao,
          nivelRisco,
          corIndicador,
          diferencaParaLimite: diferencaParaLimite.toFixed(4),
          diferencaPercentual: diferencaPercentual.toFixed(2) + '%',
          diferencaPercentualNumero: diferencaPercentual
        },
        acoes: {
          folhaIdealPara28: folhaIdealPara28.toFixed(2),
          folhaIdealPara28Formatado: folhaIdealPara28.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          diferencaFolha: diferencaFolha.toFixed(2),
          diferencaFolhaFormatado: Math.abs(diferencaFolha).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          precisaAumentar: diferencaFolha > 0,
          precisaDiminuir: diferencaFolha < 0,
          jaNaFaixaIdeal: Math.abs(diferencaFolha) < 100
        },
        economia: {
          estaNoAnexoMaisVantajoso: enquadraAnexoIII,
          economiaPotencialPercentual: economiaPotencialPercentual + '%',
          economiaAnualEstimada: economiaAnualEstimada.toFixed(2),
          economiaAnualEstimadaFormatado: economiaAnualEstimada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          economiaAproveitada: enquadraAnexoIII
        },
        cenarios
      };
      
      setResultado(resultado);
    } catch (error) {
      console.error('Erro ao calcular Fator R:', error);
      setErro(error.message || 'Erro ao calcular Fator R. Verifique os dados e tente novamente.');
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
      <div className="relative w-64 h-40 mx-auto overflow-visible">
        {/* Arco do gauge */}
        <svg className="w-full h-full overflow-visible" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet">
          {/* Background arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Colored arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke={cor}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${(angle / 180) * 251.2} 251.2`}
          />
          {/* Needle */}
          <g transform={`rotate(${needleRotation} 100 90)`}>
            <line
              x1="100"
              y1="90"
              x2="100"
              y2="25"
              stroke="#1F2937"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="90" r="6" fill="#1F2937" />
          </g>
          {/* Marcador 28% */}
          <g transform="rotate(-39.6 100 90)">
            <line x1="100" y1="25" x2="100" y2="35" stroke="#059669" strokeWidth="3" />
          </g>
        </svg>
        
        {/* Labels */}
        <div className="absolute bottom-2 left-0 text-xs text-gray-600 font-semibold">0%</div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-green-600 font-bold">
          28%
        </div>
        <div className="absolute bottom-2 right-0 text-xs text-gray-600 font-semibold">50%+</div>
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

      {/* Artigo SEO */}
      <article className="max-w-4xl mx-auto mt-12 prose prose-lg prose-slate">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Fator R: O Que É, Como Calcular e Por Que Ele Define Seus Impostos no Simples Nacional
        </h2>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Introdução</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Se você tem uma empresa de serviços enquadrada no Simples Nacional, certamente já ouviu falar do <strong>Fator R</strong>. 
            Esse cálculo aparentemente simples pode representar a diferença entre pagar <strong>6% ou 15,5%</strong> de impostos sobre seu faturamento inicial. 
            Parece exagero? Não é. A regra do Fator R é uma das mais impactantes do Simples Nacional e pode gerar economias (ou custos extras) de 
            <strong>dezenas de milhares de reais por ano</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            O Fator R determina se sua empresa será tributada pelo <strong>Anexo III</strong> (alíquotas menores, começando em 6%) ou pelo 
            <strong>Anexo V</strong> (alíquotas maiores, começando em 15,5%). A diferença está na proporção entre a folha de salários e a receita bruta: 
            quanto mais você investe em colaboradores (e, portanto, em encargos trabalhistas), maior será seu Fator R — e mais favorável será sua tributação.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Neste guia completo, vamos explicar <strong>o que é o Fator R, como calculá-lo, por que ele é tão importante, quais erros evitar e 
            como planejar sua folha de pagamento</strong> para maximizar essa vantagem fiscal de forma legal e estratégica.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Como Calcular o Fator R</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            O cálculo do Fator R é direto, mas exige atenção aos detalhes e ao período correto de apuração. A fórmula oficial é:
          </p>
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg my-6">
            <p className="font-mono text-lg text-gray-900 mb-2">
              <strong>Fator R = (Folha de Salários dos últimos 12 meses / Receita Bruta dos últimos 12 meses) × 100</strong>
            </p>
            <p className="text-sm text-gray-600 mt-3">
              O resultado é um percentual. Se for <strong>≥ 28%</strong>, você se enquadra no <strong>Anexo III</strong>. 
              Se for <strong>&lt; 28%</strong>, sua empresa será tributada pelo <strong>Anexo V</strong>.
            </p>
          </div>

          <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">O que entra na Folha de Salários?</h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            A Lei Complementar 123/2006 define o que compõe a folha de salários para fins do Fator R. Devem ser incluídos:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>Salários pagos aos empregados (incluindo sócios com vínculo empregatício CLT)</li>
            <li>Retiradas de pró-labore dos sócios</li>
            <li>Encargos sociais: INSS patronal (parte empresa), FGTS, contribuição sobre RAT (Risco Ambiental do Trabalho)</li>
            <li>13º salário e férias proporcionais (valores pagos no período)</li>
            <li>Salário-família e outros adicionais legais pagos ao trabalhador</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Atenção:</strong> Não entram no cálculo valores pagos a terceiros (PJ), comissionistas sem vínculo empregatício, 
            fornecedores externos e estagiários (exceto quando há vínculo trabalhista reconhecido).
          </p>

          <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">O que entra na Receita Bruta?</h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            A receita bruta é a soma de todo o faturamento da empresa nos últimos 12 meses, <strong>antes de deduções ou abatimentos</strong>. 
            Inclui todas as vendas de produtos, prestação de serviços e demais receitas operacionais. Devoluções, cancelamentos e descontos 
            incondicionais podem ser excluídos conforme a legislação.
          </p>

          <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">Período de apuração: últimos 12 meses</h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            O Fator R é calculado mês a mês, sempre considerando os <strong>12 meses imediatamente anteriores</strong> ao período de apuração (PA). 
            Por exemplo, se você está apurando o DAS de <strong>janeiro/2025</strong>, o cálculo do Fator R considera a folha e a receita 
            acumuladas de <strong>janeiro/2024 a dezembro/2024</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Essa janela móvel de 12 meses faz com que o Fator R <strong>varie ao longo do ano</strong>, especialmente se houver mudanças 
            na estrutura da folha ou sazonalidades no faturamento.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Exemplos Práticos de Cálculo do Fator R</h3>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-3">✅ Exemplo 1: Empresa Qualificada para o Anexo III</h4>
            <p className="text-gray-700 mb-3">
              <strong>Dados:</strong> Uma consultoria de TI teve receita bruta de <strong>R$ 800.000</strong> nos últimos 12 meses e 
              folha de salários (incluindo pró-labore e encargos) de <strong>R$ 240.000</strong> no mesmo período.
            </p>
            <div className="bg-green-50 rounded-lg p-4 mb-3">
              <p className="font-mono text-gray-900">
                Fator R = (R$ 240.000 / R$ 800.000) × 100 = <strong>30%</strong>
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              <strong>Resultado:</strong> Como 30% ≥ 28%, a empresa se enquadra no <strong>Anexo III</strong>. A alíquota inicial aplicada sobre o 
              faturamento mensal será de <strong>6%</strong>, aumentando progressivamente conforme a receita acumulada sobe de faixa. 
              Essa empresa economiza significativamente em comparação ao Anexo V.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-3">⚠️ Exemplo 2: Empresa Tributada pelo Anexo V</h4>
            <p className="text-gray-700 mb-3">
              <strong>Dados:</strong> Uma agência de marketing faturou <strong>R$ 600.000</strong> nos últimos 12 meses e teve folha de salários 
              de <strong>R$ 150.000</strong> no mesmo período.
            </p>
            <div className="bg-orange-50 rounded-lg p-4 mb-3">
              <p className="font-mono text-gray-900">
                Fator R = (R$ 150.000 / R$ 600.000) × 100 = <strong>25%</strong>
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              <strong>Resultado:</strong> Como 25% &lt; 28%, a empresa será tributada pelo <strong>Anexo V</strong>. A alíquota inicial aplicada sobre o 
              faturamento mensal será de <strong>15,5%</strong> — mais de <strong>2,5 vezes maior</strong> que a do Anexo III. 
              Essa diferença pode representar milhares de reais em impostos adicionais anualmente.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-3">💡 Exemplo 3: Planejamento para Atingir o Anexo III</h4>
            <p className="text-gray-700 mb-3">
              <strong>Situação:</strong> Uma empresa de design fatura <strong>R$ 500.000</strong>/ano e tem folha de <strong>R$ 125.000</strong>/ano 
              (Fator R = 25%). Ela quer atingir o mínimo de 28% para se enquadrar no Anexo III.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-3">
              <p className="font-mono text-gray-900 mb-2">
                Folha necessária = R$ 500.000 × 0,28 = <strong>R$ 140.000</strong>
              </p>
              <p className="font-mono text-gray-900">
                Diferença a aumentar = R$ 140.000 − R$ 125.000 = <strong>R$ 15.000/ano</strong> (cerca de R$ 1.250/mês)
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              <strong>Ação sugerida:</strong> A empresa pode considerar contratar um colaborador adicional, formalizar sócios como CLT 
              (se aplicável), ou aumentar o pró-labore. O investimento de <strong>R$ 15.000/ano</strong> em folha pode gerar economias 
              tributárias muito superiores, já que a alíquota cairá de 15,5% para 6% na faixa inicial.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Erros Comuns ao Calcular o Fator R</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Mesmo sendo um cálculo relativamente simples, o Fator R é fonte de muitos erros que podem resultar em tributação incorreta, 
            autuações fiscais ou perda de benefícios. Confira os principais equívocos:
          </p>

          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
              <h4 className="font-bold text-red-900 mb-2">❌ Erro 1: Não incluir pró-labore na folha</h4>
              <p className="text-gray-700 leading-relaxed">
                Muitas empresas esquecem de somar o pró-labore dos sócios ao cálculo da folha de salários. O pró-labore é expressamente 
                incluído pela LC 123/2006 e sua omissão pode fazer o Fator R cair abaixo de 28%, forçando o enquadramento no Anexo V indevidamente.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
              <h4 className="font-bold text-red-900 mb-2">❌ Erro 2: Esquecer dos encargos sociais (INSS patronal, FGTS, RAT)</h4>
              <p className="text-gray-700 leading-relaxed">
                A folha de salários não é composta apenas pelos salários líquidos pagos. É preciso incluir os encargos sociais obrigatórios, 
                que podem representar cerca de <strong>30% a 40%</strong> do valor bruto dos salários. Ignorar esses encargos reduz 
                artificialmente o Fator R.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
              <h4 className="font-bold text-red-900 mb-2">❌ Erro 3: Usar o período errado (mês isolado em vez de 12 meses acumulados)</h4>
              <p className="text-gray-700 leading-relaxed">
                O cálculo do Fator R sempre deve considerar os <strong>últimos 12 meses</strong>, não apenas o mês atual. 
                Empresas com sazonalidade forte (ex.: faturamento concentrado em alguns meses) precisam ter atenção redobrada, 
                pois o Fator R pode variar significativamente ao longo do ano.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
              <h4 className="font-bold text-red-900 mb-2">❌ Erro 4: Incluir pagamentos a terceiros (PJ) na folha</h4>
              <p className="text-gray-700 leading-relaxed">
                Pagamentos feitos a prestadores de serviços PJ (pessoa jurídica) <strong>não entram no cálculo da folha de salários</strong>. 
                Apenas colaboradores com vínculo empregatício (CLT) ou pró-labore de sócios devem ser considerados. Incluir valores de PJ 
                infla o Fator R indevidamente e pode gerar problemas fiscais.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
              <h4 className="font-bold text-red-900 mb-2">❌ Erro 5: Manipular artificialmente a folha (pejotização indevida, "sócio fantasma")</h4>
              <p className="text-gray-700 leading-relaxed">
                Algumas empresas tentam inflar a folha para atingir os 28% de forma artificial: incluem sócios que não trabalham de fato, 
                pagam pró-labore acima do razoável para a função, ou transformam colaboradores CLT em PJ (pejotização) para reduzir encargos — 
                mas esquecem que isso diminui o Fator R. Essas práticas são fiscalizadas e podem gerar autuações, multas e até 
                reclamações trabalhistas. O planejamento deve ser legal e coerente com a realidade da empresa.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Perguntas Frequentes sobre o Fator R</h3>

          <div className="space-y-5">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">1. O Fator R se aplica a todos os tipos de empresa no Simples Nacional?</h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Não.</strong> O Fator R é aplicável apenas a empresas de <strong>prestação de serviços</strong> que se enquadram nos 
                anexos III e V do Simples Nacional. Empresas comerciais (Anexo I) e industriais (Anexo II), bem como alguns serviços específicos 
                (Anexo IV), não utilizam o Fator R para definição da tributação.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">2. O Fator R pode variar ao longo do ano?</h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sim.</strong> Como o cálculo considera sempre os últimos 12 meses de forma móvel, o Fator R pode variar mês a mês, 
                especialmente se houver mudanças na folha de pagamento (contratações, demissões, aumentos salariais) ou no faturamento. 
                É importante recalcular o Fator R mensalmente para garantir o enquadramento correto.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">3. Posso aumentar meu pró-labore apenas para alcançar os 28%?</h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sim, desde que seja razoável.</strong> Você pode ajustar o pró-labore dos sócios para otimizar o Fator R, 
                mas o valor deve ser compatível com a função exercida e com a realidade financeira da empresa. Pró-labores excessivos 
                ou incompatíveis podem chamar a atenção do Fisco e serem questionados. O ideal é fazer um planejamento tributário 
                com suporte contábil para garantir que os ajustes sejam legais e justificáveis.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">4. E se minha empresa tiver Fator R exatamente igual a 28%?</h4>
              <p className="text-gray-700 leading-relaxed">
                Se o Fator R for <strong>exatamente 28%</strong>, você se enquadra no <strong>Anexo III</strong> (a regra é "maior ou igual a 28%"). 
                Portanto, nesse caso, sua empresa será tributada pela alíquota mais baixa, começando em 6%.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">5. Vale a pena contratar mais funcionários só para aumentar o Fator R?</h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Depende.</strong> Aumentar a folha de salários tem custo (salários + encargos), mas pode gerar economias tributárias 
                significativas se sua empresa estiver próxima dos 28% e com faturamento relevante. Faça as contas: compare o custo adicional 
                da folha com a economia projetada no DAS. Em muitos casos, especialmente para empresas com receita acima de R$ 500 mil/ano, 
                investir em folha pode ser extremamente vantajoso. Mas a contratação deve fazer sentido operacionalmente — nunca contrate 
                apenas por motivos fiscais sem necessidade real de mão de obra.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">6. O que acontece se eu calcular o Fator R errado?</h4>
              <p className="text-gray-700 leading-relaxed">
                Calcular o Fator R incorretamente pode levar a dois cenários: <strong>(1)</strong> você paga impostos a mais (se errar para menos 
                e cair no Anexo V indevidamente) ou <strong>(2)</strong> você paga impostos a menos (se inflar a folha indevidamente e se enquadrar 
                no Anexo III sem base legal), o que pode resultar em autuação, multas e juros pela Receita Federal. 
                Por isso, é essencial contar com uma contabilidade especializada para garantir que o cálculo seja feito corretamente todos os meses.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Legislação e Base Legal</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            O Fator R está previsto na <strong>Lei Complementar nº 123, de 14 de dezembro de 2006</strong> (Estatuto Nacional da 
            Microempresa e da Empresa de Pequeno Porte), que instituiu o regime tributário do Simples Nacional. Os dispositivos específicos são:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>
              <strong>Art. 18, §§ 5º-C a 5º-J:</strong> Estabelecem as regras de cálculo do Fator R, definindo o que compõe a folha de salários 
              (pró-labore, salários, encargos) e os critérios de enquadramento nos anexos III e V.
            </li>
            <li>
              <strong>Resolução CGSN nº 140/2018:</strong> Dispõe sobre o Simples Nacional e detalha as formas de apuração, incluindo o cálculo 
              do Fator R, obrigações acessórias e prazos.
            </li>
            <li>
              <strong>Instrução Normativa RFB nº 1.828/2018:</strong> Regulamenta aspectos operacionais da apuração do Simples Nacional e 
              esclarece dúvidas sobre a composição da folha de salários e da receita bruta para fins do Fator R.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">
            Além disso, a <strong>Receita Federal</strong> disponibiliza o <strong>Portal do Simples Nacional</strong> (
            <a href="http://www8.receita.fazenda.gov.br/SimplesNacional/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
              http://www8.receita.fazenda.gov.br/SimplesNacional/
            </a>
            ), onde é possível consultar as alíquotas dos anexos, simuladores de cálculo e manuais atualizados.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              <strong>Importante:</strong> A legislação tributária é dinâmica e pode sofrer alterações. Sempre consulte a versão atualizada 
              da LC 123/2006 e conte com o apoio de um contador especializado para garantir que sua empresa esteja em conformidade.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Conclusão: Planeje, Calcule e Economize com o Fator R</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            O Fator R é uma das ferramentas mais poderosas e, ao mesmo tempo, subestimadas do Simples Nacional. 
            A diferença entre pagar <strong>6% ou 15,5%</strong> de impostos pode representar <strong>dezenas de milhares de reais por ano</strong> 
            — dinheiro que pode ser reinvestido na empresa, usado para contratar mais pessoas, melhorar produtos ou simplesmente aumentar a 
            margem de lucro.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Mas para aproveitar essa vantagem, é preciso:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li><strong>Calcular corretamente</strong> o Fator R todos os meses, considerando os últimos 12 meses de folha e receita bruta.</li>
            <li><strong>Incluir todos os componentes da folha</strong>: salários, pró-labore, encargos sociais (INSS, FGTS, RAT).</li>
            <li><strong>Planejar a folha de pagamento</strong> de forma estratégica, sem manipulações artificiais, mas aproveitando ajustes legais 
            (como aumento de pró-labore, formalização de sócios, contratações necessárias).</li>
            <li><strong>Contar com apoio contábil especializado</strong> para evitar erros, autuações e perda de benefícios.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-6">
            O Fator R não é apenas um número — é uma oportunidade de economia e um reflexo de como sua empresa valoriza e estrutura 
            sua equipe. Empresas que investem em pessoas (e, portanto, em folha de pagamento) são recompensadas com uma carga tributária menor. 
            Use o simulador acima para entender sua situação atual, identifique oportunidades de otimização e tome decisões informadas. 
            Seu bolso (e sua empresa) agradecem.
          </p>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 text-center">
            <h4 className="text-2xl font-bold mb-3">🚀 Calcule Seu Fator R Agora e Descubra Seu Anexo!</h4>
            <p className="text-purple-100 mb-4">
              Use nosso simulador gratuito no topo desta página e veja em segundos se você está pagando mais impostos do que deveria.
            </p>
            <a 
              href="#top" 
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-purple-50 transition shadow-lg"
            >
              Calcular Fator R Gratuitamente
            </a>
          </div>
        </section>
      </article>
    </div>
  );
}

export default SimuladorFatorR;

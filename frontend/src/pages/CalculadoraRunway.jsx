import { useState, useMemo } from 'react';

/**
 * Calculadora de Runway para Startups
 * Calcula quantos meses de operação a startup consegue se manter
 * com o caixa atual e o burn rate mensal
 */
export default function CalculadoraRunway() {
  const [formData, setFormData] = useState({
    caixaDisponivel: '',
    burnRate: '',
    corteCustos: '0'
  });

  const [mostrarSimulacao, setMostrarSimulacao] = useState(false);

  // Formatar valor monetário
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Atualizar campo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Cálculos do Runway
  const resultado = useMemo(() => {
    const caixa = parseFloat(formData.caixaDisponivel) || 0;
    const burn = parseFloat(formData.burnRate) || 0;
    const corte = parseFloat(formData.corteCustos) || 0;

    if (caixa <= 0 || burn <= 0) return null;

    // Runway atual
    const runwayMeses = Math.floor(caixa / burn);
    
    // Burn rate ajustado com corte de custos
    const burnAjustado = burn * (1 - corte / 100);
    const runwayAjustado = burnAjustado > 0 ? Math.floor(caixa / burnAjustado) : Infinity;
    
    // Projeção do caixa ao longo dos meses
    const projecao = [];
    let caixaAtual = caixa;
    let caixaAjustado = caixa;
    
    const mesesProjecao = Math.min(Math.max(runwayMeses + 6, 12), 36);
    
    for (let mes = 0; mes <= mesesProjecao; mes++) {
      projecao.push({
        mes,
        caixaNormal: Math.max(0, caixaAtual),
        caixaAjustado: Math.max(0, caixaAjustado)
      });
      caixaAtual -= burn;
      caixaAjustado -= burnAjustado;
    }

    // Classificação do runway
    let status, statusCor, statusEmoji;
    if (runwayMeses >= 18) {
      status = 'Excelente';
      statusCor = 'green';
      statusEmoji = '🚀';
    } else if (runwayMeses >= 12) {
      status = 'Saudável';
      statusCor = 'blue';
      statusEmoji = '✅';
    } else if (runwayMeses >= 6) {
      status = 'Atenção';
      statusCor = 'yellow';
      statusEmoji = '⚠️';
    } else if (runwayMeses >= 3) {
      status = 'Crítico';
      statusCor = 'orange';
      statusEmoji = '🔥';
    } else {
      status = 'Emergência';
      statusCor = 'red';
      statusEmoji = '🚨';
    }

    // Data estimada do fim do caixa
    const hoje = new Date();
    const dataFim = new Date(hoje);
    dataFim.setMonth(dataFim.getMonth() + runwayMeses);

    const dataFimAjustado = new Date(hoje);
    if (runwayAjustado !== Infinity) {
      dataFimAjustado.setMonth(dataFimAjustado.getMonth() + runwayAjustado);
    }

    return {
      runwayMeses,
      runwayAjustado,
      burnAjustado,
      projecao,
      status,
      statusCor,
      statusEmoji,
      dataFim: dataFim.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      dataFimAjustado: runwayAjustado !== Infinity 
        ? dataFimAjustado.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
        : 'Indefinido',
      mesesGanhos: runwayAjustado !== Infinity ? runwayAjustado - runwayMeses : 0,
      economiaMensal: burn - burnAjustado,
      economiaTotal: (burn - burnAjustado) * runwayAjustado
    };
  }, [formData]);

  // Cor de fundo baseada no status
  const getStatusBgColor = (cor) => {
    const cores = {
      green: 'from-green-500 to-emerald-600',
      blue: 'from-blue-500 to-indigo-600',
      yellow: 'from-yellow-500 to-amber-600',
      orange: 'from-orange-500 to-red-500',
      red: 'from-red-600 to-red-800'
    };
    return cores[cor] || cores.blue;
  };

  // Encontrar o valor máximo para o gráfico
  const maxCaixa = useMemo(() => {
    if (!resultado) return 0;
    return Math.max(...resultado.projecao.map(p => Math.max(p.caixaNormal, p.caixaAjustado)));
  }, [resultado]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🛫 Calculadora de Runway
        </h1>
        <p className="text-gray-600">
          Descubra quantos meses sua startup pode operar com o caixa atual e simule cenários de redução de custos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Dados Financeiros</h2>

            <div className="space-y-4">
              {/* Caixa Disponível */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caixa Disponível (R$)
                </label>
                <input
                  type="number"
                  name="caixaDisponivel"
                  value={formData.caixaDisponivel}
                  onChange={handleChange}
                  placeholder="Ex: 500000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">Total de dinheiro em caixa hoje</p>
              </div>

              {/* Burn Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Burn Rate Mensal (R$)
                </label>
                <input
                  type="number"
                  name="burnRate"
                  value={formData.burnRate}
                  onChange={handleChange}
                  placeholder="Ex: 50000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">Quanto a empresa gasta por mês</p>
              </div>

              <hr className="my-4" />

              {/* Toggle Simulação */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Simular Corte de Custos</span>
                <button
                  onClick={() => setMostrarSimulacao(!mostrarSimulacao)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    mostrarSimulacao ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      mostrarSimulacao ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Slider de Corte */}
              {mostrarSimulacao && (
                <div className="bg-indigo-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-indigo-700 mb-2">
                    Redução de Custos: <span className="font-bold">{formData.corteCustos}%</span>
                  </label>
                  <input
                    type="range"
                    name="corteCustos"
                    min="0"
                    max="50"
                    step="5"
                    value={formData.corteCustos}
                    onChange={handleChange}
                    className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-indigo-500 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {resultado ? (
            <>
              {/* Card Principal - Runway */}
              <div className={`bg-gradient-to-r ${getStatusBgColor(resultado.statusCor)} rounded-xl p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Seu Runway Atual</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-5xl font-bold">{resultado.runwayMeses}</p>
                      <p className="text-2xl">meses</p>
                    </div>
                    <p className="text-white/80 mt-2">
                      Caixa acaba em <strong>{resultado.dataFim}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-6xl">{resultado.statusEmoji}</span>
                    <p className="text-xl font-semibold mt-2">{resultado.status}</p>
                  </div>
                </div>
              </div>

              {/* Cards Secundários */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-5">
                  <p className="text-gray-500 text-sm">Caixa Atual</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatarMoeda(parseFloat(formData.caixaDisponivel) || 0)}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-5">
                  <p className="text-gray-500 text-sm">Burn Rate Mensal</p>
                  <p className="text-2xl font-bold text-red-600">
                    -{formatarMoeda(parseFloat(formData.burnRate) || 0)}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-5">
                  <p className="text-gray-500 text-sm">Burn Rate Diário</p>
                  <p className="text-2xl font-bold text-orange-600">
                    -{formatarMoeda((parseFloat(formData.burnRate) || 0) / 30)}
                  </p>
                </div>
              </div>

              {/* Simulação de Corte */}
              {mostrarSimulacao && parseFloat(formData.corteCustos) > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    ✂️ Simulação com {formData.corteCustos}% de Corte
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-600">Novo Runway</p>
                      <p className="text-2xl font-bold text-green-700">
                        {resultado.runwayAjustado === Infinity ? '∞' : resultado.runwayAjustado} meses
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-600">Meses Ganhos</p>
                      <p className="text-2xl font-bold text-green-700">
                        +{resultado.mesesGanhos}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-600">Novo Burn Rate</p>
                      <p className="text-2xl font-bold text-green-700">
                        {formatarMoeda(resultado.burnAjustado)}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-600">Economia Mensal</p>
                      <p className="text-2xl font-bold text-green-700">
                        {formatarMoeda(resultado.economiaMensal)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-green-100 rounded-lg">
                    <p className="text-green-800">
                      💡 Com um corte de <strong>{formData.corteCustos}%</strong>, seu caixa duraria até{' '}
                      <strong>{resultado.dataFimAjustado}</strong>, ganhando{' '}
                      <strong>{resultado.mesesGanhos} meses</strong> adicionais de operação.
                    </p>
                  </div>
                </div>
              )}

              {/* Gráfico de Projeção */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Projeção do Caixa</h3>
                
                {/* Legenda */}
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-indigo-500 rounded"></div>
                    <span className="text-sm text-gray-600">Cenário Atual</span>
                  </div>
                  {mostrarSimulacao && parseFloat(formData.corteCustos) > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm text-gray-600">Com Corte de Custos</span>
                    </div>
                  )}
                </div>

                {/* Gráfico */}
                <div className="relative h-64 mt-4">
                  <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                    {/* Linha de base (zero) */}
                    <line x1="0" y1="190" x2="800" y2="190" stroke="#e5e7eb" strokeWidth="1" />
                    
                    {/* Área do cenário atual */}
                    <path
                      d={`M 0,${190 - (resultado.projecao[0].caixaNormal / maxCaixa) * 180} ${
                        resultado.projecao.map((p, i) => {
                          const x = (i / (resultado.projecao.length - 1)) * 800;
                          const y = 190 - (p.caixaNormal / maxCaixa) * 180;
                          return `L ${x},${y}`;
                        }).join(' ')
                      } L 800,190 L 0,190 Z`}
                      fill="url(#gradientBlue)"
                      opacity="0.3"
                    />
                    
                    {/* Linha do cenário atual */}
                    <path
                      d={`M 0,${190 - (resultado.projecao[0].caixaNormal / maxCaixa) * 180} ${
                        resultado.projecao.map((p, i) => {
                          const x = (i / (resultado.projecao.length - 1)) * 800;
                          const y = 190 - (p.caixaNormal / maxCaixa) * 180;
                          return `L ${x},${y}`;
                        }).join(' ')
                      }`}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                    />

                    {/* Cenário com corte */}
                    {mostrarSimulacao && parseFloat(formData.corteCustos) > 0 && (
                      <>
                        <path
                          d={`M 0,${190 - (resultado.projecao[0].caixaAjustado / maxCaixa) * 180} ${
                            resultado.projecao.map((p, i) => {
                              const x = (i / (resultado.projecao.length - 1)) * 800;
                              const y = 190 - (p.caixaAjustado / maxCaixa) * 180;
                              return `L ${x},${y}`;
                            }).join(' ')
                          } L 800,190 L 0,190 Z`}
                          fill="url(#gradientGreen)"
                          opacity="0.3"
                        />
                        <path
                          d={`M 0,${190 - (resultado.projecao[0].caixaAjustado / maxCaixa) * 180} ${
                            resultado.projecao.map((p, i) => {
                              const x = (i / (resultado.projecao.length - 1)) * 800;
                              const y = 190 - (p.caixaAjustado / maxCaixa) * 180;
                              return `L ${x},${y}`;
                            }).join(' ')
                          }`}
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="3"
                        />
                      </>
                    )}

                    {/* Gradientes */}
                    <defs>
                      <linearGradient id="gradientBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="gradientGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Eixo Y - Valores */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                    <span>{formatarMoeda(maxCaixa)}</span>
                    <span>{formatarMoeda(maxCaixa / 2)}</span>
                    <span>R$ 0</span>
                  </div>
                </div>

                {/* Eixo X - Meses */}
                <div className="flex justify-between text-xs text-gray-500 mt-2 px-8">
                  <span>Mês 0</span>
                  <span>Mês {Math.floor(resultado.projecao.length / 4)}</span>
                  <span>Mês {Math.floor(resultado.projecao.length / 2)}</span>
                  <span>Mês {Math.floor(resultado.projecao.length * 3 / 4)}</span>
                  <span>Mês {resultado.projecao.length - 1}</span>
                </div>
              </div>

              {/* Tabela de Projeção */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Projeção Mês a Mês</h3>
                
                <div className="overflow-x-auto max-h-80">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Mês</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Caixa (Atual)</th>
                        {mostrarSimulacao && parseFloat(formData.corteCustos) > 0 && (
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Caixa (Com Corte)</th>
                        )}
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {resultado.projecao.map((p) => (
                        <tr key={p.mes} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">Mês {p.mes}</td>
                          <td className={`px-4 py-3 text-right ${p.caixaNormal <= 0 ? 'text-red-600' : 'text-gray-900'}`}>
                            {formatarMoeda(p.caixaNormal)}
                          </td>
                          {mostrarSimulacao && parseFloat(formData.corteCustos) > 0 && (
                            <td className={`px-4 py-3 text-right ${p.caixaAjustado <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {formatarMoeda(p.caixaAjustado)}
                            </td>
                          )}
                          <td className="px-4 py-3 text-center">
                            {p.caixaNormal <= 0 ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                🚨 Sem caixa
                              </span>
                            ) : p.caixaNormal < parseFloat(formData.burnRate) * 3 ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                ⚠️ Crítico
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                ✅ OK
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dicas */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Recomendações</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resultado.runwayMeses < 6 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">🚨 Ação Urgente</h4>
                      <p className="text-red-700 text-sm">
                        Com menos de 6 meses de runway, considere buscar investimento imediatamente 
                        ou implementar cortes significativos de custos.
                      </p>
                    </div>
                  )}
                  
                  {resultado.runwayMeses >= 6 && resultado.runwayMeses < 12 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">⚠️ Planeje com Antecedência</h4>
                      <p className="text-yellow-700 text-sm">
                        Inicie conversas com investidores agora. O processo de fundraising 
                        pode levar de 3 a 6 meses.
                      </p>
                    </div>
                  )}
                  
                  {resultado.runwayMeses >= 12 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">✅ Posição Confortável</h4>
                      <p className="text-green-700 text-sm">
                        Você tem tempo para focar no crescimento. Mantenha o controle dos gastos 
                        e continue monitorando seu burn rate.
                      </p>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">📊 Regra de Ouro</h4>
                    <p className="text-blue-700 text-sm">
                      Startups saudáveis mantêm pelo menos 18 meses de runway. 
                      Isso dá margem para pivotar ou buscar nova rodada sem pressão.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Estado Inicial */
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🛫</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Calcule seu Runway
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Preencha o caixa disponível e o burn rate mensal para descobrir 
                quantos meses sua startup pode operar.
              </p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-green-600 font-medium">18+ meses</p>
                  <p className="text-green-700 text-sm">Excelente 🚀</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-600 font-medium">6-12 meses</p>
                  <p className="text-yellow-700 text-sm">Atenção ⚠️</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-red-600 font-medium">&lt; 6 meses</p>
                  <p className="text-red-700 text-sm">Crítico 🚨</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explicação */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 O que é Runway?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Definição</h4>
            <p className="text-gray-600 text-sm">
              <strong>Runway</strong> é o tempo que uma startup pode operar antes de ficar sem dinheiro, 
              assumindo que as receitas e despesas permaneçam constantes. É calculado dividindo 
              o caixa disponível pelo burn rate mensal.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Fórmula</h4>
            <div className="bg-gray-800 rounded-lg p-4 text-white font-mono text-sm">
              <p>Runway = Caixa Disponível / Burn Rate Mensal</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <p className="text-indigo-800 text-sm">
            <strong>💡 Dica:</strong> O burn rate pode ser calculado como Despesas Totais - Receitas. 
            Se sua startup já gera receita, subtraia-a das despesas para ter o burn rate líquido.
          </p>
        </div>
      </div>
    </div>
  );
}

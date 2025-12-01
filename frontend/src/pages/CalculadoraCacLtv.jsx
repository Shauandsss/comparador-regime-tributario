import { useState, useMemo } from 'react';

/**
 * Calculadora de CAC, LTV e Payback para Startups
 * Calcula métricas essenciais de unit economics
 */
export default function CalculadoraCacLtv() {
  const [formData, setFormData] = useState({
    gastosMarketing: '',
    gastosVendas: '',
    novosClientes: '',
    ticketMedio: '',
    margemContribuicao: '70',
    churnMensal: '5',
    tempoVidaCliente: '' // Opcional, se não informado calcula pelo churn
  });

  // Formatar valor monetário
  const formatarMoeda = (valor) => {
    if (valor >= 1000000) {
      return `R$ ${(valor / 1000000).toFixed(2)}M`;
    }
    if (valor >= 1000) {
      return `R$ ${(valor / 1000).toFixed(1)}K`;
    }
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

  // Cálculos principais
  const resultado = useMemo(() => {
    const gastosMarketing = parseFloat(formData.gastosMarketing) || 0;
    const gastosVendas = parseFloat(formData.gastosVendas) || 0;
    const novosClientes = parseFloat(formData.novosClientes) || 0;
    const ticketMedio = parseFloat(formData.ticketMedio) || 0;
    const margemContribuicao = parseFloat(formData.margemContribuicao) || 0;
    const churnMensal = parseFloat(formData.churnMensal) || 0;
    const tempoVidaManual = parseFloat(formData.tempoVidaCliente) || 0;

    if (novosClientes <= 0 || ticketMedio <= 0) return null;

    // CAC = (Gastos Marketing + Gastos Vendas) / Novos Clientes
    const cac = (gastosMarketing + gastosVendas) / novosClientes;

    // Tempo de vida do cliente (em meses)
    // Se churn > 0, tempo médio = 1 / churn
    const tempoVidaCliente = tempoVidaManual > 0 
      ? tempoVidaManual 
      : churnMensal > 0 ? (1 / (churnMensal / 100)) : 24;

    // ARPU (Average Revenue Per User) mensal
    const arpu = ticketMedio;

    // Margem de contribuição em valor
    const margemValor = arpu * (margemContribuicao / 100);

    // LTV = ARPU * Margem * Tempo de Vida
    const ltv = arpu * (margemContribuicao / 100) * tempoVidaCliente;

    // LTV/CAC Ratio
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;

    // Payback (meses para recuperar o CAC)
    const paybackMeses = margemValor > 0 ? cac / margemValor : 0;

    // Classificação do LTV/CAC
    let ltvCacStatus, ltvCacCor, ltvCacEmoji;
    if (ltvCacRatio >= 5) {
      ltvCacStatus = 'Excelente - Pode investir mais em aquisição';
      ltvCacCor = 'green';
      ltvCacEmoji = '🚀';
    } else if (ltvCacRatio >= 3) {
      ltvCacStatus = 'Saudável - Bom equilíbrio';
      ltvCacCor = 'blue';
      ltvCacEmoji = '✅';
    } else if (ltvCacRatio >= 1) {
      ltvCacStatus = 'Atenção - Otimize CAC ou aumente LTV';
      ltvCacCor = 'yellow';
      ltvCacEmoji = '⚠️';
    } else {
      ltvCacStatus = 'Crítico - Prejuízo por cliente';
      ltvCacCor = 'red';
      ltvCacEmoji = '🚨';
    }

    // Classificação do Payback
    let paybackStatus, paybackCor;
    if (paybackMeses <= 6) {
      paybackStatus = 'Excelente';
      paybackCor = 'green';
    } else if (paybackMeses <= 12) {
      paybackStatus = 'Bom';
      paybackCor = 'blue';
    } else if (paybackMeses <= 18) {
      paybackStatus = 'Aceitável';
      paybackCor = 'yellow';
    } else {
      paybackStatus = 'Longo demais';
      paybackCor = 'red';
    }

    return {
      cac,
      ltv,
      ltvCacRatio,
      paybackMeses,
      tempoVidaCliente,
      arpu,
      margemValor,
      ltvCacStatus,
      ltvCacCor,
      ltvCacEmoji,
      paybackStatus,
      paybackCor,
      gastosTotal: gastosMarketing + gastosVendas,
      receitaTotal: novosClientes * ltv,
      lucroTotal: (novosClientes * ltv) - (gastosMarketing + gastosVendas)
    };
  }, [formData]);

  // Simulação de sensibilidade - impacto do churn
  const sensibilidadeChurn = useMemo(() => {
    if (!resultado) return [];
    
    const churns = [2, 3, 4, 5, 7, 10, 15, 20];
    const ticketMedio = parseFloat(formData.ticketMedio) || 0;
    const margemContribuicao = parseFloat(formData.margemContribuicao) || 0;
    
    return churns.map(churn => {
      const tempoVida = 1 / (churn / 100);
      const ltv = ticketMedio * (margemContribuicao / 100) * tempoVida;
      const ltvCac = resultado.cac > 0 ? ltv / resultado.cac : 0;
      
      return {
        churn,
        tempoVida: tempoVida.toFixed(1),
        ltv,
        ltvCac
      };
    });
  }, [resultado, formData]);

  // Simulação de sensibilidade - impacto do CAC
  const sensibilidadeCac = useMemo(() => {
    if (!resultado) return [];
    
    const multiplicadores = [0.5, 0.7, 0.85, 1, 1.15, 1.3, 1.5, 2];
    
    return multiplicadores.map(mult => {
      const novoCac = resultado.cac * mult;
      const ltvCac = novoCac > 0 ? resultado.ltv / novoCac : 0;
      const payback = resultado.margemValor > 0 ? novoCac / resultado.margemValor : 0;
      
      return {
        multiplicador: mult,
        cac: novoCac,
        ltvCac,
        payback
      };
    });
  }, [resultado]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Calculadora CAC, LTV & Payback
        </h1>
        <p className="text-gray-600">
          Calcule as métricas essenciais de unit economics da sua startup e entenda a saúde do seu modelo de negócio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 Dados de Aquisição</h2>

            <div className="space-y-4">
              {/* Gastos Marketing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gastos com Marketing (R$/mês)
                </label>
                <input
                  type="number"
                  name="gastosMarketing"
                  value={formData.gastosMarketing}
                  onChange={handleChange}
                  placeholder="Ex: 50000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Gastos Vendas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gastos com Vendas (R$/mês)
                </label>
                <input
                  type="number"
                  name="gastosVendas"
                  value={formData.gastosVendas}
                  onChange={handleChange}
                  placeholder="Ex: 30000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">Salários SDRs, comissões, ferramentas</p>
              </div>

              {/* Novos Clientes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Novos Clientes Adquiridos/mês
                </label>
                <input
                  type="number"
                  name="novosClientes"
                  value={formData.novosClientes}
                  onChange={handleChange}
                  placeholder="Ex: 100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <hr className="my-4" />
              <h3 className="text-md font-semibold text-gray-800">💰 Dados de Receita</h3>

              {/* Ticket Médio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Médio Mensal (R$)
                </label>
                <input
                  type="number"
                  name="ticketMedio"
                  value={formData.ticketMedio}
                  onChange={handleChange}
                  placeholder="Ex: 299"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">ARPU - Receita média por cliente</p>
              </div>

              {/* Margem de Contribuição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margem de Contribuição: <span className="font-bold text-emerald-600">{formData.margemContribuicao}%</span>
                </label>
                <input
                  type="range"
                  name="margemContribuicao"
                  min="10"
                  max="95"
                  step="5"
                  value={formData.margemContribuicao}
                  onChange={handleChange}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10%</span>
                  <span>50%</span>
                  <span>95%</span>
                </div>
              </div>

              {/* Churn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Churn Mensal: <span className="font-bold text-red-600">{formData.churnMensal}%</span>
                </label>
                <input
                  type="range"
                  name="churnMensal"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={formData.churnMensal}
                  onChange={handleChange}
                  className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5%</span>
                  <span>10%</span>
                  <span>20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {resultado ? (
            <>
              {/* Cards Principais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* CAC */}
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
                  <p className="text-orange-100 text-sm mb-1">CAC</p>
                  <p className="text-3xl font-bold">{formatarMoeda(resultado.cac)}</p>
                  <p className="text-orange-200 text-sm mt-2">Custo de Aquisição</p>
                </div>

                {/* LTV */}
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-6 text-white">
                  <p className="text-emerald-100 text-sm mb-1">LTV</p>
                  <p className="text-3xl font-bold">{formatarMoeda(resultado.ltv)}</p>
                  <p className="text-emerald-200 text-sm mt-2">Lifetime Value</p>
                </div>

                {/* LTV/CAC */}
                <div className={`bg-gradient-to-br ${
                  resultado.ltvCacCor === 'green' ? 'from-green-500 to-emerald-600' :
                  resultado.ltvCacCor === 'blue' ? 'from-blue-500 to-indigo-600' :
                  resultado.ltvCacCor === 'yellow' ? 'from-yellow-500 to-amber-600' :
                  'from-red-500 to-red-700'
                } rounded-xl p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm mb-1">LTV/CAC</p>
                      <p className="text-3xl font-bold">{resultado.ltvCacRatio.toFixed(2)}x</p>
                    </div>
                    <span className="text-4xl">{resultado.ltvCacEmoji}</span>
                  </div>
                  <p className="text-white/80 text-sm mt-2">{resultado.ltvCacStatus}</p>
                </div>
              </div>

              {/* Payback e Detalhes */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">⏱️ Payback & Detalhes</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className={`rounded-lg p-4 ${
                    resultado.paybackCor === 'green' ? 'bg-green-50 border border-green-200' :
                    resultado.paybackCor === 'blue' ? 'bg-blue-50 border border-blue-200' :
                    resultado.paybackCor === 'yellow' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-red-50 border border-red-200'
                  }`}>
                    <p className="text-sm text-gray-500">Payback</p>
                    <p className="text-2xl font-bold text-gray-900">{resultado.paybackMeses.toFixed(1)} meses</p>
                    <p className={`text-xs font-medium ${
                      resultado.paybackCor === 'green' ? 'text-green-600' :
                      resultado.paybackCor === 'blue' ? 'text-blue-600' :
                      resultado.paybackCor === 'yellow' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>{resultado.paybackStatus}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Tempo de Vida</p>
                    <p className="text-2xl font-bold text-gray-900">{resultado.tempoVidaCliente.toFixed(1)} meses</p>
                    <p className="text-xs text-gray-500">Média por cliente</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">ARPU</p>
                    <p className="text-2xl font-bold text-gray-900">{formatarMoeda(resultado.arpu)}</p>
                    <p className="text-xs text-gray-500">Receita média/mês</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Margem/Cliente</p>
                    <p className="text-2xl font-bold text-emerald-600">{formatarMoeda(resultado.margemValor)}/mês</p>
                    <p className="text-xs text-gray-500">Contribuição mensal</p>
                  </div>
                </div>

                {/* Visualização do Payback */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Linha do Tempo do Payback</h4>
                  <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`absolute left-0 top-0 h-full rounded-full transition-all ${
                        resultado.paybackCor === 'green' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                        resultado.paybackCor === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                        resultado.paybackCor === 'yellow' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                        'bg-gradient-to-r from-red-400 to-red-500'
                      }`}
                      style={{ width: `${Math.min((resultado.paybackMeses / resultado.tempoVidaCliente) * 100, 100)}%` }}
                    />
                    <div 
                      className="absolute top-0 h-full w-1 bg-gray-800"
                      style={{ left: `${Math.min((resultado.paybackMeses / resultado.tempoVidaCliente) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>0 meses</span>
                    <span className="font-medium text-gray-700">Payback: {resultado.paybackMeses.toFixed(1)}m</span>
                    <span>Vida: {resultado.tempoVidaCliente.toFixed(1)}m</span>
                  </div>
                </div>
              </div>

              {/* Gráfico de Sensibilidade - Churn */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📉 Impacto do Churn no LTV</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Veja como diferentes taxas de churn afetam seu LTV e ratio LTV/CAC
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Churn</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Vida Cliente</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">LTV</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">LTV/CAC</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sensibilidadeChurn.map((row) => {
                        const isAtual = row.churn === parseFloat(formData.churnMensal);
                        let statusCor = 'bg-green-100 text-green-700';
                        if (row.ltvCac < 1) statusCor = 'bg-red-100 text-red-700';
                        else if (row.ltvCac < 3) statusCor = 'bg-yellow-100 text-yellow-700';
                        else if (row.ltvCac < 5) statusCor = 'bg-blue-100 text-blue-700';
                        
                        return (
                          <tr 
                            key={row.churn}
                            className={`hover:bg-gray-50 ${isAtual ? 'bg-emerald-50 font-medium' : ''}`}
                          >
                            <td className="px-4 py-3">
                              {row.churn}%
                              {isAtual && <span className="ml-2 text-xs text-emerald-600">← atual</span>}
                            </td>
                            <td className="px-4 py-3 text-right">{row.tempoVida} meses</td>
                            <td className="px-4 py-3 text-right font-medium">{formatarMoeda(row.ltv)}</td>
                            <td className="px-4 py-3 text-right font-bold">{row.ltvCac.toFixed(2)}x</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusCor}`}>
                                {row.ltvCac >= 5 ? '🚀' : row.ltvCac >= 3 ? '✅' : row.ltvCac >= 1 ? '⚠️' : '🚨'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Gráfico de barras */}
                <div className="mt-6">
                  <div className="flex items-end justify-between gap-2 h-32">
                    {sensibilidadeChurn.map((row) => {
                      const maxLtv = Math.max(...sensibilidadeChurn.map(r => r.ltv));
                      const altura = (row.ltv / maxLtv) * 100;
                      const isAtual = row.churn === parseFloat(formData.churnMensal);
                      
                      return (
                        <div key={row.churn} className="flex-1 flex flex-col items-center">
                          <div 
                            className={`w-full rounded-t transition-all ${
                              isAtual 
                                ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' 
                                : 'bg-gradient-to-t from-gray-400 to-gray-300'
                            }`}
                            style={{ height: `${altura}%` }}
                          />
                          <p className={`text-xs mt-2 ${isAtual ? 'font-bold text-emerald-600' : 'text-gray-500'}`}>
                            {row.churn}%
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">Taxa de Churn → LTV decresce</p>
                </div>
              </div>

              {/* Benchmarks e Dicas */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📏 Benchmarks do Mercado</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">LTV/CAC Ideal</h4>
                    <p className="text-3xl font-bold text-blue-600">3x - 5x</p>
                    <p className="text-blue-700 text-sm mt-2">
                      Abaixo de 3x indica ineficiência. Acima de 5x pode significar sub-investimento em growth.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Payback Ideal</h4>
                    <p className="text-3xl font-bold text-green-600">&lt; 12 meses</p>
                    <p className="text-green-700 text-sm mt-2">
                      SaaS B2B: 12-18 meses. B2C: 6-12 meses. Enterprise: até 24 meses.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Churn Saudável</h4>
                    <p className="text-3xl font-bold text-amber-600">&lt; 5%</p>
                    <p className="text-amber-700 text-sm mt-2">
                      SaaS B2B: 2-5%. B2C: 5-7%. Marketplaces: 7-10%.
                    </p>
                  </div>
                </div>

                {/* Fórmulas */}
                <div className="bg-gray-800 rounded-lg p-4 text-white font-mono text-sm">
                  <p className="text-gray-400 mb-2">// Fórmulas utilizadas</p>
                  <p><span className="text-orange-400">CAC</span> = (Marketing + Vendas) / Novos Clientes</p>
                  <p><span className="text-green-400">LTV</span> = ARPU × Margem × (1 / Churn)</p>
                  <p><span className="text-blue-400">Payback</span> = CAC / (ARPU × Margem)</p>
                </div>
              </div>
            </>
          ) : (
            /* Estado Inicial */
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Calcule suas Unit Economics
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Preencha os dados ao lado para calcular CAC, LTV, LTV/CAC e Payback da sua startup.
              </p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-orange-600 font-medium">CAC</p>
                  <p className="text-orange-700 text-sm">Custo de Aquisição de Cliente</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-green-600 font-medium">LTV</p>
                  <p className="text-green-700 text-sm">Valor do Tempo de Vida</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-600 font-medium">Payback</p>
                  <p className="text-blue-700 text-sm">Tempo para recuperar CAC</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explicação */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Glossário de Métricas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">🎯 CAC</h4>
            <p className="text-gray-600 text-sm">
              <strong>Customer Acquisition Cost</strong> - Quanto você gasta para adquirir cada novo cliente. 
              Inclui marketing, vendas, ferramentas e salários.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">💎 LTV</h4>
            <p className="text-gray-600 text-sm">
              <strong>Lifetime Value</strong> - Receita total esperada de um cliente durante todo seu relacionamento 
              com a empresa.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-2">⚖️ LTV/CAC</h4>
            <p className="text-gray-600 text-sm">
              Relação entre valor gerado e custo de aquisição. Indica eficiência do modelo de negócio.
              Ideal: entre 3x e 5x.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-2">⏱️ Payback</h4>
            <p className="text-gray-600 text-sm">
              Tempo necessário para recuperar o investimento de aquisição através da margem gerada pelo cliente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

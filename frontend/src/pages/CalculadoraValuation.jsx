import { useState, useMemo } from 'react';

/**
 * Calculadora de Valuation para Startups
 * Calcula valuation pre-money e post-money com base em investimento e equity
 */
export default function CalculadoraValuation() {
  const [formData, setFormData] = useState({
    investimento: '',
    equity: 20,
    modoCalculo: 'equity' // 'equity' ou 'valuation'
  });

  const [valuationAlvo, setValuationAlvo] = useState('');

  // Formatar valor monetário
  const formatarMoeda = (valor) => {
    if (valor >= 1000000000) {
      return `R$ ${(valor / 1000000000).toFixed(2)}B`;
    }
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

  // Formatar valor completo
  const formatarMoedaCompleta = (valor) => {
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

  // Cálculos de Valuation
  const resultado = useMemo(() => {
    const investimento = parseFloat(formData.investimento) || 0;
    const equity = parseFloat(formData.equity) || 0;

    if (investimento <= 0 || equity <= 0 || equity > 100) return null;

    // Post-money = Investimento / (Equity / 100)
    const postMoney = investimento / (equity / 100);
    
    // Pre-money = Post-money - Investimento
    const preMoney = postMoney - investimento;

    // Participação dos fundadores após investimento
    const participacaoFundadores = 100 - equity;

    // Valor da participação dos fundadores
    const valorFundadores = postMoney * (participacaoFundadores / 100);

    // Price per share (assumindo 1M de shares)
    const sharesTotal = 1000000;
    const pricePerShare = postMoney / sharesTotal;
    const sharesInvestidor = sharesTotal * (equity / 100);
    const sharesFundadores = sharesTotal - sharesInvestidor;

    return {
      preMoney,
      postMoney,
      investimento,
      equity,
      participacaoFundadores,
      valorFundadores,
      pricePerShare,
      sharesTotal,
      sharesInvestidor,
      sharesFundadores
    };
  }, [formData]);

  // Dados para gráfico de sensibilidade
  const dadosSensibilidade = useMemo(() => {
    const investimento = parseFloat(formData.investimento) || 0;
    if (investimento <= 0) return [];

    const equities = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    return equities.map(eq => {
      const postMoney = investimento / (eq / 100);
      const preMoney = postMoney - investimento;
      return {
        equity: eq,
        preMoney,
        postMoney
      };
    });
  }, [formData.investimento]);

  // Cálculo reverso: dado valuation alvo, qual equity?
  const calculoReverso = useMemo(() => {
    const investimento = parseFloat(formData.investimento) || 0;
    const valuation = parseFloat(valuationAlvo) || 0;

    if (investimento <= 0 || valuation <= 0) return null;

    // Se valuation é post-money
    const equityNecessario = (investimento / valuation) * 100;
    const preMoneyResultante = valuation - investimento;

    return {
      equityNecessario: Math.min(equityNecessario, 100),
      preMoneyResultante,
      postMoney: valuation,
      valido: equityNecessario <= 100 && equityNecessario > 0
    };
  }, [formData.investimento, valuationAlvo]);

  // Encontrar o valor máximo para o gráfico
  const maxValuation = useMemo(() => {
    if (dadosSensibilidade.length === 0) return 0;
    return Math.max(...dadosSensibilidade.map(d => d.postMoney));
  }, [dadosSensibilidade]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          💰 Calculadora de Valuation
        </h1>
        <p className="text-gray-600">
          Calcule o valuation pre-money e post-money da sua startup com base no investimento e equity oferecido.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Dados da Rodada</h2>

            <div className="space-y-4">
              {/* Investimento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor do Investimento (R$)
                </label>
                <input
                  type="number"
                  name="investimento"
                  value={formData.investimento}
                  onChange={handleChange}
                  placeholder="Ex: 1000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
                <p className="text-xs text-gray-500 mt-1">Quanto o investidor vai aportar</p>
              </div>

              {/* Equity com Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equity Oferecido: <span className="font-bold text-violet-600">{formData.equity}%</span>
                </label>
                <input
                  type="range"
                  name="equity"
                  min="1"
                  max="50"
                  step="1"
                  value={formData.equity}
                  onChange={handleChange}
                  className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              {/* Input direto de equity */}
              <div>
                <input
                  type="number"
                  name="equity"
                  value={formData.equity}
                  onChange={handleChange}
                  min="0.1"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              <hr className="my-4" />

              {/* Cálculo Reverso */}
              <div className="bg-violet-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-violet-800 mb-2">🔄 Cálculo Reverso</h3>
                <p className="text-xs text-violet-600 mb-3">
                  Informe o valuation desejado para descobrir o equity necessário
                </p>
                <input
                  type="number"
                  value={valuationAlvo}
                  onChange={(e) => setValuationAlvo(e.target.value)}
                  placeholder="Valuation post-money alvo"
                  className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
                
                {calculoReverso && calculoReverso.valido && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-violet-200">
                    <p className="text-sm text-violet-700">
                      Para um valuation de <strong>{formatarMoeda(calculoReverso.postMoney)}</strong>, 
                      você precisa oferecer <strong>{calculoReverso.equityNecessario.toFixed(2)}%</strong> de equity.
                    </p>
                  </div>
                )}

                {calculoReverso && !calculoReverso.valido && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700">
                      ⚠️ Valuation muito baixo para o investimento informado.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {resultado ? (
            <>
              {/* Cards Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-6 text-white">
                  <p className="text-violet-100 text-sm mb-1">Valuation Pre-Money</p>
                  <p className="text-4xl font-bold">{formatarMoeda(resultado.preMoney)}</p>
                  <p className="text-violet-200 text-sm mt-2">Valor da empresa antes do investimento</p>
                </div>

                <div className="bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-xl p-6 text-white">
                  <p className="text-pink-100 text-sm mb-1">Valuation Post-Money</p>
                  <p className="text-4xl font-bold">{formatarMoeda(resultado.postMoney)}</p>
                  <p className="text-pink-200 text-sm mt-2">Valor da empresa após investimento</p>
                </div>
              </div>

              {/* Detalhamento */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Detalhamento da Rodada</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Investimento</p>
                    <p className="text-xl font-bold text-gray-900">{formatarMoeda(resultado.investimento)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Equity Investidor</p>
                    <p className="text-xl font-bold text-violet-600">{resultado.equity}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Equity Fundadores</p>
                    <p className="text-xl font-bold text-green-600">{resultado.participacaoFundadores}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Valor Fundadores</p>
                    <p className="text-xl font-bold text-green-600">{formatarMoeda(resultado.valorFundadores)}</p>
                  </div>
                </div>

                {/* Visualização de Equity */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Distribuição de Equity</h4>
                  <div className="h-8 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center text-white text-sm font-bold"
                      style={{ width: `${resultado.participacaoFundadores}%` }}
                    >
                      {resultado.participacaoFundadores > 15 && `Fundadores ${resultado.participacaoFundadores}%`}
                    </div>
                    <div 
                      className="bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold"
                      style={{ width: `${resultado.equity}%` }}
                    >
                      {resultado.equity > 10 && `Investidor ${resultado.equity}%`}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>🟢 Fundadores: {resultado.participacaoFundadores}%</span>
                    <span>🟣 Investidor: {resultado.equity}%</span>
                  </div>
                </div>

                {/* Fórmulas */}
                <div className="bg-gray-800 rounded-lg p-4 text-white font-mono text-sm">
                  <p className="text-gray-400 mb-2">// Fórmulas utilizadas</p>
                  <p>Post-Money = Investimento / (Equity / 100)</p>
                  <p>Post-Money = {formatarMoedaCompleta(resultado.investimento)} / {resultado.equity}%</p>
                  <p className="text-green-400">Post-Money = {formatarMoedaCompleta(resultado.postMoney)}</p>
                  <p className="mt-2">Pre-Money = Post-Money - Investimento</p>
                  <p className="text-green-400">Pre-Money = {formatarMoedaCompleta(resultado.preMoney)}</p>
                </div>
              </div>

              {/* Gráfico de Sensibilidade */}
              {dadosSensibilidade.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Análise de Sensibilidade</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Veja como o valuation muda conforme o equity oferecido
                  </p>
                  
                  {/* Gráfico de barras */}
                  <div className="relative h-64 mt-4">
                    <div className="absolute inset-0 flex items-end justify-between gap-1">
                      {dadosSensibilidade.map((d) => {
                        const alturaPost = (d.postMoney / maxValuation) * 100;
                        const alturaPre = (d.preMoney / maxValuation) * 100;
                        const isAtual = d.equity === parseFloat(formData.equity);
                        
                        return (
                          <div key={d.equity} className="flex-1 flex flex-col items-center group relative">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg p-2 whitespace-nowrap z-10">
                              <p>Equity: {d.equity}%</p>
                              <p>Pre-Money: {formatarMoeda(d.preMoney)}</p>
                              <p>Post-Money: {formatarMoeda(d.postMoney)}</p>
                            </div>
                            
                            {/* Barra Post-Money */}
                            <div className="w-full flex flex-col justify-end" style={{ height: '200px' }}>
                              <div 
                                className={`w-full rounded-t transition-all ${
                                  isAtual 
                                    ? 'bg-gradient-to-t from-fuchsia-600 to-fuchsia-400 ring-2 ring-fuchsia-300' 
                                    : 'bg-gradient-to-t from-violet-500 to-violet-300 hover:from-violet-600 hover:to-violet-400'
                                }`}
                                style={{ height: `${alturaPost}%` }}
                              />
                            </div>
                            <p className={`text-xs mt-2 ${isAtual ? 'font-bold text-fuchsia-600' : 'text-gray-600'}`}>
                              {d.equity}%
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Equity oferecido → Quanto menor o equity, maior o valuation
                  </p>

                  {/* Tabela de sensibilidade */}
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Equity</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Pre-Money</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Post-Money</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Fundadores mantêm</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {dadosSensibilidade.map((d) => {
                          const isAtual = d.equity === parseFloat(formData.equity);
                          return (
                            <tr 
                              key={d.equity}
                              className={`hover:bg-gray-50 ${isAtual ? 'bg-violet-50 font-semibold' : ''}`}
                            >
                              <td className="px-4 py-3">
                                {d.equity}%
                                {isAtual && <span className="ml-2 text-xs text-violet-600">← atual</span>}
                              </td>
                              <td className="px-4 py-3 text-right">{formatarMoeda(d.preMoney)}</td>
                              <td className="px-4 py-3 text-right font-medium text-violet-600">{formatarMoeda(d.postMoney)}</td>
                              <td className="px-4 py-3 text-right text-green-600">{100 - d.equity}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Dicas */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Dicas de Negociação</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">✅ Boas práticas</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Diluição de 15-25% por rodada é comum</li>
                      <li>• Mantenha pelo menos 50% após Series A</li>
                      <li>• Considere cláusulas anti-diluição</li>
                      <li>• Negocie vesting e cliff adequados</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">⚠️ Pontos de atenção</h4>
                    <ul className="text-amber-700 text-sm space-y-1">
                      <li>• Evite diluição acima de 30% por rodada</li>
                      <li>• Cuidado com valuations muito altos (down rounds)</li>
                      <li>• Considere o runway que o investimento proporciona</li>
                      <li>• Avalie termos além do valuation</li>
                    </ul>
                  </div>
                </div>

                {/* Comparativo de rodadas típicas */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-3">📊 Referência: Rodadas Típicas</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">Rodada</th>
                          <th className="px-4 py-2 text-right">Investimento</th>
                          <th className="px-4 py-2 text-right">Equity</th>
                          <th className="px-4 py-2 text-right">Valuation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="px-4 py-2 font-medium">Pre-Seed</td>
                          <td className="px-4 py-2 text-right">R$ 200K - 500K</td>
                          <td className="px-4 py-2 text-right">10-15%</td>
                          <td className="px-4 py-2 text-right">R$ 2M - 5M</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-medium">Seed</td>
                          <td className="px-4 py-2 text-right">R$ 1M - 3M</td>
                          <td className="px-4 py-2 text-right">15-20%</td>
                          <td className="px-4 py-2 text-right">R$ 5M - 20M</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-medium">Series A</td>
                          <td className="px-4 py-2 text-right">R$ 5M - 20M</td>
                          <td className="px-4 py-2 text-right">15-25%</td>
                          <td className="px-4 py-2 text-right">R$ 30M - 100M</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-medium">Series B</td>
                          <td className="px-4 py-2 text-right">R$ 20M - 80M</td>
                          <td className="px-4 py-2 text-right">15-25%</td>
                          <td className="px-4 py-2 text-right">R$ 100M - 400M</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Estado Inicial */
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Calcule seu Valuation
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Informe o valor do investimento e o equity oferecido para calcular 
                o valuation pre-money e post-money da sua startup.
              </p>
              
              <div className="mt-8 max-w-md mx-auto">
                <div className="bg-violet-50 rounded-lg p-4 text-left">
                  <h4 className="font-medium text-violet-800 mb-2">📚 Conceitos Básicos</h4>
                  <ul className="text-violet-700 text-sm space-y-2">
                    <li><strong>Pre-Money:</strong> Valor da empresa antes do investimento</li>
                    <li><strong>Post-Money:</strong> Valor após o investimento (Pre-Money + Investimento)</li>
                    <li><strong>Equity:</strong> Participação que o investidor recebe</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explicação */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Entendendo Valuation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">💵 Pre-Money Valuation</h4>
            <p className="text-gray-600 text-sm">
              É o valor da empresa <strong>antes</strong> de receber o investimento. 
              Representa o quanto os fundadores acreditam que a empresa vale com base em métricas, 
              tração e potencial de mercado.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">💰 Post-Money Valuation</h4>
            <p className="text-gray-600 text-sm">
              É o valor da empresa <strong>após</strong> receber o investimento. 
              Post-Money = Pre-Money + Investimento. É usado para calcular 
              a participação do investidor.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-2">📊 Diluição</h4>
            <p className="text-gray-600 text-sm">
              A cada rodada, os fundadores "diluem" sua participação. 
              Se você tem 100% e vende 20%, fica com 80%. Na próxima rodada de 20%, 
              fica com 64% (80% × 0.8).
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-violet-50 border border-violet-200 rounded-lg">
          <p className="text-violet-800 text-sm">
            <strong>💡 Dica:</strong> O valuation não é apenas um número - ele define quanto da sua empresa 
            você está vendendo. Um valuation mais alto significa menos diluição, mas valuations muito altos 
            podem dificultar rodadas futuras se você não atingir as expectativas.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import * as d3 from 'd3';

/**
 * Calculadora de Margem + Tributos
 * Calcula preço mínimo de venda considerando custos, despesas e tributos
 */
export default function CalculadoraMargem() {
  const [formData, setFormData] = useState({
    custoUnitario: '',
    despesasFixasMensais: '',
    despesasVariaveisPercentual: '',
    quantidadeMensal: '',
    regime: 'simples',
    anexoSimples: 'III',
    rbt12: '360000',
    atividadePresumido: 'servicos',
    margemDesejada: '20'
  });

  const [resultado, setResultado] = useState(null);
  const [comparativo, setComparativo] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [modoComparacao, setModoComparacao] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

  // Calcular margem
  const calcular = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const endpoint = modoComparacao ? '/margem/comparar' : '/margem/calcular';
      const body = {
        custoUnitario: parseFloat(formData.custoUnitario) || 0,
        despesasFixasMensais: parseFloat(formData.despesasFixasMensais) || 0,
        despesasVariaveisPercentual: parseFloat(formData.despesasVariaveisPercentual) || 0,
        quantidadeMensal: parseInt(formData.quantidadeMensal) || 1,
        margemDesejada: parseFloat(formData.margemDesejada) || 0
      };

      if (!modoComparacao) {
        body.regime = formData.regime;
      }

      if (formData.regime === 'simples' || modoComparacao) {
        body.anexoSimples = formData.anexoSimples;
        body.rbt12 = parseFloat(formData.rbt12) || 360000;
      }

      if (formData.regime === 'presumido' || modoComparacao) {
        body.atividadePresumido = formData.atividadePresumido;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        if (modoComparacao) {
          setComparativo(data.data);
          setResultado(null);
        } else {
          setResultado(data.data);
          setComparativo(null);
        }
      } else {
        setErro(data.error || 'Erro ao calcular');
      }
    } catch (error) {
      console.error('Erro:', error);
      setErro('Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  // Dados para o gráfico de cenários
  const dadosGraficoCenarios = useMemo(() => {
    if (!resultado?.cenarios) return null;
    return resultado.cenarios;
  }, [resultado]);

  // Cores por regime
  const coresRegime = {
    simples: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' },
    presumido: { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50' },
    real: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50' }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          💰 Calculadora de Margem + Tributos
        </h1>
        <p className="text-gray-600">
          Calcule o preço mínimo de venda e a margem líquida considerando custos, despesas e impostos do seu regime tributário.
        </p>
      </div>

      {/* Toggle Modo */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setModoComparacao(false)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              !modoComparacao 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Cálculo Simples
          </button>
          <button
            onClick={() => setModoComparacao(true)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              modoComparacao 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Comparar Regimes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 Dados do Produto/Serviço</h2>

            <div className="space-y-4">
              {/* Custo Unitário */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custo Unitário (R$)
                </label>
                <input
                  type="number"
                  name="custoUnitario"
                  value={formData.custoUnitario}
                  onChange={handleChange}
                  placeholder="Ex: 50.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Despesas Fixas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Despesas Fixas Mensais (R$)
                </label>
                <input
                  type="number"
                  name="despesasFixasMensais"
                  value={formData.despesasFixasMensais}
                  onChange={handleChange}
                  placeholder="Ex: 5000.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">Aluguel, salários, luz, etc.</p>
              </div>

              {/* Despesas Variáveis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Despesas Variáveis (%)
                </label>
                <input
                  type="number"
                  name="despesasVariaveisPercentual"
                  value={formData.despesasVariaveisPercentual}
                  onChange={handleChange}
                  placeholder="Ex: 5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">Comissões, taxas cartão, etc.</p>
              </div>

              {/* Quantidade Mensal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade Vendida/Mês
                </label>
                <input
                  type="number"
                  name="quantidadeMensal"
                  value={formData.quantidadeMensal}
                  onChange={handleChange}
                  placeholder="Ex: 100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Margem Desejada */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margem de Lucro Desejada (%)
                </label>
                <input
                  type="number"
                  name="margemDesejada"
                  value={formData.margemDesejada}
                  onChange={handleChange}
                  placeholder="Ex: 20"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <hr className="my-4" />

              <h3 className="text-md font-semibold text-gray-800 mb-3">⚙️ Configuração Tributária</h3>

              {/* Regime Tributário */}
              {!modoComparacao && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Regime Tributário
                  </label>
                  <select
                    name="regime"
                    value={formData.regime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="simples">Simples Nacional</option>
                    <option value="presumido">Lucro Presumido</option>
                    <option value="real">Lucro Real</option>
                  </select>
                </div>
              )}

              {/* Campos do Simples */}
              {(formData.regime === 'simples' || modoComparacao) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Anexo do Simples
                    </label>
                    <select
                      name="anexoSimples"
                      value={formData.anexoSimples}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="I">Anexo I - Comércio</option>
                      <option value="II">Anexo II - Indústria</option>
                      <option value="III">Anexo III - Serviços</option>
                      <option value="IV">Anexo IV - Serviços (CPP à parte)</option>
                      <option value="V">Anexo V - Serviços Intelectuais</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RBT12 (R$)
                    </label>
                    <input
                      type="number"
                      name="rbt12"
                      value={formData.rbt12}
                      onChange={handleChange}
                      placeholder="Ex: 360000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </>
              )}

              {/* Campos do Presumido */}
              {(formData.regime === 'presumido' || modoComparacao) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Atividade
                  </label>
                  <select
                    name="atividadePresumido"
                    value={formData.atividadePresumido}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="comercio">Comércio (8%)</option>
                    <option value="industria">Indústria (8%)</option>
                    <option value="servicos">Serviços (32%)</option>
                    <option value="transporte_passageiros">Transporte Passageiros (16%)</option>
                    <option value="transporte_cargas">Transporte Cargas (8%)</option>
                  </select>
                </div>
              )}

              {/* Botão Calcular */}
              <button
                onClick={calcular}
                disabled={carregando || !formData.custoUnitario || !formData.quantidadeMensal}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {carregando ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Calculando...
                  </>
                ) : (
                  <>
                    🧮 {modoComparacao ? 'Comparar Regimes' : 'Calcular Preço'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {/* Erro */}
          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 flex items-center gap-2">
                <span>⚠️</span> {erro}
              </p>
            </div>
          )}

          {/* Resultado Simples */}
          {resultado && !modoComparacao && (
            <>
              {/* Cards Principais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <p className="text-green-100 text-sm">Preço Mínimo</p>
                  <p className="text-3xl font-bold">{formatarMoeda(resultado.precos.precoMinimo)}</p>
                  <p className="text-green-200 text-xs mt-1">Margem zero</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
                  <p className="text-indigo-100 text-sm">Preço Sugerido</p>
                  <p className="text-3xl font-bold">{formatarMoeda(resultado.precos.precoSugerido)}</p>
                  <p className="text-indigo-200 text-xs mt-1">Margem {formData.margemDesejada}%</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
                  <p className="text-amber-100 text-sm">Markup</p>
                  <p className="text-3xl font-bold">{resultado.precos.markup.toFixed(2)}x</p>
                  <p className="text-amber-200 text-xs mt-1">Multiplicador sobre custo</p>
                </div>
              </div>

              {/* Detalhamento */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Detalhamento Mensal</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Receita</p>
                    <p className="text-xl font-bold text-gray-900">{formatarMoeda(resultado.resultado.receitaMensal)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Custos</p>
                    <p className="text-xl font-bold text-red-600">-{formatarMoeda(resultado.resultado.custoTotalProdutos)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Despesas Fixas</p>
                    <p className="text-xl font-bold text-red-600">-{formatarMoeda(resultado.resultado.despesasFixasMensais)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Tributos ({resultado.tributos.aliquotaEfetiva.toFixed(2)}%)</p>
                    <p className="text-xl font-bold text-red-600">-{formatarMoeda(resultado.resultado.tributosMensais)}</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-green-600">Lucro Líquido Mensal</p>
                      <p className="text-3xl font-bold text-green-700">{formatarMoeda(resultado.resultado.lucroLiquidoMensal)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">Margem Líquida Real</p>
                      <p className="text-3xl font-bold text-green-700">{resultado.resultado.margemLiquidaReal.toFixed(2)}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cenários Alternativos */}
              {dadosGraficoCenarios && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Cenários de Margem</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Margem</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Preço</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Markup</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Lucro Unit.</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Lucro Mensal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {dadosGraficoCenarios.map((cenario, index) => (
                          <tr 
                            key={cenario.margem}
                            className={`hover:bg-gray-50 ${
                              cenario.margem === parseFloat(formData.margemDesejada) ? 'bg-indigo-50' : ''
                            }`}
                          >
                            <td className="px-4 py-3 font-medium">{cenario.margem}%</td>
                            <td className="px-4 py-3 text-right">{formatarMoeda(cenario.preco)}</td>
                            <td className="px-4 py-3 text-right">{cenario.markup.toFixed(2)}x</td>
                            <td className="px-4 py-3 text-right text-green-600">{formatarMoeda(cenario.lucroUnitario)}</td>
                            <td className="px-4 py-3 text-right font-bold text-green-600">{formatarMoeda(cenario.lucroMensal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Gráfico de barras */}
                  <div className="mt-6">
                    <div className="flex items-end justify-between h-40 gap-2">
                      {dadosGraficoCenarios.map((cenario) => {
                        const maxLucro = Math.max(...dadosGraficoCenarios.map(c => c.lucroMensal));
                        const altura = (cenario.lucroMensal / maxLucro) * 100;
                        return (
                          <div key={cenario.margem} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all hover:from-indigo-600 hover:to-indigo-500"
                              style={{ height: `${altura}%` }}
                            />
                            <p className="text-xs text-gray-600 mt-2">{cenario.margem}%</p>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">Lucro mensal por margem</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Comparativo de Regimes */}
          {comparativo && modoComparacao && (
            <>
              {/* Melhor Regime */}
              {comparativo.melhorRegime && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">🏆 Melhor Regime</p>
                      <p className="text-3xl font-bold capitalize">{comparativo.melhorRegime}</p>
                    </div>
                    {comparativo.economia > 0 && (
                      <div className="text-right">
                        <p className="text-green-100">Economia mensal</p>
                        <p className="text-2xl font-bold">{formatarMoeda(comparativo.economia)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cards por Regime */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(comparativo.resultados).map(([regime, dados]) => (
                  <div 
                    key={regime}
                    className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                      regime === comparativo.melhorRegime ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <div className={`${coresRegime[regime].bg} p-4 text-white`}>
                      <h3 className="font-bold text-lg capitalize">
                        {regime === comparativo.melhorRegime && '🏆 '}
                        {regime === 'simples' ? 'Simples Nacional' : regime === 'presumido' ? 'Lucro Presumido' : 'Lucro Real'}
                      </h3>
                    </div>

                    {dados.erro ? (
                      <div className="p-4 text-red-600">
                        <p>⚠️ {dados.erro}</p>
                      </div>
                    ) : (
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Preço Sugerido</span>
                          <span className="font-bold">{formatarMoeda(dados.precos.precoSugerido)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Alíq. Efetiva</span>
                          <span className="font-medium">{dados.tributos.aliquotaEfetiva.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tributos/Mês</span>
                          <span className="text-red-600">-{formatarMoeda(dados.resultado.tributosMensais)}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">Lucro Líquido</span>
                          <span className="font-bold text-green-600">{formatarMoeda(dados.resultado.lucroLiquidoMensal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">Margem Real</span>
                          <span className="font-bold text-green-600">{dados.resultado.margemLiquidaReal.toFixed(2)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Estado Inicial */}
          {!resultado && !comparativo && !erro && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🧮</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Calcule seu preço ideal
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Preencha os dados ao lado para descobrir o preço mínimo de venda 
                e a margem líquida real do seu produto ou serviço.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Explicação */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Como funciona o cálculo?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Fórmula do Markup</h4>
            <div className="bg-gray-800 rounded-lg p-4 text-white font-mono text-sm">
              <p>Preço = Custo Total / (1 - Soma%)</p>
              <p className="text-gray-400 mt-2">Onde Soma% = Tributos + Desp.Var + Margem</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Custo Unitário Total</h4>
            <p className="text-gray-600 text-sm">
              Inclui o custo do produto/serviço mais o rateio das despesas fixas 
              (despesas fixas ÷ quantidade vendida). Isso garante que todas as 
              despesas fixas sejam cobertas pelas vendas.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm">
            <strong>⚠️ Importante:</strong> Este cálculo é uma estimativa simplificada. 
            Para decisões importantes, consulte seu contador para considerar todas as 
            particularidades do seu negócio.
          </p>
        </div>
      </div>

      {/* Artigo SEO */}
      <article className="mt-12 prose prose-lg prose-slate max-w-none">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Calculadora de Margem de Lucro: Como Precificar Corretamente Considerando Tributos e Custos
        </h2>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Introdução</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Uma das maiores causas de falência de empresas no Brasil não é falta de vendas — é a <strong>precificação errada</strong>. 
            Muitos empreendedores calculam o preço de venda somando o custo do produto com uma margem "que parece boa", sem considerar 
            <strong>tributos, despesas fixas, despesas variáveis e o lucro líquido real</strong>. O resultado? Empresas que vendem muito, 
            mas trabalham no vermelho. Ou pior: empresas que descobrem tarde demais que cada venda está gerando <strong>prejuízo</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            A <strong>Calculadora de Margem de Lucro</strong> foi criada justamente para resolver esse problema. Ela não apenas calcula 
            o preço de venda ideal considerando <strong>custos, despesas, tributos e margem de lucro desejada</strong> — ela também mostra 
            a <strong>margem líquida real</strong> (aquela que sobra de fato no seu bolso) e compara cenários entre diferentes regimes tributários.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Neste guia completo, vamos explicar <strong>como calcular margem de lucro corretamente, a diferença entre margem bruta e líquida, 
            como os tributos impactam seu preço, e por que usar uma calculadora especializada pode salvar sua empresa de prejuízos invisíveis</strong>.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">O Que É Margem de Lucro e Por Que Ela É Crucial</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A <strong>margem de lucro</strong> é o percentual do preço de venda que representa o lucro da empresa. Mas aqui está o problema: 
            existem <strong>dois tipos de margem</strong> — e confundi-las pode levar a decisões desastrosas.
          </p>

          <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">Margem Bruta vs. Margem Líquida</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
              <h5 className="font-bold text-blue-900 mb-2">📊 Margem Bruta</h5>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                É o lucro antes de descontar despesas operacionais, tributos e outras deduções. Muita gente calcula só isso e acha que está lucrando.
              </p>
              <div className="bg-white rounded p-3 font-mono text-sm">
                <p className="text-gray-900">Margem Bruta = ((Preço - Custo) / Preço) × 100</p>
              </div>
              <p className="text-gray-600 text-xs mt-2">
                Exemplo: Produto custa R$ 50, vende por R$ 100 → Margem bruta = 50%
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
              <h5 className="font-bold text-green-900 mb-2">💰 Margem Líquida (Real)</h5>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                É o lucro <strong>depois</strong> de pagar tributos, despesas fixas, despesas variáveis e todos os custos. É essa margem que importa de verdade.
              </p>
              <div className="bg-white rounded p-3 font-mono text-sm">
                <p className="text-gray-900">Margem Líquida = (Lucro Líquido / Receita) × 100</p>
              </div>
              <p className="text-gray-600 text-xs mt-2">
                Mesma venda, após tributos (15%) + despesas (10%) → Margem líquida = 25%
              </p>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg mb-4">
            <h5 className="font-bold text-red-900 mb-2">⚠️ Armadilha Comum: Ignorar a Margem Líquida</h5>
            <p className="text-gray-700 leading-relaxed">
              Muitos empresários pensam: "Minha margem é 40%, estou indo bem!" Mas quando somam <strong>tributos (10%-20%), 
              despesas fixas rateadas (15%), despesas variáveis (5%)</strong>, percebem que a margem líquida real é de apenas <strong>5% ou menos</strong>. 
              Às vezes, até <strong>negativa</strong>. Isso significa que cada venda está <strong>gerando prejuízo</strong>.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Como Calcular o Preço de Venda Correto (Com Tributos e Despesas)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Calcular o preço de venda não é simplesmente "custo + X%". É necessário usar a <strong>fórmula do markup</strong>, 
            que considera todos os percentuais que "comem" a receita: tributos, despesas variáveis e margem de lucro desejada.
          </p>

          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-indigo-900 mb-3">🧮 Fórmula do Markup (Método Correto)</h4>
            <div className="bg-white rounded-lg p-4 font-mono text-sm mb-3">
              <p className="text-gray-900 mb-2"><strong>Preço de Venda = Custo Total / (1 - Soma de Percentuais)</strong></p>
              <p className="text-gray-600">Onde Soma de Percentuais = % Tributos + % Despesas Variáveis + % Margem Desejada</p>
            </div>
            <p className="text-gray-700 text-sm">
              Essa fórmula garante que o preço final <strong>inclua todos os custos e ainda sobra a margem que você quer</strong>.
            </p>
          </div>

          <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">Passo a Passo do Cálculo</h4>
          <div className="space-y-4 mb-6">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
              <h5 className="font-bold text-gray-900 mb-2">1️⃣ Calcule o Custo Total Unitário</h5>
              <p className="text-gray-700 text-sm mb-3">
                <strong>Custo Total = Custo Direto do Produto + (Despesas Fixas Mensais / Quantidade Vendida por Mês)</strong>
              </p>
              <p className="text-gray-600 text-sm">
                Exemplo: Produto custa R$ 50; despesas fixas são R$ 10.000/mês; você vende 200 unidades/mês.
              </p>
              <div className="bg-gray-50 rounded p-3 font-mono text-sm mt-2">
                <p>Custo Total = R$ 50 + (R$ 10.000 / 200) = R$ 50 + R$ 50 = <strong>R$ 100</strong></p>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
              <h5 className="font-bold text-gray-900 mb-2">2️⃣ Some Todos os Percentuais que "Comem" a Receita</h5>
              <p className="text-gray-700 text-sm mb-3">
                Identifique: <strong>% de tributos</strong> (depende do regime tributário), <strong>% de despesas variáveis</strong> 
                (comissões, taxas de cartão, embalagens) e <strong>% de margem de lucro desejada</strong>.
              </p>
              <p className="text-gray-600 text-sm">Exemplo: Simples Nacional (alíquota 10%), despesas variáveis 5%, margem desejada 20%.</p>
              <div className="bg-gray-50 rounded p-3 font-mono text-sm mt-2">
                <p>Soma = 10% + 5% + 20% = <strong>35% (ou 0,35)</strong></p>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
              <h5 className="font-bold text-gray-900 mb-2">3️⃣ Aplique a Fórmula do Markup</h5>
              <p className="text-gray-700 text-sm mb-3">
                Agora divida o custo total pela diferença entre 1 e a soma dos percentuais.
              </p>
              <div className="bg-gray-50 rounded p-3 font-mono text-sm">
                <p>Preço de Venda = R$ 100 / (1 - 0,35) = R$ 100 / 0,65 = <strong>R$ 153,85</strong></p>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                Pronto! Vendendo a <strong>R$ 153,85</strong>, você cobre todos os custos, paga todos os tributos e despesas, 
                e ainda sobra <strong>20% de margem líquida</strong>.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-lg">
            <h5 className="font-bold text-yellow-900 mb-2">⚠️ Erro Comum: Somar Percentuais ao Custo</h5>
            <p className="text-gray-700 leading-relaxed">
              Muita gente faz assim: "Custo R$ 100, quero 35% de lucro → R$ 100 + 35% = R$ 135". <strong>Errado!</strong> 
              Nesse caso, os 35% incidem <strong>sobre o custo</strong>, não sobre o preço. Quando você vende a R$ 135, 
              os tributos e despesas (35%) comem R$ 47,25 — mas você calculou como se fossem apenas R$ 35. Resultado? Prejuízo invisível. 
              Use sempre a <strong>fórmula do markup</strong>!
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Exemplos Práticos de Cálculo de Margem</h3>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-3">✅ Exemplo 1: E-commerce de Vestuário (Simples Nacional)</h4>
            <p className="text-gray-700 mb-3">
              <strong>Dados:</strong> Uma loja online vende camisetas. Custo unitário (produto + frete fornecedor) = R$ 30. 
              Despesas fixas mensais (site, aluguel, funcionários) = R$ 6.000. Vende 300 camisetas/mês. 
              Despesas variáveis (frete cliente, embalagem, taxas) = 8% do preço. Simples Nacional Anexo I (alíquota média 7,5%). 
              Margem desejada: 25%.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-3 space-y-2">
              <p className="font-mono text-gray-900 text-sm">
                <strong>1.</strong> Custo Total = R$ 30 + (R$ 6.000 / 300) = R$ 30 + R$ 20 = <strong>R$ 50</strong>
              </p>
              <p className="font-mono text-gray-900 text-sm">
                <strong>2.</strong> Soma% = 7,5% (tributos) + 8% (desp.var) + 25% (margem) = <strong>40,5%</strong>
              </p>
              <p className="font-mono text-gray-900 text-sm">
                <strong>3.</strong> Preço = R$ 50 / (1 - 0,405) = R$ 50 / 0,595 = <strong>R$ 84,03</strong>
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              <strong>Resultado:</strong> Vendendo a <strong>R$ 84,03</strong> por camiseta, a loja cobre todos os custos, 
              paga todos os tributos e despesas, e garante <strong>25% de margem líquida</strong>. Lucro líquido mensal: cerca de R$ 6.300.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-3">✅ Exemplo 2: Consultoria de TI (Lucro Presumido)</h4>
            <p className="text-gray-700 mb-3">
              <strong>Dados:</strong> Uma consultoria vende horas de consultoria. Custo direto (salário do consultor alocado) = R$ 200/hora. 
              Despesas fixas (escritório, administrativo, marketing) = R$ 20.000/mês. Vende 200 horas/mês. 
              Despesas variáveis (comissão vendedor) = 5%. Lucro Presumido (IR 4,8% + CSLL 2,88% + PIS 0,65% + COFINS 3% + ISS 5% = ~16,33%). 
              Margem desejada: 30%.
            </p>
            <div className="bg-green-50 rounded-lg p-4 mb-3 space-y-2">
              <p className="font-mono text-gray-900 text-sm">
                <strong>1.</strong> Custo Total = R$ 200 + (R$ 20.000 / 200) = R$ 200 + R$ 100 = <strong>R$ 300</strong>
              </p>
              <p className="font-mono text-gray-900 text-sm">
                <strong>2.</strong> Soma% = 16,33% (tributos) + 5% (desp.var) + 30% (margem) = <strong>51,33%</strong>
              </p>
              <p className="font-mono text-gray-900 text-sm">
                <strong>3.</strong> Preço = R$ 300 / (1 - 0,5133) = R$ 300 / 0,4867 = <strong>R$ 616,38</strong>
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              <strong>Resultado:</strong> A consultoria deve cobrar <strong>R$ 616,38/hora</strong> para garantir margem de 30%. 
              Receita mensal: R$ 123.276. Lucro líquido mensal: cerca de R$ 37.000.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-3">❌ Exemplo 3: Erro Clássico — Não Ratear Despesas Fixas</h4>
            <p className="text-gray-700 mb-3">
              <strong>Situação:</strong> Um restaurante calcula o preço de um prato apenas somando custo dos ingredientes (R$ 20) 
              + 40% de margem = R$ 28. Mas não considera aluguel, salários da cozinha, conta de luz, gás — que somam R$ 15.000/mês 
              para 500 pratos vendidos (R$ 30/prato).
            </p>
            <div className="bg-red-50 rounded-lg p-4 mb-3">
              <p className="font-mono text-gray-900 text-sm mb-2">
                Custo real = R$ 20 (ingredientes) + R$ 30 (rateio fixo) = <strong>R$ 50/prato</strong>
              </p>
              <p className="font-mono text-gray-900 text-sm">
                Preço cobrado: R$ 28 → <strong>Prejuízo de R$ 22 por prato vendido!</strong>
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              <strong>Lição:</strong> Sempre ratear as despesas fixas na quantidade vendida. Nesse caso, o preço mínimo (sem lucro) seria 
              R$ 50. Com margem de 40% e tributos, o preço correto seria acima de <strong>R$ 100/prato</strong>.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Como os Tributos Impactam a Margem de Lucro</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A carga tributária no Brasil pode variar de <strong>6% a mais de 35%</strong> do faturamento, dependendo do regime tributário 
            e da atividade. Ignorar isso no cálculo de margem é um erro fatal.
          </p>

          <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">Comparativo de Alíquotas por Regime</h4>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Regime</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Atividade</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Alíquota Aproximada</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Impacto na Margem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3">Simples Nacional</td>
                  <td className="px-4 py-3">Comércio (Anexo I)</td>
                  <td className="px-4 py-3 font-medium">4% - 11,6%</td>
                  <td className="px-4 py-3 text-green-600">Baixo impacto</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3">Simples Nacional</td>
                  <td className="px-4 py-3">Serviços com Fator R ≥28% (Anexo III)</td>
                  <td className="px-4 py-3 font-medium">6% - 19,5%</td>
                  <td className="px-4 py-3 text-green-600">Baixo/Médio impacto</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Simples Nacional</td>
                  <td className="px-4 py-3">Serviços Fator R &lt;28% (Anexo V)</td>
                  <td className="px-4 py-3 font-medium">15,5% - 30,5%</td>
                  <td className="px-4 py-3 text-orange-600">Alto impacto</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3">Lucro Presumido</td>
                  <td className="px-4 py-3">Serviços</td>
                  <td className="px-4 py-3 font-medium">~16,33%</td>
                  <td className="px-4 py-3 text-yellow-600">Médio impacto</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Lucro Real</td>
                  <td className="px-4 py-3">Todos (varia conforme lucro efetivo)</td>
                  <td className="px-4 py-3 font-medium">9% - 34%+</td>
                  <td className="px-4 py-3 text-red-600">Variável (pode ser vantajoso ou não)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-5 rounded-lg">
            <h5 className="font-bold text-indigo-900 mb-2">💡 Dica: Compare Regimes para Maximizar Margem</h5>
            <p className="text-gray-700 leading-relaxed">
              Uma empresa de serviços com Fator R &lt; 28% pagará <strong>15,5%</strong> no Simples (Anexo V) na primeira faixa. 
              No Lucro Presumido, pagaria <strong>~16,33%</strong> — mas sem progressividade, o que pode compensar em faturamentos maiores. 
              Já no Lucro Real, se a margem de lucro real for baixa (ex.: 10%), a tributação pode cair para ~9%. 
              <strong>Simular cenários é essencial</strong> — use a função "Comparar Regimes" da calculadora acima.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Erros Comuns ao Calcular Margem de Lucro</h3>

          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
              <h4 className="font-bold text-red-900 mb-2">❌ Erro 1: Usar margem bruta como se fosse margem líquida</h4>
              <p className="text-gray-700 leading-relaxed">
                Calcular "custo R$ 50, vendo por R$ 100, tenho 50% de lucro" <strong>ignora tributos e despesas</strong>. 
                A margem líquida real pode ser de apenas 10% ou até negativa. Sempre calcule a margem líquida após todas as deduções.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
              <h4 className="font-bold text-red-900 mb-2">❌ Erro 2: Não ratear despesas fixas por unidade vendida</h4>
              <p className="text-gray-700 leading-relaxed">
                Aluguel, salários, energia — tudo isso precisa ser dividido pela quantidade vendida e somado ao custo unitário. 
                Ignorar esse rateio faz você achar que está lucrando quando na verdade está <strong>operando no prejuízo</strong>.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
              <h4 className="font-bold text-red-900 mb-2">❌ Erro 3: Esquecer despesas variáveis (taxas de cartão, comissões, fretes)</h4>
              <p className="text-gray-700 leading-relaxed">
                Taxas de maquininha (2%-5%), comissões de vendedores (5%-10%), frete (variável) — tudo isso "come" a receita. 
                Se você vende parcelado em 12x, a taxa pode chegar a <strong>12% do valor da venda</strong>. Inclua todas essas despesas no cálculo.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
              <h4 className="font-bold text-red-900 mb-2">❌ Erro 4: Usar o regime tributário errado no cálculo</h4>
              <p className="text-gray-700 leading-relaxed">
                Calcular usando alíquota do Simples, mas estar no Lucro Presumido (ou vice-versa) distorce completamente a margem. 
                Sempre confirme qual é o regime da sua empresa e use a alíquota correta.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
              <h4 className="font-bold text-red-900 mb-2">❌ Erro 5: Copiar preço do concorrente sem calcular seus próprios custos</h4>
              <p className="text-gray-700 leading-relaxed">
                O fato de o concorrente vender por R$ 100 não significa que <strong>você</strong> pode vender por R$ 100 e lucrar. 
                Seus custos, despesas e tributação podem ser diferentes. Calcule sempre com base na <strong>sua realidade</strong>.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Perguntas Frequentes sobre Margem de Lucro</h3>

          <div className="space-y-5">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">1. Qual é a margem de lucro ideal para meu negócio?</h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Depende do setor.</strong> Comércio eletrônico costuma ter margens de 15%-30%; serviços profissionais (consultorias, TI) 
                podem ter margens de 30%-50%; indústria geralmente opera com 10%-25%. Mas o mais importante é que sua margem 
                <strong>cubra todos os custos, despesas e tributos, e ainda permita reinvestimento e retirada de lucros</strong>. 
                Uma margem líquida mínima saudável é de <strong>15%-20%</strong>.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">2. Como calcular margem de lucro se eu vendo vários produtos diferentes?</h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Calcule produto por produto.</strong> Cada produto tem seu custo, seu volume de vendas e pode ter despesas variáveis diferentes 
                (ex.: frete mais caro para produtos pesados). Depois, você pode calcular uma <strong>margem média ponderada</strong> considerando 
                o mix de vendas. Mas nunca use uma margem única para todos os produtos sem calcular individualmente — alguns podem estar dando prejuízo.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">3. Markup e margem são a mesma coisa?</h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Não.</strong> <strong>Markup</strong> é o multiplicador que você aplica sobre o custo para chegar ao preço de venda 
                (ex.: markup 2,0x = preço é o dobro do custo). <strong>Margem</strong> é o percentual de lucro sobre o preço de venda. 
                Exemplo: custo R$ 50, preço R$ 100 → markup = 2,0x; margem bruta = 50%. Ambos são úteis, mas servem para coisas diferentes.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">4. Posso aumentar minha margem sem aumentar o preço?</h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sim!</strong> Existem três formas de aumentar margem: <strong>(1) Reduzir custos</strong> (negociar com fornecedores, 
                otimizar processos), <strong>(2) Reduzir despesas</strong> (cortar gastos desnecessários, automatizar tarefas), 
                <strong>(3) Mudar de regime tributário</strong> (às vezes um regime diferente reduz a carga tributária significativamente). 
                Use a calculadora para simular cenários e identificar onde você pode ganhar margem.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">5. Como sei se estou no regime tributário certo para maximizar minha margem?</h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Comparando os regimes.</strong> Use a função "Comparar Regimes" na calculadora acima — ela mostra lado a lado 
                o preço, os tributos e a margem líquida em Simples Nacional, Lucro Presumido e Lucro Real. Muitas empresas descobrem que 
                estão pagando <strong>30% a mais de impostos</strong> do que precisariam apenas por estarem no regime errado. 
                Consulte também um contador especializado para avaliar sua situação específica.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">6. Minha margem está negativa — o que fazer?</h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Ação imediata:</strong> pare de vender com prejuízo e recalcule seus preços usando a fórmula correta. 
                Se não puder aumentar o preço (concorrência), você precisa <strong>reduzir custos urgentemente</strong> ou até considerar 
                descontinuar produtos/serviços que não são viáveis. Margem negativa significa que <strong>cada venda está te afundando mais</strong>. 
                Não adianta "compensar no volume" — mais vendas = mais prejuízo.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Legislação e Base Legal Relacionada à Precificação e Tributação</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A precificação em si não é regulamentada por lei (você pode cobrar o preço que quiser, respeitando livre concorrência e defesa do consumidor). 
            Mas a <strong>tributação</strong> que impacta o cálculo de margem é regida por:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>
              <strong>Lei Complementar nº 123/2006 (Simples Nacional):</strong> Define as alíquotas progressivas dos anexos I a V e 
              as regras de enquadramento (Fator R, receita bruta, etc.). Fundamental para calcular a carga tributária de empresas no Simples.
            </li>
            <li>
              <strong>Lei nº 9.249/1995 (Lucro Presumido):</strong> Estabelece as presunções de lucro por atividade (8%, 16%, 32%) e as 
              alíquotas de IRPJ e CSLL aplicáveis ao lucro presumido. Relevante para empresas que optam por esse regime.
            </li>
            <li>
              <strong>Lei nº 9.430/1996 (Lucro Real):</strong> Disciplina a apuração do lucro real e as deduções permitidas. 
              Importante para empresas que apuram impostos sobre o lucro efetivo.
            </li>
            <li>
              <strong>Lei Complementar nº 116/2003 (ISS):</strong> Regula o Imposto Sobre Serviços (ISS), que varia de 2% a 5% conforme o município. 
              Impacta diretamente o cálculo de margem de empresas de serviços.
            </li>
            <li>
              <strong>Código de Defesa do Consumidor (Lei 8.078/1990):</strong> Proíbe preços abusivos e práticas comerciais enganosas. 
              Ao precificar, é importante considerar o equilíbrio entre lucro e ética comercial.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">
            Além disso, normas contábeis (NBC TG e CPC) orientam a <strong>apuração de custos, despesas e resultados</strong>, 
            fundamentais para o cálculo correto de margem. Sempre consulte um contador para garantir que sua empresa está em conformidade.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Conclusão: Calcule Sua Margem Corretamente e Evite Prejuízos Invisíveis</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Precificação não é chute, intuição ou "copiar o concorrente". É <strong>ciência</strong> — e uma ciência que pode salvar 
            (ou afundar) sua empresa. Calcular a margem de lucro corretamente, considerando <strong>custos reais, despesas fixas e variáveis, 
            tributos e a margem desejada</strong>, é a diferença entre ter um negócio lucrativo e trabalhar de graça (ou pior, no prejuízo).
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            A boa notícia é que, com as ferramentas certas, fazer esse cálculo é simples e rápido. Use a <strong>Calculadora de Margem</strong> 
            no topo desta página para:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>Descobrir o <strong>preço mínimo de venda</strong> (ponto de equilíbrio) e o <strong>preço sugerido</strong> com sua margem desejada</li>
            <li>Ver a <strong>margem líquida real</strong> depois de todos os descontos de tributos e despesas</li>
            <li>Simular cenários com diferentes margens e volumes de venda</li>
            <li>Comparar os <strong>três regimes tributários</strong> (Simples, Presumido, Real) lado a lado e identificar qual maximiza sua margem</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-6">
            Não deixe seu negócio no escuro. Calcule agora, tome decisões baseadas em dados reais e garanta que cada venda está 
            <strong>realmente gerando lucro</strong> — não apenas a ilusão de lucro.
          </p>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 text-center">
            <h4 className="text-2xl font-bold mb-3">🧮 Calcule Sua Margem de Lucro Agora (100% Grátis)</h4>
            <p className="text-indigo-100 mb-4">
              Descubra em segundos se você está precificando corretamente ou perdendo dinheiro em cada venda.
            </p>
            <a 
              href="#top" 
              className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-indigo-50 transition shadow-lg"
            >
              Usar Calculadora Grátis
            </a>
          </div>
        </section>
      </article>
    </div>
  );
}

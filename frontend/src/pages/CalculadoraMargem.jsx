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
    </div>
  );
}

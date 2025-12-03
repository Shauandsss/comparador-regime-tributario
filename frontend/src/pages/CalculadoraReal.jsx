import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CalculadoraReal() {
  const navigate = useNavigate();
  
  // Estados
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  
  // Formulário
  const [receita, setReceita] = useState('');
  const [despesas, setDespesas] = useState('');
  const [folha, setFolha] = useState('');
  const [periodo, setPeriodo] = useState('trimestral');
  const [considerarCreditos, setConsiderarCreditos] = useState(false);
  const [creditosPis, setCreditosPis] = useState('');
  const [creditosCofins, setCreditosCofins] = useState('');
  
  // Resultado
  const [resultado, setResultado] = useState(null);
  
  const formatarMoedaInput = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    const numero = parseFloat(numeros) / 100;
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  const converterParaNumero = (valorFormatado) => {
    if (!valorFormatado) return 0;
    return parseFloat(valorFormatado.replace(/[R$\s.]/g, '').replace(',', '.'));
  };
  
  const handleCalcular = async (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);
    
    const receitaNumero = converterParaNumero(receita);
    const despesasNumero = converterParaNumero(despesas);
    const folhaNumero = converterParaNumero(folha);
    const creditosPisNumero = considerarCreditos ? converterParaNumero(creditosPis) : 0;
    const creditosCofinsNumero = considerarCreditos ? converterParaNumero(creditosCofins) : 0;
    
    if (!receitaNumero || receitaNumero <= 0) {
      setErro('Informe uma receita válida');
      return;
    }
    
    // Cálculos de Lucro Real estão disponíveis no Comparador de Regimes
    setErro('Use o Comparador de Regimes Tributários para análise completa do Lucro Real, incluindo todos os impostos e comparações.');
    setLoading(false);
    
    // Redirecionar automaticamente após 3 segundos
    setTimeout(() => {
      navigate('/formulario');
    }, 3000);
  };
  
  const handleLimpar = () => {
    setReceita('');
    setDespesas('');
    setFolha('');
    setPeriodo('trimestral');
    setConsiderarCreditos(false);
    setCreditosPis('');
    setCreditosCofins('');
    setResultado(null);
    setErro('');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-orange-600 hover:text-orange-800 mb-4 flex items-center gap-2"
          >
            ← Voltar para Home
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💼 Calculadora Lucro Real
          </h1>
          <p className="text-gray-600">
            Calcule IRPJ, CSLL, PIS e COFINS com base no lucro contábil efetivo
          </p>
        </div>
        
        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleCalcular} className="space-y-6">
            
            {/* Receita Bruta */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Receita Bruta do Período *
              </label>
              <input
                type="text"
                value={receita}
                onChange={(e) => setReceita(formatarMoedaInput(e.target.value))}
                placeholder="R$ 0,00"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-lg"
                required
              />
            </div>
            
            {/* Despesas e Folha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Despesas Operacionais
                </label>
                <input
                  type="text"
                  value={despesas}
                  onChange={(e) => setDespesas(formatarMoedaInput(e.target.value))}
                  placeholder="R$ 0,00"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Custos operacionais, administrativos, comerciais
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Folha de Pagamento
                </label>
                <input
                  type="text"
                  value={folha}
                  onChange={(e) => setFolha(formatarMoedaInput(e.target.value))}
                  placeholder="R$ 0,00"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Salários + encargos trabalhistas
                </p>
              </div>
            </div>
            
            {/* Período */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Período de Apuração *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPeriodo('trimestral')}
                  className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                    periodo === 'trimestral'
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  📅 Trimestral
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodo('anual')}
                  className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                    periodo === 'anual'
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  📆 Anual
                </button>
              </div>
            </div>
            
            {/* Créditos PIS/COFINS */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="considerarCreditos"
                  checked={considerarCreditos}
                  onChange={(e) => setConsiderarCreditos(e.target.checked)}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="considerarCreditos" className="text-lg font-bold text-gray-800">
                  💰 Considerar Créditos PIS/COFINS (Regime Não-Cumulativo)
                </label>
              </div>
              
              {considerarCreditos && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Créditos de PIS (1,65%)
                    </label>
                    <input
                      type="text"
                      value={creditosPis}
                      onChange={(e) => setCreditosPis(formatarMoedaInput(e.target.value))}
                      placeholder="R$ 0,00"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Créditos de COFINS (7,6%)
                    </label>
                    <input
                      type="text"
                      value={creditosCofins}
                      onChange={(e) => setCreditosCofins(formatarMoedaInput(e.target.value))}
                      placeholder="R$ 0,00"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                    />
                  </div>
                </div>
              )}
              
              <p className="mt-3 text-sm text-green-800 bg-white bg-opacity-50 p-3 rounded-lg">
                ℹ️ <strong>Regime Não-Cumulativo:</strong> Permite créditos sobre insumos, energia, aluguel e outros. Consulte seu contador para calcular corretamente.
              </p>
            </div>
            
            {/* Mensagem de erro */}
            {erro && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 font-semibold">{erro}</p>
              </div>
            )}
            
            {/* Botões */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? '⏳ Calculando...' : '🧮 Calcular Tributos'}
              </button>
              
              <button
                type="button"
                onClick={handleLimpar}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                🗑️ Limpar
              </button>
            </div>
            
          </form>
        </div>
        
        {/* Resultado */}
        {resultado && (
          <div className="space-y-6">
            
            {/* Alerta de Prejuízo */}
            {resultado.apuracao.temPrejuizo && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <h3 className="font-bold text-xl text-yellow-900 mb-2">Empresa em Prejuízo</h3>
                    <p className="text-yellow-800 mb-2">
                      O lucro contábil é negativo, portanto <strong>não há IRPJ e CSLL a pagar</strong> neste período.
                    </p>
                    <p className="text-yellow-700 text-sm">
                      💡 Os prejuízos fiscais podem ser compensados em períodos futuros (limitado a 30% do lucro).
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Resumo Executivo */}
            <div className="bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">📈 Resumo Executivo</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-orange-100 text-sm mb-1">Receita Bruta</p>
                  <p className="text-2xl font-bold">{resultado.entrada.receitaFormatada}</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-orange-100 text-sm mb-1">Lucro Contábil</p>
                  <p className="text-2xl font-bold">{resultado.apuracao.lucroContabilFormatado}</p>
                  <p className="text-orange-100 text-xs mt-1">{resultado.apuracao.percentualLucro} da receita</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-orange-100 text-sm mb-1">Total de Tributos</p>
                  <p className="text-2xl font-bold">{resultado.resumo.totalTributosFormatado}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-orange-100 text-sm mb-1">Carga Tributária</p>
                  <p className="text-xl font-bold">{resultado.resumo.cargaTributaria}</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-orange-100 text-sm mb-1">Receita Líquida</p>
                  <p className="text-xl font-bold">{resultado.resumo.receitaLiquidaFormatada}</p>
                </div>
              </div>
              
              {resultado.resumo.economiaCreditos > 0 && (
                <div className="mt-6 bg-green-500/20 backdrop-blur rounded-lg p-4 border border-green-300">
                  <p className="text-green-100 text-sm mb-1">💰 Economia com Créditos PIS/COFINS</p>
                  <p className="text-2xl font-bold">{resultado.resumo.economiaCreditosFormatada}</p>
                  <p className="text-green-100 text-xs mt-1">
                    Sem créditos, a carga seria {resultado.resumo.cargaSemCreditos}
                  </p>
                </div>
              )}
            </div>
            
            {/* Detalhamento por Tributo */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🧾 Detalhamento dos Tributos</h2>
              
              {/* IRPJ */}
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-blue-900">IRPJ - Imposto de Renda Pessoa Jurídica</h3>
                  <span className="text-2xl font-bold text-blue-900">
                    {resultado.tributos.irpj.irpjTotalFormatado}
                  </span>
                </div>
                {!resultado.tributos.irpj.prejuizo ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700 font-semibold">Base de Cálculo</p>
                      <p className="text-blue-900 font-bold">{resultado.tributos.irpj.baseCalculoFormatada}</p>
                    </div>
                    <div>
                      <p className="text-blue-700 font-semibold">IRPJ Base (15%)</p>
                      <p className="text-blue-900 font-bold">{resultado.tributos.irpj.irpjBaseFormatado}</p>
                    </div>
                    <div>
                      <p className="text-blue-700 font-semibold">Adicional (10%)</p>
                      <p className="text-blue-900 font-bold">{resultado.tributos.irpj.adicionalFormatado}</p>
                    </div>
                    <div>
                      <p className="text-blue-700 font-semibold">Excedente</p>
                      <p className="text-blue-900 font-bold">{resultado.tributos.irpj.excedenteFormatado}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-blue-700 font-semibold">
                    ✅ Sem IRPJ devido ao prejuízo contábil de {resultado.tributos.irpj.prejuizoFormatado}
                  </p>
                )}
              </div>
              
              {/* CSLL */}
              <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-green-900">CSLL - Contribuição Social sobre Lucro Líquido</h3>
                  <span className="text-2xl font-bold text-green-900">
                    {resultado.tributos.csll.csllFormatada}
                  </span>
                </div>
                {!resultado.tributos.csll.prejuizo ? (
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-green-700 font-semibold">Base de Cálculo</p>
                      <p className="text-green-900 font-bold">{resultado.tributos.csll.baseCalculoFormatada}</p>
                    </div>
                    <div>
                      <p className="text-green-700 font-semibold">Alíquota</p>
                      <p className="text-green-900 font-bold">{resultado.tributos.csll.aliquota}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-green-700 font-semibold">
                    ✅ Sem CSLL devido ao prejuízo contábil
                  </p>
                )}
              </div>
              
              {/* PIS e COFINS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PIS */}
                <div className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-yellow-900">PIS</h3>
                    <span className="text-xl font-bold text-yellow-900">
                      {resultado.tributos.pis.pisAPagarFormatado}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-yellow-700">Débito ({resultado.tributos.pis.aliquota}):</span>
                      <span className="text-yellow-900 font-bold">{resultado.tributos.pis.pisDebitoFormatado}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-700">Créditos:</span>
                      <span className="text-yellow-900 font-bold">-{resultado.tributos.pis.creditosFormatados}</span>
                    </div>
                    <div className="border-t border-yellow-300 pt-2 flex justify-between">
                      <span className="text-yellow-700 font-semibold">A Pagar:</span>
                      <span className="text-yellow-900 font-bold">{resultado.tributos.pis.pisAPagarFormatado}</span>
                    </div>
                    <p className="text-yellow-600 text-xs mt-2">
                      Alíquota efetiva: {resultado.tributos.pis.aliquotaEfetiva}
                    </p>
                  </div>
                </div>
                
                {/* COFINS */}
                <div className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-orange-900">COFINS</h3>
                    <span className="text-xl font-bold text-orange-900">
                      {resultado.tributos.cofins.cofinsAPagarFormatado}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-orange-700">Débito ({resultado.tributos.cofins.aliquota}):</span>
                      <span className="text-orange-900 font-bold">{resultado.tributos.cofins.cofinsDebitoFormatado}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-700">Créditos:</span>
                      <span className="text-orange-900 font-bold">-{resultado.tributos.cofins.creditosFormatados}</span>
                    </div>
                    <div className="border-t border-orange-300 pt-2 flex justify-between">
                      <span className="text-orange-700 font-semibold">A Pagar:</span>
                      <span className="text-orange-900 font-bold">{resultado.tributos.cofins.cofinsAPagarFormatado}</span>
                    </div>
                    <p className="text-orange-600 text-xs mt-2">
                      Alíquota efetiva: {resultado.tributos.cofins.aliquotaEfetiva}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gráfico de Composição */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Composição dos Tributos</h2>
              
              <div className="space-y-4">
                {resultado.detalhamento.tributosPorTipo.map((tributo, index) => {
                  const cores = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500'];
                  const percentual = parseFloat(tributo.percentual);
                  const largura = resultado.resumo.cargaTributariaDecimal > 0 
                    ? (percentual / resultado.resumo.cargaTributariaDecimal) * 100 
                    : 0;
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-gray-700">{tributo.nome}</span>
                        <span className="text-gray-600">{tributo.percentual}% da receita</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-full ${cores[index]} transition-all duration-500`}
                          style={{ width: `${largura}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Vantagens do Lucro Real */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-lg">
              <h3 className="font-bold text-green-900 mb-3 text-xl">✅ Vantagens do Lucro Real</h3>
              <div className="space-y-2 text-green-800">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Tributação sobre lucro efetivo:</strong> Você paga apenas sobre o que realmente lucrou</span>
                </div>
                {resultado.vantagens.creditosPisCofins && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span><strong>Créditos de PIS/COFINS:</strong> Economia de {resultado.resumo.economiaCreditosFormatada} neste período</span>
                  </div>
                )}
                {resultado.vantagens.compensacaoPrejuizos && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span><strong>Compensação de prejuízos:</strong> Prejuízos podem ser usados para reduzir tributos futuros</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Ideal para margens baixas:</strong> Empresas com margens reduzidas pagam menos impostos</span>
                </div>
              </div>
            </div>
            
            {/* Observações */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-3">ℹ️ Observações Importantes</h3>
              <ul className="space-y-2 text-blue-800">
                {resultado.detalhamento.observacoes.map((obs, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        )}
        
      </div>

      {/* ========== ARTIGO SEO ========== */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-lg max-w-none">
          
          {/* Introdução */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              💼 Lucro Real: Guia Completo do Regime Tributário Mais Preciso
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              O <strong>Lucro Real</strong> é o regime tributário em que o IRPJ (Imposto de Renda Pessoa Jurídica) e a CSLL 
              (Contribuição Social sobre o Lucro Líquido) são calculados sobre o <strong>lucro líquido contábil efetivo</strong> 
              da empresa, ajustado pelas adições, exclusões e compensações previstas na legislação fiscal. É o regime mais 
              complexo, porém também o mais justo, pois tributa exatamente o resultado real apurado pela empresa.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Este regime é <strong>obrigatório</strong> para empresas com faturamento anual superior a R$ 78 milhões, 
              instituições financeiras, factorings, empresas com lucros no exterior, entre outras. Para demais empresas, 
              é uma <strong>opção estratégica</strong> quando a margem de lucro é baixa, há prejuízos fiscais a compensar 
              ou existem altos custos dedutíveis que justificam a apuração detalhada.
            </p>
          </div>

          {/* Como Funciona */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">⚙️</span>
              Como Funciona o Lucro Real
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-orange-900 mb-3">1️⃣ Apuração do Lucro Contábil</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  A empresa mantém <strong>escrituração contábil completa</strong>, seguindo os princípios contábeis e 
                  legislação comercial. O lucro contábil é a diferença entre receitas e todas as despesas operacionais:
                </p>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="font-mono text-orange-900">
                    <strong>Lucro Contábil = Receitas - (Custos + Despesas Operacionais)</strong>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-red-900 mb-3">2️⃣ Ajustes Fiscais (LALUR)</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  O lucro contábil sofre <strong>ajustes fiscais</strong> no LALUR (Livro de Apuração do Lucro Real):
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">+</span>
                    <span><strong>Adições:</strong> despesas não dedutíveis (multas, brindes acima do limite, provisões não aceitas)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">-</span>
                    <span><strong>Exclusões:</strong> receitas não tributáveis (dividendos recebidos, reversões de provisões)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">-</span>
                    <span><strong>Compensações:</strong> prejuízos fiscais de anos anteriores (até 30% do lucro)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-blue-900 mb-3">3️⃣ Cálculo dos Tributos</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-bold text-blue-900 mb-1">IRPJ (Imposto de Renda)</p>
                    <p className="text-blue-700 text-sm">15% sobre lucro real até R$ 60.000/trimestre</p>
                    <p className="text-blue-700 text-sm">+ 10% adicional sobre excedente</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-bold text-green-900 mb-1">CSLL (Contribuição Social)</p>
                    <p className="text-green-700 text-sm">9% sobre o lucro real ajustado</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="font-bold text-yellow-900 mb-1">PIS (Não-Cumulativo)</p>
                    <p className="text-yellow-700 text-sm">1,65% sobre receita bruta com direito a créditos</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="font-bold text-orange-900 mb-1">COFINS (Não-Cumulativo)</p>
                    <p className="text-orange-700 text-sm">7,6% sobre receita bruta com direito a créditos</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-purple-900 mb-3">4️⃣ Modalidades de Apuração</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <p className="font-bold text-purple-900 mb-1">Trimestral</p>
                    <p className="text-gray-700 text-sm">
                      Apuração a cada trimestre (31/mar, 30/jun, 30/set, 31/dez). Pagamento único ou em até 3 parcelas. 
                      Opção definitiva e irretratável para o ano-calendário.
                    </p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <p className="font-bold text-indigo-900 mb-1">Anual (com antecipações mensais)</p>
                    <p className="text-gray-700 text-sm">
                      Pagamentos mensais por estimativa (balancetes) ou receita bruta mensal. Ajuste anual no final do ano. 
                      Mais flexibilidade, ideal para empresas com sazonalidade.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Obrigatoriedade */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              Quem é Obrigado ao Lucro Real?
            </h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">Empresas com Faturamento Elevado</h3>
                <p className="text-red-800">
                  Receita bruta total no ano-calendário anterior <strong>superior a R$ 78.000.000,00</strong> 
                  (ou R$ 6.500.000,00 multiplicado pelo número de meses de atividade no ano anterior, se inferior a 12 meses).
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">Instituições Financeiras</h3>
                <p className="text-red-800">
                  Bancos comerciais, de investimento, desenvolvimento, sociedades de crédito/financiamento/investimento, 
                  caixas econômicas, cooperativas de crédito, empresas de arrendamento mercantil, seguradoras, 
                  entidades de previdência privada aberta.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">Atividades Específicas</h3>
                <ul className="text-red-800 space-y-1">
                  <li>• Factoring (fomento mercantil)</li>
                  <li>• Empresas com lucros, rendimentos ou ganhos de capital oriundos do exterior</li>
                  <li>• Empresas com benefícios fiscais de redução ou isenção de impostos</li>
                  <li>• Empresas que explorem atividades de securitização de créditos imobiliários</li>
                  <li>• Sociedades de propósito específico (SPE) em alguns casos</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h3 className="font-bold text-green-900 mb-2">Opção Facultativa</h3>
                <p className="text-green-800">
                  Demais empresas não obrigadas podem <strong>optar pelo Lucro Real</strong> se for mais vantajoso. 
                  A opção é manifestada no primeiro pagamento do IRPJ do ano ou na primeira declaração.
                </p>
              </div>
            </div>
          </div>

          {/* Exemplo Prático */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">💡</span>
              Exemplo Prático de Apuração
            </h2>
            
            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cenário: Indústria Metalúrgica</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-2"><strong>Dados do Trimestre:</strong></p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Receita Bruta: R$ 2.000.000</li>
                    <li>• (-) CMV: R$ 800.000</li>
                    <li>• (-) Despesas Operacionais: R$ 600.000</li>
                    <li>• (-) Folha de Pagamento: R$ 400.000</li>
                    <li>• Lucro Contábil: R$ 200.000</li>
                  </ul>
                </div>
                <div>
                  <p className="text-gray-700 mb-2"><strong>Ajustes Fiscais:</strong></p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• (+) Multas de trânsito: R$ 5.000</li>
                    <li>• (+) Brindes excessivos: R$ 3.000</li>
                    <li>• (-) Dividendos recebidos: R$ 10.000</li>
                    <li>• (-) Prejuízo fiscal anterior: R$ 20.000</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 border-l-4 border-orange-500">
                <h4 className="font-bold text-orange-900 mb-2">Passo 1: Lucro Contábil</h4>
                <p className="text-lg font-mono text-orange-600">R$ 2.000.000 - R$ 1.800.000 = R$ 200.000</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-red-500">
                <h4 className="font-bold text-red-900 mb-2">Passo 2: Adições (despesas não dedutíveis)</h4>
                <p className="text-gray-700 mb-1">Multas de trânsito + Brindes excessivos</p>
                <p className="text-lg font-mono text-red-600">R$ 5.000 + R$ 3.000 = R$ 8.000</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-green-500">
                <h4 className="font-bold text-green-900 mb-2">Passo 3: Exclusões (receitas não tributáveis)</h4>
                <p className="text-gray-700 mb-1">Dividendos recebidos de outras empresas</p>
                <p className="text-lg font-mono text-green-600">R$ 10.000</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-900 mb-2">Passo 4: Base de Cálculo IRPJ/CSLL</h4>
                <p className="text-gray-700 mb-1">Lucro Contábil + Adições - Exclusões</p>
                <p className="text-lg font-mono text-blue-600 mb-2">R$ 200.000 + R$ 8.000 - R$ 10.000 = R$ 198.000</p>
                <p className="text-gray-700 mb-1">(-) Compensação prejuízo anterior (limite 30%)</p>
                <p className="text-lg font-mono text-blue-600">R$ 198.000 - R$ 20.000 = R$ 178.000</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-indigo-500">
                <h4 className="font-bold text-indigo-900 mb-2">Passo 5: IRPJ</h4>
                <p className="text-gray-700 mb-1">15% sobre R$ 60.000 + 10% sobre excedente</p>
                <p className="text-lg font-mono text-indigo-600 mb-2">
                  (R$ 60.000 × 15%) + (R$ 118.000 × 10%) = R$ 9.000 + R$ 11.800
                </p>
                <p className="text-xl font-bold text-indigo-900">IRPJ = R$ 20.800</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-purple-500">
                <h4 className="font-bold text-purple-900 mb-2">Passo 6: CSLL</h4>
                <p className="text-gray-700 mb-1">9% sobre base de R$ 178.000</p>
                <p className="text-lg font-mono text-purple-600 mb-2">R$ 178.000 × 9% = R$ 16.020</p>
                <p className="text-xl font-bold text-purple-900">CSLL = R$ 16.020</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-yellow-500">
                <h4 className="font-bold text-yellow-900 mb-2">Passo 7: PIS Não-Cumulativo</h4>
                <p className="text-gray-700 mb-1">1,65% sobre receita bruta - créditos sobre insumos</p>
                <p className="text-lg font-mono text-yellow-600 mb-1">Débito: R$ 2.000.000 × 1,65% = R$ 33.000</p>
                <p className="text-gray-700 text-sm mb-1">Créditos sobre CMV: R$ 800.000 × 1,65% = R$ 13.200</p>
                <p className="text-xl font-bold text-yellow-900">PIS a Pagar = R$ 19.800</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-orange-500">
                <h4 className="font-bold text-orange-900 mb-2">Passo 8: COFINS Não-Cumulativa</h4>
                <p className="text-gray-700 mb-1">7,6% sobre receita bruta - créditos sobre insumos</p>
                <p className="text-lg font-mono text-orange-600 mb-1">Débito: R$ 2.000.000 × 7,6% = R$ 152.000</p>
                <p className="text-gray-700 text-sm mb-1">Créditos sobre CMV: R$ 800.000 × 7,6% = R$ 60.800</p>
                <p className="text-xl font-bold text-orange-900">COFINS a Pagar = R$ 91.200</p>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6">
                <h4 className="font-bold text-xl mb-4">📊 Total Trimestral</h4>
                <div className="grid md:grid-cols-2 gap-4 text-lg">
                  <div>
                    <p>IRPJ: R$ 20.800</p>
                    <p>CSLL: R$ 16.020</p>
                    <p>PIS: R$ 19.800</p>
                    <p>COFINS: R$ 91.200</p>
                  </div>
                  <div className="md:text-right">
                    <p className="text-2xl font-bold">Total: R$ 147.820</p>
                    <p className="text-sm opacity-90">Carga tributária: 7,39%</p>
                    <p className="text-sm opacity-90 mt-2">Economia de R$ 74.000 em créditos PIS/COFINS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LALUR */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">📖</span>
              LALUR - Livro de Apuração do Lucro Real
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              O <strong>LALUR</strong> é uma escrituração fiscal obrigatória para empresas do Lucro Real, dividida em duas partes:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Parte A - Registro de Apuração</h3>
                <p className="text-blue-800 mb-3">
                  Registra os ajustes do lucro líquido contábil para chegar ao lucro real:
                </p>
                <ul className="space-y-2 text-blue-700 text-sm">
                  <li>• Lucro/prejuízo contábil do período</li>
                  <li>• Adições (despesas indedutíveis)</li>
                  <li>• Exclusões (receitas não tributáveis)</li>
                  <li>• Compensações (prejuízos anteriores)</li>
                  <li>• Lucro real (ou prejuízo fiscal)</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-900 mb-3">Parte B - Controle de Valores</h3>
                <p className="text-green-800 mb-3">
                  Controla valores que afetarão a apuração futura:
                </p>
                <ul className="space-y-2 text-green-700 text-sm">
                  <li>• Prejuízos fiscais a compensar</li>
                  <li>• Base negativa de CSLL</li>
                  <li>• Depreciação acelerada incentivada</li>
                  <li>• Valores temporários a adicionar/excluir</li>
                  <li>• Controle de provisões</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm text-yellow-800">
                <strong>💡 Dica:</strong> A partir de 2014, o LALUR passou a ser escriturado digitalmente na ECF 
                (Escrituração Contábil Fiscal), substituindo o livro físico. Os conceitos e controles permanecem os mesmos.
              </p>
            </div>
          </div>

          {/* Créditos PIS/COFINS */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">💰</span>
              Créditos de PIS/COFINS no Regime Não-Cumulativo
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Uma das <strong>maiores vantagens</strong> do Lucro Real é o direito a créditos de PIS (1,65%) e COFINS (7,6%) 
              sobre diversas aquisições, reduzindo significativamente a carga tributária efetiva.
            </p>

            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-green-900 mb-4">✅ Principais Créditos Permitidos</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Insumos:</strong> matérias-primas, embalagens, materiais de consumo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Energia elétrica:</strong> consumida no processo produtivo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Aluguéis:</strong> de prédios, máquinas e equipamentos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Mercadorias para revenda:</strong> no caso de comércio</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Frete:</strong> nas operações de venda</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Armazenagem:</strong> e movimentação de mercadorias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Depreciação:</strong> de máquinas e equipamentos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Devoluções:</strong> de vendas tributadas</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-900 mb-4">❌ O que NÃO Gera Crédito</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600">✗</span>
                  <span>Mão de obra (folha de pagamento)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">✗</span>
                  <span>Despesas com marketing e publicidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">✗</span>
                  <span>Serviços de consultoria, jurídicos e contábeis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">✗</span>
                  <span>Despesas financeiras (juros, IOF)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">✗</span>
                  <span>Combustível de veículos (exceto transporte de carga)</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 p-4 bg-emerald-100 border-l-4 border-emerald-500 rounded">
              <p className="text-sm text-emerald-900">
                <strong>💡 Exemplo Real:</strong> Uma indústria com R$ 1 milhão em receita e R$ 600 mil em insumos paga 
                PIS/COFINS sobre apenas R$ 400 mil (diferença), resultando em economia de aproximadamente R$ 55 mil 
                em relação ao regime cumulativo.
              </p>
            </div>
          </div>

          {/* Vantagens e Desvantagens */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">⚖️</span>
              Vantagens e Desvantagens do Lucro Real
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  Vantagens
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-green-900">Tributação justa:</strong>
                      <p className="text-green-700 text-sm">Paga sobre lucro efetivo, ideal para margens baixas</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-green-900">Créditos PIS/COFINS:</strong>
                      <p className="text-green-700 text-sm">Redução significativa com regime não-cumulativo</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-green-900">Compensação de prejuízos:</strong>
                      <p className="text-green-700 text-sm">Prejuízos podem reduzir tributos futuros (30% ao ano)</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-green-900">Dedução de despesas:</strong>
                      <p className="text-green-700 text-sm">Todos os custos e despesas dedutíveis reduzem base de cálculo</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-green-900">Flexibilidade:</strong>
                      <p className="text-green-700 text-sm">Apuração trimestral ou anual conforme estratégia</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">❌</span>
                  Desvantagens
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <div>
                      <strong className="text-red-900">Complexidade contábil:</strong>
                      <p className="text-red-700 text-sm">Exige escrituração completa e controles rigorosos</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <div>
                      <strong className="text-red-900">Muitas obrigações acessórias:</strong>
                      <p className="text-red-700 text-sm">ECD, ECF, EFD-Contribuições, DCTF, entre outras</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <div>
                      <strong className="text-red-900">Custos operacionais elevados:</strong>
                      <p className="text-red-700 text-sm">Necessidade de contador especializado e sistemas robustos</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <div>
                      <strong className="text-red-900">Fiscalização intensa:</strong>
                      <p className="text-red-700 text-sm">Maior risco de auditoria e questionamentos fiscais</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <div>
                      <strong className="text-red-900">Desvantajoso para alta margem:</strong>
                      <p className="text-red-700 text-sm">Empresas com margem elevada pagariam menos no Presumido</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quando Optar */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              Quando Optar pelo Lucro Real?
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-green-900 mb-3">✅ Situações Ideais</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>Margem de lucro baixa:</strong> empresas com lucro inferior a 8% (comércio) ou 32% (serviços)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>Altos custos dedutíveis:</strong> despesas operacionais significativas (folha, marketing, etc)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>Prejuízos fiscais acumulados:</strong> possibilidade de compensar prejuízos anteriores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>Muitas compras para revenda/insumos:</strong> aproveitamento de créditos PIS/COFINS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>Empresas obrigadas:</strong> faturamento acima de R$ 78 milhões, financeiras, factoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>Exportadoras:</strong> receitas de exportação têm alíquota zero de PIS/COFINS</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-red-900 mb-3">❌ Quando Evitar</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Alta margem de lucro:</strong> empresas com margens superiores a 32% pagariam menos no Presumido</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Estrutura contábil inadequada:</strong> falta de sistemas e pessoal qualificado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Pequeno porte:</strong> empresas com faturamento abaixo de R$ 4,8 milhões (elegíveis ao Simples)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Poucos custos diretos:</strong> empresas de serviços com estrutura enxuta e alta margem</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">💡 Dica Estratégica</h3>
                <p className="leading-relaxed">
                  Faça uma <strong>simulação comparativa</strong> entre Lucro Real e Lucro Presumido considerando suas 
                  projeções de receita, custos e despesas para os próximos 12 meses. Considere contratar consultoria 
                  tributária especializada para avaliar qual regime resulta em menor carga tributária efetiva. A economia 
                  pode chegar a 30-40% em alguns casos!
                </p>
              </div>
            </div>
          </div>

          {/* Obrigações Acessórias */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">📑</span>
              Obrigações Acessórias no Lucro Real
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-orange-900 mb-3">Mensais</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">📄</span>
                    <span><strong>EFD-Contribuições:</strong> Escrituração Fiscal Digital de PIS/COFINS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">📄</span>
                    <span><strong>DCTF:</strong> Declaração de Débitos e Créditos Tributários Federais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">📄</span>
                    <span><strong>eSocial:</strong> Informações trabalhistas e previdenciárias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">📄</span>
                    <span><strong>SPED Fiscal:</strong> escrituração de ICMS/IPI (quando aplicável)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-900 mb-3">Anuais</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">📄</span>
                    <span><strong>ECD:</strong> Escrituração Contábil Digital (obrigatória)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">📄</span>
                    <span><strong>ECF:</strong> Escrituração Contábil Fiscal (substitui DIPJ e LALUR)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">📄</span>
                    <span><strong>EFD-Reinf:</strong> Retenções federais e outras informações</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">📄</span>
                    <span><strong>DIRF:</strong> Declaração do IR Retido na Fonte</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-red-100 border-l-4 border-red-500 rounded">
              <p className="text-sm text-red-900">
                <strong>⚠️ Atenção:</strong> O não cumprimento das obrigações acessórias pode resultar em multas que 
                variam de R$ 500 a R$ 1.500.000, dependendo da infração e do porte da empresa. A entrega em atraso 
                também gera multas proporcionais ao faturamento.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">❓</span>
              Perguntas Frequentes sobre Lucro Real
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">1. Qual a diferença entre Lucro Real trimestral e anual?</h3>
                <p className="text-gray-700">
                  <strong>Trimestral:</strong> apuração definitiva a cada 3 meses, pagamento único ou em 3 parcelas. 
                  <strong>Anual:</strong> pagamentos mensais por estimativa (baseados em balancetes ou percentuais de receita), 
                  com ajuste final no balanço de 31/dezembro. O anual oferece mais flexibilidade para empresas com sazonalidade, 
                  permitindo antecipar menos em meses de prejuízo.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">2. Posso compensar 100% dos prejuízos fiscais acumulados?</h3>
                <p className="text-gray-700">
                  <strong>Não.</strong> A compensação de prejuízos fiscais está limitada a <strong>30% do lucro real</strong> 
                  apurado em cada período. Ou seja, se sua empresa teve R$ 100.000 de lucro, pode compensar no máximo R$ 30.000 
                  de prejuízos anteriores. O saldo remanescente fica acumulado para períodos futuros, sem prazo de prescrição.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">3. Como funciona o regime não-cumulativo de PIS/COFINS?</h3>
                <p className="text-gray-700">
                  No <strong>regime não-cumulativo</strong>, as alíquotas são maiores (1,65% + 7,6%), mas você tem direito a 
                  <strong>créditos sobre insumos, mercadorias para revenda, energia, aluguéis</strong> e outras aquisições. 
                  O imposto a pagar é a diferença entre débitos (sobre vendas) e créditos (sobre compras). Empresas com muitas 
                  aquisições tributadas se beneficiam significativamente.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">4. Preciso mudar para Lucro Real se ultrapassar R$ 78 milhões?</h3>
                <p className="text-gray-700">
                  <strong>Sim.</strong> A partir do mês seguinte ao que o faturamento acumulado superar R$ 78 milhões, a empresa 
                  é <strong>obrigada</strong> a calcular IRPJ e CSLL pelo Lucro Real. Se estava no Lucro Presumido, deve realizar 
                  levantamento de balanço ou balancete e apurar o lucro real. Para o ano seguinte, a opção pelo Lucro Real torna-se 
                  obrigatória desde janeiro.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">5. O que são adições e exclusões no LALUR?</h3>
                <p className="text-gray-700">
                  <strong>Adições</strong> são despesas contabilizadas que não podem ser deduzidas fiscalmente (multas, brindes 
                  excessivos, provisões não aceitas) - aumentam o lucro tributável. <strong>Exclusões</strong> são receitas 
                  contabilizadas mas não tributáveis (dividendos recebidos, reversões de provisões) - diminuem o lucro tributável. 
                  Ambas ajustam o lucro contábil para chegar ao lucro fiscal.
                </p>
              </div>

              <div className="border-l-4 border-indigo-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">6. Posso distribuir lucros sem tributação no Lucro Real?</h3>
                <p className="text-gray-700">
                  <strong>Sim, mas com regras.</strong> Lucros distribuídos são isentos de IR para sócios, desde que: 
                  (1) estejam contabilizados como lucro contábil, (2) sejam distribuídos dentro dos limites apurados após 
                  tributos, (3) a empresa esteja regular com obrigações tributárias. Valores distribuídos acima do lucro contábil 
                  são considerados rendimentos tributáveis para os sócios.
                </p>
              </div>

              <div className="border-l-4 border-pink-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">7. Qual o prazo para pagamento dos tributos no Lucro Real?</h3>
                <p className="text-gray-700">
                  <strong>Trimestral:</strong> até o último dia útil do mês seguinte ao trimestre (ex: 1º tri vence 30/abr), 
                  podendo parcelar em até 3 vezes. <strong>Anual:</strong> pagamentos mensais por estimativa até último dia útil 
                  do mês seguinte, com ajuste final na ECF. <strong>PIS/COFINS:</strong> dia 25 do mês seguinte. Atrasos geram 
                  multa de 0,33% ao dia (máximo 20%) + juros SELIC.
                </p>
              </div>
            </div>
          </div>

          {/* Base Legal */}
          <div className="bg-gray-100 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">⚖️</span>
              Legislação e Base Legal
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">📜 Lei nº 8.981/1995</h3>
                <p className="text-gray-700 text-sm">
                  Alterou a legislação tributária federal sobre o IRPJ, estabelecendo as bases do Lucro Real.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">📜 Decreto-Lei nº 1.598/1977</h3>
                <p className="text-gray-700 text-sm">
                  Regulamenta a apuração do Lucro Real, LALUR e procedimentos de tributação.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">📜 Lei nº 9.430/1996</h3>
                <p className="text-gray-700 text-sm">
                  Dispõe sobre o IRPJ, CSLL, PIS e COFINS, estabelecendo regras de apuração e pagamento.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">📜 Instrução Normativa RFB nº 1.700/2017</h3>
                <p className="text-gray-700 text-sm">
                  Dispõe sobre a determinação e o pagamento do IRPJ e da CSLL no regime de tributação com base no Lucro Real.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">📜 Lei nº 10.637/2002 e Lei nº 10.833/2003</h3>
                <p className="text-gray-700 text-sm">
                  Instituem o regime não-cumulativo de PIS e COFINS aplicável ao Lucro Real.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl shadow-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">🎯 Descubra se o Lucro Real é Ideal para sua Empresa</h2>
            <p className="text-xl mb-6 opacity-90">
              Use nossa calculadora acima para simular sua carga tributária no Lucro Real e compare com outros regimes. 
              A escolha correta pode resultar em economia de dezenas de milhares de reais por ano!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                📊 Calcular Agora
              </button>
              <button
                onClick={() => navigate('/comparador')}
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
              >
                🔄 Comparar Todos os Regimes
              </button>
            </div>
          </div>

        </article>
      </div>
    </div>
  );
}

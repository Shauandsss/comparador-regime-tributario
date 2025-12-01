import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/real/calcular`, {
        receita: receitaNumero,
        despesas: despesasNumero,
        folha: folhaNumero,
        creditosPis: creditosPisNumero,
        creditosCofins: creditosCofinsNumero,
        periodo
      });
      
      if (response.data.sucesso) {
        setResultado(response.data);
      } else {
        setErro(response.data.erro || 'Erro ao calcular');
      }
      
    } catch (error) {
      console.error('Erro ao calcular:', error);
      setErro(error.response?.data?.erro || 'Erro ao calcular. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIAS_DESPESAS = [
  { key: 'insumos', nome: 'Insumos', icon: '📦', descricao: 'Matéria-prima, materiais de produção' },
  { key: 'energia', nome: 'Energia Elétrica', icon: '⚡', descricao: 'Consumo no estabelecimento' },
  { key: 'aluguel', nome: 'Aluguéis', icon: '🏢', descricao: 'Prédios, máquinas e equipamentos' },
  { key: 'frete', nome: 'Fretes', icon: '🚚', descricao: 'Transporte de mercadorias' },
  { key: 'armazenagem', nome: 'Armazenagem', icon: '📦', descricao: 'Armazenagem de mercadoria' },
  { key: 'encargosDepreciacao', nome: 'Depreciação', icon: '📉', descricao: 'Depreciação de bens' },
  { key: 'bensVendidos', nome: 'Bens p/ Revenda', icon: '🛒', descricao: 'Mercadorias para revenda' },
  { key: 'devolucoesVendas', nome: 'Devoluções', icon: '↩️', descricao: 'Devoluções de vendas' }
];

export default function SimuladorCreditos() {
  const navigate = useNavigate();
  
  // Estados
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [modoSimulacao, setModoSimulacao] = useState(false);
  
  // Formulário
  const [receitaBruta, setReceitaBruta] = useState('');
  const [despesas, setDespesas] = useState({
    insumos: '',
    energia: '',
    aluguel: '',
    frete: '',
    armazenagem: '',
    encargosDepreciacao: '',
    bensVendidos: '',
    devolucoesVendas: ''
  });
  
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
  
  const handleDespesaChange = (key, valor) => {
    setDespesas(prev => ({
      ...prev,
      [key]: formatarMoedaInput(valor)
    }));
  };
  
  const handleCalcular = async (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);
    
    const despesasNumeros = {};
    let temDespesa = false;
    
    Object.keys(despesas).forEach(key => {
      const valor = converterParaNumero(despesas[key]);
      if (valor > 0) {
        despesasNumeros[key] = valor;
        temDespesa = true;
      }
    });
    
    if (!temDespesa) {
      setErro('Informe pelo menos uma despesa');
      return;
    }
    
    // Créditos de PIS/COFINS são calculados no comparador de regimes
    setErro('Esta funcionalidade está integrada ao Comparador de Regimes Tributários. Use o comparador para análise completa incluindo créditos de PIS/COFINS.');
    setLoading(false);
    
    // Opcional: redirecionar automaticamente após 3 segundos
    setTimeout(() => {
      navigate('/formulario');
    }, 3000);
  };
  
  const handleLimpar = () => {
    setReceitaBruta('');
    setDespesas({
      insumos: '',
      energia: '',
      aluguel: '',
      frete: '',
      armazenagem: '',
      encargosDepreciacao: '',
      bensVendidos: '',
      devolucoesVendas: ''
    });
    setResultado(null);
    setErro('');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-green-600 hover:text-green-800 mb-4 flex items-center gap-2"
          >
            ← Voltar para Home
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💰 Simulador de Créditos PIS/COFINS
          </h1>
          <p className="text-gray-600">
            Calcule créditos permitidos no regime não-cumulativo do Lucro Real
          </p>
        </div>
        
        {/* Modo de Cálculo */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Modo de Cálculo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setModoSimulacao(false)}
              className={`py-4 px-6 rounded-lg border-2 font-semibold transition-all ${
                !modoSimulacao
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="text-2xl mb-2">🧮</div>
              <div className="font-bold mb-1">Calcular Créditos</div>
              <div className="text-sm opacity-90">Apenas os créditos gerados</div>
            </button>
            
            <button
              type="button"
              onClick={() => setModoSimulacao(true)}
              className={`py-4 px-6 rounded-lg border-2 font-semibold transition-all ${
                modoSimulacao
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-bold mb-1">Simular Economia</div>
              <div className="text-sm opacity-90">Comparar com e sem créditos</div>
            </button>
          </div>
        </div>
        
        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleCalcular} className="space-y-6">
            
            {/* Receita Bruta (apenas no modo simulação) */}
            {modoSimulacao && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <label className="block text-lg font-bold text-gray-800 mb-3">
                  💵 Receita Bruta do Período *
                </label>
                <input
                  type="text"
                  value={receitaBruta}
                  onChange={(e) => setReceitaBruta(formatarMoedaInput(e.target.value))}
                  placeholder="R$ 0,00"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg"
                  required={modoSimulacao}
                />
                <p className="mt-2 text-sm text-blue-700">
                  ℹ️ Necessário para calcular débitos de PIS/COFINS e comparar a economia
                </p>
              </div>
            )}
            
            {/* Despesas */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📋 Despesas que Geram Créditos
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Informe os valores das despesas. Créditos: PIS 1,65% + COFINS 7,6% = 9,25% do total
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CATEGORIAS_DESPESAS.map((cat) => (
                  <div key={cat.key} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{cat.icon}</span>
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-700">
                          {cat.nome}
                        </label>
                        <p className="text-xs text-gray-500">{cat.descricao}</p>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={despesas[cat.key]}
                      onChange={(e) => handleDespesaChange(cat.key, e.target.value)}
                      placeholder="R$ 0,00"
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
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
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? '⏳ Calculando...' : modoSimulacao ? '📊 Simular Economia' : '🧮 Calcular Créditos'}
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
            
            {/* Modo Simulação */}
            {modoSimulacao && resultado.economia && (
              <>
                {/* Resumo de Economia */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold mb-6">💰 Economia com Créditos</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <p className="text-green-100 text-sm mb-1">Economia Mensal</p>
                      <p className="text-3xl font-bold">{resultado.economia.valorFormatado}</p>
                      <p className="text-green-100 text-sm mt-1">{resultado.economia.percentual} de redução</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <p className="text-green-100 text-sm mb-1">Economia Anual</p>
                      <p className="text-3xl font-bold">{resultado.economia.economiaAnualFormatada}</p>
                      <p className="text-green-100 text-sm mt-1">Projeção 12 meses</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <p className="text-green-100 text-sm mb-1">Receita Bruta</p>
                      <p className="text-2xl font-bold">{resultado.receita.valorFormatado}</p>
                    </div>
                  </div>
                </div>
                
                {/* Comparação */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sem Créditos */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-red-200">
                    <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                      <span className="text-2xl">❌</span>
                      Sem Créditos
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-gray-700">PIS (1,65%)</span>
                        <span className="font-bold text-red-900">{resultado.semCreditos.pisDebitoFormatado}</span>
                      </div>
                      
                      <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-gray-700">COFINS (7,6%)</span>
                        <span className="font-bold text-red-900">{resultado.semCreditos.cofinsDebitoFormatado}</span>
                      </div>
                      
                      <div className="flex justify-between p-4 bg-red-100 rounded-lg border-2 border-red-300">
                        <span className="font-bold text-gray-800">Total a Pagar</span>
                        <span className="font-bold text-xl text-red-900">{resultado.semCreditos.totalFormatado}</span>
                      </div>
                      
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-600">Carga Tributária</p>
                        <p className="text-2xl font-bold text-red-900">{resultado.semCreditos.cargaTributaria}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Com Créditos */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200">
                    <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                      <span className="text-2xl">✅</span>
                      Com Créditos
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700 text-sm">PIS Débito</span>
                          <span className="font-bold text-gray-800">{resultado.comCreditos.pisDebitoFormatado}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-green-700 text-sm">- Créditos PIS</span>
                          <span className="font-bold text-green-700">-{resultado.comCreditos.creditosPisFormatado}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-green-200">
                          <span className="font-semibold">A Pagar</span>
                          <span className="font-bold text-green-900">{resultado.comCreditos.pisAPagarFormatado}</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700 text-sm">COFINS Débito</span>
                          <span className="font-bold text-gray-800">{resultado.comCreditos.cofinsDebitoFormatado}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-green-700 text-sm">- Créditos COFINS</span>
                          <span className="font-bold text-green-700">-{resultado.comCreditos.creditosCofinsFormatado}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-green-200">
                          <span className="font-semibold">A Pagar</span>
                          <span className="font-bold text-green-900">{resultado.comCreditos.cofinsAPagarFormatado}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between p-4 bg-green-100 rounded-lg border-2 border-green-300">
                        <span className="font-bold text-gray-800">Total a Pagar</span>
                        <span className="font-bold text-xl text-green-900">{resultado.comCreditos.totalFormatado}</span>
                      </div>
                      
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Carga Tributária</p>
                        <p className="text-2xl font-bold text-green-900">{resultado.comCreditos.cargaTributaria}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Detalhamento dos Créditos */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Detalhamento dos Créditos</h2>
              
              {/* Resumo dos Créditos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border-2 border-yellow-200">
                  <p className="text-yellow-700 text-sm mb-1">Créditos PIS (1,65%)</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {(resultado.detalhamentoCreditos || resultado).creditos.pis.totalFormatado}
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border-2 border-orange-200">
                  <p className="text-orange-700 text-sm mb-1">Créditos COFINS (7,6%)</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {(resultado.detalhamentoCreditos || resultado).creditos.cofins.totalFormatado}
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
                  <p className="text-green-700 text-sm mb-1">Total de Créditos</p>
                  <p className="text-2xl font-bold text-green-900">
                    {(resultado.detalhamentoCreditos || resultado).creditos.totalFormatado}
                  </p>
                </div>
              </div>
              
              {/* Tabela de Créditos por Categoria */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                      <th className="text-left p-3 font-bold text-gray-700">Categoria</th>
                      <th className="text-right p-3 font-bold text-gray-700">Despesa</th>
                      <th className="text-right p-3 font-bold text-gray-700">Crédito PIS</th>
                      <th className="text-right p-3 font-bold text-gray-700">Crédito COFINS</th>
                      <th className="text-right p-3 font-bold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(resultado.detalhamentoCreditos || resultado).detalhamento.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-semibold text-gray-800">{item.nome}</div>
                          <div className="text-xs text-gray-500">{item.descricao}</div>
                        </td>
                        <td className="text-right p-3 font-semibold">{item.valorDespesaFormatado}</td>
                        <td className="text-right p-3 text-yellow-700 font-semibold">{item.creditoPisFormatado}</td>
                        <td className="text-right p-3 text-orange-700 font-semibold">{item.creditoCofinsFormatado}</td>
                        <td className="text-right p-3 text-green-700 font-bold">{item.totalCreditoFormatado}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-green-100 border-t-2 border-green-300">
                      <td className="p-3 font-bold text-gray-800">TOTAL</td>
                      <td className="text-right p-3 font-bold">
                        {(resultado.detalhamentoCreditos || resultado).entrada.totalDespesasFormatado}
                      </td>
                      <td className="text-right p-3 font-bold text-yellow-900">
                        {(resultado.detalhamentoCreditos || resultado).creditos.pis.totalFormatado}
                      </td>
                      <td className="text-right p-3 font-bold text-orange-900">
                        {(resultado.detalhamentoCreditos || resultado).creditos.cofins.totalFormatado}
                      </td>
                      <td className="text-right p-3 font-bold text-xl text-green-900">
                        {(resultado.detalhamentoCreditos || resultado).creditos.totalFormatado}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            {/* Observações */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-3">ℹ️ Requisitos para Créditos PIS/COFINS</h3>
              <ul className="space-y-2 text-blue-800">
                {(resultado.detalhamentoCreditos || resultado).simulacao.requisitos.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{req}</span>
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
              💰 Créditos de PIS e COFINS: Guia Completo para Recuperar Impostos
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Os <strong>créditos de PIS e COFINS</strong> são um dos principais benefícios do regime não-cumulativo, 
              disponível para empresas tributadas pelo <strong>Lucro Real</strong>. Este mecanismo permite que as empresas 
              recuperem parte dos impostos pagos em suas aquisições de insumos, mercadorias, serviços e outros itens 
              utilizados na atividade operacional, reduzindo significativamente a carga tributária efetiva.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Enquanto no regime cumulativo (Lucro Presumido e Simples Nacional) as alíquotas são menores mas não há direito 
              a créditos, no <strong>regime não-cumulativo</strong> as alíquotas são 1,65% (PIS) e 7,6% (COFINS), porém com 
              direito a créditos sobre diversas aquisições. O imposto a pagar é a diferença entre débitos (sobre vendas) e 
              créditos (sobre compras), resultando em economia substancial para empresas com alto volume de custos dedutíveis.
            </p>
          </div>

          {/* Regimes: Cumulativo vs Não-Cumulativo */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🔄</span>
              Regime Cumulativo vs Não-Cumulativo
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-red-900 mb-4">❌ Regime Cumulativo</h3>
                <div className="space-y-3">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="font-bold text-red-900 mb-1">Alíquotas</p>
                    <p className="text-red-700">PIS: 0,65% | COFINS: 3,00%</p>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span><strong>Sem direito a créditos</strong> sobre aquisições</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Tributação em <strong>cascata</strong> (incide sobre valor total)</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Aplicável ao <strong>Lucro Presumido</strong></span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Cálculo simples: Receita × Alíquota</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Vantajoso para <strong>baixo custo operacional</strong></span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-green-900 mb-4">✅ Regime Não-Cumulativo</h3>
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-bold text-green-900 mb-1">Alíquotas</p>
                    <p className="text-green-700">PIS: 1,65% | COFINS: 7,6%</p>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span><strong>Direito a créditos</strong> sobre insumos e custos</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Tributação sobre <strong>valor agregado</strong></span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Aplicável ao <strong>Lucro Real</strong></span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Cálculo: Débitos - Créditos</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Vantajoso para <strong>alto custo operacional</strong></span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-100 border-l-4 border-blue-500 rounded">
              <p className="text-sm text-blue-900">
                <strong>💡 Exemplo:</strong> Uma empresa com R$ 1 milhão em receita e R$ 600 mil em insumos pagaria 
                R$ 36.500 no regime cumulativo (3,65% de R$ 1 MM), mas apenas R$ 14.600 no não-cumulativo 
                (9,25% de R$ 400 mil de valor agregado), economizando <strong>R$ 21.900</strong>!
              </p>
            </div>
          </div>

          {/* O que são Créditos */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">📚</span>
              O que são Créditos de PIS e COFINS?
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Créditos de PIS e COFINS são <strong>valores que a empresa pode descontar</strong> dos débitos apurados sobre 
              suas vendas, calculados aplicando as mesmas alíquotas (1,65% e 7,6%) sobre determinadas aquisições permitidas 
              pela legislação. O conceito é similar ao ICMS: você paga imposto ao vender, mas recupera o que foi pago nas compras.
            </p>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-green-900 mb-4">📊 Fórmula de Cálculo</h3>
              <div className="space-y-3 font-mono text-lg">
                <p className="text-gray-800"><strong>Débitos:</strong> Receita de Vendas × 9,25% (1,65% + 7,6%)</p>
                <p className="text-gray-800"><strong>Créditos:</strong> Aquisições Permitidas × 9,25%</p>
                <p className="text-2xl font-bold text-green-900 mt-4">
                  PIS/COFINS a Pagar = Débitos - Créditos
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Importante:</strong> Os créditos só podem ser aproveitados se a aquisição estiver 
                relacionada à atividade da empresa e for feita de fornecedor que também está no regime não-cumulativo 
                ou que tenha destacado PIS/COFINS na nota fiscal.
              </p>
            </div>
          </div>

          {/* Lista de Créditos Permitidos */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">✅</span>
              O que Gera Direito a Crédito?
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📦</span>
                  1. Bens e Serviços Utilizados como Insumos
                </h3>
                <p className="text-gray-700 mb-3">
                  <strong>Insumo</strong> é todo bem ou serviço aplicado ou consumido na <strong>produção ou fabricação</strong> 
                  de bens destinados à venda ou na prestação de serviços. Conceito amplo segundo o STJ:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Matérias-primas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Produtos intermediários</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Materiais de embalagem</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Materiais de consumo (usados na produção)</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Ferramentas e utensílios</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Peças de reposição de máquinas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Combustíveis e lubrificantes (produção)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Água industrial</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  2. Energia Elétrica e Térmica
                </h3>
                <p className="text-gray-700">
                  Energia consumida nos <strong>estabelecimentos da empresa</strong>, incluindo produção, administração e vendas. 
                  Crédito integral sobre o consumo total do estabelecimento.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🏢</span>
                  3. Aluguéis de Prédios, Máquinas e Equipamentos
                </h3>
                <p className="text-gray-700 mb-2">
                  Locação de bens utilizados nas atividades da empresa:
                </p>
                <ul className="space-y-1 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Aluguel de imóveis comerciais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Locação de máquinas e equipamentos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Leasing operacional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Aluguel de veículos (uso empresarial)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🛒</span>
                  4. Bens para Revenda
                </h3>
                <p className="text-gray-700">
                  Para empresas comerciais: <strong>mercadorias adquiridas para revenda</strong>. O crédito é calculado sobre 
                  o valor de aquisição das mercadorias que serão comercializadas sem transformação.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🚚</span>
                  5. Fretes e Armazenagem
                </h3>
                <p className="text-gray-700 mb-2">
                  Serviços relacionados à movimentação de mercadorias:
                </p>
                <ul className="space-y-1 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Frete na aquisição de insumos/mercadorias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Frete na venda (pago pela empresa vendedora)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Armazenagem de mercadorias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Movimentação interna</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📉</span>
                  6. Depreciação e Amortização
                </h3>
                <p className="text-gray-700 mb-2">
                  Crédito mensal sobre depreciação/amortização de:
                </p>
                <ul className="space-y-1 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">•</span>
                    <span>Máquinas e equipamentos (produção)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">•</span>
                    <span>Edificações (estabelecimento)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">•</span>
                    <span>Benfeitorias em imóveis de terceiros</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">•</span>
                    <span>Softwares e intangíveis</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">↩️</span>
                  7. Devoluções de Vendas e Descontos
                </h3>
                <p className="text-gray-700">
                  Crédito sobre <strong>vendas canceladas ou devolvidas</strong> que foram anteriormente tributadas, 
                  bem como descontos incondicionais concedidos.
                </p>
              </div>
            </div>
          </div>

          {/* O que NÃO gera crédito */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">❌</span>
              O que NÃO Gera Direito a Crédito?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-900 mb-3">Mão de Obra</h3>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• Salários e pró-labore</li>
                  <li>• Encargos sociais (INSS, FGTS)</li>
                  <li>• Benefícios (vale-transporte, alimentação)</li>
                  <li>• Treinamentos e capacitação</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-900 mb-3">Despesas Administrativas</h3>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• Serviços de consultoria</li>
                  <li>• Serviços jurídicos e contábeis</li>
                  <li>• Marketing e publicidade</li>
                  <li>• Telefone e internet</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-900 mb-3">Despesas Financeiras</h3>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• Juros de empréstimos</li>
                  <li>• IOF e tarifas bancárias</li>
                  <li>• Despesas com cartões de crédito</li>
                  <li>• Variações cambiais</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-900 mb-3">Outras Exclusões</h3>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• Combustível de veículos (exceto produção/transporte)</li>
                  <li>• Material de limpeza e higiene</li>
                  <li>• Seguros (exceto sobre estoque)</li>
                  <li>• Viagens e hospedagens</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 rounded">
              <p className="text-sm text-red-900">
                <strong>⚠️ Atenção:</strong> O aproveitamento indevido de créditos pode resultar em autuação fiscal 
                com multa de 75% sobre o valor do crédito apurado indevidamente, além de juros SELIC.
              </p>
            </div>
          </div>

          {/* Exemplo Prático Detalhado */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">💡</span>
              Exemplo Prático: Indústria de Alimentos
            </h2>
            
            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cenário</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-2"><strong>Receita do Mês:</strong></p>
                  <p className="text-2xl font-bold text-blue-600 mb-4">R$ 1.000.000</p>
                  
                  <p className="text-gray-700 mb-2"><strong>Débitos PIS/COFINS:</strong></p>
                  <p className="text-gray-700">PIS (1,65%): R$ 16.500</p>
                  <p className="text-gray-700">COFINS (7,6%): R$ 76.000</p>
                  <p className="text-xl font-bold text-blue-900 mt-2">Total Débitos: R$ 92.500</p>
                </div>
                <div>
                  <p className="text-gray-700 mb-2"><strong>Aquisições do Mês:</strong></p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Matéria-prima: R$ 400.000</li>
                    <li>• Embalagens: R$ 80.000</li>
                    <li>• Energia elétrica: R$ 30.000</li>
                    <li>• Frete: R$ 20.000</li>
                    <li>• Aluguel galpão: R$ 15.000</li>
                  </ul>
                  <p className="text-xl font-bold text-green-900 mt-2">Total Aquisições: R$ 545.000</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 border-l-4 border-green-500">
                <h4 className="font-bold text-green-900 mb-2">Passo 1: Calcular Créditos</h4>
                <p className="text-gray-700 mb-2">Aquisições com direito a crédito × 9,25%</p>
                <div className="space-y-1 text-gray-700">
                  <p>PIS (1,65%): R$ 545.000 × 1,65% = <strong className="text-green-600">R$ 8.992,50</strong></p>
                  <p>COFINS (7,6%): R$ 545.000 × 7,6% = <strong className="text-green-600">R$ 41.420,00</strong></p>
                </div>
                <p className="text-xl font-bold text-green-900 mt-3">Total Créditos: R$ 50.412,50</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-900 mb-2">Passo 2: Apurar PIS/COFINS a Pagar</h4>
                <p className="text-gray-700 mb-2">Débitos - Créditos</p>
                <div className="space-y-1 text-gray-700">
                  <p>PIS: R$ 16.500 - R$ 8.992,50 = <strong className="text-blue-600">R$ 7.507,50</strong></p>
                  <p>COFINS: R$ 76.000 - R$ 41.420 = <strong className="text-blue-600">R$ 34.580,00</strong></p>
                </div>
                <p className="text-xl font-bold text-blue-900 mt-3">Total a Pagar: R$ 42.087,50</p>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6">
                <h4 className="font-bold text-xl mb-4">📊 Comparação: Cumulativo vs Não-Cumulativo</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-lg mb-2 opacity-90">Regime Cumulativo</p>
                    <p className="text-sm mb-1">R$ 1.000.000 × 3,65% = R$ 36.500</p>
                    <p className="text-2xl font-bold">R$ 36.500</p>
                  </div>
                  <div>
                    <p className="text-lg mb-2 opacity-90">Regime Não-Cumulativo</p>
                    <p className="text-sm mb-1">R$ 92.500 - R$ 50.412,50</p>
                    <p className="text-2xl font-bold">R$ 42.087,50</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/30">
                  <p className="text-lg">
                    Neste exemplo, o regime <strong>cumulativo seria mais vantajoso</strong>, pois a empresa tem margem 
                    de contribuição elevada (45,5%). Empresas com custos acima de 60% geralmente se beneficiam mais do não-cumulativo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Requisitos para Crédito */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">📋</span>
              Requisitos para Aproveitamento de Créditos
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                <h3 className="text-lg font-bold text-blue-900 mb-3">1. Documento Fiscal Válido</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Nota fiscal eletrônica (NF-e ou NFS-e) com destaque de PIS/COFINS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>CNPJ do fornecedor regular na Receita Federal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Descrição clara dos produtos/serviços</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
                <h3 className="text-lg font-bold text-green-900 mb-3">2. Relação com a Atividade</h3>
                <ul className="space-y-2 text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Aquisição deve estar <strong>relacionada à produção</strong> de bens ou prestação de serviços</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Comprovação de <strong>essencialidade e relevância</strong> para a atividade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Nexo de causalidade entre aquisição e receita tributada</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded">
                <h3 className="text-lg font-bold text-purple-900 mb-3">3. Regime do Fornecedor</h3>
                <ul className="space-y-2 text-purple-800">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Fornecedor <strong>não pode estar no Simples Nacional</strong> (sem destaque de PIS/COFINS)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Fornecedor deve estar no Lucro Real ou Presumido (com destaque)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Verificar regime tributário antes de grandes aquisições</span>
                  </li>
                </ul>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded">
                <h3 className="text-lg font-bold text-orange-900 mb-3">4. Escrituração Fiscal</h3>
                <ul className="space-y-2 text-orange-800">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Lançamento na <strong>EFD-Contribuições</strong> (arquivo digital mensal)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Controle de estoque e custos (quando aplicável)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Documentação organizada para eventual fiscalização</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Vantagens e Desvantagens */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">⚖️</span>
              Vantagens e Desafios do Regime Não-Cumulativo
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-green-900 mb-4">✅ Vantagens</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <strong className="text-green-900">Economia significativa:</strong>
                      <p className="text-green-700 text-sm">Empresas com custos elevados economizam 30-50%</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <strong className="text-green-900">Justiça fiscal:</strong>
                      <p className="text-green-700 text-sm">Tributa apenas valor agregado pela empresa</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <strong className="text-green-900">Competitividade:</strong>
                      <p className="text-green-700 text-sm">Permite precificação mais competitiva</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <strong className="text-green-900">Recuperação de impostos:</strong>
                      <p className="text-green-700 text-sm">Valores expressivos retornam ao caixa</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-red-900 mb-4">⚠️ Desafios</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">✗</span>
                    <div>
                      <strong className="text-red-900">Complexidade operacional:</strong>
                      <p className="text-red-700 text-sm">Controle rigoroso de documentos e lançamentos</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">✗</span>
                    <div>
                      <strong className="text-red-900">Risco de autuação:</strong>
                      <p className="text-red-700 text-sm">Crédito indevido gera multa de 75%</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">✗</span>
                    <div>
                      <strong className="text-red-900">Dependência de fornecedores:</strong>
                      <p className="text-red-700 text-sm">Fornecedor no Simples impede crédito</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">✗</span>
                    <div>
                      <strong className="text-red-900">Custos de compliance:</strong>
                      <p className="text-red-700 text-sm">Sistema ERP e contabilidade especializada</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">❓</span>
              Perguntas Frequentes sobre Créditos PIS/COFINS
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">1. Empresa no Lucro Presumido pode aproveitar créditos de PIS/COFINS?</h3>
                <p className="text-gray-700">
                  <strong>Não.</strong> O Lucro Presumido está no <strong>regime cumulativo</strong>, com alíquotas menores 
                  (0,65% + 3%), mas sem direito a créditos. Somente empresas no <strong>Lucro Real</strong> podem aproveitar 
                  créditos no regime não-cumulativo (1,65% + 7,6%).
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">2. O que acontece se eu tomar crédito indevidamente?</h3>
                <p className="text-gray-700">
                  A Receita Federal pode <strong>glosar o crédito</strong> (cancelar) e aplicar multa de <strong>75% do valor</strong> 
                  do crédito indevido, além de juros SELIC desde a apuração. Em casos de fraude comprovada, pode haver crime 
                  tributário. É essencial ter assessoria contábil especializada.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">3. Posso tomar crédito sobre compras de fornecedores do Simples Nacional?</h3>
                <p className="text-gray-700">
                  <strong>Não.</strong> Empresas do Simples Nacional recolhem tributos em guia única (DAS) e não destacam 
                  PIS/COFINS na nota fiscal. Sem o destaque, não há direito ao crédito. Por isso, muitas empresas do Lucro Real 
                  preferem fornecedores também no Lucro Real ou Presumido.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">4. Como funciona o crédito sobre energia elétrica?</h3>
                <p className="text-gray-700">
                  A empresa pode tomar <strong>crédito integral</strong> sobre toda energia consumida nos estabelecimentos, 
                  incluindo áreas administrativas. Basta aplicar 9,25% (1,65% + 7,6%) sobre o valor da conta de energia. 
                  É um dos créditos mais relevantes para indústrias.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">5. Posso acumular créditos de PIS/COFINS?</h3>
                <p className="text-gray-700">
                  <strong>Sim.</strong> Se em determinado mês os créditos superarem os débitos, o saldo credor fica acumulado 
                  para ser compensado em meses seguintes. Empresas exportadoras, por exemplo, frequentemente acumulam créditos 
                  (vendas com alíquota zero, mas créditos sobre insumos).
                </p>
              </div>

              <div className="border-l-4 border-indigo-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">6. Crédito sobre aluguel só vale para imóveis produtivos?</h3>
                <p className="text-gray-700">
                  <strong>Não.</strong> O crédito de aluguel é permitido sobre <strong>prédios, máquinas e equipamentos</strong> 
                  utilizados nas atividades da empresa, incluindo escritórios administrativos. O importante é que estejam 
                  relacionados às operações da empresa.
                </p>
              </div>

              <div className="border-l-4 border-pink-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">7. Vale a pena contratar assessoria para gestão de créditos?</h3>
                <p className="text-gray-700">
                  <strong>Sim, especialmente para empresas médias/grandes.</strong> Uma consultoria especializada pode identificar 
                  créditos não aproveitados, garantir conformidade e evitar autuações. Muitas empresas recuperam valores expressivos 
                  (dezenas de milhares por mês) com análise detalhada de créditos.
                </p>
              </div>
            </div>
          </div>

          {/* Legislação */}
          <div className="bg-gray-100 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">⚖️</span>
              Legislação Aplicável
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">📜 Lei nº 10.637/2002</h3>
                <p className="text-gray-700 text-sm">
                  Dispõe sobre a não-cumulatividade na cobrança da contribuição para o PIS/Pasep.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">📜 Lei nº 10.833/2003</h3>
                <p className="text-gray-700 text-sm">
                  Altera a legislação tributária federal e institui a não-cumulatividade da COFINS.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">📜 Instrução Normativa RFB nº 1.911/2019</h3>
                <p className="text-gray-700 text-sm">
                  Dispõe sobre a apuração, cobrança, fiscalização, arrecadação e administração da Contribuição para o PIS/Pasep 
                  e da COFINS.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">📜 Súmula CARF nº 66</h3>
                <p className="text-gray-700 text-sm">
                  "O conceito de insumo deve ser aferido à luz dos critérios de essencialidade ou relevância" - amplia 
                  interpretação do que pode gerar crédito.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">💰 Calcule seus Créditos de PIS/COFINS</h2>
            <p className="text-xl mb-6 opacity-90">
              Use nosso simulador acima ou o Comparador de Regimes Tributários para descobrir quanto sua empresa 
              pode economizar aproveitando créditos de PIS e COFINS!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                📊 Simular Créditos
              </button>
              <button
                onClick={() => navigate('/comparador')}
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
              >
                🔄 Comparar Regimes
              </button>
            </div>
          </div>

        </article>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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
    
    setLoading(true);
    
    try {
      let response;
      
      if (modoSimulacao) {
        const receitaNumero = converterParaNumero(receitaBruta);
        
        if (!receitaNumero || receitaNumero <= 0) {
          setErro('Informe a receita bruta para simulação');
          setLoading(false);
          return;
        }
        
        response = await axios.post(`${API_URL}/creditos/simular`, {
          receitaBruta: receitaNumero,
          ...despesasNumeros
        });
      } else {
        response = await axios.post(`${API_URL}/creditos/calcular`, despesasNumeros);
      }
      
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
    </div>
  );
}

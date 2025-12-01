import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function CalculadoraPresumido() {
  const navigate = useNavigate();
  
  // Estados
  const [loading, setLoading] = useState(false);
  const [atividades, setAtividades] = useState([]);
  const [erro, setErro] = useState('');
  
  // Formulário
  const [receita, setReceita] = useState('');
  const [atividade, setAtividade] = useState('');
  const [periodo, setPeriodo] = useState('trimestral');
  const [aliquotaISS, setAliquotaISS] = useState('');
  const [aplicaISS, setAplicaISS] = useState(false);
  
  // Resultado
  const [resultado, setResultado] = useState(null);
  
  // Carregar atividades ao montar
  useEffect(() => {
    carregarAtividades();
  }, []);
  
  const carregarAtividades = async () => {
    try {
      const response = await axios.get(`${API_URL}/presumido/atividades`);
      if (response.data.sucesso) {
        setAtividades(response.data.atividades);
      }
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    }
  };
  
  const formatarMoedaInput = (valor) => {
    // Remove tudo exceto números
    const numeros = valor.replace(/\D/g, '');
    
    // Converte para número e divide por 100
    const numero = parseFloat(numeros) / 100;
    
    // Formata como moeda
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  const handleReceitaChange = (e) => {
    const valor = e.target.value;
    setReceita(formatarMoedaInput(valor));
  };
  
  const converterParaNumero = (valorFormatado) => {
    return parseFloat(valorFormatado.replace(/[R$\s.]/g, '').replace(',', '.'));
  };
  
  const handleCalcular = async (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);
    
    // Validações
    const receitaNumero = converterParaNumero(receita);
    
    if (!receitaNumero || receitaNumero <= 0) {
      setErro('Informe uma receita válida');
      return;
    }
    
    if (!atividade) {
      setErro('Selecione o tipo de atividade');
      return;
    }
    
    const issNumero = aplicaISS && aliquotaISS ? parseFloat(aliquotaISS) : 0;
    
    if (aplicaISS && (issNumero < 2 || issNumero > 5)) {
      setErro('Alíquota de ISS deve estar entre 2% e 5%');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/presumido/calcular`, {
        receita: receitaNumero,
        atividade,
        periodo,
        aliquotaISS: issNumero
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
    setAtividade('');
    setPeriodo('trimestral');
    setAliquotaISS('');
    setAplicaISS(false);
    setResultado(null);
    setErro('');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-800 mb-4 flex items-center gap-2"
          >
            ← Voltar para Home
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Calculadora Lucro Presumido
          </h1>
          <p className="text-gray-600">
            Calcule IRPJ, CSLL, PIS, COFINS e ISS no regime de Lucro Presumido
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
                onChange={handleReceitaChange}
                placeholder="R$ 0,00"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-lg"
                required
              />
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
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  📅 Trimestral
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodo('mensal')}
                  className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                    periodo === 'mensal'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  📆 Mensal
                </button>
              </div>
            </div>
            
            {/* Tipo de Atividade */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Atividade *
              </label>
              <select
                value={atividade}
                onChange={(e) => setAtividade(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                required
              >
                <option value="">Selecione a atividade</option>
                {atividades.map((atv) => (
                  <option key={atv.id} value={atv.id}>
                    {atv.nome} - IRPJ {atv.presuncaoIRPJ} / CSLL {atv.presuncaoCSLL}
                  </option>
                ))}
              </select>
              {atividade && (
                <p className="mt-2 text-sm text-gray-600">
                  {atividades.find(a => a.id === atividade)?.descricao}
                </p>
              )}
            </div>
            
            {/* ISS (opcional) */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="aplicaISS"
                  checked={aplicaISS}
                  onChange={(e) => setAplicaISS(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="aplicaISS" className="text-sm font-semibold text-gray-700">
                  Aplicar ISS (Imposto Sobre Serviços)
                </label>
              </div>
              
              {aplicaISS && (
                <input
                  type="number"
                  value={aliquotaISS}
                  onChange={(e) => setAliquotaISS(e.target.value)}
                  placeholder="Alíquota do ISS (2% a 5%)"
                  min="2"
                  max="5"
                  step="0.1"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              )}
              <p className="mt-1 text-xs text-gray-500">
                A alíquota de ISS varia por município (geralmente entre 2% e 5%)
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
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
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
            
            {/* Resumo Executivo */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">📈 Resumo Executivo</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-purple-100 text-sm mb-1">Receita Bruta</p>
                  <p className="text-2xl font-bold">{resultado.entrada.receitaFormatada}</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-purple-100 text-sm mb-1">Total de Tributos</p>
                  <p className="text-2xl font-bold">{resultado.resumo.totalTributosFormatado}</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-purple-100 text-sm mb-1">Carga Tributária</p>
                  <p className="text-2xl font-bold">{resultado.resumo.cargaTributaria}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-purple-100 text-sm mb-1">Lucro Presumido</p>
                  <p className="text-xl font-bold">{resultado.resumo.lucroPresumidoFormatado}</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-purple-100 text-sm mb-1">Receita Líquida</p>
                  <p className="text-xl font-bold">{resultado.resumo.receitaLiquidaFormatada}</p>
                </div>
              </div>
            </div>
            
            {/* Detalhamento por Tributo */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🧾 Detalhamento dos Tributos</h2>
              
              {/* IRPJ */}
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-blue-900">IRPJ - Imposto de Renda Pessoa Jurídica</h3>
                  <span className="text-2xl font-bold text-blue-900">{resultado.tributos.irpj.irpjTotalFormatado}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700 font-semibold">Base de Cálculo</p>
                    <p className="text-blue-900 font-bold">{resultado.tributos.irpj.baseCalculoFormatado}</p>
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
                    <p className="text-blue-700 font-semibold">Alíquota Efetiva</p>
                    <p className="text-blue-900 font-bold">{resultado.tributos.irpj.aliquotaEfetiva}</p>
                  </div>
                </div>
              </div>
              
              {/* CSLL */}
              <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-green-900">CSLL - Contribuição Social sobre Lucro Líquido</h3>
                  <span className="text-2xl font-bold text-green-900">{resultado.tributos.csll.csllFormatado}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-green-700 font-semibold">Base de Cálculo</p>
                    <p className="text-green-900 font-bold">{resultado.tributos.csll.baseCalculoFormatado}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-semibold">Alíquota</p>
                    <p className="text-green-900 font-bold">{resultado.tributos.csll.aliquota}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-semibold">Alíquota Efetiva</p>
                    <p className="text-green-900 font-bold">{resultado.tributos.csll.aliquotaEfetiva}</p>
                  </div>
                </div>
              </div>
              
              {/* PIS e COFINS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* PIS */}
                <div className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-yellow-900">PIS</h3>
                    <span className="text-xl font-bold text-yellow-900">{resultado.tributos.pis.pisFormatado}</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-yellow-700">Alíquota: <span className="font-bold">{resultado.tributos.pis.aliquota}</span></p>
                    <p className="text-yellow-700">Regime: <span className="font-bold">{resultado.tributos.pis.regime}</span></p>
                  </div>
                </div>
                
                {/* COFINS */}
                <div className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-orange-900">COFINS</h3>
                    <span className="text-xl font-bold text-orange-900">{resultado.tributos.cofins.cofinsFormatado}</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-orange-700">Alíquota: <span className="font-bold">{resultado.tributos.cofins.aliquota}</span></p>
                    <p className="text-orange-700">Regime: <span className="font-bold">{resultado.tributos.cofins.regime}</span></p>
                  </div>
                </div>
              </div>
              
              {/* ISS (se aplicável) */}
              {resultado.tributos.iss.iss > 0 && (
                <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-purple-900">ISS - Imposto Sobre Serviços</h3>
                    <span className="text-xl font-bold text-purple-900">{resultado.tributos.iss.issFormatado}</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-purple-700">Alíquota: <span className="font-bold">{resultado.tributos.iss.aliquota}</span></p>
                    <p className="text-purple-700 text-xs mt-1">{resultado.tributos.iss.observacao}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Gráfico de Composição */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Composição dos Tributos</h2>
              
              <div className="space-y-4">
                {resultado.detalhamento.tributosPorTipo.map((tributo, index) => {
                  const cores = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-purple-500'];
                  const percentual = parseFloat(tributo.percentual);
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-gray-700">{tributo.nome}</span>
                        <span className="text-gray-600">{tributo.percentual}% da receita</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-full ${cores[index]} transition-all duration-500`}
                          style={{ width: `${(percentual / parseFloat(resultado.resumo.cargaTributariaDecimal)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
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

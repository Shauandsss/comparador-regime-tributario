import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const ATIVIDADES = [
  { value: 'comercio', label: 'Comércio' },
  { value: 'industria', label: 'Indústria' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'servicos_profissionais', label: 'Serviços Profissionais' }
];

export default function DiagnosticoTributario() {
  const navigate = useNavigate();
  
  // Estados do formulário
  const [receitaBruta12, setReceitaBruta12] = useState('');
  const [receitaMes, setReceitaMes] = useState('');
  const [despesasMes, setDespesasMes] = useState('');
  const [folhaMes, setFolhaMes] = useState('');
  const [atividade, setAtividade] = useState('servicos');
  
  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState(null);
  const [mostrarCenarios, setMostrarCenarios] = useState(false);
  const [cenarios, setCenarios] = useState(null);
  
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
  
  const analisar = async () => {
    setErro('');
    setResultado(null);
    setCenarios(null);
    
    const rbt12 = converterParaNumero(receitaBruta12);
    const rm = converterParaNumero(receitaMes);
    
    if (!rbt12 || rbt12 <= 0) {
      setErro('Informe a Receita Bruta dos últimos 12 meses');
      return;
    }
    
    if (!rm || rm <= 0) {
      setErro('Informe a Receita Mensal');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/diagnostico/analisar`, {
        receitaBruta12: rbt12,
        receitaMes: rm,
        despesasMes: converterParaNumero(despesasMes) || 0,
        folhaMes: converterParaNumero(folhaMes) || 0,
        atividade
      });
      
      setResultado(response.data.dados);
    } catch (error) {
      setErro(error.response?.data?.mensagem || 'Erro ao processar diagnóstico');
    } finally {
      setLoading(false);
    }
  };
  
  const simularCenarios = async () => {
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/diagnostico/simular-cenarios`, {
        receitaBruta12: converterParaNumero(receitaBruta12),
        receitaMes: converterParaNumero(receitaMes),
        despesasMes: converterParaNumero(despesasMes) || 0,
        folhaMes: converterParaNumero(folhaMes) || 0,
        atividade
      });
      
      setCenarios(response.data.dados);
      setMostrarCenarios(true);
    } catch (error) {
      setErro('Erro ao simular cenários');
    } finally {
      setLoading(false);
    }
  };
  
  const getTipoBadgeColor = (tipo) => {
    const colors = {
      principal: 'bg-green-100 text-green-800 border-green-300',
      alerta: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      oportunidade: 'bg-blue-100 text-blue-800 border-blue-300',
      dica: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800 border-gray-300';
  };
  
  const getTipoIcon = (tipo) => {
    const icons = {
      principal: '🏆',
      alerta: '⚠️',
      oportunidade: '💡',
      dica: '💼'
    };
    return icons[tipo] || 'ℹ️';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-cyan-600 hover:text-cyan-800 mb-4 flex items-center gap-2"
          >
            ← Voltar para Home
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎯 Diagnóstico Tributário Inteligente
          </h1>
          <p className="text-gray-600 text-lg">
            Descubra qual o melhor regime tributário para sua empresa com análise completa
          </p>
        </div>
        
        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Dados da Empresa</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Receita Bruta 12 meses */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💰 Receita Bruta dos últimos 12 meses *
              </label>
              <input
                type="text"
                value={receitaBruta12}
                onChange={(e) => setReceitaBruta12(formatarMoedaInput(e.target.value))}
                placeholder="R$ 0,00"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
              />
            </div>
            
            {/* Receita Mensal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📊 Receita Mensal Atual *
              </label>
              <input
                type="text"
                value={receitaMes}
                onChange={(e) => setReceitaMes(formatarMoedaInput(e.target.value))}
                placeholder="R$ 0,00"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
              />
            </div>
            
            {/* Despesas Mensais */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💸 Despesas Mensais (Opcional)
              </label>
              <input
                type="text"
                value={despesasMes}
                onChange={(e) => setDespesasMes(formatarMoedaInput(e.target.value))}
                placeholder="R$ 0,00"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
              />
            </div>
            
            {/* Folha de Pagamento */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👥 Folha de Pagamento Mensal (Opcional)
              </label>
              <input
                type="text"
                value={folhaMes}
                onChange={(e) => setFolhaMes(formatarMoedaInput(e.target.value))}
                placeholder="R$ 0,00"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
              />
            </div>
            
            {/* Atividade */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🏢 Tipo de Atividade
              </label>
              <select
                value={atividade}
                onChange={(e) => setAtividade(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
              >
                {ATIVIDADES.map(at => (
                  <option key={at.value} value={at.value}>{at.label}</option>
                ))}
              </select>
            </div>
            
          </div>
          
          {/* Botão Analisar */}
          <button
            onClick={analisar}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? '⏳ Analisando...' : '🎯 Analisar Empresa'}
          </button>
          
          {erro && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 font-semibold">{erro}</p>
            </div>
          )}
        </div>
        
        {/* Resultados */}
        {resultado && (
          <div className="space-y-8">
            
            {/* Recomendação Principal */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl shadow-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-6xl">🏆</div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">Melhor Regime para sua Empresa</h2>
                  <p className="text-green-100 text-lg">
                    Com base na análise dos três regimes tributários
                  </p>
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur rounded-xl p-6 mb-6">
                <div className="text-5xl font-black mb-2">
                  {resultado.recomendacao.melhorRegime}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-green-100 text-sm mb-1">Tributos Anuais</p>
                    <p className="text-2xl font-bold">
                      {formatarMoedaInput(String(resultado.recomendacao.tributosAnuais * 100))}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm mb-1">Alíquota Efetiva</p>
                    <p className="text-2xl font-bold">
                      {resultado.recomendacao.aliquotaEfetiva.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm mb-1">Economia Anual</p>
                    <p className="text-2xl font-bold">
                      {formatarMoedaInput(String(resultado.recomendacao.economiaAnual * 100))}
                    </p>
                  </div>
                </div>
              </div>
              
              {resultado.recomendacao.economiaAnual > 0 && (
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-lg">
                    💰 Você economizará <strong>{resultado.recomendacao.percentualEconomia}%</strong> ao ano
                    ({formatarMoedaInput(String(resultado.recomendacao.economiaMensal * 100))}/mês) 
                    em relação ao segundo melhor regime
                  </p>
                </div>
              )}
            </div>
            
            {/* Ranking Comparativo */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Ranking dos Regimes</h2>
              
              <div className="space-y-4">
                {resultado.ranking.map((r, index) => (
                  <div
                    key={r.regime}
                    className={`rounded-xl p-6 border-2 ${
                      index === 0
                        ? 'bg-green-50 border-green-300'
                        : index === 1
                        ? 'bg-yellow-50 border-yellow-300'
                        : 'bg-red-50 border-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`text-4xl font-black ${
                          index === 0 ? 'text-green-600' : index === 1 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          #{r.ranking}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{r.regime}</h3>
                          <p className="text-gray-600">Alíquota efetiva: {r.aliquota.toFixed(2)}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Tributos Anuais</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {formatarMoedaInput(String(r.valor * 100))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Detalhamento por Regime */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Simples Nacional */}
              {resultado.calculos.simples.aplicavel && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🏢</span>
                    Simples Nacional
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Anexo</p>
                      <p className="text-xl font-bold text-blue-900">{resultado.calculos.simples.anexo}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Mensal</p>
                      <p className="font-bold text-blue-900">
                        {formatarMoedaInput(String(resultado.calculos.simples.valorMensal * 100))}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Anual</p>
                      <p className="font-bold text-blue-900">
                        {formatarMoedaInput(String(resultado.calculos.simples.valorAnual * 100))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Lucro Presumido */}
              {resultado.calculos.presumido.aplicavel && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📈</span>
                    Lucro Presumido
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Presunção IRPJ</p>
                      <p className="text-xl font-bold text-purple-900">{resultado.calculos.presumido.presuncaoIRPJ}%</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Mensal</p>
                      <p className="font-bold text-purple-900">
                        {formatarMoedaInput(String(resultado.calculos.presumido.valorMensal * 100))}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Anual</p>
                      <p className="font-bold text-purple-900">
                        {formatarMoedaInput(String(resultado.calculos.presumido.valorAnual * 100))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Lucro Real */}
              {resultado.calculos.real.aplicavel && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">💼</span>
                    Lucro Real
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Lucro Contábil</p>
                      <p className="text-xl font-bold text-orange-900">
                        {formatarMoedaInput(String(resultado.calculos.real.lucroContabil * 100))}
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Mensal</p>
                      <p className="font-bold text-orange-900">
                        {formatarMoedaInput(String(resultado.calculos.real.valorMensal * 100))}
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Anual</p>
                      <p className="font-bold text-orange-900">
                        {formatarMoedaInput(String(resultado.calculos.real.valorAnual * 100))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
            </div>
            
            {/* Recomendações */}
            {resultado.recomendacoes && resultado.recomendacoes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">💡 Recomendações Personalizadas</h2>
                
                <div className="space-y-4">
                  {resultado.recomendacoes.map((rec, index) => (
                    <div
                      key={index}
                      className={`rounded-xl p-6 border-2 ${getTipoBadgeColor(rec.tipo)}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{getTipoIcon(rec.tipo)}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{rec.titulo}</h3>
                          <p className="text-gray-700 leading-relaxed">{rec.descricao}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Botão Simular Cenários */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">🔮 Simular Cenários</h2>
                  <p className="text-gray-600">Teste diferentes situações para sua empresa</p>
                </div>
                <button
                  onClick={simularCenarios}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Simulando...' : 'Simular'}
                </button>
              </div>
              
              {mostrarCenarios && cenarios && (
                <div className="space-y-4 mt-6">
                  {cenarios.map((cen, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{cen.nome}</h3>
                          <p className="text-sm text-gray-600">
                            Melhor: {cen.resultado.recomendacao.melhorRegime}
                          </p>
                        </div>
                        {cen.tipo === 'simulacao' && (
                          <div className={`px-4 py-2 rounded-lg font-semibold ${
                            cen.impacto.valePena
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {cen.impacto.valePena ? '✅ Vale a pena' : '❌ Não compensa'}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600">Tributos Anuais</p>
                          <p className="font-bold text-gray-800">
                            {formatarMoedaInput(String(cen.resultado.recomendacao.tributosAnuais * 100))}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600">Alíquota</p>
                          <p className="font-bold text-gray-800">
                            {cen.resultado.recomendacao.aliquotaEfetiva.toFixed(2)}%
                          </p>
                        </div>
                        {cen.impacto && (
                          <>
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-xs text-gray-600">Diferença vs Base</p>
                              <p className={`font-bold ${
                                cen.impacto.diferenca < 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {formatarMoedaInput(String(Math.abs(cen.impacto.diferenca) * 100))}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-xs text-gray-600">Impacto</p>
                              <p className={`font-bold ${
                                cen.impacto.diferenca < 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {cen.impacto.diferenca < 0 ? '📉 Reduz' : '📈 Aumenta'}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        )}
        
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    
    // Redirecionar para o comparador de regimes que já funciona 100% frontend
    navigate('/formulario', {
      state: {
        receitaBruta12: rbt12,
        receitaMes: rm,
        despesasMes: converterParaNumero(despesasMes) || 0,
        folhaMes: converterParaNumero(folhaMes) || 0,
        atividade
      }
    });
  };
  
  const simularCenarios = async () => {
    // Redirecionar para o comparador que tem simulação de cenários
    navigate('/formulario', {
      state: {
        receitaBruta12: converterParaNumero(receitaBruta12),
        receitaMes: converterParaNumero(receitaMes),
        despesasMes: converterParaNumero(despesasMes) || 0,
        folhaMes: converterParaNumero(folhaMes) || 0,
        atividade
      }
    });
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

      {/* ========== ARTIGO SEO ========== */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-lg max-w-none">
          
          {/* Introdução */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              🔍 Diagnóstico Tributário: Guia Completo para Reduzir Impostos Legalmente
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              O <strong>diagnóstico tributário</strong> é uma análise técnica e detalhada da situação fiscal de uma empresa, 
              com o objetivo de identificar oportunidades de economia, corrigir irregularidades e otimizar a carga tributária 
              de forma legal. Trata-se de um verdadeiro <strong>raio-x fiscal</strong> que examina regime tributário, apuração 
              de impostos, obrigações acessórias, créditos não aproveitados e potenciais riscos de autuação.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Este procedimento é <strong>essencial para empresas</strong> que desejam ter segurança jurídica, competitividade 
              no mercado e máxima eficiência tributária. Segundo estudos, empresas que realizam diagnóstico tributário regularmente 
              podem reduzir sua carga tributária entre <strong>15% e 40%</strong>, através da escolha correta do regime, 
              aproveitamento de incentivos fiscais e correção de inconsistências.
            </p>
          </div>

          {/* O que é */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">📋</span>
              O que é um Diagnóstico Tributário?
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              É uma <strong>consultoria fiscal especializada</strong> que analisa todos os aspectos tributários da empresa, 
              incluindo regime de tributação atual, cálculo de impostos, aproveitamento de benefícios e conformidade com 
              legislação. O diagnóstico compara cenários, identifica oportunidades e propõe ações práticas de economia.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-blue-900 mb-4">🎯 Objetivos Principais</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Identificar <strong>regime tributário ideal</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Detectar <strong>créditos tributários</strong> não aproveitados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Corrigir <strong>inconsistências</strong> antes de fiscalizações</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Mapear <strong>riscos fiscais</strong> e passivos ocultos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Propor <strong>planejamento tributário</strong> estratégico</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-green-900 mb-4">✅ O que é Analisado</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Regime tributário (Simples, Presumido, Real)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Cálculo de IRPJ, CSLL, PIS, COFINS, ISS, ICMS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Obrigações acessórias (SPED, ECF, DCTF, etc)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Créditos fiscais (PIS/COFINS, ICMS)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Enquadramento de atividades e CNAEs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quando Fazer */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">📅</span>
              Quando Fazer um Diagnóstico Tributário?
            </h2>
            
            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
                <h3 className="text-lg font-bold text-green-900 mb-3">🟢 Situações Prioritárias</h3>
                <ul className="space-y-2 text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">1.</span>
                    <span><strong>Abertura de empresa:</strong> escolher regime tributário mais vantajoso desde o início</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">2.</span>
                    <span><strong>Virada de ano:</strong> antes de janeiro para avaliar mudança de regime (opção irretratável)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">3.</span>
                    <span><strong>Crescimento acelerado:</strong> quando faturamento aumenta significativamente (risco de desenquadramento)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">4.</span>
                    <span><strong>Prejuízos constantes:</strong> empresa pagando impostos mesmo sem lucro real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">5.</span>
                    <span><strong>Antes de fiscalização:</strong> corrigir irregularidades e evitar autuações pesadas</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                <h3 className="text-lg font-bold text-blue-900 mb-3">🔵 Situações Recomendadas</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Mudança de atividade:</strong> inclusão de novos CNAEs ou alteração do core business</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Fusões e aquisições:</strong> integração tributária de empresas diferentes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Expansão geográfica:</strong> abertura de filiais em outros estados (ICMS)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Troca de contador:</strong> validar se apurações anteriores estavam corretas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Análise periódica:</strong> recomenda-se diagnóstico anual ou bianual</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
                <p className="text-sm text-yellow-900">
                  <strong>💡 Dica:</strong> Empresas que realizam diagnóstico tributário <strong>antes de dezembro</strong> 
                  têm tempo hábil para mudar de regime em janeiro, quando a opção se torna irretratável até dezembro do ano seguinte.
                </p>
              </div>
            </div>
          </div>

          {/* Metodologia */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🔬</span>
              Metodologia do Diagnóstico Tributário
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-purple-900 mb-4">Fase 1: Coleta de Informações</h3>
                <p className="text-gray-700 mb-3">Levantamento completo de dados fiscais, contábeis e operacionais:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Balanços e DRE (últimos 24 meses)</li>
                    <li>• Declarações fiscais (PGDAS, ECF, DCTF)</li>
                    <li>• Guias de impostos pagos</li>
                    <li>• Contrato social e CNAEs</li>
                  </ul>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Notas fiscais (entradas e saídas)</li>
                    <li>• Folha de pagamento completa</li>
                    <li>• Contratos de aluguel, serviços</li>
                    <li>• Certidões negativas de débitos</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-indigo-900 mb-4">Fase 2: Análise do Regime Atual</h3>
                <p className="text-gray-700 mb-3">Validação da apuração tributária e identificação de erros:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">✓</span>
                    <span>Verificar cálculos de DAS, IRPJ, CSLL, PIS, COFINS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">✓</span>
                    <span>Conferir enquadramento de CNAEs e alíquotas aplicadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">✓</span>
                    <span>Analisar Fator R (Simples Nacional Anexo III vs V)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">✓</span>
                    <span>Identificar créditos de PIS/COFINS não aproveitados</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Fase 3: Simulação de Cenários</h3>
                <p className="text-gray-700 mb-3">Comparação entre os três regimes tributários:</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-900 font-mono text-sm mb-2">
                    <strong>Cenário A:</strong> Simples Nacional (6 anexos)
                  </p>
                  <p className="text-blue-900 font-mono text-sm mb-2">
                    <strong>Cenário B:</strong> Lucro Presumido (presunções por atividade)
                  </p>
                  <p className="text-blue-900 font-mono text-sm">
                    <strong>Cenário C:</strong> Lucro Real (lucro efetivo + créditos)
                  </p>
                </div>
                <p className="text-gray-700 mt-3 text-sm">
                  Cada cenário considera: impostos federais, estaduais, municipais, obrigações acessórias e complexidade operacional.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-green-900 mb-4">Fase 4: Relatório de Recomendações</h3>
                <p className="text-gray-700 mb-3">Documento técnico com análises e plano de ação:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">📊</span>
                    <span>Comparativo de carga tributária nos 3 regimes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">💰</span>
                    <span>Economia estimada com mudança de regime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">⚠️</span>
                    <span>Riscos fiscais identificados e ações corretivas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">🎯</span>
                    <span>Plano de implementação com prazos e responsáveis</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-orange-900 mb-4">Fase 5: Implementação e Monitoramento</h3>
                <p className="text-gray-700 mb-3">Execução das recomendações com acompanhamento:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Comunicação de mudança de regime à Receita Federal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Ajuste de sistemas contábeis e ERPs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Regularização de obrigações acessórias pendentes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Monitoramento mensal da carga tributária efetiva</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Indicadores Analisados */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">📊</span>
              Principais Indicadores Analisados
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Carga Tributária Efetiva</h3>
                <p className="text-blue-800 text-sm mb-2">
                  Percentual de impostos sobre faturamento bruto. Ideal comparar com média do setor:
                </p>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Comércio: 8-12%</li>
                  <li>• Indústria: 10-15%</li>
                  <li>• Serviços: 12-18%</li>
                  <li>• TI/Consultoria: 6-10%</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-900 mb-3">Margem de Lucro Líquida</h3>
                <p className="text-green-800 text-sm mb-2">
                  Lucro após impostos dividido pela receita. Indicador essencial para escolha do regime:
                </p>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• &lt; 8%: considerar Lucro Real</li>
                  <li>• 8-32%: analisar Presumido</li>
                  <li>• &gt; 32%: Presumido geralmente melhor</li>
                  <li>• &lt; 4,8 MM/ano: avaliar Simples</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-900 mb-3">Fator R (Simples Nacional)</h3>
                <p className="text-purple-800 text-sm mb-2">
                  Relação entre folha de pagamento e receita bruta (últimos 12 meses):
                </p>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• ≥ 28%: Anexo III (mais vantajoso)</li>
                  <li>• &lt; 28%: Anexo V (alíquotas maiores)</li>
                  <li>• Diferença pode chegar a 10 pontos %</li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-yellow-900 mb-3">Créditos Fiscais Potenciais</h3>
                <p className="text-yellow-800 text-sm mb-2">
                  Valores recuperáveis via créditos de PIS/COFINS (Lucro Real):
                </p>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Insumos: 9,25% sobre aquisições</li>
                  <li>• Energia: crédito integral</li>
                  <li>• Aluguéis: 9,25% sobre valor</li>
                  <li>• Economia: 30-50% dos débitos</li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-orange-900 mb-3">Nível de Conformidade</h3>
                <p className="text-orange-800 text-sm mb-2">
                  Percentual de obrigações acessórias cumpridas corretamente:
                </p>
                <ul className="text-orange-700 text-sm space-y-1">
                  <li>• SPED Fiscal, EFD-Contribuições</li>
                  <li>• ECF, DCTF, DCTFWeb</li>
                  <li>• eSocial, DIRF, RAIS</li>
                  <li>• Meta: 100% de conformidade</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-900 mb-3">Riscos Fiscais</h3>
                <p className="text-red-800 text-sm mb-2">
                  Passivos tributários potenciais (multas + juros + principal):
                </p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• CNAE inadequado</li>
                  <li>• Créditos indevidos</li>
                  <li>• Falta de retenções</li>
                  <li>• Desenquadramento Simples</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Como Interpretar Resultados */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">📈</span>
              Como Interpretar os Resultados
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-green-900 mb-3">✅ Resultado Positivo</h3>
                <p className="text-gray-700 mb-3">
                  <strong>Economia potencial identificada:</strong> mudança de regime pode reduzir carga tributária
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-900 mb-2"><strong>Exemplo:</strong></p>
                  <p className="text-green-800 text-sm">
                    "Empresa no Simples Anexo V pagando 18% efetivo. No Lucro Presumido pagaria 13,33% efetivo. 
                    <strong>Economia anual de R$ 234.000</strong> sobre faturamento de R$ 5 milhões."
                  </p>
                </div>
                <p className="text-gray-700 mt-3 text-sm">
                  <strong>Ação:</strong> Planejar mudança para janeiro do próximo ano, ajustar processos e comunicar Receita.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-yellow-500">
                <h3 className="text-xl font-bold text-yellow-900 mb-3">⚠️ Resultado de Atenção</h3>
                <p className="text-gray-700 mb-3">
                  <strong>Pequena economia ou empate técnico:</strong> analisar fatores secundários
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-900 mb-2"><strong>Exemplo:</strong></p>
                  <p className="text-yellow-800 text-sm">
                    "Lucro Real economiza R$ 15.000/ano vs Presumido, mas custos de compliance aumentam R$ 20.000/ano 
                    (contador especializado, sistemas, obrigações acessórias). <strong>Saldo negativo.</strong>"
                  </p>
                </div>
                <p className="text-gray-700 mt-3 text-sm">
                  <strong>Ação:</strong> Manter regime atual, otimizar apuração, monitorar crescimento para reavaliar futuramente.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-blue-900 mb-3">🔵 Resultado Neutro</h3>
                <p className="text-gray-700 mb-3">
                  <strong>Regime atual é o mais adequado:</strong> foco em conformidade e otimizações pontuais
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-900 mb-2"><strong>Exemplo:</strong></p>
                  <p className="text-blue-800 text-sm">
                    "Empresa no Simples Anexo III com Fator R de 35%. Outros regimes resultariam em carga maior. 
                    <strong>Simples é o ideal.</strong>"
                  </p>
                </div>
                <p className="text-gray-700 mt-3 text-sm">
                  <strong>Ação:</strong> Manter regime, garantir cumprimento de obrigações, monitorar Fator R mensalmente.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-red-500">
                <h3 className="text-xl font-bold text-red-900 mb-3">🚨 Resultado Crítico</h3>
                <p className="text-gray-700 mb-3">
                  <strong>Riscos fiscais graves identificados:</strong> necessidade de ação imediata
                </p>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-900 mb-2"><strong>Exemplo:</strong></p>
                  <p className="text-red-800 text-sm">
                    "Empresa ultrapassou limite do Simples (R$ 4,8 MM) há 6 meses e não migrou. 
                    <strong>Risco de autuação com multa de 75% sobre diferença de impostos.</strong>"
                  </p>
                </div>
                <p className="text-gray-700 mt-3 text-sm">
                  <strong>Ação:</strong> Regularização urgente, levantamento de passivo, parcelamento se necessário, mudança imediata.
                </p>
              </div>
            </div>
          </div>

          {/* Erros Comuns */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">❌</span>
              Erros Comuns que o Diagnóstico Identifica
            </h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">1. Regime Tributário Inadequado</h3>
                <p className="text-red-800 text-sm">
                  Empresa permanece anos no mesmo regime sem reavaliar. Exemplo: empresa de serviços com margem de 45% 
                  no Lucro Real pagando mais que pagaria no Presumido.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">2. CNAE Principal Errado</h3>
                <p className="text-red-800 text-sm">
                  CNAE não reflete atividade principal, resultando em Anexo incorreto (Simples) ou alíquotas maiores. 
                  Diferença pode ser de 10 pontos percentuais na tributação.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">3. Fator R Mal Calculado</h3>
                <p className="text-red-800 text-sm">
                  Não incluir INSS patronal (20%) no cálculo da folha, ou usar período incorreto (últimos 12 meses). 
                  Resultado: empresa enquadrada no Anexo V quando deveria estar no III.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">4. Créditos de PIS/COFINS Não Aproveitados</h3>
                <p className="text-red-800 text-sm">
                  Empresas do Lucro Real deixam de tomar créditos sobre energia, aluguéis, insumos. Perda pode chegar 
                  a R$ 50.000/ano em empresas médias.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">5. Desenquadramento do Simples Ignorado</h3>
                <p className="text-red-800 text-sm">
                  Faturamento ultrapassa R$ 4,8 MM ou empresa descumpre vedações (sócios PJ, atividade impeditiva). 
                  Permanência irregular gera multa pesada + cobrança retroativa.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">6. Obrigações Acessórias Pendentes</h3>
                <p className="text-red-800 text-sm">
                  ECF, DCTF, EFD-Contribuições não enviadas ou com erros. Impossibilita emissão de CND e gera multas 
                  de até R$ 5.000 por mês de atraso.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">7. Distribuição de Lucros Acima do Contábil</h3>
                <p className="text-red-800 text-sm">
                  Sócios retiram mais que lucro contábil apurado. Excedente é tributado como pró-labore (até 27,5% IR + 11% INSS). 
                  Falta de planejamento gera tributação desnecessária.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">❓</span>
              Perguntas Frequentes sobre Diagnóstico Tributário
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">1. Quanto custa um diagnóstico tributário profissional?</h3>
                <p className="text-gray-700">
                  Varia de <strong>R$ 3.000 a R$ 30.000</strong> dependendo do porte da empresa e complexidade. Empresas 
                  pequenas (até R$ 1 MM/ano): R$ 3-5 mil. Médias (R$ 1-10 MM): R$ 8-15 mil. Grandes: acima de R$ 20 mil. 
                  O investimento se paga com economia identificada (geralmente em 1-3 meses).
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">2. Quanto tempo demora um diagnóstico completo?</h3>
                <p className="text-gray-700">
                  <strong>15 a 45 dias</strong> em média. Coleta de documentos (5-10 dias), análise técnica (10-20 dias), 
                  elaboração de relatório (3-5 dias), apresentação e discussão (1-2 dias). Empresas organizadas com documentação 
                  digital aceleram o processo.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">3. Posso fazer diagnóstico tributário sozinho?</h3>
                <p className="text-gray-700">
                  <strong>Parcialmente.</strong> Ferramentas online (como este site) ajudam na comparação básica de regimes. 
                  Porém, análise profunda requer conhecimento técnico de legislação, jurisprudência, particularidades setoriais. 
                  Recomenda-se contratar contador ou consultoria especializada para diagnóstico completo.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">4. Com que frequência devo fazer diagnóstico?</h3>
                <p className="text-gray-700">
                  <strong>Anualmente</strong> (antes de dezembro para avaliar mudança de regime) ou quando houver mudanças 
                  significativas: crescimento &gt;30%, nova atividade, fusão/aquisição, prejuízos constantes, troca de contador. 
                  Empresas em crescimento acelerado devem fazer semestralmente.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">5. O diagnóstico pode identificar passivos tributários?</h3>
                <p className="text-gray-700">
                  <strong>Sim.</strong> É uma das funções principais. O diagnóstico detecta erros em apurações anteriores, 
                  créditos indevidos, falta de retenções, desenquadramentos. Permite correção <strong>antes de fiscalização</strong>, 
                  evitando multas pesadas (75% sobre diferença) e até crimes tributários.
                </p>
              </div>

              <div className="border-l-4 border-indigo-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">6. Posso mudar de regime após o diagnóstico?</h3>
                <p className="text-gray-700">
                  Depende. <strong>Simples para Presumido/Real:</strong> comunicar exclusão até janeiro. <strong>Presumido/Real 
                  entre si:</strong> mudar em janeiro do ano seguinte (primeiro pagamento ou escrituração). <strong>Para Simples:</strong> 
                  solicitar opção em janeiro (se cumprir requisitos). A escolha é <strong>irretratável até dezembro</strong>.
                </p>
              </div>

              <div className="border-l-4 border-pink-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">7. Empresa nova precisa de diagnóstico?</h3>
                <p className="text-gray-700">
                  <strong>Sim, é essencial!</strong> A escolha inicial do regime define tributação pelos próximos 12 meses. 
                  Erro na abertura pode resultar em pagamento excessivo de impostos durante todo primeiro ano. Fazer diagnóstico 
                  <strong>antes de abrir</strong> a empresa garante início com regime ideal e CNAEs corretos.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">🔍 Faça seu Diagnóstico Tributário Agora</h2>
            <p className="text-xl mb-6 opacity-90">
              Use nossa ferramenta gratuita acima para ter uma análise preliminar da sua situação tributária. 
              Descubra oportunidades de economia e identifique possíveis riscos fiscais!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                📊 Iniciar Diagnóstico
              </button>
              <button
                onClick={() => navigate('/comparador')}
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
              >
                🔄 Comparador Completo
              </button>
            </div>
          </div>

        </article>
      </div>
    </div>
  );
}

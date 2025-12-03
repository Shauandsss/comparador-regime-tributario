/**
 * Página Home - Landing Page
 * Sistema Comparador de Regimes Tributários
 */
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { ferramentas, categorias } from '../data/ferramentas';

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    ferramentas: 0,
    empresas: 0,
    economia: 0
  });

  // Contagem dinâmica de ferramentas por categoria
  const contagens = useMemo(() => {
    const counts = {
      total: ferramentas.length,
      calculadoras: ferramentas.filter(f => f.categoria === 'calculadora').length,
      simuladores: ferramentas.filter(f => f.categoria === 'simulador').length,
      educacao: ferramentas.filter(f => f.categoria === 'educacao').length,
      startups: ferramentas.filter(f => f.categoria === 'startup').length,
      simplesNacional: ferramentas.filter(f => f.subcategoria === 'simples-nacional').length,
      lucroPresumido: ferramentas.filter(f => f.subcategoria === 'lucro-presumido' || f.subcategoria === 'lucro-real').length,
    };
    return counts;
  }, []);

  // Animação dos números
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        ferramentas: contagens.total,
        empresas: 1250,
        economia: 2500000
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [contagens.total]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section - SEO Optimized */}
      <div className="mb-16">
        {/* Header com gradiente sutil */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-5 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-200">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {contagens.total} Ferramentas Gratuitas • Atualizado 2025
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Compare Regimes Tributários
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              e Economize até 40% em Impostos
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            <strong>Calculadoras e simuladores gratuitos</strong> para <strong>Simples Nacional</strong>, 
            <strong> Lucro Presumido</strong> e <strong>Lucro Real</strong>. 
            Calcule DAS, DIFAL, Fator R e descubra o regime tributário ideal. <strong>100% gratuito, sem cadastro.</strong>
          </p>
        </div>

        {/* Grid de Ações Rápidas - Layout Equilibrado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card Comparador */}
          <div 
            onClick={() => navigate('/formulario')}
            className="group bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">⚖️</div>
            <h3 className="font-bold text-lg mb-2">Comparar Regimes</h3>
            <p className="text-blue-100 text-sm mb-4">Compare os 3 regimes lado a lado</p>
            <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
              Iniciar <span>→</span>
            </div>
          </div>

          {/* Card Diagnóstico */}
          <div 
            onClick={() => navigate('/diagnostico-tributario')}
            className="group bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2">Diagnóstico</h3>
            <p className="text-emerald-100 text-sm mb-4">Análise completa com recomendações</p>
            <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
              Analisar <span>→</span>
            </div>
          </div>

          {/* Card Calculadora DAS */}
          <div 
            onClick={() => navigate('/calculadora-das')}
            className="group bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">🧮</div>
            <h3 className="font-bold text-lg mb-2">Calcular DAS</h3>
            <p className="text-violet-100 text-sm mb-4">Valor exato com alíquota efetiva</p>
            <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
              Calcular <span>→</span>
            </div>
          </div>

          {/* Card Planejador */}
          <div 
            onClick={() => navigate('/planejador-tributario')}
            className="group bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">🎚️</div>
            <h3 className="font-bold text-lg mb-2">Planejador Visual</h3>
            <p className="text-amber-100 text-sm mb-4">Simule cenários em tempo real</p>
            <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
              Planejar <span>→</span>
            </div>
          </div>
        </div>

        {/* Seção de Destaques Secundários */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div 
            onClick={() => navigate('/simulador-fator-r')}
            className="group bg-white border-2 border-gray-100 hover:border-blue-300 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📐</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Fator R</div>
                <div className="text-xs text-gray-500">Anexo III ou V?</div>
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/simulador-migracao')}
            className="group bg-white border-2 border-gray-100 hover:border-cyan-300 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">MEI → ME</div>
                <div className="text-xs text-gray-500">Simule a migração</div>
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/termometro-risco')}
            className="group bg-white border-2 border-gray-100 hover:border-red-300 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌡️</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Risco Fiscal</div>
                <div className="text-xs text-gray-500">Score 0-100</div>
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/glossario-tributario')}
            className="group bg-white border-2 border-gray-100 hover:border-purple-300 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Glossário</div>
                <div className="text-xs text-gray-500">30 termos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas em linha */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 py-8 px-6 bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50 rounded-2xl">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-gray-800">{contagens.total}</div>
            <div className="text-sm text-gray-500 font-medium">Ferramentas</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-gray-800">{stats.empresas.toLocaleString('pt-BR')}+</div>
            <div className="text-sm text-gray-500 font-medium">Empresas Atendidas</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-emerald-600">R$ {(stats.economia / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-gray-500 font-medium">Economizados</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-blue-600">100%</div>
            <div className="text-sm text-gray-500 font-medium">Gratuito</div>
          </div>
        </div>

        {/* Prova Social - Novo */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex -space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white flex items-center justify-center text-white font-bold">A</div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 border-2 border-white flex items-center justify-center text-white font-bold">M</div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-white flex items-center justify-center text-white font-bold">J</div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-2 border-white flex items-center justify-center text-white font-bold">R</div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 border-2 border-white flex items-center justify-center text-white font-bold text-xs">+1.2K</div>
          </div>
          <p className="text-sm text-gray-600 text-center">
            <strong>Mais de 1.250 empresas</strong> já economizaram com nossas ferramentas
          </p>
        </div>
      </div>

      {/* Banner de Funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        <div className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">⚡</div>
          <div>
            <div className="font-bold text-gray-800">Cálculos Instantâneos</div>
            <div className="text-sm text-gray-500">Resultados em segundos</div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🔒</div>
          <div>
            <div className="font-bold text-gray-800">100% Privado</div>
            <div className="text-sm text-gray-500">Dados processados localmente</div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">📊</div>
          <div>
            <div className="font-bold text-gray-800">Legislação 2025</div>
            <div className="text-sm text-gray-500">Sempre atualizado</div>
          </div>
        </div>
      </div>

      {/* Cards dos Regimes com Design Melhorado */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Simples Nacional, Lucro Presumido ou Lucro Real: Qual Escolher?
        </h2>
        <p className="text-center text-gray-600 mb-10 text-lg">
          Compare os 3 regimes tributários e descubra qual paga menos impostos em 2025
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Simples Nacional */}
          <div className="group bg-white rounded-2xl p-6 md:p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-blue-100 hover:border-blue-400 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
            <div className="relative">
              <div className="text-5xl md:text-6xl mb-4">🏢</div>
              <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                MICRO E PEQUENAS EMPRESAS
              </div>
              <h3 className="font-bold text-2xl mb-3 text-blue-800">Simples Nacional</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Regime simplificado com alíquotas progressivas. Ideal para micro e pequenas empresas com faturamento até R$ 4,8 milhões anuais.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <span className="text-sm text-gray-700">Unificação de até 8 tributos em uma guia</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <span className="text-sm text-gray-700">Menos burocracia e obrigações acessórias</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <span className="text-sm text-gray-700">Alíquotas entre 4% e 33% sobre faturamento</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <span className="text-sm text-gray-700">5 anexos conforme tipo de atividade</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-xs text-gray-600 mb-1">Faixa de Alíquota</div>
                <div className="text-2xl font-bold text-blue-600">4% - 33%</div>
              </div>
            </div>
          </div>

          {/* Lucro Presumido */}
          <div className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-purple-100 hover:border-purple-400 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
            <div className="relative">
              <div className="text-6xl mb-4">📈</div>
              <div className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                MÉDIAS EMPRESAS
              </div>
              <h3 className="font-bold text-2xl mb-3 text-purple-800">Lucro Presumido</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Tributação baseada em margem de lucro presumida pela Receita Federal. Ideal para empresas com margens de lucro elevadas.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <span className="text-sm text-gray-700">Cálculo simplificado de IRPJ e CSLL</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <span className="text-sm text-gray-700">Presunção de lucro entre 1,6% e 38,4%</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <span className="text-sm text-gray-700">Ideal para margens altas de lucro real</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <span className="text-sm text-gray-700">Menos complexidade que Lucro Real</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="text-xs text-gray-600 mb-1">Presunção de Lucro</div>
                <div className="text-2xl font-bold text-purple-600">1,6% - 38,4%</div>
              </div>
            </div>
          </div>

          {/* Lucro Real */}
          <div className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-orange-100 hover:border-orange-400 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
            <div className="relative">
              <div className="text-6xl mb-4">💼</div>
              <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                GRANDES EMPRESAS
              </div>
              <h3 className="font-bold text-2xl mb-3 text-orange-800">Lucro Real</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Tributação sobre o lucro líquido efetivamente apurado pela contabilidade. Obrigatório para grandes empresas.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <span className="text-sm text-gray-700">Baseado no lucro contábil efetivo</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <span className="text-sm text-gray-700">Compensação de prejuízos fiscais</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <span className="text-sm text-gray-700">Aproveitamento de créditos fiscais</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <span className="text-sm text-gray-700">Ideal para margens baixas ou prejuízo</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="text-xs text-gray-600 mb-1">Base de Cálculo</div>
                <div className="text-2xl font-bold text-orange-600">Lucro Real</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Como Funciona - Processo Passo a Passo */}
      <div id="como-funciona" className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-xl p-10 mb-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            🎯 Como Comparar Regimes Tributários em 3 Passos
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Descubra o regime tributário ideal e economize até 40% em impostos em apenas 2 minutos
          </p>
        </div>

        {/* Benefícios Quantitativos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 text-center border-2 border-blue-200 hover:border-blue-400 transition">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-blue-600 mb-1">15% - 40%</div>
            <div className="text-sm text-gray-600">Economia Média em Impostos</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 text-center border-2 border-green-200 hover:border-green-400 transition">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-green-600 mb-1">2 min</div>
            <div className="text-sm text-gray-600">Resultado Instantâneo</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 text-center border-2 border-purple-200 hover:border-purple-400 transition">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-purple-600 mb-1">100%</div>
            <div className="text-sm text-gray-600">Gratuito e Sem Cadastro</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 text-center border-2 border-orange-200 hover:border-orange-400 transition">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-orange-600 mb-1">35+</div>
            <div className="text-sm text-gray-600">Calculadoras Disponíveis</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10">
          {/* Passo 1 */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all h-full">
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:rotate-6 transition-transform">
                  <span className="text-3xl font-black text-white">1</span>
                </div>
                <div className="text-5xl mb-4">📝</div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">Preencha os Dados</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Informe a receita bruta anual, despesas operacionais e selecione o tipo de atividade da sua empresa
                </p>
                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700 font-medium">
                  ⏱️ Leva menos de 2 minutos
                </div>
              </div>
            </div>
            {/* Seta decorativa */}
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
              <svg className="w-8 h-8 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all h-full">
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:rotate-6 transition-transform">
                  <span className="text-3xl font-black text-white">2</span>
                </div>
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">Cálculo Instantâneo</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Nossa inteligência calcula automaticamente os três regimes tributários com precisão profissional
                </p>
                <div className="bg-purple-50 rounded-lg p-3 text-sm text-purple-700 font-medium">
                  🚀 Resultado em segundos
                </div>
              </div>
            </div>
            {/* Seta decorativa */}
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
              <svg className="w-8 h-8 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all h-full">
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:rotate-6 transition-transform">
                  <span className="text-3xl font-black text-white">3</span>
                </div>
                <div className="text-5xl mb-4">📊</div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">Compare e Economize</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Veja lado a lado qual regime oferece maior economia e tome a melhor decisão para seu negócio
                </p>
                <div className="bg-green-50 rounded-lg p-3 text-sm text-green-700 font-medium">
                  💰 Economia garantida
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button 
            onClick={() => navigate('/formulario')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-2xl transform hover:scale-105 inline-flex items-center gap-3"
          >
            <span className="text-2xl">🎉</span>
            Fazer Minha Comparação Agora
            <span className="text-2xl">→</span>
          </button>
        </div>
      </div>

      {/* Recursos e Diferenciais - Nova Seção */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl shadow-xl p-10 mb-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            ⚡ Por Que Usar Nosso Comparador Tributário?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ferramentas profissionais validadas por contadores com legislação atualizada 2025
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-3">Resultados Precisos</h3>
            <p className="text-gray-600 leading-relaxed">
              Cálculos validados por contadores seguindo rigorosamente a legislação da Receita Federal. 
              Alíquotas, tabelas e regras atualizadas mensalmente.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">🔒</span>
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-3">Privacidade Total</h3>
            <p className="text-gray-600 leading-relaxed">
              Seus dados não são armazenados nem compartilhados. Processamento 100% local no navegador. 
              Sem cadastro, sem login, sem envio de informações.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-3">Instantâneo e Gratuito</h3>
            <p className="text-gray-600 leading-relaxed">
              Resultados em menos de 2 minutos. 35+ ferramentas completamente gratuitas. 
              Sem limite de uso, sem anúncios, sem pegadinhas.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-3">Comparação Completa</h3>
            <p className="text-gray-600 leading-relaxed">
              Compare os 3 regimes lado a lado com gráficos e tabelas detalhadas. 
              Veja exatamente quanto pagaria em cada regime.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">📱</span>
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-3">Mobile-First</h3>
            <p className="text-gray-600 leading-relaxed">
              Interface responsiva otimizada para celular, tablet e desktop. 
              Calcule seus impostos de qualquer lugar, a qualquer hora.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="bg-gradient-to-br from-red-500 to-red-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">🎓</span>
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-3">Educação Tributária</h3>
            <p className="text-gray-600 leading-relaxed">
              Glossário com mais de 100 termos, guias completos e FAQs detalhados. 
              Entenda como funciona cada regime tributário.
            </p>
          </div>
        </div>
      </div>

      {/* Ferramentas Disponíveis - Reorganizada */}
      <div className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            35+ Calculadoras e Simuladores Tributários Gratuitos
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Calcule DAS, DIFAL, Fator R, Pró-labore e muito mais. Ferramentas atualizadas 2025.
          </p>
        </div>

        {/* Categoria 1: Simples Nacional */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
              🏢 Simples Nacional
            </div>
            <div className="flex-1 h-1 bg-gradient-to-r from-blue-300 to-transparent rounded"></div>
            <span className="text-gray-500 font-semibold">{ferramentas.filter(f => f.subcategoria === 'simples-nacional').length} Ferramentas</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            <div 
              onClick={() => navigate('/calculadora-das')}
              className="group bg-white border-2 border-blue-200 hover:border-blue-500 rounded-xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className="text-4xl md:text-5xl">🧮</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800 mb-2">Calculadora de DAS</h4>
                  <p className="text-gray-600 text-sm mb-3">Valor exato do DAS com alíquota efetiva e RBT12</p>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                    Calcular → 
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/simulador-fator-r')}
              className="group bg-white border-2 border-blue-200 hover:border-blue-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">📐</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800 mb-2">Simulador Fator R</h4>
                  <p className="text-gray-600 text-sm mb-3">Anexo III ou V? Descubra com o cálculo do Fator R</p>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                    Simular →
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/simulador-desenquadramento')}
              className="group bg-white border-2 border-blue-200 hover:border-blue-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">⚠️</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800 mb-2">Desenquadramento MEI/Simples</h4>
                  <p className="text-gray-600 text-sm mb-3">Preveja quando ultrapassará limites de R$ 81k ou R$ 4,8M</p>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                    Verificar →
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/simulador-migracao')}
              className="group bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-white">
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold inline-block mb-3">
                  🔄 NOVO
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-5xl">🔄</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2">Migração MEI → ME</h4>
                    <p className="text-cyan-100 text-sm mb-3">Simule o impacto de migrar de MEI para Simples Nacional ME</p>
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      Simular →
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/guia-cnae')}
              className="group bg-white border-2 border-blue-200 hover:border-blue-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">📋</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800 mb-2">Guia CNAE → Anexo</h4>
                  <p className="text-gray-600 text-sm mb-3">Descubra qual anexo do Simples seu CNAE pertence</p>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                    Consultar →
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/explicador-simples')}
              className="group bg-white border-2 border-blue-200 hover:border-blue-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">🎓</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800 mb-2">Explicador Visual</h4>
                  <p className="text-gray-600 text-sm mb-3">Entenda visualmente como funciona o Simples Nacional</p>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                    Aprender →
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/calculadora-pro-labore')}
              className="group bg-white border-2 border-blue-200 hover:border-blue-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">💼</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800 mb-2">Pró-Labore + INSS + IRPF</h4>
                  <p className="text-gray-600 text-sm mb-3">Calcule descontos e pró-labore ideal para Fator R 28%</p>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                    Calcular →
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/calculadora-distribuicao-lucros')}
              className="group bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-white">
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold inline-block mb-3">
                  ✨ POPULAR
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-5xl">💰</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2">Distribuição de Lucros</h4>
                    <p className="text-purple-100 text-sm mb-3">Otimize retirada dos sócios: pró-labore vs distribuição isenta</p>
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      Otimizar →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categoria 2: Lucro Presumido & Real */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
              💼 Lucro Presumido & Real
            </div>
            <div className="flex-1 h-1 bg-gradient-to-r from-purple-300 to-transparent rounded"></div>
            <span className="text-gray-500 font-semibold">{ferramentas.filter(f => f.subcategoria === 'lucro-presumido' || f.subcategoria === 'lucro-real').length} Ferramentas</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div 
              onClick={() => navigate('/calculadora-presumido')}
              className="group bg-white border-2 border-purple-200 hover:border-purple-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl mb-3">📈</div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">Lucro Presumido</h4>
                <p className="text-gray-600 text-sm mb-3">IRPJ, CSLL, PIS, COFINS e ISS com presunção</p>
                <div className="text-purple-600 font-semibold text-sm">Calcular →</div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/calculadora-real')}
              className="group bg-white border-2 border-purple-200 hover:border-purple-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl mb-3">💰</div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">Lucro Real</h4>
                <p className="text-gray-600 text-sm mb-3">Tributação sobre lucro contábil efetivo</p>
                <div className="text-purple-600 font-semibold text-sm">Calcular →</div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/simulador-creditos')}
              className="group bg-white border-2 border-purple-200 hover:border-purple-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl mb-3">💵</div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">Créditos PIS/COFINS</h4>
                <p className="text-gray-600 text-sm mb-3">Regime não-cumulativo com créditos</p>
                <div className="text-purple-600 font-semibold text-sm">Simular →</div>
              </div>
            </div>
          </div>
        </div>

        {/* Categoria 3: Análise Inteligente */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
              🎯 Análise & Planejamento
            </div>
            <div className="flex-1 h-1 bg-gradient-to-r from-cyan-300 to-transparent rounded"></div>
            <span className="text-gray-500 font-semibold">{ferramentas.filter(f => f.categoria === 'simulador').length} Ferramentas</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div 
              onClick={() => navigate('/diagnostico-tributario')}
              className="group bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-white">
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold inline-block mb-3">
                  🤖 INTELIGENTE
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-6xl">🎯</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Diagnóstico Tributário</h4>
                    <p className="text-cyan-100 leading-relaxed text-sm">
                      Análise completa dos 3 regimes com ranking e recomendações
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  Analisar Agora → 
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/termometro-risco')}
              className="group bg-gradient-to-br from-red-500 to-orange-600 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-white">
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold inline-block mb-3">
                  📊 COMPLIANCE
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-6xl">🌡️</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Termômetro de Risco</h4>
                    <p className="text-red-100 leading-relaxed text-sm">
                      Checklist com 15 itens gerando score 0-100
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  Avaliar Riscos →
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/planejador-tributario')}
              className="group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-white">
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold inline-block mb-3">
                  🎚️ NOVO
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-6xl">🎚️</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Planejador Visual</h4>
                    <p className="text-indigo-100 leading-relaxed text-sm">
                      Sliders interativos para simular cenários em tempo real
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  Planejar →
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/calculadora-margem')}
              className="group bg-white border-2 border-cyan-200 hover:border-cyan-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">📈</div>
                <div className="flex-1">
                  <div className="bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded text-xs font-bold inline-block mb-2">NOVO</div>
                  <h4 className="font-bold text-lg text-gray-800 mb-2">Calculadora de Margem</h4>
                  <p className="text-gray-600 text-sm mb-3">Calcule margem líquida considerando todos os tributos</p>
                  <div className="flex items-center gap-2 text-cyan-600 font-semibold text-sm">
                    Calcular →
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/historico-tributario')}
              className="group bg-white border-2 border-cyan-200 hover:border-cyan-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">📊</div>
                <div className="flex-1">
                  <div className="bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded text-xs font-bold inline-block mb-2">NOVO</div>
                  <h4 className="font-bold text-lg text-gray-800 mb-2">Histórico Tributário</h4>
                  <p className="text-gray-600 text-sm mb-3">Compare meses com gráficos de evolução e tendências</p>
                  <div className="flex items-center gap-2 text-cyan-600 font-semibold text-sm">
                    Analisar →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categoria 4: Educação Tributária - Expandida */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
              📚 Educação Tributária
            </div>
            <div className="flex-1 h-1 bg-gradient-to-r from-purple-300 to-transparent rounded"></div>
            <span className="text-gray-500 font-semibold">{ferramentas.filter(f => f.categoria === 'educacao').length} Conteúdos</span>
          </div>

          {/* Grid de Conteúdos Educacionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Glossário - Destaque maior */}
            <div 
              onClick={() => navigate('/glossario-tributario')}
              className="group md:col-span-2 lg:col-span-1 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-white">
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold inline-block mb-3">
                  📖 ESSENCIAL
                </div>
                <div className="text-5xl mb-3">📚</div>
                <h4 className="font-bold text-xl mb-2">Glossário Tributário</h4>
                <p className="text-purple-100 text-sm leading-relaxed mb-3">
                  30 termos explicados com exemplos práticos e busca inteligente
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm">Explorar →</span>
                  <span className="text-2xl font-black">30</span>
                </div>
              </div>
            </div>

            {/* Guia de Regimes */}
            <div 
              onClick={() => navigate('/guia-regimes')}
              className="group bg-white border-2 border-blue-200 hover:border-blue-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="text-4xl mb-3">📖</div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">Guia de Regimes</h4>
              <p className="text-gray-600 text-sm mb-3">
                Comparação completa dos 3 regimes com fluxograma de decisão
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                Ler Guia →
              </div>
            </div>

            {/* FAQ */}
            <div 
              onClick={() => navigate('/faq')}
              className="group bg-white border-2 border-green-200 hover:border-green-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="text-4xl mb-3">❓</div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">FAQ Tributário</h4>
              <p className="text-gray-600 text-sm mb-3">
                30 perguntas frequentes organizadas por categoria
              </p>
              <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                Ver Perguntas →
              </div>
            </div>

            {/* Blog */}
            <div 
              onClick={() => navigate('/blog')}
              className="group bg-white border-2 border-orange-200 hover:border-orange-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="text-4xl mb-3">📰</div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">Blog & Artigos</h4>
              <p className="text-gray-600 text-sm mb-3">
                6 artigos completos sobre planejamento tributário
              </p>
              <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm">
                Ler Artigos →
              </div>
            </div>

            {/* Calendário */}
            <div 
              onClick={() => navigate('/calendario')}
              className="group bg-white border-2 border-red-200 hover:border-red-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="text-4xl mb-3">📅</div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">Calendário Tributário</h4>
              <p className="text-gray-600 text-sm mb-3">
                24 obrigações ao longo de 2025 por regime
              </p>
              <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                Ver Calendário →
              </div>
            </div>

            {/* Simulador de Cenários */}
            <div 
              onClick={() => navigate('/simulador-cenarios')}
              className="group bg-white border-2 border-cyan-200 hover:border-cyan-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="text-4xl mb-3">📊</div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">Simulador de Cenários</h4>
              <p className="text-gray-600 text-sm mb-3">
                Compare múltiplos cenários de faturamento
              </p>
              <div className="flex items-center gap-2 text-cyan-600 font-semibold text-sm">
                Simular →
              </div>
            </div>

            {/* Casos de Sucesso */}
            <div 
              onClick={() => navigate('/casos-sucesso')}
              className="group bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-white">
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold inline-block mb-3">
                  🏆 INSPIRAÇÃO
                </div>
                <div className="text-5xl mb-3">💡</div>
                <h4 className="font-bold text-xl mb-2">Casos de Sucesso</h4>
                <p className="text-green-100 text-sm leading-relaxed mb-3">
                  6 cases reais de empresas que economizaram com planejamento
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm">Ver Cases →</span>
                  <span className="text-2xl font-black">6</span>
                </div>
              </div>
            </div>

            {/* Comparador de Indicadores - NOVO */}
            <div 
              onClick={() => navigate('/comparador-indicadores')}
              className="group md:col-span-2 lg:col-span-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-white">
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold inline-block mb-3">
                  📊 NOVO
                </div>
                <div className="text-5xl mb-3">📊</div>
                <h4 className="font-bold text-xl mb-2">Comparador de Indicadores</h4>
                <p className="text-blue-100 text-sm leading-relaxed mb-3">
                  Compare CDI, SELIC e IPCA com gráficos interativos e estatísticas
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm">Comparar →</span>
                  <span className="text-lg font-black">📈</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefícios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border-t-4 border-blue-500 hover:shadow-xl transition">
          <div className="text-3xl md:text-4xl mb-3">🎯</div>
          <h3 className="font-bold text-lg mb-2">Precisão Profissional</h3>
          <p className="text-sm text-gray-600">Cálculos baseados na legislação atual e validados por especialistas</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-green-500 hover:shadow-xl transition">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="font-bold text-lg mb-2">100% Seguro</h3>
          <p className="text-sm text-gray-600">Seus dados são processados localmente no navegador e não são armazenados</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-purple-500 hover:shadow-xl transition">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="font-bold text-lg mb-2">Super Rápido</h3>
          <p className="text-sm text-gray-600">Resultados instantâneos sem necessidade de cadastro ou login</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-orange-500 hover:shadow-xl transition">
          <div className="text-4xl mb-3">💎</div>
          <h3 className="font-bold text-lg mb-2">Totalmente Gratuito</h3>
          <p className="text-sm text-gray-600">Ferramenta completa sem custos, taxas ou assinaturas</p>
        </div>
      </div>

      {/* Ferramentas para Startups */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
            🚀 Ferramentas para Startups
          </div>
          <div className="flex-1 h-1 bg-gradient-to-r from-violet-300 to-transparent rounded"></div>
          <span className="text-gray-500 font-semibold">{ferramentas.filter(f => f.categoria === 'startup').length} Ferramentas</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Calculadora de Runway */}
          <div 
            onClick={() => navigate('/calculadora-runway')}
            className="group bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-white">
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold inline-block mb-3">
                🛫 STARTUP
              </div>
              <div className="text-5xl mb-3">🛫</div>
              <h4 className="font-bold text-xl mb-2">Calculadora de Runway</h4>
              <p className="text-violet-100 text-sm leading-relaxed mb-3">
                Descubra quantos meses sua startup pode operar com o caixa atual e simule cortes de custos
              </p>
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                Calcular Runway →
              </div>
            </div>
          </div>

          {/* Calculadora de Valuation */}
          <div 
            onClick={() => navigate('/calculadora-valuation')}
            className="group bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-white">
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold inline-block mb-3">
                💰 STARTUP
              </div>
              <div className="text-5xl mb-3">💰</div>
              <h4 className="font-bold text-xl mb-2">Calculadora de Valuation</h4>
              <p className="text-fuchsia-100 text-sm leading-relaxed mb-3">
                Calcule valuation pre-money e post-money, simule diferentes equities e analise sensibilidade
              </p>
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                Calcular Valuation →
              </div>
            </div>
          </div>

          {/* Cap Table Simulator */}
          <div 
            onClick={() => navigate('/cap-table')}
            className="group bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-white">
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold inline-block mb-3">
                📊 STARTUP
              </div>
              <div className="text-5xl mb-3">📊</div>
              <h4 className="font-bold text-xl mb-2">Cap Table Simulator</h4>
              <p className="text-indigo-100 text-sm leading-relaxed mb-3">
                Simule a distribuição de equity entre sócios e diluição por rodada de investimento
              </p>
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                Simular Cap Table →
              </div>
            </div>
          </div>

          {/* Calculadora CAC/LTV */}
          <div 
            onClick={() => navigate('/calculadora-cac-ltv')}
            className="group bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-white">
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold inline-block mb-3">
                📊 STARTUP
              </div>
              <div className="text-5xl mb-3">📊</div>
              <h4 className="font-bold text-xl mb-2">CAC, LTV & Payback</h4>
              <p className="text-emerald-100 text-sm leading-relaxed mb-3">
                Calcule métricas de unit economics e analise a saúde do seu modelo de negócio
              </p>
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                Calcular Métricas →
              </div>
            </div>
          </div>

          {/* Simulador de Crescimento */}
          <div
            className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-2xl p-6 border-2 border-violet-200 hover:border-violet-400 hover:shadow-lg cursor-pointer transition-all duration-300 group"
            onClick={() => navigate('/simulador-crescimento')}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📊</div>
            <h4 className="font-bold text-lg text-gray-800 mb-2">Growth Forecast</h4>
            <p className="text-gray-600 text-sm mb-4">
              Projete crescimento de usuários ou MRR com cenários comparativos
            </p>
            <div className="text-violet-600 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
              Simular Crescimento →
            </div>
          </div>

          {/* ROI Simulator */}
          <div
            className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg cursor-pointer transition-all duration-300 group"
            onClick={() => navigate('/simulador-roi')}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💰</div>
            <h4 className="font-bold text-lg text-gray-800 mb-2">ROI Simulator</h4>
            <p className="text-gray-600 text-sm mb-4">
              Calcule ROI e breakeven de novos produtos
            </p>
            <div className="text-amber-600 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
              Simular ROI →
            </div>
          </div>

          {/* Simulador de MRR */}
          <div
            className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl p-6 border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-lg cursor-pointer transition-all duration-300 group"
            onClick={() => navigate('/simulador-mrr')}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📈</div>
            <h4 className="font-bold text-lg text-gray-800 mb-2">Simulador de MRR</h4>
            <p className="text-gray-600 text-sm mb-4">
              Projete MRR e ARR com múltiplos planos de assinatura
            </p>
            <div className="text-indigo-600 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
              Simular MRR →
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Seção - Otimizada para SEO */}
      <div className="bg-white rounded-3xl shadow-xl p-10 mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          ❓ Dúvidas sobre DIFAL, Fator R e Regimes Tributários? Respondemos Aqui
        </h2>
        <p className="text-center text-gray-600 mb-8">
          8 perguntas essenciais sobre Simples Nacional, Lucro Presumido e Lucro Real em 2025
        </p>
        
        <div className="space-y-4 max-w-3xl mx-auto">
          <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition cursor-pointer">
            <summary className="font-bold text-lg text-gray-800 flex justify-between items-center">
              Como saber qual o melhor regime tributário para minha empresa?
              <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Use nosso <strong>Comparador de Regimes</strong> gratuito! Informe seu faturamento anual, despesas e atividade (CNAE). 
              O sistema calcula automaticamente os impostos nos 3 regimes (Simples Nacional, Lucro Presumido e Lucro Real) e mostra 
              qual oferece maior economia. Em 2 minutos você descobre o regime ideal.
            </p>
          </details>

          <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition cursor-pointer">
            <summary className="font-bold text-lg text-gray-800 flex justify-between items-center">
              Os cálculos são confiáveis?
              <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Sim! Nossos cálculos seguem rigorosamente a legislação tributária brasileira atual (2025) e foram validados por contadores 
              e especialistas em tributação. Mantemos nossa base de dados atualizada com as últimas mudanças da Receita Federal, 
              incluindo alíquotas do Simples Nacional, tabelas de IRPJ/CSLL e DIFAL atualizado.
            </p>
          </details>

          <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition cursor-pointer">
            <summary className="font-bold text-lg text-gray-800 flex justify-between items-center">
              Quanto posso economizar mudando de regime tributário?
              <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 leading-relaxed">
              A economia varia conforme faturamento, margem de lucro e atividade. <strong>Empresas podem economizar de 15% a 40%</strong> 
              em impostos ao escolher o regime correto. Por exemplo: uma empresa de serviços com alto pró-labore (Fator R ≥ 28%) 
              pode pagar 6% no Anexo III do Simples, enquanto no Anexo V pagaria até 33%. Use nossas ferramentas para calcular sua economia real.
            </p>
          </details>

          <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition cursor-pointer">
            <summary className="font-bold text-lg text-gray-800 flex justify-between items-center">
              Meus dados ficam salvos? É seguro?
              <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 leading-relaxed">
              <strong>Não salvamos nenhum dado!</strong> Todos os cálculos são processados <strong>100% no seu navegador</strong>. 
              Nenhuma informação é enviada para servidores externos ou armazenada em banco de dados. Sua privacidade e segurança 
              são nossa prioridade. Você pode usar offline após carregar a página.
            </p>
          </details>

          <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition cursor-pointer">
            <summary className="font-bold text-lg text-gray-800 flex justify-between items-center">
              Preciso pagar ou me cadastrar para usar?
              <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 leading-relaxed">
              <strong>Não!</strong> Nossa ferramenta é <strong>100% gratuita</strong> e sempre será. Não há custos ocultos, períodos de teste, 
              necessidade de cartão de crédito ou cadastro. Acesse qualquer ferramenta, quantas vezes quiser, sem limites. 
              Queremos democratizar o acesso ao planejamento tributário para todos os empresários brasileiros.
            </p>
          </details>

          <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition cursor-pointer">
            <summary className="font-bold text-lg text-gray-800 flex justify-between items-center">
              O que é DIFAL e quando preciso pagar?
              <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 leading-relaxed">
              DIFAL (Diferencial de Alíquota) é um imposto estadual devido em <strong>vendas interestaduais para consumidor final</strong>. 
              Se você tem e-commerce e vende de São Paulo para consumidores no Rio de Janeiro, por exemplo, deve recolher DIFAL via GNRE. 
              Use nossa <strong>Calculadora de DIFAL</strong> para calcular o valor exato e evitar multas de até 100% do valor devido.
            </p>
          </details>

          <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition cursor-pointer">
            <summary className="font-bold text-lg text-gray-800 flex justify-between items-center">
              Como calcular o Fator R do Simples Nacional?
              <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 leading-relaxed">
              O <strong>Fator R</strong> determina se sua empresa de serviços se enquadra no <strong>Anexo III (6% a 19,5%)</strong> 
              ou <strong>Anexo V (15,5% a 30,5%)</strong> do Simples Nacional. Fator R = (Folha de Pagamento + Pró-labore) ÷ Receita Bruta dos últimos 12 meses. 
              Se Fator R ≥ 28%, você paga menos no Anexo III. Use nosso <strong>Simulador Fator R</strong> para calcular e otimizar sua folha.
            </p>
          </details>

          <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition cursor-pointer">
            <summary className="font-bold text-lg text-gray-800 flex justify-between items-center">
              Posso confiar nos resultados para tomar decisões?
              <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Nossa ferramenta oferece uma <strong>excelente base para análise e comparação inicial</strong>. Os cálculos são precisos 
              e seguem a legislação vigente. No entanto, sempre recomendamos <strong>consultar um contador</strong> para validar a escolha final, 
              pois cada empresa tem particularidades (incentivos fiscais, deduções específicas, créditos) que podem influenciar na decisão. 
              Use nossas ferramentas como ponto de partida para conversar com seu contador.
            </p>
          </details>
        </div>

        {/* CTA dentro do FAQ */}
        <div className="mt-10 text-center">
          <button 
            onClick={() => navigate('/formulario')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-3"
          >
            <span className="text-2xl">🚀</span>
            Descobrir Melhor Regime Agora
            <span className="text-2xl">→</span>
          </button>
          <p className="text-sm text-gray-500 mt-3">Grátis • Sem cadastro • Resultado em 2 minutos</p>
        </div>
      </div>

      {/* Testemunhos - Prova Social */}
      <div className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">
          💬 O que dizem empresários que usaram nossas ferramentas
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Mais de 1.250 empresas já economizaram milhares em impostos
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">MC</div>
              <div>
                <div className="font-bold text-gray-800">Maria Clara</div>
                <div className="text-sm text-gray-500">E-commerce de Moda</div>
              </div>
            </div>
            <div className="text-yellow-400 mb-3">★★★★★</div>
            <p className="text-gray-700 text-sm leading-relaxed">
              "Economizei <strong>R$ 18 mil/ano</strong> só calculando o DIFAL corretamente. Antes pagava multa por erro no cálculo. 
              Ferramenta salvou meu negócio!"
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">RS</div>
              <div>
                <div className="font-bold text-gray-800">Roberto Silva</div>
                <div className="text-sm text-gray-500">Consultoria TI</div>
              </div>
            </div>
            <div className="text-yellow-400 mb-3">★★★★★</div>
            <p className="text-gray-700 text-sm leading-relaxed">
              "Descobri que estava no regime errado. Migrei do Anexo V para o III usando o <strong>Simulador Fator R</strong>. 
              Redução de <strong>40% nos impostos</strong>. Incrível!"
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">AF</div>
              <div>
                <div className="font-bold text-gray-800">Ana Ferreira</div>
                <div className="text-sm text-gray-500">SaaS Startup</div>
              </div>
            </div>
            <div className="text-yellow-400 mb-3">★★★★★</div>
            <p className="text-gray-700 text-sm leading-relaxed">
              "As ferramentas de startup (Runway, Valuation, CAC/LTV) são profissionais. Economizei <strong>R$ 5 mil em consultoria</strong>. 
              Recomendo!"
            </p>
          </div>
        </div>
      </div>

      {/* CTA Final - Antes do Footer */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-10 md:p-16 text-center text-white mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative z-10">
          <div className="text-5xl mb-6">🎯</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Economizar até 40% em Impostos?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Descubra o regime tributário ideal para sua empresa em menos de 2 minutos. 
            <strong className="text-white"> 100% gratuito, sem cadastro, resultado instantâneo.</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button 
              onClick={() => navigate('/comparador')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all flex items-center gap-3"
            >
              <span>🚀</span>
              Comparar Regimes Agora
            </button>
            <button 
              onClick={() => navigate('/calculadora-das')}
              className="bg-blue-500/30 backdrop-blur border-2 border-white/50 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500/50 transition-all"
            >
              Calcular DAS
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <span className="text-green-300 text-xl">✓</span>
              <span>Sem cadastro</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300 text-xl">✓</span>
              <span>Resultado em 2 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300 text-xl">✓</span>
              <span>1.250+ empresas confiam</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300 text-xl">✓</span>
              <span>Atualizado 2025</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm text-blue-100">
              💡 <strong className="text-white">Dica:</strong> 70% das empresas descobrem que estão no regime errado. 
              Faça o teste agora e veja se você está pagando mais impostos do que deveria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

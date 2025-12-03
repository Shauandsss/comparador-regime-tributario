import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';

function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Atalho Ctrl+K para abrir busca
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setBuscaAberta(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fecha busca ao mudar de rota
  useEffect(() => {
    setBuscaAberta(false);
  }, [location.pathname]);

  return (
    <>
      {/* Modal de Busca */}
      {buscaAberta && <SearchBar onClose={() => setBuscaAberta(false)} />}

      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        {/* Barra superior decorativa */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white text-xl">📊</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-black text-gray-800 text-lg leading-tight">Comparador</div>
              <div className="text-xs text-gray-500 font-medium -mt-0.5">Tributário</div>
            </div>
          </Link>
          
          {/* Menu Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Link Início */}
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Início
            </Link>
            
            {/* Dropdown Calculadoras */}
            <div className="relative group">
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center gap-1.5">
                <span className="text-blue-500">🧮</span>
                Calculadoras
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform group-hover:translate-y-0 translate-y-2 z-50">
                <div className="px-4 py-2 text-xs font-bold text-blue-600 uppercase tracking-wider">Simples Nacional</div>
                <Link to="/calculadora-das" className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors">
                  <span className="text-xl">🧮</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Calculadora DAS</div>
                    <div className="text-xs text-gray-500">Valor exato com alíquota efetiva</div>
                  </div>
                </Link>
                <Link to="/simulador-fator-r" className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors">
                  <span className="text-xl">📐</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Simulador Fator R</div>
                    <div className="text-xs text-gray-500">Anexo III ou V?</div>
                  </div>
                </Link>
                <Link to="/calculadora-pro-labore" className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors">
                  <span className="text-xl">💼</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Pró-Labore</div>
                    <div className="text-xs text-gray-500">INSS + IRPF otimizado</div>
                  </div>
                </Link>
                <Link to="/calculadora-distribuicao-lucros" className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors">
                  <span className="text-xl">💰</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Distribuição de Lucros</div>
                    <div className="text-xs text-gray-500">Otimize retiradas dos sócios</div>
                  </div>
                </Link>
                
                <div className="border-t border-gray-100 my-2"></div>
                <div className="px-4 py-2 text-xs font-bold text-purple-600 uppercase tracking-wider">Lucro Presumido & Real</div>
                <Link to="/calculadora-presumido" className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors">
                  <span className="text-xl">📈</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Lucro Presumido</div>
                    <div className="text-xs text-gray-500">IRPJ, CSLL, PIS, COFINS</div>
                  </div>
                </Link>
                <Link to="/calculadora-real" className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors">
                  <span className="text-xl">💰</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Lucro Real</div>
                    <div className="text-xs text-gray-500">Tributação sobre lucro efetivo</div>
                  </div>
                </Link>
                <Link to="/simulador-creditos" className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors">
                  <span className="text-xl">💵</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Créditos PIS/COFINS</div>
                    <div className="text-xs text-gray-500">Regime não-cumulativo</div>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Dropdown Simuladores */}
            <div className="relative group">
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center gap-1.5">
                <span className="text-emerald-500">🎯</span>
                Simuladores
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform group-hover:translate-y-0 translate-y-2 z-50">
                <Link to="/diagnostico-tributario" className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors">
                  <span className="text-xl">🎯</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Diagnóstico Tributário</div>
                    <div className="text-xs text-gray-500">Análise completa + recomendações</div>
                  </div>
                </Link>
                <Link to="/planejador-tributario" className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors">
                  <span className="text-xl">🎚️</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Planejador Visual</div>
                    <div className="text-xs text-gray-500">Sliders interativos em tempo real</div>
                  </div>
                </Link>
                <Link to="/simulador-migracao" className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors">
                  <span className="text-xl">🔄</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Migração MEI → ME</div>
                    <div className="text-xs text-gray-500">Simule o impacto da transição</div>
                  </div>
                </Link>
                <Link to="/simulador-desenquadramento" className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Desenquadramento</div>
                    <div className="text-xs text-gray-500">Preveja limites MEI/Simples</div>
                  </div>
                </Link>
                <Link to="/termometro-risco" className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors">
                  <span className="text-xl">🌡️</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Termômetro de Risco</div>
                    <div className="text-xs text-gray-500">Score de compliance 0-100</div>
                  </div>
                </Link>
                <Link to="/calculadora-margem" className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors">
                  <span className="text-xl">📈</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Calculadora Margem</div>
                    <div className="text-xs text-gray-500">Margem líquida + tributos</div>
                  </div>
                </Link>
                <Link to="/historico-tributario" className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors">
                  <span className="text-xl">📊</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Histórico Tributário</div>
                    <div className="text-xs text-gray-500">Compare meses e tendências</div>
                  </div>
                </Link>
                <Link to="/simulador-cenarios" className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors">
                  <span className="text-xl">📊</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Simulador Cenários</div>
                    <div className="text-xs text-gray-500">Compare múltiplos cenários</div>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Dropdown Educação - NOVO */}
            <div className="relative group">
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center gap-1.5">
                <span className="text-purple-500">📚</span>
                Aprender
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform group-hover:translate-y-0 translate-y-2 z-50">
                <div className="px-4 py-2 text-xs font-bold text-purple-600 uppercase tracking-wider">Conteúdo Educacional</div>
                <Link to="/guia-regimes" className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors">
                  <span className="text-xl">📖</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Guia de Regimes</div>
                    <div className="text-xs text-gray-500">Comparação completa dos 3 regimes</div>
                  </div>
                </Link>
                <Link to="/guia-cnae" className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors">
                  <span className="text-xl">📋</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Guia CNAE → Anexo</div>
                    <div className="text-xs text-gray-500">Descubra seu anexo pelo CNAE</div>
                  </div>
                </Link>
                <Link to="/explicador-simples" className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors">
                  <span className="text-xl">🎓</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Explicador Visual</div>
                    <div className="text-xs text-gray-500">Entenda o Simples Nacional</div>
                  </div>
                </Link>
                <Link to="/glossario-tributario" className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors">
                  <span className="text-xl">📚</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Glossário Tributário</div>
                    <div className="text-xs text-gray-500">30 termos explicados</div>
                  </div>
                </Link>
                
                <div className="border-t border-gray-100 my-2"></div>
                <div className="px-4 py-2 text-xs font-bold text-orange-600 uppercase tracking-wider">Recursos</div>
                <Link to="/blog" className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors">
                  <span className="text-xl">📰</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Blog & Artigos</div>
                    <div className="text-xs text-gray-500">Dicas de planejamento tributário</div>
                  </div>
                </Link>
                <Link to="/faq" className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors">
                  <span className="text-xl">❓</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">FAQ</div>
                    <div className="text-xs text-gray-500">Perguntas frequentes</div>
                  </div>
                </Link>
                <Link to="/calendario" className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors">
                  <span className="text-xl">📅</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Calendário 2025</div>
                    <div className="text-xs text-gray-500">Obrigações tributárias</div>
                  </div>
                </Link>
                <Link to="/casos-sucesso" className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors">
                  <span className="text-xl">🏆</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Casos de Sucesso</div>
                    <div className="text-xs text-gray-500">Empresas que economizaram</div>
                  </div>
                </Link>
                
                <div className="border-t border-gray-100 my-2"></div>
                <div className="px-4 py-2 text-xs font-bold text-blue-600 uppercase tracking-wider">Indicadores Financeiros</div>
                <Link to="/comparador-indicadores" className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors">
                  <span className="text-xl">📊</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Comparador de Indicadores</div>
                    <div className="text-xs text-gray-500">CDI, SELIC e IPCA</div>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Dropdown Startups */}
            <div className="relative group">
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center gap-1.5">
                <span className="text-violet-500">🚀</span>
                Startups
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform group-hover:translate-y-0 translate-y-2 z-50">
                <div className="px-4 py-2 text-xs font-bold text-violet-600 uppercase tracking-wider">Métricas de Startup</div>
                <Link to="/calculadora-runway" className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 transition-colors">
                  <span className="text-xl">🛫</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Calculadora Runway</div>
                    <div className="text-xs text-gray-500">Meses de operação restantes</div>
                  </div>
                </Link>
                <Link to="/calculadora-valuation" className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 transition-colors">
                  <span className="text-xl">💰</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Valuation</div>
                    <div className="text-xs text-gray-500">Pre-money e post-money</div>
                  </div>
                </Link>
                <Link to="/cap-table" className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 transition-colors">
                  <span className="text-xl">📊</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Cap Table</div>
                    <div className="text-xs text-gray-500">Distribuição de equity</div>
                  </div>
                </Link>
                <Link to="/calculadora-cac-ltv" className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 transition-colors">
                  <span className="text-xl">📈</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">CAC, LTV & Payback</div>
                    <div className="text-xs text-gray-500">Unit economics</div>
                  </div>
                </Link>
                <Link to="/simulador-crescimento" className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 transition-colors">
                  <span className="text-xl">📊</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Growth Forecast</div>
                    <div className="text-xs text-gray-500">Projeções de crescimento</div>
                  </div>
                </Link>
                <Link to="/simulador-roi" className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 transition-colors">
                  <span className="text-xl">💰</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">ROI Simulator</div>
                    <div className="text-xs text-gray-500">Retorno sobre investimento</div>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Botão de Busca */}
            <button
              onClick={() => setBuscaAberta(true)}
              className="ml-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all flex items-center gap-2 group"
              title="Buscar ferramentas (Ctrl+K)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden xl:flex items-center gap-1 text-xs text-gray-400 group-hover:text-gray-500">
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 font-mono">Ctrl</kbd>
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 font-mono">K</kbd>
              </span>
            </button>

            {/* Botão Comparador */}
            <Link 
              to="/formulario" 
              className="ml-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-semibold text-sm shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span>⚖️</span>
              Comparar
            </Link>
          </div>

          {/* Menu Mobile - Hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Botão Busca Mobile */}
            <button 
              onClick={() => setBuscaAberta(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label="Buscar"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Hamburger */}
            <button 
              onClick={() => setMenuAberto(!menuAberto)}
              className="p-2 rounded-lg hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label="Menu"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuAberto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Menu Mobile Expandido */}
        {menuAberto && (
          <div className="lg:hidden pb-4 border-t border-gray-100 mt-2 pt-4 max-h-[80vh] overflow-y-auto">
            <div className="space-y-1">
              {/* Barra de busca rápida mobile */}
              <button 
                onClick={() => { setMenuAberto(false); setBuscaAberta(true); }}
                className="w-full flex items-center gap-3 mx-4 mb-4 px-4 py-3 bg-gray-100 rounded-xl text-gray-500 text-sm"
                style={{ width: 'calc(100% - 2rem)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Buscar ferramentas...
              </button>
              
              <Link to="/" className="block px-4 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700" onClick={() => setMenuAberto(false)}>
                🏠 Início
              </Link>
              
              {/* Calculadoras */}
              <div className="px-4 py-2 text-xs font-bold text-blue-600 uppercase tracking-wider mt-4">🧮 Calculadoras</div>
              <Link to="/calculadora-das" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Calculadora DAS
              </Link>
              <Link to="/simulador-fator-r" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Fator R
              </Link>
              <Link to="/calculadora-pro-labore" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Pró-Labore
              </Link>
              <Link to="/calculadora-distribuicao-lucros" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Distribuição de Lucros
              </Link>
              <Link to="/calculadora-presumido" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Lucro Presumido
              </Link>
              <Link to="/calculadora-real" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Lucro Real
              </Link>
              <Link to="/simulador-creditos" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Créditos PIS/COFINS
              </Link>
              
              {/* Simuladores */}
              <div className="px-4 py-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mt-4">🎯 Simuladores</div>
              <Link to="/diagnostico-tributario" className="block px-4 py-2 rounded-lg hover:bg-emerald-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Diagnóstico Tributário
              </Link>
              <Link to="/planejador-tributario" className="block px-4 py-2 rounded-lg hover:bg-emerald-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Planejador Visual
              </Link>
              <Link to="/simulador-migracao" className="block px-4 py-2 rounded-lg hover:bg-emerald-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Migração MEI → ME
              </Link>
              <Link to="/simulador-desenquadramento" className="block px-4 py-2 rounded-lg hover:bg-emerald-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Desenquadramento
              </Link>
              <Link to="/termometro-risco" className="block px-4 py-2 rounded-lg hover:bg-emerald-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Termômetro de Risco
              </Link>
              <Link to="/calculadora-margem" className="block px-4 py-2 rounded-lg hover:bg-emerald-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Calculadora Margem
              </Link>
              <Link to="/historico-tributario" className="block px-4 py-2 rounded-lg hover:bg-emerald-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Histórico Tributário
              </Link>
              <Link to="/simulador-cenarios" className="block px-4 py-2 rounded-lg hover:bg-emerald-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Simulador Cenários
              </Link>
              
              {/* Aprender */}
              <div className="px-4 py-2 text-xs font-bold text-purple-600 uppercase tracking-wider mt-4">📚 Aprender</div>
              <Link to="/guia-regimes" className="block px-4 py-2 rounded-lg hover:bg-purple-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Guia de Regimes
              </Link>
              <Link to="/guia-cnae" className="block px-4 py-2 rounded-lg hover:bg-purple-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Guia CNAE → Anexo
              </Link>
              <Link to="/explicador-simples" className="block px-4 py-2 rounded-lg hover:bg-purple-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Explicador Visual
              </Link>
              <Link to="/glossario-tributario" className="block px-4 py-2 rounded-lg hover:bg-purple-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Glossário Tributário
              </Link>
              <Link to="/blog" className="block px-4 py-2 rounded-lg hover:bg-purple-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Blog & Artigos
              </Link>
              <Link to="/faq" className="block px-4 py-2 rounded-lg hover:bg-purple-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                FAQ
              </Link>
              <Link to="/calendario" className="block px-4 py-2 rounded-lg hover:bg-purple-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Calendário 2025
              </Link>
              <Link to="/casos-sucesso" className="block px-4 py-2 rounded-lg hover:bg-purple-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Casos de Sucesso
              </Link>
              <Link to="/comparador-indicadores" className="block px-4 py-2 rounded-lg hover:bg-purple-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Comparador de Indicadores
              </Link>
              
              {/* Startups */}
              <div className="px-4 py-2 text-xs font-bold text-violet-600 uppercase tracking-wider mt-4">🚀 Startups</div>
              <Link to="/calculadora-runway" className="block px-4 py-2 rounded-lg hover:bg-violet-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Runway
              </Link>
              <Link to="/calculadora-valuation" className="block px-4 py-2 rounded-lg hover:bg-violet-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Valuation
              </Link>
              <Link to="/cap-table" className="block px-4 py-2 rounded-lg hover:bg-violet-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Cap Table
              </Link>
              <Link to="/calculadora-cac-ltv" className="block px-4 py-2 rounded-lg hover:bg-violet-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                CAC/LTV
              </Link>
              <Link to="/simulador-crescimento" className="block px-4 py-2 rounded-lg hover:bg-violet-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                Growth Forecast
              </Link>
              <Link to="/simulador-roi" className="block px-4 py-2 rounded-lg hover:bg-violet-50 text-sm text-gray-600" onClick={() => setMenuAberto(false)}>
                ROI Simulator
              </Link>
              
              {/* Botão Comparador */}
              <Link 
                to="/formulario" 
                className="block mt-6 mx-4 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-center shadow-lg" 
                onClick={() => setMenuAberto(false)}
              >
                ⚖️ Comparar Regimes
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  );
}

export default Header;

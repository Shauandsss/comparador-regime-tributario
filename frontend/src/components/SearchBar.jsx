import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBuscaFerramentas } from '../hooks/useBuscaFerramentas';
import { categorias } from '../data/ferramentas';

function SearchBar({ onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [indiceSelecionado, setIndiceSelecionado] = useState(0);
  
  const {
    termoBusca,
    setTermoBusca,
    resultados,
    sugestoes,
    atalhos,
    filtroCategoria,
    setFiltroCategoria
  } = useBuscaFerramentas();

  // Foca no input ao abrir
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Reset índice quando resultados mudam
  useEffect(() => {
    setIndiceSelecionado(0);
  }, [resultados]);

  // Navegação por teclado
  const handleKeyDown = (e) => {
    const itens = termoBusca.length >= 2 ? resultados : atalhos;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIndiceSelecionado(prev => 
          prev < itens.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setIndiceSelecionado(prev => 
          prev > 0 ? prev - 1 : itens.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (itens[indiceSelecionado]) {
          navigate(itens[indiceSelecionado].rota);
          onClose?.();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose?.();
        break;
    }
  };

  // Clique fora fecha
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getCorCategoria = (cor) => {
    const cores = {
      blue: 'bg-blue-100 text-blue-700',
      purple: 'bg-purple-100 text-purple-700',
      emerald: 'bg-emerald-100 text-emerald-700',
      violet: 'bg-violet-100 text-violet-700',
      orange: 'bg-orange-100 text-orange-700',
      gradient: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
    };
    return cores[cor] || cores.blue;
  };

  const renderResultado = (item, index, isAtivo) => (
    <Link
      key={item.id}
      to={item.rota}
      onClick={() => onClose?.()}
      className={`flex items-center gap-4 px-4 py-3 transition-colors ${
        isAtivo ? 'bg-blue-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${getCorCategoria(item.cor)}`}>
        {item.icone}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 truncate">{item.nome}</span>
          {item.destaque && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-amber-100 text-amber-700 rounded">
              Principal
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">{item.descricao}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getCorCategoria(item.cor)}`}>
          {categorias[item.categoria]?.nome || item.categoria}
        </span>
        {isAtivo && (
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded border">
            Enter
          </kbd>
        )}
      </div>
    </Link>
  );

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-black/50 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Header com input */}
        <div className="relative border-b border-gray-100">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar ferramentas, calculadoras, simuladores..."
            className="w-full pl-12 pr-12 py-4 text-lg focus:outline-none placeholder:text-gray-400"
          />
          <button 
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filtros por categoria */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 overflow-x-auto">
          <button
            onClick={() => setFiltroCategoria(null)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition whitespace-nowrap ${
              !filtroCategoria 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Todas
          </button>
          {Object.entries(categorias).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setFiltroCategoria(key === filtroCategoria ? null : key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                filtroCategoria === key
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{cat.icone}</span>
              {cat.nome}
            </button>
          ))}
        </div>

        {/* Resultados */}
        <div className="max-h-[50vh] overflow-y-auto">
          {termoBusca.length >= 2 ? (
            resultados.length > 0 ? (
              <div>
                <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  {resultados.length} resultado{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
                </div>
                {resultados.map((item, index) => 
                  renderResultado(item, index, index === indiceSelecionado)
                )}
              </div>
            ) : (
              <div className="px-4 py-12 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-600 font-medium">Nenhum resultado encontrado</p>
                <p className="text-sm text-gray-400 mt-1">
                  Tente buscar por: {sugestoes.slice(0, 3).join(', ')}
                </p>
              </div>
            )
          ) : (
            <>
              {/* Atalhos rápidos */}
              <div>
                <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  ⚡ Acesso Rápido
                </div>
                {atalhos.map((item, index) => 
                  renderResultado(item, index, index === indiceSelecionado)
                )}
              </div>

              {/* Sugestões de busca */}
              <div className="px-4 py-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  💡 Sugestões de busca
                </p>
                <div className="flex flex-wrap gap-2">
                  {sugestoes.map((sugestao, index) => (
                    <button
                      key={index}
                      onClick={() => setTermoBusca(sugestao)}
                      className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      {sugestao}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer com atalhos de teclado */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border shadow-sm">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white rounded border shadow-sm">↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border shadow-sm">Enter</kbd>
              selecionar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border shadow-sm">Esc</kbd>
              fechar
            </span>
          </div>
          <span className="hidden sm:block">
            <kbd className="px-1.5 py-0.5 bg-white rounded border shadow-sm">Ctrl</kbd>
            +
            <kbd className="px-1.5 py-0.5 bg-white rounded border shadow-sm">K</kbd>
            para buscar
          </span>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Filter } from 'lucide-react';
import { ferramentas, categorias, subcategorias } from '../data/ferramentas';

/**
 * Hub de Ferramentas - Página central com todas as calculadoras e simuladores
 */
const HubFerramentas = () => {
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [subcategoriaFiltro, setSubcategoriaFiltro] = useState('todas');

  // Filtrar ferramentas
  const ferramentasFiltradas = ferramentas.filter(ferramenta => {
    // Filtro de busca
    const termoBusca = busca.toLowerCase();
    const matchBusca = !busca || 
      ferramenta.nome.toLowerCase().includes(termoBusca) ||
      ferramenta.descricao.toLowerCase().includes(termoBusca) ||
      ferramenta.tags.some(tag => tag.toLowerCase().includes(termoBusca)) ||
      ferramenta.sinonimos.some(sin => sin.toLowerCase().includes(termoBusca)) ||
      ferramenta.palavrasChave.some(pc => pc.toLowerCase().includes(termoBusca));

    // Filtro de categoria
    const matchCategoria = categoriaFiltro === 'todas' || ferramenta.categoria === categoriaFiltro;

    // Filtro de subcategoria
    const matchSubcategoria = subcategoriaFiltro === 'todas' || ferramenta.subcategoria === subcategoriaFiltro;

    return matchBusca && matchCategoria && matchSubcategoria;
  });

  // Agrupar por categoria
  const ferramentasPorCategoria = ferramentasFiltradas.reduce((acc, ferramenta) => {
    if (!acc[ferramenta.categoria]) {
      acc[ferramenta.categoria] = [];
    }
    acc[ferramenta.categoria].push(ferramenta);
    return acc;
  }, {});

  // Contar ferramentas por categoria
  const contagemCategorias = Object.keys(categorias).reduce((acc, cat) => {
    acc[cat] = ferramentas.filter(f => f.categoria === cat).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">
              Hub de Ferramentas Tributárias
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Mais de {ferramentas.length} calculadoras e simuladores para otimizar sua gestão tributária e financeira
            </p>

            {/* Barra de Busca */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome, categoria ou palavra-chave..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30"
              />
            </div>

            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{ferramentas.length}</div>
                <div className="text-sm text-blue-100">Ferramentas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{Object.keys(categorias).length}</div>
                <div className="text-sm text-blue-100">Categorias</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm text-blue-100">Grátis</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">∞</div>
                <div className="text-sm text-blue-100">Usos ilimitados</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filtros por Categoria */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filtrar por Categoria</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setCategoriaFiltro('todas');
                setSubcategoriaFiltro('todas');
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                categoriaFiltro === 'todas'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
              }`}
            >
              Todas ({ferramentas.length})
            </button>
            {Object.entries(categorias).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => {
                  setCategoriaFiltro(key);
                  setSubcategoriaFiltro('todas');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  categoriaFiltro === key
                    ? `bg-gradient-to-r from-${cat.cor}-500 to-${cat.cor}-600 text-white shadow-lg`
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                }`}
              >
                {cat.icone} {cat.nome} ({contagemCategorias[key] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Resultados da Busca */}
        {busca && (
          <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-blue-900">
              <strong>{ferramentasFiltradas.length}</strong> {ferramentasFiltradas.length === 1 ? 'ferramenta encontrada' : 'ferramentas encontradas'} para "{busca}"
            </p>
          </div>
        )}

        {/* Grid de Ferramentas por Categoria */}
        {Object.entries(ferramentasPorCategoria).length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Nenhuma ferramenta encontrada</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou termos de busca</p>
          </div>
        ) : (
          Object.entries(ferramentasPorCategoria).map(([catKey, ferramentasCat]) => {
            const catInfo = categorias[catKey];
            if (!catInfo) return null;

            return (
              <div key={catKey} className="mb-12">
                {/* Header da Categoria */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">{catInfo.icone}</span>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{catInfo.nome}</h2>
                    <p className="text-gray-600">{catInfo.descricao}</p>
                  </div>
                </div>

                {/* Grid de Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ferramentasCat.map(ferramenta => {
                    const corGradient = ferramenta.cor === 'gradient' 
                      ? 'from-blue-600 to-purple-600'
                      : `from-${ferramenta.cor}-500 to-${ferramenta.cor}-600`;

                    return (
                      <Link
                        key={ferramenta.id}
                        to={ferramenta.rota}
                        className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent hover:-translate-y-1"
                      >
                        {/* Header do Card */}
                        <div className={`bg-gradient-to-r ${corGradient} p-6 text-white`}>
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-4xl">{ferramenta.icone}</span>
                            {ferramenta.destaque && (
                              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                                ⭐ Destaque
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{ferramenta.nome}</h3>
                          <p className="text-sm opacity-90">{ferramenta.descricao}</p>
                        </div>

                        {/* Conteúdo do Card */}
                        <div className="p-6">
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {ferramenta.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {ferramenta.tags.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                                +{ferramenta.tags.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Subcategoria */}
                          {ferramenta.subcategoria && (
                            <div className="text-sm text-gray-600 mb-4">
                              <span className="font-semibold">Subcategoria:</span> {subcategorias[ferramenta.subcategoria]}
                            </div>
                          )}

                          {/* CTA */}
                          <div className="flex items-center justify-between text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                            <span>Usar ferramenta</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Encontrou o que procurava?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Todas as nossas ferramentas são 100% gratuitas e não exigem cadastro. 
            Use quantas vezes quiser!
          </p>
          <Link
            to="/"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HubFerramentas;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  Building2, 
  Apple, 
  CreditCard, 
  TrendingUp, 
  Sparkles,
  X,
  ChevronRight
} from 'lucide-react';

function MenuReformaTributaria({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleNavigation = (rota) => {
    navigate(rota);
    onClose();
  };

  const categorias = [
    {
      id: 'visao-geral',
      nome: 'Visão Geral',
      icone: Calculator,
      cor: 'blue',
      ferramentas: [
        { 
          nome: 'Simulador de Impacto', 
          rota: '/simulador-impacto-reforma',
          descricao: 'Compare atual vs reforma'
        },
        { 
          nome: 'Calculadora Alíquota Efetiva', 
          rota: '/calculadora-aliquota-efetiva',
          descricao: 'Calcule IBS/CBS real'
        },
        { 
          nome: 'Simulador IVA Dual', 
          rota: '/simulador-iva-dual',
          descricao: 'IBS e CBS separados'
        },
        { 
          nome: 'Analisador Transição', 
          rota: '/analisador-impacto-transicao',
          descricao: 'Ano a ano 2026-2033'
        }
      ]
    },
    {
      id: 'por-setor',
      nome: 'Por Setor',
      icone: Building2,
      cor: 'purple',
      ferramentas: [
        { 
          nome: 'E-commerce', 
          rota: '/simulador-ecommerce-reforma',
          descricao: 'Lojas virtuais'
        },
        { 
          nome: 'Indústria', 
          rota: '/simulador-industria-reforma',
          descricao: 'Manufatura, produção'
        },
        { 
          nome: 'Serviços', 
          rota: '/simulador-servicos-reforma',
          descricao: 'Consultoria, TI, liberais'
        },
        { 
          nome: 'Construção Civil', 
          rota: '/simulador-construcao-reforma',
          descricao: 'Obras, incorporação'
        },
        { 
          nome: 'Serviços Financeiros', 
          rota: '/simulador-servicos-financeiros',
          descricao: 'Bancos, fintechs, cooperativas'
        }
      ]
    },
    {
      id: 'aliquotas-especiais',
      nome: 'Alíquotas Especiais',
      icone: Apple,
      cor: 'green',
      ferramentas: [
        { 
          nome: 'Cesta Básica', 
          rota: '/simulador-cesta-basica',
          descricao: 'Alíquota zero alimentos'
        },
        { 
          nome: 'Lista Cesta Básica Nacional', 
          rota: '/cesta-basica-iva',
          descricao: 'Produtos alíquota zero'
        },
        { 
          nome: 'Alíquotas Reduzidas', 
          rota: '/calculadora-aliquota-reduzida',
          descricao: '60%, 70%, 80% redução'
        },
        { 
          nome: 'Imposto Seletivo', 
          rota: '/simulador-imposto-seletivo',
          descricao: 'Bebidas, cigarros, veículos'
        }
      ]
    },
    {
      id: 'creditos-beneficios',
      nome: 'Créditos e Benefícios',
      icone: CreditCard,
      cor: 'teal',
      ferramentas: [
        { 
          nome: 'Calculadora Créditos IVA', 
          rota: '/calculadora-creditos-iva',
          descricao: 'Quanto creditar'
        },
        { 
          nome: 'Painel Créditos Acumulados', 
          rota: '/painel-creditos-acumulados',
          descricao: 'E-commerce, indústria'
        },
        { 
          nome: 'Cashback IBS', 
          rota: '/simulador-cashback-ibs',
          descricao: 'Devolução baixa renda'
        },
        { 
          nome: 'Exportações Crédito 100%', 
          rota: '/simulador-exportacao',
          descricao: 'Ressarcimento integral'
        }
      ]
    },
    {
      id: 'transicao-planejamento',
      nome: 'Transição e Planejamento',
      icone: TrendingUp,
      cor: 'orange',
      ferramentas: [
        { 
          nome: 'Transição 2026-2033', 
          rota: '/simulador-transicao-reforma',
          descricao: 'Cronograma gradual'
        },
        { 
          nome: 'Planejador Reforma', 
          rota: '/planejador-reforma',
          descricao: 'Prepare empresa'
        },
        { 
          nome: 'Substituição Tributária 2026', 
          rota: '/simulador-st-2026',
          descricao: 'Fim ICMS-ST'
        },
        { 
          nome: 'NF-e IBS/CBS', 
          rota: '/simulador-nfe-ibscbs',
          descricao: 'Nova nota fiscal'
        }
      ]
    },
    {
      id: 'simplificado',
      nome: 'Simplificado',
      icone: Sparkles,
      cor: 'pink',
      ferramentas: [
        { 
          nome: 'IVA Simplificado', 
          rota: '/simulador-iva-simplificado',
          descricao: 'Versão simplificada'
        },
        { 
          nome: 'Partilha IBS', 
          rota: '/calculadora-partilha-ibs',
          descricao: 'Divisão estados/municípios'
        }
      ]
    }
  ];

  const cores = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800',
      hover: 'hover:bg-blue-100'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-800',
      hover: 'hover:bg-purple-100'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      badge: 'bg-green-100 text-green-800',
      hover: 'hover:bg-green-100'
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-700',
      badge: 'bg-teal-100 text-teal-800',
      hover: 'hover:bg-teal-100'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      badge: 'bg-orange-100 text-orange-800',
      hover: 'hover:bg-orange-100'
    },
    pink: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-700',
      badge: 'bg-pink-100 text-pink-800',
      hover: 'hover:bg-pink-100'
    }
  };

  const [categoriasAbertas, setCategoriasAbertas] = React.useState(
    categorias.reduce((acc, cat) => ({ ...acc, [cat.id]: true }), {})
  );

  const toggleCategoria = (id) => {
    setCategoriasAbertas(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[600px] md:w-[700px] lg:w-[800px] bg-white shadow-2xl z-[70] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span>✨</span>
                Reforma Tributária IBS/CBS
              </h2>
              <p className="text-blue-100 text-sm mt-1">2026-2033 • 27 ferramentas especializadas</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4">
          {categorias.map((categoria) => {
            const Icone = categoria.icone;
            const cor = cores[categoria.cor];
            const isAberta = categoriasAbertas[categoria.id];

            return (
              <div 
                key={categoria.id}
                className={`border-2 ${cor.border} rounded-xl overflow-hidden transition-all`}
              >
                {/* Header Categoria */}
                <button
                  onClick={() => toggleCategoria(categoria.id)}
                  className={`w-full ${cor.bg} p-4 flex items-center justify-between ${cor.hover} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <Icone className={`w-6 h-6 ${cor.text}`} />
                    <h3 className={`font-bold text-lg ${cor.text}`}>{categoria.nome}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${cor.badge}`}>
                      {categoria.ferramentas.length}
                    </span>
                  </div>
                  <ChevronRight 
                    className={`w-5 h-5 ${cor.text} transition-transform ${isAberta ? 'rotate-90' : ''}`}
                  />
                </button>

                {/* Ferramentas */}
                {isAberta && (
                  <div className="bg-white">
                    {categoria.ferramentas.map((ferramenta, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleNavigation(ferramenta.rota)}
                        className="w-full p-4 flex items-center justify-between border-t border-gray-100 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="text-left">
                          <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {ferramenta.nome}
                          </div>
                          <div className="text-sm text-gray-500 mt-0.5">
                            {ferramenta.descricao}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Info Box */}
          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
            <h4 className="font-bold text-lg text-yellow-900 mb-3 flex items-center gap-2">
              <span>📋</span>
              Sobre a Reforma Tributária
            </h4>
            <div className="space-y-2 text-sm text-yellow-800">
              <p>
                A <strong>Emenda Constitucional 132/2023</strong> instituiu a reforma tributária brasileira, 
                unificando 5 tributos (PIS, Cofins, IPI, ICMS, ISS) em 2 impostos modernos:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>IBS</strong> (Imposto sobre Bens e Serviços) - estadual e municipal</li>
                <li><strong>CBS</strong> (Contribuição sobre Bens e Serviços) - federal</li>
              </ul>
              <p className="mt-3">
                <strong>Transição gradual:</strong> 2026-2033 • <strong>Alíquota estimada:</strong> 26,5% 
                (podendo variar conforme setor e benefícios)
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuReformaTributaria;

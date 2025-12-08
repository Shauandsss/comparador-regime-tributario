import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Calculator, 
  TrendingUp, 
  Package, 
  Building2, 
  ShoppingCart, 
  Factory, 
  Briefcase, 
  Truck, 
  Home as HomeIcon, 
  Apple, 
  Hammer, 
  Wine, 
  Globe, 
  CreditCard, 
  ChevronRight,
  X,
  Landmark,
  Users,
  Smartphone
} from 'lucide-react';

const MenuReformaTributaria = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);

  const ferramentasReforma = [
    {
      categoria: 'Visão Geral',
      icon: Calculator,
      cor: 'blue',
      ferramentas: [
        { 
          nome: 'Simulador de Impacto', 
          rota: '/simulador-impacto-reforma',
          descricao: 'Compare sistema atual vs reforma',
          icon: TrendingUp
        },
        { 
          nome: 'Calculadora Alíquota Efetiva', 
          rota: '/calculadora-aliquota-efetiva',
          descricao: 'Calcule sua alíquota real de IBS/CBS',
          icon: Calculator
        },
        { 
          nome: 'Simulador IVA Dual', 
          rota: '/simulador-iva-dual',
          descricao: 'Entenda IBS e CBS separadamente',
          icon: Package
        },
        { 
          nome: 'Analisador Transição', 
          rota: '/analisador-impacto-transicao',
          descricao: 'Impacto ano a ano 2026-2033',
          icon: TrendingUp
        },
      ]
    },
    {
      categoria: 'Por Setor',
      icon: Building2,
      cor: 'purple',
      ferramentas: [
        { 
          nome: 'E-commerce', 
          rota: '/simulador-ecommerce-reforma',
          descricao: 'Impacto em lojas virtuais',
          icon: ShoppingCart
        },
        { 
          nome: 'Indústria', 
          rota: '/simulador-industria-reforma',
          descricao: 'Manufatura e produção',
          icon: Factory
        },
        { 
          nome: 'Serviços', 
          rota: '/simulador-servicos-reforma',
          descricao: 'Consultoria, TI, profissionais liberais',
          icon: Briefcase
        },
        { 
          nome: 'Construção Civil', 
          rota: '/simulador-construcao-reforma',
          descricao: 'Obras, incorporação, terceirização',
          icon: Hammer
        },
        { 
          nome: 'Serviços Financeiros', 
          rota: '/simulador-servicos-financeiros',
          descricao: 'Bancos, fintechs, cooperativas',
          icon: Landmark
        },
      ]
    },
    {
      categoria: 'Alíquotas Especiais',
      icon: Apple,
      cor: 'green',
      ferramentas: [
        { 
          nome: 'Cesta Básica', 
          rota: '/simulador-cesta-basica',
          descricao: 'Alíquota zero para alimentos',
          icon: Apple
        },
        { 
          nome: 'Lista Cesta Básica Nacional', 
          rota: '/cesta-basica-iva',
          descricao: 'Produtos com alíquota zero',
          icon: Package
        },
        { 
          nome: 'Alíquotas Reduzidas', 
          rota: '/calculadora-aliquota-reduzida',
          descricao: '60%, 70%, 80% de redução',
          icon: TrendingUp
        },
        { 
          nome: 'Imposto Seletivo', 
          rota: '/simulador-imposto-seletivo',
          descricao: 'Bebidas, cigarros, veículos',
          icon: Wine
        },
      ]
    },
    {
      categoria: 'Créditos e Benefícios',
      icon: CreditCard,
      cor: 'teal',
      ferramentas: [
        { 
          nome: 'Calculadora de Créditos IVA', 
          rota: '/calculadora-creditos-iva',
          descricao: 'Quanto você pode creditar',
          icon: CreditCard
        },
        { 
          nome: 'Painel Créditos Acumulados', 
          rota: '/painel-creditos-acumulados',
          descricao: 'E-commerce, indústria, atacado',
          icon: Package
        },
        { 
          nome: 'Cashback IBS', 
          rota: '/simulador-cashback-ibs',
          descricao: 'Devolução para baixa renda',
          icon: CreditCard
        },
        { 
          nome: 'Exportações (Crédito 100%)', 
          rota: '/simulador-exportacao',
          descricao: 'Ressarcimento integral exportadores',
          icon: Globe
        },
      ]
    },
    {
      categoria: 'Transição e Planejamento',
      icon: TrendingUp,
      cor: 'orange',
      ferramentas: [
        { 
          nome: 'Transição 2026-2033', 
          rota: '/simulador-transicao-reforma',
          descricao: 'Cronograma completo gradual',
          icon: TrendingUp
        },
        { 
          nome: 'Planejador Reforma', 
          rota: '/planejador-reforma',
          descricao: 'Prepare sua empresa',
          icon: Briefcase
        },
        { 
          nome: 'Substituição Tributária 2026', 
          rota: '/simulador-st-2026',
          descricao: 'Fim do ICMS-ST',
          icon: Truck
        },
        { 
          nome: 'NF-e com IBS/CBS', 
          rota: '/simulador-nfe-ibscbs',
          descricao: 'Como fica a nota fiscal',
          icon: Package
        },
      ]
    },
    {
      categoria: 'Simplificado',
      icon: Sparkles,
      cor: 'pink',
      ferramentas: [
        { 
          nome: 'IVA Simplificado', 
          rota: '/simulador-iva-simplificado',
          descricao: 'Versão simplificada do cálculo',
          icon: Calculator
        },
        { 
          nome: 'Partilha IBS', 
          rota: '/calculadora-partilha-ibs',
          descricao: 'Divisão entre estados e municípios',
          icon: HomeIcon
        },
      ]
    },
  ];

  const handleFerramentaClick = (rota) => {
    navigate(rota);
    onClose();
  };

  const coresPorCategoria = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      badge: 'bg-blue-100 text-blue-700',
      hover: 'hover:bg-blue-100'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-900',
      badge: 'bg-purple-100 text-purple-700',
      hover: 'hover:bg-purple-100'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      badge: 'bg-green-100 text-green-700',
      hover: 'hover:bg-green-100'
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-900',
      badge: 'bg-teal-100 text-teal-700',
      hover: 'hover:bg-teal-100'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-900',
      badge: 'bg-orange-100 text-orange-700',
      hover: 'hover:bg-orange-100'
    },
    pink: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-900',
      badge: 'bg-pink-100 text-pink-700',
      hover: 'hover:bg-pink-100'
    },
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Lateral */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[800px] bg-white shadow-2xl z-50 overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Reforma Tributária</h2>
                <p className="text-blue-100 text-sm">IBS/CBS • 2026-2033</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white/90 text-sm">
            {ferramentasReforma.reduce((acc, cat) => acc + cat.ferramentas.length, 0)} ferramentas 
            especializadas para a nova tributação IVA (Imposto sobre Valor Agregado)
          </p>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          
          {ferramentasReforma.map((categoria, idx) => {
            const IconeCategoria = categoria.icon;
            const cores = coresPorCategoria[categoria.cor];
            const isActive = activeCategory === idx;

            return (
              <div key={idx} className={`rounded-xl border-2 ${cores.border} ${cores.bg} overflow-hidden`}>
                
                {/* Header Categoria */}
                <button
                  onClick={() => setActiveCategory(isActive ? null : idx)}
                  className={`w-full p-4 flex items-center justify-between ${cores.hover} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${cores.badge} rounded-lg`}>
                      <IconeCategoria className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className={`font-bold text-lg ${cores.text}`}>{categoria.categoria}</h3>
                      <p className="text-sm text-gray-600">{categoria.ferramentas.length} ferramentas</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                </button>

                {/* Lista de Ferramentas */}
                {isActive && (
                  <div className="border-t-2 border-gray-200">
                    {categoria.ferramentas.map((ferramenta, fIdx) => {
                      const IconeFerramenta = ferramenta.icon;
                      
                      return (
                        <button
                          key={fIdx}
                          onClick={() => handleFerramentaClick(ferramenta.rota)}
                          className="w-full p-4 flex items-start gap-3 hover:bg-white/80 transition-colors border-b border-gray-100 last:border-b-0 text-left group"
                        >
                          <div className="p-2 bg-gray-100 group-hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0">
                            <IconeFerramenta className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {ferramenta.nome}
                            </div>
                            <div className="text-sm text-gray-600">
                              {ferramenta.descricao}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            );
          })}

          {/* Info Box */}
          <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                <Sparkles className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-bold text-yellow-900 mb-2">Reforma Tributária 2026</h4>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  A <strong>Emenda Constitucional 132/2023</strong> cria o IBS (Imposto sobre Bens e Serviços) e a CBS 
                  (Contribuição sobre Bens e Serviços), unificando <strong>5 tributos</strong> (PIS, Cofins, IPI, ICMS, ISS). 
                  Transição gradual de <strong>2026 a 2033</strong>. Alíquota estimada em <strong>26,5%</strong> com diversas 
                  reduções e benefícios setoriais.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
};

export default MenuReformaTributaria;

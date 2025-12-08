import { useState } from 'react';
import { Calculator, AlertTriangle, TrendingUp, Wine, Cigarette, Car, Droplet } from 'lucide-react';

export default function SimuladorImpostoSeletivo() {
  const [categoria, setCategoria] = useState('bebidas-alcoolicas');
  const [valorBase, setValorBase] = useState('50');
  const [subcategoria, setSubcategoria] = useState('cerveja');
  const [resultado, setResultado] = useState(null);

  const categorias = [
    {
      value: 'bebidas-alcoolicas',
      label: 'Bebidas Alcoólicas',
      icon: '🍺',
      color: 'amber',
      subcategorias: [
        { value: 'cerveja', label: 'Cerveja', aliquota: 10 },
        { value: 'vinho', label: 'Vinho', aliquota: 15 },
        { value: 'destilados', label: 'Destilados (whisky, vodka)', aliquota: 25 },
        { value: 'cachaca', label: 'Cachaça artesanal', aliquota: 8 }
      ]
    },
    {
      value: 'cigarros',
      label: 'Cigarros e Derivados',
      icon: '🚬',
      color: 'red',
      subcategorias: [
        { value: 'cigarros-convencionais', label: 'Cigarros convencionais', aliquota: 40 },
        { value: 'charutos', label: 'Charutos', aliquota: 35 },
        { value: 'cigarrilhas', label: 'Cigarrilhas', aliquota: 30 },
        { value: 'fumo', label: 'Fumo para cachimbo', aliquota: 25 }
      ]
    },
    {
      value: 'veiculos',
      label: 'Veículos Poluentes',
      icon: '🚗',
      color: 'gray',
      subcategorias: [
        { value: 'caminhonete', label: 'Caminhonete diesel', aliquota: 15 },
        { value: 'suv-gasolina', label: 'SUV grande (gasolina)', aliquota: 12 },
        { value: 'sedan-luxo', label: 'Sedan de luxo', aliquota: 10 },
        { value: 'hibrido', label: 'Híbrido (redução)', aliquota: 3 }
      ]
    },
    {
      value: 'agrotoxicos',
      label: 'Agrotóxicos',
      icon: '☠️',
      color: 'green',
      subcategorias: [
        { value: 'herbicida', label: 'Herbicida', aliquota: 20 },
        { value: 'inseticida', label: 'Inseticida', aliquota: 18 },
        { value: 'fungicida', label: 'Fungicida', aliquota: 16 },
        { value: 'adubo-quimico', label: 'Fertilizante químico', aliquota: 12 }
      ]
    },
    {
      value: 'bebidas-acucaradas',
      label: 'Bebidas Açucaradas',
      icon: '🥤',
      color: 'orange',
      subcategorias: [
        { value: 'refrigerante', label: 'Refrigerante (>25g açúcar/L)', aliquota: 15 },
        { value: 'energetico', label: 'Energético', aliquota: 20 },
        { value: 'suco-acucarado', label: 'Suco com açúcar adicionado', aliquota: 12 },
        { value: 'agua-saborizada', label: 'Água saborizada açucarada', aliquota: 10 }
      ]
    },
    {
      value: 'apostas',
      label: 'Apostas e Jogos',
      icon: '🎰',
      color: 'purple',
      subcategorias: [
        { value: 'cassino-online', label: 'Cassino online', aliquota: 30 },
        { value: 'apostas-esportivas', label: 'Apostas esportivas', aliquota: 25 },
        { value: 'bingo', label: 'Bingo', aliquota: 20 },
        { value: 'loteria', label: 'Loteria privada', aliquota: 18 }
      ]
    },
    {
      value: 'mineracao',
      label: 'Minérios e Extrativos',
      icon: '⛏️',
      color: 'stone',
      subcategorias: [
        { value: 'ferro', label: 'Minério de ferro', aliquota: 8 },
        { value: 'petroleo', label: 'Petróleo bruto', aliquota: 10 },
        { value: 'carvao', label: 'Carvão mineral', aliquota: 12 },
        { value: 'ouro', label: 'Extração de ouro', aliquota: 5 }
      ]
    }
  ];

  const calcular = () => {
    const valor = parseFloat(valorBase);
    
    if (!valor || valor <= 0) {
      alert('Insira um valor válido');
      return;
    }

    const categoriaInfo = categorias.find(c => c.value === categoria);
    const subcategoriaInfo = categoriaInfo.subcategorias.find(s => s.value === subcategoria);
    
    const aliquota = subcategoriaInfo.aliquota;
    
    // Imposto Seletivo é calculado por fora (ad valorem)
    const valorSeletivo = valor * (aliquota / 100);
    
    // IBS + CBS (26,5%) incide sobre valor + seletivo
    const baseIBSCBS = valor + valorSeletivo;
    const ibsCbs = baseIBSCBS * 0.265;
    
    // Total de tributos
    const totalTributos = valorSeletivo + ibsCbs;
    
    // Preço final ao consumidor
    const precoFinal = valor + totalTributos;
    
    // Sem imposto seletivo (apenas IBS/CBS)
    const ibsCbsSemSeletivo = valor * 0.265;
    const precoFinalSemSeletivo = valor + ibsCbsSemSeletivo;
    
    // Diferença
    const diferencaPreco = precoFinal - precoFinalSemSeletivo;
    const percentualAumento = ((precoFinal - precoFinalSemSeletivo) / precoFinalSemSeletivo) * 100;

    setResultado({
      valor,
      aliquota,
      categoriaInfo,
      subcategoriaInfo,
      seletivo: {
        valor: valorSeletivo,
        aliquota: aliquota
      },
      ibsCbs: {
        base: baseIBSCBS,
        valor: ibsCbs
      },
      totalTributos,
      precoFinal,
      semSeletivo: {
        ibsCbs: ibsCbsSemSeletivo,
        precoFinal: precoFinalSemSeletivo
      },
      comparacao: {
        diferenca: diferencaPreco,
        percentual: percentualAumento
      }
    });
  };

  const getCategoryColor = (color) => {
    const colors = {
      amber: 'from-amber-50 to-yellow-50 border-amber-300',
      red: 'from-red-50 to-pink-50 border-red-300',
      gray: 'from-gray-50 to-slate-50 border-gray-300',
      green: 'from-green-50 to-emerald-50 border-green-300',
      orange: 'from-orange-50 to-amber-50 border-orange-300',
      purple: 'from-purple-50 to-violet-50 border-purple-300',
      stone: 'from-stone-50 to-gray-50 border-stone-300'
    };
    return colors[color] || colors.amber;
  };

  const getCategoryTextColor = (color) => {
    const colors = {
      amber: 'text-amber-700',
      red: 'text-red-700',
      gray: 'text-gray-700',
      green: 'text-green-700',
      orange: 'text-orange-700',
      purple: 'text-purple-700',
      stone: 'text-stone-700'
    };
    return colors[color] || colors.amber;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Simulador do Imposto Seletivo
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calcule o <strong>Imposto Seletivo</strong> (IS) sobre produtos com <strong>externalidade negativa</strong>. 
            Veja o impacto no preço final de cigarros, bebidas, veículos poluentes e mais.
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          
          {/* Categoria */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🏷️ Categoria do Produto
            </label>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categorias.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setCategoria(cat.value);
                    setSubcategoria(cat.subcategorias[0].value);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    categoria === cat.value
                      ? `bg-gradient-to-br ${getCategoryColor(cat.color)} shadow-md`
                      : 'border-gray-200 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-3xl mb-2 block">{cat.icon}</span>
                    <span className={`text-sm font-medium ${
                      categoria === cat.value ? getCategoryTextColor(cat.color) : 'text-gray-700'
                    }`}>
                      {cat.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Subcategoria */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📦 Tipo de Produto
            </label>
            <select
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {categorias.find(c => c.value === categoria)?.subcategorias.map(sub => (
                <option key={sub.value} value={sub.value}>
                  {sub.label} (Seletivo: {sub.aliquota}%)
                </option>
              ))}
            </select>
          </div>

          {/* Valor Base */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💰 Valor do Produto (sem tributos) - R$
            </label>
            <input
              type="number"
              value={valorBase}
              onChange={(e) => setValorBase(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="50.00"
              min="0"
              step="0.01"
            />
            <p className="text-sm text-gray-500 mt-1">
              Preço de fábrica ou base de cálculo
            </p>
          </div>

          {/* Botão Calcular */}
          <button
            onClick={calcular}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-4 px-8 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calcular Imposto Seletivo
          </button>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="space-y-6">
            
            {/* Card Resumo */}
            <div className={`rounded-2xl shadow-xl p-8 bg-gradient-to-br ${getCategoryColor(resultado.categoriaInfo.color)} border-2`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {resultado.categoriaInfo.icon} {resultado.subcategoriaInfo.label}
                  </h3>
                  <p className="text-gray-600">
                    {resultado.categoriaInfo.label} • Alíquota Seletivo: {resultado.aliquota}%
                  </p>
                </div>
                <AlertTriangle className="w-16 h-16 text-red-600" />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <p className="text-sm text-gray-600 mb-1">Valor Base</p>
                  <p className="text-3xl font-bold text-gray-900">
                    R$ {resultado.valor.toFixed(2)}
                  </p>
                  <p className="text-sm text-blue-600 font-medium mt-2">
                    Sem tributos
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <p className="text-sm text-gray-600 mb-1">Imposto Seletivo</p>
                  <p className="text-3xl font-bold text-red-700">
                    R$ {resultado.seletivo.valor.toFixed(2)}
                  </p>
                  <p className="text-sm text-red-600 font-medium mt-2">
                    {resultado.aliquota}% do valor
                  </p>
                </div>

                <div className="bg-red-100 rounded-lg p-6 shadow-md">
                  <p className="text-sm text-gray-700 mb-1">Preço Final</p>
                  <p className="text-3xl font-bold text-red-800">
                    R$ {resultado.precoFinal.toFixed(2)}
                  </p>
                  <p className="text-sm text-red-700 font-medium mt-2">
                    +{resultado.comparacao.percentual.toFixed(1)}% vs sem seletivo
                  </p>
                </div>
              </div>
            </div>

            {/* Detalhamento dos Tributos */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calculator className="w-7 h-7 text-purple-600" />
                Composição dos Tributos
              </h3>

              <div className="space-y-4">
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-3 text-lg">
                    1️⃣ Valor Base do Produto
                  </h4>
                  <p className="text-3xl font-bold text-blue-700 mb-2">
                    R$ {resultado.valor.toFixed(2)}
                  </p>
                  <p className="text-sm text-blue-600">
                    Preço de fábrica ou produtor (sem tributos)
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                  <h4 className="font-bold text-red-900 mb-3 text-lg">
                    2️⃣ Imposto Seletivo (IS)
                  </h4>
                  <p className="text-3xl font-bold text-red-700 mb-2">
                    R$ {resultado.seletivo.valor.toFixed(2)}
                  </p>
                  <p className="text-sm text-red-600">
                    {resultado.aliquota}% sobre o valor base (tributo por fora)
                  </p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
                  <h4 className="font-bold text-purple-900 mb-3 text-lg">
                    3️⃣ IBS + CBS (26,5%)
                  </h4>
                  <p className="text-3xl font-bold text-purple-700 mb-2">
                    R$ {resultado.ibsCbs.valor.toFixed(2)}
                  </p>
                  <p className="text-sm text-purple-600">
                    Base: R$ {resultado.ibsCbs.base.toFixed(2)} (valor + seletivo)
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    IBS/CBS incide sobre o valor já acrescido do Imposto Seletivo
                  </p>
                </div>

                <div className="bg-gradient-to-r from-orange-100 to-red-100 border-l-4 border-orange-500 p-6 rounded-lg">
                  <h4 className="font-bold text-orange-900 mb-3 text-lg">
                    💸 Total de Tributos
                  </h4>
                  <p className="text-3xl font-bold text-orange-800 mb-2">
                    R$ {resultado.totalTributos.toFixed(2)}
                  </p>
                  <p className="text-sm text-orange-700">
                    Seletivo (R$ {resultado.seletivo.valor.toFixed(2)}) + IBS/CBS (R$ {resultado.ibsCbs.valor.toFixed(2)})
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Carga tributária total: {((resultado.totalTributos / resultado.precoFinal) * 100).toFixed(1)}% do preço final
                  </p>
                </div>

              </div>
            </div>

            {/* Comparação Com/Sem Seletivo */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-green-600" />
                Comparação: Com vs Sem Imposto Seletivo
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-4 px-4 text-gray-700 font-semibold">Item</th>
                      <th className="text-right py-4 px-4 text-gray-700 font-semibold">Sem Seletivo</th>
                      <th className="text-right py-4 px-4 text-gray-700 font-semibold">Com Seletivo</th>
                      <th className="text-right py-4 px-4 text-gray-700 font-semibold">Diferença</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">Valor do Produto</td>
                      <td className="py-4 px-4 text-right text-gray-900">
                        R$ {resultado.valor.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-900">
                        R$ {resultado.valor.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-500">—</td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-700">Imposto Seletivo</td>
                      <td className="py-4 px-4 text-right text-gray-400">
                        R$ 0,00
                      </td>
                      <td className="py-4 px-4 text-right text-red-600 font-semibold">
                        R$ {resultado.seletivo.valor.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-red-600 font-semibold">
                        + R$ {resultado.seletivo.valor.toFixed(2)}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-700">IBS + CBS (26,5%)</td>
                      <td className="py-4 px-4 text-right text-purple-600 font-semibold">
                        R$ {resultado.semSeletivo.ibsCbs.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-purple-600 font-semibold">
                        R$ {resultado.ibsCbs.valor.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-orange-600">
                        + R$ {(resultado.ibsCbs.valor - resultado.semSeletivo.ibsCbs).toFixed(2)}
                      </td>
                    </tr>

                    <tr className="bg-orange-50 font-bold text-lg">
                      <td className="py-4 px-4 text-gray-900">Preço Final ao Consumidor</td>
                      <td className="py-4 px-4 text-right text-green-700">
                        R$ {resultado.semSeletivo.precoFinal.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-red-700">
                        R$ {resultado.precoFinal.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-red-700">
                        + R$ {resultado.comparacao.diferenca.toFixed(2)}
                        <br />
                        <span className="text-sm">({resultado.comparacao.percentual.toFixed(1)}%)</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Objetivo do Imposto Seletivo */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                🎯 Objetivo do Imposto Seletivo
              </h3>

              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  O <strong>Imposto Seletivo (IS)</strong> é um tributo <strong>extrafiscal</strong>, 
                  ou seja, seu objetivo principal <strong>não é arrecadar</strong>, mas sim 
                  <strong> desestimular o consumo</strong> de produtos e serviços que causam 
                  <strong> externalidades negativas</strong> (danos à saúde, meio ambiente ou sociedade).
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-lg border border-amber-200">
                    <h4 className="font-bold text-amber-900 mb-2">✅ Produtos Tributados</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• <strong>Cigarros:</strong> Danos à saúde pública</li>
                      <li>• <strong>Bebidas alcoólicas:</strong> Acidentes e doenças</li>
                      <li>• <strong>Veículos poluentes:</strong> Emissões de CO₂</li>
                      <li>• <strong>Agrotóxicos:</strong> Poluição ambiental</li>
                      <li>• <strong>Bebidas açucaradas:</strong> Obesidade e diabetes</li>
                      <li>• <strong>Jogos e apostas:</strong> Dependência</li>
                    </ul>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-900 mb-2">💚 Destino da Receita</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• <strong>Saúde pública:</strong> Tratamento de doenças relacionadas</li>
                      <li>• <strong>Educação:</strong> Campanhas de conscientização</li>
                      <li>• <strong>Meio ambiente:</strong> Preservação e recuperação</li>
                      <li>• <strong>Segurança:</strong> Combate à violência (álcool)</li>
                      <li>• <strong>Políticas sociais:</strong> Apoio a dependentes</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg mt-4">
                  <h4 className="font-bold text-red-900 mb-2">
                    ⚠️ Efeito Esperado
                  </h4>
                  <p className="text-sm text-red-800">
                    O <strong>aumento de preço</strong> causado pelo Imposto Seletivo deve 
                    <strong> reduzir o consumo</strong> desses produtos, especialmente entre 
                    jovens e população de baixa renda (mais sensíveis ao preço). Estudos mostram 
                    que um aumento de <strong>10%</strong> no preço de cigarros reduz o consumo em 
                    <strong>4% a 8%</strong>.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Info Card */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mt-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-amber-900 mb-2">
                ℹ️ Sobre o Imposto Seletivo
              </h4>
              <p className="text-amber-800 leading-relaxed text-sm">
                O Imposto Seletivo será instituído a partir de <strong>2027</strong>, após a 
                transição da Reforma Tributária. As alíquotas apresentadas são <strong>estimativas</strong> 
                baseadas em propostas legislativas e podem ser ajustadas pela Lei Complementar. 
                O IS incide <strong>"por fora"</strong> (sobre o valor do produto), e o IBS/CBS 
                incide sobre a soma do valor + seletivo.
              </p>
            </div>
          </div>
        </div>

        {/* Artigo SEO */}
        <article className="bg-white rounded-2xl shadow-xl p-12 mt-8 prose prose-lg max-w-none">
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-4 border-red-500 pb-4">
            Imposto Seletivo: O "Imposto do Pecado" na Reforma Tributária Brasileira
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            A <strong>Reforma Tributária de 2026</strong> traz uma novidade controversa: o 
            <strong> Imposto Seletivo (IS)</strong>, também chamado de <strong>"Imposto do Pecado"</strong> 
            ou <strong>"Sin Tax"</strong>. Diferente do IBS e CBS (que visam arrecadar), o Imposto 
            Seletivo tem função <strong>extrafiscal</strong>: desestimular o consumo de produtos e 
            serviços que causam <strong>danos à saúde, ao meio ambiente ou à sociedade</strong>. 
            Neste artigo, entenda como funciona, quais produtos são afetados e o impacto no seu bolso.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            🚬 O Que É o Imposto Seletivo?
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            O Imposto Seletivo é um <strong>tributo federal</strong> previsto na Emenda Constitucional 
            132/2023. Ele incide sobre a <strong>produção, comercialização ou importação</strong> de 
            produtos com <strong>externalidades negativas</strong> — ou seja, produtos cujo consumo 
            gera custos para a sociedade (saúde pública, poluição, violência).
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg my-6">
            <h4 className="font-bold text-red-900 mb-3">
              ⚠️ Produtos Sujeitos ao Imposto Seletivo
            </h4>
            <ul className="space-y-2 text-red-800 text-sm">
              <li>✓ <strong>Cigarros e derivados do tabaco:</strong> Câncer, doenças respiratórias</li>
              <li>✓ <strong>Bebidas alcoólicas:</strong> Acidentes de trânsito, violência doméstica, cirrose</li>
              <li>✓ <strong>Veículos com alta emissão de CO₂:</strong> Poluição atmosférica, mudanças climáticas</li>
              <li>✓ <strong>Agrotóxicos:</strong> Contaminação de solo, água e alimentos</li>
              <li>✓ <strong>Bebidas açucaradas:</strong> Obesidade, diabetes tipo 2, doenças cardiovasculares</li>
              <li>✓ <strong>Jogos de azar e apostas:</strong> Dependência patológica, endividamento</li>
              <li>✓ <strong>Extração mineral (ferro, petróleo):</strong> Impactos ambientais</li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            O IS <strong>não substitui</strong> outros tributos. Ele se <strong>soma</strong> ao IBS 
            e CBS, aumentando o preço final ao consumidor. A ideia é que o <strong>encarecimento</strong> 
            reduza o consumo, especialmente entre jovens e população de baixa renda (mais sensíveis a preços).
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            📊 Alíquotas Estimadas por Categoria
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            A Lei Complementar que regulamentará o Imposto Seletivo ainda está em tramitação no Congresso 
            Nacional. Porém, baseando-se em estudos técnicos e experiências internacionais, as seguintes 
            alíquotas são esperadas:
          </p>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left text-gray-900">Categoria</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-gray-900">Produto</th>
                  <th className="border border-gray-300 px-4 py-3 text-right text-gray-900">Alíquota Estimada</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Cigarros</td>
                  <td className="border border-gray-300 px-4 py-2">Cigarros convencionais</td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-semibold text-red-700">40%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Bebidas Alcoólicas</td>
                  <td className="border border-gray-300 px-4 py-2">Destilados (whisky, vodka)</td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-semibold text-orange-700">25%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Bebidas Alcoólicas</td>
                  <td className="border border-gray-300 px-4 py-2">Cerveja</td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-semibold text-yellow-700">10%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Veículos</td>
                  <td className="border border-gray-300 px-4 py-2">Caminhonete diesel</td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-700">15%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Bebidas Açucaradas</td>
                  <td className="border border-gray-300 px-4 py-2">Refrigerante</td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-semibold text-orange-700">15%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Apostas</td>
                  <td className="border border-gray-300 px-4 py-2">Cassino online</td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-semibold text-purple-700">30%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Agrotóxicos</td>
                  <td className="border border-gray-300 px-4 py-2">Herbicida</td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-semibold text-green-700">20%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            💰 Como o Imposto Seletivo Aumenta o Preço Final?
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            O Imposto Seletivo é calculado <strong>"por fora"</strong>, ou seja, ele se soma ao valor 
            do produto. Depois, o <strong>IBS + CBS (26,5%)</strong> incide sobre o valor <strong>já 
            acrescido do seletivo</strong>. Isso cria um <strong>efeito cascata</strong> que aumenta 
            ainda mais o preço final.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg my-6">
            <h4 className="font-bold text-blue-900 mb-3">
              📐 Exemplo Prático: Maço de Cigarros
            </h4>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• <strong>Valor base:</strong> R$ 10,00 (preço de fábrica)</li>
              <li>• <strong>Imposto Seletivo (40%):</strong> R$ 4,00</li>
              <li>• <strong>Base para IBS/CBS:</strong> R$ 14,00 (10 + 4)</li>
              <li>• <strong>IBS/CBS (26,5%):</strong> R$ 3,71</li>
              <li>• <strong>Preço final ao consumidor:</strong> R$ 17,71</li>
              <li className="pt-2 border-t border-blue-300 font-bold">
                → Aumento de <strong>77,1%</strong> sobre o valor base!
              </li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            Sem o Imposto Seletivo, o mesmo maço custaria <strong>R$ 12,65</strong> (apenas com IBS/CBS). 
            Ou seja, o seletivo sozinho aumenta o preço em <strong>R$ 5,06</strong> (40% de acréscimo).
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            🌍 Experiências Internacionais: Funciona?
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            O <strong>"Sin Tax"</strong> já existe em dezenas de países e tem resultados comprovados:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-green-50 border border-green-200 p-5 rounded-lg">
              <h4 className="font-bold text-green-900 mb-3">✅ Reino Unido</h4>
              <p className="text-sm text-green-800 mb-2">
                Em 2018, implementou o <strong>Sugar Tax</strong> (imposto sobre bebidas açucaradas). 
                Resultado: <strong>redução de 30%</strong> no açúcar adicionado pelos fabricantes.
              </p>
              <p className="text-xs text-gray-600">
                Fonte: Public Health England, 2020
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
              <h4 className="font-bold text-blue-900 mb-3">✅ México</h4>
              <p className="text-sm text-blue-800 mb-2">
                Desde 2014, cobra <strong>10%</strong> sobre refrigerantes. Resultado: 
                <strong>redução de 6%</strong> nas vendas no primeiro ano, chegando a 
                <strong>12%</strong> entre populações de baixa renda.
              </p>
              <p className="text-xs text-gray-600">
                Fonte: Instituto Nacional de Saúde Pública do México, 2016
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-5 rounded-lg">
              <h4 className="font-bold text-purple-900 mb-3">✅ França</h4>
              <p className="text-sm text-purple-800 mb-2">
                Imposto sobre cigarros elevou o preço médio para <strong>€10</strong> por maço. 
                Resultado: <strong>queda de 25%</strong> no consumo entre 2000 e 2020.
              </p>
              <p className="text-xs text-gray-600">
                Fonte: Ministério da Saúde da França, 2021
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 p-5 rounded-lg">
              <h4 className="font-bold text-orange-900 mb-3">✅ Tailândia</h4>
              <p className="text-sm text-orange-800 mb-2">
                Tributa bebidas alcoólicas em até <strong>400%</strong> do valor base. 
                Resultado: <strong>redução de 50%</strong> no consumo per capita de álcool.
              </p>
              <p className="text-xs text-gray-600">
                Fonte: OMS, Global Status Report on Alcohol, 2018
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            💸 Para Onde Vai a Receita do Imposto Seletivo?
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            A Lei Complementar deve estabelecer que a receita do Imposto Seletivo seja 
            <strong> vinculada</strong> a programas específicos:
          </p>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg my-6">
            <h4 className="font-bold text-green-900 mb-3">
              🏥 Destinação da Receita
            </h4>
            <ul className="space-y-2 text-green-800 text-sm">
              <li>• <strong>Saúde pública:</strong> Tratamento de câncer, cirrose, obesidade, diabetes</li>
              <li>• <strong>Educação e campanhas:</strong> Conscientização sobre tabagismo, alcoolismo, alimentação saudável</li>
              <li>• <strong>Preservação ambiental:</strong> Recuperação de áreas degradadas pela mineração ou agrotóxicos</li>
              <li>• <strong>Segurança pública:</strong> Prevenção de acidentes de trânsito relacionados ao álcool</li>
              <li>• <strong>Assistência social:</strong> Apoio a dependentes químicos e familiares</li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            Essa vinculação garante que o tributo seja <strong>justo</strong>: quem consome produtos 
            danosos ajuda a financiar o tratamento dos danos causados.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            ⚖️ Controvérsias e Críticas
          </h3>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            1. "É um imposto sobre os pobres"
          </h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Crítica:</strong> Como é um tributo sobre consumo, ele afeta proporcionalmente 
            mais famílias de baixa renda, que gastam maior parte do orçamento em consumo.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Defesa:</strong> Justamente a população de baixa renda é mais sensível a preços, 
            então ela reduzirá mais o consumo. Além disso, é essa população que mais sofre com os 
            danos (câncer por tabagismo, diabetes por refrigerantes).
          </p>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            2. "Vai gerar mercado ilegal"
          </h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Crítica:</strong> Alíquotas muito altas podem estimular contrabando e falsificação 
            (especialmente cigarros e bebidas).
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Defesa:</strong> É necessário <strong>fiscalização rigorosa</strong> e 
            <strong> rastreamento de produtos</strong> (como o selo de controle do IPI em cigarros). 
            Experiências internacionais mostram que, com enforcement, o mercado ilegal pode ser controlado.
          </p>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            3. "Não é papel do Estado escolher o que consumir"
          </h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Crítica:</strong> O imposto seria uma <strong>intromissão paternalista</strong> 
            nas escolhas individuais.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Defesa:</strong> O Estado já regula produtos perigosos (armas, drogas ilícitas, 
            medicamentos). O IS apenas <strong>internaliza o custo social</strong>: se você fuma, 
            você paga pelo tratamento futuro de câncer via imposto, ao invés de o sistema público 
            arcar sozinho.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            📋 Perguntas Frequentes (FAQ)
          </h3>

          <div className="space-y-6">
            
            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                1. Quando o Imposto Seletivo entra em vigor?
              </h4>
              <p className="text-gray-700 text-sm">
                A previsão é <strong>2027</strong>, após a fase de transição da Reforma Tributária 
                (2026 é ano-teste com IBS/CBS em alíquotas baixas).
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                2. Carros elétricos pagam Imposto Seletivo?
              </h4>
              <p className="text-gray-700 text-sm">
                <strong>Não.</strong> Apenas veículos com <strong>alta emissão de CO₂</strong> 
                (caminhonetes diesel, SUVs grandes a gasolina). Elétricos e híbridos podem ter 
                <strong>alíquota zero ou reduzida</strong>.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                3. Cerveja artesanal terá alíquota diferente?
              </h4>
              <p className="text-gray-700 text-sm">
                Há propostas para <strong>alíquota reduzida</strong> em bebidas artesanais de 
                pequenos produtores, similar à cachaça artesanal.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                4. Açúcar e doces também pagam seletivo?
              </h4>
              <p className="text-gray-700 text-sm">
                A proposta inicial tributa apenas <strong>bebidas açucaradas</strong> (refrigerantes, 
                energéticos). Alimentos sólidos (chocolate, bolos) <strong>não estão incluídos</strong> 
                para evitar inflação generalizada.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                5. Empresas podem creditar o Imposto Seletivo?
              </h4>
              <p className="text-gray-700 text-sm">
                <strong>Não.</strong> O IS é <strong>monofásico</strong> (incide uma única vez, 
                na indústria ou importação). Não há direito a crédito para revenda.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                6. Alíquotas serão ajustadas anualmente?
              </h4>
              <p className="text-gray-700 text-sm">
                Sim. A Lei Complementar permite <strong>ajustes anuais</strong> conforme estudos 
                de impacto, similar ao que ocorre com a CIDE-Combustíveis.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                7. Exportações pagam Imposto Seletivo?
              </h4>
              <p className="text-gray-700 text-sm">
                <strong>Não.</strong> Assim como IBS/CBS, exportações são <strong>desoneradas</strong> 
                para manter a competitividade internacional.
              </p>
            </div>

          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            📖 Base Legal
          </h3>

          <ul className="space-y-2 text-gray-700 ml-6 mb-6">
            <li>• <strong>Emenda Constitucional 132/2023:</strong> Art. 153, VIII — Institui o Imposto Seletivo</li>
            <li>• <strong>Lei Complementar (em tramitação):</strong> Definirá produtos, alíquotas e destinação da receita</li>
            <li>• <strong>Princípio da Extrafiscalidade:</strong> CTN, Art. 3º — Tributos com função regulatória</li>
          </ul>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 p-6 rounded-lg mt-8">
            <p className="text-gray-800 text-center leading-relaxed">
              <strong className="text-red-700">⚠️ Atenção:</strong> As alíquotas apresentadas neste 
              simulador são <strong>estimativas</strong> baseadas em estudos técnicos e experiências 
              internacionais. As alíquotas definitivas serão estabelecidas por <strong>Lei Complementar</strong>, 
              ainda em tramitação no Congresso Nacional. Acompanhe as atualizações legislativas para 
              informações oficiais.
            </p>
          </div>

        </article>

      </div>
    </div>
  );
}

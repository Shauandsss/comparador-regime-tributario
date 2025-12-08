import { useState } from 'react';
import { Calculator, ShoppingCart, TrendingDown, Package, Info, Search } from 'lucide-react';

export default function SimuladorCestaBasica() {
  const [categoria, setCategoria] = useState('carnes');
  const [produto, setProduto] = useState('');
  const [valor, setValor] = useState('100');
  const [estado, setEstado] = useState('SP');
  const [resultado, setResultado] = useState(null);

  // Produtos da Cesta Básica Nacional por categoria
  const produtosCestaBasica = {
    carnes: [
      { nome: 'Carne Bovina (Primeira)', aliquota: 0, ncm: '0201.30.00' },
      { nome: 'Carne Bovina (Segunda)', aliquota: 0, ncm: '0201.20.00' },
      { nome: 'Carne Suína', aliquota: 0, ncm: '0203.12.00' },
      { nome: 'Frango Inteiro', aliquota: 0, ncm: '0207.12.00' },
      { nome: 'Pescados', aliquota: 0, ncm: '0302.90.00' }
    ],
    cereais: [
      { nome: 'Arroz', aliquota: 0, ncm: '1006.30.00' },
      { nome: 'Feijão', aliquota: 0, ncm: '0713.33.99' },
      { nome: 'Milho (Fubá)', aliquota: 0, ncm: '1102.20.00' },
      { nome: 'Farinha de Trigo', aliquota: 0, ncm: '1101.00.10' },
      { nome: 'Macarrão', aliquota: 0, ncm: '1902.19.00' }
    ],
    laticinios: [
      { nome: 'Leite Integral', aliquota: 0, ncm: '0401.10.10' },
      { nome: 'Leite Desnatado', aliquota: 0, ncm: '0401.10.90' },
      { nome: 'Manteiga', aliquota: 0, ncm: '0405.10.00' },
      { nome: 'Margarina', aliquota: 0, ncm: '1517.10.00' },
      { nome: 'Queijo Muçarela', aliquota: 60, ncm: '0406.10.00' } // Reduzida
    ],
    panificacao: [
      { nome: 'Pão Francês', aliquota: 0, ncm: '1905.90.10' },
      { nome: 'Pão de Forma', aliquota: 0, ncm: '1905.90.90' },
      { nome: 'Biscoito Cream Cracker', aliquota: 0, ncm: '1905.31.00' },
      { nome: 'Biscoito Recheado', aliquota: 100, ncm: '1905.31.90' } // Padrão
    ],
    hortifruti: [
      { nome: 'Tomate', aliquota: 0, ncm: '0702.00.00' },
      { nome: 'Cebola', aliquota: 0, ncm: '0703.10.00' },
      { nome: 'Batata', aliquota: 0, ncm: '0701.90.00' },
      { nome: 'Banana', aliquota: 0, ncm: '0803.90.00' },
      { nome: 'Laranja', aliquota: 0, ncm: '0805.10.00' }
    ],
    oleos: [
      { nome: 'Óleo de Soja', aliquota: 0, ncm: '1507.90.11' },
      { nome: 'Óleo de Girassol', aliquota: 0, ncm: '1512.19.11' },
      { nome: 'Azeite de Oliva', aliquota: 100, ncm: '1509.10.00' } // Padrão (não essencial)
    ],
    acucar: [
      { nome: 'Açúcar Cristal', aliquota: 0, ncm: '1701.99.00' },
      { nome: 'Açúcar Refinado', aliquota: 0, ncm: '1701.99.00' },
      { nome: 'Sal de Cozinha', aliquota: 0, ncm: '2501.00.90' }
    ],
    bebidas: [
      { nome: 'Café em Pó', aliquota: 0, ncm: '0901.21.00' },
      { nome: 'Café Solúvel', aliquota: 60, ncm: '2101.11.10' }, // Reduzida
      { nome: 'Refrigerante', aliquota: 100, ncm: '2202.10.00' }, // Padrão (não essencial)
      { nome: 'Suco Natural', aliquota: 60, ncm: '2009.89.00' } // Reduzida
    ]
  };

  const estados = [
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'GO', nome: 'Goiás' }
  ];

  const categorias = [
    { value: 'carnes', label: 'Carnes e Pescados', icon: '🥩' },
    { value: 'cereais', label: 'Cereais e Grãos', icon: '🌾' },
    { value: 'laticinios', label: 'Laticínios', icon: '🥛' },
    { value: 'panificacao', label: 'Panificação', icon: '🍞' },
    { value: 'hortifruti', label: 'Hortifruti', icon: '🥕' },
    { value: 'oleos', label: 'Óleos e Gorduras', icon: '🫒' },
    { value: 'acucar', label: 'Açúcar e Sal', icon: '🧂' },
    { value: 'bebidas', label: 'Bebidas', icon: '☕' }
  ];

  const calcular = () => {
    const valorNum = parseFloat(valor);
    
    if (!produto || !valorNum || valorNum <= 0) {
      alert('Selecione um produto e insira um valor válido');
      return;
    }

    const produtoSelecionado = produtosCestaBasica[categoria].find(p => p.nome === produto);
    
    if (!produtoSelecionado) {
      alert('Produto não encontrado');
      return;
    }

    // Sistema Atual: ICMS (varia por estado) + PIS/COFINS
    // Para cesta básica, muitos estados têm isenção de ICMS ou alíquota reduzida
    const icmsAtual = 7; // Média aproximada para cesta básica (muitos têm 7% ou isenção)
    const pisCofinsAtual = 9.25; // Regime não cumulativo
    const cargaAtual = valorNum * ((icmsAtual + pisCofinsAtual) / 100);
    const percentualAtual = icmsAtual + pisCofinsAtual;

    // Sistema Novo: IBS + CBS
    // 0% = Alíquota zero (cesta básica)
    // 60% = Alíquota reduzida (15,9% ao invés de 26,5%)
    // 100% = Alíquota padrão (26,5%)
    const aliquotaBase = 26.5;
    const percentualAliquota = produtoSelecionado.aliquota;
    const aliquotaNova = aliquotaBase * (percentualAliquota / 100);
    const cargaNova = valorNum * (aliquotaNova / 100);

    // Análise
    const economia = cargaAtual - cargaNova;
    const variacaoPercentual = cargaAtual > 0 ? ((cargaNova - cargaAtual) / cargaAtual) * 100 : 0;

    // Preço final
    const precoFinalAtual = valorNum + cargaAtual;
    const precoFinalNovo = valorNum + cargaNova;

    setResultado({
      produto: produtoSelecionado,
      valor: valorNum,
      atual: {
        icms: icmsAtual,
        pisCofins: pisCofinsAtual,
        total: cargaAtual,
        percentual: percentualAtual,
        precoFinal: precoFinalAtual
      },
      novo: {
        aliquota: aliquotaNova,
        percentualBase: percentualAliquota,
        total: cargaNova,
        precoFinal: precoFinalNovo
      },
      analise: {
        economia: economia,
        variacao: variacaoPercentual,
        economiza: economia > 0
      }
    });
  };

  const getCategoriaInfo = () => {
    return categorias.find(c => c.value === categoria) || categorias[0];
  };

  const getAliquotaLabel = (percentual) => {
    if (percentual === 0) return 'Alíquota ZERO (0%)';
    if (percentual === 60) return 'Alíquota REDUZIDA (15,9%)';
    return 'Alíquota PADRÃO (26,5%)';
  };

  const getAliquotaColor = (percentual) => {
    if (percentual === 0) return 'bg-green-100 text-green-800 border-green-500';
    if (percentual === 60) return 'bg-blue-100 text-blue-800 border-blue-500';
    return 'bg-orange-100 text-orange-800 border-orange-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingCart className="w-12 h-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Simulador da Cesta Básica Nacional
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja como a <strong>Reforma Tributária</strong> afeta os preços dos alimentos essenciais. 
            Compare <strong>alíquota zero, reduzida e padrão</strong> para cada produto.
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          
          {/* Categorias */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🛒 Categoria de Produto
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categorias.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setCategoria(cat.value);
                    setProduto('');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    categoria === cat.value
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <div className="text-xs font-medium text-gray-700">{cat.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Produto */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📦 Produto da Cesta Básica
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {produtosCestaBasica[categoria].map(prod => (
                <button
                  key={prod.nome}
                  onClick={() => setProduto(prod.nome)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    produto === prod.nome
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{prod.nome}</p>
                      <p className="text-xs text-gray-500 mt-1">NCM: {prod.ncm}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getAliquotaColor(prod.aliquota)}`}>
                      {prod.aliquota === 0 ? '0%' : prod.aliquota === 60 ? '15,9%' : '26,5%'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            
            {/* Valor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💰 Valor do Produto (R$)
              </label>
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="100.00"
                min="0"
                step="0.01"
              />
              <p className="text-sm text-gray-500 mt-1">
                Preço antes dos impostos
              </p>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {estados.map(e => (
                  <option key={e.sigla} value={e.sigla}>{e.nome}</option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Local da venda (referência)
              </p>
            </div>

          </div>

          {/* Botão Calcular */}
          <button
            onClick={calcular}
            disabled={!produto}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Calculator className="w-5 h-5" />
            Calcular Impacto da Reforma
          </button>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="space-y-6">
            
            {/* Card Principal */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {resultado.produto.nome}
                  </h3>
                  <p className="text-gray-600">
                    {getCategoriaInfo().icon} {getCategoriaInfo().label} • NCM {resultado.produto.ncm}
                  </p>
                </div>
                <div className={`px-6 py-3 rounded-lg border-2 ${getAliquotaColor(resultado.produto.aliquota)}`}>
                  <p className="text-xs font-medium">Pós-Reforma</p>
                  <p className="text-2xl font-bold">
                    {getAliquotaLabel(resultado.produto.aliquota)}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <p className="text-sm text-gray-600 mb-1">Preço Sem Impostos</p>
                  <p className="text-3xl font-bold text-gray-900">
                    R$ {resultado.valor.toFixed(2)}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <p className="text-sm text-gray-600 mb-1">Preço Final (Hoje)</p>
                  <p className="text-3xl font-bold text-blue-700">
                    R$ {resultado.atual.precoFinal.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    +{resultado.atual.percentual.toFixed(2)}% de impostos
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <p className="text-sm text-gray-600 mb-1">Preço Final (Pós-Reforma)</p>
                  <p className="text-3xl font-bold text-green-700">
                    R$ {resultado.novo.precoFinal.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    +{resultado.novo.aliquota.toFixed(2)}% de impostos
                  </p>
                </div>
              </div>

              {/* Economia */}
              {resultado.analise.economiza ? (
                <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 mt-6">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-8 h-8 text-green-700" />
                    <div>
                      <p className="text-lg font-bold text-green-900">
                        Economia de R$ {resultado.analise.economia.toFixed(2)}
                      </p>
                      <p className="text-sm text-green-800">
                        {Math.abs(resultado.analise.variacao).toFixed(1)}% mais barato com a reforma
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 mt-6">
                  <div className="flex items-center gap-3">
                    <Package className="w-8 h-8 text-red-700" />
                    <div>
                      <p className="text-lg font-bold text-red-900">
                        Aumento de R$ {Math.abs(resultado.analise.economia).toFixed(2)}
                      </p>
                      <p className="text-sm text-red-800">
                        {Math.abs(resultado.analise.variacao).toFixed(1)}% mais caro com a reforma
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tabela Comparativa */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calculator className="w-7 h-7 text-green-600" />
                Comparação Detalhada de Tributos
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-4 px-4 text-gray-700 font-semibold">Item</th>
                      <th className="text-right py-4 px-4 text-gray-700 font-semibold">Sistema Atual</th>
                      <th className="text-right py-4 px-4 text-gray-700 font-semibold">Pós-Reforma 2026</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">Preço do Produto</td>
                      <td className="py-4 px-4 text-right text-gray-900">
                        R$ {resultado.valor.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-900">
                        R$ {resultado.valor.toFixed(2)}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-700">
                        ICMS (média cesta básica)
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-blue-600 font-semibold">
                          R$ {(resultado.valor * (resultado.atual.icms / 100)).toFixed(2)}
                        </span>
                        <br />
                        <span className="text-xs text-gray-500">
                          {resultado.atual.icms}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-400">
                        <span className="line-through">Extinto</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-700">
                        PIS/COFINS
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-blue-600 font-semibold">
                          R$ {(resultado.valor * (resultado.atual.pisCofins / 100)).toFixed(2)}
                        </span>
                        <br />
                        <span className="text-xs text-gray-500">
                          {resultado.atual.pisCofins}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-400">
                        <span className="line-through">Extinto</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-700">
                        IBS + CBS
                      </td>
                      <td className="py-4 px-4 text-right text-gray-400">
                        —
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-green-600 font-semibold">
                          R$ {resultado.novo.total.toFixed(2)}
                        </span>
                        <br />
                        <span className="text-xs text-gray-500">
                          {resultado.novo.aliquota.toFixed(2)}% ({resultado.novo.percentualBase === 0 ? 'Zero' : resultado.novo.percentualBase === 60 ? 'Reduzida' : 'Padrão'})
                        </span>
                      </td>
                    </tr>

                    <tr className="bg-gray-100 font-bold">
                      <td className="py-4 px-4 text-gray-900">Total de Tributos</td>
                      <td className="py-4 px-4 text-right text-blue-700">
                        R$ {resultado.atual.total.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-green-700">
                        R$ {resultado.novo.total.toFixed(2)}
                      </td>
                    </tr>

                    <tr className="bg-green-50 font-bold text-lg">
                      <td className="py-4 px-4 text-gray-900">Preço Final ao Consumidor</td>
                      <td className="py-4 px-4 text-right text-blue-700">
                        R$ {resultado.atual.precoFinal.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-green-700">
                        R$ {resultado.novo.precoFinal.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Análise */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Search className="w-7 h-7 text-blue-600" />
                Entenda o Resultado
              </h3>

              <div className="space-y-4">
                {resultado.produto.aliquota === 0 && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                    <h4 className="font-bold text-green-900 mb-2">
                      ✅ Alíquota ZERO - Cesta Básica Nacional
                    </h4>
                    <p className="text-green-800 mb-3">
                      Este produto faz parte da <strong>Cesta Básica Nacional</strong> e terá 
                      <strong> alíquota ZERO de IBS/CBS</strong>. Isso significa que a reforma 
                      eliminará completamente a tributação sobre este item essencial.
                    </p>
                    <p className="text-green-700 text-sm">
                      <strong>Benefício:</strong> Redução significativa no preço final, tornando 
                      alimentos essenciais mais acessíveis à população de baixa renda.
                    </p>
                  </div>
                )}

                {resultado.produto.aliquota === 60 && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-2">
                      ℹ️ Alíquota REDUZIDA (60% = 15,9%)
                    </h4>
                    <p className="text-blue-800 mb-3">
                      Este produto terá <strong>alíquota reduzida de 60%</strong>, pagando 
                      15,9% ao invés de 26,5%. Produtos com alíquota reduzida são considerados 
                      essenciais, mas não fazem parte da cesta básica nacional.
                    </p>
                    <p className="text-blue-700 text-sm">
                      <strong>Nota:</strong> Alguns queijos, cafés solúveis e sucos processados 
                      se enquadram nesta categoria.
                    </p>
                  </div>
                )}

                {resultado.produto.aliquota === 100 && (
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
                    <h4 className="font-bold text-orange-900 mb-2">
                      ⚠️ Alíquota PADRÃO (26,5%)
                    </h4>
                    <p className="text-orange-800 mb-3">
                      Este produto pagará a <strong>alíquota padrão de 26,5%</strong> (IBS 16,165% + 
                      CBS 10,335%). Produtos não considerados essenciais seguem a tributação normal.
                    </p>
                    <p className="text-orange-700 text-sm">
                      <strong>Exemplos:</strong> Biscoitos recheados, refrigerantes, azeite de oliva, 
                      produtos importados ou gourmet.
                    </p>
                  </div>
                )}

                {/* Recomendações */}
                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
                  <h4 className="font-bold text-purple-900 mb-3">
                    💡 O que isso significa para você?
                  </h4>
                  <ul className="space-y-2 text-purple-800 text-sm">
                    {resultado.analise.economiza ? (
                      <>
                        <li>✓ Este produto ficará <strong>mais barato</strong> após a reforma</li>
                        <li>✓ Economia estimada: R$ {resultado.analise.economia.toFixed(2)} por unidade</li>
                        <li>✓ Para famílias de baixa renda, o impacto é ainda maior (cashback IBS adicional)</li>
                      </>
                    ) : (
                      <>
                        <li>⚠️ Este produto poderá ficar <strong>mais caro</strong> após a reforma</li>
                        <li>⚠️ Considere substituir por produtos da cesta básica nacional (alíquota zero)</li>
                        <li>⚠️ Produtos não essenciais terão tributação unificada mais alta</li>
                      </>
                    )}
                    <li>✓ A reforma garante <strong>preços iguais</strong> em todos os estados (fim da guerra fiscal)</li>
                    <li>✓ Transparência: IBS/CBS virão destacados claramente na nota fiscal</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Info Card */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mt-8 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-amber-900 mb-2">
                ℹ️ Sobre os Cálculos
              </h4>
              <p className="text-amber-800 leading-relaxed text-sm">
                Os valores atuais consideram ICMS médio para cesta básica (~7%, muitos estados 
                isentam) + PIS/COFINS (9,25%). A <strong>Cesta Básica Nacional</strong> definitiva 
                será regulamentada por lei complementar. Alíquotas podem variar conforme 
                regulamentação final. Preços são aproximados para fins educacionais.
              </p>
            </div>
          </div>
        </div>

        {/* ARTIGO SEO */}
        <article className="max-w-4xl mx-auto prose prose-lg">
          
          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Cesta Básica Nacional: Guia Completo sobre Alíquota Zero na Reforma Tributária
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Uma das maiores conquistas da <strong>Reforma Tributária (EC 132/2023)</strong> para a 
            população brasileira é a criação da <strong>Cesta Básica Nacional com alíquota ZERO</strong>. 
            Pela primeira vez na história, alimentos essenciais terão <strong>tributação completamente 
            zerada</strong>, reduzindo o preço final ao consumidor e aumentando o acesso da população 
            de baixa renda à alimentação adequada.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Este guia explica <strong>o que muda</strong>, quais produtos serão beneficiados, 
            e qual será o <strong>impacto real nos preços</strong> dos supermercados a partir de 2026.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            O que é a Cesta Básica Nacional?
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            A <strong>Cesta Básica Nacional</strong> é uma lista de produtos essenciais que terão 
            <strong> alíquota ZERO de IBS e CBS</strong> (os novos impostos que substituirão ICMS, 
            ISS, PIS e COFINS). Diferente do sistema atual, onde a isenção varia por estado:
          </p>

          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-green-900 mb-3">✅ Sistema Novo - Vantagens</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                <strong>Lista única nacional:</strong> Mesmos produtos isentos em todo o Brasil
              </li>
              <li>
                <strong>Alíquota ZERO garantida:</strong> Sem exceções ou interpretações estaduais
              </li>
              <li>
                <strong>Simplicidade:</strong> Consumidor sabe exatamente o que é isento
              </li>
              <li>
                <strong>Transparência:</strong> Nota fiscal mostra claramente "alíquota 0%"
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Sistema Atual: Caos Tributário
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Hoje, a "cesta básica" é um conceito <strong>indefinido e fragmentado</strong>:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>27 listas diferentes:</strong> Cada estado define sua própria cesta básica
            </li>
            <li>
              <strong>Alíquotas variadas:</strong> Alguns isentam (0%), outros reduzem (7%), 
              outros tributam integralmente (18%)
            </li>
            <li>
              <strong>Complexidade absurda:</strong> Mesmo produto tem tratamento diferente em cada estado
            </li>
            <li>
              <strong>Guerra fiscal:</strong> Estados competem por arrecadação, prejudicando consumidor
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Produtos da Cesta Básica Nacional (Alíquota ZERO)
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            A lista oficial será definida por <strong>lei complementar</strong>, mas a proposta 
            inicial inclui:
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            🥩 Carnes e Proteínas
          </h3>

          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6 ml-4">
            <li>Carne bovina (cortes de primeira e segunda)</li>
            <li>Carne suína</li>
            <li>Frango inteiro e em partes</li>
            <li>Pescados (peixes frescos e congelados)</li>
            <li>Ovos</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            🌾 Cereais e Grãos
          </h3>

          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6 ml-4">
            <li>Arroz</li>
            <li>Feijão (todos os tipos)</li>
            <li>Farinha de trigo</li>
            <li>Farinha de mandioca</li>
            <li>Milho e fubá</li>
            <li>Macarrão (massas simples)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            🥛 Laticínios
          </h3>

          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6 ml-4">
            <li>Leite integral e desnatado</li>
            <li>Manteiga</li>
            <li>Margarina</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            🍞 Panificação
          </h3>

          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6 ml-4">
            <li>Pão francês</li>
            <li>Pão de forma (simples)</li>
            <li>Biscoito cream cracker (simples)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            🥕 Hortifruti
          </h3>

          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6 ml-4">
            <li>Tomate</li>
            <li>Cebola</li>
            <li>Batata</li>
            <li>Cenoura</li>
            <li>Banana</li>
            <li>Laranja</li>
            <li>Maçã</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            🫒 Óleos e Condimentos
          </h3>

          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6 ml-4">
            <li>Óleo de soja</li>
            <li>Óleo de girassol</li>
            <li>Sal de cozinha</li>
            <li>Açúcar cristal e refinado</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            ☕ Bebidas
          </h3>

          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6 ml-4">
            <li>Café em pó</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Alíquota Reduzida (60% = 15,9%)
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Produtos <strong>não incluídos na cesta básica</strong>, mas considerados essenciais, 
            terão <strong>alíquota reduzida de 60%</strong> (15,9% ao invés de 26,5%):
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Queijos (muçarela, minas, prato)</li>
            <li>Café solúvel</li>
            <li>Sucos naturais e integrais</li>
            <li>Alguns produtos de higiene pessoal (em discussão)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Alíquota Padrão (26,5%)
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Produtos <strong>não essenciais</strong> pagarão a alíquota cheia:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Biscoitos recheados, wafers, cookies</li>
            <li>Refrigerantes</li>
            <li>Azeite de oliva (não essencial)</li>
            <li>Produtos importados ou gourmet</li>
            <li>Alimentos ultraprocessados</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Impacto nos Preços: Quanto Vai Baixar?
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Exemplo 1: Arroz (1kg)
          </h3>

          <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg mb-6">
            <p className="text-gray-800 mb-2">
              <strong>Preço sem impostos:</strong> R$ 5,00
            </p>
            <p className="text-gray-800 mb-2">
              <strong>Sistema atual:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-3">
              <li>ICMS (7% média): R$ 0,35</li>
              <li>PIS/COFINS (9,25%): R$ 0,46</li>
              <li><strong>Preço final: R$ 5,81</strong></li>
            </ul>
            <p className="text-gray-800 mb-2">
              <strong>Pós-reforma:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-3">
              <li>IBS + CBS: R$ 0,00 (alíquota zero!)</li>
              <li><strong>Preço final: R$ 5,00</strong></li>
            </ul>
            <p className="text-green-700 font-bold text-lg mt-3">
              ✅ Economia: R$ 0,81 (14% mais barato)
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Exemplo 2: Frango (1kg)
          </h3>

          <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg mb-6">
            <p className="text-gray-800 mb-2">
              <strong>Preço sem impostos:</strong> R$ 8,00
            </p>
            <p className="text-gray-800 mb-2">
              <strong>Sistema atual:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-3">
              <li>ICMS (7%): R$ 0,56</li>
              <li>PIS/COFINS (9,25%): R$ 0,74</li>
              <li><strong>Preço final: R$ 9,30</strong></li>
            </ul>
            <p className="text-gray-800 mb-2">
              <strong>Pós-reforma:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-3">
              <li>IBS + CBS: R$ 0,00</li>
              <li><strong>Preço final: R$ 8,00</strong></li>
            </ul>
            <p className="text-green-700 font-bold text-lg mt-3">
              ✅ Economia: R$ 1,30 (14% mais barato)
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Exemplo 3: Óleo de Soja (900ml)
          </h3>

          <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg mb-6">
            <p className="text-gray-800 mb-2">
              <strong>Preço sem impostos:</strong> R$ 6,00
            </p>
            <p className="text-gray-800 mb-2">
              <strong>Sistema atual:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-3">
              <li>ICMS (7%): R$ 0,42</li>
              <li>PIS/COFINS (9,25%): R$ 0,56</li>
              <li><strong>Preço final: R$ 6,98</strong></li>
            </ul>
            <p className="text-gray-800 mb-2">
              <strong>Pós-reforma:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-3">
              <li>IBS + CBS: R$ 0,00</li>
              <li><strong>Preço final: R$ 6,00</strong></li>
            </ul>
            <p className="text-green-700 font-bold text-lg mt-3">
              ✅ Economia: R$ 0,98 (14% mais barato)
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Impacto Social: Quem Mais Se Beneficia?
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Famílias de Baixa Renda
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Quanto <strong>menor a renda</strong>, maior o impacto positivo:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              Famílias de baixa renda gastam <strong>até 40% da renda</strong> com alimentação
            </li>
            <li>
              Alíquota zero = <strong>aumento real do poder de compra</strong>
            </li>
            <li>
              Economia estimada: <strong>R$ 50-100/mês</strong> por família
            </li>
            <li>
              Adicional: <strong>Cashback do IBS</strong> devolve mais 20% do imposto pago
            </li>
          </ul>

          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-green-900 mb-3">
              💰 Exemplo: Família com Renda de R$ 2.000/mês
            </h4>
            <p className="text-gray-700 mb-2">
              <strong>Gasto mensal com cesta básica:</strong> R$ 800 (40% da renda)
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Economia com alíquota zero (14%):</strong> R$ 112/mês
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Cashback IBS adicional:</strong> ~R$ 30/mês
            </p>
            <p className="text-green-700 font-bold text-lg mt-3">
              ✅ Total: R$ 142/mês = R$ 1.704/ano
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Polêmicas e Debates
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            1. Lista Muito Restrita?
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Críticos argumentam que a lista exclui produtos importantes:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Fraldas descartáveis:</strong> Não incluídas (possível alíquota reduzida)
            </li>
            <li>
              <strong>Absorventes:</strong> Não incluídos (em discussão para alíquota zero)
            </li>
            <li>
              <strong>Produtos de higiene:</strong> Sabonete, pasta de dente (não incluídos)
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            2. E os Produtos Regionais?
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Lista nacional pode não refletir <strong>hábitos alimentares regionais</strong>:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Norte: Açaí, farinha de tapioca, peixes regionais</li>
            <li>Nordeste: Carne de sol, charque, rapadura</li>
            <li>Centro-Oeste: Pequi, carne seca</li>
            <li>Sul: Chimarrão (erva-mate)</li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Solução:</strong> Lei complementar pode incluir produtos regionais essenciais 
            com alíquota zero ou reduzida.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                1. A cesta básica será a mesma em todo o Brasil?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sim!</strong> Pela primeira vez, teremos uma <strong>lista nacional única</strong>. 
                Os mesmos produtos terão alíquota zero em SP, AM, RS ou qualquer outro estado.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                2. Os preços vão cair automaticamente em 2026?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Gradualmente.</strong> A transição é de 2026 a 2033. Em 2026, a redução será 
                parcial. A alíquota zero completa só será atingida em 2033.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                3. Supermercados são obrigados a repassar a redução?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Tecnicamente sim.</strong> O IBS/CBS incide "por fora" do preço, então a 
                redução deve ser automática. Porém, o <strong>mercado</strong> (oferta/demanda) 
                também influencia.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                4. Produtos industrializados da cesta básica também têm alíquota zero?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Depende.</strong> Pão francês (sim), biscoito cream cracker simples (sim), 
                biscoito recheado (não). A lista diferencia produtos básicos de ultraprocessados.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                5. Restaurantes e bares se beneficiam da alíquota zero?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Indiretamente.</strong> Restaurantes compram insumos com alíquota zero 
                (carne, arroz, feijão), gerando <strong>créditos tributários</strong>. Mas o 
                serviço prestado paga IBS/CBS normal (26,5%).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                6. A lista pode mudar depois?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sim.</strong> Lei complementar pode alterar a lista a qualquer momento. 
                Pressões sociais e estudos de impacto podem ampliar ou reduzir a cesta.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                7. Produtos orgânicos têm o mesmo benefício?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sim!</strong> Se o produto está na cesta básica, a alíquota zero vale 
                para <strong>convencional e orgânico</strong> igualmente.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Termos Importantes
          </h2>

          <dl className="space-y-4">
            <div>
              <dt className="font-bold text-gray-900">Cesta Básica Nacional</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Lista de produtos essenciais definida por lei complementar que terão 
                <strong> alíquota ZERO</strong> de IBS e CBS em todo o território nacional.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Alíquota Zero</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Tributação de 0% sobre determinados produtos. Diferente de "isenção", pois 
                mantém o direito aos créditos tributários na cadeia produtiva.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Alíquota Reduzida (60%)</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Produtos essenciais não incluídos na cesta básica pagam 60% da alíquota padrão 
                (15,9% ao invés de 26,5%).
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">NCM (Nomenclatura Comum do Mercosul)</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Código de 8 dígitos que identifica cada produto. A cesta básica será definida 
                por NCM específicos.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Cashback do IBS</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Devolução de parte do IBS pago por famílias de baixa renda cadastradas no 
                CadÚnico, ampliando o benefício da alíquota zero.
              </dd>
            </div>
          </dl>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Base Legal
          </h2>

          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Emenda Constitucional 132/2023:</strong> Prevê alíquota zero para cesta básica
            </li>
            <li>
              <strong>Art. 156-A, §1º, VI, CF:</strong> Autoriza alíquota zero para produtos essenciais
            </li>
            <li>
              <strong>Lei Complementar (em elaboração):</strong> Definirá lista exata de produtos
            </li>
            <li>
              <strong>Projeto de Lei nº XX/2024:</strong> Propõe lista inicial com 50+ itens
            </li>
          </ul>

          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg mt-8">
            <p className="text-gray-800 leading-relaxed">
              <strong>🚀 Próximo Passo:</strong> Use nosso simulador acima para comparar o preço 
              de qualquer produto da cesta básica no sistema atual vs. pós-reforma. Selecione a 
              categoria, escolha o produto e veja a economia exata. Para entender o impacto na sua 
              família, calcule o gasto mensal com alimentação e multiplique por 14% - essa será 
              sua economia estimada.
            </p>
          </div>

        </article>

      </div>
    </div>
  );
}

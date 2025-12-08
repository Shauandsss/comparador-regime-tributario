import React, { useState } from 'react';
import { Calculator, ShoppingCart, TrendingDown, AlertCircle, CheckCircle, Package, DollarSign } from 'lucide-react';

const CestaBasicaIVA = () => {
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [valorUnitario, setValorUnitario] = useState('');
  const [estado, setEstado] = useState('SP');
  const [mostrarResultado, setMostrarResultado] = useState(false);

  // Produtos da Cesta Básica Nacional (Alíquota ZERO)
  const produtosCestaBasica = [
    { id: 'arroz', nome: 'Arroz', categoria: 'Grãos', ncm: '1006.30', icon: '🍚', precoMedio: 5.50 },
    { id: 'feijao', nome: 'Feijão', categoria: 'Grãos', ncm: '0713.33', icon: '🫘', precoMedio: 8.00 },
    { id: 'acucar', nome: 'Açúcar cristal', categoria: 'Essenciais', ncm: '1701.99', icon: '🍬', precoMedio: 4.00 },
    { id: 'sal', nome: 'Sal refinado', categoria: 'Essenciais', ncm: '2501.00', icon: '🧂', precoMedio: 2.00 },
    { id: 'cafe', nome: 'Café em pó', categoria: 'Essenciais', ncm: '0901.21', icon: '☕', precoMedio: 12.00 },
    { id: 'oleo-soja', nome: 'Óleo de soja', categoria: 'Óleos', ncm: '1507.90', icon: '🧴', precoMedio: 8.50 },
    { id: 'farinha-trigo', nome: 'Farinha de trigo', categoria: 'Farinhas', ncm: '1101.00', icon: '🌾', precoMedio: 5.00 },
    { id: 'farinha-mandioca', nome: 'Farinha de mandioca', categoria: 'Farinhas', ncm: '1106.20', icon: '🥔', precoMedio: 6.00 },
    { id: 'macarrao', nome: 'Macarrão', categoria: 'Massas', ncm: '1902.19', icon: '🍝', precoMedio: 4.50 },
    { id: 'pao-frances', nome: 'Pão francês', categoria: 'Panificação', ncm: '1905.90', icon: '🥖', precoMedio: 12.00 },
    { id: 'leite', nome: 'Leite integral', categoria: 'Laticínios', ncm: '0401.10', icon: '🥛', precoMedio: 5.00 },
    { id: 'manteiga', nome: 'Manteiga', categoria: 'Laticínios', ncm: '0405.10', icon: '🧈', precoMedio: 15.00 },
    { id: 'queijo', nome: 'Queijo minas', categoria: 'Laticínios', ncm: '0406.10', icon: '🧀', precoMedio: 40.00 },
    { id: 'ovos', nome: 'Ovos', categoria: 'Proteínas', ncm: '0407.21', icon: '🥚', precoMedio: 10.00 },
    { id: 'frango', nome: 'Frango inteiro', categoria: 'Carnes', ncm: '0207.14', icon: '🍗', precoMedio: 8.00 },
    { id: 'carne-bovina', nome: 'Carne bovina (corte popular)', categoria: 'Carnes', ncm: '0201.30', icon: '🥩', precoMedio: 35.00 }
  ];

  // Produtos FORA da Cesta Básica (Alíquota Padrão 26,5%)
  const produtosForaCesta = [
    { id: 'picanha', nome: 'Picanha', categoria: 'Carnes Premium', ncm: '0201.20', icon: '🥩', precoMedio: 80.00 },
    { id: 'salmao', nome: 'Salmão', categoria: 'Peixes Premium', ncm: '0304.42', icon: '🐟', precoMedio: 60.00 },
    { id: 'queijo-importado', nome: 'Queijo importado', categoria: 'Laticínios Premium', ncm: '0406.90', icon: '🧀', precoMedio: 80.00 },
    { id: 'vinho', nome: 'Vinho', categoria: 'Bebidas', ncm: '2204.21', icon: '🍷', precoMedio: 50.00 },
    { id: 'cerveja', nome: 'Cerveja', categoria: 'Bebidas', ncm: '2203.00', icon: '🍺', precoMedio: 5.00 },
    { id: 'refrigerante', nome: 'Refrigerante', categoria: 'Bebidas', ncm: '2202.10', icon: '🥤', precoMedio: 6.00 },
    { id: 'chocolate', nome: 'Chocolate', categoria: 'Doces', ncm: '1806.32', icon: '🍫', precoMedio: 8.00 },
    { id: 'salgadinho', nome: 'Salgadinho', categoria: 'Snacks', ncm: '1905.90', icon: '🍿', precoMedio: 7.00 },
    { id: 'sorvete', nome: 'Sorvete', categoria: 'Gelados', ncm: '2105.00', icon: '🍨', precoMedio: 20.00 },
    { id: 'biscoito-recheado', nome: 'Biscoito recheado', categoria: 'Biscoitos', ncm: '1905.31', icon: '🍪', precoMedio: 6.00 }
  ];

  const todosProdutos = [
    { grupo: 'Cesta Básica Nacional (Alíquota ZERO)', produtos: produtosCestaBasica, isento: true },
    { grupo: 'Fora da Cesta Básica (Alíquota Padrão)', produtos: produtosForaCesta, isento: false }
  ];

  const estados = [
    { uf: 'SP', nome: 'São Paulo', aliquotaICMS: 18 },
    { uf: 'RJ', nome: 'Rio de Janeiro', aliquotaICMS: 20 },
    { uf: 'MG', nome: 'Minas Gerais', aliquotaICMS: 18 },
    { uf: 'RS', nome: 'Rio Grande do Sul', aliquotaICMS: 17 },
    { uf: 'PR', nome: 'Paraná', aliquotaICMS: 19 },
    { uf: 'SC', nome: 'Santa Catarina', aliquotaICMS: 17 },
    { uf: 'BA', nome: 'Bahia', aliquotaICMS: 19 },
    { uf: 'PE', nome: 'Pernambuco', aliquotaICMS: 18 },
    { uf: 'CE', nome: 'Ceará', aliquotaICMS: 18 },
    { uf: 'DF', nome: 'Distrito Federal', aliquotaICMS: 18 }
  ];

  const calcular = () => {
    if (!produtoSelecionado || !quantidade || !valorUnitario) {
      alert('Preencha todos os campos');
      return;
    }
    setMostrarResultado(true);
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarPercentual = (valor) => {
    return valor.toFixed(2) + '%';
  };

  const produto = [...produtosCestaBasica, ...produtosForaCesta].find(p => p.id === produtoSelecionado);
  const estadoSelecionado = estados.find(e => e.uf === estado);
  const qtd = parseInt(quantidade);
  const valorUnit = parseFloat(valorUnitario);
  const valorTotal = valorUnit * qtd;

  // Produto está na cesta básica?
  const isIsento = produtosCestaBasica.some(p => p.id === produtoSelecionado);

  // Cálculo Sistema Atual (ICMS + PIS/COFINS)
  const aliquotaICMS = estadoSelecionado.aliquotaICMS / 100;
  const aliquotaPISCOFINS = 0.0925; // 9.25%
  const tributoAtualICMS = valorTotal * aliquotaICMS;
  const tributoAtualPISCOFINS = valorTotal * aliquotaPISCOFINS;
  const tributoAtualTotal = tributoAtualICMS + tributoAtualPISCOFINS;

  // Preço sem tributo (base)
  const precoBase = valorTotal / (1 + aliquotaICMS + aliquotaPISCOFINS);
  const precoFinalAtual = valorTotal;

  // Cálculo Sistema Novo (IBS/CBS)
  const aliquotaIVA = isIsento ? 0 : 0.265; // 0% ou 26.5%
  const tributoNovo = precoBase * aliquotaIVA;
  const precoFinalNovo = precoBase + tributoNovo;

  // Economia
  const economia = precoFinalAtual - precoFinalNovo;
  const economiaPercentual = (economia / precoFinalAtual) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingCart className="w-12 h-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Calculadora da Cesta Básica Nacional
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simule os tributos de produtos incluídos e excluídos da Cesta Básica Nacional. Compare quanto você economiza com alíquota ZERO no IBS/CBS
          </p>
        </div>

        {/* Alerta Informativo */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-800 mb-1">🛒 O Que É Cesta Básica Nacional?</h3>
              <p className="text-gray-700 text-sm">
                A Cesta Básica Nacional terá <strong>alíquota ZERO</strong> (isenção total) de IBS/CBS, tornando alimentos 
                essenciais mais baratos. A lista oficial será definida por lei complementar e incluirá arroz, feijão, 
                leite, pão, carnes populares, entre outros produtos essenciais para alimentação.
              </p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-green-600" />
            Dados do Produto
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Produto */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o Produto
              </label>
              <select
                value={produtoSelecionado}
                onChange={(e) => {
                  setProdutoSelecionado(e.target.value);
                  const prod = [...produtosCestaBasica, ...produtosForaCesta].find(p => p.id === e.target.value);
                  if (prod) setValorUnitario(prod.precoMedio.toString());
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Escolha um produto</option>
                {todosProdutos.map(grupo => (
                  <optgroup key={grupo.grupo} label={grupo.grupo}>
                    {grupo.produtos.map(prod => (
                      <option key={prod.id} value={prod.id}>
                        {prod.icon} {prod.nome} - {prod.categoria} {grupo.isento ? '(ISENTO)' : '(26,5%)'}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {produto && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold">NCM:</span> {produto.ncm} | 
                  <span className="font-semibold"> Categoria:</span> {produto.categoria}
                </div>
              )}
            </div>

            {/* Valor Unitário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Unitário (R$)
              </label>
              <input
                type="number"
                value={valorUnitario}
                onChange={(e) => setValorUnitario(e.target.value)}
                placeholder="Ex: 5.50"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Quantidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade (unidades/kg)
              </label>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="Ex: 1"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado (UF)
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {estados.map(e => (
                  <option key={e.uf} value={e.uf}>
                    {e.nome} ({e.uf}) - ICMS {e.aliquotaICMS}%
                  </option>
                ))}
              </select>
            </div>

            {/* Valor Total */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Total
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-semibold text-gray-800">
                {formatarMoeda(valorTotal || 0)}
              </div>
            </div>
          </div>

          <button
            onClick={calcular}
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calcular Economia
          </button>
        </div>

        {/* Resultados */}
        {mostrarResultado && produto && (
          <>
            {/* Status do Produto */}
            <div className={`${isIsento ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-500'} border-l-4 rounded-xl shadow-lg p-6 mb-8`}>
              <div className="flex items-start gap-4">
                <div className="text-5xl">{produto.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    {produto.nome}
                    {isIsento ? (
                      <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> ISENTO
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-500 text-white text-sm font-bold rounded-full">
                        26,5% IBS/CBS
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Categoria:</strong> {produto.categoria} | <strong>NCM:</strong> {produto.ncm}
                  </p>
                  <p className="text-gray-700">
                    {isIsento 
                      ? '✅ Este produto FAZ PARTE da Cesta Básica Nacional e terá ALÍQUOTA ZERO (isenção total) de IBS/CBS.'
                      : '⚠️ Este produto NÃO faz parte da Cesta Básica Nacional e terá alíquota padrão de 26,5% no IBS/CBS.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Comparação Tributária */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Sistema Atual */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-red-600" />
                  Sistema Atual (ICMS + PIS/COFINS)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Base de Cálculo:</span>
                    <span className="font-semibold">{formatarMoeda(precoBase)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">ICMS ({estadoSelecionado.aliquotaICMS}%):</span>
                    <span className="font-semibold text-red-600">{formatarMoeda(tributoAtualICMS)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">PIS/COFINS (9,25%):</span>
                    <span className="font-semibold text-red-600">{formatarMoeda(tributoAtualPISCOFINS)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Total de Tributos:</span>
                    <span className="font-semibold text-red-600">{formatarMoeda(tributoAtualTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 bg-red-50 p-3 rounded-lg">
                    <span className="font-bold text-gray-800">Preço Final:</span>
                    <span className="font-bold text-2xl text-red-600">{formatarMoeda(precoFinalAtual)}</span>
                  </div>
                </div>
              </div>

              {/* Sistema Novo */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${isIsento ? 'border-green-500' : 'border-blue-500'}`}>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingDown className={`w-6 h-6 ${isIsento ? 'text-green-600' : 'text-blue-600'}`} />
                  Sistema Novo (IBS/CBS)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Base de Cálculo:</span>
                    <span className="font-semibold">{formatarMoeda(precoBase)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Alíquota IBS/CBS:</span>
                    <span className={`font-semibold ${isIsento ? 'text-green-600' : 'text-blue-600'}`}>
                      {isIsento ? '0% (ISENTO)' : '26,5%'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">IBS/CBS:</span>
                    <span className={`font-semibold ${isIsento ? 'text-green-600' : 'text-blue-600'}`}>
                      {formatarMoeda(tributoNovo)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${isIsento ? 'text-green-600' : 'text-blue-600'}`}>
                      {isIsento ? 'Cesta Básica' : 'Alíquota Padrão'}
                    </span>
                  </div>
                  <div className={`flex justify-between items-center pt-2 ${isIsento ? 'bg-green-50' : 'bg-blue-50'} p-3 rounded-lg`}>
                    <span className="font-bold text-gray-800">Preço Final:</span>
                    <span className={`font-bold text-2xl ${isIsento ? 'text-green-600' : 'text-blue-600'}`}>
                      {formatarMoeda(precoFinalNovo)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Economia Gerada */}
            {isIsento && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 mb-8 border-l-4 border-green-500">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <DollarSign className="w-7 h-7 text-green-600" />
                  Economia com Cesta Básica Nacional
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-2">Economia por Compra</div>
                    <div className="text-3xl font-bold text-green-600">{formatarMoeda(economia)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatarPercentual(economiaPercentual)} de desconto
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-2">Tributo Eliminado</div>
                    <div className="text-3xl font-bold text-red-600">{formatarMoeda(tributoAtualTotal)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatarPercentual(((tributoAtualTotal / precoFinalAtual) * 100))} do preço atual
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-2">Novo Preço Final</div>
                    <div className="text-3xl font-bold text-green-600">{formatarMoeda(precoFinalNovo)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Sem tributos embutidos
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-white p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>✅ Interpretação:</strong> Com a alíquota ZERO da Cesta Básica Nacional, você economiza 
                    <strong> {formatarMoeda(economia)}</strong> nesta compra comparado ao sistema atual. 
                    Isso representa uma redução de <strong>{formatarPercentual(economiaPercentual)}</strong> no preço final, 
                    tornando o produto muito mais acessível.
                  </p>
                </div>

                {/* Projeção Mensal/Anual */}
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Economia Mensal (4 compras)</h4>
                    <div className="text-2xl font-bold text-green-600 mb-2">{formatarMoeda(economia * 4)}</div>
                    <p className="text-sm text-gray-600">
                      Comprando este produto 1x por semana, você economiza <strong>{formatarMoeda(economia * 4)}</strong> por mês.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Economia Anual (52 compras)</h4>
                    <div className="text-2xl font-bold text-green-600 mb-2">{formatarMoeda(economia * 52)}</div>
                    <p className="text-sm text-gray-600">
                      Ao longo de 1 ano, a economia acumulada chega a <strong>{formatarMoeda(economia * 52)}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Produtos Não Isentos */}
            {!isIsento && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg mb-8">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">⚠️ Produto Fora da Cesta Básica</h4>
                    <p className="text-gray-700 mb-3">
                      <strong>{produto.nome}</strong> não faz parte da Cesta Básica Nacional e terá <strong>alíquota padrão de 26,5%</strong> no IBS/CBS.
                    </p>
                    <div className="bg-white p-4 rounded">
                      <p className="text-gray-700 mb-2">
                        <strong>Preço Atual:</strong> {formatarMoeda(precoFinalAtual)} 
                        <span className="text-sm text-gray-600"> (ICMS {estadoSelecionado.aliquotaICMS}% + PIS/COFINS 9,25%)</span>
                      </p>
                      <p className="text-gray-700">
                        <strong>Preço Novo:</strong> {formatarMoeda(precoFinalNovo)} 
                        <span className="text-sm text-gray-600"> (IBS/CBS 26,5%)</span>
                      </p>
                      <p className={`font-bold mt-2 ${economia > 0 ? 'text-green-600' : economia < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {economia > 0 ? '✅' : economia < 0 ? '⚠️' : '➡️'} Variação: {economia > 0 ? '-' : economia < 0 ? '+' : ''}{formatarMoeda(Math.abs(economia))} 
                        ({economia > 0 ? 'redução' : economia < 0 ? 'aumento' : 'neutro'} de {formatarPercentual(Math.abs(economiaPercentual))})
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Lista de Produtos da Cesta Básica */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Produtos da Cesta Básica Nacional (Alíquota ZERO)
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {produtosCestaBasica.map(prod => (
              <div
                key={prod.id}
                className={`bg-green-50 border-2 ${produtoSelecionado === prod.id ? 'border-green-500 ring-2 ring-green-300' : 'border-green-200'} rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer`}
                onClick={() => {
                  setProdutoSelecionado(prod.id);
                  setValorUnitario(prod.precoMedio.toString());
                }}
              >
                <div className="text-3xl mb-2 text-center">{prod.icon}</div>
                <h4 className="font-bold text-gray-800 text-sm text-center mb-1">{prod.nome}</h4>
                <p className="text-xs text-gray-600 text-center mb-2">{prod.categoria}</p>
                <div className="text-center">
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                    ISENTO
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Média: {formatarMoeda(prod.precoMedio)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de Produtos Fora da Cesta */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-gray-600" />
            Produtos Fora da Cesta Básica (Alíquota Padrão 26,5%)
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {produtosForaCesta.map(prod => (
              <div
                key={prod.id}
                className={`bg-gray-50 border-2 ${produtoSelecionado === prod.id ? 'border-gray-500 ring-2 ring-gray-300' : 'border-gray-200'} rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer`}
                onClick={() => {
                  setProdutoSelecionado(prod.id);
                  setValorUnitario(prod.precoMedio.toString());
                }}
              >
                <div className="text-3xl mb-2 text-center">{prod.icon}</div>
                <h4 className="font-bold text-gray-800 text-sm text-center mb-1">{prod.nome}</h4>
                <p className="text-xs text-gray-600 text-center mb-2">{prod.categoria}</p>
                <div className="text-center">
                  <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded">
                    26,5%
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Média: {formatarMoeda(prod.precoMedio)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabela Comparativa */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            📊 Tabela Comparativa: Cesta Básica vs Fora da Cesta
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gradient-to-r from-green-100 to-emerald-100">
                <tr>
                  <th className="px-6 py-3 border-b text-left font-semibold text-gray-800">Produto</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Categoria</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Preço Médio</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Sistema Atual</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Alíquota IBS/CBS</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Economia</th>
                </tr>
              </thead>
              <tbody>
                {produtosCestaBasica.slice(0, 8).map((prod, index) => {
                  const base = prod.precoMedio / 1.2725; // Base sem ICMS 18% + PIS/COFINS 9.25%
                  const tributoAtual = prod.precoMedio - base;
                  const tributoNovo = 0; // Isento
                  const econ = tributoAtual - tributoNovo;
                  
                  return (
                    <tr key={prod.id} className={index % 2 === 0 ? 'bg-green-50' : 'bg-white'}>
                      <td className="px-6 py-4 border-b">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{prod.icon}</span>
                          <span className="font-medium text-gray-800">{prod.nome}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b text-center text-gray-600">{prod.categoria}</td>
                      <td className="px-6 py-4 border-b text-center font-semibold">{formatarMoeda(prod.precoMedio)}</td>
                      <td className="px-6 py-4 border-b text-center text-red-600">27,25%</td>
                      <td className="px-6 py-4 border-b text-center">
                        <span className="px-3 py-1 bg-green-500 text-white font-bold rounded-full">
                          0%
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b text-center font-bold text-green-600">
                        {formatarMoeda(econ)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Artigo SEO */}
        <article className="bg-white rounded-xl shadow-lg p-8 mt-8 prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Cesta Básica Nacional: Alíquota ZERO no IBS/CBS e o Impacto nos Alimentos
          </h2>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 mb-8 rounded">
            <p className="text-gray-700 text-lg leading-relaxed">
              A <strong>Cesta Básica Nacional</strong> terá <strong>alíquota ZERO</strong> (isenção total) de IBS/CBS 
              na Reforma Tributária (EC 132/2023). Produtos essenciais para alimentação como arroz, feijão, leite, pão e 
              carnes populares ficarão até <strong>27% mais baratos</strong>, melhorando o poder de compra das famílias 
              brasileiras. Entenda quais produtos serão beneficiados e quanto você vai economizar.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🛒 O Que É a Cesta Básica Nacional?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A Cesta Básica Nacional é uma <strong>lista de produtos essenciais para alimentação</strong> que terá 
            <strong>isenção total de tributos</strong> (alíquota zero) no novo sistema IBS/CBS. A medida busca garantir 
            acesso à alimentação básica e combater a insegurança alimentar, tornando produtos fundamentais mais acessíveis 
            para toda a população.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-3">🎯 Objetivo da Isenção</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Combater a fome:</strong> Reduzir preço de alimentos essenciais</li>
              <li><strong>Acessibilidade:</strong> Garantir que famílias de baixa renda tenham acesso à alimentação adequada</li>
              <li><strong>Justiça tributária:</strong> Evitar que tributos incidam sobre o mínimo existencial</li>
              <li><strong>Simplificação:</strong> Substituir múltiplas isenções estaduais por regra nacional única</li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            📋 Lista Completa: Produtos da Cesta Básica Nacional
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A lista oficial será definida por lei complementar, mas a Constituição já estabelece categorias. 
            Veja os principais produtos que devem ser incluídos:
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg">🌾 Grãos e Cereais</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🍚</span>
                  <div>
                    <strong>Arroz</strong>
                    <p className="text-xs text-gray-600">Branco, parboilizado, integral</p>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🫘</span>
                  <div>
                    <strong>Feijão</strong>
                    <p className="text-xs text-gray-600">Carioca, preto, fradinho</p>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🌽</span>
                  <div>
                    <strong>Milho</strong>
                    <p className="text-xs text-gray-600">Fubá, farinha de milho</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg">🌾 Farinhas e Massas</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🌾</span>
                  <div>
                    <strong>Farinha de trigo</strong>
                    <p className="text-xs text-gray-600">Branca, integral</p>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🥔</span>
                  <div>
                    <strong>Farinha de mandioca</strong>
                    <p className="text-xs text-gray-600">Fina, grossa, tapioca</p>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🍝</span>
                  <div>
                    <strong>Macarrão</strong>
                    <p className="text-xs text-gray-600">Espaguete, parafuso, penne</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg">🥖 Panificação</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🥖</span>
                  <div>
                    <strong>Pão francês</strong>
                    <p className="text-xs text-gray-600">Pão simples/de sal</p>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🍞</span>
                  <div>
                    <strong>Pão de forma</strong>
                    <p className="text-xs text-gray-600">Branco, integral (básico)</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg">🥛 Laticínios</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🥛</span>
                  <div>
                    <strong>Leite</strong>
                    <p className="text-xs text-gray-600">Integral, desnatado, em pó</p>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🧈</span>
                  <div>
                    <strong>Manteiga</strong>
                    <p className="text-xs text-gray-600">Com ou sem sal</p>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🧀</span>
                  <div>
                    <strong>Queijo minas</strong>
                    <p className="text-xs text-gray-600">Frescal, padrão</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg">🥩 Proteínas</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🍗</span>
                  <div>
                    <strong>Frango</strong>
                    <p className="text-xs text-gray-600">Inteiro, cortes básicos</p>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🥩</span>
                  <div>
                    <strong>Carne bovina</strong>
                    <p className="text-xs text-gray-600">Cortes de segunda (músculo, acém)</p>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🥚</span>
                  <div>
                    <strong>Ovos</strong>
                    <p className="text-xs text-gray-600">Brancos, vermelhos</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg">☕ Essenciais</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-2xl">☕</span>
                  <div>
                    <strong>Café em pó</strong>
                    <p className="text-xs text-gray-600">Tradicional, torrado e moído</p>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🍬</span>
                  <div>
                    <strong>Açúcar cristal</strong>
                    <p className="text-xs text-gray-600">Refinado, cristal</p>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🧂</span>
                  <div>
                    <strong>Sal refinado</strong>
                    <p className="text-xs text-gray-600">Iodado</p>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🧴</span>
                  <div>
                    <strong>Óleo de soja</strong>
                    <p className="text-xs text-gray-600">Refinado</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            ❌ O Que NÃO Entra na Cesta Básica?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Produtos considerados supérfluos, premium ou não essenciais terão <strong>alíquota padrão de 26,5%</strong>:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-5 rounded-lg border-2 border-gray-300">
              <h4 className="font-bold text-gray-800 mb-3">🚫 Carnes Premium</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Picanha, filé mignon, contrafilé</li>
                <li>Salmão, bacalhau, lagosta</li>
                <li>Carnes importadas ou exóticas</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border-2 border-gray-300">
              <h4 className="font-bold text-gray-800 mb-3">🚫 Bebidas</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Cerveja, vinho, destilados</li>
                <li>Refrigerantes</li>
                <li>Sucos artificiais</li>
                <li>Energéticos</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border-2 border-gray-300">
              <h4 className="font-bold text-gray-800 mb-3">🚫 Snacks e Doces</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Chocolates</li>
                <li>Salgadinhos</li>
                <li>Biscoitos recheados</li>
                <li>Sorvetes</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border-2 border-gray-300">
              <h4 className="font-bold text-gray-800 mb-3">🚫 Laticínios Premium</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Queijos importados (gouda, brie, camembert)</li>
                <li>Iogurtes gourmet</li>
                <li>Leites especiais (sem lactose premium)</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            💰 Quanto Você Vai Economizar?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Com a isenção total de tributos, produtos da cesta básica terão <strong>redução significativa de preço</strong>. Veja exemplos práticos:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gradient-to-r from-green-100 to-emerald-100">
                <tr>
                  <th className="px-6 py-3 border-b text-left font-semibold text-gray-800">Produto</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Preço Atual</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Tributo Atual</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Preço Novo</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Economia</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-green-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">🍚 Arroz (5kg)</td>
                  <td className="px-6 py-4 border-b text-center">R$ 27,50</td>
                  <td className="px-6 py-4 border-b text-center text-red-600">R$ 7,50 (27%)</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">R$ 20,00</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">-R$ 7,50</td>
                </tr>
                <tr className="hover:bg-green-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">🫘 Feijão (1kg)</td>
                  <td className="px-6 py-4 border-b text-center">R$ 8,00</td>
                  <td className="px-6 py-4 border-b text-center text-red-600">R$ 2,18 (27%)</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">R$ 5,82</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">-R$ 2,18</td>
                </tr>
                <tr className="hover:bg-green-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">🥛 Leite (1L)</td>
                  <td className="px-6 py-4 border-b text-center">R$ 5,00</td>
                  <td className="px-6 py-4 border-b text-center text-red-600">R$ 1,36 (27%)</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">R$ 3,64</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">-R$ 1,36</td>
                </tr>
                <tr className="hover:bg-green-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">🥖 Pão francês (1kg)</td>
                  <td className="px-6 py-4 border-b text-center">R$ 12,00</td>
                  <td className="px-6 py-4 border-b text-center text-red-600">R$ 3,27 (27%)</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">R$ 8,73</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">-R$ 3,27</td>
                </tr>
                <tr className="hover:bg-green-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">🍗 Frango (1kg)</td>
                  <td className="px-6 py-4 border-b text-center">R$ 8,00</td>
                  <td className="px-6 py-4 border-b text-center text-red-600">R$ 2,18 (27%)</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">R$ 5,82</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">-R$ 2,18</td>
                </tr>
                <tr className="hover:bg-green-50 bg-green-100">
                  <td className="px-6 py-4 font-bold text-gray-800">📦 Total (compra semanal)</td>
                  <td className="px-6 py-4 text-center font-bold">R$ 60,50</td>
                  <td className="px-6 py-4 text-center text-red-600 font-bold">R$ 16,49</td>
                  <td className="px-6 py-4 text-center text-green-600 font-bold">R$ 44,01</td>
                  <td className="px-6 py-4 text-center text-green-600 font-bold">-R$ 16,49</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded mb-6">
            <h4 className="font-bold text-gray-800 mb-3">💡 Economia Anual para uma Família</h4>
            <div className="space-y-2 text-gray-700">
              <p><strong>Compra semanal:</strong> R$ 60,50 → R$ 44,01 = Economia de R$ 16,49</p>
              <p><strong>Economia mensal:</strong> R$ 16,49 × 4 semanas = <strong className="text-green-600">R$ 65,96</strong></p>
              <p><strong>Economia anual:</strong> R$ 65,96 × 12 meses = <strong className="text-green-600 text-xl">R$ 791,52</strong></p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            📅 Quando Começa a Valer?
          </h3>
          <div className="bg-purple-50 p-6 rounded-lg mb-6">
            <div className="space-y-3 text-gray-700">
              <p><strong>2026:</strong> Período de teste (1% IBS + 0.9% CBS) - Cesta básica <strong>ainda não isenta</strong></p>
              <p><strong>2027:</strong> Início da transição (8.8% total) - <strong>Isenção começa gradualmente</strong></p>
              <p><strong>2028-2032:</strong> Aumento progressivo da alíquota padrão - <strong>Cesta básica mantém isenção</strong></p>
              <p><strong>2033:</strong> Sistema completo (26.5% padrão) - <strong>Cesta básica 100% isenta</strong></p>
              <p className="font-bold text-purple-700 mt-4">
                ✅ Benefício pleno a partir de 2033, mas redução progressiva começa em 2027!
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            ⚖️ Critérios para Inclusão na Cesta Básica
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A lei complementar definirá critérios específicos para enquadramento. Principais requisitos esperados:
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Essencialidade:</strong> Produto fundamental para alimentação básica</li>
              <li><strong>Consumo popular:</strong> Amplamente consumido pela população de baixa renda</li>
              <li><strong>Nutricional:</strong> Relevância nutricional (proteínas, carboidratos, vitaminas)</li>
              <li><strong>Preço acessível:</strong> Produto de baixo custo unitário</li>
              <li><strong>Nacional:</strong> Produção predominantemente nacional (não importado premium)</li>
              <li><strong>Simplicidade:</strong> Sem processamento excessivo ou agregação de valor supérflua</li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🔍 Polêmicas e Debates
          </h3>
          
          <div className="space-y-6">
            <div className="bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-bold text-gray-800 mb-2">🥩 Carne Vermelha: Entra ou Não?</h4>
              <p className="text-gray-700 mb-2">
                <strong>Polêmica:</strong> Há debate se carne bovina deve ser incluída integralmente ou apenas cortes populares.
              </p>
              <p className="text-gray-700">
                <strong>Posição provável:</strong> Cortes de <strong>segunda</strong> (acém, músculo, coxão mole) entram. 
                Cortes <strong>nobres</strong> (picanha, filé mignon) ficam fora.
              </p>
            </div>

            <div className="bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-bold text-gray-800 mb-2">🧀 Queijos: Qual a Linha Divisória?</h4>
              <p className="text-gray-700 mb-2">
                <strong>Polêmica:</strong> Queijos variam muito em preço e qualidade.
              </p>
              <p className="text-gray-700">
                <strong>Posição provável:</strong> Queijo minas, mussarela básica e prato entram. Queijos importados 
                (gouda, brie, parmesão) e gourmet ficam fora.
              </p>
            </div>

            <div className="bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-bold text-gray-800 mb-2">🍞 Pão: Artesanal ou Industrial?</h4>
              <p className="text-gray-700 mb-2">
                <strong>Polêmica:</strong> Pão francês vs. pães especiais.
              </p>
              <p className="text-gray-700">
                <strong>Posição provável:</strong> Pão francês, pão de forma simples e integral entram. Pães especiais 
                (brioche, ciabatta, pão de fermentação natural) ficam fora.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            📈 Impacto Econômico e Social
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">✅ Benefícios</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Redução de preços:</strong> 20-27% mais baratos</li>
                <li><strong>Combate à fome:</strong> Mais famílias com acesso à alimentação adequada</li>
                <li><strong>Inflação:</strong> Pressão baixista em itens com grande peso no IPCA</li>
                <li><strong>Saúde pública:</strong> Melhor nutrição da população</li>
                <li><strong>Simplicidade:</strong> Regra única nacional (fim de 27 legislações)</li>
              </ul>
            </div>

            <div className="bg-red-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">⚠️ Desafios</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Definição da lista:</strong> Lobby de setores para inclusão</li>
                <li><strong>Fiscalização:</strong> Garantir que benefício seja repassado ao consumidor</li>
                <li><strong>Arrecadação:</strong> Perda de receita para estados/municípios</li>
                <li><strong>Diferenciação:</strong> Definir limite entre básico e premium</li>
                <li><strong>Substituição tributária:</strong> Alguns estados concedem isenção de ICMS hoje</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            💼 Impacto para Supermercados e Distribuidores
          </h3>
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-3">📊 Desafios Operacionais</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Sistemas:</strong> Atualizar para aplicar alíquota zero em produtos específicos por NCM</li>
              <li><strong>Precificação:</strong> Ajustar preços repassando benefício integral ao consumidor</li>
              <li><strong>Controle:</strong> Diferenciar produtos básicos de premium (ex: queijo minas vs. brie)</li>
              <li><strong>Auditoria:</strong> Preparar-se para fiscalização do repasse correto</li>
              <li><strong>Comunicação:</strong> Informar clientes sobre produtos isentos</li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            ❓ Perguntas Frequentes (FAQ)
          </h3>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">1. Quando a cesta básica será isenta?</h4>
              <p className="text-gray-700">
                A isenção <strong>começa gradualmente em 2027</strong> e será <strong>plena em 2033</strong>. Entre 2027-2032, 
                haverá transição proporcional conforme IBS/CBS substituem ICMS/PIS/COFINS.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">2. Qual é a lista oficial completa?</h4>
              <p className="text-gray-700">
                A lista oficial será definida por <strong>lei complementar</strong> ainda em tramitação no Congresso. 
                A Constituição estabelece apenas categorias gerais (grãos, carnes, laticínios, etc.).
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">3. Produtos orgânicos estão incluídos?</h4>
              <p className="text-gray-700">
                <strong>Sim</strong>, se forem produtos básicos (arroz orgânico, feijão orgânico). A condição é ser produto 
                essencial, independente de ser convencional ou orgânico.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">4. Restaurantes terão isenção ao comprar cesta básica?</h4>
              <p className="text-gray-700">
                <strong>Sim</strong>. A isenção vale para <strong>toda a cadeia</strong>: produtor → indústria → distribuidor → 
                restaurante → consumidor final. Isso reduz custo de insumos para restaurantes.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">5. E se o supermercado não repassar o desconto?</h4>
              <p className="text-gray-700">
                O consumidor pode <strong>denunciar ao Procon</strong> e órgãos de defesa do consumidor. A lei obriga 
                o repasse integral do benefício fiscal ao preço final.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">6. Produtos importados podem entrar na cesta?</h4>
              <p className="text-gray-700">
                <strong>Improvável</strong>. A cesta básica deve focar em produtos nacionais de consumo popular. 
                Produtos importados premium (azeite italiano, queijo francês) terão alíquota padrão.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">7. Como fiscalizar se o produto é "básico" ou "premium"?</h4>
              <p className="text-gray-700">
                Pela <strong>classificação NCM</strong> (Nomenclatura Comum do Mercosul). Cada NCM terá alíquota específica. 
                Exemplo: NCM 0201.30 (carne bovina segunda) isento, NCM 0201.20 (cortes nobres) 26,5%.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg mt-8 border-l-4 border-green-500">
            <h4 className="font-bold text-gray-800 mb-3">🎯 Conclusão</h4>
            <p className="text-gray-700 leading-relaxed">
              A <strong>Cesta Básica Nacional com alíquota ZERO</strong> é uma das principais conquistas sociais da Reforma Tributária. 
              Com redução de até <strong>27% no preço</strong> de alimentos essenciais, famílias de baixa renda terão mais acesso 
              à alimentação adequada, combatendo a fome e a insegurança alimentar. Use esta calculadora para simular quanto você 
              economizará mensalmente e acompanhe a regulamentação oficial para saber a lista completa de produtos beneficiados.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mt-6">
            <p className="text-gray-700">
              <strong>⚠️ Aviso Legal:</strong> Este artigo tem caráter informativo e educacional. A lista oficial de produtos 
              da Cesta Básica Nacional será definida por lei complementar ainda em tramitação. Os valores de economia são 
              estimativas baseadas na estrutura tributária atual e podem variar. Consulte a legislação vigente para informações precisas.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg mt-6">
            <p className="text-sm text-gray-600">
              <strong>Fonte Legal:</strong> Emenda Constitucional 132/2023 (Reforma Tributária), 
              Lei Complementar em tramitação no Congresso Nacional, Projeto de Regulamentação do IBS/CBS.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default CestaBasicaIVA;

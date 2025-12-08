import React, { useState } from 'react';
import { Calculator, TrendingDown, Package, AlertCircle, CheckCircle, DollarSign, ShoppingCart } from 'lucide-react';

const CalculadoraAliquotaReduzida = () => {
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [mostrarResultado, setMostrarResultado] = useState(false);

  // Categorias com alíquotas reduzidas ou zero
  const categorias = [
    {
      id: 'cesta-basica',
      nome: 'Cesta Básica Nacional',
      aliquota: 0,
      reducao: 100,
      cor: 'green',
      icon: '🛒',
      exemplos: ['Arroz', 'Feijão', 'Açúcar', 'Sal', 'Café', 'Óleo de soja', 'Farinha de trigo', 'Pão francês', 'Leite', 'Manteiga'],
      descricao: 'Produtos essenciais da alimentação básica - alíquota ZERO'
    },
    {
      id: 'saude-medicamentos',
      nome: 'Medicamentos Essenciais',
      aliquota: 10.6,
      reducao: 60,
      cor: 'blue',
      icon: '💊',
      exemplos: ['Antibióticos', 'Analgésicos', 'Anti-hipertensivos', 'Insulina', 'Vacinas', 'Soros', 'Contraceptivos'],
      descricao: 'Medicamentos da lista RENAME - redução de 60%'
    },
    {
      id: 'saude-dispositivos',
      nome: 'Dispositivos Médicos',
      aliquota: 10.6,
      reducao: 60,
      cor: 'cyan',
      icon: '🩺',
      exemplos: ['Cadeira de rodas', 'Fraldas geriátricas', 'Absorventes higiênicos', 'Preservativos', 'Aparelhos auditivos'],
      descricao: 'Dispositivos médicos e produtos de higiene essenciais - redução de 60%'
    },
    {
      id: 'transporte-publico',
      nome: 'Transporte Público Coletivo',
      aliquota: 10.6,
      reducao: 60,
      cor: 'yellow',
      icon: '🚌',
      exemplos: ['Passagem de ônibus urbano', 'Metrô', 'Trem metropolitano', 'VLT', 'Bilhete único'],
      descricao: 'Serviços de transporte coletivo urbano - redução de 60%'
    },
    {
      id: 'educacao',
      nome: 'Educação',
      aliquota: 10.6,
      reducao: 60,
      cor: 'purple',
      icon: '📚',
      exemplos: ['Ensino infantil', 'Ensino fundamental', 'Ensino médio', 'Ensino superior', 'Cursos técnicos', 'Livros didáticos'],
      descricao: 'Serviços educacionais e materiais didáticos - redução de 60%'
    },
    {
      id: 'cultura',
      nome: 'Produções Culturais Nacionais',
      aliquota: 10.6,
      reducao: 60,
      cor: 'pink',
      icon: '🎭',
      exemplos: ['Cinema nacional', 'Teatro', 'Shows nacionais', 'Museus', 'Livros nacionais', 'Música brasileira'],
      descricao: 'Produtos e serviços culturais nacionais - redução de 60%'
    },
    {
      id: 'agropecuaria',
      nome: 'Insumos Agropecuários',
      aliquota: 10.6,
      reducao: 60,
      cor: 'orange',
      icon: '🌾',
      exemplos: ['Sementes', 'Fertilizantes', 'Defensivos agrícolas', 'Ração animal', 'Implementos agrícolas'],
      descricao: 'Produtos para produção agropecuária - redução de 60%'
    },
    {
      id: 'moradia-popular',
      nome: 'Moradia Popular',
      aliquota: 15.9,
      reducao: 40,
      cor: 'indigo',
      icon: '🏠',
      exemplos: ['Imóvel até R$ 200 mil', 'Construção social', 'Minha Casa Minha Vida', 'Materiais de construção básicos'],
      descricao: 'Programas habitacionais de interesse social - redução de 40%'
    },
    {
      id: 'producao-rural',
      nome: 'Produtor Rural Pessoa Física',
      aliquota: 0,
      reducao: 100,
      cor: 'lime',
      icon: '👨‍🌾',
      exemplos: ['Venda direta do produtor', 'Feira livre', 'Hortaliças', 'Frutas', 'Ovos', 'Mel', 'Produtos coloniais'],
      descricao: 'Vendas diretas de produtor rural PF - alíquota ZERO'
    },
    {
      id: 'padrao',
      nome: 'Alíquota Padrão (para comparação)',
      aliquota: 26.5,
      reducao: 0,
      cor: 'gray',
      icon: '📦',
      exemplos: ['Eletrônicos', 'Vestuário', 'Cosméticos', 'Móveis', 'Eletrodomésticos', 'Bebidas', 'Produtos industrializados'],
      descricao: 'Produtos sem benefício fiscal - alíquota cheia'
    }
  ];

  const calcular = () => {
    if (!categoria || !valor || !quantidade) {
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

  const categoriaSelecionada = categorias.find(c => c.id === categoria);
  const valorNumerico = parseFloat(valor);
  const qtd = parseInt(quantidade);
  const valorTotal = valorNumerico * qtd;

  // Cálculos
  const aliquotaPadrao = 0.265; // 26.5%
  const aliquotaReduzida = categoriaSelecionada ? categoriaSelecionada.aliquota / 100 : 0;

  const tributoPadrao = valorTotal * aliquotaPadrao;
  const tributoReduzido = valorTotal * aliquotaReduzida;
  const economia = tributoPadrao - tributoReduzido;
  const economiaPercentual = ((economia / tributoPadrao) * 100);

  const precoFinalPadrao = valorTotal / (1 - aliquotaPadrao);
  const precoFinalReduzido = valorTotal / (1 - aliquotaReduzida);
  const economiaPreco = precoFinalPadrao - precoFinalReduzido;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingDown className="w-12 h-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Calculadora de Alíquota Reduzida e Alíquota Zero
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simule a economia tributária com as alíquotas reduzidas (60% de desconto = 10,6%) e alíquota zero para produtos essenciais na Reforma Tributária
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            Dados do Produto ou Serviço
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Categoria */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria do Produto/Serviço
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Selecione a categoria</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.nome} {cat.aliquota === 0 ? '(ISENTO)' : `(${cat.aliquota}%)`}
                  </option>
                ))}
              </select>
              {categoriaSelecionada && (
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Exemplos:</strong> {categoriaSelecionada.exemplos.slice(0, 5).join(', ')}
                </p>
              )}
            </div>

            {/* Valor Unitário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Unitário (R$)
              </label>
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ex: 100.00"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Quantidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade
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
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calcular Economia Tributária
          </button>
        </div>

        {/* Resultados */}
        {mostrarResultado && categoriaSelecionada && (
          <>
            {/* Card da Categoria Selecionada */}
            <div className={`bg-${categoriaSelecionada.cor}-50 border-l-4 border-${categoriaSelecionada.cor}-500 rounded-xl shadow-lg p-6 mb-8`}>
              <div className="flex items-start gap-4">
                <div className="text-5xl">{categoriaSelecionada.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {categoriaSelecionada.nome}
                  </h3>
                  <p className="text-gray-700 mb-3">{categoriaSelecionada.descricao}</p>
                  <div className="flex flex-wrap gap-2">
                    {categoriaSelecionada.exemplos.map((ex, i) => (
                      <span key={i} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Comparação de Alíquotas */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Alíquota Padrão */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-500">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-gray-600" />
                  Alíquota Padrão (26,5%)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Valor dos Produtos:</span>
                    <span className="font-semibold">{formatarMoeda(valorTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Alíquota IBS/CBS:</span>
                    <span className="font-semibold text-red-600">26,5%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Tributo Embutido:</span>
                    <span className="font-semibold text-red-600">{formatarMoeda(tributoPadrao)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 bg-gray-50 p-3 rounded-lg">
                    <span className="font-bold text-gray-800">Preço Final:</span>
                    <span className="font-bold text-2xl text-gray-600">{formatarMoeda(precoFinalPadrao)}</span>
                  </div>
                </div>
              </div>

              {/* Alíquota Reduzida/Zero */}
              <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${categoriaSelecionada.cor}-500`}>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingDown className={`w-6 h-6 text-${categoriaSelecionada.cor}-600`} />
                  Alíquota {categoriaSelecionada.aliquota === 0 ? 'ZERO' : `Reduzida (${categoriaSelecionada.aliquota}%)`}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Valor dos Produtos:</span>
                    <span className="font-semibold">{formatarMoeda(valorTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Alíquota IBS/CBS:</span>
                    <span className={`font-semibold text-${categoriaSelecionada.cor}-600`}>
                      {formatarPercentual(categoriaSelecionada.aliquota)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Redução:</span>
                    <span className={`font-semibold text-${categoriaSelecionada.cor}-600`}>
                      {categoriaSelecionada.reducao}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Tributo Embutido:</span>
                    <span className={`font-semibold text-${categoriaSelecionada.cor}-600`}>
                      {formatarMoeda(tributoReduzido)}
                    </span>
                  </div>
                  <div className={`flex justify-between items-center pt-2 bg-${categoriaSelecionada.cor}-50 p-3 rounded-lg`}>
                    <span className="font-bold text-gray-800">Preço Final:</span>
                    <span className={`font-bold text-2xl text-${categoriaSelecionada.cor}-600`}>
                      {formatarMoeda(precoFinalReduzido)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Economia Gerada */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg p-6 mb-8 border-l-4 border-green-500">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <DollarSign className="w-7 h-7 text-green-600" />
                Economia Gerada pela Alíquota Reduzida
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-lg shadow">
                  <div className="text-sm text-gray-600 mb-2">Economia em Tributo</div>
                  <div className="text-3xl font-bold text-green-600">{formatarMoeda(economia)}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatarPercentual(economiaPercentual)} de desconto
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow">
                  <div className="text-sm text-gray-600 mb-2">Redução no Preço Final</div>
                  <div className="text-3xl font-bold text-blue-600">{formatarMoeda(economiaPreco)}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatarPercentual((economiaPreco / precoFinalPadrao) * 100)} mais barato
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow">
                  <div className="text-sm text-gray-600 mb-2">Percentual de Redução</div>
                  <div className="text-3xl font-bold text-purple-600">
                    {categoriaSelecionada.reducao}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    De 26,5% para {formatarPercentual(categoriaSelecionada.aliquota)}
                  </div>
                </div>
              </div>

              {/* Explicação */}
              <div className="mt-6 bg-white p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Interpretação:</strong> Com a alíquota {categoriaSelecionada.aliquota === 0 ? 'ZERO' : `reduzida de ${categoriaSelecionada.aliquota}%`}, 
                  você economiza <strong>{formatarMoeda(economia)}</strong> em tributos comparado à alíquota padrão de 26,5%. 
                  Isso se traduz em uma redução de <strong>{formatarMoeda(economiaPreco)}</strong> no preço final do produto/serviço, 
                  tornando-o <strong>{formatarPercentual((economiaPreco / precoFinalPadrao) * 100)}</strong> mais acessível.
                </p>
              </div>
            </div>

            {/* Impacto Anual (se quantidade > 1 ou exemplo mensal) */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-purple-600" />
                Projeção de Economia Anual
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Consumo Mensal</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Gasto mensal (alíquota padrão):</span>
                      <span className="font-semibold">{formatarMoeda(precoFinalPadrao)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Gasto mensal (alíquota reduzida):</span>
                      <span className="font-semibold text-green-600">{formatarMoeda(precoFinalReduzido)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 pt-2 border-t">
                      <span className="font-bold">Economia mensal:</span>
                      <span className="font-bold text-green-600">{formatarMoeda(economiaPreco)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Projeção Anual (12 meses)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Gasto anual (alíquota padrão):</span>
                      <span className="font-semibold">{formatarMoeda(precoFinalPadrao * 12)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Gasto anual (alíquota reduzida):</span>
                      <span className="font-semibold text-green-600">{formatarMoeda(precoFinalReduzido * 12)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 pt-2 border-t">
                      <span className="font-bold">Economia anual:</span>
                      <span className="font-bold text-2xl text-green-600">{formatarMoeda(economiaPreco * 12)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Importantes */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">ℹ️ Informações Importantes</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Alíquota Reduzida (60%):</strong> A alíquota de 10,6% representa 60% de redução sobre a alíquota padrão de 26,5%</li>
                    <li><strong>Alíquota Zero:</strong> Produtos da cesta básica nacional e vendas de produtor rural PF são totalmente isentos</li>
                    <li><strong>Gradualidade:</strong> Benefícios entram em vigor gradualmente entre 2026-2033</li>
                    <li><strong>Lista Oficial:</strong> Produtos beneficiados serão definidos em lei complementar</li>
                    <li><strong>NCM/CEST:</strong> Enquadramento preciso é fundamental para aplicação correta</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Grid de Todas as Categorias */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Todas as Categorias com Benefício Fiscal
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.filter(c => c.id !== 'padrao').map(cat => (
              <div
                key={cat.id}
                className={`bg-${cat.cor}-50 border-2 border-${cat.cor}-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer ${categoria === cat.id ? `ring-2 ring-${cat.cor}-500` : ''}`}
                onClick={() => setCategoria(cat.id)}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-3xl">{cat.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{cat.nome}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      {cat.aliquota === 0 ? (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                          ISENTO
                        </span>
                      ) : (
                        <>
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">
                            {cat.aliquota}%
                          </span>
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                            ↓{cat.reducao}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{cat.descricao}</p>
                <div className="flex flex-wrap gap-1">
                  {cat.exemplos.slice(0, 3).map((ex, i) => (
                    <span key={i} className="text-xs bg-white px-2 py-1 rounded border text-gray-600">
                      {ex}
                    </span>
                  ))}
                  {cat.exemplos.length > 3 && (
                    <span className="text-xs bg-white px-2 py-1 rounded border text-gray-500">
                      +{cat.exemplos.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparação Rápida */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            📊 Tabela Comparativa de Alíquotas
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gradient-to-r from-green-100 to-blue-100">
                <tr>
                  <th className="px-6 py-3 border-b text-left font-semibold text-gray-800">Categoria</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Alíquota Padrão</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Alíquota Beneficiada</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Redução</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Economia (R$ 100)</th>
                </tr>
              </thead>
              <tbody>
                {categorias.filter(c => c.id !== 'padrao').map((cat, index) => (
                  <tr key={cat.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 border-b">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-medium text-gray-800">{cat.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b text-center text-gray-600">26,5%</td>
                    <td className="px-6 py-4 border-b text-center">
                      <span className={`font-bold ${cat.aliquota === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                        {cat.aliquota === 0 ? 'ZERO' : `${cat.aliquota}%`}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b text-center">
                      <span className="px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-full">
                        ↓{cat.reducao}%
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b text-center">
                      <span className="font-bold text-green-600">
                        {formatarMoeda((100 * 0.265) - (100 * cat.aliquota / 100))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Artigo SEO */}
        <article className="bg-white rounded-xl shadow-lg p-8 mt-8 prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Alíquota Reduzida e Alíquota Zero na Reforma Tributária: Guia Completo
          </h2>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-6 mb-8 rounded">
            <p className="text-gray-700 text-lg leading-relaxed">
              A Reforma Tributária (EC 132/2023) prevê <strong>alíquotas reduzidas</strong> e <strong>alíquota zero</strong> 
              para produtos e serviços essenciais, tornando-os mais acessíveis à população. Com redução de até <strong>100%</strong> 
              (isenção total) ou <strong>60%</strong> (alíquota de 10,6%), setores como saúde, educação, alimentação e transporte 
              público serão beneficiados. Entenda como funciona e quem tem direito.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🎯 O Que São Alíquotas Reduzidas?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            No sistema IBS/CBS, a <strong>alíquota padrão</strong> é de <strong>26,5%</strong> (podendo variar conforme aprovação final). 
            Para produtos e serviços essenciais, a Constituição permite <strong>redução de até 60%</strong>, resultando em 
            alíquota de <strong>10,6%</strong>. Alguns produtos ainda têm <strong>alíquota zero</strong> (isenção total).
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-3">🧮 Como Calcular</h4>
            <div className="space-y-2 text-gray-700">
              <p><strong>Alíquota Padrão:</strong> 26,5% (100% da alíquota)</p>
              <p><strong>Redução de 60%:</strong> 26,5% × 0,40 = <strong>10,6%</strong></p>
              <p><strong>Redução de 40%:</strong> 26,5% × 0,60 = <strong>15,9%</strong> (moradia popular)</p>
              <p><strong>Alíquota Zero:</strong> <strong>0%</strong> (isenção total)</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🛒 Cesta Básica Nacional - Alíquota ZERO
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A <strong>Cesta Básica Nacional</strong> terá <strong>alíquota zero</strong> (100% de isenção). 
            A lista oficial será definida por lei complementar, mas prevê-se inclusão de:
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🌾 Grãos e Cereais</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Arroz</li>
                <li>• Feijão</li>
                <li>• Farinha de trigo</li>
                <li>• Farinha de mandioca</li>
                <li>• Macarrão</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🥛 Laticínios e Proteínas</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Leite</li>
                <li>• Manteiga</li>
                <li>• Queijo</li>
                <li>• Ovos</li>
                <li>• Carnes (cortes populares)</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">☕ Essenciais</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Café</li>
                <li>• Açúcar</li>
                <li>• Sal</li>
                <li>• Óleo de soja</li>
                <li>• Pão francês</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
            <p className="text-gray-700">
              <strong>💰 Impacto:</strong> Com alíquota zero, produtos da cesta básica ficam até <strong>26,5% mais baratos</strong> 
              comparado ao sistema atual (que embute ICMS, PIS/COFINS). Exemplo: arroz que custa R$ 30,00 poderia custar ~R$ 22,00.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            💊 Saúde - Redução de 60% (Alíquota 10,6%)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Produtos e serviços de saúde essenciais terão <strong>redução de 60%</strong>, com alíquota final de <strong>10,6%</strong>:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">💊 Medicamentos</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Lista RENAME (Relação Nacional de Medicamentos Essenciais)</li>
                <li>Antibióticos, analgésicos, anti-inflamatórios</li>
                <li>Medicamentos para doenças crônicas (diabetes, hipertensão)</li>
                <li>Insulina, vacinas, soros</li>
                <li>Contraceptivos</li>
              </ul>
            </div>

            <div className="bg-cyan-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">🩺 Dispositivos Médicos</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Cadeira de rodas</li>
                <li>Fraldas geriátricas</li>
                <li>Absorventes higiênicos</li>
                <li>Preservativos</li>
                <li>Aparelhos auditivos</li>
                <li>Próteses e órteses</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
            <p className="text-gray-700">
              <strong>💰 Exemplo:</strong> Medicamento de R$ 100,00 → Com alíquota 10,6% em vez de 26,5% = 
              Economia de <strong>R$ 15,90</strong> (redução de ~16% no preço final).
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            📚 Educação - Redução de 60% (Alíquota 10,6%)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Todos os níveis de educação terão <strong>alíquota reduzida de 10,6%</strong>:
          </p>

          <div className="bg-purple-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-3">🎓 Serviços Beneficiados</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Educação Infantil:</strong> Creches e pré-escola</li>
              <li><strong>Ensino Fundamental e Médio:</strong> Escolas públicas e privadas</li>
              <li><strong>Ensino Superior:</strong> Graduação, pós-graduação, especialização</li>
              <li><strong>Cursos Técnicos:</strong> Formação profissionalizante</li>
              <li><strong>Cursos de Idiomas:</strong> Escolas regulamentadas</li>
              <li><strong>Materiais Didáticos:</strong> Livros escolares, apostilas</li>
            </ul>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded mb-6">
            <p className="text-gray-700">
              <strong>💰 Impacto:</strong> Mensalidade de R$ 1.000 → Economia de até <strong>R$ 159</strong> por mês 
              (ou <strong>R$ 1.908</strong> por ano letivo) comparado à alíquota padrão.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🚌 Transporte Público - Redução de 60% (Alíquota 10,6%)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Serviços de <strong>transporte público coletivo</strong> terão alíquota de 10,6%:
          </p>

          <div className="bg-yellow-50 p-6 rounded-lg mb-6">
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Ônibus urbano</li>
              <li>Metrô e trens metropolitanos</li>
              <li>VLT (Veículo Leve sobre Trilhos)</li>
              <li>BRT (Bus Rapid Transit)</li>
              <li>Bilhete único e passes mensais</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
            <p className="text-gray-700">
              <strong>💰 Exemplo:</strong> Passagem de R$ 5,00 → Redução de até <strong>R$ 0,80</strong> no preço final 
              (economia de ~16%). Em um mês com 44 viagens (ida e volta 22 dias úteis), economia de <strong>R$ 35,20</strong>.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🎭 Cultura Nacional - Redução de 60% (Alíquota 10,6%)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Produções <strong>culturais nacionais</strong> terão alíquota reduzida:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🎬 Audiovisual</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Cinema nacional</li>
                <li>• Séries brasileiras</li>
                <li>• Documentários nacionais</li>
                <li>• Plataformas de streaming (conteúdo nacional)</li>
              </ul>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🎵 Outros Segmentos</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Shows de artistas brasileiros</li>
                <li>• Teatro nacional</li>
                <li>• Livros de autores nacionais</li>
                <li>• Museus e exposições</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🌾 Agropecuária - Redução de 60% (Alíquota 10,6%)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Insumos agropecuários</strong> terão alíquota reduzida para baratear a produção:
          </p>

          <div className="bg-orange-50 p-6 rounded-lg mb-6">
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Sementes e mudas</li>
              <li>Fertilizantes e adubos</li>
              <li>Defensivos agrícolas (agrotóxicos)</li>
              <li>Ração animal</li>
              <li>Implementos agrícolas (tratores, colheitadeiras)</li>
              <li>Medicamentos veterinários</li>
            </ul>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded mb-6">
            <p className="text-gray-700">
              <strong>🎯 Objetivo:</strong> Reduzir custo de produção do agronegócio, evitando repasse de tributos 
              ao preço final dos alimentos. Fertilizante de R$ 1.000 → Economia de <strong>R$ 159</strong>.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🏠 Moradia Popular - Redução de 40% (Alíquota 15,9%)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Programas de <strong>habitação de interesse social</strong> terão <strong>redução de 40%</strong>:
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg mb-6">
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Imóveis até R$ 200 mil (para fins residenciais)</li>
              <li>Programas como Minha Casa Minha Vida</li>
              <li>Construção de habitação popular</li>
              <li>Materiais de construção básicos para este fim</li>
            </ul>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded mb-6">
            <p className="text-gray-700">
              <strong>💰 Exemplo:</strong> Imóvel de R$ 150.000 → Economia de até <strong>R$ 15.900</strong> em tributos, 
              tornando-o mais acessível para famílias de baixa renda.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            👨‍🌾 Produtor Rural PF - Alíquota ZERO
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Vendas <strong>diretas do produtor rural pessoa física</strong> para consumidor final terão <strong>alíquota zero</strong>:
          </p>

          <div className="bg-lime-50 p-6 rounded-lg mb-6">
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Feira livre (produtor vendendo diretamente)</li>
              <li>Hortaliças, frutas, verduras</li>
              <li>Ovos caipiras</li>
              <li>Mel e derivados</li>
              <li>Produtos coloniais (queijo artesanal, doces caseiros)</li>
              <li>Flores e plantas ornamentais</li>
            </ul>
          </div>

          <div className="bg-lime-50 border-l-4 border-lime-500 p-4 rounded mb-6">
            <p className="text-gray-700">
              <strong>⚠️ Importante:</strong> O benefício vale APENAS para pessoa física (produtor rural individual). 
              Vendas de pessoa jurídica (cooperativa, agroindústria) seguem alíquota padrão ou reduzida conforme caso.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            📊 Tabela Resumo: Alíquotas e Economia
          </h3>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gradient-to-r from-green-100 to-blue-100">
                <tr>
                  <th className="px-6 py-3 border-b text-left font-semibold text-gray-800">Categoria</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Alíquota Padrão</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Alíquota Beneficiada</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Redução</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Economia (R$ 100)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">🛒 Cesta Básica</td>
                  <td className="px-6 py-4 border-b text-center text-gray-700">26,5%</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">0%</td>
                  <td className="px-6 py-4 border-b text-center text-green-700">100%</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">R$ 26,50</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">💊 Medicamentos</td>
                  <td className="px-6 py-4 border-b text-center text-gray-700">26,5%</td>
                  <td className="px-6 py-4 border-b text-center text-blue-600 font-bold">10,6%</td>
                  <td className="px-6 py-4 border-b text-center text-blue-700">60%</td>
                  <td className="px-6 py-4 border-b text-center text-blue-600 font-bold">R$ 15,90</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">📚 Educação</td>
                  <td className="px-6 py-4 border-b text-center text-gray-700">26,5%</td>
                  <td className="px-6 py-4 border-b text-center text-purple-600 font-bold">10,6%</td>
                  <td className="px-6 py-4 border-b text-center text-purple-700">60%</td>
                  <td className="px-6 py-4 border-b text-center text-purple-600 font-bold">R$ 15,90</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">🚌 Transporte Público</td>
                  <td className="px-6 py-4 border-b text-center text-gray-700">26,5%</td>
                  <td className="px-6 py-4 border-b text-center text-yellow-600 font-bold">10,6%</td>
                  <td className="px-6 py-4 border-b text-center text-yellow-700">60%</td>
                  <td className="px-6 py-4 border-b text-center text-yellow-600 font-bold">R$ 15,90</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">🌾 Insumos Agrícolas</td>
                  <td className="px-6 py-4 border-b text-center text-gray-700">26,5%</td>
                  <td className="px-6 py-4 border-b text-center text-orange-600 font-bold">10,6%</td>
                  <td className="px-6 py-4 border-b text-center text-orange-700">60%</td>
                  <td className="px-6 py-4 border-b text-center text-orange-600 font-bold">R$ 15,90</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">🏠 Moradia Popular</td>
                  <td className="px-6 py-4 border-b text-center text-gray-700">26,5%</td>
                  <td className="px-6 py-4 border-b text-center text-indigo-600 font-bold">15,9%</td>
                  <td className="px-6 py-4 border-b text-center text-indigo-700">40%</td>
                  <td className="px-6 py-4 border-b text-center text-indigo-600 font-bold">R$ 10,60</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">👨‍🌾 Produtor Rural PF</td>
                  <td className="px-6 py-4 text-center text-gray-700">26,5%</td>
                  <td className="px-6 py-4 text-center text-green-600 font-bold">0%</td>
                  <td className="px-6 py-4 text-center text-green-700">100%</td>
                  <td className="px-6 py-4 text-center text-green-600 font-bold">R$ 26,50</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            ⚖️ Critérios para Enquadramento
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Para ter direito à alíquota reduzida ou zero, produtos e serviços devem atender critérios específicos:
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-3">📋 Requisitos Gerais</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>NCM/CEST correto:</strong> Produto deve estar na lista oficial por código NCM/CEST</li>
              <li><strong>Finalidade essencial:</strong> Uso deve ser comprovadamente essencial (não supérfluo)</li>
              <li><strong>Destinação:</strong> Vendas para consumidor final ou cadeia produtiva beneficiada</li>
              <li><strong>Comprovação documental:</strong> Notas fiscais e registros que comprovem enquadramento</li>
              <li><strong>Regularidade fiscal:</strong> Contribuinte deve estar regular com obrigações tributárias</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
            <p className="text-gray-700">
              <strong>⚠️ Atenção:</strong> Produtos importados, premium ou de luxo podem não se enquadrar mesmo 
              estando na categoria beneficiada. Exemplo: medicamento de marca pode ter alíquota cheia enquanto 
              genérico tem redução.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            📅 Cronograma de Implementação
          </h3>
          <div className="bg-purple-50 p-6 rounded-lg mb-6">
            <div className="space-y-3 text-gray-700">
              <p><strong>2026:</strong> Período de teste (IBS 1% + CBS 0.9%) - Benefícios ainda não aplicados</p>
              <p><strong>2027:</strong> Início gradual (8.8% alíquota padrão) - Reduções proporcionais começam</p>
              <p><strong>2028-2032:</strong> Transição progressiva - Alíquotas reduzidas aumentam gradualmente</p>
              <p><strong>2033:</strong> Sistema completo (26.5% padrão, 10.6% reduzida, 0% zero) - <strong>Benefícios plenos</strong></p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            💡 Como Empresas Devem Se Preparar
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">✅ Para Quem Vende Produtos Beneficiados</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                <li>Verificar se seus produtos estão na lista oficial (NCM)</li>
                <li>Preparar sistemas fiscais para aplicar alíquotas diferenciadas</li>
                <li>Treinar equipe sobre novas regras de tributação</li>
                <li>Comunicar consumidores sobre redução de preços</li>
                <li>Garantir precificação correta (repassar benefício)</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">✅ Para Consumidores</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                <li>Priorizar compra de produtos da cesta básica (isentos)</li>
                <li>Verificar se estabelecimento está repassando benefício</li>
                <li>Exigir nota fiscal para comprovar alíquota aplicada</li>
                <li>Denunciar abusos (produtos beneficiados com preço cheio)</li>
                <li>Acompanhar lista oficial de produtos beneficiados</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            ❓ Perguntas Frequentes (FAQ)
          </h3>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">1. Todos os medicamentos terão alíquota reduzida?</h4>
              <p className="text-gray-700">
                Não. Apenas medicamentos da <strong>lista RENAME</strong> (Relação Nacional de Medicamentos Essenciais) 
                terão redução de 60%. Medicamentos de marca premium, importados ou não essenciais podem ter alíquota padrão.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">2. Carne está na cesta básica?</h4>
              <p className="text-gray-700">
                Depende. A lista oficial ainda está em definição, mas espera-se que <strong>cortes populares</strong> 
                (frango, carne bovina de segunda) sejam incluídos. Cortes nobres (picanha, filé mignon) provavelmente terão alíquota padrão.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">3. Escola particular terá alíquota reduzida?</h4>
              <p className="text-gray-700">
                <strong>Sim</strong>, todos os níveis de educação (pública e privada) terão alíquota de 10,6%. 
                Isso inclui escolas infantis, ensino fundamental, médio, superior e cursos técnicos.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">4. Uber e táxi têm alíquota reduzida?</h4>
              <p className="text-gray-700">
                <strong>Não</strong>. A redução vale apenas para <strong>transporte público coletivo</strong> 
                (ônibus, metrô, trem). Uber, táxi e transporte individual seguem alíquota padrão de 26,5%.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">5. Como saber se meu produto tem direito?</h4>
              <p className="text-gray-700">
                Consulte o <strong>código NCM</strong> do seu produto na lista oficial que será publicada pela 
                Receita Federal e Comitê Gestor do IBS. Cada NCM terá alíquota específica (padrão, reduzida ou zero).
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">6. E se o estabelecimento não repassar o benefício?</h4>
              <p className="text-gray-700">
                O consumidor pode <strong>denunciar</strong> ao Procon e órgãos de defesa do consumidor. 
                A lei obriga o repasse do benefício fiscal (redução deve aparecer no preço final).
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">7. Alíquota reduzida vale para serviços também?</h4>
              <p className="text-gray-700">
                <strong>Sim</strong>. Educação, transporte público, saúde (consultas, exames) e cultura são 
                <strong>serviços</strong> com alíquota reduzida. O IBS/CBS unifica tributação de bens e serviços.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mt-8 border-l-4 border-green-500">
            <h4 className="font-bold text-gray-800 mb-3">🎯 Conclusão</h4>
            <p className="text-gray-700 leading-relaxed">
              As <strong>alíquotas reduzidas e alíquota zero</strong> são instrumentos poderosos para tornar 
              produtos e serviços essenciais mais acessíveis à população. Com reduções de até <strong>100%</strong> 
              (cesta básica) e <strong>60%</strong> (saúde, educação), espera-se impacto positivo no poder de compra, 
              especialmente das famílias de baixa renda. Acompanhe a regulamentação oficial e utilize esta calculadora 
              para simular a economia no seu caso específico.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mt-6">
            <p className="text-gray-700">
              <strong>⚠️ Aviso Legal:</strong> Este artigo tem caráter informativo e educacional. As listas oficiais 
              de produtos e serviços beneficiados com alíquota reduzida ou zero serão definidas por lei complementar 
              e regulamentação do Comitê Gestor do IBS. Consulte sempre um contador para análise precisa do seu caso.
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

export default CalculadoraAliquotaReduzida;

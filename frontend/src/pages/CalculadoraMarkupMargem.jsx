import React, { useState } from 'react';

function CalculadoraMarkupMargem() {
  const [formData, setFormData] = useState({
    custoUnitario: '',
    percentualImpostos: '',
    percentualDespesas: '',
    percentualLucro: '',
    metodoCalculo: 'markup' // 'markup' ou 'margem'
  });

  const [resultado, setResultado] = useState(null);
  const [erros, setErros] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro do campo ao digitar
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.custoUnitario || parseFloat(formData.custoUnitario) <= 0) {
      novosErros.custoUnitario = 'Informe o custo unitário do produto';
    }

    if (!formData.percentualImpostos || parseFloat(formData.percentualImpostos) < 0) {
      novosErros.percentualImpostos = 'Informe o percentual de impostos';
    }

    if (!formData.percentualDespesas || parseFloat(formData.percentualDespesas) < 0) {
      novosErros.percentualDespesas = 'Informe o percentual de despesas fixas';
    }

    if (!formData.percentualLucro || parseFloat(formData.percentualLucro) <= 0) {
      novosErros.percentualLucro = 'Informe o percentual de lucro desejado';
    }

    // Validar soma dos percentuais na margem
    if (formData.metodoCalculo === 'margem') {
      const soma = parseFloat(formData.percentualImpostos || 0) + 
                   parseFloat(formData.percentualDespesas || 0) + 
                   parseFloat(formData.percentualLucro || 0);
      if (soma >= 100) {
        novosErros.percentualLucro = 'A soma de impostos + despesas + lucro deve ser menor que 100%';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const calcular = () => {
    if (!validarFormulario()) {
      return;
    }

    const custo = parseFloat(formData.custoUnitario);
    const impostos = parseFloat(formData.percentualImpostos);
    const despesas = parseFloat(formData.percentualDespesas);
    const lucro = parseFloat(formData.percentualLucro);

    let precoVenda, valorImpostos, valorDespesas, valorLucro, margemReal, markupReal;

    if (formData.metodoCalculo === 'markup') {
      // MÉTODO MARKUP: Soma percentuais sobre o custo
      // Preço = Custo × (1 + (Impostos% + Despesas% + Lucro%) / 100)
      const markupTotal = impostos + despesas + lucro;
      precoVenda = custo * (1 + markupTotal / 100);
      
      valorImpostos = custo * (impostos / 100);
      valorDespesas = custo * (despesas / 100);
      valorLucro = custo * (lucro / 100);
      
      markupReal = markupTotal;
      margemReal = (valorLucro / precoVenda) * 100;

    } else {
      // MÉTODO MARGEM: Percentuais calculados sobre o preço de venda
      // Preço = Custo / (1 - (Impostos% + Despesas% + Lucro%) / 100)
      const margemTotal = impostos + despesas + lucro;
      precoVenda = custo / (1 - margemTotal / 100);
      
      valorImpostos = precoVenda * (impostos / 100);
      valorDespesas = precoVenda * (despesas / 100);
      valorLucro = precoVenda * (lucro / 100);
      
      margemReal = margemTotal;
      markupReal = ((precoVenda - custo) / custo) * 100;
    }

    // Cálculo alternativo (para comparação)
    let precoVendaAlternativo, metodoAlternativo, valorLucroAlternativo;
    
    if (formData.metodoCalculo === 'markup') {
      // Se escolheu markup, mostrar como seria por margem
      metodoAlternativo = 'margem';
      const margemTotal = impostos + despesas + lucro;
      precoVendaAlternativo = custo / (1 - margemTotal / 100);
      valorLucroAlternativo = precoVendaAlternativo * (lucro / 100);
    } else {
      // Se escolheu margem, mostrar como seria por markup
      metodoAlternativo = 'markup';
      const markupTotal = impostos + despesas + lucro;
      precoVendaAlternativo = custo * (1 + markupTotal / 100);
      valorLucroAlternativo = custo * (lucro / 100);
    }

    const diferencaPreco = precoVenda - precoVendaAlternativo;
    const diferencaPercentual = (diferencaPreco / precoVendaAlternativo) * 100;

    setResultado({
      custo,
      precoVenda,
      valorImpostos,
      valorDespesas,
      valorLucro,
      margemReal,
      markupReal,
      metodoEscolhido: formData.metodoCalculo,
      // Comparação
      precoVendaAlternativo,
      metodoAlternativo,
      valorLucroAlternativo,
      diferencaPreco,
      diferencaPercentual
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            💰 Calculadora de Markup vs Margem
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Entenda a diferença entre <strong>markup</strong> e <strong>margem de lucro</strong> e 
            calcule o preço de venda correto dos seus produtos. Evite prejuízos!
          </p>
        </div>

        {/* Card de Explicação Rápida */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-l-4 border-purple-500">
          <h2 className="text-xl font-bold text-purple-800 mb-3 flex items-center gap-2">
            🤔 Qual a diferença entre Markup e Margem?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-bold text-purple-700 mb-2">📊 Markup</h3>
              <p className="text-sm text-gray-700">
                Percentual que você <strong>adiciona</strong> ao custo do produto para formar o preço de venda.
              </p>
              <p className="text-xs text-purple-600 mt-2 font-mono">
                Preço = Custo × (1 + Markup%)
              </p>
            </div>
            <div className="bg-pink-50 rounded-lg p-4">
              <h3 className="font-bold text-pink-700 mb-2">📈 Margem</h3>
              <p className="text-sm text-gray-700">
                Percentual do <strong>preço de venda</strong> que representa o lucro.
              </p>
              <p className="text-xs text-pink-600 mt-2 font-mono">
                Margem% = (Lucro / Preço) × 100
              </p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            📝 Dados do Produto
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Custo Unitário */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💵 Custo Unitário do Produto (R$)
              </label>
              <input
                type="number"
                name="custoUnitario"
                value={formData.custoUnitario}
                onChange={handleChange}
                placeholder="Ex: 50.00"
                step="0.01"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                  erros.custoUnitario ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {erros.custoUnitario && (
                <p className="text-red-500 text-sm mt-1">{erros.custoUnitario}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Quanto você paga para produzir ou comprar 1 unidade
              </p>
            </div>

            {/* Percentual de Impostos */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🏛️ Impostos sobre a Venda (%)
              </label>
              <input
                type="number"
                name="percentualImpostos"
                value={formData.percentualImpostos}
                onChange={handleChange}
                placeholder="Ex: 12.5"
                step="0.1"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                  erros.percentualImpostos ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {erros.percentualImpostos && (
                <p className="text-red-500 text-sm mt-1">{erros.percentualImpostos}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                ICMS, PIS, COFINS, ISS, etc. (% sobre o preço de venda)
              </p>
            </div>

            {/* Percentual de Despesas Fixas */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🏢 Despesas Fixas e Variáveis (%)
              </label>
              <input
                type="number"
                name="percentualDespesas"
                value={formData.percentualDespesas}
                onChange={handleChange}
                placeholder="Ex: 15.0"
                step="0.1"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                  erros.percentualDespesas ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {erros.percentualDespesas && (
                <p className="text-red-500 text-sm mt-1">{erros.percentualDespesas}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Aluguel, folha de pagamento, comissões, etc. (% sobre o preço de venda)
              </p>
            </div>

            {/* Percentual de Lucro Desejado */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎯 Lucro Desejado (%)
              </label>
              <input
                type="number"
                name="percentualLucro"
                value={formData.percentualLucro}
                onChange={handleChange}
                placeholder="Ex: 20.0"
                step="0.1"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                  erros.percentualLucro ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {erros.percentualLucro && (
                <p className="text-red-500 text-sm mt-1">{erros.percentualLucro}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Qual percentual de lucro você quer obter?
              </p>
            </div>
          </div>

          {/* Toggle Método de Cálculo */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              🔄 Escolha o Método de Cálculo
            </h3>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => setFormData(prev => ({ ...prev, metodoCalculo: 'markup' }))}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                  formData.metodoCalculo === 'markup'
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-purple-600 border-2 border-purple-300 hover:border-purple-500'
                }`}
              >
                📊 Calcular por <span className="block text-sm font-normal">MARKUP</span>
              </button>
              <button
                onClick={() => setFormData(prev => ({ ...prev, metodoCalculo: 'margem' }))}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                  formData.metodoCalculo === 'margem'
                    ? 'bg-pink-600 text-white shadow-lg scale-105'
                    : 'bg-white text-pink-600 border-2 border-pink-300 hover:border-pink-500'
                }`}
              >
                📈 Calcular por <span className="block text-sm font-normal">MARGEM</span>
              </button>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              {formData.metodoCalculo === 'markup' ? (
                <>
                  <strong>Markup:</strong> Percentuais serão somados ao custo do produto
                </>
              ) : (
                <>
                  <strong>Margem:</strong> Percentuais serão calculados sobre o preço de venda
                </>
              )}
            </p>
          </div>

          {/* Botão Calcular */}
          <button
            onClick={calcular}
            className="w-full mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl text-lg font-bold hover:from-purple-700 hover:to-pink-700 transition shadow-lg hover:shadow-xl"
          >
            🚀 Calcular Preço de Venda
          </button>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="space-y-6">
            {/* Card Resultado Principal */}
            <div className={`bg-gradient-to-br ${
              resultado.metodoEscolhido === 'markup' 
                ? 'from-purple-600 to-purple-700' 
                : 'from-pink-600 to-pink-700'
            } rounded-2xl shadow-2xl p-8 text-white`}>
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-90">
                  💰 Preço de Venda Ideal ({resultado.metodoEscolhido === 'markup' ? 'Markup' : 'Margem'})
                </p>
                <p className="text-5xl md:text-6xl font-bold mb-2">
                  R$ {resultado.precoVenda.toFixed(2)}
                </p>
                <p className="text-sm opacity-75">
                  Custo: R$ {resultado.custo.toFixed(2)} • Lucro: R$ {resultado.valorLucro.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Composição do Preço */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                🧮 Composição do Preço de Venda
              </h3>
              
              <div className="space-y-4">
                {/* Barra Visual */}
                <div className="h-12 bg-gray-200 rounded-xl overflow-hidden flex">
                  <div 
                    className="bg-blue-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${(resultado.custo / resultado.precoVenda) * 100}%` }}
                  >
                    Custo
                  </div>
                  <div 
                    className="bg-orange-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${(resultado.valorImpostos / resultado.precoVenda) * 100}%` }}
                  >
                    Impostos
                  </div>
                  <div 
                    className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${(resultado.valorDespesas / resultado.precoVenda) * 100}%` }}
                  >
                    Despesas
                  </div>
                  <div 
                    className="bg-green-600 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${(resultado.valorLucro / resultado.precoVenda) * 100}%` }}
                  >
                    Lucro
                  </div>
                </div>

                {/* Detalhamento */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-blue-700 font-semibold">💼 Custo do Produto</p>
                    <p className="text-2xl font-bold text-blue-800">R$ {resultado.custo.toFixed(2)}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {((resultado.custo / resultado.precoVenda) * 100).toFixed(1)}% do preço
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                    <p className="text-sm text-orange-700 font-semibold">🏛️ Impostos</p>
                    <p className="text-2xl font-bold text-orange-800">R$ {resultado.valorImpostos.toFixed(2)}</p>
                    <p className="text-xs text-orange-600 mt-1">
                      {((resultado.valorImpostos / resultado.precoVenda) * 100).toFixed(1)}% do preço
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                    <p className="text-sm text-red-700 font-semibold">🏢 Despesas Fixas</p>
                    <p className="text-2xl font-bold text-red-800">R$ {resultado.valorDespesas.toFixed(2)}</p>
                    <p className="text-xs text-red-600 mt-1">
                      {((resultado.valorDespesas / resultado.precoVenda) * 100).toFixed(1)}% do preço
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                    <p className="text-sm text-green-700 font-semibold">💰 Lucro Líquido</p>
                    <p className="text-2xl font-bold text-green-800">R$ {resultado.valorLucro.toFixed(2)}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {((resultado.valorLucro / resultado.precoVenda) * 100).toFixed(1)}% do preço
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Markup vs Margem Real */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                📊 Markup vs Margem (Resultantes)
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6 text-center">
                  <p className="text-purple-700 font-semibold mb-2">📊 Markup Real</p>
                  <p className="text-4xl font-bold text-purple-900">{resultado.markupReal.toFixed(1)}%</p>
                  <p className="text-sm text-purple-700 mt-3">
                    Percentual adicionado ao custo
                  </p>
                  <p className="text-xs text-purple-600 mt-2 font-mono">
                    R$ {resultado.custo.toFixed(2)} × {(1 + resultado.markupReal / 100).toFixed(2)} = R$ {resultado.precoVenda.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl p-6 text-center">
                  <p className="text-pink-700 font-semibold mb-2">📈 Margem Real</p>
                  <p className="text-4xl font-bold text-pink-900">{resultado.margemReal.toFixed(1)}%</p>
                  <p className="text-sm text-pink-700 mt-3">
                    Percentual de lucro no preço
                  </p>
                  <p className="text-xs text-pink-600 mt-2 font-mono">
                    R$ {resultado.valorLucro.toFixed(2)} ÷ R$ {resultado.precoVenda.toFixed(2)} = {resultado.margemReal.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Comparação Markup vs Margem */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl shadow-xl p-6 md:p-8 border-2 border-yellow-400">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                ⚠️ Atenção: Veja a Diferença entre os Métodos!
              </h3>
              <p className="text-gray-700 mb-6">
                Se você tivesse calculado usando <strong>{resultado.metodoAlternativo === 'markup' ? 'Markup' : 'Margem'}</strong> 
                {' '}ao invés de <strong>{resultado.metodoEscolhido === 'markup' ? 'Markup' : 'Margem'}</strong>:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 shadow">
                  <p className="text-sm text-gray-600 mb-1">
                    {resultado.metodoEscolhido === 'markup' ? '✅ Seu cálculo (Markup)' : '❌ Cálculo por Markup'}
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    R$ {resultado.metodoEscolhido === 'markup' ? resultado.precoVenda.toFixed(2) : resultado.precoVendaAlternativo.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Lucro: R$ {resultado.metodoEscolhido === 'markup' ? resultado.valorLucro.toFixed(2) : resultado.valorLucroAlternativo.toFixed(2)}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow">
                  <p className="text-sm text-gray-600 mb-1">
                    {resultado.metodoEscolhido === 'margem' ? '✅ Seu cálculo (Margem)' : '❌ Cálculo por Margem'}
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    R$ {resultado.metodoEscolhido === 'margem' ? resultado.precoVenda.toFixed(2) : resultado.precoVendaAlternativo.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Lucro: R$ {resultado.metodoEscolhido === 'margem' ? resultado.valorLucro.toFixed(2) : resultado.valorLucroAlternativo.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-red-100 rounded-xl p-5 border-2 border-red-400">
                <p className="text-red-800 font-bold text-center text-lg">
                  {Math.abs(resultado.diferencaPreco) >= 0.01 ? (
                    <>
                      🚨 Diferença: R$ {Math.abs(resultado.diferencaPreco).toFixed(2)} 
                      {' '}({Math.abs(resultado.diferencaPercentual).toFixed(1)}%)
                    </>
                  ) : (
                    '✅ Neste caso, os métodos resultam no mesmo preço'
                  )}
                </p>
                {Math.abs(resultado.diferencaPreco) >= 0.01 && (
                  <p className="text-sm text-red-700 text-center mt-2">
                    Usar o método errado pode fazer você {resultado.diferencaPreco > 0 ? 'perder vendas' : 'ter prejuízo'}!
                  </p>
                )}
              </div>
            </div>

            {/* Botão Nova Simulação */}
            <button
              onClick={() => {
                setResultado(null);
                setFormData({
                  custoUnitario: '',
                  percentualImpostos: '',
                  percentualDespesas: '',
                  percentualLucro: '',
                  metodoCalculo: 'markup'
                });
              }}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 px-8 rounded-xl text-lg font-bold hover:from-gray-700 hover:to-gray-800 transition shadow-lg"
            >
              🔄 Nova Simulação
            </button>
          </div>
        )}
      </div>

      {/* ========== ARTIGO SEO ========== */}
      <article className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 prose prose-lg max-w-none mt-8">
        
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          📚 Markup vs Margem de Lucro: Guia Completo 2025
        </h2>

        {/* Introdução */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            Uma das maiores causas de <strong>prejuízo empresarial</strong> no Brasil é a confusão entre 
            <strong> markup</strong> e <strong>margem de lucro</strong>. Muitos empresários acreditam que 
            são a mesma coisa, mas aplicar o conceito errado pode significar vender com prejuízo sem nem perceber.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Neste guia completo de 2025, você vai entender de uma vez por todas a diferença entre esses dois 
            conceitos fundamentais de precificação, aprender quando usar cada um, e evitar os erros que podem 
            levar seu negócio à falência.
          </p>
        </section>

        {/* O Que São */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🤔 O Que São Markup e Margem de Lucro?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-300">
              <h4 className="text-xl font-bold text-purple-800 mb-3">📊 Markup</h4>
              <p className="text-gray-700 mb-3">
                <strong>Markup</strong> é o <strong>índice multiplicador</strong> aplicado ao custo do produto 
                para formar o preço de venda. Representa quanto você precisa <strong>adicionar</strong> ao custo 
                para cobrir todas as despesas e ainda ter lucro.
              </p>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-mono text-purple-700 mb-2">
                  <strong>Fórmula:</strong>
                </p>
                <p className="text-sm font-mono text-purple-900">
                  Preço = Custo × (1 + Markup%)
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Exemplo: Custo R$ 100 + Markup 50% = R$ 150
                </p>
              </div>
            </div>

            <div className="bg-pink-50 rounded-xl p-6 border-2 border-pink-300">
              <h4 className="text-xl font-bold text-pink-800 mb-3">📈 Margem de Lucro</h4>
              <p className="text-gray-700 mb-3">
                <strong>Margem</strong> é o <strong>percentual do preço de venda</strong> que representa o lucro. 
                Mostra quanto você <strong>efetivamente lucra</strong> em relação ao que vende.
              </p>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-mono text-pink-700 mb-2">
                  <strong>Fórmula:</strong>
                </p>
                <p className="text-sm font-mono text-pink-900">
                  Margem% = (Lucro / Preço de Venda) × 100
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Exemplo: Lucro R$ 50 / Preço R$ 150 = 33,3%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-500 my-6">
            <h4 className="font-bold text-yellow-800 mb-2">⚠️ Atenção Crítica:</h4>
            <p className="text-sm text-gray-700">
              <strong>50% de markup NÃO é o mesmo que 50% de margem!</strong> Markup de 50% resulta em 
              margem de apenas 33,3%. Essa confusão é responsável por inúmeras falências no Brasil.
            </p>
          </div>
        </section>

        {/* Como Calcular */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📐 Como Calcular Markup e Margem em 2025
          </h3>

          <h4 className="text-xl font-bold text-purple-800 mb-3">1️⃣ Cálculo por Markup</h4>
          <p className="text-gray-700 mb-3">
            Use quando você quer <strong>adicionar percentuais ao custo</strong>:
          </p>

          <div className="bg-white rounded-xl p-5 border-2 border-gray-200 mb-6">
            <div className="space-y-2 text-sm">
              <p className="font-mono text-gray-800">
                <strong>Passo 1:</strong> Some todos os percentuais: Impostos + Despesas + Lucro desejado
              </p>
              <p className="font-mono text-gray-800">
                <strong>Passo 2:</strong> Divida por 100 e some 1
              </p>
              <p className="font-mono text-gray-800">
                <strong>Passo 3:</strong> Multiplique pelo custo unitário
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 mt-4">
              <p className="text-sm font-semibold text-purple-800 mb-2">Exemplo Prático:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Custo: R$ 100,00</li>
                <li>• Impostos: 12%</li>
                <li>• Despesas: 15%</li>
                <li>• Lucro desejado: 20%</li>
                <li>• <strong>Markup Total: 47%</strong></li>
                <li>• <strong>Preço: R$ 100 × 1,47 = R$ 147,00</strong></li>
              </ul>
            </div>
          </div>

          <h4 className="text-xl font-bold text-pink-800 mb-3">2️⃣ Cálculo por Margem</h4>
          <p className="text-gray-700 mb-3">
            Use quando você quer que os percentuais <strong>representem o preço final</strong>:
          </p>

          <div className="bg-white rounded-xl p-5 border-2 border-gray-200 mb-6">
            <div className="space-y-2 text-sm">
              <p className="font-mono text-gray-800">
                <strong>Passo 1:</strong> Some todos os percentuais: Impostos + Despesas + Lucro desejado
              </p>
              <p className="font-mono text-gray-800">
                <strong>Passo 2:</strong> Divida por 100 e subtraia de 1
              </p>
              <p className="font-mono text-gray-800">
                <strong>Passo 3:</strong> Divida o custo por esse resultado
              </p>
            </div>
            <div className="bg-pink-50 rounded-lg p-4 mt-4">
              <p className="text-sm font-semibold text-pink-800 mb-2">Exemplo Prático:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Custo: R$ 100,00</li>
                <li>• Impostos: 12%</li>
                <li>• Despesas: 15%</li>
                <li>• Lucro desejado: 20%</li>
                <li>• <strong>Margem Total: 47%</strong></li>
                <li>• <strong>Preço: R$ 100 ÷ (1 - 0,47) = R$ 188,68</strong></li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl p-6 border-2 border-red-300">
            <h4 className="font-bold text-red-800 mb-2 text-lg">🚨 Compare os Resultados:</h4>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Markup 47%</p>
                <p className="text-2xl font-bold text-purple-700">R$ 147,00</p>
                <p className="text-xs text-gray-500 mt-1">Lucro real: R$ 20,00 (13,6%)</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Margem 47%</p>
                <p className="text-2xl font-bold text-pink-700">R$ 188,68</p>
                <p className="text-xs text-gray-500 mt-1">Lucro real: R$ 37,74 (20%)</p>
              </div>
            </div>
            <p className="text-sm text-red-800 font-semibold mt-3 text-center">
              ⚠️ Diferença de R$ 41,68 no preço! Escolher o método errado pode significar prejuízo.
            </p>
          </div>
        </section>

        {/* Erros Comuns */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ❌ 5 Erros Fatais ao Calcular Preços
          </h3>

          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">1. Confundir markup com margem</h4>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Erro:</strong> "Quero 30% de lucro, então vou adicionar 30% ao custo."<br/>
                <strong>Resultado:</strong> Você terá apenas 23% de margem real, não 30%.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">2. Esquecer de incluir todos os custos</h4>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Erro:</strong> Considerar apenas o custo de compra, esquecendo frete, embalagem, perdas.<br/>
                <strong>Resultado:</strong> Preço parece alto, mas o lucro real é mínimo ou negativo.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">3. Usar percentuais de terceiros sem adaptar</h4>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Erro:</strong> Copiar margens de concorrentes ou tabelas genéricas da internet.<br/>
                <strong>Resultado:</strong> Cada negócio tem custos únicos. O que funciona para um pode quebrar outro.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">4. Não revisar periodicamente</h4>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Erro:</strong> Definir preços uma vez e nunca mais recalcular.<br/>
                <strong>Resultado:</strong> Inflação, mudanças de impostos e custos corroem a margem silenciosamente.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">5. Precificar "no olho" ou pela concorrência</h4>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Erro:</strong> "Vou cobrar R$ 50 porque é o preço do mercado."<br/>
                <strong>Resultado:</strong> Você pode estar vendendo abaixo do custo e tendo prejuízo em cada venda.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ❓ Perguntas Frequentes sobre Markup e Margem
          </h3>

          <div className="space-y-4">
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Qual é melhor: markup ou margem?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Não existe melhor ou pior, são <strong>conceitos diferentes para situações diferentes</strong>. 
                Use <strong>markup</strong> quando quiser adicionar percentuais ao custo (mais simples). 
                Use <strong>margem</strong> quando quiser garantir que um percentual específico do preço final 
                seja lucro (mais preciso).
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Como converter markup em margem?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                <strong>Fórmula:</strong> Margem% = (Markup% ÷ (1 + Markup%)) × 100<br/>
                <strong>Exemplo:</strong> Markup de 50% = Margem de 33,3%<br/>
                Cálculo: 0,50 ÷ 1,50 = 0,333 = 33,3%
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Como converter margem em markup?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                <strong>Fórmula:</strong> Markup% = (Margem% ÷ (1 - Margem%)) × 100<br/>
                <strong>Exemplo:</strong> Margem de 33,3% = Markup de 50%<br/>
                Cálculo: 0,333 ÷ (1 - 0,333) = 0,333 ÷ 0,667 = 0,50 = 50%
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Qual a margem ideal para o meu negócio?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Depende do setor e da operação. <strong>Varejo:</strong> 20-40% de margem bruta. 
                <strong>Serviços:</strong> 40-70%. <strong>Indústria:</strong> 30-50%. 
                <strong>E-commerce:</strong> 25-45%. Mas o mais importante é que sua margem cubra 
                <strong>todos os custos fixos e variáveis</strong> e deixe lucro suficiente para crescer.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Posso dar desconto sem perder lucro?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Sim, mas com cuidado. Se sua margem é 30% e você dá 10% de desconto, sua margem cai para 
                aproximadamente 22%. Sempre calcule a <strong>margem após o desconto</strong> para garantir 
                que ainda cobre todos os custos e mantém lucro.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Como calcular markup divisor?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                O <strong>markup divisor</strong> é outra forma de calcular o preço. Fórmula:<br/>
                <strong>Divisor = 1 - (% Impostos + % Despesas + % Lucro) / 100</strong><br/>
                <strong>Preço = Custo ÷ Divisor</strong><br/>
                É matematicamente equivalente ao cálculo por margem.
              </p>
            </details>
          </div>
        </section>

        {/* Termos Importantes */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📖 Termos Importantes sobre Precificação
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-bold text-purple-800">Margem Bruta</h4>
              <p className="text-sm text-gray-700">
                Percentual do preço que sobra após deduzir apenas os custos diretos (CMV). 
                Não considera despesas fixas.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-bold text-purple-800">Margem Líquida</h4>
              <p className="text-sm text-gray-700">
                Percentual do preço que sobra após deduzir todos os custos (diretos + fixos + impostos). 
                Representa o lucro real.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-bold text-purple-800">CMV (Custo da Mercadoria Vendida)</h4>
              <p className="text-sm text-gray-700">
                Quanto você gastou para adquirir ou produzir o produto vendido. Base de todo cálculo de preço.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-bold text-purple-800">Ponto de Equilíbrio</h4>
              <p className="text-sm text-gray-700">
                Faturamento mínimo necessário para cobrir todos os custos fixos. Abaixo disso, há prejuízo.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-bold text-purple-800">Markup Multiplicador</h4>
              <p className="text-sm text-gray-700">
                Índice que multiplica o custo para formar o preço. Ex: Markup de 2,0 significa preço = custo × 2.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-bold text-purple-800">Markup Divisor</h4>
              <p className="text-sm text-gray-700">
                Índice que divide o custo para formar o preço. Calculado como 1 - (soma dos percentuais / 100).
              </p>
            </div>
          </div>
        </section>

        {/* Legislação */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ⚖️ Legislação e Precificação no Brasil
          </h3>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Lei 8.137/90 (Crimes Contra a Ordem Tributária):</strong> Praticar preços 
                abaixo do custo pode configurar dumping ou concorrência desleal, passível de multa e processo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>CDC - Código de Defesa do Consumidor (Lei 8.078/90):</strong> O preço 
                anunciado deve ser respeitado. É proibido propaganda enganosa sobre valores e descontos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Lei 10.962/2004:</strong> Estabelece regras sobre precificação e tabelamento 
                de produtos, especialmente farmacêuticos e combustíveis.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Simples Nacional:</strong> Empresas no Simples devem considerar a alíquota 
                efetiva do regime na formação de preços, pois varia conforme faturamento e atividade.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>ICMS e Substituição Tributária:</strong> Produtos com ICMS-ST têm cálculo 
                especial de preço devido à base de cálculo presumida pela legislação estadual.</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-xl p-5 border-l-4 border-yellow-500 mt-6">
            <p className="text-sm text-gray-700">
              <strong>⚠️ Importante:</strong> Sempre consulte um contador para entender a carga tributária 
              específica do seu regime e atividade. Impostos variam conforme CNAE, NCM, e estado de atuação.
            </p>
          </div>
        </section>

        {/* Conclusão */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ✅ Conclusão
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Entender a diferença entre <strong>markup</strong> e <strong>margem de lucro</strong> não é 
            apenas uma questão técnica — é uma questão de <strong>sobrevivência empresarial</strong>. 
            Milhares de negócios fecham anualmente no Brasil por precificar errado.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Use nossa <strong>calculadora gratuita</strong> acima para simular seus preços, comparar os 
            dois métodos, e garantir que você está cobrando o suficiente para manter seu negócio saudável 
            e lucrativo.
          </p>

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border border-purple-300">
            <p className="text-purple-800 font-semibold text-center">
              💡 Dica Final: Revise seus preços <strong>pelo menos a cada trimestre</strong>. Inflação, 
              mudanças de custos e impostos podem corroer sua margem rapidamente sem você perceber.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">
            Gostou da calculadora?
          </h3>
          <p className="mb-4 text-purple-100">
            Explore nossas outras ferramentas financeiras e tributárias gratuitas!
          </p>
          <a 
            href="/" 
            className="inline-block bg-white text-purple-700 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition"
          >
            Ver Todas as Ferramentas →
          </a>
        </section>
      </article>
    </div>
  );
}

export default CalculadoraMarkupMargem;

import React, { useState } from 'react';

function SimuladorMaquininha() {
  const [formData, setFormData] = useState({
    valorVenda: '',
    taxaDebito: '1.99',
    taxaCredito: '2.99',
    numeroParcelas: '1',
    taxaParcelas: '3.99',
    antecipar: false,
    taxaAntecipacao: '2.5',
    bandeira: 'visa'
  });

  const [resultado, setResultado] = useState(null);
  const [erros, setErros] = useState({});

  const bandeirasTaxas = {
    visa: { debito: 1.99, credito: 2.99, parcelado: 3.99 },
    mastercard: { debito: 1.99, credito: 2.99, parcelado: 3.99 },
    elo: { debito: 2.29, credito: 3.29, parcelado: 4.29 },
    amex: { debito: 2.99, credito: 3.99, parcelado: 4.99 },
    hipercard: { debito: 2.49, credito: 3.49, parcelado: 4.49 }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBandeiraChange = (bandeira) => {
    setFormData(prev => ({
      ...prev,
      bandeira,
      taxaDebito: bandeirasTaxas[bandeira].debito.toString(),
      taxaCredito: bandeirasTaxas[bandeira].credito.toString(),
      taxaParcelas: bandeirasTaxas[bandeira].parcelado.toString()
    }));
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.valorVenda || parseFloat(formData.valorVenda) <= 0) {
      novosErros.valorVenda = 'Informe o valor da venda';
    }

    if (!formData.taxaDebito || parseFloat(formData.taxaDebito) < 0) {
      novosErros.taxaDebito = 'Informe a taxa do débito';
    }

    if (!formData.taxaCredito || parseFloat(formData.taxaCredito) < 0) {
      novosErros.taxaCredito = 'Informe a taxa do crédito';
    }

    if (parseInt(formData.numeroParcelas) > 1) {
      if (!formData.taxaParcelas || parseFloat(formData.taxaParcelas) < 0) {
        novosErros.taxaParcelas = 'Informe a taxa do parcelado';
      }
    }

    if (formData.antecipar) {
      if (!formData.taxaAntecipacao || parseFloat(formData.taxaAntecipacao) < 0) {
        novosErros.taxaAntecipacao = 'Informe a taxa de antecipação';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const calcular = () => {
    if (!validarFormulario()) {
      return;
    }

    const valorVenda = parseFloat(formData.valorVenda);
    const taxaDebito = parseFloat(formData.taxaDebito);
    const taxaCredito = parseFloat(formData.taxaCredito);
    const taxaParcelas = parseFloat(formData.taxaParcelas);
    const numeroParcelas = parseInt(formData.numeroParcelas);
    const taxaAntecipacao = parseFloat(formData.taxaAntecipacao || 0);

    // DÉBITO
    const taxaDebitoValor = valorVenda * (taxaDebito / 100);
    const valorLiquidoDebito = valorVenda - taxaDebitoValor;

    // CRÉDITO À VISTA
    const taxaCreditoValor = valorVenda * (taxaCredito / 100);
    const valorLiquidoCredito = valorVenda - taxaCreditoValor;

    // CRÉDITO PARCELADO
    const taxaParceladoValor = valorVenda * (taxaParcelas / 100);
    const valorLiquidoParcelado = valorVenda - taxaParceladoValor;
    const valorPorParcela = valorVenda / numeroParcelas;
    const valorLiquidoPorParcela = valorLiquidoParcelado / numeroParcelas;

    // Prazo de recebimento (médio)
    // Débito: 1 dia, Crédito: 30 dias, Parcelado: média das parcelas
    const prazoDebito = 1;
    const prazoCredito = 30;
    const prazoParcelado = (numeroParcelas + 1) / 2 * 30; // prazo médio em dias

    // ANTECIPAÇÃO
    let valorLiquidoDebitoAntecipado = valorLiquidoDebito;
    let valorLiquidoCreditoAntecipado = valorLiquidoCredito;
    let valorLiquidoParceladoAntecipado = valorLiquidoParcelado;
    let custoAntecipacaoDebito = 0;
    let custoAntecipacaoCredito = 0;
    let custoAntecipacaoParcelado = 0;

    if (formData.antecipar) {
      // Desconto da antecipação calculado proporcionalmente ao prazo
      // Taxa ao mês = taxaAntecipacao%
      // Desconto = valor × (taxa/30) × dias
      
      custoAntecipacaoDebito = valorLiquidoDebito * (taxaAntecipacao / 100) * (prazoDebito / 30);
      valorLiquidoDebitoAntecipado = valorLiquidoDebito - custoAntecipacaoDebito;

      custoAntecipacaoCredito = valorLiquidoCredito * (taxaAntecipacao / 100) * (prazoCredito / 30);
      valorLiquidoCreditoAntecipado = valorLiquidoCredito - custoAntecipacaoCredito;

      custoAntecipacaoParcelado = valorLiquidoParcelado * (taxaAntecipacao / 100) * (prazoParcelado / 30);
      valorLiquidoParceladoAntecipado = valorLiquidoParcelado - custoAntecipacaoParcelado;
    }

    // CET (Custo Efetivo Total) anualizado
    // Para simplificar: CET = (taxa total / valor venda) × (365 / prazo) × 100
    const cetDebito = (taxaDebitoValor / valorVenda) * (365 / prazoDebito) * 100;
    const cetCredito = (taxaCreditoValor / valorVenda) * (365 / prazoCredito) * 100;
    const cetParcelado = (taxaParceladoValor / valorVenda) * (365 / prazoParcelado) * 100;

    // CET com antecipação
    const custoTotalDebito = taxaDebitoValor + custoAntecipacaoDebito;
    const custoTotalCredito = taxaCreditoValor + custoAntecipacaoCredito;
    const custoTotalParcelado = taxaParceladoValor + custoAntecipacaoParcelado;

    const cetDebitoAntecipado = (custoTotalDebito / valorVenda) * (365 / 1) * 100; // antecipado = prazo 1 dia
    const cetCreditoAntecipado = (custoTotalCredito / valorVenda) * (365 / 1) * 100;
    const cetParceladoAntecipado = (custoTotalParcelado / valorVenda) * (365 / 1) * 100;

    setResultado({
      valorVenda,
      // Débito
      taxaDebitoValor,
      valorLiquidoDebito,
      prazoDebito,
      cetDebito,
      valorLiquidoDebitoAntecipado,
      custoAntecipacaoDebito,
      cetDebitoAntecipado,
      // Crédito à vista
      taxaCreditoValor,
      valorLiquidoCredito,
      prazoCredito,
      cetCredito,
      valorLiquidoCreditoAntecipado,
      custoAntecipacaoCredito,
      cetCreditoAntecipado,
      // Parcelado
      taxaParceladoValor,
      valorLiquidoParcelado,
      valorPorParcela,
      valorLiquidoPorParcela,
      numeroParcelas,
      prazoParcelado,
      cetParcelado,
      valorLiquidoParceladoAntecipado,
      custoAntecipacaoParcelado,
      cetParceladoAntecipado,
      // Flags
      antecipar: formData.antecipar,
      taxaAntecipacao
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 mb-4">
            💳 Simulador de Taxas de Maquininha
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Calcule quanto você <strong>realmente recebe</strong> após as taxas de cartão de débito, 
            crédito à vista e parcelado. Descubra o verdadeiro custo da antecipação!
          </p>
        </div>

        {/* Card de Alerta */}
        <div className="bg-yellow-50 rounded-2xl shadow-xl p-6 mb-8 border-l-4 border-yellow-500">
          <h2 className="text-xl font-bold text-yellow-800 mb-3 flex items-center gap-2">
            ⚠️ Você sabia?
          </h2>
          <p className="text-gray-700 text-sm">
            As taxas das maquininhas podem consumir de <strong>2% a 6%</strong> do seu faturamento. 
            Em uma venda de R$ 1.000 parcelada em 12x, você pode perder mais de <strong>R$ 60</strong> 
            só em taxas! E se antecipar, perde ainda mais.
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            📝 Dados da Venda
          </h2>

          {/* Valor da Venda */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💰 Valor da Venda (R$)
            </label>
            <input
              type="number"
              name="valorVenda"
              value={formData.valorVenda}
              onChange={handleChange}
              placeholder="Ex: 1000.00"
              step="0.01"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-lg ${
                erros.valorVenda ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {erros.valorVenda && (
              <p className="text-red-500 text-sm mt-1">{erros.valorVenda}</p>
            )}
          </div>

          {/* Seletor de Bandeira */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🏦 Bandeira do Cartão
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.keys(bandeirasTaxas).map((bandeira) => (
                <button
                  key={bandeira}
                  onClick={() => handleBandeiraChange(bandeira)}
                  className={`py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                    formData.bandeira === bandeira
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {bandeira.charAt(0).toUpperCase() + bandeira.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              As taxas variam conforme a bandeira. Selecione para preencher automaticamente.
            </p>
          </div>

          {/* Taxas */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💳 Taxa Débito (%)
              </label>
              <input
                type="number"
                name="taxaDebito"
                value={formData.taxaDebito}
                onChange={handleChange}
                placeholder="Ex: 1.99"
                step="0.01"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                  erros.taxaDebito ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {erros.taxaDebito && (
                <p className="text-red-500 text-sm mt-1">{erros.taxaDebito}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💳 Taxa Crédito à Vista (%)
              </label>
              <input
                type="number"
                name="taxaCredito"
                value={formData.taxaCredito}
                onChange={handleChange}
                placeholder="Ex: 2.99"
                step="0.01"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                  erros.taxaCredito ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {erros.taxaCredito && (
                <p className="text-red-500 text-sm mt-1">{erros.taxaCredito}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💳 Taxa Crédito Parcelado (%)
              </label>
              <input
                type="number"
                name="taxaParcelas"
                value={formData.taxaParcelas}
                onChange={handleChange}
                placeholder="Ex: 3.99"
                step="0.01"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                  erros.taxaParcelas ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {erros.taxaParcelas && (
                <p className="text-red-500 text-sm mt-1">{erros.taxaParcelas}</p>
              )}
            </div>
          </div>

          {/* Número de Parcelas */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🔢 Número de Parcelas
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[1, 2, 3, 6, 10, 12].map((parcela) => (
                <button
                  key={parcela}
                  onClick={() => setFormData(prev => ({ ...prev, numeroParcelas: parcela.toString() }))}
                  className={`py-3 px-4 rounded-xl font-bold transition-all ${
                    formData.numeroParcelas === parcela.toString()
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {parcela}x
                </button>
              ))}
            </div>
          </div>

          {/* Antecipação */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">⚡ Simular Antecipação de Recebíveis?</h3>
                <p className="text-sm text-gray-600">Receba o dinheiro na hora, mas pague taxa extra</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="antecipar"
                  checked={formData.antecipar}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            {formData.antecipar && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📉 Taxa de Antecipação (% ao mês)
                </label>
                <input
                  type="number"
                  name="taxaAntecipacao"
                  value={formData.taxaAntecipacao}
                  onChange={handleChange}
                  placeholder="Ex: 2.5"
                  step="0.1"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition ${
                    erros.taxaAntecipacao ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {erros.taxaAntecipacao && (
                  <p className="text-red-500 text-sm mt-1">{erros.taxaAntecipacao}</p>
                )}
                <p className="text-xs text-gray-600 mt-2">
                  Taxas típicas: 2% a 4% ao mês (24% a 48% ao ano!)
                </p>
              </div>
            )}
          </div>

          {/* Botão Calcular */}
          <button
            onClick={calcular}
            className="w-full mt-8 bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-8 rounded-xl text-lg font-bold hover:from-green-700 hover:to-teal-700 transition shadow-lg hover:shadow-xl"
          >
            🚀 Calcular Valores Líquidos
          </button>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="space-y-6">
            {/* Comparação Rápida */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                💰 Quanto Você Recebe em Cada Modalidade
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Débito */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">💳 Débito</h3>
                    <span className="text-2xl">⚡</span>
                  </div>
                  <p className="text-3xl font-bold mb-2">
                    R$ {resultado.antecipar ? resultado.valorLiquidoDebitoAntecipado.toFixed(2) : resultado.valorLiquidoDebito.toFixed(2)}
                  </p>
                  <p className="text-sm opacity-90">
                    Recebe em {resultado.antecipar ? '1 dia' : '1 dia'}
                  </p>
                  <div className="mt-4 pt-4 border-t border-blue-400">
                    <p className="text-xs opacity-75">Taxa: R$ {resultado.taxaDebitoValor.toFixed(2)}</p>
                    {resultado.antecipar && resultado.custoAntecipacaoDebito > 0.01 && (
                      <p className="text-xs opacity-75">Antecipação: R$ {resultado.custoAntecipacaoDebito.toFixed(2)}</p>
                    )}
                  </div>
                </div>

                {/* Crédito à Vista */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">💳 Crédito à Vista</h3>
                    <span className="text-2xl">📅</span>
                  </div>
                  <p className="text-3xl font-bold mb-2">
                    R$ {resultado.antecipar ? resultado.valorLiquidoCreditoAntecipado.toFixed(2) : resultado.valorLiquidoCredito.toFixed(2)}
                  </p>
                  <p className="text-sm opacity-90">
                    Recebe em {resultado.antecipar ? '1 dia' : '30 dias'}
                  </p>
                  <div className="mt-4 pt-4 border-t border-green-400">
                    <p className="text-xs opacity-75">Taxa: R$ {resultado.taxaCreditoValor.toFixed(2)}</p>
                    {resultado.antecipar && (
                      <p className="text-xs opacity-75">Antecipação: R$ {resultado.custoAntecipacaoCredito.toFixed(2)}</p>
                    )}
                  </div>
                </div>

                {/* Parcelado */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">💳 Parcelado {resultado.numeroParcelas}x</h3>
                    <span className="text-2xl">📊</span>
                  </div>
                  <p className="text-3xl font-bold mb-2">
                    R$ {resultado.antecipar ? resultado.valorLiquidoParceladoAntecipado.toFixed(2) : resultado.valorLiquidoParcelado.toFixed(2)}
                  </p>
                  <p className="text-sm opacity-90">
                    {resultado.antecipar ? 'Tudo em 1 dia' : `R$ ${resultado.valorLiquidoPorParcela.toFixed(2)}/mês`}
                  </p>
                  <div className="mt-4 pt-4 border-t border-orange-400">
                    <p className="text-xs opacity-75">Taxa: R$ {resultado.taxaParceladoValor.toFixed(2)}</p>
                    {resultado.antecipar && (
                      <p className="text-xs opacity-75">Antecipação: R$ {resultado.custoAntecipacaoParcelado.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Detalhamento de Perdas */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                📉 Quanto Você Perde em Taxas
              </h3>

              <div className="space-y-4">
                {/* Débito */}
                <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-blue-800">💳 Débito</h4>
                    <span className="text-sm text-blue-600">Prazo: {resultado.prazoDebito} dia</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-600">Valor da Venda</p>
                      <p className="text-lg font-bold text-gray-800">R$ {resultado.valorVenda.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Taxa da Maquininha</p>
                      <p className="text-lg font-bold text-red-600">- R$ {resultado.taxaDebitoValor.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Você Recebe</p>
                      <p className="text-lg font-bold text-green-600">R$ {resultado.valorLiquidoDebito.toFixed(2)}</p>
                    </div>
                  </div>
                  {resultado.antecipar && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Valor Líquido</p>
                          <p className="text-sm font-bold text-gray-800">R$ {resultado.valorLiquidoDebito.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Taxa Antecipação</p>
                          <p className="text-sm font-bold text-red-600">- R$ {resultado.custoAntecipacaoDebito.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Recebe Hoje</p>
                          <p className="text-sm font-bold text-green-600">R$ {resultado.valorLiquidoDebitoAntecipado.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-blue-700 mt-3">
                    CET: {resultado.antecipar ? resultado.cetDebitoAntecipado.toFixed(2) : resultado.cetDebito.toFixed(2)}% ao ano
                  </p>
                </div>

                {/* Crédito */}
                <div className="bg-green-50 rounded-xl p-5 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-green-800">💳 Crédito à Vista</h4>
                    <span className="text-sm text-green-600">Prazo: {resultado.antecipar ? '1 dia' : '30 dias'}</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-600">Valor da Venda</p>
                      <p className="text-lg font-bold text-gray-800">R$ {resultado.valorVenda.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Taxa da Maquininha</p>
                      <p className="text-lg font-bold text-red-600">- R$ {resultado.taxaCreditoValor.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Você Recebe</p>
                      <p className="text-lg font-bold text-green-600">R$ {resultado.valorLiquidoCredito.toFixed(2)}</p>
                    </div>
                  </div>
                  {resultado.antecipar && (
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Valor Líquido</p>
                          <p className="text-sm font-bold text-gray-800">R$ {resultado.valorLiquidoCredito.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Taxa Antecipação</p>
                          <p className="text-sm font-bold text-red-600">- R$ {resultado.custoAntecipacaoCredito.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Recebe Hoje</p>
                          <p className="text-sm font-bold text-green-600">R$ {resultado.valorLiquidoCreditoAntecipado.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-green-700 mt-3">
                    CET: {resultado.antecipar ? resultado.cetCreditoAntecipado.toFixed(2) : resultado.cetCredito.toFixed(2)}% ao ano
                  </p>
                </div>

                {/* Parcelado */}
                <div className="bg-orange-50 rounded-xl p-5 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-orange-800">💳 Crédito Parcelado {resultado.numeroParcelas}x</h4>
                    <span className="text-sm text-orange-600">Prazo: {resultado.antecipar ? '1 dia' : Math.round(resultado.prazoParcelado) + ' dias (média)'}</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-600">Valor da Venda</p>
                      <p className="text-lg font-bold text-gray-800">R$ {resultado.valorVenda.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Taxa da Maquininha</p>
                      <p className="text-lg font-bold text-red-600">- R$ {resultado.taxaParceladoValor.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Você Recebe (Total)</p>
                      <p className="text-lg font-bold text-green-600">R$ {resultado.valorLiquidoParcelado.toFixed(2)}</p>
                    </div>
                  </div>
                  {!resultado.antecipar && (
                    <div className="mt-3 bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Valor por parcela recebida:</p>
                      <p className="text-sm font-bold text-orange-700">
                        R$ {resultado.valorLiquidoPorParcela.toFixed(2)} × {resultado.numeroParcelas} meses
                      </p>
                    </div>
                  )}
                  {resultado.antecipar && (
                    <div className="mt-4 pt-4 border-t border-orange-200">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Valor Líquido</p>
                          <p className="text-sm font-bold text-gray-800">R$ {resultado.valorLiquidoParcelado.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Taxa Antecipação</p>
                          <p className="text-sm font-bold text-red-600">- R$ {resultado.custoAntecipacaoParcelado.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Recebe Hoje</p>
                          <p className="text-sm font-bold text-green-600">R$ {resultado.valorLiquidoParceladoAntecipado.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-orange-700 mt-3">
                    CET: {resultado.antecipar ? resultado.cetParceladoAntecipado.toFixed(2) : resultado.cetParcelado.toFixed(2)}% ao ano
                  </p>
                </div>
              </div>
            </div>

            {/* Alerta de Perda */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-xl p-6 md:p-8 border-2 border-red-300">
              <h3 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-2">
                🚨 Total Perdido em Taxas
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Débito</p>
                  <p className="text-2xl font-bold text-red-600">
                    R$ {(resultado.valorVenda - (resultado.antecipar ? resultado.valorLiquidoDebitoAntecipado : resultado.valorLiquidoDebito)).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((resultado.valorVenda - (resultado.antecipar ? resultado.valorLiquidoDebitoAntecipado : resultado.valorLiquidoDebito)) / resultado.valorVenda * 100).toFixed(2)}% do valor
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Crédito à Vista</p>
                  <p className="text-2xl font-bold text-red-600">
                    R$ {(resultado.valorVenda - (resultado.antecipar ? resultado.valorLiquidoCreditoAntecipado : resultado.valorLiquidoCredito)).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((resultado.valorVenda - (resultado.antecipar ? resultado.valorLiquidoCreditoAntecipado : resultado.valorLiquidoCredito)) / resultado.valorVenda * 100).toFixed(2)}% do valor
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Parcelado {resultado.numeroParcelas}x</p>
                  <p className="text-2xl font-bold text-red-600">
                    R$ {(resultado.valorVenda - (resultado.antecipar ? resultado.valorLiquidoParceladoAntecipado : resultado.valorLiquidoParcelado)).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((resultado.valorVenda - (resultado.antecipar ? resultado.valorLiquidoParceladoAntecipado : resultado.valorLiquidoParcelado)) / resultado.valorVenda * 100).toFixed(2)}% do valor
                  </p>
                </div>
              </div>
              {resultado.antecipar && (
                <div className="mt-6 bg-red-100 rounded-xl p-4 border-2 border-red-400">
                  <p className="text-red-800 font-bold text-center">
                    ⚠️ A antecipação custou R$ {(resultado.custoAntecipacaoDebito + resultado.custoAntecipacaoCredito + resultado.custoAntecipacaoParcelado).toFixed(2)} a mais!
                  </p>
                  <p className="text-sm text-red-700 text-center mt-2">
                    CET efetivo da antecipação: até {resultado.taxaAntecipacao}% ao mês = {(resultado.taxaAntecipacao * 12).toFixed(0)}% ao ano
                  </p>
                </div>
              )}
            </div>

            {/* Botão Nova Simulação */}
            <button
              onClick={() => {
                setResultado(null);
                setFormData({
                  valorVenda: '',
                  taxaDebito: '1.99',
                  taxaCredito: '2.99',
                  numeroParcelas: '1',
                  taxaParcelas: '3.99',
                  antecipar: false,
                  taxaAntecipacao: '2.5',
                  bandeira: 'visa'
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
          📚 Taxas de Maquininha: Guia Completo 2025
        </h2>

        {/* Introdução */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            As <strong>taxas de maquininha de cartão</strong> são um dos maiores custos operacionais para comerciantes 
            brasileiros. Em média, <strong>2% a 6% de cada venda</strong> vai direto para as operadoras — e muitos 
            lojistas nem sabem exatamente quanto estão pagando.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Neste guia completo de 2025, você vai entender como funcionam as taxas de débito, crédito à vista e 
            parcelado, descobrir o verdadeiro custo da antecipação, e aprender a calcular o <strong>CET 
            (Custo Efetivo Total)</strong> para tomar decisões mais inteligentes.
          </p>
        </section>

        {/* Como Funcionam as Taxas */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            💳 Como Funcionam as Taxas de Maquininha
          </h3>

          <p className="text-gray-700 mb-4">
            Toda vez que um cliente paga com cartão, você <strong>não recebe o valor cheio</strong>. As operadoras 
            (Stone, Cielo, PagSeguro, Mercado Pago, etc.) cobram uma porcentagem da venda. Veja as modalidades:
          </p>

          <div className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left">Modalidade</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Taxa Média</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Prazo Recebimento</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Observação</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Débito</td>
                  <td className="border border-gray-300 px-4 py-2">1,5% a 2,5%</td>
                  <td className="border border-gray-300 px-4 py-2">1 dia útil</td>
                  <td className="border border-gray-300 px-4 py-2">Menor taxa, recebimento rápido</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Crédito à Vista</td>
                  <td className="border border-gray-300 px-4 py-2">2,5% a 3,5%</td>
                  <td className="border border-gray-300 px-4 py-2">30 dias</td>
                  <td className="border border-gray-300 px-4 py-2">Taxa intermediária</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Crédito Parcelado</td>
                  <td className="border border-gray-300 px-4 py-2">3,5% a 5,5%</td>
                  <td className="border border-gray-300 px-4 py-2">30 a 360 dias</td>
                  <td className="border border-gray-300 px-4 py-2">Maior taxa, recebe em parcelas</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Antecipação</td>
                  <td className="border border-gray-300 px-4 py-2">+1,5% a 4% ao mês</td>
                  <td className="border border-gray-300 px-4 py-2">1 dia útil</td>
                  <td className="border border-gray-300 px-4 py-2">Taxa EXTRA sobre o valor</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500 my-6">
            <h4 className="font-bold text-red-800 mb-2">🚨 Atenção:</h4>
            <p className="text-sm text-gray-700">
              A <strong>antecipação NÃO é gratuita</strong>! Apesar de muitas maquininhas prometerem "antecipação 
              automática sem custo", você paga uma taxa embutida. O CET de uma antecipação pode chegar a 
              <strong> 48% ao ano</strong>.
            </p>
          </div>
        </section>

        {/* Como Calcular */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📐 Como Calcular o Valor Líquido
          </h3>

          <p className="text-gray-700 mb-4">
            Para saber quanto você <strong>realmente vai receber</strong>, use a fórmula:
          </p>

          <div className="bg-white rounded-xl p-5 border-2 border-gray-200 mb-6">
            <p className="font-mono text-lg text-gray-800 mb-4">
              <strong>Valor Líquido = Valor da Venda × (1 - Taxa%/100)</strong>
            </p>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-800 mb-2">Exemplo Prático:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Venda de R$ 1.000,00</li>
                <li>• Taxa de crédito: 3%</li>
                <li>• <strong>Valor Líquido = R$ 1.000 × 0,97 = R$ 970,00</strong></li>
                <li>• <strong>Você perde R$ 30,00 na transação</strong></li>
              </ul>
            </div>
          </div>

          <h4 className="text-xl font-bold text-orange-800 mb-3">Calculando a Antecipação</h4>
          <p className="text-gray-700 mb-3">
            Se você antecipar o recebimento, paga <strong>taxa sobre taxa</strong>:
          </p>

          <div className="bg-white rounded-xl p-5 border-2 border-gray-200 mb-6">
            <p className="font-mono text-sm text-gray-800 mb-4">
              <strong>Custo Antecipação = Valor Líquido × (Taxa Mensal%/100) × (Dias até Recebimento/30)</strong>
            </p>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-orange-800 mb-2">Exemplo:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Venda de R$ 1.000 parcelada em 12x</li>
                <li>• Taxa parcelado: 4% = R$ 960 líquido</li>
                <li>• Prazo médio de recebimento: 180 dias (6 meses)</li>
                <li>• Taxa antecipação: 2,5% ao mês</li>
                <li>• <strong>Custo extra: R$ 960 × 0,025 × 6 = R$ 144</strong></li>
                <li>• <strong>Total recebido antecipado: R$ 816</strong></li>
                <li>• <strong>Você perdeu R$ 184 (18,4% do valor!)</strong></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Exemplos Práticos */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            💡 Exemplos Práticos: Quanto Você Perde
          </h3>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-800 mb-2">Cenário 1: Venda de R$ 500 no Débito</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Valor da venda: R$ 500,00</li>
                <li>• Taxa: 2%</li>
                <li>• <strong>Você recebe: R$ 490,00 (em 1 dia)</strong></li>
                <li>• Perda: R$ 10,00</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-5 border-l-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-2">Cenário 2: Venda de R$ 2.000 no Crédito à Vista</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Valor da venda: R$ 2.000,00</li>
                <li>• Taxa: 3%</li>
                <li>• <strong>Você recebe: R$ 1.940,00 (em 30 dias)</strong></li>
                <li>• Perda: R$ 60,00</li>
              </ul>
            </div>

            <div className="bg-orange-50 rounded-xl p-5 border-l-4 border-orange-500">
              <h4 className="font-bold text-orange-800 mb-2">Cenário 3: Venda de R$ 3.000 em 10x</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Valor da venda: R$ 3.000,00</li>
                <li>• Taxa parcelado: 4,5%</li>
                <li>• <strong>Você recebe: R$ 2.865,00 (R$ 286,50/mês por 10 meses)</strong></li>
                <li>• Perda: R$ 135,00</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-xl p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-2">Cenário 4: Mesma venda anterior COM antecipação</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Valor líquido: R$ 2.865,00</li>
                <li>• Taxa antecipação: 2,5% ao mês × 5 meses (prazo médio)</li>
                <li>• <strong>Custo extra antecipação: R$ 358</strong></li>
                <li>• <strong>Você recebe HOJE: R$ 2.507,00</strong></li>
                <li>• <strong>Perda total: R$ 493,00 (16,4%!)</strong></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Erros Comuns */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ❌ 5 Erros Que Fazem Você Perder Dinheiro
          </h3>

          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">1. Aceitar parcelamento sem repassar o custo</h4>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Erro:</strong> Cobrar o mesmo preço à vista e parcelado.<br/>
                <strong>Resultado:</strong> Você perde 1% a 3% de margem em toda venda parcelada.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">2. Antecipar todos os recebíveis automaticamente</h4>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Erro:</strong> Deixar antecipação automática ligada por "conveniência".<br/>
                <strong>Resultado:</strong> Você pode estar pagando 24% a 48% ao ano sem perceber.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">3. Não negociar taxas com a operadora</h4>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Erro:</strong> Aceitar as taxas padrão sem questionar.<br/>
                <strong>Resultado:</strong> Muitas operadoras baixam taxas se você negociar ou tiver volume alto.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">4. Não considerar as taxas no preço final</h4>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Erro:</strong> Fazer markup/margem sem incluir as taxas de cartão.<br/>
                <strong>Resultado:</strong> Sua margem real é menor do que você pensa, podendo até ter prejuízo.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">5. Não conhecer o CET real das taxas</h4>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Erro:</strong> Olhar só a "taxa da maquininha" e ignorar o custo anual.<br/>
                <strong>Resultado:</strong> Você pode estar pagando o equivalente a um empréstimo caro.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ❓ Perguntas Frequentes sobre Taxas de Maquininha
          </h3>

          <div className="space-y-4">
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Qual a taxa mais baixa de maquininha em 2025?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                As taxas mais baixas variam conforme faturamento e negociação. Em média: <strong>Débito: 1,39% a 
                1,99%</strong>; <strong>Crédito: 2,49% a 2,99%</strong>; <strong>Parcelado: 3,49% a 3,99%</strong>. 
                Empresas como Stone, Mercado Pago e PagBank oferecem taxas competitivas para alto volume.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Vale a pena antecipar recebíveis?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                <strong>Depende.</strong> Se você tem uma emergência ou oportunidade de investimento com retorno 
                maior que o custo da antecipação (geralmente 2% a 4% ao mês), pode valer. Mas para fluxo de caixa 
                rotineiro, <strong>NÃO vale</strong> — você está pagando juros altíssimos.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Como negociar taxas menores com a operadora?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                <strong>Dicas:</strong> 1) Mostre seu faturamento mensal; 2) Apresente propostas de concorrentes; 
                3) Negocie volume (faturamento acima de R$ 30k/mês tem mais poder); 4) Evite contratos de 
                fidelidade longos; 5) Considere ter 2 maquininhas para comparar.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Maquininha com taxa zero existe?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                <strong>Não.</strong> Algumas promovem "taxa zero" mas <strong>embute custos</strong> em aluguel, 
                mensalidade ou taxa de antecipação obrigatória. Sempre leia as letras miúdas e calcule o CET real.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Posso repassar a taxa de cartão para o cliente?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                <strong>Sim, mas com cuidado.</strong> A Lei 13.455/2017 permite desconto para pagamento à vista/PIX, 
                mas <strong>proíbe cobrança extra no cartão</strong>. A estratégia correta é: preço "cheio" no 
                cartão, desconto para PIX/dinheiro. Assim você não viola a lei e incentiva formas mais baratas.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                PIX tem taxa?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Para <strong>pessoa física: NÃO</strong>. Para <strong>empresas (CNPJ): geralmente SIM</strong>, 
                mas muito menor (0,20% a 0,99%). PIX é a forma mais barata de receber pagamentos digitais em 2025.
              </p>
            </details>
          </div>
        </section>

        {/* Termos Importantes */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📖 Termos Importantes sobre Taxas de Cartão
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-bold text-green-800">Taxa MDR</h4>
              <p className="text-sm text-gray-700">
                Merchant Discount Rate — percentual descontado sobre cada transação. É a "taxa da maquininha".
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-bold text-green-800">CET (Custo Efetivo Total)</h4>
              <p className="text-sm text-gray-700">
                Custo anualizado de todas as taxas. Permite comparar o custo real entre diferentes operadoras.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-bold text-green-800">Antecipação de Recebíveis</h4>
              <p className="text-sm text-gray-700">
                Receber hoje o que só cairia em 30, 60, 90 dias. Cobra taxa extra (2% a 4% ao mês).
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-bold text-green-800">Agenda de Recebimento</h4>
              <p className="text-sm text-gray-700">
                Calendário de quando cada venda cairá na conta. Débito: D+1; Crédito: D+30; Parcelado: mensalmente.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-bold text-green-800">Bandeira</h4>
              <p className="text-sm text-gray-700">
                Visa, Mastercard, Elo, Amex. Cada uma cobra taxas diferentes das maquininhas.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-bold text-green-800">Intercâmbio</h4>
              <p className="text-sm text-gray-700">
                Taxa que a bandeira cobra das maquininhas. Parte da MDR vai para a bandeira e banco emissor.
              </p>
            </div>
          </div>
        </section>

        {/* Legislação */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ⚖️ Legislação sobre Meios de Pagamento no Brasil
          </h3>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Lei 13.455/2017:</strong> Permite desconto para pagamento em dinheiro/PIX, mas 
                <strong> proíbe cobrança extra</strong> no cartão de crédito.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Resolução BCB nº 150/2021:</strong> Regulamenta arranjos de pagamento instantâneo 
                (PIX) e define custos para empresas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Lei 12.865/2013:</strong> Marco regulatório dos meios de pagamento eletrônico, 
                dando poderes ao Banco Central para regular o setor.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Código de Defesa do Consumidor:</strong> Proíbe venda casada (obrigar cliente 
                a usar determinado meio de pagamento com custo extra).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>RFB - Receita Federal:</strong> Toda transação com cartão gera obrigação de 
                declaração. Maquininhas devem enviar dados à Receita.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Conclusão */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ✅ Conclusão
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            As <strong>taxas de maquininha</strong> são inevitáveis, mas você pode minimizar o impacto no seu 
            negócio conhecendo exatamente quanto paga, negociando com operadoras, e tomando decisões conscientes 
            sobre antecipação e parcelamento.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Use nossa <strong>calculadora gratuita</strong> acima para simular diferentes cenários e descobrir 
            exatamente quanto você está perdendo em cada tipo de transação. Compare, negocie, e lucre mais!
          </p>

          <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl p-6 border border-green-300">
            <p className="text-green-800 font-semibold text-center">
              💡 Dica Final: Sempre que possível, <strong>incentive pagamentos via PIX</strong>. A taxa é até 
              <strong>10x menor</strong> que cartão de crédito parcelado!
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">
            Gostou do simulador?
          </h3>
          <p className="mb-4 text-green-100">
            Explore nossas outras ferramentas financeiras e tributárias gratuitas!
          </p>
          <a 
            href="/" 
            className="inline-block bg-white text-green-700 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition"
          >
            Ver Todas as Ferramentas →
          </a>
        </section>
      </article>
    </div>
  );
}

export default SimuladorMaquininha;

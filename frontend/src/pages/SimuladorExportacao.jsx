import React, { useState } from 'react';
import { Calculator, Globe, TrendingUp, Package, Truck, DollarSign, CheckCircle, AlertCircle, Ship, Plane } from 'lucide-react';

const SimuladorExportacao = () => {
  const [valorExportacao, setValorExportacao] = useState('');
  const [comprasInsumos, setComprasInsumos] = useState('');
  const [freteInternacional, setFreteInternacional] = useState('');
  const [custosOperacionais, setCustosOperacionais] = useState('');
  const [percentualExportacao, setPercentualExportacao] = useState(100);
  const [tipoExportacao, setTipoExportacao] = useState('direta');
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const tiposExportacao = [
    {
      id: 'direta',
      nome: 'Exportação Direta',
      icon: '🌍',
      descricao: 'Empresa vende diretamente para cliente no exterior',
      cor: 'blue'
    },
    {
      id: 'indireta',
      nome: 'Exportação Indireta',
      icon: '🏢',
      descricao: 'Venda para trading company no Brasil que exporta',
      cor: 'purple'
    },
    {
      id: 'regime',
      nome: 'Regime Especial',
      icon: '⚡',
      descricao: 'Zona Franca, Recof, Drawback ou similar',
      cor: 'green'
    }
  ];

  const calcular = () => {
    if (!valorExportacao || !comprasInsumos || !freteInternacional || !custosOperacionais) {
      alert('Preencha todos os campos para simular a exportação.');
      return;
    }

    setMostrarResultado(true);
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const formatarPercentual = (valor) => {
    return (valor * 100).toFixed(2) + '%';
  };

  const tipoAtual = tiposExportacao.find(t => t.id === tipoExportacao);

  // Cálculos
  const valorExportacaoNum = parseFloat(valorExportacao) || 0;
  const comprasInsumosNum = parseFloat(comprasInsumos) || 0;
  const freteInternacionalNum = parseFloat(freteInternacional) || 0;
  const custosOperacionaisNum = parseFloat(custosOperacionais) || 0;

  const percentualExport = percentualExportacao / 100;
  const percentualMercadoInterno = 1 - percentualExport;

  // Créditos acumulados (26,5% sobre todos os gastos)
  const taxaCredito = 0.265;
  const creditoInsumos = comprasInsumosNum * taxaCredito;
  const creditoFrete = freteInternacionalNum * taxaCredito;
  const creditoOperacional = custosOperacionaisNum * taxaCredito;
  const totalCreditos = creditoInsumos + creditoFrete + creditoOperacional;

  // Receita e débitos
  const receitaExportacao = valorExportacaoNum * percentualExport;
  const receitaMercadoInterno = valorExportacaoNum * percentualMercadoInterno;

  // Débitos IVA
  const debitoExportacao = 0; // Exportação = alíquota ZERO
  const debitoMercadoInterno = receitaMercadoInterno * taxaCredito;
  const totalDebitos = debitoExportacao + debitoMercadoInterno;

  // Saldo (Créditos - Débitos)
  const saldoCredor = totalCreditos - totalDebitos;
  const ressarcimento = saldoCredor > 0 ? saldoCredor : 0;
  const ivaPagar = saldoCredor < 0 ? Math.abs(saldoCredor) : 0;

  // Economia vs sistema tributado
  const ivaHipotetico = valorExportacaoNum * taxaCredito; // Se exportação fosse tributada
  const economiaTotal = ivaHipotetico - ivaPagar + ressarcimento;

  // Comparação sistema atual (PIS/COFINS isentos, ICMS/IPI isentos)
  const tributoAtualExportacao = 0; // Hoje exportação também é isenta
  const vantagemNova = ressarcimento; // Vantagem: no novo sistema você recebe os créditos de volta!

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Simulador de Exportações IVA
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calcule os créditos recuperáveis em operações de exportação. Com <strong>alíquota ZERO</strong> nas vendas
            e <strong>ressarcimento integral</strong> dos créditos, exportar fica ainda mais vantajoso com IBS/CBS!
          </p>
        </div>

        {/* Alerta informativo */}
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-8 flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-800 mb-2">✅ Exportação com Alíquota ZERO + Ressarcimento</h3>
            <p className="text-gray-700 leading-relaxed">
              Exportações continuam com <strong>alíquota ZERO</strong> de IBS/CBS (imunidade constitucional). Mas agora você
              tem direito a <strong>ressarcir em dinheiro 100% dos créditos</strong> acumulados nas compras de insumos, frete
              e custos operacionais. Isso melhora o <strong>fluxo de caixa</strong> e elimina a burocracia de acumular créditos
              sem poder usá-los.
            </p>
          </div>
        </div>

        {/* Seletor de Tipo de Exportação */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Ship className="w-6 h-6 text-blue-600" />
            Tipo de Exportação
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {tiposExportacao.map((tipo) => (
              <button
                key={tipo.id}
                onClick={() => setTipoExportacao(tipo.id)}
                className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                  tipoExportacao === tipo.id
                    ? `border-${tipo.cor}-500 bg-${tipo.cor}-50 shadow-lg`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-3">{tipo.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{tipo.nome}</h3>
                <p className="text-sm text-gray-600">{tipo.descricao}</p>
                {tipoExportacao === tipo.id && (
                  <div className="mt-3 flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Selecionado</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            Dados da Operação de Exportação
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Valor da Exportação */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <Globe className="inline w-5 h-5 mr-2 text-blue-600" />
                Valor da Exportação (R$)
              </label>
              <input
                type="number"
                value={valorExportacao}
                onChange={(e) => setValorExportacao(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Ex: 500000"
              />
              <p className="text-sm text-gray-600 mt-2">
                Valor total da receita de exportação (FOB, CIF ou similar)
              </p>
            </div>

            {/* Percentual Exportação */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <TrendingUp className="inline w-5 h-5 mr-2 text-green-600" />
                Percentual de Exportação (%)
              </label>
              <input
                type="number"
                value={percentualExportacao}
                onChange={(e) => setPercentualExportacao(Math.min(100, Math.max(0, parseFloat(e.target.value))))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                placeholder="Ex: 100"
                min="0"
                max="100"
              />
              <p className="text-sm text-gray-600 mt-2">
                Se você também vende no mercado interno, ajuste aqui. 100% = só exportação.
              </p>
            </div>

            {/* Compras de Insumos */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <Package className="inline w-5 h-5 mr-2 text-purple-600" />
                Compras de Insumos (R$)
              </label>
              <input
                type="number"
                value={comprasInsumos}
                onChange={(e) => setComprasInsumos(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="Ex: 300000"
              />
              <p className="text-sm text-gray-600 mt-2">
                Matéria-prima, mercadorias, componentes, embalagens (com IBS/CBS destacado)
              </p>
            </div>

            {/* Frete Internacional */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <Truck className="inline w-5 h-5 mr-2 text-orange-600" />
                Frete Internacional (R$)
              </label>
              <input
                type="number"
                value={freteInternacional}
                onChange={(e) => setFreteInternacional(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="Ex: 20000"
              />
              <p className="text-sm text-gray-600 mt-2">
                Frete de exportação, seguro internacional, despachante aduaneiro
              </p>
            </div>

            {/* Custos Operacionais */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                <DollarSign className="inline w-5 h-5 mr-2 text-teal-600" />
                Custos Operacionais (R$)
              </label>
              <input
                type="number"
                value={custosOperacionais}
                onChange={(e) => setCustosOperacionais(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                placeholder="Ex: 80000"
              />
              <p className="text-sm text-gray-600 mt-2">
                Energia, manutenção, softwares, armazenagem, serviços terceirizados, marketing internacional
              </p>
            </div>
          </div>

          <button
            onClick={calcular}
            className="mt-8 w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
          >
            <Calculator className="w-6 h-6" />
            Calcular Créditos e Ressarcimento
          </button>
        </div>

        {/* Resultados */}
        {mostrarResultado && (
          <div className="space-y-8">
            {/* Resumo Principal */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-10 h-10" />
                <h2 className="text-3xl font-bold">Resultado da Exportação</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-green-100 text-lg mb-2">Receita Exportação</p>
                  <p className="text-4xl font-bold">{formatarMoeda(receitaExportacao)}</p>
                  <p className="text-green-100 text-sm mt-1">Alíquota ZERO (0%)</p>
                </div>
                <div>
                  <p className="text-green-100 text-lg mb-2">Total de Créditos</p>
                  <p className="text-4xl font-bold">{formatarMoeda(totalCreditos)}</p>
                  <p className="text-green-100 text-sm mt-1">26,5% dos gastos</p>
                </div>
                <div>
                  <p className="text-green-100 text-lg mb-2">Ressarcimento a Receber</p>
                  <p className="text-4xl font-bold">{formatarMoeda(ressarcimento)}</p>
                  <p className="text-green-100 text-sm mt-1">Em dinheiro pela Receita</p>
                </div>
              </div>
            </div>

            {/* Detalhamento de Créditos */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Detalhamento dos Créditos Acumulados
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                  <Package className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-bold text-gray-800 mb-2">Insumos</h3>
                  <p className="text-gray-600 text-sm mb-3">Base: {formatarMoeda(comprasInsumosNum)}</p>
                  <p className="text-purple-600 text-2xl font-bold">{formatarMoeda(creditoInsumos)}</p>
                  <p className="text-gray-600 text-sm mt-1">Crédito 26,5%</p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
                  <Truck className="w-8 h-8 text-orange-600 mb-3" />
                  <h3 className="font-bold text-gray-800 mb-2">Frete Internacional</h3>
                  <p className="text-gray-600 text-sm mb-3">Base: {formatarMoeda(freteInternacionalNum)}</p>
                  <p className="text-orange-600 text-2xl font-bold">{formatarMoeda(creditoFrete)}</p>
                  <p className="text-gray-600 text-sm mt-1">Crédito 26,5%</p>
                </div>

                <div className="bg-teal-50 p-6 rounded-lg border-2 border-teal-200">
                  <DollarSign className="w-8 h-8 text-teal-600 mb-3" />
                  <h3 className="font-bold text-gray-800 mb-2">Custos Operacionais</h3>
                  <p className="text-gray-600 text-sm mb-3">Base: {formatarMoeda(custosOperacionaisNum)}</p>
                  <p className="text-teal-600 text-2xl font-bold">{formatarMoeda(creditoOperacional)}</p>
                  <p className="text-gray-600 text-sm mt-1">Crédito 26,5%</p>
                </div>
              </div>
            </div>

            {/* Cálculo do Ressarcimento */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                🔄 Como Funciona o Ressarcimento?
              </h2>

              <div className="space-y-4">
                <div className="bg-blue-50 p-5 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-2">1️⃣ Créditos Acumulados</h3>
                  <p className="text-gray-700 mb-2">
                    Você comprou insumos, pagou frete e teve custos operacionais totalizando{' '}
                    <strong>{formatarMoeda(comprasInsumosNum + freteInternacionalNum + custosOperacionaisNum)}</strong>.
                  </p>
                  <p className="text-gray-700">
                    Crédito de IVA: <strong className="text-green-600">{formatarMoeda(totalCreditos)}</strong> (26,5%)
                  </p>
                </div>

                <div className="bg-green-50 p-5 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-2">2️⃣ Débito de Exportação</h3>
                  <p className="text-gray-700 mb-2">
                    Receita de exportação: <strong>{formatarMoeda(receitaExportacao)}</strong>
                  </p>
                  <p className="text-gray-700">
                    Débito IVA: <strong className="text-red-600">R$ 0,00</strong> (alíquota ZERO)
                  </p>
                </div>

                {percentualMercadoInterno > 0 && (
                  <div className="bg-yellow-50 p-5 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">3️⃣ Vendas Mercado Interno</h3>
                    <p className="text-gray-700 mb-2">
                      Receita mercado interno: <strong>{formatarMoeda(receitaMercadoInterno)}</strong>
                    </p>
                    <p className="text-gray-700">
                      Débito IVA: <strong className="text-red-600">{formatarMoeda(debitoMercadoInterno)}</strong> (26,5%)
                    </p>
                  </div>
                )}

                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-lg border-2 border-green-500">
                  <h3 className="font-bold text-gray-800 mb-3 text-xl">4️⃣ Saldo Final</h3>
                  <div className="space-y-2 text-gray-700">
                    <p>Créditos: <strong className="text-green-600">+{formatarMoeda(totalCreditos)}</strong></p>
                    <p>Débitos: <strong className="text-red-600">-{formatarMoeda(totalDebitos)}</strong></p>
                    <hr className="my-3 border-gray-300" />
                    <p className="text-2xl font-bold text-green-600">
                      Ressarcimento: {formatarMoeda(ressarcimento)}
                    </p>
                  </div>
                  <p className="text-gray-700 mt-4">
                    ✅ Você receberá <strong className="text-green-600">{formatarMoeda(ressarcimento)}</strong> em dinheiro
                    da Receita Federal nos próximos 60 dias após solicitação.
                  </p>
                </div>
              </div>
            </div>

            {/* Comparação Sistema Atual vs Novo */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                ⚖️ Comparação: Sistema Atual vs. IBS/CBS
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
                  <h3 className="font-bold text-gray-800 mb-4">Sistema Atual (2025)</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <div>
                        <strong>PIS/COFINS:</strong> Isentos (0%)
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <div>
                        <strong>ICMS/IPI:</strong> Isentos (0%)
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <div>
                        <strong>Créditos:</strong> Acumulados, mas difíceis de usar. Ficam "travados" sem opção de ressarcimento fácil.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <div>
                        <strong>Burocracia:</strong> Processo lento e complexo para recuperar créditos de ICMS/IPI.
                      </div>
                    </li>
                  </ul>
                  <p className="mt-4 font-bold text-red-600">
                    Resultado: Créditos acumulados, fluxo de caixa prejudicado
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-500">
                  <h3 className="font-bold text-gray-800 mb-4">Sistema Novo (2027+)</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <div>
                        <strong>IBS/CBS:</strong> Alíquota ZERO (0%)
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <div>
                        <strong>Créditos:</strong> 26,5% sobre TODOS os gastos (insumos, frete, energia, serviços)
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <div>
                        <strong>Ressarcimento:</strong> 100% dos créditos devolvidos em dinheiro em até 60 dias
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <div>
                        <strong>Simplicidade:</strong> Processo digital automático via portal da Receita
                      </div>
                    </li>
                  </ul>
                  <p className="mt-4 font-bold text-green-600 text-lg">
                    Resultado: +{formatarMoeda(ressarcimento)} no caixa! 💰
                  </p>
                </div>
              </div>
            </div>

            {/* Vantagens para Exportadores */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-4 text-xl flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                Vantagens do Novo Sistema para Exportadores
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <p><strong>Mais créditos:</strong> 26,5% vs. ~10% atual (PIS/COFINS não-cumulativo)</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <p><strong>Ressarcimento rápido:</strong> 60 dias vs. anos (ICMS/IPI)</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <p><strong>Fluxo de caixa:</strong> Recebe dinheiro de volta, não fica com crédito "travado"</p>
                  </li>
                </ul>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">4.</span>
                    <p><strong>Simplicidade:</strong> Um único tributo (IBS/CBS) vs. 5 atuais (PIS, Cofins, ICMS, IPI, ISS)</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">5.</span>
                    <p><strong>Competitividade:</strong> Custo Brasil reduzido, produtos mais competitivos no mercado global</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">6.</span>
                    <p><strong>Previsibilidade:</strong> Regras nacionais uniformes, sem guerra fiscal entre estados</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Impacto por Setor */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                🏭 Impacto por Setor Exportador
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-200">
                  <h3 className="font-bold text-gray-800 mb-3">🚗 Indústria Automotiva</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    <strong>Ganho:</strong> +15-20% competitividade
                  </p>
                  <p className="text-gray-700 text-sm">
                    Alto volume de insumos (60-70% do preço), frete internacional elevado. 
                    Ressarcimento rápido melhora capital de giro.
                  </p>
                </div>

                <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
                  <h3 className="font-bold text-gray-800 mb-3">🌾 Agronegócio</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    <strong>Ganho:</strong> +20-25% competitividade
                  </p>
                  <p className="text-gray-700 text-sm">
                    Créditos sobre fertilizantes, defensivos, sementes, energia rural. 
                    Setor já exporta muito, ressarcimento potencializa ainda mais.
                  </p>
                </div>

                <div className="bg-purple-50 p-5 rounded-lg border-2 border-purple-200">
                  <h3 className="font-bold text-gray-800 mb-3">📱 Tecnologia</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    <strong>Ganho:</strong> +10-15% competitividade
                  </p>
                  <p className="text-gray-700 text-sm">
                    Créditos sobre componentes importados, energia data centers, serviços cloud. 
                    Favorece exportação de software e serviços digitais.
                  </p>
                </div>

                <div className="bg-orange-50 p-5 rounded-lg border-2 border-orange-200">
                  <h3 className="font-bold text-gray-800 mb-3">✈️ Aeronáutica</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    <strong>Ganho:</strong> +12-18% competitividade
                  </p>
                  <p className="text-gray-700 text-sm">
                    Alto valor agregado, muitos insumos. Ressarcimento de milhões em créditos 
                    melhora fluxo de caixa de projetos de longo prazo.
                  </p>
                </div>

                <div className="bg-teal-50 p-5 rounded-lg border-2 border-teal-200">
                  <h3 className="font-bold text-gray-800 mb-3">🍖 Frigoríficos</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    <strong>Ganho:</strong> +18-22% competitividade
                  </p>
                  <p className="text-gray-700 text-sm">
                    Créditos sobre compra de gado, ração, energia de refrigeração, embalagens. 
                    Exportação de carne/frango se torna mais competitiva.
                  </p>
                </div>

                <div className="bg-pink-50 p-5 rounded-lg border-2 border-pink-200">
                  <h3 className="font-bold text-gray-800 mb-3">👗 Têxtil/Calçados</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    <strong>Ganho:</strong> +15-20% competitividade
                  </p>
                  <p className="text-gray-700 text-sm">
                    Créditos sobre tecidos, couro, aviamentos, energia, logística. 
                    Setor pode retomar competitividade perdida para Ásia.
                  </p>
                </div>
              </div>
            </div>

            {/* Prazo de Ressarcimento */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-3 text-xl flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                ⏱️ Prazo para Ressarcimento
              </h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>1. Solicitação:</strong> Após fechar o mês, você solicita ressarcimento via portal da Receita Federal 
                  (sistema digital integrado com SPED).
                </p>
                <p>
                  <strong>2. Análise:</strong> Receita tem até <strong>60 dias</strong> para analisar e aprovar o ressarcimento 
                  (cruzamento automático de dados).
                </p>
                <p>
                  <strong>3. Pagamento:</strong> Crédito depositado na conta da empresa ou compensado com outros tributos federais.
                </p>
                <p className="font-bold text-yellow-700 mt-4">
                  ⚡ Processo muito mais rápido que o atual (que pode levar anos para ICMS/IPI)!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Exemplo Prático */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            💼 Exemplo Prático: Exportador de Soja
          </h2>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-4">🌾 Cooperativa Agrícola - Mês de Janeiro</h3>
            
            <div className="space-y-4 text-gray-700">
              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-2">📦 Exportação de Soja</p>
                <p>Receita: <strong className="text-blue-600">R$ 10.000.000</strong></p>
                <p>Débito IVA: <strong className="text-green-600">R$ 0 (alíquota ZERO)</strong></p>
              </div>

              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-2">💰 Gastos (Geram Crédito 26,5%)</p>
                <ul className="space-y-2 ml-4">
                  <li>• Compra de soja dos produtores: R$ 6.500.000 → Crédito: <strong className="text-green-600">R$ 1.722.500</strong></li>
                  <li>• Frete até porto: R$ 300.000 → Crédito: <strong className="text-green-600">R$ 79.500</strong></li>
                  <li>• Armazenagem/secagem: R$ 200.000 → Crédito: <strong className="text-green-600">R$ 53.000</strong></li>
                  <li>• Energia elétrica: R$ 150.000 → Crédito: <strong className="text-green-600">R$ 39.750</strong></li>
                  <li>• Despachante/certificações: R$ 100.000 → Crédito: <strong className="text-green-600">R$ 26.500</strong></li>
                </ul>
                <p className="mt-3 font-bold text-green-600 text-lg">Total Créditos: R$ 1.921.250</p>
              </div>

              <div className="bg-green-100 p-4 rounded border-2 border-green-500">
                <p className="font-semibold mb-2">✅ Ressarcimento a Receber</p>
                <p className="text-3xl font-bold text-green-600">R$ 1.921.250</p>
                <p className="text-gray-700 mt-3">
                  Em até 60 dias, a cooperativa recebe <strong>R$ 1,9 milhão</strong> de volta no caixa! 
                  Isso melhora drasticamente o capital de giro e permite novos investimentos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Artigo SEO */}
        <article className="bg-white rounded-xl shadow-lg p-8 mt-8 prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Exportações com IBS/CBS: Alíquota ZERO + Ressarcimento Integral dos Créditos
          </h2>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 mb-8 rounded">
            <p className="text-gray-700 text-lg leading-relaxed">
              Exportadores brasileiros terão <strong>imunidade tributária</strong> (alíquota zero) de IBS/CBS e direito a
              <strong> ressarcimento integral em dinheiro</strong> de todos os créditos acumulados. Esse novo modelo elimina
              o problema histórico de créditos "travados" e melhora drasticamente o <strong>fluxo de caixa</strong> e a
              <strong> competitividade internacional</strong> das empresas brasileiras. Entenda como funciona e quanto sua
              empresa pode recuperar.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🌍 Como Funciona a Tributação de Exportações no IBS/CBS?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A Constituição Federal garante <strong>imunidade tributária</strong> para exportações (Art. 156-A, §5º e Art. 195-A, §5º).
            Isso significa que vendas para o exterior têm <strong>alíquota ZERO</strong> de IBS e CBS, assim como hoje já ocorre
            com ICMS, IPI e PIS/COFINS.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-3">🎯 Os 3 Pilares do Novo Sistema</h4>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong className="text-blue-600">1. Alíquota ZERO nas vendas:</strong> Exportações não geram débito de IVA.
                Você vende R$ 1 milhão ao exterior → débito = R$ 0.
              </p>
              <p>
                <strong className="text-green-600">2. Crédito PLENO nas compras:</strong> Você toma crédito de 26,5% sobre TODOS
                os gastos (insumos, frete, energia, serviços, etc.).
              </p>
              <p>
                <strong className="text-purple-600">3. Ressarcimento em DINHEIRO:</strong> Como não há débito para compensar, você
                solicita ressarcimento e a Receita devolve 100% dos créditos em até 60 dias.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            💰 O Que É o Ressarcimento de Créditos?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Ressarcimento</strong> é a devolução em dinheiro dos créditos de IVA acumulados quando não há débito suficiente
            para compensar. Para exportadores (que têm débito ZERO), o ressarcimento é a regra, não a exceção.
          </p>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-4">📊 Exemplo Numérico Simples</h4>
            <div className="space-y-3 text-gray-700">
              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-2">Sua empresa exportadora:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Vendeu R$ 500.000 ao exterior → Débito IVA: <strong className="text-red-600">R$ 0</strong></li>
                  <li>• Comprou R$ 300.000 em insumos → Crédito: <strong className="text-green-600">R$ 79.500</strong> (26,5%)</li>
                  <li>• Pagou R$ 50.000 em frete → Crédito: <strong className="text-green-600">R$ 13.250</strong> (26,5%)</li>
                  <li>• Outros gastos R$ 50.000 → Crédito: <strong className="text-green-600">R$ 13.250</strong> (26,5%)</li>
                </ul>
              </div>
              <div className="bg-green-100 p-4 rounded border-2 border-green-500">
                <p className="font-semibold mb-2">Resultado:</p>
                <p className="text-xl">Créditos: R$ 106.000 - Débitos: R$ 0 = <strong className="text-green-600 text-2xl">Ressarcimento: R$ 106.000</strong></p>
                <p className="mt-2">✅ Você recebe <strong>R$ 106 mil em dinheiro</strong> da Receita Federal!</p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🆚 Comparação: Sistema Atual vs. IBS/CBS
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Veja as diferenças entre o tratamento atual de exportações e o novo sistema:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gradient-to-r from-red-100 to-green-100">
                <tr>
                  <th className="px-6 py-3 border-b text-left font-semibold text-gray-800">Aspecto</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Sistema Atual<br/>(2025)</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Sistema Novo<br/>(IBS/CBS)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b font-medium">Alíquota exportação</td>
                  <td className="px-6 py-4 border-b text-center">0% (isento)</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">0% (imune)</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b font-medium">Taxa de crédito</td>
                  <td className="px-6 py-4 border-b text-center">9,25% (PIS/Cofins)</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">26,5% (IBS/CBS)</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b font-medium">Abrangência créditos</td>
                  <td className="px-6 py-4 border-b text-center">Limitada (só insumos diretos)</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">Plena (todos gastos)</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b font-medium">ICMS crédito</td>
                  <td className="px-6 py-4 border-b text-center text-red-600">Acumula, difícil ressarcir</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">Ressarcimento automático</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b font-medium">IPI crédito</td>
                  <td className="px-6 py-4 border-b text-center text-red-600">Acumula, difícil ressarcir</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">Ressarcimento automático</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b font-medium">Prazo ressarcimento</td>
                  <td className="px-6 py-4 border-b text-center text-red-600">Anos (burocrático)</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">60 dias (digital)</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b font-medium">Energia elétrica</td>
                  <td className="px-6 py-4 border-b text-center text-red-600">Não gera crédito</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">Crédito 26,5%</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b font-medium">Serviços (ISS)</td>
                  <td className="px-6 py-4 border-b text-center text-red-600">Não gera crédito</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">Crédito 26,5%</td>
                </tr>
                <tr className="bg-green-50 font-bold">
                  <td className="px-6 py-4 font-bold text-gray-800">Impacto Final</td>
                  <td className="px-6 py-4 text-center text-red-600">Créditos travados</td>
                  <td className="px-6 py-4 text-center text-green-600">+20-30% competitividade</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🚀 Por Que o Novo Sistema É Melhor para Exportadores?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            O sistema IBS/CBS resolve 3 grandes problemas históricos dos exportadores brasileiros:
          </p>

          <div className="space-y-6 mb-6">
            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-gray-800 mb-3">❌ Problema 1: Créditos de ICMS Travados</h4>
              <p className="text-gray-700 mb-3">
                <strong>Hoje:</strong> Exportadores acumulam créditos de ICMS que ficam "presos" nos estados. Ressarcimento
                pode levar <strong>anos</strong> e depende de disponibilidade orçamentária estadual. Muitas empresas têm
                <strong> milhões em créditos</strong> que nunca conseguem recuperar.
              </p>
              <p className="text-green-700 font-semibold">
                ✅ <strong>Solução IBS/CBS:</strong> Ressarcimento federal em até 60 dias, processo digital automático,
                sem depender de orçamento estadual.
              </p>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-gray-800 mb-3">❌ Problema 2: Crédito Limitado (Só Insumos Diretos)</h4>
              <p className="text-gray-700 mb-3">
                <strong>Hoje:</strong> PIS/COFINS não-cumulativo só permite crédito sobre insumos "diretos" (matéria-prima).
                Energia, frete internacional, serviços, embalagens secundárias <strong>não geram crédito</strong>. Você
                perde 70-80% dos créditos possíveis.
              </p>
              <p className="text-green-700 font-semibold">
                ✅ <strong>Solução IBS/CBS:</strong> Crédito PLENO sobre TODOS os gastos empresariais (energia, frete,
                serviços, softwares, marketing, etc.). Você recupera até 3x mais.
              </p>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-gray-800 mb-3">❌ Problema 3: Custo Brasil e Guerra Fiscal</h4>
              <p className="text-gray-700 mb-3">
                <strong>Hoje:</strong> 27 legislações estaduais diferentes de ICMS. Guerra fiscal entre estados. Burocracia
                para comprovar exportação e obter isenção/ressarcimento. Custos tributários indiretos elevam preço final.
              </p>
              <p className="text-green-700 font-semibold">
                ✅ <strong>Solução IBS/CBS:</strong> Lei nacional única. Fim da guerra fiscal. Processo digital padronizado.
                Redução do Custo Brasil em 15-25%.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            📋 Como Funciona o Processo de Ressarcimento?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            O processo será simples, digital e rápido. Veja o passo a passo:
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <ol className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</span>
                <div>
                  <p className="font-bold text-gray-800 mb-1">Declare suas operações mensalmente</p>
                  <p className="text-sm">Envie suas notas fiscais de compra e venda via SPED Fiscal (sistema já existente).
                  A Receita calcula automaticamente débitos e créditos.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</span>
                <div>
                  <p className="font-bold text-gray-800 mb-1">Sistema identifica saldo credor</p>
                  <p className="text-sm">Se seus créditos (26,5% dos gastos) superarem os débitos (0% nas exportações),
                  você fica com saldo credor positivo.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</span>
                <div>
                  <p className="font-bold text-gray-800 mb-1">Solicite o ressarcimento online</p>
                  <p className="text-sm">No portal da Receita Federal, clique em "Solicitar Ressarcimento". O sistema
                  já traz os valores pré-calculados. Basta confirmar e enviar.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</span>
                <div>
                  <p className="font-bold text-gray-800 mb-1">Receita analisa (até 60 dias)</p>
                  <p className="text-sm">Cruzamento automático de dados. Se tudo estiver correto (NFes válidas, CNPJ regular),
                  aprovação é automática.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-green-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">5</span>
                <div>
                  <p className="font-bold text-gray-800 mb-1">Receba o dinheiro na conta</p>
                  <p className="text-sm">Receita deposita o valor na conta bancária da empresa ou compensa com outros
                  tributos federais (se houver débitos de IRPJ, CSLL, etc.).</p>
                </div>
              </li>
            </ol>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🏭 Setores Mais Beneficiados
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Alguns setores exportadores terão ganhos extraordinários com o novo sistema:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg">🌾 Agronegócio (Grãos, Carnes)</h4>
              <p className="text-gray-700 text-sm mb-3">
                <strong>Ganho estimado:</strong> +20-30% competitividade
              </p>
              <ul className="text-gray-700 text-sm space-y-1 ml-4">
                <li>• Crédito sobre fertilizantes, defensivos, sementes (hoje 0%)</li>
                <li>• Crédito sobre energia rural/frigoríficos (hoje 0%)</li>
                <li>• Crédito sobre frete até porto (hoje limitado)</li>
                <li>• Ressarcimento rápido melhora capital de giro</li>
              </ul>
              <p className="text-green-700 font-semibold mt-3">
                💰 Exportador de soja: de R$ 500k a R$ 1,5M recuperados/ano
              </p>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg">🚗 Indústria Automotiva</h4>
              <p className="text-gray-700 text-sm mb-3">
                <strong>Ganho estimado:</strong> +15-20% competitividade
              </p>
              <ul className="text-gray-700 text-sm space-y-1 ml-4">
                <li>• Alto volume de autopeças (60-70% do preço)</li>
                <li>• Crédito sobre energia industrial (hoje 0%)</li>
                <li>• Crédito sobre serviços engenharia/logística</li>
                <li>• Fim de créditos de IPI travados</li>
              </ul>
              <p className="text-blue-700 font-semibold mt-3">
                💰 Montadora: de R$ 10M a R$ 30M recuperados/ano
              </p>
            </div>

            <div className="bg-purple-50 p-5 rounded-lg border-2 border-purple-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg">✈️ Aeronáutica (Embraer, etc.)</h4>
              <p className="text-gray-700 text-sm mb-3">
                <strong>Ganho estimado:</strong> +12-18% competitividade
              </p>
              <ul className="text-gray-700 text-sm space-y-1 ml-4">
                <li>• Alto valor agregado, ciclo longo produção</li>
                <li>• Muitos insumos importados com IVA</li>
                <li>• Crédito sobre P&D, engenharia, certificações</li>
                <li>• Ressarcimento de milhões melhora fluxo projetos</li>
              </ul>
              <p className="text-purple-700 font-semibold mt-3">
                💰 Fabricante aeronaves: R$ 50M+ recuperados/ano
              </p>
            </div>

            <div className="bg-orange-50 p-5 rounded-lg border-2 border-orange-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg">📱 Tecnologia (Hardware, Software)</h4>
              <p className="text-gray-700 text-sm mb-3">
                <strong>Ganho estimado:</strong> +10-15% competitividade
              </p>
              <ul className="text-gray-700 text-sm space-y-1 ml-4">
                <li>• Crédito sobre componentes eletrônicos</li>
                <li>• Crédito sobre energia data centers (hoje 0%)</li>
                <li>• Crédito sobre cloud, serviços digitais</li>
                <li>• Exportação software também beneficiada</li>
              </ul>
              <p className="text-orange-700 font-semibold mt-3">
                💰 Exportador tech: R$ 2M a R$ 8M recuperados/ano
              </p>
            </div>

            <div className="bg-teal-50 p-5 rounded-lg border-2 border-teal-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg">👗 Têxtil e Calçados</h4>
              <p className="text-gray-700 text-sm mb-3">
                <strong>Ganho estimado:</strong> +15-20% competitividade
              </p>
              <ul className="text-gray-700 text-sm space-y-1 ml-4">
                <li>• Crédito sobre tecidos, couro, aviamentos</li>
                <li>• Crédito sobre energia têxtil (hoje 0%)</li>
                <li>• Setor pode retomar competitividade vs. Ásia</li>
                <li>• Emprego intensivo mão-de-obra beneficiado</li>
              </ul>
              <p className="text-teal-700 font-semibold mt-3">
                💰 Exportador têxtil: R$ 1M a R$ 5M recuperados/ano
              </p>
            </div>

            <div className="bg-pink-50 p-5 rounded-lg border-2 border-pink-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg">🔩 Metalurgia e Siderurgia</h4>
              <p className="text-gray-700 text-sm mb-3">
                <strong>Ganho estimado:</strong> +18-25% competitividade
              </p>
              <ul className="text-gray-700 text-sm space-y-1 ml-4">
                <li>• Crédito sobre minério, energia elétrica massiva</li>
                <li>• Crédito sobre frete ferroviário até porto</li>
                <li>• Fim de guerra fiscal entre estados mineradores</li>
                <li>• Aço/alumínio brasileiros mais competitivos</li>
              </ul>
              <p className="text-pink-700 font-semibold mt-3">
                💰 Siderúrgica: R$ 30M a R$ 100M recuperados/ano
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            💡 Casos Especiais de Exportação
          </h3>
          
          <div className="space-y-6 mb-6">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-bold text-gray-800 mb-3">1️⃣ Exportação Indireta (Trading Companies)</h4>
              <p className="text-gray-700 mb-3">
                <strong>Como funciona:</strong> Você vende para uma trading company no Brasil, que revende ao exterior.
              </p>
              <p className="text-gray-700">
                <strong>Tratamento IBS/CBS:</strong> Sua venda para a trading é equiparada a exportação (alíquota zero)
                se houver <strong>comprovação de que será exportada</strong>. Você também tem direito a ressarcimento dos créditos.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <h4 className="font-bold text-gray-800 mb-3">2️⃣ Regimes Especiais (Drawback, Recof, etc.)</h4>
              <p className="text-gray-700 mb-3">
                <strong>Drawback:</strong> Suspensão de tributos na importação de insumos para produção de exportáveis.
              </p>
              <p className="text-gray-700">
                <strong>Com IBS/CBS:</strong> Drawback continua existindo, mas perde relevância. Como você já tem crédito
                pleno e ressarcimento rápido, não precisa tanto de suspensão. Mas se usar, não poderá creditar o IVA suspenso.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-bold text-gray-800 mb-3">3️⃣ Zona Franca de Manaus (ZFM)</h4>
              <p className="text-gray-700 mb-3">
                <strong>Situação:</strong> ZFM tem isenções de IPI/PIS/COFINS hoje. Como fica com IBS/CBS?
              </p>
              <p className="text-gray-700">
                <strong>Transição:</strong> Constituição garante manutenção dos benefícios da ZFM até 2073. Haverá
                <strong> regime especial</strong> com redução de alíquota ou crédito presumido para equiparar vantagem atual.
              </p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-bold text-gray-800 mb-3">4️⃣ Serviços Prestados ao Exterior</h4>
              <p className="text-gray-700 mb-3">
                <strong>Exemplo:</strong> Software, consultoria, engenharia, call center para clientes estrangeiros.
              </p>
              <p className="text-gray-700">
                <strong>Tratamento:</strong> Equiparado a exportação! Alíquota zero + direito a ressarcimento de créditos.
                Isso é <strong>novidade</strong> — hoje ISS sobre serviços não permite crédito pleno.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            ⚠️ Requisitos para Ter Direito ao Ressarcimento
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Para solicitar ressarcimento, sua empresa precisa cumprir alguns requisitos:
          </p>

          <div className="bg-yellow-50 p-6 rounded-lg mb-6">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">✓</span>
                <p><strong>Regularidade fiscal:</strong> Estar em dia com obrigações tributárias (não ter débitos pendentes
                de IRPJ, CSLL, PIS, Cofins, FGTS, etc.).</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">✓</span>
                <p><strong>Documentação válida:</strong> Todas as NFes de compra devem ter IBS/CBS destacado. Sem nota
                fiscal, não há crédito.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">✓</span>
                <p><strong>Comprovação da exportação:</strong> Registro de Exportação (RE) na Siscomex, Conhecimento de Embarque,
                fatura comercial, etc.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">✓</span>
                <p><strong>Vinculação dos créditos:</strong> Créditos devem estar relacionados à atividade exportadora.
                Gastos pessoais dos sócios não geram crédito.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">✓</span>
                <p><strong>Prazo de solicitação:</strong> Ressarcimento deve ser solicitado em até 5 anos após a operação
                (prazo prescricional).</p>
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            📊 Impacto Macroeconômico das Exportações
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            O novo tratamento de exportações deve impulsionar a balança comercial brasileira:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">✅ Benefícios Esperados</h4>
              <ul className="text-gray-700 space-y-2 text-sm ml-4">
                <li>• <strong>+20-30% competitividade:</strong> Produtos brasileiros mais baratos no mercado global</li>
                <li>• <strong>+15-25% exportações:</strong> Projeção de crescimento das vendas externas (US$ 100B adicionais/ano)</li>
                <li>• <strong>Atração de investimentos:</strong> Empresas estrangeiras podem instalar plantas no Brasil para exportar</li>
                <li>• <strong>Geração de empregos:</strong> Setores exportadores empregam 8 milhões diretamente</li>
                <li>• <strong>Superávit comercial:</strong> Balança comercial mais positiva, fortalece real</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">📈 Projeções (2027-2035)</h4>
              <ul className="text-gray-700 space-y-2 text-sm ml-4">
                <li>• <strong>PIB:</strong> +0,5-1% ao ano pelo efeito exportador</li>
                <li>• <strong>Arrecadação:</strong> Governo devolve R$ 50-80B/ano em ressarcimentos, mas arrecada R$ 150B+ a mais no mercado interno</li>
                <li>• <strong>Empregos:</strong> +2-3 milhões de postos em setores exportadores</li>
                <li>• <strong>Investimentos:</strong> +R$ 200-300B em plantas industriais voltadas à exportação</li>
                <li>• <strong>Reservas:</strong> Entrada de US$ 50-100B adicionais/ano fortalece reservas internacionais</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            📅 Cronograma de Implantação
          </h3>
          <div className="bg-purple-50 p-6 rounded-lg mb-6">
            <div className="space-y-3 text-gray-700">
              <p><strong>2026:</strong> Período de teste (1% IBS + 0,9% CBS) - Exportação já tem alíquota zero. 
              Ressarcimento começa em escala reduzida.</p>
              <p><strong>2027:</strong> Transição (8,8%) - Alíquota zero mantida. Ressarcimento proporcional (8,8% dos gastos).</p>
              <p><strong>2028-2032:</strong> Aumento gradual - Exportação sempre zero. Ressarcimento cresce proporcionalmente.</p>
              <p><strong>2033:</strong> Sistema pleno (26,5%) - Exportação zero + <strong>ressarcimento INTEGRAL</strong> (26,5%).</p>
              <p className="font-bold text-purple-700 mt-4">
                ✅ Benefício começa desde 2026, mas atinge plenitude em 2033!
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            ❓ Perguntas Frequentes (FAQ)
          </h3>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">1. Exportação indireta também tem alíquota zero?</h4>
              <p className="text-gray-700">
                <strong>Sim.</strong> Venda para trading company que comprova exportação posterior é equiparada a exportação
                direta, com alíquota zero e direito a ressarcimento.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">2. Quanto tempo demora para receber o ressarcimento?</h4>
              <p className="text-gray-700">
                <strong>Até 60 dias</strong> após a solicitação, se tudo estiver regular. Processo digital automático com
                cruzamento de dados do SPED.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">3. Posso usar créditos de exportação para pagar IVA do mercado interno?</h4>
              <p className="text-gray-700">
                <strong>Sim.</strong> Se você exporta 70% e vende 30% internamente, créditos compensam primeiro o débito
                interno. Só o saldo excedente é ressarcido.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">4. Serviços ao exterior também são isentos?</h4>
              <p className="text-gray-700">
                <strong>Sim!</strong> Prestação de serviços a clientes no exterior (software, consultoria, engenharia) é
                equiparada a exportação: alíquota zero + ressarcimento.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">5. Drawback ainda vale a pena?</h4>
              <p className="text-gray-700">
                <strong>Depende.</strong> Com crédito pleno e ressarcimento rápido, drawback perde atratividade. Mas pode
                ser útil em casos específicos (prazo longo produção). Avalie com contador.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">6. E se a Receita negar meu ressarcimento?</h4>
              <p className="text-gray-700">
                <strong>Você pode:</strong> (1) Regularizar pendências e solicitar novamente; (2) Apresentar impugnação
                administrativa; (3) Entrar com ação judicial. Lei garante direito ao ressarcimento se requisitos cumpridos.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">7. Créditos de IBS e CBS são ressarcidos juntos?</h4>
              <p className="text-gray-700">
                <strong>Separadamente.</strong> IBS (estadual/municipal) e CBS (federal) são tributos distintos. Você fará
                duas solicitações: uma ao Comitê Gestor IBS e outra à Receita Federal (CBS).
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg mt-8 border-l-4 border-green-500">
            <h4 className="font-bold text-gray-800 mb-3">🎯 Conclusão</h4>
            <p className="text-gray-700 leading-relaxed">
              O novo tratamento de <strong>exportações com IBS/CBS</strong> é revolucionário para a competitividade brasileira.
              Com <strong>alíquota zero</strong>, <strong>crédito pleno de 26,5%</strong> e <strong>ressarcimento em 60 dias</strong>,
              exportadores terão ganho de competitividade entre <strong>15-30%</strong>, dependendo do setor. Isso pode
              adicionar <strong>US$ 100 bilhões/ano</strong> às exportações brasileiras e criar <strong>milhões de empregos</strong>.
              Prepare-se desde já: organize suas notas fiscais, implemente ERP integrado ao SPED e aproveite esse benefício
              histórico a partir de 2026!
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mt-6">
            <p className="text-gray-700">
              <strong>⚠️ Aviso Legal:</strong> Este artigo tem caráter informativo e educacional. O ressarcimento de créditos
              de IVA em exportações está garantido pela Constituição (EC 132/2023), mas regulamentação detalhada será definida
              por lei complementar. Prazos e procedimentos podem variar. Consulte contador especializado em comércio exterior
              para planejamento específico.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg mt-6">
            <p className="text-sm text-gray-600">
              <strong>Fontes Legais:</strong> Emenda Constitucional 132/2023 (Art. 156-A, §5º e Art. 195-A, §5º), 
              Lei Complementar em tramitação (regulamentação ressarcimento), 
              Projeto de Lei Complementar sobre créditos de IVA em exportações.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default SimuladorExportacao;

import React, { useState } from 'react';
import { Calculator, TrendingUp, Package, Truck, ShoppingCart, DollarSign, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const PainelCreditosAcumulados = () => {
  const [setor, setSetor] = useState('ecommerce');
  const [comprasInsumos, setComprasInsumos] = useState('');
  const [estoques, setEstoques] = useState('');
  const [freteCompras, setFreteCompras] = useState('');
  const [outrosGastos, setOutrosGastos] = useState('');
  const [periodoMeses, setPeriodoMeses] = useState(1);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  // Percentuais de crédito por tipo de gasto
  const taxaCreditoInsumos = 0.265; // 26,5% sobre compras de insumos
  const taxaCreditoFrete = 0.265; // 26,5% sobre frete
  const taxaCreditoEstoques = 0.265; // 26,5% sobre estoques
  const taxaCreditoOutros = 0.265; // 26,5% sobre outros gastos operacionais

  const setoresConfig = [
    {
      id: 'ecommerce',
      nome: 'E-commerce',
      icon: '🛒',
      cor: 'blue',
      descricao: 'Varejo online com compra de mercadorias para revenda',
      exemplosInsumos: ['Produtos para revenda', 'Embalagens', 'Etiquetas', 'Material marketing'],
      exemplosEstoques: ['Mercadorias em estoque', 'Produtos em trânsito', 'Embalagens estocadas'],
      exemplosFrete: ['Frete compras', 'Transporte fornecedor', 'Logística inbound'],
      exemplosOutros: ['Software ERP', 'Plataforma e-commerce', 'Gateway pagamento', 'Serviços contábeis']
    },
    {
      id: 'industria',
      nome: 'Indústria',
      icon: '🏭',
      cor: 'purple',
      descricao: 'Produção industrial com transformação de matéria-prima',
      exemplosInsumos: ['Matéria-prima', 'Componentes', 'Insumos produção', 'Embalagens'],
      exemplosEstoques: ['Matéria-prima estocada', 'Produtos em elaboração', 'Produtos acabados'],
      exemplosFrete: ['Frete matéria-prima', 'Transporte insumos', 'Logística fornecedores'],
      exemplosOutros: ['Energia elétrica industrial', 'Manutenção máquinas', 'Ferramentas', 'EPI']
    },
    {
      id: 'atacado',
      nome: 'Atacado/Distribuição',
      icon: '📦',
      cor: 'green',
      descricao: 'Atacado e distribuição com grande volume de compras',
      exemplosInsumos: ['Mercadorias revenda', 'Embalagens atacado', 'Paletes', 'Material paletização'],
      exemplosEstoques: ['Estoque mercadorias', 'Produtos centro distribuição', 'Embalagens'],
      exemplosFrete: ['Frete compras volume', 'Transporte fornecedores', 'Cross-docking'],
      exemplosOutros: ['Armazém terceirizado', 'WMS', 'Equipamentos handling', 'Empilhadeiras']
    },
    {
      id: 'servicos',
      nome: 'Serviços B2B',
      icon: '💼',
      cor: 'orange',
      descricao: 'Prestação de serviços empresariais com insumos',
      exemplosInsumos: ['Materiais consumíveis', 'Ferramentas', 'Equipamentos', 'Softwares'],
      exemplosEstoques: ['Materiais estocados', 'Equipamentos reserva', 'Peças reposição'],
      exemplosFrete: ['Frete equipamentos', 'Transporte materiais', 'Logística projetos'],
      exemplosOutros: ['Softwares gestão', 'Treinamentos', 'Certificações', 'Consultorias']
    }
  ];

  const calcular = () => {
    if (!comprasInsumos || !estoques || !freteCompras || !outrosGastos) {
      alert('Preencha todos os campos para calcular os créditos acumulados.');
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

  const setorAtual = setoresConfig.find(s => s.id === setor);

  // Cálculos
  const comprasInsumosNum = parseFloat(comprasInsumos) || 0;
  const estoquesNum = parseFloat(estoques) || 0;
  const freteComprasNum = parseFloat(freteCompras) || 0;
  const outrosGastosNum = parseFloat(outrosGastos) || 0;

  const creditoInsumos = comprasInsumosNum * taxaCreditoInsumos;
  const creditoEstoques = estoquesNum * taxaCreditoEstoques;
  const creditoFrete = freteComprasNum * taxaCreditoFrete;
  const creditoOutros = outrosGastosNum * taxaCreditoOutros;

  const totalGastos = comprasInsumosNum + estoquesNum + freteComprasNum + outrosGastosNum;
  const totalCreditos = creditoInsumos + creditoEstoques + creditoFrete + creditoOutros;

  const creditoMensal = totalCreditos;
  const creditoTrimestral = totalCreditos * 3;
  const creditoSemestral = totalCreditos * 6;
  const creditoAnual = totalCreditos * 12;

  const percentualCredito = totalGastos > 0 ? (totalCreditos / totalGastos) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Painel de Créditos Acumulados IVA
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calcule os créditos acumulados de IBS/CBS sobre compras de insumos, estoques, frete e outros gastos operacionais.
            Veja quanto sua empresa pode recuperar mensalmente no novo sistema tributário.
          </p>
        </div>

        {/* Alerta informativo */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-800 mb-2">💡 Como Funciona o Crédito de IVA?</h3>
            <p className="text-gray-700 leading-relaxed">
              No sistema IBS/CBS, empresas podem <strong>tomar crédito de 26,5%</strong> sobre todas as compras de insumos,
              mercadorias, serviços e despesas operacionais. Esses créditos são <strong>acumulados mensalmente</strong> e podem
              ser <strong>compensados</strong> com o IVA devido nas vendas. Se os créditos superarem o débito, o saldo pode
              ser transferido para outros meses ou até mesmo ressarcido em dinheiro (exportadores).
            </p>
          </div>
        </div>

        {/* Seletor de Setor */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Selecione o Setor da Sua Empresa
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {setoresConfig.map((s) => (
              <button
                key={s.id}
                onClick={() => setSetor(s.id)}
                className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                  setor === s.id
                    ? `border-${s.cor}-500 bg-${s.cor}-50 shadow-lg`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{s.nome}</h3>
                <p className="text-sm text-gray-600">{s.descricao}</p>
                {setor === s.id && (
                  <div className="mt-3 flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Selecionado</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Formulário de Entrada */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            Informe Seus Gastos Mensais
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Compras de Insumos */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <ShoppingCart className="inline w-5 h-5 mr-2 text-blue-600" />
                Compras de Insumos (R$)
              </label>
              <input
                type="number"
                value={comprasInsumos}
                onChange={(e) => setComprasInsumos(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Ex: 50000"
              />
              <div className="mt-2 text-sm text-gray-600">
                <strong>Exemplos {setorAtual.nome}:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {setorAtual.exemplosInsumos.map((ex, idx) => (
                    <li key={idx}>{ex}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Estoques */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <Package className="inline w-5 h-5 mr-2 text-purple-600" />
                Valor dos Estoques (R$)
              </label>
              <input
                type="number"
                value={estoques}
                onChange={(e) => setEstoques(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="Ex: 30000"
              />
              <div className="mt-2 text-sm text-gray-600">
                <strong>Exemplos {setorAtual.nome}:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {setorAtual.exemplosEstoques.map((ex, idx) => (
                    <li key={idx}>{ex}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Frete de Compras */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <Truck className="inline w-5 h-5 mr-2 text-green-600" />
                Frete de Compras (R$)
              </label>
              <input
                type="number"
                value={freteCompras}
                onChange={(e) => setFreteCompras(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                placeholder="Ex: 5000"
              />
              <div className="mt-2 text-sm text-gray-600">
                <strong>Exemplos {setorAtual.nome}:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {setorAtual.exemplosFrete.map((ex, idx) => (
                    <li key={idx}>{ex}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Outros Gastos Operacionais */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <DollarSign className="inline w-5 h-5 mr-2 text-orange-600" />
                Outros Gastos Operacionais (R$)
              </label>
              <input
                type="number"
                value={outrosGastos}
                onChange={(e) => setOutrosGastos(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="Ex: 15000"
              />
              <div className="mt-2 text-sm text-gray-600">
                <strong>Exemplos {setorAtual.nome}:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {setorAtual.exemplosOutros.map((ex, idx) => (
                    <li key={idx}>{ex}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={calcular}
            className="mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
          >
            <Calculator className="w-6 h-6" />
            Calcular Créditos Acumulados
          </button>
        </div>

        {/* Resultados */}
        {mostrarResultado && (
          <div className="space-y-8">
            {/* Resumo Total */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-10 h-10" />
                <h2 className="text-3xl font-bold">Créditos Acumulados Mensal</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-green-100 text-lg mb-2">Total de Gastos</p>
                  <p className="text-5xl font-bold">{formatarMoeda(totalGastos)}</p>
                </div>
                <div>
                  <p className="text-green-100 text-lg mb-2">Créditos IVA Recuperáveis</p>
                  <p className="text-5xl font-bold">{formatarMoeda(totalCreditos)}</p>
                  <p className="text-green-100 mt-2">
                    ({formatarPercentual(percentualCredito)} dos gastos)
                  </p>
                </div>
              </div>
            </div>

            {/* Detalhamento por Tipo de Gasto */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Detalhamento dos Créditos por Categoria
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Insumos */}
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                  <ShoppingCart className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-bold text-gray-800 mb-2">Compras de Insumos</h3>
                  <p className="text-gray-600 text-sm mb-3">Base: {formatarMoeda(comprasInsumosNum)}</p>
                  <p className="text-blue-600 text-2xl font-bold">{formatarMoeda(creditoInsumos)}</p>
                  <p className="text-gray-600 text-sm mt-1">26,5% de crédito</p>
                </div>

                {/* Estoques */}
                <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                  <Package className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-bold text-gray-800 mb-2">Estoques</h3>
                  <p className="text-gray-600 text-sm mb-3">Base: {formatarMoeda(estoquesNum)}</p>
                  <p className="text-purple-600 text-2xl font-bold">{formatarMoeda(creditoEstoques)}</p>
                  <p className="text-gray-600 text-sm mt-1">26,5% de crédito</p>
                </div>

                {/* Frete */}
                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                  <Truck className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-bold text-gray-800 mb-2">Frete de Compras</h3>
                  <p className="text-gray-600 text-sm mb-3">Base: {formatarMoeda(freteComprasNum)}</p>
                  <p className="text-green-600 text-2xl font-bold">{formatarMoeda(creditoFrete)}</p>
                  <p className="text-gray-600 text-sm mt-1">26,5% de crédito</p>
                </div>

                {/* Outros */}
                <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
                  <DollarSign className="w-8 h-8 text-orange-600 mb-3" />
                  <h3 className="font-bold text-gray-800 mb-2">Outros Gastos</h3>
                  <p className="text-gray-600 text-sm mb-3">Base: {formatarMoeda(outrosGastosNum)}</p>
                  <p className="text-orange-600 text-2xl font-bold">{formatarMoeda(creditoOutros)}</p>
                  <p className="text-gray-600 text-sm mt-1">26,5% de crédito</p>
                </div>
              </div>
            </div>

            {/* Projeções Temporais */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Projeção de Créditos Acumulados
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-300">
                  <p className="text-gray-700 font-semibold mb-2">📅 Mensal</p>
                  <p className="text-blue-600 text-3xl font-bold">{formatarMoeda(creditoMensal)}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-300">
                  <p className="text-gray-700 font-semibold mb-2">📅 Trimestral</p>
                  <p className="text-purple-600 text-3xl font-bold">{formatarMoeda(creditoTrimestral)}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-300">
                  <p className="text-gray-700 font-semibold mb-2">📅 Semestral</p>
                  <p className="text-green-600 text-3xl font-bold">{formatarMoeda(creditoSemestral)}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border-2 border-orange-300">
                  <p className="text-gray-700 font-semibold mb-2">📅 Anual</p>
                  <p className="text-orange-600 text-3xl font-bold">{formatarMoeda(creditoAnual)}</p>
                </div>
              </div>
            </div>

            {/* Como Utilizar os Créditos */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-3 text-xl flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                Como Utilizar Seus Créditos Acumulados?
              </h3>
              <div className="space-y-3 text-gray-700">
                <div>
                  <strong className="text-blue-600">1. Compensação com Débitos:</strong>
                  <p className="ml-4">Use os créditos para abater o IVA devido nas suas vendas. Se você vendeu R$ 200.000 
                  (débito R$ 53.000) e tem R$ {formatarMoeda(totalCreditos).slice(3)} de créditos, pagará apenas 
                  R$ {formatarMoeda(53000 - totalCreditos).slice(3)}.</p>
                </div>
                <div>
                  <strong className="text-green-600">2. Transferência entre Períodos:</strong>
                  <p className="ml-4">Se seus créditos superarem os débitos em um mês, transfira o saldo para os próximos meses.</p>
                </div>
                <div>
                  <strong className="text-purple-600">3. Ressarcimento (Exportadores):</strong>
                  <p className="ml-4">Exportadores podem solicitar ressarcimento em dinheiro dos créditos acumulados, 
                  já que exportações são tributadas com alíquota zero.</p>
                </div>
                <div>
                  <strong className="text-orange-600">4. Compensação com Outros Tributos:</strong>
                  <p className="ml-4">Em alguns casos, créditos podem ser usados para pagar outros tributos federais.</p>
                </div>
              </div>
            </div>

            {/* Tabela Comparativa por Setor */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                💼 Comparação: Créditos por Setor (Base R$ 100.000 mensais)
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
                    <tr>
                      <th className="px-6 py-3 border-b text-left font-semibold text-gray-800">Setor</th>
                      <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Compras</th>
                      <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Estoques</th>
                      <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Frete</th>
                      <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Outros</th>
                      <th className="px-6 py-3 border-b text-center font-semibold text-gray-800 bg-green-200">Créditos</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-blue-50">
                      <td className="px-6 py-4 border-b font-medium">🛒 E-commerce</td>
                      <td className="px-6 py-4 border-b text-center">R$ 50.000</td>
                      <td className="px-6 py-4 border-b text-center">R$ 30.000</td>
                      <td className="px-6 py-4 border-b text-center">R$ 5.000</td>
                      <td className="px-6 py-4 border-b text-center">R$ 15.000</td>
                      <td className="px-6 py-4 border-b text-center font-bold text-green-600">R$ 26.500</td>
                    </tr>
                    <tr className="hover:bg-purple-50">
                      <td className="px-6 py-4 border-b font-medium">🏭 Indústria</td>
                      <td className="px-6 py-4 border-b text-center">R$ 60.000</td>
                      <td className="px-6 py-4 border-b text-center">R$ 20.000</td>
                      <td className="px-6 py-4 border-b text-center">R$ 8.000</td>
                      <td className="px-6 py-4 border-b text-center">R$ 12.000</td>
                      <td className="px-6 py-4 border-b text-center font-bold text-green-600">R$ 26.500</td>
                    </tr>
                    <tr className="hover:bg-green-50">
                      <td className="px-6 py-4 border-b font-medium">📦 Atacado</td>
                      <td className="px-6 py-4 border-b text-center">R$ 70.000</td>
                      <td className="px-6 py-4 border-b text-center">R$ 15.000</td>
                      <td className="px-6 py-4 border-b text-center">R$ 10.000</td>
                      <td className="px-6 py-4 border-b text-center">R$ 5.000</td>
                      <td className="px-6 py-4 border-b text-center font-bold text-green-600">R$ 26.500</td>
                    </tr>
                    <tr className="hover:bg-orange-50">
                      <td className="px-6 py-4 font-medium">💼 Serviços B2B</td>
                      <td className="px-6 py-4 text-center">R$ 30.000</td>
                      <td className="px-6 py-4 text-center">R$ 10.000</td>
                      <td className="px-6 py-4 text-center">R$ 5.000</td>
                      <td className="px-6 py-4 text-center">R$ 55.000</td>
                      <td className="px-6 py-4 text-center font-bold text-green-600">R$ 26.500</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-gray-600 text-sm mt-4">
                <strong>Observação:</strong> Todos os setores recuperam 26,5% dos gastos, mas a composição varia. 
                E-commerce e Atacado têm mais crédito em compras/estoques. Serviços têm mais em "outros gastos" (softwares, consultorias).
              </p>
            </div>

            {/* Cenários de Utilização */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                🎯 Cenários de Utilização dos Créditos
              </h2>

              <div className="space-y-6">
                {/* Cenário 1: Créditos < Débitos */}
                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                  <h3 className="font-bold text-gray-800 mb-3">📊 Cenário 1: Créditos Menores que Débitos</h3>
                  <p className="text-gray-700 mb-3">
                    <strong>Situação:</strong> Você tem {formatarMoeda(totalCreditos)} de créditos, mas suas vendas geraram 
                    {formatarMoeda(totalCreditos * 2)} de débitos.
                  </p>
                  <p className="text-gray-700">
                    <strong>Resultado:</strong> Use todos os créditos para abater. Pagará {formatarMoeda(totalCreditos)} 
                    de IVA líquido ({formatarMoeda(totalCreditos * 2)} débitos - {formatarMoeda(totalCreditos)} créditos).
                  </p>
                </div>

                {/* Cenário 2: Créditos > Débitos */}
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-bold text-gray-800 mb-3">📊 Cenário 2: Créditos Maiores que Débitos</h3>
                  <p className="text-gray-700 mb-3">
                    <strong>Situação:</strong> Você tem {formatarMoeda(totalCreditos)} de créditos, mas suas vendas geraram 
                    apenas {formatarMoeda(totalCreditos * 0.5)} de débitos.
                  </p>
                  <p className="text-gray-700">
                    <strong>Resultado:</strong> Não pagará IVA este mês. Saldo de {formatarMoeda(totalCreditos * 0.5)} 
                    fica acumulado para os próximos meses ou pode ser ressarcido (se exportador).
                  </p>
                </div>

                {/* Cenário 3: Exportador */}
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-bold text-gray-800 mb-3">📊 Cenário 3: Empresa Exportadora</h3>
                  <p className="text-gray-700 mb-3">
                    <strong>Situação:</strong> Você exporta 80% da produção (alíquota zero). Tem {formatarMoeda(totalCreditos)} 
                    de créditos, mas débito de apenas {formatarMoeda(totalCreditos * 0.2)} (20% mercado interno).
                  </p>
                  <p className="text-gray-700">
                    <strong>Resultado:</strong> Não pagará IVA. Saldo de {formatarMoeda(totalCreditos * 0.8)} pode ser 
                    <strong> ressarcido em dinheiro</strong> pela Receita Federal, melhorando seu fluxo de caixa.
                  </p>
                </div>
              </div>
            </div>

            {/* Dicas Práticas */}
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-3 text-xl flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-purple-600" />
                Dicas para Maximizar Seus Créditos
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">1.</span>
                  <p><strong>Documente tudo:</strong> Guarde todas as notas fiscais de compras, serviços e despesas operacionais. 
                  Sem documento fiscal, não há crédito.</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">2.</span>
                  <p><strong>Use fornecedores formais:</strong> Compre de fornecedores regularizados que emitem NFe com IBS/CBS. 
                  Compras sem nota não geram crédito.</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">3.</span>
                  <p><strong>Controle o estoque:</strong> Estoques de insumos geram crédito. Mantenha controle rigoroso 
                  (PEPS, UEPS, Médio Ponderado) para justificar o crédito.</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">4.</span>
                  <p><strong>Inclua todos os gastos:</strong> Frete, armazenagem, seguros, embalagens, serviços terceirizados — 
                  tudo gera crédito de 26,5%.</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">5.</span>
                  <p><strong>Planeje-se para exportar:</strong> Exportadores têm direito a ressarcimento em dinheiro. 
                  Se possível, diversifique para mercado externo.</p>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Grid de Setores com Exemplos */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📊 Principais Gastos que Geram Crédito por Setor
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {setoresConfig.map((s) => (
              <div key={s.id} className={`bg-${s.cor}-50 p-6 rounded-lg border-2 border-${s.cor}-200`}>
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-3">{s.nome}</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Insumos:</p>
                    <ul className="list-disc list-inside text-gray-600 ml-2">
                      {s.exemplosInsumos.slice(0, 2).map((ex, idx) => (
                        <li key={idx}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Estoques:</p>
                    <ul className="list-disc list-inside text-gray-600 ml-2">
                      {s.exemplosEstoques.slice(0, 2).map((ex, idx) => (
                        <li key={idx}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Outros:</p>
                    <ul className="list-disc list-inside text-gray-600 ml-2">
                      {s.exemplosOutros.slice(0, 2).map((ex, idx) => (
                        <li key={idx}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Artigo SEO */}
        <article className="bg-white rounded-xl shadow-lg p-8 mt-8 prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Créditos Acumulados de IVA: Como E-commerce e Indústria Recuperam 26,5% dos Gastos
          </h2>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 mb-8 rounded">
            <p className="text-gray-700 text-lg leading-relaxed">
              O sistema IBS/CBS permite que empresas <strong>tomem crédito de 26,5%</strong> sobre todas as compras de insumos,
              mercadorias, serviços e despesas operacionais. Essa sistemática de <strong>não-cumulatividade plena</strong> é uma
              das maiores vantagens da Reforma Tributária, especialmente para e-commerce e indústria que realizam grandes volumes
              de compras. Entenda como acumular, controlar e utilizar esses créditos para reduzir drasticamente sua carga tributária.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            💡 O Que São Créditos Acumulados de IVA?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Créditos de IVA</strong> são valores que a empresa pode <strong>descontar do imposto devido</strong> nas vendas,
            calculados como 26,5% sobre todos os gastos operacionais tributados. O sistema funciona assim:
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-3">🔄 Mecânica do Crédito</h4>
            <div className="space-y-3 text-gray-700">
              <p><strong>1. Débito (Saída):</strong> Nas vendas, você cobra IBS/CBS de 26,5% dos clientes → R$ 100.000 vendas = R$ 26.500 débito</p>
              <p><strong>2. Crédito (Entrada):</strong> Nas compras, você toma crédito de 26,5% dos fornecedores → R$ 60.000 compras = R$ 15.900 crédito</p>
              <p><strong>3. IVA a Pagar:</strong> Débito - Crédito = R$ 26.500 - R$ 15.900 = <strong className="text-green-600">R$ 10.600 líquido</strong></p>
              <p className="mt-4 bg-green-100 p-3 rounded font-semibold">
                ✅ Resultado: Você economizou R$ 15.900 (60% do IVA) graças aos créditos!
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            📋 Quais Gastos Geram Crédito de IVA?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A não-cumulatividade do IBS/CBS é <strong>plena</strong>, ou seja, praticamente todos os gastos empresariais geram crédito:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                Compras de Insumos
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li>✅ <strong>Mercadorias para revenda</strong> (e-commerce, varejo)</li>
                <li>✅ <strong>Matéria-prima</strong> (indústria)</li>
                <li>✅ <strong>Componentes e peças</strong> (montagem, produção)</li>
                <li>✅ <strong>Embalagens</strong> (caixas, plástico-bolha, fitas)</li>
                <li>✅ <strong>Material de marketing</strong> (flyers, banners)</li>
                <li>✅ <strong>Materiais de consumo</strong> (escritório, limpeza)</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-5 rounded-lg border-2 border-purple-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Estoques
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li>✅ <strong>Mercadorias em estoque</strong> (e-commerce)</li>
                <li>✅ <strong>Matéria-prima estocada</strong> (indústria)</li>
                <li>✅ <strong>Produtos em elaboração</strong> (WIP)</li>
                <li>✅ <strong>Produtos acabados</strong> (estoque final)</li>
                <li>✅ <strong>Embalagens estocadas</strong></li>
                <li>✅ <strong>Produtos em trânsito</strong> (em viagem do fornecedor)</li>
              </ul>
            </div>

            <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-600" />
                Frete e Logística
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li>✅ <strong>Frete de compras</strong> (inbound)</li>
                <li>✅ <strong>Transporte de fornecedores</strong></li>
                <li>✅ <strong>Armazenagem terceirizada</strong></li>
                <li>✅ <strong>Seguro de cargas</strong></li>
                <li>✅ <strong>Cross-docking</strong></li>
                <li>✅ <strong>Serviços de fulfillment</strong></li>
              </ul>
            </div>

            <div className="bg-orange-50 p-5 rounded-lg border-2 border-orange-200">
              <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-600" />
                Despesas Operacionais
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li>✅ <strong>Energia elétrica</strong> (produção, loja)</li>
                <li>✅ <strong>Softwares</strong> (ERP, plataforma e-commerce, CRM)</li>
                <li>✅ <strong>Manutenção de máquinas</strong></li>
                <li>✅ <strong>Serviços terceirizados</strong> (limpeza, segurança)</li>
                <li>✅ <strong>Marketing digital</strong> (Google Ads, Facebook Ads)</li>
                <li>✅ <strong>Gateway de pagamento</strong> (taxas de transação)</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded mb-6">
            <h4 className="font-bold text-gray-800 mb-2">⚠️ Exceções: O Que NÃO Gera Crédito?</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li><strong>Folha de pagamento:</strong> Salários, pró-labore, encargos trabalhistas (não há IVA na folha)</li>
              <li><strong>Compras de pessoa física sem NFe:</strong> Sem nota fiscal, não há crédito</li>
              <li><strong>Gastos pessoais dos sócios:</strong> Não relacionados à atividade empresarial</li>
              <li><strong>Bens de uso permanente (imobilizado):</strong> Crédito apropriado em 60 meses (parcelado)</li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🛒 Créditos no E-commerce: Exemplo Prático
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Veja como um e-commerce que vende R$ 200.000/mês acumula e utiliza créditos:
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-4">📊 E-commerce de Eletrônicos - Mês de Janeiro</h4>
            
            <div className="space-y-4 text-gray-700">
              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-2">💰 Receita de Vendas</p>
                <p>Vendas: R$ 200.000 → <strong className="text-red-600">Débito IVA: R$ 53.000</strong> (26,5%)</p>
              </div>

              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-2">📦 Compras e Gastos (Geram Crédito)</p>
                <ul className="space-y-2 ml-4">
                  <li>• Compra de produtos: R$ 120.000 → Crédito: <strong className="text-green-600">R$ 31.800</strong></li>
                  <li>• Embalagens/etiquetas: R$ 5.000 → Crédito: <strong className="text-green-600">R$ 1.325</strong></li>
                  <li>• Frete de fornecedores: R$ 8.000 → Crédito: <strong className="text-green-600">R$ 2.120</strong></li>
                  <li>• Plataforma e-commerce: R$ 3.000 → Crédito: <strong className="text-green-600">R$ 795</strong></li>
                  <li>• Gateway de pagamento: R$ 4.000 → Crédito: <strong className="text-green-600">R$ 1.060</strong></li>
                  <li>• Marketing digital: R$ 10.000 → Crédito: <strong className="text-green-600">R$ 2.650</strong></li>
                  <li>• Fulfillment/armazenagem: R$ 6.000 → Crédito: <strong className="text-green-600">R$ 1.590</strong></li>
                </ul>
                <p className="mt-3 font-bold text-green-600 text-lg">Total Créditos: R$ 41.340</p>
              </div>

              <div className="bg-green-100 p-4 rounded border-2 border-green-500">
                <p className="font-semibold mb-2">✅ IVA a Pagar (Débito - Crédito)</p>
                <p className="text-2xl font-bold text-gray-800">
                  R$ 53.000 - R$ 41.340 = <span className="text-green-600">R$ 11.660</span>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Economia:</strong> Você recuperou R$ 41.340 (78% do IVA) graças aos créditos! 
                  Sem créditos, pagaria R$ 53.000.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🏭 Créditos na Indústria: Exemplo Prático
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Indústrias têm ainda mais créditos por comprar matéria-prima, componentes e energia:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-4">🏭 Indústria de Alimentos - Mês de Janeiro</h4>
            
            <div className="space-y-4 text-gray-700">
              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-2">💰 Receita de Vendas</p>
                <p>Vendas: R$ 500.000 → <strong className="text-red-600">Débito IVA: R$ 132.500</strong> (26,5%)</p>
              </div>

              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-2">📦 Compras e Gastos (Geram Crédito)</p>
                <ul className="space-y-2 ml-4">
                  <li>• Matéria-prima: R$ 200.000 → Crédito: <strong className="text-green-600">R$ 53.000</strong></li>
                  <li>• Embalagens: R$ 30.000 → Crédito: <strong className="text-green-600">R$ 7.950</strong></li>
                  <li>• Energia elétrica industrial: R$ 40.000 → Crédito: <strong className="text-green-600">R$ 10.600</strong></li>
                  <li>• Frete de insumos: R$ 15.000 → Crédito: <strong className="text-green-600">R$ 3.975</strong></li>
                  <li>• Manutenção máquinas: R$ 10.000 → Crédito: <strong className="text-green-600">R$ 2.650</strong></li>
                  <li>• Ferramentas/equipamentos: R$ 8.000 → Crédito: <strong className="text-green-600">R$ 2.120</strong></li>
                  <li>• Serviços terceirizados: R$ 12.000 → Crédito: <strong className="text-green-600">R$ 3.180</strong></li>
                </ul>
                <p className="mt-3 font-bold text-green-600 text-lg">Total Créditos: R$ 83.475</p>
              </div>

              <div className="bg-green-100 p-4 rounded border-2 border-green-500">
                <p className="font-semibold mb-2">✅ IVA a Pagar (Débito - Crédito)</p>
                <p className="text-2xl font-bold text-gray-800">
                  R$ 132.500 - R$ 83.475 = <span className="text-green-600">R$ 49.025</span>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Economia:</strong> Você recuperou R$ 83.475 (63% do IVA) graças aos créditos! 
                  Sem créditos, pagaria R$ 132.500.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🔄 Como Utilizar os Créditos Acumulados?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Existem 4 formas principais de utilizar os créditos de IVA:
          </p>

          <div className="space-y-6 mb-6">
            <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-bold text-gray-800 mb-2">1️⃣ Compensação com Débitos (Uso Mais Comum)</h4>
              <p className="text-gray-700 mb-3">
                Use os créditos para <strong>abater o IVA devido</strong> nas vendas do mesmo mês. É automático: 
                você calcula débitos - créditos e paga a diferença.
              </p>
              <div className="bg-white p-3 rounded">
                <p className="font-semibold text-gray-800 mb-1">Exemplo:</p>
                <p className="text-gray-700">Vendas R$ 100k (débito R$ 26,5k) - Compras R$ 60k (crédito R$ 15,9k) = <strong>Paga R$ 10,6k</strong></p>
              </div>
            </div>

            <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
              <h4 className="font-bold text-gray-800 mb-2">2️⃣ Transferência para Próximos Meses (Saldo Credor)</h4>
              <p className="text-gray-700 mb-3">
                Se seus créditos <strong>superarem os débitos</strong> em um mês, o saldo fica acumulado para compensar nos próximos meses.
              </p>
              <div className="bg-white p-3 rounded">
                <p className="font-semibold text-gray-800 mb-1">Exemplo:</p>
                <p className="text-gray-700">Janeiro: Crédito R$ 50k, Débito R$ 30k → Saldo credor R$ 20k transfere para Fevereiro</p>
              </div>
            </div>

            <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-bold text-gray-800 mb-2">3️⃣ Ressarcimento em Dinheiro (Exportadores)</h4>
              <p className="text-gray-700 mb-3">
                <strong>Exportadores</strong> têm direito a <strong>ressarcimento em dinheiro</strong> dos créditos acumulados, 
                já que exportações são tributadas com alíquota zero (não geram débito).
              </p>
              <div className="bg-white p-3 rounded">
                <p className="font-semibold text-gray-800 mb-1">Exemplo:</p>
                <p className="text-gray-700">Exportou R$ 500k (débito zero) - Compras R$ 300k (crédito R$ 79,5k) = 
                <strong> Ressarcimento R$ 79,5k em dinheiro</strong></p>
              </div>
            </div>

            <div className="bg-orange-50 p-5 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-bold text-gray-800 mb-2">4️⃣ Compensação com Outros Tributos Federais</h4>
              <p className="text-gray-700 mb-3">
                Em alguns casos, créditos de CBS (federal) podem ser compensados com <strong>outros tributos federais</strong> 
                (IRPJ, CSLL, PIS/Pasep, Cofins antigos).
              </p>
              <div className="bg-white p-3 rounded">
                <p className="text-gray-700">
                  <strong>Observação:</strong> Créditos de IBS (estadual/municipal) só compensam com IBS.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            📊 Comparação: Crédito Atual (PIS/COFINS) vs. Novo (IBS/CBS)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Veja as principais diferenças entre o sistema atual de créditos e o novo IBS/CBS:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
                <tr>
                  <th className="px-6 py-3 border-b text-left font-semibold text-gray-800">Aspecto</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Sistema Atual<br/>(PIS/COFINS)</th>
                  <th className="px-6 py-3 border-b text-center font-semibold text-gray-800">Sistema Novo<br/>(IBS/CBS)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b font-medium">Taxa de crédito</td>
                  <td className="px-6 py-4 border-b text-center">9,25% (PIS 1,65% + Cofins 7,6%)</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">26,5% (IBS/CBS)</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b font-medium">Abrangência</td>
                  <td className="px-6 py-4 border-b text-center">Limitado (só insumos diretos)</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">Plena (todos os gastos)</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b font-medium">Energia elétrica</td>
                  <td className="px-6 py-4 border-b text-center">❌ Não gera crédito</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">✅ Gera crédito (26,5%)</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b font-medium">Frete</td>
                  <td className="px-6 py-4 border-b text-center">Parcial (só frete de insumos)</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">Total (todo frete)</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b font-medium">Softwares/Serviços</td>
                  <td className="px-6 py-4 border-b text-center">❌ Não gera crédito (ISS)</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">✅ Gera crédito (26,5%)</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b font-medium">Armazenagem</td>
                  <td className="px-6 py-4 border-b text-center">❌ Não gera crédito (ISS)</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">✅ Gera crédito (26,5%)</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b font-medium">Marketing digital</td>
                  <td className="px-6 py-4 border-b text-center">❌ Não gera crédito</td>
                  <td className="px-6 py-4 border-b text-center text-green-600 font-bold">✅ Gera crédito (26,5%)</td>
                </tr>
                <tr className="bg-green-50 font-bold">
                  <td className="px-6 py-4 font-bold text-gray-800">Impacto Final</td>
                  <td className="px-6 py-4 text-center text-red-600">Crédito limitado (~10%)</td>
                  <td className="px-6 py-4 text-center text-green-600">Crédito amplo (60-80%)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded mb-6">
            <h4 className="font-bold text-gray-800 mb-3">✅ Vantagem do Novo Sistema</h4>
            <p className="text-gray-700 leading-relaxed">
              Com IBS/CBS, empresas recuperam <strong>até 3x mais créditos</strong> do que no sistema atual! 
              E-commerce e indústria são os mais beneficiados, pois <strong>softwares, energia, frete e serviços</strong> 
              (que hoje não geram crédito no ISS/PIS/COFINS) passarão a gerar 26,5% de crédito.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🎯 Setores Mais Beneficiados pelos Créditos
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Alguns setores acumulam mais créditos devido ao alto volume de compras:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-gray-800 mb-3">🛒 E-commerce (Varejo Online)</h4>
              <p className="text-gray-700 mb-2">
                <strong>Créditos típicos:</strong> 60-80% do IVA devido
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Por quê?</strong> Alto volume de compras de mercadorias (50-70% da receita), embalagens, 
                frete, plataforma, marketing e gateway. Margem baixa gera muitos créditos.
              </p>
            </div>

            <div className="bg-purple-50 p-5 rounded-lg border-2 border-purple-200">
              <h4 className="font-bold text-gray-800 mb-3">🏭 Indústria (Manufatura)</h4>
              <p className="text-gray-700 mb-2">
                <strong>Créditos típicos:</strong> 50-70% do IVA devido
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Por quê?</strong> Compra de matéria-prima (40-60% receita), energia elétrica industrial, 
                embalagens, frete, manutenção de máquinas e ferramentas.
              </p>
            </div>

            <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
              <h4 className="font-bold text-gray-800 mb-3">📦 Atacado/Distribuição</h4>
              <p className="text-gray-700 mb-2">
                <strong>Créditos típicos:</strong> 70-85% do IVA devido
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Por quê?</strong> Margem muito baixa (5-15%), alto volume de compras (75-85% receita), 
                frete, armazenagem e WMS. Quase todo o IVA é compensado com créditos.
              </p>
            </div>

            <div className="bg-orange-50 p-5 rounded-lg border-2 border-orange-200">
              <h4 className="font-bold text-gray-800 mb-3">🌾 Exportadores (Todos Setores)</h4>
              <p className="text-gray-700 mb-2">
                <strong>Créditos típicos:</strong> 100% ressarcidos em dinheiro
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Por quê?</strong> Exportações têm alíquota zero (não geram débito), mas compras geram crédito normal. 
                Saldo credor é ressarcido pela Receita Federal.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            💼 Como Controlar os Créditos Acumulados?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Para garantir que você aproveite todos os créditos, siga estas boas práticas:
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-3">📋 Checklist de Controle de Créditos</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <p><strong>Guarde todas as NFe de compras:</strong> Sem nota fiscal eletrônica (NFe), não há crédito. 
                Organize por mês e categoria (insumos, frete, serviços).</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <p><strong>Use fornecedores regularizados:</strong> Compre de empresas formais que emitem NFe com IBS/CBS destacado. 
                Compras de MEI ou informais não geram crédito.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <p><strong>Automatize com ERP:</strong> Use software de gestão que calcule automaticamente débitos e créditos 
                de IVA. Integre com SPED Fiscal para envio à Receita.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <p><strong>Controle o estoque rigorosamente:</strong> Mantenha controle de estoque (PEPS, UEPS, Média Ponderada) 
                atualizado para justificar créditos sobre estoques.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">5.</span>
                <p><strong>Separe gastos por categoria:</strong> Classifique compras (insumos, frete, energia, serviços) 
                para facilitar auditoria e identificar onde você mais acumula créditos.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">6.</span>
                <p><strong>Acompanhe o saldo mensal:</strong> Faça conciliação mensal entre créditos apropriados e débitos gerados. 
                Identifique se está acumulando saldo credor.</p>
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            ⚠️ Erros Comuns ao Tomar Créditos
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Evite esses erros que podem resultar em perda de créditos ou autuação fiscal:
          </p>

          <div className="space-y-4 mb-6">
            <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-gray-800 mb-2">❌ Tomar crédito sem NFe</h4>
              <p className="text-gray-700">
                Compras sem nota fiscal não geram crédito. Exija NFe de todos os fornecedores, mesmo em pequenos valores. 
                A Receita cruza dados e identifica créditos indevidos.
              </p>
            </div>

            <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-gray-800 mb-2">❌ Misturar gastos pessoais com empresariais</h4>
              <p className="text-gray-700">
                Créditos só valem para <strong>gastos da atividade empresarial</strong>. Compras pessoais dos sócios 
                (alimentação, viagens particulares, etc.) não geram crédito e podem ser glosadas.
              </p>
            </div>

            <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-gray-800 mb-2">❌ Não controlar estoque adequadamente</h4>
              <p className="text-gray-700">
                Créditos sobre estoques exigem comprovação. Se a Receita auditar e você não tiver controle de estoque 
                (fichas Kardex, inventários), créditos podem ser negados.
              </p>
            </div>

            <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-gray-800 mb-2">❌ Apropriar crédito de imobilizado integralmente</h4>
              <p className="text-gray-700">
                Compra de máquinas, equipamentos, veículos (imobilizado) gera crédito, mas <strong>parcelado em 60 meses</strong>. 
                Não aproprie tudo de uma vez, sob pena de autuação.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            📅 Cronograma: Quando os Créditos Começam?
          </h3>
          <div className="bg-purple-50 p-6 rounded-lg mb-6">
            <div className="space-y-3 text-gray-700">
              <p><strong>2026:</strong> Período de teste (1% IBS + 0,9% CBS) - <strong>Créditos já começam!</strong> 
              Aproveite para testar sistemas e acumular saldo credor.</p>
              <p><strong>2027-2032:</strong> Transição gradual - Créditos de IBS/CBS <strong>aumentam proporcionalmente</strong> 
              conforme alíquota sobe (8,8% → 26,5%).</p>
              <p><strong>2033:</strong> Sistema completo (26,5%) - <strong>Crédito pleno</strong> de 26,5% sobre todos os gastos.</p>
              <p className="font-bold text-purple-700 mt-4">
                ✅ Dica: Comece a organizar suas NFe desde 2026 para não perder créditos!
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            ❓ Perguntas Frequentes (FAQ)
          </h3>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">1. Posso tomar crédito sobre folha de pagamento?</h4>
              <p className="text-gray-700">
                <strong>Não.</strong> Salários, pró-labore e encargos trabalhistas não sofrem incidência de IVA, 
                portanto não geram crédito. Apenas gastos com bens e serviços tributados geram crédito.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">2. Créditos de IBS e CBS são separados?</h4>
              <p className="text-gray-700">
                <strong>Sim.</strong> IBS (estadual/municipal) e CBS (federal) são tributos distintos, portanto créditos 
                também são separados. Crédito de IBS compensa débito de IBS. Crédito de CBS compensa débito de CBS.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">3. Se eu não usar todos os créditos em um mês, perco?</h4>
              <p className="text-gray-700">
                <strong>Não.</strong> Créditos não utilizados <strong>transferem automaticamente</strong> para os próximos meses. 
                Você pode acumular saldo credor indefinidamente (ou pedir ressarcimento se for exportador).
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">4. Compras de MEI geram crédito?</h4>
              <p className="text-gray-700">
                <strong>Depende.</strong> Se o MEI emitir NFe com IBS/CBS destacado, sim. Mas a maioria dos MEIs está 
                dispensada de cobrar IBS/CBS (por ser microempresa), então não há crédito a tomar.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">5. Energia elétrica gera crédito?</h4>
              <p className="text-gray-700">
                <strong>Sim!</strong> Energia elétrica utilizada na atividade empresarial (produção, loja, escritório) 
                gera <strong>crédito de 26,5%</strong>. Isso é uma grande vantagem em relação ao sistema atual (que não credita).
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">6. Posso pedir ressarcimento se não sou exportador?</h4>
              <p className="text-gray-700">
                <strong>Em regra, não.</strong> Ressarcimento em dinheiro é exclusivo para exportadores (alíquota zero). 
                Empresas que vendem no mercado interno devem usar créditos para compensar débitos ou transferir para próximos meses.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">7. Preciso de autorização prévia para tomar crédito?</h4>
              <p className="text-gray-700">
                <strong>Não.</strong> O crédito é <strong>automático</strong> (self-service). Basta ter a NFe válida e lançar 
                no seu ERP/SPED. A Receita cruza dados posteriormente e audita se necessário.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg mt-8 border-l-4 border-green-500">
            <h4 className="font-bold text-gray-800 mb-3">🎯 Conclusão</h4>
            <p className="text-gray-700 leading-relaxed">
              O sistema de <strong>créditos acumulados de IVA</strong> é um dos pilares da Reforma Tributária. Com 
              <strong>não-cumulatividade plena</strong> e taxa de <strong>26,5%</strong>, empresas de e-commerce e indústria 
              podem recuperar até <strong>60-80% do IVA devido</strong>, reduzindo drasticamente a carga tributária. 
              Use esta calculadora para estimar seus créditos mensais, organize suas notas fiscais desde 2026 e prepare-se 
              para aproveitar ao máximo esse benefício a partir de 2027!
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mt-6">
            <p className="text-gray-700">
              <strong>⚠️ Aviso Legal:</strong> Este artigo tem caráter informativo e educacional. Os cálculos são estimativas 
              baseadas na legislação atual (EC 132/2023) e podem variar conforme regulamentação específica. Créditos de IVA 
              dependem de documentação fiscal válida e controles adequados. Consulte um contador para orientação específica 
              sobre sua situação.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg mt-6">
            <p className="text-sm text-gray-600">
              <strong>Fonte Legal:</strong> Emenda Constitucional 132/2023 (Reforma Tributária), 
              Lei Complementar em tramitação (regulamentação IBS/CBS), 
              Projeto de Lei Complementar sobre créditos e não-cumulatividade.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PainelCreditosAcumulados;

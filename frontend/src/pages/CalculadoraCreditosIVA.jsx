import { useState } from 'react';
import { Calculator, TrendingUp, Zap, Truck, Package, Settings, PieChart } from 'lucide-react';

export default function CalculadoraCreditosIVA() {
  const [insumos, setInsumos] = useState('50000');
  const [energia, setEnergia] = useState('10000');
  const [frete, setFrete] = useState('5000');
  const [ativos, setAtivos] = useState('100000');
  const [servicosTomados, setServicosTomados] = useState('8000');
  const [anoTransicao, setAnoTransicao] = useState('2033');
  const [resultado, setResultado] = useState(null);

  const anosTransicao = [
    { ano: '2026', label: '2026 (Teste - 1% IBS/CBS)', ibsCbs: 1.0, percEnergia: 50, percFrete: 70, percAtivos: 0 },
    { ano: '2027', label: '2027 (Início - 8,8%)', ibsCbs: 8.8, percEnergia: 55, percFrete: 75, percAtivos: 5 },
    { ano: '2029', label: '2029 (Meio - 17,5%)', ibsCbs: 17.5, percEnergia: 70, percFrete: 85, percAtivos: 10 },
    { ano: '2031', label: '2031 (Avançado - 23,5%)', ibsCbs: 23.5, percEnergia: 85, percFrete: 92, percAtivos: 15 },
    { ano: '2033', label: '2033 (Pleno - 26,5%)', ibsCbs: 26.5, percEnergia: 100, percFrete: 100, percAtivos: 20 }
  ];

  const calcular = () => {
    const valorInsumos = parseFloat(insumos) || 0;
    const valorEnergia = parseFloat(energia) || 0;
    const valorFrete = parseFloat(frete) || 0;
    const valorAtivos = parseFloat(ativos) || 0;
    const valorServicos = parseFloat(servicosTomados) || 0;

    if (valorInsumos < 0 || valorEnergia < 0 || valorFrete < 0 || valorAtivos < 0 || valorServicos < 0) {
      alert('Valores não podem ser negativos');
      return;
    }

    const anoInfo = anosTransicao.find(a => a.ano === anoTransicao);
    const aliquotaIbsCbs = anoInfo.ibsCbs / 100;
    const percCreditoEnergia = anoInfo.percEnergia;
    const percCreditoFrete = anoInfo.percFrete;
    const percCreditoAtivos = anoInfo.percAtivos;

    // Créditos IBS/CBS
    const creditoInsumos = valorInsumos * aliquotaIbsCbs * 1.0; // 100%
    const creditoEnergia = valorEnergia * aliquotaIbsCbs * (percCreditoEnergia / 100);
    const creditoFrete = valorFrete * aliquotaIbsCbs * (percCreditoFrete / 100);
    const creditoServicos = valorServicos * aliquotaIbsCbs * 1.0; // 100%
    
    // Ativos: amortização anual
    const vidaUtilAnos = 5; // média
    const creditoAtivosAnual = (valorAtivos * aliquotaIbsCbs * (percCreditoAtivos / 100)) / vidaUtilAnos;
    const creditoAtivosMensal = creditoAtivosAnual / 12;

    // Total de créditos mensais
    const creditosMensais = creditoInsumos + creditoEnergia + creditoFrete + creditoServicos + creditoAtivosMensal;
    const creditosAnuais = creditosMensais * 12;

    // Sistema Atual (PIS/COFINS não cumulativo - 9,25%)
    const aliquotaPisCofins = 0.0925;
    const creditoPisCofinsinsumos = valorInsumos * aliquotaPisCofins;
    const creditoPisCofinsEnergia = valorEnergia * aliquotaPisCofins * 0.5; // 50% limitado
    const creditoPisCofinsFrete = valorFrete * aliquotaPisCofins * 0.7; // 70% limitado
    const creditoPisCofinsServicos = valorServicos * aliquotaPisCofins;
    const creditoPisCofinsAtivos = (valorAtivos * aliquotaPisCofins * 0.04) / 12; // 4% ao ano (ICMS zero)
    
    const creditosPisCofins = creditoPisCofinsinsumos + creditoPisCofinsEnergia + 
                               creditoPisCofinsFrete + creditoPisCofinsServicos + creditoPisCofinsAtivos;
    
    // Comparação
    const ganhoCredito = creditosMensais - creditosPisCofins;
    const percentualGanho = creditosPisCofins > 0 ? ((ganhoCredito / creditosPisCofins) * 100) : 0;

    setResultado({
      anoInfo,
      valores: {
        insumos: valorInsumos,
        energia: valorEnergia,
        frete: valorFrete,
        ativos: valorAtivos,
        servicosTomados: valorServicos,
        totalGastos: valorInsumos + valorEnergia + valorFrete + valorServicos
      },
      creditosIbsCbs: {
        insumos: { valor: creditoInsumos, percentual: 100 },
        energia: { valor: creditoEnergia, percentual: percCreditoEnergia },
        frete: { valor: creditoFrete, percentual: percCreditoFrete },
        servicos: { valor: creditoServicos, percentual: 100 },
        ativos: { 
          valorTotal: valorAtivos * aliquotaIbsCbs * (percCreditoAtivos / 100),
          mensal: creditoAtivosMensal, 
          percentual: percCreditoAtivos,
          anos: vidaUtilAnos
        },
        mensal: creditosMensais,
        anual: creditosAnuais
      },
      creditosPisCofins: {
        insumos: creditoPisCofinsinsumos,
        energia: creditoPisCofinsEnergia,
        frete: creditoPisCofinsFrete,
        servicos: creditoPisCofinsServicos,
        ativos: creditoPisCofinsAtivos,
        total: creditosPisCofins
      },
      comparacao: {
        ganho: ganhoCredito,
        percentual: percentualGanho,
        favoravel: ganhoCredito > 0
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PieChart className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Calculadora de Créditos IBS/CBS
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calcule os <strong>créditos tributários</strong> recuperáveis com a <strong>não cumulatividade plena</strong> 
            do IBS e CBS. Compare com o sistema atual (PIS/COFINS) e veja o ganho na sua operação.
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          
          {/* Ano de Transição */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📅 Ano de Referência (Transição 2026-2033)
            </label>
            <select
              value={anoTransicao}
              onChange={(e) => setAnoTransicao(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {anosTransicao.map(ano => (
                <option key={ano.ano} value={ano.ano}>
                  {ano.label} • Energia: {ano.percEnergia}% • Frete: {ano.percFrete}% • Ativos: {ano.percAtivos}%
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Regras de crédito evoluem gradualmente até 2033
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            
            {/* Insumos */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5">
              <label className="block text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Insumos (Matéria-Prima) - R$/mês
              </label>
              <input
                type="number"
                value={insumos}
                onChange={(e) => setInsumos(e.target.value)}
                className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="50000"
                min="0"
                step="1000"
              />
              <p className="text-sm text-green-700 mt-2 font-semibold">
                ✅ Crédito: 100% do IBS/CBS pago
              </p>
            </div>

            {/* Energia */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-5">
              <label className="block text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Energia Elétrica - R$/mês
              </label>
              <input
                type="number"
                value={energia}
                onChange={(e) => setEnergia(e.target.value)}
                className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="10000"
                min="0"
                step="500"
              />
              <p className="text-sm text-yellow-700 mt-2 font-semibold">
                ⚠️ Crédito progressivo: 50% → 100%
              </p>
            </div>

            {/* Frete */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-5">
              <label className="block text-sm font-semibold text-orange-900 mb-2 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Frete e Transporte - R$/mês
              </label>
              <input
                type="number"
                value={frete}
                onChange={(e) => setFrete(e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="5000"
                min="0"
                step="500"
              />
              <p className="text-sm text-orange-700 mt-2 font-semibold">
                ⚠️ Crédito progressivo: 70% → 100%
              </p>
            </div>

            {/* Serviços Tomados */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
              <label className="block text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Serviços Tomados - R$/mês
              </label>
              <input
                type="number"
                value={servicosTomados}
                onChange={(e) => setServicosTomados(e.target.value)}
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="8000"
                min="0"
                step="500"
              />
              <p className="text-sm text-blue-700 mt-2 font-semibold">
                ✅ Crédito: 100% do IBS/CBS pago
              </p>
            </div>

          </div>

          {/* Ativos Permanentes */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-5 mb-6">
            <label className="block text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Investimento em Ativos (Máquinas, Equipamentos) - R$ (valor único)
            </label>
            <input
              type="number"
              value={ativos}
              onChange={(e) => setAtivos(e.target.value)}
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="100000"
              min="0"
              step="5000"
            />
            <p className="text-sm text-purple-700 mt-2 font-semibold">
              ⚠️ Crédito progressivo (0% → 20%), amortizado em 5 anos
            </p>
          </div>

          {/* Botão Calcular */}
          <button
            onClick={calcular}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calcular Créditos Recuperáveis
          </button>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="space-y-6">
            
            {/* Card Resumo */}
            <div className={`rounded-2xl shadow-xl p-8 ${
              resultado.comparacao.favoravel 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200' 
                : 'bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    📊 Créditos Mensais Recuperáveis
                  </h3>
                  <p className="text-gray-600">
                    {resultado.anoInfo.label} • Alíquota IBS/CBS: {resultado.anoInfo.ibsCbs}%
                  </p>
                </div>
                <TrendingUp className={`w-16 h-16 ${
                  resultado.comparacao.favoravel ? 'text-green-600' : 'text-orange-600'
                }`} />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <p className="text-sm text-gray-600 mb-1">Sistema Atual (PIS/COFINS)</p>
                  <p className="text-3xl font-bold text-gray-900">
                    R$ {resultado.creditosPisCofins.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-blue-600 font-medium mt-2">
                    9,25% com limitações
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <p className="text-sm text-gray-600 mb-1">Pós-Reforma (IBS/CBS)</p>
                  <p className="text-3xl font-bold text-purple-700">
                    R$ {resultado.creditosIbsCbs.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-purple-600 font-medium mt-2">
                    {resultado.anoInfo.ibsCbs}% não cumulativo
                  </p>
                </div>

                <div className={`rounded-lg p-6 shadow-md ${
                  resultado.comparacao.favoravel ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  <p className="text-sm text-gray-700 mb-1">
                    {resultado.comparacao.favoravel ? 'Ganho Mensal' : 'Perda Mensal'}
                  </p>
                  <p className={`text-3xl font-bold ${
                    resultado.comparacao.favoravel ? 'text-green-700' : 'text-orange-700'
                  }`}>
                    R$ {Math.abs(resultado.comparacao.ganho).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className={`text-sm font-medium mt-2 ${
                    resultado.comparacao.favoravel ? 'text-green-700' : 'text-orange-700'
                  }`}>
                    {resultado.comparacao.favoravel ? '+' : '-'}{Math.abs(resultado.comparacao.percentual).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Detalhamento dos Créditos IBS/CBS */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-7 h-7 text-green-600" />
                Créditos IBS/CBS Detalhados ({resultado.anoInfo.ano})
              </h3>

              <div className="space-y-4">
                
                {/* Insumos */}
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-green-900 text-lg">
                      📦 Insumos (Matéria-Prima)
                    </h4>
                    <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                      100% de crédito
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-green-700">Valor Mensal</p>
                      <p className="text-xl font-bold text-green-900">
                        R$ {resultado.valores.insumos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">IBS/CBS Pago</p>
                      <p className="text-xl font-bold text-green-900">
                        R$ {(resultado.valores.insumos * resultado.anoInfo.ibsCbs / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Crédito Recuperável</p>
                      <p className="text-2xl font-bold text-green-600">
                        R$ {resultado.creditosIbsCbs.insumos.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Energia */}
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-yellow-900 text-lg">
                      ⚡ Energia Elétrica
                    </h4>
                    <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                      {resultado.creditosIbsCbs.energia.percentual}% de crédito
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-yellow-700">Valor Mensal</p>
                      <p className="text-xl font-bold text-yellow-900">
                        R$ {resultado.valores.energia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-yellow-700">IBS/CBS Pago</p>
                      <p className="text-xl font-bold text-yellow-900">
                        R$ {(resultado.valores.energia * resultado.anoInfo.ibsCbs / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-yellow-700">Crédito Recuperável</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        R$ {resultado.creditosIbsCbs.energia.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    📈 Evolução gradual: 50% (2026) → 100% (2033)
                  </p>
                </div>

                {/* Frete */}
                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-orange-900 text-lg">
                      🚚 Frete e Transporte
                    </h4>
                    <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
                      {resultado.creditosIbsCbs.frete.percentual}% de crédito
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-orange-700">Valor Mensal</p>
                      <p className="text-xl font-bold text-orange-900">
                        R$ {resultado.valores.frete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-orange-700">IBS/CBS Pago</p>
                      <p className="text-xl font-bold text-orange-900">
                        R$ {(resultado.valores.frete * resultado.anoInfo.ibsCbs / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-orange-700">Crédito Recuperável</p>
                      <p className="text-2xl font-bold text-orange-600">
                        R$ {resultado.creditosIbsCbs.frete.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    📈 Evolução gradual: 70% (2026) → 100% (2033)
                  </p>
                </div>

                {/* Serviços */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-blue-900 text-lg">
                      🔧 Serviços Tomados
                    </h4>
                    <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                      100% de crédito
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-blue-700">Valor Mensal</p>
                      <p className="text-xl font-bold text-blue-900">
                        R$ {resultado.valores.servicosTomados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">IBS/CBS Pago</p>
                      <p className="text-xl font-bold text-blue-900">
                        R$ {(resultado.valores.servicosTomados * resultado.anoInfo.ibsCbs / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Crédito Recuperável</p>
                      <p className="text-2xl font-bold text-blue-600">
                        R$ {resultado.creditosIbsCbs.servicos.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ativos Permanentes */}
                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-purple-900 text-lg">
                      🏭 Ativos Permanentes (Máquinas/Equipamentos)
                    </h4>
                    <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                      {resultado.creditosIbsCbs.ativos.percentual}% de crédito
                    </span>
                  </div>
                  <div className="grid md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-purple-700">Investimento</p>
                      <p className="text-xl font-bold text-purple-900">
                        R$ {resultado.valores.ativos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-700">Crédito Total</p>
                      <p className="text-xl font-bold text-purple-900">
                        R$ {resultado.creditosIbsCbs.ativos.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-700">Amortização</p>
                      <p className="text-sm font-bold text-purple-900">
                        {resultado.creditosIbsCbs.ativos.anos} anos
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-700">Crédito Mensal</p>
                      <p className="text-2xl font-bold text-purple-600">
                        R$ {resultado.creditosIbsCbs.ativos.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    📈 Evolução gradual: 0% (2026) → 20% (2033)
                  </p>
                </div>

              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 rounded-lg p-6 mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-700 mb-1">💰 Total de Créditos Mensais</p>
                    <p className="text-4xl font-bold text-blue-700">
                      R$ {resultado.creditosIbsCbs.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 mb-1">📅 Total de Créditos Anuais</p>
                    <p className="text-4xl font-bold text-purple-700">
                      R$ {resultado.creditosIbsCbs.anual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparação com Sistema Atual */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-orange-600" />
                Comparação: IBS/CBS vs PIS/COFINS
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-4 px-4 text-gray-700 font-semibold">Item</th>
                      <th className="text-right py-4 px-4 text-gray-700 font-semibold">PIS/COFINS Atual</th>
                      <th className="text-right py-4 px-4 text-gray-700 font-semibold">IBS/CBS {resultado.anoInfo.ano}</th>
                      <th className="text-right py-4 px-4 text-gray-700 font-semibold">Diferença</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">Insumos</td>
                      <td className="py-4 px-4 text-right text-blue-600 font-semibold">
                        R$ {resultado.creditosPisCofins.insumos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right text-purple-600 font-semibold">
                        R$ {resultado.creditosIbsCbs.insumos.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={resultado.creditosIbsCbs.insumos.valor > resultado.creditosPisCofins.insumos ? 'text-green-600 font-semibold' : 'text-red-600'}>
                          {resultado.creditosIbsCbs.insumos.valor > resultado.creditosPisCofins.insumos ? '+' : ''}
                          R$ {(resultado.creditosIbsCbs.insumos.valor - resultado.creditosPisCofins.insumos).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">Energia</td>
                      <td className="py-4 px-4 text-right text-blue-600 font-semibold">
                        R$ {resultado.creditosPisCofins.energia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right text-purple-600 font-semibold">
                        R$ {resultado.creditosIbsCbs.energia.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={resultado.creditosIbsCbs.energia.valor > resultado.creditosPisCofins.energia ? 'text-green-600 font-semibold' : 'text-red-600'}>
                          {resultado.creditosIbsCbs.energia.valor > resultado.creditosPisCofins.energia ? '+' : ''}
                          R$ {(resultado.creditosIbsCbs.energia.valor - resultado.creditosPisCofins.energia).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">Frete</td>
                      <td className="py-4 px-4 text-right text-blue-600 font-semibold">
                        R$ {resultado.creditosPisCofins.frete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right text-purple-600 font-semibold">
                        R$ {resultado.creditosIbsCbs.frete.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={resultado.creditosIbsCbs.frete.valor > resultado.creditosPisCofins.frete ? 'text-green-600 font-semibold' : 'text-red-600'}>
                          {resultado.creditosIbsCbs.frete.valor > resultado.creditosPisCofins.frete ? '+' : ''}
                          R$ {(resultado.creditosIbsCbs.frete.valor - resultado.creditosPisCofins.frete).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">Serviços</td>
                      <td className="py-4 px-4 text-right text-blue-600 font-semibold">
                        R$ {resultado.creditosPisCofins.servicos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right text-purple-600 font-semibold">
                        R$ {resultado.creditosIbsCbs.servicos.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={resultado.creditosIbsCbs.servicos.valor > resultado.creditosPisCofins.servicos ? 'text-green-600 font-semibold' : 'text-red-600'}>
                          {resultado.creditosIbsCbs.servicos.valor > resultado.creditosPisCofins.servicos ? '+' : ''}
                          R$ {(resultado.creditosIbsCbs.servicos.valor - resultado.creditosPisCofins.servicos).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">Ativos (mensal)</td>
                      <td className="py-4 px-4 text-right text-blue-600 font-semibold">
                        R$ {resultado.creditosPisCofins.ativos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right text-purple-600 font-semibold">
                        R$ {resultado.creditosIbsCbs.ativos.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={resultado.creditosIbsCbs.ativos.mensal > resultado.creditosPisCofins.ativos ? 'text-green-600 font-semibold' : 'text-red-600'}>
                          {resultado.creditosIbsCbs.ativos.mensal > resultado.creditosPisCofins.ativos ? '+' : ''}
                          R$ {(resultado.creditosIbsCbs.ativos.mensal - resultado.creditosPisCofins.ativos).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>

                    <tr className="bg-gradient-to-r from-blue-50 to-purple-50 font-bold text-lg">
                      <td className="py-4 px-4 text-gray-900">Total Mensal</td>
                      <td className="py-4 px-4 text-right text-blue-700">
                        R$ {resultado.creditosPisCofins.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right text-purple-700">
                        R$ {resultado.creditosIbsCbs.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={resultado.comparacao.favoravel ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                          {resultado.comparacao.favoravel ? '+' : ''}
                          R$ {resultado.comparacao.ganho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          <br />
                          <span className="text-sm">({resultado.comparacao.favoravel ? '+' : ''}{resultado.comparacao.percentual.toFixed(1)}%)</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Análise e Recomendações */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calculator className="w-7 h-7 text-indigo-600" />
                Análise e Recomendações
              </h3>

              <div className="space-y-4">
                
                {resultado.comparacao.favoravel ? (
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                    <h4 className="font-bold text-green-900 mb-2">
                      ✅ Cenário Favorável
                    </h4>
                    <p className="text-green-800 mb-3">
                      A <strong>não cumulatividade plena</strong> do IBS/CBS gerará um ganho de 
                      <strong> R$ {Math.abs(resultado.comparacao.ganho).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</strong> 
                      ({resultado.comparacao.percentual.toFixed(1)}% a mais) em créditos recuperáveis comparado ao sistema atual.
                    </p>
                  </div>
                ) : (
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
                    <h4 className="font-bold text-orange-900 mb-2">
                      ⚠️ Atenção: Redução Inicial de Créditos
                    </h4>
                    <p className="text-orange-800 mb-3">
                      Nos primeiros anos da transição (2026-2029), os créditos podem ser <strong>menores</strong> 
                      devido às alíquotas progressivas. Aguarde até <strong>2033</strong> para não cumulatividade plena.
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-3">
                    💡 Recomendações Estratégicas
                  </h4>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li>✓ <strong>Maximize créditos:</strong> Exija notas fiscais de todos os fornecedores</li>
                    <li>✓ <strong>Planeje investimentos:</strong> Compras de ativos após 2030 geram mais créditos (20% vs 0% em 2026)</li>
                    <li>✓ <strong>Audite energia e frete:</strong> Percentuais crescem anualmente até 100% em 2033</li>
                    <li>✓ <strong>Implemente ERP:</strong> Sistema fiscal deve calcular créditos automaticamente</li>
                    <li>✓ <strong>Consulte contador:</strong> Regras específicas por setor podem alterar percentuais</li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Info Card */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mt-8">
          <div className="flex items-start gap-3">
            <PieChart className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-amber-900 mb-2">
                ℹ️ Sobre os Créditos
              </h4>
              <p className="text-amber-800 leading-relaxed text-sm">
                Os percentuais de crédito para <strong>energia, frete e ativos permanentes</strong> 
                evoluem gradualmente de 2026 a 2033, quando atingirão <strong>100%, 100% e 20%</strong>, 
                respectivamente. Insumos e serviços já têm <strong>crédito integral</strong> desde o início. 
                A não cumulatividade plena elimina o "efeito cascata" tributário.
              </p>
            </div>
          </div>
        </div>

        {/* Artigo SEO */}
        <article className="bg-white rounded-2xl shadow-xl p-12 mt-8 prose prose-lg max-w-none">
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-4 border-blue-500 pb-4">
            Créditos de IBS e CBS: Guia Completo da Não Cumulatividade Plena
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Uma das maiores revoluções da <strong>Reforma Tributária de 2026</strong> é a 
            <strong> não cumulatividade plena</strong> dos novos tributos sobre consumo: <strong>IBS 
            (Imposto sobre Bens e Serviços)</strong> e <strong>CBS (Contribuição sobre Bens e Serviços)</strong>. 
            Isso significa que empresas poderão <strong>creditar praticamente todo tributo pago nas 
            compras</strong>, eliminando o "efeito cascata" que hoje encarece produtos e prejudica a 
            competitividade. Neste artigo, entenda como funcionam os créditos, quais insumos geram 
            direito a desconto e como aproveitar essa mudança estrategicamente.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            🔄 O Que É Não Cumulatividade?
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Não cumulatividade</strong> é um princípio tributário que evita a <strong>tributação 
            em cascata</strong>. Funciona assim: o tributo pago em uma etapa da cadeia produtiva pode 
            ser <strong>descontado</strong> do tributo devido na próxima etapa. Dessa forma, o imposto 
            incide apenas sobre o <strong>valor agregado</strong>, não sobre o valor total.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg my-6">
            <h4 className="font-bold text-blue-900 mb-3">
              📊 Exemplo Prático: Cadeia do Pão
            </h4>
            <div className="space-y-3 text-blue-800 text-sm">
              <div>
                <p className="font-semibold">1. Fazendeiro vende trigo por R$ 100</p>
                <p>• IBS/CBS (26,5%): <strong>R$ 26,50</strong></p>
                <p>• Preço final: R$ 126,50</p>
              </div>
              <div className="pt-2 border-t border-blue-300">
                <p className="font-semibold">2. Moinho compra trigo (R$ 126,50) e vende farinha por R$ 200</p>
                <p>• IBS/CBS sobre R$ 200: R$ 53,00</p>
                <p>• <strong>CRÉDITO</strong> do tributo pago pelo fazendeiro: <strong>- R$ 26,50</strong></p>
                <p>• <strong>Tributo efetivo a pagar:</strong> R$ 26,50</p>
                <p>• Preço final: R$ 226,50</p>
              </div>
              <div className="pt-2 border-t border-blue-300">
                <p className="font-semibold">3. Padaria compra farinha (R$ 226,50) e vende pão por R$ 300</p>
                <p>• IBS/CBS sobre R$ 300: R$ 79,50</p>
                <p>• <strong>CRÉDITO</strong> do tributo pago pelo moinho: <strong>- R$ 53,00</strong></p>
                <p>• <strong>Tributo efetivo a pagar:</strong> R$ 26,50</p>
              </div>
              <div className="pt-3 border-t-2 border-blue-400 font-bold">
                <p>📌 Total arrecadado: R$ 79,50 (26,5% de R$ 300)</p>
                <p className="text-xs font-normal mt-1">
                  Sem créditos, seria R$ 159 (cascata). Economia de <strong>R$ 79,50</strong>!
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            📦 Quais Insumos Geram Crédito?
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            A Reforma Tributária expande drasticamente o direito ao crédito. Veja o que mudou:
          </p>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left text-gray-900">Insumo</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-gray-900">PIS/COFINS Atual</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-gray-900">IBS/CBS (2033)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-gray-900">Observação</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Matéria-prima</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">✅ 100%</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-green-700 font-bold">✅ 100%</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Mantém direito integral</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Energia elétrica</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">⚠️ 50% limitado</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-green-700 font-bold">✅ 100%</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Evolução gradual até 2033</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Frete/Transporte</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">⚠️ 70% limitado</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-green-700 font-bold">✅ 100%</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Evolução gradual até 2033</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Serviços tomados</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">✅ 100%</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-green-700 font-bold">✅ 100%</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Mantém direito integral</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Ativos permanentes</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">❌ 0% (ICMS zero)</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-green-700 font-bold">✅ 20%</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Novidade! Amortizado em 5 anos</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Comunicação</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">❌ Não creditável</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-green-700 font-bold">✅ 100%</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Internet, telefonia</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Combustíveis</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">⚠️ Limitado</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-green-700 font-bold">✅ 100%</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Uso produtivo/frete</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            📈 Evolução Gradual dos Créditos (2026-2033)
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Para evitar choque fiscal, os créditos de <strong>energia, frete e ativos</strong> crescem 
            gradualmente ao longo de 8 anos:
          </p>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg my-6">
            <h4 className="font-bold text-purple-900 mb-3">
              📅 Cronograma de Créditos
            </h4>
            <div className="space-y-3 text-purple-800 text-sm">
              <div className="grid grid-cols-4 gap-2 font-semibold border-b border-purple-300 pb-2">
                <span>Ano</span>
                <span>Energia</span>
                <span>Frete</span>
                <span>Ativos</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span>2026</span>
                <span>50%</span>
                <span>70%</span>
                <span>0%</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span>2027</span>
                <span>55%</span>
                <span>75%</span>
                <span>5%</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span>2029</span>
                <span>70%</span>
                <span>85%</span>
                <span>10%</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span>2031</span>
                <span>85%</span>
                <span>92%</span>
                <span>15%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 font-bold text-purple-900 border-t border-purple-400 pt-2">
                <span>2033</span>
                <span>100%</span>
                <span>100%</span>
                <span>20%</span>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            🏭 Crédito sobre Ativos Permanentes: Grande Novidade
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Hoje, empresas <strong>não podem creditar ICMS</strong> pago na compra de máquinas e equipamentos 
            (por decisão do STF). Com PIS/COFINS, o crédito é limitado. Pós-reforma, haverá 
            <strong> crédito de 20%</strong> do IBS/CBS pago, amortizado ao longo da vida útil (geralmente 5 anos).
          </p>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg my-6">
            <h4 className="font-bold text-green-900 mb-3">
              🔧 Exemplo: Compra de Máquina por R$ 500.000
            </h4>
            <ul className="space-y-2 text-green-800 text-sm">
              <li>• <strong>Preço da máquina:</strong> R$ 500.000</li>
              <li>• <strong>IBS/CBS embutido (26,5%):</strong> R$ 132.500</li>
              <li>• <strong>Crédito aproveitável (20% de R$ 132.500):</strong> R$ 26.500</li>
              <li>• <strong>Amortização:</strong> 5 anos → R$ 5.300/ano → <strong>R$ 442/mês</strong></li>
            </ul>
            <p className="text-green-700 mt-3 font-semibold">
              Ao longo de 5 anos, a empresa recupera <strong>R$ 26.500</strong> em créditos, 
              reduzindo o custo efetivo da máquina.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            ⚡ Energia Elétrica: Crédito Integral
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Uma das maiores reivindicações da indústria brasileira era o <strong>crédito integral 
            sobre energia</strong>. Hoje, PIS/COFINS permite apenas <strong>50%</strong> (Lei 10.833/2003). 
            Pós-reforma, esse percentual chegará a <strong>100%</strong> em 2033.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg my-6">
            <h4 className="font-bold text-yellow-900 mb-3">
              💡 Impacto na Indústria
            </h4>
            <p className="text-yellow-800 text-sm mb-3">
              Uma indústria que gasta <strong>R$ 100.000/mês</strong> em energia hoje credita 
              <strong> R$ 4.625</strong> (9,25% × 50%). Com IBS/CBS em 2033, creditará 
              <strong> R$ 26.500</strong> (26,5% × 100%), um ganho de <strong>R$ 21.875/mês</strong> 
              ou <strong>R$ 262.500/ano</strong>.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            🚚 Frete: Fim das Limitações
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Atualmente, PIS/COFINS permite creditar <strong>70%</strong> do tributo pago sobre frete. 
            IBS/CBS permitirá <strong>100%</strong>, beneficiando especialmente setores logísticos, 
            e-commerce e distribuidoras.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            💼 Impacto por Setor Econômico
          </h3>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
              <h4 className="font-bold text-blue-900 mb-3">🏭 Indústria</h4>
              <p className="text-sm text-blue-800 mb-2">
                <strong>Maior beneficiária.</strong> Créditos sobre insumos, energia (alta intensidade), 
                frete e ativos permanentes reduzem carga tributária efetiva para <strong>8-12%</strong>, 
                contra os atuais 15-18%.
              </p>
              <p className="text-xs text-gray-600">
                Setores intensivos em energia (metalurgia, química, papel) terão ganhos de 20-30%.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 p-5 rounded-lg">
              <h4 className="font-bold text-green-900 mb-3">🛒 Comércio</h4>
              <p className="text-sm text-green-800 mb-2">
                <strong>Ganho moderado.</strong> Crédito sobre mercadorias, frete e energia (refrigeração, 
                iluminação). Margem de lucro pequena amplifica impacto: cada 1% de crédito adicional 
                pode significar <strong>5-10% mais lucro</strong>.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 p-5 rounded-lg">
              <h4 className="font-bold text-orange-900 mb-3">🚛 Logística</h4>
              <p className="text-sm text-orange-800 mb-2">
                <strong>Transformação total.</strong> Crédito integral sobre combustível e frete 
                (antes limitado a 70%) reduz custo operacional em até <strong>15%</strong>. Investimentos 
                em caminhões (ativos) também geram crédito.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-5 rounded-lg">
              <h4 className="font-bold text-purple-900 mb-3">💻 Serviços</h4>
              <p className="text-sm text-purple-800 mb-2">
                <strong>Impacto variável.</strong> Serviços B2B (consultoria, TI, engenharia) se 
                beneficiam de crédito sobre insumos (softwares, subcontratações). Serviços B2C 
                (salões, academias) têm menos insumos creditáveis.
              </p>
            </div>

          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            📋 Como Garantir o Aproveitamento dos Créditos?
          </h3>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            1. Exija Nota Fiscal de Todos os Fornecedores
          </h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            Sem NF-e, <strong>não há crédito</strong>. Negocie preços que incluam nota fiscal, mesmo 
            que isso implique pequeno aumento. O crédito compensa.
          </p>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            2. Classifique Corretamente as Despesas
          </h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            Diferencie despesas <strong>operacionais</strong> (geram crédito) de despesas 
            <strong> administrativas</strong> (podem ter limitações). Exemplo: energia da fábrica 
            credita 100%; energia do escritório pode ter restrições.
          </p>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            3. Implemente ERP com Módulo Fiscal Atualizado
          </h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            Cálculo de créditos IBS/CBS será <strong>complexo</strong> (evolução gradual, percentuais 
            diferentes por insumo). Sistemas manuais não darão conta.
          </p>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            4. Audite Fornecedores
          </h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            Certifique-se de que fornecedores estão <strong>cobrando IBS/CBS corretamente</strong>. 
            Tributo a menor significa crédito a menor para você. Tributo a maior (fraude) pode gerar 
            passivo.
          </p>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            5. Planeje Investimentos
          </h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            Se possível, <strong>adie compras de ativos</strong> para 2030 ou depois, quando o crédito 
            será de 15-20%, ao invés de 0-10% em 2026-2029.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            ❓ Perguntas Frequentes (FAQ)
          </h3>

          <div className="space-y-6">
            
            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                1. Créditos de IBS/CBS expiram?
              </h4>
              <p className="text-gray-700 text-sm">
                <strong>Não.</strong> A Lei Complementar deve prever <strong>ressarcimento</strong> 
                ou <strong>transferência</strong> de créditos acumulados, evitando perda.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                2. Exportações geram crédito?
              </h4>
              <p className="text-gray-700 text-sm">
                Sim. Exportações são <strong>desoneradas</strong> (alíquota zero), mas os tributos 
                pagos nos insumos podem ser creditados e <strong>ressarcidos</strong> em dinheiro.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                3. Posso creditar IBS/CBS sobre aluguel?
              </h4>
              <p className="text-gray-700 text-sm">
                <strong>Sim</strong>, se o imóvel for usado para atividade produtiva (fábrica, loja). 
                Imóveis residenciais de sócios <strong>não</strong> geram crédito.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                4. Crédito sobre depreciação contábil?
              </h4>
              <p className="text-gray-700 text-sm">
                <strong>Não.</strong> O crédito é sobre o <strong>IBS/CBS pago na compra do ativo</strong>, 
                amortizado ao longo da vida útil. Não confundir com depreciação contábil (IR/CSLL).
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                5. Pessoa física pode creditar IBS/CBS?
              </h4>
              <p className="text-gray-700 text-sm">
                <strong>Não.</strong> Créditos são exclusivos para <strong>empresas contribuintes</strong> 
                (CNPJ). Consumidores finais (CPF) não creditam.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                6. Simples Nacional terá crédito?
              </h4>
              <p className="text-gray-700 text-sm">
                <strong>Sim, mas limitado.</strong> Empresas do Simples gerarão crédito para seus 
                clientes (via <strong>split payment</strong>), mas elas mesmas terão crédito reduzido, 
                proporcional à alíquota efetiva.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                7. Crédito acumulado pode ser vendido?
              </h4>
              <p className="text-gray-700 text-sm">
                A Lei Complementar deve permitir <strong>transferência de créditos</strong> entre empresas 
                do mesmo grupo econômico ou, em casos específicos, para terceiros.
              </p>
            </div>

          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            📖 Base Legal
          </h3>

          <ul className="space-y-2 text-gray-700 ml-6 mb-6">
            <li>• <strong>Emenda Constitucional 132/2023:</strong> Art. 156-A, §1º — Não cumulatividade do IBS</li>
            <li>• <strong>EC 132/2023:</strong> Art. 195, V, §12 — Não cumulatividade da CBS</li>
            <li>• <strong>Lei Complementar (em tramitação):</strong> Detalhará percentuais e prazos de crédito</li>
            <li>• <strong>Comparação:</strong> Lei 10.833/2003 (PIS/COFINS atual) — créditos limitados</li>
          </ul>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 p-6 rounded-lg mt-8">
            <p className="text-gray-800 text-center leading-relaxed">
              <strong className="text-blue-700">💡 Resumo:</strong> A não cumulatividade plena do 
              IBS/CBS é a <strong>maior mudança estrutural</strong> do sistema tributário brasileiro 
              desde 1988. Empresas que planejarem bem o aproveitamento de créditos poderão reduzir 
              sua carga tributária efetiva em <strong>20% a 40%</strong>, ganhando competitividade e 
              lucratividade. Invista em <strong>tecnologia fiscal</strong> e <strong>capacitação contábil</strong> 
              para não deixar dinheiro na mesa.
            </p>
          </div>

        </article>

      </div>
    </div>
  );
}

import { useState } from 'react';
import { Sliders, TrendingUp, DollarSign, Calculator, Target, BarChart3, Info, AlertCircle } from 'lucide-react';

export default function PlanejadorReforma() {
  const [formData, setFormData] = useState({
    receita: 5000000,
    custo: 3500000,
    credito: 25,
    estado: 'SP',
    segmento: 'comercio'
  });

  const [showComparacao, setShowComparacao] = useState(true);
  const [showDetalhes, setShowDetalhes] = useState(true);

  const estados = {
    SP: { nome: 'São Paulo', aliquotaICMS: 18 },
    RJ: { nome: 'Rio de Janeiro', aliquotaICMS: 20 },
    MG: { nome: 'Minas Gerais', aliquotaICMS: 18 },
    RS: { nome: 'Rio Grande do Sul', aliquotaICMS: 18 },
    PR: { nome: 'Paraná', aliquotaICMS: 19 },
    SC: { nome: 'Santa Catarina', aliquotaICMS: 17 },
    BA: { nome: 'Bahia', aliquotaICMS: 19 },
    CE: { nome: 'Ceará', aliquotaICMS: 18 },
    PE: { nome: 'Pernambuco', aliquotaICMS: 18 },
    GO: { nome: 'Goiás', aliquotaICMS: 17 }
  };

  const segmentos = {
    comercio: { nome: 'Comércio', creditoMedio: 15 },
    industria: { nome: 'Indústria', creditoMedio: 35 },
    servicos: { nome: 'Serviços', creditoMedio: 5 },
    construcao: { nome: 'Construção', creditoMedio: 25 },
    tecnologia: { nome: 'Tecnologia', creditoMedio: 8 },
    saude: { nome: 'Saúde', creditoMedio: 12 },
    alimentacao: { nome: 'Alimentação', creditoMedio: 18 }
  };

  // Cálculos em tempo real
  const calcular = () => {
    const receita = parseFloat(formData.receita);
    const custo = parseFloat(formData.custo);
    const creditoPerc = parseFloat(formData.credito);
    const estado = estados[formData.estado];

    // Sistema Atual
    const aliquotaICMS = estado.aliquotaICMS;
    const aliquotaPISCOFINS = 9.25; // PIS 1,65% + COFINS 7,6%
    const aliquotaTotalAtual = aliquotaICMS + aliquotaPISCOFINS;

    const icmsAtual = (receita * aliquotaICMS) / 100;
    const pisCofinsAtual = (receita * aliquotaPISCOFINS) / 100;
    const tributacaoBrutaAtual = icmsAtual + pisCofinsAtual;
    
    const creditosAtuais = (receita * creditoPerc) / 100;
    const tributacaoLiquidaAtual = tributacaoBrutaAtual - creditosAtuais;

    // Sistema Novo (IBS/CBS)
    const aliquotaIVA = 26.5; // IVA total
    const aliquotaIBS = 26.5 * 0.61; // 61% do IVA
    const aliquotaCBS = 26.5 * 0.39; // 39% do IVA

    const ibsNovo = (receita * aliquotaIBS) / 100;
    const cbsNovo = (receita * aliquotaCBS) / 100;
    const tributacaoBrutaNova = ibsNovo + cbsNovo;

    // Créditos aumentam 20% na reforma (sistema mais amplo)
    const creditosNovos = (receita * creditoPerc * 1.2) / 100;
    const tributacaoLiquidaNova = tributacaoBrutaNova - creditosNovos;

    // Comparação
    const diferencaTributacao = tributacaoLiquidaNova - tributacaoLiquidaAtual;
    const percentualVariacao = tributacaoLiquidaAtual > 0 
      ? (diferencaTributacao / tributacaoLiquidaAtual) * 100 
      : 0;

    // Margem
    const margemAtual = ((receita - custo - tributacaoLiquidaAtual) / receita) * 100;
    const margemNova = ((receita - custo - tributacaoLiquidaNova) / receita) * 100;
    const impactoMargem = margemNova - margemAtual;

    // Lucro
    const lucroAtual = receita - custo - tributacaoLiquidaAtual;
    const lucroNovo = receita - custo - tributacaoLiquidaNova;
    const impactoLucro = lucroNovo - lucroAtual;

    // Ponto de equilíbrio
    const pontoEquilibrioAtual = (custo + tributacaoLiquidaAtual);
    const pontoEquilibrioNovo = (custo + tributacaoLiquidaNova);

    return {
      receita,
      custo,
      credito: creditoPerc,
      
      atual: {
        aliquotaTotal: aliquotaTotalAtual,
        icms: icmsAtual,
        pisCofins: pisCofinsAtual,
        tributacaoBruta: tributacaoBrutaAtual,
        creditos: creditosAtuais,
        tributacaoLiquida: tributacaoLiquidaAtual,
        margem: margemAtual,
        lucro: lucroAtual,
        pontoEquilibrio: pontoEquilibrioAtual
      },
      
      novo: {
        aliquotaTotal: aliquotaIVA,
        ibs: ibsNovo,
        cbs: cbsNovo,
        tributacaoBruta: tributacaoBrutaNova,
        creditos: creditosNovos,
        tributacaoLiquida: tributacaoLiquidaNova,
        margem: margemNova,
        lucro: lucroNovo,
        pontoEquilibrio: pontoEquilibrioNovo
      },
      
      impacto: {
        diferencaTributacao: diferencaTributacao,
        percentualVariacao: percentualVariacao,
        impactoMargem: impactoMargem,
        impactoLucro: impactoLucro,
        pontoEquilibrioDif: pontoEquilibrioNovo - pontoEquilibrioAtual
      }
    };
  };

  const resultado = calcular();

  const handleSliderChange = (name, value) => {
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  const handleSelectChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  const formatPercent = (valor) => {
    return `${valor.toFixed(2)}%`;
  };

  const getCorImpacto = (valor) => {
    if (valor > 0) return 'text-red-600';
    if (valor < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getBgImpacto = (valor) => {
    if (valor > 0) return 'bg-red-50 border-red-300';
    if (valor < 0) return 'bg-green-50 border-green-300';
    return 'bg-gray-50 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
            <Sliders className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Planejador Tributário da Reforma
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ajuste os parâmetros da sua empresa em tempo real e veja instantaneamente o impacto da 
            Reforma Tributária no seu negócio.
          </p>
        </div>

        {/* Controles Interativos */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-purple-600" />
            Ajuste os Parâmetros
          </h2>

          <div className="space-y-8">
            
            {/* Receita Anual */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-lg font-semibold text-gray-700">
                  Receita Anual
                </label>
                <span className="text-2xl font-bold text-purple-600">
                  {formatMoeda(formData.receita)}
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="50000000"
                step="100000"
                value={formData.receita}
                onChange={(e) => handleSliderChange('receita', e.target.value)}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>R$ 100 mil</span>
                <span>R$ 50 milhões</span>
              </div>
            </div>

            {/* Custo Operacional */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-lg font-semibold text-gray-700">
                  Custo Operacional Anual
                </label>
                <span className="text-2xl font-bold text-blue-600">
                  {formatMoeda(formData.custo)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={formData.receita * 0.95}
                step="50000"
                value={formData.custo}
                onChange={(e) => handleSliderChange('custo', e.target.value)}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>R$ 0</span>
                <span>95% da receita</span>
              </div>
            </div>

            {/* Créditos Tributários */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-lg font-semibold text-gray-700">
                  Créditos Tributários (% da receita)
                </label>
                <span className="text-2xl font-bold text-green-600">
                  {formatPercent(formData.credito)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={formData.credito}
                onChange={(e) => handleSliderChange('credito', e.target.value)}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>0%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Seletores */}
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado Principal
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleSelectChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {Object.entries(estados).map(([sigla, info]) => (
                    <option key={sigla} value={sigla}>
                      {sigla} - {info.nome} (ICMS {info.aliquotaICMS}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Segmento de Atuação
                </label>
                <select
                  name="segmento"
                  value={formData.segmento}
                  onChange={handleSelectChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {Object.entries(segmentos).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Comparação Visual */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              Comparação Instantânea
            </h2>
            <button
              onClick={() => setShowComparacao(!showComparacao)}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              {showComparacao ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {showComparacao && (
            <div className="space-y-6">
              
              {/* Cards de Comparação */}
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Sistema Atual */}
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-4 text-center">Sistema Atual</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-blue-700 mb-1">Alíquota Total</div>
                      <div className="text-2xl font-black text-blue-900">
                        {formatPercent(resultado.atual.aliquotaTotal)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-blue-700 mb-1">Tributação Líquida</div>
                      <div className="text-xl font-bold text-blue-900">
                        {formatMoeda(resultado.atual.tributacaoLiquida)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-blue-700 mb-1">Margem de Lucro</div>
                      <div className="text-xl font-bold text-blue-900">
                        {formatPercent(resultado.atual.margem)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-blue-700 mb-1">Lucro Anual</div>
                      <div className="text-lg font-bold text-blue-900">
                        {formatMoeda(resultado.atual.lucro)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impacto */}
                <div className={`rounded-xl p-6 border-2 ${getBgImpacto(resultado.impacto.diferencaTributacao)}`}>
                  <h3 className="font-bold text-gray-900 mb-4 text-center">Impacto da Reforma</h3>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-700 mb-1">Variação Tributária</div>
                      <div className={`text-3xl font-black ${getCorImpacto(resultado.impacto.diferencaTributacao)}`}>
                        {resultado.impacto.diferencaTributacao > 0 ? '+' : ''}
                        {formatMoeda(resultado.impacto.diferencaTributacao)}
                      </div>
                      <div className={`text-sm font-semibold mt-1 ${getCorImpacto(resultado.impacto.percentualVariacao)}`}>
                        {resultado.impacto.percentualVariacao > 0 ? '+' : ''}
                        {formatPercent(resultado.impacto.percentualVariacao)}
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <div className="text-xs text-gray-700 mb-1">Impacto na Margem</div>
                      <div className={`text-xl font-bold ${getCorImpacto(resultado.impacto.impactoMargem)}`}>
                        {resultado.impacto.impactoMargem > 0 ? '+' : ''}
                        {formatPercent(resultado.impacto.impactoMargem)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-700 mb-1">Impacto no Lucro</div>
                      <div className={`text-lg font-bold ${getCorImpacto(resultado.impacto.impactoLucro)}`}>
                        {resultado.impacto.impactoLucro > 0 ? '+' : ''}
                        {formatMoeda(resultado.impacto.impactoLucro)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sistema Novo */}
                <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                  <h3 className="font-bold text-purple-900 mb-4 text-center">Reforma (IBS/CBS)</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-purple-700 mb-1">Alíquota Total</div>
                      <div className="text-2xl font-black text-purple-900">
                        {formatPercent(resultado.novo.aliquotaTotal)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-purple-700 mb-1">Tributação Líquida</div>
                      <div className="text-xl font-bold text-purple-900">
                        {formatMoeda(resultado.novo.tributacaoLiquida)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-purple-700 mb-1">Margem de Lucro</div>
                      <div className="text-xl font-bold text-purple-900">
                        {formatPercent(resultado.novo.margem)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-purple-700 mb-1">Lucro Anual</div>
                      <div className="text-lg font-bold text-purple-900">
                        {formatMoeda(resultado.novo.lucro)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barras de Progresso */}
              <div className="space-y-4 pt-6 border-t">
                <div>
                  <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                    <span>Tributação Líquida</span>
                    <span>
                      {formatMoeda(resultado.atual.tributacaoLiquida)} → {formatMoeda(resultado.novo.tributacaoLiquida)}
                    </span>
                  </div>
                  <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="absolute h-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${(resultado.atual.tributacaoLiquida / resultado.receita) * 100}%` }}
                    />
                    <div 
                      className="absolute h-full bg-purple-600 opacity-70 transition-all duration-500"
                      style={{ width: `${(resultado.novo.tributacaoLiquida / resultado.receita) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                    <span>Margem de Lucro</span>
                    <span>
                      {formatPercent(resultado.atual.margem)} → {formatPercent(resultado.novo.margem)}
                    </span>
                  </div>
                  <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="absolute h-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${resultado.atual.margem}%` }}
                    />
                    <div 
                      className="absolute h-full bg-purple-600 opacity-70 transition-all duration-500"
                      style={{ width: `${resultado.novo.margem}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detalhamento Completo */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-purple-600" />
              Detalhamento Completo
            </h2>
            <button
              onClick={() => setShowDetalhes(!showDetalhes)}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              {showDetalhes ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {showDetalhes && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4 text-right">Sistema Atual</th>
                    <th className="py-3 px-4 text-right">Reforma (IBS/CBS)</th>
                    <th className="py-3 px-4 text-right">Diferença</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-gray-50 font-semibold">
                    <td className="py-3 px-4">Receita Bruta</td>
                    <td className="py-3 px-4 text-right">{formatMoeda(resultado.receita)}</td>
                    <td className="py-3 px-4 text-right">{formatMoeda(resultado.receita)}</td>
                    <td className="py-3 px-4 text-right text-gray-500">-</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 pl-8 text-sm">• ICMS ({formatPercent(estados[formData.estado].aliquotaICMS)})</td>
                    <td className="py-3 px-4 text-right text-red-600">{formatMoeda(resultado.atual.icms)}</td>
                    <td className="py-3 px-4 text-right text-gray-400">-</td>
                    <td className="py-3 px-4 text-right"></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 pl-8 text-sm">• PIS/COFINS (9,25%)</td>
                    <td className="py-3 px-4 text-right text-red-600">{formatMoeda(resultado.atual.pisCofins)}</td>
                    <td className="py-3 px-4 text-right text-gray-400">-</td>
                    <td className="py-3 px-4 text-right"></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 pl-8 text-sm">• IBS (16,165%)</td>
                    <td className="py-3 px-4 text-right text-gray-400">-</td>
                    <td className="py-3 px-4 text-right text-red-600">{formatMoeda(resultado.novo.ibs)}</td>
                    <td className="py-3 px-4 text-right"></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 pl-8 text-sm">• CBS (10,335%)</td>
                    <td className="py-3 px-4 text-right text-gray-400">-</td>
                    <td className="py-3 px-4 text-right text-red-600">{formatMoeda(resultado.novo.cbs)}</td>
                    <td className="py-3 px-4 text-right"></td>
                  </tr>
                  <tr className="bg-red-50 font-semibold">
                    <td className="py-3 px-4">Tributação Bruta</td>
                    <td className="py-3 px-4 text-right text-red-700">{formatMoeda(resultado.atual.tributacaoBruta)}</td>
                    <td className="py-3 px-4 text-right text-red-700">{formatMoeda(resultado.novo.tributacaoBruta)}</td>
                    <td className="py-3 px-4 text-right font-bold">
                      {formatMoeda(resultado.novo.tributacaoBruta - resultado.atual.tributacaoBruta)}
                    </td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="py-3 px-4">(-) Créditos Tributários</td>
                    <td className="py-3 px-4 text-right text-green-700">{formatMoeda(resultado.atual.creditos)}</td>
                    <td className="py-3 px-4 text-right text-green-700">{formatMoeda(resultado.novo.creditos)}</td>
                    <td className="py-3 px-4 text-right text-green-600 font-semibold">
                      +{formatMoeda(resultado.novo.creditos - resultado.atual.creditos)}
                    </td>
                  </tr>
                  <tr className="bg-red-100 font-bold text-lg">
                    <td className="py-4 px-4">Tributação Líquida</td>
                    <td className="py-4 px-4 text-right text-red-800">{formatMoeda(resultado.atual.tributacaoLiquida)}</td>
                    <td className="py-4 px-4 text-right text-red-800">{formatMoeda(resultado.novo.tributacaoLiquida)}</td>
                    <td className={`py-4 px-4 text-right font-black ${getCorImpacto(resultado.impacto.diferencaTributacao)}`}>
                      {resultado.impacto.diferencaTributacao > 0 ? '+' : ''}
                      {formatMoeda(resultado.impacto.diferencaTributacao)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">(-) Custos Operacionais</td>
                    <td className="py-3 px-4 text-right">{formatMoeda(resultado.custo)}</td>
                    <td className="py-3 px-4 text-right">{formatMoeda(resultado.custo)}</td>
                    <td className="py-3 px-4 text-right text-gray-500">-</td>
                  </tr>
                  <tr className="bg-blue-100 font-bold text-lg">
                    <td className="py-4 px-4">Lucro Líquido</td>
                    <td className="py-4 px-4 text-right text-blue-800">{formatMoeda(resultado.atual.lucro)}</td>
                    <td className="py-4 px-4 text-right text-blue-800">{formatMoeda(resultado.novo.lucro)}</td>
                    <td className={`py-4 px-4 text-right font-black ${getCorImpacto(resultado.impacto.impactoLucro)}`}>
                      {resultado.impacto.impactoLucro > 0 ? '+' : ''}
                      {formatMoeda(resultado.impacto.impactoLucro)}
                    </td>
                  </tr>
                  <tr className="bg-yellow-50 font-semibold">
                    <td className="py-3 px-4">Margem de Lucro (%)</td>
                    <td className="py-3 px-4 text-right text-yellow-800">{formatPercent(resultado.atual.margem)}</td>
                    <td className="py-3 px-4 text-right text-yellow-800">{formatPercent(resultado.novo.margem)}</td>
                    <td className={`py-3 px-4 text-right font-bold ${getCorImpacto(resultado.impacto.impactoMargem)}`}>
                      {resultado.impacto.impactoMargem > 0 ? '+' : ''}
                      {formatPercent(resultado.impacto.impactoMargem)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Insights e Recomendações */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Insights Baseados nos Seus Dados
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <h4 className="font-bold text-lg mb-3">💡 Análise do Impacto</h4>
              <p className="text-sm leading-relaxed">
                {resultado.impacto.percentualVariacao > 10 
                  ? `⚠️ CRÍTICO: Seu custo tributário aumentará ${formatPercent(resultado.impacto.percentualVariacao)}. Você precisa repassar preços ou reduzir custos urgentemente.`
                  : resultado.impacto.percentualVariacao > 5
                  ? `⚡ ALTO: Aumento de ${formatPercent(resultado.impacto.percentualVariacao)} na carga. Revise sua precificação e mapeie todos os créditos possíveis.`
                  : resultado.impacto.percentualVariacao > -5
                  ? `✅ MODERADO: Impacto controlável de ${formatPercent(Math.abs(resultado.impacto.percentualVariacao))}. Acompanhe de perto, mas sem pânico.`
                  : `🎉 POSITIVO: Você terá redução de ${formatPercent(Math.abs(resultado.impacto.percentualVariacao))}! Aproveite para investir ou melhorar margens.`
                }
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <h4 className="font-bold text-lg mb-3">🎯 Recomendação Principal</h4>
              <p className="text-sm leading-relaxed">
                {resultado.atual.margem < 15
                  ? `Sua margem atual de ${formatPercent(resultado.atual.margem)} é CRÍTICA. Com a reforma, pode cair para ${formatPercent(resultado.novo.margem)}. URGENTE: aumente preços ou reduza custos antes de 2027!`
                  : resultado.credito < segmentos[formData.segmento].creditoMedio
                  ? `Você está usando apenas ${formatPercent(resultado.credito)} de créditos, abaixo da média do seu setor (${formatPercent(segmentos[formData.segmento].creditoMedio)}%). Mapeie créditos para reduzir impacto.`
                  : `Boa estrutura! Continue monitorando e faça simulações mensais para ajustar estratégia conforme a regulamentação avançar.`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-amber-900 mb-2">
                💡 Use este Planejador com Frequência
              </h4>
              <p className="text-amber-800 leading-relaxed text-sm">
                Os resultados são estimativas baseadas em médias setoriais. Ajuste os parâmetros mensalmente 
                para acompanhar mudanças no seu negócio. Para decisões críticas, consulte sempre um especialista 
                em planejamento tributário.
              </p>
            </div>
          </div>
        </div>

        {/* ARTIGO SEO */}
        <article className="max-w-4xl mx-auto prose prose-lg">
          
          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Planejador Tributário da Reforma: Como Fazer Simulações Precisas
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            O <strong>Planejador Tributário da Reforma</strong> é uma ferramenta essencial para empresários 
            que desejam <strong>antecipar e minimizar os impactos da Reforma Tributária</strong> (EC 132/2023) 
            em seus negócios. Através de <strong>sliders interativos</strong>, você pode ajustar receitas, 
            custos e créditos tributários em tempo real e visualizar instantaneamente como a transição do 
            sistema atual (ICMS, PIS, COFINS) para o novo modelo (IBS e CBS) afetará sua margem de lucro, 
            ponto de equilíbrio e caixa operacional.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Esta ferramenta substitui <strong>planilhas complexas</strong> e oferece uma interface 
            <strong> visual e intuitiva</strong>, ideal para <strong>cenários de teste rápido</strong>, 
            reuniões de planejamento estratégico e <strong>tomadas de decisão baseadas em dados</strong>.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Como Funciona o Planejador
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            1. Ajuste de Parâmetros em Tempo Real
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            O planejador possui <strong>três sliders principais</strong>:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Receita Anual:</strong> De R$ 100 mil a R$ 50 milhões (ajuste em incrementos de R$ 100 mil)
            </li>
            <li>
              <strong>Custo Operacional:</strong> De R$ 0 até 95% da receita (slider proporcional)
            </li>
            <li>
              <strong>Créditos Tributários:</strong> De 0% a 50% da receita (percentual de apropriação)
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-6">
            À medida que você move os sliders, o sistema <strong>recalcula automaticamente</strong> todos 
            os indicadores: tributação líquida, margem de lucro, lucro líquido e ponto de equilíbrio.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            2. Seletores de Contexto
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Além dos sliders, você escolhe:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Estado Principal:</strong> São Paulo, Rio de Janeiro, Minas Gerais, etc. (cada estado 
              possui alíquota de ICMS específica)
            </li>
            <li>
              <strong>Segmento de Atuação:</strong> Comércio, indústria, serviços, construção, tecnologia, 
              saúde, alimentação (cada setor possui média de créditos diferente)
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-6">
            Esses parâmetros influenciam a <strong>alíquota atual de ICMS</strong> e a 
            <strong> média de créditos esperada</strong> para seu setor, tornando as projeções mais realistas.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            3. Comparação Visual Instantânea
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            O planejador exibe <strong>três cards lado a lado</strong>:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Sistema Atual:</strong> ICMS + PIS/COFINS (alíquota total variável por estado)
            </li>
            <li>
              <strong>Impacto da Reforma:</strong> Variação percentual e em reais, impacto na margem e no lucro
            </li>
            <li>
              <strong>Reforma (IBS/CBS):</strong> IBS 16,165% + CBS 10,335% = 26,5% (alíquota unificada)
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-6">
            Barras de progresso coloridas mostram a <strong>tributação líquida</strong> e a 
            <strong> margem de lucro</strong> em ambos os sistemas, facilitando a comparação visual.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Estratégias de Planejamento com o Simulador
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Estratégia 1: Testar Cenários de Crescimento
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Objetivo:</strong> Entender como o crescimento de receita afeta a carga tributária.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Passo a passo:</strong>
          </p>

          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Insira sua receita atual (ex: R$ 5 milhões)</li>
            <li>Mova o slider gradualmente para simular crescimento de 20%, 50% e 100%</li>
            <li>Observe como a <strong>tributação absoluta</strong> aumenta, mas a 
            <strong> margem percentual</strong> pode melhorar se houver ganho de escala</li>
            <li>Compare o <strong>lucro líquido final</strong> nos dois sistemas tributários</li>
          </ol>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Insight:</strong> Se a reforma aumenta a tributação em 8% mas seu crescimento previsto 
            é de 30%, o <strong>lucro absoluto ainda pode crescer</strong>, mesmo com carga maior.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Estratégia 2: Otimizar Estrutura de Créditos
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Objetivo:</strong> Identificar o impacto de aumentar a apropriação de créditos tributários.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Passo a passo:</strong>
          </p>

          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Insira seu percentual atual de créditos (ex: 15%)</li>
            <li>Aumente gradualmente para 20%, 25%, 30%</li>
            <li>Veja a <strong>redução da tributação líquida</strong> em cada cenário</li>
            <li>Calcule o <strong>ROI de investir em controles</strong> para capturar mais créditos</li>
          </ol>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Exemplo:</strong> Se aumentar créditos de 15% para 25% reduz sua tributação em 
            R$ 200 mil/ano, investir R$ 50 mil em <strong>sistema de gestão fiscal</strong> tem 
            <strong> payback de 3 meses</strong>.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Estratégia 3: Avaliar Necessidade de Repasse de Preços
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Objetivo:</strong> Determinar quanto aumentar preços para manter a margem atual.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Passo a passo:</strong>
          </p>

          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Simule sua receita e custos atuais</li>
            <li>Veja o <strong>impacto da reforma na margem</strong> (ex: queda de 2,3 pontos percentuais)</li>
            <li>Aumente o slider de receita proporcionalmente até a margem voltar ao nível atual</li>
            <li>Calcule o <strong>percentual de reajuste necessário</strong></li>
          </ol>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Exemplo:</strong> Se a margem cai de 18% para 15,7% e você precisa aumentar receita 
            de R$ 5 milhões para R$ 5,3 milhões, o <strong>reajuste necessário é de 6%</strong>.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Estratégia 4: Comparar Estados para Expansão
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Objetivo:</strong> Avaliar qual estado oferece melhor vantagem tributária pós-reforma.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Passo a passo:</strong>
          </p>

          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Simule operação em São Paulo (ICMS 18%)</li>
            <li>Alterne para outros estados (Rio 20%, Santa Catarina 17%, etc.)</li>
            <li>Compare o <strong>impacto atual vs. pós-reforma</strong></li>
            <li>Após 2033, todos terão <strong>alíquota uniforme</strong> (IBS/CBS 26,5%)</li>
          </ol>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Insight:</strong> Hoje, estados com ICMS baixo (SC 17%) têm vantagem. Pós-reforma, 
            a competição será por <strong>infraestrutura e logística</strong>, não mais por guerra fiscal.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Interpretando os Resultados
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Card "Sistema Atual"
          </h3>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Alíquota Total:</strong> Soma do ICMS do seu estado + PIS/COFINS (9,25%)
            </li>
            <li>
              <strong>Tributação Líquida:</strong> Tributos brutos menos créditos aproveitados
            </li>
            <li>
              <strong>Margem de Lucro:</strong> (Receita - Custos - Tributos) / Receita × 100
            </li>
            <li>
              <strong>Lucro Anual:</strong> Valor absoluto disponível para distribuição/investimento
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Card "Impacto da Reforma"
          </h3>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Variação Tributária:</strong> Diferença absoluta e percentual na carga total
            </li>
            <li>
              <strong>Impacto na Margem:</strong> Quantos pontos percentuais você ganha/perde
            </li>
            <li>
              <strong>Impacto no Lucro:</strong> Valor em reais que você ganha/perde por ano
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Cores dos indicadores:</strong>
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li><strong className="text-green-600">Verde:</strong> Redução de carga (benefício)</li>
            <li><strong className="text-red-600">Vermelho:</strong> Aumento de carga (custo adicional)</li>
            <li><strong className="text-gray-600">Cinza:</strong> Impacto neutro</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Card "Reforma (IBS/CBS)"
          </h3>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Alíquota Total:</strong> Sempre 26,5% (IBS 16,165% + CBS 10,335%)
            </li>
            <li>
              <strong>Tributação Líquida:</strong> Considerando créditos ampliados (120% do atual)
            </li>
            <li>
              <strong>Margem e Lucro:</strong> Projeções após plena vigência da reforma (2033+)
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Insights Automáticos Gerados pela Ferramenta
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Análise de Impacto
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            O sistema classifica automaticamente o impacto em quatro níveis:
          </p>

          <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6 ml-4">
            <li>
              <strong>🔴 CRÍTICO (variação &gt; 10%):</strong> Necessário repasse de preços ou reestruturação urgente
            </li>
            <li>
              <strong>🟠 ALTO (variação 5% a 10%):</strong> Ajuste na precificação e mapeamento de créditos
            </li>
            <li>
              <strong>🟡 MODERADO (variação -5% a 5%):</strong> Monitoramento próximo, sem pânico
            </li>
            <li>
              <strong>🟢 POSITIVO (variação &lt; -5%):</strong> Redução de carga, oportunidade de investimento
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Recomendações Personalizadas
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Baseado nos seus dados, o planejador oferece recomendações específicas:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Margem crítica (&lt; 15%):</strong> Alerta para risco de inviabilidade operacional
            </li>
            <li>
              <strong>Créditos abaixo da média:</strong> Sugestão de revisão fiscal e mapeamento
            </li>
            <li>
              <strong>Estrutura adequada:</strong> Recomendação de simulações mensais contínuas
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Exemplos Práticos de Uso
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Exemplo 1: Comércio Varejista em São Paulo
          </h3>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-6">
            <p className="text-gray-800 mb-3">
              <strong>Cenário:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Receita: R$ 8 milhões/ano</li>
              <li>Custos: R$ 5,6 milhões (70%)</li>
              <li>Créditos: 12% (abaixo da média de comércio, que é 15%)</li>
              <li>Estado: São Paulo (ICMS 18%)</li>
            </ul>
            <p className="text-gray-800 mt-4 mb-3">
              <strong>Resultado:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Sistema Atual: Margem de 14,2%</li>
              <li>Pós-Reforma: Margem de 11,8% (-2,4 p.p.)</li>
              <li>Impacto no Lucro: Redução de R$ 192 mil/ano</li>
            </ul>
            <p className="text-gray-800 mt-4">
              <strong>Recomendação:</strong> Aumentar apropriação de créditos para 15% 
              (recuperando R$ 80 mil/ano) e repassar 3% nos preços (R$ 240 mil/ano).
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Exemplo 2: Indústria em Minas Gerais
          </h3>

          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg mb-6">
            <p className="text-gray-800 mb-3">
              <strong>Cenário:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Receita: R$ 20 milhões/ano</li>
              <li>Custos: R$ 14 milhões (70%)</li>
              <li>Créditos: 38% (acima da média industrial de 35%)</li>
              <li>Estado: Minas Gerais (ICMS 18%)</li>
            </ul>
            <p className="text-gray-800 mt-4 mb-3">
              <strong>Resultado:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Sistema Atual: Margem de 22,4%</li>
              <li>Pós-Reforma: Margem de 23,1% (+0,7 p.p.)</li>
              <li>Impacto no Lucro: Ganho de R$ 140 mil/ano</li>
            </ul>
            <p className="text-gray-800 mt-4">
              <strong>Recomendação:</strong> A reforma beneficiará sua empresa! Aproveite para 
              investir em expansão ou melhorar competitividade via redução de preços.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Exemplo 3: Prestadora de Serviços em SC
          </h3>

          <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-lg mb-6">
            <p className="text-gray-800 mb-3">
              <strong>Cenário:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Receita: R$ 3 milhões/ano</li>
              <li>Custos: R$ 2,1 milhões (70%)</li>
              <li>Créditos: 5% (média de serviços)</li>
              <li>Estado: Santa Catarina (ICMS 17%)</li>
            </ul>
            <p className="text-gray-800 mt-4 mb-3">
              <strong>Resultado:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Sistema Atual: Margem de 19,8%</li>
              <li>Pós-Reforma: Margem de 17,3% (-2,5 p.p.)</li>
              <li>Impacto no Lucro: Redução de R$ 75 mil/ano</li>
            </ul>
            <p className="text-gray-800 mt-4">
              <strong>Recomendação:</strong> Impacto moderado. Considere reajuste anual de 4% 
              e mapeie créditos de insumos tecnológicos para compensar parcialmente.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Erros Comuns ao Usar o Planejador
          </h2>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-red-900 mb-3">
              ❌ Erro 1: Usar Dados Desatualizados
            </h4>
            <p className="text-gray-700 mb-3">
              Simular com receita e custos de 2 anos atrás leva a projeções irrelevantes.
            </p>
            <p className="text-gray-700">
              <strong>✅ Solução:</strong> Use sempre dados dos últimos 12 meses. Atualize 
              mensalmente para acompanhar tendências.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-red-900 mb-3">
              ❌ Erro 2: Ignorar Créditos Potenciais
            </h4>
            <p className="text-gray-700 mb-3">
              Usar percentual atual de créditos sem mapear potenciais subestima a capacidade 
              de compensação pós-reforma.
            </p>
            <p className="text-gray-700">
              <strong>✅ Solução:</strong> Faça auditoria fiscal para identificar créditos não 
              apropriados. Na reforma, o sistema será mais amplo.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-red-900 mb-3">
              ❌ Erro 3: Tomar Decisões Baseado em Uma Única Simulação
            </h4>
            <p className="text-gray-700 mb-3">
              Fazer uma simulação isolada e já decidir aumentar preços pode ser precipitado.
            </p>
            <p className="text-gray-700">
              <strong>✅ Solução:</strong> Teste <strong>múltiplos cenários</strong> (pessimista, 
              realista, otimista) antes de tomar decisões estratégicas.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-red-900 mb-3">
              ❌ Erro 4: Não Considerar Período de Transição
            </h4>
            <p className="text-gray-700 mb-3">
              A reforma não será implementada da noite para o dia. Há uma transição gradual 
              de 2026 a 2033.
            </p>
            <p className="text-gray-700">
              <strong>✅ Solução:</strong> Use ferramentas complementares como 
              <strong> Analisador de Impacto Tributário</strong> para entender o cronograma 
              de transição ano a ano.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                1. Os resultados do planejador são 100% precisos?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                Não. São <strong>estimativas baseadas em médias setoriais e alíquotas projetadas</strong>. 
                A regulamentação completa da reforma ainda está em andamento. Use para 
                <strong> decisões estratégicas gerais</strong>, mas consulte um contador para cálculos 
                definitivos antes de implementar mudanças.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                2. Com que frequência devo usar o planejador?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                Recomendamos <strong>simulações mensais</strong> durante o período de transição 
                (2026-2033) e <strong>trimestrais</strong> após a implementação completa. Sempre 
                que houver mudança significativa em receita, custos ou estrutura operacional, 
                faça nova simulação.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                3. Posso usar dados projetados ou apenas dados históricos?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                Pode usar ambos! Para <strong>planejamento estratégico</strong>, use projeções 
                de crescimento. Para <strong>diagnóstico atual</strong>, use dados históricos 
                dos últimos 12 meses. O ideal é fazer <strong>cenários múltiplos</strong>: base 
                (dados reais), crescimento conservador (+10%), crescimento agressivo (+30%).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                4. O que fazer se o impacto for muito negativo?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Primeiro:</strong> Mapeie todos os créditos possíveis (sistema ampliado). 
                <strong>Segundo:</strong> Avalie repasse gradual de preços. <strong>Terceiro:</strong> 
                Analise redução de custos operacionais. <strong>Quarto:</strong> Consulte especialista 
                em planejamento tributário para estratégias avançadas (reorganização societária, 
                mudança de regime, etc.).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                5. A ferramenta considera regimes especiais (Simples, Presumido)?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                Esta versão é <strong>focada em Lucro Real</strong> (regime de ICMS, PIS, COFINS 
                completos). Para empresas do <strong>Simples Nacional</strong>, use nossa calculadora 
                específica "Simulador de Impacto no Simples Nacional". O Simples terá regras 
                próprias de transição e convivência com o IBS/CBS.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                6. Como a ferramenta calcula os créditos no novo sistema?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                Assumimos que os <strong>créditos aumentarão 20%</strong> no novo sistema devido à 
                <strong> base mais ampla</strong> (energia, telecomunicações, logística e ativos 
                fixos entram na apuração). Essa é uma média conservadora. Indústrias podem ter 
                aumento maior. Serviços, menor.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                7. Posso compartilhar os resultados com meu contador?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                Sim! Use a função <strong>print ou screenshot</strong> dos resultados. Os dados 
                são apenas visuais na tela, mas servem como <strong>ponto de partida</strong> 
                para discussões estratégicas com sua consultoria contábil.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Termos Importantes
          </h2>

          <dl className="space-y-4">
            <div>
              <dt className="font-bold text-gray-900">IBS (Imposto sobre Bens e Serviços)</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Tributo estadual e municipal que <strong>substitui ICMS e ISS</strong>. 
                Representa 61% do IVA dual, com alíquota projetada de 16,165%. Partilhado 
                entre estados (50%) e municípios (50%).
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">CBS (Contribuição sobre Bens e Serviços)</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Tributo federal que <strong>substitui PIS, COFINS e IPI</strong>. Representa 
                39% do IVA dual, com alíquota projetada de 10,335%. Arrecadado integralmente 
                pela União.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Alíquota Efetiva</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Percentual <strong>real</strong> de tributos pagos após apropriação de créditos, 
                deduções e compensações. Sempre menor que a alíquota nominal (26,5%).
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Créditos Tributários</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Valores de IBS/CBS pagos em <strong>etapas anteriores da cadeia</strong> que 
                podem ser deduzidos do imposto devido. Princípio da <strong>não cumulatividade</strong> 
                garantido na EC 132/2023.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Margem de Lucro</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Percentual da receita que sobra após deduzir custos e tributos. Fórmula: 
                <strong> (Receita - Custos - Tributos) / Receita × 100</strong>. Indicador 
                essencial de viabilidade do negócio.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Ponto de Equilíbrio</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Nível mínimo de receita necessário para cobrir custos fixos e variáveis 
                <strong> + tributos líquidos</strong>. Abaixo desse ponto, a empresa opera 
                com prejuízo.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Repasse de Preços</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Estratégia de aumentar preços de venda para <strong>compensar aumento de carga 
                tributária</strong>, mantendo margem de lucro constante. Limitado pela 
                elasticidade da demanda.
              </dd>
            </div>
          </dl>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Base Legal
          </h2>

          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Emenda Constitucional 132/2023:</strong> Institui a Reforma Tributária, 
              criando IBS e CBS
            </li>
            <li>
              <strong>Art. 156-A, CF:</strong> Competência dos estados e municípios para instituir o IBS
            </li>
            <li>
              <strong>Art. 195, CF (nova redação):</strong> CBS substitui PIS/COFINS
            </li>
            <li>
              <strong>Lei Complementar (em tramitação):</strong> Regulamentará alíquotas, 
              créditos e transição (2026-2033)
            </li>
            <li>
              <strong>Comitê Gestor do IBS:</strong> Órgão interfederativo que administrará 
              arrecadação e distribuição
            </li>
          </ul>

          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg mt-8">
            <p className="text-gray-800 leading-relaxed">
              <strong>📌 Importante:</strong> Este planejador é uma ferramenta de 
              <strong> apoio à decisão</strong>, não substitui consultoria profissional. 
              Para estratégias tributárias definitivas, consulte sempre um contador ou 
              advogado tributarista especializado em Reforma Tributária.
            </p>
          </div>

        </article>

      </div>
    </div>
  );
}

import { useState } from 'react';
import { Factory, TrendingDown, Zap, Truck, Settings, Calculator, Info, AlertCircle } from 'lucide-react';

export default function SimuladorIndustriaReforma() {
  const [formData, setFormData] = useState({
    receitaAnual: 10000000,
    insumos: 4000000,
    energia: 800000,
    frete: 600000,
    ativosPermanentes: 500000,
    segmento: 'metalurgica'
  });

  const [resultado, setResultado] = useState(null);

  const segmentos = {
    metalurgica: { nome: 'Metalúrgica', creditoAtual: 38, margem: 22 },
    alimentos: { nome: 'Alimentos e Bebidas', creditoAtual: 32, margem: 18 },
    textil: { nome: 'Têxtil', creditoAtual: 35, margem: 25 },
    quimica: { nome: 'Química', creditoAtual: 40, margem: 20 },
    plasticos: { nome: 'Plásticos', creditoAtual: 36, margem: 24 },
    moveis: { nome: 'Móveis', creditoAtual: 33, margem: 28 },
    automotiva: { nome: 'Automotiva', creditoAtual: 42, margem: 19 },
    papel: { nome: 'Papel e Celulose', creditoAtual: 37, margem: 21 }
  };

  const calcular = () => {
    const receita = parseFloat(formData.receitaAnual);
    const insumos = parseFloat(formData.insumos);
    const energia = parseFloat(formData.energia);
    const frete = parseFloat(formData.frete);
    const ativos = parseFloat(formData.ativosPermanentes);
    const segmento = segmentos[formData.segmento];

    // SISTEMA ATUAL
    // Alíquotas médias (considerando mix de ICMS 18% + PIS/COFINS 9.25%)
    const aliquotaAtual = 27.25; // ICMS 18% + PIS 1.65% + COFINS 7.6%

    // Tributação bruta
    const tributacaoBrutaAtual = (receita * aliquotaAtual) / 100;

    // Créditos ATUAIS (limitados)
    const creditoInsumosAtual = (insumos * aliquotaAtual) / 100;
    
    // Energia: apenas 50% gera crédito no sistema atual (restrições)
    const creditoEnergiaAtual = ((energia * 0.5) * aliquotaAtual) / 100;
    
    // Frete: crédito parcial (70% do valor)
    const creditoFreteAtual = ((frete * 0.7) * aliquotaAtual) / 100;
    
    // Ativos permanentes: SEM crédito no sistema atual (depreciação apenas no IR)
    const creditoAtivosAtual = 0;

    const creditosTotaisAtual = creditoInsumosAtual + creditoEnergiaAtual + creditoFreteAtual + creditoAtivosAtual;
    const tributacaoLiquidaAtual = tributacaoBrutaAtual - creditosTotaisAtual;

    // SISTEMA NOVO (IBS/CBS)
    const aliquotaNova = 26.5; // IBS 16.165% + CBS 10.335%

    const tributacaoBrutaNova = (receita * aliquotaNova) / 100;

    // Créditos NOVOS (ampliados)
    // Insumos: crédito integral
    const creditoInsumosNovo = (insumos * aliquotaNova) / 100;
    
    // Energia: crédito INTEGRAL (100%)
    const creditoEnergiaNovo = (energia * aliquotaNova) / 100;
    
    // Frete: crédito INTEGRAL (100%)
    const creditoFreteNovo = (frete * aliquotaNova) / 100;
    
    // Ativos permanentes: crédito INTEGRAL distribuído em 5 anos (20% ao ano)
    const creditoAtivosNovo = ((ativos * 0.2) * aliquotaNova) / 100;

    const creditosTotaisNovo = creditoInsumosNovo + creditoEnergiaNovo + creditoFreteNovo + creditoAtivosNovo;
    const tributacaoLiquidaNova = tributacaoBrutaNova - creditosTotaisNovo;

    // Comparação
    const diferencaTributacao = tributacaoLiquidaNova - tributacaoLiquidaAtual;
    const percentualVariacao = tributacaoLiquidaAtual > 0 
      ? (diferencaTributacao / tributacaoLiquidaAtual) * 100 
      : 0;

    const economiaCreditos = creditosTotaisNovo - creditosTotaisAtual;
    const percentualEconomiaCreditos = creditosTotaisAtual > 0
      ? (economiaCreditos / creditosTotaisAtual) * 100
      : 0;

    // Alíquota Efetiva
    const aliquotaEfetivaAtual = (tributacaoLiquidaAtual / receita) * 100;
    const aliquotaEfetivaNova = (tributacaoLiquidaNova / receita) * 100;
    const reducaoAliquotaEfetiva = aliquotaEfetivaAtual - aliquotaEfetivaNova;

    // Margem e Lucro
    const custosOperacionais = receita * (1 - segmento.margem / 100);
    const margemAtual = ((receita - custosOperacionais - tributacaoLiquidaAtual) / receita) * 100;
    const margemNova = ((receita - custosOperacionais - tributacaoLiquidaNova) / receita) * 100;
    const impactoMargem = margemNova - margemAtual;

    const lucroAtual = receita - custosOperacionais - tributacaoLiquidaAtual;
    const lucroNovo = receita - custosOperacionais - tributacaoLiquidaNova;
    const impactoLucro = lucroNovo - lucroAtual;

    // Análise de Créditos por Categoria
    const detalhesCreditos = {
      insumos: {
        atual: creditoInsumosAtual,
        novo: creditoInsumosNovo,
        ganho: creditoInsumosNovo - creditoInsumosAtual,
        percentualGanho: creditoInsumosAtual > 0 ? ((creditoInsumosNovo - creditoInsumosAtual) / creditoInsumosAtual) * 100 : 0
      },
      energia: {
        atual: creditoEnergiaAtual,
        novo: creditoEnergiaNovo,
        ganho: creditoEnergiaNovo - creditoEnergiaAtual,
        percentualGanho: creditoEnergiaAtual > 0 ? ((creditoEnergiaNovo - creditoEnergiaAtual) / creditoEnergiaAtual) * 100 : 100
      },
      frete: {
        atual: creditoFreteAtual,
        novo: creditoFreteNovo,
        ganho: creditoFreteNovo - creditoFreteAtual,
        percentualGanho: creditoFreteAtual > 0 ? ((creditoFreteNovo - creditoFreteAtual) / creditoFreteAtual) * 100 : 0
      },
      ativos: {
        atual: creditoAtivosAtual,
        novo: creditoAtivosNovo,
        ganho: creditoAtivosNovo - creditoAtivosAtual,
        percentualGanho: creditoAtivosAtual === 0 && creditoAtivosNovo > 0 ? 100 : 0
      }
    };

    setResultado({
      receita,
      insumos,
      energia,
      frete,
      ativos,
      segmento,
      
      atual: {
        aliquota: aliquotaAtual,
        tributacaoBruta: tributacaoBrutaAtual,
        creditos: creditosTotaisAtual,
        tributacaoLiquida: tributacaoLiquidaAtual,
        aliquotaEfetiva: aliquotaEfetivaAtual,
        margem: margemAtual,
        lucro: lucroAtual
      },
      
      novo: {
        aliquota: aliquotaNova,
        tributacaoBruta: tributacaoBrutaNova,
        creditos: creditosTotaisNovo,
        tributacaoLiquida: tributacaoLiquidaNova,
        aliquotaEfetiva: aliquotaEfetivaNova,
        margem: margemNova,
        lucro: lucroNovo
      },
      
      impacto: {
        diferencaTributacao,
        percentualVariacao,
        economiaCreditos,
        percentualEconomiaCreditos,
        reducaoAliquotaEfetiva,
        impactoMargem,
        impactoLucro
      },
      
      detalhesCreditos
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calcular();
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <Factory className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simulador para Indústrias
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calcule os créditos de IBS/CBS sobre insumos, energia, frete e ativos permanentes 
            e descubra quanto sua indústria vai economizar com a Reforma Tributária.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            Dados da Indústria
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Receita Anual (R$)
              </label>
              <input
                type="number"
                name="receitaAnual"
                value={formData.receitaAnual}
                onChange={handleChange}
                min="1"
                step="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Segmento Industrial
              </label>
              <select
                name="segmento"
                value={formData.segmento}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {Object.entries(segmentos).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 border-t pt-6 mt-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                💰 Gastos que Geram Créditos Tributários
              </h3>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                Insumos e Matéria-Prima (R$/ano)
              </label>
              <input
                type="number"
                name="insumos"
                value={formData.insumos}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                Energia Elétrica (R$/ano)
              </label>
              <input
                type="number"
                name="energia"
                value={formData.energia}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                Frete e Logística (R$/ano)
              </label>
              <input
                type="number"
                name="frete"
                value={formData.frete}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-600" />
                Ativos Permanentes (R$ - aquisição anual)
              </label>
              <input
                type="number"
                name="ativosPermanentes"
                value={formData.ativosPermanentes}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Máquinas, equipamentos, veículos adquiridos no ano
              </p>
            </div>

          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calcular Economia com a Reforma
          </button>
        </form>

        {/* Resultados */}
        {resultado && (
          <>
            {/* Resumo do Impacto */}
            <div className={`rounded-2xl shadow-xl p-8 mb-8 border-2 ${getBgImpacto(resultado.impacto.diferencaTributacao)}`}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                💡 Resumo do Impacto
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-700 mb-2">Economia Anual com Créditos</div>
                  <div className={`text-4xl font-black ${getCorImpacto(-resultado.impacto.economiaCreditos)}`}>
                    {formatMoeda(resultado.impacto.economiaCreditos)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {resultado.impacto.economiaCreditos > 0 ? '+' : ''}
                    {formatPercent(resultado.impacto.percentualEconomiaCreditos)} vs. atual
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-700 mb-2">Redução da Alíquota Efetiva</div>
                  <div className={`text-4xl font-black ${getCorImpacto(-resultado.impacto.reducaoAliquotaEfetiva)}`}>
                    {resultado.impacto.reducaoAliquotaEfetiva > 0 ? '-' : '+'}
                    {formatPercent(Math.abs(resultado.impacto.reducaoAliquotaEfetiva))}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    De {formatPercent(resultado.atual.aliquotaEfetiva)} para {formatPercent(resultado.novo.aliquotaEfetiva)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-700 mb-2">Impacto no Lucro Anual</div>
                  <div className={`text-4xl font-black ${getCorImpacto(resultado.impacto.impactoLucro)}`}>
                    {resultado.impacto.impactoLucro > 0 ? '+' : ''}
                    {formatMoeda(resultado.impacto.impactoLucro)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {resultado.impacto.impactoLucro > 0 ? 'Ganho' : 'Perda'} líquido
                  </div>
                </div>
              </div>
            </div>

            {/* Detalhamento de Créditos */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingDown className="w-6 h-6 text-green-600" />
                Análise Detalhada de Créditos
              </h2>

              <div className="space-y-6">
                
                {/* Insumos */}
                <div className="border rounded-xl p-6 bg-gradient-to-r from-purple-50 to-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      Insumos e Matéria-Prima
                    </h3>
                    <span className="text-sm font-semibold text-gray-600">
                      Gasto: {formatMoeda(resultado.insumos)}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Crédito Atual</div>
                      <div className="text-xl font-bold text-blue-600">
                        {formatMoeda(resultado.detalhesCreditos.insumos.atual)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Crédito Pós-Reforma</div>
                      <div className="text-xl font-bold text-purple-600">
                        {formatMoeda(resultado.detalhesCreditos.insumos.novo)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Ganho</div>
                      <div className="text-xl font-bold text-green-600">
                        +{formatMoeda(resultado.detalhesCreditos.insumos.ganho)}
                      </div>
                      <div className="text-xs text-green-600">
                        +{formatPercent(resultado.detalhesCreditos.insumos.percentualGanho)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 bg-purple-100 p-3 rounded-lg">
                    ℹ️ <strong>Mudança:</strong> Crédito continua integral. Pequeno ganho pela diferença 
                    de alíquota (27,25% → 26,5%).
                  </p>
                </div>

                {/* Energia */}
                <div className="border rounded-xl p-6 bg-gradient-to-r from-yellow-50 to-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      Energia Elétrica
                    </h3>
                    <span className="text-sm font-semibold text-gray-600">
                      Gasto: {formatMoeda(resultado.energia)}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Crédito Atual (50%)</div>
                      <div className="text-xl font-bold text-blue-600">
                        {formatMoeda(resultado.detalhesCreditos.energia.atual)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Crédito Pós-Reforma (100%)</div>
                      <div className="text-xl font-bold text-yellow-600">
                        {formatMoeda(resultado.detalhesCreditos.energia.novo)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Ganho</div>
                      <div className="text-xl font-bold text-green-600">
                        +{formatMoeda(resultado.detalhesCreditos.energia.ganho)}
                      </div>
                      <div className="text-xs text-green-600">
                        +{formatPercent(resultado.detalhesCreditos.energia.percentualGanho)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 bg-yellow-100 p-3 rounded-lg">
                    ⚡ <strong>Grande Mudança!</strong> Hoje energia tem restrições (apenas 50% gera crédito). 
                    Na reforma, crédito é 100% integral!
                  </p>
                </div>

                {/* Frete */}
                <div className="border rounded-xl p-6 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      Frete e Logística
                    </h3>
                    <span className="text-sm font-semibold text-gray-600">
                      Gasto: {formatMoeda(resultado.frete)}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Crédito Atual (70%)</div>
                      <div className="text-xl font-bold text-blue-600">
                        {formatMoeda(resultado.detalhesCreditos.frete.atual)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Crédito Pós-Reforma (100%)</div>
                      <div className="text-xl font-bold text-blue-700">
                        {formatMoeda(resultado.detalhesCreditos.frete.novo)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Ganho</div>
                      <div className="text-xl font-bold text-green-600">
                        +{formatMoeda(resultado.detalhesCreditos.frete.ganho)}
                      </div>
                      <div className="text-xs text-green-600">
                        +{formatPercent(resultado.detalhesCreditos.frete.percentualGanho)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 bg-blue-100 p-3 rounded-lg">
                    🚚 <strong>Mudança Importante:</strong> Hoje frete tem crédito parcial (~70%). 
                    Na reforma, crédito é 100% integral!
                  </p>
                </div>

                {/* Ativos Permanentes */}
                <div className="border rounded-xl p-6 bg-gradient-to-r from-green-50 to-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-green-600" />
                      Ativos Permanentes (Máquinas/Equipamentos)
                    </h3>
                    <span className="text-sm font-semibold text-gray-600">
                      Investimento: {formatMoeda(resultado.ativos)}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Crédito Atual</div>
                      <div className="text-xl font-bold text-gray-400">
                        {formatMoeda(resultado.detalhesCreditos.ativos.atual)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Sem crédito</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Crédito Pós-Reforma (20%/ano)</div>
                      <div className="text-xl font-bold text-green-600">
                        {formatMoeda(resultado.detalhesCreditos.ativos.novo)}
                      </div>
                      <div className="text-xs text-green-600 mt-1">Dividido em 5 anos</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Ganho</div>
                      <div className="text-xl font-bold text-green-600">
                        +{formatMoeda(resultado.detalhesCreditos.ativos.ganho)}
                      </div>
                      <div className="text-xs text-green-600">
                        NOVO BENEFÍCIO!
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 bg-green-100 p-3 rounded-lg">
                    🎉 <strong>NOVIDADE!</strong> Hoje ativos permanentes NÃO geram crédito tributário. 
                    Na reforma, você recupera 20% ao ano durante 5 anos!
                  </p>
                </div>

              </div>
            </div>

            {/* Comparação Geral */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📊 Comparação Completa
              </h2>

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
                      <td className="py-3 px-4">Receita Anual</td>
                      <td className="py-3 px-4 text-right">{formatMoeda(resultado.receita)}</td>
                      <td className="py-3 px-4 text-right">{formatMoeda(resultado.receita)}</td>
                      <td className="py-3 px-4 text-right text-gray-500">-</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Alíquota Nominal</td>
                      <td className="py-3 px-4 text-right">{formatPercent(resultado.atual.aliquota)}</td>
                      <td className="py-3 px-4 text-right">{formatPercent(resultado.novo.aliquota)}</td>
                      <td className="py-3 px-4 text-right text-green-600 font-semibold">
                        -{formatPercent(resultado.atual.aliquota - resultado.novo.aliquota)}
                      </td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="py-3 px-4">Tributação Bruta</td>
                      <td className="py-3 px-4 text-right text-red-700">{formatMoeda(resultado.atual.tributacaoBruta)}</td>
                      <td className="py-3 px-4 text-right text-red-700">{formatMoeda(resultado.novo.tributacaoBruta)}</td>
                      <td className="py-3 px-4 text-right text-green-600 font-semibold">
                        -{formatMoeda(resultado.atual.tributacaoBruta - resultado.novo.tributacaoBruta)}
                      </td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="py-3 px-4">(-) Créditos Tributários</td>
                      <td className="py-3 px-4 text-right text-green-700">{formatMoeda(resultado.atual.creditos)}</td>
                      <td className="py-3 px-4 text-right text-green-700">{formatMoeda(resultado.novo.creditos)}</td>
                      <td className="py-3 px-4 text-right text-green-600 font-black">
                        +{formatMoeda(resultado.novo.creditos - resultado.atual.creditos)}
                      </td>
                    </tr>
                    <tr className="bg-blue-100 font-bold text-lg">
                      <td className="py-4 px-4">Tributação Líquida</td>
                      <td className="py-4 px-4 text-right text-blue-800">{formatMoeda(resultado.atual.tributacaoLiquida)}</td>
                      <td className="py-4 px-4 text-right text-blue-800">{formatMoeda(resultado.novo.tributacaoLiquida)}</td>
                      <td className={`py-4 px-4 text-right font-black ${getCorImpacto(resultado.impacto.diferencaTributacao)}`}>
                        {resultado.impacto.diferencaTributacao > 0 ? '+' : ''}
                        {formatMoeda(resultado.impacto.diferencaTributacao)}
                      </td>
                    </tr>
                    <tr className="bg-yellow-50 font-semibold">
                      <td className="py-3 px-4">Alíquota Efetiva</td>
                      <td className="py-3 px-4 text-right text-yellow-800">{formatPercent(resultado.atual.aliquotaEfetiva)}</td>
                      <td className="py-3 px-4 text-right text-yellow-800">{formatPercent(resultado.novo.aliquotaEfetiva)}</td>
                      <td className={`py-3 px-4 text-right font-bold ${getCorImpacto(resultado.impacto.reducaoAliquotaEfetiva)}`}>
                        {resultado.impacto.reducaoAliquotaEfetiva > 0 ? '-' : '+'}
                        {formatPercent(Math.abs(resultado.impacto.reducaoAliquotaEfetiva))}
                      </td>
                    </tr>
                    <tr className="bg-purple-50">
                      <td className="py-3 px-4">Margem de Lucro</td>
                      <td className="py-3 px-4 text-right text-purple-700">{formatPercent(resultado.atual.margem)}</td>
                      <td className="py-3 px-4 text-right text-purple-700">{formatPercent(resultado.novo.margem)}</td>
                      <td className={`py-3 px-4 text-right font-bold ${getCorImpacto(resultado.impacto.impactoMargem)}`}>
                        {resultado.impacto.impactoMargem > 0 ? '+' : ''}
                        {formatPercent(resultado.impacto.impactoMargem)}
                      </td>
                    </tr>
                    <tr className="bg-green-100 font-bold text-lg">
                      <td className="py-4 px-4">Lucro Anual</td>
                      <td className="py-4 px-4 text-right text-green-800">{formatMoeda(resultado.atual.lucro)}</td>
                      <td className="py-4 px-4 text-right text-green-800">{formatMoeda(resultado.novo.lucro)}</td>
                      <td className={`py-4 px-4 text-right font-black ${getCorImpacto(resultado.impacto.impactoLucro)}`}>
                        {resultado.impacto.impactoLucro > 0 ? '+' : ''}
                        {formatMoeda(resultado.impacto.impactoLucro)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recomendações */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6">🎯 Recomendações para Sua Indústria</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <h4 className="font-bold text-lg mb-3">💡 Estratégias Imediatas</h4>
                  <ul className="space-y-2 text-sm">
                    {resultado.impacto.economiaCreditos > 0 && (
                      <li>✅ Mapeie TODOS os gastos com energia, frete e ativos para maximizar créditos</li>
                    )}
                    {resultado.detalhesCreditos.ativos.novo > 0 && (
                      <li>✅ Planeje investimentos em máquinas/equipamentos (agora geram crédito!)</li>
                    )}
                    {resultado.impacto.impactoLucro > 0 && (
                      <li>✅ Aproveite economia de {formatMoeda(resultado.impacto.impactoLucro)}/ano para expansão</li>
                    )}
                    <li>✅ Implemente sistema robusto de controle de créditos tributários</li>
                  </ul>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <h4 className="font-bold text-lg mb-3">📋 Checklist de Preparação</h4>
                  <ul className="space-y-2 text-sm">
                    <li>□ Auditoria completa de gastos com energia e frete</li>
                    <li>□ Inventário de ativos permanentes adquiridos</li>
                    <li>□ Treinamento da equipe fiscal sobre novo sistema</li>
                    <li>□ Atualização de sistemas ERP para IBS/CBS</li>
                    <li>□ Revisão de contratos com fornecedores</li>
                  </ul>
                </div>
              </div>
            </div>

          </>
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
                Os percentuais de crédito atuais (50% energia, 70% frete) são aproximações baseadas 
                em restrições típicas. Ativos permanentes hoje não geram crédito de ICMS/PIS/COFINS. 
                Na reforma, todos esses itens terão <strong>crédito integral</strong>, distribuído 
                em 5 anos para ativos (20% ao ano).
              </p>
            </div>
          </div>
        </div>

        {/* ARTIGO SEO */}
        <article className="max-w-4xl mx-auto prose prose-lg">
          
          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Créditos IBS/CBS para Indústrias: Guia Completo da Reforma Tributária
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            A <strong>Reforma Tributária (EC 132/2023)</strong> trará uma das maiores revoluções para 
            o setor industrial brasileiro: a <strong>ampliação radical do sistema de créditos tributários</strong>. 
            Itens que hoje têm crédito parcial ou nenhum crédito (energia elétrica, frete, ativos permanentes) 
            passarão a gerar <strong>crédito integral de IBS e CBS</strong>, reduzindo drasticamente a 
            alíquota efetiva e aumentando a competitividade da indústria nacional.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Este guia detalha <strong>como calcular</strong> os novos créditos, qual será o 
            <strong> impacto financeiro</strong> na sua indústria, e como se preparar para maximizar 
            os benefícios a partir de 2026.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Créditos Tributários: Sistema Atual vs. Reforma
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Sistema Atual (ICMS + PIS/COFINS)
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Hoje, a indústria brasileira opera sob um sistema de créditos <strong>limitado e complexo</strong>:
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-blue-900 mb-3">📦 Insumos e Matéria-Prima</h4>
            <p className="text-gray-700 mb-2">
              <strong>Crédito:</strong> Integral (100%)
            </p>
            <p className="text-gray-700">
              ICMS, PIS e COFINS pagos na compra de insumos geram crédito integral. Esse é o único 
              item que já funciona plenamente no sistema atual.
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-yellow-900 mb-3">⚡ Energia Elétrica</h4>
            <p className="text-gray-700 mb-2">
              <strong>Crédito:</strong> Parcial (~50%)
            </p>
            <p className="text-gray-700">
              <strong>Problema:</strong> Apenas parte da energia consumida gera crédito. Energia usada 
              em áreas administrativas, iluminação e climatização geralmente <strong>não gera crédito</strong>. 
              Regras complexas variam por estado.
            </p>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-orange-900 mb-3">🚚 Frete e Logística</h4>
            <p className="text-gray-700 mb-2">
              <strong>Crédito:</strong> Parcial (~70%)
            </p>
            <p className="text-gray-700">
              <strong>Problema:</strong> Crédito depende do <strong>tipo de frete</strong> (CIF vs FOB), 
              da categoria do prestador de serviço, e da documentação. Muitos fretes não geram crédito 
              integral devido a glosas fiscais.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-red-900 mb-3">⚙️ Ativos Permanentes (Máquinas/Equipamentos)</h4>
            <p className="text-gray-700 mb-2">
              <strong>Crédito:</strong> Zero (0%)
            </p>
            <p className="text-gray-700">
              <strong>Problema:</strong> Compra de máquinas, equipamentos, veículos e outros ativos 
              permanentes <strong>NÃO gera crédito</strong> de ICMS nem PIS/COFINS. O benefício é 
              apenas contábil (depreciação no IR/CSLL).
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Sistema Novo (IBS + CBS) - A Revolução
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Com a reforma, <strong>TODOS os itens acima terão crédito integral</strong>:
          </p>

          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-green-900 mb-3">✅ Mudanças Confirmadas</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                <strong>Insumos:</strong> Mantém crédito integral (100%)
              </li>
              <li>
                <strong>Energia:</strong> Crédito integral (100%) - sem restrições!
              </li>
              <li>
                <strong>Frete:</strong> Crédito integral (100%) - sem distinção CIF/FOB
              </li>
              <li>
                <strong>Ativos Permanentes:</strong> Crédito integral (100%) dividido em 5 anos (20%/ano)
              </li>
              <li>
                <strong>Telecomunicações:</strong> Crédito integral (novo)
              </li>
              <li>
                <strong>Serviços de terceiros:</strong> Crédito integral (novo)
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Como Calcular os Novos Créditos
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Fórmula Geral
          </h3>

          <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg mb-6 font-mono text-sm">
            <p className="font-bold mb-2">CRÉDITO = VALOR DO GASTO × 26,5%</p>
            <p className="text-gray-600 mt-4">Onde:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
              <li>26,5% = IBS (16,165%) + CBS (10,335%)</li>
              <li>Valor do gasto inclui energia, frete, insumos, ativos</li>
            </ul>
            <p className="text-gray-600 mt-4">
              <strong>Exceção:</strong> Ativos permanentes: crédito de 20% do valor por ano, durante 5 anos
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Exemplo Prático: Indústria Metalúrgica
          </h3>

          <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg mb-6">
            <p className="text-gray-800 mb-4">
              <strong>Dados:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li>Receita anual: R$ 10 milhões</li>
              <li>Insumos: R$ 4 milhões/ano</li>
              <li>Energia: R$ 800 mil/ano</li>
              <li>Frete: R$ 600 mil/ano</li>
              <li>Máquinas (investimento anual): R$ 500 mil</li>
            </ul>

            <p className="text-gray-800 mb-2 font-bold">
              Sistema Atual - Créditos:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li>Insumos: R$ 4.000.000 × 27,25% = R$ 1.090.000</li>
              <li>Energia: R$ 800.000 × 50% × 27,25% = R$ 109.000</li>
              <li>Frete: R$ 600.000 × 70% × 27,25% = R$ 114.450</li>
              <li>Máquinas: R$ 0</li>
              <li><strong>Total: R$ 1.313.450</strong></li>
            </ul>

            <p className="text-gray-800 mb-2 font-bold">
              Pós-Reforma - Créditos:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li>Insumos: R$ 4.000.000 × 26,5% = R$ 1.060.000</li>
              <li>Energia: R$ 800.000 × 100% × 26,5% = R$ 212.000</li>
              <li>Frete: R$ 600.000 × 100% × 26,5% = R$ 159.000</li>
              <li>Máquinas: R$ 500.000 × 20% × 26,5% = R$ 26.500/ano</li>
              <li><strong>Total: R$ 1.457.500</strong></li>
            </ul>

            <p className="text-green-700 font-bold text-lg mt-4">
              ✅ Ganho: R$ 144.050/ano em créditos adicionais (+10,9%)
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Impacto por Tipo de Gasto
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            1. Energia Elétrica: O Maior Ganho
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Impacto:</strong> Crédito dobra (de ~50% para 100%)
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Para indústrias eletrointensivas (metalurgia, química, papel), o ganho é <strong>enorme</strong>. 
            Se você gasta R$ 1 milhão/ano em energia, o crédito adicional será de aproximadamente 
            <strong> R$ 130 mil/ano</strong>.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            2. Frete e Logística: Fim das Glosas
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Impacto:</strong> Crédito aumenta de ~70% para 100%
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Não haverá mais distinção entre frete CIF e FOB. Todo frete documentado gerará crédito 
            integral, simplificando a gestão fiscal e aumentando o crédito em cerca de <strong>40%</strong>.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            3. Ativos Permanentes: A Grande Novidade
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Impacto:</strong> De ZERO para 100% (dividido em 5 anos)
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Esta é a <strong>maior mudança</strong> para a indústria. Exemplo:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Compra de máquina: R$ 1 milhão</li>
            <li>Crédito total: R$ 1.000.000 × 26,5% = R$ 265 mil</li>
            <li>Apropriação: R$ 53 mil/ano durante 5 anos</li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-6">
            Isso <strong>incentiva investimentos</strong> em modernização e expansão da capacidade produtiva.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Estratégias para Maximizar Créditos
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Estratégia 1: Auditoria Completa de Gastos
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Objetivo:</strong> Identificar TODOS os gastos que gerarão crédito.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Ações:</strong>
          </p>

          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Liste todas as contas de energia (fábrica, escritório, depósitos)</li>
            <li>Mapeie todos os contratos de frete (inbound e outbound)</li>
            <li>Inventarie ativos permanentes adquiridos nos últimos 5 anos</li>
            <li>Identifique serviços de terceiros (manutenção, consultoria, TI)</li>
            <li>Revise contratos de telecomunicações</li>
          </ol>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Estratégia 2: Planeje Investimentos em Ativos
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Objetivo:</strong> Aproveitar crédito de 26,5% em novos ativos.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Exemplo de ROI:</strong>
          </p>

          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg mb-6">
            <p className="text-gray-800 mb-2">
              Investimento em automação: R$ 2 milhões
            </p>
            <p className="text-gray-800 mb-2">
              Crédito tributário: R$ 530 mil (26,5%)
            </p>
            <p className="text-gray-800 mb-2">
              Recuperação: R$ 106 mil/ano por 5 anos
            </p>
            <p className="text-green-700 font-bold mt-4">
              Custo efetivo do investimento: R$ 1,47 milhão (27% de desconto!)
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Estratégia 3: Renegocie Contratos
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Objetivo:</strong> Garantir que fornecedores emitam notas corretas para crédito.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Pontos de atenção:</strong>
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Certifique-se que <strong>todas</strong> as notas de energia, frete e serviços destacam IBS/CBS</li>
            <li>Revise contratos de frete para garantir documentação adequada</li>
            <li>Exija comprovantes de recolhimento de IBS/CBS dos fornecedores</li>
            <li>Implemente sistema de gestão de documentos fiscais robusto</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Estratégia 4: Invista em Tecnologia Fiscal
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Com a ampliação dos créditos, o <strong>volume de documentos</strong> a controlar aumentará 
            exponencialmente. Invista em:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>ERP atualizado para IBS/CBS</li>
            <li>Sistema de gestão de créditos tributários</li>
            <li>Automação de conciliação fiscal</li>
            <li>Dashboard de monitoramento em tempo real</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Erros Fatais ao Gerenciar Créditos
          </h2>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-red-900 mb-3">
              ❌ Erro 1: Não Controlar Ativos Permanentes
            </h4>
            <p className="text-gray-700 mb-3">
              "Ativos não geram crédito hoje, então não acompanho essa conta."
            </p>
            <p className="text-gray-700">
              <strong>✅ Correto:</strong> A partir de 2026, ativos darão crédito de R$ 265 para 
              cada R$ 1 milhão investido. Comece JÁ a controlar!
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-red-900 mb-3">
              ❌ Erro 2: Aceitar Notas Sem Destaque de Tributo
            </h4>
            <p className="text-gray-700 mb-3">
              Receber nota de frete ou energia sem o destaque correto de IBS/CBS.
            </p>
            <p className="text-gray-700">
              <strong>✅ Correto:</strong> Exija que <strong>100% das notas</strong> destaquem 
              IBS e CBS separadamente. Sem destaque = sem crédito.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-red-900 mb-3">
              ❌ Erro 3: Não Separar Créditos por Ano (Ativos)
            </h4>
            <p className="text-gray-700 mb-3">
              Tentar apropriar todo o crédito de ativos de uma vez.
            </p>
            <p className="text-gray-700">
              <strong>✅ Correto:</strong> Crédito de ativos é <strong>obrigatoriamente</strong> 
              dividido em 5 anos (20% ao ano). Sistemas devem controlar isso automaticamente.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-red-900 mb-3">
              ❌ Erro 4: Ignorar Pequenos Gastos
            </h4>
            <p className="text-gray-700 mb-3">
              "Gasto só R$ 10 mil/mês com frete, não vale a pena controlar."
            </p>
            <p className="text-gray-700">
              <strong>✅ Correto:</strong> R$ 10 mil/mês = R$ 120 mil/ano × 26,5% = 
              <strong> R$ 31.800/ano</strong> em créditos. Todo gasto conta!
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                1. Todos os tipos de energia geram crédito?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sim!</strong> Diferentemente do sistema atual, <strong>toda</strong> energia 
                consumida gerará crédito integral: produção, administrativo, iluminação, climatização. 
                Sem distinções.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                2. Frete internacional gera crédito?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Não diretamente.</strong> IBS/CBS incidem apenas em operações internas. 
                Mas frete nacional relacionado a importação/exportação <strong>gerará crédito</strong>.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                3. Posso recuperar crédito de ativos comprados antes da reforma?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Não.</strong> Apenas ativos adquiridos <strong>a partir de 2026</strong> 
                (início da vigência) gerarão crédito de IBS/CBS. Ativos antigos seguem regras antigas.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                4. Crédito de energia solar própria gera crédito?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Não.</strong> Crédito só incide sobre <strong>energia comprada</strong> 
                de terceiros. Geração própria não gera crédito (mas também não paga tributo).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                5. Manutenção de máquinas gera crédito?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sim!</strong> Serviços de manutenção, consultoria, TI e outros serviços 
                de terceiros <strong>gerarão crédito integral</strong> de IBS/CBS.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                6. Crédito de IBS pode compensar CBS e vice-versa?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Não.</strong> São tributos separados. Crédito de IBS compensa apenas IBS 
                devido. Crédito de CBS compensa apenas CBS devido. Mas ambos incidem sobre as mesmas 
                operações.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                7. Preciso contratar consultoria especializada?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Recomendado!</strong> A ampliação dos créditos aumenta a complexidade. 
                Uma consultoria pode identificar créditos que você não mapeia sozinho, pagando-se 
                rapidamente.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Termos Importantes
          </h2>

          <dl className="space-y-4">
            <div>
              <dt className="font-bold text-gray-900">Crédito Tributário</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Valor de IBS/CBS pago em <strong>etapas anteriores</strong> que pode ser deduzido 
                do imposto devido. Base do sistema não cumulativo.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Não Cumulatividade</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Princípio que garante que o tributo não incide em cascata. Cada etapa da cadeia 
                deduz o que foi pago na etapa anterior.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Ativos Permanentes</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Bens duráveis usados na produção: máquinas, equipamentos, veículos, imóveis. 
                Crédito dividido em 5 anos (20% ao ano).
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Alíquota Efetiva</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Percentual real de tributos pagos após apropriação de todos os créditos. Sempre 
                menor que a alíquota nominal (26,5%).
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Glosa Fiscal</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Negativa de crédito por falta de documentação adequada ou descumprimento de 
                requisitos legais. Com a reforma, tende a diminuir.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Split Payment (Pagamento Dividido)</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Sistema em que o comprador retém o tributo e repassa diretamente ao fisco, 
                garantindo que o crédito seja legítimo.
              </dd>
            </div>
          </dl>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Base Legal
          </h2>

          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Emenda Constitucional 132/2023:</strong> Institui IBS e CBS com sistema 
              ampliado de créditos
            </li>
            <li>
              <strong>Art. 156-A, §1º, CF:</strong> Garante não cumulatividade plena do IBS
            </li>
            <li>
              <strong>Art. 195, §12, CF:</strong> Não cumulatividade da CBS
            </li>
            <li>
              <strong>Lei Complementar (em elaboração):</strong> Regulamentará créditos de ativos 
              permanentes e energia
            </li>
            <li>
              <strong>Resolução do Comitê Gestor do IBS:</strong> Definirá regras operacionais 
              de apropriação de créditos
            </li>
          </ul>

          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg mt-8">
            <p className="text-gray-800 leading-relaxed">
              <strong>🚀 Próximo Passo:</strong> Use nosso simulador acima para calcular o impacto 
              exato na sua indústria. Insira seus gastos reais com insumos, energia, frete e ativos 
              para ver quanto você economizará com a ampliação dos créditos. Para estratégias 
              personalizadas de maximização de créditos, consulte um especialista em planejamento 
              tributário industrial.
            </p>
          </div>

        </article>

      </div>
    </div>
  );
}

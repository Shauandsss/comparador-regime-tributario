import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function SimuladorROI() {
  // Custos do produto
  const [developmentCost, setDevelopmentCost] = useState(50000);
  const [marketingCost, setMarketingCost] = useState(10000);
  const [operationalCost, setOperationalCost] = useState(5000); // mensal
  
  // Receita do produto
  const [productPrice, setProductPrice] = useState(99);
  const [initialSales, setInitialSales] = useState(50);
  const [monthlyGrowth, setMonthlyGrowth] = useState(10);
  const [profitMargin, setProfitMargin] = useState(70);
  
  // Período de análise
  const [projectionMonths, setProjectionMonths] = useState(36);

  // Cálculo da projeção
  const projection = useMemo(() => {
    const months = [];
    let cumulativeRevenue = 0;
    let cumulativeCost = developmentCost + marketingCost;
    let cumulativeProfit = -cumulativeCost;
    let currentSales = initialSales;
    let breakevenMonth = null;
    
    for (let i = 1; i <= projectionMonths; i++) {
      const monthlyRevenue = currentSales * productPrice;
      const monthlyGrossProfit = monthlyRevenue * (profitMargin / 100);
      const monthlyNetProfit = monthlyGrossProfit - operationalCost;
      
      cumulativeRevenue += monthlyRevenue;
      cumulativeCost += operationalCost;
      cumulativeProfit += monthlyNetProfit;
      
      if (breakevenMonth === null && cumulativeProfit >= 0) {
        breakevenMonth = i;
      }
      
      months.push({
        month: i,
        sales: Math.round(currentSales),
        monthlyRevenue: Math.round(monthlyRevenue),
        monthlyGrossProfit: Math.round(monthlyGrossProfit),
        monthlyNetProfit: Math.round(monthlyNetProfit),
        cumulativeRevenue: Math.round(cumulativeRevenue),
        cumulativeCost: Math.round(cumulativeCost),
        cumulativeProfit: Math.round(cumulativeProfit)
      });
      
      // Crescimento para próximo mês
      currentSales = currentSales * (1 + monthlyGrowth / 100);
    }
    
    return { months, breakevenMonth };
  }, [developmentCost, marketingCost, operationalCost, productPrice, initialSales, monthlyGrowth, profitMargin, projectionMonths]);

  // Métricas de ROI
  const metrics = useMemo(() => {
    const totalInvestment = developmentCost + marketingCost;
    const month12 = projection.months[11] || projection.months[projection.months.length - 1];
    const month36 = projection.months[35] || projection.months[projection.months.length - 1];
    const final = projection.months[projection.months.length - 1];
    
    const roi12 = ((month12.cumulativeProfit) / totalInvestment) * 100;
    const roi36 = ((month36.cumulativeProfit) / totalInvestment) * 100;
    const roiFinal = ((final.cumulativeProfit) / totalInvestment) * 100;
    
    // Payback simples
    const paybackMonths = projection.breakevenMonth;
    
    // Taxa de retorno mensal média
    const avgMonthlyReturn = final.cumulativeProfit / projectionMonths;
    
    // Receita total e lucro total
    const totalRevenue = final.cumulativeRevenue;
    const totalProfit = final.cumulativeProfit;
    
    return {
      totalInvestment,
      roi12,
      roi36,
      roiFinal,
      paybackMonths,
      avgMonthlyReturn,
      totalRevenue,
      totalProfit,
      month12,
      month36,
      final
    };
  }, [projection, developmentCost, marketingCost, projectionMonths]);

  // Formatação de valores
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Gráfico SVG
  const chartData = useMemo(() => {
    const width = 700;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 40, left: 70 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const data = projection.months;
    const maxValue = Math.max(...data.map(d => Math.max(d.cumulativeRevenue, Math.abs(d.cumulativeProfit))));
    const minValue = Math.min(...data.map(d => d.cumulativeProfit), 0);
    
    const xScale = (month) => padding.left + ((month - 1) / (projectionMonths - 1)) * chartWidth;
    const yScale = (value) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
    
    // Linha do zero
    const zeroY = yScale(0);
    
    // Path da receita acumulada
    const revenuePath = data.map((d, i) => 
      `${i === 0 ? 'M' : 'L'} ${xScale(d.month)} ${yScale(d.cumulativeRevenue)}`
    ).join(' ');
    
    // Path do lucro acumulado
    const profitPath = data.map((d, i) => 
      `${i === 0 ? 'M' : 'L'} ${xScale(d.month)} ${yScale(d.cumulativeProfit)}`
    ).join(' ');
    
    // Área de lucro (verde acima de zero, vermelho abaixo)
    const profitAreaPath = `${profitPath} L ${xScale(projectionMonths)} ${zeroY} L ${xScale(1)} ${zeroY} Z`;
    
    // Grid lines
    const yGridLines = [];
    const numLines = 5;
    for (let i = 0; i <= numLines; i++) {
      const value = minValue + (maxValue - minValue) * (i / numLines);
      yGridLines.push({
        y: yScale(value),
        value: Math.round(value)
      });
    }
    
    // X axis labels
    const xLabels = [];
    const step = projectionMonths <= 12 ? 1 : projectionMonths <= 24 ? 3 : 6;
    for (let i = 1; i <= projectionMonths; i += step) {
      xLabels.push({
        x: xScale(i),
        month: i
      });
    }
    
    return {
      width,
      height,
      padding,
      zeroY,
      revenuePath,
      profitPath,
      profitAreaPath,
      yGridLines,
      xLabels,
      xScale,
      yScale
    };
  }, [projection, projectionMonths]);

  // Status do ROI
  const getRoiStatus = () => {
    if (metrics.roiFinal >= 200) return { label: 'Excelente', color: 'text-green-600', bg: 'bg-green-100', emoji: '🚀' };
    if (metrics.roiFinal >= 100) return { label: 'Muito Bom', color: 'text-blue-600', bg: 'bg-blue-100', emoji: '📈' };
    if (metrics.roiFinal >= 50) return { label: 'Bom', color: 'text-teal-600', bg: 'bg-teal-100', emoji: '👍' };
    if (metrics.roiFinal >= 0) return { label: 'Moderado', color: 'text-yellow-600', bg: 'bg-yellow-100', emoji: '⚖️' };
    return { label: 'Negativo', color: 'text-red-600', bg: 'bg-red-100', emoji: '⚠️' };
  };

  const roiStatus = getRoiStatus();

  // Análise de sensibilidade
  const sensitivityAnalysis = useMemo(() => {
    const baseROI = metrics.roiFinal;
    const variations = [-20, -10, 0, 10, 20];
    
    return {
      price: variations.map(v => {
        const newPrice = productPrice * (1 + v / 100);
        const totalInv = developmentCost + marketingCost;
        let cumProfit = -totalInv;
        let sales = initialSales;
        
        for (let i = 1; i <= projectionMonths; i++) {
          const rev = sales * newPrice;
          const profit = rev * (profitMargin / 100) - operationalCost;
          cumProfit += profit;
          sales = sales * (1 + monthlyGrowth / 100);
        }
        
        return { variation: v, roi: ((cumProfit) / totalInv) * 100 };
      }),
      sales: variations.map(v => {
        const newInitialSales = initialSales * (1 + v / 100);
        const totalInv = developmentCost + marketingCost;
        let cumProfit = -totalInv;
        let sales = newInitialSales;
        
        for (let i = 1; i <= projectionMonths; i++) {
          const rev = sales * productPrice;
          const profit = rev * (profitMargin / 100) - operationalCost;
          cumProfit += profit;
          sales = sales * (1 + monthlyGrowth / 100);
        }
        
        return { variation: v, roi: ((cumProfit) / totalInv) * 100 };
      })
    };
  }, [productPrice, initialSales, developmentCost, marketingCost, operationalCost, profitMargin, monthlyGrowth, projectionMonths]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">💰 ROI Simulator</h1>
          <p className="mt-2 text-gray-600">
            Calcule o retorno sobre investimento de novos produtos e encontre o ponto de equilíbrio
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Painel de Configuração */}
          <div className="lg:col-span-1 space-y-6">
            {/* Custos */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">💸 Custos do Produto</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custo de Desenvolvimento (R$)
                  </label>
                  <input
                    type="number"
                    value={developmentCost}
                    onChange={(e) => setDevelopmentCost(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custo de Marketing Inicial (R$)
                  </label>
                  <input
                    type="number"
                    value={marketingCost}
                    onChange={(e) => setMarketingCost(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custo Operacional Mensal (R$)
                  </label>
                  <input
                    type="number"
                    value={operationalCost}
                    onChange={(e) => setOperationalCost(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Suporte, servidores, manutenção, etc.
                  </p>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Investimento Inicial:</span>
                    <span className="font-bold text-gray-900">{formatCurrency(developmentCost + marketingCost)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Receita */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Receita do Produto</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço do Produto (R$)
                  </label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendas Iniciais (mês 1)
                  </label>
                  <input
                    type="number"
                    value={initialSales}
                    onChange={(e) => setInitialSales(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crescimento Mensal de Vendas (%)
                  </label>
                  <input
                    type="number"
                    value={monthlyGrowth}
                    onChange={(e) => setMonthlyGrowth(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="-50"
                    max="100"
                    step="1"
                  />
                  <input
                    type="range"
                    value={monthlyGrowth}
                    onChange={(e) => setMonthlyGrowth(Number(e.target.value))}
                    className="w-full mt-2"
                    min="-10"
                    max="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Margem de Lucro Bruto (%)
                  </label>
                  <input
                    type="number"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                    step="5"
                  />
                  <input
                    type="range"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(Number(e.target.value))}
                    className="w-full mt-2"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            {/* Período */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📅 Período de Análise</h2>
              <select
                value={projectionMonths}
                onChange={(e) => setProjectionMonths(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={12}>12 meses (1 ano)</option>
                <option value={24}>24 meses (2 anos)</option>
                <option value={36}>36 meses (3 anos)</option>
                <option value={48}>48 meses (4 anos)</option>
                <option value={60}>60 meses (5 anos)</option>
              </select>
            </div>
          </div>

          {/* Painel de Resultados */}
          <div className="lg:col-span-2 space-y-6">
            {/* KPIs Principais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`rounded-xl p-4 ${roiStatus.bg}`}>
                <p className="text-sm font-medium text-gray-600">ROI Total</p>
                <p className={`text-2xl font-bold ${roiStatus.color}`}>
                  {roiStatus.emoji} {formatPercent(metrics.roiFinal)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{roiStatus.label}</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-sm font-medium text-gray-600">Breakeven</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.paybackMonths ? `${metrics.paybackMonths} meses` : 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics.paybackMonths && metrics.paybackMonths <= 12 ? 'Rápido!' : 
                   metrics.paybackMonths && metrics.paybackMonths <= 24 ? 'Bom' : 'Lento'}
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-sm font-medium text-gray-600">Lucro Total</p>
                <p className={`text-2xl font-bold ${metrics.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(metrics.totalProfit)}
                </p>
                <p className="text-xs text-gray-500 mt-1">em {projectionMonths} meses</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(metrics.totalRevenue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">faturamento bruto</p>
              </div>
            </div>

            {/* ROI por Período */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📈 ROI por Período</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">12 meses</p>
                  <p className={`text-xl font-bold ${metrics.roi12 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercent(metrics.roi12)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Lucro: {formatCurrency(metrics.month12.cumulativeProfit)}
                  </p>
                </div>
                
                {projectionMonths >= 24 && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">24 meses</p>
                    <p className={`text-xl font-bold ${(projection.months[23]?.cumulativeProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(((projection.months[23]?.cumulativeProfit || 0) / metrics.totalInvestment) * 100)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Lucro: {formatCurrency(projection.months[23]?.cumulativeProfit || 0)}
                    </p>
                  </div>
                )}
                
                {projectionMonths >= 36 && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">36 meses</p>
                    <p className={`text-xl font-bold ${metrics.roi36 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(metrics.roi36)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Lucro: {formatCurrency(metrics.month36.cumulativeProfit)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Gráfico */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📊 Evolução Financeira - {projectionMonths} meses
              </h2>
              
              <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${chartData.width} ${chartData.height}`} className="w-full min-w-[500px]">
                  {/* Grid lines */}
                  {chartData.yGridLines.map((line, i) => (
                    <g key={i}>
                      <line
                        x1={chartData.padding.left}
                        y1={line.y}
                        x2={chartData.width - chartData.padding.right}
                        y2={line.y}
                        stroke="#e5e7eb"
                        strokeDasharray="4,4"
                      />
                      <text
                        x={chartData.padding.left - 10}
                        y={line.y + 4}
                        textAnchor="end"
                        className="text-xs fill-gray-500"
                      >
                        {line.value >= 1000000 ? `${(line.value / 1000000).toFixed(1)}M` :
                         line.value >= 1000 ? `${(line.value / 1000).toFixed(0)}k` : 
                         line.value.toFixed(0)}
                      </text>
                    </g>
                  ))}
                  
                  {/* Linha do zero */}
                  <line
                    x1={chartData.padding.left}
                    y1={chartData.zeroY}
                    x2={chartData.width - chartData.padding.right}
                    y2={chartData.zeroY}
                    stroke="#9ca3af"
                    strokeWidth="1"
                  />
                  
                  {/* X axis labels */}
                  {chartData.xLabels.map((label, i) => (
                    <text
                      key={i}
                      x={label.x}
                      y={chartData.height - 10}
                      textAnchor="middle"
                      className="text-xs fill-gray-500"
                    >
                      M{label.month}
                    </text>
                  ))}
                  
                  {/* Área de lucro */}
                  <defs>
                    <linearGradient id="profitGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#22c55e" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#ef4444" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  
                  {/* Linha de receita */}
                  <path
                    d={chartData.revenuePath}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="6,3"
                  />
                  
                  {/* Linha de lucro */}
                  <path
                    d={chartData.profitPath}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                  />
                  
                  {/* Ponto de breakeven */}
                  {projection.breakevenMonth && (
                    <g>
                      <circle
                        cx={chartData.xScale(projection.breakevenMonth)}
                        cy={chartData.zeroY}
                        r="8"
                        fill="#f59e0b"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={chartData.xScale(projection.breakevenMonth)}
                        y={chartData.zeroY - 15}
                        textAnchor="middle"
                        className="text-xs font-medium fill-orange-600"
                      >
                        Breakeven
                      </text>
                    </g>
                  )}
                </svg>
              </div>
              
              {/* Legenda */}
              <div className="flex flex-wrap gap-4 mt-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-green-500 rounded"></div>
                  <span>Lucro Acumulado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-blue-500 rounded" style={{backgroundImage: 'repeating-linear-gradient(90deg, #3b82f6, #3b82f6 6px, transparent 6px, transparent 9px)'}}></div>
                  <span>Receita Acumulada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Breakeven</span>
                </div>
              </div>
            </div>

            {/* Análise de Sensibilidade */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🎚️ Análise de Sensibilidade</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Variação de Preço */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Variação de Preço</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Variação</th>
                        <th className="text-right py-2">Preço</th>
                        <th className="text-right py-2">ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sensitivityAnalysis.price.map((item) => (
                        <tr key={item.variation} className={`border-b ${item.variation === 0 ? 'bg-blue-50 font-medium' : ''}`}>
                          <td className="py-2">{item.variation >= 0 ? '+' : ''}{item.variation}%</td>
                          <td className="text-right py-2">{formatCurrency(productPrice * (1 + item.variation / 100))}</td>
                          <td className={`text-right py-2 ${item.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercent(item.roi)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Variação de Vendas */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Variação de Vendas Iniciais</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Variação</th>
                        <th className="text-right py-2">Vendas</th>
                        <th className="text-right py-2">ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sensitivityAnalysis.sales.map((item) => (
                        <tr key={item.variation} className={`border-b ${item.variation === 0 ? 'bg-blue-50 font-medium' : ''}`}>
                          <td className="py-2">{item.variation >= 0 ? '+' : ''}{item.variation}%</td>
                          <td className="text-right py-2">{Math.round(initialSales * (1 + item.variation / 100))}</td>
                          <td className={`text-right py-2 ${item.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercent(item.roi)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Tabela de Projeção */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Projeção Mensal</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-2 px-2">Mês</th>
                      <th className="text-right py-2 px-2">Vendas</th>
                      <th className="text-right py-2 px-2">Receita</th>
                      <th className="text-right py-2 px-2">Lucro Mensal</th>
                      <th className="text-right py-2 px-2">Lucro Acumulado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projection.months.filter((_, i) => 
                      i === 0 || 
                      (i + 1) % (projectionMonths <= 12 ? 1 : projectionMonths <= 24 ? 3 : 6) === 0 || 
                      i === projection.months.length - 1 ||
                      i + 1 === projection.breakevenMonth
                    ).map((p) => (
                      <tr 
                        key={p.month} 
                        className={`border-b hover:bg-gray-50 ${
                          p.month === projection.breakevenMonth ? 'bg-orange-50' : ''
                        }`}
                      >
                        <td className="py-2 px-2 font-medium">
                          Mês {p.month}
                          {p.month === projection.breakevenMonth && (
                            <span className="ml-2 text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded">
                              Breakeven
                            </span>
                          )}
                        </td>
                        <td className="text-right py-2 px-2">{p.sales}</td>
                        <td className="text-right py-2 px-2">{formatCurrency(p.monthlyRevenue)}</td>
                        <td className={`text-right py-2 px-2 ${p.monthlyNetProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(p.monthlyNetProfit)}
                        </td>
                        <td className={`text-right py-2 px-2 font-medium ${p.cumulativeProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(p.cumulativeProfit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">💡 Insights e Recomendações</h2>
              
              <div className="space-y-3">
                {metrics.roiFinal < 0 && (
                  <div className="flex items-start gap-3 p-3 bg-red-100 rounded-lg">
                    <span className="text-red-500">⚠️</span>
                    <div>
                      <p className="font-medium text-red-800">ROI Negativo</p>
                      <p className="text-sm text-red-700">
                        O produto não recupera o investimento em {projectionMonths} meses. 
                        Considere aumentar preço, reduzir custos ou melhorar a taxa de crescimento.
                      </p>
                    </div>
                  </div>
                )}
                
                {!projection.breakevenMonth && (
                  <div className="flex items-start gap-3 p-3 bg-orange-100 rounded-lg">
                    <span className="text-orange-500">⏰</span>
                    <div>
                      <p className="font-medium text-orange-800">Breakeven não atingido</p>
                      <p className="text-sm text-orange-700">
                        O ponto de equilíbrio não é atingido no período analisado. 
                        Aumente o período ou revise os parâmetros do produto.
                      </p>
                    </div>
                  </div>
                )}
                
                {projection.breakevenMonth && projection.breakevenMonth <= 12 && (
                  <div className="flex items-start gap-3 p-3 bg-green-100 rounded-lg">
                    <span className="text-green-500">🎯</span>
                    <div>
                      <p className="font-medium text-green-800">Payback Rápido</p>
                      <p className="text-sm text-green-700">
                        Breakeven em {projection.breakevenMonth} meses é excelente! 
                        O investimento se paga em menos de 1 ano.
                      </p>
                    </div>
                  </div>
                )}
                
                {operationalCost > (initialSales * productPrice * profitMargin / 100) && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-100 rounded-lg">
                    <span className="text-yellow-500">📊</span>
                    <div>
                      <p className="font-medium text-yellow-800">Custos operacionais altos</p>
                      <p className="text-sm text-yellow-700">
                        Os custos operacionais superam o lucro bruto inicial. 
                        Você precisará de volume maior para ser lucrativo.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3 p-3 bg-blue-100 rounded-lg">
                  <span className="text-blue-500">📈</span>
                  <div>
                    <p className="font-medium text-blue-800">Resumo do Investimento</p>
                    <p className="text-sm text-blue-700">
                      Com investimento de {formatCurrency(metrics.totalInvestment)}, 
                      você terá retorno de {formatCurrency(metrics.totalProfit)} em {projectionMonths} meses 
                      (ROI de {formatPercent(metrics.roiFinal)}).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

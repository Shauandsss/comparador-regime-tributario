import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function SimuladorCrescimento() {
  // Tipo de métrica (usuários ou MRR)
  const [metricType, setMetricType] = useState('users'); // 'users' ou 'mrr'
  
  // Parâmetros base
  const [baseValue, setBaseValue] = useState(1000);
  const [growthRate, setGrowthRate] = useState(10);
  const [churnRate, setChurnRate] = useState(3);
  const [projectionMonths, setProjectionMonths] = useState(24);
  
  // Cenários comparativos
  const [showScenarios, setShowScenarios] = useState(true);
  const [optimisticGrowth, setOptimisticGrowth] = useState(15);
  const [pessimisticGrowth, setPessimisticGrowth] = useState(5);

  // Cálculo da projeção
  const projection = useMemo(() => {
    const months = [];
    let currentBase = baseValue;
    let optimisticBase = baseValue;
    let pessimisticBase = baseValue;
    
    // Taxa líquida de crescimento
    const netGrowthRate = (growthRate - churnRate) / 100;
    const optimisticNetRate = (optimisticGrowth - churnRate) / 100;
    const pessimisticNetRate = (pessimisticGrowth - churnRate) / 100;
    
    for (let i = 0; i <= projectionMonths; i++) {
      const newUsers = i === 0 ? 0 : Math.round(months[i-1].base * (growthRate / 100));
      const churnedUsers = i === 0 ? 0 : Math.round(months[i-1].base * (churnRate / 100));
      
      months.push({
        month: i,
        base: Math.round(currentBase),
        optimistic: Math.round(optimisticBase),
        pessimistic: Math.round(pessimisticBase),
        newUsers,
        churnedUsers,
        netChange: newUsers - churnedUsers,
        growthPercent: i === 0 ? 0 : ((currentBase - baseValue) / baseValue * 100)
      });
      
      if (i < projectionMonths) {
        currentBase = currentBase * (1 + netGrowthRate);
        optimisticBase = optimisticBase * (1 + optimisticNetRate);
        pessimisticBase = pessimisticBase * (1 + pessimisticNetRate);
      }
    }
    
    return months;
  }, [baseValue, growthRate, churnRate, projectionMonths, optimisticGrowth, pessimisticGrowth]);

  // Métricas resumidas
  const summary = useMemo(() => {
    const month12 = projection[12] || projection[projection.length - 1];
    const month24 = projection[24] || projection[projection.length - 1];
    const month36 = projection[36] || projection[projection.length - 1];
    const final = projection[projection.length - 1];
    
    const netGrowthRate = growthRate - churnRate;
    const doublingTime = netGrowthRate > 0 ? Math.log(2) / Math.log(1 + netGrowthRate / 100) : Infinity;
    
    // CAGR (Compound Annual Growth Rate)
    const cagr = final.month > 0 
      ? (Math.pow(final.base / baseValue, 12 / final.month) - 1) * 100 
      : 0;
    
    return {
      month12,
      month24,
      month36,
      final,
      netGrowthRate,
      doublingTime: doublingTime === Infinity ? null : Math.ceil(doublingTime),
      cagr
    };
  }, [projection, growthRate, churnRate, baseValue]);

  // Formatação de valores
  const formatValue = (value) => {
    if (metricType === 'mrr') {
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const formatNumber = (num) => new Intl.NumberFormat('pt-BR').format(num);

  // Cálculo do SVG do gráfico
  const chartData = useMemo(() => {
    const width = 700;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Encontrar max value considerando cenário otimista
    const allValues = projection.flatMap(p => [p.base, p.optimistic, p.pessimistic]);
    const maxValue = Math.max(...allValues) * 1.1;
    const minValue = Math.min(...allValues) * 0.9;
    
    const xScale = (month) => padding.left + (month / projectionMonths) * chartWidth;
    const yScale = (value) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
    
    // Gerar paths
    const basePath = projection.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${xScale(p.month)} ${yScale(p.base)}`
    ).join(' ');
    
    const optimisticPath = projection.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${xScale(p.month)} ${yScale(p.optimistic)}`
    ).join(' ');
    
    const pessimisticPath = projection.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${xScale(p.month)} ${yScale(p.pessimistic)}`
    ).join(' ');
    
    // Área preenchida para cenário base
    const areaPath = `${basePath} L ${xScale(projectionMonths)} ${yScale(minValue)} L ${xScale(0)} ${yScale(minValue)} Z`;
    
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
    for (let i = 0; i <= projectionMonths; i += step) {
      xLabels.push({
        x: xScale(i),
        month: i
      });
    }
    
    // Pontos de destaque
    const highlights = [
      { month: 12, label: '1 ano' },
      { month: 24, label: '2 anos' },
      { month: 36, label: '3 anos' }
    ].filter(h => h.month <= projectionMonths);
    
    return {
      width,
      height,
      padding,
      basePath,
      optimisticPath,
      pessimisticPath,
      areaPath,
      yGridLines,
      xLabels,
      highlights,
      xScale,
      yScale
    };
  }, [projection, projectionMonths]);

  // Status do crescimento
  const getGrowthStatus = () => {
    const net = growthRate - churnRate;
    if (net >= 10) return { label: 'Excelente', color: 'text-green-600', bg: 'bg-green-100' };
    if (net >= 5) return { label: 'Bom', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (net > 0) return { label: 'Moderado', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (net === 0) return { label: 'Estagnado', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: 'Em declínio', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const growthStatus = getGrowthStatus();

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
          <h1 className="text-3xl font-bold text-gray-900">📊 Simulador de Crescimento</h1>
          <p className="mt-2 text-gray-600">
            Projete o crescimento de usuários ou MRR com base em taxa de crescimento e churn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Painel de Configuração */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tipo de Métrica */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Métrica</h2>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMetricType('users')}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    metricType === 'users'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  👥 Usuários
                </button>
                <button
                  onClick={() => setMetricType('mrr')}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    metricType === 'mrr'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  💰 MRR
                </button>
              </div>
            </div>

            {/* Parâmetros Base */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Parâmetros Base</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {metricType === 'users' ? 'Base Atual de Usuários' : 'MRR Atual (R$)'}
                  </label>
                  <input
                    type="number"
                    value={baseValue}
                    onChange={(e) => setBaseValue(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taxa de Crescimento Mensal (%)
                  </label>
                  <input
                    type="number"
                    value={growthRate}
                    onChange={(e) => setGrowthRate(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                    step="0.5"
                  />
                  <input
                    type="range"
                    value={growthRate}
                    onChange={(e) => setGrowthRate(Number(e.target.value))}
                    className="w-full mt-2"
                    min="0"
                    max="50"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taxa de Churn Mensal (%)
                  </label>
                  <input
                    type="number"
                    value={churnRate}
                    onChange={(e) => setChurnRate(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                    step="0.5"
                  />
                  <input
                    type="range"
                    value={churnRate}
                    onChange={(e) => setChurnRate(Number(e.target.value))}
                    className="w-full mt-2"
                    min="0"
                    max="20"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Período de Projeção (meses)
                  </label>
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
            </div>

            {/* Cenários Comparativos */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Cenários</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showScenarios}
                    onChange={(e) => setShowScenarios(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-600">Mostrar</span>
                </label>
              </div>
              
              {showScenarios && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">
                      📈 Cenário Otimista (%)
                    </label>
                    <input
                      type="number"
                      value={optimisticGrowth}
                      onChange={(e) => setOptimisticGrowth(Number(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      min="0"
                      max="100"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-1">
                      📉 Cenário Pessimista (%)
                    </label>
                    <input
                      type="number"
                      value={pessimisticGrowth}
                      onChange={(e) => setPessimisticGrowth(Number(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      min="0"
                      max="100"
                      step="0.5"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Painel de Resultados */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status e KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`rounded-xl p-4 ${growthStatus.bg}`}>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className={`text-xl font-bold ${growthStatus.color}`}>{growthStatus.label}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Taxa líquida: {(growthRate - churnRate).toFixed(1)}%
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-sm font-medium text-gray-600">Em 12 meses</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatValue(summary.month12.base)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +{summary.month12.growthPercent.toFixed(0)}%
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-sm font-medium text-gray-600">CAGR</p>
                <p className="text-xl font-bold text-blue-600">
                  {summary.cagr.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">ao ano</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-sm font-medium text-gray-600">Tempo p/ Dobrar</p>
                <p className="text-xl font-bold text-purple-600">
                  {summary.doublingTime ? `${summary.doublingTime} meses` : '∞'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {summary.doublingTime && summary.doublingTime <= 12 ? 'Rápido!' : 
                   summary.doublingTime && summary.doublingTime <= 24 ? 'Bom ritmo' : 'Lento'}
                </p>
              </div>
            </div>

            {/* Gráfico de Projeção */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Curva de Crescimento - {projectionMonths} meses
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
                        {metricType === 'mrr' ? `R$${(line.value / 1000).toFixed(0)}k` : formatNumber(line.value)}
                      </text>
                    </g>
                  ))}
                  
                  {/* X axis labels */}
                  {chartData.xLabels.map((label, i) => (
                    <text
                      key={i}
                      x={label.x}
                      y={chartData.height - 10}
                      textAnchor="middle"
                      className="text-xs fill-gray-500"
                    >
                      {label.month === 0 ? 'Hoje' : `M${label.month}`}
                    </text>
                  ))}
                  
                  {/* Área preenchida */}
                  <path
                    d={chartData.areaPath}
                    fill="url(#blueGradient)"
                    opacity="0.3"
                  />
                  
                  {/* Cenários */}
                  {showScenarios && (
                    <>
                      <path
                        d={chartData.optimisticPath}
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2"
                        strokeDasharray="6,3"
                      />
                      <path
                        d={chartData.pessimisticPath}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray="6,3"
                      />
                    </>
                  )}
                  
                  {/* Linha principal */}
                  <path
                    d={chartData.basePath}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                  />
                  
                  {/* Pontos de destaque */}
                  {chartData.highlights.map((h, i) => {
                    const point = projection[h.month];
                    if (!point) return null;
                    return (
                      <g key={i}>
                        <circle
                          cx={chartData.xScale(h.month)}
                          cy={chartData.yScale(point.base)}
                          r="6"
                          fill="#3b82f6"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <text
                          x={chartData.xScale(h.month)}
                          y={chartData.yScale(point.base) - 12}
                          textAnchor="middle"
                          className="text-xs font-medium fill-gray-700"
                        >
                          {h.label}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Gradiente */}
                  <defs>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              {/* Legenda */}
              <div className="flex flex-wrap gap-4 mt-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-blue-500 rounded"></div>
                  <span>Base ({growthRate}% growth)</span>
                </div>
                {showScenarios && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-1 bg-green-500 rounded" style={{backgroundImage: 'repeating-linear-gradient(90deg, #22c55e, #22c55e 6px, transparent 6px, transparent 9px)'}}></div>
                      <span>Otimista ({optimisticGrowth}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-1 bg-red-500 rounded" style={{backgroundImage: 'repeating-linear-gradient(90deg, #ef4444, #ef4444 6px, transparent 6px, transparent 9px)'}}></div>
                      <span>Pessimista ({pessimisticGrowth}%)</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Marcos de Crescimento */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📍 Marcos de Crescimento</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 12 meses */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">12 meses</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">1 ano</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatValue(summary.month12.base)}
                  </p>
                  <p className="text-sm text-green-600">
                    +{formatValue(summary.month12.base - baseValue)} ({summary.month12.growthPercent.toFixed(0)}%)
                  </p>
                  {showScenarios && (
                    <div className="mt-2 pt-2 border-t text-xs space-y-1">
                      <p className="text-green-600">Otimista: {formatValue(summary.month12.optimistic || projection[12]?.optimistic)}</p>
                      <p className="text-red-600">Pessimista: {formatValue(summary.month12.pessimistic || projection[12]?.pessimistic)}</p>
                    </div>
                  )}
                </div>

                {/* 24 meses */}
                {projectionMonths >= 24 && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">24 meses</span>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">2 anos</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatValue(summary.month24.base)}
                    </p>
                    <p className="text-sm text-green-600">
                      +{formatValue(summary.month24.base - baseValue)} ({summary.month24.growthPercent.toFixed(0)}%)
                    </p>
                    {showScenarios && (
                      <div className="mt-2 pt-2 border-t text-xs space-y-1">
                        <p className="text-green-600">Otimista: {formatValue(projection[24]?.optimistic)}</p>
                        <p className="text-red-600">Pessimista: {formatValue(projection[24]?.pessimistic)}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 36 meses */}
                {projectionMonths >= 36 && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">36 meses</span>
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">3 anos</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatValue(summary.month36.base)}
                    </p>
                    <p className="text-sm text-green-600">
                      +{formatValue(summary.month36.base - baseValue)} ({summary.month36.growthPercent.toFixed(0)}%)
                    </p>
                    {showScenarios && (
                      <div className="mt-2 pt-2 border-t text-xs space-y-1">
                        <p className="text-green-600">Otimista: {formatValue(projection[36]?.optimistic)}</p>
                        <p className="text-red-600">Pessimista: {formatValue(projection[36]?.pessimistic)}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tabela de Projeção Detalhada */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Projeção Mensal Detalhada</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Mês</th>
                      <th className="text-right py-2 px-2">Base</th>
                      <th className="text-right py-2 px-2">Novos</th>
                      <th className="text-right py-2 px-2">Churn</th>
                      <th className="text-right py-2 px-2">Líquido</th>
                      <th className="text-right py-2 px-2">Crescimento</th>
                      {showScenarios && (
                        <>
                          <th className="text-right py-2 px-2 text-green-600">Otimista</th>
                          <th className="text-right py-2 px-2 text-red-600">Pessimista</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {projection.filter((_, i) => i % (projectionMonths <= 12 ? 1 : projectionMonths <= 24 ? 2 : 3) === 0 || i === projection.length - 1).map((p) => (
                      <tr key={p.month} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2 font-medium">
                          {p.month === 0 ? 'Atual' : `Mês ${p.month}`}
                        </td>
                        <td className="text-right py-2 px-2">{formatValue(p.base)}</td>
                        <td className="text-right py-2 px-2 text-green-600">+{formatNumber(p.newUsers)}</td>
                        <td className="text-right py-2 px-2 text-red-600">-{formatNumber(p.churnedUsers)}</td>
                        <td className="text-right py-2 px-2">
                          <span className={p.netChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {p.netChange >= 0 ? '+' : ''}{formatNumber(p.netChange)}
                          </span>
                        </td>
                        <td className="text-right py-2 px-2">
                          <span className={p.growthPercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {p.growthPercent >= 0 ? '+' : ''}{p.growthPercent.toFixed(1)}%
                          </span>
                        </td>
                        {showScenarios && (
                          <>
                            <td className="text-right py-2 px-2 text-green-600">{formatValue(p.optimistic)}</td>
                            <td className="text-right py-2 px-2 text-red-600">{formatValue(p.pessimistic)}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insights e Recomendações */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">💡 Insights</h2>
              
              <div className="space-y-3">
                {growthRate <= churnRate && (
                  <div className="flex items-start gap-3 p-3 bg-red-100 rounded-lg">
                    <span className="text-red-500">⚠️</span>
                    <div>
                      <p className="font-medium text-red-800">Churn maior que crescimento</p>
                      <p className="text-sm text-red-700">
                        Sua taxa de churn ({churnRate}%) está maior ou igual ao crescimento ({growthRate}%). 
                        Foque em retenção antes de investir em aquisição.
                      </p>
                    </div>
                  </div>
                )}
                
                {growthRate - churnRate > 0 && growthRate - churnRate < 5 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-100 rounded-lg">
                    <span className="text-yellow-500">💡</span>
                    <div>
                      <p className="font-medium text-yellow-800">Crescimento lento</p>
                      <p className="text-sm text-yellow-700">
                        Taxa líquida de {(growthRate - churnRate).toFixed(1)}% é baixa. 
                        Considere aumentar investimento em marketing ou melhorar conversão.
                      </p>
                    </div>
                  </div>
                )}
                
                {summary.doublingTime && summary.doublingTime <= 12 && (
                  <div className="flex items-start gap-3 p-3 bg-green-100 rounded-lg">
                    <span className="text-green-500">🚀</span>
                    <div>
                      <p className="font-medium text-green-800">Crescimento exponencial</p>
                      <p className="text-sm text-green-700">
                        Você está dobrando a cada {summary.doublingTime} meses! 
                        Prepare-se para escalar infraestrutura e equipe.
                      </p>
                    </div>
                  </div>
                )}
                
                {churnRate > 5 && (
                  <div className="flex items-start gap-3 p-3 bg-orange-100 rounded-lg">
                    <span className="text-orange-500">🔄</span>
                    <div>
                      <p className="font-medium text-orange-800">Churn elevado</p>
                      <p className="text-sm text-orange-700">
                        Churn de {churnRate}% é alto para SaaS (benchmark: 3-5%). 
                        Reduzir 1% pode aumentar LTV em até 20%.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3 p-3 bg-blue-100 rounded-lg">
                  <span className="text-blue-500">📊</span>
                  <div>
                    <p className="font-medium text-blue-800">Projeção ao final do período</p>
                    <p className="text-sm text-blue-700">
                      Em {projectionMonths} meses você terá {formatValue(summary.final.base)} ({metricType === 'users' ? 'usuários' : 'de MRR'}), 
                      um crescimento de {summary.final.growthPercent.toFixed(0)}% em relação a hoje.
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

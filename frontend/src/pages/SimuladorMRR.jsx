import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function SimuladorMRR() {
  // Planos de assinatura
  const [plans, setPlans] = useState([
    { id: 1, name: 'Starter', price: 49, subscribers: 100, churn: 5, growth: 8 },
    { id: 2, name: 'Pro', price: 99, subscribers: 50, churn: 3, growth: 12 },
    { id: 3, name: 'Enterprise', price: 299, subscribers: 10, churn: 2, growth: 15 }
  ]);
  
  // Configurações gerais
  const [projectionMonths, setProjectionMonths] = useState(24);
  const [priceIncrease, setPriceIncrease] = useState(0);
  const [priceIncreaseMonth, setPriceIncreaseMonth] = useState(12);
  
  // Gerenciamento de planos
  const addPlan = () => {
    const newId = Math.max(...plans.map(p => p.id), 0) + 1;
    setPlans([...plans, {
      id: newId,
      name: `Plano ${newId}`,
      price: 79,
      subscribers: 25,
      churn: 4,
      growth: 10
    }]);
  };

  const removePlan = (id) => {
    if (plans.length > 1) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  const updatePlan = (id, field, value) => {
    setPlans(plans.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  // Cálculo da projeção
  const projection = useMemo(() => {
    const months = [];
    
    // Estado inicial de cada plano
    let planStates = plans.map(plan => ({
      ...plan,
      currentSubscribers: plan.subscribers,
      currentPrice: plan.price
    }));
    
    for (let i = 0; i <= projectionMonths; i++) {
      // Aplicar aumento de preço se configurado
      if (i === priceIncreaseMonth && priceIncrease > 0) {
        planStates = planStates.map(ps => ({
          ...ps,
          currentPrice: ps.currentPrice * (1 + priceIncrease / 100)
        }));
      }
      
      const planDetails = planStates.map(ps => {
        const mrr = ps.currentSubscribers * ps.currentPrice;
        return {
          id: ps.id,
          name: ps.name,
          subscribers: Math.round(ps.currentSubscribers),
          price: ps.currentPrice,
          mrr: Math.round(mrr)
        };
      });
      
      const totalMRR = planDetails.reduce((sum, p) => sum + p.mrr, 0);
      const totalSubscribers = planDetails.reduce((sum, p) => sum + p.subscribers, 0);
      const arr = totalMRR * 12;
      
      months.push({
        month: i,
        plans: planDetails,
        totalMRR,
        totalSubscribers,
        arr
      });
      
      // Atualizar para próximo mês (crescimento líquido)
      if (i < projectionMonths) {
        planStates = planStates.map(ps => {
          const plan = plans.find(p => p.id === ps.id);
          const netGrowthRate = (plan.growth - plan.churn) / 100;
          return {
            ...ps,
            currentSubscribers: ps.currentSubscribers * (1 + netGrowthRate)
          };
        });
      }
    }
    
    return months;
  }, [plans, projectionMonths, priceIncrease, priceIncreaseMonth]);

  // Métricas resumidas
  const metrics = useMemo(() => {
    const initial = projection[0];
    const month12 = projection[12] || projection[projection.length - 1];
    const month24 = projection[24] || projection[projection.length - 1];
    const final = projection[projection.length - 1];
    
    const mrrGrowth = ((final.totalMRR - initial.totalMRR) / initial.totalMRR) * 100;
    const avgMRRPerCustomer = final.totalMRR / final.totalSubscribers;
    
    // Receita total no período
    const totalRevenue = projection.reduce((sum, m) => sum + m.totalMRR, 0);
    
    // Taxa de crescimento mensal composta
    const cmgr = projectionMonths > 0 
      ? (Math.pow(final.totalMRR / initial.totalMRR, 1 / projectionMonths) - 1) * 100 
      : 0;
    
    return {
      initial,
      month12,
      month24,
      final,
      mrrGrowth,
      avgMRRPerCustomer,
      totalRevenue,
      cmgr
    };
  }, [projection, projectionMonths]);

  // Formatação
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (num) => new Intl.NumberFormat('pt-BR').format(Math.round(num));

  // Cores para os planos
  const planColors = [
    { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' },
    { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300' },
    { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' },
    { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-300' },
    { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-300' }
  ];

  const getColor = (index) => planColors[index % planColors.length];

  // Gráfico SVG - Linhas empilhadas
  const chartData = useMemo(() => {
    const width = 700;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 40, left: 70 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const maxMRR = Math.max(...projection.map(m => m.totalMRR)) * 1.1;
    
    const xScale = (month) => padding.left + (month / projectionMonths) * chartWidth;
    const yScale = (value) => padding.top + chartHeight - (value / maxMRR) * chartHeight;
    
    // Criar áreas empilhadas para cada plano
    const stackedAreas = [];
    
    plans.forEach((plan, planIndex) => {
      const areaPoints = [];
      
      // Linha superior (acumulado até este plano)
      projection.forEach((m) => {
        const planData = m.plans.find(p => p.id === plan.id);
        const previousPlans = m.plans.slice(0, planIndex);
        const baseValue = previousPlans.reduce((sum, p) => sum + p.mrr, 0);
        const topValue = baseValue + (planData?.mrr || 0);
        
        areaPoints.push({
          month: m.month,
          base: baseValue,
          top: topValue
        });
      });
      
      // Criar path da área
      const topPath = areaPoints.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${xScale(p.month)} ${yScale(p.top)}`
      ).join(' ');
      
      const bottomPath = [...areaPoints].reverse().map((p, i) => 
        `${i === 0 ? 'L' : 'L'} ${xScale(p.month)} ${yScale(p.base)}`
      ).join(' ');
      
      stackedAreas.push({
        id: plan.id,
        name: plan.name,
        path: `${topPath} ${bottomPath} Z`,
        color: getColor(planIndex)
      });
    });
    
    // Linha total
    const totalPath = projection.map((m, i) => 
      `${i === 0 ? 'M' : 'L'} ${xScale(m.month)} ${yScale(m.totalMRR)}`
    ).join(' ');
    
    // Grid lines
    const yGridLines = [];
    const numLines = 5;
    for (let i = 0; i <= numLines; i++) {
      const value = (maxMRR / numLines) * i;
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
    
    return {
      width,
      height,
      padding,
      stackedAreas,
      totalPath,
      yGridLines,
      xLabels,
      xScale,
      yScale
    };
  }, [projection, plans, projectionMonths]);

  // Gráfico de Pizza para distribuição
  const pieData = useMemo(() => {
    const final = projection[projection.length - 1];
    const total = final.totalMRR;
    
    let currentAngle = 0;
    const slices = final.plans.map((plan, index) => {
      const percentage = (plan.mrr / total) * 100;
      const angle = (plan.mrr / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      
      // Converter para radianos para cálculo do path
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);
      
      const radius = 80;
      const cx = 100;
      const cy = 100;
      
      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);
      
      const largeArc = angle > 180 ? 1 : 0;
      
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      
      return {
        id: plan.id,
        name: plan.name,
        mrr: plan.mrr,
        percentage,
        path,
        color: getColor(index)
      };
    });
    
    return slices;
  }, [projection, plans]);

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
          <h1 className="text-3xl font-bold text-gray-900">📈 Simulador de MRR</h1>
          <p className="mt-2 text-gray-600">
            Simule MRR e ARR com múltiplos planos de assinatura e projeções de crescimento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Painel de Configuração */}
          <div className="lg:col-span-1 space-y-6">
            {/* Planos */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">📦 Planos de Assinatura</h2>
                <button
                  onClick={addPlan}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                >
                  + Adicionar
                </button>
              </div>
              
              <div className="space-y-4">
                {plans.map((plan, index) => (
                  <div 
                    key={plan.id} 
                    className={`border-2 ${getColor(index).border} rounded-lg p-4 ${getColor(index).light}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => updatePlan(plan.id, 'name', e.target.value)}
                        className="font-medium bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none w-24"
                      />
                      {plans.length > 1 && (
                        <button
                          onClick={() => removePlan(plan.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <label className="text-xs text-gray-600">Preço (R$)</label>
                        <input
                          type="number"
                          value={plan.price}
                          onChange={(e) => updatePlan(plan.id, 'price', Number(e.target.value) || 0)}
                          className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Assinantes</label>
                        <input
                          type="number"
                          value={plan.subscribers}
                          onChange={(e) => updatePlan(plan.id, 'subscribers', Number(e.target.value) || 0)}
                          className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Crescimento (%)</label>
                        <input
                          type="number"
                          value={plan.growth}
                          onChange={(e) => updatePlan(plan.id, 'growth', Number(e.target.value) || 0)}
                          className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Churn (%)</label>
                        <input
                          type="number"
                          value={plan.churn}
                          onChange={(e) => updatePlan(plan.id, 'churn', Number(e.target.value) || 0)}
                          className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t text-xs text-gray-600 flex justify-between">
                      <span>MRR: {formatCurrency(plan.price * plan.subscribers)}</span>
                      <span>Net: {plan.growth - plan.churn}%/mês</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configurações de Projeção */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Configurações</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Período de Projeção
                  </label>
                  <select
                    value={projectionMonths}
                    onChange={(e) => setProjectionMonths(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={12}>12 meses (1 ano)</option>
                    <option value={24}>24 meses (2 anos)</option>
                    <option value={36}>36 meses (3 anos)</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium text-gray-700 mb-3">💰 Simulação de Aumento de Preço</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Aumento (%)
                      </label>
                      <input
                        type="number"
                        value={priceIncrease}
                        onChange={(e) => setPriceIncrease(Number(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="100"
                        step="5"
                      />
                      <input
                        type="range"
                        value={priceIncrease}
                        onChange={(e) => setPriceIncrease(Number(e.target.value))}
                        className="w-full mt-2"
                        min="0"
                        max="50"
                        step="5"
                      />
                    </div>
                    
                    {priceIncrease > 0 && (
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Aplicar no mês
                        </label>
                        <select
                          value={priceIncreaseMonth}
                          onChange={(e) => setPriceIncreaseMonth(Number(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          {[...Array(projectionMonths)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>Mês {i + 1}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Painel de Resultados */}
          <div className="lg:col-span-2 space-y-6">
            {/* KPIs Principais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <p className="text-sm font-medium opacity-90">MRR Atual</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.initial.totalMRR)}</p>
                <p className="text-xs opacity-75 mt-1">{formatNumber(metrics.initial.totalSubscribers)} assinantes</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <p className="text-sm font-medium opacity-90">MRR Final</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.final.totalMRR)}</p>
                <p className="text-xs opacity-75 mt-1">+{metrics.mrrGrowth.toFixed(0)}%</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                <p className="text-sm font-medium opacity-90">ARR Final</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.final.arr)}</p>
                <p className="text-xs opacity-75 mt-1">receita anual</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                <p className="text-sm font-medium opacity-90">CMGR</p>
                <p className="text-2xl font-bold">{metrics.cmgr.toFixed(1)}%</p>
                <p className="text-xs opacity-75 mt-1">crescimento mensal</p>
              </div>
            </div>

            {/* Gráfico de Evolução */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📊 Evolução do MRR - {projectionMonths} meses
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
                         line.value}
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
                  
                  {/* Áreas empilhadas */}
                  {chartData.stackedAreas.map((area) => (
                    <path
                      key={area.id}
                      d={area.path}
                      className={area.color.bg}
                      opacity="0.7"
                    />
                  ))}
                  
                  {/* Linha total */}
                  <path
                    d={chartData.totalPath}
                    fill="none"
                    stroke="#1f2937"
                    strokeWidth="2"
                    strokeDasharray="4,2"
                  />
                  
                  {/* Marcador de aumento de preço */}
                  {priceIncrease > 0 && priceIncreaseMonth <= projectionMonths && (
                    <g>
                      <line
                        x1={chartData.xScale(priceIncreaseMonth)}
                        y1={chartData.padding.top}
                        x2={chartData.xScale(priceIncreaseMonth)}
                        y2={chartData.height - chartData.padding.bottom}
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="6,3"
                      />
                      <text
                        x={chartData.xScale(priceIncreaseMonth)}
                        y={chartData.padding.top - 5}
                        textAnchor="middle"
                        className="text-xs fill-orange-600 font-medium"
                      >
                        +{priceIncrease}% preço
                      </text>
                    </g>
                  )}
                </svg>
              </div>
              
              {/* Legenda */}
              <div className="flex flex-wrap gap-4 mt-4 justify-center text-sm">
                {plans.map((plan, index) => (
                  <div key={plan.id} className="flex items-center gap-2">
                    <div className={`w-4 h-3 rounded ${getColor(index).bg}`}></div>
                    <span>{plan.name}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-gray-800" style={{backgroundImage: 'repeating-linear-gradient(90deg, #1f2937, #1f2937 4px, transparent 4px, transparent 6px)'}}></div>
                  <span>Total MRR</span>
                </div>
              </div>
            </div>

            {/* Distribuição e Comparativo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gráfico de Pizza */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">🥧 Distribuição Final</h2>
                
                <div className="flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-48 h-48">
                    {pieData.map((slice, index) => (
                      <path
                        key={slice.id}
                        d={slice.path}
                        className={getColor(index).bg}
                        stroke="white"
                        strokeWidth="2"
                      />
                    ))}
                    <circle cx="100" cy="100" r="40" fill="white" />
                    <text x="100" y="95" textAnchor="middle" className="text-xs fill-gray-500">
                      Total
                    </text>
                    <text x="100" y="112" textAnchor="middle" className="text-sm font-bold fill-gray-800">
                      {formatCurrency(metrics.final.totalMRR).replace('R$', '')}
                    </text>
                  </svg>
                </div>
                
                <div className="mt-4 space-y-2">
                  {pieData.map((slice, index) => (
                    <div key={slice.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${getColor(index).bg}`}></div>
                        <span>{slice.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{formatCurrency(slice.mrr)}</span>
                        <span className="text-gray-500 ml-2">({slice.percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparativo de Marcos */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📍 Marcos</h2>
                
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Hoje</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-200 rounded">Mês 0</span>
                    </div>
                    <p className="text-xl font-bold">{formatCurrency(metrics.initial.totalMRR)}</p>
                    <p className="text-xs text-gray-500">{formatNumber(metrics.initial.totalSubscribers)} assinantes</p>
                  </div>
                  
                  {projectionMonths >= 12 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">1 ano</span>
                        <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-800 rounded">Mês 12</span>
                      </div>
                      <p className="text-xl font-bold">{formatCurrency(metrics.month12.totalMRR)}</p>
                      <p className="text-xs text-green-600">
                        +{((metrics.month12.totalMRR - metrics.initial.totalMRR) / metrics.initial.totalMRR * 100).toFixed(0)}%
                      </p>
                    </div>
                  )}
                  
                  {projectionMonths >= 24 && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">2 anos</span>
                        <span className="text-xs px-2 py-0.5 bg-purple-200 text-purple-800 rounded">Mês 24</span>
                      </div>
                      <p className="text-xl font-bold">{formatCurrency(metrics.month24.totalMRR)}</p>
                      <p className="text-xs text-green-600">
                        +{((metrics.month24.totalMRR - metrics.initial.totalMRR) / metrics.initial.totalMRR * 100).toFixed(0)}%
                      </p>
                    </div>
                  )}
                  
                  {projectionMonths >= 36 && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">3 anos</span>
                        <span className="text-xs px-2 py-0.5 bg-green-200 text-green-800 rounded">Mês 36</span>
                      </div>
                      <p className="text-xl font-bold">{formatCurrency(metrics.final.totalMRR)}</p>
                      <p className="text-xs text-green-600">
                        +{metrics.mrrGrowth.toFixed(0)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabela Comparativa por Plano */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Comparativo por Plano</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-3">Plano</th>
                      <th className="text-right py-3 px-3">Preço</th>
                      <th className="text-right py-3 px-3">Inicial</th>
                      <th className="text-right py-3 px-3">Final</th>
                      <th className="text-right py-3 px-3">MRR Inicial</th>
                      <th className="text-right py-3 px-3">MRR Final</th>
                      <th className="text-right py-3 px-3">Crescimento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan, index) => {
                      const initialPlan = metrics.initial.plans.find(p => p.id === plan.id);
                      const finalPlan = metrics.final.plans.find(p => p.id === plan.id);
                      const growth = ((finalPlan.mrr - initialPlan.mrr) / initialPlan.mrr * 100);
                      
                      return (
                        <tr key={plan.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded ${getColor(index).bg}`}></div>
                              <span className="font-medium">{plan.name}</span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-3">{formatCurrency(finalPlan.price)}</td>
                          <td className="text-right py-3 px-3">{formatNumber(initialPlan.subscribers)}</td>
                          <td className="text-right py-3 px-3">{formatNumber(finalPlan.subscribers)}</td>
                          <td className="text-right py-3 px-3">{formatCurrency(initialPlan.mrr)}</td>
                          <td className="text-right py-3 px-3 font-medium">{formatCurrency(finalPlan.mrr)}</td>
                          <td className="text-right py-3 px-3">
                            <span className={growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {growth >= 0 ? '+' : ''}{growth.toFixed(0)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-gray-100 font-bold">
                      <td className="py-3 px-3">Total</td>
                      <td className="text-right py-3 px-3">-</td>
                      <td className="text-right py-3 px-3">{formatNumber(metrics.initial.totalSubscribers)}</td>
                      <td className="text-right py-3 px-3">{formatNumber(metrics.final.totalSubscribers)}</td>
                      <td className="text-right py-3 px-3">{formatCurrency(metrics.initial.totalMRR)}</td>
                      <td className="text-right py-3 px-3">{formatCurrency(metrics.final.totalMRR)}</td>
                      <td className="text-right py-3 px-3 text-green-600">+{metrics.mrrGrowth.toFixed(0)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">💡 Insights</h2>
              
              <div className="space-y-3">
                {/* Plano com maior crescimento */}
                {(() => {
                  const growthRates = plans.map(p => ({
                    name: p.name,
                    net: p.growth - p.churn
                  }));
                  const best = growthRates.reduce((a, b) => a.net > b.net ? a : b);
                  const worst = growthRates.reduce((a, b) => a.net < b.net ? a : b);
                  
                  return (
                    <>
                      <div className="flex items-start gap-3 p-3 bg-green-100 rounded-lg">
                        <span className="text-green-500">🏆</span>
                        <div>
                          <p className="font-medium text-green-800">Melhor Performance</p>
                          <p className="text-sm text-green-700">
                            O plano <strong>{best.name}</strong> tem a maior taxa de crescimento líquido ({best.net}% ao mês).
                          </p>
                        </div>
                      </div>
                      
                      {worst.net < 0 && (
                        <div className="flex items-start gap-3 p-3 bg-red-100 rounded-lg">
                          <span className="text-red-500">⚠️</span>
                          <div>
                            <p className="font-medium text-red-800">Atenção: Crescimento Negativo</p>
                            <p className="text-sm text-red-700">
                              O plano <strong>{worst.name}</strong> está perdendo assinantes ({worst.net}% ao mês). Revise a proposta de valor.
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
                
                <div className="flex items-start gap-3 p-3 bg-blue-100 rounded-lg">
                  <span className="text-blue-500">📊</span>
                  <div>
                    <p className="font-medium text-blue-800">Projeção de Receita</p>
                    <p className="text-sm text-blue-700">
                      Em {projectionMonths} meses, seu ARR será de <strong>{formatCurrency(metrics.final.arr)}</strong>, 
                      com {formatNumber(metrics.final.totalSubscribers)} assinantes ativos.
                    </p>
                  </div>
                </div>
                
                {priceIncrease > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-100 rounded-lg">
                    <span className="text-yellow-500">💰</span>
                    <div>
                      <p className="font-medium text-yellow-800">Impacto do Aumento de Preço</p>
                      <p className="text-sm text-yellow-700">
                        O aumento de {priceIncrease}% no mês {priceIncreaseMonth} impactará diretamente o MRR. 
                        Monitore o churn pós-aumento para validar a elasticidade de preço.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3 p-3 bg-purple-100 rounded-lg">
                  <span className="text-purple-500">🎯</span>
                  <div>
                    <p className="font-medium text-purple-800">Ticket Médio</p>
                    <p className="text-sm text-purple-700">
                      Seu ticket médio final será de <strong>{formatCurrency(metrics.avgMRRPerCustomer)}</strong> por cliente. 
                      {metrics.avgMRRPerCustomer > 100 ? ' Excelente para B2B!' : ' Considere estratégias de upsell.'}
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

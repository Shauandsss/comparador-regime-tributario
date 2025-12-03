import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CalculadoraDistribuicaoLucros() {
  const navigate = useNavigate();

  const [dados, setDados] = useState({
    regime: 'simples',
    faturamentoMensal: 100000,
    despesasMensais: 60000,
    folhaPagamento: 25000,
    numeroSocios: 2,
    distribuicaoAtual: 30000,
    proLaboreAtual: 5000
  });

  const [estrategia, setEstrategia] = useState('otimizada'); // otimizada, maxima-isencao, equilibrada

  // Cálculos de lucro disponível
  const lucroMensal = useMemo(() => {
    return Math.max(0, dados.faturamentoMensal - dados.despesasMensais);
  }, [dados.faturamentoMensal, dados.despesasMensais]);

  const lucroAnual = lucroMensal * 12;

  // Cálculo do Fator R
  const fatorR = useMemo(() => {
    const folhaAnual = dados.folhaPagamento * 12;
    const faturamentoAnual = dados.faturamentoMensal * 12;
    return faturamentoAnual > 0 ? (folhaAnual / faturamentoAnual) * 100 : 0;
  }, [dados.folhaPagamento, dados.faturamentoMensal]);

  // Cálculo INSS sobre pró-labore
  const calcularINSS = (prolabore) => {
    const tetoINSS = 7786.02; // 2025
    const aliquota = 0.11;
    const base = Math.min(prolabore, tetoINSS);
    return base * aliquota;
  };

  // Cálculo IRPF sobre pró-labore
  const calcularIRPF = (prolabore) => {
    const baseIRPF = prolabore - calcularINSS(prolabore);
    
    // Tabela IRPF 2025 (simplificada)
    if (baseIRPF <= 2259.20) return 0;
    if (baseIRPF <= 2826.65) return baseIRPF * 0.075 - 169.44;
    if (baseIRPF <= 3751.05) return baseIRPF * 0.15 - 381.44;
    if (baseIRPF <= 4664.68) return baseIRPF * 0.225 - 662.77;
    return baseIRPF * 0.275 - 896.00;
  };

  // Estratégias de distribuição
  const calcularEstrategias = useMemo(() => {
    const lucroDisponivel = lucroMensal;
    const proLaborePorSocio = dados.numeroSocios > 0 ? dados.proLaboreAtual / dados.numeroSocios : 0;

    // Estratégia 1: Otimizada para Fator R (manter/melhorar Fator R)
    const fatorRNecessario = 0.28;
    const faturamentoAnual = dados.faturamentoMensal * 12;
    const folhaAnualNecessaria = faturamentoAnual * fatorRNecessario; // 28% do faturamento anual
    const proLaboreOtimizado = dados.numeroSocios > 0 ? Math.max(
      (folhaAnualNecessaria / 12) / (1.20 * dados.numeroSocios), // Dividir por 1.20 para considerar INSS patronal 20%
      2000 // mínimo razoável
    ) : 2000;
    const distribuicaoOtimizada = Math.max(0, lucroDisponivel - proLaboreOtimizado * dados.numeroSocios);

    // Estratégia 2: Máxima Isenção (minimizar pró-labore)
    const proLaboreMinimo = 2000; // mínimo recomendado
    const distribuicaoMaxima = Math.max(0, lucroDisponivel - (proLaboreMinimo * dados.numeroSocios));

    // Estratégia 3: Equilibrada (50/50)
    const proLaboreEquilibrado = lucroDisponivel / dados.numeroSocios / 2;
    const distribuicaoEquilibrada = lucroDisponivel / 2;

    // Cálculos de impostos para cada estratégia
    const calcularImpostos = (prolabore, distribuicao) => {
      const inss = calcularINSS(prolabore) * dados.numeroSocios;
      const irpf = calcularIRPF(prolabore) * dados.numeroSocios;
      const total = inss + irpf;
      const liquido = (prolabore * dados.numeroSocios) + distribuicao - total;
      const cargaRetirada = lucroDisponivel > 0 ? (total / lucroDisponivel) * 100 : 0;

      return { inss, irpf, total, liquido, cargaRetirada };
    };

    // Situação atual
    const atual = calcularImpostos(proLaborePorSocio, dados.distribuicaoAtual);
    
    // Estratégias
    const calcularFatorRResultante = (proLaborePorSocio) => {
      const faturamentoAnual = dados.faturamentoMensal * 12;
      if (faturamentoAnual === 0) return 0;
      const folhaAnual = (proLaborePorSocio * dados.numeroSocios * 12) * 1.20; // Inclui INSS patronal 20%
      return (folhaAnual / faturamentoAnual) * 100;
    };

    const otimizada = {
      ...calcularImpostos(proLaboreOtimizado, distribuicaoOtimizada),
      proLaborePorSocio: proLaboreOtimizado,
      distribuicao: distribuicaoOtimizada,
      fatorRResultante: calcularFatorRResultante(proLaboreOtimizado)
    };

    const maximaIsencao = {
      ...calcularImpostos(proLaboreMinimo, distribuicaoMaxima),
      proLaborePorSocio: proLaboreMinimo,
      distribuicao: distribuicaoMaxima,
      fatorRResultante: calcularFatorRResultante(proLaboreMinimo)
    };

    const equilibrada = {
      ...calcularImpostos(proLaboreEquilibrado, distribuicaoEquilibrada),
      proLaborePorSocio: proLaboreEquilibrado,
      distribuicao: distribuicaoEquilibrada,
      fatorRResultante: calcularFatorRResultante(proLaboreEquilibrado)
    };

    return {
      atual: { ...atual, proLaborePorSocio, distribuicao: dados.distribuicaoAtual },
      otimizada,
      maximaIsencao,
      equilibrada
    };
  }, [dados, lucroMensal]);

  // Estratégia selecionada
  const estrategiaSelecionada = calcularEstrategias[estrategia];

  // Comparação com situação atual
  const economia = useMemo(() => {
    const economiaTotal = calcularEstrategias.atual.total - estrategiaSelecionada.total;
    const economiaAnual = economiaTotal * 12;
    const percentual = calcularEstrategias.atual.total > 0 
      ? (economiaTotal / calcularEstrategias.atual.total) * 100 
      : 0;

    return { mensal: economiaTotal, anual: economiaAnual, percentual };
  }, [calcularEstrategias, estrategiaSelecionada]);

  const handleInputChange = (campo, valor) => {
    setDados(prev => ({
      ...prev,
      [campo]: parseFloat(valor) || 0
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-800 mb-4 flex items-center gap-2"
          >
            ← Voltar para Home
          </button>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💰 Calculadora de Distribuição de Lucros
          </h1>
          <p className="text-gray-600 text-lg">
            Otimize a retirada dos sócios equilibrando pró-labore e distribuição de lucros isenta
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna 1: Inputs */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Dados da Empresa */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Dados da Empresa</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Regime Tributário
                  </label>
                  <select
                    value={dados.regime}
                    onChange={(e) => handleInputChange('regime', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                  >
                    <option value="simples">Simples Nacional</option>
                    <option value="presumido">Lucro Presumido</option>
                    <option value="real">Lucro Real</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    💵 Faturamento Mensal
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">R$</span>
                    <input
                      type="number"
                      value={dados.faturamentoMensal}
                      onChange={(e) => handleInputChange('faturamentoMensal', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📉 Despesas Mensais
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">R$</span>
                    <input
                      type="number"
                      value={dados.despesasMensais}
                      onChange={(e) => handleInputChange('despesasMensais', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    👥 Folha de Pagamento Total
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">R$</span>
                    <input
                      type="number"
                      value={dados.folhaPagamento}
                      onChange={(e) => handleInputChange('folhaPagamento', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Inclui pró-labore dos sócios + salários de funcionários
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🤝 Número de Sócios
                  </label>
                  <input
                    type="number"
                    value={dados.numeroSocios}
                    onChange={(e) => handleInputChange('numeroSocios', e.target.value)}
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Situação Atual */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Situação Atual</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    💼 Pró-labore Total Mensal
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">R$</span>
                    <input
                      type="number"
                      value={dados.proLaboreAtual}
                      onChange={(e) => handleInputChange('proLaboreAtual', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none bg-white"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Por sócio: R$ {(dados.proLaboreAtual / dados.numeroSocios).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    💎 Distribuição de Lucros Mensal
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">R$</span>
                    <input
                      type="number"
                      value={dados.distribuicaoAtual}
                      onChange={(e) => handleInputChange('distribuicaoAtual', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none bg-white"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Por sócio: R$ {(dados.distribuicaoAtual / dados.numeroSocios).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Resumo Situação Atual */}
              <div className="mt-6 p-4 bg-white rounded-lg border-2 border-gray-300">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Impostos Mensais:</span>
                    <span className="font-bold text-red-600">
                      R$ {calcularEstrategias.atual.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Líquido Mensal:</span>
                    <span className="font-bold text-green-600">
                      R$ {calcularEstrategias.atual.liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carga s/ Retirada:</span>
                    <span className="font-bold text-gray-800">
                      {calcularEstrategias.atual.cargaRetirada.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicadores */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Indicadores</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-semibold text-gray-700">Lucro Mensal:</span>
                  <span className="text-lg font-black text-blue-600">
                    R$ {lucroMensal.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-semibold text-gray-700">Fator R:</span>
                  <span className={`text-lg font-black ${fatorR >= 28 ? 'text-green-600' : 'text-red-600'}`}>
                    {fatorR.toFixed(1)}%
                  </span>
                </div>
                {dados.regime === 'simples' && (
                  <div className="text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                    {fatorR >= 28 
                      ? '✅ Fator R adequado para Anexo III' 
                      : '⚠️ Risco de Anexo V - Considere aumentar folha'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coluna 2 e 3: Estratégias e Resultados */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Seletor de Estratégia */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Escolha sua Estratégia</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Estratégia Otimizada */}
                <button
                  onClick={() => setEstrategia('otimizada')}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    estrategia === 'otimizada'
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-bold text-lg mb-2">Otimizada</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Equilibra impostos e Fator R para Simples Nacional
                  </p>
                  <div className="text-xs text-purple-600 font-semibold">
                    Recomendado para Simples
                  </div>
                </button>

                {/* Estratégia Máxima Isenção */}
                <button
                  onClick={() => setEstrategia('maximaIsencao')}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    estrategia === 'maximaIsencao'
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="text-3xl mb-2">💎</div>
                  <h3 className="font-bold text-lg mb-2">Máxima Isenção</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Minimiza pró-labore, maximiza distribuição isenta
                  </p>
                  <div className="text-xs text-green-600 font-semibold">
                    Menor carga tributária
                  </div>
                </button>

                {/* Estratégia Equilibrada */}
                <button
                  onClick={() => setEstrategia('equilibrada')}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    estrategia === 'equilibrada'
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-3xl mb-2">⚖️</div>
                  <h3 className="font-bold text-lg mb-2">Equilibrada</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    50% pró-labore, 50% distribuição de lucros
                  </p>
                  <div className="text-xs text-blue-600 font-semibold">
                    Moderada
                  </div>
                </button>
              </div>
            </div>

            {/* Resultado da Estratégia Selecionada */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">📊 Resultado da Estratégia</h2>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="font-bold text-lg capitalize">{estrategia.replace('Isencao', ' Isenção')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="text-sm text-purple-100 mb-2">💼 Pró-labore por Sócio</div>
                  <div className="text-3xl font-black">
                    R$ {estrategiaSelecionada.proLaborePorSocio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-purple-200 mt-1">
                    Total: R$ {(estrategiaSelecionada.proLaborePorSocio * dados.numeroSocios).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="text-sm text-purple-100 mb-2">💎 Distribuição por Sócio</div>
                  <div className="text-3xl font-black">
                    R$ {(estrategiaSelecionada.distribuicao / dados.numeroSocios).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-purple-200 mt-1">
                    Total: R$ {estrategiaSelecionada.distribuicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="text-sm text-purple-100 mb-2">📊 Impostos Totais</div>
                  <div className="text-3xl font-black text-red-200">
                    R$ {estrategiaSelecionada.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-purple-200 mt-1">
                    INSS: R$ {estrategiaSelecionada.inss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | 
                    IRPF: R$ {estrategiaSelecionada.irpf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="text-sm text-purple-100 mb-2">💰 Líquido Total</div>
                  <div className="text-3xl font-black text-green-200">
                    R$ {estrategiaSelecionada.liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-purple-200 mt-1">
                    Por sócio: R$ {(estrategiaSelecionada.liquido / dados.numeroSocios).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm text-purple-100 mb-1">Carga s/ Retirada</div>
                  <div className="text-2xl font-black">
                    {estrategiaSelecionada.cargaRetirada.toFixed(1)}%
                  </div>
                </div>

                {dados.regime === 'simples' && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-sm text-purple-100 mb-1">Fator R Resultante</div>
                    <div className={`text-2xl font-black ${estrategiaSelecionada.fatorRResultante >= 28 ? 'text-green-200' : 'text-yellow-200'}`}>
                      {estrategiaSelecionada.fatorRResultante.toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comparação com Situação Atual */}
            {economia.mensal !== 0 && (
              <div className={`rounded-2xl shadow-xl p-8 ${
                economia.mensal > 0 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                  : 'bg-gradient-to-br from-orange-500 to-red-600'
              } text-white`}>
                <h2 className="text-2xl font-bold mb-6">
                  {economia.mensal > 0 ? '🎉 Economia Identificada!' : '⚠️ Análise de Impacto'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                    <div className="text-sm text-green-100 mb-2">Economia Mensal</div>
                    <div className={`text-3xl font-black ${economia.mensal > 0 ? 'text-green-200' : 'text-orange-200'}`}>
                      {economia.mensal > 0 ? '+' : ''}R$ {Math.abs(economia.mensal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                    <div className="text-sm text-green-100 mb-2">Economia Anual</div>
                    <div className={`text-3xl font-black ${economia.mensal > 0 ? 'text-green-200' : 'text-orange-200'}`}>
                      {economia.mensal > 0 ? '+' : ''}R$ {Math.abs(economia.anual).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                    <div className="text-sm text-green-100 mb-2">Redução</div>
                    <div className={`text-3xl font-black ${economia.mensal > 0 ? 'text-green-200' : 'text-orange-200'}`}>
                      {economia.mensal > 0 ? '-' : '+'}{Math.abs(economia.percentual).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabela Comparativa */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Comparativo Completo</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-2 font-bold text-gray-700">Item</th>
                      <th className="text-center py-3 px-2 font-bold text-gray-700 bg-gray-100">Atual</th>
                      <th className="text-center py-3 px-2 font-bold text-purple-700 bg-purple-50">Otimizada</th>
                      <th className="text-center py-3 px-2 font-bold text-green-700 bg-green-50">Máx. Isenção</th>
                      <th className="text-center py-3 px-2 font-bold text-blue-700 bg-blue-50">Equilibrada</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-2 font-semibold">Pró-labore/sócio</td>
                      <td className="text-center py-3 px-2 bg-gray-50">
                        R$ {(calcularEstrategias.atual.proLaborePorSocio).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center py-3 px-2 bg-purple-50">
                        R$ {calcularEstrategias.otimizada.proLaborePorSocio.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center py-3 px-2 bg-green-50">
                        R$ {calcularEstrategias.maximaIsencao.proLaborePorSocio.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center py-3 px-2 bg-blue-50">
                        R$ {calcularEstrategias.equilibrada.proLaborePorSocio.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-2 font-semibold">Distribuição/sócio</td>
                      <td className="text-center py-3 px-2 bg-gray-50">
                        R$ {(calcularEstrategias.atual.distribuicao / dados.numeroSocios).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center py-3 px-2 bg-purple-50">
                        R$ {(calcularEstrategias.otimizada.distribuicao / dados.numeroSocios).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center py-3 px-2 bg-green-50">
                        R$ {(calcularEstrategias.maximaIsencao.distribuicao / dados.numeroSocios).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center py-3 px-2 bg-blue-50">
                        R$ {(calcularEstrategias.equilibrada.distribuicao / dados.numeroSocios).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-2 font-semibold">INSS Total</td>
                      <td className="text-center py-3 px-2 bg-gray-50 text-red-600">
                        R$ {calcularEstrategias.atual.inss.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center py-3 px-2 bg-purple-50 text-red-600">
                        R$ {calcularEstrategias.otimizada.inss.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center py-3 px-2 bg-green-50 text-red-600">
                        R$ {calcularEstrategias.maximaIsencao.inss.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center py-3 px-2 bg-blue-50 text-red-600">
                        R$ {calcularEstrategias.equilibrada.inss.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-2 font-semibold">IRPF Total</td>
                      <td className="text-center py-3 px-2 bg-gray-50 text-red-600">
                        R$ {calcularEstrategias.atual.irpf.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center py-3 px-2 bg-purple-50 text-red-600">
                        R$ {calcularEstrategias.otimizada.irpf.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center py-3 px-2 bg-green-50 text-red-600">
                        R$ {calcularEstrategias.maximaIsencao.irpf.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center py-3 px-2 bg-blue-50 text-red-600">
                        R$ {calcularEstrategias.equilibrada.irpf.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                    <tr className="border-b-2 border-gray-200 font-bold">
                      <td className="py-3 px-2">Líquido Total</td>
                      <td className="text-center py-3 px-2 bg-gray-100 text-green-600">
                        R$ {calcularEstrategias.atual.liquido.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center py-3 px-2 bg-purple-100 text-green-600">
                        R$ {calcularEstrategias.otimizada.liquido.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center py-3 px-2 bg-green-100 text-green-600">
                        R$ {calcularEstrategias.maximaIsencao.liquido.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center py-3 px-2 bg-blue-100 text-green-600">
                        R$ {calcularEstrategias.equilibrada.liquido.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                    <tr className="font-bold">
                      <td className="py-3 px-2">Carga s/ Retirada</td>
                      <td className="text-center py-3 px-2 bg-gray-100">
                        {calcularEstrategias.atual.cargaRetirada.toFixed(1)}%
                      </td>
                      <td className="text-center py-3 px-2 bg-purple-100">
                        {calcularEstrategias.otimizada.cargaRetirada.toFixed(1)}%
                      </td>
                      <td className="text-center py-3 px-2 bg-green-100">
                        {calcularEstrategias.maximaIsencao.cargaRetirada.toFixed(1)}%
                      </td>
                      <td className="text-center py-3 px-2 bg-blue-100">
                        {calcularEstrategias.equilibrada.cargaRetirada.toFixed(1)}%
                      </td>
                    </tr>
                    {dados.regime === 'simples' && (
                      <tr className="font-bold">
                        <td className="py-3 px-2">Fator R</td>
                        <td className="text-center py-3 px-2 bg-gray-100">
                          {fatorR.toFixed(1)}%
                        </td>
                        <td className="text-center py-3 px-2 bg-purple-100">
                          {calcularEstrategias.otimizada.fatorRResultante.toFixed(1)}%
                        </td>
                        <td className="text-center py-3 px-2 bg-green-100">
                          {calcularEstrategias.maximaIsencao.fatorRResultante.toFixed(1)}%
                        </td>
                        <td className="text-center py-3 px-2 bg-blue-100">
                          {calcularEstrategias.equilibrada.fatorRResultante.toFixed(1)}%
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recomendações */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">💡 Recomendações Personalizadas</h2>
              
              <div className="space-y-3">
                {dados.regime === 'simples' && fatorR < 28 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <h4 className="font-bold mb-1">Atenção ao Fator R!</h4>
                        <p className="text-sm text-blue-100">
                          Seu Fator R atual ({fatorR.toFixed(1)}%) está abaixo de 28%, o que pode levar ao Anexo V com alíquotas mais altas. 
                          Considere aumentar a folha de pagamento (pró-labore ou contratações).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {economia.mensal > 1000 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💰</span>
                      <div>
                        <h4 className="font-bold mb-1">Economia Significativa Identificada</h4>
                        <p className="text-sm text-blue-100">
                          Você pode economizar R$ {economia.anual.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} por ano 
                          ({economia.percentual.toFixed(1)}% de redução) ajustando sua estratégia de retirada.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📋</span>
                    <div>
                      <h4 className="font-bold mb-1">Lembre-se</h4>
                      <p className="text-sm text-blue-100">
                        Distribuição de lucros é isenta de IR e não tem contribuição previdenciária, mas deve ser baseada em lucro contábil apurado. 
                        Consulte seu contador para validar os valores e manter conformidade fiscal.
                      </p>
                    </div>
                  </div>
                </div>

                {estrategiaSelecionada.proLaborePorSocio < 2000 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚖️</span>
                      <div>
                        <h4 className="font-bold mb-1">Pró-labore Muito Baixo</h4>
                        <p className="text-sm text-blue-100">
                          Pró-labore abaixo de R$ 2.000 pode gerar questionamentos da Receita Federal. 
                          É recomendável manter um valor compatível com a função exercida e o mercado.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🎯 Outras Ferramentas Úteis</h3>
          <p className="text-gray-600 mb-6">
            Continue otimizando sua gestão tributária com nossas outras calculadoras
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/formulario')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
            >
              ⚖️ Comparador de Regimes
            </button>
            <button
              onClick={() => navigate('/calculadora-pro-labore')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              💼 Calculadora de Pró-Labore
            </button>
            <button
              onClick={() => navigate('/diagnostico-tributario')}
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition"
            >
              🎯 Diagnóstico Tributário
            </button>
          </div>
        </div>

        {/* Artigo SEO */}
        <article className="mt-12 max-w-4xl mx-auto prose prose-lg prose-slate">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Distribuição de Lucros: Como Retirar da Empresa Sem Pagar Impostos em 2025
          </h2>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Introdução</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Imagine poder retirar dinheiro da sua empresa <strong>sem pagar Imposto de Renda nem INSS</strong>. 
              Parece bom demais para ser verdade? Pois é exatamente isso que a <strong>distribuição de lucros</strong> permite — 
              de forma 100% legal. Enquanto o pró-labore sofre descontos de até 38% (11% INSS + até 27,5% IRPF), 
              <strong>a distribuição de lucros é totalmente isenta</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Mas atenção: não é simplesmente "retirar dinheiro do caixa" quando quiser. Existem <strong>regras importantes</strong> 
              que você precisa conhecer para fazer distribuição de lucros de forma correta e evitar problemas com a Receita Federal. 
              Empresas que fazem errado podem ser autuadas, ter a isenção negada e acabar pagando até 34,5% de impostos retroativos 
              sobre valores distribuídos incorretamente.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Neste guia completo, você vai aprender <strong>o que é distribuição de lucros, quando pode fazer, como calcular o valor máximo permitido, 
              a diferença entre lucro e pró-labore, estratégias para otimizar sua retirada</strong> e os erros mais comuns que podem 
              custar caro. Continue lendo para descobrir como usar essa ferramenta poderosa a seu favor.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">O Que É Distribuição de Lucros?</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Distribuição de lucros</strong> é o pagamento feito pela empresa aos seus sócios ou acionistas com base no 
              <strong>lucro efetivamente apurado</strong> em um determinado período. Diferente do pró-labore (que é remuneração pelo trabalho), 
              a distribuição de lucros é o <strong>retorno sobre o capital investido</strong> — é a recompensa financeira por ser dono do negócio.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">Base Legal: Lei 8.981/1995 e Lei 9.249/1995</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              A isenção de Imposto de Renda sobre lucros distribuídos foi instituída pela <strong>Lei 9.249/1995 (Art. 10)</strong>, 
              que determina: <em>"Os lucros ou dividendos calculados com base nos resultados apurados a partir do mês de janeiro de 1996, 
              pagos ou creditados pelas pessoas jurídicas tributadas com base no lucro real, presumido ou arbitrado, não ficarão sujeitos 
              à incidência do imposto de renda na fonte, nem integrarão a base de cálculo do imposto de renda do beneficiário, 
              pessoa física ou jurídica, domiciliado no País ou no exterior."</em>
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Em outras palavras: se a empresa apurou <strong>lucro contábil real</strong> (não apenas caixa sobrando), esse lucro pode ser 
              distribuído aos sócios <strong>sem IR e sem INSS</strong>. Mas há requisitos importantes.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-lg">
              <h5 className="font-bold text-yellow-900 mb-2">⚠️ Requisito Fundamental: Lucro Contábil Comprovado</h5>
              <p className="text-gray-700 leading-relaxed">
                A isenção só vale para <strong>lucros apurados contabilmente</strong>. Isso significa que você precisa de 
                <strong>balanço patrimonial</strong>, <strong>DRE (Demonstração do Resultado do Exercício)</strong> e 
                <strong>escrituração contábil regular</strong>. Não é simplesmente "sobrou dinheiro no caixa, vou distribuir". 
                Se a Receita auditar sua empresa e não encontrar comprovação contábil do lucro, a isenção pode ser <strong>negada</strong> 
                e você terá que pagar IR + juros + multa sobre todo o valor distribuído.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Distribuição de Lucros vs Pró-Labore: Entenda a Diferença</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Muitos empresários confundem essas duas formas de retirada. Veja a diferença fundamental:
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Aspecto</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Pró-Labore</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Distribuição de Lucros</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium">Natureza</td>
                    <td className="px-4 py-3">Remuneração pelo <strong>trabalho</strong></td>
                    <td className="px-4 py-3">Retorno sobre o <strong>capital investido</strong></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">Obrigatoriedade</td>
                    <td className="px-4 py-3"><strong>Obrigatório</strong> para sócios que trabalham</td>
                    <td className="px-4 py-3"><strong>Opcional</strong> (depende de lucro)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Base</td>
                    <td className="px-4 py-3">Valor fixo mensal</td>
                    <td className="px-4 py-3">Lucro contábil apurado</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">INSS (11%)</td>
                    <td className="px-4 py-3"><strong className="text-red-600">Sim</strong> — desconta da retirada</td>
                    <td className="px-4 py-3"><strong className="text-green-600">Não</strong> — isento</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">IRPF (até 27,5%)</td>
                    <td className="px-4 py-3"><strong className="text-red-600">Sim</strong> — tabela progressiva</td>
                    <td className="px-4 py-3"><strong className="text-green-600">Não</strong> — isento</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">Impacto Fator R</td>
                    <td className="px-4 py-3"><strong>Sim</strong> — conta na folha (melhora Fator R)</td>
                    <td className="px-4 py-3"><strong>Não</strong> — não entra na folha</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Aposentadoria</td>
                    <td className="px-4 py-3"><strong>Sim</strong> — contribui para o INSS</td>
                    <td className="px-4 py-3"><strong>Não</strong> — não gera direito previdenciário</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">Comprovação de Renda</td>
                    <td className="px-4 py-3">Holerite mensal</td>
                    <td className="px-4 py-3">Demonstrações contábeis + recibo</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-lg">
              <h5 className="font-bold text-green-900 mb-2">💡 Estratégia Inteligente: Combine os Dois</h5>
              <p className="text-gray-700 leading-relaxed">
                A combinação ideal para a maioria dos empresários é: <strong>pró-labore suficiente</strong> para atingir Fator R de 28% 
                (se Simples Nacional) e garantir aposentadoria + <strong>distribuição de lucros</strong> (isenta) para complementar a retirada mensal. 
                Assim você equilibra tributação, previdência e retirada líquida.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Quanto Posso Distribuir? Como Calcular o Lucro Disponível</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              O valor máximo que você pode distribuir é o <strong>lucro líquido contábil</strong> apurado no período, 
              deduzido de reservas obrigatórias (se houver) e prejuízos acumulados de períodos anteriores.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">Fórmula Básica</h4>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg mb-6">
              <p className="font-mono text-sm text-gray-900 mb-3">
                <strong>Lucro Distribuível = Lucro Líquido - Reservas Legais - Prejuízos Acumulados</strong>
              </p>
              <p className="text-gray-700 text-sm">
                Onde: <strong>Lucro Líquido</strong> = Receitas - Despesas - Impostos - Pró-labore - Outras Deduções Contábeis
              </p>
            </div>

            <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">Passo a Passo Prático</h4>
            <div className="space-y-3 mb-6">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h5 className="font-bold text-gray-900 mb-2">1️⃣ Calcule o Lucro Bruto</h5>
                <p className="text-gray-700 leading-relaxed text-sm">
                  <strong>Lucro Bruto = Faturamento - Custos Diretos</strong> (mercadorias vendidas, matéria-prima, mão de obra direta). 
                  Exemplo: faturou R$ 100.000, gastou R$ 40.000 em mercadorias → Lucro Bruto = R$ 60.000.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h5 className="font-bold text-gray-900 mb-2">2️⃣ Subtraia Despesas Operacionais</h5>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Aluguel, luz, internet, telefone, salários administrativos, marketing, contador, etc. 
                  Exemplo: R$ 60.000 - R$ 25.000 (despesas) = <strong>R$ 35.000</strong> (Lucro Operacional).
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h5 className="font-bold text-gray-900 mb-2">3️⃣ Deduza Impostos e Pró-Labore</h5>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Subtraia DAS (Simples), impostos federais/estaduais/municipais (outros regimes) e pró-labore dos sócios. 
                  Exemplo: R$ 35.000 - R$ 6.000 (impostos) - R$ 10.000 (pró-labore) = <strong>R$ 19.000</strong> (Lucro Líquido).
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h5 className="font-bold text-gray-900 mb-2">4️⃣ Aplique Reservas (se houver)</h5>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Empresas S.A. devem fazer <strong>Reserva Legal de 5%</strong> do lucro até atingir 20% do capital social. 
                  Exemplo: R$ 19.000 × 5% = R$ 950 (reserva) → <strong>Lucro Distribuível = R$ 18.050</strong>. 
                  Empresas Limitadas geralmente não têm essa obrigação, mas podem fazer reservas voluntárias no contrato social.
                </p>
              </div>
            </div>

            <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-indigo-900 mb-3 text-lg">📊 Exemplo Completo</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Faturamento Mensal:</span>
                  <span className="font-bold text-gray-900">R$ 150.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">(-) Custos de Mercadorias:</span>
                  <span className="font-bold text-red-600">R$ 60.000</span>
                </div>
                <div className="flex justify-between border-t border-indigo-200 pt-2">
                  <span className="text-gray-700 font-semibold">= Lucro Bruto:</span>
                  <span className="font-bold text-blue-600">R$ 90.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">(-) Despesas Operacionais:</span>
                  <span className="font-bold text-red-600">R$ 35.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">(-) Impostos (DAS 8%):</span>
                  <span className="font-bold text-red-600">R$ 12.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">(-) Pró-labore Total:</span>
                  <span className="font-bold text-red-600">R$ 12.000</span>
                </div>
                <div className="flex justify-between border-t border-indigo-200 pt-2">
                  <span className="text-gray-700 font-bold">= Lucro Líquido:</span>
                  <span className="font-bold text-green-600 text-lg">R$ 31.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">(-) Reserva Legal (opcional):</span>
                  <span className="font-bold text-red-600">R$ 0</span>
                </div>
                <div className="flex justify-between border-t-2 border-indigo-300 pt-2">
                  <span className="text-indigo-900 font-black">= LUCRO DISTRIBUÍVEL:</span>
                  <span className="font-black text-green-700 text-xl">R$ 31.000</span>
                </div>
              </div>
              <p className="text-xs text-indigo-700 mt-4 italic">
                Esse é o valor máximo que pode ser distribuído aos sócios no mês <strong>sem pagar IR ou INSS</strong>.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Estratégias de Retirada: Otimizando Pró-Labore e Lucros</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Existem diferentes estratégias para equilibrar pró-labore (tributado) e distribuição de lucros (isenta), 
              dependendo do seu perfil, regime tributário e objetivos.
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <h4 className="font-bold text-purple-900 mb-2 text-lg">🎯 Estratégia 1: Otimizada para Fator R (Simples Nacional)</h4>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Objetivo:</strong> Atingir Fator R ≥ 28% para pagar pelo Anexo III (alíquotas menores) mantendo máxima distribuição isenta.
                </p>
                <p className="text-gray-700 leading-relaxed text-sm mb-2">
                  <strong>Como fazer:</strong> Calcule o pró-labore necessário para atingir 28% de folha sobre faturamento anual. 
                  O restante do lucro, distribua como lucros isentos.
                </p>
                <div className="bg-white rounded-lg p-4 text-sm">
                  <p className="font-mono text-gray-900">
                    <strong>Exemplo:</strong> Faturamento R$ 480k/ano → Folha ideal = R$ 134.400/ano (28%) → Pró-labore ideal = R$ 11.200/mês 
                    (para 1 sócio). Se lucro mensal = R$ 30k, distribua: R$ 11.200 pró-labore + R$ 18.800 lucros isentos.
                  </p>
                </div>
                <p className="text-xs text-purple-700 mt-2 italic">
                  ✅ Melhor para: empresas de serviços no Simples que querem Anexo III
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6">
                <h4 className="font-bold text-green-900 mb-2 text-lg">💎 Estratégia 2: Máxima Isenção</h4>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Objetivo:</strong> Minimizar tributação pessoal pagando o menor pró-labore possível e maximizando distribuição isenta.
                </p>
                <p className="text-gray-700 leading-relaxed text-sm mb-2">
                  <strong>Como fazer:</strong> Pró-labore = 1 salário mínimo ou valor mínimo razoável (R$ 2.000 - R$ 3.000). 
                  Restante do lucro distribuído isento.
                </p>
                <div className="bg-white rounded-lg p-4 text-sm">
                  <p className="font-mono text-gray-900">
                    <strong>Exemplo:</strong> Lucro mensal = R$ 30k → Pró-labore = R$ 2.500 (INSS R$ 275 + IRPF ~R$ 30) → 
                    Distribuição isenta = R$ 27.500. <strong>Tributação pessoal: apenas 1% do lucro total.</strong>
                  </p>
                </div>
                <p className="text-xs text-green-700 mt-2 italic">
                  ✅ Melhor para: empresas no Lucro Presumido/Real, ou Simples Anexo I/II/IV (sem Fator R)
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  ⚠️ Risco: pró-labore muito baixo pode gerar questionamento fiscal ou prejudicar Fator R
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6">
                <h4 className="font-bold text-blue-900 mb-2 text-lg">⚖️ Estratégia 3: Equilibrada (50/50)</h4>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Objetivo:</strong> Equilibrar aposentadoria (via pró-labore) e tributação (via lucros isentos).
                </p>
                <p className="text-gray-700 leading-relaxed text-sm mb-2">
                  <strong>Como fazer:</strong> Dividir lucro disponível meio a meio entre pró-labore e distribuição de lucros.
                </p>
                <div className="bg-white rounded-lg p-4 text-sm">
                  <p className="font-mono text-gray-900">
                    <strong>Exemplo:</strong> Lucro mensal = R$ 30k → Pró-labore = R$ 15k (INSS R$ 856 + IRPF ~R$ 2.100) → 
                    Distribuição isenta = R$ 15k. <strong>Tributação: ~10% do lucro total.</strong>
                  </p>
                </div>
                <p className="text-xs text-blue-700 mt-2 italic">
                  ✅ Melhor para: quem quer aposentadoria no teto do INSS (R$ 7.786) e não se importa com carga tributária moderada
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">5 Erros Comuns na Distribuição de Lucros</h3>

            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">❌ Erro 1: Distribuir lucros sem contabilidade regular</h4>
                <p className="text-gray-700 leading-relaxed">
                  Muitos empresários retiram dinheiro achando que é "lucro isento" sem ter balanço patrimonial ou DRE que comprove o lucro contábil. 
                  <strong>Sem documentação contábil adequada</strong>, a Receita Federal pode negar a isenção e cobrar IR + INSS retroativamente sobre 
                  todo o valor distribuído (alíquota até 34,5%).
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">❌ Erro 2: Distribuir mais do que o lucro contábil apurado</h4>
                <p className="text-gray-700 leading-relaxed">
                  Se você distribui R$ 50.000 mas o lucro contábil foi apenas R$ 30.000, os R$ 20.000 excedentes <strong>não são isentos</strong>. 
                  A Receita Federal pode considerar esse excesso como <strong>pró-labore disfarçado</strong> e cobrar INSS (11% + 20% patronal) + IRPF.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">❌ Erro 3: Não pagar pró-labore para "economizar", só distribuir lucros</h4>
                <p className="text-gray-700 leading-relaxed">
                  Sócios que trabalham na empresa <strong>precisam</strong> receber pró-labore — é obrigatório por lei. Distribuir apenas lucros 
                  sem pró-labore pode gerar: <strong>(1)</strong> Autuação do INSS por sonegação de contribuições, <strong>(2)</strong> Perda de 
                  aposentadoria e benefícios previdenciários, <strong>(3)</strong> Questionamento da Receita sobre distribuição disfarçada.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">❌ Erro 4: Confundir "caixa disponível" com "lucro contábil"</h4>
                <p className="text-gray-700 leading-relaxed">
                  Ter R$ 100k no caixa não significa que você tem R$ 100k de lucro distribuível. O lucro contábil considera 
                  <strong>depreciação, provisões, reservas e outros ajustes</strong> que não são movimentações de caixa. 
                  Você pode ter muito caixa e pouco lucro (ou vice-versa). Só o contador pode apurar o lucro distribuível corretamente.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">❌ Erro 5: Não fazer recibo ou comprovante de distribuição</h4>
                <p className="text-gray-700 leading-relaxed">
                  Toda distribuição de lucros precisa ter <strong>comprovante formal</strong> (recibo de distribuição de lucros) assinado pelos sócios, 
                  indicando valor, data e base de cálculo. Sem esse documento, a Receita pode questionar a natureza do pagamento na fiscalização, 
                  e você terá dificuldade para comprovar que foi distribuição isenta e não pró-labore tributável.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Perguntas Frequentes sobre Distribuição de Lucros</h3>

            <div className="space-y-5">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">1. Posso distribuir lucros mensalmente ou só no final do ano?</h4>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Pode distribuir mensalmente</strong>, desde que haja lucro contábil apurado naquele período (mensal, trimestral ou anual). 
                  Muitas empresas fazem distribuições mensais baseadas em "antecipação de lucros estimados", com ajuste no final do exercício 
                  quando o balanço anual é fechado. Porém, se não houver lucro efetivo ao final, será necessário estornar e pagar impostos.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">2. Empresas no Simples Nacional podem distribuir lucros isentos?</h4>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Sim!</strong> A isenção vale para <strong>todos os regimes</strong> (Simples, Presumido, Real). 
                  A diferença é que no Simples Nacional a contabilidade completa <strong>não é obrigatória</strong> — mas para fazer distribuição 
                  isenta de forma segura, é <strong>altamente recomendado</strong> ter contabilidade regular que comprove o lucro.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">3. Como declaro distribuição de lucros no Imposto de Renda pessoa física?</h4>
                <p className="text-gray-700 leading-relaxed">
                  Você deve declarar na ficha <strong>"Rendimentos Isentos e Não Tributáveis"</strong>, linha 05 (Lucros e dividendos recebidos). 
                  Informe o CNPJ da empresa pagadora e o valor total recebido no ano. Não há imposto a pagar, mas a informação deve constar na declaração.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">4. Preciso pagar algum imposto sobre distribuição de lucros?</h4>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Não.</strong> Se o lucro for contabilmente comprovado, a distribuição é <strong>totalmente isenta</strong> de 
                  Imposto de Renda (IR) e não tem incidência de INSS. Essa é a grande vantagem da distribuição de lucros.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">5. Posso distribuir 100% do lucro ou preciso deixar reserva?</h4>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Empresas Limitadas:</strong> podem distribuir 100% do lucro (não há obrigação de reserva legal, a menos que previsto no contrato social). 
                  <strong>Sociedades Anônimas (S.A.):</strong> são obrigadas a fazer Reserva Legal de 5% do lucro anual até atingir 20% do capital social.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">6. O que acontece se eu distribuir "lucros" mas a empresa tiver prejuízo?</h4>
                <p className="text-gray-700 leading-relaxed">
                  Se a empresa teve <strong>prejuízo contábil</strong> no período e você distribuiu valores aos sócios, 
                  a Receita Federal considerará isso como <strong>pró-labore disfarçado</strong> ou retirada não justificada. 
                  Você terá que pagar IR + INSS sobre esses valores, com juros e multa. Por isso é fundamental ter contabilidade em dia.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Legislação da Distribuição de Lucros</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                <strong>Lei 9.249/1995 (Art. 10):</strong> Estabelece a isenção de Imposto de Renda sobre lucros e dividendos distribuídos 
                por pessoas jurídicas a partir de janeiro de 1996, para lucros apurados com base no lucro real, presumido ou arbitrado.
              </li>
              <li>
                <strong>Lei 8.981/1995:</strong> Regulamenta a tributação das pessoas jurídicas e define as condições para distribuição de lucros.
              </li>
              <li>
                <strong>Lei 6.404/1976 (Lei das S.A., Art. 189 e 201):</strong> Define regras para apuração de lucros e reserva legal obrigatória 
                de 5% para Sociedades Anônimas.
              </li>
              <li>
                <strong>Código Civil (Lei 10.406/2002, Art. 1.007 e 1.008):</strong> Regula a distribuição de lucros em Sociedades Limitadas, 
                permitindo distribuição proporcional às quotas de cada sócio.
              </li>
              <li>
                <strong>Instrução Normativa RFB 1.700/2017:</strong> Detalha procedimentos de apuração e comprovação de lucros para fins de isenção.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Conclusão: Use Distribuição de Lucros com Inteligência e Segurança</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              A distribuição de lucros é uma das ferramentas mais poderosas para otimização tributária no Brasil — mas só funciona 
              <strong>se feita corretamente</strong>. Não adianta simplesmente retirar dinheiro do caixa e chamar de "lucro isento". 
              É preciso ter <strong>contabilidade regular</strong>, lucro contábil comprovado, recibos formais e equilíbrio entre pró-labore e lucros.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Use a <strong>Calculadora de Distribuição de Lucros</strong> acima para simular diferentes estratégias: veja quanto você paga de impostos 
              na situação atual, quanto economizaria com a estratégia otimizada, e qual o impacto no Fator R (se aplicável). 
              Compare as três estratégias (Otimizada, Máxima Isenção, Equilibrada) e descubra qual faz mais sentido para o seu perfil.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Lembre-se: <strong>o objetivo não é pagar zero impostos</strong> (isso pode ser arriscado e prejudicar sua aposentadoria), 
              mas sim encontrar o <strong>equilíbrio inteligente</strong> entre tributação, previdência, conformidade fiscal e retirada líquida. 
              Consulte sempre seu contador para validar os valores e manter tudo dentro da legalidade.
            </p>
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl p-6 text-center">
              <h4 className="text-2xl font-bold mb-3">💰 Otimize Sua Retirada Agora</h4>
              <p className="text-pink-100 mb-4">
                Descubra quanto você pode economizar combinando pró-labore e distribuição de lucros de forma estratégica.
              </p>
              <a 
                href="#top" 
                className="inline-block bg-white text-pink-600 px-8 py-3 rounded-lg font-bold hover:bg-pink-50 transition shadow-lg"
              >
                Calcular Estratégia Ideal
              </a>
            </div>
          </section>
        </article>

      </div>
    </div>
  );
}

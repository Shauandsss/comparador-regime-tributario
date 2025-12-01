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
    const proLaborePorSocio = dados.proLaboreAtual / dados.numeroSocios;

    // Estratégia 1: Otimizada para Fator R (manter/melhorar Fator R)
    const fatorRNecessario = 0.28;
    const folhaNecessaria = dados.faturamentoMensal * fatorRNecessario;
    const proLaboreOtimizado = Math.max(
      folhaNecessaria / dados.numeroSocios,
      2000 // mínimo razoável
    );
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
    const otimizada = {
      ...calcularImpostos(proLaboreOtimizado, distribuicaoOtimizada),
      proLaborePorSocio: proLaboreOtimizado,
      distribuicao: distribuicaoOtimizada,
      fatorRResultante: ((proLaboreOtimizado * dados.numeroSocios * 12) / (dados.faturamentoMensal * 12)) * 100
    };

    const maximaIsencao = {
      ...calcularImpostos(proLaboreMinimo, distribuicaoMaxima),
      proLaborePorSocio: proLaboreMinimo,
      distribuicao: distribuicaoMaxima,
      fatorRResultante: ((proLaboreMinimo * dados.numeroSocios * 12) / (dados.faturamentoMensal * 12)) * 100
    };

    const equilibrada = {
      ...calcularImpostos(proLaboreEquilibrado, distribuicaoEquilibrada),
      proLaborePorSocio: proLaboreEquilibrado,
      distribuicao: distribuicaoEquilibrada,
      fatorRResultante: ((proLaboreEquilibrado * dados.numeroSocios * 12) / (dados.faturamentoMensal * 12)) * 100
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

      </div>
    </div>
  );
}

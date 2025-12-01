import { useState, useMemo, useEffect, useRef } from 'react';
import * as d3 from 'd3';

/**
 * Planejador Tributário Visual
 * Sliders interativos para testar cenários tributários em tempo real
 */
export default function PlanejadorTributario() {
  const [valores, setValores] = useState({
    faturamento: 300000,
    folha: 60000,
    despesas: 100000,
    atividade: 'servicos'
  });

  const graficoRef = useRef(null);

  // Tabelas do Simples Nacional
  const tabelasSimples = {
    I: [
      { limite: 180000, aliquota: 4.0, deducao: 0 },
      { limite: 360000, aliquota: 7.3, deducao: 5940 },
      { limite: 720000, aliquota: 9.5, deducao: 13860 },
      { limite: 1800000, aliquota: 10.7, deducao: 22500 },
      { limite: 3600000, aliquota: 14.3, deducao: 87300 },
      { limite: 4800000, aliquota: 19.0, deducao: 378000 }
    ],
    III: [
      { limite: 180000, aliquota: 6.0, deducao: 0 },
      { limite: 360000, aliquota: 11.2, deducao: 9360 },
      { limite: 720000, aliquota: 13.5, deducao: 17640 },
      { limite: 1800000, aliquota: 16.0, deducao: 35640 },
      { limite: 3600000, aliquota: 21.0, deducao: 125640 },
      { limite: 4800000, aliquota: 33.0, deducao: 648000 }
    ],
    V: [
      { limite: 180000, aliquota: 15.5, deducao: 0 },
      { limite: 360000, aliquota: 18.0, deducao: 4500 },
      { limite: 720000, aliquota: 19.5, deducao: 9900 },
      { limite: 1800000, aliquota: 20.5, deducao: 17100 },
      { limite: 3600000, aliquota: 23.0, deducao: 62100 },
      { limite: 4800000, aliquota: 30.5, deducao: 540000 }
    ]
  };

  // Presunção do Lucro Presumido
  const presuncoes = {
    comercio: 0.08,
    industria: 0.08,
    servicos: 0.32,
    transporte: 0.16
  };

  // Formatar moeda
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(valor);
  };

  // Calcular Simples Nacional
  const calcularSimples = (rbt12, folha12, atividade) => {
    if (rbt12 > 4800000) {
      return { elegivel: false, erro: 'Excede limite do Simples' };
    }

    // Determinar anexo
    let anexo = 'I';
    if (atividade === 'servicos') {
      const fatorR = folha12 / rbt12;
      anexo = fatorR >= 0.28 ? 'III' : 'V';
    } else if (atividade === 'comercio') {
      anexo = 'I';
    }

    const tabela = tabelasSimples[anexo];
    const faixa = tabela.find(f => rbt12 <= f.limite) || tabela[tabela.length - 1];
    const aliquotaEfetiva = ((rbt12 * faixa.aliquota / 100) - faixa.deducao) / rbt12 * 100;
    const tributos = rbt12 * (aliquotaEfetiva / 100);

    return {
      elegivel: true,
      anexo,
      aliquotaNominal: faixa.aliquota,
      aliquotaEfetiva,
      tributos,
      fatorR: atividade === 'servicos' ? (folha12 / rbt12) : null
    };
  };

  // Calcular Lucro Presumido
  const calcularPresumido = (receita, atividade) => {
    const presuncao = presuncoes[atividade] || 0.32;
    const baseIRPJ = receita * presuncao;
    const baseCSLL = receita * presuncao;

    const irpj = baseIRPJ * 0.15;
    const adicionalIR = baseIRPJ > 60000 ? (baseIRPJ - 60000) * 0.10 : 0;
    const csll = baseCSLL * 0.09;
    const pis = receita * 0.0065;
    const cofins = receita * 0.03;

    const tributos = irpj + adicionalIR + csll + pis + cofins;
    const aliquotaEfetiva = (tributos / receita) * 100;

    return {
      irpj,
      adicionalIR,
      csll,
      pis,
      cofins,
      tributos,
      aliquotaEfetiva,
      presuncao: presuncao * 100
    };
  };

  // Calcular Lucro Real
  const calcularReal = (receita, despesas, folha) => {
    const despesasTotais = despesas + folha;
    const lucroContabil = receita - despesasTotais;

    // PIS/COFINS não cumulativo
    const pisDebito = receita * 0.0165;
    const cofinsDebito = receita * 0.076;
    
    // Créditos sobre despesas (aproximado)
    const baseCreditos = despesas * 0.5; // 50% das despesas geram crédito
    const pisCredito = baseCreditos * 0.0165;
    const cofinsCredito = baseCreditos * 0.076;
    
    const pisLiquido = Math.max(pisDebito - pisCredito, 0);
    const cofinsLiquido = Math.max(cofinsDebito - cofinsCredito, 0);

    // IRPJ e CSLL
    let irpj = 0;
    let adicionalIR = 0;
    let csll = 0;

    if (lucroContabil > 0) {
      irpj = lucroContabil * 0.15;
      adicionalIR = lucroContabil > 240000 ? (lucroContabil - 240000) * 0.10 : 0;
      csll = lucroContabil * 0.09;
    }

    const tributos = irpj + adicionalIR + csll + pisLiquido + cofinsLiquido;
    const aliquotaEfetiva = receita > 0 ? (tributos / receita) * 100 : 0;

    return {
      lucroContabil,
      irpj,
      adicionalIR,
      csll,
      pisLiquido,
      cofinsLiquido,
      tributos,
      aliquotaEfetiva,
      prejuizo: lucroContabil <= 0
    };
  };

  // Resultados calculados
  const resultados = useMemo(() => {
    const { faturamento, folha, despesas, atividade } = valores;

    const simples = calcularSimples(faturamento, folha, atividade);
    const presumido = calcularPresumido(faturamento, atividade);
    const real = calcularReal(faturamento, despesas, folha);

    // Determinar melhor regime
    const regimesValidos = [];
    if (simples.elegivel) regimesValidos.push({ nome: 'simples', tributos: simples.tributos });
    regimesValidos.push({ nome: 'presumido', tributos: presumido.tributos });
    regimesValidos.push({ nome: 'real', tributos: real.tributos });

    const melhor = regimesValidos.reduce((min, r) => r.tributos < min.tributos ? r : min);

    return { simples, presumido, real, melhor };
  }, [valores]);

  // Desenhar gráfico
  useEffect(() => {
    if (!graficoRef.current) return;

    const container = graficoRef.current;
    d3.select(container).selectAll('*').remove();

    const dados = [
      { 
        regime: 'Simples', 
        tributos: resultados.simples.elegivel ? resultados.simples.tributos : null,
        aliquota: resultados.simples.elegivel ? resultados.simples.aliquotaEfetiva : null,
        cor: '#3b82f6'
      },
      { 
        regime: 'Presumido', 
        tributos: resultados.presumido.tributos,
        aliquota: resultados.presumido.aliquotaEfetiva,
        cor: '#10b981'
      },
      { 
        regime: 'Real', 
        tributos: resultados.real.tributos,
        aliquota: resultados.real.aliquotaEfetiva,
        cor: '#8b5cf6'
      }
    ].filter(d => d.tributos !== null && d.tributos >= 0);

    const width = container.clientWidth;
    const height = 280;
    const margin = { top: 30, right: 30, bottom: 50, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Escalas
    const x = d3.scaleBand()
      .domain(dados.map(d => d.regime))
      .range([0, innerWidth])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(dados, d => d.tributos) * 1.2])
      .range([innerHeight, 0]);

    // Eixos
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '12px');

    g.append('g')
      .call(d3.axisLeft(y).tickFormat(d => `R$${d/1000}k`))
      .selectAll('text')
      .style('font-size', '11px');

    // Barras
    const bars = g.selectAll('.bar')
      .data(dados)
      .enter()
      .append('g')
      .attr('class', 'bar');

    bars.append('rect')
      .attr('x', d => x(d.regime))
      .attr('y', d => y(d.tributos))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.tributos))
      .attr('fill', d => d.cor)
      .attr('rx', 6)
      .attr('opacity', d => d.regime.toLowerCase() === resultados.melhor.nome ? 1 : 0.6);

    // Labels nas barras
    bars.append('text')
      .attr('x', d => x(d.regime) + x.bandwidth() / 2)
      .attr('y', d => y(d.tributos) - 8)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#374151')
      .text(d => `${d.aliquota.toFixed(1)}%`);

    // Indicador do melhor
    const melhorDado = dados.find(d => d.regime.toLowerCase() === resultados.melhor.nome);
    if (melhorDado) {
      g.append('text')
        .attr('x', x(melhorDado.regime) + x.bandwidth() / 2)
        .attr('y', y(melhorDado.tributos) - 25)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .text('🏆');
    }

  }, [resultados]);

  // Atualizar slider
  const handleSlider = (campo, valor) => {
    setValores(prev => ({ ...prev, [campo]: parseInt(valor) }));
  };

  // Config dos sliders
  const slidersConfig = [
    { 
      campo: 'faturamento', 
      label: 'Faturamento Anual', 
      min: 60000, 
      max: 5000000, 
      step: 10000,
      emoji: '💰'
    },
    { 
      campo: 'folha', 
      label: 'Folha de Pagamento Anual', 
      min: 0, 
      max: 1500000, 
      step: 5000,
      emoji: '👥'
    },
    { 
      campo: 'despesas', 
      label: 'Despesas Dedutíveis Anual', 
      min: 0, 
      max: 2000000, 
      step: 10000,
      emoji: '📋'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎯 Planejador Tributário Visual
        </h1>
        <p className="text-gray-600">
          Arraste os sliders e veja o impacto em tempo real nos três regimes tributários.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controles */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">⚙️ Ajuste os Valores</h2>

            {/* Atividade */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏢 Tipo de Atividade
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'comercio', label: 'Comércio' },
                  { value: 'servicos', label: 'Serviços' },
                  { value: 'industria', label: 'Indústria' },
                  { value: 'transporte', label: 'Transporte' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setValores(prev => ({ ...prev, atividade: opt.value }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      valores.atividade === opt.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            {slidersConfig.map(slider => (
              <div key={slider.campo} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    {slider.emoji} {slider.label}
                  </label>
                  <span className="text-lg font-bold text-indigo-600">
                    {formatarMoeda(valores[slider.campo])}
                  </span>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={valores[slider.campo]}
                  onChange={(e) => handleSlider(slider.campo, e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{formatarMoeda(slider.min)}</span>
                  <span>{formatarMoeda(slider.max)}</span>
                </div>
              </div>
            ))}

            {/* Indicadores Rápidos */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Margem Operacional</p>
                <p className="text-lg font-bold text-gray-900">
                  {((valores.faturamento - valores.despesas - valores.folha) / valores.faturamento * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Fator R</p>
                <p className="text-lg font-bold text-gray-900">
                  {((valores.folha / valores.faturamento) * 100).toFixed(1)}%
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    {valores.folha / valores.faturamento >= 0.28 ? '(Anexo III)' : '(Anexo V)'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Gráfico */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">📊 Comparativo Visual</h3>
            <div ref={graficoRef} className="w-full" />
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-4">
          {/* Melhor Regime */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">🏆 Melhor Regime</p>
                <h2 className="text-3xl font-bold capitalize">
                  {resultados.melhor.nome === 'simples' ? 'Simples Nacional' :
                   resultados.melhor.nome === 'presumido' ? 'Lucro Presumido' : 'Lucro Real'}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm">Economia vs 2º lugar</p>
                <p className="text-2xl font-bold">
                  {formatarMoeda(
                    Math.min(
                      resultados.simples.elegivel ? resultados.simples.tributos : Infinity,
                      resultados.presumido.tributos,
                      resultados.real.tributos
                    ) - resultados.melhor.tributos === 0 
                      ? (() => {
                          const tributos = [
                            resultados.simples.elegivel ? resultados.simples.tributos : Infinity,
                            resultados.presumido.tributos,
                            resultados.real.tributos
                          ].sort((a, b) => a - b);
                          return tributos[1] - tributos[0];
                        })()
                      : 0
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Card Simples */}
          <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
            resultados.simples.elegivel 
              ? resultados.melhor.nome === 'simples' ? 'border-green-500' : 'border-blue-500'
              : 'border-gray-300'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  Simples Nacional
                  {resultados.melhor.nome === 'simples' && <span className="ml-2">🏆</span>}
                </h3>
                {resultados.simples.elegivel ? (
                  <p className="text-sm text-gray-500">Anexo {resultados.simples.anexo}</p>
                ) : (
                  <p className="text-sm text-red-500">Não elegível</p>
                )}
              </div>
              {resultados.simples.elegivel && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatarMoeda(resultados.simples.tributos)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {resultados.simples.aliquotaEfetiva.toFixed(2)}% efetiva
                  </p>
                </div>
              )}
            </div>
            
            {resultados.simples.elegivel && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Alíq. Nominal:</span>
                  <span className="ml-2 font-medium">{resultados.simples.aliquotaNominal}%</span>
                </div>
                {resultados.simples.fatorR !== null && (
                  <div>
                    <span className="text-gray-500">Fator R:</span>
                    <span className={`ml-2 font-medium ${resultados.simples.fatorR >= 0.28 ? 'text-green-600' : 'text-amber-600'}`}>
                      {(resultados.simples.fatorR * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            )}

            {!resultados.simples.elegivel && (
              <p className="text-gray-500 text-sm">
                Faturamento excede o limite de R$ 4.800.000/ano
              </p>
            )}
          </div>

          {/* Card Presumido */}
          <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
            resultados.melhor.nome === 'presumido' ? 'border-green-500' : 'border-emerald-500'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  Lucro Presumido
                  {resultados.melhor.nome === 'presumido' && <span className="ml-2">🏆</span>}
                </h3>
                <p className="text-sm text-gray-500">Presunção {resultados.presumido.presuncao}%</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">
                  {formatarMoeda(resultados.presumido.tributos)}
                </p>
                <p className="text-sm text-gray-500">
                  {resultados.presumido.aliquotaEfetiva.toFixed(2)}% efetiva
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">IRPJ:</span>
                <span className="font-medium">{formatarMoeda(resultados.presumido.irpj)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">CSLL:</span>
                <span className="font-medium">{formatarMoeda(resultados.presumido.csll)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">PIS:</span>
                <span className="font-medium">{formatarMoeda(resultados.presumido.pis)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">COFINS:</span>
                <span className="font-medium">{formatarMoeda(resultados.presumido.cofins)}</span>
              </div>
            </div>
          </div>

          {/* Card Lucro Real */}
          <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
            resultados.melhor.nome === 'real' ? 'border-green-500' : 'border-purple-500'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  Lucro Real
                  {resultados.melhor.nome === 'real' && <span className="ml-2">🏆</span>}
                </h3>
                <p className="text-sm text-gray-500">
                  Lucro Contábil: {formatarMoeda(resultados.real.lucroContabil)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">
                  {formatarMoeda(resultados.real.tributos)}
                </p>
                <p className="text-sm text-gray-500">
                  {resultados.real.aliquotaEfetiva.toFixed(2)}% efetiva
                </p>
              </div>
            </div>
            
            {resultados.real.prejuizo ? (
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="text-amber-700 text-sm">
                  ⚠️ Operação com prejuízo contábil - não há IRPJ/CSLL a pagar
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">IRPJ:</span>
                  <span className="font-medium">{formatarMoeda(resultados.real.irpj)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">CSLL:</span>
                  <span className="font-medium">{formatarMoeda(resultados.real.csll)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">PIS líq.:</span>
                  <span className="font-medium">{formatarMoeda(resultados.real.pisLiquido)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">COFINS líq.:</span>
                  <span className="font-medium">{formatarMoeda(resultados.real.cofinsLiquido)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Dica Contextual */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Dica</h4>
            <p className="text-blue-700 text-sm">
              {valores.atividade === 'servicos' && valores.folha / valores.faturamento < 0.28 ? (
                <>
                  Aumente a folha de pagamento para {formatarMoeda(valores.faturamento * 0.28)} 
                  para atingir o Fator R de 28% e migrar para o Anexo III (alíquotas menores).
                </>
              ) : resultados.melhor.nome === 'real' ? (
                <>
                  O Lucro Real está mais vantajoso devido às despesas dedutíveis elevadas 
                  e aos créditos de PIS/COFINS. Mantenha sua contabilidade organizada!
                </>
              ) : resultados.melhor.nome === 'presumido' ? (
                <>
                  O Lucro Presumido é ideal para empresas com margens altas e poucas despesas 
                  dedutíveis. Considere-o se sua margem real for maior que {presuncoes[valores.atividade] * 100}%.
                </>
              ) : (
                <>
                  O Simples Nacional está vantajoso para seu perfil. Fique atento ao 
                  limite de R$ 4.800.000/ano e ao Fator R se for prestador de serviços.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Tabela Resumo */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📋 Resumo Comparativo</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Regime</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Tributos Anuais</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Tributos Mensais</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Alíquota Efetiva</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">vs Melhor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { nome: 'Simples Nacional', dados: resultados.simples, cor: 'blue' },
                { nome: 'Lucro Presumido', dados: resultados.presumido, cor: 'emerald' },
                { nome: 'Lucro Real', dados: resultados.real, cor: 'purple' }
              ].map(({ nome, dados, cor }) => {
                const tributos = dados.elegivel === false ? null : dados.tributos;
                const diff = tributos !== null ? tributos - resultados.melhor.tributos : null;
                const isMelhor = nome.toLowerCase().includes(resultados.melhor.nome);
                
                return (
                  <tr key={nome} className={isMelhor ? 'bg-green-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3">
                      <span className={`font-medium text-${cor}-600`}>{nome}</span>
                      {isMelhor && <span className="ml-2">🏆</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {tributos !== null ? formatarMoeda(tributos) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {tributos !== null ? formatarMoeda(tributos / 12) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {dados.aliquotaEfetiva !== undefined ? `${dados.aliquotaEfetiva.toFixed(2)}%` : '—'}
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {diff !== null && diff !== 0 ? `+${formatarMoeda(diff)}` : diff === 0 ? '—' : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

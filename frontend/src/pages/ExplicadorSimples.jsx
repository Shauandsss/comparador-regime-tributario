import { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';

/**
 * Tabelas do Simples Nacional (LC 123/2006 - Atualizada)
 * Alíquotas nominais e parcelas dedutíveis por anexo e faixa de RBT12
 */
const tabelasAnexos = {
  I: {
    nome: 'Anexo I - Comércio',
    cor: '#3B82F6',
    corClara: '#DBEAFE',
    faixas: [
      { limite: 180000, aliquota: 4.0, deducao: 0 },
      { limite: 360000, aliquota: 7.3, deducao: 5940 },
      { limite: 720000, aliquota: 9.5, deducao: 13860 },
      { limite: 1800000, aliquota: 10.7, deducao: 22500 },
      { limite: 3600000, aliquota: 14.3, deducao: 87300 },
      { limite: 4800000, aliquota: 19.0, deducao: 378000 }
    ]
  },
  II: {
    nome: 'Anexo II - Indústria',
    cor: '#10B981',
    corClara: '#D1FAE5',
    faixas: [
      { limite: 180000, aliquota: 4.5, deducao: 0 },
      { limite: 360000, aliquota: 7.8, deducao: 5940 },
      { limite: 720000, aliquota: 10.0, deducao: 13860 },
      { limite: 1800000, aliquota: 11.2, deducao: 22500 },
      { limite: 3600000, aliquota: 14.7, deducao: 85500 },
      { limite: 4800000, aliquota: 30.0, deducao: 720000 }
    ]
  },
  III: {
    nome: 'Anexo III - Serviços',
    cor: '#F59E0B',
    corClara: '#FEF3C7',
    faixas: [
      { limite: 180000, aliquota: 6.0, deducao: 0 },
      { limite: 360000, aliquota: 11.2, deducao: 9360 },
      { limite: 720000, aliquota: 13.5, deducao: 17640 },
      { limite: 1800000, aliquota: 16.0, deducao: 35640 },
      { limite: 3600000, aliquota: 21.0, deducao: 125640 },
      { limite: 4800000, aliquota: 33.0, deducao: 648000 }
    ]
  },
  IV: {
    nome: 'Anexo IV - Serviços (CPP à parte)',
    cor: '#F97316',
    corClara: '#FFEDD5',
    faixas: [
      { limite: 180000, aliquota: 4.5, deducao: 0 },
      { limite: 360000, aliquota: 9.0, deducao: 8100 },
      { limite: 720000, aliquota: 10.2, deducao: 12420 },
      { limite: 1800000, aliquota: 14.0, deducao: 39780 },
      { limite: 3600000, aliquota: 22.0, deducao: 183780 },
      { limite: 4800000, aliquota: 33.0, deducao: 828000 }
    ]
  },
  V: {
    nome: 'Anexo V - Serviços Intelectuais',
    cor: '#EF4444',
    corClara: '#FEE2E2',
    faixas: [
      { limite: 180000, aliquota: 15.5, deducao: 0 },
      { limite: 360000, aliquota: 18.0, deducao: 4500 },
      { limite: 720000, aliquota: 19.5, deducao: 9900 },
      { limite: 1800000, aliquota: 20.5, deducao: 17100 },
      { limite: 3600000, aliquota: 23.0, deducao: 62100 },
      { limite: 4800000, aliquota: 30.5, deducao: 540000 }
    ]
  }
};

/**
 * Calcula a alíquota efetiva do Simples Nacional
 */
function calcularAliquotaEfetiva(rbt12, anexo) {
  const tabela = tabelasAnexos[anexo];
  if (!tabela || rbt12 <= 0) return 0;

  const faixa = tabela.faixas.find(f => rbt12 <= f.limite);
  if (!faixa) return null;

  const aliquotaEfetiva = ((rbt12 * (faixa.aliquota / 100)) - faixa.deducao) / rbt12 * 100;
  return Math.max(aliquotaEfetiva, 0);
}

/**
 * Encontra a faixa correspondente ao RBT12
 */
function encontrarFaixa(rbt12, anexo) {
  const tabela = tabelasAnexos[anexo];
  if (!tabela) return null;

  let faixaAnterior = 0;
  for (let i = 0; i < tabela.faixas.length; i++) {
    const faixa = tabela.faixas[i];
    if (rbt12 <= faixa.limite) {
      return {
        numero: i + 1,
        limiteInferior: faixaAnterior,
        limiteSuperior: faixa.limite,
        aliquotaNominal: faixa.aliquota,
        parcelaRedutora: faixa.deducao
      };
    }
    faixaAnterior = faixa.limite;
  }
  return null;
}

/**
 * Formata valor monetário
 */
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}

/**
 * Componente principal - Explicador Visual do Simples Nacional
 */
export default function ExplicadorSimples() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  
  const [anexosSelecionados, setAnexosSelecionados] = useState(['I', 'III', 'V']);
  const [pontoSelecionado, setPontoSelecionado] = useState(null);
  const [rbt12Simulacao, setRbt12Simulacao] = useState(500000);
  const [dimensoes, setDimensoes] = useState({ width: 800, height: 500 });

  // Gerar dados para o gráfico
  const gerarDadosGrafico = useCallback(() => {
    const dados = [];
    const pontos = 100;
    const maxRbt12 = 4800000;

    for (let i = 0; i <= pontos; i++) {
      const rbt12 = (maxRbt12 / pontos) * i;
      if (rbt12 === 0) continue;

      anexosSelecionados.forEach(anexo => {
        const aliquota = calcularAliquotaEfetiva(rbt12, anexo);
        if (aliquota !== null) {
          dados.push({
            rbt12,
            aliquota,
            anexo,
            cor: tabelasAnexos[anexo].cor
          });
        }
      });
    }

    return dados;
  }, [anexosSelecionados]);

  // Pontos de mudança de faixa para destaque
  const gerarPontosFaixa = useCallback(() => {
    const pontos = [];
    const limitesFaixa = [180000, 360000, 720000, 1800000, 3600000, 4800000];

    anexosSelecionados.forEach(anexo => {
      limitesFaixa.forEach(limite => {
        const aliquota = calcularAliquotaEfetiva(limite, anexo);
        if (aliquota !== null) {
          const faixa = encontrarFaixa(limite, anexo);
          pontos.push({
            rbt12: limite,
            aliquota,
            anexo,
            cor: tabelasAnexos[anexo].cor,
            faixa
          });
        }
      });
    });

    return pontos;
  }, [anexosSelecionados]);

  // Atualizar dimensões responsivamente
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = Math.min(containerRef.current.offsetWidth - 40, 1000);
        setDimensoes({
          width: Math.max(width, 300),
          height: Math.max(width * 0.5, 300)
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desenhar gráfico com D3
  useEffect(() => {
    if (!svgRef.current || anexosSelecionados.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 70 };
    const width = dimensoes.width - margin.left - margin.right;
    const height = dimensoes.height - margin.top - margin.bottom;

    const g = svg
      .attr('width', dimensoes.width)
      .attr('height', dimensoes.height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Escalas
    const xScale = d3.scaleLinear()
      .domain([0, 4800000])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 35])
      .range([height, 0]);

    // Áreas de faixas (background)
    const faixasLimites = [0, 180000, 360000, 720000, 1800000, 3600000, 4800000];
    faixasLimites.forEach((limite, i) => {
      if (i < faixasLimites.length - 1) {
        g.append('rect')
          .attr('x', xScale(limite))
          .attr('y', 0)
          .attr('width', xScale(faixasLimites[i + 1]) - xScale(limite))
          .attr('height', height)
          .attr('fill', i % 2 === 0 ? '#f8fafc' : '#f1f5f9')
          .attr('opacity', 0.5);
      }
    });

    // Grid horizontal
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yScale.ticks(7))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#e2e8f0')
      .attr('stroke-dasharray', '3,3');

    // Linhas verticais de faixa
    faixasLimites.slice(1, -1).forEach(limite => {
      g.append('line')
        .attr('x1', xScale(limite))
        .attr('x2', xScale(limite))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#cbd5e1')
        .attr('stroke-dasharray', '5,5')
        .attr('stroke-width', 1);
    });

    // Gerar e desenhar linhas por anexo
    const dados = gerarDadosGrafico();

    anexosSelecionados.forEach(anexo => {
      const dadosAnexo = dados.filter(d => d.anexo === anexo);
      
      const line = d3.line()
        .x(d => xScale(d.rbt12))
        .y(d => yScale(d.aliquota))
        .curve(d3.curveMonotoneX);

      // Área sob a curva
      const area = d3.area()
        .x(d => xScale(d.rbt12))
        .y0(height)
        .y1(d => yScale(d.aliquota))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(dadosAnexo)
        .attr('fill', tabelasAnexos[anexo].corClara)
        .attr('opacity', 0.3)
        .attr('d', area);

      // Linha principal
      g.append('path')
        .datum(dadosAnexo)
        .attr('fill', 'none')
        .attr('stroke', tabelasAnexos[anexo].cor)
        .attr('stroke-width', 3)
        .attr('d', line);
    });

    // Pontos de mudança de faixa (clicáveis)
    const pontosFaixa = gerarPontosFaixa();
    
    g.selectAll('.ponto-faixa')
      .data(pontosFaixa)
      .enter()
      .append('circle')
      .attr('class', 'ponto-faixa')
      .attr('cx', d => xScale(d.rbt12))
      .attr('cy', d => yScale(d.aliquota))
      .attr('r', 8)
      .attr('fill', d => d.cor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 12);

        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style('opacity', 1)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div class="font-bold text-lg mb-2">${tabelasAnexos[d.anexo].nome}</div>
            <div class="space-y-1">
              <div><span class="text-gray-500">RBT12:</span> ${formatarMoeda(d.rbt12)}</div>
              <div><span class="text-gray-500">Faixa:</span> ${d.faixa.numero}ª</div>
              <div><span class="text-gray-500">Alíq. Nominal:</span> ${d.faixa.aliquotaNominal}%</div>
              <div><span class="text-gray-500">Parcela Redutora:</span> ${formatarMoeda(d.faixa.parcelaRedutora)}</div>
              <div class="pt-2 border-t mt-2">
                <span class="font-bold text-lg" style="color: ${d.cor}">
                  Alíq. Efetiva: ${d.aliquota.toFixed(2)}%
                </span>
              </div>
            </div>
          `);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8);

        d3.select(tooltipRef.current)
          .style('opacity', 0);
      })
      .on('click', function(event, d) {
        setPontoSelecionado(d);
      });

    // Linha vertical de simulação
    if (rbt12Simulacao > 0) {
      g.append('line')
        .attr('x1', xScale(rbt12Simulacao))
        .attr('x2', xScale(rbt12Simulacao))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#6366f1')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '8,4');

      // Pontos na linha de simulação
      anexosSelecionados.forEach(anexo => {
        const aliquota = calcularAliquotaEfetiva(rbt12Simulacao, anexo);
        if (aliquota !== null) {
          g.append('circle')
            .attr('cx', xScale(rbt12Simulacao))
            .attr('cy', yScale(aliquota))
            .attr('r', 6)
            .attr('fill', '#6366f1')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);
        }
      });
    }

    // Eixo X
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d => {
        if (d >= 1000000) return `${d / 1000000}M`;
        if (d >= 1000) return `${d / 1000}k`;
        return d;
      })
      .tickValues([0, 180000, 360000, 720000, 1800000, 3600000, 4800000]);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '12px')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Label eixo X
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 50)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#374151')
      .text('Receita Bruta 12 meses (RBT12)');

    // Eixo Y
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => `${d}%`)
      .ticks(7);

    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '12px');

    // Label eixo Y
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#374151')
      .text('Alíquota Efetiva (%)');

    // Título
    svg.append('text')
      .attr('x', dimensoes.width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#1f2937')
      .text('Curva de Alíquota Efetiva do Simples Nacional');

  }, [anexosSelecionados, rbt12Simulacao, dimensoes, gerarDadosGrafico, gerarPontosFaixa]);

  // Toggle anexo
  const toggleAnexo = (anexo) => {
    setAnexosSelecionados(prev => {
      if (prev.includes(anexo)) {
        return prev.filter(a => a !== anexo);
      } else {
        return [...prev, anexo];
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Explicador Visual do Simples Nacional
        </h1>
        <p className="text-gray-600">
          Visualize como a alíquota efetiva varia conforme o faturamento (RBT12) em cada anexo.
          Clique nos pontos para ver detalhes da parcela redutora.
        </p>
      </div>

      {/* Controles */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Seleção de Anexos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Anexos Exibidos
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(tabelasAnexos).map(([key, anexo]) => (
                <button
                  key={key}
                  onClick={() => toggleAnexo(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    anexosSelecionados.includes(key)
                      ? 'ring-2 ring-offset-2 shadow-md'
                      : 'opacity-50 hover:opacity-75'
                  }`}
                  style={{
                    backgroundColor: anexosSelecionados.includes(key) ? anexo.cor : '#e5e7eb',
                    color: anexosSelecionados.includes(key) ? '#fff' : '#374151',
                    ringColor: anexo.cor
                  }}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Simulação RBT12 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Simular RBT12: <span className="font-bold text-indigo-600">{formatarMoeda(rbt12Simulacao)}</span>
            </label>
            <input
              type="range"
              min="50000"
              max="4800000"
              step="50000"
              value={rbt12Simulacao}
              onChange={(e) => setRbt12Simulacao(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>R$ 50k</span>
              <span>R$ 4,8M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div 
        ref={containerRef}
        className="bg-white rounded-xl shadow-lg p-6 mb-6 overflow-x-auto"
      >
        <svg ref={svgRef} className="mx-auto"></svg>
        
        {/* Tooltip */}
        <div
          ref={tooltipRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl p-4 pointer-events-none z-50 opacity-0 transition-opacity"
          style={{ maxWidth: '300px' }}
        />
      </div>

      {/* Legenda */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legenda dos Anexos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(tabelasAnexos).map(([key, anexo]) => (
            <div 
              key={key}
              className={`p-3 rounded-lg border-2 transition-all ${
                anexosSelecionados.includes(key) ? 'opacity-100' : 'opacity-40'
              }`}
              style={{ borderColor: anexo.cor, backgroundColor: anexo.corClara }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: anexo.cor }}
                />
                <span className="font-bold">Anexo {key}</span>
              </div>
              <p className="text-xs text-gray-600">
                {anexo.nome.replace(`Anexo ${key} - `, '')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Resultados da Simulação */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 mb-6 text-white">
        <h3 className="text-xl font-bold mb-4">
          📈 Simulação para RBT12 de {formatarMoeda(rbt12Simulacao)}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(tabelasAnexos).map(([key, anexo]) => {
            const aliquota = calcularAliquotaEfetiva(rbt12Simulacao, key);
            const faixa = encontrarFaixa(rbt12Simulacao, key);
            const valorDas = rbt12Simulacao / 12 * (aliquota / 100);

            return (
              <div 
                key={key}
                className={`bg-white/10 backdrop-blur rounded-lg p-4 ${
                  anexosSelecionados.includes(key) ? 'ring-2 ring-white/50' : 'opacity-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: anexo.cor }}
                  />
                  <span className="font-bold">Anexo {key}</span>
                </div>
                <div className="text-3xl font-bold mb-1">
                  {aliquota?.toFixed(2)}%
                </div>
                <div className="text-sm opacity-80">
                  Faixa {faixa?.numero}ª
                </div>
                <div className="text-xs opacity-70 mt-2">
                  DAS mensal ≈ {formatarMoeda(valorDas)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card de Detalhes (quando um ponto é selecionado) */}
      {pontoSelecionado && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4" style={{ borderColor: pontoSelecionado.cor }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Detalhes da {pontoSelecionado.faixa.numero}ª Faixa - {tabelasAnexos[pontoSelecionado.anexo].nome}
            </h3>
            <button
              onClick={() => setPontoSelecionado(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Faixa de RBT12</p>
              <p className="text-lg font-bold text-gray-900">
                {formatarMoeda(pontoSelecionado.faixa.limiteInferior)} a {formatarMoeda(pontoSelecionado.faixa.limiteSuperior)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Alíquota Nominal</p>
              <p className="text-lg font-bold text-gray-900">
                {pontoSelecionado.faixa.aliquotaNominal}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Parcela a Deduzir</p>
              <p className="text-lg font-bold text-gray-900">
                {formatarMoeda(pontoSelecionado.faixa.parcelaRedutora)}
              </p>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: tabelasAnexos[pontoSelecionado.anexo].corClara }}>
              <p className="text-sm text-gray-500">Alíquota Efetiva</p>
              <p className="text-2xl font-bold" style={{ color: pontoSelecionado.cor }}>
                {pontoSelecionado.aliquota.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Fórmula */}
          <div className="mt-6 bg-gray-800 rounded-lg p-4 text-white">
            <p className="text-sm text-gray-400 mb-2">Fórmula da Alíquota Efetiva:</p>
            <code className="text-lg">
              Alíquota Efetiva = (RBT12 × Alíquota Nominal - Parcela Redutora) ÷ RBT12
            </code>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <code className="text-green-400">
                = ({formatarMoeda(pontoSelecionado.rbt12)} × {pontoSelecionado.faixa.aliquotaNominal}% - {formatarMoeda(pontoSelecionado.faixa.parcelaRedutora)}) ÷ {formatarMoeda(pontoSelecionado.rbt12)}
              </code>
              <br />
              <code className="text-yellow-400">
                = {pontoSelecionado.aliquota.toFixed(4)}%
              </code>
            </div>
          </div>
        </div>
      )}

      {/* Explicação */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Como Funciona a Alíquota Efetiva?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Por que existe a Parcela Redutora?</h4>
            <p className="text-gray-600 text-sm">
              A parcela redutora é um mecanismo que suaviza a transição entre faixas de tributação. 
              Sem ela, uma empresa que passasse de R$ 180.000 para R$ 180.001 teria um salto 
              abrupto na alíquota, o que seria injusto.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Como interpretar o gráfico?</h4>
            <p className="text-gray-600 text-sm">
              As curvas mostram que a alíquota efetiva aumenta gradualmente conforme o faturamento cresce. 
              Note que o Anexo V (serviços intelectuais) tem as maiores alíquotas, mas pode 
              migrar para o Anexo III se o Fator R for ≥ 28%.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm">
            <strong>⚠️ Atenção:</strong> O Anexo IV (construção, vigilância, advocacia) não inclui a 
            Contribuição Patronal Previdenciária (CPP) no DAS. Empresas neste anexo devem recolher 
            20% sobre a folha de pagamento separadamente.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';

/**
 * Comparador de Meses - Histórico Tributário
 * Guarda dados mês a mês e gera gráficos de evolução
 */
export default function HistoricoTributario() {
  const [historico, setHistorico] = useState(null);
  const [formData, setFormData] = useState({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    faturamento: '',
    regime: 'simples',
    tributosPagos: ''
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('grafico');
  const graficoRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const nomesMesesCurtos = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  // Carregar histórico ao montar
  useEffect(() => {
    carregarHistorico();
  }, []);

  // Desenhar gráfico quando dados mudarem
  useEffect(() => {
    if (historico?.registros?.length > 0 && abaAtiva === 'grafico') {
      desenharGrafico();
    }
  }, [historico, abaAtiva]);

  // Formatar valor monetário
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Carregar histórico
  const carregarHistorico = async () => {
    try {
      const response = await fetch(`${API_URL}/historico`);
      const data = await response.json();
      
      if (data.success) {
        setHistorico(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  // Salvar registro
  const salvarRegistro = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      const response = await fetch(`${API_URL}/historico`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          faturamento: parseFloat(formData.faturamento),
          tributosPagos: parseFloat(formData.tributosPagos)
        })
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          faturamento: '',
          tributosPagos: ''
        }));
        carregarHistorico();
      } else {
        setErro(data.error);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setErro('Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  // Remover registro
  const removerRegistro = async (ano, mes) => {
    if (!confirm(`Remover registro de ${nomesMeses[mes - 1]}/${ano}?`)) return;

    try {
      const response = await fetch(`${API_URL}/historico/${ano}/${mes}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        carregarHistorico();
      }
    } catch (error) {
      console.error('Erro ao remover:', error);
    }
  };

  // Desenhar gráfico D3
  const desenharGrafico = () => {
    if (!graficoRef.current || !historico?.registros?.length) return;

    // Limpar gráfico anterior
    d3.select(graficoRef.current).selectAll('*').remove();

    const dados = historico.registros;
    const container = graficoRef.current;
    const width = container.clientWidth;
    const height = 400;
    const margin = { top: 40, right: 80, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Escalas
    const x = d3.scalePoint()
      .domain(dados.map(d => `${nomesMesesCurtos[d.mes - 1]}/${d.ano}`))
      .range([0, innerWidth])
      .padding(0.5);

    const yFaturamento = d3.scaleLinear()
      .domain([0, d3.max(dados, d => d.faturamento) * 1.1])
      .range([innerHeight, 0]);

    const yTributos = d3.scaleLinear()
      .domain([0, d3.max(dados, d => d.tributosPagos) * 1.1])
      .range([innerHeight, 0]);

    // Eixos
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em')
      .attr('transform', 'rotate(-45)');

    g.append('g')
      .call(d3.axisLeft(yFaturamento).tickFormat(d => `R$${d/1000}k`))
      .append('text')
      .attr('fill', '#3b82f6')
      .attr('transform', 'rotate(-90)')
      .attr('y', -60)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .text('Faturamento');

    g.append('g')
      .attr('transform', `translate(${innerWidth},0)`)
      .call(d3.axisRight(yTributos).tickFormat(d => `R$${d/1000}k`))
      .append('text')
      .attr('fill', '#ef4444')
      .attr('transform', 'rotate(-90)')
      .attr('y', 60)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .text('Tributos');

    // Linha de faturamento
    const linhaFaturamento = d3.line()
      .x(d => x(`${nomesMesesCurtos[d.mes - 1]}/${d.ano}`))
      .y(d => yFaturamento(d.faturamento))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(dados)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', linhaFaturamento);

    // Linha de tributos
    const linhaTributos = d3.line()
      .x(d => x(`${nomesMesesCurtos[d.mes - 1]}/${d.ano}`))
      .y(d => yTributos(d.tributosPagos))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(dados)
      .attr('fill', 'none')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 3)
      .attr('d', linhaTributos);

    // Pontos de faturamento
    g.selectAll('.ponto-faturamento')
      .data(dados)
      .enter()
      .append('circle')
      .attr('class', 'ponto-faturamento')
      .attr('cx', d => x(`${nomesMesesCurtos[d.mes - 1]}/${d.ano}`))
      .attr('cy', d => yFaturamento(d.faturamento))
      .attr('r', 6)
      .attr('fill', '#3b82f6')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 8);
        showTooltip(event, d, 'faturamento');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 6);
        hideTooltip();
      });

    // Pontos de tributos
    g.selectAll('.ponto-tributos')
      .data(dados)
      .enter()
      .append('circle')
      .attr('class', 'ponto-tributos')
      .attr('cx', d => x(`${nomesMesesCurtos[d.mes - 1]}/${d.ano}`))
      .attr('cy', d => yTributos(d.tributosPagos))
      .attr('r', 6)
      .attr('fill', '#ef4444')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 8);
        showTooltip(event, d, 'tributos');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 6);
        hideTooltip();
      });

    // Legenda
    const legenda = svg.append('g')
      .attr('transform', `translate(${margin.left}, 15)`);

    legenda.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 6).attr('fill', '#3b82f6');
    legenda.append('text').attr('x', 15).attr('y', 5).text('Faturamento').style('font-size', '12px');
    legenda.append('circle').attr('cx', 120).attr('cy', 0).attr('r', 6).attr('fill', '#ef4444');
    legenda.append('text').attr('x', 135).attr('y', 5).text('Tributos').style('font-size', '12px');

    // Tooltip
    const tooltip = d3.select(container)
      .append('div')
      .attr('class', 'tooltip-historico')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'white')
      .style('border', '1px solid #ddd')
      .style('border-radius', '8px')
      .style('padding', '12px')
      .style('box-shadow', '0 4px 6px rgba(0,0,0,0.1)')
      .style('font-size', '14px')
      .style('pointer-events', 'none')
      .style('z-index', '100');

    function showTooltip(event, d, tipo) {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      tooltip
        .style('visibility', 'visible')
        .style('left', `${x + 10}px`)
        .style('top', `${y - 10}px`)
        .html(`
          <strong>${nomesMeses[d.mes - 1]}/${d.ano}</strong><br/>
          <span style="color: ${tipo === 'faturamento' ? '#3b82f6' : '#ef4444'}">
            ${tipo === 'faturamento' ? 'Faturamento' : 'Tributos'}: ${formatarMoeda(tipo === 'faturamento' ? d.faturamento : d.tributosPagos)}
          </span><br/>
          <span style="color: #888">Alíquota: ${d.aliquotaEfetiva?.toFixed(2)}%</span>
        `);
    }

    function hideTooltip() {
      tooltip.style('visibility', 'hidden');
    }
  };

  // Atualizar campo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Cores por regime
  const coresRegime = {
    simples: 'bg-blue-100 text-blue-700',
    presumido: 'bg-green-100 text-green-700',
    real: 'bg-purple-100 text-purple-700',
    mei: 'bg-amber-100 text-amber-700'
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Histórico Tributário
        </h1>
        <p className="text-gray-600">
          Acompanhe a evolução dos seus tributos mês a mês com gráficos interativos e estatísticas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Registro */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">➕ Adicionar Mês</h2>

            <form onSubmit={salvarRegistro} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
                  <select
                    name="mes"
                    value={formData.mes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {nomesMeses.map((nome, i) => (
                      <option key={i + 1} value={i + 1}>{nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                  <select
                    name="ano"
                    value={formData.ano}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {[2023, 2024, 2025, 2026].map(ano => (
                      <option key={ano} value={ano}>{ano}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Regime</label>
                <select
                  name="regime"
                  value={formData.regime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="mei">MEI</option>
                  <option value="simples">Simples Nacional</option>
                  <option value="presumido">Lucro Presumido</option>
                  <option value="real">Lucro Real</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faturamento (R$)</label>
                <input
                  type="number"
                  name="faturamento"
                  value={formData.faturamento}
                  onChange={handleChange}
                  placeholder="Ex: 50000"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tributos Pagos (R$)</label>
                <input
                  type="number"
                  name="tributosPagos"
                  value={formData.tributosPagos}
                  onChange={handleChange}
                  placeholder="Ex: 5000"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {erro && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {erro}
                </div>
              )}

              <button
                type="submit"
                disabled={carregando}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                {carregando ? 'Salvando...' : '💾 Salvar Registro'}
              </button>
            </form>
          </div>
        </div>

        {/* Área Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estatísticas Rápidas */}
          {historico?.estatisticas && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Total Faturado</p>
                <p className="text-xl font-bold text-gray-900">{formatarMoeda(historico.estatisticas.totalFaturamento)}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Total Tributos</p>
                <p className="text-xl font-bold text-red-600">{formatarMoeda(historico.estatisticas.totalTributos)}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Alíq. Média</p>
                <p className="text-xl font-bold text-indigo-600">{historico.estatisticas.aliquotaMediaEfetiva.toFixed(2)}%</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Meses</p>
                <p className="text-xl font-bold text-gray-900">{historico.estatisticas.totalMeses}</p>
              </div>
            </div>
          )}

          {/* Tendência */}
          {historico?.tendencia && (
            <div className={`rounded-xl p-4 ${
              historico.tendencia.direcao === 'alta' ? 'bg-red-50 border border-red-200' :
              historico.tendencia.direcao === 'baixa' ? 'bg-green-50 border border-green-200' :
              'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {historico.tendencia.direcao === 'alta' ? '📈' :
                   historico.tendencia.direcao === 'baixa' ? '📉' : '➡️'}
                </span>
                <div>
                  <p className="font-medium">
                    Tendência: <span className="capitalize">{historico.tendencia.direcao}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Variação média mensal: {formatarMoeda(Math.abs(historico.tendencia.variacaoMediaMensal))}
                    {historico.tendencia.direcao !== 'estavel' && 
                      ` (${historico.tendencia.direcao === 'alta' ? 'aumento' : 'redução'})`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Abas */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex border-b">
              <button
                onClick={() => setAbaAtiva('grafico')}
                className={`flex-1 py-3 font-medium transition-all ${
                  abaAtiva === 'grafico' 
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                📈 Gráfico
              </button>
              <button
                onClick={() => setAbaAtiva('tabela')}
                className={`flex-1 py-3 font-medium transition-all ${
                  abaAtiva === 'tabela' 
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                📋 Tabela
              </button>
              <button
                onClick={() => setAbaAtiva('anual')}
                className={`flex-1 py-3 font-medium transition-all ${
                  abaAtiva === 'anual' 
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                📅 Por Ano
              </button>
            </div>

            <div className="p-6">
              {/* Gráfico */}
              {abaAtiva === 'grafico' && (
                <div>
                  {historico?.registros?.length > 0 ? (
                    <div ref={graficoRef} className="w-full relative" style={{ minHeight: 400 }} />
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-4xl mb-4">📊</p>
                      <p>Adicione registros mensais para visualizar o gráfico</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tabela */}
              {abaAtiva === 'tabela' && (
                <div className="overflow-x-auto">
                  {historico?.registros?.length > 0 ? (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Período</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Regime</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Faturamento</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Tributos</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Alíquota</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {historico.registros.map((reg) => (
                          <tr key={`${reg.ano}-${reg.mes}`} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{nomesMeses[reg.mes - 1]}/{reg.ano}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${coresRegime[reg.regime]}`}>
                                {reg.regime.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">{formatarMoeda(reg.faturamento)}</td>
                            <td className="px-4 py-3 text-right text-red-600">{formatarMoeda(reg.tributosPagos)}</td>
                            <td className="px-4 py-3 text-right">{reg.aliquotaEfetiva?.toFixed(2)}%</td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => removerRegistro(reg.ano, reg.mes)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                title="Remover"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-4xl mb-4">📋</p>
                      <p>Nenhum registro encontrado</p>
                    </div>
                  )}
                </div>
              )}

              {/* Por Ano */}
              {abaAtiva === 'anual' && (
                <div>
                  {historico?.porAno && Object.keys(historico.porAno).length > 0 ? (
                    <div className="grid gap-4">
                      {Object.entries(historico.porAno).sort((a, b) => b[0] - a[0]).map(([ano, dados]) => (
                        <div key={ano} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{ano}</h3>
                            <span className="text-sm text-gray-500">{dados.meses} meses</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Faturamento</p>
                              <p className="text-lg font-bold text-gray-900">{formatarMoeda(dados.faturamento)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Tributos</p>
                              <p className="text-lg font-bold text-red-600">{formatarMoeda(dados.tributos)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Alíquota Média</p>
                              <p className="text-lg font-bold text-indigo-600">
                                {((dados.tributos / dados.faturamento) * 100).toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-4xl mb-4">📅</p>
                      <p>Adicione registros para ver os totais anuais</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dica */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Dica</h3>
        <p className="text-blue-700 text-sm">
          Registre seus dados mensais para acompanhar a evolução da carga tributária ao longo do tempo.
          O sistema calcula automaticamente a tendência e ajuda você a identificar padrões e planejar
          mudanças no regime tributário.
        </p>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * FERRAMENTA 1: COMPARADOR DE INDICADORES (CDI x SELIC x IPCA)
 * 
 * Descrição:
 * Esta ferramenta compara a evolução histórica de três dos principais indicadores
 * financeiros brasileiros: CDI, SELIC e IPCA. Exibe um gráfico de linha interativo
 * e cards com estatísticas de variação acumulada, média e volatilidade.
 * 
 * Funcionalidades:
 * - Gráfico de linha com evolução temporal dos indicadores
 * - Cards com estatísticas: variação acumulada, média mensal e volatilidade
 * - Filtro por período (3m, 6m, 1a, 2a, 5a)
 * - Dados fictícios para demonstração
 * - Interface responsiva e moderna
 * 
 * Dados utilizados:
 * - CDI (Certificado de Depósito Interbancário): taxa de empréstimos entre bancos
 * - SELIC (Taxa básica de juros): definida pelo Banco Central
 * - IPCA (Índice de Preços ao Consumidor Amplo): inflação oficial
 */

const ComparadorIndicadores = () => {
  const [periodo, setPeriodo] = useState('1a');
  const [dadosFiltrados, setDadosFiltrados] = useState(null);

  // DADOS FICTÍCIOS - Representam valores mensais dos últimos 5 anos
  // Em produção, estes dados viriam de uma API (ANBIMA, Banco Central, IBGE)
  const dadosHistoricos = {
    // Últimos 60 meses (5 anos)
    labels: [
      'Jan/20', 'Fev/20', 'Mar/20', 'Abr/20', 'Mai/20', 'Jun/20',
      'Jul/20', 'Ago/20', 'Set/20', 'Out/20', 'Nov/20', 'Dez/20',
      'Jan/21', 'Fev/21', 'Mar/21', 'Abr/21', 'Mai/21', 'Jun/21',
      'Jul/21', 'Ago/21', 'Set/21', 'Out/21', 'Nov/21', 'Dez/21',
      'Jan/22', 'Fev/22', 'Mar/22', 'Abr/22', 'Mai/22', 'Jun/22',
      'Jul/22', 'Ago/22', 'Set/22', 'Out/22', 'Nov/22', 'Dez/22',
      'Jan/23', 'Fev/23', 'Mar/23', 'Abr/23', 'Mai/23', 'Jun/23',
      'Jul/23', 'Ago/23', 'Set/23', 'Out/23', 'Nov/23', 'Dez/23',
      'Jan/24', 'Fev/24', 'Mar/24', 'Abr/24', 'Mai/24', 'Jun/24',
      'Jul/24', 'Ago/24', 'Set/24', 'Out/24', 'Nov/24', 'Dez/24'
    ],
    // CDI - Certificado de Depósito Interbancário (% ao mês)
    cdi: [
      0.35, 0.29, 0.31, 0.26, 0.24, 0.22,
      0.19, 0.17, 0.16, 0.16, 0.15, 0.15,
      0.14, 0.13, 0.17, 0.22, 0.26, 0.32,
      0.39, 0.48, 0.55, 0.65, 0.73, 0.82,
      0.91, 0.98, 1.01, 1.04, 1.08, 1.10,
      1.12, 1.09, 1.07, 1.04, 1.02, 0.99,
      0.98, 0.96, 0.95, 0.94, 0.93, 0.92,
      0.91, 0.90, 0.89, 0.88, 0.88, 0.87,
      0.86, 0.86, 0.85, 0.85, 0.84, 0.84,
      0.83, 0.83, 0.82, 0.82, 0.81, 0.81
    ],
    // SELIC - Taxa básica de juros (% ao mês)
    selic: [
      0.37, 0.30, 0.32, 0.27, 0.25, 0.23,
      0.20, 0.18, 0.17, 0.17, 0.16, 0.16,
      0.15, 0.14, 0.18, 0.23, 0.27, 0.34,
      0.41, 0.50, 0.57, 0.68, 0.76, 0.86,
      0.95, 1.02, 1.05, 1.08, 1.12, 1.14,
      1.16, 1.13, 1.11, 1.08, 1.06, 1.03,
      1.02, 1.00, 0.99, 0.98, 0.97, 0.96,
      0.95, 0.94, 0.93, 0.92, 0.92, 0.91,
      0.90, 0.90, 0.89, 0.89, 0.88, 0.88,
      0.87, 0.87, 0.86, 0.86, 0.85, 0.85
    ],
    // IPCA - Inflação oficial (% ao mês)
    ipca: [
      0.21, 0.25, 0.07, -0.31, -0.38, 0.26,
      0.36, 0.24, 0.64, 0.86, 0.89, 1.35,
      0.25, 0.86, 0.93, 0.31, 0.83, 0.53,
      0.96, 0.87, 1.16, 1.25, 0.95, 0.73,
      0.54, 1.01, 1.62, 1.06, 0.47, 0.67,
      -0.68, -0.36, -0.29, 0.59, 0.41, 0.62,
      0.53, 0.84, 0.71, 0.61, 0.23, 0.12,
      0.23, -0.02, 0.28, 0.56, 0.28, 0.56,
      0.42, 0.83, 0.16, 0.38, 0.46, 0.21,
      0.38, -0.02, 0.44, 0.56, 0.39, 0.62
    ]
  };

  // Função para filtrar dados por período
  const filtrarDados = (periodoSelecionado) => {
    const mesesMap = {
      '3m': 3,
      '6m': 6,
      '1a': 12,
      '2a': 24,
      '5a': 60
    };

    const meses = mesesMap[periodoSelecionado];
    const inicio = dadosHistoricos.labels.length - meses;

    return {
      labels: dadosHistoricos.labels.slice(inicio),
      cdi: dadosHistoricos.cdi.slice(inicio),
      selic: dadosHistoricos.selic.slice(inicio),
      ipca: dadosHistoricos.ipca.slice(inicio)
    };
  };

  // Calcular estatísticas dos indicadores
  const calcularEstatisticas = (dados) => {
    const calcular = (array) => {
      const acumulado = array.reduce((acc, val) => acc * (1 + val / 100), 1);
      const variacaoAcumulada = ((acumulado - 1) * 100).toFixed(2);
      const media = (array.reduce((a, b) => a + b, 0) / array.length).toFixed(2);
      
      // Volatilidade (desvio padrão)
      const mediaNum = parseFloat(media);
      const variancia = array.reduce((acc, val) => acc + Math.pow(val - mediaNum, 2), 0) / array.length;
      const volatilidade = Math.sqrt(variancia).toFixed(2);

      return { variacaoAcumulada, media, volatilidade };
    };

    return {
      cdi: calcular(dados.cdi),
      selic: calcular(dados.selic),
      ipca: calcular(dados.ipca)
    };
  };

  // Atualizar dados quando o período mudar
  useEffect(() => {
    const dados = filtrarDados(periodo);
    setDadosFiltrados(dados);
  }, [periodo]);

  if (!dadosFiltrados) return null;

  const estatisticas = calcularEstatisticas(dadosFiltrados);

  // Configuração do gráfico
  const chartData = {
    labels: dadosFiltrados.labels,
    datasets: [
      {
        label: 'CDI',
        data: dadosFiltrados.cdi,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: false,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5
      },
      {
        label: 'SELIC',
        data: dadosFiltrados.selic,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: false,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5
      },
      {
        label: 'IPCA',
        data: dadosFiltrados.ipca,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: false,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return value.toFixed(2) + '%';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Comparador de Indicadores Financeiros
        </h1>
        <p className="text-gray-600 text-lg">
          Compare a evolução histórica do CDI, SELIC e IPCA em diferentes períodos
        </p>
      </div>

      {/* Filtro de Período */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {[
          { valor: '3m', label: '3 meses' },
          { valor: '6m', label: '6 meses' },
          { valor: '1a', label: '1 ano' },
          { valor: '2a', label: '2 anos' },
          { valor: '5a', label: '5 anos' }
        ].map((opcao) => (
          <button
            key={opcao.valor}
            onClick={() => setPeriodo(opcao.valor)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              periodo === opcao.valor
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
            }`}
          >
            {opcao.label}
          </button>
        ))}
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Evolução Temporal (% ao mês)
        </h2>
        <div style={{ height: '400px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card CDI */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-blue-900">CDI</h3>
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-blue-700 font-medium">Variação Acumulada</p>
              <p className="text-2xl font-bold text-blue-900">{estatisticas.cdi.variacaoAcumulada}%</p>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-blue-200">
              <div>
                <p className="text-xs text-blue-600">Média Mensal</p>
                <p className="text-lg font-semibold text-blue-800">{estatisticas.cdi.media}%</p>
              </div>
              <div>
                <p className="text-xs text-blue-600">Volatilidade</p>
                <p className="text-lg font-semibold text-blue-800">{estatisticas.cdi.volatilidade}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card SELIC */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-green-900">SELIC</h3>
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-green-700 font-medium">Variação Acumulada</p>
              <p className="text-2xl font-bold text-green-900">{estatisticas.selic.variacaoAcumulada}%</p>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-green-200">
              <div>
                <p className="text-xs text-green-600">Média Mensal</p>
                <p className="text-lg font-semibold text-green-800">{estatisticas.selic.media}%</p>
              </div>
              <div>
                <p className="text-xs text-green-600">Volatilidade</p>
                <p className="text-lg font-semibold text-green-800">{estatisticas.selic.volatilidade}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card IPCA */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg p-6 border-l-4 border-red-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-red-900">IPCA</h3>
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-red-700 font-medium">Variação Acumulada</p>
              <p className="text-2xl font-bold text-red-900">{estatisticas.ipca.variacaoAcumulada}%</p>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-red-200">
              <div>
                <p className="text-xs text-red-600">Média Mensal</p>
                <p className="text-lg font-semibold text-red-800">{estatisticas.ipca.media}%</p>
              </div>
              <div>
                <p className="text-xs text-red-600">Volatilidade</p>
                <p className="text-lg font-semibold text-red-800">{estatisticas.ipca.volatilidade}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Painel Informativo */}
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Sobre os Indicadores</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold text-blue-700 mb-1">CDI</p>
            <p className="text-gray-600">
              Certificado de Depósito Interbancário. Taxa de empréstimos entre bancos, 
              referência para investimentos de renda fixa.
            </p>
          </div>
          <div>
            <p className="font-semibold text-green-700 mb-1">SELIC</p>
            <p className="text-gray-600">
              Taxa básica de juros da economia brasileira, definida pelo Banco Central 
              a cada 45 dias pelo COPOM.
            </p>
          </div>
          <div>
            <p className="font-semibold text-red-700 mb-1">IPCA</p>
            <p className="text-gray-600">
              Índice de Preços ao Consumidor Amplo. Inflação oficial do Brasil, 
              medida pelo IBGE.
            </p>
          </div>
        </div>
      </div>

      {/* Notas Técnicas */}
      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Dados Fictícios</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Os dados apresentados são fictícios e servem apenas para demonstração da ferramenta.
              Em produção, integre com APIs oficiais: Banco Central (SELIC/CDI), IBGE (IPCA), ou ANBIMA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparadorIndicadores;

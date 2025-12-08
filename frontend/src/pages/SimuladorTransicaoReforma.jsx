import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  ArrowRight,
  InfoIcon,
  Calculator
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SimuladorTransicaoReforma() {
  const [faturamento, setFaturamento] = useState('500000');
  const [estado, setEstado] = useState('SP');
  const [segmento, setSegmento] = useState('comercio');
  const [creditosAtuais, setCreditosAtuais] = useState('5');
  const [resultado, setResultado] = useState(null);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  const segmentos = {
    comercio: { nome: 'Comércio', aliquotaIVA: 27.5 },
    servicos: { nome: 'Serviços', aliquotaIVA: 27.5 },
    industria: { nome: 'Indústria', aliquotaIVA: 27.5 },
    saude: { nome: 'Saúde', aliquotaIVA: 16.5 },
    educacao: { nome: 'Educação', aliquotaIVA: 16.5 },
    transporte: { nome: 'Transporte', aliquotaIVA: 13.75 },
    alimentacao: { nome: 'Alimentação', aliquotaIVA: 21 }
  };

  const aliquotasICMS = {
    'AC': 17, 'AL': 18, 'AP': 18, 'AM': 18, 'BA': 18,
    'CE': 18, 'DF': 18, 'ES': 17, 'GO': 17, 'MA': 18,
    'MT': 17, 'MS': 17, 'MG': 18, 'PA': 17, 'PB': 18,
    'PR': 18, 'PE': 18, 'PI': 18, 'RJ': 20, 'RN': 18,
    'RS': 18, 'RO': 17.5, 'RR': 17, 'SC': 17, 'SP': 18,
    'SE': 18, 'TO': 18
  };

  const calcularTransicao = () => {
    const fat = parseFloat(faturamento);
    const creditos = parseFloat(creditosAtuais) / 100;
    const aliqICMS = aliquotasICMS[estado];
    const aliqIVA = segmentos[segmento].aliquotaIVA;

    // Sistema Atual (2025)
    const pis = fat * 0.0165;
    const cofins = fat * 0.076;
    const icms = fat * (aliqICMS / 100);
    const iss = segmento === 'servicos' ? fat * 0.05 : 0;
    const tributacaoAtual = pis + cofins + icms + iss;
    const creditoAtual = tributacaoAtual * creditos;
    const totalAtual = tributacaoAtual - creditoAtual;

    // Sistema Novo (2033+)
    const cbs = fat * (aliqIVA / 2 / 100);
    const ibs = fat * (aliqIVA / 2 / 100);
    const tributacaoNova = cbs + ibs;
    const creditoNovo = tributacaoNova * creditos;
    const totalNovo = tributacaoNova - creditoNovo;

    // Transição ano a ano
    const anos = [];
    for (let ano = 2026; ano <= 2033; ano++) {
      let percentualNovo, percentualAntigo;
      
      if (ano === 2026) {
        percentualNovo = 0.1;
        percentualAntigo = 1;
      } else if (ano === 2027) {
        percentualNovo = 0.2;
        percentualAntigo = 0.9;
      } else if (ano >= 2029 && ano <= 2032) {
        const etapa = ano - 2029;
        percentualNovo = 0.2 + (0.2 * (etapa + 1));
        percentualAntigo = 0.8 - (0.2 * (etapa + 1));
      } else if (ano === 2033) {
        percentualNovo = 1;
        percentualAntigo = 0;
      }

      const tribAntigo = totalAtual * percentualAntigo;
      const tribNovo = totalNovo * percentualNovo;
      const tribTotal = tribAntigo + tribNovo;
      const cargaTributaria = (tribTotal / fat) * 100;

      anos.push({
        ano,
        percentualNovo: (percentualNovo * 100).toFixed(0),
        percentualAntigo: (percentualAntigo * 100).toFixed(0),
        tributoAntigo: tribAntigo,
        tributoNovo: tribNovo,
        tributoTotal: tribTotal,
        cargaTributaria: cargaTributaria.toFixed(2)
      });
    }

    const diferencaTotal = totalNovo - totalAtual;
    const variacao = ((diferencaTotal / totalAtual) * 100).toFixed(2);

    setResultado({
      totalAtual,
      totalNovo,
      diferencaTotal,
      variacao,
      anos,
      aliqIVA,
      creditoAtual,
      creditoNovo
    });
  };

  const getChartData = () => {
    if (!resultado) return null;

    return {
      labels: resultado.anos.map(a => a.ano.toString()),
      datasets: [
        {
          label: 'Sistema Antigo',
          data: resultado.anos.map(a => a.tributoAntigo),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2,
          fill: true
        },
        {
          label: 'IBS + CBS',
          data: resultado.anos.map(a => a.tributoNovo),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          fill: true
        },
        {
          label: 'Total',
          data: resultado.anos.map(a => a.tributoTotal),
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 3,
          fill: false,
          borderDash: [5, 5]
        }
      ]
    };
  };

  const getCargaTributariaData = () => {
    if (!resultado) return null;

    return {
      labels: resultado.anos.map(a => a.ano.toString()),
      datasets: [{
        label: 'Carga Tributária Efetiva (%)',
        data: resultado.anos.map(a => parseFloat(a.cargaTributaria)),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolução dos Tributos na Transição (2026-2033)'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(context.parsed.y);
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              notation: 'compact'
            }).format(value);
          }
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Carga Tributária Efetiva por Ano'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Simulador da Transição Tributária 2026-2033 | Reforma Tributária</title>
        <meta name="description" content="Simule ano a ano o impacto da Reforma Tributária na sua empresa. Veja a evolução dos tributos de 2026 até 2033 com IBS e CBS." />
        <meta name="keywords" content="transição reforma tributária, 2026 2033 impostos, mudança impostos ano a ano, IBS CBS transição, simulador reforma tributária" />
        <link rel="canonical" href="https://seusite.com.br/simulador-transicao-reforma" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">
              Simulador da Transição Tributária
            </h1>
          </div>
          <p className="text-lg opacity-90">
            Simule o impacto ano a ano da Reforma Tributária (2026-2033) na sua empresa
          </p>
        </div>

        {/* Alert Info */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <InfoIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-blue-900 font-medium">
                A transição tributária acontece gradualmente entre 2026 e 2033
              </p>
              <p className="text-blue-700 text-sm mt-1">
                Os tributos antigos (PIS, COFINS, ICMS, ISS) serão substituídos progressivamente por IBS e CBS.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Calculadora */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Dados da Empresa</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faturamento Anual
                  </label>
                  <input
                    type="number"
                    value={faturamento}
                    onChange={(e) => setFaturamento(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="500000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {Object.keys(aliquotasICMS).sort().map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Segmento
                  </label>
                  <select
                    value={segmento}
                    onChange={(e) => setSegmento(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {Object.entries(segmentos).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.nome} ({value.aliquotaIVA}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Créditos Recuperáveis (%)
                  </label>
                  <input
                    type="number"
                    value={creditosAtuais}
                    onChange={(e) => setCreditosAtuais(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="5"
                    min="0"
                    max="100"
                  />
                </div>

                <button
                  onClick={calcularTransicao}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  Simular Transição
                </button>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="md:col-span-2 space-y-6">
            {resultado && (
              <>
                {/* Comparativo Resumido */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Comparativo: Antes vs Depois
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-sm text-red-600 font-medium">Sistema Atual (2025)</p>
                      <p className="text-2xl font-bold text-red-700 mt-1">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(resultado.totalAtual)}
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-600 font-medium">Sistema Novo (2033+)</p>
                      <p className="text-2xl font-bold text-blue-700 mt-1">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(resultado.totalNovo)}
                      </p>
                    </div>

                    <div className={`p-4 rounded-lg border ${
                      resultado.diferencaTotal < 0 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-orange-50 border-orange-200'
                    }`}>
                      <p className={`text-sm font-medium ${
                        resultado.diferencaTotal < 0 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        Variação
                      </p>
                      <p className={`text-2xl font-bold mt-1 ${
                        resultado.diferencaTotal < 0 ? 'text-green-700' : 'text-orange-700'
                      }`}>
                        {resultado.variacao > 0 ? '+' : ''}{resultado.variacao}%
                      </p>
                    </div>
                  </div>

                  {/* Mensagem de impacto */}
                  <div className={`p-4 rounded-lg ${
                    resultado.diferencaTotal < 0 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-orange-50 border border-orange-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-1 ${
                        resultado.diferencaTotal < 0 ? 'text-green-600' : 'text-orange-600'
                      }`} />
                      <div>
                        <p className={`font-medium ${
                          resultado.diferencaTotal < 0 ? 'text-green-900' : 'text-orange-900'
                        }`}>
                          {resultado.diferencaTotal < 0 
                            ? '✓ Redução de carga tributária esperada' 
                            : '⚠ Aumento de carga tributária esperado'}
                        </p>
                        <p className={`text-sm mt-1 ${
                          resultado.diferencaTotal < 0 ? 'text-green-700' : 'text-orange-700'
                        }`}>
                          Economia/Acréscimo anual de {' '}
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(Math.abs(resultado.diferencaTotal))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gráfico de Evolução */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Evolução dos Tributos (2026-2033)
                  </h3>
                  <div className="h-80">
                    <Line data={getChartData()} options={chartOptions} />
                  </div>
                </div>

                {/* Gráfico de Carga Tributária */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Carga Tributária Efetiva por Ano
                  </h3>
                  <div className="h-80">
                    <Bar data={getCargaTributariaData()} options={barChartOptions} />
                  </div>
                </div>

                {/* Tabela Detalhada */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <button
                    onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="text-xl font-bold text-gray-900">
                      Detalhamento Ano a Ano
                    </h3>
                    {mostrarDetalhes ? (
                      <ChevronUp className="w-6 h-6 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-600" />
                    )}
                  </button>

                  {mostrarDetalhes && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Ano</th>
                            <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">% Antigo</th>
                            <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">% Novo</th>
                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Sistema Antigo</th>
                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">IBS + CBS</th>
                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Total</th>
                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Carga %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultado.anos.map((ano, index) => (
                            <tr key={ano.ano} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                              <td className="py-3 px-2 font-medium">{ano.ano}</td>
                              <td className="text-center py-3 px-2 text-red-600">{ano.percentualAntigo}%</td>
                              <td className="text-center py-3 px-2 text-blue-600">{ano.percentualNovo}%</td>
                              <td className="text-right py-3 px-2 text-sm">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(ano.tributoAntigo)}
                              </td>
                              <td className="text-right py-3 px-2 text-sm">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(ano.tributoNovo)}
                              </td>
                              <td className="text-right py-3 px-2 font-semibold">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(ano.tributoTotal)}
                              </td>
                              <td className="text-right py-3 px-2 font-semibold text-purple-600">
                                {ano.cargaTributaria}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Dicas e Recomendações */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-purple-600" />
                    Recomendações para sua empresa
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Revise contratos e preços para 2026 considerando as mudanças graduais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Invista em sistemas de gestão fiscal que calculem IBS e CBS corretamente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Planeje o fluxo de caixa ano a ano durante a transição</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Capacite sua equipe fiscal e contábil para o novo modelo tributário</span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {!resultado && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Preencha os dados ao lado e clique em "Simular Transição" para ver a evolução tributária ano a ano
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Artigo SEO */}
        <article className="mt-12 bg-white rounded-xl shadow-lg p-8 prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Transição da Reforma Tributária 2026-2033: Guia Completo
          </h2>

          {/* Introdução */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              O que é a Transição Tributária?
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              A <strong>transição tributária brasileira</strong> é o período de 8 anos (2026-2033) em que os tributos atuais sobre consumo (PIS, COFINS, ICMS e ISS) serão gradualmente substituídos pelo novo modelo de <strong>IVA Dual</strong> composto por IBS (Imposto sobre Bens e Serviços) e CBS (Contribuição sobre Bens e Serviços).
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Esta transição é fundamental para que empresas, contadores e o próprio sistema tributário nacional se adaptem progressivamente à maior mudança fiscal dos últimos 50 anos no Brasil. A implementação gradual evita choques econômicos e permite ajustes conforme surgem desafios práticos.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Para empresas, <strong>planejar essa transição é crucial</strong>: contratos de longo prazo, precificação de produtos, estrutura de créditos tributários e até o fluxo de caixa serão afetados ano após ano. Empresas que se antecipam aos impactos ganham vantagem competitiva e evitam surpresas financeiras.
            </p>
          </section>

          {/* Como calcular */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Como Calcular a Transição Tributária em 2025
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              O cálculo da transição envolve combinar os percentuais dos sistemas antigo e novo em cada ano:
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded-r-lg">
              <p className="font-semibold text-blue-900 mb-2">Fórmula da Transição:</p>
              <code className="block bg-white p-3 rounded text-sm text-gray-800">
                Tributo Total = (Sistema Antigo × %Antigo) + (Sistema Novo × %Novo)
              </code>
            </div>

            <h4 className="text-xl font-bold text-gray-900 mt-6 mb-3">
              Cronograma da Transição:
            </h4>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Ano</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Sistema Antigo</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">IBS + CBS</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">2026</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">100%</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">10%</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">Início da CBS (0,9%)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-semibold">2027</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">90%</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">20%</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">CBS em 1,8%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">2029</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">80%</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">20%</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">Início do IBS</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-semibold">2030</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">60%</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">40%</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">Redução ICMS/ISS</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">2031</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">40%</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">60%</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">Maioria IBS/CBS</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-semibold">2032</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">20%</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">80%</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">Fase final</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">2033</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">0%</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">100%</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">Transição completa</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-xl font-bold text-gray-900 mt-6 mb-3">
              Exemplo Prático de Cálculo:
            </h4>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-4">
              <p className="font-semibold text-gray-900 mb-3">Empresa de Comércio em SP</p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Faturamento:</strong> R$ 500.000/ano</li>
                <li>• <strong>Tributos atuais:</strong> R$ 90.000 (18%)</li>
                <li>• <strong>Tributos novos:</strong> R$ 137.500 (27,5%)</li>
              </ul>

              <p className="font-semibold text-gray-900 mt-4 mb-2">Em 2030 (60% antigo + 40% novo):</p>
              <code className="block bg-white p-3 rounded text-sm text-gray-800">
                Total = (R$ 90.000 × 60%) + (R$ 137.500 × 40%)<br/>
                Total = R$ 54.000 + R$ 55.000 = R$ 109.000
              </code>
            </div>
          </section>

          {/* Exemplos práticos */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Exemplos Práticos por Setor
            </h3>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-bold text-gray-900 mb-2">Indústria Manufatureira</h4>
                <p className="text-gray-700 mb-2">
                  Indústrias se beneficiam muito do novo sistema pela recuperação ampla de créditos. A transição gradual permite adaptar a gestão de créditos sem choques de fluxo de caixa.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Impacto esperado:</strong> Redução de 15-25% na carga efetiva até 2033.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-bold text-gray-900 mb-2">Prestadores de Serviços</h4>
                <p className="text-gray-700 mb-2">
                  Com o fim do ISS e entrada do IBS, muitos prestadores de serviços terão aumento de carga. A transição permite reajustar contratos e preços ao longo do tempo.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Impacto esperado:</strong> Aumento de 5-15% dependendo do município e margem de lucro.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-bold text-gray-900 mb-2">E-commerce e Varejo</h4>
                <p className="text-gray-700 mb-2">
                  Varejistas verão simplificação operacional enorme (adeus DIFAL e ICMS-ST complexos), mas podem ter aumento de carga dependendo do estado. A transição gradual facilita ajustes de precificação.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Impacto esperado:</strong> Neutro a +10%, mas com grande ganho operacional.
                </p>
              </div>
            </div>
          </section>

          {/* Erros comuns */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Erros Comuns na Transição Tributária
            </h3>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
              <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Principais Erros das Empresas:
              </h4>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <div>
                    <strong>Não planejar contratos de longo prazo:</strong> Contratos firmados em 2025 que vão até 2030 precisam prever cláusulas de reajuste tributário.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <div>
                    <strong>Ignorar a gestão de créditos:</strong> O modelo de créditos muda radicalmente. Créditos acumulados no sistema antigo não migram automaticamente.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <div>
                    <strong>Não atualizar sistemas fiscais:</strong> ERPs e sistemas de nota fiscal precisam calcular simultaneamente os dois modelos durante a transição.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <div>
                    <strong>Subestimar treinamento:</strong> A equipe fiscal precisa dominar IBS e CBS enquanto ainda opera PIS/COFINS/ICMS/ISS.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <div>
                    <strong>Esquecer de revisar precificação anualmente:</strong> A carga muda todo ano. Preços devem ser revistos anualmente durante a transição.
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes (FAQ)
            </h3>

            <div className="space-y-4">
              <details className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  Por que a transição dura 8 anos?
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  Para evitar choques econômicos e dar tempo para empresas, governos e sistemas se adaptarem. Uma mudança tributária dessa magnitude implementada de uma vez causaria caos operacional e financeiro.
                </p>
              </details>

              <details className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  Preciso emitir duas notas fiscais durante a transição?
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  Não. A nota fiscal eletrônica será adaptada para incluir campos de IBS e CBS ao lado dos tributos atuais. Você emite uma nota, mas com mais campos de tributação.
                </p>
              </details>

              <details className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  Meus créditos de ICMS atuais serão perdidos?
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  Não necessariamente. A legislação prevê regras de transição de créditos, mas é fundamental acompanhar a regulamentação específica do seu estado e manter a escrituração em dia.
                </p>
              </details>

              <details className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  Posso antecipar a migração para IBS/CBS?
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  Não. A transição segue o cronograma legal estabelecido. Todos os contribuintes migram juntos nos percentuais definidos para cada ano.
                </p>
              </details>

              <details className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  Como fica o Simples Nacional na transição?
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  O Simples Nacional continua existindo, mas suas alíquotas serão ajustadas para incorporar IBS e CBS no lugar de PIS/COFINS/ICMS/ISS. A transição também será gradual para o Simples.
                </p>
              </details>

              <details className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  Devo renegociar contratos antigos antes de 2026?
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  Sim, é altamente recomendado. Contratos de fornecimento, prestação de serviços e aluguel devem incluir cláusulas de revisão tributária para refletir as mudanças da reforma.
                </p>
              </details>
            </div>
          </section>

          {/* Termos importantes */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Termos Importantes da Transição
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2">IBS (Imposto sobre Bens e Serviços)</h4>
                <p className="text-sm text-gray-700">
                  Substitui ICMS e ISS. Gerido pelo Comitê Gestor do IBS. Repartido entre estados e municípios.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2">CBS (Contribuição sobre Bens e Serviços)</h4>
                <p className="text-sm text-gray-700">
                  Substitui PIS e COFINS. Gerida pela Receita Federal. Tributo federal sobre consumo.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-2">Período de Teste (2026-2027)</h4>
                <p className="text-sm text-gray-700">
                  Primeiros dois anos com CBS em alíquota reduzida (0,9% e 1,8%) para testar sistemas e ajustar legislação.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-2">Alíquota Padrão</h4>
                <p className="text-sm text-gray-700">
                  Estimada em 27,5% (IBS + CBS juntos). Pode variar conforme regulamentação final do Comitê Gestor.
                </p>
              </div>
            </div>
          </section>

          {/* Legislação */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              O que Diz a Legislação Atual
            </h3>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-4">
              <h4 className="font-bold text-amber-900 mb-3">Emenda Constitucional 132/2023</h4>
              <p className="text-gray-700 mb-3">
                A EC 132/2023 estabelece as bases da Reforma Tributária e define o cronograma de transição entre 2026 e 2033.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• <strong>Art. 11:</strong> Define o cronograma de implementação gradual</li>
                <li>• <strong>Art. 12:</strong> Estabelece as alíquotas de transição da CBS</li>
                <li>• <strong>Art. 13:</strong> Regula a transição do IBS a partir de 2029</li>
                <li>• <strong>Art. 14:</strong> Trata da gestão de créditos acumulados</li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Leis Complementares pendentes:</strong> Ainda serão aprovadas leis complementares detalhando regras específicas de cada setor, tratamento de créditos, obrigações acessórias e funcionamento do Comitê Gestor do IBS.
            </p>

            <p className="text-gray-700 leading-relaxed">
              <strong>Regulamentações estaduais e municipais:</strong> Cada estado e município precisará adaptar sua legislação local ao novo modelo, processo que deve ocorrer entre 2024 e 2026.
            </p>
          </section>

          {/* Conclusão */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Conclusão
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              A <strong>transição tributária 2026-2033</strong> é um dos maiores desafios e oportunidades para empresas brasileiras nas próximas décadas. Planejar-se adequadamente pode significar economia de milhões em tributos e vantagem competitiva significativa.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Empresas que começarem agora a simular cenários, revisar contratos, capacitar equipes e atualizar sistemas estarão muito à frente da concorrência. A transição gradual é justamente para permitir que todos se adaptem — mas quem se antecipar sai ganhando.
            </p>
            <p className="text-gray-700 leading-relaxed font-semibold">
              Use nosso simulador para projetar ano a ano o impacto na sua empresa e tome decisões estratégicas baseadas em dados concretos. A reforma tributária não é mais uma possibilidade distante — ela começa em 2026.
            </p>
          </section>

          {/* CTA Final */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white text-center mt-12">
            <h3 className="text-2xl font-bold mb-3">
              Planeje sua Transição Tributária Agora
            </h3>
            <p className="mb-6 text-purple-100">
              Simule o impacto ano a ano e esteja preparado para a maior mudança tributária da história do Brasil
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors inline-flex items-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Simular Minha Transição
            </button>
          </div>
        </article>
      </div>
    </>
  );
}

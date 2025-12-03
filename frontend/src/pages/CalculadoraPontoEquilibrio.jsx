import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';

// Simple inline icon components to avoid requiring "lucide-react" package
const Icon = ({ children, className }) => <span className={className} aria-hidden="true">{children}</span>;
const ArrowLeft = (props) => <Icon {...props}>←</Icon>;
const TrendingUp = (props) => <Icon {...props}>📈</Icon>;
const DollarSign = (props) => <Icon {...props}>💲</Icon>;
const Package = (props) => <Icon {...props}>📦</Icon>;
const AlertCircle = (props) => <Icon {...props}>⚠️</Icon>;
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

export default function CalculadoraPontoEquilibrio() {
  const [formData, setFormData] = useState({
    custosFixos: '',
    precoVenda: '',
    custoVariavel: '',
    diasOperacao: '30'
  });

  const [resultado, setResultado] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calcular = () => {
    const custosFixos = parseFloat(formData.custosFixos) || 0;
    const precoVenda = parseFloat(formData.precoVenda) || 0;
    const custoVariavel = parseFloat(formData.custoVariavel) || 0;
    const diasOperacao = parseInt(formData.diasOperacao) || 30;

    if (custosFixos <= 0 || precoVenda <= 0) {
      alert('Preencha os valores de custos fixos e preço de venda.');
      return;
    }

    if (precoVenda <= custoVariavel) {
      alert('O preço de venda deve ser maior que o custo variável para haver margem de contribuição.');
      return;
    }

    // Margem de contribuição unitária
    const margemContribuicao = precoVenda - custoVariavel;
    const margemContribuicaoPct = (margemContribuicao / precoVenda) * 100;

    // Ponto de equilíbrio em unidades
    const pontoEquilibrioUnidades = Math.ceil(custosFixos / margemContribuicao);

    // Faturamento necessário
    const faturamentoNecessario = pontoEquilibrioUnidades * precoVenda;

    // Dias para atingir break-even (assumindo venda uniforme)
    const vendasPorDia = pontoEquilibrioUnidades / diasOperacao;
    const diasBreakEven = Math.ceil(pontoEquilibrioUnidades / vendasPorDia);

    // Margem de segurança (quanto pode cair antes do prejuízo)
    const margemSegurancaPct = 100; // Será calculado quando houver vendas previstas

    setResultado({
      margemContribuicao,
      margemContribuicaoPct,
      pontoEquilibrioUnidades,
      faturamentoNecessario,
      vendasPorDia,
      diasBreakEven,
      custoFixoPorUnidade: custosFixos / pontoEquilibrioUnidades,
      custoTotal: custosFixos + (custoVariavel * pontoEquilibrioUnidades)
    });
  };

  const limpar = () => {
    setFormData({
      custosFixos: '',
      precoVenda: '',
      custoVariavel: '',
      diasOperacao: '30'
    });
    setResultado(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Calculadora de Ponto de Equilíbrio (Break-Even)
          </h1>
          <p className="text-lg text-gray-600">
            Descubra quantas unidades você precisa vender para cobrir todos os custos e começar a lucrar
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Custos Fixos Mensais (R$)
              </label>
              <input
                type="number"
                name="custosFixos"
                value={formData.custosFixos}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 10000"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">
                Aluguel, salários, água, luz, internet, etc.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Package className="w-4 h-4 inline mr-1" />
                Preço de Venda Unitário (R$)
              </label>
              <input
                type="number"
                name="precoVenda"
                value={formData.precoVenda}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 100"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">
                Quanto você cobra por produto/serviço
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Custo Variável Unitário (R$)
              </label>
              <input
                type="number"
                name="custoVariavel"
                value={formData.custoVariavel}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 40"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">
                Material, comissões, impostos sobre venda
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Período de Análise (dias)
              </label>
              <select
                name="diasOperacao"
                value={formData.diasOperacao}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7">1 Semana (7 dias)</option>
                <option value="15">Quinzena (15 dias)</option>
                <option value="30">Mês (30 dias)</option>
                <option value="90">Trimestre (90 dias)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={calcular}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              Calcular Ponto de Equilíbrio
            </button>
            <button
              onClick={limpar}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="space-y-6">
            {/* Card Principal - Ponto de Equilíbrio */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Ponto de Equilíbrio</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-blue-100 text-sm mb-2">Você precisa vender:</p>
                  <p className="text-5xl font-bold mb-2">
                    {resultado.pontoEquilibrioUnidades}
                  </p>
                  <p className="text-blue-100">unidades por mês</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-2">Faturamento necessário:</p>
                  <p className="text-5xl font-bold mb-2">
                    R$ {resultado.faturamentoNecessario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-blue-100">para cobrir todos os custos</p>
                </div>
              </div>
            </div>

            {/* Cards de Métricas */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Margem de Contribuição</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  R$ {resultado.margemContribuicao.toFixed(2)}
                </p>
                <p className="text-green-600 font-semibold text-lg">
                  {resultado.margemContribuicaoPct.toFixed(1)}% do preço
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Por unidade vendida, você contribui com R$ {resultado.margemContribuicao.toFixed(2)} para pagar custos fixos
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Vendas por Dia</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {resultado.vendasPorDia.toFixed(1)}
                </p>
                <p className="text-purple-600 font-semibold text-lg">
                  unidades/dia
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Para atingir o break-even em {resultado.diasBreakEven} dias
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Custo Fixo/Unidade</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  R$ {resultado.custoFixoPorUnidade.toFixed(2)}
                </p>
                <p className="text-orange-600 font-semibold text-lg">
                  por unidade
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Custo fixo diluído no break-even
                </p>
              </div>
            </div>

            {/* Detalhamento */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Composição de Custos no Break-Even</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Custos Fixos Totais</span>
                  <span className="font-bold text-gray-900">
                    R$ {parseFloat(formData.custosFixos).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">
                    Custos Variáveis Totais ({resultado.pontoEquilibrioUnidades} unidades × R$ {parseFloat(formData.custoVariavel).toFixed(2)})
                  </span>
                  <span className="font-bold text-gray-900">
                    R$ {(resultado.pontoEquilibrioUnidades * parseFloat(formData.custoVariavel)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <span className="font-bold text-blue-900">Custo Total no Break-Even</span>
                  <span className="font-bold text-blue-900 text-xl">
                    R$ {resultado.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                  <span className="font-bold text-green-900">Faturamento no Break-Even</span>
                  <span className="font-bold text-green-900 text-xl">
                    R$ {resultado.faturamentoNecessario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Alerta Educativo */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">⚠️ Importante: Break-Even não é lucro!</h4>
                  <p className="text-gray-700 mb-2">
                    No ponto de equilíbrio, você apenas <strong>empata</strong> (receita = custos). Para ter lucro, precisa vender <strong>mais</strong> do que {resultado.pontoEquilibrioUnidades} unidades.
                  </p>
                  <p className="text-gray-700">
                    <strong>Cada unidade vendida acima de {resultado.pontoEquilibrioUnidades}</strong> gera R$ {resultado.margemContribuicao.toFixed(2)} de lucro líquido.
                  </p>
                </div>
              </div>
            </div>

            {/* Gráfico de Ponto de Equilíbrio */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Análise Gráfica do Ponto de Equilíbrio</h3>
              <div className="h-96">
                <Line
                  data={{
                    labels: Array.from({ length: Math.ceil(resultado.pontoEquilibrioUnidades * 1.8) }, (_, i) => i),
                    datasets: [
                      {
                        label: 'Custos Totais',
                        data: Array.from({ length: Math.ceil(resultado.pontoEquilibrioUnidades * 1.8) }, (_, i) => {
                          const custoFixo = parseFloat(formData.custosFixos);
                          const custoVariavel = parseFloat(formData.custoVariavel) * i;
                          return custoFixo + custoVariavel;
                        }),
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 3,
                        tension: 0,
                        fill: false,
                        pointRadius: 0,
                        pointHoverRadius: 6
                      },
                      {
                        label: 'Receita Total',
                        data: Array.from({ length: Math.ceil(resultado.pontoEquilibrioUnidades * 1.8) }, (_, i) => {
                          return parseFloat(formData.precoVenda) * i;
                        }),
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderWidth: 3,
                        tension: 0,
                        fill: false,
                        pointRadius: 0,
                        pointHoverRadius: 6
                      },
                      {
                        label: 'Custos Fixos',
                        data: Array.from({ length: Math.ceil(resultado.pontoEquilibrioUnidades * 1.8) }, () => parseFloat(formData.custosFixos)),
                        borderColor: 'rgb(148, 163, 184)',
                        backgroundColor: 'rgba(148, 163, 184, 0.1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0,
                        fill: false,
                        pointRadius: 0
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          padding: 15,
                          font: {
                            size: 13,
                            weight: 'bold'
                          }
                        }
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                          label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                              label += ': ';
                            }
                            label += 'R$ ' + context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            return label;
                          }
                        }
                      },
                      annotation: {
                        annotations: {
                          line1: {
                            type: 'line',
                            xMin: resultado.pontoEquilibrioUnidades,
                            xMax: resultado.pontoEquilibrioUnidades,
                            borderColor: 'rgb(59, 130, 246)',
                            borderWidth: 3,
                            borderDash: [10, 5],
                            label: {
                              display: true,
                              content: `Break-Even: ${resultado.pontoEquilibrioUnidades} unidades`,
                              position: 'start'
                            }
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Quantidade de Unidades Vendidas',
                          font: {
                            size: 14,
                            weight: 'bold'
                          }
                        },
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Valor (R$)',
                          font: {
                            size: 14,
                            weight: 'bold'
                          }
                        },
                        ticks: {
                          callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                          }
                        },
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        }
                      }
                    },
                    interaction: {
                      mode: 'nearest',
                      axis: 'x',
                      intersect: false
                    }
                  }}
                />
              </div>
              <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Custos Totais</p>
                    <p className="text-gray-600">Fixos + Variáveis</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Receita Total</p>
                    <p className="text-gray-600">Preço × Quantidade</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Custos Fixos</p>
                    <p className="text-gray-600">Sempre constantes</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>📊 Como ler o gráfico:</strong> O ponto de equilíbrio está onde as linhas de Receita (verde) e Custos Totais (vermelha) se cruzam. 
                  <strong className="text-blue-700"> À esquerda = prejuízo</strong> (custos maiores que receita). 
                  <strong className="text-green-700"> À direita = lucro</strong> (receita maior que custos).
                </p>
              </div>
            </div>

            {/* Simulação de Cenários */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Simulação: E se você vender mais ou menos?</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Cenário Pessimista */}
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-sm font-semibold text-red-900 mb-2">😰 Cenário Pessimista (-30%)</p>
                  <p className="text-2xl font-bold text-red-700 mb-1">
                    {Math.ceil(resultado.pontoEquilibrioUnidades * 0.7)} unidades
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    Faturamento: R$ {(Math.ceil(resultado.pontoEquilibrioUnidades * 0.7) * parseFloat(formData.precoVenda)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <div className="pt-2 border-t border-red-300">
                    <p className="font-bold text-red-700">
                      Prejuízo: R$ {(parseFloat(formData.custosFixos) + (Math.ceil(resultado.pontoEquilibrioUnidades * 0.7) * parseFloat(formData.custoVariavel)) - (Math.ceil(resultado.pontoEquilibrioUnidades * 0.7) * parseFloat(formData.precoVenda))).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Cenário Break-Even */}
                <div className="p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                  <p className="text-sm font-semibold text-yellow-900 mb-2">😐 Break-Even (0%)</p>
                  <p className="text-2xl font-bold text-yellow-700 mb-1">
                    {resultado.pontoEquilibrioUnidades} unidades
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    Faturamento: R$ {resultado.faturamentoNecessario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <div className="pt-2 border-t border-yellow-400">
                    <p className="font-bold text-yellow-700">
                      Lucro: R$ 0,00
                    </p>
                  </div>
                </div>

                {/* Cenário Otimista */}
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-green-900 mb-2">🚀 Cenário Otimista (+50%)</p>
                  <p className="text-2xl font-bold text-green-700 mb-1">
                    {Math.ceil(resultado.pontoEquilibrioUnidades * 1.5)} unidades
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    Faturamento: R$ {(Math.ceil(resultado.pontoEquilibrioUnidades * 1.5) * parseFloat(formData.precoVenda)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <div className="pt-2 border-t border-green-300">
                    <p className="font-bold text-green-700">
                      Lucro: R$ {((Math.ceil(resultado.pontoEquilibrioUnidades * 1.5) - resultado.pontoEquilibrioUnidades) * resultado.margemContribuicao).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                💡 <strong>Dica:</strong> Vendas acima do break-even geram lucro puro de R$ {resultado.margemContribuicao.toFixed(2)} por unidade
              </p>
            </div>
          </div>
        )}

        {/* Artigo SEO */}
        <article className="max-w-4xl mx-auto mt-16 prose prose-lg">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ponto de Equilíbrio (Break-Even): O que é, Como Calcular e Por que Todo Empresário Precisa Conhecer
            </h2>

            <div className="text-gray-700 space-y-6 leading-relaxed">
              <p className="text-lg">
                O <strong>ponto de equilíbrio</strong> (ou <em>break-even point</em>) é um dos conceitos financeiros mais importantes para qualquer negócio. 
                Ele indica o momento exato em que sua empresa <strong>nem lucra, nem prejuízo</strong> — quando a receita total iguala os custos totais. 
                A partir desse ponto, cada venda adicional representa lucro puro. Antes dele, cada venda ainda está pagando custos fixos.
              </p>

              <p>
                Segundo pesquisas do SEBRAE, <strong>cerca de 60% das micro e pequenas empresas fecham as portas nos primeiros 5 anos</strong>, 
                e um dos principais motivos é a falta de controle financeiro. Muitos empresários não sabem quanto precisam faturar para cobrir custos, 
                precificam produtos sem critério e acabam vendendo no prejuízo sem perceber.
              </p>

              <p>
                Conhecer seu ponto de equilíbrio é <strong>vital</strong> para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Definir metas de vendas realistas</strong> — você sabe exatamente quantas unidades precisa vender</li>
                <li><strong>Precificar corretamente</strong> — entende qual margem é necessária para cobrir custos e lucrar</li>
                <li><strong>Planejar expansões</strong> — sabe se tem margem para investir ou se precisa aumentar vendas antes</li>
                <li><strong>Negociar com investidores</strong> — demonstra domínio financeiro e viabilidade do negócio</li>
                <li><strong>Tomar decisões estratégicas</strong> — avaliar se vale a pena reduzir preço, aumentar custos variáveis, etc.</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                📊 Como Calcular o Ponto de Equilíbrio: Fórmulas e Conceitos
              </h3>

              <p>
                O cálculo do break-even envolve <strong>três conceitos fundamentais</strong>:
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded-r-lg">
                <h4 className="font-bold text-gray-900 mb-3">1️⃣ Custos Fixos</h4>
                <p className="mb-2">
                  São despesas que <strong>não variam</strong> com a quantidade vendida. Mesmo vendendo zero, você paga:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Aluguel, IPTU, condomínio</li>
                  <li>Salários fixos (administrativo, gerência)</li>
                  <li>Água, luz, internet, telefone</li>
                  <li>Contador, softwares, seguros</li>
                  <li>Depreciação de equipamentos</li>
                </ul>
                <p className="mt-3 font-semibold">
                  <strong>Exemplo:</strong> R$ 10.000/mês em custos fixos
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 my-6 rounded-r-lg">
                <h4 className="font-bold text-gray-900 mb-3">2️⃣ Custos Variáveis Unitários</h4>
                <p className="mb-2">
                  São despesas que <strong>aumentam proporcionalmente</strong> às vendas. Quanto mais você vende, mais gasta:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Matéria-prima, insumos, embalagens</li>
                  <li>Comissões de vendedores</li>
                  <li>Impostos sobre vendas (ICMS, PIS, COFINS, ISS)</li>
                  <li>Frete de entrega ao cliente</li>
                  <li>Taxas de cartão de crédito</li>
                </ul>
                <p className="mt-3 font-semibold">
                  <strong>Exemplo:</strong> R$ 40 de custo variável por produto vendido
                </p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 my-6 rounded-r-lg">
                <h4 className="font-bold text-gray-900 mb-3">3️⃣ Margem de Contribuição Unitária (MCU)</h4>
                <p className="mb-2">
                  É o quanto <strong>sobra de cada venda</strong> para pagar os custos fixos. Calculada assim:
                </p>
                <div className="bg-white p-4 rounded-lg my-3 font-mono text-center border-2 border-purple-300">
                  <strong>MCU = Preço de Venda - Custo Variável Unitário</strong>
                </div>
                <p className="mt-3 font-semibold">
                  <strong>Exemplo:</strong> Produto vendido a R$ 100, com custo variável de R$ 40
                  <br />
                  MCU = R$ 100 - R$ 40 = <span className="text-purple-700">R$ 60</span>
                </p>
                <p className="mt-3 text-sm text-gray-700">
                  Isso significa que <strong>cada produto vendido contribui com R$ 60</strong> para pagar os R$ 10.000 de custos fixos.
                </p>
              </div>

              <h4 className="text-xl font-bold text-gray-900 mt-8 mb-4">
                🎯 Fórmula do Ponto de Equilíbrio em Unidades
              </h4>

              <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-xl border-2 border-blue-300 my-6">
                <p className="text-center text-2xl font-bold text-gray-900 mb-2">
                  PE (unidades) = Custos Fixos ÷ Margem de Contribuição Unitária
                </p>
                <p className="text-center text-gray-700 mt-4">
                  <strong>Exemplo:</strong> R$ 10.000 ÷ R$ 60 = <span className="text-blue-700 font-bold text-xl">167 unidades/mês</span>
                </p>
              </div>

              <p>
                Isso significa que você precisa vender <strong>167 produtos por mês</strong> para empatar. 
                Se vender 166, ainda está no prejuízo. Se vender 168, começa a lucrar R$ 60 (a MCU da 168ª unidade).
              </p>

              <h4 className="text-xl font-bold text-gray-900 mt-8 mb-4">
                💰 Fórmula do Ponto de Equilíbrio em Faturamento
              </h4>

              <div className="bg-gradient-to-r from-green-100 to-green-50 p-6 rounded-xl border-2 border-green-300 my-6">
                <p className="text-center text-2xl font-bold text-gray-900 mb-2">
                  PE (R$) = PE em Unidades × Preço de Venda
                </p>
                <p className="text-center text-gray-700 mt-4">
                  <strong>Exemplo:</strong> 167 unidades × R$ 100 = <span className="text-green-700 font-bold text-xl">R$ 16.700/mês</span>
                </p>
              </div>

              <p>
                Você precisa faturar <strong>R$ 16.700 por mês</strong> para cobrir todos os custos (fixos + variáveis). 
                Tudo acima disso é lucro líquido.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
                💡 Exemplos Práticos de Ponto de Equilíbrio
              </h3>

              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Exemplo 1: E-commerce de Roupas
              </h4>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <ul className="space-y-2">
                  <li><strong>Custos fixos:</strong> R$ 8.000/mês (aluguel galpão, salários, marketing fixo, software)</li>
                  <li><strong>Preço médio de venda:</strong> R$ 80 por peça</li>
                  <li><strong>Custo variável unitário:</strong> R$ 32 (produto, embalagem, frete, impostos, comissão marketplace 12%)</li>
                  <li><strong>Margem de contribuição:</strong> R$ 80 - R$ 32 = R$ 48</li>
                </ul>
                <div className="mt-4 p-4 bg-white rounded border-2 border-blue-500">
                  <p className="font-bold text-lg">
                    Ponto de Equilíbrio: R$ 8.000 ÷ R$ 48 = <span className="text-blue-700">167 peças/mês</span>
                  </p>
                  <p className="text-gray-700 mt-2">
                    Faturamento necessário: 167 × R$ 80 = <span className="font-semibold">R$ 13.360/mês</span>
                  </p>
                </div>
                <p className="mt-4 text-sm text-gray-700">
                  <strong>Interpretação:</strong> Se vender 200 peças/mês, lucro = 33 peças × R$ 48 = <strong>R$ 1.584 de lucro líquido</strong>.
                </p>
              </div>

              <h4 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                Exemplo 2: Restaurante
              </h4>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <ul className="space-y-2">
                  <li><strong>Custos fixos:</strong> R$ 25.000/mês (aluguel ponto comercial, salários fixos, gás, luz, água, contador)</li>
                  <li><strong>Ticket médio:</strong> R$ 50 por cliente</li>
                  <li><strong>Custo variável unitário:</strong> R$ 18 (comida, bebida, embalagem, taxa entrega, impostos)</li>
                  <li><strong>Margem de contribuição:</strong> R$ 50 - R$ 18 = R$ 32</li>
                </ul>
                <div className="mt-4 p-4 bg-white rounded border-2 border-blue-500">
                  <p className="font-bold text-lg">
                    Ponto de Equilíbrio: R$ 25.000 ÷ R$ 32 = <span className="text-blue-700">782 clientes/mês</span>
                  </p>
                  <p className="text-gray-700 mt-2">
                    Faturamento necessário: 782 × R$ 50 = <span className="font-semibold">R$ 39.100/mês</span>
                  </p>
                  <p className="text-gray-700 mt-2">
                    Clientes por dia (mês de 30 dias): 782 ÷ 30 = <span className="font-semibold">26 clientes/dia</span>
                  </p>
                </div>
                <p className="mt-4 text-sm text-gray-700">
                  <strong>Interpretação:</strong> Precisa atender pelo menos 26 pessoas por dia para não ter prejuízo.
                </p>
              </div>

              <h4 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                Exemplo 3: Prestador de Serviços (Consultoria)
              </h4>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <ul className="space-y-2">
                  <li><strong>Custos fixos:</strong> R$ 4.500/mês (espaço coworking, softwares, contador, marketing)</li>
                  <li><strong>Preço por projeto:</strong> R$ 3.000</li>
                  <li><strong>Custo variável unitário:</strong> R$ 450 (impostos Simples Anexo V 15%, materiais)</li>
                  <li><strong>Margem de contribuição:</strong> R$ 3.000 - R$ 450 = R$ 2.550</li>
                </ul>
                <div className="mt-4 p-4 bg-white rounded border-2 border-blue-500">
                  <p className="font-bold text-lg">
                    Ponto de Equilíbrio: R$ 4.500 ÷ R$ 2.550 = <span className="text-blue-700">1,76 → 2 projetos/mês</span>
                  </p>
                  <p className="text-gray-700 mt-2">
                    Faturamento necessário: 2 × R$ 3.000 = <span className="font-semibold">R$ 6.000/mês</span>
                  </p>
                </div>
                <p className="mt-4 text-sm text-gray-700">
                  <strong>Interpretação:</strong> Precisa fechar pelo menos 2 consultorias/mês. Do 3º projeto em diante, são R$ 2.550 de lucro líquido por projeto.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
                🚫 5 Erros Comuns ao Calcular o Ponto de Equilíbrio
              </h3>

              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-red-900 mb-2">1. Confundir custos fixos com variáveis</h4>
                  <p className="text-gray-700">
                    <strong>Erro:</strong> Colocar comissões de vendedores como custo fixo.
                    <br />
                    <strong>Correto:</strong> Comissões são custos variáveis (só paga se vender).
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-red-900 mb-2">2. Esquecer impostos sobre vendas</h4>
                  <p className="text-gray-700">
                    <strong>Erro:</strong> Não incluir ICMS, PIS, COFINS, ISS no custo variável.
                    <br />
                    <strong>Correto:</strong> Impostos variam com vendas e devem entrar no custo variável (ou ser descontados do preço de venda).
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-red-900 mb-2">3. Não incluir pró-labore/retirada dos sócios</h4>
                  <p className="text-gray-700">
                    <strong>Erro:</strong> Calcular break-even sem contar o salário do dono.
                    <br />
                    <strong>Correto:</strong> Inclua seu pró-labore nos custos fixos. O negócio precisa pagar você também!
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-red-900 mb-2">4. Usar dados desatualizados</h4>
                  <p className="text-gray-700">
                    <strong>Erro:</strong> Calcular break-even uma vez e nunca revisar.
                    <br />
                    <strong>Correto:</strong> Recalcule sempre que houver reajuste de aluguel, salários, fornecedores ou preços de venda.
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-red-900 mb-2">5. Achar que break-even é meta de lucro</h4>
                  <p className="text-gray-700">
                    <strong>Erro:</strong> Vender exatamente o ponto de equilíbrio e achar que está "indo bem".
                    <br />
                    <strong>Correto:</strong> Break-even é o <strong>mínimo</strong> para sobreviver. Sua meta deve ser vender <strong>bem acima</strong> dele para ter margem de segurança e lucro real.
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
                ❓ Perguntas Frequentes sobre Ponto de Equilíbrio
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">1. O que acontece se eu vender abaixo do ponto de equilíbrio?</h4>
                  <p className="text-gray-700">
                    Você terá <strong>prejuízo</strong>. A receita não cobre os custos totais (fixos + variáveis). 
                    O negócio consome caixa ao invés de gerar lucro. Se persistir muito tempo assim, quebra.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">2. Posso ter mais de um ponto de equilíbrio?</h4>
                  <p className="text-gray-700">
                    Sim, se você vender <strong>múltiplos produtos</strong> com margens diferentes. 
                    Nesse caso, calcule o break-even usando uma <strong>margem de contribuição ponderada</strong> (média proporcional às vendas de cada produto).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">3. Como reduzir meu ponto de equilíbrio?</h4>
                  <p className="text-gray-700">
                    Três formas:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                    <li><strong>Reduzir custos fixos</strong> — negocie aluguel, automatize processos, renegocie contratos</li>
                    <li><strong>Aumentar margem de contribuição</strong> — aumente preços ou reduza custos variáveis (negocie fornecedores)</li>
                    <li><strong>Aumentar eficiência</strong> — venda mais com a mesma estrutura fixa</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">4. Qual a diferença entre ponto de equilíbrio contábil, econômico e financeiro?</h4>
                  <p className="text-gray-700">
                    <strong>Contábil:</strong> O básico que calculamos (receita = custos totais).
                    <br />
                    <strong>Econômico:</strong> Inclui custo de oportunidade (quanto você ganharia aplicando o capital investido).
                    <br />
                    <strong>Financeiro:</strong> Considera apenas desembolsos reais (exclui depreciação, que não sai do caixa).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">5. Toda empresa precisa calcular o ponto de equilíbrio?</h4>
                  <p className="text-gray-700">
                    <strong>Sim!</strong> Do MEI ao grande varejo, conhecer seu break-even é essencial para:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                    <li>Definir metas de vendas</li>
                    <li>Precificar corretamente</li>
                    <li>Avaliar viabilidade de promoções e descontos</li>
                    <li>Planejar crescimento e investimentos</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">6. Meu ponto de equilíbrio está muito alto. É grave?</h4>
                  <p className="text-gray-700">
                    Depende. Se você <strong>consegue vender acima</strong> dele consistentemente, não há problema. 
                    Mas se está sempre no limite ou abaixo, é sinal de alerta: custos fixos altos demais ou margem de contribuição baixa demais. 
                    Reavalie modelo de negócio, estrutura e preços.
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
                📚 Termos Importantes Relacionados ao Ponto de Equilíbrio
              </h3>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-3">
                <div>
                  <strong className="text-gray-900">Margem de Segurança:</strong>
                  <p className="text-gray-700">
                    Percentual de vendas acima do break-even. Exemplo: se vende 200 unidades e o PE é 150, margem de segurança = (200-150)/200 = 25%. 
                    Quanto maior, menos arriscado.
                  </p>
                </div>
                <div>
                  <strong className="text-gray-900">Alavancagem Operacional:</strong>
                  <p className="text-gray-700">
                    Empresas com custos fixos altos têm maior alavancagem: quando vendem acima do PE, lucro cresce muito rápido. 
                    Mas abaixo do PE, prejuízo também cresce rápido.
                  </p>
                </div>
                <div>
                  <strong className="text-gray-900">Custo de Oportunidade:</strong>
                  <p className="text-gray-700">
                    O que você deixa de ganhar ao investir tempo/dinheiro no negócio ao invés de outras opções (emprego CLT, aplicações financeiras, etc.).
                  </p>
                </div>
                <div>
                  <strong className="text-gray-900">Margem de Contribuição Total:</strong>
                  <p className="text-gray-700">
                    Soma das margens de contribuição de todas as unidades vendidas. Precisa ser maior ou igual aos custos fixos para ter lucro.
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
                🎯 Conclusão: Domine Seu Ponto de Equilíbrio para Ter Controle Financeiro
              </h3>

              <p>
                O ponto de equilíbrio não é apenas uma fórmula matemática — é uma <strong>ferramenta estratégica de gestão</strong>. 
                Empresários que conhecem seu break-even tomam decisões mais conscientes sobre preços, custos, investimentos e expansão.
              </p>

              <p>
                <strong>Lembre-se:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Break-even é o <strong>mínimo</strong> para sobreviver, não a meta de lucro</li>
                <li>Recalcule sempre que houver mudanças em custos ou preços</li>
                <li>Use o gráfico de ponto de equilíbrio para visualizar prejuízo vs lucro</li>
                <li>Busque sempre aumentar sua margem de segurança (vender bem acima do PE)</li>
                <li>Analise cenários: e se as vendas caírem 20%? Ainda cobre custos?</li>
              </ul>

              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl mt-8">
                <p className="text-lg font-semibold mb-2">
                  💡 Use a calculadora acima para descobrir seu ponto de equilíbrio agora mesmo!
                </p>
                <p>
                  Insira seus custos fixos, preço de venda e custo variável. Em segundos você terá:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Quantas unidades precisa vender por mês</li>
                  <li>Faturamento necessário para empatar</li>
                  <li>Gráfico visual mostrando zona de prejuízo e lucro</li>
                  <li>Simulação de cenários otimistas e pessimistas</li>
                </ul>
                <p className="mt-4 font-bold text-xl">
                  Tome decisões com base em dados, não no achismo! 🚀
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

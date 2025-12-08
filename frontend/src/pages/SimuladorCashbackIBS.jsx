import { useState } from 'react';
import { Wallet, Heart, TrendingUp, Calculator, Info, DollarSign, Users, CheckCircle2 } from 'lucide-react';

export default function SimuladorCashbackIBS() {
  const [formData, setFormData] = useState({
    consumoMensal: '',
    categoriaGasto: 'alimentacao',
    rendaFamiliar: '',
    numPessoas: '1',
    faixaCadastro: 'cadastroUnico'
  });

  const [resultado, setResultado] = useState(null);

  const categorias = {
    alimentacao: { 
      nome: 'Alimentação',
      percentualDevolucao: 100,
      descricao: 'Produtos alimentícios básicos'
    },
    energia: { 
      nome: 'Energia Elétrica',
      percentualDevolucao: 100,
      descricao: 'Conta de luz residencial'
    },
    gas: { 
      nome: 'Gás de Cozinha',
      percentualDevolucao: 100,
      descricao: 'Botijão de gás GLP'
    },
    agua: { 
      nome: 'Água',
      percentualDevolucao: 100,
      descricao: 'Conta de água residencial'
    },
    transporte: { 
      nome: 'Transporte Público',
      percentualDevolucao: 100,
      descricao: 'Ônibus, metrô, trem'
    },
    medicamentos: { 
      nome: 'Medicamentos',
      percentualDevolucao: 100,
      descricao: 'Remédios essenciais'
    },
    higiene: { 
      nome: 'Higiene Pessoal',
      percentualDevolucao: 50,
      descricao: 'Produtos de limpeza e higiene'
    },
    outros: { 
      nome: 'Outros Gastos',
      percentualDevolucao: 0,
      descricao: 'Demais categorias (sem devolução)'
    }
  };

  const faixasRenda = {
    cadastroUnico: {
      nome: 'Cadastro Único (até R$ 218/pessoa)',
      limiteRenda: 218,
      elegivel: true,
      percentualBase: 100
    },
    baixaRenda: {
      nome: 'Baixa Renda (R$ 218 a R$ 660/pessoa)',
      limiteRenda: 660,
      elegivel: true,
      percentualBase: 80
    },
    rendaMedia: {
      nome: 'Renda Média (R$ 660 a R$ 1.200/pessoa)',
      limiteRenda: 1200,
      elegivel: false,
      percentualBase: 0
    },
    rendaAlta: {
      nome: 'Renda Alta (acima de R$ 1.200/pessoa)',
      limiteRenda: 999999,
      elegivel: false,
      percentualBase: 0
    }
  };

  const calcular = () => {
    const consumo = parseFloat(formData.consumoMensal) || 0;
    const renda = parseFloat(formData.rendaFamiliar) || 0;
    const pessoas = parseInt(formData.numPessoas) || 1;
    const categoria = categorias[formData.categoriaGasto];
    const faixa = faixasRenda[formData.faixaCadastro];

    // Renda per capita
    const rendaPerCapita = renda / pessoas;

    // Determinar elegibilidade real baseada na renda per capita
    let elegivel = faixa.elegivel;
    let percentualDevolucaoBase = faixa.percentualBase;
    
    if (rendaPerCapita > 660) {
      elegivel = false;
      percentualDevolucaoBase = 0;
    } else if (rendaPerCapita > 218) {
      percentualDevolucaoBase = 80;
    }

    // Alíquota do IBS (61% do IVA de 26,5%)
    const aliquotaIBS = 26.5 * 0.61; // 16,165%

    // IBS embutido no consumo
    const ibsEmbutido = (consumo * aliquotaIBS) / (100 + aliquotaIBS);

    // Percentual de devolução da categoria
    const percentualCategoria = categoria.percentualDevolucao;

    // Cálculo do cashback
    const valorCashbackPotencial = (ibsEmbutido * percentualCategoria * percentualDevolucaoBase) / 10000;
    const valorCashbackFinal = elegivel ? valorCashbackPotencial : 0;

    // Projeção anual
    const cashbackAnual = valorCashbackFinal * 12;

    // Impacto na renda
    const impactoRenda = renda > 0 ? (cashbackAnual / (renda * 12)) * 100 : 0;

    // Economia comparativa
    const economiaPercentual = consumo > 0 ? (valorCashbackFinal / consumo) * 100 : 0;

    setResultado({
      consumo: consumo,
      rendaFamiliar: renda,
      rendaPerCapita: rendaPerCapita,
      numPessoas: pessoas,
      categoria: categoria.nome,
      faixa: faixa.nome,
      elegivel: elegivel,
      
      tributos: {
        aliquotaIBS: aliquotaIBS,
        ibsEmbutido: ibsEmbutido,
        ibsPercentual: (ibsEmbutido / consumo) * 100
      },
      
      cashback: {
        percentualDevolucao: (percentualCategoria * percentualDevolucaoBase) / 100,
        valorMensal: valorCashbackFinal,
        valorAnual: cashbackAnual
      },
      
      impacto: {
        economiaPercentual: economiaPercentual,
        impactoRenda: impactoRenda,
        equivalenteAumento: cashbackAnual
      }
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatPercent = (valor) => {
    return `${valor.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simulador do Cashback do IBS
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra quanto você pode receber de volta do IBS como benefício para famílias de baixa renda. 
            Uma das inovações da Reforma Tributária de 2026.
          </p>
        </div>

        {/* Calculadora */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Consumo Mensal na Categoria (R$)
              </label>
              <input
                type="number"
                name="consumoMensal"
                value={formData.consumoMensal}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="500.00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoria de Gasto
              </label>
              <select
                name="categoriaGasto"
                value={formData.categoriaGasto}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {Object.entries(categorias).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.nome} - Devolução {info.percentualDevolucao}%
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Renda Familiar Total (R$)
              </label>
              <input
                type="number"
                name="rendaFamiliar"
                value={formData.rendaFamiliar}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1000.00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número de Pessoas na Família
              </label>
              <select
                name="numPessoas"
                value={formData.numPessoas}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'pessoa' : 'pessoas'}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Faixa de Renda
              </label>
              <select
                name="faixaCadastro"
                value={formData.faixaCadastro}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {Object.entries(faixasRenda).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.nome} {info.elegivel ? '✅ Elegível' : '❌ Não elegível'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={calcular}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calcular Cashback
          </button>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="space-y-6">
            
            {/* Status de Elegibilidade */}
            <div className={`rounded-2xl shadow-2xl p-8 ${
              resultado.elegivel 
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                : 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
            }`}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-full mb-4">
                  {resultado.elegivel ? (
                    <CheckCircle2 className="w-10 h-10" />
                  ) : (
                    <Info className="w-10 h-10" />
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  {resultado.elegivel ? '✅ Você TEM DIREITO ao Cashback!' : '❌ Você NÃO tem direito ao Cashback'}
                </h2>
                {resultado.elegivel ? (
                  <>
                    <div className="text-6xl md:text-7xl font-black mb-4">
                      {formatMoeda(resultado.cashback.valorMensal)}
                    </div>
                    <p className="text-xl text-green-100 mb-2">
                      Devolução mensal estimada
                    </p>
                    <p className="text-lg text-green-100">
                      {formatMoeda(resultado.cashback.valorAnual)} por ano
                    </p>
                  </>
                ) : (
                  <div className="max-w-2xl mx-auto">
                    <p className="text-lg mb-4">
                      Sua renda per capita é de {formatMoeda(resultado.rendaPerCapita)}, 
                      acima do limite de R$ 660,00 para o benefício.
                    </p>
                    <p className="text-sm opacity-90">
                      O cashback do IBS é destinado exclusivamente a famílias em situação de vulnerabilidade social 
                      cadastradas no Cadastro Único ou com renda per capita até R$ 660,00.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {resultado.elegivel && (
              <>
                {/* Detalhamento */}
                <div className="grid md:grid-cols-3 gap-6">
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">IBS Embutido</h3>
                        <p className="text-sm text-gray-600">No seu consumo</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Consumo Total</span>
                        <span className="font-semibold">{formatMoeda(resultado.consumo)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Alíquota IBS</span>
                        <span className="font-semibold">{formatPercent(resultado.tributos.aliquotaIBS)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="font-semibold text-gray-900">IBS Pago</span>
                        <span className="font-bold text-blue-600">{formatMoeda(resultado.tributos.ibsEmbutido)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Cashback</h3>
                        <p className="text-sm text-gray-600">Devolução recebida</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">% Devolução</span>
                        <span className="font-semibold">{formatPercent(resultado.cashback.percentualDevolucao)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Mensal</span>
                        <span className="font-semibold">{formatMoeda(resultado.cashback.valorMensal)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="font-semibold text-gray-900">Anual</span>
                        <span className="font-bold text-green-600">{formatMoeda(resultado.cashback.valorAnual)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Impacto</h3>
                        <p className="text-sm text-gray-600">Na sua renda</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Renda Mensal</span>
                        <span className="font-semibold">{formatMoeda(resultado.rendaFamiliar)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cashback Anual</span>
                        <span className="font-semibold">{formatMoeda(resultado.cashback.valorAnual)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="font-semibold text-gray-900">Aumento Real</span>
                        <span className="font-bold text-purple-600">{formatPercent(resultado.impacto.impactoRenda)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Composição da Família */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6 text-green-600" />
                    Análise da Sua Família
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                      <h4 className="font-bold text-green-900 mb-4">Dados Familiares</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Número de pessoas</span>
                          <span className="font-semibold">{resultado.numPessoas}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Renda total</span>
                          <span className="font-semibold">{formatMoeda(resultado.rendaFamiliar)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Renda per capita</span>
                          <span className="font-semibold">{formatMoeda(resultado.rendaPerCapita)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Categoria de consumo</span>
                          <span className="font-semibold">{resultado.categoria}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-4">Benefício Estimado</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Cashback mensal</span>
                          <span className="font-bold text-blue-600">{formatMoeda(resultado.cashback.valorMensal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Por pessoa/mês</span>
                          <span className="font-bold text-blue-600">
                            {formatMoeda(resultado.cashback.valorMensal / resultado.numPessoas)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Cashback anual</span>
                          <span className="font-bold text-blue-600">{formatMoeda(resultado.cashback.valorAnual)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Economia no consumo</span>
                          <span className="font-bold text-blue-600">{formatPercent(resultado.impacto.economiaPercentual)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Projeção Anual */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">📅 Projeção Anual do Cashback</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b-2 border-gray-300">
                          <th className="py-3 px-4">Mês</th>
                          <th className="py-3 px-4 text-right">Consumo</th>
                          <th className="py-3 px-4 text-right">IBS Embutido</th>
                          <th className="py-3 px-4 text-right">Cashback</th>
                          <th className="py-3 px-4 text-right">Acumulado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {Array.from({ length: 12 }, (_, i) => {
                          const mes = i + 1;
                          const acumulado = resultado.cashback.valorMensal * mes;
                          return (
                            <tr key={mes} className={mes % 2 === 0 ? 'bg-gray-50' : ''}>
                              <td className="py-3 px-4 font-medium">Mês {mes}</td>
                              <td className="py-3 px-4 text-right">{formatMoeda(resultado.consumo)}</td>
                              <td className="py-3 px-4 text-right text-red-600">
                                {formatMoeda(resultado.tributos.ibsEmbutido)}
                              </td>
                              <td className="py-3 px-4 text-right text-green-600 font-semibold">
                                {formatMoeda(resultado.cashback.valorMensal)}
                              </td>
                              <td className="py-3 px-4 text-right font-bold text-blue-600">
                                {formatMoeda(acumulado)}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-green-100 font-bold">
                          <td className="py-4 px-4">TOTAL ANO</td>
                          <td className="py-4 px-4 text-right">{formatMoeda(resultado.consumo * 12)}</td>
                          <td className="py-4 px-4 text-right text-red-700">
                            {formatMoeda(resultado.tributos.ibsEmbutido * 12)}
                          </td>
                          <td className="py-4 px-4 text-right text-green-700 text-lg">
                            {formatMoeda(resultado.cashback.valorAnual)}
                          </td>
                          <td className="py-4 px-4 text-right text-blue-700 text-lg">
                            {formatMoeda(resultado.cashback.valorAnual)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Info Card */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-2">
                    {resultado.elegivel ? '💡 Como Receber o Cashback' : 'ℹ️ Sobre o Cashback do IBS'}
                  </h4>
                  <p className="text-amber-800 leading-relaxed text-sm">
                    {resultado.elegivel 
                      ? 'O cashback será creditado automaticamente para famílias cadastradas no Cadastro Único. O pagamento será feito mensalmente via PIX ou crédito em conta, sem necessidade de solicitação. Mantenha seus dados atualizados no CadÚnico.'
                      : 'O cashback do IBS é um mecanismo de devolução tributária para famílias de baixa renda, garantindo que a reforma não prejudique os mais vulneráveis. Famílias com renda per capita até R$ 660 terão direito à devolução de parte do IBS pago em produtos essenciais.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Artigo SEO */}
        <article className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-lg max-w-none">
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            O Que é o Cashback do IBS?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            O <strong>Cashback do IBS</strong> é uma das principais inovações sociais da Reforma Tributária Brasileira de 2023. 
            Trata-se de um mecanismo de <strong>devolução automática</strong> de parte do IBS (Imposto sobre Bens e Serviços) 
            pago por famílias de baixa renda em produtos e serviços essenciais. O objetivo é garantir que a reforma não prejudique 
            os mais vulneráveis e promova <strong>justiça fiscal</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Diferente dos cashbacks comerciais de cartões de crédito, o cashback do IBS é um <strong>benefício social 
            obrigatório</strong> previsto na Constituição Federal, garantindo que famílias cadastradas no Cadastro Único ou 
            com renda per capita até R$ 660,00 recebam de volta uma porcentagem significativa do imposto pago em itens como 
            alimentação, energia elétrica, gás de cozinha, água e transporte público.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            Como Calcular o Cashback do IBS em 2025
          </h2>
          
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 1: Verificar Elegibilidade
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Para ter direito ao cashback, você precisa atender a um dos critérios:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>Cadastro Único:</strong> Estar inscrito no CadÚnico (renda per capita até R$ 218/mês)</li>
            <li><strong>Baixa Renda:</strong> Renda per capita entre R$ 218 e R$ 660 por mês</li>
            <li><strong>Bolsa Família:</strong> Beneficiários automáticos</li>
            <li><strong>BPC:</strong> Beneficiários de Prestação Continuada</li>
          </ul>

          <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-6">
            <h4 className="font-bold text-green-900 mb-2">Cálculo da Renda Per Capita</h4>
            <p className="text-green-800 font-mono">
              Renda Per Capita = Renda Familiar Total ÷ Número de Pessoas
            </p>
            <p className="text-sm text-green-700 mt-2">
              Exemplo: Família de 4 pessoas com renda de R$ 2.400 → R$ 600 per capita (elegível!)
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 2: Identificar o IBS Embutido
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            O IBS está embutido no preço de tudo que você compra. Para descobrir quanto de IBS você pagou:
          </p>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-6 overflow-x-auto">
            <h4 className="text-lg font-bold mb-3 text-white">Fórmula do IBS Embutido</h4>
            <pre className="text-sm">
{`Alíquota IBS = 26,5% × 0,61 = 16,165%

IBS Embutido = (Valor Pago × 16,165) ÷ (100 + 16,165)

Exemplo:
• Compra de R$ 500 em alimentos
• IBS = (500 × 16,165) ÷ 116,165
• IBS = R$ 69,58`}
            </pre>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 3: Aplicar o Percentual de Devolução
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Nem todo o IBS é devolvido. O percentual varia por categoria:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="py-3 px-4 border">Categoria</th>
                  <th className="py-3 px-4 border">% Devolução</th>
                  <th className="py-3 px-4 border">Itens Incluídos</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-green-50">
                  <td className="py-3 px-4 border font-semibold">Alimentação</td>
                  <td className="py-3 px-4 border text-center font-bold">100%</td>
                  <td className="py-3 px-4 border">Cesta básica completa</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border font-semibold">Energia Elétrica</td>
                  <td className="py-3 px-4 border text-center font-bold">100%</td>
                  <td className="py-3 px-4 border">Conta de luz residencial</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="py-3 px-4 border font-semibold">Gás de Cozinha</td>
                  <td className="py-3 px-4 border text-center font-bold">100%</td>
                  <td className="py-3 px-4 border">Botijão GLP 13kg</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border font-semibold">Água</td>
                  <td className="py-3 px-4 border text-center font-bold">100%</td>
                  <td className="py-3 px-4 border">Conta de água residencial</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="py-3 px-4 border font-semibold">Transporte Público</td>
                  <td className="py-3 px-4 border text-center font-bold">100%</td>
                  <td className="py-3 px-4 border">Ônibus, metrô, trem</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border font-semibold">Medicamentos</td>
                  <td className="py-3 px-4 border text-center font-bold">100%</td>
                  <td className="py-3 px-4 border">Remédios essenciais</td>
                </tr>
                <tr className="bg-yellow-50">
                  <td className="py-3 px-4 border font-semibold">Higiene</td>
                  <td className="py-3 px-4 border text-center font-bold">50%</td>
                  <td className="py-3 px-4 border">Produtos de limpeza</td>
                </tr>
                <tr className="bg-red-50">
                  <td className="py-3 px-4 border font-semibold">Outros</td>
                  <td className="py-3 px-4 border text-center font-bold">0%</td>
                  <td className="py-3 px-4 border">Demais categorias</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 4: Calcular o Cashback Final
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            O valor final considera sua faixa de renda:
          </p>

          <div className="bg-blue-600 text-white rounded-lg p-8 mb-6">
            <h4 className="text-2xl font-bold mb-4 text-center">Fórmula Final do Cashback</h4>
            <p className="text-center font-mono text-lg mb-4">
              Cashback = IBS Embutido × % Categoria × % Faixa Renda
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="font-bold mb-2">Cadastro Único (até R$ 218)</div>
                <div className="text-2xl font-black">100%</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="font-bold mb-2">Baixa Renda (R$ 218-660)</div>
                <div className="text-2xl font-black">80%</div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            📊 Exemplos Práticos de Cashback
          </h2>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Exemplo 1: Família no Cadastro Único
          </h3>
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
            <ul className="space-y-2 text-gray-800">
              <li><strong>Composição:</strong> 4 pessoas</li>
              <li><strong>Renda familiar:</strong> R$ 800/mês (R$ 200 per capita)</li>
              <li><strong>Gasto com alimentação:</strong> R$ 600/mês</li>
              <li className="pt-3 border-t border-gray-300">
                <strong>IBS embutido:</strong> R$ 83,50
              </li>
              <li>
                <strong>Devolução (100% × 100%):</strong> R$ 83,50/mês
              </li>
              <li className="pt-3 border-t border-gray-300 font-bold text-lg text-green-600">
                ✅ Cashback anual: R$ 1.002,00
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Exemplo 2: Família de Baixa Renda
          </h3>
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
            <ul className="space-y-2 text-gray-800">
              <li><strong>Composição:</strong> 3 pessoas</li>
              <li><strong>Renda familiar:</strong> R$ 1.800/mês (R$ 600 per capita)</li>
              <li><strong>Gasto com energia + gás:</strong> R$ 300/mês</li>
              <li className="pt-3 border-t border-gray-300">
                <strong>IBS embutido:</strong> R$ 41,75
              </li>
              <li>
                <strong>Devolução (100% × 80%):</strong> R$ 33,40/mês
              </li>
              <li className="pt-3 border-t border-gray-300 font-bold text-lg text-green-600">
                ✅ Cashback anual: R$ 400,80
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Exemplo 3: Família com Múltiplas Categorias
          </h3>
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
            <ul className="space-y-2 text-gray-800">
              <li><strong>Composição:</strong> 5 pessoas</li>
              <li><strong>Renda familiar:</strong> R$ 1.000/mês (R$ 200 per capita - CadÚnico)</li>
              <li><strong>Gastos mensais:</strong>
                <ul className="ml-6 mt-2 space-y-1 text-sm">
                  <li>→ Alimentação: R$ 800 (IBS R$ 111,33 × 100% = R$ 111,33)</li>
                  <li>→ Energia: R$ 150 (IBS R$ 20,87 × 100% = R$ 20,87)</li>
                  <li>→ Transporte: R$ 200 (IBS R$ 27,83 × 100% = R$ 27,83)</li>
                </ul>
              </li>
              <li className="pt-3 border-t border-gray-300 font-bold text-lg text-green-600">
                ✅ Cashback mensal: R$ 160,03
              </li>
              <li className="font-bold text-xl text-green-700">
                ✅ Cashback anual: R$ 1.920,36
              </li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ❌ Erros Comuns sobre o Cashback
          </h2>
          <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-4">
            <li>
              <strong>Achar que é preciso solicitar o cashback:</strong> Não! A devolução é automática para quem está 
              no Cadastro Único. Não há formulário nem pedido.
            </li>
            <li>
              <strong>Confundir com cashback de cartão:</strong> O cashback do IBS é um benefício social obrigatório, 
              não uma promoção comercial.
            </li>
            <li>
              <strong>Não atualizar dados no CadÚnico:</strong> Se seus dados estiverem desatualizados, você pode não 
              receber o benefício. Mantenha cadastro sempre atualizado.
            </li>
            <li>
              <strong>Esquecer de incluir todas as fontes de renda:</strong> A renda per capita deve considerar TODA a 
              renda familiar, incluindo pensões, benefícios e trabalhos informais.
            </li>
            <li>
              <strong>Não guardar notas fiscais:</strong> Embora não seja obrigatório na maioria dos casos, pode ser 
              necessário comprovar gastos em categorias específicas.
            </li>
            <li>
              <strong>Achar que TODO imposto é devolvido:</strong> Só o IBS é devolvido, e apenas em categorias 
              essenciais. CBS (União) não entra no cashback.
            </li>
          </ol>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ❓ Perguntas Frequentes (FAQ)
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                1. Quando começa o cashback do IBS?
              </h4>
              <p className="text-gray-700">
                O cashback entra em vigor junto com o IBS, a partir de <strong>1º de janeiro de 2027</strong>. Durante 
                2026 haverá testes pilotos em alguns municípios.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                2. Como vou receber o dinheiro?
              </h4>
              <p className="text-gray-700">
                O pagamento será feito mensalmente via <strong>PIX</strong> (chave CPF) ou crédito em conta bancária 
                cadastrada no CadÚnico. Também poderá ser creditado no cartão do Bolsa Família.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                3. Preciso pedir CPF na nota?
              </h4>
              <p className="text-gray-700">
                <strong>Sim!</strong> Para receber o cashback, você deve informar seu CPF no momento da compra. 
                Isso permite que o sistema identifique seus gastos e calcule a devolução automaticamente.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                4. E se eu não tiver conta bancária?
              </h4>
              <p className="text-gray-700">
                Você pode receber via <strong>Pix com chave CPF</strong> em qualquer conta digital gratuita (Caixa Tem, 
                PicPay, Mercado Pago, etc.) ou retirar em casas lotéricas.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                5. Quanto tempo demora para receber?
              </h4>
              <p className="text-gray-700">
                O cashback será pago até o <strong>10º dia útil do mês seguinte</strong> ao consumo. Exemplo: compras 
                de janeiro são pagas até dia 10 de fevereiro.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                6. Posso perder o benefício?
              </h4>
              <p className="text-gray-700">
                Sim, se sua renda per capita ultrapassar R$ 660,00 ou se você sair do Cadastro Único sem justificativa. 
                Atualize sempre seus dados.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                7. Vale para compras online?
              </h4>
              <p className="text-gray-700">
                <strong>Sim!</strong> Tanto compras físicas quanto online com CPF na nota geram direito ao cashback, 
                desde que sejam produtos elegíveis.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            📚 Termos Importantes
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-bold text-green-900 mb-2">Cashback do IBS</h4>
              <p className="text-gray-700 text-sm">
                Devolução automática de parte do IBS pago em produtos essenciais por famílias de baixa renda, 
                garantida pela Constituição Federal.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-900 mb-2">Cadastro Único (CadÚnico)</h4>
              <p className="text-gray-700 text-sm">
                Base de dados do governo federal que identifica famílias de baixa renda para acesso a programas 
                sociais, incluindo o cashback.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h4 className="font-bold text-purple-900 mb-2">Renda Per Capita</h4>
              <p className="text-gray-700 text-sm">
                Renda familiar total dividida pelo número de pessoas na família. É o critério principal para 
                elegibilidade ao cashback.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6">
              <h4 className="font-bold text-yellow-900 mb-2">IBS Embutido</h4>
              <p className="text-gray-700 text-sm">
                Parcela do IBS já incluída no preço final dos produtos e serviços. É calculado "por dentro" do valor pago.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-6">
              <h4 className="font-bold text-red-900 mb-2">Categorias Elegíveis</h4>
              <p className="text-gray-700 text-sm">
                Produtos e serviços essenciais que geram direito ao cashback: alimentação, energia, água, gás, 
                transporte e medicamentos.
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6">
              <h4 className="font-bold text-indigo-900 mb-2">Justiça Fiscal</h4>
              <p className="text-gray-700 text-sm">
                Princípio de que o sistema tributário deve ser progressivo, cobrando mais de quem ganha mais e 
                protegendo os mais vulneráveis.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ⚖️ O Que Diz a Legislação
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            O cashback do IBS está previsto na <strong>Emenda Constitucional nº 132/2023</strong>:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-3">
            <li>
              <strong>Artigo 156-B, § 5º:</strong> Estabelece que famílias de baixa renda inscritas no Cadastro Único 
              terão direito à devolução do IBS pago em bens e serviços essenciais.
            </li>
            <li>
              <strong>Limite de renda:</strong> Famílias com renda per capita de até meio salário mínimo (aproximadamente 
              R$ 660 em 2025) são elegíveis.
            </li>
            <li>
              <strong>Categorias beneficiadas:</strong> Alimentos, energia, água, gás, transporte público e medicamentos 
              têm devolução de 100% do IBS.
            </li>
            <li>
              <strong>Pagamento automático:</strong> Lei complementar regulamentará sistema de pagamento automático via 
              PIX ou crédito em conta.
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            🎯 Conclusão
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            O <strong>Cashback do IBS</strong> é uma conquista histórica para os mais vulneráveis. Pela primeira vez 
            no Brasil, famílias de baixa renda terão <strong>devolução automática</strong> de impostos, sem burocracia 
            ou necessidade de pedidos. Isso representa um avanço significativo na <strong>justiça fiscal</strong> e no 
            combate à desigualdade.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Para famílias que gastam R$ 1.000 por mês em itens essenciais, o cashback pode chegar a <strong>R$ 2.000 
            por ano</strong> — um valor significativo que melhora a qualidade de vida e ajuda a compensar a carga tributária. 
            É um mecanismo inteligente que torna o sistema tributário mais justo sem comprometer a arrecadação.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Use este <strong>Simulador do Cashback do IBS</strong> para estimar quanto sua família pode receber. 
            E não esqueça: mantenha seu cadastro no CadÚnico sempre atualizado e peça CPF na nota em todas as compras!
          </p>

          <div className="bg-green-600 text-white rounded-xl p-8 mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">
              💰 Calcule seu cashback agora!
            </h3>
            <p className="text-green-100 mb-6">
              Descubra quanto sua família pode economizar com a devolução do IBS.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-green-50 transition-colors"
            >
              Simular Meu Cashback
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

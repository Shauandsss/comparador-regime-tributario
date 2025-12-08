import { useState } from 'react';
import { Calculator, TrendingDown, Info, DollarSign, Percent, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function CalculadoraAliquotaEfetiva() {
  const [formData, setFormData] = useState({
    receitaBruta: '',
    creditosInsumos: '',
    creditosEnergia: '',
    creditosFrete: '',
    creditosAtivos: '',
    operacoesIsentas: '',
    operacoesReducao60: '',
    setor: 'comercio'
  });

  const [resultado, setResultado] = useState(null);

  const setores = {
    comercio: { nome: 'Comércio', aliquotaPadrao: 26.5, descricao: 'Comércio varejista e atacadista' },
    servicos: { nome: 'Serviços', aliquotaPadrao: 26.5, descricao: 'Serviços em geral' },
    industria: { nome: 'Indústria', aliquotaPadrao: 26.5, descricao: 'Indústria de transformação' },
    construcao: { nome: 'Construção Civil', aliquotaPadrao: 26.5, descricao: 'Obras e construções' },
    transporte: { nome: 'Transporte', aliquotaPadrao: 26.5, descricao: 'Transporte de cargas e passageiros' },
    tecnologia: { nome: 'Tecnologia', aliquotaPadrao: 26.5, descricao: 'Software e TI' },
    alimentos: { nome: 'Alimentos', aliquotaPadrao: 26.5, descricao: 'Produção de alimentos' }
  };

  const calcular = () => {
    const receita = parseFloat(formData.receitaBruta) || 0;
    const credInsumos = parseFloat(formData.creditosInsumos) || 0;
    const credEnergia = parseFloat(formData.creditosEnergia) || 0;
    const credFrete = parseFloat(formData.creditosFrete) || 0;
    const credAtivos = parseFloat(formData.creditosAtivos) || 0;
    const opIsentas = parseFloat(formData.operacoesIsentas) || 0;
    const opReducao = parseFloat(formData.operacoesReducao60) || 0;

    const setorInfo = setores[formData.setor];
    const aliquotaPadrao = setorInfo.aliquotaPadrao;

    // Base de cálculo ajustada (receita tributável)
    const receitaTributavel = receita - opIsentas;
    const receitaAliquotaReduzida = opReducao;
    const receitaAliquotaPadrao = receitaTributavel - receitaAliquotaReduzida;

    // Cálculo do IVA bruto
    const ivaAliquotaPadrao = (receitaAliquotaPadrao * aliquotaPadrao) / 100;
    const aliquotaReduzida = aliquotaPadrao * 0.6; // 60% da alíquota padrão
    const ivaAliquotaReduzida = (receitaAliquotaReduzida * aliquotaReduzida) / 100;
    const ivaBruto = ivaAliquotaPadrao + ivaAliquotaReduzida;

    // Total de créditos
    const totalCreditos = credInsumos + credEnergia + credFrete + credAtivos;

    // IVA líquido a recolher
    const ivaLiquido = Math.max(0, ivaBruto - totalCreditos);

    // Alíquota efetiva
    const aliquotaEfetiva = receita > 0 ? (ivaLiquido / receita) * 100 : 0;

    // Economia fiscal
    const aliquotaNominal = aliquotaPadrao;
    const economiaPercentual = aliquotaNominal - aliquotaEfetiva;
    const economiaReais = (receita * economiaPercentual) / 100;

    // Divisão IBS/CBS
    const ibsLiquido = ivaLiquido * 0.61;
    const cbsLiquido = ivaLiquido * 0.39;

    setResultado({
      receita: receita,
      receitaTributavel: receitaTributavel,
      operacoesIsentas: opIsentas,
      operacoesReducao: opReducao,
      
      tributos: {
        ivaBruto: ivaBruto,
        ivaAliquotaPadrao: ivaAliquotaPadrao,
        ivaAliquotaReduzida: ivaAliquotaReduzida,
        totalCreditos: totalCreditos,
        ivaLiquido: ivaLiquido,
        ibs: ibsLiquido,
        cbs: cbsLiquido
      },
      
      creditos: {
        insumos: credInsumos,
        energia: credEnergia,
        frete: credFrete,
        ativos: credAtivos,
        total: totalCreditos,
        percentualSobreReceita: receita > 0 ? (totalCreditos / receita) * 100 : 0
      },
      
      aliquotas: {
        nominal: aliquotaNominal,
        efetiva: aliquotaEfetiva,
        economiaPercentual: economiaPercentual,
        economiaReais: economiaReais
      },
      
      setorNome: setorInfo.nome
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
            <Percent className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Calculadora de Alíquota Efetiva IBS + CBS
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra a alíquota real que sua empresa pagará após créditos, isenções e operações mistas. 
            Calcule a economia fiscal e otimize seu planejamento tributário.
          </p>
        </div>

        {/* Calculadora */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Setor de Atividade
              </label>
              <select
                name="setor"
                value={formData.setor}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {Object.entries(setores).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.nome} - {info.descricao}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Receitas
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Receita Bruta Mensal (R$)
                  </label>
                  <input
                    type="number"
                    name="receitaBruta"
                    value={formData.receitaBruta}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="500000.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operações Isentas (R$)
                  </label>
                  <input
                    type="number"
                    name="operacoesIsentas"
                    value={formData.operacoesIsentas}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="50000.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operações com Redução 60% (R$)
                  </label>
                  <input
                    type="number"
                    name="operacoesReducao60"
                    value={formData.operacoesReducao60}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="100000.00"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Créditos Recuperáveis
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insumos (R$)
                  </label>
                  <input
                    type="number"
                    name="creditosInsumos"
                    value={formData.creditosInsumos}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="80000.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Energia (R$)
                  </label>
                  <input
                    type="number"
                    name="creditosEnergia"
                    value={formData.creditosEnergia}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="10000.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frete (R$)
                  </label>
                  <input
                    type="number"
                    name="creditosFrete"
                    value={formData.creditosFrete}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="5000.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ativos Permanentes (R$)
                  </label>
                  <input
                    type="number"
                    name="creditosAtivos"
                    value={formData.creditosAtivos}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="3000.00"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={calcular}
            className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calcular Alíquota Efetiva
          </button>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="space-y-6">
            
            {/* Destaque - Alíquota Efetiva */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Sua Alíquota Efetiva é</h2>
                <div className="text-6xl md:text-7xl font-black mb-4">
                  {formatPercent(resultado.aliquotas.efetiva)}
                </div>
                <p className="text-xl text-purple-100 mb-6">
                  Alíquota nominal: {formatPercent(resultado.aliquotas.nominal)} • 
                  Economia: {formatPercent(resultado.aliquotas.economiaPercentual)}
                </p>
                <div className="inline-flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">
                    Você economiza {formatMoeda(resultado.aliquotas.economiaReais)} por mês
                  </span>
                </div>
              </div>
            </div>

            {/* Composição do IVA */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  IVA Bruto
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alíquota Padrão</span>
                    <span className="font-semibold">{formatMoeda(resultado.tributos.ivaAliquotaPadrao)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alíquota Reduzida</span>
                    <span className="font-semibold">{formatMoeda(resultado.tributos.ivaAliquotaReduzida)}</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-purple-600">
                      {formatMoeda(resultado.tributos.ivaBruto)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl shadow-lg p-6 border-2 border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  Créditos
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Insumos</span>
                    <span className="font-semibold">{formatMoeda(resultado.creditos.insumos)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Energia</span>
                    <span className="font-semibold">{formatMoeda(resultado.creditos.energia)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frete</span>
                    <span className="font-semibold">{formatMoeda(resultado.creditos.frete)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ativos</span>
                    <span className="font-semibold">{formatMoeda(resultado.creditos.ativos)}</span>
                  </div>
                  <div className="border-t-2 border-green-300 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-green-600">
                      - {formatMoeda(resultado.creditos.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl shadow-lg p-6 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  IVA Líquido
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">IBS (Estados/Municípios)</span>
                    <span className="font-semibold">{formatMoeda(resultado.tributos.ibs)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CBS (União)</span>
                    <span className="font-semibold">{formatMoeda(resultado.tributos.cbs)}</span>
                  </div>
                  <div className="border-t-2 border-blue-300 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">A Recolher</span>
                    <span className="font-bold text-xl text-blue-600">
                      {formatMoeda(resultado.tributos.ivaLiquido)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Análise Detalhada */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">📊 Análise Detalhada</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="py-3 px-4 font-semibold">Descrição</th>
                      <th className="py-3 px-4 font-semibold text-right">Valor</th>
                      <th className="py-3 px-4 font-semibold text-right">% sobre Receita</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 px-4">Receita Bruta Total</td>
                      <td className="py-3 px-4 text-right font-semibold">{formatMoeda(resultado.receita)}</td>
                      <td className="py-3 px-4 text-right">100.00%</td>
                    </tr>
                    <tr className="bg-yellow-50">
                      <td className="py-3 px-4">(-) Operações Isentas</td>
                      <td className="py-3 px-4 text-right font-semibold text-yellow-700">
                        - {formatMoeda(resultado.operacoesIsentas)}
                      </td>
                      <td className="py-3 px-4 text-right text-yellow-700">
                        {formatPercent((resultado.operacoesIsentas / resultado.receita) * 100)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold">Receita Tributável</td>
                      <td className="py-3 px-4 text-right font-semibold">{formatMoeda(resultado.receitaTributavel)}</td>
                      <td className="py-3 px-4 text-right">
                        {formatPercent((resultado.receitaTributavel / resultado.receita) * 100)}
                      </td>
                    </tr>
                    <tr className="bg-purple-50">
                      <td className="py-3 px-4">IVA Bruto Calculado</td>
                      <td className="py-3 px-4 text-right font-semibold text-purple-700">
                        {formatMoeda(resultado.tributos.ivaBruto)}
                      </td>
                      <td className="py-3 px-4 text-right text-purple-700">
                        {formatPercent((resultado.tributos.ivaBruto / resultado.receita) * 100)}
                      </td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="py-3 px-4">(-) Créditos Recuperáveis</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-700">
                        - {formatMoeda(resultado.creditos.total)}
                      </td>
                      <td className="py-3 px-4 text-right text-green-700">
                        {formatPercent(resultado.creditos.percentualSobreReceita)}
                      </td>
                    </tr>
                    <tr className="bg-blue-100 font-bold">
                      <td className="py-4 px-4 text-lg">IVA Líquido a Recolher</td>
                      <td className="py-4 px-4 text-right text-lg text-blue-700">
                        {formatMoeda(resultado.tributos.ivaLiquido)}
                      </td>
                      <td className="py-4 px-4 text-right text-lg text-blue-700">
                        {formatPercent(resultado.aliquotas.efetiva)} ← Alíquota Efetiva
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Alert com dica */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-2">💡 Dica de Planejamento Tributário</h4>
                  <p className="text-amber-800 leading-relaxed">
                    {resultado.creditos.percentualSobreReceita < 10 
                      ? 'Você pode aumentar seus créditos fiscais comprando mais insumos tributados, investindo em ativos permanentes ou contratando serviços que geram crédito de IBS/CBS.'
                      : 'Sua empresa está aproveitando bem os créditos fiscais! Continue documentando todas as aquisições que geram direito a crédito.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Artigo SEO */}
        <article className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-lg max-w-none">
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            O Que é a Alíquota Efetiva do IBS e CBS?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A <strong>alíquota efetiva</strong> é a taxa real de tributação que uma empresa paga após considerar todos os 
            créditos fiscais, isenções e benefícios tributários. No contexto da Reforma Tributária Brasileira, que 
            implementa o <strong>IBS (Imposto sobre Bens e Serviços)</strong> e a <strong>CBS (Contribuição sobre Bens e Serviços)</strong>, 
            entender a alíquota efetiva é fundamental para o planejamento tributário eficiente.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Embora a <strong>alíquota nominal do IVA brasileiro seja de 26,5%</strong>, na prática poucas empresas pagarão 
            esse percentual completo. Isso ocorre porque o novo sistema permite o <strong>aproveitamento amplo de créditos</strong> 
            sobre insumos, energia, frete, ativos permanentes e diversos outros custos operacionais. Além disso, setores 
            específicos contam com <strong>alíquotas reduzidas ou até mesmo alíquota zero</strong>.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            Como Calcular a Alíquota Efetiva IBS/CBS em 2025
          </h2>
          
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 1: Identificar a Base de Cálculo Ajustada
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Nem toda a receita bruta é tributada. Você deve considerar:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>Receita Bruta Total:</strong> Todo o faturamento da empresa no período</li>
            <li><strong>Operações Isentas:</strong> Vendas de produtos da cesta básica, serviços de saúde/educação (alíquota zero)</li>
            <li><strong>Operações com Alíquota Reduzida:</strong> Produtos/serviços com benefício de 60% de redução</li>
            <li><strong>Receita Tributável:</strong> Receita Bruta - Operações Isentas</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
            <h4 className="font-bold text-blue-900 mb-2">Fórmula da Base de Cálculo</h4>
            <p className="text-blue-800 font-mono">
              Base Tributável = Receita Bruta - Operações Isentas
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 2: Calcular o IVA Bruto
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Aplique as alíquotas correspondentes a cada tipo de operação:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>Alíquota Padrão (26,5%):</strong> Operações comuns de comércio, indústria e serviços</li>
            <li><strong>Alíquota Reduzida (~15,9%):</strong> 60% da alíquota padrão para setores beneficiados</li>
            <li><strong>Alíquota Zero (0%):</strong> Cesta básica, saúde, educação, transporte público</li>
          </ul>

          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-6">
            <h4 className="font-bold text-purple-900 mb-2">Fórmula do IVA Bruto</h4>
            <p className="text-purple-800 font-mono text-sm">
              IVA Bruto = (Base Padrão × 26,5%) + (Base Reduzida × 15,9%) + (Base Isenta × 0%)
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 3: Identificar e Somar Todos os Créditos
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            O novo sistema permite créditos amplos sobre praticamente tudo que compõe o custo de produção:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-bold text-green-900 mb-3">✅ Geram Crédito Integral</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Matérias-primas e insumos</li>
                <li>• Mercadorias para revenda</li>
                <li>• Energia elétrica</li>
                <li>• Água, gás e combustíveis</li>
                <li>• Frete e transporte</li>
                <li>• Embalagens</li>
                <li>• Serviços terceirizados</li>
                <li>• Máquinas e equipamentos</li>
                <li>• Obras e reformas</li>
              </ul>
            </div>
            
            <div className="bg-red-50 rounded-lg p-6">
              <h4 className="font-bold text-red-900 mb-3">❌ NÃO Geram Crédito</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Produtos com alíquota zero</li>
                <li>• Uso pessoal dos sócios</li>
                <li>• Brindes e amostras grátis</li>
                <li>• Despesas com representação</li>
                <li>• Multas e juros</li>
                <li>• Gastos com infrações</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 4: Calcular o IVA Líquido
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Subtraia os créditos do IVA bruto:
          </p>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-6">
            <pre className="text-sm">
{`IVA Líquido = IVA Bruto - Total de Créditos

Exemplo prático:
• Receita Bruta: R$ 500.000
• Operações Isentas: R$ 50.000
• Base Tributável: R$ 450.000
• IVA Bruto (26,5%): R$ 119.250
• Créditos (insumos, energia, frete): R$ 98.000
• IVA Líquido: R$ 21.250`}
            </pre>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 5: Calcular a Alíquota Efetiva
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Divida o IVA líquido pela receita bruta total:
          </p>

          <div className="bg-blue-600 text-white rounded-lg p-8 mb-6 text-center">
            <h4 className="text-2xl font-bold mb-4">Fórmula Final da Alíquota Efetiva</h4>
            <p className="text-3xl font-mono font-bold mb-2">
              Alíquota Efetiva = (IVA Líquido ÷ Receita Bruta) × 100
            </p>
            <p className="text-blue-100 text-lg">
              No exemplo acima: (21.250 ÷ 500.000) × 100 = <strong>4,25%</strong>
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            📊 Exemplos Práticos de Cálculo
          </h2>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Exemplo 1: Indústria de Alimentos (Com Muitos Créditos)
          </h3>
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
            <ul className="space-y-2 text-gray-800">
              <li><strong>Receita Bruta:</strong> R$ 1.000.000</li>
              <li><strong>Créditos de insumos:</strong> R$ 400.000</li>
              <li><strong>Créditos de energia:</strong> R$ 50.000</li>
              <li><strong>Créditos de frete:</strong> R$ 30.000</li>
              <li><strong>Total de Créditos:</strong> R$ 480.000</li>
              <li><strong>IVA Bruto (26,5%):</strong> R$ 265.000</li>
              <li><strong>IVA Líquido:</strong> R$ 265.000 - R$ 480.000 = R$ 0 (crédito acumulado)</li>
              <li className="text-green-600 font-bold text-lg">✅ Alíquota Efetiva: 0% (empresa exportadora ou com créditos excedentes)</li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Exemplo 2: Comércio Varejista (Poucos Créditos)
          </h3>
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
            <ul className="space-y-2 text-gray-800">
              <li><strong>Receita Bruta:</strong> R$ 300.000</li>
              <li><strong>Créditos de mercadorias:</strong> R$ 40.000</li>
              <li><strong>Créditos de energia:</strong> R$ 2.000</li>
              <li><strong>Total de Créditos:</strong> R$ 42.000</li>
              <li><strong>IVA Bruto (26,5%):</strong> R$ 79.500</li>
              <li><strong>IVA Líquido:</strong> R$ 79.500 - R$ 42.000 = R$ 37.500</li>
              <li className="text-blue-600 font-bold text-lg">📊 Alíquota Efetiva: 12,5%</li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Exemplo 3: Prestadora de Serviços Profissionais (Alíquota Reduzida)
          </h3>
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
            <ul className="space-y-2 text-gray-800">
              <li><strong>Receita Bruta:</strong> R$ 200.000</li>
              <li><strong>Alíquota Reduzida:</strong> 15,9% (60% de 26,5%)</li>
              <li><strong>Créditos (poucos):</strong> R$ 5.000</li>
              <li><strong>IVA Bruto (15,9%):</strong> R$ 31.800</li>
              <li><strong>IVA Líquido:</strong> R$ 31.800 - R$ 5.000 = R$ 26.800</li>
              <li className="text-purple-600 font-bold text-lg">🎯 Alíquota Efetiva: 13,4%</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ❌ Erros Comuns ao Calcular a Alíquota Efetiva
          </h2>
          <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-4">
            <li>
              <strong>Não considerar todas as fontes de crédito:</strong> Muitas empresas esquecem de creditar energia, 
              água, combustível, frete e até ativos permanentes.
            </li>
            <li>
              <strong>Confundir alíquota nominal com efetiva:</strong> A alíquota de 26,5% é apenas o ponto de partida. 
              Após créditos, a taxa real será sempre menor.
            </li>
            <li>
              <strong>Ignorar operações mistas:</strong> Empresas que vendem produtos isentos e tributados devem segregar 
              corretamente as bases de cálculo.
            </li>
            <li>
              <strong>Não documentar os créditos:</strong> Sem nota fiscal ou documento hábil, não há direito a crédito. 
              Mantenha a documentação fiscal organizada.
            </li>
            <li>
              <strong>Esquecer créditos de períodos anteriores:</strong> Créditos acumulados podem ser aproveitados em 
              períodos futuros ou até ressarcidos.
            </li>
            <li>
              <strong>Não revisar periodicamente:</strong> A alíquota efetiva muda conforme o mix de produtos, fornecedores 
              e investimentos. Revise mensalmente.
            </li>
          </ol>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ❓ Perguntas Frequentes (FAQ)
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                1. A alíquota efetiva pode ser menor que 0%?
              </h4>
              <p className="text-gray-700">
                Sim! Se seus créditos superarem o IVA bruto, você acumula <strong>crédito fiscal</strong> que pode ser 
                usado em meses futuros ou ressarcido pela Receita Federal (no caso de exportadores, por exemplo).
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                2. Empresas do Simples Nacional terão alíquota efetiva diferente?
              </h4>
              <p className="text-gray-700">
                Sim. O Simples Nacional terá <strong>tratamento diferenciado</strong> com alíquotas progressivas menores 
                e sistema de crédito simplificado. A alíquota efetiva tende a ser bem menor que 26,5%.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                3. Como funciona o crédito sobre ativos permanentes?
              </h4>
              <p className="text-gray-700">
                Máquinas, equipamentos e imóveis usados na produção geram crédito parcelado ao longo da vida útil do bem. 
                Por exemplo: compra de R$ 100 mil em máquinas pode gerar crédito de R$ 26,5 mil dividido em 60 meses.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                4. E se eu comprar de fornecedor isento?
              </h4>
              <p className="text-gray-700">
                Compras de fornecedores com alíquota zero (como produtos da cesta básica) <strong>não geram crédito</strong>. 
                Por isso, prefira fornecedores que cobrem IBS/CBS quando possível.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                5. Preciso contratar contador para calcular a alíquota efetiva?
              </h4>
              <p className="text-gray-700">
                <strong>Sim, é altamente recomendado.</strong> O cálculo correto exige conhecimento técnico, segregação de 
                operações, controle de créditos e escrituração fiscal adequada. Um contador experiente em reforma tributária 
                é essencial.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                6. A alíquota efetiva será igual para IBS e CBS?
              </h4>
              <p className="text-gray-700">
                Não necessariamente. IBS e CBS são calculados proporcionalmente (61% e 39%), mas cada um pode ter regras 
                específicas de crédito e compensação. No entanto, na prática, funcionam de forma integrada.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            📚 Termos Importantes e Conceitos
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-purple-50 rounded-lg p-6">
              <h4 className="font-bold text-purple-900 mb-2">Alíquota Nominal</h4>
              <p className="text-gray-700 text-sm">
                É a alíquota prevista em lei (26,5% no caso do IVA brasileiro). Representa o percentual máximo de tributação 
                antes de créditos e benefícios.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-900 mb-2">Alíquota Efetiva</h4>
              <p className="text-gray-700 text-sm">
                É a taxa real de tributação após deduzir todos os créditos e aplicar benefícios fiscais. Representa o quanto 
                a empresa efetivamente paga de imposto.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-bold text-green-900 mb-2">Crédito Fiscal</h4>
              <p className="text-gray-700 text-sm">
                Valor de IBS/CBS pago na aquisição de insumos e serviços que pode ser deduzido do imposto devido na venda. 
                É a base do sistema não-cumulativo.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6">
              <h4 className="font-bold text-yellow-900 mb-2">Sistema Não-Cumulativo</h4>
              <p className="text-gray-700 text-sm">
                Modelo em que o imposto incide apenas sobre o valor agregado em cada etapa da cadeia produtiva, evitando 
                tributação em cascata.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-6">
              <h4 className="font-bold text-red-900 mb-2">Operação Mista</h4>
              <p className="text-gray-700 text-sm">
                Quando a empresa realiza tanto operações tributadas quanto isentas ou com alíquotas diferenciadas no mesmo 
                período de apuração.
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6">
              <h4 className="font-bold text-indigo-900 mb-2">Crédito Acumulado</h4>
              <p className="text-gray-700 text-sm">
                Situação em que os créditos superam o imposto devido. O saldo pode ser usado em períodos futuros ou 
                ressarcido (exportadores).
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ⚖️ O Que Diz a Legislação Atual
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A <strong>Emenda Constitucional nº 132/2023</strong> estabelece que o IVA brasileiro (IBS + CBS) funcionará 
            como um <strong>imposto sobre o valor agregado não-cumulativo</strong>, com direito amplo a crédito sobre 
            aquisições. Os principais pontos legais são:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-3">
            <li>
              <strong>Artigo 156-A da CF/88:</strong> Institui o IBS com competência dos Estados e Municípios, garantindo 
              creditamento amplo sobre insumos, energia e ativos.
            </li>
            <li>
              <strong>Artigo 195-A da CF/88:</strong> Institui a CBS (União) substituindo PIS/COFINS, também com sistema 
              não-cumulativo pleno.
            </li>
            <li>
              <strong>Lei Complementar (em elaboração):</strong> Definirá regras operacionais detalhadas sobre cálculo de 
              créditos, segregação de operações mistas e ressarcimento de saldos credores.
            </li>
            <li>
              <strong>Alíquota padrão de 26,5%:</strong> Definida pelo Congresso Nacional em 2024, podendo ser ajustada 
              anualmente conforme necessidades de arrecadação.
            </li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-blue-900 mb-2">Transição Gradual</h4>
                <p className="text-blue-800 text-sm">
                  A alíquota efetiva será diferente durante o período de transição (2027-2032), pois haverá coexistência 
                  de tributos antigos (ICMS, ISS, PIS, COFINS) com os novos (IBS e CBS). O cálculo será mais complexo 
                  nesse período.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            🎯 Conclusão
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Compreender e calcular corretamente a <strong>alíquota efetiva de IBS e CBS</strong> é essencial para o 
            planejamento tributário de qualquer empresa brasileira pós-reforma. Embora a alíquota nominal seja elevada 
            (26,5%), o sistema de créditos amplos e os benefícios fiscais fazem com que a <strong>carga tributária real 
            seja significativamente menor</strong> para a maioria das empresas.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Empresas que investem em <strong>gestão fiscal eficiente</strong>, mantêm documentação organizada e aproveitam 
            todos os créditos disponíveis conseguem reduzir sua alíquota efetiva para níveis bem inferiores à taxa nominal. 
            Indústrias com muitos insumos tributados, por exemplo, podem ter alíquotas efetivas próximas a <strong>5% 
            ou até negativas</strong> (crédito acumulado).
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Use esta <strong>Calculadora de Alíquota Efetiva</strong> regularmente para monitorar sua carga tributária 
            real e identificar oportunidades de otimização fiscal. Quanto melhor você entender sua alíquota efetiva, 
            mais competitiva sua empresa será no mercado pós-reforma tributária.
          </p>

          <div className="bg-purple-600 text-white rounded-xl p-8 mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">
              📊 Monitore sua alíquota efetiva mensalmente!
            </h3>
            <p className="text-purple-100 mb-6">
              Simule diferentes cenários de compras, investimentos e operações para otimizar sua carga tributária.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Calcular Novamente
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Calculator, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function SimuladorImpactoReforma() {
  const [formData, setFormData] = useState({
    faturamento: '',
    estado: 'SP',
    setor: 'comercio',
    creditosAtuais: ''
  });

  const [resultado, setResultado] = useState(null);

  const setores = {
    comercio: { nome: 'Comércio', pisCofinsCumulativo: 3.65, aliquotaIVA: 26.5 },
    servicos: { nome: 'Serviços', pisCofinsCumulativo: 3.65, aliquotaIVA: 26.5 },
    industria: { nome: 'Indústria', pisCofinsNaoCumulativo: 9.25, aliquotaIVA: 26.5 },
    saude: { nome: 'Saúde', pisCofinsCumulativo: 3.65, aliquotaIVA: 0, beneficio: 'Alíquota Zero' },
    educacao: { nome: 'Educação', pisCofinsCumulativo: 3.65, aliquotaIVA: 0, beneficio: 'Alíquota Zero' },
    alimentosBasicos: { nome: 'Alimentos (Cesta Básica)', pisCofinsCumulativo: 3.65, aliquotaIVA: 0, beneficio: 'Alíquota Zero' },
    transporte: { nome: 'Transporte Público', pisCofinsCumulativo: 3.65, aliquotaIVA: 0, beneficio: 'Alíquota Zero' }
  };

  const aliquotasICMS = {
    SP: 18, RJ: 18, MG: 18, RS: 17, PR: 19, SC: 17, BA: 19, PE: 18, CE: 18
  };

  const aliquotasISS = {
    comercio: 0,
    servicos: 5,
    industria: 0,
    saude: 5,
    educacao: 5,
    alimentosBasicos: 0,
    transporte: 0
  };

  const calcular = () => {
    const fat = parseFloat(formData.faturamento) || 0;
    const creditos = parseFloat(formData.creditosAtuais) || 0;
    const setor = setores[formData.setor];
    const icms = aliquotasICMS[formData.estado] || 18;
    const iss = aliquotasISS[formData.setor] || 0;

    // SISTEMA ATUAL
    const pisCofinsCumulativo = setor.pisCofinsCumulativo || 3.65;
    const pisCofinsNaoCumulativo = setor.pisCofinsNaoCumulativo || 0;
    const pisCofinsFinal = pisCofinsNaoCumulativo > 0 ? pisCofinsNaoCumulativo : pisCofinsCumulativo;

    const valorPisCofins = (fat * pisCofinsFinal) / 100;
    const valorICMS = (fat * icms) / 100;
    const valorISS = (fat * iss) / 100;
    const totalAntigo = valorPisCofins + valorICMS + valorISS - creditos;

    // SISTEMA NOVO (IBS + CBS)
    const aliquotaIVA = setor.aliquotaIVA || 26.5;
    const valorIVA = (fat * aliquotaIVA) / 100;
    const creditosIVA = creditos * 1.2; // Créditos mais amplos na reforma
    const totalNovo = valorIVA - creditosIVA;

    const diferenca = totalNovo - totalAntigo;
    const percentualDiferenca = totalAntigo > 0 ? (diferenca / totalAntigo) * 100 : 0;

    setResultado({
      faturamento: fat,
      sistemaAtual: {
        pisCofins: valorPisCofins,
        icms: valorICMS,
        iss: valorISS,
        creditos: creditos,
        total: totalAntigo
      },
      sistemaNovo: {
        ibs: (valorIVA * 0.61), // 61% para estados/municípios
        cbs: (valorIVA * 0.39), // 39% para União
        total: valorIVA,
        creditos: creditosIVA,
        totalLiquido: totalNovo
      },
      diferenca: diferenca,
      percentual: percentualDiferenca,
      impacto: diferenca > 0 ? 'aumento' : diferenca < 0 ? 'reducao' : 'neutro',
      setor: setor.nome,
      estado: formData.estado,
      beneficio: setor.beneficio || null
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-10 h-10" />
          <h1 className="text-3xl font-bold">Simulador de Impacto Geral da Reforma Tributária 2026</h1>
        </div>
        <p className="text-blue-100 text-lg">
          Compare a tributação atual (PIS, COFINS, ICMS, ISS) com o novo modelo unificado IBS + CBS.
          Descubra o impacto real na sua empresa!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">📊 Dados da Empresa</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faturamento Anual (R$)
            </label>
            <input
              type="text"
              name="faturamento"
              value={formData.faturamento}
              onChange={handleChange}
              placeholder="1200000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="SP">São Paulo (18%)</option>
              <option value="RJ">Rio de Janeiro (18%)</option>
              <option value="MG">Minas Gerais (18%)</option>
              <option value="RS">Rio Grande do Sul (17%)</option>
              <option value="PR">Paraná (19%)</option>
              <option value="SC">Santa Catarina (17%)</option>
              <option value="BA">Bahia (19%)</option>
              <option value="PE">Pernambuco (18%)</option>
              <option value="CE">Ceará (18%)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Setor de Atuação
            </label>
            <select
              name="setor"
              value={formData.setor}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="comercio">Comércio</option>
              <option value="servicos">Serviços</option>
              <option value="industria">Indústria</option>
              <option value="saude">Saúde (Alíquota Zero)</option>
              <option value="educacao">Educação (Alíquota Zero)</option>
              <option value="alimentosBasicos">Alimentos - Cesta Básica (Alíquota Zero)</option>
              <option value="transporte">Transporte Público (Alíquota Zero)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Créditos Tributários Atuais (R$/ano)
            </label>
            <input
              type="text"
              name="creditosAtuais"
              value={formData.creditosAtuais}
              onChange={handleChange}
              placeholder="50000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Créditos de PIS/COFINS não-cumulativo ou outros
            </p>
          </div>

          <button
            onClick={calcular}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Calcular Impacto
          </button>
        </div>

        {resultado && (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Sistema Atual (2025)
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">PIS + COFINS</span>
                  <span className="font-semibold">{formatMoeda(resultado.sistemaAtual.pisCofins)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">ICMS</span>
                  <span className="font-semibold">{formatMoeda(resultado.sistemaAtual.icms)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">ISS</span>
                  <span className="font-semibold">{formatMoeda(resultado.sistemaAtual.iss)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-200 bg-green-50">
                  <span className="text-green-700">(-) Créditos</span>
                  <span className="font-semibold text-green-700">
                    -{formatMoeda(resultado.sistemaAtual.creditos)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-gray-100 px-3 rounded mt-4">
                  <span className="font-bold text-gray-900">Total a Pagar</span>
                  <span className="font-bold text-xl text-gray-900">
                    {formatMoeda(resultado.sistemaAtual.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Sistema Novo (2026+)
              </h3>
              
              {resultado.beneficio && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">{resultado.beneficio}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">IBS (Estados/Municípios)</span>
                  <span className="font-semibold">{formatMoeda(resultado.sistemaNovo.ibs)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">CBS (União)</span>
                  <span className="font-semibold">{formatMoeda(resultado.sistemaNovo.cbs)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-200 bg-green-50">
                  <span className="text-green-700">(-) Créditos IBS/CBS</span>
                  <span className="font-semibold text-green-700">
                    -{formatMoeda(resultado.sistemaNovo.creditos)}
                  </span>
                </div>
                <div className={`flex justify-between items-center py-3 px-3 rounded mt-4 ${
                  resultado.impacto === 'reducao' ? 'bg-green-100' : 
                  resultado.impacto === 'aumento' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  <span className="font-bold text-gray-900">Total a Pagar</span>
                  <span className={`font-bold text-xl ${
                    resultado.impacto === 'reducao' ? 'text-green-700' : 
                    resultado.impacto === 'aumento' ? 'text-red-700' : 'text-gray-900'
                  }`}>
                    {formatMoeda(resultado.sistemaNovo.totalLiquido)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {resultado && (
        <div className={`rounded-lg shadow-lg p-8 mb-8 ${
          resultado.impacto === 'reducao' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
          resultado.impacto === 'aumento' ? 'bg-gradient-to-r from-red-500 to-orange-600' :
          'bg-gradient-to-r from-gray-500 to-slate-600'
        } text-white`}>
          <h3 className="text-2xl font-bold mb-4">📊 Resultado do Impacto</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Diferença Anual</p>
              <p className="text-3xl font-bold">
                {resultado.diferenca >= 0 ? '+' : ''}{formatMoeda(Math.abs(resultado.diferenca))}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Variação Percentual</p>
              <p className="text-3xl font-bold">
                {resultado.percentual >= 0 ? '+' : ''}{resultado.percentual.toFixed(2)}%
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Impacto</p>
              <p className="text-2xl font-bold">
                {resultado.impacto === 'reducao' ? '✅ Redução de Carga' :
                 resultado.impacto === 'aumento' ? '⚠️ Aumento de Carga' :
                 '➡️ Impacto Neutro'}
              </p>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Análise do Resultado
            </h4>
            <p className="text-sm leading-relaxed">
              {resultado.impacto === 'reducao' ? 
                `Sua empresa terá uma redução de carga tributária de ${formatMoeda(Math.abs(resultado.diferenca))} por ano com a reforma. ${resultado.beneficio ? 'Você se beneficia da alíquota zero para o setor de ' + resultado.setor + '.' : 'Os créditos mais amplos do IBS/CBS contribuem para essa economia.'}` :
                resultado.impacto === 'aumento' ?
                `Sua empresa terá um aumento de carga tributária de ${formatMoeda(Math.abs(resultado.diferenca))} por ano com a reforma. Considere revisar sua estrutura de custos e créditos tributários para mitigar esse impacto.` :
                `A reforma tributária terá impacto neutro na sua empresa. A nova sistemática IBS+CBS equilibra com os tributos atuais.`
              }
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📚 Entenda a Reforma Tributária 2026</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">🔄 O que muda?</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">❌</span>
                <span><strong>Acabam:</strong> PIS, COFINS, ICMS e ISS</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✅</span>
                <span><strong>Entram:</strong> IBS (Imposto sobre Bens e Serviços) e CBS (Contribuição sobre Bens e Serviços)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">📊</span>
                <span><strong>Alíquota Padrão:</strong> IBS + CBS = ~26,5% (estimativa)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">🎯 Setores Beneficiados</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✅</span>
                <span><strong>Alíquota Zero:</strong> Saúde, Educação, Transporte Público</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✅</span>
                <span><strong>Alíquota Zero:</strong> Cesta Básica Nacional</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">📉</span>
                <span><strong>Alíquota Reduzida:</strong> Alguns alimentos, medicamentos e serviços</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Importante sobre a Transição (2026-2033)
        </h4>
        <p className="text-blue-800 leading-relaxed">
          A reforma será implementada gradualmente entre 2026 e 2033. Os tributos antigos serão reduzidos 
          progressivamente enquanto IBS e CBS aumentam até substituí-los completamente em 2033. 
          Use nosso <strong>Simulador de Transição</strong> para ver o impacto ano a ano!
        </p>
      </div>

      {/* Artigo SEO */}
      <article className="bg-white rounded-lg shadow-lg p-8 mt-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Reforma Tributária 2026: Entenda o Impacto do IBS e CBS na Sua Empresa
        </h2>

        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          A <strong>Reforma Tributária aprovada pela Emenda Constitucional 132/2023</strong> representa a maior 
          mudança no sistema tributário brasileiro em décadas. Com a criação do <strong>IBS (Imposto sobre Bens e Serviços)</strong> 
          e da <strong>CBS (Contribuição sobre Bens e Serviços)</strong>, empresas de todos os setores precisam entender 
          como essa transformação afetará sua carga tributária a partir de 2026.
        </p>

        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-300 rounded-xl p-6 my-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">🎯 O Que Você Vai Aprender Neste Guia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">✓</span>
              <span>Como funcionam IBS e CBS</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">✓</span>
              <span>Diferenças entre sistema atual e novo</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">✓</span>
              <span>Setores beneficiados com alíquota zero</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">✓</span>
              <span>Como calcular o impacto real</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">✓</span>
              <span>Cronograma da transição (2026-2033)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">✓</span>
              <span>Estratégias de preparação</span>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">O Que São IBS e CBS?</h3>

        <p className="mb-4">
          IBS e CBS são os <strong>dois novos tributos</strong> que substituirão os cinco principais impostos sobre consumo 
          no Brasil: PIS, COFINS, ICMS, ISS e IPI. Essa unificação visa simplificar o sistema tributário brasileiro e 
          torná-lo mais transparente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              CBS - Contribuição sobre Bens e Serviços
            </h4>
            <ul className="space-y-2 text-sm text-gray-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Natureza:</strong> Contribuição Federal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Substitui:</strong> PIS e COFINS</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Gestão:</strong> Receita Federal (União)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Peso:</strong> ~39% do IVA total</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Início:</strong> 2026 (teste), 2027 (efetivo)</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border-2 border-indigo-300">
            <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">🏢</span>
              IBS - Imposto sobre Bens e Serviços
            </h4>
            <ul className="space-y-2 text-sm text-gray-800">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span><strong>Natureza:</strong> Imposto Subnacional</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span><strong>Substitui:</strong> ICMS, ISS e IPI</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span><strong>Gestão:</strong> Comitê Gestor (Estados + Municípios)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span><strong>Peso:</strong> ~61% do IVA total</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span><strong>Início:</strong> 2027 (10%), 2033 (100%)</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Sistema Atual vs Sistema Novo: Entenda as Diferenças</h3>

        <div className="overflow-x-auto my-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                <th className="p-4 text-left font-bold">Aspecto</th>
                <th className="p-4 text-left font-bold">Sistema Atual (até 2026)</th>
                <th className="p-4 text-left font-bold">Sistema Novo (2033)</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4 font-semibold">Tributos</td>
                <td className="p-4">5 tributos (PIS, COFINS, ICMS, ISS, IPI)</td>
                <td className="p-4 text-green-700 font-semibold">2 tributos (IBS + CBS)</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50 bg-gray-50">
                <td className="p-4 font-semibold">Legislação</td>
                <td className="p-4">27 estados + 5.570 municípios diferentes</td>
                <td className="p-4 text-green-700 font-semibold">1 lei nacional unificada</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4 font-semibold">Cumulatividade</td>
                <td className="p-4">Cumulativo (PIS/COFINS para comércio)</td>
                <td className="p-4 text-green-700 font-semibold">100% não-cumulativo</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50 bg-gray-50">
                <td className="p-4 font-semibold">Créditos</td>
                <td className="p-4">Limitados e complexos</td>
                <td className="p-4 text-green-700 font-semibold">Amplos e automáticos</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4 font-semibold">Guerra Fiscal</td>
                <td className="p-4">Benefícios estaduais conflitantes</td>
                <td className="p-4 text-green-700 font-semibold">Fim da guerra fiscal</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50 bg-gray-50">
                <td className="p-4 font-semibold">Alíquota Média</td>
                <td className="p-4">~34% (soma de todos)</td>
                <td className="p-4 text-blue-700 font-semibold">~26,5% (IBS + CBS)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Como Calcular o Impacto do IBS + CBS na Sua Empresa</h3>

        <p className="mb-4">
          O cálculo do impacto da reforma depende de <strong>4 fatores principais</strong>:
        </p>

        <div className="space-y-4 my-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-5 rounded-r-xl">
            <h4 className="font-bold text-purple-900 mb-2">1️⃣ Faturamento Anual</h4>
            <p className="text-sm text-gray-700">
              Base de cálculo para todos os tributos. Quanto maior o faturamento, maior o volume absoluto de impostos, 
              mas a alíquota permanece proporcional.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-5 rounded-r-xl">
            <h4 className="font-bold text-blue-900 mb-2">2️⃣ Setor de Atividade</h4>
            <p className="text-sm text-gray-700">
              Alguns setores têm <strong>alíquota zero</strong> (saúde, educação, transporte) ou <strong>reduzida</strong> (medicamentos, 
              cultura). Setores padrão pagam a alíquota cheia de ~26,5%.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-5 rounded-r-xl">
            <h4 className="font-bold text-green-900 mb-2">3️⃣ Estado (ICMS Atual)</h4>
            <p className="text-sm text-gray-700">
              O ICMS varia de 17% a 19% por estado. Estados com ICMS alto (19%) terão menor impacto, 
              pois o IBS/CBS de 26,5% não aumenta tanto. Estados com ICMS baixo (17%) sentirão mais o aumento.
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-5 rounded-r-xl">
            <h4 className="font-bold text-orange-900 mb-2">4️⃣ Créditos Tributários</h4>
            <p className="text-sm text-gray-700">
              No sistema novo, os créditos são <strong>amplos e automáticos</strong>. A maioria das empresas terá 
              créditos ~20% maiores, o que reduz significativamente a carga tributária líquida.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-6 my-6">
          <h4 className="font-bold text-indigo-900 mb-4 text-center text-lg">🧮 Fórmula de Cálculo do Impacto</h4>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
              <p className="font-semibold text-gray-700 mb-2">Sistema Atual (2025):</p>
              <div className="font-mono text-sm text-gray-800">
                Total = PIS (1,65%) + COFINS (7,6% ou 3%) + ICMS (17-19%) + ISS (0-5%) - Créditos
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-indigo-300">
              <p className="font-semibold text-indigo-700 mb-2">Sistema Novo (2033):</p>
              <div className="font-mono text-sm text-indigo-800">
                Total = IBS (16,15%) + CBS (10,35%) - Créditos × 1,2
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-lg">
              <p className="font-bold mb-2 text-center">Impacto Final:</p>
              <div className="font-mono text-center text-lg">
                Diferença = Sistema Novo - Sistema Atual
              </div>
              <p className="text-xs text-center mt-2 opacity-90">
                Valor negativo = redução de carga | Valor positivo = aumento de carga
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Setores Beneficiados: Quem Ganha com a Reforma?</h3>

        <p className="mb-4">
          A reforma prevê <strong>alíquota zero</strong> para setores essenciais e <strong>alíquota reduzida</strong> (60% 
          da alíquota padrão) para produtos e serviços específicos. Veja quem será beneficiado:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
            <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              Alíquota Zero (0%)
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Saúde:</strong> Hospitais, clínicas, consultas médicas, exames</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Educação:</strong> Escolas, universidades, cursos técnicos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Transporte Público:</strong> Ônibus, metrô, trens urbanos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Cesta Básica Nacional:</strong> Arroz, feijão, carne, leite, pão</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Produtos Agropecuários:</strong> Insumos e produtos in natura</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📉</span>
              Alíquota Reduzida (60%)
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Medicamentos:</strong> Remédios de uso contínuo e genéricos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Cultura:</strong> Livros, cinemas, teatros, shows, museus</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Saneamento:</strong> Água e esgoto</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Alguns Alimentos:</strong> Produtos não essenciais da alimentação</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Dispositivos Médicos:</strong> Próteses, cadeiras de rodas</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Cronograma da Transição (2026-2033): Como Será Implementada</h3>

        <p className="mb-4">
          A reforma <strong>não será implementada de uma só vez</strong>. Haverá um período de transição de 8 anos, 
          onde os tributos antigos serão gradualmente substituídos pelos novos. Veja o cronograma oficial:
        </p>

        <div className="space-y-3 my-6">
          <div className="bg-gray-100 border-l-4 border-gray-500 p-4 rounded-r-lg">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-bold text-gray-900 text-lg">2025</span>
              <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">ANTES DA REFORMA</span>
            </div>
            <p className="text-sm text-gray-700">Sistema tributário atual permanece em vigor. Último ano completo com PIS, COFINS, ICMS e ISS.</p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-bold text-yellow-900 text-lg">2026</span>
              <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">TESTE CBS</span>
            </div>
            <p className="text-sm text-gray-700">CBS cobrada em caráter experimental com alíquota de <strong>0,5%</strong>. Sistema antigo continua integral.</p>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-bold text-orange-900 text-lg">2027</span>
              <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded">INÍCIO EFETIVO</span>
            </div>
            <p className="text-sm text-gray-700"><strong>PIS e COFINS extintos.</strong> CBS 100% em vigor. IBS começa com 10%, ICMS e ISS reduzem 10%.</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-bold text-blue-900 text-lg">2028-2032</span>
              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">TRANSIÇÃO GRADUAL</span>
            </div>
            <p className="text-sm text-gray-700">IBS aumenta progressivamente (20%, 30%, 40%, 50%, 90%) enquanto ICMS/ISS diminuem na mesma proporção.</p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-bold text-green-900 text-lg">2033</span>
              <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">SISTEMA NOVO COMPLETO</span>
            </div>
            <p className="text-sm text-gray-700"><strong>ICMS e ISS extintos.</strong> IBS e CBS em 100%. Sistema totalmente unificado.</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Vantagens e Desvantagens da Reforma Tributária</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
            <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              Vantagens
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <div>
                  <strong>Simplificação:</strong> De 5 tributos para apenas 2
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <div>
                  <strong>Transparência:</strong> Alíquota única por destino
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <div>
                  <strong>Créditos Amplos:</strong> Aproveitamento total e automático
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <div>
                  <strong>Fim da Guerra Fiscal:</strong> Isonomia entre estados
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <div>
                  <strong>Benefícios Setoriais:</strong> Alíquota zero para saúde e educação
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <div>
                  <strong>Competitividade:</strong> Brasil alinhado com IVA internacional
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6">
            <h4 className="font-bold text-red-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Desafios
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-1">!</span>
                <div>
                  <strong>Alíquota Alta:</strong> 26,5% é uma das maiores do mundo
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-1">!</span>
                <div>
                  <strong>Transição Longa:</strong> 8 anos de adaptação e custos duplos
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-1">!</span>
                <div>
                  <strong>Custos de Adaptação:</strong> Sistemas, processos, treinamento
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-1">!</span>
                <div>
                  <strong>Setores Prejudicados:</strong> Alguns terão aumento de carga
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-1">!</span>
                <div>
                  <strong>Incerteza Regulatória:</strong> Muitos detalhes ainda em definição
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-1">!</span>
                <div>
                  <strong>Cashback Complexo:</strong> Devolução para baixa renda ainda não detalhada
                </div>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Como Preparar Sua Empresa para a Reforma Tributária</h3>

        <p className="mb-4">
          A transição de 8 anos pode parecer longa, mas empresas precisam começar a se preparar <strong>agora</strong>. 
          Veja as principais ações recomendadas:
        </p>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-6 my-6">
          <h4 className="font-bold text-indigo-900 mb-4 text-lg">📋 Checklist de Preparação (2025-2026)</h4>
          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer hover:bg-indigo-100 p-3 rounded-lg transition">
              <input type="checkbox" className="mt-1" />
              <div className="flex-1">
                <strong className="text-indigo-900">Simule o impacto real na sua empresa</strong>
                <p className="text-xs text-gray-600 mt-1">Use nossa calculadora para entender se terá aumento ou redução de carga</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-indigo-100 p-3 rounded-lg transition">
              <input type="checkbox" className="mt-1" />
              <div className="flex-1">
                <strong className="text-indigo-900">Mapeie seus créditos tributários atuais</strong>
                <p className="text-xs text-gray-600 mt-1">Identifique quanto você recupera hoje para comparar com o sistema novo</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-indigo-100 p-3 rounded-lg transition">
              <input type="checkbox" className="mt-1" />
              <div className="flex-1">
                <strong className="text-indigo-900">Avalie sistemas de ERP e emissão de nota fiscal</strong>
                <p className="text-xs text-gray-600 mt-1">Sistemas precisarão ser adaptados para IBS e CBS</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-indigo-100 p-3 rounded-lg transition">
              <input type="checkbox" className="mt-1" />
              <div className="flex-1">
                <strong className="text-indigo-900">Treine equipe contábil e fiscal</strong>
                <p className="text-xs text-gray-600 mt-1">Profissionais precisam entender as novas regras desde já</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-indigo-100 p-3 rounded-lg transition">
              <input type="checkbox" className="mt-1" />
              <div className="flex-1">
                <strong className="text-indigo-900">Revise contratos de longo prazo</strong>
                <p className="text-xs text-gray-600 mt-1">Contratos de 2026+ devem prever mudanças tributárias</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-indigo-100 p-3 rounded-lg transition">
              <input type="checkbox" className="mt-1" />
              <div className="flex-1">
                <strong className="text-indigo-900">Planeje fluxo de caixa ano a ano</strong>
                <p className="text-xs text-gray-600 mt-1">A carga tributária mudará a cada ano de 2027 a 2033</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-indigo-100 p-3 rounded-lg transition">
              <input type="checkbox" className="mt-1" />
              <div className="flex-1">
                <strong className="text-indigo-900">Consulte especialista em planejamento tributário</strong>
                <p className="text-xs text-gray-600 mt-1">Análise personalizada pode revelar oportunidades de economia</p>
              </div>
            </label>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Base Legal da Reforma Tributária</h3>

        <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6 my-6">
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-indigo-600 font-bold text-lg">📜</span>
              <div>
                <strong className="text-gray-900">Emenda Constitucional 132/2023</strong>
                <p className="text-gray-700 mt-1">
                  Aprovada em dezembro de 2023, altera a Constituição Federal para criar IBS e CBS, 
                  definir cronograma de transição e estabelecer setores beneficiados.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-600 font-bold text-lg">📜</span>
              <div>
                <strong className="text-gray-900">Lei Complementar (em elaboração)</strong>
                <p className="text-gray-700 mt-1">
                  Regulamentará aspectos operacionais: alíquotas finais, regras de crédito, obrigações acessórias, 
                  cashback e detalhes do comitê gestor do IBS.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-600 font-bold text-lg">📜</span>
              <div>
                <strong className="text-gray-900">Convênio ICMS/IBS (futuro)</strong>
                <p className="text-gray-700 mt-1">
                  Estados e municípios precisarão estabelecer convênios para gestão compartilhada do IBS 
                  através do Comitê Gestor.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Perguntas Frequentes sobre IBS e CBS</h3>

        <div className="space-y-4 my-6">
          <details className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4 cursor-pointer">
            <summary className="font-bold text-blue-900">
              Qual será a alíquota final do IBS + CBS?
            </summary>
            <p className="text-sm text-gray-700 mt-3 pl-4">
              A estimativa oficial é de <strong>~26,5%</strong> (IBS 16,15% + CBS 10,35%), mas o valor exato será 
              definido pelo Comitê Gestor do IBS e pela Receita Federal em 2026. Pode variar ligeiramente para cima ou para baixo 
              dependendo da arrecadação necessária para manter a neutralidade fiscal.
            </p>
          </details>

          <details className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4 cursor-pointer">
            <summary className="font-bold text-blue-900">
              Quem pagará mais impostos com a reforma?
            </summary>
            <p className="text-sm text-gray-700 mt-3 pl-4">
              Setores que <strong>hoje têm muitos benefícios fiscais</strong> (isenções estaduais, regimes especiais) 
              ou que operam no <strong>regime cumulativo</strong> (comércio com baixa margem) podem ter aumento. 
              Já setores de <strong>serviços com alta folha de pagamento</strong> e que pagam ISS alto tendem a ter redução.
            </p>
          </details>

          <details className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4 cursor-pointer">
            <summary className="font-bold text-blue-900">
              O Simples Nacional vai continuar existindo?
            </summary>
            <p className="text-sm text-gray-700 mt-3 pl-4">
              <strong>Sim!</strong> O Simples Nacional será mantido, mas com adaptações. Micro e pequenas empresas 
              continuarão pagando em guia única, mas os percentuais serão ajustados para refletir IBS e CBS ao invés 
              dos tributos antigos. A legislação específica será publicada até 2026.
            </p>
          </details>

          <details className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4 cursor-pointer">
            <summary className="font-bold text-blue-900">
              Como funciona o cashback para população de baixa renda?
            </summary>
            <p className="text-sm text-gray-700 mt-3 pl-4">
              Famílias de baixa renda inscritas no <strong>CadÚnico</strong> receberão devolução de parte do CBS 
              pago em compras. O percentual e forma de devolução ainda serão regulamentados, mas a previsão é de 
              <strong>devolução de 100% do CBS</strong> sobre itens da cesta básica e <strong>50%</strong> sobre gás de cozinha.
            </p>
          </details>

          <details className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4 cursor-pointer">
            <summary className="font-bold text-blue-900">
              E-commerces terão mudanças nas vendas interestaduais?
            </summary>
            <p className="text-sm text-gray-700 mt-3 pl-4">
              <strong>Sim, mas simplifica!</strong> Hoje você precisa calcular DIFAL, partilha de ICMS, etc. 
              Com IBS/CBS, o tributo vai <strong>100% para o estado de destino</strong> (onde está o consumidor), 
              acabando com partilhas e cálculos complexos. Isso facilita muito operação de e-commerce.
            </p>
          </details>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-8 text-white text-center my-8">
          <h4 className="text-2xl font-bold mb-4">🧮 Calcule o Impacto na Sua Empresa Agora</h4>
          <p className="text-blue-100 mb-6 text-lg">
            Use nosso simulador gratuito para comparar o sistema atual com IBS + CBS. 
            Descubra se sua empresa terá redução ou aumento de carga tributária.
          </p>
          <a 
            href="#top"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Simular Impacto da Reforma →
          </a>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Aviso Legal:</strong> Este simulador usa as regras aprovadas na EC 132/2023 e estimativas 
            baseadas em dados oficiais. Valores exatos de alíquotas e detalhes operacionais serão definidos por 
            Lei Complementar e regulamentação até 2026. Para decisões estratégicas, consulte um contador ou 
            especialista tributário.
          </p>
        </div>
      </article>
    </div>
  );
}

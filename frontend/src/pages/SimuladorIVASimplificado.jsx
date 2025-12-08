import { useState } from 'react';
import { Calculator, Zap, Info, TrendingUp } from 'lucide-react';

export default function SimuladorIVASimplificado() {
  const [formData, setFormData] = useState({
    receita: '',
    tipoOperacao: 'venda-produto',
    estado: 'SP'
  });

  const [resultado, setResultado] = useState(null);

  const tiposOperacao = {
    'venda-produto': { nome: 'Venda de Produto (Padrão)', aliquota: 26.5 },
    'prestacao-servico': { nome: 'Prestação de Serviço (Padrão)', aliquota: 26.5 },
    'saude': { nome: 'Saúde', aliquota: 0, beneficio: 'Alíquota Zero' },
    'educacao': { nome: 'Educação', aliquota: 0, beneficio: 'Alíquota Zero' },
    'transporte-publico': { nome: 'Transporte Público', aliquota: 0, beneficio: 'Alíquota Zero' },
    'alimentos-basicos': { nome: 'Alimentos da Cesta Básica', aliquota: 0, beneficio: 'Alíquota Zero' },
    'medicamentos': { nome: 'Medicamentos Essenciais', aliquota: 13.25, beneficio: 'Alíquota Reduzida 50%' },
    'cultura': { nome: 'Serviços Culturais', aliquota: 13.25, beneficio: 'Alíquota Reduzida 50%' }
  };

  const calcular = () => {
    const receita = parseFloat(formData.receita) || 0;
    const operacao = tiposOperacao[formData.tipoOperacao];
    const aliquotaTotal = operacao.aliquota;

    // Divisão IBS (61%) e CBS (39%)
    const ibs = (receita * aliquotaTotal * 0.61) / 100;
    const cbs = (receita * aliquotaTotal * 0.39) / 100;
    const total = ibs + cbs;
    const aliquotaEfetiva = aliquotaTotal;

    setResultado({
      receita,
      ibs,
      cbs,
      total,
      aliquotaEfetiva,
      operacao: operacao.nome,
      beneficio: operacao.beneficio || null,
      percentualIBS: 61,
      percentualCBS: 39
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-10 h-10" />
          <h1 className="text-3xl font-bold">Simulador IBS + CBS Simplificado</h1>
        </div>
        <p className="text-purple-100 text-lg">
          Ferramenta rápida e simples para calcular IBS + CBS. Ideal para pequenos negócios, 
          autônomos e quem quer entender o novo sistema tributário de forma fácil!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-600" />
            Dados da Operação
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor da Receita/Venda (R$)
              </label>
              <input
                type="text"
                name="receita"
                value={formData.receita}
                onChange={handleChange}
                placeholder="10000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Operação
              </label>
              <select
                name="tipoOperacao"
                value={formData.tipoOperacao}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-lg"
              >
                <optgroup label="Alíquota Padrão (26,5%)">
                  <option value="venda-produto">Venda de Produto</option>
                  <option value="prestacao-servico">Prestação de Serviço</option>
                </optgroup>
                <optgroup label="Alíquota Zero (0%)">
                  <option value="saude">Saúde</option>
                  <option value="educacao">Educação</option>
                  <option value="transporte-publico">Transporte Público</option>
                  <option value="alimentos-basicos">Alimentos da Cesta Básica</option>
                </optgroup>
                <optgroup label="Alíquota Reduzida (13,25%)">
                  <option value="medicamentos">Medicamentos Essenciais</option>
                  <option value="cultura">Serviços Culturais</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-lg"
              >
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="PR">Paraná</option>
                <option value="SC">Santa Catarina</option>
                <option value="BA">Bahia</option>
                <option value="PE">Pernambuco</option>
                <option value="CE">Ceará</option>
              </select>
            </div>

            <button
              onClick={calcular}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calcular IBS + CBS
            </button>
          </div>
        </div>

        {resultado && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Resultado do Cálculo
            </h3>

            {resultado.beneficio && (
              <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                <p className="text-green-800 font-semibold text-center">
                  🎉 {resultado.beneficio}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-700 mb-1">Receita da Operação</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatMoeda(resultado.receita)}
                </p>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm text-gray-600">IBS (Estados/Municípios)</p>
                    <p className="text-xs text-gray-500">{resultado.percentualIBS}% do total</p>
                  </div>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatMoeda(resultado.ibs)}
                  </p>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm text-gray-600">CBS (União Federal)</p>
                    <p className="text-xs text-gray-500">{resultado.percentualCBS}% do total</p>
                  </div>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatMoeda(resultado.cbs)}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Total a Recolher</span>
                  <span className="text-2xl font-bold">{formatMoeda(resultado.total)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-purple-100">
                  <span>Alíquota Efetiva</span>
                  <span className="font-semibold">{resultado.aliquotaEfetiva}%</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Tipo de Operação:</strong> {resultado.operacao}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            O que é IBS?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>IBS (Imposto sobre Bens e Serviços)</strong> é o novo tributo que substitui 
            ICMS e ISS. Será gerido por Estados e Municípios através do Comitê Gestor do IBS.
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">✓</span>
              <span>Representa 61% da alíquota total do IVA</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">✓</span>
              <span>Cobrança no destino (onde está o consumidor)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">✓</span>
              <span>Crédito integral sobre compras e insumos</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-pink-600" />
            O que é CBS?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>CBS (Contribuição sobre Bens e Serviços)</strong> é o novo tributo federal que 
            substitui PIS e COFINS. Será administrado pela Receita Federal.
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-pink-600 mt-1">✓</span>
              <span>Representa 39% da alíquota total do IVA</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-600 mt-1">✓</span>
              <span>Mesma base de cálculo do IBS</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-600 mt-1">✓</span>
              <span>Sistema não-cumulativo com direito a crédito</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-purple-900 mb-3">📊 Alíquota Padrão: Por que 26,5%?</h3>
        <p className="text-purple-800 leading-relaxed mb-4">
          A alíquota de referência de <strong>26,5%</strong> foi calculada para que a arrecadação 
          do novo sistema (IBS + CBS) seja equivalente à arrecadação atual de PIS, COFINS, ICMS e ISS somados.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Antes da Reforma</p>
            <p className="text-xs text-gray-700">PIS + COFINS + ICMS + ISS</p>
            <p className="text-lg font-bold text-purple-900">~26,5%</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Depois da Reforma</p>
            <p className="text-xs text-gray-700">IBS (61%) + CBS (39%)</p>
            <p className="text-lg font-bold text-purple-900">26,5%</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
        <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5" />
          ⚠️ Importante: Esta é uma Calculadora Simplificada
        </h4>
        <ul className="space-y-2 text-sm text-yellow-800">
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>A alíquota de 26,5% é uma estimativa e pode variar quando a reforma for implementada</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Não considera créditos tributários sobre compras e insumos</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Não considera regimes especiais (combustíveis, energia, etc.)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Para cálculos mais complexos, use nosso <strong>Simulador de Impacto Geral</strong></span>
          </li>
        </ul>
      </div>

      {/* Artigo SEO */}
      <article className="mt-16 max-w-4xl mx-auto prose prose-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          IBS + CBS (IVA Dual): O Novo Sistema Tributário Brasileiro em 2025
        </h2>

        {/* Introdução */}
        <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8 rounded-r-lg">
          <p className="text-lg leading-relaxed text-gray-800">
            A <strong>Reforma Tributária aprovada em 2023</strong> cria um novo modelo de tributação sobre consumo no Brasil: 
            o <strong>IVA Dual composto por IBS + CBS</strong>. Este sistema substitui <strong>5 tributos existentes</strong> 
            (PIS, COFINS, ICMS, ISS e IPI) por apenas 2 novos impostos, simplificando drasticamente a tributação de bens e serviços.
          </p>
          <p className="mt-4 text-gray-700">
            Com alíquota de referência de <strong>26,5%</strong> (estimativa), o novo sistema promete eliminar a complexidade 
            do modelo atual, acabar com a guerra fiscal entre estados e implementar o princípio do <strong>destino</strong>, 
            onde o imposto é recolhido onde o consumidor está localizado.
          </p>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">O Que São IBS e CBS?</h3>
        
        <p className="mb-4">
          O novo sistema tributário brasileiro será baseado em dois impostos sobre o valor agregado (IVA):
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
            <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              IBS - Imposto sobre Bens e Serviços
            </h4>
            <div className="space-y-3 text-sm">
              <div className="bg-white p-3 rounded-lg">
                <p className="font-semibold text-purple-900 mb-1">Substitui:</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• ICMS (estadual)</li>
                  <li>• ISS (municipal)</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="font-semibold text-purple-900 mb-1">Características:</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• Representa <strong>61%</strong> da alíquota total</li>
                  <li>• Gerido por Estados e Municípios</li>
                  <li>• Comitê Gestor do IBS</li>
                  <li>• Cobrança no destino</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border-2 border-pink-200">
            <h4 className="font-bold text-pink-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">🏢</span>
              CBS - Contribuição sobre Bens e Serviços
            </h4>
            <div className="space-y-3 text-sm">
              <div className="bg-white p-3 rounded-lg">
                <p className="font-semibold text-pink-900 mb-1">Substitui:</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• PIS (federal)</li>
                  <li>• COFINS (federal)</li>
                  <li>• IPI (federal)</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="font-semibold text-pink-900 mb-1">Características:</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• Representa <strong>39%</strong> da alíquota total</li>
                  <li>• Gerido pela Receita Federal</li>
                  <li>• Mesma base de cálculo do IBS</li>
                  <li>• Sistema não-cumulativo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Como Funciona o Cálculo de IBS + CBS?</h3>

        <p className="mb-4">
          O cálculo do IBS + CBS é mais simples que o sistema atual. A alíquota total é aplicada sobre o valor da operação, 
          e o resultado é dividido entre IBS (61%) e CBS (39%).
        </p>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-300 my-6">
          <h4 className="font-bold text-purple-900 mb-4 text-center text-lg">📐 Fórmula Simplificada</h4>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg font-mono text-center text-sm border-2 border-purple-200">
              Total IVA = Valor da Operação × Alíquota Total (26,5%)
            </div>
            <div className="bg-white p-4 rounded-lg font-mono text-center text-sm border-2 border-purple-200">
              IBS = Total IVA × 61%
            </div>
            <div className="bg-white p-4 rounded-lg font-mono text-center text-sm border-2 border-pink-200">
              CBS = Total IVA × 39%
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Exemplo Prático de Cálculo</h3>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-300 my-6">
          <h4 className="font-bold text-blue-900 mb-4">💡 Cenário: Venda de Produto por R$ 10.000</h4>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-900 mb-2">📊 Dados da Operação:</p>
              <ul className="text-sm space-y-1">
                <li>• <strong>Valor da venda:</strong> R$ 10.000,00</li>
                <li>• <strong>Tipo:</strong> Venda de Produto (Alíquota Padrão)</li>
                <li>• <strong>Alíquota IVA:</strong> 26,5%</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg border-2 border-orange-300">
              <p className="font-semibold text-orange-900 mb-3">🔢 Passo a Passo do Cálculo:</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-800">1️⃣ Calcular Total do IVA:</p>
                  <div className="bg-white p-2 rounded mt-1 font-mono text-xs">
                    Total IVA = R$ 10.000 × 26,5%
                  </div>
                  <div className="bg-white p-2 rounded mt-1 font-mono text-xs">
                    Total IVA = <strong className="text-purple-600">R$ 2.650,00</strong>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">2️⃣ Calcular IBS (61% do total):</p>
                  <div className="bg-white p-2 rounded mt-1 font-mono text-xs">
                    IBS = R$ 2.650 × 61%
                  </div>
                  <div className="bg-white p-2 rounded mt-1 font-mono text-xs">
                    IBS = <strong className="text-purple-600">R$ 1.616,50</strong>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">3️⃣ Calcular CBS (39% do total):</p>
                  <div className="bg-white p-2 rounded mt-1 font-mono text-xs">
                    CBS = R$ 2.650 × 39%
                  </div>
                  <div className="bg-white p-2 rounded mt-1 font-mono text-xs">
                    CBS = <strong className="text-pink-600">R$ 1.033,50</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-100 border-2 border-green-400 p-4 rounded-lg">
              <div className="space-y-2">
                <p className="text-green-900 font-bold flex items-center justify-between">
                  <span>IBS a Recolher:</span>
                  <span className="text-xl">R$ 1.616,50</span>
                </p>
                <p className="text-green-900 font-bold flex items-center justify-between">
                  <span>CBS a Recolher:</span>
                  <span className="text-xl">R$ 1.033,50</span>
                </p>
                <div className="border-t-2 border-green-400 pt-2 mt-2">
                  <p className="text-green-900 font-bold flex items-center justify-between text-lg">
                    <span>Total:</span>
                    <span className="text-2xl">R$ 2.650,00</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Alíquotas Diferenciadas: Zero e Reduzidas</h3>

        <p className="mb-4">
          A Reforma Tributária prevê <strong>alíquotas zero e reduzidas</strong> para setores essenciais, 
          beneficiando saúde, educação e alimentação básica.
        </p>

        <div className="space-y-4 my-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 rounded-xl shadow-lg">
            <h4 className="font-bold text-lg mb-2">✅ Alíquota Zero (0%)</h4>
            <p className="text-sm text-green-100 mb-3">
              Setores isentos de IBS e CBS
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-200">•</span>
                <span><strong>Saúde:</strong> Serviços médicos, hospitalares e exames</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-200">•</span>
                <span><strong>Educação:</strong> Ensino básico, fundamental, médio e superior</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-200">•</span>
                <span><strong>Transporte Público:</strong> Ônibus, metrô e trens urbanos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-200">•</span>
                <span><strong>Alimentos Básicos:</strong> Cesta básica nacional</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-xl shadow-lg">
            <h4 className="font-bold text-lg mb-2">📉 Alíquota Reduzida 50% (13,25%)</h4>
            <p className="text-sm text-blue-100 mb-3">
              Setores com benefício de redução de 50%
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-200">•</span>
                <span><strong>Medicamentos Essenciais:</strong> Lista RENAME</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-200">•</span>
                <span><strong>Dispositivos Médicos:</strong> Próteses e equipamentos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-200">•</span>
                <span><strong>Serviços Culturais:</strong> Teatro, cinema e shows</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-200">•</span>
                <span><strong>Atividades Desportivas:</strong> Eventos e serviços esportivos</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-5 rounded-xl shadow-lg">
            <h4 className="font-bold text-lg mb-2">⚙️ Alíquota Padrão (26,5%)</h4>
            <p className="text-sm text-purple-100 mb-3">
              Demais setores da economia
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-200">•</span>
                <span><strong>Comércio:</strong> Lojas, e-commerce e varejo em geral</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-200">•</span>
                <span><strong>Indústria:</strong> Fabricação e produção</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-200">•</span>
                <span><strong>Serviços:</strong> Consultoria, TI, marketing, etc.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-200">•</span>
                <span><strong>Construção Civil:</strong> Obras e reformas</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Principais Mudanças: Antes x Depois</h3>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5">
            <h4 className="font-bold text-red-900 mb-4 flex items-center gap-2">
              <span className="text-xl">❌</span>
              Sistema Atual (Até 2033)
            </h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>5 tributos diferentes:</strong> PIS, COFINS, ICMS, ISS, IPI</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>27 legislações de ICMS</strong> (uma por estado)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>5.570 legislações de ISS</strong> (uma por município)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Cumulatividade e tributação "por dentro"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Guerra fiscal entre estados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Crédito tributário limitado e complexo</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5">
            <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
              <span className="text-xl">✅</span>
              Sistema Novo (A partir de 2026)
            </h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>2 tributos apenas:</strong> IBS e CBS</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>1 legislação nacional</strong> para IBS e CBS</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Comitê Gestor do IBS</strong> unifica regras</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Sistema não-cumulativo completo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Fim da guerra fiscal (cobrança no destino)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Crédito integral sobre todos os insumos</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Cronograma de Implementação da Reforma</h3>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-300 my-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                2026
              </div>
              <div>
                <p className="font-bold text-blue-900 mb-1">🚀 Início da CBS</p>
                <p className="text-sm text-gray-700">
                  CBS começa a substituir PIS e COFINS com alíquota teste de <strong>0,9%</strong>. 
                  PIS e COFINS continuam existindo com redução proporcional.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                2027
              </div>
              <div>
                <p className="font-bold text-purple-900 mb-1">📊 Teste do IBS</p>
                <p className="text-sm text-gray-700">
                  IBS começa a operar em paralelo com ICMS e ISS com alíquota simbólica de <strong>0,1%</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                2029
              </div>
              <div>
                <p className="font-bold text-orange-900 mb-1">⚡ Transição Acelerada</p>
                <p className="text-sm text-gray-700">
                  Redução de <strong>10% ao ano</strong> nas alíquotas de PIS, COFINS, ICMS e ISS. 
                  Aumento correspondente em CBS e IBS.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                2033
              </div>
              <div>
                <p className="font-bold text-green-900 mb-1">✅ Sistema Completo</p>
                <p className="text-sm text-gray-700">
                  Fim de PIS, COFINS, ICMS, ISS e IPI. <strong>Apenas IBS + CBS</strong> em vigor 
                  com alíquota plena estimada em 26,5%.
                </p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Crédito Tributário: Como Funciona no Novo Sistema</h3>

        <p className="mb-4">
          Uma das maiores mudanças da Reforma Tributária é o <strong>direito ao crédito integral</strong> de IBS e CBS 
          sobre todas as aquisições de bens e serviços utilizados na atividade empresarial.
        </p>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-300 my-6">
          <h4 className="font-bold text-indigo-900 mb-4">🔄 Sistema de Crédito Não-Cumulativo Completo</h4>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <p className="font-semibold text-indigo-900 mb-2">Exemplo de Cadeia Produtiva:</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded font-bold text-xs">1</span>
                  <span className="text-gray-700">
                    <strong>Fornecedor vende R$ 1.000</strong> → Cobra R$ 265 de IVA
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded font-bold text-xs">2</span>
                  <span className="text-gray-700">
                    <strong>Fabricante compra</strong> → Tem R$ 265 de crédito
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-pink-600 text-white px-3 py-1 rounded font-bold text-xs">3</span>
                  <span className="text-gray-700">
                    <strong>Fabricante vende R$ 2.000</strong> → Cobra R$ 530 de IVA
                  </span>
                </div>
                <div className="bg-green-100 border-2 border-green-400 p-3 rounded mt-2">
                  <p className="font-bold text-green-900">
                    💰 Fabricante recolhe: R$ 530 - R$ 265 = <strong>R$ 265</strong>
                  </p>
                  <p className="text-xs text-green-800 mt-1">
                    O crédito reduz o valor a pagar, evitando tributação em cascata
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-900 mb-2">✅ Direito ao Crédito Sobre:</p>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Matérias-primas e insumos</li>
                <li>• Mercadorias para revenda</li>
                <li>• Energia elétrica</li>
                <li>• Serviços de terceiros</li>
                <li>• Aluguel e condomínio</li>
                <li>• Comunicação e internet</li>
                <li>• Depreciação de máquinas e equipamentos</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Perguntas Frequentes sobre IBS + CBS</h3>

        <div className="space-y-6 my-6">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-purple-600">❓</span>
              A alíquota de 26,5% é definitiva?
            </h4>
            <p className="text-gray-700 text-sm">
              <strong>Não.</strong> A alíquota de 26,5% é uma <strong>estimativa</strong> baseada na arrecadação atual 
              de PIS, COFINS, ICMS, ISS e IPI. A alíquota final será definida pelo Congresso Nacional de forma que 
              a arrecadação total seja equivalente ao sistema atual. Pode variar entre 25% e 28%.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-purple-600">❓</span>
              O Simples Nacional continua existindo com IBS + CBS?
            </h4>
            <p className="text-gray-700 text-sm">
              <strong>Sim.</strong> O Simples Nacional será mantido, mas adaptado ao novo sistema. As empresas 
              optantes continuarão pagando em guia única (DAS), mas agora <strong>incluindo IBS e CBS</strong> 
              ao invés de PIS, COFINS, ICMS e ISS. As alíquotas serão ajustadas para refletir o novo modelo.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-purple-600">❓</span>
              Como fica a tributação de serviços digitais e e-commerce?
            </h4>
            <p className="text-gray-700 text-sm">
              Com o princípio do <strong>destino</strong>, serviços digitais e e-commerce passam a recolher IBS + CBS 
              no <strong>estado/município do consumidor</strong>, e não mais na origem. Isso elimina a guerra fiscal 
              e distribui melhor a arrecadação entre os entes federativos.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-purple-600">❓</span>
              MEI (Microempreendedor Individual) paga IBS + CBS?
            </h4>
            <p className="text-gray-700 text-sm">
              <strong>Não.</strong> O MEI continuará com o sistema atual de pagamento fixo mensal através do DAS-MEI. 
              A Reforma Tributária <strong>não altera</strong> as regras para MEI, que permanece com valores fixos 
              independentes do faturamento.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-purple-600">❓</span>
              Como funciona a cobrança no destino?
            </h4>
            <p className="text-gray-700 text-sm">
              Na <strong>cobrança no destino</strong>, o IBS (parte estadual/municipal) é recolhido onde está o 
              <strong> consumidor final</strong>, não onde está a empresa vendedora. Por exemplo: empresa de SP 
              vende para cliente de MG → o IBS vai para MG. Isso acaba com a guerra fiscal e benefícios locais.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-purple-600">❓</span>
              Quando posso aproveitar crédito de IBS e CBS?
            </h4>
            <p className="text-gray-700 text-sm">
              O crédito pode ser aproveitado <strong>imediatamente</strong> após a aquisição de bens ou serviços 
              utilizados na atividade empresarial. O sistema é <strong>não-cumulativo completo</strong>, permitindo 
              crédito sobre praticamente todas as despesas operacionais, incluindo energia, aluguel e serviços.
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Legislação da Reforma Tributária</h3>

        <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6 my-6">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-purple-600 font-bold text-lg">📜</span>
              <div>
                <strong className="text-gray-900">Emenda Constitucional 132/2023</strong>
                <p className="text-gray-700 mt-1">
                  Aprovada em 20 de dezembro de 2023, altera o Sistema Tributário Nacional e cria o IBS e a CBS. 
                  Define os princípios gerais, alíquotas de referência e o cronograma de transição até 2033.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 font-bold text-lg">📜</span>
              <div>
                <strong className="text-gray-900">Lei Complementar 214/2025 (em tramitação)</strong>
                <p className="text-gray-700 mt-1">
                  Regulamenta o IBS, detalhando regras de base de cálculo, créditos, Comitê Gestor e 
                  fiscalização. Define como será a operação prática do imposto.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 font-bold text-lg">📜</span>
              <div>
                <strong className="text-gray-900">Lei Federal da CBS (em elaboração)</strong>
                <p className="text-gray-700 mt-1">
                  Regulamentará a Contribuição sobre Bens e Serviços (CBS), incluindo base de cálculo, 
                  contribuintes, responsáveis tributários e procedimentos de arrecadação e fiscalização.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Conclusão: Prepare-se para o Novo Sistema Tributário</h3>

        <p className="mb-4">
          A <strong>implementação de IBS + CBS</strong> representa a maior mudança no sistema tributário brasileiro 
          desde a Constituição de 1988. Embora a transição seja gradual até 2033, é essencial que empresários e 
          contadores comecem a se preparar desde já.
        </p>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6 my-6">
          <h4 className="font-bold text-purple-900 mb-4 text-lg">✅ Como Se Preparar para a Reforma Tributária</h4>
          <div className="space-y-2 text-sm">
            <label className="flex items-start gap-3 cursor-pointer hover:bg-purple-100 p-2 rounded transition">
              <input type="checkbox" className="mt-1" />
              <span>Entender o <strong>sistema de créditos</strong> e como aproveitá-los integralmente</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-purple-100 p-2 rounded transition">
              <input type="checkbox" className="mt-1" />
              <span>Revisar a <strong>estrutura tributária</strong> da empresa (Simples, Presumido ou Real)</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-purple-100 p-2 rounded transition">
              <input type="checkbox" className="mt-1" />
              <span>Verificar se sua atividade terá <strong>alíquota zero ou reduzida</strong></span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-purple-100 p-2 rounded transition">
              <input type="checkbox" className="mt-1" />
              <span>Adaptar sistemas de <strong>emissão de notas fiscais</strong> para IBS e CBS</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-purple-100 p-2 rounded transition">
              <input type="checkbox" className="mt-1" />
              <span>Capacitar a equipe contábil sobre as <strong>novas regras tributárias</strong></span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-purple-100 p-2 rounded transition">
              <input type="checkbox" className="mt-1" />
              <span>Acompanhar as <strong>regulamentações</strong> e leis complementares</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-purple-100 p-2 rounded transition">
              <input type="checkbox" className="mt-1" />
              <span>Simular o <strong>impacto financeiro</strong> na sua empresa</span>
            </label>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white text-center my-8">
          <h4 className="text-2xl font-bold mb-4">🧮 Simule IBS + CBS para Seu Negócio</h4>
          <p className="text-purple-100 mb-6 text-lg">
            Use nossa calculadora simplificada para entender como IBS e CBS funcionarão na prática. 
            Calcule o impacto em segundos e prepare sua empresa para a reforma tributária.
          </p>
          <a 
            href="#top"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all shadow-lg"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Calcular IBS + CBS Agora →
          </a>
        </div>
      </article>
    </div>
  );
}

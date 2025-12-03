/**
 * Calculadora de DAS do Simples Nacional
 * Componente completo com formulário e exibição de resultados
 */
import { useState } from 'react';
import { calcularDAS } from '../utils/calcularDAS';

function CalculadoraDAS() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  
  const [formData, setFormData] = useState({
    rbt12: '',
    faturamentoMes: '',
    cnae: '',
    folha12: ''
  });

  // CNAEs mais comuns (para autocomplete)
  const cnaesComuns = [
    { codigo: '4711-3', descricao: 'Comércio varejista de mercadorias' },
    { codigo: '4712-1', descricao: 'Comércio varejista de produtos alimentícios' },
    { codigo: '1011-2', descricao: 'Frigorífico - abate de bovinos' },
    { codigo: '1091-1', descricao: 'Fabricação de produtos de carne' },
    { codigo: '8599-6', descricao: 'Outras atividades de ensino' },
    { codigo: '8630-5', descricao: 'Atividade médica ambulatorial' },
    { codigo: '9602-5', descricao: 'Cabeleireiros e outras atividades de tratamento de beleza' },
    { codigo: '6201-5', descricao: 'Desenvolvimento de programas de computador' },
    { codigo: '6202-3', descricao: 'Desenvolvimento e licenciamento de programas' },
    { codigo: '7020-4', descricao: 'Atividades de consultoria em gestão empresarial' },
    { codigo: '6911-7', descricao: 'Serviços advocatícios' },
    { codigo: '6920-6', descricao: 'Atividades de contabilidade' },
    { codigo: '7112-0', descricao: 'Serviços de engenharia' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro ao digitar
    if (erro) setErro(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setResultado(null);
    
    try {
      const resultado = calcularDAS({
        rbt12: parseFloat(formData.rbt12),
        faturamentoMes: parseFloat(formData.faturamentoMes),
        cnae: formData.cnae,
        folha12: parseFloat(formData.folha12) || 0
      });
      
      setResultado(resultado);
    } catch (error) {
      console.error('Erro ao calcular DAS:', error);
      setErro(error.message || 'Erro ao calcular DAS. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const limparFormulario = () => {
    setFormData({
      rbt12: '',
      faturamentoMes: '',
      cnae: '',
      folha12: ''
    });
    setResultado(null);
    setErro(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 md:p-8 mb-6 md:mb-8 text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          🧮 Calculadora de DAS - Simples Nacional
        </h1>
        <p className="text-blue-100 text-sm md:text-lg">
          Calcule o valor do DAS com precisão usando as tabelas atualizadas pós-2018
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5 md:mb-6 flex items-center gap-2">
            <span className="text-2xl md:text-3xl">📝</span>
            Dados da Empresa
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* RBT12 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Receita Bruta Total (12 meses) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">R$</span>
                <input
                  type="number"
                  name="rbt12"
                  value={formData.rbt12}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="0,00"
                  step="0.01"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Soma do faturamento dos últimos 12 meses
              </p>
            </div>

            {/* Faturamento Mês */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Faturamento do Mês Atual *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">R$</span>
                <input
                  type="number"
                  name="faturamentoMes"
                  value={formData.faturamentoMes}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="0,00"
                  step="0.01"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Receita bruta do mês que deseja calcular o DAS
              </p>
            </div>

            {/* CNAE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CNAE (Atividade) *
              </label>
              <select
                name="cnae"
                value={formData.cnae}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              >
                <option value="">Selecione o CNAE</option>
                {cnaesComuns.map(cnae => (
                  <option key={cnae.codigo} value={cnae.codigo}>
                    {cnae.codigo} - {cnae.descricao}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Código da atividade principal da empresa
              </p>
            </div>

            {/* Folha 12 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Folha de Salários (12 meses)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">R$</span>
                <input
                  type="number"
                  name="folha12"
                  value={formData.folha12}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="0,00"
                  step="0.01"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Necessário para calcular Fator R (Anexo III ou V)
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Calculando...
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🚀</span>
                    Calcular DAS
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={limparFormulario}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Limpar
              </button>
            </div>
          </form>

          {/* Erro */}
          {erro && (
            <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-red-800 mb-1">Erro no Cálculo</h3>
                  <p className="text-sm text-red-600">{erro}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resultado */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {resultado ? (
            resultado.sucesso ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="text-3xl">📊</span>
                  Resultado do Cálculo
                </h2>

                {/* Valor do DAS - Destaque */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 mb-6 text-white shadow-xl">
                  <div className="text-sm font-semibold mb-2 text-green-100">
                    Valor do DAS a Pagar
                  </div>
                  <div className="text-5xl font-black mb-2">
                    {resultado.calculo.valorDASFormatado}
                  </div>
                  <div className="text-green-100 text-sm">
                    Alíquota Efetiva: <strong>{resultado.calculo.aliquotaEfetiva}</strong>
                  </div>
                </div>

                {/* Fator R */}
                <div className="bg-blue-50 rounded-xl p-5 mb-6 border-2 border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">📐</span>
                    Fator R
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Percentual:</span>
                      <span className="font-bold text-blue-700 text-lg">
                        {resultado.fatorR.percentual}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Anexo III?</span>
                      <span className={`font-bold ${resultado.fatorR.aplicavelAnexoIII ? 'text-green-600' : 'text-orange-600'}`}>
                        {resultado.fatorR.aplicavelAnexoIII ? '✓ Sim (≥28%)' : '✗ Não (<28%)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Anexo */}
                <div className="bg-purple-50 rounded-xl p-5 mb-6 border-2 border-purple-200">
                  <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">📋</span>
                    Anexo Aplicável
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {resultado.anexo.nome}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {resultado.anexo.descricao}
                    </p>
                  </div>
                </div>

                {/* Faixa */}
                <div className="bg-orange-50 rounded-xl p-5 mb-6 border-2 border-orange-200">
                  <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    Faixa de Tributação
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Faixa:</span>
                      <span className="font-bold text-orange-700">
                        {resultado.faixa.numero}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Alíquota Nominal:</span>
                      <span className="font-bold text-orange-700">
                        {resultado.faixa.aliquotaNominal}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Parcela Redutora:</span>
                      <span className="font-bold text-orange-700">
                        {formatarMoeda(resultado.faixa.parcelaRedutora)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detalhamento */}
                <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">🔍</span>
                    Detalhamento do Cálculo
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Fórmula:</div>
                      <div className="bg-white p-2 rounded border border-gray-300 font-mono text-xs">
                        {resultado.detalhamento.formula}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Alíquota Efetiva:</div>
                      <div className="bg-white p-2 rounded border border-gray-300 font-mono text-xs">
                        {resultado.detalhamento.calculo}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Valor DAS:</div>
                      <div className="bg-white p-2 rounded border border-gray-300 font-mono text-xs">
                        {resultado.detalhamento.valorDASCalculo}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  {resultado.erro}
                </h3>
                <p className="text-gray-600">
                  A empresa ultrapassou o limite permitido do Simples Nacional
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🧮</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Aguardando Cálculo
              </h3>
              <p className="text-gray-600">
                Preencha o formulário ao lado e clique em "Calcular DAS"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Informações Importantes
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>O <strong>Fator R</strong> é usado para determinar se empresas de serviços se enquadram no Anexo III (≥28%) ou Anexo V (&lt;28%)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>A <strong>alíquota efetiva</strong> considera a parcela redutora progressiva do Simples Nacional</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>O limite máximo do Simples Nacional é de <strong>R$ 4.800.000,00</strong> de receita bruta anual</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Esta calculadora usa as <strong>tabelas oficiais pós-2018</strong> da Receita Federal</span>
          </li>
        </ul>
      </div>

      {/* Artigo SEO */}
      <article className="mt-16 max-w-4xl mx-auto prose prose-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          DAS do Simples Nacional: O Que É, Como Calcular e Pagar em 2025
        </h2>

        {/* Introdução */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
          <p className="text-lg leading-relaxed text-gray-800">
            O <strong>DAS (Documento de Arrecadação do Simples Nacional)</strong> é a guia única que unifica o pagamento de até 
            <strong> 8 tributos federais, estaduais e municipais</strong> para empresas optantes pelo Simples Nacional. 
            Criado pela Lei Complementar 123/2006, o DAS simplifica drasticamente a vida do pequeno empresário, substituindo 
            múltiplas guias por um único boleto mensal.
          </p>
          <p className="mt-4 text-gray-700">
            Segundo dados da Receita Federal de 2024, <strong>mais de 20 milhões de empresas</strong> estão no Simples Nacional, 
            e o cálculo correto do DAS pode representar uma economia de até 40% em tributos quando comparado ao Lucro Presumido 
            ou Lucro Real, especialmente para empresas com faturamento abaixo de R$ 360 mil anuais.
          </p>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">O Que É o DAS e Quais Impostos Ele Unifica?</h3>
        
        <p className="mb-4">
          O DAS unifica até <strong>8 tributos em uma única guia</strong>, dependendo do anexo e da atividade da empresa:
        </p>

        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-xl">🏛️</span>
              Tributos Federais (4)
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span><strong>IRPJ</strong> - Imposto de Renda Pessoa Jurídica</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span><strong>CSLL</strong> - Contribuição Social sobre o Lucro Líquido</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span><strong>PIS</strong> - Programa de Integração Social</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span><strong>COFINS</strong> - Contribuição para Financiamento da Seguridade Social</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-200">
            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <span className="text-xl">🏢</span>
              Tributos Estaduais e Municipais (4)
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span><strong>ICMS</strong> - Imposto sobre Circulação de Mercadorias (comércio)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span><strong>ISS</strong> - Imposto sobre Serviços (serviços)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span><strong>CPP</strong> - Contribuição Patronal Previdenciária (INSS patronal)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span><strong>IPI</strong> - Imposto sobre Produtos Industrializados (indústrias)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 my-6 rounded-r-lg">
          <p className="text-sm">
            <strong>⚠️ Importante:</strong> Nem todos os tributos aparecem em todos os anexos. Por exemplo, empresas do 
            <strong> Anexo III (serviços)</strong> pagam ISS mas não pagam ICMS, enquanto empresas do <strong>Anexo I (comércio)</strong> 
            pagam ICMS mas não pagam ISS.
          </p>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Como Calcular o DAS: Fórmula e Alíquota Efetiva</h3>

        <p className="mb-4">
          O cálculo do DAS utiliza o conceito de <strong>alíquota efetiva</strong>, que é diferente da alíquota nominal 
          da tabela do Simples Nacional. Isso acontece porque o sistema aplica uma <strong>parcela redutora progressiva</strong> 
          para tornar a tributação mais justa conforme o faturamento aumenta.
        </p>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-2 border-orange-300 my-6">
          <h4 className="font-bold text-orange-900 mb-4 text-center text-lg">📐 Fórmula da Alíquota Efetiva</h4>
          <div className="bg-white p-4 rounded-lg font-mono text-center text-sm md:text-base border-2 border-orange-200 mb-4">
            Alíquota Efetiva = [(RBT12 × Alíquota Nominal) - Parcela Redutora] / RBT12
          </div>
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>Onde:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>RBT12</strong> = Receita Bruta Total dos últimos 12 meses</li>
              <li><strong>Alíquota Nominal</strong> = Percentual da faixa na tabela do Simples</li>
              <li><strong>Parcela Redutora</strong> = Valor fixo em R$ da faixa (reduz progressivamente)</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-300 my-6">
          <h4 className="font-bold text-blue-900 mb-4 text-center text-lg">💰 Cálculo do Valor do DAS</h4>
          <div className="bg-white p-4 rounded-lg font-mono text-center text-sm md:text-base border-2 border-blue-200">
            Valor do DAS = Faturamento do Mês × Alíquota Efetiva
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Exemplo Prático de Cálculo do DAS</h3>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-300 my-6">
          <h4 className="font-bold text-purple-900 mb-4">🧮 Cenário: Loja de Roupas (Comércio - Anexo I)</h4>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <p className="font-semibold text-purple-900 mb-2">📊 Dados da Empresa:</p>
              <ul className="text-sm space-y-1">
                <li>• <strong>Faturamento últimos 12 meses (RBT12):</strong> R$ 360.000,00</li>
                <li>• <strong>Faturamento do mês atual:</strong> R$ 30.000,00</li>
                <li>• <strong>Anexo:</strong> I (Comércio)</li>
                <li>• <strong>Faixa:</strong> 2ª faixa (R$ 180.000,01 a R$ 360.000,00)</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <p className="font-semibold text-purple-900 mb-2">📋 Tabela Simples - Anexo I - Faixa 2:</p>
              <ul className="text-sm space-y-1">
                <li>• <strong>Alíquota Nominal:</strong> 7,30%</li>
                <li>• <strong>Parcela Redutora:</strong> R$ 5.940,00</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg border-2 border-orange-300">
              <p className="font-semibold text-orange-900 mb-3">🔢 Passo a Passo do Cálculo:</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-800">1️⃣ Calcular Alíquota Efetiva:</p>
                  <div className="bg-white p-2 rounded mt-1 font-mono text-xs">
                    AE = [(360.000 × 7,30%) - 5.940] / 360.000
                  </div>
                  <div className="bg-white p-2 rounded mt-1 font-mono text-xs">
                    AE = [26.280 - 5.940] / 360.000
                  </div>
                  <div className="bg-white p-2 rounded mt-1 font-mono text-xs">
                    AE = 20.340 / 360.000 = <strong className="text-orange-600">5,65%</strong>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">2️⃣ Calcular Valor do DAS:</p>
                  <div className="bg-white p-2 rounded mt-1 font-mono text-xs">
                    Valor DAS = 30.000 × 5,65%
                  </div>
                  <div className="bg-white p-2 rounded mt-1 font-mono text-xs">
                    Valor DAS = <strong className="text-green-600">R$ 1.695,00</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-100 border-2 border-green-400 p-4 rounded-lg">
              <p className="text-green-900 font-bold text-center">
                ✅ DAS a pagar no mês: <span className="text-2xl">R$ 1.695,00</span>
              </p>
              <p className="text-sm text-green-800 text-center mt-2">
                (Alíquota efetiva de 5,65% sobre R$ 30.000,00)
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Fator R: O Que É e Como Afeta o Cálculo do DAS</h3>

        <p className="mb-4">
          O <strong>Fator R</strong> é um cálculo específico para <strong>empresas de serviços</strong> que determina 
          se elas pagarão impostos pelo <strong>Anexo III (alíquotas menores)</strong> ou pelo <strong>Anexo V (alíquotas maiores)</strong>.
        </p>

        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border-2 border-indigo-300 my-6">
          <h4 className="font-bold text-indigo-900 mb-4 text-center">📐 Fórmula do Fator R</h4>
          <div className="bg-white p-4 rounded-lg font-mono text-center border-2 border-indigo-200 mb-4">
            Fator R = (Folha de Salários últimos 12 meses) / (RBT12)
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-green-100 border-2 border-green-400 p-4 rounded-lg">
              <p className="font-bold text-green-900 mb-2">✅ Fator R ≥ 28%</p>
              <p className="text-sm text-green-800">Anexo III (alíquotas de 6% a 33%)</p>
            </div>
            <div className="bg-orange-100 border-2 border-orange-400 p-4 rounded-lg">
              <p className="font-bold text-orange-900 mb-2">⚠️ Fator R &lt; 28%</p>
              <p className="text-sm text-orange-800">Anexo V (alíquotas de 15,5% a 30,5%)</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl border-2 border-cyan-300 my-6">
          <h4 className="font-bold text-cyan-900 mb-4">💡 Exemplo Prático do Fator R</h4>
          <div className="space-y-3 text-sm">
            <p><strong>Empresa de Consultoria:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>RBT12: R$ 240.000,00</li>
              <li>Folha de Salários (12 meses): R$ 72.000,00</li>
            </ul>
            <div className="bg-white p-3 rounded border border-cyan-200 font-mono text-xs">
              Fator R = 72.000 / 240.000 = <strong className="text-green-600">30%</strong>
            </div>
            <div className="bg-green-100 border-2 border-green-400 p-3 rounded">
              <p className="font-bold text-green-900">
                ✅ Resultado: Anexo III (30% ≥ 28%)
              </p>
              <p className="text-xs text-green-800 mt-1">
                Economia de até 50% em relação ao Anexo V, dependendo da faixa de faturamento.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5 Anexos do Simples Nacional: Qual o Seu?</h3>

        <p className="mb-4">
          O Simples Nacional possui <strong>5 anexos com alíquotas diferentes</strong>, determinados pela atividade 
          (CNAE) da empresa:
        </p>

        <div className="space-y-4 my-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-xl shadow-lg">
            <h4 className="font-bold text-lg mb-2">📦 Anexo I - Comércio</h4>
            <p className="text-sm text-blue-100 mb-2">
              Alíquotas: <strong>4% a 19%</strong> (sobre faturamento)
            </p>
            <p className="text-sm">
              <strong>Atividades:</strong> Lojas, supermercados, e-commerce, atacado, varejo em geral.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-5 rounded-xl shadow-lg">
            <h4 className="font-bold text-lg mb-2">🏭 Anexo II - Indústria</h4>
            <p className="text-sm text-purple-100 mb-2">
              Alíquotas: <strong>4,5% a 30%</strong> (sobre faturamento)
            </p>
            <p className="text-sm">
              <strong>Atividades:</strong> Fabricação, produção industrial, transformação de matéria-prima.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-xl shadow-lg">
            <h4 className="font-bold text-lg mb-2">💼 Anexo III - Serviços com Folha Alta</h4>
            <p className="text-sm text-green-100 mb-2">
              Alíquotas: <strong>6% a 33%</strong> (com Fator R ≥ 28%)
            </p>
            <p className="text-sm">
              <strong>Atividades:</strong> Creches, escolas, agências de viagem, advocacia, contabilidade, engenharia.
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-5 rounded-xl shadow-lg">
            <h4 className="font-bold text-lg mb-2">🛠️ Anexo IV - Serviços Gerais</h4>
            <p className="text-sm text-orange-100 mb-2">
              Alíquotas: <strong>4,5% a 33%</strong> (sobre faturamento)
            </p>
            <p className="text-sm">
              <strong>Atividades:</strong> Construção civil, vigilância, limpeza, obras, instalações.
            </p>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-5 rounded-xl shadow-lg">
            <h4 className="font-bold text-lg mb-2">⚠️ Anexo V - Serviços com Folha Baixa</h4>
            <p className="text-sm text-red-100 mb-2">
              Alíquotas: <strong>15,5% a 30,5%</strong> (com Fator R &lt; 28%)
            </p>
            <p className="text-sm">
              <strong>Atividades:</strong> Serviços sem folha significativa (consultoria, TI, marketing, design).
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5 Erros Comuns ao Calcular o DAS</h3>

        <div className="space-y-4 my-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg">
            <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <span>❌</span>
              1. Usar a Alíquota Nominal ao Invés da Efetiva
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Erro:</strong> Aplicar direto 7,30% sobre o faturamento sem considerar a parcela redutora.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Correto:</strong> Sempre calcular a alíquota efetiva usando a fórmula com parcela redutora.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg">
            <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <span>❌</span>
              2. Não Calcular o Fator R para Empresas de Serviços
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Erro:</strong> Assumir automaticamente Anexo V sem verificar se a folha de salários atinge 28%.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Correto:</strong> Calcular mensalmente o Fator R e verificar se há enquadramento no Anexo III.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg">
            <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <span>❌</span>
              3. Somar Faturamento de Forma Incorreta (RBT12)
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Erro:</strong> Usar apenas 12 meses corridos sem considerar proporcionalidade no primeiro ano.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Correto:</strong> No primeiro ano, proporcionalizar o faturamento conforme legislação.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg">
            <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <span>❌</span>
              4. Não Atualizar o CNAE Quando Muda a Atividade Principal
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Erro:</strong> Continuar usando Anexo I quando a empresa passou a prestar mais serviços que vender.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Correto:</strong> Reavaliar anualmente o CNAE principal e os anexos aplicáveis.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg">
            <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <span>❌</span>
              5. Pagar DAS com Atraso sem Calcular Juros e Multa
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Erro:</strong> Pagar o valor original do DAS após o vencimento.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Correto:</strong> Emitir segunda via do DAS atualizado no Portal do Simples Nacional, com juros SELIC + multa de 0,33% ao dia (até 20%).
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Perguntas Frequentes sobre o DAS</h3>

        <div className="space-y-6 my-6">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-blue-600">❓</span>
              Qual o prazo de vencimento do DAS?
            </h4>
            <p className="text-gray-700 text-sm">
              O DAS vence todo dia <strong>20 do mês seguinte</strong> ao faturamento. Por exemplo, o DAS referente 
              ao faturamento de janeiro vence em 20 de fevereiro. Se o dia 20 cair em fim de semana ou feriado, 
              o vencimento é prorrogado para o próximo dia útil.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-blue-600">❓</span>
              E se a empresa não teve faturamento no mês, precisa pagar DAS?
            </h4>
            <p className="text-gray-700 text-sm">
              <strong>Não.</strong> Se não houve faturamento no mês, não há valor a pagar no DAS. Porém, é 
              <strong> obrigatório enviar a declaração DEFIS</strong> anualmente informando os meses sem receita. 
              Não confundir com MEI, que tem DAS fixo mensal independente de faturamento.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-blue-600">❓</span>
              Posso parcelar o DAS em atraso?
            </h4>
            <p className="text-gray-700 text-sm">
              <strong>Sim.</strong> É possível parcelar débitos do DAS em até <strong>60 parcelas</strong> através do 
              Portal do Simples Nacional. O parcelamento incide juros SELIC desde o vencimento original. 
              Parcelas mínimas de R$ 300,00 (empresas) ou R$ 50,00 (MEI).
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-blue-600">❓</span>
              O DAS inclui o INSS patronal da folha de pagamento?
            </h4>
            <p className="text-gray-700 text-sm">
              <strong>Sim.</strong> O DAS inclui a <strong>CPP (Contribuição Patronal Previdenciária)</strong>, 
              que é o INSS patronal sobre a folha de salários. Por isso empresas do Simples Nacional <strong>não pagam 
              guias GPS separadas</strong> de INSS patronal, está tudo unificado no DAS.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-blue-600">❓</span>
              Onde emitir o DAS para pagamento?
            </h4>
            <p className="text-gray-700 text-sm">
              Acesse o <strong>Portal do Simples Nacional</strong> (www8.receita.fazenda.gov.br/simplesnacional) 
              → Menu "Serviços" → "Emissão de DAS" → Informe o CNPJ e período desejado. O sistema calcula 
              automaticamente e gera o boleto ou código de barras para pagamento.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-blue-600">❓</span>
              Qual a diferença entre DAS e DAS-MEI?
            </h4>
            <p className="text-gray-700 text-sm">
              O <strong>DAS do Simples Nacional</strong> é calculado sobre o faturamento mensal (variável) e pode 
              chegar a 33%. O <strong>DAS-MEI</strong> é um valor fixo mensal (em 2025: R$ 71,60 comércio, R$ 75,60 serviços, 
              R$ 76,60 ambos), independente do faturamento, limitado a R$ 81 mil anuais.
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Legislação do DAS do Simples Nacional</h3>

        <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6 my-6">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-lg">📜</span>
              <div>
                <strong className="text-gray-900">Lei Complementar 123/2006</strong>
                <p className="text-gray-700 mt-1">
                  Institui o Simples Nacional e cria o DAS como forma unificada de arrecadação. 
                  Estabelece alíquotas, anexos, limites de faturamento e regras gerais.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-lg">📜</span>
              <div>
                <strong className="text-gray-900">Lei Complementar 155/2016</strong>
                <p className="text-gray-700 mt-1">
                  Alterou a LC 123/2006 e criou o <strong>sistema de alíquota progressiva com parcela redutora</strong>, 
                  vigente desde 2018. Também criou o Fator R para diferenciar Anexo III e V.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-lg">📜</span>
              <div>
                <strong className="text-gray-900">Resolução CGSN 140/2018</strong>
                <p className="text-gray-700 mt-1">
                  Regulamenta os aspectos gerais do Simples Nacional, incluindo <strong>tabelas de alíquotas, 
                  cálculo do DAS e regras de enquadramento</strong> nos anexos.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-lg">📜</span>
              <div>
                <strong className="text-gray-900">Instrução Normativa RFB 1.828/2018</strong>
                <p className="text-gray-700 mt-1">
                  Detalha os procedimentos operacionais para cálculo, emissão, pagamento e parcelamento do DAS.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Conclusão: Economize com o Cálculo Correto do DAS</h3>

        <p className="mb-4">
          O <strong>cálculo correto do DAS</strong> pode representar uma economia significativa para sua empresa. 
          Erros comuns como usar alíquota nominal, não calcular o Fator R ou escolher o anexo errado podem fazer 
          você pagar <strong>até 40% a mais de impostos</strong> do que deveria.
        </p>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 my-6">
          <h4 className="font-bold text-green-900 mb-4 text-lg">✅ Checklist para Calcular o DAS Corretamente</h4>
          <div className="space-y-2 text-sm">
            <label className="flex items-start gap-3 cursor-pointer hover:bg-green-100 p-2 rounded transition">
              <input type="checkbox" className="mt-1" />
              <span>Somar corretamente a <strong>Receita Bruta Total (RBT12)</strong> dos últimos 12 meses</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-green-100 p-2 rounded transition">
              <input type="checkbox" className="mt-1" />
              <span>Identificar o <strong>CNAE correto</strong> e o anexo correspondente</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-green-100 p-2 rounded transition">
              <input type="checkbox" className="mt-1" />
              <span>Para serviços, calcular o <strong>Fator R</strong> (folha / RBT12)</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-green-100 p-2 rounded transition">
              <input type="checkbox" className="mt-1" />
              <span>Localizar a <strong>faixa de tributação</strong> na tabela do Simples</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-green-100 p-2 rounded transition">
              <input type="checkbox" className="mt-1" />
              <span>Calcular a <strong>alíquota efetiva</strong> com a parcela redutora</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-green-100 p-2 rounded transition">
              <input type="checkbox" className="mt-1" />
              <span>Aplicar a alíquota efetiva sobre o <strong>faturamento do mês</strong></span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-green-100 p-2 rounded transition">
              <input type="checkbox" className="mt-1" />
              <span>Emitir o DAS no <strong>Portal do Simples Nacional</strong></span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer hover:bg-green-100 p-2 rounded transition">
              <input type="checkbox" className="mt-1" />
              <span>Pagar até o dia <strong>20 do mês seguinte</strong></span>
            </label>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center my-8">
          <h4 className="text-2xl font-bold mb-4">🧮 Use Nossa Calculadora de DAS</h4>
          <p className="text-blue-100 mb-6 text-lg">
            Calcule automaticamente o valor do seu DAS com alíquota efetiva, 
            Fator R e anexo correto em segundos. 100% gratuito e sem cadastro.
          </p>
          <a 
            href="#top"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Calcular Meu DAS Agora →
          </a>
        </div>
      </article>
    </div>
  );
}

export default CalculadoraDAS;

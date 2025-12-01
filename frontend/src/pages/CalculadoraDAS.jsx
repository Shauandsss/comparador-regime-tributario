/**
 * Calculadora de DAS do Simples Nacional
 * Componente completo com formulário e exibição de resultados
 */
import { useState } from 'react';
import axios from 'axios';

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
      const response = await axios.get('http://localhost:3001/simples/das', {
        params: {
          rbt12: formData.rbt12,
          faturamentoMes: formData.faturamentoMes,
          cnae: formData.cnae,
          folha12: formData.folha12 || 0
        }
      });
      
      setResultado(response.data);
    } catch (error) {
      console.error('Erro ao calcular DAS:', error);
      setErro(error.response?.data?.erro || 'Erro ao calcular DAS. Verifique os dados e tente novamente.');
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
    </div>
  );
}

export default CalculadoraDAS;

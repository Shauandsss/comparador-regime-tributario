/**
 * Página de Formulário - Entrada de Dados
 */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Loading from '../components/Loading';
import { useComparador } from '../hooks/useComparador';
import { 
  ATIVIDADES_LUCRO_PRESUMIDO, 
  CATEGORIAS_ATIVIDADES_PRESUMIDO 
} from '../services/calculosTributarios';

function Formulario() {
  const navigate = useNavigate();
  const { calcularComparacao, isLoading, error } = useComparador();

  const [formData, setFormData] = useState({
    rbt12: '',
    atividade: 'servico',
    atividadePresumido: '', // Nova: atividade específica para Lucro Presumido
    folha: '',
    despesas: '',
  });

  const [errors, setErrors] = useState({});
  const [mostrarAtividadeEspecifica, setMostrarAtividadeEspecifica] = useState(false);

  // Lista de atividades agrupadas por categoria
  const atividadesAgrupadas = useMemo(() => {
    const grupos = {};
    Object.entries(CATEGORIAS_ATIVIDADES_PRESUMIDO).forEach(([key, categoria]) => {
      grupos[key] = {
        nome: categoria.nome,
        atividades: categoria.atividades.map(codigo => ({
          ...ATIVIDADES_LUCRO_PRESUMIDO[codigo],
          codigo
        })).filter(Boolean)
      };
    });
    return grupos;
  }, []);

  // Atividade específica selecionada
  const atividadeEspecificaSelecionada = useMemo(() => {
    if (!formData.atividadePresumido) return null;
    return ATIVIDADES_LUCRO_PRESUMIDO[formData.atividadePresumido] || null;
  }, [formData.atividadePresumido]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.rbt12 || parseFloat(formData.rbt12) <= 0) {
      newErrors.rbt12 = 'Receita bruta é obrigatória e deve ser maior que zero';
    }

    if (!formData.atividade) {
      newErrors.atividade = 'Selecione uma atividade';
    }

    if (formData.folha && parseFloat(formData.folha) < 0) {
      newErrors.folha = 'Folha de pagamento não pode ser negativa';
    }

    if (formData.despesas && parseFloat(formData.despesas) < 0) {
      newErrors.despesas = 'Despesas não podem ser negativas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      rbt12: parseFloat(formData.rbt12),
      atividade: formData.atividade,
      atividadePresumido: formData.atividadePresumido || formData.atividade, // Usa específica se definida
      folha: formData.folha ? parseFloat(formData.folha) : 0,
      despesas: formData.despesas ? parseFloat(formData.despesas) : 0,
    };

    const result = await calcularComparacao(payload);

    if (result.success) {
      navigate('/resultado');
    }
  };

  if (isLoading) {
    return <Loading message="Calculando os três regimes tributários..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            📋 Dados da Empresa
          </h1>
          <p className="text-blue-100">
            Preencha as informações para comparar os regimes tributários
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Erro Geral */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-500 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Receita Bruta */}
          <Input
            label="Receita Bruta dos Últimos 12 Meses"
            type="number"
            name="rbt12"
            value={formData.rbt12}
            onChange={handleChange}
            placeholder="Ex: 1200000"
            required
            min="0"
            step="0.01"
            error={errors.rbt12}
          />

          {/* Atividade */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Atividade Econômica
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="atividade"
              value={formData.atividade}
              onChange={handleChange}
              required
              className={`
                w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 
                ${errors.atividade 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
                }
                transition duration-200
              `}
            >
              <option value="">Selecione uma atividade</option>
              <option value="comercio">🏪 Comércio</option>
              <option value="industria">🏭 Indústria</option>
              <option value="servico">💼 Serviço</option>
            </select>
            {errors.atividade && (
              <p className="text-red-500 text-xs mt-1">{errors.atividade}</p>
            )}
          </div>

          {/* Toggle para Atividade Específica do Lucro Presumido */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setMostrarAtividadeEspecifica(!mostrarAtividadeEspecifica)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium"
            >
              <span className={`transform transition-transform ${mostrarAtividadeEspecifica ? 'rotate-90' : ''}`}>▶</span>
              {mostrarAtividadeEspecifica ? 'Ocultar' : 'Especificar'} atividade detalhada para Lucro Presumido
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Opcional</span>
            </button>
          </div>

          {/* Atividade Específica para Lucro Presumido (Expandível) */}
          {mostrarAtividadeEspecifica && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200 animate-fadeIn">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                📈 Atividade Específica para Lucro Presumido
                <span className="text-xs text-gray-500 font-normal ml-2">(melhora precisão do cálculo)</span>
              </label>
              <select
                name="atividadePresumido"
                value={formData.atividadePresumido}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              >
                <option value="">Usar atividade genérica ({formData.atividade})</option>
                {Object.entries(atividadesAgrupadas).map(([key, grupo]) => (
                  <optgroup key={key} label={`📁 ${grupo.nome}`}>
                    {grupo.atividades.map((atv) => (
                      <option key={atv.codigo} value={atv.codigo}>
                        {atv.nome} — IRPJ {(atv.presuncaoIrpj * 100).toFixed(1)}% / CSLL {(atv.presuncaoCsll * 100).toFixed(0)}%
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              
              {atividadeEspecificaSelecionada && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800 mb-2">
                    <strong>📋 {atividadeEspecificaSelecionada.nome}</strong>
                  </p>
                  <p className="text-xs text-purple-700 mb-2">
                    {atividadeEspecificaSelecionada.descricao}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded">
                      Presunção IRPJ: <strong>{(atividadeEspecificaSelecionada.presuncaoIrpj * 100).toFixed(1)}%</strong>
                    </span>
                    <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded">
                      Presunção CSLL: <strong>{(atividadeEspecificaSelecionada.presuncaoCsll * 100).toFixed(0)}%</strong>
                    </span>
                  </div>
                </div>
              )}
              
              <p className="mt-2 text-xs text-purple-600">
                💡 Percentuais de presunção conforme Lei 9.249/95. Atividades diferentes têm presunções que variam de 1,6% a 38,4%.
              </p>
            </div>
          )}

          {/* Grid com 2 colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Folha de Pagamento */}
            <Input
              label="Folha de Pagamento (Opcional)"
              type="number"
              name="folha"
              value={formData.folha}
              onChange={handleChange}
              placeholder="Ex: 200000"
              min="0"
              step="0.01"
              error={errors.folha}
            />

            {/* Despesas */}
            <Input
              label="Despesas Dedutíveis (Opcional)"
              type="number"
              name="despesas"
              value={formData.despesas}
              onChange={handleChange}
              placeholder="Ex: 350000"
              min="0"
              step="0.01"
              error={errors.despesas}
            />
          </div>

          {/* Informação */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded text-sm md:text-base">
            <p className="text-sm text-blue-800">
              <strong>💡 Dica:</strong> As despesas são especialmente importantes para o cálculo do Lucro Real,
              pois afetam diretamente a base de cálculo do IRPJ e CSLL.
            </p>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-sm md:text-base"
            >
              ← Voltar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {isLoading ? 'Calculando...' : 'Calcular Regimes →'}
            </button>
          </div>
        </form>
      </div>

      {/* Preview dos Valores */}
      {formData.rbt12 && (
        <div className="mt-6 bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3 text-sm md:text-base">📊 Resumo dos Dados</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Receita Bruta</p>
              <p className="font-bold text-gray-800">
                R$ {parseFloat(formData.rbt12 || 0).toLocaleString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Atividade</p>
              <p className="font-bold text-gray-800 capitalize">
                {formData.atividade || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Folha</p>
              <p className="font-bold text-gray-800">
                R$ {parseFloat(formData.folha || 0).toLocaleString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Despesas</p>
              <p className="font-bold text-gray-800">
                R$ {parseFloat(formData.despesas || 0).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Formulario;

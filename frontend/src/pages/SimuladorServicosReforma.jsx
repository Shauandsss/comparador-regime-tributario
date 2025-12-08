import { useState } from 'react';
import { Calculator, Briefcase, AlertTriangle, TrendingUp, Users, Building2, Info } from 'lucide-react';

export default function SimuladorServicosReforma() {
  const [valorServico, setValorServico] = useState('10000');
  const [estado, setEstado] = useState('SP');
  const [atividade, setAtividade] = useState('consultoria');
  const [resultado, setResultado] = useState(null);

  // ISS varia por município (2% - 5%), aqui usamos média típica por atividade
  const issAtividades = {
    consultoria: 5.0,
    tecnologia: 2.0,
    saude: 5.0,
    educacao: 5.0,
    construcao: 2.0,
    publicidade: 5.0,
    juridico: 5.0,
    contabil: 5.0,
    engenharia: 5.0,
    arquitetura: 5.0
  };

  // Alíquota IBS/CBS padrão: 26,5% (IBS 16,165% + CBS 10,335%)
  // Alguns serviços podem ter alíquota reduzida (60% = 15,9%)
  const aliquotasNovas = {
    consultoria: 26.5,
    tecnologia: 26.5,
    saude: 15.9, // Reduzida (60% de 26,5%)
    educacao: 15.9, // Reduzida (60% de 26,5%)
    construcao: 26.5,
    publicidade: 26.5,
    juridico: 26.5,
    contabil: 26.5,
    engenharia: 26.5,
    arquitetura: 26.5
  };

  const estados = [
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'DF', nome: 'Distrito Federal' }
  ];

  const atividades = [
    { value: 'consultoria', label: 'Consultoria Empresarial', icon: '💼' },
    { value: 'tecnologia', label: 'Tecnologia da Informação', icon: '💻' },
    { value: 'saude', label: 'Serviços de Saúde', icon: '🏥' },
    { value: 'educacao', label: 'Serviços Educacionais', icon: '📚' },
    { value: 'construcao', label: 'Construção Civil', icon: '🏗️' },
    { value: 'publicidade', label: 'Publicidade e Marketing', icon: '📢' },
    { value: 'juridico', label: 'Serviços Jurídicos', icon: '⚖️' },
    { value: 'contabil', label: 'Serviços Contábeis', icon: '🧾' },
    { value: 'engenharia', label: 'Engenharia', icon: '⚙️' },
    { value: 'arquitetura', label: 'Arquitetura', icon: '🏛️' }
  ];

  const calcular = () => {
    const valor = parseFloat(valorServico);
    
    if (!valor || valor <= 0) {
      alert('Insira um valor válido para o serviço');
      return;
    }

    // Sistema Atual: ISS + PIS/COFINS (não cumulativo para serviços)
    const aliquotaISS = issAtividades[atividade];
    const valorISS = valor * (aliquotaISS / 100);
    
    // PIS/COFINS não cumulativo: 9,25% (PIS 1,65% + COFINS 7,6%)
    const aliquotaPisCofins = 9.25;
    const valorPisCofins = valor * (aliquotaPisCofins / 100);
    
    const cargaAtual = valorISS + valorPisCofins;
    const percentualAtual = aliquotaISS + aliquotaPisCofins;

    // Sistema Novo: IBS + CBS
    const aliquotaNova = aliquotasNovas[atividade];
    const valorNovoIBSCBS = valor * (aliquotaNova / 100);
    const percentualNovo = aliquotaNova;

    // Análise
    const diferenca = cargaAtual - valorNovoIBSCBS;
    const variacao = ((valorNovoIBSCBS - cargaAtual) / cargaAtual) * 100;
    const economiza = diferenca > 0;

    // Valor líquido
    const liquidoAtual = valor - cargaAtual;
    const liquidoNovo = valor - valorNovoIBSCBS;

    setResultado({
      valor,
      atual: {
        iss: valorISS,
        aliquotaISS: aliquotaISS,
        pisCofins: valorPisCofins,
        total: cargaAtual,
        percentual: percentualAtual,
        liquido: liquidoAtual
      },
      novo: {
        ibsCbs: valorNovoIBSCBS,
        aliquota: aliquotaNova,
        liquido: liquidoNovo,
        percentual: percentualNovo
      },
      analise: {
        diferenca: diferenca,
        variacao: variacao,
        economiza: economiza
      }
    });
  };

  const getAtividadeInfo = () => {
    const info = atividades.find(a => a.value === atividade);
    return info ? info : { label: 'Serviço', icon: '📋' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Simulador para Prestadores de Serviços
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare o <strong>ISS + PIS/COFINS atual</strong> com o novo sistema 
            <strong> IBS/CBS pós-2026</strong>. Veja como a reforma afeta sua prestação de serviços.
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            
            {/* Valor do Serviço */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💰 Valor do Serviço (R$)
              </label>
              <input
                type="number"
                value={valorServico}
                onChange={(e) => setValorServico(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10000"
                min="0"
                step="100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Valor bruto da nota fiscal de serviço
              </p>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {estados.map(e => (
                  <option key={e.sigla} value={e.sigla}>{e.nome}</option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Local de prestação do serviço
              </p>
            </div>

          </div>

          {/* Atividade */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🏢 Tipo de Atividade
            </label>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {atividades.map(a => (
                <button
                  key={a.value}
                  onClick={() => setAtividade(a.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    atividade === a.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{a.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{a.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Alíquota de ISS e IBS/CBS varia conforme a atividade
            </p>
          </div>

          {/* Botão Calcular */}
          <button
            onClick={calcular}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calcular Comparativo ISS vs IBS/CBS
          </button>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="space-y-6">
            
            {/* Card Resumo */}
            <div className={`rounded-2xl shadow-xl p-8 ${
              resultado.analise.economiza 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200' 
                : 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Resultado da Análise
                  </h3>
                  <p className="text-gray-600">
                    {getAtividadeInfo().icon} {getAtividadeInfo().label} em {estado}
                  </p>
                </div>
                {resultado.analise.economiza ? (
                  <TrendingUp className="w-16 h-16 text-green-600" />
                ) : (
                  <AlertTriangle className="w-16 h-16 text-red-600" />
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <p className="text-sm text-gray-600 mb-1">Sistema Atual</p>
                  <p className="text-3xl font-bold text-gray-900">
                    R$ {resultado.atual.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-blue-600 font-medium mt-2">
                    {resultado.atual.percentual.toFixed(2)}% do valor
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <p className="text-sm text-gray-600 mb-1">Pós-Reforma (2026)</p>
                  <p className="text-3xl font-bold text-gray-900">
                    R$ {resultado.novo.ibsCbs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-purple-600 font-medium mt-2">
                    {resultado.novo.percentual.toFixed(2)}% do valor
                  </p>
                </div>

                <div className={`rounded-lg p-6 shadow-md ${
                  resultado.analise.economiza ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <p className="text-sm text-gray-700 mb-1">
                    {resultado.analise.economiza ? 'Economia' : 'Aumento'}
                  </p>
                  <p className={`text-3xl font-bold ${
                    resultado.analise.economiza ? 'text-green-700' : 'text-red-700'
                  }`}>
                    R$ {Math.abs(resultado.analise.diferenca).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className={`text-sm font-medium mt-2 ${
                    resultado.analise.economiza ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {resultado.analise.economiza ? '↓' : '↑'} {Math.abs(resultado.analise.variacao).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Tabela Comparativa Detalhada */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="w-7 h-7 text-blue-600" />
                Comparação Detalhada dos Tributos
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-4 px-4 text-gray-700 font-semibold">Item</th>
                      <th className="text-right py-4 px-4 text-gray-700 font-semibold">Sistema Atual</th>
                      <th className="text-right py-4 px-4 text-gray-700 font-semibold">Pós-Reforma 2026</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">Valor do Serviço</td>
                      <td className="py-4 px-4 text-right text-gray-900">
                        R$ {resultado.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-900">
                        R$ {resultado.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-700">
                        ISS (Imposto Sobre Serviços)
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-blue-600 font-semibold">
                          R$ {resultado.atual.iss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <br />
                        <span className="text-xs text-gray-500">
                          {resultado.atual.aliquotaISS.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-400">
                        <span className="line-through">Extinto</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-700">
                        PIS/COFINS (não cumulativo)
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-blue-600 font-semibold">
                          R$ {resultado.atual.pisCofins.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <br />
                        <span className="text-xs text-gray-500">
                          9,25%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-400">
                        <span className="line-through">Extinto</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-700">
                        IBS + CBS
                      </td>
                      <td className="py-4 px-4 text-right text-gray-400">
                        —
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-purple-600 font-semibold">
                          R$ {resultado.novo.ibsCbs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <br />
                        <span className="text-xs text-gray-500">
                          {resultado.novo.aliquota.toFixed(2)}%
                        </span>
                      </td>
                    </tr>

                    <tr className="bg-gray-100 font-bold">
                      <td className="py-4 px-4 text-gray-900">Total de Tributos</td>
                      <td className="py-4 px-4 text-right text-blue-700">
                        R$ {resultado.atual.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right text-purple-700">
                        R$ {resultado.novo.ibsCbs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>

                    <tr className="bg-green-50 font-bold">
                      <td className="py-4 px-4 text-gray-900">Valor Líquido</td>
                      <td className="py-4 px-4 text-right text-green-700">
                        R$ {resultado.atual.liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right text-green-700">
                        R$ {resultado.novo.liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Análise e Recomendações */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="w-7 h-7 text-purple-600" />
                Análise e Recomendações
              </h3>

              <div className="space-y-4">
                {resultado.analise.economiza ? (
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                    <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                      ✅ Impacto Positivo
                    </h4>
                    <p className="text-green-800 mb-3">
                      Sua atividade terá <strong>redução de carga tributária</strong> com a reforma. 
                      Você economizará <strong>R$ {Math.abs(resultado.analise.diferenca).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> por 
                      serviço prestado ({Math.abs(resultado.analise.variacao).toFixed(1)}% a menos).
                    </p>
                    <p className="text-green-700 text-sm">
                      <strong>Motivo:</strong> {
                        resultado.novo.aliquota < resultado.atual.percentual
                          ? `Alíquota IBS/CBS (${resultado.novo.aliquota}%) é menor que ISS+PIS/COFINS (${resultado.atual.percentual.toFixed(2)}%)`
                          : 'Simplificação do sistema e redução de obrigações acessórias'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                    <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                      ⚠️ Impacto Negativo
                    </h4>
                    <p className="text-red-800 mb-3">
                      Sua atividade terá <strong>aumento de carga tributária</strong> com a reforma. 
                      O custo adicional será de <strong>R$ {Math.abs(resultado.analise.diferenca).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> por 
                      serviço prestado ({Math.abs(resultado.analise.variacao).toFixed(1)}% a mais).
                    </p>
                    <p className="text-red-700 text-sm">
                      <strong>Motivo:</strong> Alíquota IBS/CBS ({resultado.novo.aliquota}%) é maior que 
                      ISS+PIS/COFINS atual ({resultado.atual.percentual.toFixed(2)}%). Considere revisar 
                      preços e buscar eficiência operacional.
                    </p>
                  </div>
                )}

                {/* Recomendações Específicas */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-3">
                    📋 Recomendações para {getAtividadeInfo().label}
                  </h4>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    {atividade === 'saude' || atividade === 'educacao' ? (
                      <>
                        <li>✓ Sua atividade tem <strong>alíquota reduzida</strong> (60% = {resultado.novo.aliquota}%)</li>
                        <li>✓ Certifique-se de estar enquadrado corretamente para manter o benefício</li>
                        <li>✓ Organize documentação que comprove natureza da atividade</li>
                      </>
                    ) : (
                      <>
                        <li>✓ Sua atividade pagará alíquota padrão de {resultado.novo.aliquota}%</li>
                        <li>✓ Avalie se créditos de insumos/serviços podem reduzir alíquota efetiva</li>
                        <li>✓ Considere revisar estrutura de custos e precificação</li>
                      </>
                    )}
                    <li>✓ Implemente sistema fiscal compatível com IBS/CBS a partir de 2026</li>
                    <li>✓ Acompanhe legislação complementar para detalhes operacionais</li>
                    <li>✓ Considere consultoria tributária para planejamento personalizado</li>
                  </ul>
                </div>

                {/* Vantagens da Reforma */}
                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
                  <h4 className="font-bold text-purple-900 mb-3">
                    🚀 Vantagens para Prestadores de Serviços
                  </h4>
                  <ul className="space-y-2 text-purple-800 text-sm">
                    <li>✓ <strong>Fim da Guerra Fiscal:</strong> Alíquota única nacional, sem diferença entre estados</li>
                    <li>✓ <strong>Crédito Ampliado:</strong> Créditos sobre insumos, energia, aluguel, terceirizações</li>
                    <li>✓ <strong>Menos Burocracia:</strong> Unificação de obrigações acessórias (fim de DIEF, DMS, etc.)</li>
                    <li>✓ <strong>Previsibilidade:</strong> Legislação única, sem interpretações divergentes por município</li>
                    <li>✓ <strong>Competitividade:</strong> Exportação de serviços com alíquota zero e créditos mantidos</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Info Card */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mt-8 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-amber-900 mb-2">
                ℹ️ Sobre os Cálculos
              </h4>
              <p className="text-amber-800 leading-relaxed text-sm">
                ISS varia de 2% a 5% conforme município e atividade (usamos médias típicas). 
                PIS/COFINS não cumulativo = 9,25% (maioria dos prestadores). IBS/CBS padrão = 26,5%, 
                com <strong>alíquota reduzida (60% = 15,9%)</strong> para saúde e educação. 
                Alíquotas finais podem variar conforme legislação complementar.
              </p>
            </div>
          </div>
        </div>

        {/* ARTIGO SEO */}
        <article className="max-w-4xl mx-auto prose prose-lg">
          
          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Reforma Tributária e Prestação de Serviços: Guia Completo sobre o Fim do ISS
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            A <strong>Reforma Tributária (EC 132/2023)</strong> trará uma mudança histórica para os 
            prestadores de serviços no Brasil: o <strong>fim do ISS (Imposto Sobre Serviços)</strong>, 
            tributo municipal que existe há décadas. A partir de 2026, o ISS será gradualmente substituído 
            pelo <strong>IBS (Imposto sobre Bens e Serviços)</strong>, unificando a tributação sobre 
            serviços com a de mercadorias em um sistema nacional de <strong>IVA (Imposto sobre Valor Agregado)</strong>.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Esta mudança terá impactos profundos em <strong>todos</strong> os prestadores de serviços, 
            desde autônomos até grandes empresas. Este guia explica como funciona o sistema atual, 
            o que muda com a reforma, e <strong>como você deve se preparar</strong>.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Sistema Atual: ISS + PIS/COFINS
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            ISS (Imposto Sobre Serviços)
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            O <strong>ISS é um tributo municipal</strong> que incide sobre a prestação de serviços. 
            Suas características principais:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Alíquota:</strong> Varia de <strong>2% a 5%</strong> conforme o município e a atividade
            </li>
            <li>
              <strong>Local de recolhimento:</strong> Município onde o serviço é prestado (regra geral)
            </li>
            <li>
              <strong>Base de cálculo:</strong> Valor total do serviço (sem deduções)
            </li>
            <li>
              <strong>Sistema:</strong> <strong>Cumulativo</strong> (não gera créditos nas etapas seguintes)
            </li>
            <li>
              <strong>Legislação:</strong> 5.172 municípios com regras próprias, gerando insegurança jurídica
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            PIS/COFINS sobre Serviços
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Além do ISS, prestadores de serviços também pagam <strong>PIS/COFINS</strong>:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Regime Cumulativo (Simples/Presumido):</strong> 3,65% (PIS 0,65% + COFINS 3%)
            </li>
            <li>
              <strong>Regime Não Cumulativo (Lucro Real):</strong> 9,25% (PIS 1,65% + COFINS 7,6%)
            </li>
            <li>
              Não cumulativo permite <strong>créditos sobre alguns insumos</strong>, mas com restrições
            </li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-blue-900 mb-3">💡 Exemplo Prático - Consultoria (Lucro Real)</h4>
            <p className="text-gray-700 mb-2">
              <strong>Valor do serviço:</strong> R$ 10.000
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-2">
              <li>ISS (5%): R$ 500</li>
              <li>PIS/COFINS (9,25%): R$ 925</li>
              <li><strong>Total de tributos:</strong> R$ 1.425 (14,25%)</li>
              <li><strong>Valor líquido:</strong> R$ 8.575</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Sistema Novo: IBS + CBS (Pós-2026)
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            O que muda?
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            A partir de 2026, <strong>ISS, PIS e COFINS deixam de existir</strong> e são substituídos por:
          </p>

          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-green-900 mb-3">✅ IBS + CBS</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                <strong>IBS (Imposto sobre Bens e Serviços):</strong> Substitui ISS e ICMS - 
                arrecadação vai para Estados e Municípios
              </li>
              <li>
                <strong>CBS (Contribuição sobre Bens e Serviços):</strong> Substitui PIS/COFINS - 
                arrecadação federal
              </li>
              <li>
                <strong>Alíquota combinada:</strong> <strong>26,5%</strong> (IBS 16,165% + CBS 10,335%)
              </li>
              <li>
                <strong>Sistema:</strong> <strong>Não cumulativo pleno</strong> - crédito integral sobre insumos
              </li>
              <li>
                <strong>Legislação:</strong> Única e nacional, sem guerra fiscal ou diferenças municipais
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Alíquotas Reduzidas para Alguns Setores
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Serviços essenciais terão <strong>alíquota reduzida de 60%</strong> (15,9% ao invés de 26,5%):
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Saúde:</strong> Clínicas, hospitais, médicos, dentistas, fisioterapeutas
            </li>
            <li>
              <strong>Educação:</strong> Escolas, universidades, cursos profissionalizantes
            </li>
            <li>
              <strong>Transporte público coletivo:</strong> Ônibus, metrô, trens urbanos
            </li>
            <li>
              <strong>Cultura:</strong> Produções artísticas, teatros, cinemas (em análise)
            </li>
          </ul>

          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-purple-900 mb-3">💡 Exemplo Prático - Consultoria (Pós-Reforma)</h4>
            <p className="text-gray-700 mb-2">
              <strong>Valor do serviço:</strong> R$ 10.000
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-2">
              <li>ISS: <span className="line-through">Extinto</span></li>
              <li>PIS/COFINS: <span className="line-through">Extinto</span></li>
              <li>IBS + CBS (26,5%): R$ 2.650</li>
              <li><strong>Total de tributos:</strong> R$ 2.650 (26,5%)</li>
              <li><strong>Valor líquido:</strong> R$ 7.350</li>
            </ul>
            <p className="text-red-700 font-bold mt-3">
              ⚠️ Aumento de R$ 1.225 (85% a mais em tributos)
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Quem Ganha e Quem Perde?
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Setores que GANHAM com a Reforma
          </h3>

          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-green-900 mb-3">✅ Beneficiados</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                <strong>Saúde e Educação:</strong> Alíquota cai de ~14% para <strong>15,9%</strong>, 
                mas com <strong>créditos plenos</strong> que reduzem custo final
              </li>
              <li>
                <strong>Tecnologia (alguns municípios):</strong> ISS 2% + PIS/COFINS 9,25% = 11,25% → 
                IBS/CBS 26,5%, mas <strong>créditos sobre cloud, software, equipamentos</strong> podem 
                reduzir alíquota efetiva abaixo de 11%
              </li>
              <li>
                <strong>Serviços industriais:</strong> Créditos ampliados sobre insumos, energia, 
                terceirizações reduzem significativamente o custo
              </li>
              <li>
                <strong>Exportadores de serviços:</strong> Alíquota <strong>zero</strong> + manutenção 
                de créditos = competitividade internacional
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Setores que PERDEM com a Reforma
          </h3>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-red-900 mb-3">⚠️ Impacto Negativo</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                <strong>Consultoria e Advocacia:</strong> ISS 5% + PIS/COFINS 9,25% = 14,25% → 
                <strong>26,5%</strong> (aumento de 86%)
              </li>
              <li>
                <strong>Serviços profissionais (alto valor agregado):</strong> Alíquota dobra, 
                com poucos créditos a apropriar (baixo custo de insumos)
              </li>
              <li>
                <strong>Prestadores autônomos:</strong> Aumento expressivo, sem créditos significativos
              </li>
              <li>
                <strong>Marketing e Publicidade:</strong> ISS 5% + PIS/COFINS 9,25% = 14,25% → 26,5%
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Créditos: A Chave para Reduzir a Alíquota Efetiva
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            O que gera crédito no novo sistema?
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Diferente do ISS (cumulativo), o <strong>IBS/CBS é não cumulativo pleno</strong>. 
            Isso significa que <strong>TODO</strong> gasto com IBS/CBS gera crédito:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Insumos:</strong> Materiais usados na prestação do serviço
            </li>
            <li>
              <strong>Serviços de terceiros:</strong> Contratações de PJ, terceirizações
            </li>
            <li>
              <strong>Energia elétrica:</strong> Consumo em escritórios e operações
            </li>
            <li>
              <strong>Telecomunicações:</strong> Internet, telefonia, cloud computing
            </li>
            <li>
              <strong>Aluguel:</strong> Escritórios, equipamentos
            </li>
            <li>
              <strong>Software:</strong> Licenças, SaaS, ferramentas
            </li>
            <li>
              <strong>Equipamentos:</strong> Computadores, móveis, ativos (crédito em 5 anos)
            </li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-blue-900 mb-3">💡 Exemplo: Agência de Marketing Digital</h4>
            <p className="text-gray-700 mb-2">
              <strong>Receita:</strong> R$ 50.000/mês
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Débito de IBS/CBS:</strong> R$ 50.000 × 26,5% = R$ 13.250
            </p>
            <p className="text-gray-700 mb-2 font-semibold">
              Créditos mensais:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-3">
              <li>Freelancers (R$ 15.000): R$ 3.975 de crédito</li>
              <li>Software/Cloud (R$ 3.000): R$ 795 de crédito</li>
              <li>Aluguel (R$ 2.000): R$ 530 de crédito</li>
              <li>Internet/Tel (R$ 500): R$ 133 de crédito</li>
              <li>Energia (R$ 300): R$ 80 de crédito</li>
              <li><strong>Total de créditos:</strong> R$ 5.513</li>
            </ul>
            <p className="text-green-700 font-bold">
              ✅ IBS/CBS efetivo: R$ 13.250 - R$ 5.513 = <strong>R$ 7.737</strong>
            </p>
            <p className="text-green-700 font-bold">
              Alíquota efetiva: 15,5% (ao invés de 26,5%)
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Como Se Preparar para a Mudança
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Passo 1: Mapeie Seus Custos Credenciáveis
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Ação imediata:</strong> Liste TODOS os gastos que gerarão crédito:
          </p>

          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Revise contratos de fornecedores e prestadores de serviços</li>
            <li>Identifique gastos com software, cloud, SaaS</li>
            <li>Mapeie custos de energia, telecomunicações, aluguel</li>
            <li>Calcule investimentos em equipamentos (crédito em 5 anos)</li>
            <li>Estime alíquota efetiva considerando TODOS os créditos</li>
          </ol>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Passo 2: Revise Sua Precificação
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Se sua carga tributária aumentar, você terá duas opções:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Repassar ao cliente:</strong> Ajustar preços para manter margem
            </li>
            <li>
              <strong>Absorver o custo:</strong> Reduzir margem ou buscar eficiência operacional
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Importante:</strong> Faça simulações <strong>agora</strong> para negociar 
            contratos de longo prazo com cláusulas de reajuste vinculadas à reforma.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Passo 3: Atualize Sistemas e Processos
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            O sistema de IBS/CBS será <strong>totalmente digital</strong>:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Split Payment:</strong> Tributo retido automaticamente em operações com cartão
            </li>
            <li>
              <strong>Nota Fiscal Eletrônica:</strong> Padrão nacional único
            </li>
            <li>
              <strong>Gestão de Créditos:</strong> Sistema automatizado de apropriação
            </li>
            <li>
              <strong>Conciliação Fiscal:</strong> Integração com Comitê Gestor do IBS
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-6">
            Invista em <strong>ERP ou sistema fiscal</strong> compatível com IBS/CBS a partir de 2025.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Passo 4: Consulte um Especialista
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            A reforma é complexa. Considere contratar:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>
              <strong>Consultoria tributária:</strong> Análise personalizada do impacto
            </li>
            <li>
              <strong>Contador especializado:</strong> Implantação de controles de crédito
            </li>
            <li>
              <strong>Consultoria jurídica:</strong> Revisão de contratos e cláusulas tributárias
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                1. O ISS acaba de vez em 2026?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Não.</strong> A transição é gradual. Em 2026, ISS cairá para 90% e IBS 
                iniciará com 10%. ISS chegará a zero apenas em <strong>2033</strong>.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                2. Autônomos também pagarão 26,5%?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Depende.</strong> Autônomos no <strong>Simples Nacional</strong> terão 
                alíquotas diferenciadas (menores). Mas autônomos no Lucro Presumido/Real sim, 
                pagarão 26,5% (menos créditos).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                3. MEI continuará existindo?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sim.</strong> MEI continuará com alíquotas reduzidas. A reforma não altera 
                o regime do MEI, que manterá suas vantagens.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                4. Exportação de serviços terá alíquota zero?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sim!</strong> Exportações de serviços terão <strong>alíquota zero</strong> 
                de IBS/CBS, e os créditos da cadeia serão mantidos, aumentando a competitividade.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                5. Posso acumular créditos indefinidamente?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sim.</strong> Se você tiver mais créditos que débitos, o saldo fica 
                acumulado para compensação futura ou ressarcimento (conforme regras a definir).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                6. Como ficam contratos de longo prazo?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Risco!</strong> Contratos firmados hoje sem cláusula de reajuste tributário 
                podem gerar prejuízo pós-2026. Revise TODOS os contratos vigentes.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                7. Municípios perderão arrecadação com o fim do ISS?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Não necessariamente.</strong> Municípios receberão parte do IBS. Haverá 
                <strong> fundo de compensação</strong> para evitar perdas de receita durante a transição.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Termos Importantes
          </h2>

          <dl className="space-y-4">
            <div>
              <dt className="font-bold text-gray-900">IBS (Imposto sobre Bens e Serviços)</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Tributo subnacional (Estados + Municípios) que substitui ICMS e ISS. Alíquota de 
                <strong> 16,165%</strong> sobre bens e serviços.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">CBS (Contribuição sobre Bens e Serviços)</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Tributo federal que substitui PIS/COFINS. Alíquota de <strong>10,335%</strong> 
                sobre bens e serviços.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Não Cumulatividade Plena</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Sistema em que <strong>todos</strong> os gastos com IBS/CBS geram crédito, sem 
                restrições (diferente do sistema atual).
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Split Payment</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Retenção automática do tributo pelo intermediário (banco, cartão) no momento da 
                transação, garantindo arrecadação.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Alíquota Efetiva</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Percentual real de tributos pagos após apropriação de todos os créditos. Pode ser 
                muito menor que 26,5% conforme os créditos.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Comitê Gestor do IBS</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Órgão federativo que administrará o IBS, composto por representantes de Estados e Municípios.
              </dd>
            </div>
          </dl>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Base Legal
          </h2>

          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Emenda Constitucional 132/2023:</strong> Institui IBS e CBS, extingue ISS
            </li>
            <li>
              <strong>Art. 156-A, CF:</strong> Cria o IBS como tributo subnacional
            </li>
            <li>
              <strong>Art. 195, §12, CF:</strong> Extingue PIS/COFINS e cria CBS
            </li>
            <li>
              <strong>Lei Complementar (em elaboração):</strong> Regulamentará alíquotas reduzidas 
              e transição do ISS
            </li>
            <li>
              <strong>Cronograma de Transição:</strong> 2026-2033 (redução gradual de ISS e aumento de IBS)
            </li>
          </ul>

          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg mt-8">
            <p className="text-gray-800 leading-relaxed">
              <strong>🚀 Próximo Passo:</strong> Use nosso simulador acima para calcular o impacto 
              exato na sua prestação de serviços. Insira o valor dos seus serviços, escolha sua 
              atividade e veja a diferença entre ISS+PIS/COFINS atual e IBS+CBS futuro. Para análises 
              personalizadas considerando seus créditos específicos, consulte um contador ou 
              especialista em planejamento tributário.
            </p>
          </div>

        </article>

      </div>
    </div>
  );
}

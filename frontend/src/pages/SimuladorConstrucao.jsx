import { useState } from 'react';
import { Calculator, HardHat, TrendingUp, Wrench, Info, Building2 } from 'lucide-react';

export default function SimuladorConstrucao() {
  const [valorMateriais, setValorMateriais] = useState('100000');
  const [valorMaoObra, setValorMaoObra] = useState('50000');
  const [tipoObra, setTipoObra] = useState('residencial');
  const [estado, setEstado] = useState('SP');
  const [resultado, setResultado] = useState(null);

  const tiposObra = [
    { value: 'residencial', label: 'Residencial (Casa/Apartamento)', icon: '🏠', reducao: 60 },
    { value: 'comercial', label: 'Comercial (Loja/Escritório)', icon: '🏢', reducao: 0 },
    { value: 'industrial', label: 'Industrial (Galpão/Fábrica)', icon: '🏭', reducao: 0 },
    { value: 'infraestrutura', label: 'Infraestrutura Pública', icon: '🛣️', reducao: 100 }, // Possível isenção
    { value: 'reforma', label: 'Reforma/Manutenção', icon: '🔧', reducao: 0 }
  ];

  const estados = [
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'PE', nome: 'Pernambuco' }
  ];

  const calcular = () => {
    const materiais = parseFloat(valorMateriais);
    const maoObra = parseFloat(valorMaoObra);
    
    if (!materiais || materiais < 0 || !maoObra || maoObra < 0) {
      alert('Insira valores válidos para materiais e mão de obra');
      return;
    }

    const valorTotal = materiais + maoObra;

    // Sistema Atual: ICMS (materiais) + ISS (mão de obra) + PIS/COFINS
    // ICMS: média de 18% sobre materiais
    const icmsMateriais = materiais * 0.18;
    
    // ISS: varia por município, média 5% sobre mão de obra
    const issMaoObra = maoObra * 0.05;
    
    // PIS/COFINS: 9,25% sobre materiais (regime não cumulativo)
    // Sobre mão de obra: 9,25% também
    const pisCofins = valorTotal * 0.0925;
    
    const totalAtual = icmsMateriais + issMaoObra + pisCofins;
    const percentualAtual = (totalAtual / valorTotal) * 100;

    // Sistema Novo: IBS + CBS
    // Alíquota padrão: 26,5%
    // Reduções: residencial (60% = 15,9%), infraestrutura (possível 100% = isento)
    const obraInfo = tiposObra.find(t => t.value === tipoObra);
    const reducaoPercentual = obraInfo ? obraInfo.reducao : 0;
    
    const aliquotaBase = 26.5;
    let aliquotaNova = aliquotaBase;
    
    if (reducaoPercentual === 100) {
      aliquotaNova = 0; // Infraestrutura isenta
    } else if (reducaoPercentual === 60) {
      aliquotaNova = aliquotaBase * 0.60; // 15,9%
    }
    
    const totalNovo = valorTotal * (aliquotaNova / 100);
    
    // Créditos de IBS/CBS sobre materiais (não cumulatividade)
    // Construtora pode creditar IBS/CBS pago na compra de materiais
    const creditosMateriais = materiais * (aliquotaNova / 100);
    
    // Tributo efetivo (após créditos)
    const tributoEfetivo = totalNovo - creditosMateriais;
    const aliquotaEfetiva = (tributoEfetivo / valorTotal) * 100;

    // Análise
    const diferenca = totalAtual - tributoEfetivo;
    const variacao = totalAtual > 0 ? ((tributoEfetivo - totalAtual) / totalAtual) * 100 : 0;

    // Custo final
    const custoFinalAtual = valorTotal + totalAtual;
    const custoFinalNovo = valorTotal + tributoEfetivo;

    setResultado({
      materiais,
      maoObra,
      valorTotal,
      tipoObra: obraInfo,
      atual: {
        icms: icmsMateriais,
        iss: issMaoObra,
        pisCofins: pisCofins,
        total: totalAtual,
        percentual: percentualAtual,
        custoFinal: custoFinalAtual
      },
      novo: {
        aliquotaNominal: aliquotaNova,
        tributoNominal: totalNovo,
        creditos: creditosMateriais,
        tributoEfetivo: tributoEfetivo,
        aliquotaEfetiva: aliquotaEfetiva,
        custoFinal: custoFinalNovo
      },
      analise: {
        diferenca: diferenca,
        variacao: variacao,
        economiza: diferenca > 0
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HardHat className="w-12 h-12 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Simulador para Construção Civil
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calcule o impacto da <strong>Reforma Tributária</strong> em obras e construções. 
            Compare <strong>ICMS + ISS + PIS/COFINS</strong> com o novo sistema <strong>IBS/CBS</strong>.
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          
          {/* Tipo de Obra */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🏗️ Tipo de Obra
            </label>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tiposObra.map(tipo => (
                <button
                  key={tipo.value}
                  onClick={() => setTipoObra(tipo.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    tipoObra === tipo.value
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tipo.icon}</span>
                    <div>
                      <span className="text-sm font-medium text-gray-700 block">{tipo.label}</span>
                      {tipo.reducao > 0 && (
                        <span className="text-xs text-green-600 font-semibold">
                          {tipo.reducao === 100 ? 'Isento' : `Alíquota ${100 - tipo.reducao}%`}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            
            {/* Materiais */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🧱 Valor dos Materiais (R$)
              </label>
              <input
                type="number"
                value={valorMateriais}
                onChange={(e) => setValorMateriais(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="100000"
                min="0"
                step="1000"
              />
              <p className="text-sm text-gray-500 mt-1">
                Cimento, tijolos, telhas, ferro, etc.
              </p>
            </div>

            {/* Mão de Obra */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👷 Valor da Mão de Obra (R$)
              </label>
              <input
                type="number"
                value={valorMaoObra}
                onChange={(e) => setValorMaoObra(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="50000"
                min="0"
                step="1000"
              />
              <p className="text-sm text-gray-500 mt-1">
                Pedreiros, eletricistas, encanadores, etc.
              </p>
            </div>

          </div>

          {/* Estado */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📍 Estado da Obra
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {estados.map(e => (
                <option key={e.sigla} value={e.sigla}>{e.nome}</option>
              ))}
            </select>
          </div>

          {/* Botão Calcular */}
          <button
            onClick={calcular}
            className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-bold py-4 px-8 rounded-lg hover:from-orange-700 hover:to-yellow-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calcular Impacto Tributário na Obra
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
                    {resultado.tipoObra.icon} {resultado.tipoObra.label}
                  </h3>
                  <p className="text-gray-600">
                    {estado} • Valor Total da Obra: R$ {resultado.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                {resultado.analise.economiza ? (
                  <TrendingUp className="w-16 h-16 text-green-600" />
                ) : (
                  <Building2 className="w-16 h-16 text-orange-600" />
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
                  <p className="text-sm text-gray-600 mb-1">Pós-Reforma (Efetivo)</p>
                  <p className="text-3xl font-bold text-gray-900">
                    R$ {resultado.novo.tributoEfetivo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-purple-600 font-medium mt-2">
                    {resultado.novo.aliquotaEfetiva.toFixed(2)}% efetiva
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

            {/* Detalhamento dos Componentes */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Wrench className="w-7 h-7 text-orange-600" />
                Composição da Obra
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                  <h4 className="font-bold text-blue-900 mb-3 text-lg">
                    🧱 Materiais
                  </h4>
                  <p className="text-3xl font-bold text-blue-700 mb-2">
                    R$ {resultado.materiais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-blue-600">
                    {((resultado.materiais / resultado.valorTotal) * 100).toFixed(1)}% do valor total
                  </p>
                  <p className="text-xs text-gray-600 mt-3">
                    Gera créditos de IBS/CBS no novo sistema
                  </p>
                </div>

                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
                  <h4 className="font-bold text-orange-900 mb-3 text-lg">
                    👷 Mão de Obra
                  </h4>
                  <p className="text-3xl font-bold text-orange-700 mb-2">
                    R$ {resultado.maoObra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-orange-600">
                    {((resultado.maoObra / resultado.valorTotal) * 100).toFixed(1)}% do valor total
                  </p>
                  <p className="text-xs text-gray-600 mt-3">
                    Tributada normalmente (ISS → IBS/CBS)
                  </p>
                </div>
              </div>
            </div>

            {/* Tabela Comparativa */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calculator className="w-7 h-7 text-green-600" />
                Comparação Detalhada de Tributos
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
                      <td className="py-4 px-4 font-medium text-gray-900">Valor Total da Obra</td>
                      <td className="py-4 px-4 text-right text-gray-900">
                        R$ {resultado.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-900">
                        R$ {resultado.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-700">
                        ICMS sobre Materiais
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-blue-600 font-semibold">
                          R$ {resultado.atual.icms.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <br />
                        <span className="text-xs text-gray-500">
                          ~18%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-400">
                        <span className="line-through">Extinto</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-700">
                        ISS sobre Mão de Obra
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-blue-600 font-semibold">
                          R$ {resultado.atual.iss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <br />
                        <span className="text-xs text-gray-500">
                          ~5%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-400">
                        <span className="line-through">Extinto</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-700">
                        PIS/COFINS
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
                        IBS + CBS (Nominal)
                      </td>
                      <td className="py-4 px-4 text-right text-gray-400">
                        —
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-purple-600 font-semibold">
                          R$ {resultado.novo.tributoNominal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <br />
                        <span className="text-xs text-gray-500">
                          {resultado.novo.aliquotaNominal.toFixed(2)}%
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50 bg-green-50">
                      <td className="py-4 px-4 text-gray-700">
                        (-) Créditos sobre Materiais
                      </td>
                      <td className="py-4 px-4 text-right text-gray-400">
                        —
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-green-600 font-semibold">
                          - R$ {resultado.novo.creditos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <br />
                        <span className="text-xs text-gray-500">
                          Não cumulatividade
                        </span>
                      </td>
                    </tr>

                    <tr className="bg-gray-100 font-bold">
                      <td className="py-4 px-4 text-gray-900">Total de Tributos</td>
                      <td className="py-4 px-4 text-right text-blue-700">
                        R$ {resultado.atual.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right text-purple-700">
                        R$ {resultado.novo.tributoEfetivo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>

                    <tr className="bg-orange-50 font-bold text-lg">
                      <td className="py-4 px-4 text-gray-900">Custo Total da Obra</td>
                      <td className="py-4 px-4 text-right text-blue-700">
                        R$ {resultado.atual.custoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right text-purple-700">
                        R$ {resultado.novo.custoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                Análise para {resultado.tipoObra.label}
              </h3>

              <div className="space-y-4">
                {resultado.tipoObra.reducao === 60 && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                    <h4 className="font-bold text-green-900 mb-2">
                      ✅ Alíquota Reduzida - Habitação de Interesse Social
                    </h4>
                    <p className="text-green-800 mb-3">
                      Obras residenciais terão <strong>alíquota reduzida de 60%</strong>, pagando 
                      15,9% ao invés de 26,5%. Este benefício visa tornar a moradia mais acessível.
                    </p>
                    <p className="text-green-700 text-sm">
                      <strong>Créditos adicionais:</strong> A não cumulatividade permite descontar 
                      IBS/CBS pago na compra de materiais, reduzindo ainda mais a carga efetiva.
                    </p>
                  </div>
                )}

                {resultado.tipoObra.reducao === 100 && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-2">
                      🏛️ Infraestrutura Pública - Possível Isenção
                    </h4>
                    <p className="text-blue-800 mb-3">
                      Obras de infraestrutura pública podem ser <strong>isentas de IBS/CBS</strong>, 
                      reduzindo drasticamente o custo de projetos governamentais.
                    </p>
                    <p className="text-blue-700 text-sm">
                      <strong>Atenção:</strong> Isenção depende de regulamentação. Consulte a 
                      lei complementar para confirmar elegibilidade.
                    </p>
                  </div>
                )}

                {resultado.tipoObra.reducao === 0 && (
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
                    <h4 className="font-bold text-orange-900 mb-2">
                      ⚙️ Alíquota Padrão (26,5%)
                    </h4>
                    <p className="text-orange-800 mb-3">
                      Obras comerciais e industriais pagarão a <strong>alíquota padrão</strong>. 
                      Porém, a não cumulatividade compensa parte do aumento tributário.
                    </p>
                    <p className="text-orange-700 text-sm">
                      <strong>Vantagem:</strong> Créditos sobre materiais reduzem a alíquota efetiva 
                      para cerca de {resultado.novo.aliquotaEfetiva.toFixed(1)}% neste caso.
                    </p>
                  </div>
                )}

                {/* Recomendações Gerais */}
                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
                  <h4 className="font-bold text-purple-900 mb-3">
                    💡 Recomendações para Construtoras
                  </h4>
                  <ul className="space-y-2 text-purple-800 text-sm">
                    <li>✓ <strong>Maximize créditos:</strong> Exija notas fiscais corretas de fornecedores</li>
                    <li>✓ <strong>Sistema fiscal:</strong> Implemente ERP compatível com IBS/CBS até 2025</li>
                    <li>✓ <strong>Contratos:</strong> Atualize cláusulas para refletir novo regime tributário</li>
                    <li>✓ <strong>Treinamento:</strong> Capacite equipe fiscal para gestão de créditos</li>
                    <li>✓ <strong>Planejamento:</strong> Obras iniciadas em 2026+ já seguem regime novo</li>
                    <li>✓ <strong>Precificação:</strong> Recalcule orçamentos considerando mudanças tributárias</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Info Card */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mt-8">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-amber-900 mb-2">
                ℹ️ Sobre os Cálculos
              </h4>
              <p className="text-amber-800 leading-relaxed text-sm">
                Os cálculos consideram ICMS médio de 18% sobre materiais, ISS médio de 5% sobre mão de obra, 
                e PIS/COFINS de 9,25%. Pós-reforma: IBS/CBS de 26,5% (ou 15,9% para residencial), com 
                <strong> créditos integrais sobre materiais</strong> devido à não cumulatividade. 
                Alíquotas podem variar conforme legislação complementar final.
              </p>
            </div>
          </div>
        </div>

        {/* Artigo SEO */}
        <article className="bg-white rounded-2xl shadow-xl p-12 mt-8 prose prose-lg max-w-none">
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-4 border-orange-500 pb-4">
            Reforma Tributária na Construção Civil: Como IBS e CBS Mudam Obras e Materiais
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            O setor de <strong>construção civil</strong> brasileiro passará por profundas transformações 
            com a <strong>Reforma Tributária de 2026</strong>. A extinção do ICMS, ISS e PIS/COFINS, 
            substituídos por <strong>IBS (Imposto sobre Bens e Serviços)</strong> e <strong>CBS 
            (Contribuição sobre Bens e Serviços)</strong>, criará um novo ambiente fiscal para 
            construtoras, engenheiros e empreiteiras. Este artigo detalha os impactos nos materiais, 
            mão de obra e créditos tributários.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            🏗️ O Que Muda na Construção Civil?
          </h3>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Sistema Atual (até 2025)
          </h4>
          <ul className="space-y-2 text-gray-700 ml-6 mb-6">
            <li><strong>• ICMS sobre materiais:</strong> Varia entre 12% e 18% conforme estado</li>
            <li><strong>• ISS sobre mão de obra:</strong> Alíquota municipal entre 2% e 5%</li>
            <li><strong>• PIS/COFINS:</strong> 9,25% sobre faturamento (regime não cumulativo)</li>
            <li><strong>• Variação regional:</strong> Custo tributário muda drasticamente por estado</li>
            <li><strong>• Complexidade:</strong> Três tributos, três bases de cálculo, três guias</li>
          </ul>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Sistema Novo (a partir de 2026)
          </h4>
          <ul className="space-y-2 text-gray-700 ml-6 mb-6">
            <li><strong>• IBS + CBS unificados:</strong> Alíquota total de 26,5% (estimada)</li>
            <li><strong>• Mesma alíquota em todo Brasil:</strong> Fim da guerra fiscal entre estados</li>
            <li><strong>• Não cumulatividade plena:</strong> Créditos integrais sobre materiais</li>
            <li><strong>• Alíquota reduzida (60%):</strong> Habitação de interesse social paga 15,9%</li>
            <li><strong>• Simplicidade:</strong> Um tributo, uma base, uma guia</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            🧱 Materiais de Construção: Créditos e Deduções
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            A <strong>não cumulatividade</strong> é a maior revolução para construtoras. Hoje, 
            PIS/COFINS já permite créditos, mas o ICMS tem limitações. Pós-reforma, <strong>todo 
            IBS/CBS pago na compra de materiais pode ser creditado</strong>, reduzindo o tributo 
            devido na venda ou na prestação do serviço de construção.
          </p>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg my-6">
            <h4 className="font-bold text-green-900 mb-3">
              ✅ Exemplos de Créditos sobre Materiais
            </h4>
            <ul className="space-y-2 text-green-800 text-sm">
              <li>• <strong>Cimento, areia, brita:</strong> Crédito integral do IBS/CBS pago ao fornecedor</li>
              <li>• <strong>Tijolos, telhas, blocos:</strong> 100% de crédito aproveitável</li>
              <li>• <strong>Vergalhões de aço:</strong> Crédito total na compra</li>
              <li>• <strong>Tintas, revestimentos:</strong> IBS/CBS na nota fiscal vira crédito</li>
              <li>• <strong>Madeira, portas, janelas:</strong> Dedução completa</li>
              <li>• <strong>Ferragens, tubos, conexões:</strong> Crédito sobre valor pago</li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            Na prática, se uma construtora compra R$ 100.000 em materiais com 26,5% de IBS/CBS 
            (R$ 26.500), ela poderá <strong>deduzir esses R$ 26.500</strong> do tributo devido na 
            venda do imóvel ou na prestação do serviço. Isso reduz drasticamente a carga tributária efetiva.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            👷 Mão de Obra: Fim do ISS e Nova Tributação
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Hoje, serviços de construção civil pagam <strong>ISS municipal</strong> (alíquota varia 
            entre 2% e 5% conforme cidade). Com a reforma, o ISS é <strong>extinto</strong>, e a 
            mão de obra passa a ser tributada por <strong>IBS + CBS</strong>.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg my-6">
            <h4 className="font-bold text-blue-900 mb-3">
              📊 Comparação: Mão de Obra em Obra de R$ 50.000
            </h4>
            <table className="w-full text-sm mt-3">
              <thead>
                <tr className="border-b-2 border-blue-300">
                  <th className="text-left py-2 text-blue-900">Tributo</th>
                  <th className="text-right py-2 text-blue-900">Sistema Atual</th>
                  <th className="text-right py-2 text-blue-900">Pós-Reforma</th>
                </tr>
              </thead>
              <tbody className="text-blue-800">
                <tr className="border-b border-blue-200">
                  <td className="py-2">ISS (5%)</td>
                  <td className="text-right">R$ 2.500</td>
                  <td className="text-right text-gray-400">Extinto</td>
                </tr>
                <tr className="border-b border-blue-200">
                  <td className="py-2">PIS/COFINS (9,25%)</td>
                  <td className="text-right">R$ 4.625</td>
                  <td className="text-right text-gray-400">Extinto</td>
                </tr>
                <tr className="border-b border-blue-200">
                  <td className="py-2">IBS + CBS (26,5%)</td>
                  <td className="text-right text-gray-400">—</td>
                  <td className="text-right font-bold">R$ 13.250</td>
                </tr>
                <tr className="font-bold">
                  <td className="py-2">Total</td>
                  <td className="text-right">R$ 7.125</td>
                  <td className="text-right">R$ 13.250</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            À primeira vista, parece um <strong>aumento de 86%</strong> na tributação da mão de obra. 
            Porém, é preciso considerar: (1) a alíquota reduzida para habitação de interesse social; 
            (2) os créditos sobre materiais, que compensam parte do aumento; (3) a simplificação 
            operacional, que reduz custos de compliance.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            🏠 Habitação de Interesse Social: Alíquota Reduzida
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            A Emenda Constitucional 132/2023 prevê <strong>alíquota reduzida de 60%</strong> para 
            construção de habitações de interesse social. Isso significa que, ao invés de pagar 26,5%, 
            essas obras pagarão <strong>15,9%</strong> de IBS + CBS.
          </p>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg my-6">
            <h4 className="font-bold text-green-900 mb-3">
              🏡 Quem se Beneficia da Alíquota Reduzida?
            </h4>
            <ul className="space-y-2 text-green-800 text-sm">
              <li>✓ <strong>Programas habitacionais:</strong> Minha Casa Minha Vida e similares</li>
              <li>✓ <strong>Imóveis de baixa renda:</strong> Definição depende de regulamentação</li>
              <li>✓ <strong>Construção de unidades populares:</strong> Casas e apartamentos econômicos</li>
              <li>✓ <strong>Construtoras credenciadas:</strong> Registro em órgãos competentes</li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            Exemplo: Uma obra residencial de R$ 150.000 (materiais + mão de obra) pagará R$ 23.850 
            de IBS/CBS (15,9%). Considerando créditos de R$ 10.000 sobre materiais, o tributo efetivo 
            cai para <strong>R$ 13.850</strong>, tornando a moradia mais acessível.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            🏢 Obras Comerciais e Industriais: Alíquota Padrão
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Construções de <strong>lojas, escritórios, galpões industriais e shoppings</strong> não 
            terão alíquota reduzida, pagando os <strong>26,5%</strong> integrais de IBS + CBS. Porém, 
            a não cumulatividade funciona igualmente: créditos sobre materiais reduzem a carga efetiva.
          </p>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg my-6">
            <h4 className="font-bold text-orange-900 mb-3">
              📊 Exemplo: Obra Comercial de R$ 200.000
            </h4>
            <ul className="space-y-2 text-orange-800 text-sm">
              <li>• <strong>Materiais:</strong> R$ 120.000 (60% da obra)</li>
              <li>• <strong>Mão de obra:</strong> R$ 80.000 (40% da obra)</li>
              <li>• <strong>IBS/CBS nominal (26,5%):</strong> R$ 53.000</li>
              <li>• <strong>Créditos sobre materiais:</strong> - R$ 31.800 (26,5% de R$ 120.000)</li>
              <li>• <strong>Tributo efetivo:</strong> R$ 21.200 (10,6% do valor total)</li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            Ou seja, mesmo com alíquota nominal de 26,5%, a <strong>carga efetiva cai para 10,6%</strong> 
            graças aos créditos. Esse percentual é competitivo frente ao sistema atual (ICMS + ISS + 
            PIS/COFINS somam facilmente 15% a 20%).
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            🛣️ Infraestrutura Pública: Possibilidade de Isenção
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Obras de <strong>infraestrutura pública</strong> (estradas, pontes, saneamento, metrôs) 
            podem ser <strong>isentas de IBS e CBS</strong>, conforme a Lei Complementar ainda em 
            tramitação. A isenção visa baratear investimentos governamentais e acelerar projetos 
            prioritários.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Se confirmada, uma obra pública de R$ 10 milhões economizaria cerca de <strong>R$ 2,65 
            milhões</strong> em tributos, permitindo reinvestir essa quantia em mais infraestrutura.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            🔧 Reforma e Manutenção: Tributação Simplificada
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Serviços de <strong>reforma, pintura, reparos e manutenção predial</strong> também serão 
            tributados por IBS/CBS, substituindo o atual ISS. Como geralmente essas obras consomem 
            poucos materiais (predominância de mão de obra), os créditos serão menores, mas a 
            <strong>alíquota unificada</strong> simplifica o compliance.
          </p>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg my-6">
            <h4 className="font-bold text-purple-900 mb-3">
              🎨 Exemplo: Serviço de Pintura de R$ 10.000
            </h4>
            <ul className="space-y-2 text-purple-800 text-sm">
              <li>• <strong>Mão de obra:</strong> R$ 7.000 (70%)</li>
              <li>• <strong>Materiais (tintas):</strong> R$ 3.000 (30%)</li>
              <li>• <strong>IBS/CBS nominal:</strong> R$ 2.650 (26,5%)</li>
              <li>• <strong>Créditos sobre tintas:</strong> - R$ 795 (26,5% de R$ 3.000)</li>
              <li>• <strong>Tributo efetivo:</strong> R$ 1.855 (18,55%)</li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            💡 Estratégias para Construtoras e Empreiteiras
          </h3>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            1. Maximize o Aproveitamento de Créditos
          </h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            Exija <strong>notas fiscais corretas</strong> de todos os fornecedores. Cada centavo de 
            IBS/CBS pago em materiais vira crédito. Negocie com fornecedores que emitam NF-e completas 
            e no prazo.
          </p>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            2. Implemente Sistema Fiscal Adequado
          </h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            ERPs e sistemas de gestão precisarão ser atualizados para calcular IBS/CBS e gerenciar 
            créditos. Invista em <strong>automação fiscal</strong> até 2025, preparando-se para a 
            transição.
          </p>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            3. Revise Contratos e Orçamentos
          </h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            Contratos de empreitada assinados antes de 2026 podem ter <strong>cláusulas de ajuste</strong> 
            tributário. Orçamentos devem refletir a nova carga fiscal, seja maior ou menor conforme 
            a composição materiais/mão de obra.
          </p>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            4. Capacite a Equipe Fiscal
          </h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            Contadores e gestores fiscais precisam dominar as regras de <strong>não cumulatividade, 
            split payment e créditos de IBS/CBS</strong>. Treinamentos e consultorias especializadas 
            são essenciais.
          </p>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            5. Planeje a Transição (2026-2032)
          </h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            A reforma será gradual: IBS/CBS começam em 2026 com alíquotas baixas (teste), crescem 
            até 2032, quando ICMS/ISS serão extintos. Obras de longo prazo precisam planejar qual 
            regime aplicar.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            📋 Perguntas Frequentes (FAQ)
          </h3>

          <div className="space-y-6">
            
            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                1. Obras iniciadas em 2025 pagarão qual tributo?
              </h4>
              <p className="text-gray-700 text-sm">
                Obras iniciadas antes de 2026 seguem o regime antigo (ICMS, ISS, PIS/COFINS) até a 
                conclusão, salvo se a construtora optar por migrar para o novo regime durante a transição.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                2. Materiais importados terão crédito de IBS/CBS?
              </h4>
              <p className="text-gray-700 text-sm">
                Sim. IBS/CBS incidem também na importação. O tributo pago na alfândega pode ser 
                creditado pela construtora ao adquirir o material do importador.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                3. Pequenas reformas (autônomos) pagarão IBS/CBS?
              </h4>
              <p className="text-gray-700 text-sm">
                Depende do faturamento. Microempreendedores Individuais (MEI) e Simples Nacional têm 
                regras específicas, com alíquotas reduzidas ou isenção parcial.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                4. Construção própria (uso próprio) é tributada?
              </h4>
              <p className="text-gray-700 text-sm">
                Pessoa física construindo para morar não paga IBS/CBS sobre a obra (não há receita). 
                Porém, pagará IBS/CBS embutido no preço dos materiais adquiridos.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                5. Crédito de IBS/CBS expira?
              </h4>
              <p className="text-gray-700 text-sm">
                A legislação ainda está em definição, mas a tendência é que créditos sejam 
                <strong> ressarcíveis</strong> ou <strong>transferíveis</strong>, evitando perda.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                6. Equipamentos (betoneiras, guindastes) geram crédito?
              </h4>
              <p className="text-gray-700 text-sm">
                Sim. Bens de capital (equipamentos e máquinas) geram crédito proporcional ao uso na 
                construção, amortizado ao longo do tempo.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">
                7. Estados poderão alterar a alíquota de IBS?
              </h4>
              <p className="text-gray-700 text-sm">
                Não. A alíquota de IBS será <strong>uniforme nacionalmente</strong>, definida pelo 
                Comitê Gestor do IBS, com participação de estados e municípios, mas sem variações regionais.
              </p>
            </div>

          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            📖 Base Legal
          </h3>

          <ul className="space-y-2 text-gray-700 ml-6 mb-6">
            <li>• <strong>Emenda Constitucional 132/2023:</strong> Institui reforma tributária</li>
            <li>• <strong>Art. 156-A, CF:</strong> Cria o IBS (estadual e municipal)</li>
            <li>• <strong>Art. 195, V, CF:</strong> Cria a CBS (federal)</li>
            <li>• <strong>Lei Complementar (em tramitação):</strong> Regulamenta alíquotas e créditos</li>
          </ul>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 p-6 rounded-lg mt-8">
            <p className="text-gray-800 text-center leading-relaxed">
              <strong className="text-orange-700">⚠️ Atenção:</strong> A Reforma Tributária está em 
              fase de regulamentação. Alíquotas, créditos e regras podem sofrer ajustes até a entrada 
              em vigor em 2026. Consulte sempre um contador especializado antes de tomar decisões 
              estratégicas.
            </p>
          </div>

        </article>

      </div>
    </div>
  );
}

/**
 * Calculadora de Custo de Funcionário CLT
 * 100% Frontend - Sem dependências de backend
 * Inclui artigo SEO otimizado
 */
import { useState } from 'react';

function CalculadoraCustoFuncionario() {
  const [formData, setFormData] = useState({
    salarioBruto: '',
    valeTransporte: '',
    valeRefeicao: '',
    planoSaude: '',
    outrosBeneficios: '',
    periculosidade: false,
    insalubridade: '',
    horasExtrasMedia: '',
    regimeTributario: 'simples'
  });

  const [resultado, setResultado] = useState(null);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  // Taxas e alíquotas atualizadas 2025
  const TAXAS = {
    fgts: 0.08, // 8% FGTS
    fgtsMulRescisoria: 0.04, // 4% provisão multa rescisória (40% sobre 10%)
    inssPatronal: {
      simples: 0, // CPP já inclusa no DAS
      presumido: 0.20, // 20% INSS Patronal
      real: 0.20
    },
    rat: { // Risco Ambiental do Trabalho (média)
      simples: 0,
      presumido: 0.02,
      real: 0.02
    },
    terceiros: { // Sistema S, INCRA, etc
      simples: 0,
      presumido: 0.058,
      real: 0.058
    },
    decimoTerceiro: 1 / 12, // 1/12 avos
    ferias: 1 / 12, // 1/12 avos
    tercoFerias: 1 / 3 / 12, // 1/3 de férias
    provisaoRescisao: 0.05 // 5% provisão para rescisão
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calcular = () => {
    const salario = parseFloat(formData.salarioBruto) || 0;
    const vt = parseFloat(formData.valeTransporte) || 0;
    const vr = parseFloat(formData.valeRefeicao) || 0;
    const planoSaude = parseFloat(formData.planoSaude) || 0;
    const outros = parseFloat(formData.outrosBeneficios) || 0;
    const horasExtras = parseFloat(formData.horasExtrasMedia) || 0;
    const regime = formData.regimeTributario;

    // Adicionais
    let adicionalPericulosidade = 0;
    let adicionalInsalubridade = 0;
    const salarioMinimo = 1518; // 2025

    if (formData.periculosidade) {
      adicionalPericulosidade = salario * 0.30;
    }

    if (formData.insalubridade === 'minimo') {
      adicionalInsalubridade = salarioMinimo * 0.10;
    } else if (formData.insalubridade === 'medio') {
      adicionalInsalubridade = salarioMinimo * 0.20;
    } else if (formData.insalubridade === 'maximo') {
      adicionalInsalubridade = salarioMinimo * 0.40;
    }

    // Base de cálculo (salário + adicionais + média HE)
    const valorHoraExtra = (salario / 220) * 1.5 * horasExtras;
    const baseCalculo = salario + adicionalPericulosidade + adicionalInsalubridade + valorHoraExtra;

    // FGTS
    const fgts = baseCalculo * TAXAS.fgts;
    const fgtsMulRescisoria = baseCalculo * TAXAS.fgtsMulRescisoria;

    // INSS Patronal (varia por regime)
    const inssPatronal = baseCalculo * TAXAS.inssPatronal[regime];
    const rat = baseCalculo * TAXAS.rat[regime];
    const terceiros = baseCalculo * TAXAS.terceiros[regime];

    // Provisões (13º, Férias, 1/3 Férias)
    const decimoTerceiro = baseCalculo * TAXAS.decimoTerceiro;
    const ferias = baseCalculo * TAXAS.ferias;
    const tercoFerias = baseCalculo * TAXAS.tercoFerias;

    // Encargos sobre provisões (FGTS + INSS sobre 13º e férias)
    const encargosDecimoTerceiro = decimoTerceiro * (TAXAS.fgts + TAXAS.inssPatronal[regime] + TAXAS.rat[regime] + TAXAS.terceiros[regime]);
    const encargosFerias = (ferias + tercoFerias) * (TAXAS.fgts + TAXAS.inssPatronal[regime] + TAXAS.rat[regime] + TAXAS.terceiros[regime]);

    // Provisão para rescisão
    const provisaoRescisao = baseCalculo * TAXAS.provisaoRescisao;

    // Vale Transporte (empresa paga valor integral, desconta 6% do funcionário)
    const descontoVT = Math.min(salario * 0.06, vt);
    const custoVTEmpresa = vt - descontoVT;

    // Totais
    const totalBeneficios = custoVTEmpresa + vr + planoSaude + outros;
    const totalEncargos = fgts + fgtsMulRescisoria + inssPatronal + rat + terceiros;
    const totalProvisoes = decimoTerceiro + ferias + tercoFerias + encargosDecimoTerceiro + encargosFerias + provisaoRescisao;
    const custoTotal = baseCalculo + totalEncargos + totalProvisoes + totalBeneficios;
    const multiplicador = salario > 0 ? (custoTotal / salario) : 0;

    setResultado({
      salarioBruto: salario,
      baseCalculo,
      adicionalPericulosidade,
      adicionalInsalubridade,
      valorHoraExtra,
      encargos: {
        fgts,
        fgtsMulRescisoria,
        inssPatronal,
        rat,
        terceiros,
        total: totalEncargos
      },
      provisoes: {
        decimoTerceiro,
        ferias,
        tercoFerias,
        encargosDecimoTerceiro,
        encargosFerias,
        provisaoRescisao,
        total: totalProvisoes
      },
      beneficios: {
        valeTransporte: custoVTEmpresa,
        valeRefeicao: vr,
        planoSaude,
        outros,
        total: totalBeneficios
      },
      custoTotal,
      multiplicador,
      regime
    });
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  const limpar = () => {
    setFormData({
      salarioBruto: '',
      valeTransporte: '',
      valeRefeicao: '',
      planoSaude: '',
      outrosBeneficios: '',
      periculosidade: false,
      insalubridade: '',
      horasExtrasMedia: '',
      regimeTributario: 'simples'
    });
    setResultado(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl shadow-xl p-6 md:p-8 mb-8 text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          💼 Calculadora de Custo de Funcionário CLT
        </h1>
        <p className="text-emerald-100 text-sm md:text-lg">
          Descubra o custo real de um funcionário CLT com encargos, provisões e benefícios — Atualizada 2025
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            Dados do Funcionário
          </h2>

          <div className="space-y-5">
            {/* Salário Bruto */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Salário Bruto Mensal *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">R$</span>
                <input
                  type="number"
                  name="salarioBruto"
                  value={formData.salarioBruto}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  placeholder="3.000,00"
                  step="0.01"
                />
              </div>
            </div>

            {/* Regime Tributário */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Regime Tributário da Empresa *
              </label>
              <select
                name="regimeTributario"
                value={formData.regimeTributario}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              >
                <option value="simples">Simples Nacional (sem INSS Patronal)</option>
                <option value="presumido">Lucro Presumido</option>
                <option value="real">Lucro Real</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                O regime afeta os encargos patronais (INSS, RAT, Terceiros)
              </p>
            </div>

            {/* Benefícios */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span>🎁</span> Benefícios
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Vale Transporte
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">R$</span>
                    <input
                      type="number"
                      name="valeTransporte"
                      value={formData.valeTransporte}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="0,00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Vale Refeição/Alimentação
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">R$</span>
                    <input
                      type="number"
                      name="valeRefeicao"
                      value={formData.valeRefeicao}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="0,00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Plano de Saúde
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">R$</span>
                    <input
                      type="number"
                      name="planoSaude"
                      value={formData.planoSaude}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="0,00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Outros Benefícios
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">R$</span>
                    <input
                      type="number"
                      name="outrosBeneficios"
                      value={formData.outrosBeneficios}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Adicionais */}
            <div className="bg-orange-50 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span>⚠️</span> Adicionais (opcional)
              </h3>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="periculosidade"
                  checked={formData.periculosidade}
                  onChange={handleChange}
                  className="w-5 h-5 text-emerald-600 rounded"
                />
                <label className="text-sm text-gray-700">
                  Adicional de Periculosidade (30% do salário)
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Adicional de Insalubridade
                </label>
                <select
                  name="insalubridade"
                  value={formData.insalubridade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Não se aplica</option>
                  <option value="minimo">Grau Mínimo (10% salário mínimo)</option>
                  <option value="medio">Grau Médio (20% salário mínimo)</option>
                  <option value="maximo">Grau Máximo (40% salário mínimo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Média de Horas Extras/mês
                </label>
                <input
                  type="number"
                  name="horasExtrasMedia"
                  value={formData.horasExtrasMedia}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={calcular}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span className="text-2xl">🧮</span>
                Calcular Custo Total
              </button>
              <button
                onClick={limpar}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {resultado ? (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Custo Total do Funcionário
              </h2>

              {/* Custo Total Destaque */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 mb-6 text-white shadow-xl">
                <div className="text-sm font-semibold mb-1 text-emerald-100">
                  Custo Mensal Total para a Empresa
                </div>
                <div className="text-4xl md:text-5xl font-black mb-3">
                  {formatarMoeda(resultado.custoTotal)}
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="text-xs text-emerald-100">Multiplicador</div>
                    <div className="text-2xl font-bold">{resultado.multiplicador.toFixed(2)}x</div>
                  </div>
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="text-xs text-emerald-100">Custo Anual</div>
                    <div className="text-lg font-bold">{formatarMoeda(resultado.custoTotal * 12)}</div>
                  </div>
                </div>
              </div>

              {/* Resumo Visual */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">💰 Salário Base + Adicionais</span>
                  <span className="font-bold text-blue-700">{formatarMoeda(resultado.baseCalculo)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700">🏛️ Encargos Trabalhistas</span>
                  <span className="font-bold text-orange-700">{formatarMoeda(resultado.encargos.total)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">📅 Provisões (13º, Férias...)</span>
                  <span className="font-bold text-purple-700">{formatarMoeda(resultado.provisoes.total)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">🎁 Benefícios</span>
                  <span className="font-bold text-green-700">{formatarMoeda(resultado.beneficios.total)}</span>
                </div>
              </div>

              {/* Botão Ver Detalhes */}
              <button
                onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
                className="w-full py-3 border-2 border-emerald-500 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition flex items-center justify-center gap-2"
              >
                {mostrarDetalhes ? '🔼 Ocultar Detalhes' : '🔽 Ver Detalhes Completos'}
              </button>

              {/* Detalhes Expandidos */}
              {mostrarDetalhes && (
                <div className="mt-6 space-y-4">
                  {/* Encargos Detalhados */}
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                    <h4 className="font-bold text-orange-800 mb-3">🏛️ Encargos Trabalhistas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>FGTS (8%)</span>
                        <span className="font-medium">{formatarMoeda(resultado.encargos.fgts)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Provisão Multa FGTS (4%)</span>
                        <span className="font-medium">{formatarMoeda(resultado.encargos.fgtsMulRescisoria)}</span>
                      </div>
                      {resultado.regime !== 'simples' && (
                        <>
                          <div className="flex justify-between">
                            <span>INSS Patronal (20%)</span>
                            <span className="font-medium">{formatarMoeda(resultado.encargos.inssPatronal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>RAT (2%)</span>
                            <span className="font-medium">{formatarMoeda(resultado.encargos.rat)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Terceiros (5,8%)</span>
                            <span className="font-medium">{formatarMoeda(resultado.encargos.terceiros)}</span>
                          </div>
                        </>
                      )}
                      {resultado.regime === 'simples' && (
                        <div className="text-xs text-orange-600 italic">
                          * INSS Patronal, RAT e Terceiros já estão inclusos no DAS do Simples Nacional
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Provisões Detalhadas */}
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <h4 className="font-bold text-purple-800 mb-3">📅 Provisões Mensais</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>13º Salário (1/12)</span>
                        <span className="font-medium">{formatarMoeda(resultado.provisoes.decimoTerceiro)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Férias (1/12)</span>
                        <span className="font-medium">{formatarMoeda(resultado.provisoes.ferias)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>1/3 Férias</span>
                        <span className="font-medium">{formatarMoeda(resultado.provisoes.tercoFerias)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Encargos s/ 13º</span>
                        <span className="font-medium">{formatarMoeda(resultado.provisoes.encargosDecimoTerceiro)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Encargos s/ Férias</span>
                        <span className="font-medium">{formatarMoeda(resultado.provisoes.encargosFerias)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Provisão Rescisão (5%)</span>
                        <span className="font-medium">{formatarMoeda(resultado.provisoes.provisaoRescisao)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Benefícios Detalhados */}
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <h4 className="font-bold text-green-800 mb-3">🎁 Benefícios</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Vale Transporte (custo empresa)</span>
                        <span className="font-medium">{formatarMoeda(resultado.beneficios.valeTransporte)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vale Refeição/Alimentação</span>
                        <span className="font-medium">{formatarMoeda(resultado.beneficios.valeRefeicao)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Plano de Saúde</span>
                        <span className="font-medium">{formatarMoeda(resultado.beneficios.planoSaude)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Outros</span>
                        <span className="font-medium">{formatarMoeda(resultado.beneficios.outros)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dica */}
              <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex gap-3">
                  <span className="text-2xl">💡</span>
                  <div className="text-sm text-blue-800">
                    <strong>Interpretação:</strong> Um funcionário com salário de {formatarMoeda(resultado.salarioBruto)} custa 
                    na prática <strong>{formatarMoeda(resultado.custoTotal)}</strong> por mês para a empresa 
                    ({resultado.multiplicador.toFixed(2)}x o salário bruto).
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👔</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Aguardando Dados
              </h3>
              <p className="text-gray-600">
                Preencha o salário e benefícios para calcular o custo total do funcionário
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========== ARTIGO SEO ========== */}
      <article className="bg-white rounded-2xl shadow-xl p-6 md:p-10 prose prose-lg max-w-none">
        
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          📚 Custo de Funcionário CLT: Guia Completo 2025
        </h2>

        {/* Introdução */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            Contratar um funcionário com carteira assinada no Brasil envolve muito mais do que o salário combinado. 
            O <strong>custo real de um funcionário CLT</strong> pode chegar a <strong>1,7x a 2,0x o valor do salário bruto</strong>, 
            dependendo do regime tributário da empresa e dos benefícios oferecidos.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Entender esses custos é essencial para o planejamento financeiro, precificação de serviços e tomada de 
            decisões estratégicas sobre contratação. Neste guia completo, você vai aprender tudo sobre os encargos 
            trabalhistas, provisões obrigatórias e como calcular o custo total de um colaborador em 2025.
          </p>
        </section>

        {/* Como Calcular */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📐 Como Calcular o Custo de um Funcionário CLT em 2025
          </h3>
          
          <p className="text-gray-700 mb-4">
            O cálculo do custo total de um funcionário envolve somar ao salário bruto todos os encargos, 
            provisões e benefícios. Veja a fórmula simplificada:
          </p>

          <div className="bg-gray-100 rounded-xl p-6 my-6 font-mono text-sm">
            <strong>Custo Total = Salário Bruto + Encargos + Provisões + Benefícios</strong>
          </div>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Componentes do Cálculo:</h4>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 my-4">
              <thead className="bg-emerald-600 text-white">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left">Componente</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Percentual</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Observação</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2">FGTS</td>
                  <td className="border border-gray-300 px-4 py-2">8%</td>
                  <td className="border border-gray-300 px-4 py-2">Obrigatório para todos os regimes</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Provisão Multa FGTS</td>
                  <td className="border border-gray-300 px-4 py-2">4%</td>
                  <td className="border border-gray-300 px-4 py-2">40% sobre provisão de 10%</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2">INSS Patronal</td>
                  <td className="border border-gray-300 px-4 py-2">20%</td>
                  <td className="border border-gray-300 px-4 py-2">Isento no Simples Nacional</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">RAT (Risco Ambiental)</td>
                  <td className="border border-gray-300 px-4 py-2">1% a 3%</td>
                  <td className="border border-gray-300 px-4 py-2">Varia conforme atividade</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2">Terceiros (Sistema S)</td>
                  <td className="border border-gray-300 px-4 py-2">5,8%</td>
                  <td className="border border-gray-300 px-4 py-2">Isento no Simples Nacional</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">13º Salário</td>
                  <td className="border border-gray-300 px-4 py-2">8,33%</td>
                  <td className="border border-gray-300 px-4 py-2">1/12 por mês</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2">Férias + 1/3</td>
                  <td className="border border-gray-300 px-4 py-2">11,11%</td>
                  <td className="border border-gray-300 px-4 py-2">1/12 + 1/3 constitucional</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Exemplos Práticos */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📊 Exemplos Práticos de Custo de Funcionário
          </h3>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-3">Exemplo 1: Simples Nacional</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Salário: R$ 3.000,00</li>
                <li>• VT + VR: R$ 600,00</li>
                <li>• <strong>Custo Total: ~R$ 4.400,00</strong></li>
                <li>• <strong>Multiplicador: 1,47x</strong></li>
              </ul>
            </div>
            <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
              <h4 className="font-bold text-orange-800 mb-3">Exemplo 2: Lucro Presumido</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Salário: R$ 3.000,00</li>
                <li>• VT + VR: R$ 600,00</li>
                <li>• <strong>Custo Total: ~R$ 5.500,00</strong></li>
                <li>• <strong>Multiplicador: 1,83x</strong></li>
              </ul>
            </div>
          </div>

          <p className="text-gray-700">
            Note como o regime tributário impacta significativamente o custo. Empresas do Simples Nacional têm 
            vantagem por não pagarem INSS Patronal separadamente (já está incluso no DAS).
          </p>
        </section>

        {/* Erros Comuns */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ⚠️ Erros Comuns ao Calcular Custo de Funcionário
          </h3>

          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">❌ Erro 1: Ignorar as provisões</h4>
              <p className="text-sm text-red-700">
                Muitos empresários esquecem de provisionar 13º salário, férias e 1/3 constitucional mensalmente, 
                levando a surpresas no final do ano.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">❌ Erro 2: Não considerar encargos sobre provisões</h4>
              <p className="text-sm text-red-700">
                O FGTS e INSS também incidem sobre 13º e férias, aumentando ainda mais o custo real.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">❌ Erro 3: Esquecer a provisão para rescisão</h4>
              <p className="text-sm text-red-700">
                Demissões acontecem. Provisionar mensalmente evita impactos financeiros inesperados.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">❌ Erro 4: Usar multiplicador genérico</h4>
              <p className="text-sm text-red-700">
                O famoso "2x o salário" nem sempre é preciso. O multiplicador varia de 1,4x a 2,0x conforme o regime e benefícios.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ❓ Perguntas Frequentes (FAQ)
          </h3>

          <div className="space-y-4">
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Quanto custa um funcionário que ganha R$ 2.000?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Depende do regime tributário. No Simples Nacional, o custo fica em torno de R$ 2.900 a R$ 3.200. 
                No Lucro Presumido/Real, pode chegar a R$ 3.600 a R$ 4.000 com benefícios básicos.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                O que é o multiplicador de custo CLT?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                É a razão entre o custo total e o salário bruto. Um multiplicador de 1,7x significa que um 
                funcionário custa 70% a mais do que seu salário nominal.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Por que o Simples Nacional tem custo menor?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                No Simples Nacional, a Contribuição Patronal Previdenciária (CPP) já está inclusa na guia DAS. 
                Assim, a empresa não paga separadamente INSS Patronal, RAT e contribuições a terceiros.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Como reduzir o custo de funcionário CLT?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Algumas estratégias incluem: optar pelo Simples Nacional quando vantajoso, usar benefícios com 
                incentivos fiscais (PAT), terceirizar atividades-meio, e investir em produtividade para 
                otimizar o quadro de funcionários.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Vale Transporte é descontado do funcionário?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Sim, a empresa pode descontar até 6% do salário bruto do funcionário para custear o VT. 
                Se o VT custar menos que 6%, desconta-se o valor real. O excedente é custo da empresa.
              </p>
            </details>
          </div>
        </section>

        {/* Termos Importantes */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📖 Termos Importantes e Conceitos
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-bold text-emerald-800">FGTS</h4>
              <p className="text-sm text-gray-700">
                Fundo de Garantia do Tempo de Serviço. Depósito mensal de 8% do salário em conta vinculada do trabalhador.
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-bold text-emerald-800">INSS Patronal</h4>
              <p className="text-sm text-gray-700">
                Contribuição previdenciária paga pela empresa, equivalente a 20% da folha de pagamento.
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-bold text-emerald-800">RAT</h4>
              <p className="text-sm text-gray-700">
                Risco Ambiental do Trabalho. Alíquota de 1% a 3% conforme o grau de risco da atividade.
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-bold text-emerald-800">Terceiros (Sistema S)</h4>
              <p className="text-sm text-gray-700">
                Contribuições para SESI, SENAI, SESC, SENAC, SEBRAE, INCRA, etc. Totalizam cerca de 5,8%.
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-bold text-emerald-800">13º Salário</h4>
              <p className="text-sm text-gray-700">
                Gratificação natalina equivalente a 1/12 do salário por mês trabalhado no ano.
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-bold text-emerald-800">Terço Constitucional</h4>
              <p className="text-sm text-gray-700">
                Adicional de 1/3 sobre o valor das férias, garantido pela Constituição Federal.
              </p>
            </div>
          </div>
        </section>

        {/* Legislação */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ⚖️ O Que Diz a Legislação Atual
          </h3>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>CLT (Decreto-Lei 5.452/1943):</strong> Define direitos trabalhistas como férias, 13º, jornada de trabalho e rescisão.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Lei 8.036/1990:</strong> Regulamenta o FGTS, estabelecendo depósito mensal de 8%.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Lei 8.212/1991:</strong> Define as contribuições previdenciárias patronais (20% + RAT + Terceiros).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>LC 123/2006 (Simples Nacional):</strong> Empresas optantes têm CPP incluída no DAS, reduzindo encargos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Reforma Trabalhista (Lei 13.467/2017):</strong> Modernizou relações de trabalho, mas manteve encargos básicos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Salário Mínimo 2025:</strong> R$ 1.518,00 (base para cálculos de insalubridade e piso).</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Conclusão */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ✅ Conclusão
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Calcular corretamente o <strong>custo de um funcionário CLT</strong> é fundamental para a saúde 
            financeira de qualquer empresa. O valor vai muito além do salário bruto, incluindo encargos 
            trabalhistas, provisões obrigatórias e benefícios.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Use nossa calculadora gratuita para ter uma visão precisa do custo real de cada contratação. 
            Lembre-se de considerar o regime tributário da sua empresa, pois ele impacta significativamente 
            o multiplicador final.
          </p>

          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-6 border border-emerald-300">
            <p className="text-emerald-800 font-semibold text-center">
              💡 Dica: Planeje suas contratações considerando o custo total, não apenas o salário. 
              Isso evita surpresas e permite precificar seus produtos e serviços corretamente.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">
            Gostou da ferramenta?
          </h3>
          <p className="mb-4 text-emerald-100">
            Explore nossas outras calculadoras tributárias e financeiras gratuitas!
          </p>
          <a 
            href="/" 
            className="inline-block bg-white text-emerald-700 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition"
          >
            Ver Todas as Ferramentas →
          </a>
        </section>
      </article>
    </div>
  );
}

export default CalculadoraCustoFuncionario;

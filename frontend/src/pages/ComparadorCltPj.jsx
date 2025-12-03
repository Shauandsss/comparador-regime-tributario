/**
 * Comparador CLT x PJ
 * 100% Frontend - Sem dependências de backend
 */
import { useState } from 'react';

function ComparadorCltPj() {
  const [formData, setFormData] = useState({
    // Dados CLT
    salarioBrutoClt: '',
    valeRefeicaoClt: '',
    valeAlimentacaoClt: '',
    planoSaudeClt: '',
    valeTransporteClt: '',
    plrClt: '',
    outrosBeneficiosClt: '',
    
    // Dados PJ
    faturamentoPj: '',
    regimePj: 'simples',
    anexoPj: 'III',
    contadorPj: '200',
    planoSaudePj: '',
    outrosCustosPj: ''
  });

  const [resultado, setResultado] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('clt');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  // ==================== CÁLCULOS ====================
  
  // Tabela INSS 2025
  const calcularINSS = (salario) => {
    const faixas = [
      { limite: 1518.00, aliquota: 0.075 },
      { limite: 2793.88, aliquota: 0.09 },
      { limite: 4190.83, aliquota: 0.12 },
      { limite: 8157.41, aliquota: 0.14 }
    ];
    
    let inss = 0;
    let salarioRestante = salario;
    let faixaAnterior = 0;
    
    for (const faixa of faixas) {
      if (salarioRestante <= 0) break;
      
      const baseCalculo = Math.min(salarioRestante, faixa.limite - faixaAnterior);
      inss += baseCalculo * faixa.aliquota;
      salarioRestante -= baseCalculo;
      faixaAnterior = faixa.limite;
    }
    
    return Math.min(inss, 951.01); // Teto INSS 2025
  };

  // Tabela IRRF 2025
  const calcularIRRF = (baseCalculo) => {
    const faixas = [
      { limite: 2259.20, aliquota: 0, deducao: 0 },
      { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
      { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
      { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
      { limite: Infinity, aliquota: 0.275, deducao: 896.00 }
    ];
    
    for (const faixa of faixas) {
      if (baseCalculo <= faixa.limite) {
        return Math.max(0, baseCalculo * faixa.aliquota - faixa.deducao);
      }
    }
    return 0;
  };

  // Alíquotas Simples Nacional (aproximadas por faixa)
  const getAliquotaSimples = (anexo, faturamentoAnual) => {
    const tabelas = {
      'III': [ // Serviços
        { limite: 180000, aliquota: 0.06 },
        { limite: 360000, aliquota: 0.112 },
        { limite: 720000, aliquota: 0.135 },
        { limite: 1800000, aliquota: 0.16 },
        { limite: 3600000, aliquota: 0.21 },
        { limite: 4800000, aliquota: 0.33 }
      ],
      'V': [ // Serviços profissionais
        { limite: 180000, aliquota: 0.155 },
        { limite: 360000, aliquota: 0.18 },
        { limite: 720000, aliquota: 0.195 },
        { limite: 1800000, aliquota: 0.205 },
        { limite: 3600000, aliquota: 0.23 },
        { limite: 4800000, aliquota: 0.305 }
      ]
    };
    
    const tabela = tabelas[anexo] || tabelas['III'];
    for (const faixa of tabela) {
      if (faturamentoAnual <= faixa.limite) {
        return faixa.aliquota;
      }
    }
    return 0.33;
  };

  const calcular = () => {
    // ========== CÁLCULO CLT ==========
    const salarioBruto = parseFloat(formData.salarioBrutoClt) || 0;
    const vrClt = parseFloat(formData.valeRefeicaoClt) || 0;
    const vaClt = parseFloat(formData.valeAlimentacaoClt) || 0;
    const psaudeClt = parseFloat(formData.planoSaudeClt) || 0;
    const vtClt = parseFloat(formData.valeTransporteClt) || 0;
    const plr = parseFloat(formData.plrClt) || 0;
    const outrosClt = parseFloat(formData.outrosBeneficiosClt) || 0;

    // Descontos CLT
    const inssClt = calcularINSS(salarioBruto);
    const baseIRClt = salarioBruto - inssClt;
    const irrfClt = calcularIRRF(baseIRClt);
    const descontoVT = Math.min(salarioBruto * 0.06, vtClt);
    
    // Salário líquido mensal
    const salarioLiquidoClt = salarioBruto - inssClt - irrfClt - descontoVT;
    
    // Benefícios mensais (valor recebido)
    const beneficiosMensaisClt = vrClt + vaClt + psaudeClt + outrosClt;
    
    // 13º salário líquido (aproximado)
    const inss13 = calcularINSS(salarioBruto);
    const irrf13 = calcularIRRF(salarioBruto - inss13);
    const decimoTerceiroLiquido = salarioBruto - inss13 - irrf13;
    
    // Férias + 1/3 líquido (aproximado)
    const feriasbruto = salarioBruto * (4/3);
    const inssFeriasasd = calcularINSS(salarioBruto);
    const irrfFer = calcularIRRF(feriasbruto - inssFeriasasd);
    const feriasLiquido = feriasbruto - inssFeriasasd - irrfFer;
    
    // FGTS anual (benefício do trabalhador)
    const fgtsAnual = salarioBruto * 0.08 * 12 + salarioBruto * 0.08; // 12 meses + 13º
    
    // Total anual CLT
    const rendaMensalClt = salarioLiquidoClt + beneficiosMensaisClt;
    const totalAnualClt = (salarioLiquidoClt * 12) + (beneficiosMensaisClt * 12) + decimoTerceiroLiquido + feriasLiquido + (plr * 0.85) + fgtsAnual;

    // ========== CÁLCULO PJ ==========
    const faturamentoMensal = parseFloat(formData.faturamentoPj) || 0;
    const faturamentoAnual = faturamentoMensal * 12;
    const contador = parseFloat(formData.contadorPj) || 200;
    const psaudePj = parseFloat(formData.planoSaudePj) || 0;
    const outrosPj = parseFloat(formData.outrosCustosPj) || 0;
    
    let impostosPj = 0;
    let inssProLabore = 0;
    let irPj = 0;
    
    if (formData.regimePj === 'simples') {
      const aliquota = getAliquotaSimples(formData.anexoPj, faturamentoAnual);
      impostosPj = faturamentoMensal * aliquota;
      
      // Pro-labore mínimo (1 salário mínimo) - INSS 11%
      const proLabore = 1518;
      inssProLabore = proLabore * 0.11;
    } else {
      // Lucro Presumido
      const presumido = faturamentoMensal * 0.32; // Serviços
      const irpj = presumido * 0.15;
      const csll = presumido * 0.09;
      const pis = faturamentoMensal * 0.0065;
      const cofins = faturamentoMensal * 0.03;
      const iss = faturamentoMensal * 0.05;
      impostosPj = irpj + csll + pis + cofins + iss;
      
      // Pro-labore obrigatório
      const proLabore = Math.max(faturamentoMensal * 0.28, 1518);
      inssProLabore = Math.min(proLabore * 0.11, 951.01);
      const irProLabore = calcularIRRF(proLabore - inssProLabore);
      irPj = irProLabore;
    }
    
    const custosTotaisPj = impostosPj + contador + inssProLabore + irPj + psaudePj + outrosPj;
    const liquidoMensalPj = faturamentoMensal - custosTotaisPj;
    const totalAnualPj = liquidoMensalPj * 12;

    // ========== RESULTADO ==========
    setResultado({
      clt: {
        salarioBruto,
        inss: inssClt,
        irrf: irrfClt,
        descontoVT,
        salarioLiquido: salarioLiquidoClt,
        beneficiosMensais: beneficiosMensaisClt,
        rendaMensal: rendaMensalClt,
        decimoTerceiro: decimoTerceiroLiquido,
        ferias: feriasLiquido,
        fgtsAnual,
        plrLiquido: plr * 0.85,
        totalAnual: totalAnualClt
      },
      pj: {
        faturamento: faturamentoMensal,
        impostos: impostosPj,
        contador,
        inss: inssProLabore,
        ir: irPj,
        planoSaude: psaudePj,
        outrosCustos: outrosPj,
        custosTotais: custosTotaisPj,
        liquidoMensal: liquidoMensalPj,
        totalAnual: totalAnualPj
      },
      comparativo: {
        diferencaAnual: totalAnualPj - totalAnualClt,
        diferencaMensal: liquidoMensalPj - rendaMensalClt,
        melhorOpcao: totalAnualPj > totalAnualClt ? 'PJ' : 'CLT',
        percentualDiferenca: ((totalAnualPj - totalAnualClt) / totalAnualClt * 100).toFixed(1)
      }
    });
  };

  const limpar = () => {
    setFormData({
      salarioBrutoClt: '',
      valeRefeicaoClt: '',
      valeAlimentacaoClt: '',
      planoSaudeClt: '',
      valeTransporteClt: '',
      plrClt: '',
      outrosBeneficiosClt: '',
      faturamentoPj: '',
      regimePj: 'simples',
      anexoPj: 'III',
      contadorPj: '200',
      planoSaudePj: '',
      outrosCustosPj: ''
    });
    setResultado(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl shadow-xl p-6 md:p-8 mb-8 text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          ⚖️ Comparador CLT x PJ
        </h1>
        <p className="text-violet-100 text-sm md:text-lg">
          Descubra qual modalidade paga mais: CLT com benefícios ou PJ — Simulação completa 2025
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
        {/* Formulário CLT */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="text-2xl">👔</span>
            Proposta CLT
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Salário Bruto *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 text-sm">R$</span>
                <input
                  type="number"
                  name="salarioBrutoClt"
                  value={formData.salarioBrutoClt}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="5.000,00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">VR (mês)</label>
                <div className="relative">
                  <span className="absolute left-2 top-2.5 text-gray-400 text-xs">R$</span>
                  <input
                    type="number"
                    name="valeRefeicaoClt"
                    value={formData.valeRefeicaoClt}
                    onChange={handleChange}
                    className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">VA (mês)</label>
                <div className="relative">
                  <span className="absolute left-2 top-2.5 text-gray-400 text-xs">R$</span>
                  <input
                    type="number"
                    name="valeAlimentacaoClt"
                    value={formData.valeAlimentacaoClt}
                    onChange={handleChange}
                    className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Plano Saúde</label>
                <div className="relative">
                  <span className="absolute left-2 top-2.5 text-gray-400 text-xs">R$</span>
                  <input
                    type="number"
                    name="planoSaudeClt"
                    value={formData.planoSaudeClt}
                    onChange={handleChange}
                    className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">VT (mês)</label>
                <div className="relative">
                  <span className="absolute left-2 top-2.5 text-gray-400 text-xs">R$</span>
                  <input
                    type="number"
                    name="valeTransporteClt"
                    value={formData.valeTransporteClt}
                    onChange={handleChange}
                    className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="300"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">PLR (anual)</label>
                <div className="relative">
                  <span className="absolute left-2 top-2.5 text-gray-400 text-xs">R$</span>
                  <input
                    type="number"
                    name="plrClt"
                    value={formData.plrClt}
                    onChange={handleChange}
                    className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="5.000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Outros</label>
                <div className="relative">
                  <span className="absolute left-2 top-2.5 text-gray-400 text-xs">R$</span>
                  <input
                    type="number"
                    name="outrosBeneficiosClt"
                    value={formData.outrosBeneficiosClt}
                    onChange={handleChange}
                    className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário PJ */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="text-2xl">🏢</span>
            Proposta PJ
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Faturamento Mensal *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 text-sm">R$</span>
                <input
                  type="number"
                  name="faturamentoPj"
                  value={formData.faturamentoPj}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="8.000,00"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Regime Tributário</label>
              <select
                name="regimePj"
                value={formData.regimePj}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="simples">Simples Nacional</option>
                <option value="presumido">Lucro Presumido</option>
              </select>
            </div>

            {formData.regimePj === 'simples' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Anexo do Simples</label>
                <select
                  name="anexoPj"
                  value={formData.anexoPj}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="III">Anexo III (Serviços - alíquota menor)</option>
                  <option value="V">Anexo V (Serviços profissionais)</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Contador</label>
                <div className="relative">
                  <span className="absolute left-2 top-2.5 text-gray-400 text-xs">R$</span>
                  <input
                    type="number"
                    name="contadorPj"
                    value={formData.contadorPj}
                    onChange={handleChange}
                    className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Plano Saúde</label>
                <div className="relative">
                  <span className="absolute left-2 top-2.5 text-gray-400 text-xs">R$</span>
                  <input
                    type="number"
                    name="planoSaudePj"
                    value={formData.planoSaudePj}
                    onChange={handleChange}
                    className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Outros Custos (mês)</label>
              <div className="relative">
                <span className="absolute left-2 top-2.5 text-gray-400 text-xs">R$</span>
                <input
                  type="number"
                  name="outrosCustosPj"
                  value={formData.outrosCustosPj}
                  onChange={handleChange}
                  className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Coworking, software, etc.</p>
            </div>
          </div>
        </div>

        {/* Resultado Resumido */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Resultado
          </h2>

          {resultado ? (
            <div className="space-y-4">
              {/* Veredito */}
              <div className={`rounded-xl p-5 text-center ${
                resultado.comparativo.melhorOpcao === 'PJ' 
                  ? 'bg-gradient-to-br from-purple-500 to-violet-600' 
                  : 'bg-gradient-to-br from-blue-500 to-cyan-600'
              } text-white`}>
                <div className="text-sm mb-1 opacity-90">Melhor opção</div>
                <div className="text-4xl font-black mb-2">
                  {resultado.comparativo.melhorOpcao === 'PJ' ? '🏢 PJ' : '👔 CLT'}
                </div>
                <div className="text-sm opacity-90">
                  {resultado.comparativo.diferencaAnual > 0 ? '+' : ''}
                  {formatarMoeda(Math.abs(resultado.comparativo.diferencaAnual))}/ano
                </div>
              </div>

              {/* Comparativo */}
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="text-xs text-blue-600 font-medium">CLT - Total Anual</div>
                  <div className="text-xl font-bold text-blue-800">
                    {formatarMoeda(resultado.clt.totalAnual)}
                  </div>
                  <div className="text-xs text-gray-600">
                    ≈ {formatarMoeda(resultado.clt.totalAnual / 12)}/mês
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <div className="text-xs text-purple-600 font-medium">PJ - Total Anual</div>
                  <div className="text-xl font-bold text-purple-800">
                    {formatarMoeda(resultado.pj.totalAnual)}
                  </div>
                  <div className="text-xs text-gray-600">
                    ≈ {formatarMoeda(resultado.pj.liquidoMensal)}/mês
                  </div>
                </div>
              </div>

              {/* Diferença */}
              <div className={`rounded-lg p-3 text-center ${
                resultado.comparativo.diferencaAnual > 0 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
              }`}>
                <div className="text-xs text-gray-600">Diferença</div>
                <div className={`text-lg font-bold ${
                  resultado.comparativo.diferencaAnual > 0 ? 'text-green-700' : 'text-orange-700'
                }`}>
                  {resultado.comparativo.diferencaAnual > 0 ? 'PJ paga ' : 'CLT paga '}
                  {formatarMoeda(Math.abs(resultado.comparativo.diferencaAnual))} a mais/ano
                </div>
                <div className="text-xs text-gray-500">
                  ({Math.abs(parseFloat(resultado.comparativo.percentualDiferenca))}% de diferença)
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">⚖️</div>
              <p className="text-gray-600 text-sm">
                Preencha os dados e clique em "Comparar"
              </p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={calcular}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg"
            >
              ⚖️ Comparar
            </button>
            <button
              onClick={limpar}
              className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Detalhamento Expandido */}
      {resultado && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Detalhes CLT */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
              👔 Detalhamento CLT
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Salário Bruto</span>
                <span className="font-medium">{formatarMoeda(resultado.clt.salarioBruto)}</span>
              </div>
              <div className="flex justify-between py-2 border-b text-red-600">
                <span>(-) INSS</span>
                <span className="font-medium">-{formatarMoeda(resultado.clt.inss)}</span>
              </div>
              <div className="flex justify-between py-2 border-b text-red-600">
                <span>(-) IRRF</span>
                <span className="font-medium">-{formatarMoeda(resultado.clt.irrf)}</span>
              </div>
              <div className="flex justify-between py-2 border-b text-red-600">
                <span>(-) Desconto VT (6%)</span>
                <span className="font-medium">-{formatarMoeda(resultado.clt.descontoVT)}</span>
              </div>
              <div className="flex justify-between py-2 border-b font-semibold bg-blue-50 px-2 rounded">
                <span>= Salário Líquido</span>
                <span>{formatarMoeda(resultado.clt.salarioLiquido)}</span>
              </div>
              <div className="flex justify-between py-2 border-b text-green-600">
                <span>(+) Benefícios/mês</span>
                <span className="font-medium">+{formatarMoeda(resultado.clt.beneficiosMensais)}</span>
              </div>
              <div className="flex justify-between py-2 border-b font-semibold">
                <span>= Renda Mensal</span>
                <span>{formatarMoeda(resultado.clt.rendaMensal)}</span>
              </div>
              <div className="mt-4 pt-2 border-t-2">
                <div className="flex justify-between py-1 text-gray-600">
                  <span>13º Líquido</span>
                  <span>{formatarMoeda(resultado.clt.decimoTerceiro)}</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span>Férias + 1/3 Líquido</span>
                  <span>{formatarMoeda(resultado.clt.ferias)}</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span>FGTS Anual</span>
                  <span>{formatarMoeda(resultado.clt.fgtsAnual)}</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span>PLR Líquida</span>
                  <span>{formatarMoeda(resultado.clt.plrLiquido)}</span>
                </div>
              </div>
              <div className="flex justify-between py-3 mt-2 bg-blue-100 px-3 rounded-lg font-bold text-blue-800">
                <span>TOTAL ANUAL</span>
                <span>{formatarMoeda(resultado.clt.totalAnual)}</span>
              </div>
            </div>
          </div>

          {/* Detalhes PJ */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
              🏢 Detalhamento PJ
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Faturamento Mensal</span>
                <span className="font-medium">{formatarMoeda(resultado.pj.faturamento)}</span>
              </div>
              <div className="flex justify-between py-2 border-b text-red-600">
                <span>(-) Impostos ({formData.regimePj === 'simples' ? 'Simples' : 'Presumido'})</span>
                <span className="font-medium">-{formatarMoeda(resultado.pj.impostos)}</span>
              </div>
              <div className="flex justify-between py-2 border-b text-red-600">
                <span>(-) Contador</span>
                <span className="font-medium">-{formatarMoeda(resultado.pj.contador)}</span>
              </div>
              <div className="flex justify-between py-2 border-b text-red-600">
                <span>(-) INSS Pró-labore</span>
                <span className="font-medium">-{formatarMoeda(resultado.pj.inss)}</span>
              </div>
              {resultado.pj.ir > 0 && (
                <div className="flex justify-between py-2 border-b text-red-600">
                  <span>(-) IRRF Pró-labore</span>
                  <span className="font-medium">-{formatarMoeda(resultado.pj.ir)}</span>
                </div>
              )}
              {resultado.pj.planoSaude > 0 && (
                <div className="flex justify-between py-2 border-b text-red-600">
                  <span>(-) Plano de Saúde</span>
                  <span className="font-medium">-{formatarMoeda(resultado.pj.planoSaude)}</span>
                </div>
              )}
              {resultado.pj.outrosCustos > 0 && (
                <div className="flex justify-between py-2 border-b text-red-600">
                  <span>(-) Outros Custos</span>
                  <span className="font-medium">-{formatarMoeda(resultado.pj.outrosCustos)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b font-semibold bg-purple-50 px-2 rounded">
                <span>= Líquido Mensal</span>
                <span>{formatarMoeda(resultado.pj.liquidoMensal)}</span>
              </div>
              <div className="flex justify-between py-3 mt-4 bg-purple-100 px-3 rounded-lg font-bold text-purple-800">
                <span>TOTAL ANUAL (12 meses)</span>
                <span>{formatarMoeda(resultado.pj.totalAnual)}</span>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  <strong>⚠️ Atenção:</strong> PJ não tem 13º, férias, FGTS ou estabilidade. 
                  Considere guardar 20-30% para emergências e benefícios próprios.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== ARTIGO SEO ========== */}
      <article className="bg-white rounded-2xl shadow-xl p-6 md:p-10 prose prose-lg max-w-none">
        
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          📚 CLT ou PJ: Qual Vale Mais a Pena em 2025?
        </h2>

        {/* Introdução */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            A dúvida entre trabalhar como <strong>CLT (Consolidação das Leis do Trabalho)</strong> ou 
            <strong> PJ (Pessoa Jurídica)</strong> é uma das mais frequentes no mercado de trabalho brasileiro. 
            Com a flexibilização das relações trabalhistas e o crescimento do trabalho remoto, cada vez mais 
            profissionais recebem propostas nos dois formatos.
          </p>
          <p className="text-gray-700 leading-relaxed">
            A resposta para "CLT ou PJ?" depende de diversos fatores: valor oferecido, benefícios, regime 
            tributário da empresa PJ, estilo de vida e tolerância a riscos. Este guia completo vai te ajudar 
            a fazer a comparação correta e tomar a melhor decisão para sua carreira e finanças.
          </p>
        </section>

        {/* Como Calcular */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📐 Como Comparar CLT x PJ Corretamente em 2025
          </h3>
          
          <p className="text-gray-700 mb-4">
            Muitas pessoas cometem o erro de comparar apenas o salário bruto CLT com o faturamento PJ. 
            A comparação correta deve considerar:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-3">👔 No CLT, somar:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Salário líquido (após INSS e IRRF)</li>
                <li>✓ Vale Refeição e Alimentação</li>
                <li>✓ Plano de Saúde</li>
                <li>✓ 13º salário líquido</li>
                <li>✓ Férias + 1/3 constitucional</li>
                <li>✓ FGTS (8% todo mês)</li>
                <li>✓ PLR / Bônus</li>
                <li>✓ Outros benefícios</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
              <h4 className="font-bold text-purple-800 mb-3">🏢 No PJ, descontar:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✗ Impostos (Simples ou Presumido)</li>
                <li>✗ Contador (R$ 150-400/mês)</li>
                <li>✗ INSS do pró-labore</li>
                <li>✗ Plano de saúde próprio</li>
                <li>✗ Férias (você precisa poupar)</li>
                <li>✗ 13º (você precisa poupar)</li>
                <li>✗ Reserva de emergência</li>
                <li>✗ Custos operacionais</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-6 my-6">
            <h4 className="font-bold text-gray-800 mb-2">📌 Regra Prática:</h4>
            <p className="text-gray-700">
              Para compensar a perda de benefícios CLT, o faturamento PJ geralmente precisa ser 
              <strong> 40% a 70% maior</strong> que o salário bruto CLT. Exemplo: CLT de R$ 8.000 → PJ mínimo de R$ 11.200 a R$ 13.600.
            </p>
          </div>
        </section>

        {/* Exemplos Práticos */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📊 Exemplos Práticos de Comparação
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 my-4">
              <thead className="bg-violet-600 text-white">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left">Cenário</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">CLT Anual</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">PJ Anual</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Melhor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2">CLT R$ 5.000 x PJ R$ 7.000</td>
                  <td className="border border-gray-300 px-4 py-2">~R$ 75.000</td>
                  <td className="border border-gray-300 px-4 py-2">~R$ 72.000</td>
                  <td className="border border-gray-300 px-4 py-2 font-bold text-blue-600">CLT</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">CLT R$ 8.000 x PJ R$ 12.000</td>
                  <td className="border border-gray-300 px-4 py-2">~R$ 115.000</td>
                  <td className="border border-gray-300 px-4 py-2">~R$ 118.000</td>
                  <td className="border border-gray-300 px-4 py-2 font-bold text-purple-600">PJ (pouco)</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2">CLT R$ 10.000 x PJ R$ 18.000</td>
                  <td className="border border-gray-300 px-4 py-2">~R$ 145.000</td>
                  <td className="border border-gray-300 px-4 py-2">~R$ 175.000</td>
                  <td className="border border-gray-300 px-4 py-2 font-bold text-purple-600">PJ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Erros Comuns */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ⚠️ Erros Comuns ao Comparar CLT x PJ
          </h3>

          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">❌ Erro 1: Comparar bruto com bruto</h4>
              <p className="text-sm text-red-700">
                Comparar salário bruto CLT com faturamento PJ é incorreto. Você precisa comparar o líquido 
                anual de ambos, incluindo todos os benefícios e descontos.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">❌ Erro 2: Esquecer de provisionar férias e 13º</h4>
              <p className="text-sm text-red-700">
                Como PJ, você não tem direito a férias remuneradas nem 13º. Se não poupar, vai ter um 
                "salário" menor nos meses que tirar folga.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">❌ Erro 3: Ignorar o FGTS como benefício</h4>
              <p className="text-sm text-red-700">
                O FGTS é dinheiro seu, depositado todo mês. Equivale a quase 1 salário extra por ano, 
                além de render correção e poder ser sacado em situações específicas.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">❌ Erro 4: Não considerar o risco</h4>
              <p className="text-sm text-red-700">
                PJ pode ser demitido a qualquer momento sem aviso prévio ou multa. CLT tem estabilidade 
                e proteções legais. Quanto vale sua paz de espírito?
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
                Quanto PJ preciso ganhar para compensar CLT de R$ 5.000?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Geralmente entre R$ 7.500 e R$ 9.000, dependendo dos benefícios CLT oferecidos. 
                Use nossa calculadora para simular seu caso específico.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                PJ pode ter férias?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Legalmente, PJ não tem direito a férias. Você pode negociar pausas no contrato, mas 
                não receberá durante esse período. Por isso, é importante poupar 1/12 do faturamento 
                todo mês para "férias".
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Qual o melhor regime tributário para PJ?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Para faturamentos até R$ 15.000/mês, o Simples Nacional costuma ser mais vantajoso. 
                Acima disso, vale comparar com Lucro Presumido. Consulte um contador para seu caso.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                PJ tem direito a aposentadoria?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Sim, desde que pague o INSS sobre o pró-labore. O valor mínimo é sobre 1 salário mínimo 
                (11% de R$ 1.518 = R$ 166,98 em 2025). Isso garante tempo de contribuição para aposentadoria.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Posso ser CLT e PJ ao mesmo tempo?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Sim, desde que não haja conflito de interesses ou cláusula de exclusividade no contrato CLT. 
                Muitos profissionais têm emprego CLT e fazem "freelas" como PJ.
              </p>
            </details>
          </div>
        </section>

        {/* Termos Importantes */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📖 Termos Importantes
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-violet-50 rounded-lg p-4">
              <h4 className="font-bold text-violet-800">CLT</h4>
              <p className="text-sm text-gray-700">
                Consolidação das Leis do Trabalho. Regime de contratação com carteira assinada, 
                que garante direitos como férias, 13º, FGTS e proteções trabalhistas.
              </p>
            </div>
            <div className="bg-violet-50 rounded-lg p-4">
              <h4 className="font-bold text-violet-800">PJ</h4>
              <p className="text-sm text-gray-700">
                Pessoa Jurídica. Contratação como prestador de serviços através de uma empresa 
                (geralmente MEI, ME ou EIRELI). Sem vínculo empregatício.
              </p>
            </div>
            <div className="bg-violet-50 rounded-lg p-4">
              <h4 className="font-bold text-violet-800">Pró-labore</h4>
              <p className="text-sm text-gray-700">
                Remuneração do sócio pelo trabalho na empresa. É obrigatório pagar INSS sobre 
                o pró-labore (mínimo de 1 salário mínimo).
              </p>
            </div>
            <div className="bg-violet-50 rounded-lg p-4">
              <h4 className="font-bold text-violet-800">Simples Nacional</h4>
              <p className="text-sm text-gray-700">
                Regime tributário simplificado para pequenas empresas. Unifica vários impostos 
                em uma única guia (DAS) com alíquotas reduzidas.
              </p>
            </div>
          </div>
        </section>

        {/* Legislação */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ⚖️ O Que Diz a Legislação
          </h3>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>CLT (Decreto-Lei 5.452/1943):</strong> Define todos os direitos do trabalhador 
                com carteira assinada, como jornada de 44h semanais, férias, 13º e FGTS.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Reforma Trabalhista (Lei 13.467/2017):</strong> Flexibilizou algumas regras, 
                mas manteve a maioria dos direitos CLT intactos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Pejotização:</strong> A contratação de PJ para funções que caracterizam 
                vínculo empregatício é ilegal e pode gerar ação trabalhista.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>LC 123/2006:</strong> Institui o Simples Nacional, regime tributário 
                favorecido para micro e pequenas empresas.</span>
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
            Não existe resposta universal para "CLT ou PJ?". A melhor opção depende do seu perfil, 
            dos valores oferecidos e da sua capacidade de gestão financeira. Use nossa calculadora 
            para comparar os números reais do seu caso.
          </p>

          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-blue-100 rounded-xl p-5 border border-blue-300">
              <h4 className="font-bold text-blue-800 mb-2">👔 CLT é melhor se você:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Valoriza estabilidade e previsibilidade</li>
                <li>• Não quer se preocupar com impostos</li>
                <li>• Precisa de plano de saúde empresarial</li>
                <li>• Não tem disciplina para poupar</li>
              </ul>
            </div>
            <div className="bg-purple-100 rounded-xl p-5 border border-purple-300">
              <h4 className="font-bold text-purple-800 mb-2">🏢 PJ é melhor se você:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Recebe proposta 50%+ maior que CLT</li>
                <li>• Tem disciplina financeira</li>
                <li>• Quer flexibilidade de horários</li>
                <li>• Pode ter múltiplos clientes</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl p-6 border border-violet-300">
            <p className="text-violet-800 font-semibold text-center">
              💡 Dica Final: Sempre negocie! Se a empresa quer te contratar como PJ, peça um valor 
              que realmente compense a perda de benefícios. Use os números da calculadora como argumento.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">
            Gostou da ferramenta?
          </h3>
          <p className="mb-4 text-violet-100">
            Explore nossas outras calculadoras tributárias e financeiras gratuitas!
          </p>
          <a 
            href="/" 
            className="inline-block bg-white text-violet-700 px-8 py-3 rounded-xl font-bold hover:bg-violet-50 transition"
          >
            Ver Todas as Ferramentas →
          </a>
        </section>
      </article>
    </div>
  );
}

export default ComparadorCltPj;

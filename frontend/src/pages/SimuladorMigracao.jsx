import { useState, useMemo } from 'react';

/**
 * Simulador de Migração MEI → ME (Simples Nacional)
 * Compara tributos antes e depois da migração
 */
export default function SimuladorMigracao() {
  const [faturamentoMensal, setFaturamentoMensal] = useState('');
  const [atividade, setAtividade] = useState('servicos');
  const [temFuncionario, setTemFuncionario] = useState(false);
  const [folhaMensal, setFolhaMensal] = useState('');

  // Valores do MEI 2025
  const DAS_MEI = {
    comercio: 75.90,      // ICMS
    industria: 76.90,     // ICMS + ISS
    servicos: 80.90,      // ISS
    comercio_servicos: 81.90  // ICMS + ISS
  };

  const LIMITE_MEI = 81000;
  const LIMITE_MEI_MENSAL = 6750;

  // Tabelas do Simples Nacional
  const tabelasSimples = {
    I: [ // Comércio
      { limite: 180000, aliquota: 4.0, deducao: 0 },
      { limite: 360000, aliquota: 7.3, deducao: 5940 },
      { limite: 720000, aliquota: 9.5, deducao: 13860 },
      { limite: 1800000, aliquota: 10.7, deducao: 22500 },
      { limite: 3600000, aliquota: 14.3, deducao: 87300 },
      { limite: 4800000, aliquota: 19.0, deducao: 378000 }
    ],
    II: [ // Indústria
      { limite: 180000, aliquota: 4.5, deducao: 0 },
      { limite: 360000, aliquota: 7.8, deducao: 5940 },
      { limite: 720000, aliquota: 10.0, deducao: 13860 },
      { limite: 1800000, aliquota: 11.2, deducao: 22500 },
      { limite: 3600000, aliquota: 14.7, deducao: 85500 },
      { limite: 4800000, aliquota: 30.0, deducao: 720000 }
    ],
    III: [ // Serviços (fator R >= 28%)
      { limite: 180000, aliquota: 6.0, deducao: 0 },
      { limite: 360000, aliquota: 11.2, deducao: 9360 },
      { limite: 720000, aliquota: 13.5, deducao: 17640 },
      { limite: 1800000, aliquota: 16.0, deducao: 35640 },
      { limite: 3600000, aliquota: 21.0, deducao: 125640 },
      { limite: 4800000, aliquota: 33.0, deducao: 648000 }
    ],
    V: [ // Serviços (fator R < 28%)
      { limite: 180000, aliquota: 15.5, deducao: 0 },
      { limite: 360000, aliquota: 18.0, deducao: 4500 },
      { limite: 720000, aliquota: 19.5, deducao: 9900 },
      { limite: 1800000, aliquota: 20.5, deducao: 17100 },
      { limite: 3600000, aliquota: 23.0, deducao: 62100 },
      { limite: 4800000, aliquota: 30.5, deducao: 540000 }
    ]
  };

  // Mapeamento atividade -> tipo DAS MEI e Anexo Simples
  const atividadesConfig = {
    comercio: { dasMei: 'comercio', anexo: 'I', nome: 'Comércio' },
    industria: { dasMei: 'industria', anexo: 'II', nome: 'Indústria' },
    servicos: { dasMei: 'servicos', anexo: 'III', nome: 'Serviços' },
    comercio_servicos: { dasMei: 'comercio_servicos', anexo: 'I', nome: 'Comércio e Serviços' }
  };

  // Formatar valor monetário
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Calcular alíquota efetiva do Simples
  const calcularAliquotaSimples = (rbt12, anexo) => {
    const tabela = tabelasSimples[anexo];
    const faixa = tabela.find(f => rbt12 <= f.limite) || tabela[tabela.length - 1];
    const aliquotaEfetiva = ((rbt12 * faixa.aliquota / 100) - faixa.deducao) / rbt12 * 100;
    return {
      aliquotaNominal: faixa.aliquota,
      deducao: faixa.deducao,
      aliquotaEfetiva: Math.max(aliquotaEfetiva, 0)
    };
  };

  // Cálculos
  const resultado = useMemo(() => {
    const faturamento = parseFloat(faturamentoMensal) || 0;
    const folha = parseFloat(folhaMensal) || 0;

    if (faturamento <= 0) return null;

    const faturamentoAnual = faturamento * 12;
    const folhaAnual = folha * 12;
    const config = atividadesConfig[atividade];

    // Cálculo MEI
    const dasMeiMensal = DAS_MEI[config.dasMei];
    const tributosAnuaisMei = dasMeiMensal * 12;
    const aliquotaEfetivaMei = (tributosAnuaisMei / faturamentoAnual) * 100;

    // Verificar se ultrapassa limite MEI
    const ultrapassaMei = faturamentoAnual > LIMITE_MEI;
    const percentualLimite = (faturamentoAnual / LIMITE_MEI) * 100;

    // Determinar anexo do Simples (considerando fator R para serviços)
    let anexoSimples = config.anexo;
    let fatorR = 0;

    if (atividade === 'servicos' && faturamentoAnual > 0) {
      fatorR = folhaAnual / faturamentoAnual;
      anexoSimples = fatorR >= 0.28 ? 'III' : 'V';
    }

    // Cálculo Simples Nacional
    const simplesCalc = calcularAliquotaSimples(faturamentoAnual, anexoSimples);
    const tributosAnuaisSimples = faturamentoAnual * (simplesCalc.aliquotaEfetiva / 100);
    const dasSimplesMedia = tributosAnuaisSimples / 12;

    // Diferença
    const diferencaAnual = tributosAnuaisSimples - tributosAnuaisMei;
    const diferencaMensal = dasSimplesMedia - dasMeiMensal;
    const aumentoPercentual = ((tributosAnuaisSimples / tributosAnuaisMei) - 1) * 100;

    // Cenários de faturamento para análise
    const cenarios = [
      { faturamento: 60000, descricao: 'R$ 5.000/mês' },
      { faturamento: 81000, descricao: 'Limite MEI' },
      { faturamento: 120000, descricao: 'R$ 10.000/mês' },
      { faturamento: 180000, descricao: 'R$ 15.000/mês' },
      { faturamento: 240000, descricao: 'R$ 20.000/mês' },
      { faturamento: 360000, descricao: 'R$ 30.000/mês' }
    ].map(c => {
      const simplesC = calcularAliquotaSimples(c.faturamento, anexoSimples);
      const tributosMei = c.faturamento <= LIMITE_MEI ? dasMeiMensal * 12 : null;
      const tributosSimples = c.faturamento * (simplesC.aliquotaEfetiva / 100);

      return {
        ...c,
        tributosMei,
        tributosSimples,
        aliquotaSimples: simplesC.aliquotaEfetiva,
        economia: tributosMei ? tributosMei - tributosSimples : null
      };
    });

    // Ponto de equilíbrio (onde MEI = Simples em custo-benefício)
    const pontoEquilibrio = calcularPontoEquilibrio(anexoSimples, dasMeiMensal);

    return {
      mei: {
        dasMensal: dasMeiMensal,
        tributosAnuais: tributosAnuaisMei,
        aliquotaEfetiva: aliquotaEfetivaMei
      },
      simples: {
        anexo: anexoSimples,
        dasMensal: dasSimplesMedia,
        tributosAnuais: tributosAnuaisSimples,
        aliquotaEfetiva: simplesCalc.aliquotaEfetiva,
        aliquotaNominal: simplesCalc.aliquotaNominal
      },
      faturamentoAnual,
      ultrapassaMei,
      percentualLimite,
      fatorR: atividade === 'servicos' ? fatorR : null,
      diferencaAnual,
      diferencaMensal,
      aumentoPercentual,
      cenarios,
      pontoEquilibrio
    };
  }, [faturamentoMensal, atividade, folhaMensal]);

  // Calcular ponto de equilíbrio
  function calcularPontoEquilibrio(anexo, dasMei) {
    // Encontrar faturamento onde alíquota efetiva do Simples iguala o custo do MEI
    // como o MEI é fixo, quanto maior o faturamento, menor a alíquota efetiva do MEI
    // O ponto de equilíbrio é aproximado
    
    const custoAnualMei = dasMei * 12;
    
    // Para cada faturamento, verificar onde Simples = MEI em % do faturamento
    for (let fat = 60000; fat <= 200000; fat += 1000) {
      if (fat > LIMITE_MEI) break; // MEI só vai até 81k
      
      const simplesCalc = calcularAliquotaSimples(fat, anexo);
      const custoSimples = fat * (simplesCalc.aliquotaEfetiva / 100);
      const aliquotaMeiEquivalente = (custoAnualMei / fat) * 100;
      
      if (simplesCalc.aliquotaEfetiva <= aliquotaMeiEquivalente) {
        return fat;
      }
    }
    
    return null; // Simples sempre mais caro dentro do limite MEI
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🚀 Simulador de Migração MEI → ME
        </h1>
        <p className="text-gray-600">
          Compare os tributos do MEI com o Simples Nacional e planeje sua migração.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 Dados da Empresa</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faturamento Mensal (R$)
                </label>
                <input
                  type="number"
                  value={faturamentoMensal}
                  onChange={(e) => setFaturamentoMensal(e.target.value)}
                  placeholder="Ex: 8000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Atividade
                </label>
                <select
                  value={atividade}
                  onChange={(e) => setAtividade(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="comercio">Comércio</option>
                  <option value="industria">Indústria</option>
                  <option value="servicos">Serviços</option>
                  <option value="comercio_servicos">Comércio e Serviços</option>
                </select>
              </div>

              {atividade === 'servicos' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Folha de Pagamento Mensal (R$)
                  </label>
                  <input
                    type="number"
                    value={folhaMensal}
                    onChange={(e) => setFolhaMensal(e.target.value)}
                    placeholder="Ex: 3000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Usado para calcular o Fator R e definir o anexo
                  </p>
                </div>
              )}

              {/* Info MEI */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">ℹ️ Limites do MEI 2025</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Faturamento: até R$ 81.000/ano</li>
                  <li>• Média mensal: R$ 6.750</li>
                  <li>• Máximo 1 funcionário</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {resultado ? (
            <>
              {/* Alerta de Desenquadramento */}
              {resultado.ultrapassaMei && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h3 className="font-bold text-red-800">Desenquadramento Obrigatório!</h3>
                      <p className="text-red-700">
                        Com {formatarMoeda(resultado.faturamentoAnual)} anuais ({resultado.percentualLimite.toFixed(0)}% do limite), 
                        você <strong>precisa migrar para ME</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Comparativo Visual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card MEI */}
                <div className={`rounded-xl p-6 ${resultado.ultrapassaMei ? 'bg-gray-100 opacity-75' : 'bg-gradient-to-br from-green-500 to-green-600 text-white'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className={resultado.ultrapassaMei ? 'text-gray-500' : 'text-green-100'}>MEI</p>
                      <h3 className={`text-2xl font-bold ${resultado.ultrapassaMei ? 'text-gray-600 line-through' : ''}`}>
                        {formatarMoeda(resultado.mei.dasMensal)}/mês
                      </h3>
                    </div>
                    <span className="text-3xl">{resultado.ultrapassaMei ? '🚫' : '✅'}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={resultado.ultrapassaMei ? 'text-gray-500' : 'text-green-100'}>Anual</span>
                      <span className="font-medium">{formatarMoeda(resultado.mei.tributosAnuais)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={resultado.ultrapassaMei ? 'text-gray-500' : 'text-green-100'}>Alíq. Efetiva</span>
                      <span className="font-medium">{resultado.mei.aliquotaEfetiva.toFixed(2)}%</span>
                    </div>
                  </div>

                  {resultado.ultrapassaMei && (
                    <p className="mt-4 text-sm text-red-600 font-medium">
                      ❌ Não elegível (acima do limite)
                    </p>
                  )}
                </div>

                {/* Card Simples */}
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-indigo-100">Simples Nacional (Anexo {resultado.simples.anexo})</p>
                      <h3 className="text-2xl font-bold">{formatarMoeda(resultado.simples.dasMensal)}/mês</h3>
                    </div>
                    <span className="text-3xl">📊</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-indigo-100">Anual</span>
                      <span className="font-medium">{formatarMoeda(resultado.simples.tributosAnuais)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-100">Alíq. Efetiva</span>
                      <span className="font-medium">{resultado.simples.aliquotaEfetiva.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-100">Alíq. Nominal</span>
                      <span className="font-medium">{resultado.simples.aliquotaNominal}%</span>
                    </div>
                  </div>

                  {resultado.fatorR !== null && (
                    <div className="mt-4 pt-4 border-t border-indigo-400">
                      <p className="text-sm">
                        Fator R: <strong>{(resultado.fatorR * 100).toFixed(1)}%</strong>
                        {resultado.fatorR >= 0.28 ? ' ✓ Anexo III' : ' → Anexo V'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Diferença */}
              <div className={`rounded-xl p-6 ${resultado.diferencaAnual > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
                <h3 className="font-semibold text-gray-900 mb-4">📈 Impacto da Migração</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Diferença Mensal</p>
                    <p className={`text-xl font-bold ${resultado.diferencaMensal > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {resultado.diferencaMensal > 0 ? '+' : ''}{formatarMoeda(resultado.diferencaMensal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Diferença Anual</p>
                    <p className={`text-xl font-bold ${resultado.diferencaAnual > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {resultado.diferencaAnual > 0 ? '+' : ''}{formatarMoeda(resultado.diferencaAnual)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Variação</p>
                    <p className={`text-xl font-bold ${resultado.aumentoPercentual > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {resultado.aumentoPercentual > 0 ? '+' : ''}{resultado.aumentoPercentual.toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">% do Limite MEI</p>
                    <p className="text-xl font-bold text-gray-900">
                      {resultado.percentualLimite.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabela de Cenários */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">📋 Comparativo por Faturamento</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">Faturamento Anual</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">MEI (Anual)</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">Simples (Anual)</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">Alíq. Simples</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">Diferença</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {resultado.cenarios.map((cenario, index) => (
                        <tr 
                          key={index} 
                          className={`hover:bg-gray-50 ${
                            Math.abs(cenario.faturamento - resultado.faturamentoAnual) < 10000 ? 'bg-indigo-50' : ''
                          }`}
                        >
                          <td className="px-4 py-3">
                            <span className="font-medium">{formatarMoeda(cenario.faturamento)}</span>
                            <span className="text-gray-500 text-xs block">{cenario.descricao}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {cenario.tributosMei ? (
                              formatarMoeda(cenario.tributosMei)
                            ) : (
                              <span className="text-red-500">N/A</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">{formatarMoeda(cenario.tributosSimples)}</td>
                          <td className="px-4 py-3 text-right">{cenario.aliquotaSimples.toFixed(2)}%</td>
                          <td className={`px-4 py-3 text-right font-medium ${
                            cenario.economia === null ? 'text-gray-400' :
                            cenario.economia > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {cenario.economia !== null ? (
                              `${cenario.economia > 0 ? '+' : ''}${formatarMoeda(cenario.economia)}`
                            ) : (
                              '—'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  * Diferença positiva = MEI mais barato | Linha destacada = seu faturamento atual
                </p>
              </div>

              {/* Barra de Progresso do Limite */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">📊 Proximidade do Limite MEI</h3>
                
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-indigo-600">
                        {resultado.percentualLimite.toFixed(1)}% utilizado
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        {formatarMoeda(resultado.faturamentoAnual)} / {formatarMoeda(LIMITE_MEI)}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                    <div
                      style={{ width: `${Math.min(resultado.percentualLimite, 100)}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                        resultado.percentualLimite >= 100 ? 'bg-red-500' :
                        resultado.percentualLimite >= 80 ? 'bg-amber-500' :
                        resultado.percentualLimite >= 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>0%</span>
                    <span className="text-amber-600">80% (zona de alerta)</span>
                    <span className="text-red-600">100%</span>
                  </div>
                </div>

                {resultado.percentualLimite >= 70 && resultado.percentualLimite < 100 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-800 text-sm">
                      <strong>⚠️ Atenção:</strong> Você está próximo do limite. 
                      Restam apenas {formatarMoeda(LIMITE_MEI - resultado.faturamentoAnual)} para atingir o teto do MEI.
                    </p>
                  </div>
                )}
              </div>

              {/* Recomendação */}
              <div className={`rounded-xl p-6 ${
                resultado.ultrapassaMei ? 'bg-indigo-600 text-white' :
                resultado.percentualLimite >= 80 ? 'bg-amber-100 border border-amber-300' :
                'bg-green-100 border border-green-300'
              }`}>
                <h3 className={`font-semibold mb-2 ${resultado.ultrapassaMei ? 'text-white' : 'text-gray-900'}`}>
                  💡 Recomendação
                </h3>
                
                {resultado.ultrapassaMei ? (
                  <div className="space-y-2">
                    <p>Você <strong>deve migrar para ME</strong> e optar pelo Simples Nacional.</p>
                    <p className="text-sm text-indigo-200">
                      Com o Anexo {resultado.simples.anexo}, sua carga tributária será de {resultado.simples.aliquotaEfetiva.toFixed(2)}% sobre o faturamento.
                    </p>
                  </div>
                ) : resultado.percentualLimite >= 80 ? (
                  <div className="text-amber-800">
                    <p className="mb-2">
                      <strong>Planeje a migração:</strong> Você está próximo do limite do MEI.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Prepare sua contabilidade para a transição</li>
                      <li>• Avalie se vale migrar voluntariamente agora</li>
                      <li>• Considere o impacto do aumento tributário de {formatarMoeda(resultado.diferencaAnual)}/ano</li>
                    </ul>
                  </div>
                ) : (
                  <div className="text-green-800">
                    <p className="mb-2">
                      <strong>Continue no MEI:</strong> Você está dentro do limite com folga.
                    </p>
                    <p className="text-sm">
                      Economia atual: {formatarMoeda(Math.abs(resultado.diferencaAnual))}/ano em comparação com o Simples Nacional.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Simule sua migração
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Informe seu faturamento mensal para comparar os tributos do MEI 
                com o Simples Nacional e planejar sua transição.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">📋 Quando devo migrar?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="text-red-500">●</span>
              <span><strong>Obrigatório:</strong> Ao ultrapassar R$ 81.000/ano</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500">●</span>
              <span><strong>Recomendado:</strong> Ao se aproximar de 80% do limite</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">●</span>
              <span><strong>Estratégico:</strong> Se precisar de mais funcionários ou atividades não permitidas</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">⚙️ O que muda na migração?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span>📊</span>
              <span>DAS calculado sobre faturamento (não mais fixo)</span>
            </li>
            <li className="flex gap-2">
              <span>📚</span>
              <span>Obrigações acessórias mais complexas</span>
            </li>
            <li className="flex gap-2">
              <span>👥</span>
              <span>Possibilidade de contratar mais funcionários</span>
            </li>
            <li className="flex gap-2">
              <span>🏦</span>
              <span>Necessidade de contador habilitado</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

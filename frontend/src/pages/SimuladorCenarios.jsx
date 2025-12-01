import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SimuladorCenarios() {
  const navigate = useNavigate();
  
  const [cenarios, setCenarios] = useState([
    { id: 1, nome: 'Cenário Atual', faturamentoMensal: 50000, folhaMensal: 15000, despesasMensais: 30000, ativo: true },
    { id: 2, nome: 'Crescimento 20%', faturamentoMensal: 60000, folhaMensal: 18000, despesasMensais: 36000, ativo: false },
    { id: 3, nome: 'Crescimento 50%', faturamentoMensal: 75000, folhaMensal: 22500, despesasMensais: 45000, ativo: false }
  ]);
  
  const [cenarioEditando, setCenarioEditando] = useState(null);
  const [resultados, setResultados] = useState(null);

  // Cálculos Simples Nacional (Anexo III - exemplo)
  const calcularSimples = (faturamento, folha) => {
    const faturamentoAnual = faturamento * 12;
    const folhaAnual = folha * 12;
    const fatorR = folhaAnual / faturamentoAnual;
    
    // Exemplo simplificado - Anexo III com Fator R ≥ 28%
    let aliquota = 0.06; // 6% base
    
    if (faturamentoAnual <= 180000) aliquota = 0.06;
    else if (faturamentoAnual <= 360000) aliquota = 0.112;
    else if (faturamentoAnual <= 720000) aliquota = 0.135;
    else if (faturamentoAnual <= 1800000) aliquota = 0.16;
    else if (faturamentoAnual <= 3600000) aliquota = 0.21;
    else aliquota = 0.33;
    
    // Se Fator R < 28%, alíquota sobe (Anexo V)
    if (fatorR < 0.28) {
      aliquota += 0.10; // Penalidade aproximada
    }
    
    const impostoMensal = faturamento * aliquota;
    const impostoAnual = impostoMensal * 12;
    const cargaEfetiva = (impostoAnual / faturamentoAnual) * 100;
    
    return {
      impostoMensal,
      impostoAnual,
      cargaEfetiva,
      fatorR: fatorR * 100,
      aliquota: aliquota * 100
    };
  };

  // Cálculos Lucro Presumido
  const calcularPresumido = (faturamento) => {
    const faturamentoAnual = faturamento * 12;
    
    // Presunção de 32% para serviços
    const baseIRPJ = faturamento * 0.32;
    const baseCSLL = faturamento * 0.32;
    
    // IRPJ: 15% + 10% adicional sobre excedente de R$ 20k
    let irpj = baseIRPJ * 0.15;
    if (baseIRPJ > 20000) {
      irpj += (baseIRPJ - 20000) * 0.10;
    }
    
    // CSLL: 9%
    const csll = baseCSLL * 0.09;
    
    // PIS/COFINS cumulativo
    const pis = faturamento * 0.0065;
    const cofins = faturamento * 0.03;
    
    // ISS: 5% (exemplo)
    const iss = faturamento * 0.05;
    
    const impostoMensal = irpj + csll + pis + cofins + iss;
    const impostoAnual = impostoMensal * 12;
    const cargaEfetiva = (impostoAnual / faturamentoAnual) * 100;
    
    return {
      impostoMensal,
      impostoAnual,
      cargaEfetiva,
      detalhes: { irpj, csll, pis, cofins, iss }
    };
  };

  // Cálculos Lucro Real
  const calcularReal = (faturamento, despesas) => {
    const faturamentoAnual = faturamento * 12;
    const lucroReal = faturamento - despesas;
    
    // IRPJ: 15% + 10% adicional
    let irpj = lucroReal * 0.15;
    if (lucroReal > 20000) {
      irpj += (lucroReal - 20000) * 0.10;
    }
    
    // CSLL: 9%
    const csll = lucroReal * 0.09;
    
    // PIS/COFINS não-cumulativo
    const pisDebito = faturamento * 0.0165;
    const cofinsDebito = faturamento * 0.076;
    
    // Créditos (assumindo 50% das despesas geram crédito)
    const pisCredito = despesas * 0.5 * 0.0165;
    const cofinsCredito = despesas * 0.5 * 0.076;
    
    const pis = pisDebito - pisCredito;
    const cofins = cofinsDebito - cofinsCredito;
    
    // ISS: 5%
    const iss = faturamento * 0.05;
    
    const impostoMensal = irpj + csll + pis + cofins + iss;
    const impostoAnual = impostoMensal * 12;
    const cargaEfetiva = (impostoAnual / faturamentoAnual) * 100;
    
    return {
      impostoMensal,
      impostoAnual,
      cargaEfetiva,
      lucroReal,
      detalhes: { irpj, csll, pis, cofins, iss }
    };
  };

  const simularCenario = (cenario) => {
    const simples = calcularSimples(cenario.faturamentoMensal, cenario.folhaMensal);
    const presumido = calcularPresumido(cenario.faturamentoMensal);
    const real = calcularReal(cenario.faturamentoMensal, cenario.despesasMensais);
    
    return { simples, presumido, real };
  };

  const compararCenarios = () => {
    const resultadosComparativos = cenarios.map(cenario => ({
      cenario,
      calculos: simularCenario(cenario)
    }));
    
    setResultados(resultadosComparativos);
  };

  const adicionarCenario = () => {
    const novoCenario = {
      id: Date.now(),
      nome: `Cenário ${cenarios.length + 1}`,
      faturamentoMensal: 50000,
      folhaMensal: 15000,
      despesasMensais: 30000,
      ativo: false
    };
    setCenarios([...cenarios, novoCenario]);
  };

  const removerCenario = (id) => {
    if (cenarios.length > 1) {
      setCenarios(cenarios.filter(c => c.id !== id));
    }
  };

  const atualizarCenario = (id, campo, valor) => {
    setCenarios(cenarios.map(c => 
      c.id === id ? { ...c, [campo]: parseFloat(valor) || 0 } : c
    ));
  };

  const melhorRegime = (calculos) => {
    const valores = [
      { regime: 'Simples', valor: calculos.simples.impostoMensal },
      { regime: 'Presumido', valor: calculos.presumido.impostoMensal },
      { regime: 'Real', valor: calculos.real.impostoMensal }
    ];
    return valores.reduce((min, atual) => atual.valor < min.valor ? atual : min);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-green-600 hover:text-green-800 mb-4 flex items-center gap-2"
          >
            ← Voltar para Home
          </button>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Simulador de Cenários
          </h1>
          <p className="text-gray-600 text-lg">
            Compare múltiplos cenários de faturamento e veja qual regime é mais vantajoso em cada situação
          </p>
        </div>

        {/* Configuração de Cenários */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">⚙️ Configure seus Cenários</h2>
            <button
              onClick={adicionarCenario}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              + Adicionar Cenário
            </button>
          </div>

          <div className="space-y-4">
            {cenarios.map((cenario) => (
              <div key={cenario.id} className="border-2 border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={cenario.nome}
                    onChange={(e) => atualizarCenario(cenario.id, 'nome', e.target.value)}
                    className="text-xl font-bold text-gray-800 border-b-2 border-transparent hover:border-gray-300 focus:border-green-500 outline-none px-2 py-1"
                  />
                  {cenarios.length > 1 && (
                    <button
                      onClick={() => removerCenario(cenario.id)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition text-sm"
                    >
                      🗑️ Remover
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💰 Faturamento Mensal
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">R$</span>
                      <input
                        type="number"
                        value={cenario.faturamentoMensal}
                        onChange={(e) => atualizarCenario(cenario.id, 'faturamentoMensal', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      👥 Folha de Pagamento
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">R$</span>
                      <input
                        type="number"
                        value={cenario.folhaMensal}
                        onChange={(e) => atualizarCenario(cenario.id, 'folhaMensal', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📉 Despesas Totais
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">R$</span>
                      <input
                        type="number"
                        value={cenario.despesasMensais}
                        onChange={(e) => atualizarCenario(cenario.id, 'despesasMensais', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Info rápida */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Faturamento Anual:</span>
                    <div className="font-bold text-gray-800">
                      R$ {(cenario.faturamentoMensal * 12).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Fator R:</span>
                    <div className="font-bold text-gray-800">
                      {((cenario.folhaMensal * 12) / (cenario.faturamentoMensal * 12) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Margem Bruta:</span>
                    <div className="font-bold text-gray-800">
                      {((cenario.faturamentoMensal - cenario.despesasMensais) / cenario.faturamentoMensal * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={compararCenarios}
            className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition shadow-lg"
          >
            🔍 Comparar Todos os Cenários
          </button>
        </div>

        {/* Resultados */}
        {resultados && (
          <div className="space-y-8">
            {resultados.map(({ cenario, calculos }) => {
              const melhor = melhorRegime(calculos);
              
              return (
                <div key={cenario.id} className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    📈 {cenario.nome}
                  </h3>

                  {/* Comparativo de Regimes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    
                    {/* Simples Nacional */}
                    <div className={`rounded-xl p-6 border-2 ${melhor.regime === 'Simples' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-800">🟢 Simples</h4>
                        {melhor.regime === 'Simples' && (
                          <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-bold">
                            ✨ MELHOR
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fator R:</span>
                          <span className="font-bold">{calculos.simples.fatorR.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Alíquota:</span>
                          <span className="font-bold">{calculos.simples.aliquota.toFixed(2)}%</span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="text-2xl font-black text-green-600 mb-1">
                          R$ {calculos.simples.impostoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-gray-500">por mês</div>
                        <div className="text-sm text-gray-700 mt-2">
                          R$ {calculos.simples.impostoAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ano
                        </div>
                        <div className="text-xs text-gray-500">
                          Carga: {calculos.simples.cargaEfetiva.toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    {/* Lucro Presumido */}
                    <div className={`rounded-xl p-6 border-2 ${melhor.regime === 'Presumido' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-800">🟡 Presumido</h4>
                        {melhor.regime === 'Presumido' && (
                          <span className="px-3 py-1 bg-yellow-600 text-white rounded-full text-xs font-bold">
                            ✨ MELHOR
                          </span>
                        )}
                      </div>

                      <div className="border-t pt-4">
                        <div className="text-2xl font-black text-yellow-600 mb-1">
                          R$ {calculos.presumido.impostoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-gray-500">por mês</div>
                        <div className="text-sm text-gray-700 mt-2">
                          R$ {calculos.presumido.impostoAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ano
                        </div>
                        <div className="text-xs text-gray-500">
                          Carga: {calculos.presumido.cargaEfetiva.toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    {/* Lucro Real */}
                    <div className={`rounded-xl p-6 border-2 ${melhor.regime === 'Real' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-800">🔴 Real</h4>
                        {melhor.regime === 'Real' && (
                          <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold">
                            ✨ MELHOR
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lucro Real:</span>
                          <span className="font-bold">R$ {calculos.real.lucroReal.toLocaleString('pt-BR')}</span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="text-2xl font-black text-red-600 mb-1">
                          R$ {calculos.real.impostoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-gray-500">por mês</div>
                        <div className="text-sm text-gray-700 mt-2">
                          R$ {calculos.real.impostoAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ano
                        </div>
                        <div className="text-xs text-gray-500">
                          Carga: {calculos.real.cargaEfetiva.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Economia */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-800 mb-3">💰 Análise de Economia</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Melhor Regime:</div>
                        <div className="text-xl font-black text-green-600">{melhor.regime}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Economia vs Pior:</div>
                        <div className="text-xl font-black text-blue-600">
                          R$ {(Math.max(calculos.simples.impostoAnual, calculos.presumido.impostoAnual, calculos.real.impostoAnual) - melhor.valor * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ano
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Diferença Percentual:</div>
                        <div className="text-xl font-black text-purple-600">
                          {(((Math.max(calculos.simples.impostoMensal, calculos.presumido.impostoMensal, calculos.real.impostoMensal) - melhor.valor) / Math.max(calculos.simples.impostoMensal, calculos.presumido.impostoMensal, calculos.real.impostoMensal)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Aviso */}
        <div className="mt-8 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl shadow-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">⚠️ Importante</h3>
          <p className="text-yellow-100">
            Este simulador usa cálculos simplificados para fins educacionais. Os valores reais podem variar conforme:
            atividade (CNAE), município, estado, anexo específico, sublimites, créditos reais de PIS/COFINS, e outras variáveis.
            Para decisões empresariais, consulte sempre um contador certificado e use nossas calculadoras detalhadas.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🎯 Cálculos Precisos</h3>
          <p className="text-gray-600 mb-6">
            Para resultados exatos com todos os detalhes, use nossas calculadoras especializadas
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/formulario')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
            >
              ⚖️ Comparador Completo
            </button>
            <button
              onClick={() => navigate('/calculadora-das')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              🟢 Calcular DAS
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

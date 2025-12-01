/**
 * Simulador de Desenquadramento MEI/Simples Nacional
 * Prevê quando a empresa ultrapassa os limites permitidos
 */
import { useState } from 'react';

function SimuladorDesenquadramento() {
  const [faturamentoMensal, setFaturamentoMensal] = useState(Array(12).fill(''));
  const [resultado, setResultado] = useState(null);
  const [anoBase, setAnoBase] = useState(new Date().getFullYear());

  // Limites
  const LIMITE_MEI = 81000;
  const LIMITE_SIMPLES = 4800000;
  const LIMITE_MEI_SUBLIMITE_20 = 6750; // 81k / 12 = 6.750

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handleFaturamentoChange = (index, valor) => {
    const novoFaturamento = [...faturamentoMensal];
    novoFaturamento[index] = valor;
    setFaturamentoMensal(novoFaturamento);
  };

  const preencherMedia = () => {
    const valorMedia = prompt('Digite o valor médio mensal:');
    if (valorMedia) {
      const valor = parseFloat(valorMedia);
      if (!isNaN(valor) && valor >= 0) {
        setFaturamentoMensal(Array(12).fill(valor.toString()));
      }
    }
  };

  const calcularRBT12 = (ateMes) => {
    let total = 0;
    for (let i = 0; i <= ateMes; i++) {
      const valor = parseFloat(faturamentoMensal[i]) || 0;
      total += valor;
    }
    return total;
  };

  const calcularProjecaoAnual = () => {
    const mesesPreenchidos = faturamentoMensal.filter(v => v !== '' && parseFloat(v) > 0).length;
    if (mesesPreenchidos === 0) return 0;
    
    const totalPreenchido = faturamentoMensal.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const media = totalPreenchido / mesesPreenchidos;
    return media * 12;
  };

  const analisar = () => {
    const analise = {
      rbt12: 0,
      meses: [],
      ultrapassouMEI: false,
      mesUltrapassouMEI: null,
      ultrapassouSimples: false,
      mesUltrapassouSimples: null,
      statusAtual: '',
      alertas: [],
      projecaoAnual: 0
    };

    let acumulado = 0;
    let ultrapassouMEI = false;
    let ultrapassouSimples = false;

    // Análise mês a mês
    for (let i = 0; i < 12; i++) {
      const valorMes = parseFloat(faturamentoMensal[i]) || 0;
      acumulado += valorMes;

      const mesAnalise = {
        mes: meses[i],
        mesNumero: i + 1,
        valor: valorMes,
        acumulado: acumulado,
        percentualMEI: (acumulado / LIMITE_MEI) * 100,
        percentualSimples: (acumulado / LIMITE_SIMPLES) * 100,
        status: 'normal',
        alertas: []
      };

      // Verificar ultrapassagem MEI
      if (!ultrapassouMEI && acumulado > LIMITE_MEI) {
        ultrapassouMEI = true;
        analise.ultrapassouMEI = true;
        analise.mesUltrapassouMEI = i;
        mesAnalise.status = 'ultrapassou-mei';
        mesAnalise.alertas.push({
          tipo: 'perigo',
          mensagem: `Limite MEI ultrapassado! (${formatarMoeda(acumulado - LIMITE_MEI)} acima)`
        });
      } else if (!ultrapassouMEI && acumulado > LIMITE_MEI * 0.8) {
        mesAnalise.status = 'alerta-mei';
        mesAnalise.alertas.push({
          tipo: 'atencao',
          mensagem: 'Atenção! Próximo ao limite MEI'
        });
      }

      // Verificar ultrapassagem Simples
      if (!ultrapassouSimples && acumulado > LIMITE_SIMPLES) {
        ultrapassouSimples = true;
        analise.ultrapassouSimples = true;
        analise.mesUltrapassouSimples = i;
        mesAnalise.status = 'ultrapassou-simples';
        mesAnalise.alertas.push({
          tipo: 'perigo',
          mensagem: `Limite Simples Nacional ultrapassado! (${formatarMoeda(acumulado - LIMITE_SIMPLES)} acima)`
        });
      } else if (!ultrapassouSimples && acumulado > LIMITE_SIMPLES * 0.9) {
        mesAnalise.status = 'alerta-simples';
        mesAnalise.alertas.push({
          tipo: 'atencao',
          mensagem: 'Atenção! Próximo ao limite do Simples Nacional'
        });
      }

      // Verificar sublimite 20% MEI
      if (!ultrapassouMEI && valorMes > LIMITE_MEI_SUBLIMITE_20 * 1.2) {
        mesAnalise.alertas.push({
          tipo: 'info',
          mensagem: 'Faturamento mensal 20% acima da média MEI'
        });
      }

      analise.meses.push(mesAnalise);
    }

    analise.rbt12 = acumulado;
    analise.projecaoAnual = calcularProjecaoAnual();

    // Determinar status atual
    if (analise.ultrapassouSimples) {
      analise.statusAtual = 'Desenquadrado do Simples Nacional';
      analise.alertas.push({
        tipo: 'perigo',
        titulo: 'Desenquadramento do Simples Nacional',
        mensagem: 'Sua empresa ultrapassou o limite de R$ 4.800.000,00. É necessário migrar para Lucro Presumido ou Lucro Real.'
      });
    } else if (analise.ultrapassouMEI) {
      analise.statusAtual = 'Desenquadrado do MEI';
      analise.alertas.push({
        tipo: 'alerta',
        titulo: 'Desenquadramento do MEI',
        mensagem: 'Sua empresa ultrapassou o limite de R$ 81.000,00. É necessário migrar para Microempresa (Simples Nacional).'
      });
    } else if (analise.rbt12 > LIMITE_MEI * 0.9 || analise.projecaoAnual > LIMITE_MEI * 0.9) {
      analise.statusAtual = 'Atenção - Próximo ao limite MEI';
      analise.alertas.push({
        tipo: 'atencao',
        titulo: 'Atenção com o Limite MEI',
        mensagem: 'Você está próximo do limite. Considere planejar a migração para evitar problemas.'
      });
    } else if (analise.rbt12 > LIMITE_SIMPLES * 0.9 || analise.projecaoAnual > LIMITE_SIMPLES * 0.9) {
      analise.statusAtual = 'Atenção - Próximo ao limite Simples';
      analise.alertas.push({
        tipo: 'atencao',
        titulo: 'Atenção com o Limite Simples Nacional',
        mensagem: 'Você está próximo do limite. Consulte um contador para planejamento tributário.'
      });
    } else {
      analise.statusAtual = 'Dentro dos limites';
      analise.alertas.push({
        tipo: 'sucesso',
        titulo: 'Situação Regular',
        mensagem: 'Sua empresa está dentro dos limites permitidos.'
      });
    }

    setResultado(analise);
  };

  const limpar = () => {
    setFaturamentoMensal(Array(12).fill(''));
    setResultado(null);
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getCorStatus = (status) => {
    switch (status) {
      case 'ultrapassou-mei':
      case 'ultrapassou-simples':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'alerta-mei':
      case 'alerta-simples':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-green-100 border-green-300 text-green-800';
    }
  };

  const getIconeAlerta = (tipo) => {
    switch (tipo) {
      case 'perigo':
        return '🚨';
      case 'alerta':
        return '⚠️';
      case 'atencao':
        return '⏰';
      case 'sucesso':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-700 rounded-2xl shadow-xl p-6 md:p-8 mb-6 md:mb-8 text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          📊 Simulador de Desenquadramento MEI/Simples
        </h1>
        <p className="text-orange-100 text-lg">
          Preveja quando sua empresa ultrapassará os limites do MEI ou Simples Nacional
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel de Entrada */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">📅</span>
              Faturamento Mensal - {anoBase}
            </h2>
            <button
              onClick={preencherMedia}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
            >
              Preencher Média
            </button>
          </div>

          {/* Grid de Meses */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            {meses.map((mes, index) => (
              <div key={index}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {mes}
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-gray-500 text-xs">R$</span>
                  <input
                    type="number"
                    value={faturamentoMensal[index]}
                    onChange={(e) => handleFaturamentoChange(index, e.target.value)}
                    className="w-full pl-8 pr-2 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-sm"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4">
            <button
              onClick={analisar}
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span className="text-2xl">🔍</span>
              Analisar Desenquadramento
            </button>
            <button
              onClick={limpar}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Painel de Limites */}
        <div className="space-y-6">
          {/* Limites MEI */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-500">
            <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-3xl">👤</span>
              MEI
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Limite Anual</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatarMoeda(LIMITE_MEI)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Média Mensal</div>
                <div className="text-lg font-semibold text-gray-700">
                  {formatarMoeda(LIMITE_MEI / 12)}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-xs text-gray-700">
                <strong>Atenção:</strong> Sublimite de 20% em um único mês pode gerar desenquadramento.
              </div>
            </div>
          </div>

          {/* Limites Simples */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-purple-500">
            <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-3xl">🏢</span>
              Simples Nacional
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Limite Anual</div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatarMoeda(LIMITE_SIMPLES)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Média Mensal</div>
                <div className="text-lg font-semibold text-gray-700">
                  {formatarMoeda(LIMITE_SIMPLES / 12)}
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-xs text-gray-700">
                <strong>Tolerância:</strong> Até 20% acima em um ano permite permanência no ano seguinte.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {resultado && (
        <div className="mt-8 space-y-6">
          {/* Status Geral */}
          <div className={`rounded-2xl shadow-xl p-8 ${
            resultado.ultrapassouSimples ? 'bg-gradient-to-r from-red-600 to-red-700' :
            resultado.ultrapassouMEI ? 'bg-gradient-to-r from-orange-600 to-orange-700' :
            'bg-gradient-to-r from-green-600 to-emerald-700'
          } text-white`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{resultado.statusAtual}</h2>
                <p className="text-lg opacity-90">Receita Bruta Total (12 meses)</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-black">{formatarMoeda(resultado.rbt12)}</div>
                <div className="text-sm opacity-75 mt-1">
                  Projeção anual: {formatarMoeda(resultado.projecaoAnual)}
                </div>
              </div>
            </div>

            {/* Barras de Progresso */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Limite MEI</span>
                  <span>{((resultado.rbt12 / LIMITE_MEI) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                  <div
                    className="bg-white h-3 rounded-full transition-all"
                    style={{ width: `${Math.min((resultado.rbt12 / LIMITE_MEI) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Limite Simples Nacional</span>
                  <span>{((resultado.rbt12 / LIMITE_SIMPLES) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                  <div
                    className="bg-white h-3 rounded-full transition-all"
                    style={{ width: `${Math.min((resultado.rbt12 / LIMITE_SIMPLES) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Alertas */}
          {resultado.alertas.length > 0 && (
            <div className="space-y-4">
              {resultado.alertas.map((alerta, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-6 shadow-lg ${
                    alerta.tipo === 'perigo' ? 'bg-red-50 border-2 border-red-300' :
                    alerta.tipo === 'alerta' ? 'bg-orange-50 border-2 border-orange-300' :
                    alerta.tipo === 'atencao' ? 'bg-yellow-50 border-2 border-yellow-300' :
                    'bg-green-50 border-2 border-green-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{getIconeAlerta(alerta.tipo)}</span>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{alerta.titulo}</h3>
                      <p className="text-gray-700">{alerta.mensagem}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Timeline Mensal */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-3xl">📈</span>
              Timeline Mês a Mês
            </h3>

            <div className="space-y-4">
              {resultado.meses.map((mes, index) => (
                mes.valor > 0 && (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${getCorStatus(mes.status)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-lg">{mes.mes}</div>
                        <div className="text-sm">Faturamento: {formatarMoeda(mes.valor)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">Acumulado</div>
                        <div className="text-xl font-black">{formatarMoeda(mes.acumulado)}</div>
                      </div>
                    </div>

                    {/* Barra de progresso inline */}
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <div className="text-xs mb-1">MEI: {mes.percentualMEI.toFixed(1)}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min(mes.percentualMEI, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs mb-1">Simples: {mes.percentualSimples.toFixed(1)}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${Math.min(mes.percentualSimples, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Alertas do mês */}
                    {mes.alertas.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {mes.alertas.map((alerta, aIndex) => (
                          <div key={aIndex} className="text-xs flex items-center gap-2">
                            <span>{getIconeAlerta(alerta.tipo)}</span>
                            <span>{alerta.mensagem}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Informações */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Informações Importantes
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>MEI:</strong> Limite de R$ 81.000,00 anuais. Faturamento acima de 20% em um único mês pode gerar desenquadramento retroativo.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>Simples Nacional:</strong> Limite de R$ 4.800.000,00 anuais. Há tolerância de 20% (até R$ 5.760.000,00) com desenquadramento no ano seguinte.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>Planejamento:</strong> Monitore mensalmente para evitar surpresas e planejar a migração com antecedência.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>Consulte um contador:</strong> Esta ferramenta é uma simulação. Para decisões oficiais, consulte um profissional contábil.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SimuladorDesenquadramento;

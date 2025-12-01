import { useState, useMemo } from 'react';

/**
 * Cap Table Simulator para Startups
 * Simula distribuição de equity entre sócios, investimentos e diluição por rodada
 */
export default function CapTableSimulator() {
  // Estado inicial dos sócios fundadores
  const [socios, setSocios] = useState([
    { id: 1, nome: 'Fundador 1', percentual: 60 },
    { id: 2, nome: 'Fundador 2', percentual: 40 }
  ]);

  // Estado das rodadas de investimento
  const [rodadas, setRodadas] = useState([]);

  // Contador para IDs únicos
  const [nextSocioId, setNextSocioId] = useState(3);
  const [nextRodadaId, setNextRodadaId] = useState(1);

  // Nova rodada em edição
  const [novaRodada, setNovaRodada] = useState({
    nome: '',
    investimento: '',
    equity: ''
  });

  // Formatar valor monetário
  const formatarMoeda = (valor) => {
    if (valor >= 1000000000) {
      return `R$ ${(valor / 1000000000).toFixed(2)}B`;
    }
    if (valor >= 1000000) {
      return `R$ ${(valor / 1000000).toFixed(2)}M`;
    }
    if (valor >= 1000) {
      return `R$ ${(valor / 1000).toFixed(1)}K`;
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Validar se soma dos sócios é 100%
  const somaSocios = useMemo(() => {
    return socios.reduce((acc, s) => acc + (parseFloat(s.percentual) || 0), 0);
  }, [socios]);

  // Adicionar novo sócio
  const adicionarSocio = () => {
    setSocios([...socios, { id: nextSocioId, nome: `Sócio ${nextSocioId}`, percentual: 0 }]);
    setNextSocioId(nextSocioId + 1);
  };

  // Remover sócio
  const removerSocio = (id) => {
    if (socios.length > 1) {
      setSocios(socios.filter(s => s.id !== id));
    }
  };

  // Atualizar sócio
  const atualizarSocio = (id, campo, valor) => {
    setSocios(socios.map(s => 
      s.id === id ? { ...s, [campo]: campo === 'percentual' ? parseFloat(valor) || 0 : valor } : s
    ));
  };

  // Adicionar rodada de investimento
  const adicionarRodada = () => {
    if (!novaRodada.nome || !novaRodada.investimento || !novaRodada.equity) return;
    
    const rodada = {
      id: nextRodadaId,
      nome: novaRodada.nome,
      investimento: parseFloat(novaRodada.investimento),
      equity: parseFloat(novaRodada.equity)
    };

    setRodadas([...rodadas, rodada]);
    setNextRodadaId(nextRodadaId + 1);
    setNovaRodada({ nome: '', investimento: '', equity: '' });
  };

  // Remover rodada
  const removerRodada = (id) => {
    setRodadas(rodadas.filter(r => r.id !== id));
  };

  // Calcular cap table após todas as rodadas
  const capTable = useMemo(() => {
    // Iniciar com sócios fundadores
    let participantes = socios.map(s => ({
      id: s.id,
      nome: s.nome,
      tipo: 'fundador',
      percentualInicial: s.percentual,
      percentualAtual: s.percentual,
      investido: 0,
      historico: [{ rodada: 'Inicial', percentual: s.percentual }]
    }));

    let valorEmpresa = 0; // Será calculado na primeira rodada

    // Aplicar cada rodada
    rodadas.forEach((rodada, index) => {
      const diluicao = rodada.equity / 100;
      
      // Calcular valuation post-money
      const postMoney = rodada.investimento / diluicao;
      const preMoney = postMoney - rodada.investimento;
      
      if (index === 0) {
        valorEmpresa = preMoney;
      }

      // Diluir todos os participantes existentes
      participantes = participantes.map(p => ({
        ...p,
        percentualAtual: p.percentualAtual * (1 - diluicao),
        historico: [...p.historico, { rodada: rodada.nome, percentual: p.percentualAtual * (1 - diluicao) }]
      }));

      // Adicionar investidor da rodada
      participantes.push({
        id: `inv-${rodada.id}`,
        nome: `${rodada.nome}`,
        tipo: 'investidor',
        percentualInicial: 0,
        percentualAtual: rodada.equity,
        investido: rodada.investimento,
        rodadaEntrada: rodada.nome,
        historico: [{ rodada: rodada.nome, percentual: rodada.equity }]
      });

      valorEmpresa = postMoney;
    });

    // Calcular valor de cada participação
    participantes = participantes.map(p => ({
      ...p,
      valorParticipacao: valorEmpresa * (p.percentualAtual / 100)
    }));

    return {
      participantes,
      valorEmpresa,
      totalEquity: participantes.reduce((acc, p) => acc + p.percentualAtual, 0)
    };
  }, [socios, rodadas]);

  // Calcular resumo por rodada
  const resumoRodadas = useMemo(() => {
    let valorAnterior = 0;
    
    return rodadas.map((rodada, index) => {
      const postMoney = rodada.investimento / (rodada.equity / 100);
      const preMoney = postMoney - rodada.investimento;
      
      const resultado = {
        ...rodada,
        preMoney,
        postMoney,
        diluicaoTotal: rodada.equity
      };

      valorAnterior = postMoney;
      return resultado;
    });
  }, [rodadas]);

  // Exportar para Excel/CSV
  const exportarCSV = () => {
    const headers = ['Nome', 'Tipo', '% Inicial', '% Atual', 'Investido', 'Valor Participação'];
    const rows = capTable.participantes.map(p => [
      p.nome,
      p.tipo,
      p.percentualInicial.toFixed(2) + '%',
      p.percentualAtual.toFixed(2) + '%',
      p.investido || 0,
      p.valorParticipacao || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'cap_table.csv';
    link.click();
  };

  // Cores por tipo
  const getCor = (tipo, index) => {
    if (tipo === 'fundador') {
      const cores = ['bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-lime-500'];
      return cores[index % cores.length];
    }
    const cores = ['bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'];
    return cores[index % cores.length];
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Cap Table Simulator
        </h1>
        <p className="text-gray-600">
          Simule a distribuição de equity entre sócios e veja como cada rodada de investimento dilui as participações.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Configuração */}
        <div className="lg:col-span-1 space-y-6">
          {/* Sócios Fundadores */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">👥 Sócios Fundadores</h2>
              <button
                onClick={adicionarSocio}
                className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition"
              >
                + Adicionar
              </button>
            </div>

            <div className="space-y-3">
              {socios.map((socio) => (
                <div key={socio.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={socio.nome}
                    onChange={(e) => atualizarSocio(socio.id, 'nome', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Nome"
                  />
                  <div className="relative">
                    <input
                      type="number"
                      value={socio.percentual}
                      onChange={(e) => atualizarSocio(socio.id, 'percentual', e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="%"
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                  {socios.length > 1 && (
                    <button
                      onClick={() => removerSocio(socio.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Validação */}
            <div className={`mt-4 p-3 rounded-lg ${
              Math.abs(somaSocios - 100) < 0.01 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm font-medium ${
                Math.abs(somaSocios - 100) < 0.01 ? 'text-green-700' : 'text-red-700'
              }`}>
                Total: {somaSocios.toFixed(2)}%
                {Math.abs(somaSocios - 100) >= 0.01 && ' (deve ser 100%)'}
              </p>
            </div>
          </div>

          {/* Adicionar Rodada */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">💰 Nova Rodada</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Rodada</label>
                <input
                  type="text"
                  value={novaRodada.nome}
                  onChange={(e) => setNovaRodada({ ...novaRodada, nome: e.target.value })}
                  placeholder="Ex: Seed, Series A..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investimento (R$)</label>
                <input
                  type="number"
                  value={novaRodada.investimento}
                  onChange={(e) => setNovaRodada({ ...novaRodada, investimento: e.target.value })}
                  placeholder="Ex: 1000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equity Oferecido (%)</label>
                <input
                  type="number"
                  value={novaRodada.equity}
                  onChange={(e) => setNovaRodada({ ...novaRodada, equity: e.target.value })}
                  placeholder="Ex: 20"
                  min="0.1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              <button
                onClick={adicionarRodada}
                disabled={!novaRodada.nome || !novaRodada.investimento || !novaRodada.equity}
                className="w-full py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                + Adicionar Rodada
              </button>
            </div>
          </div>

          {/* Rodadas Adicionadas */}
          {rodadas.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Rodadas</h2>
              
              <div className="space-y-2">
                {rodadas.map((rodada, index) => (
                  <div 
                    key={rodada.id}
                    className="flex items-center justify-between p-3 bg-violet-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-violet-800">{rodada.nome}</p>
                      <p className="text-sm text-violet-600">
                        {formatarMoeda(rodada.investimento)} → {rodada.equity}%
                      </p>
                    </div>
                    <button
                      onClick={() => removerRodada(rodada.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Coluna 2-3: Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visualização do Equity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">🥧 Distribuição de Equity</h2>
              {rodadas.length > 0 && (
                <button
                  onClick={exportarCSV}
                  className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                >
                  📥 Exportar CSV
                </button>
              )}
            </div>

            {/* Gráfico de Pizza usando CSS */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Pizza Chart */}
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {(() => {
                    let acumulado = 0;
                    let fundadorIndex = 0;
                    let investidorIndex = 0;
                    
                    return capTable.participantes.map((p) => {
                      const inicio = acumulado;
                      const percentual = p.percentualAtual;
                      acumulado += percentual;
                      
                      // Calcular path do arco
                      const x1 = 50 + 40 * Math.cos(2 * Math.PI * inicio / 100);
                      const y1 = 50 + 40 * Math.sin(2 * Math.PI * inicio / 100);
                      const x2 = 50 + 40 * Math.cos(2 * Math.PI * acumulado / 100);
                      const y2 = 50 + 40 * Math.sin(2 * Math.PI * acumulado / 100);
                      const largeArc = percentual > 50 ? 1 : 0;
                      
                      const corIndex = p.tipo === 'fundador' ? fundadorIndex++ : investidorIndex++;
                      const cores = p.tipo === 'fundador' 
                        ? ['#22c55e', '#10b981', '#14b8a6', '#84cc16']
                        : ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];
                      const cor = cores[corIndex % cores.length];

                      return (
                        <path
                          key={p.id}
                          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={cor}
                          stroke="white"
                          strokeWidth="0.5"
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        >
                          <title>{p.nome}: {p.percentualAtual.toFixed(2)}%</title>
                        </path>
                      );
                    });
                  })()}
                </svg>
                
                {/* Centro */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-lg font-bold text-gray-800">100%</p>
                  </div>
                </div>
              </div>

              {/* Legenda */}
              <div className="flex-1 space-y-2">
                {capTable.participantes.map((p, index) => {
                  const corIndex = p.tipo === 'fundador' 
                    ? capTable.participantes.filter((x, i) => i < index && x.tipo === 'fundador').length
                    : capTable.participantes.filter((x, i) => i < index && x.tipo === 'investidor').length;
                  
                  return (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${getCor(p.tipo, corIndex)}`}></div>
                        <div>
                          <p className="font-medium text-gray-800">{p.nome}</p>
                          <p className="text-xs text-gray-500">{p.tipo === 'fundador' ? 'Fundador' : 'Investidor'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{p.percentualAtual.toFixed(2)}%</p>
                        {p.valorParticipacao > 0 && (
                          <p className="text-xs text-gray-500">{formatarMoeda(p.valorParticipacao)}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cap Table Detalhada */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Cap Table Detalhada</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Participante</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Tipo</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">% Inicial</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">% Atual</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Diluição</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Investido</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {capTable.participantes.map((p) => {
                    const diluicao = p.tipo === 'fundador' 
                      ? ((p.percentualInicial - p.percentualAtual) / p.percentualInicial * 100) 
                      : 0;
                    
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{p.nome}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            p.tipo === 'fundador' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-violet-100 text-violet-700'
                          }`}>
                            {p.tipo === 'fundador' ? '👤 Fundador' : '💰 Investidor'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {p.percentualInicial > 0 ? `${p.percentualInicial.toFixed(2)}%` : '-'}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">
                          {p.percentualAtual.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-right">
                          {diluicao > 0 ? (
                            <span className="text-red-600">-{diluicao.toFixed(1)}%</span>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {p.investido > 0 ? formatarMoeda(p.investido) : '-'}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-green-600">
                          {p.valorParticipacao > 0 ? formatarMoeda(p.valorParticipacao) : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 font-medium">
                  <tr>
                    <td className="px-4 py-3" colSpan="3">Total</td>
                    <td className="px-4 py-3 text-right font-bold">{capTable.totalEquity.toFixed(2)}%</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-right">
                      {formatarMoeda(rodadas.reduce((acc, r) => acc + r.investimento, 0))}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">
                      {capTable.valorEmpresa > 0 ? formatarMoeda(capTable.valorEmpresa) : '-'}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Resumo das Rodadas */}
          {resumoRodadas.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📈 Evolução do Valuation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumoRodadas.map((rodada, index) => (
                  <div 
                    key={rodada.id}
                    className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-5 text-white"
                  >
                    <p className="text-violet-100 text-sm mb-1">{rodada.nome}</p>
                    <p className="text-2xl font-bold mb-3">{formatarMoeda(rodada.postMoney)}</p>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-violet-200">
                        <span>Investimento</span>
                        <span>{formatarMoeda(rodada.investimento)}</span>
                      </div>
                      <div className="flex justify-between text-violet-200">
                        <span>Pre-Money</span>
                        <span>{formatarMoeda(rodada.preMoney)}</span>
                      </div>
                      <div className="flex justify-between text-violet-200">
                        <span>Equity vendido</span>
                        <span>{rodada.equity}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gráfico de evolução */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Evolução do Valuation</h3>
                <div className="h-32 flex items-end gap-4">
                  {resumoRodadas.map((rodada, index) => {
                    const maxVal = Math.max(...resumoRodadas.map(r => r.postMoney));
                    const altura = (rodada.postMoney / maxVal) * 100;
                    
                    return (
                      <div key={rodada.id} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex flex-col justify-end h-24">
                          <div 
                            className="w-full bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-lg"
                            style={{ height: `${altura}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-2 text-center">{rodada.nome}</p>
                        <p className="text-xs font-medium text-violet-600">{formatarMoeda(rodada.postMoney)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Dicas */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Sobre Diluição</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg">
                <h4 className="font-medium text-violet-800 mb-2">🧮 Como funciona</h4>
                <p className="text-violet-700 text-sm">
                  A cada rodada, todos os acionistas são diluídos proporcionalmente. 
                  Se você tem 50% e vende 20% para um investidor, você passa a ter 40% (50% × 0.8).
                </p>
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2">⚠️ Atenção</h4>
                <p className="text-amber-700 text-sm">
                  Fundadores devem manter pelo menos 50% após Series A para manter controle. 
                  Planeje suas rodadas para evitar diluição excessiva.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

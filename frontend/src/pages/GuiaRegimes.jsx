import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const REGIMES = [
  {
    id: 'simples',
    nome: 'Simples Nacional',
    emoji: '🟢',
    cor: 'green',
    resumo: 'Ideal para pequenas empresas com faturamento até R$ 4,8 milhões/ano',
    limiteReceita: 'Até R$ 4.800.000/ano',
    complexidade: 'Baixa',
    obrigacoes: 'Mínimas (DEFIS anual)',
    vantagens: [
      'Guia única de pagamento (DAS)',
      'Unifica até 8 impostos',
      'Menos burocracia',
      'Alíquotas progressivas favoráveis',
      'Dispensa de obrigações acessórias complexas',
      'Parcelamento facilitado de débitos'
    ],
    desvantagens: [
      'Limite de faturamento de R$ 4,8 milhões',
      'Vedações para algumas atividades',
      'Não gera créditos de PIS/COFINS',
      'Folha alta pode aumentar carga (Fator R)',
      'Sublimite estadual/municipal pode restringir'
    ],
    ideal: [
      'Comércio varejista',
      'Pequenos prestadores de serviços',
      'Empresas com margens apertadas',
      'Negócios sem créditos tributários relevantes'
    ],
    alerta: 'Fique atento ao Fator R se for prestadora de serviços!'
  },
  {
    id: 'presumido',
    nome: 'Lucro Presumido',
    emoji: '🟡',
    cor: 'yellow',
    resumo: 'Para empresas com receita até R$ 78 milhões/ano e margens de lucro elevadas',
    limiteReceita: 'Até R$ 78.000.000/ano',
    complexidade: 'Média',
    obrigacoes: 'Moderadas (DCTF, EFD-Contribuições)',
    vantagens: [
      'Presunção de lucro favorável (8% a 32%)',
      'Simplicidade contábil relativa',
      'Previsibilidade tributária',
      'Bom para serviços de alto valor agregado',
      'Distribuição de lucros isenta de IR',
      'Menos custoso que Lucro Real'
    ],
    desvantagens: [
      'Não aproveita créditos de PIS/COFINS',
      'Tributa receita, não lucro real',
      'PIS/COFINS cumulativo (0,65% + 3%)',
      'Pode ser caro se lucro real for baixo',
      'Mais obrigações que Simples'
    ],
    ideal: [
      'Empresas com lucro real acima da presunção',
      'Prestadores de serviços profissionais',
      'Comércio com boa margem',
      'Empresas que ultrapassaram o Simples'
    ],
    alerta: 'Compare com Lucro Real se tiver muitas despesas dedutíveis!'
  },
  {
    id: 'real',
    nome: 'Lucro Real',
    emoji: '🔴',
    cor: 'red',
    resumo: 'Obrigatório acima de R$ 78 milhões ou opcional para aproveitar créditos tributários',
    limiteReceita: 'Sem limite',
    complexidade: 'Alta',
    obrigacoes: 'Extensas (ECF, SPED, EFD, LALUR)',
    vantagens: [
      'Créditos de PIS/COFINS não-cumulativo (9,25%)',
      'Tributa apenas o lucro real apurado',
      'Compensa prejuízos fiscais',
      'Obrigatório acima de R$ 78 milhões',
      'Ideal para margens baixas ou prejuízo',
      'Maior precisão tributária'
    ],
    desvantagens: [
      'Alta complexidade contábil',
      'Muitas obrigações acessórias',
      'Custos contábeis elevados',
      'Exige controle rigoroso',
      'PIS/COFINS mais alto (1,65% + 7,6%)',
      'Fiscalização mais intensa'
    ],
    ideal: [
      'Indústrias com muitos insumos',
      'Empresas com margens baixas',
      'Operações com créditos tributários',
      'Empresas acima de R$ 78 milhões'
    ],
    alerta: 'Exige escrituração contábil completa e rigorosa!'
  }
];

const COMPARATIVO = {
  tributos: [
    { nome: 'IRPJ', simples: 'Incluído no DAS', presumido: '15% + 10% adicional', real: '15% + 10% adicional' },
    { nome: 'CSLL', simples: 'Incluído no DAS', presumido: '9% sobre presunção', real: '9% sobre lucro real' },
    { nome: 'PIS', simples: 'Incluído no DAS', presumido: '0,65% cumulativo', real: '1,65% não-cumulativo' },
    { nome: 'COFINS', simples: 'Incluído no DAS', presumido: '3% cumulativo', real: '7,6% não-cumulativo' },
    { nome: 'ISS/ICMS', simples: 'Incluído no DAS', presumido: 'À parte (2% a 5%)', real: 'À parte (2% a 5%)' },
    { nome: 'Créditos', simples: 'Não', presumido: 'Não', real: 'Sim (PIS/COFINS)' }
  ],
  obrigacoes: [
    { item: 'Contabilidade', simples: 'Simplificada', presumido: 'Completa', real: 'Completa + LALUR' },
    { item: 'Obrigações Mensais', simples: 'DAS', presumido: 'DCTF, EFD-Contribuições', real: 'DCTF, EFD, ECD, ECF' },
    { item: 'Obrigações Anuais', simples: 'DEFIS', presumido: 'DCTF Anual', real: 'LALUR, ECF' },
    { item: 'Complexidade', simples: '⭐', presumido: '⭐⭐⭐', real: '⭐⭐⭐⭐⭐' },
    { item: 'Custo Contábil', simples: 'R$ 300-800/mês', presumido: 'R$ 800-2.000/mês', real: 'R$ 2.000-5.000/mês' }
  ]
};

const FLUXOGRAMA_DECISAO = [
  {
    pergunta: 'Sua receita anual é superior a R$ 4,8 milhões?',
    sim: 'next',
    nao: { resultado: 'Simples Nacional (se não houver vedações)', cor: 'green' }
  },
  {
    pergunta: 'Sua receita anual é superior a R$ 78 milhões?',
    sim: { resultado: 'Lucro Real (obrigatório)', cor: 'red' },
    nao: 'next'
  },
  {
    pergunta: 'Sua empresa tem muitas despesas dedutíveis e compra de insumos?',
    sim: { resultado: 'Lucro Real (aproveitamento de créditos)', cor: 'red' },
    nao: 'next'
  },
  {
    pergunta: 'Sua margem de lucro real está acima da presunção (8-32%)?',
    sim: { resultado: 'Lucro Presumido (favorável)', cor: 'yellow' },
    nao: { resultado: 'Lucro Real (paga menos)', cor: 'red' }
  }
];

export default function GuiaRegimes() {
  const navigate = useNavigate();
  const [regimeSelecionado, setRegimeSelecionado] = useState(null);
  const [abaSelecionada, setAbaSelecionada] = useState('visao-geral');

  const regime = REGIMES.find(r => r.id === regimeSelecionado);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Voltar para Home
          </button>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Guia Completo dos Regimes Tributários
          </h1>
          <p className="text-gray-600 text-lg">
            Entenda as diferenças entre Simples Nacional, Lucro Presumido e Lucro Real
          </p>
        </div>

        {/* Abas */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setAbaSelecionada('visao-geral')}
              className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                abaSelecionada === 'visao-geral'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📊 Visão Geral
            </button>
            <button
              onClick={() => setAbaSelecionada('comparativo')}
              className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                abaSelecionada === 'comparativo'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🔍 Comparativo
            </button>
            <button
              onClick={() => setAbaSelecionada('fluxograma')}
              className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                abaSelecionada === 'fluxograma'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🎯 Como Escolher
            </button>
          </div>

          <div className="p-8">
            {/* Aba: Visão Geral */}
            {abaSelecionada === 'visao-geral' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Conheça os 3 Regimes Tributários
                </h2>

                {/* Cards dos Regimes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {REGIMES.map((reg) => (
                    <div
                      key={reg.id}
                      className={`bg-gradient-to-br from-${reg.cor}-50 to-white rounded-xl p-6 border-2 cursor-pointer transition-all hover:shadow-xl ${
                        regimeSelecionado === reg.id
                          ? `border-${reg.cor}-500 ring-4 ring-${reg.cor}-200`
                          : 'border-gray-200'
                      }`}
                      onClick={() => setRegimeSelecionado(reg.id)}
                    >
                      <div className="text-4xl mb-3">{reg.emoji}</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{reg.nome}</h3>
                      <p className="text-gray-600 text-sm mb-4">{reg.resumo}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Limite:</span>
                          <span className="font-semibold">{reg.limiteReceita}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Complexidade:</span>
                          <span className="font-semibold">{reg.complexidade}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detalhes do Regime Selecionado */}
                {regime && (
                  <div className={`bg-gradient-to-br from-${regime.cor}-50 to-white rounded-xl p-8 border-2 border-${regime.cor}-300`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-5xl">{regime.emoji}</div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-800">{regime.nome}</h3>
                        <p className="text-gray-600">{regime.resumo}</p>
                      </div>
                    </div>

                    {/* Alerta */}
                    <div className={`bg-${regime.cor}-100 border-l-4 border-${regime.cor}-500 p-4 rounded mb-6`}>
                      <p className="font-semibold text-gray-800">⚠️ {regime.alerta}</p>
                    </div>

                    {/* Vantagens e Desvantagens */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="text-2xl">✅</span> Vantagens
                        </h4>
                        <ul className="space-y-2">
                          {regime.vantagens.map((v, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-700">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{v}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="text-2xl">⚠️</span> Desvantagens
                        </h4>
                        <ul className="space-y-2">
                          {regime.desvantagens.map((d, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-700">
                              <span className="text-red-500 mt-1">•</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Ideal Para */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🎯</span> Ideal Para
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {regime.ideal.map((i, idx) => (
                          <span
                            key={idx}
                            className={`px-4 py-2 bg-${regime.cor}-100 text-${regime.cor}-800 rounded-full font-semibold text-sm`}
                          >
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Aba: Comparativo */}
            {abaSelecionada === 'comparativo' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Comparativo de Tributos e Obrigações
                </h2>

                {/* Tabela de Tributos */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">💰 Tributos</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-3 text-left font-bold">Tributo</th>
                          <th className="border p-3 text-left font-bold">🟢 Simples</th>
                          <th className="border p-3 text-left font-bold">🟡 Presumido</th>
                          <th className="border p-3 text-left font-bold">🔴 Real</th>
                        </tr>
                      </thead>
                      <tbody>
                        {COMPARATIVO.tributos.map((tributo, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border p-3 font-semibold">{tributo.nome}</td>
                            <td className="border p-3">{tributo.simples}</td>
                            <td className="border p-3">{tributo.presumido}</td>
                            <td className="border p-3">{tributo.real}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tabela de Obrigações */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Obrigações Acessórias</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-3 text-left font-bold">Item</th>
                          <th className="border p-3 text-left font-bold">🟢 Simples</th>
                          <th className="border p-3 text-left font-bold">🟡 Presumido</th>
                          <th className="border p-3 text-left font-bold">🔴 Real</th>
                        </tr>
                      </thead>
                      <tbody>
                        {COMPARATIVO.obrigacoes.map((obg, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border p-3 font-semibold">{obg.item}</td>
                            <td className="border p-3">{obg.simples}</td>
                            <td className="border p-3">{obg.presumido}</td>
                            <td className="border p-3">{obg.real}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Aba: Fluxograma */}
            {abaSelecionada === 'fluxograma' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  🎯 Árvore de Decisão: Qual Regime Escolher?
                </h2>

                <p className="text-gray-600 mb-8">
                  Responda as perguntas abaixo para descobrir qual regime é mais adequado para sua empresa:
                </p>

                <div className="space-y-6">
                  {FLUXOGRAMA_DECISAO.map((etapa, idx) => (
                    <div key={idx} className="bg-white rounded-xl border-2 border-gray-200 p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-lg mb-4">{etapa.pergunta}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Opção SIM */}
                            {typeof etapa.sim === 'string' ? (
                              <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
                                Próxima pergunta →
                              </div>
                            ) : (
                              <div className={`bg-${etapa.sim.cor}-100 border-2 border-${etapa.sim.cor}-300 rounded-lg p-4`}>
                                <div className="font-bold text-gray-800 mb-2">✅ SIM</div>
                                <div className={`text-${etapa.sim.cor}-800 font-semibold`}>
                                  → {etapa.sim.resultado}
                                </div>
                              </div>
                            )}

                            {/* Opção NÃO */}
                            {typeof etapa.nao === 'string' ? (
                              <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
                                Próxima pergunta →
                              </div>
                            ) : (
                              <div className={`bg-${etapa.nao.cor}-100 border-2 border-${etapa.nao.cor}-300 rounded-lg p-4`}>
                                <div className="font-bold text-gray-800 mb-2">❌ NÃO</div>
                                <div className={`text-${etapa.nao.cor}-800 font-semibold`}>
                                  → {etapa.nao.resultado}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dica Final */}
                <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">💡 Dica Importante</h3>
                  <p className="text-purple-100">
                    Este fluxograma é uma orientação geral. Para decisões precisas, utilize nossas calculadoras
                    ou consulte um contador especializado. Cada empresa é única e o regime ideal depende de
                    diversos fatores: atividade, faturamento, despesas, créditos tributários e planejamento estratégico.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🧮 Calcule Agora!</h3>
          <p className="text-blue-100 mb-6">
            Use nossas calculadoras especializadas para descobrir quanto você pagaria em cada regime
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/calculadora-das')}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              🟢 Calcular Simples
            </button>
            <button
              onClick={() => navigate('/calculadora-presumido')}
              className="px-6 py-3 bg-white text-yellow-600 rounded-lg font-semibold hover:bg-yellow-50 transition"
            >
              🟡 Calcular Presumido
            </button>
            <button
              onClick={() => navigate('/calculadora-real')}
              className="px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition"
            >
              🔴 Calcular Real
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

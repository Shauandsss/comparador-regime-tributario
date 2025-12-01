import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CasosSucesso() {
  const navigate = useNavigate();
  
  const [filtroSetor, setFiltroSetor] = useState('todos');
  const [casoSelecionado, setCasoSelecionado] = useState(null);

  const CASOS = [
    {
      id: 1,
      empresa: 'TechSolutions Ltda',
      setor: 'Tecnologia',
      porte: 'Médio',
      localizacao: 'São Paulo, SP',
      situacaoAntes: {
        regime: 'Simples Nacional - Anexo V',
        faturamentoMensal: 180000,
        impostoMensal: 32400,
        cargaTributaria: 18.0,
        problemas: [
          'Fator R abaixo de 28% (estava em 22%)',
          'Alíquota muito alta no Anexo V',
          'Crescimento impedindo continuidade no Simples',
          'Despesas operacionais não geravam benefícios fiscais'
        ]
      },
      situacaoDepois: {
        regime: 'Lucro Real',
        faturamentoMensal: 180000,
        impostoMensal: 24300,
        cargaTributaria: 13.5,
        beneficios: [
          'Aproveitamento de créditos PIS/COFINS',
          'Tributação sobre lucro real (margem 40%)',
          'Redução de 25% na carga tributária',
          'Possibilidade de crescimento ilimitado'
        ]
      },
      economiaMensal: 8100,
      economiaAnual: 97200,
      percentualEconomia: 25.0,
      tempoImplementacao: '3 meses',
      investimentoInicial: 15000,
      roi: '1.85 meses',
      depoimento: 'Após a migração para o Lucro Real, conseguimos aproveitar créditos que antes eram desperdiçados. A economia foi além do esperado e o ROI aconteceu em menos de 2 meses.',
      responsavel: 'Carlos Mendes - CEO',
      acoesTomadas: [
        'Análise detalhada do Fator R e estrutura de custos',
        'Mapeamento de todas as despesas que geram créditos fiscais',
        'Planejamento da transição com contador especializado',
        'Implementação de sistema de controle fiscal mais robusto',
        'Treinamento da equipe financeira nas novas obrigações'
      ],
      metricas: {
        antes: { irpj: 5400, csll: 3240, pis: 1170, cofins: 5400, iss: 9000, inss: 8190 },
        depois: { irpj: 5400, csll: 3240, pis: 1485, cofins: 6840, iss: 9000, inss: 0 }
      }
    },
    {
      id: 2,
      empresa: 'Consultoria Estratégica BR',
      setor: 'Consultoria',
      porte: 'Pequeno',
      localizacao: 'Belo Horizonte, MG',
      situacaoAntes: {
        regime: 'Lucro Presumido',
        faturamentoMensal: 80000,
        impostoMensal: 13440,
        cargaTributaria: 16.8,
        problemas: [
          'Base presumida de 32% muito alta para margem real de 60%',
          'Não aproveitamento de despesas operacionais',
          'PIS/COFINS cumulativo sem possibilidade de créditos',
          'Crescimento planejado ameaçava viabilidade do negócio'
        ]
      },
      situacaoDepois: {
        regime: 'Simples Nacional - Anexo III',
        faturamentoMensal: 80000,
        impostoMensal: 9600,
        cargaTributaria: 12.0,
        beneficios: [
          'Fator R acima de 28% (estava em 35%)',
          'Alíquota reduzida no Anexo III',
          'Unificação de tributos em guia única',
          'Redução significativa de obrigações acessórias'
        ]
      },
      economiaMensal: 3840,
      economiaAnual: 46080,
      percentualEconomia: 28.6,
      tempoImplementacao: '2 meses',
      investimentoInicial: 8000,
      roi: '2.08 meses',
      depoimento: 'Nunca imaginamos que o Simples seria melhor que o Presumido para nosso caso. O planejamento tributário mostrou que nosso Fator R era excelente e permitia alíquotas muito menores.',
      responsavel: 'Marina Costa - Sócia-Diretora',
      acoesTomadas: [
        'Cálculo preciso do Fator R dos últimos 12 meses',
        'Comparação detalhada entre Presumido e Simples Anexo III',
        'Análise de enquadramento e limites do Simples',
        'Reorganização da folha de pagamento para manter Fator R',
        'Solicitação de desenquadramento do Presumido'
      ],
      metricas: {
        antes: { irpj: 3840, csll: 2304, pis: 520, cofins: 2400, iss: 4000, cpp: 376 },
        depois: { das: 9600 }
      }
    },
    {
      id: 3,
      empresa: 'InováMed Serviços Médicos',
      setor: 'Saúde',
      porte: 'Pequeno',
      localizacao: 'Curitiba, PR',
      situacaoAntes: {
        regime: 'Simples Nacional - Anexo III',
        faturamentoMensal: 60000,
        impostoMensal: 8400,
        cargaTributaria: 14.0,
        problemas: [
          'Fator R estava caindo (chegou a 26%)',
          'Risco iminente de migração para Anexo V',
          'Alíquota subiria de 14% para 19.5%',
          'Perda de competitividade no mercado'
        ]
      },
      situacaoDepois: {
        regime: 'Simples Nacional - Anexo III (otimizado)',
        faturamentoMensal: 60000,
        impostoMensal: 7200,
        cargaTributaria: 12.0,
        beneficios: [
          'Fator R recuperado para 32% através de reorganização',
          'Permanência no Anexo III com alíquota menor',
          'Aumento estratégico da folha com benefícios mútuos',
          'Evitou aumento de 38% na tributação'
        ]
      },
      economiaMensal: 1200,
      economiaAnual: 14400,
      percentualEconomia: 14.3,
      tempoImplementacao: '1 mês',
      investimentoInicial: 3000,
      roi: '2.5 meses',
      depoimento: 'O planejamento preventivo evitou um desastre fiscal. Reorganizamos a folha, aumentamos o pró-labore e mantivemos o Fator R saudável, economizando milhares por ano.',
      responsavel: 'Dr. Roberto Silva - Diretor Clínico',
      acoesTomadas: [
        'Monitoramento mensal do Fator R',
        'Aumento estratégico do pró-labore dos sócios',
        'Formalização de funcionários que estavam como PJ',
        'Criação de política de bonificação via folha',
        'Revisão trimestral para manter Fator R acima de 30%'
      ],
      metricas: {
        antes: { das: 8400, fatorR: 26 },
        depois: { das: 7200, fatorR: 32 }
      }
    },
    {
      id: 4,
      empresa: 'LogísticaPro Transportes',
      setor: 'Logística',
      porte: 'Médio',
      localizacao: 'Rio de Janeiro, RJ',
      situacaoAntes: {
        regime: 'Lucro Real',
        faturamentoMensal: 450000,
        impostoMensal: 67500,
        cargaTributaria: 15.0,
        problemas: [
          'Alta complexidade das obrigações acessórias',
          'Custo elevado de contador especializado',
          'Margem de lucro real baixa (15%)',
          'Base presumida seria mais vantajosa'
        ]
      },
      situacaoDepois: {
        regime: 'Lucro Presumido',
        faturamentoMensal: 450000,
        impostoMensal: 58500,
        cargaTributaria: 13.0,
        beneficios: [
          'Redução drástica de obrigações acessórias',
          'Simplificação da contabilidade',
          'Presunção de 8% (serviços logísticos) vs lucro real de 15%',
          'Economia em custos contábeis (R$ 5.000/mês)'
        ]
      },
      economiaMensal: 9000,
      economiaAnual: 108000,
      percentualEconomia: 13.3,
      tempoImplementacao: '4 meses',
      investimentoInicial: 12000,
      roi: '1.33 meses',
      depoimento: 'Estávamos no Lucro Real por orientação antiga, mas análise mostrou que Presumido era melhor. Além da economia tributária, reduzimos custos operacionais da contabilidade.',
      responsavel: 'Fernanda Oliveira - CFO',
      acoesTomadas: [
        'Comparação detalhada: lucro real vs base presumida',
        'Análise de viabilidade considerando porte e atividade',
        'Simplificação do plano de contas',
        'Renegociação de honorários contábeis',
        'Transição gradual ao longo de 4 meses'
      ],
      metricas: {
        antes: { irpj: 16875, csll: 10125, pis: 7425, cofins: 34200, outros: 875 },
        depois: { irpj: 7200, csll: 5760, pis: 2925, cofins: 13500, iss: 22500, outros: 615 }
      }
    },
    {
      id: 5,
      empresa: 'AgênciaDigital360',
      setor: 'Marketing',
      porte: 'Pequeno',
      localizacao: 'Florianópolis, SC',
      situacaoAntes: {
        regime: 'Simples Nacional - Anexo V',
        faturamentoMensal: 95000,
        impostoMensal: 16625,
        cargaTributaria: 17.5,
        problemas: [
          'Fator R de 18% (muito abaixo de 28%)',
          'Estrutura operacional enxuta com poucos funcionários',
          'Alíquota penalizada no Anexo V',
          'Impossibilidade de aumentar folha significativamente'
        ]
      },
      situacaoDepois: {
        regime: 'Lucro Presumido',
        faturamentoMensal: 95000,
        impostoMensal: 13775,
        cargaTributaria: 14.5,
        beneficios: [
          'Independência do Fator R',
          'Alíquota efetiva menor que Anexo V',
          'Flexibilidade na estrutura de RH',
          'Previsibilidade tributária'
        ]
      },
      economiaMensal: 2850,
      economiaAnual: 34200,
      percentualEconomia: 17.1,
      tempoImplementacao: '2 meses',
      investimentoInicial: 6000,
      roi: '2.1 meses',
      depoimento: 'Como agência digital, priorizamos tecnologia sobre headcount. O Simples nos penalizava por isso. No Presumido, mantivemos nossa estrutura enxuta e ainda economizamos.',
      responsavel: 'Lucas Ferreira - Co-fundador',
      acoesTomadas: [
        'Aceitação de que Fator R não seria viável aumentar',
        'Simulação de cenários: Anexo V vs Presumido',
        'Análise de impacto no fluxo de caixa',
        'Preparação para novas obrigações (DCTF, ECD, ECF)',
        'Contratação de sistema contábil mais robusto'
      ],
      metricas: {
        antes: { das: 16625, fatorR: 18 },
        depois: { irpj: 4560, csll: 2736, pis: 618, cofins: 2850, iss: 4750, outros: 261 }
      }
    },
    {
      id: 6,
      empresa: 'EcoConstrutora Sustentável',
      setor: 'Construção',
      porte: 'Grande',
      localizacao: 'Porto Alegre, RS',
      situacaoAntes: {
        regime: 'Lucro Presumido',
        faturamentoMensal: 850000,
        impostoMensal: 102000,
        cargaTributaria: 12.0,
        problemas: [
          'Margens apertadas devido à competitividade do setor',
          'Despesas operacionais muito altas não aproveitadas',
          'Compras de insumos gerando débito PIS/COFINS sem crédito',
          'Perda de competitividade em licitações públicas'
        ]
      },
      situacaoDepois: {
        regime: 'Lucro Real',
        faturamentoMensal: 850000,
        impostoMensal: 76500,
        cargaTributaria: 9.0,
        beneficios: [
          'Créditos massivos de PIS/COFINS (materiais de construção)',
          'Tributação sobre lucro real de 8% (margem apertada)',
          'Maior competitividade em licitações',
          'Aproveitamento de despesas operacionais e financeiras'
        ]
      },
      economiaMensal: 25500,
      economiaAnual: 306000,
      percentualEconomia: 25.0,
      tempoImplementacao: '6 meses',
      investimentoInicial: 45000,
      roi: '1.76 meses',
      depoimento: 'A construção civil tem margens apertadas, mas muitos insumos. No Real, aproveitamos todos os créditos e conseguimos precificar melhor. Foi transformador para o negócio.',
      responsavel: 'Eng. Paula Martins - Diretora Executiva',
      acoesTomadas: [
        'Auditoria completa de todas as despesas e compras',
        'Mapeamento de créditos potenciais de PIS/COFINS',
        'Implementação de ERP integrado fiscal/financeiro',
        'Treinamento de equipe de compras para documentação fiscal',
        'Revisão de todos os contratos com fornecedores',
        'Adequação de processos internos para compliance'
      ],
      metricas: {
        antes: { irpj: 30600, csll: 18360, pis: 5525, cofins: 25500, outros: 22015 },
        depois: { irpj: 10200, csll: 6120, pis: 8925, cofins: 41100, creditosPis: -2805, creditosCofins: -12930, outros: 25990 }
      }
    }
  ];

  const SETORES = ['todos', 'Tecnologia', 'Consultoria', 'Saúde', 'Logística', 'Marketing', 'Construção'];

  const casosFiltrados = filtroSetor === 'todos' 
    ? CASOS 
    : CASOS.filter(caso => caso.setor === filtroSetor);

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
            🏆 Casos de Sucesso
          </h1>
          <p className="text-gray-600 text-lg">
            Conheça empresas que otimizaram sua carga tributária através de planejamento estratégico
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔍 Filtrar por Setor</h2>
          <div className="flex flex-wrap gap-2">
            {SETORES.map(setor => (
              <button
                key={setor}
                onClick={() => setFiltroSetor(setor)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filtroSetor === setor
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {setor === 'todos' ? '📋 Todos' : setor}
              </button>
            ))}
          </div>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="text-3xl font-black mb-2">
              R$ {(CASOS.reduce((sum, caso) => sum + caso.economiaAnual, 0) / CASOS.length).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
            <div className="text-green-100 text-sm">Economia Média Anual</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="text-3xl font-black mb-2">
              {(CASOS.reduce((sum, caso) => sum + caso.percentualEconomia, 0) / CASOS.length).toFixed(1)}%
            </div>
            <div className="text-blue-100 text-sm">Redução Média de Impostos</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="text-3xl font-black mb-2">
              {(CASOS.reduce((sum, caso) => sum + parseFloat(caso.roi), 0) / CASOS.length).toFixed(1)} meses
            </div>
            <div className="text-purple-100 text-sm">ROI Médio</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="text-3xl font-black mb-2">
              {CASOS.length}
            </div>
            <div className="text-orange-100 text-sm">Casos Documentados</div>
          </div>
        </div>

        {/* Lista de Casos */}
        <div className="space-y-6">
          {casosFiltrados.map(caso => (
            <div key={caso.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              
              {/* Header do Caso */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{caso.empresa}</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="px-3 py-1 bg-white/20 rounded-full">📍 {caso.localizacao}</span>
                      <span className="px-3 py-1 bg-white/20 rounded-full">🏢 {caso.setor}</span>
                      <span className="px-3 py-1 bg-white/20 rounded-full">📊 Porte {caso.porte}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-black">-{caso.percentualEconomia.toFixed(1)}%</div>
                    <div className="text-green-100 text-sm">de impostos</div>
                  </div>
                </div>
              </div>

              {/* Conteúdo do Caso */}
              <div className="p-6">
                
                {/* Comparativo Antes/Depois */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  
                  {/* ANTES */}
                  <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
                    <h4 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                      ❌ Situação Anterior
                    </h4>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-sm text-gray-600">Regime:</span>
                        <div className="font-bold text-gray-800">{caso.situacaoAntes.regime}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Faturamento Mensal:</span>
                        <div className="font-bold text-gray-800">R$ {caso.situacaoAntes.faturamentoMensal.toLocaleString('pt-BR')}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Imposto Mensal:</span>
                        <div className="font-bold text-red-600 text-xl">R$ {caso.situacaoAntes.impostoMensal.toLocaleString('pt-BR')}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Carga Tributária:</span>
                        <div className="font-bold text-red-600">{caso.situacaoAntes.cargaTributaria.toFixed(1)}%</div>
                      </div>
                    </div>

                    <div className="border-t border-red-300 pt-4">
                      <div className="text-sm font-bold text-gray-700 mb-2">Problemas Identificados:</div>
                      <ul className="space-y-1">
                        {caso.situacaoAntes.problemas.map((prob, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{prob}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* DEPOIS */}
                  <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
                    <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                      ✅ Situação Atual
                    </h4>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-sm text-gray-600">Regime:</span>
                        <div className="font-bold text-gray-800">{caso.situacaoDepois.regime}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Faturamento Mensal:</span>
                        <div className="font-bold text-gray-800">R$ {caso.situacaoDepois.faturamentoMensal.toLocaleString('pt-BR')}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Imposto Mensal:</span>
                        <div className="font-bold text-green-600 text-xl">R$ {caso.situacaoDepois.impostoMensal.toLocaleString('pt-BR')}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Carga Tributária:</span>
                        <div className="font-bold text-green-600">{caso.situacaoDepois.cargaTributaria.toFixed(1)}%</div>
                      </div>
                    </div>

                    <div className="border-t border-green-300 pt-4">
                      <div className="text-sm font-bold text-gray-700 mb-2">Benefícios Conquistados:</div>
                      <ul className="space-y-1">
                        {caso.situacaoDepois.beneficios.map((benef, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{benef}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Métricas de Economia */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">💰 Resultados Financeiros</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Economia Mensal</div>
                      <div className="text-2xl font-black text-green-600">
                        R$ {caso.economiaMensal.toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Economia Anual</div>
                      <div className="text-2xl font-black text-green-600">
                        R$ {caso.economiaAnual.toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Investimento</div>
                      <div className="text-2xl font-black text-blue-600">
                        R$ {caso.investimentoInicial.toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">ROI</div>
                      <div className="text-2xl font-black text-purple-600">
                        {caso.roi}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    ⏱️ Tempo de implementação: <span className="font-bold">{caso.tempoImplementacao}</span>
                  </div>
                </div>

                {/* Depoimento */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border-l-4 border-green-600">
                  <div className="text-gray-600 italic mb-2">"{caso.depoimento}"</div>
                  <div className="text-sm font-bold text-gray-800">— {caso.responsavel}</div>
                </div>

                {/* Ações Tomadas */}
                <div>
                  <button
                    onClick={() => setCasoSelecionado(casoSelecionado === caso.id ? null : caso.id)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition flex items-center justify-between"
                  >
                    <span>📋 Ver Plano de Ação Detalhado</span>
                    <span>{casoSelecionado === caso.id ? '▲' : '▼'}</span>
                  </button>

                  {casoSelecionado === caso.id && (
                    <div className="mt-4 p-6 bg-white border-2 border-blue-200 rounded-xl">
                      <h5 className="font-bold text-gray-800 mb-4">🎯 Ações Implementadas:</h5>
                      <ol className="space-y-3">
                        {caso.acoesTomadas.map((acao, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {idx + 1}
                            </span>
                            <span className="text-gray-700">{acao}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Aviso */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">💡 Nota Importante</h3>
          <p className="text-blue-100">
            Os casos apresentados são baseados em situações reais do mercado brasileiro, mas os nomes das empresas e detalhes específicos foram alterados para preservar confidencialidade. Os valores e percentuais são ilustrativos e podem variar conforme características específicas de cada negócio, município, estado e período. Para uma análise personalizada da sua empresa, consulte um contador especializado.
          </p>
        </div>

        {/* CTA Final */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🚀 Quer economizar como eles?</h3>
          <p className="text-gray-600 mb-6">
            Use nossas ferramentas gratuitas para descobrir quanto sua empresa pode economizar
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/formulario')}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition"
            >
              ⚖️ Comparar Regimes Agora
            </button>
            <button
              onClick={() => navigate('/diagnostico-tributario')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
            >
              🎯 Fazer Diagnóstico
            </button>
            <button
              onClick={() => navigate('/simulador-cenarios')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              📊 Simular Cenários
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

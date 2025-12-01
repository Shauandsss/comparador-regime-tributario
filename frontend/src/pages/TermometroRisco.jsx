import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Checklist de 15 itens de risco fiscal
const CHECKLIST_RISCO = [
  {
    id: 1,
    categoria: 'Conformidade',
    pergunta: 'Empresa entrega todas as obrigações acessórias em dia (DCTF, EFD, SPED)?',
    peso: 8,
    risco: 'alto'
  },
  {
    id: 2,
    categoria: 'Conformidade',
    pergunta: 'Possui certificado digital válido e atualizado?',
    peso: 4,
    risco: 'baixo'
  },
  {
    id: 3,
    categoria: 'Conformidade',
    pergunta: 'Emite notas fiscais para todas as operações?',
    peso: 10,
    risco: 'alto'
  },
  {
    id: 4,
    categoria: 'Planejamento',
    pergunta: 'Faz planejamento tributário anual com contador?',
    peso: 6,
    risco: 'medio'
  },
  {
    id: 5,
    categoria: 'Planejamento',
    pergunta: 'Revisa o enquadramento tributário periodicamente?',
    peso: 7,
    risco: 'medio'
  },
  {
    id: 6,
    categoria: 'Planejamento',
    pergunta: 'Tem controle das receitas por atividade/CNAE?',
    peso: 5,
    risco: 'medio'
  },
  {
    id: 7,
    categoria: 'Documentação',
    pergunta: 'Arquiva documentos fiscais por pelo menos 5 anos?',
    peso: 7,
    risco: 'alto'
  },
  {
    id: 8,
    categoria: 'Documentação',
    pergunta: 'Possui controle de estoque (se aplicável)?',
    peso: 6,
    risco: 'medio'
  },
  {
    id: 9,
    categoria: 'Documentação',
    pergunta: 'Mantém backup de dados contábeis e fiscais?',
    peso: 5,
    risco: 'medio'
  },
  {
    id: 10,
    categoria: 'Pagamentos',
    pergunta: 'Paga impostos em dia sem atrasos?',
    peso: 9,
    risco: 'alto'
  },
  {
    id: 11,
    categoria: 'Pagamentos',
    pergunta: 'Tem controle de fluxo de caixa para provisionar tributos?',
    peso: 6,
    risco: 'medio'
  },
  {
    id: 12,
    categoria: 'Folha',
    pergunta: 'Recolhe INSS e FGTS dos funcionários corretamente?',
    peso: 8,
    risco: 'alto'
  },
  {
    id: 13,
    categoria: 'Folha',
    pergunta: 'Possui todos os colaboradores formalizados?',
    peso: 9,
    risco: 'alto'
  },
  {
    id: 14,
    categoria: 'Operacional',
    pergunta: 'Separa contas pessoais das contas da empresa (PJ/PF)?',
    peso: 7,
    risco: 'medio'
  },
  {
    id: 15,
    categoria: 'Operacional',
    pergunta: 'Tem assessoria contábil ativa e consultiva?',
    peso: 5,
    risco: 'baixo'
  }
];

// Faixas de score
const FAIXAS_SCORE = [
  {
    min: 0,
    max: 40,
    nivel: 'Crítico',
    cor: 'red',
    emoji: '🚨',
    descricao: 'Risco fiscal muito alto! Ação imediata necessária.',
    gradiente: 'from-red-600 to-red-700'
  },
  {
    min: 41,
    max: 60,
    nivel: 'Alto',
    cor: 'orange',
    emoji: '⚠️',
    descricao: 'Risco fiscal elevado. Melhorias urgentes recomendadas.',
    gradiente: 'from-orange-500 to-orange-600'
  },
  {
    min: 61,
    max: 75,
    nivel: 'Moderado',
    cor: 'yellow',
    emoji: '⚡',
    descricao: 'Risco fiscal moderado. Atenção a alguns pontos.',
    gradiente: 'from-yellow-500 to-yellow-600'
  },
  {
    min: 76,
    max: 90,
    nivel: 'Baixo',
    cor: 'green',
    emoji: '✅',
    descricao: 'Risco fiscal controlado. Continue mantendo as boas práticas.',
    gradiente: 'from-green-500 to-green-600'
  },
  {
    min: 91,
    max: 100,
    nivel: 'Excelente',
    cor: 'emerald',
    emoji: '🏆',
    descricao: 'Parabéns! Sua empresa está em excelente conformidade fiscal.',
    gradiente: 'from-emerald-500 to-emerald-600'
  }
];

export default function TermometroRisco() {
  const navigate = useNavigate();
  
  const [respostas, setRespostas] = useState({});
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [score, setScore] = useState(0);
  const [faixa, setFaixa] = useState(null);
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [progressoPorCategoria, setProgressoPorCategoria] = useState({});
  
  // Atualiza resposta
  const handleResposta = (id, valor) => {
    setRespostas(prev => ({
      ...prev,
      [id]: valor
    }));
  };
  
  // Calcula score
  const calcularScore = () => {
    let pontos = 0;
    let pontosPossiveis = 0;
    
    CHECKLIST_RISCO.forEach(item => {
      pontosPossiveis += item.peso;
      if (respostas[item.id] === true) {
        pontos += item.peso;
      }
    });
    
    const scoreCalculado = Math.round((pontos / pontosPossiveis) * 100);
    setScore(scoreCalculado);
    
    // Determina faixa
    const faixaEncontrada = FAIXAS_SCORE.find(
      f => scoreCalculado >= f.min && scoreCalculado <= f.max
    );
    setFaixa(faixaEncontrada);
    
    // Calcula progresso por categoria
    const categorias = {};
    CHECKLIST_RISCO.forEach(item => {
      if (!categorias[item.categoria]) {
        categorias[item.categoria] = { total: 0, acertos: 0, peso: 0 };
      }
      categorias[item.categoria].total++;
      categorias[item.categoria].peso += item.peso;
      if (respostas[item.id] === true) {
        categorias[item.categoria].acertos++;
      }
    });
    
    const progressoCalc = {};
    Object.keys(categorias).forEach(cat => {
      const { acertos, total } = categorias[cat];
      progressoCalc[cat] = Math.round((acertos / total) * 100);
    });
    setProgressoPorCategoria(progressoCalc);
    
    // Gera recomendações
    gerarRecomendacoes(scoreCalculado);
    
    setMostrarResultado(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Gera recomendações baseadas no score
  const gerarRecomendacoes = (scoreAtual) => {
    const recs = [];
    
    // Identifica itens não conformes
    const itensNaoConformes = CHECKLIST_RISCO.filter(
      item => respostas[item.id] === false || respostas[item.id] === undefined
    ).sort((a, b) => b.peso - a.peso); // Ordena por peso decrescente
    
    // Recomendação geral
    if (scoreAtual < 60) {
      recs.push({
        tipo: 'urgente',
        titulo: 'Ação Imediata Necessária',
        descricao: 'Seu score está em zona crítica. Contrate um contador especializado e regularize as pendências urgentemente para evitar multas e autuações.',
        icone: '🚨'
      });
    } else if (scoreAtual < 75) {
      recs.push({
        tipo: 'importante',
        titulo: 'Melhorias Recomendadas',
        descricao: 'Há pontos importantes que precisam de atenção. Revise os itens não conformes com seu contador.',
        icone: '⚠️'
      });
    } else if (scoreAtual < 90) {
      recs.push({
        tipo: 'atencao',
        titulo: 'Bom Caminho',
        descricao: 'Você está bem encaminhado! Ajuste os últimos detalhes para alcançar excelência fiscal.',
        icone: '✅'
      });
    } else {
      recs.push({
        tipo: 'parabens',
        titulo: 'Parabéns pela Conformidade!',
        descricao: 'Sua empresa demonstra excelente gestão fiscal. Continue com as boas práticas e revisões periódicas.',
        icone: '🏆'
      });
    }
    
    // Recomendações específicas por prioridade
    const itensAltoRisco = itensNaoConformes.filter(i => i.risco === 'alto');
    if (itensAltoRisco.length > 0) {
      recs.push({
        tipo: 'urgente',
        titulo: `${itensAltoRisco.length} Item(ns) de Alto Risco`,
        descricao: `Priorize: ${itensAltoRisco.map(i => i.pergunta.split('?')[0]).join(', ')}.`,
        icone: '🔴'
      });
    }
    
    // Recomendação por categoria com mais problemas
    const categoriasComProblemas = Object.entries(progressoPorCategoria)
      .filter(([_, prog]) => prog < 70)
      .sort((a, b) => a[1] - b[1]);
    
    if (categoriasComProblemas.length > 0) {
      const [catPior, progresso] = categoriasComProblemas[0];
      recs.push({
        tipo: 'importante',
        titulo: `Atenção na categoria "${catPior}"`,
        descricao: `Esta categoria está com apenas ${progresso}% de conformidade. Foque em melhorar estes controles.`,
        icone: '📋'
      });
    }
    
    // Recomendações específicas
    if (respostas[10] === false) {
      recs.push({
        tipo: 'urgente',
        titulo: 'Atraso nos Pagamentos de Impostos',
        descricao: 'Débitos em atraso geram multas e juros. Negocie parcelamentos se necessário e evite bloqueios de CNPJ.',
        icone: '💰'
      });
    }
    
    if (respostas[3] === false) {
      recs.push({
        tipo: 'atencao',
        titulo: 'Emissão de Notas Fiscais',
        descricao: 'A não emissão de notas pode configurar sonegação. Regularize imediatamente todas as operações.',
        icone: '📄'
      });
    }
    
    if (respostas[13] === false) {
      recs.push({
        tipo: 'urgente',
        titulo: 'Funcionários Informais',
        descricao: 'Trabalhar com pessoal não formalizado é alto risco trabalhista e previdenciário. Formalize todos os vínculos.',
        icone: '👥'
      });
    }
    
    setRecomendacoes(recs);
  };
  
  // Reseta avaliação
  const resetar = () => {
    setRespostas({});
    setMostrarResultado(false);
    setScore(0);
    setFaixa(null);
    setRecomendacoes([]);
    setProgressoPorCategoria({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Agrupa por categoria
  const itemsPorCategoria = CHECKLIST_RISCO.reduce((acc, item) => {
    if (!acc[item.categoria]) acc[item.categoria] = [];
    acc[item.categoria].push(item);
    return acc;
  }, {});
  
  // Calcula progresso total
  const respostasTotal = Object.keys(respostas).length;
  const progressoGeral = Math.round((respostasTotal / CHECKLIST_RISCO.length) * 100);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-red-600 hover:text-red-800 mb-4 flex items-center gap-2"
          >
            ← Voltar para Home
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🌡️ Termômetro de Risco Fiscal
          </h1>
          <p className="text-gray-600 text-lg">
            Avalie o nível de conformidade fiscal da sua empresa
          </p>
        </div>
        
        {/* Resultado */}
        {mostrarResultado && faixa && (
          <div className="mb-8 space-y-6">
            
            {/* Score Principal */}
            <div className={`bg-gradient-to-br ${faixa.gradiente} text-white rounded-2xl shadow-2xl p-8`}>
              <div className="text-center mb-6">
                <div className="text-8xl mb-4">{faixa.emoji}</div>
                <h2 className="text-4xl font-black mb-2">Score: {score}/100</h2>
                <p className="text-2xl font-bold mb-2">Risco {faixa.nivel}</p>
                <p className="text-white/90 text-lg">{faixa.descricao}</p>
              </div>
              
              {/* Barra de progresso circular */}
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="white"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - score / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black">{score}%</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={resetar}
                className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-lg font-semibold transition-all backdrop-blur"
              >
                🔄 Refazer Avaliação
              </button>
            </div>
            
            {/* Progresso por Categoria */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">📊 Análise por Categoria</h3>
              
              <div className="space-y-4">
                {Object.entries(progressoPorCategoria).map(([cat, prog]) => (
                  <div key={cat}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">{cat}</span>
                      <span className={`font-bold ${
                        prog >= 80 ? 'text-green-600' :
                        prog >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {prog}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-full rounded-full transition-all ${
                          prog >= 80 ? 'bg-green-500' :
                          prog >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${prog}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recomendações */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">💡 Recomendações Personalizadas</h3>
              
              <div className="space-y-4">
                {recomendacoes.map((rec, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-6 border-2 ${
                      rec.tipo === 'urgente' ? 'bg-red-50 border-red-300' :
                      rec.tipo === 'importante' ? 'bg-orange-50 border-orange-300' :
                      rec.tipo === 'atencao' ? 'bg-yellow-50 border-yellow-300' :
                      'bg-green-50 border-green-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{rec.icone}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2 text-gray-800">{rec.titulo}</h4>
                        <p className="text-gray-700 leading-relaxed">{rec.descricao}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        )}
        
        {/* Checklist */}
        {!mostrarResultado && (
          <>
            {/* Progresso */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-800">Progresso da Avaliação</span>
                <span className="text-xl font-bold text-blue-600">
                  {respostasTotal}/{CHECKLIST_RISCO.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${progressoGeral}%` }}
                ></div>
              </div>
            </div>
            
            {/* Questões por Categoria */}
            <div className="space-y-6">
              {Object.entries(itemsPorCategoria).map(([categoria, items]) => (
                <div key={categoria} className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    📋 {categoria}
                  </h3>
                  
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          respostas[item.id] === true ? 'bg-green-50 border-green-300' :
                          respostas[item.id] === false ? 'bg-red-50 border-red-300' :
                          'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 mb-2">
                              {item.pergunta}
                            </p>
                            <div className="flex items-center gap-3 text-sm">
                              <span className={`px-3 py-1 rounded-full font-semibold ${
                                item.risco === 'alto' ? 'bg-red-100 text-red-800' :
                                item.risco === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                Risco {item.risco === 'alto' ? 'Alto' : item.risco === 'medio' ? 'Médio' : 'Baixo'}
                              </span>
                              <span className="text-gray-500">
                                Peso: {item.peso}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleResposta(item.id, true)}
                              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                respostas[item.id] === true
                                  ? 'bg-green-600 text-white shadow-lg scale-105'
                                  : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                              }`}
                            >
                              ✅ Sim
                            </button>
                            <button
                              onClick={() => handleResposta(item.id, false)}
                              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                respostas[item.id] === false
                                  ? 'bg-red-600 text-white shadow-lg scale-105'
                                  : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                              }`}
                            >
                              ❌ Não
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Botão Calcular */}
            <div className="sticky bottom-6 mt-8">
              <button
                onClick={calcularScore}
                disabled={respostasTotal < CHECKLIST_RISCO.length}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-5 px-6 rounded-xl font-bold text-xl hover:from-red-700 hover:to-orange-700 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {respostasTotal < CHECKLIST_RISCO.length
                  ? `Responda todas as questões (${respostasTotal}/${CHECKLIST_RISCO.length})`
                  : '🌡️ Calcular Score de Risco'}
              </button>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}

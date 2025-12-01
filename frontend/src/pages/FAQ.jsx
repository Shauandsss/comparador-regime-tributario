import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIAS_FAQ = [
  {
    id: 'simples',
    nome: 'Simples Nacional',
    emoji: '🟢',
    cor: 'green'
  },
  {
    id: 'presumido',
    nome: 'Lucro Presumido',
    emoji: '🟡',
    cor: 'yellow'
  },
  {
    id: 'real',
    nome: 'Lucro Real',
    emoji: '🔴',
    cor: 'red'
  },
  {
    id: 'geral',
    nome: 'Geral',
    emoji: '💼',
    cor: 'blue'
  }
];

const PERGUNTAS = [
  // SIMPLES NACIONAL
  {
    id: 1,
    categoria: 'simples',
    pergunta: 'Como funciona o Simples Nacional?',
    resposta: 'O Simples Nacional é um regime tributário simplificado que unifica até 8 impostos em uma única guia mensal (DAS): IRPJ, CSLL, PIS, COFINS, IPI, ICMS, ISS e CPP. A alíquota é progressiva e varia conforme o faturamento acumulado dos últimos 12 meses e o anexo da atividade (I a V).',
    tags: ['básico', 'DAS', 'tributação']
  },
  {
    id: 2,
    categoria: 'simples',
    pergunta: 'Qual o limite de faturamento do Simples Nacional?',
    resposta: 'O limite anual é de R$ 4.800.000,00 (R$ 400 mil/mês em média). Empresas que ultrapassarem esse valor devem migrar para outro regime no ano seguinte. Há também sublimites estaduais (R$ 3,6 milhões para ICMS) e municipais (R$ 3,6 milhões para ISS) em alguns estados/municípios.',
    tags: ['limite', 'desenquadramento', 'faturamento']
  },
  {
    id: 3,
    categoria: 'simples',
    pergunta: 'O que é o Fator R e como ele me afeta?',
    resposta: 'O Fator R é a relação entre folha de pagamento (incluindo pró-labore e encargos) e receita bruta dos últimos 12 meses. Se for ≥28%, empresas de serviços enquadram-se no Anexo III (alíquotas menores). Se <28%, vão para o Anexo V (alíquotas maiores). É crucial para prestadores de serviços manterem folha adequada.',
    tags: ['fator r', 'anexos', 'folha']
  },
  {
    id: 4,
    categoria: 'simples',
    pergunta: 'Posso optar pelo Simples se tiver sócio pessoa jurídica?',
    resposta: 'Não. Uma das vedações do Simples Nacional é ter sócio pessoa jurídica (exceto em casos específicos permitidos por lei). A empresa também não pode ser filial, sucursal ou matriz de empresa no exterior.',
    tags: ['vedações', 'requisitos', 'sócios']
  },
  {
    id: 5,
    categoria: 'simples',
    pergunta: 'Como calcular o DAS corretamente?',
    resposta: 'Passo 1: Some a receita bruta dos últimos 12 meses (RBT12). Passo 2: Encontre a faixa correspondente na tabela do anexo. Passo 3: Aplique a fórmula: [(RBT12 × Alíquota) - Parcela a Deduzir] / RBT12 = Alíquota Efetiva. Passo 4: Multiplique a alíquota efetiva pela receita do mês. Use nossa Calculadora DAS para facilitar!',
    tags: ['DAS', 'cálculo', 'alíquota efetiva']
  },
  {
    id: 6,
    categoria: 'simples',
    pergunta: 'Quando devo pagar o DAS?',
    resposta: 'O DAS vence todo dia 20 do mês seguinte ao faturamento. Exemplo: faturamento de janeiro deve ser pago até 20 de fevereiro. Se cair em fim de semana ou feriado, o vencimento é prorrogado para o próximo dia útil.',
    tags: ['vencimento', 'DAS', 'prazo']
  },

  // LUCRO PRESUMIDO
  {
    id: 7,
    categoria: 'presumido',
    pergunta: 'Como funciona o Lucro Presumido?',
    resposta: 'No Lucro Presumido, a base de cálculo do IRPJ e CSLL é determinada pela aplicação de percentuais de presunção sobre a receita bruta: 8% (comércio/indústria), 16% ou 32% (serviços). Isso significa que você paga impostos sobre essa "presunção de lucro", independente do lucro real. PIS e COFINS são calculados sobre o faturamento (0,65% + 3%).',
    tags: ['presunção', 'base de cálculo', 'tributação']
  },
  {
    id: 8,
    categoria: 'presumido',
    pergunta: 'Qual o limite para ser Lucro Presumido?',
    resposta: 'Empresas com receita bruta até R$ 78 milhões/ano podem optar pelo Lucro Presumido. Acima disso, são obrigadas ao Lucro Real. Algumas atividades (bancos, factoring, etc.) são vedadas e devem obrigatoriamente adotar Lucro Real.',
    tags: ['limite', 'faturamento', 'obrigatoriedade']
  },
  {
    id: 9,
    categoria: 'presumido',
    pergunta: 'Lucro Presumido é melhor que Simples?',
    resposta: 'Depende! Geralmente é vantajoso quando: 1) Faturamento acima de R$ 4,8 milhões (limite do Simples); 2) Lucro real muito superior à presunção; 3) Prestadores de serviços com Fator R baixo. Empresas com margens apertadas ou que poderiam aproveitar créditos tributários podem preferir Lucro Real. Use nosso Comparador!',
    tags: ['comparação', 'vantagem', 'escolha']
  },
  {
    id: 10,
    categoria: 'presumido',
    pergunta: 'Posso distribuir lucros sem pagar imposto?',
    resposta: 'Sim! No Lucro Presumido, os lucros distribuídos aos sócios são ISENTOS de Imposto de Renda, desde que: 1) Sejam apurados contabilmente; 2) A empresa esteja em dia com obrigações fiscais; 3) Seja feita escrituração contábil regular. Esta é uma das grandes vantagens do regime.',
    tags: ['lucros', 'distribuição', 'isenção']
  },
  {
    id: 11,
    categoria: 'presumido',
    pergunta: 'Quais são as obrigações acessórias?',
    resposta: 'Principais obrigações: DCTF (mensal), EFD-Contribuições (mensal), SPED Fiscal ICMS/IPI (mensal, se aplicável), ECD (anual), ECF (anual), DIRF (anual). É mais burocrático que Simples, mas menos que Lucro Real. Requer contador experiente.',
    tags: ['obrigações', 'SPED', 'burocracia']
  },
  {
    id: 12,
    categoria: 'presumido',
    pergunta: 'Como mudar de Simples para Presumido?',
    resposta: 'A mudança pode ocorrer por: 1) Exclusão voluntária (solicitada até janeiro, efeito no ano seguinte); 2) Ultrapassagem de limite (automática); 3) Vedação por atividade. Comunique sua Junta Comercial e Receita Federal. Prepare-se para mais obrigações contábeis e fiscais.',
    tags: ['migração', 'mudança', 'desenquadramento']
  },

  // LUCRO REAL
  {
    id: 13,
    categoria: 'real',
    pergunta: 'Como funciona o Lucro Real?',
    resposta: 'No Lucro Real, IRPJ e CSLL são calculados sobre o lucro líquido contábil real, ajustado por adições (despesas não dedutíveis) e exclusões (receitas não tributáveis) no LALUR. PIS e COFINS são não-cumulativos (1,65% + 7,6%), permitindo créditos sobre insumos, energia, aluguéis e outras despesas operacionais.',
    tags: ['LALUR', 'lucro real', 'créditos']
  },
  {
    id: 14,
    categoria: 'real',
    pergunta: 'Quando o Lucro Real é obrigatório?',
    resposta: 'Obrigatório para: 1) Receita acima de R$ 78 milhões/ano; 2) Instituições financeiras; 3) Empresas com lucros/rendimentos do exterior; 4) Factoring; 5) Empresas com benefícios fiscais específicos. Mesmo empresas menores podem optar se for vantajoso.',
    tags: ['obrigatoriedade', 'requisitos', 'faturamento']
  },
  {
    id: 15,
    categoria: 'real',
    pergunta: 'O que são créditos de PIS/COFINS?',
    resposta: 'No regime não-cumulativo do Lucro Real, você pode descontar 9,25% (1,65% PIS + 7,6% COFINS) sobre: compra de insumos, energia elétrica, aluguéis, fretes, armazenagem, entre outros. Esses créditos reduzem o valor a pagar. Ideal para indústrias e empresas com muitas despesas dedutíveis.',
    tags: ['créditos', 'PIS', 'COFINS', 'não-cumulativo']
  },
  {
    id: 16,
    categoria: 'real',
    pergunta: 'Vale a pena optar pelo Lucro Real?',
    resposta: 'Vale quando: 1) Margens de lucro baixas (menos que a presunção); 2) Muitas despesas operacionais para gerar créditos; 3) Prejuízos fiscais a compensar; 4) Indústrias com muitos insumos. Requer contabilidade rigorosa e tem alto custo operacional. Analise com contador.',
    tags: ['vantagem', 'escolha', 'comparação']
  },
  {
    id: 17,
    categoria: 'real',
    pergunta: 'Posso compensar prejuízos fiscais?',
    resposta: 'Sim! Prejuízos fiscais de períodos anteriores podem ser compensados com lucros futuros, limitado a 30% do lucro real de cada período. Essa compensação é registrada no LALUR e pode gerar economia tributária significativa em períodos lucrativos.',
    tags: ['prejuízo', 'compensação', 'LALUR']
  },
  {
    id: 18,
    categoria: 'real',
    pergunta: 'Qual a diferença entre trimestral e anual?',
    resposta: 'Lucro Real Trimestral: apuração definitiva a cada 3 meses, sem ajustes posteriores. Lucro Real Anual: apuração anual com recolhimentos mensais estimados (balancetes de suspensão/redução). O anual permite mais planejamento, mas exige controles mensais. Escolha é irretratável no ano.',
    tags: ['periodicidade', 'trimestral', 'anual']
  },

  // GERAL
  {
    id: 19,
    categoria: 'geral',
    pergunta: 'Como escolher o melhor regime tributário?',
    resposta: 'Analise: 1) Faturamento anual; 2) Margem de lucro real vs. presunção; 3) Possibilidade de créditos tributários; 4) Custo operacional/contábil; 5) Complexidade das obrigações. Use nosso Comparador para simular cenários reais. Consulte sempre um contador especializado.',
    tags: ['escolha', 'planejamento', 'comparação']
  },
  {
    id: 20,
    categoria: 'geral',
    pergunta: 'Posso mudar de regime durante o ano?',
    resposta: 'NÃO. A mudança de regime tributário só pode ocorrer no início do ano fiscal (janeiro). Exceções: desenquadramento obrigatório do Simples por ultrapassar limite ou vedação. Planeje com antecedência e faça simulações antes de decidir.',
    tags: ['mudança', 'prazo', 'migração']
  },
  {
    id: 21,
    categoria: 'geral',
    pergunta: 'O que é planejamento tributário?',
    resposta: 'Planejamento tributário é o estudo legal de alternativas para reduzir a carga tributária da empresa: escolha do regime, estruturação societária, distribuição de lucros, aproveitamento de incentivos fiscais. Diferente de sonegação (crime), o planejamento usa ferramentas legais. Essencial para competitividade!',
    tags: ['planejamento', 'elisão', 'economia']
  },
  {
    id: 22,
    categoria: 'geral',
    pergunta: 'Quanto custa um contador?',
    resposta: 'Varia por regime e complexidade: Simples (R$ 300-800/mês), Lucro Presumido (R$ 800-2.000/mês), Lucro Real (R$ 2.000-5.000/mês). Inclui escrituração, folha, impostos e obrigações acessórias. Um bom contador economiza muito mais que seu custo através de planejamento adequado.',
    tags: ['contador', 'custo', 'honorários']
  },
  {
    id: 23,
    categoria: 'geral',
    pergunta: 'O que é pró-labore e como funciona?',
    resposta: 'Pró-labore é a remuneração dos sócios que trabalham na empresa. Deve ser compatível com o mercado e ter recolhimento de INSS (11% do sócio + 20% da empresa, limitado ao teto) e IRPF (tabela progressiva). No Simples, a CPP já está no DAS. Importante para o Fator R.',
    tags: ['pró-labore', 'remuneração', 'INSS']
  },
  {
    id: 24,
    categoria: 'geral',
    pergunta: 'Como emitir nota fiscal corretamente?',
    resposta: 'Depende da atividade: NF-e (produtos/indústria), NFS-e (serviços). Configure corretamente: CFOP, NCM, CST/CSOSN, alíquotas de ICMS/ISS. No Simples, informe "Documento emitido por ME/EPP optante pelo Simples Nacional". Mantenha certificado digital válido. Erros podem gerar autuações.',
    tags: ['nota fiscal', 'NFe', 'NFSe']
  },
  {
    id: 25,
    categoria: 'geral',
    pergunta: 'O que acontece se eu atrasar impostos?',
    resposta: 'Consequências: 1) Multa de 0,33% ao dia (até 20%); 2) Juros SELIC; 3) Inscrição em dívida ativa; 4) Protesto em cartório; 5) Penhora de bens; 6) Impossibilidade de certidões negativas; 7) Exclusão do Simples. Negocie parcelamentos antes da cobrança judicial.',
    tags: ['atraso', 'multa', 'juros', 'dívida']
  },
  {
    id: 26,
    categoria: 'geral',
    pergunta: 'Preciso de certificado digital?',
    resposta: 'Sim, obrigatório para: emissão de NF-e/NFS-e, acesso ao e-CAC da Receita, entrega de declarações (SPED, DCTF, etc.), assinatura digital de documentos fiscais. Existem tipos A1 (arquivo) e A3 (cartão/token). Validade de 1 a 3 anos. Custo: R$ 150-400.',
    tags: ['certificado digital', 'e-CNPJ', 'obrigatoriedade']
  },
  {
    id: 27,
    categoria: 'geral',
    pergunta: 'Como funciona a distribuição de lucros?',
    resposta: 'Lucros podem ser distribuídos aos sócios de forma isenta de IR, desde que apurados contabilmente e a empresa esteja regular. No Simples, nem sempre há lucro contábil suficiente. No Presumido/Real, é estratégia para reduzir carga (pró-labore paga INSS e IR, lucro não). Faça com contador.',
    tags: ['lucros', 'distribuição', 'isenção', 'planejamento']
  },
  {
    id: 28,
    categoria: 'geral',
    pergunta: 'O que é regime de caixa vs. competência?',
    resposta: 'Competência: receitas/despesas reconhecidas quando ocorrem (emissão da nota). Caixa: reconhecidas no pagamento/recebimento. Para tributos, geralmente é competência (DAS, IRPJ, CSLL). PIS/COFINS podem ser caixa em alguns casos. Importante para planejamento de fluxo.',
    tags: ['contabilidade', 'regime', 'competência', 'caixa']
  },
  {
    id: 29,
    categoria: 'geral',
    pergunta: 'Vale a pena ter sócio só para dividir impostos?',
    resposta: 'Não recomendado! Incluir "sócio laranja" apenas para dividir pró-labore e reduzir impostos é fraude (simulação). Pode gerar problemas trabalhistas, previdenciários e fiscais. O planejamento tributário deve ser LEGAL. Há outras formas legítimas de reduzir carga: distribuição de lucros, regime adequado, etc.',
    tags: ['fraude', 'simulação', 'sócio', 'ética']
  },
  {
    id: 30,
    categoria: 'geral',
    pergunta: 'Como me preparar para fiscalização?',
    resposta: 'Mantenha: 1) Escrituração contábil em dia; 2) Notas fiscais arquivadas (5 anos); 3) Comprovantes de pagamento de impostos; 4) SPED e obrigações entregues; 5) Contratos e documentos societários organizados. Tenha contador presente. Não omita informações. Planeje-se para evitar problemas.',
    tags: ['fiscalização', 'documentação', 'arquivo', 'Receita']
  }
];

export default function FAQ() {
  const navigate = useNavigate();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todas');
  const [busca, setBusca] = useState('');
  const [perguntaExpandida, setPerguntaExpandida] = useState(null);

  // Filtrar perguntas
  const perguntasFiltradas = useMemo(() => {
    return PERGUNTAS.filter(p => {
      const matchCategoria = categoriaSelecionada === 'todas' || p.categoria === categoriaSelecionada;
      const matchBusca = busca === '' || 
        p.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
        p.resposta.toLowerCase().includes(busca.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(busca.toLowerCase()));
      return matchCategoria && matchBusca;
    });
  }, [categoriaSelecionada, busca]);

  const togglePergunta = (id) => {
    setPerguntaExpandida(perguntaExpandida === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-2"
          >
            ← Voltar para Home
          </button>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ❓ Perguntas Frequentes (FAQ)
          </h1>
          <p className="text-gray-600 text-lg">
            {PERGUNTAS.length} respostas para suas dúvidas mais comuns sobre tributação
          </p>
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔍 Buscar
            </label>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Digite sua dúvida (ex: DAS, limite, créditos...)"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>

          {/* Filtro por Categoria */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🏷️ Filtrar por Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoriaSelecionada('todas')}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  categoriaSelecionada === 'todas'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas ({PERGUNTAS.length})
              </button>
              {CATEGORIAS_FAQ.map(cat => {
                const count = PERGUNTAS.filter(p => p.categoria === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategoriaSelecionada(cat.id)}
                    className={`px-4 py-2 rounded-full font-semibold transition-all ${
                      categoriaSelecionada === cat.id
                        ? `bg-${cat.cor}-600 text-white`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.emoji} {cat.nome} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contador */}
          <div className="mt-4 text-center text-gray-600">
            {perguntasFiltradas.length === PERGUNTAS.length
              ? `Mostrando todas as ${PERGUNTAS.length} perguntas`
              : `${perguntasFiltradas.length} pergunta(s) encontrada(s)`}
          </div>
        </div>

        {/* Lista de Perguntas */}
        {perguntasFiltradas.length > 0 ? (
          <div className="space-y-3">
            {perguntasFiltradas.map((pergunta) => {
              const categoria = CATEGORIAS_FAQ.find(c => c.categoria === pergunta.categoria);
              const expandida = perguntaExpandida === pergunta.id;

              return (
                <div
                  key={pergunta.id}
                  className={`bg-white rounded-xl shadow-lg transition-all overflow-hidden ${
                    expandida ? 'ring-2 ring-indigo-400' : ''
                  }`}
                >
                  {/* Pergunta */}
                  <button
                    onClick={() => togglePergunta(pergunta.id)}
                    className="w-full p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-2xl mt-1">
                          {categoria?.emoji || '💼'}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {pergunta.pergunta}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {pergunta.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl text-gray-400">
                        {expandida ? '▲' : '▼'}
                      </div>
                    </div>
                  </button>

                  {/* Resposta */}
                  {expandida && (
                    <div className="px-5 pb-5 border-t border-gray-100 pt-5">
                      <div className="bg-indigo-50 rounded-lg p-5 border-l-4 border-indigo-500">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                          {pergunta.resposta}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {pergunta.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Nenhuma pergunta encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              Tente buscar por outros termos ou ajustar os filtros
            </p>
            <button
              onClick={() => {
                setBusca('');
                setCategoriaSelecionada('todas');
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-2">💡 Não encontrou sua resposta?</h3>
          <p className="text-indigo-100 mb-6">
            Use nossas ferramentas especializadas para calcular e comparar seus impostos de forma precisa
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/formulario')}
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              🧮 Comparador Completo
            </button>
            <button
              onClick={() => navigate('/guia-regimes')}
              className="px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition"
            >
              📚 Guia de Regimes
            </button>
            <button
              onClick={() => navigate('/glossario-tributario')}
              className="px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition"
            >
              📖 Glossário
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

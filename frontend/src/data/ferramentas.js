/**
 * Catálogo de Ferramentas do Comparador Tributário
 * Cada ferramenta possui metadados para busca semântica
 */

export const ferramentas = [
  // === CALCULADORAS - SIMPLES NACIONAL ===
  {
    id: 'calculadora-das',
    nome: 'Calculadora DAS',
    descricao: 'Calcule o valor exato do DAS com alíquota efetiva',
    descricaoCompleta: 'Calculadora completa para Documento de Arrecadação do Simples Nacional. Calcula automaticamente a alíquota efetiva baseada no faturamento dos últimos 12 meses.',
    rota: '/calculadora-das',
    icone: '🧮',
    categoria: 'calculadora',
    subcategoria: 'simples-nacional',
    tags: ['das', 'simples nacional', 'imposto', 'guia', 'pagamento', 'alíquota', 'faturamento'],
    sinonimos: ['documento de arrecadação', 'guia do simples', 'boleto simples', 'imposto mensal'],
    palavrasChave: ['calcular das', 'valor das', 'quanto pago', 'alíquota efetiva', 'simples nacional'],
    cor: 'blue'
  },
  {
    id: 'simulador-fator-r',
    nome: 'Simulador Fator R',
    descricao: 'Descubra se sua empresa se enquadra no Anexo III ou V',
    descricaoCompleta: 'Simule o Fator R para descobrir se sua empresa de serviços pode pagar menos impostos no Anexo III ao invés do Anexo V.',
    rota: '/simulador-fator-r',
    icone: '📐',
    categoria: 'simulador',
    subcategoria: 'simples-nacional',
    tags: ['fator r', 'anexo iii', 'anexo v', 'folha de pagamento', 'pró-labore', 'serviços'],
    sinonimos: ['fator r', 'anexo 3', 'anexo 5', 'redução imposto', 'economia tributária'],
    palavrasChave: ['qual anexo', 'anexo iii ou v', 'folha pagamento', 'reduzir imposto serviço'],
    cor: 'blue'
  },
  {
    id: 'calculadora-pro-labore',
    nome: 'Calculadora Pró-Labore',
    descricao: 'Otimize INSS + IRPF do pró-labore',
    descricaoCompleta: 'Calcule o valor ideal de pró-labore considerando INSS patronal, INSS do sócio e IRPF retido na fonte.',
    rota: '/calculadora-pro-labore',
    icone: '💼',
    categoria: 'calculadora',
    subcategoria: 'simples-nacional',
    tags: ['pró-labore', 'inss', 'irpf', 'sócio', 'retirada', 'salário', 'contribuição'],
    sinonimos: ['pro labore', 'salário sócio', 'retirada sócio', 'pagamento sócio'],
    palavrasChave: ['quanto tirar', 'valor pro labore', 'inss socio', 'imposto retirada'],
    cor: 'blue'
  },
  {
    id: 'calculadora-distribuicao-lucros',
    nome: 'Distribuição de Lucros',
    descricao: 'Otimize as retiradas dos sócios',
    descricaoCompleta: 'Calcule a melhor estratégia de distribuição de lucros entre os sócios, considerando aspectos tributários e legais.',
    rota: '/calculadora-distribuicao-lucros',
    icone: '💰',
    categoria: 'calculadora',
    subcategoria: 'simples-nacional',
    tags: ['lucros', 'dividendos', 'distribuição', 'sócios', 'retirada', 'isento'],
    sinonimos: ['divisão lucros', 'lucros isentos', 'dividendos', 'retirada lucros'],
    palavrasChave: ['distribuir lucro', 'lucro isento', 'quanto posso tirar', 'retirada sem imposto'],
    cor: 'blue'
  },

  // === CALCULADORAS - LUCRO PRESUMIDO & REAL ===
  {
    id: 'calculadora-presumido',
    nome: 'Calculadora Lucro Presumido',
    descricao: 'Calcule IRPJ, CSLL, PIS e COFINS',
    descricaoCompleta: 'Calculadora completa para regime de Lucro Presumido. Calcula todos os tributos federais baseado na presunção de lucro.',
    rota: '/calculadora-presumido',
    icone: '📈',
    categoria: 'calculadora',
    subcategoria: 'lucro-presumido',
    tags: ['presumido', 'irpj', 'csll', 'pis', 'cofins', 'trimestral'],
    sinonimos: ['lucro presumido', 'regime presumido', 'presunção lucro'],
    palavrasChave: ['calcular presumido', 'imposto presumido', 'irpj csll', 'tributos federais'],
    cor: 'purple'
  },
  {
    id: 'calculadora-real',
    nome: 'Calculadora Lucro Real',
    descricao: 'Tributação sobre o lucro efetivo',
    descricaoCompleta: 'Calculadora para regime de Lucro Real. Ideal para empresas com margens menores ou prejuízos a compensar.',
    rota: '/calculadora-real',
    icone: '💰',
    categoria: 'calculadora',
    subcategoria: 'lucro-real',
    tags: ['lucro real', 'irpj', 'csll', 'lalur', 'prejuízo', 'compensação'],
    sinonimos: ['regime real', 'lucro efetivo', 'lucro contábil'],
    palavrasChave: ['calcular lucro real', 'compensar prejuizo', 'empresa prejuizo', 'margem baixa'],
    cor: 'purple'
  },
  {
    id: 'simulador-creditos',
    nome: 'Créditos PIS/COFINS',
    descricao: 'Simule créditos no regime não-cumulativo',
    descricaoCompleta: 'Simule os créditos de PIS e COFINS disponíveis no regime não-cumulativo do Lucro Real.',
    rota: '/simulador-creditos',
    icone: '💵',
    categoria: 'simulador',
    subcategoria: 'lucro-real',
    tags: ['pis', 'cofins', 'créditos', 'não-cumulativo', 'insumos', 'recuperação'],
    sinonimos: ['credito pis cofins', 'recuperar impostos', 'abater pis cofins'],
    palavrasChave: ['credito tributario', 'recuperar pis cofins', 'nao cumulativo', 'insumo credito'],
    cor: 'purple'
  },

  // === SIMULADORES ===
  {
    id: 'diagnostico-tributario',
    nome: 'Diagnóstico Tributário',
    descricao: 'Análise completa + recomendações personalizadas',
    descricaoCompleta: 'Faça um diagnóstico completo da situação tributária da sua empresa e receba recomendações personalizadas.',
    rota: '/diagnostico-tributario',
    icone: '🎯',
    categoria: 'simulador',
    subcategoria: 'analise',
    tags: ['diagnóstico', 'análise', 'recomendação', 'consultoria', 'tributário'],
    sinonimos: ['analise tributaria', 'checkup fiscal', 'avaliação empresa'],
    palavrasChave: ['analisar empresa', 'qual melhor regime', 'recomendação tributária', 'consultoria fiscal'],
    cor: 'emerald'
  },
  {
    id: 'planejador-tributario',
    nome: 'Planejador Visual',
    descricao: 'Sliders interativos em tempo real',
    descricaoCompleta: 'Planeje visualmente sua carga tributária com sliders interativos que mostram o impacto em tempo real.',
    rota: '/planejador-tributario',
    icone: '🎚️',
    categoria: 'simulador',
    subcategoria: 'planejamento',
    tags: ['planejamento', 'visual', 'interativo', 'cenários', 'simulação'],
    sinonimos: ['planejar impostos', 'visualizar tributos', 'interativo'],
    palavrasChave: ['planejar tributação', 'simular cenarios', 'visualizar impostos', 'tempo real'],
    cor: 'emerald'
  },
  {
    id: 'simulador-migracao',
    nome: 'Migração MEI → ME',
    descricao: 'Simule o impacto da transição de MEI para ME',
    descricaoCompleta: 'Simule quanto você vai pagar ao migrar de MEI para Microempresa, comparando todos os custos.',
    rota: '/simulador-migracao',
    icone: '🔄',
    categoria: 'simulador',
    subcategoria: 'transicao',
    tags: ['mei', 'me', 'migração', 'transição', 'desenquadramento', 'faturamento'],
    sinonimos: ['sair do mei', 'virar me', 'deixar mei', 'crescer empresa'],
    palavrasChave: ['migrar mei', 'quanto pago me', 'sair mei', 'faturamento mei', 'limite mei'],
    cor: 'emerald'
  },
  {
    id: 'simulador-desenquadramento',
    nome: 'Simulador Desenquadramento',
    descricao: 'Preveja limites MEI/Simples',
    descricaoCompleta: 'Simule quando sua empresa pode ser desenquadrada do MEI ou Simples Nacional por ultrapassar limites.',
    rota: '/simulador-desenquadramento',
    icone: '⚠️',
    categoria: 'simulador',
    subcategoria: 'transicao',
    tags: ['desenquadramento', 'limite', 'faturamento', 'exclusão', 'simples', 'mei'],
    sinonimos: ['perder simples', 'sair simples', 'limite faturamento', 'exclusão simples'],
    palavrasChave: ['limite simples', 'desenquadrar', 'ultrapassar limite', 'excesso faturamento'],
    cor: 'emerald'
  },
  {
    id: 'termometro-risco',
    nome: 'Termômetro de Risco',
    descricao: 'Score de compliance de 0 a 100',
    descricaoCompleta: 'Avalie o risco fiscal da sua empresa com um score de 0 a 100 baseado em diversos indicadores.',
    rota: '/termometro-risco',
    icone: '🌡️',
    categoria: 'simulador',
    subcategoria: 'compliance',
    tags: ['risco', 'compliance', 'fiscal', 'score', 'avaliação', 'segurança'],
    sinonimos: ['risco fiscal', 'segurança tributária', 'avaliação risco'],
    palavrasChave: ['risco empresa', 'compliance fiscal', 'score tributário', 'avaliar risco'],
    cor: 'emerald'
  },
  {
    id: 'calculadora-margem',
    nome: 'Calculadora de Margem',
    descricao: 'Margem líquida + tributos inclusos',
    descricaoCompleta: 'Calcule sua margem líquida real considerando todos os tributos e custos operacionais.',
    rota: '/calculadora-margem',
    icone: '📈',
    categoria: 'calculadora',
    subcategoria: 'analise',
    tags: ['margem', 'lucro', 'rentabilidade', 'custos', 'precificação'],
    sinonimos: ['margem lucro', 'margem liquida', 'rentabilidade', 'lucro real'],
    palavrasChave: ['calcular margem', 'quanto sobra', 'lucro liquido', 'margem final'],
    cor: 'emerald'
  },
  {
    id: 'historico-tributario',
    nome: 'Histórico Tributário',
    descricao: 'Compare meses e analise tendências',
    descricaoCompleta: 'Acompanhe o histórico de tributos pagos e identifique tendências ao longo dos meses.',
    rota: '/historico-tributario',
    icone: '📊',
    categoria: 'simulador',
    subcategoria: 'analise',
    tags: ['histórico', 'evolução', 'tendência', 'meses', 'comparação', 'gráfico'],
    sinonimos: ['evolução impostos', 'historico pagamentos', 'tendencia tributaria'],
    palavrasChave: ['ver historico', 'comparar meses', 'evolução impostos', 'tendencia tributos'],
    cor: 'emerald'
  },
  {
    id: 'simulador-cenarios',
    nome: 'Simulador de Cenários',
    descricao: 'Compare múltiplos cenários tributários',
    descricaoCompleta: 'Compare diferentes cenários de faturamento e custos para tomar a melhor decisão tributária.',
    rota: '/simulador-cenarios',
    icone: '📊',
    categoria: 'simulador',
    subcategoria: 'planejamento',
    tags: ['cenários', 'comparação', 'projeção', 'decisão', 'análise'],
    sinonimos: ['comparar cenarios', 'projetar impostos', 'analise cenarios'],
    palavrasChave: ['comparar situações', 'simular cenario', 'projeção tributária', 'o que acontece se'],
    cor: 'emerald'
  },

  // === EDUCAÇÃO ===
  {
    id: 'guia-regimes',
    nome: 'Guia de Regimes Tributários',
    descricao: 'Comparação completa dos 3 regimes',
    descricaoCompleta: 'Guia completo comparando Simples Nacional, Lucro Presumido e Lucro Real com prós e contras de cada um.',
    rota: '/guia-regimes',
    icone: '📖',
    categoria: 'educacao',
    subcategoria: 'guias',
    tags: ['guia', 'regimes', 'comparação', 'simples', 'presumido', 'real', 'aprender'],
    sinonimos: ['entender regimes', 'diferença regimes', 'qual regime escolher'],
    palavrasChave: ['diferença simples presumido', 'qual regime melhor', 'comparar regimes', 'entender tributação'],
    cor: 'purple'
  },
  {
    id: 'guia-cnae',
    nome: 'Guia CNAE → Anexo',
    descricao: 'Descubra seu anexo pelo CNAE',
    descricaoCompleta: 'Consulte qual anexo do Simples Nacional sua atividade (CNAE) se enquadra.',
    rota: '/guia-cnae',
    icone: '📋',
    categoria: 'educacao',
    subcategoria: 'guias',
    tags: ['cnae', 'anexo', 'atividade', 'código', 'simples nacional'],
    sinonimos: ['codigo atividade', 'qual anexo cnae', 'consultar cnae'],
    palavrasChave: ['buscar cnae', 'qual anexo', 'atividade simples', 'cnae permitido'],
    cor: 'purple'
  },
  {
    id: 'explicador-simples',
    nome: 'Explicador Visual Simples',
    descricao: 'Entenda o Simples Nacional visualmente',
    descricaoCompleta: 'Explicação visual e didática de como funciona o Simples Nacional, suas faixas e alíquotas.',
    rota: '/explicador-simples',
    icone: '🎓',
    categoria: 'educacao',
    subcategoria: 'guias',
    tags: ['explicação', 'visual', 'simples', 'didático', 'faixas', 'alíquotas'],
    sinonimos: ['como funciona simples', 'entender simples', 'aprender simples'],
    palavrasChave: ['como funciona', 'entender simples', 'explicar tributação', 'aprender impostos'],
    cor: 'purple'
  },
  {
    id: 'glossario-tributario',
    nome: 'Glossário Tributário',
    descricao: '30+ termos tributários explicados',
    descricaoCompleta: 'Glossário com mais de 30 termos tributários explicados de forma simples e acessível.',
    rota: '/glossario-tributario',
    icone: '📚',
    categoria: 'educacao',
    subcategoria: 'referencia',
    tags: ['glossário', 'termos', 'definições', 'vocabulário', 'significado'],
    sinonimos: ['dicionario tributario', 'significado termo', 'o que significa'],
    palavrasChave: ['o que é', 'significado', 'definição', 'termo tributário'],
    cor: 'purple'
  },
  {
    id: 'blog',
    nome: 'Blog & Artigos',
    descricao: 'Dicas de planejamento tributário',
    descricaoCompleta: 'Artigos e dicas sobre planejamento tributário, economia de impostos e gestão fiscal.',
    rota: '/blog',
    icone: '📰',
    categoria: 'educacao',
    subcategoria: 'conteudo',
    tags: ['blog', 'artigos', 'dicas', 'notícias', 'conteúdo'],
    sinonimos: ['noticias tributarias', 'dicas impostos', 'artigos fiscais'],
    palavrasChave: ['ler artigos', 'dicas economia', 'novidades tributárias', 'conteúdo fiscal'],
    cor: 'orange'
  },
  {
    id: 'faq',
    nome: 'FAQ - Perguntas Frequentes',
    descricao: 'Respostas para dúvidas comuns',
    descricaoCompleta: 'Perguntas frequentes sobre tributação, regimes e obrigações fiscais.',
    rota: '/faq',
    icone: '❓',
    categoria: 'educacao',
    subcategoria: 'referencia',
    tags: ['faq', 'perguntas', 'dúvidas', 'respostas', 'ajuda'],
    sinonimos: ['duvidas frequentes', 'perguntas comuns', 'ajuda tributaria'],
    palavrasChave: ['tenho duvida', 'como funciona', 'preciso saber', 'ajuda'],
    cor: 'orange'
  },
  {
    id: 'calendario',
    nome: 'Calendário Tributário 2025',
    descricao: 'Datas de obrigações fiscais',
    descricaoCompleta: 'Calendário completo com todas as datas de obrigações tributárias de 2025.',
    rota: '/calendario',
    icone: '📅',
    categoria: 'educacao',
    subcategoria: 'referencia',
    tags: ['calendário', 'datas', 'vencimento', 'obrigações', 'prazos', '2025'],
    sinonimos: ['datas importantes', 'vencimentos', 'agenda fiscal'],
    palavrasChave: ['quando vence', 'data pagamento', 'prazo obrigação', 'calendario fiscal'],
    cor: 'orange'
  },
  {
    id: 'casos-sucesso',
    nome: 'Casos de Sucesso',
    descricao: 'Empresas que economizaram',
    descricaoCompleta: 'Conheça casos reais de empresas que economizaram com planejamento tributário.',
    rota: '/casos-sucesso',
    icone: '🏆',
    categoria: 'educacao',
    subcategoria: 'conteudo',
    tags: ['casos', 'sucesso', 'exemplos', 'economia', 'testemunhos'],
    sinonimos: ['exemplos reais', 'empresas economizaram', 'historias sucesso'],
    palavrasChave: ['ver exemplos', 'quanto economizou', 'casos reais', 'testemunhos'],
    cor: 'orange'
  },

  // === STARTUPS ===
  {
    id: 'calculadora-runway',
    nome: 'Calculadora Runway',
    descricao: 'Meses de operação restantes',
    descricaoCompleta: 'Calcule quantos meses sua startup pode operar com o caixa atual (runway).',
    rota: '/calculadora-runway',
    icone: '🛫',
    categoria: 'startup',
    subcategoria: 'metricas',
    tags: ['runway', 'caixa', 'burn rate', 'meses', 'startup', 'investimento'],
    sinonimos: ['tempo caixa', 'quanto dura dinheiro', 'meses operação'],
    palavrasChave: ['quanto tempo tenho', 'caixa startup', 'burn rate', 'meses restantes'],
    cor: 'violet'
  },
  {
    id: 'calculadora-valuation',
    nome: 'Calculadora Valuation',
    descricao: 'Pre-money e post-money valuation',
    descricaoCompleta: 'Calcule o valuation da sua startup antes e depois de receber investimento.',
    rota: '/calculadora-valuation',
    icone: '💰',
    categoria: 'startup',
    subcategoria: 'investimento',
    tags: ['valuation', 'pre-money', 'post-money', 'investimento', 'startup', 'valor'],
    sinonimos: ['valor empresa', 'quanto vale', 'avaliação startup'],
    palavrasChave: ['calcular valuation', 'valor startup', 'quanto vale empresa', 'avaliar negócio'],
    cor: 'violet'
  },
  {
    id: 'cap-table',
    nome: 'Cap Table',
    descricao: 'Distribuição de equity entre sócios',
    descricaoCompleta: 'Gerencie e simule a distribuição de participação societária (equity) entre fundadores e investidores.',
    rota: '/cap-table',
    icone: '📊',
    categoria: 'startup',
    subcategoria: 'investimento',
    tags: ['cap table', 'equity', 'participação', 'sócios', 'diluição', 'investidores'],
    sinonimos: ['tabela capitalização', 'divisão cotas', 'participação societária'],
    palavrasChave: ['distribuir equity', 'participação socios', 'diluição investimento', 'cap table'],
    cor: 'violet'
  },
  {
    id: 'calculadora-cac-ltv',
    nome: 'CAC, LTV & Payback',
    descricao: 'Unit economics da sua startup',
    descricaoCompleta: 'Calcule métricas essenciais: Custo de Aquisição de Cliente (CAC), Lifetime Value (LTV) e Payback.',
    rota: '/calculadora-cac-ltv',
    icone: '📈',
    categoria: 'startup',
    subcategoria: 'metricas',
    tags: ['cac', 'ltv', 'payback', 'unit economics', 'cliente', 'aquisição'],
    sinonimos: ['custo cliente', 'valor cliente', 'retorno cliente'],
    palavrasChave: ['calcular cac', 'lifetime value', 'custo aquisição', 'payback periodo'],
    cor: 'violet'
  },
  {
    id: 'simulador-crescimento',
    nome: 'Growth Forecast',
    descricao: 'Projeções de crescimento',
    descricaoCompleta: 'Simule projeções de crescimento da sua startup com diferentes cenários.',
    rota: '/simulador-crescimento',
    icone: '📊',
    categoria: 'startup',
    subcategoria: 'planejamento',
    tags: ['crescimento', 'projeção', 'forecast', 'mrr', 'arr', 'saas'],
    sinonimos: ['projetar crescimento', 'simular futuro', 'forecast receita'],
    palavrasChave: ['projetar crescimento', 'simular mrr', 'crescimento startup', 'forecast'],
    cor: 'violet'
  },
  {
    id: 'simulador-roi',
    nome: 'ROI Simulator',
    descricao: 'Retorno sobre investimento',
    descricaoCompleta: 'Simule o retorno sobre investimento (ROI) de diferentes iniciativas.',
    rota: '/simulador-roi',
    icone: '💰',
    categoria: 'startup',
    subcategoria: 'investimento',
    tags: ['roi', 'retorno', 'investimento', 'lucro', 'rentabilidade'],
    sinonimos: ['retorno investimento', 'roi projeto', 'rentabilidade investimento'],
    palavrasChave: ['calcular roi', 'retorno projeto', 'vale a pena investir', 'rentabilidade'],
    cor: 'violet'
  },

  // === COMPARAÇÃO ===
  {
    id: 'comparador',
    nome: 'Comparador de Regimes',
    descricao: 'Compare Simples, Presumido e Real',
    descricaoCompleta: 'Compare os três regimes tributários e descubra qual é mais vantajoso para sua empresa.',
    rota: '/formulario',
    icone: '⚖️',
    categoria: 'simulador',
    subcategoria: 'comparacao',
    tags: ['comparador', 'regimes', 'simples', 'presumido', 'real', 'economia', 'melhor'],
    sinonimos: ['comparar impostos', 'qual regime', 'melhor tributação'],
    palavrasChave: ['comparar regimes', 'qual melhor', 'simples ou presumido', 'economizar imposto'],
    cor: 'emerald'
  },
  {
    id: 'calculadora-custo-funcionario',
    nome: 'Custo de Funcionário',
    descricao: 'Calcule o custo total de um funcionário CLT',
    descricaoCompleta: 'Calculadora completa que mostra todos os encargos e custos reais de um funcionário CLT para a empresa.',
    rota: '/calculadora-custo-funcionario',
    icone: '💼',
    categoria: 'calculadora',
    subcategoria: 'trabalhista',
    tags: ['funcionário', 'clt', 'encargos', 'fgts', 'inss', 'férias', '13º', 'custo'],
    sinonimos: ['custo empregado', 'encargos trabalhistas', 'quanto custa contratar'],
    palavrasChave: ['custo funcionario', 'encargos clt', 'quanto custa contratar', 'fgts inss'],
    cor: 'emerald'
  },
  {
    id: 'comparador-clt-pj',
    nome: 'Comparador CLT x PJ',
    descricao: 'Compare CLT com benefícios vs PJ',
    descricaoCompleta: 'Ferramenta completa que compara quanto você ganha sendo CLT (com benefícios) vs PJ, incluindo 13º, férias, FGTS e impostos.',
    rota: '/comparador-clt-pj',
    icone: '⚖️',
    categoria: 'calculadora',
    subcategoria: 'trabalhista',
    tags: ['clt', 'pj', 'comparação', 'salário', 'benefícios', 'carteira', 'pessoa jurídica'],
    sinonimos: ['clt ou pj', 'vale a pena pj', 'melhor clt ou pj', 'comparar emprego'],
    palavrasChave: ['clt vs pj', 'vale pena ser pj', 'melhor clt pj', 'quanto ganho pj'],
    cor: 'violet'
  },
  {
    id: 'calculadora-rescisao',
    nome: 'Calculadora de Rescisão',
    descricao: 'Calcule verbas rescisórias trabalhistas',
    descricaoCompleta: 'Calculadora completa de rescisão trabalhista: saldo de salário, férias, 13º, aviso prévio e multa FGTS.',
    rota: '/calculadora-rescisao',
    icone: '📄',
    categoria: 'calculadora',
    subcategoria: 'trabalhista',
    tags: ['rescisão', 'demissão', 'aviso prévio', 'férias', '13º', 'fgts', 'multa', 'verbas'],
    sinonimos: ['calcular demissão', 'quanto vou receber', 'verbas rescisórias', 'acerto trabalhista'],
    palavrasChave: ['calcular rescisão', 'quanto recebo demissão', 'verbas rescisórias', 'acerto demissão'],
    cor: 'red'
  },
  {
    id: 'calculadora-markup-margem',
    nome: 'Calculadora de Markup vs Margem',
    descricao: 'Compare markup e margem de lucro. Calcule o preço de venda correto e evite prejuízos por usar o método errado.',
    descricaoCompleta: 'Calculadora completa que mostra a diferença entre markup e margem de lucro. Compare os dois métodos de precificação e entenda qual usar.',
    rota: '/calculadora-markup-margem',
    icone: '💰',
    categoria: 'calculadora',
    subcategoria: 'financeiro',
    tags: ['markup', 'margem', 'precificação', 'preço de venda', 'lucro', 'custo', 'formar preço'],
    sinonimos: ['calcular markup', 'calcular margem', 'markup vs margem', 'diferença markup margem', 'preço de venda'],
    palavrasChave: ['markup', 'margem de lucro', 'precificação', 'formar preço', 'calcular preço venda', 'diferença markup margem', 'markup vs margem'],
    cor: 'purple'
  },
  {
    id: 'simulador-maquininha',
    nome: 'Simulador de Taxas de Maquininha',
    descricao: 'Calcule quanto você realmente recebe após taxas de cartão. Compare débito, crédito à vista e parcelado. Descubra o custo real da antecipação.',
    descricaoCompleta: 'Simulador completo de taxas de maquininha de cartão. Calcula valor líquido, CET anual, custo de antecipação e compara todas as modalidades.',
    rota: '/simulador-maquininha',
    icone: '💳',
    categoria: 'simulador',
    subcategoria: 'financeiro',
    tags: ['maquininha', 'taxas cartão', 'antecipação', 'cet', 'débito', 'crédito', 'parcelado'],
    sinonimos: ['taxas de cartão', 'maquininha de cartão', 'stone', 'cielo', 'pagseguro', 'mercado pago', 'taxa mdr'],
    palavrasChave: ['taxas maquininha', 'quanto recebo cartão', 'taxa débito', 'taxa crédito', 'antecipação recebíveis', 'cet maquininha', 'simulador taxas cartão'],
    cor: 'green'
  },
  {
    id: 'calculadora-ponto-equilibrio',
    nome: 'Calculadora de Ponto de Equilíbrio',
    descricao: 'Descubra quantas unidades você precisa vender para cobrir todos os custos e começar a lucrar (break-even point)',
    descricaoCompleta: 'Calculadora completa de ponto de equilíbrio (break-even). Calcula margem de contribuição, faturamento necessário e mostra gráfico visual do break-even.',
    rota: '/calculadora-ponto-equilibrio',
    icone: '🎯',
    categoria: 'calculadora',
    subcategoria: 'financeiro',
    tags: ['ponto de equilíbrio', 'break-even', 'custos fixos', 'margem contribuição', 'faturamento mínimo'],
    sinonimos: ['break even', 'ponto equilibrio', 'quantas vendas preciso', 'quanto preciso faturar', 'custos fixos variáveis'],
    palavrasChave: ['ponto de equilíbrio', 'break even calculator', 'quanto preciso vender', 'calcular break even', 'margem de contribuição', 'custos fixos e variáveis'],
    cor: 'blue'
  }
];

/**
 * Busca ferramentas por texto
    sinonimos: ['formação preço', 'calcular markup', 'margem lucro'],
    palavrasChave: ['calcular markup', 'margem lucro', 'formação preço', 'precificar produto'],
    cor: 'emerald'
  },
  {
    id: 'simulador-mrr',
    nome: 'Simulador MRR/ARR',
    descricao: 'Projete receita recorrente mensal e anual',
    descricaoCompleta: 'Simulador de MRR (Monthly Recurring Revenue) e ARR (Annual Recurring Revenue) para SaaS e negócios de assinatura.',
    rota: '/simulador-mrr',
    icone: '📈',
    categoria: 'startup',
    subcategoria: 'metricas',
    tags: ['mrr', 'arr', 'receita recorrente', 'saas', 'assinatura', 'churn'],
    sinonimos: ['receita mensal', 'receita anual', 'assinatura mensal'],
    palavrasChave: ['calcular mrr', 'projetar receita', 'receita recorrente', 'saas métricas'],
    cor: 'blue'
  },
  {
    id: 'simulador-difal',
    nome: 'Simulador de DIFAL',
    descricao: 'Calcule o Diferencial de Alíquota do ICMS para vendas interestaduais a consumidor final. Gera valor exato da GNRE.',
    descricaoCompleta: 'Simulador completo de DIFAL (Diferencial de Alíquota do ICMS) para e-commerces e empresas que vendem para outros estados. Calcula alíquota interestadual, DIFAL, FCP e mostra partilha entre estados.',
    rota: '/simulador-difal',
    icone: '🗺️',
    categoria: 'simulador',
    subcategoria: 'tributario',
    tags: ['difal', 'icms interestadual', 'gnre', 'consumidor final', 'ec 87/2015', 'fcp', 'e-commerce'],
    sinonimos: ['diferencial aliquota', 'icms destino', 'venda interestadual', 'gnre difal', 'icms partilha'],
    palavrasChave: ['difal 2025', 'gnre difal', 'calcular difal', 'icms interestadual consumidor final', 'venda outro estado'],
    cor: 'indigo'
  },
  {
    id: 'comparador-indicadores',
    nome: 'Comparador de Indicadores Financeiros',
    descricao: 'Compare CDI, SELIC e IPCA em gráficos interativos. Visualize evolução histórica e estatísticas completas.',
    descricaoCompleta: 'Ferramenta interativa para comparar os principais indicadores financeiros brasileiros: CDI, SELIC e IPCA. Gráficos de linha com evolução temporal, cards de estatísticas (variação acumulada, média mensal, volatilidade), filtros por período (3m, 6m, 1a, 2a, 5a) e painel educativo explicando cada indicador.',
    rota: '/comparador-indicadores',
    icone: '📊',
    categoria: 'educacao',
    subcategoria: 'financeiro',
    tags: ['cdi', 'selic', 'ipca', 'indicadores', 'gráfico', 'comparação', 'variação', 'anbima', 'banco central'],
    sinonimos: ['indices financeiros', 'taxas brasil', 'inflação', 'juros', 'benchmarking'],
    palavrasChave: ['comparar cdi selic', 'evolução ipca', 'gráfico indicadores', 'taxas financeiras brasil', 'variação acumulada'],
    cor: 'blue'
  },
  {
    id: 'calculadora-icms-st',
    nome: 'Calculadora de ICMS-ST',
    descricao: 'Calcule o ICMS-ST (Substituição Tributária) com MVA, base de cálculo ST e valor total da nota',
    descricaoCompleta: 'Calculadora completa de ICMS-ST para indústrias, distribuidores e varejistas. Calcula base ST com MVA, ICMS próprio, ICMS-ST a recolher e valor total da nota fiscal.',
    rota: '/calculadora-icms-st',
    icone: '🗂️',
    categoria: 'calculadora',
    subcategoria: 'tributario',
    tags: ['icms-st', 'substituição tributária', 'mva', 'base st', 'indústria', 'distribuidor', 'varejista'],
    sinonimos: ['substituicao tributaria', 'st', 'icms substituicao', 'calculo st', 'margem valor agregado'],
    palavrasChave: ['icms st 2025', 'calcular icms st', 'mva substituição tributária', 'base cálculo st', 'substituição tributária'],
    cor: 'orange'
  }
];

/**
 * Categorias para agrupamento visual
 */
export const categorias = {
  calculadora: {
    nome: 'Calculadoras',
    icone: '🧮',
    cor: 'blue',
    descricao: 'Cálculos tributários precisos'
  },
  simulador: {
    nome: 'Simuladores',
    icone: '🎯',
    cor: 'emerald',
    descricao: 'Simulações e análises'
  },
  educacao: {
    nome: 'Aprender',
    icone: '📚',
    cor: 'purple',
    descricao: 'Conteúdo educacional'
  },
  startup: {
    nome: 'Startups',
    icone: '🚀',
    cor: 'violet',
    descricao: 'Métricas de startup'
  }
};

/**
 * Subcategorias para filtros
 */
export const subcategorias = {
  'simples-nacional': 'Simples Nacional',
  'lucro-presumido': 'Lucro Presumido',
  'lucro-real': 'Lucro Real',
  'analise': 'Análise',
  'planejamento': 'Planejamento',
  'transicao': 'Transição',
  'compliance': 'Compliance',
  'guias': 'Guias',
  'referencia': 'Referência',
  'conteudo': 'Conteúdo',
  'metricas': 'Métricas',
  'investimento': 'Investimento',
  'comparacao': 'Comparação',
  'trabalhista': 'Trabalhista'
};

export default ferramentas;

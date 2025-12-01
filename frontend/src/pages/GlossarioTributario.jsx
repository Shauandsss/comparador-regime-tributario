import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Base de conhecimento com termos tributários
const TERMOS_TRIBUTARIOS = [
  {
    id: 1,
    termo: 'Simples Nacional',
    categoria: 'Regimes Tributários',
    definicao: 'Regime tributário simplificado e favorecido previsto na Lei Complementar nº 123/2006, aplicável às Microempresas (ME) e Empresas de Pequeno Porte (EPP).',
    exemplo: 'Uma loja de roupas com faturamento anual de R$ 800 mil pode optar pelo Simples Nacional, pagando uma única guia (DAS) que unifica 8 impostos.',
    relacionados: ['DAS', 'Lucro Presumido', 'Lucro Real', 'Fator R', 'Anexos do Simples'],
    emoji: '🏢'
  },
  {
    id: 2,
    termo: 'DAS',
    categoria: 'Tributos',
    definicao: 'Documento de Arrecadação do Simples Nacional. É a guia única de pagamento que unifica até 8 tributos: IRPJ, CSLL, PIS, COFINS, IPI, ICMS, ISS e CPP.',
    exemplo: 'A empresa apura mensalmente sua receita bruta e calcula o DAS aplicando a alíquota efetiva do Simples Nacional sobre o faturamento.',
    relacionados: ['Simples Nacional', 'Alíquota Efetiva', 'RBT12'],
    emoji: '📄'
  },
  {
    id: 3,
    termo: 'Lucro Presumido',
    categoria: 'Regimes Tributários',
    definicao: 'Regime tributário onde a base de cálculo do IRPJ e CSLL é determinada mediante aplicação de percentuais de presunção sobre a receita bruta, variando de 8% a 32% conforme a atividade.',
    exemplo: 'Uma empresa de serviços com receita trimestral de R$ 300 mil presume lucro de 32% (R$ 96 mil) e paga IRPJ e CSLL sobre esse valor, independente do lucro real.',
    relacionados: ['Lucro Real', 'IRPJ', 'CSLL', 'PIS', 'COFINS'],
    emoji: '📈'
  },
  {
    id: 4,
    termo: 'Lucro Real',
    categoria: 'Regimes Tributários',
    definicao: 'Regime tributário onde o IRPJ e CSLL são calculados sobre o lucro líquido contábil efetivamente apurado, ajustado pelas adições e exclusões previstas na legislação.',
    exemplo: 'Uma indústria com receita de R$ 10 milhões e despesas de R$ 9 milhões paga IRPJ e CSLL apenas sobre o lucro real de R$ 1 milhão.',
    relacionados: ['Lucro Presumido', 'LALUR', 'Créditos PIS/COFINS', 'IRPJ', 'CSLL'],
    emoji: '💼'
  },
  {
    id: 5,
    termo: 'Fator R',
    categoria: 'Cálculos',
    definicao: 'Relação percentual entre a folha de pagamento (incluindo pró-labore e encargos) dos últimos 12 meses e a receita bruta do mesmo período. Determina o anexo do Simples para empresas de serviços.',
    exemplo: 'Empresa com folha anual de R$ 350 mil e receita de R$ 1 milhão tem Fator R de 35%. Como é ≥28%, enquadra-se no Anexo III (alíquotas menores).',
    relacionados: ['Simples Nacional', 'Anexos do Simples', 'Anexo III', 'Anexo V'],
    emoji: '📐'
  },
  {
    id: 6,
    termo: 'IRPJ',
    categoria: 'Tributos',
    definicao: 'Imposto de Renda Pessoa Jurídica. Tributo federal que incide sobre o lucro das empresas. Alíquota de 15% sobre o lucro, mais adicional de 10% sobre o que exceder R$ 20 mil/mês.',
    exemplo: 'Empresa com lucro trimestral de R$ 100 mil paga: 15% × R$ 100 mil = R$ 15 mil + adicional de 10% × R$ 40 mil = R$ 4 mil. Total: R$ 19 mil.',
    relacionados: ['CSLL', 'Lucro Presumido', 'Lucro Real', 'Adicional de IRPJ'],
    emoji: '💰'
  },
  {
    id: 7,
    termo: 'CSLL',
    categoria: 'Tributos',
    definicao: 'Contribuição Social sobre o Lucro Líquido. Contribuição federal destinada à Seguridade Social. Alíquota de 9% sobre a base de cálculo (lucro presumido ou real).',
    exemplo: 'Empresa no Lucro Presumido com receita trimestral de R$ 200 mil e presunção de 32% paga: 9% × (32% × R$ 200 mil) = R$ 5.760.',
    relacionados: ['IRPJ', 'Lucro Presumido', 'Lucro Real'],
    emoji: '🏦'
  },
  {
    id: 8,
    termo: 'PIS',
    categoria: 'Tributos',
    definicao: 'Programa de Integração Social. Contribuição federal sobre a receita bruta. No regime cumulativo: 0,65%. No não-cumulativo: 1,65% com direito a créditos.',
    exemplo: 'Empresa no Lucro Presumido com receita de R$ 100 mil paga PIS cumulativo: 0,65% × R$ 100 mil = R$ 650 (sem créditos).',
    relacionados: ['COFINS', 'Créditos PIS/COFINS', 'Regime Não-Cumulativo'],
    emoji: '💵'
  },
  {
    id: 9,
    termo: 'COFINS',
    categoria: 'Tributos',
    definicao: 'Contribuição para o Financiamento da Seguridade Social. No regime cumulativo: 3%. No não-cumulativo: 7,6% com direito a créditos sobre insumos e despesas.',
    exemplo: 'Empresa no Lucro Real com receita de R$ 100 mil e insumos de R$ 30 mil: débito 7,6% × R$ 100 mil = R$ 7.600, crédito 7,6% × R$ 30 mil = R$ 2.280. A pagar: R$ 5.320.',
    relacionados: ['PIS', 'Créditos PIS/COFINS', 'Regime Não-Cumulativo'],
    emoji: '💳'
  },
  {
    id: 10,
    termo: 'ISS',
    categoria: 'Tributos',
    definicao: 'Imposto Sobre Serviços de Qualquer Natureza. Tributo municipal que incide sobre prestação de serviços. Alíquota varia de 2% a 5% conforme município e atividade.',
    exemplo: 'Um escritório de contabilidade em São Paulo com receita mensal de R$ 50 mil paga ISS de 2,5%: R$ 1.250/mês ao município.',
    relacionados: ['Simples Nacional', 'Lucro Presumido', 'ICMS'],
    emoji: '🏛️'
  },
  {
    id: 11,
    termo: 'ICMS',
    categoria: 'Tributos',
    definicao: 'Imposto sobre Circulação de Mercadorias e Serviços. Tributo estadual que incide sobre vendas, transportes e telecomunicações. Alíquota média de 18% (varia por estado e produto).',
    exemplo: 'Loja vende produto por R$ 1.000 com ICMS de 18%. O preço já inclui os R$ 180 de ICMS, que deve ser recolhido ao estado.',
    relacionados: ['Simples Nacional', 'Substituição Tributária', 'ISS'],
    emoji: '🏪'
  },
  {
    id: 12,
    termo: 'Anexos do Simples',
    categoria: 'Simples Nacional',
    definicao: 'Tabelas progressivas de alíquotas do Simples Nacional. São 5 anexos: I (comércio), II (indústria), III (serviços com Fator R≥28%), IV (serviços de limpeza, vigilância, etc.), V (demais serviços).',
    exemplo: 'Empresa de TI com Fator R de 30% usa Anexo III. Com RBT12 de R$ 500 mil, a alíquota efetiva fica em torno de 11,2%.',
    relacionados: ['Simples Nacional', 'Fator R', 'Alíquota Efetiva'],
    emoji: '📊'
  },
  {
    id: 13,
    termo: 'RBT12',
    categoria: 'Cálculos',
    definicao: 'Receita Bruta acumulada dos últimos 12 meses. É a base para calcular a alíquota efetiva do Simples Nacional e verificar limites de enquadramento.',
    exemplo: 'Empresa faturou R$ 400 mil nos últimos 12 meses. Este valor (RBT12) é usado para encontrar a faixa correta na tabela do Simples e calcular o DAS.',
    relacionados: ['Simples Nacional', 'DAS', 'Alíquota Efetiva', 'Fator R'],
    emoji: '📈'
  },
  {
    id: 14,
    termo: 'Alíquota Efetiva',
    categoria: 'Cálculos',
    definicao: 'Alíquota real a ser aplicada sobre o faturamento mensal no Simples Nacional. Calculada pela fórmula: (RBT12 × Alíquota da faixa - Parcela a deduzir) / RBT12.',
    exemplo: 'Empresa na 2ª faixa do Anexo I: RBT12 de R$ 200 mil, alíquota nominal 7,3%, parcela R$ 5.940. Alíquota efetiva: (R$ 200k × 7,3% - R$ 5.940) / R$ 200k = 4,33%.',
    relacionados: ['Simples Nacional', 'RBT12', 'Parcela a Deduzir'],
    emoji: '🧮'
  },
  {
    id: 15,
    termo: 'Parcela a Deduzir',
    categoria: 'Cálculos',
    definicao: 'Valor fixo a ser subtraído no cálculo do DAS do Simples Nacional. Cada faixa de faturamento tem sua parcela específica para ajustar a progressividade.',
    exemplo: 'Na 3ª faixa do Anexo III, a parcela a deduzir é R$ 22.500. Isso reduz o valor do DAS, tornando a tributação progressiva mais suave.',
    relacionados: ['Simples Nacional', 'Alíquota Efetiva', 'DAS'],
    emoji: '➖'
  },
  {
    id: 16,
    termo: 'Créditos PIS/COFINS',
    categoria: 'Benefícios Fiscais',
    definicao: 'No regime não-cumulativo (Lucro Real), é possível descontar créditos de PIS (1,65%) e COFINS (7,6%) sobre insumos, energia, aluguéis, fretes e outras despesas permitidas.',
    exemplo: 'Indústria compra R$ 100 mil em matéria-prima. Gera crédito de PIS/COFINS: 9,25% × R$ 100 mil = R$ 9.250 para abater dos débitos.',
    relacionados: ['PIS', 'COFINS', 'Lucro Real', 'Regime Não-Cumulativo'],
    emoji: '💳'
  },
  {
    id: 17,
    termo: 'Pró-Labore',
    categoria: 'Folha',
    definicao: 'Remuneração dos sócios que trabalham na empresa. Deve ser compatível com o mercado e tem incidência de INSS (11% do sócio + 20% da empresa) e IRPF conforme tabela progressiva.',
    exemplo: 'Sócio com pró-labore de R$ 5 mil: desconta INSS de R$ 550 (11%) e IRPF conforme faixa. Empresa recolhe mais 20% (R$ 1.000) de INSS patronal.',
    relacionados: ['INSS', 'IRPF', 'Fator R', 'Folha de Pagamento'],
    emoji: '💼'
  },
  {
    id: 18,
    termo: 'INSS',
    categoria: 'Tributos',
    definicao: 'Instituto Nacional do Seguro Social. Contribuição previdenciária obrigatória. Para empresas: 20% sobre folha. Para autônomos/sócios: 11% sobre pró-labore (limitado ao teto).',
    exemplo: 'Empresa com folha de R$ 30 mil recolhe 20% = R$ 6 mil de INSS patronal. Cada funcionário também contribui com 8-11% do salário.',
    relacionados: ['Pró-Labore', 'Folha de Pagamento', 'CPP', 'Fator R'],
    emoji: '🏥'
  },
  {
    id: 19,
    termo: 'IRPF',
    categoria: 'Tributos',
    definicao: 'Imposto de Renda Pessoa Física. Incide sobre rendimentos de pessoas físicas (salários, pró-labore, aluguéis). Tabela progressiva de 0% a 27,5% com faixas e deduções.',
    exemplo: 'Pessoa com rendimento de R$ 4 mil/mês: faixa de 15%, desconta dedução de R$ 381,44 + dependentes. IRPF mensal aproximado de R$ 220.',
    relacionados: ['Pró-Labore', 'Tabela Progressiva', 'Dedução IRPF'],
    emoji: '📝'
  },
  {
    id: 20,
    termo: 'MEI',
    categoria: 'Regimes Tributários',
    definicao: 'Microempreendedor Individual. Regime para faturamento até R$ 81 mil/ano, sem empregados (máximo 1) e atividades permitidas. Paga valor fixo mensal (DAS-MEI) de ~R$ 70.',
    exemplo: 'Um eletricista autônomo que fatura R$ 6 mil/mês pode ser MEI, pagando apenas R$ 71,60/mês de tributos unificados.',
    relacionados: ['Simples Nacional', 'DAS', 'Desenquadramento MEI'],
    emoji: '👤'
  },
  {
    id: 21,
    termo: 'LALUR',
    categoria: 'Obrigações',
    definicao: 'Livro de Apuração do Lucro Real. Documento onde são registrados os ajustes do lucro contábil (adições e exclusões) para chegar ao lucro tributável no regime de Lucro Real.',
    exemplo: 'Empresa teve lucro contábil de R$ 200 mil, mas deve adicionar R$ 50 mil de despesas não dedutíveis. No LALUR, o lucro tributável passa a R$ 250 mil.',
    relacionados: ['Lucro Real', 'IRPJ', 'CSLL', 'Adições e Exclusões'],
    emoji: '📒'
  },
  {
    id: 22,
    termo: 'SPED',
    categoria: 'Obrigações',
    definicao: 'Sistema Público de Escrituração Digital. Conjunto de obrigações digitais: SPED Fiscal (ICMS/IPI), SPED Contábil (ECD), SPED Contribuições (PIS/COFINS), entre outros.',
    exemplo: 'Empresa no Lucro Real deve entregar mensalmente o SPED Contribuições com detalhamento de PIS/COFINS, créditos e débitos.',
    relacionados: ['EFD', 'ECD', 'Obrigações Acessórias'],
    emoji: '💻'
  },
  {
    id: 23,
    termo: 'Obrigações Acessórias',
    categoria: 'Obrigações',
    definicao: 'Declarações e informações fiscais que devem ser entregues aos órgãos públicos além do pagamento de impostos. Exemplos: DCTF, DEFIS, EFD-Contribuições, ECD, ECF, DIRF.',
    exemplo: 'Empresa no Simples entrega anualmente a DEFIS. Empresa no Lucro Real entrega mensalmente DCTF, EFD-Contribuições e anualmente ECF.',
    relacionados: ['SPED', 'DCTF', 'DEFIS', 'EFD'],
    emoji: '📋'
  },
  {
    id: 24,
    termo: 'Substituição Tributária',
    categoria: 'Regimes Especiais',
    definicao: 'Regime onde a responsabilidade pelo recolhimento do ICMS é transferida para um contribuinte anterior na cadeia (geralmente indústria ou importador).',
    exemplo: 'Indústria de bebidas vende para distribuidora já recolhendo o ICMS de toda a cadeia até o consumidor final. A distribuidora e varejista não recolhem ICMS novamente.',
    relacionados: ['ICMS', 'Simples Nacional', 'MVA'],
    emoji: '🔄'
  },
  {
    id: 25,
    termo: 'Adicional de IRPJ',
    categoria: 'Tributos',
    definicao: 'Alíquota adicional de 10% sobre a parcela do lucro que exceder R$ 20 mil por mês (ou R$ 60 mil no trimestre). Incide apenas sobre o excedente.',
    exemplo: 'Lucro trimestral de R$ 100 mil: IRPJ normal 15% × R$ 100k = R$ 15k + adicional 10% × R$ 40k (excedente de R$ 60k) = R$ 4k. Total: R$ 19k.',
    relacionados: ['IRPJ', 'Lucro Presumido', 'Lucro Real'],
    emoji: '➕'
  },
  {
    id: 26,
    termo: 'Regime Não-Cumulativo',
    categoria: 'Regimes Especiais',
    definicao: 'Sistema de apuração de PIS e COFINS onde é permitido descontar créditos sobre insumos e despesas. Aplicável ao Lucro Real. Alíquotas: PIS 1,65% e COFINS 7,6%.',
    exemplo: 'Receita R$ 100k (débito R$ 9.250) menos créditos de insumos R$ 30k (R$ 2.775) = PIS/COFINS a pagar: R$ 6.475.',
    relacionados: ['PIS', 'COFINS', 'Créditos PIS/COFINS', 'Lucro Real'],
    emoji: '🔢'
  },
  {
    id: 27,
    termo: 'Desenquadramento',
    categoria: 'Simples Nacional',
    definicao: 'Perda da condição de optante do Simples Nacional ou MEI por exceder limites, exercer atividade vedada ou ter débitos. Passa para Lucro Presumido ou Real.',
    exemplo: 'MEI que fatura R$ 100 mil em 2024 (acima de R$ 81k) será desenquadrado em 2025 e deverá optar por outro regime (geralmente Simples).',
    relacionados: ['Simples Nacional', 'MEI', 'Lucro Presumido'],
    emoji: '⚠️'
  },
  {
    id: 28,
    termo: 'Folha de Pagamento',
    categoria: 'Folha',
    definicao: 'Documento que relaciona todos os funcionários e seus respectivos salários, encargos (INSS, FGTS, IRRF) e descontos. Base para cálculo do Fator R e encargos sociais.',
    exemplo: 'Empresa com 10 funcionários e folha total de R$ 50 mil: recolhe 20% INSS (R$ 10k) + 8% FGTS (R$ 4k) + outros encargos mensalmente.',
    relacionados: ['INSS', 'FGTS', 'Pró-Labore', 'Fator R', 'CPP'],
    emoji: '👥'
  },
  {
    id: 29,
    termo: 'Planejamento Tributário',
    categoria: 'Gestão',
    definicao: 'Estudo e adoção de estratégias legais para reduzir a carga tributária da empresa. Inclui escolha do regime, estruturação societária e aproveitamento de incentivos.',
    exemplo: 'Empresa fatura R$ 3 milhões/ano e pode economizar R$ 150 mil/ano migrando do Simples para Lucro Presumido após planejamento com contador.',
    relacionados: ['Regimes Tributários', 'Elisão Fiscal', 'Economia Tributária'],
    emoji: '🎯'
  },
  {
    id: 30,
    termo: 'Elisão Fiscal',
    categoria: 'Gestão',
    definicao: 'Redução legal da carga tributária através de planejamento tributário. Diferente de evasão fiscal (sonegação), a elisão usa meios lícitos previstos em lei.',
    exemplo: 'Distribuir lucros aos sócios (isento de IR) em vez de aumentar pró-labore (tributado) é elisão fiscal legítima.',
    relacionados: ['Planejamento Tributário', 'Evasão Fiscal', 'Distribuição de Lucros'],
    emoji: '✅'
  }
];

// Categorias únicas
const CATEGORIAS = [...new Set(TERMOS_TRIBUTARIOS.map(t => t.categoria))].sort();

export default function GlossarioTributario() {
  const navigate = useNavigate();
  
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [termoExpandido, setTermoExpandido] = useState(null);
  
  // Filtra termos por busca e categoria
  const termosFiltrados = useMemo(() => {
    return TERMOS_TRIBUTARIOS.filter(termo => {
      const matchBusca = busca === '' || 
        termo.termo.toLowerCase().includes(busca.toLowerCase()) ||
        termo.definicao.toLowerCase().includes(busca.toLowerCase()) ||
        termo.exemplo.toLowerCase().includes(busca.toLowerCase());
      
      const matchCategoria = categoriaFiltro === 'Todas' || 
        termo.categoria === categoriaFiltro;
      
      return matchBusca && matchCategoria;
    });
  }, [busca, categoriaFiltro]);
  
  // Expande/colapsa termo
  const toggleTermo = (id) => {
    setTermoExpandido(termoExpandido === id ? null : id);
  };
  
  // Navega para termo relacionado
  const irParaTermo = (termoNome) => {
    const termo = TERMOS_TRIBUTARIOS.find(t => t.termo === termoNome);
    if (termo) {
      setTermoExpandido(termo.id);
      setBusca(termoNome);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Cor por categoria
  const getCorCategoria = (categoria) => {
    const cores = {
      'Regimes Tributários': 'blue',
      'Tributos': 'green',
      'Cálculos': 'purple',
      'Simples Nacional': 'indigo',
      'Obrigações': 'orange',
      'Benefícios Fiscais': 'emerald',
      'Folha': 'cyan',
      'Regimes Especiais': 'pink',
      'Gestão': 'yellow'
    };
    return cores[categoria] || 'gray';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-800 mb-4 flex items-center gap-2"
          >
            ← Voltar para Home
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Glossário Tributário Inteligente
          </h1>
          <p className="text-gray-600 text-lg">
            {TERMOS_TRIBUTARIOS.length} termos essenciais explicados de forma simples
          </p>
        </div>
        
        {/* Barra de Busca e Filtros */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Busca */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔍 Buscar Termo
              </label>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Digite um termo (ex: IRPJ, Simples, DAS...)"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
            
            {/* Filtro por Categoria */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🏷️ Filtrar por Categoria
              </label>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              >
                <option value="Todas">Todas as Categorias</option>
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
          </div>
          
          {/* Contador de Resultados */}
          <div className="mt-4 text-center">
            <span className="text-gray-600">
              {termosFiltrados.length === TERMOS_TRIBUTARIOS.length
                ? `Mostrando todos os ${TERMOS_TRIBUTARIOS.length} termos`
                : `${termosFiltrados.length} termo(s) encontrado(s)`}
            </span>
          </div>
        </div>
        
        {/* Lista de Termos */}
        {termosFiltrados.length > 0 ? (
          <div className="space-y-4">
            {termosFiltrados.map((termo) => {
              const cor = getCorCategoria(termo.categoria);
              const expandido = termoExpandido === termo.id;
              
              return (
                <div
                  key={termo.id}
                  className={`bg-white rounded-xl shadow-lg transition-all overflow-hidden ${
                    expandido ? 'ring-2 ring-purple-400' : ''
                  }`}
                >
                  {/* Header do Card */}
                  <div
                    onClick={() => toggleTermo(termo.id)}
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl">{termo.emoji}</div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {termo.termo}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-${cor}-100 text-${cor}-800`}>
                            {termo.categoria}
                          </span>
                          {!expandido && (
                            <p className="text-gray-600 mt-2 line-clamp-2">
                              {termo.definicao}
                            </p>
                          )}
                        </div>
                      </div>
                      <button className="text-2xl text-gray-400 hover:text-gray-600 transition">
                        {expandido ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Conteúdo Expandido */}
                  {expandido && (
                    <div className="px-6 pb-6 border-t border-gray-100 pt-6">
                      
                      {/* Definição */}
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <span className="text-xl">📖</span>
                          Definição
                        </h4>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                          {termo.definicao}
                        </p>
                      </div>
                      
                      {/* Exemplo Prático */}
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <span className="text-xl">💡</span>
                          Exemplo Prático
                        </h4>
                        <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                          {termo.exemplo}
                        </p>
                      </div>
                      
                      {/* Termos Relacionados */}
                      {termo.relacionados && termo.relacionados.length > 0 && (
                        <div>
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="text-xl">🔗</span>
                            Termos Relacionados
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {termo.relacionados.map((rel, index) => {
                              const termoRelacionado = TERMOS_TRIBUTARIOS.find(t => t.termo === rel);
                              return (
                                <button
                                  key={index}
                                  onClick={() => irParaTermo(rel)}
                                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                    termoRelacionado
                                      ? `bg-${getCorCategoria(termoRelacionado.categoria)}-100 text-${getCorCategoria(termoRelacionado.categoria)}-800 hover:bg-${getCorCategoria(termoRelacionado.categoria)}-200`
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  {rel}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
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
              Nenhum termo encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente buscar por outro termo ou ajustar os filtros
            </p>
            <button
              onClick={() => {
                setBusca('');
                setCategoriaFiltro('Todas');
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Limpar Filtros
            </button>
          </div>
        )}
        
        {/* Estatísticas */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">📊 Estatísticas do Glossário</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-black mb-2">{TERMOS_TRIBUTARIOS.length}</div>
              <div className="text-purple-100">Termos Totais</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2">{CATEGORIAS.length}</div>
              <div className="text-purple-100">Categorias</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2">
                {Math.round(TERMOS_TRIBUTARIOS.reduce((acc, t) => acc + t.relacionados.length, 0) / TERMOS_TRIBUTARIOS.length)}
              </div>
              <div className="text-purple-100">Links/Termo</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2">100%</div>
              <div className="text-purple-100">Gratuito</div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

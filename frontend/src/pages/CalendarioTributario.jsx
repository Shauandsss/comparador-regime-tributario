import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

// Configuração do EmailJS
const EMAILJS_SERVICE_ID = 'service_lg075qe';
const EMAILJS_TEMPLATE_ID = 'template_86pvwv8';
const EMAILJS_PUBLIC_KEY = 'kC-JZCqDSVJBInkHg';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const OBRIGACOES = [
  // MENSAIS - DAS
  { id: 1, nome: 'DAS - Simples Nacional', tipo: 'mensal', dia: 20, regime: 'simples', categoria: 'pagamento', descricao: 'Pagamento do Documento de Arrecadação do Simples Nacional referente ao faturamento do mês anterior', cor: 'green' },
  
  // MENSAIS - Lucro Presumido
  { id: 2, nome: 'PIS/COFINS - Cumulativo', tipo: 'mensal', dia: 25, regime: 'presumido', categoria: 'pagamento', descricao: 'Pagamento de PIS (0,65%) e COFINS (3%) sobre o faturamento do mês anterior', cor: 'yellow' },
  { id: 3, nome: 'ISS - Municipal', tipo: 'mensal', dia: 10, regime: 'presumido', categoria: 'pagamento', descricao: 'Pagamento do ISS sobre serviços (varia por município, geralmente dia 10)', cor: 'yellow' },
  { id: 4, nome: 'DCTF - Mensal', tipo: 'mensal', dia: 15, regime: 'presumido', categoria: 'declaracao', descricao: 'Declaração de Débitos e Créditos Tributários Federais', cor: 'yellow' },
  { id: 5, nome: 'EFD-Contribuições', tipo: 'mensal', dia: 10, regime: 'presumido', categoria: 'declaracao', descricao: 'Escrituração Fiscal Digital de PIS/COFINS do mês anterior', cor: 'yellow' },
  
  // MENSAIS - Lucro Real
  { id: 6, nome: 'PIS/COFINS - Não-Cumulativo', tipo: 'mensal', dia: 25, regime: 'real', categoria: 'pagamento', descricao: 'Pagamento de PIS (1,65%) e COFINS (7,6%) com créditos sobre o faturamento do mês anterior', cor: 'red' },
  { id: 7, nome: 'IRPJ/CSLL por Estimativa', tipo: 'mensal', dia: 20, regime: 'real', categoria: 'pagamento', descricao: 'Pagamento mensal por estimativa de IRPJ e CSLL (apenas Lucro Real Anual)', cor: 'red' },
  { id: 8, nome: 'EFD-Contribuições', tipo: 'mensal', dia: 10, regime: 'real', categoria: 'declaracao', descricao: 'Escrituração Fiscal Digital de PIS/COFINS do mês anterior', cor: 'red' },
  { id: 9, nome: 'SPED Fiscal (ICMS/IPI)', tipo: 'mensal', dia: 15, regime: 'real', categoria: 'declaracao', descricao: 'Escrituração Fiscal Digital de ICMS e IPI', cor: 'red' },
  
  // TRIMESTRAIS
  { id: 10, nome: 'IRPJ - Trimestral', tipo: 'trimestral', dia: 31, meses: [3, 6, 9, 12], regime: 'presumido', categoria: 'pagamento', descricao: 'Imposto de Renda Pessoa Jurídica sobre lucro presumido do trimestre', cor: 'yellow' },
  { id: 11, nome: 'CSLL - Trimestral', tipo: 'trimestral', dia: 31, meses: [3, 6, 9, 12], regime: 'presumido', categoria: 'pagamento', descricao: 'Contribuição Social sobre o Lucro Líquido do trimestre', cor: 'yellow' },
  { id: 12, nome: 'IRPJ - Trimestral', tipo: 'trimestral', dia: 31, meses: [3, 6, 9, 12], regime: 'real', categoria: 'pagamento', descricao: 'Imposto de Renda sobre Lucro Real (se optar por apuração trimestral)', cor: 'red' },
  { id: 13, nome: 'CSLL - Trimestral', tipo: 'trimestral', dia: 31, meses: [3, 6, 9, 12], regime: 'real', categoria: 'pagamento', descricao: 'CSLL sobre Lucro Real (se optar por apuração trimestral)', cor: 'red' },
  
  // ANUAIS
  { id: 14, nome: 'DEFIS - Simples Nacional', tipo: 'anual', dia: 31, mes: 3, regime: 'simples', categoria: 'declaracao', descricao: 'Declaração de Informações Socioeconômicas e Fiscais do ano anterior', cor: 'green' },
  { id: 15, nome: 'DIRF - Declaração do IR Retido', tipo: 'anual', dia: 28, mes: 2, regime: 'todos', categoria: 'declaracao', descricao: 'Declaração do Imposto de Renda Retido na Fonte do ano anterior', cor: 'blue' },
  { id: 16, nome: 'ECF - Escrituração Contábil Fiscal', tipo: 'anual', dia: 31, mes: 7, regime: 'presumido', categoria: 'declaracao', descricao: 'Substitui DIPJ - Declaração de IRPJ e CSLL do ano anterior', cor: 'yellow' },
  { id: 17, nome: 'ECF - Escrituração Contábil Fiscal', tipo: 'anual', dia: 31, mes: 7, regime: 'real', categoria: 'declaracao', descricao: 'Declaração anual completa com LALUR e balanços', cor: 'red' },
  { id: 18, nome: 'ECD - Escrituração Contábil Digital', tipo: 'anual', dia: 31, mes: 5, regime: 'presumido', categoria: 'declaracao', descricao: 'Livros contábeis digitais do ano anterior (obrigatório se tiver escrituração)', cor: 'yellow' },
  { id: 19, nome: 'ECD - Escrituração Contábil Digital', tipo: 'anual', dia: 31, mes: 5, regime: 'real', categoria: 'declaracao', descricao: 'Livros contábeis digitais do ano anterior (obrigatório)', cor: 'red' },
  { id: 20, nome: 'RAIS - Relação Anual', tipo: 'anual', dia: 31, mes: 3, regime: 'todos', categoria: 'declaracao', descricao: 'Relação Anual de Informações Sociais do ano anterior', cor: 'blue' },
  
  // ESPECÍFICAS
  { id: 21, nome: 'Opção/Exclusão Simples', tipo: 'especifico', dia: 31, mes: 1, regime: 'simples', categoria: 'opcao', descricao: 'Prazo final para optar ou excluir-se do Simples Nacional', cor: 'green' },
  { id: 22, nome: 'eSocial - Folha de Pagamento', tipo: 'mensal', dia: 15, regime: 'todos', categoria: 'declaracao', descricao: 'Envio dos eventos de folha de pagamento do mês anterior', cor: 'blue' },
  { id: 23, nome: 'FGTS - Guia de Recolhimento', tipo: 'mensal', dia: 7, regime: 'todos', categoria: 'pagamento', descricao: 'Pagamento do FGTS (8% sobre folha) do mês anterior', cor: 'blue' },
  { id: 24, nome: 'GPS - INSS Folha', tipo: 'mensal', dia: 20, regime: 'todos', categoria: 'pagamento', descricao: 'Guia da Previdência Social - recolhimento do INSS sobre folha (exceto Simples)', cor: 'blue' }
];

export default function CalendarioTributario() {
  const navigate = useNavigate();
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [regimeFiltro, setRegimeFiltro] = useState('todos');
  const [visualizacao, setVisualizacao] = useState('lista'); // 'lista' ou 'calendario'

  // Estados para captura de leads
  const [nomeLead, setNomeLead] = useState(''); // Nome (opcional)
  const [emailLead, setEmailLead] = useState('');
  const [regimeLead, setRegimeLead] = useState(''); // Regime do lead
  const [leadStatus, setLeadStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [leadMessage, setLeadMessage] = useState('');

  // Mapeamento de regime para nome legível
  const getNomeRegime = (regime) => {
    const nomes = {
      'simples': 'Simples Nacional',
      'presumido': 'Lucro Presumido',
      'real': 'Lucro Real',
      'nao_sei': 'Ainda não sei / Preciso de ajuda'
    };
    return nomes[regime] || regime;
  };

  // Função para enviar e-mail via EmailJS
  const sendLeadEmail = async (nome, email, regime) => {
    try {
      setLeadStatus('loading');
      
      const regimeFormatado = getNomeRegime(regime);
      const nomeFormatado = nome ? nome : 'Não informado';
      
      // Parâmetros do template EmailJS (usando variáveis do template existente)
      const templateParams = {
        title: 'Novo Lead - Calendário Tributário',
        name: nomeFormatado,
        time: new Date().toLocaleString('pt-BR'),
        message: `📧 Novo lead inscrito!\n\n👤 Nome: ${nomeFormatado}\n📧 E-mail: ${email}\n🏢 Regime: ${regimeFormatado}`,
        email: email
      };

      // Enviar via EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('EmailJS Response:', response);
      
      setLeadStatus('success');
      setLeadMessage('Inscrição realizada! Você receberá os lembretes mensalmente.');
      setNomeLead(''); // Limpar campos
      setEmailLead('');
      setRegimeLead('');
      
      // Resetar mensagem após 5 segundos
      setTimeout(() => {
        setLeadStatus('idle');
        setLeadMessage('');
      }, 5000);

    } catch (error) {
      console.error('Erro ao enviar email:', error);
      setLeadStatus('error');
      setLeadMessage('Ocorreu um erro no envio. Tente novamente.');
      
      // Resetar mensagem após 5 segundos
      setTimeout(() => {
        setLeadStatus('idle');
        setLeadMessage('');
      }, 5000);
    }
  };

  // Handler do formulário de inscrição
  const handleLeadSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailLead || !emailRegex.test(emailLead)) {
      setLeadStatus('error');
      setLeadMessage('Por favor, insira um e-mail válido.');
      setTimeout(() => {
        setLeadStatus('idle');
        setLeadMessage('');
      }, 3000);
      return;
    }

    // Validação do regime tributário (obrigatório)
    if (!regimeLead) {
      setLeadStatus('error');
      setLeadMessage('Por favor, selecione seu regime tributário.');
      setTimeout(() => {
        setLeadStatus('idle');
        setLeadMessage('');
      }, 3000);
      return;
    }

    sendLeadEmail(nomeLead, emailLead, regimeLead);
  };

  // Obrigações do mês selecionado
  const obrigacoesMes = useMemo(() => {
    const mesAtual = mesSelecionado + 1;
    
    return OBRIGACOES.filter(obg => {
      // Filtro de regime
      if (regimeFiltro !== 'todos' && obg.regime !== regimeFiltro && obg.regime !== 'todos') {
        return false;
      }

      // Filtro por tipo
      if (obg.tipo === 'mensal') return true;
      if (obg.tipo === 'trimestral' && obg.meses.includes(mesAtual)) return true;
      if (obg.tipo === 'anual' && obg.mes === mesAtual) return true;
      if (obg.tipo === 'especifico' && obg.mes === mesAtual) return true;
      
      return false;
    }).sort((a, b) => a.dia - b.dia);
  }, [mesSelecionado, regimeFiltro]);

  // Cor por regime
  const getCorRegime = (regime) => {
    const cores = {
      'simples': 'green',
      'presumido': 'yellow',
      'real': 'red',
      'todos': 'blue'
    };
    return cores[regime] || 'gray';
  };

  // Ícone por categoria
  const getIconeCategoria = (categoria) => {
    const icones = {
      'pagamento': '💰',
      'declaracao': '📄',
      'opcao': '⚙️'
    };
    return icones[categoria] || '📋';
  };

  // Dias do mês
  const getDiasMes = (mes) => {
    const ano = 2025;
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    
    const dias = [];
    
    // Dias vazios no início
    for (let i = 0; i < primeiroDia; i++) {
      dias.push(null);
    }
    
    // Dias do mês
    for (let dia = 1; dia <= ultimoDia; dia++) {
      const obrigacoesDia = obrigacoesMes.filter(obg => obg.dia === dia);
      dias.push({ dia, obrigacoes: obrigacoesDia });
    }
    
    return dias;
  };

  const diasMes = getDiasMes(mesSelecionado);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-2"
          >
            ← Voltar para Home
          </button>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📅 Calendário Tributário 2025
          </h1>
          <p className="text-gray-600 text-lg">
            Nunca mais perca um prazo! Veja todas as obrigações fiscais do seu regime
          </p>
        </div>

        {/* 🔥 CTA Captura de Leads - DESTAQUE NO TOPO */}
        <div className="mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-gradient-x"></div>
          <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-6 md:p-8 text-white border-4 border-white/20">
            {/* Badge de destaque */}
            <div className="absolute -top-1 -right-1 md:top-4 md:right-4">
              <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs md:text-sm font-black animate-pulse shadow-lg">
                🎁 GRÁTIS
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Ícone animado */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="text-6xl md:text-7xl animate-bounce">🔔</div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl md:text-3xl font-black mb-2">
                  Nunca Mais Perca um Prazo! 
                </h3>
                <p className="text-emerald-100 text-sm md:text-base mb-4">
                  Receba <strong>lembretes mensais</strong> das obrigações tributárias direto no seu e-mail. 
                  <span className="hidden md:inline"> Mais de <strong>500 empresários</strong> já usam!</span>
                </p>

                {/* Formulário inline */}
                <form onSubmit={handleLeadSubmit} className="flex flex-col gap-3 max-w-2xl mx-auto lg:mx-0">
                  {/* Linha 1: Nome e Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                      <input
                        type="text"
                        value={nomeLead}
                        onChange={(e) => setNomeLead(e.target.value)}
                        placeholder="Nome (opcional)"
                        disabled={leadStatus === 'loading'}
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 disabled:opacity-50 font-medium shadow-inner"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
                      <input
                        type="email"
                        value={emailLead}
                        onChange={(e) => setEmailLead(e.target.value)}
                        placeholder="E-mail *"
                        disabled={leadStatus === 'loading'}
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 disabled:opacity-50 font-medium shadow-inner"
                      />
                    </div>
                  </div>
                  {/* Linha 2: Regime e Botão */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🏢</span>
                      <select
                        value={regimeLead}
                        onChange={(e) => setRegimeLead(e.target.value)}
                        disabled={leadStatus === 'loading'}
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/50 disabled:opacity-50 font-medium shadow-inner appearance-none bg-white cursor-pointer"
                      >
                        <option value="">Regime tributário *</option>
                        <option value="simples">🟢 Simples Nacional</option>
                        <option value="presumido">🟡 Lucro Presumido</option>
                        <option value="real">🔴 Lucro Real</option>
                        <option value="nao_sei">🤔 Não sei ainda</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={leadStatus === 'loading'}
                      className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg whitespace-nowrap ${
                        leadStatus === 'loading'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300 hover:scale-105 hover:shadow-xl'
                      }`}
                    >
                      {leadStatus === 'loading' ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Enviando...
                        </span>
                      ) : (
                        '🚀 Quero Receber!'
                      )}
                    </button>
                  </div>
                </form>

                {/* Feedback visual */}
                {leadMessage && (
                  <div className={`mt-3 p-3 rounded-lg font-semibold text-sm ${
                    leadStatus === 'success' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-red-500/30 text-white'
                  }`}>
                    {leadStatus === 'success' ? '✅' : '❌'} {leadMessage}
                  </div>
                )}

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-3 text-xs text-emerald-200">
                  <span className="flex items-center gap-1">🔒 100% Seguro</span>
                  <span className="flex items-center gap-1">📬 Sem Spam</span>
                  <span className="flex items-center gap-1">🎯 Lembretes Úteis</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          
          {/* Seletor de Mês */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📆 Selecione o Mês
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {MESES.map((mes, idx) => (
                <button
                  key={idx}
                  onClick={() => setMesSelecionado(idx)}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                    mesSelecionado === idx
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mes.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por Regime */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🏢 Filtrar por Regime
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRegimeFiltro('todos')}
                className={`px-5 py-2.5 rounded-full font-semibold transition-all ${
                  regimeFiltro === 'todos'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos os Regimes
              </button>
              <button
                onClick={() => setRegimeFiltro('simples')}
                className={`px-5 py-2.5 rounded-full font-semibold transition-all ${
                  regimeFiltro === 'simples'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🟢 Simples Nacional
              </button>
              <button
                onClick={() => setRegimeFiltro('presumido')}
                className={`px-5 py-2.5 rounded-full font-semibold transition-all ${
                  regimeFiltro === 'presumido'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🟡 Lucro Presumido
              </button>
              <button
                onClick={() => setRegimeFiltro('real')}
                className={`px-5 py-2.5 rounded-full font-semibold transition-all ${
                  regimeFiltro === 'real'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔴 Lucro Real
              </button>
            </div>
          </div>

          {/* Tipo de Visualização */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              👁️ Visualização
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setVisualizacao('lista')}
                className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                  visualizacao === 'lista'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📋 Lista
              </button>
              <button
                onClick={() => setVisualizacao('calendario')}
                className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                  visualizacao === 'calendario'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📅 Calendário
              </button>
            </div>
          </div>

          {/* Contador */}
          <div className="mt-4 text-center">
            <span className="text-gray-600 font-semibold">
              {obrigacoesMes.length} obrigação(ões) em {MESES[mesSelecionado]}
            </span>
          </div>
        </div>

        {/* Visualização Lista */}
        {visualizacao === 'lista' && (
          <div className="space-y-4">
            {obrigacoesMes.length > 0 ? (
              obrigacoesMes.map((obg) => (
                <div
                  key={obg.id}
                  className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${getCorRegime(obg.regime)}-500`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl">{getIconeCategoria(obg.categoria)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">
                            {obg.nome}
                          </h3>
                          <span className={`px-3 py-1 bg-${getCorRegime(obg.regime)}-100 text-${getCorRegime(obg.regime)}-800 rounded-full text-xs font-bold`}>
                            {obg.regime === 'todos' ? 'Todos' : obg.regime === 'simples' ? 'Simples' : obg.regime === 'presumido' ? 'Presumido' : 'Real'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">
                          {obg.descricao}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-bold text-gray-800">
                            📅 Vencimento: Dia {obg.dia}
                          </span>
                          <span className={`px-2 py-1 bg-${getCorRegime(obg.regime)}-50 text-${getCorRegime(obg.regime)}-700 rounded`}>
                            {obg.tipo === 'mensal' ? 'Mensal' : obg.tipo === 'trimestral' ? 'Trimestral' : obg.tipo === 'anual' ? 'Anual' : 'Específico'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-black text-${getCorRegime(obg.regime)}-600`}>
                        {obg.dia}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {MESES[mesSelecionado].substring(0, 3)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Nenhuma obrigação neste mês!
                </h3>
                <p className="text-gray-600">
                  Para o regime selecionado, não há obrigações em {MESES[mesSelecionado]}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Visualização Calendário */}
        {visualizacao === 'calendario' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {MESES[mesSelecionado]} 2025
            </h2>

            {/* Dias da Semana */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
                <div key={dia} className="text-center font-bold text-gray-600 py-2">
                  {dia}
                </div>
              ))}
            </div>

            {/* Dias do Mês */}
            <div className="grid grid-cols-7 gap-2">
              {diasMes.map((diaInfo, idx) => {
                if (!diaInfo) {
                  return <div key={`empty-${idx}`} className="aspect-square"></div>;
                }

                const { dia, obrigacoes } = diaInfo;
                const temObrigacoes = obrigacoes.length > 0;

                return (
                  <div
                    key={dia}
                    className={`aspect-square border-2 rounded-lg p-2 transition-all ${
                      temObrigacoes
                        ? 'border-indigo-400 bg-indigo-50 hover:bg-indigo-100 cursor-pointer'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-gray-800 mb-1">{dia}</div>
                    {temObrigacoes && (
                      <div className="space-y-1">
                        {obrigacoes.slice(0, 2).map((obg) => (
                          <div
                            key={obg.id}
                            className={`text-xs px-1 py-0.5 bg-${getCorRegime(obg.regime)}-200 text-${getCorRegime(obg.regime)}-800 rounded truncate`}
                            title={obg.nome}
                          >
                            {getIconeCategoria(obg.categoria)} {obg.nome.substring(0, 8)}...
                          </div>
                        ))}
                        {obrigacoes.length > 2 && (
                          <div className="text-xs text-gray-600 font-semibold">
                            +{obrigacoes.length - 2} mais
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legenda */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">📌 Legenda</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-3">Regimes:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>🟢 Simples Nacional</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>🟡 Lucro Presumido</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>🔴 Lucro Real</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>🔵 Todos os Regimes</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-3">Categorias:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>💰 Pagamento de Impostos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📄 Declarações e SPED</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⚙️ Opções/Configurações</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/10 rounded-lg">
            <p className="text-sm text-indigo-100">
              ⚠️ <strong>Importante:</strong> Prazos podem variar por município/estado. Quando o vencimento cair em final de semana ou feriado, é prorrogado para o próximo dia útil. Confirme sempre com seu contador!
            </p>
          </div>
        </div>

        {/* CTA Calculadoras */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            🧮 Calcule Seus Impostos
          </h3>
          <p className="text-gray-600 mb-6">
            Use nossas calculadoras para saber quanto pagar em cada obrigação
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/calculadora-das')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              🟢 Calcular DAS
            </button>
            <button
              onClick={() => navigate('/calculadora-presumido')}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition"
            >
              🟡 Calcular Presumido
            </button>
            <button
              onClick={() => navigate('/calculadora-real')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              🔴 Calcular Real
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

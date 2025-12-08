import { useState } from 'react';
import { AlertTriangle, TrendingUp, Shield, Target, AlertCircle, CheckCircle2, XCircle, Info, FileText, Calculator } from 'lucide-react';

export default function AnalisadorImpactoTransicao() {
  const [formData, setFormData] = useState({
    faturamento: '',
    margem: '',
    estado: 'SP',
    segmento: 'comercio',
    usoCreditos: '30',
    estruturaFiscal: 'basica'
  });

  const [resultado, setResultado] = useState(null);

  const estados = [
    { sigla: 'SP', nome: 'São Paulo', impacto: 'medio' },
    { sigla: 'RJ', nome: 'Rio de Janeiro', impacto: 'alto' },
    { sigla: 'MG', nome: 'Minas Gerais', impacto: 'medio' },
    { sigla: 'RS', nome: 'Rio Grande do Sul', impacto: 'alto' },
    { sigla: 'PR', nome: 'Paraná', impacto: 'medio' },
    { sigla: 'BA', nome: 'Bahia', impacto: 'baixo' },
    { sigla: 'CE', nome: 'Ceará', impacto: 'baixo' },
    { sigla: 'PE', nome: 'Pernambuco', impacto: 'medio' },
    { sigla: 'GO', nome: 'Goiás', impacto: 'medio' },
    { sigla: 'DF', nome: 'Distrito Federal', impacto: 'baixo' }
  ];

  const segmentos = {
    comercio: {
      nome: 'Comércio',
      risco: 'medio',
      creditosEsperados: 15,
      impactoReforma: 'moderado'
    },
    industria: {
      nome: 'Indústria',
      risco: 'alto',
      creditosEsperados: 35,
      impactoReforma: 'alto'
    },
    servicos: {
      nome: 'Serviços',
      risco: 'baixo',
      creditosEsperados: 5,
      impactoReforma: 'baixo'
    },
    construcao: {
      nome: 'Construção Civil',
      risco: 'alto',
      creditosEsperados: 25,
      impactoReforma: 'alto'
    },
    tecnologia: {
      nome: 'Tecnologia',
      risco: 'baixo',
      creditosEsperados: 8,
      impactoReforma: 'baixo'
    },
    saude: {
      nome: 'Saúde',
      risco: 'medio',
      creditosEsperados: 12,
      impactoReforma: 'moderado'
    },
    educacao: {
      nome: 'Educação',
      risco: 'baixo',
      creditosEsperados: 7,
      impactoReforma: 'baixo'
    },
    alimentacao: {
      nome: 'Alimentação',
      risco: 'medio',
      creditosEsperados: 18,
      impactoReforma: 'moderado'
    }
  };

  const estruturasFiscais = {
    basica: {
      nome: 'Básica (Contador Externo)',
      pontosRisco: 15,
      capacidadeAdaptacao: 'baixa'
    },
    intermediaria: {
      nome: 'Intermediária (Contador + Sistema)',
      pontosRisco: 8,
      capacidadeAdaptacao: 'media'
    },
    avancada: {
      nome: 'Avançada (Equipe Fiscal Interna)',
      pontosRisco: 3,
      capacidadeAdaptacao: 'alta'
    }
  };

  const analisar = () => {
    const faturamentoValor = parseFloat(formData.faturamento) || 0;
    const margemValor = parseFloat(formData.margem) || 0;
    const usoCreditosValor = parseFloat(formData.usoCreditos) || 0;
    const segmento = segmentos[formData.segmento];
    const estadoInfo = estados.find(e => e.sigla === formData.estado);
    const estrutura = estruturasFiscais[formData.estruturaFiscal];

    // Cálculo do Score de Risco (0-100)
    let riskScore = 0;

    // Fator 1: Tamanho da empresa (25 pontos)
    if (faturamentoValor > 50000000) riskScore += 25;
    else if (faturamentoValor > 10000000) riskScore += 18;
    else if (faturamentoValor > 1000000) riskScore += 12;
    else riskScore += 5;

    // Fator 2: Margem de lucro (20 pontos)
    if (margemValor < 10) riskScore += 20;
    else if (margemValor < 20) riskScore += 12;
    else if (margemValor < 30) riskScore += 6;
    else riskScore += 2;

    // Fator 3: Uso de créditos (20 pontos)
    const creditosEsperados = segmento.creditosEsperados;
    const diferencaCreditos = Math.abs(usoCreditosValor - creditosEsperados);
    if (diferencaCreditos > 20) riskScore += 20;
    else if (diferencaCreditos > 10) riskScore += 12;
    else riskScore += 5;

    // Fator 4: Segmento (15 pontos)
    if (segmento.risco === 'alto') riskScore += 15;
    else if (segmento.risco === 'medio') riskScore += 8;
    else riskScore += 3;

    // Fator 5: Estado (10 pontos)
    if (estadoInfo.impacto === 'alto') riskScore += 10;
    else if (estadoInfo.impacto === 'medio') riskScore += 6;
    else riskScore += 2;

    // Fator 6: Estrutura fiscal (10 pontos)
    riskScore += estrutura.pontosRisco;

    // Normalizar para 0-100
    riskScore = Math.min(100, riskScore);

    // Classificação do risco
    let nivelRisco, corRisco, iconeRisco;
    if (riskScore >= 70) {
      nivelRisco = 'CRÍTICO';
      corRisco = 'red';
      iconeRisco = 'XCircle';
    } else if (riskScore >= 50) {
      nivelRisco = 'ALTO';
      corRisco = 'orange';
      iconeRisco = 'AlertTriangle';
    } else if (riskScore >= 30) {
      nivelRisco = 'MODERADO';
      corRisco = 'yellow';
      iconeRisco = 'AlertCircle';
    } else {
      nivelRisco = 'BAIXO';
      corRisco = 'green';
      iconeRisco = 'CheckCircle2';
    }

    // Gerar recomendações
    const recomendacoes = [];

    if (riskScore >= 70) {
      recomendacoes.push({
        prioridade: 'urgente',
        titulo: 'Consultoria Especializada Imediata',
        descricao: 'Contrate consultoria especializada em reforma tributária AGORA. Seu risco é crítico.',
        impacto: 'Alto'
      });
      recomendacoes.push({
        prioridade: 'urgente',
        titulo: 'Revisão Completa do Modelo de Negócio',
        descricao: 'Avalie se o modelo de negócio atual é sustentável na nova estrutura tributária.',
        impacto: 'Alto'
      });
    }

    if (margemValor < 15) {
      recomendacoes.push({
        prioridade: 'alta',
        titulo: 'Aumento de Preços ou Redução de Custos',
        descricao: 'Margens baixas podem inviabilizar a empresa com o IBS/CBS. Revise sua precificação.',
        impacto: 'Médio'
      });
    }

    if (estrutura.capacidadeAdaptacao === 'baixa') {
      recomendacoes.push({
        prioridade: 'alta',
        titulo: 'Modernização da Estrutura Fiscal',
        descricao: 'Invista em sistemas e profissionais qualificados para a transição.',
        impacto: 'Alto'
      });
    }

    if (diferencaCreditos > 15) {
      recomendacoes.push({
        prioridade: 'media',
        titulo: 'Mapeamento de Créditos Tributários',
        descricao: 'Identifique todos os créditos possíveis para reduzir sua carga efetiva.',
        impacto: 'Médio'
      });
    }

    if (segmento.risco === 'alto') {
      recomendacoes.push({
        prioridade: 'alta',
        titulo: 'Simulações Mensais de Impacto',
        descricao: 'Seu segmento terá mudanças significativas. Monitore continuamente.',
        impacto: 'Alto'
      });
    }

    if (faturamentoValor > 10000000) {
      recomendacoes.push({
        prioridade: 'media',
        titulo: 'Planejamento de Fluxo de Caixa',
        descricao: 'Grandes empresas terão impactos significativos. Prepare reservas financeiras.',
        impacto: 'Médio'
      });
    }

    // Sempre adicionar recomendações gerais
    recomendacoes.push({
      prioridade: 'baixa',
      titulo: 'Capacitação da Equipe',
      descricao: 'Treine sua equipe sobre IBS, CBS e Split Payment.',
      impacto: 'Baixo'
    });

    recomendacoes.push({
      prioridade: 'baixa',
      titulo: 'Acompanhamento da Legislação',
      descricao: 'Acompanhe as leis complementares que regulamentarão a reforma.',
      impacto: 'Baixo'
    });

    // Estimativa de impacto financeiro
    const aliquotaAtual = 17.5; // Média ICMS + PIS/COFINS
    const aliquotaNova = 26.5; // IVA padrão
    const creditosAtuais = (faturamentoValor * usoCreditosValor) / 100;
    const tributacaoAtual = (faturamentoValor * aliquotaAtual / 100) - creditosAtuais;
    const creditosNovos = (faturamentoValor * usoCreditosValor * 1.2) / 100; // 20% mais créditos
    const tributacaoNova = (faturamentoValor * aliquotaNova / 100) - creditosNovos;
    const diferencaFinanceira = tributacaoNova - tributacaoAtual;
    const percentualImpacto = tributacaoAtual > 0 ? (diferencaFinanceira / tributacaoAtual) * 100 : 0;

    setResultado({
      riskScore: riskScore,
      nivelRisco: nivelRisco,
      corRisco: corRisco,
      iconeRisco: iconeRisco,
      
      analise: {
        faturamento: faturamentoValor,
        margem: margemValor,
        creditos: usoCreditosValor,
        segmento: segmento.nome,
        estado: estadoInfo.nome,
        estrutura: estrutura.nome
      },
      
      fatores: {
        tamanho: faturamentoValor > 10000000 ? 'Grande' : faturamentoValor > 1000000 ? 'Média' : 'Pequena',
        margemStatus: margemValor < 15 ? 'Crítica' : margemValor < 25 ? 'Apertada' : 'Saudável',
        creditosStatus: diferencaCreditos > 15 ? 'Fora do padrão' : 'Adequado',
        segmentoRisco: segmento.risco,
        estadoImpacto: estadoInfo.impacto,
        estruturaCapacidade: estrutura.capacidadeAdaptacao
      },
      
      recomendacoes: recomendacoes,
      
      impactoFinanceiro: {
        tributacaoAtual: tributacaoAtual,
        tributacaoNova: tributacaoNova,
        diferenca: diferencaFinanceira,
        percentual: percentualImpacto,
        creditosAtuais: creditosAtuais,
        creditosNovos: creditosNovos
      },
      
      proximosPassos: [
        'Fazer simulações detalhadas com seus dados reais',
        'Consultar especialista em planejamento tributário',
        'Mapear todos os créditos tributários disponíveis',
        'Revisar contratos e precificação',
        'Implementar sistema de gestão tributária'
      ]
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatPercent = (valor) => {
    return `${valor.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Analisador de Impacto Tributário na Transição
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Avalie o risco da sua empresa durante a transição para IBS/CBS e receba recomendações 
            personalizadas para se preparar.
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Faturamento Anual (R$)
              </label>
              <input
                type="number"
                name="faturamento"
                value={formData.faturamento}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="5000000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Margem de Lucro (%)
              </label>
              <input
                type="number"
                name="margem"
                value={formData.margem}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="15"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado Principal de Operação
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {estados.map(estado => (
                  <option key={estado.sigla} value={estado.sigla}>
                    {estado.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Segmento de Atuação
              </label>
              <select
                name="segmento"
                value={formData.segmento}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {Object.entries(segmentos).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Uso Atual de Créditos Tributários (%)
              </label>
              <input
                type="number"
                name="usoCreditos"
                value={formData.usoCreditos}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estrutura Fiscal Atual
              </label>
              <select
                name="estruturaFiscal"
                value={formData.estruturaFiscal}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {Object.entries(estruturasFiscais).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={analisar}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Analisar Risco e Impacto
          </button>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="space-y-6">
            
            {/* Score de Risco */}
            <div className={`rounded-2xl shadow-2xl p-8 ${
              resultado.corRisco === 'red' 
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' 
                : resultado.corRisco === 'orange'
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                : resultado.corRisco === 'yellow'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
            }`}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-full mb-4">
                  {resultado.iconeRisco === 'XCircle' && <XCircle className="w-12 h-12" />}
                  {resultado.iconeRisco === 'AlertTriangle' && <AlertTriangle className="w-12 h-12" />}
                  {resultado.iconeRisco === 'AlertCircle' && <AlertCircle className="w-12 h-12" />}
                  {resultado.iconeRisco === 'CheckCircle2' && <CheckCircle2 className="w-12 h-12" />}
                </div>
                
                <h2 className="text-3xl font-bold mb-2">
                  Nível de Risco: {resultado.nivelRisco}
                </h2>
                
                <div className="text-7xl font-black mb-4">
                  {resultado.riskScore}
                </div>
                
                <div className="text-xl mb-6">
                  Score de Risco (0-100)
                </div>

                <div className="max-w-md mx-auto">
                  <div className="w-full bg-white/30 backdrop-blur rounded-full h-6 overflow-hidden">
                    <div 
                      className="bg-white h-6 transition-all duration-1000"
                      style={{ width: `${resultado.riskScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Análise por Fatores */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-red-600" />
                Análise por Fatores
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">Porte da Empresa</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{resultado.fatores.tamanho}</div>
                  <div className="text-sm text-gray-600">{formatMoeda(resultado.analise.faturamento)}/ano</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">Margem de Lucro</div>
                  <div className={`text-2xl font-bold mb-1 ${
                    resultado.fatores.margemStatus === 'Crítica' ? 'text-red-600' :
                    resultado.fatores.margemStatus === 'Apertada' ? 'text-orange-600' :
                    'text-green-600'
                  }`}>
                    {resultado.fatores.margemStatus}
                  </div>
                  <div className="text-sm text-gray-600">{formatPercent(resultado.analise.margem)}</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">Uso de Créditos</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{resultado.fatores.creditosStatus}</div>
                  <div className="text-sm text-gray-600">{formatPercent(resultado.analise.creditos)}</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">Segmento</div>
                  <div className="text-xl font-bold text-gray-900 mb-1">{resultado.analise.segmento}</div>
                  <div className={`text-sm font-semibold ${
                    resultado.fatores.segmentoRisco === 'alto' ? 'text-red-600' :
                    resultado.fatores.segmentoRisco === 'medio' ? 'text-orange-600' :
                    'text-green-600'
                  }`}>
                    Risco {resultado.fatores.segmentoRisco}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">Estado</div>
                  <div className="text-xl font-bold text-gray-900 mb-1">{resultado.analise.estado}</div>
                  <div className={`text-sm font-semibold ${
                    resultado.fatores.estadoImpacto === 'alto' ? 'text-red-600' :
                    resultado.fatores.estadoImpacto === 'medio' ? 'text-orange-600' :
                    'text-green-600'
                  }`}>
                    Impacto {resultado.fatores.estadoImpacto}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">Estrutura Fiscal</div>
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {resultado.analise.estrutura.split('(')[0]}
                  </div>
                  <div className={`text-sm font-semibold ${
                    resultado.fatores.estruturaCapacidade === 'baixa' ? 'text-red-600' :
                    resultado.fatores.estruturaCapacidade === 'media' ? 'text-orange-600' :
                    'text-green-600'
                  }`}>
                    Capacidade {resultado.fatores.estruturaCapacidade}
                  </div>
                </div>
              </div>
            </div>

            {/* Impacto Financeiro */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Estimativa de Impacto Financeiro
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-4">Sistema Atual</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Tributação bruta</span>
                      <span className="font-semibold">{formatMoeda(resultado.impactoFinanceiro.tributacaoAtual + resultado.impactoFinanceiro.creditosAtuais)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Créditos</span>
                      <span className="font-semibold text-green-600">- {formatMoeda(resultado.impactoFinanceiro.creditosAtuais)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-bold text-gray-900">Tributação líquida</span>
                      <span className="font-bold text-blue-600">{formatMoeda(resultado.impactoFinanceiro.tributacaoAtual)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-4">Reforma (IBS/CBS)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Tributação bruta</span>
                      <span className="font-semibold">{formatMoeda(resultado.impactoFinanceiro.tributacaoNova + resultado.impactoFinanceiro.creditosNovos)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Créditos</span>
                      <span className="font-semibold text-green-600">- {formatMoeda(resultado.impactoFinanceiro.creditosNovos)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-bold text-gray-900">Tributação líquida</span>
                      <span className="font-bold text-purple-600">{formatMoeda(resultado.impactoFinanceiro.tributacaoNova)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-6 ${
                resultado.impactoFinanceiro.diferenca > 0 
                  ? 'bg-red-100 border-2 border-red-300' 
                  : 'bg-green-100 border-2 border-green-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">Diferença Anual</div>
                    <div className={`text-4xl font-black ${
                      resultado.impactoFinanceiro.diferenca > 0 ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {resultado.impactoFinanceiro.diferenca > 0 ? '+' : ''}{formatMoeda(resultado.impactoFinanceiro.diferenca)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-700 mb-1">Variação</div>
                    <div className={`text-4xl font-black ${
                      resultado.impactoFinanceiro.diferenca > 0 ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {resultado.impactoFinanceiro.percentual > 0 ? '+' : ''}{formatPercent(resultado.impactoFinanceiro.percentual)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recomendações */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-600" />
                Recomendações Personalizadas
              </h3>
              
              <div className="space-y-4">
                {resultado.recomendacoes.map((rec, index) => (
                  <div 
                    key={index}
                    className={`rounded-lg p-6 border-l-4 ${
                      rec.prioridade === 'urgente' 
                        ? 'bg-red-50 border-red-600' 
                        : rec.prioridade === 'alta'
                        ? 'bg-orange-50 border-orange-600'
                        : rec.prioridade === 'media'
                        ? 'bg-yellow-50 border-yellow-600'
                        : 'bg-blue-50 border-blue-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            rec.prioridade === 'urgente' 
                              ? 'bg-red-600 text-white' 
                              : rec.prioridade === 'alta'
                              ? 'bg-orange-600 text-white'
                              : rec.prioridade === 'media'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-blue-600 text-white'
                          }`}>
                            {rec.prioridade}
                          </span>
                          <h4 className="font-bold text-gray-900">{rec.titulo}</h4>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{rec.descricao}</p>
                        <div className="text-xs text-gray-600">
                          <span className="font-semibold">Impacto esperado:</span> {rec.impacto}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximos Passos */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Próximos Passos Recomendados
              </h3>
              
              <ol className="space-y-3">
                {resultado.proximosPassos.map((passo, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="text-lg">{passo}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Info Card */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-2">
                    ⚠️ Esta é uma Análise Preliminar
                  </h4>
                  <p className="text-amber-800 leading-relaxed text-sm">
                    Os resultados são estimativas baseadas em médias setoriais. Para uma análise completa e precisa, 
                    consulte um especialista em planejamento tributário que possa avaliar todos os detalhes da sua operação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Artigo SEO */}
        <article className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-lg max-w-none">
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Por Que Você Precisa Analisar o Impacto Tributário da Reforma
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A <strong>Reforma Tributária de 2026</strong> não é apenas uma mudança de siglas (ICMS/PIS/COFINS para IBS/CBS). 
            É uma transformação completa na forma como impostos são calculados, cobrados e creditados. Empresas que não se 
            prepararem podem enfrentar <strong>aumento de custos de 20% a 40%</strong>, problemas de fluxo de caixa e até 
            inviabilidade do negócio.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            O <strong>Analisador de Impacto Tributário</strong> ajuda você a identificar os principais riscos e oportunidades 
            da transição, gerando um <strong>score de risco personalizado</strong> e recomendações específicas para sua realidade. 
            Quanto antes você agir, mais tempo terá para se adaptar.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            Como Funciona a Análise de Risco
          </h2>
          
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Score de Risco (0-100)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            O score é calculado com base em <strong>6 fatores críticos</strong>:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="py-3 px-4 border">Fator</th>
                  <th className="py-3 px-4 border text-center">Peso</th>
                  <th className="py-3 px-4 border">Como Avalia</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-red-50">
                  <td className="py-3 px-4 border font-semibold">Tamanho da Empresa</td>
                  <td className="py-3 px-4 border text-center font-bold">25%</td>
                  <td className="py-3 px-4 border text-sm">Faturamento anual (quanto maior, maior o risco)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border font-semibold">Margem de Lucro</td>
                  <td className="py-3 px-4 border text-center font-bold">20%</td>
                  <td className="py-3 px-4 border text-sm">Margens baixas (&lt;15%) são críticas</td>
                </tr>
                <tr className="bg-red-50">
                  <td className="py-3 px-4 border font-semibold">Uso de Créditos</td>
                  <td className="py-3 px-4 border text-center font-bold">20%</td>
                  <td className="py-3 px-4 border text-sm">Comparação com média do setor</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border font-semibold">Segmento</td>
                  <td className="py-3 px-4 border text-center font-bold">15%</td>
                  <td className="py-3 px-4 border text-sm">Indústria = alto risco; Serviços = baixo</td>
                </tr>
                <tr className="bg-red-50">
                  <td className="py-3 px-4 border font-semibold">Estado</td>
                  <td className="py-3 px-4 border text-center font-bold">10%</td>
                  <td className="py-3 px-4 border text-sm">Estados produtores terão mais impacto</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border font-semibold">Estrutura Fiscal</td>
                  <td className="py-3 px-4 border text-center font-bold">10%</td>
                  <td className="py-3 px-4 border text-sm">Capacidade de adaptação tecnológica</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            2. Interpretação do Score
          </h3>

          <div className="space-y-4 mb-6">
            <div className="bg-red-100 border-l-4 border-red-600 rounded-lg p-6">
              <h4 className="font-bold text-red-900 mb-2">🔴 Risco CRÍTICO (70-100 pontos)</h4>
              <p className="text-red-800 text-sm">
                <strong>Ação imediata necessária.</strong> Sua empresa pode inviabilizar-se na reforma sem mudanças 
                profundas. Contrate consultoria especializada agora.
              </p>
            </div>

            <div className="bg-orange-100 border-l-4 border-orange-600 rounded-lg p-6">
              <h4 className="font-bold text-orange-900 mb-2">🟠 Risco ALTO (50-69 pontos)</h4>
              <p className="text-orange-800 text-sm">
                <strong>Atenção urgente.</strong> Impactos significativos são esperados. Inicie planejamento 
                tributário e revisão de processos em até 6 meses.
              </p>
            </div>

            <div className="bg-yellow-100 border-l-4 border-yellow-600 rounded-lg p-6">
              <h4 className="font-bold text-yellow-900 mb-2">🟡 Risco MODERADO (30-49 pontos)</h4>
              <p className="text-yellow-800 text-sm">
                <strong>Monitoramento necessário.</strong> Impactos controláveis, mas exigem planejamento. 
                Comece simulações e mapeamento de créditos.
              </p>
            </div>

            <div className="bg-green-100 border-l-4 border-green-600 rounded-lg p-6">
              <h4 className="font-bold text-green-900 mb-2">🟢 Risco BAIXO (0-29 pontos)</h4>
              <p className="text-green-800 text-sm">
                <strong>Situação favorável.</strong> Seu negócio está bem posicionado. Mantenha-se atualizado 
                e aproveite oportunidades da reforma.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            Os 6 Fatores de Risco Explicados
          </h2>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Fator 1: Tamanho da Empresa (25 pontos)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Empresas maiores têm <strong>maior complexidade operacional</strong> e volume tributário:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>Acima de R$ 50 milhões/ano:</strong> Risco máximo (25 pontos). Impacto pode chegar a milhões.</li>
            <li><strong>R$ 10-50 milhões/ano:</strong> Risco alto (18 pontos). Necessidade de consultoria especializada.</li>
            <li><strong>R$ 1-10 milhões/ano:</strong> Risco médio (12 pontos). Planejamento essencial.</li>
            <li><strong>Abaixo de R$ 1 milhão/ano:</strong> Risco baixo (5 pontos). Impacto mais controlável.</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Fator 2: Margem de Lucro (20 pontos)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Margens apertadas não suportam aumento de carga tributária:
          </p>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-6 overflow-x-auto">
            <h4 className="text-lg font-bold mb-3 text-white">Exemplo Crítico</h4>
            <pre className="text-sm">
{`Empresa com margem de 8%:
• Faturamento: R$ 10 milhões
• Lucro atual: R$ 800 mil (8%)
• Aumento tributário: +3% = R$ 300 mil
• Nova margem: 5% = R$ 500 mil

Redução de 37,5% no lucro! 🚨`}
            </pre>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Fator 3: Uso de Créditos Tributários (20 pontos)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Cada segmento tem um percentual médio de créditos. Desvios indicam problemas:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-3 px-4 border">Segmento</th>
                  <th className="py-3 px-4 border text-center">Créditos Esperados</th>
                  <th className="py-3 px-4 border">Interpretação</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-blue-50">
                  <td className="py-3 px-4 border font-semibold">Indústria</td>
                  <td className="py-3 px-4 border text-center font-bold">35%</td>
                  <td className="py-3 px-4 border text-sm">Muitos insumos = créditos altos</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border font-semibold">Construção</td>
                  <td className="py-3 px-4 border text-center font-bold">25%</td>
                  <td className="py-3 px-4 border text-sm">Materiais tributados geram créditos</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="py-3 px-4 border font-semibold">Comércio</td>
                  <td className="py-3 px-4 border text-center font-bold">15%</td>
                  <td className="py-3 px-4 border text-sm">Revenda com créditos moderados</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border font-semibold">Serviços</td>
                  <td className="py-3 px-4 border text-center font-bold">5%</td>
                  <td className="py-3 px-4 border text-sm">Poucos insumos = créditos baixos</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Fator 4: Segmento de Atuação (15 pontos)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Alguns setores serão mais impactados:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>Alto Risco:</strong> Indústria, Construção (mudanças profundas no crédito)</li>
            <li><strong>Risco Médio:</strong> Comércio, Saúde, Alimentação (impactos moderados)</li>
            <li><strong>Baixo Risco:</strong> Serviços, Tecnologia, Educação (beneficiados pela reforma)</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Fator 5: Estado de Operação (10 pontos)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Estados produtores perderão receita na transição, podendo criar dificuldades:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>Alto Impacto:</strong> SP, MG, RS (perda de receita, possíveis compensações)</li>
            <li><strong>Médio Impacto:</strong> PR, PE, GO (mudanças moderadas)</li>
            <li><strong>Baixo Impacto:</strong> RJ, DF, estados do Norte/Nordeste (ganharão receita)</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Fator 6: Estrutura Fiscal (10 pontos)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Sua capacidade de adaptação depende da estrutura:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>Básica:</strong> Contador externo sem sistema. Alto risco de erros.</li>
            <li><strong>Intermediária:</strong> Contador + sistema ERP. Capacidade média.</li>
            <li><strong>Avançada:</strong> Equipe fiscal interna + tecnologia. Melhor preparada.</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ❌ Erros Fatais na Transição
          </h2>
          <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-4">
            <li>
              <strong>Esperar 2027 para se preparar:</strong> Quando a reforma entrar em vigor, será tarde. 
              Prepare-se AGORA.
            </li>
            <li>
              <strong>Não simular o impacto financeiro:</strong> "Achismo" pode levar a surpresas catastróficas 
              no caixa.
            </li>
            <li>
              <strong>Ignorar créditos tributários:</strong> Empresas que não mapeiam créditos pagam 30-50% 
              a mais de impostos.
            </li>
            <li>
              <strong>Manter a mesma precificação:</strong> Se o custo tributário aumentar, você PRECISA 
              repassar ou reduzir custos.
            </li>
            <li>
              <strong>Não treinar a equipe:</strong> Colaboradores despreparados geram erros que custam caro.
            </li>
            <li>
              <strong>Confiar que "vai dar certo":</strong> Empresas sem planejamento têm 70% de chance de 
              problemas graves na transição.
            </li>
          </ol>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ❓ Perguntas Frequentes (FAQ)
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                1. Quando devo começar a me preparar?
              </h4>
              <p className="text-gray-700">
                <strong>Agora!</strong> A reforma entra em vigor em 2027, mas a transição começa em 2026. 
                Empresas que se preparam com 2 anos de antecedência reduzem riscos em 80%.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                2. Minha empresa é pequena, preciso me preocupar?
              </h4>
              <p className="text-gray-700">
                <strong>Sim!</strong> Pequenas empresas têm menos margem de erro. Um aumento de 5-10% na 
                carga pode inviabilizar o negócio se você não estiver preparado.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                3. Quanto custa uma consultoria tributária?
              </h4>
              <p className="text-gray-700">
                Varia de R$ 5 mil a R$ 100 mil dependendo do porte. Mas o custo de <strong>NÃO</strong> ter 
                consultoria pode ser 10x maior em problemas fiscais.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                4. Posso fazer a análise sozinho?
              </h4>
              <p className="text-gray-700">
                Ferramentas como este analisador dão uma visão inicial. Mas para decisões críticas, 
                <strong>sempre consulte um especialista</strong>.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                5. E se meu score for crítico?
              </h4>
              <p className="text-gray-700">
                Não entre em pânico. Score alto significa que você precisa agir <strong>urgentemente</strong>, 
                mas ainda há tempo para se preparar se começar agora.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                6. A reforma pode ser adiada?
              </h4>
              <p className="text-gray-700">
                É improvável. A EC 132/2023 já foi promulgada. Mesmo que haja ajustes, a essência 
                da reforma será mantida.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                7. Como melhorar meu score?
              </h4>
              <p className="text-gray-700">
                Trabalhe nos fatores controláveis: aumente margens, mapeie créditos, modernize a estrutura 
                fiscal e faça planejamento antecipado.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            📚 Termos Importantes
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-red-50 rounded-lg p-6">
              <h4 className="font-bold text-red-900 mb-2">Score de Risco</h4>
              <p className="text-gray-700 text-sm">
                Pontuação de 0 a 100 que indica o nível de vulnerabilidade da empresa durante a transição 
                tributária. Quanto maior, mais urgente a necessidade de ação.
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-6">
              <h4 className="font-bold text-orange-900 mb-2">Impacto Financeiro</h4>
              <p className="text-gray-700 text-sm">
                Diferença em reais entre a carga tributária atual e a esperada após a reforma. Pode ser 
                positivo (redução) ou negativo (aumento).
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6">
              <h4 className="font-bold text-yellow-900 mb-2">Créditos Tributários</h4>
              <p className="text-gray-700 text-sm">
                Valores de impostos pagos em compras que podem ser abatidos dos impostos a pagar nas vendas. 
                Essenciais para reduzir carga efetiva.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-bold text-green-900 mb-2">Estrutura Fiscal</h4>
              <p className="text-gray-700 text-sm">
                Conjunto de pessoas, sistemas e processos que a empresa usa para calcular e pagar impostos. 
                Determina capacidade de adaptação.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-900 mb-2">Margem de Lucro</h4>
              <p className="text-gray-700 text-sm">
                Percentual que sobra após todos os custos e impostos. Margens baixas (&lt;15%) tornam a 
                empresa vulnerável a aumentos tributários.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h4 className="font-bold text-purple-900 mb-2">Planejamento Tributário</h4>
              <p className="text-gray-700 text-sm">
                Conjunto de estratégias legais para minimizar a carga tributária, incluindo escolha de 
                regime, uso de créditos e estruturação de operações.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ⚖️ Base Legal
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A análise de impacto baseia-se nas mudanças previstas pela <strong>Emenda Constitucional nº 132/2023</strong>:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-3">
            <li>
              <strong>Artigos 156-A e 156-B:</strong> Criação do IBS com alíquota padrão de 26,5% 
              (sendo 16,165% do IBS estadual/municipal).
            </li>
            <li>
              <strong>Artigo 195:</strong> Criação da CBS federal que substitui PIS/COFINS com alíquota de 10,335%.
            </li>
            <li>
              <strong>Período de transição:</strong> 2026-2033 com coexistência gradual entre sistemas antigo e novo.
            </li>
            <li>
              <strong>Split Payment:</strong> Pagamento automático de tributos na fonte (conta gráfica).
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            🎯 Conclusão
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A <strong>Reforma Tributária de 2026</strong> é a maior transformação fiscal em 50 anos. Empresas 
            despreparadas podem enfrentar <strong>aumentos de até 40% na carga</strong>, problemas de fluxo de 
            caixa e até inviabilidade do negócio. Mas quem se prepara adequadamente pode <strong>reduzir impactos 
            e até encontrar oportunidades</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Use este <strong>Analisador de Impacto</strong> para ter uma visão inicial do seu risco. Se seu score 
            for moderado ou superior, <strong>não perca tempo</strong>: contrate consultoria especializada, faça 
            simulações detalhadas e prepare sua empresa para a maior mudança tributária da história do Brasil.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Lembre-se: <strong>o tempo está passando</strong>. Quanto antes você agir, maiores suas chances de 
            atravessar a transição com sucesso. Não deixe para 2027!
          </p>

          <div className="bg-red-600 text-white rounded-xl p-8 mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">
              🚨 Avalie seu risco agora!
            </h3>
            <p className="text-red-100 mb-6">
              Descubra o score de risco da sua empresa e receba recomendações personalizadas.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-red-600 font-bold py-3 px-8 rounded-lg hover:bg-red-50 transition-colors"
            >
              Fazer Análise Gratuita
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

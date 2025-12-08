import React, { useState } from 'react';
import { Calculator, Building2, Wallet, TrendingUp, TrendingDown, DollarSign, Percent, CreditCard, ArrowRight, AlertCircle, CheckCircle, FileText, Users, Landmark, Smartphone, PiggyBank, Banknote } from 'lucide-react';

const SimuladorServicosFinanceiros = () => {
  // Estados principais
  const [tipoInstituicao, setTipoInstituicao] = useState('banco');
  const [tipoServico, setTipoServico] = useState('tarifas');
  
  // Inputs por tipo de serviço
  const [tarifaMensal, setTarifaMensal] = useState('');
  const [qtdClientes, setQtdClientes] = useState('');
  const [spreadBancario, setSpreadBancario] = useState('');
  const [volumeCredito, setVolumeCredito] = useState('');
  const [valorSeguro, setValorSeguro] = useState('');
  const [valorConsorcio, setValorConsorcio] = useState('');
  const [tarifaCartao, setTarifaCartao] = useState('');
  const [volumeTransacoes, setVolumeTransacoes] = useState('');

  // Tipos de instituição
  const instituicoes = [
    { 
      id: 'banco', 
      nome: 'Banco Tradicional', 
      icone: Landmark,
      cor: 'blue',
      descricao: 'Bancos comerciais, múltiplos e de investimento',
      exemplos: ['Itaú', 'Bradesco', 'Santander', 'BB', 'Caixa']
    },
    { 
      id: 'cooperativa', 
      nome: 'Cooperativa de Crédito', 
      icone: Users,
      cor: 'green',
      descricao: 'Cooperativas de crédito e sistema Sicoob/Sicredi',
      exemplos: ['Sicoob', 'Sicredi', 'Unicred', 'Cresol']
    },
    { 
      id: 'fintech', 
      nome: 'Fintech/Banco Digital', 
      icone: Smartphone,
      cor: 'purple',
      descricao: 'Bancos digitais, fintechs de pagamento e crédito',
      exemplos: ['Nubank', 'Inter', 'C6', 'PicPay', 'Mercado Pago']
    }
  ];

  // Tipos de serviço financeiro
  const servicos = [
    {
      id: 'tarifas',
      nome: 'Tarifas Bancárias',
      icone: CreditCard,
      cor: 'blue',
      descricao: 'Tarifas de conta corrente, poupança, pacotes',
      inputs: ['tarifaMensal', 'qtdClientes']
    },
    {
      id: 'spread',
      nome: 'Spread Bancário (Crédito)',
      icone: TrendingUp,
      cor: 'green',
      descricao: 'Spread entre captação e empréstimos',
      inputs: ['spreadBancario', 'volumeCredito']
    },
    {
      id: 'seguros',
      nome: 'Seguros e Previdência',
      icone: PiggyBank,
      cor: 'purple',
      descricao: 'Prêmios de seguro e contribuições previdência privada',
      inputs: ['valorSeguro']
    },
    {
      id: 'consorcio',
      nome: 'Consórcio',
      icone: FileText,
      cor: 'orange',
      descricao: 'Taxa de administração de consórcios',
      inputs: ['valorConsorcio']
    },
    {
      id: 'cartoes',
      nome: 'Cartões e Meios de Pagamento',
      icone: CreditCard,
      cor: 'pink',
      descricao: 'Tarifas de adquirência e processamento',
      inputs: ['tarifaCartao', 'volumeTransacoes']
    }
  ];

  // Alíquotas tributárias
  const ALIQUOTAS = {
    // Sistema ATUAL (PIS/Cofins) - depende do tipo de receita
    atual: {
      tarifas: 0.0925, // 9,25% para receitas de serviços
      spread: 0, // ISENTO (receita de intermediação financeira)
      seguros: 0, // ISENTO (prêmio de seguro)
      consorcio: 0.0925, // 9,25% sobre taxa administração
      cartoes: 0.0925 // 9,25% sobre tarifas adquirência
    },
    // Sistema NOVO (IBS/CBS)
    novo: {
      padrao: 0.265, // 26,5% alíquota padrão
      reducao60: 0.106, // 10,6% (60% de redução para serviços financeiros)
      reducao70: 0.0795 // 7,95% (70% de redução)
    }
  };

  // Instituição selecionada
  const instituicaoAtual = instituicoes.find(i => i.id === tipoInstituicao);
  const servicoAtual = servicos.find(s => s.id === tipoServico);

  // Cálculos baseados no tipo de serviço
  const calcularTributacao = () => {
    let receitaBruta = 0;
    let tributacaoAtual = 0;
    let tributacaoNova = 0;
    let aliquotaAtual = 0;
    let aliquotaNova = 0;
    let temReducao = false;

    const tarifa = parseFloat(tarifaMensal) || 0;
    const clientes = parseFloat(qtdClientes) || 0;
    const spread = parseFloat(spreadBancario) || 0;
    const volumeCred = parseFloat(volumeCredito) || 0;
    const seguro = parseFloat(valorSeguro) || 0;
    const consorcio = parseFloat(valorConsorcio) || 0;
    const cartao = parseFloat(tarifaCartao) || 0;
    const volumeTrans = parseFloat(volumeTransacoes) || 0;

    switch(tipoServico) {
      case 'tarifas':
        receitaBruta = tarifa * clientes;
        aliquotaAtual = ALIQUOTAS.atual.tarifas;
        aliquotaNova = ALIQUOTAS.novo.reducao60; // 60% redução para serviços financeiros
        temReducao = true;
        break;
      
      case 'spread':
        receitaBruta = (spread / 100) * volumeCred;
        aliquotaAtual = ALIQUOTAS.atual.spread; // ZERO (isento)
        aliquotaNova = ALIQUOTAS.novo.reducao60; // 60% redução
        temReducao = true;
        break;
      
      case 'seguros':
        receitaBruta = seguro;
        aliquotaAtual = ALIQUOTAS.atual.seguros; // ZERO (isento)
        aliquotaNova = ALIQUOTAS.novo.reducao60; // 60% redução
        temReducao = true;
        break;
      
      case 'consorcio':
        receitaBruta = consorcio;
        aliquotaAtual = ALIQUOTAS.atual.consorcio;
        aliquotaNova = ALIQUOTAS.novo.reducao60; // 60% redução
        temReducao = true;
        break;
      
      case 'cartoes':
        receitaBruta = (cartao / 100) * volumeTrans;
        aliquotaAtual = ALIQUOTAS.atual.cartoes;
        aliquotaNova = ALIQUOTAS.novo.reducao60; // 60% redução
        temReducao = true;
        break;
    }

    tributacaoAtual = receitaBruta * aliquotaAtual;
    tributacaoNova = receitaBruta * aliquotaNova;
    
    const diferenca = tributacaoNova - tributacaoAtual;
    const percentualDiferenca = tributacaoAtual > 0 
      ? ((diferenca / tributacaoAtual) * 100)
      : (receitaBruta > 0 ? 999 : 0); // Se era isento e passa a pagar, aumento muito grande

    return {
      receitaBruta,
      tributacaoAtual,
      tributacaoNova,
      aliquotaAtual,
      aliquotaNova,
      diferenca,
      percentualDiferenca,
      temReducao
    };
  };

  const resultado = calcularTributacao();

  // Função para formatar moeda
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Função para formatar percentual
  const formatarPercent = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor / 100);
  };

  // Cores por instituição
  const coresInstituicao = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      badge: 'bg-blue-100 text-blue-800',
      icon: 'text-blue-600',
      button: 'bg-blue-500 hover:bg-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      badge: 'bg-green-100 text-green-800',
      icon: 'text-green-600',
      button: 'bg-green-500 hover:bg-green-600'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-900',
      badge: 'bg-purple-100 text-purple-800',
      icon: 'text-purple-600',
      button: 'bg-purple-500 hover:bg-purple-600'
    }
  };

  // Cores por serviço
  const coresServico = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    orange: 'bg-orange-50 border-orange-200 text-orange-900',
    pink: 'bg-pink-50 border-pink-200 text-pink-900'
  };

  const coresAtual = coresInstituicao[instituicaoAtual?.cor];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Simulador de Serviços Financeiros
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calcule o impacto da reforma tributária (IBS/CBS) em bancos, cooperativas, fintechs e serviços financeiros
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Reforma prevê <strong>redução de 60%</strong> na alíquota para serviços financeiros</span>
          </div>
        </div>

        {/* Seletor de Tipo de Instituição */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-blue-600" />
            1. Selecione o Tipo de Instituição Financeira
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            {instituicoes.map((inst) => {
              const Icone = inst.icone;
              const cores = coresInstituicao[inst.cor];
              const isSelected = tipoInstituicao === inst.id;
              
              return (
                <button
                  key={inst.id}
                  onClick={() => setTipoInstituicao(inst.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    isSelected 
                      ? `${cores.bg} ${cores.border} shadow-lg scale-105` 
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${isSelected ? cores.badge : 'bg-gray-100'}`}>
                      <Icone className={`w-6 h-6 ${isSelected ? cores.icon : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg ${isSelected ? cores.text : 'text-gray-900'}`}>
                        {inst.nome}
                      </h3>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{inst.descricao}</p>
                  <div className="flex flex-wrap gap-2">
                    {inst.exemplos.map((exemplo, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {exemplo}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Seletor de Tipo de Serviço */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-purple-600" />
            2. Selecione o Tipo de Serviço Financeiro
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicos.map((serv) => {
              const Icone = serv.icone;
              const isSelected = tipoServico === serv.id;
              
              return (
                <button
                  key={serv.id}
                  onClick={() => setTipoServico(serv.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected 
                      ? `${coresServico[serv.cor]} shadow-lg scale-105` 
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <Icone className={`w-5 h-5 ${isSelected ? 'text-current' : 'text-gray-600'}`} />
                    <div className="flex-1">
                      <h3 className={`font-bold ${isSelected ? 'text-current' : 'text-gray-900'}`}>
                        {serv.nome}
                      </h3>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{serv.descricao}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Formulário de Inputs - Dinâmico por Tipo de Serviço */}
        <div className={`rounded-2xl shadow-xl p-6 mb-6 ${coresAtual.bg}`}>
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${coresAtual.text}`}>
            <Calculator className="w-6 h-6" />
            3. Informe os Dados da Operação
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Tarifas Bancárias */}
            {tipoServico === 'tarifas' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarifa Mensal por Cliente (R$)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={tarifaMensal}
                      onChange={(e) => setTarifaMensal(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 25,00"
                      step="0.01"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Valor médio mensal por cliente (pacote de serviços)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade de Clientes
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={qtdClientes}
                      onChange={(e) => setQtdClientes(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 10000"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Base de clientes com conta ativa
                  </p>
                </div>
              </>
            )}

            {/* Spread Bancário */}
            {tipoServico === 'spread' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spread Bancário (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={spreadBancario}
                      onChange={(e) => setSpreadBancario(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: 15,5"
                      step="0.1"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Diferença entre taxa empréstimo e captação (média 10-20%)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume de Crédito Mensal (R$)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={volumeCredito}
                      onChange={(e) => setVolumeCredito(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: 5000000"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Total concedido em empréstimos/financiamentos no mês
                  </p>
                </div>
              </>
            )}

            {/* Seguros e Previdência */}
            {tipoServico === 'seguros' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Total de Prêmios/Contribuições Mensais (R$)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={valorSeguro}
                    onChange={(e) => setValorSeguro(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: 1000000"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Soma dos prêmios de seguros e contribuições de previdência privada
                </p>
              </div>
            )}

            {/* Consórcio */}
            {tipoServico === 'consorcio' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taxa de Administração Mensal (R$)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={valorConsorcio}
                    onChange={(e) => setValorConsorcio(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ex: 500000"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Receita de taxa de administração dos grupos de consórcio
                </p>
              </div>
            )}

            {/* Cartões e Meios de Pagamento */}
            {tipoServico === 'cartoes' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarifa de Adquirência (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={tarifaCartao}
                      onChange={(e) => setTarifaCartao(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Ex: 2,5"
                      step="0.1"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Taxa de processamento/adquirência (média 2-4%)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume de Transações Mensal (R$)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={volumeTransacoes}
                      onChange={(e) => setVolumeTransacoes(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Ex: 10000000"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Total processado em cartões/pagamentos no mês
                  </p>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Resultados */}
        {resultado.receitaBruta > 0 && (
          <div className="space-y-6">
            
            {/* Resumo Principal */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <TrendingUp className="w-8 h-8" />
                Comparativo: Sistema Atual vs. Reforma Tributária
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-sm font-medium mb-2 opacity-90">Receita Bruta Mensal</div>
                  <div className="text-3xl font-bold">{formatarMoeda(resultado.receitaBruta)}</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-sm font-medium mb-2 opacity-90 flex items-center gap-2">
                    Sistema Atual
                    <span className="text-xs px-2 py-1 bg-red-500/30 rounded">PIS/Cofins</span>
                  </div>
                  <div className="text-3xl font-bold text-red-200">{formatarMoeda(resultado.tributacaoAtual)}</div>
                  <div className="text-sm mt-2 opacity-75">
                    Alíquota: {formatarPercent(resultado.aliquotaAtual * 100)}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-sm font-medium mb-2 opacity-90 flex items-center gap-2">
                    Sistema Novo
                    <span className="text-xs px-2 py-1 bg-green-500/30 rounded">IBS/CBS</span>
                  </div>
                  <div className="text-3xl font-bold text-green-200">{formatarMoeda(resultado.tributacaoNova)}</div>
                  <div className="text-sm mt-2 opacity-75">
                    Alíquota: {formatarPercent(resultado.aliquotaNova * 100)}
                    {resultado.temReducao && <span className="ml-2 text-yellow-300">(-60%)</span>}
                  </div>
                </div>
              </div>

              {/* Diferença */}
              <div className="mt-6 p-6 bg-white/20 backdrop-blur-sm rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium mb-1 opacity-90">
                      {resultado.diferenca < 0 ? 'Economia com Reforma' : 'Aumento com Reforma'}
                    </div>
                    <div className="text-4xl font-bold">
                      {resultado.diferenca < 0 ? '-' : '+'}{formatarMoeda(Math.abs(resultado.diferenca))}
                    </div>
                  </div>
                  <div className={`text-6xl ${resultado.diferenca < 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {resultado.diferenca < 0 ? (
                      <TrendingDown className="w-16 h-16" />
                    ) : (
                      <TrendingUp className="w-16 h-16" />
                    )}
                  </div>
                </div>
                <div className="mt-4 text-lg">
                  Variação: <span className="font-bold">
                    {resultado.percentualDiferenca > 500 ? '+500%+' : 
                     resultado.percentualDiferenca < 0 ? `${resultado.percentualDiferenca.toFixed(1)}%` : 
                     `+${resultado.percentualDiferenca.toFixed(1)}%`}
                  </span>
                </div>
              </div>
            </div>

            {/* Alertas por Tipo de Serviço */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Sistema Atual */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  Sistema Atual (PIS/Cofins)
                </h3>
                
                {tipoServico === 'tarifas' && (
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span><strong>PIS/Cofins:</strong> 9,25% sobre tarifas de conta, pacotes, cartões</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span><strong>ISS:</strong> 2-5% adicional (municipal) dependendo da cidade</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>Carga total pode chegar a <strong>~14% sobre tarifas</strong></span>
                    </div>
                  </div>
                )}

                {tipoServico === 'spread' && (
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span><strong>Spread ISENTO:</strong> Receitas de intermediação financeira não sofrem PIS/Cofins</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Empréstimos, financiamentos, crédito: <strong>alíquota ZERO</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>Mas <strong>cumulativo:</strong> não credita compras e despesas</span>
                    </div>
                  </div>
                )}

                {tipoServico === 'seguros' && (
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span><strong>Prêmios ISENTOS:</strong> Seguros e previdência não sofrem PIS/Cofins sobre prêmio</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Alíquota <strong>ZERO</strong> para receitas de seguro/previdência</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>Mas tributação <strong>nas despesas administrativas</strong> (cumulativo)</span>
                    </div>
                  </div>
                )}

                {tipoServico === 'consorcio' && (
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span><strong>PIS/Cofins:</strong> 9,25% sobre taxa de administração</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>Cotas contempladas: <strong>não tributado</strong> (devolução capital)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>Taxa administração: <strong>9,25%</strong> PIS/Cofins + ISS municipal</span>
                    </div>
                  </div>
                )}

                {tipoServico === 'cartoes' && (
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span><strong>PIS/Cofins:</strong> 9,25% sobre taxas de adquirência/processamento</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span><strong>ISS:</strong> 2-5% adicional sobre serviços de processamento</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>Carga total <strong>~12-14%</strong> sobre taxas</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sistema Novo */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-700">
                  <CheckCircle className="w-5 h-5" />
                  Sistema Novo (IBS/CBS)
                </h3>
                
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-bold text-green-800 mb-1">Redução de 60% Confirmada</div>
                    <div className="text-green-700">
                      Serviços financeiros terão <strong>60% de redução</strong> na alíquota padrão de 26,5%
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span><strong>Alíquota efetiva:</strong> 10,6% (26,5% × 40%)</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span><strong>Unificado:</strong> IBS + CBS substituem PIS/Cofins/ISS</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span><strong>Não cumulativo:</strong> Créditos sobre compras e despesas operacionais</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span><strong>Inclui spread:</strong> Até operações hoje isentas passam a ter alíquota 10,6%</span>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mt-4">
                    <div className="font-bold text-yellow-800 mb-1">⚠️ Atenção: Spread e Seguros</div>
                    <div className="text-yellow-700">
                      Operações hoje <strong>isentas</strong> (spread bancário, prêmios de seguro) passarão a ser <strong>tributadas em 10,6%</strong>. 
                      Isso pode representar <strong>aumento significativo</strong> de carga tributária nessas receitas específicas.
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Projeções Temporais */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-gray-900">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Projeções de Tributação
              </h3>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-sm font-medium text-blue-700 mb-2">Mensal</div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">
                    {formatarMoeda(resultado.tributacaoNova)}
                  </div>
                  <div className="text-xs text-blue-600">Sistema Novo (IBS/CBS)</div>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="text-sm font-medium text-purple-700 mb-2">Trimestral</div>
                  <div className="text-2xl font-bold text-purple-900 mb-1">
                    {formatarMoeda(resultado.tributacaoNova * 3)}
                  </div>
                  <div className="text-xs text-purple-600">× 3 meses</div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="text-sm font-medium text-green-700 mb-2">Semestral</div>
                  <div className="text-2xl font-bold text-green-900 mb-1">
                    {formatarMoeda(resultado.tributacaoNova * 6)}
                  </div>
                  <div className="text-xs text-green-600">× 6 meses</div>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <div className="text-sm font-medium text-orange-700 mb-2">Anual</div>
                  <div className="text-2xl font-bold text-orange-900 mb-1">
                    {formatarMoeda(resultado.tributacaoNova * 12)}
                  </div>
                  <div className="text-xs text-orange-600">× 12 meses</div>
                </div>
              </div>

              {resultado.diferenca < 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 text-green-800 font-bold mb-2">
                    <CheckCircle className="w-5 h-5" />
                    Economia Anual com a Reforma
                  </div>
                  <div className="text-3xl font-bold text-green-700">
                    {formatarMoeda(Math.abs(resultado.diferenca * 12))}
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    Economia de {formatarMoeda(Math.abs(resultado.diferenca))} por mês × 12 meses
                  </div>
                </div>
              )}

              {resultado.diferenca > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2 text-red-800 font-bold mb-2">
                    <AlertCircle className="w-5 h-5" />
                    Aumento Anual com a Reforma
                  </div>
                  <div className="text-3xl font-bold text-red-700">
                    +{formatarMoeda(resultado.diferenca * 12)}
                  </div>
                  <div className="text-sm text-red-600 mt-1">
                    Aumento de {formatarMoeda(resultado.diferenca)} por mês × 12 meses
                  </div>
                  <div className="text-sm text-red-700 mt-2">
                    ⚠️ <strong>Operações hoje isentas</strong> (spread, seguros) passam a pagar 10,6%
                  </div>
                </div>
              )}
            </div>

            {/* Considerações Estratégicas */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-purple-900">
                <FileText className="w-6 h-6" />
                Considerações Estratégicas para {instituicaoAtual?.nome}
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                
                {/* Pontos Positivos */}
                <div className="space-y-3">
                  <div className="font-bold text-green-700 flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    Pontos Positivos
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg border border-green-200">
                    <div className="font-medium text-sm text-green-800">Redução de 60% Confirmada</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Alíquota efetiva de 10,6% em vez de 26,5% padrão
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-green-200">
                    <div className="font-medium text-sm text-green-800">Não Cumulativo</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Credita TI, energia, aluguéis, fornecedores (hoje não credita)
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-green-200">
                    <div className="font-medium text-sm text-green-800">Simplificação</div>
                    <div className="text-xs text-gray-600 mt-1">
                      1 tributo (IBS/CBS) substitui PIS/Cofins/ISS
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-green-200">
                    <div className="font-medium text-sm text-green-800">Legislação Nacional</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Fim de divergências entre municípios (ISS)
                    </div>
                  </div>
                </div>

                {/* Pontos de Atenção */}
                <div className="space-y-3">
                  <div className="font-bold text-red-700 flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    Pontos de Atenção
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-red-200">
                    <div className="font-medium text-sm text-red-800">Spread Passa a Ser Tributado</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Hoje ISENTO, passará a 10,6% → aumento significativo
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-red-200">
                    <div className="font-medium text-sm text-red-800">Seguros e Previdência Tributados</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Prêmios hoje ISENTOS passam a 10,6%
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-red-200">
                    <div className="font-medium text-sm text-red-800">Tarifas Podem Aumentar</div>
                    <div className="text-xs text-gray-600 mt-1">
                      De 9,25% PIS/Cofins para 10,6% IBS/CBS + créditos
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-red-200">
                    <div className="font-medium text-sm text-red-800">Adequação de Sistemas</div>
                    <div className="text-xs text-gray-600 mt-1">
                      ERP, cálculo de créditos, SPED Digital necessário
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Estratégias de Adaptação */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-gray-900">
                <Banknote className="w-6 h-6 text-green-600" />
                Estratégias de Adaptação à Reforma
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                
                <div className="p-4 border-2 border-blue-200 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h4 className="font-bold text-blue-900 mb-2">Revisar Precificação</h4>
                  <p className="text-sm text-gray-600">
                    Ajustar spreads, tarifas e margens para absorver ou repassar o impacto da nova tributação. 
                    Considerar que <strong>spread hoje isento</strong> passará a 10,6%.
                  </p>
                </div>

                <div className="p-4 border-2 border-purple-200 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-purple-600">2</span>
                  </div>
                  <h4 className="font-bold text-purple-900 mb-2">Maximizar Créditos</h4>
                  <p className="text-sm text-gray-600">
                    Com não cumulatividade, <strong>creditar TI, energia, aluguéis, marketing</strong>. 
                    Exigir NF-e de todos fornecedores para aproveitar créditos de 10,6%.
                  </p>
                </div>

                <div className="p-4 border-2 border-green-200 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-green-600">3</span>
                  </div>
                  <h4 className="font-bold text-green-900 mb-2">Adequar Sistemas</h4>
                  <p className="text-sm text-gray-600">
                    Preparar <strong>ERP, contabilidade, SPED</strong> para cálculo automático IBS/CBS. 
                    Transição começa <strong>2026 em escala reduzida</strong>, pleno 2033.
                  </p>
                </div>

              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-yellow-800 mb-1">Recomendação para {instituicaoAtual?.nome}</div>
                    <div className="text-sm text-yellow-700">
                      {tipoInstituicao === 'banco' && (
                        <>
                          Bancos tradicionais devem <strong>simular impacto total</strong> considerando: 
                          (1) tarifas com leve aumento, (2) spread hoje isento passando a 10,6%, (3) seguros tributados. 
                          <strong className="block mt-2">Contrabalanço:</strong> Créditos em TI, data centers, energia podem reduzir carga líquida. 
                          Avaliar repasse a clientes e revisão de produtos.
                        </>
                      )}
                      {tipoInstituicao === 'cooperativa' && (
                        <>
                          Cooperativas devem <strong>aproveitar não cumulatividade</strong> para creditar despesas administrativas 
                          (energia, TI, veículos, marketing). Spread hoje isento passará a 10,6%, mas créditos compensam parcialmente. 
                          <strong className="block mt-2">Foco:</strong> Manter competitividade com taxas menores que bancos tradicionais, 
                          destacando atendimento personalizado.
                        </>
                      )}
                      {tipoInstituicao === 'fintech' && (
                        <>
                          Fintechs digitais se beneficiam de <strong>alta intensidade em TI, cloud, servidores</strong> que gerarão 
                          créditos de 10,6%. Spread e tarifas passam a 10,6%, mas modelo digital já tem margens ajustadas. 
                          <strong className="block mt-2">Vantagem:</strong> Custos operacionais baixos e alto crédito em tecnologia 
                          podem resultar em carga líquida menor que bancos tradicionais.
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Artigo SEO */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          
          {/* Título do Artigo */}
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Tributação de Serviços Financeiros com IBS/CBS: Guia Completo para Bancos, Cooperativas e Fintechs
          </h2>

          {/* Card Introdutório */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500 rounded-lg flex-shrink-0">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  A Reforma Tributária Muda Completamente a Tributação do Setor Financeiro
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  A reforma tributária brasileira (Emenda Constitucional 132/2023) traz mudanças profundas para bancos, 
                  cooperativas de crédito, fintechs e instituições financeiras. O sistema atual, baseado em <strong>PIS/Cofins 
                  com isenções complexas</strong> e ISS municipal variável, será substituído pelo <strong>IBS (Imposto sobre 
                  Bens e Serviços)</strong> e <strong>CBS (Contribuição sobre Bens e Serviços)</strong>.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  A principal novidade: <strong className="text-blue-700">redução de 60% na alíquota padrão</strong>, resultando 
                  em alíquota efetiva de <strong>10,6%</strong> (em vez de 26,5% aplicável a outros setores). Mas há um porém: 
                  <strong className="text-red-700"> operações hoje isentas</strong> como <strong>spread bancário</strong> e 
                  <strong> prêmios de seguros</strong> passarão a ser tributadas, o que pode gerar <strong>aumento de carga</strong> 
                  em algumas linhas de negócio.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Este guia completo analisa o impacto da reforma em cada tipo de serviço financeiro (tarifas, spread, seguros, 
                  consórcio, cartões), compara o sistema atual com o novo modelo, e apresenta estratégias práticas de adaptação 
                  para bancos tradicionais, cooperativas de crédito e fintechs/bancos digitais.
                </p>
              </div>
            </div>
          </div>

          {/* Como Funciona a Tributação Atual */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
            Como Funciona a Tributação Atual de Serviços Financeiros (PIS/Cofins + ISS)
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            O sistema tributário brasileiro atual para o setor financeiro é <strong>complexo e fragmentado</strong>, 
            combinando tributos federais (PIS e Cofins) com tributação municipal (ISS), além de uma série de 
            <strong> isenções e regimes especiais</strong> que variam conforme o tipo de receita. Veja como funciona:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            
            {/* PIS/Cofins */}
            <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
              <h4 className="font-bold text-lg text-red-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                PIS/Cofins (Federal)
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-white rounded-lg">
                  <div className="font-bold text-red-800 mb-1">Tarifas Bancárias: 9,25%</div>
                  <div className="text-gray-700">
                    Conta corrente, poupança, pacotes de serviços, cartões, DOC/TED: <strong>tributados em 9,25%</strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <div className="font-bold text-green-800 mb-1">Spread Bancário: ISENTO (0%)</div>
                  <div className="text-gray-700">
                    Receitas de <strong>intermediação financeira</strong> (diferença entre captação e empréstimo) são 
                    <strong> isentas</strong> de PIS/Cofins
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <div className="font-bold text-green-800 mb-1">Seguros/Previdência: ISENTO (0%)</div>
                  <div className="text-gray-700">
                    Prêmios de seguros e contribuições de previdência privada: <strong>isentos</strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <div className="font-bold text-red-800 mb-1">Consórcio: 9,25%</div>
                  <div className="text-gray-700">
                    Taxa de administração de consórcios: <strong>tributada em 9,25%</strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <div className="font-bold text-red-800 mb-1">Cartões/Pagamentos: 9,25%</div>
                  <div className="text-gray-700">
                    Taxas de adquirência, processamento, interchange: <strong>9,25%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* ISS */}
            <div className="p-6 bg-orange-50 border-2 border-orange-200 rounded-xl">
              <h4 className="font-bold text-lg text-orange-900 mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                ISS (Municipal)
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-white rounded-lg">
                  <div className="font-bold text-orange-800 mb-1">Alíquota: 2% a 5%</div>
                  <div className="text-gray-700">
                    Varia conforme o <strong>município</strong> e o tipo de serviço. São Paulo: 5%, Curitiba: 3%, etc.
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <div className="font-bold text-orange-800 mb-1">Base de Cálculo</div>
                  <div className="text-gray-700">
                    Incide sobre <strong>serviços bancários</strong> (tarifas, cartões, processamento). Não incide sobre 
                    operações de crédito/intermediação financeira.
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <div className="font-bold text-orange-800 mb-1">Legislação Fragmentada</div>
                  <div className="text-gray-700">
                    Cada município tem sua própria lei. <strong>5.570 municípios</strong> = 5.570 legislações diferentes.
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <div className="font-bold text-red-800 mb-1">Conflitos de Competência</div>
                  <div className="text-gray-700">
                    Disputas frequentes: <strong>onde</strong> pagar o ISS? Município da sede, da agência, do cliente?
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Problemas do Sistema Atual */}
          <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl mb-6">
            <h4 className="font-bold text-lg text-yellow-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Principais Problemas do Sistema Atual
            </h4>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <div className="font-bold text-yellow-800 mb-2">1. Complexidade</div>
                <div className="text-sm text-gray-700">
                  Tributação <strong>diferente por tipo de receita</strong>. Tarifas 9,25%+ISS, spread isento, seguros isentos. 
                  Difícil calcular e planejar.
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="font-bold text-yellow-800 mb-2">2. Cumulatividade</div>
                <div className="text-sm text-gray-700">
                  PIS/Cofins <strong>não gera créditos</strong> sobre despesas (TI, energia, aluguéis). Efeito cascata aumenta 
                  custos operacionais.
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="font-bold text-yellow-800 mb-2">3. Guerra Fiscal ISS</div>
                <div className="text-sm text-gray-700">
                  Municípios competem com <strong>alíquotas reduzidas</strong> para atrair sedes de fintechs. Gera distorções 
                  e insegurança jurídica.
                </div>
              </div>
            </div>
          </div>

          {/* Exemplo Prático Sistema Atual */}
          <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl mb-8">
            <h4 className="font-bold text-lg text-blue-900 mb-4">
              📊 Exemplo Prático: Banco com R$ 10 milhões/mês em receitas
            </h4>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Tarifas</div>
                <div className="text-xl font-bold text-blue-900 mb-2">R$ 3.000.000</div>
                <div className="text-sm text-gray-700">
                  <strong>PIS/Cofins:</strong> R$ 277.500 (9,25%)<br/>
                  <strong>ISS (5%):</strong> R$ 150.000<br/>
                  <strong className="text-red-700">Total: R$ 427.500</strong>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Spread Bancário</div>
                <div className="text-xl font-bold text-green-900 mb-2">R$ 5.000.000</div>
                <div className="text-sm text-gray-700">
                  <strong>PIS/Cofins:</strong> R$ 0 (isento)<br/>
                  <strong>ISS:</strong> R$ 0 (não incide)<br/>
                  <strong className="text-green-700">Total: R$ 0</strong>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Seguros</div>
                <div className="text-xl font-bold text-green-900 mb-2">R$ 2.000.000</div>
                <div className="text-sm text-gray-700">
                  <strong>PIS/Cofins:</strong> R$ 0 (isento)<br/>
                  <strong>ISS:</strong> R$ 0 (não incide)<br/>
                  <strong className="text-green-700">Total: R$ 0</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-800 text-white rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm opacity-75">Carga Tributária Total</div>
                  <div className="text-2xl font-bold">R$ 427.500</div>
                </div>
                <div>
                  <div className="text-sm opacity-75">% da Receita Total</div>
                  <div className="text-2xl font-bold">4,28%</div>
                </div>
              </div>
              <div className="text-xs mt-3 opacity-75">
                ⚠️ Mas atenção: spread e seguros (70% da receita) são isentos hoje, mas serão tributados com a reforma!
              </div>
            </div>
          </div>

          {/* Sistema Novo IBS/CBS */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
            O Novo Sistema: IBS/CBS com Redução de 60% para Serviços Financeiros
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            A reforma tributária unifica <strong>PIS, Cofins e ISS</strong> em dois novos tributos: <strong>IBS</strong> (Imposto 
            sobre Bens e Serviços, gerido por estados e municípios) e <strong>CBS</strong> (Contribuição sobre Bens e Serviços, 
            federal). A alíquota padrão estimada é de <strong>26,5%</strong>, mas <strong>serviços financeiros terão redução 
            de 60%</strong>, resultando em alíquota efetiva de <strong>10,6%</strong>.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            
            {/* Benefício: Redução 60% */}
            <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl">
              <h4 className="font-bold text-lg text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Redução de 60% Confirmada
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-white rounded-lg">
                  <div className="font-bold text-green-800 mb-1">Alíquota Padrão: 26,5%</div>
                  <div className="text-gray-700">
                    Alíquota geral estimada para IBS+CBS (soma dos dois tributos)
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <div className="font-bold text-green-800 mb-1">Redução: 60%</div>
                  <div className="text-gray-700">
                    Serviços financeiros terão <strong>60% de redução</strong> na alíquota padrão, conforme Emenda Constitucional 132/2023
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <div className="font-bold text-blue-800 mb-1">Alíquota Efetiva: 10,6%</div>
                  <div className="text-gray-700">
                    26,5% × 40% = <strong>10,6%</strong> (após redução de 60%)
                  </div>
                </div>

                <div className="p-3 bg-green-100 rounded-lg border border-green-300">
                  <div className="font-bold text-green-900 text-center">
                    ✅ Alíquota efetiva: 10,6%
                  </div>
                </div>
              </div>
            </div>

            {/* Não Cumulatividade */}
            <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <h4 className="font-bold text-lg text-blue-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Não Cumulatividade: Créditos sobre Despesas
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-white rounded-lg">
                  <div className="font-bold text-blue-800 mb-1">IBS/CBS Não Cumulativo</div>
                  <div className="text-gray-700">
                    Diferente do PIS/Cofins atual, o novo sistema <strong>gera créditos</strong> sobre compras e despesas operacionais
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <div className="font-bold text-blue-800 mb-1">Créditos de 10,6%</div>
                  <div className="text-gray-700">
                    Sobre <strong>todas</strong> as despesas com fornecedores que emitem NF-e: TI, energia, aluguéis, marketing, etc.
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <div className="font-bold text-blue-800 mb-1">Compensação Automática</div>
                  <div className="text-gray-700">
                    Créditos são <strong>abatidos dos débitos</strong> automaticamente no SPED Digital. Paga só a diferença líquida.
                  </div>
                </div>

                <div className="p-3 bg-blue-100 rounded-lg border border-blue-300">
                  <div className="font-bold text-blue-900 text-center">
                    💡 Créditos reduzem carga tributária líquida
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Unificação Tributária */}
          <div className="p-6 bg-purple-50 border-2 border-purple-200 rounded-xl mb-6">
            <h4 className="font-bold text-lg text-purple-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Unificação: 1 Tributo Substitui 3
            </h4>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">❌</span>
                  </div>
                  <div className="font-bold text-red-800 mb-1">PIS</div>
                  <div className="text-xs text-gray-600">Federal</div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">❌</span>
                  </div>
                  <div className="font-bold text-red-800 mb-1">Cofins</div>
                  <div className="text-xs text-gray-600">Federal</div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">❌</span>
                  </div>
                  <div className="font-bold text-red-800 mb-1">ISS</div>
                  <div className="text-xs text-gray-600">Municipal (5.570 leis)</div>
                </div>
              </div>
            </div>

            <div className="my-4 text-center">
              <ArrowRight className="w-8 h-8 text-purple-600 mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border-2 border-green-300">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="font-bold text-green-800 mb-1">IBS</div>
                  <div className="text-xs text-gray-600 mb-2">Estadual/Municipal</div>
                  <div className="text-xs text-gray-700">Gerido por Comitê Gestor nacional</div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border-2 border-green-300">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="font-bold text-green-800 mb-1">CBS</div>
                  <div className="text-xs text-gray-600 mb-2">Federal</div>
                  <div className="text-xs text-gray-700">Gerido pela Receita Federal</div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-100 rounded-lg text-center">
              <div className="font-bold text-purple-900">
                Resultado: <span className="text-green-700">1 legislação nacional</span> + <span className="text-green-700">regras claras</span> + <span className="text-green-700">fim de conflitos</span>
              </div>
            </div>
          </div>

          {/* Mudança Crucial: Spread e Seguros Tributados */}
          <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl mb-6">
            <h4 className="font-bold text-lg text-red-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              ⚠️ Mudança Crucial: Operações Hoje Isentas Serão Tributadas
            </h4>

            <p className="text-gray-700 mb-4">
              A <strong>grande mudança</strong> que pode gerar <strong>aumento de carga</strong> para bancos e seguradoras:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-red-100 rounded">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-bold text-red-800 mb-1">Spread Bancário</div>
                    <div className="text-sm text-gray-700">
                      <strong className="text-red-700">Hoje:</strong> ISENTO (0%)<br/>
                      <strong className="text-blue-700">Novo:</strong> Tributado em 10,6%<br/>
                      <strong className="text-red-800">Impacto:</strong> Aumento significativo
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-red-50 rounded text-xs text-red-800">
                  Receitas de intermediação financeira (diferença entre captação e empréstimo) passam de <strong>isentas</strong> 
                  para <strong>tributadas em 10,6%</strong>. Isso pode representar aumento bilionário para grandes bancos.
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-red-100 rounded">
                    <PiggyBank className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-bold text-red-800 mb-1">Seguros e Previdência</div>
                    <div className="text-sm text-gray-700">
                      <strong className="text-red-700">Hoje:</strong> Prêmios ISENTOS (0%)<br/>
                      <strong className="text-blue-700">Novo:</strong> Tributados em 10,6%<br/>
                      <strong className="text-red-800">Impacto:</strong> Aumento considerável
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-red-50 rounded text-xs text-red-800">
                  Prêmios de seguros (auto, vida, saúde) e contribuições de previdência privada, hoje <strong>isentos</strong>, 
                  passarão a ser tributados em <strong>10,6%</strong>. Seguradoras precisam reavaliar precificação.
                </div>
              </div>

            </div>

            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
              <div className="font-bold text-yellow-900 mb-2">💡 Contrabalanço: Créditos Ajudam</div>
              <div className="text-sm text-yellow-800">
                Embora spread e seguros passem a ser tributados, o sistema <strong>não cumulativo</strong> permite creditar 
                despesas operacionais (TI, energia, marketing, aluguéis) que hoje não geram crédito. Isso pode <strong>compensar 
                parcialmente</strong> o aumento, dependendo da estrutura de custos de cada instituição.
              </div>
            </div>
          </div>

          {/* Exemplo Prático Sistema Novo */}
          <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl mb-8">
            <h4 className="font-bold text-lg text-blue-900 mb-4">
              📊 Exemplo Prático: Mesmo Banco com Sistema Novo (IBS/CBS 10,6%)
            </h4>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-white rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Tarifas</div>
                <div className="text-xl font-bold text-blue-900 mb-2">R$ 3.000.000</div>
                <div className="text-sm text-gray-700">
                  <strong>IBS/CBS:</strong> R$ 318.000 (10,6%)<br/>
                  <span className="text-xs text-gray-500">(Antes: R$ 427.500)</span><br/>
                  <strong className="text-green-700">Economia: R$ 109.500</strong>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border-2 border-red-300">
                <div className="text-sm text-gray-600 mb-1">Spread Bancário</div>
                <div className="text-xl font-bold text-red-900 mb-2">R$ 5.000.000</div>
                <div className="text-sm text-gray-700">
                  <strong>IBS/CBS:</strong> R$ 530.000 (10,6%)<br/>
                  <span className="text-xs text-gray-500">(Antes: R$ 0 - isento)</span><br/>
                  <strong className="text-red-700">Aumento: R$ 530.000</strong>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border-2 border-red-300">
                <div className="text-sm text-gray-600 mb-1">Seguros</div>
                <div className="text-xl font-bold text-red-900 mb-2">R$ 2.000.000</div>
                <div className="text-sm text-gray-700">
                  <strong>IBS/CBS:</strong> R$ 212.000 (10,6%)<br/>
                  <span className="text-xs text-gray-500">(Antes: R$ 0 - isento)</span><br/>
                  <strong className="text-red-700">Aumento: R$ 212.000</strong>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-800 text-white rounded-lg mb-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-sm opacity-75">Tributação Total BRUTA (antes de créditos)</div>
                  <div className="text-2xl font-bold">R$ 1.060.000</div>
                </div>
                <div>
                  <div className="text-sm opacity-75">% da Receita Total</div>
                  <div className="text-2xl font-bold">10,6%</div>
                </div>
              </div>
              <div className="text-sm opacity-75">
                ⚠️ Mas atenção: spread e seguros que eram isentos agora pagam R$ 742k → <strong>aumento de R$ 632k</strong> vs sistema atual!
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
              <h5 className="font-bold text-green-900 mb-3">Créditos Operacionais (Novo Benefício)</h5>
              <div className="grid md:grid-cols-4 gap-3 text-sm mb-3">
                <div>
                  <div className="text-gray-600">TI/Cloud</div>
                  <div className="font-bold">R$ 1.000.000</div>
                  <div className="text-green-700">Crédito: R$ 106.000</div>
                </div>
                <div>
                  <div className="text-gray-600">Energia</div>
                  <div className="font-bold">R$ 500.000</div>
                  <div className="text-green-700">Crédito: R$ 53.000</div>
                </div>
                <div>
                  <div className="text-gray-600">Aluguéis</div>
                  <div className="font-bold">R$ 800.000</div>
                  <div className="text-green-700">Crédito: R$ 84.800</div>
                </div>
                <div>
                  <div className="text-gray-600">Marketing</div>
                  <div className="font-bold">R$ 400.000</div>
                  <div className="text-green-700">Crédito: R$ 42.400</div>
                </div>
              </div>
              <div className="p-3 bg-white rounded border border-green-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-900">Total de Créditos:</span>
                  <span className="text-xl font-bold text-green-700">R$ 286.200</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-900 text-white rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm opacity-75">Tributação LÍQUIDA (após créditos)</div>
                  <div className="text-3xl font-bold">R$ 773.800</div>
                  <div className="text-xs mt-1 opacity-75">R$ 1.060.000 débitos - R$ 286.200 créditos</div>
                </div>
                <div>
                  <div className="text-sm opacity-75">% da Receita Total</div>
                  <div className="text-3xl font-bold">7,74%</div>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <strong>Comparação:</strong> Sistema atual R$ 427.500 (4,28%) → Sistema novo R$ 773.800 (7,74%)<br/>
                <strong className="text-red-300">Aumento líquido: R$ 346.300 (+81%)</strong> mesmo com créditos operacionais
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
              <div className="text-sm text-yellow-800">
                <strong>Conclusão do Exemplo:</strong> Para bancos com <strong>alta concentração em spread</strong> (hoje isento), 
                haverá <strong>aumento de carga tributária</strong> mesmo com a redução de 60% e os créditos operacionais. 
                Instituições precisam <strong>revisar precificação</strong> e <strong>maximizar créditos</strong> para mitigar impacto.
              </div>
            </div>
          </div>

          {/* Tabela Comparativa: Atual vs Novo */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
            Tabela Comparativa: Sistema Atual vs IBS/CBS
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <th className="p-4 text-left font-bold">Aspecto</th>
                  <th className="p-4 text-left font-bold">Sistema Atual (PIS/Cofins + ISS)</th>
                  <th className="p-4 text-left font-bold">Sistema Novo (IBS/CBS)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-bold text-gray-900 bg-gray-50">Alíquota Tarifas</td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-red-700">9,25%</span> PIS/Cofins + <span className="font-bold text-orange-700">2-5%</span> ISS<br/>
                    <span className="text-sm text-gray-600">Total: ~12-14% dependendo do município</span>
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-green-700">10,6%</span> IBS/CBS (redução 60%)<br/>
                    <span className="text-sm text-green-600">✅ Redução vs maioria dos casos</span>
                  </td>
                </tr>

                <tr className="border-b border-gray-200 bg-red-50">
                  <td className="p-4 font-bold text-gray-900 bg-gray-50">Spread Bancário</td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-green-700">ISENTO (0%)</span><br/>
                    <span className="text-sm text-gray-600">Intermediação financeira não tributada</span>
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-red-700">TRIBUTADO 10,6%</span><br/>
                    <span className="text-sm text-red-600">⚠️ Aumento significativo</span>
                  </td>
                </tr>

                <tr className="border-b border-gray-200 bg-red-50">
                  <td className="p-4 font-bold text-gray-900 bg-gray-50">Seguros/Previdência</td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-green-700">ISENTO (0%)</span><br/>
                    <span className="text-sm text-gray-600">Prêmios não tributados</span>
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-red-700">TRIBUTADO 10,6%</span><br/>
                    <span className="text-sm text-red-600">⚠️ Aumento considerável</span>
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="p-4 font-bold text-gray-900 bg-gray-50">Consórcio</td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-red-700">9,25%</span> PIS/Cofins<br/>
                    <span className="text-sm text-gray-600">Taxa administração tributada</span>
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-blue-700">10,6%</span> IBS/CBS<br/>
                    <span className="text-sm text-blue-600">Aumento leve (+1,35pp)</span>
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="p-4 font-bold text-gray-900 bg-gray-50">Cartões/Pagamentos</td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-red-700">9,25%</span> PIS/Cofins + ISS<br/>
                    <span className="text-sm text-gray-600">Total: ~12-14%</span>
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-green-700">10,6%</span> IBS/CBS<br/>
                    <span className="text-sm text-green-600">✅ Redução moderada</span>
                  </td>
                </tr>

                <tr className="border-b border-gray-200 bg-green-50">
                  <td className="p-4 font-bold text-gray-900 bg-gray-50">Créditos sobre Despesas</td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-red-700">NÃO</span> (cumulativo)<br/>
                    <span className="text-sm text-gray-600">Despesas não geram crédito</span>
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-green-700">SIM</span> (não cumulativo)<br/>
                    <span className="text-sm text-green-600">✅ TI, energia, aluguéis creditam 10,6%</span>
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="p-4 font-bold text-gray-900 bg-gray-50">Número de Legislações</td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-red-700">5.570+</span><br/>
                    <span className="text-sm text-gray-600">PIS/Cofins federal + ISS de cada município</span>
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-green-700">1 lei nacional</span><br/>
                    <span className="text-sm text-green-600">✅ Unificação e simplificação</span>
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="p-4 font-bold text-gray-900 bg-gray-50">Complexidade</td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-red-700">ALTA</span><br/>
                    <span className="text-sm text-gray-600">Isenções por tipo receita, ISS municipal variável</span>
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-green-700">MÉDIA</span><br/>
                    <span className="text-sm text-green-600">✅ Alíquota única 10,6%, regras nacionais</span>
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="p-4 font-bold text-gray-900 bg-gray-50">Base de Cálculo</td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-gray-800">Faturamento bruto</span><br/>
                    <span className="text-sm text-gray-600">Cada tributo com regras próprias</span>
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-gray-800">Faturamento bruto</span><br/>
                    <span className="text-sm text-blue-600">Padronização nacional</span>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 font-bold text-gray-900 bg-gray-50">Prazo Implantação</td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-gray-800">Vigente</span><br/>
                    <span className="text-sm text-gray-600">Sistema atual até 2033</span>
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold text-blue-800">2026-2033</span><br/>
                    <span className="text-sm text-blue-600">Transição gradual 8 anos</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <strong>Resumo da Comparação:</strong> O novo sistema <strong>reduz tributação de tarifas e cartões</strong>, 
                <strong> introduz não cumulatividade</strong> (créditos sobre despesas), mas <strong>tributa spread e seguros</strong> 
                que hoje são isentos. O impacto líquido <strong>varia por instituição</strong>: bancos com alta receita de spread 
                podem ter aumento, fintechs com alto custo em TI podem ter redução líquida.
              </div>
            </div>
          </div>

          {/* Impacto por Tipo de Serviço */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
            Impacto Detalhado por Tipo de Serviço Financeiro
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Cada tipo de receita financeira terá um <strong>impacto diferente</strong> com a reforma. Veja a análise 
            detalhada para cada categoria:
          </p>

          <div className="space-y-6">
            
            {/* 1. Tarifas Bancárias */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-blue-900 mb-2">1. Tarifas Bancárias</h4>
                  <p className="text-sm text-gray-700">
                    Conta corrente, poupança, pacotes, cartões, DOC/TED, boletos
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-white rounded-lg">
                  <div className="font-bold text-red-800 mb-2">Sistema Atual</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>• <strong>PIS/Cofins:</strong> 9,25%</div>
                    <div>• <strong>ISS:</strong> 2-5% (varia por município)</div>
                    <div className="pt-2 border-t">
                      <strong className="text-red-700">Total: 11,25% a 14,25%</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <div className="font-bold text-green-800 mb-2">Sistema Novo</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>• <strong>IBS/CBS:</strong> 10,6% (redução 60%)</div>
                    <div>• <strong>Unificado:</strong> Fim do ISS</div>
                    <div className="pt-2 border-t">
                      <strong className="text-green-700">Total: 10,6%</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                <div className="font-bold text-green-900 mb-2 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Impacto: REDUÇÃO de 0,65 a 3,65 pontos percentuais
                </div>
                <div className="text-sm text-green-800">
                  ✅ <strong>Positivo para bancos:</strong> Tarifas ficam mais competitivas, especialmente em municípios 
                  com ISS alto (5%). Economia pode ser repassada a clientes ou aumentar margem.
                </div>
              </div>
            </div>

            {/* 2. Spread Bancário */}
            <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-red-500 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-red-900 mb-2">2. Spread Bancário (Intermediação Financeira)</h4>
                  <p className="text-sm text-gray-700">
                    Diferença entre taxa de captação e taxa de empréstimo/financiamento
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-white rounded-lg">
                  <div className="font-bold text-green-800 mb-2">Sistema Atual</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>• <strong>PIS/Cofins:</strong> ISENTO (0%)</div>
                    <div>• <strong>ISS:</strong> Não incide</div>
                    <div className="pt-2 border-t">
                      <strong className="text-green-700">Total: 0% (isento)</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <div className="font-bold text-red-800 mb-2">Sistema Novo</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>• <strong>IBS/CBS:</strong> 10,6% (redução 60%)</div>
                    <div>• <strong>Sem isenção:</strong> Todas receitas tributadas</div>
                    <div className="pt-2 border-t">
                      <strong className="text-red-700">Total: 10,6%</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
                <div className="font-bold text-red-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Impacto: AUMENTO de 10,6 pontos percentuais (de 0% para 10,6%)
                </div>
                <div className="text-sm text-red-800">
                  ⚠️ <strong>Negativo para bancos:</strong> Receita que representava 50-70% do faturamento e era isenta 
                  passará a ser tributada. Bancos precisarão <strong>aumentar spread</strong> (repassar ao tomador) ou 
                  <strong>reduzir margens</strong>. Créditos operacionais ajudam, mas não compensam totalmente.
                </div>
              </div>

              <div className="mt-4 p-4 bg-white rounded-lg border-2 border-yellow-300">
                <div className="font-bold text-yellow-900 mb-2">💡 Exemplo Numérico</div>
                <div className="text-sm text-gray-700">
                  Banco com <strong>R$ 100 milhões/mês em spread</strong>:<br/>
                  • Sistema atual: R$ 0 de tributos<br/>
                  • Sistema novo: R$ 10,6 milhões/mês (R$ 127 milhões/ano)<br/>
                  • Para manter margem, precisa aumentar spread de <strong>15% para ~16,8%</strong> (repassar ao cliente)
                </div>
              </div>
            </div>

            {/* 3. Seguros e Previdência */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <PiggyBank className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-purple-900 mb-2">3. Seguros e Previdência Privada</h4>
                  <p className="text-sm text-gray-700">
                    Prêmios de seguros (auto, vida, saúde) e contribuições de previdência complementar
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-white rounded-lg">
                  <div className="font-bold text-green-800 mb-2">Sistema Atual</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>• <strong>PIS/Cofins:</strong> ISENTO (0%) sobre prêmios</div>
                    <div>• <strong>ISS:</strong> Não incide</div>
                    <div className="pt-2 border-t">
                      <strong className="text-green-700">Total: 0% (isento)</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <div className="font-bold text-red-800 mb-2">Sistema Novo</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>• <strong>IBS/CBS:</strong> 10,6% (redução 60%)</div>
                    <div>• <strong>Base:</strong> Prêmio/contribuição</div>
                    <div className="pt-2 border-t">
                      <strong className="text-red-700">Total: 10,6%</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
                <div className="font-bold text-red-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Impacto: AUMENTO de 10,6 pontos percentuais (de 0% para 10,6%)
                </div>
                <div className="text-sm text-red-800">
                  ⚠️ <strong>Negativo para seguradoras:</strong> Prêmios hoje isentos passarão a ser tributados. 
                  Seguros podem ficar <strong>~11% mais caros</strong> para consumidores, ou seguradoras reduzem margem. 
                  Créditos sobre despesas administrativas (TI, energia, comissões de corretores) ajudam parcialmente.
                </div>
              </div>
            </div>

            {/* 4. Consórcio */}
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-orange-900 mb-2">4. Consórcio (Taxa de Administração)</h4>
                  <p className="text-sm text-gray-700">
                    Taxa de administração cobrada das cotas de consórcio (imóveis, veículos, serviços)
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-white rounded-lg">
                  <div className="font-bold text-red-800 mb-2">Sistema Atual</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>• <strong>PIS/Cofins:</strong> 9,25%</div>
                    <div>• <strong>ISS:</strong> Geralmente não incide</div>
                    <div className="pt-2 border-t">
                      <strong className="text-red-700">Total: 9,25%</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <div className="font-bold text-blue-800 mb-2">Sistema Novo</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>• <strong>IBS/CBS:</strong> 10,6% (redução 60%)</div>
                    <div>• <strong>Unificado:</strong> Legislação nacional</div>
                    <div className="pt-2 border-t">
                      <strong className="text-blue-700">Total: 10,6%</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                <div className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  Impacto: AUMENTO leve de 1,35 pontos percentuais
                </div>
                <div className="text-sm text-yellow-800">
                  📊 <strong>Neutro/levemente negativo:</strong> Aumento pequeno na tributação da taxa de administração. 
                  Pode ser compensado com <strong>créditos sobre despesas</strong> (marketing, comissionamento, TI). 
                  Impacto menor comparado a spread e seguros.
                </div>
              </div>
            </div>

            {/* 5. Cartões e Meios de Pagamento */}
            <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-300 rounded-xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-pink-500 rounded-lg">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-pink-900 mb-2">5. Cartões e Meios de Pagamento</h4>
                  <p className="text-sm text-gray-700">
                    Adquirência, processamento, interchange, gateway, PIX, boleto
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-white rounded-lg">
                  <div className="font-bold text-red-800 mb-2">Sistema Atual</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>• <strong>PIS/Cofins:</strong> 9,25%</div>
                    <div>• <strong>ISS:</strong> 2-5% (processamento serviço)</div>
                    <div className="pt-2 border-t">
                      <strong className="text-red-700">Total: 11,25% a 14,25%</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <div className="font-bold text-green-800 mb-2">Sistema Novo</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>• <strong>IBS/CBS:</strong> 10,6% (redução 60%)</div>
                    <div>• <strong>Unificado:</strong> Fim do ISS</div>
                    <div className="pt-2 border-t">
                      <strong className="text-green-700">Total: 10,6%</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                <div className="font-bold text-green-900 mb-2 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Impacto: REDUÇÃO de 0,65 a 3,65 pontos percentuais
                </div>
                <div className="text-sm text-green-800">
                  ✅ <strong>Positivo para fintechs/adquirentes:</strong> Redução de custos tributários pode ser repassada aos 
                  lojistas (taxas MDR menores) ou aumentar margem. <strong>Fintechs se beneficiam</strong> especialmente por 
                  altos gastos em TI/cloud que geram créditos de 10,6%.
                </div>
              </div>
            </div>

          </div>

          {/* Resumo Impacto por Serviço */}
          <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl">
            <h4 className="font-bold text-xl text-gray-900 mb-4">📊 Resumo: Impacto por Serviço</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-100 border-2 border-green-400 rounded-lg">
                <div className="font-bold text-green-900 mb-2 text-center">✅ Redução</div>
                <div className="text-sm text-center text-gray-700">
                  • Tarifas bancárias<br/>
                  • Cartões/pagamentos
                </div>
              </div>

              <div className="p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
                <div className="font-bold text-yellow-900 mb-2 text-center">📊 Neutro</div>
                <div className="text-sm text-center text-gray-700">
                  • Consórcio
                </div>
              </div>

              <div className="p-4 bg-red-100 border-2 border-red-400 rounded-lg">
                <div className="font-bold text-red-900 mb-2 text-center">⚠️ Aumento</div>
                <div className="text-sm text-center text-gray-700">
                  • Spread bancário<br/>
                  • Seguros/previdência
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SimuladorServicosFinanceiros;

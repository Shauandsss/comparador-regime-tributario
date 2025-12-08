import { useState } from 'react';
import { ShoppingCart, TrendingUp, MapPin, DollarSign, Package, AlertCircle, Info } from 'lucide-react';

export default function SimuladorEcommerceReforma() {
  const [formData, setFormData] = useState({
    valorVenda: 1000,
    estadoOrigem: 'SP',
    estadoDestino: 'RJ',
    categoriaProduto: 'eletronico',
    quantidadeMensal: 100
  });

  const [resultado, setResultado] = useState(null);

  const estados = {
    SP: { nome: 'São Paulo', icms: 18, regiao: 'Sudeste' },
    RJ: { nome: 'Rio de Janeiro', icms: 20, regiao: 'Sudeste' },
    MG: { nome: 'Minas Gerais', icms: 18, regiao: 'Sudeste' },
    RS: { nome: 'Rio Grande do Sul', icms: 18, regiao: 'Sul' },
    PR: { nome: 'Paraná', icms: 19, regiao: 'Sul' },
    SC: { nome: 'Santa Catarina', icms: 17, regiao: 'Sul' },
    BA: { nome: 'Bahia', icms: 19, regiao: 'Nordeste' },
    CE: { nome: 'Ceará', icms: 18, regiao: 'Nordeste' },
    PE: { nome: 'Pernambuco', icms: 18, regiao: 'Nordeste' },
    GO: { nome: 'Goiás', icms: 17, regiao: 'Centro-Oeste' },
    DF: { nome: 'Distrito Federal', icms: 18, regiao: 'Centro-Oeste' },
    AM: { nome: 'Amazonas', icms: 18, regiao: 'Norte' },
    PA: { nome: 'Pará', icms: 17, regiao: 'Norte' },
    ES: { nome: 'Espírito Santo', icms: 17, regiao: 'Sudeste' },
    MT: { nome: 'Mato Grosso', icms: 17, regiao: 'Centro-Oeste' }
  };

  const categorias = {
    eletronico: { nome: 'Eletrônicos', margem: 25, credito: 15 },
    vestuario: { nome: 'Vestuário', margem: 40, credito: 10 },
    livro: { nome: 'Livros', margem: 30, credito: 12 },
    alimento: { nome: 'Alimentos', margem: 20, credito: 8 },
    cosmetico: { nome: 'Cosméticos', margem: 35, credito: 12 },
    brinquedo: { nome: 'Brinquedos', margem: 30, credito: 14 },
    movel: { nome: 'Móveis', margem: 35, credito: 18 },
    eletrodomestico: { nome: 'Eletrodomésticos', margem: 28, credito: 16 }
  };

  const calcular = () => {
    const valor = parseFloat(formData.valorVenda);
    const origem = estados[formData.estadoOrigem];
    const destino = estados[formData.estadoDestino];
    const categoria = categorias[formData.categoriaProduto];
    const quantidade = parseInt(formData.quantidadeMensal);

    // SISTEMA ATUAL - Venda Interestadual
    const isInterestadual = formData.estadoOrigem !== formData.estadoDestino;
    
    // Alíquota ICMS interestadual (7% ou 12% dependendo da região)
    let aliquotaInterestadual = 12; // padrão
    if (destino.regiao === 'Norte' || destino.regiao === 'Nordeste' || destino.regiao === 'Centro-Oeste') {
      aliquotaInterestadual = 7;
    }

    // ICMS devido ao estado de origem
    const icmsOrigem = isInterestadual 
      ? (valor * aliquotaInterestadual) / 100 
      : (valor * origem.icms) / 100;

    // DIFAL (Diferencial de Alíquota) - devido ao estado de destino
    const difal = isInterestadual 
      ? ((valor * destino.icms) / 100) - icmsOrigem
      : 0;

    // PIS/COFINS (não cumulativo - e-commerce geralmente é Lucro Real)
    const pisCofins = (valor * 9.25) / 100; // 1,65% + 7,6%

    const tributacaoAtual = icmsOrigem + difal + pisCofins;
    const creditosAtuais = (valor * categoria.credito) / 100;
    const tributacaoLiquidaAtual = tributacaoAtual - creditosAtuais;

    // SISTEMA NOVO (IBS/CBS)
    const aliquotaIVA = 26.5;
    const aliquotaIBS = aliquotaIVA * 0.61; // 16,165%
    const aliquotaCBS = aliquotaIVA * 0.39; // 10,335%

    const ibs = (valor * aliquotaIBS) / 100;
    const cbs = (valor * aliquotaCBS) / 100;
    const tributacaoNova = ibs + cbs;

    // Créditos ampliados no novo sistema (+20%)
    const creditosNovos = (valor * categoria.credito * 1.2) / 100;
    const tributacaoLiquidaNova = tributacaoNova - creditosNovos;

    // Comparação
    const diferencaTributacao = tributacaoLiquidaNova - tributacaoLiquidaAtual;
    const percentualVariacao = tributacaoLiquidaAtual > 0 
      ? (diferencaTributacao / tributacaoLiquidaAtual) * 100 
      : 0;

    // Margem e Lucro
    const custo = valor * (1 - categoria.margem / 100);
    const margemAtual = ((valor - custo - tributacaoLiquidaAtual) / valor) * 100;
    const margemNova = ((valor - custo - tributacaoLiquidaNova) / valor) * 100;
    const impactoMargem = margemNova - margemAtual;

    const lucroUnitarioAtual = valor - custo - tributacaoLiquidaAtual;
    const lucroUnitarioNovo = valor - custo - tributacaoLiquidaNova;
    const impactoLucroUnitario = lucroUnitarioNovo - lucroUnitarioAtual;

    // Projeção mensal
    const receitaMensal = valor * quantidade;
    const tributacaoMensalAtual = tributacaoLiquidaAtual * quantidade;
    const tributacaoMensalNova = tributacaoLiquidaNova * quantidade;
    const lucroMensalAtual = lucroUnitarioAtual * quantidade;
    const lucroMensalNovo = lucroUnitarioNovo * quantidade;
    const impactoLucroMensal = lucroMensalNovo - lucroMensalAtual;

    // Projeção anual
    const receitaAnual = receitaMensal * 12;
    const tributacaoAnualAtual = tributacaoMensalAtual * 12;
    const tributacaoAnualNova = tributacaoMensalNova * 12;
    const lucroAnualAtual = lucroMensalAtual * 12;
    const lucroAnualNovo = lucroMensalNovo * 12;
    const impactoLucroAnual = impactoLucroMensal * 12;

    // Vantagem competitiva (simplificação operacional)
    const economiaOperacional = isInterestadual ? 2500 * 12 : 1000 * 12; // Economia com compliance/mês

    setResultado({
      valor,
      origem,
      destino,
      categoria,
      quantidade,
      isInterestadual,
      
      atual: {
        icmsOrigem,
        difal,
        pisCofins,
        tributacaoTotal: tributacaoAtual,
        creditos: creditosAtuais,
        tributacaoLiquida: tributacaoLiquidaAtual,
        margem: margemAtual,
        lucroUnitario: lucroUnitarioAtual,
        aliquotaInterestadual
      },
      
      novo: {
        ibs,
        cbs,
        tributacaoTotal: tributacaoNova,
        creditos: creditosNovos,
        tributacaoLiquida: tributacaoLiquidaNova,
        margem: margemNova,
        lucroUnitario: lucroUnitarioNovo
      },
      
      impacto: {
        diferencaTributacao,
        percentualVariacao,
        impactoMargem,
        impactoLucroUnitario
      },
      
      mensal: {
        receita: receitaMensal,
        tributacaoAtual: tributacaoMensalAtual,
        tributacaoNova: tributacaoMensalNova,
        lucroAtual: lucroMensalAtual,
        lucroNovo: lucroMensalNovo,
        impactoLucro: impactoLucroMensal
      },
      
      anual: {
        receita: receitaAnual,
        tributacaoAtual: tributacaoAnualAtual,
        tributacaoNova: tributacaoAnualNova,
        lucroAtual: lucroAnualAtual,
        lucroNovo: lucroAnualNovo,
        impactoLucro: impactoLucroAnual,
        economiaOperacional
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calcular();
  };

  const formatMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatPercent = (valor) => {
    return `${valor.toFixed(2)}%`;
  };

  const getCorImpacto = (valor) => {
    if (valor > 0) return 'text-red-600';
    if (valor < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getBgImpacto = (valor) => {
    if (valor > 0) return 'bg-red-50 border-red-300';
    if (valor < 0) return 'bg-green-50 border-green-300';
    return 'bg-gray-50 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simulador para E-commerce Interestadual
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare a tributação atual (ICMS + DIFAL + PIS/COFINS) com o novo sistema 
            (IBS/CBS) nas vendas interestaduais e entenda o impacto na sua loja virtual.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Dados da Operação
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Valor Unitário da Venda (R$)
              </label>
              <input
                type="number"
                name="valorVenda"
                value={formData.valorVenda}
                onChange={handleChange}
                min="1"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantidade Vendida por Mês
              </label>
              <input
                type="number"
                name="quantidadeMensal"
                value={formData.quantidadeMensal}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado de Origem (Onde está seu estoque)
              </label>
              <select
                name="estadoOrigem"
                value={formData.estadoOrigem}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(estados).map(([sigla, info]) => (
                  <option key={sigla} value={sigla}>
                    {sigla} - {info.nome} (ICMS {info.icms}%)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado de Destino (Para onde vai a venda)
              </label>
              <select
                name="estadoDestino"
                value={formData.estadoDestino}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(estados).map(([sigla, info]) => (
                  <option key={sigla} value={sigla}>
                    {sigla} - {info.nome} (ICMS {info.icms}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoria do Produto
              </label>
              <select
                name="categoriaProduto"
                value={formData.categoriaProduto}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(categorias).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.nome} (Margem típica: {info.margem}%)
                  </option>
                ))}
              </select>
            </div>

          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Simular Impacto da Reforma
          </button>
        </form>

        {/* Resultados */}
        {resultado && (
          <>
            {/* Info da Operação */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">📦 Detalhes da Operação</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm opacity-90 mb-1">Tipo de Operação</div>
                  <div className="text-xl font-bold">
                    {resultado.isInterestadual ? '🌐 Venda Interestadual' : '📍 Venda Interna'}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-90 mb-1">Rota</div>
                  <div className="text-xl font-bold">
                    {resultado.origem.nome} → {resultado.destino.nome}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-90 mb-1">Produto</div>
                  <div className="text-xl font-bold">{resultado.categoria.nome}</div>
                </div>
              </div>
            </div>

            {/* Comparação Unitária */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                💰 Tributação por Unidade Vendida
              </h2>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                
                {/* Sistema Atual */}
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-4 text-center">Sistema Atual</h3>
                  <div className="space-y-3">
                    {resultado.isInterestadual && (
                      <>
                        <div>
                          <div className="text-xs text-blue-700 mb-1">
                            ICMS Origem ({formatPercent(resultado.atual.aliquotaInterestadual)})
                          </div>
                          <div className="text-lg font-bold text-blue-900">
                            {formatMoeda(resultado.atual.icmsOrigem)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-blue-700 mb-1">DIFAL</div>
                          <div className="text-lg font-bold text-blue-900">
                            {formatMoeda(resultado.atual.difal)}
                          </div>
                        </div>
                      </>
                    )}
                    {!resultado.isInterestadual && (
                      <div>
                        <div className="text-xs text-blue-700 mb-1">
                          ICMS ({formatPercent(resultado.origem.icms)})
                        </div>
                        <div className="text-lg font-bold text-blue-900">
                          {formatMoeda(resultado.atual.icmsOrigem)}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-blue-700 mb-1">PIS/COFINS (9,25%)</div>
                      <div className="text-lg font-bold text-blue-900">
                        {formatMoeda(resultado.atual.pisCofins)}
                      </div>
                    </div>
                    <div className="border-t border-blue-300 pt-3">
                      <div className="text-xs text-blue-700 mb-1">(-) Créditos</div>
                      <div className="text-lg font-bold text-green-700">
                        -{formatMoeda(resultado.atual.creditos)}
                      </div>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3">
                      <div className="text-xs text-blue-800 mb-1">Tributação Líquida</div>
                      <div className="text-xl font-black text-blue-900">
                        {formatMoeda(resultado.atual.tributacaoLiquida)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impacto */}
                <div className={`rounded-xl p-6 border-2 ${getBgImpacto(resultado.impacto.diferencaTributacao)}`}>
                  <h3 className="font-bold text-gray-900 mb-4 text-center">Impacto da Reforma</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-700 mb-1">Variação Tributária</div>
                      <div className={`text-3xl font-black ${getCorImpacto(resultado.impacto.diferencaTributacao)}`}>
                        {resultado.impacto.diferencaTributacao > 0 ? '+' : ''}
                        {formatMoeda(resultado.impacto.diferencaTributacao)}
                      </div>
                      <div className={`text-sm font-semibold mt-1 ${getCorImpacto(resultado.impacto.percentualVariacao)}`}>
                        {resultado.impacto.percentualVariacao > 0 ? '+' : ''}
                        {formatPercent(resultado.impacto.percentualVariacao)}
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <div className="text-xs text-gray-700 mb-1 text-center">Impacto na Margem</div>
                      <div className={`text-xl font-bold text-center ${getCorImpacto(resultado.impacto.impactoMargem)}`}>
                        {resultado.impacto.impactoMargem > 0 ? '+' : ''}
                        {formatPercent(resultado.impacto.impactoMargem)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-700 mb-1 text-center">Impacto no Lucro</div>
                      <div className={`text-lg font-bold text-center ${getCorImpacto(resultado.impacto.impactoLucroUnitario)}`}>
                        {resultado.impacto.impactoLucroUnitario > 0 ? '+' : ''}
                        {formatMoeda(resultado.impacto.impactoLucroUnitario)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sistema Novo */}
                <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                  <h3 className="font-bold text-purple-900 mb-4 text-center">Reforma (IBS/CBS)</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-purple-700 mb-1">IBS (16,165%)</div>
                      <div className="text-lg font-bold text-purple-900">
                        {formatMoeda(resultado.novo.ibs)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-purple-700 mb-1">CBS (10,335%)</div>
                      <div className="text-lg font-bold text-purple-900">
                        {formatMoeda(resultado.novo.cbs)}
                      </div>
                    </div>
                    <div className="text-xs text-purple-600 bg-purple-100 rounded p-2">
                      ✅ Sem DIFAL
                    </div>
                    <div className="border-t border-purple-300 pt-3">
                      <div className="text-xs text-purple-700 mb-1">(-) Créditos</div>
                      <div className="text-lg font-bold text-green-700">
                        -{formatMoeda(resultado.novo.creditos)}
                      </div>
                    </div>
                    <div className="bg-purple-100 rounded-lg p-3">
                      <div className="text-xs text-purple-800 mb-1">Tributação Líquida</div>
                      <div className="text-xl font-black text-purple-900">
                        {formatMoeda(resultado.novo.tributacaoLiquida)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Margem e Lucro */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-4">📊 Margem de Lucro</h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-blue-700 mb-1">Sistema Atual</div>
                      <div className="text-2xl font-black text-blue-900">
                        {formatPercent(resultado.atual.margem)}
                      </div>
                    </div>
                    <div className={`text-3xl font-black ${getCorImpacto(resultado.impacto.impactoMargem)}`}>
                      {resultado.impacto.impactoMargem > 0 ? '+' : ''}
                      {formatPercent(resultado.impacto.impactoMargem)}
                    </div>
                    <div>
                      <div className="text-sm text-purple-700 mb-1">Pós-Reforma</div>
                      <div className="text-2xl font-black text-purple-900">
                        {formatPercent(resultado.novo.margem)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-xl p-6 border border-green-200">
                  <h4 className="font-bold text-green-900 mb-4">💵 Lucro Unitário</h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-green-700 mb-1">Sistema Atual</div>
                      <div className="text-2xl font-black text-green-900">
                        {formatMoeda(resultado.atual.lucroUnitario)}
                      </div>
                    </div>
                    <div className={`text-2xl font-black ${getCorImpacto(resultado.impacto.impactoLucroUnitario)}`}>
                      {resultado.impacto.impactoLucroUnitario > 0 ? '+' : ''}
                      {formatMoeda(resultado.impacto.impactoLucroUnitario)}
                    </div>
                    <div>
                      <div className="text-sm text-purple-700 mb-1">Pós-Reforma</div>
                      <div className="text-2xl font-black text-purple-900">
                        {formatMoeda(resultado.novo.lucroUnitario)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projeção Mensal e Anual */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              
              {/* Mensal */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                  Projeção Mensal
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-700 font-semibold">Receita Bruta:</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatMoeda(resultado.mensal.receita)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-700">Tributação Atual:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatMoeda(resultado.mensal.tributacaoAtual)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-700">Tributação Pós-Reforma:</span>
                    <span className="text-lg font-bold text-purple-600">
                      {formatMoeda(resultado.mensal.tributacaoNova)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-700">Lucro Atual:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatMoeda(resultado.mensal.lucroAtual)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-700">Lucro Pós-Reforma:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatMoeda(resultado.mensal.lucroNovo)}
                    </span>
                  </div>
                  <div className={`flex justify-between items-center pt-3 p-4 rounded-lg ${getBgImpacto(resultado.mensal.impactoLucro)}`}>
                    <span className="font-bold text-gray-900">Impacto no Lucro:</span>
                    <span className={`text-2xl font-black ${getCorImpacto(resultado.mensal.impactoLucro)}`}>
                      {resultado.mensal.impactoLucro > 0 ? '+' : ''}
                      {formatMoeda(resultado.mensal.impactoLucro)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Anual */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  Projeção Anual
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-700 font-semibold">Receita Bruta:</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatMoeda(resultado.anual.receita)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-700">Tributação Atual:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatMoeda(resultado.anual.tributacaoAtual)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-700">Tributação Pós-Reforma:</span>
                    <span className="text-lg font-bold text-purple-600">
                      {formatMoeda(resultado.anual.tributacaoNova)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-700">Lucro Atual:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatMoeda(resultado.anual.lucroAtual)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-700">Lucro Pós-Reforma:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatMoeda(resultado.anual.lucroNovo)}
                    </span>
                  </div>
                  <div className={`flex justify-between items-center pt-3 p-4 rounded-lg ${getBgImpacto(resultado.anual.impactoLucro)}`}>
                    <span className="font-bold text-gray-900">Impacto no Lucro:</span>
                    <span className={`text-2xl font-black ${getCorImpacto(resultado.anual.impactoLucro)}`}>
                      {resultado.anual.impactoLucro > 0 ? '+' : ''}
                      {formatMoeda(resultado.anual.impactoLucro)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vantagens Adicionais */}
            {resultado.isInterestadual && (
              <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl shadow-xl p-8 mb-8">
                <h3 className="text-2xl font-bold mb-4">🎯 Vantagens Operacionais da Reforma</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                    <h4 className="font-bold text-lg mb-3">✅ Simplificação Tributária</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Fim do DIFAL (diferencial de alíquota)</li>
                      <li>• Alíquota única em todo território nacional</li>
                      <li>• Menos declarações e obrigações acessórias</li>
                      <li>• Redução de custos com compliance tributário</li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-white/30">
                      <div className="text-xs mb-1">Economia Operacional Anual:</div>
                      <div className="text-2xl font-black">
                        {formatMoeda(resultado.anual.economiaOperacional)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                    <h4 className="font-bold text-lg mb-3">📦 Benefícios Logísticos</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Fim da guerra fiscal entre estados</li>
                      <li>• Facilita expansão para novos mercados</li>
                      <li>• Planejamento logístico mais simples</li>
                      <li>• Integração nacional facilitada</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Recomendações */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">💡 Recomendações</h3>
              <div className="space-y-4">
                {resultado.impacto.percentualVariacao > 10 && (
                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                    <h4 className="font-bold text-red-900 mb-2">⚠️ Impacto Crítico</h4>
                    <p className="text-red-800 text-sm">
                      Aumento de {formatPercent(resultado.impacto.percentualVariacao)} na carga tributária. 
                      Avalie urgentemente: (1) Reajuste de preços, (2) Renegociação com fornecedores, 
                      (3) Otimização logística para reduzir custos.
                    </p>
                  </div>
                )}
                
                {resultado.impacto.percentualVariacao > 0 && resultado.impacto.percentualVariacao <= 10 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
                    <h4 className="font-bold text-yellow-900 mb-2">⚡ Impacto Moderado</h4>
                    <p className="text-yellow-800 text-sm">
                      Aumento de {formatPercent(resultado.impacto.percentualVariacao)}. Mapeie todos os 
                      créditos possíveis (insumos, frete, embalagens). No novo sistema, a base de créditos 
                      é mais ampla.
                    </p>
                  </div>
                )}

                {resultado.impacto.percentualVariacao < 0 && (
                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                    <h4 className="font-bold text-green-900 mb-2">🎉 Impacto Positivo</h4>
                    <p className="text-green-800 text-sm">
                      Redução de {formatPercent(Math.abs(resultado.impacto.percentualVariacao))} na carga! 
                      Você pode: (1) Melhorar margens, (2) Reduzir preços para ganhar mercado, 
                      (3) Investir em marketing e expansão.
                    </p>
                  </div>
                )}

                {resultado.isInterestadual && (
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                    <h4 className="font-bold text-blue-900 mb-2">📊 Venda Interestadual</h4>
                    <p className="text-blue-800 text-sm">
                      Você terá <strong>grande simplificação</strong> pós-reforma: fim do DIFAL, 
                      alíquota única, menos burocracia. Economize até {formatMoeda(resultado.anual.economiaOperacional)} 
                      /ano em custos de compliance!
                    </p>
                  </div>
                )}
              </div>
            </div>

          </>
        )}

        {/* Info Card */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mt-8 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-amber-900 mb-2">
                ℹ️ Sobre as Estimativas
              </h4>
              <p className="text-amber-800 leading-relaxed text-sm">
                Os cálculos consideram <strong>regime de apuração não cumulativa</strong> (Lucro Real). 
                Margens e créditos são baseados em médias setoriais. Para decisões estratégicas, 
                consulte um especialista em e-commerce e tributação.
              </p>
            </div>
          </div>
        </div>

        {/* ARTIGO SEO */}
        <article className="max-w-4xl mx-auto prose prose-lg">
          
          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Reforma Tributária e E-commerce: Guia Completo sobre IBS e CBS
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            O <strong>e-commerce interestadual</strong> é um dos segmentos que mais será impactado 
            pela <strong>Reforma Tributária (EC 132/2023)</strong>. Atualmente, lojistas virtuais 
            enfrentam a complexidade do <strong>ICMS interestadual, DIFAL (Diferencial de Alíquota)</strong> 
            e <strong>PIS/COFINS</strong>, cada um com regras, alíquotas e obrigações acessórias 
            diferentes. A partir de 2026, o novo sistema de <strong>IBS (Imposto sobre Bens e Serviços)</strong> 
            e <strong>CBS (Contribuição sobre Bens e Serviços)</strong> promete unificar essa tributação, 
            eliminando guerras fiscais e simplificando operações.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Este guia explica em detalhes <strong>como calcular o impacto</strong> da reforma no seu 
            e-commerce, quais serão as <strong>vantagens operacionais</strong>, e como se preparar 
            para a transição que acontecerá gradualmente até 2033.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Como Funciona a Tributação Atual no E-commerce
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Vendas Internas (Dentro do Mesmo Estado)
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Quando você vende para o mesmo estado onde está seu estoque, a tributação é simples:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li><strong>ICMS:</strong> Alíquota do estado (varia de 17% a 20%)</li>
            <li><strong>PIS:</strong> 1,65% (regime não cumulativo)</li>
            <li><strong>COFINS:</strong> 7,6% (regime não cumulativo)</li>
            <li><strong>Total:</strong> 26,25% a 29,25% (bruto, antes de créditos)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Vendas Interestaduais (Entre Estados Diferentes)
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Aqui a complexidade aumenta exponencialmente:
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>1. ICMS Interestadual (devido ao estado de origem):</strong>
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li><strong>7%:</strong> Para estados do Norte, Nordeste e Centro-Oeste (+ ES)</li>
            <li><strong>12%:</strong> Para estados do Sul e Sudeste (exceto ES)</li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>2. DIFAL - Diferencial de Alíquota (devido ao estado de destino):</strong>
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            É a diferença entre a alíquota interna do estado de destino e a alíquota interestadual. 
            <strong>Exemplo:</strong> Venda de SP (ICMS 18%) para RJ (ICMS 20%), com alíquota 
            interestadual de 12%:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>ICMS Interestadual (SP): 12%</li>
            <li>DIFAL (RJ): 20% - 12% = 8%</li>
            <li>Total ICMS: 20% (dividido entre os dois estados)</li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>3. PIS/COFINS:</strong> 9,25% (não muda em vendas interestaduais)
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Total:</strong> ~29% a 32% dependendo dos estados envolvidos + complexidade 
            operacional brutal.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Como Será com a Reforma (IBS e CBS)
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Alíquota Unificada em Todo o Brasil
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            A partir de 2033 (implementação completa), haverá <strong>uma única alíquota</strong> 
            de <strong>26,5%</strong> dividida em:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li><strong>IBS (16,165%):</strong> Estadual + Municipal (61% do total)</li>
            <li><strong>CBS (10,335%):</strong> Federal (39% do total)</li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Fim do DIFAL:</strong> Não haverá mais diferencial de alíquota. Toda venda, 
            interestadual ou não, terá a mesma tributação de <strong>26,5%</strong>.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Destino da Arrecadação
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            O <strong>IBS será devido 100% ao estado/município de destino</strong> (onde está o 
            consumidor final). Durante a transição (2027-2032), haverá partilha progressiva entre 
            origem e destino, até chegar a 100% destino em 2033.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Passo a Passo: Como Calcular o Impacto
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Passo 1: Mapeie Suas Vendas Atuais
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Liste seus principais fluxos de venda:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Valor médio do pedido</li>
            <li>Volume mensal de vendas por rota (origem → destino)</li>
            <li>Estados de origem (onde está seu CD/estoque)</li>
            <li>Estados de destino (principais mercados consumidores)</li>
            <li>Categoria de produtos (eletrônicos, vestuário, alimentos, etc.)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Passo 2: Calcule a Tributação Atual
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Para cada rota de venda, calcule:
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-6">
            <p className="font-mono text-sm text-gray-800">
              <strong>Tributação Atual =</strong><br/>
              ICMS Interestadual (7% ou 12%)<br/>
              + DIFAL (Alíquota Destino - Alíquota Interestadual)<br/>
              + PIS/COFINS (9,25%)<br/>
              - Créditos Tributários
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Passo 3: Calcule a Tributação Pós-Reforma
          </h3>

          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg mb-6">
            <p className="font-mono text-sm text-gray-800">
              <strong>Tributação Pós-Reforma =</strong><br/>
              IBS (16,165%)<br/>
              + CBS (10,335%)<br/>
              = 26,5% (fixo)<br/>
              - Créditos Tributários Ampliados (+20%)
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Importante:</strong> A base de créditos no novo sistema é mais ampla. 
            Insumos, frete, embalagens, energia e telecomunicações darão crédito integral.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Passo 4: Compare e Projete
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Use nosso simulador para testar diferentes cenários:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Venda de SP → RJ (eletrônicos, R$ 1.000, 100 un/mês)</li>
            <li>Venda de SC → BA (vestuário, R$ 150, 500 un/mês)</li>
            <li>Venda de MG → RS (alimentos, R$ 80, 1.000 un/mês)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Exemplos Práticos
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Exemplo 1: Eletrônicos (SP → RJ)
          </h3>

          <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg mb-6">
            <p className="text-gray-800 mb-3">
              <strong>Cenário:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li>Produto: Notebook - R$ 3.000/unidade</li>
              <li>Volume: 50 unidades/mês</li>
              <li>Origem: São Paulo (ICMS 18%)</li>
              <li>Destino: Rio de Janeiro (ICMS 20%)</li>
              <li>Créditos: 15%</li>
            </ul>
            <p className="text-gray-800 mb-3">
              <strong>Sistema Atual:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li>ICMS Interestadual: R$ 360 (12%)</li>
              <li>DIFAL: R$ 240 (20% - 12% = 8%)</li>
              <li>PIS/COFINS: R$ 277,50 (9,25%)</li>
              <li>Tributos brutos: R$ 877,50</li>
              <li>Créditos: -R$ 450</li>
              <li><strong>Líquido: R$ 427,50 por unidade</strong></li>
            </ul>
            <p className="text-gray-800 mb-3">
              <strong>Pós-Reforma:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li>IBS+CBS: R$ 795 (26,5%)</li>
              <li>Créditos ampliados: -R$ 540 (+20%)</li>
              <li><strong>Líquido: R$ 255 por unidade</strong></li>
            </ul>
            <p className="text-gray-800 font-bold mt-4">
              ✅ Economia de R$ 172,50/unidade → R$ 103.500/ano
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Exemplo 2: Vestuário (SC → BA)
          </h3>

          <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg mb-6">
            <p className="text-gray-800 mb-3">
              <strong>Cenário:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li>Produto: Camiseta - R$ 80/unidade</li>
              <li>Volume: 300 unidades/mês</li>
              <li>Origem: Santa Catarina (ICMS 17%)</li>
              <li>Destino: Bahia (ICMS 19%)</li>
              <li>Créditos: 10%</li>
            </ul>
            <p className="text-gray-800 mb-3">
              <strong>Sistema Atual:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li>ICMS Interestadual: R$ 5,60 (7% - BA é Nordeste)</li>
              <li>DIFAL: R$ 9,60 (19% - 7% = 12%)</li>
              <li>PIS/COFINS: R$ 7,40 (9,25%)</li>
              <li>Tributos brutos: R$ 22,60</li>
              <li>Créditos: -R$ 8,00</li>
              <li><strong>Líquido: R$ 14,60 por unidade</strong></li>
            </ul>
            <p className="text-gray-800 mb-3">
              <strong>Pós-Reforma:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li>IBS+CBS: R$ 21,20 (26,5%)</li>
              <li>Créditos ampliados: -R$ 9,60 (+20%)</li>
              <li><strong>Líquido: R$ 11,60 por unidade</strong></li>
            </ul>
            <p className="text-gray-800 font-bold mt-4">
              ✅ Economia de R$ 3,00/unidade → R$ 10.800/ano
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Exemplo 3: Alimentos (MG → SP)
          </h3>

          <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg mb-6">
            <p className="text-gray-800 mb-3">
              <strong>Cenário:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li>Produto: Café premium - R$ 40/pacote</li>
              <li>Volume: 500 unidades/mês</li>
              <li>Origem: Minas Gerais (ICMS 18%)</li>
              <li>Destino: São Paulo (ICMS 18%)</li>
              <li>Créditos: 8%</li>
            </ul>
            <p className="text-gray-800 mb-3">
              <strong>Sistema Atual:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li>ICMS Interestadual: R$ 4,80 (12%)</li>
              <li>DIFAL: R$ 2,40 (18% - 12% = 6%)</li>
              <li>PIS/COFINS: R$ 3,70 (9,25%)</li>
              <li>Tributos brutos: R$ 10,90</li>
              <li>Créditos: -R$ 3,20</li>
              <li><strong>Líquido: R$ 7,70 por unidade</strong></li>
            </ul>
            <p className="text-gray-800 mb-3">
              <strong>Pós-Reforma:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li>IBS+CBS: R$ 10,60 (26,5%)</li>
              <li>Créditos ampliados: -R$ 3,84 (+20%)</li>
              <li><strong>Líquido: R$ 6,76 por unidade</strong></li>
            </ul>
            <p className="text-gray-800 font-bold mt-4">
              ✅ Economia de R$ 0,94/unidade → R$ 5.640/ano
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Vantagens Operacionais da Reforma
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            1. Fim do DIFAL (Maior Ganho!)
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Atualmente, você precisa calcular, recolher e declarar o <strong>DIFAL separadamente</strong> 
            para cada estado de destino. Com a reforma, essa obrigação <strong>desaparece</strong>. 
            Economia estimada de <strong>R$ 2.500/mês</strong> em custos de compliance para e-commerces 
            médios.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            2. Alíquota Única Nacional
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Não importa se você vende do Amazonas para o Rio Grande do Sul ou de São Paulo para 
            Santa Catarina. A alíquota será <strong>sempre 26,5%</strong>. Planejamento logístico 
            e precificação ficam <strong>infinitamente mais simples</strong>.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            3. Menos Obrigações Acessórias
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Hoje você precisa entregar:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li><strong>SPED Fiscal:</strong> Para ICMS (estadual)</li>
            <li><strong>EFD-Contribuições:</strong> Para PIS/COFINS (federal)</li>
            <li><strong>GNRE:</strong> Para recolher DIFAL de cada estado</li>
            <li><strong>DeSTDA:</strong> Para informar operações interestaduais</li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-6">
            Com IBS/CBS, teremos <strong>declaração única integrada</strong>, reduzindo drasticamente 
            o custo de compliance.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            4. Fim da Guerra Fiscal
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Estados não poderão mais conceder <strong>benefícios fiscais unilaterais</strong>. 
            Isso elimina distorções competitivas e cria um <strong>ambiente de competição justa</strong> 
            baseado em eficiência, não em subsídio tributário.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Erros Comuns ao Avaliar o Impacto
          </h2>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-red-900 mb-3">
              ❌ Erro 1: Comparar Alíquota Nominal sem Considerar Créditos
            </h4>
            <p className="text-gray-700 mb-3">
              "Hoje pago 27%, depois vou pagar 26,5%, então está ok."
            </p>
            <p className="text-gray-700">
              <strong>✅ Correto:</strong> Compare sempre a <strong>tributação líquida</strong> 
              (após créditos), não as alíquotas brutas. Os créditos mudam significativamente.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-red-900 mb-3">
              ❌ Erro 2: Ignorar Economia com Compliance
            </h4>
            <p className="text-gray-700 mb-3">
              Focar só na carga tributária e esquecer os custos operacionais com contabilidade, 
              sistemas e declarações.
            </p>
            <p className="text-gray-700">
              <strong>✅ Correto:</strong> Inclua na análise a economia de <strong>R$ 2.000 a 
              R$ 5.000/mês</strong> que você terá com simplificação tributária.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-red-900 mb-3">
              ❌ Erro 3: Não Considerar Expansão Geográfica
            </h4>
            <p className="text-gray-700 mb-3">
              Analisar apenas as rotas atuais sem pensar em novos mercados que ficarão viáveis.
            </p>
            <p className="text-gray-700">
              <strong>✅ Correto:</strong> Com alíquota única, estados antes inviáveis por alta 
              carga (BA, RJ) podem se tornar <strong>mercados estratégicos</strong>.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-red-900 mb-3">
              ❌ Erro 4: Esquecer o Período de Transição
            </h4>
            <p className="text-gray-700 mb-3">
              Achar que tudo mudará de uma vez em 2026.
            </p>
            <p className="text-gray-700">
              <strong>✅ Correto:</strong> A transição é gradual (2026-2033). Nos primeiros anos, 
              <strong>IBS e ICMS conviverão</strong>, gerando complexidade temporária.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                1. O DIFAL realmente vai acabar?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sim!</strong> Com alíquota única nacional de 26,5%, não haverá mais diferencial 
                de alíquota entre estados. Essa é uma das maiores simplificações da reforma para 
                e-commerce interestadual.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                2. Vou pagar mais ou menos impostos?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                Depende da sua <strong>estrutura atual de créditos</strong> e das <strong>rotas 
                de venda</strong>. Em geral, operações interestaduais complexas (alto DIFAL) 
                <strong> tendem a se beneficiar</strong>. Use nosso simulador para calcular seu 
                caso específico.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                3. Como fica o Simples Nacional?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                O Simples Nacional terá <strong>regras específicas</strong> de convivência com 
                IBS/CBS. Pequenos e-commerces no Simples continuarão com tributação simplificada, 
                mas provavelmente sem DIFAL também.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                4. Preciso mudar meu sistema ERP?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sim, eventualmente.</strong> Seu ERP precisará ser atualizado para calcular 
                IBS/CBS corretamente e gerar as novas obrigações acessórias. Fornecedores já estão 
                se preparando, mas a transição será gradual até 2033.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                5. Quando devo começar a me preparar?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Agora!</strong> A partir de 2026, IBS/CBS começam a incidir em paralelo 
                com ICMS/PIS/COFINS. Quanto antes você entender o impacto, melhor poderá 
                <strong> ajustar precificação e estratégia</strong>.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                6. Créditos de frete e embalagem darão direito a crédito?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sim!</strong> Uma das principais mudanças é a <strong>ampliação da base 
                de créditos</strong>. Frete, embalagens, energia, telecomunicações e até mesmo 
                ativos fixos darão crédito integral no novo sistema.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                7. Posso começar a aplicar a nova tributação hoje?
              </h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Não.</strong> A reforma entra em vigor gradualmente a partir de 2026. 
                Até lá, continue seguindo as regras atuais de ICMS/PIS/COFINS. Use este período 
                para <strong>simular cenários</strong> e planejar ajustes.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Termos Importantes
          </h2>

          <dl className="space-y-4">
            <div>
              <dt className="font-bold text-gray-900">DIFAL (Diferencial de Alíquota)</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Diferença entre a alíquota interna do estado de destino e a alíquota interestadual, 
                recolhida em favor do estado de destino em vendas para consumidor final. 
                <strong> Será extinto com a reforma</strong>.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">ICMS Interestadual</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Alíquota reduzida de ICMS (7% ou 12%) aplicada em operações entre estados diferentes. 
                O restante (DIFAL) vai para o estado de destino.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">IBS (Imposto sobre Bens e Serviços)</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Novo tributo estadual e municipal que <strong>substitui ICMS e ISS</strong>. 
                Arrecadado no destino, com alíquota de 16,165% (projetada).
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">CBS (Contribuição sobre Bens e Serviços)</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Novo tributo federal que <strong>substitui PIS, COFINS e IPI</strong>. Alíquota 
                de 10,335% (projetada), totalizando 26,5% junto com o IBS.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Tributação no Destino</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Princípio da reforma: o tributo é <strong>devido ao estado/município onde está 
                o consumidor final</strong>, não onde está o vendedor. Elimina guerra fiscal.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Créditos Tributários</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Valores de IBS/CBS pagos em <strong>etapas anteriores da cadeia</strong> que podem 
                ser abatidos do imposto devido. Sistema não cumulativo ampliado.
              </dd>
            </div>

            <div>
              <dt className="font-bold text-gray-900">Compliance Tributário</dt>
              <dd className="text-gray-700 ml-4 mt-1">
                Conjunto de processos, declarações e obrigações acessórias necessárias para 
                <strong> estar em conformidade</strong> com a legislação tributária.
              </dd>
            </div>
          </dl>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Base Legal
          </h2>

          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Emenda Constitucional 132/2023:</strong> Institui a Reforma Tributária 
              com IBS e CBS
            </li>
            <li>
              <strong>Art. 156-A, CF:</strong> Criação do IBS (estadual/municipal)
            </li>
            <li>
              <strong>Art. 195, CF (nova redação):</strong> CBS substitui PIS/COFINS
            </li>
            <li>
              <strong>Convênio ICMS 93/2015:</strong> Regra atual do DIFAL (será revogada)
            </li>
            <li>
              <strong>Lei Complementar 190/2022:</strong> DIFAL para consumidor final 
              (temporária até reforma)
            </li>
            <li>
              <strong>Lei Complementar (em elaboração):</strong> Regulamentará IBS/CBS, 
              créditos e transição
            </li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mt-8">
            <p className="text-gray-800 leading-relaxed">
              <strong>🚀 Próximos Passos:</strong> Use nosso simulador acima para calcular 
              o impacto exato no seu e-commerce. Teste diferentes rotas de venda e categorias 
              de produtos. Para estratégias avançadas de precificação e logística pós-reforma, 
              consulte um especialista em planejamento tributário para e-commerce.
            </p>
          </div>

        </article>

      </div>
    </div>
  );
}

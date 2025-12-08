import { useState } from 'react';
import { PieChart, Building2, Landmark, MapPin, TrendingUp, Calculator, Info } from 'lucide-react';

export default function SimuladorIVADual() {
  const [formData, setFormData] = useState({
    faturamento: '',
    estado: 'SP',
    atividade: 'comercio',
    tipoOperacao: 'interna'
  });

  const [resultado, setResultado] = useState(null);

  const estados = {
    SP: { nome: 'São Paulo', regiao: 'Sudeste' },
    RJ: { nome: 'Rio de Janeiro', regiao: 'Sudeste' },
    MG: { nome: 'Minas Gerais', regiao: 'Sudeste' },
    ES: { nome: 'Espírito Santo', regiao: 'Sudeste' },
    RS: { nome: 'Rio Grande do Sul', regiao: 'Sul' },
    PR: { nome: 'Paraná', regiao: 'Sul' },
    SC: { nome: 'Santa Catarina', regiao: 'Sul' },
    BA: { nome: 'Bahia', regiao: 'Nordeste' },
    PE: { nome: 'Pernambuco', regiao: 'Nordeste' },
    CE: { nome: 'Ceará', regiao: 'Nordeste' },
    GO: { nome: 'Goiás', regiao: 'Centro-Oeste' },
    DF: { nome: 'Distrito Federal', regiao: 'Centro-Oeste' },
    AM: { nome: 'Amazonas', regiao: 'Norte' },
    PA: { nome: 'Pará', regiao: 'Norte' }
  };

  const atividades = {
    comercio: { nome: 'Comércio', aliquota: 26.5 },
    servicos: { nome: 'Serviços', aliquota: 26.5 },
    industria: { nome: 'Indústria', aliquota: 26.5 },
    saude: { nome: 'Saúde', aliquota: 0 },
    educacao: { nome: 'Educação', aliquota: 0 },
    transporte: { nome: 'Transporte Público', aliquota: 0 },
    alimentosBasicos: { nome: 'Alimentos (Cesta Básica)', aliquota: 0 }
  };

  const calcular = () => {
    const fat = parseFloat(formData.faturamento) || 0;
    const ativ = atividades[formData.atividade];
    const aliquotaTotal = ativ.aliquota;

    // Divisão constitucional do IVA Dual
    const percentualIBS = 0.61; // 61% para Estados e Municípios
    const percentualCBS = 0.39; // 39% para União

    const aliquotaIBS = aliquotaTotal * percentualIBS;
    const aliquotaCBS = aliquotaTotal * percentualCBS;

    const valorIBS = (fat * aliquotaIBS) / 100;
    const valorCBS = (fat * aliquotaCBS) / 100;
    const valorTotal = valorIBS + valorCBS;

    // Distribuição do IBS entre Estado e Município (50/50)
    const ibsEstado = valorIBS * 0.5;
    const ibsMunicipio = valorIBS * 0.5;

    // Estimativa de distribuição por função
    const distribuicaoUniao = {
      previdencia: valorCBS * 0.35,
      saude: valorCBS * 0.25,
      educacao: valorCBS * 0.15,
      defesa: valorCBS * 0.10,
      infraestrutura: valorCBS * 0.10,
      outros: valorCBS * 0.05
    };

    const distribuicaoEstados = {
      saude: ibsEstado * 0.30,
      educacao: ibsEstado * 0.25,
      seguranca: ibsEstado * 0.20,
      infraestrutura: ibsEstado * 0.15,
      outros: ibsEstado * 0.10
    };

    const distribuicaoMunicipios = {
      saude: ibsMunicipio * 0.35,
      educacao: ibsMunicipio * 0.30,
      infraestrutura: ibsMunicipio * 0.20,
      outros: ibsMunicipio * 0.15
    };

    setResultado({
      faturamento: fat,
      estado: estados[formData.estado],
      atividade: ativ.nome,
      aliquotaTotal: aliquotaTotal,
      
      divisaoIVA: {
        ibs: {
          aliquota: aliquotaIBS,
          valor: valorIBS,
          percentual: percentualIBS * 100
        },
        cbs: {
          aliquota: aliquotaCBS,
          valor: valorCBS,
          percentual: percentualCBS * 100
        }
      },
      
      distribuicaoIBS: {
        estado: ibsEstado,
        municipio: ibsMunicipio
      },
      
      aplicacaoRecursos: {
        uniao: distribuicaoUniao,
        estados: distribuicaoEstados,
        municipios: distribuicaoMunicipios
      },
      
      totalTributos: valorTotal
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
    return `${valor.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <PieChart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simulador do IVA Dual Brasileiro
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Entenda como o imposto é dividido entre CBS (União) e IBS (Estados/Municípios). 
            Visualize a distribuição dos recursos tributários após a reforma.
          </p>
        </div>

        {/* Calculadora */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Faturamento Mensal (R$)
              </label>
              <input
                type="number"
                name="faturamento"
                value={formData.faturamento}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="100000.00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado de Operação
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {Object.entries(estados).map(([uf, info]) => (
                  <option key={uf} value={uf}>
                    {info.nome} ({uf})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Atividade
              </label>
              <select
                name="atividade"
                value={formData.atividade}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {Object.entries(atividades).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.nome} - {info.aliquota}%
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Operação
              </label>
              <select
                name="tipoOperacao"
                value={formData.tipoOperacao}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="interna">Operação Interna (mesmo estado)</option>
                <option value="interestadual">Operação Interestadual</option>
                <option value="exportacao">Exportação</option>
              </select>
            </div>
          </div>

          <button
            onClick={calcular}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Simular Divisão do IVA
          </button>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="space-y-6">
            
            {/* Divisão Principal */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6 text-center">Divisão do IVA Dual</h2>
              <div className="grid md:grid-cols-2 gap-6">
                
                <div className="bg-white/20 backdrop-blur rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Landmark className="w-8 h-8" />
                    <div>
                      <h3 className="text-lg font-bold">CBS - União</h3>
                      <p className="text-sm text-indigo-100">Governo Federal</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Percentual do IVA:</span>
                      <span className="font-bold">{formatPercent(resultado.divisaoIVA.cbs.percentual)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alíquota:</span>
                      <span className="font-bold">{formatPercent(resultado.divisaoIVA.cbs.aliquota)}</span>
                    </div>
                    <div className="border-t border-white/30 pt-2 flex justify-between">
                      <span className="font-semibold">Valor a Recolher:</span>
                      <span className="font-bold text-xl">{formatMoeda(resultado.divisaoIVA.cbs.valor)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="w-8 h-8" />
                    <div>
                      <h3 className="text-lg font-bold">IBS - Estados/Municípios</h3>
                      <p className="text-sm text-indigo-100">Entes Subnacionais</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Percentual do IVA:</span>
                      <span className="font-bold">{formatPercent(resultado.divisaoIVA.ibs.percentual)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alíquota:</span>
                      <span className="font-bold">{formatPercent(resultado.divisaoIVA.ibs.aliquota)}</span>
                    </div>
                    <div className="border-t border-white/30 pt-2 flex justify-between">
                      <span className="font-semibold">Valor a Recolher:</span>
                      <span className="font-bold text-xl">{formatMoeda(resultado.divisaoIVA.ibs.valor)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="text-sm text-indigo-100 mb-2">Total de Tributos</div>
                <div className="text-4xl font-black">{formatMoeda(resultado.totalTributos)}</div>
              </div>
            </div>

            {/* Distribuição do IBS */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-indigo-600" />
                Como o IBS é Distribuído
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-4">Estado: {resultado.estado.nome}</h4>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700">Parte do Estado (50%)</span>
                    <span className="font-bold text-xl text-blue-600">
                      {formatMoeda(resultado.distribuicaoIBS.estado)}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saúde (30%)</span>
                      <span className="font-semibold">{formatMoeda(resultado.aplicacaoRecursos.estados.saude)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Educação (25%)</span>
                      <span className="font-semibold">{formatMoeda(resultado.aplicacaoRecursos.estados.educacao)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Segurança (20%)</span>
                      <span className="font-semibold">{formatMoeda(resultado.aplicacaoRecursos.estados.seguranca)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Infraestrutura (15%)</span>
                      <span className="font-semibold">{formatMoeda(resultado.aplicacaoRecursos.estados.infraestrutura)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                  <h4 className="font-bold text-green-900 mb-4">Município Local</h4>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700">Parte do Município (50%)</span>
                    <span className="font-bold text-xl text-green-600">
                      {formatMoeda(resultado.distribuicaoIBS.municipio)}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saúde (35%)</span>
                      <span className="font-semibold">{formatMoeda(resultado.aplicacaoRecursos.municipios.saude)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Educação (30%)</span>
                      <span className="font-semibold">{formatMoeda(resultado.aplicacaoRecursos.municipios.educacao)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Infraestrutura (20%)</span>
                      <span className="font-semibold">{formatMoeda(resultado.aplicacaoRecursos.municipios.infraestrutura)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Outros (15%)</span>
                      <span className="font-semibold">{formatMoeda(resultado.aplicacaoRecursos.municipios.outros)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aplicação da CBS */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Landmark className="w-6 h-6 text-purple-600" />
                Como a CBS (União) é Aplicada
              </h3>
              <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Previdência Social (35%)</span>
                    <span className="font-bold text-purple-700">{formatMoeda(resultado.aplicacaoRecursos.uniao.previdencia)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Saúde (25%)</span>
                    <span className="font-bold text-purple-700">{formatMoeda(resultado.aplicacaoRecursos.uniao.saude)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Educação (15%)</span>
                    <span className="font-bold text-purple-700">{formatMoeda(resultado.aplicacaoRecursos.uniao.educacao)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Defesa e Segurança (10%)</span>
                    <span className="font-bold text-purple-700">{formatMoeda(resultado.aplicacaoRecursos.uniao.defesa)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Infraestrutura (10%)</span>
                    <span className="font-bold text-purple-700">{formatMoeda(resultado.aplicacaoRecursos.uniao.infraestrutura)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Outros (5%)</span>
                    <span className="font-bold text-purple-700">{formatMoeda(resultado.aplicacaoRecursos.uniao.outros)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico Visual */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">📊 Visualização da Divisão</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4 text-center">Divisão entre Entes</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">CBS (União)</span>
                        <span>{formatPercent(resultado.divisaoIVA.cbs.percentual)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-8">
                        <div 
                          className="bg-purple-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ width: `${resultado.divisaoIVA.cbs.percentual}%` }}
                        >
                          {formatMoeda(resultado.divisaoIVA.cbs.valor)}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">IBS (Estados/Municípios)</span>
                        <span>{formatPercent(resultado.divisaoIVA.ibs.percentual)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-8">
                        <div 
                          className="bg-indigo-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ width: `${resultado.divisaoIVA.ibs.percentual}%` }}
                        >
                          {formatMoeda(resultado.divisaoIVA.ibs.valor)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-4 text-center">Subdivisão do IBS</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Estado</span>
                        <span>50%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-8">
                        <div 
                          className="bg-blue-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ width: '50%' }}
                        >
                          {formatMoeda(resultado.distribuicaoIBS.estado)}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Município</span>
                        <span>50%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-8">
                        <div 
                          className="bg-green-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ width: '50%' }}
                        >
                          {formatMoeda(resultado.distribuicaoIBS.municipio)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">💡 Por que o IVA é Dual?</h4>
                  <p className="text-blue-800 leading-relaxed text-sm">
                    O modelo dual foi adotado para preservar a autonomia fiscal dos entes federativos. Estados e municípios 
                    continuam tendo sua própria fonte de receita (IBS), enquanto a União mantém a CBS. Isso evita conflitos 
                    políticos e permite que cada nível de governo tenha previsibilidade orçamentária.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Artigo SEO */}
        <article className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-lg max-w-none">
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            O Que é o IVA Dual Brasileiro?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            O <strong>IVA Dual</strong> é o modelo de Imposto sobre Valor Agregado escolhido pelo Brasil na Reforma Tributária 
            de 2023. Diferente de países como Alemanha, França e Portugal (que têm apenas um IVA nacional), o Brasil optou por 
            um sistema <strong>dual</strong>, ou seja, dividido em dois impostos distintos que coexistem:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>CBS (Contribuição sobre Bens e Serviços):</strong> Arrecadado pela União (Governo Federal)</li>
            <li><strong>IBS (Imposto sobre Bens e Serviços):</strong> Arrecadado por Estados e Municípios</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-6">
            Ambos incidem sobre a mesma base de cálculo, mas são geridos e arrecadados por entes federativos diferentes. 
            Isso garante <strong>autonomia fiscal</strong> e evita que a União centralize toda a arrecadação tributária, 
            mantendo o equilíbrio do federalismo brasileiro.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            Como Calcular a Divisão do IVA Dual em 2025
          </h2>
          
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 1: Identificar a Alíquota Total do IVA
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            A alíquota padrão do IVA brasileiro foi fixada em <strong>26,5%</strong>. Essa é a soma de IBS + CBS. 
            Alguns setores têm alíquotas diferenciadas:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li>Alíquota Padrão: <strong>26,5%</strong></li>
            <li>Alíquota Reduzida (60%): <strong>~15,9%</strong></li>
            <li>Alíquota Zero: <strong>0%</strong> (cesta básica, saúde, educação)</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 2: Aplicar a Divisão Constitucional
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            A divisão entre IBS e CBS foi definida constitucionalmente:
          </p>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-8 mb-6">
            <h4 className="text-2xl font-bold mb-4 text-center">Divisão do IVA Dual</h4>
            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div className="bg-white/20 backdrop-blur rounded-lg p-6">
                <div className="text-5xl font-black mb-2">61%</div>
                <div className="text-lg font-semibold mb-1">IBS</div>
                <div className="text-sm text-indigo-100">Estados e Municípios</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-6">
                <div className="text-5xl font-black mb-2">39%</div>
                <div className="text-lg font-semibold mb-1">CBS</div>
                <div className="text-sm text-indigo-100">União (Governo Federal)</div>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 3: Calcular as Alíquotas Separadas
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Com a alíquota padrão de 26,5%, a divisão fica assim:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>IBS:</strong> 26,5% × 0,61 = <strong>16,165%</strong></li>
            <li><strong>CBS:</strong> 26,5% × 0,39 = <strong>10,335%</strong></li>
          </ul>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-6 overflow-x-auto">
            <h4 className="text-lg font-bold mb-3 text-white">Exemplo Prático</h4>
            <pre className="text-sm">
{`Faturamento: R$ 100.000,00
Alíquota Total: 26,5%

Cálculo do IBS (61%):
• Alíquota IBS: 26,5% × 0,61 = 16,165%
• Valor IBS: R$ 100.000 × 16,165% = R$ 16.165,00

Cálculo da CBS (39%):
• Alíquota CBS: 26,5% × 0,39 = 10,335%
• Valor CBS: R$ 100.000 × 10,335% = R$ 10.335,00

Total de Tributos: R$ 26.500,00`}
            </pre>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 4: Entender a Subdivisão do IBS
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            O IBS não fica todo com os Estados. Ele é dividido <strong>igualmente</strong> entre Estado e Município onde 
            ocorreu a operação:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>50% para o Estado</strong></li>
            <li><strong>50% para o Município</strong></li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
            <h4 className="font-bold text-blue-900 mb-2">Exemplo Numérico</h4>
            <p className="text-blue-800">
              Se o IBS total é R$ 16.165,00:
            </p>
            <ul className="mt-3 space-y-1 text-blue-800">
              <li>• Estado recebe: R$ 8.082,50</li>
              <li>• Município recebe: R$ 8.082,50</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            📊 Exemplos Práticos de Divisão
          </h2>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Exemplo 1: Pequeno Comércio em São Paulo
          </h3>
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
            <ul className="space-y-2 text-gray-800">
              <li><strong>Faturamento mensal:</strong> R$ 50.000</li>
              <li><strong>Alíquota total:</strong> 26,5%</li>
              <li className="pt-3 border-t border-gray-300">
                <strong>CBS (União - 39%):</strong> R$ 5.167,50
              </li>
              <li>
                <strong>IBS Total (61%):</strong> R$ 8.082,50
                <ul className="ml-6 mt-2 space-y-1 text-sm">
                  <li>→ Estado de SP: R$ 4.041,25</li>
                  <li>→ Município: R$ 4.041,25</li>
                </ul>
              </li>
              <li className="pt-3 border-t border-gray-300 font-bold text-lg text-indigo-600">
                Total Tributos: R$ 13.250,00
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Exemplo 2: Indústria de Grande Porte
          </h3>
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
            <ul className="space-y-2 text-gray-800">
              <li><strong>Faturamento mensal:</strong> R$ 5.000.000</li>
              <li><strong>Alíquota total:</strong> 26,5%</li>
              <li className="pt-3 border-t border-gray-300">
                <strong>CBS (União - 39%):</strong> R$ 516.750
              </li>
              <li>
                <strong>IBS Total (61%):</strong> R$ 808.250
                <ul className="ml-6 mt-2 space-y-1 text-sm">
                  <li>→ Estado: R$ 404.125</li>
                  <li>→ Município: R$ 404.125</li>
                </ul>
              </li>
              <li className="pt-3 border-t border-gray-300 font-bold text-lg text-indigo-600">
                Total Tributos: R$ 1.325.000
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Exemplo 3: Serviços de Saúde (Alíquota Zero)
          </h3>
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
            <ul className="space-y-2 text-gray-800">
              <li><strong>Faturamento mensal:</strong> R$ 200.000</li>
              <li><strong>Alíquota:</strong> 0% (benefício da reforma)</li>
              <li className="pt-3 border-t border-green-300">
                <strong>CBS:</strong> R$ 0
              </li>
              <li>
                <strong>IBS:</strong> R$ 0
              </li>
              <li className="pt-3 border-t border-green-300 font-bold text-lg text-green-600">
                Total Tributos: R$ 0
              </li>
              <li className="text-sm text-green-700">
                ✅ Alíquota zero com direito a crédito sobre insumos
              </li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ❌ Erros Comuns sobre o IVA Dual
          </h2>
          <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-4">
            <li>
              <strong>Confundir IBS com ICMS:</strong> O IBS não é a simples renomeação do ICMS. É um imposto totalmente 
              novo, não-cumulativo, com crédito amplo e sem benefícios fiscais estaduais.
            </li>
            <li>
              <strong>Achar que a CBS é só federal:</strong> Embora seja arrecadada pela União, a CBS segue as mesmas 
              regras do IBS (mesma base, mesmas isenções, mesmo funcionamento).
            </li>
            <li>
              <strong>Esquecer da divisão entre Estado e Município:</strong> O IBS não fica todo com o Estado. Metade 
              vai para o município onde ocorreu a operação.
            </li>
            <li>
              <strong>Calcular separadamente IBS e CBS:</strong> Na prática, empresas pagarão os dois impostos juntos 
              em uma única guia (DAS-IVA), gerida pelo Comitê Gestor do IBS.
            </li>
            <li>
              <strong>Ignorar as regras de partilha interestadual:</strong> Durante a transição (2027-2032), haverá 
              regras especiais de divisão entre estado de origem e destino.
            </li>
          </ol>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ❓ Perguntas Frequentes (FAQ)
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                1. Por que o Brasil optou pelo IVA dual e não pelo IVA único?
              </h4>
              <p className="text-gray-700">
                Para preservar a <strong>autonomia dos entes federativos</strong>. Se houvesse apenas um IVA nacional, 
                estados e municípios perderiam o controle sobre sua principal fonte de receita, criando conflitos políticos 
                e dependência da União.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                2. Quem vai gerenciar a arrecadação do IBS?
              </h4>
              <p className="text-gray-700">
                O <strong>Comitê Gestor do IBS</strong>, formado por representantes de todos os estados e municípios. 
                Será uma entidade autônoma responsável por arrecadar, fiscalizar e distribuir o IBS.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                3. A divisão 61/39 pode mudar no futuro?
              </h4>
              <p className="text-gray-700">
                Não facilmente. A divisão foi estabelecida na <strong>Constituição Federal (EC 132/2023)</strong> e 
                só pode ser alterada por outra emenda constitucional, o que exige ampla maioria no Congresso.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                4. E se eu vender para outro estado?
              </h4>
              <p className="text-gray-700">
                O IBS será recolhido no <strong>destino</strong> (onde está o comprador). Durante a transição (2027-2032), 
                haverá partilha gradual entre origem e destino, mas a partir de 2033 será 100% no destino.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                5. O Simples Nacional também terá divisão 61/39?
              </h4>
              <p className="text-gray-700">
                Sim! Mesmo no Simples Nacional, o imposto pago será dividido proporcionalmente entre CBS (União) e 
                IBS (Estados/Municípios), mantendo o equilíbrio federativo.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                6. Como ficam municípios pequenos que não têm comércio?
              </h4>
              <p className="text-gray-700">
                Haverá um <strong>Fundo de Desenvolvimento Regional</strong> para compensar municípios que perderem 
                arrecadação com a mudança do critério de origem para destino.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            📚 Termos Importantes e Conceitos
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-indigo-50 rounded-lg p-6">
              <h4 className="font-bold text-indigo-900 mb-2">IVA Dual</h4>
              <p className="text-gray-700 text-sm">
                Sistema tributário em que o IVA é dividido entre dois impostos distintos, geridos por diferentes níveis 
                de governo, mas com mesma base e regras.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h4 className="font-bold text-purple-900 mb-2">Comitê Gestor do IBS</h4>
              <p className="text-gray-700 text-sm">
                Órgão colegiado formado por Estados e Municípios, responsável pela gestão, arrecadação e fiscalização 
                do IBS em todo o Brasil.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-900 mb-2">Princípio do Destino</h4>
              <p className="text-gray-700 text-sm">
                Regra pela qual o imposto é recolhido no local onde o produto ou serviço é consumido (destino), e não 
                onde foi produzido (origem).
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-bold text-green-900 mb-2">Autonomia Federativa</h4>
              <p className="text-gray-700 text-sm">
                Capacidade dos entes subnacionais (Estados e Municípios) de terem suas próprias fontes de receita, 
                sem depender exclusivamente de repasses da União.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6">
              <h4 className="font-bold text-yellow-900 mb-2">Partilha Interestadual</h4>
              <p className="text-gray-700 text-sm">
                Divisão do IBS entre estado de origem e destino durante o período de transição (2027-2032), migrando 
                gradualmente para 100% destino.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-6">
              <h4 className="font-bold text-red-900 mb-2">Fundo de Desenvolvimento Regional</h4>
              <p className="text-gray-700 text-sm">
                Mecanismo de compensação para estados e municípios que perderem receita com a mudança do sistema 
                tributário, financiado pela União.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ⚖️ O Que Diz a Legislação
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A divisão do IVA dual está prevista na <strong>Emenda Constitucional nº 132/2023</strong>:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-3">
            <li>
              <strong>Artigo 156-A:</strong> Cria o IBS de competência dos Estados e Municípios, estabelecendo a divisão 
              igualitária (50/50) entre esses entes.
            </li>
            <li>
              <strong>Artigo 195-A:</strong> Institui a CBS de competência da União, substituindo PIS e COFINS com as 
              mesmas regras do IBS.
            </li>
            <li>
              <strong>Proporção 61/39:</strong> Definida para manter o equilíbrio da arrecadação atual entre União e 
              entes subnacionais, evitando perdas significativas.
            </li>
            <li>
              <strong>Lei Complementar (em tramitação):</strong> Regulamentará o funcionamento do Comitê Gestor, 
              partilha interestadual e fundos de compensação.
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            🎯 Conclusão
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            O <strong>IVA Dual brasileiro</strong> é uma solução inteligente para conciliar a modernização tributária 
            com a preservação do federalismo. Ao dividir o imposto em <strong>IBS (61%)</strong> e <strong>CBS (39%)</strong>, 
            o Brasil garante que Estados, Municípios e União continuem tendo suas próprias fontes de receita, evitando 
            centralização excessiva.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Embora mais complexo administrativamente que um IVA único, o modelo dual <strong>respeita as peculiaridades 
            do Brasil</strong>, um país continental com 26 estados, 5.570 municípios e enormes disparidades regionais. 
            A reforma traz simplicidade para as empresas (que pagarão tudo em uma única guia) enquanto mantém a autonomia 
            política dos entes federados.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Use este <strong>Simulador do IVA Dual</strong> para entender exatamente como seus tributos serão divididos 
            e para onde irá cada centavo pago. Transparência tributária é o primeiro passo para uma gestão fiscal eficiente.
          </p>

          <div className="bg-indigo-600 text-white rounded-xl p-8 mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">
              🔍 Entenda para onde vão seus impostos!
            </h3>
            <p className="text-indigo-100 mb-6">
              Simule diferentes valores e veja a divisão exata entre União, Estado e Município.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Simular Novamente
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

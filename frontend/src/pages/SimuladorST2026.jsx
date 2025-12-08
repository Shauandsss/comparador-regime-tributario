import React, { useState } from 'react';
import { Calculator, TrendingUp, AlertTriangle, Package, Percent, MapPin, FileText, ArrowRight } from 'lucide-react';

const SimuladorST2026 = () => {
  const [valorProduto, setValorProduto] = useState('');
  const [mva, setMva] = useState('');
  const [setor, setSetor] = useState('');
  const [estado, setEstado] = useState('');
  const [mostrarResultado, setMostrarResultado] = useState(false);

  // Setores com MVA típica e características
  const setores = [
    { id: 'combustiveis', nome: 'Combustíveis', mvaMedia: 30, icon: '⛽' },
    { id: 'bebidas', nome: 'Bebidas', mvaMedia: 40, icon: '🍺' },
    { id: 'farmacos', nome: 'Farmacêutico', mvaMedia: 35, icon: '💊' },
    { id: 'autopecas', nome: 'Autopeças', mvaMedia: 45, icon: '🔧' },
    { id: 'cosmeticos', nome: 'Cosméticos', mvaMedia: 50, icon: '💄' },
    { id: 'eletronicos', nome: 'Eletrônicos', mvaMedia: 38, icon: '📱' },
    { id: 'alimentos', nome: 'Alimentos', mvaMedia: 25, icon: '🍕' },
    { id: 'outros', nome: 'Outros', mvaMedia: 35, icon: '📦' }
  ];

  // Estados com alíquotas ICMS
  const estados = [
    { uf: 'SP', nome: 'São Paulo', aliquota: 18 },
    { uf: 'RJ', nome: 'Rio de Janeiro', aliquota: 20 },
    { uf: 'MG', nome: 'Minas Gerais', aliquota: 18 },
    { uf: 'RS', nome: 'Rio Grande do Sul', aliquota: 17 },
    { uf: 'PR', nome: 'Paraná', aliquota: 19 },
    { uf: 'SC', nome: 'Santa Catarina', aliquota: 17 },
    { uf: 'BA', nome: 'Bahia', aliquota: 19 },
    { uf: 'PE', nome: 'Pernambuco', aliquota: 18 },
    { uf: 'GO', nome: 'Goiás', aliquota: 17 },
    { uf: 'DF', nome: 'Distrito Federal', aliquota: 18 }
  ];

  const calcularSTAtual = () => {
    const valor = parseFloat(valorProduto);
    const mvaPercent = parseFloat(mva) / 100;
    const estadoSelecionado = estados.find(e => e.uf === estado);
    const aliquotaICMS = estadoSelecionado.aliquota / 100;

    // Base de cálculo ST
    const baseST = valor * (1 + mvaPercent);
    
    // ICMS próprio (na operação do remetente)
    const icmsProprio = valor * aliquotaICMS;
    
    // ICMS ST (sobre a base ST menos o ICMS próprio)
    const icmsST = (baseST * aliquotaICMS) - icmsProprio;
    
    // Preço final para o consumidor
    const precoFinal = baseST;

    return {
      baseST,
      icmsProprio,
      icmsST,
      precoFinal,
      aliquotaICMS: estadoSelecionado.aliquota
    };
  };

  const calcularSTNova = () => {
    const valor = parseFloat(valorProduto);
    const mvaPercent = parseFloat(mva) / 100;
    
    // No novo sistema, a MVA precisa ser ajustada porque:
    // 1. Não há mais ICMS e ISS separados
    // 2. O IBS/CBS é não-cumulativo com crédito pleno
    // 3. A alíquota padrão é 26.5%
    
    // Fator de ajuste da MVA (estimativa: redução de 20-30% pela não-cumulatividade)
    const fatorAjuste = 0.75; // MVA ajustada para 75% da original
    const mvaAjustada = mvaPercent * fatorAjuste;
    
    // Base de cálculo IBS/CBS
    const baseIVA = valor * (1 + mvaAjustada);
    
    // IBS/CBS sobre a base ajustada
    const aliquotaIVA = 0.265; // 26.5%
    const ivaST = baseIVA * aliquotaIVA;
    
    // Crédito presumido na cadeia (diferencial do novo sistema)
    const creditoPresumido = valor * aliquotaIVA;
    
    // IVA efetivo a recolher
    const ivaEfetivo = ivaST - creditoPresumido;
    
    // Preço final
    const precoFinal = valor + ivaEfetivo;

    return {
      baseIVA,
      mvaAjustada: mvaAjustada * 100,
      ivaST,
      creditoPresumido,
      ivaEfetivo,
      precoFinal,
      aliquotaIVA: 26.5
    };
  };

  const calcular = () => {
    if (!valorProduto || !mva || !setor || !estado) {
      alert('Preencha todos os campos');
      return;
    }
    setMostrarResultado(true);
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarPercentual = (valor) => {
    return valor.toFixed(2) + '%';
  };

  const stAtual = mostrarResultado ? calcularSTAtual() : null;
  const stNova = mostrarResultado ? calcularSTNova() : null;
  const setorSelecionado = setores.find(s => s.id === setor);
  const estadoSelecionado = estados.find(e => e.uf === estado);

  const diferencaPreco = stAtual && stNova ? stNova.precoFinal - stAtual.precoFinal : 0;
  const percentualDiferenca = stAtual && stNova ? ((diferencaPreco / stAtual.precoFinal) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-12 h-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Simulador de Substituição Tributária 2026
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare como a Substituição Tributária (ST) de ICMS será convertida para o sistema IBS/CBS e veja o impacto no preço final
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            Dados do Produto
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Valor do Produto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor do Produto (R$)
              </label>
              <input
                type="number"
                value={valorProduto}
                onChange={(e) => setValorProduto(e.target.value)}
                placeholder="Ex: 100.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* MVA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MVA - Margem de Valor Agregado (%)
              </label>
              <input
                type="number"
                value={mva}
                onChange={(e) => setMva(e.target.value)}
                placeholder="Ex: 40"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Setor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Setor do Produto
              </label>
              <select
                value={setor}
                onChange={(e) => {
                  setSetor(e.target.value);
                  const setorEncontrado = setores.find(s => s.id === e.target.value);
                  if (setorEncontrado) setMva(setorEncontrado.mvaMedia.toString());
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Selecione o setor</option>
                {setores.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.nome} (MVA média: {s.mvaMedia}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado (UF)
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Selecione o estado</option>
                {estados.map(e => (
                  <option key={e.uf} value={e.uf}>
                    {e.nome} ({e.uf}) - ICMS {e.aliquota}%
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={calcular}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calcular Impacto da Reforma
          </button>
        </div>

        {/* Resultados */}
        {mostrarResultado && stAtual && stNova && (
          <>
            {/* Comparação ST Atual vs ST Nova */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* ST Atual (ICMS) */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-red-600" />
                  ST Atual (ICMS)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Valor Original:</span>
                    <span className="font-semibold">{formatarMoeda(parseFloat(valorProduto))}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">MVA Aplicada:</span>
                    <span className="font-semibold">{formatarPercentual(parseFloat(mva))}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Base ST:</span>
                    <span className="font-semibold">{formatarMoeda(stAtual.baseST)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Alíquota ICMS ({estadoSelecionado?.uf}):</span>
                    <span className="font-semibold">{formatarPercentual(stAtual.aliquotaICMS)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">ICMS Próprio:</span>
                    <span className="font-semibold text-orange-600">{formatarMoeda(stAtual.icmsProprio)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">ICMS ST:</span>
                    <span className="font-semibold text-red-600">{formatarMoeda(stAtual.icmsST)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 bg-red-50 p-3 rounded-lg">
                    <span className="font-bold text-gray-800">Preço Final:</span>
                    <span className="font-bold text-2xl text-red-600">{formatarMoeda(stAtual.precoFinal)}</span>
                  </div>
                </div>
              </div>

              {/* ST Nova (IBS/CBS) */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  ST Nova (IBS/CBS) - 2026+
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Valor Original:</span>
                    <span className="font-semibold">{formatarMoeda(parseFloat(valorProduto))}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">MVA Ajustada:</span>
                    <span className="font-semibold">{formatarPercentual(stNova.mvaAjustada)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Base IBS/CBS:</span>
                    <span className="font-semibold">{formatarMoeda(stNova.baseIVA)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Alíquota IBS/CBS:</span>
                    <span className="font-semibold">{formatarPercentual(stNova.aliquotaIVA)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">IVA Total:</span>
                    <span className="font-semibold text-purple-600">{formatarMoeda(stNova.ivaST)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Crédito Presumido:</span>
                    <span className="font-semibold text-green-600">- {formatarMoeda(stNova.creditoPresumido)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">IVA Efetivo:</span>
                    <span className="font-semibold text-blue-600">{formatarMoeda(stNova.ivaEfetivo)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 bg-green-50 p-3 rounded-lg">
                    <span className="font-bold text-gray-800">Preço Final:</span>
                    <span className="font-bold text-2xl text-green-600">{formatarMoeda(stNova.precoFinal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Análise de Impacto */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ArrowRight className="w-6 h-6 text-purple-600" />
                Análise de Impacto
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Diferença no Preço</div>
                  <div className={`text-2xl font-bold ${diferencaPreco > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {diferencaPreco > 0 ? '+' : ''}{formatarMoeda(diferencaPreco)}
                  </div>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Variação Percentual</div>
                  <div className={`text-2xl font-bold ${percentualDiferenca > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {percentualDiferenca > 0 ? '+' : ''}{formatarPercentual(percentualDiferenca)}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Resultado</div>
                  <div className={`text-xl font-bold ${diferencaPreco > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {diferencaPreco > 0 ? 'Aumento ⬆️' : diferencaPreco < 0 ? 'Redução ⬇️' : 'Neutro ➡️'}
                  </div>
                </div>
              </div>

              {/* Explicação */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-gray-700">
                  <strong>Como interpretar:</strong> {
                    diferencaPreco > 0 
                      ? `O preço final aumentará ${formatarPercentual(Math.abs(percentualDiferenca))} com o novo sistema, passando de ${formatarMoeda(stAtual.precoFinal)} para ${formatarMoeda(stNova.precoFinal)}.`
                      : diferencaPreco < 0
                        ? `O preço final reduzirá ${formatarPercentual(Math.abs(percentualDiferenca))} com o novo sistema, passando de ${formatarMoeda(stAtual.precoFinal)} para ${formatarMoeda(stNova.precoFinal)}.`
                        : 'O preço final permanecerá praticamente igual no novo sistema.'
                  }
                </p>
              </div>
            </div>

            {/* Análise por Setor */}
            {setorSelecionado && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-purple-600" />
                  Impacto no Setor: {setorSelecionado.icon} {setorSelecionado.nome}
                </h3>

                {setor === 'combustiveis' && (
                  <div className="space-y-4">
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">⛽ Combustíveis</h4>
                      <p className="text-gray-700 mb-2">
                        O setor de combustíveis é um dos mais impactados pela ST. No sistema atual, a MVA varia entre 25-35% e a ST é cobrada na refinaria/distribuidora.
                      </p>
                      <p className="text-gray-700">
                        <strong>Expectativa:</strong> Redução média de 8-12% no preço ao consumidor devido à não-cumulatividade plena e créditos na cadeia logística (frete, energia).
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">💡 Recomendações</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Distribuidoras: aproveitar créditos de frete e armazenamento</li>
                        <li>Postos: negociar margens com distribuidoras considerando novo sistema</li>
                        <li>Atenção: possível período de ajuste de 6-12 meses em 2026</li>
                      </ul>
                    </div>
                  </div>
                )}

                {setor === 'bebidas' && (
                  <div className="space-y-4">
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">🍺 Bebidas</h4>
                      <p className="text-gray-700 mb-2">
                        Bebidas alcoólicas têm MVA elevada (40-60%) e ainda sofrerão Imposto Seletivo adicional (10-25% conforme tipo).
                      </p>
                      <p className="text-gray-700">
                        <strong>Expectativa:</strong> Aumento de 5-10% no preço final pela combinação de IBS/CBS + Seletivo, mas com possível redução do efeito cascata.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">💡 Recomendações</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Indústria: aproveitar créditos de insumos (malte, embalagens)</li>
                        <li>Distribuidores: otimizar logística para maximizar créditos de frete</li>
                        <li>Varejistas: preparar consumidor para reajuste inicial</li>
                      </ul>
                    </div>
                  </div>
                )}

                {setor === 'farmacos' && (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">💊 Farmacêutico</h4>
                      <p className="text-gray-700 mb-2">
                        Medicamentos têm MVA média de 35% e muitos gozam de redução ou isenção de ICMS. Na reforma, medicamentos essenciais terão alíquota reduzida (até 60% menor).
                      </p>
                      <p className="text-gray-700">
                        <strong>Expectativa:</strong> Redução de 15-25% para medicamentos essenciais; aumento de 3-5% para medicamentos de marca/importados.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">💡 Recomendações</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Indústria: verificar enquadramento de cada produto na lista de essenciais</li>
                        <li>Distribuidores: sistemas para diferenciar alíquotas por NCM</li>
                        <li>Farmácias: preparar precificação dual (essenciais vs. não essenciais)</li>
                      </ul>
                    </div>
                  </div>
                )}

                {setor === 'autopecas' && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">🔧 Autopeças</h4>
                      <p className="text-gray-700 mb-2">
                        Autopeças têm MVA entre 40-50% e cadeia produtiva complexa (metal → fundição → usinagem → montagem → distribuição).
                      </p>
                      <p className="text-gray-700">
                        <strong>Expectativa:</strong> Redução de 10-15% pelo fim da cumulatividade na cadeia produtiva longa.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">💡 Recomendações</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Fabricantes: documentar todos os créditos da cadeia (matéria-prima, energia industrial)</li>
                        <li>Distribuidores: exigir NF-e detalhada de fornecedores para créditos</li>
                        <li>Oficinas: se credenciar como contribuinte para aproveitar créditos</li>
                      </ul>
                    </div>
                  </div>
                )}

                {setor === 'cosmeticos' && (
                  <div className="space-y-4">
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">💄 Cosméticos</h4>
                      <p className="text-gray-700 mb-2">
                        Cosméticos têm MVA elevada (50-60%) e alíquotas de ICMS maiores. Muitos produtos importados sofrem cumulatividade severa.
                      </p>
                      <p className="text-gray-700">
                        <strong>Expectativa:</strong> Redução de 12-18% para produtos nacionais; redução ainda maior (20-25%) para importados.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">💡 Recomendações</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Indústria: aproveitar créditos de embalagens e matérias-primas importadas</li>
                        <li>E-commerce: atenção à nova tributação unificada (fim do diferencial de alíquota)</li>
                        <li>Revendedores: estruturar como pessoa jurídica para aproveitar créditos</li>
                      </ul>
                    </div>
                  </div>
                )}

                {setor === 'eletronicos' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">📱 Eletrônicos</h4>
                      <p className="text-gray-700 mb-2">
                        Eletrônicos têm MVA de 35-45% e sofrem alta cumulatividade devido à importação de componentes e cadeia longa.
                      </p>
                      <p className="text-gray-700">
                        <strong>Expectativa:</strong> Redução de 15-20% pela não-cumulatividade na importação e aproveitamento de créditos de componentes.
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">💡 Recomendações</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Importadores: aproveitamento integral de créditos na importação</li>
                        <li>Varejistas: negociar com fornecedores repasse da redução tributária</li>
                        <li>E-commerce: fim da "guerra fiscal" entre estados equilibra competição</li>
                      </ul>
                    </div>
                  </div>
                )}

                {setor === 'alimentos' && (
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">🍕 Alimentos</h4>
                      <p className="text-gray-700 mb-2">
                        Alimentos da cesta básica terão redução de 60% na alíquota (10.6%). Produtos industrializados terão MVA ajustada.
                      </p>
                      <p className="text-gray-700">
                        <strong>Expectativa:</strong> Redução de 20-30% para cesta básica; aumento de 2-5% para produtos premium/importados.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">💡 Recomendações</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Indústria: segregar linhas de produção (básicos vs. premium) para aproveitamento de alíquotas diferenciadas</li>
                        <li>Supermercados: sistemas para gerenciar múltiplas alíquotas (10.6%, 26.5%)</li>
                        <li>Distribuidores: aproveitar créditos de transporte refrigerado</li>
                      </ul>
                    </div>
                  </div>
                )}

                {setor === 'outros' && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">📦 Outros Setores</h4>
                      <p className="text-gray-700 mb-2">
                        Para setores não especificados, a expectativa geral é de neutralidade ou leve redução (2-8%) devido à não-cumulatividade.
                      </p>
                      <p className="text-gray-700">
                        <strong>Expectativa:</strong> Variação entre -8% e +5% dependendo da complexidade da cadeia produtiva.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">💡 Recomendações Gerais</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Mapear todos os créditos disponíveis na sua cadeia</li>
                        <li>Implementar ERP fiscal preparado para IBS/CBS</li>
                        <li>Consultar especialista para enquadramento correto do produto</li>
                        <li>Monitorar regulamentação específica do seu setor</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Alertas Importantes */}
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">⚠️ Atenção - Simulação Estimada</h4>
                  <p className="text-gray-700 mb-2">
                    Esta é uma <strong>simulação estimada</strong> baseada nas regras conhecidas da Reforma Tributária (EC 132/2023). 
                    Os cálculos consideram:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li><strong>MVA ajustada:</strong> Redução estimada de 25% pela não-cumulatividade</li>
                    <li><strong>Alíquota padrão:</strong> 26.5% (pode ser revista)</li>
                    <li><strong>Créditos presumidos:</strong> Simplificação para efeito didático</li>
                    <li><strong>Regras específicas:</strong> Podem variar por NCM/setor</li>
                  </ul>
                  <p className="text-gray-700 mt-3">
                    <strong>Recomendação:</strong> Para análise precisa, consulte contador especializado em reforma tributária 
                    com o NCM exato do produto e as particularidades da sua cadeia produtiva.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Artigo SEO */}
        <article className="bg-white rounded-xl shadow-lg p-8 mt-8 prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Substituição Tributária na Reforma: O Que Muda de 2026 em Diante?
          </h2>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded">
            <p className="text-gray-700 text-lg leading-relaxed">
              A <strong>Substituição Tributária (ST)</strong> é um dos mecanismos mais complexos do sistema tributário brasileiro. 
              Com a Reforma Tributária (EC 132/2023), a ST de ICMS será <strong>extinta e convertida para o sistema IBS/CBS</strong> 
              a partir de 2026. Entenda o que muda e como isso afeta o preço final dos produtos.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            📋 O Que É Substituição Tributária (ST)?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A Substituição Tributária é um regime onde <strong>um único contribuinte da cadeia</strong> (geralmente o fabricante 
            ou importador) recolhe o imposto de todas as etapas seguintes. O imposto é calculado sobre uma <strong>base presumida</strong>, 
            usando a Margem de Valor Agregado (MVA).
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-3">🔢 Como Funciona Hoje (ICMS-ST)</h4>
            <div className="space-y-2 text-gray-700">
              <p><strong>1.</strong> Fabricante vende produto por R$ 100,00</p>
              <p><strong>2.</strong> MVA aplicada: 40% → Base ST = R$ 140,00</p>
              <p><strong>3.</strong> ICMS ST calculado sobre R$ 140,00 (alíquota 18% = R$ 25,20)</p>
              <p><strong>4.</strong> Fabricante recolhe: ICMS próprio (R$ 18) + ICMS ST (R$ 7,20) = R$ 25,20</p>
              <p><strong>5.</strong> Distribuidor e varejista não pagam ICMS (já foi recolhido)</p>
              <p className="font-semibold text-blue-600 mt-2">Preço final ao consumidor: ~R$ 140,00</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🔄 Como Será com IBS/CBS (2026+)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A Reforma Tributária <strong>extingue a ST de ICMS</strong> e cria um novo modelo de "substituição para frente" 
            usando IBS/CBS. As principais mudanças:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-6 py-3 border-b text-left font-semibold text-gray-800">Aspecto</th>
                  <th className="px-6 py-3 border-b text-left font-semibold text-gray-800">ST Atual (ICMS)</th>
                  <th className="px-6 py-3 border-b text-left font-semibold text-gray-800">ST Nova (IBS/CBS)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">Imposto</td>
                  <td className="px-6 py-4 border-b text-gray-700">ICMS (estadual)</td>
                  <td className="px-6 py-4 border-b text-gray-700">IBS + CBS (federal + estadual/municipal)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">Alíquota</td>
                  <td className="px-6 py-4 border-b text-gray-700">17-20% (varia por estado)</td>
                  <td className="px-6 py-4 border-b text-gray-700">26.5% (unificada nacional)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">MVA</td>
                  <td className="px-6 py-4 border-b text-gray-700">25-60% (por setor/produto)</td>
                  <td className="px-6 py-4 border-b text-gray-700">MVA ajustada (~25% menor)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">Crédito</td>
                  <td className="px-6 py-4 border-b text-gray-700">Limitado (cumulatividade parcial)</td>
                  <td className="px-6 py-4 border-b text-gray-700">Pleno (não-cumulatividade total)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b font-medium text-gray-800">Responsável</td>
                  <td className="px-6 py-4 border-b text-gray-700">Fabricante/Importador</td>
                  <td className="px-6 py-4 border-b text-gray-700">Fabricante/Importador (mantido)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">Complexidade</td>
                  <td className="px-6 py-4 text-gray-700">Alta (27 legislações estaduais)</td>
                  <td className="px-6 py-4 text-gray-700">Média (legislação única nacional)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            📊 MVA Ajustada: O Grande Diferencial
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A <strong>Margem de Valor Agregado (MVA)</strong> é o percentual presumido de agregação de valor em cada etapa. 
            No sistema atual, a MVA precisa ser alta porque não há crédito pleno. Com IBS/CBS, a MVA será <strong>ajustada para baixo</strong> 
            (estimativa: redução de 20-30%) porque o sistema garante crédito total na cadeia.
          </p>

          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-3">💡 Exemplo Prático: Bebidas</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-gray-800 mb-2">Sistema Atual (ICMS-ST)</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Valor do produto: R$ 10,00</li>
                  <li>• MVA: 40%</li>
                  <li>• Base ST: R$ 14,00</li>
                  <li>• ICMS ST (18%): R$ 2,52</li>
                  <li className="font-bold text-red-600 mt-2">Preço final: ~R$ 14,00</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-2">Novo Sistema (IBS/CBS)</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Valor do produto: R$ 10,00</li>
                  <li>• MVA ajustada: 30% (↓25%)</li>
                  <li>• Base IVA: R$ 13,00</li>
                  <li>• IVA (26.5%): R$ 3,45</li>
                  <li>• Crédito presumido: -R$ 2,65</li>
                  <li className="font-bold text-green-600 mt-2">Preço final: ~R$ 10,80</li>
                </ul>
              </div>
            </div>
            <p className="text-green-700 font-semibold mt-4 text-center">
              Redução estimada: R$ 3,20 (-22.9%) ✅
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            🏭 Setores Mais Afetados
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <h4 className="font-bold text-gray-800 mb-2">⛽ Combustíveis</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Hoje:</strong> MVA 25-35%, ST na refinaria/distribuidora
              </p>
              <p className="text-sm text-gray-700">
                <strong>2026+:</strong> Redução de 8-12% no preço ao consumidor pela não-cumulatividade plena
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h4 className="font-bold text-gray-800 mb-2">🍺 Bebidas</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Hoje:</strong> MVA 40-60%, alta carga tributária
              </p>
              <p className="text-sm text-gray-700">
                <strong>2026+:</strong> Aumento de 5-10% pela combinação IBS/CBS + Imposto Seletivo, mas com menos cumulatividade
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h4 className="font-bold text-gray-800 mb-2">💊 Farmacêutico</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Hoje:</strong> MVA 35%, muitos com isenção parcial
              </p>
              <p className="text-sm text-gray-700">
                <strong>2026+:</strong> Redução de 15-25% para medicamentos essenciais (alíquota reduzida 60%)
              </p>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded">
              <h4 className="font-bold text-gray-800 mb-2">🔧 Autopeças</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Hoje:</strong> MVA 40-50%, cadeia produtiva complexa
              </p>
              <p className="text-sm text-gray-700">
                <strong>2026+:</strong> Redução de 10-15% pelo fim da cumulatividade na cadeia longa
              </p>
            </div>

            <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
              <h4 className="font-bold text-gray-800 mb-2">💄 Cosméticos</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Hoje:</strong> MVA 50-60%, alíquotas elevadas
              </p>
              <p className="text-sm text-gray-700">
                <strong>2026+:</strong> Redução de 12-18% para nacionais; 20-25% para importados
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <h4 className="font-bold text-gray-800 mb-2">📱 Eletrônicos</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Hoje:</strong> MVA 35-45%, importação de componentes
              </p>
              <p className="text-sm text-gray-700">
                <strong>2026+:</strong> Redução de 15-20% pela não-cumulatividade na importação
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            📅 Cronograma de Transição
          </h3>
          <div className="bg-yellow-50 p-6 rounded-lg mb-6">
            <div className="space-y-3 text-gray-700">
              <p><strong>2026:</strong> Período de teste (1% IBS + 0.9% CBS) - ST de ICMS ainda vigente</p>
              <p><strong>2027:</strong> Início da transição (8.8% IBS/CBS) - Coexistência de ambos os sistemas</p>
              <p><strong>2028-2032:</strong> Redução gradual do ICMS/ISS e aumento do IBS/CBS</p>
              <p><strong>2033:</strong> Sistema completo (26.5% IBS/CBS) - <strong>Extinção total da ST de ICMS</strong></p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            💼 O Que as Empresas Devem Fazer?
          </h3>
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-3">Para Fabricantes/Importadores (Substitutos)</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Sistemas:</strong> Implementar ERP preparado para calcular IBS/CBS com MVA ajustada</li>
              <li><strong>Créditos:</strong> Documentar TODOS os créditos da cadeia (insumos, energia, frete, máquinas)</li>
              <li><strong>MVA:</strong> Acompanhar regulamentação específica do seu NCM para MVA ajustada</li>
              <li><strong>Preços:</strong> Revisar política de precificação considerando novo sistema</li>
              <li><strong>Compliance:</strong> Treinar equipes sobre as novas regras (2025-2026)</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-3">Para Distribuidores/Atacadistas</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Margens:</strong> Renegociar margens com fornecedores/varejistas considerando fim da ST</li>
              <li><strong>Créditos:</strong> Se credenciar como contribuinte IBS/CBS para aproveitar créditos</li>
              <li><strong>Logística:</strong> Otimizar frete para maximizar créditos (100% recuperável)</li>
              <li><strong>NFe:</strong> Exigir nota fiscal detalhada para comprovação de créditos</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-3">Para Varejistas</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Precificação:</strong> Preparar sistemas para múltiplas alíquotas (padrão, reduzidas, seletivo)</li>
              <li><strong>Consumidor:</strong> Comunicar mudanças de preço de forma transparente (altas e baixas)</li>
              <li><strong>Crédito:</strong> Avaliar vantagem de se tornar contribuinte IBS/CBS (não obrigatório para pequenos)</li>
              <li><strong>Cadastro:</strong> Atualizar cadastro de produtos com NCM correto</li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            ❓ Perguntas Frequentes (FAQ)
          </h3>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">1. A ST vai acabar completamente?</h4>
              <p className="text-gray-700">
                Sim, mas <strong>gradualmente</strong>. A ST de ICMS será extinta até 2033, quando o sistema IBS/CBS 
                estiver 100% implementado. Entre 2026-2032, haverá <strong>coexistência</strong> de ambos os sistemas.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">2. Quem é o responsável pela ST no novo sistema?</h4>
              <p className="text-gray-700">
                Continua sendo o <strong>fabricante ou importador</strong>, mas com regras mais simples e únicas 
                para todo o Brasil (não há mais 27 legislações estaduais diferentes).
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">3. A MVA vai mudar para todos os produtos?</h4>
              <p className="text-gray-700">
                Sim. Haverá um <strong>ajuste geral</strong> da MVA porque o IBS/CBS tem não-cumulatividade plena. 
                Estima-se redução média de 20-30% na MVA, mas cada NCM terá sua MVA específica definida por regulamentação.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">4. O preço final vai subir ou cair?</h4>
              <p className="text-gray-700">
                <strong>Depende do setor:</strong> produtos com cadeia longa e muita cumulatividade tendem a <strong>cair</strong> 
                (eletrônicos, autopeças, cosméticos). Produtos com Imposto Seletivo ou alta MVA podem <strong>subir</strong> 
                (bebidas, cigarros). A expectativa geral é de <strong>neutralidade ou leve redução</strong> para a maioria.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">5. E se o varejista quiser aproveitar créditos?</h4>
              <p className="text-gray-700">
                Varejistas <strong>podem se credenciar</strong> como contribuintes IBS/CBS para aproveitar créditos 
                de suas compras, energia, frete, etc. Mas isso é <strong>opcional</strong> (não obrigatório para micro/pequenas empresas).
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">6. Como fica a guerra fiscal entre estados?</h4>
              <p className="text-gray-700">
                <strong>Acaba.</strong> Com IBS/CBS unificado, não haverá mais diferença de alíquota entre estados. 
                Isso elimina a "guerra fiscal" e torna o e-commerce mais equilibrado.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">7. Quando devo começar a me preparar?</h4>
              <p className="text-gray-700">
                <strong>Agora (2025).</strong> O período de teste começa em janeiro/2026. Empresas devem:
                atualizar sistemas, treinar equipes, mapear créditos disponíveis e acompanhar regulamentações específicas do setor.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mt-8 border-l-4 border-purple-500">
            <h4 className="font-bold text-gray-800 mb-3">🎯 Conclusão</h4>
            <p className="text-gray-700 leading-relaxed">
              A <strong>extinção da Substituição Tributária de ICMS</strong> é uma das mudanças mais significativas 
              da Reforma Tributária. O novo sistema IBS/CBS promete ser <strong>mais simples, transparente e menos cumulativo</strong>, 
              mas exige <strong>preparação cuidadosa</strong> das empresas. Use esta calculadora para simular o impacto no seu produto 
              e comece a se preparar para a transição que começa em 2026.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mt-6">
            <p className="text-gray-700">
              <strong>⚠️ Aviso Legal:</strong> Este artigo tem caráter informativo e educacional. As regras específicas 
              da Substituição Tributária no novo sistema IBS/CBS ainda estão sendo regulamentadas. Consulte sempre um 
              contador ou advogado tributarista para análises precisas do seu caso específico.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg mt-6">
            <p className="text-sm text-gray-600">
              <strong>Fonte Legal:</strong> Emenda Constitucional 132/2023 (Reforma Tributária), 
              Lei Complementar em tramitação no Congresso Nacional, Convênios CONFAZ sobre ICMS-ST vigentes.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default SimuladorST2026;

import { useState } from 'react';
import { FileText, Calculator, AlertCircle, CheckCircle, Download, Info, TrendingUp } from 'lucide-react';

export default function SimuladorNFeIBSCBS() {
  const [formData, setFormData] = useState({
    valorProduto: '',
    estadoOrigem: 'SP',
    estadoDestino: 'RJ',
    ncm: '8471.30.12',
    tipoOperacao: 'venda',
    incluiServico: false,
    valorServico: ''
  });

  const [nfe, setNfe] = useState(null);

  const ncmDatabase = {
    '8471.30.12': { descricao: 'Computadores portáteis', aliquotaIVA: 26.5 },
    '8517.12.31': { descricao: 'Smartphones', aliquotaIVA: 26.5 },
    '8528.72.00': { descricao: 'Televisores LED', aliquotaIVA: 26.5 },
    '8703.23.10': { descricao: 'Veículos 1.0 a 1.5', aliquotaIVA: 26.5, seletivo: 3.0 },
    '2203.00.00': { descricao: 'Cerveja', aliquotaIVA: 26.5, seletivo: 5.0 },
    '0201.20.20': { descricao: 'Carne Bovina (Cesta Básica)', aliquotaIVA: 0 },
    '1006.30.21': { descricao: 'Arroz (Cesta Básica)', aliquotaIVA: 0 },
    '3004.90.99': { descricao: 'Medicamentos', aliquotaIVA: 0 }
  };

  const calcularNFe = () => {
    const valor = parseFloat(formData.valorProduto) || 0;
    const valorServ = formData.incluiServico ? (parseFloat(formData.valorServico) || 0) : 0;
    const ncmInfo = ncmDatabase[formData.ncm] || { descricao: 'Produto Geral', aliquotaIVA: 26.5 };

    // Sistema Atual (2025)
    const icmsAtual = 18; // Média
    const valorICMS = (valor * icmsAtual) / 100;
    const pisCofins = (valor * 3.65) / 100;
    const issAtual = formData.incluiServico ? (valorServ * 5) / 100 : 0;
    const totalTributosAtual = valorICMS + pisCofins + issAtual;

    // Sistema Novo (2026+)
    const aliquotaIBS = ncmInfo.aliquotaIVA * 0.61; // 61% do IVA
    const aliquotaCBS = ncmInfo.aliquotaIVA * 0.39; // 39% do IVA
    const valorIBS = (valor * aliquotaIBS) / 100;
    const valorCBS = (valor * aliquotaCBS) / 100;
    
    // Imposto Seletivo (produtos específicos)
    const aliquotaSeletivo = ncmInfo.seletivo || 0;
    const valorSeletivo = (valor * aliquotaSeletivo) / 100;

    const totalTributosNovo = valorIBS + valorCBS + valorSeletivo;

    const diferenca = totalTributosNovo - totalTributosAtual;
    const percentualDiferenca = totalTributosAtual > 0 ? (diferenca / totalTributosAtual) * 100 : 0;

    setNfe({
      origem: formData.estadoOrigem,
      destino: formData.estadoDestino,
      ncm: formData.ncm,
      descricaoProduto: ncmInfo.descricao,
      valorProduto: valor,
      valorServico: valorServ,
      
      sistemaAtual: {
        icms: valorICMS,
        aliquotaICMS: icmsAtual,
        pisCofins: pisCofins,
        aliquotaPisCofins: 3.65,
        iss: issAtual,
        aliquotaISS: formData.incluiServico ? 5 : 0,
        total: totalTributosAtual
      },
      
      sistemaNovo: {
        ibs: valorIBS,
        aliquotaIBS: aliquotaIBS.toFixed(2),
        cbs: valorCBS,
        aliquotaCBS: aliquotaCBS.toFixed(2),
        seletivo: valorSeletivo,
        aliquotaSeletivo: aliquotaSeletivo,
        total: totalTributosNovo
      },
      
      comparacao: {
        diferenca: diferenca,
        percentual: percentualDiferenca,
        impacto: diferenca > 0 ? 'aumento' : diferenca < 0 ? 'reducao' : 'neutro'
      }
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const formatMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const gerarXML = () => {
    if (!nfe) return;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc versao="5.00" xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe versao="5.00">
      <ide>
        <mod>55</mod>
        <serie>1</serie>
        <dhEmi>${new Date().toISOString()}</dhEmi>
        <tpNF>1</tpNF>
      </ide>
      <emit>
        <UF>${nfe.origem}</UF>
      </emit>
      <dest>
        <UF>${nfe.destino}</UF>
      </dest>
      <det nItem="1">
        <prod>
          <cProd>001</cProd>
          <xProd>${nfe.descricaoProduto}</xProd>
          <NCM>${nfe.ncm}</NCM>
          <vProd>${nfe.valorProduto.toFixed(2)}</vProd>
        </prod>
        <imposto>
          <!-- NOVO MODELO 2026+ -->
          <IBS>
            <vBC>${nfe.valorProduto.toFixed(2)}</vBC>
            <pIBS>${nfe.sistemaNovo.aliquotaIBS}</pIBS>
            <vIBS>${nfe.sistemaNovo.ibs.toFixed(2)}</vIBS>
          </IBS>
          <CBS>
            <vBC>${nfe.valorProduto.toFixed(2)}</vBC>
            <pCBS>${nfe.sistemaNovo.aliquotaCBS}</pCBS>
            <vCBS>${nfe.sistemaNovo.cbs.toFixed(2)}</vCBS>
          </CBS>
          ${nfe.sistemaNovo.seletivo > 0 ? `
          <IS>
            <vBC>${nfe.valorProduto.toFixed(2)}</vBC>
            <pIS>${nfe.sistemaNovo.aliquotaSeletivo}</pIS>
            <vIS>${nfe.sistemaNovo.seletivo.toFixed(2)}</vIS>
          </IS>` : ''}
        </imposto>
      </det>
      <total>
        <ICMSTot>
          <vIBS>${nfe.sistemaNovo.ibs.toFixed(2)}</vIBS>
          <vCBS>${nfe.sistemaNovo.cbs.toFixed(2)}</vCBS>
          <vIS>${nfe.sistemaNovo.seletivo.toFixed(2)}</vIS>
          <vNF>${(nfe.valorProduto + nfe.sistemaNovo.total).toFixed(2)}</vNF>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
</nfeProc>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NFe_IBS_CBS_${nfe.ncm}_${Date.now()}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simulador de Nota Fiscal com IBS/CBS
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gere uma NF-e modelo 2026 com a nova estrutura tributária pós-reforma. 
            Compare campos antigos vs novos e entenda o impacto do IVA Dual brasileiro.
          </p>
        </div>

        {/* Calculadora */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Valor do Produto (R$)
              </label>
              <input
                type="number"
                name="valorProduto"
                value={formData.valorProduto}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10000.00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                NCM (Nomenclatura Comum do Mercosul)
              </label>
              <select
                name="ncm"
                value={formData.ncm}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(ncmDatabase).map(([codigo, info]) => (
                  <option key={codigo} value={codigo}>
                    {codigo} - {info.descricao}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado de Origem
              </label>
              <select
                name="estadoOrigem"
                value={formData.estadoOrigem}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="PR">Paraná</option>
                <option value="SC">Santa Catarina</option>
                <option value="BA">Bahia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado de Destino
              </label>
              <select
                name="estadoDestino"
                value={formData.estadoDestino}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="PR">Paraná</option>
                <option value="SC">Santa Catarina</option>
                <option value="BA">Bahia</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="incluiServico"
                  checked={formData.incluiServico}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Incluir Serviço na Operação
                </span>
              </label>
            </div>

            {formData.incluiServico && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Valor do Serviço (R$)
                </label>
                <input
                  type="number"
                  name="valorServico"
                  value={formData.valorServico}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500.00"
                />
              </div>
            )}
          </div>

          <button
            onClick={calcularNFe}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Gerar Simulação da NF-e 2026
          </button>
        </div>

        {/* Resultados */}
        {nfe && (
          <div className="space-y-6">
            
            {/* Comparativo Visual */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Sistema Atual */}
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                  Sistema Atual (2025)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ICMS ({nfe.sistemaAtual.aliquotaICMS}%)</span>
                    <span className="font-semibold">{formatMoeda(nfe.sistemaAtual.icms)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PIS/COFINS ({nfe.sistemaAtual.aliquotaPisCofins}%)</span>
                    <span className="font-semibold">{formatMoeda(nfe.sistemaAtual.pisCofins)}</span>
                  </div>
                  {nfe.sistemaAtual.iss > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">ISS ({nfe.sistemaAtual.aliquotaISS}%)</span>
                      <span className="font-semibold">{formatMoeda(nfe.sistemaAtual.iss)}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-300 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total Tributos</span>
                    <span className="font-bold text-xl text-gray-900">
                      {formatMoeda(nfe.sistemaAtual.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sistema Novo */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-300">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Sistema Novo (2026+)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">IBS - Estados/Municípios ({nfe.sistemaNovo.aliquotaIBS}%)</span>
                    <span className="font-semibold">{formatMoeda(nfe.sistemaNovo.ibs)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CBS - União ({nfe.sistemaNovo.aliquotaCBS}%)</span>
                    <span className="font-semibold">{formatMoeda(nfe.sistemaNovo.cbs)}</span>
                  </div>
                  {nfe.sistemaNovo.seletivo > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Imposto Seletivo ({nfe.sistemaNovo.aliquotaSeletivo}%)</span>
                      <span className="font-semibold">{formatMoeda(nfe.sistemaNovo.seletivo)}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-blue-300 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total Tributos</span>
                    <span className="font-bold text-xl text-blue-600">
                      {formatMoeda(nfe.sistemaNovo.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Impacto */}
            <div className={`rounded-xl p-6 ${
              nfe.comparacao.impacto === 'aumento' ? 'bg-red-50 border-2 border-red-300' :
              nfe.comparacao.impacto === 'reducao' ? 'bg-green-50 border-2 border-green-300' :
              'bg-gray-50 border-2 border-gray-300'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Impacto da Reforma Tributária
                  </h3>
                  <p className="text-gray-600">
                    {nfe.comparacao.impacto === 'aumento' ? 'Aumento' : 
                     nfe.comparacao.impacto === 'reducao' ? 'Redução' : 'Neutro'} de {' '}
                    <span className="font-bold">
                      {formatMoeda(Math.abs(nfe.comparacao.diferenca))}
                    </span>
                    {' '}({Math.abs(nfe.comparacao.percentual).toFixed(2)}%)
                  </p>
                </div>
                <TrendingUp className={`w-12 h-12 ${
                  nfe.comparacao.impacto === 'aumento' ? 'text-red-600' :
                  nfe.comparacao.impacto === 'reducao' ? 'text-green-600' :
                  'text-gray-600'
                }`} />
              </div>
            </div>

            {/* Botão Download XML */}
            <button
              onClick={gerarXML}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Baixar XML da NF-e Modelo 2026
            </button>

            {/* Comparação de Campos */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                📋 Comparação de Campos XML
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="py-3 px-4 font-semibold">Campo/Tag</th>
                      <th className="py-3 px-4 font-semibold">Sistema Atual</th>
                      <th className="py-3 px-4 font-semibold">Sistema Novo (2026+)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 px-4 font-mono text-sm">&lt;ICMS&gt;</td>
                      <td className="py-3 px-4 text-green-600">✓ Existe</td>
                      <td className="py-3 px-4 text-red-600">✗ Removido</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-sm">&lt;PIS&gt;</td>
                      <td className="py-3 px-4 text-green-600">✓ Existe</td>
                      <td className="py-3 px-4 text-red-600">✗ Removido</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-sm">&lt;COFINS&gt;</td>
                      <td className="py-3 px-4 text-green-600">✓ Existe</td>
                      <td className="py-3 px-4 text-red-600">✗ Removido</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-sm">&lt;IBS&gt;</td>
                      <td className="py-3 px-4 text-red-600">✗ Não existe</td>
                      <td className="py-3 px-4 text-green-600">✓ Novo</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-sm">&lt;CBS&gt;</td>
                      <td className="py-3 px-4 text-red-600">✗ Não existe</td>
                      <td className="py-3 px-4 text-green-600">✓ Novo</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-sm">&lt;IS&gt; (Seletivo)</td>
                      <td className="py-3 px-4 text-red-600">✗ Não existe</td>
                      <td className="py-3 px-4 text-green-600">✓ Novo (condicional)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Artigo SEO */}
        <article className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-lg max-w-none">
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            O Que é a Nota Fiscal Eletrônica com IBS e CBS?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A <strong>Reforma Tributária Brasileira</strong>, aprovada em 2023 e com implementação gradual a partir de 2026, 
            vai transformar completamente a estrutura das notas fiscais eletrônicas no Brasil. O novo modelo substitui os 
            tradicionais impostos sobre consumo (ICMS, PIS, COFINS e ISS) por um <strong>sistema de IVA dual</strong>, 
            composto pelo <strong>IBS (Imposto sobre Bens e Serviços)</strong> e pela <strong>CBS (Contribuição sobre Bens e Serviços)</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Essa mudança vai exigir que todas as empresas brasileiras adaptem seus sistemas de emissão de NF-e para 
            contemplar os novos campos tributários. A estrutura XML da nota fiscal será modificada, com a inclusão de 
            tags específicas para IBS, CBS e o novo <strong>Imposto Seletivo</strong> (que incide sobre produtos geradores 
            de externalidades negativas, como bebidas alcoólicas, cigarros e veículos poluentes).
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            Como Calcular a Nova NF-e com IBS/CBS em 2025
          </h2>
          
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 1: Identificar a Alíquota do IVA
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            A <strong>alíquota padrão do IVA brasileiro</strong> foi definida em <strong>26,5%</strong> (uma das mais altas do mundo). 
            No entanto, diversos setores contam com <strong>alíquotas reduzidas</strong> ou até mesmo <strong>alíquota zero</strong>:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>Alíquota Zero (0%)</strong>: Cesta básica nacional, saúde, educação, transporte público, medicamentos</li>
            <li><strong>Alíquota Reduzida (60% do padrão = ~15,9%)</strong>: Serviços profissionais, alguns alimentos processados</li>
            <li><strong>Alíquota Padrão (26,5%)</strong>: Comércio geral, indústria, serviços comerciais</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 2: Dividir entre IBS e CBS
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            O IVA brasileiro é <strong>dual</strong>, ou seja, dividido entre dois impostos:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>IBS (Imposto sobre Bens e Serviços)</strong> - 61% do IVA → arrecadado por Estados e Municípios</li>
            <li><strong>CBS (Contribuição sobre Bens e Serviços)</strong> - 39% do IVA → arrecadado pela União</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Exemplo prático:</strong> Se a alíquota padrão é 26,5%, então:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li>IBS = 26,5% × 0,61 = <strong>16,165%</strong></li>
            <li>CBS = 26,5% × 0,39 = <strong>10,335%</strong></li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 3: Calcular o Imposto Seletivo (quando aplicável)
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Produtos que geram <strong>externalidades negativas</strong> à saúde ou ao meio ambiente terão uma 
            alíquota adicional do <strong>Imposto Seletivo (IS)</strong>:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li>Bebidas alcoólicas: <strong>+5%</strong></li>
            <li>Cigarros e produtos fumígenos: <strong>+10%</strong></li>
            <li>Veículos poluentes: <strong>+3%</strong></li>
            <li>Extração de minérios: <strong>variável</strong></li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 4: Preencher os Novos Campos XML
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Na estrutura XML da NF-e modelo 2026, os campos serão assim:
          </p>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-6 overflow-x-auto">
            <pre className="text-sm">
{`<imposto>
  <IBS>
    <vBC>10000.00</vBC>         <!-- Base de cálculo -->
    <pIBS>16.165</pIBS>         <!-- Alíquota IBS -->
    <vIBS>1616.50</vIBS>        <!-- Valor IBS -->
  </IBS>
  <CBS>
    <vBC>10000.00</vBC>
    <pCBS>10.335</pCBS>
    <vCBS>1033.50</vCBS>
  </CBS>
  <IS>
    <vBC>10000.00</vBC>
    <pIS>3.00</pIS>             <!-- Imposto Seletivo -->
    <vIS>300.00</vIS>
  </IS>
</imposto>`}
            </pre>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            📊 Exemplos Práticos de Cálculo
          </h2>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Exemplo 1: Venda de Computador (Comércio)
          </h3>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
            <ul className="space-y-2 text-gray-800">
              <li><strong>Produto:</strong> Notebook</li>
              <li><strong>Valor:</strong> R$ 5.000,00</li>
              <li><strong>NCM:</strong> 8471.30.12</li>
              <li><strong>Alíquota IVA:</strong> 26,5%</li>
              <li><strong>IBS (16,165%):</strong> R$ 808,25</li>
              <li><strong>CBS (10,335%):</strong> R$ 516,75</li>
              <li><strong>Total Tributos:</strong> R$ 1.325,00</li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Exemplo 2: Venda de Cerveja (com Imposto Seletivo)
          </h3>
          <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-6">
            <ul className="space-y-2 text-gray-800">
              <li><strong>Produto:</strong> Cerveja</li>
              <li><strong>Valor:</strong> R$ 100,00</li>
              <li><strong>NCM:</strong> 2203.00.00</li>
              <li><strong>Alíquota IVA:</strong> 26,5%</li>
              <li><strong>IBS:</strong> R$ 16,165</li>
              <li><strong>CBS:</strong> R$ 10,335</li>
              <li><strong>Imposto Seletivo (5%):</strong> R$ 5,00</li>
              <li><strong>Total Tributos:</strong> R$ 31,50</li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Exemplo 3: Venda de Arroz (Cesta Básica - Alíquota Zero)
          </h3>
          <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-6">
            <ul className="space-y-2 text-gray-800">
              <li><strong>Produto:</strong> Arroz</li>
              <li><strong>Valor:</strong> R$ 30,00</li>
              <li><strong>NCM:</strong> 1006.30.21</li>
              <li><strong>Alíquota IVA:</strong> 0%</li>
              <li><strong>Total Tributos:</strong> R$ 0,00</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ❌ Erros Comuns ao Emitir NF-e com IBS/CBS
          </h2>
          <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-4">
            <li>
              <strong>Confundir a alíquota do IVA com ICMS:</strong> O IVA não é substituição direta do ICMS. 
              A alíquota padrão de 26,5% engloba todos os impostos sobre consumo.
            </li>
            <li>
              <strong>Esquecer de dividir entre IBS e CBS:</strong> Sempre aplicar a proporção 61% (IBS) e 39% (CBS).
            </li>
            <li>
              <strong>Ignorar o Imposto Seletivo:</strong> Produtos como bebidas, cigarros e veículos têm alíquota adicional.
            </li>
            <li>
              <strong>Não verificar se o produto tem alíquota reduzida ou zero:</strong> Diversos setores são beneficiados. 
              Consulte a lista oficial da Receita Federal.
            </li>
            <li>
              <strong>Usar tags XML antigas:</strong> Tags como &lt;ICMS&gt;, &lt;PIS&gt; e &lt;COFINS&gt; serão 
              removidas a partir de 2026. Use apenas &lt;IBS&gt; e &lt;CBS&gt;.
            </li>
            <li>
              <strong>Não atualizar o sistema de ERP/emissor de NF-e:</strong> É fundamental atualizar o software 
              de emissão fiscal antes da vigência obrigatória.
            </li>
          </ol>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ❓ Perguntas Frequentes (FAQ)
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                1. Quando a NF-e com IBS/CBS se torna obrigatória?
              </h4>
              <p className="text-gray-700">
                A implementação será gradual: 2026 (teste), 2027 (obrigatório com coexistência de tributos antigos), 
                e 2033 (apenas IBS/CBS). A partir de <strong>1º de janeiro de 2027</strong>, todas as NF-e deverão 
                incluir os campos de IBS e CBS.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                2. O que acontece com créditos de ICMS acumulados?
              </h4>
              <p className="text-gray-700">
                Os créditos de ICMS acumulados até 2026 poderão ser aproveitados durante o período de transição 
                (2027-2032). Após 2033, apenas créditos de IBS/CBS serão válidos.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                3. Posso usar o mesmo XML da NF-e atual?
              </h4>
              <p className="text-gray-700">
                Não. A estrutura XML será atualizada. Você precisará de um sistema de emissão de NF-e compatível 
                com a versão 5.0 ou superior, que incluirá os novos campos de IBS, CBS e Imposto Seletivo.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                4. Como fica a substituição tributária (ST)?
              </h4>
              <p className="text-gray-700">
                A substituição tributária será mantida durante a transição, mas adaptada para IBS/CBS. O modelo 
                de recolhimento antecipado continuará existindo, mas com regras específicas do novo sistema.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                5. Exportações continuam isentas?
              </h4>
              <p className="text-gray-700">
                Sim! As exportações continuam com <strong>alíquota zero</strong> e direito a crédito integral de 
                IBS/CBS sobre insumos, mantendo a competitividade internacional.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                6. MEI e Simples Nacional terão NF-e diferente?
              </h4>
              <p className="text-gray-700">
                Empresas do Simples Nacional terão <strong>tratamento especial</strong> com alíquotas diferenciadas, 
                mas também deverão emitir NF-e com campos de IBS/CBS. A estrutura XML será a mesma.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            📚 Termos Importantes e Conceitos
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-900 mb-2">IBS (Imposto sobre Bens e Serviços)</h4>
              <p className="text-gray-700 text-sm">
                Imposto de competência dos Estados e Municípios que substitui ICMS e ISS. Representa 61% do IVA total.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h4 className="font-bold text-purple-900 mb-2">CBS (Contribuição sobre Bens e Serviços)</h4>
              <p className="text-gray-700 text-sm">
                Contribuição federal que substitui PIS e COFINS. Representa 39% do IVA total.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-6">
              <h4 className="font-bold text-red-900 mb-2">Imposto Seletivo (IS)</h4>
              <p className="text-gray-700 text-sm">
                Tributo adicional sobre produtos prejudiciais à saúde ou meio ambiente (bebidas, cigarros, veículos).
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-bold text-green-900 mb-2">Alíquota Zero</h4>
              <p className="text-gray-700 text-sm">
                Benefício fiscal para cesta básica, saúde, educação e transporte público, com direito a crédito.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6">
              <h4 className="font-bold text-yellow-900 mb-2">IVA Dual</h4>
              <p className="text-gray-700 text-sm">
                Sistema em que o IVA é dividido entre entes federativos (IBS) e União (CBS), mantendo autonomia fiscal.
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6">
              <h4 className="font-bold text-indigo-900 mb-2">NCM (Nomenclatura Comum do Mercosul)</h4>
              <p className="text-gray-700 text-sm">
                Código de 8 dígitos que identifica a natureza da mercadoria e determina a tributação aplicável.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ⚖️ O Que Diz a Legislação Atual
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A Reforma Tributária foi aprovada através da <strong>Emenda Constitucional nº 132/2023</strong>, que alterou 
            diversos artigos da Constituição Federal relacionados ao Sistema Tributário Nacional. Os principais marcos legais são:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-3">
            <li>
              <strong>EC 132/2023:</strong> Institui o IBS e a CBS, define alíquotas, transição e benefícios fiscais.
            </li>
            <li>
              <strong>Lei Complementar (aguardando regulamentação em 2024-2025):</strong> Vai definir as regras 
              operacionais, estrutura XML da NF-e, lista de produtos com alíquota zero/reduzida, e funcionamento 
              do Comitê Gestor do IBS.
            </li>
            <li>
              <strong>Cronograma oficial:</strong>
              <ul className="list-circle pl-6 mt-2 space-y-1">
                <li>2026: Período de testes e adaptação (opcional)</li>
                <li>2027: Início da cobrança de CBS (1% teste) e fim de PIS/COFINS</li>
                <li>2029: IBS começa a ser cobrado (teste com 0,1%)</li>
                <li>2033: Sistema totalmente implementado, fim definitivo de ICMS e ISS</li>
              </ul>
            </li>
          </ul>

          <div className="bg-amber-50 border-l-4 border-amber-600 p-6 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-amber-900 mb-2">Atenção Empresas!</h4>
                <p className="text-amber-800 text-sm">
                  A adequação dos sistemas de emissão de NF-e deve começar AGORA. Empresas que deixarem para a última 
                  hora podem enfrentar multas por emissão incorreta de documentos fiscais e incompatibilidade com a SEFAZ.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            🎯 Conclusão
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A mudança para o modelo de NF-e com <strong>IBS e CBS</strong> é a maior transformação tributária da história 
            do Brasil. Ela promete <strong>simplificar a vida das empresas</strong>, acabar com a guerra fiscal entre estados 
            e tornar o sistema mais transparente e menos burocrático.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            No entanto, essa transição exige <strong>planejamento antecipado</strong>. Empresas devem atualizar seus sistemas 
            de ERP, treinar equipes fiscais e contábeis, revisar processos de precificação e se preparar para a nova realidade 
            tributária que começa oficialmente em 2027.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Use este <strong>Simulador de NF-e com IBS/CBS</strong> para entender o impacto da reforma no seu negócio e 
            comece desde já a se preparar para o futuro da tributação brasileira. A reforma é inevitável — mas com conhecimento 
            e planejamento, sua empresa estará à frente da concorrência.
          </p>

          <div className="bg-blue-600 text-white rounded-xl p-8 mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">
              🚀 Prepare sua empresa para 2026!
            </h3>
            <p className="text-blue-100 mb-6">
              Simule agora quantos documentos fiscais serão necessários atualizar e veja o impacto financeiro da reforma 
              no seu setor.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Usar Simulador Agora
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

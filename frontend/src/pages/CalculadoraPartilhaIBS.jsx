import { useState } from 'react';
import { MapPin, Building2, TrendingUp, Calculator, Info, ArrowRight, Package, Percent } from 'lucide-react';

export default function CalculadoraPartilhaIBS() {
  const [formData, setFormData] = useState({
    faturamento: '',
    estadoOrigem: 'SP',
    estadoDestino: 'RJ',
    anoSimulacao: '2029',
    tipoOperacao: 'venda'
  });

  const [resultado, setResultado] = useState(null);

  const estados = [
    { sigla: 'SP', nome: 'São Paulo', regiao: 'Sudeste' },
    { sigla: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste' },
    { sigla: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste' },
    { sigla: 'ES', nome: 'Espírito Santo', regiao: 'Sudeste' },
    { sigla: 'PR', nome: 'Paraná', regiao: 'Sul' },
    { sigla: 'SC', nome: 'Santa Catarina', regiao: 'Sul' },
    { sigla: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul' },
    { sigla: 'BA', nome: 'Bahia', regiao: 'Nordeste' },
    { sigla: 'CE', nome: 'Ceará', regiao: 'Nordeste' },
    { sigla: 'PE', nome: 'Pernambuco', regiao: 'Nordeste' },
    { sigla: 'GO', nome: 'Goiás', regiao: 'Centro-Oeste' },
    { sigla: 'DF', nome: 'Distrito Federal', regiao: 'Centro-Oeste' },
    { sigla: 'MT', nome: 'Mato Grosso', regiao: 'Centro-Oeste' },
    { sigla: 'AM', nome: 'Amazonas', regiao: 'Norte' },
    { sigla: 'PA', nome: 'Pará', regiao: 'Norte' }
  ];

  const anosTransicao = [
    { ano: '2027', percentualDestino: 10, percentualOrigem: 90 },
    { ano: '2028', percentualDestino: 20, percentualOrigem: 80 },
    { ano: '2029', percentualDestino: 30, percentualOrigem: 70 },
    { ano: '2030', percentualDestino: 40, percentualOrigem: 60 },
    { ano: '2031', percentualDestino: 50, percentualOrigem: 50 },
    { ano: '2032', percentualDestino: 60, percentualOrigem: 40 },
    { ano: '2033', percentualDestino: 70, percentualOrigem: 30 },
    { ano: '2034', percentualDestino: 80, percentualOrigem: 20 },
    { ano: '2035', percentualDestino: 90, percentualOrigem: 10 },
    { ano: '2036', percentualDestino: 100, percentualOrigem: 0 }
  ];

  const tiposOperacao = {
    venda: {
      nome: 'Venda de Mercadoria',
      descricao: 'Venda com entrega no destino',
      impacto: 'alto'
    },
    servico: {
      nome: 'Prestação de Serviço',
      descricao: 'Serviço executado para outro estado',
      impacto: 'medio'
    },
    industria: {
      nome: 'Industrialização',
      descricao: 'Venda de produto industrializado',
      impacto: 'alto'
    },
    transferencia: {
      nome: 'Transferência entre Filiais',
      descricao: 'Movimentação interna da empresa',
      impacto: 'baixo'
    }
  };

  const calcular = () => {
    const faturamentoValor = parseFloat(formData.faturamento) || 0;
    const anoEscolhido = anosTransicao.find(a => a.ano === formData.anoSimulacao);

    // Alíquota padrão do IBS (61% do IVA de 26,5%)
    const aliquotaIBS = 26.5 * 0.61; // 16,165%

    // Valor total do IBS
    const valorTotalIBS = faturamentoValor * (aliquotaIBS / 100);

    // Divisão entre Origem e Destino
    const valorOrigem = valorTotalIBS * (anoEscolhido.percentualOrigem / 100);
    const valorDestino = valorTotalIBS * (anoEscolhido.percentualDestino / 100);

    // Subdivisão da parcela de origem (Estado 75% / Município 25%)
    const origemEstado = valorOrigem * 0.75;
    const origemMunicipio = valorOrigem * 0.25;

    // Subdivisão da parcela de destino (Estado 75% / Município 25%)
    const destinoEstado = valorDestino * 0.75;
    const destinoMunicipio = valorDestino * 0.25;

    // Projeção para os próximos 4 anos
    const projecao = anosTransicao
      .filter(a => parseInt(a.ano) >= parseInt(formData.anoSimulacao))
      .slice(0, 4)
      .map(ano => {
        const totalIBS = faturamentoValor * (aliquotaIBS / 100);
        const origem = totalIBS * (ano.percentualOrigem / 100);
        const destino = totalIBS * (ano.percentualDestino / 100);
        
        return {
          ano: ano.ano,
          percentualOrigem: ano.percentualOrigem,
          percentualDestino: ano.percentualDestino,
          valorOrigem: origem,
          valorDestino: destino,
          totalIBS: totalIBS
        };
      });

    // Impacto comparativo: quanto cada estado/município recebe
    const impactoOrigem = {
      estado: formData.estadoOrigem,
      estadoValor: origemEstado,
      municipioValor: origemMunicipio,
      totalRecebido: valorOrigem,
      percentual: anoEscolhido.percentualOrigem
    };

    const impactoDestino = {
      estado: formData.estadoDestino,
      estadoValor: destinoEstado,
      municipioValor: destinoMunicipio,
      totalRecebido: valorDestino,
      percentual: anoEscolhido.percentualDestino
    };

    // Análise de migração de recursos
    const migracaoAnual = projecao.length > 1 
      ? projecao[1].valorDestino - projecao[0].valorDestino 
      : 0;

    setResultado({
      faturamento: faturamentoValor,
      ano: formData.anoSimulacao,
      aliquotaIBS: aliquotaIBS,
      valorTotalIBS: valorTotalIBS,
      
      distribuicao: {
        valorOrigem: valorOrigem,
        valorDestino: valorDestino,
        percentualOrigem: anoEscolhido.percentualOrigem,
        percentualDestino: anoEscolhido.percentualDestino
      },
      
      detalhamentoOrigem: {
        estado: origemEstado,
        municipio: origemMunicipio,
        estadoSigla: formData.estadoOrigem,
        estadoNome: estados.find(e => e.sigla === formData.estadoOrigem)?.nome
      },
      
      detalhamentoDestino: {
        estado: destinoEstado,
        municipio: destinoMunicipio,
        estadoSigla: formData.estadoDestino,
        estadoNome: estados.find(e => e.sigla === formData.estadoDestino)?.nome
      },
      
      impactoOrigem: impactoOrigem,
      impactoDestino: impactoDestino,
      
      projecao: projecao,
      migracaoAnual: migracaoAnual,
      
      tipoOperacao: tiposOperacao[formData.tipoOperacao]
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Calculadora de Partilha do IBS
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra como o IBS será dividido entre estado de origem e destino durante a transição tributária (2027-2036). 
            Entenda o impacto da migração do princípio de origem para destino.
          </p>
        </div>

        {/* Calculadora */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Faturamento da Operação (R$)
              </label>
              <input
                type="number"
                name="faturamento"
                value={formData.faturamento}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100000.00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Operação
              </label>
              <select
                name="tipoOperacao"
                value={formData.tipoOperacao}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(tiposOperacao).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado de Origem (Vendedor)
              </label>
              <select
                name="estadoOrigem"
                value={formData.estadoOrigem}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {estados.map(estado => (
                  <option key={estado.sigla} value={estado.sigla}>
                    {estado.sigla} - {estado.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado de Destino (Comprador)
              </label>
              <select
                name="estadoDestino"
                value={formData.estadoDestino}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {estados.map(estado => (
                  <option key={estado.sigla} value={estado.sigla}>
                    {estado.sigla} - {estado.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ano da Simulação (Período de Transição)
              </label>
              <select
                name="anoSimulacao"
                value={formData.anoSimulacao}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {anosTransicao.map(ano => (
                  <option key={ano.ano} value={ano.ano}>
                    {ano.ano} - Destino {ano.percentualDestino}% / Origem {ano.percentualOrigem}%
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={calcular}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calcular Partilha do IBS
          </button>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="space-y-6">
            
            {/* Resumo Geral */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2">Distribuição do IBS em {resultado.ano}</h2>
                <p className="text-blue-100 text-lg">
                  Operação: {resultado.tipoOperacao.nome}
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/20 backdrop-blur rounded-xl p-6 text-center">
                  <div className="text-sm text-blue-100 mb-2">Faturamento</div>
                  <div className="text-3xl font-black">{formatMoeda(resultado.faturamento)}</div>
                </div>
                
                <div className="bg-white/20 backdrop-blur rounded-xl p-6 text-center">
                  <div className="text-sm text-blue-100 mb-2">IBS Total</div>
                  <div className="text-3xl font-black">{formatMoeda(resultado.valorTotalIBS)}</div>
                  <div className="text-xs text-blue-100 mt-1">Alíquota {formatPercent(resultado.aliquotaIBS)}</div>
                </div>
                
                <div className="bg-white/20 backdrop-blur rounded-xl p-6 text-center">
                  <div className="text-sm text-blue-100 mb-2">Regra de Partilha</div>
                  <div className="text-2xl font-black">
                    {resultado.distribuicao.percentualDestino}% / {resultado.distribuicao.percentualOrigem}%
                  </div>
                  <div className="text-xs text-blue-100 mt-1">Destino / Origem</div>
                </div>
              </div>
            </div>

            {/* Comparação Visual Origem vs Destino */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* ORIGEM */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">ORIGEM</h3>
                    <p className="text-sm text-gray-600">{resultado.detalhamentoOrigem.estadoNome}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Percentual</span>
                    <span className="text-3xl font-black text-orange-600">
                      {formatPercent(resultado.distribuicao.percentualOrigem)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div 
                      className="bg-orange-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${resultado.distribuicao.percentualOrigem}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Total Origem</span>
                      <span className="text-2xl font-black text-orange-600">
                        {formatMoeda(resultado.distribuicao.valorOrigem)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-600 mb-1">Estado (75%)</div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatMoeda(resultado.detalhamentoOrigem.estado)}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-600 mb-1">Município (25%)</div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatMoeda(resultado.detalhamentoOrigem.municipio)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DESTINO */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">DESTINO</h3>
                    <p className="text-sm text-gray-600">{resultado.detalhamentoDestino.estadoNome}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Percentual</span>
                    <span className="text-3xl font-black text-green-600">
                      {formatPercent(resultado.distribuicao.percentualDestino)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div 
                      className="bg-green-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${resultado.distribuicao.percentualDestino}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Total Destino</span>
                      <span className="text-2xl font-black text-green-600">
                        {formatMoeda(resultado.distribuicao.valorDestino)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-600 mb-1">Estado (75%)</div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatMoeda(resultado.detalhamentoDestino.estado)}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-600 mb-1">Município (25%)</div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatMoeda(resultado.detalhamentoDestino.municipio)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projeção 4 Anos */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Projeção da Partilha (Próximos 4 Anos)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="py-3 px-4">Ano</th>
                      <th className="py-3 px-4 text-center">% Origem</th>
                      <th className="py-3 px-4 text-center">% Destino</th>
                      <th className="py-3 px-4 text-right">Valor Origem</th>
                      <th className="py-3 px-4 text-right">Valor Destino</th>
                      <th className="py-3 px-4 text-right">Total IBS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {resultado.projecao.map((ano, index) => (
                      <tr key={ano.ano} className={index === 0 ? 'bg-blue-50 font-semibold' : ''}>
                        <td className="py-3 px-4">{ano.ano}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">
                            {formatPercent(ano.percentualOrigem)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                            {formatPercent(ano.percentualDestino)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-orange-600 font-semibold">
                          {formatMoeda(ano.valorOrigem)}
                        </td>
                        <td className="py-3 px-4 text-right text-green-600 font-semibold">
                          {formatMoeda(ano.valorDestino)}
                        </td>
                        <td className="py-3 px-4 text-right font-bold">
                          {formatMoeda(ano.totalIBS)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Análise de Migração */}
            {resultado.migracaoAnual !== 0 && (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <ArrowRight className="w-6 h-6" />
                  Migração de Recursos
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/20 backdrop-blur rounded-lg p-6">
                    <div className="text-sm text-purple-100 mb-2">Migração Anual para Destino</div>
                    <div className="text-3xl font-black">
                      {formatMoeda(Math.abs(resultado.migracaoAnual))}
                    </div>
                    <p className="text-sm text-purple-100 mt-2">
                      Aumento progressivo de {resultado.detalhamentoDestino.estadoNome} ano a ano
                    </p>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur rounded-lg p-6">
                    <div className="text-sm text-purple-100 mb-2">Impacto Total até 2036</div>
                    <div className="text-3xl font-black">
                      {formatMoeda(resultado.valorTotalIBS)}
                    </div>
                    <p className="text-sm text-purple-100 mt-2">
                      100% do IBS será destinado ao estado de consumo (destino)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">
                    💡 Como Funciona a Partilha durante a Transição
                  </h4>
                  <p className="text-blue-800 leading-relaxed text-sm">
                    De 2027 a 2036, o IBS migrará gradualmente do princípio de <strong>origem</strong> (onde é produzido) 
                    para <strong>destino</strong> (onde é consumido). A cada ano, 10% a mais vai para o destino, 
                    até atingir 100% em 2036. Isso beneficia estados consumidores e equilibra a federação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Artigo SEO */}
        <article className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-lg max-w-none">
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            O Que é a Partilha do IBS?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A <strong>Partilha do IBS</strong> é o mecanismo de divisão da arrecadação do Imposto sobre Bens e Serviços 
            entre o estado/município de <strong>origem</strong> (onde a mercadoria é produzida ou o serviço prestado) e 
            o estado/município de <strong>destino</strong> (onde o produto é consumido). Durante o período de transição 
            da Reforma Tributária (2027-2036), essa divisão mudará gradualmente do princípio de origem para o de destino.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Essa transformação é uma das mais importantes da reforma, pois <strong>redistribui a arrecadação tributária</strong> 
            no Brasil. Estados produtores (como SP, MG, RS) perderão parte da receita, enquanto estados consumidores 
            (como RJ, DF, estados do Norte/Nordeste) ganharão mais recursos. O objetivo é promover <strong>justiça 
            federativa</strong> e eliminar a "guerra fiscal" entre estados.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            Como Calcular a Partilha do IBS
          </h2>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 1: Calcular o IBS Total
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            O IBS correspone a 61% do IVA total de 26,5%:
          </p>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-6 overflow-x-auto">
            <h4 className="text-lg font-bold mb-3 text-white">Fórmula do IBS</h4>
            <pre className="text-sm">
{`Alíquota IBS = 26,5% × 0,61 = 16,165%

IBS Total = Faturamento × 16,165%

Exemplo:
• Faturamento: R$ 100.000
• IBS = 100.000 × 0,16165
• IBS = R$ 16.165,00`}
            </pre>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 2: Aplicar o Percentual de Partilha do Ano
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Cada ano da transição tem uma regra diferente:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-3 px-4 border">Ano</th>
                  <th className="py-3 px-4 border text-center">% Destino</th>
                  <th className="py-3 px-4 border text-center">% Origem</th>
                  <th className="py-3 px-4 border">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-blue-50">
                  <td className="py-3 px-4 border font-semibold">2027</td>
                  <td className="py-3 px-4 border text-center font-bold text-green-600">10%</td>
                  <td className="py-3 px-4 border text-center font-bold text-orange-600">90%</td>
                  <td className="py-3 px-4 border text-sm">Início da transição</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border font-semibold">2028</td>
                  <td className="py-3 px-4 border text-center font-bold text-green-600">20%</td>
                  <td className="py-3 px-4 border text-center font-bold text-orange-600">80%</td>
                  <td className="py-3 px-4 border text-sm">+10% para destino</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="py-3 px-4 border font-semibold">2029</td>
                  <td className="py-3 px-4 border text-center font-bold text-green-600">30%</td>
                  <td className="py-3 px-4 border text-center font-bold text-orange-600">70%</td>
                  <td className="py-3 px-4 border text-sm">+10% para destino</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border font-semibold">2031</td>
                  <td className="py-3 px-4 border text-center font-bold text-green-600">50%</td>
                  <td className="py-3 px-4 border text-center font-bold text-orange-600">50%</td>
                  <td className="py-3 px-4 border text-sm">Meio da transição</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="py-3 px-4 border font-semibold">2036</td>
                  <td className="py-3 px-4 border text-center font-bold text-green-700">100%</td>
                  <td className="py-3 px-4 border text-center font-bold text-gray-400">0%</td>
                  <td className="py-3 px-4 border text-sm font-bold">Fim da transição</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Passo 3: Dividir entre Estado e Município
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Tanto a parcela de origem quanto a de destino são subdivididas:
          </p>

          <div className="bg-blue-600 text-white rounded-lg p-8 mb-6">
            <h4 className="text-2xl font-bold mb-4 text-center">Subdivisão do IBS</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/20 backdrop-blur rounded-lg p-6">
                <div className="text-center">
                  <div className="text-4xl font-black mb-2">75%</div>
                  <div className="text-lg">Estado</div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-6">
                <div className="text-center">
                  <div className="text-4xl font-black mb-2">25%</div>
                  <div className="text-lg">Município</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
            <h4 className="font-bold text-gray-900 mb-3">Exemplo Completo - Ano 2029</h4>
            <ul className="space-y-2 text-gray-800">
              <li><strong>Faturamento:</strong> R$ 100.000</li>
              <li><strong>IBS Total:</strong> R$ 16.165 (16,165%)</li>
              <li className="pt-3 border-t border-gray-300">
                <strong>Partilha 2029:</strong> 30% Destino / 70% Origem
              </li>
              <li className="pl-4">→ <strong>Origem:</strong> R$ 16.165 × 0,70 = R$ 11.315,50</li>
              <li className="pl-8 text-sm">• Estado SP: R$ 8.486,63 (75%)</li>
              <li className="pl-8 text-sm">• Município SP: R$ 2.828,88 (25%)</li>
              <li className="pl-4">→ <strong>Destino:</strong> R$ 16.165 × 0,30 = R$ 4.849,50</li>
              <li className="pl-8 text-sm">• Estado RJ: R$ 3.637,13 (75%)</li>
              <li className="pl-8 text-sm">• Município RJ: R$ 1.212,38 (25%)</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            📊 Exemplos Práticos de Partilha
          </h2>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Exemplo 1: Indústria em SP vendendo para RJ
          </h3>
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
            <ul className="space-y-2 text-gray-800">
              <li><strong>Operação:</strong> Venda de R$ 500.000 (SP → RJ)</li>
              <li><strong>Ano:</strong> 2027 (10% destino / 90% origem)</li>
              <li><strong>IBS Total:</strong> R$ 80.825</li>
              <li className="pt-3 border-t border-gray-300">
                <strong>São Paulo recebe:</strong> R$ 72.742,50 (90%)
              </li>
              <li className="pl-4 text-sm">• Estado: R$ 54.556,88</li>
              <li className="pl-4 text-sm">• Município: R$ 18.185,63</li>
              <li className="pt-2">
                <strong>Rio de Janeiro recebe:</strong> R$ 8.082,50 (10%)
              </li>
              <li className="pl-4 text-sm">• Estado: R$ 6.061,88</li>
              <li className="pl-4 text-sm">• Município: R$ 2.020,63</li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Exemplo 2: Comércio em MG vendendo para BA (ano 2033)
          </h3>
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
            <ul className="space-y-2 text-gray-800">
              <li><strong>Operação:</strong> Venda de R$ 200.000 (MG → BA)</li>
              <li><strong>Ano:</strong> 2033 (70% destino / 30% origem)</li>
              <li><strong>IBS Total:</strong> R$ 32.330</li>
              <li className="pt-3 border-t border-gray-300">
                <strong>Minas Gerais recebe:</strong> R$ 9.699 (30%)
              </li>
              <li className="pl-4 text-sm">• Estado: R$ 7.274,25</li>
              <li className="pl-4 text-sm">• Município: R$ 2.424,75</li>
              <li className="pt-2">
                <strong>Bahia recebe:</strong> R$ 22.631 (70%)
              </li>
              <li className="pl-4 text-sm">• Estado: R$ 16.973,25</li>
              <li className="pl-4 text-sm">• Município: R$ 5.657,75</li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Exemplo 3: Serviço Digital em SP para cliente no DF (ano 2036)
          </h3>
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
            <ul className="space-y-2 text-gray-800">
              <li><strong>Operação:</strong> Prestação de serviço R$ 100.000 (SP → DF)</li>
              <li><strong>Ano:</strong> 2036 (100% destino / 0% origem)</li>
              <li><strong>IBS Total:</strong> R$ 16.165</li>
              <li className="pt-3 border-t border-gray-300">
                <strong>São Paulo recebe:</strong> R$ 0,00 (0%)
              </li>
              <li className="pt-2">
                <strong>Distrito Federal recebe:</strong> R$ 16.165 (100%)
              </li>
              <li className="pl-4 text-sm">• Distrito Federal: R$ 12.123,75 (75%)</li>
              <li className="pl-4 text-sm">• Brasília: R$ 4.041,25 (25%)</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ❌ Erros Comuns sobre a Partilha
          </h2>
          <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-4">
            <li>
              <strong>Achar que a partilha é 50/50 desde o início:</strong> Não! Começa com 10% destino em 2027 
              e aumenta gradualmente até 100% em 2036.
            </li>
            <li>
              <strong>Confundir IBS com CBS:</strong> A partilha se aplica APENAS ao IBS (estadual/municipal). 
              O CBS (federal) não tem partilha.
            </li>
            <li>
              <strong>Não considerar a subdivisão Estado/Município:</strong> Tanto origem quanto destino dividem 
              a receita em 75% Estado e 25% Município.
            </li>
            <li>
              <strong>Esquecer que alguns setores têm regras especiais:</strong> Combustíveis, energia e 
              telecomunicações podem ter partilhas diferenciadas.
            </li>
            <li>
              <strong>Pensar que só beneficia estados ricos:</strong> Na verdade, beneficia estados consumidores, 
              muitos dos quais são do Norte/Nordeste.
            </li>
            <li>
              <strong>Não planejar o fluxo de caixa durante a transição:</strong> Empresas que vendem para outros 
              estados precisam se preparar para mudanças na carga tributária.
            </li>
          </ol>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ❓ Perguntas Frequentes (FAQ)
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                1. Por que a mudança de origem para destino?
              </h4>
              <p className="text-gray-700">
                Para <strong>eliminar a guerra fiscal</strong> entre estados. No modelo antigo, estados davam 
                incentivos fiscais para atrair empresas, prejudicando a arrecadação. No novo modelo, o imposto 
                fica onde o consumo acontece, reduzindo essa distorção.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                2. Qual estado será mais beneficiado?
              </h4>
              <p className="text-gray-700">
                Estados <strong>consumidores</strong> com menor capacidade produtiva, como RJ, DF, estados do 
                Norte/Nordeste. Estados produtores como SP, MG e RS perderão parte da receita.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                3. Como fica para empresas que vendem para o Brasil todo?
              </h4>
              <p className="text-gray-700">
                O IBS será <strong>partilhado proporcionalmente</strong> ao destino de cada venda. Uma empresa 
                em SP que vende 60% para SP e 40% para outros estados terá partilha proporcional.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                4. E se eu vender no mesmo estado (origem = destino)?
              </h4>
              <p className="text-gray-700">
                Neste caso, durante a transição, a partilha ainda se aplica. Mas como origem e destino são o 
                mesmo, o estado/município recebe o <strong>total do IBS</strong>.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                5. A partilha afeta o preço final do produto?
              </h4>
              <p className="text-gray-700">
                <strong>Não!</strong> O valor total do IBS permanece o mesmo. A partilha apenas define para onde 
                vai a arrecadação (origem ou destino), mas o consumidor paga o mesmo valor.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                6. Como será feito o pagamento na prática?
              </h4>
              <p className="text-gray-700">
                Através do <strong>Comitê Gestor do IBS</strong>, que receberá o imposto e distribuirá 
                automaticamente entre origem e destino conforme o percentual do ano.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">
                7. Haverá compensação para estados que perderem receita?
              </h4>
              <p className="text-gray-700">
                Sim! A <strong>EC 132/2023</strong> prevê fundos de compensação e medidas de transição para 
                suavizar o impacto em estados produtores.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            📚 Termos Importantes
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-orange-50 rounded-lg p-6">
              <h4 className="font-bold text-orange-900 mb-2">Princípio de Origem</h4>
              <p className="text-gray-700 text-sm">
                Sistema em que o imposto é arrecadado no estado/município onde a mercadoria é produzida ou o 
                serviço é prestado. Modelo antigo do ICMS.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-bold text-green-900 mb-2">Princípio de Destino</h4>
              <p className="text-gray-700 text-sm">
                Sistema em que o imposto é arrecadado no estado/município onde a mercadoria é consumida. 
                Modelo adotado pelo IBS a partir de 2036.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-900 mb-2">Partilha do IBS</h4>
              <p className="text-gray-700 text-sm">
                Mecanismo de divisão da arrecadação entre origem e destino durante o período de transição 
                (2027-2036), com aumento progressivo do destino.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h4 className="font-bold text-purple-900 mb-2">Comitê Gestor do IBS</h4>
              <p className="text-gray-700 text-sm">
                Órgão federativo responsável por arrecadar, distribuir e fiscalizar o IBS, garantindo 
                transparência na partilha entre estados e municípios.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6">
              <h4 className="font-bold text-yellow-900 mb-2">Guerra Fiscal</h4>
              <p className="text-gray-700 text-sm">
                Competição entre estados por investimentos através de incentivos fiscais (redução de ICMS), 
                que será eliminada com o IBS no destino.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-6">
              <h4 className="font-bold text-red-900 mb-2">Justiça Federativa</h4>
              <p className="text-gray-700 text-sm">
                Princípio de equilíbrio na distribuição de recursos entre estados e municípios, promovido 
                pela migração do IBS para o destino.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            ⚖️ O Que Diz a Legislação
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A partilha do IBS está prevista na <strong>Emenda Constitucional nº 132/2023</strong>:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-3">
            <li>
              <strong>Artigo 156-A, § 3º:</strong> Estabelece a transição gradual de 10 anos (2027-2036) do 
              princípio de origem para o de destino.
            </li>
            <li>
              <strong>Percentual anual:</strong> Aumento de 10 pontos percentuais por ano para o destino, 
              começando com 10% em 2027 e atingindo 100% em 2036.
            </li>
            <li>
              <strong>Subdivisão:</strong> 75% para o estado e 25% para o município, tanto na origem quanto 
              no destino.
            </li>
            <li>
              <strong>Comitê Gestor:</strong> Lei complementar definirá as regras de operacionalização da 
              partilha através do Comitê Gestor do IBS.
            </li>
            <li>
              <strong>Compensação:</strong> Fundos de equalização e compensação serão criados para suavizar 
              o impacto em estados produtores que perderão receita.
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            🎯 Conclusão
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            A <strong>Partilha do IBS</strong> é um dos pilares da Reforma Tributária, promovendo <strong>justiça 
            federativa</strong> e eliminando distorções históricas. A transição gradual de 10 anos garante que 
            estados produtores tenham tempo para se adaptar, enquanto estados consumidores ganham gradualmente 
            mais recursos para investir em serviços públicos.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Para empresas, entender a partilha é essencial para <strong>planejar o fluxo de caixa</strong> e 
            a estratégia tributária. Operações interestaduais terão impactos diferentes a cada ano, e é 
            fundamental acompanhar a evolução dos percentuais para tomar decisões informadas.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Use esta <strong>Calculadora de Partilha do IBS</strong> para simular o impacto nas suas operações 
            e planejar a transição com segurança. A reforma está chegando, e quem se preparar sairá na frente!
          </p>

          <div className="bg-blue-600 text-white rounded-xl p-8 mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">
              🧮 Calcule a partilha agora!
            </h3>
            <p className="text-blue-100 mb-6">
              Descubra como o IBS será dividido entre origem e destino nas suas operações.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Simular Partilha do IBS
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

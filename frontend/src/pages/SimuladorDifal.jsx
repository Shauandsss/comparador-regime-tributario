import { useState } from 'react';
import { ArrowLeft, MapPin, DollarSign, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Alíquotas interestaduais (origem → destino)
const ALIQUOTAS_INTERESTADUAIS = {
  'norte-nordeste-es-co': 7, // Norte, Nordeste, ES e Centro-Oeste para Sul/Sudeste
  'sul-sudeste': 12 // Sul e Sudeste entre si
};

// Alíquotas internas por estado (2025)
const ALIQUOTAS_INTERNAS = {
  AC: 17, AL: 18, AP: 18, AM: 18, BA: 18, CE: 18, DF: 18,
  ES: 17, GO: 17, MA: 18, MT: 17, MS: 17, MG: 18, PA: 17,
  PB: 18, PR: 18, PE: 18, PI: 18, RJ: 18, RN: 18, RS: 18,
  RO: 17.5, RR: 17, SC: 17, SP: 18, SE: 18, TO: 18
};

// FCP (Fundo de Combate à Pobreza) - adicional sobre o DIFAL
const FCP_ESTADOS = {
  AC: 2, AL: 2, AP: 0, AM: 2, BA: 2, CE: 2, DF: 0,
  ES: 2, GO: 2, MA: 2, MT: 0, MS: 2, MG: 2, PA: 2,
  PB: 2, PR: 2, PE: 2, PI: 0, RJ: 2, RN: 2, RS: 2,
  RO: 0, RR: 0, SC: 0, SP: 2, SE: 2, TO: 0
};

// Estados por região para cálculo de alíquota interestadual
const REGIOES = {
  norte: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
  nordeste: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
  centroOeste: ['DF', 'GO', 'MT', 'MS'],
  sudeste: ['ES', 'MG', 'RJ', 'SP'],
  sul: ['PR', 'RS', 'SC']
};

const ESTADOS_BRASILEIROS = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

export default function SimuladorDifal() {
  const [formData, setFormData] = useState({
    estadoOrigem: '',
    estadoDestino: '',
    valorNota: '',
    tipoOperacao: 'consumidorFinal' // consumidorFinal ou revenda
  });

  const [resultado, setResultado] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getRegiaoEstado = (uf) => {
    for (const [regiao, estados] of Object.entries(REGIOES)) {
      if (estados.includes(uf)) return regiao;
    }
    return null;
  };

  const calcularAliquotaInterestadual = (origem, destino) => {
    const regiaoOrigem = getRegiaoEstado(origem);
    const regiaoDestino = getRegiaoEstado(destino);

    // Sul e Sudeste (exceto ES) entre si = 12%
    const sulSudeste = ['sul', 'sudeste'];
    if (sulSudeste.includes(regiaoOrigem) && sulSudeste.includes(regiaoDestino) && origem !== 'ES' && destino !== 'ES') {
      return 12;
    }

    // Demais operações = 7%
    return 7;
  };

  const calcular = () => {
    const { estadoOrigem, estadoDestino, valorNota, tipoOperacao } = formData;
    const valor = parseFloat(valorNota);

    if (!estadoOrigem || !estadoDestino || !valor || valor <= 0) {
      alert('Preencha todos os campos com valores válidos.');
      return;
    }

    if (estadoOrigem === estadoDestino) {
      alert('DIFAL só se aplica a operações interestaduais (origem ≠ destino).');
      return;
    }

    // DIFAL só se aplica a operações para consumidor final
    if (tipoOperacao !== 'consumidorFinal') {
      setResultado({
        semDifal: true,
        motivo: 'O DIFAL só é devido em operações destinadas a consumidor final não contribuinte do ICMS. Em operações para revenda (contribuinte), não há DIFAL.'
      });
      return;
    }

    // Alíquota interestadual
    const aliquotaInterestadual = calcularAliquotaInterestadual(estadoOrigem, estadoDestino);

    // Alíquota interna do destino
    const aliquotaInterna = ALIQUOTAS_INTERNAS[estadoDestino];

    // Diferencial de alíquota (DIFAL)
    const diferencaAliquota = aliquotaInterna - aliquotaInterestadual;

    // Base de cálculo (valor da nota)
    const baseCalculo = valor;

    // Valor do DIFAL
    const valorDifal = baseCalculo * (diferencaAliquota / 100);

    // FCP (Fundo de Combate à Pobreza)
    const aliquotaFcp = FCP_ESTADOS[estadoDestino] || 0;
    const valorFcp = baseCalculo * (aliquotaFcp / 100);

    // Total a recolher
    const totalRecolher = valorDifal + valorFcp;

    // Partilha (50% origem, 50% destino) - EC 87/2015
    const valorOrigem = valorDifal * 0.5;
    const valorDestino = valorDifal * 0.5;

    setResultado({
      semDifal: false,
      estadoOrigem,
      estadoDestino,
      valorNota: valor,
      aliquotaInterestadual,
      aliquotaInterna,
      diferencaAliquota,
      baseCalculo,
      valorDifal,
      aliquotaFcp,
      valorFcp,
      totalRecolher,
      valorOrigem,
      valorDestino
    });
  };

  const limpar = () => {
    setFormData({
      estadoOrigem: '',
      estadoDestino: '',
      valorNota: '',
      tipoOperacao: 'consumidorFinal'
    });
    setResultado(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Simulador de DIFAL (Diferencial de Alíquota)
          </h1>
          <p className="text-lg text-gray-600">
            Calcule o DIFAL para vendas interestaduais destinadas a consumidor final e gere o valor exato da GNRE
          </p>
        </div>

        {/* Alerta Informativo */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">⚠️ Quando o DIFAL é devido?</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>✅ Venda interestadual (origem ≠ destino)</li>
                <li>✅ Destinada a <strong>consumidor final não contribuinte</strong> do ICMS</li>
                <li>✅ A partir de 2016 (Emenda Constitucional 87/2015)</li>
                <li>❌ NÃO se aplica a vendas para empresas (contribuintes) ou dentro do mesmo estado</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Estado de Origem (Remetente)
              </label>
              <select
                name="estadoOrigem"
                value={formData.estadoOrigem}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                {ESTADOS_BRASILEIROS.map(estado => (
                  <option key={estado.sigla} value={estado.sigla}>
                    {estado.sigla} - {estado.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Estado de Destino (Destinatário)
              </label>
              <select
                name="estadoDestino"
                value={formData.estadoDestino}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                {ESTADOS_BRASILEIROS.map(estado => (
                  <option key={estado.sigla} value={estado.sigla}>
                    {estado.sigla} - {estado.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Valor da Nota Fiscal (R$)
              </label>
              <input
                type="number"
                name="valorNota"
                value={formData.valorNota}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 5000.00"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Tipo de Operação
              </label>
              <select
                name="tipoOperacao"
                value={formData.tipoOperacao}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="consumidorFinal">Consumidor Final (Não Contribuinte)</option>
                <option value="revenda">Revenda (Contribuinte ICMS)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                DIFAL só é devido para consumidor final
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={calcular}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              Calcular DIFAL
            </button>
            <button
              onClick={limpar}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="space-y-6">
            {resultado.semDifal ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-yellow-900 mb-2">DIFAL não é devido nesta operação</h3>
                    <p className="text-yellow-800">{resultado.motivo}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Card Principal - Valor DIFAL */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Valor do DIFAL + FCP</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-blue-100 text-sm mb-2">DIFAL (Diferencial de Alíquota):</p>
                      <p className="text-5xl font-bold mb-2">
                        R$ {resultado.valorDifal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-blue-100 text-sm">
                        Partilha: 50% origem + 50% destino
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm mb-2">Total a Recolher (DIFAL + FCP):</p>
                      <p className="text-5xl font-bold mb-2">
                        R$ {resultado.totalRecolher.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-blue-100 text-sm">
                        {resultado.aliquotaFcp > 0 ? `Inclui FCP de ${resultado.aliquotaFcp}%` : 'Sem FCP neste estado'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Memória de Cálculo */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Memória de Cálculo Detalhada</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Operação:</span>
                      <span className="font-bold text-gray-900">
                        {resultado.estadoOrigem} → {resultado.estadoDestino}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Valor da Nota Fiscal (Base de Cálculo):</span>
                      <span className="font-bold text-gray-900">
                        R$ {resultado.baseCalculo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium text-gray-700">Alíquota Interestadual:</span>
                      <span className="font-bold text-blue-700">{resultado.aliquotaInterestadual}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-gray-700">Alíquota Interna {resultado.estadoDestino}:</span>
                      <span className="font-bold text-green-700">{resultado.aliquotaInterna}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border-2 border-purple-300">
                      <span className="font-bold text-purple-900">Diferencial de Alíquota (DIFAL):</span>
                      <span className="font-bold text-purple-900 text-lg">
                        {resultado.diferencaAliquota}% ({resultado.aliquotaInterna}% - {resultado.aliquotaInterestadual}%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-100 rounded-lg border-2 border-purple-400">
                      <span className="font-bold text-purple-900">Valor do DIFAL:</span>
                      <span className="font-bold text-purple-900 text-xl">
                        R$ {resultado.valorDifal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    {resultado.aliquotaFcp > 0 && (
                      <>
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                          <span className="font-medium text-gray-700">FCP (Fundo Combate à Pobreza) {resultado.estadoDestino}:</span>
                          <span className="font-bold text-orange-700">{resultado.aliquotaFcp}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-100 rounded-lg border-2 border-orange-300">
                          <span className="font-bold text-orange-900">Valor do FCP:</span>
                          <span className="font-bold text-orange-900 text-lg">
                            R$ {resultado.valorFcp.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-green-50 rounded-lg border-2 border-green-500">
                      <span className="font-bold text-green-900 text-lg">Total a Recolher (GNRE):</span>
                      <span className="font-bold text-green-900 text-2xl">
                        R$ {resultado.totalRecolher.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Partilha DIFAL */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Partilha do DIFAL (EC 87/2015)</h3>
                  <p className="text-gray-700 mb-4">
                    Conforme a Emenda Constitucional 87/2015, o DIFAL é partilhado entre origem e destino:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                      <p className="text-sm font-semibold text-blue-900 mb-2">Estado de Origem ({resultado.estadoOrigem}):</p>
                      <p className="text-3xl font-bold text-blue-700">
                        R$ {resultado.valorOrigem.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-blue-700 mt-1">50% do DIFAL</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
                      <p className="text-sm font-semibold text-green-900 mb-2">Estado de Destino ({resultado.estadoDestino}):</p>
                      <p className="text-3xl font-bold text-green-700">
                        R$ {resultado.valorDestino.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-green-700 mt-1">50% do DIFAL {resultado.aliquotaFcp > 0 ? `+ FCP R$ ${resultado.valorFcp.toFixed(2)}` : ''}</p>
                    </div>
                  </div>
                </div>

                {/* Como Recolher */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 rounded-r-xl p-6">
                  <div className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">📄 Como Recolher o DIFAL?</h4>
                      <p className="text-gray-700 mb-3">
                        O DIFAL deve ser recolhido através de <strong>GNRE (Guia Nacional de Recolhimento de Tributos Estaduais)</strong>:
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        <li>✅ Emita a GNRE antes de emitir a nota fiscal</li>
                        <li>✅ Prazo: até o momento da saída da mercadoria</li>
                        <li>✅ Informe a GNRE na nota fiscal (campo "Informações Complementares")</li>
                        <li>✅ Guarde o comprovante de pagamento por 5 anos</li>
                        <li>✅ Acesse o site oficial: <a href="https://www.gnre.pe.gov.br" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">www.gnre.pe.gov.br</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Artigo SEO */}
        <article className="max-w-4xl mx-auto mt-16 prose prose-lg">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              DIFAL (Diferencial de Alíquota): O que é, Quem Deve Pagar e Como Calcular em 2025
            </h2>

            <div className="text-gray-700 space-y-6 leading-relaxed">
              <p className="text-lg">
                O <strong>DIFAL</strong> (Diferencial de Alíquota do ICMS) é um dos tributos que mais gera dúvidas em empresas que vendem para outros estados. 
                Instituído pela <strong>Emenda Constitucional 87/2015</strong>, o DIFAL surgiu para equilibrar a arrecadação de ICMS entre estados de origem e destino 
                em operações interestaduais destinadas a consumidores finais não contribuintes.
              </p>

              <p>
                Antes de 2016, quando você vendia de São Paulo para um consumidor final no Rio de Janeiro, <strong>100% do ICMS ficava com São Paulo</strong> (estado de origem). 
                O Rio não recebia nada, mesmo sendo o local de consumo. Isso gerava uma <strong>guerra fiscal</strong> e prejuízo aos estados de destino, 
                principalmente com o crescimento do e-commerce.
              </p>

              <p>
                Com a EC 87/2015, o <strong>diferencial de alíquota (DIFAL) passou a ser partilhado</strong>: 50% para o estado de origem e 50% para o destino, 
                equilibrando a distribuição da receita tributária.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                🤔 O que é DIFAL e Por que Ele Existe?
              </h3>

              <p>
                O DIFAL é a <strong>diferença entre a alíquota de ICMS interna do estado de destino e a alíquota interestadual</strong>. 
                Ele existe para compensar o estado onde a mercadoria será consumida.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded-r-lg">
                <h4 className="font-bold text-gray-900 mb-3">📐 Fórmula Básica do DIFAL</h4>
                <div className="bg-white p-4 rounded-lg my-3 border-2 border-blue-300 text-center">
                  <p className="font-bold text-lg mb-2">
                    DIFAL = Alíquota Interna (Destino) - Alíquota Interestadual
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    Exemplo: Venda de SP (origem) para RJ (destino)
                  </p>
                  <p className="text-blue-700 font-semibold">
                    DIFAL = 18% (ICMS interno RJ) - 12% (alíquota interestadual) = 6%
                  </p>
                </div>
              </div>

              <p>
                Esse diferencial de 6% é o que você precisa recolher via GNRE, sendo:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>50% (3%) vai para São Paulo (origem)</li>
                <li>50% (3%) vai para o Rio de Janeiro (destino)</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                👥 Quem Deve Pagar o DIFAL?
              </h3>

              <p>
                O DIFAL é devido em operações que <strong>atendam simultaneamente</strong> estas condições:
              </p>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 my-6 rounded-r-lg">
                <h4 className="font-bold text-green-900 mb-3">✅ Quando o DIFAL é OBRIGATÓRIO:</h4>
                <ul className="space-y-2">
                  <li>✅ <strong>Venda interestadual</strong> (origem em um estado, destino em outro)</li>
                  <li>✅ <strong>Destinatário é consumidor final</strong> (pessoa física ou empresa não contribuinte do ICMS)</li>
                  <li>✅ <strong>A partir de 2016</strong> (Emenda Constitucional 87/2015)</li>
                  <li>✅ <strong>E-commerces, marketplaces e vendas online</strong> são os principais afetados</li>
                </ul>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 my-6 rounded-r-lg">
                <h4 className="font-bold text-red-900 mb-3">❌ Quando o DIFAL NÃO é devido:</h4>
                <ul className="space-y-2">
                  <li>❌ Venda dentro do mesmo estado (origem = destino)</li>
                  <li>❌ Venda para empresa contribuinte do ICMS (revenda, indústria)</li>
                  <li>❌ Exportação para fora do Brasil</li>
                  <li>❌ Produtos isentos ou com alíquota zero</li>
                </ul>
              </div>

              <p className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <strong>⚠️ Importante:</strong> Empresas do <strong>Simples Nacional</strong> também devem recolher o DIFAL, 
                mesmo que não destaquem o ICMS na nota fiscal. O DIFAL é uma obrigação adicional ao Simples.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                🧮 Como Calcular o DIFAL: Passo a Passo
              </h3>

              <p>
                O cálculo do DIFAL envolve 4 elementos principais:
              </p>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 my-6">
                <h4 className="font-bold text-gray-900 mb-4">Elementos do Cálculo:</h4>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="text-2xl">1️⃣</span>
                    <div>
                      <strong className="text-gray-900">Alíquota Interestadual</strong>
                      <p className="text-gray-700 text-sm mt-1">
                        Depende das regiões de origem e destino:
                      </p>
                      <ul className="list-disc list-inside ml-4 text-sm mt-2 text-gray-700">
                        <li><strong>7%:</strong> Norte, Nordeste, ES e Centro-Oeste → Sul/Sudeste (exceto ES)</li>
                        <li><strong>12%:</strong> Sul e Sudeste entre si (exceto ES)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-2xl">2️⃣</span>
                    <div>
                      <strong className="text-gray-900">Alíquota Interna do Estado de Destino</strong>
                      <p className="text-gray-700 text-sm mt-1">
                        Varia por estado (geralmente 17% a 18%). Consulte a legislação estadual.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-2xl">3️⃣</span>
                    <div>
                      <strong className="text-gray-900">Base de Cálculo</strong>
                      <p className="text-gray-700 text-sm mt-1">
                        Valor da nota fiscal (incluindo frete, seguro, outras despesas).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-2xl">4️⃣</span>
                    <div>
                      <strong className="text-gray-900">FCP (Fundo de Combate à Pobreza)</strong>
                      <p className="text-gray-700 text-sm mt-1">
                        Adicional estadual de 0% a 2% sobre a base de cálculo. Nem todos os estados cobram.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="text-xl font-bold text-gray-900 mt-8 mb-4">
                📝 Exemplo Prático 1: E-commerce de SP para RJ
              </h4>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300 my-6">
                <p className="font-semibold mb-3">Situação:</p>
                <ul className="space-y-1 mb-4">
                  <li>🏪 <strong>Origem:</strong> São Paulo (SP)</li>
                  <li>📍 <strong>Destino:</strong> Rio de Janeiro (RJ)</li>
                  <li>💰 <strong>Valor da Nota:</strong> R$ 5.000,00</li>
                  <li>👤 <strong>Cliente:</strong> Consumidor final (pessoa física)</li>
                </ul>

                <p className="font-semibold mb-2">Cálculo:</p>
                <div className="space-y-2 bg-white p-4 rounded-lg">
                  <p>1. Alíquota Interestadual SP → RJ: <strong className="text-blue-700">12%</strong></p>
                  <p>2. Alíquota Interna RJ: <strong className="text-blue-700">18%</strong></p>
                  <p>3. Diferencial: 18% - 12% = <strong className="text-blue-700">6%</strong></p>
                  <p>4. DIFAL: R$ 5.000 × 6% = <strong className="text-green-700">R$ 300,00</strong></p>
                  <p>5. FCP (RJ cobra 2%): R$ 5.000 × 2% = <strong className="text-orange-700">R$ 100,00</strong></p>
                  <p className="pt-2 border-t-2 border-blue-300 font-bold text-lg">
                    Total GNRE: <span className="text-green-700">R$ 400,00</span>
                  </p>
                </div>

                <p className="mt-4 text-sm text-gray-700">
                  <strong>Partilha:</strong> R$ 150 para SP + R$ 150 para RJ + R$ 100 de FCP para RJ = R$ 400 total
                </p>
              </div>

              <h4 className="text-xl font-bold text-gray-900 mt-8 mb-4">
                📝 Exemplo Prático 2: Marketplace do CE para RS
              </h4>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-300 my-6">
                <p className="font-semibold mb-3">Situação:</p>
                <ul className="space-y-1 mb-4">
                  <li>🏪 <strong>Origem:</strong> Ceará (CE)</li>
                  <li>📍 <strong>Destino:</strong> Rio Grande do Sul (RS)</li>
                  <li>💰 <strong>Valor da Nota:</strong> R$ 1.200,00</li>
                  <li>👤 <strong>Cliente:</strong> Pessoa física</li>
                </ul>

                <p className="font-semibold mb-2">Cálculo:</p>
                <div className="space-y-2 bg-white p-4 rounded-lg">
                  <p>1. Alíquota Interestadual CE → RS: <strong className="text-purple-700">7%</strong> (Norte/Nordeste → Sul)</p>
                  <p>2. Alíquota Interna RS: <strong className="text-purple-700">18%</strong></p>
                  <p>3. Diferencial: 18% - 7% = <strong className="text-purple-700">11%</strong></p>
                  <p>4. DIFAL: R$ 1.200 × 11% = <strong className="text-green-700">R$ 132,00</strong></p>
                  <p>5. FCP (RS cobra 2%): R$ 1.200 × 2% = <strong className="text-orange-700">R$ 24,00</strong></p>
                  <p className="pt-2 border-t-2 border-purple-300 font-bold text-lg">
                    Total GNRE: <span className="text-green-700">R$ 156,00</span>
                  </p>
                </div>

                <p className="mt-4 text-sm text-gray-700">
                  <strong>Partilha:</strong> R$ 66 para CE + R$ 66 para RS + R$ 24 de FCP para RS = R$ 156 total
                </p>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
                📄 Como Emitir e Recolher a GNRE do DIFAL
              </h3>

              <p>
                A <strong>GNRE (Guia Nacional de Recolhimento de Tributos Estaduais)</strong> é o documento usado para pagar o DIFAL.
              </p>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 my-6 rounded-r-lg">
                <h4 className="font-bold text-orange-900 mb-3">📋 Passo a Passo para Emitir a GNRE:</h4>
                <ol className="space-y-3">
                  <li>
                    <strong>1. Acesse o site oficial:</strong> 
                    <a href="https://www.gnre.pe.gov.br" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">
                      www.gnre.pe.gov.br
                    </a>
                  </li>
                  <li><strong>2. Cadastre-se</strong> com CNPJ e dados da empresa</li>
                  <li><strong>3. Selecione "Emitir GNRE Online"</strong></li>
                  <li><strong>4. Preencha os dados:</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Receita: <strong>10010-3 (DIFAL)</strong></li>
                      <li>UF Favorecida: estado de destino</li>
                      <li>Documento de Origem: número da nota fiscal</li>
                      <li>Período de referência: mês/ano da emissão</li>
                      <li>Valor: total do DIFAL + FCP</li>
                    </ul>
                  </li>
                  <li><strong>5. Gere e pague</strong> a guia antes de emitir a nota fiscal</li>
                  <li><strong>6. Informe na NF-e</strong> (campo "Informações Complementares"): número da GNRE e autenticação</li>
                </ol>
              </div>

              <p className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 my-6">
                <strong>⚠️ Atenção:</strong> O DIFAL deve ser pago <strong>antes da saída da mercadoria</strong>. 
                Emitir nota fiscal sem recolher o DIFAL gera <strong>autuação fiscal</strong> e multa de até 100% do valor devido + juros.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
                🚫 5 Erros Comuns sobre DIFAL (e Como Evitar)
              </h3>

              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-red-900 mb-2">1. Achar que Simples Nacional não paga DIFAL</h4>
                  <p className="text-gray-700">
                    <strong>Erro:</strong> "Sou Simples, não preciso recolher DIFAL."
                    <br />
                    <strong>Correto:</strong> Simples Nacional <strong>SIM</strong> deve recolher DIFAL. É uma obrigação adicional, 
                    não incluída no DAS. Recolha via GNRE separadamente.
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-red-900 mb-2">2. Esquecer de recolher DIFAL em vendas B2C</h4>
                  <p className="text-gray-700">
                    <strong>Erro:</strong> Não pagar DIFAL em vendas para pessoa física de outro estado.
                    <br />
                    <strong>Correto:</strong> <strong>Toda venda para consumidor final</strong> (pessoa física ou empresa não contribuinte) 
                    em outro estado exige DIFAL. E-commerces são os mais fiscalizados.
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-red-900 mb-2">3. Usar alíquota errada (7% ou 12%)</h4>
                  <p className="text-gray-700">
                    <strong>Erro:</strong> Aplicar sempre 7% ou sempre 12% sem verificar regiões.
                    <br />
                    <strong>Correto:</strong> <strong>7%</strong> para Norte/Nordeste/ES/CO → Sul/Sudeste. <strong>12%</strong> para Sul/Sudeste entre si.
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-red-900 mb-2">4. Não incluir FCP (Fundo de Combate à Pobreza)</h4>
                  <p className="text-gray-700">
                    <strong>Erro:</strong> Calcular só o DIFAL e esquecer o FCP.
                    <br />
                    <strong>Correto:</strong> Vários estados cobram <strong>FCP adicional</strong> (geralmente 2%). Consulte a legislação do destino.
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-red-900 mb-2">5. Emitir nota sem pagar DIFAL antes</h4>
                  <p className="text-gray-700">
                    <strong>Erro:</strong> Emitir NF-e e só depois recolher DIFAL (ou não recolher).
                    <br />
                    <strong>Correto:</strong> Pague a GNRE <strong>ANTES</strong> de emitir a nota fiscal e informe os dados da GNRE na NF-e.
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
                ❓ Perguntas Frequentes sobre DIFAL
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">1. Empresas do Simples Nacional precisam recolher DIFAL?</h4>
                  <p className="text-gray-700">
                    <strong>Sim!</strong> O DIFAL é uma obrigação <strong>adicional</strong> ao DAS do Simples Nacional. 
                    Você continua pagando o Simples normalmente e deve recolher o DIFAL via GNRE para vendas interestaduais a consumidor final.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">2. Preciso pagar DIFAL em vendas para empresas (B2B)?</h4>
                  <p className="text-gray-700">
                    <strong>Não.</strong> O DIFAL só é devido em vendas para <strong>consumidor final não contribuinte do ICMS</strong>. 
                    Vendas para empresas contribuintes (revenda, indústria) seguem as regras normais do ICMS interestadual, sem DIFAL.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">3. O que acontece se eu não pagar o DIFAL?</h4>
                  <p className="text-gray-700">
                    Você pode receber <strong>autuação fiscal</strong> dos estados de origem e destino, com:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                    <li>Multa de 50% a 100% do valor devido</li>
                    <li>Juros de mora (taxa SELIC)</li>
                    <li>Inscrição em dívida ativa</li>
                    <li>Impedimento de emitir certidões negativas</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">4. Posso incluir o valor do DIFAL no preço de venda?</h4>
                  <p className="text-gray-700">
                    <strong>Sim!</strong> É recomendado incluir o custo do DIFAL no preço final, ou cobrar frete diferenciado por estado. 
                    Muitos e-commerces calculam automaticamente e adicionam o DIFAL ao checkout conforme o CEP de destino.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">5. Existe limite de faturamento para não pagar DIFAL?</h4>
                  <p className="text-gray-700">
                    <strong>Não.</strong> Não há limite de faturamento. <strong>Qualquer venda</strong> interestadual para consumidor final está sujeita ao DIFAL, 
                    independentemente do porte da empresa (MEI, ME, EPP, grande empresa).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">6. Como calcular DIFAL em vendas com desconto ou frete?</h4>
                  <p className="text-gray-700">
                    A base de cálculo do DIFAL é o <strong>valor total da nota fiscal</strong>, incluindo:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                    <li>Valor do produto</li>
                    <li>Frete (se cobrado)</li>
                    <li>Seguro</li>
                    <li>Outras despesas acessórias</li>
                    <li><strong>Menos:</strong> descontos incondicionais (se houver)</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
                📜 Legislação do DIFAL: O que Mudou em 2022
              </h3>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-4">
                <div>
                  <strong className="text-blue-900">Emenda Constitucional 87/2015:</strong>
                  <p className="text-gray-700">
                    Instituiu o DIFAL para operações interestaduais destinadas a consumidor final não contribuinte. 
                    Estabeleceu partilha gradual entre origem e destino (2016: 40%/60%, 2017: 20%/80%, 2018 em diante: 50%/50%).
                  </p>
                </div>
                <div>
                  <strong className="text-blue-900">Convênio ICMS 93/2015:</strong>
                  <p className="text-gray-700">
                    Regulamentou a forma de cálculo e recolhimento do DIFAL, incluindo e-commerce e vendas não presenciais.
                  </p>
                </div>
                <div>
                  <strong className="text-blue-900">Lei Complementar 190/2022:</strong>
                  <p className="text-gray-700">
                    <strong>IMPORTANTE:</strong> Determinou que o DIFAL só pode ser cobrado <strong>a partir de 2022</strong>, 
                    respeitando princípio da anterioridade. Estados que cobravam antes de 2022 sem lei complementar agiram inconstitucionalmente.
                  </p>
                </div>
                <div>
                  <strong className="text-blue-900">Convênio ICMS 236/2021:</strong>
                  <p className="text-gray-700">
                    Simplificou o recolhimento para empresas do Simples Nacional, permitindo uso de GNRE online e facilitando o processo.
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
                🎯 Conclusão: Domine o DIFAL para Evitar Problemas Fiscais
              </h3>

              <p>
                O DIFAL é uma realidade inevitável para e-commerces e empresas que vendem para outros estados. 
                <strong>Ignorá-lo não é opção</strong> — os estados têm sistemas cada vez mais automatizados para cruzar dados de NF-e e identificar ausência de recolhimento.
              </p>

              <p>
                <strong>Resumo do que você precisa lembrar:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>DIFAL é devido em <strong>vendas interestaduais para consumidor final</strong></li>
                <li><strong>Simples Nacional também paga</strong>, via GNRE separada do DAS</li>
                <li>Calcule corretamente: diferença entre alíquota interna (destino) e interestadual</li>
                <li>Não esqueça o <strong>FCP</strong> (quando aplicável)</li>
                <li>Pague <strong>ANTES</strong> de emitir a nota fiscal</li>
                <li>Informe a GNRE na NF-e (campo informações complementares)</li>
              </ul>

              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl mt-8">
                <p className="text-lg font-semibold mb-2">
                  💡 Use o simulador acima para calcular o DIFAL exato da sua operação!
                </p>
                <p>
                  Informe origem, destino e valor da nota. O simulador calcula automaticamente:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Alíquota interestadual correta (7% ou 12%)</li>
                  <li>Diferencial de alíquota (DIFAL)</li>
                  <li>FCP do estado de destino (quando houver)</li>
                  <li>Valor total da GNRE a recolher</li>
                  <li>Partilha entre origem e destino</li>
                </ul>
                <p className="mt-4 font-bold text-xl">
                  Evite multas e autuações fiscais. Calcule corretamente! 🎯
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

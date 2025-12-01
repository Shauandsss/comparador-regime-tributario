import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Guia CNAE → Anexo/Regime
 * Permite buscar CNAE e visualizar informações tributárias
 */
export default function GuiaCnae() {
  const [termoBusca, setTermoBusca] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [cnaeDetalhado, setCnaeDetalhado] = useState(null);
  const [rbt12, setRbt12] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);
  const [erro, setErro] = useState(null);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  
  const inputRef = useRef(null);
  const sugestoesRef = useRef(null);
  const debounceRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Buscar sugestões com debounce
  const buscarSugestoes = useCallback(async (termo) => {
    if (termo.length < 2) {
      setSugestoes([]);
      return;
    }

    setCarregandoSugestoes(true);
    try {
      const response = await fetch(`${API_URL}/cnae/buscar?q=${encodeURIComponent(termo)}&limite=15`);
      const data = await response.json();
      
      if (data.success) {
        setSugestoes(data.data);
        setMostrarSugestoes(true);
      } else {
        setSugestoes([]);
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      setSugestoes([]);
    } finally {
      setCarregandoSugestoes(false);
    }
  }, [API_URL]);

  // Debounce para busca
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      buscarSugestoes(termoBusca);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [termoBusca, buscarSugestoes]);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target) &&
        sugestoesRef.current &&
        !sugestoesRef.current.contains(event.target)
      ) {
        setMostrarSugestoes(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Consultar CNAE detalhado
  const consultarCnae = async (codigo) => {
    setCarregando(true);
    setErro(null);
    setMostrarSugestoes(false);

    try {
      let url = `${API_URL}/cnae/${codigo}`;
      if (rbt12) {
        url += `?rbt12=${parseFloat(rbt12.replace(/\D/g, '')) || 0}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setCnaeDetalhado(data.data);
      } else {
        setErro(data.error || 'CNAE não encontrado');
        setCnaeDetalhado(null);
      }
    } catch (error) {
      console.error('Erro ao consultar CNAE:', error);
      setErro('Erro ao conectar com o servidor');
      setCnaeDetalhado(null);
    } finally {
      setCarregando(false);
    }
  };

  // Selecionar sugestão
  const selecionarSugestao = (cnae) => {
    setTermoBusca(`${cnae.codigoFormatado} - ${cnae.descricao}`);
    consultarCnae(cnae.codigo);
  };

  // Formatar valor monetário
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Obter cor do anexo
  const getCorAnexo = (anexo) => {
    const cores = {
      'I': 'bg-blue-100 text-blue-800 border-blue-300',
      'II': 'bg-green-100 text-green-800 border-green-300',
      'III': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'IV': 'bg-orange-100 text-orange-800 border-orange-300',
      'V': 'bg-red-100 text-red-800 border-red-300'
    };
    return cores[anexo] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Obter descrição do anexo
  const getDescricaoAnexo = (anexo) => {
    const descricoes = {
      'I': 'Comércio',
      'II': 'Indústria',
      'III': 'Serviços (sem CPP separada)',
      'IV': 'Serviços (CPP separada)',
      'V': 'Serviços Intelectuais'
    };
    return descricoes[anexo] || '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📋 Guia CNAE → Anexo/Regime
        </h1>
        <p className="text-gray-600">
          Digite o código ou descrição do CNAE para descobrir o anexo do Simples Nacional,
          percentual de presunção e riscos tributários.
        </p>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Input de busca */}
          <div className="md:col-span-2 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código ou Descrição do CNAE
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                onFocus={() => sugestoes.length > 0 && setMostrarSugestoes(true)}
                placeholder="Ex: 6201501 ou desenvolvimento de software"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {carregandoSugestoes && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>

            {/* Sugestões */}
            {mostrarSugestoes && sugestoes.length > 0 && (
              <div 
                ref={sugestoesRef}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
              >
                {sugestoes.map((cnae) => (
                  <button
                    key={cnae.codigo}
                    onClick={() => selecionarSugestao(cnae)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="font-mono text-sm text-blue-600 font-medium">
                          {cnae.codigoFormatado}
                        </span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-sm text-gray-700">
                          {cnae.descricao.length > 60 
                            ? cnae.descricao.substring(0, 60) + '...' 
                            : cnae.descricao
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {cnae.impedido ? (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                            Vedado
                          </span>
                        ) : (
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getCorAnexo(cnae.anexo)}`}>
                            Anexo {cnae.anexo}
                          </span>
                        )}
                        {cnae.fatorR && (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                            Fator R
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RBT12 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RBT12 (opcional)
            </label>
            <input
              type="text"
              value={rbt12}
              onChange={(e) => {
                const valor = e.target.value.replace(/\D/g, '');
                setRbt12(valor ? formatarMoeda(parseFloat(valor) / 100) : '');
              }}
              placeholder="R$ 0,00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              Receita Bruta dos últimos 12 meses
            </p>
          </div>
        </div>

        {/* Botão de busca manual */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              const codigo = termoBusca.match(/\d+/)?.[0];
              if (codigo && codigo.length >= 7) {
                consultarCnae(codigo.substring(0, 7));
              }
            }}
            disabled={carregando || termoBusca.length < 2}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {carregando ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Buscando...
              </>
            ) : (
              <>
                🔍 Consultar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Erro */}
      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 flex items-center gap-2">
            <span>⚠️</span> {erro}
          </p>
        </div>
      )}

      {/* Resultado Detalhado */}
      {cnaeDetalhado && cnaeDetalhado.encontrado && (
        <div className="space-y-6">
          {/* Card Principal */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header do CNAE */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">CNAE</p>
                  <h2 className="text-2xl font-bold font-mono">
                    {cnaeDetalhado.cnae.codigoFormatado}
                  </h2>
                </div>
                {cnaeDetalhado.simplesNacional.permitido ? (
                  <span className={`px-4 py-2 rounded-lg text-lg font-bold ${getCorAnexo(cnaeDetalhado.simplesNacional.anexo)}`}>
                    Anexo {cnaeDetalhado.simplesNacional.anexo}
                  </span>
                ) : (
                  <span className="px-4 py-2 rounded-lg text-lg font-bold bg-red-500 text-white">
                    Vedado ao Simples
                  </span>
                )}
              </div>
              <p className="mt-3 text-lg text-blue-100">
                {cnaeDetalhado.cnae.descricao}
              </p>
            </div>

            {/* Grid de Informações */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Simples Nacional */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    📊 Simples Nacional
                  </h3>
                  {cnaeDetalhado.simplesNacional.permitido ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Anexo:</span>
                        <span className={`px-2 py-1 rounded font-medium ${getCorAnexo(cnaeDetalhado.simplesNacional.anexo)}`}>
                          {cnaeDetalhado.simplesNacional.anexo} - {getDescricaoAnexo(cnaeDetalhado.simplesNacional.anexo)}
                        </span>
                      </div>
                      {cnaeDetalhado.simplesNacional.fatorR && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fator R:</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">
                            Sim ✓
                          </span>
                        </div>
                      )}
                      {cnaeDetalhado.simplesNacional.anexoAlternativo && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Anexo Alt.:</span>
                          <span className={`px-2 py-1 rounded font-medium ${getCorAnexo(cnaeDetalhado.simplesNacional.anexoAlternativo)}`}>
                            {cnaeDetalhado.simplesNacional.anexoAlternativo}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-red-600 font-medium">
                      ❌ Atividade não permitida no Simples Nacional
                    </div>
                  )}
                </div>

                {/* Lucro Presumido */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    💼 Lucro Presumido
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Presunção:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-bold">
                        {cnaeDetalhado.lucroPresumido.percentualPresuncao}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {cnaeDetalhado.lucroPresumido.descricaoPresuncao}
                    </p>
                  </div>
                </div>

                {/* ISS */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    🏛️ ISS Municipal
                  </h3>
                  {cnaeDetalhado.iss.aplicavel ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alíquota Ref.:</span>
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded font-bold">
                          {cnaeDetalhado.iss.aliquota}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {cnaeDetalhado.iss.observacao}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      {cnaeDetalhado.iss.observacao}
                    </p>
                  )}
                </div>
              </div>

              {/* Simulação de Alíquotas */}
              {cnaeDetalhado.simplesNacional.simulacao && (
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    📈 Simulação de Alíquotas
                    <span className="text-sm font-normal text-gray-500">
                      (RBT12: {formatarMoeda(cnaeDetalhado.simplesNacional.simulacao.rbt12)})
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">
                        Anexo {cnaeDetalhado.simplesNacional.anexo} (Principal)
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {cnaeDetalhado.simplesNacional.simulacao.anexoPrincipal.aliquotaEfetiva}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Nominal: {cnaeDetalhado.simplesNacional.simulacao.anexoPrincipal.aliquotaNominal}% | 
                        Dedução: {formatarMoeda(cnaeDetalhado.simplesNacional.simulacao.anexoPrincipal.parcelaRedutora)}
                      </p>
                    </div>
                    {cnaeDetalhado.simplesNacional.simulacao.anexoAlternativo && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600 mb-1">
                          Anexo {cnaeDetalhado.simplesNacional.anexoAlternativo} (Fator R ≥ 28%)
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                          {cnaeDetalhado.simplesNacional.simulacao.anexoAlternativo.aliquotaEfetiva}%
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Nominal: {cnaeDetalhado.simplesNacional.simulacao.anexoAlternativo.aliquotaNominal}% | 
                          Dedução: {formatarMoeda(cnaeDetalhado.simplesNacional.simulacao.anexoAlternativo.parcelaRedutora)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fator R Info */}
              {cnaeDetalhado.simplesNacional.fatorR && cnaeDetalhado.simplesNacional.observacaoFatorR && (
                <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    ⚡ Fator R Aplicável
                  </h3>
                  <p className="text-purple-700">
                    {cnaeDetalhado.simplesNacional.observacaoFatorR}
                  </p>
                  <div className="mt-3 bg-white rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      <strong>Fórmula:</strong> Fator R = (Folha de Pagamento 12 meses) / (Receita Bruta 12 meses)
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Regra:</strong> Se Fator R ≥ 28%, tributar pelo Anexo III. Caso contrário, Anexo V.
                    </p>
                  </div>
                </div>
              )}

              {/* Riscos */}
              {cnaeDetalhado.riscos && cnaeDetalhado.riscos.length > 0 && (
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    ⚠️ Riscos e Observações
                  </h3>
                  <ul className="space-y-2">
                    {cnaeDetalhado.riscos.map((risco, index) => (
                      <li key={index} className="flex items-start gap-2 text-amber-800">
                        <span className="text-amber-500 mt-0.5">•</span>
                        {risco}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Legenda dos Anexos */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📚 Legenda dos Anexos do Simples Nacional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {['I', 'II', 'III', 'IV', 'V'].map((anexo) => (
                <div 
                  key={anexo}
                  className={`p-3 rounded-lg border-2 ${getCorAnexo(anexo)}`}
                >
                  <p className="font-bold text-lg">Anexo {anexo}</p>
                  <p className="text-sm">{getDescricaoAnexo(anexo)}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">
              * O Anexo IV não inclui CPP (Contribuição Patronal Previdenciária) no DAS, 
              sendo necessário recolhimento separado de 20% sobre a folha de pagamento.
            </p>
          </div>
        </div>
      )}

      {/* Estado Inicial */}
      {!cnaeDetalhado && !erro && !carregando && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Busque um CNAE
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Digite o código CNAE (ex: 6201501) ou parte da descrição da atividade 
            para ver informações tributárias detalhadas.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="text-sm text-gray-400">Exemplos populares:</span>
            {['6201501', '4781400', '8630504', '7020400'].map((codigo) => (
              <button
                key={codigo}
                onClick={() => {
                  setTermoBusca(codigo);
                  consultarCnae(codigo);
                }}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors text-sm"
              >
                {codigo}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Upload, FileText, Download, Eye, AlertCircle, CheckCircle, X, Trash2 } from 'lucide-react';
import { 
  parseXMLeSocial, 
  consolidarBeneficiarios, 
  validarXMLeSocial,
  formatarCPF 
} from '../utils/esocialParser';
import { 
  gerarMultiplosComprovantes, 
  downloadPDF, 
  visualizarPDF 
} from '../utils/comprovanteIRRFGenerator';

/**
 * Gerador de Comprovante de Rendimentos (IRRF) via XML eSocial
 * Ferramenta que processa arquivos XML do eSocial (S-1210) e gera
 * Comprovantes de Rendimentos Pagos e de Retenção de IRRF
 */
export default function GeradorComprovanteRendimentos() {
  const [arquivosXML, setArquivosXML] = useState([]);
  const [processando, setProcessando] = useState(false);
  const [comprovantesGerados, setComprovantesGerados] = useState([]);
  const [erros, setErros] = useState([]);
  const [avisos, setAvisos] = useState([]);
  const [pdfVisualizacao, setPdfVisualizacao] = useState(null);

  // ===== UPLOAD DE ARQUIVOS =====
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const novosArquivos = [];
    const novosErros = [];

    for (const file of files) {
      // Verificar se é XML
      if (!file.name.toLowerCase().endsWith('.xml')) {
        novosErros.push(`${file.name}: Arquivo deve ser .xml`);
        continue;
      }

      try {
        const conteudo = await lerArquivo(file);
        
        // Validar XML
        const validacao = validarXMLeSocial(conteudo);
        
        if (!validacao.valido) {
          novosErros.push(`${file.name}: ${validacao.erros.join(', ')}`);
          continue;
        }

        novosArquivos.push({
          nome: file.name,
          conteudo,
          tamanho: file.size,
          data: new Date().toLocaleString('pt-BR'),
        });

      } catch (error) {
        novosErros.push(`${file.name}: Erro ao ler arquivo - ${error.message}`);
      }
    }

    setArquivosXML(prev => [...prev, ...novosArquivos]);
    setErros(prev => [...prev, ...novosErros]);
    
    // Limpar input
    event.target.value = '';
  };

  // ===== LER ARQUIVO =====
  const lerArquivo = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  };

  // ===== REMOVER ARQUIVO =====
  const removerArquivo = (index) => {
    setArquivosXML(prev => prev.filter((_, i) => i !== index));
  };

  // ===== LIMPAR TODOS =====
  const limparTudo = () => {
    setArquivosXML([]);
    setComprovantesGerados([]);
    setErros([]);
    setAvisos([]);
  };

  // ===== PROCESSAR XMLs E GERAR COMPROVANTES =====
  const processarXMLs = async () => {
    if (arquivosXML.length === 0) {
      setErros(['Nenhum arquivo XML carregado']);
      return;
    }

    setProcessando(true);
    setErros([]);
    setAvisos([]);
    setComprovantesGerados([]);

    try {
      // Parse de todos os XMLs
      const xmlsData = [];
      const novosErros = [];

      for (const arquivo of arquivosXML) {
        try {
          const dados = parseXMLeSocial(arquivo.conteudo);
          xmlsData.push(dados);
        } catch (error) {
          novosErros.push(`${arquivo.nome}: ${error.message}`);
        }
      }

      if (novosErros.length > 0) {
        setErros(novosErros);
      }

      if (xmlsData.length === 0) {
        setErros(prev => [...prev, 'Nenhum XML válido foi processado']);
        setProcessando(false);
        return;
      }

      // Consolidar beneficiários
      const beneficiariosConsolidados = consolidarBeneficiarios(xmlsData);

      if (beneficiariosConsolidados.length === 0) {
        setErros(prev => [...prev, 'Nenhum beneficiário encontrado nos XMLs']);
        setProcessando(false);
        return;
      }

      // Extrair dados da fonte pagadora (usar do primeiro XML válido)
      const fontePagadora = {
        nome: 'EMPRESA FONTE PAGADORA LTDA',
        cnpj: xmlsData[0]?.fontePagadora?.nrInsc 
          ? formatarCNPJ(xmlsData[0].fontePagadora.nrInsc) 
          : '00.000.000/0000-00',
        endereco: 'Rua Exemplo, 123 - Centro',
        municipio: 'São Paulo',
        uf: 'SP',
      };

      // Gerar comprovantes
      const comprovantes = await gerarMultiplosComprovantes(beneficiariosConsolidados, fontePagadora);
      
      setComprovantesGerados(comprovantes);

      // Avisos
      const novosAvisos = [];
      if (beneficiariosConsolidados.length > 1) {
        novosAvisos.push(`${beneficiariosConsolidados.length} comprovantes foram gerados (um por CPF)`);
      }
      if (xmlsData.length > beneficiariosConsolidados.length) {
        novosAvisos.push('Alguns XMLs foram consolidados por possuírem o mesmo CPF e ano-calendário');
      }
      setAvisos(novosAvisos);

    } catch (error) {
      setErros(['Erro ao processar XMLs: ' + error.message]);
    } finally {
      setProcessando(false);
    }
  };

  // ===== DOWNLOAD INDIVIDUAL =====
  const handleDownload = (comprovante) => {
    downloadPDF(comprovante.pdf, comprovante.nome);
  };

  // ===== VISUALIZAR =====
  const handleVisualizar = (comprovante) => {
    const pdfBlob = comprovante.pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    setPdfVisualizacao({
      url,
      nome: comprovante.beneficiario,
      cpf: formatarCPF(comprovante.cpf),
      ano: comprovante.anoCalendario,
    });
  };

  // ===== VISUALIZAR EM NOVA ABA =====
  const handleVisualizarNovaAba = (comprovante) => {
    visualizarPDF(comprovante.pdf);
  };

  // ===== FECHAR VISUALIZAÇÃO =====
  const fecharVisualizacao = () => {
    if (pdfVisualizacao?.url) {
      URL.revokeObjectURL(pdfVisualizacao.url);
    }
    setPdfVisualizacao(null);
  };

  // ===== DOWNLOAD DE TODOS =====
  const downloadTodos = () => {
    comprovantesGerados.forEach(comprovante => {
      downloadPDF(comprovante.pdf, comprovante.nome);
    });
  };

  // ===== FORMATAR TAMANHO =====
  const formatarTamanho = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ===== FORMATAR CNPJ =====
  const formatarCNPJ = (cnpj) => {
    if (!cnpj) return '';
    const cleaned = cnpj.replace(/\D/g, '');
    
    if (cleaned.length === 14) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    return cnpj;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Gerador de Comprovante de Rendimentos (IRRF)
              </h1>
              <p className="text-gray-600 mt-1">
                via XML eSocial S-1210
              </p>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Esta ferramenta processa arquivos XML do eSocial (evento S-1210 - Pagamentos de Rendimentos) 
            e gera automaticamente o Comprovante de Rendimentos Pagos e de Retenção de IRRF no padrão 
            oficial da Receita Federal. Faça upload de um ou mais XMLs e obtenha os comprovantes 
            formatados em PDF para impressão.
          </p>
        </div>

        {/* ÁREA DE UPLOAD */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload de Arquivos XML
          </h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
            <input
              type="file"
              id="xml-upload"
              accept=".xml"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="xml-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-700 font-medium mb-1">
                Clique para selecionar ou arraste arquivos XML
              </p>
              <p className="text-gray-500 text-sm">
                Aceita múltiplos arquivos XML do eSocial (S-1210)
              </p>
            </label>
          </div>

          {/* LISTA DE ARQUIVOS CARREGADOS */}
          {arquivosXML.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">
                  Arquivos Carregados ({arquivosXML.length})
                </h3>
                <button
                  onClick={limparTudo}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar Todos
                </button>
              </div>

              <div className="space-y-2">
                {arquivosXML.map((arquivo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-800">{arquivo.nome}</p>
                        <p className="text-sm text-gray-600">
                          {formatarTamanho(arquivo.tamanho)} • {arquivo.data}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removerArquivo(index)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Remover arquivo"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>

              {/* BOTÃO PROCESSAR */}
              <button
                onClick={processarXMLs}
                disabled={processando}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {processando ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processando XMLs...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Gerar Comprovantes
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ERROS */}
        {erros.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-2">Erros Encontrados</h3>
                <ul className="space-y-1">
                  {erros.map((erro, index) => (
                    <li key={index} className="text-red-700 text-sm">• {erro}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setErros([])}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* AVISOS */}
        {avisos.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 mb-2">Avisos</h3>
                <ul className="space-y-1">
                  {avisos.map((aviso, index) => (
                    <li key={index} className="text-yellow-700 text-sm">• {aviso}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setAvisos([])}
                className="text-yellow-600 hover:text-yellow-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* COMPROVANTES GERADOS */}
        {comprovantesGerados.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-800">
                  Comprovantes Gerados ({comprovantesGerados.length})
                </h2>
              </div>
              {comprovantesGerados.length > 1 && (
                <button
                  onClick={downloadTodos}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Baixar Todos
                </button>
              )}
            </div>

            <div className="space-y-3">
              {comprovantesGerados.map((comprovante, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{comprovante.beneficiario}</p>
                      <p className="text-sm text-gray-600">
                        CPF: {formatarCPF(comprovante.cpf)} • Ano: {comprovante.anoCalendario}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{comprovante.nome}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVisualizar(comprovante)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                      title="Visualizar PDF no site"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDownload(comprovante)}
                      className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                      title="Baixar PDF"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL DE VISUALIZAÇÃO PDF */}
        {pdfVisualizacao && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
              {/* Cabeçalho do Modal */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{pdfVisualizacao.nome}</h3>
                  <p className="text-sm text-gray-600">
                    CPF: {pdfVisualizacao.cpf} • Ano: {pdfVisualizacao.ano}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(pdfVisualizacao.url, '_blank')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    title="Abrir em nova aba"
                  >
                    <Eye className="w-4 h-4" />
                    Nova Aba
                  </button>
                  <button
                    onClick={fecharVisualizacao}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Fechar"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Visualizador PDF */}
              <div className="flex-1 overflow-hidden">
                <iframe
                  src={pdfVisualizacao.url}
                  className="w-full h-full border-0"
                  title={`Comprovante - ${pdfVisualizacao.nome}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* INSTRUÇÕES */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-3">Como Usar</h3>
          <ol className="space-y-2 text-blue-800 text-sm">
            <li>1. Faça upload de um ou mais arquivos XML do eSocial (evento S-1210)</li>
            <li>2. A ferramenta validará automaticamente os arquivos</li>
            <li>3. Clique em "Gerar Comprovantes" para processar</li>
            <li>4. Os comprovantes serão gerados no padrão oficial da Receita Federal</li>
            <li>5. Se houver múltiplos XMLs do mesmo CPF, os valores serão consolidados</li>
            <li>6. Baixe ou visualize cada comprovante individualmente</li>
          </ol>
        </div>

      </div>
    </div>
  );
}

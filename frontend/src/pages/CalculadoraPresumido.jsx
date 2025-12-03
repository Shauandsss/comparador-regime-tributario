import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  calcularPresumido, 
  ATIVIDADES_LUCRO_PRESUMIDO, 
  CATEGORIAS_ATIVIDADES_PRESUMIDO,
  getListaAtividadesPresumido 
} from '../services/calculosTributarios';

export default function CalculadoraPresumido() {
  const navigate = useNavigate();
  
  // Estados
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  
  // Formulário
  const [receita, setReceita] = useState('');
  const [atividade, setAtividade] = useState('');
  const [periodo, setPeriodo] = useState('trimestral');
  const [aliquotaISS, setAliquotaISS] = useState('');
  const [aplicaISS, setAplicaISS] = useState(false);
  
  // Resultado
  const [resultado, setResultado] = useState(null);
  
  // Lista de atividades ordenadas por categoria
  const atividadesAgrupadas = useMemo(() => {
    const grupos = {};
    Object.entries(CATEGORIAS_ATIVIDADES_PRESUMIDO).forEach(([key, categoria]) => {
      grupos[key] = {
        nome: categoria.nome,
        atividades: categoria.atividades.map(codigo => ({
          ...ATIVIDADES_LUCRO_PRESUMIDO[codigo],
          codigo
        })).filter(Boolean)
      };
    });
    return grupos;
  }, []);
  
  // Atividade selecionada com detalhes
  const atividadeSelecionada = useMemo(() => {
    if (!atividade) return null;
    return ATIVIDADES_LUCRO_PRESUMIDO[atividade] || null;
  }, [atividade]);
  
  const formatarMoedaInput = (valor) => {
    // Remove tudo exceto números
    const numeros = valor.replace(/\D/g, '');
    
    // Converte para número e divide por 100
    const numero = parseFloat(numeros) / 100;
    
    // Formata como moeda
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  const handleReceitaChange = (e) => {
    const valor = e.target.value;
    setReceita(formatarMoedaInput(valor));
  };
  
  const converterParaNumero = (valorFormatado) => {
    return parseFloat(valorFormatado.replace(/[R$\s.]/g, '').replace(',', '.'));
  };
  
  const handleCalcular = (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);
    
    // Validações
    const receitaNumero = converterParaNumero(receita);
    
    if (!receitaNumero || receitaNumero <= 0) {
      setErro('Informe uma receita válida');
      return;
    }
    
    if (!atividade) {
      setErro('Selecione o tipo de atividade');
      return;
    }
    
    const issNumero = aplicaISS && aliquotaISS ? parseFloat(aliquotaISS) : 0;
    
    if (aplicaISS && (issNumero < 2 || issNumero > 5)) {
      setErro('Alíquota de ISS deve estar entre 2% e 5%');
      return;
    }
    
    setLoading(true);
    
    try {
      // Ajusta receita para anual se for período mensal (para cálculo do adicional de IRPJ)
      const multiplicador = periodo === 'mensal' ? 12 : 4;
      const receitaAnual = receitaNumero * multiplicador;
      
      // Calcular usando função client-side
      const calc = calcularPresumido({
        rbt12: receitaAnual,
        atividade: atividade,
        atividadePresumido: atividade
      });
      
      // Calcular proporção para o período informado
      const fatorPeriodo = 1 / multiplicador;
      
      // ISS (se aplicável)
      const issValor = aplicaISS ? receitaNumero * (issNumero / 100) : 0;
      
      // Valores do período
      const irpjPeriodo = calc.detalhamento.irpj * fatorPeriodo;
      const irpjAdicionalPeriodo = calc.detalhamento.irpjAdicional * fatorPeriodo;
      const csllPeriodo = calc.detalhamento.csll * fatorPeriodo;
      const pisPeriodo = calc.detalhamento.pis * fatorPeriodo;
      const cofinsPeriodo = calc.detalhamento.cofins * fatorPeriodo;
      
      const totalTributos = irpjPeriodo + irpjAdicionalPeriodo + csllPeriodo + pisPeriodo + cofinsPeriodo + issValor;
      const cargaTributaria = (totalTributos / receitaNumero) * 100;
      const lucroPresumido = calc.lucroPresumido * fatorPeriodo;
      
      setResultado({
        entrada: {
          receita: receitaNumero,
          receitaFormatada: formatarMoeda(receitaNumero),
          periodo,
          atividade: atividadeSelecionada?.nome || atividade,
          atividadeDescricao: atividadeSelecionada?.descricao,
          presuncaoIRPJ: atividadeSelecionada?.presuncaoIrpj * 100,
          presuncaoCSLL: atividadeSelecionada?.presuncaoCsll * 100
        },
        resumo: {
          totalTributos,
          totalTributosFormatado: formatarMoeda(totalTributos),
          cargaTributaria: `${cargaTributaria.toFixed(2)}%`,
          cargaTributariaDecimal: cargaTributaria.toFixed(2),
          lucroPresumido,
          lucroPresumidoFormatado: formatarMoeda(lucroPresumido),
          receitaLiquida: receitaNumero - totalTributos,
          receitaLiquidaFormatada: formatarMoeda(receitaNumero - totalTributos)
        },
        tributos: {
          irpj: {
            baseCalculo: lucroPresumido,
            baseCalculoFormatado: formatarMoeda(lucroPresumido),
            irpjBase: irpjPeriodo,
            irpjBaseFormatado: formatarMoeda(irpjPeriodo),
            adicional: irpjAdicionalPeriodo,
            adicionalFormatado: formatarMoeda(irpjAdicionalPeriodo),
            irpjTotal: irpjPeriodo + irpjAdicionalPeriodo,
            irpjTotalFormatado: formatarMoeda(irpjPeriodo + irpjAdicionalPeriodo),
            aliquotaEfetiva: `${((irpjPeriodo + irpjAdicionalPeriodo) / receitaNumero * 100).toFixed(2)}%`
          },
          csll: {
            baseCalculo: calc.detalhamento.lucroPresumidoCsll * fatorPeriodo,
            baseCalculoFormatado: formatarMoeda(calc.detalhamento.lucroPresumidoCsll * fatorPeriodo),
            csll: csllPeriodo,
            csllFormatado: formatarMoeda(csllPeriodo),
            aliquota: '9%',
            aliquotaEfetiva: `${(csllPeriodo / receitaNumero * 100).toFixed(2)}%`
          },
          pis: {
            pis: pisPeriodo,
            pisFormatado: formatarMoeda(pisPeriodo),
            aliquota: '0,65%',
            regime: 'Cumulativo'
          },
          cofins: {
            cofins: cofinsPeriodo,
            cofinsFormatado: formatarMoeda(cofinsPeriodo),
            aliquota: '3%',
            regime: 'Cumulativo'
          },
          iss: {
            iss: issValor,
            issFormatado: formatarMoeda(issValor),
            aliquota: aplicaISS ? `${issNumero}%` : 'N/A',
            observacao: aplicaISS ? 'Alíquota definida pelo município' : 'Não aplicável'
          }
        },
        detalhamento: {
          tributosPorTipo: [
            { nome: 'IRPJ', valor: irpjPeriodo + irpjAdicionalPeriodo, percentual: ((irpjPeriodo + irpjAdicionalPeriodo) / receitaNumero * 100).toFixed(2) },
            { nome: 'CSLL', valor: csllPeriodo, percentual: (csllPeriodo / receitaNumero * 100).toFixed(2) },
            { nome: 'PIS', valor: pisPeriodo, percentual: (pisPeriodo / receitaNumero * 100).toFixed(2) },
            { nome: 'COFINS', valor: cofinsPeriodo, percentual: (cofinsPeriodo / receitaNumero * 100).toFixed(2) },
            ...(issValor > 0 ? [{ nome: 'ISS', valor: issValor, percentual: (issValor / receitaNumero * 100).toFixed(2) }] : [])
          ],
          observacoes: [
            `Percentual de presunção IRPJ: ${(atividadeSelecionada?.presuncaoIrpj * 100).toFixed(1)}%`,
            `Percentual de presunção CSLL: ${(atividadeSelecionada?.presuncaoCsll * 100).toFixed(1)}%`,
            'PIS/COFINS calculados pelo regime cumulativo',
            calc.detalhamento.irpjAdicional > 0 ? 'Aplica-se adicional de 10% sobre lucro presumido excedente a R$ 60.000/trimestre' : 'Não há adicional de IRPJ (lucro presumido até R$ 60.000/trimestre)',
            calc.detalhamento.observacaoLegal || 'Percentuais conforme Lei 9.249/95'
          ]
        }
      });
      
    } catch (error) {
      console.error('Erro ao calcular:', error);
      setErro(error.message || 'Erro ao calcular. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLimpar = () => {
    setReceita('');
    setAtividade('');
    setPeriodo('trimestral');
    setAliquotaISS('');
    setAplicaISS(false);
    setResultado(null);
    setErro('');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-800 mb-4 flex items-center gap-2"
          >
            ← Voltar para Home
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Calculadora Lucro Presumido
          </h1>
          <p className="text-gray-600">
            Calcule IRPJ, CSLL, PIS, COFINS e ISS no regime de Lucro Presumido
          </p>
        </div>
        
        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleCalcular} className="space-y-6">
            
            {/* Receita Bruta */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Receita Bruta do Período *
              </label>
              <input
                type="text"
                value={receita}
                onChange={handleReceitaChange}
                placeholder="R$ 0,00"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-lg"
                required
              />
            </div>
            
            {/* Período */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Período de Apuração *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPeriodo('trimestral')}
                  className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                    periodo === 'trimestral'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  📅 Trimestral
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodo('mensal')}
                  className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                    periodo === 'mensal'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  📆 Mensal
                </button>
              </div>
            </div>
            
            {/* Tipo de Atividade */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Atividade *
              </label>
              <select
                value={atividade}
                onChange={(e) => setAtividade(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                required
              >
                <option value="">Selecione a atividade</option>
                {Object.entries(atividadesAgrupadas).map(([key, grupo]) => (
                  <optgroup key={key} label={`📁 ${grupo.nome}`}>
                    {grupo.atividades.map((atv) => (
                      <option key={atv.codigo} value={atv.codigo}>
                        {atv.nome} — IRPJ {(atv.presuncaoIrpj * 100).toFixed(1)}% / CSLL {(atv.presuncaoCsll * 100).toFixed(0)}%
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {atividadeSelecionada && (
                <div className="mt-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800 mb-2">
                    <strong>📋 {atividadeSelecionada.nome}</strong>
                  </p>
                  <p className="text-xs text-purple-700 mb-2">
                    {atividadeSelecionada.descricao}
                  </p>
                  <div className="flex gap-4 text-xs">
                    <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded">
                      Presunção IRPJ: <strong>{(atividadeSelecionada.presuncaoIrpj * 100).toFixed(1)}%</strong>
                    </span>
                    <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded">
                      Presunção CSLL: <strong>{(atividadeSelecionada.presuncaoCsll * 100).toFixed(0)}%</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* ISS (opcional) */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="aplicaISS"
                  checked={aplicaISS}
                  onChange={(e) => setAplicaISS(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="aplicaISS" className="text-sm font-semibold text-gray-700">
                  Aplicar ISS (Imposto Sobre Serviços)
                </label>
              </div>
              
              {aplicaISS && (
                <input
                  type="number"
                  value={aliquotaISS}
                  onChange={(e) => setAliquotaISS(e.target.value)}
                  placeholder="Alíquota do ISS (2% a 5%)"
                  min="2"
                  max="5"
                  step="0.1"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              )}
              <p className="mt-1 text-xs text-gray-500">
                A alíquota de ISS varia por município (geralmente entre 2% e 5%)
              </p>
            </div>
            
            {/* Mensagem de erro */}
            {erro && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 font-semibold">{erro}</p>
              </div>
            )}
            
            {/* Botões */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? '⏳ Calculando...' : '🧮 Calcular Tributos'}
              </button>
              
              <button
                type="button"
                onClick={handleLimpar}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                🗑️ Limpar
              </button>
            </div>
            
          </form>
        </div>
        
        {/* Resultado */}
        {resultado && (
          <div className="space-y-6">
            
            {/* Resumo Executivo */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">📈 Resumo Executivo</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-purple-100 text-sm mb-1">Receita Bruta</p>
                  <p className="text-2xl font-bold">{resultado.entrada.receitaFormatada}</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-purple-100 text-sm mb-1">Total de Tributos</p>
                  <p className="text-2xl font-bold">{resultado.resumo.totalTributosFormatado}</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-purple-100 text-sm mb-1">Carga Tributária</p>
                  <p className="text-2xl font-bold">{resultado.resumo.cargaTributaria}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-purple-100 text-sm mb-1">Lucro Presumido</p>
                  <p className="text-xl font-bold">{resultado.resumo.lucroPresumidoFormatado}</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-purple-100 text-sm mb-1">Receita Líquida</p>
                  <p className="text-xl font-bold">{resultado.resumo.receitaLiquidaFormatada}</p>
                </div>
              </div>
            </div>
            
            {/* Detalhamento por Tributo */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🧾 Detalhamento dos Tributos</h2>
              
              {/* IRPJ */}
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-blue-900">IRPJ - Imposto de Renda Pessoa Jurídica</h3>
                  <span className="text-2xl font-bold text-blue-900">{resultado.tributos.irpj.irpjTotalFormatado}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700 font-semibold">Base de Cálculo</p>
                    <p className="text-blue-900 font-bold">{resultado.tributos.irpj.baseCalculoFormatado}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-semibold">IRPJ Base (15%)</p>
                    <p className="text-blue-900 font-bold">{resultado.tributos.irpj.irpjBaseFormatado}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-semibold">Adicional (10%)</p>
                    <p className="text-blue-900 font-bold">{resultado.tributos.irpj.adicionalFormatado}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-semibold">Alíquota Efetiva</p>
                    <p className="text-blue-900 font-bold">{resultado.tributos.irpj.aliquotaEfetiva}</p>
                  </div>
                </div>
              </div>
              
              {/* CSLL */}
              <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-green-900">CSLL - Contribuição Social sobre Lucro Líquido</h3>
                  <span className="text-2xl font-bold text-green-900">{resultado.tributos.csll.csllFormatado}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-green-700 font-semibold">Base de Cálculo</p>
                    <p className="text-green-900 font-bold">{resultado.tributos.csll.baseCalculoFormatado}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-semibold">Alíquota</p>
                    <p className="text-green-900 font-bold">{resultado.tributos.csll.aliquota}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-semibold">Alíquota Efetiva</p>
                    <p className="text-green-900 font-bold">{resultado.tributos.csll.aliquotaEfetiva}</p>
                  </div>
                </div>
              </div>
              
              {/* PIS e COFINS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* PIS */}
                <div className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-yellow-900">PIS</h3>
                    <span className="text-xl font-bold text-yellow-900">{resultado.tributos.pis.pisFormatado}</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-yellow-700">Alíquota: <span className="font-bold">{resultado.tributos.pis.aliquota}</span></p>
                    <p className="text-yellow-700">Regime: <span className="font-bold">{resultado.tributos.pis.regime}</span></p>
                  </div>
                </div>
                
                {/* COFINS */}
                <div className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-orange-900">COFINS</h3>
                    <span className="text-xl font-bold text-orange-900">{resultado.tributos.cofins.cofinsFormatado}</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-orange-700">Alíquota: <span className="font-bold">{resultado.tributos.cofins.aliquota}</span></p>
                    <p className="text-orange-700">Regime: <span className="font-bold">{resultado.tributos.cofins.regime}</span></p>
                  </div>
                </div>
              </div>
              
              {/* ISS (se aplicável) */}
              {resultado.tributos.iss.iss > 0 && (
                <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-purple-900">ISS - Imposto Sobre Serviços</h3>
                    <span className="text-xl font-bold text-purple-900">{resultado.tributos.iss.issFormatado}</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-purple-700">Alíquota: <span className="font-bold">{resultado.tributos.iss.aliquota}</span></p>
                    <p className="text-purple-700 text-xs mt-1">{resultado.tributos.iss.observacao}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Gráfico de Composição */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Composição dos Tributos</h2>
              
              <div className="space-y-4">
                {resultado.detalhamento.tributosPorTipo.map((tributo, index) => {
                  const cores = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-purple-500'];
                  const percentual = parseFloat(tributo.percentual);
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-gray-700">{tributo.nome}</span>
                        <span className="text-gray-600">{tributo.percentual}% da receita</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-full ${cores[index]} transition-all duration-500`}
                          style={{ width: `${(percentual / parseFloat(resultado.resumo.cargaTributariaDecimal)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Observações */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-3">ℹ️ Observações Importantes</h3>
              <ul className="space-y-2 text-blue-800">
                {resultado.detalhamento.observacoes.map((obs, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        )}
        
      </div>

      {/* ========== ARTIGO SEO ========== */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-lg max-w-none">
          
          {/* Introdução */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              📊 Lucro Presumido: Guia Completo para Empresas
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              O <strong>Lucro Presumido</strong> é um regime tributário simplificado que permite às empresas calcularem 
              IRPJ e CSLL com base em percentuais de presunção sobre a receita bruta, sem necessidade de apuração contábil 
              detalhada do lucro real. É uma opção intermediária entre o Simples Nacional e o Lucro Real, sendo ideal para 
              empresas com faturamento anual entre R$ 4,8 milhões e R$ 78 milhões que possuem margem de lucro superior aos 
              percentuais de presunção estabelecidos pela Receita Federal.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Este regime foi criado para <strong>simplificar a tributação</strong> de empresas que não podem ou não querem 
              optar pelo Simples Nacional, oferecendo previsibilidade tributária e menor burocracia em comparação ao Lucro Real. 
              A opção pelo Lucro Presumido deve ser feita no início do ano-calendário e é irretratável até 31 de dezembro.
            </p>
          </div>

          {/* Como Funciona */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">⚙️</span>
              Como Funciona o Lucro Presumido
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-blue-900 mb-3">1️⃣ Base de Cálculo Presumida</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  A Receita Federal estabelece <strong>percentuais de presunção</strong> que variam conforme a atividade 
                  da empresa. Esses percentuais representam a margem de lucro presumida:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span><strong>8%</strong> para comércio, indústria e transporte de cargas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span><strong>16%</strong> para transporte de passageiros</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span><strong>32%</strong> para serviços em geral, profissionais liberais e intermediação de negócios</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-green-900 mb-3">2️⃣ Cálculo dos Tributos</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Após aplicar o percentual de presunção sobre a receita bruta, calculam-se os seguintes tributos:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-bold text-blue-900 mb-1">IRPJ (Imposto de Renda)</p>
                    <p className="text-blue-700 text-sm">15% sobre lucro presumido até R$ 60.000/trimestre</p>
                    <p className="text-blue-700 text-sm">+ 10% adicional sobre excedente</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-bold text-green-900 mb-1">CSLL (Contribuição Social)</p>
                    <p className="text-green-700 text-sm">9% sobre o lucro presumido</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="font-bold text-yellow-900 mb-1">PIS (Programa Integração Social)</p>
                    <p className="text-yellow-700 text-sm">0,65% sobre receita bruta (regime cumulativo)</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="font-bold text-orange-900 mb-1">COFINS (Contribuição Social)</p>
                    <p className="text-orange-700 text-sm">3% sobre receita bruta (regime cumulativo)</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-purple-900 mb-3">3️⃣ Periodicidade</h3>
                <p className="text-gray-700 leading-relaxed">
                  IRPJ e CSLL são apurados <strong>trimestralmente</strong> (31/mar, 30/jun, 30/set, 31/dez) e podem ser 
                  pagos em quota única ou parcelados em até 3 vezes. PIS e COFINS são apurados e pagos <strong>mensalmente</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Tabela de Presunção */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">📋</span>
              Tabela de Percentuais de Presunção
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atividade</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">IRPJ</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">CSLL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exemplos</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Comércio e Indústria</td>
                    <td className="px-6 py-4 text-sm text-center text-blue-600 font-bold">8%</td>
                    <td className="px-6 py-4 text-sm text-center text-green-600 font-bold">12%</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Venda de produtos, fabricação, revenda</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Transporte de Cargas</td>
                    <td className="px-6 py-4 text-sm text-center text-blue-600 font-bold">8%</td>
                    <td className="px-6 py-4 text-sm text-center text-green-600 font-bold">12%</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Transportadoras, logística</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Transporte de Passageiros</td>
                    <td className="px-6 py-4 text-sm text-center text-blue-600 font-bold">16%</td>
                    <td className="px-6 py-4 text-sm text-center text-green-600 font-bold">12%</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Ônibus, vans, táxi, aplicativos</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Serviços em Geral</td>
                    <td className="px-6 py-4 text-sm text-center text-blue-600 font-bold">32%</td>
                    <td className="px-6 py-4 text-sm text-center text-green-600 font-bold">32%</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Consultorias, TI, marketing, design</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Serviços Hospitalares</td>
                    <td className="px-6 py-4 text-sm text-center text-blue-600 font-bold">8%</td>
                    <td className="px-6 py-4 text-sm text-center text-green-600 font-bold">12%</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Hospitais, clínicas, laboratórios</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Intermediação de Negócios</td>
                    <td className="px-6 py-4 text-sm text-center text-blue-600 font-bold">32%</td>
                    <td className="px-6 py-4 text-sm text-center text-green-600 font-bold">32%</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Corretagem, representação comercial</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Atividades Imobiliárias</td>
                    <td className="px-6 py-4 text-sm text-center text-blue-600 font-bold">8%</td>
                    <td className="px-6 py-4 text-sm text-center text-green-600 font-bold">12%</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Compra, venda e locação de imóveis</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Atenção:</strong> Empresas com múltiplas atividades devem aplicar o percentual específico 
                para cada tipo de receita. A segregação por atividade é obrigatória na apuração.
              </p>
            </div>
          </div>

          {/* Exemplo Prático */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">💡</span>
              Exemplo Prático de Cálculo
            </h2>
            
            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cenário: Empresa de Serviços de TI</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-2"><strong>Dados:</strong></p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Receita trimestral: R$ 500.000</li>
                    <li>• Atividade: Serviços de TI (32%)</li>
                    <li>• Período: 1º trimestre/2024</li>
                  </ul>
                </div>
                <div>
                  <p className="text-gray-700 mb-2"><strong>Objetivo:</strong></p>
                  <p className="text-gray-700">Calcular IRPJ, CSLL, PIS e COFINS devidos no trimestre</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-900 mb-2">Passo 1: Base de Cálculo IRPJ</h4>
                <p className="text-gray-700 mb-2">Receita Bruta × Percentual de Presunção</p>
                <p className="text-lg font-mono text-blue-600">R$ 500.000 × 32% = R$ 160.000</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-indigo-500">
                <h4 className="font-bold text-indigo-900 mb-2">Passo 2: IRPJ</h4>
                <p className="text-gray-700 mb-1">Base de Cálculo × 15% (até R$ 60.000/trimestre)</p>
                <p className="text-lg font-mono text-indigo-600 mb-2">R$ 60.000 × 15% = R$ 9.000</p>
                <p className="text-gray-700 mb-1">+ Adicional de 10% sobre excedente (R$ 160.000 - R$ 60.000)</p>
                <p className="text-lg font-mono text-indigo-600 mb-2">R$ 100.000 × 10% = R$ 10.000</p>
                <p className="text-xl font-bold text-indigo-900">IRPJ Total = R$ 19.000</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-green-500">
                <h4 className="font-bold text-green-900 mb-2">Passo 3: Base de Cálculo CSLL</h4>
                <p className="text-gray-700 mb-2">Receita Bruta × 32% (mesmo percentual)</p>
                <p className="text-lg font-mono text-green-600">R$ 500.000 × 32% = R$ 160.000</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-emerald-500">
                <h4 className="font-bold text-emerald-900 mb-2">Passo 4: CSLL</h4>
                <p className="text-gray-700 mb-1">Base de Cálculo × 9%</p>
                <p className="text-lg font-mono text-emerald-600 mb-2">R$ 160.000 × 9% = R$ 14.400</p>
                <p className="text-xl font-bold text-emerald-900">CSLL Total = R$ 14.400</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-yellow-500">
                <h4 className="font-bold text-yellow-900 mb-2">Passo 5: PIS (mensal)</h4>
                <p className="text-gray-700 mb-1">Receita mensal × 0,65%</p>
                <p className="text-lg font-mono text-yellow-600 mb-2">R$ 166.667 × 0,65% = R$ 1.083,33 (por mês)</p>
                <p className="text-xl font-bold text-yellow-900">PIS Trimestral = R$ 3.250</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-orange-500">
                <h4 className="font-bold text-orange-900 mb-2">Passo 6: COFINS (mensal)</h4>
                <p className="text-gray-700 mb-1">Receita mensal × 3%</p>
                <p className="text-lg font-mono text-orange-600 mb-2">R$ 166.667 × 3% = R$ 5.000 (por mês)</p>
                <p className="text-xl font-bold text-orange-900">COFINS Trimestral = R$ 15.000</p>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl p-6">
                <h4 className="font-bold text-xl mb-4">📊 Total Trimestral</h4>
                <div className="grid md:grid-cols-2 gap-4 text-lg">
                  <div>
                    <p>IRPJ: R$ 19.000</p>
                    <p>CSLL: R$ 14.400</p>
                    <p>PIS: R$ 3.250</p>
                    <p>COFINS: R$ 15.000</p>
                  </div>
                  <div className="md:text-right">
                    <p className="text-2xl font-bold">Total: R$ 51.650</p>
                    <p className="text-sm opacity-90">Carga tributária: 10,33%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vantagens e Desvantagens */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">⚖️</span>
              Vantagens e Desvantagens do Lucro Presumido
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  Vantagens
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-green-900">Simplicidade:</strong>
                      <p className="text-green-700 text-sm">Cálculo tributário simplificado sem necessidade de contabilidade complexa</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-green-900">Previsibilidade:</strong>
                      <p className="text-green-700 text-sm">Tributação previsível baseada em percentuais fixos sobre receita</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-green-900">Vantajoso para alta margem:</strong>
                      <p className="text-green-700 text-sm">Ideal quando lucro real supera percentuais de presunção</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-green-900">Menos obrigações acessórias:</strong>
                      <p className="text-green-700 text-sm">Dispensa escrituração contábil completa (exceto livro caixa)</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-green-900">Distribuição de lucros isenta:</strong>
                      <p className="text-green-700 text-sm">Lucros distribuídos não sofrem tributação adicional</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">❌</span>
                  Desvantagens
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <div>
                      <strong className="text-red-900">Desvantajoso para baixa margem:</strong>
                      <p className="text-red-700 text-sm">Empresas com lucro inferior à presunção pagam mais impostos</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <div>
                      <strong className="text-red-900">Sem compensação de prejuízos:</strong>
                      <p className="text-red-700 text-sm">Não permite compensar prejuízos fiscais de períodos anteriores</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <div>
                      <strong className="text-red-900">PIS/COFINS cumulativo:</strong>
                      <p className="text-red-700 text-sm">Não permite créditos sobre aquisições (0,65% + 3% fixos)</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <div>
                      <strong className="text-red-900">Limite de faturamento:</strong>
                      <p className="text-red-700 text-sm">Obrigatoriedade de Lucro Real acima de R$ 78 milhões/ano</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <div>
                      <strong className="text-red-900">Restrições para alguns setores:</strong>
                      <p className="text-red-700 text-sm">Bancos, factoring e algumas atividades são obrigadas ao Lucro Real</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quando Optar */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              Quando Optar pelo Lucro Presumido?
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-green-900 mb-3">✅ Perfil Ideal</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>Margem de lucro elevada:</strong> Empresas com margem superior aos percentuais de presunção (ex: empresa de serviços com 40% de margem pagará sobre base de 32%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>Faturamento acima do Simples:</strong> Receita anual entre R$ 4,8 milhões e R$ 78 milhões</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>Baixo volume de custos dedutíveis:</strong> Poucos custos e despesas operacionais que não compensariam apuração real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>Empresas de serviços:</strong> Consultorias, tecnologia, profissionais liberais com estrutura enxuta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>Necessidade de simplicidade:</strong> Empresas que buscam menor burocracia contábil</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-red-900 mb-3">❌ Quando Evitar</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Margem de lucro baixa:</strong> Empresas com margem inferior à presunção pagarão sobre base maior que lucro real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Alto volume de custos dedutíveis:</strong> Muitas despesas operacionais, folha de pagamento elevada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Prejuízos fiscais anteriores:</strong> Impossibilidade de compensar prejuízos acumulados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Muitas compras para revenda:</strong> Impossibilidade de utilizar créditos de PIS/COFINS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Atividades obrigadas ao Lucro Real:</strong> Bancos, financeiras, factoring, lucro no exterior</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">💡 Dica Estratégica</h3>
                <p className="leading-relaxed">
                  Realize uma <strong>análise comparativa</strong> antes de decidir entre Lucro Presumido e Lucro Real. 
                  Considere contratar um contador especializado para simular os dois cenários com base em suas projeções 
                  de receita, custos e despesas. A escolha errada pode resultar em pagamento excessivo de tributos ou 
                  autuação fiscal por enquadramento incorreto.
                </p>
              </div>
            </div>
          </div>

          {/* Comparação com Outros Regimes */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🔄</span>
              Comparação: Lucro Presumido vs Outros Regimes
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Critério</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Simples Nacional</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lucro Presumido</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lucro Real</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Limite de Faturamento</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Até R$ 4,8 milhões/ano</td>
                    <td className="px-6 py-4 text-sm text-blue-700 font-semibold">R$ 4,8 a R$ 78 milhões/ano</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Sem limite (obrigatório acima R$ 78 MM)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Base de Cálculo</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Faturamento bruto (alíquotas progressivas)</td>
                    <td className="px-6 py-4 text-sm text-blue-700 font-semibold">Percentuais de presunção (8% a 32%)</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Lucro líquido apurado contabilmente</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Complexidade</td>
                    <td className="px-6 py-4 text-sm text-green-700">Baixa (guia única)</td>
                    <td className="px-6 py-4 text-sm text-blue-700 font-semibold">Média (4 tributos separados)</td>
                    <td className="px-6 py-4 text-sm text-red-700">Alta (contabilidade complexa)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Obrigações Acessórias</td>
                    <td className="px-6 py-4 text-sm text-green-700">Poucas (PGDAS-D, DEFIS)</td>
                    <td className="px-6 py-4 text-sm text-blue-700 font-semibold">Médias (ECD, ECF, EFD-Contribuições)</td>
                    <td className="px-6 py-4 text-sm text-red-700">Muitas (todas escriturações fiscais)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">PIS/COFINS</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Incluído na guia única</td>
                    <td className="px-6 py-4 text-sm text-blue-700 font-semibold">Cumulativo (0,65% + 3%)</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Não-cumulativo (1,65% + 7,6% com créditos)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Compensação Prejuízos</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Não aplicável</td>
                    <td className="px-6 py-4 text-sm text-red-700">Não permite</td>
                    <td className="px-6 py-4 text-sm text-green-700">Permite (até 30% lucro)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Distribuição Lucros</td>
                    <td className="px-6 py-4 text-sm text-green-700">Isenta</td>
                    <td className="px-6 py-4 text-sm text-blue-700 font-semibold">Isenta</td>
                    <td className="px-6 py-4 text-sm text-green-700">Isenta (com limitações)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Ideal Para</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Pequenas empresas, baixo faturamento</td>
                    <td className="px-6 py-4 text-sm text-blue-700 font-semibold">Médio porte, alta margem, serviços</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Grande porte, baixa margem, prejuízos</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Obrigações Acessórias */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">📑</span>
              Obrigações Acessórias no Lucro Presumido
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-orange-900 mb-3">Mensais</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">📄</span>
                    <span><strong>EFD-Contribuições:</strong> Escrituração Fiscal Digital de PIS/COFINS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">📄</span>
                    <span><strong>DCTF:</strong> Declaração de Débitos e Créditos Tributários Federais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">📄</span>
                    <span><strong>SEFIP/eSocial:</strong> Informações trabalhistas e previdenciárias</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-red-900 mb-3">Anuais</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">📄</span>
                    <span><strong>ECF:</strong> Escrituração Contábil Fiscal (substitui DIPJ)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">📄</span>
                    <span><strong>ECD:</strong> Escrituração Contábil Digital (obrigatória para algumas empresas)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">📄</span>
                    <span><strong>RAIS:</strong> Relação Anual de Informações Sociais</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-orange-100 border-l-4 border-orange-500 rounded">
              <p className="text-sm text-orange-900">
                <strong>⚠️ Importante:</strong> O não cumprimento das obrigações acessórias pode resultar em multas 
                que variam de R$ 500 a R$ 100.000, além de impossibilitar a emissão de Certidão Negativa de Débitos (CND).
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">❓</span>
              Perguntas Frequentes sobre Lucro Presumido
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">1. Posso mudar de Lucro Presumido para Lucro Real durante o ano?</h3>
                <p className="text-gray-700">
                  <strong>Não.</strong> A opção pelo regime tributário é irretratável para todo o ano-calendário. A mudança 
                  só pode ser feita no início do próximo ano, no primeiro pagamento do IRPJ ou primeira escrituração contábil. 
                  Exceção: empresas que iniciam atividades durante o ano podem escolher na abertura.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">2. Como sei se minha margem de lucro é maior que a presunção?</h3>
                <p className="text-gray-700">
                  Calcule seu <strong>lucro líquido real</strong> (receitas - todas as despesas) e divida pela receita bruta. 
                  Se o resultado for superior ao percentual de presunção da sua atividade, o Lucro Presumido tende a ser vantajoso. 
                  Exemplo: empresa de serviços com 40% de margem pagará sobre base de 32%.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">3. Preciso fazer contabilidade completa no Lucro Presumido?</h3>
                <p className="text-gray-700">
                  <strong>Depende.</strong> A escrituração contábil completa não é obrigatória, mas é <strong>altamente recomendada</strong>. 
                  Empresas com receita bruta superior a R$ 300 mil/ano ou R$ 25 mil/mês são obrigadas a manter livro caixa. 
                  A contabilidade facilita controle gerencial, distribuição de lucros e pode ser exigida por bancos e investidores.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">4. Posso distribuir lucros sem tributação no Lucro Presumido?</h3>
                <p className="text-gray-700">
                  <strong>Sim.</strong> Lucros distribuídos são <strong>isentos de Imposto de Renda</strong> para os sócios, 
                  desde que: (1) estejam escriturados conforme legislação comercial e fiscal, (2) sejam distribuídos dentro 
                  dos limites do lucro presumido, e (3) a empresa esteja em dia com suas obrigações tributárias.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">5. O que acontece se meu faturamento ultrapassar R$ 78 milhões?</h3>
                <p className="text-gray-700">
                  A empresa é <strong>obrigada</strong> a migrar para o Lucro Real no ano seguinte. Se o excesso ocorrer 
                  durante o ano, deve-se calcular os tributos pelo Lucro Real a partir do mês subsequente ao excesso. 
                  É fundamental monitorar o faturamento acumulado para evitar autuações.
                </p>
              </div>

              <div className="border-l-4 border-indigo-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">6. Empresas do Lucro Presumido podem aproveitar créditos de PIS/COFINS?</h3>
                <p className="text-gray-700">
                  <strong>Não.</strong> No Lucro Presumido, PIS e COFINS são calculados no <strong>regime cumulativo</strong> 
                  (0,65% + 3% sobre receita bruta), sem direito a créditos sobre compras. Somente empresas no Lucro Real 
                  (regime não-cumulativo) podem aproveitar créditos sobre insumos e outras aquisições.
                </p>
              </div>

              <div className="border-l-4 border-pink-500 pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">7. Qual o prazo para pagamento dos tributos no Lucro Presumido?</h3>
                <p className="text-gray-700">
                  <strong>IRPJ e CSLL:</strong> até o último dia útil do mês seguinte ao encerramento do trimestre (ex: 1º trimestre 
                  vence em 30/abril). Podem ser parcelados em até 3 vezes. <strong>PIS e COFINS:</strong> até o dia 25 do mês 
                  seguinte ao da ocorrência dos fatos geradores. <strong>ISS:</strong> conforme legislação municipal (geralmente dia 10 ou 15).
                </p>
              </div>
            </div>
          </div>

          {/* Base Legal */}
          <div className="bg-gray-100 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">⚖️</span>
              Legislação e Base Legal
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">📜 Lei nº 9.249/1995</h3>
                <p className="text-gray-700 text-sm">
                  Institui o Lucro Presumido e estabelece os percentuais de presunção para diferentes atividades.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">📜 Lei nº 9.430/1996</h3>
                <p className="text-gray-700 text-sm">
                  Regulamenta a apuração trimestral do IRPJ e CSLL, prazos de pagamento e adicional de 10%.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">📜 Instrução Normativa RFB nº 1.700/2017</h3>
                <p className="text-gray-700 text-sm">
                  Dispõe sobre a determinação e o pagamento do IRPJ e da CSLL no regime de tributação com base no lucro presumido.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">📜 Lei nº 10.637/2002 e Lei nº 10.833/2003</h3>
                <p className="text-gray-700 text-sm">
                  Dispõem sobre PIS e COFINS no regime cumulativo aplicável ao Lucro Presumido.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">🎯 Faça a Escolha Certa para sua Empresa</h2>
            <p className="text-xl mb-6 opacity-90">
              Use nossa calculadora acima para simular sua carga tributária no Lucro Presumido e compare 
              com outros regimes tributários. Tome decisões informadas e economize em impostos!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                📊 Calcular Agora
              </button>
              <button
                onClick={() => navigate('/comparador')}
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
              >
                🔄 Comparar Regimes
              </button>
            </div>
          </div>

        </article>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Tabela progressiva IRPF 2024/2025
const TABELA_IRPF = [
  { limite: 2259.20, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 7.5, deducao: 169.44 },
  { limite: 3751.05, aliquota: 15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 22.5, deducao: 662.77 },
  { limite: Infinity, aliquota: 27.5, deducao: 896.00 }
];

// INSS Autônomo/Empresário (11% sobre salário mínimo até teto)
const INSS_AUTONOMO = 11;
const SALARIO_MINIMO = 1412.00;
const TETO_INSS = 7786.02;

// INSS Patronal (empresa assume - 20% sobre pró-labore)
const INSS_PATRONAL = 20;

// Fator R mínimo para Anexo III
const FATOR_R_MINIMO = 28;

export default function CalculadoraProLabore() {
  const navigate = useNavigate();
  
  // Estados
  const [proLabore, setProLabore] = useState('');
  const [empresaAssumeINSS, setEmpresaAssumeINSS] = useState(false);
  const [dependentes, setDependentes] = useState(0);
  const [resultado, setResultado] = useState(null);
  
  // Estados para Fator R
  const [mostrarFatorR, setMostrarFatorR] = useState(false);
  const [rbt12, setRbt12] = useState('');
  const [fatorRAtual, setFatorRAtual] = useState(null);
  const [sugestaoProLabore, setSugestaoProLabore] = useState(null);
  
  const formatarMoedaInput = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    const numero = parseFloat(numeros) / 100;
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  const converterParaNumero = (valorFormatado) => {
    if (!valorFormatado) return 0;
    return parseFloat(valorFormatado.replace(/[R$\s.]/g, '').replace(',', '.'));
  };
  
  const calcularIRPF = (baseCalculo) => {
    if (baseCalculo <= 0) {
      return { aliquota: 0, irpf: 0, deducao: 0, faixa: 'Isento' };
    }
    
    for (let i = 0; i < TABELA_IRPF.length; i++) {
      if (baseCalculo <= TABELA_IRPF[i].limite) {
        const irpf = (baseCalculo * TABELA_IRPF[i].aliquota / 100) - TABELA_IRPF[i].deducao;
        return {
          aliquota: TABELA_IRPF[i].aliquota,
          irpf: Math.max(0, irpf),
          deducao: TABELA_IRPF[i].deducao,
          faixa: `${i + 1}ª faixa`
        };
      }
    }
    
    return { aliquota: 0, irpf: 0, deducao: 0, faixa: 'Erro' };
  };
  
  const calcular = () => {
    const valor = converterParaNumero(proLabore);
    
    if (!valor || valor <= 0) {
      alert('Informe um valor válido para o pró-labore');
      return;
    }
    
    // INSS Autônomo (11% limitado ao teto)
    const baseINSS = Math.min(valor, TETO_INSS);
    const inssAutonomo = baseINSS * (INSS_AUTONOMO / 100);
    
    // INSS Patronal (20% se empresa assumir)
    const inssPatronal = empresaAssumeINSS ? (valor * (INSS_PATRONAL / 100)) : 0;
    
    // Base de cálculo IRPF = Pró-labore - INSS Autônomo - Dependentes
    const deducaoDependentes = dependentes * 189.59;
    const baseCalculoIRPF = valor - inssAutonomo - deducaoDependentes;
    
    // Calcular IRPF
    const irpfResult = calcularIRPF(baseCalculoIRPF);
    
    // Totais
    const descontosProLabore = inssAutonomo + irpfResult.irpf;
    const liquido = valor - descontosProLabore;
    const custoTotal = valor + inssPatronal;
    
    setResultado({
      proLabore: valor,
      inss: {
        autonomo: inssAutonomo,
        patronal: inssPatronal,
        total: inssAutonomo + inssPatronal,
        baseCalculo: baseINSS,
        atingiuTeto: baseINSS >= TETO_INSS
      },
      irpf: {
        baseCalculo: baseCalculoIRPF,
        aliquota: irpfResult.aliquota,
        deducao: irpfResult.deducao,
        valor: irpfResult.irpf,
        faixa: irpfResult.faixa
      },
      dependentes: {
        quantidade: dependentes,
        valorDeducao: deducaoDependentes
      },
      totais: {
        descontos: descontosProLabore,
        liquido,
        custoTotal,
        percentualDesconto: (descontosProLabore / valor) * 100
      }
    });
  };
  
  const calcularFatorR = () => {
    if (!resultado) {
      alert('Calcule o pró-labore primeiro');
      return;
    }
    
    const rbtValor = converterParaNumero(rbt12);
    
    if (!rbtValor || rbtValor <= 0) {
      alert('Informe a Receita Bruta dos últimos 12 meses');
      return;
    }
    
    // Folha anual = Pró-labore * 12 + INSS Patronal * 12
    const folhaAnual = (resultado.proLabore + resultado.inss.patronal) * 12;
    
    // Fator R = (Folha 12 meses / RBT12) * 100
    const fatorR = (folhaAnual / rbtValor) * 100;
    
    setFatorRAtual(fatorR);
    
    // Se fator R < 28%, sugerir pró-labore ideal
    if (fatorR < FATOR_R_MINIMO) {
      // Folha ideal = RBT12 * 28%
      const folhaIdeal = rbtValor * (FATOR_R_MINIMO / 100);
      
      // Pró-labore ideal = (Folha ideal / 12) / (1 + 0.20) se empresa assume INSS
      const divisor = empresaAssumeINSS ? 1.20 : 1;
      const proLaboreIdeal = (folhaIdeal / 12) / divisor;
      
      setSugestaoProLabore({
        folhaIdeal,
        proLaboreIdeal,
        aumentoNecessario: proLaboreIdeal - resultado.proLabore,
        fatorRIdeal: FATOR_R_MINIMO
      });
    } else {
      setSugestaoProLabore(null);
    }
  };
  
  useEffect(() => {
    if (proLabore && converterParaNumero(proLabore) > 0) {
      calcular();
    }
  }, [proLabore, empresaAssumeINSS, dependentes]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-2"
          >
            ← Voltar para Home
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💼 Calculadora de Pró-Labore
          </h1>
          <p className="text-gray-600">
            Calcule INSS, IRPF e defina o pró-labore ideal para o Fator R
          </p>
        </div>
        
        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="space-y-6">
            
            {/* Pró-Labore */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💰 Valor do Pró-Labore Mensal *
              </label>
              <input
                type="text"
                value={proLabore}
                onChange={(e) => setProLabore(formatarMoedaInput(e.target.value))}
                placeholder="R$ 0,00"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-lg"
              />
              <p className="mt-1 text-xs text-gray-500">
                Salário mínimo atual: {formatarMoedaInput(String(SALARIO_MINIMO * 100))}
              </p>
            </div>
            
            {/* Opções */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Empresa assume INSS */}
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    id="empresaINSS"
                    checked={empresaAssumeINSS}
                    onChange={(e) => setEmpresaAssumeINSS(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="empresaINSS" className="font-bold text-gray-800">
                    🏢 Empresa assume INSS Patronal (20%)
                  </label>
                </div>
                <p className="text-sm text-blue-700">
                  Adiciona 20% ao custo total da empresa
                </p>
              </div>
              
              {/* Dependentes */}
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <label className="block font-bold text-gray-800 mb-2">
                  👨‍👩‍👧‍👦 Dependentes para IRPF
                </label>
                <input
                  type="number"
                  value={dependentes}
                  onChange={(e) => setDependentes(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                />
                <p className="mt-1 text-sm text-green-700">
                  R$ 189,59 por dependente
                </p>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Resultado */}
        {resultado && (
          <div className="space-y-6">
            
            {/* Resumo */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">📊 Resumo do Pró-Labore</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-indigo-100 text-sm mb-1">Pró-Labore Bruto</p>
                  <p className="text-2xl font-bold">{formatarMoedaInput(String(resultado.proLabore * 100))}</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-indigo-100 text-sm mb-1">Total Descontos</p>
                  <p className="text-2xl font-bold">{formatarMoedaInput(String(resultado.totais.descontos * 100))}</p>
                  <p className="text-indigo-100 text-xs">{resultado.totais.percentualDesconto.toFixed(1)}%</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-indigo-100 text-sm mb-1">Líquido a Receber</p>
                  <p className="text-2xl font-bold text-green-300">{formatarMoedaInput(String(resultado.totais.liquido * 100))}</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-indigo-100 text-sm mb-1">Custo Total Empresa</p>
                  <p className="text-2xl font-bold">{formatarMoedaInput(String(resultado.totais.custoTotal * 100))}</p>
                </div>
              </div>
            </div>
            
            {/* Detalhamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* INSS */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🏥</span>
                  INSS
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-semibold">Contribuinte (11%)</span>
                      <span className="font-bold text-blue-900">
                        {formatarMoedaInput(String(resultado.inss.autonomo * 100))}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Base: {formatarMoedaInput(String(resultado.inss.baseCalculo * 100))}
                      {resultado.inss.atingiuTeto && ' (Teto INSS)'}
                    </p>
                  </div>
                  
                  {empresaAssumeINSS && (
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-semibold">Patronal (20%)</span>
                        <span className="font-bold text-orange-900">
                          {formatarMoedaInput(String(resultado.inss.patronal * 100))}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Custo adicional da empresa
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-indigo-100 rounded-lg p-4 border-2 border-indigo-300">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-800">Total INSS</span>
                      <span className="font-bold text-xl text-indigo-900">
                        {formatarMoedaInput(String(resultado.inss.total * 100))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* IRPF */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  IRPF
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 text-sm">Base de Cálculo</span>
                      <span className="font-bold text-gray-800">
                        {formatarMoedaInput(String(resultado.irpf.baseCalculo * 100))}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Pró-labore - INSS - Dependentes
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-semibold">Alíquota</span>
                      <span className="font-bold text-yellow-900">{resultado.irpf.aliquota}%</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {resultado.irpf.faixa} • Dedução: {formatarMoedaInput(String(resultado.irpf.deducao * 100))}
                    </div>
                  </div>
                  
                  {dependentes > 0 && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 text-sm">{dependentes} Dependente(s)</span>
                        <span className="font-bold text-purple-900">
                          -{formatarMoedaInput(String(resultado.dependentes.valorDeducao * 100))}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-indigo-100 rounded-lg p-4 border-2 border-indigo-300">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-800">IRPF a Recolher</span>
                      <span className="font-bold text-xl text-indigo-900">
                        {formatarMoedaInput(String(resultado.irpf.valor * 100))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            
            {/* Simulador Fator R */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">📐</span>
                    Simulador Fator R
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Verifique se atinge os 28% para o Anexo III do Simples Nacional
                  </p>
                </div>
                <button
                  onClick={() => setMostrarFatorR(!mostrarFatorR)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  {mostrarFatorR ? 'Ocultar' : 'Simular'}
                </button>
              </div>
              
              {mostrarFatorR && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Receita Bruta dos últimos 12 meses (RBT12)
                    </label>
                    <input
                      type="text"
                      value={rbt12}
                      onChange={(e) => setRbt12(formatarMoedaInput(e.target.value))}
                      placeholder="R$ 0,00"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    />
                  </div>
                  
                  <button
                    onClick={calcularFatorR}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    Calcular Fator R
                  </button>
                  
                  {fatorRAtual !== null && (
                    <div className="space-y-4 mt-6">
                      
                      {/* Fator R Atual */}
                      <div className={`rounded-xl p-6 border-2 ${
                        fatorRAtual >= FATOR_R_MINIMO 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-yellow-50 border-yellow-300'
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-bold text-gray-800">Fator R Atual</span>
                          <span className={`text-3xl font-bold ${
                            fatorRAtual >= FATOR_R_MINIMO ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {fatorRAtual.toFixed(2)}%
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                          <div
                            className={`h-full rounded-full transition-all ${
                              fatorRAtual >= FATOR_R_MINIMO ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.min(100, (fatorRAtual / FATOR_R_MINIMO) * 100)}%` }}
                          ></div>
                        </div>
                        
                        <p className={`font-semibold ${
                          fatorRAtual >= FATOR_R_MINIMO ? 'text-green-700' : 'text-yellow-700'
                        }`}>
                          {fatorRAtual >= FATOR_R_MINIMO 
                            ? '✅ Atinge o Fator R mínimo! Empresa pode optar pelo Anexo III (alíquotas menores)' 
                            : '⚠️ Não atinge os 28% do Fator R. Será enquadrada no Anexo V (alíquotas maiores)'}
                        </p>
                      </div>
                      
                      {/* Sugestão */}
                      {sugestaoProLabore && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                          <h4 className="font-bold text-blue-900 mb-3 text-lg">💡 Sugestão para atingir 28%</h4>
                          
                          <div className="space-y-2 text-blue-800">
                            <p>
                              <strong>Pró-labore ideal:</strong>{' '}
                              {formatarMoedaInput(String(sugestaoProLabore.proLaboreIdeal * 100))}/mês
                            </p>
                            <p>
                              <strong>Aumento necessário:</strong>{' '}
                              {formatarMoedaInput(String(sugestaoProLabore.aumentoNecessario * 100))}/mês
                            </p>
                            <p className="text-sm">
                              Com este pró-labore, a folha anual será de{' '}
                              {formatarMoedaInput(String(sugestaoProLabore.folhaIdeal * 100))},
                              atingindo exatamente {sugestaoProLabore.fatorRIdeal}% do Fator R.
                            </p>
                          </div>
                        </div>
                      )}
                      
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Observações */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-3">ℹ️ Informações Importantes</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>INSS Autônomo (11%) é descontado do pró-labore</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>INSS Patronal (20%) é custo adicional da empresa, não desconta do pró-labore</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>IRPF usa tabela progressiva com deduções por faixa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Fator R = (Folha 12 meses / RBT12) × 100. Mínimo 28% para Anexo III</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Teto INSS 2024: {formatarMoedaInput(String(TETO_INSS * 100))}</span>
                </li>
              </ul>
            </div>
            
          </div>
        )}
        
      </div>
    </div>
  );
}

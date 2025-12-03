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
                  <p className="text-2xl font-bold text-green-300">
                    {resultado.totais.liquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-indigo-100 text-sm mb-1">Custo Total Empresa</p>
                  <p className="text-2xl font-bold">
                    {resultado.totais.custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
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

        {/* Artigo SEO */}
        <article className="mt-12 max-w-4xl mx-auto prose prose-lg prose-slate">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Pró-Labore: O Que É, Como Calcular INSS e IRPF, e Qual o Valor Ideal para 2025
          </h2>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Introdução</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Se você é sócio ou administrador de uma empresa, já ouviu falar em <strong>pró-labore</strong> — mas será que sabe 
              exatamente o que é, como calcular corretamente, quais impostos incidem sobre ele e, mais importante, 
              <strong>qual o valor ideal para pagar</strong>? O pró-labore não é apenas uma formalidade: ele tem impacto direto 
              na sua aposentadoria, na tributação da empresa (especialmente no <strong>Fator R</strong> do Simples Nacional) e até 
              na sua capacidade de conseguir crédito ou financiamento.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Muitos empresários cometem erros graves: pagam pró-labore muito baixo (ou zero) para "economizar impostos" e acabam 
              prejudicando sua aposentadoria e caindo no Anexo V do Simples (alíquotas até 2,5x maiores). Outros pagam pró-labore 
              alto demais sem planejamento e são surpreendidos por <strong>descontos de até 38% entre INSS e IRPF</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Neste guia completo, vamos explicar <strong>o que é o pró-labore, a diferença dele para distribuição de lucros, 
              como calcular INSS e IRPF, estratégias para definir o valor ideal e como otimizar o Fator R</strong> para pagar menos impostos.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">O Que É Pró-Labore e Por Que É Obrigatório</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Pró-labore</strong> (do latim "pelo trabalho") é a remuneração paga aos sócios, administradores ou diretores 
              de uma empresa <strong>pelo trabalho que exercem</strong> na gestão do negócio. É diferente da distribuição de lucros 
              (que veremos adiante) e é <strong>obrigatório por lei</strong>.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">Base Legal: Código Civil e CLT</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              O <strong>Código Civil Brasileiro (Art. 1.027 e 1.063)</strong> determina que o sócio que trabalha na administração 
              da empresa tem direito a uma remuneração específica, separada da partilha de lucros. A <strong>Receita Federal</strong> 
              e o <strong>INSS</strong> consideram essa remuneração como obrigatória para sócios que efetivamente trabalham na empresa.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Importante:</strong> Sócios que <strong>não trabalham</strong> na empresa (sócios investidores, cotistas passivos) 
              <strong>não precisam</strong> receber pró-labore — apenas os que exercem funções administrativas, comerciais ou operacionais.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-lg mb-4">
              <h5 className="font-bold text-yellow-900 mb-2">⚠️ Risco de Não Pagar Pró-Labore</h5>
              <p className="text-gray-700 leading-relaxed">
                Não pagar pró-labore para sócios que trabalham na empresa pode gerar: <strong>(1)</strong> Autuações do INSS por 
                sonegação de contribuições previdenciárias, <strong>(2)</strong> Questionamentos da Receita Federal sobre distribuição 
                de lucros disfarçada, <strong>(3)</strong> Perda de direitos previdenciários (aposentadoria, auxílio-doença), 
                <strong>(4)</strong> Dificuldade em comprovar renda para crédito/financiamento.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Pró-Labore vs Distribuição de Lucros: Qual a Diferença?</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Essa é uma das dúvidas mais comuns — e entender a diferença é crucial para planejamento tributário inteligente.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Aspecto</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Pró-Labore</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Distribuição de Lucros</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium">Natureza</td>
                    <td className="px-4 py-3">Remuneração pelo trabalho</td>
                    <td className="px-4 py-3">Partilha dos lucros da empresa</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">Obrigatoriedade</td>
                    <td className="px-4 py-3">Obrigatório para sócios que trabalham</td>
                    <td className="px-4 py-3">Opcional (depende de lucro apurado)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">INSS</td>
                    <td className="px-4 py-3"><strong>Sim</strong> (11% contribuinte + 20% patronal)</td>
                    <td className="px-4 py-3"><strong>Não</strong> (isento de INSS)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">IRPF</td>
                    <td className="px-4 py-3"><strong>Sim</strong> (tabela progressiva, até 27,5%)</td>
                    <td className="px-4 py-3"><strong>Não</strong> (isento se lucro contábil comprovado)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Frequência</td>
                    <td className="px-4 py-3">Mensal (como salário)</td>
                    <td className="px-4 py-3">Variável (conforme disponibilidade)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">Impacto Fator R</td>
                    <td className="px-4 py-3"><strong>Sim</strong> (conta na folha de salários)</td>
                    <td className="px-4 py-3"><strong>Não</strong> (não conta na folha)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-lg">
              <h5 className="font-bold text-green-900 mb-2">💡 Estratégia Inteligente</h5>
              <p className="text-gray-700 leading-relaxed">
                A combinação ideal é: <strong>pró-labore suficiente</strong> para atingir o Fator R de 28% (se aplicável) e 
                garantir aposentadoria + <strong>distribuição de lucros</strong> (isenta) para complementar a retirada mensal. 
                Assim você equilibra tributação e benefícios previdenciários.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Como Calcular INSS e IRPF sobre o Pró-Labore</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              O pró-labore sofre <strong>dois descontos principais</strong>: INSS (11%) e IRPF (tabela progressiva). 
              Além disso, a empresa paga o <strong>INSS patronal (20%)</strong>, que não desconta do sócio mas aumenta o custo total.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">1. INSS sobre Pró-Labore (11%)</h4>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg mb-4">
              <p className="text-gray-700 leading-relaxed mb-3">
                O sócio contribui com <strong>11% do pró-labore</strong> para o INSS, limitado ao <strong>teto previdenciário</strong> 
                (R$ 7.786,02 em 2024/2025). Valores acima do teto não geram contribuição adicional.
              </p>
              <div className="bg-white rounded p-3 font-mono text-sm">
                <p className="text-gray-900">INSS Contribuinte = min(Pró-Labore, R$ 7.786,02) × 11%</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-3"><strong>Exemplos:</strong></p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
              <li>Pró-labore de R$ 3.000: INSS = R$ 330 (11%)</li>
              <li>Pró-labore de R$ 5.000: INSS = R$ 550 (11%)</li>
              <li>Pró-labore de R$ 10.000: INSS = <strong>R$ 856,46</strong> (11% do teto, não dos R$ 10.000)</li>
            </ul>

            <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">2. INSS Patronal (20% - Custo da Empresa)</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              A empresa paga <strong>20% do pró-labore</strong> como INSS patronal (parte empresa). Este valor <strong>não desconta</strong> 
              do sócio, mas aumenta o custo total da folha. Para empresas no Simples Nacional, esse INSS patronal já está incluído 
              no DAS — <strong>não há guia separada</strong>.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">3. IRPF (Tabela Progressiva até 27,5%)</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              O IRPF incide sobre a <strong>base de cálculo</strong> = Pró-Labore - INSS (11%) - Dependentes (R$ 189,59 cada). 
              A alíquota é progressiva conforme a tabela oficial:
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Faixa</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700">Base de Cálculo</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700">Alíquota</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700">Dedução</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2">1ª faixa</td>
                    <td className="px-3 py-2 text-right">Até R$ 2.259,20</td>
                    <td className="px-3 py-2 text-right font-bold text-green-600">Isento</td>
                    <td className="px-3 py-2 text-right">-</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-3 py-2">2ª faixa</td>
                    <td className="px-3 py-2 text-right">R$ 2.259,21 a R$ 2.826,65</td>
                    <td className="px-3 py-2 text-right font-bold">7,5%</td>
                    <td className="px-3 py-2 text-right">R$ 169,44</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">3ª faixa</td>
                    <td className="px-3 py-2 text-right">R$ 2.826,66 a R$ 3.751,05</td>
                    <td className="px-3 py-2 text-right font-bold">15%</td>
                    <td className="px-3 py-2 text-right">R$ 381,44</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-3 py-2">4ª faixa</td>
                    <td className="px-3 py-2 text-right">R$ 3.751,06 a R$ 4.664,68</td>
                    <td className="px-3 py-2 text-right font-bold text-orange-600">22,5%</td>
                    <td className="px-3 py-2 text-right">R$ 662,77</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">5ª faixa</td>
                    <td className="px-3 py-2 text-right">Acima de R$ 4.664,68</td>
                    <td className="px-3 py-2 text-right font-bold text-red-600">27,5%</td>
                    <td className="px-3 py-2 text-right">R$ 896,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
              <h4 className="text-lg font-bold text-gray-900 mb-3">📊 Exemplo Completo de Cálculo</h4>
              <p className="text-gray-700 mb-3">
                <strong>Dados:</strong> Pró-labore de R$ 5.000; 2 dependentes; empresa assume INSS patronal.
              </p>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded p-3">
                  <p className="font-mono text-sm text-gray-900"><strong>1.</strong> INSS (11%):</p>
                  <p className="font-mono text-sm text-gray-900 ml-4">R$ 5.000 × 11% = <strong>R$ 550,00</strong></p>
                </div>
                <div className="bg-green-50 rounded p-3">
                  <p className="font-mono text-sm text-gray-900"><strong>2.</strong> Base IRPF:</p>
                  <p className="font-mono text-sm text-gray-900 ml-4">R$ 5.000 - R$ 550 (INSS) - R$ 379,18 (2 dep.) = <strong>R$ 4.070,82</strong></p>
                </div>
                <div className="bg-yellow-50 rounded p-3">
                  <p className="font-mono text-sm text-gray-900"><strong>3.</strong> IRPF (4ª faixa, 22,5%):</p>
                  <p className="font-mono text-sm text-gray-900 ml-4">(R$ 4.070,82 × 22,5%) - R$ 662,77 = <strong>R$ 252,66</strong></p>
                </div>
                <div className="bg-indigo-100 border-2 border-indigo-300 rounded p-4">
                  <p className="font-bold text-indigo-900 text-lg">Total Descontos: R$ 802,66 (16,05%)</p>
                  <p className="font-bold text-green-700 text-xl">Líquido: R$ 4.197,34</p>
                  <p className="text-sm text-indigo-800 mt-2">Custo Total Empresa: R$ 6.000 (+ R$ 1.000 INSS patronal 20%)</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Qual o Valor Ideal de Pró-Labore? Estratégias Práticas</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Não existe um valor único ideal — depende da sua situação, objetivos e regime tributário da empresa. 
              Mas existem <strong>estratégias inteligentes</strong>:
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">1️⃣ Pró-Labore Mínimo Seguro: 1 Salário Mínimo</h4>
                <p className="text-gray-700 leading-relaxed">
                  A Receita Federal e o INSS consideram <strong>1 salário mínimo</strong> (R$ 1.412 em 2024/2025) como piso razoável 
                  para sócios que trabalham. Valores inferiores podem gerar questionamentos. Mesmo que você complemente com lucros, 
                  é importante ter um pró-labore formal.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">2️⃣ Pró-Labore para Atingir Fator R 28% (Simples Nacional)</h4>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Se sua empresa é de <strong>serviços no Simples Nacional</strong>, o Fator R determina se você paga impostos pelo 
                  <strong>Anexo III (6% inicial)</strong> ou <strong>Anexo V (15,5% inicial)</strong> — uma diferença brutal. 
                  Para atingir Anexo III, a folha de salários (incluindo pró-labore + INSS patronal) deve ser ≥ 28% da receita bruta anual.
                </p>
                <div className="bg-indigo-50 rounded p-4">
                  <p className="font-mono text-sm text-gray-900 mb-2">
                    <strong>Fórmula:</strong> Pró-labore Ideal = (RBT12 × 0,28 / 12) / 1,20
                  </p>
                  <p className="text-xs text-gray-600">
                    Onde RBT12 = Receita Bruta dos últimos 12 meses; dividimos por 1,20 para considerar o INSS patronal de 20%
                  </p>
                </div>
                <p className="text-gray-700 text-sm mt-2">
                  <strong>Exemplo:</strong> Empresa fatura R$ 360.000/ano → Folha ideal = R$ 100.800/ano → Pró-labore ideal = R$ 7.000/mês
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">3️⃣ Pró-Labore para Maximizar Aposentadoria</h4>
                <p className="text-gray-700 leading-relaxed">
                  Se seu objetivo é ter uma <strong>aposentadoria maior</strong>, você pode pagar pró-labore até o <strong>teto do INSS 
                  (R$ 7.786,02)</strong>. Acima disso, não há ganho previdenciário (mas há desconto de IRPF). 
                  Para aposentadoria no teto, você precisa contribuir sobre esse valor por pelo menos 35 anos.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">4️⃣ Pró-Labore Baixo + Distribuição de Lucros Alta</h4>
                <p className="text-gray-700 leading-relaxed">
                  Estratégia comum para <strong>minimizar tributação</strong>: pagar pró-labore mínimo (ex.: R$ 2.000 - R$ 3.000) 
                  e complementar a retirada mensal com <strong>distribuição de lucros</strong> (isenta de INSS e IRPF). 
                  Mas atenção: se o pró-labore for muito baixo e os lucros muito altos, pode chamar atenção do Fisco.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-lg">
              <h5 className="font-bold text-yellow-900 mb-2">⚠️ Cuidado com Extremos</h5>
              <p className="text-gray-700 leading-relaxed">
                <strong>Pró-labore zero ou muito baixo:</strong> prejudica aposentadoria, pode gerar autuações e faz você cair no Anexo V (mais impostos). 
                <strong>Pró-labore muito alto:</strong> aumenta descontos (INSS + IRPF até 38%) sem benefício proporcional. 
                O ideal é encontrar o <strong>equilíbrio</strong> entre tributação, previdência e Fator R.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">5 Erros Comuns com Pró-Labore</h3>

            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">❌ Erro 1: Não pagar pró-labore para "economizar impostos"</h4>
                <p className="text-gray-700 leading-relaxed">
                  Não pagar pró-labore não economiza — apenas transfere o problema: você perde aposentadoria, a empresa pode ser autuada 
                  pelo INSS, e se for do Simples Nacional, cai no Anexo V pagando <strong>2,5x mais impostos</strong> no DAS.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">❌ Erro 2: Pagar pró-labore acima do teto achando que aumenta aposentadoria</h4>
                <p className="text-gray-700 leading-relaxed">
                  Pró-labore acima de R$ 7.786,02 <strong>não aumenta</strong> sua aposentadoria — mas continua pagando IRPF sobre o excedente. 
                  Se o objetivo é previdência, não vale a pena ultrapassar o teto.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">❌ Erro 3: Confundir pró-labore com distribuição de lucros</h4>
                <p className="text-gray-700 leading-relaxed">
                  São coisas diferentes! Pró-labore é obrigatório e tributado; distribuição de lucros é opcional e <strong>isenta</strong> 
                  (se comprovado lucro contábil). Não trate todo dinheiro retirado como "lucro" sem pagar pró-labore.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">❌ Erro 4: Esquecer de emitir recibo/holerite de pró-labore</h4>
                <p className="text-gray-700 leading-relaxed">
                  Mesmo sem vínculo CLT, o pró-labore deve ter <strong>comprovante formal</strong> (recibo ou holerite) com discriminação 
                  dos descontos. Isso é essencial para comprovar renda, declarar IRPF e evitar problemas com o Fisco.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">❌ Erro 5: Não ajustar o pró-labore ao longo do tempo</h4>
                <p className="text-gray-700 leading-relaxed">
                  Se a empresa cresceu e o faturamento aumentou, pode ser necessário <strong>aumentar o pró-labore</strong> para manter 
                  o Fator R acima de 28%. Ou se a empresa está em crise, pode ser necessário reduzir temporariamente. 
                  Revisar o pró-labore anualmente é boa prática.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Perguntas Frequentes sobre Pró-Labore</h3>

            <div className="space-y-5">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">1. Sou MEI, preciso pagar pró-labore?</h4>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Não.</strong> O MEI já paga uma contribuição fixa mensal (DAS-MEI de R$ 71,60 a R$ 76,60 em 2025) que 
                  substitui o pró-labore e garante direitos previdenciários. Você pode retirar livremente o lucro do MEI sem tributação adicional.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">2. Posso pagar pró-labore diferente para cada sócio?</h4>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Sim.</strong> Cada sócio pode ter um pró-labore diferente, conforme a função que exerce e a dedicação ao negócio. 
                  Um sócio que trabalha em tempo integral pode ter pró-labore maior que um sócio que atua em tempo parcial. 
                  Mas os valores devem ser <strong>razoáveis e justificáveis</strong> perante o Fisco.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">3. Pró-labore tem 13º salário e férias?</h4>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Não.</strong> Sócios que recebem pró-labore <strong>não têm direito a 13º, férias, FGTS ou aviso prévio</strong> — 
                  esses direitos são exclusivos de empregados CLT. O pró-labore é uma remuneração mensal fixa, sem encargos trabalhistas.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">4. Preciso pagar INSS patronal sobre o pró-labore?</h4>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Depende do regime.</strong> Empresas do <strong>Simples Nacional</strong> pagam o INSS patronal <strong>junto com o DAS</strong> 
                  (já incluso na alíquota). Empresas do <strong>Lucro Presumido/Real</strong> pagam INSS patronal <strong>separadamente</strong> 
                  (20% sobre o pró-labore) via guia GPS.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">5. Posso deduzir o pró-labore como despesa da empresa?</h4>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Sim.</strong> O pró-labore é <strong>despesa dedutível</strong> para cálculo do IRPJ e CSLL (Lucro Presumido e Real). 
                  Isso reduz a base tributável da empresa. No Simples Nacional, não há dedução individual de despesas, mas o pró-labore 
                  entra no cálculo do Fator R.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">6. Como declaro pró-labore no IRPF pessoa física?</h4>
                <p className="text-gray-700 leading-relaxed">
                  O pró-labore deve ser declarado na ficha <strong>"Rendimentos Tributáveis Recebidos de PJ"</strong>. 
                  A empresa fornecerá o <strong>Informe de Rendimentos</strong> com os valores anuais de pró-labore, INSS e IRPF retido. 
                  Use esses dados para preencher sua declaração.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Legislação do Pró-Labore</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                <strong>Código Civil (Lei 10.406/2002, Art. 1.027 e 1.063):</strong> Estabelece que os sócios administradores têm 
                direito a remuneração específica (pró-labore), separada da partilha de lucros.
              </li>
              <li>
                <strong>Lei 8.212/1991 (Lei da Seguridade Social):</strong> Determina que sócios com pró-labore são segurados obrigatórios 
                da Previdência Social e devem contribuir com 11% + INSS patronal (20%).
              </li>
              <li>
                <strong>Instrução Normativa RFB 971/2009:</strong> Regulamenta as contribuições previdenciárias de empresários, 
                sócios e administradores. Detalha cálculo de INSS sobre pró-labore.
              </li>
              <li>
                <strong>Lei 8.981/1995:</strong> Estabelece que a distribuição de lucros é <strong>isenta</strong> de IRPF, desde que 
                haja lucro contábil comprovado. Isso diferencia lucros de pró-labore (tributado).
              </li>
              <li>
                <strong>Lei Complementar 123/2006 (Simples Nacional):</strong> Define que o pró-labore e encargos entram no cálculo do 
                <strong>Fator R</strong> (§ 5º-J do Art. 18), determinando o anexo de tributação para empresas de serviços.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Conclusão: Defina Seu Pró-Labore com Estratégia, Não no Achismo</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              O pró-labore não é apenas mais uma obrigação burocrática — é uma <strong>ferramenta estratégica</strong> que impacta 
              tributação, aposentadoria, crédito e até a viabilidade fiscal da sua empresa. Definir o valor correto exige entender 
              suas necessidades, o regime tributário da empresa e os objetivos de longo prazo.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Use a <strong>Calculadora de Pró-Labore</strong> acima para simular cenários: veja quanto você realmente receberá 
              após os descontos de INSS e IRPF, quanto a empresa pagará no total, e se seu pró-labore atual atinge o Fator R de 28% 
              (essencial para empresas de serviços no Simples Nacional).
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Lembre-se: <strong>pró-labore baixo demais</strong> prejudica sua aposentadoria e pode aumentar impostos; 
              <strong>pró-labore alto demais</strong> aumenta descontos sem benefício proporcional. O ideal é o <strong>equilíbrio estratégico</strong> 
              — e agora você tem as informações para encontrá-lo.
            </p>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 text-center">
              <h4 className="text-2xl font-bold mb-3">💼 Calcule Seu Pró-Labore Ideal Agora</h4>
              <p className="text-indigo-100 mb-4">
                Descubra quanto você realmente recebe, o custo total da empresa e se atinge o Fator R de 28%.
              </p>
              <a 
                href="#top" 
                className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-indigo-50 transition shadow-lg"
              >
                Usar Calculadora Grátis
              </a>
            </div>
          </section>
        </article>
        
      </div>
    </div>
  );
}

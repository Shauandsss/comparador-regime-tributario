/**
 * Calculadora de Rescisão Trabalhista
 * 100% Frontend - Sem dependências de backend
 * Parte 1: Estrutura e Formulário
 */
import { useState } from 'react';

function CalculadoraRescisao() {
  const [formData, setFormData] = useState({
    dataAdmissao: '',
    dataDemissao: '',
    salarioBruto: '',
    mediaSalarioVariavel: '',
    tipoRescisao: 'semJustaCausa',
    avisoPrevio: 'trabalhado',
    feriasVencidas: '0',
    feriasProporcionais: true,
    decimoTerceiroProporcional: true,
    saldoFgts: '',
    temDependentes: '0'
  });

  const [resultado, setResultado] = useState(null);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const calcularDiferencaDias = (dataInicio, dataFim) => {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diferencaMs = fim - inicio;
    return Math.floor(diferencaMs / (1000 * 60 * 60 * 24));
  };

  const calcularDiferencaMeses = (dataInicio, dataFim) => {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    let meses = (fim.getFullYear() - inicio.getFullYear()) * 12;
    meses += fim.getMonth() - inicio.getMonth();
    
    if (fim.getDate() < inicio.getDate()) {
      meses--;
    }
    
    return meses;
  };

  // Tabela INSS 2025
  const calcularINSS = (salario) => {
    const faixas = [
      { limite: 1518.00, aliquota: 0.075 },
      { limite: 2793.88, aliquota: 0.09 },
      { limite: 4190.83, aliquota: 0.12 },
      { limite: 8157.41, aliquota: 0.14 }
    ];
    
    let inss = 0;
    let salarioRestante = salario;
    let faixaAnterior = 0;
    
    for (const faixa of faixas) {
      if (salarioRestante <= 0) break;
      
      const baseCalculo = Math.min(salarioRestante, faixa.limite - faixaAnterior);
      inss += baseCalculo * faixa.aliquota;
      salarioRestante -= baseCalculo;
      faixaAnterior = faixa.limite;
    }
    
    return Math.min(inss, 951.01); // Teto INSS 2025
  };

  // Tabela IRRF 2025
  const calcularIRRF = (baseCalculo, dependentes = 0) => {
    const deducaoPorDependente = 189.59;
    const baseComDependentes = baseCalculo - (dependentes * deducaoPorDependente);
    
    const faixas = [
      { limite: 2259.20, aliquota: 0, deducao: 0 },
      { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
      { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
      { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
      { limite: Infinity, aliquota: 0.275, deducao: 896.00 }
    ];
    
    for (const faixa of faixas) {
      if (baseComDependentes <= faixa.limite) {
        return Math.max(0, baseComDependentes * faixa.aliquota - faixa.deducao);
      }
    }
    return 0;
  };

  const calcular = () => {
    const salario = parseFloat(formData.salarioBruto) || 0;
    const mediaVariavel = parseFloat(formData.mediaSalarioVariavel) || 0;
    const saldoFgts = parseFloat(formData.saldoFgts) || 0;
    const dependentes = parseInt(formData.temDependentes) || 0;
    
    const salarioTotal = salario + mediaVariavel;
    
    // Calcular tempo de serviço
    const diasTrabalhados = calcularDiferencaDias(formData.dataAdmissao, formData.dataDemissao);
    const mesesTrabalhados = calcularDiferencaMeses(formData.dataAdmissao, formData.dataDemissao);
    const anosTrabalhados = Math.floor(mesesTrabalhados / 12);
    
    // Calcular dias do mês de demissão
    const dataDemissao = new Date(formData.dataDemissao);
    const diaDoMes = dataDemissao.getDate();
    const diasNoMes = new Date(dataDemissao.getFullYear(), dataDemissao.getMonth() + 1, 0).getDate();
    
    // ========== 1. SALDO DE SALÁRIO ==========
    const saldoSalario = (salarioTotal / diasNoMes) * diaDoMes;
    
    // ========== 2. AVISO PRÉVIO ==========
    let avisoPrevioValor = 0;
    let avisoPrevioDescricao = '';
    
    if (formData.tipoRescisao === 'semJustaCausa' && formData.avisoPrevio === 'indenizado') {
      // Aviso prévio: 30 dias + 3 dias por ano (máximo 90 dias)
      const diasAvisoPrevio = Math.min(30 + (anosTrabalhados * 3), 90);
      avisoPrevioValor = (salarioTotal / 30) * diasAvisoPrevio;
      avisoPrevioDescricao = `${diasAvisoPrevio} dias indenizados`;
    } else if (formData.tipoRescisao === 'acordoComum') {
      // Acordo: 50% do aviso prévio
      const diasAvisoPrevio = Math.min(30 + (anosTrabalhados * 3), 90);
      avisoPrevioValor = ((salarioTotal / 30) * diasAvisoPrevio) * 0.5;
      avisoPrevioDescricao = `50% de ${diasAvisoPrevio} dias (acordo)`;
    } else if (formData.tipoRescisao === 'pedidoDemissao' && formData.avisoPrevio === 'naoTrabalhado') {
      // Desconto do aviso não trabalhado
      avisoPrevioValor = -salarioTotal;
      avisoPrevioDescricao = '30 dias descontados';
    }
    
    // ========== 3. FÉRIAS ==========
    let feriasVencidasValor = 0;
    let feriasProporcionaisValor = 0;
    
    const feriasVencidas = parseInt(formData.feriasVencidas) || 0;
    
    // Férias vencidas
    if (feriasVencidas > 0) {
      if (formData.tipoRescisao === 'justaCausa') {
        // Justa causa: férias vencidas SEM 1/3
        feriasVencidasValor = salarioTotal * feriasVencidas;
      } else {
        // Outros casos: férias vencidas COM 1/3
        feriasVencidasValor = (salarioTotal * feriasVencidas) * (4/3);
      }
    }
    
    // Férias proporcionais
    if (formData.feriasProporcionais && formData.tipoRescisao !== 'justaCausa') {
      const mesesParaFerias = mesesTrabalhados % 12;
      const avos = mesesParaFerias >= 1 ? mesesParaFerias : 0;
      
      if (formData.tipoRescisao === 'acordoComum') {
        // Acordo: 50% das férias proporcionais
        feriasProporcionaisValor = ((salarioTotal / 12) * avos) * (4/3) * 0.5;
      } else {
        // Demais casos: 100% das férias proporcionais
        feriasProporcionaisValor = ((salarioTotal / 12) * avos) * (4/3);
      }
    }
    
    const totalFerias = feriasVencidasValor + feriasProporcionaisValor;
    
    // ========== 4. 13º SALÁRIO ==========
    let decimoTerceiroValor = 0;
    
    if (formData.decimoTerceiroProporcional && formData.tipoRescisao !== 'justaCausa') {
      const mesAtual = dataDemissao.getMonth() + 1; // 1-12
      const avos = mesAtual >= 1 ? mesAtual : 0;
      decimoTerceiroValor = (salarioTotal / 12) * avos;
    }
    
    // ========== 5. MULTA FGTS ==========
    let multaFgts = 0;
    let percentualMulta = 0;
    
    if (formData.tipoRescisao === 'semJustaCausa') {
      multaFgts = saldoFgts * 0.40; // 40% do saldo FGTS
      percentualMulta = 40;
    } else if (formData.tipoRescisao === 'acordoComum') {
      multaFgts = saldoFgts * 0.20; // 20% do saldo FGTS
      percentualMulta = 20;
    }
    
    // ========== 6. DESCONTOS (INSS e IRRF) ==========
    // Base: saldo + aviso + 13º
    const baseDescontos = saldoSalario + Math.max(0, avisoPrevioValor) + decimoTerceiroValor;
    const inssDesconto = calcularINSS(baseDescontos);
    const irrfDesconto = calcularIRRF(baseDescontos - inssDesconto, dependentes);
    
    // ========== 7. TOTAL BRUTO E LÍQUIDO ==========
    const totalBruto = saldoSalario + avisoPrevioValor + totalFerias + decimoTerceiroValor + multaFgts;
    const totalDescontos = inssDesconto + irrfDesconto;
    const totalLiquido = totalBruto - totalDescontos;
    
    // ========== RESULTADO ==========
    setResultado({
      informacoes: {
        dataAdmissao: formatarData(formData.dataAdmissao),
        dataDemissao: formatarData(formData.dataDemissao),
        diasTrabalhados,
        mesesTrabalhados,
        anosTrabalhados,
        salarioTotal,
        tipoRescisao: formData.tipoRescisao,
        tipoRescisaoNome: {
          'semJustaCausa': 'Demissão sem Justa Causa',
          'pedidoDemissao': 'Pedido de Demissão',
          'justaCausa': 'Demissão por Justa Causa',
          'acordoComum': 'Acordo Comum'
        }[formData.tipoRescisao]
      },
      verbas: {
        saldoSalario: {
          valor: saldoSalario,
          descricao: `Saldo de ${diaDoMes} dias trabalhados`
        },
        avisoPrevio: {
          valor: avisoPrevioValor,
          descricao: avisoPrevioDescricao
        },
        feriasVencidas: {
          valor: feriasVencidasValor,
          descricao: feriasVencidas > 0 ? `${feriasVencidas} período(s) vencido(s)` : 'Sem férias vencidas'
        },
        feriasProporcionais: {
          valor: feriasProporcionaisValor,
          descricao: `Férias proporcionais + 1/3`
        },
        decimoTerceiro: {
          valor: decimoTerceiroValor,
          descricao: `13º proporcional (${dataDemissao.getMonth() + 1}/12)`
        },
        multaFgts: {
          valor: multaFgts,
          descricao: percentualMulta > 0 ? `${percentualMulta}% do saldo FGTS` : 'Não aplicável'
        }
      },
      descontos: {
        inss: inssDesconto,
        irrf: irrfDesconto,
        total: totalDescontos
      },
      totais: {
        bruto: totalBruto,
        liquido: totalLiquido
      },
      direitos: {
        saqueFgts: formData.tipoRescisao === 'semJustaCausa' || formData.tipoRescisao === 'acordoComum',
        seguroDesemprego: formData.tipoRescisao === 'semJustaCausa' && mesesTrabalhados >= 12,
        percentualSaqueFgts: formData.tipoRescisao === 'semJustaCausa' ? 100 : (formData.tipoRescisao === 'acordoComum' ? 80 : 0)
      }
    });
  };

  const limpar = () => {
    setFormData({
      dataAdmissao: '',
      dataDemissao: '',
      salarioBruto: '',
      mediaSalarioVariavel: '',
      tipoRescisao: 'semJustaCausa',
      avisoPrevio: 'trabalhado',
      feriasVencidas: '0',
      feriasProporcionais: true,
      decimoTerceiroProporcional: true,
      saldoFgts: '',
      temDependentes: '0'
    });
    setResultado(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl shadow-xl p-6 md:p-8 mb-8 text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          📄 Calculadora de Rescisão Trabalhista
        </h1>
        <p className="text-red-100 text-sm md:text-lg">
          Calcule todos os valores da rescisão: saldo, férias, 13º, aviso prévio e FGTS — Atualizada 2025
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Formulário - Dados Básicos */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            Dados da Rescisão
          </h2>

          <div className="space-y-5">
            {/* Datas */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data de Admissão *
                </label>
                <input
                  type="date"
                  name="dataAdmissao"
                  value={formData.dataAdmissao}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data da Demissão *
                </label>
                <input
                  type="date"
                  name="dataDemissao"
                  value={formData.dataDemissao}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
            </div>

            {/* Salários */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Salário Bruto *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">R$</span>
                  <input
                    type="number"
                    name="salarioBruto"
                    value={formData.salarioBruto}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="3.000,00"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Média Salarial Variável (Comissões/Horas Extras)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">R$</span>
                  <input
                    type="number"
                    name="mediaSalarioVariavel"
                    value={formData.mediaSalarioVariavel}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Média dos últimos 12 meses</p>
              </div>
            </div>

            {/* Tipo de Rescisão */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Rescisão *
              </label>
              <select
                name="tipoRescisao"
                value={formData.tipoRescisao}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="semJustaCausa">Demissão sem Justa Causa (pelo empregador)</option>
                <option value="pedidoDemissao">Pedido de Demissão (pelo empregado)</option>
                <option value="justaCausa">Demissão por Justa Causa</option>
                <option value="acordoComum">Acordo Comum (Reforma Trabalhista)</option>
              </select>
            </div>

            {/* Aviso Prévio */}
            {(formData.tipoRescisao === 'semJustaCausa' || formData.tipoRescisao === 'pedidoDemissao') && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Aviso Prévio
                </label>
                <select
                  name="avisoPrevio"
                  value={formData.avisoPrevio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="trabalhado">Trabalhado</option>
                  <option value="indenizado">Indenizado (pela empresa)</option>
                  <option value="naoTrabalhado">Não trabalhado (desconto pelo empregado)</option>
                </select>
              </div>
            )}

            {/* Férias */}
            <div className="bg-blue-50 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-gray-800">📅 Férias</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Períodos de Férias Vencidas
                  </label>
                  <select
                    name="feriasVencidas"
                    value={formData.feriasVencidas}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="0">Nenhum período vencido</option>
                    <option value="1">1 período vencido</option>
                    <option value="2">2 períodos vencidos</option>
                    <option value="3">3 períodos vencidos (máximo)</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="feriasProporcionais"
                    checked={formData.feriasProporcionais}
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Calcular férias proporcionais
                  </label>
                </div>
              </div>
            </div>

            {/* 13º e FGTS */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-xl p-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="decimoTerceiroProporcional"
                    checked={formData.decimoTerceiroProporcional}
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Calcular 13º proporcional
                  </span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saldo FGTS (para multa 40%)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 text-sm">R$</span>
                  <input
                    type="number"
                    name="saldoFgts"
                    value={formData.saldoFgts}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Dependentes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Dependentes (para IRRF)
              </label>
              <select
                name="temDependentes"
                value={formData.temDependentes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="0">Nenhum</option>
                <option value="1">1 dependente</option>
                <option value="2">2 dependentes</option>
                <option value="3">3 dependentes</option>
                <option value="4">4 ou mais dependentes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card de Informações */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="text-2xl">ℹ️</span>
            Sobre a Rescisão
          </h2>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💼 Sem Justa Causa</h4>
              <p className="text-xs">Funcionário recebe: saldo, férias, 13º, aviso prévio, multa 40% FGTS e saque FGTS.</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">🚪 Pedido de Demissão</h4>
              <p className="text-xs">Funcionário recebe: saldo, férias proporcionais, 13º proporcional. Perde FGTS e multa.</p>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">⚠️ Justa Causa</h4>
              <p className="text-xs">Funcionário recebe apenas: saldo de dias trabalhados e férias vencidas (sem 1/3).</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">🤝 Acordo Comum</h4>
              <p className="text-xs">Funcionário recebe: 50% aviso, 50% férias, 13º proporcional, 20% multa FGTS, 80% saque FGTS.</p>
            </div>
          </div>

          {/* Botões */}
          <div className="space-y-3 mt-6">
            <button
              onClick={calcular}
              disabled={!formData.dataAdmissao || !formData.dataDemissao || !formData.salarioBruto}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-xl font-bold hover:from-red-700 hover:to-rose-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="text-xl">🧮</span>
              Calcular Rescisão
            </button>
            
            <button
              onClick={limpar}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Limpar Formulário
            </button>
          </div>
        </div>
      </div>

      {/* Resultado Completo */}
      {resultado && (
        <>
          {/* Total Destaque */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="text-center mb-6">
              <h3 className="text-lg text-gray-600 mb-2">
                {resultado.informacoes.tipoRescisaoNome}
              </h3>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl inline-block">
                <div className="text-sm font-semibold mb-1 text-green-100">
                  Valor Líquido a Receber
                </div>
                <div className="text-5xl font-black mb-2">
                  {formatarMoeda(resultado.totais.liquido)}
                </div>
                <div className="text-green-100 text-sm">
                  Bruto: {formatarMoeda(resultado.totais.bruto)} | Descontos: {formatarMoeda(resultado.descontos.total)}
                </div>
              </div>
            </div>

            {/* Informações do Contrato */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-xs text-blue-600 font-medium mb-1">Tempo de Serviço</div>
                <div className="text-2xl font-bold text-blue-800">
                  {resultado.informacoes.anosTrabalhados > 0 && `${resultado.informacoes.anosTrabalhados}a `}
                  {resultado.informacoes.mesesTrabalhados % 12}m
                </div>
                <div className="text-xs text-gray-500">{resultado.informacoes.diasTrabalhados} dias</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-xs text-purple-600 font-medium mb-1">Admissão</div>
                <div className="text-lg font-bold text-purple-800">
                  {resultado.informacoes.dataAdmissao}
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-xs text-orange-600 font-medium mb-1">Demissão</div>
                <div className="text-lg font-bold text-orange-800">
                  {resultado.informacoes.dataDemissao}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-xs text-green-600 font-medium mb-1">Salário</div>
                <div className="text-lg font-bold text-green-800">
                  {formatarMoeda(resultado.informacoes.salarioTotal)}
                </div>
              </div>
            </div>

            {/* Direitos Adicionais */}
            {(resultado.direitos.saqueFgts || resultado.direitos.seguroDesemprego) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                  <span>✅</span> Direitos Adicionais
                </h4>
                <div className="space-y-2 text-sm">
                  {resultado.direitos.saqueFgts && (
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-600">🏦</span>
                      <span className="text-gray-700">
                        <strong>Saque FGTS:</strong> Pode sacar {resultado.direitos.percentualSaqueFgts}% do saldo do FGTS
                      </span>
                    </div>
                  )}
                  {resultado.direitos.seguroDesemprego && (
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-600">💼</span>
                      <span className="text-gray-700">
                        <strong>Seguro-Desemprego:</strong> Tem direito a solicitar (mínimo 12 meses trabalhados)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Detalhamento das Verbas */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Verbas a Receber */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                <span>💰</span> Verbas a Receber
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-start py-3 border-b">
                  <div>
                    <div className="font-medium text-gray-800">Saldo de Salário</div>
                    <div className="text-xs text-gray-500">{resultado.verbas.saldoSalario.descricao}</div>
                  </div>
                  <div className="font-bold text-green-700">
                    {formatarMoeda(resultado.verbas.saldoSalario.valor)}
                  </div>
                </div>

                {resultado.verbas.avisoPrevio.valor !== 0 && (
                  <div className="flex justify-between items-start py-3 border-b">
                    <div>
                      <div className="font-medium text-gray-800">Aviso Prévio</div>
                      <div className="text-xs text-gray-500">{resultado.verbas.avisoPrevio.descricao}</div>
                    </div>
                    <div className={`font-bold ${resultado.verbas.avisoPrevio.valor > 0 ? 'text-green-700' : 'text-red-600'}`}>
                      {resultado.verbas.avisoPrevio.valor > 0 ? '+' : ''}{formatarMoeda(resultado.verbas.avisoPrevio.valor)}
                    </div>
                  </div>
                )}

                {resultado.verbas.feriasVencidas.valor > 0 && (
                  <div className="flex justify-between items-start py-3 border-b">
                    <div>
                      <div className="font-medium text-gray-800">Férias Vencidas + 1/3</div>
                      <div className="text-xs text-gray-500">{resultado.verbas.feriasVencidas.descricao}</div>
                    </div>
                    <div className="font-bold text-green-700">
                      {formatarMoeda(resultado.verbas.feriasVencidas.valor)}
                    </div>
                  </div>
                )}

                {resultado.verbas.feriasProporcionais.valor > 0 && (
                  <div className="flex justify-between items-start py-3 border-b">
                    <div>
                      <div className="font-medium text-gray-800">Férias Proporcionais + 1/3</div>
                      <div className="text-xs text-gray-500">{resultado.verbas.feriasProporcionais.descricao}</div>
                    </div>
                    <div className="font-bold text-green-700">
                      {formatarMoeda(resultado.verbas.feriasProporcionais.valor)}
                    </div>
                  </div>
                )}

                {resultado.verbas.decimoTerceiro.valor > 0 && (
                  <div className="flex justify-between items-start py-3 border-b">
                    <div>
                      <div className="font-medium text-gray-800">13º Salário Proporcional</div>
                      <div className="text-xs text-gray-500">{resultado.verbas.decimoTerceiro.descricao}</div>
                    </div>
                    <div className="font-bold text-green-700">
                      {formatarMoeda(resultado.verbas.decimoTerceiro.valor)}
                    </div>
                  </div>
                )}

                {resultado.verbas.multaFgts.valor > 0 && (
                  <div className="flex justify-between items-start py-3 border-b">
                    <div>
                      <div className="font-medium text-gray-800">Multa FGTS</div>
                      <div className="text-xs text-gray-500">{resultado.verbas.multaFgts.descricao}</div>
                    </div>
                    <div className="font-bold text-green-700">
                      {formatarMoeda(resultado.verbas.multaFgts.valor)}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center py-3 bg-green-100 px-4 rounded-lg font-bold">
                  <span className="text-green-800">TOTAL BRUTO</span>
                  <span className="text-green-800 text-xl">{formatarMoeda(resultado.totais.bruto)}</span>
                </div>
              </div>
            </div>

            {/* Descontos */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                <span>📉</span> Descontos
              </h3>
              
              <div className="space-y-3">
                {resultado.descontos.inss > 0 && (
                  <div className="flex justify-between items-start py-3 border-b">
                    <div>
                      <div className="font-medium text-gray-800">INSS</div>
                      <div className="text-xs text-gray-500">Contribuição previdenciária</div>
                    </div>
                    <div className="font-bold text-red-600">
                      -{formatarMoeda(resultado.descontos.inss)}
                    </div>
                  </div>
                )}

                {resultado.descontos.irrf > 0 && (
                  <div className="flex justify-between items-start py-3 border-b">
                    <div>
                      <div className="font-medium text-gray-800">IRRF</div>
                      <div className="text-xs text-gray-500">Imposto de Renda Retido na Fonte</div>
                    </div>
                    <div className="font-bold text-red-600">
                      -{formatarMoeda(resultado.descontos.irrf)}
                    </div>
                  </div>
                )}

                {resultado.descontos.total === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">✅</div>
                    <div className="text-sm">Sem descontos para esta rescisão</div>
                  </div>
                )}

                {resultado.descontos.total > 0 && (
                  <div className="flex justify-between items-center py-3 bg-red-100 px-4 rounded-lg font-bold">
                    <span className="text-red-800">TOTAL DESCONTOS</span>
                    <span className="text-red-800 text-xl">-{formatarMoeda(resultado.descontos.total)}</span>
                  </div>
                )}

                {/* Valor Líquido Final */}
                <div className="mt-6 pt-6 border-t-2">
                  <div className="flex justify-between items-center py-4 bg-gradient-to-r from-green-500 to-emerald-600 px-4 rounded-xl font-bold text-white shadow-lg">
                    <span className="text-lg">VALOR LÍQUIDO</span>
                    <span className="text-2xl">{formatarMoeda(resultado.totais.liquido)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Toggle Detalhes */}
          <div className="text-center mb-8">
            <button
              onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition"
            >
              {mostrarDetalhes ? '🔼 Ocultar' : '🔽 Ver'} Observações Importantes
            </button>
          </div>

          {/* Observações */}
          {mostrarDetalhes && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                <span>ℹ️</span> Observações Importantes
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Os valores são aproximados e podem variar conforme convenção coletiva ou acordos específicos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Aviso prévio progressivo: 30 dias + 3 dias por ano trabalhado (máximo 90 dias).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Férias vencidas além de 1 período podem gerar multa adicional para o empregador.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Seguro-desemprego requer tempo mínimo de contribuição e registro na carteira de trabalho.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>O prazo para pagamento da rescisão é de até 10 dias corridos após o término do contrato.</span>
                </li>
              </ul>
            </div>
          )}
        </>
      )}

      {/* ========== ARTIGO SEO ========== */}
      <article className="bg-white rounded-2xl shadow-xl p-6 md:p-10 prose prose-lg max-w-none">
        
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          📚 Rescisão Trabalhista: Guia Completo 2025
        </h2>

        {/* Introdução */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            A <strong>rescisão trabalhista</strong> é o momento de término do contrato de trabalho entre empregado 
            e empregador. Independente do motivo da demissão, o trabalhador tem direito a receber diversas verbas 
            rescisórias, que variam conforme o tipo de desligamento.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Entender exatamente quanto você vai receber na rescisão é fundamental para planejar suas finanças. 
            Neste guia completo de 2025, você vai aprender tudo sobre as verbas rescisórias, como calcular cada 
            uma delas, e quais são seus direitos conforme a CLT.
          </p>
        </section>

        {/* Como Calcular */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📐 Como Calcular Rescisão Trabalhista em 2025
          </h3>
          
          <p className="text-gray-700 mb-4">
            O cálculo da rescisão depende do <strong>tipo de desligamento</strong> e do <strong>tempo de serviço</strong>. 
            As principais verbas rescisórias são:
          </p>

          <div className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left">Verba</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Como Calcular</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Observação</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Saldo de Salário</td>
                  <td className="border border-gray-300 px-4 py-2">(Salário ÷ 30) × dias trabalhados</td>
                  <td className="border border-gray-300 px-4 py-2">Dias trabalhados no mês da demissão</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Aviso Prévio</td>
                  <td className="border border-gray-300 px-4 py-2">30 dias + 3 dias/ano (máx 90)</td>
                  <td className="border border-gray-300 px-4 py-2">Apenas se indenizado pela empresa</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Férias Vencidas</td>
                  <td className="border border-gray-300 px-4 py-2">Salário × períodos vencidos × 1,33</td>
                  <td className="border border-gray-300 px-4 py-2">+ 1/3 constitucional</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Férias Proporcionais</td>
                  <td className="border border-gray-300 px-4 py-2">(Salário ÷ 12) × meses × 1,33</td>
                  <td className="border border-gray-300 px-4 py-2">Proporcional ao período aquisitivo</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">13º Proporcional</td>
                  <td className="border border-gray-300 px-4 py-2">(Salário ÷ 12) × meses trabalhados no ano</td>
                  <td className="border border-gray-300 px-4 py-2">Janeiro a dezembro do ano corrente</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Multa FGTS</td>
                  <td className="border border-gray-300 px-4 py-2">40% do saldo do FGTS</td>
                  <td className="border border-gray-300 px-4 py-2">Apenas demissão sem justa causa</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 my-6">
            <h4 className="font-bold text-blue-800 mb-2">💡 Exemplo Prático:</h4>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Situação:</strong> Funcionário com salário de R$ 3.000, demitido sem justa causa após 3 anos 
              de trabalho, no dia 15 do mês.
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Saldo: R$ 1.500 (15 dias)</li>
              <li>• Aviso prévio: R$ 3.900 (39 dias indenizados)</li>
              <li>• Férias proporcionais + 1/3: ~R$ 1.300</li>
              <li>• 13º proporcional: ~R$ 1.250</li>
              <li>• Multa 40% FGTS: depende do saldo</li>
              <li>• <strong>Total estimado: ~R$ 8.000+ (antes de descontos)</strong></li>
            </ul>
          </div>
        </section>

        {/* Tipos de Rescisão */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📋 Tipos de Rescisão e Direitos
          </h3>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-800 mb-2 text-lg">1️⃣ Demissão sem Justa Causa</h4>
              <p className="text-sm text-gray-700 mb-2">
                Quando a empresa demite o funcionário sem motivo grave previsto em lei.
              </p>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-700 mb-1">Direitos:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ Saldo de salário</li>
                  <li>✅ Aviso prévio (trabalhado ou indenizado)</li>
                  <li>✅ Férias vencidas + 1/3</li>
                  <li>✅ Férias proporcionais + 1/3</li>
                  <li>✅ 13º salário proporcional</li>
                  <li>✅ Multa de 40% do FGTS</li>
                  <li>✅ Saque de 100% do FGTS</li>
                  <li>✅ Seguro-desemprego (se cumprir requisitos)</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-5 border-l-4 border-orange-500">
              <h4 className="font-bold text-orange-800 mb-2 text-lg">2️⃣ Pedido de Demissão</h4>
              <p className="text-sm text-gray-700 mb-2">
                Quando o próprio funcionário pede demissão.
              </p>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-700 mb-1">Direitos:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ Saldo de salário</li>
                  <li>✅ Férias vencidas + 1/3</li>
                  <li>✅ Férias proporcionais + 1/3</li>
                  <li>✅ 13º salário proporcional</li>
                  <li>❌ Aviso prévio (deve cumprir 30 dias ou pagar)</li>
                  <li>❌ Multa FGTS</li>
                  <li>❌ Saque do FGTS</li>
                  <li>❌ Seguro-desemprego</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 rounded-xl p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-2 text-lg">3️⃣ Demissão por Justa Causa</h4>
              <p className="text-sm text-gray-700 mb-2">
                Quando o funcionário comete falta grave prevista no Art. 482 da CLT.
              </p>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-700 mb-1">Direitos:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ Saldo de salário</li>
                  <li>✅ Férias vencidas (SEM 1/3)</li>
                  <li>❌ Férias proporcionais</li>
                  <li>❌ 13º salário</li>
                  <li>❌ Aviso prévio</li>
                  <li>❌ Multa FGTS</li>
                  <li>❌ Saque do FGTS</li>
                  <li>❌ Seguro-desemprego</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-5 border-l-4 border-purple-500">
              <h4 className="font-bold text-purple-800 mb-2 text-lg">4️⃣ Acordo Comum (Demissão Consensual)</h4>
              <p className="text-sm text-gray-700 mb-2">
                Modalidade criada pela Reforma Trabalhista (Lei 13.467/2017).
              </p>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-700 mb-1">Direitos:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ Saldo de salário</li>
                  <li>✅ 50% do aviso prévio</li>
                  <li>✅ 50% das férias proporcionais + 1/3</li>
                  <li>✅ Férias vencidas + 1/3 (integral)</li>
                  <li>✅ 13º salário proporcional (integral)</li>
                  <li>✅ Multa de 20% do FGTS</li>
                  <li>✅ Saque de 80% do FGTS</li>
                  <li>❌ Seguro-desemprego</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Erros Comuns */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ⚠️ Erros Comuns ao Calcular Rescisão
          </h3>

          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">❌ Erro 1: Esquecer o aviso prévio progressivo</h4>
              <p className="text-sm text-red-700">
                O aviso prévio não é sempre 30 dias. São 30 dias + 3 dias adicionais por ano trabalhado, 
                podendo chegar a 90 dias no máximo.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">❌ Erro 2: Confundir férias vencidas com proporcionais</h4>
              <p className="text-sm text-red-700">
                Férias vencidas são períodos completos não gozados. Férias proporcionais referem-se ao 
                período aquisitivo incompleto no momento da demissão.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">❌ Erro 3: Não descontar INSS e IRRF</h4>
              <p className="text-sm text-red-700">
                Saldo de salário, aviso prévio e 13º sofrem descontos de INSS e IRRF. Apenas férias e 
                multa do FGTS não têm desconto.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800">❌ Erro 4: Achar que justa causa sempre perde tudo</h4>
              <p className="text-sm text-red-700">
                Mesmo em justa causa, o funcionário tem direito ao saldo de salário e férias vencidas 
                (sem o terço constitucional).
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ❓ Perguntas Frequentes sobre Rescisão
          </h3>

          <div className="space-y-4">
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Qual o prazo para receber a rescisão?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                A empresa tem até <strong>10 dias corridos</strong> após o término do contrato para pagar 
                todas as verbas rescisórias. O atraso gera multa de 1 salário para o empregador.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Posso negociar a rescisão com meu empregador?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Sim. A Reforma Trabalhista de 2017 criou o <strong>acordo comum (demissão consensual)</strong>, 
                onde empregado e empregador entram em acordo. Nesse caso, o trabalhador recebe metade do 
                aviso prévio e metade das férias, além de poder sacar 80% do FGTS com multa de 20%.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Quanto tempo posso receber seguro-desemprego?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Depende do número de vezes que já recebeu e do tempo trabalhado:<br/>
                • <strong>1ª solicitação:</strong> 12-23 meses trabalhados = 4 parcelas; 24+ meses = 5 parcelas<br/>
                • <strong>2ª solicitação:</strong> 9-23 meses = 3 parcelas; 12-23 meses = 4 parcelas; 24+ meses = 5 parcelas<br/>
                • <strong>3ª solicitação em diante:</strong> 6-11 meses = 3 parcelas; 12-23 meses = 4 parcelas; 24+ meses = 5 parcelas
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                O que fazer se a empresa não pagar a rescisão corretamente?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Você pode: 1) Procurar o sindicato da categoria para intermediar; 2) Fazer uma denúncia 
                no Ministério do Trabalho; 3) Entrar com ação trabalhista na Justiça do Trabalho 
                (gratuita se você ganhar até 2 salários mínimos ou contratar sindicato).
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">
                Preciso de homologação no sindicato?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                <strong>Não mais.</strong> A Reforma Trabalhista de 2017 extinguiu a obrigatoriedade de 
                homologação da rescisão no sindicato ou Ministério do Trabalho. Porém, o sindicato pode 
                auxiliar na conferência dos valores se você solicitar.
              </p>
            </details>
          </div>
        </section>

        {/* Termos Importantes */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📖 Termos Importantes sobre Rescisão
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-bold text-red-800">TRCT</h4>
              <p className="text-sm text-gray-700">
                Termo de Rescisão do Contrato de Trabalho. Documento que detalha todas as verbas 
                rescisórias pagas ao funcionário.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-bold text-red-800">Aviso Prévio Progressivo</h4>
              <p className="text-sm text-gray-700">
                30 dias base + 3 dias por ano trabalhado, limitado a 90 dias totais. Lei 12.506/2011.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-bold text-red-800">Período Aquisitivo</h4>
              <p className="text-sm text-gray-700">
                Período de 12 meses de trabalho que dá direito a 30 dias de férias.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-bold text-red-800">Multa FGTS</h4>
              <p className="text-sm text-gray-700">
                40% do saldo do FGTS pago pela empresa ao funcionário em demissão sem justa causa.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-bold text-red-800">Terço Constitucional</h4>
              <p className="text-sm text-gray-700">
                Adicional de 1/3 sobre o valor das férias, garantido pelo Art. 7º, XVII da CF/88.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-bold text-red-800">Homologação</h4>
              <p className="text-sm text-gray-700">
                Conferência dos cálculos rescisórios. Não é mais obrigatória desde a Reforma de 2017.
              </p>
            </div>
          </div>
        </section>

        {/* Legislação */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ⚖️ O Que Diz a Legislação sobre Rescisão
          </h3>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>CLT Art. 477:</strong> Prazo de 10 dias para pagamento da rescisão após o 
                término do contrato. Multa de 1 salário em caso de atraso.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>CLT Art. 478:</strong> Define o aviso prévio de 30 dias. A Lei 12.506/2011 
                incluiu a progressão de 3 dias por ano.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>CLT Art. 482:</strong> Lista as 14 situações que configuram justa causa 
                (desídia, embriaguez, violação de segredo, etc.).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Lei 8.036/90:</strong> Regulamenta o FGTS e a multa de 40% em demissão 
                sem justa causa.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Lei 13.467/2017 (Reforma Trabalhista):</strong> Criou a demissão consensual 
                (acordo comum) e extinguiu a homologação obrigatória.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Lei 7.998/90:</strong> Regulamenta o seguro-desemprego e seus requisitos.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Conclusão */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ✅ Conclusão
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Calcular corretamente a <strong>rescisão trabalhista</strong> é essencial para garantir que 
            você receba todos os valores devidos. Use nossa calculadora gratuita para simular seu caso 
            específico e tenha certeza dos valores antes de assinar o TRCT.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Lembre-se: você tem até <strong>2 anos após a demissão</strong> para questionar valores 
            incorretos na Justiça do Trabalho. Sempre confira os cálculos antes de dar a quitação.
          </p>

          <div className="bg-gradient-to-r from-red-100 to-rose-100 rounded-xl p-6 border border-red-300">
            <p className="text-red-800 font-semibold text-center">
              💡 Dica: Guarde todos os comprovantes de pagamento, recibos e o TRCT assinado. 
              Eles são seus documentos de prova em caso de divergências futuras.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">
            Gostou da calculadora?
          </h3>
          <p className="mb-4 text-red-100">
            Explore nossas outras ferramentas tributárias e trabalhistas gratuitas!
          </p>
          <a 
            href="/" 
            className="inline-block bg-white text-red-700 px-8 py-3 rounded-xl font-bold hover:bg-red-50 transition"
          >
            Ver Todas as Ferramentas →
          </a>
        </section>
      </article>
    </div>
  );
}

export default CalculadoraRescisao;

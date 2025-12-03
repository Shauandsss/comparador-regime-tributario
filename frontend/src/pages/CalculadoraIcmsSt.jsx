import { useState } from 'react';

/**
 * Calculadora de ICMS-ST (Substituição Tributária)
 * Calcula base de cálculo ST, ICMS próprio e ICMS-ST
 */

const CalculadoraIcmsSt = () => {
  const [formData, setFormData] = useState({
    valorProduto: '',
    ipi: '',
    frete: '',
    outrasDespesas: '',
    mva: '',
    aliquotaInterna: '',
    aliquotaInterestadual: '',
    tipoOperacao: 'interna' // 'interna' ou 'interestadual'
  });

  const [resultado, setResultado] = useState(null);

  // Estados brasileiros com alíquotas internas padrão
  const ESTADOS_ALIQUOTAS = [
    { uf: 'AC', nome: 'Acre', aliquota: 17 },
    { uf: 'AL', nome: 'Alagoas', aliquota: 18 },
    { uf: 'AP', nome: 'Amapá', aliquota: 18 },
    { uf: 'AM', nome: 'Amazonas', aliquota: 18 },
    { uf: 'BA', nome: 'Bahia', aliquota: 18 },
    { uf: 'CE', nome: 'Ceará', aliquota: 18 },
    { uf: 'DF', nome: 'Distrito Federal', aliquota: 18 },
    { uf: 'ES', nome: 'Espírito Santo', aliquota: 17 },
    { uf: 'GO', nome: 'Goiás', aliquota: 17 },
    { uf: 'MA', nome: 'Maranhão', aliquota: 18 },
    { uf: 'MT', nome: 'Mato Grosso', aliquota: 17 },
    { uf: 'MS', nome: 'Mato Grosso do Sul', aliquota: 17 },
    { uf: 'MG', nome: 'Minas Gerais', aliquota: 18 },
    { uf: 'PA', nome: 'Pará', aliquota: 17 },
    { uf: 'PB', nome: 'Paraíba', aliquota: 18 },
    { uf: 'PR', nome: 'Paraná', aliquota: 18 },
    { uf: 'PE', nome: 'Pernambuco', aliquota: 18 },
    { uf: 'PI', nome: 'Piauí', aliquota: 18 },
    { uf: 'RJ', nome: 'Rio de Janeiro', aliquota: 18 },
    { uf: 'RN', nome: 'Rio Grande do Norte', aliquota: 18 },
    { uf: 'RS', nome: 'Rio Grande do Sul', aliquota: 18 },
    { uf: 'RO', nome: 'Rondônia', aliquota: 17.5 },
    { uf: 'RR', nome: 'Roraima', aliquota: 17 },
    { uf: 'SC', nome: 'Santa Catarina', aliquota: 17 },
    { uf: 'SP', nome: 'São Paulo', aliquota: 18 },
    { uf: 'SE', nome: 'Sergipe', aliquota: 18 },
    { uf: 'TO', nome: 'Tocantins', aliquota: 18 }
  ];

  // MVAs comuns por tipo de produto (valores de referência)
  const MVAS_REFERENCIA = [
    { categoria: 'Bebidas Alcoólicas', mva: 40 },
    { categoria: 'Refrigerantes', mva: 35 },
    { categoria: 'Combustíveis', mva: 25 },
    { categoria: 'Cigarros', mva: 50 },
    { categoria: 'Produtos de Limpeza', mva: 30 },
    { categoria: 'Produtos Farmacêuticos', mva: 34.51 },
    { categoria: 'Cosméticos e Perfumaria', mva: 35 },
    { categoria: 'Material de Construção', mva: 40 },
    { categoria: 'Autopeças', mva: 41.5 },
    { categoria: 'Pneus', mva: 40 },
    { categoria: 'Tintas e Vernizes', mva: 30 },
    { categoria: 'Lâmpadas', mva: 35 },
    { categoria: 'Pilhas e Baterias', mva: 35 },
    { categoria: 'Ração Animal', mva: 30 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const aplicarMvaReferencia = (mva) => {
    setFormData(prev => ({
      ...prev,
      mva: mva.toString()
    }));
  };

  const aplicarAliquotaEstado = (aliquota) => {
    setFormData(prev => ({
      ...prev,
      aliquotaInterna: aliquota.toString()
    }));
  };

  const limparFormulario = () => {
    setFormData({
      valorProduto: '',
      ipi: '',
      frete: '',
      outrasDespesas: '',
      mva: '',
      aliquotaInterna: '',
      aliquotaInterestadual: '',
      tipoOperacao: 'interna'
    });
    setResultado(null);
  };

  const calcular = () => {
    // Validações
    const valorProduto = parseFloat(formData.valorProduto) || 0;
    const ipi = parseFloat(formData.ipi) || 0;
    const frete = parseFloat(formData.frete) || 0;
    const outrasDespesas = parseFloat(formData.outrasDespesas) || 0;
    const mva = parseFloat(formData.mva) || 0;
    const aliquotaInterna = parseFloat(formData.aliquotaInterna) || 0;
    const aliquotaInterestadual = formData.tipoOperacao === 'interestadual' 
      ? parseFloat(formData.aliquotaInterestadual) || 0 
      : aliquotaInterna;

    if (valorProduto <= 0) {
      alert('Por favor, informe o valor do produto.');
      return;
    }

    if (mva <= 0) {
      alert('Por favor, informe a MVA (Margem de Valor Agregado).');
      return;
    }

    if (aliquotaInterna <= 0) {
      alert('Por favor, informe a alíquota interna do estado.');
      return;
    }

    if (formData.tipoOperacao === 'interestadual' && aliquotaInterestadual <= 0) {
      alert('Por favor, informe a alíquota interestadual.');
      return;
    }

    // 1. Base de Cálculo Normal (para ICMS próprio)
    const baseCalculoNormal = valorProduto + ipi + frete + outrasDespesas;

    // 2. ICMS Próprio (ICMS da operação própria)
    const valorIcmsProprio = baseCalculoNormal * (aliquotaInterestadual / 100);

    // 3. Base de Cálculo ST (aplica MVA)
    const baseCalculoSt = baseCalculoNormal * (1 + mva / 100);

    // 4. ICMS Total (sobre a base ST com alíquota interna)
    const valorIcmsTotal = baseCalculoSt * (aliquotaInterna / 100);

    // 5. ICMS-ST (diferença entre ICMS total e ICMS próprio)
    const valorIcmsSt = valorIcmsTotal - valorIcmsProprio;

    // 6. Valor Total da Nota
    const valorTotalNota = valorProduto + ipi + frete + outrasDespesas + valorIcmsSt;

    // Porcentagem do ICMS-ST sobre o valor do produto
    const percentualSt = (valorIcmsSt / valorProduto) * 100;

    setResultado({
      baseCalculoNormal,
      valorIcmsProprio,
      baseCalculoSt,
      valorIcmsTotal,
      valorIcmsSt,
      valorTotalNota,
      percentualSt,
      // Dados para memória de cálculo
      memoriaCalculo: {
        valorProduto,
        ipi,
        frete,
        outrasDespesas,
        mva,
        aliquotaInterna,
        aliquotaInterestadual,
        tipoOperacao: formData.tipoOperacao
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-lg shadow-lg mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl">🗂️</span>
          <div>
            <h1 className="text-3xl font-bold">Calculadora de ICMS-ST</h1>
            <p className="text-orange-100 mt-2">
              Calcule a Substituição Tributária: Base ST, MVA e ICMS-ST
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="font-semibold mb-1">📦 Base de Cálculo ST</div>
            <div className="text-orange-100">Valor + IPI + Frete + Despesas × (1 + MVA%)</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="font-semibold mb-1">💰 ICMS Próprio</div>
            <div className="text-orange-100">Base × Alíquota Interestadual (ou Interna)</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="font-semibold mb-1">📊 ICMS-ST</div>
            <div className="text-orange-100">(Base ST × Alíquota Interna) - ICMS Próprio</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>📝</span>
              Dados da Operação
            </h2>

            {/* Tipo de Operação */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo de Operação
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'tipoOperacao', value: 'interna' } })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.tipoOperacao === 'interna'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="font-semibold">Operação Interna</div>
                  <div className="text-sm mt-1 text-gray-600">Dentro do mesmo estado</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'tipoOperacao', value: 'interestadual' } })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.tipoOperacao === 'interestadual'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="font-semibold">Operação Interestadual</div>
                  <div className="text-sm mt-1 text-gray-600">Entre estados diferentes</div>
                </button>
              </div>
            </div>

            {/* Valores da Nota */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor do Produto (R$) *
                </label>
                <input
                  type="number"
                  name="valorProduto"
                  value={formData.valorProduto}
                  onChange={handleInputChange}
                  placeholder="Ex: 1000.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IPI (R$)
                  </label>
                  <input
                    type="number"
                    name="ipi"
                    value={formData.ipi}
                    onChange={handleInputChange}
                    placeholder="Ex: 50.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frete (R$)
                  </label>
                  <input
                    type="number"
                    name="frete"
                    value={formData.frete}
                    onChange={handleInputChange}
                    placeholder="Ex: 30.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Outras Despesas (R$)
                  </label>
                  <input
                    type="number"
                    name="outrasDespesas"
                    value={formData.outrasDespesas}
                    onChange={handleInputChange}
                    placeholder="Ex: 20.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* MVA e Alíquotas */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MVA - Margem de Valor Agregado (%) *
                </label>
                <input
                  type="number"
                  name="mva"
                  value={formData.mva}
                  onChange={handleInputChange}
                  placeholder="Ex: 40"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Consulte a tabela de MVA do seu estado para o produto
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alíquota Interna do Estado de Destino (%) *
                  </label>
                  <input
                    type="number"
                    name="aliquotaInterna"
                    value={formData.aliquotaInterna}
                    onChange={handleInputChange}
                    placeholder="Ex: 18"
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {formData.tipoOperacao === 'interestadual' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alíquota Interestadual (%) *
                    </label>
                    <select
                      name="aliquotaInterestadual"
                      value={formData.aliquotaInterestadual}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Selecione</option>
                      <option value="7">7% (Sul/Sudeste → Norte/Nordeste/CO/ES)</option>
                      <option value="12">12% (Sul/Sudeste entre si)</option>
                      <option value="4">4% (Importados)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3">
              <button
                onClick={calcular}
                disabled={!formData.valorProduto || !formData.mva || !formData.aliquotaInterna}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Calcular ICMS-ST
              </button>
              <button
                onClick={limparFormulario}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* Painel Lateral - Referências Rápidas */}
        <div className="space-y-6">
          {/* MVAs de Referência */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📋</span>
              MVAs de Referência
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {MVAS_REFERENCIA.map((item, index) => (
                <button
                  key={index}
                  onClick={() => aplicarMvaReferencia(item.mva)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{item.categoria}</span>
                    <span className="text-orange-600 font-bold">{item.mva}%</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              ⚠️ Valores de referência. Consulte a legislação do seu estado.
            </p>
          </div>

          {/* Alíquotas por Estado */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🗺️</span>
              Alíquotas Internas por UF
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {ESTADOS_ALIQUOTAS.map((estado, index) => (
                <button
                  key={index}
                  onClick={() => aplicarAliquotaEstado(estado.aliquota)}
                  className="w-full text-left p-2 border border-gray-200 rounded hover:border-orange-500 hover:bg-orange-50 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      <span className="font-bold text-gray-700">{estado.uf}</span>
                      <span className="text-gray-600 ml-2">{estado.nome}</span>
                    </span>
                    <span className="text-orange-600 font-bold text-sm">{estado.aliquota}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resultado do Cálculo */}
      {resultado && (
        <div className="mt-8 space-y-6">
          {/* Card Principal com Resultado */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>💰</span>
              Resultado do Cálculo ICMS-ST
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-orange-100 text-sm mb-2">ICMS Próprio</div>
                <div className="text-3xl font-bold">
                  {resultado.valorIcmsProprio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <div className="text-orange-100 text-xs mt-2">
                  ({resultado.memoriaCalculo.aliquotaInterestadual}% sobre R$ {resultado.baseCalculoNormal.toFixed(2)})
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-orange-100 text-sm mb-2">ICMS-ST a Recolher</div>
                <div className="text-4xl font-bold">
                  {resultado.valorIcmsSt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <div className="text-orange-100 text-xs mt-2">
                  ({resultado.percentualSt.toFixed(2)}% sobre o valor do produto)
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-orange-100 text-sm mb-2">Valor Total da Nota</div>
                <div className="text-3xl font-bold">
                  {resultado.valorTotalNota.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <div className="text-orange-100 text-xs mt-2">
                  (Produto + IPI + Frete + Despesas + ST)
                </div>
              </div>
            </div>
          </div>

          {/* Memória de Cálculo Detalhada */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>📊</span>
              Memória de Cálculo Passo a Passo
            </h3>

            <div className="space-y-4">
              {/* Passo 1: Base de Cálculo Normal */}
              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <div className="font-semibold text-gray-800 mb-2">
                  1️⃣ Base de Cálculo Normal (para ICMS próprio)
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Valor do Produto:</span>
                    <span className="font-medium">
                      {resultado.memoriaCalculo.valorProduto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  {resultado.memoriaCalculo.ipi > 0 && (
                    <div className="flex justify-between">
                      <span>(+) IPI:</span>
                      <span className="font-medium">
                        {resultado.memoriaCalculo.ipi.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  )}
                  {resultado.memoriaCalculo.frete > 0 && (
                    <div className="flex justify-between">
                      <span>(+) Frete:</span>
                      <span className="font-medium">
                        {resultado.memoriaCalculo.frete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  )}
                  {resultado.memoriaCalculo.outrasDespesas > 0 && (
                    <div className="flex justify-between">
                      <span>(+) Outras Despesas:</span>
                      <span className="font-medium">
                        {resultado.memoriaCalculo.outrasDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-orange-600 pt-2 border-t">
                    <span>(=) Base de Cálculo Normal:</span>
                    <span>
                      {resultado.baseCalculoNormal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Passo 2: ICMS Próprio */}
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="font-semibold text-gray-800 mb-2">
                  2️⃣ ICMS Próprio (ICMS da operação)
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    Base de Cálculo Normal × Alíquota {resultado.memoriaCalculo.tipoOperacao === 'interestadual' ? 'Interestadual' : 'Interna'}
                  </div>
                  <div className="font-mono bg-gray-50 p-2 rounded">
                    {resultado.baseCalculoNormal.toFixed(2)} × {resultado.memoriaCalculo.aliquotaInterestadual}% = 
                    <span className="font-bold text-blue-600 ml-2">
                      {resultado.valorIcmsProprio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Passo 3: Base de Cálculo ST */}
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <div className="font-semibold text-gray-800 mb-2">
                  3️⃣ Base de Cálculo ST (com MVA)
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    Base Normal × (1 + MVA%)
                  </div>
                  <div className="font-mono bg-gray-50 p-2 rounded">
                    {resultado.baseCalculoNormal.toFixed(2)} × (1 + {resultado.memoriaCalculo.mva}%) = 
                    <span className="font-bold text-purple-600 ml-2">
                      {resultado.baseCalculoSt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    💡 A MVA (Margem de Valor Agregado) de {resultado.memoriaCalculo.mva}% representa o lucro presumido na cadeia
                  </div>
                </div>
              </div>

              {/* Passo 4: ICMS Total */}
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <div className="font-semibold text-gray-800 mb-2">
                  4️⃣ ICMS Total (sobre a base ST)
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    Base de Cálculo ST × Alíquota Interna
                  </div>
                  <div className="font-mono bg-gray-50 p-2 rounded">
                    {resultado.baseCalculoSt.toFixed(2)} × {resultado.memoriaCalculo.aliquotaInterna}% = 
                    <span className="font-bold text-green-600 ml-2">
                      {resultado.valorIcmsTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Passo 5: ICMS-ST (Diferença) */}
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <div className="font-semibold text-gray-800 mb-2">
                  5️⃣ ICMS-ST a Recolher (diferença)
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    ICMS Total - ICMS Próprio
                  </div>
                  <div className="font-mono bg-gray-50 p-2 rounded">
                    {resultado.valorIcmsTotal.toFixed(2)} - {resultado.valorIcmsProprio.toFixed(2)} = 
                    <span className="font-bold text-red-600 ml-2">
                      {resultado.valorIcmsSt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    ⚠️ Este valor deve ser recolhido antecipadamente pelo substituto tributário
                  </div>
                </div>
              </div>

              {/* Resumo Final */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border-2 border-orange-300">
                <div className="font-bold text-gray-800 mb-3 text-center">
                  📋 Composição do Valor Total da Nota
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Valor do Produto:</span>
                    <span className="font-medium">
                      {resultado.memoriaCalculo.valorProduto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  {resultado.memoriaCalculo.ipi > 0 && (
                    <div className="flex justify-between">
                      <span>IPI:</span>
                      <span className="font-medium">
                        {resultado.memoriaCalculo.ipi.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  )}
                  {resultado.memoriaCalculo.frete > 0 && (
                    <div className="flex justify-between">
                      <span>Frete:</span>
                      <span className="font-medium">
                        {resultado.memoriaCalculo.frete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  )}
                  {resultado.memoriaCalculo.outrasDespesas > 0 && (
                    <div className="flex justify-between">
                      <span>Outras Despesas:</span>
                      <span className="font-medium">
                        {resultado.memoriaCalculo.outrasDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-orange-600 font-semibold">
                    <span>ICMS-ST:</span>
                    <span>
                      {resultado.valorIcmsSt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t-2 border-orange-300">
                    <span>Valor Total da Nota:</span>
                    <span className="text-orange-600">
                      {resultado.valorTotalNota.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações Importantes */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span>ℹ️</span>
              Informações Importantes sobre ICMS-ST
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <span className="flex-shrink-0">✓</span>
                <span>
                  <strong>Substituto Tributário:</strong> Recolhe o ICMS antecipadamente (geralmente indústria ou importador)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">✓</span>
                <span>
                  <strong>Substituído:</strong> Recebe a mercadoria com ICMS já recolhido (geralmente varejista)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">✓</span>
                <span>
                  <strong>MVA varia:</strong> Cada estado define MVAs diferentes por tipo de produto (consulte a legislação local)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">✓</span>
                <span>
                  <strong>ICMS-ST na NF-e:</strong> Deve ser destacado separadamente nos campos específicos da nota fiscal eletrônica
                </span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">✓</span>
                <span>
                  <strong>Código CFOP:</strong> Use CFOPs específicos para ST (ex: 5.401, 5.402, 6.401, 6.402)
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Artigo SEO - Guia Completo ICMS-ST */}
      <article className="mt-16 max-w-4xl mx-auto prose prose-lg">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ICMS-ST (Substituição Tributária): O Que É, Como Calcular e Quem Deve Pagar em 2025
          </h2>

          <div className="text-gray-700 space-y-6 leading-relaxed">
            <p className="text-lg">
              O <strong>ICMS-ST (Substituição Tributária)</strong> é um dos regimes tributários mais complexos do Brasil e atinge diretamente 
              indústrias, distribuidores e varejistas. Entender como funciona é essencial para evitar multas, calcular preços corretamente 
              e não perder dinheiro por erro de apuração.
            </p>

            <p>
              Na prática, o ICMS-ST faz com que <strong>uma única empresa da cadeia (geralmente o fabricante ou importador) 
              recolha o imposto de toda a cadeia de vendas antecipadamente</strong>. Isso significa que o varejista que compra 
              um produto com ICMS-ST já tem o imposto pago — mas precisa saber como isso impacta seu preço de venda e margem de lucro.
            </p>

            <p>
              Se você é <strong>indústria, distribuidor, importador ou varejista</strong> que trabalha com produtos sujeitos à substituição tributária, 
              este guia vai esclarecer tudo: desde o conceito até exemplos práticos de cálculo.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              🤔 O Que É Substituição Tributária (ICMS-ST)?
            </h3>

            <p>
              A <strong>Substituição Tributária (ST)</strong> é um regime especial de arrecadação do ICMS no qual a responsabilidade 
              pelo recolhimento do imposto é transferida para <strong>um contribuinte anterior na cadeia de comercialização</strong>.
            </p>

            <p>
              Em vez de cada empresa da cadeia (indústria → distribuidor → varejista → consumidor) calcular e pagar seu próprio ICMS, 
              o governo estabelece que <strong>apenas um contribuinte</strong> (geralmente a indústria) deve calcular e recolher 
              o ICMS de toda a cadeia de uma só vez.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded-r-lg">
              <h4 className="font-bold text-blue-900 mb-3">💡 Como Funciona na Prática?</h4>
              <div className="space-y-3 text-gray-800">
                <p><strong>Sem ST (regime normal):</strong></p>
                <p className="ml-4 text-sm">
                  Indústria vende por R$ 100 → paga 18% ICMS (R$ 18)<br/>
                  Distribuidor vende por R$ 150 → paga 18% sobre lucro<br/>
                  Varejista vende por R$ 200 → paga 18% sobre lucro<br/>
                  <em>Cada um calcula e recolhe seu próprio imposto</em>
                </p>

                <p className="mt-4"><strong>Com ST (substituição tributária):</strong></p>
                <p className="ml-4 text-sm">
                  Indústria vende por R$ 100 → <strong>já paga todo o ICMS da cadeia até o consumidor final</strong><br/>
                  Distribuidor revende sem pagar ICMS (já está pago)<br/>
                  Varejista revende sem pagar ICMS (já está pago)<br/>
                  <em>Apenas a indústria recolheu, mas calculou presumindo preço final de R$ 200 (com MVA)</em>
                </p>
              </div>
            </div>

            <p>
              O Estado presume quanto o produto vai custar no final da cadeia usando a <strong>MVA (Margem de Valor Agregado)</strong>, 
              que é uma espécie de "lucro presumido" aplicado sobre o valor da operação.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              👥 Quem Deve Recolher o ICMS-ST? (Substituto vs Substituído)
            </h3>

            <p>
              No regime de substituição tributária, existem dois papéis principais:
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-5">
                <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                  <span>🏭</span> Substituto Tributário
                </h4>
                <p className="text-gray-800 text-sm mb-3">
                  É quem <strong>recolhe o ICMS-ST</strong> antecipadamente, calculando o imposto de toda a cadeia.
                </p>
                <p className="font-semibold text-orange-900 mb-2">Geralmente são:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                  <li>Indústrias</li>
                  <li>Importadores</li>
                  <li>Atacadistas (em alguns casos)</li>
                  <li>Quem vende produtos na lista de ST</li>
                </ul>
                <p className="text-xs text-gray-600 mt-3 italic">
                  ⚠️ O substituto deve calcular MVA, base ST e recolher ICMS-ST antes de emitir a nota.
                </p>
              </div>

              <div className="bg-green-50 border-2 border-green-400 rounded-lg p-5">
                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <span>🏪</span> Substituído
                </h4>
                <p className="text-gray-800 text-sm mb-3">
                  É quem <strong>recebe a mercadoria com ICMS já pago</strong> e não precisa recolher novamente.
                </p>
                <p className="font-semibold text-green-900 mb-2">Geralmente são:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                  <li>Distribuidores</li>
                  <li>Varejistas</li>
                  <li>Revendedores</li>
                  <li>Quem compra produtos com ST</li>
                </ul>
                <p className="text-xs text-gray-600 mt-3 italic">
                  ✅ O substituído não recolhe ICMS na revenda (já está incluso no preço de compra).
                </p>
              </div>
            </div>

            <p className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <strong>⚠️ Importante:</strong> Se você é varejista e compra produtos com ICMS-ST, 
              <strong> não deve destacar ICMS na revenda</strong>. O imposto já foi pago pelo fornecedor. 
              Use CFOP específico (ex: 5.405, 6.404) e indique "ST" na nota fiscal.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              🧮 Como Calcular o ICMS-ST: Fórmulas e Passo a Passo
            </h3>

            <p>
              O cálculo do ICMS-ST envolve 3 elementos principais:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 my-6">
              <h4 className="font-bold text-gray-900 mb-4">Elementos do Cálculo:</h4>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <strong className="text-gray-900">Base de Cálculo Normal</strong>
                    <p className="text-gray-700 text-sm mt-1">
                      Valor do produto + IPI + Frete + Outras despesas acessórias
                    </p>
                    <div className="font-mono bg-white p-2 rounded mt-2 text-sm border border-gray-300">
                      Base Normal = Valor Produto + IPI + Frete + Despesas
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <strong className="text-gray-900">MVA (Margem de Valor Agregado)</strong>
                    <p className="text-gray-700 text-sm mt-1">
                      Percentual definido por cada estado para cada tipo de produto. Representa o "lucro presumido" da cadeia.
                    </p>
                    <div className="font-mono bg-white p-2 rounded mt-2 text-sm border border-gray-300">
                      Base ST = Base Normal × (1 + MVA%)
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <strong className="text-gray-900">Alíquotas (Interna e Interestadual)</strong>
                    <p className="text-gray-700 text-sm mt-1">
                      <strong>Alíquota Interna:</strong> do estado de destino (17-18%)<br/>
                      <strong>Alíquota Interestadual:</strong> 7% ou 12% (se operação entre estados)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h4 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              📐 Fórmulas Completas do ICMS-ST
            </h4>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-2 border-orange-300 my-6">
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-2">1. Base de Cálculo Normal:</p>
                  <div className="bg-white p-3 rounded-lg border-2 border-orange-200 font-mono text-sm">
                    Base Normal = Valor Produto + IPI + Frete + Outras Despesas
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-2">2. ICMS Próprio (da operação):</p>
                  <div className="bg-white p-3 rounded-lg border-2 border-orange-200 font-mono text-sm">
                    ICMS Próprio = Base Normal × Alíquota Interestadual (ou Interna se dentro do estado)
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-2">3. Base de Cálculo ST (com MVA):</p>
                  <div className="bg-white p-3 rounded-lg border-2 border-orange-200 font-mono text-sm">
                    Base ST = Base Normal × (1 + MVA%)
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-2">4. ICMS Total (sobre base ST):</p>
                  <div className="bg-white p-3 rounded-lg border-2 border-orange-200 font-mono text-sm">
                    ICMS Total = Base ST × Alíquota Interna (do estado de destino)
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-2">5. ICMS-ST a Recolher (diferença):</p>
                  <div className="bg-white p-3 rounded-lg border-2 border-orange-200 font-mono text-sm">
                    ICMS-ST = ICMS Total - ICMS Próprio
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-2">6. Valor Total da Nota:</p>
                  <div className="bg-white p-3 rounded-lg border-2 border-orange-200 font-mono text-sm">
                    Valor Total NF = Produto + IPI + Frete + Despesas + ICMS-ST
                  </div>
                </div>
              </div>
            </div>

            <h4 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              📝 Exemplo Prático 1: Bebida Alcoólica (Operação Interna)
            </h4>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300 my-6">
              <p className="font-semibold mb-3">Situação:</p>
              <ul className="space-y-1 mb-4 text-sm">
                <li>🏭 <strong>Indústria</strong> de bebidas em SP vende para <strong>distribuidor</strong> em SP</li>
                <li>💰 <strong>Valor do produto:</strong> R$ 1.000,00</li>
                <li>🚚 <strong>Frete:</strong> R$ 50,00</li>
                <li>📊 <strong>MVA bebidas SP:</strong> 40%</li>
                <li>📈 <strong>Alíquota interna SP:</strong> 18%</li>
              </ul>

              <p className="font-semibold mb-2">Cálculo Passo a Passo:</p>
              <div className="space-y-2 bg-white p-4 rounded-lg text-sm">
                <p><strong>1. Base Normal:</strong> R$ 1.000 + R$ 50 = <span className="text-blue-700 font-bold">R$ 1.050,00</span></p>
                <p><strong>2. ICMS Próprio:</strong> R$ 1.050 × 18% = <span className="text-blue-700 font-bold">R$ 189,00</span></p>
                <p><strong>3. Base ST:</strong> R$ 1.050 × (1 + 40%) = R$ 1.050 × 1,40 = <span className="text-purple-700 font-bold">R$ 1.470,00</span></p>
                <p><strong>4. ICMS Total:</strong> R$ 1.470 × 18% = <span className="text-green-700 font-bold">R$ 264,60</span></p>
                <p><strong>5. ICMS-ST:</strong> R$ 264,60 - R$ 189,00 = <span className="text-red-700 font-bold">R$ 75,60</span></p>
                <p className="pt-3 border-t-2 border-blue-300 font-bold text-base">
                  <strong>Valor Total NF:</strong> R$ 1.000 + R$ 50 + R$ 75,60 = <span className="text-green-700">R$ 1.125,60</span>
                </p>
              </div>

              <p className="mt-4 text-sm text-gray-700">
                <strong>Interpretação:</strong> A indústria cobra R$ 1.125,60 do distribuidor. 
                O distribuidor <strong>não pagará ICMS</strong> quando revender, pois já está incluso.
              </p>
            </div>

            <h4 className="text-xl font-bold text-gray-900 mt-8 mb-4">
              📝 Exemplo Prático 2: Autopeças (Operação Interestadual)
            </h4>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-300 my-6">
              <p className="font-semibold mb-3">Situação:</p>
              <ul className="space-y-1 mb-4 text-sm">
                <li>🏭 <strong>Importador</strong> em SP vende autopeças para <strong>varejista</strong> em MG</li>
                <li>💰 <strong>Valor do produto:</strong> R$ 2.000,00</li>
                <li>🧾 <strong>IPI:</strong> R$ 200,00</li>
                <li>🚚 <strong>Frete:</strong> R$ 100,00</li>
                <li>📊 <strong>MVA autopeças MG:</strong> 41,5%</li>
                <li>📈 <strong>Alíquota interestadual:</strong> 12% (Sul/Sudeste)</li>
                <li>📈 <strong>Alíquota interna MG:</strong> 18%</li>
              </ul>

              <p className="font-semibold mb-2">Cálculo Passo a Passo:</p>
              <div className="space-y-2 bg-white p-4 rounded-lg text-sm">
                <p><strong>1. Base Normal:</strong> R$ 2.000 + R$ 200 (IPI) + R$ 100 = <span className="text-purple-700 font-bold">R$ 2.300,00</span></p>
                <p><strong>2. ICMS Próprio:</strong> R$ 2.300 × 12% = <span className="text-purple-700 font-bold">R$ 276,00</span></p>
                <p><strong>3. Base ST:</strong> R$ 2.300 × (1 + 41,5%) = R$ 2.300 × 1,415 = <span className="text-purple-700 font-bold">R$ 3.254,50</span></p>
                <p><strong>4. ICMS Total:</strong> R$ 3.254,50 × 18% = <span className="text-green-700 font-bold">R$ 585,81</span></p>
                <p><strong>5. ICMS-ST:</strong> R$ 585,81 - R$ 276,00 = <span className="text-red-700 font-bold">R$ 309,81</span></p>
                <p className="pt-3 border-t-2 border-purple-300 font-bold text-base">
                  <strong>Valor Total NF:</strong> R$ 2.000 + R$ 200 + R$ 100 + R$ 309,81 = <span className="text-green-700">R$ 2.609,81</span>
                </p>
              </div>

              <p className="mt-4 text-sm text-gray-700">
                <strong>Interpretação:</strong> O importador em SP cobra R$ 2.609,81 do varejista em MG. 
                O varejista <strong>não pagará ICMS</strong> ao revender em MG, mas deve usar CFOP de ST (ex: 2.403).
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              📋 Tabela de MVA por Tipo de Produto (Referência)
            </h3>

            <p>
              Cada estado define MVAs diferentes. Aqui estão alguns valores <strong>comuns</strong> (sempre consulte a legislação do estado de destino):
            </p>

            <div className="overflow-x-auto my-6">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border-b">Produto/Segmento</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 border-b">MVA Típica (%)</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border-b">Observações</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Bebidas Alcoólicas</td>
                    <td className="px-4 py-3 text-center font-semibold">40%</td>
                    <td className="px-4 py-3 text-gray-600">Cervejas, vinhos, destilados</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Refrigerantes</td>
                    <td className="px-4 py-3 text-center font-semibold">35%</td>
                    <td className="px-4 py-3 text-gray-600">NCM 2202</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Cigarros</td>
                    <td className="px-4 py-3 text-center font-semibold">50-70%</td>
                    <td className="px-4 py-3 text-gray-600">Varia muito por estado</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Combustíveis</td>
                    <td className="px-4 py-3 text-center font-semibold">25-30%</td>
                    <td className="px-4 py-3 text-gray-600">Gasolina, diesel, etanol</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Produtos Farmacêuticos</td>
                    <td className="px-4 py-3 text-center font-semibold">34,51%</td>
                    <td className="px-4 py-3 text-gray-600">Medicamentos em geral</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Cosméticos e Perfumaria</td>
                    <td className="px-4 py-3 text-center font-semibold">35%</td>
                    <td className="px-4 py-3 text-gray-600">Higiene e beleza</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Autopeças</td>
                    <td className="px-4 py-3 text-center font-semibold">41,5%</td>
                    <td className="px-4 py-3 text-gray-600">Peças de reposição</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Pneus</td>
                    <td className="px-4 py-3 text-center font-semibold">40%</td>
                    <td className="px-4 py-3 text-gray-600">Novos e recauchutados</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Material de Construção</td>
                    <td className="px-4 py-3 text-center font-semibold">30-40%</td>
                    <td className="px-4 py-3 text-gray-600">Cimento, tintas, ferragens</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Produtos de Limpeza</td>
                    <td className="px-4 py-3 text-center font-semibold">30%</td>
                    <td className="px-4 py-3 text-gray-600">Detergentes, sabões</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Lâmpadas</td>
                    <td className="px-4 py-3 text-center font-semibold">35%</td>
                    <td className="px-4 py-3 text-gray-600">LED, fluorescentes</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Pilhas e Baterias</td>
                    <td className="px-4 py-3 text-center font-semibold">35%</td>
                    <td className="px-4 py-3 text-gray-600">Uso geral e automotivas</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3">Ração Animal</td>
                    <td className="px-4 py-3 text-center font-semibold">30%</td>
                    <td className="px-4 py-3 text-gray-600">Pets e gado</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 text-sm">
              <strong>⚠️ Atenção:</strong> Estes valores são <strong>referências gerais</strong>. 
              Cada estado brasileiro tem sua própria tabela de MVA. <strong>Sempre consulte o RICMS (Regulamento do ICMS) 
              do estado de destino</strong> antes de calcular o ICMS-ST para evitar erros e multas.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              🚫 5 Erros Comuns no ICMS-ST (e Como Evitar)
            </h3>

            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <h4 className="font-bold text-red-900 mb-2">1. Usar MVA errada ou desatualizada</h4>
                <p className="text-gray-700 text-sm">
                  <strong>Erro:</strong> Aplicar MVA de outro estado ou valor desatualizado.<br/>
                  <strong>Correto:</strong> Consultar o <strong>RICMS do estado de destino</strong> e usar a MVA específica do produto. 
                  Estados atualizam MVAs periodicamente via decretos.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <h4 className="font-bold text-red-900 mb-2">2. Destacar ICMS na revenda de produto com ST</h4>
                <p className="text-gray-700 text-sm">
                  <strong>Erro:</strong> Varejista recebe mercadoria com ST e destaca ICMS novamente na venda.<br/>
                  <strong>Correto:</strong> <strong>Não destacar ICMS</strong> na revenda de produtos com ST. 
                  Use CFOP específico (ex: 5.405, 6.404) e indique "Valor cobrado por substituição tributária".
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <h4 className="font-bold text-red-900 mb-2">3. Não incluir IPI e frete na base de cálculo</h4>
                <p className="text-gray-700 text-sm">
                  <strong>Erro:</strong> Calcular base ST apenas sobre o valor do produto.<br/>
                  <strong>Correto:</strong> Base ST = <strong>Produto + IPI + Frete + Seguro + Outras Despesas</strong>, 
                  tudo multiplicado por (1 + MVA%).
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <h4 className="font-bold text-red-900 mb-2">4. Usar alíquota errada em operações interestaduais</h4>
                <p className="text-gray-700 text-sm">
                  <strong>Erro:</strong> Usar sempre 18% no ICMS próprio, mesmo em operações entre estados.<br/>
                  <strong>Correto:</strong> Em operações interestaduais, o ICMS próprio deve usar <strong>alíquota interestadual 
                  (7% ou 12%)</strong>, mas o ICMS Total usa a alíquota interna do destino.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <h4 className="font-bold text-red-900 mb-2">5. Esquecer de informar o ICMS-ST na nota fiscal</h4>
                <p className="text-gray-700 text-sm">
                  <strong>Erro:</strong> Calcular e recolher ST, mas não destacar corretamente na NF-e.<br/>
                  <strong>Correto:</strong> Preencher campos específicos da NF-e: <strong>vBCST</strong> (base ST), 
                  <strong>vICMSST</strong> (valor ST), <strong>pICMSST</strong> (alíquota interna) e <strong>pMVAST</strong> (MVA aplicada).
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              ❓ Perguntas Frequentes sobre ICMS-ST
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">1. Quais produtos estão sujeitos à Substituição Tributária?</h4>
                <p className="text-gray-700 text-sm">
                  Cada estado define sua lista de produtos sujeitos à ST. Os mais comuns incluem: <strong>bebidas, cigarros, 
                  combustíveis, autopeças, medicamentos, cosméticos, produtos de limpeza, materiais de construção, 
                  eletroeletrônicos, pneus</strong>. Consulte o <strong>Anexo do RICMS</strong> do estado para a lista completa.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">2. Se eu vender por valor menor que a MVA, posso pedir ressarcimento?</h4>
                <p className="text-gray-700 text-sm">
                  <strong>Sim!</strong> Se você é o <strong>substituído</strong> (varejista) e vendeu o produto por valor 
                  <strong>menor</strong> que a base ST presumida, tem direito ao <strong>ressarcimento da diferença do ICMS-ST</strong>. 
                  Para isso, é necessário comprovar a venda pelo preço menor e solicitar o ressarcimento ao estado via processo administrativo.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">3. O que acontece se eu não recolher o ICMS-ST corretamente?</h4>
                <p className="text-gray-700 text-sm">
                  O substituto (quem deveria recolher) pode sofrer:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 text-sm">
                  <li>Multa de 50% a 100% do valor não recolhido</li>
                  <li>Juros de mora (taxa SELIC)</li>
                  <li>Autuação fiscal</li>
                  <li>Impedimento de emitir certidões negativas</li>
                  <li>Responsabilidade solidária em caso de fraude</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">4. Como saber a MVA de um produto específico?</h4>
                <p className="text-gray-700 text-sm">
                  Consulte o <strong>RICMS (Regulamento do ICMS) do estado de destino</strong>. Geralmente há um 
                  <strong>Anexo específico para MVA</strong> organizado por NCM (Nomenclatura Comum do Mercosul) ou segmento. 
                  Cada Secretaria da Fazenda estadual disponibiliza essas informações no site oficial.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">5. Posso usar CFOP normal em produto com ST?</h4>
                <p className="text-gray-700 text-sm">
                  <strong>Não!</strong> Produtos com substituição tributária têm <strong>CFOPs específicos</strong>:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 text-sm mt-2">
                  <li><strong>5.401 / 6.401:</strong> Venda com ST recolhida pelo remetente (substituto)</li>
                  <li><strong>5.403 / 6.403:</strong> Venda com ST recolhida anteriormente</li>
                  <li><strong>5.405 / 6.404:</strong> Venda de mercadoria adquirida com ST (substituído revende)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">6. Simples Nacional tem tratamento diferente no ICMS-ST?</h4>
                <p className="text-gray-700 text-sm">
                  <strong>Sim, mas depende do papel:</strong> Se a empresa do Simples é <strong>substituída</strong> (recebe produto com ST), 
                  ela não recolhe ICMS na revenda. Se é <strong>substituta</strong> (obrigada a recolher ST), deve calcular e recolher 
                  o ICMS-ST normalmente, mesmo estando no Simples. O ICMS-ST é <strong>obrigação adicional ao DAS</strong>.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              📜 Legislação do ICMS-ST: Base Legal
            </h3>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-4 text-sm">
              <div>
                <strong className="text-blue-900">Lei Complementar 87/1996 (Lei Kandir):</strong>
                <p className="text-gray-700">
                  Estabeleceu as normas gerais do ICMS, incluindo o regime de substituição tributária (Art. 6º ao Art. 10).
                </p>
              </div>
              <div>
                <strong className="text-blue-900">Convênio ICMS 142/2018:</strong>
                <p className="text-gray-700">
                  Define produtos sujeitos à ST e estabelece MVAs para operações interestaduais de forma uniforme entre estados.
                </p>
              </div>
              <div>
                <strong className="text-blue-900">Protocolo ICMS 41/2008:</strong>
                <p className="text-gray-700">
                  Disciplina o regime de substituição tributária em operações com produtos eletrônicos, eletroeletrônicos e eletrodomésticos.
                </p>
              </div>
              <div>
                <strong className="text-blue-900">RICMS de cada estado:</strong>
                <p className="text-gray-700">
                  Cada unidade federativa tem seu próprio <strong>Regulamento do ICMS</strong> que define produtos sujeitos à ST, 
                  MVAs aplicáveis, procedimentos de apuração e obrigações acessórias. <strong>A legislação estadual é soberana</strong> 
                  em operações internas.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              🎯 Conclusão: Domine o ICMS-ST para Evitar Prejuízos
            </h3>

            <p>
              O ICMS-ST é complexo, mas <strong>fundamental para a saúde financeira</strong> de indústrias, distribuidores e varejistas. 
              Calcular errado pode significar:
            </p>

            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Multas pesadas</strong> (50% a 100% do valor devido)</li>
              <li><strong>Prejuízo na margem</strong> (se não repassar corretamente no preço)</li>
              <li><strong>Problemas com fisco</strong> (autuações e impedimento de certidões)</li>
              <li><strong>Perda de competitividade</strong> (preço errado no mercado)</li>
            </ul>

            <p className="mt-6">
              <strong>Checklist do ICMS-ST para não errar:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>✅ Identifique se você é <strong>substituto</strong> (recolhe ST) ou <strong>substituído</strong> (recebe com ST pago)</li>
              <li>✅ Consulte a <strong>MVA correta</strong> no RICMS do estado de destino</li>
              <li>✅ Calcule base ST = (Produto + IPI + Frete + Despesas) × (1 + MVA%)</li>
              <li>✅ Use <strong>alíquota interestadual</strong> para ICMS próprio (se entre estados)</li>
              <li>✅ Use <strong>alíquota interna do destino</strong> para ICMS total sobre base ST</li>
              <li>✅ ICMS-ST = ICMS Total - ICMS Próprio</li>
              <li>✅ Preencha campos de ST na NF-e (vBCST, vICMSST, pMVAST)</li>
              <li>✅ Use <strong>CFOP correto</strong> (5.401, 5.403, 5.405 ou equivalentes interestaduais)</li>
            </ul>

            <div className="bg-gradient-to-r from-orange-600 to-red-700 text-white p-6 rounded-xl mt-8">
              <p className="text-lg font-semibold mb-2">
                💡 Use a calculadora acima para calcular o ICMS-ST com precisão!
              </p>
              <p className="mb-3">
                Informe valor do produto, IPI, frete, MVA e alíquotas. A calculadora mostra:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Base de cálculo normal e ST</li>
                <li>ICMS próprio e ICMS total</li>
                <li>ICMS-ST a recolher (diferença)</li>
                <li>Valor total da nota fiscal</li>
                <li>Memória de cálculo detalhada passo a passo</li>
              </ul>
              <p className="mt-4 font-bold text-xl">
                Evite multas e calcule corretamente! 🎯
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default CalculadoraIcmsSt;

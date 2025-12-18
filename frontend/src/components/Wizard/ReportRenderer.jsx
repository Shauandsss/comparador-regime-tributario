import React from 'react';
import { Link } from 'react-router-dom';
import { ferramentas } from '../../data/ferramentas';

const ReportRenderer = ({ summary, opportunities, config, onExportPdf, onRestart, recommendedToolIds = [] }) => {
  const getPriorityBadge = (priority) => {
    const badges = {
      alta: 'bg-red-100 text-red-800 border-red-200',
      media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      baixa: 'bg-green-100 text-green-800 border-green-200'
    };
    return badges[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      alta: 'Alta Prioridade',
      media: 'Média Prioridade',
      baixa: 'Baixa Prioridade'
    };
    return labels[priority] || priority;
  };

  // Buscar ferramentas recomendadas
  const recommendedTools = ferramentas.filter(tool => 
    recommendedToolIds.includes(tool.id)
  );

  const getToolColor = (cor) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      emerald: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      violet: 'from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700',
      indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      teal: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
    };
    return colors[cor] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {config.meta.title}
            </h1>
            <div className="flex gap-3">
              <button
                onClick={onExportPdf}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar PDF
              </button>
              <button
                onClick={onRestart}
                className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-all"
              >
                Reiniciar
              </button>
            </div>
          </div>
          <p className="text-gray-600">{config.meta.description}</p>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo do Diagnóstico</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {summary.totalOpportunitiesFound}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Oportunidades Identificadas
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-600">
                {summary.highPriority}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Alta Prioridade
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {summary.mediumPriority}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Média Prioridade
              </div>
            </div>
          </div>

          {summary.totalOpportunitiesFound === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Parabéns!
              </h3>
              <p className="text-green-700">
                Não identificamos oportunidades imediatas de economia com base nas informações fornecidas. 
                Sua empresa parece estar bem estruturada!
              </p>
            </div>
          )}
        </div>

        {/* Opportunities Section */}
        {opportunities.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Oportunidades Identificadas
            </h2>
            
            <div className="space-y-6">
              {opportunities.map((opportunity, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 flex-1">
                      {opportunity.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityBadge(opportunity.priority)}`}>
                      {getPriorityLabel(opportunity.priority)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    {opportunity.description}
                  </p>
                  
                  {opportunity.estimatedEconomy && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <span className="text-sm font-semibold text-green-800">
                        Economia estimada: {opportunity.estimatedEconomy}
                      </span>
                    </div>
                  )}
                  
                  {opportunity.action && opportunity.action.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Próximos passos:
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {opportunity.action.map((action, idx) => (
                          <li key={idx} className="text-sm text-gray-600">
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {opportunity.source && opportunity.source.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        Fontes: {opportunity.source.map(s => {
                          const sourceInfo = config.sources[s];
                          return sourceInfo ? sourceInfo.title : s;
                        }).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Tools Section */}
        {recommendedTools.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Ferramentas Recomendadas
                </h2>
                <p className="text-sm text-gray-600">
                  Use estas ferramentas para implementar as oportunidades identificadas
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedTools.slice(0, 8).map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.rota}
                  className={`bg-gradient-to-r ${getToolColor(tool.cor)} text-white rounded-lg p-5 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 group`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl flex-shrink-0">
                      {tool.icone}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-1 group-hover:underline">
                        {tool.nome}
                      </h3>
                      <p className="text-sm text-white/90 line-clamp-2">
                        {tool.descricao}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            {recommendedTools.length > 8 && (
              <div className="mt-4 text-center">
                <Link
                  to="/hub-ferramentas"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ver todas as {recommendedTools.length} ferramentas recomendadas
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Next Steps Section */}
        {opportunities.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Próximos Passos Recomendados
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Priorize as ações de alta prioridade</h4>
                  <p className="text-gray-600 text-sm">
                    Comece pelas oportunidades marcadas como alta prioridade para obter resultados mais rápidos.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Use as ferramentas recomendadas</h4>
                  <p className="text-gray-600 text-sm">
                    Utilize as calculadoras e simuladores indicados para aprofundar a análise de cada oportunidade.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Consulte um profissional</h4>
                  <p className="text-gray-600 text-sm">
                    Compartilhe este relatório com seu contador ou consultor tributário para validação.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Implemente as mudanças</h4>
                  <p className="text-gray-600 text-sm">
                    Execute as ações sugeridas e monitore os resultados ao longo do tempo.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Refaça o diagnóstico periodicamente</h4>
                  <p className="text-gray-600 text-sm">
                    Realize este diagnóstico a cada 6 meses ou quando houver mudanças significativas na empresa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6">
          <p className="text-sm text-yellow-800">
            <strong>Aviso Legal:</strong> {config.meta.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportRenderer;

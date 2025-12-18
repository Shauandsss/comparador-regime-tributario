import React from 'react';
import { useNavigate } from 'react-router-dom';

const JornadaEconomiaHome = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Análise Personalizada',
      description: 'Diagnóstico baseado na realidade do seu negócio'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Oportunidades de Economia',
      description: 'Identifica onde você pode economizar em impostos e custos'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Relatório Completo',
      description: 'Receba um relatório detalhado em PDF para compartilhar'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Ações Práticas',
      description: 'Recomendações claras e passos para implementar melhorias'
    }
  ];

  const diagnosticOptions = [
    {
      id: 'basico',
      title: 'Diagnóstico Rápido',
      subtitle: '~5 minutos',
      description: 'Análise simplificada com as principais perguntas para identificar oportunidades imediatas.',
      icon: (
        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      questions: '16 perguntas',
      color: 'blue',
      path: '/jornada-economia-basica',
      benefits: [
        'Rápido e objetivo',
        'Principais oportunidades',
        'Ideal para começar',
        'Foco em ganhos rápidos'
      ]
    },
    {
      id: 'completo',
      title: 'Diagnóstico Completo',
      subtitle: '~15 minutos',
      description: 'Análise aprofundada com todas as áreas da empresa para máxima precisão.',
      icon: (
        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      questions: '46 perguntas',
      color: 'green',
      path: '/jornada-economia',
      benefits: [
        'Análise completa',
        'Máxima precisão',
        'Todas as oportunidades',
        'Planejamento estratégico'
      ],
      recommended: true
    }
  ];

  const handleStartDiagnostic = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-block mb-4">
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
              100% Gratuito • Sem Cadastro
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Descubra Como Economizar
            <span className="block text-blue-600 mt-2">Impostos e Custos</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Diagnóstico inteligente que identifica oportunidades legais de economia 
            para sua empresa em minutos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Economia de 5% a 35%</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Mais de 1.000 análises</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Diagnostic Options */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Escolha o Tipo de Diagnóstico
            </h2>
            <p className="text-lg text-gray-600">
              Selecione a versão que melhor se adapta ao seu tempo disponível
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {diagnosticOptions.map((option) => (
              <div
                key={option.id}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 ${
                  option.recommended ? 'ring-4 ring-green-400' : ''
                }`}
              >
                {option.recommended && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                    RECOMENDADO
                  </div>
                )}

                <div className={`p-8 bg-gradient-to-br ${
                  option.color === 'blue' 
                    ? 'from-blue-50 to-blue-100' 
                    : 'from-green-50 to-green-100'
                }`}>
                  <div className={`text-${option.color}-600`}>
                    {option.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className={`text-${option.color}-700 font-semibold mb-4`}>
                    {option.subtitle} • {option.questions}
                  </p>
                  <p className="text-gray-700 mb-6">{option.description}</p>
                </div>

                <div className="p-8">
                  <ul className="space-y-3 mb-8">
                    {option.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg
                          className={`w-6 h-6 text-${option.color}-600 flex-shrink-0 mt-0.5`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleStartDiagnostic(option.path)}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl ${
                      option.color === 'blue'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    Iniciar Diagnóstico {option.title.split(' ')[1]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Como Funciona?
          </h2>

          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Responda as perguntas',
                description: 'Compartilhe informações sobre sua empresa de forma simples e rápida'
              },
              {
                step: '2',
                title: 'Análise inteligente',
                description: 'Nosso sistema avalia automaticamente 25+ regras tributárias e de gestão'
              },
              {
                step: '3',
                title: 'Receba o diagnóstico',
                description: 'Veja oportunidades de economia priorizadas por impacto'
              },
              {
                step: '4',
                title: 'Implemente as ações',
                description: 'Siga os passos recomendados e consulte seu contador'
              }
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-6 items-start bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto Para Economizar?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Comece agora mesmo e descubra oportunidades que você não sabia que existiam
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleStartDiagnostic('/jornada-economia')}
                className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
              >
                Diagnóstico Completo
              </button>
              <button
                onClick={() => handleStartDiagnostic('/jornada-economia-basica')}
                className="px-8 py-4 bg-blue-500 text-white font-bold text-lg rounded-xl hover:bg-blue-400 transition-all border-2 border-white"
              >
                Diagnóstico Rápido
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6">
            <p className="text-sm text-yellow-800">
              <strong>Aviso Legal:</strong> Este diagnóstico é educativo e não substitui 
              a análise de um contador ou consultor tributário. As recomendações devem 
              ser validadas por profissionais qualificados antes da implementação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JornadaEconomiaHome;

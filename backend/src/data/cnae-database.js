/**
 * Banco de dados local de CNAEs com anexos do Simples Nacional
 * Baseado na LC 123/2006 e resoluções CGSN
 * 
 * Estrutura:
 * - codigo: Código CNAE (7 dígitos)
 * - descricao: Descrição da atividade
 * - anexo: Anexo principal do Simples Nacional (I a V)
 * - anexoAlternativo: Anexo alternativo quando aplicável fator R
 * - fatorR: Se a atividade está sujeita ao fator R
 * - percentualPresuncao: Percentual de presunção para Lucro Presumido
 * - aliquotaISS: Alíquota de ISS quando aplicável (2% a 5%)
 * - riscos: Lista de riscos e observações importantes
 * - impedimentos: Se há impedimento para Simples Nacional
 */

export const cnaeDatabase = [
  // === COMÉRCIO - ANEXO I ===
  {
    codigo: "4711301",
    descricao: "Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - hipermercados",
    anexo: "I",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: ["Substituição tributária de ICMS pode impactar margem"],
    impedimentos: false
  },
  {
    codigo: "4711302",
    descricao: "Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - supermercados",
    anexo: "I",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: ["Substituição tributária de ICMS pode impactar margem"],
    impedimentos: false
  },
  {
    codigo: "4712100",
    descricao: "Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - minimercados, mercearias e armazéns",
    anexo: "I",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "4751201",
    descricao: "Comércio varejista especializado de equipamentos e suprimentos de informática",
    anexo: "I",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: ["Produtos com ST podem reduzir competitividade"],
    impedimentos: false
  },
  {
    codigo: "4753900",
    descricao: "Comércio varejista especializado de eletrodomésticos e equipamentos de áudio e vídeo",
    anexo: "I",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "4755503",
    descricao: "Comércio varejista de artigos de cama, mesa e banho",
    anexo: "I",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "4761003",
    descricao: "Comércio varejista de artigos de papelaria",
    anexo: "I",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "4781400",
    descricao: "Comércio varejista de artigos do vestuário e acessórios",
    anexo: "I",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "4782201",
    descricao: "Comércio varejista de calçados",
    anexo: "I",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "4789099",
    descricao: "Comércio varejista de outros produtos não especificados anteriormente",
    anexo: "I",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: [],
    impedimentos: false
  },

  // === INDÚSTRIA - ANEXO II ===
  {
    codigo: "1011201",
    descricao: "Frigorífico - abate de bovinos",
    anexo: "II",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: ["Exigências sanitárias rigorosas", "Alto custo de conformidade"],
    impedimentos: false
  },
  {
    codigo: "1091100",
    descricao: "Fabricação de produtos de panificação",
    anexo: "II",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "1412601",
    descricao: "Confecção de peças de vestuário, exceto roupas íntimas e as confeccionadas sob medida",
    anexo: "II",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "2542000",
    descricao: "Fabricação de artigos de serralheria, exceto esquadrias",
    anexo: "II",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "3101200",
    descricao: "Fabricação de móveis com predominância de madeira",
    anexo: "II",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: [],
    impedimentos: false
  },

  // === SERVIÇOS ANEXO III (sem fator R) ===
  {
    codigo: "5611201",
    descricao: "Restaurantes e similares",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "5611203",
    descricao: "Lanchonetes, casas de chá, de sucos e similares",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "5620104",
    descricao: "Fornecimento de alimentos preparados preponderantemente para consumo domiciliar",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "9602501",
    descricao: "Cabeleireiros, manicure e pedicure",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "9602502",
    descricao: "Atividades de estética e outros serviços de cuidados com a beleza",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "9609299",
    descricao: "Outras atividades de serviços pessoais não especificadas anteriormente",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "5510801",
    descricao: "Hotéis",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "7911200",
    descricao: "Agências de viagens",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "8599604",
    descricao: "Treinamento em desenvolvimento profissional e gerencial",
    anexo: "III",
    anexoAlternativo: "V",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Fator R pode migrar para Anexo V se folha < 28%"],
    impedimentos: false
  },

  // === SERVIÇOS ANEXO IV (construção, vigilância) ===
  {
    codigo: "4120400",
    descricao: "Construção de edifícios",
    anexo: "IV",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["CPP não incluída no DAS - recolhimento separado"],
    impedimentos: false
  },
  {
    codigo: "4211101",
    descricao: "Construção de rodovias e ferrovias",
    anexo: "IV",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["CPP não incluída no DAS - recolhimento separado"],
    impedimentos: false
  },
  {
    codigo: "4399103",
    descricao: "Obras de alvenaria",
    anexo: "IV",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["CPP não incluída no DAS - recolhimento separado"],
    impedimentos: false
  },
  {
    codigo: "8011101",
    descricao: "Atividades de vigilância e segurança privada",
    anexo: "IV",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["CPP não incluída no DAS", "Exige autorização PF"],
    impedimentos: false
  },
  {
    codigo: "7820500",
    descricao: "Locação de mão-de-obra temporária",
    anexo: "IV",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["CPP não incluída no DAS - recolhimento separado"],
    impedimentos: false
  },
  {
    codigo: "8121400",
    descricao: "Limpeza em prédios e em domicílios",
    anexo: "IV",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["CPP não incluída no DAS - recolhimento separado"],
    impedimentos: false
  },

  // === SERVIÇOS ANEXO V (sujeitos ao fator R) ===
  {
    codigo: "6201501",
    descricao: "Desenvolvimento de programas de computador sob encomenda",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "6201502",
    descricao: "Web design",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "6202300",
    descricao: "Desenvolvimento e licenciamento de programas de computador customizáveis",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "6203100",
    descricao: "Desenvolvimento e licenciamento de programas de computador não-customizáveis",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "6204000",
    descricao: "Consultoria em tecnologia da informação",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "6209100",
    descricao: "Suporte técnico, manutenção e outros serviços em tecnologia da informação",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "6311900",
    descricao: "Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na internet",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "6319400",
    descricao: "Portais, provedores de conteúdo e outros serviços de informação na internet",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "6920601",
    descricao: "Atividades de contabilidade",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "6920602",
    descricao: "Atividades de consultoria e auditoria contábil e tributária",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "7020400",
    descricao: "Atividades de consultoria em gestão empresarial",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "7111100",
    descricao: "Serviços de arquitetura",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "7112000",
    descricao: "Serviços de engenharia",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "7119701",
    descricao: "Serviços de cartografia, topografia e geodésia",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "7119702",
    descricao: "Atividades de estudos geológicos",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "7120100",
    descricao: "Testes e análises técnicas",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "7311400",
    descricao: "Agências de publicidade",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "7312200",
    descricao: "Agenciamento de espaços para publicidade, exceto em veículos de comunicação",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "7319002",
    descricao: "Promoção de vendas",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "7319099",
    descricao: "Outras atividades de publicidade não especificadas anteriormente",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "7410202",
    descricao: "Design de interiores",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "7410203",
    descricao: "Design de produto",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "7420001",
    descricao: "Atividades de produção de fotografias, exceto aérea e submarina",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "7490101",
    descricao: "Serviços de tradução, interpretação e similares",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8219901",
    descricao: "Fotocópias",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8511200",
    descricao: "Educação infantil - creche",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8512100",
    descricao: "Educação infantil - pré-escola",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8513900",
    descricao: "Ensino fundamental",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8520100",
    descricao: "Ensino médio",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8531700",
    descricao: "Educação superior - graduação",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8599601",
    descricao: "Formação de condutores",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8599602",
    descricao: "Cursos de pilotagem",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8599603",
    descricao: "Treinamento em informática",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8599605",
    descricao: "Cursos preparatórios para concursos",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8650002",
    descricao: "Atividades de profissionais da nutrição",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8650003",
    descricao: "Atividades de psicologia e psicanálise",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8650004",
    descricao: "Atividades de fisioterapia",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8650005",
    descricao: "Atividades de terapia ocupacional",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8650006",
    descricao: "Atividades de fonoaudiologia",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },

  // === ATIVIDADES IMPEDIDAS AO SIMPLES ===
  {
    codigo: "6411900",
    descricao: "Banco Central",
    anexo: null,
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: null,
    riscos: ["Atividade vedada ao Simples Nacional"],
    impedimentos: true
  },
  {
    codigo: "6421200",
    descricao: "Bancos comerciais",
    anexo: null,
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: null,
    riscos: ["Atividade vedada ao Simples Nacional"],
    impedimentos: true
  },
  {
    codigo: "6422100",
    descricao: "Bancos múltiplos, com carteira comercial",
    anexo: null,
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: null,
    riscos: ["Atividade vedada ao Simples Nacional"],
    impedimentos: true
  },
  {
    codigo: "6431000",
    descricao: "Bancos de investimento",
    anexo: null,
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: null,
    riscos: ["Atividade vedada ao Simples Nacional"],
    impedimentos: true
  },
  {
    codigo: "6511101",
    descricao: "Seguros de vida",
    anexo: null,
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: null,
    riscos: ["Atividade vedada ao Simples Nacional"],
    impedimentos: true
  },
  {
    codigo: "6810201",
    descricao: "Compra e venda de imóveis próprios",
    anexo: null,
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: ["Atividade vedada ao Simples Nacional - imobiliária própria"],
    impedimentos: true
  },
  {
    codigo: "6810202",
    descricao: "Aluguel de imóveis próprios",
    anexo: null,
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: null,
    riscos: ["Atividade vedada ao Simples Nacional - locação própria"],
    impedimentos: true
  },

  // === ATIVIDADES DE SAÚDE ===
  {
    codigo: "8610101",
    descricao: "Atividades de atendimento hospitalar, exceto pronto-socorro e unidades para atendimento a urgências",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 8,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8630501",
    descricao: "Atividade médica ambulatorial com recursos para realização de procedimentos cirúrgicos",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8630502",
    descricao: "Atividade médica ambulatorial com recursos para realização de exames complementares",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8630503",
    descricao: "Atividade médica ambulatorial restrita a consultas",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8630504",
    descricao: "Atividade odontológica",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8640202",
    descricao: "Laboratórios clínicos",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8640205",
    descricao: "Serviços de diagnóstico por imagem com uso de radiação ionizante, exceto tomografia",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8690901",
    descricao: "Atividades de práticas integrativas e complementares em saúde humana",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "8690903",
    descricao: "Atividades de acupuntura",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },

  // === TRANSPORTE ===
  {
    codigo: "4930201",
    descricao: "Transporte rodoviário de carga, exceto produtos perigosos e mudanças, municipal",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: ["ICMS sobre frete em operações interestaduais"],
    impedimentos: false
  },
  {
    codigo: "4930202",
    descricao: "Transporte rodoviário de carga, exceto produtos perigosos e mudanças, intermunicipal, interestadual e internacional",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: ["ICMS sobre frete em operações interestaduais"],
    impedimentos: false
  },
  {
    codigo: "4921301",
    descricao: "Transporte rodoviário coletivo de passageiros, com itinerário fixo, municipal",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 16,
    aliquotaISS: null,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "4923002",
    descricao: "Serviço de transporte de passageiros - locação de automóveis com motorista",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 16,
    aliquotaISS: null,
    riscos: [],
    impedimentos: false
  },

  // === ADVOCACIA (vedada ao Simples até 2014, permitida após LC 147/2014) ===
  {
    codigo: "6911701",
    descricao: "Serviços advocatícios",
    anexo: "IV",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["CPP não incluída no DAS - recolhimento separado", "Honorários advocatícios de sucumbência têm tratamento especial"],
    impedimentos: false
  },
  {
    codigo: "6911702",
    descricao: "Atividades auxiliares da justiça",
    anexo: "IV",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["CPP não incluída no DAS - recolhimento separado"],
    impedimentos: false
  },
  {
    codigo: "6911703",
    descricao: "Agente de propriedade industrial",
    anexo: "IV",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["CPP não incluída no DAS - recolhimento separado"],
    impedimentos: false
  },

  // === CORRETAGEM ===
  {
    codigo: "6622300",
    descricao: "Corretores e agentes de seguros, de planos de previdência complementar e de saúde",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "6821801",
    descricao: "Corretagem na compra e venda e avaliação de imóveis",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "6821802",
    descricao: "Corretagem no aluguel de imóveis",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },

  // === REPRESENTAÇÃO COMERCIAL ===
  {
    codigo: "4612500",
    descricao: "Representantes comerciais e agentes do comércio de combustíveis, minerais, siderúrgicos e químicos",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "4613300",
    descricao: "Representantes comerciais e agentes do comércio de madeira, material de construção e ferragens",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "4614100",
    descricao: "Representantes comerciais e agentes do comércio de máquinas, equipamentos, embarcações e aeronaves",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "4618401",
    descricao: "Representantes comerciais e agentes do comércio de medicamentos, cosméticos e produtos de perfumaria",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },

  // === MANUTENÇÃO E REPARAÇÃO ===
  {
    codigo: "4520001",
    descricao: "Serviços de manutenção e reparação mecânica de veículos automotores",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "4520002",
    descricao: "Serviços de lanternagem ou funilaria e pintura de veículos automotores",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "4520003",
    descricao: "Serviços de manutenção e reparação elétrica de veículos automotores",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "9521500",
    descricao: "Reparação e manutenção de equipamentos eletroeletrônicos de uso pessoal e doméstico",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "9529101",
    descricao: "Reparação de calçados, bolsas e artigos de viagem",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "9529105",
    descricao: "Reparação de artigos do mobiliário",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },

  // === ACADEMIAS E ESPORTE ===
  {
    codigo: "9311500",
    descricao: "Gestão de instalações de esportes",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "9313100",
    descricao: "Atividades de condicionamento físico",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "9319101",
    descricao: "Produção e promoção de eventos esportivos",
    anexo: "III",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: [],
    impedimentos: false
  },

  // === FARMÁCIAS ===
  {
    codigo: "4771701",
    descricao: "Comércio varejista de produtos farmacêuticos, sem manipulação de fórmulas",
    anexo: "I",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: ["Medicamentos com ST podem reduzir margem"],
    impedimentos: false
  },
  {
    codigo: "4771702",
    descricao: "Comércio varejista de produtos farmacêuticos, com manipulação de fórmulas",
    anexo: "II",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: ["Atividade mista: comércio + manipulação"],
    impedimentos: false
  },

  // === VETERINÁRIA ===
  {
    codigo: "7500100",
    descricao: "Atividades veterinárias",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },

  // === MARKETING DIGITAL / INFLUENCER ===
  {
    codigo: "7319004",
    descricao: "Consultoria em publicidade",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },
  {
    codigo: "5912099",
    descricao: "Atividades de pós-produção cinematográfica, de vídeos e de programas de televisão não especificadas anteriormente",
    anexo: "V",
    anexoAlternativo: "III",
    fatorR: true,
    percentualPresuncao: 32,
    aliquotaISS: 5,
    riscos: ["Se fator R >= 28%, migra para Anexo III (mais barato)"],
    impedimentos: false
  },

  // === E-COMMERCE ===
  {
    codigo: "4789001",
    descricao: "Comércio varejista de suvenires, bijuterias e artesanatos",
    anexo: "I",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: [],
    impedimentos: false
  },
  {
    codigo: "4757100",
    descricao: "Comércio varejista especializado de peças e acessórios para aparelhos eletroeletrônicos para uso doméstico",
    anexo: "I",
    anexoAlternativo: null,
    fatorR: false,
    percentualPresuncao: 8,
    aliquotaISS: null,
    riscos: [],
    impedimentos: false
  }
];

/**
 * Busca CNAE por código exato
 * @param {string} codigo - Código CNAE (7 dígitos)
 * @returns {object|null} - Dados do CNAE ou null
 */
export function buscarCnaePorCodigo(codigo) {
  const codigoNormalizado = codigo.replace(/[.-]/g, '').trim();
  return cnaeDatabase.find(cnae => cnae.codigo === codigoNormalizado) || null;
}

/**
 * Busca CNAEs por texto (código ou descrição)
 * @param {string} termo - Termo de busca
 * @param {number} limite - Limite de resultados (default: 20)
 * @returns {array} - Lista de CNAEs encontrados
 */
export function buscarCnaes(termo, limite = 20) {
  const termoNormalizado = termo.toLowerCase().replace(/[.-]/g, '').trim();
  
  if (!termoNormalizado) {
    return [];
  }

  const resultados = cnaeDatabase.filter(cnae => {
    const codigoMatch = cnae.codigo.includes(termoNormalizado);
    const descricaoMatch = cnae.descricao.toLowerCase().includes(termoNormalizado);
    return codigoMatch || descricaoMatch;
  });

  return resultados.slice(0, limite);
}

/**
 * Lista todos os CNAEs de um anexo específico
 * @param {string} anexo - Anexo (I, II, III, IV, V)
 * @returns {array} - Lista de CNAEs do anexo
 */
export function listarCnaesPorAnexo(anexo) {
  return cnaeDatabase.filter(cnae => cnae.anexo === anexo);
}

/**
 * Lista CNAEs sujeitos ao fator R
 * @returns {array} - Lista de CNAEs com fator R
 */
export function listarCnaesComFatorR() {
  return cnaeDatabase.filter(cnae => cnae.fatorR === true);
}

/**
 * Lista CNAEs impedidos ao Simples Nacional
 * @returns {array} - Lista de CNAEs impedidos
 */
export function listarCnaesImpedidos() {
  return cnaeDatabase.filter(cnae => cnae.impedimentos === true);
}

export default cnaeDatabase;

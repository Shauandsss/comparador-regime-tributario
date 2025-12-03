import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIAS_BLOG = [
  { id: 'economia', nome: 'Economia Tributária', emoji: '💰', cor: 'green' },
  { id: 'simples', nome: 'Simples Nacional', emoji: '🟢', cor: 'emerald' },
  { id: 'planejamento', nome: 'Planejamento', emoji: '🎯', cor: 'blue' },
  { id: 'dicas', nome: 'Dicas Práticas', emoji: '💡', cor: 'yellow' },
  { id: 'erros', nome: 'Erros Comuns', emoji: '⚠️', cor: 'red' },
  { id: 'novidades', nome: 'Novidades', emoji: '📰', cor: 'purple' }
];

const ARTIGOS = [
  {
    id: 1,
    titulo: '10 Formas Legais de Economizar Impostos em 2025',
    categoria: 'economia',
    resumo: 'Estratégias comprovadas para reduzir sua carga tributária de forma 100% legal',
    dataPublicacao: '2025-01-15',
    tempoLeitura: '8 min',
    conteudo: `
**Reduza sua carga tributária de forma inteligente e legal**

O planejamento tributário é uma das ferramentas mais poderosas para aumentar a lucratividade da sua empresa. Veja 10 estratégias comprovadas:

**1. Escolha o Regime Tributário Correto**
Muitas empresas pagam impostos em excesso por estarem no regime errado. Simule anualmente se o Simples, Presumido ou Real é mais vantajoso. Uma mudança pode economizar de 20% a 40% em impostos.

**2. Distribua Lucros em Vez de Aumentar Pró-Labore**
Lucros distribuídos são ISENTOS de IR, enquanto pró-labore paga INSS (31%) e IRPF (até 27,5%). Exemplo: R$ 10 mil em lucros = R$ 0 de impostos. R$ 10 mil em pró-labore = R$ 5.850 de impostos!

**3. Aproveite Créditos de PIS/COFINS no Lucro Real**
No regime não-cumulativo, desconte 9,25% sobre insumos, energia, aluguéis, fretes. Uma indústria pode recuperar R$ 50 mil/ano ou mais em créditos.

**4. Mantenha Folha Adequada para Fator R ≥28%**
Prestadores de serviços no Simples com Fator R abaixo de 28% pagam muito mais (Anexo V). Ajuste a folha para manter o Fator R em 28-32% e economize até 15% em tributos.

**5. Planeje Investimentos com Depreciação Acelerada**
No Lucro Real, deprecie equipamentos e veículos para reduzir o lucro tributável. Um caminhão de R$ 200 mil pode gerar economia de R$ 68 mil em impostos ao longo de 5 anos.

**6. Use Sociedade em Conta de Participação (SCP)**
Para projetos específicos, a SCP permite tributação separada e pode ser vantajosa fiscalmente. Consulte um contador especializado.

**7. Aproveite Incentivos Fiscais Regionais**
Zonas de incentivo (Manaus, Nordeste) oferecem ICMS reduzido ou isento. Algumas empresas economizam 10-18% só com isso.

**8. Compense Prejuízos Fiscais**
No Lucro Real, prejuízos de anos anteriores podem ser compensados (até 30% do lucro anual). Não deixe esse benefício expirar!

**9. Revise Classificações Fiscais (NCM, CFOP, CST)**
Classificações erradas podem fazer você pagar mais impostos. Audite suas notas fiscais anualmente.

**10. Antecipe ou Postergue Receitas/Despesas**
Perto do fim do ano, analise se vale adiar faturamento para o ano seguinte ou antecipar despesas para reduzir lucro tributável.

**IMPORTANTE:** Todas essas estratégias são LEGAIS (elisão fiscal). Nunca sonegue impostos! Consulte sempre um contador especializado antes de implementar.

**Próximos Passos:**
- Use nosso Comparador para simular diferentes cenários
- Calcule o Fator R da sua empresa
- Agende revisão tributária com seu contador
    `,
    tags: ['economia', 'planejamento', 'lucros', 'créditos']
  },
  {
    id: 2,
    titulo: 'Guia Completo de Créditos PIS/COFINS no Lucro Real',
    categoria: 'economia',
    resumo: 'Como aproveitar ao máximo os créditos tributários no regime não-cumulativo',
    dataPublicacao: '2025-01-10',
    tempoLeitura: '10 min',
    conteudo: `
**Recupere até 9,25% dos seus custos operacionais**

O regime não-cumulativo de PIS/COFINS é um dos maiores benefícios do Lucro Real, mas muitas empresas não aproveitam todos os créditos disponíveis.

**Como Funciona?**
- Débito: 9,25% sobre receitas (1,65% PIS + 7,6% COFINS)
- Crédito: 9,25% sobre despesas e custos permitidos
- A pagar: Débito - Crédito

**Principais Itens que Geram Crédito:**

**1. Aquisição de Insumos (Lei 10.833/2003)**
Matérias-primas, produtos intermediários e materiais de embalagem usados na produção ou prestação de serviços.
Exemplo: Indústria compra R$ 100 mil em matéria-prima → Crédito de R$ 9.250

**2. Energia Elétrica**
Energia consumida no processo produtivo ou em estabelecimentos da pessoa jurídica.
Exemplo: Conta de luz de R$ 10 mil/mês → Crédito de R$ 925/mês = R$ 11.100/ano

**3. Aluguéis de Prédios, Máquinas e Equipamentos**
Pagos a pessoa jurídica, usados nas atividades da empresa.
Exemplo: Aluguel de R$ 15 mil/mês → Crédito de R$ 1.387,50/mês = R$ 16.650/ano

**4. Armazenagem e Frete**
Serviços de transporte e armazenagem de mercadorias e insumos.
Exemplo: Fretes de R$ 5 mil/mês → Crédito de R$ 462,50/mês = R$ 5.550/ano

**5. Depreciação de Máquinas e Equipamentos**
Depreciação fiscal de bens usados na produção.
Exemplo: Equipamento de R$ 200 mil (depreciação 10 anos) → Crédito de R$ 1.850/ano

**6. Edificações e Benfeitorias**
Depreciação de imóveis próprios usados na atividade.

**Cuidados Importantes:**

❌ **NÃO geram crédito:**
- Despesas administrativas genéricas
- Mão de obra (salários, pró-labore)
- Serviços de pessoas físicas
- Compras de revenda (comércio)

✅ **Documentação obrigatória:**
- Notas fiscais válidas
- Comprovante de pagamento
- Relação clara com atividade
- Escrituração na EFD-Contribuições

**Exemplo Real - Indústria de Alimentos:**

Receita mensal: R$ 500.000
Débito PIS/COFINS: R$ 46.250

Créditos:
- Matéria-prima: R$ 150.000 → R$ 13.875
- Energia: R$ 12.000 → R$ 1.110
- Aluguel galpão: R$ 8.000 → R$ 740
- Frete: R$ 6.000 → R$ 555
- Depreciação: R$ 3.000 → R$ 277,50
**Total créditos: R$ 16.557,50**

**PIS/COFINS a pagar:**
R$ 46.250 - R$ 16.557,50 = **R$ 29.692,50**

**Economia: 35,8% nos tributos!**

**Erros Comuns:**
1. Não escriturar créditos por desconhecimento
2. Documentação inadequada
3. Classificação errada de insumos
4. Não aproveitar depreciação
5. Esquecer energia e aluguéis

**Próximos Passos:**
- Use nosso Simulador de Créditos PIS/COFINS
- Faça auditoria dos últimos 5 anos (pode recuperar créditos não aproveitados)
- Capacite sua equipe contábil
- Revise classificações fiscais


    `,
    tags: ['créditos', 'PIS', 'COFINS', 'lucro real', 'economia']
  },
  {
    id: 3,
    titulo: '7 Erros Fatais que Empresas do Simples Cometem',
    categoria: 'erros',
    resumo: 'Evite armadilhas que podem custar caro e até excluir sua empresa do regime',
    dataPublicacao: '2025-01-05',
    tempoLeitura: '6 min',
    conteudo: `
**Atenção: Esses erros podem custar MUITO dinheiro**

O Simples Nacional é vantajoso, mas tem regras rígidas. Veja erros comuns que podem gerar multas ou exclusão do regime:

**1. Ignorar o Fator R (Erro mais caro!)**

❌ **Erro:** Prestador de serviços deixa Fator R cair abaixo de 28%
💰 **Impacto:** Mudança do Anexo III para V = aumento de até 50% nos impostos!

**Exemplo Real:**
Empresa fatura R$ 50 mil/mês (R$ 600k/ano)
- Anexo III (Fator R ≥28%): DAS de ~R$ 6.500/mês
- Anexo V (Fator R <28%): DAS de ~R$ 9.500/mês
**Diferença: R$ 36 mil/ano jogados fora!**

✅ **Solução:** Mantenha folha + pró-labore em 28-32% da receita. Ajuste mensalmente.

**2. Ultrapassar o Limite Sem Perceber**

❌ **Erro:** Não monitorar receita acumulada (RBT12)
💰 **Impacto:** Exclusão retroativa + multa + juros sobre diferença de impostos

**Exemplo:** Ultrapassou em 20% (R$ 960 mil de faturamento)
- Exclusão retroativa ao início do ano
- Recálculo de todos os tributos no Presumido
- Multa de 150% + juros SELIC
**Prejuízo: R$ 80-120 mil**

✅ **Solução:** Monitore RBT12 mensalmente. Use nossa Calculadora de Desenquadramento.

**3. Classificar Errado a Atividade (CNAE x Anexo)**

❌ **Erro:** CNAE errado leva ao anexo errado
💰 **Impacto:** Pagar alíquotas maiores ou enquadrar-se em anexo vedado

**Exemplo:** Consultoría de TI com CNAE genérico
- Enquadramento no Anexo V (alíquota alta)
- Deveria estar no Anexo III com CNAE correto
**Diferença: 30-40% a mais em impostos**

✅ **Solução:** Revise CNAEs com contador. Verifique enquadramento anual.

**4. Não Segregar Receitas de ISS e ICMS**

❌ **Erro:** Misturar vendas (ICMS) com serviços (ISS) no mesmo DAS
💰 **Impacto:** Pagamento incorreto, multa da Receita ou município

✅ **Solução:** Separe receitas por tipo no PGDAS-D mensalmente.

**5. Atrasar ou Não Pagar o DAS**

❌ **Erro:** Atraso frequente no pagamento do DAS
💰 **Impacto:** Multa de 0,33%/dia + juros + exclusão do Simples após 3 meses consecutivos ou 6 alternados

**Cálculo da multa:**
DAS de R$ 5 mil atrasado 60 dias = R$ 5 mil × 20% multa + juros SELIC (1,5%/mês)
**Total: ~R$ 6.150 (23% a mais!)**

✅ **Solução:** Configure débito automático. Parcele débitos antes da exclusão.

**6. Emitir Notas Fiscais Incorretamente**

❌ **Erro:** Não informar "Documento emitido por ME/EPP optante pelo Simples Nacional"
💰 **Impacto:** Cliente não reconhece como Simples, exige retenção de impostos (bitributação!)

**Exemplo:** NF de R$ 10 mil sem identificação do Simples
- Cliente retém 11,51% (PIS/COFINS/CSLL/IR) = R$ 1.151
- Empresa já pagou no DAS
**Prejuízo: R$ 1.151 + burocracia para recuperar**

✅ **Solução:** Configure corretamente seu sistema de NF-e/NFS-e.

**7. Ter Sócio PJ ou Estrutura Vedada**

❌ **Erro:** Incluir pessoa jurídica como sócia
💰 **Impacto:** Exclusão imediata do Simples + multa + recálculo retroativo

**Vedações comuns:**
- Sócio pessoa jurídica
- Filial de empresa estrangeira
- Capital em empresa no exterior
- Sócio em empresa de Lucro Presumido/Real

✅ **Solução:** Consulte contador antes de mudanças societárias.

**RESUMO - Checklist Mensal:**

✅ Monitore RBT12 (limite de R$ 4,8 milhões)
✅ Calcule Fator R (mantenha ≥28% se for serviços)
✅ Pague DAS até dia 20
✅ Segregue receitas por tipo (ICMS/ISS)
✅ Emita NFs corretamente
✅ Mantenha sócios todos PF
✅ Revise classificações fiscais

**Prevenção é mais barato que correção!**

Use nossas ferramentas:
- Calculadora DAS
- Simulador Fator R
- Simulador de Desenquadramento
    `,
    tags: ['erros', 'simples', 'fator r', 'DAS', 'exclusão']
  },
  {
    id: 4,
    titulo: 'Quando Migrar do Simples para Lucro Presumido?',
    categoria: 'planejamento',
    resumo: 'Sinais de que está na hora de mudar de regime e como fazer a transição',
    dataPublicacao: '2024-12-28',
    tempoLeitura: '7 min',
    conteudo: `
**A mudança pode economizar 20-40% em impostos**

Muitas empresas permanecem no Simples mesmo quando outro regime seria mais vantajoso. Veja quando e como migrar:

**Sinais de que o Lucro Presumido Pode Ser Melhor:**

**1. Faturamento entre R$ 4 e R$ 4,8 milhões**
Nessa faixa, alíquotas do Simples ficam altas (15-19,5%). Lucro Presumido pode ser 20-30% mais barato.

**2. Serviços com Fator R Baixo (<28%)**
Se não consegue manter folha em 28%, está pagando Anexo V (alíquotas de 15,5-33%). Presumido pode ter alíquota total de 13-16%.

**3. Margem de Lucro Real Muito Alta**
Se seu lucro real é 50-70% e a presunção é apenas 32%, você paga menos no Presumido.

**Exemplo Real - Consultoria:**
- Receita: R$ 400 mil/mês (R$ 4,8 milhões/ano)
- Lucro real: 60% (R$ 240 mil/mês)
- Folha baixa (Fator R = 15%)

**No Simples (Anexo V):**
Alíquota efetiva: ~19,5%
DAS mensal: R$ 78 mil
**Total ano: R$ 936 mil**

**No Lucro Presumido:**
Base IRPJ/CSLL: 32% × R$ 400k = R$ 128k
IRPJ: 15% + 10% adicional = ~R$ 22k
CSLL: 9% = R$ 11,5k
PIS/COFINS: 3,65% de R$ 400k = R$ 14,6k
ISS: 5% de R$ 400k = R$ 20k
**Total mês: R$ 68,1k**
**Total ano: R$ 817 mil**

**Economia: R$ 119 mil/ano (12,7% a menos!)**

**4. Quer Distribuir Lucros Isentos**
No Simples, há restrições para distribuir lucros. No Presumido, lucros contábeis distribuídos são 100% isentos de IR.

**5. Clientes Exigem Retenção**
Grandes empresas retêm impostos de fornecedores no Simples, causando bitributação. No Presumido, as regras de retenção são mais claras.

**Como Fazer a Migração:**

**Passo 1: Simule os Cenários (Nov-Dez)**
Use nosso Comparador para simular ambos regimes com seus números reais.

**Passo 2: Solicite Exclusão (Janeiro)**
Peça exclusão do Simples até 31/janeiro para efeito a partir de 1º/janeiro do mesmo ano (ou até fim janeiro para o ano seguinte, depende da legislação do ano).

**Passo 3: Prepare a Contabilidade**
- Escrituração contábil completa passa a ser obrigatória
- Configure SPED (ECD, ECF, EFD-Contribuições)
- Ajuste sistema de faturamento para PIS/COFINS

**Passo 4: Regularize Cadastros**
- Atualize dados na Receita Federal
- Comunique à Junta Comercial
- Informe ao município (ISS)

**Passo 5: Ajuste Fluxo de Caixa**
Impostos federais são trimestrais (IRPJ/CSLL) ou mensais (PIS/COFINS/ISS), diferentes do DAS mensal.

**Custos da Migração:**

- Honorários contábeis sobem: +R$ 500-1.200/mês
- Sistema de gestão fiscal: R$ 200-500/mês
- Adaptação de processos: ~40 horas/trabalho inicial

**Retorno:** Se economia for >R$ 2 mil/mês, vale a pena!

**Quando NÃO Migrar:**

❌ Margem de lucro baixa (abaixo da presunção)
❌ Faturamento <R$ 3 milhões e Fator R ≥28% (Simples ainda vantajoso)
❌ Atividade comercial simples com pouca margem
❌ Equipe contábil sem experiência em Presumido

**Próximos Passos:**
1. Use nosso Comparador Completo
2. Solicite simulação ao seu contador
3. Analise fluxo de caixa para próximos 12 meses
4. Tome decisão até final de dezembro
    `,
    tags: ['migração', 'presumido', 'planejamento', 'mudança', 'comparação']
  },
  {
    id: 5,
    titulo: 'Simples Nacional 2025: Mudanças e Novas Regras',
    categoria: 'novidades',
    resumo: 'Fique atualizado com as principais mudanças do Simples Nacional para 2025',
    dataPublicacao: '2024-12-20',
    tempoLeitura: '5 min',
    conteudo: `
**Mudanças que todo empresário do Simples precisa saber**

O Simples Nacional passou por atualizações importantes para 2025. Veja o que mudou:

**1. Limite de Faturamento Mantido**
O limite anual permanece em R$ 4.800.000,00 (R$ 400 mil/mês). Não houve reajuste este ano.

**2. Sublimites Estaduais e Municipais**
Alguns estados mantêm sublimite de R$ 3,6 milhões para ICMS. Acima disso, recolhe ICMS separado do DAS.

**3. Tabelas e Alíquotas Inalteradas**
As tabelas dos Anexos I a V seguem sem mudanças. Alíquotas permanecem de 4% a 33%.

**4. Fator R: Regra Mantida**
Continua em 28% para diferenciar Anexo III de V para prestadores de serviços.

**5. PGDAS-D: Melhorias na Interface**
Portal do Simples teve melhorias:
- Cálculo automático mais preciso
- Alertas de limite mais claros
- Integração com eSocial melhorada

**6. Parcelamento de Débitos**
Novas regras para parcelamento:
- Até 60 parcelas para débitos do DAS
- Entrada mínima de 5%
- Juros SELIC + 1% ao mês

**7. Obrigações Acessórias**
DEFIS 2025 deve ser entregue até 31/março com:
- Dados de receita bruta total
- Folha de pagamento (para Fator R)
- Dados de exportação (se houver)

**8. Fiscalização Intensificada**
Receita Federal anunciou foco em:
- Empresas próximas ao limite
- Fator R inconsistente
- Classificação de CNAEs errados
- Retenções não informadas

**9. Certificado Digital Obrigatório**
A partir de julho/2025, todas as empresas do Simples com faturamento >R$ 360 mil/ano devem ter certificado digital para acesso ao e-CAC.

**10. ISS: Atenção aos Municípios**
Alguns municípios criaram regras próprias para retenção de ISS em serviços. Consulte sua prefeitura.

**Calendário Tributário 2025:**

📅 **Todo dia 20:** Vencimento do DAS
📅 **Até 31/janeiro:** Opção/Exclusão do Simples
📅 **Até 31/março:** Entrega da DEFIS 2024
📅 **Julho:** Obrigatoriedade de certificado digital

**Novidades Positivas:**

✅ **Parcelamento Simplificado**
Novo sistema facilita parcelamento de débitos antigos.

✅ **Portal Mais Intuitivo**
PGDAS-D ficou mais fácil de usar.

✅ **Integração com eSocial**
Folha de pagamento é importada automaticamente para cálculo do Fator R.

**Cuidados para 2025:**

⚠️ **Monitore o Limite**
Com limite inalterado e inflação, empresas chegam mais rápido ao teto.

⚠️ **Fator R Mais Fiscalizado**
Receita está de olho em inconsistências. Mantenha documentação impecável.

⚠️ **Prepare Certificado Digital**
Se ainda não tem, providencie até junho/2025.

**Planejamento para o Ano:**

1. **Janeiro:** Confirme que está no regime certo (use nosso Comparador)
2. **Fevereiro-Março:** Entregue DEFIS no prazo
3. **Mensal:** Monitore RBT12 e Fator R
4. **Junho:** Providencie certificado digital se necessário
5. **Dezembro:** Planeje o regime para 2026

**Mantenha-se Atualizado:**

- Acompanhe nosso blog mensalmente
- Configure alertas no PGDAS-D
- Consulte seu contador regularmente
- Use nossas ferramentas de cálculo

**Conclusão:**

2025 não trouxe mudanças drásticas, mas a fiscalização está mais rigorosa. Empresários que se planejam e mantêm tudo em ordem não terão problemas.

Use nossas ferramentas gratuitas para se manter em dia!
    `,
    tags: ['novidades', 'simples', '2025', 'mudanças', 'atualização']
  },
  {
    id: 6,
    titulo: 'Pró-Labore vs. Distribuição de Lucros: Qual a Melhor Estratégia?',
    categoria: 'planejamento',
    resumo: 'Como remunerar sócios de forma mais eficiente e legal',
    dataPublicacao: '2024-12-15',
    tempoLeitura: '6 min',
    conteudo: `
**Economize até R$ 60 mil/ano na remuneração dos sócios**

A forma como você remunera sócios faz ENORME diferença na carga tributária. Veja como otimizar:

**Entendendo as Diferenças:**

**Pró-Labore:**
- Remuneração pelo trabalho do sócio
- Obrigatório se o sócio trabalha na empresa
- Tributação: INSS (11% sócio + 20% empresa) + IRPF (0-27,5%)
- Carga total: até 48,5% (!!)

**Distribuição de Lucros:**
- Divisão dos resultados da empresa
- Opcional, mas estratégica
- Tributação: 0% (ISENTO de IR!)
- Carga: 0%

**Exemplo Comparativo - Sócio que quer retirar R$ 10 mil/mês:**

**Opção 1: Tudo em Pró-Labore (R$ 10.000)**
- INSS sócio: R$ 908 (11% limitado ao teto)
- INSS empresa: R$ 2.000 (20%)
- IRPF: R$ 1.880 (faixa de 27,5%)
**Custo total: R$ 14.788**
**Líquido para o sócio: R$ 7.212**
**Carga: 47,9%!**

**Opção 2: Pró-Labore Mínimo + Lucros**
- Pró-labore: R$ 3.000
  - INSS sócio: R$ 330
  - INSS empresa: R$ 600
  - IRPF: R$ 35
- Lucros: R$ 7.000 (isento!)
**Custo total: R$ 10.965**
**Líquido para o sócio: R$ 9.635**
**Carga: 13,6% - Economia de 34,3%!**

**Economia anual: R$ 45.876!**

**Estratégias por Regime:**

**1. SIMPLES NACIONAL**

✅ **Estratégia Ideal:**
- Pró-labore: O suficiente para manter Fator R ≥28% (se serviços)
- Resto em lucros isentos

⚠️ **Cuidado:** CPP já está no DAS, então INSS empresa não é pago separado. Vantagem!

**Exemplo Prático:**
Prestador de serviços com receita de R$ 50k/mês precisa de Fator R de 28%.
- Folha necessária: R$ 14k/mês (28% de R$ 50k)
- Pró-labore de 2 sócios: R$ 7k cada
- Lucro líquido: R$ 20k/mês
- Distribui: R$ 10k para cada sócio (isento!)

**Retirada total de cada sócio:** R$ 17k (R$ 7k pró-labore + R$ 10k lucros)

**2. LUCRO PRESUMIDO**

✅ **Estratégia Ideal:**
- Pró-labore: Mínimo compatível (R$ 2-3 mil)
- Lucros: Maximizar distribuição (isento!)

**Vantagem:** Presunção de lucro facilita distribuição alta.

**Exemplo:**
Empresa fatura R$ 100k/mês, presunção de 32% = R$ 32k
- Paga IRPJ/CSLL sobre R$ 32k
- Pode distribuir até R$ 32k isento (após impostos ~R$ 25k líquido)
- Divide entre 2 sócios: R$ 12,5k cada isento
- Pró-labore de R$ 3k cada

**Retirada total:** R$ 15,5k/sócio com carga baixíssima!

**3. LUCRO REAL**

✅ **Estratégia Ideal:**
- Pró-labore: Compatível com mercado (não muito baixo)
- Lucros: Conforme lucro contábil efetivo

⚠️ **Atenção:** Só pode distribuir lucro CONTÁBIL apurado. Exige escrituração rigorosa.

**Regras de Ouro:**

**1. Pró-Labore Nunca Pode Ser Zero**
Se o sócio trabalha, deve ter pró-labore. Pode ser baixo, mas nunca zero. Risco de autuação.

**2. Pró-Labore Deve Ser Compatível**
Muito baixo (R$ 1-1,5k) para empresa grande pode ser questionado. Use bom senso.

**3. Lucros Precisam Ser Apurados Contabilmente**
Não adianta "inventar" lucros. Precisa ter escrituração contábil comprovando.

**4. Distribua Regularmente**
Não deixe lucros acumularem anos. Distribua anualmente ou semestralmente.

**5. Documente Tudo**
- Atas de assembleia aprovando distribuição
- Comprovantes de pagamento
- Contabilização correta

**Erros Fatais a Evitar:**

❌ **Pró-labore zero:** Autuação garantida
❌ **Distribuir mais que o lucro contábil:** Bitributação
❌ **Não documentar distribuições:** Pode ser tratado como pró-labore
❌ **Usar "sócio oculto":** Fraude fiscal
❌ **Distribuir sem contabilidade:** Impossível comprovar isenção

**Planejamento Anual:**

**Janeiro:** Defina estratégia do ano (quanto pró-labore/lucros)
**Trimestral:** Avalie lucros e possibilidade de distribuição
**Dezembro:** Distribua lucros pendentes antes de virar o ano

**Simulação Personalizada:**

Use nossa Calculadora de Pró-Labore para descobrir o ponto ótimo entre pró-labore e distribuição de lucros para SEU caso específico!

**Conclusão:**

A estratégia certa pode economizar de R$ 30 mil a R$ 80 mil/ano por sócio! Sempre consulte seu contador para implementação correta e legal.
    `,
    tags: ['pró-labore', 'lucros', 'planejamento', 'sócios', 'economia']
  }
];

export default function BlogTributario() {
  const navigate = useNavigate();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todas');
  const [artigoSelecionado, setArtigoSelecionado] = useState(null);

  const artigosFiltrados = useMemo(() => {
    if (categoriaSelecionada === 'todas') return ARTIGOS;
    return ARTIGOS.filter(a => a.categoria === categoriaSelecionada);
  }, [categoriaSelecionada]);

  const artigo = ARTIGOS.find(a => a.id === artigoSelecionado);

  if (artigo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Voltar */}
          <button
            onClick={() => setArtigoSelecionado(null)}
            className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2"
          >
            ← Voltar para o Blog
          </button>

          {/* Artigo */}
          <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
                  {CATEGORIAS_BLOG.find(c => c.id === artigo.categoria)?.emoji}{' '}
                  {CATEGORIAS_BLOG.find(c => c.id === artigo.categoria)?.nome}
                </span>
                <span className="text-gray-500 text-sm">
                  📅 {new Date(artigo.dataPublicacao).toLocaleDateString('pt-BR')}
                </span>
                <span className="text-gray-500 text-sm">⏱️ {artigo.tempoLeitura}</span>
              </div>

              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {artigo.titulo}
              </h1>

              <p className="text-xl text-gray-600">
                {artigo.resumo}
              </p>
            </div>

            {/* Conteúdo */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                {artigo.conteudo.split('\n').map((paragrafo, idx) => {
                  if (paragrafo.startsWith('**') && paragrafo.endsWith('**')) {
                    return (
                      <h3 key={idx} className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                        {paragrafo.replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  if (paragrafo.trim() === '') return null;
                  return (
                    <p key={idx} className="mb-4 text-gray-700">
                      {paragrafo}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {artigo.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {/* CTA */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">🧮 Coloque em Prática!</h3>
            <p className="text-blue-100 mb-6">
              Use nossas calculadoras para aplicar o que você aprendeu
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/formulario')}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Comparador Completo
              </button>
              <button
                onClick={() => navigate('/calculadora-das')}
                className="px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition"
              >
                Calculadora DAS
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-800 mb-4 flex items-center gap-2"
          >
            ← Voltar para Home
          </button>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📰 Blog Tributário
          </h1>
          <p className="text-gray-600 text-lg">
            Artigos práticos para economizar impostos e gerenciar melhor sua empresa
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🏷️ Categorias</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCategoriaSelecionada('todas')}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all ${
                categoriaSelecionada === 'todas'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({ARTIGOS.length})
            </button>
            {CATEGORIAS_BLOG.map(cat => {
              const count = ARTIGOS.filter(a => a.categoria === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoriaSelecionada(cat.id)}
                  className={`px-5 py-2.5 rounded-full font-semibold transition-all ${
                    categoriaSelecionada === cat.id
                      ? `bg-${cat.cor}-600 text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.emoji} {cat.nome} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de Artigos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artigosFiltrados.map((art) => {
            const categoria = CATEGORIAS_BLOG.find(c => c.id === art.categoria);
            return (
              <div
                key={art.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer group"
                onClick={() => setArtigoSelecionado(art.id)}
              >
                {/* Badge Categoria */}
                <div className={`bg-${categoria.cor}-100 p-6`}>
                  <div className="text-5xl mb-2">{categoria.emoji}</div>
                  <span className={`inline-block px-3 py-1 bg-${categoria.cor}-200 text-${categoria.cor}-800 rounded-full text-xs font-bold`}>
                    {categoria.nome}
                  </span>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition">
                    {art.titulo}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {art.resumo}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>📅 {new Date(art.dataPublicacao).toLocaleDateString('pt-BR')}</span>
                    <span>⏱️ {art.tempoLeitura}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {art.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
                    Ler Artigo →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Estatísticas */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">📊 Estatísticas do Blog</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-black mb-2">{ARTIGOS.length}</div>
              <div className="text-purple-100">Artigos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2">{CATEGORIAS_BLOG.length}</div>
              <div className="text-purple-100">Categorias</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2">
                {Math.round(ARTIGOS.reduce((acc, a) => acc + parseInt(a.tempoLeitura), 0) / ARTIGOS.length)}
              </div>
              <div className="text-purple-100">Min/Artigo</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2">100%</div>
              <div className="text-purple-100">Gratuito</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

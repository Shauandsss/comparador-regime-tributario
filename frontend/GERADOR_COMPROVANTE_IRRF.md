# Gerador de Comprovante de Rendimentos (IRRF) via XML eSocial

## 📋 Descrição

Ferramenta que processa arquivos XML do eSocial (evento S-1210 - Pagamentos de Rendimentos) e gera automaticamente o **Comprovante de Rendimentos Pagos e de Retenção de IRRF** no padrão oficial da Receita Federal do Brasil.

## 🎯 Funcionalidades

- ✅ **Upload de múltiplos arquivos XML** do eSocial
- ✅ **Validação automática** da estrutura dos XMLs
- ✅ **Parsing do evento S-1210** (Pagamentos de Rendimentos)
- ✅ **Consolidação** de XMLs do mesmo CPF/ano
- ✅ **Geração de PDF** no padrão oficial da Receita Federal
- ✅ **Extração automática** de:
  - Rendimentos tributáveis
  - Contribuição previdenciária
  - Imposto de Renda Retido na Fonte (IRRF)
  - 13º salário e seu IRRF
  - Pensão alimentícia
  - Planos de saúde
  - Outras deduções

## 🚀 Como Usar

### 1. Acesse a ferramenta
```
/gerador-comprovante-rendimentos
```

### 2. Faça upload dos arquivos XML
- Clique em "Selecionar arquivos" ou arraste os XMLs
- Aceita múltiplos arquivos XML do eSocial (evento S-1210)
- Formatos aceitos: `.xml`

### 3. Processamento
- A ferramenta validará automaticamente os arquivos
- Erros serão exibidos caso o XML seja inválido
- XMLs do mesmo CPF/ano serão consolidados

### 4. Gerar Comprovantes
- Clique em "Gerar Comprovantes"
- Os comprovantes serão gerados no padrão da Receita Federal
- Um PDF por CPF/ano-calendário

### 5. Download
- **Visualizar**: Abre o PDF em nova aba
- **Baixar**: Faz download do comprovante
- **Baixar Todos**: Download de todos os comprovantes gerados

## 📁 Estrutura do XML eSocial S-1210

A ferramenta suporta **dois formatos** de XML do eSocial:

### Formato 1: evtPgtos (estrutura antiga)

```xml
<eSocial>
  <evento>
    <evtPgtos>
      <ideEvento>
        <perApur>AAAA-MM</perApur>
      </ideEvento>
      
      <ideEmpregador>
        <nrInsc>CNPJ</nrInsc>
      </ideEmpregador>
      
      <ideBenef>
        <cpfBenef>CPF</cpfBenef>
        <nmBenef>Nome</nmBenef>
        
        <infoPgto>
          <detPgto>
            <codRubr>RUBRICA</codRubr>
            <tpRubr>1|2</tpRubr> <!-- 1=Vencimento, 2=Desconto -->
            <vrPgto>Valor</vrPgto>
          </detPgto>
        </infoPgto>
      </ideBenef>
    </evtPgtos>
  </evento>
</eSocial>
```

### Formato 2: evtPagto (estrutura nova)

```xml
<eSocial>
  <evtPagto>
    <ideEvento>
      <perApur>AAAA-MM</perApur>
    </ideEvento>
    
    <ideEmpregador>
      <nrInsc>CNPJ</nrInsc>
    </ideEmpregador>
    
    <ideBenef>
      <cpfBenef>CPF</cpfBenef>
      <nmBenef>Nome</nmBenef>
    </ideBenef>
    
    <dmDev>
      <infoPerApur>
        <remunPerApur>
          <remunPerApurDet>
            <tpRubr>101|102|103|201</tpRubr>
            <codRubr>RUBRICA</codRubr>
            <vrRubr>Valor</vrRubr>
          </remunPerApurDet>
        </remunPerApur>
      </infoPerApur>
    </dmDev>
    
    <infoPgto>
      <detPgtoFl>
        <tpValor>1|4|5|8|9</tpValor>
        <vrPgto>Valor</vrPgto>
      </detPgtoFl>
    </infoPgto>
  </evtPagto>
</eSocial>
```

**Tipos de Rubrica (tpRubr):**
- **101**: Vencimentos
- **102**: Previdência Oficial
- **103**: Desconto Judicial (Pensão)
- **104**: Outros
- **201**: IRRF

**Tipos de Valor (tpValor):**
- **1**: Valor Líquido
- **4**: INSS
- **5**: IRRF
- **8**: 13º Salário
- **9**: IRRF 13º Salário

## 📄 Exemplo de XML

Um arquivo XML de exemplo está disponível em:
```
/public/exemplo-esocial-s1210.xml
```

Use este arquivo para testar a ferramenta.

## 🔍 Validações Realizadas

A ferramenta valida:
- ✅ Estrutura XML válida
- ✅ Presença do evento S-1210
- ✅ Identificação do empregador (CNPJ)
- ✅ CPF dos beneficiários
- ✅ Campos obrigatórios

## 📊 Comprovante Gerado

O comprovante gerado contém:

### Seção 1: Fonte Pagadora
- Nome empresarial
- CNPJ
- Endereço

### Seção 2: Beneficiário
- Nome
- CPF

### Seção 3: Rendimentos Tributáveis
1. Total de rendimentos (exceto 13º)
2. Contribuição previdenciária oficial
3. Contribuição à previdência privada
4. Pensão alimentícia
5. Imposto de Renda Retido na Fonte
6. Dependentes
7. Outras deduções

### Seção 4: 13º Salário
8. Total de rendimentos - 13º salário
9. Contribuição previdenciária oficial
10. Imposto de Renda Retido - 13º

### Seção 5: Rendimentos Isentos
11. Parcela isenta de aposentadoria
12. Diárias e ajudas de custo
13. Indenizações por rescisão
14. Outros

### Seção 6: Planos de Saúde
15. Pagamentos a planos de saúde

## 🛠️ Tecnologias Utilizadas

- **React** - Interface
- **jsPDF** - Geração de PDF
- **jspdf-autotable** - Tabelas no PDF
- **DOMParser** - Parse de XML
- **Lucide React** - Ícones

## ⚠️ Limitações

- A ferramenta funciona **apenas no frontend** (sem backend)
- Dados da fonte pagadora podem precisar ser ajustados manualmente
- O mapeamento de rubricas segue heurísticas básicas
- Em produção, recomenda-se integração com sistema de folha

## 🔐 Privacidade

- ✅ Todo processamento é feito no navegador
- ✅ Nenhum dado é enviado para servidores
- ✅ XMLs não são armazenados
- ✅ Total privacidade dos dados

## 📝 Observações

- O comprovante gerado segue o padrão oficial da Receita Federal
- Valores são consolidados automaticamente quando há múltiplos XMLs do mesmo CPF
- Recomenda-se conferir os valores com a fonte pagadora antes do uso oficial
- Este comprovante pode ser utilizado para a Declaração de IRPF

## 🆘 Suporte

Em caso de dúvidas ou problemas:
1. Verifique se o XML está no formato correto (S-1210)
2. Confira se todos os campos obrigatórios estão preenchidos
3. Valide o XML antes do upload
4. Consulte a documentação do eSocial

## 📚 Referências

- [Manual do eSocial](https://www.gov.br/esocial/)
- [Evento S-1210 - Pagamentos](https://www.gov.br/esocial/pt-br/documentacao-tecnica)
- [Comprovante de Rendimentos - RFB](https://www.gov.br/receitafederal/)

---

**Desenvolvido para facilitar a vida de contadores, empresas e trabalhadores** 🎯

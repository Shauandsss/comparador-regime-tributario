import { useState, useMemo, useCallback } from 'react';
import { ferramentas } from '../data/ferramentas';

/**
 * Hook para busca semântica de ferramentas
 * Implementa busca fuzzy com scoring baseado em relevância
 */
export function useBuscaFerramentas() {
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState(null);

  /**
   * Normaliza texto para comparação
   * Remove acentos, converte para minúsculas
   */
  const normalizar = useCallback((texto) => {
    if (!texto) return '';
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }, []);

  /**
   * Calcula score de similaridade entre duas strings
   * Baseado em correspondência de caracteres e posição
   */
  const calcularSimilaridade = useCallback((str1, str2) => {
    const s1 = normalizar(str1);
    const s2 = normalizar(str2);
    
    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) return 0.9;
    
    // Verifica se palavras do termo estão presentes
    const palavras1 = s1.split(/\s+/);
    const palavras2 = s2.split(/\s+/);
    
    let matches = 0;
    for (const p1 of palavras1) {
      for (const p2 of palavras2) {
        if (p1.includes(p2) || p2.includes(p1)) {
          matches++;
          break;
        }
      }
    }
    
    return matches / Math.max(palavras1.length, palavras2.length);
  }, [normalizar]);

  /**
   * Calcula score de correspondência fuzzy
   */
  const calcularScoreFuzzy = useCallback((termo, texto) => {
    const t = normalizar(termo);
    const txt = normalizar(texto);
    
    if (!t || !txt) return 0;
    
    // Match exato
    if (txt === t) return 100;
    
    // Contém o termo completo
    if (txt.includes(t)) return 90;
    
    // Começa com o termo
    if (txt.startsWith(t)) return 85;
    
    // Verifica cada palavra do termo
    const palavrasTermo = t.split(/\s+/).filter(p => p.length > 1);
    const palavrasTexto = txt.split(/\s+/);
    
    let score = 0;
    let matchCount = 0;
    
    for (const pt of palavrasTermo) {
      for (const ptxt of palavrasTexto) {
        if (ptxt === pt) {
          score += 20;
          matchCount++;
          break;
        } else if (ptxt.includes(pt)) {
          score += 15;
          matchCount++;
          break;
        } else if (pt.includes(ptxt) && ptxt.length >= 3) {
          score += 10;
          matchCount++;
          break;
        }
      }
    }
    
    // Bonus por match de todas as palavras
    if (matchCount === palavrasTermo.length && matchCount > 0) {
      score += 20;
    }
    
    return Math.min(score, 80);
  }, [normalizar]);

  /**
   * Busca ferramentas com scoring semântico
   */
  const resultados = useMemo(() => {
    const termo = normalizar(termoBusca);
    
    if (!termo || termo.length < 2) {
      // Retorna ferramentas mais populares/importantes quando não há busca
      return filtroCategoria 
        ? ferramentas.filter(f => f.categoria === filtroCategoria)
        : [];
    }

    const resultadosComScore = ferramentas.map(ferramenta => {
      let score = 0;
      let matchInfo = [];

      // 1. Nome (peso máximo)
      const scoreNome = calcularScoreFuzzy(termo, ferramenta.nome);
      if (scoreNome > 0) {
        score += scoreNome * 2;
        matchInfo.push({ campo: 'nome', score: scoreNome });
      }

      // 2. Tags (peso alto)
      for (const tag of ferramenta.tags) {
        const scoreTag = calcularScoreFuzzy(termo, tag);
        if (scoreTag > 0) {
          score += scoreTag * 1.5;
          matchInfo.push({ campo: 'tag', valor: tag, score: scoreTag });
        }
      }

      // 3. Sinônimos (peso alto)
      for (const sinonimo of ferramenta.sinonimos) {
        const scoreSin = calcularScoreFuzzy(termo, sinonimo);
        if (scoreSin > 0) {
          score += scoreSin * 1.4;
          matchInfo.push({ campo: 'sinonimo', valor: sinonimo, score: scoreSin });
        }
      }

      // 4. Palavras-chave (peso médio-alto)
      for (const pc of ferramenta.palavrasChave) {
        const scorePc = calcularScoreFuzzy(termo, pc);
        if (scorePc > 0) {
          score += scorePc * 1.2;
          matchInfo.push({ campo: 'palavraChave', valor: pc, score: scorePc });
        }
      }

      // 5. Descrição (peso médio)
      const scoreDesc = calcularScoreFuzzy(termo, ferramenta.descricao);
      if (scoreDesc > 0) {
        score += scoreDesc * 0.8;
        matchInfo.push({ campo: 'descricao', score: scoreDesc });
      }

      // 6. Descrição completa (peso baixo)
      const scoreDescComp = calcularScoreFuzzy(termo, ferramenta.descricaoCompleta);
      if (scoreDescComp > 0) {
        score += scoreDescComp * 0.5;
        matchInfo.push({ campo: 'descricaoCompleta', score: scoreDescComp });
      }

      // 7. Categoria e subcategoria (peso baixo)
      const scoreCat = calcularScoreFuzzy(termo, ferramenta.categoria);
      const scoreSubcat = calcularScoreFuzzy(termo, ferramenta.subcategoria);
      score += (scoreCat + scoreSubcat) * 0.3;

      // Bonus para ferramentas em destaque
      if (ferramenta.destaque && score > 0) {
        score *= 1.2;
      }

      return {
        ...ferramenta,
        score,
        matchInfo
      };
    });

    // Filtra por categoria se definido
    let resultadosFiltrados = resultadosComScore.filter(r => r.score > 0);
    
    if (filtroCategoria) {
      resultadosFiltrados = resultadosFiltrados.filter(r => r.categoria === filtroCategoria);
    }

    // Ordena por score decrescente
    return resultadosFiltrados
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Limita a 10 resultados

  }, [termoBusca, filtroCategoria, normalizar, calcularScoreFuzzy]);

  /**
   * Sugestões de busca baseadas em buscas populares
   */
  const sugestoes = useMemo(() => {
    return [
      'calcular DAS',
      'qual melhor regime',
      'fator R',
      'lucro presumido',
      'migrar MEI',
      'custo funcionário',
      'valuation startup',
      'pró-labore',
      'CNAE anexo'
    ];
  }, []);

  /**
   * Ferramentas agrupadas por categoria
   */
  const ferramentasPorCategoria = useMemo(() => {
    const grupos = {};
    for (const f of ferramentas) {
      if (!grupos[f.categoria]) {
        grupos[f.categoria] = [];
      }
      grupos[f.categoria].push(f);
    }
    return grupos;
  }, []);

  /**
   * Buscar atalhos rápidos (ferramentas mais usadas)
   */
  const atalhos = useMemo(() => {
    return ferramentas.filter(f => 
      ['comparador', 'calculadora-das', 'diagnostico-tributario', 'simulador-fator-r', 'calculadora-presumido'].includes(f.id)
    );
  }, []);

  return {
    termoBusca,
    setTermoBusca,
    filtroCategoria,
    setFiltroCategoria,
    resultados,
    sugestoes,
    ferramentasPorCategoria,
    atalhos,
    totalFerramentas: ferramentas.length
  };
}

export default useBuscaFerramentas;

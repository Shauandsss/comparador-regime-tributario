/**
 * Testes de Integração - API: POST /creditos
 * @jest-environment node
 */

import request from 'supertest';
import app from '../src/app.js';

describe('POST /creditos - Testes de Integração', () => {
  describe('Dado um cálculo de créditos básicos', () => {
    test('Quando fazer POST /creditos com energia, aluguel e insumos, Então deve retornar 200 e créditos calculados', async () => {
      // Dado
      const input = {
        energia: 10000,
        aluguel: 5000,
        insumos: 30000
      };

      // Quando
      const response = await request(app)
        .post('/creditos')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.sucesso).toBe(true);
      
      const creditoPis = response.body.creditos.pis.total;
      expect(creditoPis).toBeGreaterThan(500);
      
      const creditoCofins = response.body.creditos.cofins.total;
      expect(creditoCofins).toBeGreaterThan(2500);
    });
  });

  describe('Dado valores zerados', () => {
    test('Quando fazer POST com todos os valores zerados, Então deve retornar 400 com erro', async () => {
      // Dado
      const input = {
        energia: 0,
        aluguel: 0,
        insumos: 0
      };

      // Quando
      const response = await request(app)
        .post('/creditos')
        .send(input);

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
      expect(response.body.message).toContain('pelo menos uma despesa');
    });
  });

  describe('Dado valores negativos', () => {
    test('Quando fazer POST com valores negativos, Então deve retornar 400', async () => {
      // Dado
      const input = {
        energia: -1000,
        aluguel: 5000
      };

      // Quando
      const response = await request(app)
        .post('/creditos')
        .send(input);

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
    });
  });

  describe('Dado cálculo com múltiplas categorias', () => {
    test('Quando fazer POST com várias categorias, Então deve processar todas corretamente', async () => {
      // Dado
      const input = {
        insumos: 50000,
        energia: 5000,
        aluguel: 3000,
        frete: 2000
      };

      // Quando
      const response = await request(app)
        .post('/creditos')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.entrada.quantidadeCategorias).toBe(4);
      expect(response.body.detalhamento).toHaveLength(4);
    });
  });

  describe('Dado cálculo de insumos específico', () => {
    test('Quando fazer POST com insumos de 10.000, Então PIS deve ser 165 e COFINS 760', async () => {
      // Dado
      const input = {
        insumos: 10000
      };

      // Quando
      const response = await request(app)
        .post('/creditos')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.creditos.pis.total).toBe(165);
      expect(response.body.creditos.cofins.total).toBe(760);
    });
  });

  describe('Dado valores altos', () => {
    test('Quando fazer POST com valores altos, Então deve calcular corretamente', async () => {
      // Dado
      const input = {
        insumos: 500000,
        energia: 50000,
        aluguel: 30000
      };

      // Quando
      const response = await request(app)
        .post('/creditos')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.creditos.total).toBeGreaterThan(50000);
    });
  });
});

/**
 * Testes de Integração - API: POST /diagnostico
 * @jest-environment node
 */

import request from 'supertest';
import app from '../src/app.js';

describe('POST /diagnostico - Testes de Integração', () => {
  describe('Dado uma empresa mão-de-obra intensiva (Simples vence)', () => {
    test('Quando fazer POST /diagnostico com folha alta, Então deve retornar 200 e melhor regime Simples', async () => {
      // Dado
      const input = {
        receitaBruta12: 500000,
        receitaMes: 42000,
        despesasMes: 8000,
        folhaMes: 17000,
        folha12: 200000,
        atividade: 'servicos'
      };

      // Quando
      const response = await request(app)
        .post('/diagnostico/analisar')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.recomendacao).toBeDefined();
      expect(response.body.recomendacao.melhorRegime).toBeDefined();
      
      // Com folha alta, Simples costuma ser melhor
      if (response.body.calculos.simples.aplicavel) {
        expect(response.body.ranking.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Dado uma empresa pouco intensiva em folha (Presumido vence)', () => {
    test('Quando fazer POST com comércio e folha baixa, Então deve recomendar regime adequado', async () => {
      // Dado
      const input = {
        receitaBruta12: 2000000,
        receitaMes: 167000,
        despesasMes: 17000,
        folhaMes: 8000,
        folha12: 100000,
        atividade: 'comercio'
      };

      // Quando
      const response = await request(app)
        .post('/diagnostico')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.calculos.presumido.aplicavel).toBe(true);
      expect(response.body.ranking.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Dado valores inválidos', () => {
    test('Quando fazer POST sem receita bruta, Então deve retornar 400', async () => {
      // Dado
      const input = {
        receitaMes: 50000,
        despesasMes: 10000
      };

      // Quando
      const response = await request(app)
        .post('/diagnostico')
        .send(input);

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
    });

    test('Quando fazer POST sem receita mensal, Então deve retornar 400', async () => {
      // Dado
      const input = {
        receitaBruta12: 600000,
        despesasMes: 10000
      };

      // Quando
      const response = await request(app)
        .post('/diagnostico')
        .send(input);

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
    });
  });

  describe('Dado empresa acima do limite do Simples', () => {
    test('Quando fazer POST com receita > 4,8 milhões, Então Simples não deve ser aplicável', async () => {
      // Dado
      const input = {
        receitaBruta12: 5000000,
        receitaMes: 417000,
        despesasMes: 100000,
        folhaMes: 50000,
        atividade: 'comercio'
      };

      // Quando
      const response = await request(app)
        .post('/diagnostico')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.calculos.simples.aplicavel).toBe(false);
      expect(response.body.ranking.length).toBe(2); // Apenas Presumido e Real
    });
  });

  describe('Dado empresa com prejuízo', () => {
    test('Quando fazer POST com despesas muito altas, Então Real deve mostrar vantagem', async () => {
      // Dado
      const input = {
        receitaBruta12: 1200000,
        receitaMes: 100000,
        despesasMes: 70000,
        folhaMes: 35000,
        atividade: 'servicos'
      };

      // Quando
      const response = await request(app)
        .post('/diagnostico')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      
      if (response.body.calculos.real.aplicavel) {
        const lucro = response.body.calculos.real.lucroContabil;
        expect(lucro).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('Dado recomendações', () => {
    test('Quando fazer POST, Então deve retornar recomendações personalizadas', async () => {
      // Dado
      const input = {
        receitaBruta12: 800000,
        receitaMes: 67000,
        despesasMes: 20000,
        folhaMes: 15000,
        atividade: 'servicos'
      };

      // Quando
      const response = await request(app)
        .post('/diagnostico')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.recomendacoes).toBeDefined();
      expect(Array.isArray(response.body.recomendacoes)).toBe(true);
      expect(response.body.recomendacoes.length).toBeGreaterThan(0);
    });
  });

  describe('Dado diferentes atividades', () => {
    test('Quando fazer POST com atividade comércio, Então deve processar corretamente', async () => {
      // Dado
      const input = {
        receitaBruta12: 600000,
        receitaMes: 50000,
        atividade: 'comercio'
      };

      // Quando
      const response = await request(app)
        .post('/diagnostico')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.empresa.atividade).toBeDefined();
    });

    test('Quando fazer POST com atividade indústria, Então deve processar corretamente', async () => {
      // Dado
      const input = {
        receitaBruta12: 800000,
        receitaMes: 67000,
        atividade: 'industria'
      };

      // Quando
      const response = await request(app)
        .post('/diagnostico')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.empresa.atividade).toBeDefined();
    });
  });

  describe('Dado cálculo de ranking', () => {
    test('Quando fazer POST, Então ranking deve estar ordenado corretamente', async () => {
      // Dado
      const input = {
        receitaBruta12: 1500000,
        receitaMes: 125000,
        despesasMes: 40000,
        folhaMes: 30000,
        atividade: 'servicos'
      };

      // Quando
      const response = await request(app)
        .post('/diagnostico')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      const ranking = response.body.ranking;
      
      // Verificar ordenação
      for (let i = 0; i < ranking.length - 1; i++) {
        expect(ranking[i].valor).toBeLessThanOrEqual(ranking[i + 1].valor);
      }
      
      // Melhor regime deve ser o primeiro
      expect(ranking[0].regime).toBe(response.body.recomendacao.melhorRegime);
    });
  });

  describe('Dado valores realistas', () => {
    test('Quando fazer POST com valores típicos de operação, Então deve calcular todos os regimes', async () => {
      // Dado
      const input = {
        receitaBruta12: 2400000,
        receitaMes: 200000,
        despesasMes: 80000,
        folhaMes: 50000,
        folha12: 600000,
        atividade: 'servicos'
      };

      // Quando
      const response = await request(app)
        .post('/diagnostico')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.calculos.simples).toBeDefined();
      expect(response.body.calculos.presumido).toBeDefined();
      expect(response.body.calculos.real).toBeDefined();
      expect(response.body.recomendacao.economiaAnual).toBeGreaterThanOrEqual(0);
    });
  });
});

/**
 * Testes de Integração - API: GET /simples/fator-r
 * @jest-environment node
 */

import request from 'supertest';
import app from '../src/app.js';

describe('GET /simples/fator-r - Testes de Integração', () => {
  describe('Dado um Fator R válido acima de 28%', () => {
    test('Quando fazer GET /simples/fator-r com folha 300.000 e RBT12 1.000.000, Então deve retornar 200, fator 0.30 e Anexo III', async () => {
      // Dado
      const params = {
        folha12: 300000,
        rbt12: 1000000
      };

      // Quando
      const response = await request(app)
        .get('/simples/fator-r')
        .query(params);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.sucesso).toBe(true);
      expect(response.body.calculo.fatorRDecimal).toBe(0.30);
      expect(response.body.anexo.atual).toBe('ANEXO_III');
      expect(response.body.anexo.enquadraAnexoIII).toBe(true);
    });
  });

  describe('Dado um Fator R abaixo de 28%', () => {
    test('Quando fazer GET /simples/fator-r com folha 100.000 e RBT12 1.000.000, Então deve retornar 200, fator 0.10 e Anexo V', async () => {
      // Dado
      const params = {
        folha12: 100000,
        rbt12: 1000000
      };

      // Quando
      const response = await request(app)
        .get('/simples/fator-r')
        .query(params);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.sucesso).toBe(true);
      expect(response.body.calculo.fatorRDecimal).toBe(0.10);
      expect(response.body.anexo.atual).toBe('ANEXO_V');
      expect(response.body.anexo.enquadraAnexoIII).toBe(false);
    });
  });

  describe('Dado uma entrada inválida com RBT12 zero', () => {
    test('Quando fazer GET /simples/fator-r com RBT12 zero, Então deve retornar 400 com erro', async () => {
      // Dado
      const params = {
        folha12: 100000,
        rbt12: 0
      };

      // Quando
      const response = await request(app)
        .get('/simples/fator-r')
        .query(params);

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
      expect(response.body.mensagem || response.body.erro).toContain('RBT12');
    });
  });

  describe('Dado parâmetros ausentes', () => {
    test('Quando fazer GET /simples/fator-r sem RBT12, Então deve retornar 400', async () => {
      // Dado
      const params = {
        folha12: 100000
      };

      // Quando
      const response = await request(app)
        .get('/simples/fator-r')
        .query(params);

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
    });
  });

  describe('Dado valores no limite de 28%', () => {
    test('Quando fazer GET com exatamente 28%, Então deve retornar Anexo III', async () => {
      // Dado
      const params = {
        folha12: 280000,
        rbt12: 1000000
      };

      // Quando
      const response = await request(app)
        .get('/simples/fator-r')
        .query(params);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.calculo.fatorRDecimal).toBe(0.28);
      expect(response.body.anexo.atual).toBe('ANEXO_III');
    });

    test('Quando fazer GET com 27.9%, Então deve retornar Anexo V', async () => {
      // Dado
      const params = {
        folha12: 279000,
        rbt12: 1000000
      };

      // Quando
      const response = await request(app)
        .get('/simples/fator-r')
        .query(params);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.calculo.fatorRDecimal).toBe(0.279);
      expect(response.body.anexo.atual).toBe('ANEXO_V');
    });
  });

  describe('Dado valores muito altos', () => {
    test('Quando fazer GET com valores de milhões, Então deve calcular corretamente', async () => {
      // Dado
      const params = {
        folha12: 1500000,
        rbt12: 4800000
      };

      // Quando
      const response = await request(app)
        .get('/simples/fator-r')
        .query(params);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.sucesso).toBe(true);
      expect(response.body.calculo.fatorRDecimal).toBeCloseTo(0.3125, 4);
    });
  });
});

/**
 * Testes de Integração - API: POST /presumido/calcular
 * @jest-environment node
 */

import request from 'supertest';
import app from '../src/app.js';

describe('POST /presumido/calcular - Testes de Integração', () => {
  describe('Dado um cálculo de comércio com presunção 8%', () => {
    test('Quando fazer POST /presumido/calcular com atividade comercio, Então deve retornar 200 e cálculos corretos', async () => {
      // Dado
      const input = {
        receita: 300000,
        atividade: 'comercio'
      };

      // Quando
      const response = await request(app)
        .post('/presumido/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.sucesso).toBe(true);
      expect(response.body.resumo.lucroPesumdio).toBe(24000);
      
      const irpjTotal = response.body.tributos.irpj.irpjTotal;
      expect(irpjTotal).toBeGreaterThanOrEqual(2600);
      expect(irpjTotal).toBeLessThanOrEqual(3000);
      
      const csll = response.body.tributos.csll.csll;
      expect(csll).toBeGreaterThanOrEqual(2100);
      expect(csll).toBeLessThanOrEqual(2400);
    });
  });

  describe('Dado serviços gerais com presunção 32%', () => {
    test('Quando fazer POST com atividade servicos, Então deve retornar base presumida de 32%', async () => {
      // Dado
      const input = {
        receita: 100000,
        atividade: 'servicos'
      };

      // Quando
      const response = await request(app)
        .post('/presumido/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.resumo.lucroPesumdio).toBe(32000);
      
      const irpjTotal = response.body.tributos.irpj.irpjTotal;
      expect(irpjTotal).toBeGreaterThanOrEqual(4800);
      expect(irpjTotal).toBeLessThanOrEqual(5800);
      
      const csll = response.body.tributos.csll.csll;
      expect(csll).toBeCloseTo(2880, 0);
    });
  });

  describe('Dado uma atividade desconhecida', () => {
    test('Quando fazer POST com atividade inválida, Então deve retornar 400 com erro', async () => {
      // Dado
      const input = {
        receita: 80000,
        atividade: 'alienigena'
      };

      // Quando
      const response = await request(app)
        .post('/presumido/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
      expect(response.body.erro).toContain('Atividade inválida');
    });
  });

  describe('Dado receita inválida', () => {
    test('Quando fazer POST sem receita, Então deve retornar 400', async () => {
      // Dado
      const input = {
        atividade: 'comercio'
      };

      // Quando
      const response = await request(app)
        .post('/presumido/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
    });

    test('Quando fazer POST com receita negativa, Então deve retornar 400', async () => {
      // Dado
      const input = {
        receita: -50000,
        atividade: 'comercio'
      };

      // Quando
      const response = await request(app)
        .post('/presumido/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
    });
  });

  describe('Dado cálculo com ISS', () => {
    test('Quando fazer POST com alíquota de ISS, Então deve incluir ISS no cálculo', async () => {
      // Dado
      const input = {
        receita: 50000,
        atividade: 'servicos',
        aliquotaISS: 3
      };

      // Quando
      const response = await request(app)
        .post('/presumido/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.tributos.iss.iss).toBe(1500);
    });
  });

  describe('Dado valores altos', () => {
    test('Quando fazer POST com receita alta, Então deve calcular adicional de IRPJ', async () => {
      // Dado
      const input = {
        receita: 1000000,
        atividade: 'servicos'
      };

      // Quando
      const response = await request(app)
        .post('/presumido/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.tributos.irpj.adicional).toBeGreaterThan(0);
    });
  });
});

/**
 * Testes de Integração - API: POST /real/calcular
 * @jest-environment node
 */

import request from 'supertest';
import app from '../src/app.js';

describe('POST /real/calcular - Testes de Integração', () => {
  describe('Dado um Lucro Real com lucro alto (Real perde)', () => {
    test('Quando fazer POST /real/calcular com lucro alto, Então deve retornar 200 e cálculos corretos', async () => {
      // Dado
      const input = {
        receita: 3000000,
        despesas: 2200000,
        folha: 400000,
        creditosPis: 0,
        creditosCofins: 0
      };

      // Quando
      const response = await request(app)
        .post('/real/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.sucesso).toBe(true);
      expect(response.body.apuracao.lucroContabil).toBe(400000);
      expect(response.body.apuracao.temPrejuizo).toBe(false);
    });
  });

  describe('Dado um Lucro Real com lucro muito baixo (Real vence)', () => {
    test('Quando fazer POST com lucro zero, Então deve retornar IRPJ e CSLL zerados', async () => {
      // Dado
      const input = {
        receita: 3000000,
        despesas: 2600000,
        folha: 400000,
        creditosPis: 0,
        creditosCofins: 0
      };

      // Quando
      const response = await request(app)
        .post('/real/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.apuracao.lucroContabil).toBe(0);
      expect(response.body.apuracao.temPrejuizo).toBe(true);
      expect(response.body.tributos.irpj.irpjTotal).toBe(0);
      expect(response.body.tributos.csll.csll).toBe(0);
    });
  });

  describe('Dado prejuízo contábil', () => {
    test('Quando fazer POST com despesas maiores que receita, Então deve retornar prejuízo e impostos zerados', async () => {
      // Dado
      const input = {
        receita: 500000,
        despesas: 400000,
        folha: 150000
      };

      // Quando
      const response = await request(app)
        .post('/real/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.apuracao.lucroContabil).toBeLessThan(0);
      expect(response.body.apuracao.temPrejuizo).toBe(true);
      expect(response.body.tributos.irpj.prejuizo).toBe(true);
      expect(response.body.tributos.csll.prejuizo).toBe(true);
    });
  });

  describe('Dado valores inválidos', () => {
    test('Quando fazer POST sem receita, Então deve retornar 400', async () => {
      // Dado
      const input = {
        despesas: 100000,
        folha: 50000
      };

      // Quando
      const response = await request(app)
        .post('/real/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
    });

    test('Quando fazer POST com despesas negativas, Então deve retornar 400', async () => {
      // Dado
      const input = {
        receita: 500000,
        despesas: -100000,
        folha: 50000
      };

      // Quando
      const response = await request(app)
        .post('/real/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
    });
  });

  describe('Dado cálculo com créditos de PIS/COFINS', () => {
    test('Quando fazer POST com créditos, Então deve deduzir dos débitos', async () => {
      // Dado
      const input = {
        receita: 100000,
        despesas: 30000,
        folha: 20000,
        creditosPis: 500,
        creditosCofins: 2000
      };

      // Quando
      const response = await request(app)
        .post('/real/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.tributos.pis.pisAPagar).toBe(1150);
      expect(response.body.tributos.cofins.cofinsAPagar).toBe(5600);
      expect(response.body.resumo.economiaCreditos).toBe(2500);
    });
  });

  describe('Dado valores que geram adicional de IRPJ', () => {
    test('Quando fazer POST com lucro acima de 20.000, Então deve calcular adicional', async () => {
      // Dado
      const input = {
        receita: 200000,
        despesas: 100000,
        folha: 50000
      };

      // Quando
      const response = await request(app)
        .post('/real/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.tributos.irpj.adicional).toBe(3000);
    });
  });

  describe('Dado valores típicos de operação', () => {
    test('Quando fazer POST com valores realistas, Então deve calcular corretamente todos os tributos', async () => {
      // Dado
      const input = {
        receita: 1000000,
        despesas: 500000,
        folha: 200000,
        creditosPis: 5000,
        creditosCofins: 20000
      };

      // Quando
      const response = await request(app)
        .post('/real/calcular')
        .send(input);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.sucesso).toBe(true);
      expect(response.body.apuracao.lucroContabil).toBe(300000);
      expect(response.body.resumo.totalTributos).toBeGreaterThan(0);
      expect(response.body.resumo.cargaTributariaDecimal).toBeGreaterThan(0);
    });
  });
});

/**
 * Testes de Integração - API: GET /simples/das
 * @jest-environment node
 */

import request from 'supertest';
import app from '../src/app.js';

describe('GET /simples/das - Testes de Integração', () => {
  describe('Dado um cálculo básico Anexo III com RBT12 baixo', () => {
    test('Quando fazer GET /simples/das com parâmetros válidos de Anexo III, Então deve retornar 200 e dados corretos', async () => {
      // Dado
      const params = {
        rbt12: 200000,
        faturamentoMes: 20000,
        cnae: '8599-6',
        folha12: 60000
      };

      // Quando
      const response = await request(app)
        .get('/simples/das')
        .query(params);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.sucesso).toBe(true);
      expect(response.body.anexo.codigo).toBe('ANEXO_III');
      
      const aliquotaEfetiva = parseFloat(response.body.calculo.aliquotaEfetiva);
      expect(aliquotaEfetiva).toBeGreaterThanOrEqual(5.5);
      expect(aliquotaEfetiva).toBeLessThanOrEqual(7);
      
      const valorDAS = parseFloat(response.body.calculo.valorDAS);
      expect(valorDAS).toBeGreaterThanOrEqual(1100);
      expect(valorDAS).toBeLessThanOrEqual(1500);
    });
  });

  describe('Dado um cálculo para Anexo V com Fator R baixo', () => {
    test('Quando fazer GET /simples/das com Fator R baixo, Então deve retornar 200 e Anexo V', async () => {
      // Dado
      const params = {
        rbt12: 800000,
        faturamentoMes: 40000,
        cnae: '8599-6',
        folha12: 50000
      };

      // Quando
      const response = await request(app)
        .get('/simples/das')
        .query(params);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.sucesso).toBe(true);
      expect(response.body.anexo.codigo).toBe('ANEXO_V');
      
      const aliquotaEfetiva = parseFloat(response.body.calculo.aliquotaEfetiva);
      expect(aliquotaEfetiva).toBeGreaterThan(13);
      
      const valorDAS = parseFloat(response.body.calculo.valorDAS);
      expect(valorDAS).toBeGreaterThan(5200);
    });
  });

  describe('Dado uma entrada inválida com RBT12 negativo', () => {
    test('Quando fazer GET /simples/das com RBT12 negativo, Então deve retornar 400 com erro', async () => {
      // Dado
      const params = {
        rbt12: -100,
        faturamentoMes: 10000,
        cnae: '4711-3',
        folha12: 10000
      };

      // Quando
      const response = await request(app)
        .get('/simples/das')
        .query(params);

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
      expect(response.body.mensagem || response.body.erro).toContain('RBT12');
    });
  });

  describe('Dado parâmetros ausentes', () => {
    test('Quando fazer GET /simples/das sem parâmetros obrigatórios, Então deve retornar 400', async () => {
      // Dado / Quando
      const response = await request(app)
        .get('/simples/das')
        .query({});

      // Então
      expect(response.status).toBe(400);
      expect(response.body.erro).toBeDefined();
    });
  });

  describe('Dado valores de comércio (Anexo I)', () => {
    test('Quando fazer GET /simples/das com CNAE de comércio, Então deve retornar Anexo I', async () => {
      // Dado
      const params = {
        rbt12: 300000,
        faturamentoMes: 25000,
        cnae: '4711-3', // Comércio
        folha12: 50000
      };

      // Quando
      const response = await request(app)
        .get('/simples/das')
        .query(params);

      // Então
      expect(response.status).toBe(200);
      expect(response.body.anexo.codigo).toBe('ANEXO_I');
    });
  });
});


import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Formulario from './pages/Formulario';
import Resultado from './pages/Resultado';
import CalculadoraDAS from './pages/CalculadoraDAS';
import SimuladorFatorR from './pages/SimuladorFatorR';
import SimuladorDesenquadramento from './pages/SimuladorDesenquadramento';
import CalculadoraPresumido from './pages/CalculadoraPresumido';
import CalculadoraReal from './pages/CalculadoraReal';
import SimuladorCreditos from './pages/SimuladorCreditos';
import CalculadoraProLabore from './pages/CalculadoraProLabore';
import DiagnosticoTributario from './pages/DiagnosticoTributario';
import TermometroRisco from './pages/TermometroRisco';
import GlossarioTributario from './pages/GlossarioTributario';
import GuiaRegimes from './pages/GuiaRegimes';
import GuiaCnae from './pages/GuiaCnae';
import ExplicadorSimples from './pages/ExplicadorSimples';
import CalculadoraMargem from './pages/CalculadoraMargem';
import HistoricoTributario from './pages/HistoricoTributario';
import SimuladorMigracao from './pages/SimuladorMigracao';
import PlanejadorTributario from './pages/PlanejadorTributario';
import FAQ from './pages/FAQ';
import BlogTributario from './pages/BlogTributario';
import CalendarioTributario from './pages/CalendarioTributario';
import SimuladorCenarios from './pages/SimuladorCenarios';
import CasosSucesso from './pages/CasosSucesso';
import CalculadoraDistribuicaoLucros from './pages/CalculadoraDistribuicaoLucros';
import CalculadoraRunway from './pages/CalculadoraRunway';
import CalculadoraValuation from './pages/CalculadoraValuation';
import CapTableSimulator from './pages/CapTableSimulator';
import CalculadoraCacLtv from './pages/CalculadoraCacLtv';
import SimuladorCrescimento from './pages/SimuladorCrescimento';
import SimuladorROI from './pages/SimuladorROI';
import SimuladorMRR from './pages/SimuladorMRR';
import CalculadoraCustoFuncionario from './pages/CalculadoraCustoFuncionario';
import ComparadorCltPj from './pages/ComparadorCltPj';
import CalculadoraRescisao from './pages/CalculadoraRescisao';
import CalculadoraMarkupMargem from './pages/CalculadoraMarkupMargem';
import SimuladorMaquininha from './pages/SimuladorMaquininha';
import CalculadoraPontoEquilibrio from './pages/CalculadoraPontoEquilibrio';
import SimuladorDifal from './pages/SimuladorDifal';
import CalculadoraIcmsSt from './pages/CalculadoraIcmsSt';
import HubFerramentas from './pages/HubFerramentas';
import ComparadorIndicadores from './pages/ferramentas/ComparadorIndicadores';
import SimuladorImpactoReforma from './pages/SimuladorImpactoReforma';
import SimuladorIVASimplificado from './pages/SimuladorIVASimplificado';
import SimuladorTransicaoReforma from './pages/SimuladorTransicaoReforma';
import SimuladorNFeIBSCBS from './pages/SimuladorNFeIBSCBS';
import CalculadoraAliquotaEfetiva from './pages/CalculadoraAliquotaEfetiva';
import SimuladorIVADual from './pages/SimuladorIVADual';
import SimuladorCashbackIBS from './pages/SimuladorCashbackIBS';
import CalculadoraPartilhaIBS from './pages/CalculadoraPartilhaIBS';
import AnalisadorImpactoTransicao from './pages/AnalisadorImpactoTransicao';
import PlanejadorReforma from './pages/PlanejadorReforma';
import SimuladorEcommerceReforma from './pages/SimuladorEcommerceReforma';
import SimuladorIndustriaReforma from './pages/SimuladorIndustriaReforma';
import SimuladorServicosReforma from './pages/SimuladorServicosReforma';
import SimuladorCestaBasica from './pages/SimuladorCestaBasica';
import SimuladorConstrucao from './pages/SimuladorConstrucao';
import SimuladorImpostoSeletivo from './pages/SimuladorImpostoSeletivo';
import CalculadoraCreditosIVA from './pages/CalculadoraCreditosIVA';
import SimuladorST2026 from './pages/SimuladorST2026';
import CalculadoraAliquotaReduzida from './pages/CalculadoraAliquotaReduzida';
import CestaBasicaIVA from './pages/CestaBasicaIVA';
import PainelCreditosAcumulados from './pages/PainelCreditosAcumulados';
import SimuladorExportacao from './pages/SimuladorExportacao';
import SimuladorServicosFinanceiros from './pages/SimuladorServicosFinanceiros';
import GeradorComprovanteRendimentos from './pages/GeradorComprovanteRendimentos';
import JornadaEconomiaHome from './pages/JornadaEconomiaHome';
import JornadaEconomia from './pages/JornadaEconomia';
import JornadaEconomiaBasica from './pages/JornadaEconomiaBasica';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ferramentas" element={<HubFerramentas />} />
          <Route path="/simulador-impacto-reforma" element={<SimuladorImpactoReforma />} />
          <Route path="/simulador-iva-simplificado" element={<SimuladorIVASimplificado />} />
          <Route path="/simulador-transicao-reforma" element={<SimuladorTransicaoReforma />} />
          <Route path="/simulador-nfe-ibscbs" element={<SimuladorNFeIBSCBS />} />
          <Route path="/calculadora-aliquota-efetiva" element={<CalculadoraAliquotaEfetiva />} />
          <Route path="/simulador-iva-dual" element={<SimuladorIVADual />} />
          <Route path="/simulador-cashback-ibs" element={<SimuladorCashbackIBS />} />
          <Route path="/calculadora-partilha-ibs" element={<CalculadoraPartilhaIBS />} />
          <Route path="/analisador-impacto-transicao" element={<AnalisadorImpactoTransicao />} />
          <Route path="/planejador-reforma" element={<PlanejadorReforma />} />
          <Route path="/simulador-ecommerce-reforma" element={<SimuladorEcommerceReforma />} />
          <Route path="/simulador-industria-reforma" element={<SimuladorIndustriaReforma />} />
          <Route path="/simulador-servicos-reforma" element={<SimuladorServicosReforma />} />
          <Route path="/simulador-cesta-basica" element={<SimuladorCestaBasica />} />
          <Route path="/simulador-construcao-reforma" element={<SimuladorConstrucao />} />
          <Route path="/simulador-imposto-seletivo" element={<SimuladorImpostoSeletivo />} />
          <Route path="/calculadora-creditos-iva" element={<CalculadoraCreditosIVA />} />
          <Route path="/simulador-st-2026" element={<SimuladorST2026 />} />
          <Route path="/calculadora-aliquota-reduzida" element={<CalculadoraAliquotaReduzida />} />
          <Route path="/cesta-basica-iva" element={<CestaBasicaIVA />} />
          <Route path="/painel-creditos-acumulados" element={<PainelCreditosAcumulados />} />
          <Route path="/simulador-exportacao" element={<SimuladorExportacao />} />
          <Route path="/simulador-servicos-financeiros" element={<SimuladorServicosFinanceiros />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/resultado" element={<Resultado />} />
          <Route path="/calculadora-das" element={<CalculadoraDAS />} />
          <Route path="/simulador-fator-r" element={<SimuladorFatorR />} />
          <Route path="/simulador-desenquadramento" element={<SimuladorDesenquadramento />} />
          <Route path="/calculadora-presumido" element={<CalculadoraPresumido />} />
          <Route path="/calculadora-real" element={<CalculadoraReal />} />
          <Route path="/simulador-creditos" element={<SimuladorCreditos />} />
          <Route path="/calculadora-pro-labore" element={<CalculadoraProLabore />} />
          <Route path="/diagnostico-tributario" element={<DiagnosticoTributario />} />
          <Route path="/termometro-risco" element={<TermometroRisco />} />
          <Route path="/glossario-tributario" element={<GlossarioTributario />} />
          <Route path="/guia-regimes" element={<GuiaRegimes />} />
          <Route path="/guia-cnae" element={<GuiaCnae />} />
          <Route path="/explicador-simples" element={<ExplicadorSimples />} />
          <Route path="/calculadora-margem" element={<CalculadoraMargem />} />
          <Route path="/historico-tributario" element={<HistoricoTributario />} />
          <Route path="/simulador-migracao" element={<SimuladorMigracao />} />
          <Route path="/planejador-tributario" element={<PlanejadorTributario />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<BlogTributario />} />
          <Route path="/calendario" element={<CalendarioTributario />} />
          <Route path="/simulador-cenarios" element={<SimuladorCenarios />} />
          <Route path="/casos-sucesso" element={<CasosSucesso />} />
          <Route path="/calculadora-distribuicao-lucros" element={<CalculadoraDistribuicaoLucros />} />
          <Route path="/calculadora-runway" element={<CalculadoraRunway />} />
          <Route path="/calculadora-valuation" element={<CalculadoraValuation />} />
          <Route path="/cap-table" element={<CapTableSimulator />} />
          <Route path="/calculadora-cac-ltv" element={<CalculadoraCacLtv />} />
          <Route path="/simulador-crescimento" element={<SimuladorCrescimento />} />
          <Route path="/simulador-roi" element={<SimuladorROI />} />
          <Route path="/simulador-mrr" element={<SimuladorMRR />} />
          <Route path="/calculadora-custo-funcionario" element={<CalculadoraCustoFuncionario />} />
          <Route path="/comparador-clt-pj" element={<ComparadorCltPj />} />
          <Route path="/calculadora-rescisao" element={<CalculadoraRescisao />} />
          <Route path="/calculadora-markup-margem" element={<CalculadoraMarkupMargem />} />
          <Route path="/simulador-maquininha" element={<SimuladorMaquininha />} />
          <Route path="/calculadora-ponto-equilibrio" element={<CalculadoraPontoEquilibrio />} />
          <Route path="/simulador-difal" element={<SimuladorDifal />} />
          <Route path="/calculadora-icms-st" element={<CalculadoraIcmsSt />} />
          <Route path="/comparador-indicadores" element={<ComparadorIndicadores />} />
          <Route path="/gerador-comprovante-rendimentos" element={<GeradorComprovanteRendimentos />} />
          <Route path="/jornada-economia-home" element={<JornadaEconomiaHome />} />
          <Route path="/jornada-economia" element={<JornadaEconomia />} />
          <Route path="/jornada-economia-basica" element={<JornadaEconomiaBasica />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

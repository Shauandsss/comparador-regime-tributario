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
import ComparadorIndicadores from './pages/ferramentas/ComparadorIndicadores';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
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
        </Routes>
      </main>
    </div>
  );
}

export default App;

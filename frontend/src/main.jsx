import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './styles/index.css';

// Usando BrowserRouter com basename para GitHub Pages
// O 404.html redireciona automaticamente para rotas SPA
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter basename="/comparador-regime-tributario">
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);

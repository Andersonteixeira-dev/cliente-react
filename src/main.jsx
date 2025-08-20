
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HeadProvider } from 'react-head';
import NoticiasPage from './pages/NoticiasPage.jsx'; 
import ArtigoPage from './pages/ArtigoPage.jsx';
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminPage from './pages/AdminPage.jsx'; 
import DetalhesPage from './pages/DetalhesPage.jsx';
import RotaProtegida from './components/RotaProtegida.jsx'; 
import SobrePage from './pages/SobrePage.jsx'; 
import PoliticaPrivacidadePage from './pages/PoliticaPrivacidadePage.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HeadProvider>
    <BrowserRouter>
      <Routes>        
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} /> 
          <Route path="noticias" element={<NoticiasPage />} />        
          <Route path="noticias/:slug" element={<ArtigoPage />} />   
          <Route path="concursos/:slug" element={<DetalhesPage />} />          
          <Route path="login" element={<LoginPage />} /> 
          <Route path="sobre" element={<SobrePage />} /> 
          <Route path="politica-de-privacidade" element={<PoliticaPrivacidadePage />} /> 
          <Route 
            path="admin" 
            element={
              <RotaProtegida>
                <AdminPage />
              </RotaProtegida>
          } 
          />    
        </Route>
      </Routes>
    </BrowserRouter>
    </HeadProvider>
  </React.StrictMode>
);

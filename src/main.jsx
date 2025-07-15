
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HeadProvider } from 'react-head';

import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminPage from './pages/AdminPage.jsx'; 
import DetalhesPage from './pages/DetalhesPage.jsx';
import RotaProtegida from './components/RotaProtegida.jsx'; 
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HeadProvider>
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} /> 
          <Route path="concursos/:id" element={<DetalhesPage />} />
          <Route path="login" element={<LoginPage />} /> 
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

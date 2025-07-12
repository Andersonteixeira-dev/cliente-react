// Arquivo: src/components/RotaProtegida.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function RotaProtegida({ children }) {
    const token = localStorage.getItem('authToken');

    if (!token) {
        // Se não há token, redireciona para a página de login
        return <Navigate to="/login" replace />;
    }

    // Se há um token, renderiza o componente filho (a página de admin)
    return children;
}

export default RotaProtegida;
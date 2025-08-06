import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Meta } from 'react-head';

import GerenciarConcursos from '../components/GerenciarConcursos'; 
import GerenciarNoticias from '../components/GerenciarNoticias';

// CSS para as abas
const tabStyles = {
    display: 'flex',
    marginBottom: '30px',
    borderBottom: '2px solid #dee2e6'
};
const tabButtonStyle = {
    padding: '10px 20px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '500',
    color: '#6c757d'
};
const activeTabButtonStyle = {
    ...tabButtonStyle,
    color: '#0d6efd',
    borderBottom: '2px solid #0d6efd',
    marginBottom: '-2px'
};

function AdminPage() {
    const navigate = useNavigate();
    const [abaAtiva, setAbaAtiva] = useState('concursos'); 

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <>
            <Title>Painel de Administração | eConcursou</Title>
            <Meta name="robots" content="noindex, nofollow" />
            
            <div>
                <button onClick={handleLogout} className="btn-logout" style={{ float: 'right' }}>
                    Sair <i className="fas fa-sign-out-alt"></i>
                </button>
                <h1>Painel de Administração</h1>

                <div style={tabStyles}>
                    <button 
                        style={abaAtiva === 'concursos' ? activeTabButtonStyle : tabButtonStyle} 
                        onClick={() => setAbaAtiva('concursos')}>
                        Gerenciar Concursos
                    </button>
                    <button 
                        style={abaAtiva === 'noticias' ? activeTabButtonStyle : tabButtonStyle} 
                        onClick={() => setAbaAtiva('noticias')}>
                        Gerenciar Notícias
                    </button>
                </div>
                
                <div>
                    {abaAtiva === 'concursos' && <GerenciarConcursos />}
                    {abaAtiva === 'noticias' && <GerenciarNoticias />}
                </div>
            </div>
        </>
    );
}

export default AdminPage;
import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { Title, Meta } from 'react-head'; 
import logoImage from './assets/logoeConcursou.png';

function App() {
    return (
        <>
            <Title>eConcursou - Seu Portal de Concursos</Title>
            <Meta name="description" content="Acompanhe os principais concursos públicos abertos e previstos em todo o Brasil." />

            <header>
                <div className="container">
                    <Link to="/" className="logo-container">
                        <img src={logoImage} alt="Logo eConcursou" className="logo-image" />
                        <span className="logo-text">eConcursou</span>
                    </Link>
                    <nav>
                        <ul>
                            <li>
                                <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                    Concursos
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/noticias" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                    Notícias
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="container">
                <Outlet /> 
            </main>

            <footer>
                <div className="container footer-content">
                    <p>&copy; 2025 eConcursou. Todos os direitos reservados.</p>
                    <div className="footer-links">
                        <Link to="/sobre">Sobre Nós</Link>
                        <span>|</span>
                        <Link to="/noticias">Notícias</Link>
                        <span>|</span>
                        <Link to="/politica-de-privacidade">Política de Privacidade</Link>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default App;
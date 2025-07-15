import React from 'react';
import { Outlet, Link } from 'react-router-dom'; 
import { Helmet } from 'react-helmet-async';

function App() {
    return (
        <>              
            <Helmet>                
                <title>eConcursou - Seu Portal de Concursos</title>
                <meta name="description" content="Acompanhe os principais concursos públicos abertos e previstos em todo o Brasil. Encontre sua vaga no serviço público." />
                <meta property="og:title" content="eConcursou - Seu Portal de Concursos" />
                <meta property="og:description" content="Acompanhe os principais concursos públicos abertos e previstos em todo o Brasil." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.econcursou.com.br" />
                {/* <meta property="og:image" content="https://www.econcursou.com.br/sua-imagem-de-compartilhamento.png" /> */}
            </Helmet>
            <header>
                <div className="container">
                    <h1><Link to="/">eConcursou</Link></h1> 
                                       
                </div>
            </header>

            <main className="container">
                <Outlet /> {/* O conteúdo da rota atual (HomePage, etc.) será inserido aqui */}
            </main>

            <footer>
                <div className="container">
                    <p>&copy; 2025 eConcursou. Todos os direitos reservados.</p>
                </div>
            </footer>
        </>
    );
}

export default App;
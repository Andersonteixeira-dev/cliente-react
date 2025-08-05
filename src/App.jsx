import React from 'react';
import { Outlet, Link } from 'react-router-dom'; 

function App() {
    return (
        <>              
           
            <header>
                <div className="container">
                    <h1><Link to="/">eConcursou</Link></h1> 
                                       
                </div>
            </header>

            <main className="container">
                <Outlet /> 
            </main>

            <footer>
                <div className="container">
                    <p>&copy; 2025 eConcursou. Todos os direitos reservados.</p>
                <div className="footer-links">
                    <Link to="/sobre">Sobre Nós</Link>
                    <span>|</span>
                    <Link to="/politica-de-privacidade">Política de Privacidade</Link>
                </div>
                </div>
            </footer>
        </>
    );
}

export default App;
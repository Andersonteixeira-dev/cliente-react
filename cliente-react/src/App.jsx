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
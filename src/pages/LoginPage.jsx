import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

function LoginPage() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 

    const navigate = useNavigate(); 

    
    // Em src/pages/LoginPage.jsx

const handleLogin = async (event) => {
    event.preventDefault();
    console.log("--- DEBUG ---");
    console.log("1. Botão 'Entrar' foi clicado, a função handleLogin começou.");

    setError(''); // Limpa erros antigos

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log("2. Dados do formulário capturados:", { email, password });

    try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/login`;
        console.log("3. Entrando no bloco 'try'. Tentando fazer fetch para:", apiUrl);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        console.log("4. Fetch concluído! Resposta do servidor recebida.");

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao fazer login.');
        }
        
        console.log("5. Login bem-sucedido! Salvando token e redirecionando...");
        localStorage.setItem('authToken', data.token);
        navigate('/admin');

    } catch (err) {
        console.error("--- ERRO --- A execução pulou para o 'catch'.", err);
        setError(err.message);
    }
};

    return (
        <div className="form-container" style={{ maxWidth: '450px', margin: '40px auto' }}>
            <h1>Acesso Restrito</h1>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Senha</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <button type="submit" className="btn-submit">Entrar</button>
            </form>
        </div>
    );
}

export default LoginPage;
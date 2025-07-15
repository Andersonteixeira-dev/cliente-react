import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const apiUrl = `${import.meta.env.VITE_API_URL}/api/login`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login.');
            }
            
            localStorage.setItem('authToken', data.token);
            navigate('/admin');

        } catch (err) {
            setError(err.message);
            console.error('Falha no login:', err);
        }
    };

    return (
        <div>
              <Helmet>
                <title>Login - Painel de Administração eConcursou</title>
                <meta name="robots" content="noindex" /> 
              </Helmet>
            
            <div className="form-container" style={{ maxWidth: '450px', margin: '40px auto' }}>
                <h1>Acesso Restrito</h1>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    <button type="submit" className="btn-submit">Entrar</button>
                </form>
            </div>
        </div>   
    );
}

export default LoginPage;
// Arquivo: src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook para navegação

function LoginPage() {
    // "Estados" para guardar o que o usuário digita nos campos
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Estado para guardar mensagens de erro

    const navigate = useNavigate(); // Inicializa o hook de navegação

    // Função que é chamada quando o formulário é enviado
    const handleLogin = async (event) => {
        event.preventDefault(); // Previne o recarregamento da página
        setError(''); // Limpa erros antigos

        try {
            // Faz a chamada para nossa API de login
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                // Se o servidor retornar um erro (ex: 400), lança uma exceção
                throw new Error(data.message || 'Erro ao fazer login.');
            }

            // Se o login for bem-sucedido:
            // 1. Guarda o token recebido no localStorage do navegador
            localStorage.setItem('authToken', data.token);

            // 2. Usa o navigate para redirecionar o usuário para o painel de admin
            navigate('/admin');

        } catch (err) {
            // Se houver qualquer erro, atualiza a mensagem de erro para o usuário
            setError(err.message);
            console.error('Falha no login:', err);
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

                {/* Exibe a mensagem de erro, se houver */}
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <button type="submit" className="btn-submit">Entrar</button>
            </form>
        </div>
    );
}

export default LoginPage;
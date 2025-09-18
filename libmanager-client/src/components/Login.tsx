import React, { useState } from 'react';
import { login } from '../services/apiService';
import './Login.css';
// Você pode substituir 'logo-livro.jpeg' por um novo ícone de livro aberto se desejar
import logo from '../assets/logo-livro.jpeg';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        try {
            const response = await login({ username, password });
            alert(`Bem-vindo, ${response.nomeUsuario}!`);
        } catch (err: any) {
            setError(err.message || 'Usuário ou senha inválidos.');
        }
    };

    return (
        <div className="login-container">
            <div className="bookmark-icon"></div> {/* Elemento para o marcador de página */}
            <div className="login-card">
                <img src={logo} className="login-logo" alt="LibManager Logo" />
                <h1 className="login-title">LibManager</h1>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <a href="#" className="forgot-password">Forgot Password?</a>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
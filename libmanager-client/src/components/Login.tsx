import React, { useState } from 'react';
import './Login.css'; // Nosso novo arquivo de estilos
// O logo pode ser um arquivo .svg ou .png que você coloca na pasta `src/assets`
import logo from '../assets/logo-livro.jpeg';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setError(''); // Limpa erros anteriores

        // Aqui virá a chamada para o apiService
        console.log('Tentando logar com:', { username, password });
        // Exemplo:
        // try {
        //   const response = await apiService.login({ username, password });
        //   alert(`Bem-vindo, ${response.nomeUsuario}!`);
        // } catch (err) {
        //   setError('Usuário ou senha inválidos.');
        // }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <img src={logo} className="login-logo" alt="LibManager Logo" />
                <h1 className="login-title">LibManager</h1>

                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-container">
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
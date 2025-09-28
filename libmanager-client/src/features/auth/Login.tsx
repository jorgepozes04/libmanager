import React, { useState, useEffect } from "react";
import { login, needsSetup, setupAdmin } from "../../services/apiService";
import { type User } from "../../types";

import "./Login.css";
import logo from "../../assets/logo-livro.jpeg";

interface LoginProps {
  onLoginSuccess: (userData: User) => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para o formulário de login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Estados para o formulário de setup
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupError, setSetupError] = useState("");

  useEffect(() => {
    // Verifica se o setup é necessário quando o componente monta
    const checkSetup = async () => {
      try {
        const needsSetupResult = await needsSetup();
        setIsSetupMode(needsSetupResult);
      } catch (err) {
        setError(
          "Não foi possível conectar ao servidor para verificar a configuração inicial."
        );
      } finally {
        setIsLoading(false);
      }
    };
    checkSetup();
  }, []);

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await login({ username, password });
      localStorage.setItem("authToken", response.token);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: response.id,
          nomeUsuario: response.nomeUsuario,
          cargo: response.cargo,
        })
      );
      onLoginSuccess({
        id: response.id,
        nomeUsuario: response.nomeUsuario,
        cargo: response.cargo,
      });
    } catch (err: any) {
      setError(err.message || "Usuário ou senha inválidos.");
    }
  };

  const handleSetupSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setSetupError("As senhas não coincidem.");
      return;
    }
    if (newPassword.length < 4) {
      setSetupError("A senha deve ter pelo menos 4 caracteres.");
      return;
    }
    setSetupError("");

    try {
      await setupAdmin({ password: newPassword });
      alert(
        "Usuário administrador configurado com sucesso! Agora você pode fazer o login."
      );
      // Recarrega a página para voltar ao modo de login
      window.location.reload();
    } catch (err: any) {
      setSetupError(err.message || "Ocorreu um erro ao configurar o sistema.");
    }
  };

  if (isLoading) {
    return (
      <div className="login-container">
        <p>Verificando configuração...</p>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="bookmark-icon"></div>
      <div className="login-card">
        <img src={logo} className="login-logo" alt="LibManager Logo" />
        <h1 className="login-title">LibManager</h1>

        {isSetupMode ? (
          <>
            <h2 style={{ fontWeight: 400, marginBottom: "2rem" }}>
              Configuração Inicial
            </h2>
            <form onSubmit={handleSetupSubmit} className="login-form">
              <p style={{ color: "#666", marginTop: 0 }}>
                Bem-vindo! Parece que este é o primeiro acesso. Por favor,
                defina uma senha para a conta 'admin'.
              </p>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Nova Senha para 'admin'"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirme a Nova Senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {setupError && <p className="error-message">{setupError}</p>}
              <button type="submit" className="login-button">
                Salvar Senha e Finalizar
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleLoginSubmit} className="login-form">
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
            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;

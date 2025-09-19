import { useState, useEffect } from "react";
import { type User } from "./types";
import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/pages/Dashboard";
import RealizarEmprestimo from "./components/RealizarEmprestimo";
import RealizarDevolucao from "./components/pages/RealizarDevolucao";
import CadastroCliente from "./components/pages/CadastroCliente";
import CadastroLivro from "./components/pages/CadastroLivro";
import CadastroRevista from "./components/pages/CadastroRevista";
import Consultas from "./components/pages/Consultas";
import GerenciarUsuarios from "./components/pages/GerenciarUsuarios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState("login"); // Começar no login

  // Executa uma vez quando o App carrega para verificar se já existe uma sessão
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userDataString = localStorage.getItem("userData");

    if (token && userDataString) {
      const userData = JSON.parse(userDataString);
      handleLoginSuccess(userData);
    }
  }, []);

  // Função para lidar com o sucesso do login
  const handleLoginSuccess = (userData: User) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    setCurrentView("dashboard");
  };

  // Função para fazer logout
  const handleLogout = () => {
    // Limpa o localStorage e reseta o estado da aplicação
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView("login");
  };

  // Função para navegar entre as telas do dashboard
  const handleNavigation = (view: string) => {
    setCurrentView(view);
  };

  // Função para renderizar a tela correta com base na view atual
  const renderView = () => {
    if (!currentUser) return null; // Não renderiza nada se o usuário não estiver carregado

    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            onNavigate={handleNavigation}
            userCargo={currentUser.cargo}
          />
        );
      case "emprestimo":
        return <RealizarEmprestimo usuarioId={currentUser.id} />;
      case "devolucao":
        return <RealizarDevolucao />;
      case "cadastroCliente":
        return <CadastroCliente />;
      case "cadastroLivro":
        return <CadastroLivro />;
      case "cadastroRevista":
        return <CadastroRevista />;
      case "consultas":
        return <Consultas />;
      case "gerenciarUsuarios":
        return <GerenciarUsuarios />;
      default:
        return (
          <Dashboard
            onNavigate={handleNavigation}
            userCargo={currentUser.cargo}
          />
        );
    }
  };

  return (
    <div>
      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <main>
          <nav className="navbar">
            {currentView !== "dashboard" ? (
              <button onClick={() => setCurrentView("dashboard")}>
                ← Voltar ao Painel
              </button>
            ) : (
              // Elemento vazio para manter o botão de sair à direita
              <div></div>
            )}
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </nav>
          {renderView()}
        </main>
      )}
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import { type User } from "./types";
import "./App.css";
import Login from "./features/auth/Login";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./features/dashboard/Dashboard";
import RealizarEmprestimo from "./features/emprestimo/RealizarEmprestimo";
import RealizarDevolucao from "./features/emprestimo/RealizarDevolucao";
import CadastroCliente from "./features/cadastro/CadastroCliente";
import CadastroLivro from "./features/cadastro/CadastroLivro";
import CadastroRevista from "./features/cadastro/CadastroRevista";
import Consultas from "./features/consulta/Consultas";
import GerenciarUsuarios from "./features/admin/GerenciarUsuarios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userDataString = localStorage.getItem("userData");

    if (token && userDataString) {
      const userData = JSON.parse(userDataString);
      handleLoginSuccess(userData);
    }
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleNavigation = (view: string) => {
    setCurrentView(view);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // --- LÓGICA DE RENDERIZAÇÃO CORRIGIDA ---

  // Se o usuário não estiver autenticado, renderiza APENAS o componente de Login.
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Se estiver autenticado, renderiza a aplicação principal com a Sidebar e o conteúdo.
  return (
    <div className="app-container">
      {currentUser && (
        <Sidebar
          userCargo={currentUser.cargo}
          currentView={currentView}
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
          onNavigate={handleNavigation}
          onLogout={handleLogout}
        />
      )}
      <main
        className={`main-content ${
          isSidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <div className="content-wrapper">
          {(() => {
            if (!currentUser) return null;
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
          })()}
        </div>
      </main>
    </div>
  );
}

export default App;

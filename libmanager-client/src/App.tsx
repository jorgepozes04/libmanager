import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
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
import DetalhesCliente from "./features/detalhes/DetalhesCliente";
import DetalhesLivro from "./features/detalhes/DetalhesLivro";
import DetalhesRevista from "./features/detalhes/DetalhesRevista";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userDataString = localStorage.getItem("userData");

    if (token && userDataString) {
      const userData = JSON.parse(userDataString);
      if (!isAuthenticated) {
        // Evita loop de login
        handleLoginSuccess(userData, false);
      }
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = (userData: User, shouldNavigate = true) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    if (shouldNavigate) {
      navigate("/dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate("/login");
  };

  const handleNavigation = (view: string) => {
    navigate(`/${view}`);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Se não estiver autenticado E não houver dados do utilizador, mostra o Login.
  if (!isAuthenticated || !currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        userCargo={currentUser.cargo}
        currentView={location.pathname} // Usa a localização atual para destacar o item ativo
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />
      <main
        className={`main-content ${
          isSidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <div className="content-wrapper">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  onNavigate={handleNavigation}
                  userCargo={currentUser.cargo}
                />
              }
            />
            <Route
              path="/emprestimo"
              element={<RealizarEmprestimo usuarioId={currentUser.id} />}
            />
            <Route path="/devolucao" element={<RealizarDevolucao />} />
            <Route path="/cadastroCliente" element={<CadastroCliente />} />
            <Route path="/cadastroLivro" element={<CadastroLivro />} />
            <Route path="/cadastroRevista" element={<CadastroRevista />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/gerenciarUsuarios" element={<GerenciarUsuarios />} />
            <Route path="/clientes/:id" element={<DetalhesCliente />} />
            <Route path="/livros/:id" element={<DetalhesLivro />} />
            <Route path="/revistas/:id" element={<DetalhesRevista />} />
            {/* Rota padrão para redirecionar para o dashboard */}
            <Route
              path="*"
              element={
                <Dashboard
                  onNavigate={handleNavigation}
                  userCargo={currentUser.cargo}
                />
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// O AppWrapper continua a ser a melhor forma de fornecer o contexto do Router ao App
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;

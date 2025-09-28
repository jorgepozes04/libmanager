import "./Sidebar.css";
import logo from "../../assets/logo-livro.jpeg";

interface SidebarProps {
  userCargo: string;
  currentView: string;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const Sidebar = ({
  userCargo,
  currentView,
  isCollapsed,
  toggleSidebar,
  onNavigate,
  onLogout,
}: SidebarProps) => {
  const navItems = [
    { view: "dashboard", label: "Dashboard", icon: "🏠" },
    { view: "emprestimo", label: "Realizar Empréstimo", icon: "➡️" },
    { view: "devolucao", label: "Realizar Devolução", icon: "⬅️" },
    { view: "consultas", label: "Consultas", icon: "🔍" },
    { view: "cadastroCliente", label: "Cadastrar Cliente", icon: "👤" },
    { view: "gerenciarClientes", label: "Gerenciar Clientes", icon: "👥" },
    { view: "cadastroLivro", label: "Cadastrar Livro", icon: "📚" },
    { view: "cadastroRevista", label: "Cadastrar Revista", icon: "🗞️" },
  ];

  if (userCargo === "ADMIN") {
    navItems.push({
      view: "gerenciarUsuarios",
      label: "Gerenciar Usuários",
      icon: "🛠️",
    });
  }

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <img src={logo} alt="LibManager Logo" className="sidebar-logo" />
        <h1 className="sidebar-title">LibManager</h1>
      </div>

      <button onClick={toggleSidebar} className="sidebar-toggle">
        {isCollapsed ? "»" : "«"}
      </button>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <a
            key={item.view}
            href="#"
            className={`nav-item ${currentView === item.view ? "active" : ""}`}
            onClick={() => onNavigate(item.view)}
            title={isCollapsed ? item.label : ""}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-button">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

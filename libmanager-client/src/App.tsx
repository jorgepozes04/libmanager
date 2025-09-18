import { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/pages/Dashboard';
import RealizarEmprestimo from './components/RealizarEmprestimo';
import RealizarDevolucao from './components/pages/RealizarDevolucao';
import CadastroCliente from './components/pages/CadastroCliente';
import CadastroLivro from './components/pages/CadastroLivro';
import CadastroRevista from './components/pages/CadastroRevista';
import Consultas from './components/pages/Consultas';
// Importe o novo componente de gerenciamento
import GerenciarUsuarios from './components/pages/GerenciarUsuarios';

// Definir a interface para o objeto do usuário
interface User {
    id: number;
    nomeUsuario: string;
    cargo: string;
}

function App() {
    // ESTADOS CORRIGIDOS
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState('login'); // Começar no login

    // Função para lidar com o sucesso do login
    const handleLoginSuccess = (userData: User) => {
        setIsAuthenticated(true);
        setCurrentUser(userData);
        setCurrentView('dashboard');
    };

    // Função para navegar entre as telas do dashboard
    const handleNavigation = (view: string) => {
        setCurrentView(view);
    };

    // Renderiza a tela correta com base na view atual
    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                // Passar o cargo do usuário para o Dashboard
                return <Dashboard onNavigate={handleNavigation} userCargo={currentUser!.cargo} />;
            case 'emprestimo':
                return <RealizarEmprestimo usuarioId={currentUser!.id} />;
            case 'devolucao':
                return <RealizarDevolucao />;
            case 'cadastroCliente':
                return <CadastroCliente />;
            case 'cadastroLivro':
                return <CadastroLivro />;
            case 'cadastroRevista':
                return <CadastroRevista />;
            case 'consultas':
                return <Consultas />;
            case 'gerenciarUsuarios': // Adicionar o novo caso
                return <GerenciarUsuarios />;
            default:
                return <Dashboard onNavigate={handleNavigation} userCargo={currentUser!.cargo} />;
        }
    };

    return (
        <div>
            {!isAuthenticated ? (
                <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
                <main>
                    {currentView !== 'dashboard' && (
                        <nav className="navbar">
                            <button onClick={() => setCurrentView('dashboard')}>
                                ← Voltar ao Painel
                            </button>
                        </nav>
                    )}
                    {renderView()}
                </main>
            )}
        </div>
    );
}

export default App;
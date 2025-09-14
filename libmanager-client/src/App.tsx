import { useState } from 'react';
import './App.css';

// Importe os componentes que você criou
import Login from './components/Login';
//import CadastroCliente from './components/CadastroCliente';
import RealizarEmprestimo from './components/RealizarEmprestimo';

// Define os tipos de telas que podemos ter
type View = 'login' | 'cadastroCliente' | 'emprestimo';

function App() {
    // Estado para controlar qual tela está visível. Começamos com a de login.
    const [currentView, setCurrentView] = useState<View>('login');

    const renderView = () => {
        switch (currentView) {
            case 'login':
                return <Login />;
            case 'cadastroCliente':
                return <CadastroCliente />;
            case 'emprestimo':
                return <RealizarEmprestimo />;
            default:
                return <Login />;
        }
    };

    return (
        <div>
            <nav className="navbar">
                <button onClick={() => setCurrentView('login')}>Login</button>
                <button onClick={() => setCurrentView('cadastroCliente')}>Cadastrar Cliente</button>
                <button onClick={() => setCurrentView('emprestimo')}>Realizar Empréstimo</button>
            </nav>
            <main>
                {renderView()}
            </main>
        </div>
    );
}

export default App;
import { useState } from 'react';
import './App.css';

// Importe os componentes que você criou e que existem
import Login from './components/Login';
import RealizarEmprestimo from './components/RealizarEmprestimo';

// Define os tipos de telas que podemos ter (removido 'cadastroCliente')
type View = 'login' | 'emprestimo';

function App() {
    // Estado para controlar qual tela está visível. Começamos com a de login.
    const [currentView, setCurrentView] = useState<View>('login');

    const renderView = () => {
        switch (currentView) {
            case 'login':
                return <Login />;
            case 'emprestimo':
                return <RealizarEmprestimo />;
            default:
                // Garante que a tela de login seja sempre o padrão
                return <Login />;
        }
    };

    return (
        <div>
            {/* A barra de navegação pode ser útil para desenvolvimento,
              mas para o fluxo final, o usuário provavelmente navegaria após o login.
              Você pode descomentar se quiser facilitar a troca de telas.
            */}
            {/* <nav className="navbar">
                <button onClick={() => setCurrentView('login')}>Login</button>
                <button onClick={() => setCurrentView('emprestimo')}>Realizar Empréstimo</button>
            </nav> */}

            <main>
                {renderView()}
            </main>
        </div>
    );
}

export default App;
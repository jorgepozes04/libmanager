import React from 'react';
import './Dashboard.css';
import Page from '../common/Page'; // Importar o Page

interface DashboardProps {
    onNavigate: (view: string) => void;
    userCargo: string;
}

function Dashboard({ onNavigate, userCargo }: DashboardProps) {
    return (
        <Page title="Painel de Controle">
            <div className="dashboard-grid">
                {/* Opções do Menu */}
                <div className="dashboard-card" onClick={() => onNavigate('emprestimo')}>
                    <h2>Realizar Empréstimo</h2>
                    <p>Registrar um novo empréstimo de livro.</p>
                </div>

                <div className="dashboard-card" onClick={() => onNavigate('devolucao')}>
                    <h2>Realizar Devolução</h2>
                    <p>Registrar a devolução de um livro.</p>
                </div>

                <div className="dashboard-card" onClick={() => onNavigate('cadastroCliente')}>
                    <h2>Cadastrar Cliente</h2>
                    <p>Adicionar um novo cliente ao sistema.</p>
                </div>

                <div className="dashboard-card" onClick={() => onNavigate('cadastroLivro')}>
                    <h2>Cadastrar Livro</h2>
                    <p>Adicionar um novo livro ao acervo.</p>
                </div>

                <div className="dashboard-card" onClick={() => onNavigate('cadastroRevista')}>
                    <h2>Cadastrar Revista</h2>
                    <p>Adicionar uma nova revista ao acervo.</p>
                </div>

                <div className="dashboard-card" onClick={() => onNavigate('consultas')}>
                    <h2>Consultas</h2>
                    <p>Buscar por clientes, livros e revistas.</p>
                </div>

                {/* Card de Gerenciar Usuários, visível apenas para ADMIN */}
                {userCargo === 'ADMIN' && (
                     <div className="dashboard-card" onClick={() => onNavigate('gerenciarUsuarios')}>
                        <h2>Gerenciar Usuários</h2>
                        <p>Adicionar, editar ou remover usuários.</p>
                    </div>
                )}
            </div>
        </Page>
    );
}

export default Dashboard;
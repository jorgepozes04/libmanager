import React, { useEffect, useState } from 'react';

// Simulação da API por enquanto
const fakeApi = {
    getUsers: async () => [
        { id: 1, nome: 'Administrador', nomeUsuario: 'admin', cargo: 'ADMIN' },
        { id: 2, nome: 'Jorge Pozes', nomeUsuario: 'jorge', cargo: 'USUARIO' },
    ]
}

function GerenciarUsuarios() {
    const [usuarios, setUsuarios] = useState<any[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await fakeApi.getUsers();
            setUsuarios(users);
        };
        fetchUsers();
    }, []);

    return (
        <div className="card">
            <h1>Gerenciar Usuários</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Username</th>
                        <th>Cargo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.nome}</td>
                            <td>{user.nomeUsuario}</td>
                            <td>{user.cargo}</td>
                            <td>
                                <button className="btn-small">Editar</button>
                                <button className="btn-small btn-danger">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GerenciarUsuarios;
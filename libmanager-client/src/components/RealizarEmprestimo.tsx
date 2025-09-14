import React, { useState } from 'react';
import { realizarEmprestimo } from '../services/apiService';
import '../App.css'; // Podemos continuar usando o CSS principal por enquanto

function RealizarEmprestimo() {
    // Estados para armazenar os valores dos inputs e as mensagens
    const [livroId, setLivroId] = useState('');
    const [clienteId, setClienteId] = useState('');
    const [usuarioId, setUsuarioId] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMensagem('');

        const emprestimoData = {
            idLivro: Number(livroId),
            idCliente: Number(clienteId),
            idUsuario: Number(usuarioId),
        };

        try {
            const resultado = await realizarEmprestimo(emprestimoData);
            setIsError(false);
            setMensagem(`Empréstimo realizado com sucesso! ID: ${resultado.id}`);
        } catch (error) {
            setIsError(true);
            setMensagem('Falha ao realizar empréstimo. Verifique os dados e tente novamente.');
        }
    };

    return (
        <div className="card">
            <h1>LibManager - Realizar Empréstimo</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>ID do Livro</label>
                    <input
                        type="number"
                        value={livroId}
                        onChange={(e) => setLivroId(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>ID do Cliente</label>
                    <input
                        type="number"
                        value={clienteId}
                        onChange={(e) => setClienteId(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>ID do Usuário</label>
                    <input
                        type="number"
                        value={usuarioId}
                        onChange={(e) => setUsuarioId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Confirmar Empréstimo</button>
            </form>
            {mensagem && (
                <p className={isError ? 'mensagem-erro' : 'mensagem-sucesso'}>
                    {mensagem}
                </p>
            )}
        </div>
    );
}

export default RealizarEmprestimo;
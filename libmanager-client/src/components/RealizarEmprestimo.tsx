import React, { useState, useEffect, useRef } from 'react';
import { realizarEmprestimo, searchClientes, searchLivros } from '../services/apiService';
import './RealizarEmprestimo.css';

// Interfaces para os tipos de dados
interface Cliente {
    id: number;
    nome: string;
    cpf: string;
}

interface Livro {
    id: number;
    titulo: string;
    autor: string;
    quantDisponivel: number;
}

interface EmprestimoProps {
    usuarioId: number;
}

function RealizarEmprestimo({ usuarioId }: EmprestimoProps) {
    // Estados para a busca
    const [clienteQuery, setClienteQuery] = useState('');
    const [livroQuery, setLivroQuery] = useState('');
    const [clienteResults, setClienteResults] = useState<Cliente[]>([]);
    const [livroResults, setLivroResults] = useState<Livro[]>([]);

    // Estados para os itens selecionados
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
    const [selectedLivro, setSelectedLivro] = useState<Livro | null>(null);

    // Estados para mensagens
    const [mensagem, setMensagem] = useState('');
    const [isError, setIsError] = useState(false);

    // Referência para o timer do debounce
    const clienteDebounceTimer = useRef<NodeJS.Timeout | null>(null);
    const livroDebounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Efeito para buscar clientes dinamicamente
    useEffect(() => {
        if (clienteDebounceTimer.current) {
            clearTimeout(clienteDebounceTimer.current);
        }
        if (clienteQuery.trim() !== '') {
            clienteDebounceTimer.current = setTimeout(async () => {
                const results = await searchClientes(clienteQuery);
                setClienteResults(results);
            }, 300); // Espera 300ms após o usuário parar de digitar
        } else {
            setClienteResults([]); // Limpa os resultados se o campo estiver vazio
        }
    }, [clienteQuery]);

    // Efeito para buscar livros dinamicamente
    useEffect(() => {
        if (livroDebounceTimer.current) {
            clearTimeout(livroDebounceTimer.current);
        }
        if (livroQuery.trim() !== '') {
            livroDebounceTimer.current = setTimeout(async () => {
                const results = await searchLivros(livroQuery);
                setLivroResults(results);
            }, 300); // Espera 300ms
        } else {
            setLivroResults([]);
        }
    }, [livroQuery]);

    // Função de submissão do empréstimo
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedCliente || !selectedLivro) {
            setIsError(true);
            setMensagem('Por favor, selecione um cliente e um livro.');
            return;
        }

        const emprestimoData = {
            idCliente: selectedCliente.id,
            idLivro: selectedLivro.id,
            idUsuario: usuarioId,
        };

        try {
            const resultado = await realizarEmprestimo(emprestimoData);
            setIsError(false);
            setMensagem(`Empréstimo realizado com sucesso! ID: ${resultado.id}`);
            // Limpa o formulário
            setSelectedCliente(null);
            setSelectedLivro(null);
        } catch (error) {
            setIsError(true);
            setMensagem('Falha ao realizar empréstimo. Verifique os dados e tente novamente.');
        }
    };

    return (
        <div className="card">
            <h1>Realizar Empréstimo</h1>

            <div className="selecao-info">
                <p><strong>Cliente:</strong> {selectedCliente ? `${selectedCliente.nome} (CPF: ${selectedCliente.cpf})` : 'Nenhum selecionado'}</p>
                <p><strong>Livro:</strong> {selectedLivro ? `${selectedLivro.titulo} (Autor: ${selectedLivro.autor})` : 'Nenhum selecionado'}</p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Busca de Cliente */}
                <div className="input-group">
                    <label>Buscar Cliente por Nome</label>
                    <input
                        type="text"
                        value={clienteQuery}
                        onChange={(e) => setClienteQuery(e.target.value)}
                        placeholder="Comece a digitar o nome do cliente..."
                    />
                </div>
                {clienteResults.length > 0 && (
                    <ul className="search-results">
                        {clienteResults.map(cliente => (
                            <li key={cliente.id} onClick={() => { setSelectedCliente(cliente); setClienteResults([]); setClienteQuery(''); }}>
                                {cliente.nome} - {cliente.cpf}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Busca de Livro */}
                <div className="input-group">
                    <label>Buscar Livro por Título</label>
                    <input
                        type="text"
                        value={livroQuery}
                        onChange={(e) => setLivroQuery(e.target.value)}
                        placeholder="Comece a digitar o título do livro..."
                    />
                </div>
                {livroResults.length > 0 && (
                    <ul className="search-results">
                        {livroResults.map(livro => (
                            <li key={livro.id} onClick={() => { setSelectedLivro(livro); setLivroResults([]); setLivroQuery(''); }}>
                                {livro.titulo} ({livro.quantDisponivel} disponíveis)
                            </li>
                        ))}
                    </ul>
                )}

                <button type="submit" disabled={!selectedCliente || !selectedLivro}>Confirmar Empréstimo</button>
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
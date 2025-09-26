import React, { useState, useEffect } from "react";
import {
  realizarEmprestimo,
  searchClientes,
  searchLivros,
} from "../services/apiService";
import "./RealizarEmprestimo.css";
import Page from "./common/Page";

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
  const [clienteQuery, setClienteQuery] = useState("");
  const [livroQuery, setLivroQuery] = useState("");
  const [clienteResults, setClienteResults] = useState<Cliente[]>([]);
  const [livroResults, setLivroResults] = useState<Livro[]>([]);

  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [selectedLivro, setSelectedLivro] = useState<Livro | null>(null);

  const [mensagem, setMensagem] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (clienteQuery.trim() === "") {
      setClienteResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchClientes(clienteQuery);
      setClienteResults(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [clienteQuery]);

  useEffect(() => {
    if (livroQuery.trim() === "") {
      setLivroResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchLivros(livroQuery);
      setLivroResults(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [livroQuery]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedCliente || !selectedLivro) {
      setIsError(true);
      setMensagem("Por favor, selecione um cliente e um livro.");
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
      setSelectedCliente(null);
      setSelectedLivro(null);
      setClienteQuery("");
      setLivroQuery("");
    } catch (error) {
      setIsError(true);
      setMensagem(
        "Falha ao realizar empréstimo. O cliente pode já ter um livro emprestado ou não haver exemplares disponíveis."
      );
    }
  };

  return (
    <Page title="Realizar Empréstimo">
      <form onSubmit={handleSubmit} className="emprestimo-form">
        <div className="form-section">
          <h2>1. Selecione o Cliente</h2>
          <div className="input-group">
            <label htmlFor="cliente-search">Buscar Cliente por Nome</label>
            <input
              id="cliente-search"
              type="text"
              value={clienteQuery}
              onChange={(e) => setClienteQuery(e.target.value)}
              placeholder="Comece a digitar o nome do cliente..."
              disabled={!!selectedCliente}
            />
            {clienteResults.length > 0 && (
              <ul className="search-results">
                {clienteResults.map((cliente) => (
                  <li
                    key={cliente.id}
                    onClick={() => {
                      setSelectedCliente(cliente);
                      setClienteResults([]);
                      setClienteQuery(cliente.nome);
                    }}
                  >
                    {cliente.nome} - CPF: {cliente.cpf}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2>2. Selecione o Livro</h2>
          <div className="input-group">
            <label htmlFor="livro-search">Buscar Livro por Título</label>
            <input
              id="livro-search"
              type="text"
              value={livroQuery}
              onChange={(e) => setLivroQuery(e.target.value)}
              placeholder="Comece a digitar o título do livro..."
              disabled={!!selectedLivro}
            />
            {livroResults.length > 0 && (
              <ul className="search-results">
                {livroResults.map((livro) => (
                  <li
                    key={livro.id}
                    onClick={() => {
                      setSelectedLivro(livro);
                      setLivroResults([]);
                      setLivroQuery(livro.titulo);
                    }}
                  >
                    {livro.titulo} ({livro.quantDisponivel} disponíveis)
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {(selectedCliente || selectedLivro) && (
          <div className="form-section resumo-selecao">
            <h2>Resumo</h2>
            <p>
              <strong>Cliente:</strong>{" "}
              {selectedCliente ? `${selectedCliente.nome}` : "Não selecionado"}
            </p>
            <p>
              <strong>Livro:</strong>{" "}
              {selectedLivro ? `${selectedLivro.titulo}` : "Não selecionado"}
            </p>
            <button
              type="button"
              className="btn-limpar"
              onClick={() => {
                setSelectedCliente(null);
                setSelectedLivro(null);
                setClienteQuery("");
                setLivroQuery("");
              }}
            >
              Limpar Seleção
            </button>
          </div>
        )}

        <button type="submit" disabled={!selectedCliente || !selectedLivro}>
          Confirmar Empréstimo
        </button>
      </form>
      {mensagem && (
        <p
          className={`mensagem ${
            isError ? "mensagem-erro" : "mensagem-sucesso"
          }`}
        >
          {mensagem}
        </p>
      )}
    </Page>
  );
}

export default RealizarEmprestimo;
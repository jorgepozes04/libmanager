import React, { useState, useEffect, useRef } from "react";
import {
  realizarEmprestimo,
  searchClientes,
  searchLivros,
} from "../../services/apiService";
import "./RealizarEmprestimo.css";
import Page from "../../components/common/Page";

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

  // Novos estados para controlar a visibilidade das listas
  const [showClienteResults, setShowClienteResults] = useState(false);
  const [showLivroResults, setShowLivroResults] = useState(false);

  // Refs para detectar cliques fora dos campos de busca
  const clienteSearchRef = useRef<HTMLDivElement>(null);
  const livroSearchRef = useRef<HTMLDivElement>(null);

  // Efeito para buscar clientes (agora depende de showClienteResults)
  useEffect(() => {
    if (!showClienteResults) return;
    const timer = setTimeout(async () => {
      const results = await searchClientes(clienteQuery);
      setClienteResults(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [clienteQuery, showClienteResults]);

  // Efeito para buscar livros (agora depende de showLivroResults)
  useEffect(() => {
    if (!showLivroResults) return;
    const timer = setTimeout(async () => {
      const results = await searchLivros(livroQuery);
      setLivroResults(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [livroQuery, showLivroResults]);

  // Efeito para fechar as listas ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        clienteSearchRef.current &&
        !clienteSearchRef.current.contains(event.target as Node)
      ) {
        setShowClienteResults(false);
      }
      if (
        livroSearchRef.current &&
        !livroSearchRef.current.contains(event.target as Node)
      ) {
        setShowLivroResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <div className="input-group" ref={clienteSearchRef}>
            <input
              id="cliente-search"
              type="text"
              value={clienteQuery}
              onChange={(e) => setClienteQuery(e.target.value)}
              onFocus={() => setShowClienteResults(true)}
              placeholder="Comece a digitar o nome do cliente..."
              disabled={!!selectedCliente}
              autoComplete="off"
            />
            {showClienteResults && clienteResults.length > 0 && (
              <ul className="search-results">
                {clienteResults.map((cliente) => (
                  <li
                    key={cliente.id}
                    onClick={() => {
                      setSelectedCliente(cliente);
                      setClienteQuery(cliente.nome);
                      setShowClienteResults(false);
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
          <div className="input-group" ref={livroSearchRef}>
            <input
              id="livro-search"
              type="text"
              value={livroQuery}
              onChange={(e) => setLivroQuery(e.target.value)}
              onFocus={() => setShowLivroResults(true)}
              placeholder="Comece a digitar o título do livro..."
              disabled={!!selectedLivro}
              autoComplete="off"
            />
            {showLivroResults && livroResults.length > 0 && (
              <ul className="search-results">
                {livroResults.map((livro) => (
                  <li
                    key={livro.id}
                    onClick={() => {
                      setSelectedLivro(livro);
                      setLivroQuery(livro.titulo);
                      setShowLivroResults(false);
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

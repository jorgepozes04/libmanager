import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { searchClientes } from "../../services/consultaService";
import { deleteCliente } from "../../services/clienteService";
import type { Cliente } from "../../types/api";
import Page from "../../components/common/Page";
import "../consulta/Consultas.css";

function GerenciarClientes() {
  const [termoBusca, setTermoBusca] = useState("");
  const [resultados, setResutados] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);

  const performSearch = useCallback(async () => {
    if (!isFocused && !termoBusca.trim()) {
      setResutados([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErro("");
    try {
      const data = await searchClientes(termoBusca);
      setResutados(data);
    } catch (error: any) {
      setErro(error.message || "Erro ao realizar a busca.");
      setResutados([]);
    } finally {
      setLoading(false);
    }
  }, [termoBusca, isFocused]);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [performSearch]);

  const handleEditClick = (id: number) => {
    navigate(`/clientes/${id}`);
  };

  const handleDeleteClick = async (cliente: Cliente) => {
    if (
      window.confirm(
        `Tem certeza de que deseja excluir o cliente "${cliente.nome}"? Esta ação não pode ser desfeita.`
      )
    ) {
      try {
        await deleteCliente(cliente.id);
        alert("Cliente excluído com sucesso!");
        performSearch(); // Atualiza a lista após a exclusão
      } catch (error: any) {
        alert(`Erro ao excluir cliente: ${error.message}`);
      }
    }
  };

  const renderResultados = () => {
    if (loading) return <p className="feedback-text">Buscando...</p>;
    if (erro) return <p className="mensagem-erro">{erro}</p>;
    if (
      (isFocused || termoBusca.trim()) &&
      !loading &&
      resultados.length === 0
    ) {
      return <p className="feedback-text">Nenhum cliente encontrado.</p>;
    }
    if (!isFocused && !termoBusca.trim()) {
      return (
        <p className="feedback-text">
          Clique e comece a buscar um cliente pelo nome.
        </p>
      );
    }

    return (
      <div className="results-grid">
        {resultados.map((cliente) => (
          <div key={cliente.id} className="result-card">
            <h3>{cliente.nome}</h3>
            <p>CPF: {cliente.cpf}</p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "auto",
                paddingTop: "1rem",
              }}
            >
              <button
                onClick={() => handleEditClick(cliente.id)}
                style={{ flex: 1 }}
              >
                Ver / Editar
              </button>
              <button
                onClick={() => handleDeleteClick(cliente)}
                style={{ flex: 1, backgroundColor: "#d93025" }}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Page title="Gerenciar Clientes">
      <div className="consultas-container">
        <div className="search-controls">
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Buscar cliente por nome..."
            className="search-input"
            autoComplete="off"
          />
        </div>
        <div className="results-container">{renderResultados()}</div>
      </div>
    </Page>
  );
}

export default GerenciarClientes;

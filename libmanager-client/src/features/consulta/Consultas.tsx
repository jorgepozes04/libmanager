import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  searchClientes,
  searchLivros,
  searchRevistas,
  type Cliente,
  type Livro,
  type Revista,
} from "../../services/apiService";
import "./Consultas.css"; // Usaremos o mesmo arquivo CSS, mas com novo conteúdo
import Page from "../../components/common/Page";

type Categoria = "clientes" | "livros" | "revistas";

function Consultas() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria>("clientes");
  const [termoBusca, setTermoBusca] = useState("");
  const [resultados, setResutados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // Efeito para buscar dados dinamicamente
  useEffect(() => {
    // Se não houver termo de busca, limpa os resultados
    if (!termoBusca.trim()) {
      setResutados([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErro("");

    // Debounce: Atraso para evitar buscas a cada tecla digitada
    const timer = setTimeout(async () => {
      try {
        let data;
        if (categoriaAtiva === "clientes") {
          data = await searchClientes(termoBusca);
        } else if (categoriaAtiva === "livros") {
          data = await searchLivros(termoBusca); // O backend já busca por título ou autor
        } else {
          data = await searchRevistas(termoBusca);
        }
        setResutados(data);
      } catch (error: any) {
        setErro(error.message || "Erro ao realizar a busca.");
        setResutados([]);
      } finally {
        setLoading(false);
      }
    }, 500); // A busca é acionada 500ms após o usuário parar de digitar

    return () => clearTimeout(timer); // Limpa o timer se o usuário continuar digitando
  }, [termoBusca, categoriaAtiva]);

  const handleRowClick = (id: number) => {
    navigate(`/${categoriaAtiva}/${id}`);
  };

  const getPlaceholderText = () => {
    switch (categoriaAtiva) {
      case "clientes":
        return "Buscar cliente por nome ou CPF...";
      case "livros":
        return "Buscar livro por título ou autor...";
      case "revistas":
        return "Buscar revista por título ou editora...";
      default:
        return "Buscar...";
    }
  };

  const renderResultados = () => {
    if (loading) return <p className="feedback-text">Buscando...</p>;
    if (erro) return <p className="mensagem-erro">{erro}</p>;
    if (termoBusca.trim() && resultados.length === 0) {
      return <p className="feedback-text">Nenhum resultado encontrado.</p>;
    }

    return (
      <div className="results-grid">
        {resultados.map((item) => {
          if (categoriaAtiva === "clientes") {
            const cliente = item as Cliente;
            return (
              <div key={cliente.id} className="result-card">
                <h3>{cliente.nome}</h3>
                <p>CPF: {cliente.cpf}</p>
                <button onClick={() => handleRowClick(cliente.id)}>
                  Ver Detalhes
                </button>
              </div>
            );
          }
          if (categoriaAtiva === "livros") {
            const livro = item as Livro;
            return (
              <div key={livro.id} className="result-card">
                <h3>{livro.titulo}</h3>
                <p>Autor: {livro.autor}</p>
                <span className="disponibilidade">
                  {livro.quantDisponivel} disponíveis
                </span>
                <button onClick={() => handleRowClick(livro.id)}>
                  Ver Detalhes
                </button>
              </div>
            );
          }
          if (categoriaAtiva === "revistas") {
            const revista = item as Revista;
            return (
              <div key={revista.id} className="result-card">
                <h3>{revista.titulo}</h3>
                <p>Editora: {revista.editora}</p>
                <p>
                  Publicação: {revista.mesPublicacao}/{revista.anoPublicacao}
                </p>
                <span className="disponibilidade">
                  {revista.quantDisponivel} disponíveis
                </span>
                <button onClick={() => handleRowClick(revista.id)}>
                  Ver Detalhes
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <Page title="Realizar Consultas">
      <div className="consultas-container">
        <div className="tabs-container">
          <button
            onClick={() => setCategoriaAtiva("clientes")}
            className={categoriaAtiva === "clientes" ? "active" : ""}
          >
            Clientes
          </button>
          <button
            onClick={() => setCategoriaAtiva("livros")}
            className={categoriaAtiva === "livros" ? "active" : ""}
          >
            Livros
          </button>
          <button
            onClick={() => setCategoriaAtiva("revistas")}
            className={categoriaAtiva === "revistas" ? "active" : ""}
          >
            Revistas
          </button>
        </div>

        <div className="search-controls">
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder={getPlaceholderText()}
            className="search-input"
          />
        </div>

        <div className="results-container">{renderResultados()}</div>
      </div>
    </Page>
  );
}

export default Consultas;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate
import {
  searchClientes,
  searchLivros,
  searchRevistas,
  type Cliente,
  type Livro,
  type Revista,
} from "../../services/apiService";
import "./Consultas.css";
import Page from "../../components/common/Page";

type Categoria = "clientes" | "livros" | "revistas";

function Consultas() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria>("clientes");
  const [termoBusca, setTermoBusca] = useState("");
  const [resultados, setResutados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate(); // Crie uma instância do navigate

  const handleBusca = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termoBusca.trim()) return;

    setLoading(true);
    setErro("");
    setResutados([]);

    try {
      let data;
      if (categoriaAtiva === "clientes") {
        data = await searchClientes(termoBusca);
      } else if (categoriaAtiva === "livros") {
        data = await searchLivros(termoBusca);
      } else {
        data = await searchRevistas(termoBusca);
      }
      setResutados(data);
    } catch (error: any) {
      setErro(error.message || "Erro ao realizar a busca.");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id: number) => {
    navigate(`/${categoriaAtiva}/${id}`);
  };

  const renderTabelaResultados = () => {
    if (loading) return <p>Buscando...</p>;
    if (erro) return <p className="mensagem-erro">{erro}</p>;
    if (resultados.length === 0) return <p>Nenhum resultado encontrado.</p>;

    if (categoriaAtiva === "clientes") {
      return (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CPF</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((cliente: Cliente) => (
              <tr
                key={cliente.id}
                onClick={() => handleRowClick(cliente.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{cliente.id}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.cpf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (categoriaAtiva === "livros") {
      return (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Disponíveis</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((livro: Livro) => (
              <tr
                key={livro.id}
                onClick={() => handleRowClick(livro.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{livro.id}</td>
                <td>{livro.titulo}</td>
                <td>{livro.autor}</td>
                <td>{livro.quantDisponivel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (categoriaAtiva === "revistas") {
      return (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Editora</th>
              <th>Publicação</th>
              <th>Disponíveis</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((revista: Revista) => (
              <tr
                key={revista.id}
                onClick={() => handleRowClick(revista.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{revista.id}</td>
                <td>{revista.titulo}</td>
                <td>{revista.editora}</td>
                <td>{`${revista.mesPublicacao}/${revista.anoPublicacao}`}</td>
                <td>{revista.quantDisponivel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return null;
  };

  return (
    <Page title="Realizar Consultas">
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

      <div className="search-container">
        <form onSubmit={handleBusca}>
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder={`Buscar ${categoriaAtiva} por nome/título...`}
          />
          <button type="submit">Buscar</button>
        </form>
      </div>

      <div className="results-container">{renderTabelaResultados()}</div>
    </Page>
  );
}

export default Consultas;

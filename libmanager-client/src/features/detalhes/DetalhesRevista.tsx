import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRevistaById, updateRevista } from "../../services/apiService";
import Page from "../../components/common/Page";
import "./Detalhes.css";
import type { Revista, RevistaRequest } from "../../services/apiService";

function DetalhesRevista() {
  const { id } = useParams<{ id: string }>();
  const [revista, setRevista] = useState<Revista | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchRevista = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getRevistaById(parseInt(id));
        setRevista(data);
      } catch (err) {
        setError("Falha ao carregar os dados da revista.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevista();
  }, [id]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!revista || !id) return;

    const revistaData: RevistaRequest = {
      titulo: revista.titulo,
      editora: revista.editora,
      mesPublicacao: revista.mesPublicacao,
      anoPublicacao: revista.anoPublicacao,
      quantDisponivel: revista.quantDisponivel,
    };

    try {
      const updatedRevista = await updateRevista(parseInt(id), revistaData);
      setRevista(updatedRevista);
      setEditMode(false);
    } catch (err) {
      alert("Falha ao atualizar a revista.");
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumberField = [
      "mesPublicacao",
      "anoPublicacao",
      "quantDisponivel",
    ].includes(name);
    setRevista((prev) =>
      prev
        ? { ...prev, [name]: isNumberField ? parseInt(value) || 0 : value }
        : null
    );
  };

  if (loading)
    return (
      <Page title="Carregando...">
        <p>Buscando dados da revista...</p>
      </Page>
    );
  if (error)
    return (
      <Page title="Erro">
        <p>{error}</p>
      </Page>
    );
  if (!revista)
    return (
      <Page title="Não encontrada">
        <p>Revista não encontrada.</p>
      </Page>
    );

  return (
    <Page title={editMode ? "Editando Revista" : revista.titulo}>
      <div className="detalhes-container">
        <div className="detalhes-card">
          <div className="detalhes-header">
            <h2>Dados da Revista</h2>
            <button
              onClick={() => {
                setEditMode(!editMode);
              }}
            >
              {editMode ? "Cancelar" : "Editar"}
            </button>
          </div>
          <div className="detalhes-body">
            {editMode ? (
              <form onSubmit={handleUpdate}>
                <div className="detalhes-campo">
                  <label>Título</label>
                  <input
                    name="titulo"
                    value={revista.titulo}
                    onChange={handleChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Editora</label>
                  <input
                    name="editora"
                    value={revista.editora}
                    onChange={handleChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Mês de Publicação</label>
                  <input
                    type="number"
                    name="mesPublicacao"
                    value={revista.mesPublicacao}
                    onChange={handleChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Ano de Publicação</label>
                  <input
                    type="number"
                    name="anoPublicacao"
                    value={revista.anoPublicacao}
                    onChange={handleChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Quantidade Disponível</label>
                  <input
                    type="number"
                    name="quantDisponivel"
                    value={revista.quantDisponivel}
                    onChange={handleChange}
                  />
                </div>
                <div className="detalhes-actions">
                  <button type="submit">Salvar</button>
                </div>
              </form>
            ) : (
              <>
                <div className="detalhes-campo">
                  <label>Título</label>
                  <span>{revista.titulo}</span>
                </div>
                <div className="detalhes-campo">
                  <label>Editora</label>
                  <span>{revista.editora}</span>
                </div>
                <div className="detalhes-campo">
                  <label>Publicação</label>
                  <span>{`${revista.mesPublicacao}/${revista.anoPublicacao}`}</span>
                </div>
                <div className="detalhes-campo">
                  <label>Quantidade Disponível</label>
                  <span>{revista.quantDisponivel}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}

export default DetalhesRevista;

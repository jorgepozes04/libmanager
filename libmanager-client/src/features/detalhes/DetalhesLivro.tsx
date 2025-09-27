import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getLivroById, updateLivro } from "../../services/apiService";
import Page from "../../components/common/Page";
import "./Detalhes.css";
import type { Livro } from "../../services/apiService";

// Esta interface já corresponde ao que a API espera para o update
type LivroFormData = Omit<Livro, "id">;

function DetalhesLivro() {
  const { id } = useParams<{ id: string }>();
  const [livro, setLivro] = useState<Livro | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<LivroFormData | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchLivro = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getLivroById(parseInt(id));
        setLivro(data);
        setFormData(data);
      } catch (err) {
        setError("Falha ao carregar os dados do livro.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLivro();
  }, [id]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData || !id) return;

    try {
      const updatedLivro = await updateLivro(parseInt(id), formData);
      setLivro(updatedLivro);
      setEditMode(false);
    } catch (err) {
      alert("Falha ao atualizar o livro.");
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "quantDisponivel" ? parseInt(value) : value,
          }
        : null
    );
  };

  if (loading)
    return (
      <Page title="Carregando...">
        <p>Buscando dados do livro...</p>
      </Page>
    );
  if (error)
    return (
      <Page title="Erro">
        <p>{error}</p>
      </Page>
    );
  if (!livro)
    return (
      <Page title="Não encontrado">
        <p>Livro não encontrado.</p>
      </Page>
    );

  return (
    <Page title={editMode ? "Editando Livro" : livro.titulo}>
      <div className="detalhes-container">
        <div className="detalhes-card">
          <div className="detalhes-header">
            <h2>Dados do Livro</h2>
            <button
              onClick={() => {
                setEditMode(!editMode);
                if (livro) {
                  setFormData(livro);
                }
              }}
            >
              {editMode ? "Cancelar" : "Editar"}
            </button>
          </div>
          <div className="detalhes-body">
            {editMode && formData ? (
              <form onSubmit={handleUpdate}>
                <div className="detalhes-campo">
                  <label>Título</label>
                  <input
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Autor</label>
                  <input
                    name="autor"
                    value={formData.autor}
                    onChange={handleChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Quantidade Disponível</label>
                  <input
                    type="number"
                    name="quantDisponivel"
                    value={formData.quantDisponivel}
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
                  <span>{livro.titulo}</span>
                </div>
                <div className="detalhes-campo">
                  <label>Autor</label>
                  <span>{livro.autor}</span>
                </div>
                <div className="detalhes-campo">
                  <label>Quantidade Disponível</label>
                  <span>{livro.quantDisponivel}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}

export default DetalhesLivro;

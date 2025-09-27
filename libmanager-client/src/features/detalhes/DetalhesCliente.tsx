import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getClienteById, updateCliente } from "../../services/apiService";
import Page from "../../components/common/Page";
import "./Detalhes.css";
import type { Cliente, Endereco } from "../../services/apiService";

// A interface para os dados do formulário pode ser mais simples
interface ClienteFormData {
  nome: string;
  cpf: string;
  // Adicione outros campos do endereço se a edição for necessária
}

function DetalhesCliente() {
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ClienteFormData | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCliente = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getClienteById(parseInt(id));
        setCliente(data);
        setFormData({ nome: data.nome, cpf: data.cpf }); // Popula o formulário
      } catch (err) {
        setError("Falha ao carregar os dados do cliente.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [id]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData || !id) return;

    // Recria o objeto completo para a API, assumindo que o endereço não muda
    const clienteData = { ...cliente, ...formData } as Cliente & {
      endereco: Endereco;
    };

    try {
      const updatedCliente = await updateCliente(parseInt(id), clienteData);
      setCliente(updatedCliente);
      setEditMode(false);
    } catch (err) {
      alert("Falha ao atualizar o cliente.");
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  if (loading)
    return (
      <Page title="Carregando...">
        <p>Buscando dados do cliente...</p>
      </Page>
    );
  if (error)
    return (
      <Page title="Erro">
        <p>{error}</p>
      </Page>
    );
  if (!cliente)
    return (
      <Page title="Não encontrado">
        <p>Cliente não encontrado.</p>
      </Page>
    );

  return (
    <Page title={editMode ? "Editando Cliente" : cliente.nome}>
      <div className="detalhes-container">
        <div className="detalhes-card">
          <div className="detalhes-header">
            <h2>Dados do Cliente</h2>
            <button
              onClick={() => {
                setEditMode(!editMode);
                if (cliente) {
                  // Reseta o form ao cancelar
                  setFormData({ nome: cliente.nome, cpf: cliente.cpf });
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
                  <label>Nome</label>
                  <input
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>CPF</label>
                  <input
                    name="cpf"
                    value={formData.cpf}
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
                  <label>Nome</label>
                  <span>{cliente.nome}</span>
                </div>
                <div className="detalhes-campo">
                  <label>CPF</label>
                  <span>{cliente.cpf}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}

export default DetalhesCliente;

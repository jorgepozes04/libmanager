import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getClienteById, updateCliente } from "../../services/apiService";
import Page from "../../components/common/Page";
import "./Detalhes.css";
import type { Cliente, ClienteRequest } from "../../services/apiService";

function DetalhesCliente() {
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchCliente = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getClienteById(parseInt(id));
        setCliente(data);
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
    if (!cliente || !id) return;

    const clienteData: ClienteRequest = {
      nome: cliente.nome,
      cpf: cliente.cpf,
      endereco: {
        rua: cliente.endereco.rua,
        numero: cliente.endereco.numero,
        complemento: cliente.endereco.complemento,
        bairro: cliente.endereco.bairro,
        cidade: cliente.endereco.cidade,
        estado: cliente.endereco.estado,
        cep: cliente.endereco.cep,
      },
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
    setCliente((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente((prev) =>
      prev
        ? {
            ...prev,
            endereco: {
              ...prev.endereco,
              [name]: value,
            },
          }
        : null
    );
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
              }}
            >
              {editMode ? "Cancelar" : "Editar"}
            </button>
          </div>
          <div className="detalhes-body">
            {editMode ? (
              <form onSubmit={handleUpdate}>
                <div className="detalhes-campo">
                  <label>Nome</label>
                  <input
                    name="nome"
                    value={cliente.nome}
                    onChange={handleChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>CPF</label>
                  <input
                    name="cpf"
                    value={cliente.cpf}
                    onChange={handleChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Rua</label>
                  <input
                    name="rua"
                    value={cliente.endereco.rua}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Número</label>
                  <input
                    name="numero"
                    value={cliente.endereco.numero}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Bairro</label>
                  <input
                    name="bairro"
                    value={cliente.endereco.bairro}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Cidade</label>
                  <input
                    name="cidade"
                    value={cliente.endereco.cidade}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Estado</label>
                  <input
                    name="estado"
                    value={cliente.endereco.estado}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>CEP</label>
                  <input
                    name="cep"
                    value={cliente.endereco.cep}
                    onChange={handleEnderecoChange}
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
                <div className="detalhes-campo">
                  <label>Endereço</label>
                  <span>
                    {`${cliente.endereco.rua}, ${cliente.endereco.numero} - ${cliente.endereco.bairro}, ${cliente.endereco.cidade} - ${cliente.endereco.estado}, ${cliente.endereco.cep}`}
                  </span>
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

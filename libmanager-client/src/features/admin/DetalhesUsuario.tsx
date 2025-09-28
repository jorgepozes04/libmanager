import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getUsuarioById,
  updateUsuario,
  type UsuarioRequest,
  type UsuarioDetalhes, // Importe o tipo correto
} from "../../services/apiService";
import Page from "../../components/common/Page";
import "../detalhes/Detalhes.css"; // Reutilizando o CSS

function DetalhesUsuario() {
  const { id } = useParams<{ id: string }>();
  // Corrija o tipo do estado
  const [usuario, setUsuario] = useState<UsuarioDetalhes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchUsuario = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getUsuarioById(parseInt(id));
        setUsuario(data); // Agora os tipos são compatíveis
      } catch (err) {
        setError("Falha ao carregar os dados do usuário.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!usuario || !id) return;

    // A requisição usa apenas os campos necessários para a atualização
    const usuarioData: UsuarioRequest = {
      nome: usuario.nome,
      cpf: usuario.cpf,
      nomeUsuario: usuario.nomeUsuario,
      endereco: {
        rua: usuario.endereco.rua,
        numero: usuario.endereco.numero,
        complemento: usuario.endereco.complemento || "",
        bairro: usuario.endereco.bairro,
        cidade: usuario.endereco.cidade,
        estado: usuario.endereco.estado,
        cep: usuario.endereco.cep,
      },
    };

    try {
      const updatedUsuario = await updateUsuario(parseInt(id), usuarioData);
      setUsuario(updatedUsuario);
      setEditMode(false);
      alert("Usuário atualizado com sucesso!");
    } catch (err) {
      alert("Falha ao atualizar o usuário.");
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario((prev) =>
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
        <p>Buscando dados do usuário...</p>
      </Page>
    );
  if (error)
    return (
      <Page title="Erro">
        <p>{error}</p>
      </Page>
    );
  if (!usuario)
    return (
      <Page title="Não encontrado">
        <p>Usuário não encontrado.</p>
      </Page>
    );

  return (
    <Page title={editMode ? "Editando Usuário" : usuario.nome}>
      <div className="detalhes-container">
        <div className="detalhes-card">
          <div className="detalhes-header">
            <h2>Dados do Usuário</h2>
            <button onClick={() => setEditMode(!editMode)}>
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
                    value={usuario.nome}
                    onChange={handleChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>CPF</label>
                  <input
                    name="cpf"
                    value={usuario.cpf}
                    onChange={handleChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Username</label>
                  <input
                    name="nomeUsuario"
                    value={usuario.nomeUsuario}
                    onChange={handleChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Rua</label>
                  <input
                    name="rua"
                    value={usuario.endereco.rua}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Número</label>
                  <input
                    name="numero"
                    value={usuario.endereco.numero}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Bairro</label>
                  <input
                    name="bairro"
                    value={usuario.endereco.bairro}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Cidade</label>
                  <input
                    name="cidade"
                    value={usuario.endereco.cidade}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>Estado</label>
                  <input
                    name="estado"
                    value={usuario.endereco.estado}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div className="detalhes-campo">
                  <label>CEP</label>
                  <input
                    name="cep"
                    value={usuario.endereco.cep}
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
                  <span>{usuario.nome}</span>
                </div>
                <div className="detalhes-campo">
                  <label>CPF</label>
                  <span>{usuario.cpf}</span>
                </div>
                <div className="detalhes-campo">
                  <label>Username</label>
                  <span>{usuario.nomeUsuario}</span>
                </div>
                <div className="detalhes-campo">
                  <label>Cargo</label>
                  <span>{usuario.cargo}</span>
                </div>
                <div className="detalhes-campo">
                  <label>Status</label>
                  <span>{usuario.status}</span>
                </div>
                <div className="detalhes-campo">
                  <label>Endereço</label>
                  <span>{`${usuario.endereco.rua}, ${usuario.endereco.numero} - ${usuario.endereco.bairro}, ${usuario.endereco.cidade}`}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}

export default DetalhesUsuario;

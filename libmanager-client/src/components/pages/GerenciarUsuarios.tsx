import React, { useEffect, useState } from "react";
import {
  listarUsuarios,
  criarUsuario,
  type Usuario,
} from "../../services/apiService";
import "./GerenciarUsuarios.css";

const initialFormData = {
  nome: "",
  cpf: "",
  nomeUsuario: "",
  senha: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  cep: "",
};

function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formErro, setFormErro] = useState("");

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErro("");

    const usuarioData = {
      nome: formData.nome,
      cpf: formData.cpf,
      nomeUsuario: formData.nomeUsuario,
      senha: formData.senha,
      endereco: {
        rua: formData.rua,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep,
      },
    };

    try {
      await criarUsuario(usuarioData);
      alert("Usuário criado com sucesso!");
      setFormData(initialFormData); // Limpa o formulário
      setShowForm(false); // Esconde o formulário
      fetchUsuarios(); // Recarrega a lista
    } catch (error: any) {
      setFormErro(error.message);
    }
  };

  if (loading) return <p>Carregando usuários...</p>;
  if (erro) return <p className="mensagem-erro">{erro}</p>;

  return (
    <div className="card">
      <div className="header-container">
        <h1>Gerenciar Usuários</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Adicionar Novo Usuário"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>Novo Usuário</h2>
          <form onSubmit={handleSubmit}>
            {/* Reutilizando a estrutura de CadastroCliente para os campos */}
            <div className="form-section">
              <div className="input-group">
                <label>Nome Completo</label>
                <input
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>CPF</label>
                <input
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-section">
              <div className="input-group">
                <label>Nome de Usuário (login)</label>
                <input
                  name="nomeUsuario"
                  value={formData.nomeUsuario}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Senha</label>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-section">
              <label>Endereço</label>
              <input
                name="rua"
                placeholder="Rua"
                value={formData.rua}
                onChange={handleChange}
                required
              />
              <input
                name="numero"
                placeholder="Número"
                value={formData.numero}
                onChange={handleChange}
                required
              />
              <input
                name="bairro"
                placeholder="Bairro"
                value={formData.bairro}
                onChange={handleChange}
                required
              />
              <input
                name="cidade"
                placeholder="Cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
              />
              <input
                name="estado"
                placeholder="Estado (UF)"
                value={formData.estado}
                onChange={handleChange}
                maxLength={2}
                required
              />
              <input
                name="cep"
                placeholder="CEP"
                value={formData.cep}
                onChange={handleChange}
                required
              />
            </div>

            {formErro && <p className="mensagem-erro">{formErro}</p>}
            <button type="submit">Salvar Usuário</button>
          </form>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Username</th>
            <th>Cargo</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome}</td>
              <td>{user.nomeUsuario}</td>
              <td>{user.cargo}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GerenciarUsuarios;

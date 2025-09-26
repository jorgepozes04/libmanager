import React, { useState } from "react";
import { cadastrarRevista } from "../../services/apiService";
import "./CadastroRevista.css";
import Page from "../common/Page";

function CadastroRevista() {
  const [formData, setFormData] = useState({
    titulo: "",
    editora: "",
    mesPublicacao: new Date().getMonth() + 1,
    anoPublicacao: new Date().getFullYear(),
    quantDisponivel: 1,
  });

  const [mensagem, setMensagem] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "number" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");
    setIsError(false);

    try {
      const novaRevista = await cadastrarRevista(formData);
      setIsError(false);
      setMensagem(`Revista "${novaRevista.titulo}" cadastrada com sucesso!`);
      setFormData({
        titulo: "",
        editora: "",
        mesPublicacao: new Date().getMonth() + 1,
        anoPublicacao: new Date().getFullYear(),
        quantDisponivel: 1,
      });
    } catch (error: any) {
      setIsError(true);
      setMensagem(error.message || "Ocorreu um erro ao cadastrar a revista.");
    }
  };

  return (
    <Page title="Cadastro de Revista">
      <form onSubmit={handleSubmit} className="cadastro-form">
        <div className="input-group">
          <label htmlFor="titulo">Título da Revista</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="editora">Editora</label>
          <input
            type="text"
            id="editora"
            name="editora"
            value={formData.editora}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <div className="input-group">
            <label htmlFor="mesPublicacao">Mês de Publicação</label>
            <input
              type="number"
              id="mesPublicacao"
              name="mesPublicacao"
              value={formData.mesPublicacao}
              onChange={handleChange}
              required
              min="1"
              max="12"
            />
          </div>
          <div className="input-group">
            <label htmlFor="anoPublicacao">Ano de Publicação</label>
            <input
              type="number"
              id="anoPublicacao"
              name="anoPublicacao"
              value={formData.anoPublicacao}
              onChange={handleChange}
              required
              min="1900"
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="quantDisponivel">Quantidade Disponível</label>
          <input
            type="number"
            id="quantDisponivel"
            name="quantDisponivel"
            value={formData.quantDisponivel}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <button type="submit">Cadastrar Revista</button>
      </form>
      {mensagem && (
        <p className={isError ? "mensagem-erro" : "mensagem-sucesso"}>
          {mensagem}
        </p>
      )}
    </Page>
  );
}

export default CadastroRevista;
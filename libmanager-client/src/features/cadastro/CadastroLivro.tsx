import React, { useState } from "react";
import { cadastrarLivro } from "../../services/apiService";
import "./CadastroLivro.css";
import Page from "../../components/common/Page";

function CadastroLivro() {
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
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

    if (formData.quantDisponivel <= 0) {
      setIsError(true);
      setMensagem("A quantidade disponível deve ser maior que zero.");
      return;
    }

    try {
      const novoLivro = await cadastrarLivro(formData);
      setIsError(false);
      setMensagem(`Livro "${novoLivro.titulo}" cadastrado com sucesso!`);
      setFormData({
        titulo: "",
        autor: "",
        quantDisponivel: 1,
      });
    } catch (error: any) {
      setIsError(true);
      setMensagem(error.message || "Ocorreu um erro ao cadastrar o livro.");
    }
  };

  return (
    <Page title="Cadastro de Livro">
      <form onSubmit={handleSubmit} className="cadastro-form">
        <div className="input-group">
          <label htmlFor="titulo">Título do Livro</label>
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
          <label htmlFor="autor">Autor</label>
          <input
            type="text"
            id="autor"
            name="autor"
            value={formData.autor}
            onChange={handleChange}
            required
          />
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

        <button type="submit">Cadastrar Livro</button>
      </form>
      {mensagem && (
        <p className={isError ? "mensagem-erro" : "mensagem-sucesso"}>
          {mensagem}
        </p>
      )}
    </Page>
  );
}

export default CadastroLivro;

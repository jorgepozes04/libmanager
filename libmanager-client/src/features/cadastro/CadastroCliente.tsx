import React, { useState } from "react";
import { cadastrarCliente } from "../../services/apiService";
import "./CadastroCliente.css";
import Page from "../../components/common/Page";

function CadastroCliente() {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");
    setIsError(false);

    const clienteData = {
      nome: formData.nome,
      cpf: formData.cpf,
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
      const novoCliente = await cadastrarCliente(clienteData);
      setIsError(false);
      setMensagem(`Cliente "${novoCliente.nome}" cadastrado com sucesso!`);
      setFormData({
        nome: "",
        cpf: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
      });
    } catch (error: any) {
      setIsError(true);
      setMensagem(error.message || "Ocorreu um erro.");
    }
  };

  return (
    <Page title="Cadastro de Cliente">
      <form onSubmit={handleSubmit} className="cadastro-form">
        <div className="form-section">
          <h2>Dados Pessoais</h2>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="nome">Nome Completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Endereço</h2>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="cep">CEP</label>
              <input
                type="text"
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group" style={{ flex: 2 }}>
              <label htmlFor="rua">Rua</label>
              <input
                type="text"
                id="rua"
                name="rua"
                value={formData.rua}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="numero">Número</label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="complemento">Complemento</label>
              <input
                type="text"
                id="complemento"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="bairro">Bairro</label>
              <input
                type="text"
                id="bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="cidade">Cidade</label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group" style={{ flex: 0.5 }}>
              <label htmlFor="estado">Estado</label>
              <input
                type="text"
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                maxLength={2}
                required
              />
            </div>
          </div>
        </div>

        <button type="submit">Cadastrar Cliente</button>
      </form>
      {mensagem && (
        <p className={isError ? "mensagem-erro" : "mensagem-sucesso"}>
          {mensagem}
        </p>
      )}
    </Page>
  );
}

export default CadastroCliente;

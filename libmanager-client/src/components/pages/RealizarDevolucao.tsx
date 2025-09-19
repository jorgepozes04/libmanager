import { useState, useEffect } from "react";
import {
  searchClientes,
  buscarEmprestimoAtivo,
  realizarDevolucao,
  type Cliente,
  type Emprestimo,
  type DevolucaoResponse,
} from "../../services/apiService";
import "./RealizarDevolucao.css";

function RealizarDevolucao() {
  const [clienteQuery, setClienteQuery] = useState("");
  const [clienteResults, setClienteResults] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const [emprestimoAtivo, setEmprestimoAtivo] = useState<Emprestimo | null>(
    null
  );
  const [devolucaoResultado, setDevolucaoResultado] =
    useState<DevolucaoResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (clienteQuery.trim() === "") {
      setClienteResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchClientes(clienteQuery);
      setClienteResults(results);
    }, 300); // Debounce de 300ms
    return () => clearTimeout(timer);
  }, [clienteQuery]);

  // Função para quando um cliente é selecionado da lista
  const handleSelectCliente = async (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setClienteQuery("");
    setClienteResults([]);
    setErro("");
    setDevolucaoResultado(null);
    setLoading(true);

    try {
      const emprestimo = await buscarEmprestimoAtivo(cliente.id);
      setEmprestimoAtivo(emprestimo);
    } catch (error: any) {
      setErro(error.message);
      setEmprestimoAtivo(null);
    } finally {
      setLoading(false);
    }
  };

  // Função para confirmar a devolução
  const handleDevolucao = async () => {
    if (!emprestimoAtivo) return;

    setLoading(true);
    setErro("");
    try {
      const resultado = await realizarDevolucao(emprestimoAtivo.id);
      setDevolucaoResultado(resultado);
      setEmprestimoAtivo(null); // Limpa o empréstimo da tela
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setSelectedCliente(null);
    setEmprestimoAtivo(null);
    setDevolucaoResultado(null);
    setErro("");
  };

  return (
    <div className="card">
      <h1>Realizar Devolução</h1>

      {!selectedCliente ? (
        // Etapa 1: Buscar Cliente
        <div className="input-group">
          <label htmlFor="clienteQuery">Buscar Cliente por Nome</label>
          <input
            type="text"
            id="clienteQuery"
            value={clienteQuery}
            onChange={(e) => setClienteQuery(e.target.value)}
            placeholder="Comece a digitar o nome do cliente..."
          />
          {clienteResults.length > 0 && (
            <ul className="search-results">
              {clienteResults.map((cliente) => (
                <li
                  key={cliente.id}
                  onClick={() => handleSelectCliente(cliente)}
                >
                  {cliente.nome} - CPF: {cliente.cpf}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        // Etapa 2: Exibir Empréstimo e Realizar Devolução
        <div>
          <div className="selecao-info">
            <p>
              <strong>Cliente:</strong> {selectedCliente.nome}
            </p>
            <button className="btn-link" onClick={resetState}>
              Buscar outro cliente
            </button>
          </div>

          {loading && <p>Buscando empréstimo...</p>}
          {erro && <p className="mensagem-erro">{erro}</p>}

          {emprestimoAtivo && (
            <div className="emprestimo-detalhes">
              <h4>Empréstimo Ativo Encontrado</h4>
              <p>
                <strong>Livro:</strong> {emprestimoAtivo.livro.titulo}
              </p>
              <p>
                <strong>Data do Empréstimo:</strong>{" "}
                {new Date(emprestimoAtivo.dataEmprestimo).toLocaleDateString()}
              </p>
              <p>
                <strong>Devolução Prevista:</strong>{" "}
                {new Date(
                  emprestimoAtivo.dataDevolucaoPrevista
                ).toLocaleDateString()}
              </p>
              <button onClick={handleDevolucao} disabled={loading}>
                {loading ? "Processando..." : "Confirmar Devolução deste Livro"}
              </button>
            </div>
          )}

          {!loading && !emprestimoAtivo && !devolucaoResultado && (
            <p>Este cliente não possui empréstimos ativos no momento.</p>
          )}

          {devolucaoResultado && (
            <div className="resultado-devolucao">
              <h3>{devolucaoResultado.mensagem}</h3>
              <p>
                <strong>ID do Empréstimo:</strong>{" "}
                {devolucaoResultado.emprestimoId}
              </p>
              <p>
                <strong>Status Final:</strong>{" "}
                {devolucaoResultado.statusFinal.replace("_", " ")}
              </p>
              {devolucaoResultado.valorMulta > 0 && (
                <p className="multa">
                  <strong>Multa a Pagar:</strong> R${" "}
                  {devolucaoResultado.valorMulta.toFixed(2)}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RealizarDevolucao;

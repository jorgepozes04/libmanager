import { useState, useEffect, useRef } from "react";
import { searchClientes } from "../../services/consultaService";
import {
  buscarEmprestimoAtivo,
  realizarDevolucao,
} from "../../services/emprestimoService";
import type { Cliente, Emprestimo, DevolucaoResponse } from "../../types/api";
import "./RealizarDevolucao.css";
import Page from "../../components/common/Page";

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

  // Novo estado e ref para a busca
  const [showClienteResults, setShowClienteResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Efeito para buscar clientes
  useEffect(() => {
    if (!showClienteResults) return;
    const timer = setTimeout(async () => {
      const results = await searchClientes(clienteQuery);
      setClienteResults(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [clienteQuery, showClienteResults]);

  // Efeito para fechar a lista ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowClienteResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectCliente = async (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setClienteQuery(cliente.nome);
    setShowClienteResults(false); // Esconde a lista após selecionar
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

  const handleDevolucao = async () => {
    if (!emprestimoAtivo) return;

    setLoading(true);
    setErro("");
    try {
      const resultado = await realizarDevolucao(emprestimoAtivo.id);
      setDevolucaoResultado(resultado);
      setEmprestimoAtivo(null);
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setSelectedCliente(null);
    setClienteQuery("");
    setEmprestimoAtivo(null);
    setDevolucaoResultado(null);
    setErro("");
  };

  return (
    <Page title="Realizar Devolução">
      <div className="form-section">
        <h2>1. Busque o Cliente</h2>
        <div className="input-group" ref={searchRef}>
          <input
            type="text"
            id="clienteQuery"
            value={clienteQuery}
            onChange={(e) => setClienteQuery(e.target.value)}
            onFocus={() => setShowClienteResults(true)}
            placeholder="Comece a digitar o nome do cliente..."
            disabled={!!selectedCliente}
            autoComplete="off"
          />
          {showClienteResults && clienteResults.length > 0 && (
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
        {selectedCliente && (
          <button className="btn-link" onClick={resetState}>
            Limpar e buscar outro cliente
          </button>
        )}
      </div>

      {selectedCliente && (
        <div className="form-section">
          <h2>2. Confirme a Devolução</h2>
          {loading && <p>Buscando empréstimo...</p>}
          {erro && <p className="mensagem mensagem-erro">{erro}</p>}

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
                {loading ? "Processando..." : "Confirmar Devolução"}
              </button>
            </div>
          )}

          {!loading && !emprestimoAtivo && !devolucaoResultado && !erro && (
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
    </Page>
  );
}

export default RealizarDevolucao;

import apiClient from "./apiClient";
import type {
  EmprestimoRequest,
  DevolucaoResponse,
  Emprestimo,
} from "../types/api";
import axios from "axios";

export const realizarEmprestimo = async (data: EmprestimoRequest) => {
  try {
    const response = await apiClient.post(`/emprestimos`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const buscarEmprestimoAtivo = async (
  clienteId: number
): Promise<Emprestimo | null> => {
  try {
    const response = await apiClient.get(
      `/emprestimos/cliente/${clienteId}/ativo`
    );
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 404
    ) {
      return null;
    }
    throw new Error("Falha ao buscar empréstimo.");
  }
};

export const realizarDevolucao = async (
  emprestimoId: number
): Promise<DevolucaoResponse> => {
  try {
    const response = await apiClient.post(
      `/emprestimos/${emprestimoId}/devolver`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data || "Falha ao processar devolução.");
    }
    throw new Error("Falha na comunicação com o servidor.");
  }
};

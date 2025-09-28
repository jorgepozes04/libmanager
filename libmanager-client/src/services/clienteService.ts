import apiClient from "./apiClient";
import type { ClienteRequest } from "../types/api";
import axios from "axios";

export const cadastrarCliente = async (data: ClienteRequest) => {
  try {
    const response = await apiClient.post(`/clientes`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Falha ao cadastrar cliente."
      );
    }
    throw new Error("Falha na comunicação com o servidor.");
  }
};

export const getClienteById = async (id: number) => {
  const response = await apiClient.get(`/consultas/clientes/${id}`);
  return response.data;
};

export const updateCliente = async (id: number, data: ClienteRequest) => {
  const response = await apiClient.put(`/clientes/${id}`, data);
  return response.data;
};

export const deleteCliente = async (id: number) => {
  try {
    await apiClient.delete(`/clientes/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data || "Falha ao excluir cliente.");
    }
    throw new Error("Falha na comunicação com o servidor.");
  }
};

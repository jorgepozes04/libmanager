import apiClient from "./apiClient";
import type {
  Usuario,
  UsuarioDetalhes,
  UsuarioRequest,
  AdminPasswordRequest,
} from "../types/api";
import axios from "axios";

export const listarUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await apiClient.get(`/admin/usuarios`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 403) {
        throw new Error("Você não tem permissão para acessar este recurso.");
      }
      throw new Error(
        error.response.data.message || "Falha ao buscar usuários."
      );
    }
    throw new Error("Falha na comunicação com o servidor.");
  }
};

export const criarUsuario = async (data: UsuarioRequest) => {
  try {
    const response = await apiClient.post(`/admin/usuarios`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Falha ao criar usuário.");
    }
    throw new Error("Falha na comunicação com o servidor.");
  }
};

export const getUsuarioById = async (id: number): Promise<UsuarioDetalhes> => {
  const response = await apiClient.get(`/admin/usuarios/${id}`);
  return response.data;
};

export const updateUsuario = async (id: number, data: UsuarioRequest) => {
  const response = await apiClient.put(`/admin/usuarios/${id}`, data);
  return response.data;
};

export const deleteUsuario = async (id: number, data: AdminPasswordRequest) => {
  try {
    const response = await apiClient.delete(`/admin/usuarios/${id}`, {
      data: data,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data || "Falha ao remover usuário.");
    }
    throw new Error("Falha na comunicação com o servidor.");
  }
};

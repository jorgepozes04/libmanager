// src/services/publicacaoService.ts

import apiClient from "./apiClient";
import type { LivroRequest, RevistaRequest } from "../types/api";
import axios from "axios";

export const cadastrarLivro = async (data: LivroRequest) => {
  try {
    const response = await apiClient.post(`/publicacoes/livros`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Falha ao cadastrar livro."
      );
    }
    throw new Error("Falha na comunicação com o servidor.");
  }
};

export const cadastrarRevista = async (data: RevistaRequest) => {
  try {
    const response = await apiClient.post(`/publicacoes/revistas`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Falha ao cadastrar revista."
      );
    }
    throw new Error("Falha na comunicação com o servidor.");
  }
};

export const getLivroById = async (id: number) => {
  const response = await apiClient.get(`/consultas/livros/${id}`);
  return response.data;
};

export const getRevistaById = async (id: number) => {
  const response = await apiClient.get(`/consultas/revistas/${id}`);
  return response.data;
};

export const updateLivro = async (id: number, data: LivroRequest) => {
  const response = await apiClient.put(`/publicacoes/livros/${id}`, data);
  return response.data;
};

export const updateRevista = async (id: number, data: RevistaRequest) => {
  const response = await apiClient.put(`/publicacoes/revistas/${id}`, data);
  return response.data;
};

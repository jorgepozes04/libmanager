import apiClient from "./apiClient";
import type { LoginRequest, SetupRequest } from "../types/api";
import axios from "axios";

export const login = async (data: LoginRequest) => {
  try {
    const response = await apiClient.post(`/auth/login`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data || "Erro desconhecido no login.");
    }
    throw new Error("Falha na comunicação com o servidor.");
  }
};

export const needsSetup = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get(`/auth/needs-setup`);
    return response.data.needsSetup;
  } catch (error) {
    console.error("Falha ao verificar a necessidade de configuração:", error);
    return false;
  }
};

export const setupAdmin = async (data: SetupRequest) => {
  try {
    const response = await apiClient.post(`/auth/setup`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Falha ao configurar admin."
      );
    }
    throw new Error("Falha na comunicação com o servidor.");
  }
};

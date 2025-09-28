import apiClient from "./apiClient";

export const searchClientes = async (nome: string) => {
  try {
    const response = await apiClient.get(`/consultas/clientes`, {
      params: { nome },
    });
    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar clientes.");
  }
};

export const searchLivros = async (titulo: string) => {
  try {
    const response = await apiClient.get(`/consultas/livros`, {
      params: { titulo },
    });
    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar livros.");
  }
};

export const searchRevistas = async (titulo: string) => {
  try {
    const response = await apiClient.get(`/consultas/revistas`, {
      params: { titulo },
    });
    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar revistas.");
  }
};

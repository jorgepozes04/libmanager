import axios from "axios";

const API_URL = "http://localhost:8080/api";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Interfaces ---

export interface Endereco {
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface EmprestimoRequest {
  idLivro: number;
  idCliente: number;
  idUsuario: number;
}

export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface ClienteRequest {
  nome: string;
  cpf: string;
  endereco: Endereco;
}

export interface LivroRequest {
  titulo: string;
  autor: string;
  quantDisponivel: number;
}

export interface RevistaRequest {
  titulo: string;
  editora: string;
  mesPublicacao: number;
  anoPublicacao: number;
  quantDisponivel: number;
}

export interface UsuarioRequest {
  nome: string;
  cpf: string;
  nomeUsuario: string;
  senha?: string;
  endereco: Endereco;
}

export interface Publicacao {
  id: number;
  titulo: string;
  quantDisponivel: number;
}

export interface Livro extends Publicacao {
  autor: string;
}

export interface Revista extends Publicacao {
  editora: string;
  mesPublicacao: number;
  anoPublicacao: number;
}

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  endereco: Endereco;
}

export interface Emprestimo {
  id: number;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  livro: Livro;
}

export interface DevolucaoResponse {
  mensagem: string;
  emprestimoId: number;
  statusFinal: string;
  valorMulta: number;
}

// Interface para a lista de usuários (simplificada)
export interface Usuario {
  id: number;
  nome: string;
  nomeUsuario: string;
  cargo: string;
  status: string;
}

// NOVA interface para os detalhes do usuário (completa)
export interface UsuarioDetalhes {
  id: number;
  nome: string;
  cpf: string;
  nomeUsuario: string;
  cargo: string;
  status: string;
  endereco: Endereco;
}

// --- Funções da API ---

export const realizarEmprestimo = async (data: EmprestimoRequest) => {
  try {
    const response = await axios.post(`${API_URL}/emprestimos`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (data: LoginRequest) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data || "Erro desconhecido no login.");
    }
    throw new Error("Falha na comunicação com o servidor.");
  }
};

export const searchClientes = async (nome: string) => {
  try {
    const response = await axios.get(`${API_URL}/consultas/clientes`, {
      params: { nome },
    });
    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar clientes.");
  }
};

export const searchLivros = async (titulo: string) => {
  try {
    const response = await axios.get(`${API_URL}/consultas/livros`, {
      params: { titulo },
    });
    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar livros.");
  }
};

export const cadastrarCliente = async (data: ClienteRequest) => {
  try {
    const response = await axios.post(`${API_URL}/clientes`, data);
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

export const cadastrarLivro = async (data: LivroRequest) => {
  try {
    const response = await axios.post(`${API_URL}/publicacoes/livros`, data);
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

export const searchRevistas = async (titulo: string) => {
  try {
    const response = await axios.get(`${API_URL}/consultas/revistas`, {
      params: { titulo },
    });
    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar revistas.");
  }
};

export const cadastrarRevista = async (data: RevistaRequest) => {
  try {
    const response = await axios.post(`${API_URL}/publicacoes/revistas`, data);
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

export const buscarEmprestimoAtivo = async (
  clienteId: number
): Promise<Emprestimo | null> => {
  try {
    const response = await axios.get(
      `${API_URL}/emprestimos/cliente/${clienteId}/ativo`
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
    const response = await axios.post(
      `${API_URL}/emprestimos/${emprestimoId}/devolver`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data || "Falha ao processar devolução.");
    }
    throw new Error("Falha na comunicação com o servidor.");
  }
};

export const listarUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await axios.get(`${API_URL}/admin/usuarios`);
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
    const response = await axios.post(`${API_URL}/admin/usuarios`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Falha ao criar usuário.");
    }
    throw new Error("Falha na comunicação com o servidor.");
  }
};

export const getClienteById = async (id: number) => {
  const response = await axios.get(`${API_URL}/consultas/clientes/${id}`);
  return response.data;
};

export const getLivroById = async (id: number) => {
  const response = await axios.get(`${API_URL}/consultas/livros/${id}`);
  return response.data;
};

export const getRevistaById = async (id: number) => {
  const response = await axios.get(`${API_URL}/consultas/revistas/${id}`);
  return response.data;
};

export const updateCliente = async (id: number, data: ClienteRequest) => {
  const response = await axios.put(`${API_URL}/clientes/${id}`, data);
  return response.data;
};

export const updateLivro = async (id: number, data: LivroRequest) => {
  const response = await axios.put(`${API_URL}/publicacoes/livros/${id}`, data);
  return response.data;
};

export const updateRevista = async (id: number, data: RevistaRequest) => {
  const response = await axios.put(
    `${API_URL}/publicacoes/revistas/${id}`,
    data
  );
  return response.data;
};

// Função MODIFICADA para retornar o tipo de detalhe correto
export const getUsuarioById = async (id: number): Promise<UsuarioDetalhes> => {
  const response = await axios.get(`${API_URL}/admin/usuarios/${id}`);
  return response.data;
};

export const updateUsuario = async (id: number, data: UsuarioRequest) => {
  const response = await axios.put(`${API_URL}/admin/usuarios/${id}`, data);
  return response.data;
};

import axios from "axios";

// Define a URL base da nossa API Spring Boot
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

// Para realizar empréstimo
interface EmprestimoRequest {
  idLivro: number;
  idCliente: number;
  idUsuario: number;
}

// Para realizar login
interface LoginRequest {
  username?: string;
  password?: string;
}

interface Endereco {
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface ClienteRequest {
  nome: string;
  cpf: string;
  endereco: Endereco;
}

interface LivroRequest {
  titulo: string;
  autor: string;
  quantDisponivel: number;
}

interface Publicacao {
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
}

interface RevistaRequest {
  titulo: string;
  editora: string;
  mesPublicacao: number;
  anoPublicacao: number;
  quantDisponivel: number;
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

export interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  nomeUsuario: string;
  cargo: string;
  status: string;
}

// Usado para criar um novo usuário
interface UsuarioRequest {
  nome: string;
  cpf: string;
  nomeUsuario: string;
  senha?: string; // Senha é opcional aqui, mas requerida no form
  endereco: Endereco;
}

// Função para realizar o empréstimo
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
    // Envia a requisição POST para o endpoint de autenticação
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data; // Retorna os dados da resposta (ex: { mensagem, nomeUsuario })
  } catch (error) {
    // Lança o erro para ser tratado no componente de Login
    if (axios.isAxiosError(error) && error.response) {
      // Se o backend retornou uma mensagem de erro (ex: "Usuário ou senha inválidos.")
      throw new Error(error.response.data || "Erro desconhecido no login.");
    }
    // Se foi um erro de rede ou outro problema
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
    const response = await axios.post(`${API_URL}/cadastros/clientes`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Repassa a mensagem de erro do backend (ex: "CPF já cadastrado")
      throw new Error(
        error.response.data.message || "Falha ao cadastrar cliente."
      );
    }
    throw new Error("Falha na comunicação com o servidor.");
  }
};

export const cadastrarLivro = async (data: LivroRequest) => {
  try {
    const response = await axios.post(`${API_URL}/cadastros/livros`, data);
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
    const response = await axios.post(`${API_URL}/cadastros/revistas`, data);
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
      return null; // Retorna nulo se o cliente não tiver empréstimo ativo (404)
    }
    throw new Error("Falha ao buscar empréstimo.");
  }
};

export const realizarDevolucao = async (
  emprestimoId: number
): Promise<DevolucaoResponse> => {
  try {
    // A requisição é POST, mas não precisa enviar um corpo (body)
    const response = await axios.post(
      `${API_URL}/emprestimos/${emprestimoId}/devolver`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Repassa a mensagem de erro específica do backend
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
    throw new Error("Falha ao buscar usuários.");
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

import axios from 'axios';

// Define a URL base da nossa API Spring Boot
const API_URL = 'http://localhost:8080/api';

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
            throw new Error(error.response.data || 'Erro desconhecido no login.');
        }
        // Se foi um erro de rede ou outro problema
        throw new Error('Falha na comunicação com o servidor.');
    }
};

export const searchClientes = async (nome: string) => {
    try {
        const response = await axios.get(`${API_URL}/consultas/clientes`, { params: { nome } });
        return response.data;
    } catch (error) {
        throw new Error('Falha ao buscar clientes.');
    }
};

export const searchLivros = async (titulo: string) => {
    try {
        const response = await axios.get(`${API_URL}/consultas/livros`, { params: { titulo } });
        return response.data;
    } catch (error) {
        throw new Error('Falha ao buscar livros.');
    }
};
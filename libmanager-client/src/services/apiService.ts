import axios from 'axios';

// Define a URL base da nossa API Spring Boot
const API_URL = 'http://localhost:8080/api';

// Define a "forma" dos dados que vamos enviar
interface EmprestimoRequest {
    idLivro: number;
    idCliente: number;
    idUsuario: number;
}

// Função para realizar o empréstimo
export const realizarEmprestimo = async (data: EmprestimoRequest) => {
    try {
        // Envia a requisição POST para o endpoint de empréstimos
        const response = await axios.post(`${API_URL}/emprestimos`, data);
        return response.data; // Retorna os dados do empréstimo criado
    } catch (error) {
        // Se der erro, lança a exceção para ser tratada na UI
        throw error;
    }
};
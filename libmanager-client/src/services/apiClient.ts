import axios from "axios";

// URL base da sua API backend.
const API_URL = "http://localhost:8080/api";

// Cria uma instância do axios com a URL base pré-configurada.
const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptador: antes de cada requisição, esta função é executada.
apiClient.interceptors.request.use(
  (config) => {
    // Pega o token de autenticação salvo no localStorage.
    const token = localStorage.getItem("authToken");
    if (token) {
      // Se o token existir, adiciona-o ao cabeçalho 'Authorization'.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Retorna a configuração modificada para a requisição continuar.
  },
  (error) => {
    // Em caso de erro na configuração da requisição, rejeita a promise.
    return Promise.reject(error);
  }
);

export default apiClient;

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

export interface Usuario {
  id: number;
  nome: string;
  nomeUsuario: string;
  cargo: string;
  status: string;
}

export interface UsuarioDetalhes {
  id: number;
  nome: string;
  cpf: string;
  nomeUsuario: string;
  cargo: string;
  status: string;
  endereco: Endereco;
}

export interface AdminPasswordRequest {
  senha: string;
}

export interface SetupRequest {
  password: string;
}

package com.libmanager.libmanager.service;

import com.libmanager.libmanager.domain.model.*;
import com.libmanager.libmanager.domain.repository.ClienteRepository;
import com.libmanager.libmanager.domain.repository.LivroRepository;
import com.libmanager.libmanager.domain.repository.RevistaRepository;
import com.libmanager.libmanager.domain.repository.UsuarioRepository;
import com.libmanager.libmanager.dto.ClienteDTO;
import com.libmanager.libmanager.dto.LivroDTO;
import com.libmanager.libmanager.dto.RevistaDTO;
import com.libmanager.libmanager.dto.UsuarioDTO;
import com.libmanager.libmanager.domain.enums.StatusMembro;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
@AllArgsConstructor
public class CadastroService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final LivroRepository livroRepository;
    private final RevistaRepository revistaRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Cliente cadastrarCliente(ClienteDTO clienteDTO) {
        if (clienteRepository.findByCpf(clienteDTO.getCpf()).isPresent()) {
            throw new RuntimeException("Já existe um cliente com o CPF informado.");
        }

        Endereco endereco = new Endereco();
        endereco.setRua(clienteDTO.getEndereco().getRua());
        endereco.setNumero(clienteDTO.getEndereco().getNumero());
        endereco.setComplemento(clienteDTO.getEndereco().getComplemento());
        endereco.setBairro(clienteDTO.getEndereco().getBairro());
        endereco.setCidade(clienteDTO.getEndereco().getCidade());
        endereco.setEstado(clienteDTO.getEndereco().getEstado());
        endereco.setCep(clienteDTO.getEndereco().getCep());

        Cliente novoCliente = new Cliente();
        novoCliente.setNome(clienteDTO.getNome());
        novoCliente.setCpf(clienteDTO.getCpf());
        novoCliente.setStatus(StatusMembro.ATIVO);
        novoCliente.setLivroEmprestado(false);
        novoCliente.setEndereco(endereco);

        return clienteRepository.save(novoCliente);
    }

    @Transactional
    public Usuario cadastrarUsuario(UsuarioDTO usuarioDTO) {
        if (usuarioRepository.findByCpf(usuarioDTO.getCpf()).isPresent()) {
            throw new RuntimeException("Já existe um usuário com o CPF informado.");
        }

        Endereco endereco = new Endereco();
        endereco.setRua(usuarioDTO.getEndereco().getRua());
        endereco.setNumero(usuarioDTO.getEndereco().getNumero());
        endereco.setComplemento(usuarioDTO.getEndereco().getComplemento());
        endereco.setBairro(usuarioDTO.getEndereco().getBairro());
        endereco.setCidade(usuarioDTO.getEndereco().getCidade());
        endereco.setEstado(usuarioDTO.getEndereco().getEstado());
        endereco.setCep(usuarioDTO.getEndereco().getCep());

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(usuarioDTO.getNome());
        novoUsuario.setCpf(usuarioDTO.getCpf());
        novoUsuario.setNomeUsuario(usuarioDTO.getNomeUsuario());
        novoUsuario.setSenha(passwordEncoder.encode(usuarioDTO.getSenha()));
        novoUsuario.setStatus(StatusMembro.ATIVO);
        novoUsuario.setEndereco(endereco);

        return usuarioRepository.save(novoUsuario);
    }

    public Livro cadastrarLivro(LivroDTO livroDTO) {
        Livro novoLivro = new Livro();
        novoLivro.setTitulo(livroDTO.getTitulo());
        novoLivro.setAutor(livroDTO.getAutor());
        novoLivro.setQuantDisponivel(livroDTO.getQuantDisponivel());
        return livroRepository.save(novoLivro);
    }

    public Revista cadastrarRevista(RevistaDTO revistaDTO) {
        Revista novaRevista = new Revista();
        novaRevista.setTitulo(revistaDTO.getTitulo());
        novaRevista.setEditora(revistaDTO.getEditora());
        novaRevista.setMesPublicacao(revistaDTO.getMesPublicacao());
        novaRevista.setAnoPublicacao(revistaDTO.getAnoPublicacao());
        novaRevista.setQuantDisponivel(revistaDTO.getQuantDisponivel());
        return revistaRepository.save(novaRevista);
    }

   @Transactional
public Cliente atualizarCliente(Long id, ClienteDTO clienteDTO) {
    Cliente cliente = clienteRepository.findById(id).orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
    cliente.setNome(clienteDTO.getNome());
    cliente.setCpf(clienteDTO.getCpf());

    // Lógica para atualizar o endereço
    if (clienteDTO.getEndereco() != null) {
        Endereco endereco = cliente.getEndereco();
        if (endereco == null) {
            endereco = new Endereco();
            cliente.setEndereco(endereco);
        }
        endereco.setRua(clienteDTO.getEndereco().getRua());
        endereco.setNumero(clienteDTO.getEndereco().getNumero());
        endereco.setComplemento(clienteDTO.getEndereco().getComplemento());
        endereco.setBairro(clienteDTO.getEndereco().getBairro());
        endereco.setCidade(clienteDTO.getEndereco().getCidade());
        endereco.setEstado(clienteDTO.getEndereco().getEstado());
        endereco.setCep(clienteDTO.getEndereco().getCep());
    }

    return clienteRepository.save(cliente);
}

    public Livro atualizarLivro(Long id, LivroDTO livroDTO) {
        Livro livro = livroRepository.findById(id).orElseThrow(() -> new RuntimeException("Livro não encontrado."));
        livro.setTitulo(livroDTO.getTitulo());
        livro.setAutor(livroDTO.getAutor());
        livro.setQuantDisponivel(livroDTO.getQuantDisponivel());
        return livroRepository.save(livro);
    }

    public Revista atualizarRevista(Long id, RevistaDTO revistaDTO) {
        Revista revista = revistaRepository.findById(id).orElseThrow(() -> new RuntimeException("Revista não encontrada."));
        revista.setTitulo(revistaDTO.getTitulo());
        revista.setEditora(revistaDTO.getEditora());
        revista.setMesPublicacao(revistaDTO.getMesPublicacao());
        revista.setAnoPublicacao(revistaDTO.getAnoPublicacao());
        revista.setQuantDisponivel(revistaDTO.getQuantDisponivel());
        return revistaRepository.save(revista);
    }

    
}
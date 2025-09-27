package com.libmanager.libmanager.service;

import com.libmanager.libmanager.domain.model.Cliente;
import com.libmanager.libmanager.domain.model.Livro;
import com.libmanager.libmanager.domain.model.Revista;
import com.libmanager.libmanager.domain.repository.ClienteRepository;
import com.libmanager.libmanager.domain.repository.LivroRepository;
import com.libmanager.libmanager.domain.repository.RevistaRepository;
import com.libmanager.libmanager.dto.ClienteResponseDTO;
import com.libmanager.libmanager.dto.EnderecoDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ConsultaService {
    private final LivroRepository livroRepository;
    private final ClienteRepository clienteRepository;
    private final RevistaRepository revistaRepository;

    public List<Livro> consultarLivros(String titulo, String autor) {
        if (titulo != null && !titulo.isEmpty()) {
            return livroRepository.findByTituloContainingIgnoreCase(titulo);
        }
        if (autor != null && !autor.isEmpty()) {
            return livroRepository.findByAutorContainingIgnoreCase(autor);
        }
        return livroRepository.findAll();
    }

    public List<Revista> consultarRevistas(String titulo, String editora) {
        if (titulo != null && !titulo.isEmpty()) {
            return revistaRepository.findByTituloContainingIgnoreCase(titulo);
        }
        if (editora != null && !editora.isEmpty()) {
            return revistaRepository.findByEditoraContainingIgnoreCase(editora);
        }
        return revistaRepository.findAll();
    }

    public List<ClienteResponseDTO> consultarClientes(String nome, String cpf) {
        List<Cliente> clientes;
        if (nome != null && !nome.isEmpty()) {
            clientes = clienteRepository.findByNomeContainingIgnoreCase(nome);
        } else if (cpf != null && !cpf.isEmpty()) {
            clientes = clienteRepository.findByCpf(cpf).map(List::of).orElse(List.of());
        } else {
            clientes = clienteRepository.findAll();
        }
        return clientes.stream().map(this::toClienteResponseDTO).collect(Collectors.toList());
    }

    public Livro findLivroById(Long id) {
        return livroRepository.findById(id).orElseThrow(() -> new RuntimeException("Livro não encontrado"));
    }

    public Revista findRevistaById(Long id) {
        return revistaRepository.findById(id).orElseThrow(() -> new RuntimeException("Revista não encontrada"));
    }

    public ClienteResponseDTO findClienteById(Long id) {
        Cliente cliente = clienteRepository.findById(id).orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        return toClienteResponseDTO(cliente);
    }

    private ClienteResponseDTO toClienteResponseDTO(Cliente cliente) {
        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setId(cliente.getId());
        dto.setNome(cliente.getNome());
        dto.setCpf(cliente.getCpf());
        dto.setLivroEmprestado(cliente.isLivroEmprestado());
        dto.setStatus(cliente.getStatus().name());

        if (cliente.getEndereco() != null) {
            EnderecoDTO enderecoDTO = new EnderecoDTO();
            enderecoDTO.setRua(cliente.getEndereco().getRua());
            enderecoDTO.setNumero(cliente.getEndereco().getNumero());
            enderecoDTO.setComplemento(cliente.getEndereco().getComplemento());
            enderecoDTO.setBairro(cliente.getEndereco().getBairro());
            enderecoDTO.setCidade(cliente.getEndereco().getCidade());
            enderecoDTO.setEstado(cliente.getEndereco().getEstado());
            enderecoDTO.setCep(cliente.getEndereco().getCep());
            dto.setEndereco(enderecoDTO);
        }

        return dto;
    }
}
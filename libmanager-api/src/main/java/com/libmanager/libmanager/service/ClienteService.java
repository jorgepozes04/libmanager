package com.libmanager.libmanager.service;

import com.libmanager.libmanager.domain.enums.StatusEmprestimo;
import com.libmanager.libmanager.domain.enums.StatusMembro;
import com.libmanager.libmanager.domain.model.Cliente;
import com.libmanager.libmanager.domain.model.Endereco;
import com.libmanager.libmanager.domain.repository.ClienteRepository;
import com.libmanager.libmanager.domain.repository.EmprestimoRepository;
import com.libmanager.libmanager.dto.ClienteDTO;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final EmprestimoRepository emprestimoRepository;

    @Transactional
    public Cliente cadastrarCliente(ClienteDTO clienteDTO) {
        if (clienteRepository.findByCpf(clienteDTO.getCpf()).isPresent()) {
            throw new RuntimeException("Já existe um cliente com o CPF informado.");
        }

        Endereco endereco = criarEndereco(clienteDTO);

        Cliente novoCliente = new Cliente();
        novoCliente.setNome(clienteDTO.getNome());
        novoCliente.setCpf(clienteDTO.getCpf());
        novoCliente.setStatus(StatusMembro.ATIVO);
        novoCliente.setLivroEmprestado(false);
        novoCliente.setEndereco(endereco);

        return clienteRepository.save(novoCliente);
    }

    @Transactional
    public Cliente atualizarCliente(Long id, ClienteDTO clienteDTO) {
        Cliente cliente = clienteRepository.findById(id).orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
        cliente.setNome(clienteDTO.getNome());
        cliente.setCpf(clienteDTO.getCpf());

        if (clienteDTO.getEndereco() != null) {
            Endereco endereco = cliente.getEndereco();
            if (endereco == null) {
                endereco = new Endereco();
                cliente.setEndereco(endereco);
            }
            atualizarDadosEndereco(endereco, clienteDTO);
        }

        return clienteRepository.save(cliente);
    }

    @Transactional
    public void deletarCliente(Long id) {
        // Verifica se o cliente a ser deletado existe
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));

        // Verifica se o cliente possui algum empréstimo ativo
        boolean temEmprestimoAtivo = emprestimoRepository.findByClienteIdAndStatus(id, StatusEmprestimo.ATIVO).isPresent();
        if (temEmprestimoAtivo) {
            throw new RuntimeException("Não é possível excluir um cliente que possui um empréstimo ativo.");
        }

        // Se não houver empréstimos ativos, deleta o cliente
        clienteRepository.delete(cliente);
    }

    private Endereco criarEndereco(ClienteDTO clienteDTO) {
        Endereco endereco = new Endereco();
        atualizarDadosEndereco(endereco, clienteDTO);
        return endereco;
    }

    private void atualizarDadosEndereco(Endereco endereco, ClienteDTO clienteDTO) {
        endereco.setRua(clienteDTO.getEndereco().getRua());
        endereco.setNumero(clienteDTO.getEndereco().getNumero());
        endereco.setComplemento(clienteDTO.getEndereco().getComplemento());
        endereco.setBairro(clienteDTO.getEndereco().getBairro());
        endereco.setCidade(clienteDTO.getEndereco().getCidade());
        endereco.setEstado(clienteDTO.getEndereco().getEstado());
        endereco.setCep(clienteDTO.getEndereco().getCep());
    }
}
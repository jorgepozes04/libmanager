package com.libmanager.libmanager.service;

import com.libmanager.libmanager.model.Cliente;
import com.libmanager.libmanager.model.Livro;
import com.libmanager.libmanager.model.Revista;
import com.libmanager.libmanager.repository.ClienteRepository;
import com.libmanager.libmanager.repository.LivroRepository;
import com.libmanager.libmanager.repository.RevistaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ConsultaService {
    private final LivroRepository livroRepository;
    private final ClienteRepository clienteRepository;
    private final RevistaRepository revistaRepository;

    public List<Livro> consultarLivros(String titulo, String autor) {
        if (titulo == null && !titulo.isEmpty()) {
            return livroRepository.findByTituloContainingIgnoreCase(titulo);
        }
        if (autor == null && !autor.isEmpty()) {
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

    public List<Cliente> consultarClientes(String nome, String cpf) {
        if (nome != null && !nome.isEmpty()) {
            return clienteRepository.findByNomeContainingIgnoreCase(nome);
        }
        if (cpf != null && !cpf.isEmpty()) {
            return clienteRepository.findByCpf(cpf).map(List::of).orElse(List.of());
        }
        return clienteRepository.findAll();
    }
}



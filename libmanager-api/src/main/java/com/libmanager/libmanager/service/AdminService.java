package com.libmanager.libmanager.service;

import com.libmanager.libmanager.dto.UsuarioDTO;
import com.libmanager.libmanager.dto.UsuarioResponseDTO; // Importe o novo DTO
import com.libmanager.libmanager.enums.Cargo;
import com.libmanager.libmanager.enums.StatusMembro;
import com.libmanager.libmanager.model.Endereco;
import com.libmanager.libmanager.model.Usuario;
import com.libmanager.libmanager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors; // Importe o Collectors

@Service
public class AdminService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Altere o tipo de retorno do método
    public List<UsuarioResponseDTO> listarTodosUsuarios() {
        // Mapeie a entidade para o DTO
        return usuarioRepository.findAll().stream()
                .map(usuario -> new UsuarioResponseDTO(
                        usuario.getId(),
                        usuario.getNome(),
                        usuario.getNomeUsuario(),
                        usuario.getCargo(),
                        usuario.getStatus()
                )).collect(Collectors.toList());
    }

    public Usuario criarUsuario(UsuarioDTO usuarioDTO) {
        if (usuarioRepository.findByNomeUsuario(usuarioDTO.getNomeUsuario()).isPresent()) {
            throw new RuntimeException("Nome de usuário já existe.");
        }

        // Criando e preenchendo o Endereço
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
        novoUsuario.setCargo(Cargo.USUARIO); // Novos usuários são criados com cargo padrão
        novoUsuario.setEndereco(endereco); // Associando o endereço ao usuário

        return usuarioRepository.save(novoUsuario);
    }
}
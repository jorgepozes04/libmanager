package com.libmanager.libmanager.service;

import com.libmanager.libmanager.dto.UsuarioDTO;
import com.libmanager.libmanager.enums.Cargo;
import com.libmanager.libmanager.enums.StatusMembro;
import com.libmanager.libmanager.model.Usuario;
import com.libmanager.libmanager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Usuario> listarTodosUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario criarUsuario(UsuarioDTO usuarioDTO) {
        if (usuarioRepository.findByNomeUsuario(usuarioDTO.getNomeUsuario()).isPresent()) {
            throw new RuntimeException("Nome de usuário já existe.");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(usuarioDTO.getNome());
        novoUsuario.setCpf(usuarioDTO.getCpf());
        novoUsuario.setNomeUsuario(usuarioDTO.getNomeUsuario());
        novoUsuario.setSenha(passwordEncoder.encode(usuarioDTO.getSenha()));
        novoUsuario.setStatus(StatusMembro.ATIVO);
        novoUsuario.setCargo(Cargo.USUARIO); // Novos usuários são criados com cargo padrão

        return usuarioRepository.save(novoUsuario);
    }
}
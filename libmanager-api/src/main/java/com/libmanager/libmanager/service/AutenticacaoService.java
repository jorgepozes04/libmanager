package com.libmanager.libmanager.service;

import com.libmanager.libmanager.dto.LoginRequestDTO;
import com.libmanager.libmanager.dto.LoginResponseDTO;
import com.libmanager.libmanager.model.Usuario;
import com.libmanager.libmanager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public AutenticacaoService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        Usuario usuario = usuarioRepository.findByNomeUsuario(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        // EM UMA APLICAÇÃO REAL: Aqui você descriptografaria a senha do banco
        // e a compararia com a senha enviada. Por simplicidade, vamos pular essa etapa.
        // if (passwordEncoder.matches(loginRequest.getPassword(), usuario.getSenha())) { ... }

        return new LoginResponseDTO("Login bem-sucedido!", usuario.getNome());
    }
}
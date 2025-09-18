package com.libmanager.libmanager.service;

import com.libmanager.libmanager.dto.LoginRequestDTO;
import com.libmanager.libmanager.dto.LoginResponseDTO;
import com.libmanager.libmanager.model.Usuario;
import com.libmanager.libmanager.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AutenticacaoService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        Usuario usuario = usuarioRepository.findByNomeUsuario(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário ou senha inválidos."));

        if (passwordEncoder.matches(loginRequest.getPassword(), usuario.getSenha())) {
            return new LoginResponseDTO("Login bem-sucedido!", usuario.getNome());
        }

        throw new RuntimeException("Usuário ou senha inválidos.");
    }
}
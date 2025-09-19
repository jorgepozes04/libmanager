// Código completo do AutenticacaoService atualizado
package com.libmanager.libmanager.service;

import com.libmanager.libmanager.dto.LoginRequestDTO;
import com.libmanager.libmanager.dto.LoginResponseDTO;
import com.libmanager.libmanager.model.Usuario;
import com.libmanager.libmanager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenService tokenService; // Injetar o TokenService

    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        Usuario usuario = usuarioRepository.findByNomeUsuario(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário ou senha inválidos."));

        if (passwordEncoder.matches(loginRequest.getPassword(), usuario.getSenha())) {
            String token = tokenService.gerarToken(usuario); // Gerar o token
            return new LoginResponseDTO(
                    "Login bem-sucedido!",
                    usuario.getNome(),
                    usuario.getId(),
                    usuario.getCargo().name(),
                    token // Retornar o token
            );
        }

        throw new RuntimeException("Usuário ou senha inválidos.");
    }
}
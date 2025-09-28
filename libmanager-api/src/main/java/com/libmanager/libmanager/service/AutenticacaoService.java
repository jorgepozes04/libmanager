package com.libmanager.libmanager.service;

import com.libmanager.libmanager.domain.enums.Cargo;
import com.libmanager.libmanager.domain.enums.StatusMembro;
import com.libmanager.libmanager.domain.model.Endereco;
import com.libmanager.libmanager.dto.LoginRequestDTO;
import com.libmanager.libmanager.dto.LoginResponseDTO;
import com.libmanager.libmanager.domain.model.Usuario;
import com.libmanager.libmanager.domain.repository.UsuarioRepository;
import com.libmanager.libmanager.dto.SetupRequestDTO;
import com.libmanager.libmanager.security.TokenService;
import jakarta.transaction.Transactional;
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
    private TokenService tokenService;

    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        Usuario usuario = usuarioRepository.findByNomeUsuario(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário ou senha inválidos."));

        if (passwordEncoder.matches(loginRequest.getPassword(), usuario.getSenha())) {
            String token = tokenService.gerarToken(usuario);
            return new LoginResponseDTO(
                    "Login bem-sucedido!",
                    usuario.getNome(),
                    usuario.getId(),
                    usuario.getCargo().name(),
                    token
            );
        }

        throw new RuntimeException("Usuário ou senha inválidos.");
    }

    public boolean needsSetup() { // Verificar necessidade de criação do usuário admin
        // Retorna true se não houver NENHUM usuário no banco
        return usuarioRepository.count() == 0;
    }

    @Transactional
    public void setupAdmin(SetupRequestDTO setupRequest) { // Criação do usuário admin
        // Dupla verificação para evitar que seja executado mais de uma vez
        if (usuarioRepository.count() > 0) {
            throw new RuntimeException("O sistema já foi configurado.");
        }

        Usuario admin = new Usuario();
        admin.setNome("Administrador");
        admin.setCpf("000.000.000-00");
        admin.setNomeUsuario("admin");
        admin.setSenha(passwordEncoder.encode(setupRequest.getPassword()));
        admin.setStatus(StatusMembro.ATIVO);
        admin.setCargo(Cargo.ADMIN);

        Endereco enderecoAdmin = new Endereco();
        enderecoAdmin.setRua("Rua do Sistema");
        enderecoAdmin.setNumero("S/N");
        enderecoAdmin.setBairro("Centro");
        enderecoAdmin.setCidade("Cidade Padrão");
        enderecoAdmin.setEstado("SP");
        enderecoAdmin.setCep("00000-000");
        admin.setEndereco(enderecoAdmin);

        usuarioRepository.save(admin);
    }
}
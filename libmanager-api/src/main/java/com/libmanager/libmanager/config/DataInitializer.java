package com.libmanager.libmanager.config;

import com.libmanager.libmanager.enums.Cargo;
import com.libmanager.libmanager.enums.StatusMembro;
import com.libmanager.libmanager.model.Endereco;
import com.libmanager.libmanager.model.Usuario;
import com.libmanager.libmanager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Verifica se já existe algum usuário no banco de dados
        if (usuarioRepository.count() == 0) {
            System.out.println("Nenhum usuário encontrado, criando usuário admin padrão...");

            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setCpf("000.000.000-00"); // CPF genérico
            admin.setNomeUsuario("admin");
            admin.setSenha(passwordEncoder.encode("1227")); // Senha padrão
            admin.setStatus(StatusMembro.ATIVO);
            admin.setCargo(Cargo.ADMIN); // Definir o cargo como ADMIN
            Endereco enderecoAdmin = new Endereco();
            enderecoAdmin.setRua("Rua do Sistema");
            enderecoAdmin.setNumero("S/N");
            enderecoAdmin.setBairro("Centro");
            enderecoAdmin.setCidade("Cidade Padrão");
            enderecoAdmin.setEstado("SP");
            enderecoAdmin.setCep("00000-000");

            admin.setEndereco(enderecoAdmin); // Associa o endereço ao admin

            usuarioRepository.save(admin);

            System.out.println("Usuário 'admin' criado com sucesso. Use 'password' para o primeiro login.");
        } else {
            System.out.println("Usuários já existem no banco de dados. Nenhuma ação necessária.");
        }
    }
}
package com.libmanager.libmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.libmanager.libmanager.model.Cliente;
import com.libmanager.libmanager.model.Endereco;
import com.libmanager.libmanager.model.Livro;
import com.libmanager.libmanager.model.Usuario;
import com.libmanager.libmanager.repository.ClienteRepository;
import com.libmanager.libmanager.repository.LivroRepository;
import com.libmanager.libmanager.repository.UsuarioRepository;
import com.libmanager.libmanager.enums.StatusMembro;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class LibmanagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibmanagerApplication.class, args);
    }
}

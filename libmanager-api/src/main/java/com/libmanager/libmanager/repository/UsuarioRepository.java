package com.libmanager.libmanager.repository;

import com.libmanager.libmanager.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional; // Adicione este import

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByNomeUsuario(String nomeUsuario);
    Optional<Usuario> findByCpf(String emailUsuario);
}
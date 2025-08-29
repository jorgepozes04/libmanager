package com.libmanager.libmanager.repository;

import com.libmanager.libmanager.model.Revista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RevistaRepository extends JpaRepository<Revista, Long> {
    List<Revista> findByTituloContainingIgnoreCase(String titulo);

    List<Revista> findByEditoraContainingIgnoreCase(String autor);
}

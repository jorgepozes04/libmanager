package com.libmanager.libmanager.domain.repository;

import com.libmanager.libmanager.domain.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {

    List<Livro> findByTituloContainingIgnoreCase(String titulo);
    List<Livro> findByAutorContainingIgnoreCase(String autor);

    @Modifying
    @Query("UPDATE Livro l SET l.quantDisponivel = l.quantDisponivel - 1 WHERE l.id = :id AND l.quantDisponivel > 0")
    int decrementarEstoque(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Livro l SET l.quantDisponivel = l.quantDisponivel + 1 WHERE l.id = :id")
    void incrementarEstoque(@Param("id") Long id);
}
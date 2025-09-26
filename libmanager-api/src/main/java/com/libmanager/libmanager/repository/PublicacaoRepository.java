package com.libmanager.libmanager.repository;

import com.libmanager.libmanager.model.Publicacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicacaoRepository extends JpaRepository<Publicacao, Long> {
}

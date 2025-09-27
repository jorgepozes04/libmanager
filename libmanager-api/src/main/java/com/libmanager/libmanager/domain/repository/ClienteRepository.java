package com.libmanager.libmanager.domain.repository;

import com.libmanager.libmanager.domain.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByCpf(String cpf);
    Optional<Cliente> findById(Long id);
    List<Cliente> findByNomeContainingIgnoreCase(String nome);
}
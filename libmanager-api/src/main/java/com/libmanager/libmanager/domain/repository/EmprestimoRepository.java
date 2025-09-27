package com.libmanager.libmanager.domain.repository;

import com.libmanager.libmanager.domain.enums.StatusEmprestimo;
import com.libmanager.libmanager.domain.model.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {
    Optional<Emprestimo> findByClienteIdAndStatus(Long clienteId, StatusEmprestimo status);
}
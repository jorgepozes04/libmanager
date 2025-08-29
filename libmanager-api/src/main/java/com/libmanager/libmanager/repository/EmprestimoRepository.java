package com.libmanager.libmanager.repository;

import com.libmanager.libmanager.enums.StatusEmprestimo;
import com.libmanager.libmanager.model.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {
    Optional<Emprestimo> findByClienteIdAndStatus(Long clienteId, StatusEmprestimo status);
}
package com.libmanager.libmanager.service.strategy;

import com.libmanager.libmanager.domain.model.Emprestimo;
import java.time.LocalDate;

public interface Multa {
    double calcular(Emprestimo emprestimo, LocalDate dataDevolucao);
}
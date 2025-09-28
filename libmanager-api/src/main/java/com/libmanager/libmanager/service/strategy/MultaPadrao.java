package com.libmanager.libmanager.service.strategy;

import com.libmanager.libmanager.domain.model.Emprestimo;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
public class MultaPadrao implements Multa {

    private static final double TAXA_DIARIA = 2.50;

    @Override
    public double calcular(Emprestimo emprestimo, LocalDate dataDevolucao) {
        if (dataDevolucao.isAfter(emprestimo.getDataDevolucaoPrevista())) {
            long diasAtraso = ChronoUnit.DAYS.between(emprestimo.getDataDevolucaoPrevista(), dataDevolucao);
            return diasAtraso * TAXA_DIARIA;
        }
        return 0;
    }
}
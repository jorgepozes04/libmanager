package com.libmanager.libmanager.dto;

import com.libmanager.libmanager.enums.StatusEmprestimo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DevolucaoResponseDTO {
    private String mensagem;
    private Long emprestimoId;
    private StatusEmprestimo statusFinal;
    private double valorMulta;
}

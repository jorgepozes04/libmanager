package com.libmanager.libmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LoginResponseDTO {
    private String mensagem;
    private String nomeUsuario;
}

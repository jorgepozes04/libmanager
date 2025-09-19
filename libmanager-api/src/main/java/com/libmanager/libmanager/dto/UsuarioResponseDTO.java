package com.libmanager.libmanager.dto;

import com.libmanager.libmanager.enums.Cargo;
import com.libmanager.libmanager.enums.StatusMembro;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String nomeUsuario;
    private Cargo cargo;
    private StatusMembro status;
}
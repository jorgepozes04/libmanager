package com.libmanager.libmanager.dto;

import com.libmanager.libmanager.domain.enums.Cargo;
import com.libmanager.libmanager.domain.enums.StatusMembro;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioDetalhesDTO {
    private Long id;
    private String nome;
    private String cpf;
    private String nomeUsuario;
    private Cargo cargo;
    private StatusMembro status;
    private EnderecoDTO endereco;
}
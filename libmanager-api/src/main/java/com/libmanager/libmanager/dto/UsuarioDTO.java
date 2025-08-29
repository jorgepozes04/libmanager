package com.libmanager.libmanager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioDTO {
    private String nome;
    private String cpf;
    private String nomeUsuario;
    private EnderecoDTO endereco;
}

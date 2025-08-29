package com.libmanager.libmanager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClienteDTO {
    private String nome;
    private String cpf;
    private EnderecoDTO endereco;
}

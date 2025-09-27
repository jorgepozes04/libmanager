package com.libmanager.libmanager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClienteResponseDTO {
    private Long id;
    private String nome;
    private String cpf;
    private EnderecoDTO endereco;
    private boolean livroEmprestado;
    private String status;
}
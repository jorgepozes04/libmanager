package com.libmanager.libmanager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RevistaDTO {
    private String titulo;
    private String editora;
    private int mesPublicacao;
    private int anoPublicacao;
    private int quantDisponivel;
}
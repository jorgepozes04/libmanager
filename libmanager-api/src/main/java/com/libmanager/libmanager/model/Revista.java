package com.libmanager.libmanager.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "revistas")
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "publicacao_id")
public class Revista extends Publicacao {

    private String editora;

    @Column(name = "mes_publicacao")
    private int mesPublicacao;

    @Column(name = "ano_publicacao")
    private int anoPublicacao;
}
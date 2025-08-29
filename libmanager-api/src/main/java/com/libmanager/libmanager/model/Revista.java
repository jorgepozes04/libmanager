package com.libmanager.libmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "revistas")
@Data
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "publicacao_id")
public class Revista extends Publicacao {

    private String editora;

    @Column(name = "mes_publicacao")
    private int mesPublicacao;

    @Column(name = "ano_publicacao")
    private int anoPublicacao;
}
package com.libmanager.libmanager.domain.model;

import com.libmanager.libmanager.domain.enums.TipoPublicacao;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "publicacoes")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
public abstract class Publicacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(name = "quant_disponivel")
    private int quantDisponivel;

    // Coluna usada pelo Hibernate para saber se a publicação é um LIVRO ou REVISTA
    @Column(name = "tipo_publicacao", insertable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    private TipoPublicacao tipoPublicacao;
}
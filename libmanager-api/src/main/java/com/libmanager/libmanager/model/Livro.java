package com.libmanager.libmanager.model;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "livros")
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "publicacao_id")
public class Livro extends Publicacao {

    private String autor;
}
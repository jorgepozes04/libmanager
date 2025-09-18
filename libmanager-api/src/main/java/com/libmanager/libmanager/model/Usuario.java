package com.libmanager.libmanager.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "usuarios")
@Data
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "membro_id")
public class Usuario extends Membro {

    @Column(name = "nome_usuario")
    private String nomeUsuario;

    @Column(name = "senha")
    private String senha;
}
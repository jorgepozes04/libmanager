package com.libmanager.libmanager.domain.model;

import com.libmanager.libmanager.domain.enums.Cargo;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "membro_id")
public class Usuario extends Membro {

    @Column(name = "nome_usuario")
    private String nomeUsuario;

    @Column(name = "senha")
    private String senha;

    @Enumerated(EnumType.STRING) // Adicionar
    private Cargo cargo;
}
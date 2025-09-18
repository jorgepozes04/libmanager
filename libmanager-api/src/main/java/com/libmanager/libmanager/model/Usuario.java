package com.libmanager.libmanager.model;

import com.libmanager.libmanager.enums.Cargo;
import jakarta.persistence.*;
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

    @Enumerated(EnumType.STRING) // Adicionar
    private Cargo cargo;
}
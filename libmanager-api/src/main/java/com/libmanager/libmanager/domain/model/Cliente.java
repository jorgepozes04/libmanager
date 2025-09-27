package com.libmanager.libmanager.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "clientes")
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "membro_id")
public class Cliente extends Membro {

    @Column(name = "livro_emprestado")
    private boolean livroEmprestado;
}
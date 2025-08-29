package com.libmanager.libmanager.model;

import com.libmanager.libmanager.enums.StatusEmprestimo;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "emprestimos")
@Data
public class Emprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_emprestimo")
    private LocalDate dataEmprestimo;

    @Column(name = "data_devolucao_prevista")
    private LocalDate dataDevolucaoPrevista;

    @Column(name = "data_devolucao_realizada")
    private LocalDate dataDevolucaoRealizada;

    @Enumerated(EnumType.STRING)
    private StatusEmprestimo status;

    @Column(name = "multa_valor")
    private double multaValor;

    @ManyToOne
    @JoinColumn(name = "publicacao_id")
    private Livro livro;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
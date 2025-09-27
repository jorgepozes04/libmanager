package com.libmanager.libmanager.controller;

import com.libmanager.libmanager.domain.model.Cliente;
import com.libmanager.libmanager.domain.model.Livro;
import com.libmanager.libmanager.domain.model.Revista;
import com.libmanager.libmanager.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/consultas")
public class ConsultaController {

    private final ConsultaService consultaService;

    @Autowired
    public ConsultaController(ConsultaService consultaService) {
        this.consultaService = consultaService;
    }

    @GetMapping("/livros")
    public ResponseEntity<List<Livro>> consultarLivros(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) String autor) {
        return ResponseEntity.ok(consultaService.consultarLivros(titulo, autor));
    }

    @GetMapping("/revistas")
    public ResponseEntity<List<Revista>> consultarRevistas(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) String editora) {
        return ResponseEntity.ok(consultaService.consultarRevistas(titulo, editora));
    }

    @GetMapping("/clientes")
    public ResponseEntity<List<Cliente>> consultarClientes(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cpf) {
        return ResponseEntity.ok(consultaService.consultarClientes(nome, cpf));
    }

    @GetMapping("/livros/{id}")
    public ResponseEntity<Livro> getLivroById(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.findLivroById(id));
    }

    @GetMapping("/revistas/{id}")
    public ResponseEntity<Revista> getRevistaById(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.findRevistaById(id));
    }

    @GetMapping("/clientes/{id}")
    public ResponseEntity<Cliente> getClienteById(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.findClienteById(id));
    }
}
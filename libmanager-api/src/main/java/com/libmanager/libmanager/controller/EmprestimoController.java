package com.libmanager.libmanager.controller;

import com.libmanager.libmanager.dto.DevolucaoResponseDTO;
import com.libmanager.libmanager.dto.EmprestimoRequestDTO;
import com.libmanager.libmanager.domain.model.Emprestimo;
import com.libmanager.libmanager.service.EmprestimoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/emprestimos")
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    @Autowired
    public EmprestimoController(EmprestimoService emprestimoService) {
        this.emprestimoService = emprestimoService;
    }

    // Mapeia requisições HTTP POST para a URL /api/emprestimos
    @PostMapping
    public ResponseEntity<Emprestimo> realizarEmprestimo(@RequestBody EmprestimoRequestDTO requestDTO) {
        try {
            Emprestimo novoEmprestimo = emprestimoService.realizarEmprestimo(requestDTO);
            // Retorna uma resposta HTTP 201 Created com o objeto criado no corpo
            return ResponseEntity.status(201).body(novoEmprestimo);
        } catch (RuntimeException e) {
            // Em caso de erro (ex: cliente inativo), retorna uma resposta HTTP 400 Bad Request com a mensagem de erro
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/{id}/devolver")
    public ResponseEntity<?> realizarDevolucao(@PathVariable Long id) {
        try {
            DevolucaoResponseDTO response = emprestimoService.realizarDevolucao(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Retorna a mensagem de erro específica do serviço
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/cliente/{clienteId}/ativo")
    public ResponseEntity<Emprestimo> buscarEmprestimoAtivoPorCliente(@PathVariable Long clienteId) {
        return emprestimoService.buscarEmprestimoAtivoPorCliente(clienteId)
                .map(ResponseEntity::ok) // Retorna 200 OK com o empréstimo se encontrado
                .orElse(ResponseEntity.notFound().build()); // Retorna 404 Not Found se não houver
    }
}
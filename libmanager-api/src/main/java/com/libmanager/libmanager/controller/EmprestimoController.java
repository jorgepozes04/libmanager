package com.libmanager.libmanager.controller;

import com.libmanager.libmanager.dto.DevolucaoResponseDTO;
import com.libmanager.libmanager.dto.EmprestimoRequestDTO;
import com.libmanager.libmanager.domain.model.Emprestimo;
import com.libmanager.libmanager.service.EmprestimoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @PostMapping
    public ResponseEntity<Emprestimo> realizarEmprestimo(@RequestBody EmprestimoRequestDTO requestDTO) {
        Emprestimo novoEmprestimo = emprestimoService.realizarEmprestimo(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoEmprestimo);
    }

    @PostMapping("/{id}/devolver")
    public ResponseEntity<DevolucaoResponseDTO> realizarDevolucao(@PathVariable Long id) {
        DevolucaoResponseDTO response = emprestimoService.realizarDevolucao(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/cliente/{clienteId}/ativo")
    public ResponseEntity<Emprestimo> buscarEmprestimoAtivoPorCliente(@PathVariable Long clienteId) {
        return emprestimoService.buscarEmprestimoAtivoPorCliente(clienteId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

package com.libmanager.libmanager.controller;

import com.libmanager.libmanager.dto.EmprestimoRequestDTO;
import com.libmanager.libmanager.model.Emprestimo;
import com.libmanager.libmanager.service.EmprestimoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // 1. Combina @Controller e @ResponseBody, preparando a classe para lidar com requisições REST
@RequestMapping("/api/emprestimos") // 2. Define o prefixo da URL para todos os métodos neste controller
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    @Autowired
    public EmprestimoController(EmprestimoService emprestimoService) {
        this.emprestimoService = emprestimoService;
    }

    // 3. Mapeia requisições HTTP POST para a URL /api/emprestimos
    @PostMapping
    public ResponseEntity<Emprestimo> realizarEmprestimo(@RequestBody EmprestimoRequestDTO requestDTO) { // 4
        try {
            Emprestimo novoEmprestimo = emprestimoService.realizarEmprestimo(requestDTO);
            // 5. Retorna uma resposta HTTP 201 Created com o objeto criado no corpo
            return ResponseEntity.status(201).body(novoEmprestimo);
        } catch (RuntimeException e) {
            // 6. Em caso de erro (ex: cliente inativo), retorna uma resposta HTTP 400 Bad Request com a mensagem de erro
            return ResponseEntity.badRequest().body(null); // Em um projeto real, retornaríamos um objeto de erro mais detalhado
        }
    }
}
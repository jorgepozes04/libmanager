package com.libmanager.libmanager.controller;

import com.libmanager.libmanager.domain.model.Cliente;
import com.libmanager.libmanager.dto.ClienteDTO;
import com.libmanager.libmanager.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    @Autowired // Injeção de dependência do ClienteService
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping // Chamada para cadastrar cliente
    public ResponseEntity<Cliente> cadastrarCliente(@RequestBody ClienteDTO clienteDTO) {
        Cliente novoCliente = clienteService.cadastrarCliente(clienteDTO);
        return ResponseEntity.status(201).body(novoCliente);
    }

    @PutMapping("/{id}") // Chamada para atualizar cliente
    public ResponseEntity<Cliente> atualizarCliente(@PathVariable Long id, @RequestBody ClienteDTO clienteDTO) {
        Cliente clienteAtualizado = clienteService.atualizarCliente(id, clienteDTO);
        return ResponseEntity.ok(clienteAtualizado);
    }

    @DeleteMapping("/{id}") // Chamada para deletar cliente
    public ResponseEntity<?> deletarCliente(@PathVariable Long id) {
        try {
            clienteService.deletarCliente(id);
            return ResponseEntity.ok().build(); // Retorna 200 OK (sem corpo) em caso de sucesso
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // Retorna 400 com a mensagem de erro
        }
    }
}
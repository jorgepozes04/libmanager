package com.libmanager.libmanager.controller;

import com.libmanager.libmanager.dto.UsuarioDTO;
import com.libmanager.libmanager.dto.UsuarioDetalhesDTO;
import com.libmanager.libmanager.dto.UsuarioResponseDTO;
import com.libmanager.libmanager.domain.model.Usuario;
import com.libmanager.libmanager.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.libmanager.libmanager.dto.AdminPasswordDTO;
import org.springframework.http.HttpStatus;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/usuarios")  // Chamada para listar usuários
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios() {
        return ResponseEntity.ok(adminService.listarTodosUsuarios());
    }

    @PostMapping("/usuarios") // Chamada para criar usuários
    public ResponseEntity<Usuario> criarUsuario(@RequestBody UsuarioDTO usuarioDTO) { 
        Usuario novoUsuario = adminService.criarUsuario(usuarioDTO);
        return ResponseEntity.status(201).body(novoUsuario);
    }

    @GetMapping("/usuarios/{id}") // Chamada para buscar usuário por ID
    public ResponseEntity<UsuarioDetalhesDTO> getUsuarioById(@PathVariable Long id) { 
        return ResponseEntity.ok(adminService.findUsuarioById(id));
    }

    @PutMapping("/usuarios/{id}") // Chamada para atualizar usuário
    public ResponseEntity<UsuarioDetalhesDTO> atualizarUsuario(@PathVariable Long id, @RequestBody UsuarioDTO usuarioDTO) {
        UsuarioDetalhesDTO usuarioAtualizado = adminService.atualizarUsuario(id, usuarioDTO);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @DeleteMapping("/usuarios/{id}") // Chamada para deletar usuário
    public ResponseEntity<?> deletarUsuario(@PathVariable Long id, @RequestBody AdminPasswordDTO adminPasswordDTO) {
        try {
            adminService.deletarUsuario(id, adminPasswordDTO.getSenha());
            // Retorna 200 OK sem corpo em caso de sucesso
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            // Retorna 400 Bad Request com a mensagem de erro
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
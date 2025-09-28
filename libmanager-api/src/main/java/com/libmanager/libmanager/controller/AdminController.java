package com.libmanager.libmanager.controller;

import com.libmanager.libmanager.dto.UsuarioDTO;
import com.libmanager.libmanager.dto.UsuarioDetalhesDTO;
import com.libmanager.libmanager.dto.UsuarioResponseDTO;
import com.libmanager.libmanager.domain.model.Usuario;
import com.libmanager.libmanager.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios() {
        return ResponseEntity.ok(adminService.listarTodosUsuarios());
    }

    @PostMapping("/usuarios")
    public ResponseEntity<Usuario> criarUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        Usuario novoUsuario = adminService.criarUsuario(usuarioDTO);
        return ResponseEntity.status(201).body(novoUsuario);
    }

    // CORREÇÃO: O tipo de retorno agora corresponde ao que o serviço fornece.
    @GetMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioDetalhesDTO> getUsuarioById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.findUsuarioById(id));
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Long id, @RequestBody UsuarioDTO usuarioDTO) {
        Usuario usuarioAtualizado = adminService.atualizarUsuario(id, usuarioDTO);
        return ResponseEntity.ok(usuarioAtualizado);
    }
}
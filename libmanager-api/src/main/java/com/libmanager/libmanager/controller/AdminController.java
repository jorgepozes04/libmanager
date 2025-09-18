package com.libmanager.libmanager.controller;

import com.libmanager.libmanager.dto.UsuarioDTO;
import com.libmanager.libmanager.model.Usuario;
import com.libmanager.libmanager.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(adminService.listarTodosUsuarios());
    }

    @PostMapping("/usuarios")
    public ResponseEntity<Usuario> criarUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        Usuario novoUsuario = adminService.criarUsuario(usuarioDTO);
        return ResponseEntity.status(201).body(novoUsuario);
    }
}
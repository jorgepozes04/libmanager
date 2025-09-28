package com.libmanager.libmanager.controller;

import com.libmanager.libmanager.dto.LoginRequestDTO;
import com.libmanager.libmanager.dto.LoginResponseDTO;
import com.libmanager.libmanager.dto.SetupRequestDTO;
import com.libmanager.libmanager.service.AutenticacaoService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AutenticacaoController {

    private final AutenticacaoService autenticacaoService;

    @PostMapping("/login") // Chamada para tentativa de login
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            LoginResponseDTO response = autenticacaoService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/needs-setup") // Chamada para verificar necessidade de criação de usuário administrador
    public ResponseEntity<Map<String, Boolean>> needsSetup() {
        boolean needsSetup = autenticacaoService.needsSetup();
        return ResponseEntity.ok(Collections.singletonMap("needsSetup", needsSetup));
    }

    @PostMapping("/setup") // Chamada para criação do usuário administrador
    public ResponseEntity<?> setupAdmin(@RequestBody SetupRequestDTO setupRequest) {
        try {
            autenticacaoService.setupAdmin(setupRequest);
            return ResponseEntity.ok(Map.of("message", "Administrador configurado com sucesso!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
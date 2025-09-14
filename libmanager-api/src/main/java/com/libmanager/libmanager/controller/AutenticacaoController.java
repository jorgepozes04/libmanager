package com.libmanager.libmanager.controller;

import com.libmanager.libmanager.dto.LoginRequestDTO;
import com.libmanager.libmanager.dto.LoginResponseDTO;
import com.libmanager.libmanager.service.AutenticacaoService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth") // Usaremos um prefixo "/auth" para autenticação
@AllArgsConstructor
public class AutenticacaoController {

    private final AutenticacaoService autenticacaoService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            LoginResponseDTO response = autenticacaoService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage()); // 401 Unauthorized
        }
    }
}
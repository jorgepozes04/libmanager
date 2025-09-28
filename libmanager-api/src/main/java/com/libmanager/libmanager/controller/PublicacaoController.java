package com.libmanager.libmanager.controller;

import com.libmanager.libmanager.domain.model.Livro;
import com.libmanager.libmanager.domain.model.Revista;
import com.libmanager.libmanager.dto.LivroDTO;
import com.libmanager.libmanager.dto.RevistaDTO;
import com.libmanager.libmanager.service.PublicacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/publicacoes")
public class PublicacaoController {

    private final PublicacaoService publicacaoService;

    @Autowired
    public PublicacaoController(PublicacaoService publicacaoService) {
        this.publicacaoService = publicacaoService;
    }

    @PostMapping("/livros")
    public ResponseEntity<Livro> cadastrarLivro(@RequestBody LivroDTO livroDTO) {
        Livro novoLivro = publicacaoService.cadastrarLivro(livroDTO);
        return ResponseEntity.status(201).body(novoLivro);
    }

    @PostMapping("/revistas")
    public ResponseEntity<Revista> cadastrarRevista(@RequestBody RevistaDTO revistaDTO) {
        Revista novaRevista = publicacaoService.cadastrarRevista(revistaDTO);
        return ResponseEntity.status(201).body(novaRevista);
    }

    @PutMapping("/livros/{id}")
    public ResponseEntity<Livro> atualizarLivro(@PathVariable Long id, @RequestBody LivroDTO livroDTO) {
        Livro livroAtualizado = publicacaoService.atualizarLivro(id, livroDTO);
        return ResponseEntity.ok(livroAtualizado);
    }

    @PutMapping("/revistas/{id}")
    public ResponseEntity<Revista> atualizarRevista(@PathVariable Long id, @RequestBody RevistaDTO revistaDTO) {
        Revista revistaAtualizada = publicacaoService.atualizarRevista(id, revistaDTO);
        return ResponseEntity.ok(revistaAtualizada);
    }
}
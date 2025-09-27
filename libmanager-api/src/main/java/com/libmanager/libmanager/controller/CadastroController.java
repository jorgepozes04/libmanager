package com.libmanager.libmanager.controller;

import com.libmanager.libmanager.dto.ClienteDTO;
import com.libmanager.libmanager.dto.LivroDTO;
import com.libmanager.libmanager.dto.RevistaDTO;
import com.libmanager.libmanager.dto.UsuarioDTO;
import com.libmanager.libmanager.domain.model.Cliente;
import com.libmanager.libmanager.domain.model.Livro;
import com.libmanager.libmanager.domain.model.Revista;
import com.libmanager.libmanager.domain.model.Usuario;
import com.libmanager.libmanager.service.CadastroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/cadastros")
public class CadastroController {

    private final CadastroService cadastroService;

    @Autowired
    public CadastroController(CadastroService cadastroService) {
        this.cadastroService = cadastroService;
    }

    @PostMapping("/clientes")
    public ResponseEntity<Cliente> cadastrarCliente(@RequestBody ClienteDTO clienteDTO) {
        Cliente novoCliente = cadastroService.cadastrarCliente(clienteDTO);
        return ResponseEntity.status(201).body(novoCliente);
    }

    @PostMapping("/usuarios")
    public ResponseEntity<Usuario> cadastrarUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        Usuario novoUsuario = cadastroService.cadastrarUsuario(usuarioDTO);
        return ResponseEntity.status(201).body(novoUsuario);
    }

    @PostMapping("/livros")
    public ResponseEntity<Livro> cadastrarLivro(@RequestBody LivroDTO livroDTO) {
        Livro novoLivro = cadastroService.cadastrarLivro(livroDTO);
        return ResponseEntity.status(201).body(novoLivro);
    }

    @PostMapping("/revistas")
    public ResponseEntity<Revista> cadastrarRevista(@RequestBody RevistaDTO revistaDTO) {
        Revista novaRevista = cadastroService.cadastrarRevista(revistaDTO);
        return ResponseEntity.status(201).body(novaRevista);
    }

    @PutMapping("/clientes/{id}")
    public ResponseEntity<Cliente> atualizarCliente(@PathVariable Long id, @RequestBody ClienteDTO clienteDTO) {
        Cliente clienteAtualizado = cadastroService.atualizarCliente(id, clienteDTO);
        return ResponseEntity.ok(clienteAtualizado);
    }

    @PutMapping("/livros/{id}")
    public ResponseEntity<Livro> atualizarLivro(@PathVariable Long id, @RequestBody LivroDTO livroDTO) {
        Livro livroAtualizado = cadastroService.atualizarLivro(id, livroDTO);
        return ResponseEntity.ok(livroAtualizado);
    }

    @PutMapping("/revistas/{id}")
    public ResponseEntity<Revista> atualizarRevista(@PathVariable Long id, @RequestBody RevistaDTO revistaDTO) {
        Revista revistaAtualizada = cadastroService.atualizarRevista(id, revistaDTO);
        return ResponseEntity.ok(revistaAtualizada);
    }
}
package com.libmanager.libmanager.service;

import com.libmanager.libmanager.domain.model.Livro;
import com.libmanager.libmanager.domain.model.Revista;
import com.libmanager.libmanager.domain.repository.LivroRepository;
import com.libmanager.libmanager.domain.repository.RevistaRepository;
import com.libmanager.libmanager.dto.LivroDTO;
import com.libmanager.libmanager.dto.RevistaDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PublicacaoService {

    private final LivroRepository livroRepository;
    private final RevistaRepository revistaRepository;

    public Livro cadastrarLivro(LivroDTO livroDTO) {
        Livro novoLivro = new Livro();
        novoLivro.setTitulo(livroDTO.getTitulo());
        novoLivro.setAutor(livroDTO.getAutor());
        novoLivro.setQuantDisponivel(livroDTO.getQuantDisponivel());
        return livroRepository.save(novoLivro);
    }

    public Revista cadastrarRevista(RevistaDTO revistaDTO) {
        Revista novaRevista = new Revista();
        novaRevista.setTitulo(revistaDTO.getTitulo());
        novaRevista.setEditora(revistaDTO.getEditora());
        novaRevista.setMesPublicacao(revistaDTO.getMesPublicacao());
        novaRevista.setAnoPublicacao(revistaDTO.getAnoPublicacao());
        novaRevista.setQuantDisponivel(revistaDTO.getQuantDisponivel());
        return revistaRepository.save(novaRevista);
    }

    public Livro atualizarLivro(Long id, LivroDTO livroDTO) {
        Livro livro = livroRepository.findById(id).orElseThrow(() -> new RuntimeException("Livro não encontrado."));
        livro.setTitulo(livroDTO.getTitulo());
        livro.setAutor(livroDTO.getAutor());
        livro.setQuantDisponivel(livroDTO.getQuantDisponivel());
        return livroRepository.save(livro);
    }

    public Revista atualizarRevista(Long id, RevistaDTO revistaDTO) {
        Revista revista = revistaRepository.findById(id).orElseThrow(() -> new RuntimeException("Revista não encontrada."));
        revista.setTitulo(revistaDTO.getTitulo());
        revista.setEditora(revistaDTO.getEditora());
        revista.setMesPublicacao(revistaDTO.getMesPublicacao());
        revista.setAnoPublicacao(revistaDTO.getAnoPublicacao());
        revista.setQuantDisponivel(revistaDTO.getQuantDisponivel());
        return revistaRepository.save(revista);
    }
}
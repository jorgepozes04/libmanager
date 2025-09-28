package com.libmanager.libmanager.service;

import com.libmanager.libmanager.domain.enums.Cargo;
import com.libmanager.libmanager.domain.enums.StatusMembro;
import com.libmanager.libmanager.domain.model.Endereco;
import com.libmanager.libmanager.domain.model.Usuario;
import com.libmanager.libmanager.domain.repository.UsuarioRepository;
import com.libmanager.libmanager.dto.EnderecoDTO;
import com.libmanager.libmanager.dto.UsuarioDTO;
import com.libmanager.libmanager.dto.UsuarioDetalhesDTO;
import com.libmanager.libmanager.dto.UsuarioResponseDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UsuarioResponseDTO> listarTodosUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(usuario -> new UsuarioResponseDTO(
                        usuario.getId(),
                        usuario.getNome(),
                        usuario.getNomeUsuario(),
                        usuario.getCargo(),
                        usuario.getStatus()
                )).collect(Collectors.toList());
    }

    // CORREÇÃO: Este método agora retorna o DTO com todos os detalhes.
    public UsuarioDetalhesDTO findUsuarioById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        return toUsuarioDetalhesDTO(usuario);
    }

    @Transactional
    public Usuario criarUsuario(UsuarioDTO usuarioDTO) {
        if (usuarioRepository.findByNomeUsuario(usuarioDTO.getNomeUsuario()).isPresent()) {
            throw new RuntimeException("Nome de usuário já existe.");
        }
        if (usuarioRepository.findByCpf(usuarioDTO.getCpf()).isPresent()) {
            throw new RuntimeException("Já existe um usuário com o CPF informado.");
        }

        Endereco endereco = new Endereco();
        endereco.setRua(usuarioDTO.getEndereco().getRua());
        endereco.setNumero(usuarioDTO.getEndereco().getNumero());
        endereco.setComplemento(usuarioDTO.getEndereco().getComplemento());
        endereco.setBairro(usuarioDTO.getEndereco().getBairro());
        endereco.setCidade(usuarioDTO.getEndereco().getCidade());
        endereco.setEstado(usuarioDTO.getEndereco().getEstado());
        endereco.setCep(usuarioDTO.getEndereco().getCep());

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(usuarioDTO.getNome());
        novoUsuario.setCpf(usuarioDTO.getCpf());
        novoUsuario.setNomeUsuario(usuarioDTO.getNomeUsuario());
        novoUsuario.setSenha(passwordEncoder.encode(usuarioDTO.getSenha()));
        novoUsuario.setStatus(StatusMembro.ATIVO);
        novoUsuario.setCargo(Cargo.USUARIO);
        novoUsuario.setEndereco(endereco);

        return usuarioRepository.save(novoUsuario);
    }

    @Transactional
    public Usuario atualizarUsuario(Long id, UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        usuario.setNome(usuarioDTO.getNome());
        usuario.setCpf(usuarioDTO.getCpf());
        usuario.setNomeUsuario(usuarioDTO.getNomeUsuario());

        if (usuarioDTO.getEndereco() != null) {
            Endereco endereco = usuario.getEndereco();
            if (endereco == null) {
                endereco = new Endereco();
                usuario.setEndereco(endereco);
            }
            endereco.setRua(usuarioDTO.getEndereco().getRua());
            endereco.setNumero(usuarioDTO.getEndereco().getNumero());
            endereco.setComplemento(usuarioDTO.getEndereco().getComplemento());
            endereco.setBairro(usuarioDTO.getEndereco().getBairro());
            endereco.setCidade(usuarioDTO.getEndereco().getCidade());
            endereco.setEstado(usuarioDTO.getEndereco().getEstado());
            endereco.setCep(usuarioDTO.getEndereco().getCep());
        }

        return usuarioRepository.save(usuario);
    }

    private UsuarioDetalhesDTO toUsuarioDetalhesDTO(Usuario usuario) {
        UsuarioDetalhesDTO dto = new UsuarioDetalhesDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setCpf(usuario.getCpf());
        dto.setNomeUsuario(usuario.getNomeUsuario());
        dto.setCargo(usuario.getCargo());
        dto.setStatus(usuario.getStatus());

        if (usuario.getEndereco() != null) {
            EnderecoDTO enderecoDTO = new EnderecoDTO();
            enderecoDTO.setRua(usuario.getEndereco().getRua());
            enderecoDTO.setNumero(usuario.getEndereco().getNumero());
            enderecoDTO.setComplemento(usuario.getEndereco().getComplemento());
            enderecoDTO.setBairro(usuario.getEndereco().getBairro());
            enderecoDTO.setCidade(usuario.getEndereco().getCidade());
            enderecoDTO.setEstado(usuario.getEndereco().getEstado());
            enderecoDTO.setCep(usuario.getEndereco().getCep());
            dto.setEndereco(enderecoDTO);
        }
        return dto;
    }
}
package com.libmanager.libmanager.service;

import com.libmanager.libmanager.domain.enums.StatusMembro;
import com.libmanager.libmanager.dto.DevolucaoResponseDTO;
import com.libmanager.libmanager.domain.repository.ClienteRepository;
import com.libmanager.libmanager.domain.repository.EmprestimoRepository;
import com.libmanager.libmanager.domain.repository.LivroRepository;
import com.libmanager.libmanager.domain.repository.UsuarioRepository;
import com.libmanager.libmanager.service.strategy.Multa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.libmanager.libmanager.dto.EmprestimoRequestDTO;
import com.libmanager.libmanager.domain.enums.StatusEmprestimo;
import com.libmanager.libmanager.domain.model.Cliente;
import com.libmanager.libmanager.domain.model.Emprestimo;
import com.libmanager.libmanager.domain.model.Livro;
import com.libmanager.libmanager.domain.model.Usuario;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class EmprestimoService {

    private final EmprestimoRepository emprestimoRepository;
    private final ClienteRepository clienteRepository;
    private final LivroRepository livroRepository;
    private final UsuarioRepository usuarioRepository;
    private final Multa multa;

    @Autowired
    public EmprestimoService(EmprestimoRepository emprestimoRepository,
                             ClienteRepository clienteRepository,
                             LivroRepository livroRepository,
                             UsuarioRepository usuarioRepository,
                             Multa multa) {
        this.emprestimoRepository = emprestimoRepository;
        this.clienteRepository = clienteRepository;
        this.livroRepository = livroRepository;
        this.usuarioRepository = usuarioRepository;
        this.multa = multa;
    }

    @Transactional
    public Emprestimo realizarEmprestimo(EmprestimoRequestDTO request) {

        Cliente cliente = clienteRepository.findById(request.getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado!"));

        Livro livro = livroRepository.findById(request.getIdLivro())
                .orElseThrow(() -> new RuntimeException("Livro não encontrado!"));

        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        if (cliente.getStatus() != StatusMembro.ATIVO) {
            throw new RuntimeException("Cliente não está ativo!");
        }

        if (cliente.isLivroEmprestado()) {
            throw new RuntimeException("Cliente já possui um empréstimo ativo!");
        }

        if (livro.getQuantDisponivel() <= 0) {
            throw new RuntimeException("Livro sem exemplares disponíveis!");
        }

        Optional<Emprestimo> emprestimoAtivo = emprestimoRepository
                .findByClienteIdAndStatus(cliente.getId(), StatusEmprestimo.ATIVO);

        if (emprestimoAtivo.isPresent()) {
            throw new RuntimeException("Cliente já possui um empréstimo ativo!");
        }

        livro.setQuantDisponivel(livro.getQuantDisponivel() - 1);
        cliente.setLivroEmprestado(true);

        Emprestimo novoEmprestimo = new Emprestimo();
        novoEmprestimo.setCliente(cliente);
        novoEmprestimo.setLivro(livro);
        novoEmprestimo.setUsuario(usuario);
        novoEmprestimo.setDataEmprestimo(LocalDate.now());
        novoEmprestimo.setDataDevolucaoPrevista(LocalDate.now().plusDays(7));
        novoEmprestimo.setStatus(StatusEmprestimo.ATIVO);

        return emprestimoRepository.save(novoEmprestimo);
    }

    @Transactional
    public DevolucaoResponseDTO realizarDevolucao(Long emprestimoId){
        Emprestimo emprestimo = emprestimoRepository.findById(emprestimoId)
                .orElseThrow(() -> new RuntimeException("Empréstimo com ID " + emprestimoId + " não encontrado."));
        if (emprestimo.getStatus() != StatusEmprestimo.ATIVO) {
            throw new RuntimeException("Este empréstimo não está ativo e não pode ser devolvido novamente.");
        }

        Livro livro = emprestimo.getLivro();
        Cliente cliente = emprestimo.getCliente();
        LocalDate dataDevolucao = LocalDate.now();

        double totalMulta = multa.calcular(emprestimo, dataDevolucao);

        if (totalMulta > 0) {
            emprestimo.setStatus(StatusEmprestimo.FINALIZADO_COM_ATRASO);
        } else {
            emprestimo.setStatus(StatusEmprestimo.FINALIZADO);
        }

        emprestimo.setDataDevolucaoRealizada(dataDevolucao);
        emprestimo.setMultaValor(totalMulta);

        livro.setQuantDisponivel(livro.getQuantDisponivel() + 1);
        cliente.setLivroEmprestado(false);

        emprestimoRepository.save(emprestimo);

        String mensagem = (totalMulta > 0) ? "Devolução realizada com atraso." : "Devolução realizada no prazo.";
        return new DevolucaoResponseDTO(mensagem, emprestimo.getId(), emprestimo.getStatus(), totalMulta);
    }

    public Optional<Emprestimo> buscarEmprestimoAtivoPorCliente(Long clienteId) {
        return emprestimoRepository.findByClienteIdAndStatus(clienteId, StatusEmprestimo.ATIVO);
    }
}
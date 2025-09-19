package com.libmanager.libmanager.service;

import com.libmanager.libmanager.dto.DevolucaoResponseDTO;
import com.libmanager.libmanager.repository.ClienteRepository;
import com.libmanager.libmanager.repository.EmprestimoRepository;
import com.libmanager.libmanager.repository.LivroRepository;
import com.libmanager.libmanager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.libmanager.libmanager.dto.EmprestimoRequestDTO;
import com.libmanager.libmanager.enums.StatusEmprestimo;
import com.libmanager.libmanager.model.Cliente;
import com.libmanager.libmanager.model.Emprestimo;
import com.libmanager.libmanager.model.Livro;
import com.libmanager.libmanager.model.Usuario;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class EmprestimoService {
    
    private final EmprestimoRepository emprestimoRepository;
    private final ClienteRepository clienteRepository;
    private final LivroRepository livroRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public EmprestimoService(EmprestimoRepository emprestimoRepository,
                             ClienteRepository clienteRepository,
                             LivroRepository livroRepository,
                             UsuarioRepository usuarioRepository) {
        this.emprestimoRepository = emprestimoRepository;
        this.clienteRepository = clienteRepository;
        this.livroRepository = livroRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional // Garante que a operação seja atômica (ou tudo funciona, ou nada é salvo)
    public Emprestimo realizarEmprestimo(EmprestimoRequestDTO request) {

        Cliente cliente = clienteRepository.findById(request.getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado!"));

        Livro livro = livroRepository.findById(request.getIdLivro())
                .orElseThrow(() -> new RuntimeException("Livro não encontrado!"));

        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        // Aplica as regras de negócio e pré-condições
        if (cliente.getStatus() != com.libmanager.libmanager.enums.StatusMembro.ATIVO) {
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


        // Atualiza o estado das entidades
        livro.setQuantDisponivel(livro.getQuantDisponivel() - 1);
        cliente.setLivroEmprestado(true);

        // Cria a nova entidade Emprestimo
        Emprestimo novoEmprestimo = new Emprestimo();
        novoEmprestimo.setCliente(cliente);
        novoEmprestimo.setLivro(livro);
        novoEmprestimo.setUsuario(usuario);
        novoEmprestimo.setDataEmprestimo(LocalDate.now());
        novoEmprestimo.setDataDevolucaoPrevista(LocalDate.now().plusDays(7)); // Prazo de 7 dias
        novoEmprestimo.setStatus(StatusEmprestimo.ATIVO);

        // Salva o novo empréstimo no banco. A transação também salva as alterações em Livro e Cliente.
        return emprestimoRepository.save(novoEmprestimo);
    }

    public DevolucaoResponseDTO realizarDevolucao(Long emprestimoId){
        Emprestimo emprestimo = emprestimoRepository.findById(emprestimoId)
                .orElseThrow(() -> new RuntimeException("Empréstimo com ID " + emprestimoId + " não encontrado."));
        if (emprestimo.getStatus() != StatusEmprestimo.ATIVO) {
            throw new RuntimeException("Este empréstimo não está ativo e não pode ser devolvido novamente.");
        }

        Livro livro = emprestimo.getLivro();
        Cliente cliente = emprestimo.getCliente();
        LocalDate dataDevolucao = LocalDate.now();
        double multa = 0;

        if (dataDevolucao.isAfter(emprestimo.getDataDevolucaoPrevista())) {
            long diasAtraso = ChronoUnit.DAYS.between(emprestimo.getDataDevolucaoPrevista(), dataDevolucao);
            double taxaDiaria = 2.50; // A taxa pode ser externalizada para um arquivo de configuração
            multa = diasAtraso * taxaDiaria;
            emprestimo.setStatus(StatusEmprestimo.FINALIZADO_COM_ATRASO);
        } else {
            emprestimo.setStatus(StatusEmprestimo.FINALIZADO);
        }

        emprestimo.setDataDevolucaoRealizada(dataDevolucao);
        emprestimo.setMultaValor(multa);

        livro.setQuantDisponivel(livro.getQuantDisponivel() + 1);
        cliente.setLivroEmprestado(false);

        emprestimoRepository.save(emprestimo);

        String mensagem = (multa > 0) ? "Devolução realizada com atraso." : "Devolução realizada no prazo.";
        return new DevolucaoResponseDTO(mensagem, emprestimo.getId(), emprestimo.getStatus(), multa);
    }

    public Optional<Emprestimo> buscarEmprestimoAtivoPorCliente(Long clienteId) {
        return emprestimoRepository.findByClienteIdAndStatus(clienteId, StatusEmprestimo.ATIVO);
    }
}
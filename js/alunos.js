// ==========================================
// MÓDULO DE ALUNOS (Cadastro e Salvamento)
// ==========================================
import { salvarAluno } from './storage.js';

export function initAlunos() {
    const form = document.getElementById('cadastro-aluno-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita recarregar a página

        // 1. Pega a foto em Base64 (se o aluno tirou foto)
        const fotoPreview = document.getElementById('foto-preview');
        // Se a foto não estiver oculta, significa que tem imagem. Se não, salva vazio.
        const fotoBase64 = !fotoPreview.classList.contains('hidden') ? fotoPreview.src : '';

        // 2. Monta o pacote de dados do Aluno
        const novoAluno = {
            id: Date.now().toString(), // Cria um ID único baseado na hora
            matricula: document.getElementById('aluno-matricula').value,
            nome: document.getElementById('aluno-nome').value,
            telefone: document.getElementById('aluno-telefone').value,
            turma: document.getElementById('aluno-turma').value,
            turno: document.getElementById('aluno-turno').value,
            responsavel: document.getElementById('aluno-responsavel').value,
            foto: fotoBase64,
            dataCadastro: new Date().toISOString()
        };

        // 3. Salva no Banco de Dados
        salvarAluno(novoAluno);
        
        alert('✅ Aluno cadastrado com sucesso!');

        // 4. Limpa o formulário para o próximo cadastro
        form.reset();
        
        // 5. "Clica" no botão de remover foto para resetar a tela da câmera visualmente
        const btnRemoverFoto = document.getElementById('btn-remover-foto');
        if (!btnRemoverFoto.classList.contains('hidden')) {
            btnRemoverFoto.click();
        }
    });
}

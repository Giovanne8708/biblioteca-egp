import { salvarAluno, getAlunos, excluirAluno } from './storage.js';

export function initAlunos() {
    const form = document.getElementById('cadastro-aluno-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o reload destrutivo da página
            
            const novoAluno = {
                id: Date.now().toString(),
                matricula: document.getElementById('aluno-matricula').value.trim(),
                nome: document.getElementById('aluno-nome').value.trim(),
                turma: document.getElementById('aluno-turma').value.trim(),
                turno: document.getElementById('aluno-turno').value,
                dataCadastro: new Date().toLocaleDateString('pt-BR')
            };

            if(novoAluno.matricula && novoAluno.nome) {
                salvarAluno(novoAluno);
                form.reset();
                alert('Aluno salvo com sucesso!');
                
                // Força a navegação de volta para a aba da lista e atualiza
                document.querySelector('[data-tab="lista-alunos"]').click();
                renderTabelaAlunos();
                atualizarDashboard();
            }
        });
    }
    
    // Injeta as funções globais para os botões da tabela gerados dinamicamente
    window.deletarAluno = (id) => {
        if(confirm('Tem certeza que deseja excluir este aluno?')) {
            excluirAluno(id.toString());
            renderTabelaAlunos();
            atualizarDashboard();
        }
    };

    renderTabelaAlunos();
}

export function renderTabelaAlunos() {
    const tbody = document.getElementById('tabela-alunos');
    if (!tbody) return;

    const alunos = getAlunos();
    tbody.innerHTML = '';

    if (alunos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-6 text-slate-500">Nenhum aluno cadastrado.</td></tr>`;
        return;
    }

    alunos.forEach(aluno => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-700/50 text-slate-300 hover:bg-slate-800/30 transition-colors';
        tr.innerHTML = `
            <td class="py-4 font-medium text-white">${aluno.matricula}</td>
            <td class="py-4">${aluno.nome}</td>
            <td class="py-4">${aluno.turma} - ${aluno.turno}</td>
            <td class="py-4 text-right">
                <button onclick="deletarAluno('${aluno.id}')" class="text-red-400 hover:text-red-300 p-2"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Atualização de reflexo no Dashboard
function atualizarDashboard() {
    const dashTotal = document.getElementById('dash-total-alunos');
    if(dashTotal) {
        dashTotal.textContent = getAlunos().length;
    }
}

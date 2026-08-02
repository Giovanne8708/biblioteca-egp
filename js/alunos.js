import { salvarAluno, getAlunos, excluirAluno } from './storage.js';

export function initAlunos() {
    const form = document.getElementById('cadastro-aluno-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fileInput = document.getElementById('aluno-foto');
            const salvar = (fotoBase64) => {
                const novoAluno = {
                    id: Date.now().toString(),
                    matricula: document.getElementById('aluno-matricula').value.trim(),
                    nome: document.getElementById('aluno-nome').value.trim(),
                    turma: document.getElementById('aluno-turma').value.trim(),
                    turno: document.getElementById('aluno-turno').value,
                    foto: fotoBase64 // Salva a imagem
                };

                salvarAluno(novoAluno);
                form.reset();
                alert('Aluno salvo com sucesso!');
                
                const btnLista = document.querySelector('[data-tab="lista-alunos"]');
                if(btnLista) btnLista.click();
                
                renderTabelaAlunos();
                if(window.atualizarDashboard) window.atualizarDashboard();
            };

            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (evento) => salvar(evento.target.result);
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                salvar('');
            }
        });
    }

    window.deletarAluno = (id) => {
        if(confirm('Tem certeza que deseja excluir este aluno?')) {
            excluirAluno(id.toString());
            renderTabelaAlunos();
            if(window.atualizarDashboard) window.atualizarDashboard();
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
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-500">Nenhum aluno cadastrado.</td></tr>`;
        return;
    }

    alunos.forEach(aluno => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-700/50 text-slate-300';
        
        // Exibe a foto original ou um ícone padrão cinza se não houver foto
        const imgHtml = aluno.foto 
            ? `<img src="${aluno.foto}" alt="Foto" class="w-12 h-12 object-contain bg-black/20 rounded">`
            : `<div class="w-12 h-12 flex items-center justify-center bg-slate-800 rounded text-slate-500"><i class="fa-solid fa-user"></i></div>`;

        tr.innerHTML = `
            <td class="py-4">${imgHtml}</td>
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

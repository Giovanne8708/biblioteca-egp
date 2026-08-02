import { getAlunos, salvarEmprestimo, getEmprestimos, atualizarEmprestimo, excluirEmprestimo } from './storage.js';

export function initEmprestimos() {
    const selectAluno = document.getElementById('emp-aluno');
    if(selectAluno) {
        selectAluno.addEventListener('focus', carregarAlunosSelect);
        carregarAlunosSelect();
    }

    const form = document.getElementById('cadastro-emprestimo-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const alunoId = document.getElementById('emp-aluno').value;
            const aluno = getAlunos().find(a => a.id === alunoId);
            if(!aluno) return alert('Selecione um aluno válido.');
            
            const novoEmprestimo = {
                id: Date.now().toString(),
                alunoId: aluno.id,
                livro: document.getElementById('emp-livro').value.trim(),
                dataRetirada: document.getElementById('emp-data-retirada').value,
                dataPrevisao: document.getElementById('emp-data-prevista').value,
                status: 'Emprestado'
            };

            salvarEmprestimo(novoEmprestimo);
            form.reset();
            alert('Empréstimo registrado!');
            
            const btnLista = document.querySelector('[data-tab="lista-emprestimos"]');
            if(btnLista) btnLista.click();
            
            renderTabelaEmprestimos();
            if(window.atualizarDashboard) window.atualizarDashboard();
        });
    }

    window.registrarDevolucao = (id) => {
        if(confirm('Confirmar devolução deste livro?')) {
            const emp = getEmprestimos().find(e => e.id === id);
            if(emp) {
                emp.status = 'Devolvido';
                atualizarEmprestimo(emp);
                renderTabelaEmprestimos();
                if(window.atualizarDashboard) window.atualizarDashboard();
            }
        }
    };
    
    window.deletarEmprestimo = (id) => {
        if(confirm('Tem certeza que deseja excluir permanentemente?')) {
            excluirEmprestimo(id);
            renderTabelaEmprestimos();
            if(window.atualizarDashboard) window.atualizarDashboard();
        }
    };

    renderTabelaEmprestimos();
}

function carregarAlunosSelect() {
    const select = document.getElementById('emp-aluno');
    if(!select) return;
    const alunos = getAlunos();
    
    select.innerHTML = '<option value="" disabled selected>Selecione um aluno...</option>';
    alunos.forEach(a => {
        select.innerHTML += `<option value="${a.id}">${a.nome} (${a.turma})</option>`;
    });
}

export function renderTabelaEmprestimos() {
    const tbody = document.getElementById('tabela-emprestimos');
    if (!tbody) return;

    const emprestimos = getEmprestimos();
    const alunos = getAlunos();
    tbody.innerHTML = '';

    if (emprestimos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-500">Nenhum empréstimo registrado.</td></tr>`;
        return;
    }

    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    emprestimos.forEach(emp => {
        const aluno = alunos.find(a => a.id === emp.alunoId) || { nome: 'Aluno Removido', turma: 'N/A', foto: '' };
        
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-700/50 text-slate-300';
        
        let statusFinal = emp.status;
        let tagHtml = `<span class="bg-blue-900/50 text-blue-400 px-3 py-1 rounded-full text-xs">Ativo</span>`;

        if (statusFinal === 'Devolvido') {
            tagHtml = `<span class="bg-emerald-900/50 text-emerald-400 px-3 py-1 rounded-full text-xs">Devolvido</span>`;
        } else {
            const dataPrev = new Date(emp.dataPrevisao);
            dataPrev.setHours(0,0,0,0);
            dataPrev.setDate(dataPrev.getDate() + 1);

            if (dataPrev < hoje) {
                emp.status = 'Atrasado';
                tagHtml = `<span class="bg-red-900/50 text-red-400 px-3 py-1 rounded-full text-xs animate-pulse">Atrasado</span>`;
            }
        }

        const btnDevolver = statusFinal !== 'Devolvido' 
            ? `<button onclick="registrarDevolucao('${emp.id}')" class="text-emerald-400 hover:text-emerald-300 mr-3"><i class="fa-solid fa-rotate-left"></i></button>`
            : '';

        const imgHtml = aluno.foto 
            ? `<img src="${aluno.foto}" alt="Foto" class="w-12 h-12 object-contain bg-black/20 rounded">`
            : `<div class="w-12 h-12 flex items-center justify-center bg-slate-800 rounded text-slate-500"><i class="fa-solid fa-user"></i></div>`;

        tr.innerHTML = `
            <td class="py-4">${imgHtml}</td>
            <td class="py-4">
                <div class="font-medium text-white">${aluno.nome}</div>
                <div class="text-xs text-slate-400 border border-slate-700 inline-block px-2 py-0.5 mt-1 rounded">${aluno.turma}</div>
            </td>
            <td class="py-4">${emp.livro}</td>
            <td class="py-4 text-slate-400 text-sm">P: ${emp.dataPrevisao.split('-').reverse().join('/')}</td>
            <td class="py-4">${tagHtml}</td>
            <td class="py-4 text-right">
                ${btnDevolver}
                <button onclick="deletarEmprestimo('${emp.id}')" class="text-slate-500 hover:text-red-400"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

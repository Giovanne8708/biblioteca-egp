import { getAlunos, salvarEmprestimo, getEmprestimos, atualizarEmprestimo, excluirEmprestimo, salvarHistorico } from './storage.js';

export function initEmprestimos() {
    // Lógica das Abas Internas de Empréstimo
    const tabBtns = document.querySelectorAll('.tab-btn-emp');
    const tabContents = document.querySelectorAll('.tab-content-emp');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            tabBtns.forEach(b => {
                b.classList.remove('active', 'text-blue-400', 'border-blue-500');
                b.classList.add('text-slate-400', 'border-transparent');
            });
            btn.classList.add('active', 'text-blue-400', 'border-blue-500');
            btn.classList.remove('text-slate-400', 'border-transparent');
            
            const targetId = btn.getAttribute('data-tab');
            tabContents.forEach(c => c.classList.add('hidden'));
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // Carregar Alunos no Select toda vez que for focado
    const selectAluno = document.getElementById('emp-aluno');
    if(selectAluno) {
        selectAluno.addEventListener('focus', carregarAlunosSelect);
        carregarAlunosSelect();
    }

    // Ação de Salvar Empréstimo
    const form = document.getElementById('cadastro-emprestimo-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const alunoId = document.getElementById('emp-aluno').value;
            const aluno = getAlunos().find(a => a.id === alunoId);
            
            const novoEmprestimo = {
                id: Date.now().toString(),
                alunoId: aluno.id,
                alunoNome: aluno.nome,
                alunoMatricula: aluno.matricula,
                alunoTurma: aluno.turma,
                livro: document.getElementById('emp-livro').value.trim(),
                autor: document.getElementById('emp-autor').value.trim(),
                dataRetirada: document.getElementById('emp-data-retirada').value,
                dataPrevisao: document.getElementById('emp-data-prevista').value,
                observacoes: document.getElementById('emp-obs').value.trim(),
                status: 'Emprestado',
                dataRealDevolucao: null
            };

            salvarEmprestimo(novoEmprestimo);
            
            salvarHistorico({
                tipo: 'EMPRESTIMO',
                dataRegistro: new Date().toISOString(),
                detalhe: `Livro "${novoEmprestimo.livro}" retirado por ${aluno.nome}.`,
                alunoId: aluno.id
            });

            form.reset();
            alert('Empréstimo registrado com sucesso!');
            document.querySelector('[data-tab="lista-emprestimos"]').click();
            renderTabelaEmprestimos();
            if(window.atualizarDashboard) window.atualizarDashboard();
        });
    }

    // Funções expostas para os botões da tabela gerados no innerHTML
    window.registrarDevolucao = (id) => {
        if(confirm('Confirmar a devolução deste livro?')) {
            const emp = getEmprestimos().find(e => e.id === id);
            if(emp) {
                emp.status = 'Devolvido';
                emp.dataRealDevolucao = new Date().toISOString().split('T')[0];
                atualizarEmprestimo(emp);
                
                salvarHistorico({
                    tipo: 'DEVOLUCAO',
                    dataRegistro: new Date().toISOString(),
                    detalhe: `Livro "${emp.livro}" devolvido por ${emp.alunoNome}.`,
                    alunoId: emp.alunoId
                });

                renderTabelaEmprestimos();
                if(window.atualizarDashboard) window.atualizarDashboard();
            }
        }
    };
    
    window.deletarEmprestimo = (id) => {
        if(confirm('Tem certeza que deseja excluir este registro permanentemente?')) {
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
    
    // Manter a opção selecionada atual se houver
    const currentValue = select.value;
    select.innerHTML = '<option value="" disabled selected>Selecione um aluno da lista...</option>';
    
    alunos.forEach(a => {
        select.innerHTML += `<option value="${a.id}">${a.nome} (${a.matricula})</option>`;
    });
    
    if(currentValue) select.value = currentValue;
}

export function renderTabelaEmprestimos() {
    const tbody = document.getElementById('tabela-emprestimos');
    if (!tbody) return;

    const emprestimos = getEmprestimos();
    tbody.innerHTML = '';

    if (emprestimos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-500">Nenhum empréstimo registrado.</td></tr>`;
        return;
    }

    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    // Organizar: Atrasados -> Pendentes -> Devolvidos (e por data)
    emprestimos.sort((a, b) => {
        if(a.status === 'Devolvido' && b.status !== 'Devolvido') return 1;
        if(a.status !== 'Devolvido' && b.status === 'Devolvido') return -1;
        return new Date(b.dataRetirada) - new Date(a.dataRetirada);
    });

    emprestimos.forEach(emp => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-700/50 text-slate-300 hover:bg-slate-800/30 transition-colors';
        
        const formatData = (d) => d.split('-').reverse().join('/');
        
        let statusFinal = emp.status;
        let tagHtml = '';

        if (statusFinal === 'Devolvido') {
            tagHtml = `<span class="bg-emerald-900/50 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">Devolvido</span>`;
        } else {
            const dataPrev = new Date(emp.dataPrevisao);
            dataPrev.setHours(0,0,0,0);
            dataPrev.setDate(dataPrev.getDate() + 1); // Correção de Timezone (Fuso Brasileiro)

            const diffTime = dataPrev.getTime() - hoje.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                statusFinal = 'Atrasado';
                emp.status = 'Atrasado';
                tagHtml = `<span class="bg-red-900/50 text-red-400 px-3 py-1 rounded-full text-xs font-bold animate-pulse">Atrasado (${Math.abs(diffDays)} dias)</span>`;
            } else if (diffDays === 0) {
                tagHtml = `<span class="bg-amber-900/50 text-amber-500 px-3 py-1 rounded-full text-xs font-semibold">Vence Hoje</span>`;
            } else {
                tagHtml = `<span class="bg-blue-900/50 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">Restam ${diffDays} d.</span>`;
            }
        }

        const btnDevolver = statusFinal !== 'Devolvido' 
            ? `<button onclick="registrarDevolucao('${emp.id}')" class="text-emerald-400 hover:bg-emerald-900/30 rounded p-2 transition-all mr-2" title="Registrar Devolução"><i class="fa-solid fa-rotate-left"></i></button>`
            : '';

        tr.innerHTML = `
            <td class="py-4">
                <p class="font-medium text-white">${emp.alunoNome}</p>
                <p class="text-xs text-slate-500">Mat: ${emp.alunoMatricula}</p>
            </td>
            <td class="py-4 font-medium text-white">${emp.livro}</td>
            <td class="py-4 text-slate-400 text-sm">
                R: ${formatData(emp.dataRetirada)}<br>
                P: ${formatData(emp.dataPrevisao)}
            </td>
            <td class="py-4">${tagHtml}</td>
            <td class="py-4 text-right">
                ${btnDevolver}
                <button onclick="deletarEmprestimo('${emp.id}')" class="text-slate-500 hover:text-red-400 transition-all p-2 title="Excluir Histórico"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

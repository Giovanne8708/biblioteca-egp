// ==========================================
// MÓDULO DE STORAGE (BANCO DE DADOS LOCAL) - V1.1
// ==========================================

export function initDB() {
    // Tabelas originais
    if (!localStorage.getItem('db_alunos')) localStorage.setItem('db_alunos', JSON.stringify([]));
    if (!localStorage.getItem('db_historico')) localStorage.setItem('db_historico', JSON.stringify([]));
    
    // NOVAS TABELAS V1.1
    if (!localStorage.getItem('db_emprestimos')) localStorage.setItem('db_emprestimos', JSON.stringify([]));
    if (!localStorage.getItem('db_config')) {
        localStorage.setItem('db_config', JSON.stringify({
            diasPadrao: 7,
            maxEmprestimos: 3,
            nomeBiblioteca: 'Biblioteca EGP'
        }));
    }
}

// --- CRUD ALUNOS ---
export function getAlunos() { return JSON.parse(localStorage.getItem('db_alunos')); }
export function salvarAluno(aluno) {
    const alunos = getAlunos();
    alunos.push(aluno);
    localStorage.setItem('db_alunos', JSON.stringify(alunos));
}
export function atualizarAluno(alunoAtualizado) {
    let alunos = getAlunos();
    const index = alunos.findIndex(a => a.id === alunoAtualizado.id);
    if(index !== -1) {
        alunos[index] = alunoAtualizado;
        localStorage.setItem('db_alunos', JSON.stringify(alunos));
    }
}

// --- CRUD EMPRÉSTIMOS (NOVO) ---
export function getEmprestimos() { return JSON.parse(localStorage.getItem('db_emprestimos')); }
export function salvarEmprestimo(emprestimo) {
    const emprestimos = getEmprestimos();
    emprestimos.push(emprestimo);
    localStorage.setItem('db_emprestimos', JSON.stringify(emprestimos));
}
export function atualizarEmprestimo(emprestimoAtualizado) {
    let emprestimos = getEmprestimos();
    const index = emprestimos.findIndex(e => e.id === emprestimoAtualizado.id);
    if(index !== -1) {
        emprestimos[index] = emprestimoAtualizado;
        localStorage.setItem('db_emprestimos', JSON.stringify(emprestimos));
    }
}

// --- CONFIGURAÇÕES (NOVO) ---
export function getConfig() { return JSON.parse(localStorage.getItem('db_config')); }
export function salvarConfig(config) { localStorage.setItem('db_config', JSON.stringify(config)); }

// --- BACKUP V1.1 (NOVO) ---
export function gerarBackup() {
    const backup = {
        alunos: getAlunos(),
        emprestimos: getEmprestimos(),
        historico: JSON.parse(localStorage.getItem('db_historico')),
        config: getConfig(),
        dataBackup: new Date().toISOString()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `backup_biblioteca_${new Date().getTime()}.json`);
    document.body.appendChild(downloadAnchorNode); // Requerido para Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

export async function importarBackup(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if(data.alunos && data.emprestimos && data.historico) {
                    localStorage.setItem('db_alunos', JSON.stringify(data.alunos));
                    localStorage.setItem('db_emprestimos', JSON.stringify(data.emprestimos));
                    localStorage.setItem('db_historico', JSON.stringify(data.historico));
                    if(data.config) localStorage.setItem('db_config', JSON.stringify(data.config));
                    resolve(true);
                } else {
                    reject("Arquivo de backup inválido.");
                }
            } catch (e) {
                reject("Erro ao ler o arquivo JSON.");
            }
        };
        reader.readAsText(file);
    });
}

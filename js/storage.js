// ==========================================
// MÓDULO DE PERSISTÊNCIA CRÍTICA (STORAGE)
// ==========================================

export function initDB() {
    if (!localStorage.getItem('db_alunos')) localStorage.setItem('db_alunos', JSON.stringify([]));
    if (!localStorage.getItem('db_emprestimos')) localStorage.setItem('db_emprestimos', JSON.stringify([]));
}

// --- ALUNOS ---
export function getAlunos() {
    try {
        return JSON.parse(localStorage.getItem('db_alunos')) || [];
    } catch (e) {
        return [];
    }
}

export function salvarAluno(aluno) {
    const alunos = getAlunos();
    alunos.push(aluno);
    localStorage.setItem('db_alunos', JSON.stringify(alunos));
}

export function excluirAluno(id) {
    const alunos = getAlunos().filter(a => a.id !== id);
    localStorage.setItem('db_alunos', JSON.stringify(alunos));
}

// --- EMPRÉSTIMOS ---
export function getEmprestimos() {
    try {
        return JSON.parse(localStorage.getItem('db_emprestimos')) || [];
    } catch (e) {
        return [];
    }
}

export function salvarEmprestimo(emprestimo) {
    const emprestimos = getEmprestimos();
    emprestimos.push(emprestimo);
    localStorage.setItem('db_emprestimos', JSON.stringify(emprestimos));
}

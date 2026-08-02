export function initDB() {
    if (!localStorage.getItem('db_alunos')) localStorage.setItem('db_alunos', JSON.stringify([]));
    if (!localStorage.getItem('db_emprestimos')) localStorage.setItem('db_emprestimos', JSON.stringify([]));
    if (!localStorage.getItem('db_historico')) localStorage.setItem('db_historico', JSON.stringify([]));
}

export function getAlunos() {
    try { return JSON.parse(localStorage.getItem('db_alunos')) || []; } 
    catch (e) { return []; }
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

export function getEmprestimos() {
    try { return JSON.parse(localStorage.getItem('db_emprestimos')) || []; } 
    catch (e) { return []; }
}

export function salvarEmprestimo(emprestimo) {
    const emprestimos = getEmprestimos();
    emprestimos.push(emprestimo);
    localStorage.setItem('db_emprestimos', JSON.stringify(emprestimos));
}

export function atualizarEmprestimo(emp) {
    let emprestimos = getEmprestimos();
    const index = emprestimos.findIndex(e => e.id === emp.id);
    if(index !== -1) {
        emprestimos[index] = emp;
        localStorage.setItem('db_emprestimos', JSON.stringify(emprestimos));
    }
}

export function excluirEmprestimo(id) {
    let emprestimos = getEmprestimos().filter(e => e.id !== id);
    localStorage.setItem('db_emprestimos', JSON.stringify(emprestimos));
}

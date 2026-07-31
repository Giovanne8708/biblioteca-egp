import { initDB } from './storage.js';
import { initRouter } from './router.js';
import { initDashboard } from './dashboard.js';
import { initAlunos } from './alunos.js';
import { registerAction } from './historico.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Segurança
    if (!sessionStorage.getItem('auth_token')) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Inicia o Banco de Dados
    initDB();

    // 3. Registra o Histórico de Login
    if (!sessionStorage.getItem('login_registrado')) {
        registerAction('Login', 'Acesso autorizado ao sistema.');
        sessionStorage.setItem('login_registrado', 'true');
    }

    // 4. Inicia as Telas
    initDashboard();
    initAlunos();
    initRouter();

    // 5. BOTÃO DE SAIR (Corrigido!)
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            registerAction('Logout', 'Usuário encerrou a sessão.');
            sessionStorage.clear();
            window.location.href = 'login.html';
        });
    }
});

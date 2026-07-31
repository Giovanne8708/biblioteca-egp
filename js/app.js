/**
 * MÓDULO PRINCIPAL (ENTRY POINT)
 * Responsabilidade Única: Bootstrap da aplicação e injeção de dependências.
 */
import { initDB } from './storage.js';
import { initRouter } from './router.js';
import { registerAction } from './historico.js';
import { initDashboard } from './dashboard.js';
import { initAlunos } from './alunos.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificação Rigorosa de Segurança (Guarda de Rota)
    if (!sessionStorage.getItem('auth_token')) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Inicializa Banco de Dados
    initDB();

    // 3. Registra Login se for a primeira vez na sessão
    if (!sessionStorage.getItem('login_registrado')) {
        registerAction('Login', 'Acesso autorizado ao sistema.');
        sessionStorage.setItem('login_registrado', 'true');
    }

    // 4. Inicializa Módulos de Interface e Lógica
    initDashboard();
    initAlunos();
    
    // 5. Inicializa Roteador SPA (depois que as telas foram renderizadas)
    initRouter();

    // 6. Configura botão de Logout
    document.getElementById('btn-logout').addEventListener('click', () => {
        registerAction('Logout', 'Usuário encerrou a sessão.');
        sessionStorage.clear();
        window.location.href = 'login.html';
    });
});
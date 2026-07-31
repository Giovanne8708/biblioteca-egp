import { initDB } from './storage.js';
import { initRouter } from './router.js';
import { initDashboard } from './dashboard.js';
import { initAlunos } from './alunos.js';
// Não importe Livros

document.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('auth_token')) {
        window.location.href = 'login.html';
        return;
    }
    initDB();
    initDashboard();
    initAlunos();
    initRouter();
});

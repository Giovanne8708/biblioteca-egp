import { initDB } from './storage.js';
import { initRouter } from './router.js';
import { initConfiguracoes } from './configuracoes.js';
// Se tiver o import do alunos.js aí, deixe ele também!

document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
        window.location.href = 'login.html';
        return; 
    }

    // Liga o banco, menus e configurações
    initDB();
    initRouter();
    initConfiguracoes();

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('usuario_logado');
            window.location.href = 'login.html';
        });
    }
});

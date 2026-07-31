import { initDB } from './storage.js';
import { initRouter } from './router.js';
import { initConfiguracoes } from './configuracoes.js';
import { initCamera } from './camera.js';
import { initAlunos } from './alunos.js'; // 1. IMPORTA ALUNOS AQUI

document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
        window.location.href = 'login.html';
        return; 
    }

    // Liga todos os módulos
    initDB();
    initRouter();
    initConfiguracoes();
    initCamera();
    initAlunos(); // 2. LIGA ALUNOS AQUI

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('usuario_logado');
            window.location.href = 'login.html';
        });
    }
});

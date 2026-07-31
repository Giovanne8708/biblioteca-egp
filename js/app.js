import { initDB } from './storage.js';
import { initRouter } from './router.js';
import { initConfiguracoes } from './configuracoes.js';
import { initCamera } from './camera.js'; // 1. IMPORTA A CÂMERA AQUI

document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
        window.location.href = 'login.html';
        return; 
    }

    // Liga todos os módulos do sistema
    initDB();
    initRouter();
    initConfiguracoes();
    initCamera(); // 2. LIGA A CÂMERA AQUI

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('usuario_logado');
            window.location.href = 'login.html';
        });
    }
});

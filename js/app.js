import { initDB } from './storage.js';
import { initRouter } from './router.js';
// Se você tiver o arquivo alunos.js, mantenha a importação dele aqui se necessário

document.addEventListener('DOMContentLoaded', () => {
    // 1. TRAVA DE SEGURANÇA (Verifica o Login)
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
        window.location.href = 'login.html';
        return; // Para tudo imediatamente se não tiver logado
    }

    // 2. INICIA O BANCO DE DADOS LOCAL
    initDB();

    // 3. LIGA OS BOTÕES DO MENU LATERAL
    initRouter();

    // 4. CONFIGURA O BOTÃO DE SAIR (LOGOUT)
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            // Limpa a memória do navegador e joga pro login
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('usuario_logado');
            window.location.href = 'login.html';
        });
    }

    // (Opcional) Inicializa funções de outros módulos, como o de Alunos, se já existirem
    // initAlunos(); 
});

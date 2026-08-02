import { initDB, getAlunos, getEmprestimos } from './storage.js';
import { initAlunos } from './alunos.js';
import { initEmprestimos } from './emprestimos.js';

// ==========================================
// FUNÇÃO GLOBAL DE ATUALIZAÇÃO DO DASHBOARD
// ==========================================
window.atualizarDashboard = () => {
    // 1. Atualiza Alunos
    const dashTotal = document.getElementById('dash-total-alunos');
    if(dashTotal) dashTotal.textContent = getAlunos().length;

    // 2. Atualiza Empréstimos Ativos (Tudo que não foi devolvido)
    const emprestimos = getEmprestimos();
    const ativos = emprestimos.filter(e => e.status !== 'Devolvido');
    const dashAtivos = document.getElementById('dash-emprestimos-ativos');
    if(dashAtivos) dashAtivos.textContent = ativos.length;

    // 3. Atualiza Atrasos Dinamicamente
    let atrasados = 0;
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    
    ativos.forEach(emp => {
        const prev = new Date(emp.dataPrevisao);
        prev.setHours(0,0,0,0);
        prev.setDate(prev.getDate() + 1); // Compensador de timezone
        if (prev < hoje) atrasados++;
    });

    const dashAtrasos = document.getElementById('dash-atrasos');
    if(dashAtrasos) dashAtrasos.textContent = atrasados;
};

// ==========================================
// INICIALIZAÇÃO DO SISTEMA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicia e Conecta todo o ecossistema do banco e das telas
    initDB();
    initAlunos();
    initEmprestimos(); 
    
    // Alimenta os cards do Dashboard logo que o app carrega
    window.atualizarDashboard(); 

    // ==========================================
    // SISTEMA DE ABAS (TABS) - ALUNOS
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            tabBtns.forEach(b => {
                b.classList.remove('active', 'text-blue-400', 'border-blue-500');
                b.classList.add('text-slate-400', 'border-transparent');
            });
            btn.classList.add('active', 'text-blue-400', 'border-blue-500');
            btn.classList.remove('text-slate-400', 'border-transparent');
            
            const targetId = btn.getAttribute('data-tab');
            tabContents.forEach(c => c.classList.add('hidden'));
            
            const targetElement = document.getElementById(targetId);
            if (targetElement) targetElement.classList.remove('hidden');
        });
    });

    // ==========================================
    // SISTEMA DO MENU LATERAL (MOBILE) E NAVEGAÇÃO
    // ==========================================
    const btnMobileMenu = document.getElementById('btn-mobile-menu');
    const btnCloseMenu = document.getElementById('btn-close-menu');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    // Função de abrir/fechar o menu hambúrguer
    const toggleMenu = () => {
        if (!sidebar) return;
        const isClosed = sidebar.classList.contains('-translate-x-full');
        if (isClosed) {
            sidebar.classList.remove('-translate-x-full');
            if (sidebarOverlay) sidebarOverlay.classList.remove('hidden');
        } else {
            sidebar.classList.add('-translate-x-full');
            if (sidebarOverlay) sidebarOverlay.classList.add('hidden');
        }
    };

    if (btnMobileMenu) btnMobileMenu.addEventListener('click', toggleMenu);
    if (btnCloseMenu) btnCloseMenu.addEventListener('click', toggleMenu);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleMenu);

    // Navegação Principal (Trocar de Telas no Menu)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            // Muda a cor do link ativo
            navLinks.forEach(nav => {
                nav.classList.remove('active', 'text-white', 'bg-slate-800/50');
                nav.classList.add('text-slate-400');
            });
            link.classList.add('active', 'text-white', 'bg-slate-800/50');
            
            // Mostra a section correta e esconde as outras
            sections.forEach(section => {
                if (section.id === targetId) section.classList.remove('hidden');
                else section.classList.add('hidden');
            });

            // Se estiver no celular, fecha o menu automaticamente ao clicar em um link
            if (window.innerWidth < 768 && sidebar) {
                sidebar.classList.add('-translate-x-full');
                if (sidebarOverlay) sidebarOverlay.classList.add('hidden');
            }
        });
    });

    // ==========================================
    // SISTEMA DE LOGOUT
    // ==========================================
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('usuario_logado');
            window.location.href = 'login.html';
        });
    }
});

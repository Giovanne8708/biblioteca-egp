import { initDB, getAlunos, getEmprestimos } from './storage.js';
import { initAlunos } from './alunos.js';
import { initEmprestimos } from './emprestimos.js';

window.atualizarDashboard = () => {
    const dashTotal = document.getElementById('dash-total-alunos');
    if(dashTotal) dashTotal.textContent = getAlunos().length;

    const emprestimos = getEmprestimos();
    const ativos = emprestimos.filter(e => e.status !== 'Devolvido');
    
    const dashAtivos = document.getElementById('dash-emprestimos-ativos');
    if(dashAtivos) dashAtivos.textContent = ativos.length;

    let atrasados = 0;
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    
    ativos.forEach(emp => {
        const prev = new Date(emp.dataPrevisao);
        prev.setHours(0,0,0,0);
        prev.setDate(prev.getDate() + 1);
        if (prev < hoje) atrasados++;
    });

    const dashAtrasos = document.getElementById('dash-atrasos');
    if(dashAtrasos) dashAtrasos.textContent = atrasados;
};

document.addEventListener('DOMContentLoaded', () => {
    initDB();
    initAlunos();
    initEmprestimos(); 
    window.atualizarDashboard();

    // Lógica Universal de Abas (Tabs) - Serve para Alunos e Empréstimos
    const abas = [
        { btns: '.tab-btn', contents: '.tab-content' },
        { btns: '.tab-btn-emp', contents: '.tab-content-emp' }
    ];

    abas.forEach(grupo => {
        const botoes = document.querySelectorAll(grupo.btns);
        const conteudos = document.querySelectorAll(grupo.contents);
        
        botoes.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                botoes.forEach(b => {
                    b.classList.remove('active', 'text-blue-400', 'border-blue-500');
                    b.classList.add('text-slate-400', 'border-transparent');
                });
                btn.classList.add('active', 'text-blue-400', 'border-blue-500');
                btn.classList.remove('text-slate-400', 'border-transparent');
                
                const targetId = btn.getAttribute('data-tab');
                conteudos.forEach(c => c.classList.add('hidden'));
                const targetElement = document.getElementById(targetId);
                if(targetElement) targetElement.classList.remove('hidden');
            });
        });
    });

    // Lógica do Menu Mobile e Navegação Principal
    const btnMobileMenu = document.getElementById('btn-mobile-menu');
    const btnCloseMenu = document.getElementById('btn-close-menu');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

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

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            navLinks.forEach(nav => {
                nav.classList.remove('active', 'text-white', 'bg-slate-800/50');
                nav.classList.add('text-slate-400');
            });
            link.classList.add('active', 'text-white', 'bg-slate-800/50');
            
            sections.forEach(section => {
                if (section.id === targetId) section.classList.remove('hidden');
                else section.classList.add('hidden');
            });

            if (window.innerWidth < 768 && sidebar) toggleMenu();
        });
    });
});

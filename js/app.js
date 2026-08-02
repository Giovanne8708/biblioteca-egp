import { initDB, getAlunos } from './storage.js';
import { initAlunos } from './alunos.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o Banco e Módulos
    initDB();
    initAlunos();

    // Atualiza Painel Inicial
    const dashTotal = document.getElementById('dash-total-alunos');
    if(dashTotal) dashTotal.textContent = getAlunos().length;

    // 2. Sistema de Abas (Tabs)
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
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // 3. Sistema de Menu Lateral (Offcanvas Responsivo)
    const btnMobileMenu = document.getElementById('btn-mobile-menu');
    const btnCloseMenu = document.getElementById('btn-close-menu');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    const toggleMenu = () => {
        const isClosed = sidebar.classList.contains('-translate-x-full');
        if (isClosed) {
            sidebar.classList.remove('-translate-x-full');
            sidebarOverlay.classList.remove('hidden');
        } else {
            sidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
        }
    };

    if(btnMobileMenu) btnMobileMenu.addEventListener('click', toggleMenu);
    if(btnCloseMenu) btnCloseMenu.addEventListener('click', toggleMenu);
    if(sidebarOverlay) sidebarOverlay.addEventListener('click', toggleMenu);

    // 4. Navegação Principal
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

            // Fecha menu no mobile ao clicar em um link
            if (window.innerWidth < 768) {
                sidebar.classList.add('-translate-x-full');
                sidebarOverlay.classList.add('hidden');
            }
        });
    });
});

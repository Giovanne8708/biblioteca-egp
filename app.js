import Storage from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    Storage.init();

    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    const toggleMenu = () => {
        sidebar.classList.toggle('-translate-x-full');
        mobileOverlay.classList.toggle('hidden');
    };

    document.getElementById('btn-open-menu')?.addEventListener('click', toggleMenu);
    document.getElementById('btn-close-menu')?.addEventListener('click', toggleMenu);
    mobileOverlay?.addEventListener('click', toggleMenu);

    const navItems = document.querySelectorAll('.nav-item[data-view]');
    const views = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('text-white', 'bg-slate-700/50'));
            item.classList.add('text-white', 'bg-slate-700/50');

            const targetView = item.getAttribute('data-view');
            views.forEach(view => view.classList.add('hidden'));
            document.getElementById(`view-${targetView}`).classList.remove('hidden');

            if (window.innerWidth < 768) toggleMenu();
        });
    });
});
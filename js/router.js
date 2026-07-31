/**
 * MÓDULO DE ROTEAMENTO
 * Responsabilidade Única: Trocar os conteúdos da tela sem recarregar (SPA).
 */

export const initRouter = () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view-section');

    const navigateTo = (viewId) => {
        // Oculta todas as telas
        views.forEach(view => view.classList.add('hidden'));
        // Exibe a tela alvo
        const targetView = document.getElementById(`view-${viewId}`);
        if(targetView) targetView.classList.remove('hidden');

        // Atualiza estilo do menu lateral
        navLinks.forEach(link => {
            link.classList.remove('bg-blue-600/20', 'text-blue-400', 'border-r-4', 'border-blue-500');
            if(link.dataset.target === viewId) {
                link.classList.add('bg-blue-600/20', 'text-blue-400', 'border-r-4', 'border-blue-500');
            }
        });
    };

    // Adiciona evento de clique aos links do menu
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            navigateTo(target);
        });
    });

    // Inicia no Dashboard
    navigateTo('dashboard');
};
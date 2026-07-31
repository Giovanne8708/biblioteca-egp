export function initRouter() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Descobre o alvo do botão
            const targetId = link.getAttribute('data-target');

            // Remove a cor azul de todos os botões
            navLinks.forEach(nav => {
                nav.classList.remove('active', 'text-white', 'bg-slate-800/50');
                nav.classList.add('text-slate-400');
            });

            // Coloca a cor azul só no botão clicado
            link.classList.add('active', 'text-white', 'bg-slate-800/50');
            link.classList.remove('text-slate-400');

            // Esconde todas as telas e mostra a tela correta
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    });
}

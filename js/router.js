export function initRouter() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. Descobre para qual tela o botão aponta
            const targetId = link.getAttribute('data-target');

            // 2. Tira a marcação azul de todos os botões
            navLinks.forEach(nav => {
                nav.classList.remove('active', 'text-white', 'bg-slate-800/50');
                nav.classList.add('text-slate-400');
            });

            // 3. Pinta de azul apenas o botão clicado
            link.classList.add('active', 'text-white', 'bg-slate-800/50');
            link.classList.remove('text-slate-400');

            // 4. Esconde todas as telas e mostra só a que queremos
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

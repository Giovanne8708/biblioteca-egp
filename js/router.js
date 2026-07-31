export function initRouter() {
    // === NAVEGAÇÃO DO MENU LATERAL ===
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            navLinks.forEach(nav => {
                nav.classList.remove('active', 'text-white', 'bg-slate-800/50');
                nav.classList.add('text-slate-400');
            });

            link.classList.add('active', 'text-white', 'bg-slate-800/50');
            link.classList.remove('text-slate-400');

            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    });

    // === NAVEGAÇÃO DAS ABAS INTERNAS (Ex: Novo Cadastro) ===
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-tab');

            // Tira o brilho azul de todas as abas
            tabBtns.forEach(b => {
                b.classList.remove('active', 'text-blue-400', 'border-blue-500');
                b.classList.add('text-slate-400', 'border-transparent');
            });

            // Coloca o brilho azul na aba clicada
            btn.classList.add('active', 'text-blue-400', 'border-blue-500');
            btn.classList.remove('text-slate-400', 'border-transparent');

            // Esconde os conteúdos
            tabContents.forEach(content => {
                content.classList.add('hidden');
                content.classList.remove('block');
            });

            // Mostra apenas o conteúdo da aba clicada
            const targetContent = document.getElementById(targetId);
            if(targetContent) {
                targetContent.classList.remove('hidden');
                targetContent.classList.add('block');
            }
        });
    });
}

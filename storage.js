export default {
    init() {
        ['alunos', 'livros'].forEach(key => {
            if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify([]));
        });
    },
    get(collection) { return JSON.parse(localStorage.getItem(collection)) || []; }
};
/**
 * MÓDULO DE PERSISTÊNCIA
 * Responsabilidade Única: Interagir com o LocalStorage.
 */

const collections = ['alunos', 'livros', 'emprestimos', 'historico'];

export const initDB = () => {
    collections.forEach(key => {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify([]));
        }
    });
};

export const get = (collection) => {
    return JSON.parse(localStorage.getItem(collection)) || [];
};

export const set = (collection, data) => {
    localStorage.setItem(collection, JSON.stringify(data));
};

export const add = (collection, item) => {
    const data = get(collection);
    item.ativo = true; // Necessário para exclusão lógica
    data.push(item);
    set(collection, data);
    return item;
};

export const update = (collection, id, updatedData) => {
    const data = get(collection);
    const index = data.findIndex(i => i.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...updatedData };
        set(collection, data);
    }
};

export const softDelete = (collection, id) => {
    update(collection, id, { ativo: false });
};

// Funções de Backup
export const exportBackup = () => {
    const backup = {};
    collections.forEach(key => backup[key] = get(key));
    const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_biblioteca_${new Date().getTime()}.json`;
    a.click();
};

export const importBackup = (jsonData) => {
    try {
        const backup = JSON.parse(jsonData);
        collections.forEach(key => {
            if (backup[key]) set(key, backup[key]);
        });
        return true;
    } catch (e) {
        return false;
    }
};
/**
 * MÓDULO DE HISTÓRICO (AUDITORIA)
 * Responsabilidade Única: Registrar todas as ações do sistema.
 */
import { add, get } from './storage.js';
import { getCurrentDate, getCurrentTime, generateId } from './utils.js';

export const registerAction = (actionType, description) => {
    const user = sessionStorage.getItem('usuario_logado') || 'Sistema';
    
    const log = {
        id: generateId(),
        data: getCurrentDate(),
        hora: getCurrentTime(),
        tipo: actionType,
        descricao: description,
        usuario: user
    };
    
    add('historico', log);
};

export const getHistory = () => {
    return get('historico').reverse(); // Mais recentes primeiro
};
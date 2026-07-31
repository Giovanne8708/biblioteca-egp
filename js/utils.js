/**
 * MÓDULO DE UTILIDADES
 * Responsabilidade Única: Funções genéricas reutilizáveis.
 */

export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getCurrentDate = () => {
    return new Date().toLocaleDateString('pt-BR');
};

export const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pt-BR');
};

export const formatPhone = (phone) => {
    phone = phone.replace(/\D/g, '');
    if (phone.length === 11) {
        return phone.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone;
};

export const showAlert = (message, type = 'success') => {
    const alertBox = document.createElement('div');
    const colors = type === 'success' ? 'bg-emerald-500' : 'bg-red-500';
    
    alertBox.className = `fixed top-5 right-5 ${colors} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-500`;
    alertBox.innerHTML = `<strong>${type === 'success' ? 'Sucesso' : 'Erro'}:</strong> ${message}`;
    
    document.body.appendChild(alertBox);
    setTimeout(() => {
        alertBox.style.opacity = '0';
        setTimeout(() => alertBox.remove(), 500);
    }, 3000);
};
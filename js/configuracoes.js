import { getConfig, salvarConfig } from './storage.js';

export function initConfiguracoes() {
    const formConfig = document.getElementById('form-config');
    if (!formConfig) return;

    // 1. Carrega os dados salvos quando a tela abre
    const config = getConfig();
    if (config) {
        document.getElementById('config-nome').value = config.nomeBiblioteca || '';
        document.getElementById('config-dias').value = config.diasPadrao || 7;
        document.getElementById('config-max').value = config.maxEmprestimos || 3;
    }

    // 2. Salva os dados quando clica no botão
    formConfig.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita a página piscar/recarregar
        
        const novaConfig = {
            nomeBiblioteca: document.getElementById('config-nome').value,
            diasPadrao: parseInt(document.getElementById('config-dias').value),
            maxEmprestimos: parseInt(document.getElementById('config-max').value)
        };
        
        salvarConfig(novaConfig);
        alert('Configurações salvas com sucesso!');
    });
}

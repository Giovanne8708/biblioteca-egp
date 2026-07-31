/**
 * MÓDULO DASHBOARD
 * Responsabilidade: Renderizar a tela inicial e calcular estatísticas em tempo real.
 */
import { get } from './storage.js';

export const initDashboard = () => {
    renderView();
    updateDashboard();
};

const renderView = () => {
    const container = document.getElementById('view-dashboard');
    container.innerHTML = `
        <h2 class="text-3xl font-bold text-white mb-6 tracking-tight">Visão Geral</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Card Livros -->
            <div class="glass p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-colors">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-slate-400 text-sm font-medium mb-1">Total de Livros</p>
                        <h3 class="text-3xl font-bold text-white" id="dash-total-livros">0</h3>
                    </div>
                    <div class="p-3 bg-blue-500/20 rounded-lg text-blue-400"><i class="fa-solid fa-book"></i></div>
                </div>
            </div>
            
            <!-- Card Alunos -->
            <div class="glass p-6 rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-colors">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-slate-400 text-sm font-medium mb-1">Alunos Cadastrados</p>
                        <h3 class="text-3xl font-bold text-white" id="dash-total-alunos">0</h3>
                    </div>
                    <div class="p-3 bg-emerald-500/20 rounded-lg text-emerald-400"><i class="fa-solid fa-user-graduate"></i></div>
                </div>
            </div>

            <!-- Card Empréstimos -->
            <div class="glass p-6 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-colors">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-slate-400 text-sm font-medium mb-1">Empréstimos Ativos</p>
                        <h3 class="text-3xl font-bold text-white" id="dash-total-emprestimos">0</h3>
                    </div>
                    <div class="p-3 bg-purple-500/20 rounded-lg text-purple-400"><i class="fa-solid fa-hand-holding-hand"></i></div>
                </div>
            </div>

            <!-- Card Atrasos -->
            <div class="glass p-6 rounded-2xl border border-red-900/50 hover:border-red-500/50 transition-colors">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-red-400 text-sm font-medium mb-1">Entregas Atrasadas</p>
                        <h3 class="text-3xl font-bold text-red-500" id="dash-total-atrasos">0</h3>
                    </div>
                    <div class="p-3 bg-red-500/20 rounded-lg text-red-400"><i class="fa-solid fa-triangle-exclamation"></i></div>
                </div>
            </div>
        </div>
    `;
};

// Esta função é exportada para que outros módulos possam chamá-la ao salvar um dado
export const updateDashboard = () => {
    // Busca dados ativos no banco
    const alunos = get('alunos').filter(a => a.ativo);
    const livros = get('livros').filter(l => l.ativo);
    const emprestimos = get('emprestimos').filter(e => e.ativo && !e.devolvido);
    
    // Calcula Atrasos (Lógica simulada para implementação futura no módulo de empréstimos)
    const hoje = new Date();
    const atrasados = emprestimos.filter(e => new Date(e.dataDevolucaoPrevista) < hoje).length;

    // Atualiza a tela
    const elAlunos = document.getElementById('dash-total-alunos');
    const elLivros = document.getElementById('dash-total-livros');
    const elEmprestimos = document.getElementById('dash-total-emprestimos');
    const elAtrasos = document.getElementById('dash-total-atrasos');

    if(elAlunos) elAlunos.textContent = alunos.length;
    if(elLivros) elLivros.textContent = livros.length;
    if(elEmprestimos) elEmprestimos.textContent = emprestimos.length;
    if(elAtrasos) elAtrasos.textContent = atrasados;
};
/**
 * MÓDULO DASHBOARD
 */
import { get } from './storage.js';

export const initDashboard = () => {
    renderView();
    updateDashboard();
};

const renderView = () => {
    const container = document.getElementById('view-dashboard');
    container.innerHTML = `
        <h2 class="text-2xl sm:text-3xl font-bold text-white mb-6 tracking-tight">Visão Geral</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div class="glass p-6 rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-colors">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-slate-400 text-sm font-medium mb-1">Alunos Cadastrados</p>
                        <h3 class="text-3xl font-bold text-white" id="dash-total-alunos">0</h3>
                    </div>
                    <div class="p-3 bg-emerald-500/20 rounded-lg text-emerald-400"><i class="fa-solid fa-user-graduate"></i></div>
                </div>
            </div>
            <div class="glass p-6 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-colors">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-slate-400 text-sm font-medium mb-1">Empréstimos Ativos</p>
                        <h3 class="text-3xl font-bold text-white" id="dash-total-emprestimos">0</h3>
                    </div>
                    <div class="p-3 bg-purple-500/20 rounded-lg text-purple-400"><i class="fa-solid fa-hand-holding-hand"></i></div>
                </div>
            </div>
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

        <div class="glass p-6 rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden">
            <h3 class="text-lg font-bold text-white mb-4"><i class="fa-solid fa-bell text-amber-400 mr-2"></i>Alertas de Empréstimos</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-slate-300 whitespace-nowrap min-w-[600px]">
                    <thead class="bg-slate-800/80 text-slate-400">
                        <tr>
                            <th class="p-4 font-medium rounded-tl-lg">Status</th>
                            <th class="p-4 font-medium">Aluno / Matrícula</th>
                            <th class="p-4 font-medium">Data Empréstimo</th>
                            <th class="p-4 font-medium">Vencimento</th>
                            <th class="p-4 font-medium rounded-tr-lg">Atraso</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-alertas" class="divide-y divide-slate-700/50">
                        <!-- Renderizado via JS -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

export const updateDashboard = () => {
    const alunos = get('alunos').filter(a => a.ativo);
    const emprestimos = get('emprestimos').filter(e => e.ativo && !e.devolvido);
    
    // Cálculo rigoroso de datas (Zera horas para comparar apenas os dias)
    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    let countAtrasos = 0;
    const alertas = emprestimos.map(emp => {
        const dataVenc = new Date(emp.dataDevolucaoPrevista);
        dataVenc.setHours(0,0,0,0);
        
        const diffTempo = hoje.getTime() - dataVenc.getTime();
        const diffDias = Math.ceil(diffTempo / (1000 * 3600 * 24));
        
        let statusConfig = { cor: 'bg-emerald-500/20 text-emerald-400', icone: 'fa-check', texto: 'No Prazo', prioridade: 3 };
        
        if (diffDias === 0) {
            statusConfig = { cor: 'bg-yellow-500/20 text-yellow-400', icone: 'fa-circle-exclamation', texto: 'Vence Hoje', prioridade: 1 };
        } else if (diffDias === -1) {
            statusConfig = { cor: 'bg-orange-500/20 text-orange-400', icone: 'fa-clock', texto: 'Vence Amanhã', prioridade: 2 };
        } else if (diffDias > 0) {
            statusConfig = { cor: 'bg-red-500/20 text-red-400', icone: 'fa-triangle-exclamation', texto: 'Atrasado', prioridade: 0 };
            countAtrasos++;
        }

        return { ...emp, diffDias, statusConfig };
    }).sort((a, b) => a.statusConfig.prioridade - b.statusConfig.prioridade);

    document.getElementById('dash-total-alunos').textContent = alunos.length;
    document.getElementById('dash-total-emprestimos').textContent = emprestimos.length;
    document.getElementById('dash-total-atrasos').textContent = countAtrasos;

    const tbody = document.getElementById('tbody-alertas');
    if (alertas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-500">Nenhum alerta no momento.</td></tr>`;
        return;
    }

    tbody.innerHTML = alertas.map(al => `
        <tr class="hover:bg-slate-800/40 transition-colors cursor-pointer" onclick="document.querySelector('[data-target=\\'alunos\\']').click();">
            <td class="p-4">
                <span class="${al.statusConfig.cor} px-3 py-1 rounded-full text-xs font-semibold flex items-center w-max">
                    <i class="fa-solid ${al.statusConfig.icone} mr-2"></i> ${al.statusConfig.texto}
                </span>
            </td>
            <td class="p-4 text-white font-medium">${al.nomeAluno} <span class="block text-xs text-slate-400">${al.matricula} - ${al.turma}</span></td>
            <td class="p-4">${al.dataEmprestimo}</td>
            <td class="p-4">${al.dataDevolucaoPrevista}</td>
            <td class="p-4 ${al.diffDias > 0 ? 'text-red-400 font-bold' : 'text-slate-500'}">${al.diffDias > 0 ? al.diffDias + ' dias' : '-'}</td>
        </tr>
    `).join('');
};

/**
 * MÓDULO ALUNOS (Com Abas, Histórico e Paginação Simples)
 */
import { get, add, update, softDelete } from './storage.js';
import { showAlert, formatPhone } from './utils.js';
import { registerAction } from './historico.js';
import { initCamera, desligarCamera } from './camera.js';
import { updateDashboard } from './dashboard.js';

let alunosGlobais = [];

export const initAlunos = () => {
    renderEstrutura();
    setupAbas();
    setupFormEvents();
    carregarAlunos();
};

const renderEstrutura = () => {
    const area = document.getElementById('alunos-content-area');
    area.innerHTML = `
        <!-- SECÃO LISTA -->
        <div id="secao-lista" class="glass p-4 sm:p-6 rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden transition-opacity duration-300">
            <div class="relative w-full sm:w-72 mb-4">
                <i class="fa-solid fa-search absolute left-3 top-2.5 text-slate-500"></i>
                <input type="text" id="search-aluno" placeholder="Pesquisar..." class="w-full bg-[#0F172A] border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white focus:border-blue-500 text-sm">
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-slate-300 whitespace-nowrap">
                    <thead class="bg-slate-800/80 text-slate-400">
                        <tr>
                            <th class="p-4 font-medium rounded-tl-lg">Foto</th>
                            <th class="p-4 font-medium cursor-pointer hover:text-white" id="sort-nome">Nome <i class="fa-solid fa-sort text-xs"></i></th>
                            <th class="p-4 font-medium cursor-pointer hover:text-white" id="sort-mat">Matrícula <i class="fa-solid fa-sort text-xs"></i></th>
                            <th class="p-4 font-medium">Turma</th>
                            <th class="p-4 font-medium rounded-tr-lg text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-alunos" class="divide-y divide-slate-700/50"></tbody>
                </table>
            </div>
        </div>

        <!-- SEÇÃO FORMULÁRIO -->
        <div id="secao-form" class="glass p-4 sm:p-6 rounded-2xl border border-slate-700/50 shadow-lg hidden transition-opacity duration-300">
            <form id="form-aluno" class="space-y-6">
                <input type="hidden" id="aluno-id">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="sm:col-span-2">
                            <label class="block text-sm text-slate-300 mb-1">Nome Completo *</label>
                            <input type="text" id="aluno-nome" required class="w-full bg-[#0F172A] border border-slate-600 rounded-lg p-2.5 text-white">
                        </div>
                        <div>
                            <label class="block text-sm text-slate-300 mb-1">Matrícula *</label>
                            <input type="text" id="aluno-matricula" required class="w-full bg-[#0F172A] border border-slate-600 rounded-lg p-2.5 text-white">
                        </div>
                        <div>
                            <label class="block text-sm text-slate-300 mb-1">Telefone</label>
                            <input type="text" id="aluno-telefone" class="w-full bg-[#0F172A] border border-slate-600 rounded-lg p-2.5 text-white">
                        </div>
                        <div>
                            <label class="block text-sm text-slate-300 mb-1">Turma *</label>
                            <input type="text" id="aluno-turma" required class="w-full bg-[#0F172A] border border-slate-600 rounded-lg p-2.5 text-white">
                        </div>
                        <div>
                            <label class="block text-sm text-slate-300 mb-1">Turno *</label>
                            <select id="aluno-turno" required class="w-full bg-[#0F172A] border border-slate-600 rounded-lg p-2.5 text-white">
                                <option value="Manhã">Manhã</option><option value="Tarde">Tarde</option><option value="Noite">Noite</option>
                            </select>
                        </div>
                        <div class="sm:col-span-2">
                            <label class="block text-sm text-slate-300 mb-1">Observações</label>
                            <textarea id="aluno-obs" rows="2" class="w-full bg-[#0F172A] border border-slate-600 rounded-lg p-2.5 text-white"></textarea>
                        </div>
                    </div>
                    
                    <div class="flex flex-col items-center bg-[#0F172A]/50 p-4 rounded-xl border border-slate-700/50">
                        <label class="block text-sm text-slate-300 mb-3">Foto Original</label>
                        <div class="relative w-48 h-48 bg-black rounded-xl overflow-hidden border border-slate-600 flex items-center justify-center mb-4">
                            <i id="cam-placeholder" class="fa-solid fa-user-astronaut text-5xl text-slate-600 absolute"></i>
                            <video id="cam-video" class="w-full h-full object-cover hidden" autoplay playsinline></video>
                            <canvas id="cam-canvas" class="hidden"></canvas>
                            <img id="cam-preview" class="w-full h-full object-cover hidden">
                        </div>
                        <input type="hidden" id="aluno-foto">
                        <div class="flex flex-col w-full gap-2">
                            <button type="button" id="cam-start" class="bg-slate-700 text-white px-4 py-2 rounded text-sm"><i class="fa-solid fa-camera mr-2"></i>Ligar</button>
                            <button type="button" id="cam-swap" class="bg-indigo-600 text-white px-4 py-2 rounded text-sm hidden"><i class="fa-solid fa-camera-rotate mr-2"></i>Trocar Câmera</button>
                            <button type="button" id="cam-capture" class="bg-emerald-600 text-white px-4 py-2 rounded text-sm hidden">Capturar</button>
                            <button type="button" id="cam-cancel" class="bg-red-600/80 text-white px-4 py-2 rounded text-sm hidden">Cancelar</button>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end pt-4 border-t border-slate-700/50">
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-lg">Salvar Aluno</button>
                </div>
            </form>
        </div>
    `;
};

const setupAbas = () => {
    const btnLista = document.getElementById('tab-btn-lista');
    const btnNovo = document.getElementById('tab-btn-novo');
    const secaoLista = document.getElementById('secao-lista');
    const secaoForm = document.getElementById('secao-form');

    const switchTab = (showLista) => {
        if (showLista) {
            btnLista.classList.replace('text-slate-400', 'text-white');
            btnLista.classList.replace('hover:text-white', 'bg-blue-600');
            btnLista.classList.add('shadow');
            
            btnNovo.classList.replace('text-white', 'text-slate-400');
            btnNovo.classList.replace('bg-blue-600', 'hover:text-white');
            btnNovo.classList.remove('shadow');

            secaoForm.classList.add('hidden');
            secaoLista.classList.remove('hidden');
            desligarCamera();
        } else {
            btnNovo.classList.replace('text-slate-400', 'text-white');
            btnNovo.classList.replace('hover:text-white', 'bg-blue-600');
            btnNovo.classList.add('shadow');
            
            btnLista.classList.replace('text-white', 'text-slate-400');
            btnLista.classList.replace('bg-blue-600', 'hover:text-white');
            btnLista.classList.remove('shadow');

            secaoLista.classList.add('hidden');
            secaoForm.classList.remove('hidden');
        }
    };

    btnLista.addEventListener('click', () => switchTab(true));
    btnNovo.addEventListener('click', () => {
        document.getElementById('form-aluno').reset();
        document.getElementById('aluno-id').value = '';
        document.getElementById('cam-preview').classList.add('hidden');
        document.getElementById('aluno-foto').value = '';
        switchTab(false);
    });

    // Torna acessível externamente
    window.switchTabToForm = () => switchTab(false);
    window.switchTabToList = () => switchTab(true);
};

const setupFormEvents = () => {
    initCamera(
        document.getElementById('cam-video'),
        document.getElementById('cam-canvas'),
        document.getElementById('cam-preview'),
        document.getElementById('aluno-foto'),
        document.getElementById('cam-start'),
        document.getElementById('cam-capture'),
        document.getElementById('cam-cancel'),
        document.getElementById('cam-swap')
    );

    document.getElementById('aluno-telefone').addEventListener('input', e => {
        e.target.value = formatPhone(e.target.value);
    });

    document.getElementById('search-aluno').addEventListener('input', e => renderTable(e.target.value));

    document.getElementById('form-aluno').addEventListener('submit', (e) => {
        e.preventDefault();
        const fotoData = document.getElementById('aluno-foto').value;
        if(!fotoData) return showAlert("Por favor, capture a foto original.", "error");

        const id = document.getElementById('aluno-id').value;
        const matricula = document.getElementById('aluno-matricula').value;
        
        if(!id && get('alunos').some(a => a.ativo && a.matricula === matricula)) {
            return showAlert("Esta matrícula já existe.", "error");
        }

        const data = {
            nome: document.getElementById('aluno-nome').value,
            matricula,
            telefone: document.getElementById('aluno-telefone').value,
            turma: document.getElementById('aluno-turma').value,
            turno: document.getElementById('aluno-turno').value,
            obs: document.getElementById('aluno-obs').value,
            foto: fotoData
        };

        if (id) {
            update('alunos', id, data);
            registerAction('Edição', `Aluno ${data.nome} atualizado.`);
            showAlert("Aluno atualizado!");
        } else {
            add('alunos', data);
            registerAction('Cadastro', `Novo aluno: ${data.nome}.`);
            showAlert("Aluno cadastrado!");
        }

        carregarAlunos();
        updateDashboard();
        window.switchTabToList();
    });
};

const carregarAlunos = () => {
    alunosGlobais = get('alunos').filter(a => a.ativo).reverse();
    renderTable();
};

const renderTable = (filtro = '') => {
    const tbody = document.getElementById('tbody-alunos');
    const filtrados = alunosGlobais.filter(a => 
        a.nome.toLowerCase().includes(filtro.toLowerCase()) || 
        a.matricula.includes(filtro)
    );

    if(filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-500">Nenhum aluno.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtrados.map(aluno => `
        <tr class="hover:bg-slate-800/40 transition-colors">
            <td class="p-4"><img src="${aluno.foto}" class="w-10 h-10 rounded object-cover shadow border border-slate-600"></td>
            <td class="p-4 text-white">${aluno.nome}</td>
            <td class="p-4">${aluno.matricula}</td>
            <td class="p-4"><span class="bg-slate-700 px-2 py-1 rounded text-xs">${aluno.turma}</span></td>
            <td class="p-4 text-center">
                <button onclick="window.historicoAluno('${aluno.id}')" class="text-emerald-400 hover:text-emerald-300 mx-2" title="Histórico"><i class="fa-solid fa-clock-rotate-left"></i></button>
                <button onclick="window.editarAluno('${aluno.id}')" class="text-blue-400 hover:text-blue-300 mx-2" title="Editar"><i class="fa-solid fa-pen"></i></button>
                <button onclick="window.excluirAluno('${aluno.id}','${aluno.nome}')" class="text-red-400 hover:text-red-300 mx-2" title="Excluir"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
};

// Funções Globais Injetadas
window.editarAluno = (id) => {
    const aluno = alunosGlobais.find(a => a.id === id);
    if(aluno) {
        document.getElementById('aluno-id').value = aluno.id;
        document.getElementById('aluno-nome').value = aluno.nome;
        document.getElementById('aluno-matricula').value = aluno.matricula;
        document.getElementById('aluno-telefone').value = aluno.telefone;
        document.getElementById('aluno-turma').value = aluno.turma;
        document.getElementById('aluno-turno').value = aluno.turno;
        document.getElementById('aluno-obs').value = aluno.obs;
        document.getElementById('cam-preview').src = aluno.foto;
        document.getElementById('cam-preview').classList.remove('hidden');
        document.getElementById('aluno-foto').value = aluno.foto;
        window.switchTabToForm();
    }
};

window.excluirAluno = (id, nome) => {
    if(confirm(`Excluir o aluno ${nome}?`)) {
        softDelete('alunos', id);
        carregarAlunos();
        updateDashboard();
        showAlert("Excluído com sucesso.");
    }
};

window.historicoAluno = (id) => {
    // Espaço reservado para o modal de histórico exigido na Regra 6
    showAlert("O Histórico completo de empréstimos será ativado no módulo de Empréstimos.", "success");
};

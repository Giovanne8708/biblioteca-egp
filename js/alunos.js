/**
 * MÓDULO ALUNOS
 * Responsabilidade: CRUD de Alunos, integração com Câmera e Tabela de Listagem.
 */
import { get, add, update, softDelete } from './storage.js';
import { generateId, showAlert, formatPhone } from './utils.js';
import { registerAction } from './historico.js';
import { initCamera, desligarCamera } from './camera.js';
import { updateDashboard } from './dashboard.js';

export const initAlunos = () => {
    renderView();
    setupEvents();
    renderTable();
};

const renderView = () => {
    const container = document.getElementById('view-alunos');
    container.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-3xl font-bold text-white tracking-tight">Gestão de Alunos</h2>
            <button id="btn-novo-aluno" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/30">
                <i class="fa-solid fa-plus mr-2"></i> Novo Aluno
            </button>
        </div>

        <!-- Formulário Oculto por padrão -->
        <div id="form-container-aluno" class="glass p-6 rounded-2xl border border-slate-700/50 shadow-lg mb-8 hidden transition-all">
            <h3 class="text-xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2" id="form-title-aluno">Cadastrar Aluno</h3>
            
            <form id="form-aluno" class="space-y-6">
                <input type="hidden" id="aluno-id">
                
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Coluna 1 e 2: Dados do Aluno -->
                    <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label class="block text-sm text-slate-300 mb-1">Nome Completo *</label>
                            <input type="text" id="aluno-nome" required class="w-full bg-[#0F172A] border border-slate-600 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-sm text-slate-300 mb-1">Matrícula *</label>
                            <input type="text" id="aluno-matricula" required class="w-full bg-[#0F172A] border border-slate-600 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-sm text-slate-300 mb-1">Telefone</label>
                            <input type="text" id="aluno-telefone" placeholder="(00) 00000-0000" class="w-full bg-[#0F172A] border border-slate-600 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-sm text-slate-300 mb-1">Turma *</label>
                            <input type="text" id="aluno-turma" required class="w-full bg-[#0F172A] border border-slate-600 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-sm text-slate-300 mb-1">Turno *</label>
                            <select id="aluno-turno" required class="w-full bg-[#0F172A] border border-slate-600 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none">
                                <option value="">Selecione...</option>
                                <option value="Manhã">Manhã</option>
                                <option value="Tarde">Tarde</option>
                                <option value="Noite">Noite</option>
                            </select>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm text-slate-300 mb-1">Observações</label>
                            <textarea id="aluno-obs" rows="2" class="w-full bg-[#0F172A] border border-slate-600 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"></textarea>
                        </div>
                    </div>

                    <!-- Coluna 3: Câmera -->
                    <div class="flex flex-col items-center justify-start bg-[#0F172A]/50 p-4 rounded-xl border border-slate-700/50">
                        <label class="block text-sm text-slate-300 mb-3 w-full text-center font-medium">Foto do Aluno</label>
                        
                        <div class="relative w-48 h-48 bg-black rounded-xl overflow-hidden border border-slate-600 shadow-inner mb-4 flex items-center justify-center">
                            <i id="cam-placeholder" class="fa-solid fa-user-astronaut text-5xl text-slate-600 absolute"></i>
                            <video id="cam-video" class="w-full h-full object-cover hidden" autoplay playsinline></video>
                            <canvas id="cam-canvas" class="hidden"></canvas>
                            <img id="cam-preview" class="w-full h-full object-cover hidden">
                        </div>
                        
                        <input type="hidden" id="aluno-foto">
                        
                        <div class="flex flex-col w-full gap-2">
                            <button type="button" id="cam-start" class="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                                <i class="fa-solid fa-camera mr-2"></i>Ligar Câmera
                            </button>
                            <button type="button" id="cam-capture" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors text-sm hidden">
                                <i class="fa-solid fa-image mr-2"></i>Capturar
                            </button>
                            <button type="button" id="cam-cancel" class="w-full bg-red-600/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors text-sm hidden">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
                    <button type="button" id="btn-cancelar-aluno" class="px-5 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Cancelar</button>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-500/30">Salvar Aluno</button>
                </div>
            </form>
        </div>

        <!-- Tabela de Alunos -->
        <div class="glass p-6 rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden">
            <div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h3 class="text-lg font-bold text-white">Alunos Cadastrados</h3>
                <div class="relative w-full md:w-64">
                    <i class="fa-solid fa-search absolute left-3 top-2.5 text-slate-500"></i>
                    <input type="text" id="search-aluno" placeholder="Pesquisar por nome ou matrícula..." class="w-full bg-[#0F172A] border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white focus:border-blue-500 focus:outline-none text-sm">
                </div>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-slate-300 whitespace-nowrap">
                    <thead class="bg-slate-800/80 text-slate-400">
                        <tr>
                            <th class="p-4 rounded-tl-lg font-medium">Foto</th>
                            <th class="p-4 font-medium">Nome</th>
                            <th class="p-4 font-medium">Matrícula</th>
                            <th class="p-4 font-medium">Turma</th>
                            <th class="p-4 rounded-tr-lg font-medium text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-alunos" class="divide-y divide-slate-700/50">
                        <!-- Renderizado via JS -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

const setupEvents = () => {
    const formContainer = document.getElementById('form-container-aluno');
    const form = document.getElementById('form-aluno');
    const btnNovo = document.getElementById('btn-novo-aluno');
    const btnCancelar = document.getElementById('btn-cancelar-aluno');
    const searchInput = document.getElementById('search-aluno');
    const inputTelefone = document.getElementById('aluno-telefone');

    // Inicializa a Câmera
    initCamera(
        document.getElementById('cam-video'),
        document.getElementById('cam-canvas'),
        document.getElementById('cam-preview'),
        document.getElementById('aluno-foto'),
        document.getElementById('cam-start'),
        document.getElementById('cam-capture'),
        document.getElementById('cam-cancel')
    );

    // Máscara de Telefone ao digitar
    inputTelefone.addEventListener('input', (e) => {
        e.target.value = formatPhone(e.target.value);
    });

    // Abrir formulário vazio
    btnNovo.addEventListener('click', () => {
        form.reset();
        document.getElementById('aluno-id').value = '';
        document.getElementById('cam-preview').classList.add('hidden');
        document.getElementById('aluno-foto').value = '';
        document.getElementById('form-title-aluno').textContent = 'Cadastrar Novo Aluno';
        formContainer.classList.remove('hidden');
    });

    // Fechar formulário
    btnCancelar.addEventListener('click', () => {
        formContainer.classList.add('hidden');
        desligarCamera();
    });

    // Pesquisa
    searchInput.addEventListener('input', (e) => renderTable(e.target.value));

    // Salvar Aluno
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const fotoData = document.getElementById('aluno-foto').value;
        if(!fotoData) {
            showAlert("Por favor, capture a foto do aluno.", "error");
            return;
        }

        const id = document.getElementById('aluno-id').value;
        const matricula = document.getElementById('aluno-matricula').value;
        
        // Verificação de Matrícula Duplicada
        const alunosExistentes = get('alunos').filter(a => a.ativo && a.id !== id);
        if(alunosExistentes.some(a => a.matricula === matricula)) {
            showAlert("Esta matrícula já está cadastrada no sistema.", "error");
            return;
        }

        const alunoData = {
            nome: document.getElementById('aluno-nome').value,
            matricula: matricula,
            telefone: document.getElementById('aluno-telefone').value,
            turma: document.getElementById('aluno-turma').value,
            turno: document.getElementById('aluno-turno').value,
            obs: document.getElementById('aluno-obs').value,
            foto: fotoData
        };

        if (id) {
            update('alunos', id, alunoData);
            registerAction('Edição', `Dados do aluno ${alunoData.nome} atualizados.`);
            showAlert("Aluno atualizado com sucesso!");
        } else {
            add('alunos', alunoData);
            registerAction('Cadastro', `Novo aluno cadastrado: ${alunoData.nome}.`);
            showAlert("Aluno cadastrado com sucesso!");
        }

        form.reset();
        formContainer.classList.add('hidden');
        renderTable();
        updateDashboard(); // Atualiza o painel inicial instantaneamente!
    });
};

const renderTable = (filtro = '') => {
    const alunos = get('alunos').filter(a => a.ativo);
    const tbody = document.getElementById('tbody-alunos');
    tbody.innerHTML = '';

    const filtrados = alunos.filter(a => 
        a.nome.toLowerCase().includes(filtro.toLowerCase()) || 
        a.matricula.includes(filtro)
    );

    if(filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-500">Nenhum aluno encontrado.</td></tr>`;
        return;
    }

    filtrados.reverse().forEach(aluno => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-800/40 transition-colors";
        tr.innerHTML = `
            <td class="p-4">
                <img src="${aluno.foto}" class="w-12 h-12 rounded-lg object-cover border border-slate-600 shadow">
            </td>
            <td class="p-4 font-medium text-white">${aluno.nome}</td>
            <td class="p-4 text-slate-300">${aluno.matricula}</td>
            <td class="p-4 text-slate-300"><span class="bg-slate-700 px-2 py-1 rounded text-xs">${aluno.turma} (${aluno.turno})</span></td>
            <td class="p-4 text-center">
                <button class="btn-editar text-blue-400 hover:text-blue-300 mx-2 transition-colors" data-id="${aluno.id}" title="Editar">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-excluir text-red-400 hover:text-red-300 mx-2 transition-colors" data-id="${aluno.id}" data-nome="${aluno.nome}" title="Excluir">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Adiciona eventos aos botões recém-criados
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', (e) => editarAluno(e.currentTarget.dataset.id));
    });

    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnTarget = e.currentTarget;
            if(confirm(`ATENÇÃO: Deseja realmente excluir o(a) aluno(a) ${btnTarget.dataset.nome}?`)) {
                softDelete('alunos', btnTarget.dataset.id);
                registerAction('Exclusão', `Aluno ${btnTarget.dataset.nome} removido do sistema.`);
                showAlert("Aluno removido com sucesso.");
                renderTable();
                updateDashboard();
            }
        });
    });
};

const editarAluno = (id) => {
    const aluno = get('alunos').find(a => a.id === id);
    if(aluno) {
        document.getElementById('aluno-id').value = aluno.id;
        document.getElementById('aluno-nome').value = aluno.nome;
        document.getElementById('aluno-matricula').value = aluno.matricula;
        document.getElementById('aluno-telefone').value = aluno.telefone;
        document.getElementById('aluno-turma').value = aluno.turma;
        document.getElementById('aluno-turno').value = aluno.turno;
        document.getElementById('aluno-obs').value = aluno.obs || '';
        
        document.getElementById('cam-preview').src = aluno.foto;
        document.getElementById('cam-preview').classList.remove('hidden');
        document.getElementById('aluno-foto').value = aluno.foto;
        
        document.getElementById('form-title-aluno').textContent = 'Editar Aluno';
        document.getElementById('form-container-aluno').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};
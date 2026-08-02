import { salvarAluno, getAlunos, excluirAluno } from './storage.js';

export function initAlunos() {
    setupCameraEUpload();

    const form = document.getElementById('cadastro-aluno-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const novoAluno = {
                id: Date.now().toString(),
                matricula: document.getElementById('aluno-matricula').value.trim(),
                nome: document.getElementById('aluno-nome').value.trim(),
                turma: document.getElementById('aluno-turma').value.trim(),
                turno: document.getElementById('aluno-turno').value,
                foto: document.getElementById('aluno-foto-base64').value // Pega a foto gerada (câmera ou upload)
            };

            salvarAluno(novoAluno);
            form.reset();
            document.getElementById('btn-remover-foto').click(); // Limpa a foto do preview
            
            alert('Aluno salvo com sucesso!');
            
            const btnLista = document.querySelector('[data-tab="lista-alunos"]');
            if(btnLista) btnLista.click();
            
            renderTabelaAlunos();
            if(window.atualizarDashboard) window.atualizarDashboard();
        });
    }

    window.deletarAluno = (id) => {
        if(confirm('Tem certeza que deseja excluir este aluno?')) {
            excluirAluno(id.toString());
            renderTabelaAlunos();
            if(window.atualizarDashboard) window.atualizarDashboard();
        }
    };

    renderTabelaAlunos();
}

// =====================================
// LÓGICA DE FOTO (CÂMERA NATIVA + UPLOAD)
// =====================================
function setupCameraEUpload() {
    const inputUpload = document.getElementById('aluno-foto-upload');
    const inputBase64 = document.getElementById('aluno-foto-base64');
    const previewContainer = document.getElementById('foto-preview-container');
    const previewImg = document.getElementById('foto-preview-img');
    const btnRemover = document.getElementById('btn-remover-foto');
    
    const btnLigarCamera = document.getElementById('btn-ligar-camera');
    const cameraContainer = document.getElementById('camera-container');
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const btnCapturar = document.getElementById('btn-capturar-foto');
    const btnFecharCamera = document.getElementById('btn-fechar-camera');
    let streamCamera = null;

    // 1. Upload Tradicional (Arquivo)
    if(inputUpload) {
        inputUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (evento) => {
                    inputBase64.value = evento.target.result;
                    previewImg.src = evento.target.result;
                    previewContainer.classList.remove('hidden');
                    previewContainer.classList.add('flex');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 2. Abrir a Câmera
    if(btnLigarCamera) {
        btnLigarCamera.addEventListener('click', async () => {
            try {
                // Pede a câmera traseira primeiro (se celular), se não, vai a frontal/webcam
                streamCamera = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                video.srcObject = streamCamera;
                cameraContainer.classList.remove('hidden');
                cameraContainer.classList.add('flex');
            } catch (err) {
                alert('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
            }
        });
    }

    // 3. Capturar a Foto
    if(btnCapturar) {
        btnCapturar.addEventListener('click', () => {
            if(!streamCamera) return;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Pega a foto sem alterar e joga no form
            const fotoData = canvas.toDataURL('image/jpeg', 0.9);
            inputBase64.value = fotoData;
            previewImg.src = fotoData;
            previewContainer.classList.remove('hidden');
            previewContainer.classList.add('flex');
            
            fecharCamera();
        });
    }

    // 4. Fechar Câmera sem tirar foto
    if(btnFecharCamera) btnFecharCamera.addEventListener('click', fecharCamera);

    // 5. Remover Foto Escolhida/Tirada
    if(btnRemover) {
        btnRemover.addEventListener('click', () => {
            inputBase64.value = '';
            previewImg.src = '';
            previewContainer.classList.add('hidden');
            previewContainer.classList.remove('flex');
            inputUpload.value = ''; 
        });
    }

    function fecharCamera() {
        if(streamCamera) {
            streamCamera.getTracks().forEach(track => track.stop());
            streamCamera = null;
        }
        cameraContainer.classList.add('hidden');
        cameraContainer.classList.remove('flex');
    }
}

export function renderTabelaAlunos() {
    const tbody = document.getElementById('tabela-alunos');
    if (!tbody) return;

    const alunos = getAlunos();
    tbody.innerHTML = '';

    if (alunos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-500">Nenhum aluno cadastrado.</td></tr>`;
        return;
    }

    alunos.forEach(aluno => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-700/50 text-slate-300';
        
        const imgHtml = aluno.foto 
            ? `<img src="${aluno.foto}" alt="Foto" class="w-12 h-12 object-cover bg-black/20 rounded-lg">`
            : `<div class="w-12 h-12 flex items-center justify-center bg-slate-800 rounded-lg text-slate-500"><i class="fa-solid fa-user"></i></div>`;

        tr.innerHTML = `
            <td class="py-4">${imgHtml}</td>
            <td class="py-4 font-medium text-white">${aluno.matricula}</td>
            <td class="py-4">${aluno.nome}</td>
            <td class="py-4">${aluno.turma} - ${aluno.turno}</td>
            <td class="py-4 text-right">
                <button onclick="deletarAluno('${aluno.id}')" class="text-red-400 hover:text-red-300 p-2"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

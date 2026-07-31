// ==========================================
// MÓDULO DE CÂMERA - V1.1 (Com inversão Mobile)
// ==========================================

export function initCamera() {
    const video = document.getElementById('camera-preview');
    const canvas = document.getElementById('canvas-foto');
    const fotoPreview = document.getElementById('foto-preview');
    const placeholder = document.getElementById('camera-placeholder');
    
    const btnIniciar = document.getElementById('btn-iniciar-camera');
    const btnCapturar = document.getElementById('btn-capturar-foto');
    const btnRemover = document.getElementById('btn-remover-foto');
    const btnSwitch = document.getElementById('btn-switch-camera'); // NOVO: Botão de girar
    
    let stream = null;
    let cameraAtual = 'environment'; // Começa com a traseira (ou 'user' para frontal)

    if (!btnIniciar) return;

    // Função interna para ligar a câmera escolhida
    const iniciarCamera = async (modo) => {
        // Se já tiver uma câmera ligada, desliga antes de trocar
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: modo } });
            video.srcObject = stream;
            
            video.classList.remove('hidden');
            placeholder.classList.add('hidden');
            fotoPreview.classList.add('hidden');
            
            btnIniciar.classList.add('hidden');
            btnCapturar.classList.remove('hidden');
            btnRemover.classList.add('hidden');
            btnSwitch.classList.remove('hidden'); // Mostra o botão de girar
        } catch (err) {
            alert('Erro ao acessar a câmera. Verifique as permissões.');
            console.error(err);
        }
    };

    // LIGAR A CÂMERA
    btnIniciar.addEventListener('click', () => {
        iniciarCamera(cameraAtual);
    });

    // GIRAR A CÂMERA (FRONTAL/TRASEIRA)
    btnSwitch.addEventListener('click', () => {
        cameraAtual = cameraAtual === 'environment' ? 'user' : 'environment';
        iniciarCamera(cameraAtual);
    });

    // TIRAR A FOTO
    btnCapturar.addEventListener('click', () => {
        if (!stream) return;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const fotoData = canvas.toDataURL('image/jpeg');
        fotoPreview.src = fotoData;
        
        video.classList.add('hidden');
        fotoPreview.classList.remove('hidden');
        
        btnCapturar.classList.add('hidden');
        btnSwitch.classList.add('hidden'); // Esconde o botão de girar ao tirar a foto
        btnRemover.classList.remove('hidden');
        
        stream.getTracks().forEach(track => track.stop());
    });

    // REMOVER A FOTO
    btnRemover.addEventListener('click', () => {
        fotoPreview.src = ''; 
        fotoPreview.classList.add('hidden');
        placeholder.classList.remove('hidden');
        
        btnRemover.classList.add('hidden');
        btnIniciar.classList.remove('hidden');
    });
}

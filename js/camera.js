// ==========================================
// MÓDULO DE CÂMERA - CAPTURA DE FOTOS
// ==========================================

export function initCamera() {
    const video = document.getElementById('camera-preview');
    const canvas = document.getElementById('canvas-foto');
    const fotoPreview = document.getElementById('foto-preview');
    const placeholder = document.getElementById('camera-placeholder');
    
    const btnIniciar = document.getElementById('btn-iniciar-camera');
    const btnCapturar = document.getElementById('btn-capturar-foto');
    const btnRemover = document.getElementById('btn-remover-foto');
    
    let stream = null;

    if (!btnIniciar) return;

    // LIGAR A CÂMERA
    btnIniciar.addEventListener('click', async () => {
        try {
            // Pede permissão ao navegador e liga o vídeo
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            video.srcObject = stream;
            
            // Ajusta o visual (mostra vídeo, esconde ícone cinza)
            video.classList.remove('hidden');
            placeholder.classList.add('hidden');
            fotoPreview.classList.add('hidden');
            
            // Troca os botões
            btnIniciar.classList.add('hidden');
            btnCapturar.classList.remove('hidden');
            btnRemover.classList.add('hidden');
        } catch (err) {
            alert('Erro ao acessar a câmera. Verifique se o navegador tem permissão.');
            console.error(err);
        }
    });

    // TIRAR A FOTO
    btnCapturar.addEventListener('click', () => {
        if (!stream) return;
        
        // Desenha o quadro atual do vídeo no canvas invisível
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Transforma o canvas em uma imagem real (Base64)
        const fotoData = canvas.toDataURL('image/jpeg');
        fotoPreview.src = fotoData;
        
        // Ajusta o visual (mostra a foto tirada, esconde o vídeo rodando)
        video.classList.add('hidden');
        fotoPreview.classList.remove('hidden');
        
        // Troca os botões
        btnCapturar.classList.add('hidden');
        btnRemover.classList.remove('hidden');
        
        // Desliga a luz da câmera para economizar bateria e memória
        stream.getTracks().forEach(track => track.stop());
    });

    // REMOVER A FOTO
    btnRemover.addEventListener('click', () => {
        fotoPreview.src = ''; // Apaga a imagem
        
        // Volta para o estado inicial (quadrado cinza)
        fotoPreview.classList.add('hidden');
        placeholder.classList.remove('hidden');
        
        // Troca os botões
        btnRemover.classList.add('hidden');
        btnIniciar.classList.remove('hidden');
    });
}

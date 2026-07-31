/**
 * MÓDULO DE CÂMERA (WebRTC)
 * Responsabilidade Única: Gerenciar hardware de vídeo e capturar frames originais.
 */
import { showAlert } from './utils.js';

let streamCamera = null;

export const initCamera = (videoElement, canvasElement, previewElement, inputHidden, btnStart, btnCapture, btnCancel) => {
    
    // Ligar a Câmera
    btnStart.addEventListener('click', async () => {
        try {
            // Solicita a câmera (prioriza a frontal se estiver no celular)
            streamCamera = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, 
                audio: false 
            });
            
            videoElement.srcObject = streamCamera;
            videoElement.classList.remove('hidden');
            previewElement.classList.add('hidden');
            
            btnStart.classList.add('hidden');
            btnCapture.classList.remove('hidden');
            btnCancel.classList.remove('hidden');
        } catch (erro) {
            console.error(erro);
            showAlert("Erro ao acessar a câmera. Verifique as permissões.", "error");
        }
    });

    // Capturar Foto (Extração Original)
    btnCapture.addEventListener('click', () => {
        if (!streamCamera) return;

        // O Canvas assume a resolução nativa do vídeo para não distorcer
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        
        const context = canvasElement.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        
        // Gera a imagem em base64 (sem perdas de png)
        const fotoOriginal = canvasElement.toDataURL('image/png');
        
        // Atualiza a interface
        previewElement.src = fotoOriginal;
        inputHidden.value = fotoOriginal;
        
        videoElement.classList.add('hidden');
        previewElement.classList.remove('hidden');
        
        desligarCamera();
        
        btnCapture.classList.add('hidden');
        btnCancel.classList.add('hidden');
        btnStart.classList.remove('hidden');
        btnStart.innerHTML = '<i class="fa-solid fa-rotate-right mr-2"></i>Refazer Foto';
    });

    // Cancelar/Desligar
    btnCancel.addEventListener('click', () => {
        desligarCamera();
        videoElement.classList.add('hidden');
        previewElement.src = '';
        previewElement.classList.remove('hidden'); // Exibe a área vazia
        inputHidden.value = '';
        
        btnCapture.classList.add('hidden');
        btnCancel.classList.add('hidden');
        btnStart.classList.remove('hidden');
        btnStart.innerHTML = '<i class="fa-solid fa-camera mr-2"></i>Ligar Câmera';
    });
};

export const desligarCamera = () => {
    if (streamCamera) {
        streamCamera.getTracks().forEach(track => track.stop());
        streamCamera = null;
    }
};
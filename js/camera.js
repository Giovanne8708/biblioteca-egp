/**
 * MÓDULO DE CÂMERA (WebRTC Avançado)
 */
import { showAlert } from './utils.js';

let streamCamera = null;
let currentFacingMode = 'user'; // Padrão: Frontal
let hasMultipleCameras = false;

// Verifica quantas lentes de vídeo existem no aparelho
const checkCameras = async (btnTrocar) => {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        if (videoInputs.length > 1) {
            hasMultipleCameras = true;
            btnTrocar.classList.remove('hidden');
        }
    } catch (e) {
        console.error("Erro ao enumerar dispositivos:", e);
    }
};

export const initCamera = (videoElement, canvasElement, previewElement, inputHidden, btnStart, btnCapture, btnCancel, btnTrocar) => {
    
    checkCameras(btnTrocar);

    const ligar = async () => {
        if (streamCamera) desligarCamera();
        try {
            streamCamera = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: currentFacingMode, width: { ideal: 1280 }, height: { ideal: 720 } }, 
                audio: false 
            });
            videoElement.srcObject = streamCamera;
            videoElement.classList.remove('hidden');
            previewElement.classList.add('hidden');
            
            btnStart.classList.add('hidden');
            btnCapture.classList.remove('hidden');
            btnCancel.classList.remove('hidden');
            if(hasMultipleCameras) btnTrocar.classList.remove('hidden');
        } catch (erro) {
            showAlert("Erro ao acessar a câmera.", "error");
        }
    };

    btnStart.addEventListener('click', ligar);

    btnTrocar.addEventListener('click', () => {
        currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
        ligar();
    });

    btnCapture.addEventListener('click', () => {
        if (!streamCamera) return;
        // Mantém a imagem original, sem filtros
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        canvasElement.getContext('2d').drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        
        const fotoOriginal = canvasElement.toDataURL('image/png');
        previewElement.src = fotoOriginal;
        inputHidden.value = fotoOriginal;
        
        videoElement.classList.add('hidden');
        previewElement.classList.remove('hidden');
        desligarCamera();
        
        btnCapture.classList.add('hidden');
        btnTrocar.classList.add('hidden');
        btnStart.classList.remove('hidden');
        btnStart.innerHTML = '<i class="fa-solid fa-rotate-right mr-2"></i>Refazer Foto';
    });

    btnCancel.addEventListener('click', () => {
        desligarCamera();
        videoElement.classList.add('hidden');
        previewElement.src = '';
        previewElement.classList.remove('hidden');
        inputHidden.value = '';
        
        btnCapture.classList.add('hidden');
        btnCancel.classList.add('hidden');
        btnTrocar.classList.add('hidden');
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

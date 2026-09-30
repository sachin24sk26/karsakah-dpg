// DOM Elements
const btnCamera = document.getElementById('btn-camera');
const btnUpload = document.getElementById('btn-upload');
const fileInput = document.getElementById('file-input');
const inputControls = document.getElementById('input-controls');

const cameraContainer = document.getElementById('camera-container');
const videoElement = document.getElementById('videoElement');
const btnCapture = document.getElementById('btn-capture');
const btnCloseCamera = document.getElementById('btn-close-camera');

const previewContainer = document.getElementById('preview-container');
const imagePreview = document.getElementById('imagePreview');
const canvasElement = document.getElementById('canvasElement');
const btnRetake = document.getElementById('btn-retake');
const btnAnalyze = document.getElementById('btn-analyze');

const emptyState = document.getElementById('empty-state');
const resultsCard = document.getElementById('results-card');
const analysisLoader = document.getElementById('analysis-loader');
const analysisResult = document.getElementById('analysis-result');
const analysisError = document.getElementById('analysis-error');

// Variables
let stream = null;
let currentImageBlob = null;

// The URL of our Python Flask backend
const API_URL = "/api/analyze";

// --- Camera Logic ---

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" } // Prefer back camera on mobile
        });
        videoElement.srcObject = stream;

        // UI Handling
        emptyState.classList.add('hidden');
        previewContainer.classList.add('hidden');
        resultsCard.classList.add('hidden');
        cameraContainer.classList.remove('hidden');
        inputControls.classList.add('hidden');
    } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Could not access the camera. Please ensure you have granted permissions.");
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    videoElement.srcObject = null;
    cameraContainer.classList.add('hidden');
    inputControls.classList.remove('hidden');

    if (!currentImageBlob) {
        emptyState.classList.remove('hidden');
    }
}

// --- Client-side Image Compression (2G/3G Low-Bandwidth Optimization) ---

async function compressImageFile(fileOrBlob, maxWidth = 1024, maxHeight = 1024, quality = 0.82) {
    return new Promise((resolve) => {
        const originalSize = fileOrBlob.size;
        const img = new Image();
        const url = URL.createObjectURL(fileOrBlob);

        img.onload = () => {
            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
                if (width > height) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                } else {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = width;
            offscreenCanvas.height = height;
            const ctx = offscreenCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            offscreenCanvas.toBlob((blob) => {
                URL.revokeObjectURL(url);
                const compressedSize = blob ? blob.size : originalSize;
                resolve({
                    blob: blob || fileOrBlob,
                    originalSize: originalSize,
                    compressedSize: compressedSize
                });
            }, 'image/jpeg', quality);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve({ blob: fileOrBlob, originalSize: originalSize, compressedSize: originalSize });
        };

        img.src = url;
    });
}

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

function capturePhoto() {
    // Set canvas dimensions to match video
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    // Draw video frame to canvas
    const ctx = canvasElement.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // Convert to Blob (JPEG)
    canvasElement.toBlob(async (rawBlob) => {
        const comp = await compressImageFile(rawBlob, 1024, 1024, 0.82);
        currentImageBlob = comp.blob;
        const imageUrl = URL.createObjectURL(comp.blob);
        showPreview(imageUrl, comp);
        stopCamera();
    }, 'image/jpeg', 0.9);
}

// --- Upload Logic ---

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const comp = await compressImageFile(file, 1024, 1024, 0.82);
        currentImageBlob = comp.blob;
        const imageUrl = URL.createObjectURL(comp.blob);
        showPreview(imageUrl, comp);
    }
}

// --- Preview & UI Logic ---

function showPreview(imageUrl, compStats = null) {
    imagePreview.src = imageUrl;
    emptyState.classList.add('hidden');
    cameraContainer.classList.add('hidden');
    inputControls.classList.add('hidden');
    resultsCard.classList.add('hidden');
    previewContainer.classList.remove('hidden');

    const badge = document.getElementById('compression-info-badge');
    const badgeText = document.getElementById('compression-info-text');
    if (badge && compStats && compStats.originalSize > 0) {
        const savedPct = Math.max(0, Math.round(((compStats.originalSize - compStats.compressedSize) / compStats.originalSize) * 100));
        badgeText.textContent = `2G/3G Optimized: ${formatBytes(compStats.originalSize)} → ${formatBytes(compStats.compressedSize)} (${savedPct}% bandwidth saved)`;
        badge.style.display = 'block';
    } else if (badge) {
        badge.style.display = 'none';
    }
}

function resetUI() {
    currentImageBlob = null;
    imagePreview.src = "";
    previewContainer.classList.add('hidden');
    resultsCard.classList.add('hidden');
    inputControls.classList.remove('hidden');
    emptyState.classList.remove('hidden');
    fileInput.value = ""; // clear file input
    const badge = document.getElementById('compression-info-badge');
    if (badge) badge.style.display = 'none';
}

// --- API Request Logic (Python/Kaggle Mock Integration) ---

async function analyzeImage() {
    if (!currentImageBlob) return;

    // Show Loader
    resultsCard.classList.remove('hidden');
    analysisLoader.classList.remove('hidden');
    analysisResult.classList.add('hidden');
    analysisError.classList.add('hidden');
    btnAnalyze.disabled = true;

    // Create FormData to send image
    const formData = new FormData();
    formData.append("image", currentImageBlob, "crop_sample.jpg");

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            // Attempt to parse JSON error message from backend
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server returned ${response.status}`);
        }

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error("API Error:", error);
        analysisLoader.classList.add('hidden');
        analysisError.classList.remove('hidden');
        
        // Display custom error message
        const errorMessageEl = document.getElementById('error-message');
        if (errorMessageEl) {
            errorMessageEl.textContent = error.message;
        }
    } finally {
        btnAnalyze.disabled = false;
    }
}

function displayResults(data) {
    analysisLoader.classList.add('hidden');
    analysisError.classList.add('hidden');
    analysisResult.classList.remove('hidden');

    const badge = document.getElementById('disease-badge');
    if (data.status === "Healthy") {
        badge.textContent = "Healthy Crop";
        badge.className = "disease-badge healthy";
    } else {
        badge.textContent = "Pathogen Detected";
        badge.className = "disease-badge";
    }

    document.getElementById('disease-name').textContent = data.disease || "Unknown Disease";
    
    // Support symptoms array or string
    let symptomsText = "No symptoms specific information provided.";
    if (Array.isArray(data.symptoms_observed)) {
        symptomsText = data.symptoms_observed.join('. ');
    } else if (data.symptoms) {
        symptomsText = data.symptoms;
    }
    document.getElementById('symptoms-text').textContent = symptomsText;

    const confidenceScore = document.getElementById('confidence-score');
    const confidenceBar = document.getElementById('confidence-bar');
    confidenceScore.textContent = "0%";
    confidenceBar.style.width = "0%";
    setTimeout(() => {
        let conf = typeof data.confidence === 'number' ? data.confidence : parseFloat(data.confidence) || 0;
        if (conf <= 1.0) conf = conf * 100; // Normalize 0-1 to 0-100%
        confidenceScore.textContent = `${conf.toFixed(1)}%`;
        confidenceBar.style.width = `${Math.min(conf, 100)}%`;
    }, 100);

    // Expert Fallback Notice (<60% confidence gate)
    const existingAlert = document.getElementById('expert-gate-notice');
    if (existingAlert) existingAlert.remove();

    if (data.needs_expert || data.expert_fallback) {
        const noticeDiv = document.createElement('div');
        noticeDiv.id = 'expert-gate-notice';
        noticeDiv.style.cssText = 'background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; color: #92400E; font-size: 13px; display: flex; align-items: flex-start; gap: 10px;';
        noticeDiv.innerHTML = `<i class="ph-bold ph-warning-circle" style="font-size:20px;color:#D97706;flex-shrink:0;margin-top:2px;"></i> <div><strong>Agricultural Extension Caution:</strong> ${data.expert_fallback || 'Diagnosis confidence is below threshold. Please consult your local Krishi Vigyan Kendra (KVK) or extension officer with a physical leaf sample.'}</div>`;
        analysisResult.insertBefore(noticeDiv, analysisResult.firstChild);
    }

    // Helper function to populate lists
    const populateList = (elementId, items) => {
        const listEl = document.getElementById(elementId);
        if (!listEl) return;
        listEl.innerHTML = '';
        if (items && Array.isArray(items) && items.length > 0) {
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                listEl.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = "No specific actions required.";
            li.style.color = "var(--text-gray)";
            listEl.appendChild(li);
        }
    };

    const immediateActs = data.immediate_cultural_action || data.immediate_action || [];
    populateList('immediate-action-list', immediateActs);
    
    const organicTreatments = data.treatment_organic || (data.treatment_options ? data.treatment_options.organic : []);
    const chemicalTreatments = data.treatment_chemical || (data.treatment_options ? data.treatment_options.chemical : []);
    
    populateList('organic-treatment-list', organicTreatments);
    populateList('chemical-treatment-list', chemicalTreatments);

    populateList('prevention-list', data.prevention);
}

// Ensure "Check Another Crop" button is bound
document.getElementById('btn-check-another')?.addEventListener('click', resetUI);


// --- Event Listeners ---
btnCamera.addEventListener('click', startCamera);
btnCloseCamera.addEventListener('click', stopCamera);
btnCapture.addEventListener('click', capturePhoto);

btnUpload.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileUpload);

btnRetake.addEventListener('click', resetUI);
btnAnalyze.addEventListener('click', analyzeImage);

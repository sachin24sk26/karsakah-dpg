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

function capturePhoto() {
    // Set canvas dimensions to match video
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    // Draw video frame to canvas
    const ctx = canvasElement.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // Convert to Blob (JPEG)
    canvasElement.toBlob((blob) => {
        currentImageBlob = blob;
        const imageUrl = URL.createObjectURL(blob);
        showPreview(imageUrl);
        stopCamera();
    }, 'image/jpeg', 0.9);
}

// --- Upload Logic ---

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        currentImageBlob = file;
        const imageUrl = URL.createObjectURL(file);
        showPreview(imageUrl);
    }
}

// --- Preview & UI Logic ---

function showPreview(imageUrl) {
    imagePreview.src = imageUrl;
    emptyState.classList.add('hidden');
    cameraContainer.classList.add('hidden');
    inputControls.classList.add('hidden');
    resultsCard.classList.add('hidden');
    previewContainer.classList.remove('hidden');
}

function resetUI() {
    currentImageBlob = null;
    imagePreview.src = "";
    previewContainer.classList.add('hidden');
    resultsCard.classList.add('hidden');
    inputControls.classList.remove('hidden');
    emptyState.classList.remove('hidden');
    fileInput.value = ""; // clear file input
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

    document.getElementById('disease-name').textContent = data.disease || "Unknown";
    document.getElementById('symptoms-text').textContent = data.symptoms || "No symptoms specific information provided.";

    const confidenceScore = document.getElementById('confidence-score');
    const confidenceBar = document.getElementById('confidence-bar');
    confidenceScore.textContent = "0%";
    confidenceBar.style.width = "0%";
    setTimeout(() => {
        const conf = typeof data.confidence === 'number' ? data.confidence : parseFloat(data.confidence) || 0;
        confidenceScore.textContent = `${conf.toFixed(1)}%`;
        confidenceBar.style.width = `${Math.min(conf, 100)}%`;
    }, 100);

    // Helper function to populate lists
    const populateList = (elementId, items) => {
        const listEl = document.getElementById(elementId);
        listEl.innerHTML = '';
        if (items && Array.isArray(items) && items.length > 0) {
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                listEl.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = "No specific data provided.";
            li.style.color = "var(--text-gray)";
            listEl.appendChild(li);
        }
    };

    populateList('immediate-action-list', data.immediate_action);
    
    if (data.treatment_options) {
        populateList('organic-treatment-list', data.treatment_options.organic);
        populateList('chemical-treatment-list', data.treatment_options.chemical);
    } else {
        populateList('organic-treatment-list', []);
        populateList('chemical-treatment-list', []);
    }

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

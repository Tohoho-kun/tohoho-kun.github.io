/**
 * Weld-Blade: Arc Welding Cross-section Measurement Tool
 * Upgraded with Multi-Image Tabs, Calibration Separation, and Step/Free Modes.
 */

let cvReady = false;

function onOpenCvReady() {
    if (cvReady) return;
    cvReady = true;
    const statusEl = document.getElementById('opencv-status');
    if (statusEl) {
        statusEl.innerHTML = '<i class="fa-solid fa-check-circle"></i> OpenCV.js Ready';
        statusEl.classList.add('status-ready');
    }
}

// Hook for OpenCV.js runtime initialization
window.Module = {
    onRuntimeInitialized: function() {
        onOpenCvReady();
    }
};

// Fallback checking in case OpenCV.js loaded synchronously or before this script ran
if (typeof cv !== 'undefined' && cv.Mat) {
    onOpenCvReady();
}

// Timeout indicator (15 seconds)
setTimeout(() => {
    if (!cvReady) {
        const statusEl = document.getElementById('opencv-status');
        if (statusEl) {
            statusEl.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> OpenCV.js Load Timeout. Please refresh.';
            statusEl.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
            statusEl.style.color = '#ef4444';
        }
    }
}, 15000);

function initWeldTool() {
    try {
    const elements = {
        imageInput: document.getElementById('weld-image-input'),
        calibImageInput: document.getElementById('weld-calib-image-input'),
        tabMeas: document.getElementById('weld-tab-meas'),
        tabCalib: document.getElementById('weld-tab-calib'),
        panelMeas: document.getElementById('weld-panel-meas'),
        panelCalib: document.getElementById('weld-panel-calib'),
        workflowStep: document.getElementById('weld-workflow-step'),
        workflowFree: document.getElementById('weld-workflow-free'),
        freeToolsContainer: document.getElementById('weld-free-tools-container'),
        toolMeasure: document.getElementById('weld-tool-measure'),
        toolCrosshair: document.getElementById('weld-tool-crosshair'),
        toolLine: document.getElementById('weld-tool-line'),
        freeTableBody: document.querySelector('#weld-free-table tbody'),
        calibPxDisplay: document.getElementById('weld-calib-px-display'),
        calibRealLen: document.getElementById('weld-calib-real-len'),
        calibApplyBtn: document.getElementById('weld-calib-apply-btn'),
        currentScaleText: document.getElementById('weld-current-scale-text'),
        brightnessRange: document.getElementById('weld-brightness'),
        contrastRange: document.getElementById('weld-contrast'),
        unsharpRange: document.getElementById('weld-unsharp'),
        rotateBtn: document.getElementById('weld-rotate-mode-btn'),
        resetBtn: document.getElementById('weld-reset-btn'),
        saveBtn: document.getElementById('weld-save-btn'),
        cropOption: document.getElementById('weld-crop-option'),
        showStepLayer: document.getElementById('weld-show-step-layer'),
        prevBtn: document.getElementById('weld-prev-btn'),
        nextBtn: document.getElementById('weld-next-btn'),
        navBtns: document.getElementById('weld-nav-btns'),
        stepContainer: document.getElementById('weld-step-container'),
        canvasBg: document.getElementById('weld-canvas-bg'),
        canvasUi: document.getElementById('weld-canvas-ui'),
        canvasContainer: document.getElementById('weld-canvas-container'),
        crosshair: document.getElementById('weld-crosshair'),
        zoomInBtn: document.getElementById('weld-zoom-in'),
        zoomOutBtn: document.getElementById('weld-zoom-out'),
        zoomFitBtn: document.getElementById('weld-zoom-fit'),
        zoom100Btn: document.getElementById('weld-zoom-100'),
        panBtn: document.getElementById('weld-pan-btn'),
        guide: document.getElementById('weld-guide'),
        attrDate: document.getElementById('weld-attr-date'),
        attrProduct: document.getElementById('weld-attr-product'),
        attrJig: document.getElementById('weld-attr-jig'),
        attrShift: document.getElementById('weld-attr-shift'),
        attrTiming: document.getElementById('weld-attr-timing'),
        productHistory: document.getElementById('weld-product-history'),
        jigHistory: document.getElementById('weld-jig-history'),
        shiftHistory: document.getElementById('weld-shift-history'),
        timingHistory: document.getElementById('weld-timing-history'),
        stepResultsContainer: document.getElementById('weld-step-results-container'),
        resL1: document.querySelector('#weld-result-item-l1 .value'),
        resL2: document.querySelector('#weld-result-item-l2 .value'),
        resL3: document.querySelector('#weld-result-item-l3 .value'),
        resL4: document.querySelector('#weld-result-item-l4 .value'),
        resThroat: document.querySelector('#weld-result-item-throat .value'),
        resItemL1: document.getElementById('weld-result-item-l1'),
        resItemL2: document.getElementById('weld-result-item-l2'),
        resItemL3: document.getElementById('weld-result-item-l3'),
        resItemL4: document.getElementById('weld-result-item-l4'),
        resItemThroat: document.getElementById('weld-result-item-throat'),
        stepGuideContainer: document.getElementById('weld-step-guide-image-container'),
        stepGuideImg: document.getElementById('weld-step-guide-img'),
    };

    // Verify all DOM elements exist
    const missingKeys = [];
    for (const [key, el] of Object.entries(elements)) {
        if (!el) missingKeys.push(key);
    }
    if (missingKeys.length > 0) {
        throw new Error(`Missing DOM elements: ${missingKeys.join(', ')}`);
    }

    let appState = {
        images: [], 
        activeIndex: -1,
        mainTab: 'measurement', // measurement, calibration
        workflow: 'step', // step, free
        freeModeTool: 'measure', // measure, crosshair, line
        panMode: false // temporary pan override
    };

    // Initial setup
    const now = new Date();
    elements.attrDate.value = now.toISOString().split('T')[0];
    loadHistory();

    // Event Listeners
    elements.imageInput.addEventListener('change', (e) => handleImageUpload(e, false));
    elements.calibImageInput.addEventListener('change', (e) => handleImageUpload(e, true));
    elements.tabMeas.addEventListener('click', () => switchMainTab('measurement'));
    elements.tabCalib.addEventListener('click', () => switchMainTab('calibration'));
    elements.workflowStep.addEventListener('click', () => switchWorkflow('step'));
    elements.workflowFree.addEventListener('click', () => switchWorkflow('free'));
    elements.toolMeasure.addEventListener('click', () => switchFreeTool('measure'));
    elements.toolCrosshair.addEventListener('click', () => switchFreeTool('crosshair'));
    elements.toolLine.addEventListener('click', () => switchFreeTool('line'));

    elements.zoomInBtn.addEventListener('click', () => zoomByFactor(1.25));
    elements.zoomOutBtn.addEventListener('click', () => zoomByFactor(0.8));
    elements.zoomFitBtn.addEventListener('click', zoomFit);
    elements.zoom100Btn.addEventListener('click', zoom100);
    elements.panBtn.addEventListener('click', togglePanMode);

    elements.calibApplyBtn.addEventListener('click', applyCalibration);
    
    elements.canvasUi.addEventListener('mousedown', handleMouseDown);
    elements.canvasUi.addEventListener('mousemove', handleMouseMove);
    elements.canvasUi.addEventListener('mouseup', handleMouseUp);
    elements.canvasUi.addEventListener('wheel', handleWheel, { passive: false });
    
    elements.prevBtn.addEventListener('click', () => changeStep(-1));
    elements.nextBtn.addEventListener('click', () => changeStep(1));
    
    elements.brightnessRange.addEventListener('input', debounce(() => applyAdjustments(), 50));
    elements.contrastRange.addEventListener('input', debounce(() => applyAdjustments(), 50));
    elements.unsharpRange.addEventListener('input', debounce(() => applyAdjustments(), 50));
    
    elements.rotateBtn.addEventListener('click', toggleRotateMode);
    elements.resetBtn.addEventListener('click', resetMeasurements);
    elements.saveBtn.addEventListener('click', exportImage);
    elements.showStepLayer.addEventListener('change', render);

    // --- Tab & Workflow Management ---

    function switchMainTab(tab) {
        appState.mainTab = tab;
        elements.tabMeas.classList.toggle('active', tab === 'measurement');
        elements.tabCalib.classList.toggle('active', tab === 'calibration');
        elements.panelMeas.style.display = tab === 'measurement' ? 'block' : 'none';
        elements.panelCalib.style.display = tab === 'calibration' ? 'block' : 'none';

        // Auto-switch canvas to show the right image type
        const targetIsCalib = (tab === 'calibration');
        const targetIdx = appState.images.findIndex(img => img.isCalibration === targetIsCalib);
        if (targetIdx >= 0) {
            appState.activeIndex = targetIdx;
            resetView();
            const active = getActiveImage();
            if (active) syncControlsToImage(active);
        }

        updateStepUI();
        render();
    }

    function switchWorkflow(wf) {
        appState.workflow = wf;
        elements.workflowStep.classList.toggle('active', wf === 'step');
        elements.workflowFree.classList.toggle('active', wf === 'free');
        
        elements.stepContainer.style.display = wf === 'step' ? 'block' : 'none';
        elements.navBtns.style.display = wf === 'step' ? 'flex' : 'none';
        elements.freeToolsContainer.style.display = wf === 'free' ? 'block' : 'none';
        
        updateStepUI();
        render();
    }

    function switchFreeTool(tool) {
        appState.freeModeTool = tool;
        elements.toolMeasure.classList.toggle('active', tool === 'measure');
        elements.toolCrosshair.classList.toggle('active', tool === 'crosshair');
        elements.toolLine.classList.toggle('active', tool === 'line');
        const img = getActiveImage();
        if (img) img.previewShape = null; // Cancel any active drawing
        render();
    }

    function getActiveImage() {
        return appState.images[appState.activeIndex] || null;
    }

    // --- Core Logic ---
    async function handleImageUpload(e, isCalib = false) {
        if (!cvReady) {
            alert(window.t('weld_opencv_not_ready') || 'OpenCV.js is not ready. Please wait.');
            e.target.value = '';
            return;
        }
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        for (const file of files) {
            const imageData = await readImageFile(file);
            const imgState = {
                id: Date.now() + Math.random(), // Unique ID
                name: file.name,
                isCalibration: isCalib,
                originalImg: imageData.img,
                matOriginal: imageData.mat,
                matProcessed: imageData.mat.clone(),
                scale: 1,
                offsetX: 0,
                offsetY: 0,
                pxPerMm: 0,
                currentStep: 1,
                measurements: { rect: null, root: null, throatPoint: null, calibLine: null, freeShapes: [] },
                previewShape: null,
                rotatePoints: [],
                isRotateMode: false,
                brightness: 0,
                contrast: 0,
                unsharp: 0
            };
            appState.images.push(imgState);
            appState.activeIndex = appState.images.length - 1;
        }
        
        if (isCalib) {
            switchMainTab('calibration');
        } else {
            // If measurement tab not already active, stay on it
            if (appState.mainTab !== 'measurement') switchMainTab('measurement');
        }

        // Show newly added image on canvas immediately
        selectImage(appState.activeIndex);
    }

    function readImageFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const temp = document.createElement('canvas');
                    temp.width = img.width; temp.height = img.height;
                    const ctx = temp.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const mat = cv.imread(temp);
                    resolve({ img, mat });
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // (No image tabs in canvas area — left panel tab auto-switches)
    function updateImageTabs() { /* no-op */ }

    function selectImage(index) {
        appState.activeIndex = index;
        const img = getActiveImage();
        if (img) {
            resetView();
            syncControlsToImage(img);
            updateImageTabs();
            updateStepUI();
            render();
        }
    }

    function closeImage(index) {
        const img = appState.images[index];
        if (img) {
            img.matOriginal.delete();
            img.matProcessed.delete();
        }
        appState.images.splice(index, 1);
        if (appState.activeIndex >= appState.images.length) {
            appState.activeIndex = appState.images.length - 1;
        }
        updateImageTabs();
        if (appState.activeIndex >= 0) {
            selectImage(appState.activeIndex);
        } else {
            clearCanvas();
        }
    }

    function syncControlsToImage(img) {
        elements.brightnessRange.value = img.brightness;
        elements.contrastRange.value = img.contrast;
        elements.unsharpRange.value = img.unsharp;
        
        if (img.pxPerMm > 0) {
            elements.currentScaleText.textContent = `${img.pxPerMm.toFixed(3)} px/mm`;
            elements.currentScaleText.style.color = 'var(--accent-actual)';
        } else {
            elements.currentScaleText.textContent = window.t('weld_scale_unset') || '未設定';
            elements.currentScaleText.style.color = 'var(--text-muted)';
        }
        
        updateFreeTable(img);
    }

    function changeStep(delta) {
        const img = getActiveImage();
        if (!img) return;
        const next = img.currentStep + delta;
        if (next > 4) {
            // After step 4, switch to free mode while keeping all measurements
            switchWorkflow('free');
            return;
        }
        if (next >= 1 && next <= 4) {
            img.currentStep = next;
            updateStepUI();
            render();
        }
    }

    function updateStepUI() {
        const img = getActiveImage();
        if (!img) {
            elements.guide.textContent = window.t('weld_guide_init');
            elements.stepResultsContainer.style.display = 'none';
            elements.stepGuideContainer.style.display = 'none';
            return;
        }

        // Step Indicators
        document.querySelectorAll('.step').forEach(el => {
            el.classList.toggle('active', parseInt(el.dataset.step) === img.currentStep);
        });
        
        if (appState.mainTab === 'calibration') {
            elements.guide.textContent = window.t('weld_guide_calib');
            elements.stepResultsContainer.style.display = 'none';
            elements.stepGuideContainer.style.display = 'none';
            const line = img.measurements.calibLine;
            if (line) {
                const px = Math.hypot(line.p1.x - line.p2.x, line.p1.y - line.p2.y);
                elements.calibPxDisplay.textContent = `${px.toFixed(1)} px`;
            } else {
                elements.calibPxDisplay.textContent = "0.0 px";
            }
            return;
        }

        if (appState.workflow === 'free') {
            elements.guide.textContent = window.t('weld_guide_free');
            elements.stepGuideContainer.style.display = 'none';
            updateStepResultsTable();
            return;
        }

        // Step Guide Image (Real Example Screenshot)
        let helpSrc = '';
        if (img.currentStep === 2) helpSrc = 'weld_example_step2.png';
        else if (img.currentStep === 3) helpSrc = 'weld_example_step3.png';
        else if (img.currentStep === 4) helpSrc = 'weld_example_step4.png';

        if (helpSrc) {
            elements.stepGuideImg.src = helpSrc;
            elements.stepGuideContainer.style.display = 'block';
        } else {
            elements.stepGuideContainer.style.display = 'none';
        }

        // Step Mode Guides
        const guides = {
            1: window.t('weld_guide_step_1'),
            2: window.t('weld_guide_step_2'),
            3: window.t('weld_guide_step_3'),
            4: window.t('weld_guide_step_4')
        };
        
        elements.guide.textContent = guides[img.currentStep] || "";
        updateStepResultsTable();
    }

    function updateStepResultsTable() {
        const img = getActiveImage();
        if (!img || appState.mainTab === 'calibration' || appState.workflow === 'free') {
            elements.stepResultsContainer.style.display = 'none';
            return;
        }

        const { rect, root, throatPoint } = img.measurements;
        const ppm = img.pxPerMm;

        if (rect || root || throatPoint) {
            elements.stepResultsContainer.style.display = 'block';
        } else {
            elements.stepResultsContainer.style.display = 'none';
            return;
        }

        // L1 ~ L4 (distances from root to rect boundaries)
        if (rect && root) {
            const dTop   = formatDist(Math.abs(root.y - rect.y), ppm);
            const dBot   = formatDist(Math.abs(root.y - (rect.y + rect.h)), ppm);
            const dLeft  = formatDist(Math.abs(root.x - rect.x), ppm);
            const dRight = formatDist(Math.abs(root.x - (rect.x + rect.w)), ppm);

            elements.resItemL1.style.display = 'block';
            elements.resL1.textContent = dTop;
            elements.resItemL2.style.display = 'block';
            elements.resL2.textContent = dBot;
            elements.resItemL3.style.display = 'block';
            elements.resL3.textContent = dLeft;
            elements.resItemL4.style.display = 'block';
            elements.resL4.textContent = dRight;
        } else {
            elements.resItemL1.style.display = 'none';
            elements.resItemL2.style.display = 'none';
            elements.resItemL3.style.display = 'none';
            elements.resItemL4.style.display = 'none';
        }

        // Throat (T)
        if (root && throatPoint) {
            const dist = formatDist(Math.hypot(throatPoint.x - root.x, throatPoint.y - root.y), ppm);
            elements.resItemThroat.style.display = 'block';
            elements.resThroat.textContent = dist;
        } else {
            elements.resItemThroat.style.display = 'none';
        }
    }

    function handleMouseDown(e) {
        const img = getActiveImage();
        if (!img) return;
        
        const rect = elements.canvasUi.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const imgPos = screenToImage(mx, my);

        elements.canvasUi.setPointerCapture(e.pointerId || 1);

        if (e.button === 1 || (e.button === 0 && e.altKey) || (e.button === 0 && appState.panMode)) {
            img.isPanning = true;
            img.lastMouseX = e.clientX;
            img.lastMouseY = e.clientY;
            return;
        }

        // Hit Detection for fine-tuning
        const hit = detectHit(mx, my);
        if (hit) {
            img.dragTarget = hit;
            return;
        }

        if (img.isRotateMode) {
            img.rotatePoints.push(imgPos);
            if (img.rotatePoints.length === 2) applyRotation();
            render(); return;
        }

        // Calibration Mode
        if (appState.mainTab === 'calibration') {
            if (!img.measurements.calibLine) img.measurements.calibLine = { p1: imgPos, p2: imgPos };
            else img.measurements.calibLine.p2 = imgPos;
            updateStepUI();
        } 
        // Free Workflow
        else if (appState.workflow === 'free') {
            const tool = appState.freeModeTool;
            if (tool === 'crosshair') {
                // Crosshair requires only 1 click
                img.measurements.freeShapes.push({
                    id: Date.now(),
                    type: 'crosshair',
                    p1: imgPos
                });
                updateFreeTable(img);
            } else {
                // Measure line or Simple line (click-move-click)
                if (!img.previewShape) {
                    // Start drawing
                    img.previewShape = {
                        id: Date.now(),
                        type: tool,
                        p1: imgPos,
                        p2: imgPos
                    };
                } else {
                    // Finish drawing
                    let finalP2 = imgPos;
                    if (e.shiftKey) finalP2 = applySnap(img.previewShape.p1, imgPos);
                    
                    img.measurements.freeShapes.push({
                        ...img.previewShape,
                        p2: finalP2
                    });
                    img.previewShape = null;
                    updateFreeTable(img);
                }
            }
        }
        // Step Workflow
        else {
            if (img.currentStep === 2) { // Rect
                if (!img.measurements.rect) {
                    // First time: start drag-to-draw
                    img.rectStart = imgPos;
                    img.measurements.rect = { x: imgPos.x, y: imgPos.y, w: 0, h: 0 };
                }
                // If rect already exists, edges are draggable via detectHit
            } else if (img.currentStep === 3) { // Root
                img.measurements.root = imgPos;
            } else if (img.currentStep === 4) { // Throat (T)
                let finalPos = imgPos;
                if (e.shiftKey && img.measurements.root) finalPos = applySnap(img.measurements.root, imgPos);
                img.measurements.throatPoint = finalPos;
            }
        }
        render();
    }

    function applySnap(p1, p2) {
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let angle = Math.atan2(dy, dx);
        // Snap to nearest 15 degrees (PI/12)
        angle = Math.round(angle / (Math.PI / 12)) * (Math.PI / 12);
        let dist = Math.hypot(dx, dy);
        return {
            x: p1.x + Math.cos(angle) * dist,
            y: p1.y + Math.sin(angle) * dist
        };
    }

    function handleMouseMove(e) {
        const img = getActiveImage();
        if (!img) return;

        const rect = elements.canvasUi.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        let imgPos = screenToImage(mx, my);

        if (img.isPanning) {
            img.offsetX += e.clientX - img.lastMouseX;
            img.offsetY += e.clientY - img.lastMouseY;
            img.lastMouseX = e.clientX; img.lastMouseY = e.clientY;
            render(); return;
        }

        if (img.dragTarget) {
            updateDrag(imgPos, e.shiftKey);
            if (appState.mainTab === 'calibration') updateStepUI();
            render(); return;
        }

        // Drag-to-draw rect (only for initial creation)
        if (appState.workflow === 'step' && img.rectStart && img.currentStep === 2) {
            img.measurements.rect = {
                x: Math.min(img.rectStart.x, imgPos.x),
                y: Math.min(img.rectStart.y, imgPos.y),
                w: Math.max(30, Math.abs(img.rectStart.x - imgPos.x)),
                h: Math.max(30, Math.abs(img.rectStart.y - imgPos.y))
            };
            render();
        }

        if (appState.workflow === 'free' && img.previewShape) {
            let p2 = imgPos;
            if (e.shiftKey) p2 = applySnap(img.previewShape.p1, imgPos);
            img.previewShape.p2 = p2;
            render();
        }

        updateCrosshair(e);
    }

    function handleMouseUp(e) {
        const img = getActiveImage();
        if (!img) return;
        elements.canvasUi.releasePointerCapture(e.pointerId || 1);
        img.isPanning = false;
        img.dragTarget = null;
        img.rectStart = null;
        render();
    }

    function handleWheel(e) {
        const img = getActiveImage();
        if (!img) return;
        e.preventDefault();
        const rect = elements.canvasUi.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        
        const zoom = e.deltaY > 0 ? 0.9 : 1.1;
        const oldScale = img.scale;
        img.scale = Math.min(Math.max(img.scale * zoom, 0.05), 20);
        
        img.offsetX = mx - (mx - img.offsetX) * (img.scale / oldScale);
        img.offsetY = my - (my - img.offsetY) * (img.scale / oldScale);
        render();
    }

    function zoomByFactor(factor) {
        const img = getActiveImage();
        if (!img) return;
        const cw = elements.canvasContainer.clientWidth;
        const ch = elements.canvasContainer.clientHeight;
        const cx = cw / 2, cy = ch / 2;
        const oldScale = img.scale;
        img.scale = Math.min(Math.max(img.scale * factor, 0.05), 20);
        img.offsetX = cx - (cx - img.offsetX) * (img.scale / oldScale);
        img.offsetY = cy - (cy - img.offsetY) * (img.scale / oldScale);
        render();
    }

    function zoomFit() {
        const img = getActiveImage();
        if (!img) return;
        const imgW = img.matProcessed ? img.matProcessed.cols : img.originalImg.width;
        const imgH = img.matProcessed ? img.matProcessed.rows : img.originalImg.height;
        const cw = elements.canvasContainer.clientWidth;
        const ch = elements.canvasContainer.clientHeight;
        const s = Math.min(cw / imgW, ch / imgH);
        img.scale = s;
        img.offsetX = (cw - imgW * s) / 2;
        img.offsetY = (ch - imgH * s) / 2;
        render();
    }

    function zoom100() {
        const img = getActiveImage();
        if (!img) return;
        const imgW = img.matProcessed ? img.matProcessed.cols : img.originalImg.width;
        const imgH = img.matProcessed ? img.matProcessed.rows : img.originalImg.height;
        const cw = elements.canvasContainer.clientWidth;
        const ch = elements.canvasContainer.clientHeight;
        img.scale = 1;
        img.offsetX = (cw - imgW) / 2;
        img.offsetY = (ch - imgH) / 2;
        render();
    }

    function togglePanMode() {
        appState.panMode = !appState.panMode;
        elements.panBtn.classList.toggle('active', appState.panMode);
        elements.canvasUi.style.cursor = appState.panMode ? 'grab' : '';
    }
    function detectHit(sx, sy) {
        const img = getActiveImage();
        const tol = 10;
        const { rect, root, throatPoint, calibLine } = img.measurements;

        if (root) {
            const s = imageToScreen(root.x, root.y);
            if (Math.hypot(s.x - sx, s.y - sy) < tol) return { type: 'root' };
        }
        
        if (throatPoint) {
            const s = imageToScreen(throatPoint.x, throatPoint.y);
            if (Math.hypot(s.x - sx, s.y - sy) < tol) return { type: 'throatPoint' };
        }

        if (rect) {
            const sTL = imageToScreen(rect.x, rect.y);
            const sBR = imageToScreen(rect.x + rect.w, rect.y + rect.h);
            const sMidX = (sTL.x + sBR.x) / 2;
            const sMidY = (sTL.y + sBR.y) / 2;
            // Top edge
            if (Math.abs(sy - sTL.y) < tol && sx >= sTL.x - tol && sx <= sBR.x + tol) return { type: 'rect', part: 'top' };
            // Bottom edge
            if (Math.abs(sy - sBR.y) < tol && sx >= sTL.x - tol && sx <= sBR.x + tol) return { type: 'rect', part: 'bottom' };
            // Left edge
            if (Math.abs(sx - sTL.x) < tol && sy >= sTL.y - tol && sy <= sBR.y + tol) return { type: 'rect', part: 'left' };
            // Right edge
            if (Math.abs(sx - sBR.x) < tol && sy >= sTL.y - tol && sy <= sBR.y + tol) return { type: 'rect', part: 'right' };
        }

        if (calibLine) {
            const s1 = imageToScreen(calibLine.p1.x, calibLine.p1.y);
            const s2 = imageToScreen(calibLine.p2.x, calibLine.p2.y);
            if (Math.hypot(s1.x - sx, s1.y - sy) < tol) return { type: 'calib', part: 'p1' };
            if (Math.hypot(s2.x - sx, s2.y - sy) < tol) return { type: 'calib', part: 'p2' };
        }
        return null;
    }

    function updateDrag(imgPos, isShift = false) {
        const img = getActiveImage();
        const t = img.dragTarget;
        const m = img.measurements;
        if (t.type === 'root') m.root = imgPos;
        else if (t.type === 'throatPoint') {
            m.throatPoint = (isShift && m.root) ? applySnap(m.root, imgPos) : imgPos;
        }
        else if (t.type === 'calib') {
            if (t.part === 'p1') m.calibLine.p1 = imgPos;
            else m.calibLine.p2 = imgPos;
        } else if (t.type === 'rect') {
            const MIN_RECT = 30; // Minimum rect size in image pixels
            const r = m.rect;
            if (t.part === 'top') {
                const maxY = (r.y + r.h) - MIN_RECT;
                const newY = Math.min(imgPos.y, maxY);
                r.h += r.y - newY;
                r.y = newY;
            } else if (t.part === 'bottom') {
                r.h = Math.max(MIN_RECT, imgPos.y - r.y);
            } else if (t.part === 'left') {
                const maxX = (r.x + r.w) - MIN_RECT;
                const newX = Math.min(imgPos.x, maxX);
                r.w += r.x - newX;
                r.x = newX;
            } else if (t.part === 'right') {
                r.w = Math.max(MIN_RECT, imgPos.x - r.x);
            }
        }
    }

    function applyCalibration() {
        const img = getActiveImage();
        if (!img) return;
        const real = parseFloat(elements.calibRealLen.value);
        const line = img.measurements.calibLine;
        if (real > 0 && line) {
            const pxLen = Math.hypot(line.p1.x - line.p2.x, line.p1.y - line.p2.y);
            img.pxPerMm = pxLen / real;
            // Broadcast calibration scale to all non-calibration images
            appState.images.forEach(other => {
                if (!other.isCalibration) {
                    other.pxPerMm = img.pxPerMm;
                }
            });
            elements.currentScaleText.textContent = `${img.pxPerMm.toFixed(3)} px/mm`;
            elements.currentScaleText.style.color = 'var(--accent-actual)';
            render();
        }
    }

    function render() {
        const imgState = getActiveImage();
        if (!imgState) return;
        
        const bgCtx = elements.canvasBg.getContext('2d');
        const uiCtx = elements.canvasUi.getContext('2d');
        elements.canvasBg.width = elements.canvasUi.width = elements.canvasContainer.clientWidth;
        elements.canvasBg.height = elements.canvasUi.height = elements.canvasContainer.clientHeight;

        bgCtx.clearRect(0, 0, elements.canvasBg.width, elements.canvasBg.height);
        uiCtx.clearRect(0, 0, elements.canvasUi.width, elements.canvasUi.height);

        // Background
        const img = (cvReady && imgState.matProcessed) ? imgState.matProcessed : imgState.originalImg;
        if (cvReady && imgState.matProcessed) {
            const temp = document.createElement('canvas'); cv.imshow(temp, imgState.matProcessed);
            bgCtx.drawImage(temp, imgState.offsetX, imgState.offsetY, imgState.matProcessed.cols * imgState.scale, imgState.matProcessed.rows * imgState.scale);
        } else {
            bgCtx.drawImage(imgState.originalImg, imgState.offsetX, imgState.offsetY, imgState.originalImg.width * imgState.scale, imgState.originalImg.height * imgState.scale);
        }

        // UI
        drawMeasurements(uiCtx, imgState);
        // HUD overlay (mode + step)
        drawHUD(uiCtx, imgState);
        // Rotation mode overlay
        if (imgState.isRotateMode) {
            drawRotationOverlay(uiCtx, imgState);
        }
    }

    function drawHUD(ctx, img) {
        const w = elements.canvasBg.width;
        const h = elements.canvasBg.height;

        // Bottom status bar
        const scalePrefix = window.t('weld_scale_label') || 'スケール: ';
        const unsetText = window.t('weld_scale_unset') || '未設定';
        const scaleLabel = img.pxPerMm > 0 ? `${scalePrefix}${img.pxPerMm.toFixed(2)} px/mm` : `${scalePrefix}${unsetText}`;
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, h - 30, w, 30);
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillStyle = '#22d3ee';
        ctx.textAlign = 'left';
        ctx.fillText(scaleLabel, 10, h - 10);
        ctx.restore();

        // Top step instruction banner (step mode only)
        if (appState.workflow === 'step') {
            const stepTexts = {
                1: window.t('weld_step_inst_1') || '① 画像を調整してください（明るさ・コントラスト・回転）',
                2: window.t('weld_step_inst_2') || '② 溶接部の外形をドラッグで囲んでください',
                3: window.t('weld_step_inst_3') || '③ ルート（起点）をクリックしてください',
                4: window.t('weld_step_inst_4') || '④ のど厚の端点をクリックしてください（Shift: 15°スナップ）'
            };
            const text = stepTexts[img.currentStep] || '';
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, w, 44);
            ctx.font = 'bold 18px Inter, sans-serif';
            ctx.fillStyle = '#22d3ee';
            ctx.textAlign = 'center';
            ctx.fillText(text, w / 2, 28);
            ctx.restore();
        }
    }

    function drawRotationOverlay(ctx, img) {
        const w = elements.canvasBg.width;
        const h = elements.canvasBg.height;

        // Dim overlay
        ctx.save();
        ctx.fillStyle = 'rgba(255, 120, 0, 0.12)';
        ctx.fillRect(0, 0, w, h);

        // Orange border
        ctx.strokeStyle = 'rgba(255, 140, 0, 0.9)';
        ctx.lineWidth = 3;
        ctx.strokeRect(2, 2, w - 4, h - 4);

        // Banner text
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(0, 0, w, 42);
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.fillStyle = '#ff9900';
        ctx.textAlign = 'center';
        const rotText = window.t('weld_rot_overlay') || '🔄  回転補正モード中  —  基準線の始点と終点をクリックしてください';
        ctx.fillText(rotText, w / 2, 26);
        ctx.textAlign = 'left';

        // Show picked points
        const iTS = (ix, iy) => ({ x: ix * img.scale + img.offsetX, y: iy * img.scale + img.offsetY });
        img.rotatePoints.forEach((p, i) => {
            const sp = iTS(p.x, p.y);
            ctx.fillStyle = '#ff9900';
            ctx.beginPath(); ctx.arc(sp.x, sp.y, 7, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'black';
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(i === 0 ? 'P1' : 'P2', sp.x, sp.y + 4);
            ctx.textAlign = 'left';
        });
        if (img.rotatePoints.length === 2) {
            const p1 = iTS(img.rotatePoints[0].x, img.rotatePoints[0].y);
            const p2 = iTS(img.rotatePoints[1].x, img.rotatePoints[1].y);
            ctx.strokeStyle = '#ff9900';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            ctx.setLineDash([]);
        }
        ctx.restore();
    }

    function drawMeasurements(ctx, img) {
        const iTS = (ix, iy) => ({ x: ix * img.scale + img.offsetX, y: iy * img.scale + img.offsetY });
        const s = img.scale;
        const { rect, root, throatPoint, calibLine, freeShapes } = img.measurements;
        const showStepLayer = (appState.workflow !== 'free' || elements.showStepLayer.checked);

        // Bounding box (always show if exists)
        if (showStepLayer && rect) {
            const tl = iTS(rect.x, rect.y);
            const br = iTS(rect.x + rect.w, rect.y + rect.h);
            const sz = { w: rect.w * s, h: rect.h * s };
            ctx.strokeStyle = 'cyan'; ctx.lineWidth = 2;
            ctx.strokeRect(tl.x, tl.y, sz.w, sz.h);

            // Draw edge handles only in step mode
            if (appState.workflow === 'step') {
                const handleSize = 8;
                ctx.fillStyle = 'cyan';
                const midX = (tl.x + br.x) / 2;
                const midY = (tl.y + br.y) / 2;
                ctx.fillRect(midX - handleSize/2, tl.y - handleSize/2, handleSize, handleSize);
                ctx.fillRect(midX - handleSize/2, br.y - handleSize/2, handleSize, handleSize);
                ctx.fillRect(tl.x - handleSize/2, midY - handleSize/2, handleSize, handleSize);
                ctx.fillRect(br.x - handleSize/2, midY - handleSize/2, handleSize, handleSize);
            }
        }

        // Root point (always show if exists)
        if (showStepLayer && root) {
            const sr = iTS(root.x, root.y);
            ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(sr.x, sr.y, 6, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = 'white'; ctx.lineWidth = 1.5; ctx.stroke();
        }

        // --- Step Measurement Drawings (always show if data exists) ---
        if (showStepLayer) {
            // Penetration 4-directional lines + Fillet L1/L2
            if (root && rect) {
                const sr = iTS(root.x, root.y);
                const tl = iTS(rect.x, rect.y);
                const br = iTS(rect.x + rect.w, rect.y + rect.h);
                
                const imgW = img.matProcessed ? img.matProcessed.cols : img.originalImg.width;
                const imgH = img.matProcessed ? img.matProcessed.rows : img.originalImg.height;
                const edgeTop    = iTS(root.x, 0);
                const edgeBot    = iTS(root.x, imgH);
                const edgeLeft   = iTS(0, root.y);
                const edgeRight  = iTS(imgW, root.y);

                // Dashed lines to edges
                ctx.save();
                ctx.strokeStyle = 'rgba(255, 220, 80, 0.85)';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([6, 4]);
                ctx.beginPath(); ctx.moveTo(sr.x, sr.y); ctx.lineTo(sr.x, edgeTop.y); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(sr.x, sr.y); ctx.lineTo(sr.x, edgeBot.y); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(sr.x, sr.y); ctx.lineTo(edgeLeft.x, sr.y); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(sr.x, sr.y); ctx.lineTo(edgeRight.x, sr.y); ctx.stroke();
                ctx.setLineDash([]);
                ctx.restore();

                // Tick marks
                const tickLen = 7;
                ctx.save();
                ctx.strokeStyle = 'rgba(255, 220, 80, 1)';
                ctx.lineWidth = 2.5;
                ctx.beginPath(); ctx.moveTo(sr.x - tickLen, tl.y); ctx.lineTo(sr.x + tickLen, tl.y); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(sr.x - tickLen, br.y); ctx.lineTo(sr.x + tickLen, br.y); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(tl.x, sr.y - tickLen); ctx.lineTo(tl.x, sr.y + tickLen); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(br.x, sr.y - tickLen); ctx.lineTo(br.x, sr.y + tickLen); ctx.stroke();
                ctx.restore();

                const ppm = img.pxPerMm;
                const dTop   = formatDist(Math.abs(root.y - rect.y), ppm);
                const dBot   = formatDist(Math.abs(root.y - (rect.y + rect.h)), ppm);
                const dLeft  = formatDist(Math.abs(root.x - rect.x), ppm);
                const dRight = formatDist(Math.abs(root.x - (rect.x + rect.w)), ppm);

                const drawPill = (text, cx, cy, angle, color) => {
                    ctx.save();
                    ctx.translate(cx, cy);
                    if (angle) ctx.rotate(angle);
                    ctx.font = 'bold 13px Inter, sans-serif';
                    const tw = ctx.measureText(text).width;
                    const pad = 4;
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.roundRect(-(tw / 2) - pad, -10, tw + pad * 2, 18, 4);
                    ctx.fill();
                    ctx.fillStyle = '#000';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(text, 0, 0);
                    ctx.restore();
                };

                // Determine which pair is shorter to offset outside the rect
                const distTopPx  = Math.abs(root.y - rect.y);
                const distBotPx  = Math.abs(root.y - (rect.y + rect.h));
                const distLeftPx = Math.abs(root.x - rect.x);
                const distRightPx = Math.abs(root.x - (rect.x + rect.w));

                const vertShort = Math.min(distTopPx, distBotPx);
                const horizShort = Math.min(distLeftPx, distRightPx);

                // For vertical labels: if short, place outside rect on the opposite side
                const pillOffset = 22;
                const outsideOffset = 30; // distance outside the rect edge

                // Top pill
                const isTopShort = (distTopPx <= distBotPx);
                const topPillY = isTopShort
                    ? tl.y - outsideOffset  // outside above rect
                    : (sr.y + tl.y) / 2;   // midpoint inside
                drawPill('→ ' + dTop, sr.x - pillOffset, topPillY, -Math.PI / 2, 'rgba(250,204,21,0.92)');

                // Bottom pill
                const isBotShort = (distBotPx <= distTopPx);
                const botPillY = isBotShort
                    ? br.y + outsideOffset  // outside below rect
                    : (sr.y + br.y) / 2;    // midpoint inside
                drawPill('← ' + dBot, sr.x + pillOffset, botPillY, -Math.PI / 2, 'rgba(251,146,60,0.92)');

                // Left pill
                const isLeftShort = (distLeftPx <= distRightPx);
                const leftPillX = isLeftShort
                    ? tl.x - outsideOffset  // outside left of rect
                    : (sr.x + tl.x) / 2;   // midpoint inside
                drawPill('← ' + dLeft, leftPillX, sr.y - 14, 0, 'rgba(52,211,153,0.92)');

                // Right pill
                const isRightShort = (distRightPx <= distLeftPx);
                const rightPillX = isRightShort
                    ? br.x + outsideOffset  // outside right of rect
                    : (sr.x + br.x) / 2;   // midpoint inside
                drawPill('→ ' + dRight, rightPillX, sr.y + 20, 0, 'rgba(129,140,248,0.92)');

                // Removed L1/L2 labels as requested.
            }

            // Throat (T)
            if (root && throatPoint) {
                const sr = iTS(root.x, root.y);
                const sp = iTS(throatPoint.x, throatPoint.y);
                ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(sr.x, sr.y); ctx.lineTo(sp.x, sp.y); ctx.stroke();
                const dist = formatDist(Math.hypot(throatPoint.x - root.x, throatPoint.y - root.y), img.pxPerMm);
                drawOutlinedText(ctx, `T: ${dist}`, sp.x + 10, sp.y + 10);
                
                ctx.fillStyle = 'yellow'; ctx.beginPath(); ctx.arc(sp.x, sp.y, 4, 0, Math.PI * 2); ctx.fill();
            }
        }

        // --- Free Mode Drawings (always show if data exists) ---
        {
            const drawFreeShape = (shape) => {
                if (shape.type === 'crosshair') {
                    const s = iTS(shape.p1.x, shape.p1.y);
                    ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(0, s.y); ctx.lineTo(elements.canvasBg.width, s.y);
                    ctx.moveTo(s.x, 0); ctx.lineTo(s.x, elements.canvasBg.height);
                    ctx.stroke();
                    ctx.fillStyle = 'cyan'; ctx.beginPath(); ctx.arc(s.x, s.y, 3, 0, Math.PI * 2); ctx.fill();
                } else if (shape.p2) {
                    const s1 = iTS(shape.p1.x, shape.p1.y);
                    const s2 = iTS(shape.p2.x, shape.p2.y);
                    ctx.strokeStyle = shape.type === 'measure' ? 'lime' : '#60a5fa'; // Blue for simple line
                    ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.stroke();
                    ctx.fillStyle = ctx.strokeStyle;
                    ctx.beginPath(); ctx.arc(s1.x, s1.y, 4, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(s2.x, s2.y, 4, 0, Math.PI * 2); ctx.fill();

                    if (shape.type === 'measure') {
                        const dist = formatDist(Math.hypot(shape.p1.x - shape.p2.x, shape.p1.y - shape.p2.y), img.pxPerMm);
                        drawOutlinedText(ctx, dist, (s1.x + s2.x) / 2, (s1.y + s2.y) / 2 - 10);
                    }
                }
            };

            freeShapes.forEach(drawFreeShape);
            if (img.previewShape) drawFreeShape(img.previewShape);
        }

        // --- Calibration line ---
        if (calibLine && appState.mainTab === 'calibration') {
            const c1 = iTS(calibLine.p1.x, calibLine.p1.y);
            const c2 = iTS(calibLine.p2.x, calibLine.p2.y);
            ctx.strokeStyle = 'magenta'; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.stroke();
            ctx.setLineDash([]);
            [c1, c2].forEach(p => {
                ctx.fillStyle = 'magenta'; ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill();
            });
            const px = Math.hypot(calibLine.p1.x - calibLine.p2.x, calibLine.p1.y - calibLine.p2.y);
            drawOutlinedText(ctx, `${px.toFixed(1)} px`, (c1.x + c2.x) / 2, (c1.y + c2.y) / 2 - 12, 14);
        }
    }

    function formatDist(px, pxPerMm) {
        if (pxPerMm > 0) return (px / pxPerMm).toFixed(2) + " mm";
        return px.toFixed(1) + " px";
    }

    function drawOutlinedText(ctx, text, x, y, size = 16, angle = 0) {
        if (angle !== 0) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.font = `bold ${size}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.strokeStyle = 'black'; ctx.lineWidth = size * 0.2; ctx.strokeText(text, 0, 0);
            ctx.fillStyle = 'white'; ctx.fillText(text, 0, 0);
            ctx.restore();
        } else {
            ctx.font = `bold ${size}px Inter, sans-serif`;
            ctx.strokeStyle = 'black'; ctx.lineWidth = size * 0.2; ctx.strokeText(text, x, y);
            ctx.fillStyle = 'white'; ctx.fillText(text, x, y);
        }
    }

    // --- Image Processing ---
    function applyAdjustments() {
        const img = getActiveImage();
        if (!cvReady || !img || !img.matOriginal) return;
        
        img.brightness = parseInt(elements.brightnessRange.value);
        img.contrast = parseInt(elements.contrastRange.value);
        img.unsharp = parseInt(elements.unsharpRange.value);
        
        // 1. Convert RGBA to RGB to avoid modifying Alpha channel during brightness/contrast
        let mat = new cv.Mat();
        cv.cvtColor(img.matOriginal, mat, cv.COLOR_RGBA2RGB);
        
        // 2. Apply Brightness & Contrast
        mat.convertTo(mat, -1, 1 + (img.contrast / 100), img.brightness);

        // 3. Convert back to RGBA
        cv.cvtColor(mat, mat, cv.COLOR_RGB2RGBA);

        // 4. Apply Unsharp Mask
        if (img.unsharp > 0) {
            const r = Math.max(1, Math.round(Math.min(mat.rows, mat.cols) / 2000));
            let blurred = new cv.Mat();
            cv.GaussianBlur(mat, blurred, new cv.Size(0, 0), r);
            cv.addWeighted(mat, 1 + img.unsharp/100, blurred, -img.unsharp/100, 0, mat);
            blurred.delete();
        }

        if (img.matProcessed) img.matProcessed.delete();
        img.matProcessed = mat; render();
    }

    function toggleRotateMode() {
        const img = getActiveImage();
        if (!img) return;
        img.isRotateMode = !img.isRotateMode;
        img.rotatePoints = [];
        elements.rotateBtn.classList.toggle('active', img.isRotateMode);
        render();
    }

    function applyRotation() {
        const img = getActiveImage();
        const [p1, p2] = img.rotatePoints;
        // Angle of the user-drawn line in canvas (Y-down) degrees
        const lineAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
        // Nearest axis target
        const targets = [0, 90, 180, 270, -90, -180, -270];
        const nearest = targets.reduce((a, b) => Math.abs(lineAngle - a) < Math.abs(lineAngle - b) ? a : b);
        // Rotate image so the drawn line aligns to the nearest axis
        // In OpenCV (Y-down), positive angle = counter-clockwise visually
        // We need to rotate by -(lineAngle - nearest) to snap the line to nearest axis
        const rot = -(lineAngle - nearest);
        const M = cv.getRotationMatrix2D(
            new cv.Point(img.matProcessed.cols / 2, img.matProcessed.rows / 2),
            rot, 1
        );
        let tempProcessed = new cv.Mat();
        cv.warpAffine(img.matProcessed, tempProcessed, M, new cv.Size(img.matProcessed.cols, img.matProcessed.rows));
        img.matProcessed.delete();
        img.matProcessed = tempProcessed;

        let tempOriginal = new cv.Mat();
        cv.warpAffine(img.matOriginal, tempOriginal, M, new cv.Size(img.matOriginal.cols, img.matOriginal.rows));
        img.matOriginal.delete();
        img.matOriginal = tempOriginal;
        M.delete();
        img.isRotateMode = false;
        img.rotatePoints = [];
        elements.rotateBtn.classList.remove('active');
        render();
    }

    // --- Utilities ---
    function resetView() {
        const img = getActiveImage();
        if (!img) return;
        const c = elements.canvasContainer;
        img.scale = Math.min(c.clientWidth / img.originalImg.width, c.clientHeight / img.originalImg.height);
        img.offsetX = (c.clientWidth - img.originalImg.width * img.scale) / 2;
        img.offsetY = (c.clientHeight - img.originalImg.height * img.scale) / 2;
    }

    function clearCanvas() {
        const bgCtx = elements.canvasBg.getContext('2d');
        const uiCtx = elements.canvasUi.getContext('2d');
        bgCtx.clearRect(0, 0, elements.canvasBg.width, elements.canvasBg.height);
        uiCtx.clearRect(0, 0, elements.canvasUi.width, elements.canvasUi.height);
        elements.guide.textContent = window.t('weld_guide_init');
    }

    function screenToImage(sx, sy) { 
        const img = getActiveImage();
        return { x: (sx - img.offsetX) / img.scale, y: (sy - img.offsetY) / img.scale }; 
    }
    function imageToScreen(ix, iy) { 
        const img = getActiveImage();
        return { x: ix * img.scale + img.offsetX, y: iy * img.scale + img.offsetY }; 
    }

    function resetMeasurements() {
        const img = getActiveImage();
        if (!img) return;
        img.measurements = { rect: null, root: null, throatPoint: null, calibLine: null, freeShapes: [] };
        img.currentStep = 1;
        resetView();
        updateStepUI(); render();
        updateFreeTable(img);
    }

    function updateFreeTable(img) {
        if (!img) {
            elements.freeTableBody.innerHTML = '';
            return;
        }

        const typeLabels = {
            measure: window.t('weld_tool_meas') || '測定線',
            line: window.t('weld_tool_line') || '直線',
            crosshair: window.t('weld_tool_cross') || '十字線'
        };
        
        // Helper to calculate angle relative to calibration line
        const getAngle = (shape) => {
            if (shape.type === 'crosshair') return 'N/A';
            const dx = shape.p2.x - shape.p1.x;
            const dy = shape.p2.y - shape.p1.y;
            let lineAngle = Math.atan2(dy, dx) * 180 / Math.PI;

            if (img.measurements.calibLine) {
                const cdx = img.measurements.calibLine.p2.x - img.measurements.calibLine.p1.x;
                const cdy = img.measurements.calibLine.p2.y - img.measurements.calibLine.p1.y;
                let calibAngle = Math.atan2(cdy, cdx) * 180 / Math.PI;
                // Relative angle
                let rel = lineAngle - calibAngle;
                // Normalize between 0 and 180
                rel = Math.abs(rel % 180);
                if (rel > 90) rel = 180 - rel;
                return rel.toFixed(1);
            } else {
                // Relative to horizontal
                let rel = Math.abs(lineAngle % 180);
                if (rel > 90) rel = 180 - rel;
                return rel.toFixed(1);
            }
        };

        elements.freeTableBody.innerHTML = img.measurements.freeShapes.map(shape => {
            let lenStr = '-';
            if (shape.type !== 'crosshair') {
                const pxLen = Math.hypot(shape.p2.x - shape.p1.x, shape.p2.y - shape.p1.y);
                if (img.pxPerMm > 0) {
                    lenStr = `${(pxLen / img.pxPerMm).toFixed(2)} mm<br><small class="text-muted">${pxLen.toFixed(1)} px</small>`;
                } else {
                    lenStr = `${pxLen.toFixed(1)} px`;
                }
            }

            return `
                <tr>
                    <td>${typeLabels[shape.type]}</td>
                    <td>${lenStr}</td>
                    <td>${getAngle(shape)}</td>
                    <td><button class="btn-delete-row" data-id="${shape.id}"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
            `;
        }).join('');

        // Attach delete listeners
        elements.freeTableBody.querySelectorAll('.btn-delete-row').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                img.measurements.freeShapes = img.measurements.freeShapes.filter(s => s.id !== id);
                updateFreeTable(img);
                render();
            });
        });
    }

    function updateCrosshair(e) {
        const img = getActiveImage();
        const isFreeCrosshair = appState.workflow === 'free' && appState.freeModeTool === 'crosshair';
        const isStepRoot = appState.workflow === 'step' && img && img.currentStep === 3;

        if (!isFreeCrosshair && !isStepRoot) {
            elements.crosshair.classList.remove('active');
            return;
        }
        const r = elements.canvasContainer.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
            elements.crosshair.classList.add('active');
            const x = e.clientX - r.left; const y = e.clientY - r.top;
            elements.crosshair.style.setProperty('--x', `${x}px`);
            elements.crosshair.style.setProperty('--y', `${y}px`);
            elements.crosshair.innerHTML = `<div style="position:absolute;left:0;top:${y}px;width:100%;height:1px;background:rgba(255,255,255,0.7);box-shadow:0 0 2px #000;"></div><div style="position:absolute;left:${x}px;top:0;width:1px;height:100%;background:rgba(255,255,255,0.7);box-shadow:0 0 2px #000;"></div>`;
        } else elements.crosshair.classList.remove('active');
    }

    function exportImage() {
        const imgState = getActiveImage();
        if (!imgState) return;

        const fullW = imgState.matProcessed ? imgState.matProcessed.cols : imgState.originalImg.width;
        const fullH = imgState.matProcessed ? imgState.matProcessed.rows : imgState.originalImg.height;

        // Determine crop region
        const doCrop = elements.cropOption.checked && imgState.measurements.rect;
        let cropX = 0, cropY = 0, cropW = fullW, cropH = fullH;

        if (doCrop) {
            const r = imgState.measurements.rect;
            const marginX = Math.round(r.w * 1.0);
            const marginY = Math.round(r.h * 1.0);
            cropX = Math.max(0, Math.round(r.x) - marginX);
            cropY = Math.max(0, Math.round(r.y) - marginY);
            cropW = Math.min(fullW - cropX, Math.round(r.w) + marginX * 2);
            cropH = Math.min(fullH - cropY, Math.round(r.h) + marginY * 2);
        }

        // Draw full image + measurements first
        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = fullW;
        fullCanvas.height = fullH;
        const fullCtx = fullCanvas.getContext('2d');
        if (imgState.matProcessed) {
            const temp = document.createElement('canvas'); cv.imshow(temp, imgState.matProcessed); fullCtx.drawImage(temp, 0, 0);
        } else fullCtx.drawImage(imgState.originalImg, 0, 0);

        const oldScale = imgState.scale; const oldOX = imgState.offsetX; const oldOY = imgState.offsetY;
        imgState.scale = 1; imgState.offsetX = 0; imgState.offsetY = 0;
        drawMeasurements(fullCtx, imgState);
        imgState.scale = oldScale; imgState.offsetX = oldOX; imgState.offsetY = oldOY;

        // If cropping, extract the crop region into a new canvas
        let outputCanvas = fullCanvas;
        if (doCrop) {
            outputCanvas = document.createElement('canvas');
            outputCanvas.width = cropW;
            outputCanvas.height = cropH;
            const outCtx = outputCanvas.getContext('2d');
            outCtx.drawImage(fullCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        }

        const date = (elements.attrDate.value || '').replace(/-/g, '');
        const rawParts = [date, elements.attrProduct.value, elements.attrJig.value, elements.attrShift.value, elements.attrTiming.value];
        const parts = rawParts
            .map(s => (s || '').trim().replace(/[\s\/\\]+/g, '_').replace(/[<>:"|?*]/g, ''))
            .filter(Boolean);
            
        const filename = parts.length > 0 ? `${parts.join('_')}.jpg` : 'weld_measurement.jpg';
        
        outputCanvas.toBlob(function(blob) {
            if (!blob) {
                alert(window.t('weld_error_export'));
                return;
            }
            saveAs(blob, filename);
        }, 'image/jpeg', 0.95);
        
        // Save to history
        saveHistory();
    }

    function saveHistory() {
        let h = JSON.parse(localStorage.getItem('weld_history') || '{"products":[], "jigs":[], "shifts":[], "timings":[]}');
        
        const updateArr = (arr, val) => {
            if (val && !arr.includes(val)) arr.unshift(val);
            return arr.slice(0, 10); // keep last 10
        };
        
        h.products = updateArr(h.products || [], elements.attrProduct.value);
        h.jigs = updateArr(h.jigs || [], elements.attrJig.value);
        h.shifts = updateArr(h.shifts || [], elements.attrShift.value);
        h.timings = updateArr(h.timings || [], elements.attrTiming.value);
        
        localStorage.setItem('weld_history', JSON.stringify(h));
        loadHistory();
    }

    function loadHistory() {
        let h = JSON.parse(localStorage.getItem('weld_history') || '{"products":[], "jigs":[], "shifts":[], "timings":[]}');
        elements.productHistory.innerHTML = (h.products || []).map(p => `<option value="${p}">`).join('');
        elements.jigHistory.innerHTML = (h.jigs || []).map(j => `<option value="${j}">`).join('');
        elements.shiftHistory.innerHTML = (h.shifts || []).map(s => `<option value="${s}">`).join('');
        elements.timingHistory.innerHTML = (h.timings || []).map(t => `<option value="${t}">`).join('');
    }

    function debounce(f, w) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => f.apply(this, a), w); }; }

    render();
    } catch (e) {
        console.error("Weld-Blade Initialization Error:", e);
        const guideEl = document.getElementById('weld-guide') || document.body;
        guideEl.innerHTML = `<div style="color: #ef4444; background: rgba(239,68,68,0.1); padding: 10px; border-radius: 4px; border: 1px solid #ef4444; font-family: monospace; font-size: 0.9rem;">[Init Error] ${e.name}: ${e.message}<br>${e.stack.split('\n')[0]}</div>`;
    }
}

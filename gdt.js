// --- GD&T Position Simulator Core ---
// ============================================

let gdtScene, gdtCamera, gdtRenderer, gdtControls;
let gdtGridHelper, gdtAxesGroup;
let gdtHudScene, gdtHudCamera, gdtHudAxesGroup;
let gdtCylinder, gdtBox, gdtMeasLine, gdtMeasDot;
let gdtAutoRotate = true;
const GDT_HEIGHT = 10;

function initGdtSimulator() {
    setupGdtControls();
    
    // Delayed init to ensure DOM layout is resolved and CDN scripts loaded
    setTimeout(() => {
        try {
            initGdtScene();
        } catch (e) {
            console.error('GD&T 3D init error:', e);
        }
        calculateGdt();
    }, 500);
}

function setupGdtControls() {
    const mmcToggle = document.getElementById('gdt-mmc-toggle');
    if (mmcToggle) {
        mmcToggle.addEventListener('change', () => {
            calculateGdt();
        });
    }

    // Input listeners
    const inputs = document.querySelectorAll('.gdt-controls input');
    inputs.forEach(input => {
        input.addEventListener('input', calculateGdt);
    });

    // Random button
    const btnRand = document.getElementById('btn-gdt-random');
    if (btnRand) {
        btnRand.addEventListener('click', () => {
            const t = parseFloat(document.getElementById('gdt-tolerance').value) || 0.5;
            const tedX = parseFloat(document.getElementById('gdt-ted-x').value) || 20;
            const tedY = parseFloat(document.getElementById('gdt-ted-y').value) || 15;
            
            // Randomly push into the corners sometimes
            let dx, dy;
            if (Math.random() < 0.3) {
                // Force corner case (Fail Pos, Pass Box)
                const signX = Math.random() < 0.5 ? 1 : -1;
                const signY = Math.random() < 0.5 ? 1 : -1;
                dx = signX * (t / 2) * 0.95;
                dy = signY * (t / 2) * 0.95;
            } else {
                dx = generateNormalRandom(0, t / 3);
                dy = generateNormalRandom(0, t / 3);
            }
            
            document.getElementById('gdt-actual-x').value = (tedX + dx).toFixed(3);
            document.getElementById('gdt-actual-y').value = (tedY + dy).toFixed(3);
            calculateGdt();
        });
    }
}

function calculateGdt() {
    const tedX = parseFloat(document.getElementById('gdt-ted-x').value) || 0;
    const tedY = parseFloat(document.getElementById('gdt-ted-y').value) || 0;
    const actX = parseFloat(document.getElementById('gdt-actual-x').value) || 0;
    const actY = parseFloat(document.getElementById('gdt-actual-y').value) || 0;
    
    let baseTol = parseFloat(document.getElementById('gdt-tolerance').value) || 0;
    let totalTol = baseTol;
    
    const useMmc = document.getElementById('gdt-mmc-toggle')?.checked || false;
    if (useMmc) {
        const lmc = parseFloat(document.getElementById('gdt-lmc-limit').value) || 0;
        const actHole = parseFloat(document.getElementById('gdt-actual-hole').value) || 0;
        let bonus = actHole - lmc;
        if (bonus < 0) bonus = 0;
        totalTol += bonus;
        
        document.getElementById('gdt-bonus-val').innerText = '+' + bonus.toFixed(3);
        document.getElementById('gdt-total-tol-val').innerText = totalTol.toFixed(3);
    }
    
    const dx = actX - tedX;
    const dy = actY - tedY;
    const posError = 2 * Math.sqrt(dx*dx + dy*dy);
    
    // Evaluate
    const isPassBox = Math.abs(dx) <= totalTol / 2 && Math.abs(dy) <= totalTol / 2;
    const isPassPos = posError <= totalTol;
    
    // UI Updates
    const errEl = document.getElementById('gdt-stat-error');
    if (errEl) {
        errEl.innerText = posError.toFixed(3);
        errEl.style.color = isPassPos ? '#10b981' : '#ef4444';
    }
    const limEl = document.getElementById('gdt-stat-limit');
    if (limEl) limEl.innerText = totalTol.toFixed(3);
    
    // ± stat card
    const pmEl = document.getElementById('gdt-stat-pm');
    if (pmEl) {
        pmEl.innerText = `${dx>=0?'+':''}${dx.toFixed(3)} / ${dy>=0?'+':''}${dy.toFixed(3)}`;
        pmEl.style.color = isPassBox ? '#10b981' : '#ef4444';
    }
    const pmLimEl = document.getElementById('gdt-stat-pm-limit');
    if (pmLimEl) pmLimEl.innerText = (totalTol / 2).toFixed(3);
    
    // GD&T Notation box
    const notationEl = document.getElementById('gdt-notation-content');
    if (notationEl) {
        const mode = gdtDisplayMode;
        let html = '';
        if (mode === 'pos' || mode === 'both') {
            html += `<div style="margin-bottom:4px;">
                <span style="border:1px solid #06b6d4; padding:2px 6px; border-radius:3px; color:#06b6d4;">⌖ ⌀${totalTol.toFixed(3)}</span>
                <span style="margin-left:8px; color:${isPassPos ? '#10b981' : '#ef4444'};">${isPassPos ? '✓ OK' : '✗ NG'}</span>
            </div>`;
        }
        if (mode === 'box' || mode === 'both') {
            html += `<div>
                <span style="color:#ef4444;">X: ${tedX.toFixed(2)} ±${(totalTol/2).toFixed(3)}</span>
                <span style="margin-left:8px; color:${Math.abs(dx) <= totalTol/2 ? '#10b981' : '#ef4444'};">${Math.abs(dx) <= totalTol/2 ? '✓' : '✗'}</span>
            </div>
            <div>
                <span style="color:#ef4444;">Y: ${tedY.toFixed(2)} ±${(totalTol/2).toFixed(3)}</span>
                <span style="margin-left:8px; color:${Math.abs(dy) <= totalTol/2 ? '#10b981' : '#ef4444'};">${Math.abs(dy) <= totalTol/2 ? '✓' : '✗'}</span>
            </div>`;
        }
        notationEl.innerHTML = html;
    }
    
    const alerts = document.getElementById('gdt-alerts');
    if (alerts) {
        alerts.innerHTML = '';
        if (isPassPos && isPassBox) {
            alerts.innerHTML = `<div class="warning-text" style="background: rgba(16, 185, 129, 0.1); border-left-color: #10b981;">
                <i class="fa-solid fa-circle-check" style="color: #10b981;"></i> 
                <span data-i18n="gdt_warn_perfect">合格 (位置度と±公差ともにクリア)</span>
            </div>`;
        } else if (isPassBox && !isPassPos) {
            alerts.innerHTML = `<div class="warning-text" style="background: rgba(251, 191, 36, 0.1); border-left-color: #fbbf24;">
                <i class="fa-solid fa-triangle-exclamation" style="color: #fbbf24;"></i> 
                <span data-i18n="gdt_warn_corner">⚠️ ±公差では四角の領域内ですが、位置度（円外）では不合格です！</span>
            </div>`;
        } else {
            alerts.innerHTML = `<div class="warning-text" style="background: rgba(239, 68, 68, 0.1); border-left-color: #ef4444;">
                <i class="fa-solid fa-xmark" style="color: #ef4444;"></i> 
                <span data-i18n="gdt_warn_fail">不合格 (公差範囲外)</span>
            </div>`;
        }
        
        // Apply translations
        const lang = document.getElementById('lang-select')?.value || 'ja';
        applyTranslation(lang);
    }

    renderGdt2D(dx, dy, baseTol, totalTol, isPassPos, isPassBox);
    updateGdt3DState(dx, dy, totalTol, isPassPos);
    if (typeof renderGdtDrawing === 'function') {
        renderGdtDrawing(dx, dy, baseTol, totalTol, isPassPos, isPassBox, useMmc);
    }
}
// --- Tab System ---
window.switchGdtTab = function(tab) {
    const btn3d = document.getElementById('gdt-tab-btn-3d');
    const btn2d = document.getElementById('gdt-tab-btn-2d');
    const cont3d = document.getElementById('gdt-3d-container');
    const cont2d = document.getElementById('gdt-2d-container');
    const rotateBtn = document.getElementById('gdt-3d-rotate-btn');
    
    if (!btn3d || !btn2d || !cont3d || !cont2d) return;
    
    btn3d.classList.remove('active');
    btn2d.classList.remove('active');
    cont3d.style.display = 'none';
    cont2d.style.display = 'none';
    if (rotateBtn) rotateBtn.style.display = 'none';
    
    if (tab === '3d') {
        btn3d.classList.add('active');
        cont3d.style.display = 'block';
        if (rotateBtn) rotateBtn.style.display = 'block';
        
        if (typeof gdtRenderer !== 'undefined' && gdtRenderer && gdtCamera) {
            const w = cont3d.clientWidth;
            const h = cont3d.clientHeight || 440;
            gdtCamera.aspect = w / h;
            gdtCamera.updateProjectionMatrix();
            gdtRenderer.setSize(w, h);
        }
    } else {
        btn2d.classList.add('active');
        cont2d.style.display = 'flex';
        calculateGdt();
    }
}
window.toggleGdt3dRotate = function() {
    gdtAutoRotate = !gdtAutoRotate;
    if (gdtControls) {
        gdtControls.autoRotate = gdtAutoRotate;
    }
    const icon = document.getElementById('gdt-3d-rotate-icon');
    const text = document.getElementById('gdt-3d-rotate-text');
    if (icon && text) {
        if (gdtAutoRotate) {
            icon.className = 'fa-solid fa-pause';
            text.setAttribute('data-i18n', 'gdt_stop_rot');
        } else {
            icon.className = 'fa-solid fa-play';
            text.setAttribute('data-i18n', 'gdt_start_rot');
        }
        applyTranslation(document.documentElement.lang || 'ja');
    }
}

// --- Display Mode ---
let gdtDisplayMode = 'both'; // 'both', 'pos', 'box'

function setGdtMode(mode) {
    gdtDisplayMode = mode;
    document.querySelectorAll('.gdt-mode-btns .btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('gdt-mode-' + mode);
    if (btn) btn.classList.add('active');
    calculateGdt();
}

// --- 2D Rendering ---
function renderGdt2D(dx, dy, baseTol, totalTol, isPassPos, isPassBox) {
    const canvas = document.getElementById('gdt-2d-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const mode = gdtDisplayMode;
    
    const tedX = parseFloat(document.getElementById('gdt-ted-x').value) || 0;
    const tedY = parseFloat(document.getElementById('gdt-ted-y').value) || 0;
    const actX = parseFloat(document.getElementById('gdt-actual-x').value) || 0;
    const actY = parseFloat(document.getElementById('gdt-actual-y').value) || 0;
    
    ctx.clearRect(0, 0, w, h);
    
    // SCALE: Fixed scale based strictly on the BASE tolerance value
    // This ensures magnification stays constant even if bonus tolerance increases
    const viewSize = Math.max(baseTol, 0.1);
    const scale = Math.min(w, h) * 0.4 / viewSize;
    
    ctx.save();
    
    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    ctx.fillRect(0, 0, w, h);
    
    // Translate to center of canvas = TED POSITION
    ctx.translate(w / 2, h / 2);
    
    // Calculate pivot point for axes (fixed at bottom-left corner)
    const axisPx = -w/2 + 20;
    const axisPy = h/2 - 20;
    
    const axisLen = 60;
    ctx.lineWidth = 2.5;
    // X Axis (Red)
    ctx.strokeStyle = '#ff4444';
    ctx.beginPath();
    ctx.moveTo(axisPx, axisPy); ctx.lineTo(axisPx + axisLen, axisPy);
    ctx.stroke();
    drawArrow2D(ctx, axisPx + axisLen, axisPy, 1, 0);
    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('X', axisPx + axisLen + 6, axisPy + 5);
    
    // Y Axis (Green) - pointing UP (-Y in canvas)
    ctx.strokeStyle = '#44ff44';
    ctx.beginPath();
    ctx.moveTo(axisPx, axisPy); ctx.lineTo(axisPx, axisPy - axisLen);
    ctx.stroke();
    drawArrow2D(ctx, axisPx, axisPy - axisLen, 0, -1);
    ctx.fillStyle = '#44ff44';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Y', axisPx, axisPy - axisLen - 10);

    
    // =============================================
    // CENTER AXES (at TED point)
    // =============================================
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(-w/2, 0); ctx.lineTo(w/2, 0);
    ctx.moveTo(0, -h/2); ctx.lineTo(0, h/2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // TED crosshair
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(-15, 0); ctx.lineTo(15, 0);
    ctx.moveTo(0, -15); ctx.lineTo(0, 15);
    ctx.stroke();
    
    // TED label
    ctx.fillStyle = 'rgba(100, 200, 255, 0.9)';
    ctx.font = 'bold 14px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`TED (${tedX}, ${tedY})`, 12, -12);
    
    // =============================================
    // TOLERANCE ZONES (centered on 0,0 which is TED)
    // =============================================
    // Box Tolerance (±)
    if (mode === 'both' || mode === 'box') {
        const boxSide = baseTol * scale;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.05)';
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.rect(-boxSide/2, -boxSide/2, boxSide, boxSide);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.font = 'bold 14px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`±${(baseTol/2).toFixed(3)}`, 0, -boxSide/2 - 6);

        // Bonus Box (Overall Effective Zone)
        if (totalTol > baseTol) {
            const bSide = totalTol * scale;
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 5]);
            ctx.strokeRect(-bSide/2, -bSide/2, bSide, bSide);
            ctx.setLineDash([]);
            ctx.font = '10px "Courier New"';
            ctx.fillText(`(Total ±${(totalTol/2).toFixed(3)})`, 0, -bSide/2 - 6);
        }
    }
    
    // Position Tolerance Circle (⌀)
    if (mode === 'both' || mode === 'pos') {
        const radius = (baseTol / 2) * scale;
        ctx.fillStyle = 'rgba(6, 184, 212, 0.10)';
        ctx.strokeStyle = 'rgba(6, 184, 212, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(6, 184, 212, 0.9)';
        ctx.font = 'bold 14px "Courier New", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`⌀${baseTol.toFixed(3)}`, radius * 0.7, -radius * 0.7 - 8);

        // Bonus Circle (Overall Effective Zone)
        if (totalTol > baseTol) {
            const bRadius = (totalTol / 2) * scale;
            ctx.strokeStyle = 'rgba(6, 184, 212, 0.5)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(0, 0, bRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.font = '10px "Courier New"';
            ctx.fillText(`(Total ⌀${totalTol.toFixed(3)})`, bRadius * 0.7, -bRadius * 0.7 - 8);
        }
    }
    
    // =============================================
    // MEASUREMENT POINT
    // =============================================
    const px = dx * scale;
    const py = -dy * scale; // Invert Y for canvas
    
    // Dimension lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(px, 0); ctx.lineTo(px, py);
    ctx.moveTo(0, py); ctx.lineTo(px, py);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // ΔX / ΔY labels
    ctx.fillStyle = '#8b99ae';
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`ΔX=${dx.toFixed(3)}`, px/2, py + (py > 0 ? 12 : -5));
    ctx.save();
    ctx.translate(px + (px > 0 ? 12 : -12), py/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillText(`ΔY=${dy.toFixed(3)}`, 0, 0);
    ctx.restore();
    
    // Measured point dot
    let dotColor = isPassPos ? '#10b981' : '#ef4444';
    if (isPassBox && !isPassPos) dotColor = '#fbbf24';
    
    ctx.shadowColor = dotColor;
    ctx.shadowBlur = 10;
    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    ctx.fillStyle = '#fff';
    ctx.font = '9px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`(${actX.toFixed(2)}, ${actY.toFixed(2)})`, px + 10, py - 8);
    
    ctx.restore();
}

// Helper: calculate nice tick step
function calculateTickStep(maxVal) {
    const raw = maxVal / 4;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    if (norm < 2) return mag;
    if (norm < 5) return 2 * mag;
    return 5 * mag;
}

// Helper: draw small arrowhead
function drawArrow2D(ctx, x, y, dirX, dirY) {
    const size = 5;
    ctx.save();
    ctx.fillStyle = '#8b99ae';
    ctx.beginPath();
    ctx.moveTo(x, y);
    // Base points should be moved backwards from direction
    if (dirX !== 0) {
        ctx.lineTo(x - dirX * size, y - size/2);
        ctx.lineTo(x - dirX * size, y + size/2);
    } else {
        ctx.lineTo(x - size/2, y - dirY * size);
        ctx.lineTo(x + size/2, y - dirY * size);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// --- 3D Rendering (Three.js) ---

// Helper: create text sprite for axis labels
function createAxisLabel(text, x, y, z, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color || '#ffffff';
    ctx.font = 'bold 24px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 32, 16);
    
    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(x, y, z);
    sprite.scale.set(0.8, 0.4, 1);
    return sprite;
}

// --- Blueprint Drawing View ---
function renderGdtDrawing(dx, dy, baseTol, totalTol, isPassPos, isPassBox, useMmc) {
    const canvas = document.getElementById('gdt-drawing-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const mode = gdtDisplayMode;
    
    const tedX = parseFloat(document.getElementById('gdt-ted-x').value) || 0;
    const tedY = parseFloat(document.getElementById('gdt-ted-y').value) || 0;
    
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    
    // Blueprint style background
    ctx.fillStyle = '#0f172a'; // dark blueprint look
    ctx.fillRect(0, 0, w, h);
    
    // Drawing scale: Fit Origin (0,0) and TED
    const margin = 50;
    const drawW = w - margin * 2;
    const drawH = h - margin * 2;
    
    const maxX = Math.max(tedX, 1) * 1.2;
    const maxY = Math.max(tedY, 1) * 1.2;
    const scale = Math.min(drawW / maxX, drawH / maxY);
    
    // Origin at bottom-left corner of the drawing area
    const ox = margin;
    const oy = h - margin;
    
    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i=0; i<w; i+=20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let i=0; i<h; i+=20) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
    
    ctx.translate(ox, oy);
    
    // Axis indicator
    ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 2; // X
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(40, 0); ctx.stroke();
    ctx.strokeStyle = '#44ff44'; // Y
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -40); ctx.stroke();
    drawArrow2D(ctx, 40, 0, 1, 0);
    drawArrow2D(ctx, 0, -40, 0, -1);
    ctx.fillStyle = '#fff'; ctx.font = '12px "Inter"'; ctx.fillText('X', 45, 4); ctx.fillText('Y', -4, -45);
    
    // TED position
    const tx = tedX * scale;
    const ty = -tedY * scale;
    
    // Center lines for Hole
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.setLineDash([15, 5, 2, 5]);
    ctx.beginPath();
    ctx.moveTo(tx - 30, ty); ctx.lineTo(tx + 30, ty);
    ctx.moveTo(tx, ty - 30); ctx.lineTo(tx, ty + 30);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw hole basic circle
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(tx, ty, 15, 0, Math.PI*2);
    ctx.stroke();
    
    // Dimensions from origin
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    // X dimension
    ctx.beginPath(); ctx.moveTo(0, 20); ctx.lineTo(tx, 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tx, ty + 15); ctx.lineTo(tx, 25); ctx.stroke();
    drawArrow2D(ctx, 0, 20, -1, 0); drawArrow2D(ctx, tx, 20, 1, 0);
    
    // Y dimension
    ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-20, ty); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-25, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tx - 15, ty); ctx.lineTo(-25, ty); ctx.stroke();
    drawArrow2D(ctx, -20, 0, 0, 1); drawArrow2D(ctx, -20, ty, 0, -1);
    
    // Text labels
    ctx.fillStyle = '#10b981'; // distinct color for dimension text
    ctx.font = '14px "Courier New"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (mode === 'box') {
        const halfTol = (baseTol / 2).toFixed(3);
        // Horizontal dim text ABOVE the line (y = 20, closer to part means y = 10)
        ctx.fillText(`${tedX.toFixed(2)} ±${halfTol}`, tx / 2, 10);
        // Vertical dim text LEFT of the line (x = -20, left means x = -34)
        ctx.save(); ctx.translate(-34, ty / 2); ctx.rotate(-Math.PI/2);
        ctx.fillText(`${tedY.toFixed(2)} ±${halfTol}`, 0, 0); ctx.restore();
    } else {
        const drawBasicDim = (val, xc, yc, rot) => {
            ctx.save(); ctx.translate(xc, yc); ctx.rotate(rot);
            const text = val.toFixed(2);
            const tw = ctx.measureText(text).width;
            ctx.strokeRect(-tw/2 - 4, -8, tw + 8, 16);
            ctx.fillText(text, 0, 1);
            ctx.restore();
        };
        // Horizontal TED dim: text ABOVE the line (y = 20, closer to part means smaller y or negative?)
        // In this coordinate system, y=0 is bottom part, y=20 is dimension line below it.
        // To be "above" the line (between part and line), use y=10.
        drawBasicDim(tedX, tx / 2, 10, 0);
        // Vertical TED dim: text LEFT of the line (x = -20)
        // To be "left" of the line (further from part), use x=-34.
        drawBasicDim(tedY, -34, ty / 2, -Math.PI/2);
    }
    
    // Feature Control Frame (FCF) with datums - Only for Position mode
    if (mode === 'both' || mode === 'pos') {
        // Feature Control Frame (FCF) with datums
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#fff';
        
        // Calculate FCF size: symbol(25) + tol(60) + datumA(25) + datumB(25) = 135
        const fcfW = 160;
        const fcfH = 20;
        
        // Auto-position: prefer top-right of hole, clamp to drawing area
        let fcfX = tx + 25;
        let fcfY = ty - 50;
        
        // Clamp to keep within canvas (relative to origin ox, oy)
        const canvasRight = w - ox - 10;
        const canvasTop = -(oy - 10);
        if (fcfX + fcfW > canvasRight) fcfX = canvasRight - fcfW;
        if (fcfY < canvasTop) fcfY = canvasTop;
        if (fcfX < 10) fcfX = 10;
        
        // Leader line from hole to FCF
        ctx.beginPath();
        ctx.moveTo(tx + 10.6, ty - 10.6);
        ctx.lineTo(fcfX, fcfY + fcfH / 2);
        ctx.stroke();
        
        // FCF outline
        ctx.strokeRect(fcfX, fcfY, fcfW, fcfH);
        // Dividers: symbol | tol | A | B
        const col1 = fcfX + 25;
        const col2 = col1 + 65;
        const col3 = col2 + 35;
        ctx.beginPath();
        ctx.moveTo(col1, fcfY); ctx.lineTo(col1, fcfY + fcfH);
        ctx.moveTo(col2, fcfY); ctx.lineTo(col2, fcfY + fcfH);
        ctx.moveTo(col3, fcfY); ctx.lineTo(col3, fcfY + fcfH);
        ctx.stroke();
        
        // Position symbol crosshair in first cell
        const symCx = fcfX + 12.5;
        const symCy = fcfY + fcfH / 2;
        ctx.beginPath(); ctx.arc(symCx, symCy, 6, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(symCx, fcfY + 2); ctx.lineTo(symCx, fcfY + fcfH - 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(fcfX + 4, symCy); ctx.lineTo(col1 - 4, symCy); ctx.stroke();
        
        // Tolerance value (show BASE tolerance, not total, per standard notation)
        ctx.textAlign = 'center';
        const tolText = `⌀${baseTol.toFixed(3)}`;
        ctx.fillText(tolText, col1 + 25, fcfY + fcfH / 2 + 1);
        
        if (useMmc) {
            // Draw MMC (M in circle) symbol to the right of the tolerance value
            const tw = ctx.measureText(tolText).width;
            const mcX = col1 + 25 + tw/2 + 12;
            const mcY = fcfY + fcfH / 2;
            ctx.beginPath(); ctx.arc(mcX, mcY, 7, 0, Math.PI*2); ctx.stroke();
            ctx.font = 'bold 10px "Inter"';
            ctx.fillText('M', mcX, mcY + 1);
            ctx.font = '14px "Courier New"'; // restore font for later dims if any
        }
        
        // Datum A
        ctx.fillText('A', col2 + 17.5, fcfY + fcfH / 2 + 1);
        
        // Datum B
        ctx.fillText('B', col3 + (fcfX + fcfW - col3) / 2, fcfY + fcfH / 2 + 1);
    }
    
    ctx.restore();
}

function initGdtScene() {
    const container = document.getElementById('gdt-3d-container');
    if (!container || typeof THREE === 'undefined') {
        console.warn('GD&T: THREE.js not loaded or container not found');
        return;
    }
    
    container.innerHTML = ''; // Clear prev
    
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 400;
    
    gdtScene = new THREE.Scene();
    gdtScene.background = new THREE.Color(document.documentElement.getAttribute('data-theme') === 'dark' ? 0x111827 : 0xf8fafc);
    
    gdtCamera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    gdtCamera.position.set(6, 4, 6);
    gdtCamera.lookAt(0, 0, 0);
    
    gdtRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    gdtRenderer.setSize(w, h);
    gdtRenderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(gdtRenderer.domElement);
    
    // OrbitControls may not be loaded — handle gracefully
    if (THREE.OrbitControls) {
        gdtControls = new THREE.OrbitControls(gdtCamera, gdtRenderer.domElement);
        gdtControls.enableDamping = true;
        gdtControls.dampingFactor = 0.05;
        gdtControls.autoRotate = true;
        gdtControls.autoRotateSpeed = 1.0;
    } else {
        console.warn('GD&T: OrbitControls not available — camera is static');
        gdtControls = null;
    }
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    gdtScene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    gdtScene.add(dirLight);

    // Grid (Datum A) - sized to surround the hole
    gdtGridHelper = new THREE.GridHelper(8, 8, 0x888888, 0x444444);
    gdtScene.add(gdtGridHelper);
    
    // HUD Compass (Top Right)
    gdtHudScene = new THREE.Scene();
    gdtHudCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    gdtHudCamera.position.set(0, 0, 5);
    gdtHudAxesGroup = new THREE.Group();
    gdtHudScene.add(gdtHudAxesGroup);

    // X axis (Red)
    const xAxisGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0)]);
    gdtHudAxesGroup.add(new THREE.Line(xAxisGeo, new THREE.LineBasicMaterial({ color: 0xff4444, linewidth: 2 })));
    gdtHudAxesGroup.add(createAxisLabel('X', 1.2, 0, 0, 0xff4444));

    // Y axis (Green, mapping to -Z in 3D for consistency)
    const yAxisGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,-1)]);
    gdtHudAxesGroup.add(new THREE.Line(yAxisGeo, new THREE.LineBasicMaterial({ color: 0x44ff44, linewidth: 2 })));
    gdtHudAxesGroup.add(createAxisLabel('Y', 0, 0, -1.2, 0x44ff44));

    // Z axis (Blue, Height)
    const zAxisGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0)]);
    gdtHudAxesGroup.add(new THREE.Line(zAxisGeo, new THREE.LineBasicMaterial({ color: 0x4488ff, linewidth: 2 })));
    gdtHudAxesGroup.add(createAxisLabel('Z', 0, 1.2, 0, 0x4488ff));

    
    // Group for dynamic meshes
    const materialEnv = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.25,
        roughness: 0.3,
        metalness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const materialBox = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.12,
        wireframe: false,
        side: THREE.DoubleSide
    });
    
    // Setup placeholder meshes (geometries will be regenerated on update)
    gdtCylinder = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, GDT_HEIGHT, 32), materialEnv);
    gdtBox = new THREE.Mesh(new THREE.BoxGeometry(2, GDT_HEIGHT, 2), materialBox);
    const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2, GDT_HEIGHT, 2));
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.4 });
    gdtBox.add(new THREE.LineSegments(edgeGeo, edgeMat));
    
    // Start slightly above grid so it visually sits on the datum
    gdtCylinder.position.y = GDT_HEIGHT / 2;
    gdtBox.position.y = GDT_HEIGHT / 2;
    
    gdtScene.add(gdtCylinder);
    gdtScene.add(gdtBox);
    
    // Measured Line Axis
    const lineMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 3 });
    const points = [new THREE.Vector3(0,0,0), new THREE.Vector3(0, GDT_HEIGHT, 0)];
    gdtMeasLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMat);
    gdtScene.add(gdtMeasLine);
    
    // Measured Point Dot on Datum
    const dotGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    gdtMeasDot = new THREE.Mesh(dotGeo, dotMat);
    gdtScene.add(gdtMeasDot);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        if (gdtControls) gdtControls.update();
        
        // Dynamically update background if theme changed
        if (gdtScene) {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            gdtScene.background.set(isDark ? 0x111827 : 0xf8fafc);
        }
        if (gdtRenderer && gdtScene && gdtCamera) {
            gdtRenderer.autoClear = false;
            gdtRenderer.clear();
            gdtRenderer.render(gdtScene, gdtCamera);
            
            // Sync HUD compass and render
            if (gdtHudCamera && gdtHudScene) {
                // Keep HUD compass synced with main camera
                gdtHudAxesGroup.quaternion.copy(gdtCamera.quaternion).invert();
                
                const w = gdtRenderer.domElement.clientWidth;
                const h = gdtRenderer.domElement.clientHeight;
                const hudSize = 80;
                // Render in top right corner (x = w - size - margin, y = h - size - margin)
                gdtRenderer.setViewport(w - hudSize - 10, h - hudSize - 10, hudSize, hudSize);
                gdtRenderer.render(gdtHudScene, gdtHudCamera);
                
                // Reset viewport
                gdtRenderer.setViewport(0, 0, w, h);
            }
        }
    }
    animate();
    
    // Responsive
    window.addEventListener('resize', () => {
        if (document.getElementById('gdt-3d-container') && gdtCamera) {
            const nw = container.clientWidth;
            const nh = container.clientHeight;
            gdtCamera.aspect = nw / nh;
            gdtCamera.updateProjectionMatrix();
            gdtRenderer.setSize(nw, nh);
        }
    });
    
    // Delayed resize to fix initial container height not being computed
    setTimeout(() => {
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        if (nw > 0 && nh > 0 && gdtCamera) {
            gdtCamera.aspect = nw / nh;
            gdtCamera.updateProjectionMatrix();
            gdtRenderer.setSize(nw, nh);
        }
    }, 100);
}

function updateGdt3DState(dx, dy, tol, isPassPos) {
    if (!gdtScene || !gdtCylinder) return;
    
    const tedX = parseFloat(document.getElementById('gdt-ted-x').value) || 0;
    const tedY = parseFloat(document.getElementById('gdt-ted-y').value) || 0;
    const actX = parseFloat(document.getElementById('gdt-actual-x').value) || 0;
    const actY = parseFloat(document.getElementById('gdt-actual-y').value) || 0;
    
    const mode = gdtDisplayMode;
    // Scale: dynamically scale so the tolerance zone is always roughly the same size in 3D!
    const S = 2.0 / Math.max(tol, 0.05); 
    const radius = Math.max((tol / 2) * S, 0.1);
    const boxSide = Math.max(tol * S, 0.2);
    
    // TED position in 3D: X stays, Y(3D) is height, Z = -tedY (2D Y maps to negative 3D Z)
    const tedPx = tedX * S;
    const tedPz = -tedY * S;
    
    // Show/hide based on mode
    gdtCylinder.visible = (mode === 'both' || mode === 'pos');
    gdtBox.visible = (mode === 'both' || mode === 'box');
    
    // Rebuild Cylinder at TED position
    gdtCylinder.geometry.dispose();
    gdtCylinder.geometry = new THREE.CylinderGeometry(radius, radius, GDT_HEIGHT, 32);
    gdtCylinder.position.set(tedPx, GDT_HEIGHT / 2, tedPz);
    
    // Rebuild Box at TED position
    gdtBox.geometry.dispose();
    gdtBox.children[0].geometry.dispose();
    const newBoxGeo = new THREE.BoxGeometry(boxSide, GDT_HEIGHT, boxSide);
    gdtBox.geometry = newBoxGeo;
    gdtBox.children[0].geometry = new THREE.EdgesGeometry(newBoxGeo);
    gdtBox.position.set(tedPx, GDT_HEIGHT / 2, tedPz);
    
    // Actual measurement in absolute position
    const actPx = actX * S;
    const actPz = -actY * S;
    
    const pts = [new THREE.Vector3(actPx, 0, actPz), new THREE.Vector3(actPx, GDT_HEIGHT, actPz)];
    gdtMeasLine.geometry.setFromPoints(pts);
    gdtMeasDot.position.set(actPx, 0, actPz);
    
    // Update Color based on current mode's pass status
    const isPassBox = Math.abs(dx) <= tol / 2 && Math.abs(dy) <= tol / 2;
    let colorHex;
    if (mode === 'pos') {
        colorHex = isPassPos ? 0x10b981 : 0xef4444;
    } else if (mode === 'box') {
        colorHex = isPassBox ? 0x10b981 : 0xef4444;
    } else {
        colorHex = (isPassPos && isPassBox) ? 0x10b981 : (isPassBox && !isPassPos) ? 0xfbbf24 : 0xef4444;
    }
    gdtMeasLine.material.color.setHex(colorHex);
    gdtMeasDot.material.color.setHex(colorHex);
    
    // Smart axes placement logic removed: replaced by HUD compass
    
    // Center the grid on the hole position
    if (gdtGridHelper) {
        gdtGridHelper.position.set(tedPx, 0, tedPz);
    }
    
    // Adjust camera to look at TED area 
    if (gdtControls) {
        const oldTarget = gdtControls.target.clone();
        gdtControls.target.set(tedPx, GDT_HEIGHT / 3, tedPz);
        // Pan camera rigidly with the hole to preserve user zoom
        const delta = gdtControls.target.clone().sub(oldTarget);
        gdtCamera.position.add(delta);
    }
}


// --- GD&T Position Simulator Core ---
// ============================================

let gdtScene, gdtCamera, gdtRenderer, gdtControls;
let gdtGridHelper, gdtAxesGroup, gdtPartGroup;
let gdtHudScene, gdtHudCamera, gdtHudAxesGroup;
let gdtCylinder, gdtBonusCylinder, gdtBox, gdtMeasPin, gdtMeasDot, gdtStatusRing;
let gdtAutoRotate = true;
let gdtAnimId = null;
let gdtResizeHandler = null;
let gdtIsDragging2D = false;
let gdt2DLastScale = 100;
const GDT_HEIGHT = 8;

// Standard Fasteners Database (JIS B 1001 / ISO 273 / ASME B18.2.8 Clearance Holes)
const GDT_FASTENER_DB = {
    M3_C:    { name: 'M3×0.5 (並目)',    majorDia: 3.00,  pitch: 'P0.5',   holes: { fine: 3.20,  medium: 3.40,  coarse: 3.60 } },
    M4_C:    { name: 'M4×0.7 (並目)',    majorDia: 4.00,  pitch: 'P0.7',   holes: { fine: 4.30,  medium: 4.50,  coarse: 4.80 } },
    M5_C:    { name: 'M5×0.8 (並目)',    majorDia: 5.00,  pitch: 'P0.8',   holes: { fine: 5.30,  medium: 5.50,  coarse: 5.80 } },
    M6_C:    { name: 'M6×1.0 (並目)',    majorDia: 6.00,  pitch: 'P1.0',   holes: { fine: 6.40,  medium: 6.60,  coarse: 7.00 } },
    M8_C:    { name: 'M8×1.25 (並目)',   majorDia: 8.00,  pitch: 'P1.25',  holes: { fine: 8.40,  medium: 9.00,  coarse: 10.00 } },
    M10_C:   { name: 'M10×1.5 (並目)',   majorDia: 10.00, pitch: 'P1.5',   holes: { fine: 10.50, medium: 11.00, coarse: 12.00 } },
    M12_C:   { name: 'M12×1.75 (並目)',  majorDia: 12.00, pitch: 'P1.75',  holes: { fine: 13.00, medium: 13.50, coarse: 14.50 } },
    M16_C:   { name: 'M16×2.0 (並目)',   majorDia: 16.00, pitch: 'P2.0',   holes: { fine: 17.00, medium: 17.50, coarse: 18.50 } },
    M8_F:    { name: 'M8×1.0 (細目)',    majorDia: 8.00,  pitch: 'P1.0',   holes: { fine: 8.40,  medium: 9.00,  coarse: 10.00 } },
    M10_F:   { name: 'M10×1.25 (細目)',  majorDia: 10.00, pitch: 'P1.25',  holes: { fine: 10.50, medium: 11.00, coarse: 12.00 } },
    M12_F:   { name: 'M12×1.25 (細目)',  majorDia: 12.00, pitch: 'P1.25',  holes: { fine: 12.50, medium: 13.50, coarse: 14.50 } },
    M16_F:   { name: 'M16×1.5 (細目)',   majorDia: 16.00, pitch: 'P1.5',   holes: { fine: 16.50, medium: 17.50, coarse: 18.50 } },
    UNC_1_4: { name: '1/4"-20 UNC',      majorDia: 6.35,  pitch: '20 TPI', holes: { fine: 6.75,  medium: 7.14,  coarse: 7.94 } },
    UNC_5_16:{ name: '5/16"-18 UNC',     majorDia: 7.94,  pitch: '18 TPI', holes: { fine: 8.33,  medium: 8.73,  coarse: 9.53 } },
    UNC_3_8: { name: '3/8"-16 UNC',      majorDia: 9.53,  pitch: '16 TPI', holes: { fine: 9.92,  medium: 10.32, coarse: 11.11 } },
    UNC_1_2: { name: '1/2"-13 UNC',      majorDia: 12.70, pitch: '13 TPI', holes: { fine: 13.49, medium: 14.29, coarse: 15.08 } },
    UNF_1_4: { name: '1/4"-28 UNF',      majorDia: 6.35,  pitch: '28 TPI', holes: { fine: 6.75,  medium: 7.14,  coarse: 7.94 } },
    UNF_5_16:{ name: '5/16"-24 UNF',     majorDia: 7.94,  pitch: '24 TPI', holes: { fine: 8.33,  medium: 8.73,  coarse: 9.53 } },
    UNF_3_8: { name: '3/8"-24 UNF',      majorDia: 9.53,  pitch: '24 TPI', holes: { fine: 9.92,  medium: 10.32, coarse: 11.11 } },
    UNF_1_2: { name: '1/2"-20 UNF',      majorDia: 12.70, pitch: '20 TPI', holes: { fine: 13.49, medium: 14.29, coarse: 15.08 } }
};

function applyFastenerSelection() {
    const boltKey = document.getElementById('gdt-bolt-select')?.value || 'M10_C';
    if (boltKey === 'CUSTOM') return;
    const spec = GDT_FASTENER_DB[boltKey];
    if (!spec) return;

    const series = document.getElementById('gdt-hole-series')?.value || 'medium';
    const fType = document.getElementById('gdt-fastener-type')?.value || 'fixed';

    const recHole = spec.holes[series] || spec.holes.medium;
    const clearance = Math.max(0.05, recHole - spec.majorDia);
    const reqTol = fType === 'floating' ? (clearance / 2) : clearance;

    const lmcEl = document.getElementById('gdt-lmc-limit');
    const actHoleEl = document.getElementById('gdt-actual-hole');
    const tolEl = document.getElementById('gdt-tolerance');

    if (lmcEl) lmcEl.value = recHole.toFixed(2);
    if (actHoleEl) actHoleEl.value = (recHole + 0.15).toFixed(2);
    if (tolEl) tolEl.value = reqTol.toFixed(2);

    const summaryEl = document.getElementById('gdt-bolt-spec-summary');
    if (summaryEl) {
        const seriesName = series === 'fine' ? '1級(精)' : series === 'medium' ? '2級(中)' : '3級(粗)';
        const formulaStr = fType === 'floating' ? 'T=(H-F)/2' : 'T=H-F';
        summaryEl.innerHTML = `${spec.name}: 軸最大 <strong>⌀${spec.majorDia.toFixed(2)}</strong> / ${seriesName}推奨穴 <strong>⌀${recHole.toFixed(2)}</strong> → 許容位置度 <strong>⌀${reqTol.toFixed(2)}</strong> (${formulaStr})`;
    }
}

function initGdtSimulator() {
    setupGdtControls();
    setupGdtPresets();
    setupGdt2DDrag();
    applyFastenerSelection();

    setTimeout(() => {
        try { initGdtScene(); } catch (e) { console.error('GD&T 3D init error:', e); }
        calculateGdt();
    }, 150);
}

function setupGdtPresets() {
    const btns = document.querySelectorAll('[data-gdt-preset]');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const p = btn.getAttribute('data-gdt-preset');
            const tedX = parseFloat(document.getElementById('gdt-ted-x').value) || 20;
            const tedY = parseFloat(document.getElementById('gdt-ted-y').value) || 15;
            const t = parseFloat(document.getElementById('gdt-tolerance').value) || 0.5;
            const mmcEl = document.getElementById('gdt-mmc-toggle');

            if (p === 'center') {
                if (mmcEl) mmcEl.checked = false;
                setGdtMode('both');
                document.getElementById('gdt-actual-x').value = (tedX + 0.06).toFixed(2);
                document.getElementById('gdt-actual-y').value = (tedY - 0.04).toFixed(2);
            } else if (p === 'corner') {
                if (mmcEl) mmcEl.checked = false;
                setGdtMode('both');
                document.getElementById('gdt-actual-x').value = (tedX + t * 0.45).toFixed(2);
                document.getElementById('gdt-actual-y').value = (tedY + t * 0.45).toFixed(2);
            } else if (p === 'mmc_bonus') {
                if (mmcEl) mmcEl.checked = true;
                const mmcHoleVal = parseFloat(document.getElementById('gdt-lmc-limit')?.value) || 11.0;
                document.getElementById('gdt-actual-hole').value = (mmcHoleVal + 0.25).toFixed(2);
                setGdtMode('both');
                document.getElementById('gdt-actual-x').value = (tedX + t * 0.44).toFixed(2);
                document.getElementById('gdt-actual-y').value = (tedY + t * 0.40).toFixed(2);
            } else if (p === 'fail') {
                if (mmcEl) mmcEl.checked = false;
                setGdtMode('both');
                document.getElementById('gdt-actual-x').value = (tedX + t * 0.65).toFixed(2);
                document.getElementById('gdt-actual-y').value = (tedY - t * 0.55).toFixed(2);
            }
            calculateGdt();
        });
    });
}

function setupGdt2DDrag() {
    const canvas = document.getElementById('gdt-2d-canvas');
    if (!canvas) return;

    const updateFromPointer = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const scaleRatio = 800 / (rect.width || 800);
        const px = (clientX - cx) * scaleRatio;
        const py = (clientY - cy) * scaleRatio;
        const dx = px / (gdt2DLastScale || 100);
        const dy = -py / (gdt2DLastScale || 100);
        const tedX = parseFloat(document.getElementById('gdt-ted-x').value) || 0;
        const tedY = parseFloat(document.getElementById('gdt-ted-y').value) || 0;
        document.getElementById('gdt-actual-x').value = (tedX + dx).toFixed(3);
        document.getElementById('gdt-actual-y').value = (tedY + dy).toFixed(3);
        calculateGdt();
    };

    canvas.addEventListener('pointerdown', (e) => {
        gdtIsDragging2D = true;
        canvas.setPointerCapture(e.pointerId);
        updateFromPointer(e.clientX, e.clientY);
    });
    canvas.addEventListener('pointermove', (e) => {
        if (!gdtIsDragging2D) return;
        updateFromPointer(e.clientX, e.clientY);
    });
    canvas.addEventListener('pointerup', () => { gdtIsDragging2D = false; });
    canvas.addEventListener('pointercancel', () => { gdtIsDragging2D = false; });
}

function setupGdtControls() {
    const mmcToggle = document.getElementById('gdt-mmc-toggle');
    if (mmcToggle) {
        mmcToggle.addEventListener('change', () => {
            calculateGdt();
        });
    }

    // Fastener standard & fit series listeners
    ['gdt-bolt-select', 'gdt-hole-series', 'gdt-fastener-type'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', () => {
                applyFastenerSelection();
                // Keep actual X/Y deviation reasonable relative to the new tolerance
                const tedX = parseFloat(document.getElementById('gdt-ted-x').value) || 20;
                const tedY = parseFloat(document.getElementById('gdt-ted-y').value) || 15;
                const newTol = parseFloat(document.getElementById('gdt-tolerance').value) || 0.5;
                document.getElementById('gdt-actual-x').value = (tedX + newTol * 0.25).toFixed(2);
                document.getElementById('gdt-actual-y').value = (tedY + newTol * 0.20).toFixed(2);
                calculateGdt();
            });
        }
    });

    // Input listeners
    const inputs = document.querySelectorAll('.gdt-controls input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            // If user manually edits tolerance or MMC hole limit, update summary notice
            if (input.id === 'gdt-tolerance' || input.id === 'gdt-lmc-limit') {
                const summaryEl = document.getElementById('gdt-bolt-spec-summary');
                const mmcH = parseFloat(document.getElementById('gdt-lmc-limit')?.value) || 11.0;
                const tolV = parseFloat(document.getElementById('gdt-tolerance')?.value) || 1.0;
                const fType = document.getElementById('gdt-fastener-type')?.value || 'fixed';
                const pinD = Math.max(0.1, mmcH - (fType === 'floating' ? 2 * tolV : tolV));
                if (summaryEl) {
                    summaryEl.innerHTML = `手動設定: 相手軸最大 <strong>⌀${pinD.toFixed(2)}</strong> / 最小穴 <strong>⌀${mmcH.toFixed(2)}</strong> → 基本位置度 <strong>⌀${tolV.toFixed(2)}</strong>`;
                }
            }
            calculateGdt();
        });
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

    let baseTol = parseFloat(document.getElementById('gdt-tolerance').value) || 0.5;
    let totalTol = baseTol;
    let bonus = 0;

    const mmcHole = parseFloat(document.getElementById('gdt-lmc-limit')?.value) || 10.0;
    const actHole = parseFloat(document.getElementById('gdt-actual-hole')?.value) || 10.15;
    const boltKey = document.getElementById('gdt-bolt-select')?.value || 'M10_C';
    const fType = document.getElementById('gdt-fastener-type')?.value || 'fixed';
    const vcPinDia = (boltKey !== 'CUSTOM' && GDT_FASTENER_DB[boltKey])
        ? GDT_FASTENER_DB[boltKey].majorDia
        : Math.max(0.1, mmcHole - (fType === 'floating' ? 2 * baseTol : baseTol));

    const useMmc = document.getElementById('gdt-mmc-toggle')?.checked || false;
    if (useMmc) {
        bonus = Math.max(0, actHole - mmcHole);
        totalTol += bonus;
    }

    const vcEl = document.getElementById('gdt-vc-pin-val');
    if (vcEl) vcEl.innerText = '⌀' + vcPinDia.toFixed(3);
    const bEl = document.getElementById('gdt-bonus-val');
    const tEl = document.getElementById('gdt-total-tol-val');
    if (bEl) bEl.innerText = useMmc ? ('+' + bonus.toFixed(3)) : '+0.000 (ⓂOFF)';
    if (tEl) tEl.innerText = '⌀' + totalTol.toFixed(3);

    const dx = actX - tedX;
    const dy = actY - tedY;
    const radialDev = Math.sqrt(dx * dx + dy * dy);
    const posError = 2 * radialDev;

    const mode = gdtDisplayMode;
    const boxHalfTol = mode === 'inscribed' ? (totalTol / (2 * Math.SQRT2)) : (totalTol / 2);
    const isPassBox = Math.abs(dx) <= boxHalfTol && Math.abs(dy) <= boxHalfTol;
    const isPassPos = posError <= totalTol;

    // Physical Mating Check: Min radial clearance between actual hole wall and mating bolt
    // Effective max radial offset allowed at MMC = baseTol/2; plus bonus/2 as hole grows
    const effTotalClearanceDia = baseTol + Math.max(0, actHole - mmcHole);
    const minWallClearance = (effTotalClearanceDia - posError) / 2;
    const explainEl = document.getElementById('gdt-mating-explain');
    if (explainEl) {
        if (actHole < mmcHole) {
            explainEl.style.background = 'rgba(225, 29, 72, 0.14)';
            explainEl.style.borderLeftColor = 'var(--accent-danger)';
            explainEl.innerHTML = `<strong>✗ 穴径不足 (NG):</strong> 実測穴径 (⌀${actHole.toFixed(2)}) が最小許容径 (MMC ⌀${mmcHole.toFixed(2)}) を下回っています。`;
        } else if (minWallClearance >= -1e-6) {
            if (useMmc && posError > baseTol) {
                explainEl.style.background = 'rgba(245, 158, 11, 0.15)';
                explainEl.style.borderLeftColor = '#f59e0b';
                explainEl.innerHTML = `<strong>Ⓜ ボーナス救済で締結OK!</strong> 基本公差(⌀${baseTol.toFixed(2)})は超えていますが、穴が +${bonus.toFixed(2)}mm 大きく加工されたため、中心にある相手ボルト(⌀${vcPinDia.toFixed(2)})と干渉せず通ります（最小隙間: <strong>${Math.max(0, minWallClearance).toFixed(3)}mm</strong>）。`;
            } else if (!useMmc && posError > baseTol) {
                explainEl.style.background = 'rgba(245, 158, 11, 0.15)';
                explainEl.style.borderLeftColor = '#f59e0b';
                explainEl.innerHTML = `<strong>💡 物理的にはボルトが通ります!</strong> 穴が大きいため相手ボルト(⌀${vcPinDia.toFixed(2)})との隙間は <strong>+${minWallClearance.toFixed(3)}mm</strong> 残っています。「MMC 適用 (Ⓜ)」をONにするとボーナス公差(+${(actHole - mmcHole).toFixed(3)})で合格にできます。`;
            } else {
                explainEl.style.background = 'rgba(13, 148, 136, 0.12)';
                explainEl.style.borderLeftColor = 'var(--accent-actual)';
                explainEl.innerHTML = `<strong>🔩 締結OK (ボルト貫通):</strong> 理想位置(TED)の相手ボルト(⌀${vcPinDia.toFixed(2)})に対して穴壁が干渉せず通過します（片側最小クリアランス: <strong>+${Math.max(0, minWallClearance).toFixed(3)}mm</strong>）。`;
            }
        } else {
            explainEl.style.background = 'rgba(225, 29, 72, 0.14)';
            explainEl.style.borderLeftColor = 'var(--accent-danger)';
            explainEl.innerHTML = `<strong>💥 ボルト干渉 (締結不可):</strong> 穴位置のズレが大きすぎ、理想位置の相手ボルト(⌀${vcPinDia.toFixed(2)})に穴壁が <strong>${Math.abs(minWallClearance).toFixed(3)}mm</strong> 干渉して通りません！`;
        }
    }

    // Update top KPI cards
    const errEl = document.getElementById('gdt-stat-error');
    if (errEl) {
        errEl.innerText = posError.toFixed(3);
        errEl.style.color = isPassPos ? 'var(--accent-actual)' : 'var(--accent-danger)';
    }
    const limEl = document.getElementById('gdt-stat-limit');
    if (limEl) limEl.innerText = totalTol.toFixed(3);

    const pmEl = document.getElementById('gdt-stat-pm');
    if (pmEl) {
        pmEl.innerText = `${dx >= 0 ? '+' : ''}${dx.toFixed(3)} / ${dy >= 0 ? '+' : ''}${dy.toFixed(3)}`;
        pmEl.style.color = isPassBox ? 'var(--accent-actual)' : 'var(--accent-danger)';
    }
    const pmLimEl = document.getElementById('gdt-stat-pm-limit');
    if (pmLimEl) pmLimEl.innerText = boxHalfTol.toFixed(3);

    const verdictEl = document.getElementById('gdt-stat-verdict');
    const verdictDescEl = document.getElementById('gdt-stat-verdict-desc');
    const cardStatus = document.getElementById('gdt-card-status');
    if (verdictEl && verdictDescEl && cardStatus) {
        if (isPassPos && isPassBox) {
            verdictEl.innerText = '✓ 合格 (OK)';
            verdictEl.style.color = 'var(--accent-actual)';
            verdictDescEl.innerText = '位置度・±公差ともに許容範囲内';
            cardStatus.style.borderTop = '4px solid var(--accent-actual)';
        } else if (!isPassBox && isPassPos) {
            verdictEl.innerText = '✓ 位置度合格 (57%拡大域)';
            verdictEl.style.color = 'var(--accent-actual)';
            verdictDescEl.innerText = '内接±公差は超過だが位置度円で救済';
            cardStatus.style.borderTop = '4px solid var(--accent-actual)';
        } else if (isPassBox && !isPassPos) {
            verdictEl.innerText = '⚠️ 位置度NG (角部)';
            verdictEl.style.color = 'var(--accent-warn)';
            verdictDescEl.innerText = '±四角内だが円形公差からはみ出し';
            cardStatus.style.borderTop = '4px solid var(--accent-warn)';
        } else {
            verdictEl.innerText = '✗ 不合格 (NG)';
            verdictEl.style.color = 'var(--accent-danger)';
            verdictDescEl.innerText = '許容公差領域を超過';
            cardStatus.style.borderTop = '4px solid var(--accent-danger)';
        }
    }

    // JIS/ISO Feature Control Frame HTML
    const notationEl = document.getElementById('gdt-notation-content');
    if (notationEl) {
        const mmcSymbol = useMmc ? ' <span style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border:1.5px solid currentColor;border-radius:50%;font-size:0.7rem;">M</span>' : '';
        notationEl.innerHTML = `
            <div class="fcf-frame-strip">
                <span class="fcf-cell">⌖</span>
                <span class="fcf-cell" style="color:var(--primary-color);">⌀${baseTol.toFixed(2)}${mmcSymbol}</span>
                <span class="fcf-cell">A</span>
                <span class="fcf-cell">B</span>
                <span class="fcf-cell">C</span>
            </div>
            <div style="margin-top:6px; font-size:0.78rem; color:var(--text-muted); font-family:var(--font-mono);">
                TED: [${tedX.toFixed(2)}, ${tedY.toFixed(2)}] | ±Tol: ±${boxHalfTol.toFixed(3)}
            </div>
        `;
    }

    renderGdt2D(dx, dy, baseTol, totalTol, isPassPos, isPassBox);
    updateGdt3DState(dx, dy, baseTol, totalTol, isPassPos, isPassBox);
    if (typeof renderGdtDrawing === 'function') {
        renderGdtDrawing(dx, dy, baseTol, totalTol, isPassPos, isPassBox, useMmc);
    }
}

window.switchGdtTab = function(tab) {
    const btn3d = document.getElementById('gdt-tab-btn-3d');
    const btn2d = document.getElementById('gdt-tab-btn-2d');
    const cont3d = document.getElementById('gdt-3d-container');
    const cont2d = document.getElementById('gdt-2d-container');
    const hud = document.getElementById('gdt-3d-hud');
    const hint = document.getElementById('gdt-tab-hint');

    if (!btn3d || !btn2d || !cont3d || !cont2d) return;

    btn3d.classList.remove('active');
    btn2d.classList.remove('active');
    cont3d.style.display = 'none';
    cont2d.style.display = 'none';
    if (hud) hud.style.display = 'none';

    if (tab === '3d') {
        btn3d.classList.add('active');
        cont3d.style.display = 'block';
        if (hud) hud.style.display = 'flex';
        if (hint) hint.innerHTML = '<i class="fa-solid fa-arrows-up-down-left-right"></i> ドラッグで3D回転';
        if (gdtRenderer && gdtCamera) {
            const w = cont3d.clientWidth || 600;
            const h = cont3d.clientHeight || 460;
            gdtCamera.aspect = w / h;
            gdtCamera.updateProjectionMatrix();
            gdtRenderer.setSize(w, h);
        }
    } else {
        btn2d.classList.add('active');
        cont2d.style.display = 'flex';
        if (hint) hint.innerHTML = '<i class="fa-solid fa-hand-pointer"></i> 測定点を直接ドラッグ可能';
        calculateGdt();
    }
};

window.setGdtCameraView = function(view) {
    if (!gdtCamera || !gdtControls) return;
    gdtAutoRotate = false;
    gdtControls.autoRotate = false;
    const icon = document.getElementById('gdt-3d-rotate-icon');
    if (icon) icon.className = 'fa-solid fa-play';

    const t = gdtControls.target;
    if (view === 'iso') {
        gdtCamera.position.set(t.x + 6, t.y + 5, t.z + 6);
    } else if (view === 'top') {
        gdtCamera.position.set(t.x, t.y + 11, t.z + 0.01);
    } else if (view === 'front') {
        gdtCamera.position.set(t.x, t.y, t.z + 10);
    }
    gdtControls.update();
};
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
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    const tedX = parseFloat(document.getElementById('gdt-ted-x').value) || 0;
    const tedY = parseFloat(document.getElementById('gdt-ted-y').value) || 0;
    const actX = parseFloat(document.getElementById('gdt-actual-x').value) || 0;
    const actY = parseFloat(document.getElementById('gdt-actual-y').value) || 0;

    ctx.clearRect(0, 0, w, h);

    const viewSize = Math.max(baseTol, 0.1);
    const scale = Math.min(w, h) * 0.36 / viewSize;
    gdt2DLastScale = scale;

    ctx.save();
    ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    ctx.translate(w / 2, h / 2);

    // Subtle Polar Grid Rings
    ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(100, 116, 139, 0.14)';
    ctx.lineWidth = 1;
    for (let rStep = 0.25; rStep <= 1.25; rStep += 0.25) {
        ctx.beginPath();
        ctx.arc(0, 0, (baseTol / 2) * scale * rStep * 2, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Center Axes through TED
    ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.28)' : 'rgba(100, 116, 139, 0.3)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0);
    ctx.moveTo(0, -h / 2); ctx.lineTo(0, h / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Box Tolerance (±)
    if (mode === 'both' || mode === 'inscribed' || mode === 'box') {
        const factor = mode === 'inscribed' ? (1 / Math.SQRT2) : 1;
        const boxSide = baseTol * factor * scale;
        ctx.fillStyle = 'rgba(225, 29, 72, 0.06)';
        ctx.strokeStyle = 'rgba(225, 29, 72, 0.75)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.rect(-boxSide / 2, -boxSide / 2, boxSide, boxSide);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#e11d48';
        ctx.font = '600 14px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        const labelVal = (baseTol * factor / 2).toFixed(3);
        ctx.fillText(mode === 'inscribed' ? `内接 ±${labelVal}` : `±${labelVal}`, 0, -boxSide / 2 - 8);
    }

    // Position Tolerance Circle (⌀)
    if (mode !== 'box') {
        const radius = (baseTol / 2) * scale;
        ctx.fillStyle = 'rgba(20, 184, 166, 0.10)';
        ctx.strokeStyle = '#0d9488';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? '#2dd4bf' : '#0d9488';
        ctx.font = '700 15px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`⌀${baseTol.toFixed(3)}`, radius * 0.72, -radius * 0.72 - 8);

        // MMC Bonus Circle
        if (totalTol > baseTol) {
            const bRadius = (totalTol / 2) * scale;
            ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.arc(0, 0, bRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#f59e0b';
            ctx.font = '600 13px "JetBrains Mono", monospace';
            ctx.fillText(`Ⓜ 実効 ⌀${totalTol.toFixed(3)}`, bRadius * 0.72, -bRadius * 0.72 - 8);
        }
    }

    // TED Center Marker
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-12, 0); ctx.lineTo(12, 0);
    ctx.moveTo(0, -12); ctx.lineTo(0, 12);
    ctx.stroke();
    ctx.fillStyle = isDark ? '#818cf8' : '#4f46e5';
    ctx.font = '600 13px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`TED (${tedX.toFixed(2)}, ${tedY.toFixed(2)})`, 10, 20);

    // Measured Point & Vector
    const px = dx * scale;
    const py = -dy * scale;

    // Radial vector from TED to Measured Point
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(px, py);
    ctx.stroke();

    // ΔX / ΔY projection lines
    ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.45)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(px, 0); ctx.lineTo(px, py);
    ctx.moveTo(0, py); ctx.lineTo(px, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // Measured point dot (draggable target)
    let dotColor = isPassPos ? '#14b8a6' : '#e11d48';
    if (isPassBox && !isPassPos) dotColor = '#f59e0b';

    // Outer halo for drag affordance
    ctx.fillStyle = dotColor + '33';
    ctx.beginPath();
    ctx.arc(px, py, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(px, py, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Coordinate pill label
    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`(${actX.toFixed(2)}, ${actY.toFixed(2)})`, px + 14, py - 10);
    ctx.font = '500 12px "JetBrains Mono", monospace';
    ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
    ctx.fillText(`ΔX:${dx >= 0 ? '+' : ''}${dx.toFixed(3)} ΔY:${dy >= 0 ? '+' : ''}${dy.toFixed(3)}`, px + 14, py + 8);

    ctx.restore();

    // --- Mini Mating Bolt & Hole Cross-Section Inset (Bottom-Right Corner) ---
    const mmcHole = parseFloat(document.getElementById('gdt-lmc-limit')?.value) || 10.0;
    const actHole = parseFloat(document.getElementById('gdt-actual-hole')?.value) || 10.15;
    const boltKey = document.getElementById('gdt-bolt-select')?.value || 'M10_C';
    const fType = document.getElementById('gdt-fastener-type')?.value || 'fixed';
    const vcPinDia = (boltKey !== 'CUSTOM' && GDT_FASTENER_DB[boltKey])
        ? GDT_FASTENER_DB[boltKey].majorDia
        : Math.max(0.1, mmcHole - (fType === 'floating' ? 2 * baseTol : baseTol));
    const radialDev = Math.sqrt(dx * dx + dy * dy);
    const effTotalClearanceDia = baseTol + Math.max(0, actHole - mmcHole);
    const minWallClearance = effTotalClearanceDia / 2 - radialDev;
    const isMatingOk = minWallClearance >= -1e-6 && actHole >= mmcHole;

    const insetW = 225;
    const insetH = 195;
    const ix = w - insetW - 14;
    const iy = h - insetH - 14;

    ctx.save();
    ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.90)' : 'rgba(255, 255, 255, 0.92)';
    ctx.strokeStyle = isMatingOk ? 'rgba(20, 184, 166, 0.65)' : 'rgba(225, 29, 72, 0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(ix, iy, insetW, insetH, 10);
    } else {
        ctx.rect(ix, iy, insetW, insetH);
    }
    ctx.fill();
    ctx.stroke();

    // Title
    const boltSpecName = (GDT_FASTENER_DB[boltKey] && GDT_FASTENER_DB[boltKey].name) || 'ボルト';
    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.font = '700 11.5px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🔩 ${boltSpecName} 締結断面`, ix + 12, iy + 20);

    const icx = ix + insetW / 2;
    const icy = iy + 95;
    // Exaggerate clearance difference relative to pin so user clearly sees the gap
    const pinDrawR = 36;
    const mag = 36 / Math.max(baseTol, 0.25); // visual magnification for gap/deviation
    const holeDrawR = Math.min(68, Math.max(24, pinDrawR + (effTotalClearanceDia / 2) * mag));
    const mmcHoleDrawR = Math.min(68, Math.max(24, pinDrawR + (baseTol / 2) * mag));

    const unitX = radialDev > 1e-6 ? (dx / radialDev) : 0;
    const unitY = radialDev > 1e-6 ? (-dy / radialDev) : 0;
    const shiftPx = radialDev * mag;
    const hcx = icx + unitX * shiftPx;
    const hcy = icy + unitY * shiftPx;

    // Workpiece background shading around hole
    ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.14)' : 'rgba(100, 116, 139, 0.15)';
    ctx.beginPath();
    ctx.arc(hcx, hcy, holeDrawR + 12, 0, Math.PI * 2);
    ctx.fill();

    // Actual Drilled Hole (White/Dark bore interior)
    ctx.fillStyle = isDark ? '#090d16' : '#f1f5f9';
    ctx.strokeStyle = isMatingOk ? '#14b8a6' : '#e11d48';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(hcx, hcy, holeDrawR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Dashed reference: MMC minimum hole size
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(hcx, hcy, mmcHoleDrawR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Fixed Mating Bolt / Gage Pin at True Position (icx, icy)
    ctx.fillStyle = isMatingOk ? 'rgba(245, 158, 11, 0.85)' : 'rgba(225, 29, 72, 0.85)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(icx, icy, pinDrawR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bolt head hex/crosshair mark
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(icx - 8, icy); ctx.lineTo(icx + 8, icy);
    ctx.moveTo(icx, icy - 8); ctx.lineTo(icx, icy + 8);
    ctx.stroke();

    // Caption at bottom of inset
    ctx.font = '700 11.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = isMatingOk ? (isDark ? '#2dd4bf' : '#0d9488') : '#e11d48';
    const gapLabel = minWallClearance >= 0
        ? `✓ ボルト貫通OK (最小隙間 +${minWallClearance.toFixed(3)})`
        : `✗ ボルト干渉NG (食い込み ${minWallClearance.toFixed(3)})`;
    ctx.fillText(gapLabel, icx, iy + insetH - 24);

    ctx.font = '500 10.5px "JetBrains Mono", monospace';
    ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
    ctx.fillText(`穴⌀${actHole.toFixed(2)} vs 相手軸⌀${vcPinDia.toFixed(2)}`, icx, iy + insetH - 9);
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

// Helper: create text sprite for axis/datum labels
function createAxisLabel(text, x, y, z, color, scaleW, scaleH) {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 48;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = typeof color === 'number' ? '#' + color.toString(16).padStart(6, '0') : (color || '#ffffff');
    ctx.font = 'bold 26px "JetBrains Mono", Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 80, 24);
    
    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(x, y, z);
    sprite.scale.set(scaleW || 0.9, scaleH || 0.35, 1);
    return sprite;
}

// Helper: build a realistic machined aluminum block with an actual cylindrical through-hole
function createWorkpieceWithHoleGeometry(blockSize, height, holeCenterX, holeCenterZ, holeRadius) {
    const half = blockSize / 2;
    const bev = 0.25; // corner bevel on outer block
    const shape = new THREE.Shape();
    shape.moveTo(-half + bev, -half);
    shape.lineTo(half - bev, -half);
    shape.lineTo(half, -half + bev);
    shape.lineTo(half, half - bev);
    shape.lineTo(half - bev, half);
    shape.lineTo(-half + bev, half);
    shape.lineTo(-half, half - bev);
    shape.lineTo(-half, -half + bev);
    shape.closePath();

    // Clamp hole inside block so geometry never self-intersects
    const safeR = Math.min(Math.max(holeRadius, 0.35), half * 0.68);
    const maxOffset = half - safeR - 0.35;
    const hx = Math.max(-maxOffset, Math.min(maxOffset, holeCenterX));
    // Note: rotateX(-PI/2) maps shape Y -> 3D -Z, so to place hole at +holeCenterZ in 3D, shape Y is -holeCenterZ
    const hy = Math.max(-maxOffset, Math.min(maxOffset, -holeCenterZ));

    const holePath = new THREE.Path();
    holePath.absarc(hx, hy, safeR, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    const extrudeSettings = {
        depth: height,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.06,
        bevelThickness: 0.06,
        curveSegments: 48
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.rotateX(-Math.PI / 2);
    return { geo, safeR, clampedX: hx, clampedZ: -hy };
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
    if (mode === 'both' || mode === 'pos' || mode === 'inscribed') {
        // Feature Control Frame (FCF) with datums
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#fff';
        
        // Calculate FCF size: symbol(25) + tol(65) + datumA(35) + datumB(35) = 160
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

        // Hole size callout above FCF (e.g. ⌀11.0 +0.3/0  [M10 2級キリ])
        const mmcHoleDraw = parseFloat(document.getElementById('gdt-lmc-limit')?.value) || 11.0;
        const boltKeyDraw = document.getElementById('gdt-bolt-select')?.value || 'M10_C';
        const boltSpecDraw = GDT_FASTENER_DB[boltKeyDraw];
        const holeCallout = boltSpecDraw
            ? `⌀${mmcHoleDraw.toFixed(2)} +0.3/0 (${boltSpecDraw.name}用穴)`
            : `⌀${mmcHoleDraw.toFixed(2)} +0.3/0`;
        ctx.save();
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.fillText(holeCallout, fcfX, fcfY - 8);
        ctx.restore();
        
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
    
    if (gdtAnimId) {
        cancelAnimationFrame(gdtAnimId);
        gdtAnimId = null;
    }
    if (gdtRenderer) {
        try { gdtRenderer.dispose(); } catch (e) {}
        gdtRenderer = null;
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
    
    // Studio CAD Lighting
    const hemiLight = new THREE.HemisphereLight(0xf8fafc, 0x334155, 0.75);
    gdtScene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
    dirLight.position.set(12, 22, 14);
    gdtScene.add(dirLight);
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    rimLight.position.set(-12, 10, -10);
    gdtScene.add(rimLight);

    // Grid (Datum A) - sized to surround the workpiece
    gdtGridHelper = new THREE.GridHelper(10, 10, 0x64748b, 0x334155);
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

    // Machined Workpiece Group (Aluminum block with a real bored through-hole + Datum A/B/C rails)
    gdtPartGroup = new THREE.Group();
    const blockSize = 7.4;
    const initPart = createWorkpieceWithHoleGeometry(blockSize, GDT_HEIGHT, 0, 0, 1.65);

    const blockMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.44,
        roughness: 0.32,
        metalness: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const blockMesh = new THREE.Mesh(initPart.geo, blockMat);
    blockMesh.name = 'workpieceBody';

    const blockEdgeMat = new THREE.LineBasicMaterial({ color: 0xcbd5e1, transparent: true, opacity: 0.55 });
    const blockEdges = new THREE.LineSegments(new THREE.EdgesGeometry(initPart.geo, 22), blockEdgeMat);
    blockEdges.name = 'workpieceEdges';
    blockMesh.add(blockEdges);
    gdtPartGroup.add(blockMesh);

    // Machined inner bore wall (highlights the actual drilled hole surface)
    const boreWallGeo = new THREE.CylinderGeometry(initPart.safeR, initPart.safeR, GDT_HEIGHT, 48, 1, true);
    const boreWallMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        transparent: true,
        opacity: 0.55,
        roughness: 0.2,
        metalness: 0.75,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const boreWallMesh = new THREE.Mesh(boreWallGeo, boreWallMat);
    boreWallMesh.name = 'boreWall';
    boreWallMesh.position.set(0, GDT_HEIGHT / 2, 0);
    gdtPartGroup.add(boreWallMesh);

    // Top & bottom chamfer rings on the drilled hole
    const boreRingGeo = new THREE.RingGeometry(initPart.safeR * 0.98, initPart.safeR * 1.07, 48);
    const boreRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.75 });
    const topBoreRing = new THREE.Mesh(boreRingGeo, boreRingMat);
    topBoreRing.name = 'topBoreRing';
    topBoreRing.rotation.x = -Math.PI / 2;
    topBoreRing.position.set(0, GDT_HEIGHT + 0.065, 0);
    gdtPartGroup.add(topBoreRing);

    const botBoreRing = new THREE.Mesh(boreRingGeo.clone(), boreRingMat);
    botBoreRing.name = 'botBoreRing';
    botBoreRing.rotation.x = -Math.PI / 2;
    botBoreRing.position.set(0, 0.01, 0);
    gdtPartGroup.add(botBoreRing);

    // Datum Reference Rails (Datum A base plate + Datum B/C reference stops)
    const datumRailMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.35, metalness: 0.4, transparent: true, opacity: 0.85 });
    const railB = new THREE.Mesh(new THREE.BoxGeometry(blockSize, 0.22, 0.22), datumRailMat);
    railB.position.set(0, 0.11, blockSize / 2 + 0.12);
    gdtPartGroup.add(railB);
    gdtPartGroup.add(createAxisLabel('[Datum B]', 0, 0.55, blockSize / 2 + 0.35, '#38bdf8', 1.5, 0.45));

    const datumRailCMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.35, metalness: 0.4, transparent: true, opacity: 0.85 });
    const railC = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, blockSize), datumRailCMat);
    railC.position.set(-blockSize / 2 - 0.12, 0.11, 0);
    gdtPartGroup.add(railC);
    gdtPartGroup.add(createAxisLabel('[Datum C]', -blockSize / 2 - 0.45, 0.55, 0, '#34d399', 1.5, 0.45));
    gdtPartGroup.add(createAxisLabel('[Datum A (底面)]', blockSize / 2 - 1.1, 0.35, -blockSize / 2 - 0.35, '#94a3b8', 1.8, 0.45));

    // Nominal TED Center Crosshair Line (Ideal hole axis in cyan dashed style)
    const tedAxisPts = [new THREE.Vector3(0, -0.4, 0), new THREE.Vector3(0, GDT_HEIGHT + 0.9, 0)];
    const tedAxisMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.85 });
    const tedAxisLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(tedAxisPts), tedAxisMat);
    gdtPartGroup.add(tedAxisLine);
    gdtPartGroup.add(createAxisLabel('TED (理想中心)', 0, GDT_HEIGHT + 1.45, 0, '#06b6d4', 1.6, 0.42));

    // Mating Bolt / Gage Pin at True Position (TED) — visualizes why MMC bonus tolerance allows assembly!
    const matingPinGroup = new THREE.Group();
    matingPinGroup.name = 'matingPinGroup';
    const boltShaftMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        transparent: true,
        opacity: 0.38,
        roughness: 0.25,
        metalness: 0.75,
        depthWrite: false
    });
    const boltShaft = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, GDT_HEIGHT + 0.6, 48), boltShaftMat);
    boltShaft.name = 'boltShaft';
    boltShaft.position.set(0, GDT_HEIGHT / 2 + 0.1, 0);
    matingPinGroup.add(boltShaft);

    // Hex Bolt Head on top of the mating shaft
    const boltHeadMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.55,
        roughness: 0.3,
        metalness: 0.65,
        depthWrite: false
    });
    const boltHead = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 0.55, 6), boltHeadMat);
    boltHead.name = 'boltHead';
    boltHead.position.set(0, GDT_HEIGHT + 0.65, 0);
    const boltHeadEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(boltHead.geometry),
        new THREE.LineBasicMaterial({ color: 0xfde68a, transparent: true, opacity: 0.75 })
    );
    boltHead.add(boltHeadEdges);
    matingPinGroup.add(boltHead);
    gdtPartGroup.add(matingPinGroup);

    gdtScene.add(gdtPartGroup);

    const materialEnv = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.28,
        roughness: 0.25,
        metalness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const materialBonus = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.20,
        roughness: 0.3,
        metalness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const materialBox = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.14,
        wireframe: false,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    
    // Setup placeholder meshes (geometries will be regenerated on update)
    gdtCylinder = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, GDT_HEIGHT, 48), materialEnv);
    gdtBonusCylinder = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, GDT_HEIGHT, 48), materialBonus);
    gdtBonusCylinder.visible = false;

    gdtBox = new THREE.Mesh(new THREE.BoxGeometry(2, GDT_HEIGHT, 2), materialBox);
    const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2, GDT_HEIGHT, 2));
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.45 });
    gdtBox.add(new THREE.LineSegments(edgeGeo, edgeMat));
    
    // Start slightly above grid so it visually sits on the datum
    gdtCylinder.position.y = GDT_HEIGHT / 2;
    gdtBonusCylinder.position.y = GDT_HEIGHT / 2;
    gdtBox.position.y = GDT_HEIGHT / 2;
    
    gdtScene.add(gdtCylinder);
    gdtScene.add(gdtBonusCylinder);
    gdtScene.add(gdtBox);
    
    // Measured 3D Cylindrical Pin Axis (replaces 1px WebGL line)
    const pinGeo = new THREE.CylinderGeometry(0.06, 0.06, GDT_HEIGHT + 0.6, 20);
    const pinMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.2,
        metalness: 0.3,
        emissive: 0x10b981,
        emissiveIntensity: 0.25
    });
    gdtMeasPin = new THREE.Mesh(pinGeo, pinMat);
    gdtMeasPin.position.y = GDT_HEIGHT / 2;
    gdtScene.add(gdtMeasPin);
    
    // Measured Point Sphere + Status Ring on Datum Plane
    const dotGeo = new THREE.SphereGeometry(0.16, 20, 20);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    gdtMeasDot = new THREE.Mesh(dotGeo, dotMat);
    gdtScene.add(gdtMeasDot);

    const ringGeo = new THREE.RingGeometry(0.24, 0.32, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    gdtStatusRing = new THREE.Mesh(ringGeo, ringMat);
    gdtStatusRing.rotation.x = -Math.PI / 2;
    gdtStatusRing.position.y = 0.02;
    gdtScene.add(gdtStatusRing);
    
    // Animation loop
    function animate() {
        if (!document.getElementById('gdt-3d-container')) {
            gdtAnimId = null;
            return;
        }
        gdtAnimId = requestAnimationFrame(animate);
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
    
    // Responsive (single managed listener)
    if (gdtResizeHandler) {
        window.removeEventListener('resize', gdtResizeHandler);
    }
    gdtResizeHandler = () => {
        const curContainer = document.getElementById('gdt-3d-container');
        if (curContainer && gdtCamera && gdtRenderer) {
            const nw = curContainer.clientWidth;
            const nh = curContainer.clientHeight;
            if (nw > 0 && nh > 0) {
                gdtCamera.aspect = nw / nh;
                gdtCamera.updateProjectionMatrix();
                gdtRenderer.setSize(nw, nh);
            }
        }
    };
    window.addEventListener('resize', gdtResizeHandler);
    
    // Delayed resize to fix initial container height not being computed
    setTimeout(() => {
        if (gdtResizeHandler) gdtResizeHandler();
    }, 100);
}

function updateGdt3DState(dx, dy, baseTol, totalTol, isPassPos, isPassBox) {
    if (!gdtScene || !gdtCylinder) return;
    
    const tedX = parseFloat(document.getElementById('gdt-ted-x').value) || 0;
    const tedY = parseFloat(document.getElementById('gdt-ted-y').value) || 0;
    const actX = parseFloat(document.getElementById('gdt-actual-x').value) || 0;
    const actY = parseFloat(document.getElementById('gdt-actual-y').value) || 0;
    
    const mode = gdtDisplayMode;
    // Scale: dynamically scale so the tolerance zone is always roughly the same size in 3D
    const S = 2.0 / Math.max(totalTol, 0.05); 
    const baseRadius = Math.max((baseTol / 2) * S, 0.08);
    const totalRadius = Math.max((totalTol / 2) * S, 0.1);
    const boxSide = mode === 'inscribed'
        ? Math.max((totalTol / Math.SQRT2) * S, 0.15)
        : Math.max(totalTol * S, 0.2);
    
    // TED position in 3D: X stays, Y(3D) is height, Z = -tedY (2D Y maps to negative 3D Z)
    const tedPx = tedX * S;
    const tedPz = -tedY * S;
    
    // Show/hide based on mode
    gdtCylinder.visible = (mode === 'both' || mode === 'pos' || mode === 'inscribed');
    gdtBox.visible = (mode === 'both' || mode === 'box' || mode === 'inscribed');
    if (gdtBonusCylinder) {
        gdtBonusCylinder.visible = gdtCylinder.visible && (totalTol > baseTol + 1e-5);
        if (gdtBonusCylinder.visible) {
            gdtBonusCylinder.geometry.dispose();
            gdtBonusCylinder.geometry = new THREE.CylinderGeometry(totalRadius, totalRadius, GDT_HEIGHT, 48);
            gdtBonusCylinder.position.set(tedPx, GDT_HEIGHT / 2, tedPz);
        }
    }
    
    // Rebuild Base Cylinder at TED position
    gdtCylinder.geometry.dispose();
    gdtCylinder.geometry = new THREE.CylinderGeometry(baseRadius, baseRadius, GDT_HEIGHT, 48);
    gdtCylinder.position.set(tedPx, GDT_HEIGHT / 2, tedPz);
    
    // Rebuild Box at TED position
    gdtBox.geometry.dispose();
    gdtBox.children[0].geometry.dispose();
    const newBoxGeo = new THREE.BoxGeometry(boxSide, GDT_HEIGHT, boxSide);
    gdtBox.geometry = newBoxGeo;
    gdtBox.children[0].geometry = new THREE.EdgesGeometry(newBoxGeo);
    gdtBox.position.set(tedPx, GDT_HEIGHT / 2, tedPz);

    if (gdtPartGroup) {
        gdtPartGroup.position.set(tedPx, 0, tedPz);

        // Compute visual hole & mating bolt radii so physical clearance is 100% consistent with tolerance S
        const mmcHole = parseFloat(document.getElementById('gdt-lmc-limit')?.value) || 10.0;
        const actHole = parseFloat(document.getElementById('gdt-actual-hole')?.value) || 10.15;
        const radialDev = Math.sqrt(dx * dx + dy * dy);
        const effTotalClearanceDia = baseTol + Math.max(0, actHole - mmcHole);
        const minWallClearance = effTotalClearanceDia / 2 - radialDev;
        const isMatingOk = minWallClearance >= -1e-6 && actHole >= mmcHole;

        const pinVisR = 1.15; // Fixed visual radius for the Virtual Condition mating bolt at TED
        const holeVisR = Math.min(2.45, Math.max(0.55, pinVisR + (effTotalClearanceDia / 2) * S));
        const relHoleX = dx * S;
        const relHoleZ = -dy * S;

        const blockSize = 7.4;
        const updatedPart = createWorkpieceWithHoleGeometry(blockSize, GDT_HEIGHT, relHoleX, relHoleZ, holeVisR);

        const bodyMesh = gdtPartGroup.getObjectByName('workpieceBody');
        if (bodyMesh) {
            bodyMesh.geometry.dispose();
            bodyMesh.geometry = updatedPart.geo;
            const edgesObj = bodyMesh.getObjectByName('workpieceEdges');
            if (edgesObj) {
                edgesObj.geometry.dispose();
                edgesObj.geometry = new THREE.EdgesGeometry(updatedPart.geo, 22);
            }
        }

        const boreWall = gdtPartGroup.getObjectByName('boreWall');
        if (boreWall) {
            boreWall.geometry.dispose();
            boreWall.geometry = new THREE.CylinderGeometry(updatedPart.safeR, updatedPart.safeR, GDT_HEIGHT, 48, 1, true);
            boreWall.position.set(updatedPart.clampedX, GDT_HEIGHT / 2, updatedPart.clampedZ);
            boreWall.material.color.setHex(isMatingOk ? 0xe2e8f0 : 0xfda4af);
        }

        const topRing = gdtPartGroup.getObjectByName('topBoreRing');
        const botRing = gdtPartGroup.getObjectByName('botBoreRing');
        if (topRing && botRing) {
            topRing.geometry.dispose();
            botRing.geometry.dispose();
            const newRingGeo = new THREE.RingGeometry(updatedPart.safeR * 0.98, updatedPart.safeR * 1.07, 48);
            topRing.geometry = newRingGeo;
            botRing.geometry = newRingGeo.clone();
            topRing.position.set(updatedPart.clampedX, GDT_HEIGHT + 0.065, updatedPart.clampedZ);
            botRing.position.set(updatedPart.clampedX, 0.01, updatedPart.clampedZ);
            topRing.material.color.setHex(isMatingOk ? 0x38bdf8 : 0xf43f5e);
        }

        const boltShaft = gdtPartGroup.getObjectByName('boltShaft');
        const boltHead = gdtPartGroup.getObjectByName('boltHead');
        if (boltShaft && boltHead) {
            boltShaft.material.color.setHex(isMatingOk ? 0xd97706 : 0xe11d48);
            boltHead.material.color.setHex(isMatingOk ? 0xf59e0b : 0xf43f5e);
        }
    }
    
    // Actual measurement in absolute position
    const actPx = actX * S;
    const actPz = -actY * S;
    
    if (gdtMeasPin) {
        gdtMeasPin.position.set(actPx, GDT_HEIGHT / 2, actPz);
    }
    if (gdtMeasDot) {
        gdtMeasDot.position.set(actPx, 0.05, actPz);
    }
    if (gdtStatusRing) {
        gdtStatusRing.position.set(actPx, 0.02, actPz);
    }
    
    // Update Color based on current mode's pass status
    let colorHex;
    if (mode === 'pos') {
        colorHex = isPassPos ? 0x10b981 : 0xef4444;
    } else if (mode === 'box') {
        colorHex = isPassBox ? 0x10b981 : 0xef4444;
    } else if (mode === 'inscribed') {
        colorHex = (isPassPos && isPassBox) ? 0x10b981 : (isPassPos && !isPassBox) ? 0x06b6d4 : 0xef4444;
    } else {
        colorHex = (isPassPos && isPassBox) ? 0x10b981 : (isPassBox && !isPassPos) ? 0xfbbf24 : 0xef4444;
    }
    if (gdtMeasPin) {
        gdtMeasPin.material.color.setHex(colorHex);
        gdtMeasPin.material.emissive.setHex(colorHex);
    }
    if (gdtMeasDot) gdtMeasDot.material.color.setHex(colorHex);
    if (gdtStatusRing) gdtStatusRing.material.color.setHex(colorHex);
    
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


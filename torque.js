// --- Torque Unit Converter Core (N·m ⇄ lb·ft) ---
// Accurate physical constants:
// 1 lb = 0.45359237 kg * 9.80665 m/s² = 4.4482216152605 N
// 1 ft = 0.3048 m
// 1 lb·ft = 1.3558179483314004 N·m
// 1 N·m = 1 / 1.3558179483314004 ≈ 0.7375621492772654 lb·ft
const NM_TO_LBFT = 1 / 1.3558179483314004;
const LBFT_TO_NM = 1.3558179483314004;
const NM_TO_INLB = NM_TO_LBFT * 12; // 1 lb·ft = 12 in·lb
const NM_TO_KGFM = 1 / 9.80665;
const NM_TO_KGFCM = 1 / 0.0980665;

let torqueState = {
    nm: 30,
    swapped: false,
    decimals: 2
};

function initTorqueConverter() {
    const inputNm = document.getElementById('torque-input-nm');
    const inputLbft = document.getElementById('torque-input-lbft');
    if (!inputNm || !inputLbft) return;

    // Set initial default value (30 Nm)
    updateAllFromNm(30, false, null);

    // Event listeners for inputs
    inputNm.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) {
            torqueState.nm = val;
            updateAllFromNm(val, false, 'nm');
        } else {
            clearOtherOutputs('nm');
        }
    });

    inputLbft.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) {
            const nmVal = val * LBFT_TO_NM;
            torqueState.nm = nmVal;
            updateAllFromNm(nmVal, false, 'lbft');
        } else {
            clearOtherOutputs('lbft');
        }
    });

    // Clear buttons
    const clearNmBtn = document.getElementById('torque-clear-nm');
    if (clearNmBtn) {
        clearNmBtn.addEventListener('click', () => {
            inputNm.value = '';
            inputNm.focus();
            clearOtherOutputs('nm');
        });
    }
    const clearLbftBtn = document.getElementById('torque-clear-lbft');
    if (clearLbftBtn) {
        clearLbftBtn.addEventListener('click', () => {
            inputLbft.value = '';
            inputLbft.focus();
            clearOtherOutputs('lbft');
        });
    }

    // Direction Swap Button
    const swapBtn = document.getElementById('torque-swap-btn');
    if (swapBtn) {
        swapBtn.addEventListener('click', () => {
            toggleTorqueDirection();
        });
    }

    // Step Buttons (+1, -1, +10, -10, etc.)
    document.querySelectorAll('.torque-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const unit = btn.getAttribute('data-unit');
            const step = parseFloat(btn.getAttribute('data-step')) || 0;
            if (unit === 'nm') {
                const cur = parseFloat(inputNm.value) || 0;
                const next = Math.max(0, +(cur + step).toFixed(2));
                inputNm.value = next;
                torqueState.nm = next;
                updateAllFromNm(next, false, null);
            } else if (unit === 'lbft') {
                const cur = parseFloat(inputLbft.value) || 0;
                const next = Math.max(0, +(cur + step).toFixed(2));
                inputLbft.value = next;
                const nextNm = next * LBFT_TO_NM;
                torqueState.nm = nextNm;
                updateAllFromNm(nextNm, false, 'lbft');
            }
        });
    });

    // Slider sync
    const slider = document.getElementById('torque-range-slider');
    if (slider) {
        slider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            torqueState.nm = val;
            updateAllFromNm(val, true, null);
        });
    }

    // Preset buttons
    document.querySelectorAll('.torque-preset-card').forEach(card => {
        card.addEventListener('click', () => {
            const nmVal = parseFloat(card.getAttribute('data-nm'));
            if (!isNaN(nmVal)) {
                torqueState.nm = nmVal;
                updateAllFromNm(nmVal, false, null);
                highlightActivePreset(nmVal);
            }
        });
    });

    // Quick comparison table rows
    document.querySelectorAll('.torque-table tbody tr').forEach(row => {
        row.addEventListener('click', () => {
            const nmVal = parseFloat(row.getAttribute('data-nm'));
            if (!isNaN(nmVal)) {
                torqueState.nm = nmVal;
                updateAllFromNm(nmVal, false, null);
                highlightActivePreset(nmVal);
            }
        });
    });

    // Copy buttons
    setupCopyButton('torque-copy-nm', () => {
        const val = inputNm.value;
        return val ? `${val} N·m` : '';
    });
    setupCopyButton('torque-copy-lbft', () => {
        const val = inputLbft.value;
        return val ? `${val} lb·ft` : '';
    });

    // Decimal precision selector
    const precSelect = document.getElementById('torque-precision-select');
    if (precSelect) {
        precSelect.addEventListener('change', (e) => {
            torqueState.decimals = parseInt(e.target.value) || 2;
            updateAllFromNm(torqueState.nm, false, null);
        });
    }
}

function updateAllFromNm(nmVal, fromSlider = false, sourceInput = null) {
    const inputNm = document.getElementById('torque-input-nm');
    const inputLbft = document.getElementById('torque-input-lbft');
    const slider = document.getElementById('torque-range-slider');
    const sliderLabel = document.getElementById('torque-slider-current');
    const outInlb = document.getElementById('torque-out-inlb');
    const outKgfm = document.getElementById('torque-out-kgfm');
    const outKgfcm = document.getElementById('torque-out-kgfcm');

    const decimals = torqueState.decimals;
    const lbftVal = nmVal * NM_TO_LBFT;
    const inlbVal = nmVal * NM_TO_INLB;
    const kgfmVal = nmVal * NM_TO_KGFM;
    const kgfcmVal = nmVal * NM_TO_KGFCM;

    if (sourceInput !== 'nm' && inputNm) {
        inputNm.value = Number.isInteger(nmVal) ? nmVal : nmVal.toFixed(decimals);
    }
    if (sourceInput !== 'lbft' && inputLbft) {
        inputLbft.value = lbftVal.toFixed(decimals);
    }

    if (!fromSlider && slider) {
        slider.value = Math.min(slider.max, Math.max(slider.min, nmVal));
    }
    if (sliderLabel) {
        sliderLabel.textContent = `${nmVal.toFixed(decimals)} N·m (${lbftVal.toFixed(decimals)} lb·ft)`;
    }

    // Extra units display
    if (outInlb) outInlb.textContent = inlbVal.toFixed(decimals);
    if (outKgfm) outKgfm.textContent = kgfmVal.toFixed(decimals);
    if (outKgfcm) outKgfcm.textContent = kgfcmVal.toFixed(decimals > 1 ? 1 : 0);

    highlightActivePreset(nmVal);
}

function clearOtherOutputs(source) {
    const inputNm = document.getElementById('torque-input-nm');
    const inputLbft = document.getElementById('torque-input-lbft');
    const outInlb = document.getElementById('torque-out-inlb');
    const outKgfm = document.getElementById('torque-out-kgfm');
    const outKgfcm = document.getElementById('torque-out-kgfcm');
    const sliderLabel = document.getElementById('torque-slider-current');

    if (source === 'nm' && inputLbft) inputLbft.value = '';
    if (source === 'lbft' && inputNm) inputNm.value = '';
    if (outInlb) outInlb.textContent = '--';
    if (outKgfm) outKgfm.textContent = '--';
    if (outKgfcm) outKgfcm.textContent = '--';
    if (sliderLabel) sliderLabel.textContent = '--';
}

function toggleTorqueDirection() {
    torqueState.swapped = !torqueState.swapped;
    const grid = document.getElementById('torque-converter-grid');
    const swapBtn = document.getElementById('torque-swap-btn');
    const dirIndicator = document.getElementById('torque-dir-indicator');

    if (grid) {
        grid.classList.toggle('is-swapped', torqueState.swapped);
    }
    if (swapBtn) {
        swapBtn.classList.toggle('is-rotated', torqueState.swapped);
    }
    if (dirIndicator) {
        const lang = document.getElementById('lang-select')?.value || 'ja';
        const dict = (typeof i18n !== 'undefined' && i18n[lang]) ? i18n[lang] : {};
        if (torqueState.swapped) {
            dirIndicator.innerHTML = '<span class="unit-hl">lb·ft</span> → <span class="unit-hl">N·m</span>';
        } else {
            dirIndicator.innerHTML = '<span class="unit-hl">N·m</span> → <span class="unit-hl">lb·ft</span>';
        }
    }

    // Focus the primary input in swapped orientation
    if (torqueState.swapped) {
        document.getElementById('torque-input-lbft')?.focus();
    } else {
        document.getElementById('torque-input-nm')?.focus();
    }
}

function highlightActivePreset(nmVal) {
    document.querySelectorAll('.torque-preset-card').forEach(card => {
        const pNm = parseFloat(card.getAttribute('data-nm'));
        if (Math.abs(pNm - nmVal) < 0.05) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });

    document.querySelectorAll('.torque-table tbody tr').forEach(row => {
        const tNm = parseFloat(row.getAttribute('data-nm'));
        if (Math.abs(tNm - nmVal) < 0.05) {
            row.classList.add('table-row-active');
        } else {
            row.classList.remove('table-row-active');
        }
    });
}

function setupCopyButton(btnId, getValueFn) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener('click', async () => {
        const text = getValueFn();
        if (!text) return;

        try {
            await navigator.clipboard.writeText(text);
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check" style="color:#10b981;"></i>';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('copied');
            }, 1800);
        } catch (e) {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check" style="color:#10b981;"></i>';
            setTimeout(() => btn.innerHTML = originalHTML, 1800);
        }
    });
}

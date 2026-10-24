// --- Cpk Simulator Core ---
let cpkChart = null;

// Normal distribution PDF
function normalPDF(x, mean, std) {
    if (std <= 0) return 0;
    const exponent = Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(std, 2)));
    return (1 / (std * Math.sqrt(2 * Math.PI))) * exponent;
}

// Normal distribution CDF (for accurate PPM defect calculation)
function normalCDF(x, mean, std) {
    if (std <= 0) return x < mean ? 0 : 1;
    const z = (x - mean) / (std * Math.SQRT2);
    const t = 1 / (1 + 0.3275911 * Math.abs(z));
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
    const erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
    const sign = z >= 0 ? 1 : -1;
    return 0.5 * (1 + sign * erf);
}

function calcPPM(usl, lsl, mean, std) {
    if (std <= 0 || usl <= lsl) return 0;
    const pLower = normalCDF(lsl, mean, std);
    const pUpper = 1 - normalCDF(usl, mean, std);
    return Math.max(0, (pLower + pUpper) * 1000000);
}

function calcShiftK(usl, lsl, mean) {
    const center = (usl + lsl) / 2;
    const halfTol = Math.abs(usl - lsl) / 2;
    if (halfTol <= 0) return 0;
    return Math.min(1.0, Math.abs(center - mean) / halfTol);
}

// Stats Calculation
function calcCpk(usl, lsl, mean, std) {
    if (std <= 0) return 0;
    const cpkUpper = (usl - mean) / (3 * std);
    const cpkLower = (mean - lsl) / (3 * std);
    return Math.min(cpkUpper, cpkLower);
}

function calcCp(usl, lsl, std) {
    if (std <= 0) return 0;
    return (usl - lsl) / (6 * std);
}

function calcMean(data) {
    if (data.length === 0) return NaN;
    return data.reduce((a, b) => a + b, 0) / data.length;
}

function calcStd(data, mean) {
    if (data.length < 2) return NaN;
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (data.length - 1);
    return Math.sqrt(variance);
}

// Box-Muller transform for generating normally distributed values
function generateNormalRandom(mean, std) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * std + mean;
}

function initCpkSimulator() {
    setupSlidersAndInputs();
    setupTable();
    setupButtons();
    setupPresets();
    initChart();
    updateCpkView();
}

function setupSlidersAndInputs() {
    const syncPairs = [
        { range: 'input-mean', num: 'val-mean' },
        { range: 'input-std', num: 'val-std' }
    ];
    syncPairs.forEach(pair => {
        const rangeEl = document.getElementById(pair.range);
        const numEl = document.getElementById(pair.num);
        if (rangeEl && numEl) {
            rangeEl.addEventListener('input', (e) => {
                numEl.value = parseFloat(e.target.value).toFixed(3);
                updateCpkView();
            });
            numEl.addEventListener('input', (e) => {
                rangeEl.value = e.target.value;
                updateCpkView();
            });
        }
    });

    ['input-usl', 'input-lsl'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateCpkView);
    });

    const checkShading = document.getElementById('cpk-show-shading');
    if (checkShading) checkShading.addEventListener('change', updateCpkView);

    const checkTarget = document.getElementById('cpk-show-target');
    if (checkTarget) checkTarget.addEventListener('change', updateCpkView);
}

function setupPresets() {
    const presetButtons = document.querySelectorAll('[data-cpk-preset]');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            presetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const preset = btn.getAttribute('data-cpk-preset');
            applyCpkPreset(preset);
        });
    });
}

function applyCpkPreset(preset) {
    const uslInput = document.getElementById('input-usl');
    const lslInput = document.getElementById('input-lsl');
    const meanRange = document.getElementById('input-mean');
    const meanVal = document.getElementById('val-mean');
    const stdRange = document.getElementById('input-std');
    const stdVal = document.getElementById('val-std');
    const stepInput = document.getElementById('input-step');

    uslInput.value = '1.00';
    lslInput.value = '-1.00';

    if (preset === 'capable') {
        // Cpk = 1.33 (Cp=1.33, Mean=0, Std=0.25)
        meanRange.value = '0.000';
        meanVal.value = '0.000';
        stdRange.value = '0.250';
        stdVal.value = '0.250';
        stepInput.value = '0.01';
    } else if (preset === 'shifted') {
        // Shifted Mean: Cp=1.33, Cpk=0.83 (Mean=0.375, Std=0.25)
        meanRange.value = '0.375';
        meanVal.value = '0.375';
        stdRange.value = '0.250';
        stdVal.value = '0.250';
        stepInput.value = '0.01';
    } else if (preset === 'variation') {
        // High variation: Cp=0.75, Cpk=0.75 (Mean=0, Std=0.444)
        meanRange.value = '0.000';
        meanVal.value = '0.000';
        stdRange.value = '0.444';
        stdVal.value = '0.444';
        stepInput.value = '0.01';
    } else if (preset === 'coarse') {
        // Coarse resolution quantization effect
        meanRange.value = '0.000';
        meanVal.value = '0.000';
        stdRange.value = '0.250';
        stdVal.value = '0.250';
        stepInput.value = '0.20';
    }

    // Trigger regeneration of random actual data
    document.getElementById('btn-generate')?.click();
}

function setupTable() {
    const tbody = document.querySelector('#data-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    for (let i = 1; i <= 50; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="row-num">${i}</td>
            <td><input type="number" step="any" class="data-input" id="data-input-${i}"></td>
            <td class="verdict-cell" id="data-verdict-${i}">--</td>
        `;
        tbody.appendChild(tr);
    }

    document.querySelectorAll('.data-input').forEach(input => {
        input.addEventListener('input', updateCpkView);
    });
}

function getTableData() {
    const inputs = document.querySelectorAll('.data-input');
    const data = [];
    inputs.forEach(input => {
        const val = parseFloat(input.value);
        if (!isNaN(val)) {
            data.push(val);
        }
    });
    return data;
}

function setupButtons() {
    const btnGen = document.getElementById('btn-generate');
    const btnApplyActual = document.getElementById('btn-apply-actual');
    const btnClear = document.getElementById('btn-clear');
    const btnCopy = document.getElementById('btn-copy');
    const btnPaste = document.getElementById('btn-paste-data');
    const btnToggleDrawer = document.getElementById('btn-toggle-data-drawer');
    const btnCloseDrawer = document.getElementById('btn-close-data-drawer');

    if (btnGen) {
        btnGen.addEventListener('click', () => {
            const mean = parseFloat(document.getElementById('input-mean').value) || 0;
            const std = parseFloat(document.getElementById('input-std').value) || 0.25;
            const digits = parseInt(document.getElementById('input-digits').value) || 0;
            const stepVal = parseFloat(document.getElementById('input-step').value) || 0;
            const nLimit = Math.min(50, parseInt(document.getElementById('input-n').value) || 30);

            const inputs = document.querySelectorAll('.data-input');
            inputs.forEach((input, index) => {
                if (index < nLimit) {
                    let rawVal = generateNormalRandom(mean, std);
                    if (stepVal > 0) {
                        rawVal = Math.round(rawVal / stepVal) * stepVal;
                    }
                    input.value = rawVal.toFixed(digits);
                } else {
                    input.value = '';
                }
            });

            updateCpkView();
        });
    }

    if (btnApplyActual) {
        btnApplyActual.addEventListener('click', () => {
            const parsedData = getTableData();
            if (parsedData.length > 1) {
                const actMean = calcMean(parsedData);
                const actStd = calcStd(parsedData, actMean);
                if (actStd > 0) {
                    document.getElementById('input-mean').value = actMean.toFixed(3);
                    document.getElementById('val-mean').value = actMean.toFixed(3);
                    document.getElementById('input-std').value = Math.max(0.001, actStd).toFixed(3);
                    document.getElementById('val-std').value = Math.max(0.001, actStd).toFixed(3);
                    updateCpkView();
                }
            }
        });
    }

    if (btnClear) {
        btnClear.addEventListener('click', () => {
            document.querySelectorAll('.data-input').forEach(input => input.value = '');
            updateCpkView();
        });
    }

    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            const data = getTableData();
            if (data.length > 0) {
                const tsvData = "Value\n" + data.join('\n');
                navigator.clipboard.writeText(tsvData).then(() => {
                    const originalHTML = btnCopy.innerHTML;
                    btnCopy.innerHTML = '<i class="fa-solid fa-check"></i> コピー完了';
                    setTimeout(() => btnCopy.innerHTML = originalHTML, 1500);
                });
            }
        });
    }

    if (btnPaste) {
        btnPaste.addEventListener('click', async () => {
            try {
                let text = '';
                if (navigator.clipboard && navigator.clipboard.readText) {
                    text = await navigator.clipboard.readText();
                } else {
                    text = prompt('Excelまたはテキストから貼り付けるデータを入力してください:') || '';
                }
                const numbers = text.replace(/[,\t\n\r]/g, ' ')
                                    .split(/\s+/)
                                    .map(s => parseFloat(s.trim()))
                                    .filter(n => !isNaN(n));
                if (numbers.length > 0) {
                    const inputs = document.querySelectorAll('.data-input');
                    inputs.forEach((input, idx) => {
                        if (idx < numbers.length && idx < 50) {
                            input.value = numbers[idx];
                        } else if (idx >= numbers.length) {
                            input.value = '';
                        }
                    });
                    document.getElementById('input-n').value = Math.min(50, numbers.length);
                    updateCpkView();
                    // Open drawer to see pasted items
                    const drawer = document.getElementById('cpk-data-drawer');
                    if (drawer) drawer.style.display = 'block';
                }
            } catch (err) {
                console.warn('Clipboard read error, falling back to prompt', err);
            }
        });
    }

    if (btnToggleDrawer) {
        btnToggleDrawer.addEventListener('click', () => {
            const drawer = document.getElementById('cpk-data-drawer');
            if (drawer) {
                drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    if (btnCloseDrawer) {
        btnCloseDrawer.addEventListener('click', () => {
            const drawer = document.getElementById('cpk-data-drawer');
            if (drawer) drawer.style.display = 'none';
        });
    }

    const plotSelect = document.getElementById('plot-type-select');
    if (plotSelect) {
        plotSelect.addEventListener('change', updateCpkView);
    }
}

function updateCpkView() {
    const usl = parseFloat(document.getElementById('input-usl').value) || 0;
    const lsl = parseFloat(document.getElementById('input-lsl').value) || 0;
    const theoMean = parseFloat(document.getElementById('input-mean').value) || 0;
    const theoStd = parseFloat(document.getElementById('input-std').value) || 1;

    // 1. Theoretical calculations
    const theoCpk = calcCpk(usl, lsl, theoMean, theoStd);
    const theoCp = calcCp(usl, lsl, theoStd);
    const theoPPM = calcPPM(usl, lsl, theoMean, theoStd);

    document.getElementById('stat-theory-cpk').textContent = theoCpk.toFixed(2);
    document.getElementById('stat-theory-cp').textContent = theoCp.toFixed(2);
    document.getElementById('stat-theory-ppm').textContent = theoPPM < 1 ? '< 1' : Math.round(theoPPM).toLocaleString();

    // 2. Actual data calculations
    const parsedData = getTableData();
    const countBadge = document.getElementById('cpk-data-count');
    if (countBadge) countBadge.textContent = parsedData.length;

    let actMean = NaN;
    let actStd = NaN;
    let actCpk = NaN;
    let actCp = NaN;
    let actPPM = NaN;
    let actShiftK = NaN;

    // Update row verdicts in table
    const inputs = document.querySelectorAll('.data-input');
    inputs.forEach((input, idx) => {
        const val = parseFloat(input.value);
        const verdictCell = document.getElementById(`data-verdict-${idx + 1}`);
        if (!verdictCell) return;
        if (!isNaN(val)) {
            const isOos = val > usl || val < lsl;
            verdictCell.textContent = isOos ? 'NG' : 'OK';
            verdictCell.style.color = isOos ? 'var(--accent-danger)' : 'var(--accent-actual)';
            verdictCell.style.fontWeight = 'bold';
        } else {
            verdictCell.textContent = '--';
            verdictCell.style.color = 'var(--text-muted)';
            verdictCell.style.fontWeight = 'normal';
        }
    });

    if (parsedData.length > 1) {
        actMean = calcMean(parsedData);
        actStd = calcStd(parsedData, actMean);
        if (actStd > 0) {
            actCpk = calcCpk(usl, lsl, actMean, actStd);
            actCp = calcCp(usl, lsl, actStd);
            actPPM = calcPPM(usl, lsl, actMean, actStd);
            actShiftK = calcShiftK(usl, lsl, actMean);
        }
    }

    document.getElementById('stat-actual-mean').textContent = isNaN(actMean) ? '--' : actMean.toFixed(3);
    document.getElementById('stat-actual-shift').textContent = isNaN(actShiftK) ? '--' : (actShiftK * 100).toFixed(1) + '%';
    document.getElementById('stat-actual-std').textContent = isNaN(actStd) ? '--' : actStd.toFixed(3);
    document.getElementById('stat-actual-6s').textContent = isNaN(actStd) ? '--' : (actStd * 6).toFixed(3);
    document.getElementById('stat-actual-cpk').textContent = isNaN(actCpk) ? '--' : actCpk.toFixed(2);
    document.getElementById('stat-actual-cp').textContent = isNaN(actCp) ? '--' : actCp.toFixed(2);
    document.getElementById('stat-actual-ppm').textContent = isNaN(actPPM) ? '--' : (actPPM < 1 ? '< 1' : Math.round(actPPM).toLocaleString());

    // 3. Verdict Banner Update
    updateVerdictBanner(isNaN(actCpk) ? theoCpk : actCpk);

    // 4. Render Chart
    renderOrUpdateChart(theoMean, theoStd, parsedData, usl, lsl, actMean, actStd);
}

function updateVerdictBanner(cpkVal) {
    const banner = document.getElementById('cpk-verdict-banner');
    const title = document.getElementById('cpk-verdict-title');
    const desc = document.getElementById('cpk-verdict-desc');
    if (!banner || !title || !desc) return;

    banner.className = 'verdict-banner';
    const icon = banner.querySelector('.verdict-icon i');

    if (cpkVal >= 1.33) {
        banner.classList.add('capable');
        if (icon) icon.className = 'fa-solid fa-circle-check';
        title.textContent = `工程能力は極めて優良です (Cpk = ${cpkVal.toFixed(2)} ≥ 1.33)`;
        desc.textContent = '理論上の不適合率は極めて低く、ばらつき・偏りともに管理された量産適合水準です。';
    } else if (cpkVal >= 1.00) {
        banner.classList.add('marginal');
        if (icon) icon.className = 'fa-solid fa-triangle-exclamation';
        title.textContent = `工程能力は必要最低限です (1.00 ≤ Cpk = ${cpkVal.toFixed(2)} < 1.33)`;
        desc.textContent = '規格内ですが余裕が少なく、平均値の偏りや突発的なばらつきで不適合品が発生するリスクがあります。';
    } else {
        banner.classList.add('inadequate');
        if (icon) icon.className = 'fa-solid fa-circle-xmark';
        title.textContent = `工程能力不足です (Cpk = ${cpkVal.toFixed(2)} < 1.00)`;
        desc.textContent = '規格外の不適合品が定常的に発生する恐れがあります。工程ばらつき低減または中心位置の改善が必要です。';
    }
}

function initChart() {
    const canvas = document.getElementById('cpk-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    Chart.defaults.color = isDark ? '#94a3b8' : '#64748b';
    Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";

    if (cpkChart) {
        try { cpkChart.destroy(); } catch (e) {}
        cpkChart = null;
    }

    cpkChart = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            interaction: { mode: 'nearest', intersect: false },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 10,
                        usePointStyle: true,
                        font: { size: 11, family: "'Inter', sans-serif" }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(ctx) {
                            return `${ctx.dataset.label}: x=${ctx.parsed.x.toFixed(3)}, y=${ctx.parsed.y.toFixed(3)}`;
                        }
                    }
                },
                annotation: { annotations: {} }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
                    ticks: {
                        font: { family: "'JetBrains Mono', monospace", size: 10 }
                    }
                },
                y: {
                    display: false,
                    beginAtZero: true
                }
            }
        }
    });
    window.cpkChart = cpkChart;
}

function renderOrUpdateChart(theoMean, theoStd, parsedData, usl, lsl, actMean, actStd) {
    if (!cpkChart) return;

    const spread = Math.abs(usl - lsl) || 2.0;
    let minX = Math.min(lsl, usl) - spread * 0.4;
    let maxX = Math.max(lsl, usl) + spread * 0.4;

    minX = Math.min(minX, theoMean - 4 * theoStd);
    maxX = Math.max(maxX, theoMean + 4 * theoStd);

    if (!isNaN(actMean) && !isNaN(actStd)) {
        minX = Math.min(minX, actMean - 4 * actStd);
        maxX = Math.max(maxX, actMean + 4 * actStd);
    }

    const pointsCount = 180;
    const step = (maxX - minX) / pointsCount;

    const chartPoints = [];
    for (let i = 0; i <= pointsCount; i++) {
        const x = minX + (step * i);
        chartPoints.push({
            x: x,
            yTheory: normalPDF(x, theoMean, theoStd),
            yActual: (!isNaN(actMean) && actStd > 0) ? normalPDF(x, actMean, actStd) : null
        });
    }

    const datasets = [];
    const showShading = document.getElementById('cpk-show-shading')?.checked ?? true;

    // 1. Theoretical density curve
    datasets.push({
        type: 'line',
        label: '理論分布 (Theoretical)',
        data: chartPoints.map(d => ({ x: d.x, y: d.yTheory })),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        borderWidth: 2.2,
        pointRadius: 0,
        fill: true,
        tension: 0.35
    });

    // 2. Out-of-Spec Shading (Tail area fill)
    if (showShading) {
        const lowerTailPoints = chartPoints.map(d => ({
            x: d.x,
            y: d.x <= lsl ? d.yTheory : null
        }));
        const upperTailPoints = chartPoints.map(d => ({
            x: d.x,
            y: d.x >= usl ? d.yTheory : null
        }));

        datasets.push({
            type: 'line',
            label: '規格外テール (LSL外)',
            data: lowerTailPoints,
            borderColor: 'rgba(225, 29, 72, 0.8)',
            backgroundColor: 'rgba(225, 29, 72, 0.28)',
            borderWidth: 1.5,
            pointRadius: 0,
            fill: true,
            tension: 0.35
        });

        datasets.push({
            type: 'line',
            label: '規格外テール (USL外)',
            data: upperTailPoints,
            borderColor: 'rgba(225, 29, 72, 0.8)',
            backgroundColor: 'rgba(225, 29, 72, 0.28)',
            borderWidth: 1.5,
            pointRadius: 0,
            fill: true,
            tension: 0.35
        });
    }

    // 3. Actual Data Points / Curve / Histogram
    const plotType = document.getElementById('plot-type-select')?.value || 'scatter';
    if (parsedData && parsedData.length > 0) {
        const maxTheo = normalPDF(theoMean, theoMean, theoStd) || 1;

        if (plotType === 'scatter') {
            // Deterministic pseudo-jitter (no random jumping on slider move!)
            const scatterPoints = parsedData.map((val, idx) => {
                const isOos = val > usl || val < lsl;
                // Deterministic pseudo-random height based on hash of index
                const jitterFraction = 0.03 + (0.12 * Math.abs(Math.sin((idx + 1) * 12.9898)));
                return {
                    x: val,
                    y: maxTheo * jitterFraction,
                    isOos: isOos
                };
            });

            datasets.push({
                type: 'scatter',
                label: '実測データ (In-Spec)',
                data: scatterPoints.filter(p => !p.isOos),
                backgroundColor: '#14b8a6',
                borderColor: '#ffffff',
                borderWidth: 1.5,
                pointRadius: 4.5,
                pointHoverRadius: 6.5
            });

            const oosPoints = scatterPoints.filter(p => p.isOos);
            if (oosPoints.length > 0) {
                datasets.push({
                    type: 'scatter',
                    label: '規格外データ (Out-of-Spec)',
                    data: oosPoints,
                    backgroundColor: '#e11d48',
                    borderColor: '#ffffff',
                    borderWidth: 1.5,
                    pointRadius: 5.5,
                    pointHoverRadius: 7.5
                });
            }
        } else if (plotType === 'line' && actStd > 0) {
            datasets.push({
                type: 'line',
                label: '実力正規曲線 (Actual Curve)',
                data: chartPoints.map(d => ({ x: d.x, y: d.yActual })),
                borderColor: '#14b8a6',
                backgroundColor: 'rgba(20, 184, 166, 0.12)',
                borderWidth: 2,
                borderDash: [5, 4],
                pointRadius: 0,
                fill: true,
                tension: 0.35
            });
        } else if (plotType === 'histogram') {
            const numBins = Math.min(25, Math.max(8, Math.round(Math.sqrt(parsedData.length) * 2)));
            const binWidth = (maxX - minX) / numBins;
            const bins = Array(numBins).fill(0);

            parsedData.forEach(val => {
                if (val >= minX && val <= maxX) {
                    let idx = Math.floor((val - minX) / binWidth);
                    if (idx >= numBins) idx = numBins - 1;
                    bins[idx]++;
                }
            });

            const barData = bins.map((count, i) => {
                const xCenter = minX + (i + 0.5) * binWidth;
                const density = count / (parsedData.length * binWidth);
                return { x: xCenter, y: density };
            });

            datasets.push({
                type: 'bar',
                label: '実績ヒストグラム (Histogram)',
                data: barData,
                backgroundColor: 'rgba(20, 184, 166, 0.45)',
                borderColor: '#14b8a6',
                borderWidth: 1,
                barPercentage: 1.0,
                categoryPercentage: 1.0
            });
        }
    }

    cpkChart.data.datasets = datasets;

    // Annotations: USL, LSL, Target & Mean Shift
    const annotations = {
        lineUSL: {
            type: 'line',
            xMin: usl,
            xMax: usl,
            borderColor: '#e11d48',
            borderWidth: 2,
            borderDash: [3, 3],
            label: {
                content: `USL: ${usl.toFixed(2)}`,
                display: true,
                position: 'start',
                backgroundColor: 'rgba(225, 29, 72, 0.85)',
                color: '#ffffff',
                font: { size: 10, family: "'JetBrains Mono', monospace" }
            }
        },
        lineLSL: {
            type: 'line',
            xMin: lsl,
            xMax: lsl,
            borderColor: '#e11d48',
            borderWidth: 2,
            borderDash: [3, 3],
            label: {
                content: `LSL: ${lsl.toFixed(2)}`,
                display: true,
                position: 'start',
                backgroundColor: 'rgba(225, 29, 72, 0.85)',
                color: '#ffffff',
                font: { size: 10, family: "'JetBrains Mono', monospace" }
            }
        }
    };

    const showTarget = document.getElementById('cpk-show-target')?.checked ?? true;
    if (showTarget) {
        const targetX = (usl + lsl) / 2;
        annotations.lineTarget = {
            type: 'line',
            xMin: targetX,
            xMax: targetX,
            borderColor: 'rgba(100, 116, 139, 0.7)',
            borderWidth: 1.5,
            borderDash: [5, 4],
            label: {
                content: `規格中心: ${targetX.toFixed(2)}`,
                display: true,
                position: 'end',
                backgroundColor: 'rgba(100, 116, 139, 0.75)',
                color: '#ffffff',
                font: { size: 9, family: "'Inter', sans-serif" }
            }
        };

        if (Math.abs(theoMean - targetX) > 0.01) {
            annotations.lineMean = {
                type: 'line',
                xMin: theoMean,
                xMax: theoMean,
                borderColor: '#6366f1',
                borderWidth: 1.5,
                borderDash: [2, 2],
                label: {
                    content: `μ: ${theoMean.toFixed(2)}`,
                    display: true,
                    position: 'center',
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    color: '#ffffff',
                    font: { size: 9, family: "'JetBrains Mono', monospace" }
                }
            };
        }
    }

    cpkChart.options.plugins.annotation.annotations = annotations;
    cpkChart.update('none');
}

function updateChartTheme(isDark) {
    if (!cpkChart) return;
    Chart.defaults.color = isDark ? '#94a3b8' : '#64748b';
    cpkChart.options.scales.x.grid.color = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    cpkChart.update();
}

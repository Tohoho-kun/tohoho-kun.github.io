// --- Cpk Simulator Core ---
let cpkChart = null;

// Normal distribution PDF
function normalPDF(x, mean, std) {
    if (std === 0) return 0;
    const exponent = Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(std, 2)));
    return (1 / (std * Math.sqrt(2 * Math.PI))) * exponent;
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
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (data.length - 1); // Sample variance
    return Math.sqrt(variance);
}

// Box-Muller transform for generating normally distributed values
function generateNormalRandom(mean, std) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * std + mean;
}

function initCpkSimulator() {
    setupSlidersAndInputs();
    setupTable();
    setupButtons();
    initChart();
    updateCpkView(); // initial calc
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
                numEl.value = e.target.value;
                updateCpkView();
            });
            numEl.addEventListener('input', (e) => {
                rangeEl.value = e.target.value;
                updateCpkView();
            });
        }
    });

    const otherInputs = ['usl', 'lsl'].map(id => document.getElementById(`input-${id}`));
    otherInputs.forEach(input => {
        if (!input) return;
        input.addEventListener('input', () => {
            updateCpkView();
        });
    });
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
        `;
        tbody.appendChild(tr);
    }
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
    const btnRecalc = document.getElementById('btn-recalc');
    const btnClear = document.getElementById('btn-clear');
    const btnCopy = document.getElementById('btn-copy');
    
    btnGen.addEventListener('click', () => {
        const mean = parseFloat(document.getElementById('input-mean').value);
        const std = parseFloat(document.getElementById('input-std').value);
        const digits = parseInt(document.getElementById('input-digits').value) || 0;
        const stepVal = parseFloat(document.getElementById('input-step').value) || 0;
        const nLimit = parseInt(document.getElementById('input-n').value) || 30;
        
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

    btnRecalc.addEventListener('click', () => {
        updateCpkView();
    });

    const btnApplyActual = document.getElementById('btn-apply-actual');
    if (btnApplyActual) {
        btnApplyActual.addEventListener('click', () => {
            const parsedData = getTableData();
            if (parsedData.length > 1) {
                const actMean = calcMean(parsedData);
                const actStd = calcStd(parsedData, actMean);
                if (actStd > 0) {
                    // Update slider inputs with high precision
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
                    btnCopy.innerHTML = '<i class="fa-solid fa-check"></i>';
                    setTimeout(() => btnCopy.innerHTML = originalHTML, 1500);
                });
            }
        });
    }

    const plotSelect = document.getElementById('plot-type-select');
    if (plotSelect) {
        plotSelect.addEventListener('change', () => {
            updateCpkView();
        });
    }
}

// updateCpkView reads directly from table now

// Parses string into array of numbers
function parseData(text) {
    if (!text || !text.trim()) return [];
    // Replace newlines and commas with spaces, split, parse
    const rawItems = text.replace(/[,\n]/g, ' ').split(/\s+/).filter(Boolean);
    return rawItems.map(Number).filter(n => !isNaN(n));
}

function updateCpkView() {
    // 1. Get Control Panel Values (Theoretical)
    const usl = parseFloat(document.getElementById('input-usl').value) || 0;
    const lsl = parseFloat(document.getElementById('input-lsl').value) || 0;
    const theoMean = parseFloat(document.getElementById('input-mean').value) || 0;
    const theoStd = parseFloat(document.getElementById('input-std').value) || 1;

    // 2. Compute Theoretical Results
    const theoCpk = calcCpk(usl, lsl, theoMean, theoStd);
    const theoCp = calcCp(usl, lsl, theoStd);
    document.getElementById('stat-theory-cpk').textContent = theoCpk.toFixed(2);
    document.getElementById('stat-theory-cp').textContent = theoCp.toFixed(2);

    // 3. Get Data Room values (Actual)
    const parsedData = getTableData();
    
    let actMean = NaN;
    let actStd = NaN;
    let actCpk = NaN;
    let actCp = NaN;

    if (parsedData.length > 1) {
        actMean = calcMean(parsedData);
        actStd = calcStd(parsedData, actMean);
        if (actStd > 0) {
           actCpk = calcCpk(usl, lsl, actMean, actStd);
           actCp = calcCp(usl, lsl, actStd);
        }
    }

    // Update Actual stats UI (keep 4 decimal digits for better visibility of tiny amounts)
    document.getElementById('stat-actual-mean').textContent = isNaN(actMean) ? '--' : actMean.toFixed(4);
    document.getElementById('stat-actual-std').textContent = isNaN(actStd) ? '--' : actStd.toFixed(4);
    document.getElementById('stat-actual-cpk').textContent = isNaN(actCpk) ? '--' : actCpk.toFixed(3);
    document.getElementById('stat-actual-cp').textContent = isNaN(actCp) ? '--' : actCp.toFixed(3);

    // 4. Update Chart
    renderOrUpdateChart(theoMean, theoStd, parsedData, usl, lsl, actMean, actStd);
}

function initChart() {
    const ctx = document.getElementById('cpk-chart').getContext('2d');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    Chart.defaults.color = isDark ? '#94a3b8' : '#6b7280';
    Chart.defaults.font.family = "'Inter', sans-serif";
    
    cpkChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // グラフ変化時の平坦化アニメーションを無効化し即座に変形させる
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { boxWidth: 12, usePointStyle: true }
                },
                tooltip: { enabled: true },
                annotation: { annotations: {} }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
                },
                y: {
                    display: false, // hide density values
                    beginAtZero: true
                }
            }
        }
    });
    window.cpkChart = cpkChart;
}

function renderOrUpdateChart(theoMean, theoStd, parsedData, usl, lsl, actMean, actStd) {
    if (!cpkChart) return;
    
    // Determine plotting range (x-axis)
    // グラフの横幅は規格の上下限の2倍をデフォルトとし、はみ出すようであれば広げる
    const spread = usl - lsl;
    const defaultMinX = Math.min(lsl, usl) - spread / 2.0;    // example: usl=1, lsl=-1, spread=2. defaultMinX = -1 - 1 = -2
    const defaultMaxX = Math.max(lsl, usl) + spread / 2.0;    // defaultMaxX = +2
    
    let minX = defaultMinX;
    let maxX = defaultMaxX;
    
    // Expand to fit theoretical 4-sigma
    minX = Math.min(minX, theoMean - 4 * theoStd);
    maxX = Math.max(maxX, theoMean + 4 * theoStd);

    // Expand to fit actual data 4-sigma
    if (!isNaN(actMean) && !isNaN(actStd)) {
        minX = Math.min(minX, actMean - 4 * (actStd || 1));
        maxX = Math.max(maxX, actMean + 4 * (actStd || 1));
    }
    
    const pointsCount = 150;
    const step = (maxX - minX) / pointsCount;
    
    let chartDataObj = [];
    for (let i = 0; i <= pointsCount; i++) {
        const x = minX + (step * i);
        let dp = { x: x, theory: normalPDF(x, theoMean, theoStd) };
        chartDataObj.push(dp);
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    const datasets = [
        {
            type: 'line',
            label: '理論分布 (Theoretical)',
            data: chartDataObj.map(d => ({ x: d.x, y: d.theory })),
            borderColor: '#8b5cf6', // accent-theory
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            tension: 0.4
        }
    ];

    const plotType = document.getElementById('plot-type-select')?.value || 'scatter';

    if (parsedData && parsedData.length > 0) {
        if (plotType === 'scatter') {
            const maxDensity = normalPDF(theoMean, theoMean, theoStd);
            datasets.push({
                type: 'scatter',
                label: '実績データ (Actual Points)',
                data: parsedData.map(val => ({ x: val, y: Math.random() * maxDensity * 0.15 })),
                backgroundColor: '#10b981', // accent-actual
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.5)'
            });
        } else if (plotType === 'line' && actStd > 0) {
            datasets.push({
                type: 'line',
                label: '実力分布 (Actual Curve)',
                data: chartDataObj.map(d => ({ x: d.x, y: normalPDF(d.x, actMean, actStd) })),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: true,
                tension: 0.4
            });
        } else if (plotType === 'histogram') {
            const numBins = 20;
            const binWidth = (maxX - minX) / numBins;
            const bins = Array(numBins).fill(0);
            
            parsedData.forEach(val => {
                if (val >= minX && val <= maxX) {
                    let binIdx = Math.floor((val - minX) / binWidth);
                    if (binIdx >= numBins) binIdx = numBins - 1;
                    bins[binIdx]++;
                }
            });

            const barData = bins.map((count, i) => {
                const xCenter = minX + (i + 0.5) * binWidth;
                const density = count / (parsedData.length * binWidth);
                return { x: xCenter, y: density };
            });

            datasets.push({
                type: 'bar',
                label: '実績データ (Histogram)',
                data: barData,
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                borderColor: '#10b981',
                borderWidth: 1,
                barPercentage: 1.0,
                categoryPercentage: 1.0
            });
        }
    }

    cpkChart.data.datasets = datasets;

    // Define Annotations for USL / LSL
    cpkChart.options.plugins.annotation.annotations = {
        lineUSL: {
            type: 'line',
            xMin: usl,
            xMax: usl,
            borderColor: '#ef4444',
            borderWidth: 2,
            borderDash: [2, 2],
            label: {
                content: 'USL: ' + usl,
                display: true,
                position: 'start',
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                color: 'white',
                font: { size: 10 }
            }
        },
        lineLSL: {
            type: 'line',
            xMin: lsl,
            xMax: lsl,
            borderColor: '#ef4444',
            borderWidth: 2,
            borderDash: [2, 2],
            label: {
                content: 'LSL: ' + lsl,
                display: true,
                position: 'start',
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                color: 'white',
                font: { size: 10 }
            }
        }
    };

    cpkChart.update('none'); // アニメーション無しで即座に更新
}

function updateChartTheme(isDark) {
    if (!cpkChart) return;
    Chart.defaults.color = isDark ? '#94a3b8' : '#6b7280';
    cpkChart.options.scales.x.grid.color = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    cpkChart.update();
}


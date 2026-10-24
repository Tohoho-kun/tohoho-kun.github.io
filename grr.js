// --- Gauge R&R Simulator Core ---
let grrChart = null;
let grrPartOpChart = null;
let currentGrrData = [];
let currentGrrResults = null;

function initGrrSimulator() {
    setupGrrTable();
    setupGrrButtons();
    setupGrrPresets();
    initGrrCharts();
    // Generate initial sample dataset so user immediately sees a live diagnostic
    generateGrrData();
}

function setupGrrTable() {
    const tbody = document.querySelector('#grr-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    for (let p = 1; p <= 10; p++) {
        const tr = document.createElement('tr');
        let html = `<td class="row-num">${p}</td>`;
        for (let o = 1; o <= 3; o++) {
            for (let t = 1; t <= 3; t++) {
                html += `<td><input type="number" step="any" class="grr-input" data-part="${p}" data-op="${o}" data-trial="${t}"></td>`;
            }
        }
        html += `<td class="part-mean-cell" id="grr-part-mean-${p}">--</td>`;
        tr.innerHTML = html;
        tbody.appendChild(tr);
    }

    document.querySelectorAll('.grr-input').forEach(input => {
        input.addEventListener('input', runGrrAnalysis);
    });
}

function setupGrrButtons() {
    document.getElementById('btn-grr-generate')?.addEventListener('click', generateGrrData);
    document.getElementById('btn-grr-calc')?.addEventListener('click', runGrrAnalysis);
    document.getElementById('btn-grr-clear')?.addEventListener('click', () => {
        document.querySelectorAll('.grr-input').forEach(i => i.value = '');
        runGrrAnalysis();
    });
    document.getElementById('btn-grr-copy')?.addEventListener('click', () => copyGrrFormat(false));
    document.getElementById('btn-grr-copy-t')?.addEventListener('click', () => copyGrrFormat(true));
    document.getElementById('btn-grr-paste')?.addEventListener('click', pasteGrrFromClipboard);
}

function setupGrrPresets() {
    const presetButtons = document.querySelectorAll('[data-grr-preset]');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            presetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const preset = btn.getAttribute('data-grr-preset');
            applyGrrPreset(preset);
        });
    });
}

function applyGrrPreset(preset) {
    const uslInput = document.getElementById('grr-usl');
    const lslInput = document.getElementById('grr-lsl');
    const partStdInput = document.getElementById('sim-part-std');
    const errStdInput = document.getElementById('sim-error-std');
    const stepInput = document.getElementById('grr-step');
    const digitsInput = document.getElementById('grr-digits');

    uslInput.value = '10.10';
    lslInput.value = '9.90';
    digitsInput.value = '3';

    if (preset === 'ideal') {
        // Ideal: %GRR < 10%, ndc >= 10
        partStdInput.value = '0.040';
        errStdInput.value = '0.003';
        stepInput.value = '0.001';
    } else if (preset === 'operator_bias') {
        // Operator Bias: High Reproducibility error (%GRR ~ 30-35%)
        partStdInput.value = '0.030';
        errStdInput.value = '0.004';
        stepInput.value = '0.001';
    } else if (preset === 'gauge_error') {
        // High Equipment Variation: EV dominates (%GRR ~ 32%)
        partStdInput.value = '0.025';
        errStdInput.value = '0.012';
        stepInput.value = '0.001';
    } else if (preset === 'coarse_res') {
        // Coarse Resolution: Rounding unit causes quantization bottleneck
        partStdInput.value = '0.030';
        errStdInput.value = '0.004';
        stepInput.value = '0.03';
        digitsInput.value = '2';
    }

    generateGrrData(preset);
}

function generateGrrData(forcedPreset) {
    const usl = parseFloat(document.getElementById('grr-usl').value) || 10.10;
    const lsl = parseFloat(document.getElementById('grr-lsl').value) || 9.90;
    const center = parseFloat(document.getElementById('sim-part-mean').value) || 10.00;
    const partStd = parseFloat(document.getElementById('sim-part-std').value) || 0.03;
    const errorStd = parseFloat(document.getElementById('sim-error-std').value) || 0.005;
    const digits = parseInt(document.getElementById('grr-digits').value) || 3;
    const step = parseFloat(document.getElementById('grr-step').value) || 0.001;
    const outOfSpec = document.getElementById('sim-out-of-spec')?.checked ?? true;

    // Out-of-spec sample placement if requested
    let forceHighIdx = -1, forceLowIdx = -1;
    if (outOfSpec) {
        forceHighIdx = 2; // Part 3
        forceLowIdx = 7;  // Part 8
    }

    // Generate part actual sizes
    const partMeans = [];
    for (let i = 0; i < 10; i++) {
        if (i === forceHighIdx) {
            partMeans.push(usl + (errorStd * 2.5));
        } else if (i === forceLowIdx) {
            partMeans.push(lsl - (errorStd * 2.5));
        } else {
            partMeans.push(generateNormalRandom(center, partStd));
        }
    }

    // Operator Biases (Reproducibility simulation)
    let opBiases = [0, 0, 0];
    if (forcedPreset === 'operator_bias') {
        opBiases = [-errorStd * 3.5, 0, errorStd * 3.5];
    } else {
        opBiases = [
            generateNormalRandom(0, errorStd * 0.4),
            generateNormalRandom(0, errorStd * 0.4),
            generateNormalRandom(0, errorStd * 0.4)
        ];
    }

    document.querySelectorAll('.grr-input').forEach(input => {
        const p = parseInt(input.dataset.part) - 1;
        const o = parseInt(input.dataset.op) - 1;

        let val = partMeans[p] + opBiases[o] + generateNormalRandom(0, errorStd);
        if (step > 0) {
            val = Math.round(val / step) * step;
        }
        input.value = val.toFixed(digits);
    });

    runGrrAnalysis();
}

function runGrrAnalysis() {
    const data = [];
    const usl = parseFloat(document.getElementById('grr-usl').value) || 10.10;
    const lsl = parseFloat(document.getElementById('grr-lsl').value) || 9.90;

    // Part means calculation
    const partSums = Array(10).fill(0);
    const partCounts = Array(10).fill(0);

    document.querySelectorAll('.grr-input').forEach(input => {
        const val = parseFloat(input.value);
        const p = parseInt(input.dataset.part);
        const o = parseInt(input.dataset.op);
        const t = parseInt(input.dataset.trial);

        if (!isNaN(val)) {
            partSums[p - 1] += val;
            partCounts[p - 1]++;

            // Out-of-Spec highlight
            if (val > usl || val < lsl) {
                input.style.color = 'var(--accent-danger)';
                input.style.fontWeight = 'bold';
                input.style.backgroundColor = 'rgba(225, 29, 72, 0.12)';
            } else {
                input.style.color = '';
                input.style.fontWeight = '';
                input.style.backgroundColor = '';
            }

            data.push({ part: p, op: o, trial: t, val: val });
        } else {
            input.style.color = '';
            input.style.fontWeight = '';
            input.style.backgroundColor = '';
        }
    });

    // Update Part Average row column
    for (let p = 1; p <= 10; p++) {
        const cell = document.getElementById(`grr-part-mean-${p}`);
        if (cell) {
            if (partCounts[p - 1] > 0) {
                const avg = partSums[p - 1] / partCounts[p - 1];
                cell.textContent = avg.toFixed(3);
                cell.style.fontFamily = 'var(--font-mono)';
                cell.style.fontSize = '0.8rem';
            } else {
                cell.textContent = '--';
            }
        }
    }

    if (data.length < 90) {
        if (data.length === 0) return;
    }

    currentGrrData = data;
    const results = calculateANOVA_GRR(data);
    currentGrrResults = results;
    updateGrrUI(results);
    renderGrrCharts(results, data);
    updateWhatIfPredictions(results);
}

function calculateANOVA_GRR(data) {
    const nPart = 10, nOp = 3, nTrial = 3;
    const N = data.length;

    const grandTotal = data.reduce((s, d) => s + d.val, 0);
    const grandMean = grandTotal / N;

    const partMeans = Array(nPart).fill(0).map((_, i) => {
        const subset = data.filter(d => d.part === i + 1);
        return subset.length ? subset.reduce((s, d) => s + d.val, 0) / subset.length : grandMean;
    });

    const opMeans = Array(nOp).fill(0).map((_, i) => {
        const subset = data.filter(d => d.op === i + 1);
        return subset.length ? subset.reduce((s, d) => s + d.val, 0) / subset.length : grandMean;
    });

    const cellMeans = {};
    data.forEach(d => {
        const key = `${d.part}-${d.op}`;
        if (!cellMeans[key]) cellMeans[key] = { sum: 0, count: 0 };
        cellMeans[key].sum += d.val;
        cellMeans[key].count++;
    });
    Object.keys(cellMeans).forEach(k => cellMeans[k] = cellMeans[k].sum / cellMeans[k].count);

    let ssTotal = data.reduce((s, d) => s + Math.pow(d.val - grandMean, 2), 0);
    let ssPart = nOp * nTrial * partMeans.reduce((s, m) => s + Math.pow(m - grandMean, 2), 0);
    let ssOp = nPart * nTrial * opMeans.reduce((s, m) => s + Math.pow(m - grandMean, 2), 0);

    let ssInteraction = 0;
    for (let p = 1; p <= nPart; p++) {
        for (let o = 1; o <= nOp; o++) {
            const mPO = cellMeans[`${p}-${o}`] || grandMean;
            ssInteraction += nTrial * Math.pow(mPO - partMeans[p-1] - opMeans[o-1] + grandMean, 2);
        }
    }

    let ssError = Math.max(0, ssTotal - ssPart - ssOp - ssInteraction);

    const dfPart = nPart - 1;
    const dfOp = nOp - 1;
    const dfInteraction = (nPart - 1) * (nOp - 1);
    const dfError = nPart * nOp * (nTrial - 1);

    const msPart = ssPart / dfPart;
    const msOp = ssOp / dfOp;
    const msInteraction = ssInteraction / dfInteraction;
    const msError = ssError / dfError;

    // Variance Components
    const varRepeat = msError; // EV
    const varInteraction = Math.max(0, (msInteraction - msError) / nTrial);
    const varReproducibility = Math.max(0, (msOp - msInteraction) / (nPart * nTrial)) + varInteraction; // AV
    const varGRR = varRepeat + varReproducibility;
    const varPart = Math.max(0, (msPart - msInteraction) / (nOp * nTrial)); // PV
    const varTotal = varGRR + varPart;

    const stdGRR = Math.sqrt(varGRR);
    const stdRepeat = Math.sqrt(varRepeat);
    const stdReprod = Math.sqrt(varReproducibility);
    const stdPart = Math.sqrt(varPart);
    const stdTotal = Math.sqrt(varTotal);

    const percentGRR = (stdGRR / stdTotal) * 100;
    const percentRepeat = (stdRepeat / stdTotal) * 100;
    const percentReprod = (stdReprod / stdTotal) * 100;
    const percentPart = (stdPart / stdTotal) * 100;

    const usl = parseFloat(document.getElementById('grr-usl').value) || 10.10;
    const lsl = parseFloat(document.getElementById('grr-lsl').value) || 9.90;
    const tolerance = Math.abs(usl - lsl) || 0.20;
    const ptRatio = (6 * stdGRR / tolerance) * 100;

    const ndc = 1.41 * (stdPart / stdGRR);

    return {
        varRepeat, varReproducibility, varPart, varTotal, varGRR,
        stdRepeat, stdReprod, stdPart, stdGRR, stdTotal,
        percentGRR, percentRepeat, percentReprod, percentPart,
        ptRatio, ndc, tolerance
    };
}

function updateGrrUI(res) {
    document.getElementById('stat-grr-val').textContent = res.percentGRR.toFixed(1) + '%';
    document.getElementById('stat-pt-val').textContent = res.ptRatio.toFixed(1) + '%';
    document.getElementById('stat-ndc-val').textContent = res.ndc.toFixed(1);
    document.getElementById('stat-pv-val').textContent = res.percentPart.toFixed(1) + '%';

    const statusBadge = document.getElementById('stat-grr-badge');
    const cardGrr = document.getElementById('card-grr-percent');

    if (res.percentGRR < 10) {
        statusBadge.className = 'grr-status-badge acceptable';
        statusBadge.textContent = '合格 (< 10%)';
        cardGrr.style.borderTopColor = 'var(--accent-actual)';
    } else if (res.percentGRR <= 30) {
        statusBadge.className = 'grr-status-badge marginal';
        statusBadge.textContent = '条件付妥当 (10〜30%)';
        cardGrr.style.borderTopColor = 'var(--accent-warn)';
    } else {
        statusBadge.className = 'grr-status-badge unacceptable';
        statusBadge.textContent = '改善必要 (> 30%)';
        cardGrr.style.borderTopColor = 'var(--accent-danger)';
    }

    // Diagnostic alerts
    const alerts = document.getElementById('grr-alerts');
    alerts.innerHTML = '';

    const step = parseFloat(document.getElementById('grr-step').value) || 0.01;
    if (step > res.tolerance / 10) {
        alerts.innerHTML += `
            <div class="warning-text" style="background:rgba(225,29,72,0.08); border-left-color:var(--accent-danger);">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span><strong>測定器の分解能が粗すぎます:</strong> 分解能 (${step}) が公差範囲 (${res.tolerance.toFixed(2)}) の1/10を超えています。測定器の桁数向上を推奨します。</span>
            </div>`;
    }
    if (res.ndc < 5) {
        alerts.innerHTML += `
            <div class="warning-text" style="background:rgba(217,119,6,0.08); border-left-color:var(--accent-warn); margin-top:4px;">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span><strong>有効区分数 (ndc) 不足:</strong> ndc = ${res.ndc.toFixed(1)} &lt; 5 です。部品間の真の差異を見分ける解像度が不足しています。</span>
            </div>`;
    }
}

function updateWhatIfPredictions(res) {
    const step = parseFloat(document.getElementById('grr-step').value) || 0.01;
    const quantizationVar = Math.pow(step, 2) / 12;

    // Option A: 1/10 Resolution
    const varErrorNewA = Math.max(0.000001, res.varRepeat - quantizationVar + Math.pow(step / 10, 2) / 12);
    const varGRR_A = varErrorNewA + res.varReproducibility;
    const predPercentA = (Math.sqrt(varGRR_A) / Math.sqrt(varGRR_A + res.varPart)) * 100;

    // Option B: Error variance halved (EV reduced by 50% => variance becomes 0.25)
    const varErrorNewB = res.varRepeat * 0.25;
    const varGRR_B = varErrorNewB + res.varReproducibility;
    const predPercentB = (Math.sqrt(varGRR_B) / Math.sqrt(varGRR_B + res.varPart)) * 100;

    const elA = document.getElementById('pred-grr-a');
    const elB = document.getElementById('pred-grr-b');
    if (elA) elA.textContent = predPercentA.toFixed(1);
    if (elB) elB.textContent = predPercentB.toFixed(1);
}

function initGrrCharts() {
    initGrrCompChart();
    initGrrPartOpChart();
}

function initGrrCompChart() {
    const canvas = document.getElementById('grr-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (grrChart) {
        try { grrChart.destroy(); } catch (e) {}
        grrChart = null;
    }

    grrChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total GR&R', 'Repeatability (EV)', 'Reproducibility (AV)', 'Part-to-Part (PV)'],
            datasets: [
                {
                    label: '%Study Var (対全変動比)',
                    data: [0, 0, 0, 0],
                    backgroundColor: 'rgba(59, 130, 246, 0.75)',
                    borderColor: '#3b82f6',
                    borderWidth: 1.5,
                    borderRadius: 4
                },
                {
                    label: '%Tolerance (対公差比 P/T)',
                    data: [0, 0, 0, 0],
                    backgroundColor: 'rgba(20, 184, 166, 0.75)',
                    borderColor: '#14b8a6',
                    borderWidth: 1.5,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: '% (Percentage)' },
                    grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
                    ticks: { font: { family: "'JetBrains Mono', monospace", size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11, family: "'Inter', sans-serif" } }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { boxWidth: 12, usePointStyle: true }
                },
                annotation: {
                    annotations: {
                        line10: {
                            type: 'line',
                            yMin: 10, yMax: 10,
                            borderColor: 'rgba(20, 184, 166, 0.8)',
                            borderWidth: 1.5,
                            borderDash: [4, 4],
                            label: {
                                content: '10% 合格ライン',
                                display: true,
                                position: 'end',
                                backgroundColor: 'rgba(20, 184, 166, 0.85)',
                                color: '#ffffff',
                                font: { size: 9 }
                            }
                        },
                        line30: {
                            type: 'line',
                            yMin: 30, yMax: 30,
                            borderColor: 'rgba(217, 119, 6, 0.8)',
                            borderWidth: 1.5,
                            borderDash: [4, 4],
                            label: {
                                content: '30% 限界ライン',
                                display: true,
                                position: 'end',
                                backgroundColor: 'rgba(217, 119, 6, 0.85)',
                                color: '#ffffff',
                                font: { size: 9 }
                            }
                        }
                    }
                }
            }
        }
    });
}

function initGrrPartOpChart() {
    const canvas = document.getElementById('grr-part-op-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (grrPartOpChart) {
        try { grrPartOpChart.destroy(); } catch (e) {}
        grrPartOpChart = null;
    }

    grrPartOpChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10'],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                y: {
                    title: { display: true, text: '測定値 (Measured Value)' },
                    grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
                    ticks: { font: { family: "'JetBrains Mono', monospace", size: 10 } }
                },
                x: {
                    title: { display: true, text: '部品番号 (Part)' },
                    grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
                    ticks: { font: { family: "'JetBrains Mono', monospace", size: 10 } }
                }
            },
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, usePointStyle: true } }
            }
        }
    });
}

function renderGrrCharts(res, data) {
    // 1. Components chart
    if (grrChart) {
        const ptRepeat = (6 * res.stdRepeat / res.tolerance) * 100;
        const ptReprod = (6 * res.stdReprod / res.tolerance) * 100;
        const ptPart = (6 * res.stdPart / res.tolerance) * 100;

        grrChart.data.datasets[0].data = [
            Math.min(100, res.percentGRR),
            Math.min(100, res.percentRepeat),
            Math.min(100, res.percentReprod),
            Math.min(100, res.percentPart)
        ];
        grrChart.data.datasets[1].data = [
            Math.min(100, res.ptRatio),
            Math.min(100, ptRepeat),
            Math.min(100, ptReprod),
            Math.min(100, ptPart)
        ];
        grrChart.update('none');
    }

    // 2. Part x Operator Plot
    if (grrPartOpChart && data.length > 0) {
        const opColors = ['#2563eb', '#14b8a6', '#d97706'];
        const datasets = [];

        for (let o = 1; o <= 3; o++) {
            const opData = [];
            for (let p = 1; p <= 10; p++) {
                const trials = data.filter(d => d.part === p && d.op === o);
                if (trials.length > 0) {
                    const avg = trials.reduce((s, t) => s + t.val, 0) / trials.length;
                    opData.push(avg);
                } else {
                    opData.push(null);
                }
            }

            datasets.push({
                type: 'line',
                label: `作業者 ${o} (Op ${o} 平均)`,
                data: opData,
                borderColor: opColors[o - 1],
                backgroundColor: opColors[o - 1],
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.2
            });
        }

        grrPartOpChart.data.datasets = datasets;
        grrPartOpChart.update('none');
    }
}

window.switchGrrChart = function(type) {
    const btnComp = document.getElementById('btn-grr-view-comp');
    const btnPartOp = document.getElementById('btn-grr-view-partop');
    const compBox = document.getElementById('grr-chart-comp-container');
    const partOpBox = document.getElementById('grr-chart-partop-container');

    if (!btnComp || !btnPartOp || !compBox || !partOpBox) return;

    if (type === 'comp') {
        btnComp.classList.add('active');
        btnPartOp.classList.remove('active');
        compBox.style.display = 'block';
        partOpBox.style.display = 'none';
        if (grrChart) grrChart.resize();
    } else {
        btnComp.classList.remove('active');
        btnPartOp.classList.add('active');
        compBox.style.display = 'none';
        partOpBox.style.display = 'block';
        if (grrPartOpChart) grrPartOpChart.resize();
    }
};

function copyGrrFormat(transpose) {
    if (currentGrrData.length === 0) return;
    const grid = Array.from({length: 10}, () => Array(9).fill(""));
    currentGrrData.forEach(d => {
        const row = d.part - 1;
        const col = ((d.op - 1) * 3) + (d.trial - 1);
        grid[row][col] = d.val;
    });

    let tsv = "";
    if (!transpose) {
        tsv = "Part\tOp1_Tr1\tOp1_Tr2\tOp1_Tr3\tOp2_Tr1\tOp2_Tr2\tOp2_Tr3\tOp3_Tr1\tOp3_Tr2\tOp3_Tr3\n";
        for (let p = 0; p < 10; p++) {
            tsv += `${p + 1}\t${grid[p].join('\t')}\n`;
        }
    } else {
        tsv = "Operator_Trial\tP1\tP2\tP3\tP4\tP5\tP6\tP7\tP8\tP9\tP10\n";
        const opTrialLabels = [
            "Op1_Tr1", "Op1_Tr2", "Op1_Tr3",
            "Op2_Tr1", "Op2_Tr2", "Op2_Tr3",
            "Op3_Tr1", "Op3_Tr2", "Op3_Tr3"
        ];
        for (let c = 0; c < 9; c++) {
            tsv += opTrialLabels[c];
            for (let r = 0; r < 10; r++) {
                tsv += `\t${grid[r][c]}`;
            }
            tsv += "\n";
        }
    }

    navigator.clipboard.writeText(tsv).then(() => {
        const btnId = transpose ? 'btn-grr-copy-t' : 'btn-grr-copy';
        const btn = document.getElementById(btnId);
        if (btn) {
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> コピー完了';
            setTimeout(() => btn.innerHTML = orig, 1500);
        }
    });
}

async function pasteGrrFromClipboard() {
    try {
        let text = '';
        if (navigator.clipboard && navigator.clipboard.readText) {
            text = await navigator.clipboard.readText();
        } else {
            text = prompt('Excelからコピーした表データ(10行×9列)を貼り付けてください:') || '';
        }
        if (!text.trim()) return;

        const lines = text.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
        // If header included, skip first line
        const rows = lines.map(line => line.split(/\t|,/).map(s => parseFloat(s.trim())));
        const dataRows = rows.filter(r => r.some(v => !isNaN(v)));

        let targetP = 1;
        dataRows.forEach(row => {
            const validCols = row.filter(v => !isNaN(v));
            if (validCols.length >= 9 && targetP <= 10) {
                for (let i = 0; i < 9; i++) {
                    const op = Math.floor(i / 3) + 1;
                    const tr = (i % 3) + 1;
                    const input = document.querySelector(`.grr-input[data-part="${targetP}"][data-op="${op}"][data-trial="${tr}"]`);
                    if (input) input.value = validCols[i];
                }
                targetP++;
            }
        });

        runGrrAnalysis();
    } catch (err) {
        console.warn('GR&R paste error', err);
    }
}

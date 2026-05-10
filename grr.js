// --- Gauge R&R Simulator Core ---
let grrChart = null;
let currentGrrData = [];

function initGrrSimulator() {
    setupGrrTable();
    setupGrrButtons();
    initGrrChart();
    // No initial calc until Data is generated or entered
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
        tr.innerHTML = html;
        tbody.appendChild(tr);
    }
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
    document.getElementById('btn-grr-improve')?.addEventListener('click', planGrrImprovement);
}

function generateGrrData() {
    const usl = parseFloat(document.getElementById('grr-usl').value);
    const lsl = parseFloat(document.getElementById('grr-lsl').value);
    const center = parseFloat(document.getElementById('sim-part-mean').value);
    const partStd = parseFloat(document.getElementById('sim-part-std').value);
    const errorStd = parseFloat(document.getElementById('sim-error-std').value);
    const digits = parseInt(document.getElementById('grr-digits').value);
    const step = parseFloat(document.getElementById('grr-step').value);
    const outOfSpec = document.getElementById('sim-out-of-spec').checked;

    // Determine which parts to force OOS if needed
    let forceHighIndex = -1;
    let forceLowIndex = -1;
    if (outOfSpec) {
        const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        forceHighIndex = indices[0];
        forceLowIndex = indices[1];
    }

    // Generate part centers
    const partMeans = [];
    for (let i = 0; i < 10; i++) {
        if (i === forceHighIndex) {
            // Force part to be reliably above USL
            partMeans.push(usl + (errorStd * 3) + Math.abs(generateNormalRandom(0, partStd / 4)));
        } else if (i === forceLowIndex) {
            // Force part to be reliably below LSL
            partMeans.push(lsl - (errorStd * 3) - Math.abs(generateNormalRandom(0, partStd / 4)));
        } else {
            partMeans.push(generateNormalRandom(center, partStd));
        }
    }

    // Operator Biases (Reproducibility simulation)
    const opBiases = [
        generateNormalRandom(0, errorStd * 0.5),
        generateNormalRandom(0, errorStd * 0.5),
        generateNormalRandom(0, errorStd * 0.5)
    ];

    document.querySelectorAll('.grr-input').forEach(input => {
        const p = parseInt(input.dataset.part) - 1;
        const o = parseInt(input.dataset.op) - 1;
        
        let val = partMeans[p] + opBiases[o] + generateNormalRandom(0, errorStd);
        
        // Rounding logic
        if (step > 0) {
            val = Math.round(val / step) * step;
        }
        input.value = val.toFixed(digits);
    });

    runGrrAnalysis();
}

function runGrrAnalysis() {
    const data = [];
    const usl = parseFloat(document.getElementById('grr-usl').value);
    const lsl = parseFloat(document.getElementById('grr-lsl').value);

    document.querySelectorAll('.grr-input').forEach(input => {
        const val = parseFloat(input.value);
        if (!isNaN(val)) {
            // Highlight Out-of-Spec data
            if (val > usl || val < lsl) {
                input.style.color = '#ef4444';
                input.style.fontWeight = 'bold';
                input.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            } else {
                input.style.color = '';
                input.style.fontWeight = '';
                input.style.backgroundColor = '';
            }

            data.push({
                part: parseInt(input.dataset.part),
                op: parseInt(input.dataset.op),
                trial: parseInt(input.dataset.trial),
                val: val
            });
        } else {
            input.style.color = '';
            input.style.fontWeight = '';
            input.style.backgroundColor = '';
        }
    });

    if (data.length < 90) {
         // Optionally handle incomplete data, but for simulation we expect 90
         if (data.length === 0) return;
    }

    const results = calculateANOVA_GRR(data);
    updateGrrUI(results);
    renderGrrChart(results);
    currentGrrData = data;
    generateGrrCsv(data, false);
}

function calculateANOVA_GRR(data) {
    const nPart = 10, nOp = 3, nTrial = 3;
    const N = data.length;
    
    // Means
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
    
    const cellMeans = {}; // Part x Op
    data.forEach(d => {
        const key = `${d.part}-${d.op}`;
        if (!cellMeans[key]) cellMeans[key] = { sum: 0, count: 0 };
        cellMeans[key].sum += d.val;
        cellMeans[key].count++;
    });
    Object.keys(cellMeans).forEach(k => cellMeans[k] = cellMeans[k].sum / cellMeans[k].count);

    // Sum of Squares
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

    // Degrees of Freedom
    const dfPart = nPart - 1;
    const dfOp = nOp - 1;
    const dfInteraction = (nPart - 1) * (nOp - 1);
    const dfError = nPart * nOp * (nTrial - 1);
    
    // Mean Squares
    const msPart = ssPart / dfPart;
    const msOp = ssOp / dfOp;
    const msInteraction = ssInteraction / dfInteraction;
    const msError = ssError / dfError;

    // Variance Components
    const varRepeat = msError;
    const varInteraction = Math.max(0, (msInteraction - msError) / nTrial);
    const varReproducibility = Math.max(0, (msOp - msInteraction) / (nPart * nTrial)) + varInteraction;
    const varGRR = varRepeat + varReproducibility;
    const varPart = Math.max(0, (msPart - msInteraction) / (nOp * nTrial));
    const varTotal = varGRR + varPart;

    // Metrics
    const stdGRR = Math.sqrt(varGRR);
    const stdTotal = Math.sqrt(varTotal);
    const percentGRR = (stdGRR / stdTotal) * 100;
    
    const usl = parseFloat(document.getElementById('grr-usl').value);
    const lsl = parseFloat(document.getElementById('grr-lsl').value);
    const tolerance = usl - lsl;
    const ptRatio = (6 * stdGRR / tolerance) * 100;
    
    const ndc = 1.41 * (Math.sqrt(varPart / varGRR));

    return {
        varRepeat, varReproducibility, varPart, varTotal,
        percentGRR, ptRatio, ndc,
        msError, msInteraction, msOp, msPart
    };
}

function updateGrrUI(res) {
    document.getElementById('stat-grr-val').textContent = res.percentGRR.toFixed(1) + '%';
    document.getElementById('stat-ndc-val').textContent = res.ndc.toFixed(1);

    const cardGrr = document.getElementById('card-grr-percent');
    
    // Simple color coding
    if (res.percentGRR < 10) cardGrr.style.borderColor = 'var(--accent-actual)';
    else if (res.percentGRR < 30) cardGrr.style.borderColor = '#fbbf24';
    else cardGrr.style.borderColor = '#ef4444';

    // Warnings
    const alerts = document.getElementById('grr-alerts');
    alerts.innerHTML = '';
    
    const step = parseFloat(document.getElementById('grr-step').value);
    const usl = parseFloat(document.getElementById('grr-usl').value);
    const lsl = parseFloat(document.getElementById('grr-lsl').value);
    
    const tol = Math.abs(usl - lsl);
    const stdError = Math.sqrt(res.varRepeat);
    
    if (step > tol / 10) {
        alerts.innerHTML += `<div class="warning-text" style="background: rgba(239, 68, 68, 0.1); border-left-color: #ef4444;">
            <i class="fa-solid fa-triangle-exclamation"></i> 
            <span data-i18n="warn_res_tol_fail">測定器の分解能が不十分です。分解能は公差範囲の1/10以下が推奨されます。</span>
        </div>`;
    } else if (step > stdError) {
        alerts.innerHTML += `<div class="warning-text" style="background: rgba(16, 185, 129, 0.1); border-left-color: #10b981;">
            <i class="fa-solid fa-circle-check" style="color: #10b981;"></i> 
            <span data-i18n="warn_res_var_fail">分解能は公差に対しては十分（合格）ですが、測定ばらつきに対しては少し粗めです。</span>
        </div>`;
    }

    if (res.ndc < 5) {
        alerts.innerHTML += `<div class="warning-text" style="background: rgba(239, 68, 68, 0.1); border-left-color: #ef4444; margin-top: 5px;">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>サンプルのばらつきが小さすぎるか、測定誤差が大きすぎます (ndc < 5)。</span>
        </div>`;
    }
}

function initGrrChart() {
    const ctx = document.getElementById('grr-chart').getContext('2d');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    grrChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['%GR&R (Study Variation)'],
            datasets: [
                { label: 'Repeatability', data: [0], backgroundColor: '#3b82f6' },
                { label: 'Reproducibility', data: [0], backgroundColor: '#8b5cf6' }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true, max: 100, title: { display: true, text: '%' }, grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
                y: { stacked: true }
            },
            plugins: {
                annotation: {
                    annotations: {
                        line10: {
                            type: 'line',
                            xMin: 10, xMax: 10,
                            borderColor: 'rgba(239, 68, 68, 0.5)',
                            borderWidth: 2, borderDash: [4, 4],
                            label: { content: '10% Limit', display: true, position: 'end' }
                        },
                        line30: {
                            type: 'line',
                            xMin: 30, xMax: 30,
                            borderColor: 'rgba(250, 204, 21, 0.8)',
                            borderWidth: 2, borderDash: [4, 4],
                            label: { content: '30% Acceptable', display: true, position: 'end', backgroundColor: 'rgba(250, 204, 21, 0.9)', color: '#000' }
                        }
                    }
                }
            }
        }
    });
}

function renderGrrChart(res) {
    if (!grrChart) return;
    
    // Dynamically update annotation labels based on selected language
    const lang = document.getElementById('lang-select')?.value || 'ja';
    const dict = i18n[lang] || i18n.ja;
    
    if (grrChart.options.plugins.annotation) {
        grrChart.options.plugins.annotation.annotations.line10.label.content = dict.chart_10_label;
        grrChart.options.plugins.annotation.annotations.line30.label.content = dict.chart_30_label;
    }

    const varGRR = res.varRepeat + res.varReproducibility;
    const lenRepeat = varGRR > 0 ? (res.varRepeat / varGRR) * res.percentGRR : 0;
    const lenReprod = varGRR > 0 ? (res.varReproducibility / varGRR) * res.percentGRR : 0;

    grrChart.data.datasets[0].data = [lenRepeat];
    grrChart.data.datasets[1].data = [lenReprod];
    grrChart.update();
}

function generateGrrCsv(data, transpose = false) {
    const lang = document.getElementById('lang-select')?.value || 'ja';
    const dict = i18n[lang] || i18n.ja;
    
    const partLabel = dict.part_label || 'Part';
    const op1 = dict.op1_label || 'Op 1';
    const op2 = dict.op2_label || 'Op 2';
    const op3 = dict.op3_label || 'Op 3';
    const tr1 = dict.tr1_label || 'Tr 1';
    const tr2 = dict.tr2_label || 'Tr 2';
    const tr3 = dict.tr3_label || 'Tr 3';

    let tsv = "";
    const grid = Array.from({length: 10}, () => Array(9).fill(""));
    data.forEach(d => {
        const row = d.part - 1;
        const col = ((d.op - 1) * 3) + (d.trial - 1);
        grid[row][col] = d.val;
    });

    if (!transpose) {
        tsv = `${partLabel}\t${op1}\t\t\t${op2}\t\t\t${op3}\t\t\n`;
        tsv += `\t${tr1}\t${tr2}\t${tr3}\t${tr1}\t${tr2}\t${tr3}\t${tr1}\t${tr2}\t${tr3}\n`;
        for (let p = 0; p < 10; p++) {
            tsv += `${p + 1}\t${grid[p].join('\t')}\n`;
        }
    } else {
        const ops = [op1, op1, op1, op2, op2, op2, op3, op3, op3];
        const trs = [tr1, tr2, tr3, tr1, tr2, tr3, tr1, tr2, tr3];
        
        tsv = `${partLabel}\t1\t2\t3\t4\t5\t6\t7\t8\t9\t10\n`;
        for (let c = 0; c < 9; c++) {
            tsv += `${ops[c]} ${trs[c]}`;
            for (let r = 0; r < 10; r++) {
                tsv += `\t${grid[r][c]}`;
            }
            tsv += "\n";
        }
    }

    const area = document.getElementById('grr-csv-output');
    if (area) area.value = tsv;
}

function copyGrrFormat(transpose) {
    if (currentGrrData.length === 0) return;
    generateGrrCsv(currentGrrData, transpose);
    
    const text = document.getElementById('grr-csv-output').value;
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            const btnId = transpose ? 'btn-grr-copy-t' : 'btn-grr-copy';
            const btn = document.getElementById(btnId);
            if (btn) {
                const icon = btn.querySelector('i');
                const originalClass = icon.className;
                icon.className = 'fa-solid fa-check';
                setTimeout(() => icon.className = originalClass, 1500);
            }
        });
    }
}

function planGrrImprovement() {
    const currentRes = runGrrAnalysisSilent();
    if (!currentRes) return;

    const vessel = document.getElementById('improvement-vessel');
    vessel.innerHTML = `
        <div class="panel improvement-panel fade-in" style="border-top: 4px solid var(--primary-color);">
            <h3><i class="fa-solid fa-lightbulb"></i> <span data-i18n="imp_prop_title">Improvement Proposals</span></h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="suggest-card">
                    <h4 data-i18n="imp_opt_a">Option A: Resolve Precision Bottleneck</h4>
                    <p data-i18n="imp_opt_a_desc">If resolution improved to 1/10 of current rounding unit:</p>
                    <div class="predicted-val"><span data-i18n="est_grr">Estimated %GRR: </span><span id="pred-grr-a">--</span>%</div>
                </div>
                <div class="suggest-card">
                    <h4 data-i18n="imp_opt_b">Option B: Reduce Equipment Variation</h4>
                    <p data-i18n="imp_opt_b_desc">If repeatability variation (σ_error) is halved:</p>
                    <div class="predicted-val"><span data-i18n="est_grr">Estimated %GRR: </span><span id="pred-grr-b">--</span>%</div>
                </div>
            </div>
        </div>
    `;
    
    // Apply translations to the newly generated content
    const langCode = document.getElementById('lang-select')?.value || 'ja';
    applyTranslation(langCode);


    // Simple predictions
    const varErrorNewA = currentRes.varRepeat; // resolution impact is hard to predict without raw data, but improving it mostly affects quantization bias.
    // Actually, improvement simulation should re-run generators or use math.
    // Let's use current variance components and adjust them.
    
    // Halving error variation
    const varErrorNewB = currentRes.varRepeat * 0.25; // std halved => variance becomes 1/4
    const varGRR_B = varErrorNewB + currentRes.varReproducibility;
    const predPercentB = (Math.sqrt(varGRR_B) / Math.sqrt(varGRR_B + currentRes.varPart)) * 100;
    
    // Improving resolution often fixes "Quantization Error" which is approx delta^2 / 12
    const step = parseFloat(document.getElementById('grr-step').value);
    const quantizationVar = Math.pow(step, 2) / 12;
    const varErrorNewA_calc = Math.max(0.000001, currentRes.varRepeat - quantizationVar); 
    const varGRR_A = varErrorNewA_calc + currentRes.varReproducibility;
    const predPercentA = (Math.sqrt(varGRR_A) / Math.sqrt(varGRR_A + currentRes.varPart)) * 100;

    document.getElementById('pred-grr-a').textContent = predPercentA.toFixed(1);
    document.getElementById('pred-grr-b').textContent = predPercentB.toFixed(1);
}

function runGrrAnalysisSilent() {
    const data = [];
    document.querySelectorAll('.grr-input').forEach(input => {
        const val = parseFloat(input.value);
        if (!isNaN(val)) {
            data.push({ part: parseInt(input.dataset.part), op: parseInt(input.dataset.op), trial: parseInt(input.dataset.trial), val: val });
        }
    });
    if (data.length < 90) return null;
    return calculateANOVA_GRR(data);
}

// ============================================

// --- Routing, Theme & i18n Management ---
const i18n = {
    ja: {
        portal_title: "エンジニアリング ツールポータル",
        portal_desc: "現場で使える直感的な技術計算シミュレーター",
        cpk_app_title: "プロセス・キャパビリティ (Cpk) シミュレーター",
        cpk_app_desc: "工程能力の直感的な理解とデータの実力値を理論値と重ねて分析・比較できるツール。",
        grr_app_title: "ゲージR&R アナライザー",
        back_home: "ホームへ戻る",
        cpk_title: "プロセス・キャパビリティ シミュレーター",
        warning_text: "教育目的以外の使用は禁止します。企業でも教育目的であれば可です。生成したシミュレーションデータの悪用はしないでください",
        usl_label: "規格上限 (USL)",
        lsl_label: "規格下限 (LSL)",
        mean_label: "理論平均 (μ)",
        std_label: "理論標準偏差 (σ)",
        gen_settings: "生成設定",
        gen_n: "N数(≤50)",
        gen_decimals: "小数桁数",
        gen_step: "丸め刻み",
        btn_gen: "ランダム生成",
        btn_recalc: "特性値再計算",
        btn_apply: "実力値をスライダーに反映",
        data_label: "データ",
        data_val_label: "値 (Value)",
        theo_cpk: "理論 Cpk",
        act_cpk: "実力 Cpk",
        act_mean: "実力平均 (x̄)",
        act_std: "実力標準偏差 (s)",
        plot_type: "実績値の表示:",
        plot_scatter: "散布図 (Scatter)",
        plot_curve: "曲線 (Curve)",
        plot_hist: "ヒストグラム (Histogram)"
    },
    en: {
        portal_title: "Engineering Tools Portal",
        portal_desc: "Intuitive technical calculation simulators for the field",
        cpk_app_title: "Process Capability (Cpk) Simulator",
        cpk_app_desc: "Tool for intuitive understanding of process capability, overlaid with theoretical and actual data for analysis.",
        grr_app_title: "Gage R&R Analyzer",
        back_home: "Back to Home",
        cpk_title: "Process Capability Simulator",
        warning_text: "Use for non-educational purposes is prohibited. Corporate use is allowed if for educational purposes. Do not misuse the generated simulation data.",
        usl_label: "Upper Spec Limit (USL)",
        lsl_label: "Lower Spec Limit (LSL)",
        mean_label: "Theoretical Mean (μ)",
        std_label: "Theoretical Std Dev (σ)",
        gen_settings: "Generation Settings",
        gen_n: "Sample Size(≤50)",
        gen_decimals: "Decimals",
        gen_step: "Step/Rounding",
        btn_gen: "Random Generate",
        btn_recalc: "Recalculate Stats",
        btn_apply: "Apply Actual to Sliders",
        data_label: "Data",
        data_val_label: "Value",
        theo_cpk: "Theoretical Cpk",
        act_cpk: "Actual Cpk",
        act_mean: "Actual Mean (x̄)",
        act_std: "Actual Std Dev (s)",
        plot_type: "Plot Type:",
        plot_scatter: "Scatter Plot",
        plot_curve: "Curve",
        plot_hist: "Histogram"
    },
    es: {
        portal_title: "Portal de Herramientas de Ingeniería",
        portal_desc: "Simuladores de cálculo técnico intuitivos para el campo",
        cpk_app_title: "Simulador de Capacidad del Proceso (Cpk)",
        cpk_app_desc: "Herramienta para la comprensión intuitiva de la capacidad del proceso, superpuesta con datos teóricos y reales para su análisis.",
        grr_app_title: "Analizador Gage R&R",
        back_home: "Volver al inicio",
        cpk_title: "Simulador de Capacidad del Proceso",
        warning_text: "Se prohíbe el uso para fines no educativos. El uso corporativo está permitido si es con fines educativos. No haga mal uso de los datos de simulación generados.",
        usl_label: "Límite Espec. Superior (USL)",
        lsl_label: "Límite Espec. Inferior (LSL)",
        mean_label: "Media Teórica (μ)",
        std_label: "Desv. Estándar Teórica (σ)",
        gen_settings: "Ajustes de Generación",
        gen_n: "Muestra(≤50)",
        gen_decimals: "Decimales",
        gen_step: "Redondeo",
        btn_gen: "Generación Aleatoria",
        btn_recalc: "Recalcular Estadísticas",
        btn_apply: "Aplicar Real a Deslizadores",
        data_label: "Datos",
        data_val_label: "Valor",
        theo_cpk: "Cpk Teórico",
        act_cpk: "Cpk Real",
        act_mean: "Media Real (x̄)",
        act_std: "Desv. Estándar Real (s)",
        plot_type: "Tipo de Gráfico:",
        plot_scatter: "Gráfico de Dispersión",
        plot_curve: "Curva",
        plot_hist: "Histograma"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    initRouter();
    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // initial render
});

function initLanguage() {
    const langSelect = document.getElementById('lang-select');
    if (!langSelect) return;
    
    // Auto detect from browser if possible
    const browserLang = navigator.language.slice(0, 2);
    if (i18n[browserLang]) {
        langSelect.value = browserLang;
    }
    
    langSelect.addEventListener('change', (e) => {
        applyTranslation(e.target.value);
    });
}

function applyTranslation(langCode) {
    const dict = i18n[langCode] || i18n['ja'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });
}

function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    // Default to dark as requested
    let isDark = true;
    
    toggleBtn.addEventListener('click', () => {
        isDark = !isDark;
        html.setAttribute('data-theme', isDark ? 'dark' : 'light');
        toggleBtn.innerHTML = isDark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
        
        // Update Chart JS Colors dynamically if initialized
        if (window.cpkChart) {
            updateChartTheme(isDark);
        }
    });
}

function initRouter() {
    const mainContent = document.getElementById('app-content');
}

function handleRoute() {
    const hash = window.location.hash || '#home';
    const content = document.getElementById('app-content');
    
    if (hash === '#home') {
        renderTemplate('view-home', content);
    } else if (hash === '#cpk') {
        renderTemplate('view-cpk', content);
        initCpkSimulator();
    } else {
        window.location.hash = '#home'; // fallback
    }
    
    // Apply translations on route change
    const langCode = document.getElementById('lang-select')?.value || 'ja';
    applyTranslation(langCode);
}

function renderTemplate(templateId, targetElement) {
    const template = document.getElementById(templateId);
    if (!template) return;
    targetElement.innerHTML = '';
    targetElement.appendChild(template.content.cloneNode(true));
}

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
                navigator.clipboard.writeText(data.join('\n')).then(() => {
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

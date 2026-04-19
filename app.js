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
        plot_hist: "ヒストグラム (Histogram)",
        grr_app_desc: "測定器の分解能や繰り返し性・再現性が工程能力に与える影響を解析するツール。",
        grr_title: "ゲージR&R アナライザー (MSA)",
        settings: "設定",
        inst_settings: "測定器仕様",
        round_unit: "丸め単位 (Resolution)",
        part_var_label: "サンプルのばらつき (σ_part)",
        error_var_label: "測定誤差 (σ_error)",
        out_of_spec_label: "公差外データを生成",
        btn_improve: "改善案を表示",
        part_label: "部品",
        op1_label: "作業者 1",
        op2_label: "作業者 2",
        op3_label: "作業者 3",
        tr1_label: "回数 1",
        tr2_label: "回数 2",
        tr3_label: "回数 3",
        imp_prop_title: "改善案のシミュレーション",
        imp_opt_a: "案A: 分解能の向上",
        imp_opt_a_desc: "現在の1/10の丸め単位を使用した場合:",
        imp_opt_b: "案B: 測定誤差の低減",
        imp_opt_b_desc: "測定のばらつき(σ_error)が現在の半分になった場合:",
        est_grr: "予測 %GR&R: ",
        chart_10_label: "10% (十分 / Acceptable)",
        chart_30_label: "30% (改善必要 / Marginal)",
        formula_title: "計算式の定義 (ANOVA法)",
        warn_res_tol_fail: "測定器の分解能が不十分です。分解能は公差範囲の1/10以下が推奨されます。",
        warn_res_var_fail: "分解能は公差に対しては十分（合格）ですが、測定ばらつきに対しては少し粗めです。"
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
        plot_hist: "Histogram",
        grr_app_desc: "Tool to analyze the impact of gauge resolution, repeatability, and reproducibility on process capability.",
        grr_title: "Gage R&R Analyzer (MSA)",
        settings: "Settings",
        inst_settings: "Gauge Specs",
        round_unit: "Rounding Unit (Resolution)",
        part_var_label: "Part Variation (σ_part)",
        error_var_label: "Measurement Error (σ_error)",
        out_of_spec_label: "Generate OOS Data",
        btn_improve: "Show Improvement Proposal",
        part_label: "Part",
        op1_label: "Operator 1",
        op2_label: "Operator 2",
        op3_label: "Operator 3",
        tr1_label: "Trial 1",
        tr2_label: "Trial 2",
        tr3_label: "Trial 3",
        imp_prop_title: "Improvement Proposals",
        imp_opt_a: "Option A: Resolve Precision Bottleneck",
        imp_opt_a_desc: "If resolution improved to 1/10 of current rounding unit:",
        imp_opt_b: "Option B: Reduce Equipment Variation",
        imp_opt_b_desc: "If repeatability variation (σ_error) is halved:",
        est_grr: "Estimated %GR&R: ",
        chart_10_label: "10% (Acceptable)",
        chart_30_label: "30% (Needs Improvement)",
        formula_title: "Formula Definitions (ANOVA)",
        warn_res_tol_fail: "Insufficient resolution. Resolution should be ≤ 1/10 of tolerance.",
        warn_res_var_fail: "Resolution is acceptable for tolerance, but a bit coarse relative to variance."
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
        plot_hist: "Histograma",
        grr_app_desc: "Herramienta para analizar el impacto de la resolución del calibre, la repetibilidad y la reproducibilidad en la capacidad del proceso.",
        grr_title: "Analizador Gage R&R (MSA)",
        settings: "Ajustes",
        inst_settings: "Especificaciones del Calibre",
        round_unit: "Unidad de Redondeo (Resolución)",
        part_var_label: "Var. de Piezas (σ_part)",
        error_var_label: "Error de Medicion (σ_error)",
        out_of_spec_label: "Generar Datos OOS",
        btn_improve: "Mostrar Propuesta de Mejora",
        part_label: "Pieza",
        op1_label: "Operador 1",
        op2_label: "Operador 2",
        op3_label: "Operador 3",
        tr1_label: "Ensayo 1",
        tr2_label: "Ensayo 2",
        tr3_label: "Ensayo 3",
        imp_prop_title: "Propuestas de Mejora",
        imp_opt_a: "Opción A: Mejorar Resolución",
        imp_opt_a_desc: "Si la resolución mejorara a 1/10 de la unidad actual:",
        imp_opt_b: "Opción B: Reducir Variación de Equipo",
        imp_opt_b_desc: "Si la variación de repetibilidad (σ_error) se reduce a la mitad:",
        est_grr: "Estimado %GR&R: ",
        chart_10_label: "10% (Aceptable)",
        chart_30_label: "30% (Necesita Mejora)",
        formula_title: "Definiciones de Fórmulas (ANOVA)",
        warn_res_tol_fail: "Resolución insuficiente. Debe ser ≤ 1/10 de la tolerancia.",
        warn_res_var_fail: "La resolución es aceptable para la tolerancia, pero gruesa respecto a la variación."
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
    } else if (hash === '#grr') {
        renderTemplate('view-grr', content);
        initGrrSimulator();
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


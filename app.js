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
        warn_res_var_fail: "分解能は公差に対しては十分（合格）ですが、測定ばらつきに対しては少し粗めです。",
        gdt_title: "GD&T 位置度シミュレーター",
        gdt_app_desc: "3D空間と2D平面で位置度の概念を視覚化し、±公差との違いを学ぶツール。",
        gdt_ted_label: "理論的正確な寸法 (TED)",
        gdt_tol_label: "位置度公差 (T)",
        gdt_mmc_title: "最大実体公差方式 (MMC)",
        gdt_mmc_toggle: "MMC 適用 (Ⓜ)",
        gdt_mmc_limit: "MMC時の穴径 (最小許容径)",
        gdt_actual_hole: "実際の穴径測定値",
        gdt_bonus: "ボーナス公差:",
        gdt_total_tol: "実効位置度公差:",
        gdt_actual_meas: "実際の測定座標",
        btn_rand_meas: "ランダムズレ生成",
        gdt_3d_view: "3D 空間ビュー (ドラッグで回転)",
        gdt_2d_view: "2D 投影ビュー",
        gdt_deviation: "偏差 (ΔX, ΔY)",
        gdt_pos_error: "位置度ズレ量 (2×√ΔX²+ΔY²)",
        gdt_circle_tol: "位置度公差",
        gdt_box_tol: "±公差領域",
        gdt_act_pt: "測定点",
        gdt_warn_perfect: "合格 (位置度と±公差ともにクリア)",
        gdt_warn_corner: "⚠️ ±公差では四角の領域内ですが、位置度（円外）では不合格です！",
        gdt_warn_fail: "不合格 (公差範囲外)",
        gdt_stop_rot: "回転停止",
        gdt_start_rot: "回転開始"
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
        warn_res_var_fail: "Resolution is acceptable for tolerance, but a bit coarse relative to variance.",
        gdt_title: "GD&T Position Simulator",
        gdt_app_desc: "Visualize Position tolerances in 3D/2D and compare them with standard +/- tolerances.",
        gdt_ted_label: "True Position (TED)",
        gdt_tol_label: "Position Tolerance (T)",
        gdt_mmc_title: "Maximum Material Condition (MMC)",
        gdt_mmc_toggle: "Apply MMC (Ⓜ)",
        gdt_mmc_limit: "Hole Size at MMC",
        gdt_actual_hole: "Actual Hole Size",
        gdt_bonus: "Bonus Tolerance:",
        gdt_total_tol: "Total Position Tol:",
        gdt_actual_meas: "Actual Coordinates",
        btn_rand_meas: "Generate Random Dev",
        gdt_3d_view: "3D View (Drag to rotate)",
        gdt_2d_view: "2D Projection",
        gdt_deviation: "Deviation (ΔX, ΔY)",
        gdt_pos_error: "Position Error (2×√ΔX²+ΔY²)",
        gdt_circle_tol: "Pos Tol (Circle)",
        gdt_box_tol: "+/- Tol (Square)",
        gdt_act_pt: "Measured Point",
        gdt_warn_perfect: "Pass (Within both boundaries)",
        gdt_warn_corner: "⚠️ Passes +/- boundary (in square corner), but Fails Position (Outside circle)!",
        gdt_warn_fail: "Fail (Outside boundaries)",
        gdt_stop_rot: "Stop Rotation",
        gdt_start_rot: "Start Rotation"
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
        warn_res_var_fail: "La resolución es aceptable para la tolerancia, pero gruesa respecto a la variación.",
        gdt_title: "GD&T Simulador de Posición",
        gdt_app_desc: "Visualizar tolerancia de posición en 3D/2D y comparar con tolerancias +/-.",
        gdt_ted_label: "Posición Verdadera (TED)",
        gdt_tol_label: "Tolerancia de Posición (T)",
        gdt_mmc_title: "Condición de Máximo Material (MMC)",
        gdt_mmc_toggle: "Aplicar MMC (Ⓜ)",
        gdt_mmc_limit: "Agujero en MMC",
        gdt_actual_hole: "Agujero Real",
        gdt_bonus: "Tol. de Bonificación:",
        gdt_total_tol: "Tol. de Posición Total:",
        gdt_actual_meas: "Coordenadas Reales",
        btn_rand_meas: "Generar Desv. Aleatoria",
        gdt_3d_view: "Vista 3D (Arrastrar)",
        gdt_2d_view: "Proyección 2D",
        gdt_deviation: "Desviación (ΔX, ΔY)",
        gdt_pos_error: "Error de Posición (2×√ΔX²+ΔY²)",
        gdt_circle_tol: "Tol. Posición (Círculo)",
        gdt_box_tol: "+/- Tol (Cuadrado)",
        gdt_act_pt: "Punto Medido",
        gdt_warn_perfect: "Aceptado (Dentro de ambos)",
        gdt_warn_corner: "⚠️ Aceptado en +/-, ¡pero Falla Posición (fuera del círculo)!",
        gdt_warn_fail: "Falla (Fuera de límites)",
        gdt_stop_rot: "Detener Rotación",
        gdt_start_rot: "Iniciar Rotación"
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
    } else if (hash === '#gdt-position') {
        renderTemplate('view-gdt', content);
        initGdtSimulator();
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

// ============================================
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
    const devEl = document.getElementById('gdt-stat-dev');
    if (devEl) {
        devEl.innerText = `${dx>0?'+':''}${dx.toFixed(3)}, ${dy>0?'+':''}${dy.toFixed(3)}`;
    }
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
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
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

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
        gdt_start_rot: "回転開始",
        gdt_tol_type_label: "公差表示タイプ",
        gdt_notation_title: "公差表記",
        symbol_app_title: "記号・アイコン コンバイナー",
        symbol_app_desc: "記号と文字を組み合わせて、オリジナルのアイコンを簡単に作成・コピーできるツール。",
        symbol_title: "記号・アイコン コンバイナー",
        symbol_subtitle: "記号と文字を組み合わせて、オリジナルのアイコンを作成します。",
        selectSymbol: "記号を選択",
        circle: "丸",
        square: "四角",
        triangle: "三角",
        invertedTriangle: "逆三角",
        diamond: "菱形",
        symbolStyle: "記号のスタイル",
        outline: "枠線のみ",
        fill: "塗りつぶし",
        textInputLabel: "文字 (最大2文字)",
        textSettings: "文字の設定",
        size: "サイズ",
        posX: "位置 X",
        posY: "位置 Y",
        textStyle: "文字のスタイル",
        bold: "太字",
        italic: "イタリック",
        underline: "下線",
        mainColor: "メインカラー",
        black: "黒",
        white: "白",
        backgroundColor: "背景",
        transparent: "透明",
        solid: "塗りつぶし",
        copyImage: "画像をコピー",
        copySuccess: "コピーしました！",
        copyFail: "コピーに失敗しました。"
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
        gdt_start_rot: "Start Rotation",
        gdt_tol_type_label: "Tolerance Display Type",
        gdt_notation_title: "Tolerance Notation",
        symbol_app_title: "Symbol Combiner",
        symbol_app_desc: "Combine symbols and text to create original icons.",
        symbol_title: "Symbol Combiner",
        symbol_subtitle: "Create original icons by combining symbols and text.",
        selectSymbol: "Select Symbol",
        circle: "Circle",
        square: "Square",
        triangle: "Triangle",
        invertedTriangle: "Inverted Triangle",
        diamond: "Diamond",
        symbolStyle: "Symbol Style",
        outline: "Outline Only",
        fill: "Fill",
        textInputLabel: "Text (Max 2 chars)",
        textSettings: "Text Settings",
        size: "Size",
        posX: "Position X",
        posY: "Position Y",
        textStyle: "Text Style",
        bold: "Bold",
        italic: "Italic",
        underline: "Underline",
        mainColor: "Main Color",
        black: "Black",
        white: "White",
        backgroundColor: "Background",
        transparent: "Transparent",
        solid: "Solid Fill",
        copyImage: "Copy Image",
        copySuccess: "Copied!",
        copyFail: "Failed to copy."
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
        gdt_start_rot: "Iniciar Rotación",
        gdt_tol_type_label: "Tipo de Visualización de Tolerancia",
        gdt_notation_title: "Notación de Tolerancia",
        symbol_app_title: "Combinador de Símbolos",
        symbol_app_desc: "Combina símbolos y texto para crear iconos originales.",
        symbol_title: "Combinador de Símbolos",
        symbol_subtitle: "Crea iconos originales combinando símbolos y texto.",
        selectSymbol: "Seleccionar Símbolo",
        circle: "Círculo",
        square: "Cuadrado",
        triangle: "Triángulo",
        invertedTriangle: "Triángulo Invertido",
        diamond: "Diamante",
        symbolStyle: "Estilo de Símbolo",
        outline: "Solo Contorno",
        fill: "Relleno",
        textInputLabel: "Texto (Máx. 2 car.)",
        textSettings: "Ajustes de Texto",
        size: "Tamaño",
        posX: "Posición X",
        posY: "Posición Y",
        textStyle: "Estilo de Texto",
        bold: "Negrita",
        italic: "Cursiva",
        underline: "Subrayado",
        mainColor: "Color Principal",
        black: "Negro",
        white: "Blanco",
        backgroundColor: "Fondo",
        transparent: "Transparente",
        solid: "Relleno Sólido",
        copyImage: "Copiar Imagen",
        copySuccess: "¡Copiado!",
        copyFail: "Error al copiar."
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
    } else if (hash === '#symbol-combiner') {
        renderTemplate('view-symbol-combiner', content);
        initSymbolCombiner();
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

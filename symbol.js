// --- Symbol Combiner Core ---
function initSymbolCombiner() {
    const container = document.querySelector('.symbol-layout');
    if (!container) return;
    
    const canvas = document.getElementById('symbol-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const copyBtn = document.getElementById('symbol-copy-btn');
    
    // Inputs scoped to container
    const symbolInputs = container.querySelectorAll('input[name="symbol"]');
    const styleButtons = container.querySelectorAll('[data-style]');
    const bgButtons = container.querySelectorAll('[data-bg]');
    const textInput = document.getElementById('symbol-text-input');
    const textSizeInput = document.getElementById('symbol-text-size');
    const textXInput = document.getElementById('symbol-text-x');
    const textYInput = document.getElementById('symbol-text-y');
    const boldCheck = document.getElementById('symbol-bold');
    const italicCheck = document.getElementById('symbol-italic');
    const underlineCheck = document.getElementById('symbol-underline');
    const mainColorInputs = container.querySelectorAll('input[name="mainColor"]');

    const state = {
        symbol: 'circle',
        symbolStyle: 'outline',
        bgType: 'transparent', // transparent or solid
        text: textInput ? textInput.value : 'A',
        textSize: textSizeInput ? parseInt(textSizeInput.value) : 360,
        textX: textXInput ? parseInt(textXInput.value) : 0,
        textY: textYInput ? parseInt(textYInput.value) : 0,
        isBold: boldCheck ? boldCheck.checked : false,
        isItalic: italicCheck ? italicCheck.checked : false,
        isUnderline: underlineCheck ? underlineCheck.checked : false,
        mainColor: 'black'
    };

    // Auto-set default color based on theme
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        state.mainColor = 'white';
        mainColorInputs.forEach(input => {
            if (input.value === 'white') input.checked = true;
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Use absolute hex to be safe
        const primaryColorHex = state.mainColor === 'white' ? '#FFFFFF' : '#000000';
        const secondaryColorHex = state.mainColor === 'white' ? '#000000' : '#FFFFFF';

        // Background
        if (state.bgType === 'solid') {
            ctx.fillStyle = secondaryColorHex;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Draw Symbol
        drawSymbol(cx, cy, primaryColorHex);
        // Draw Text
        drawText(cx, cy, primaryColorHex);
    }

    function drawSymbol(cx, cy, drawColor) {
        ctx.beginPath();
        const size = 200;
        ctx.lineWidth = 10;
        
        ctx.strokeStyle = drawColor;
        ctx.fillStyle = drawColor;

        switch (state.symbol) {
            case 'circle':
                ctx.arc(cx, cy, size, 0, Math.PI * 2);
                break;
            case 'square':
                ctx.rect(cx - size, cy - size, size * 2, size * 2);
                break;
            case 'triangle':
                const height = size * Math.sqrt(3);
                ctx.moveTo(cx, cy - height * 2 / 3);
                ctx.lineTo(cx - size, cy + height / 3);
                ctx.lineTo(cx + size, cy + height / 3);
                ctx.closePath();
                break;
            case 'inverted_triangle':
                const hInv = size * Math.sqrt(3);
                ctx.moveTo(cx, cy + hInv * 2 / 3);
                ctx.lineTo(cx - size, cy - hInv / 3);
                ctx.lineTo(cx + size, cy - hInv / 3);
                ctx.closePath();
                break;
            case 'diamond':
                ctx.moveTo(cx, cy - size * 0.9); 
                ctx.lineTo(cx + size * 0.9, cy);
                ctx.lineTo(cx, cy + size * 0.9);
                ctx.lineTo(cx - size * 0.9, cy);
                ctx.closePath();
                break;
        }

        if (state.symbolStyle === 'fill') {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }

    function drawText(cx, cy, drawColor) {
        if (!state.text) return;
        ctx.save();
        
        let fontStyle = '';
        if (state.isItalic) fontStyle += 'italic ';
        if (state.isBold) fontStyle += 'bold ';
        ctx.font = `${fontStyle}${state.textSize}px 'Inter', sans-serif`;

        ctx.fillStyle = drawColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const x = cx + state.textX;
        const y = cy + state.textY;
        ctx.fillText(state.text, x, y);

        if (state.isUnderline) {
            const metrics = ctx.measureText(state.text);
            const width = metrics.width;
            ctx.beginPath();
            ctx.lineWidth = state.textSize / 15;
            ctx.strokeStyle = ctx.fillStyle;
            const lineY = y + state.textSize * 0.4;
            ctx.moveTo(x - width / 2, lineY);
            ctx.lineTo(x + width / 2, lineY);
            ctx.stroke();
        }
        ctx.restore();
    }

    // Event Listeners
    symbolInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            state.symbol = e.target.value;
            draw();
        });
    });

    styleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            styleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.symbolStyle = btn.getAttribute('data-style');
            draw();
        });
    });

    bgButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            bgButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.bgType = btn.getAttribute('data-bg');
            draw();
        });
    });

    if (textInput) textInput.addEventListener('input', (e) => { state.text = e.target.value; draw(); });
    if (textSizeInput) textSizeInput.addEventListener('input', (e) => { state.textSize = parseInt(e.target.value); draw(); });
    if (textXInput) textXInput.addEventListener('input', (e) => { state.textX = parseInt(e.target.value); draw(); });
    if (textYInput) textYInput.addEventListener('input', (e) => { state.textY = parseInt(e.target.value); draw(); });
    if (boldCheck) boldCheck.addEventListener('change', (e) => { state.isBold = e.target.checked; draw(); });
    if (italicCheck) italicCheck.addEventListener('change', (e) => { state.isItalic = e.target.checked; draw(); });
    if (underlineCheck) underlineCheck.addEventListener('change', (e) => { state.isUnderline = e.target.checked; draw(); });
    
    mainColorInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            state.mainColor = e.target.value;
            draw();
        });
    });

    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                const blob = await new Promise(resolve => canvas.toBlob(resolve));
                const item = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([item]);
                
                const langCode = document.getElementById('lang-select')?.value || 'ja';
                const dict = i18n[langCode] || i18n['ja'];
                const originalHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> ${dict.copySuccess}`;
                setTimeout(() => copyBtn.innerHTML = originalHTML, 2000);
            } catch (err) {
                console.error(err);
                const langCode = document.getElementById('lang-select')?.value || 'ja';
                const dict = i18n[langCode] || i18n['ja'];
                alert(dict.copyFail);
            }
        });
    }

    draw();
}

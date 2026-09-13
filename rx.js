// ── Morse code ─────────────────────────────────────────────────────────────────
const MORSE_CODE = {
    'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---',
    'K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-',
    'U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..',
    '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....',
    '6':'-....','7':'--...','8':'---..','9':'----.',
    '/':'-..-.', // ポータブル
};
// RST（コンテストナンバー）先頭の「599」は、非初心者モードでは慣例的に必ず「5NN」で送出する
// （それ以外の数字、およびコールサインの数字は常に本来の符号のまま。初心者モードは常に599のまま）。
// 正解判定では599/5NNどちらの入力も許容する（非初心者モードのみ。初心者モードは599のみ正解）。
function normalizeRstPrefix(str) {
    if (str.length >= 3 && str[0] === '5' && (str.slice(1, 3) === 'NN' || str.slice(1, 3) === '99')) {
        return '599' + str.slice(3);
    }
    return str;
}

// ── i18n (ja/en shared UI strings for dynamically-generated text) ──────────────
const LANG = (document.documentElement.lang === 'en') ? 'en' : 'ja';
const I18N = {
    listening:   { ja: '受信中...', en: 'RECEIVING...' },
    setNameBtn:    { ja: '✏️ 名前を設定', en: '✏️ Set Name' },
    settingBtn:    { ja: '設定中...', en: 'Setting...' },
    setDoneBtn:    { ja: '✓ 設定済み', en: '✓ Done' },
    setFailAlert:  { ja: '設定に失敗しました。もう一度お試しください。', en: 'Failed to set name. Please try again.' },
    shareText: (minutes, score) => ({
        ja: `【モールス打】受信モード\n${minutes}分間で${score}文字\n#モールス打 #アマチュア無線 #CW #モールス信号\nhttps://jl1gix.com`,
        en: `[Morseda] Receive Mode\n${score} characters in ${minutes} min\n#Morseda #AmateurRadio #CW #MorseCode\nhttps://jl1gix.com/en/`
    }),
    registering:       { ja: '登録中...', en: 'Registering...' },
    registeringRetry:  (n) => ({ ja: `登録中... (再試行 ${n}/2)`, en: `Registering... (retry ${n}/2)` }),
    regFailed:         { ja: '登録に失敗しました', en: 'Registration failed' },
    retryBtn:          { ja: '再試行', en: 'Retry' },
    regDone:           { ja: '✓ 登録完了！', en: '✓ Registered!' },
    topPct:            (pct) => ({ ja: `上位 ${pct}%`, en: `Top ${pct}%` }),
    rankingLink:       { ja: '🏆 ランキング', en: '🏆 Ranking' },
};
function t(key, ...args) {
    const entry = I18N[key];
    const resolved = (typeof entry === 'function') ? entry(...args) : entry;
    return resolved[LANG];
}

// ── State ──────────────────────────────────────────────────────────────────────
let audioCtx = null, masterGain = null;
let timeLeft, initialSeconds, score = 0, currentWord = '', isPlaying = false;
let timerId, audioLoopId, activeOscillators = [];
let isWaitingNext = false, nextType = 'CALLSIGN';
let currentWordIsCallsign = true; // 現在のcurrentWordがコールサインかどうか（カットナンバーはコンテストナンバーのみに適用）
let DOT_TIME = 1.2 / 25; // 25 WPM default
let beginnerMode = false;
let gameStartTimer = null;
const gameMode = 'RX';
// Scope state
let scopeRunning = false;
const SCOPE_W = 600, SCOPE_H = 160;
const SPEC_H = 92, FALL_H = 68;
const CW_X = SCOPE_W / 2;
const SPAN_HZ = 3000;
const PX_PER_HZ = SCOPE_W / SPAN_HZ;
const FILT_X1 = CW_X - 250 * PX_PER_HZ;
const FILT_X2 = CW_X + 250 * PX_PER_HZ;
let waterfallRows = [];
let smoothSpectrum = new Float32Array(SCOPE_W).fill(0);
let toneStrength = 0;
let toneSchedule = [];
let charSchedule = [];
// SOS check state
let _sosCtx = null, _sosTimer = null;
// DOM refs
const mobileInput = document.getElementById('mobile-input');
const displayFrame = document.getElementById('input-display');
const beginnerDisplay = document.getElementById('beginner-display');
let lastDisplayedMorse = null;

// ── WPM ────────────────────────────────────────────────────────────────────────
function wpmToDotTime(wpm) { return 1.2 / wpm; }

// ── Callsign / RST ─────────────────────────────────────────────────────────────
function generateCallsign() {
    const rAZ = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const r09 = () => Math.floor(Math.random() * 10).toString();
    const rRange = (a, z) => String.fromCharCode(a.charCodeAt(0) + Math.floor(Math.random() * (z.charCodeAt(0) - a.charCodeAt(0) + 1)));
    const r = Math.random();
    const pfx = r < 0.90 ? 'J' : (r < 0.97 ? '7' : '8');
    let second;
    if (pfx === 'J') second = rRange('A', 'S');
    else if (pfx === '7') second = rRange('J', 'N');
    else second = (Math.random() < 0.5 ? 'J' : 'N');
    const call = pfx + second + r09() + rAZ() + rAZ() + rAZ();
    if (Math.random() < 0.3) return call + '/' + r09();
    return call;
}
function generateRST() {
    const areas = ['101','102','103','104','105','106','107','108','109','110','111','112','113','114'];
    for (let i = 2; i <= 48; i++) areas.push(i.toString().padStart(2,'0'));
    return '599' + areas[Math.floor(Math.random() * areas.length)] + ['H','M','L','P'][Math.floor(Math.random()*4)];
}

// ── Audio unlock + prepare ─────────────────────────────────────────────────────
function unlockAndPrepare() {
    stopSosCheck();
    document.getElementById('audio-check').checked = false;
    const wpmVal = parseInt(document.getElementById('wpm-select').value);
    DOT_TIME = wpmToDotTime(wpmVal);
    document.getElementById('wpm-display').innerText = wpmVal;
    beginnerMode = document.getElementById('beginner-mode-check').checked;
    if (beginnerMode) {
        beginnerDisplay.classList.remove('hidden');
    } else {
        // 前回のプレイで残った初心者表示（長点短点）を消す
        beginnerDisplay.classList.add('hidden');
        beginnerDisplay.innerHTML = '';
    }
    if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AC();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(1, 0);
        masterGain.connect(audioCtx.destination);
    }
    const doResume = (audioCtx.state === 'suspended') ? audioCtx.resume() : Promise.resolve();
    const unlockBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.1, audioCtx.sampleRate);
    const unlockSrc = audioCtx.createBufferSource();
    unlockSrc.buffer = unlockBuf;
    unlockSrc.connect(masterGain);
    unlockSrc.start(0);
    audioCtx.onstatechange = () => { if (audioCtx.state === 'suspended') audioCtx.resume(); };
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('game-start-overlay').classList.remove('hidden');
    mobileInput.focus();
    initScope();
    startScopeAnimation();
    const startReadyAt = performance.now() + 1000;
    const beginAfterPreparation = () => {
        const remaining = Math.max(0, startReadyAt - performance.now());
        gameStartTimer = setTimeout(() => {
            gameStartTimer = null;
            if (!document.getElementById('game-screen').classList.contains('hidden')) startGame();
        }, remaining);
    };
    doResume.then(beginAfterPreparation).catch(beginAfterPreparation);
}

function startGame() {
    document.getElementById('game-start-overlay').classList.add('hidden');
    initialSeconds = parseInt(document.getElementById('time-select').value);
    timeLeft = initialSeconds;
    score = 0; isPlaying = true;
    document.getElementById('score').innerText = 0;
    mobileInput.value = '';
    masterGain.gain.setValueAtTime(1, audioCtx.currentTime);
    timerId = setInterval(tick, 1000);
    isWaitingNext = false; nextType = 'CALLSIGN';
    document.getElementById('status-msg').innerText = t('listening');
    nextWord();
}

// ── 音声チェック（SOS ループ）────────────────────────────────────────────────────
function toggleSosCheck(on) { if (on) startSosCheck(); else stopSosCheck(); }
function onWpmSelectChange() {
    // 音声チェックが ON のとき、選択された WPM で SOS を流し直す
    const cb = document.getElementById('audio-check');
    if (cb && cb.checked) {
        stopSosCheck();
        startSosCheck();
    }
}

function startSosCheck() {
    stopSosCheck();
    const AC = window.AudioContext || window.webkitAudioContext;
    _sosCtx = new AC();
    _sosLoop();
}

function stopSosCheck() {
    if (_sosTimer) { clearTimeout(_sosTimer); _sosTimer = null; }
    if (_sosCtx)   { try { _sosCtx.close(); } catch(e){} _sosCtx = null; }
}

function _sosLoop() {
    if (!_sosCtx) return;
    const wpmSel = document.getElementById('wpm-select');
    const wpm   = wpmSel ? (parseInt(wpmSel.value) || 30) : 30;
    const dotT  = 1.2 / wpm;
    const dashT = dotT * 3;
    const elGap = dotT;
    const ltGap = dotT * 3;
    const wdGap = dotT * 7;
    const freq  = 750;
    // SOS はプロサイン：文字間隔なし、要素間隔のみでつなげて送出
    const sosSymbols = '...---...'.split('');
    let t = _sosCtx.currentTime + 0.05;
    let offset = 0;
    sosSymbols.forEach((sym) => {
        const dur = sym === '.' ? dotT : dashT;
        const osc = _sosCtx.createOscillator();
        const gn  = _sosCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gn.gain.setValueAtTime(0, t + offset);
        gn.gain.linearRampToValueAtTime(0.5, t + offset + 0.006);
        gn.gain.setValueAtTime(0.5, t + offset + dur - 0.006);
        gn.gain.linearRampToValueAtTime(0, t + offset + dur + 0.006);
        osc.connect(gn); gn.connect(_sosCtx.destination);
        osc.start(t + offset);
        osc.stop(t + offset + dur + 0.05);
        offset += dur + elGap;
    });
    offset += (wdGap - elGap);
    _sosTimer = setTimeout(_sosLoop, offset * 1000);
}

// ── Audio ──────────────────────────────────────────────────────────────────────
function killCurrentAudio() {
    if (audioLoopId) { clearTimeout(audioLoopId); audioLoopId = null; }
    if (audioCtx) {
        const now = audioCtx.currentTime;
        activeOscillators.forEach(({ osc, gain }) => {
            try {
                gain.gain.cancelScheduledValues(now);
                gain.gain.setValueAtTime(0, now);
                osc.stop(now + 0.01);
            } catch(e) {}
        });
    }
    activeOscillators = [];
    toneSchedule = [];
    charSchedule = [];
}

function tick() {
    if (!isPlaying) return;
    timeLeft--;
    const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
    document.getElementById('timer').innerText = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if (timeLeft <= 0) endGame();
}

function nextWord() {
    currentWordIsCallsign = (nextType === 'CALLSIGN');
    currentWord = currentWordIsCallsign ? generateCallsign() : generateRST();
    nextType = currentWordIsCallsign ? 'RST' : 'CALLSIGN';
    playMorseLoop();
}

function playMorseLoop() {
    if (!isPlaying || isWaitingNext) return;
    const duration = playMorse(currentWord);
    audioLoopId = setTimeout(playMorseLoop, duration * 1000 + 1000);
}

function playMorse(text) {
    killCurrentAudio();
    const startTime = audioCtx.currentTime + 0.1;
    const startMs   = Date.now() + 100;
    let offset = 0;
    const charEntries = [];
    text.split('').forEach((char, idx) => {
        // 非初心者モードでも、カットナンバー音を送出するのはRST先頭の「599」→「5NN」のみ。
        // それ以外の数字（エリア・サフィックス部分）およびコールサインの数字は常に本来の符号のまま。
        let playChar = char;
        if (!beginnerMode && !currentWordIsCallsign && idx < 3 && char === '9') {
            playChar = 'N';
        }
        const code = MORSE_CODE[playChar];
        if (!code) return;
        const charStartOffset = offset;
        code.split('').forEach(symbol => {
            const dur = (symbol === '.') ? DOT_TIME : DOT_TIME * 3;
            const osc  = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 750;
            gain.gain.setValueAtTime(0, startTime + offset);
            gain.gain.linearRampToValueAtTime(0.5, startTime + offset + 0.006);
            gain.gain.setValueAtTime(0.5, startTime + offset + dur - 0.003);
            gain.gain.linearRampToValueAtTime(0, startTime + offset + dur + 0.006);
            osc.connect(gain); gain.connect(masterGain);
            osc.start(startTime + offset);
            osc.stop(startTime + offset + dur + 0.05);
            activeOscillators.push({ osc, gain });
            toneSchedule.push({ onTime: startMs + offset * 1000, offTime: startMs + (offset + dur) * 1000 });
            offset += dur + DOT_TIME;
        });
        charEntries.push({ morse: code, startOffset: charStartOffset });
        offset += DOT_TIME * 2;
    });
    charEntries.forEach((entry, i) => {
        entry.startMs = startMs + entry.startOffset * 1000;
        entry.endMs   = i < charEntries.length - 1
            ? startMs + charEntries[i + 1].startOffset * 1000
            : startMs + (offset + 0.5) * 1000;
    });
    charSchedule = charEntries;
    return offset + 0.1;
}

// ── Input ──────────────────────────────────────────────────────────────────────
function focusMobile() { if (isPlaying) mobileInput.focus(); }

function submitRxInput() {
    if (!isPlaying || isWaitingNext) return;
    const finalInput = mobileInput.value.toUpperCase().replace(/[^A-Z0-9\/]/g, '');
    displayFrame.classList.remove('flash-correct', 'flash-error');
    void displayFrame.offsetWidth;
    // 599/5NNどちらでも正解にするのは非初心者モードのみ（常に5NN音のため）。
    // 初心者モードは常に599の音なので、5NNと入力されたら不正解とする。
    const inputMatches = beginnerMode
        ? (finalInput === currentWord)
        : (normalizeRstPrefix(finalInput) === normalizeRstPrefix(currentWord));
    if (inputMatches && currentWord !== '') {
        mobileInput.value = '';
        score += currentWord.length;
        document.getElementById('score').innerText = score;
        isWaitingNext = true;
        displayFrame.classList.add('flash-correct');
        killCurrentAudio();
        if (beginnerMode) beginnerDisplay.innerHTML = '';
        document.getElementById('status-msg').innerText = '✓ COPY OK';
        setTimeout(() => {
            if (!isPlaying) return;
            isWaitingNext = false;
            document.getElementById('status-msg').innerText = t('listening');
            nextWord();
            setTimeout(() => focusMobile(), 80);
        }, 500);
    } else {
        displayFrame.classList.add('flash-error');
        setTimeout(() => focusMobile(), 50);
    }
}

mobileInput.addEventListener('input', () => {
    if (!isPlaying || isWaitingNext) return;
    const raw = mobileInput.value;
    if (raw.includes('\n') || raw.includes('\r')) {
        mobileInput.value = raw.replace(/[\n\r]/g, '');
        submitRxInput();
        return;
    }
    const filtered = raw.toUpperCase().replace(/[^A-Z0-9\/]/g, '');
    if (filtered !== raw) {
        const pos = mobileInput.selectionStart;
        const removedBefore = raw.slice(0, pos).replace(/[A-Z0-9\/]/gi, '').length;
        mobileInput.value = filtered;
        const newPos = Math.max(0, pos - removedBefore);
        mobileInput.setSelectionRange(newPos, newPos);
    }
});
mobileInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); submitRxInput(); }
});

// ── キーボードショートカット: マウスなしでロビー/リザルト画面を操作 ─────────────
function isTypingContext(target) {
    return target instanceof Element && (target.matches('input, select, textarea') || target.isContentEditable);
}

document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const typing = isTypingContext(e.target);

    // ロビー画面: Aキーでスタート（Aは英字なのでテキスト入力中は無視）、
    // Escキーでモールス打のトップ画面へ（制御キーなので入力中でも有効）
    const startScreen = document.getElementById('start-screen');
    const onLobbyScreen = startScreen && !startScreen.classList.contains('hidden');
    if (onLobbyScreen) {
        if (!typing && e.key.toUpperCase() === 'A') {
            e.preventDefault();
            unlockAndPrepare();
            return;
        }
        // ロビー画面: Escキーでモールス打のトップ画面へ（制御キーなので入力中でも有効）
        // 英語モードで開いている場合は英語版トップ（index-en.html）へ戻す
        if (e.code === 'Escape') {
            e.preventDefault();
            location.href = (LANG === 'en') ? '/index-en.html' : 'https://jl1gix.com';
            return;
        }
    }

    // リザルト画面: Escキーでロビーへ戻る（制御キーなので入力中でも常に有効）
    const resultScreen = document.getElementById('result-screen');
    if (resultScreen && !resultScreen.classList.contains('hidden')) {
        // 「/」キーでニックネーム入力欄へフォーカス（受信モードにMorse Boardはないため、
        // 確定は常に「設定する」ボタンかEnterキーのみ。再度「/」を押しても何もしない）
        if (e.key === '/') {
            const nicknameInput = document.getElementById('nickname-input');
            const regArea = document.getElementById('score-reg-area');
            if (nicknameInput && regArea && regArea.style.display !== 'none') {
                e.preventDefault();
                if (document.activeElement !== nicknameInput) {
                    nicknameInput.focus();
                }
                return;
            }
        }
        if (e.code === 'Escape') {
            e.preventDefault();
            retryGame();
            return;
        }
    }

    // プレイ中: Escキーで強制的にロビーへ戻る（入力欄にフォーカスがあっても常に有効）
    if (e.code === 'Escape' && isPlaying) {
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen && !gameScreen.classList.contains('hidden')) {
            e.preventDefault();
            quitGame();
            return;
        }
    }
});

// ── Beginner mode display ──────────────────────────────────────────────────────
function updateBeginnerDisplay() {
    if (!beginnerMode) return;
    const now = Date.now();
    const current = charSchedule.find(s => now >= s.startMs && now < s.endMs);
    const morse = current ? current.morse : null;
    if (morse === lastDisplayedMorse) return;
    lastDisplayedMorse = morse;
    if (!morse) { beginnerDisplay.innerHTML = ''; return; }
    beginnerDisplay.innerHTML = morse.split('').map(sym =>
        `<span class="${sym === '.' ? 'msym-dot' : 'msym-dash'}"></span>`
    ).join('');
}

// ── IC-7300 Spectrum Scope ─────────────────────────────────────────────────────
function initScope() {
    waterfallRows = [];
    for (let i = 0; i < FALL_H; i++) waterfallRows.push(new Float32Array(SCOPE_W).fill(0));
    smoothSpectrum = new Float32Array(SCOPE_W).fill(0);
    toneStrength = 0;
    scopeRunning = false;
    lastDisplayedMorse = null;
}

function genSpectrum(active) {
    const s = new Float32Array(SCOPE_W);
    for (let x = 0; x < SCOPE_W; x++) {
        s[x] = 0.04 + Math.random() * 0.055;
        if (Math.random() < 0.004) s[x] += Math.random() * 0.12;
    }
    if (active) {
        const peak = 0.78 + Math.random() * 0.09;
        const sig  = 3.5;
        for (let x = Math.max(0, CW_X - 28); x < Math.min(SCOPE_W, CW_X + 28); x++) {
            const d = x - CW_X;
            s[x] = Math.max(s[x], peak * Math.exp(-(d * d) / (2 * sig * sig)));
        }
    }
    return s;
}

function wfColor(v) {
    if (v < 0.10) { const t = v / 0.10; return [0, Math.round(8 + t * 22), Math.round(18 + t * 28)]; }
    if (v < 0.30) { const t = (v - 0.10) / 0.20; return [0, Math.round(30 + t * 80), Math.round(46 - t * 26)]; }
    if (v < 0.58) { const t = (v - 0.30) / 0.28; return [Math.round(t * 40), Math.round(110 + t * 105), Math.round(20 - t * 18)]; }
    if (v < 0.82) { const t = (v - 0.58) / 0.24; return [Math.round(40 + t * 185), Math.round(215 + t * 40), 2]; }
    { const t = Math.min(1, (v - 0.82) / 0.18); return [Math.round(225 + t * 30), 255, Math.round(t * 210)]; }
}

function isToneOn() {
    const now = Date.now();
    return toneSchedule.some(s => now >= s.onTime && now <= s.offTime);
}

function startScopeAnimation() {
    scopeRunning = true;
    const canvas = document.getElementById('scope-canvas');
    const ctx = canvas.getContext('2d');
    const fallImgData = ctx.createImageData(SCOPE_W, FALL_H);
    let frameCount = 0;

    function draw() {
        if (!scopeRunning) return;
        requestAnimationFrame(draw);
        updateBeginnerDisplay();

        const toneActive = isPlaying && isToneOn();
        toneStrength = toneActive ? Math.min(1, toneStrength + 0.14) : Math.max(0, toneStrength - 0.09);

        const instant = genSpectrum(toneStrength > 0.25);
        for (let x = 0; x < SCOPE_W; x++) {
            smoothSpectrum[x] = smoothSpectrum[x] * 0.60 + instant[x] * 0.40;
        }

        frameCount++;
        if (frameCount % 3 === 0) {
            const row = new Float32Array(SCOPE_W);
            for (let x = 0; x < SCOPE_W; x++) row[x] = smoothSpectrum[x];
            waterfallRows.unshift(row);
            if (waterfallRows.length > FALL_H) waterfallRows.pop();
        }

        ctx.fillStyle = '#01090404';
        ctx.fillRect(0, 0, SCOPE_W, SCOPE_H);
        ctx.fillStyle = '#010d05';
        ctx.fillRect(0, 0, SCOPE_W, SPEC_H);

        ctx.lineWidth = 0.5;
        for (let i = 1; i <= 4; i++) {
            const y = SPEC_H - (i / 4.5) * (SPEC_H - 14) - 4;
            ctx.strokeStyle = i === 2 ? 'rgba(0,110,55,0.35)' : 'rgba(0,85,40,0.2)';
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(SCOPE_W, y); ctx.stroke();
        }

        const freqOffsets = [-1000, -500, 0, 500, 1000];
        freqOffsets.forEach(f => {
            const x = CW_X + f * PX_PER_HZ;
            ctx.strokeStyle = f === 0 ? 'rgba(0,140,65,0.35)' : 'rgba(0,90,45,0.22)';
            ctx.lineWidth = f === 0 ? 0.8 : 0.5;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, SPEC_H); ctx.stroke();
        });

        ctx.fillStyle = 'rgba(0,123,67,0.10)';
        ctx.fillRect(FILT_X1, 0, FILT_X2 - FILT_X1, SPEC_H);
        ctx.strokeStyle = 'rgba(0,160,80,0.38)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(FILT_X1, 0); ctx.lineTo(FILT_X1, SPEC_H);
        ctx.moveTo(FILT_X2, 0); ctx.lineTo(FILT_X2, SPEC_H);
        ctx.stroke();

        const specTop = SPEC_H - 10;
        const fillGrad = ctx.createLinearGradient(0, 0, 0, SPEC_H);
        const fa = 0.22 + toneStrength * 0.38;
        fillGrad.addColorStop(0,   `rgba(20,230,110,${fa})`);
        fillGrad.addColorStop(0.45,`rgba(0,150,65,${fa * 0.55})`);
        fillGrad.addColorStop(1,   'rgba(0,40,18,0)');
        ctx.fillStyle = fillGrad;
        ctx.beginPath(); ctx.moveTo(0, SPEC_H);
        for (let x = 0; x < SCOPE_W; x++) {
            const y = SPEC_H - smoothSpectrum[x] * specTop;
            x === 0 ? ctx.lineTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(SCOPE_W - 1, SPEC_H); ctx.closePath(); ctx.fill();

        const la = 0.65 + toneStrength * 0.35;
        ctx.strokeStyle = `rgba(0,195,85,${la})`;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = `rgba(0,180,80,${toneStrength * 0.85})`;
        ctx.shadowBlur = 2 + toneStrength * 10;
        ctx.beginPath();
        for (let x = 0; x < SCOPE_W; x++) {
            const y = SPEC_H - smoothSpectrum[x] * specTop;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke(); ctx.shadowBlur = 0;

        if (toneStrength > 0.2) {
            const peakY = SPEC_H - smoothSpectrum[CW_X] * specTop;
            ctx.strokeStyle = `rgba(0,210,95,${toneStrength * 0.3})`;
            ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
            ctx.beginPath(); ctx.moveTo(CW_X, peakY + 2); ctx.lineTo(CW_X, SPEC_H); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = `rgba(140,255,170,${toneStrength * 0.95})`;
            ctx.beginPath(); ctx.arc(CW_X, peakY, 2.8, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = `rgba(0,230,100,${toneStrength * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(CW_X, peakY, 5, 0, Math.PI * 2); ctx.stroke();
        }

        ctx.font = '7px Consolas, monospace';
        ctx.textAlign = 'center';
        freqOffsets.forEach(f => {
            const x = CW_X + f * PX_PER_HZ;
            const lbl = f === 0 ? '750Hz' : (f > 0 ? `+${f >= 1000 ? f/1000+'k' : f}` : `${f <= -1000 ? f/1000+'k' : f}`);
            ctx.fillStyle = f === 0 ? `rgba(0,220,100,${0.5 + toneStrength * 0.5})` : 'rgba(0,150,65,0.45)';
            ctx.fillText(lbl, x, SPEC_H - 2);
        });

        const cwAlpha = 0.5 + toneStrength * 0.5;
        ctx.fillStyle = `rgba(0,220,100,${cwAlpha})`;
        ctx.beginPath();
        ctx.moveTo(CW_X - 4, SPEC_H + 1);
        ctx.lineTo(CW_X + 4, SPEC_H + 1);
        ctx.lineTo(CW_X, SPEC_H - 5);
        ctx.closePath(); ctx.fill();

        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(0,130,60,0.45)';
        ['S9+', 'S9', 'S7', 'S5'].forEach((lbl, i) => {
            const y = SPEC_H - ((3 - i) / 4.5) * (SPEC_H - 14) - 4;
            ctx.fillText(lbl, SCOPE_W - 2, y - 2);
        });

        ctx.strokeStyle = 'rgba(0,110,55,0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, SPEC_H); ctx.lineTo(SCOPE_W, SPEC_H); ctx.stroke();

        const d = fallImgData.data;
        for (let row = 0; row < Math.min(waterfallRows.length, FALL_H); row++) {
            const rowData = waterfallRows[row];
            const base = row * SCOPE_W * 4;
            for (let x = 0; x < SCOPE_W; x++) {
                const [r, g, b] = wfColor(rowData[x]);
                const i = base + x * 4;
                d[i] = r; d[i+1] = g; d[i+2] = b; d[i+3] = 255;
            }
        }
        ctx.putImageData(fallImgData, 0, SPEC_H);

        ctx.fillStyle = 'rgba(0,123,67,0.07)';
        ctx.fillRect(FILT_X1, SPEC_H, FILT_X2 - FILT_X1, FALL_H);
        ctx.strokeStyle = 'rgba(0,150,75,0.22)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(FILT_X1, SPEC_H); ctx.lineTo(FILT_X1, SPEC_H + FALL_H);
        ctx.moveTo(FILT_X2, SPEC_H); ctx.lineTo(FILT_X2, SPEC_H + FALL_H);
        ctx.stroke();

        ctx.fillStyle = 'rgba(0,140,60,0.35)';
        ctx.font = '7px Consolas, monospace';
        ctx.textAlign = 'left';
        ctx.fillText('WFALL', 4, SPEC_H + 10);
    }
    draw();
}

// ── End / Quit ─────────────────────────────────────────────────────────────────
function quitGame() {
    isPlaying = false; scopeRunning = false;
    document.getElementById('game-start-overlay').classList.add('hidden');
    if (gameStartTimer) { clearTimeout(gameStartTimer); gameStartTimer = null; }
    clearInterval(timerId); killCurrentAudio();
    score = 0;
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}

function retryGame() {
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}

function endGame() {
    isPlaying = false; scopeRunning = false;
    clearInterval(timerId); killCurrentAudio();
    const minutes = Math.round(initialSeconds / 60);
    document.getElementById('final-result-text').innerText =
        `${score} ${score === 1 ? 'character' : 'characters'} / ${minutes} min`;
    const nicknameInputEl = document.getElementById('nickname-input');
    nicknameInputEl.value = '';
    nicknameInputEl.disabled = false; // 前回のプレイで設定済みになっていても、次のプレイでは再入力できるようにする
    const btn = document.getElementById('submit-score-btn');
    btn.disabled = false;
    btn.textContent = t('setNameBtn');
    document.getElementById('score-reg-area').style.display = score > 0 ? '' : 'none';
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    if (score > 0) {
        autoRegister();
        setTimeout(() => {
            const reg = document.getElementById('score-reg-area');
            if (reg) reg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
}

// ── SNS Share ──────────────────────────────────────────────────────────────────
function getShareText() {
    const minutes = Math.round(initialSeconds / 60);
    return t('shareText', minutes, score);
}
function shareX() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

// ── Score registration ─────────────────────────────────────────────────────────
let _registeredId = null;
async function autoRegister(retryCount = 0) {
    if (retryCount === 0) _registeredId = null;
    const minutes = Math.round(initialSeconds / 60);
    const regResult = document.getElementById('score-reg-result');
    if (retryCount === 0) {
        regResult.innerHTML = `<span style="color:var(--primary-dim);font-size:0.75rem;">${t('registering')}</span>`;
    }
    if (!_registeredId) {
        try {
            const res = await fetch('https://api.jl1gix.com/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname: 'noname', score, mode: gameMode, is_beginner: beginnerMode ? 1 : 0, minutes })
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            _registeredId = data.id;
        } catch (e) {
            if (retryCount < 2) {
                regResult.innerHTML = `<span style="color:var(--primary-dim);font-size:0.75rem;">${t('registeringRetry', retryCount + 1)}</span>`;
                setTimeout(() => autoRegister(retryCount + 1), (retryCount + 1) * 1000);
            } else {
                regResult.innerHTML =
                    `<span style="color:var(--error); font-size:0.75rem;">${t('regFailed')}　</span>` +
                    `<button onclick="autoRegister(0)" style="font-size:0.7rem;padding:4px 12px;margin:0;margin-top:4px;">${t('retryBtn')}</button>`;
            }
            return;
        }
    }
    let pct = '－';
    try {
        const rankRes = await fetch(`https://api.jl1gix.com/api/scores/rank?score=${score}&mode=${gameMode}&minutes=${minutes}`);
        const rankData = await rankRes.json();
        if (rankData.percentile !== undefined) pct = rankData.percentile;
    } catch (e) {}
    const rankHref = (LANG === 'en' ? '/ranking-en.html' : '/ranking.html') + `?mode=${gameMode}&time=${minutes}`;
    regResult.innerHTML =
        `<span style="color:var(--success);">${t('regDone')}</span>　${t('topPct', pct)}　` +
        `<a href="${rankHref}" style="color:var(--primary); text-decoration:none; border:1px solid var(--border); padding:4px 14px; font-size:0.75rem; letter-spacing:1px; border-radius:2px;">${t('rankingLink')}</a>`;
}

async function setNickname() {
    const nickname = document.getElementById('nickname-input').value.replace(/[^A-Z0-9]/g, '');
    if (!nickname) return;  // 未入力なら何もしない（初期登録のnonameのまま）
    if (!_registeredId) return;
    const btn = document.getElementById('submit-score-btn');
    btn.disabled = true;
    btn.textContent = t('settingBtn');
    try {
        await fetch(`https://api.jl1gix.com/api/scores/${_registeredId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname })
        });
        btn.textContent = t('setDoneBtn');
        document.getElementById('nickname-input').disabled = true;
    } catch (e) {
        btn.disabled = false;
        btn.textContent = t('setNameBtn');
        alert(t('setFailAlert'));
    }
}
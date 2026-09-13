// ── Morse code ─────────────────────────────────────────────────────────────────
const MORSE_CODE = {
    'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---',
    'K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-',
    'U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..',
    '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....',
    '6':'-....','7':'--...','8':'---..','9':'----.',
    '/':'-..-.', // ポータブル
    '?':'..--..','!':'-.-.--',':':'---...','.':'.-.-.-','@':'.--.-.', // モールス符号表の記号
};
const MORSE_REVERSE = {};
Object.entries(MORSE_CODE).forEach(([ch, code]) => { MORSE_REVERSE[code] = ch; });

// ── i18n (ja/en shared UI strings for dynamically-generated text) ──────────────
const LANG = (document.documentElement.lang === 'en') ? 'en' : 'ja';
const I18N = {
    keyWaiting:          { ja: '… キー入力待ち …', en: '… press a key …' },
    errDashConflict:     { ja: '長点と同じキーは設定できません', en: 'Cannot use the same key as Dash' },
    errDotConflict:      { ja: '短点と同じキーは設定できません', en: 'Cannot use the same key as Dot' },
    startHintMorseBoard: { ja: '（・　ー）打鍵でスタート', en: 'Key (・ ー) to start' },
    startHintKey:        { ja: 'キーでスタート', en: 'Press a key to start' },
    modeDescMorseBoard: {
        ja: `身近な英単語が表示される。制限時間内にキーイングしないとシグナルが途切れ(QSB)その単語はアウト！<br>Morse BoardをPCに接続し、表示された文字をパドルで入力。<br>キーボードとして入力された英数字を、そのまま解答として判定します。`,
        en: `A familiar English word is shown. Key it before the signal fades (QSB) or the word is lost!<br>Connect a Morse Board to your PC and key the displayed characters on the paddle.<br>Alphanumeric characters received as keyboard input are judged directly as your answer.`
    },
    modeDescTouch: {
        ja: `身近な英単語が表示される。制限時間内にキーイングしないとシグナルが途切れ(QSB)その単語はアウト！<br>スマホ・タブレットは画面の「トン/ツー」をタップして送信。<br>キーボードでも操作可（右記参照）。<br>長押しで連続、両方同時押しで交互（アイアンビック）。離すと自動判定。`,
        en: `A familiar English word is shown. Key it before the signal fades (QSB) or the word is lost!<br>On phone/tablet, tap the on-screen "DIT/DAH" buttons to send.<br>Keyboard input also works (see right).<br>Hold for repeats, hold both together to alternate (Iambic). Release to auto-judge.`
    },
    modeDescDesktop: (dotLabel, dashLabel) => ({
        ja: `身近な英単語が表示される。制限時間内にキーイングしないとシグナルが途切れ(QSB)その単語はアウト！<br>${dotLabel}キー長押し＝連続短点（・・・）、${dashLabel}キー長押し＝連続長点（－－－）<br>両方同時押しで交互（アイアンビック）。離すと自動判定。`,
        en: `A familiar English word is shown. Key it before the signal fades (QSB) or the word is lost!<br>Hold ${dotLabel} = repeated dits (・・・), hold ${dashLabel} = repeated dahs (－－－)<br>Hold both together to alternate (Iambic). Release to auto-judge.`
    }),
    dotLabel:  { ja: '・ 短点', en: '・ Dot' },
    dashLabel: { ja: '－ 長点', en: '－ Dash' },
    gameplayHintMorseBoard: { ja: 'ピリオド（・－・－・－）', en: 'Period key (・－・－・－)' },
    gameplayHintEsc:        { ja: '（Escキー）', en: '(Esc key)' },
    resultHintMorseBoard:   { ja: '（Escキー / R打鍵）', en: '(Esc key / R key)' },
    resultHintEsc:          { ja: '（Escキー）', en: '(Esc key)' },
    qsbLost: (word) => ({ ja: `📉 QSB (ロストシグナル): ${word}`, en: `📉 QSB (signal lost): ${word}` }),
    resultSuffix: (n) => ({ ja: `（${n}単語クリア）`, en: ` (${n} word${n === 1 ? '' : 's'} cleared)` }),
    setNameBtn:    { ja: '✏️ 名前を設定', en: '✏️ Set Name' },
    settingBtn:    { ja: '設定中...', en: 'Setting...' },
    setDoneBtn:    { ja: '✓ 設定済み', en: '✓ Done' },
    setFailAlert:  { ja: '設定に失敗しました。もう一度お試しください。', en: 'Failed to set name. Please try again.' },
    shareText: (minutes, score, words) => ({
        ja: `【モールス打】お遊びモード\n${minutes}分間で${score}文字（${words}単語クリア）\n#モールス打 #アマチュア無線 #CW #モールス信号\nhttps://jl1gix.com`,
        en: `[Morseda] Fun Mode\n${score} characters in ${minutes} min (${words} words cleared)\n#Morseda #AmateurRadio #CW #MorseCode\nhttps://jl1gix.com/en/`
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
let timeLeft, initialSeconds, score = 0, isPlaying = false;
let timerId, gameStartTimer = null, activeOscillators = [];
let DOT_TIME = 0.06;
let beginnerMode = false;
let morseBoardMode = false;
let gameMode = 'TX'; // 'TX' | 'FREE'
// TX mode state
let txWord = [], txCharIndex = 0, txMorseInput = '';
let txCharTimer = null;
let wordTimeoutTimer = null; // お題単語ごとの制限時間タイマー
let txWordHasMistake = false; // 現在の単語で誤入力(ミス)が一度でもあったか（時間延長ボーナス判定用）
let asobiMistakeCounts = {}; // 文字ごとの打ち間違え回数（リザルト画面の「ミスが多かった文字」表示用）
let wordsCompleted = 0, wordsMissed = 0;
let TX_CHAR_GAP = 280;
let TX_DOT_TIME = 1.2 / 25; // 25 WPM デフォルト、設定で 20-30 から選択可能
// Iambic keyer state
let dotHeld = false, dashHeld = false;
let lastSentSym = null;
let keyerPending = false;
// Key bindings
let dotKey  = 'Space';
let dashKey = 'KeyJ';
let _pendingDotKey = null, _pendingDashKey = null, _capturingFor = null;
// Scope state
let scopeRunning = false;
const SCOPE_W = 600, SCOPE_H = 160;
const SPEC_H = 92, FALL_H = 68;
const CW_X = SCOPE_W / 2;
const PX_PER_HZ = SCOPE_W / 3000;
const FILT_X1 = CW_X - 250 * PX_PER_HZ;
const FILT_X2 = CW_X + 250 * PX_PER_HZ;
let waterfallRows = [];
let smoothSpectrum = new Float32Array(SCOPE_W).fill(0);
let toneStrength = 0;
let toneSchedule = [];
// DOM refs
const beginnerDisplay = document.getElementById('beginner-display');
// Free mode
let freeTextBuffer = '';

// ゲーム中は外部キーボードの Space / 矢印キーなどによるページ移動を無効化する。
// capture 段階で処理し、モバイルブラウザの既定動作より先に preventDefault する。
const VIEWPORT_SCROLL_KEYS = new Set([
    'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar'
]);

function preventGameplayViewportMovement(e) {
    if (!document.documentElement.classList.contains('game-active')) return;
    const target = e.target;
    if (target instanceof Element && (target.matches('input, select, textarea') || target.isContentEditable)) return;
    if (VIEWPORT_SCROLL_KEYS.has(e.code) || VIEWPORT_SCROLL_KEYS.has(e.key)) {
        e.preventDefault();
    }
}

function setGameplayViewportLock(active) {
    document.documentElement.classList.toggle('game-active', active);
    document.body.classList.toggle('game-active', active);
    if (active && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
}

document.addEventListener('keydown', preventGameplayViewportMovement, { capture: true, passive: false });
document.addEventListener('keyup', preventGameplayViewportMovement, { capture: true, passive: false });

// ── キーボードショートカット: マウスなしでロビー/リザルト画面を操作 ─────────────
function isTypingContext(target) {
    return target instanceof Element && (target.matches('input, select, textarea') || target.isContentEditable);
}

document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const typing = isTypingContext(e.target);

    // ロビー画面: Aキー（Morse BoardでAを打鍵した場合も同じキー入力として届く）でスタート
    // ※テキスト入力中（英字なので）、およびキー設定モーダル表示中は無視する
    const kcModalOpen = document.getElementById('key-customize-modal')?.classList.contains('open');
    const startScreen = document.getElementById('start-screen');
    const onLobbyScreen = startScreen && !startScreen.classList.contains('hidden');
    if (onLobbyScreen && !kcModalOpen) {
        if (!typing && !_capturingFor && e.key.toUpperCase() === 'A') {
            e.preventDefault();
            unlockAndPrepare();
            return;
        }
        // ロビー画面: Escキーでモールス打のトップ画面へ（制御キーなので入力中でも有効）
        if (e.code === 'Escape') {
            e.preventDefault();
            location.href = 'https://jl1gix.com';
            return;
        }
    }

    // リザルト画面: Escキーは常に、Morse Boardモードで遊んだ回はR打鍵でもロビーへ戻る
    // ※Rは英字なのでテキスト入力中は無視するが、Escは制御キーなので入力中でも有効
    const resultScreen = document.getElementById('result-screen');
    if (resultScreen && !resultScreen.classList.contains('hidden')) {
        // 「/」キー（Morse Boardで/を打鍵した場合も同じキー入力として届く）でニックネーム入力欄へフォーカス。
        // フォーカス済みの状態で再度「/」が押された場合、Morse Boardモードのみ Enter と同様に確定する
        // （非Morse Boardモードでは確定は「設定する」ボタンかEnterキーのみ）。
        if (e.key === '/') {
            const nicknameInput = document.getElementById('nickname-input');
            const regArea = document.getElementById('score-reg-area');
            if (nicknameInput && regArea && regArea.style.display !== 'none') {
                e.preventDefault();
                if (document.activeElement === nicknameInput) {
                    if (morseBoardMode) setNickname();
                } else {
                    nicknameInput.focus();
                }
                return;
            }
        }
        if (e.code === 'Escape' || (!typing && morseBoardMode && e.key.toUpperCase() === 'R')) {
            e.preventDefault();
            retryGame();
            return;
        }
    }

    // プレイ中: Escキーで強制的にロビーへ戻る（送信モード・フリー入力モード共通）
    // ※Escは制御キーなので、入力欄にフォーカスがあっても常に有効にする
    if (e.code === 'Escape' && isPlaying) {
        const gameScreen = document.getElementById('game-screen');
        const freeScreen = document.getElementById('free-screen');
        if (gameScreen && !gameScreen.classList.contains('hidden')) {
            e.preventDefault();
            quitGame();
            return;
        }
        if (freeScreen && !freeScreen.classList.contains('hidden')) {
            e.preventDefault();
            quitFreeMode();
            return;
        }
    }
});

// ── Key label helper ───────────────────────────────────────────────────────────
function getKeyLabel(code) {
    if (code === 'Space') return 'SPACE';
    if (code.startsWith('Key'))   return code.slice(3);
    if (code.startsWith('Digit')) return code.slice(5);
    const arrowMap = {ArrowUp:'↑', ArrowDown:'↓', ArrowLeft:'←', ArrowRight:'→'};
    if (arrowMap[code]) return arrowMap[code];
    return code;
}

// ── Key Customize ──────────────────────────────────────────────────────────────
function openKeyCustomize() {
    _pendingDotKey  = dotKey;
    _pendingDashKey = dashKey;
    _capturingFor   = null;
    document.getElementById('kc-error').textContent = '';
    updateKcBtns();
    document.getElementById('key-customize-modal').classList.add('open');
    document.addEventListener('keydown', onKeyCapture);
}
function closeKeyCustomize() {
    _capturingFor = null;
    document.getElementById('key-customize-modal').classList.remove('open');
    document.removeEventListener('keydown', onKeyCapture);
}
function updateKcBtns() {
    const db = document.getElementById('dot-key-btn');
    const ab = document.getElementById('dash-key-btn');
    db.textContent = _capturingFor === 'dot'  ? t('keyWaiting') : getKeyLabel(_pendingDotKey);
    ab.textContent = _capturingFor === 'dash' ? t('keyWaiting') : getKeyLabel(_pendingDashKey);
    db.classList.toggle('listening', _capturingFor === 'dot');
    ab.classList.toggle('listening', _capturingFor === 'dash');
}
function startKeyCapture(which) {
    _capturingFor = which;
    document.getElementById('kc-error').textContent = '';
    updateKcBtns();
}
function onKeyCapture(e) {
    if (!_capturingFor) return;
    e.preventDefault();
    if (e.code === 'Escape') { closeKeyCustomize(); return; }
    if (e.code === 'Enter')  { saveKeyCustomize();  return; }
    const code = e.code;
    if (_capturingFor === 'dot') {
        if (code === _pendingDashKey) {
            document.getElementById('kc-error').textContent = t('errDashConflict');
            _capturingFor = null; updateKcBtns(); return;
        }
        _pendingDotKey = code;
    } else {
        if (code === _pendingDotKey) {
            document.getElementById('kc-error').textContent = t('errDotConflict');
            _capturingFor = null; updateKcBtns(); return;
        }
        _pendingDashKey = code;
    }
    _capturingFor = null;
    document.getElementById('kc-error').textContent = '';
    updateKcBtns();
}
function saveKeyCustomize() {
    dotKey  = _pendingDotKey;
    dashKey = _pendingDashKey;
    updateTxModeDesc();
    closeKeyCustomize();
}
function updateTxModeDesc() {
    const morseBoardModeCheck = document.getElementById('morse-board-mode-check');
    const isMorseBoard = Boolean(morseBoardModeCheck && morseBoardModeCheck.checked);
    const wpmSettingItem = document.getElementById('wpm-setting-item');
    if (wpmSettingItem) wpmSettingItem.classList.toggle('hidden', isMorseBoard);
    const settingsGrid = wpmSettingItem && wpmSettingItem.parentElement;
    if (settingsGrid) settingsGrid.classList.toggle('morse-board-settings', isMorseBoard);
    const startHintLabel = document.getElementById('start-hint-label');
    if (startHintLabel) startHintLabel.textContent = isMorseBoard ? t('startHintMorseBoard') : t('startHintKey');
    if (isMorseBoard) {
        document.getElementById('mode-description').innerHTML = t('modeDescMorseBoard');
        updateKeyAssignDisplay();
        return;
    }
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouchDevice) {
        document.getElementById('mode-description').innerHTML = t('modeDescTouch');
    } else {
        document.getElementById('mode-description').innerHTML = t('modeDescDesktop', getKeyLabel(dotKey), getKeyLabel(dashKey));
    }
    updateKeyAssignDisplay();
}

// キーラベルを、実物のキー形状に近いアイコンで描画する（Space＝横長の長方形、それ以外＝正方形）
function renderKeyCap(label) {
    const isSpace = (label === 'SPACE');
    if (isSpace) {
        return `<span style="display:inline-block; min-width:76px; height:34px; line-height:30px; padding:0 12px; border:2.5px solid var(--primary); border-radius:6px; background:rgba(0,192,96,0.14); font-weight:bold; font-size:1rem; text-align:center; box-shadow:0 0 8px rgba(0,192,96,0.35); vertical-align:middle;">${label}</span>`;
    }
    return `<span style="display:inline-block; width:38px; height:34px; line-height:30px; border:2.5px solid var(--primary); border-radius:6px; background:rgba(0,192,96,0.14); font-weight:bold; font-size:1.1rem; text-align:center; box-shadow:0 0 8px rgba(0,192,96,0.35); vertical-align:middle;">${label}</span>`;
}

// 送信モード/フリー入力モードのプレイ画面に、短点・長点の現在のキー割り当てを横並びで常時表示する
function updateKeyAssignRow(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (morseBoardMode) {
        el.style.display = 'none';
        return;
    }
    el.style.display = 'flex';
    el.innerHTML =
        `<span style="color:var(--primary);font-weight:bold;font-size:0.78rem;">${t('dotLabel')}</span> ${renderKeyCap(getKeyLabel(dotKey))}` +
        `<span style="color:var(--primary);font-weight:bold;font-size:0.78rem;margin-left:6px;">${t('dashLabel')}</span> ${renderKeyCap(getKeyLabel(dashKey))}`;
}

// ロビー画面のキー設定欄用の小さめキーキャップ表示
function renderKeyCapSmall(label) {
    const isSpace = (label === 'SPACE');
    const base = 'display:inline-block; border:1.5px solid var(--primary); border-radius:4px; background:rgba(0,192,96,0.14); font-weight:bold; text-align:center; line-height:1; vertical-align:middle;';
    if (isSpace) {
        return `<span style="${base} min-width:38px; padding:3px 7px; font-size:0.6rem;">${label}</span>`;
    }
    return `<span style="${base} width:19px; height:19px; line-height:16px; font-size:0.62rem;">${label}</span>`;
}

// 送信モードのロビー画面右側に、短点・長点の現在のキー割り当てを一目でわかるよう表示する
function updateKeyAssignDisplay() {
    const el = document.getElementById('key-assign-display');
    if (!el) return;
    const morseBoardModeCheck = document.getElementById('morse-board-mode-check');
    if (morseBoardModeCheck && morseBoardModeCheck.checked) {
        el.style.display = 'none';
        return;
    }
    el.style.display = '';
    el.innerHTML =
        `<div style="display:flex; align-items:center; justify-content:flex-end; gap:6px; margin-bottom:5px;">
            <span style="color:var(--primary);font-weight:bold;">${t('dotLabel')}</span>
            ${renderKeyCapSmall(getKeyLabel(dotKey))}
        </div>
        <div style="display:flex; align-items:center; justify-content:flex-end; gap:6px;">
            <span style="color:var(--primary);font-weight:bold;">${t('dashLabel')}</span>
            ${renderKeyCapSmall(getKeyLabel(dashKey))}
        </div>`;
}

// ── お題単語（身近な英単語） ─────────────────────────────────────────────────────
const WORD_LIST = [
    'CAT','DOG','SUN','RUN','PEN','CAR','BUS','MAP','BOX','KEY','TEA','CUP','BAG','HAT','EGG',
    'RAIN','BIRD','FISH','MOON','STAR','TREE','BOOK','DESK','LAMP','DOOR','WALL','ROOM','GAME',
    'PLAY','WORK','TIME','YEAR','HAND','FOOT','HEAD','EYES','HAIR','FACE','SHOE','WIND','SNOW',
    'CLOUD','LIGHT','SMILE','HEART','MUSIC','DANCE','HOUSE','TABLE','CHAIR','PHONE','WATCH','CLOCK',
    'APPLE','BREAD','MILK','RICE','MEAT','FRUIT','WATER','EARTH','FIRE','HAPPY','SLEEP','SMALL',
    'GREEN','BLACK','WHITE','WHEEL','TRAIN','PLANE','SHIP','ROAD','PARK','SCHOOL','FRIEND','FAMILY',
    'MORSE','RADIO','PADDLE','SIGNAL','ANTENNA','CONTEST',
    // 2026-09 追加分（お遊びモードの単語バリエーション増加）
    'SKY','ICE','TOY','JAM','OWL','BEE','ANT','COW','PIG','FOX','BAT','ARM','LEG',
    'EAR','LIP','JOB','ZOO','BOY','WEB','SEA','TOP','BED','CAP','JAR','VAN','WOLF',
    'DEER','DUCK','GOAT','LION','BEAR','FROG','CRAB','CAKE','SOUP','CORN','MEAL','SALT','SOAP',
    'WOOD','ROCK','LAKE','HILL','LEAF','GOLD','GATE','GIFT','COIN','FLAG','RING','BELL','DRUM',
    'HORN','WIRE','CODE','BAND','DIAL','TUNE','BEAM','WAVE','VOLT','UNIT','TEST','TEAM','GOAL',
    'RACE','OCEAN','RIVER','STORM','BEACH','FIELD','GRASS','STONE','GLASS','PAPER','PLANT','POWER','SOUND',
    'VOICE','SPACE','BRAVE','QUIET','SHARP','QUICK','FRESH','SWEET','YOUNG','THANK','SORRY','TODAY','NIGHT',
    'CANDY','JUICE','MONEY','PARTY','PIZZA','PLATE','SPOON','KNIFE','TOWEL'
];
let lastAsobiWord = '';
function pickWord() {
    if (WORD_LIST.length <= 1) return WORD_LIST[0];
    let w;
    do { w = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]; } while (w === lastAsobiWord);
    lastAsobiWord = w;
    return w;
}

// ── 単語ごとの制限時間（Sメーター風シグナルバーが尽きるとアウト） ──────────────────────
// 現在のWPMで単語を打つのに理想的にかかる時間(秒)を見積もる
function estimateWordMorseSeconds(word) {
    let units = 0;
    for (let i = 0; i < word.length; i++) {
        const code = MORSE_CODE[word[i]];
        if (!code) continue;
        for (let j = 0; j < code.length; j++) {
            units += (code[j] === '.') ? 1 : 3;
            if (j < code.length - 1) units += 1; // 同一文字内の要素間ギャップ
        }
        if (i < word.length - 1) units += 3; // 文字間ギャップ
    }
    return units * TX_DOT_TIME;
}
// 単語の制限時間(ミリ秒)。理想時間の3.5倍(初心者は4.5倍)＋余裕を持たせる
function getWordTimeLimitMs(word) {
    const idealSec = estimateWordMorseSeconds(word);
    const multiplier = beginnerMode ? 4.5 : 3.5;
    return Math.max(3500, idealSec * 1000 * multiplier + 800);
}
function clearWordTimer() {
    if (wordTimeoutTimer) { clearTimeout(wordTimeoutTimer); wordTimeoutTimer = null; }
}
function startWordTimer(word) {
    clearWordTimer();
    const track = document.getElementById('word-timer-track');
    const fill  = document.getElementById('word-timer-fill');
    if (!track || !fill) return;
    const limitMs = getWordTimeLimitMs(word);
    fill.style.transition = 'none';
    fill.style.transform = 'scaleX(1)';
    void track.offsetWidth; // reflow
    fill.style.transition = `transform ${limitMs}ms linear`;
    requestAnimationFrame(() => {
        fill.style.transform = 'scaleX(0)';
    });
    wordTimeoutTimer = setTimeout(handleWordTimeout, limitMs);
}
function handleWordTimeout() {
    wordTimeoutTimer = null;
    wordsMissed++;
    const txArea = document.getElementById('tx-area');
    if (txArea) {
        txArea.classList.remove('flash-correct');
        txArea.classList.add('flash-error');
        setTimeout(() => txArea.classList.remove('flash-error'), 400);
    }
    document.getElementById('status-msg').innerText = t('qsbLost', txWord.join(''));
    nextTxWord();
}

// ── Audio unlock + prepare ─────────────────────────────────────────────────────
function unlockAndPrepare() {
    gameMode = 'TX';
    const wpmVal = parseInt(document.getElementById('wpm-select').value);
    TX_DOT_TIME = 1.2 / wpmVal;
    morseBoardMode = document.getElementById('morse-board-mode-check').checked;
    document.getElementById('wpm-display').innerText = morseBoardMode ? 'KEY' : wpmVal;
    const gameplayKeyHint = document.getElementById('gameplay-key-hint');
    if (gameplayKeyHint) gameplayKeyHint.textContent = morseBoardMode ? t('gameplayHintMorseBoard') : t('gameplayHintEsc');
    beginnerMode = document.getElementById('beginner-mode-check').checked;
    document.getElementById('game-screen').classList.toggle('beginner-compact', beginnerMode);
    if (beginnerMode) {
        beginnerDisplay.classList.remove('hidden');
    } else {
        // 前回のプレイで残った初心者表示を消す
        beginnerDisplay.classList.add('hidden');
        beginnerDisplay.classList.remove('tx-beginner');
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
    updateKeyAssignRow('game-key-assign-row');
    setGameplayViewportLock(true);
    document.getElementById('game-start-overlay').classList.remove('hidden');
    document.getElementById('tx-target-text').textContent = '';
    document.getElementById('tx-input-render').textContent = '';
    beginnerDisplay.innerHTML = '';
    document.getElementById('status-msg').innerText = 'READY...';
    const selectedSeconds = parseInt(document.getElementById('time-select').value);
    const selectedMinutes = Math.floor(selectedSeconds / 60);
    const selectedRemainder = selectedSeconds % 60;
    document.getElementById('timer').innerText =
        `${String(selectedMinutes).padStart(2,'0')}:${String(selectedRemainder).padStart(2,'0')}`;
    document.getElementById('score').innerText = '0';
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
    wordsCompleted = 0; wordsMissed = 0;
    document.getElementById('score').innerText = 0;
    masterGain.gain.setValueAtTime(1, audioCtx.currentTime);
    timerId = setInterval(tick, 1000);
    startTxGame();
}

// ── Audio helpers ──────────────────────────────────────────────────────────────
function killCurrentAudio() {
    activeOscillators.forEach(o => { try { o.stop(); } catch(e){} });
    activeOscillators = [];
    toneSchedule = [];
}

function tick() {
    if (!isPlaying) return;
    timeLeft--;
    const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
    document.getElementById('timer').innerText = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if (timeLeft <= 0) endGame();
}

// ── TX Game ────────────────────────────────────────────────────────────────────
function startTxGame() {
    txCharIndex = 0; txMorseInput = ''; txCharTimer = null;
    dotHeld = false; dashHeld = false; lastSentSym = null; keyerPending = false;
    asobiMistakeCounts = {};
    // 前回プレイの短点・長点表示をクリア
    const _txMorseBox = document.getElementById('tx-morse-input');
    const _txMorseRender = document.getElementById('tx-input-render');
    if (_txMorseRender) _txMorseRender.innerHTML = '';
    if (_txMorseBox) _txMorseBox.style.display = (beginnerMode && !morseBoardMode) ? '' : 'none';
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    TX_CHAR_GAP = Math.round(TX_DOT_TIME * 1000 * (isTouch ? 5.0 : 2.0));  // モバイル: dit×5.0 / デスクトップ: dit×2.0 (どちらもWPM連動)
    if (isTouch && !morseBoardMode) document.getElementById('tx-paddle-area').classList.remove('hidden');
    document.getElementById('status-msg').innerText = morseBoardMode ? 'MORSE BOARD READY...' : 'TRANSMIT...';
    document.addEventListener('keydown', onTxKeyDown);
    document.addEventListener('keyup',   onTxKeyUp);
    nextTxWord();
}

function nextTxWord() {
    const raw = pickWord();
    txWord = raw.split('');
    txCharIndex = 0; txMorseInput = '';
    txWordHasMistake = false;
    renderTxInput();
    updateTxDisplay();
    if (beginnerMode) updateTxBeginnerDisplay();
    document.getElementById('status-msg').innerText = morseBoardMode ? 'MORSE BOARD READY...' : 'TRANSMIT...';
    startWordTimer(raw);
}

function updateTxDisplay() {
    const target = document.getElementById('tx-target-text');
    target.innerHTML = txWord.map((ch, i) => {
        if (i < txCharIndex) return `<span class="tx-char-done">${ch}</span>`;
        if (i === txCharIndex) return `<span class="tx-char-current">${ch}</span>`;
        return `<span class="tx-char-next">${ch}</span>`;
    }).join('');
    fitTxTargetText();
}

// PC・スマホとも基本は同じ3.5remで表示し、枠からはみ出す場合だけ縮小する。
function fitTxTargetText() {
    const target = document.getElementById('tx-target-text');
    const display = document.getElementById('tx-word-display');
    if (!target || !display || !target.textContent) return;

    target.style.fontSize = '3.5rem';
    const availableWidth = Math.max(0, display.clientWidth - 8);
    if (target.scrollWidth <= availableWidth) return;

    let lower = 16;
    let upper = parseFloat(getComputedStyle(target).fontSize);
    for (let i = 0; i < 9; i++) {
        const middle = (lower + upper) / 2;
        target.style.fontSize = `${middle}px`;
        if (target.scrollWidth <= availableWidth) lower = middle;
        else upper = middle;
    }
    target.style.fontSize = `${lower}px`;
}

window.addEventListener('resize', () => {
    if (isPlaying && gameMode === 'TX') fitTxTargetText();
});

function updateTxBeginnerDisplay() {
    if (!beginnerMode) return;
    const ch = txWord[txCharIndex];
    if (!ch) { beginnerDisplay.innerHTML = ''; beginnerDisplay.classList.remove('tx-beginner'); return; }
    const code = MORSE_CODE[ch];
    if (!code) { beginnerDisplay.innerHTML = ''; beginnerDisplay.classList.remove('tx-beginner'); return; }
    beginnerDisplay.classList.add('tx-beginner');
    beginnerDisplay.innerHTML = code.split('').map(sym =>
        `<span class="${sym === '.' ? 'msym-dot-lg' : 'msym-dash-lg'}"></span>`
    ).join('');
}

function renderTxInput() {
    const box = document.getElementById('tx-morse-input');
    // 送信モード(TX)で初心者モードOFFなら打鍵中の短点・長点は非表示(音だけで判断)
    if (gameMode === 'TX' && (morseBoardMode || !beginnerMode)) {
        box.style.display = 'none';
        document.getElementById('tx-input-render').innerHTML = '';
        return;
    }
    box.style.display = '';
    document.getElementById('tx-input-render').innerHTML = txMorseInput.split('').map(sym =>
        `<span class="${sym === '.' ? 'msym-dot-lg' : 'msym-dash-lg'}"></span>`
    ).join('');
}

// ── Iambic keyer ───────────────────────────────────────────────────────────────
function keyerStep() {
    keyerPending = false;
    if (!isPlaying || (gameMode !== 'TX' && gameMode !== 'FREE')) return;
    if (!dotHeld && !dashHeld) {
        if (txMorseInput && !txCharTimer) {
            txCharTimer = setTimeout(
                gameMode === 'FREE' ? decodeFreeChar : decodeTxChar,
                TX_CHAR_GAP
            );
        }
        return;
    }
    if (txCharTimer) { clearTimeout(txCharTimer); txCharTimer = null; }
    let sym;
    if (dotHeld && dashHeld) {
        sym = (lastSentSym === '.') ? '-' : '.';
    } else {
        sym = dotHeld ? '.' : '-';
    }
    lastSentSym = sym;
    playSidetone(sym === '-');
    txMorseInput += sym;
    if (gameMode === 'FREE') renderFreeInput(); else renderTxInput();
    const elemMs = (sym === '.' ? TX_DOT_TIME : TX_DOT_TIME * 3) * 1000;
    const gapMs  = TX_DOT_TIME * 1000;
    keyerPending = true;
    setTimeout(keyerStep, elemMs + gapMs);
}

function startKeyerLoop() {
    if (!keyerPending) keyerStep();
}

function tapSymbol(isDash) {
    if (!isPlaying || (gameMode !== 'TX' && gameMode !== 'FREE')) return;
    if (txCharTimer) { clearTimeout(txCharTimer); txCharTimer = null; }
    const sym = isDash ? '-' : '.';
    playSidetone(isDash);
    txMorseInput += sym;
    if (gameMode === 'FREE') renderFreeInput(); else renderTxInput();
    txCharTimer = setTimeout(
        gameMode === 'FREE' ? decodeFreeChar : decodeTxChar,
        TX_CHAR_GAP
    );
}

// タッチパドル(長押し対応): touchstart で押下→キーヤーループ開始、touchend/cancel で解放
function paddleDown(isDash) {
    if (!isPlaying || (gameMode !== 'TX' && gameMode !== 'FREE')) return;
    if (isDash) {
        if (!dashHeld) { dashHeld = true; startKeyerLoop(); }
    } else {
        if (!dotHeld) { dotHeld = true; startKeyerLoop(); }
    }
}
function paddleUp(isDash) {
    if (isDash) dashHeld = false;
    else dotHeld = false;
}

function onTxKeyDown(e) {
    if (!isPlaying || (gameMode !== 'TX' && gameMode !== 'FREE')) return;
    if (gameMode === 'TX' && morseBoardMode) {
        handleMorseBoardKey(e);
        return;
    }
    if (e.code === dotKey) {
        e.preventDefault();
        if (!dotHeld) { dotHeld = true; startKeyerLoop(); }
    } else if (e.code === dashKey) {
        e.preventDefault();
        if (!dashHeld) { dashHeld = true; startKeyerLoop(); }
    }
}

// Morse Boardはデコード済みの文字を通常のキーボード入力として送信する。
// 短点・長点へ変換せず、入力された文字をそのまま現在の出題と照合する。
function handleMorseBoardKey(e) {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (!e.key || e.key.length !== 1) return;
    const decoded = e.key.toUpperCase();
    // ピリオド（・－・－・－）打鍵でプレイ中のロビーへの強制送還コマンドとする
    if (decoded === '.') {
        if (isPlaying) { e.preventDefault(); quitGame(); }
        return;
    }
    if (!MORSE_CODE[decoded]) return;
    e.preventDefault();
    evaluateTxChar(decoded);
}

function onTxKeyUp(e) {
    if (e.code === dotKey) {
        e.preventDefault();
        dotHeld = false;
    } else if (e.code === dashKey) {
        e.preventDefault();
        dashHeld = false;
    }
}

function playSidetone(isDash) {
    if (!audioCtx) return;
    const dur = isDash ? TX_DOT_TIME * 3 : TX_DOT_TIME;
    const t   = audioCtx.currentTime;
    const ms  = Date.now();
    const osc = audioCtx.createOscillator();
    const gn  = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 750;
    gn.gain.setValueAtTime(0, t);
    gn.gain.linearRampToValueAtTime(0.4, t + 0.006);
    gn.gain.setValueAtTime(0.4, t + dur - 0.003);
    gn.gain.linearRampToValueAtTime(0, t + dur + 0.006);
    osc.connect(gn); gn.connect(masterGain);
    osc.start(t); osc.stop(t + dur + 0.01);
    toneSchedule.push({ onTime: ms, offTime: ms + dur * 1000 });
}

function decodeTxChar() {
    txCharTimer = null;
    const decoded  = MORSE_REVERSE[txMorseInput] || null;
    txMorseInput = '';
    renderTxInput();
    lastSentSym = null;
    evaluateTxChar(decoded);
}

function evaluateTxChar(decoded) {
    const expected = txWord[txCharIndex];
    const txArea   = document.getElementById('tx-area');
    const isCorrect = (decoded === expected);
    if (isCorrect) {
        txCharIndex++;
        score++;
        document.getElementById('score').innerText = score;
        txArea.classList.remove('flash-error');
        txArea.classList.add('flash-correct');
        setTimeout(() => txArea.classList.remove('flash-correct'), 400);
        document.getElementById('status-msg').innerText = `✓ ${expected}`;
        if (txCharIndex >= txWord.length) {
            wordsCompleted++;
            // その単語をノーミス（誤入力ゼロ）で打ち切れた場合、全体の制限時間を1秒延長する
            if (!txWordHasMistake) {
                timeLeft++;
                const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
                document.getElementById('timer').innerText = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
                showTimeBonusEffect();
            }
            nextTxWord();
        } else {
            updateTxDisplay();
            if (beginnerMode) updateTxBeginnerDisplay();
        }
    } else {
        txWordHasMistake = true;
        asobiMistakeCounts[expected] = (asobiMistakeCounts[expected] || 0) + 1;
        txArea.classList.remove('flash-correct');
        txArea.classList.add('flash-error');
        setTimeout(() => txArea.classList.remove('flash-error'), 400);
        document.getElementById('status-msg').innerText = `✗ RETRY: ${expected}`;
    }
}

// 時間延長ボーナスの視覚エフェクト（TIME表示のそばに「+1s」がふわっと浮かび、TIME自体もグロー点滅する）
function showTimeBonusEffect() {
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;
    const timerStat = timerEl.closest('.stat-item');
    if (timerStat) {
        const pop = document.createElement('span');
        pop.className = 'time-bonus-pop';
        pop.textContent = '+1s';
        timerStat.appendChild(pop);
        pop.addEventListener('animationend', () => pop.remove());
    }
    timerEl.classList.remove('time-bonus-flash');
    void timerEl.offsetWidth; // reflow（連続ボーナス時にアニメーションを再始動させる）
    timerEl.classList.add('time-bonus-flash');
    setTimeout(() => timerEl.classList.remove('time-bonus-flash'), 500);
}

function cleanupTx() {
    document.removeEventListener('keydown', onTxKeyDown);
    document.removeEventListener('keyup',   onTxKeyUp);
    dotHeld = false; dashHeld = false; keyerPending = false;
    if (txCharTimer) { clearTimeout(txCharTimer); txCharTimer = null; }
    clearWordTimer();
    const pa = document.getElementById('tx-paddle-area');
    if (pa) pa.classList.add('hidden');
    beginnerDisplay.classList.remove('tx-beginner');
}

// ── Free Input Mode ────────────────────────────────────────────────────────────
function startFreeMode() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
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
    document.getElementById('free-screen').classList.remove('hidden');
    updateKeyAssignRow('free-key-assign-row');
    setGameplayViewportLock(true);
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouch) document.getElementById('free-paddle-area').classList.add('visible');
    doResume.then(() => { setTimeout(launchFreeMode, 300); })
            .catch(() => { setTimeout(launchFreeMode, 300); });
}

function launchFreeMode() {
    masterGain.gain.setValueAtTime(1, audioCtx.currentTime);
    gameMode = 'FREE';
    // 開始画面の速度設定を引き継ぎ、フリー入力画面側のセレクタにも反映
    document.getElementById('free-wpm-select').value = document.getElementById('wpm-select').value;
    const wpmValFree = parseInt(document.getElementById('free-wpm-select').value);
    TX_DOT_TIME = 1.2 / wpmValFree;
    isPlaying = true;
    freeTextBuffer = '';
    txMorseInput = ''; txCharTimer = null;
    dotHeld = false; dashHeld = false; lastSentSym = null; keyerPending = false;
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    TX_CHAR_GAP = Math.round(TX_DOT_TIME * 1000 * (isTouch ? 5.0 : 2.0));  // モバイル: dit×5.0 / デスクトップ: dit×2.0 (どちらもWPM連動)
    renderFreeInput();
    renderFreeText();
    document.addEventListener('keydown', onTxKeyDown);
    document.addEventListener('keyup',   onTxKeyUp);
}

function changeFreeWpm() {
    const wpmVal = parseInt(document.getElementById('free-wpm-select').value);
    TX_DOT_TIME = 1.2 / wpmVal;
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    TX_CHAR_GAP = Math.round(TX_DOT_TIME * 1000 * (isTouch ? 5.0 : 2.0));  // モバイル: dit×5.0 / デスクトップ: dit×2.0 (どちらもWPM連動)
    // 開始画面のセレクタとも同期しておく
    const mainSel = document.getElementById('wpm-select');
    if (mainSel) mainSel.value = String(wpmVal);
}

function decodeFreeChar() {
    txCharTimer = null;
    const decoded = MORSE_REVERSE[txMorseInput] || '?';
    txMorseInput = '';
    lastSentSym = null;
    renderFreeInput();
    freeTextBuffer += decoded;
    renderFreeText();
}

function renderFreeInput() {
    document.getElementById('free-morse-render').innerHTML = txMorseInput.split('').map(sym =>
        `<span class="${sym === '.' ? 'msym-dot-lg' : 'msym-dash-lg'}"></span>`
    ).join('');
}

function renderFreeText() {
    const el = document.getElementById('free-text-display');
    el.textContent = freeTextBuffer;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    el.appendChild(cursor);
    el.scrollTop = el.scrollHeight;
}

function resetFreeMode() {
    freeTextBuffer = '';
    txMorseInput = '';
    if (txCharTimer) { clearTimeout(txCharTimer); txCharTimer = null; }
    dotHeld = false; dashHeld = false; keyerPending = false; lastSentSym = null;
    renderFreeInput();
    renderFreeText();
}

function quitFreeMode() {
    isPlaying = false;
    setGameplayViewportLock(false);
    gameMode = 'TX';
    document.removeEventListener('keydown', onTxKeyDown);
    document.removeEventListener('keyup',   onTxKeyUp);
    if (txCharTimer) { clearTimeout(txCharTimer); txCharTimer = null; }
    dotHeld = false; dashHeld = false; keyerPending = false;
    document.getElementById('free-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    updateTxModeDesc();
}

// ── IC-7300 Spectrum Scope ─────────────────────────────────────────────────────
function initScope() {
    waterfallRows = [];
    for (let i = 0; i < FALL_H; i++) waterfallRows.push(new Float32Array(SCOPE_W).fill(0));
    smoothSpectrum = new Float32Array(SCOPE_W).fill(0);
    toneStrength = 0;
    scopeRunning = false;
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

// ミスが多かった文字を多い順に並べてリザルト画面に表示する
function renderMistakeBreakdown() {
    const area = document.getElementById('asobi-mistake-area');
    const list = document.getElementById('asobi-mistake-list');
    if (!area || !list) return;
    const entries = Object.entries(asobiMistakeCounts).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) {
        area.classList.add('hidden');
        list.innerHTML = '';
        return;
    }
    const top = entries.slice(0, 8); // 表示件数は上位8件まで
    list.innerHTML = top.map(([ch, count]) =>
        `<span style="display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border:1px solid var(--border); border-radius:3px; background:rgba(0,0,0,0.35); font-size:0.85rem;">` +
        `<b style="color:var(--error);">${ch}</b><span style="color:var(--primary-dim); font-size:0.7rem;">×${count}</span></span>`
    ).join('');
    area.classList.remove('hidden');
}

// ── End / Quit ─────────────────────────────────────────────────────────────────
function quitGame() {
    isPlaying = false; scopeRunning = false;
    setGameplayViewportLock(false);
    document.getElementById('game-start-overlay').classList.add('hidden');
    if (gameStartTimer) { clearTimeout(gameStartTimer); gameStartTimer = null; }
    clearInterval(timerId); killCurrentAudio();
    cleanupTx();
    score = 0;
    gameMode = 'TX';
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    updateTxModeDesc();
}

function retryGame() {
    gameMode = 'TX';
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    updateTxModeDesc();
}

function endGame() {
    isPlaying = false; scopeRunning = false;
    setGameplayViewportLock(false);
    clearInterval(timerId); killCurrentAudio();
    cleanupTx();
    const minutes = Math.round(initialSeconds / 60);
    document.getElementById('final-result-text').innerText =
        `${score} ${score === 1 ? 'character' : 'characters'} / ${minutes} min` + t('resultSuffix', wordsCompleted);
    renderMistakeBreakdown();
    const resultKeyHint = document.getElementById('result-key-hint');
    if (resultKeyHint) resultKeyHint.textContent = morseBoardMode ? t('resultHintMorseBoard') : t('resultHintEsc');
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
    return t('shareText', minutes, score, wordsCompleted);
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
                body: JSON.stringify({ nickname: 'noname', score, mode: 'ASOBI', is_beginner: beginnerMode ? 1 : 0, minutes })
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
        const rankRes = await fetch(`https://api.jl1gix.com/api/scores/rank?score=${score}&mode=ASOBI&minutes=${minutes}`);
        const rankData = await rankRes.json();
        if (rankData.percentile !== undefined) pct = rankData.percentile;
    } catch (e) {}
    const rankHref = (LANG === 'en' ? '/en/ranking.html' : '/ranking.html') + `?mode=ASOBI&time=${minutes}`;
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

// ── Initialize mode description on page load ───────────────────────────────────
updateTxModeDesc();
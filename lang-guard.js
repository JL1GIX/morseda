// ── 言語設定の永続化ガード ──────────────────────────────────────────
// 一度どちらかの言語で明示的に切り替えたら（プルダウン／🌐ボタン操作）、
// それ以降はどのページを開いても、明示的に切り替えるまで同じ言語のページへ
// 自動的に揃える（localStorageに保存した言語設定を全ページで強制する）。
// localStorageが使えない環境（プライベートブラウズ等）では何もしない。
(function () {
    'use strict';
    var STORAGE_KEY = 'morseda_lang';
    try {
        var htmlLang = (document.documentElement.lang === 'en') ? 'en' : 'ja';
        var stored = localStorage.getItem(STORAGE_KEY);

        if (stored !== 'ja' && stored !== 'en') {
            // 初回訪問（未設定）: 現在開いているページの言語を初期値として記憶する
            localStorage.setItem(STORAGE_KEY, htmlLang);
            return;
        }

        if (stored === htmlLang) return;

        // 保存済みの言語設定と、実際に開いているページの言語が食い違っている場合、
        // 対応する言語のページへ即座にリダイレクトする
        var path = location.pathname;
        var file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        var baseJa = file.replace(/-en\.html$/, '.html');
        var baseEn = baseJa.replace(/\.html$/, '-en.html');
        var target = (stored === 'en') ? baseEn : baseJa;

        if (target && target !== file) {
            location.replace('/' + target + location.search + location.hash);
        }
    } catch (e) {
        // localStorage不可時は何もしない（言語はページごとの表記のまま）
    }
})();

// 言語切替コントロール（プルダウン／🌐ボタン）から呼ばれる: 選んだ言語を記憶する
function setMorsedaLangPref(lang) {
    try { localStorage.setItem('morseda_lang', lang); } catch (e) {}
}

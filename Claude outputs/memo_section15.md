## 15. ミス時の枠点滅の不具合修正、正確重視モードのレイアウトシフト解消、OGP画像のタイトル文字拡大 (2026-11)

熊谷さんより3点の修正依頼があった。

### 15.1 送信モード・お遊びモードで「間違えたときの枠が赤く光る」演出が機能していなかった不具合を修正

`tx.js`の`evaluateTxChar()`と`asobi.js`の`evaluateTxChar()`/`handleWordTimeout()`は、正解/不正解時に`.flash-correct`/`.flash-error`クラス（`@keyframes error-flash`/`correct-flash`で`border-color`・`box-shadow`を一瞬変化させる演出）を付け外ししていたが、付与先の対象要素が**`#tx-area`（お題表示とモールス入力表示をまとめているだけの、border等のスタイルを一切持たないラッパーdiv）になっていた**ため、border-colorを変化させても見た目上は何も起きず、box-shadowのみがラッパー全体の外周にごく薄く出る程度で、「枠が光る」効果が実質機能していなかった。

実際に視認可能な枠（`border: 1px solid var(--border); border-top: 2px solid var(--primary);`と四隅のコーナー装飾を持つお題表示ボックス）は`#tx-word-display`（`#tx-area`の子要素）の方だったため、`.flash-error`/`.flash-correct`の付与先を`#tx-area`から`#tx-word-display`に変更した。受信モード（`rx.js`）は元々正しく`#input-display`（同様に視認可能な枠を持つ要素）に対して演出していたため対象外（変更不要）。

- 対象: `tx.js`の`evaluateTxChar()`（1箇所）、`asobi.js`の`handleWordTimeout()`・`evaluateTxChar()`（2箇所）。`cleanupTx()`内の`#tx-area`参照（Morse Boardモード切替用の表示/非表示トグル、枠点滅とは無関係）は変更していない。
- `tx.js`/`asobi.js`は日英共通で読み込まれるファイルのため、修正は`tx.html`/`tx-en.html`/`free.html`/`free-en.html`/`asobi.html`/`asobi-en.html`の全てに自動的に反映される。
- Playwrightで`evaluateTxChar()`に誤った文字を直接渡してミスを再現し、お題表示の枠が赤く光ることを確認済み。

### 15.2 お遊びモード「正確重視」でミス時の「やり直し」表示が画面全体のレイアウトをずらしていた問題を解消

正確重視モード（`gameVariant === 'ACCURACY'`）でミスすると、単語の最初からやり直しになり、`#variant-status`という要素に「↺ やり直し N回」という赤い点滅テキストが表示される（§4.7で追加）。この要素は`.hidden { display: none !important; }`で表示/非表示を切り替えていたため、テキストが出現する瞬間に要素の高さ分（1行+余白）だけ**その下にある時間/スコア/WPM・スペクトラムスコープ・お題表示・SIGNALバー・QUITボタン等がまとめて下にずれる**という問題が起きていた。熊谷さんより「ボタンの位置（モバイル版とか）がずれるのを防ぎたい、文字は追加で表示するだけでレイアウト自体は変えないでほしい」との指摘があった。

- **対策**: `#variant-status`に`min-height: 1.3em;`を追加し、`display`ではなく`visibility`のみで表示/非表示を切り替えるよう変更した（`.active`クラスで`visibility: visible`、デフォルトは`visibility: hidden`）。これにより、正確重視モードでプレイ中は「テキストが無い間も同じ高さの透明な領域」が常に確保され、ミスでテキストが出現/消滅してもその下の要素は一切動かない。
- **ただし、この領域を常時確保するのは正確重視モードの間だけに限定した**（`updateVariantStatusUI()`内で`gameVariant !== 'ACCURACY'`の場合は従来通り`.hidden`（`display: none`）のままにし、スペース自体を取らない）。普通モード・一発勝負モードはこの表示自体を使わないため、画面レイアウトは一切変更していない（従来通り）。
- `asobi.js`の`updateVariantStatusUI()`（表示/非表示の中心ロジック）と`nextTxWord()`内（単語が変わるたびに前の単語のミス表示をクリアする処理）の計2箇所を、`display`の付け外しから`visibility`用の`.active`クラスの付け外しに変更。`asobi.html`/`asobi-en.html`の`#variant-status`のCSSに`min-height`と`visibility`ベースの切り替えを追加（`tx.js`/`rx.js`にはこの仕組み自体が無いため対象外）。
- Playwrightで、正確重視モード開始直後とミス発生後の両時点でQUITボタン等の`getBoundingClientRect()`の座標を比較し、ずれが実質ゼロ（サブピクセル単位の誤差のみ）であることを確認済み。普通モードでは`#variant-status`が従来通り`display: none`のままで、スペース自体が追加されていないことも確認済み。

### 15.3 Xシェア画像（OGP画像）の「モールス打」タイトル文字を拡大

`ogp.png`生成用のHTML（`.title`クラス、CONTESTのモールス符号ワードマークと共に表示される「モールス打」の文字）のフォントサイズを`86px`→`104px`に拡大し、Playwrightで再レンダリングして`ogp.png`を差し替えた。カード幅1124pxに対しタイトルの実測幅は約607px（拡大後）で、左右に十分な余白が残っており、はみ出し・折り返しは発生していない。レイアウト・配色・CONTESTワードマーク自体は変更していない。

---


## 17. 「昨日のランキング」ページの削除、お遊びモード正確重視モードの得点リセット機能を取りやめ (2026-11)

熊谷さんより2点の依頼があった。

### 17.1 「昨日のランキング」ページを当分使わないため削除

「昨日のランキング」(`ranking-yesterday.html`/`ranking-yesterday-en.html`/`ranking-asobi-yesterday.html`/`ranking-asobi-yesterday-en.html`の計4ファイル)を削除した。「今日のランキング」(`ranking-today.html`系)は指示通り残している。

削除に伴い、他のランキングページ側にあった「📅 昨日のランキング」への導線（リンクとそのhref更新用JS）もすべて取り除いた。対象は送受信ランキング側の`ranking.html`/`ranking-en.html`/`ranking-today.html`/`ranking-today-en.html`と、お遊びランキング側の`ranking-asobi.html`/`ranking-asobi-en.html`/`ranking-asobi-today.html`/`ranking-asobi-today-en.html`の計8ファイル。「今日のランキング」「全期間ランキング」への導線はそのまま残しており、削除の影響は受けない。

また`sitemap.xml`から、削除した4ページ分の`<url>`エントリも合わせて削除した。

Playwrightで、残った8ファイルすべてについて「昨日のランキング」へのリンクがDOM上に存在しないこと、「今日」「全期間」への導線は健在であること、ページ読み込み時にJSエラーが発生していないことを確認済み。`sitemap.xml`もXMLとして正しく解析できることを確認済み。

### 17.2 お遊びモード・正確重視モードの「ミス時に得点も巻き戻す」機能を取りやめ

以前、お遊びモードの正確重視モード（非初心者モード限定）で、ミスして単語の最初からやり直しになる際、その単語で既に稼いでいた得点も単語に入った時点のscoreまで巻き戻す仕様にしていた（例: 70点の状態で「BLOOM」のBLOOまで打ててもMでミスしたら74点ではなく70点に戻る）。熊谷さんより「やっぱ得点リセットの機能は無しで」とのご依頼があったため、この得点巻き戻し処理を撤廃した。

`asobi.js`の修正内容:
- 単語開始時の得点を記録していた`wordStartScore`変数（宣言・`nextTxWord()`内での記録処理）を削除。
- `evaluateTxChar()`のACCURACYブロックから`if (!beginnerMode) { score = wordStartScore; ... }`の巻き戻し処理を削除。

ミス時に単語の最初からやり直しになる挙動（`txCharIndex = 0`）や、「↺ やり直し N回」カウンタ（`accuracyResetCount`）の表示は従来通り変更していない。得点だけは、ミスするまでに稼いだ分も含めて一切巻き戻らないようになった。

Playwrightで、正確重視モード・非初心者モードを想定した状態（score=70、単語「BLOOM」の3文字目で誤入力）を直接作り、ミス後も`score`が70のまま変化しないこと、`txCharIndex`が0に戻ること（単語やり直し自体は機能）、`accuracyResetCount`が1に増えること（やり直しカウンタ表示も機能）を確認済み。

---


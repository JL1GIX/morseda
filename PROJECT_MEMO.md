# モールス打 (morseda / morse-center) プロジェクトメモ

このメモは、Cowork (Claude) が次回作業を始めるときに、状況をすぐ把握できるよう残しておくものです。

---

## 1. プロジェクト概要

- **サイト名**: モールス打 — Contest Edition
- **公開 URL**: https://jl1gix.com
- **GitHub リポジトリ**: https://github.com/JL1GIX/morseda
- **運営者**: 熊谷 (コールサイン: JL1GIX)
- **コンセプト**: アマチュア無線コンテストの CW (モールス) 交信を想定した練習ツール。

## 2. 技術構成

- **完全な静的サイト**。ビルドツール・フレームワーク・パッケージマネージャは一切なし。
- 各 HTML ファイルは **CSS を内包した「1ファイル完結」** の形式。`<style>` は分離していない。
- **2026-09〜 例外**: 英語モード実装のため、**JavaScript（ゲームロジック本体）のみ例外的に外部 `.js` ファイルに切り出している**（`index.js` / `tx.js` / `rx.js` / `asobi.js`）。ja/en 両方の HTML から同じ `.js` を読み込むことで、ロジックの修正が1箇所で済むようにするため。CSSは従来通り分離しない。詳細は 9章を参照。
- **多言語対応（英語モード）**: 2026-09 に実装。詳細は 9章「英語モード（多言語対応）」を参照。
- **ホスティング**: GitHub Pages (`CNAME` で `jl1gix.com` を割り当て)。push すれば数十秒〜数分で本番に反映される。
- **バックエンド API**: `https://api.jl1gix.com`(別リポジトリで管理されている想定)
  - `POST /api/scores` — スコア登録
  - `PUT /api/scores/:id` — ニックネーム後付け更新
  - `GET /api/scores?mode=&minutes=&page=` — ランキング取得
  - `GET /api/scores/rank?score=&mode=&minutes=` — 順位/パーセンタイル取得
  - **このリポジトリには API のコードは含まれていない**。API 側の改修が必要な場合は熊谷さんに別途お伝えする。

## 3. ファイル構成 (このリポジトリ)

| ファイル | 役割 | 規模 |
|---|---|---|
| `index.html` | トップページ。モード選択 (受信/送信) と、JL1GIX を 20WPM で打つスペクトラムスコープ風アニメーション | 約 17KB |
| `index.js` | index.html のゲームロジック（スペクトラムスコープ描画・キーボードショートカット）を外部化したもの。`index-en.html` と共有。テキストは全て静的HTML側にあるためi18n辞書は無し | 約 10KB |
| `rx.html` | **受信モード**。コールサイン・RST レポートをランダム生成して音で出題、ユーザーが聞き取って入力 | 約 33KB |
| `rx.js` | rx.html のゲームロジック外部化版。`rx-en.html` と共有。i18n辞書(`I18N`/`t()`)でJS生成テキストを切替 | 約 34KB |
| `tx.html` | **送信モード**。キーボード/パドルでモールスを打つ。Iambic キーヤー対応。ミス分析（打ち間違えの多い文字表示）機能あり | 約 46KB |
| `tx.js` | tx.html のゲームロジック外部化版。`tx-en.html` と共有。i18n辞書でJS生成テキストを切替 | 約 56KB |
| `asobi.html` | **お遊びモード**。ロビー画面（`#start-screen`）で単語種別（身近な単語/コールサイン+コンテストナンバー）×プレイスタイル（普通/正確重視/一発勝負）を選ぶ2軸・計6通りの単語早打ちゲーム（12章参照）。ミス分析機能あり | 約 55KB |
| `asobi.js` | asobi.html のゲームロジック外部化版。`asobi-en.html` と共有 | 約 70KB |
| `ranking.html` | スコアランキング表示（全期間）。モード別 (rx/tx) × 時間別 (1分/3分/5分)。お遊びモードは12.6章の専用ページに分離したため非表示。`ranking-today.html`/`ranking-yesterday.html` への導線リンクあり | 約 23KB |
| `ranking-today.html` | **今日のランキング**。`ranking.html` と同じモード/時間タブを持つ独立ページ。クライアント側で全ページ取得→JST日付でフィルタして表示（11.4章参照） | 約 23KB |
| `ranking-yesterday.html` | **昨日のランキング**。`ranking-today.html` と全く同じ仕組みで対象日を1日前にしたもの | 約 23KB |
| `ranking-asobi.html` / `ranking-asobi-today.html` / `ranking-asobi-yesterday.html` | **お遊びモード専用ランキング**（全期間/今日/昨日）。単語種別タブ×プレイスタイルタブ×時間タブの3段タブで6通りの組み合わせを切替表示（`?wordcat=&variant=&time=`をURLパラメータで共有可）。詳細は12章 | 各約 23〜26KB |
| `morse-table.html` | モールス符号表 (リファレンス) | 約 15KB |
| `how-to-use.html` | 使い方ガイド（全機能の説明、キーボードショートカット一覧を含む） | 約 22KB |
| `profile.html` | 運営者情報 | 約 16KB |
| `privacy.html` | プライバシーポリシー | 約 11KB |
| `contact.html` | お問い合わせ | 約 11KB |
| `sitemap.xml` | サイトマップ。ja/en 全30ページ分のURLと`hreflang`相互参照を記載（2026-10、`ranking-today`/`ranking-yesterday`のja/en 4ページ、`ranking-asobi`系(全期間/今日/昨日)のja/en 6ページを含む。旧`ranking-hardcore`系6ページは12章の再設計で廃止） | 約 10KB |
| `*-en.html`（`index-en.html`, `tx-en.html`, `rx-en.html`, `asobi-en.html`, `ranking-en.html`, `ranking-today-en.html`, `ranking-yesterday-en.html`, `ranking-asobi-en.html`, `ranking-asobi-today-en.html`, `ranking-asobi-yesterday-en.html`, `profile-en.html`, `contact-en.html`, `how-to-use-en.html`, `morse-table-en.html`, `privacy-en.html`） | 各ページの英語版。ルート直下に ja 版と並べて配置（`/en/`のようなサブフォルダは使わない）。詳細は 9章 | 各ページ ja版とほぼ同サイズ |
| `CNAME` | GitHub Pages のカスタムドメイン (`jl1gix.com`) |  |
| `favicon-*.png` / `apple-touch-icon.png` / `ogp.png` | アイコン・OGP 画像 |  |

⚠ `C:\Users\noayo\Downloads\JL1GIX\モールス打\` の **直下** にも同名 HTML が置かれているが、これは Git 管理外の古いコピー。**編集対象はあくまで `morseda\` サブフォルダ内のファイル**。

## 4. デザイン規約 (2026-11 白ベースに刷新)

**2026年11月、熊谷さんの明示的な依頼により「黒ベース」から「白ベース（緑アクセントは維持）」の親しみやすいデザインに全面刷新した。** 過去に「白基調テーマ」へ変更する試みがあり Revert されていた (commit `3b5f5af`) が、これは当時 **元の鮮やかな緑 `#00d06a` をそのまま白背景の文字色に流用してしまい、コントラスト比が約1.8:1（WCAG AA基準の4.5:1を大きく下回る）となって文字が霞んで見えた** ことが主因と推測される。今回の刷新ではこの反省を踏まえ、**読む文字用に別途ダークチューニングした緑 `#007b43`（白背景で5.2:1）を新設**し、鮮やかな緑は「あえて暗いままにする一部の計器系パーツ」の装飾色として温存する設計にした。**この「今後は白ベースを正とする」という方針は、2026年11月に14章の経緯により撤回され、サイトは黒ベース（黒背景+白文字）に戻っている。以下4章・4.1〜4.9は白ベース期の設計判断の記録として残すが、現行の配色は14章を参照のこと。**

デザインコンセプト:「親しみやすい白い筐体の中に、昔ながらの暗いCRT計器窓がいくつか埋め込まれている」。サイト全体（カード、ボタン、設定パネル、ナビ、フッター）は白ベースに統一しつつ、**無線機の実機を模した「読み取り窓」的な一部の要素だけ意図的に暗いまま残して**、アマチュア無線らしい質感とコントラスト確保を両立させている。暗いまま残す主な要素: 送受信の文字表示窓 (`#input-display` / `#mobile-input` / `#tx-word-display` / `#tx-morse-input` / `#free-output-block` / `#free-input-block`)、モールス記号点滅表示 (`#beginner-display`)、パドル/キーボタン (`.tx-paddle-btn`)、ゲーム開始カウントダウン全画面オーバーレイ (`#game-start-overlay`)、モーダル/メニューの背景スクリム (`#key-customize-modal` 背景, `#menu-overlay`)、モールス符号表の各セル (`.morse-cell`)、プロフィールページの運営者情報ボックス (`.profile-box`)。これらの「暗い窓」の中に乗る文字・記号は、必ず `*-bright` 系トークン（下記）を使うこと（通常の `--primary` 等は白背景向けにダークチューニング済みのため、暗い窓の上では視認性が失われる）。

```css
:root {
    /* 文字・読みやすいUI用(白背景上で可読性を確保するため暗めにチューニング) */
    --primary:        #007b43;   /* メインの緑、本文・ボタン等 (白背景コントラスト比 約5.2:1) */
    --primary-dim:    #19815a;   /* サブの緑 */
    --bg:             #f6faf8;   /* ページ背景(ごく薄い白緑) */
    --panel:          #ffffff;   /* パネル/カード背景(純白) */
    --border:         #d7e9e0;   /* 罫線(淡い緑) */
    --border-strong:  #3d9c66;   /* フォーカス時など、はっきり見せたい罫線 */
    --error:          #c0392b;
    --success:        #15803d;

    /* 暗い計器窓の中だけで使う「鮮やかな緑」系(元の暗色テーマの色をそのまま流用) */
    --primary-bright: #00d06a;   /* 元のメイン緑。暗い窓の上の文字・枠線用 */
    --primary-soft:   #e6f5ee;   /* 淡い緑の塗り(チップ/ホバー背景など) */
    --error-bright:   #e74c3c;
    --success-bright: #00ee77;
    --scope-bg:       #0a1b12;   /* 暗い計器窓そのものの背景色 */
    --code-color:     #eef7f2;   /* (暗い窓専用) 符号の点/線のような「常に明るい」装飾に使用。本文の文字色としては使わない — 使う場合は `#16241c` 等の読める暗色に読み替えること */
}
```

- フォント: `'Consolas', 'Monaco', 'Courier New', monospace` (変更なし)
- スキャンライン風オーバーレイ (`body::after` の `repeating-linear-gradient`) は白ベースでは不要になったため `display: none` で無効化した（CSSルール自体は将来の参照用に残置）
- ネオン風の `text-shadow` グロー効果は、白背景の上では文字がにじんで見えるため基本的に全廃した（グローは暗い背景の上でのみ効果的）。暗い計器窓の内部に限っては、環境により残している箇所がある
- ボタンのホバーは「薄緑の背景」ではなく「ベタ塗りの `--primary` + 白文字」に変更（薄緑ホバー背景に白文字を重ねると白背景上ではコントラスト不足になるため）
- お問い合わせページ (`contact.html`) の Google フォーム埋め込みiframeには、旧暗色テーマ時代に `filter: invert(0.92) hue-rotate(100deg) saturate(0.7) brightness(0.85);` という「白いGoogleフォームを強引に暗色に反転させる」トリックが使われていたが、白ベース化に伴い**このフィルターは撤去済み**（フォーム本来の白背景がサイトに自然になじむようになったため）
- ファビコン・OGP画像(Xシェア時の画像)も同時に白ベースへ刷新済み。アイコンの図形自体は旧デザイン（電波/Wi-Fiマーク）を維持しつつ、背景を黒→白、図形色を鮮緑→読みやすい濃い緑に変更しただけ（G成分による線形補間で旧画像から機械的に再配色したため、エッジの滑らかさ等は完全に同一）
- フッターは全ページ共通: ランキング / モールス符号表 / 運営者情報 / プライバシーポリシー / お問い合わせ (変更なし)

### 4.1 スペクトラムスコープの白背景化 (2026-11 第2弾)

熊谷さんより「ゲーム中のスコープ画面も黒ではなく白背景にし、水色の波形を表示させたい」との追加依頼を受け、`#scope-container`（`rx.html`/`tx.html`/`asobi.html` 各ja/en、計6ファイル）と `index.html`/`index-en.html` のホーム画面装飾スコープを、**暗い計器窓の例外リストから外し、白背景+水色波形**に変更した。

- `#scope-container` の背景は `var(--scope-bg)`（暗緑 `#0a1b12`）ではなく、新設した `--scope-bg-light: #ffffff` を使う。**`--scope-bg` トークン自体の値は変更していない**（`#game-start-overlay` など、他の「暗いまま残す」要素が同じトークンを共有しているため）。
- 枠線は `#2a6040`（暗緑）→ `var(--border)`、暗いビネット (`#scope-container::after` の黒グラデーション) は廃止。
- `#scope-label`/`#scope-freq` の文字色は `var(--primary-bright)`（暗い窓用の鮮緑、白背景では視認性が悪い）から専用の `#0278b9`（白背景コントラスト比 約4.8:1）に変更。
- canvas描画 (`rx.js`/`tx.js`/`asobi.js` の `wfColor()`・`startScopeAnimation()`、`index.js` の `wfCol()`・`drawFrame()`。3ファイル間で該当関数は完全に同一のため同一パッチを適用) は、緑系ヒートマップ配色を全面的に「白→薄水色→スカイブルー(`rgb(2,120,185)` 系)→紺」のグラデーションへ再配色した。ウォーターフォールの配色関数は連続性を保ったまま5段階の線形補間で再設計。

### 4.2 「緑はアクセントカラーであり、サイト全体の基調色にしない」への方針転換 (2026-11 第3弾)

上記の白ベース刷新 (§4) は「黒背景+緑文字」をそのまま「白背景+緑文字」に置き換えただけだったため、熊谷さんより **「X (Twitter) や YouTubeのような大手サイトは、イメージカラーをサイト全体に使い回してはいない。緑はあくまでアクセントとして sparingly に使うべきで、基本は白背景+黒文字にすること」** という明確な方針修正の依頼があった。これを受け、サイト全33ファイルに対して以下の「Tier分け」でリバランスを行った。

**Tier 1（アクセントではなく、通常のテキスト扱いに変更したもの）:**
- `body` のデフォルト文字色 (`color: var(--primary)` → `color: var(--text)`)。これが本文のほぼ全ての緑文字の根本原因だった。
- ナビゲーションメニュー（ハンバーガーメニュー内の `h3`見出し・リンク一覧）、フッターのリンク一覧
- ページ固有の説明文・サブタイトルタグ (`.subtitle`)、各種ラベル類 (`.stat-label`, `.setting-label`, `.wpm-band-labels`, `.result-key-hint`, `.share-label`, `.sig-label`, `.time-tab`/`.mode-tab` の非選択状態, `.toggle-text`, `select` のテキスト, `#mode-description` の説明文, `.kc-title`/`.kc-label`, `#free-header`, `.msym-key-label`, `#key-assign-display`, ランキング表の `th`/`.rank-num`/`.nickname`/`.time-val`/`.date-val`/`.score-unit`/`.status-msg`/`.page-btn`/`.page-info`/`.back-btn` など)
- 記事ページの `h2`/`h3`（本文見出し。ただし `border-left` の細いアクセント線は緑のまま残置）
- ルートトークン: `--bg`（微緑がかった `#f6faf8` → 完全ニュートラルな `#fafafa`）、`--border`（`#d7e9e0` → `#e5e5e5`）、`--border-strong`（`#3d9c66` → `#b0b0b0`、存在するファイルのみ）、body背景の微緑グラデーション装飾 (`radial-gradient(...rgba(10,125,68,...)`) は完全撤去
- 新設トークン: `--text: #262626`（本文・見出し用の黒に近いニュートラルグレー）、`--text-secondary: #707070`（ラベル・キャプション用のセカンダリグレー）

**Tier 2（意図的なアクセントとして緑を残したもの = ここが唯一の「差し色」）:**
- サイトロゴ的に全ページ共通で表示される `h1`「モールス打」（ブランドの一貫性として、ロゴマーク的に緑を維持する判断）
- ボタン類（`button`, `.start-key-hint`/`.start-keycap`, `#key-customize-btn`, `#free-mode-link button` など、アウトライン→ホバーで塗りつぶす標準ボタンコンポーネント）とそのホバー状態
- 選択中/アクティブ状態（`.time-tab.active`, `.mode-tab.active`, スライダーのつまみ, トグルスイッチのON状態, `.sig-dot.active`）
- 主要な数値リードアウト（`.stat-value`, `.wpm-readout` など、今まさに見てほしい1つの数字）
- ランキング表で「自分の結果」をハイライトする `.my-entry` の背景・ボーダー
- 外部リンク（X/Twitterアイコンリンク、「Inspired by 寿司打」クレジットリンク）、本文中のインラインリンク (`a { color: var(--primary) }`)
- 各種アクセント罫線（カード上辺のボーダー、`h2`の`border-left`、`#mode-description`の`border-left`など、1〜2px程度の細い縁取り）

この方針は今後の新規ページ・機能追加にも踏襲すること。「迷ったら黒/グレー、本当に注目してほしい1箇所だけ緑」を基本方針とする。

### 4.3 ランキング登録日時のJST解釈不具合への対策 (2026-11)

熊谷さんより「日本時間の0時を回った直後にスコア登録すると、ランキング上で前日の日付として表示される」との不具合報告があった。

調査の結果、クライアント側（`ranking*.html` 全12ファイル）の日付計算ロジック自体（`new Date(d.getTime() + 9*60*60*1000)` を経てUTC getterで読む方式）は一貫してタイムゾーン安全に実装されていることを確認した。また `rx.js`/`tx.js`/`asobi.js` のスコア送信処理 (`POST /api/scores`) はいずれもタイムスタンプをクライアントから送っておらず、`created_at` は完全にサーバー側で生成されていることも確認した（= このリポジトリにはAPIサーバーのコードは存在せず、`https://api.jl1gix.com` は別リポジトリ）。

**最有力の仮説**: サーバーが返す `created_at` 文字列にタイムゾーン記号（`Z` や `+09:00`）が付いていない場合、`new Date(created_at)` はブラウザのローカルタイムゾーンとして解釈してしまう（JS仕様上、オフセットなしの日時文字列はローカル時刻扱いになる）。これにより閲覧者のブラウザがJSTのとき、UTC想定で記録された時刻が実質二重にズレ、日本時間0時台の登録が前日扱いになる——という、報告内容と正確に一致する不具合パターンが成立する。ただしこの環境からは `api.jl1gix.com` への直接アクセスがネットワーク許可リストの制約で行えず、実際のレスポンス形式を直接確認することはできていない。

**対策**: `ranking*.html` 全12ファイルに `parseServerTime()` という防御的パーサーを追加した（各ファイルの `const API = ...` の直後に定義）。文字列に既にタイムゾーン記号が付いていればそのまま `new Date()` に渡し、付いていなければ明示的に `Z` を付与してUTCとして解釈する。既にサーバーが正しく `Z`/オフセット付きで返している場合はこの関数は完全に無害（元の挙動と同一）であり、記号なしの場合のみ修正方向に働く安全な実装。`new Date(row.created_at)` の呼び出し箇所（表示用・今日/昨日フィルタ用の両方）を全て `parseServerTime(row.created_at)` に置き換えた。

もし上記の修正後もズレが再発する場合、原因はサーバー側（`api.jl1gix.com`、このリポジトリ外）にある可能性が高く、`created_at` のシリアライズ形式そのものの確認が必要。

### 4.4 残存していた「暗い計器窓」ゾーンの全廃止 + 彩度不足の是正 + ボタンホバーのグラデーション化 (2026-11 第4弾)

§4.2のTier分け後も、ゲームプレイ中の各種「読み取り窓」(`#input-display`/`#mobile-input`、`#tx-word-display`/`#tx-morse-input`、`#free-input-block`/`#free-output-block`、`#beginner-display`+`.msym-dot`/`.msym-dash`(-lg)、`.tx-paddle-btn`、morse-table.htmlの`.morse-cell`、profile.htmlの`.profile-box`)と、ラウンド開始時の`#game-start-overlay`（「3・2・1・GO」演出）は、意図的に「暗い計器盤」として黒背景のまま残していた。熊谷さんより「モールス打はゲーム中などにまだ黒い箇所が残っている。基本的に黒は不要という前提で考えてほしい」との指摘を受け、これら全てを白/グレー基調に変換した。

- 対象ファイル: `rx.html`/`rx-en.html`、`tx.html`/`tx-en.html`、`asobi.html`/`asobi-en.html`、`morse-table.html`/`morse-table-en.html`、`profile.html`/`profile-en.html`（計10ファイル）
- `var(--primary-bright)`/`var(--success-bright)`/`var(--error-bright)`/`var(--code-color)`（いずれも暗い背景前提の鮮色トークン）を使っていた箇所を全て、白/グレー背景を前提にした`var(--primary)`/`var(--success)`/`var(--error)`/`var(--primary-dim)`へ置き換え、強いネオン風`text-shadow`のグロー演出は撤去（白背景ではグローは滲んで見えるだけで視認性を悪化させるため）。
- `var(--scope-bg)`（暗緑`#0a1b12`）を使用していた箇所は全て撤去済み（このトークン自体は現在どのファイルからも参照されていない未使用トークンとして`:root`に残置）。
- `asobi.html`/`asobi-en.html`の単語タイマーバー `#word-timer-bar-wrap` の背景も `rgba(0,0,0,0.35)` → 薄灰 `#ededed` に変更。

**その後、上記変更を含む一連の白ベース化全体に対し、熊谷さんより追加フィードバックがあった:**

> 「全体的に色が薄すぎる。007b43とかそれに合う色に引っ張られすぎなくていいので、ちゃんと目に残るような色を使ってほしい。『親しみやすいサイトにする』と言ったのは、見やすいサイトにすることでもある。黒は完全に廃止でいい（黒スコープ画面やSTART画面の黒背景は廃止）。あとinspired by 寿司打は全部灰色で。」

これを受けて以下の是正を行った（全33ファイル共通の土台部分と、上記10ファイルの読み取り窓まわり）：

- **グレーキャンバスの導入**: ルートトークン `--bg` を `#fafafa`（ほぼ白） → `#e4e7e6`（はっきりグレーと分かる階調）に全33ファイル一括変更。`--panel`（カード背景、白のまま）とのコントラストで「白カード on グレー地」のレイアウトになり、フッターに既に表示されている「Inspired by 寿司打」のテイストに寄せた。
- **読み取り窓の背景を白(`--panel`)からグレー(`--bg`)へ**: `#input-display`、`#beginner-display`、`#tx-word-display`、`#tx-morse-input`、`#free-input-block`、`#free-output-block`、`.morse-cell`、`.profile-box` は、白いカード(`#game-container`等)の上に直接`var(--panel)`(白)を敷いていたため、カードと窓の区別がつかずコントラストが薄く見えていた。これらを`var(--bg)`（新グレー）に変更し、「カードに埋め込まれた計器」として視覚的に独立させた。`.tx-paddle-btn`（ボタン要素）は白背景のまま維持（ボタンはボタンらしく）。
- **`#game-start-overlay`（3・2・1・GOカウントダウン）を薄い演出から鮮やかな演出へ**: 直前の黒廃止対応で一旦`var(--primary-soft)`（ごく薄いミント）の背景にしていたが、これが「色が薄すぎる」の指摘に該当したため、`var(--primary-dim)`→`var(--primary)`→`var(--primary-bright)`を使った**動くグラデーション全面フラッシュ**（白文字・濃い影付き）に変更。`@keyframes start-gradient-shift`でホバーと同系統のアニメーション文法を採用し、黒でも薄いパステルでもない、はっきり目に残る演出にした。
- **`#tx-target-text .tx-char-next`**（次に打つ文字の表示）: `color: var(--primary-dim); opacity: 0.6` は薄すぎたため `color: var(--primary); opacity: 0.7` に変更。

**index.htmlのボタンホバーをグラデーションアニメーションに変更**（熊谷さんより「ボタンにカーソルを乗せると真緑に染まるのが気持ち悪い、もっとグラデーションみたいに鮮やかなカーソルアニメーションにしてほしい」との依頼）:

- `index.html`/`index-en.html`の`button`要素（受信モード/送信モード/お遊びモードの主要3ボタン）。従来の`button:hover { background: var(--primary); }`という単色べた塗りを廃止し、`::before`疑似要素に`linear-gradient(120deg, var(--primary-dim), var(--primary) 45%, var(--primary-bright) 70%, var(--primary))`（`background-size: 300% 300%`）を仕込み、ホバー中は`@keyframes btn-sheen`で`background-position`を連続的にアニメーションさせる、斜めに流れる光沢グラデーション演出にした。文字色は白、影も`rgba(0,123,67,0.4)`程度の緑系ドロップシャドウで統一。
- `#game-start-overlay`のグラデーション演出と視覚的に同系統の手法（動くグラデーション + 白文字）を採用し、サイト内で一貫した「アクセントを使うときは鮮やかに動かす」というモーションの文法にした。

この一連の調整により、「黒は使わない」「緑はアクセントとして sparingly に」という§4.2の方針自体は変えず、**アクセントとして使う緑・エラー/成功色を薄め過ぎない**、**背景はグレー地にして白カードとのコントラストで『見やすさ』と『親しみやすさ』を両立する**という2点を新たな方針として追加する。今後、新規要素を追加する際もこの基準（彩度を落とし過ぎない、地はグレー、カードは白、ここぞという箇所だけ動くグラデーション）に揃えること。

### 4.5 §4.4の演出が過剰との指摘を受けた是正 (2026-11 第5弾)

§4.4で導入した「動くグラデーション」路線について、熊谷さんより以下の具体的な修正依頼があり、全て反映した。

- **「Inspired by 寿司打」の「寿司打」/「Sushi-Da」リンクも灰色に**: `index.html`/`index-en.html`フッターの当該リンクは `color:#007b43`（緑）のインラインスタイルだったが、`color:#707070`（`--text-secondary`相当のグレー）に変更。下線付きの地味なクレジットリンクへ。
- **ボタンホバーの「派手なグラデーション演出」は意図と違った**: 「ボタンにカーソルが重なった時に色が完全に変わる（透明度0になる）のがうっとうしい。枠をちょっと動かす程度でいい」との指摘を受け、`index.html`/`index-en.html`の`button:hover`を全面的に作り直した。背景色・文字色は変化させず（`transparent`＋緑文字のまま）、`transform: translate(-3px, -3px)` + `box-shadow: 3px 3px 0 var(--primary)`という「枠がわずかに左上へ動き、右下にオフセットした実線の影が付く」だけのシンプルな効果に変更。`button:active`では位置を元に戻し影を消して押下感を出す。§4.4で追加した`::before`グラデーション層と`@keyframes btn-sheen`は完全に撤去。
- **`#game-start-overlay`（3・2・1・GOカウントダウン）は白背景+緑文字のシンプルな表示に**: §4.4で導入した動くグラデーションのフルスクリーンフラッシュは熊谷さんの意図と異なっていたため撤去し、`background: var(--panel)`（白）、`color: var(--primary)`（緑太字）、`text-shadow: none`というシンプルな構成に戻した。黒でもパステルでも派手な演出でもない、素直な白地+緑文字。
- **送信モード/お遊びモードのお題文字「今どれを打つべきか分かりにくい」**: `#tx-target-text`の`.tx-char-done`（打ち終えた文字）・`.tx-char-current`（今打つべき文字）・`.tx-char-next`（これから打つ文字）の3状態が、黒系の太い文字と緑系の文字が両方くっきり見えてしまい、どれが「今」なのか一目で分かりにくい状態になっていた。これを是正し、**「今打つべき文字」だけを`var(--primary)`・不透明度1でくっきり目立たせ、それ以外（打ち終えた文字・まだ先の文字）は不透明度を大きく下げて薄くする**メリハリ重視の配色に変更した（`.tx-char-done`: `var(--success)` opacity 0.3、`.tx-char-current`: `var(--primary)` opacity 1、`.tx-char-next`: `var(--text-secondary)` opacity 0.4）。対象は`tx.html`/`tx-en.html`/`asobi.html`/`asobi-en.html`の4ファイル。

### 4.6 ボタンホバーを「枠が少し濃くなるだけ」のシンプルな仕様に統一 (2026-11 第6弾)

§4.4〜§4.5で何度か調整したボタンホバー演出について、熊谷さんより最終的に「カーソルを乗せた時に緑で塗りつぶされるのをすべてのボタンでやめてほしい。理想は枠だけ濃くなる程度」という明確な指示があり、サイト上の主要ボタンから色塗り・移動・影などの演出を一切廃止し、**枠線の色がわずかに濃くなるだけ**のミニマルなホバーに統一した。

- 対象: `rx.html`/`rx-en.html`、`tx.html`/`tx-en.html`、`asobi.html`/`asobi-en.html`の共通`button`/`button:hover`（従来は`background: var(--primary); color: #fff;`の塗りつぶし）、`index.html`/`index-en.html`の`button`/`button:hover`（§4.4のグラデーション→§4.5の「枠が動く」演出を経て、今回さらに単純化）、`index.html`/`index-en.html`の`.home-link-btn:hover`（背景タイントの深色化+box-shadowを撤去）、`404.html`の`a`/`a:hover`（同じく塗りつぶしを撤去）。
- 新しい`button:hover`は `border-color: #005c32;`（`var(--primary)`より一段濃いグリーン）のみを変更する1行ルールに統一。`transform`や`box-shadow`、背景色の変化は行わない。`index.html`の`button:active`ルール（枠が動く演出の押下復帰用）も不要になったため削除。
- `ranking.html`系の`.mode-tab`/`.page-btn`は元々「枠線・文字色のみ変化」で塗りつぶしを伴わない実装だったため、変更不要（今回のポリシーに既に合致していた）。

### 4.7 お遊びモード・非初心者モードのゲーム仕様変更 (2026-11)

熊谷さんより、お遊びモードの「普通」「正確重視」モード（いずれも非初心者モード限定）について、以下2点の仕様変更依頼があった。対象は`asobi.js`のみ（`tx.js`にはこのgameVariant/ACCURACY/ONESHOTの概念自体が存在しないため対象外）。

1. **単語ごとの制限時間切れ(QSB)で即ゲーム終了**: 従来は「一発勝負」モードのみ、単語の制限時間内に打ち終えられないとその場でゲーム終了（`oneShotEliminated`）し、「普通」「正確重視」モードは単に次の単語へスキップしていた。これを、**3モードいずれも制限時間切れの時点で即ゲーム終了**するよう統一した（`handleWordTimeout()`内、`nextTxWord()`を呼ぶ代わりに常に`endGame()`を呼ぶように変更）。なお初心者モードでは単語ごとの制限時間の仕組み自体が元々存在しない（`startWordTimer()`が`beginnerMode`時はタイマーを起動せず早期returnする）ため、この変更は自動的に非初心者モードにのみ適用される。
2. **正確重視モードのミス・リスタート時、その単語で稼いだ得点も巻き戻す**: 従来は、ミスして単語の最初に打ち直しになっても（`txCharIndex = 0`）、それまでにその単語で正しく打てた文字分の得点(`score`)はリセットされず、打ち直し後にさらに加算されるため得点が水増しされていた（例: 合計70点の状態で「BLOOM」のBLOOまで打って74点になった後Mでミス→やり直し→再度BLOOMを最後まで打つと74+5=79点になってしまっていた）。これを修正し、各単語に入った時点のscoreを`wordStartScore`という変数に記録しておき、正確重視モードでミスした際は`score = wordStartScore`で単語に入る前の得点まで巻き戻すようにした（70点からやり直し）。**この得点巻き戻しは非初心者モード限定**とし、`if (!beginnerMode) { score = wordStartScore; ... }`で明示的にガードしている（初心者モードの挙動は一切変更しないという依頼のため）。
3. 上記のため、`nextTxWord()`の冒頭で毎回`wordStartScore = score;`を記録するようにした（ゲーム開始時の最初の単語でも、`startGame()`で`score = 0`にリセットされた直後に`nextTxWord()`が呼ばれるため、自動的に0で初期化される）。

### 4.8 お題文字のゆっくり点滅グローと「SIGNAL」バーの明度改善 (2026-11)

熊谷さんより2点の追加要望があった。

1. **「今打つべき文字」をもっとわかりやすく**: §4.5で`.tx-char-current`を単色の濃い緑(`var(--primary)`、opacity 1)にしたが、「色を濃くするだけでなく、文字の枠が若干光るような、ゆっくり明暗する点滅アニメーションが欲しい（きらきらしすぎなくていい）」との要望を受け、`tx.html`/`tx-en.html`/`asobi.html`/`asobi-en.html`の`#tx-target-text .tx-char-current`に`text-shadow`を使った**1.8秒周期でゆっくり明滅するグローアニメーション**(`@keyframes tx-char-glow`)を追加した。文字色自体は引き続き`var(--primary)`のまま変更せず、影の強さだけが`rgba(0,208,106,0.35)`〜`rgba(0,208,106,0.85)`の間を往復する、派手すぎない呼吸するような光り方にした。
2. **お遊びモードの単語ごと制限時間バー「SIGNAL」が暗すぎる**: 原因は`#word-timer-bar-wrap`自体ではなく、それを包む外枠`#word-timer-track`の背景が`rgba(0,20,10,0.5)`という黒に近い半透明のままだったこと（§4.4のダークゾーン一掃の際に見落としていた）。`asobi.html`/`asobi-en.html`の`#word-timer-track`背景を`var(--bg)`（グレー地）に変更し、`#word-timer-label`（📡 SIGNALの文字）も`var(--primary-dim)`・opacity 0.9から`var(--primary)`・opacity 1に変更して視認性を上げた。あわせて`#word-timer-bar-wrap`自体の地色も`#ededed`→`#f2f2f2`、目盛りの不透明度も0.18→0.22に微調整し、全体的に明るくクリアな見た目にした。

### 4.9 リザルト画面への「正確率」表示 + ミス文字チップの明度改善 (2026-11 第7弾)

熊谷さんより2点の追加要望があった。

1. **送信モード・お遊びモードの全モードでリザルト画面に正確率を表示**: 「(打ち終わった文字数/ノーミスで打てた文字数)を計算して正確率を出してほしい」との要望。文字どおりの比だと1以上になり得て「率」として読めないため、一般的な正解率の定義（ノーミス入力数 ÷ 総打鍵数 × 100）で実装した。`tx.js`はゲームバリアント機構を持たず`score`が常に加算オンリー（巻き戻りなし）なので、そのまま`score`を正解数として使用。一方`asobi.js`は§4.7で正確重視モードの得点巻き戻し(`score = wordStartScore`)を実装済みのため、`score`は正解率の分子としては使えない。そこで巻き戻りの影響を受けない新しいカウンタ`totalCorrectKeys`を追加し、`evaluateTxChar()`の正解分岐で`score++`と並べて`totalCorrectKeys++`し、ゲーム開始時(`startGame()`)にのみ0へリセットする設計にした。分母は`totalCorrectKeys + (txMistakeCounts / asobiMistakeCountsの合計値)`。`tx.html`/`asobi.html`の`#final-result-text`直下に`<p id="accuracy-result-text">`を新設し、`endGame()`内で「正確率: 94.9% (93/98打鍵)」のような文言を算出・表示する（`I18N.accuracyRate`としてja/en両対応、小数点1桁）。1打も打っていない場合（総打鍵数0）は非表示にして0除算の見栄えを回避。
2. **「ミスが多かった文字」チップの背景が暗すぎる**: `renderMistakeBreakdown()`内のインラインスタイルが`background:rgba(0,0,0,0.35)`という黒系のままだったことが原因（§4.4のダークゾーン一掃で見落としていたJS側の暗い背景の一つ）。`tx.js`/`asobi.js`双方で`rgba(192,57,43,0.12)`という`var(--error)`系の薄い赤系タイントに変更し、件数テキストの色も`var(--primary-dim)`から`var(--text-secondary)`に変更して全体の明るさ・視認性を改善した。

## 5. ゲーム仕様の要点

- **モード**: 受信 (rx) / 送信 (tx)
- **制限時間**: 1分・3分・5分 から選択
- **ビギナーモード**: あり (`is_beginner` フラグで API に送信)
- **ニックネーム制約**: 半角英大文字 (A-Z) と **半角数字 (0-9)** のみ許可。最近の改修で数字を許可するようになった (commit `1da72ce`)。`noname` はデフォルト値。
- **プロサイン**: SOS など一部はプロサインとして 1 文字扱い (commit `d3672a2`)
- **TX のキー入力**: キーボード + 画面上のパドルボタン (タッチ対応)。Iambic キーヤー実装あり。

## 6. 開発ワークフロー

1. 熊谷さんが Cowork に改良点を依頼
2. **Cowork が `morseda\` 内のファイルを編集 → コミット作成 → index 更新** まで実行
   - コミット作成者は `yuma <noayoda314@gmail.com>` で固定 (これまでの履歴と一致)
   - コミットメッセージは日本語可。過去履歴の様式に合わせる:
     - `領域: 変更内容` 形式 (例: `rx/tx: QUIT後にスコアをリセットするよう修正`, `ファビコン: 背景を丸角に変更`)
3. **熊谷さんが GitHub Desktop を開き、「Push origin」を押すだけ** で本番反映完了
   - Cowork は push しない (認証情報の関係でも、レビュー機会を残すためでも)
   - 熊谷さんの理想は「Push ボタン 1回だけ」 — Cowork はそれを実現するように index まで整えること

### 6.1. ⚠ Cowork 側のコミット手順 (重要・必読)

このリポジトリは Windows 上のフォルダを Linux サンドボックスにマウントしたものを編集しているため、**サンドボックスから `.git/` 内のファイルを削除できない** 制約がある (Operation not permitted)。`git commit` などの通常コマンドは内部で `.git/index.lock` を作成→削除する流れになっているが、この削除が失敗するため、孤立したロックが残り、以降の git 操作が全てブロックされる。

そこで **「ロックを生成しない low-level な手順」+「`.git/index` の上書き更新」** で対応する。これは検証済み・動作確認済みの手順:

```bash
cd "/sessions/.../mnt/モールス打/morseda"

# 1) 編集したファイルをオブジェクトとして書き込む (lock 不要)
NEW_BLOB=$(git hash-object -w PATH/TO/EDITED_FILE)

# 2) 既存ツリーから当該ファイルを差し替えた新ツリーを生成 (lock 不要)
CURRENT_TREE=$(git rev-parse HEAD^{tree})
{
  git ls-tree $CURRENT_TREE | grep -v $'\tPATH/TO/EDITED_FILE$'
  printf "100644 blob %s\tPATH/TO/EDITED_FILE\n" "$NEW_BLOB"
} | sort -k4 > /tmp/tree-entries.txt
NEW_TREE=$(git mktree < /tmp/tree-entries.txt)

# 3) 作者情報を固定してコミットオブジェクト作成 (lock 不要)
export GIT_AUTHOR_NAME="yuma" GIT_AUTHOR_EMAIL="noayoda314@gmail.com"
export GIT_COMMITTER_NAME="yuma" GIT_COMMITTER_EMAIL="noayoda314@gmail.com"
HEAD_COMMIT=$(git rev-parse HEAD)
NEW_COMMIT=$(echo "コミットメッセージ" | git commit-tree "$NEW_TREE" -p "$HEAD_COMMIT")

# 4) main ref を直接書き換え (lock 不要・ファイル上書き)
printf "%s\n" "$NEW_COMMIT" > .git/refs/heads/main

# 5) index を正しい状態に再生成して「上書き」する (削除はできないが上書きはできる)
#    これをやらないと GitHub Desktop で「変更あり」と誤表示され、熊谷さんが Push ボタン
#    1回で済まなくなる。必ず実行する。
GIT_INDEX_FILE=/tmp/clean_index git read-tree HEAD
cat /tmp/clean_index > .git/index
rm -f /tmp/clean_index

# 6) 確認
git status   # → "nothing to commit, working tree clean" + "ahead of origin/main by N commits"
git log --oneline -3
```

**複数ファイルを同時に変更する場合**: 手順 2 の tree 構築で、変更した全ファイルについて同じように `grep -v` で除外+新エントリ追加を繰り返してから `mktree` する。

**新規ファイル追加の場合**: 手順 2 の `grep -v` は不要 (既存ツリーから何も除外しない)。新エントリだけ追加して sort→mktree。

**ファイル削除の場合**: 手順 2 で `grep -v` だけして当該エントリを落とし、新エントリは追加しない。

⚠ 通常の `git add` / `git commit` は **絶対に使わない**。一度実行すると孤立した `.git/index.lock` が残ってしまい、熊谷さんに手動削除をお願いすることになる。

## 7. 編集時の注意点

- 1ファイル完結方針を崩さない (CSS/JS を別ファイルに切り出さない)
- 既存のデザイントークン (`--primary` 等) を使う。色を直書きしない
- フッターを変更する場合は **全ページ一括** で揃える (リンク追加・順序変更など)
- API のエンドポイント仕様を変える必要が出たら、必ず熊谷さんに API 側の改修要否を確認する
- `index.html` のスペクトラムスコープアニメーションは canvas で重めの描画をしているので、改修時はパフォーマンス劣化に注意

## 8. やりたいことアイデア (将来の参考、未着手)

(空欄。熊谷さんから要望が出たらここに追記していくと、次回の Cowork に引き継げる。)

## 9. 英語モード（多言語対応）

2026-09 に実装完了。**ルート直下は日本語版のまま維持し、各ページの英語版を `xxxx-en.html` という名前で同じディレクトリに並べて配置する**方式（`/en/` のようなサブフォルダは使わない）。ゲーム内容・練習素材（コールサイン、単語リスト等）は一切変更せず、UI表示テキストのみ英訳している。

### 9.1 命名規則

| 日本語版 | 英語版 |
|---|---|
| `index.html`（トップ） | `index-en.html` |
| `tx.html` | `tx-en.html` |
| `rx.html` | `rx-en.html` |
| `asobi.html` | `asobi-en.html` |
| `ranking.html` | `ranking-en.html` |
| `profile.html` | `profile-en.html` |
| `contact.html` | `contact-en.html` |
| `how-to-use.html` | `how-to-use-en.html` |
| `morse-table.html` | `morse-table-en.html` |
| `privacy.html` | `privacy-en.html` |

過去に一度「`/en/xxxx.html` というサブフォルダ方式」で実装しかけたが、GitHub Desktopでのcommit時にエラーが発生し、熊谷さんの判断で一旦全て破棄（discard）。その後改めて「`xxxx-en.html` を同じ階層に並べる」方式で熊谷さんから正式に依頼があり、これが現在の実装。**サブフォルダ方式に戻すことは想定していない**。

### 9.2 言語切り替えUI

- **ホーム画面 (`index.html` / `index-en.html`)**: 画面右上に `<select>` のプルダウン（`#lang-select`）を設置。「🌐 日本語」「🌐 English」の2択で、`onchange` で該当ページへ即座に遷移する（`English` 選択 → `index-en.html` へ、`日本語` 選択 → `/` へ）。
- **それ以外の全ページ**: 画面右上に固定の🌐ボタン（`#lang-switch-btn`）を1つ設置。ja側は「🌐 EN」で対応する `xxxx-en.html` へ、en側は「🌐 JA」で対応する `xxxx.html` へリンクする、単純な相互リンク方式（ドロップダウンではない）。ホーム画面だけプルダウンにしているのは、熊谷さんからの明示的な要望のため。
- 全ページに `<link rel="alternate" hreflang="ja|en|x-default">` を canonical の直後に追加済み（SEO対策）。
- 言語設定は `lang-guard.js` によって `localStorage` に永続化される。詳細は 9.7 を参照。

### 9.3 JS外部化とi18n辞書

- `tx.html`・`rx.html`・`asobi.html`・`index.html` は元々複雑な埋め込み `<script>` を持っていたため、これらのみ例外的に `tx.js` / `rx.js` / `asobi.js` / `index.js` として外部化し、ja/en 両方の HTML から `<script src="/tx.js"></script>` のように読み込む形にしている（1ファイル完結の原則の唯一の例外。これ以上例外を増やさないこと）。
- `tx.js` / `rx.js` / `asobi.js` の内部で、JSが動的生成するテキスト（設定ボタンのラベル、リザルト画面の文言、ランキング登録の可否メッセージなど）は下記パターンの i18n 辞書で切り替える:
  ```js
  const LANG = (document.documentElement.lang === 'en') ? 'en' : 'ja';
  const I18N = {
      someKey: { ja: '日本語テキスト', en: 'English text' },
      withArgs: (n) => ({ ja: `${n}件`, en: `${n} items` }),
  };
  function t(key, ...args) {
      const entry = I18N[key];
      const resolved = (typeof entry === 'function') ? entry(...args) : entry;
      return resolved[LANG];
  }
  ```
- `index.js` は画面上に動的にテキストを生成する処理が無い（スペクトラムスコープのcanvas描画とキーボードショートカットのみ）ため、i18n辞書は無し。ja/enで完全に同一のファイルを共有しているが、キーボードショートカット（T/R/G）の遷移先だけは `document.documentElement.lang` を見て ja/en を出し分けている（2026-09、英語モードで押しても日本語ページに飛んでしまうバグを修正）。
- `ranking.html`・`profile.html`・`contact.html`・`how-to-use.html`・`morse-table.html`・`privacy.html` は複雑なゲームロジックを持たないため、外部化はせず、ja/enそれぞれのHTMLファイルにスクリプトをそのまま複製している（`ranking.html`/`ranking-en.html`のJS生成文字列は各ファイル内で直接英訳）。

### 9.4 ミス分析機能との関係

`tx.html`・`asobi.html` には「ミスが多かった文字」を表示するミス分析機能が2026-09以前から実装済み（`txMistakeCounts`/`asobiMistakeCounts`、`renderMistakeBreakdown()`）。英語版でもこの機能はそのまま動作し、表示ラベルの静的HTML部分（`▸ ミスが多かった文字 ◂` → `▸ Frequently Missed Characters ◂`）のみ翻訳している。`rx.html`（受信モード）にはこの機能は未実装（2026-09時点）。

### 9.5 sitemap.xml

`xhtml:link rel="alternate" hreflang`形式で、全10ページ×ja/en（計20URL）を相互参照する形で記載済み。

### 9.6 今後の注意点

- 新しくページを追加する場合も、この命名規則（`xxxx-en.html` を同階層に配置）を踏襲すること。
- フッター・ハンバーガーメニューのリンクを変更する場合は、ja版・en版・`common系ヘルパー`（Cowork側の作業用スクリプト、リポジトリには含まれない）の3箇所を揃える必要がある。
- ja版ページを編集した際、対応するen版ページの翻訳内容が古くならないよう注意する（本文内容を変更したら英語版にも同じ変更を反映する）。
- 新しくページ内リンクやリダイレクトを追加する場合、ja/en判定は常に `document.documentElement.lang`（または `<html lang>` を見て決める `LANG`/`lang` 変数）を使うこと。ページ名を決め打ちで `xxxx.html` と書いてしまうと、英語モードから踏んだ時にだけ日本語へ戻ってしまうバグになる（2026-09、`index.js` のキーボードショートカットで実際に発生）。

### 9.7 言語設定の永続化（`lang-guard.js`）

- 2026-09追加。全20ページの `<head>` の一番先頭（`<head>` 直後）で `<script src="/lang-guard.js"></script>` を読み込んでいる（最速で実行し、言語ミスマッチ時の一瞬の表示揺れを最小化するため）。
- 動作: `localStorage`（キー: `morseda_lang`、値: `'ja'` or `'en'`）に保存された言語設定と、開いているページの実際の言語（`<html lang>`）を比較する。
  - 未設定（初回訪問）の場合: 何もせず、現在のページの言語をそのまま記憶する。
  - 一致している場合: 何もしない。
  - 食い違っている場合: 対応する言語のページへ `location.replace()` で即座にリダイレクトする（ファイル名は `xxxx.html` ⇔ `xxxx-en.html` の変換ルールで機械的に算出）。
- ホーム画面のプルダウン（`#lang-select`）・各ページの🌐トグルボタン（`#lang-switch-btn`）は、遷移前に `setMorsedaLangPref('ja'|'en')`（`lang-guard.js` が定義するグローバル関数）を呼んで `localStorage` を更新してから `location.href` で遷移する。これにより「ユーザーが明示的に切り替えた言語」と「保存された設定」が常に一致し、上記のリダイレクトと競合しない。
- 効果: 一度どちらかの言語に切り替えると、以降はブックマーク経由・検索エンジン経由・（万一）ページ内リンクの取りこぼしバグなどでどのページを踏んでも、明示的にプルダウン／🌐ボタンで切り替えるまで同じ言語のページに揃うようになる。
- `localStorage` が使えない環境（プライベートブラウズ等）では例外を握りつぶして何もしない（＝これまで通りページごとの言語表示のまま。壊れることはない）。
- 新しくページを追加する場合は、`<head>` の直後にこのスクリプトタグを追加し、🌐ボタン／プルダウンの遷移前に `setMorsedaLangPref()` を呼ぶことを忘れないこと。

## 10. Cowork の作業環境に関する注記（重要）

**2026-10-27 更新**: このPC（熊谷さんのWindows機）への**シェル直接アクセス（`device_bash`）が復旧し、使用可能になった**（2026-09時点に発生していた "no Plan9 drive shares mounted" エラーは解消）。これに伴い、熊谷さんと協議の上でワークフローを以下のように更新した。

### 10.1 現在のワークフロー（2026-10-27〜）

1. Cowork が `device_stage_files`/`device_commit_files`（ファイル転送）または `device_bash`（直接編集）でファイルの読み書きを行う。
2. **Cowork が commit まで実行する**。ただし通常の `git add`/`git commit` ではなく、**6.1章に記載の low-level 手順（`git commit-tree` 等）を使う**（理由は10.2参照）。
3. **push は熊谷さんが GitHub Desktop で「Push origin」を押して行う**。Coworkは push を一切行わない。これは技術的制約ではなく**意図的な方針**で、`device_bash` が復旧した現在も変更しない（本番 (jl1gix.com) への反映タイミングを熊谷さんが完全にコントロールできるようにするため）。

この方針は 2026-10-27 に熊谷さんへ直接確認した上で決定したもの（「commitだけClaudeが実行」を選択）。

### 10.2 なぜ `git add`/`git commit` を直接使わないか

`device_bash` の仕様上、**マウント済み接続フォルダ内でのファイル削除はデフォルトで禁止**されており、`rm`/`unlink` は `Operation not permitted` で失敗する。通常の `git commit` は内部で `.git/index.lock` を作成→削除する流れのため、この削除が失敗すると孤立したロックファイルが残留し、以降の `git` コマンドが軒並み `File exists` エラーでブロックされてしまう（6.1章に記載の過去のトラブルと同一の原因）。

`device_request_delete_permission` で都度削除権限をリクエストする方法もあるが、毎回熊谷さんに許可プロンプトが出てしまい「Push ボタン1回で完結」という理想から外れる。そのため**ロックを生成しない6.1章の low-level 手順を今後も使い続ける**方針とした。

---

## 11. ランキング日付フィルタ & WPM速度スライダー (2026-10)

2026-10 に実装。ランキングページへの「日付別ランキング」機能追加と、送信/受信/お遊びの3モードの「WPM設定画面」のプルダウン→スライダー化。

### 11.1 ランキングページの日付別表示（`ranking.html`/`ranking-en.html` + 新規ページ）

- **2026-10、実装方針を変更**（熊谷さんのフィードバックにより、同月内で仕様を2回変えている）。当初は `ranking.html` 内に「📅 日付」プルダウン（`#date-select`）を追加する実装だったが、「今日のランキングを**ブラウザのリロードボタンを押すだけ**で即確認したい」という要望に対し、プルダウン＋JS状態だとワンアクションで戻ってこないため、**独立した静的HTMLページ方式に全面変更**した。旧プルダウン実装（`fetchAllRows`/`ensureDateOptionsLoaded`/`resetDateSelect`/`switchDate`/`jstDateStr`/`currentDate`/`allRowsCache`/`#date-select`/`#date-view-note` 等）は `ranking.html`/`ranking-en.html` から**完全に削除**し、この2ファイルは日付フィルタ追加前の状態（モードタブ・時間タブ・サーバー側ページネーションのみ）に復元済み。
- 代わりに **`ranking-today.html`/`ranking-today-en.html`（今日のランキング）** と **`ranking-yesterday.html`/`ranking-yesterday-en.html`（昨日のランキング）** の4ファイルを新規追加。`ranking.html`/`ranking-en.html` のモードタブ下に導線リンク（`.ranking-nav-links`）を設置し、そこから各ページへ遷移できるようにした。
  - `ranking.html` → `ranking-today.html` / `ranking-yesterday.html`
  - `ranking-en.html` → `ranking-today-en.html` / `ranking-yesterday-en.html`
  - 新規4ページ同士も相互リンク（今日ページには「🏆 全期間ランキング」「📅 昨日のランキング」、昨日ページには「🏆 全期間ランキング」「📅 今日のランキング」）。
- `ranking.html`（全期間表示）はこれまで通りサーバー側ページネーション（`GET /api/scores?mode=&minutes=&page=`）のみを使い、変更前と全く同じ挙動・負荷のまま。

### 11.1.1 `ranking-today.html`/`ranking-yesterday.html` の実装詳細

- バックエンドAPIには日付絞り込み用のクエリパラメータが存在しない（確認済み: `&date=2026-10-17` を付けても `total` が変化しない）ため、ページを開くたびに該当モード・時間の**全ページをクライアント側で取得**（`fetchAllRows()`：1ページ目で `total` を見て残りページを `Promise.all` で並列取得）し、JST日付（`jstDateStr()`：`created_at` に9時間加算してUTCのまま年/月/日を取り出す）で `targetDateStr()`（今日ページは `DAY_OFFSET=0`、昨日ページは `DAY_OFFSET=-1` のみが差分）と一致する行だけに絞り込んで表示する。
- 元のAPIレスポンスはスコア降順で返ってくるため、絞り込み後も相対順序はそのまま保持され、再ソートは不要。表示上の「RANK」は**元の全期間内での順位ではなく、その日のデータだけの中での順位**（絞り込み後の配列内でのインデックス+1）として算出している（「今日のランキング」という名前に合わせた意図的な仕様）。
- ページネーションはクライアント側の `filteredRows` 配列を100件ずつスライスするだけ（`renderPage(page)`）。モード/時間タブ切り替え（`switchMode`/`switchMinutes`）時のみ `loadRanking()` を呼んで再取得し、ページ送り（`changePage()`）では再取得しない。
- ページ上部に `📅 YYYY/MM/DD (JST)` の日付バッジ（`#date-label`）を表示し、実際に絞り込み対象になっている日付をユーザーが確認できるようにしている。
- **「ブラウザのリロードボタンだけで最新化」という要件の満たし方**: これらのページは完全にステートレスな静的HTMLで、`localStorage` 等に何も保存しない。ページを開く＝ `loadRanking()` が走り、その時点のサーバーデータを全件取得して現在時刻基準でJST日付フィルタをかけ直すため、ブラウザの通常のリロード操作（F5等）だけで常に最新のその日のデータが再構築される。
- ja/en で実装ロジックは完全に同一（この4ファイルも外部化せずそれぞれ複製する既存方針のまま）。UI文言のみ翻訳。
- Playwrightで `route.fulfill()` によるAPIモック（今日/昨日/2日前に分散した150件のダミーデータ）を用いて、(a) JST日付フィルタが正しい件数に絞り込まれること、(b) 100件超のフィルタ結果が正しく2ページに分割され、ページ送りでは再フェッチが発生しないこと、(c) フィルタ結果0件時に適切な空表示になりクラッシュしないこと、(d) モード/時間タブ切り替えで再取得・再フィルタが走ること、の4パターンを検証済み（全てPASS）。

### 11.2 WPM速度スライダー（`tx.html`/`tx-en.html`、`rx.html`/`rx-en.html`、`asobi.html`/`asobi-en.html`）

- 従来の `<select id="wpm-select">`（10, 15, 20〜30の13択プルダウン）を、`<input type="range" id="wpm-select" min="10" max="30" step="1">` のネイティブスライダーに置き換え。TX/ASOBIの「フリー入力モード」内 `#free-wpm-select` も同様に置き換え。
- **既存JSへの影響は最小限**: `id="wpm-select"`/`id="free-wpm-select"` と `.value` プロパティ（数値文字列）はそのまま維持しているため、`tx.js`/`rx.js`/`asobi.js` 側の `parseInt(document.getElementById('wpm-select').value)` 等の読み取りロジックは**無改修でそのまま動作**する。`onchange="changeFreeWpm()"`（tx/asobi）、`onchange="onWpmSelectChange()"`（rx）も既存のまま維持。
- range は 10〜30 の整数で連続的にドラッグ可能（ネイティブ `<input type="range">` のため、マウスドラッグ・タッチのスワイプ・キーボード矢印キーいずれにも標準対応。カスタムのドラッグ実装は不要だった）。これにより `how-to-use.html` の既存記述「10 WPM から 30 WPM まで 1 WPM 刻みで選択」が実態と一致するようになった（旧プルダウンは11-14/16-19が歯抜けだったため、この記述は厳密には不正確だった）。
- 各スライダーの上に現在値と習熟度帯タグを表示する `.wpm-readout`（例: 「**25** WPM `上級者向け`」）、下に `初心者/中級者/上級者` の帯ラベルを表示。帯の境界は `wpmBandKey(wpm)`（各JSファイルに追加）で `wpm <= 16` → 初心者、`wpm <= 23` → 中級者、それ以外 → 上級者、の3段階（WPM値そのものは1刻みのまま、表示ラベルだけを粗く3段階にグルーピングする方針。熊谷さんの要望通り）。
- `updateWpmReadout(selId, valId, bandId)`（各JSファイルに追加）が `oninput`（ドラッグ中のライブ更新用、HTML側に直接 `oninput="updateWpmReadout(...)"` を付与）とページ読み込み時・フリーモード同期時に呼ばれ、読み取り値ラベルと帯タグを更新する。帯タグの文言はi18n対応済み（`wpmBand_beginner`/`wpmBand_intermediate`/`wpmBand_advanced` を各JSのI18N辞書に追加）。
- スライダーの背景は3色グラデーション（緑/黄/赤）で習熟度帯を視覚的にも示している。CSS変数は新規クラス（`.wpm-range`, `.wpm-readout`, `.wpm-band-tag`, `.wpm-band-labels`）としてja/en各ファイルの `<style>` に複製（1ファイル完結方針を維持）。
- `rx.html` の `#audio-check-item`（Audio Checkのモバイルオーバーラップ修正、2026-09対応）には影響なし。今回のCSS追加は別セクションに挿入しており、既存の `!important` オーバーライドは無改修。

### 11.3 初心者帯(WPM)での文字区切り猶予の延長（`tx.js`/`asobi.js`、TX/ASOBIモードのみ）

- 2026-10、WPMスライダー化の直後に追加。初心者帯（WPM≤16）でプレイする際、符号入力の反応が遅れがちで、従来の `TX_CHAR_GAP`（符号入力停止から「その文字は確定」と判定するまでの猶予時間）のままだと文字の途中で区切られてしまい、一文字も正しく打てなくなる問題への対処（熊谷さんからのフィードバック）。
- `computeCharGap(dotTime, isTouch, wpmVal)`（`tx.js`/`asobi.js` に追加）で、`wpmBandKey(wpmVal) === 'beginner'` の場合のみ乗数を通常の1.3倍（`BEGINNER_CHAR_GAP_BOOST = 1.3`）にして `TX_CHAR_GAP` を算出する。中級者以上（WPM≥17）は従来通りの乗数（デスクトップ×2.0 / タッチ×5.0）のまま変更なし。RXモード（`rx.js`）はこの仕組みを使っていないため対象外（受信モードは自分でパドル入力するモードではないため、ユーザーからも変更対象外と明示されている）。
- **実装上の注意（ハマった点）**: `startTxGame()`（ゲーム開始ボタン押下後、約1秒の準備演出を経てから呼ばれる関数）内の `TX_CHAR_GAP` 算出箇所で、当初誤って `unlockAndPrepare()` 内のローカル変数 `wpmVal` をそのまま参照してしまい、`startTxGame()` が実際に発火した瞬間に `ReferenceError: wpmVal is not defined` が発生する実行時バグを作り込んでしまった（`unlockAndPrepare()` と `startTxGame()` は別々のトップレベル関数で、`wpmVal` のスコープは前者にしか及ばない）。Playwrightで `unlockAndPrepare()` 呼び出し直後だけ検証した際は約1秒の遅延実行前のためエラーが表面化せず見逃しかけたが、**遅延分（1.5秒程度）待ってから検証し直すことで発覚・修正**した。修正後は、どの関数からでも常に正しく参照できるグローバル変数 `TX_DOT_TIME` から `Math.round(1.2 / TX_DOT_TIME)` で現在のWPMを逆算する方式にして、スコープ問題を根本的に回避している。今後 `startTxGame()`/`unlockAndPrepare()` 周りを触る際は、両者が別関数である点と、ゲーム開始に約1秒の遅延演出があるため**即時検証だけでは見逃すバグがある**点に注意。
- `device_commit_files` の運用上の注意（今回ハマった点）: 同一セッション内で**同じ `stagedPath`（例: `/mnt/user-data/outputs/morseda/tx.js`）を使い回して2回目のコミットを行うと、ファイルを上書きしてから送っても古い内容のまま書き込まれてしまう**現象を確認した（ツール自体は `written` で成功を返すが、実機に反映されるのは古い内容）。2回目以降の書き込みでは、`stagedPath` を新しい未使用のパス（例: 別ディレクトリ `morseda_v2/`）にすることで正しく最新内容が書き込まれることを確認済み。同一ファイルを同一セッション内で複数回 `device_commit_files` する場合は、毎回 **未使用の `stagedPath`** を使うこと。

### 11.4 Iambicキーヤーの「素早いタップでキーが無効になる」不具合修正（`tx.js`/`asobi.js`、TX/ASOBIモードのみ）

- 2026-10、熊谷さんから「Nなど（－・）でJ（長点）を押した直後にスペース（短点）を素早く押しても、スペースキーが無効になる」という報告。初心者・非初心者に関係なく発生するため、両方に対して修正するよう明示的に要望された。
- **原因**: Iambicキーヤー (`keyerStep()`) は `setTimeout` で自己再スケジュールする構造で、再度発火したタイミングでその時点の `dotHeld`/`dashHeld`（物理的にキーが押されているかどうかの生の状態）だけを見て次に送出する符号を決めていた。パドルを「押し続ける」想定の実装だったため、素早くタップ（押してすぐ離す）するとキーダウン→キーアップが完了してしまい、次の `keyerStep()` 発火時には既に離されている状態になり、そのタップの符号が送出されずに消えてしまっていた。
- **修正**: `dotLatched`/`dashLatched` という「ラッチ」変数を追加。`paddleDown()`/`onTxKeyDown()` でキーが押された瞬間に対応するラッチを立て、`keyerStep()` は `dotHeld || dotLatched`（`dashHeld || dashLatched`）で「送信すべき符号があるか」を判定するように変更。そのタップ分の符号を実際に送出した時点で、消費した側のラッチだけを `false` に戻す（もう一方はまだ未処理の可能性があるため残す）。これにより、物理的なキー状態がどうなっていても「押した」という事実が次の `keyerStep()` 発火まで確実に保持され、符号が消えなくなった。
- `startTxGame()`/`cleanupTx()`/`launchFreeMode()`/`resetFreeMode()`/`quitFreeMode()` 等、既存の `dotHeld = false; dashHeld = false;` リセット箇所は全て `dotLatched = false; dashLatched = false;` も併せてリセットするように修正済み（ゲーム終了/再開時にラッチが残留してゴースト入力が起きないようにするため）。
- `tx.js`・`asobi.js`の両方に同一のロジックを適用済み。RXモード（`rx.js`）はIambicキーヤーを持たないため対象外。
- **検証方法**: Playwrightで「J押下→即リリース→Space押下→即リリース」というタップシーケンスを `keyboard.down/up` で再現し、`decodeTxChar`/`decodeFreeChar` に渡される最終的なモールス文字列が `"-."`（N）になることを確認。さらに、修正前のコード（ラッチなし版）を別ポートで同時に動かし、同じテストで実際に `"-"` のみ（短点が消える）になることを確認した上で、修正後のコードでは再現しないことを突き合わせて検証（意図的な「修正前に戻して再現させる」コントロールテスト）。

## 12. お遊びモードの再設計: 単語種別×プレイスタイルの2軸6モード制 (2026-10 第2弾)

> **本章は旧12章（CQ交信シミュレーター/有名モールス符号/ガチモードのサブモード・モード選択画面・難易度バッジ）を完全に置き換える。** 熊谷さんより「お遊びモードのゲームモードは一番最初の『単語早押しのみ』に戻す」という方針変更があり、CQシミュレーター・有名モールス符号モードは**削除**、ガチモードは**プレイスタイルの一種として再構成**した。

- **新しいゲーム設計**: 単語早打ちエンジン（キーヤー・パドル・スコープ描画等、既存のまま）に対して、独立した2つの軸を導入し、計 2×3 = 6通りの組み合わせで遊べるようにした。
  - **単語種別 `wordCategory`**: `GENERAL`（身近な単語、既存の単語リスト。2026-10第3弾でタブ名を「一般単語」から「身近な単語」に変更し、`SOS`を追加） / `CALLSIGN`（コールサイン+コンテストナンバー。送信モード`tx.js`の`generateCallsign()`/`generateRST()`をそのまま移植し、1語ごとに「コールサイン→RSTレポート」を交互に出題する`nextAsobiCallType`で管理）
  - **プレイスタイル `gameVariant`**（寿司打を参考に設計）: `NORMAL`（普通、従来通りの挙動） / `ACCURACY`（正確重視、誤入力でその単語の入力を最初からやり直し＝`txCharIndex`を0にリセット） / `ONESHOT`（一発勝負、一度でも誤入力した時点で即`endGame()`。旧ガチモードの「3回連続ミス」をさらに厳格化したもの）
- **ロビー画面の構造**: 旧モード選択画面（`#mode-select-screen`、4枚のカード）は廃止し、`asobi.html`を開くと即座に設定画面（`#start-screen`）が表示される1画面構成に戻した。設定画面の冒頭に単語種別タブ（`#wc-tabs`: `#wc-general`/`#wc-callsign`）とプレイスタイルタブ（`#variant-tabs`: `#var-normal`/`#var-accuracy`/`#var-oneshot`）を新設し、`ranking.html`の`.mode-tabs`/`.mode-tab`と同じ見た目のタブボタンで切替（`selectWordCategory(cat)`/`selectGameVariant(variant)`）。`applySelectorVisibility()`が選択状態に応じて、ONESHOT選択時は初心者モードのチェックボックスを隠して強制OFFにし、ランキングリンクの行き先を更新する。
- **削除した旧機能**: CQ交信シミュレーター（`CQ_SCRIPT`、`startCqStep`/`loadCqWord`/`onCqWordComplete`/`renderCqOtherStep`/`cqContinue`等）、有名モールス符号モード（`FAMOUS_CODES`、`startFamousStep`/`loadFamousWord`/`onFamousWordComplete`/`showFamousTrivia`/`famousContinue`等）、モード選択画面一式（`#mode-select-screen`、`selectAsobiMode()`、`backToModeSelect()`/`backToModeSelectFromResult()`）、結果画面の`#experience-result`（体験完了メッセージ）と「◀ 他のモードを見る」ボタンを、HTML/JS/CSSから全て削除した。`contentPaused`フラグ（相手局応答表示中の打鍵ガード）も不要になったため削除。
- **プレイ中のステータス表示**: 旧`#hardcore-streak`（連続ミスカウンタ）を`#variant-status`に改名・再設計。ACCURACY選択時のみ「やり直し n回」を表示（`updateVariantStatusUI()`、`accuracyResetCount`）。`#game-container`の強調演出クラスも`.hardcore-active`→`.oneshot-active`に改名し、ONESHOT選択時のみ枠を赤いグロー演出にする。
- **QSB単語タイマーの猶予倍率**: `getWordTimeLimitMs()`内で、ONESHOT選択時のみ通常(3.5倍/初心者4.5倍)より切り詰めた2.4倍を適用（旧ガチモードの挙動を引き継ぐ）。
- **スコア登録（バックエンドmode値）**: 単語種別×プレイスタイルの組み合わせごとに異なる`mode`値を使う`ASOBI_MODE_TABLE`ルックアップを新設（`asobiBackendMode()`）。
  | 単語種別 | プレイスタイル | mode値 |
  |---|---|---|
  | GENERAL | NORMAL | `ASOBI`（既存。過去スコアとの継続性を維持） |
  | GENERAL | ACCURACY | `ASOBI_GEN_ACC`（新規） |
  | GENERAL | ONESHOT | `ASOBI_GEN_ONE`（新規） |
  | CALLSIGN | NORMAL | `ASOBI_CALL_NORM`（新規） |
  | CALLSIGN | ACCURACY | `ASOBI_CALL_ACC`（新規） |
  | CALLSIGN | ONESHOT | `ASOBI_CALL_ONE`（新規） |
  - **未確認の前提（要デプロイ後の確認）**: 上記5つの新規mode値をバックエンドAPIがそのまま受け付け、`GET /api/scores?mode=...`等で正しく独立集計されることを前提に実装しているが、このサンドボックス環境からは`api.jl1gix.com`に到達できず実機確認ができていない。デプロイ後に熊谷さんに各組み合わせでスコア登録→対応するランキングタブに反映されるか確認をお願いしたい。
  - 旧ガチモード用に導入した`'ASOBI_HARD'`というmode値は、本章の再設計で使われなくなった（孤立値）。バックエンド側に既にこの値のスコアが存在する場合は、別途取り扱いを相談したい。
- **お遊びモード専用ランキングページの再設計（`ranking-asobi.html`系6ファイル、`ranking-hardcore.html`系6ファイルは削除）**: 旧版は`const LOCKED_MODE`でサブモードごとに1つのmode値へ固定していたが、今回は単語種別タブ×プレイスタイルタブ×時間タブ（1分/3分/5分）の3段タブ構成に変更し、`ranking.html`自体が1ページでRX/TXタブを持つのと同じ考え方で、6通りの組み合わせを1つのページ群（全期間/今日/昨日×ja/en = 6ファイル）内で切替表示するようにした。各ページは`computeMode(wordcat, variant)`（`ASOBI_MODE_TABLE`と同じ対応表をJS側に複製）でmode値を算出し、`?wordcat=&variant=&time=`のURLパラメータで初期タブを指定可能（`asobi.js`の`asobiRankingBase()`が生成するリンクもこの形式）。今日/昨日版は従来通り「JST基準で全ページ取得してクライアント側でフィルタ」方式（`fetchAllRows`/`jstDateStr`/`targetDateStr`/`filteredRows`/`renderPage`）を流用。全期間↔今日↔昨日のナビリンクは、現在選択中のタブの組み合わせを保ったまま遷移できるよう`updateNavLinks()`でクエリ文字列を都度更新している。
- **各モード画面からのランキング導線**: `#start-screen`内の`#asobi-ranking-link`（🏆 このモードのランキングを見る）は、全組み合わせにスコアがあるため常時表示に変更（旧版はサブモードによって非表示にしていた）。リンク先は`asobiRankingBase()`で都度更新。
- **`ranking.html`/`ranking-en.html`、`ranking-today`/`ranking-yesterday`系**: 前回の再設計時点で既に「受信/送信のみ表示（お遊びモードタブなし）」になっており、本章の変更による影響はない。
- **`sitemap.xml`**: 旧`ranking-hardcore`系6エントリ（ja/en×全期間/今日/昨日）を削除。`ranking-asobi`系6エントリはURLがそのまま継続するため変更なし。

---

## 13. ランキングページのショートカット拡充 & フリー入力モードへの導線追加 (2026-11 第8弾)

### 13.1 ランキングページ内タブ切替ショートカット + ページ間相互ナビゲーション

熊谷さんより複数回にわたり要望があり、最終的に以下の構成になった。

- **Esc / `?`打鍵**: `ranking.html`系6ファイル・`ranking-asobi.html`系6ファイルの全12ファイルで、どのタブ状態でもEscキー（Morse Boardでは`?`打鍵）でトップ画面（`https://jl1gix.com` / `/index-en.html`）に戻る。
- **送受信ランキング（`ranking.html`系6ファイル）**: `1`/`3`/`5`→時間タブ切替(`switchMinutes()`)、`R`/`T`→受信/送信タブ切替(`switchMode()`)、`G`→お遊びモードの身近な単語タブへ移動、`C`→お遊びモードのコールサイン+コンテストナンバータブへ移動（いずれも`nav-asobi-link`のhrefに`?wordcat=`を付与して遷移、タブ保存は遷移先ページの初期化処理に委譲）。
- **お遊びモードランキング（`ranking-asobi.html`系6ファイル）**: `1`/`3`/`5`→時間タブ切替、`N`/`A`/`O`→プレイスタイルタブ切替(`switchVariant()`)、`G`/`C`→単語種別タブ切替(`switchWordCat()`)、`R`→受信モードタブを開いた状態で送受信ランキングへ、`T`→送信モードタブを開いた状態で送受信ランキングへ（`nav-rxtx-link`のhrefに`?mode=&time=`を付与）。
- いずれもMorse Board（対応する符号の打鍵）でも同一のキーイベントとして反応する。タブ移動時の`localStorage`保存は各`switchXxx()`関数が内部で行うため、ショートカット側で追加対応は不要だった。
- サイト内には一切UI文言を追加せず、`how-to-use.html`/`how-to-use-en.html`のショートカット表にのみ追記。

### 13.2 ショートカット表の統合ルール

表が長くなったため、「キーと打鍵する文字が一緒で動作も一緒ならまとめて1行に、キーと打鍵する文字が違うが動作が同じなら別々の行のまま」という統合ルールを熊谷さんの指定で適用（例: `T`キー + `T`打鍵（－）→ `T（Morse Board：－打鍵）`の1行に統合。一方Escと`?`打鍵はキー自体が異なり対応するモールス符号が無いため、統合せず別行のまま）。表冒頭の説明文も「Morse Board関連の操作は全て同一のキー入力として反応する」という言い過ぎた表現から、「多くの場合は対応するが一部は条件や挙動が異なるため各行を確認してほしい」という正確な表現に修正した。

### 13.3 「フリー入力モード」への導線追加（ホーム画面・ハンバーガーメニュー・フッター）

- **ホーム画面 (`index.html`/`index-en.html`)**: `.home-link-btn`の並びに「🏆 ランキング」「🔤 モールス符号表」の右（後）へ「📝 フリー入力モード」ボタンを追加。リンク先は`tx.html?free=1`（EN: `/tx-en.html?free=1`）。
- **`tx.js`**: ページ初期化処理(IIFE)に`URLSearchParams`で`free=1`を検出した場合に`startFreeMode()`を自動実行する処理を追加（既存のフリー入力モード機能自体は変更なし、入口を増やしただけ）。
- **ハンバーガーメニュー（全33ファイル共通）**: 「🔤 モールス符号表」行の直後（「学習コンテンツ」セクション内、「その他」セクションより前）に「📝 フリー入力モード」のリンクを追加。
- **フッター（404.htmlを除く全32ファイル）**: 「モールス符号表」フッターリンクの直後に同様のリンクを追加。
- これらはキーボードショートカットではなく通常のUIリンクのため、ショートカット表への追記は行っていない。

### 13.4 「M」キーでハンバーガーメニューを開閉するグローバルショートカット

- 「ゲームプレイ中以外のすべての画面で、Mキー（Morse Boardでは「－－」打鍵）を押すとハンバーガーメニューの開閉をトグルする」という要望。既存の「：」グローバルショートカット（トップ画面へ戻る）と全く同じ場所・同じガード条件で実装：`lang-guard.js`に新しい`keydown`リスナーを追加し、`isPlaying`（ゲームプレイ中）・`_capturingFor`（キーカスタマイズのキャプチャ中）・入力欄フォーカス中は無効化。`#menu-panel`/`#menu-overlay`の`classList.toggle('open')`を呼ぶだけで、既存の`#menu-btn`のonclick処理と全く同じ見た目になる。
- `lang-guard.js`を読み込まない`404.html`のみ、同内容を既存のインラインスクリプト（「：」ショートカットの直後）に追記して対応。
- 要望通り、タブ状態のような永続化は一切行わない（ページ遷移・再読込で毎回閉じた状態に戻る）。
- `how-to-use.html`/`how-to-use-en.html`のショートカット表に「全ページ共通（ゲームプレイ中を除く）」の行として追加（キーと打鍵する文字が同じ「M」で動作も1つのため、既存の統合ルールに従い1行にまとめた）。

### 13.5 フリー入力モードの単体ページ化（`free.html`/`free-en.html`新設）+ Fキーショートカット

熊谷さんより「トップページ・送信モード・お遊びモードのロビー画面でFキーを押すとフリー入力モードに移動するようにしたい。トップページからフリー入力モードに行く場合のみ、新設するfree.htmlに行くようにしてほしい」という要望があった。これに伴い、ホーム画面・ハンバーガーメニュー・フッターの「フリー入力モード」リンク（従来の`tx.html?free=1`）も全てこの新しいfree.htmlへ変更した。

- **`free.html`/`free-en.html`の実体**: `tx.html`/`tx-en.html`をそのまま複製し、`<head>`のtitle/meta/canonical/hreflangとサブタイトルのみ「フリー入力モード」向けに書き換えた単体ページ。DOM構造（`#start-screen`・`#game-screen`・`#free-screen`・`#result-screen`等）とスクリプト（`tx.js`をそのまま読み込み）は`tx.html`と完全に同一で、既存のフリー入力モードの実装（`startFreeMode()`/`launchFreeMode()`/キーヤー等）をそのまま再利用している。
- **自動起動**: `tx.js`読み込み後に追加した小さなインラインスクリプトで`const FREE_STANDALONE = true;`を定義し、ページ読み込み後すぐに`startFreeMode()`を呼び出す。これにより、ロビー画面（`#start-screen`）を経由せず、開いた瞬間からフリー入力モードの画面になる（既存の`tx.html?free=1`パラメータによる自動起動とほぼ同じ仕組みを、常時・無条件で発動させているだけ）。
- **「ロビーに戻る」ではなく「トップ画面に戻る」への分岐**: `tx.js`の`quitFreeMode()`冒頭に`FREE_STANDALONE`判定を追加し、trueの場合は即座に`location.href`でモールス打のトップ画面へ遷移するように変更。free.htmlには戻る先の「ロビー画面」が存在しないため。`quitFreeMode()`はQUITボタン・Escキー（プレイ中の共通Esc処理経由）のどちらからも呼ばれるため、この1箇所の変更で両方に対応できた。
- **？打鍵（Morse Board）にも対応**: プレイ中のEscキー判定部分に`(freeStandalonePage && e.key === '?')`の条件を追加し、free.html上では？打鍵でも同じく`quitFreeMode()`経由でトップ画面へ戻るようにした（通常のtx.html上では？打鍵はこの用途に使われないため影響なし）。
- **Fキーショートカット**:
  - **トップ画面（`index.js`）**: Fキー（Morse Board：・・－・打鍵）でfree.html（EN: free-en.html）へ遷移。既存のT/R/G/Sショートカットと同じ場所に追加。
  - **送信モード・お遊びモードのロビー画面（`tx.js`/`asobi.js`）**: Fキーで、そのページ内の`startFreeMode()`を直接呼び出し、画面遷移せずにその場でフリー入力モードへ切り替える（既存の「📝 フリー入力モード」ボタンと同じ動作）。tx.js側は`FREE_STANDALONE`時（free.html自身）はこのロビー用ショートカットを無効化している（free.htmlは元々ロビー画面を経由しないため不要）。
  - 受信モード（`rx.html`）はフリー入力モード自体が存在しないため対象外。
- **リンク変更**: ホーム画面の`.home-link-btn`、全33ファイルのハンバーガーメニュー、404.html以外の32ファイルのフッターにある「📝 フリー入力モード」リンクを、`tx.html?free=1`/`tx-en.html?free=1`から`free.html`/`free-en.html`に一括変更。`tx.js`側の既存の`?free=1`パラメータ自動起動処理は後方互換のためそのまま残している。
- **`sitemap.xml`**: `free.html`/`free-en.html`を`morse-table`系の直後に追加（priority 0.7/0.6、changefreq monthly。`morse-table`と同列の学習コンテンツ系ページとして扱った）。
- **`how-to-use.html`/`how-to-use-en.html`**: 旧「6. フリー入力モード(送信モード内)」の見出し・説明文を、単体ページ化後の実態に合わせて更新。ショートカット表にも「トップ画面 F」「ロビー画面（送信・お遊び）F」「フリー入力モード画面 Esc／？打鍵」の行を追加。

### 13.6 ロビー画面のSキーショートカットを「現在選択中のタブ状態」を保ったランキング遷移に変更

従来、送信・受信・お遊びモードのロビー画面のSキー（シークレットショートカット）は、いずれも無条件で送受信ランキング（`ranking.html`）へ遷移するだけだった。熊谷さんより「現在選択しているタブの状態（モード・制限時間、お遊びモードはさらに単語種別・プレイスタイルも）のランキングページに行くようにしてほしい」との要望があり、以下のように変更した。

- **`tx.js`**: `document.getElementById('time-select').value`（現在選択中の制限時間、秒）から分へ変換し、`${base}?mode=TX&time=${minutes}` へ遷移するよう変更。
- **`rx.js`**: 同様に`?mode=RX&time=${minutes}`へ遷移。
- **`asobi.js`**: 遷移先ページそのものを`ranking.html`（送受信ランキング）から**お遊びモード専用のランキング（`ranking-asobi.html`）へ変更**。既存の`asobiRankingBase()`（単語種別`wordCategory`・プレイスタイル`gameVariant`の現在値から`?wordcat=&variant=`を組み立てる関数、スコア登録時のリンク生成で既に使用）を再利用し、`${asobiRankingBase()}&time=${minutes}`へ遷移するよう変更。
- いずれも、遷移先のランキングページ側は既存の「Initial load」処理がURLパラメータを無条件で最優先して適用する仕組みになっているため、この変更だけでタブ状態が正しく反映される（遷移先ページ側への追加対応は不要だった）。
- `how-to-use.html`/`how-to-use-en.html`のショートカット表における該当行（ロビー画面 S）の動作列を、この新しい挙動に合わせて更新。

### 13.7 リザルト画面にもSキーショートカットを追加（ランキングへ、hlパラメータ対応）

リザルト画面には元々「スコア登録完了後に表示される『ランキングを見る』リンク」が存在した（`autoRegister()`内で動的生成、`?mode=...&time=...&hl=<登録したスコアID>`付きのリンクで、ランキング側で該当行を光らせる仕組み）。熊谷さんより「リザルト画面でもSキー（押下/打鍵）で同じ場所に行けるようにしたい」との要望があり、各ファイルの結果画面キーボードショートカット処理に追加した。

- **`tx.js`/`rx.js`**: `!typing && e.key.toUpperCase() === 'S'`で、`?mode=TX（またはRX）&time=<initialSecondsから算出した分>`、スコア登録済み（`_registeredId`が存在）なら`&hl=<id>`も付加してランキングへ遷移。
- **`asobi.js`**: 既存の`asobiRankingBase()`（単語種別・プレイスタイルの現在値を反映）を再利用し、`&time=<分>`と（登録済みなら）`&hl=<id>`を付加して`ranking-asobi.html`へ遷移。
- **`!typing`ガードにより**、ニックネーム入力欄にフォーカスしている間はSキーは通常の文字入力として扱われ、ショートカットは発火しない（既存の`/`キー等と同じ振る舞い）。
- **スコア未登録時の挙動**: 登録APIへの通信が完了する前（`_registeredId`が`null`）にSキーが押された場合は、`hl`パラメータなしでそのモード・制限時間のランキングへ遷移する（エラー等にならない）。
- **検証時に見つかった既存の軽微な挙動**（今回は対象外・修正せず）: `ranking-asobi.html`の`updateNavLinks()`は、`window.location.search`を元にクエリ文字列を再構築する`ranking.html`の`updateUrlState()`と異なり、`?wordcat=&variant=&time=`のみでURLを組み直すため、`&hl=`パラメータは初期読み込み時の強調表示（`highlightId`）には正しく使われるものの、その後のURL（アドレスバー表示）からは消える。既存の「ランキングを見る」リンクも同じ挙動であり、今回追加したSキーショートカットも同様。強調表示自体は正しく機能するため、実害は無いと判断し対応は見送った。
- `how-to-use.html`/`how-to-use-en.html`のショートカット表に「リザルト画面 S（Morse Boardの場合は・・・打鍵。送信・お遊びモードのリザルトのみ対応）」の行を追加（受信モードはMorse Board非対応のため、物理キーのみ）。

### 13.8 お遊びモードのロビー説明文が単語種別(wordCategory)を反映していなかった不具合を修正

熊谷さんより「コールサイン+コンテストナンバーを選んでいる時、ロビーの説明文が身近な単語のままになっている」との報告。

- **原因**: `asobi.js`の`updateTxModeDesc()`が生成するロビーの説明文（`modeDescMorseBoard`/`modeDescTouch`/`modeDescDesktop`）は、いずれも先頭に「身近な英単語が表示される。」という文言が**単語種別(`wordCategory`)を一切見ずに**ハードコードされていた。単語種別タブ切替時に呼ばれる`selectWordCategory()`は`updateTxModeDesc()`を呼んでいるものの、関数側が`wordCategory`を参照していなかったため、コールサイン+コンテストナンバーを選んでも表示だけが「身近な単語」のまま変わらなかった。
- **修正**: 説明文の冒頭部分を`modeDescWordPart_GENERAL`（「身近な英単語が表示される。」）/`modeDescWordPart_CALLSIGN`（「コールサインとコンテストナンバーが交互に表示される。」）の2種類に分離し、残りの共通部分（QSB・操作方法の説明）は`modeDescMorseBoardRest`/`modeDescTouchRest`/`modeDescDesktopRest`にリネーム。`updateTxModeDesc()`側で`wordCategory`の値に応じて冒頭部分を選び、共通部分と連結して表示するように変更した。
- Morse Boardモード・タッチデバイス・デスクトップの3パターン、および正確重視/一発勝負のプレフィックスとの組み合わせ全てで、単語種別ごとに正しい説明文に切り替わることをPlaywrightで確認済み（ja/en両方）。

### 13.9 お遊びモードの全タブ（単語種別×プレイスタイル）の説明文を現在の仕様と再照合し、文言を修正

熊谷さんより「全体的にタブごとに説明文を変える／お遊びモードはもう一度すべてのタブを見返して、現在のゲームの仕様に合っているか確認して文言修正してほしい」との依頼。送信モード（`tx.js`）・受信モード（`rx.js`）には単語種別タブ自体が存在せず、説明文も元々タブ不変の内容（送信は常にコールサイン+RST、受信は常にコールサイン+RSTを交互受信）で、QSB（単語ごとの制限時間切れ）の仕組みも持たないため、現状の文言のまま齟齬は見つからなかった（修正不要）。

お遊びモード（`asobi.js`）について、単語種別(`wordCategory`: 身近な単語/コールサイン+コンテストナンバー) × プレイスタイル(`gameVariant`: 普通/正確重視/一発勝負)の全6通り、さらに初心者モードON/OFF・Morse Board/タッチ/デスクトップの各組み合わせで実際のゲーム挙動とロビー説明文を照合し、以下の不整合を発見・修正した。

- **QSB（単語ごとの制限時間切れ）の説明文が実際の挙動と食い違っていた**: 従来の文言「制限時間内にキーイングしないとシグナルが途切れ(QSB)**その単語はアウト！**」は、QSBが起きても**その単語だけが失敗になり次の単語に進む**という以前の仕様の説明だった。しかし現在の実装（`handleWordTimeout()`）では、初心者モードを除く全プレイスタイル（普通/正確重視/一発勝負）で、QSBが発生した時点で**その場でゲーム全体が終了する**（以前はこの挙動は一発勝負モードだけだったが、後の修正で全プレイスタイル共通になっていた）。文言を「制限時間内にキーイングしないとシグナルが途切れ(QSB)、**その場でゲーム終了！**」に修正。
- **初心者モードONの場合、QSB自体の仕組みが存在しない**（`startWordTimer()`が初心者モードでは単語ごとの制限時時間タイマー自体を開始しない）にもかかわらず、従来はロビー説明文が初心者モードのON/OFFを一切見ておらず、常にQSBの説明文が表示されていた。QSBの説明文を独立した`modeDescQsbWarning`キーに分離し、`updateTxModeDesc()`側で初心者モードチェックボックスの状態を直接読み取って、初心者モードONの間はQSBの説明文自体を表示しないように変更。また、初心者モードのチェックボックス（`asobi.html`/`asobi-en.html`双方）の`onchange`に`updateTxModeDesc()`の呼び出しを追加し、チェックを切り替えた瞬間に説明文が再計算されるようにした。
- **一発勝負モードの脱落ヘッドライン**（リザルト画面の「🔥 ELIMINATED（ミスで即終了）」）も、実際には打ち間違いだけでなくQSB（単語の制限時間切れ）でも同じ脱落扱いになる（`handleWordTimeout()`内で`gameVariant === 'ONESHOT'`の場合は`oneShotEliminated = true`を設定）。文言を「🔥 ELIMINATED（ミス/QSBで即終了）」に修正し、原因を両方とも示すようにした。
- 単語種別(`modeDescWordPart_GENERAL`/`modeDescWordPart_CALLSIGN`)・プレイスタイルの警告文(`variantPrefix_ACCURACY`/`variantPrefix_ONESHOT`)・デバイス別の操作方法説明（Morse Board/タッチ/デスクトップ）については、実装（単語の最初からやり直し＝正確重視、一度のミスで即終了＝一発勝負、カットナンバー許容はコンテストナンバー部分のみ等）と照合した結果、文言と挙動は一致しており修正不要だった。
- 全6通りの単語種別×プレイスタイルの組み合わせに加え、初心者モードON/OFF、Morse Board/タッチ/デスクトップの各デバイス分岐、日本語/英語の両方でPlaywrightにより表示文言を確認済み。

---

### 13.10 トップページ専用の「U」ショートカット（使い方ページへ）を追加、および全ショートカットの英語版での動作を監査

熊谷さんより「トップページのみのショートカットとして、Uキー（打鍵可）で使い方ページへ行きたい」との依頼、あわせて「これまでも含め、英語バージョンでもショートカットがすべて動作するようにしてほしい」との依頼。

- **Uショートカット追加**: `index.js`内のトップ画面専用キーボードショートカット処理（T/R/G/F/Sと同じブロック）に`U`キーを追加。`index.js`は`index.html`/`index-en.html`の2ファイルにしか読み込まれていないため、他のページでは発火しない（依頼通りトップ画面限定）。既存のT/R/G/F/Sと同じ`lang`変数での分岐により、日本語版では`how-to-use.html`、英語版では`how-to-use-en.html`へ遷移する。`how-to-use.html`/`how-to-use-en.html`のショートカット表にも行を追加。
- **既存ショートカットの英語版動作を監査**: `lang-guard.js`のグローバルショートカット（：/M）、`index.js`・`tx.js`・`rx.js`・`asobi.js`の全キーボードショートカットの遷移先（`location.href`）を確認したところ、いずれも`LANG`（または`lang`/`document.documentElement.lang`）の値に応じて`-en.html`系のページへ正しく分岐しており、問題は見つからなかった。
- **ただし、asobi.html/asobi-en.htmlのonchange属性に1件の不整合を検出**（13.9章で追加した「初心者モードチェックボックスのonchangeで`updateTxModeDesc()`も呼ぶ」変更を、日本語版`asobi.html`にしか適用しておらず、英語版`asobi-en.html`には反映し忘れていた）。これは今回の監査中に発見し、`asobi-en.html`側にも同じ`onchange="updateAsobiUrlState(); updateTxModeDesc();"`を追加して修正済み（13.9章のコミットに含めて対応済み）。
- 全33ファイルの`onXxx=`属性（onclick/onchange/oninput/onkeydown等）をja/enペアごとに突き合わせ、上記以外の構造的な差異（英語版にだけ無いハンドラ等）が無いことを確認した。`404.html`は唯一の英語版を持たないページ（エラーページのため言語非対応で設計されている）であり、そのグローバル「：」ショートカットが`https://jl1gix.com`固定になっているのは仕様通り（対象外）。

---

## 14. サイト全体のビジュアルを黒ベース（黒背景+白文字）へ再刷新 (2026-11 第9弾)

**熊谷さんより「§4で進めてきた白ベースのビジュアルをやめ、黒ベースに戻したい」との明示的な依頼があった。** ただし単純な§4以前への巻き戻しではなく、以下の具体的な条件付きの依頼だった。

> 前までは黒背景緑文字だったが、今回は黒背景白文字で。スコープの水色に関してはノータッチで（スコープ背景は黒に変更）。緑の色に関して、白背景に変更する過程で緑色を何か変更していたら、黒色時代に採用していた緑に戻しておいて。基本は前の黒色のやつをベースにするけど、完全に戻すわけではない。ファビコンやXシェア画像も黒ベースで。色以外のデザインは変更なしで。

これにより、**§4.1の冒頭に書いた「今後は白ベースを正とする」という方針は、この章をもって撤回・上書きする。** 以後は本章の黒ベースを正とする。

### 14.1 方針・調査

- ゲームの仕様・サイトの挙動には一切手を入れず、**色のみ**の変更とした（CSS変数・ハードコードされた色リテラル・canvas描画色・アイコン/OGP画像の4種のみが対象）。
- 真の「黒色時代最終コミット」を`git log`から特定するため、白ベース刷新のコミット`97f176a`（デザイン: サイト全体を黒ベースから白ベース(緑アクセント維持)に刷新）のメッセージ自体が、さらに古い失敗した白化の試み`3b5f5af`（Revert "デザイン: 黒基調から白基調テーマに変更（緑色維持）"）に言及していたことから、`97f176a`の直前コミット`9a7cc09`を黒色時代の正しい基準点として特定し、`git show 9a7cc09:<file>`で当時の`index.html`/`tx.html`/`tx.js`の色定義を復元した。
- **「`-bright`サフィックス」の発見**: 現行（白ベース）の`--primary-bright: #00d06a`/`--error-bright: #e74c3c`/`--success-bright: #00ee77`は、§4の白ベース化時に「暗い計器窓専用の鮮色」として温存されていた値だが、これらは黒色時代の`--primary`/`--error`/`--success`の値そのものと完全一致していることを確認した（かつ`--primary-bright`は現行コード中どこからも`var()`参照されていない死んだトークンであることも確認）。これにより、「白背景に変更する過程で緑色を変更していたら黒色時代の緑に戻す」という依頼を、憶測ではなく**史実通りの値**で満たせることが分かった。
- 依頼にある「スコープの水色はノータッチ」を素直に解釈すると、黒色時代の`wfColor()`（緑一色のCRT風配色）をそのまま復元するのは不可（水色をそのまま使えという指示と矛盾する）。そのため、**ウォーターフォール関数は史実復元ではなく、現行の水色グラデーションを土台に「白→紺」方向だったものを「黒→水色」方向に作り替える**という設計判断をした（14.3参照）。

### 14.2 `:root`変数・ハードコード色の一括置換

全40ファイル（html 35 + js 5、`lang-guard.js`は色定義なしのため対象外）に対し、Pythonスクリプトによるリテラル置換（変数宣言の完全一致・rgba()のプレフィックス一致・個別のハードコード値の3段構成）を適用した。主な変更:

```css
:root {
    /* 黒色時代の値に復元 (*-brightトークンと同じ値 = 史実通り) */
    --primary:        #00d06a;   /* 旧 #007b43 */
    --primary-dim:    #00b85a;   /* 旧 #19815a */
    --error:          #e74c3c;   /* 旧 #c0392b (--error-brightと同値) */
    --success:        #00ee77;   /* 旧 #15803d (--success-brightと同値) */

    /* 新規に黒背景向けへチューニング（黒色時代に存在しなかった/白背景専用だったトークン） */
    --bg:             #080f0b;   /* 旧 #e4e7e6、黒色時代の値を再採用 */
    --panel:          #0e1f16;   /* 旧 #ffffff、黒色時代の値を再採用 */
    --border:         #1e5c38;   /* 旧 #e5e5e5、黒色時代の値を再採用 */
    --border-strong:  #3a7a58;   /* 旧 #b0b0b0（白ベース期に新設されたトークンのため史実なし、新規チューニング） */
    --text:           #eef7f2;   /* 旧 #262626。「黒背景+白文字」の本体。黒色時代に死んだトークンとして残っていた --code-color と同値を流用 */
    --text-secondary: #8fae9c;   /* 旧 #707070、新規チューニング */
    --primary-soft:   #0f2a1c;   /* 旧 #e6f5ee、新規チューニング（淡緑の塗りの黒版） */
    --scope-bg:       #050f08;   /* 旧 #0a1b12、黒色時代の値を再採用（このトークン自体は現在も未使用） */
    --scope-bg-light: #0a1b12;   /* 旧 #ffffff。14.3のスコープ黒背景化の本体 */
}
```

- `--code-color`（`how-to-use.html`等の静的ページ系シェイプのみ`#16241c`だった）も`#eef7f2`に統一。黒色時代は元々このシェイプも`#eef7f2`で統一されていたことを`git show 9a7cc09:how-to-use.html`で確認済み（白ベース化の際にこのシェイプだけ読める暗色に書き換えられ、他シェイプでは死んだトークンのまま取り残されていた）。
- `rgba(0,123,67,*)`・`rgba(10,125,68,*)`（旧primaryのrgba近似値、ホバー背景やグロー等で使用）→`rgba(0,208,106,*)`（新primaryのrgba値）に一括置換。`rgba(16,40,28,*)`（白背景向けの「パネルの影」用の暗緑系シャドウ）→`rgba(0,0,0,*)`（黒背景では素直に黒影でよい）。`rgba(192,57,43,*)`/`rgba(21,128,61,*)`（旧error/successのrgba近似値、正誤フラッシュアニメーション用）→`rgba(231,76,60,*)`/`rgba(0,238,119,*)`に一括置換。
- ランキング系12ファイルの`var(--primary-soft, #e6f5ee)`というフォールバック構文（`:root`に`--primary-soft`を持たないシェイプがvar()のデフォルト値として直接書いていた箇所）も同様に`#0f2a1c`へ修正。
- WPM難易度バッジ（初心者=緑/中級者=金/上級者=赤のパステル枠）・ランキングメダル色（🥇🥈🥉）・トグルスイッチOFF状態/signalドット非アクティブ時の淡いグレー系・見出し下罫線や区切り線など、白背景を前提に調整されていた細かい装飾色についても、同系統の色相を保ったまま黒背景上で視認できる明度に再設計した。
- `.share-btn-x`（Xシェアボタン）の`#000`/`#fff`/`#111`/`#444`等のブランド指定色、スコープの水色系（`#0278b9`、`rgba(3,155,229,*)`、`rgba(30,136,190,*)`等）、単語タイマーバーの黄色`#e8d000`は、依頼通り**一切変更していない**。
- トグルスイッチのつまみ（白い円）と「ON」ラベル文字は、意図的に白のまま維持した（黒トラック・緑トラックいずれの上でも視認性が確保できるため）。

### 14.3 スペクトラムスコープの黒背景化とウォーターフォール配色の作り替え

- `#scope-container`の背景を決める`--scope-bg-light`を`#ffffff`→`#0a1b12`に変更（§4.1で導入されたこのトークン自体の仕組みは変更せず、値のみ変更）。
- `tx.js`/`rx.js`/`asobi.js`（3ファイルとも完全同一の`wfColor(v)`）と`index.js`（ホーム画面装飾スコープ用、`wfCol(v)`という別名だが同一ロジック）の計4箇所で、直接`ctx.fillRect`しているcanvasの地塗り（`'#ffffff'`＝スペクトラム部分の単色塗り、`'#ffffff08'`＝ウォーターフォール部分の残像フェード用の低アルファ塗り）を、スコープ背景色と同じ`'#0a1b12'`/`'#0a1b1208'`に変更。CSSの`--scope-bg-light`だけでなく、canvas側で直接描画されるこの地色も変えないと、ゲームプレイ中のスコープが白いまま残ってしまうため必須の修正だった。
- ウォーターフォール配色関数`wfColor()`/`wfCol()`自体は、§4.1で「白→薄水色→スカイブルー→紺」の5段階グラデーションへ全面的に再配色されたものがベースになっている。今回は**水色の色相は一切変えず**、ノイズフロア（信号が無い部分）が白ではなく黒方向にフェードし、信号ピーク（強い信号）に向かって水色が明るくなっていくよう、同じ5段階のブレークポイント構造（v<0.10 / 0.30 / 0.58 / 0.82 / それ以降）を保ったまま各区間のRGB値を黒基調で作り直した（黒色時代の`wfColor()`は緑一色のモノクロ配色だったため、これは史実の復元ではなく、現行の水色トーンを土台にした新規の黒背景向けデザイン）。
- 実機の緑色CRT風ではなく、黒地に青〜水色のスペクトラムアナライザーという、無線機の実機でもよく見るトーンになった。

### 14.4 ファビコン・OGP画像の黒ベース化

- ファビコン一式（`favicon.ico`/`favicon-16x16.png`/`favicon-32x32.png`/`favicon-512x512.png`/`apple-touch-icon.png`）とMorse Boardアイコン（`morseda-icon-1024.png`/`morseda-icon-2048.png`）は、「色以外のデザインは変更なし」という依頼を字義通り満たすため、`git show 9a7cc09:<file>`で黒色時代のバイナリをそのまま復元した（図形自体が完全に同一であることが保証されるため、再配色による劣化や差異のリスクがない）。
- OGP画像（`ogp.png`、Xシェア時に表示される画像）は、直前のタスクで作成済みだったHTML/CSS生成スクリプト（CONTESTのモールス符号ワードマークを表示するもの）の配色のみを黒ベースに作り替え、Playwrightでレンダリングし直した。カード背景`#ffffff`→`#0e1f16`、ページ背景`#f6faf8`→`#080f0b`、サブタイトル文字色`#3c5046`→`#9fb3a8`に変更し、CONTESTのワードマーク自体・レイアウト・フォント等は一切変更していない。`<meta name="theme-color">`も全ファイル`#f6faf8`→`#080f0b`に変更。

### 14.5 検証

- 全JSファイル（`tx.js`/`rx.js`/`asobi.js`/`index.js`/`lang-guard.js`）を`node --check`で構文確認。
- Playwrightでホーム・送信モード（ロビー+ゲーム画面）・お遊びモード・ランキング・使い方・モールス符号表・運営者情報・お問い合わせ・404を日英両方でスクリーンショット確認。送信モードはゲームを実際に開始し、スペクトラムスコープが黒背景+水色波形で正しく描画されることを確認。
- お問い合わせページのGoogleフォーム埋め込みiframeは外部サービスの白背景のままだが、これは§4で既に`filter`による強制反転トリックを撤去済みの仕様通りであり、今回のスコープ外（第三者サービスの見た目は変更不可能なため）。
- 色置換後の全ファイルに対し、意図的に変更除外した色（スコープ水色系・Xシェアボタンブランド色・タイマーバー黄色等）が元の出現回数のまま変化していないことをスクリプトで確認した。

---

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

## 16. ランキングページ間（送受信⇔お遊び）を移動する際、選択中の制限時間を引き継ぐように修正 (2026-11)

熊谷さんより、「送受信ランキング⇔お遊びランキングを行き来する際に、その時点で開いていた制限時間はそのまま保持してページ移動を行っていてほしい（例: お遊びモードで3分のランキングを見ている時に受信モードのランキングを開くボタンを押したり、ショートカットRで行ったりすると、受信モードの3分のランキングが表示されるように）」との依頼があった。

### 現状把握

ランキング系ページは「送受信ランキング」側（`ranking.html`/`ranking-en.html`、および日付範囲違いの`ranking-today.html`/`ranking-yesterday.html`とその英語版、計6ファイル）と「お遊びランキング」側（`ranking-asobi.html`/`ranking-asobi-en.html`、および`ranking-asobi-today.html`/`ranking-asobi-yesterday.html`とその英語版、計6ファイル）の合計12ファイルに分かれている。各ページには制限時間タブ（1分/3分/5分、`currentMinutes`）があり、相手側のランキングページへ移動するための固定リンク（`#nav-asobi-link`「🎮 お遊びモードのランキング」/`#nav-rxtx-link`「📡 送信・受信モードのランキング」）と、キーボードショートカットが用意されている。

調査すると、移動先に制限時間を引き継ぐ経路とそうでない経路が混在していた。

- お遊びランキング側の「R/Tショートカット」（送受信ランキングのRX/TXへ移動）は、押された時点で`?mode=...&time=${currentMinutes}`を組み立てて移動していたため、**ショートカット操作に関しては既に制限時間を引き継いでいた**。
- 一方、**固定リンク(`#nav-rxtx-link`/`#nav-asobi-link`)自体のhref属性はHTMLに書かれたまま（例: `href="ranking.html"`）更新されておらず、クエリパラメータが一切付いていなかった**。そのため、「ボタンを直接クリックして移動する」場合は、どちらの方向でも制限時間（お遊びランキング側ではさらに単語種別・プレイスタイルも）が引き継がれず、移動先では常にデフォルト（1分）表示になってしまっていた。
- 送受信ランキング側の「G/Cショートカット」（お遊びランキングの身近な単語/コールサインへ移動）は`?wordcat=...`のみを付けて移動しており、こちらもtimeを引き継いでいなかった。

### 修正内容

1. **送受信側6ファイル**（`ranking.html`/`-en`/`-today`/`-today-en`/`-yesterday`/`-yesterday-en`）: 制限時間タブ切り替え時に呼ばれる`updateNavLinkHrefs()`の中で、既存の「今日/昨日」ナビリンク更新処理と同様に、`#nav-asobi-link`のhrefも常に最新の`currentMinutes`を含む`?time=${currentMinutes}`付きに更新するようにした。これにより、タブを切り替えた瞬間からリンクのhref自体が正しい時間を指すようになり、普通にクリックしても制限時間が引き継がれる。また、G/Cショートカットのハンドラも`&time=${currentMinutes}`を付与するよう修正した。
2. **お遊び側6ファイル**（`ranking-asobi.html`/`-en`/`-today`/`-today-en`/`-yesterday`/`-yesterday-en`）: 同様に`updateNavLinks()`の中で`#nav-rxtx-link`のhrefに`?time=${currentMinutes}`を常時反映するよう追加した。既存のR/Tショートカットのハンドラは、hrefが既に`?time=...`付きに更新されている可能性があるため、`link.getAttribute('href').split('?')[0]`でクエリ部分を一旦取り除いてから`?mode=...&time=...`を組み立て直すよう修正し、「?」が二重になる不具合を防いだ。
3. モード（RX/TX）や単語種別・プレイスタイルは、元々このショートカット操作時にのみ明示的に指定される仕様（今回のご依頼が制限時間の引き継ぎに限定されていたため、この部分の挙動は変更していない）。固定リンクを素のままクリックした場合の着地モード・単語種別は従来通り（デフォルト/直前にlocalStorageへ保存された値）。

### 検証

Playwrightで、お遊びランキング側で3分タブを選択→`#nav-rxtx-link`のhref属性が`ranking.html?time=3`になっていることを確認。その状態でR/Tキーを押し、ナビゲーション先リクエストURLを横取りして`ranking.html?mode=RX&time=3`・`ranking.html?mode=TX&time=3`（「?」1個のみ）になっていることを確認。送受信ランキング側でも同様に5分タブ選択→`#nav-asobi-link`のhrefが`ranking-asobi.html?time=5`になること、G/Cキーでそれぞれ`wordcat=GENERAL&time=5`・`wordcat=CALLSIGN&time=5`で移動することを確認。さらに実際にリンクをクリックして遷移させ、着地先ページで該当の分数タブに`active`クラスが付いていることも確認済み。today/yesterday版についても同じ仕組みでhrefが更新されることを確認済み。

---

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

## 18. お問い合わせフォームを新しいGoogleフォーム（収集用メールアドレス変更）に差し替え (2026-11)

熊谷さんが、お問い合わせフォームの回答収集用メールアドレスを変更するため、新しいGoogleフォームを作成（内容は旧フォームと同一の質問構成）。これに伴い、`contact.html`/`contact-en.html`に埋め込んでいた旧フォームのiframeを、新フォームのものに差し替えてほしいとの依頼があった。

### 対応内容

- `contact.html`/`contact-en.html`の`<iframe src="...">`を、旧フォームのURL(`.../d/e/1FAIpQLSd3d_BiCe4JuH5l6X1tw7S2iMUCWBijup_kufpG2jtHD0w84A/...`)から、熊谷さんが共有した新フォームのURL(`.../d/e/1FAIpQLSeFq5cVgQWcuNfOg4Xw5ZaMjiTxEvoJK2MoDIxAZVw5gHBGMQ/...`)へ差し替えた。
- 新フォームは旧フォームよりも実際の表示高さが高い（Google側が埋め込みコードで提示した高さも`1418px`など、旧フォーム向けに設定していた`min-height: 950px`(PC)/`1100px`(モバイル)より明らかに大きい）ことが分かったため、ビルトインブラウザで実際に新フォームを開き、PC相当の幅(780px)で約1447px、モバイル相当の幅(375px)で約1634pxの表示高さになることを実測した上で、`iframe`の`min-height`を`950px→1470px`(PC)、`1100px→1680px`(モバイル)に引き上げた。これにより、新フォームの内容がiframe内の二重スクロールなしに収まるようにした。
- 旧フォームのID(`1FAIpQLSd3d_...`)がリポジトリ内の他のファイルに残っていないことを確認済み。

### 確認

ビルトインブラウザで新フォームのURLを直接開き、質問内容が旧フォームと同一（メールアドレス・お名前・お問い合わせの種類など）であること、現時点ではGoogle側のテーマ設定はまだ初期値（白背景）のままであることを確認した。`contact.html`のiframeの`src`属性が新URLになっていることをローカルで確認済み（このサンドボックス環境からは`docs.google.com`への外部ネットワークアクセスが無いため、埋め込みフォーム自体の実機ブラウザでの表示確認はできないが、URLの差し替え自体は正しく反映されている）。

フォーム自体の配色（ダークテーマへのカスタマイズ）は熊谷さんがGoogleフォーム編集画面の🎨「テーマをカスタマイズ」から行う想定で、今回はiframeの参照先URLと表示サイズ調整のみ対応。旧フォームの扱い（残す/停止/削除）は熊谷さんの判断に委ねている。

---


## 19. Morse Board絵文字の変更（🎹→🕹️） (2026-11)

熊谷さんより「Morse Boardの絵文字はこれで→🕹️」とのご依頼があった。

ハンバーガーメニュー内の「🎹 Morse Boardについて」/「🎹 About Morse Board」リンクで使われていた🎹（ピアノ）の絵文字を、指定された🕹️（ジョイスティック）に差し替えた。対象は全31ファイル（各ファイルにつき1箇所のみ使用されていたことを確認済み）：404.html、asobi.html/-en、contact.html/-en、free.html/-en、how-to-use.html/-en、index.html/-en、morse-board.html/-en、morse-table.html/-en、privacy.html/-en、profile.html/-en、ranking-asobi.html/-en/-today/-today-en、ranking.html/-en/-today/-today-en、rx.html/-en、tx.html/-en。

全31ファイルで絵文字が🕹️に統一され、🎹が一切残っていないことをPlaywrightで確認済み。

（補足：当初は同時にお遊びモードの「正確重視」プレイスタイルも撤廃する対応を行ったが、熊谷さんより「正確重視モードもやっぱ消さないでいい」とのご連絡があり、その部分の変更はすべて元に戻した。今回コミットに反映されているのは絵文字の変更のみ。）

---


## 20. お遊びモード「正確重視」プレイスタイルの削除（最終決定） (2026-11)

19章の時点では「正確重視モードもやっぱ消さないでいい」とのことで一度撤回していたが、改めて熊谷さんより次の依頼があった。

> やっぱ「正確重視モード」削除で。それに伴ったショートカットキーとかも消しちゃってok。htmlファイルも削除ok。サーバーのデータ削除だけ難しかったらやらなくておkだけど全体的にできるところはとことん消しちゃっておk

これを受けて、18章時点で一度実施していた「正確重視モード完全撤廃」の変更内容（19章の補足で元に戻した内容）を再度適用した。変更内容自体は前回と同一のため詳細は省略するが、要点は以下の通り。

- `asobi.js`: プレイスタイル選択・ミス処理・得点登録(`ASOBI_MODE_TABLE`)など、ACCURACY関連のロジックをすべて削除。お遊びモードのプレイスタイルは「普通」「一発勝負」の2通りに。
- `asobi.html`/`asobi-en.html`: プレイスタイルタブと「↺ やり直し」表示用UIを削除。
- `ranking-asobi.html`/`-en`/`-today`/`-today-en`: タブ・キーボードショートカット（Aキー）・`ASOBI_MODE_TABLE`のACCURACY関連エントリを削除。
- `how-to-use.html`/`how-to-use-en.html`: 正確重視モードの説明文・ショートカット表の行を削除。

なお「htmlファイルも削除ok」とのご依頼があったが、正確重視モードはそもそも専用のHTMLファイルを持たず（`asobi.html`内のタブ切り替えの一つという扱いだったため）、削除対象となる専用ファイルは存在しない。該当するのは上記の各ファイル内の記述のみ。

バックエンド(api.jl1gix.com、ConoHaのVPS上で稼働)に残っている過去の正確重視モードのスコアデータ（mode値 `ASOBI_GEN_ACC` / `ASOBI_CALL_ACC`）については、VPSのrootパスワードが不明でConoHaサポートに問い合わせても再発行以外の方法は案内されず、アクセス手段がない状態。熊谷さんより「サーバーのデータ削除だけ難しかったらやらなくておk」とのご了承を得ているため、今回は対応を見送った。過去データは残るが、フロント側からは一切参照・表示されなくなっている。

### 確認

全編集後`node --check`でJS構文エラーがないことを確認。Playwrightで`asobi.html`/`-en`に`#var-accuracy`タブが存在しないこと、`ranking-asobi*.html`（4ファイル）に`#tab-var-accuracy`が存在せず残り4通りの`computeMode()`が正しく動作すること、`how-to-use*.html`に「正確重視」/「Accuracy Focus」の記述が残っていないことを確認済み（18章で実施した検証と同一内容）。

## 21. ショートカットキー表の全体見直し（Sキーの受信モード対応、？打鍵の送信・お遊びモード本番プレイ対応） (2026-11)

熊谷さんより使い方ページのショートカット表について質問・依頼があった。

> S（Morse Boardの場合は・・・打鍵。送信・お遊びモードのリザルトのみ対応）
>
> これどういう意味？受信モードは対応していないの？

確認したところ、これは誤記だった。`rx.js`を確認すると、ロビー画面・リザルト画面のいずれにも`S`キーによるランキング画面遷移ショートカットが実装されており、受信モードは元々対応していた。`how-to-use.html`/`how-to-use-en.html`の説明文のみが古いままになっていたため、「送信・受信・お遊びモード」と対応範囲を修正した（コミット`9c2c493`）。

続けて、ショートカット表全体に他にもおかしな点がないか確認してほしいとの依頼があった。

> 全体的にこのショートカットキー変なところとかあったりする？あったら教えて

`index.js`・`tx.js`・`rx.js`・`asobi.js`・`lang-guard.js`・`ranking.html`・`ranking-asobi.html`の各ショートカット実装を表の記載と突き合わせたところ、もう1点、実装が表の説明と食い違っている箇所が見つかった。「プレイ中（Morse Board）：？打鍵」の行は、実際には`free.html`（フリー入力モード単体ページ）でしか効かず、送信モード・お遊びモードの本番プレイ中（`game-screen`表示中）には効いていなかった（`tx.js`側が`FREE_STANDALONE`フラグでのみ判定していたため）。

これに対し、次の対応方針が選ばれた。

> 1. コードの方を直す（送信・お遊びモードの本番プレイ中も「？」でロビーに戻れるようにする）
>
> でお願いします

`tx.js`・`asobi.js`のプレイ中キー判定を、`FREE_STANDALONE`ではなく既存の`morseBoardMode`（Morse Boardモードのチェックボックス状態）で判定するよう統一した。これにより、Morse Boardモードが有効であれば、送信モード・お遊びモードの本番プレイ中にも？打鍵（・・－－・・）でロビーへ戻れるようになった。`free.html`についても、Morse Boardモードが有効な場合のみ？打鍵で終了する動作になった（従来はモード状態に関わらず常に有効だったが、本来Morse Board専用の操作であるため、他のページと同じ条件に揃える形で統一）。Escキーは従来通り常に有効（制御キーのため）。

### 確認

`node --check`でtx.js・asobi.jsの構文エラーがないことを確認。Playwrightで以下を確認済み。
- `tx.html`（送信モード本番プレイ中）：Morse BoardモードON時は？打鍵でロビーに戻る、OFF時は？打鍵してもプレイ継続、Escキーは常に有効。
- `asobi.html`（お遊びモード本番プレイ中）：同上。
- `free.html`：Morse BoardモードON時は？打鍵で終了（トップ画面へ遷移）、OFF時は？打鍵しても継続。


## 22. 「正確重視」プレイスタイルの復活 (2026-11)

20章で熊谷さんの明確な依頼により完全削除した「正確重視」プレイスタイルだが、改めて復活の依頼があった。

> ごめん何度も申し訳ないんだけど、やっぱり正確重視モード復活させてほしい。
> それに伴ったショートカット（ショートカット表の修正も含む）の復活も全部お願いします

対応方針として、記憶やゼロからの再実装ではなく、20章で「正確重視」を最終削除したコミット`c707709`自体を`git revert`し、その直前の状態（19章で一度完全復元し、動作検証済みだった`38cee49`の状態）へ機械的に戻す方法を取った。これにより再実装時の実装揺れや考慮漏れを避けた。

`git revert --no-commit c707709`を実行したところ、コード・HTML側の9ファイル（`asobi.js`・`asobi.html`・`asobi-en.html`・`ranking-asobi.html`・`ranking-asobi-en.html`・`ranking-asobi-today.html`・`ranking-asobi-today-en.html`・`how-to-use.html`・`how-to-use-en.html`）はすべて無衝突で自動マージされた。`PROJECT_MEMO.md`のみ、21章の追記など`c707709`以降の変更と競合したため、コンフリクトマーカーを手動で解消し、18〜21章の記録を含むHEAD側の内容を維持した上で本章を追記する形にした。

復元された主な内容：

- `asobi.js`：`gameVariant`に`'ACCURACY'`を復活（`NORMAL`/`ACCURACY`/`ONESHOT`の3択に）。ミス時に単語の先頭から打ち直しにする分岐、やり直し回数`accuracyResetCount`のカウントと「↺ やり直し ◯回」表示用の`updateVariantStatusUI()`、`ASOBI_MODE_TABLE`への`GENERAL_ACCURACY`(`ASOBI_GEN_ACC`)・`CALLSIGN_ACCURACY`(`ASOBI_CALL_ACC`)の復活。なお17章で削除したスコア巻き戻し（ミス時に得点を0に戻す仕様）は復活させておらず、19章時点と同じく「やり直し表示のみ・得点は巻き戻さない」仕様のまま。
- `asobi.html`/`asobi-en.html`：プレイスタイルタブに「正確重視」/「Accuracy Focus」ボタン、やり直し回数表示用の`#variant-status`要素とレイアウトシフト防止CSS（15章の対応内容）を復活。
- `ranking-asobi.html`/`-en`/`-today`/`-today-en`（計4ファイル）：プレイスタイルタブ・`ASOBI_MODE_TABLE`・URLパラメータ復元・`A`キー（Morse Board：・－打鍵）によるタブ切り替えショートカットを復活。
- `how-to-use.html`/`-en.html`：「プレイスタイル」説明に「正確重視」/「Accuracy Focus」の項目を復活、ショートカット表に「A（Morse Board：・－打鍵）→正確重視タブへ切り替え」の行を復活。

なお`ranking-asobi-yesterday.html`系のファイルはリポジトリ内に存在しないため、`c707709`の変更対象にも含まれておらず、今回の復元対象からも除外（確認済み・問題なし）。

### 確認

`node --check asobi.js`で構文エラーがないことを確認。`grep`で`updateVariantStatusUI`が1箇所で定義され3箇所から一貫して呼ばれていること（18章で発生した「関数削除後も呼び出しが残ってReferenceErrorになる」不具合と同種の問題が再発していないこと）を確認。9ファイルすべての差分を目視で確認し、`c707709`の削除内容を過不足なく正確に打ち消す内容になっていることを確認した。

---

_最終更新: 2026-11-25（「正確重視」プレイスタイルの復活。詳細は22章）_

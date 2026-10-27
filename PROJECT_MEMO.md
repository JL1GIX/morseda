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
| `asobi.html` | **お遊びモード**。送信モードと同じ操作系で、英単語をお題にした気軽な練習。ミス分析機能あり | 約 49KB |
| `asobi.js` | asobi.html のゲームロジック外部化版。`asobi-en.html` と共有 | 約 60KB |
| `ranking.html` | スコアランキング表示（全期間）。モード別 (rx/tx/asobi) × 時間別 (1分/3分/5分)。`ranking-today.html`/`ranking-yesterday.html` への導線リンクあり | 約 22KB |
| `ranking-today.html` | **今日のランキング**。`ranking.html` と同じモード/時間タブを持つ独立ページ。クライアント側で全ページ取得→JST日付でフィルタして表示（11.4章参照） | 約 23KB |
| `ranking-yesterday.html` | **昨日のランキング**。`ranking-today.html` と全く同じ仕組みで対象日を1日前にしたもの | 約 23KB |
| `morse-table.html` | モールス符号表 (リファレンス) | 約 15KB |
| `how-to-use.html` | 使い方ガイド（全機能の説明、キーボードショートカット一覧を含む） | 約 22KB |
| `profile.html` | 運営者情報 | 約 16KB |
| `privacy.html` | プライバシーポリシー | 約 11KB |
| `contact.html` | お問い合わせ | 約 11KB |
| `sitemap.xml` | サイトマップ。ja/en 全24ページ分のURLと`hreflang`相互参照を記載（2026-10、`ranking-today`/`ranking-yesterday`のja/en 4ページ追加） | 約 9KB |
| `*-en.html`（`index-en.html`, `tx-en.html`, `rx-en.html`, `asobi-en.html`, `ranking-en.html`, `ranking-today-en.html`, `ranking-yesterday-en.html`, `profile-en.html`, `contact-en.html`, `how-to-use-en.html`, `morse-table-en.html`, `privacy-en.html`） | 各ページの英語版。ルート直下に ja 版と並べて配置（`/en/`のようなサブフォルダは使わない）。詳細は 9章 | 各ページ ja版とほぼ同サイズ |
| `CNAME` | GitHub Pages のカスタムドメイン (`jl1gix.com`) |  |
| `favicon-*.png` / `apple-touch-icon.png` / `ogp.png` | アイコン・OGP 画像 |  |

⚠ `C:\Users\noayo\Downloads\JL1GIX\モールス打\` の **直下** にも同名 HTML が置かれているが、これは Git 管理外の古いコピー。**編集対象はあくまで `morseda\` サブフォルダ内のファイル**。

## 4. デザイン規約

CRT 風の暗色テーマで統一されている。色やフォントを変更するときはこのトークンを基準にする。

```css
:root {
    --primary:     #00d06a;   /* メインの緑(明) */
    --primary-dim: #00b85a;   /* サブの緑(暗) */
    --bg:          #080f0b;   /* 背景(ほぼ黒) */
    --panel:       #0e1f16;   /* パネル背景 */
    --border:      #1e5c38;   /* 罫線 */
}
```

- フォント: `'Consolas', 'Monaco', 'Courier New', monospace`
- スキャンライン風オーバーレイ (`body::after` の `repeating-linear-gradient`) を全ページで使用
- フッターは全ページ共通: ランキング / モールス符号表 / 運営者情報 / プライバシーポリシー / お問い合わせ
- 過去に「白基調テーマ」へ変更する試みがあったが Revert されている (commit `3b5f5af`)。**暗色テーマを維持する方針**。

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

---

_最終更新: 2026-10-27 (ランキングの日付別表示を独立ページ方式に全面変更し`ranking-today`/`ranking-yesterday`のja/en 4ページを新規追加、WPM速度スライダー化、初心者帯の文字区切り猶予延長、Iambicキーヤーの素早いタップ対応)_

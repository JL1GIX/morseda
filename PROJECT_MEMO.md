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
| `ranking.html` | スコアランキング表示。モード別 (rx/tx/asobi) × 時間別 (1分/3分/5分) | 約 22KB |
| `morse-table.html` | モールス符号表 (リファレンス) | 約 15KB |
| `how-to-use.html` | 使い方ガイド（全機能の説明、キーボードショートカット一覧を含む） | 約 22KB |
| `profile.html` | 運営者情報 | 約 16KB |
| `privacy.html` | プライバシーポリシー | 約 11KB |
| `contact.html` | お問い合わせ | 約 11KB |
| `sitemap.xml` | サイトマップ。ja/en 全20ページ分のURLと`hreflang`相互参照を記載 | 約 8KB |
| `*-en.html`（`index-en.html`, `tx-en.html`, `rx-en.html`, `asobi-en.html`, `ranking-en.html`, `profile-en.html`, `contact-en.html`, `how-to-use-en.html`, `morse-table-en.html`, `privacy-en.html`） | 各ページの英語版。ルート直下に ja 版と並べて配置（`/en/`のようなサブフォルダは使わない）。詳細は 9章 | 各ページ ja版とほぼ同サイズ |
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

2026-09時点、CoworkからこのPC（熊谷さんのWindows機）への**シェル直接アクセス（`device_bash`）が機能しない**状態が続いている（"no Plan9 drive shares mounted" エラー）。そのため6章・6.1章に書かれている `git commit-tree` を使った低レベルコミット手順は**実行不可能**（シェルが使えないため）。

現在の実際のワークフローは以下の通り:

1. Cowork が `device_stage_files` / `device_commit_files`（ファイル転送のみ、シェルなし）を使ってファイルの読み書きを行う。
2. Cowork は **一切 commit しない**。ファイルを編集するだけ。
3. 熊谷さんが GitHub Desktop を開き、**ご自身で commit → push** する。Coworkはコミットメッセージ案を提示するのみ。

この制約が将来的に解消され `device_bash` が使えるようになった場合でも、**push は熊谷さんご自身が行う方針は変わらない**（誤って本番に反映されるのを防ぐため）。6.1章の手順は `device_bash` が復旧した場合の参考として残しているが、現状は使えない。

---

_最終更新: 2026-09-13 (英語モード実装 v2: `-en.html` フラット命名方式に変更)_

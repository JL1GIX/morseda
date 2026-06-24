# Morse Center / モールスセンター (旧: モールス打 / リポジトリ名: morseda → morse-center) プロジェクトメモ

このメモは、Cowork (Claude) が次回作業を始めるときに、状況をすぐ把握できるよう残しておくものです。

---

## 1. プロジェクト概要

- **サイト名**: Morse Center (日本語表記: モールスセンター、旧: モールス打) — Contest Edition
- **公開 URL**: https://jl1gix.com
- **GitHub リポジトリ**: https://github.com/JL1GIX/morseda
- **運営者**: 熊谷 (コールサイン: JL1GIX)
- **コンセプト**: アマチュア無線コンテストの CW (モールス) 交信を想定した練習ツール。

## 2. 技術構成

- **完全な静的サイト**。ビルドツール・フレームワーク・パッケージマネージャは一切なし。
- 各 HTML ファイルは **CSS と JavaScript を内包した「1ファイル完結」** の形式。`<style>` と `<script>` を分離していない。新規ファイル作成・既存ファイル編集の際もこの方針を維持すること。
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
| `rx.html` | **受信モード**。コールサイン・RST レポートをランダム生成して音で出題、ユーザーが聞き取って入力 | 約 52KB |
| `tx.html` | **送信モード**。キーボード/パドルでモールスを打つ。Iambic キーヤー対応 | 約 66KB |
| `ranking.html` | スコアランキング表示。モード別 (rx/tx) × 時間別 (1分/3分/5分) | 約 17KB |
| `morse-table.html` | モールス符号表 (リファレンス) | 約 11KB |
| `profile.html` | 運営者情報 | 約 11KB |
| `privacy.html` | プライバシーポリシー | 約 7KB |
| `contact.html` | お問い合わせ | 約 7KB |
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

---

_最終更新: 2026-05-26 (Cowork による初回作成)_

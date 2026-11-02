# appneo

最新のneoをふたばお絵かきで使いたい

## 使い方

[`bookmarklet-loader.txt`](bookmarklet-loader.txt) の1行をブックマークのURL欄に登録してください。GitHub APIで最新コミットを確認してから、jsDelivr経由でそのコミットに固定したappneoを読み込みます。

```javascript
javascript:(async()=>{const i='appneo-loader';if(document.getElementById(i))return;let v='main';try{const r=await fetch('https://api.github.com/repos/sakots/appneo/commits/main',{cache:'no-store',credentials:'omit',headers:{Accept:'application/vnd.github+json'},referrerPolicy:'no-referrer'});if(r.ok){const j=await r.json();if(typeof j.sha==='string'&&/^[0-9a-f]{40}$/.test(j.sha))v=j.sha}}catch{}const s=document.createElement('script');s.id=i;s.charset='UTF-8';s.src='https://cdn.jsdelivr.net/gh/sakots/appneo@'+v+'/appneo.js'+(v==='main'?'?v='+Date.now():'');s.onerror=()=>{s.remove();alert('appneoの読み込みに失敗しました。')};(document.head||document.documentElement).appendChild(s)})()
```

GitHub APIに接続できない場合は、jsDelivr上の `main` ブランチをキャッシュ回避パラメータ付きで読み込みます。変更を配布するには、ビルド済みの `appneo.js` と `bookmarklet-loader.txt` をGitHubへ反映してください。

PaintBBS NEO は、デフォルトで `https://oekakibbs.moe/apps/neo/` から読み込みます。
PaintBBS NEOは起動時に `funige/neo` の最新コミットを確認し、jsDelivr経由でそのコミットの `dist/neo.js` と `dist/neo.css` を読み込みます。GitHub APIへ接続できない場合は `https://oekakibbs.moe/apps/neo/` へフォールバックします。

読み込み元を変更する場合は、`appneo.js` を読み込む前に `window.APPNEO_NEO_BASE` を設定してください。実装は `src/appneo.ts` で管理しており、変更後は `pnpm run build` で配布用の `appneo.js` を生成します。

```javascript
window.APPNEO_NEO_BASE = "https://example.com/path/to/neo/";
```

## FIT（作業モード）

- `← FIT →` を押すと、編集画面をブラウザーの表示領域いっぱいに固定表示します。ブラウザー自体の全画面表示には切り替えません。
- ウィンドウサイズの変更に追従します。パレットは描画側とは独立してスクロールできます。
- 描画内容とズーム倍率は維持します。キャンバスの画像サイズは変更しません。
- `FIT解除` または `Esc` で元の配置・編集画面サイズ・ページのスクロール位置に戻ります。
- 狭い画面では操作部を潰さないよう、NEOの編集画面を最低400×460pxに保ち、描画側の領域内でスクロールできるようにします。

## 開発

```sh
pnpm install
pnpm run typecheck
pnpm run build
```

`src/appneo.ts` を編集し、`pnpm run build` で配布用の `appneo.js` と `bookmarklet-loader.txt` を更新します。

## 履歴

### [2026/11/02] v0.3.0

- FITを画面いっぱいの固定表示に変更し、ウィンドウサイズの変更に追従
- FIT解除時に元の配置・サイズ・ページのスクロール位置を復元
- FIT切り替え時のズーム倍率リセットを廃止
- `Esc` によるFIT解除に対応

### [2026/08/20] v0.2.1

- neoが読み込めなかったの修正
- npmからpnpmへ

### [2026/08/20] v0.2.0

- typescriptに移行
- neoのURL変更

### [2026/07/04] v0.1.10

- neoのURL変更

### [2026/07/04] v0.1.9

- 単体のカラーピッカー追加
- 手ブレの初期値を0に

### [2026/06/22] v0.1.8

- カラーピッカーからグラデーションを作る機能追加

### [2026/06/15] v0.1.7

- 画像投稿時に「レイヤー情報が～」を出ないようにした

### [2026/06/07] v0.1.6

- `neo.js` と `neo.css` の読み込みURLにもキャッシュ回避パラメータを付与

### [2026/06/04] v0.1.5

- ふたばの投稿成功レスポンスをエラーとして扱ってしまう問題を修正

### [2026/06/04] v0.1.4

- `div.neo-applet-paintbbs` と `Neo.param.paintbbs` による新しい起動設定に対応
- 掲示板の `url_save` と `url_exit` を絶対URLに変換

### [2026/05/19] v0.1.3

- ブックマークレット読み込み時に自動でお絵かきアプレットを起動するようにした

### [2026/05/12] v0.1.2

- パレットの色修正

### [2026/05/11] v0.1.1

- バージョン情報記載
- パレットリストの最大縦幅設定

### [2026/05/10]

- リポジトリ生やした

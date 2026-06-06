# appneo

最新のneoをふたばお絵かきで使いたい

## 使い方

ブックマークレットとして以下を実行すると、お絵かきアプレットが読み込まれます。

```javascript
javascript:(function(){const s=document.createElement('script');s.charset='UTF-8';s.src='https://neo.sakots.net/appneo.js?'+Date.now();document.head.appendChild(s);})();
```

## 履歴

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

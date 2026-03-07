## ビルド方法

```console
$ npm install
$ npm run build
```

## リリース方法

```console
$ git switch master
$ git pull
$ npm version
$ rm -rf dist && npm run build

$ cat dist/index.js | pbcopy
$ open https://scrapbox.io/customize/icon-suggestion
$ # ソースコードコーナーにクリップボードの中身をペースト

$ git push --follow-tags
```

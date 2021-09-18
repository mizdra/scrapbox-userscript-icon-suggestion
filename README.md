# scrapbox-userscript-icon-suggestion

ページ内に埋め込まれているアイコンを suggest して挿入できる UserScript。

## 使い方

[icon-suggestion - Scrapbox カスタマイズコレクション](https://scrapbox.io/customize/icon-suggestion) を参照。

## ビルド方法 (for contributor)

```console
$ yarn install
$ yarn run build
```

### npm-scripts (for contributor)

- `yarn run build`: JS のビルドを実行
- `yarn run lint`: lint や format を実行
- `yarn run test`: テストを実行

## リリース方法 (for maintainer)

```console
$ git switch master
$ git pull
$ yarn version
$ rm -rf dist && yarn run build

$ cat dist/index.js | pbcopy
$ open https://scrapbox.io/customize/icon-suggestion
$ # ソースコードコーナーにクリップボードの中身をペースト

$ git push --follow-tags
```

## 著作権情報

- `function insertText` は [scrapbox-insert-text - Scrapbox カスタマイズコレクション](https://scrapbox.io/customize/scrapbox-insert-text) を [@takker99](https://github.com/takker99) 氏の許諾を経て複製・改変しており、その著作権は[@takker99](https://github.com/takker99) 氏に帰属します
- それ以外のアプリケーションコードについては、全て [@mizdra](https://github.com/mizdra) に帰属しており、MIT License で配布されています

## Special Thanks

- [@takker99](https://github.com/takker99)
  - アイコンの挿入のロジックの実装にあたって、[scrapbox-insert-text - Scrapbox カスタマイズコレクション](https://scrapbox.io/customize/scrapbox-insert-text) を複製・改変しました
- [@yigarashi-9](https://github.com/yigarashi-9)
  - `presetIcons` の実装にあたって [@yigarashi-9](https://github.com/yigarashi-9) 氏のアイデアを拝借しました

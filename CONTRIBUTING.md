# コントリビューションガイド

コントリビューター向けのガイドです。

## リリース方法

- ```bash
  pnpm version <type>
  ```
- ```bash
  rm -rf dist && pnpm run build
  ```
- `dist/index.js` をコピーし、https://scrapbox.io/customize/icon-suggestion のソースコードコーナーに貼り付ける。
  - ```bash
    cat dist/index.js | pbcopy
    ```
- ```bash
  git push --follow-tags
  ```
- GitHub で release を作成する。
  - https://github.com/mizdra/scrapbox-userscript-icon-suggestion/releases/new

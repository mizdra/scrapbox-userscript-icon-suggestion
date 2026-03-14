# CLAUDE.md

## プロジェクト概要

Scrapbox のページ内アイコンを suggest・挿入する UserScript。略称は icon-suggestion。Preact で UI を構築し、Rolldown でバンドルして `dist/index.js` として出力する。ユーザーはビルド成果物を Scrapbox のページにコピペしてデプロイする。

## コマンド

- `npm run build` - プロダクションビルド
- `npm run lint` - lint, format
- `npm run lint-fix` - 自動修正可能な lint エラーを修正
- `npm run test` - Vitest でテスト実行（watch: false）
- `npx vitest run test/lib/icon.test.ts` - 単一テストファイルの実行

## アーキテクチャ

- **UIフレームワーク**: Preact
- **ビルド**: Rolldown で `src/index.ts` をバンドル
- **テスト**: Vitest + jsdom + @testing-library/preact

### エントリポイントと主要モジュール

- `src/index.ts` - 公開 API のエクスポート（`registerIconSuggestion`, `Icon`, matcher関数, `fetchMemberPageIcons` 等）
- `src/lib/register.tsx` - `registerIconSuggestion()`: Scrapbox のエディタ内に icon-suggestion のコンポーネントをマウントするメイン関数

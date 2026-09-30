# AGENTS.md

## プロジェクト概要

Scrapbox のページ内アイコンを suggest・挿入する UserScript。略称は icon-suggestion。Preact で UI を構築し、`vp pack` でバンドルして `dist/index.js` として出力する。ユーザーはビルド成果物を Scrapbox のページにコピペしてデプロイする。

## コマンド

- `vp pack` - プロダクションビルド
- `vp check` - format, lint, type-check
- `vp check --fix` - format と自動修正可能な lint エラーを修正
- `vp test` - Vitest でテスト実行（watch: false）
- `vp test src/lib/icon.test.ts` - 単一テストファイルの実行

## アーキテクチャ

- **UIフレームワーク**: Preact
- **ビルド**: `vp pack` (tsdown) で `src/index.ts` をバンドル
- **format / lint / テスト**: Vite+ (Oxfmt / Oxlint / Vitest)
- **テスト環境**: jsdom + @testing-library/preact

### エントリポイントと主要モジュール

- `src/index.ts` - 公開 API のエクスポート（`registerIconSuggestion`, `Icon`, matcher関数, `fetchMemberPageIcons` 等）
- `src/lib/register.tsx` - `registerIconSuggestion()`: Scrapbox のエディタ内に icon-suggestion のコンポーネントをマウントするメイン関数

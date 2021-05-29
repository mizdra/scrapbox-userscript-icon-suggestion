export type FormData = {
  query: string;
};

export type CursorPosition = {
  styleTop: number;
  styleLeft: number;
};

/**
 * `presetIcons` オプションの要素の型。
 * 要素の型には以下が利用できる。
 * - `string`
 *   - ページのパス (例: `'page'`, `'/other-project/page'`) を表す
 * - `string[]`
 *   - ページのパスの配列 (例: `['page1', 'page2']`)
 * - `() => PresetIconsItem[]`
 *   - 動的に `PresetIconsItem[]` を生成して返す関数
 * - `() => Promise<PresetIconsItem[]>`
 *   - `() => PresetIconsItem[]` の非同期版
 * */
export type PresetIconsItem = string | string[] | (() => PresetIconsItem[]) | (() => Promise<PresetIconsItem[]>);

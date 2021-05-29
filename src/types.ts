import { Icon } from './lib/icon';

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
 * - `Icon`
 *   - 例: `new Icon('project', 'page')`
 * - `Icon[]`
 *   - 例: `[new Icon('project', 'page1'), new Icon('project', 'page2')]`
 * - `() => PresetIconsItem[]`
 *   - 動的に `PresetIconsItem[]` を生成して返す関数
 * - `() => Promise<PresetIconsItem[]>`
 *   - `() => PresetIconsItem[]` の非同期版
 * */
export type PresetIconsItem =
  // TODO: 十分時間が経過したら string / string[] 型自体を PresetIconsItem に含めないようにする
  | string // @deprecated
  | string[] // @deprecated
  | Icon
  | Icon[]
  | (() => PresetIconsItem[])
  | (() => Promise<PresetIconsItem[]>);

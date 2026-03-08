import type { Icon } from './lib/icon';

export type CursorPosition = {
  styleTop: number;
  styleLeft: number;
};

/**
 * `presetIcons` オプションの要素の型
 * */
export type PresetIconsItem =
  | Icon
  | Icon[]
  | Promise<Icon | Icon[]>
  | (() => PresetIconsItem[])
  | (() => Promise<PresetIconsItem[]>);

/** matcher に渡すオプションの型 */
export type MatcherOptions = {
  /** 検索欄に入力された文字列 */
  query: string;
  /** `[...presetIcons, ...embeddedIcons]` を表すアイコンリスト。 */
  composedIcons: Icon[];
  /** プリセットアイコンのリスト */
  presetIcons: Icon[];
  /** ページに埋め込まれているアイコンのリスト */
  embeddedIcons: Icon[];
};

/** SearchablePopupMenu 内でアイテムのフィルタに利用される matcher の型 */
export type Matcher = (options: MatcherOptions) => Icon[];

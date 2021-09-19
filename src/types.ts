import { ComponentChild } from 'preact';
import { JSXInternal } from 'preact/src/jsx';
import { Icon } from './lib/icon';

export type FormData = {
  query: string;
};

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

/**
 * SearchablePopupMenu 内で利用している suggest 対象のデータを表す型
 * */
export type Item<T> = {
  key: JSXInternal.IntrinsicAttributes['key'];
  element: ComponentChild;
  searchableText: string;
  value: T;
};

/** matcher に渡すオプションの型 */
export type MatcherOptions = {
  /** 検索欄に入力された文字列 */
  query: string;
  /**
   * `showPresetIcons` が真の時は `[...presetIcons, ...embeddedIcons]` を、
   * 偽の時は `embeddedIcons` を表すアイコンリスト。
   * */
  composedIcons: Icon[];
  /** プリセットアイコンのリスト */
  presetIcons: Icon[];
  /** ページに埋め込まれているアイコンのリスト */
  embeddedIcons: Icon[];
};

/** SearchablePopupMenu 内でアイテムのフィルタに利用される matcher の型 */
export type Matcher = (options: MatcherOptions) => Icon[];

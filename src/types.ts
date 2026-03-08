import type { Icon } from './lib/icon';

export type Options = {
  /**
   * ポップアップを開くキーかどうかを判定するコールバック。キーが押下される度に呼び出される。
   * `true` ならポップアップを開くキーだと判定される。
   * */
  isLaunchIconSuggestionKey?: (e: KeyboardEvent) => boolean;
  /**
   * ポップアップを閉じるキーかどうかを判定するコールバック。キーが押下される度に呼び出される。
   * `true` ならポップアップを閉じるキーだと判定される。
   * */
  isExitIconSuggestionKey?: (e: KeyboardEvent) => boolean;
  /**
   * クエリを `[query.icon]` として挿入するかどうかを判定するコールバック。キーが押下される度に呼び出される。
   * */
  isInsertQueryAsIconKey?: (e: KeyboardEvent) => boolean;
  /** suggest に含めたいプリセットアイコンのリスト */
  presetIcons?: PresetIconsItem[];
  /**
   * suggest されたアイコンを絞り込むために利用される matcher。
   */
  matcher?: Matcher;
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

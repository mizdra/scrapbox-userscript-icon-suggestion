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

import { PresetIconsItem } from '../types';
import { Icon } from './icon';

async function evaluatePresetIconItemToPagePaths(presetIconItem: PresetIconsItem): Promise<Icon[]> {
  if (typeof presetIconItem === 'string')
    throw new Error(
      "presetIcons オプションには string 型が渡せなくなりました。今後は `new Icon('project', 'page')` を利用して下さい。",
    );
  if (presetIconItem instanceof Icon) return [presetIconItem];
  if (Array.isArray(presetIconItem)) {
    const promises = presetIconItem.map(evaluatePresetIconItemToPagePaths);
    return (await Promise.all(promises)).flat();
  }
  const presetIconItems = await presetIconItem();
  const promises = presetIconItems.map(evaluatePresetIconItemToPagePaths);
  return (await Promise.all(promises)).flat();
}

/**
 * `PresetIconItem[]` を評価して `Icon[]` に変換する関数。
 * `PresetIconItem` が関数から構成される場合は、関数呼び出しをして、その戻り値から `Icon[]` を取り出してくれる。
 * */
export async function evaluatePresetIconItemsToIcons(presetIconItems: PresetIconsItem[]): Promise<Icon[]> {
  const nestedPagePaths = await Promise.all(presetIconItems.map(evaluatePresetIconItemToPagePaths));
  return nestedPagePaths.flat();
}

import { Icon, PresetIconsItem } from '../types';
import { pagePathToIcon } from './icon';

async function evaluatePresetIconItemToPagePaths(presetIconItem: PresetIconsItem): Promise<string[]> {
  if (typeof presetIconItem === 'string') return [presetIconItem];
  if (Array.isArray(presetIconItem)) return presetIconItem;
  const presetIconItems = await presetIconItem();
  const promises = presetIconItems.map(evaluatePresetIconItemToPagePaths);
  return (await Promise.all(promises)).flat();
}

/**
 * `PresetIconItem[]` を評価して `Icon[]` に変換する関数。
 * `PresetIconItem` が関数から構成される場合は、関数呼び出しをして、その戻り値から `Icon[]` を取り出してくれる。
 * */
export async function evaluatePresetIconItemsToIcons(
  currentProjectName: string,
  presetIconItems: PresetIconsItem[],
): Promise<Icon[]> {
  const nestedPagePaths = await Promise.all(presetIconItems.map(evaluatePresetIconItemToPagePaths));
  return nestedPagePaths.flat().map((pagePath) => pagePathToIcon(currentProjectName, pagePath));
}

import type { Options, PresetIconsItem, ResolvedOptions } from '../types';
import { Icon } from './icon';
import { forwardPartialFuzzyMatcher } from './matcher';

export const DEFAULT_IS_LAUNCH_ICON_SUGGESTION_KEY = (e: KeyboardEvent) => {
  return e.key === 'l' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey;
};

export const DEFAULT_IS_EXIT_ICON_SUGGESTION_KEY = (e: KeyboardEvent) => {
  return e.key === 'Escape' && !e.ctrlKey && !e.shiftKey && !e.altKey;
};

async function evaluatePresetIconItemToPagePaths(presetIconItem: PresetIconsItem): Promise<Icon[]> {
  if (presetIconItem instanceof Icon) return [presetIconItem];
  if (Array.isArray(presetIconItem)) {
    const promises = presetIconItem.map(evaluatePresetIconItemToPagePaths);
    return (await Promise.all(promises)).flat();
  }
  if (presetIconItem instanceof Promise) {
    return evaluatePresetIconItemToPagePaths(await presetIconItem);
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

export async function resolveOptions(options?: Options): Promise<ResolvedOptions> {
  return {
    isLaunchIconSuggestionKey: options?.isLaunchIconSuggestionKey ?? DEFAULT_IS_LAUNCH_ICON_SUGGESTION_KEY,
    isExitIconSuggestionKey: options?.isExitIconSuggestionKey ?? DEFAULT_IS_EXIT_ICON_SUGGESTION_KEY,
    presetIcons: await evaluatePresetIconItemsToIcons(options?.presetIcons ?? []),
    matcher: options?.matcher ?? forwardPartialFuzzyMatcher,
  };
}

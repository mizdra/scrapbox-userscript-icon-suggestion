import { Icon } from './icon';

export function uniqueBy<T, U>(arr: T[], fn: (el: T) => U): T[] {
  const result: T[] = [];
  const keys = new Set<U>();
  for (const el of arr) {
    const key = fn(el);
    if (!keys.has(key)) {
      keys.add(key);
      result.push(el);
    }
  }
  return result;
}

/** 重複するアイコンを取り除く */
export function uniqueIcons(icons: Icon[]): Icon[] {
  return uniqueBy(icons, (icon) => icon.fullPagePath);
}

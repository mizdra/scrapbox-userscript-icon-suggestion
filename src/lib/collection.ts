import { Icon } from './icon';

export function uniqBy<T, U>(arr: T[], fn: (el: T) => U): T[] {
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
export function uniqIcons(icons: Icon[]): Icon[] {
  return uniqBy(icons, (icon) => icon.fullPagePath);
}

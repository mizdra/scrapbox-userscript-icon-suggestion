import Asearch from 'asearch';
import { Item } from '../types';

export function fuzzyMatcher<T>(query: string, items: Item<T>[]): Item<T>[] {
  const maxAambig = Math.min(Math.floor(query.length / 4) + 1, 3);
  const match = Asearch(` ${query} `); // 部分一致できるように、両端をスペースで囲む
  // あいまい度の少ない項目から順に並べる
  // 重複は除く
  const pushedItems: Set<Item<T>> = new Set();
  const result: Item<T>[] = [];
  for (let ambig = 0; ambig <= maxAambig; ambig++) {
    items.forEach((item) => {
      if (!match(item.searchableText, ambig)) return;
      if (pushedItems.has(item)) return;
      pushedItems.add(item);
      result.push(item);
    });
  }

  return result;
}

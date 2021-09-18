import Asearch from 'asearch';
import { Item } from '../types';
import { uniqBy } from './collection';

/**
 * 曖昧検索による matcher。
 * 曖昧検索で `items` をフィルタしつつ、編集距離の昇順で並べ替えて返す。
 */
export function fuzzyMatcher<T>(query: string, items: Item<T>[]): Item<T>[] {
  // query の長さが 1〜3文字までは 0 文字まで、4〜7文字までは 1 文字まで、
  // 8〜11文字までは 2 文字まで、12文字以降は 3 文字まで誤字を許容する
  const maxAambig = Math.min(Math.floor(query.length / 4), 3);
  const match = Asearch(` ${query} `); // 部分一致できるように、両端をスペースで囲む
  // あいまい度の少ない項目から順に並べる (ただし重複は除く)
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

/**
 * 前方一致による matcher。
 * 元の `items` の順序を維持しつつ、`items` を前方一致でフィルタして返す。
 * */
export function startsWithMatcher<T>(query: string, items: Item<T>[]): Item<T>[] {
  return items.filter((item) => item.searchableText.toLowerCase().startsWith(query.toLowerCase()));
}

/**
 * 部分一致による matcher。
 * 元の `items` の順序を維持しつつ、`items` を部分一致でフィルタして返す。
 * */
export function includesMatcher<T>(query: string, items: Item<T>[]): Item<T>[] {
  return items.filter((item) => item.searchableText.toLowerCase().includes(query.toLowerCase()));
}

/**
 * 前方一致、部分一致、曖昧検索を組み合わせた matcher。
 * 前方一致 > 部分一致 > 曖昧検索 の順で fallback しながらフィルタしていき、残ったものを返す。
 * */
export function combinedMatcher<T>(query: string, items: Item<T>[]): Item<T>[] {
  const newItems = [
    ...startsWithMatcher(query, items),
    ...includesMatcher(query, items),
    ...fuzzyMatcher(query, items),
  ];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return uniqBy(newItems, (item) => item.key);
}

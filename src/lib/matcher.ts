import Asearch from 'asearch';
import { MatcherOptions } from '../types';
import { uniqueIcons } from './collection';
import { Icon } from './icon';

/**
 * 曖昧一致による matcher。
 * 曖昧一致で `composedIcons` をフィルタしつつ、編集距離の昇順で並べ替えて返す。
 */
export function fuzzyMatcher({ query, composedIcons }: MatcherOptions): Icon[] {
  // query の長さが 0〜2 なら 0 文字まで、3〜5 なら 1 文字まで、
  // 6〜8 なら 2 文字まで、9 以上なら 3 文字まで誤字を許容する
  const maxAambig = Math.min(Math.floor(query.length / 3), 3);
  const match = Asearch(` ${query} `); // 部分一致できるように、両端をスペースで囲む
  // あいまい度の少ない項目から順に並べる
  const newIcons: Icon[] = [];
  for (let ambig = 0; ambig <= maxAambig; ambig++) {
    for (const icon of composedIcons) {
      if (match(icon.pageTitle, ambig)) newIcons.push(icon);
    }
  }
  // 重複は除く
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return uniqueIcons(newIcons);
}

/**
 * 前方一致による matcher。
 * 元の `composedIcons` の順序を維持しつつ、`composedIcons` を前方一致でフィルタして返す。
 * */
export function forwardMatcher({ query, composedIcons }: MatcherOptions): Icon[] {
  return composedIcons.filter((icon) => icon.pageTitle.toLowerCase().startsWith(query.toLowerCase()));
}

/**
 * 部分一致による matcher。
 * 元の `composedIcons` の順序を維持しつつ、`composedIcons` を部分一致でフィルタして返す。
 * */
export function partialMatcher({ query, composedIcons }: MatcherOptions): Icon[] {
  return composedIcons.filter((icon) => icon.pageTitle.toLowerCase().includes(query.toLowerCase()));
}

/**
 * 前方一致、部分一致、曖昧一致を組み合わせた matcher。
 * 前方一致 > 部分一致 > 曖昧一致 の順で fallback しながらフィルタしていき、残ったものを返す。
 * */
export function forwardPartialFuzzyMatcher(options: MatcherOptions): Icon[] {
  const newIcons = [...forwardMatcher(options), ...partialMatcher(options), ...fuzzyMatcher(options)];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return uniqueIcons(newIcons);
}

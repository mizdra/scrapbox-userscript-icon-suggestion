import { forwardPartialFuzzyMatcher } from '../lib/matcher';
import {
  DEFAULT_IS_EXIT_ICON_SUGGESTION_KEY,
  DEFAULT_IS_INSERT_QUERY_AS_ICON_KEY,
  DEFAULT_IS_LAUNCH_ICON_SUGGESTION_KEY,
} from '../lib/options';
import type { ResolvedOptions } from '../types';

export function fakeResolvedOptions(args?: Partial<ResolvedOptions>): ResolvedOptions {
  return {
    isLaunchIconSuggestionKey: DEFAULT_IS_LAUNCH_ICON_SUGGESTION_KEY,
    isExitIconSuggestionKey: DEFAULT_IS_EXIT_ICON_SUGGESTION_KEY,
    isInsertQueryAsIconKey: DEFAULT_IS_INSERT_QUERY_AS_ICON_KEY,
    presetIcons: [],
    matcher: forwardPartialFuzzyMatcher,
    ...args,
  };
}

import { render } from 'preact';
import { App } from './App';
import { pagePathToIcon } from './lib/icon';
import { Icon } from './types';

const editor = document.querySelector<HTMLElement>('.editor')!;

type Options = {
  isSuggestionOpenKeyDown?: (e: KeyboardEvent) => boolean;
  // `string` is `pagePath`
  presetIcons?: string[];
};

const DEFAULT_IS_SUGEGSTION_OPEN_KEY_DOWN = (e: KeyboardEvent) => {
  return e.key === 'l' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey;
};

export function registerIconSuggestion(options?: Options) {
  // 直接 editor に mount すると scrapbox 側の react renderer と干渉して壊れるので、
  // editor 内に差し込んだ container に mount する
  const container = document.createElement('div');
  editor.appendChild(container);

  const presetIcons: Icon[] = (options?.presetIcons ?? []).map((pagePath) =>
    pagePathToIcon(scrapbox.Project.name, pagePath),
  );

  render(
    <App
      isSuggestionOpenKeyDown={options?.isSuggestionOpenKeyDown ?? DEFAULT_IS_SUGEGSTION_OPEN_KEY_DOWN}
      presetIcons={presetIcons}
    />,
    container,
  );
}

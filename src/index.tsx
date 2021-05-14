import { render } from 'preact';
import { App } from './App';
import { pagePathToIcon } from './lib/icon';
import { getEditor } from './lib/scrapbox';

type Options = {
  isSuggestionOpenKeyDown?: (e: KeyboardEvent) => boolean;
  // `string` is `pagePath`
  presetIcons?: string[];
  editor?: HTMLElement;
  textInput?: HTMLTextAreaElement;
  cursor?: HTMLElement;
  scrapbox?: Scrapbox;
};

export function registerIconSuggestion(options?: Options) {
  // 直接 editor に mount すると scrapbox 側の react renderer と干渉して壊れるので、
  // editor 内に差し込んだ container に mount する
  const container = document.createElement('div');
  const editor = options?.editor ?? getEditor();
  editor.appendChild(container);

  const presetIcons = options?.presetIcons?.map((pagePath) => pagePathToIcon(scrapbox.Project.name, pagePath));

  render(
    <App
      isSuggestionOpenKeyDown={options?.isSuggestionOpenKeyDown}
      presetIcons={presetIcons}
      editor={editor}
      textInput={options?.textInput}
      cursor={options?.cursor}
      scrapbox={options?.scrapbox}
    />,
    container,
  );
}

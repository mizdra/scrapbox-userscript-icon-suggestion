import { render } from 'preact';
import { App } from './App';

type Options = {
  isSuggestionOpenKeyDown?: (e: KeyboardEvent) => boolean;
};

const DEFAULT_IS_SUGEGSTION_OPEN_KEY_DOWN = (e: KeyboardEvent) => {
  return e.key === 'l' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey;
};

export function registerIconSuggestion(options?: Options) {
  const editor = document.querySelector<HTMLElement>('.editor');
  const textInput = document.querySelector<HTMLElement>('#text-input');

  if (!editor) throw new Error('.editor が存在しません');
  if (!textInput) throw new Error('#text-input が存在しません');

  render(
    <App
      textInput={textInput}
      editor={editor}
      isSuggestionOpenKeyDown={options?.isSuggestionOpenKeyDown ?? DEFAULT_IS_SUGEGSTION_OPEN_KEY_DOWN}
    />,
    editor,
  );
}

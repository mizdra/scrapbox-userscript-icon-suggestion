import { App } from './App';

type Options = {
  isSuggestionOpenKeyDown?: (e: KeyboardEvent) => boolean;
};

const DEFAULT_IS_SUGEGSTION_OPEN_KEY_DOWN = (e: KeyboardEvent) => {
  return e.key === 'l' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey;
};

export function registerIconSuggestion(props?: Options) {
  const editor = document.querySelector<HTMLElement>('.editor');
  const textInput = document.querySelector<HTMLElement>('#text-input');

  if (!editor) throw new Error('.editor が存在しません');
  if (!textInput) throw new Error('#text-input が存在しません');

  editor.append(
    <>
      <style>
        {`
        .icon-suggestion {
          position: absolute;
          top: 50px;
          left: 50px;
          z-index: 999;
        }
        .hidden {
          display: none;
        }
        `}
      </style>
      <App
        textInput={textInput}
        editor={editor}
        isSuggestionOpenKeyDown={props?.isSuggestionOpenKeyDown ?? DEFAULT_IS_SUGEGSTION_OPEN_KEY_DOWN}
      />
    </>,
  );
}

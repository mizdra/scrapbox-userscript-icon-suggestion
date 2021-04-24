import { FunctionComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { SuggestionBox } from './components/SuggestionBox';
import { useDocumentEventListener } from './hooks/useDocumentEventListener';
import { calcCursorPosition } from './lib/scrapbox';
import { CursorPosition, Icon } from './types';

type AppProps = {
  isSuggestionOpenKeyDown: (e: KeyboardEvent) => boolean;
  editor: HTMLElement;
  textInput: HTMLElement;
};

export const App: FunctionComponent<AppProps> = ({ isSuggestionOpenKeyDown, editor, textInput }) => {
  const [opened, setOpened] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ left: 0, styleTop: 0, styleLeft: 0 });

  const handleIconSelect = useCallback(
    (icon: Icon) => {
      setOpened(false);
      textInput.focus();
      document.execCommand('insertText', undefined, `[${icon.pagePath}.icon]`);
    },
    [textInput],
  );

  const handleClose = useCallback(() => {
    setOpened(false);
    textInput.focus();
  }, [textInput]);

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      const isSuggestionOpen = isSuggestionOpenKeyDown(e);
      if (!opened && isSuggestionOpen) {
        e.preventDefault();
        e.stopPropagation();
        const cursorPosition = calcCursorPosition(window, document.querySelector<HTMLElement>('.cursor')!);
        setCursorPosition(cursorPosition);
        setOpened(true);
      }
    },
    [isSuggestionOpenKeyDown, opened],
  );
  useDocumentEventListener('keydown', handleKeydown, { capture: true });

  return (
    <div>
      {opened && <SuggestionBox cursorPosition={cursorPosition} onSelect={handleIconSelect} onClose={handleClose} />}
    </div>
  );
};

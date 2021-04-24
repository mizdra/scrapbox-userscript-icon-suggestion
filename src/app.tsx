import { FunctionComponent } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { SuggestionBox } from './components/SuggestionBox';
import { useDocumentEventListener } from './hooks/useDocumentEventListener';

type AppProps = {
  isSuggestionOpenKeyDown: (e: KeyboardEvent) => boolean;
  editor: HTMLElement;
  textInput: HTMLElement;
};

export const App: FunctionComponent<AppProps> = ({ isSuggestionOpenKeyDown, editor, textInput }) => {
  const [opened, setOpened] = useState(false);

  const handleIconSelect = useCallback(
    (iconPath: string) => {
      setOpened(false);
      textInput.focus();
      document.execCommand('insertText', undefined, `[${iconPath}.icon]`);
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
        setOpened(true);
      }
    },
    [isSuggestionOpenKeyDown, opened],
  );
  useDocumentEventListener('keydown', handleKeydown, { capture: true });

  return <div>{opened && <SuggestionBox onSelect={handleIconSelect} onClose={handleClose} />}</div>;
};

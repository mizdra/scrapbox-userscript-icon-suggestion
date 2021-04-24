import { FunctionComponent } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { SuggestionBox } from './components/SuggestionBox';

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

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const isSuggestionOpen = isSuggestionOpenKeyDown(e);
      if (!opened && isSuggestionOpen) {
        if (isSuggestionOpen) {
          e.preventDefault();
          e.stopPropagation();
          setOpened(true);
        }
      }
    };
    document.addEventListener('keydown', handleKeydown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeydown, { capture: true });
  });

  return <div>{opened && <SuggestionBox onSelect={handleIconSelect} onClose={handleClose} />}</div>;
};

import { FunctionComponent } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { SuggestionBox } from './components/SuggestionBox';

type AppProps = {
  isSuggestionOpenKeyDown: (e: KeyboardEvent) => boolean;
  editor: HTMLElement;
  textInput: HTMLElement;
};

export const App: FunctionComponent<AppProps> = (props) => {
  const [opened, setOpened] = useState(false);

  const handleIconSelect = useCallback((iconPath: string) => {
    setOpened(false);
    requestAnimationFrame(() => {
      document.execCommand('insertText', undefined, iconPath);
    });
  }, []);

  const handleClose = useCallback(() => {
    setOpened(false);
  }, []);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const isSuggestionOpenKeyDown = props.isSuggestionOpenKeyDown(e);
      if (!opened && isSuggestionOpenKeyDown) {
        if (isSuggestionOpenKeyDown) {
          e.preventDefault();
          e.stopPropagation();
          setOpened(true);
        }
      }
    };
    document.addEventListener('keydown', handleKeydown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeydown);
  });

  return <div>{opened && <SuggestionBox onSelect={handleIconSelect} onClose={handleClose} />}</div>;
};

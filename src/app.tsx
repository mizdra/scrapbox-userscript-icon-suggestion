import { useClassList, useRef } from 'jsx-dom';
import { SuggestionBox, SuggestionBoxHandler } from './components/SuggestionBox';

type AppProps = {
  isSuggestionOpenKeyDown: (e: KeyboardEvent) => boolean;
  editor: HTMLElement;
  textInput: HTMLElement;
};

export const App = (props: AppProps) => {
  const cls = useClassList(['icon-suggestion', 'hidden']);
  const suggestionBoxRef = useRef<SuggestionBoxHandler>(null);

  document.addEventListener(
    'keydown',
    (e) => {
      const isSuggestionOpenKeyDown = props.isSuggestionOpenKeyDown(e);
      if (cls.contains('hidden') && isSuggestionOpenKeyDown) {
        if (isSuggestionOpenKeyDown) {
          e.preventDefault();
          e.stopPropagation();
          cls.remove('hidden');
          console.log({ suggestionBoxRef });
          console.log(suggestionBoxRef.current);
          suggestionBoxRef.current?.open();
        }
      }
    },
    { capture: true },
  );

  const onSelect = (iconPath: string) => {
    props.textInput.focus();
    document.execCommand('insertText', undefined, `[${iconPath}.icon]`);
    suggestionBoxRef.current?.close();
  };
  const onClose = () => {
    cls.add('hidden');
    props.textInput.focus();
  };

  return (
    <div className={cls}>
      <SuggestionBox rref={suggestionBoxRef} onSelect={onSelect} onClose={onClose} />
    </div>
  );
};

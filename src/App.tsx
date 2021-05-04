import { FunctionComponent } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';
import { SuggestionBox, Item } from './components/SuggestionBox';
import { useDocumentEventListener } from './hooks/useDocumentEventListener';
import { uniqBy } from './lib/collection';
import { calcCursorPosition, insertText, scanIconsFromEditor } from './lib/scrapbox';
import { CursorPosition, Icon } from './types';

const cursor = document.querySelector<HTMLElement>('.cursor')!;

function uniqueIcons(icons: Icon[]): Icon[] {
  return uniqBy(icons, (icon) => icon.pagePath);
}

function generateItem(icon: Icon): Item {
  return {
    element: (
      <span>
        <img
          alt={icon.imgAlt}
          title={icon.imgTitle}
          style="width: 1.3em; height: 1.3em; object-fit: contain;"
          src={icon.imgSrc}
        />
        {' ' + icon.pagePath}
      </span>
    ),
    searchableText: icon.pagePath,
  };
}

type AppProps = {
  isSuggestionOpenKeyDown: (e: KeyboardEvent) => boolean;
  presetIcons: Icon[];
  editor: HTMLElement;
  textInput: HTMLTextAreaElement;
};

export const App: FunctionComponent<AppProps> = ({ isSuggestionOpenKeyDown, presetIcons, editor, textInput }) => {
  const [open, setOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ styleTop: 0, styleLeft: 0 });
  const [suggestibleIcons, setSuggestibleIcons] = useState<Icon[]>([]);
  const suggestBoxItems = useMemo(() => suggestibleIcons.map(generateItem), [suggestibleIcons]);
  const [presetAppended, setPresetAppended] = useState(false);

  const handleSelect = useCallback(
    (_item: Item, index: number) => {
      setOpen(false);
      insertText(textInput, suggestibleIcons[index].notation);
    },
    [suggestibleIcons, textInput],
  );

  const handleSelectNonexistent = useCallback(
    (query: string) => {
      setOpen(false);
      insertText(textInput, `[${query}.icon]`);
    },
    [textInput],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    textInput.focus();
  }, [textInput]);

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (!isSuggestionOpenKeyDown(e)) return;
      e.preventDefault();
      e.stopPropagation();

      if (open && !presetAppended) {
        setSuggestibleIcons(uniqueIcons([...suggestibleIcons, ...presetIcons]));
        setPresetAppended(true);
      } else {
        const icons = scanIconsFromEditor(scrapbox.Project.name, editor);
        setCursorPosition(calcCursorPosition(cursor));

        // NOTE: ある行にフォーカスがあると、行全体がテキスト化されてしまい、`scanIconsFromEditor` で
        // アイコンを取得することができなくなってしまう。そのため、予めフォーカスを外し、フォーカスのあった
        // 行のアイコン記法が画像化されるようにしておく。
        textInput.blur();
        setSuggestibleIcons(uniqueIcons(icons));
        setOpen(true);
        setPresetAppended(false);
      }
    },
    [editor, isSuggestionOpenKeyDown, open, presetAppended, presetIcons, suggestibleIcons, textInput],
  );
  useDocumentEventListener('keydown', handleKeydown, { capture: true });

  return (
    <SuggestionBox
      open={open}
      emptyMessage="キーワードにマッチするアイコンがありません"
      items={suggestBoxItems}
      cursorPosition={cursorPosition}
      onSelect={handleSelect}
      onSelectNonexistent={handleSelectNonexistent}
      onClose={handleClose}
    />
  );
};

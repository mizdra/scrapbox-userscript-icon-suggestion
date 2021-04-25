import { FunctionComponent, VNode } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Item } from './components/PopupMenu';
import { SuggestionBox } from './components/SuggestionBox';
import { useDocumentEventListener } from './hooks/useDocumentEventListener';
import { uniqBy } from './lib/collection';
import { calcCursorPosition, scanIconsFromEditor } from './lib/scrapbox';
import { CursorPosition, Icon } from './types';

const cursor = document.querySelector<HTMLElement>('.cursor')!;

function generateItems(icons: Icon[]) {
  return uniqBy(icons, (icon) => icon.pagePath).map((icon) => ({
    element: (
      <span>
        <img
          alt={icon.imgAlt}
          title={icon.imgTitle}
          style="width: 1.3em; height: 1.3em; object-fit: contain;"
          src={icon.imgSrc}
        />
        {' ' + decodeURI(icon.pagePath)}
      </span>
    ),
    searchableText: icon.pagePath,
    value: icon,
  }));
}

type AppProps = {
  isSuggestionOpenKeyDown: (e: KeyboardEvent) => boolean;
  presetIcons: Icon[];
  editor: HTMLElement;
  textInput: HTMLElement;
};

export const App: FunctionComponent<AppProps> = ({ isSuggestionOpenKeyDown, presetIcons, editor, textInput }) => {
  const [open, setOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ left: 0, styleTop: 0, styleLeft: 0 });
  const [items, setItems] = useState<Item<VNode, Icon>[]>([]);
  const [presetAppended, setPresetAppended] = useState(false);

  const handleSelect = useCallback(
    (item: Item<VNode, Icon>) => {
      setOpen(false);
      textInput.focus();
      document.execCommand('insertText', undefined, `[${item.value.pagePath}.icon]`);
    },
    [textInput],
  );

  const handleSelectNonexistent = useCallback(
    (query: string) => {
      setOpen(false);
      textInput.focus();
      document.execCommand('insertText', undefined, `[${query}.icon]`);
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

      const icons = scanIconsFromEditor(scrapbox.Project.name, editor);

      if (open && !presetAppended) {
        setItems([...items, ...generateItems(presetIcons)]);
        setPresetAppended(true);
      } else {
        setCursorPosition(calcCursorPosition(window, cursor));

        // NOTE: ある行にフォーカスがあると、行全体がテキスト化されてしまい、`scanIconsFromEditor` で
        // アイコンを取得することができなくなってしまう。そのため、予めフォーカスを外し、フォーカスのあった
        // 行のアイコン記法が画像化されるようにしておく。
        textInput.blur();
        setItems(generateItems(icons));
        setOpen(true);
        setPresetAppended(false);
      }
    },
    [editor, isSuggestionOpenKeyDown, items, open, presetAppended, presetIcons, textInput],
  );
  useDocumentEventListener('keydown', handleKeydown, { capture: true });

  return (
    <SuggestionBox
      open={open}
      emptyMessage="キーワードにマッチするアイコンがありません"
      items={items}
      cursorPosition={cursorPosition}
      onSelect={handleSelect}
      onSelectNonexistent={handleSelectNonexistent}
      onClose={handleClose}
    />
  );
};

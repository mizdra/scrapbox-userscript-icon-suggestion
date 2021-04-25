import { FunctionComponent, VNode } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Item } from './components/PopupMenu';
import { SuggestionBox } from './components/SuggestionBox';
import { useDocumentEventListener } from './hooks/useDocumentEventListener';
import { uniqBy } from './lib/collection';
import { calcCursorPosition, scanIconsFromEditor } from './lib/scrapbox';
import { CursorPosition, Icon } from './types';

type AppProps = {
  isSuggestionOpenKeyDown: (e: KeyboardEvent) => boolean;
  editor: HTMLElement;
  textInput: HTMLElement;
};

export const App: FunctionComponent<AppProps> = ({ isSuggestionOpenKeyDown, editor, textInput }) => {
  const [open, setOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ left: 0, styleTop: 0, styleLeft: 0 });
  const [items, setItems] = useState<Item<VNode, Icon>[]>([]);

  const handleIconSelect = useCallback(
    (item: Item<VNode, Icon>) => {
      setOpen(false);
      textInput.focus();
      document.execCommand('insertText', undefined, `[${item.value.pagePath}.icon]`);
    },
    [textInput],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    textInput.focus();
  }, [textInput]);

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      const isSuggestionOpen = isSuggestionOpenKeyDown(e);
      if (!open && isSuggestionOpen) {
        e.preventDefault();
        e.stopPropagation();
        const cursorPosition = calcCursorPosition(window, document.querySelector<HTMLElement>('.cursor')!);
        setCursorPosition(cursorPosition);

        const projectName = scrapbox.Project.name;
        const icons = scanIconsFromEditor(projectName, editor);
        const newItems = uniqBy(icons, (icon) => icon.pagePath).map((icon) => ({
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
          value: icon,
        }));
        setItems(newItems);

        // NOTE: ある行にフォーカスがあると、行全体がテキスト化されてしまい、`scanIconsFromEditor` で
        // アイコンを取得することができなくなってしまう。そのため、予めフォーカスを外し、フォーカスのあった
        // 行のアイコン記法が画像化されるようにしておく。
        textInput.blur();
        requestAnimationFrame(() => {
          setOpen(true);
        });
      }
    },
    [editor, isSuggestionOpenKeyDown, open, textInput],
  );
  useDocumentEventListener('keydown', handleKeydown, { capture: true });

  return (
    <SuggestionBox
      open={open}
      emptyMessage="キーワードにマッチするアイコンがありません"
      items={items}
      cursorPosition={cursorPosition}
      onSelect={handleIconSelect}
      onSelectNonexistent={() => {}}
      onClose={handleClose}
    />
  );
};

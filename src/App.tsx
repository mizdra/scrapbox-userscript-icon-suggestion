import { FunctionComponent } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';
import { SuggestionBox, Item } from './components/SuggestionBox';
import { useDocumentEventListener } from './hooks/useDocumentEventListener';
import { useScrapbox } from './hooks/useScrapbox';
import { uniqBy } from './lib/collection';
import { calcCursorPosition, insertText, scanIconsFromEditor } from './lib/scrapbox';
import { CursorPosition, Icon } from './types';

const DEFAULT_IS_SUGGESTION_OPEN_KEY_DOWN = (e: KeyboardEvent) => {
  return e.key === 'l' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey;
};

function toItem(icon: Icon): Item<Icon> {
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
    value: icon,
  };
}

export type AppProps = {
  isSuggestionOpenKeyDown?: (e: KeyboardEvent) => boolean;
  presetIcons?: Icon[];
};

export const App: FunctionComponent<AppProps> = ({
  isSuggestionOpenKeyDown = DEFAULT_IS_SUGGESTION_OPEN_KEY_DOWN,
  presetIcons = [],
}) => {
  const { textInput, cursor, editor, scrapbox } = useScrapbox();
  const [open, setOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ styleTop: 0, styleLeft: 0 });
  const [editorIcons, setEditorIcons] = useState<Icon[]>([]);
  const [suggestPresetIcons, setSuggestPresetIcons] = useState(false);
  const items = useMemo(() => {
    const icons = suggestPresetIcons ? [...editorIcons, ...presetIcons] : editorIcons;
    return uniqBy(icons, (icon) => icon.pagePath).map(toItem);
  }, [editorIcons, suggestPresetIcons, presetIcons]);

  const handleSelect = useCallback(
    (item: Item<Icon>) => {
      setOpen(false);
      insertText(textInput, item.value.notation);
    },
    [textInput],
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
      if (scrapbox.Layout !== 'page') return; // エディタのあるページ以外ではキー入力を無視する
      if (cursor.style.display === 'none') return; // エディタのあるページでも、エディタにフォーカスが無ければキー入力を無視する
      if (!isSuggestionOpenKeyDown(e)) return;
      e.preventDefault();
      e.stopPropagation();

      if (!open) {
        // ポップアップが閉じていたら開く
        setCursorPosition(calcCursorPosition(cursor));

        // NOTE: ある行にフォーカスがあると、行全体がテキスト化されてしまい、`scanIconsFromEditor` で
        // アイコンを取得することができなくなってしまう。そのため、予めフォーカスを外し、フォーカスのあった
        // 行のアイコン記法が画像化されるようにしておく。
        textInput.blur();
        // 画像化されたらエディタを走査してアイコンを収集
        const newEditorIcons = scanIconsFromEditor(scrapbox.Project.name, editor);

        setEditorIcons(newEditorIcons);
        setOpen(true);
        setSuggestPresetIcons(false);
      } else {
        // ポップアップが開いていたら、preset icon の表示・非表示をトグルする
        setSuggestPresetIcons((presetAppended) => !presetAppended);
      }
    },
    [cursor, editor, isSuggestionOpenKeyDown, open, scrapbox.Layout, scrapbox.Project.name, textInput],
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

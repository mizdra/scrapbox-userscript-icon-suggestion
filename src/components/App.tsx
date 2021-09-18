import { FunctionComponent } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';
import { useDocumentEventListener } from '../hooks/useDocumentEventListener';
import { useScrapbox } from '../hooks/useScrapbox';
import { uniqBy } from '../lib/collection';
import { hasDuplicatedPageTitle, Icon } from '../lib/icon';
import { isComposing } from '../lib/key';
import { calcCursorPosition, insertText, scanIconsFromEditor } from '../lib/scrapbox';
import { CursorPosition, Matcher } from '../types';
import { SuggestionBox, Item } from './SuggestionBox';

const DEFAULT_IS_SUGGESTION_OPEN_KEY_DOWN = (e: KeyboardEvent) => {
  return e.key === 'l' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey;
};

const DEFAULT_IS_INSERT_QUERY_KEY_DOWN = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && e.altKey && !e.metaKey) return true;
  if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey && e.metaKey) return true;
  return false;
};

function toItem(icon: Icon, icons: Icon[]): Item<Icon> {
  // 基本的にプロジェクト名は省略して表示。
  // 同名のページタイトルのアイコンが他にある場合は、プロジェクト名も括弧付きで表示。
  const label = hasDuplicatedPageTitle(icon, icons) ? `${icon.pageTitle} (${icon.projectName})` : icon.pageTitle;
  return {
    key: icon.fullPagePath,
    element: (
      <span>
        <img
          alt={icon.imgAlt}
          title={icon.imgTitle}
          style="width: 1.3em; height: 1.3em; object-fit: contain;"
          src={icon.imgSrc}
        />{' '}
        <span data-testid="suggested-icon-label">{label}</span>
      </span>
    ),
    searchableText: label,
    value: icon,
  };
}

export type AppProps = {
  isSuggestionOpenKeyDown?: (e: KeyboardEvent) => boolean;
  isSuggestionCloseKeyDown?: (e: KeyboardEvent) => boolean;
  isInsertQueryKeyDown?: (e: KeyboardEvent) => boolean;
  presetIcons?: Icon[];
  defaultSuggestPresetIcons?: boolean;
  matcher?: Matcher<Icon>;
};

export const App: FunctionComponent<AppProps> = ({
  isSuggestionOpenKeyDown = DEFAULT_IS_SUGGESTION_OPEN_KEY_DOWN,
  isSuggestionCloseKeyDown,
  isInsertQueryKeyDown = DEFAULT_IS_INSERT_QUERY_KEY_DOWN,
  presetIcons = [],
  defaultSuggestPresetIcons = false,
  matcher,
}) => {
  const { textInput, cursor, editor, layout, projectName } = useScrapbox();

  const [open, setOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ styleTop: 0, styleLeft: 0 });
  const [editorIcons, setEditorIcons] = useState<Icon[]>([]);
  const [suggestPresetIcons, setSuggestPresetIcons] = useState(defaultSuggestPresetIcons);
  const items = useMemo(() => {
    const icons = suggestPresetIcons ? [...editorIcons, ...presetIcons] : editorIcons;
    const suggestedIcons = uniqBy(icons, (icon) => icon.getShortPagePath(projectName));

    return suggestedIcons.map((icon) => toItem(icon, icons));
  }, [suggestPresetIcons, editorIcons, presetIcons, projectName]);
  const [query, setQuery] = useState('');

  const handleSelect = useCallback(
    (item: Item<Icon>) => {
      setOpen(false);
      insertText(textInput, item.value.getNotation(projectName));
    },
    [projectName, textInput],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    textInput.focus();
  }, [textInput]);

  const handleSuggestionOpenKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (layout !== 'page') return; // エディタのあるページ以外ではキー入力を無視する
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
        const newEditorIcons = scanIconsFromEditor(projectName, editor);

        setEditorIcons(newEditorIcons);
        setOpen(true);
        setSuggestPresetIcons(defaultSuggestPresetIcons);
      } else {
        // ポップアップが開いていたら、preset icon の表示・非表示をトグルする
        setSuggestPresetIcons((suggestPresetIcons) => !suggestPresetIcons);
      }
    },
    [cursor, defaultSuggestPresetIcons, editor, open, layout, projectName, textInput],
  );

  const handleInsertQueryKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (layout !== 'page') return; // エディタのあるページ以外ではキー入力を無視する
      if (!open) return; // ポップアップが閉じていたら無視する
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      insertText(textInput, `[${query}.icon]`);
    },
    [layout, open, textInput, query],
  );

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (isComposing(e)) return; // IMEによる変換中は何もしない
      if (isSuggestionOpenKeyDown(e)) {
        handleSuggestionOpenKeyDown(e);
      } else if (isInsertQueryKeyDown(e)) {
        handleInsertQueryKeyDown(e);
      }
    },
    [isSuggestionOpenKeyDown, isInsertQueryKeyDown, handleSuggestionOpenKeyDown, handleInsertQueryKeyDown],
  );
  useDocumentEventListener('keydown', handleKeydown, { capture: true });

  return (
    <SuggestionBox
      open={open}
      emptyMessage="キーワードにマッチするアイコンがありません"
      items={items}
      cursorPosition={cursorPosition}
      matcher={matcher}
      onSelect={handleSelect}
      onClose={handleClose}
      onInputQuery={setQuery}
      isSuggestionCloseKeyDown={isSuggestionCloseKeyDown}
    />
  );
};

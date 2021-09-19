import { FunctionComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { forwardPartialFuzzyMatcher } from '..';
import { useDocumentEventListener } from '../hooks/useDocumentEventListener';
import { useScrapbox } from '../hooks/useScrapbox';
import { uniqueIcons } from '../lib/collection';
import { Icon } from '../lib/icon';
import { isComposing } from '../lib/key';
import { calcCursorPosition, insertText, scanEmbeddedIcons } from '../lib/scrapbox';
import { CursorPosition, Matcher } from '../types';
import { SearchablePopupMenu } from './SearchablePopupMenu';

const DEFAULT_IS_SUGGESTION_OPEN_KEY_DOWN = (e: KeyboardEvent) => {
  return e.key === 'l' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey;
};

const DEFAULT_IS_INSERT_QUERY_KEY_DOWN = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && e.altKey && !e.metaKey) return true;
  if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey && e.metaKey) return true;
  return false;
};

export type AppProps = {
  isSuggestionOpenKeyDown?: (e: KeyboardEvent) => boolean;
  isSuggestionCloseKeyDown?: (e: KeyboardEvent) => boolean;
  isInsertQueryKeyDown?: (e: KeyboardEvent) => boolean;
  presetIcons?: Icon[];
  defaultSuggestPresetIcons?: boolean;
  matcher?: Matcher;
};

export const App: FunctionComponent<AppProps> = ({
  isSuggestionOpenKeyDown = DEFAULT_IS_SUGGESTION_OPEN_KEY_DOWN,
  isSuggestionCloseKeyDown,
  isInsertQueryKeyDown = DEFAULT_IS_INSERT_QUERY_KEY_DOWN,
  presetIcons = [],
  defaultSuggestPresetIcons = true,
  matcher = forwardPartialFuzzyMatcher,
}) => {
  const { textInput, cursor, editor, layout, projectName } = useScrapbox();

  const [open, setOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ styleTop: 0, styleLeft: 0 });
  const [embeddedIcons, setEmbeddedIcons] = useState<Icon[]>([]);
  const [suggestPresetIcons, setSuggestPresetIcons] = useState(defaultSuggestPresetIcons);
  const composedMatcher = useCallback(
    (query: string) => {
      const composedIcons = uniqueIcons(suggestPresetIcons ? [...embeddedIcons, ...presetIcons] : embeddedIcons);
      return matcher({ query, composedIcons, presetIcons, embeddedIcons });
    },
    [embeddedIcons, matcher, presetIcons, suggestPresetIcons],
  );
  const [query, setQuery] = useState('');

  const handleSelect = useCallback(
    (icon: Icon) => {
      setOpen(false);
      insertText(textInput, icon.getNotation(projectName));
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

        // NOTE: ある行にフォーカスがあると、行全体がテキスト化されてしまい、`scanEmbeddedIcons` で
        // アイコンを取得することができなくなってしまう。そのため、予めフォーカスを外し、フォーカスのあった
        // 行のアイコン記法が画像化されるようにしておく。
        textInput.blur();
        // 画像化されたらエディタを走査してアイコンを収集
        const newEmbeddedIcons = scanEmbeddedIcons(projectName, editor);

        setEmbeddedIcons(newEmbeddedIcons);
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
    <SearchablePopupMenu
      open={open}
      emptyMessage="キーワードにマッチするアイコンがありません"
      cursorPosition={cursorPosition}
      matcher={composedMatcher}
      onSelect={handleSelect}
      onClose={handleClose}
      onInputQuery={setQuery}
      isSuggestionCloseKeyDown={isSuggestionCloseKeyDown}
    />
  );
};

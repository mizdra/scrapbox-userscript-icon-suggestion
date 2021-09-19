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

const DEFAULT_IS_LAUNCH_ICON_SUGGESTION_KEY = (e: KeyboardEvent) => {
  return e.key === 'l' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey;
};

const DEFAULT_IS_INSERT_QUERY_AS_ICON_KEY = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && e.altKey && !e.metaKey) return true;
  if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey && e.metaKey) return true;
  return false;
};

export type AppProps = {
  isLaunchIconSuggestionKey?: (e: KeyboardEvent) => boolean;
  isExitIconSuggestionKey?: (e: KeyboardEvent) => boolean;
  isInsertQueryAsIconKey?: (e: KeyboardEvent) => boolean;
  presetIcons?: Icon[];
  defaultIsShownPresetIcons?: boolean;
  matcher?: Matcher;
};

export const App: FunctionComponent<AppProps> = ({
  isLaunchIconSuggestionKey = DEFAULT_IS_LAUNCH_ICON_SUGGESTION_KEY,
  isExitIconSuggestionKey,
  isInsertQueryAsIconKey = DEFAULT_IS_INSERT_QUERY_AS_ICON_KEY,
  presetIcons = [],
  defaultIsShownPresetIcons = true,
  matcher = forwardPartialFuzzyMatcher,
}) => {
  const { textInput, cursor, editor, layout, projectName } = useScrapbox();

  const [open, setOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ styleTop: 0, styleLeft: 0 });
  const [embeddedIcons, setEmbeddedIcons] = useState<Icon[]>([]);
  const [isShownPresetIcons, setIsShownPresetIcons] = useState(defaultIsShownPresetIcons);
  const composedMatcher = useCallback(
    (query: string) => {
      const composedIcons = uniqueIcons(isShownPresetIcons ? [...embeddedIcons, ...presetIcons] : embeddedIcons);
      return matcher({ query, composedIcons, presetIcons, embeddedIcons });
    },
    [embeddedIcons, matcher, presetIcons, isShownPresetIcons],
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

  const handleLaunchIconSuggestionKeyDown = useCallback(
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
        setIsShownPresetIcons(defaultIsShownPresetIcons);
      } else {
        // ポップアップが開いていたら、preset icon の表示・非表示をトグルする
        setIsShownPresetIcons((isShownPresetIcons) => !isShownPresetIcons);
      }
    },
    [cursor, defaultIsShownPresetIcons, editor, open, layout, projectName, textInput],
  );

  const handleInsertQueryAsIconKeyDown = useCallback(
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
      if (isLaunchIconSuggestionKey(e)) {
        handleLaunchIconSuggestionKeyDown(e);
      } else if (isInsertQueryAsIconKey(e)) {
        handleInsertQueryAsIconKeyDown(e);
      }
    },
    [
      isLaunchIconSuggestionKey,
      isInsertQueryAsIconKey,
      handleLaunchIconSuggestionKeyDown,
      handleInsertQueryAsIconKeyDown,
    ],
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
      isExitIconSuggestionKey={isExitIconSuggestionKey}
    />
  );
};

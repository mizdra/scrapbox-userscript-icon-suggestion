import type { FunctionComponent } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { useDocumentEventListener } from '../hooks/useDocumentEventListener';
import { useScrapbox } from '../hooks/useScrapbox';
import { uniqueIcons } from '../lib/collection';
import type { Icon } from '../lib/icon';
import { isComposing } from '../lib/key';
import { calcCursorPosition, getCursorLine, insertText, scanEmbeddedIcons } from '../lib/scrapbox';
import type { CursorPosition, Matcher } from '../types';
import { ComboBox } from './ComboBox';

export type AppProps = {
  isLaunchIconSuggestionKey: (e: KeyboardEvent) => boolean;
  isExitIconSuggestionKey: (e: KeyboardEvent) => boolean;
  presetIcons: Icon[];
  matcher: Matcher;
};

export const App: FunctionComponent<AppProps> = ({
  isExitIconSuggestionKey,
  isLaunchIconSuggestionKey,
  matcher,
  presetIcons,
}) => {
  const { textInput, cursor, editor, layout, projectName } = useScrapbox();
  const [open, setOpen] = useState(false);
  const [embeddedIcons, setEmbeddedIcons] = useState<Icon[]>([]);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ styleTop: 0, styleLeft: 0 });
  const [query, setQuery] = useState<{ start: number; end: number; text: string } | null>(null);
  const [cursorLine, setCursorLine] = useState<{ element: HTMLElement; index: number } | null>(null);

  console.log({ open, cursorLine, query });

  useEffect(() => {
    const onLinesChanged = () => {
      if (!open || !cursorLine || !query) return;
      const charIndexes = cursorLine.element.querySelectorAll<HTMLElement>('.char-index');
      const endCharIndex = Array.from(charIndexes).find((charIndex) => {
        const index = +charIndex.dataset.charIndex!;
        const char = charIndex.dataset.char!;
        return index >= query.start && char === ']';
      });
      if (endCharIndex) {
        const end = +endCharIndex.dataset.charIndex!;
        setQuery({
          start: query.start,
          end,
          text: scrapbox.Page.lines[cursorLine.index]!.text.slice(query.start, end),
        });
      } else {
        setOpen(false);
      }
    };
    scrapbox.addListener('lines:changed', onLinesChanged);
    return () => {
      scrapbox.removeListener('lines:changed', onLinesChanged);
    };
  }, [open, query, cursorLine]);

  const handleLaunchIconSuggestionKeyDown = useCallback(
    (e: KeyboardEvent) => {
      console.log(`open || layout !== 'page'`, open || layout !== 'page');
      if (open || layout !== 'page') return;
      const cursorLine = getCursorLine(editor);
      console.log('!cursorLine', !cursorLine);
      if (!cursorLine) return;
      e.preventDefault();
      e.stopPropagation();

      setCursorLine(cursorLine);
      const charIndexes = cursorLine.element.querySelectorAll<HTMLElement>('.char-index');
      const cursorRect = cursor.getBoundingClientRect();
      console.log({ cursorRectLeft: cursorRect.left });
      const startCharIndex = Array.from(charIndexes).find((charIndex) => {
        const charIndexRect = charIndex.getBoundingClientRect();
        console.log({ charIndexRectLeft: charIndexRect.left });
        return cursorRect.left <= charIndexRect.left;
      });
      const start = startCharIndex ? +startCharIndex.dataset.charIndex! + 1 : charIndexes.length + 1;
      setQuery({ start, end: start, text: '' });

      insertText(textInput, '[');

      setCursorPosition(calcCursorPosition(cursor));
      // NOTE: ある行にフォーカスがあると、行全体がテキスト化されてしまい、`scanEmbeddedIcons` で
      // アイコンを取得することができなくなってしまう。そのため、予めフォーカスを外し、フォーカスのあった
      // 行のアイコン記法が画像化されるようにしておく。
      // textInput.blur();
      // 画像化されたらエディタを走査してアイコンを収集
      const newEmbeddedIcons = scanEmbeddedIcons(projectName, editor);

      setEmbeddedIcons(newEmbeddedIcons);
      setOpen(true);
    },
    [cursor, editor, open, layout, projectName, textInput],
  );

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (isComposing(e)) return;
      if (isLaunchIconSuggestionKey(e)) {
        handleLaunchIconSuggestionKeyDown(e);
      }
    },
    [isLaunchIconSuggestionKey, handleLaunchIconSuggestionKeyDown],
  );
  useDocumentEventListener('keydown', handleKeydown);

  const handleClose = useCallback(() => {
    setOpen(false);
    textInput.focus();
  }, [textInput]);

  const handleSelect = useCallback(
    (icon: Icon) => {
      if (!query) return;
      setOpen(false);
      scrapbox.Page.updateLine(
        replaceRange(
          scrapbox.Page.lines[cursorLine!.index]!.text,
          query.start,
          query.end,
          icon.getNotation(projectName).slice(1, -1),
        ),
        cursorLine!.index,
      );
      textInput.focus();
    },
    [projectName, textInput, cursorLine, query],
  );

  if (!open || layout !== 'page') return null;
  return (
    <>
      <style>{`.suggest-popup-menu { display: none !important; }`}</style>
      <Inner
        isExitIconSuggestionKey={isExitIconSuggestionKey}
        presetIcons={presetIcons}
        matcher={matcher}
        embeddedIcons={embeddedIcons}
        cursorPosition={cursorPosition}
        query={query?.text ?? ''}
        onClose={handleClose}
        onSelect={handleSelect}
      />
    </>
  );
};

type InnerProps = {
  query: string;
  isExitIconSuggestionKey: (e: KeyboardEvent) => boolean;
  presetIcons: Icon[];
  matcher: Matcher;
  embeddedIcons: Icon[];
  cursorPosition: CursorPosition;
  onClose: () => void;
  onSelect: (icon: Icon) => void;
};

function Inner({
  query,
  isExitIconSuggestionKey,
  presetIcons,
  matcher,
  embeddedIcons,
  cursorPosition,
  onClose,
  onSelect,
}: InnerProps) {
  const composedMatcher = useCallback(
    (query: string) => {
      const composedIcons = uniqueIcons([...embeddedIcons, ...presetIcons]);
      return matcher({ query, composedIcons, presetIcons, embeddedIcons });
    },
    [embeddedIcons, matcher, presetIcons],
  );

  const handleExitIconSuggestionKey = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    },
    [onClose],
  );
  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (isComposing(e)) return;
      if (isExitIconSuggestionKey(e)) {
        handleExitIconSuggestionKey(e);
      }
    },
    [isExitIconSuggestionKey, handleExitIconSuggestionKey],
  );
  useDocumentEventListener('keydown', handleKeydown);

  return (
    <ComboBox
      query={query}
      cursorPosition={cursorPosition}
      matcher={composedMatcher}
      onSelect={onSelect}
      onBlur={onClose}
    />
  );
}

function replaceRange(str: string, start: number, end: number, replacement: string) {
  return str.slice(0, start) + replacement + str.slice(end);
}

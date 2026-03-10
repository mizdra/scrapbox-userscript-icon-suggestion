import type { FunctionComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { useDocumentEventListener } from '../hooks/useDocumentEventListener';
import type { CursorIndex } from '../hooks/useScrapbox';
import { useScrapbox } from '../hooks/useScrapbox';
import { uniqueIcons } from '../lib/collection';
import type { Icon } from '../lib/icon';
import { isComposing } from '../lib/key';
import { calcCursorPosition, scanEmbeddedIcons } from '../lib/scrapbox';
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
  const { cursor, editor, layout, projectName, getCursorIndex, focus, blur, insertText } = useScrapbox();
  const [open, setOpen] = useState(false);
  const [embeddedIcons, setEmbeddedIcons] = useState<Icon[]>([]);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ styleTop: 0, styleLeft: 0 });
  const [cursorIndex, setCursorIndex] = useState<CursorIndex | undefined>(undefined);

  const handleLaunchIconSuggestionKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (open || layout !== 'page') return;
      e.preventDefault();
      e.stopPropagation();

      const cursorIndex = getCursorIndex();
      if (!cursorIndex) return;
      setCursorIndex(cursorIndex);
      setCursorPosition(calcCursorPosition(cursor));
      // NOTE: ある行にフォーカスがあると、行全体がテキスト化されてしまい、`scanEmbeddedIcons` で
      // アイコンを取得することができなくなってしまう。そのため、予めフォーカスを外し、フォーカスのあった
      // 行のアイコン記法が画像化されるようにしておく。
      blur();
      // 画像化されたらエディタを走査してアイコンを収集
      const newEmbeddedIcons = scanEmbeddedIcons(projectName, editor);

      setEmbeddedIcons(newEmbeddedIcons);
      setOpen(true);
    },
    [cursor, editor, open, layout, projectName, getCursorIndex, blur],
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

  const handleClose = useCallback(async () => {
    setOpen(false);
    if (cursorIndex) await focus(cursorIndex);
  }, [focus, cursorIndex]);

  const handleSelect = useCallback(
    async (icon: Icon) => {
      setOpen(false);
      if (cursorIndex) await focus(cursorIndex);
      insertText(icon.getNotation(projectName));
    },
    [focus, cursorIndex, projectName, insertText],
  );

  if (!open || layout !== 'page') return null;
  return (
    <Inner
      isExitIconSuggestionKey={isExitIconSuggestionKey}
      presetIcons={presetIcons}
      matcher={matcher}
      embeddedIcons={embeddedIcons}
      cursorPosition={cursorPosition}
      // oxlint-disable-next-line typescript/no-misused-promises
      onClose={handleClose}
      // oxlint-disable-next-line typescript/no-misused-promises
      onSelect={handleSelect}
    />
  );
};

type InnerProps = {
  isExitIconSuggestionKey: (e: KeyboardEvent) => boolean;
  presetIcons: Icon[];
  matcher: Matcher;
  embeddedIcons: Icon[];
  cursorPosition: CursorPosition;
  onClose: () => void;
  onSelect: (icon: Icon) => void;
};

function Inner({
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

  return <ComboBox cursorPosition={cursorPosition} matcher={composedMatcher} onSelect={onSelect} onBlur={onClose} />;
}

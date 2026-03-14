import type { FunctionComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { useDocumentEventListener } from '../hooks/useDocumentEventListener';
import type { CursorPosition } from '../hooks/useScrapbox';
import { useScrapbox } from '../hooks/useScrapbox';
import { uniqueIcons } from '../lib/collection';
import type { Icon } from '../lib/icon';
import { isComposing } from '../lib/key';
import type { Matcher } from '../types';
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
  const scrapbox = useScrapbox();
  const [open, setOpen] = useState(false);
  const [embeddedIcons, setEmbeddedIcons] = useState<Icon[]>([]);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition | undefined>(undefined);

  const handleLaunchIconSuggestionKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (open || scrapbox.layout !== 'page') return;
      e.preventDefault();
      e.stopPropagation();

      const cursorPosition = scrapbox.getCursorPosition();
      if (!cursorPosition) return;
      setCursorPosition(cursorPosition);
      // NOTE: ある行にフォーカスがあると、行全体がテキスト化されてしまい、`scanEmbeddedIcons` で
      // アイコンを取得することができなくなってしまう。そのため、予めフォーカスを外し、フォーカスのあった
      // 行のアイコン記法が画像化されるようにしておく。
      scrapbox.blur();
      // 画像化されたらエディタを走査してアイコンを収集
      const newEmbeddedIcons = scrapbox.getEmbeddedIcons();

      setEmbeddedIcons(newEmbeddedIcons);
      setOpen(true);
    },
    [scrapbox, open],
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
    if (cursorPosition) await scrapbox.focus(cursorPosition);
  }, [scrapbox, cursorPosition]);

  const handleSelect = useCallback(
    async (icon: Icon) => {
      setOpen(false);
      if (cursorPosition) await scrapbox.focus(cursorPosition);
      scrapbox.insertText(icon.getNotation(scrapbox.projectName));
    },
    [scrapbox, cursorPosition],
  );

  if (!open || scrapbox.layout !== 'page' || !cursorPosition) return null;
  return (
    <div style={{ position: 'absolute', top: cursorPosition.styleTop, left: cursorPosition.styleLeft }}>
      <Inner
        isExitIconSuggestionKey={isExitIconSuggestionKey}
        presetIcons={presetIcons}
        matcher={matcher}
        embeddedIcons={embeddedIcons}
        // oxlint-disable-next-line typescript/no-misused-promises
        onClose={handleClose}
        // oxlint-disable-next-line typescript/no-misused-promises
        onSelect={handleSelect}
      />
    </div>
  );
};

type InnerProps = {
  isExitIconSuggestionKey: (e: KeyboardEvent) => boolean;
  presetIcons: Icon[];
  matcher: Matcher;
  embeddedIcons: Icon[];
  onClose: () => void;
  onSelect: (icon: Icon) => void;
};

function Inner({ isExitIconSuggestionKey, presetIcons, matcher, embeddedIcons, onClose, onSelect }: InnerProps) {
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

  return <ComboBox matcher={composedMatcher} onSelect={onSelect} onBlur={onClose} />;
}

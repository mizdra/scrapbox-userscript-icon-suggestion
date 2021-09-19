import { ComponentChild } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { Icon } from '../lib/icon';
import { forwardPartialFuzzyMatcher } from '../lib/matcher';
import { CursorPosition, Matcher } from '../types';
import { PopupMenu } from './PopupMenu';
import { SearchInput } from './SearchablePopupMenu/SearchInput';

export type SearchablePopupMenuProps<T> = {
  open: boolean;
  emptyMessage?: string;
  icons: Icon[];
  cursorPosition: CursorPosition;
  matcher?: Matcher<T>;
  onSelect?: (icon: Icon) => void;
  onClose?: () => void;
  onInputQuery?: (query: string) => void;
  isSuggestionCloseKeyDown?: (e: KeyboardEvent) => boolean;
};

export function SearchablePopupMenu<T>({
  open,
  emptyMessage,
  icons,
  cursorPosition,
  matcher = forwardPartialFuzzyMatcher,
  onSelect,
  onClose,
  onInputQuery,
  isSuggestionCloseKeyDown,
}: SearchablePopupMenuProps<T>) {
  const [query, setQuery] = useState('');
  const matchedIcons = useMemo(() => matcher(query, icons), [icons, matcher, query]);
  const matchedIconsForPopupMenu = useMemo(
    () =>
      matchedIcons.map((icon) => ({
        key: icon.key,
        element: icon.element,
      })),
    [matchedIcons],
  );

  useEffect(() => {
    if (open === false) setQuery('');
  }, [open]);

  const handleSelect = useCallback(
    (_icon: ComponentChild, index: number) => {
      onSelect?.(matchedIcons[index]);
    },
    [matchedIcons, onSelect],
  );
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);
  const handleInputQuery = useCallback(
    (query: string) => {
      setQuery(query);
      onInputQuery?.(query);
    },
    [onInputQuery],
  );

  return (
    <div>
      <PopupMenu
        open={open}
        emptyMessage={emptyMessage}
        icons={matchedIconsForPopupMenu}
        cursorPosition={cursorPosition}
        onSelect={handleSelect}
        onClose={handleClose}
        isPopupCloseKeyDown={isSuggestionCloseKeyDown}
      />
      {open && (
        <SearchInput
          defaultQuery={query}
          cursorPosition={cursorPosition}
          onInput={handleInputQuery}
          onBlur={handleClose}
        />
      )}
    </div>
  );
}

import { ComponentChild } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { Icon } from '../lib/icon';
import { CursorPosition } from '../types';
import { PopupMenu } from './PopupMenu';
import { SearchInput } from './SearchablePopupMenu/SearchInput';

export type SearchablePopupMenuMatcher = (query: string) => Icon[];

export type SearchablePopupMenuProps = {
  open: boolean;
  emptyMessage?: string;
  cursorPosition: CursorPosition;
  matcher: SearchablePopupMenuMatcher;
  onSelect?: (icon: Icon) => void;
  onClose?: () => void;
  onInputQuery?: (query: string) => void;
  isSuggestionCloseKeyDown?: (e: KeyboardEvent) => boolean;
};

export function SearchablePopupMenu({
  open,
  emptyMessage,
  cursorPosition,
  matcher,
  onSelect,
  onClose,
  onInputQuery,
  isSuggestionCloseKeyDown,
}: SearchablePopupMenuProps) {
  const [query, setQuery] = useState('');
  const matchedIcons = useMemo(() => matcher(query), [matcher, query]);

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
        icons={matchedIcons}
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

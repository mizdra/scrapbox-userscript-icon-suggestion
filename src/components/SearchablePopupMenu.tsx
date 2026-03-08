import type { ComponentChild } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';
import type { Icon } from '../lib/icon';
import type { CursorPosition } from '../types';
import { PopupMenu } from './PopupMenu';
import { SearchInput } from './SearchablePopupMenu/SearchInput';

export type SearchablePopupMenuMatcher = (query: string) => Icon[];

export type SearchablePopupMenuProps = {
  emptyMessage?: string;
  cursorPosition: CursorPosition;
  matcher: SearchablePopupMenuMatcher;
  onSelect?: (icon: Icon) => void;
  onClose?: () => void;
  onInputQuery?: (query: string) => void;
  isExitIconSuggestionKey: (e: KeyboardEvent) => boolean;
};

export function SearchablePopupMenu({
  emptyMessage,
  cursorPosition,
  matcher,
  onSelect,
  onClose,
  onInputQuery,
  isExitIconSuggestionKey,
}: SearchablePopupMenuProps) {
  const [query, setQuery] = useState('');
  const matchedIcons = useMemo(() => matcher(query), [matcher, query]);

  const handleSelect = useCallback(
    (_icon: ComponentChild, index: number) => {
      onSelect?.(matchedIcons[index]!);
    },
    [matchedIcons, onSelect],
  );
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
        emptyMessage={emptyMessage}
        icons={matchedIcons}
        cursorPosition={cursorPosition}
        onSelect={handleSelect}
        onClose={onClose}
        isClosePopupKey={isExitIconSuggestionKey}
      />
      <SearchInput defaultQuery={query} cursorPosition={cursorPosition} onInput={handleInputQuery} onBlur={onClose} />
    </div>
  );
}

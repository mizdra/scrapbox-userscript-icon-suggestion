import Asearch from 'asearch';
import { ComponentChild } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { CursorPosition } from '../types';
import { PopupMenu } from './PopupMenu';
import { QueryInput } from './SuggestionBox/QueryInput';

export type Item<T> = { element: ComponentChild; searchableText: string; value: T };

export function matchItems<T>(query: string, items: Item<T>[]): Item<T>[] {
  const ambig = Math.min(Math.floor(query.length / 4) + 1, 3);
  const match = Asearch(query);
  return items.filter((item) => match(item.searchableText, ambig));
}

export type SuggestionBoxProps<T> = {
  open: boolean;
  emptyMessage?: string;
  items: Item<T>[];
  cursorPosition: CursorPosition;
  onSelect?: (item: Item<T>, query: string) => void;
  onSelectNonexistent?: (query: string) => void;
  onClose?: (query: string) => void;
  isSuggestionCloseKeyDown?: (e: KeyboardEvent) => boolean;
};

export function SuggestionBox<T>({
  open,
  emptyMessage,
  items,
  cursorPosition,
  onSelect,
  onSelectNonexistent,
  onClose,
  isSuggestionCloseKeyDown,
}: SuggestionBoxProps<T>) {
  const [query, setQuery] = useState('');
  const matchedItems = useMemo(() => matchItems(query, items), [items, query]);
  const matchedItemsForPopupMenu = useMemo(() => matchedItems.map((item) => item.element), [matchedItems]);

  useEffect(() => {
    if (open === false) setQuery('');
  }, [open]);

  const handleSelect = useCallback(
    (_item: ComponentChild, index: number) => {
      onSelect?.(matchedItems[index], query);
    },
    [matchedItems, onSelect, query],
  );
  const handleSelectNonexistent = useCallback(() => {
    onSelectNonexistent?.(query);
  }, [onSelectNonexistent, query]);
  const handleClose = useCallback(() => {
    onClose?.(query);
  }, [onClose, query]);

  return (
    <div>
      <PopupMenu
        open={open}
        emptyMessage={emptyMessage}
        items={matchedItemsForPopupMenu}
        cursorPosition={cursorPosition}
        onSelect={handleSelect}
        onSelectNonexistent={handleSelectNonexistent}
        onClose={handleClose}
        isPopupCloseKeyDown={isSuggestionCloseKeyDown}
      />
      {open && (
        <QueryInput defaultQuery={query} cursorPosition={cursorPosition} onInput={setQuery} onBlur={handleClose} />
      )}
    </div>
  );
}

import { ComponentChild } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { CursorPosition } from '../types';
import { PopupMenu } from './PopupMenu';
import { QueryInput } from './SuggestionBox/QueryInput';

export type Item = { element: ComponentChild; searchableText: string };

function useMatchedItems(query: string, items: Item[]): Item[] {
  const matchedItems = useMemo(() => {
    return items.filter((item) => {
      const target = item.searchableText.toLowerCase();
      return target.includes(query.toLowerCase());
    });
  }, [items, query]);
  return matchedItems;
}

type SuggestionBoxProps = {
  open: boolean;
  emptyMessage?: string;
  items: Item[];
  cursorPosition: CursorPosition;
  onSelect?: (item: Item, index: number, query: string) => void;
  onSelectNonexistent?: (query: string) => void;
  onClose?: (query: string) => void;
};

export function SuggestionBox({
  open,
  emptyMessage,
  items,
  cursorPosition,
  onSelect,
  onSelectNonexistent,
  onClose,
}: SuggestionBoxProps) {
  const [query, setQuery] = useState('');
  const matchedItems = useMatchedItems(query, items);
  const matchedItemsForPopupMenu = useMemo(() => matchedItems.map((item) => item.element), [matchedItems]);

  useEffect(() => {
    if (open === false) setQuery('');
  }, [open]);

  const handleSelect = useCallback(
    (_item: ComponentChild, index: number) => {
      const selectedItem = matchedItems[index];
      const selectedIndex = items.indexOf(selectedItem);
      onSelect?.(selectedItem, selectedIndex, query);
    },
    [items, matchedItems, onSelect, query],
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
      />
      {open && (
        <QueryInput defaultQuery={query} cursorPosition={cursorPosition} onInput={setQuery} onBlur={handleClose} />
      )}
    </div>
  );
}

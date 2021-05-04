import { VNode } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { CursorPosition } from '../types';
import { Item, PopupMenu } from './PopupMenu';
import { QueryInput } from './SuggestionBox/QueryInput';

function useMatchedItems<T extends VNode, U>(query: string, items: Item<T, U>[]): Item<T, U>[] {
  const matchedItems = useMemo(() => {
    return items.filter((item) => {
      const target = item.searchableText.toLowerCase();
      return target.includes(query.toLowerCase());
    });
  }, [items, query]);
  return matchedItems;
}

type SuggestionBoxProps<T extends VNode, U> = {
  open: boolean;
  emptyMessage: string;
  items: Item<T, U>[];
  cursorPosition: CursorPosition;
  onSelect: (item: Item<T, U>, query: string) => void;
  onSelectNonexistent: (query: string) => void;
  onClose: (query: string) => void;
};

export function SuggestionBox<T extends VNode, U>({
  open,
  emptyMessage,
  items,
  cursorPosition,
  onSelect,
  onSelectNonexistent,
  onClose,
}: SuggestionBoxProps<T, U>) {
  const [query, setQuery] = useState('');
  const matchedItems = useMatchedItems(query, items);

  useEffect(() => {
    if (open === false) setQuery('');
  }, [open]);

  const handleSelect = useCallback(
    (item: Item<T, U>) => {
      onSelect(item, query);
    },
    [onSelect, query],
  );
  const handleSelectNonexistent = useCallback(() => {
    onSelectNonexistent(query);
  }, [onSelectNonexistent, query]);
  const handleClose = useCallback(() => {
    onClose(query);
  }, [onClose, query]);

  return (
    <div>
      <PopupMenu<T, U>
        open={open}
        emptyMessage={emptyMessage}
        items={matchedItems}
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

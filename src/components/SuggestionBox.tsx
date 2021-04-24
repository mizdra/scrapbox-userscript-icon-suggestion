import { VNode } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { CursorPosition } from '../types';
import { Item, PopupMenu } from './PopupMenu';
import { QueryInput } from './SuggestionBox/QueryInput';

type SuggestionBoxProps<T extends VNode> = {
  open: boolean;
  emptyMessage: string;
  items: Item<T>[];
  cursorPosition: CursorPosition;
  onSelect: (item: Item<T>, query: string) => void;
  onSelectNonexistent: (query: string) => void;
  onClose: (query: string) => void;
};

export function SuggestionBox<T extends VNode>({
  open,
  emptyMessage,
  items,
  cursorPosition,
  onSelect,
  onSelectNonexistent,
  onClose,
}: SuggestionBoxProps<T>) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open === false) setQuery('');
  }, [open]);

  const handleSelect = useCallback(
    (item: Item<T>) => {
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
      <PopupMenu<T>
        open={open}
        emptyMessage={emptyMessage}
        items={items}
        cursorPosition={cursorPosition}
        query={query}
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

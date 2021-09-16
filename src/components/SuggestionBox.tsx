import Asearch from 'asearch';
import { ComponentChild } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import { CursorPosition, Matcher } from '../types';
import { PopupMenu } from './PopupMenu';
import { QueryInput } from './SuggestionBox/QueryInput';

export type Item<T> = {
  key: JSXInternal.IntrinsicAttributes['key'];
  element: ComponentChild;
  searchableText: string;
  value: T;
};

export function matchItems<T>(query: string, items: Item<T>[]): Item<T>[] {
  const maxAambig = Math.min(Math.floor(query.length / 4) + 1, 3);
  const match = Asearch(` ${query} `); // 部分一致できるように、両端をスペースで囲む
  // あいまい度の少ない項目から順に並べる
  // 重複は除く
  const pushedItems: Set<Item<T>> = new Set();
  const result: Item<T>[] = [];
  for (let ambig = 0; ambig <= maxAambig; ambig++) {
    items.forEach((item) => {
      if (!match(item.searchableText, ambig)) return;
      if (pushedItems.has(item)) return;
      pushedItems.add(item);
      result.push(item);
    });
  }

  return result;
}

export type SuggestionBoxProps<T> = {
  open: boolean;
  emptyMessage?: string;
  items: Item<T>[];
  cursorPosition: CursorPosition;
  matcher?: Matcher<T>;
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
  matcher = matchItems,
  onSelect,
  onSelectNonexistent,
  onClose,
  isSuggestionCloseKeyDown,
}: SuggestionBoxProps<T>) {
  const [query, setQuery] = useState('');
  const matchedItems = useMemo(() => matcher(query, items), [items, matcher, query]);
  const matchedItemsForPopupMenu = useMemo(
    () =>
      matchedItems.map((item) => ({
        key: item.key,
        element: item.element,
      })),
    [matchedItems],
  );

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

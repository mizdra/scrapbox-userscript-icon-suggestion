import { VNode } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import useResizeObserver from 'use-resize-observer';
import { useDocumentEventListener } from '../hooks/useDocumentEventListener';
import { calcButtonContainerPosition, calcPopupMenuStyle, calcTrianglePosition } from '../lib/position';
import { CursorPosition } from '../types';
import { PopupMenuButton } from './PopupMenu/Button';

const editor = document.querySelector<HTMLElement>('.editor')!;

export type Item<T extends VNode, U> = { element: T; searchableText: string; value: U };

type PopupMenuProps<T extends VNode, U> = {
  open: boolean;
  emptyMessage: string;
  query: string;
  cursorPosition: CursorPosition;
  items: Item<T, U>[];
  onSelect: (item: Item<T, U>) => void;
  onSelectNonexistent: () => void;
  onClose: () => void;
};

function useMatchedItems<T extends VNode, U>(query: string, items: Item<T, U>[]): Item<T, U>[] {
  const matchedItems = useMemo(() => {
    return items.filter((item) => {
      const target = item.searchableText.toLowerCase();
      return target.includes(query.toLowerCase());
    });
  }, [items, query]);
  return matchedItems;
}

export function PopupMenu<T extends VNode, U>({
  open,
  emptyMessage,
  query,
  cursorPosition,
  items,
  onSelect,
  onSelectNonexistent,
  onClose,
}: PopupMenuProps<T, U>) {
  const { ref, width: buttonContainerWidth = 0 } = useResizeObserver<HTMLDivElement>();
  const matchedItems = useMatchedItems(query, items);
  const isEmpty = useMemo(() => matchedItems.length === 0, [matchedItems.length]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { width: editorWidth = 0 } = useResizeObserver({ ref: editor });

  // query や items が変わったら選択位置を 0 番目に戻す。ただし空なら null にセットする。
  useEffect(() => {
    setSelectedIndex(isEmpty ? null : 0);
  }, [isEmpty, query, items]);

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      // 閉じている時は何もしない
      if (!open) return;
      // IMEによる変換中は何もしない
      if (e.isComposing) return;

      const isTab = e.key === 'Tab' && !e.ctrlKey && !e.shiftKey && !e.altKey;
      const isShiftTab = e.key === 'Tab' && !e.ctrlKey && e.shiftKey && !e.altKey;
      const isEnter = e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey;
      const isEscape = e.key === 'Escape' && !e.ctrlKey && !e.shiftKey && !e.altKey;

      if (isTab || isShiftTab || isEnter || isEscape) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (isEmpty || selectedIndex === null) {
        if (isEnter) onSelectNonexistent();
        if (isEscape) onClose();
      } else {
        if (isTab) setSelectedIndex((selectedIndex + 1) % matchedItems.length);
        if (isShiftTab) setSelectedIndex((selectedIndex - 1 + matchedItems.length) % matchedItems.length);
        if (isEnter) onSelect(matchedItems[selectedIndex]);
        if (isEscape) onClose();
      }
    },
    [isEmpty, matchedItems, onClose, onSelect, onSelectNonexistent, open, selectedIndex],
  );
  useDocumentEventListener('keydown', handleKeydown, { capture: true });

  const popupMenuStyle = calcPopupMenuStyle(cursorPosition);
  const triangleStyle = calcTrianglePosition(cursorPosition, isEmpty);
  const buttonContainerStyle = calcButtonContainerPosition(editorWidth, buttonContainerWidth, cursorPosition, isEmpty);

  const itemListElement = matchedItems.map((item, i) => (
    <PopupMenuButton key={i} selected={selectedIndex === i} item={item} />
  ));

  return (
    <>
      {open && (
        <div className="popup-menu" style={popupMenuStyle}>
          <div ref={ref} className="button-container" style={buttonContainerStyle}>
            {matchedItems.length === 0 ? emptyMessage : itemListElement}
          </div>
          <div className="triangle" style={triangleStyle} />
        </div>
      )}
    </>
  );
}

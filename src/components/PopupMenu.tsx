import { VNode } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import useResizeObserver from 'use-resize-observer';
import { useDocumentEventListener } from '../hooks/useDocumentEventListener';
import { calcButtonContainerStyle, calcPopupMenuStyle, calcTriangleStyle } from '../lib/calc-style';
import { CursorPosition } from '../types';
import { PopupMenuButton } from './PopupMenu/Button';

const editor = document.querySelector<HTMLElement>('.editor')!;

export type Item<T extends VNode, U> = { element: T; searchableText: string; value: U };

type PopupMenuProps<T extends VNode, U> = {
  open: boolean;
  emptyMessage?: string;
  cursorPosition: CursorPosition;
  items: Item<T, U>[];
  onSelect?: (item: Item<T, U>) => void;
  onSelectNonexistent?: () => void;
  onClose?: () => void;
};

export function PopupMenu<T extends VNode, U>({
  open,
  emptyMessage,
  cursorPosition,
  items,
  onSelect,
  onSelectNonexistent,
  onClose,
}: PopupMenuProps<T, U>) {
  const { ref, width: buttonContainerWidth = 0 } = useResizeObserver<HTMLDivElement>();
  const isEmpty = useMemo(() => items.length === 0, [items.length]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { width: editorWidth = 0 } = useResizeObserver({ ref: editor });

  // items が変わったら選択位置を 0 番目に戻す。ただし空なら null にセットする。
  useEffect(() => {
    setSelectedIndex(isEmpty ? null : 0);
  }, [isEmpty, items]);

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
        if (isEnter) onSelectNonexistent?.();
        if (isEscape) onClose?.();
      } else {
        if (isTab) setSelectedIndex((selectedIndex + 1) % items.length);
        if (isShiftTab) setSelectedIndex((selectedIndex - 1 + items.length) % items.length);
        if (isEnter) onSelect?.(items[selectedIndex]);
        if (isEscape) onClose?.();
      }
    },
    [isEmpty, items, onClose, onSelect, onSelectNonexistent, open, selectedIndex],
  );
  useDocumentEventListener('keydown', handleKeydown, { capture: true });

  const popupMenuStyle = calcPopupMenuStyle(cursorPosition);
  const triangleStyle = calcTriangleStyle(cursorPosition, isEmpty);
  const buttonContainerStyle = calcButtonContainerStyle(editorWidth, buttonContainerWidth, cursorPosition, isEmpty);

  const itemListElement = items.map((item, i) => (
    <PopupMenuButton key={i} selected={selectedIndex === i}>
      {item.element}
    </PopupMenuButton>
  ));

  return (
    <>
      {open && (
        <div className="popup-menu" style={popupMenuStyle}>
          <div ref={ref} className="button-container" style={buttonContainerStyle}>
            {items.length === 0 ? emptyMessage ?? 'アイテムは空です' : itemListElement}
          </div>
          <div className="triangle" style={triangleStyle} />
        </div>
      )}
    </>
  );
}

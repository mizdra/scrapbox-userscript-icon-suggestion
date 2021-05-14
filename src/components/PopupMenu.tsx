import { ComponentChild } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import useResizeObserver from 'use-resize-observer';
import { useDocumentEventListener } from '../hooks/useDocumentEventListener';
import { calcButtonContainerStyle, calcPopupMenuStyle, calcTriangleStyle } from '../lib/calc-style';
import { editor } from '../lib/scrapbox';
import { CursorPosition } from '../types';
import { PopupMenuButton } from './PopupMenu/Button';

export type Item = ComponentChild;

type PopupMenuProps = {
  open: boolean;
  emptyMessage?: string;
  cursorPosition: CursorPosition;
  items: Item[];
  onSelect?: (item: Item, index: number) => void;
  onSelectNonexistent?: () => void;
  onClose?: () => void;
};

export function PopupMenu({
  open,
  emptyMessage,
  cursorPosition,
  items,
  onSelect,
  onSelectNonexistent,
  onClose,
}: PopupMenuProps) {
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
        if (isEnter) onSelect?.(items[selectedIndex], selectedIndex);
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
      {item}
    </PopupMenuButton>
  ));

  return (
    <>
      {open && (
        <div className="popup-menu" style={popupMenuStyle} data-testid="popup-menu">
          <div ref={ref} className="button-container" style={buttonContainerStyle} data-testid="button-container">
            {items.length === 0 ? emptyMessage ?? 'アイテムは空です' : itemListElement}
          </div>
          <div className="triangle" style={triangleStyle} />
        </div>
      )}
    </>
  );
}

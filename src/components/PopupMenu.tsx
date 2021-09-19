import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import useResizeObserver from 'use-resize-observer';
import { useDocumentEventListener } from '../hooks/useDocumentEventListener';
import { useScrapbox } from '../hooks/useScrapbox';
import { calcButtonContainerStyle, calcPopupMenuStyle, calcTriangleStyle } from '../lib/calc-style';
import { Icon } from '../lib/icon';
import { isComposing } from '../lib/key';
import { CursorPosition } from '../types';
import { PopupMenuButton } from './PopupMenu/Button';

const DEFAULT_IS_POPUP_CLOSE_KEY_DOWN = (e: KeyboardEvent) => {
  return e.key === 'Escape' && !e.ctrlKey && !e.shiftKey && !e.altKey;
};

export type PopupMenuProps = {
  open: boolean;
  emptyMessage?: string;
  cursorPosition: CursorPosition;
  icons: Icon[];
  onSelect?: (icon: Icon, index: number) => void;
  onClose?: () => void;
  isPopupCloseKeyDown?: (e: KeyboardEvent) => boolean;
};

export function PopupMenu({
  open,
  emptyMessage,
  cursorPosition,
  icons,
  onSelect,
  onClose,
  isPopupCloseKeyDown = DEFAULT_IS_POPUP_CLOSE_KEY_DOWN,
}: PopupMenuProps) {
  const { editor } = useScrapbox();
  const { ref, width: buttonContainerWidth = 0 } = useResizeObserver<HTMLDivElement>();
  const isEmpty = useMemo(() => icons.length === 0, [icons.length]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { width: editorWidth = 0 } = useResizeObserver({ ref: editor });

  // icons が変わったら選択位置を 0 番目に戻す。ただし空なら null にセットする。
  useEffect(() => {
    setSelectedIndex(isEmpty ? null : 0);
  }, [isEmpty, icons]);

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      // 閉じている時は何もしない
      if (!open) return;
      // IMEによる変換中は何もしない
      if (isComposing(e)) return;

      const isTab = e.key === 'Tab' && !e.ctrlKey && !e.shiftKey && !e.altKey;
      const isShiftTab = e.key === 'Tab' && !e.ctrlKey && e.shiftKey && !e.altKey;
      const isEnter = e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey;
      const isClose = isPopupCloseKeyDown(e);

      if (isTab || isShiftTab || isEnter || isClose) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (isEmpty || selectedIndex === null) {
        if (isClose) onClose?.();
      } else {
        if (isTab) setSelectedIndex((selectedIndex + 1) % icons.length);
        if (isShiftTab) setSelectedIndex((selectedIndex - 1 + icons.length) % icons.length);
        if (isEnter) onSelect?.(icons[selectedIndex], selectedIndex);
        if (isClose) onClose?.();
      }
    },
    [isEmpty, isPopupCloseKeyDown, icons, onClose, onSelect, open, selectedIndex],
  );
  useDocumentEventListener('keydown', handleKeydown, { capture: true });

  const popupMenuStyle = calcPopupMenuStyle(cursorPosition);
  const triangleStyle = calcTriangleStyle(cursorPosition, isEmpty);
  const buttonContainerStyle = calcButtonContainerStyle(editorWidth, buttonContainerWidth, cursorPosition, isEmpty);

  const iconListElement = icons.map((icon, i) => (
    <PopupMenuButton key={icon.key} selected={selectedIndex === i}>
      {icon.element}
    </PopupMenuButton>
  ));

  return (
    <>
      {open && (
        <div className="popup-menu" style={popupMenuStyle} data-testid="popup-menu">
          <div ref={ref} className="button-container" style={buttonContainerStyle} data-testid="button-container">
            {icons.length === 0 ? emptyMessage ?? 'アイテムは空です' : iconListElement}
          </div>
          <div className="triangle" style={triangleStyle} />
        </div>
      )}
    </>
  );
}

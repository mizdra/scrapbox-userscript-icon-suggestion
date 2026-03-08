import { useRef, useState } from 'preact/hooks';
import { useDocumentEventListener } from '../hooks/useDocumentEventListener';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { useScrapbox } from '../hooks/useScrapbox';
import { calcButtonContainerStyle, calcPopupMenuStyle, calcTriangleStyle } from '../lib/calc-style';
import type { Icon } from '../lib/icon';
import { hasDuplicatedPageTitle } from '../lib/icon';
import { isComposing } from '../lib/key';
import type { CursorPosition } from '../types';
import { PopupMenuButton } from './PopupMenu/Button';

export type PopupMenuProps = {
  cursorPosition: CursorPosition;
  icons: Icon[];
  onSelect?: (icon: Icon, index: number) => void;
};

export function PopupMenu({ cursorPosition, icons, onSelect }: PopupMenuProps) {
  const { editor } = useScrapbox();
  const ref = useRef<HTMLDivElement>(null);
  const { width: buttonContainerWidth = 0 } = useResizeObserver(ref);
  const isEmpty = icons.length === 0;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(icons.length === 0 ? null : 0);
  const [prevIcons, setPrevIcons] = useState(icons);
  const editorRef = useRef(editor);
  const { width: editorWidth = 0 } = useResizeObserver(editorRef);

  // icons が変わったら選択位置を 0 番目に戻す。ただし空なら null にセットする。
  if (prevIcons !== icons) {
    setPrevIcons(icons);
    setSelectedIndex(isEmpty ? null : 0);
  }

  const handleKeydown = (e: KeyboardEvent) => {
    // 閉じている時は何もしない
    if (!open) return;
    // IMEによる変換中は何もしない
    if (isComposing(e)) return;
    if (isEmpty || selectedIndex === null) return;

    const isTab = e.key === 'Tab' && !e.ctrlKey && !e.shiftKey && !e.altKey;
    const isShiftTab = e.key === 'Tab' && !e.ctrlKey && e.shiftKey && !e.altKey;
    const isEnter = e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey;

    if (isTab || isShiftTab || isEnter) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isTab) setSelectedIndex((prev) => (prev !== null ? (prev + 1) % icons.length : 0));
    if (isShiftTab) setSelectedIndex((prev) => (prev !== null ? (prev - 1 + icons.length) % icons.length : 0));
    if (isEnter) onSelect?.(icons[selectedIndex]!, selectedIndex);
  };
  useDocumentEventListener('keydown', handleKeydown);

  const popupMenuStyle = calcPopupMenuStyle(cursorPosition);
  const triangleStyle = calcTriangleStyle(cursorPosition, isEmpty);
  const buttonContainerStyle = calcButtonContainerStyle(editorWidth, buttonContainerWidth, cursorPosition, isEmpty);
  const iconListElement = icons.map((icon, i) => {
    const label = hasDuplicatedPageTitle(icon, icons) ? `${icon.pageTitle} (${icon.projectName})` : icon.pageTitle;
    return (
      <PopupMenuButton key={icon.fullPagePath} selected={selectedIndex === i}>
        <span>
          <img
            alt={icon.imgAlt}
            title={icon.imgTitle}
            style="width: 1.3em; height: 1.3em; object-fit: contain;"
            src={icon.imgSrc}
          />{' '}
          <span data-testid="suggested-icon-label">{label}</span>
        </span>
      </PopupMenuButton>
    );
  });

  return (
    <div className="popup-menu" style={popupMenuStyle} data-testid="popup-menu">
      <div ref={ref} className="button-container" style={buttonContainerStyle} data-testid="button-container">
        {icons.length === 0 ? 'キーワードにマッチするアイコンがありません' : iconListElement}
      </div>
      <div className="triangle" style={triangleStyle} />
    </div>
  );
}

import type { ComponentChildren } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { useDocumentEventListener } from '../hooks/useDocumentEventListener';
import type { Icon } from '../lib/icon';
import { hasDuplicatedPageTitle } from '../lib/icon';
import { isComposing } from '../lib/key';

export type PopupMenuProps = {
  icons: Icon[];
  onSelect?: (icon: Icon, index: number) => void;
};

export function PopupMenu({ icons, onSelect }: PopupMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isEmpty = icons.length === 0;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(icons.length === 0 ? null : 0);
  const [prevIcons, setPrevIcons] = useState(icons);

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

  const iconListElement = icons.map((icon, i) => {
    const label = hasDuplicatedPageTitle(icon, icons) ? `${icon.pageTitle} (${icon.projectName})` : icon.pageTitle;
    return (
      <Button key={icon.fullPagePath} selected={selectedIndex === i}>
        <span className="button-label" data-testid="suggested-icon-label">
          {label}
        </span>
        <div className="icon">
          <img alt={icon.imgAlt} title={icon.imgTitle} src={icon.imgSrc} />
        </div>
      </Button>
    );
  });

  return (
    <div className="popup-menu" data-testid="popup-menu">
      <div ref={ref} className="button-container" data-testid="button-container">
        {icons.length === 0 ? 'キーワードにマッチするアイコンがありません' : iconListElement}
      </div>
      <div className="triangle" style={{ left: 10 }} />
    </div>
  );
}

function Button({ children, selected }: { selected?: boolean; children: ComponentChildren }) {
  return <div className={selected ? 'button selected' : 'button'}>{children}</div>;
}

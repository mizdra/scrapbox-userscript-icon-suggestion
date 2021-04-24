import { FunctionComponent } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { ReactElement } from 'react';
import { useSize } from 'react-use';
import { useDocumentEventListener } from '../hooks/useDocumentEventListener';
import { uniqBy } from '../lib/collection';
import { calcButtonContainerPosition, calcPopupMenuStyle, calcTrianglePosition } from '../lib/position';
import { scanIconsFromNotation } from '../lib/scrapbox';
import { CursorPosition, Icon } from '../types';
import { PopupMenuButton } from './PopupMenu/Button';

type PopupMenuProps = {
  query: string;
  cursorPosition: CursorPosition;
  onSelect: (icon: Icon) => void;
  onClose: () => void;
};

function useMatchedIcons(query: string) {
  const icons = useMemo(() => {
    const icons = scanIconsFromNotation();
    return uniqBy(icons, (icon) => icon.pagePath);
  }, []); // render 毎ではなく最初に mount された時にだけ icon を取得すれば十分なので、 `[]` を第2引数に渡しておく
  const matchedIcons = useMemo(() => {
    return icons.filter((icon) => {
      const target = icon.pagePath.toLowerCase();
      return target.includes(query.toLowerCase());
    });
  }, [icons, query]);
  return matchedIcons;
}

function useStyles(cursorPosition: CursorPosition) {
  const popupMenuStyle = calcPopupMenuStyle(cursorPosition);
  const triangleStyle = calcTrianglePosition(cursorPosition);
  return { popupMenuStyle, triangleStyle };
}

export const PopupMenu: FunctionComponent<PopupMenuProps> = ({ query, cursorPosition, onSelect, onClose }) => {
  const icons = useMatchedIcons(query);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const editorWidth = useMemo(() => document.querySelector('.editor')!.clientWidth, []);

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      const isTab = e.key === 'Tab' && !e.ctrlKey && !e.shiftKey && !e.altKey;
      const isShiftTab = e.key === 'Tab' && !e.ctrlKey && e.shiftKey && !e.altKey;
      const isEnter = e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey;
      const isEscape = e.key === 'Escape' && !e.ctrlKey && !e.shiftKey && !e.altKey;

      // IMEによる変換中は何もしない
      if (e.isComposing) return;

      if (isTab || isShiftTab || isEnter || isEscape) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (isTab) setSelectedIndex((selectedIndex) => (selectedIndex + 1) % icons.length);
      if (isShiftTab) setSelectedIndex((selectedIndex) => (selectedIndex - 1 + icons.length) % icons.length);
      if (isEnter) onSelect(icons[selectedIndex]);
      if (isEscape) onClose();
    },
    [icons, onClose, onSelect, selectedIndex],
  );
  useDocumentEventListener('keydown', handleKeydown, { capture: true });

  const { popupMenuStyle, triangleStyle } = useStyles(cursorPosition);

  const [sized] = useSize(({ width }) => {
    const buttonContainerStyle = calcButtonContainerPosition(editorWidth, width, cursorPosition);
    return (
      <div className="button-container" style={buttonContainerStyle}>
        {icons.map((icon) => (
          <PopupMenuButton key={icon.pagePath} icon={icon} />
        ))}
      </div>
    ) as ReactElement;
  });

  return (
    <div className="popup-menu" style={popupMenuStyle}>
      {sized}
      <div className="triangle" style={triangleStyle} />
    </div>
  );
};

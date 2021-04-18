import { css } from '@emotion/css';
import { uniqBy } from 'lodash';
import { FunctionComponent } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { getCursor, scanIconsFromNotation } from '../lib/scrapbox';
import { PopupMenuButton } from './PopupMenu/Button';

type PopupMenuProps = {
  query: string;
  onSelect: (iconPath: string) => void;
  onClose: () => void;
};

function useMatchedIcons(query: string) {
  const icons = useMemo(() => {
    const notation = scrapbox.Page.lines.map((line) => line.text).join('\n');
    const icons = scanIconsFromNotation(notation);
    return uniqBy(icons, (icon) => icon.path);
  }, []); // render 毎ではなく最初に mount された時にだけ icon を取得すれば十分なので、 `[]` を第2引数に渡しておく
  const matchedIcons = useMemo(() => {
    return icons.filter((icon) => {
      const target = icon.path.toLowerCase();
      return target.includes(query.toLowerCase());
    });
  }, [icons, query]);
  return matchedIcons;
}

function useStyles() {
  const cursor = getCursor();
  const popupMenuStyle = css`
    display: block;
    top: ${cursor.top};
  `;
  const buttonContainerStyle = css`
    left: ${cursor.left};
    transform: translateX(-50%);
  `;
  const triangleStyle = css`
    left: ${cursor.left};
  `;
  return { popupMenuStyle, buttonContainerStyle, triangleStyle };
}

export const PopupMenu: FunctionComponent<PopupMenuProps> = ({ query, onSelect, onClose }) => {
  const icons = useMatchedIcons(query);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    document.addEventListener(
      'keydown',
      (e) => {
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
        if (isEnter) onSelect(icons[selectedIndex].path);
        if (isEscape) onClose();
      },
      true,
    );
  }, [icons, onClose, onSelect, selectedIndex]);

  const { popupMenuStyle, buttonContainerStyle, triangleStyle } = useStyles();

  return (
    <div className={`popup-menu ${popupMenuStyle}`} style="left: 0px">
      <div className={`button-container ${buttonContainerStyle}`} style="transform: translateX(-50%);">
        {icons.map((icon) => (
          <PopupMenuButton key={icon.path} icon={icon} />
        ))}
      </div>
      <div className={`triangle ${triangleStyle}`} />
    </div>
  );
};

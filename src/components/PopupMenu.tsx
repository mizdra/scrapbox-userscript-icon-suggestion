import { useClassList, useRef } from 'jsx-dom';
import { useImperativeHandle } from '../hooks/useImperativeHandle';
import { RefObject } from '../types';

export type PopupMenuHandler = {
  setQuery: (query: string) => void;
  open: () => void;
  close: () => void;
};

export type PopupMenuProps = {
  rref: RefObject<PopupMenuHandler>;
  onSelect: (iconPath: string) => void;
  onClose: () => void;
};

export const PopupMenu = ({ rref: ref, onSelect, onClose }: PopupMenuProps) => {
  const cls = useClassList(['popup-menu', { hidden: true }]);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const state = {
    query: '',
  };

  useImperativeHandle(ref, {
    setQuery: (query) => {
      state.query = query;
    },
    open: () => {
      cls.remove('hidden');
    },
    close: () => {
      cls.add('hidden');
      onClose();
    },
  });

  document.addEventListener(
    'keydown',
    (e) => {
      if (cls.contains('hidden')) return;

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
      if (isTab) console.log('tab');
      if (isShiftTab) console.log('shift + tab');
      if (isEnter) onSelect(state.query);
      if (isEscape) {
        ref.current?.close();
        onClose();
      }
    },
    true,
  );

  return (
    <div className={cls} style="left: 0px">
      <div ref={buttonContainerRef} className="button-container" style="transform: translateX(-50%);" />
      <div className="triangle" />
    </div>
  );
};

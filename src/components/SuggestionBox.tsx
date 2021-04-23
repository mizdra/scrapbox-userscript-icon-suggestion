import { useClassList, useRef } from 'jsx-dom';
import { useImperativeHandle } from '../hooks/useImperativeHandle';
import { RefObject } from '../types';
import { PopupMenuHandler, PopupMenu } from './PopupMenu';

export type SuggestionBoxHandler = {
  open: () => void;
  close: () => void;
};

export type SuggestionBoxProps = {
  rref: RefObject<SuggestionBoxHandler>;
  onSelect: (iconPath: string) => void;
  onClose: () => void;
};

export const SuggestionBox = ({ rref: ref, onSelect, onClose }: SuggestionBoxProps) => {
  const cls = useClassList([{ hidden: true }]);
  const popupMenuRef = useRef<PopupMenuHandler>(null);
  const queryInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, {
    open: () => {
      if (!popupMenuRef.current || !queryInputRef.current) return;
      cls.remove('hidden');
      popupMenuRef.current.open();
      queryInputRef.current.focus();
      queryInputRef.current.value = '';
    },
    close: () => {
      cls.add('hidden');
      popupMenuRef.current?.close();
    },
  });

  const onInput = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
    popupMenuRef.current?.setQuery(e.currentTarget.value);
  };
  const onBlur = () => {
    popupMenuRef.current?.close();
  };
  const enhancedOnClose = () => {
    cls.add('hidden');
    onClose();
  };

  return (
    <div className={cls}>
      <PopupMenu rref={popupMenuRef} onSelect={onSelect} onClose={enhancedOnClose} />
      <input ref={queryInputRef} className="form-control" onInput={onInput} onBlur={onBlur} />
    </div>
  );
};

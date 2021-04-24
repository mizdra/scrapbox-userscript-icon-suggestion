import { FunctionComponent, JSX } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import { getCursor } from '../lib/scrapbox';
import { PopupMenu } from './PopupMenu';

type SuggestionBoxProps = {
  onSelect: (iconPath: string) => void;
  onClose: () => void;
};

function useStyles() {
  const cursor = getCursor();
  const queryInputStyle: JSXInternal.CSSProperties = {
    position: 'absolute',
    top: cursor.top,
    left: cursor.left,
  };
  return { queryInputStyle };
}

export const SuggestionBox: FunctionComponent<SuggestionBoxProps> = ({ onSelect, onClose }) => {
  const queryInputRef = useRef<HTMLInputElement>();
  const [query, setQuery] = useState('');
  const { queryInputStyle } = useStyles();

  const handleInput = useCallback((e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    if (e.currentTarget?.value) setQuery(e.currentTarget.value);
  }, []);
  useEffect(() => {
    queryInputRef.current.focus();
  });

  return (
    <div>
      <PopupMenu query={query} onSelect={onSelect} onClose={onClose} />;
      <input
        ref={queryInputRef}
        className="form-control"
        style={queryInputStyle}
        onInput={handleInput}
        onBlur={onClose}
      />
    </div>
  );
};

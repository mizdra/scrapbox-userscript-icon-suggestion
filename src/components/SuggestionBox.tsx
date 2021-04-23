import { css } from '@emotion/css';
import { FunctionComponent, JSX } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { PopupMenu } from './PopupMenu';

type SuggestionBoxProps = {
  onSelect: (iconPath: string) => void;
  onClose: () => void;
};

export const SuggestionBox: FunctionComponent<SuggestionBoxProps> = ({ onSelect, onClose }) => {
  const [query, setQuery] = useState('');
  const handleBlur = useCallback((e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    if (e.currentTarget?.value) setQuery(e.currentTarget.value);
  }, []);
  return (
    <div>
      <PopupMenu query={query} onSelect={onSelect} onClose={onClose} />;
      <input className="form-control" style={queryInputStyle} onBlur={handleBlur} />
    </div>
  );
};

const queryInputStyle = css`
  position: absolute;
`;

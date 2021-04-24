import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { CursorPosition, Icon } from '../types';
import { PopupMenu } from './PopupMenu';
import { QueryInput } from './QueryInput';

type SuggestionBoxProps = {
  cursorPosition: CursorPosition;
  onSelect: (icon: Icon) => void;
  onClose: () => void;
};

export const SuggestionBox: FunctionComponent<SuggestionBoxProps> = ({ cursorPosition, onSelect, onClose }) => {
  const [query, setQuery] = useState('');

  return (
    <div>
      <PopupMenu cursorPosition={cursorPosition} query={query} onSelect={onSelect} onClose={onClose} />
      <QueryInput defaultQuery={query} cursorPosition={cursorPosition} onInput={setQuery} onBlur={onClose} />
    </div>
  );
};

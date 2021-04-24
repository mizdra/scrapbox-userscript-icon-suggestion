import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { PopupMenu } from './PopupMenu';
import { QueryInput } from './QueryInput';

type SuggestionBoxProps = {
  onSelect: (iconPath: string) => void;
  onClose: () => void;
};

export const SuggestionBox: FunctionComponent<SuggestionBoxProps> = ({ onSelect, onClose }) => {
  const [query, setQuery] = useState('');

  return (
    <div>
      <PopupMenu query={query} onSelect={onSelect} onClose={onClose} />
      <QueryInput defaultQuery={query} onInput={setQuery} onBlur={onClose} />
    </div>
  );
};

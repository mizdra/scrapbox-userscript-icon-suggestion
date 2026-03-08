import type { ComponentChild } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';
import type { Icon } from '../lib/icon';
import type { CursorPosition } from '../types';
import { PopupMenu } from './PopupMenu';

export type ComboBoxProps = {
  cursorPosition: CursorPosition;
  matcher: (query: string) => Icon[];
  onSelect?: (icon: Icon) => void;
  onBlur?: () => void;
};

/**
 * アイコンを検索・選択するためのコンボボックスコンポーネント。
 * テキスト入力による検索と、ポップアップメニューによるアイコン選択を組み合わせたもの。
 */
export function ComboBox({ cursorPosition, matcher, onSelect, onBlur }: ComboBoxProps) {
  const [query, setQuery] = useState('');
  const matchedIcons = useMemo(() => matcher(query), [matcher, query]);

  const handleSelect = useCallback(
    (_icon: ComponentChild, index: number) => {
      onSelect?.(matchedIcons[index]!);
    },
    [matchedIcons, onSelect],
  );

  return (
    <div>
      <PopupMenu icons={matchedIcons} cursorPosition={cursorPosition} onSelect={handleSelect} />
      {/* <SearchInput defaultQuery={query} cursorPosition={cursorPosition} onInput={setQuery} onBlur={onBlur} /> */}
    </div>
  );
}

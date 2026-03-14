import type { ComponentChild } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';
import type { Icon } from '../lib/icon';
import { PopupMenu } from './PopupMenu';
import { SearchInput } from './SearchInput';

export type ComboBoxProps = {
  matcher: (query: string) => Icon[];
  onSelect?: (icon: Icon) => void;
  onBlur?: () => void;
};

/**
 * アイコンを検索・選択するためのコンボボックスコンポーネント。
 * テキスト入力による検索と、ポップアップメニューによるアイコン選択を組み合わせたもの。
 */
export function ComboBox({ matcher, onSelect, onBlur }: ComboBoxProps) {
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
      <PopupMenu icons={matchedIcons} onSelect={handleSelect} />
      <SearchInput defaultQuery={query} onInput={setQuery} onBlur={onBlur} />
    </div>
  );
}

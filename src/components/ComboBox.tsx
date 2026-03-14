import { useMemo, useState } from 'preact/hooks';
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
  const matchedIcons = useMemo(
    // 多すぎるとポップアップがデカすぎて表示が崩れるので最大8件に絞る
    () => matcher(query).slice(0, 8),
    [matcher, query],
  );
  return (
    <div>
      <PopupMenu icons={matchedIcons} onSelect={onSelect} />
      <SearchInput defaultQuery={query} onInput={setQuery} onBlur={onBlur} />
    </div>
  );
}

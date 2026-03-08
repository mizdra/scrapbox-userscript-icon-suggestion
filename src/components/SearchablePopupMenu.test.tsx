import { act, fireEvent, render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { Icon } from '../lib/icon';
import { forwardMatcher } from '../lib/matcher';
import { keydownEnterEvent, keydownEscapeEvent } from '../test/helpers/key';
import type { CursorPosition } from '../types';
import type { SearchablePopupMenuProps } from './SearchablePopupMenu';
import { SearchablePopupMenu } from './SearchablePopupMenu';

// ダミーの props
const cursorPosition: CursorPosition = { styleTop: 0, styleLeft: 0 };
const icons = [
  new Icon('project', 'a'),
  new Icon('project', 'ab'),
  new Icon('project', 'abc'),
  new Icon('project', 'z'),
];
const matcher = (query: string) => forwardMatcher({ query, composedIcons: icons, embeddedIcons: [], presetIcons: [] });
const props: SearchablePopupMenuProps = {
  cursorPosition,
  matcher,
  isExitIconSuggestionKey: (e: KeyboardEvent) => {
    return e.key === 'Escape' && !e.ctrlKey && !e.shiftKey && !e.altKey;
  },
};

describe('SearchablePopupMenu', () => {
  test('ポップアップと SearchInput が表示される', () => {
    const { asFragment, queryByTestId } = render(<SearchablePopupMenu {...props} />);
    expect(queryByTestId('popup-menu')).not.toBeNull();
    expect(queryByTestId('search-input')).not.toBeNull();
    expect(asFragment()).toMatchSnapshot();
  });
  test('Esc 押下で onClose が呼び出される', async () => {
    const onClose = vi.fn();
    render(<SearchablePopupMenu {...props} onClose={onClose} />);
    expect(onClose).toBeCalledTimes(0);
    await act(() => {
      fireEvent(document, keydownEscapeEvent);
    });
    expect(onClose).toBeCalledTimes(1);
  });
  describe('ポップアップに表示されるアイテムが空の時', () => {
    test('emptyMessage でアイテムが空の時のメッセージを変更できる', () => {
      const emptyMessage = 'test';
      const { getByText } = render(<SearchablePopupMenu {...props} matcher={() => []} emptyMessage={emptyMessage} />);
      expect(getByText(emptyMessage)).toBeInTheDocument();
    });
  });
  describe('ポップアップに表示されるアイテムが空でない時', () => {
    test('SearchInput に文字を入力するとアイテムがフィルタされる', async () => {
      const { getByTestId } = render(<SearchablePopupMenu {...props} />);
      const buttonContainer = getByTestId('button-container');
      const searchInput = getByTestId('search-input');

      expect(buttonContainer.childElementCount).toEqual(4);
      await userEvent.type(searchInput, 'a');
      expect(buttonContainer.childElementCount).toEqual(3);
      await userEvent.type(searchInput, 'b');
      expect(buttonContainer.childElementCount).toEqual(2);
      await userEvent.type(searchInput, 'c');
      expect(buttonContainer.childElementCount).toEqual(1);
      await userEvent.type(searchInput, 'd');
      expect(buttonContainer.childElementCount).toEqual(0);
    });
    test('Enter 押下で onSelect が呼び出される', async () => {
      const onSelect = vi.fn();
      render(<SearchablePopupMenu {...props} onSelect={onSelect} />);
      expect(onSelect).toBeCalledTimes(0);
      await act(() => {
        fireEvent(document, keydownEnterEvent);
      });
      expect(onSelect).toBeCalledTimes(1);
    });
  });
});

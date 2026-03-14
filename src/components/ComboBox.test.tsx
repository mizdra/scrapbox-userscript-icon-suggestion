import { act, fireEvent } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { Icon } from '../lib/icon';
import { forwardMatcher } from '../lib/matcher';
import { keydownEnterEvent } from '../test/helpers/key';
import { render } from '../test/renderer';
import type { CursorPosition } from '../types';
import type { ComboBoxProps } from './ComboBox';
import { ComboBox } from './ComboBox';

// ダミーの props
const cursorPosition: CursorPosition = { styleTop: 0, styleLeft: 0 };
const icons = [
  new Icon('project', 'a'),
  new Icon('project', 'ab'),
  new Icon('project', 'abc'),
  new Icon('project', 'z'),
];
const matcher = (query: string) => forwardMatcher({ query, composedIcons: icons, embeddedIcons: [], presetIcons: [] });
const props: ComboBoxProps = {
  cursorPosition,
  matcher,
};

describe('ComboBox', () => {
  test('ポップアップと SearchInput が表示される', () => {
    const { queryByTestId } = render(<ComboBox {...props} />);
    expect(queryByTestId('popup-menu')).not.toBeNull();
    expect(queryByTestId('search-input')).not.toBeNull();
  });
  test('SearchInput に文字を入力するとアイテムがフィルタされる', async () => {
    const { getByTestId } = render(<ComboBox {...props} />);
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
    render(<ComboBox {...props} onSelect={onSelect} />);
    expect(onSelect).toBeCalledTimes(0);
    await act(() => {
      fireEvent(document, keydownEnterEvent);
    });
    expect(onSelect).toBeCalledTimes(1);
  });
});

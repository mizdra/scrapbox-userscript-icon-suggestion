import { fireEvent, waitFor } from '@testing-library/preact';
import { render } from '../test/renderer';
import { SearchInput } from './SearchInput';

const waitRaf = async () =>
  new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });

// ダミーの props
const props = {};

describe('SearchInput', () => {
  test('auto-focus される', async () => {
    const { getByTestId } = render(<SearchInput {...props} />);
    const input = getByTestId('search-input');
    await waitRaf(); // 一拍置いてから focus されるので待つ
    expect(input).toHaveFocus();
  });
  test('defaultQuery が設定できる', () => {
    const { getByTestId } = render(<SearchInput {...props} defaultQuery="text" />);
    const input = getByTestId('search-input');
    expect(input).toHaveValue('text');
  });
  test('文字を入力すると onInput が発火する', async () => {
    const onInput = vi.fn();
    const query = 'test';

    const { getByTestId } = render(<SearchInput {...props} onInput={onInput} />);
    const input = getByTestId('search-input');

    expect(onInput).not.toHaveBeenCalled();
    fireEvent.input(input, { target: { value: query } });

    await waitFor(() => {
      expect(onInput).toHaveBeenCalled();
      expect(onInput).toHaveBeenCalledWith(query);
    });
  });
  test('フォーカスを外すと onBlur が発火する', async () => {
    const onBlur = vi.fn();
    const { getByTestId } = render(<SearchInput {...props} onBlur={onBlur} />);
    const input = getByTestId('search-input');

    expect(onBlur).not.toHaveBeenCalled();
    fireEvent.blur(input);

    await waitFor(() => {
      expect(onBlur).toHaveBeenCalled();
    });
  });
});

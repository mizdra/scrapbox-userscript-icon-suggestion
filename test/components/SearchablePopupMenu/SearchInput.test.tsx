import { fireEvent, render, waitFor } from '@testing-library/preact';
import faker from 'faker';
import { SearchInput } from '../../../src/components/SearchablePopupMenu/SearchInput';
import { ScrapboxContext } from '../../../src/contexts/ScrapboxContext';
import { calcSearchInputStyle } from '../../../src/lib/calc-style';
import { CursorPosition } from '../../../src/types';
import { createEditor, createScrapboxAPI } from '../../helpers/html';

const waitRaf = async () => new Promise((resolve) => requestAnimationFrame(resolve));

// ダミーの props
const cursorPosition: CursorPosition = { styleTop: 0, styleLeft: 0 };
const props = { cursorPosition };

describe('SearchInput', () => {
  test('スタイル属性が表示される', () => {
    // テストケース側で作成した editor を使ってレンダリングしたいので、Context を使う
    const editor = createEditor();
    const scrapbox = createScrapboxAPI();
    const { getByTestId } = render(
      <ScrapboxContext.Provider value={{ editor, scrapbox }}>
        <SearchInput {...props} />
      </ScrapboxContext.Provider>,
    );

    const input = getByTestId('search-input');
    const expectedStyles = calcSearchInputStyle(editor.clientWidth, cursorPosition);
    expect(input).toHaveStyle(expectedStyles);
  });
  test('auto-focus される', async () => {
    const { getByTestId } = render(<SearchInput {...props} />);
    const input = getByTestId('search-input');
    await waitRaf(); // 一拍置いてから focus されるので待つ
    expect(input).toHaveFocus();
  });
  test('defaultQuery が設定できる', () => {
    const { getByTestId } = render(<SearchInput {...props} defaultQuery={'text'} />);
    const input = getByTestId('search-input');
    expect(input).toHaveValue('text');
  });
  test('文字を入力すると onInput が発火する', async () => {
    const onInput = jest.fn();
    const query = faker.helpers.randomize(['', faker.datatype.string()]);

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
    const onBlur = jest.fn();
    const { getByTestId } = render(<SearchInput {...props} onBlur={onBlur} />);
    const input = getByTestId('search-input');

    expect(onBlur).not.toHaveBeenCalled();
    fireEvent.blur(input);

    await waitFor(() => {
      expect(onBlur).toHaveBeenCalled();
    });
  });
});

import { fireEvent, render, waitFor } from '@testing-library/preact';
import faker from 'faker';
import { QueryInput } from '../../../src/components/SuggestionBox/QueryInput';
import { ScrapboxContext } from '../../../src/contexts/ScrapboxContext';
import { calcQueryInputStyle } from '../../../src/lib/calc-style';
import { CursorPosition } from '../../../src/types';
import { createEditor, createScrapboxAPI } from '../../helpers/html';

const waitRaf = async () => new Promise((resolve) => requestAnimationFrame(resolve));

// ダミーの props
const cursorPosition: CursorPosition = { styleTop: 0, styleLeft: 0 };
const props = { cursorPosition };

describe('QueryInput', () => {
  test('スタイル属性が表示される', () => {
    // テストケース側で作成した editor を使ってレンダリングしたいので、Context を使う
    const editor = createEditor();
    const scrapbox = createScrapboxAPI();
    const { getByTestId } = render(
      <ScrapboxContext.Provider value={{ editor, scrapbox }}>
        <QueryInput {...props} />
      </ScrapboxContext.Provider>,
    );

    const input = getByTestId('query-input');
    const expectedStyles = calcQueryInputStyle(editor.clientWidth, cursorPosition);
    expect(input).toHaveStyle(expectedStyles);
  });
  test('auto-focus される', async () => {
    const { getByTestId } = render(<QueryInput {...props} />);
    const input = getByTestId('query-input');
    await waitRaf(); // 一拍置いてから focus されるので待つ
    expect(input).toHaveFocus();
  });
  test('defaultQuery が設定できる', () => {
    const { getByTestId } = render(<QueryInput {...props} defaultQuery={'text'} />);
    const input = getByTestId('query-input');
    expect(input).toHaveValue('text');
  });
  test('文字を入力すると onInput が発火する', async () => {
    const onInput = jest.fn();
    const query = faker.helpers.randomize(['', faker.datatype.string()]);

    const { getByTestId } = render(<QueryInput {...props} onInput={onInput} />);
    const input = getByTestId('query-input');

    expect(onInput).not.toHaveBeenCalled();
    fireEvent.input(input, { target: { value: query } });

    await waitFor(() => {
      expect(onInput).toHaveBeenCalled();
      expect(onInput).toHaveBeenCalledWith(query);
    });
  });
  test('フォーカスを外すと onBlur が発火する', async () => {
    const onBlur = jest.fn();
    const { getByTestId } = render(<QueryInput {...props} onBlur={onBlur} />);
    const input = getByTestId('query-input');

    expect(onBlur).not.toHaveBeenCalled();
    fireEvent.blur(input);

    await waitFor(() => {
      expect(onBlur).toHaveBeenCalled();
    });
  });
});

import { fireEvent, render, waitFor } from '@testing-library/preact';
import { QueryInput } from '../../../src/components/SuggestionBox/QueryInput';
import { calcQueryInputStyle } from '../../../src/lib/calc-style';
import { CursorPosition } from '../../../src/types';
import { createEditor } from '../../helpers/html';

// ダミーの cursorPosition
const cursorPosition: CursorPosition = { styleTop: 0, styleLeft: 0 };

// <QueryInput> は .editor 要素が document にあることを前提にしているので、 document に .editor を埋め込んでおく
const editor = createEditor();
document.body.appendChild(editor);

describe('QueryInput', () => {
  test('スタイル属性が表示される', () => {
    const { getByRole } = render(<QueryInput cursorPosition={cursorPosition} />);
    const input = getByRole('textbox');
    const expectedStyles = calcQueryInputStyle(editor.clientWidth, cursorPosition);
    expect(input).toHaveStyle(expectedStyles);
  });
  test('auto-focus される', () => {
    const { getByRole } = render(<QueryInput cursorPosition={cursorPosition} />);
    const input = getByRole('textbox');
    expect(input).toHaveFocus();
  });
  test('defaultQuery が設定できる', () => {
    const { getByRole } = render(<QueryInput cursorPosition={cursorPosition} defaultQuery={'text'} />);
    const input = getByRole('textbox');
    expect(input).toHaveValue('text');
  });
  test('文字を入力すると onInput が発火する', async () => {
    const onInput = jest.fn();
    const { getByRole } = render(<QueryInput cursorPosition={cursorPosition} onInput={onInput} />);
    const input = getByRole('textbox');

    expect(onInput).not.toHaveBeenCalled();
    fireEvent.input(input, { target: { value: 'query' } });

    await waitFor(() => {
      expect(onInput).toHaveBeenCalled();
      expect(onInput).toHaveBeenCalledWith('query');
    });
  });
  test('フォーカスを外すと onBlur が発火する', async () => {
    const onBlur = jest.fn();
    const { getByRole } = render(<QueryInput cursorPosition={cursorPosition} onBlur={onBlur} />);
    const input = getByRole('textbox');

    expect(onBlur).not.toHaveBeenCalled();
    fireEvent.blur(input);

    await waitFor(() => {
      expect(onBlur).toHaveBeenCalled();
    });
  });
});

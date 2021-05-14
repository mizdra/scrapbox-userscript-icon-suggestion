import { fireEvent, render, waitFor } from '@testing-library/preact';
import faker from 'faker';
import { QueryInput } from '../../../src/components/SuggestionBox/QueryInput';
import { calcQueryInputStyle } from '../../../src/lib/calc-style';
import { CursorPosition } from '../../../src/types';
import { createEditor } from '../../helpers/html';

// ダミーの props
const cursorPosition: CursorPosition = { styleTop: 0, styleLeft: 0 };
const editor = createEditor();
const props = { cursorPosition, editor };

describe('QueryInput', () => {
  test('スタイル属性が表示される', () => {
    const { getByRole } = render(<QueryInput {...props} />);
    const input = getByRole('textbox');
    const expectedStyles = calcQueryInputStyle(editor.clientWidth, cursorPosition);
    expect(input).toHaveStyle(expectedStyles);
  });
  test('auto-focus される', () => {
    const { getByRole } = render(<QueryInput {...props} />);
    const input = getByRole('textbox');
    expect(input).toHaveFocus();
  });
  test('defaultQuery が設定できる', () => {
    const { getByRole } = render(<QueryInput {...props} defaultQuery={'text'} />);
    const input = getByRole('textbox');
    expect(input).toHaveValue('text');
  });
  test('文字を入力すると onInput が発火する', async () => {
    const onInput = jest.fn();
    const query = faker.helpers.randomize(['', faker.datatype.string()]);

    const { getByRole } = render(<QueryInput {...props} onInput={onInput} />);
    const input = getByRole('textbox');

    expect(onInput).not.toHaveBeenCalled();
    fireEvent.input(input, { target: { value: query } });

    await waitFor(() => {
      expect(onInput).toHaveBeenCalled();
      expect(onInput).toHaveBeenCalledWith(query);
    });
  });
  test('フォーカスを外すと onBlur が発火する', async () => {
    const onBlur = jest.fn();
    const { getByRole } = render(<QueryInput {...props} onBlur={onBlur} />);
    const input = getByRole('textbox');

    expect(onBlur).not.toHaveBeenCalled();
    fireEvent.blur(input);

    await waitFor(() => {
      expect(onBlur).toHaveBeenCalled();
    });
  });
});

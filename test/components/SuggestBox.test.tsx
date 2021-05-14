import '../mocks/resize-observer';
import { act, fireEvent, render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { datatype } from 'faker';
import { matchItems, SuggestionBox } from '../../src/components/SuggestionBox';
import { CursorPosition } from '../../src/types';
import { createEditor } from '../helpers/html';
import { keydownEnterEvent, keydownEscapeEvent } from '../helpers/key';

// ダミーの プロパティ
const cursorPosition: CursorPosition = { styleTop: 0, styleLeft: 0 };
const items = [
  { element: <span key="1">a</span>, searchableText: 'a', value: 'a' },
  { element: <span key="2">ab</span>, searchableText: 'ab', value: 'ab' },
  { element: <span key="3">abc</span>, searchableText: 'abc', value: 'abc' },
  { element: <span key="4">z</span>, searchableText: 'z', value: 'z' },
];

// .editor 要素が document にあることを前提にしているので、 document に .editor を埋め込んでおく
const editor = createEditor();
document.body.appendChild(editor);

describe('matchItems', () => {
  test('query に部分一致する items のみが返る', () => {
    expect(
      matchItems('foo', [
        // マッチする
        { element: '', searchableText: 'foo', value: '' },
        { element: '', searchableText: 'foo bar', value: '' },
        { element: '', searchableText: 'foo bar baz', value: '' },
        { element: '', searchableText: 'bar foo baz', value: '' },
        { element: '', searchableText: 'bar baz foo', value: '' },
        { element: '', searchableText: 'foo foo foo', value: '' },
        // マッチしない
        { element: '', searchableText: 'bar', value: '' },
        { element: '', searchableText: 'fo bar', value: '' },
        { element: '', searchableText: 'fo o bar', value: '' },
      ]),
    ).toStrictEqual([
      { element: '', searchableText: 'foo', value: '' },
      { element: '', searchableText: 'foo bar', value: '' },
      { element: '', searchableText: 'foo bar baz', value: '' },
      { element: '', searchableText: 'bar foo baz', value: '' },
      { element: '', searchableText: 'bar baz foo', value: '' },
      { element: '', searchableText: 'foo foo foo', value: '' },
    ]);
  });
  test('マッチは capital-insensitive', () => {
    expect(
      matchItems('foo', [
        { element: '', searchableText: 'Foo', value: '' },
        { element: '', searchableText: 'FOO', value: '' },
        { element: '', searchableText: 'fOo', value: '' },
      ]),
    ).toStrictEqual([
      { element: '', searchableText: 'Foo', value: '' },
      { element: '', searchableText: 'FOO', value: '' },
      { element: '', searchableText: 'fOo', value: '' },
    ]);
    expect(
      matchItems('FOO', [
        { element: '', searchableText: 'Foo', value: '' },
        { element: '', searchableText: 'FOO', value: '' },
        { element: '', searchableText: 'fOo', value: '' },
      ]),
    ).toStrictEqual([
      { element: '', searchableText: 'Foo', value: '' },
      { element: '', searchableText: 'FOO', value: '' },
      { element: '', searchableText: 'fOo', value: '' },
    ]);
  });
});

describe('SuggestionBox', () => {
  describe('open === false の時', () => {
    test('ポップアップも QueryInput も表示されない', () => {
      const { asFragment, queryByRole, queryByTestId } = render(
        <SuggestionBox open={false} cursorPosition={cursorPosition} items={items} />,
      );
      expect(queryByTestId('popup-menu')).toBeNull();
      expect(queryByRole('textbox')).toBeNull();
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe('open === true の時', () => {
    test('ポップアップと QueryInput が表示される', () => {
      const { asFragment, queryByRole, queryByTestId } = render(
        <SuggestionBox open cursorPosition={cursorPosition} items={items} />,
      );
      expect(queryByTestId('popup-menu')).not.toBeNull();
      expect(queryByRole('textbox')).not.toBeNull();
      expect(asFragment()).toMatchSnapshot();
    });
    test('Esc 押下で onClose が呼び出される', async () => {
      const onClose = jest.fn();
      render(<SuggestionBox open cursorPosition={cursorPosition} items={items} onClose={onClose} />);
      expect(onClose).toBeCalledTimes(0);
      await act(() => {
        fireEvent(document, keydownEscapeEvent);
      });
      expect(onClose).toBeCalledTimes(1);
    });
    describe('ポップアップに表示されるアイテムが空の時', () => {
      test('emptyMessage でアイテムが空の時のメッセージを変更できる', () => {
        const emptyMessage = datatype.string();
        const { getByText } = render(
          <SuggestionBox open cursorPosition={cursorPosition} items={[]} emptyMessage={emptyMessage} />,
        );
        expect(getByText(emptyMessage)).toBeInTheDocument();
      });
      test('Enter 押下で onSelectNonexistent が呼び出される', async () => {
        const onSelectNonexistent = jest.fn();
        render(
          <SuggestionBox open cursorPosition={cursorPosition} items={[]} onSelectNonexistent={onSelectNonexistent} />,
        );
        expect(onSelectNonexistent).toBeCalledTimes(0);
        await act(() => {
          fireEvent(document, keydownEnterEvent);
        });
        expect(onSelectNonexistent).toBeCalledTimes(1);
      });
    });
    describe('ポップアップに表示されるアイテムが空でない時', () => {
      test('QueryInput に文字を入力するとアイテムがフィルタされる', () => {
        const { getByTestId, getByRole } = render(<SuggestionBox open cursorPosition={cursorPosition} items={items} />);
        const buttonContainer = getByTestId('button-container');
        const queryInput = getByRole('textbox');

        expect(buttonContainer.childElementCount).toEqual(4);
        userEvent.type(queryInput, 'a');
        expect(buttonContainer.childElementCount).toEqual(3);
        userEvent.type(queryInput, 'b');
        expect(buttonContainer.childElementCount).toEqual(2);
        userEvent.type(queryInput, 'c');
        expect(buttonContainer.childElementCount).toEqual(1);
        userEvent.type(queryInput, 'd');
        expect(buttonContainer.childElementCount).toEqual(0);
      });
      test('Enter 押下で onSelect が呼び出される', async () => {
        const onSelect = jest.fn();
        render(<SuggestionBox open cursorPosition={cursorPosition} items={items} onSelect={onSelect} />);
        expect(onSelect).toBeCalledTimes(0);
        await act(() => {
          fireEvent(document, keydownEnterEvent);
        });
        expect(onSelect).toBeCalledTimes(1);
      });
    });
  });
  test('open === true になった時に、 QueryInput に入力された文字がリセットされる', () => {
    console.log('wei');
    const { rerender, getByRole } = render(<SuggestionBox open cursorPosition={cursorPosition} items={items} />);

    userEvent.type(getByRole('textbox'), 'a');
    expect(getByRole('textbox')).toHaveValue('a');

    rerender(<SuggestionBox open={false} cursorPosition={cursorPosition} items={items} />);
    rerender(<SuggestionBox open cursorPosition={cursorPosition} items={items} />);

    expect(getByRole('textbox')).toHaveValue('');
  });
});

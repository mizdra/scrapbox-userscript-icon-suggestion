import '../mocks/resize-observer';
import { act, fireEvent, render } from '@testing-library/preact';
import { matchItems, SuggestionBox } from '../../src/components/SuggestionBox';
import { CursorPosition } from '../../src/types';
import { createEditor } from '../helpers/html';

// ダミーの プロパティ
const cursorPosition: CursorPosition = { styleTop: 0, styleLeft: 0 };
const items = [
  { element: <span key="1">item1</span>, searchableText: 'item1', value: 'item1' },
  { element: <span key="2">item2</span>, searchableText: 'item2', value: 'item2' },
  { element: <span key="3">item3</span>, searchableText: 'item3', value: 'item3' },
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
    test.todo('Esc 押下で onClose が呼び出される');
    describe('ポップアップに表示されるアイテムが空の時', () => {
      test.todo('emptyMessage でアイテムが空の時のメッセージを変更できる');
      test.todo('Enter 押下で onSelectNonexistent が呼び出される');
    });
    describe('ポップアップに表示されるアイテムが空でない時', () => {
      test.todo('QueryInput に文字を入力するとアイテムがフィルタされる');
      test.todo('Enter 押下で onSelect が呼び出される');
    });
  });
});

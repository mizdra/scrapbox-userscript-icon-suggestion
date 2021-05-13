import { matchItems } from '../../src/components/SuggestionBox';
import { createEditor } from '../helpers/html';
import '../mocks/resize-observer';

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
    test.todo('ポップアップも QueryInput も表示されない');
  });
  describe('open === true の時', () => {
    test.todo('ポップアップと QueryInput が表示される');
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

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

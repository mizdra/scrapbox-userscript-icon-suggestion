import { fuzzyMatcher } from '../../src/lib/matcher';

describe('fuzzyMatcher', () => {
  test('query にあいまい一致する items のみが返る', () => {
    expect(
      fuzzyMatcher('foo', [
        // マッチする
        { key: 0, element: '', searchableText: 'foo', value: '' },
        { key: 1, element: '', searchableText: 'foo bar', value: '' },
        { key: 2, element: '', searchableText: 'foo bar baz', value: '' },
        { key: 3, element: '', searchableText: 'bar foo baz', value: '' },
        { key: 4, element: '', searchableText: 'bar baz foo', value: '' },
        { key: 5, element: '', searchableText: 'foo foo foo', value: '' },
        { key: 6, element: '', searchableText: 'fo bar', value: '' },
        { key: 7, element: '', searchableText: 'fo o bar', value: '' },
        // マッチしない
        { key: 8, element: '', searchableText: 'fee', value: '' },
        { key: 9, element: '', searchableText: 'bar', value: '' },
      ]),
    ).toStrictEqual([
      { key: 0, element: '', searchableText: 'foo', value: '' },
      { key: 1, element: '', searchableText: 'foo bar', value: '' },
      { key: 2, element: '', searchableText: 'foo bar baz', value: '' },
      { key: 3, element: '', searchableText: 'bar foo baz', value: '' },
      { key: 4, element: '', searchableText: 'bar baz foo', value: '' },
      { key: 5, element: '', searchableText: 'foo foo foo', value: '' },
      { key: 6, element: '', searchableText: 'fo bar', value: '' },
      { key: 7, element: '', searchableText: 'fo o bar', value: '' },
    ]);
  });
  test('マッチは capital-insensitive', () => {
    expect(
      fuzzyMatcher('foo', [
        { key: 0, element: '', searchableText: 'Foo', value: '' },
        { key: 1, element: '', searchableText: 'FOO', value: '' },
        { key: 2, element: '', searchableText: 'fOo', value: '' },
      ]),
    ).toStrictEqual([
      { key: 0, element: '', searchableText: 'Foo', value: '' },
      { key: 1, element: '', searchableText: 'FOO', value: '' },
      { key: 2, element: '', searchableText: 'fOo', value: '' },
    ]);
    expect(
      fuzzyMatcher('FOO', [
        { key: 0, element: '', searchableText: 'Foo', value: '' },
        { key: 1, element: '', searchableText: 'FOO', value: '' },
        { key: 2, element: '', searchableText: 'fOo', value: '' },
      ]),
    ).toStrictEqual([
      { key: 0, element: '', searchableText: 'Foo', value: '' },
      { key: 1, element: '', searchableText: 'FOO', value: '' },
      { key: 2, element: '', searchableText: 'fOo', value: '' },
    ]);
  });
});

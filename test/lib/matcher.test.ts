import { combinedMatcher, fuzzyMatcher, includesMatcher, startsWithMatcher } from '../../src/lib/matcher';

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

describe('startsWithMatcher', () => {
  test('query に前方一致する items のみが返る', () => {
    expect(
      startsWithMatcher('foo', [
        // マッチする
        { key: 0, element: '', searchableText: 'foo', value: '' },
        { key: 1, element: '', searchableText: 'foo bar', value: '' },
        // マッチしない
        { key: 2, element: '', searchableText: 'bar foo', value: '' },
        { key: 3, element: '', searchableText: 'fo bar', value: '' },
      ]),
    ).toStrictEqual([
      { key: 0, element: '', searchableText: 'foo', value: '' },
      { key: 1, element: '', searchableText: 'foo bar', value: '' },
    ]);
  });
  test('マッチは capital-insensitive', () => {
    expect(
      startsWithMatcher('foo', [
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
      startsWithMatcher('FOO', [
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

describe('includesMatcher', () => {
  test('query に部分一致する items のみが返る', () => {
    expect(
      includesMatcher('foo', [
        // マッチする
        { key: 0, element: '', searchableText: 'foo', value: '' },
        { key: 1, element: '', searchableText: 'foo bar', value: '' },
        { key: 2, element: '', searchableText: 'foo bar baz', value: '' },
        { key: 3, element: '', searchableText: 'bar foo baz', value: '' },
        { key: 4, element: '', searchableText: 'bar baz foo', value: '' },
        // マッチしない
        { key: 3, element: '', searchableText: 'fo bar', value: '' },
      ]),
    ).toStrictEqual([
      { key: 0, element: '', searchableText: 'foo', value: '' },
      { key: 1, element: '', searchableText: 'foo bar', value: '' },
      { key: 2, element: '', searchableText: 'foo bar baz', value: '' },
      { key: 3, element: '', searchableText: 'bar foo baz', value: '' },
      { key: 4, element: '', searchableText: 'bar baz foo', value: '' },
    ]);
  });
  test('マッチは capital-insensitive', () => {
    expect(
      includesMatcher('foo', [
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
      includesMatcher('FOO', [
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

describe('combinedMatcher', () => {
  test('前方一致 > 部分一致 > 曖昧検索 の順で並び替えられて返される', () => {
    expect(
      combinedMatcher('foo', [
        // 曖昧一致する
        { key: 1, element: '', searchableText: 'fox bar', value: '' },
        { key: 2, element: '', searchableText: 'zoo bar', value: '' },
        // 部分一致する
        { key: 3, element: '', searchableText: 'bar foo baz', value: '' },
        { key: 4, element: '', searchableText: 'bar baz foo', value: '' },
        // 前方一致する
        { key: 5, element: '', searchableText: 'foo', value: '' },
        { key: 6, element: '', searchableText: 'foo bar', value: '' },
        // マッチしない
        { key: 7, element: '', searchableText: 'mizdra', value: '' },
      ]),
    ).toStrictEqual([
      { key: 5, element: '', searchableText: 'foo', value: '' },
      { key: 6, element: '', searchableText: 'foo bar', value: '' },
      { key: 3, element: '', searchableText: 'bar foo baz', value: '' },
      { key: 4, element: '', searchableText: 'bar baz foo', value: '' },
      { key: 1, element: '', searchableText: 'fox bar', value: '' },
      { key: 2, element: '', searchableText: 'zoo bar', value: '' },
    ]);
  });
});

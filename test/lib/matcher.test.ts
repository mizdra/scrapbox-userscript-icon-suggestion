import { Icon } from '../../src/lib/icon';
import { forwardPartialFuzzyMatcher, fuzzyMatcher, partialMatcher, forwardMatcher } from '../../src/lib/matcher';

describe('fuzzyMatcher', () => {
  describe('query に曖昧一致する icons のみが返る', () => {
    test('query の長さが 0〜2 なら 1 文字も誤字を許容しない', () => {
      expect(
        fuzzyMatcher('aa', [
          // マッチする
          new Icon('project', 'aa'),
          // マッチしない
          new Icon('project', 'ab'),
        ]),
      ).toStrictEqual([new Icon('project', 'aa')]);
    });
    test('query の長さが 3〜5 なら 1 文字まで誤字を許容する', () => {
      expect(
        fuzzyMatcher('aaa', [
          // マッチする
          new Icon('project', 'aaa'),
          new Icon('project', 'aab'),
          // マッチしない
          new Icon('project', 'abb'),
        ]),
      ).toStrictEqual([new Icon('project', 'aaa'), new Icon('project', 'aab')]);
    });
    test('query の長さが 6〜8 なら 2 文字まで誤字を許容する', () => {
      expect(
        fuzzyMatcher('aaaaaa', [
          // マッチする
          new Icon('project', 'aaaaaa'),
          new Icon('project', 'aaaaab'),
          new Icon('project', 'aaaabb'),
          // マッチしない
          new Icon('project', 'aaabbb'),
        ]),
      ).toStrictEqual([new Icon('project', 'aaaaaa'), new Icon('project', 'aaaaab'), new Icon('project', 'aaaabb')]);
    });
    test('query の長さが 9 以上なら 3 文字まで誤字を許容する', () => {
      expect(
        fuzzyMatcher('aaaaaaaaa', [
          // マッチする
          new Icon('project', 'aaaaaaaaa'),
          new Icon('project', 'aaaaaaaab'),
          new Icon('project', 'aaaaaaabb'),
          new Icon('project', 'aaaaaabbb'),
          // マッチしない
          new Icon('project', 'aaaaabbbb'),
        ]),
      ).toStrictEqual([
        new Icon('project', 'aaaaaaaaa'),
        new Icon('project', 'aaaaaaaab'),
        new Icon('project', 'aaaaaaabb'),
        new Icon('project', 'aaaaaabbb'),
      ]);
    });
  });
  describe('曖昧度の昇順で返ってくる', () => {
    expect(
      fuzzyMatcher('aaaaaaaaaaaa', [
        new Icon('project', 'aaaaaaaaabbb'),
        new Icon('project', 'aaaaaaaaaccc'),
        new Icon('project', 'aaaaaaaaaabb'),
        new Icon('project', 'aaaaaaaaaacc'),
        new Icon('project', 'aaaaaaaaaaab'),
        new Icon('project', 'aaaaaaaaaaac'),
        new Icon('project', 'aaaaaaaaaaaa'),
      ]),
    ).toStrictEqual([
      new Icon('project', 'aaaaaaaaaaaa'),
      new Icon('project', 'aaaaaaaaaaab'),
      new Icon('project', 'aaaaaaaaaaac'),
      new Icon('project', 'aaaaaaaaaabb'),
      new Icon('project', 'aaaaaaaaaacc'),
      new Icon('project', 'aaaaaaaaabbb'),
      new Icon('project', 'aaaaaaaaaccc'),
    ]);
  });
  describe('部分一致する', () => {
    expect(fuzzyMatcher('foo', [new Icon('project', 'foo bar'), new Icon('project', 'bar foo baz')])).toStrictEqual([
      new Icon('project', 'foo bar'),
      new Icon('project', 'bar foo baz'),
    ]);
  });
  test('マッチは capital-insensitive', () => {
    expect(
      fuzzyMatcher('foo', [new Icon('project', 'Foo'), new Icon('project', 'FOO'), new Icon('project', 'fOo')]),
    ).toStrictEqual([new Icon('project', 'Foo'), new Icon('project', 'FOO'), new Icon('project', 'fOo')]);
    expect(
      fuzzyMatcher('FOO', [new Icon('project', 'Foo'), new Icon('project', 'FOO'), new Icon('project', 'fOo')]),
    ).toStrictEqual([new Icon('project', 'Foo'), new Icon('project', 'FOO'), new Icon('project', 'fOo')]);
  });
});

describe('forwardMatcher', () => {
  test('query に前方一致する icons のみが返る', () => {
    expect(
      forwardMatcher('foo', [
        // マッチする
        new Icon('project', 'foo'),
        new Icon('project', 'foo bar'),
        // マッチしない
        new Icon('project', 'bar foo'),
        new Icon('project', 'fo bar'),
      ]),
    ).toStrictEqual([new Icon('project', 'foo'), new Icon('project', 'foo bar')]);
  });
  test('マッチは capital-insensitive', () => {
    expect(
      forwardMatcher('foo', [new Icon('project', 'Foo'), new Icon('project', 'FOO'), new Icon('project', 'fOo')]),
    ).toStrictEqual([new Icon('project', 'Foo'), new Icon('project', 'FOO'), new Icon('project', 'fOo')]);
    expect(
      forwardMatcher('FOO', [new Icon('project', 'Foo'), new Icon('project', 'FOO'), new Icon('project', 'fOo')]),
    ).toStrictEqual([new Icon('project', 'Foo'), new Icon('project', 'FOO'), new Icon('project', 'fOo')]);
  });
});

describe('partialMatcher', () => {
  test('query に部分一致する icons のみが返る', () => {
    expect(
      partialMatcher('foo', [
        // マッチする
        new Icon('project', 'foo'),
        new Icon('project', 'foo bar'),
        new Icon('project', 'foo bar baz'),
        new Icon('project', 'bar foo baz'),
        new Icon('project', 'bar baz foo'),
        // マッチしない
        new Icon('project', 'fo bar'),
      ]),
    ).toStrictEqual([
      new Icon('project', 'foo'),
      new Icon('project', 'foo bar'),
      new Icon('project', 'foo bar baz'),
      new Icon('project', 'bar foo baz'),
      new Icon('project', 'bar baz foo'),
    ]);
  });
  test('マッチは capital-insensitive', () => {
    expect(
      partialMatcher('foo', [new Icon('project', 'Foo'), new Icon('project', 'FOO'), new Icon('project', 'fOo')]),
    ).toStrictEqual([new Icon('project', 'Foo'), new Icon('project', 'FOO'), new Icon('project', 'fOo')]);
    expect(
      partialMatcher('FOO', [new Icon('project', 'Foo'), new Icon('project', 'FOO'), new Icon('project', 'fOo')]),
    ).toStrictEqual([new Icon('project', 'Foo'), new Icon('project', 'FOO'), new Icon('project', 'fOo')]);
  });
});

describe('forwardPartialFuzzyMatcher', () => {
  test('前方一致 > 部分一致 > 曖昧一致 の順で並び替えられて返される', () => {
    expect(
      forwardPartialFuzzyMatcher('aaaa', [
        // 曖昧一致する
        new Icon('project', 'aaab'),
        new Icon('project', 'aaac'),
        // 部分一致する
        new Icon('project', 'bbbb aaaa cccc'),
        new Icon('project', 'bbbb cccc aaaa'),
        // 前方一致する
        new Icon('project', 'aaaa'),
        new Icon('project', 'aaaa bbbb'),
        // マッチしない
        new Icon('project', 'mizdra'),
      ]),
    ).toStrictEqual([
      new Icon('project', 'aaaa'),
      new Icon('project', 'aaaa bbbb'),
      new Icon('project', 'bbbb aaaa cccc'),
      new Icon('project', 'bbbb cccc aaaa'),
      new Icon('project', 'aaab'),
      new Icon('project', 'aaac'),
    ]);
  });
});

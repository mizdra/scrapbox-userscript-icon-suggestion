import { Icon } from '../../src';
import { uniqueBy, uniqueIcons } from '../../src/lib/collection';

describe('uniqueBy', () => {
  test('空配列が入力されたら空配列を返す', () => {
    expect(uniqueBy([], () => 0)).toStrictEqual([]);
  });
  test('関数の戻り値をキーとして unique される', () => {
    expect(
      uniqueBy(
        [
          { key: 'a', value: 0 },
          { key: 'a', value: 1 },
          { key: 'b', value: 2 },
          { key: 'b', value: 3 },
          { key: 'c', value: 4 },
          { key: 'c', value: 5 },
        ],
        (el) => el.key,
      ),
    ).toStrictEqual([
      { key: 'a', value: 0 },
      { key: 'b', value: 2 },
      { key: 'c', value: 4 },
    ]);
  });
});

test('uniqueIcons', () => {
  expect(uniqueIcons([])).toStrictEqual([]);
  expect(
    uniqueIcons([
      new Icon('project', 'a'),
      new Icon('project', 'a'),
      new Icon('project', 'b'),
      new Icon('other-project', 'b'),
      new Icon('other-project', 'c'),
    ]),
  ).toStrictEqual([
    new Icon('project', 'a'),
    new Icon('project', 'b'),
    new Icon('other-project', 'b'),
    new Icon('other-project', 'c'),
  ]);
});

import { Icon, iconLinkElementToIcon, pagePathToIcon } from '../../src/lib/icon';
import { createIconLinkElement } from '../helpers/html';

describe('pagePathToIcon', () => {
  test('`pagePath` が相対パスの時', () => {
    expect(pagePathToIcon('project', 'foo').equals(new Icon('project', 'foo'))).toEqual(true);
  });
  describe('`pagePath` が絶対パスの時', () => {
    test('カレントプロジェクトのアイコンが指定されている時', () => {
      // `/project/` がトリミングされたものと等価
      expect(pagePathToIcon('project', '/project/foo').equals(new Icon('project', 'foo'))).toEqual(true);
    });
    test('カレントプロジェクト以外のアイコンが指定されている時', () => {
      expect(pagePathToIcon('project', '/other-project/foo').equals(new Icon('other-project', 'foo'))).toEqual(true);
    });
  });
  test('`pagePath` に空白が含まれている時', () => {
    expect(pagePathToIcon('project', 'foo bar').equals(new Icon('project', 'foo bar'))).toEqual(true);
  });
  test('`pagePath` にスラッシュが含まれている時', () => {
    expect(pagePathToIcon('project', 'foo/bar').equals(new Icon('project', 'foo/bar'))).toEqual(true);
  });
  test('`pagePath` に日本語が含まれている時', () => {
    expect(pagePathToIcon('project', '日本語').equals(new Icon('project', '日本語'))).toEqual(true);
  });
});

describe('iconLinkElementToIcon', () => {
  test('カレントプロジェクトのアイコンを表す要素が与えられた時', () => {
    const iconLinkElement = createIconLinkElement('project', 'foo');
    expect(iconLinkElementToIcon('project', iconLinkElement).equals(new Icon('project', 'foo'))).toEqual(true);
  });
  test('カレントプロジェクト以外のアイコンを表す要素が与えられた時', () => {
    const iconLinkElement = createIconLinkElement('other-project', 'foo');
    expect(iconLinkElementToIcon('project', iconLinkElement).equals(new Icon('other-project', 'foo'))).toEqual(true);
  });
  test('空白を含む名前のアイコンを表す要素が与えられた時', () => {
    const iconLinkElement = createIconLinkElement('project', 'foo bar');
    expect(iconLinkElementToIcon('project', iconLinkElement).equals(new Icon('project', 'foo bar'))).toEqual(true);
  });
  test('スラッシュを含む名前のアイコンを表す要素が与えられた時', () => {
    const iconLinkElement = createIconLinkElement('project', 'foo/bar');
    expect(iconLinkElementToIcon('project', iconLinkElement).equals(new Icon('project', 'foo/bar'))).toEqual(true);
  });
  test('日本語を含む名前のアイコンを表す要素が与えられた時', () => {
    const iconLinkElement = createIconLinkElement('project', '日本語');
    expect(iconLinkElementToIcon('project', iconLinkElement).equals(new Icon('project', '日本語'))).toEqual(true);
  });
});

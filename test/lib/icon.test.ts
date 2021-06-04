import { hasDuplicatedPageTitle, Icon, iconLinkElementToIcon, pagePathToIcon } from '../../src/lib/icon';
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

describe('Icon', () => {
  test('ページタイトルに特殊な文字が含まれていない時', () => {
    const icon = new Icon('project', 'foo');
    expect(icon.projectName).toEqual('project');
    expect(icon.pageTitle).toEqual('foo');
    expect(icon.getShortPagePath('project')).toEqual('foo');
    expect(icon.getShortPagePath('other-project')).toEqual('/project/foo');
    expect(icon.fullPagePath).toEqual('/project/foo');
    expect(icon.imgAlt).toEqual('foo');
    expect(icon.imgTitle).toEqual('foo');
    expect(icon.imgSrc).toEqual('/api/pages/project/foo/icon');
    expect(icon.getNotation('project')).toEqual('[foo.icon]');
    expect(icon.getNotation('other-project')).toEqual('[/project/foo.icon]');
    expect(icon.equals(new Icon('project', 'foo'))).toEqual(true);
    expect(icon.equals(new Icon('project', 'bar'))).toEqual(false);
    expect(icon.equals(new Icon('other-project', 'foo'))).toEqual(false);
  });
  test('ページタイトルに空白が含まれている時', () => {
    const icon = new Icon('project', 'foo bar');
    expect(icon.projectName).toEqual('project');
    expect(icon.pageTitle).toEqual('foo bar');
    expect(icon.getShortPagePath('project')).toEqual('foo bar');
    expect(icon.getShortPagePath('other-project')).toEqual('/project/foo bar');
    expect(icon.fullPagePath).toEqual('/project/foo bar');
    expect(icon.imgAlt).toEqual('foo bar');
    expect(icon.imgTitle).toEqual('foo bar');
    expect(icon.imgSrc).toEqual('/api/pages/project/foo%20bar/icon');
    expect(icon.getNotation('project')).toEqual('[foo bar.icon]');
    expect(icon.getNotation('other-project')).toEqual('[/project/foo bar.icon]');
    expect(icon.equals(new Icon('project', 'foo bar'))).toEqual(true);
  });
  test('ページタイトルにスラッシュが含まれている時', () => {
    const icon = new Icon('project', 'foo/bar');
    expect(icon.projectName).toEqual('project');
    expect(icon.pageTitle).toEqual('foo/bar');
    expect(icon.getShortPagePath('project')).toEqual('foo/bar');
    expect(icon.getShortPagePath('other-project')).toEqual('/project/foo/bar');
    expect(icon.fullPagePath).toEqual('/project/foo/bar');
    expect(icon.imgAlt).toEqual('foo/bar');
    expect(icon.imgTitle).toEqual('foo/bar');
    expect(icon.imgSrc).toEqual('/api/pages/project/foo%2Fbar/icon');
    expect(icon.getNotation('project')).toEqual('[foo/bar.icon]');
    expect(icon.getNotation('other-project')).toEqual('[/project/foo/bar.icon]');
    expect(icon.equals(new Icon('project', 'foo/bar'))).toEqual(true);
  });
  test('ページタイトルに日本語が含まれている時', () => {
    const icon = new Icon('project', '日本語');
    expect(icon.projectName).toEqual('project');
    expect(icon.pageTitle).toEqual('日本語');
    expect(icon.getShortPagePath('project')).toEqual('日本語');
    expect(icon.getShortPagePath('other-project')).toEqual('/project/日本語');
    expect(icon.fullPagePath).toEqual('/project/日本語');
    expect(icon.imgAlt).toEqual('日本語');
    expect(icon.imgTitle).toEqual('日本語');
    expect(icon.imgSrc).toEqual('/api/pages/project/%E6%97%A5%E6%9C%AC%E8%AA%9E/icon');
    expect(icon.getNotation('project')).toEqual('[日本語.icon]');
    expect(icon.getNotation('other-project')).toEqual('[/project/日本語.icon]');
    expect(icon.equals(new Icon('project', '日本語'))).toEqual(true);
  });
});

test('hasDuplicatedPageTitle', () => {
  const suggestedIcons: Icon[] = [
    new Icon('project', 'a'),
    new Icon('project', 'b'),
    new Icon('other-project', 'b'),
    new Icon('other-project', 'c'),
  ];
  expect(hasDuplicatedPageTitle(suggestedIcons[0], suggestedIcons)).toEqual(false);
  expect(hasDuplicatedPageTitle(suggestedIcons[1], suggestedIcons)).toEqual(true);
  expect(hasDuplicatedPageTitle(suggestedIcons[2], suggestedIcons)).toEqual(true);
  expect(hasDuplicatedPageTitle(suggestedIcons[3], suggestedIcons)).toEqual(false);
});

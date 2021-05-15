import { iconLinkElementToIcon, pagePathToIcon } from '../../src/lib/icon';
import { createIconLinkElement } from '../helpers/html';

describe('pagePathToIcon', () => {
  test('`pagePath` が相対パスの時', () => {
    expect(pagePathToIcon('project', 'foo')).toStrictEqual({
      pagePath: 'foo',
      imgAlt: 'foo',
      imgTitle: 'foo',
      imgSrc: `/api/pages/project/foo/icon`,
      notation: `[foo.icon]`,
      projectName: 'project',
    });
  });
  describe('`pagePath` が絶対パスの時', () => {
    test('カレントプロジェクトのアイコンが指定されている時', () => {
      // `/project/` がトリミングされる
      expect(pagePathToIcon('project', '/project/foo')).toStrictEqual({
        pagePath: 'foo',
        imgAlt: 'foo',
        imgTitle: 'foo',
        imgSrc: `/api/pages/project/foo/icon`,
        notation: `[foo.icon]`,
        projectName: 'project',
      });
    });
    test('カレントプロジェクト以外のアイコンが指定されている時', () => {
      expect(pagePathToIcon('project', '/other-project/foo')).toStrictEqual({
        // `pagePath` では `/other-project/` がそのまま残る
        pagePath: '/other-project/foo',
        // `imgAlt` などでは `/other-project/` がトリミングされる
        imgAlt: 'foo',
        imgTitle: 'foo',
        imgSrc: `/api/pages/other-project/foo/icon`,
        notation: `[/other-project/foo.icon]`,
        projectName: 'other-project',
      });
    });
  });
  test('`pagePath` に空白が含まれている時', () => {
    expect(pagePathToIcon('project', 'foo bar')).toStrictEqual({
      pagePath: 'foo bar',
      imgAlt: 'foo bar',
      imgTitle: 'foo bar',
      imgSrc: `/api/pages/project/foo%20bar/icon`,
      notation: `[foo bar.icon]`,
      projectName: 'project',
    });
  });
  test('`pagePath` にスラッシュが含まれている時', () => {
    expect(pagePathToIcon('project', 'foo/bar')).toStrictEqual({
      pagePath: 'foo/bar',
      imgAlt: 'foo/bar',
      imgTitle: 'foo/bar',
      imgSrc: `/api/pages/project/foo%2Fbar/icon`,
      notation: `[foo/bar.icon]`,
      projectName: 'project',
    });
  });
  test('`pagePath` に日本語が含まれている時', () => {
    expect(pagePathToIcon('project', '日本語')).toStrictEqual({
      pagePath: '日本語',
      imgAlt: '日本語',
      imgTitle: '日本語',
      imgSrc: `/api/pages/project/%E6%97%A5%E6%9C%AC%E8%AA%9E/icon`,
      notation: `[日本語.icon]`,
      projectName: 'project',
    });
  });
});

describe('iconLinkElementToIcon', () => {
  test('カレントプロジェクトのアイコンを表す要素が与えられた時', () => {
    const iconLinkElement = createIconLinkElement('project', 'foo');
    expect(iconLinkElementToIcon('project', iconLinkElement)).toStrictEqual({
      pagePath: 'foo',
      imgAlt: 'foo',
      imgTitle: 'foo',
      imgSrc: `/api/pages/project/foo/icon`,
      notation: `[foo.icon]`,
      projectName: 'project',
    });
  });
  test('カレントプロジェクト以外のアイコンを表す要素が与えられた時', () => {
    const iconLinkElement = createIconLinkElement('other-project', 'foo');
    expect(iconLinkElementToIcon('project', iconLinkElement)).toStrictEqual({
      pagePath: '/other-project/foo',
      imgAlt: 'foo',
      imgTitle: 'foo',
      imgSrc: `/api/pages/other-project/foo/icon`,
      notation: `[/other-project/foo.icon]`,
      projectName: 'other-project',
    });
  });
  test('空白を含む名前のアイコンを表す要素が与えられた時', () => {
    const iconLinkElement = createIconLinkElement('project', 'foo bar');
    expect(iconLinkElementToIcon('project', iconLinkElement)).toStrictEqual({
      pagePath: 'foo bar',
      imgAlt: 'foo bar',
      imgTitle: 'foo bar',
      imgSrc: `/api/pages/project/foo%20bar/icon`,
      notation: `[foo bar.icon]`,
      projectName: 'project',
    });
  });
  test('スラッシュを含む名前のアイコンを表す要素が与えられた時', () => {
    const iconLinkElement = createIconLinkElement('project', 'foo/bar');
    expect(iconLinkElementToIcon('project', iconLinkElement)).toStrictEqual({
      pagePath: 'foo/bar',
      imgAlt: 'foo/bar',
      imgTitle: 'foo/bar',
      imgSrc: `/api/pages/project/foo%2Fbar/icon`,
      notation: `[foo/bar.icon]`,
      projectName: 'project',
    });
    expect(pagePathToIcon('project', 'foo/bar')).toStrictEqual({
      pagePath: 'foo/bar',
      imgAlt: 'foo/bar',
      imgTitle: 'foo/bar',
      imgSrc: `/api/pages/project/foo%2Fbar/icon`,
      notation: `[foo/bar.icon]`,
      projectName: 'project',
    });
  });
  test('日本語を含む名前のアイコンを表す要素が与えられた時', () => {
    const iconLinkElement = createIconLinkElement('project', '日本語');
    expect(iconLinkElementToIcon('project', iconLinkElement)).toStrictEqual({
      pagePath: '日本語',
      imgAlt: '日本語',
      imgTitle: '日本語',
      imgSrc: `/api/pages/project/%E6%97%A5%E6%9C%AC%E8%AA%9E/icon`,
      notation: `[日本語.icon]`,
      projectName: 'project',
    });
  });
});

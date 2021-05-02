import { calcCursorPosition, scanIconsFromEditor, scanUniqueIconsFromEditor } from '../../src/lib/scrapbox';
import { htmlToHTMLElement } from '../helpers/html';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const editor = htmlToHTMLElement(`
<div class="editor>
  <a class="link icon" rel="route" href="/project/foo">
    <img class="icon" alt="foo" title="foo" src="/api/pages/project/foo/icon" />
  </a>
  <a class="link icon" rel="route" href="/project/bar">
    <img class="icon" alt="bar" title="bar" src="/api/pages/project/bar/icon" />
  </a>
  <a class="link icon" rel="route" href="/project/baz">
    <img class="icon" alt="baz" title="baz" src="/api/pages/project/baz/icon" />
  </a>
  <a class="link icon" rel="route" href="/project/foo">
    <img class="icon" alt="foo" title="foo" src="/api/pages/project/foo/icon" />
  </a>
  <a class="link icon" rel="route" href="/other-project/foo">
    <img class="icon" alt="foo" title="foo" src="/api/pages/other-project/foo/icon" />
  </a>
  <a class="link icon" rel="route" href="/other-project/bar">
    <img class="icon" alt="bar" title="bar" src="/api/pages/other-project/bar/icon" />
  </a>
  <a class="link icon" rel="route" href="/other-project/baz">
    <img class="icon" alt="baz" title="baz" src="/api/pages/other-project/baz/icon" />
  </a>
  <a class="link icon" rel="route" href="/other-project/foo">
    <img class="icon" alt="foo" title="foo" src="/api/pages/other-project/foo/icon" />
  </a>
</div>
`)!;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const cursor = htmlToHTMLElement(`
  <div class="cursor" style="top: 147px; left: 0px; height: 28px; display: none;"></div>
`)!;

test('scanIconsFromEditor', () => {
  const expectedIcons = scanIconsFromEditor('project', editor);
  console.log(expectedIcons);

  const expectedIconPagePaths = expectedIcons.map((icon) => icon.pagePath);
  expect(expectedIconPagePaths).toStrictEqual([
    'foo',
    'bar',
    'baz',
    'foo',
    '/other-project/foo',
    '/other-project/bar',
    '/other-project/baz',
    '/other-project/foo',
  ]);
});

test('scanUniqueIconsFromEditor', () => {
  const expectedIcons = scanUniqueIconsFromEditor('project', editor);
  const expectedIconPagePaths = expectedIcons.map((icon) => icon.pagePath);
  expect(expectedIconPagePaths).toStrictEqual([
    'foo',
    'bar',
    'baz',
    '/other-project/foo',
    '/other-project/bar',
    '/other-project/baz',
  ]);
});

test('calcCursorPosition', () => {
  const position = calcCursorPosition(window, cursor);
  expect(position).toStrictEqual({
    styleTop: 147,
    styleLeft: 0,
  });
});

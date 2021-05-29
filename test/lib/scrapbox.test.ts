import { calcCursorPosition, scanIconsFromEditor } from '../../src/lib/scrapbox';
import { createEditor, createIconLinkElement, createCursor } from '../helpers/html';

const editor = createEditor();
editor.appendChild(createIconLinkElement('project', 'foo'));
editor.appendChild(createIconLinkElement('project', 'bar'));
editor.appendChild(createIconLinkElement('project', 'baz'));
editor.appendChild(createIconLinkElement('project', 'foo'));
editor.appendChild(createIconLinkElement('other-project', 'foo'));
editor.appendChild(createIconLinkElement('other-project', 'bar'));
editor.appendChild(createIconLinkElement('other-project', 'baz'));
editor.appendChild(createIconLinkElement('other-project', 'foo'));

const cursor = createCursor({ styleTop: 147, styleLeft: 0 });

test('scanIconsFromEditor', () => {
  const expectedIcons = scanIconsFromEditor('project', editor);

  const expectedIconPagePaths = expectedIcons.map((icon) => icon.getShortPagePath('project'));
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

test('calcCursorPosition', () => {
  const position = calcCursorPosition(cursor);
  expect(position).toStrictEqual({
    styleTop: 147,
    styleLeft: 0,
  });
});

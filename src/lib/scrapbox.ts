import type { CursorPosition } from '../types';
import type { Icon } from './icon';
import { iconLinkElementToIcon } from './icon';

export function scanEmbeddedIcons(projectName: string, editor: HTMLElement): Icon[] {
  const iconLinkElements = Array.from(editor.querySelectorAll<HTMLAnchorElement>('a.link.icon'));
  return iconLinkElements.map((iconLinkElement) => iconLinkElementToIcon(projectName, iconLinkElement));
}

export function calcCursorPosition(cursor: HTMLElement): CursorPosition {
  const top = +cursor.style.top.slice(0, -2);
  const left = +cursor.style.left.slice(0, -2);
  return {
    styleTop: top,
    styleLeft: left,
  };
}

export function getEditor(): HTMLElement {
  const editor = document.querySelector<HTMLElement>('.editor');
  if (editor) return editor;
  throw new Error('.editor が存在しません');
}

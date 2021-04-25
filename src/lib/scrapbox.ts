import { CursorPosition, Icon } from '../types';
import { uniqBy } from './collection';
import { iconLinkElementToIcon } from './icon';

export function scanUniqueIconsFromEditor(projectName: string, editor: HTMLElement): Icon[] {
  return uniqBy(scanIconsFromEditor(projectName, editor), (icon) => icon.pagePath);
}

export function scanIconsFromEditor(projectName: string, editor: HTMLElement): Icon[] {
  const iconLinkElements = Array.from(editor.querySelectorAll<HTMLAnchorElement>('a.link.icon'));
  return iconLinkElements.map((iconLinkElement) => iconLinkElementToIcon(projectName, iconLinkElement));
}

export function calcCursorPosition(window: Window, cursor: HTMLElement): CursorPosition {
  const top = +cursor.style.top.slice(0, -2);
  const left = +cursor.style.left.slice(0, -2);
  return {
    left: window.scrollY + cursor.getBoundingClientRect().left,
    styleTop: top,
    styleLeft: left,
  };
}

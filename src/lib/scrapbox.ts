import type { CursorPosition } from '../types';
import type { Icon } from './icon';
import { iconLinkElementToIcon } from './icon';

export function getCursorLine(editor: HTMLElement): { element: HTMLElement; index: number } | undefined {
  const cursorLine = editor.querySelector<HTMLElement>('.line.cursor-line');
  if (!cursorLine) return undefined;
  const id = cursorLine.id.slice(1);
  const index = scrapbox.Page.lines.findIndex((line) => line.id === id);
  return { element: cursorLine, index };
}

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

// https://scrapbox.io/customize/scrapbox-insert-text よりコピペ。
// Thanks @takker99!
export function insertText(textInput: HTMLTextAreaElement, text: string) {
  textInput.focus();
  textInput.value = text;
  const uiEvent = document.createEvent('UIEvent');
  // oxlint-disable-next-line typescript/no-deprecated
  uiEvent.initEvent('input', true, false);
  textInput.dispatchEvent(uiEvent);
}

export function getEditor(): HTMLElement {
  const editor = document.querySelector<HTMLElement>('.editor');
  if (editor) return editor;
  throw new Error('.editor が存在しません');
}

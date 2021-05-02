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
    styleTop: top,
    styleLeft: left,
  };
}

// https://scrapbox.io/customize/scrapbox-insert-text よりコピペ。
// Thanks @takker99!
export function insertText(textInput: HTMLTextAreaElement, text: string) {
  textInput.focus();
  const start = textInput.selectionStart;
  textInput.setRangeText(text);
  textInput.selectionStart = textInput.selectionEnd = start + text.length;
  const uiEvent = document.createEvent('UIEvent');
  uiEvent.initEvent('input', true, false);
  textInput.dispatchEvent(uiEvent);
}

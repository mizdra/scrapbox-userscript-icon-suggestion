import { useCallback, useEffect, useState } from 'preact/hooks';
import { iconLinkElementToIcon, type Icon } from '../lib/icon';

export type CursorPosition = {
  /** カーソルのある行の ID */
  lineId: string;
  /** カーソルのある文字のインデックス (0-based)。行の末尾にある場合は、その行の文字数と同じ値になる。 */
  char: number;
  /** ページの上端からの距離 */
  top: number;
  /** ページの左端からの距離 */
  left: number;
};

export type Scrapbox = {
  layout: string;
  projectName: string;
  getCursorPosition: () => CursorPosition | undefined;
  /**
   * 指定した位置にカーソルを移動させる。
   * @returns カーソルの移動に成功したかどうか。カーソルのあった行が削除されている場合は失敗する。
   */
  focus: (position: CursorPosition) => Promise<boolean>;
  blur: () => void;
  /** カーソルのある位置にテキストを挿入する */
  insertText: (text: string) => void;
  getEmbeddedIcons: () => Icon[];
};

/** Scrapbox のインターフェイスにアクセスするための hooks */
export function useScrapbox(): Scrapbox {
  const [layout, setLayout] = useState(scrapbox.Layout);
  const [projectName, setProjectName] = useState(scrapbox.Project.name);

  useEffect(() => {
    // 画面遷移により layout や projectName は変わりうるので、変更を監視する
    const onLayoutChanged = () => setLayout(scrapbox.Layout);
    const onProjectChanged = () => setProjectName(scrapbox.Project.name);
    scrapbox.addListener('layout:changed', onLayoutChanged);
    scrapbox.addListener('project:changed', onProjectChanged);
    return () => {
      scrapbox.removeListener('layout:changed', onLayoutChanged);
      scrapbox.removeListener('project:changed', onProjectChanged);
    };
  }, []);

  const getCursorPosition = useCallback((): CursorPosition | undefined => {
    const cursor = document.querySelector<HTMLDivElement>('.cursor')!;
    const cursorRect = cursor.getBoundingClientRect();
    const top = cursorRect.top + window.scrollY;
    const left = cursorRect.left + window.scrollX;
    const lines = Array.from(document.querySelectorAll('.lines .line'));
    const cursorLine = lines.find((line) => line.classList.contains('cursor-line'));
    if (!cursorLine) return undefined;

    const chars = Array.from(cursorLine.querySelectorAll<HTMLElement>('.char-index'));
    for (const char of chars) {
      const charRect = char.getBoundingClientRect();
      if (charRect.left <= cursorRect.left && cursorRect.left <= charRect.right) {
        return { lineId: cursorLine.id, char: +char.dataset.charIndex!, top, left };
      }
    }
    return { lineId: cursorLine.id, char: chars.length, top, left };
  }, []);
  const focus = useCallback(async (position: CursorPosition) => {
    // NOTE: 古い Cosense では .pointer-event にクラス名が付いていないので、has() セレクタでも取得する
    const pointerEvent = document.querySelector<HTMLElement>('.pointer-event, div:has(> .lines)')!;
    const lines = Array.from(document.querySelectorAll('.lines .line'));
    const targetLine = lines.find((line) => line.id === position.lineId);
    if (!targetLine) return false;
    const targetLineRect = targetLine.getBoundingClientRect();

    // まずその行の末尾にフォーカスして、行全体をテキスト化させる。
    // そうしないとアイコン記法などが画像化されたままになってしまい、
    // 正確な位置にカーソルを移動させることができない。
    click(pointerEvent, targetLineRect.right - 1, targetLineRect.top + targetLineRect.height / 2);

    // 次に文字位置にフォーカスする。
    // NOTE: 文字位置が行の末尾を超えている場合は何もしない (行の末尾にフォーカスしたまま)。
    const chars = Array.from(targetLine.querySelectorAll<HTMLElement>('.char-index'));
    const targetChar = chars[position.char];
    if (targetChar) {
      const targetCharRect = targetChar.getBoundingClientRect();
      click(pointerEvent, targetCharRect.left + 1, targetCharRect.top + targetCharRect.height / 2);
    }
    // textarea にフォーカスが移動するのを待つ
    await new Promise(requestAnimationFrame);
    return true;
  }, []);
  const blur = useCallback(() => {
    const textInput = document.querySelector<HTMLTextAreaElement>('#text-input')!;
    textInput.blur();
  }, []);

  // https://scrapbox.io/customize/scrapbox-insert-text よりコピペ。
  // Thanks @takker99!
  const insertText = useCallback((text: string) => {
    const textInput = document.querySelector<HTMLTextAreaElement>('#text-input')!;
    textInput.focus();
    textInput.value = text;
    const uiEvent = document.createEvent('UIEvent');
    // oxlint-disable-next-line typescript/no-deprecated
    uiEvent.initEvent('input', true, false);
    textInput.dispatchEvent(uiEvent);
  }, []);
  const getEmbeddedIcons = useCallback(() => {
    const editor = document.querySelector<HTMLElement>('.editor')!;
    const iconLinkElements = Array.from(editor.querySelectorAll<HTMLAnchorElement>('a.link.icon'));
    return iconLinkElements.map((iconLinkElement) => iconLinkElementToIcon(projectName, iconLinkElement));
  }, [projectName]);

  return {
    layout,
    projectName,
    getCursorPosition,
    focus,
    blur,
    insertText,
    getEmbeddedIcons,
  };
}

function click(element: HTMLElement, clientX: number, clientY: number) {
  element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0, clientX, clientY }));
  element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, button: 0, clientX, clientY }));
}

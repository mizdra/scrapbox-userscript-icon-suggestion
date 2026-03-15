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

type Scrapbox = {
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
    // 行内の文字 の BoundingClientRect を見て、カーソルの位置から最も近い文字を探す。
    // カーソルが文字の中央より左側にある場合はその文字を、右側にある場合は次以降の文字を指すものとする。
    for (const char of chars) {
      const charRect = char.getBoundingClientRect();
      // NOTE: カーソルは必ずしも文字の境界にあるとは限らない (`iiii` と書かれた行で動作確認するとわかりやすい)。
      // そこで文字の中央を基準にしてカーソルがどちら側にあるかを判定する。
      // NOTE: 文字が多い行では折り返しが発生している可能性があるため、文字の位置がカーソルと同じ行にあるかどうかも判定する必要がある。
      if (cursorRect.top <= charRect.top && cursorRect.left < charRect.left + charRect.width / 2) {
        return { lineId: cursorLine.id, char: +char.dataset.charIndex!, top, left };
      }
    }
    return { lineId: cursorLine.id, char: chars.length, top, left };
  }, []);
  const focus = useCallback(async (position: CursorPosition) => {
    // https://scrapbox.io/assets/index.js を読むと、Cosense では .pointer-event の mouseup/mousedown イベントで
    // フォーカスを制御していることがわかる。ここではそれを逆手にとって、擬似的に同じイベントを dispatch させて、
    // エディタにフォーカスさせる。

    // .pointer-event 要素を取得する。古い Cosense では .pointer-event にクラス名が付いていないので、has() セレクタでも取得する。
    const pointerEvent = document.querySelector<HTMLElement>('.pointer-event, div:has(> .lines)')!;

    // フォーカスすべき行を計算する
    const lines = Array.from(document.querySelectorAll('.lines .line'));
    const targetLine = lines.find((line) => line.id === position.lineId);
    if (!targetLine) return false;
    const targetLineRect = targetLine.getBoundingClientRect();

    // 目的の位置にフォーカスする前に、まずはその行の右端にフォーカスして、行全体をテキスト化させる。
    // そうしないとアイコン記法などが画像化されたままになってしまい、正確な位置にカーソルを移動させることができない。
    focusEditor(pointerEvent, targetLineRect.right - 1, targetLineRect.top + targetLineRect.height / 2);

    // 改めて目的の位置にフォーカスする。
    const chars = Array.from(targetLine.querySelectorAll<HTMLElement>('.char-index'));
    // NOTE: 空行では `chars` は長さ 1 の配列になるので、空行でも targetChar は取得できる。
    const targetChar = chars[position.char];
    if (targetChar) {
      const targetCharRect = targetChar.getBoundingClientRect();
      focusEditor(pointerEvent, targetCharRect.left, targetCharRect.top + targetCharRect.height / 2);
    } else {
      const lastCharRect = chars[chars.length - 1]!.getBoundingClientRect();
      // targetChar が見つからない、かつ行に文字がある場合は、行末へのフォーカスする
      focusEditor(pointerEvent, lastCharRect.right, lastCharRect.top + lastCharRect.height / 2);
    }
    // #text-input にフォーカスが移動するのは requestAnimationFrame の後なので、それを待つ
    await new Promise(requestAnimationFrame);
    return true;
  }, []);
  const blur = useCallback(() => {
    const textInput = document.querySelector<HTMLTextAreaElement>('#text-input')!;
    textInput.blur();
  }, []);
  const insertText = useCallback((text: string) => {
    // https://scrapbox.io/assets/index.js を読むと、#text-input の input イベントでテキストの入力を検知し、
    // エディタにテキストが挿入されることがわかる。ここではそれを逆手にとって、#text-input に
    // 擬似的に input イベントを dispatch させて、エディタにテキストを挿入させる。
    const textInput = document.querySelector<HTMLTextAreaElement>('#text-input')!;
    textInput.value = text;
    const event = new InputEvent('input', {
      bubbles: true,
      cancelable: false,
      inputType: 'insertText',
      data: text,
    });
    textInput.dispatchEvent(event);
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

/**
 * 指定した位置にカーソルをフォーカスする。
 * @param x フォーカスする位置の x 座標 (layout viewport の左端からの距離)
 * @param y フォーカスする位置の y 座標 (layout viewport の上端からの距離)
 */
function focusEditor(pointerEvent: HTMLElement, x: number, y: number) {
  const eventInitDict = {
    bubbles: true,
    cancelable: true,
    button: 0,
    // clientX, clientY は仕様上は viewport の左上からの相対座標とされているが、
    // 実際には、layout viewport の左上からの相対座標にスクロール量を加算したものである。
    // そこで、スクロール量を加算して clientX, clientY を計算する。
    clientX: window.scrollX + x,
    clientY: window.scrollY + y,
  };
  // mousedown イベントだけだと 範囲選択モードになってしまうため、mouseup イベントも dispatch する
  pointerEvent.dispatchEvent(new MouseEvent('mousedown', eventInitDict));
  pointerEvent.dispatchEvent(new MouseEvent('mouseup', eventInitDict));
}

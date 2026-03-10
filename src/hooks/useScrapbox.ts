import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';
import { ScrapboxContext } from '../contexts/ScrapboxContext';

export type CursorIndex = {
  line: number;
  char: number;
};

export type UseScrapboxResult = {
  layout: string;
  projectName: string;
  editor: HTMLElement;
  cursor: HTMLDivElement;
  textInput: HTMLTextAreaElement;
  getCursorIndex: () => CursorIndex | undefined;
  focus: (index: CursorIndex) => Promise<void>;
};

/** Scrapbox のインターフェイスにアクセスするための hooks */
export function useScrapbox(): UseScrapboxResult {
  const { scrapbox, editor } = useContext(ScrapboxContext);
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
  }, [scrapbox]);

  const cursor = useMemo(() => {
    const el = editor.querySelector<HTMLDivElement>('.cursor');
    if (!el) throw new Error('.cursor が存在しません');
    return el;
  }, [editor]);
  const textInput = useMemo(() => {
    const el = editor.querySelector<HTMLTextAreaElement>('#text-input');
    if (!el) throw new Error('#text-input が存在しません');
    return el;
  }, [editor]);
  const pointerEvent = useMemo(() => {
    const el = document.querySelector<HTMLElement>('.pointer-event');
    if (!el) throw new Error('.pointer-event が存在しません');
    return el;
  }, []);
  const getCursorIndex = useCallback(() => {
    const lines = Array.from(document.querySelectorAll('.lines .line'));
    const cursorLine = lines.find((line) => line.classList.contains('cursor-line'));
    if (!cursorLine) return undefined;
    const lineIndex = lines.indexOf(cursorLine);
    const chars = Array.from(cursorLine.querySelectorAll<HTMLElement>('.char-index'));
    const cursorRect = cursor.getBoundingClientRect();
    for (const char of chars) {
      const charRect = char.getBoundingClientRect();
      if (charRect.left <= cursorRect.left && cursorRect.left <= charRect.right) {
        return { line: lineIndex, char: +char.dataset.charIndex! };
      }
    }
    return { line: lineIndex, char: chars.length };
  }, [cursor]);
  const focus = useCallback(
    async (index: CursorIndex) => {
      const lines = Array.from(document.querySelectorAll('.lines .line'));
      const targetLine = lines[index.line];
      if (!targetLine) return;
      const targetLineRect = targetLine.getBoundingClientRect();

      // まずその行の末尾にフォーカスして、行全体をテキスト化させる。
      // そうしないとアイコン記法などが画像化されたままになってしまい、
      // 正確な位置にカーソルを移動させることができない。
      click(pointerEvent, targetLineRect.right - 1, targetLineRect.top + targetLineRect.height / 2);

      // 次に文字位置にフォーカスする。
      // NOTE: 文字位置が行の末尾を超えている場合は何もしない (行の末尾にフォーカスしたまま)。
      const chars = Array.from(targetLine.querySelectorAll<HTMLElement>('.char-index'));
      const targetChar = chars[index.char];
      if (targetChar) {
        const targetCharRect = targetChar.getBoundingClientRect();
        click(pointerEvent, targetCharRect.left + 1, targetCharRect.top + targetCharRect.height / 2);
      }
      // textarea にフォーカスが移動するのを待つ
      await new Promise(requestAnimationFrame);
    },
    [pointerEvent],
  );

  return { layout, projectName, editor, cursor, textInput, getCursorIndex, focus };
}

function click(element: HTMLElement, clientX: number, clientY: number) {
  element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0, clientX, clientY }));
  element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, button: 0, clientX, clientY }));
}

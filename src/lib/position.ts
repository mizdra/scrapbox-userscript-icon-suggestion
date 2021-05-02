import { JSXInternal } from 'preact/src/jsx';
import { CursorPosition } from '../types';

/** .popup-menu のスタイルを計算する */
export function calcPopupMenuStyle(cursorPosition: CursorPosition): JSXInternal.CSSProperties {
  return { top: cursorPosition.styleTop };
}

/** .triangle のスタイルを計算する */
export function calcTrianglePosition(cursorPosition: CursorPosition, isEmpty: boolean): JSXInternal.CSSProperties {
  return {
    left: cursorPosition.styleLeft,
    ...(isEmpty
      ? {
          borderTopColor: '#555',
        }
      : {}),
  };
}

/** .button-container のスタイルを計算する */
export function calcButtonContainerPosition(
  editorWidth: number,
  buttonContainerWidth: number,
  cursorPosition: CursorPosition,
  isEmpty: boolean,
): JSXInternal.CSSProperties {
  const translateX = (cursorPosition.styleLeft / editorWidth) * 100;
  // 端に寄り過ぎないように、translateX の上限・下限を設定しておく。
  // 値はフィーリングで決めており、何かに裏打ちされたものではないので、変えたかったら適当に変える。
  const minTranslateX = (20 / buttonContainerWidth) * 100;
  const maxTranslateX = 100 - minTranslateX;

  return {
    left: cursorPosition.styleLeft,
    transform: `translateX(-${Math.max(minTranslateX, Math.min(translateX, maxTranslateX))}%)`,
    ...(isEmpty
      ? {
          color: '#eee',
          fontSize: '11px',
          display: 'inline-block',
          padding: '0 5px',
          cursor: 'not-allowed',
          backgroundColor: '#555',
        }
      : {}),
  };
}

/** <QueryInput> のスタイルを計算する */
export function calcQueryInputPosition(editorWidth: number, cursorPosition: CursorPosition): JSXInternal.CSSProperties {
  const translateX = (cursorPosition.styleLeft / editorWidth) * 100;

  return {
    position: 'absolute',
    top: cursorPosition.styleTop,
    left: cursorPosition.styleLeft,
    transform: `translateX(-${translateX}%)`,
  };
}

import { JSXInternal } from 'preact/src/jsx';
import { CursorPosition } from '../types';

export function calcPopupMenuStyle(cursorPosition: CursorPosition): JSXInternal.CSSProperties {
  return { top: cursorPosition.styleTop };
}

export function calcTrianglePosition(cursorPosition: CursorPosition): JSXInternal.CSSProperties {
  return { left: cursorPosition.styleLeft };
}

export function calcButtonContainerPosition(
  editorWidth: number,
  buttonContainerWidth: number,
  cursorPosition: CursorPosition,
): JSXInternal.CSSProperties {
  const translateX = (cursorPosition.styleLeft / editorWidth) * 100;
  // 端に寄り過ぎないように、translateX の上限・下限を設定しておく。
  // 値はフィーリングで決めており、何かに裏打ちされたものではないので、変えたかったら適当に変える。
  const minTranslateX = (20 / buttonContainerWidth) * 100;
  const maxTranslateX = 100 - minTranslateX;

  return {
    left: cursorPosition.styleLeft,
    transform: `translateX(-${Math.max(minTranslateX, Math.min(translateX, maxTranslateX))}%)`,
  };
}

export function calcQueryInputPosition(editorWidth: number, cursorPosition: CursorPosition): JSXInternal.CSSProperties {
  const translateX = (cursorPosition.styleLeft / editorWidth) * 100;

  return {
    position: 'absolute',
    top: cursorPosition.styleTop,
    left: cursorPosition.styleLeft,
    transform: `translateX(-${translateX}%)`,
  };
}

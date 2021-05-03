import {
  calcButtonContainerStyle,
  calcPopupMenuStyle,
  calcQueryInputStyle,
  calcTriangleStyle,
} from '../../src/lib/calc-style';

describe('calcPopupMenuStyle', () => {
  test('.cursor の top プロパティがそのまま .popup-menu の top プロパティになる', () => {
    expect(calcPopupMenuStyle({ styleTop: 10, styleLeft: 20 })).toStrictEqual({
      top: 10,
    });
  });
});

describe('calcTriangleStyle', () => {
  test('.cursor の left プロパティがそのまま .popup-menu の left プロパティになる', () => {
    expect(calcTriangleStyle({ styleTop: 10, styleLeft: 20 }, false)).toStrictEqual({
      left: 20,
    });
  });
  test('isEmpty === true の時、ボーダーカラーが上書きされる', () => {
    expect(calcTriangleStyle({ styleTop: 10, styleLeft: 20 }, true)).toStrictEqual({
      left: 20,
      borderTopColor: '#555',
    });
  });
});

describe('calcButtonContainerStyle', () => {
  const editorWidth = 1000;
  const buttonContainerWidth = 50;
  const cursorPositionStyleTop = 200;
  test('エディタの中央にカーソルがあれば、.button-container を中央に表示するスタイルが返される', () => {
    expect(
      calcButtonContainerStyle(
        editorWidth,
        buttonContainerWidth,
        { styleTop: cursorPositionStyleTop, styleLeft: 500 },
        false,
      ),
    ).toStrictEqual({
      left: 500,
      transform: `translateX(-50%)`,
    });
  });
  describe('エディタの左側にカーソルがあれば、.button-container を左側に表示するスタイルが返される', () => {
    expect(
      calcButtonContainerStyle(
        editorWidth,
        buttonContainerWidth,
        { styleTop: cursorPositionStyleTop, styleLeft: 400 },
        false,
      ),
    ).toStrictEqual({
      left: 400,
      transform: `translateX(-40%)`,
    });
    test('.button-container が左側に寄りすぎてウインドウからはみ出ないよう、一定以上は左に寄らないようになっている', () => {
      expect(
        calcButtonContainerStyle(
          editorWidth,
          buttonContainerWidth,
          { styleTop: cursorPositionStyleTop, styleLeft: 399 },
          false,
        ),
      ).toStrictEqual({
        left: 399,
        transform: `translateX(-40%)`,
      });
    });
  });
  describe('エディタの右側にカーソルがあれば、.button-container を右側に表示するスタイルが返される', () => {
    expect(
      calcButtonContainerStyle(
        editorWidth,
        buttonContainerWidth,
        { styleTop: cursorPositionStyleTop, styleLeft: 600 },
        false,
      ),
    ).toStrictEqual({
      left: 600,
      transform: `translateX(-60%)`,
    });
    test('.button-container が右側に寄りすぎてウインドウからはみ出ないよう、一定以上は右に寄らないようになっている', () => {
      expect(
        calcButtonContainerStyle(
          editorWidth,
          buttonContainerWidth,
          { styleTop: cursorPositionStyleTop, styleLeft: 601 },
          false,
        ),
      ).toStrictEqual({
        left: 601,
        transform: `translateX(-60%)`,
      });
    });
  });
  test('isEmpty === true の時、ボタンが無いことを視覚的に表現するためのスタイルが返される', () => {
    expect(
      calcButtonContainerStyle(
        editorWidth,
        buttonContainerWidth,
        { styleTop: cursorPositionStyleTop, styleLeft: 500 },
        true,
      ),
    ).toStrictEqual({
      left: 500,
      transform: `translateX(-50%)`,
      color: '#eee',
      fontSize: '11px',
      display: 'inline-block',
      padding: '0 5px',
      cursor: 'not-allowed',
      backgroundColor: '#555',
    });
  });
});

describe('calcQueryInputStyle', () => {
  const editorWidth = 1000;
  const cursorPositionStyleTop = 200;
  test('エディタの中央にカーソルがあれば、<QueryInput> を中央に表示するスタイルが返される', () => {
    expect(calcQueryInputStyle(editorWidth, { styleTop: cursorPositionStyleTop, styleLeft: 500 })).toStrictEqual({
      position: 'absolute',
      top: cursorPositionStyleTop,
      left: 500,
      transform: `translateX(-50%)`,
    });
  });
  test('エディタの左側にカーソルがあれば、<QueryInput> を左側に表示するスタイルが返される', () => {
    expect(calcQueryInputStyle(editorWidth, { styleTop: cursorPositionStyleTop, styleLeft: 100 })).toStrictEqual({
      position: 'absolute',
      top: cursorPositionStyleTop,
      left: 100,
      transform: `translateX(-10%)`,
    });
  });
  test('エディタの右側にカーソルがあれば、<QueryInput> を右側に表示するスタイルが返される', () => {
    expect(calcQueryInputStyle(editorWidth, { styleTop: cursorPositionStyleTop, styleLeft: 900 })).toStrictEqual({
      position: 'absolute',
      top: cursorPositionStyleTop,
      left: 900,
      transform: `translateX(-90%)`,
    });
  });
});
